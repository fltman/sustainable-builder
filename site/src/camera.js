import * as THREE from 'three';
import { MapControls } from 'three/addons/controls/MapControls.js';
import { CITY } from './city-config.js';

// Sims-style camera: drag to pan across the city, right-drag (or two fingers) to turn and tilt,
// wheel/pinch to zoom from rooftop level to the whole island. WASD/arrows pan, Q/E turn.
// flyTo() glides to a place; follow() keeps a resident in view.
const VIEW=CITY.camera;
export function createCamera(renderer,{bounds=VIEW.bounds}={}){
  const camera=new THREE.PerspectiveCamera(40,innerWidth/innerHeight,.5,9000);
  camera.position.set(...VIEW.position);
  const controls=new MapControls(camera,renderer.domElement);
  controls.target.set(...VIEW.target);
  controls.enableDamping=true;controls.dampingFactor=.08;
  controls.minDistance=5;controls.maxDistance=VIEW.maxDistance??1400;controls.maxPolarAngle=1.5;controls.minPolarAngle=.12;
  controls.zoomToCursor=true;controls.screenSpacePanning=false;
  controls.update();
  const keys=new Set();
  // Keys typed into a field, or used by the timeline slider and the tabs, are not for the camera.
  addEventListener('keydown',e=>{if(e.target.closest?.('input,textarea,select,[role=slider],[role=tablist]'))return;keys.add(e.code);});
  addEventListener('keyup',e=>keys.delete(e.code));
  addEventListener('blur',()=>keys.clear());
  let flight=null,followed=null,onUser=null;
  // Anything the user does with the camera (drag, wheel, keys, the map buttons) – so a camera that
  // follows the story on its own can step aside.
  const user=()=>onUser?.();
  const v=new THREE.Vector3(),offset=new THREE.Vector3();
  // A wish for less motion (the system setting) turns the camera's glides into cuts.
  const still=matchMedia('(prefers-reduced-motion: reduce)');
  function flyTo(target,{distance=null,polar=null,azimuth=null,duration=2.2,arc=true}={}){
    if(still.matches)duration=.001;
    followed=null;
    offset.copy(camera.position).sub(controls.target);
    const sph=new THREE.Spherical().setFromVector3(offset);
    const to=new THREE.Spherical(distance??sph.radius,polar??sph.phi,azimuth??sph.theta);
    flight={t:0,duration,arc,fromTarget:controls.target.clone(),toTarget:new THREE.Vector3(target.x,target.y??0,target.z),from:sph.clone(),to};
  }
  function follow(getter){followed=getter;flight=null;}
  function update(dt){
    if(flight){
      flight.t+=dt;const k=Math.min(1,flight.t/flight.duration),e=k<.5?4*k*k*k:1-Math.pow(-2*k+2,3)/2;
      controls.target.lerpVectors(flight.fromTarget,flight.toTarget,e);
      let dTheta=flight.to.theta-flight.from.theta;dTheta=Math.atan2(Math.sin(dTheta),Math.cos(dTheta));
      const s=new THREE.Spherical(THREE.MathUtils.lerp(flight.from.radius,flight.to.radius,e)*(1+(flight.arc?Math.sin(Math.PI*e)*.25:0)),THREE.MathUtils.lerp(flight.from.phi,flight.to.phi,e),flight.from.theta+dTheta*e);
      camera.position.setFromSpherical(s).add(controls.target);
      if(k>=1)flight=null;
    }else if(followed){
      const p=followed();if(p){v.set(p.x,p.y??0,p.z);const delta=v.sub(controls.target).multiplyScalar(Math.min(1,dt*3));controls.target.add(delta);camera.position.add(delta);}
    }
    const dist=camera.position.distanceTo(controls.target);
    const pan=dist*.9*dt;
    const forward=new THREE.Vector3().subVectors(controls.target,camera.position).setY(0).normalize(),right=new THREE.Vector3(-forward.z,0,forward.x);
    const move=new THREE.Vector3();
    if(keys.has('KeyW')||keys.has('ArrowUp'))move.add(forward);
    if(keys.has('KeyS')||keys.has('ArrowDown'))move.sub(forward);
    if(keys.has('KeyD')||keys.has('ArrowRight'))move.add(right);
    if(keys.has('KeyA')||keys.has('ArrowLeft'))move.sub(right);
    if(move.lengthSq()){followed=null;flight=null;user();move.normalize().multiplyScalar(pan);controls.target.add(move);camera.position.add(move);}
    const turn=(keys.has('KeyQ')?1:0)-(keys.has('KeyE')?1:0);
    if(turn){user();offset.copy(camera.position).sub(controls.target).applyAxisAngle(new THREE.Vector3(0,1,0),turn*dt*1.2);camera.position.copy(controls.target).add(offset);}
    // Keep the view over the modelled city.
    const t=controls.target,cx=THREE.MathUtils.clamp(t.x,bounds.minX,bounds.maxX)-t.x,cz=THREE.MathUtils.clamp(t.z,bounds.minZ,bounds.maxZ)-t.z;
    if(cx||cz){t.x+=cx;t.z+=cz;camera.position.x+=cx;camera.position.z+=cz;}
    controls.update(dt);
    // Depth precision: the model has roof layers a few centimetres apart. With a fixed 0.5 m near
    // plane they z-fight (flicker) when seen from a few hundred metres, so the near plane follows
    // the viewing distance (0.5 m at street level, ~10 m over the whole island).
    camera.userData.dist=dist;
    const near=THREE.MathUtils.clamp(dist*.018,.5,18);
    if(Math.abs(near-camera.near)/camera.near>.08){camera.near=near;camera.updateProjectionMatrix();}
    return dist;
  }
  // Map controls (buttons): smooth steps around the current target.
  function orbit({zoom=1,turn=0,tilt=0,duration=.45}={}){
    user();
    offset.copy(camera.position).sub(controls.target);
    const sph=new THREE.Spherical().setFromVector3(offset);
    flyTo(controls.target,{distance:THREE.MathUtils.clamp(sph.radius*zoom,controls.minDistance,controls.maxDistance),
      polar:THREE.MathUtils.clamp(sph.phi+tilt,controls.minPolarAngle,controls.maxPolarAngle),azimuth:sph.theta+turn,duration,arc:false});
  }
  // North up: azimuth 0 looks along −z (north) from the south.
  function north(){user();offset.copy(camera.position).sub(controls.target);const sph=new THREE.Spherical().setFromVector3(offset);flyTo(controls.target,{azimuth:0,polar:sph.phi,duration:.9,arc:false});}
  function home(){user();flyTo({x:VIEW.target[0],y:VIEW.target[1],z:VIEW.target[2]},{...VIEW.home,duration:1.6});}
  const heading=()=>{offset.copy(camera.position).sub(controls.target);return Math.atan2(offset.x,offset.z);};
  function resize(){camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();}
  controls.addEventListener('start',()=>{flight=null;user();});
  return {camera,controls,update,flyTo,orbit,north,home,heading,follow,resize,get following(){return !!followed;},stopFollow(){followed=null;},
    get flying(){return Boolean(flight);},set onUser(fn){onUser=fn;}};
}
