import * as THREE from 'three';
import { FUTURE } from './future.js';

// Material for the low-poly kit (meshes.js): vertex colours, instance colour only on `tint` parts,
// crowns sway in the wind, people's legs swing by their per-instance walk phase/speed.
export function kitMaterial({roughness=.85,metalness=0,transparent=false,opacity=1,emissive=0x000000,walk=false}={}){
  const m=new THREE.MeshStandardMaterial({vertexColors:true,roughness,metalness,transparent,opacity,emissive});
  m.onBeforeCompile=shader=>{
    shader.uniforms.uTime=FUTURE.uTime;
    shader.vertexShader=`uniform float uTime;attribute float sway;attribute float tint;${walk?'attribute vec2 aWalk;attribute vec3 aHair;attribute vec3 aSkin;':''}\n`+shader.vertexShader
      .replace('#include <color_vertex>',`#include <color_vertex>
        #ifdef USE_INSTANCING_COLOR
          vColor.rgb=color.rgb*mix(vec3(1.0),instanceColor.rgb,clamp(tint,0.0,1.0));
        #endif
        ${walk?'if(tint>1.5)vColor.rgb=color.rgb*(tint>2.5?aSkin:aHair);':''}`)
      .replace('#include <begin_vertex>',`#include <begin_vertex>
        #ifdef USE_INSTANCING
          vec3 iPos=vec3(instanceMatrix[3][0],instanceMatrix[3][1],instanceMatrix[3][2]);
        #else
          vec3 iPos=vec3(0.0);
        #endif
        if(sway>0.0){
          float w=sin(uTime*1.3+iPos.x*.21+iPos.z*.17)*.6+sin(uTime*2.7+iPos.x*.5)*.4;
          transformed.x+=w*sway*.6;transformed.z+=cos(uTime*1.1+iPos.z*.3)*sway*.35;
        }
        ${walk?`float swing=sin(uTime*aWalk.y*7.0+aWalk.x)*aWalk.y;
        if(sway<-0.5&&sway>-2.5){
          float side=sway<-1.5?1.0:-1.0;
          transformed.z+=side*(0.82-transformed.y)*swing*.5;
        }else if(sway<-2.5){
          // Arms swing from the shoulder, against the legs.
          float side=sway<-3.5?1.0:-1.0;
          transformed.z-=side*(1.36-transformed.y)*swing*.42;
        }
        transformed.y+=abs(sin(uTime*aWalk.y*7.0+aWalk.x))*aWalk.y*.04;`:''}`);
  };
  m.customProgramCacheKey=()=>`kit-${walk?'walk':'still'}`;
  return m;
}

// A set of placed instances that appear when a vision value passes each item's `order`, growing in
// over a short span so a decade's change reads as growth rather than popping.
export function createLayer(scene,geometry,material,items,{grow=.06,inverse=false,shadow=true,name=''}={}){
  items.sort((a,b)=>inverse?b.order-a.order:a.order-b.order);
  const mesh=new THREE.InstancedMesh(geometry,material,Math.max(1,items.length));
  mesh.name=name;mesh.castShadow=shadow;mesh.receiveShadow=true;mesh.count=0;mesh.frustumCulled=false;
  const color=new THREE.Color(),m=new THREE.Matrix4(),q=new THREE.Quaternion(),s=new THREE.Vector3(),p=new THREE.Vector3(),up=new THREE.Vector3(0,1,0);
  items.forEach((it,i)=>{mesh.setColorAt(i,color.set(it.color??0xffffff));});
  if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;
  scene.add(mesh);
  // mul: a size factor for the whole layer (trees grow as the decades pass).
  let last=-1,written=0,shown=0,lastMul=1;
  const write=(i,it,k)=>{
    const sc=(it.scale??1)*(inverse?1:(.25+.75*k))*lastMul;
    p.set(it.x,it.y??0,it.z);q.setFromAxisAngle(up,it.rot??0);s.set(sc*(it.sx??1),sc*(it.sy??1)*(inverse?1:k<1?k:1),sc*(it.sz??1));
    m.compose(p,q,s);mesh.setMatrixAt(i,m);
  };
  // Inverse layers never grow, so all their matrices are written once and only the count changes.
  if(inverse){items.forEach((it,i)=>write(i,it,1));written=items.length;mesh.instanceMatrix.needsUpdate=true;}
  const visible=(it,value)=>inverse?value<it.order:value>it.order;
  function countFor(value){let n=0;for(const it of items){if(!visible(it,value))break;n++;}return n;}
  function update(value,mul=1){
    if(Math.abs(value-last)<.0005&&Math.abs(mul-lastMul)<.004)return;last=value;lastMul=mul;
    let n=0;
    for(const it of items){
      // inverse layers (parked cars, asphalt-era things) shrink away as the value rises.
      const k=inverse?1-THREE.MathUtils.smoothstep(value,it.order-grow,it.order):THREE.MathUtils.smoothstep(value,it.order,it.order+grow);
      // Sorted so the visible items always form a prefix (inverse layers: highest order first).
      if(k<=.001)break;
      if(!inverse)write(n,it,k);
      n++;
    }
    if(!inverse)written=Math.max(written,n);
    mesh.count=shown=n;mesh.instanceMatrix.needsUpdate=true;
  }
  // For the before/after view: show the count for another value, writing any missing matrices.
  function showFor(value){
    const n=countFor(value);
    if(n>written){for(let i=written;i<n;i++)write(i,items[i],1);written=n;mesh.instanceMatrix.needsUpdate=true;}
    mesh.count=n;
  }
  return {mesh,items,update,showFor,countFor,get count(){return mesh.count;},restore(){mesh.count=shown;}};
}
