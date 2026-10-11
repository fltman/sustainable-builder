import * as THREE from 'three';
import { EffectComposer, RenderPass, EffectPass, BloomEffect, Effect, BlendFunction, EffectAttribute } from 'postprocessing';
import { FBM } from './clouds.js';
import { N8AOPostPass } from 'n8ao';

// The film look: N8AO ambient occlusion grounds the buildings, trees and people; bloom lets lamps,
// windows and sun glints breathe; one grading pass does exposure, AgX tone mapping, a gentle
// filmic S-curve with warm highlights and cool shadows, a vignette and a little grain.
// Rendering goes through a 4× multisampled half-float buffer.
const LOOK=`
uniform float exposure,contrast,saturation,vignette,grain,time,warm;
${THREE.ShaderChunk.tonemapping_pars_fragment.replace('uniform float toneMappingExposure;','float toneMappingExposure=1.0;')}
void mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){
  vec3 c=inputColor.rgb*exposure;
  c=AgXToneMapping(c);
  float l=dot(c,vec3(.2126,.7152,.0722));
  c=mix(vec3(l),c,saturation);
  c=clamp((c-.5)*contrast+.5,0.0,1.0);
  // Split toning: warm highlights, slightly cool shadows.
  c+=mix(vec3(-.008,.0,.014),vec3(.024,.01,-.016),smoothstep(.15,.85,l));
  // Heat: a warm, dusty cast.
  c+=vec3(.04,.016,-.03)*warm;
  vec2 d=uv-.5;c*=1.0-vignette*smoothstep(.25,.95,dot(d,d)*2.2);
  float n=fract(sin(dot(uv*vec2(12.9898,78.233)+time,vec2(1.0,1.0)))*43758.5453)-.5;
  c+=n*grain;
  outputColor=vec4(max(c,0.0),inputColor.a);
}`;
class LookEffect extends Effect{
  constructor(){
    super('LookEffect',LOOK,{blendFunction:BlendFunction.SET,uniforms:new Map([
      ['exposure',new THREE.Uniform(1)],['contrast',new THREE.Uniform(1.13)],['saturation',new THREE.Uniform(1.05)],
      ['vignette',new THREE.Uniform(.28)],['grain',new THREE.Uniform(.012)],['time',new THREE.Uniform(0)],['warm',new THREE.Uniform(0)]])});
  }
}
// Cloud shadows in screen space: each visible pixel's world position (from depth) looks up the cloud
// straight towards the sun above it and darkens by the cloud's density. Only seen pixels pay.
const CLOUD_SHADOW=`
uniform mat4 projInv,camWorld;uniform vec3 sunDir;uniform float cTime,cCover,cHeight,cStrength;
${FBM}
void mainImage(const in vec4 inputColor,const in vec2 uv,const in float depth,out vec4 outputColor){
  outputColor=inputColor;
  if(depth>=.9999||cStrength<=0.0)return;
  vec4 v=projInv*vec4(uv*2.0-1.0,depth*2.0-1.0,1.0);v/=v.w;
  vec3 w=(camWorld*v).xyz;
  vec2 at=w.xz+sunDir.xz/max(sunDir.y,.15)*(cHeight-w.y);
  float shade=cloud(at,cTime,cCover+.04);
  outputColor.rgb*=1.0-cStrength*shade;
}`;
class CloudShadowEffect extends Effect{
  constructor(){
    super('CloudShadowEffect',CLOUD_SHADOW,{attributes:EffectAttribute.DEPTH,uniforms:new Map([
      ['projInv',new THREE.Uniform(new THREE.Matrix4())],['camWorld',new THREE.Uniform(new THREE.Matrix4())],['sunDir',new THREE.Uniform(new THREE.Vector3(0,1,0))],
      ['cTime',new THREE.Uniform(0)],['cCover',new THREE.Uniform(.44)],['cHeight',new THREE.Uniform(1400)],['cStrength',new THREE.Uniform(.32)]])});
  }
}
export function createPost(renderer,scene,camera,{lite=false}={}){
  renderer.toneMapping=THREE.NoToneMapping;
  const composer=new EffectComposer(renderer,{frameBufferType:THREE.HalfFloatType,multisampling:lite?0:2});
  composer.addPass(new RenderPass(scene,camera));
  const ao=new N8AOPostPass(scene,camera,innerWidth,innerHeight);
  Object.assign(ao.configuration,{aoRadius:5,distanceFalloff:1.4,intensity:2.6,aoSamples:lite?8:16,denoiseSamples:lite?4:8,denoiseRadius:10,halfRes:true,depthAwareUpsampling:true,gammaCorrection:false,screenSpaceRadius:false});
  composer.addPass(ao);
  const bloom=new BloomEffect({intensity:.55,luminanceThreshold:.92,luminanceSmoothing:.18,mipmapBlur:true,radius:.62});
  const look=new LookEffect(),shadows=new CloudShadowEffect();
  composer.addPass(new EffectPass(camera,shadows,bloom,look));
  let clouds=null;
  let enabled=true;
  return {
    composer,ao,bloom,look,shadows,
    get enabled(){return enabled;},
    set enabled(v){enabled=v;renderer.toneMapping=v?THREE.NoToneMapping:THREE.AgXToneMapping;},
    setSize(w,h){composer.setSize(w,h);ao.setSize?.(w*renderer.getPixelRatio(),h*renderer.getPixelRatio());},
    // exposure comes from the sky (world.js writes renderer.toneMappingExposure); night lifts bloom.
    setClouds(c){clouds=c;},
    // weather: {storm, haze} – an overcast storm has no cloud shadows and greyer colours; heat haze
    // bleaches them a little.
    render(dt,night=0,weather=null){
      const storm=weather?.storm??0,haze=weather?.haze??0;
      if(clouds){const u=shadows.uniforms,U=clouds.uniforms;u.get('projInv').value.copy(camera.projectionMatrixInverse);u.get('camWorld').value.copy(camera.matrixWorld);
        u.get('sunDir').value.copy(U.uSun.value);u.get('cTime').value=U.uTime.value;u.get('cCover').value=U.uCover.value;u.get('cHeight').value=U.uHeight.value;
        u.get('cStrength').value=.34*THREE.MathUtils.smoothstep(U.uSun.value.y,.04,.25)*(1-storm);}
      look.uniforms.get('saturation').value=1.05-.3*storm-.04*haze;look.uniforms.get('contrast').value=1.13-.06*storm-.05*haze;look.uniforms.get('warm').value=haze;
      look.uniforms.get('exposure').value=renderer.toneMappingExposure*1.22;
      look.uniforms.get('time').value+=dt;
      bloom.intensity=.45+.9*night;
      // (The AO radius stays fixed: changing any N8AO setting resets its history and blanks a frame.)
      composer.render(dt);
    },
  };
}
