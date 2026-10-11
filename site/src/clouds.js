import * as THREE from 'three';
import { FUTURE } from './future.js';

// Fair-weather cumulus over Kalmarsund (in a storm one dark, closed deck – src/weather.js): a cloud dome over the Sky, lit from the sun with silver
// edges and grey bellies. Their shadows drift across the city in post.js, from the same noise.
export const FBM=`
float cHash(vec2 p){p=fract(p*vec2(233.34,851.73));p+=dot(p,p+23.45);return fract(p.x*p.y);}
float cNoise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);
  return mix(mix(cHash(i),cHash(i+vec2(1,0)),f.x),mix(cHash(i+vec2(0,1)),cHash(i+vec2(1,1)),f.x),f.y);}
float cFbm(vec2 p){float a=.5,s=0.0;for(int i=0;i<5;i++){s+=a*cNoise(p);p=p*2.03+vec2(17.1,9.3);a*=.5;}return s;}
float cloud(vec2 xz,float t,float cover){vec2 p=xz*.0011+vec2(t*.0042,t*.0016);return smoothstep(cover,cover+.22,cFbm(p));}
`;
export function createClouds(scene,sun){
  const U={uTime:FUTURE.uTime,uCover:{value:.44},uStorm:{value:0},uSun:{value:new THREE.Vector3(0,1,0)},uDay:{value:1},uSunColor:{value:new THREE.Color(1,.95,.85)},uHeight:{value:1400}};
  const dome=new THREE.Mesh(new THREE.SphereGeometry(4000,48,24),new THREE.ShaderMaterial({
    uniforms:U,transparent:true,depthWrite:false,depthTest:true,side:THREE.BackSide,fog:false,
    vertexShader:`varying vec3 vDir;void main(){vDir=position;vec4 p=projectionMatrix*modelViewMatrix*vec4(position,1.0);gl_Position=p.xyww;}`,
    fragmentShader:`uniform float uTime,uCover,uDay,uHeight,uStorm;uniform vec3 uSun,uSunColor;varying vec3 vDir;${FBM}
      void main(){
        vec3 d=normalize(vDir);if(d.y<.005)discard;
        vec2 p=cameraPosition.xz+d.xz/(d.y+.06)*uHeight;
        float dens=cloud(p,uTime,uCover);
        float self=cloud(p+uSun.xz*260.0,uTime,uCover-.05);
        // Bright sunlit tops, soft grey-blue bellies where the cloud shades itself.
        float body=smoothstep(.0,1.0,dens);
        vec3 lit=mix(vec3(.72,.77,.86),vec3(1.0,.99,.97),1.0-.42*self*body);
        lit=mix(lit,lit*uSunColor,.3);
        // A storm: one low, heavy deck – dark slate bellies, no silver linings.
        lit=mix(lit,mix(vec3(.3,.33,.37),vec3(.46,.49,.53),1.0-self*body),uStorm);
        float rim=pow(max(dot(d,uSun),0.0),5.0)*(1.0-dens)*2.5*(1.0-uStorm);
        vec3 col=(lit+uSunColor*rim)*(.06+.94*uDay)*2.4;
        float a=dens*smoothstep(.0,.08,d.y)*mix(.96,1.0,uStorm);
        if(a<.01)discard;
        gl_FragColor=vec4(col,a);
      }`,
  }));
  dome.renderOrder=-1;dome.frustumCulled=false;scene.add(dome);
  return {
    uniforms:U,dome,
    set cover(v){U.uCover.value=v;},get cover(){return U.uCover.value;},
    update(focus,sunDir,day,camera){
      dome.position.copy(camera.position);
      U.uSun.value.copy(sunDir);U.uDay.value=day;U.uSunColor.value.copy(sun.color);
    },
  };
}
