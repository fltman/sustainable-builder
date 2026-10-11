import * as THREE from 'three';
import { CITY } from './city-config.js';
import { Sky } from 'three/addons/objects/Sky.js';
import { FUTURE } from './future.js';

// The place's sky, sun and day at its latitude (CITY.lat): in Sweden midsummer days are long and the
// sun stays low in winter.
// `hour` runs the Sims-style clock; the environment map is rebuilt from the sky only when the sun has
// moved enough to matter.
export function createWorld(scene,renderer,{lite=false,tune={}}={}){
  const T={exposure:.5,env:.24,hemi:.52,sun:3.4,...tune};
  const sky=new Sky();sky.scale.setScalar(20000);scene.add(sky);
  const u=sky.material.uniforms;u.turbidity.value=4.5;u.rayleigh.value=1.4;u.mieCoefficient.value=.004;u.mieDirectionalG.value=.82;
  const sun=new THREE.DirectionalLight(0xfff1dc,3.2);sun.castShadow=!lite;
  sun.shadow.mapSize.set(lite?1024:3072,lite?1024:3072);sun.shadow.bias=-.0004;sun.shadow.normalBias=.6;
  scene.add(sun,sun.target);
  const hemi=new THREE.HemisphereLight(0xcfe3ff,0x5d6b4a,.9);scene.add(hemi);
  scene.fog=new THREE.Fog(0xc8d6e2,700,4200);
  const pmrem=new THREE.PMREMGenerator(renderer);
  const envScene=new THREE.Scene();const envSky=new Sky();envSky.scale.setScalar(1000);envScene.add(envSky);
  let envTarget=null,lastEnvElevation=null,lastEnvWeather=0,envDay=1,lastEnvAt=0;
  // Weather for the crises (src/weather.js eases these): storm 0–1 overcast, wind and rain; haze 0–1
  // the milky air of a heatwave or a drought summer.
  const weather={storm:0,haze:0};
  const fogStorm=new THREE.Color(0x6f7a84),fogHaze=new THREE.Color(0xd9ccb0);
  const dir=new THREE.Vector3(),fogDay=new THREE.Color(0xc9d8e4),fogDusk=new THREE.Color(0xe0a87c),fogNight=new THREE.Color(0x0d1626),tmp=new THREE.Color();
  let hour=13.5,dayOfYear=172;
  // Solar position (simple declination model) for the place's latitude.
  function solar(h,day){
    const lat=CITY.lat*Math.PI/180,decl=23.44*Math.PI/180*Math.sin(2*Math.PI*(284+day)/365);
    const ha=(h-12.2)*15*Math.PI/180;
    const el=Math.asin(Math.sin(lat)*Math.sin(decl)+Math.cos(lat)*Math.cos(decl)*Math.cos(ha));
    let az=Math.atan2(Math.sin(ha),Math.cos(ha)*Math.sin(lat)-Math.tan(decl)*Math.cos(lat));
    return {elevation:el,azimuth:az};
  }
  function update(focus,span=300){
    const {elevation,azimuth}=solar(hour,dayOfYear);
    // azimuth 0 = south. World: +x east, +z south.
    dir.set(Math.sin(azimuth)*Math.cos(elevation)*-1,Math.sin(elevation),Math.cos(azimuth)*Math.cos(elevation)).normalize();
    u.sunPosition.value.copy(dir);
    const day=THREE.MathUtils.smoothstep(elevation,-.12,.12),golden=1-THREE.MathUtils.smoothstep(elevation,.05,.45);
    const night=1-day;FUTURE.uNight.value=THREE.MathUtils.smoothstep(night,.2,.9);
    const light=Math.max(elevation,.02);
    // The shadow frustum moves in 16 m steps, so a shadow map rendered every other frame still fits.
    const fx=Math.round(focus.x/16)*16,fz=Math.round(focus.z/16)*16;
    sun.position.set(fx+dir.x*600,Math.max(40,dir.y*600),fz+dir.z*600);sun.target.position.set(fx,0,fz);
    const {storm,haze}=weather;
    sun.intensity=T.sun*THREE.MathUtils.smoothstep(elevation,-.02,.25)*(1-.8*storm)*(1+.1*haze);
    sun.color.setRGB(1,.94-golden*.25,.86-golden*.45);
    // A heatwave's sun is yellow-white through the haze.
    if(haze>0)sun.color.lerp(tmp.setRGB(1,.86,.64),haze*.5);
    // After dusk the same light becomes a cool moon high in the south-east.
    if(elevation<-.02){const m=THREE.MathUtils.smoothstep(-elevation,.02,.15);sun.position.set(fx+250,500,fz+300);sun.color.setRGB(.6,.72,1);sun.intensity=1.25*m*(1-.85*storm);}
    hemi.intensity=T.hemi*(.95+.05*day)*(1+.35*storm);hemi.color.setRGB(.42+.43*day,.52+.38*day,.95+.05*day);hemi.groundColor.setRGB(.25*day+.05,.3*day+.05,.22*day+.06);
    // Under a storm the sky light is grey and even.
    if(storm>0)hemi.color.lerp(tmp.setRGB(.7*day+.1,.74*day+.1,.78*day+.12),storm*.8);
    const s=Math.max(120,span*1.2);const cam=sun.shadow.camera;
    if(cam.right!==s){cam.left=-s;cam.right=s;cam.top=s;cam.bottom=-s;cam.near=1;cam.far=1800;cam.updateProjectionMatrix();}
    tmp.copy(fogDay).lerp(fogDusk,golden*day*.7);
    // Rain closes the view in grey; heat haze in a warm, milky light.
    if(haze>0)tmp.lerp(fogHaze,haze*.6);if(storm>0)tmp.lerp(fogStorm,storm*.85);
    tmp.lerp(fogNight,night);scene.fog.color.copy(tmp);
    scene.fog.near=700*(1-.8*storm-.35*haze*(1-storm));scene.fog.far=4200*(1-.62*storm-.3*haze*(1-storm));
    u.turbidity.value=4.5+5.5*storm+3*haze;u.rayleigh.value=1.4-.9*storm+.4*haze;u.mieCoefficient.value=.004+.006*haze+.004*storm;
    // Eye adaptation: a low sun gives less light, so exposure opens up towards dusk (as a camera would).
    renderer.toneMappingExposure=T.exposure*(.85+.15*day)*(1+1.25*golden*day+1.5*night)*(1-.06*storm);
    // At most four rebuilds a second, so a time-lapse day (the century playing) stays light on the GPU.
    const envNow=performance.now();
    if(lastEnvElevation===null||(Math.abs(lastEnvElevation-elevation)>.03||Math.abs(lastEnvWeather-storm-haze)>.2)&&(envNow-lastEnvAt>250||Math.abs(lastEnvElevation-elevation)>.25)){
      lastEnvElevation=elevation;lastEnvAt=envNow;lastEnvWeather=storm+haze;envDay=day;
      for(const k of ['turbidity','rayleigh','mieCoefficient','mieDirectionalG'])envSky.material.uniforms[k].value=u[k].value;
      envSky.material.uniforms.sunPosition.value.copy(dir);
      envTarget?.dispose();envTarget=pmrem.fromScene(envScene,0,.1,1000);
      scene.environment=envTarget.texture;
    }
    scene.environmentIntensity=T.env*(.3+.7*envDay)*(1-.15*storm);
    return {elevation,day,night};
  }
  return {sky,sun,hemi,update,weather,
    get hour(){return hour;},set hour(h){hour=((h%24)+24)%24;},
    get dayOfYear(){return dayOfYear;},set dayOfYear(d){dayOfYear=d;lastEnvElevation=null;}};
}
