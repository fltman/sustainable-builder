import * as THREE from 'three';
import * as K from './meshes.js';
import { kitMaterial } from './kit.js';
import { hash } from './planning.js';

// Street life in motion: cars on the streets that are still car streets, bikes everywhere, and small
// shared autonomous shuttles on the main routes once the city has chosen them. Vehicles wander the
// street graph; counts follow the vision (cars fade as the streets are depaved). With the Blender
// models loaded, cars and shuttles use vehicles.glb and the cyclists are the crowd's animated rider.
const CAR_COLORS=[0x8a8f96,0x2a2f36,0xe8e8e8,0x7a1e22,0x2c4a72,0xb8b8b8,0x4a4f55,0x1d1f22];
const BIKE_COLORS=[0xd9534f,0x3b7dd8,0xf0ad4e,0x5cb85c,0x8e44ad,0xf4f4f4,0x2c3e50,0xe67e22];
export function createTraffic(scene,graph,land,{max={car:180,bike:260,pod:28},crowd=null,vehicles=null}={}){
  const types={
    car:{geo:vehicles?.car2026||K.parkedCar(),mat:kitMaterial({roughness:.35,metalness:.4}),speed:8.5,lane:.27,colors:CAR_COLORS,edge:(e,v)=>e.car&&e.order>v.depave+.02},
    bike:{geo:K.bike(),mat:kitMaterial(),speed:4.2,lane:.42,colors:BIKE_COLORS,edge:e=>e.kind!=='steps',rider:Boolean(crowd?.byName.cyclist)},
    pod:{geo:vehicles?.robotaxi||K.pod(),mat:kitMaterial({roughness:.3,metalness:.2}),speed:5,lane:.22,colors:[0xffffff],edge:e=>e.car&&e.w>=6},
  };
  const fleets={};
  const looks=K.personLooks(64,41);
  for(const [name,t] of Object.entries(types)){
    // Riders pedal in step with their speed (the cyclist clip covers 5.5 m per loop).
    if(t.rider){const batch=crowd.makeBatch({capacity:{cyclist:max[name]}});batch.group.name='cyclists';scene.add(batch.group);fleets[name]={...t,batch,agents:[],want:0};continue;}
    const mesh=new THREE.InstancedMesh(t.geo,t.mat,max[name]);mesh.count=0;mesh.castShadow=true;mesh.frustumCulled=false;mesh.name=name+'s';
    mesh.setColorAt(0,new THREE.Color());
    scene.add(mesh);fleets[name]={...t,mesh,agents:[],want:0};
  }
  let vision={depave:0,cars:0,bikes:0,pods:0};
  const pickEdge=(fleet,seed)=>{
    const ok=graph.edges.filter(e=>fleet.edge(e,vision)&&e.len>4);if(!ok.length)return null;
    return ok[Math.floor(hash(seed)*ok.length)];
  };
  let seed=1;
  function spawn(fleet){
    const e=pickEdge(fleet,seed++);if(!e)return null;
    const i=Math.floor(hash(seed++)*64);
    return {e,from:hash(seed++)<.5?e.a:e.b,t:hash(seed++)*e.len,speed:fleet.speed*(.8+hash(seed++)*.4),color:new THREE.Color(fleet.colors[Math.floor(hash(seed++)*fleet.colors.length)]),
      phase:hash(seed++)*60,hair:[looks.hair.getX(i),looks.hair.getY(i),looks.hair.getZ(i)],skin:[looks.skin.getX(i),looks.skin.getY(i),looks.skin.getZ(i)]};
  }
  // activity: how much of the city is out at this hour (night ≈ 0.05, day 1).
  let activity=1;
  function wants(){
    const a=activity;
    const n=(m,v)=>Math.max(0,Math.round(m*v))||0;
    fleets.car.want=n(max.car,vision.cars*(.12+.88*a));fleets.bike.want=n(max.bike,vision.bikes*a);fleets.pod.want=n(max.pod,vision.pods*(.3+.7*a));
  }
  function setActivity(a){if(Math.abs(a-activity)>.01){activity=a;wants();}}
  function setVision(v){
    vision=v;wants();
    // Cars on a street that has just been depaved leave it at once.
    fleets.car.agents=fleets.car.agents.filter(a=>fleets.car.edge(a.e,v));
  }
  const m=new THREE.Matrix4(),q=new THREE.Quaternion(),p=new THREE.Vector3(),s=new THREE.Vector3(1,1,1),up=new THREE.Vector3(0,1,0);
  // pace: how much faster than real time the street runs (scales the riders' cadence).
  function update(dt,focus,range=420,pace=1){
    if(fleets.bike.batch)crowd.byName.cyclist.material.userData.crowd.crowdWalkRate.value=pace;
    for(const fleet of Object.values(fleets)){
      fleet.batch?.begin();
      while(fleet.agents.length<fleet.want){const a=spawn(fleet);if(!a)break;fleet.agents.push(a);}
      if(fleet.agents.length>fleet.want)fleet.agents.length=fleet.want;
      let n=0;
      for(const a of fleet.agents){
        a.t+=a.speed*dt;
        let guard=0;
        while(a.t>a.e.len&&guard++<4){
          a.t-=a.e.len;const at=graph.other(a.e,a.from);
          const next=graph.nodes[at].edges.filter(e=>e!==a.e&&fleet.edge(e,vision));
          // At a dead end the same edge is taken back.
          if(next.length)a.e=next[Math.floor(hash(seed++)*next.length)];
          a.from=at;
        }
        const A=graph.nodes[a.from],B=graph.nodes[graph.other(a.e,a.from)],k=Math.min(1,a.t/a.e.len);
        const dx=(B.x-A.x)/a.e.len,dz=(B.z-A.z)/a.e.len,off=a.e.w*fleet.lane;
        const x=A.x+(B.x-A.x)*k-dz*off,z=A.z+(B.z-A.z)*k+dx*off;a.x=x;a.z=z;
        if(Math.abs(x-focus.x)>range||Math.abs(z-focus.z)>range)continue;
        p.set(x,land.heightAt(x,z),z);q.setFromAxisAngle(up,Math.atan2(dx,dz));m.compose(p,q,s);
        if(fleet.batch){fleet.batch.add('cyclist',m,{mode:Math.min(1.5,Math.max(.5,a.speed/5.5)),phase:a.phase,top:a.color,hair:a.hair,skin:a.skin});n++;continue;}
        fleet.mesh.setColorAt(n,a.color);fleet.mesh.setMatrixAt(n++,m);
      }
      if(fleet.batch){fleet.batch.end();continue;}
      fleet.mesh.count=n;fleet.mesh.instanceMatrix.needsUpdate=true;fleet.mesh.instanceColor.needsUpdate=true;
    }
  }
  return {setVision,setActivity,update,fleets,stats:()=>Object.fromEntries(Object.entries(fleets).map(([k,f])=>[k,f.agents.length]))};
}
