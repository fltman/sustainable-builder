import * as THREE from 'three';
import * as K from './meshes.js';
import { kitMaterial } from './kit.js';
import { PLACES } from '@city/places.js';
import { CITY } from './city-config.js';

// Experience the city at street level: walk (first person), cycle (third person) or ride a robot
// taxi that drives itself between the places of Kvarnholmen. The camera leaves the Sims view and
// comes back to it on exit. Walking and cycling are blocked by buildings (OSM footprints) and water.
const SPEED={walk:1.6,run:3.6,bike:6.5,taxi:8,gondola:1.9,boat:5.5};
// Boats that find their way along the canals (map.json waterways: Venice's gondolas and water taxis).
const BOATS=new Set(['gondola','boat']),AUTO=new Set(['taxi','gondola','boat']);
export function createRide({view,land,planning,graph,scene,LAND,crowd=null,vehicles=null,waterGraph=null}){
  let onArrive=null;
  const camera=view.camera,controls=view.controls;
  // Seen from behind: the crowd's animated cyclist (pedalling with the speed, a foot down when
  // stopped) and the Blender robotaxi, when the models are loaded.
  const rider=crowd?.byName.cyclist?crowd.makeMesh('cyclist',1):null;
  if(rider){rider.setMatrixAt(0,new THREE.Matrix4());rider.setColorAt(0,new THREE.Color(0x2f6f9f));rider.frustumCulled=false;}
  const bikeMesh=rider||new THREE.Mesh(K.bike(),kitMaterial());bikeMesh.castShadow=true;bikeMesh.visible=false;scene.add(bikeMesh);
  const podMesh=new THREE.Mesh(vehicles?.robotaxi||K.pod(),kitMaterial({roughness:.3,metalness:.2}));podMesh.castShadow=true;podMesh.visible=false;scene.add(podMesh);
  // The boats you ride: the Blender gondola (with its gondolier) and the electric water taxi.
  const boatMeshes={gondola:vehicles?.gondola,boat:vehicles?.watertaxi};
  for(const k of Object.keys(boatMeshes)){if(!boatMeshes[k])continue;const mm=new THREE.Mesh(boatMeshes[k],kitMaterial({roughness:.68,metalness:0}));mm.castShadow=true;mm.visible=false;scene.add(mm);boatMeshes[k]=mm;}
  // First-person bike: what a rider sees below the horizon – drop of the handlebar, grips and
  // hands, the stem, a basket and the top of the front wheel. Posed from the rider every frame.
  const povBike=(()=>{
    const g=new THREE.Group(),dark=new THREE.MeshStandardMaterial({color:0x1d2329,roughness:.45,metalness:.6}),
      chrome=new THREE.MeshStandardMaterial({color:0xc9ced3,roughness:.25,metalness:.9}),grip=new THREE.MeshStandardMaterial({color:0x6b4a33,roughness:.8}),
      skin=new THREE.MeshStandardMaterial({color:0xd9a882,roughness:.7}),sleeve=new THREE.MeshStandardMaterial({color:0x3a4a5a,roughness:.9}),
      tyre=new THREE.MeshStandardMaterial({color:0x151515,roughness:.9}),wicker=new THREE.MeshStandardMaterial({color:0xb08455,roughness:.9}),
      fender=new THREE.MeshStandardMaterial({color:0x2f7d4f,roughness:.4,metalness:.3});
    const bar=new THREE.Mesh(new THREE.TorusGeometry(.32,.016,8,24,Math.PI),chrome);bar.rotation.set(Math.PI/2,0,0);bar.position.set(0,0,.12);g.add(bar);
    for(const sx of [-1,1]){
      const gr=new THREE.Mesh(new THREE.CylinderGeometry(.022,.022,.13,10),grip);gr.rotation.z=Math.PI/2;gr.position.set(sx*.37,0,.0);g.add(gr);
      const hand=new THREE.Mesh(new THREE.SphereGeometry(.05,10,8),skin);hand.scale.set(1.25,.8,1);hand.position.set(sx*.37,.02,.0);g.add(hand);
      const arm=new THREE.Mesh(new THREE.CylinderGeometry(.032,.04,.3,10),sleeve);arm.position.set(sx*.34,.06,-.13);arm.rotation.x=1.15;arm.rotation.z=-sx*.12;g.add(arm);
      const cuff=new THREE.Mesh(new THREE.CylinderGeometry(.034,.034,.03,10),skin);cuff.position.set(sx*.355,.035,-.02);cuff.rotation.x=1.15;g.add(cuff);
      const bell=sx>0?new THREE.Mesh(new THREE.CylinderGeometry(.025,.03,.02,12),chrome):null;if(bell){bell.position.set(.22,.02,.12);g.add(bell);}
    }
    const stem=new THREE.Mesh(new THREE.CylinderGeometry(.018,.018,.2,8),dark);stem.position.set(0,-.08,.3);stem.rotation.x=-.35;g.add(stem);
    const head=new THREE.Mesh(new THREE.CylinderGeometry(.025,.025,.35,8),dark);head.position.set(0,-.28,.42);head.rotation.x=-.3;g.add(head);
    const basket=new THREE.Mesh(new THREE.BoxGeometry(.36,.22,.26),wicker);basket.position.set(0,-.2,.62);g.add(basket);
    const lamp=new THREE.Mesh(new THREE.CylinderGeometry(.03,.035,.05,12),chrome);lamp.rotation.x=Math.PI/2;lamp.position.set(0,-.33,.77);g.add(lamp);
    const wheel=new THREE.Mesh(new THREE.TorusGeometry(.34,.025,8,32),tyre);wheel.rotation.y=Math.PI/2;wheel.position.set(0,-.95,.62);g.add(wheel);
    const fend=new THREE.Mesh(new THREE.TorusGeometry(.37,.012,6,24,1.6),fender);fend.rotation.set(0,Math.PI/2,.55);fend.position.set(0,-.95,.62);g.add(fend);
    g.traverse(o=>{if(o.isMesh){o.castShadow=false;o.renderOrder=5;}});
    // Held in camera space like a first-person view model: always at the bottom of the frame.
    // The model faces +Z; in camera space forward is −Z, so it is turned round.
    const rig=new THREE.Group(),holder=new THREE.Group();holder.add(g);rig.add(holder);
    holder.rotation.y=Math.PI;holder.position.set(0,-.27,-.5);g.rotation.x=-.08;
    rig.visible=false;scene.add(camera);camera.add(rig);rig.userData.bars=g;rig.userData.holder=holder;return rig;
  })();
  const keys=new Set();
  addEventListener('keydown',e=>{if(!state.mode||e.target.closest?.('input,textarea'))return;if(e.code==='KeyV')state.outside=!state.outside;keys.add(e.code);if(['Space','ArrowUp','ArrowDown'].includes(e.code))e.preventDefault();});
  addEventListener('keyup',e=>keys.delete(e.code));
  const state={mode:null,x:0,z:0,y:0,heading:0,pitch:0,speed:0,path:null,step:0,dest:null,saved:null,bob:0};
  // Look around by dragging (no pointer lock needed).
  let drag=null;
  const dom=view.camera&&document.getElementById('scene');
  dom.addEventListener('pointerdown',e=>{if(state.mode)drag={x:e.clientX,y:e.clientY};});
  addEventListener('pointerup',()=>drag=null);
  addEventListener('pointermove',e=>{if(!state.mode||!drag)return;state.heading-=(e.clientX-drag.x)*.004;state.pitch=THREE.MathUtils.clamp(state.pitch-(e.clientY-drag.y)*.003,-.6,.5);drag={x:e.clientX,y:e.clientY};});
  const blocked=(x,z)=>{const k=land.kindAt(x,z);return k===LAND.WATER||Boolean(planning.buildingAt(x,z,.35));};
  // Addresses: every named street (at the middle of its longest stretch), the named places and,
  // once the pack's addresses.json has loaded (tools/import-addresses.mjs), every street number. A
  // street number is reached from its own street: the taxi stops at the point of that street
  // nearest the house, not on the street behind the block.
  const JUNK=CITY.rideSkip||/^$/;
  const segsOf=new Map();
  for(const r of planning.roads){if(!r.name||JUNK.test(r.name))continue;
    for(let i=1;i<r.p.length;i++){const a=r.p[i-1],b=r.p[i];(segsOf.get(r.name)||segsOf.set(r.name,[]).get(r.name)).push([a,b,Math.hypot(b[0]-a[0],b[1]-a[1])]);}}
  const kerb=(street,x,z)=>{let best=null,bd=Infinity;
    for(const [a,b,l] of segsOf.get(street)||[]){if(!l)continue;const t=Math.max(0,Math.min(1,((x-a[0])*(b[0]-a[0])+(z-a[1])*(b[1]-a[1]))/(l*l)));
      const px=a[0]+(b[0]-a[0])*t,pz=a[1]+(b[1]-a[1])*t,d=Math.hypot(px-x,pz-z);if(d<bd){bd=d;best=[px,pz];}}
    return best&&bd<60?best:[x,z];};
  const addresses=(()=>{
    const list=[];
    for(const [name,segs] of segsOf){const [a,b]=segs.reduce((m,s)=>s[2]>m[2]?s:m);list.push({name,x:(a[0]+b[0])/2,z:(a[1]+b[1])/2,kind:'gata'});}
    list.push(...PLACES.filter(p=>p.x>CITY.camera.bounds.minX-60&&p.x<CITY.camera.bounds.maxX+60&&p.z>CITY.camera.bounds.minZ-60&&p.z<CITY.camera.bounds.maxZ+60).map(p=>({name:p.name,x:p.x,z:p.z,kind:'plats'})));
    return list.sort((a,b)=>a.name.localeCompare(b.name,'sv'));
  })();
  const ready=(typeof __PACK__!=='undefined'&&!__PACK__.addresses?Promise.reject(new Error('no addresses')):fetch('city/addresses.json')).then(r=>r.json()).then(({addresses:rows})=>{
    const streets=new Set(addresses.filter(a=>a.kind==='gata').map(a=>a.name)),extra=new Map();
    for(const [street,num,x,z] of rows){
      const [kx,kz]=kerb(street,x,z);
      addresses.push({name:`${street} ${num}`,street,num,x:kx,z:kz,house:{x,z},kind:'adress'});
      // Squares and quays that only exist as addresses get a street entry of their own.
      if(!streets.has(street)){const e=extra.get(street)||extra.set(street,{x:0,z:0,n:0}).get(street);e.x+=kx;e.z+=kz;e.n++;}
    }
    for(const [name,e] of extra)addresses.push({name,x:e.x/e.n,z:e.z/e.n,kind:'gata'});
    // Streets, then their numbers in order (2, 2A, 10 – not 10 before 2).
    addresses.sort((a,b)=>(a.street||a.name).localeCompare(b.street||b.name,'sv')||(a.num?1:0)-(b.num?1:0)||(parseInt(a.num)||0)-(parseInt(b.num)||0)||String(a.num).localeCompare(String(b.num),'sv'));
  }).catch(e=>console.warn('Adresserna:',e));
  const ok=e=>e.w>=4&&e.kind!=='steps';
  function setDestination(dest){
    state.dest=dest;state.arrived=false;
    // A boat goes by the canals to the water nearest the address.
    const boat=BOATS.has(state.mode),g=boat?waterGraph:graph,okk=boat?()=>true:ok;
    const a=g.nearest(state.x,state.z,okk),b=g.nearest(dest.x,dest.z,okk);
    const ids=g.path(a,b,okk)||[];
    state.path=ids.map(id=>g.nodes[id]);state.step=0;
    state.total=state.path.reduce((s,n,i)=>i?s+Math.hypot(n.x-state.path[i-1].x,n.z-state.path[i-1].z):s,0);
    return state.path.length>0;
  }
  function remaining(){
    if(!state.path)return 0;let d=0,px=state.x,pz=state.z;
    for(let i=state.step;i<state.path.length;i++){const n=state.path[i];d+=Math.hypot(n.x-px,n.z-pz);px=n.x;pz=n.z;}
    return d;
  }
  function start(mode){
    // Start where the view is looking, on the nearest street (a boat: on the nearest canal).
    const g=BOATS.has(mode)?waterGraph:graph;
    const t=controls.target,n=g.nodes[g.nearest(t.x,t.z)];
    state.saved={pos:camera.position.clone(),target:t.clone(),near:camera.near,fov:camera.fov};
    Object.assign(state,{mode,x:n.x,z:n.z,speed:0,pitch:mode==='bike'?-.08:0,bob:0,lean:0,outside:false});
    const e=n.edges[0],o=e&&g.nodes[g.other(e,n.id)];state.heading=o?Math.atan2(o.x-n.x,o.z-n.z):0;
    if(BOATS.has(mode))state.y=CITY.water.y;
    controls.enabled=false;camera.near=.2;camera.fov=mode==='walk'?62:55;camera.updateProjectionMatrix();
    bikeMesh.visible=mode==='bike';podMesh.visible=mode==='taxi';
    state.path=null;state.dest=null;state.arrived=false;
  }
  function stop(){
    if(!state.mode)return;
    state.mode=null;bikeMesh.visible=podMesh.visible=povBike.visible=false;for(const mm of Object.values(boatMeshes))if(mm)mm.visible=false;
    const s=state.saved;controls.target.set(state.x,0,state.z);
    camera.position.set(state.x-60,70,state.z+90);camera.near=s.near;camera.fov=s.fov;camera.updateProjectionMatrix();
    controls.enabled=true;controls.update();keys.clear();
  }
  const fwd=new THREE.Vector3(),look=new THREE.Vector3();
  function update(dt){
    const m=state.mode;if(!m)return 0;
    const turnKey=(keys.has('KeyA')||keys.has('ArrowLeft')?1:0)-(keys.has('KeyD')||keys.has('ArrowRight')?1:0);
    const go=(keys.has('KeyW')||keys.has('ArrowUp')?1:0)-(keys.has('KeyS')||keys.has('ArrowDown')?1:0);
    if(AUTO.has(m)){
      // Autopilot: follow the route, slow for corners, stop on arrival (boats turn slower).
      if(state.path&&state.step>=state.path.length&&!state.arrived){state.arrived=true;onArrive?.(state.dest);}
      const tgt=state.path&&state.path[state.step];
      if(!tgt)state.speed*=Math.max(0,1-dt*2);
      if(tgt){
        const dx=tgt.x-state.x,dz=tgt.z-state.z,d=Math.hypot(dx,dz);
        if(d<2.5)state.step++;
        else{
          const want=Math.atan2(dx,dz);let diff=Math.atan2(Math.sin(want-state.heading),Math.cos(want-state.heading));
          const turn=m==='gondola'?.7:m==='boat'?1.1:1.6;
          state.heading+=THREE.MathUtils.clamp(diff,-turn*dt,turn*dt);
          const target=SPEED[m]*(1-Math.min(.7,Math.abs(diff)));state.speed+=(target-state.speed)*Math.min(1,dt*(m==='gondola'?.6:1.5));
          state.x+=Math.sin(state.heading)*state.speed*dt;state.z+=Math.cos(state.heading)*state.speed*dt;
        }
      }
    }else{
      const top=m==='bike'?SPEED.bike:(keys.has('ShiftLeft')||keys.has('ShiftRight')?SPEED.run:SPEED.walk);
      state.heading+=turnKey*dt*(m==='bike'?1.3:1.8);
      const strafe=m==='walk'?((keys.has('KeyE')?1:0)-(keys.has('KeyQ')?1:0)):0;
      state.speed+=(go*top-state.speed)*Math.min(1,dt*(m==='bike'?1.4:6));
      const vx=Math.sin(state.heading)*state.speed-Math.cos(state.heading)*strafe*top*.7,vz=Math.cos(state.heading)*state.speed+Math.sin(state.heading)*strafe*top*.7;
      const nx=state.x+vx*dt,nz=state.z+vz*dt;
      // Slide along obstacles.
      if(!blocked(nx,nz)){state.x=nx;state.z=nz;}
      else if(!blocked(nx,state.z))state.x=nx;
      else if(!blocked(state.x,nz))state.z=nz;
      else state.speed*=.3;
    }
    // On foot and on wheels the ground; a boat floats on the place's water, rocking a little.
    const boatNow=BOATS.has(m),rock=boatNow?Math.sin(performance.now()/900)*.04:0;
    const ground=boatNow?CITY.water.y:land.heightAt(state.x,state.z);state.y+=(ground-state.y)*Math.min(1,dt*8);
    state.bob+=dt*Math.abs(state.speed)*(m==='walk'?1.9:0);
    fwd.set(Math.sin(state.heading),0,Math.cos(state.heading));
    const inside=AUTO.has(m)&&!state.outside,pov=m==='bike'&&!state.outside;
    podMesh.visible=m==='taxi'&&!inside;bikeMesh.visible=m==='bike'&&!pov;povBike.visible=pov;
    // A gondola stays in view from the passengers' seat (its bow and ferro ahead); a water taxi from outside only.
    for(const [k,mm] of Object.entries(boatMeshes))if(mm){mm.visible=m===k&&(k==='gondola'||!inside);
      if(mm.visible){mm.position.set(state.x,state.y+rock,state.z);mm.rotation.set(rock*.5,state.heading,rock*.8);}}
    if(pov){
      // Rider's eye: a gentle pedalling bob, leaning into the turn; the handlebar turns with the steering.
      state.bob+=dt*Math.abs(state.speed)*1.1;
      state.lean=(state.lean||0)+((-turnKey*.09*Math.min(1,state.speed/3))-(state.lean||0))*Math.min(1,dt*4);
      camera.position.set(state.x-fwd.x*.15,state.y+1.62+Math.sin(state.bob*2)*.012,state.z-fwd.z*.15);
    }else if(m==='walk'||inside){
      // On foot: eye height with a little step bob. In the taxi: the front seat, under the canopy. In a
      // gondola: the passengers' seat behind the middle, low over the water; in the water taxi, the bench.
      if(inside&&m==='gondola')camera.position.set(state.x-fwd.x*1.0,state.y+1.25+rock,state.z-fwd.z*1.0);
      else if(inside&&m==='boat')camera.position.set(state.x+fwd.x*.4,state.y+1.75+rock,state.z+fwd.z*.4);
      else if(inside)camera.position.set(state.x+fwd.x*.6,state.y+1.42,state.z+fwd.z*.6);
      else camera.position.set(state.x,state.y+1.68+Math.sin(state.bob*2)*.035,state.z);
    }else{
      const back=m==='bike'?4.6:m==='gondola'?9:8.5,up=m==='bike'?2.3:m==='gondola'?3.2:2.7;
      camera.position.set(state.x-fwd.x*back,state.y+up,state.z-fwd.z*back);
      if(!boatNow){const mesh=m==='bike'?bikeMesh:podMesh;mesh.position.set(state.x,state.y,state.z);mesh.rotation.set(0,state.heading,m==='bike'?-turnKey*.12*Math.min(1,state.speed/3):0);}
      if(m==='bike'&&rider){const w=rider.geometry.attributes.aWalk;w.setXY(0,0,state.speed>.4?Math.min(1.5,Math.max(.5,state.speed/5.5)):0);w.needsUpdate=true;}
    }
    look.set(state.x+fwd.x*20,(m==='walk'||inside||pov?state.y+1.5:state.y+1.2)+Math.tan(state.pitch)*20,state.z+fwd.z*20);
    camera.lookAt(look);
    if(pov){
      camera.rotateZ(state.lean||0);camera.updateMatrixWorld();
      // The bike follows the body (not the look direction), so looking around shows the handlebar move away.
      // Steering turns the bars; looking around (drag) moves them off to the side.
      const bars=povBike.userData.bars;bars.rotation.y=turnKey*.16-(state.look||0);
      povBike.userData.holder.position.y=-.27+Math.sin(state.bob*2)*.006;
    }
    // Streaming and the AR layer follow the rider.
    controls.target.set(state.x+fwd.x*30,0,state.z+fwd.z*30);
    camera.userData.dist=40;
    return 40;
  }
  return {start,stop,update,addresses,ready,setDestination,remaining,water:Boolean(waterGraph),set onArrive(f){onArrive=f;},get mode(){return state.mode;},get dest(){return state.dest;},get speed(){return state.speed;},get arrived(){return state.arrived;},get boatAt(){return state.mode&&BOATS.has(state.mode)?{x:state.x,z:state.z}:null;}};
}
