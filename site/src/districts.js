import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { FUTURE } from './future.js';
import { LAND } from './landuse.js';
import { hash } from './planning.js';
import { kitMaterial } from './kit.js';
import * as K from './meshes.js';
import { CITY } from './city-config.js';

// What the city builds where the cars stood: timber neighbourhoods (Sjökvarteren) on the big car
// parks south and west of Kvarnholmen – four to seven storeys of cross-laminated timber with
// balconies full of plants and green roofs – and Odlingstornet, a twisting vertical farm by the
// station. Buildings rise floor by floor as the vision's `housing` and `tower` values grow.
const FLOOR=3.1;
const FACADE=`#include <color_fragment>
  {
    vec3 n=normalize(vDN);float wall=1.0-step(.5,abs(n.y));
    vec2 tng=normalize(vec2(n.z,-n.x)+1e-4);
    float u=dot(vDW.xz,tng),h=vDW.y-vDBase;
    float floorI=floor(h/${FLOOR.toFixed(1)}),fy=fract(h/${FLOOR.toFixed(1)});
    float bay=fract(u/3.0),bayI=floor(u/3.0);
    // Vertical timber battens with board-to-board colour variation.
    float batten=fract(u/.14);float board=fract(sin(floor(u/.14)*91.7+floorI*13.1)*4375.5);
    vec3 wood=diffuseColor.rgb*(.82+.25*board)*(1.0-.25*smoothstep(.82,1.0,batten));
    // Windows: tall on the ground floor, then one per bay.
    float ground=step(floorI,.5);
    float win=wall*step(.18,bay)*step(bay,.82)*mix(step(.28,fy)*step(fy,.88),step(.08,fy)*step(fy,.94),ground);
    float frame=win*(1.0-step(.21,bay)*step(bay,.79)*step(.31,fy)*step(fy,.85));
    vec3 glass=vec3(.012,.018,.024)+vec3(.02,.03,.035)*fract(sin(bayI*12.9+floorI*7.3)*437.5);
    float lit=step(1.0-uLit,fract(sin(bayI*3.7+floorI*11.1+vDBase)*917.3))*uNight;
    dGlass=win-frame;dLit=lit*dGlass;
    vec3 col=mix(wood,glass,dGlass);col=mix(col,vec3(.86,.84,.8),frame);
    // Roof: a green roof with a row of panels.
    float roof=step(.5,n.y);
    vec2 ruv=vDW.xz/6.0;vec3 g=pow(textureGrad(uTex,vec3(ruv,${'1.0'}),dFdx(ruv),dFdy(ruv)).rgb,vec3(2.2))*vec3(.85,1.0,.78);
    col=mix(col,g,roof);
    diffuseColor.rgb=wall>.5||roof>.5?col:diffuseColor.rgb;
  }`;
function timberMaterial(){
  const m=new THREE.MeshStandardMaterial({color:0xffffff,roughness:.8,metalness:0});
  m.onBeforeCompile=shader=>{
    shader.uniforms.uTex=FUTURE.uTex;shader.uniforms.uNight=FUTURE.uNight;shader.uniforms.uLit=FUTURE.uLit;
    shader.vertexShader='varying vec3 vDW;varying vec3 vDN;varying float vDBase;\n'+shader.vertexShader.replace('#include <begin_vertex>',`#include <begin_vertex>
      vDW=(modelMatrix*instanceMatrix*vec4(transformed,1.0)).xyz;
      vDN=normalize(mat3(modelMatrix)*mat3(instanceMatrix)*objectNormal);
      vDBase=instanceMatrix[3][1];`);
    shader.fragmentShader='uniform highp sampler2DArray uTex;uniform float uNight,uLit;varying vec3 vDW;varying vec3 vDN;varying float vDBase;\n'+shader.fragmentShader
      .replace('void main() {','void main() {\n  float dGlass=0.0,dLit=0.0;')
      .replace('#include <color_fragment>',FACADE)
      .replace('#include <roughnessmap_fragment>','#include <roughnessmap_fragment>\n  roughnessFactor=mix(roughnessFactor,.32,dGlass);')
      .replace('#include <emissivemap_fragment>','#include <emissivemap_fragment>\n  totalEmissiveRadiance+=vec3(1.0,.7,.42)*dLit*1.5;');
  };
  m.customProgramCacheKey=()=>'timber-v2';
  return m;
}
// A unit box standing on y = 0 (instances scale it to each building).
const unitBox=()=>new THREE.BoxGeometry(1,1,1).translate(0,.5,0);

export function createDistricts(scene,planning,land,{lite=false}={}){
  // Car-park clusters by 48 m cell.
  const groups=new Map();
  for(const c of land.cells(LAND.PARKING)){const k=Math.floor(c.x/48)+','+Math.floor(c.z/48);if(!groups.has(k))groups.set(k,[]);groups.get(k).push(c);}
  const cellSet=new Set(land.cells(LAND.PARKING).map(c=>Math.round(c.x)+','+Math.round(c.z)));
  const onLot=(x,z)=>cellSet.has((Math.floor((x-land.minX)/land.step)*land.step+land.minX+land.step/2)+','+(Math.floor((z-land.minZ)/land.step)*land.step+land.minZ+land.step/2));
  const clusters=[...groups.entries()].map(([k,cells])=>{const xs=cells.map(c=>c.x),zs=cells.map(c=>c.z);
    return {k,cells,n:cells.length,minX:Math.min(...xs)-2,maxX:Math.max(...xs)+2,minZ:Math.min(...zs)-2,maxZ:Math.max(...zs)+2,cx:xs.reduce((a,b)=>a+b)/xs.length,cz:zs.reduce((a,b)=>a+b)/zs.length,y:cells.reduce((a,c)=>a+c.y,0)/cells.length};})
    .filter(c=>planning.onIsland(c.cx,c.cz));
  // The tower stands on the big lot by the station; housing on the large lots of the south shore and the west.
  const station=CITY.station||{x:0,z:0};
  const towerSite=clusters.filter(c=>c.n>=80).sort((a,b)=>Math.hypot(a.cx-station.x,a.cz-station.z)-Math.hypot(b.cx-station.x,b.cz-station.z))[0];
  const housingLots=clusters.filter(c=>c!==towerSite&&c.n>=40&&c.cz>40);
  const used=new Set(housingLots.map(c=>c.k));if(towerSite)used.add(towerSite.k);
  const blocks=[];
  let seed=1;const R=()=>hash(seed++*1.37);
  for(const lot of housingLots){
    const w=lot.maxX-lot.minX,d=lot.maxZ-lot.minZ,alongX=w>=d;
    const depth=12,gap=13,len=alongX?w:d,across=alongX?d:w;
    const rows=Math.max(1,Math.floor((across+gap)/(depth+gap)));
    const order=.05+R()*.85;
    for(let r=0;r<rows;r++){
      const off=(r-(rows-1)/2)*(depth+gap);
      // Split each row into houses 18–30 m long with passages between.
      let s=-len/2+3;
      while(s<len/2-12){
        const L=Math.min(len/2-3-s,16+R()*14);if(L<10)break;
        const mid=s+L/2;
        const x=alongX?lot.cx+mid-(lot.cx-(lot.minX+lot.maxX)/2):lot.cx+off;
        const z=alongX?lot.cz+off:lot.cz+mid-(lot.cz-(lot.minZ+lot.maxZ)/2);
        const sx=alongX?L:depth,sz=alongX?depth:L;
        // Most of the footprint must be car park, none of it street or an existing building.
        let ok=0,tot=0,bad=false;
        for(let a=-.45;a<=.45;a+=.15)for(let b=-.45;b<=.45;b+=.15){const px=x+a*sx,pz=z+b*sz;tot++;if(onLot(px,pz))ok++;const rd=planning.roadAt(px,pz,0);if(planning.buildingAt(px,pz,1.5)||(rd?.car&&rd.kind!=='service'))bad=true;}
        // Parking aisles (service ways) are part of the lot; real streets and buildings are not.
        if(!bad&&ok/tot>.6){
          const floors=4+Math.floor(R()*4);
          blocks.push({x,z,y:lot.y,sx,sz,floors,order:Math.min(.97,order+R()*.08),wood:[0xd2a878,0xa9a296,0xc8955a,0x4a4642,0xe0c39a,0xb98a5e][Math.floor(R()*6)],alongX,lot:lot.k});
        }
        s+=L+4+R()*3;
      }
    }
  }
  blocks.sort((a,b)=>a.order-b.order);
  // Buildings: lower body plus a set-back top floor.
  const timber=timberMaterial();
  const body=new THREE.InstancedMesh(unitBox(),timber,Math.max(1,blocks.length*2));body.castShadow=body.receiveShadow=true;body.frustumCulled=false;body.count=0;body.name='timber houses';scene.add(body);
  for(let i=0;i<blocks.length;i++){const c=new THREE.Color(blocks[i].wood);body.setColorAt(i*2,c);body.setColorAt(i*2+1,c.clone().multiplyScalar(.92));}
  // Balconies with planters on the long facades, every other bay from the first floor up.
  const balconyGeo=mergeGeometries([new THREE.BoxGeometry(2.6,.16,1.3).translate(0,0,.65),new THREE.BoxGeometry(2.6,.5,.04).translate(0,.33,1.28),new THREE.BoxGeometry(2.2,.35,.35).translate(0,.25,1.0)].map(g=>g.toNonIndexed()),false);
  const balconyMat=new THREE.MeshStandardMaterial({color:0xdcd6cc,roughness:.6});
  const balconies=new THREE.InstancedMesh(balconyGeo,balconyMat,6000);balconies.castShadow=true;balconies.frustumCulled=false;balconies.count=0;scene.add(balconies);
  const plantGeo=K.shrub();const plants=new THREE.InstancedMesh(plantGeo,kitMaterial(),6000);plants.frustumCulled=false;plants.count=0;scene.add(plants);
  const balc=[];
  for(const [bi,b] of blocks.entries()){
    const longX=b.sx>=b.sz,L=longX?b.sx:b.sz,D=longX?b.sz:b.sx;
    for(const side of [-1,1])for(let f=1;f<b.floors-1;f++)for(let u=-L/2+3;u<=L/2-3;u+=6){
      const off=D/2,px=longX?b.x+u:b.x+side*off,pz=longX?b.z+side*off:b.z+u;
      const rot=longX?(side>0?0:Math.PI):(side>0?Math.PI/2:-Math.PI/2);
      balc.push({bi,f,x:px,z:pz,y:b.y+f*FLOOR,rot,h:hash(bi*31+f*7+u)});
    }
  }
  // Odlingstornet: sixteen twisting floors of timber and glass, planted on every terrace.
  let tower=null;
  if(towerSite){
    const tx=towerSite.cx,tz=towerSite.cz,ty=towerSite.y,floors=16,fh=4.2;
    const slabs=[],glassG=[];
    for(let i=0;i<floors;i++){
      const g=new THREE.CylinderGeometry(13,13,.7,8);g.rotateY(i*.13);g.translate(0,i*fh+.35,0);slabs.push(g.toNonIndexed());
      const q=new THREE.CylinderGeometry(11,11,fh-.7,8,1,true);q.rotateY(i*.13);q.translate(0,i*fh+.7+(fh-.7)/2,0);glassG.push(q.toNonIndexed());
    }
    // Growing racks behind the glass: green shelves that glow pink-white under grow lights at night.
    const racks=[];for(let i=0;i<floors;i++){const g=new THREE.CylinderGeometry(9.5,9.5,fh-1.4,16,1,true);g.translate(0,i*fh+.7+(fh-1.4)/2+.2,0);racks.push(g.toNonIndexed());}
    const rackMat=new THREE.MeshStandardMaterial({color:0x4f8a3a,roughness:.9,side:THREE.DoubleSide,emissive:0xff8fe0,emissiveIntensity:0});
    rackMat.onBeforeCompile=sh=>{sh.fragmentShader=sh.fragmentShader.replace('#include <color_fragment>','#include <color_fragment>\n  {float st=fract(vRackY*1.6);diffuseColor.rgb*=.55+.6*step(.35,st);}');
      sh.vertexShader='varying float vRackY;\n'+sh.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\n  vRackY=position.y;');sh.fragmentShader='varying float vRackY;\n'+sh.fragmentShader;};
    const rackMesh=new THREE.Mesh(mergeGeometries(racks.map(g=>{g.deleteAttribute('uv');return g;}),false),rackMat);
    const core=new THREE.CylinderGeometry(4,4,floors*fh+6,10);core.translate(0,(floors*fh+6)/2,0);slabs.push(core.toNonIndexed());
    const crown=new THREE.CylinderGeometry(15,13,1,8);crown.rotateY(floors*.13);crown.translate(0,floors*fh+.5,0);slabs.push(crown.toNonIndexed());
    const slabMesh=new THREE.Mesh(mergeGeometries(slabs.map(g=>{g.deleteAttribute('uv');return g;}),false),new THREE.MeshStandardMaterial({color:0xb98d5c,roughness:.75}));
    const glassMat=new THREE.MeshPhysicalMaterial({color:0xcfe9e4,roughness:.05,metalness:0,transparent:true,opacity:.16,depthWrite:false,side:THREE.DoubleSide,envMapIntensity:.5});
    const glassMesh=new THREE.Mesh(mergeGeometries(glassG.map(g=>{g.deleteAttribute('uv');return g;}),false),glassMat);
    slabMesh.castShadow=true;slabMesh.receiveShadow=true;
    const group=new THREE.Group();group.add(slabMesh,rackMesh,glassMesh);group.position.set(tx,ty,tz);scene.add(group);
    // Planting on each terrace edge.
    const tp=new THREE.InstancedMesh(K.shrub(),kitMaterial(),floors*12);tp.castShadow=true;tp.frustumCulled=false;
    const m=new THREE.Matrix4(),q=new THREE.Quaternion(),s=new THREE.Vector3(),p=new THREE.Vector3();let n=0;
    for(let i=0;i<floors;i++)for(let k=0;k<12;k++){const a=k/12*Math.PI*2+i*.13;p.set(tx+Math.cos(a)*12.2,ty+i*fh+.7,tz+Math.sin(a)*12.2);q.setFromAxisAngle(THREE.Object3D.DEFAULT_UP,a);s.setScalar(.9+hash(i*12+k)*.5);m.compose(p,q,s);tp.setMatrixAt(n++,m);}
    tp.count=n;scene.add(tp);
    tower={group,glassMat,rackMat,plants:tp,x:tx,z:tz,y:ty,height:floors*fh+6,floors};
  }
  const m=new THREE.Matrix4(),q=new THREE.Quaternion(),p=new THREE.Vector3(),s=new THREE.Vector3(),up=new THREE.Vector3(0,1,0);
  let last={housing:-1,tower:-1};
  function setVision(v){
    const housing=v.housing??0,tv=v.tower??0;
    if(Math.abs(housing-last.housing)>.002){
      last.housing=housing;let n=0;const built=[];
      for(const [bi,b] of blocks.entries()){
        const k=THREE.MathUtils.smoothstep(housing,b.order,b.order+.08);if(k<=.001)continue;
        // Rises floor by floor.
        const floorsNow=Math.max(1,Math.ceil(b.floors*k));
        const lowH=Math.min(floorsNow,b.floors-1)*FLOOR;
        q.setFromAxisAngle(up,0);
        p.set(b.x,b.y,b.z);s.set(b.sx,lowH,b.sz);m.compose(p,q,s);body.setMatrixAt(n,m);body.setColorAt(n,new THREE.Color(b.wood));n++;
        if(floorsNow>=b.floors){const longX=b.sx>=b.sz;p.set(b.x,b.y+lowH,b.z);s.set(longX?b.sx-4:b.sx-3,FLOOR,longX?b.sz-3:b.sz-4);m.compose(p,q,s);body.setMatrixAt(n,m);body.setColorAt(n,new THREE.Color(b.wood).multiplyScalar(.9));n++;}
        built.push({bi,floors:floorsNow});
      }
      body.count=n;body.instanceMatrix.needsUpdate=true;if(body.instanceColor)body.instanceColor.needsUpdate=true;
      const done=new Map(built.map(b=>[b.bi,b.floors]));let nb=0,np=0;
      for(const bc of balc){const f=done.get(bc.bi);if(!f||bc.f>=f)continue;
        p.set(bc.x,bc.y,bc.z);q.setFromAxisAngle(up,bc.rot);s.set(1,1,1);m.compose(p,q,s);balconies.setMatrixAt(nb++,m);
        if(bc.h<.7){const off=new THREE.Vector3(0,.45,1.0).applyQuaternion(q);p.add(off);s.setScalar(.45+bc.h*.3);m.compose(p,q,s);plants.setMatrixAt(np++,m);}
      }
      balconies.count=nb;plants.count=np;balconies.instanceMatrix.needsUpdate=true;plants.instanceMatrix.needsUpdate=true;
    }
    if(tower&&Math.abs(tv-last.tower)>.002){
      last.tower=tv;const k=THREE.MathUtils.smoothstep(tv,0,1);
      tower.group.visible=k>.01;tower.plants.visible=k>.6;tower.group.scale.set(1,Math.max(.02,k),1);
    }
  }
  function update(){if(tower)tower.rackMat.emissiveIntensity=FUTURE.uNight.value*.9;}
  return {blocks,tower,towerSite,housingLots,usedLots:used,setVision,update,stats:()=>({blocks:blocks.length,balconies:balc.length,shown:body.count,tower:Boolean(tower)})};
}
