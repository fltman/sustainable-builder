import * as THREE from 'three';
import { CITY } from './city-config.js';

// What lies on the ground, read from the city model itself: a grid of downward rays against the base
// tile (streets, squares, lawns, parking, quays, water). Feature placement asks this map where a
// parking lot, a lawn or a quay is, and how high the ground is there.
export const LAND={NONE:0,WATER:1,ROAD:2,PAVED:3,PARKING:4,GREEN:5,LAND:6};
const ALIAS=CITY.materialAlias||{};
const classOf=raw=>{
  const name=ALIAS[raw]||raw;
  // Generated places (wasteland-builder's generator): M_Ground_<surface>.
  if(/^M_(Container|Furniture|Fixture|Leaf|Bark|Conifer|Hedge|Roof|Window)/.test(name))return -1;
  if(/^M_Ground_Parking/.test(name))return LAND.PARKING;
  if(/^M_Ground_(Grass|Park|Cemetery|Pitch|Field|Forest)/.test(name))return LAND.GREEN;
  if(/^M_Ground_(Sidewalk|Paving|Path|Pier|Sand|Dirt)|^M_(Curb|Quay)$/.test(name))return LAND.PAVED;
  if(/Bark|Chestnut|Lime$|Elm|_Ash|Leaves|Furniture|Bench|Iron|Bronze|Gold|Hedge79|Halls|Roof|Felt|Panel|Galvanized|Aluminium|Glass/.test(name))return -1;
  if(/Water/.test(name))return LAND.WATER;
  if(/ParkingPaint/.test(name))return LAND.PARKING;
  if(/Asphalt/.test(name))return LAND.ROAD;
  if(/Grass|Lawn|Hedge|Common|Green|Flower|Reed/.test(name))return LAND.GREEN;
  if(/Slabs|Setts|Cobbles|Granite|Paving|Gravel|Kerb|Sand/.test(name))return LAND.PAVED;
  return LAND.LAND;
};
// top: where the rays start (above the highest ground); maxY: hits above it are not ground.
export async function scanLand(baseMeshes,{minX=-1000,maxX=480,minZ=-360,maxZ=420,step=4,isRoad=null,top=60,maxY=14}={}){
  const nx=Math.ceil((maxX-minX)/step),nz=Math.ceil((maxZ-minZ)/step);
  const kind=new Uint8Array(nx*nz),height=new Float32Array(nx*nz);
  const ray=new THREE.Raycaster(),down=new THREE.Vector3(0,-1,0),o=new THREE.Vector3();
  const meshes=baseMeshes.filter(m=>m.geometry.boundsTree||m.geometry.index);
  for(const m of meshes)if(!m.userData.bounds){m.geometry.computeBoundingBox();m.userData.bounds=m.geometry.boundingBox.clone().applyMatrix4(m.matrixWorld);}
  let last=performance.now();
  for(let j=0;j<nz;j++){
    const z=minZ+(j+.5)*step;
    const row=meshes.filter(m=>m.userData.bounds.min.z<=z&&m.userData.bounds.max.z>=z);
    for(let i=0;i<nx;i++){
      const x=minX+(i+.5)*step;
      o.set(x,top,z);ray.set(o,down);ray.far=top+20;
      const hits=ray.intersectObjects(row.filter(m=>m.userData.bounds.min.x<=x&&m.userData.bounds.max.x>=x),false);
      // Ignore steep faces (walls, kerbs' sides); the first upward face is the ground.
      const hit=hits.find(h=>h.face&&h.point.y<maxY&&classOf(h.object.material?.name||'')>=0&&h.face.normal.clone().transformDirection(h.object.matrixWorld).y>.5);
      const k=j*nx+i;
      if(hit){kind[k]=classOf(hit.object.material.name);height[k]=hit.point.y;}else{kind[k]=LAND.NONE;height[k]=0;}
    }
    if(performance.now()-last>12){await new Promise(r=>setTimeout(r,0));last=performance.now();}
  }
  // Painted parking bays mark car parks even where the surface under them is plain ground: every
  // cell within ~8 m of the paint becomes a car park (unless it is a mapped street or paved square).
  const paint=new Uint8Array(nx*nz),v=new THREE.Vector3();
  for(const m of meshes.filter(m=>/ParkingPaint/.test(m.material?.name||''))){
    const pos=m.geometry.attributes.position;
    for(let i=0;i<pos.count;i+=1){v.fromBufferAttribute(pos,i).applyMatrix4(m.matrixWorld);const a=Math.floor((v.x-minX)/step),b=Math.floor((v.z-minZ)/step);if(a>=0&&b>=0&&a<nx&&b<nz)paint[b*nx+a]=1;}
  }
  const R=2;
  for(let j=0;j<nz;j++)for(let i=0;i<nx;i++){
    const k=j*nx+i;if(kind[k]!==LAND.LAND&&kind[k]!==LAND.ROAD)continue;
    let near=false;for(let b=Math.max(0,j-R);b<=Math.min(nz-1,j+R)&&!near;b++)for(let a=Math.max(0,i-R);a<=Math.min(nx-1,i+R);a++)if(paint[b*nx+a]){near=true;break;}
    if(near&&!(isRoad&&isRoad(minX+(i+.5)*step,minZ+(j+.5)*step)))kind[k]=LAND.PARKING;
  }
  // Parking paint is a thin decal over asphalt, so rays mostly meet the asphalt: asphalt away from any
  // mapped street is a car park (or a forecourt, which converts the same way).
  if(isRoad)for(let k=0;k<kind.length;k++)if(kind[k]===LAND.ROAD&&!isRoad(minX+(k%nx+.5)*step,minZ+(Math.floor(k/nx)+.5)*step))kind[k]=LAND.PARKING;
  const at=(x,z)=>{const i=Math.floor((x-minX)/step),j=Math.floor((z-minZ)/step);if(i<0||j<0||i>=nx||j>=nz)return -1;return j*nx+i;};
  return {
    step,minX,minZ,nx,nz,kind,height,
    kindAt(x,z){const k=at(x,z);return k<0?LAND.NONE:kind[k];},
    heightAt(x,z){const k=at(x,z);return k<0?0:height[k];},
    // Every cell of a class, as world points (cell centres).
    cells(type){const out=[];for(let k=0;k<kind.length;k++)if(kind[k]===type)out.push({x:minX+(k%nx+.5)*step,z:minZ+(Math.floor(k/nx)+.5)*step,y:height[k]});return out;}
  };
}
