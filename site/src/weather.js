import * as THREE from 'three';
import { FUTURE } from './future.js';

// Weather for the crises in the chronicle (data/events.js). A storm flood comes with one low, dark
// deck of cloud, rain, wind and a heavy sea with white horses; a heatwave or a drought summer with
// milky haze and lawns turned to straw; a pandemic empties the streets and squares; an energy crisis
// dims the city at night. app.js picks the weather for the year shown (weatherOf); this module eases
// into it and spreads it over the sky and the light (world.js, clouds.js, post.js), the sea and the
// lawns (future.js, flood.js), the people (residents.js, features.js), the lamps and the sound.
const CALM={storm:0,haze:0,drought:0,empty:0,dark:0};
export function weatherOf(event,{preview=false}={}){
  if(preview)return {...CALM,storm:1,empty:.7};
  if(!event)return CALM;
  const sev=event.severity??0,id=event.id||'';
  // A place's event can say it itself (events.js `weather`: {storm, haze, drought, empty, dark}, or a
  // function of the severity); otherwise a flood brings a storm and the rest go by Kalmar's event ids.
  if(event.weather)return {...CALM,...event.weather};
  if(event.level!=null)return {...CALM,storm:1,empty:.7};
  if(id.startsWith('varmebolja'))return {...CALM,haze:1,drought:.75,empty:.55};
  if(id.startsWith('torka')||id.startsWith('megatorka'))return {...CALM,haze:.55,drought:.6+.4*Math.min(1,sev*1.5)};
  if(id.startsWith('pandemi'))return {...CALM,empty:.55+.4*sev};
  if(id.startsWith('energichock')&&!event.good)return {...CALM,dark:.35+.6*sev};
  return CALM;
}
// Rain: streaks in a box that travels with the camera, falling at 8–13 m/s and slanting in the wind.
// Each drop is a thin quad from where it is to where it was a moment ago, widened on screen to a fixed
// width in pixels; the box wraps around the camera, so the drops stay put in the world as the view moves.
const RAIN_VERTEX=`attribute vec4 seed;attribute vec2 corner;uniform float uTime,uAmount,uBox,uWidth;uniform vec3 uCam;uniform vec2 uView;
varying float vA,vU;
void main(){
  float speed=8.0+5.0*fract(seed.x*91.7);
  vec3 box=vec3(uBox,uBox*.7,uBox),o=uCam-box*.5,p=seed.xyz*box;
  p.x=o.x+mod(p.x-o.x+uTime*3.0,box.x);
  p.z=o.z+mod(p.z-o.z+uTime*1.2,box.z);
  p.y=o.y+mod(p.y-uTime*speed,box.y);
  // Longer streaks when seen from further off.
  vec3 tail=p-vec3(3.0,-speed,1.2)*.06*(uBox/45.0);
  vec4 a=projectionMatrix*viewMatrix*vec4(p,1.0),b=projectionMatrix*viewMatrix*vec4(tail,1.0),c=mix(a,b,corner.y);
  vec2 d=(b.xy/b.w-a.xy/a.w)*uView;d=length(d)>1e-4?normalize(d):vec2(0.0,1.0);
  c.xy+=vec2(-d.y,d.x)*corner.x*uWidth*2.0/uView*c.w;
  vA=step(fract(seed.y*37.31+seed.z*11.7),uAmount)*step(.0,a.w)*step(.0,b.w);vU=corner.x;
  gl_Position=c;
}`;
const RAIN_FRAGMENT=`uniform vec3 uColor;varying float vA,vU;void main(){if(vA<.01)discard;gl_FragColor=vec4(uColor,vA*.42*(1.0-vU*vU));}`;

export function createWeather(scene,{world,clouds,features,renderer,lite=false}){
  // base: the weather of an ordinary summer in the year shown – lawns that yellow in a warmer climate
  // with watering bans (model.js visionOf: dry); a drought event dries them further.
  const goal={...CALM},now={...CALM},base={drought:0},ahead=new THREE.Vector3();
  const baseCover=clouds.cover;
  const N=lite?2500:6500,seed=new Float32Array(N*4);
  for(let i=0;i<N*4;i++)seed[i]=Math.random();
  const geo=new THREE.InstancedBufferGeometry();
  geo.setAttribute('position',new THREE.Float32BufferAttribute(new Float32Array(12),3));
  geo.setAttribute('corner',new THREE.Float32BufferAttribute([-1,0,1,0,-1,1,1,1],2));geo.setIndex([0,1,2,2,1,3]);
  geo.setAttribute('seed',new THREE.InstancedBufferAttribute(seed,4));geo.instanceCount=N;
  const U={uTime:FUTURE.uTime,uAmount:{value:0},uBox:{value:80},uWidth:{value:1},uCam:{value:new THREE.Vector3()},uView:{value:new THREE.Vector2(1,1)},uColor:{value:new THREE.Color(.86,.89,.93)}};
  const rain=new THREE.Mesh(geo,new THREE.ShaderMaterial({uniforms:U,vertexShader:RAIN_VERTEX,fragmentShader:RAIN_FRAGMENT,transparent:true,depthWrite:false,side:THREE.DoubleSide}));
  rain.frustumCulled=false;rain.renderOrder=4;rain.visible=false;rain.name='rain';scene.add(rain);
  return {
    goal,now,base,rain,
    set(w){Object.assign(goal,CALM,w);},
    // dist: the camera's distance to what it looks at; the rain box grows with it so a view from high
    // above still sees rain in front of it.
    update(dt,camera,dist){
      const k=1-Math.exp(-dt*1.5);
      for(const key in goal)now[key]+=(goal[key]-now[key])*k;
      world.weather.storm=now.storm;world.weather.haze=now.haze;
      clouds.uniforms.uStorm.value=now.storm;clouds.cover=baseCover-.36*now.storm+.12*now.haze*(1-now.storm);
      FUTURE.uWind.value=now.storm;FUTURE.uDrought.value=Math.max(now.drought,base.drought);
      features.weather.empty=now.empty;features.weather.dark=now.dark;
      rain.visible=now.storm>.03;
      if(rain.visible){
        // The box sits in front of the camera, where the rain is seen.
        const box=THREE.MathUtils.clamp(dist*.3,45,150);U.uBox.value=box;U.uAmount.value=now.storm;
        U.uCam.value.copy(camera.position).addScaledVector(camera.getWorldDirection(ahead),box*.38);
        renderer.getDrawingBufferSize(U.uView.value);U.uWidth.value=.8*renderer.getPixelRatio();}
    },
  };
}
