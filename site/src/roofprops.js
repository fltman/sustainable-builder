import * as THREE from 'three';
import * as K from './meshes.js';
import { kitMaterial } from './kit.js';
import { personBatch, PEOPLE } from './folk.js';

// Depth on the flat roofs, matching the roof the shader paints (future.js): shrubs and the odd birch
// on sedum, grass tufts in the meadows, raised beds, small greenhouses and gardeners on the kitchen
// roofs, potted trees, parasol tables and people on the terraces, and tilted solar rows over sedum
// on the biosolar roofs. Roofs are found by casting rays into each streamed full-detail tile, so the
// props exist where the city is drawn in detail and disappear with the tile.
const fr=x=>x-Math.floor(x),f=Math.fround;
// Mirrors fCell in future.js (float32 steps) so both pick the same order and design for a roof cell.
export function hashCell(cx,cz,r){
  let px=f(fr(f(cx*.1031))),py=f(fr(f(cz*.1030))),pz=f(fr(f(r*.0973)));
  const d=f(f(px*f(py+33.33))+f(py*f(pz+33.33))+f(pz*f(px+33.33)));px=f(px+d);py=f(py+d);pz=f(pz+d);
  return fr(f(f(px+py)*pz));
}
const rand=(x,z,k)=>fr(Math.sin(x*12.9898+z*78.233+k*37.719)*43758.5453);
export function createRoofProps(scene,planning,{lite=false,crowd=null}={}){
  const mat=kitMaterial();
  const glass=new THREE.MeshPhysicalMaterial({color:0xdff2ea,roughness:.08,transparent:true,opacity:.3,depthWrite:false,side:THREE.DoubleSide});
  const panelMat=kitMaterial({roughness:.3,metalness:.3});
  const TYPES={
    shrub:[K.shrub(),mat],tuft:[K.tuft(),mat],birch:[K.birch(),mat],bed:[K.gardenBed(),mat],
    gh:[K.greenhouseFrame(3,4.5,1.7),mat],ghGlass:[K.greenhouseGlass(3,4.5,1.7),glass],
    potted:[K.pottedTree(),mat],table:[K.umbrellaTable(),mat],panel:[K.panelRow(),panelMat],
  };
  const max=lite?1500:4000,meshes={};
  for(const [k,[geo,m]] of Object.entries(TYPES)){const im=new THREE.InstancedMesh(geo,m,max);im.count=0;im.castShadow=k!=='ghGlass';im.receiveShadow=true;im.frustumCulled=false;im.name='roof '+k;scene.add(im);meshes[k]=im;}
  // People on the terraces: standing about, in the crowd's figures (src/folk.js).
  const maxPeople=lite?300:900,people=personBatch(scene,crowd,Object.fromEntries(PEOPLE.map(n=>[n,maxPeople])),{name:'roof people'});
  const looks=K.personLooks(64,23);
  const perTile=new Map(),queue=[];let dirty=true;
  const ray=new THREE.Raycaster(),down=new THREE.Vector3(0,-1,0),o=new THREE.Vector3(),n=new THREE.Vector3();
  const SHIRTS=[0xd9534f,0x3b7dd8,0xf0ad4e,0x5cb85c,0x8e44ad,0xf4f4f4,0x2c3e50,0xe67e22,0x1abc9c];
  const GREENS=[0xffffff,0xe3f2d6,0xf6f1d4,0xdcebd8,0xfbe8c6];
  function addTile(t){if(t.id==='base'||t.far)return;queue.push({t,j:0,grid:new Map(),done:false});}
  function removeTile(t){if(perTile.delete(t.id))dirty=true;const i=queue.findIndex(q=>q.t===t);if(i>=0)queue.splice(i,1);}
  const STEP=3.4;
  // Sample a few rows of one tile per call, inside a time budget.
  function work(budget=2.5){
    const start=performance.now();
    while(queue.length&&performance.now()-start<budget){
      const q=queue[0],t=q.t;
      if(t.state!=='loaded'){queue.shift();continue;}
      const x0=Math.ceil(t.min[0]/STEP)*STEP,z0=Math.ceil(t.min[2]/STEP)*STEP,nx=Math.floor((t.max[0]-x0)/STEP)+1,nz=Math.floor((t.max[2]-z0)/STEP)+1;
      for(;q.j<nz&&performance.now()-start<budget;q.j++){
        const z=z0+q.j*STEP;
        for(let i=0;i<nx;i++){
          const x=x0+i*STEP;o.set(x,t.max[1]+4,z);ray.set(o,down);ray.far=t.max[1]+8;ray.firstHitOnly=true;
          const hit=ray.intersectObjects(t.meshes,false)[0];
          if(!hit||hit.point.y<4)continue;
          n.copy(hit.face.normal).transformDirection(hit.object.matrixWorld);
          if(Math.abs(n.y)<.95)continue;
          q.grid.set(i+','+q.j,hit.point.y);
        }
      }
      if(q.j>=nz){
        queue.shift();
        const props=[];
        for(const [key,y] of q.grid){
          const [i,j]=key.split(',').map(Number);
          // Interior roof points only: all four neighbours are roof at the same height.
          if(![[1,0],[-1,0],[0,1],[0,-1]].every(([a,b])=>{const v=q.grid.get((i+a)+','+(j+b));return v!==undefined&&Math.abs(v-y)<.3;}))continue;
          const x=x0+i*STEP,z=z0+j*STEP,r=planning.sample(x,z)[0];
          if(r>=.999)continue;
          const ro=r>0?Math.min(.98,Math.max(.001,r+(hashCell(Math.floor(x/11),Math.floor(z/11),r)-.5)*.14)):hashCell(Math.floor(x/16),Math.floor(z/16),0)*.98;
          const kind=fr(ro*613.7),design=fr(ro*97.13),h=rand(x,z,1),h2=rand(x,z,2),rot=Math.floor(h2*4)*Math.PI/2;
          const add=(type,green,o={})=>props.push({type,green,ro,kind,x:x+(o.dx??(h-.5)*1.2),y:y+(o.dy??0),z:z+(o.dz??(h2-.5)*1.2),rot:o.rot??h*6.28,s:o.s??1,color:o.color});
          // Biosolar: a tilted row on every other band, matching the shader's rows (2.9 m pitch).
          if(fr(z/2.9)<.62)add('panel',false,{dx:0,dz:0,rot:0});
          if(design<.42){if(h<.22)add('shrub',true,{s:.5+h2*.5,color:GREENS[Math.floor(h2*5)]});else if(h<.26)add('birch',true,{s:.55+h2*.3});}
          else if(design<.68){if(h<.45)add('tuft',true,{s:.8+h2*.6});else if(h<.53)add('shrub',true,{s:.6+h2*.4,color:GREENS[Math.floor(h2*5)]});else if(h<.57)add('birch',true,{s:.6+h2*.35});}
          else if(design<.86){
            if(h<.62)add('bed',true,{dx:0,dz:0,rot:Math.floor(design*20)%2*Math.PI/2});
            else if(h<.68){add('gh',true,{dx:0,dz:0,rot:Math.floor(design*20)%2*Math.PI/2});add('ghGlass',true,{dx:0,dz:0,rot:Math.floor(design*20)%2*Math.PI/2});}
            else if(h<.76)add('person',true,{color:SHIRTS[Math.floor(h2*9)]});
          }else{
            if(h<.16)add('potted',true,{s:.8+h2*.5});else if(h<.27)add('table',true,{rot});else if(h<.37)add('person',true,{color:SHIRTS[Math.floor(h2*9)]});
          }
        }
        perTile.set(t.id,props);dirty=true;
      }
    }
  }
  const m=new THREE.Matrix4(),qt=new THREE.Quaternion(),p=new THREE.Vector3(),s=new THREE.Vector3(),up=new THREE.Vector3(0,1,0),c=new THREE.Color();
  let last={cover:-1,ratio:-1,day:null},timer=0;
  function update(dt,v,hour=14){
    work(lite?1.5:2.5);
    timer-=dt;
    // People on the roofs between morning and late evening only.
    const day=hour>=7&&hour<22;
    const changed=Math.abs(v.roofCover-last.cover)>.004||Math.abs(v.greenRatio-last.ratio)>.01||day!==last.day;
    if(!dirty&&!(changed&&timer<=0))return;
    dirty=false;timer=.25;last={cover:v.roofCover,ratio:v.greenRatio,day};
    const counts=Object.fromEntries(Object.keys(meshes).map(k=>[k,0]));people.begin();
    for(const props of perTile.values())for(const pr of props){
      if(v.roofCover<pr.ro)continue;
      const green=pr.kind<v.greenRatio+.25;
      // Panels stand on the solar roofs; everything else on the green ones.
      if(pr.type==='panel'?green:!green)continue;
      if(pr.type==='person'){
        if(!day)continue;
        const h=rand(pr.x,pr.z,5),i=Math.floor(rand(pr.x,pr.z,6)*64);
        p.set(pr.x,pr.y,pr.z);qt.setFromAxisAngle(up,pr.rot);s.setScalar(1);m.compose(p,qt,s);
        people.add(PEOPLE[Math.floor(h*PEOPLE.length)],m,{mode:0,phase:pr.x*.37+pr.z,top:pr.color,
          hair:[looks.hair.getX(i),looks.hair.getY(i),looks.hair.getZ(i)],skin:[looks.skin.getX(i),looks.skin.getY(i),looks.skin.getZ(i)]});
        continue;
      }
      const im=meshes[pr.type],k=counts[pr.type];if(k>=max)continue;
      p.set(pr.x,pr.y,pr.z);qt.setFromAxisAngle(up,pr.rot);s.setScalar(pr.s);m.compose(p,qt,s);im.setMatrixAt(k,m);
      if(pr.color!==undefined)im.setColorAt(k,c.set(pr.color));else if(im.instanceColor)im.setColorAt(k,c.set(0xffffff));
      counts[pr.type]=k+1;
    }
    people.end();
    for(const [k,im] of Object.entries(meshes)){im.count=counts[k];im.instanceMatrix.needsUpdate=true;if(im.instanceColor)im.instanceColor.needsUpdate=true;}
  }
  return {addTile,removeTile,update,stats:()=>({tiles:perTile.size,queued:queue.length,...Object.fromEntries(Object.entries(meshes).map(([k,im])=>[k,im.count])),people:people.count()})};
}
