import * as THREE from 'three';
import * as K from './meshes.js';
import { kitMaterial } from './kit.js';
// Everyone drawn as a person (residents, crowds at stalls and tables, roof terraces, cyclists) goes
// through one batch API: begin(); add(variant, matrix, {mode, phase, top, hair, skin}); end().
// With the Blender crowd (src/crowd.js) each variant is its own animated instanced mesh; without it
// (files missing) the old procedural figure stands in for all of them.

export const PEOPLE=['coat','tshirt','dress','jacket','child','elder'];
const hash=x=>{const s=Math.sin(x*127.1+311.7)*43758.5453;return s-Math.floor(s);};

// Which figure draws a person of this age, and at what scale. The child model is 1.22 m tall
// (about eight years old); adults are 1.70–1.80 m.
export function figureFor(age,female,seed){
  if(age<13){const h=.78+age*.058;return {variant:'child',scale:Math.min(1.24,h/1.22)};}
  const teen=age<17?.93+(age-13)*.017:1;
  if(age>=72)return {variant:female?'elder':'coat',scale:female?1:.97};
  if(female)return {variant:hash(seed)<.5?'dress':'jacket',scale:teen};
  return {variant:hash(seed)<.55?'coat':'tshirt',scale:teen};
}

export function personBatch(scene,crowd,capacity,{castShadow=true,name='people'}={}){
  const caps=typeof capacity==='number'?Object.fromEntries(PEOPLE.map(n=>[n,capacity])):capacity;
  if(crowd){const b=crowd.makeBatch({capacity:caps,castShadow});b.group.name=name;scene.add(b.group);return b;}
  // Fallback: one mesh of the old figure, sitting shown as standing a little lower.
  const total=Object.values(caps).reduce((a,b)=>a+b,0)||1;
  const g=K.person();
  const walk=new THREE.InstancedBufferAttribute(new Float32Array(total*2),2),hair=new THREE.InstancedBufferAttribute(new Float32Array(total*3),3),skin=new THREE.InstancedBufferAttribute(new Float32Array(total*3),3);
  g.setAttribute('aWalk',walk);g.setAttribute('aHair',hair);g.setAttribute('aSkin',skin);
  const mesh=new THREE.InstancedMesh(g,kitMaterial({walk:true}),total);mesh.count=0;mesh.castShadow=castShadow;mesh.frustumCulled=false;mesh.name=name;scene.add(mesh);
  const c=new THREE.Color(),m=new THREE.Matrix4(),drop=new THREE.Matrix4().makeTranslation(0,-.25,0);let n=0;
  const rgb=(x,arr,i)=>{if(x==null)return;if(Array.isArray(x))arr.setXYZ(i,x[0],x[1],x[2]);else{c.set(x);arr.setXYZ(i,c.r,c.g,c.b);}};
  return {group:mesh,fallback:true,
    begin(){n=0;},
    add(variant,matrix,{mode=1,phase=0,top=null,hair:h=null,skin:s=null}={}){
      if(n>=total)return -1;const i=n++;
      mesh.setMatrixAt(i,mode>1.5?m.multiplyMatrices(drop,matrix):matrix);walk.setXY(i,phase,mode>.5&&mode<=1.5?1:0);
      if(top!=null){if(Array.isArray(top))c.setRGB(top[0],top[1],top[2]);else c.set(top);mesh.setColorAt(i,c);}
      rgb(h,hair,i);rgb(s,skin,i);return i;},
    end(){mesh.count=n;mesh.instanceMatrix.needsUpdate=true;if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;walk.needsUpdate=hair.needsUpdate=skin.needsUpdate=true;},
    count:()=>n,
  };
}

// The walking cadence multiplier shared by all people variants (feet stay planted when it matches
// how fast the simulation moves people).
export function setWalkRate(crowd,rate){
  if(!crowd)return;
  for(const v of crowd.variants)if(v.name!=='cyclist')v.material.userData.crowd.crowdWalkRate.value=rate;
}
