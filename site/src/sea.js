import * as THREE from 'three';
import { CITY } from './city-config.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { FUTURE } from './future.js';
import { LAND } from './landuse.js';
import { hash } from './planning.js';
import { kitMaterial } from './kit.js';

// Life on the place's water in the future the player builds (CITY.boats; Kalmarsund in Kalmar): electric
// boat traffic (hydrofoil ferries, boat buses and water taxis), cargo ships under rigid wing sails, and a
// floating neighbourhood of timber houses on pontoons in a sheltered basin (CITY.floatingQuarter).
const paint=(g,c)=>{g=g.index?g.toNonIndexed():g;g.deleteAttribute('uv');const col=new THREE.Color(c),n=g.attributes.position.count,a=new Float32Array(n*3);for(let i=0;i<n;i++)a.set([col.r,col.g,col.b],i*3);g.setAttribute('color',new THREE.BufferAttribute(a,3));g.setAttribute('sway',new THREE.BufferAttribute(new Float32Array(n),1));g.setAttribute('tint',new THREE.BufferAttribute(new Float32Array(n),1));g.computeVertexNormals();return g;};
const T=(g,x,y,z,ry=0)=>{if(ry)g.rotateY(ry);g.translate(x,y,z);return g;};
function wingShip(){
  // ~140 m car carrier: long hull along +z, four tall wing sails.
  const hull=new THREE.BoxGeometry(24,14,130);const bow=new THREE.CylinderGeometry(12,12,14,16,1,false,0,Math.PI);bow.rotateY(Math.PI/2);
  const parts=[paint(T(hull,0,7,0),0x2b3a47),paint(T(bow,0,7,65),0x2b3a47),paint(T(new THREE.BoxGeometry(24.2,2,130),0,13,0),0xf1f1ee),
    paint(T(new THREE.BoxGeometry(22,8,22),0,18,-48),0xf4f4f0),paint(T(new THREE.BoxGeometry(18,3,12),0,23.5,-52),0x1e2a33)];
  for(const z of [-22,0,22,44]){const w=new THREE.BoxGeometry(2.4,62,14);w.translate(0,14+31,z);parts.push(paint(w,0xe9ecef));parts.push(paint(T(new THREE.BoxGeometry(2.6,1,14.4),0,14+62,z),0x9aa3ab));}
  return mergeGeometries(parts,false);
}
function hydrofoil(){
  const hull=new THREE.CapsuleGeometry(1.4,9,4,10);hull.rotateX(Math.PI/2);hull.scale(1,.55,1);
  return mergeGeometries([paint(T(hull,0,1.9,0),0xf6f7f5),paint(T(new THREE.BoxGeometry(2.4,1.2,5),0,2.8,-.5),0x26323c),
    paint(T(new THREE.BoxGeometry(.18,1.6,.5),0,.8,3.5),0x3a4650),paint(T(new THREE.BoxGeometry(.18,1.6,.5),0,.8,-3.5),0x3a4650),
    paint(T(new THREE.BoxGeometry(4.2,.12,.8),0,.05,3.5),0x3a4650),paint(T(new THREE.BoxGeometry(3.2,.12,.6),0,.05,-3.5),0x3a4650)],false);
}
// Electric water taxi / boat bus: low white hull, glass cabin, teal stripe (charging at the quays).
function waterTaxi(){
  const hull=new THREE.CapsuleGeometry(1.1,6,4,10);hull.rotateX(Math.PI/2);hull.scale(1,.5,1);
  return mergeGeometries([paint(T(hull,0,.55,0),0xf7f7f4),paint(T(new THREE.BoxGeometry(2.1,.18,7.4),0,.7,0),0x18a39a),
    paint(T(new THREE.BoxGeometry(1.8,1.1,3.2),0,1.35,-.4),0x1f2b33),paint(T(new THREE.BoxGeometry(1.9,.12,3.4),0,1.95,-.4),0xf2f2ee)],false);
}
function floatingHouse(){
  const roof=new THREE.CylinderGeometry(.01,6.2,3,4,1);roof.rotateY(Math.PI/4);roof.scale(1,1,1.5);
  return mergeGeometries([paint(T(new THREE.BoxGeometry(11,.9,14),0,.45,0),0x5b636a),paint(T(new THREE.BoxGeometry(8,3.6,9),0,2.7,-1),0xb98d5c),
    paint(T(new THREE.BoxGeometry(8.2,.12,9.2),0,4.55,-1),0x2b2f33),paint(T(roof,0,6,-1),0x3c5f34),
    paint(T(new THREE.BoxGeometry(6,2,.1),0,2.6,3.55),0x1f2b33),paint(T(new THREE.BoxGeometry(10,.5,4),0,1.1,5),0x9b7a55)],false);
}
export function createSea(scene,land,{lite=false,vehicles=null}={}){
  const mat=kitMaterial({roughness:.5,metalness:.1});
  // Wing-sail ships run north–south through the sound; ferries cross to Färjestaden.
  const ships=new THREE.InstancedMesh(wingShip(),mat,3);ships.castShadow=true;ships.frustumCulled=false;ships.count=0;scene.add(ships);
  // Blender boats (vehicles.glb, waterline at y = 0) when loaded; the hydrofoil is modelled foil-borne.
  const foil=vehicles?.hydrofoil,boat=vehicles?.watertaxi;
  const ferries=new THREE.InstancedMesh(foil||hydrofoil(),mat,6);ferries.castShadow=true;ferries.frustumCulled=false;ferries.count=0;scene.add(ferries);
  const wakeMat=new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.55,depthWrite:false});
  const taxis=new THREE.InstancedMesh(boat||waterTaxi(),mat,16);taxis.castShadow=true;taxis.frustumCulled=false;taxis.count=0;scene.add(taxis);
  const wakes=new THREE.InstancedMesh(new THREE.PlaneGeometry(1,1).rotateX(-Math.PI/2),wakeMat,26);wakes.frustumCulled=false;wakes.count=0;scene.add(wakes);
  const BT=CITY.boats||{},FA=BT.ferries;
  const routes={ships:BT.ships||[],
    ferries:FA?[0,1,2,3,4,5].map(i=>({a:{x:FA.a.x,z:FA.a.z+i*6},b:{x:FA.b.x,z:FA.b.z+i*40},speed:13+i*.4,phase:i/6})):[]};
  // Floating neighbourhood: the clearest open water in the north harbour basin.
  const FQ=CITY.floatingQuarter,water=FQ?land.cells(LAND.WATER).filter(c=>c.z<FQ.maxZ&&c.z>FQ.minZ&&c.x>FQ.minX&&c.x<FQ.maxX):[];
  let best=null;
  for(let i=0;i<water.length;i+=7){const c=water[i];let ok=true;for(let a=0;a<12&&ok;a++)for(const r of [20,40,58]){const k=land.kindAt(c.x+Math.cos(a/12*6.283)*r,c.z+Math.sin(a/12*6.283)*r);if(k!==LAND.WATER&&k!==LAND.NONE){ok=false;break;}}if(ok&&(!best||Math.abs(c.x)<Math.abs(best.x)))best=c;}
  const homes=[],piers=[];
  if(best)for(let r=0;r<3;r++)for(let c=0;c<4;c++){const x=best.x+(c-1.5)*22,z=best.z+(r-1)*26;homes.push({x,z,rot:(r%2)*Math.PI,order:hash(r*4+c+.5)});
    piers.push({x,z:z+(r%2?-10:10),sx:22,sz:2.4});}
  if(best)piers.push({x:best.x,z:best.z,sx:2.4,sz:70});
  homes.sort((a,b)=>a.order-b.order);
  const houseMesh=new THREE.InstancedMesh(floatingHouse(),mat,homes.length||1);houseMesh.castShadow=true;houseMesh.frustumCulled=false;houseMesh.count=0;scene.add(houseMesh);
  const pierMesh=new THREE.InstancedMesh(paint(new THREE.BoxGeometry(1,.4,1),0x8a6a48),mat,piers.length||1);pierMesh.receiveShadow=true;pierMesh.frustumCulled=false;pierMesh.count=0;scene.add(pierMesh);
  // Boat-bus loops around the island and out to the floating quarter and the mussel lines.
  const loops=(BT.loops||[]).map(pts=>{const segs=[];let L=0;for(let i=0;i<pts.length;i++){const a=pts[i],b=pts[(i+1)%pts.length],l=Math.hypot(b[0]-a[0],b[1]-a[1]);segs.push({a,b,l,s:L});L+=l;}return {segs,L};});
  const taxiRuns=loops.length?Array.from({length:16},(_,i)=>({loop:loops[i%loops.length],phase:hash(i*3.7),speed:7+hash(i)*4})):[];
  let v={ships:0,ferries:0,floatVillage:0,seaRise:0,boats:0},t=0;
  const m=new THREE.Matrix4(),q=new THREE.Quaternion(),p=new THREE.Vector3(),s=new THREE.Vector3(1,1,1),up=new THREE.Vector3(0,1,0);
  function setVision(vv){v=vv;
    const n=Math.round(homes.length*THREE.MathUtils.clamp(vv.floatVillage??0,0,1));let k=0;
    for(let i=0;i<n;i++){const h=homes[i];p.set(h.x,vv.seaRise-.6,h.z);q.setFromAxisAngle(up,h.rot);s.set(1,1,1);m.compose(p,q,s);houseMesh.setMatrixAt(k++,m);}
    houseMesh.count=k;houseMesh.instanceMatrix.needsUpdate=true;
    let j=0;if(n>0)for(const pr of piers){p.set(pr.x,vv.seaRise-.6,pr.z);q.identity();s.set(pr.sx,1,pr.sz);m.compose(p,q,s);pierMesh.setMatrixAt(j++,m);}
    pierMesh.count=j;pierMesh.instanceMatrix.needsUpdate=true;
  }
  function update(dt){
    t+=dt;const sea=v.seaRise||0,bob=Math.sin(t*.7)*.12;
    houseMesh.position.y=bob;pierMesh.position.y=bob;
    let n=0,w=0;
    const nShips=Math.round(routes.ships.length*THREE.MathUtils.clamp(v.ships||0,0,1));
    for(let i=0;i<nShips;i++){const r=routes.ships[i],len=Math.abs(r.z1-r.z0),f=((t*r.speed/len)+r.phase)%1,z=r.z0+(r.z1-r.z0)*f,dir=Math.sign(r.z1-r.z0);
      p.set(r.x,sea-1.5,z);q.setFromAxisAngle(up,dir>0?0:Math.PI);s.set(1,1,1);m.compose(p,q,s);ships.setMatrixAt(n++,m);
      p.set(r.x,sea+.05,z-dir*95);q.setFromAxisAngle(up,0);s.set(26,1,70);m.compose(p,q,s);wakes.setMatrixAt(w++,m);}
    ships.count=n;ships.instanceMatrix.needsUpdate=true;
    let k=0;const nF=Math.round(routes.ferries.length*THREE.MathUtils.clamp(v.ferries||0,0,1));
    for(let i=0;i<nF;i++){const r=routes.ferries[i],L=Math.hypot(r.b.x-r.a.x,r.b.z-r.a.z),cycle=(t*r.speed/(2*L)+r.phase)%1,go=cycle<.5,f=go?cycle*2:2-cycle*2;
      const x=r.a.x+(r.b.x-r.a.x)*f,z=r.a.z+(r.b.z-r.a.z)*f,ang=Math.atan2(r.b.x-r.a.x,r.b.z-r.a.z)+(go?0:Math.PI);
      p.set(x,sea+(foil?0:.4),z);q.setFromAxisAngle(up,ang);s.set(1,1,1);m.compose(p,q,s);ferries.setMatrixAt(k++,m);
      const back=new THREE.Vector3(0,0,foil?-17:-14).applyQuaternion(q);p.set(x+back.x,sea+.06,z+back.z);s.set(3,1,18);m.compose(p,q,s);wakes.setMatrixAt(w++,m);}
    ferries.count=k;ferries.instanceMatrix.needsUpdate=true;
    let b=0;const nT=Math.round(taxiRuns.length*THREE.MathUtils.clamp(v.boats||0,0,1));
    for(let i=0;i<nT;i++){const r=taxiRuns[i],L=r.loop.L,d=((t*r.speed/L)+r.phase)%1*L;const sg=r.loop.segs.find(g=>d>=g.s&&d<g.s+g.l)||r.loop.segs[0],f=(d-sg.s)/sg.l;
      const x=sg.a[0]+(sg.b[0]-sg.a[0])*f,z=sg.a[1]+(sg.b[1]-sg.a[1])*f,ang=Math.atan2(sg.b[0]-sg.a[0],sg.b[1]-sg.a[1]);
      p.set(x,sea+(boat?0:.1),z);q.setFromAxisAngle(up,ang);s.set(1,1,1);m.compose(p,q,s);taxis.setMatrixAt(b++,m);
      if(w<26){const back=new THREE.Vector3(0,0,-8).applyQuaternion(q);p.set(x+back.x,sea+.06,z+back.z);s.set(2.2,1,10);m.compose(p,q,s);wakes.setMatrixAt(w++,m);}}
    taxis.count=b;taxis.instanceMatrix.needsUpdate=true;
    wakes.count=w;wakes.instanceMatrix.needsUpdate=true;
    wakeMat.opacity=.35+.2*(1-FUTURE.uNight.value);
  }
  return {setVision,update,village:best,setTime(v){t=v;},stats:()=>({ships:ships.count,ferries:ferries.count,taxis:taxis.count,homes:houseMesh.count})};
}
