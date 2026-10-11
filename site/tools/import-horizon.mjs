// The horizon around the modelled city, from OpenStreetMap: Ölandsbron and the coastlines of Öland and
// of the mainland outside the 3D model, projected into model metres and simplified, written to
// public/horizon.json for src/horizon.js; the land as a grid (horizon-land.bin), its woods and
// residential areas (horizon-landuse.bin) and the buildings of Kalmar beyond the model and of
// Färjestaden (horizon-buildings.bin). Map data © OpenStreetMap contributors (ODbL).
//   node tools/import-horizon.mjs            fetches from the Overpass API
//   node tools/import-horizon.mjs <dir>      uses bridge.json and coast.json already fetched there
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const LAT0=56.66412,LON0=16.3656,AR=28.2*Math.PI/180,M=111320;   // the model's projection (tools/import-addresses.mjs)
const project=(lat,lon)=>{const e=(lon-LON0)*M*Math.cos(LAT0*Math.PI/180),n=(lat-LAT0)*M;
  return [Math.round((e*Math.cos(AR)+n*Math.sin(AR))*10)/10,Math.round(-(-e*Math.sin(AR)+n*Math.cos(AR))*10)/10];};
const QUERIES={
  bridge:'[out:json][timeout:60];way["man_made"="bridge"]["name"="Ölandsbron"];out geom;',
  coast:'[out:json][timeout:180];way["natural"="coastline"](56.48,16.08,56.84,16.66);out geom;',
  buildings:'[out:json][timeout:240];way["building"](56.59,16.21,56.74,16.50);out geom qt;',
  landuse:'[out:json][timeout:240];(way["landuse"~"^(forest|residential)$"](56.48,16.08,56.84,16.66);way["natural"="wood"](56.48,16.08,56.84,16.66);relation["landuse"~"^(forest|residential)$"](56.48,16.08,56.84,16.66);relation["natural"="wood"](56.48,16.08,56.84,16.66););out geom qt;',
};
async function overpass(q){
  for(const ep of ['https://overpass-api.de/api/interpreter','https://overpass.kumi.systems/api/interpreter']){
    for(let i=0;i<3;i++){
      const r=await fetch(ep,{method:'POST',headers:{'User-Agent':'kalmar-2126/0.1 (horizon import)','Accept':'application/json'},body:new URLSearchParams({data:q})}).catch(()=>null);
      const text=r&&r.ok?await r.text():'';if(text.startsWith('{'))return JSON.parse(text);
      await new Promise(res=>setTimeout(res,4000));
    }
  }
  throw new Error('Overpass did not answer');
}
const dir=process.argv[2];
const load=async k=>dir&&existsSync(`${dir}/${k}.json`)?JSON.parse(readFileSync(`${dir}/${k}.json`,'utf8')):overpass(QUERIES[k]);
const [bridgeOsm,coastOsm,buildingsOsm,landuseOsm]=[await load('bridge'),await load('coast'),await load('buildings'),await load('landuse')];

// Douglas–Peucker in model metres.
function simplify(pts,tol){
  if(pts.length<3)return pts;
  const keep=new Uint8Array(pts.length);keep[0]=keep[pts.length-1]=1;const stack=[[0,pts.length-1]];
  while(stack.length){const [a,b]=stack.pop();const [ax,az]=pts[a],[bx,bz]=pts[b],dx=bx-ax,dz=bz-az,L=Math.hypot(dx,dz)||1;let far=-1,fd=tol;
    for(let i=a+1;i<b;i++){const d=Math.abs((pts[i][0]-ax)*dz-(pts[i][1]-az)*dx)/L;if(d>fd){fd=d;far=i;}}
    if(far>0){keep[far]=1;stack.push([a,far],[far,b]);}}
  return pts.filter((_,i)=>keep[i]);
}
// The bridge: OSM draws it as an outline; its centre line is the mean of the two sides, resampled.
const outline=bridgeOsm.elements[0].geometry.map(g=>project(g.lat,g.lon));
const half=Math.floor(outline.length/2),sideA=outline.slice(0,half+1),sideB=outline.slice(half).reverse();
const resample=(line,n)=>{const seg=[];let L=0;for(let i=1;i<line.length;i++){const l=Math.hypot(line[i][0]-line[i-1][0],line[i][1]-line[i-1][1]);seg.push([L,l,i]);L+=l;}
  return Array.from({length:n},(_,k)=>{const s=L*k/(n-1);const [s0,l,i]=seg.find(([s0,l])=>s<=s0+l+1e-6)||seg[seg.length-1];const t=l?(s-s0)/l:0;return [line[i-1][0]+(line[i][0]-line[i-1][0])*t,line[i-1][1]+(line[i][1]-line[i-1][1])*t];});};
const N=240,A=resample(sideA,N),B=resample(sideB,N);
const bridge=A.map((p,i)=>[Math.round((p[0]+B[i][0])*5)/10,Math.round((p[1]+B[i][1])*5)/10]);
const width=Math.round(A.reduce((s,p,i)=>s+Math.hypot(p[0]-B[i][0],p[1]-B[i][1]),0)/N*10)/10;
// Coastlines: Öland's west shore, and the mainland outside the model (its land ends at about
// x −1650…480, z −350…520). OSM coastlines run with the land on their left.
const MODEL={x0:-1700,x1:520,z0:-400,z1:570};
const outside=([x,z])=>x<MODEL.x0||x>MODEL.x1||z<MODEL.z0||z>MODEL.z1;
const oland=[],mainland=[];
for(const w of coastOsm.elements){
  const lon=w.geometry.reduce((s,g)=>s+g.lon,0)/w.geometry.length;
  const pts=simplify(w.geometry.map(g=>project(g.lat,g.lon)),6);
  if(lon>16.40)oland.push(pts);
  else{
    // Keep only the stretches outside the model, split where they enter it.
    let run=[];for(const p of pts){if(outside(p))run.push(p);else{if(run.length>1)mainland.push(run);run=[];}}
    if(run.length>1)mainland.push(run);
  }
}
// The land as a grid of signed distances to the coast (metres, + on land), so src/horizon.js can shape
// the ground: a beach at the waterline, fields rising inland, Öland's limestone ridge (landborgen).
// The sign comes from the side of the nearest coast segment (land on its left); at a corner the two
// segments' normals are averaged. Each value is stored ×2 with Öland in the lowest bit.
const GRID={x0:-9000,z0:-9000,step:60,w:318,h:301};
const segs=[];
for(const w of coastOsm.elements){
  const lon=w.geometry.reduce((s,g)=>s+g.lon,0)/w.geometry.length,pts=w.geometry.map(g=>project(g.lat,g.lon)),isle=lon>16.40?1:0,first=segs.length;
  for(let i=1;i<pts.length;i++){const [ax,az]=pts[i-1],[bx,bz]=pts[i],L=Math.hypot(bx-ax,bz-az);if(L<.01)continue;
    // The land side in model axes (x east-ish, z south-ish, a mirror of the map): (dz, −dx).
    segs.push({ax,az,bx,bz,L,nx:(bz-az)/L,nz:-(bx-ax)/L,isle,prev:segs.length>first?segs.length-1:-1,next:-1});
    if(segs.length-1>first)segs[segs.length-2].next=segs.length-1;}
}
const BUCKET=400,buckets=new Map(),key=(i,j)=>i+','+j;
segs.forEach((s,k)=>{const i0=Math.floor(Math.min(s.ax,s.bx)/BUCKET),i1=Math.floor(Math.max(s.ax,s.bx)/BUCKET),j0=Math.floor(Math.min(s.az,s.bz)/BUCKET),j1=Math.floor(Math.max(s.az,s.bz)/BUCKET);
  for(let i=i0;i<=i1;i++)for(let j=j0;j<=j1;j++){const q=key(i,j);if(!buckets.has(q))buckets.set(q,[]);buckets.get(q).push(k);}});
function nearest(x,z){
  const ci=Math.floor(x/BUCKET),cj=Math.floor(z/BUCKET);let best=null,bd=Infinity;
  for(let r=0;r<60;r++){
    for(let i=ci-r;i<=ci+r;i++)for(let j=cj-r;j<=cj+r;j++){if(Math.max(Math.abs(i-ci),Math.abs(j-cj))!==r)continue;
      for(const k of buckets.get(key(i,j))||[]){const s=segs[k],t=Math.max(0,Math.min(1,((x-s.ax)*(s.bx-s.ax)+(z-s.az)*(s.bz-s.az))/(s.L*s.L)));
        const px=s.ax+(s.bx-s.ax)*t,pz=s.az+(s.bz-s.az)*t,d=Math.hypot(x-px,z-pz);if(d<bd){bd=d;best={k,t,px,pz};}}}
    if(best&&bd<(r-1)*BUCKET)break;
  }
  if(!best)return [10000,0];
  const s=segs[best.k],o=best.t<=0&&s.prev>=0?segs[s.prev]:best.t>=1&&s.next>=0?segs[s.next]:null;
  const nx=o?s.nx+o.nx:s.nx,nz=o?s.nz+o.nz:s.nz,side=(x-best.px)*nx+(z-best.pz)*nz;
  return [side>=0?bd:-bd,s.isle];
}
const field=new Int16Array(GRID.w*GRID.h);
for(let j=0;j<GRID.h;j++)for(let i=0;i<GRID.w;i++){
  const [d,isle]=nearest(GRID.x0+i*GRID.step,GRID.z0+j*GRID.step);
  field[j*GRID.w+i]=Math.max(-16000,Math.min(16000,Math.round(d)))*2+isle;
}
writeFileSync(new URL('../public/horizon-land.bin',import.meta.url),Buffer.from(field.buffer));

// Land use on the same grid: 1 = woods (landuse=forest, natural=wood), 2 = homes (landuse=residential).
// Multipolygons are joined into rings from their member ways; holes (inner rings) are cut out.
const use=new Uint8Array(GRID.w*GRID.h);
function rings(el){
  if(el.type==='way')return {outer:[el.geometry],inner:[]};
  const join=role=>{const parts=el.members.filter(m=>m.role===role&&m.geometry).map(m=>m.geometry.slice()),out=[];
    const same=(a,b)=>Math.abs(a.lat-b.lat)<1e-7&&Math.abs(a.lon-b.lon)<1e-7;
    while(parts.length){let ring=parts.shift();
      for(let grew=true;grew&&!same(ring[0],ring[ring.length-1]);){grew=false;
        for(let i=0;i<parts.length;i++){const q=parts[i];
          if(same(ring[ring.length-1],q[0])){ring=ring.concat(q.slice(1));}
          else if(same(ring[ring.length-1],q[q.length-1])){ring=ring.concat(q.slice(0,-1).reverse());}
          else continue;
          parts.splice(i,1);grew=true;break;}}
      out.push(ring);}
    return out;};
  return {outer:join('outer'),inner:join('inner')};
}
function fill(ring,value){
  const pts=ring.map(g=>project(g.lat,g.lon));if(pts.length<3)return;
  let x0=Infinity,x1=-Infinity,z0=Infinity,z1=-Infinity;for(const [x,z] of pts){x0=Math.min(x0,x);x1=Math.max(x1,x);z0=Math.min(z0,z);z1=Math.max(z1,z);}
  const i0=Math.max(0,Math.ceil((x0-GRID.x0)/GRID.step)),i1=Math.min(GRID.w-1,Math.floor((x1-GRID.x0)/GRID.step));
  const j0=Math.max(0,Math.ceil((z0-GRID.z0)/GRID.step)),j1=Math.min(GRID.h-1,Math.floor((z1-GRID.z0)/GRID.step));
  for(let j=j0;j<=j1;j++){const z=GRID.z0+j*GRID.step;
    for(let i=i0;i<=i1;i++){const x=GRID.x0+i*GRID.step;let inside=false;
      for(let a=0,b=pts.length-1;a<pts.length;b=a++){const [xa,za]=pts[a],[xb,zb]=pts[b];if((za>z)!==(zb>z)&&x<(xb-xa)*(z-za)/(zb-za)+xa)inside=!inside;}
      if(inside&&(value===0||use[j*GRID.w+i]!==2))use[j*GRID.w+i]=value;}}
}
// Woods first, then homes over them; then the holes.
const kindOf=el=>el.tags.landuse==='residential'?2:1;
for(const pass of [1,2])for(const el of landuseOsm.elements){if(kindOf(el)!==pass)continue;const r=rings(el);for(const ring of r.outer)fill(ring,pass);}
for(const el of landuseOsm.elements){if(el.type!=='relation')continue;for(const ring of rings(el).inner)fill(ring,0);}
writeFileSync(new URL('../public/horizon-landuse.bin',import.meta.url),Buffer.from(use.buffer));

// Buildings outside the model: each as an oriented box along its longest wall, with a height from
// its levels or its kind, and a pitched roof on houses. Seven Int16 per building: x and z (½ m),
// width and depth (¼ m), heading (2π/65536), wall height (dm), kind (0 house, 1 flats, 2 large, 3 small).
const KIND={apartments:1,residential:1,dormitory:1,hotel:1,commercial:2,industrial:2,retail:2,warehouse:2,school:2,university:2,hospital:2,office:2,public:2,church:2,sports_hall:2,supermarket:2,
  garage:3,garages:3,shed:3,carport:3,greenhouse:3,hut:3,cabin:3,roof:3};
const blds=[];
for(const el of buildingsOsm.elements){
  const pts=el.geometry.map(g=>project(g.lat,g.lon));if(pts.length<4)continue;
  let cx=0,cz=0;for(const [x,z] of pts.slice(0,-1)){cx+=x;cz+=z;}cx/=pts.length-1;cz/=pts.length-1;
  if(cx>MODEL.x0&&cx<MODEL.x1&&cz>MODEL.z0&&cz<MODEL.z1)continue;
  // The longest wall gives the heading; the box spans the footprint along it and across it.
  let best=0,ang=0;for(let i=1;i<pts.length;i++){const dx=pts[i][0]-pts[i-1][0],dz=pts[i][1]-pts[i-1][1],l=Math.hypot(dx,dz);if(l>best){best=l;ang=Math.atan2(dz,dx);}}
  const ux=Math.cos(ang),uz=Math.sin(ang);let a0=Infinity,a1=-Infinity,b0=Infinity,b1=-Infinity;
  for(const [x,z] of pts){const a=(x-cx)*ux+(z-cz)*uz,b=-(x-cx)*uz+(z-cz)*ux;a0=Math.min(a0,a);a1=Math.max(a1,a);b0=Math.min(b0,b);b1=Math.max(b1,b);}
  const w=a1-a0,d=b1-b0,area=w*d;if(area<18)continue;
  const ox=cx+ux*(a0+a1)/2-uz*(b0+b1)/2,oz=cz+uz*(a0+a1)/2+ux*(b0+b1)/2;
  const t=el.tags,levels=parseFloat(t['building:levels']);
  let kind=KIND[t.building]??(area>900?2:0);if(kind===0&&area>500)kind=1;
  const h=Number.isFinite(levels)?levels*3+(kind===1?.6:0):kind===1?12:kind===2?(area>3000?9:7):kind===3?2.6:area>160?6:4.8;
  blds.push([Math.round(ox*2),Math.round(oz*2),Math.min(32767,Math.round(w*4)),Math.min(32767,Math.round(d*4)),Math.round(((ang%Math.PI)+Math.PI)%Math.PI/(2*Math.PI)*65536)-32768,Math.round(h*10),kind]);
}
writeFileSync(new URL('../public/horizon-buildings.bin',import.meta.url),Buffer.from(new Int16Array(blds.flat()).buffer));

const out={source:'© OpenStreetMap contributors (ODbL), via the Overpass API; tools/import-horizon.mjs',
  bridge:{name:'Ölandsbron',opened:bridgeOsm.elements[0].tags.start_date,length:bridgeOsm.elements[0].tags.length,width,line:bridge},
  land:{...GRID,file:'horizon-land.bin',encoding:'Int16 little-endian, row by row from z0: signed distance to the coast in metres ×2, + on land, +1 on Öland'},
  landuse:{file:'horizon-landuse.bin',encoding:'Uint8 on the land grid: 0 open land, 1 woods, 2 residential'},
  buildings:{file:'horizon-buildings.bin',count:blds.length,encoding:'Int16 ×7 per building: x, z (½ m), width, depth (¼ m), heading (2π/65536 from −32768), wall height (dm), kind (0 house, 1 flats, 2 large, 3 small)'},
  model:MODEL};
writeFileSync(new URL('../public/horizon.json',import.meta.url),JSON.stringify(out));
const count=l=>l.reduce((s,p)=>s+p.length,0),land=field.filter(v=>v>0).length;
const woods=use.filter(v=>v===1).length,homes=use.filter(v=>v===2).length;
console.log(`bridge ${bridge.length} points, ${width} m wide; coast: Öland ${oland.length} lines / ${count(oland)} points, mainland ${mainland.length} / ${count(mainland)}; land grid ${GRID.w}×${GRID.h}, ${Math.round(land/field.length*100)} % land, ${Math.round(woods/land*100)} % of it woods, ${Math.round(homes/land*100)} % homes; ${blds.length} buildings outside the model`);
