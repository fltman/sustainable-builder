import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

// Low-poly kit for the 2126 city: vertex-coloured, instancing-friendly, readable from Sims height.
const paint=(g,color)=>{const c=new THREE.Color(color),n=g.attributes.position.count,a=new Float32Array(n*3);for(let i=0;i<n;i++){a[i*3]=c.r;a[i*3+1]=c.g;a[i*3+2]=c.b;}g.setAttribute('color',new THREE.BufferAttribute(a,3));return g;};
// Marks vertices that sway in the wind (1 = crown tip) in the uv.x slot's companion attribute.
const sway=(g,amount)=>{const n=g.attributes.position.count,a=new Float32Array(n);const p=g.attributes.position;for(let i=0;i<n;i++)a[i]=amount*Math.max(0,p.getY(i));g.setAttribute('sway',new THREE.BufferAttribute(a,1));return g;};
// tint=1 parts take the instance colour (crowns, car bodies, clothes); the rest keep their paint.
const prep=(g,color,s=0,tint=0)=>{g=g.index?g.toNonIndexed():g;g.deleteAttribute('uv');paint(g,color);sway(g,s);g.setAttribute('tint',new THREE.BufferAttribute(new Float32Array(g.attributes.position.count).fill(tint),1));g.computeVertexNormals();return g;};
const merge=list=>mergeGeometries(list,false);
const T=(g,x,y,z,sx=1,sy=sx,sz=sx,ry=0)=>{g.scale(sx,sy,sz);if(ry)g.rotateY(ry);g.translate(x,y,z);return g;};

function crown(radius,detail=1,seed=1){
  const g=new THREE.IcosahedronGeometry(radius,detail),p=g.attributes.position;
  for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i),n=1+.16*Math.sin(x*3.1+seed)*Math.cos(z*2.7+y*1.9+seed);p.setXYZ(i,x*n,y*n*.85,z*n);}
  return g;
}
// A leafy crown from many lobes. Normals point away from the crown's centre (soft, painterly light
// instead of facets) and the colour darkens towards the inside and the underside (baked occlusion).
function leafyCrown(radius,height,lobes,seed,color){
  const parts=[],base=new THREE.Color(color),cy=height;
  for(let i=0;i<lobes;i++){
    const a=i*2.399+seed,el=Math.acos(1-2*((i+.5)/lobes)),r=radius*(.55+.25*Math.sin(i*1.7+seed));
    const lx=Math.sin(el)*Math.cos(a)*radius*.62,ly=Math.cos(el)*radius*.5,lz=Math.sin(el)*Math.sin(a)*radius*.62;
    const g=new THREE.IcosahedronGeometry(r,1),p=g.attributes.position;
    for(let k=0;k<p.count;k++){const x=p.getX(k),y=p.getY(k),z=p.getZ(k),n=1+.14*Math.sin(x*5.1+seed)*Math.cos(z*4.3+y*3.7);p.setXYZ(k,x*n+lx,y*n*.9+ly+cy,z*n+lz);}
    parts.push(g.index?g.toNonIndexed():g);
  }
  const g=mergeGeometries(parts.map(q=>{q.deleteAttribute('uv');q.deleteAttribute('normal');return q;}),false);
  const p=g.attributes.position,n=new Float32Array(p.count*3),col=new Float32Array(p.count*3),sw=new Float32Array(p.count),tint=new Float32Array(p.count).fill(1),c=new THREE.Color();
  for(let k=0;k<p.count;k++){
    const x=p.getX(k),y=p.getY(k)-cy,z=p.getZ(k),len=Math.hypot(x,y*1.2,z)||1;
    n[k*3]=x/len;n[k*3+1]=y*1.2/len;n[k*3+2]=z/len;
    const outer=Math.min(1,len/radius),top=(y/radius+1)/2;
    c.copy(base).multiplyScalar(.45+.4*outer+.3*top);col[k*3]=c.r;col[k*3+1]=c.g;col[k*3+2]=c.b;
    sw[k]=.08*Math.max(0,p.getY(k));
  }
  g.setAttribute('normal',new THREE.BufferAttribute(n,3));g.setAttribute('color',new THREE.BufferAttribute(col,3));g.setAttribute('sway',new THREE.BufferAttribute(sw,1));g.setAttribute('tint',new THREE.BufferAttribute(tint,1));
  return g;
}
function trunk(h,r0,r1,color){
  const parts=[prep(T(new THREE.CylinderGeometry(r1,r0,h,7),0,h/2,0),color,.02)];
  for(let i=0;i<3;i++){const g=new THREE.CylinderGeometry(r1*.45,r1*.7,h*.45,5);g.rotateZ(.7*(i%2?1:-1));g.rotateY(i*2.1);parts.push(prep(T(g,Math.cos(i*2.1)*.35,h*.88,Math.sin(i*2.1)*.35),color,.03));}
  return parts;
}
export function streetTreeOld(){
  return merge([
    prep(T(new THREE.CylinderGeometry(.13,.2,3.2,6),0,1.6,0),0x5a4331,.02),
    prep(T(crown(2.2,1,1),0,4.6,0,1,1.05,1),0x3f6b2c,.08,1),
    prep(T(crown(1.4,1,4),.9,5.6,.4),0x4f7d33,.1,1),
    prep(T(crown(1.3,0,7),-.9,5.2,-.5),0x386026,.1,1),
  ]);
}
export function streetTree(){
  return merge([...trunk(3.4,.22,.14,0x5a4331),leafyCrown(2.6,5.2,8,1.3,0x4a7a34)]);
}
export function fruitTreeOld(){
  const parts=[prep(T(new THREE.CylinderGeometry(.1,.16,1.6,6),0,.8,0),0x6a4b33,.02),prep(T(crown(1.5,1,3),0,2.6,0,1.15,.85,1.15),0x4c7a2e,.1,1)];
  // Apples and plums on the outside of the crown.
  for(let i=0;i<9;i++){const a=i*2.4,h=2.2+Math.sin(i*1.7)*.6;parts.push(prep(T(new THREE.IcosahedronGeometry(.13,0),Math.cos(a)*1.45,h,Math.sin(a)*1.45),i%3?0xc8402a:0xe0a530,.1));}
  return merge(parts);
}
export function fruitTree(){
  const parts=[...trunk(1.7,.17,.1,0x6a4b33),leafyCrown(1.7,2.7,6,2.1,0x557f33)];
  for(let i=0;i<10;i++){const a=i*2.4,h=2.3+Math.sin(i*1.7)*.7;parts.push(prep(T(new THREE.IcosahedronGeometry(.13,1),Math.cos(a)*1.55,h,Math.sin(a)*1.55),i%3?0xc8402a:0xe0a530,.1));}
  return merge(parts);
}
export function berryBush(){
  const parts=[prep(T(crown(.7,1,2),0,.55,0,1.2,.8,1.2),0x46702c,.06)];
  for(let i=0;i<6;i++){const a=i*1.9;parts.push(prep(T(new THREE.IcosahedronGeometry(.07,0),Math.cos(a)*.8,.5+Math.sin(i)*.2,Math.sin(a)*.8),0x7d1f4a,.06));}
  return merge(parts);
}
// A raised cultivation bed with rows of greens.
export function gardenBed(){
  const parts=[prep(T(new THREE.BoxGeometry(2.4,.45,1.1),0,.225,0),0x8a6542),prep(T(new THREE.BoxGeometry(2.25,.06,.95),0,.46,0),0x3b2a1d)];
  for(let i=0;i<5;i++)for(let j=0;j<2;j++)parts.push(prep(T(crown(.2,0,i+j),-.9+i*.45,.6,-.22+j*.44,1,.8,1),i%2?0x5d9a35:0x7fae3e,.05));
  return merge(parts);
}
export function greenhouseFrame(w=6,l=10,h=2.4){
  const parts=[],post=(x,z)=>parts.push(prep(T(new THREE.BoxGeometry(.08,h,.08),x,h/2,z),0xe8e8e2));
  for(let i=0;i<=4;i++){const z=-l/2+i*l/4;post(-w/2,z);post(w/2,z);
    for(const s of [-1,1]){const g=new THREE.BoxGeometry(w/2*1.12,.07,.07);g.rotateZ(s*.5);parts.push(prep(T(g,s*w/4,h+w/4*.55,z),0xe8e8e2));}}
  parts.push(prep(T(new THREE.BoxGeometry(.08,.08,l),0,h+w/2*.55,0),0xe8e8e2));
  for(let i=0;i<3;i++)parts.push(prep(T(new THREE.BoxGeometry(w*.22,.5,l*.85),-w/3+i*w/3,.25,0),0x3f6b2c));
  return merge(parts);
}
export function greenhouseGlass(w=6,l=10,h=2.4){
  const shape=new THREE.Shape([new THREE.Vector2(-w/2,0),new THREE.Vector2(w/2,0),new THREE.Vector2(w/2,h),new THREE.Vector2(0,h+w/2*.55),new THREE.Vector2(-w/2,h)]);
  const g=new THREE.ExtrudeGeometry(shape,{depth:l,bevelEnabled:false});g.translate(0,0,-l/2);
  return g;
}
export function marketStall(){
  return merge([
    prep(T(new THREE.BoxGeometry(2.6,.9,1.2),0,.45,0),0x9b7550),
    prep(T(new THREE.BoxGeometry(2.4,.12,1.0),0,.95,0),0xd88b3a),
    ...[-1.25,1.25].flatMap(x=>[-.55,.55].map(z=>prep(T(new THREE.CylinderGeometry(.04,.04,2.3,4),x,1.15,z),0xeeeeee))),
    prep(T(new THREE.ConeGeometry(2.1,.8,4,1,true),0,2.6,0,1,1,.75,Math.PI/4),0xf2efe4),
  ]);
}
export function longTable(){
  return merge([
    prep(T(new THREE.BoxGeometry(8,.08,1),0,.78,0),0xa47a50),
    ...[-3.6,0,3.6].map(x=>prep(T(new THREE.BoxGeometry(.1,.75,.8),x,.38,0),0x6e5034)),
    prep(T(new THREE.BoxGeometry(8,.06,.35),0,.45,.85),0x8a6542),prep(T(new THREE.BoxGeometry(8,.06,.35),0,.45,-.85),0x8a6542),
    ...[-3,-1,1,3].map(x=>prep(T(new THREE.CylinderGeometry(.18,.12,.25,6),x,.95,0),[0xd45b3a,0xe6c24a,0x6aa84f,0xc9d7e8][Math.abs(x)%4|0])),
  ]);
}
export function parkedCar(){
  return merge([
    prep(T(new THREE.BoxGeometry(1.8,.65,4.3),0,.55,0),0xffffff,0,1),
    prep(T(new THREE.BoxGeometry(1.6,.55,2.3),0,1.12,-.15),0xffffff,0,1),
    prep(T(new THREE.BoxGeometry(1.62,.42,2.1),0,1.13,-.15),0x1b2229),
    ...[[-.85,1.4],[.85,1.4],[-.85,-1.35],[.85,-1.35]].map(([x,z])=>prep(T(new THREE.CylinderGeometry(.33,.33,.22,10).rotateZ(Math.PI/2),x,.33,z),0x111111)),
  ]);
}
export function bike(){
  const wheel=()=>new THREE.TorusGeometry(.34,.035,4,14);
  return merge([
    prep(T(wheel(),0,.36,.55,1,1,1,Math.PI/2),0x222222),prep(T(wheel(),0,.36,-.55,1,1,1,Math.PI/2),0x222222),
    prep(T(new THREE.BoxGeometry(.05,.05,1.0),0,.62,0),0xffffff),
    prep(T(new THREE.BoxGeometry(.05,.5,.05),0,.65,-.2),0xffffff),
    // Rider: legs, body, head.
    prep(T(new THREE.BoxGeometry(.28,.55,.2),0,.75,-.12),0x2c3e50),
    prep(T(new THREE.BoxGeometry(.38,.6,.24),0,1.3,-.05),0xffffff,0,1),
    prep(T(new THREE.SphereGeometry(.13,8,6),0,1.75,0),0xe0b896),
  ]);
}
// Shared robot taxi: a rounded two-tone body, panoramic glass canopy, light bar and flush wheels.
export function pod(){
  const body=new THREE.CapsuleGeometry(.95,2.6,6,14);body.rotateX(Math.PI/2);body.scale(1.02,.62,1);
  const canopy=new THREE.CapsuleGeometry(.82,1.7,6,14);canopy.rotateX(Math.PI/2);canopy.scale(.98,.62,1);
  const wheel=()=>new THREE.CylinderGeometry(.36,.36,.24,14).rotateZ(Math.PI/2);
  return merge([
    prep(T(body,0,.78,0),0xf2f3f1,0,1),
    prep(T(canopy,0,1.28,-.15),0x17222b),
    prep(T(new THREE.BoxGeometry(1.96,.07,3.9),0,.98,0),0x1fb5a6),
    prep(T(new THREE.BoxGeometry(1.5,.08,.06),0,.95,2.28),0xe9fbff),
    prep(T(new THREE.BoxGeometry(1.5,.08,.06),0,.95,-2.28),0xd23b3b),
    ...[[-.92,1.35],[.92,1.35],[-.92,-1.35],[.92,-1.35]].map(([x,z])=>prep(T(wheel(),x,.36,z),0x15181b)),
  ]);
}
export function turbine(){
  return merge([
    prep(T(new THREE.CylinderGeometry(1.6,3.2,110,12),0,55,0),0xf2f2ee),
    prep(T(new THREE.CylinderGeometry(5,5,4,10),0,1,0),0xd8c23a),
    prep(T(new THREE.BoxGeometry(4,4,11),0,111,1),0xf2f2ee),
  ]);
}
export function rotor(){
  const parts=[prep(T(new THREE.SphereGeometry(2.2,10,8),0,0,0),0xf2f2ee)];
  for(let i=0;i<3;i++){const g=new THREE.BoxGeometry(2.6,62,.6);g.translate(0,32,0);g.rotateZ(i*Math.PI*2/3);parts.push(prep(g,0xf2f2ee));}
  return merge(parts);
}
export function buoy(){return merge([prep(T(new THREE.SphereGeometry(.45,8,6),0,.1,0),0xe8742c)]);}
export function raft(){
  return merge([
    prep(T(new THREE.BoxGeometry(14,.6,9),0,.3,0),0x8d6e4e),
    prep(T(new THREE.BoxGeometry(13,.1,8),0,.62,0),0x40692c),
    ...[-4,0,4].flatMap(x=>[-2.5,2.5].map(z=>prep(T(crown(.9,0,x+z),x,1.2,z,1.2,.7,1.2),0x5c9438,.05))),
  ]);
}
export function floatingHome(){
  return merge([
    prep(T(new THREE.BoxGeometry(10,.8,8),0,.4,0),0x6b7378),
    prep(T(new THREE.BoxGeometry(7,3.2,6),0,2.4,0),0xd9c7a3),
    prep(T(new THREE.BoxGeometry(7.6,.3,6.6),0,4.15,0),0x3b6e2a),
    prep(T(new THREE.BoxGeometry(2.4,1.6,.1),-1.2,2.4,3.02),0x2b3640),
    prep(T(new THREE.BoxGeometry(2.4,1.6,.1),1.8,2.4,3.02),0x2b3640),
  ]);
}
export function sailboat(){
  const sail=new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,1.4,-1.8),new THREE.Vector3(0,9,-.3),new THREE.Vector3(0,1.4,2.2)]);
  sail.setIndex([0,1,2,2,1,0]);
  return merge([
    prep(T(new THREE.CapsuleGeometry(1.1,5,3,8).rotateX(Math.PI/2),0,.3,0,1,.45,1),0xf5f2ea),
    prep(T(new THREE.CylinderGeometry(.06,.06,9,4),0,5,-.3),0xdddddd),
    prep(sail,0xfbf7ef),
  ]);
}
// Flood wall segment, 1 m long, 1 m high (scaled by instance), granite with a glass parapet line.
export function wallSegment(){
  return merge([prep(T(new THREE.BoxGeometry(1.02,1,.7),0,.5,0),0x9a9389),prep(T(new THREE.BoxGeometry(1.02,.06,.8),0,1.03,0),0xc9c3b8)]);
}
// Person: legs, torso, head; uv-free, coloured per instance (torso) with skin/legs fixed.
// Person, 1.75 m: legs swing (sway −1/−2), arms counter-swing (−3/−4). tint 1 = clothes (instance
// colour), 2 = hair (aHair), 3 = skin (aSkin), 0 = fixed paint (trousers, shoes).
export function person(){
  const mark=(g,v)=>{g.attributes.sway.array.fill(v);return g;};
  const leg=(x,v)=>[mark(prep(T(new THREE.CylinderGeometry(.075,.06,.78,6),x,.43,0),0x2d3a4a),v),mark(prep(T(new THREE.BoxGeometry(.11,.07,.22),x,.035,.04),0x1d1d1f),v)];
  const arm=(x,v)=>[mark(prep(T(new THREE.CylinderGeometry(.05,.045,.56,6),x,1.08,0).rotateZ(0),0xffffff,0,1),v),mark(prep(T(new THREE.SphereGeometry(.05,6,4),x,.78,0),0xffffff,0,3),v)];
  const torso=new THREE.CylinderGeometry(.2,.16,.6,8);torso.scale(1,1,.68);
  const head=new THREE.SphereGeometry(.105,10,8);head.scale(1,1.12,1.05);
  const hair=new THREE.SphereGeometry(.112,10,6,0,Math.PI*2,0,1.35);hair.scale(1,1.1,1.08);
  return merge([...leg(-.085,-1),...leg(.085,-2),...arm(-.26,-3),...arm(.26,-4),
    prep(T(torso,0,1.13,0),0xffffff,0,1),
    prep(T(new THREE.CylinderGeometry(.045,.05,.08,6),0,1.47,0),0xffffff,0,3),
    prep(T(head,0,1.6,0),0xffffff,0,3),
    prep(T(hair,0,1.63,-.012),0xffffff,0,2)]);
}
// Hair and skin for a population: varied, seeded per index.
const HAIR=[0x2b1d14,0x3b2a1e,0x5a3b22,0x8a6a3a,0xc9a86a,0x1a1a1a,0x7a3b20,0xa9a9a9,0xd8d2c4,0x4a3426];
const SKIN=[0xf1d2b8,0xe6bc98,0xd9a57f,0xc48a62,0xa86e4a,0x8a5a3a,0x6b4329,0xf6dcc6];
export function personLooks(n,seed=1){
  const hair=new Float32Array(n*3),skin=new Float32Array(n*3),c=new THREE.Color();
  for(let i=0;i<n;i++){
    const h=Math.abs(Math.sin((i+1)*12.9898+seed)*43758.5453)%1,k=Math.abs(Math.sin((i+1)*78.233+seed*3.1)*43758.5453)%1;
    c.set(HAIR[Math.floor(h*HAIR.length)]);hair.set([c.r,c.g,c.b],i*3);
    c.set(SKIN[Math.floor(k*SKIN.length)]);skin.set([c.r,c.g,c.b],i*3);
  }
  return {hair:new THREE.InstancedBufferAttribute(hair,3),skin:new THREE.InstancedBufferAttribute(skin,3)};
}
export function plumbob(){
  const g=new THREE.OctahedronGeometry(.32,0);g.scale(.7,1.4,.7);return g;
}

// ---- Roof props (roofprops.js) ----
export function shrub(){
  return merge([leafyCrown(.85,.55,6,3.3,0x4f7d34)]);
}
export function shrubOld(){
  return merge([prep(T(crown(.75,1,5),0,.55,0,1.2,.75,1.1),0x4d7a32,.04,1),prep(T(crown(.5,1,8),.5,.5,.3,1,.8,1),0x5f8a3a,.04,1),prep(T(crown(.45,0,2),-.45,.42,-.25),0x3e6a2a,.04,1)]);
}
export function tuft(){
  const parts=[];
  for(let i=0;i<7;i++){const a=i*2.4,r=.12+(i%3)*.08;const g=new THREE.ConeGeometry(.05,.55+(i%4)*.12,3);g.rotateZ(Math.sin(a)*.25);g.rotateX(Math.cos(a)*.25);parts.push(prep(T(g,Math.cos(a)*r,.3,Math.sin(a)*r),i%2?0x86a24a:0x9db45a,.25,1));}
  for(let i=0;i<4;i++){const a=i*1.7;parts.push(prep(T(new THREE.IcosahedronGeometry(.05,0),Math.cos(a)*.25,.62,Math.sin(a)*.25),[0xf3e9a0,0x8a6fd1,0xe8554e,0xffffff][i],.25));}
  return merge(parts);
}
export function birch(){
  return merge([...trunk(2.8,.09,.06,0xe9e6dc),leafyCrown(1.0,3.2,7,4.4,0x6f9a3c)]);
}
export function birchOld(){
  return merge([prep(T(new THREE.CylinderGeometry(.06,.1,2.6,5),0,1.3,0),0xe9e6dc,.02),prep(T(crown(.9,1,9),0,2.9,0,.9,1.2,.9),0x6f9a3c,.12,1),prep(T(crown(.6,1,4),.35,3.4,.2),0x7aa648,.14,1)]);
}
export function pottedTree(){
  return merge([prep(T(new THREE.CylinderGeometry(.32,.25,.5,8),0,.25,0),0xb5653a),prep(T(new THREE.CylinderGeometry(.04,.05,.9,5),0,.9,0),0x6a4b33),prep(T(crown(.55,1,6),0,1.5,0,1,.9,1),0x4f7f34,.08,1)]);
}
export function umbrellaTable(){
  return merge([prep(T(new THREE.CylinderGeometry(.45,.45,.05,10),0,.74,0),0xeae3d2),prep(T(new THREE.CylinderGeometry(.03,.03,2.2,5),0,1.1,0),0xdddddd),
    prep(T(new THREE.ConeGeometry(1.25,.45,8,1,true),0,2.15,0),0xffffff,0,1),
    ...[[.75,0],[-.75,0],[0,.75],[0,-.75]].map(([x,z])=>prep(T(new THREE.BoxGeometry(.4,.45,.4),x,.23,z),0x8a6542))]);
}
// A row segment of three tilted modules (3.2 m long), raised on a light frame, facing south (+z).
export function panelRow(){
  const g=new THREE.BoxGeometry(3.2,.05,1.75);g.rotateX(-.27);g.translate(0,.62,0);
  return merge([prep(g,0x1b2638),prep(T(new THREE.BoxGeometry(3.2,.06,.06),0,.36,.82),0xb8bcc2),prep(T(new THREE.BoxGeometry(3.2,.06,.06),0,.86,-.82),0xb8bcc2),
    ...[-1.4,1.4].flatMap(x=>[prep(T(new THREE.BoxGeometry(.05,.4,.05),x,.2,.8),0xb8bcc2),prep(T(new THREE.BoxGeometry(.05,.9,.05),x,.45,-.8),0xb8bcc2)])]);
}
