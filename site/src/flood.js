import * as THREE from 'three';
import { FUTURE } from './future.js';
import { CITY } from './city-config.js';
import { STREETS_FLOOD } from './model.js';
// The sea on land. The 3D city stands on level ground (y = 0 is about 1.5 m RH 2000, the sea surface
// y = -1.36 is 0.14 m), so a storm is drawn as one flat water surface at its real level, shown only on
// the ground the sea actually reaches: public/terrain/flood.png (tools/flood-map.mjs, from Lantmäteriet's
// elevation model) holds each 2 m cell's ground and the level at which the sea first gets there. On
// Kvarnholmen a built flood wall raises that level to the wall's crest until it is overtopped. The
// model's sea is one plane under the whole map, so it may rise only to just below the ground (SEA_CAP);
// above that this surface carries the storm over the nearby sea as well, fading out towards the edges
// of the elevation data, so harbour and streets meet at one waterline.
// The place's water (CITY.water): its everyday level (m RH 2000) and the model's water surface y; the
// 3D ground (y = 0) stands for the level 1.2–1.5 m above it (Kalmar: MEAN_SEA .14, GROUND_3D 1.5).
export const MEAN_SEA=CITY.water.level,GROUND_3D=CITY.water.level-CITY.water.y,SEA_CAP=GROUND_3D-.22;

export async function createFlood(scene){
  let meta=null,tex=null;
  if(typeof __PACK__!=='undefined'&&!__PACK__.flood)return {update:()=>0,set(){},mesh:null,ready:false};
  try{
    meta=await (await fetch('city/terrain/flood.json')).json();
    tex=await new THREE.TextureLoader().loadAsync('city/terrain/flood.png');
  }catch{return {update:()=>0,set(){},mesh:null,ready:false};}
  tex.flipY=false;tex.colorSpace=THREE.NoColorSpace;tex.generateMipmaps=false;tex.minFilter=tex.magFilter=THREE.LinearFilter;tex.needsUpdate=true;
  const W=meta.w*meta.step,H=meta.h*meta.step;
  // Heights in the map are metres above meta.base (0 m RH 2000 in Kalmar; just under the lake elsewhere).
  const U={uFlood:{value:tex},uFloodRect:{value:new THREE.Vector4(meta.x0,meta.z0,1/W,1/H)},uLevel:{value:0},uProtect:{value:STREETS_FLOOD},uBase:{value:meta.base??0},uTime:FUTURE.uTime,uWind:FUTURE.uWind};
  const geo=new THREE.PlaneGeometry(W,H).rotateX(-Math.PI/2).translate(meta.x0+W/2,0,meta.z0+H/2);
  const mat=new THREE.MeshStandardMaterial({color:0xffffff,roughness:.1,metalness:0,transparent:true,envMapIntensity:.6});
  mat.onBeforeCompile=sh=>{
    Object.assign(sh.uniforms,U);
    sh.vertexShader='varying vec3 vFW;\n'+sh.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\n  vFW=(modelMatrix*vec4(transformed,1.0)).xyz;');
    sh.fragmentShader=`uniform sampler2D uFlood;uniform vec4 uFloodRect;uniform float uLevel,uProtect,uBase,uTime,uWind;varying vec3 vFW;
float flN(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);vec2 o=vec2(1,0);
  #define H2(q) fract(sin(dot(q,vec2(127.1,311.7)))*43758.5453)
  return mix(mix(H2(i),H2(i+o.xy),f.x),mix(H2(i+o.yx),H2(i+1.0),f.x),f.y);}
float flWave(vec2 p){return flN(p*.35+vec2(uTime*.12,uTime*.07))+flN(p*1.1-vec2(uTime*.3,-uTime*.2))*.45;}
`+sh.fragmentShader
      .replace('#include <color_fragment>',`#include <color_fragment>
  float flMargin;
  {
    vec3 f=texture2D(uFlood,(vFW.xz-uFloodRect.xy)*uFloodRect.zw).rgb*(255.0/40.0);f.rg+=uBase;
    // Open water is drawn by the water itself; the core (blue channel) sits behind the wall when built.
    float thr=(f.b>3.0&&uProtect>${(STREETS_FLOOD+.05).toFixed(2)})?max(f.g,uProtect):f.g;
    flMargin=uLevel-thr;
    // Open water joins in once the storm stands above the model's sea (which stops just below the ground).
    float sea=1.0-step(${(MEAN_SEA+.11).toFixed(2)},f.r),seaOn=step(${(GROUND_3D-.08).toFixed(2)},uLevel);
    vec2 uv=(vFW.xz-uFloodRect.xy)*uFloodRect.zw,edge=min(uv,1.0-uv)/uFloodRect.zw;
    float fade=sea>.5?seaOn*smoothstep(0.0,260.0,min(edge.x,edge.y)):1.0;
    float wet=smoothstep(0.0,.05,flMargin)*fade;
    if(wet<.01)discard;
    // Storm water: brown-grey with silt over the land, sea-dark further out, a pale foam line at its edge.
    vec3 silt=mix(vec3(.11,.105,.085),vec3(.05,.075,.075),smoothstep(0.0,.8,uLevel-f.r));
    silt=mix(silt,vec3(.025,.075,.085),sea);
    float foam=(1.0-sea)*(1.0-smoothstep(.0,.06,flMargin))*(.6+.4*flN(vFW.xz*2.0+uTime));
    diffuseColor.rgb=mix(silt,vec3(.62,.62,.58),foam*.7);
    diffuseColor.a=wet;
  }`)
      .replace('#include <normal_fragment_maps>',`#include <normal_fragment_maps>
  {float e=.3,h=flWave(vFW.xz),hx=flWave(vFW.xz+vec2(e,0.0)),hz=flWave(vFW.xz+vec2(0.0,e));
   float amp=.5*(1.0+2.0*uWind);normal=normalize(mat3(viewMatrix)*normalize(vec3(-(hx-h)/e*amp,1.0,-(hz-h)/e*amp)));}`);
  };
  mat.customProgramCacheKey=()=>'flood-v3';
  const mesh=new THREE.Mesh(geo,mat);mesh.name='flood';mesh.receiveShadow=true;mesh.renderOrder=1;mesh.frustumCulled=false;
  scene.add(mesh);

  // level: the water level to show (m RH 2000) – a storm or a preview – or null for the everyday sea.
  let target=null,cur=null;
  return {mesh,ready:true,
    set(level){target=level;},
    // Eases toward the storm; returns the surge above the mean sea for the sea surface to follow.
    update(dt,v){
      const mean=MEAN_SEA+(v?.seaRise??0),goal=target??mean;
      cur=cur===null?goal:cur+(goal-cur)*(1-Math.exp(-dt*(target!==null?1.4:2.2)));
      U.uLevel.value=cur;U.uProtect.value=STREETS_FLOOD+(v?.wall??0);
      mesh.position.y=Math.max(0,cur-GROUND_3D)+.04;
      mesh.visible=cur>mean+.02;
      return Math.max(0,cur-mean);
    },
  };
}
