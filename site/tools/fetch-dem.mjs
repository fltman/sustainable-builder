#!/usr/bin/env node
// Ground heights for the flood: Lantmäteriet's Markhöjdmodell (1 m grid, RH 2000, CC BY 4.0) sampled onto
// the model's own grid and written to .cache/dem/dem.bin (+ dem.json); tools/flood-map.mjs then makes the
// flood map the site draws from (public/terrain/flood.png).
//   node tools/fetch-dem.mjs      (asks for the Geotorget login; or set LANTMATERIET_USER / LANTMATERIET_PASSWORD)
// The data is free but the download server wants a Geotorget login (Basic auth). The files are
// cloud-optimised GeoTIFFs, so only the 512×512 blocks under the model area are fetched (range
// requests), and the 1 m window is cached in .cache/dem/ so later runs need no login.
//   node tools/fetch-dem.mjs --cached      rebuild dem.bin from the cache only
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { inflateSync } from 'node:zlib';
import { createInterface } from 'node:readline/promises';

const STAC='https://api.lantmateriet.se/stac-hojd/v1/search';
// Model area (model metres: x east, z south, origin near Stortorget) and output step.
const AREA={x0:-1720,x1:520,z0:-460,z1:660},STEP=2;
const CACHE=new URL('../.cache/dem/',import.meta.url),OUT=CACHE;

// --- Model metres ↔ WGS84 (the projection of tools/import-addresses.mjs, inverted) ---------------
const LAT0=56.66412,LON0=16.3656,AR=28.2*Math.PI/180,M=111320;
const toLatLon=(x,z)=>{const y=-z,e=x*Math.cos(AR)-y*Math.sin(AR),n=x*Math.sin(AR)+y*Math.cos(AR);
  return [LAT0+n/M,LON0+e/(M*Math.cos(LAT0*Math.PI/180))];};
// --- WGS84 → SWEREF 99 TM (Gauss–Krüger, Lantmäteriet's formulas) -------------------------------
const sweref=(lat,lon)=>{
  const a=6378137,f=1/298.257222101,k0=.9996,FE=5e5,l0=15*Math.PI/180;
  const e2=f*(2-f),n=f/(2-f),ar=a/(1+n)*(1+n*n/4+n**4/64);
  const A=e2,B=(5*e2**2-e2**3)/6,C=(104*e2**3-45*e2**4)/120,D=1237*e2**4/1260;
  const b=[n/2-2*n*n/3+5*n**3/16+41*n**4/180,13*n*n/48-3*n**3/5+557*n**4/1440,61*n**3/240-103*n**4/140,49561*n**4/161280];
  const p=lat*Math.PI/180,s=Math.sin(p),ps=p-s*Math.cos(p)*(A+B*s**2+C*s**4+D*s**6),dl=lon*Math.PI/180-l0;
  const xi=Math.atan(Math.tan(ps)/Math.cos(dl)),eta=Math.atanh(Math.cos(ps)*Math.sin(dl));
  let N=xi,E=eta;b.forEach((bk,i)=>{const k=2*(i+1);N+=bk*Math.sin(k*xi)*Math.cosh(k*eta);E+=bk*Math.cos(k*xi)*Math.sinh(k*eta);});
  return [k0*ar*N,k0*ar*E+FE];
};

// --- The 1 m window in SWEREF that covers the model area ------------------------------------------
const corners=[[AREA.x0,AREA.z0],[AREA.x1,AREA.z0],[AREA.x0,AREA.z1],[AREA.x1,AREA.z1]].map(([x,z])=>sweref(...toLatLon(x,z)));
const W={n1:Math.ceil(Math.max(...corners.map(c=>c[0])))+4,n0:Math.floor(Math.min(...corners.map(c=>c[0])))-4,
         e0:Math.floor(Math.min(...corners.map(c=>c[1])))-4,e1:Math.ceil(Math.max(...corners.map(c=>c[1])))+4};
const ww=W.e1-W.e0,wh=W.n1-W.n0;
const NODATA=-9999;

let win,sources;
if(process.argv.includes('--cached')){
  const meta=JSON.parse(readFileSync(new URL('window.json',CACHE),'utf8'));
  if(meta.e0!==W.e0||meta.n1!==W.n1||meta.w!==ww||meta.h!==wh)throw new Error('cache window differs from AREA; fetch again');
  win=new Float32Array(readFileSync(new URL('window.f32',CACHE)).buffer.slice(0));sources=meta.sources;
}else{
  // The login is asked for when it isn't in the environment; the password is not echoed.
  const ask=async q=>{const rl=createInterface({input:process.stdin,output:process.stdout});const a=await rl.question(q);rl.close();return a.trim();};
  // Hidden input: read the keys in raw mode (backspace works, Ctrl-C quits).
  const askHidden=q=>{const {stdin,stdout}=process;if(!stdin.isTTY)return ask(q);
    stdout.write(q);stdin.setRawMode(true);stdin.setEncoding('utf8');stdin.resume();
    return new Promise(done=>{let s='';const on=keys=>{for(const c of keys){
      if(c==='\r'||c==='\n'){stdin.off('data',on);stdin.setRawMode(false);stdin.pause();stdout.write('\n');return done(s);}
      if(c==='\u0003'){stdin.setRawMode(false);stdout.write('\n');process.exit(130);}
      if(c==='\u007f'||c==='\b')s=s.slice(0,-1);else s+=c;}};stdin.on('data',on);});};
  const user=process.env.LANTMATERIET_USER||await ask('Geotorget-användare (e-post): ');
  const pass=process.env.LANTMATERIET_PASSWORD||await askHidden('Lösenord: ');
  if(!user||!pass)throw new Error('needs your Geotorget login');
  const auth='Basic '+Buffer.from(`${user}:${pass}`).toString('base64');
  // Which 10×10 km files cover the window.
  const sw=toLatLon(AREA.x0,AREA.z1),ne=toLatLon(AREA.x1,AREA.z0),ll=[sw,ne,toLatLon(AREA.x0,AREA.z0),toLatLon(AREA.x1,AREA.z1)];
  const bbox=[Math.min(...ll.map(p=>p[1])),Math.min(...ll.map(p=>p[0])),Math.max(...ll.map(p=>p[1])),Math.max(...ll.map(p=>p[0]))];
  const found=await (await fetch(STAC,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({collections:['dtm-cog'],bbox,limit:20})})).json();
  win=new Float32Array(ww*wh).fill(NODATA);sources=[];
  for(const item of found.features){
    const url=item.assets.data.href;let bytes=0;
    const range=async(off,len)=>{
      const r=await fetch(url,{headers:{authorization:auth,range:`bytes=${off}-${off+len-1}`}});
      if(r.status===401||r.status===403)throw new Error(`login refused by ${new URL(url).host} (HTTP ${r.status})`);
      if(r.status!==206&&r.status!==200)throw new Error(`HTTP ${r.status} for ${url}`);
      const b=Buffer.from(await r.arrayBuffer());bytes+=b.length;return r.status===200?b.subarray(off,off+len):b;};
    const tif=await readTiff(range);
    const [ox,,,oy]=[tif.tie[3],0,0,tif.tie[4]];          // top-left corner, 1 m pixels
    // Blocks of this file that touch the window.
    const c0=Math.max(0,Math.floor((W.e0-ox)/tif.tw)),c1=Math.min(tif.across-1,Math.floor((W.e1-1-ox)/tif.tw));
    const r0=Math.max(0,Math.floor((oy-W.n1)/tif.th)),r1=Math.min(tif.down-1,Math.floor((oy-W.n0-1)/tif.th));
    let blocks=0;
    for(let br=r0;br<=r1;br++)for(let bc=c0;bc<=c1;bc++){
      const i=br*tif.across+bc;if(!tif.counts[i])continue;
      const px=tif.decode(await range(tif.offsets[i],tif.counts[i]));blocks++;
      for(let y=0;y<tif.th;y++){const n=oy-(br*tif.th+y)-.5,row=Math.floor(W.n1-n);if(row<0||row>=wh)continue;
        for(let x=0;x<tif.tw;x++){const e=ox+bc*tif.tw+x+.5,col=Math.floor(e-W.e0);if(col<0||col>=ww)continue;
          const v=px[y*tif.tw+x];if(v!==tif.nodata&&v>-1000)win[row*ww+col]=v;}}
    }
    sources.push({id:item.id,url,scanned:item.properties.datetime,blocks,mb:+(bytes/1e6).toFixed(1)});
    console.log(`${item.id}: ${blocks} blocks, ${(bytes/1e6).toFixed(1)} MB`);
  }
  mkdirSync(CACHE,{recursive:true});
  writeFileSync(new URL('window.f32',CACHE),Buffer.from(win.buffer));
  writeFileSync(new URL('window.json',CACHE),JSON.stringify({e0:W.e0,n1:W.n1,w:ww,h:wh,crs:'EPSG:5845 (SWEREF 99 TM + RH 2000)',sources},null,1));
}

// --- Sample onto the model grid (bilinear) ---------------------------------------------------------
const at=(n,e)=>{const fx=e-W.e0-.5,fy=W.n1-n-.5,x=Math.floor(fx),y=Math.floor(fy);if(x<0||y<0||x>=ww-1||y>=wh-1)return NaN;
  const tx=fx-x,ty=fy-y,g=(i,j)=>win[(y+j)*ww+x+i];const v=[g(0,0),g(1,0),g(0,1),g(1,1)];
  if(v.some(q=>q===NODATA))return v.find(q=>q!==NODATA)??NaN;
  return (v[0]*(1-tx)+v[1]*tx)*(1-ty)+(v[2]*(1-tx)+v[3]*tx)*ty;};
const heightAt=(x,z)=>at(...sweref(...toLatLon(x,z)));
const gw=Math.round((AREA.x1-AREA.x0)/STEP),gh=Math.round((AREA.z1-AREA.z0)/STEP);
const grid=new Int16Array(gw*gh);let missing=0;
for(let j=0;j<gh;j++)for(let i=0;i<gw;i++){const h=heightAt(AREA.x0+(i+.5)*STEP,AREA.z0+(j+.5)*STEP);
  if(Number.isNaN(h)){grid[j*gw+i]=-32768;missing++;}else grid[j*gw+i]=Math.round(h*100);}
mkdirSync(OUT,{recursive:true});
writeFileSync(new URL('dem.bin',OUT),Buffer.from(grid.buffer));
writeFileSync(new URL('dem.json',OUT),JSON.stringify({x0:AREA.x0,z0:AREA.z0,step:STEP,w:gw,h:gh,format:'int16 little-endian, centimetres RH 2000, row-major from (x0,z0), -32768 = no data',
  source:'Lantmäteriet, Markhöjdmodell Nedladdning (1 m grid), CC BY 4.0',attribution:'© Lantmäteriet (CC BY 4.0)',scanned:sources.map(s=>s.scanned)},null,1));

// --- A few checks worth reading: named places and how much land lies low -----------------------
const places=[['Stortorget',24,-8],['Domkyrkan',10,-48],['Skeppsbron (Ångkvarnen)',271,106],['Kalmar C',-438,87],['Kalmar slott',-865,300],['Larmtorget',-210,-36]];
for(const [name,x,z] of places)console.log(`${name.padEnd(26)} ${heightAt(x,z).toFixed(2)} m`);
let land=0;const below=[.5,1,1.5,2,2.5,3].map(t=>[t,0]);
for(const v of grid){if(v===-32768||v<15)continue;land++;for(const b of below)if(v<b[0]*100)b[1]++;}
console.log(`grid ${gw}×${gh} @ ${STEP} m, ${missing} cells without data; land above 0.15 m: ${(land*STEP*STEP/1e4).toFixed(0)} ha`);
for(const [t,c] of below)console.log(`  land below ${t} m: ${(c*STEP*STEP/1e4).toFixed(1)} ha`);
console.log('next: node tools/flood-map.mjs');

// --- Minimal cloud-optimised GeoTIFF reader (first image, tiled, deflate, predictor 1 or 3) ------
async function readTiff(range){
  let head=await range(0,65536);
  const more=async(off,len)=>{if(off+len>head.length)head=Buffer.concat([head,await range(head.length,Math.max(off+len-head.length,65536))]);return head.subarray(off,off+len);};
  const le=head.toString('latin1',0,2)==='II',big=(le?head.readUInt16LE(2):head.readUInt16BE(2))===43;
  const u16=(b,o)=>le?b.readUInt16LE(o):b.readUInt16BE(o),u32=(b,o)=>le?b.readUInt32LE(o):b.readUInt32BE(o);
  const u64=(b,o)=>Number(le?b.readBigUInt64LE(o):b.readBigUInt64BE(o)),f64=(b,o)=>le?b.readDoubleLE(o):b.readDoubleBE(o);
  const SIZE={1:1,2:1,3:2,4:4,11:4,12:8,16:8,17:8};
  const ifd=big?u64(head,8):u32(head,4),n=big?u64(await more(ifd,8),0):u16(await more(ifd,2),0),es=big?20:12;
  const tags={};
  for(let k=0;k<n;k++){const o=ifd+(big?8:2)+k*es,e=await more(o,es);
    const tag=u16(e,0),type=u16(e,2),count=big?u64(e,4):u32(e,4),sz=SIZE[type]*count,inl=big?8:4;
    const data=sz<=inl?e.subarray(big?12:8,(big?12:8)+sz):await more(big?u64(e,12):u32(e,8),sz);
    const read=i=>type===3?u16(data,i*2):type===4?u32(data,i*4):type===16?u64(data,i*8):type===12?f64(data,i*8):data[i];
    tags[tag]=type===2?data.toString('latin1').replace(/\0+$/,''):Array.from({length:count},(_,i)=>read(i));}
  const [width]=tags[256],[height]=tags[257],[tw]=tags[322],[th]=tags[323],[comp]=tags[259],pred=tags[317]?.[0]??1;
  if(tags[258][0]!==32||tags[339]?.[0]!==3)throw new Error('expected float32 samples');
  if(comp!==8&&comp!==32946)throw new Error(`compression ${comp} not supported (deflate only)`);
  if(pred!==1&&pred!==3)throw new Error(`predictor ${pred} not supported`);
  const nodata=tags[42113]?+tags[42113]:NODATA;
  return {tw,th,across:Math.ceil(width/tw),down:Math.ceil(height/th),offsets:tags[324],counts:tags[325],tie:tags[33922],nodata,
    decode(buf){
      const raw=inflateSync(buf),out=new Float32Array(tw*th);
      if(pred===1){for(let i=0;i<tw*th;i++)out[i]=le?raw.readFloatLE(i*4):raw.readFloatBE(i*4);return out;}
      // Floating-point predictor: bytes differenced along the row, then stored as byte planes (MSB first).
      const rowB=tw*4,dv=new DataView(out.buffer);
      for(let y=0;y<th;y++){const row=raw.subarray(y*rowB,(y+1)*rowB);
        for(let i=1;i<rowB;i++)row[i]=(row[i]+row[i-1])&255;
        for(let x=0;x<tw;x++)for(let b=0;b<4;b++)dv.setUint8((y*tw+x)*4+b,row[(3-b)*tw+x]);}
      return out;},
  };
}
