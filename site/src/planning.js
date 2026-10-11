import * as THREE from 'three';
import { CITY } from './city-config.js';

// The "planning map": everything the 2126 transformation needs to know about the real city, derived
// once from map.json (OpenStreetMap streets, building footprints, land) and painted into a texture the
// city shaders read by world position:
//   R  building id hash (0 outside footprints) – decides which roofs turn green or solar first
//   G  street conversion order (0 = no street, low values convert first, 1 = never: squares, paths)
//   B  distance across the street (1 at the centre line, falling to 0 at the kerb)
//   A  land mask of the core (inside the future flood wall)
export const PLAN_RECT=CITY.planRect;
const W=2048,H=1024;

let seed=1;
export const hash=(n)=>{let x=Math.sin(n*127.1+311.7)*43758.5453;return x-Math.floor(x);};
export function rand(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;}
export function reseed(s){seed=s>>>0;}

export function polygonArea(p){let a=0;for(let i=0;i<p.length;i++){const q=p[(i+1)%p.length];a+=p[i][0]*q[1]-q[0]*p[i][1];}return a/2;}
export function centroid(p){
  let a=0,x=0,z=0;
  for(let i=0;i<p.length;i++){const q=p[(i+1)%p.length],c=p[i][0]*q[1]-q[0]*p[i][1];a+=c;x+=(p[i][0]+q[0])*c;z+=(p[i][1]+q[1])*c;}
  if(Math.abs(a)<1e-6)return [p.reduce((s,v)=>s+v[0],0)/p.length,p.reduce((s,v)=>s+v[1],0)/p.length];
  return [x/(3*a),z/(3*a)];
}
export function pointInPolygon(x,z,p){
  let inside=false;
  for(let i=0,j=p.length-1;i<p.length;j=i++){const a=p[i],b=p[j];if((a[1]>z)!==(b[1]>z)&&x<(b[0]-a[0])*(z-a[1])/(b[1]-a[1])+a[0])inside=!inside;}
  return inside;
}
export function closestOnSegment(x,z,a,b){
  const dx=b[0]-a[0],dz=b[1]-a[1],len=dx*dx+dz*dz,t=len?Math.max(0,Math.min(1,((x-a[0])*dx+(z-a[1])*dz)/len)):0;
  const px=a[0]+t*dx,pz=a[1]+t*dz;return {x:px,z:pz,t,d:Math.hypot(px-x,pz-z)};
}

// Streets that carry cars today. Footways, paths and pedestrian streets are already people's streets.
const CAR_KINDS=new Set(['primary','secondary','tertiary','residential','unclassified','living_street','service']);
// Landmarks whose roofs and facades are protected (CITY.heritage: Kalmar's castle, cathedral and town hall square).
export const HERITAGE=CITY.heritage||[];
export const isHeritage=(x,z)=>HERITAGE.some(h=>Math.hypot(x-h.x,z-h.z)<h.r);

export function createPlanning(map){
  const buildings=map.buildings.map((p,i)=>{
    const [cx,cz]=centroid(p),area=Math.abs(polygonArea(p));
    return {id:i,p,cx,cz,area,h:hash(i+1),heritage:isHeritage(cx,cz),roof:null,
      minX:Math.min(...p.map(q=>q[0])),maxX:Math.max(...p.map(q=>q[0])),minZ:Math.min(...p.map(q=>q[1])),maxZ:Math.max(...p.map(q=>q[1]))};
  });
  // Bigger roofs convert first: they carry the cheapest kWh and the easiest green roofs.
  const ranked=[...buildings].filter(b=>!b.heritage).sort((a,b)=>b.area*(.6+b.h*.8)-a.area*(.6+a.h*.8));
  // A building's order is the share of roof area converted before it, so a vision value of 0.3
  // means about 30 % of the roof area (large blocks would otherwise jump the count).
  const total=ranked.reduce((s,b)=>s+b.area,0);let acc=0;
  ranked.forEach(b=>{b.order=(acc+b.area/2)/total;acc+=b.area;});
  for(const b of buildings)if(b.heritage)b.order=2;
  const roads=map.roads.map((r,i)=>{
    const car=CAR_KINDS.has(r.kind)&&r.w>=4;
    // Residential and service streets go first, main roads last; a hash spreads streets of one kind over time.
    const rank={service:.05,living_street:.1,residential:.2,unclassified:.3,tertiary:.5,secondary:.65,primary:.8}[r.kind]??1;
    const order=car?Math.min(.98,rank*.75+hash(i+71)*.25):1;
    return {...r,car,order,length:r.p.slice(1).reduce((s,q,k)=>s+Math.hypot(q[0]-r.p[k][0],q[1]-r.p[k][1]),0)};
  });
  const island=map.land?.[0]||[...(map.areas||[]).filter(a=>a.k==='land').map(a=>a.p[0])].sort((a,b)=>Math.abs(polygonArea(b))-Math.abs(polygonArea(a)))[0]||[[PLAN_RECT.minX,PLAN_RECT.minZ],[PLAN_RECT.maxX,PLAN_RECT.minZ],[PLAN_RECT.maxX,PLAN_RECT.maxZ],[PLAN_RECT.minX,PLAN_RECT.maxZ]];
  // A city of islands where no one island holds half the land (Venice): every island counts as the core.
  const landPolys=map.land?.length?map.land:(map.areas||[]).filter(a=>a.k==="land").map(a=>a.p[0]);
  const landArea=landPolys.reduce((s,p)=>s+Math.abs(polygonArea(p)),0),archipelago=landPolys.length>1&&Math.abs(polygonArea(island))<landArea/2;
  const onIsland=archipelago?(x,z)=>landPolys.some(p=>pointInPolygon(x,z,p)):(x,z)=>pointInPolygon(x,z,island);

  // Texture painting: one canvas per channel (2D canvas cannot write channels independently).
  const toPx=(x,z)=>[(x-PLAN_RECT.minX)/(PLAN_RECT.maxX-PLAN_RECT.minX)*W,(z-PLAN_RECT.minZ)/(PLAN_RECT.maxZ-PLAN_RECT.minZ)*H];
  const scale=W/(PLAN_RECT.maxX-PLAN_RECT.minX);
  function layer(draw){
    const c=typeof OffscreenCanvas!=='undefined'?new OffscreenCanvas(W,H):Object.assign(document.createElement('canvas'),{width:W,height:H});
    const g=c.getContext('2d',{willReadFrequently:true});g.fillStyle='#000';g.fillRect(0,0,W,H);g.imageSmoothingEnabled=false;
    draw(g);return g.getImageData(0,0,W,H).data;
  }
  const path=(g,p)=>{g.beginPath();p.forEach((q,i)=>{const [x,y]=toPx(q[0],q[1]);i?g.lineTo(x,y):g.moveTo(x,y);});};
  const shade=v=>{const n=Math.max(1,Math.min(255,Math.round(v*255)));return `rgb(${n},${n},${n})`;};
  let data=null;
  function paint(){
    const R=layer(g=>{for(const b of buildings){path(g,b.p);g.closePath();g.fillStyle=shade(b.heritage?1:b.order*.98);g.fill();}});
    // Each street is drawn wide-to-narrow so the B channel rises toward its centre line.
    const G=layer(g=>{g.lineCap='round';g.lineJoin='round';
      for(const r of [...roads].sort((a,b)=>b.order-a.order)){path(g,r.p);g.lineWidth=Math.max(1.5,r.w*scale);g.strokeStyle=shade(r.order);g.stroke();}});
    const B=layer(g=>{g.lineCap='round';g.lineJoin='round';
      for(const step of [1,.8,.6,.4,.22]){for(const r of roads){if(!r.car)continue;path(g,r.p);g.lineWidth=Math.max(1,r.w*scale*step);g.strokeStyle=shade(1.15-step);g.stroke();}}});
    const A=layer(g=>{path(g,island);g.closePath();g.fillStyle='#fff';g.fill();});
    data=new Uint8Array(W*H*4);
    for(let i=0;i<W*H;i++){data[i*4]=R[i*4];data[i*4+1]=G[i*4];data[i*4+2]=B[i*4];data[i*4+3]=A[i*4];}
    const texture=new THREE.DataTexture(data,W,H,THREE.RGBAFormat);
    texture.magFilter=THREE.NearestFilter;texture.minFilter=THREE.NearestFilter;texture.flipY=false;texture.needsUpdate=true;
    return texture;
  }
  // After the land scan: car parks carry their conversion order in B (streets leave G at 0 there).
  function paintLots(cells,orderOf,texture){
    const step=4;
    for(const c of cells){
      const v=Math.max(1,Math.min(255,Math.round(orderOf(c)*255)));
      const [x0,y0]=toPx(c.x-step/2,c.z-step/2),[x1,y1]=toPx(c.x+step/2,c.z+step/2);
      for(let py=Math.max(0,Math.floor(y0));py<Math.min(H,Math.ceil(y1));py++)for(let px=Math.max(0,Math.floor(x0));px<Math.min(W,Math.ceil(x1));px++){
        const i=(py*W+px)*4;if(data[i+1]===0||c.service){data[i+1]=0;data[i+2]=v;}
      }
    }
    texture.needsUpdate=true;
  }
  function sample(x,z){
    if(!data)return [0,0,0,0];
    const [px,py]=toPx(x,z),i=(Math.floor(Math.max(0,Math.min(H-1,py)))*W+Math.floor(Math.max(0,Math.min(W-1,px))))*4;
    return [data[i]/255,data[i+1]/255,data[i+2]/255,data[i+3]/255];
  }
  const grid=new Map(),CELL=32;
  for(const b of buildings)for(let x=Math.floor(b.minX/CELL);x<=Math.floor(b.maxX/CELL);x++)for(let z=Math.floor(b.minZ/CELL);z<=Math.floor(b.maxZ/CELL);z++){const k=x+','+z;if(!grid.has(k))grid.set(k,[]);grid.get(k).push(b);}
  function buildingAt(x,z,margin=0){
    for(const b of grid.get(Math.floor(x/CELL)+','+Math.floor(z/CELL))||[]){
      if(x<b.minX-margin||x>b.maxX+margin||z<b.minZ-margin||z>b.maxZ+margin)continue;
      if(pointInPolygon(x,z,b.p))return b;
      if(margin>0)for(let i=0;i<b.p.length;i++)if(closestOnSegment(x,z,b.p[i],b.p[(i+1)%b.p.length]).d<margin)return b;
    }
    return null;
  }
  // Nearest mapped way (segment grid), e.g. to tell a parking aisle (service) from a street.
  const SEG=24,segGrid=new Map();
  for(const r of roads)for(let i=1;i<r.p.length;i++){const a=r.p[i-1],b=r.p[i];
    for(let x=Math.floor(Math.min(a[0],b[0])/SEG);x<=Math.floor(Math.max(a[0],b[0])/SEG);x++)for(let z=Math.floor(Math.min(a[1],b[1])/SEG);z<=Math.floor(Math.max(a[1],b[1])/SEG);z++){const k=x+','+z;if(!segGrid.has(k))segGrid.set(k,[]);segGrid.get(k).push([a,b,r]);}}
  function roadAt(x,z,margin=1){
    let best=null,bd=Infinity;
    for(const [a,b,r] of segGrid.get(Math.floor(x/SEG)+','+Math.floor(z/SEG))||[]){const d=closestOnSegment(x,z,a,b).d;if(d<r.w/2+margin&&d<bd){bd=d;best=r;}}
    return best;
  }
  const lands=[island,...map.areas.filter(a=>a.k==='land').map(a=>a.p[0])];
  const onLand=(x,z)=>lands.some(p=>pointInPolygon(x,z,p));
  return {buildings,roads,island,onIsland,onLand,paint,paintLots,sample,roadAt,buildingAt,rect:PLAN_RECT,
    uniform:new THREE.Vector4(PLAN_RECT.minX,PLAN_RECT.minZ,1/(PLAN_RECT.maxX-PLAN_RECT.minX),1/(PLAN_RECT.maxZ-PLAN_RECT.minZ))};
}
