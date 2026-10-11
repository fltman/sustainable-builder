// The flood map the 3D view draws from, for a place built by the pipeline (its terrain.json: a ground
// model in the place's own plane, heights in m RH 2000): for every cell, the ground height and the level
// at which the main water first reaches it (over the lowest connecting ground: a priority flood from the
// open water, so a hollow behind a bank stays dry until the bank is overtopped), plus whether the cell
// is in the core (inside a flood wall when one is built). Written to the pack as terrain/flood.png:
//   R = ground, G = spill level (both metres above `base` × 40, so 2.5 cm steps over 6.4 m), B = 255 in the core.
//   node tools/flood-map.mjs <slug>           (python3 sustainable.py … after the build)
// It also prints the share of the core under water by level (FLOOD.table in @city/model.js) and the
// level at which the streets begin to flood (FLOOD.streets).
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { deflateSync, crc32 } from 'node:zlib';
import { join } from 'node:path';
import { ROOT } from '../city.config.mjs';

const slug=process.argv[2];
if(!slug){console.error('usage: node tools/flood-map.mjs <slug>');process.exit(1);}
const city=join(ROOT,'cities',slug),pack=join(city,'pack');
const src=JSON.parse(readFileSync(join(city,'terrain.json'),'utf8'));
const cj=JSON.parse(readFileSync(join(city,'city.json'),'utf8'));
const map=JSON.parse(readFileSync(join(pack,'map.json'),'utf8'));
if(src.frame!=='local')throw new Error('terrain.json is not in the place\'s own plane (rebuild with the current pipeline)');
const lake=cj.terrain?.lake;if(lake==null)throw new Error('city.json has no main water level (terrain.lake): the place has no water to flood from');
const n=src.n,step=src.step,N=n*n;
// Game frame: x east, z south (pipeline y north). Row r of the map is pipeline row n-1-r.
const x0=src.x0,z0=-(src.y0+(n-1)*step)-step/2,X0=x0-step/2;
const height=new Float32Array(N);
for(let r=0;r<n;r++)for(let c=0;c<n;c++)height[r*n+c]=src.z[(n-1-r)*n+c];
// Open water: the main water's surface in the ground model.
const OPEN=lake+.1,base=lake-.5;
const spill=new Float32Array(N).fill(Infinity),heap=new Int32Array(N*4);let size=0;
const key=i=>spill[heap[i]];
const push=c=>{let i=size++;heap[i]=c;while(i>0){const p=(i-1)>>1;if(key(p)<=key(i))break;[heap[p],heap[i]]=[heap[i],heap[p]];i=p;}};
const pop=()=>{const top=heap[0];heap[0]=heap[--size];let i=0;for(;;){const l=2*i+1,r=l+1;let m=i;if(l<size&&key(l)<key(m))m=l;if(r<size&&key(r)<key(m))m=r;if(m===i)break;[heap[m],heap[i]]=[heap[i],heap[m]];i=m;}return top;};
for(let i=0;i<N;i++)if(height[i]<OPEN){spill[i]=height[i];push(i);}
const done=new Uint8Array(N);
while(size){const c=pop();if(done[c])continue;done[c]=1;const x=c%n,y=(c-x)/n;
  for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=n||ny>=n)continue;const k=ny*n+nx;
    if(done[k])continue;const s=Math.max(height[k],spill[c]);if(s<spill[k]){spill[k]=s;if(size>=heap.length)throw new Error('heap');push(k);}}}

// The core: the model's land (map.json land, or its largest land area) within the play area.
const area=p=>{let a=0;for(let i=0;i<p.length;i++){const q=p[(i+1)%p.length];a+=p[i][0]*q[1]-q[0]*p[i][1];}return Math.abs(a/2);};
const poly=map.land?.[0]||(map.areas||[]).filter(a=>a.k==='land').map(a=>a.p[0]).sort((a,b)=>area(b)-area(a))[0];
const inside=(px,pz)=>{if(!poly)return true;let c=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const [xi,zi]=poly[i],[xj,zj]=poly[j];if((zi>pz)!==(zj>pz)&&px<(xj-xi)*(pz-zi)/(zj-zi)+xi)c=!c;}return c;};
const [bx0,bz0,bx1,bz1]=map.bounds||[-Infinity,-Infinity,Infinity,Infinity];
const px=Buffer.alloc(N*3),q=v=>Math.max(0,Math.min(255,Math.round((v-base)*40)));
const core=[];
for(let r=0;r<n;r++)for(let c=0;c<n;c++){const i=r*n+c,x=x0+c*step,z=z0+step/2+r*step;
  const on=x>=bx0&&x<=bx1&&z>=bz0&&z<=bz1&&height[i]>=OPEN&&inside(x,z);
  px[i*3]=q(height[i]);px[i*3+1]=q(Number.isFinite(spill[i])?spill[i]:base+6.4);px[i*3+2]=on?255:0;
  if(on)core.push(spill[i]);}
// Streets: where they begin to flood (the level that wets 1 % of their length).
const roadLevels=[];
// Streets that carry cars (planning.js CAR_KINDS), not shore paths and footways.
const CAR=new Set(['primary','secondary','tertiary','residential','unclassified','living_street','service','trunk']);
for(const road of (map.roads||[]).filter(r=>CAR.has(r.kind)&&r.w>=3.5))for(let k=1;k<road.p.length;k++){const [ax,az]=road.p[k-1],[cx,cz]=road.p[k],len=Math.hypot(cx-ax,cz-az);
  for(let d=0;d<len;d+=4){const x=ax+(cx-ax)*d/len,z=az+(cz-az)*d/len,c=Math.round((x-x0)/step),r=Math.round((z-z0-step/2)/step);
    // Piers and bridges over the water itself do not count.
    if(c>=0&&r>=0&&c<n&&r<n&&height[r*n+c]>=OPEN)roadLevels.push(spill[r*n+c]);}}
const chunk=(type,data)=>{const len=Buffer.alloc(4);len.writeUInt32BE(data.length);const td=Buffer.concat([Buffer.from(type),data]);const crc=Buffer.alloc(4);crc.writeUInt32BE(crc32(td)>>>0);return Buffer.concat([len,td,crc]);};
const ihdr=Buffer.alloc(13);ihdr.writeUInt32BE(n,0);ihdr.writeUInt32BE(n,4);ihdr[8]=8;ihdr[9]=2;
const rows=Buffer.alloc(n*(n*3+1));for(let y=0;y<n;y++)px.copy(rows,y*(n*3+1)+1,y*n*3,(y+1)*n*3);
mkdirSync(join(pack,'terrain'),{recursive:true});
writeFileSync(join(pack,'terrain/flood.png'),Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',ihdr),chunk('IDAT',deflateSync(rows,{level:9})),chunk('IEND',Buffer.alloc(0))]));
writeFileSync(join(pack,'terrain/flood.json'),JSON.stringify({x0:X0,z0,step,w:n,h:n,scale:40,base:+base.toFixed(2),
  channels:'R ground, G spill level (m above base × 40), B the core',water:+lake.toFixed(2),
  ground3D:`the 3D ground (y = 0) stands for ${(lake+1.2).toFixed(2)} m RH 2000 and higher ground for itself; the main water (y = -1.2) for ${lake.toFixed(2)} m`,
  source:src.source,attribution:src.attribution},null,1));
core.sort((a,b)=>a-b);roadLevels.sort((a,b)=>a-b);
const share=(arr,l)=>{let lo=0,hi=arr.length;while(lo<hi){const m=(lo+hi)>>1;if(arr[m]<l)lo=m+1;else hi=m;}return lo/arr.length;};
const levels=[];for(let d=.2;d<=4.01;d+=.2)levels.push(+(lake+d).toFixed(2));
const table=levels.map(l=>[l,+share(core,l).toFixed(3)]).filter(([,s],i,a)=>i===0||s!==a[i-1][1]);
const streets=roadLevels.length?roadLevels[Math.floor(roadLevels.length*.01)]:lake+1;
console.log(`terrain/flood.png ${n}×${n} (${step} m); core ${(core.length*step*step/1e4).toFixed(0)} ha; main water ${lake.toFixed(2)} m RH 2000`);
console.log(`streets begin to flood at ${streets.toFixed(2)} m (1 % of their length); ${[.005,.02,.05,.1].map(f=>`${f*100} %: ${roadLevels[Math.floor(roadLevels.length*f)].toFixed(2)} m`).join(', ')}`);
console.log(`FLOOD.table (level m RH 2000, share of the core under water):\n${JSON.stringify(table)}`);
