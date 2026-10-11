import * as THREE from 'three';
import { CITY } from './city-config.js';
import * as K from './meshes.js';
import { kitMaterial, createLayer } from './kit.js';
import { personBatch, PEOPLE } from './folk.js';
import { LAND } from './landuse.js';
import { hash, closestOnSegment, pointInPolygon } from './planning.js';
import { FUTURE } from './future.js';

// Places the physical 2126 city on the real map: verge trees and cultivation beds on depaved streets,
// food parks on today's car parks, food forests in the parks, market stalls and long tables on the
// squares, rooftop greenhouses, the flood wall, mussel lines, floating gardens and homes, and offshore
// wind in Kalmarsund. Every item has an `order`; the vision value of its layer decides how far the
// transformation has come. Today's parked cars are an inverse layer that the depaving removes.
// Crowns carry their own colour; instance colours are light tints for variety between trees.
const hues={tree:[0xffffff,0xe3f2d6,0xf6f1d4,0xdcebd8,0xfbe8c6,0xeaf5e0],fruit:[0xffffff,0xf0f6dc,0xe6f0d4],car:[0x8a8f96,0x2a2f36,0xe8e8e8,0x7a1e22,0x2c4a72,0xb8b8b8,0x4a4f55,0x1d1f22]};
const pick=(list,v)=>list[Math.floor(v*list.length)%list.length];

export function createFeatures(scene,planning,land,{lite=false,skipLot=()=>false,crowd=null,vehicles=null}={}){
  const mat=kitMaterial(),glass=new THREE.MeshPhysicalMaterial({color:0xdff2ea,roughness:.08,metalness:0,transmission:0,transparent:true,opacity:.28,depthWrite:false,side:THREE.DoubleSide,emissive:0xffb27a,emissiveIntensity:0});
  const items={shadeTrees:[],shadeSails:[],trees:[],beds:[],fruit:[],bushes:[],stalls:[],tables:[],parked:[],greenhouses:[],farmTrees:[],farmBeds:[],parkedLots:[],wall:[],buoys:[],rafts:[],homes:[],turbines:[]};
  const walkable=(x,z)=>{const k=land.kindAt(x,z);return k===LAND.ROAD||k===LAND.PAVED||k===LAND.PARKING||k===LAND.LAND;};
  // Verges of car streets: trees every ~11 m, beds between them; today a parked car stands there.
  let n=0;
  for(const road of planning.roads){
    if(!road.car)continue;
    const p=road.p;
    for(let i=1;i<p.length;i++){
      const ax=p[i-1][0],az=p[i-1][1],bx=p[i][0],bz=p[i][1],len=Math.hypot(bx-ax,bz-az);if(len<4)continue;
      const dx=(bx-ax)/len,dz=(bz-az)/len,rot=Math.atan2(dx,dz);
      for(let d=3+hash(n++)*4;d<len-2;d+=11){
        for(const side of [-1,1]){
          const off=road.w*.5-.9+(road.w>7?.4:0),x=ax+dx*d-dz*off*side,z=az+dz*d+dx*off*side,h=hash(n++);
          if(planning.buildingAt(x,z,1.4)||!walkable(x,z))continue;
          const y=land.heightAt(x,z),order=Math.min(.99,road.order+h*.04);
          items.trees.push({x,y,z,rot:h*6.28,order,scale:.8+h*.45,color:pick(hues.tree,h)});
          const bx2=x+dx*6.2,bz2=z+dz*6.2;
          if(d+6.2<len-1&&!planning.buildingAt(bx2,bz2,1.2)&&walkable(bx2,bz2))items.beds.push({x:bx2,y:land.heightAt(bx2,bz2),z:bz2,rot,order:Math.min(.99,order+.03)});
          if(hash(n++)<.55&&road.kind!=='service'){
            const cx=x+dx*2.6,cz=z+dz*2.6;
            if(!planning.buildingAt(cx,cz,1.1))items.parked.push({x:cx,y:land.heightAt(cx,cz),z:cz,rot,order:Math.min(.99,order+.01),color:pick(hues.car,hash(n++))});
          }
        }
      }
    }
  }
  // Parking lots: a food park per lot. 48 m cells convert together.
  const lotOrder=c=>.05+hash(Math.floor(c.x/48)*131+Math.floor(c.z/48)*17+3)*.85;
  planning.paintLots(land.cells(LAND.PARKING).map(c=>({...c,service:planning.roadAt(c.x,c.z,.5)?.kind==='service'})),lotOrder,FUTURE.uPlan.value);
  for(const c of land.cells(LAND.PARKING)){
    const i=Math.round(c.x/4),j=Math.round(c.z/4),h=hash(i*7.13+j*3.71);
    const order=lotOrder(c);
    if(i%2===0&&j%2===0&&h<.85)items.parkedLots.push({x:c.x,y:c.y,z:c.z,rot:(Math.floor(c.x/48)%2)*Math.PI/2+(h<.5?0:Math.PI),order,color:pick(hues.car,h)});
    if(skipLot(c.x,c.z))continue;
    if(i%5===0&&j%3===0&&h<.35)items.greenhouses.push({x:c.x,y:c.y,z:c.z,rot:Math.PI/2*(Math.floor(c.z/48)%2),order:order+.02,sx:1,sz:1});
    else if(i%3===0&&j%3===1&&h<.55)items.farmTrees.push({x:c.x+h,y:c.y,z:c.z-h,rot:h*6.3,order:order+.01,scale:.9+h*.4,color:pick(hues.fruit,h)});
    else if(j%2===0&&i%2===1&&h<.6)items.farmBeds.push({x:c.x,y:c.y,z:c.z,rot:Math.PI/2*(Math.floor(c.x/48)%2),order:order+.03});
  }
  // Parks and lawns: fruit and nut trees, berry bushes (a food forest under the old trees).
  for(const c of land.cells(LAND.GREEN)){
    const i=Math.round(c.x/4),j=Math.round(c.z/4),h=hash(i*1.31+j*9.17);
    if(planning.buildingAt(c.x,c.z,2))continue;
    const order=.05+hash(Math.floor(c.x/40)*31+Math.floor(c.z/40)*7)*.85;
    if(i%3===0&&j%3===0&&h<.35)items.fruit.push({x:c.x,y:c.y,z:c.z,rot:h*6.3,order,scale:.8+h*.5,color:pick(hues.fruit,h)});
    else if((i+j)%4===1&&h<.18)items.bushes.push({x:c.x,y:c.y,z:c.z,rot:h*6.3,order:order+.02,scale:.8+h*.6});
  }
  // The place's squares (CITY.squares: Kalmar's Stortorget and Larmtorget): market stalls and long tables for shared meals.
  const squares=CITY.squares||[];
  for(const sq of squares){
    for(let k=0;k<40;k++){
      const a=hash(k*3.1+sq.x)*Math.PI*2,r=Math.sqrt(hash(k*7.7+sq.z))*sq.r,x=sq.x+Math.cos(a)*r,z=sq.z+Math.sin(a)*r;
      if(sq.keepClear&&Math.hypot(x-sq.keepClear.x,z-sq.keepClear.z)<sq.keepClear.r)continue;
      if(planning.buildingAt(x,z,3)||land.kindAt(x,z)!==LAND.PAVED)continue;
      const target=k%3===0?items.tables:items.stalls;
      if(target.some(o=>Math.hypot(o.x-x,o.z-z)<(target===items.tables?6:4)))continue;
      target.push({x,y:land.heightAt(x,z),z,rot:Math.round(hash(k)*4)*Math.PI/2,order:hash(k*1.9+1)*.9,color:0xffffff});
    }
  }
  // Shade on the squares (vision.shade: Venice's svalka): trees in planters and sails, clear of stalls and tables.
  const SAILS=[0xf2ead8,0xe6c9a0,0xd98c5f,0xf4f1e8,0xc96f4a];
  for(const sq of squares){
    for(let k=0;k<30;k++){
      const a=hash(k*5.3+sq.x*.7)*Math.PI*2,r=Math.sqrt(hash(k*9.1+sq.z*.3))*sq.r*.92,x=sq.x+Math.cos(a)*r,z=sq.z+Math.sin(a)*r;
      if(sq.keepClear&&Math.hypot(x-sq.keepClear.x,z-sq.keepClear.z)<sq.keepClear.r)continue;
      if(planning.buildingAt(x,z,4)||land.kindAt(x,z)!==LAND.PAVED)continue;
      const sail=k%2===0,list=sail?items.shadeSails:items.shadeTrees,gap=sail?9:6;
      if([...items.shadeSails,...items.shadeTrees].some(o=>Math.hypot(o.x-x,o.z-z)<gap)||[...items.stalls,...items.tables].some(o=>Math.hypot(o.x-x,o.z-z)<3.5))continue;
      list.push({x,y:land.heightAt(x,z),z,rot:hash(k*2.3)*Math.PI*2,order:hash(k*4.1+2)*.9,scale:sail?1:.9+hash(k)*.25,color:sail?SAILS[k%SAILS.length]:0xffffff});
    }
  }
  // Flood wall along the core's shore, 2 m inside the coastline (CITY.floodWall).
  const coast=CITY.floodWall?planning.island:[];
  for(let i=0;i<coast.length;i++){
    const a=coast[i],b=coast[(i+1)%coast.length],len=Math.hypot(b[0]-a[0],b[1]-a[1]);if(len<.5)continue;
    const dx=(b[0]-a[0])/len,dz=(b[1]-a[1])/len;
    for(let d=0;d<len;d+=1){
      let x=a[0]+dx*(d+.5),z=a[1]+dz*(d+.5);
      // Step inward (towards land) by testing which normal side is inside the island polygon.
      const nx=-dz,nz=dx,inward=pointInPolygon(x+nx*3,z+nz*3,coast)?1:-1;x+=nx*2*inward;z+=nz*2*inward;
      items.wall.push({x,y:land.heightAt(x,z),z,rot:Math.atan2(dx,dz)+Math.PI/2,order:0});
    }
  }
  // Mussel farms (CITY.mussels: in Kalmarsund east of the island): long buoy lines.
  const MU=CITY.mussels;
  if(MU)for(let line=0;line<MU.lines;line++)for(let k=0;k<MU.buoys;k++){
    const x=MU.x+(line%MU.perRow)*MU.dx,z=MU.z+Math.floor(line/MU.perRow)*MU.dz+k*MU.step;
    items.buoys.push({x,y:-1,z,order:line/MU.lines*.9+.02});
  }
  // Floating gardens and homes in a sheltered basin (CITY.harbour: Kalmar's north harbour); wind further out.
  const HB=CITY.harbour,harbour=[];if(HB)for(const c of land.cells(LAND.WATER))if(c.z<HB.maxZ&&c.z>HB.minZ&&c.x>HB.minX&&c.x<HB.maxX)harbour.push(c);
  let placed=0;
  for(let k=0;k<harbour.length&&placed<26;k+=17){
    const c=harbour[k],h=hash(k*1.7);
    if([...items.rafts,...items.homes].some(o=>Math.hypot(o.x-c.x,o.z-c.z)<26))continue;
    let clear=true;for(let a=0;a<8;a++){const kx=c.x+Math.cos(a)*11,kz=c.z+Math.sin(a)*11;if(land.kindAt(kx,kz)!==LAND.WATER&&land.kindAt(kx,kz)!==LAND.NONE)clear=false;}
    if(!clear)continue;
    (placed%2?items.homes:items.rafts).push({x:c.x,y:-1,z:c.z,rot:h*.6,order:placed/26*.95});placed++;
  }
  // Wind turbines (CITY.turbines: a grid at sea, or on land at the given height).
  const TB=CITY.turbines;
  if(TB){const n=TB.cols*TB.rows;for(let k=0;k<n;k++){const row=Math.floor(k/TB.cols),col=k%TB.cols;items.turbines.push({x:TB.x+col*TB.dx+(row%2)*(TB.stagger??0),y:TB.y??-1,z:TB.z+row*TB.dz,rot:TB.rot??-Math.PI/2,order:k/n});}}

  // Street lamps: a warm head and a pool of light on the ground after dusk.
  const lamps=[];
  for(const road of planning.roads){
    for(let i=1;i<road.p.length;i++){
      const [ax,az]=road.p[i-1],[bx,bz]=road.p[i],len=Math.hypot(bx-ax,bz-az);if(len<3)continue;
      const dx=(bx-ax)/len,dz=(bz-az)/len;
      for(let d=hash(n++)*20;d<len;d+=24){const off=road.w*.5+.3,x=ax+dx*d-dz*off,z=az+dz*d+dx*off;
        if(planning.buildingAt(x,z,.6)||land.kindAt(x,z)===LAND.WATER||land.kindAt(x,z)===LAND.NONE)continue;
        if(lamps.some(l=>Math.abs(l.x-x)<9&&Math.abs(l.z-z)<9))continue;
        lamps.push({x,z,y:land.heightAt(x,z)});}
    }
  }
  const poolTex=(()=>{const c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d');const gr=g.createRadialGradient(32,32,0,32,32,32);gr.addColorStop(0,'rgba(255,214,150,1)');gr.addColorStop(.45,'rgba(255,190,120,.45)');gr.addColorStop(1,'rgba(255,170,100,0)');g.fillStyle=gr;g.fillRect(0,0,64,64);return new THREE.CanvasTexture(c);})();
  const poolMat=new THREE.MeshBasicMaterial({map:poolTex,color:0xffa458,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,opacity:0,fog:true});
  const pools=new THREE.InstancedMesh(new THREE.PlaneGeometry(13,13).rotateX(-Math.PI/2),poolMat,lamps.length);
  const headMat=new THREE.MeshBasicMaterial({color:0xffd9a0});
  const heads=new THREE.InstancedMesh(new THREE.SphereGeometry(.28,8,6),headMat,lamps.length);
  const posts=new THREE.InstancedMesh(new THREE.CylinderGeometry(.06,.08,4.6,5).translate(0,2.3,0),new THREE.MeshStandardMaterial({color:0x2d3238,roughness:.6,metalness:.4}),lamps.length);
  {const m=new THREE.Matrix4();lamps.forEach((l,i)=>{m.makeTranslation(l.x,l.y+.06,l.z);pools.setMatrixAt(i,m);m.makeTranslation(l.x,l.y+4.7,l.z);heads.setMatrixAt(i,m);m.makeTranslation(l.x,l.y,l.z);posts.setMatrixAt(i,m);});}
  pools.renderOrder=2;pools.frustumCulled=heads.frustumCulled=posts.frustumCulled=false;posts.castShadow=true;
  scene.add(pools,heads,posts);
  // Parked cars: the Blender estate when vehicles.glb is loaded.
  const carGeo=vehicles?.car2026||K.parkedCar();
  const L={
    trees:createLayer(scene,K.streetTree(),mat,items.trees,{name:'verge trees'}),
    beds:createLayer(scene,K.gardenBed(),mat,items.beds,{name:'verge beds'}),
    parked:createLayer(scene,carGeo,kitMaterial({roughness:.35,metalness:.4}),items.parked,{inverse:true,name:'parked cars'}),
    parkedLots:createLayer(scene,carGeo,kitMaterial({roughness:.35,metalness:.4}),items.parkedLots,{inverse:true,name:'car park cars'}),
    farmTrees:createLayer(scene,K.fruitTree(),mat,items.farmTrees,{name:'food park trees'}),
    farmBeds:createLayer(scene,K.gardenBed(),mat,items.farmBeds,{name:'food park beds'}),
    ghFrame:createLayer(scene,K.greenhouseFrame(),mat,items.greenhouses,{name:'greenhouse frames'}),
    ghGlass:createLayer(scene,K.greenhouseGlass(),glass,items.greenhouses.map(o=>({...o})),{shadow:false,name:'greenhouse glass'}),
    fruit:createLayer(scene,K.fruitTree(),mat,items.fruit,{name:'food forest'}),
    bushes:createLayer(scene,K.berryBush(),mat,items.bushes,{name:'berry bushes'}),
    shadeTrees:createLayer(scene,K.planterTree(),mat,items.shadeTrees,{name:'square trees'}),
    shadeSails:createLayer(scene,K.shadeSail(),mat,items.shadeSails,{name:'shade sails'}),
    stalls:createLayer(scene,K.marketStall(),mat,items.stalls,{name:'market stalls'}),
    tables:createLayer(scene,K.longTable(),mat,items.tables,{name:'long tables'}),
    wall:createLayer(scene,K.wallSegment(),mat,items.wall,{grow:0,name:'flood wall'}),
    buoys:createLayer(scene,K.buoy(),mat,items.buoys,{shadow:false,name:'mussel lines'}),
    rafts:createLayer(scene,K.raft(),mat,items.rafts,{name:'floating gardens'}),
    homes:createLayer(scene,K.floatingHome(),mat,items.homes,{name:'floating homes'}),
    turbines:createLayer(scene,K.turbine(),mat,items.turbines,{shadow:false,grow:.02,name:'offshore wind'}),
  };
  // Ambient crowds: people at the stalls (daytime) and on the benches of the long tables (lunch and
  // evening), facing the stall or the table.
  const SH=[0xd9534f,0x3b7dd8,0xf0ad4e,0x5cb85c,0x8e44ad,0xf4f4f4,0x2c3e50,0xe67e22,0x1abc9c,0xf1c40f,0x90a4ae,0xff8a80];
  const crowdSpots=[];
  L.stalls.items.forEach((it,i)=>{for(let k=0;k<3;k++){const a=it.rot+(k-1)*.7,r=1.6+hash(i*3+k)*.5;crowdSpots.push({x:it.x+Math.sin(a)*r,z:it.z+Math.cos(a)*r,y:it.y,rot:a+Math.PI,layer:L.stalls,idx:i,kind:'stall',h:hash(i*7+k)});}});
  L.tables.items.forEach((it,i)=>{for(let k=0;k<8;k++){const side=k%2?1:-1,along=(Math.floor(k/2)-1.5)*1.9;const c=Math.cos(it.rot),sn=Math.sin(it.rot);
    crowdSpots.push({x:it.x+c*along+sn*side*.85,z:it.z-sn*along+c*side*.85,y:it.y,rot:it.rot+(side>0?Math.PI:0),layer:L.tables,idx:i,kind:'table',h:hash(i*11+k)});}});
  const people=personBatch(scene,crowd,Math.max(1,crowdSpots.length),{name:'square crowds'});
  const looks=K.personLooks(Math.max(1,crowdSpots.length),11);
  // Mostly adults, a child now and then.
  crowdSpots.forEach((c,i)=>{const r=hash(i*5.3+1);c.variant=r<.1?'child':PEOPLE[Math.floor(hash(i*2.7)*4)];if(r>.93)c.variant='elder';
    c.hair=[looks.hair.getX(i),looks.hair.getY(i),looks.hair.getZ(i)];c.skin=[looks.skin.getX(i),looks.skin.getY(i),looks.skin.getZ(i)];});
  let crowdKey='';
  // weather.empty 0–1: a storm, a heatwave or a pandemic empties the squares; weather.dark 0–1: an
  // energy crisis dims the street lamps (src/weather.js).
  const weather={empty:0,dark:0};
  function updateCrowd(hour){
    const stallOpen=hour>=8&&hour<17,meal=(hour>=11.5&&hour<13.5)||(hour>=17&&hour<21.5),stay=Math.round(weather.empty*10)/10;
    const key=`${stallOpen}|${meal}|${L.stalls.count}|${L.tables.count}|${stay}`;if(key===crowdKey)return;crowdKey=key;
    const m=new THREE.Matrix4(),q=new THREE.Quaternion(),pv=new THREE.Vector3(),sv=new THREE.Vector3(1,1,1);
    people.begin();
    for(let i=0;i<crowdSpots.length;i++){const c=crowdSpots[i];
      const on=c.idx<c.layer.count&&(c.kind==='stall'?stallOpen&&c.h<.8:meal&&c.h<.92)&&hash(i*3.91)>=stay;
      if(!on)continue;
      pv.set(c.x,c.y,c.z);q.setFromAxisAngle(THREE.Object3D.DEFAULT_UP,c.rot);sv.setScalar(c.variant==='child'?.92:1);m.compose(pv,q,sv);
      people.add(c.variant,m,{mode:c.kind==='table'?2:0,phase:i*1.37,top:SH[Math.floor(c.h*SH.length)],hair:c.hair,skin:c.skin});}
    people.end();
  }
  // Rotors turn; they follow the turbine layer's visible count.
  const rotors=new THREE.InstancedMesh(K.rotor(),mat,items.turbines.length);rotors.count=0;rotors.frustumCulled=false;scene.add(rotors);
  const sorted=L.turbines.items;
  let wallHeight=0,seaRise=0,spin=0;
  const m=new THREE.Matrix4(),q=new THREE.Quaternion(),e=new THREE.Euler(),p=new THREE.Vector3(),s=new THREE.Vector3(1,1,1);
  // Which vision value each layer follows (used by setVision and the before/after view).
  const drive=v=>({trees:Math.max(v.depave,v.verge??0),beds:Math.max(v.depave*v.gardens,(v.verge??0)*.9),parked:v.depave,parkedLots:v.parking,farmTrees:v.parking,farmBeds:v.parking,ghFrame:v.parking*v.greenhouses,ghGlass:v.parking*v.greenhouses,
    fruit:v.foodForest,bushes:v.foodForest,shadeTrees:v.shade??0,shadeSails:v.shade??0,stalls:v.market,tables:v.community,buoys:v.mussels,rafts:v.floating,homes:v.floating*.8,turbines:v.wind});
  let current=null;
  function showFor(v){
    const d=drive(v);for(const [k,val] of Object.entries(d))L[k].showFor(val);
    L.wall.mesh.visible=v.wall>.02;rotors.count=L.turbines.mesh.count;
    for(const layer of [L.buoys,L.rafts,L.homes])layer.mesh.position.y=v.seaRise;
  }
  function restore(){if(!current)return;for(const k of Object.keys(drive(current)))L[k].restore();L.wall.mesh.visible=true;rotors.count=L.turbines.count;for(const layer of [L.buoys,L.rafts,L.homes])layer.mesh.position.y=current.seaRise;}
  function setVision(v){
    current=v;
    const grown=.5+.62*(v.maturity??1);
    L.trees.update(Math.max(v.depave,v.verge??0),grown);L.beds.update(Math.max(v.depave*v.gardens,(v.verge??0)*.9));L.parked.update(v.depave);
    L.parkedLots.update(v.parking);L.farmTrees.update(v.parking,grown);L.farmBeds.update(v.parking);L.ghFrame.update(v.parking*v.greenhouses);L.ghGlass.update(v.parking*v.greenhouses);
    L.fruit.update(v.foodForest,grown);L.bushes.update(v.foodForest,.7+.3*(v.maturity??1));
    L.shadeTrees.update(v.shade??0,grown);L.shadeSails.update(v.shade??0);
    L.stalls.update(v.market);L.tables.update(v.community);
    L.buoys.update(v.mussels);L.rafts.update(v.floating);L.homes.update(0);
    L.turbines.update(v.wind);
    if(v.wall!==wallHeight||v.seaRise!==seaRise){
      wallHeight=v.wall;seaRise=v.seaRise;
      // The wall grows by height (instance y scale), not by count.
      const mesh=L.wall.mesh;let k=0;
      if(wallHeight>.02)for(const it of L.wall.items){p.set(it.x,it.y,it.z);q.setFromAxisAngle(THREE.Object3D.DEFAULT_UP,it.rot);s.set(1,wallHeight,1);m.compose(p,q,s);mesh.setMatrixAt(k++,m);}
      mesh.count=k;mesh.instanceMatrix.needsUpdate=true;
      for(const layer of [L.buoys,L.rafts,L.homes])layer.mesh.position.y=seaRise;
    }
  }
  function update(dt,hour=12){
    updateCrowd(hour);
    spin+=dt*1.6;
    const n=L.turbines.count;rotors.count=n;
    for(let i=0;i<n;i++){const it=sorted[i];p.set(it.x,it.y+111,it.z-4.5);e.set(0,0,spin+i);q.setFromEuler(e);m.compose(p,q,s.set(1,1,1));rotors.setMatrixAt(i,m);}
    rotors.instanceMatrix.needsUpdate=true;
    // Grow lights in the greenhouses after dusk; lamps light their pools.
    const night=FUTURE.uNight.value;glass.emissiveIntensity=night*.9;
    const lit=night*(1-.8*weather.dark);
    poolMat.opacity=lit*.42;pools.visible=lit>.02;headMat.color.setRGB(.35+.65*lit,.32+.53*lit,.28+.35*lit);
    const bob=Math.sin(FUTURE.uTime.value*.8)*.12;L.rafts.mesh.position.y=seaRise+bob;L.homes.mesh.position.y=seaRise+bob*.6;
  }
  return {layers:L,items,lamps,setVision,update,showFor,restore,weather,
    stats:()=>Object.fromEntries(Object.entries(L).map(([k,l])=>[k,`${l.count}/${l.items.length}`]))};
}
