import * as THREE from 'three';
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';
import { FUTURE, adoptFutureMaterial } from './future.js';
import { CITY } from './city-config.js';

// The world around the modelled city (tools/import-horizon.mjs, from OpenStreetMap): the mainland
// beyond the model, Öland across the sound with its limestone ridge, and Ölandsbron – 6 km of concrete
// from Svinö to Möllstorp, rising over the shipping lane near the Kalmar side. The land is shaped from a
// grid of distances to the coast: a beach at the waterline, fields rising inland, and on Öland the
// landborg. The woods and the residential areas are OpenStreetMap's, and so are the 20 000 buildings of
// Kalmar beyond the model and of Färjestaden. It sits in the same haze as the city but is never lost in it entirely (uFogCap), so the
// island stays on the horizon on a clear day and fades in rain. The sea goes on past the model's own
// water plane, so the far shores stand in water.
const SEA=CITY.water.y;   // the model's water surface (Kalmar: RH 2000 0.14 m); the water shader raises it with uSeaRise
const hash=(x,z)=>{const s=Math.sin(x*12.9898+z*78.233)*43758.5453;return s-Math.floor(s);};
function noise(x,z){const i=Math.floor(x),j=Math.floor(z),fx=x-i,fz=z-j,u=fx*fx*(3-2*fx),v=fz*fz*(3-2*fz);
  return (hash(i,j)*(1-u)+hash(i+1,j)*u)*(1-v)+(hash(i,j+1)*(1-u)+hash(i+1,j+1)*u)*v;}
const fbm=(x,z)=>noise(x,z)*.55+noise(x*2.1+7,z*2.1+3)*.3+noise(x*4.7+1,z*4.7+9)*.15;
const smooth=(a,b,x)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t);};

export async function createHorizon(scene,{lite=false}={}){
  let meta,field,use=null,blds=null,HT=null;
  if(typeof __PACK__!=='undefined'&&!__PACK__.horizon)return {update(){},ready:false};
  try{
    meta=await (await fetch('city/horizon.json')).json();
    const get=async f=>{const r=await fetch(`city/${f}`);if(!r.ok)throw new Error(f);return r.arrayBuffer();};
    // A place built by the pipeline also has real heights (pipeline/horizon.py: a surface model).
    if(meta.heights)HT=await get(meta.heights.file).then(b=>new Int16Array(b));
    [field,use,blds]=await Promise.all([get(meta.land.file).then(b=>new Int16Array(b)),meta.landuse?get(meta.landuse.file).then(b=>new Uint8Array(b)).catch(()=>null):null,meta.buildings?get(meta.buildings.file).then(b=>new Int16Array(b)).catch(()=>null):null]);
  }catch{return {update(){},ready:false};}
  const CAP={value:.74};
  // The haze reaches the horizon only partly: min(fog, cap).
  const capFog=m=>{m.onBeforeCompile=sh=>{sh.uniforms.uFogCap=CAP;
    sh.fragmentShader='uniform float uFogCap;\n'+sh.fragmentShader.replace('#include <fog_fragment>',`#ifdef USE_FOG
  gl_FragColor.rgb=mix(gl_FragColor.rgb,fogColor,min(smoothstep(fogNear,fogFar,vFogDepth),uFogCap));
#endif`);};m.customProgramCacheKey=()=>'horizon-fog-v1';return m;};
  const group=new THREE.Group();group.name='horizon';scene.add(group);

  // ---- The land ----------------------------------------------------------------------------------
  const G=meta.land,M=meta.model,step=lite?2:1,w=Math.floor((G.w-1)/step)+1,h=Math.floor((G.h-1)/step)+1;
  const inModel=(x,z)=>x>M.x0&&x<M.x1&&z>M.z0&&z<M.z1;
  const pos=new Float32Array(w*h*3),col=new Float32Array(w*h*3),dist=new Float32Array(w*h),wood=new Float32Array(w*h),wet=new Float32Array(w*h),ground=new Float32Array(w*h),trees=[];
  // A generated place's horizon starts at the play area's edge on the city's own ground: the grid points
  // inside sink under it (the quads across the edge are its skirt) and those on the edge sit just below.
  const rim=(x,z)=>Math.max(M.x0-x,x-M.x1,M.z0-z,z-M.z1)<1;
  // Near the play area its land carries on as the city's own: the open land the colour of its lawns
  // and fields, and more trees in the fields and gardens, thinning out over the first 700 m.
  const near=(x,z)=>HT?1-smooth(0,700,Math.max(M.x0-x,x-M.x1,M.z0-z,z-M.z1)):0,fieldNear=new THREE.Color('#61773f');
  // Land use at a grid point: 1 woods, 2 homes (without the file: woods in noise patches).
  const useAt=(gi,gj,x,z)=>use?use[gj*G.w+gi]:smooth(.52,.62,fbm(x/380+40,z/380-20))>.5?1:0;
  // Colours as seen (sRGB): shore stone and sand, mainland fields, Öland's drier grassland, woods, roofs.
  const c=new THREE.Color(),sand=new THREE.Color('#7d776a'),fieldM=new THREE.Color('#4a5a37'),fieldO=new THREE.Color('#646441'),woodC=new THREE.Color('#25351f'),built=new THREE.Color('#665f57'),deep=new THREE.Color('#25332f'),lakeC=new THREE.Color('#1f2c33');
  for(let j=0;j<h;j++)for(let i=0;i<w;i++){
    const gi=Math.min(G.w-1,i*step),gj=Math.min(G.h-1,j*step),v=field[gj*G.w+gi],d=v>>1,isle=v&1;
    const x=G.x0+gi*G.step,z=G.z0+gj*G.step,k=j*w+i;
    const n=fbm(x/900,z/900),n2=fbm(x/380+40,z/380-20),u=d>0?useAt(gi,gj,x,z):0;
    let y;
    // A lake above the main water lies flat at its own level (pipeline/horizon.py, land use 3).
    const lakeUp=Boolean(HT)&&d<=0&&use?.[gj*G.w+gi]===3;
    if(lakeUp)y=SEA+HT[gj*G.w+gi]/10;
    else if(HT)y=d<=0?SEA-1-Math.min(12,-d*.02):SEA+Math.max(.3,HT[gj*G.w+gi]/10)-(rim(x,z)?.3:0);
    else if(d<=0)y=SEA-1-Math.min(12,-d*.02);
    else if(isle)y=SEA+.5+4*(1-Math.exp(-d/250))+22*smooth(450,1700,d)*(.75+.5*n)+3*n2*smooth(100,600,d);   // Öland's landborg
    else y=SEA+.5+7*(1-Math.exp(-d/600))*(.6+.8*n)+3*n2*smooth(100,600,d);
    // Woods are a canopy 12–20 m over the fields (mottled into crowns in the shader), so from across
    // the water they read as forest, not as single trees on a lawn; crowns along their edges, in the
    // gardens and along the field edges give the skyline its ragged top.
    const forest=u===1&&d>15&&!inModel(x,z)?smooth(15,90,d):0;
    ground[k]=inModel(x,z)?(HT?y-4:SEA-.8):y;
    if(!HT)y+=forest*(12+8*noise(x/70,z/70));   // a surface model already stands in its woods
    // Under the modelled city the land stays out of sight: below the water, or under the city's ground.
    if(inModel(x,z))y=HT?y-4:Math.min(y,SEA-.8);
    pos.set([x,y,z],k*3);dist[k]=inModel(x,z)?-1:lakeUp?0:d;wood[k]=forest;wet[k]=lakeUp&&!inModel(x,z)?1:0;
    // Beach, then fields, woods, and gardens between the houses.
    if(d<=10)c.copy(sand);
    else{
      c.copy(isle?fieldO:fieldM).lerp(fieldNear,HT?.55+.45*near(x,z):0).multiplyScalar(.85+.3*n);
      c.lerp(woodC,forest);
      if(u===2)c.lerp(built,.45*smooth(.3,.7,noise(x/90,z/90))+.2);
      if(!inModel(x,z)&&d>25){
        const edge=u===1&&[[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>useAt(Math.min(G.w-1,Math.max(0,gi+a*step)),Math.min(G.h-1,Math.max(0,gj+b*step)),x+a*G.step*step,z+b*G.step*step)!==1);
        const nr=near(x,z),p=edge?.7:u===2?.35+.3*nr:u===0?.025+.12*nr:0;
        if(hash(x*.13,z*.17)<p*(lite?.45:1))trees.push([x,ground[k],z,isle,u===2]);
      }
    }
    if(d<=0)c.copy(lakeUp?lakeC:deep);
    col.set([c.r,c.g,c.b],k*3);
  }
  const idx=[];
  for(let j=0;j<h-1;j++)for(let i=0;i<w-1;i++){
    const a=j*w+i,b=a+1,cc=a+w,dd=cc+1;
    // Only where there is land or shore (the deep sound and the model's own area are left out).
    if(Math.max(dist[a],dist[b],dist[cc],dist[dd])<-240)continue;
    if(dist[a]===-1&&dist[b]===-1&&dist[cc]===-1&&dist[dd]===-1)continue;
    idx.push(a,cc,b,b,cc,dd);
  }
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(pos,3));geo.setAttribute('color',new THREE.BufferAttribute(col,3));geo.setAttribute('aWood',new THREE.BufferAttribute(wood,1));geo.setAttribute('aWet',new THREE.BufferAttribute(wet,1));
  geo.setIndex(idx);geo.computeVertexNormals();
  // (Pushed back in depth a little, so the city's own ground wins where the two meet.)
  const landMat=capFog(new THREE.MeshStandardMaterial({vertexColors:true,roughness:.95,metalness:0,polygonOffset:Boolean(HT),polygonOffsetFactor:1,polygonOffsetUnits:1}));
  {const fog=landMat.onBeforeCompile;landMat.onBeforeCompile=sh=>{fog(sh);
    sh.vertexShader='attribute float aWood;attribute float aWet;varying float vWood;varying float vWet;varying vec3 vHW;\n'+sh.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\n  vHW=(modelMatrix*vec4(transformed,1.0)).xyz;vWood=aWood;vWet=aWet;');
    sh.fragmentShader='varying float vWood;varying float vWet;varying vec3 vHW;\nfloat hH(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}\nfloat hN(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(hH(i),hH(i+vec2(1,0)),f.x),mix(hH(i+vec2(0,1)),hH(i+1.0),f.x),f.y);}\n'+sh.fragmentShader
      .replace('#include <color_fragment>',`#include <color_fragment>
  {float n=hN(vHW.xz/22.0)*.5+hN(vHW.xz/7.0)*.3+hN(vHW.xz/70.0)*.2;
   float slope=1.0-normalize(cross(dFdx(vHW),dFdy(vHW))).y;
   diffuseColor.rgb*=(.78+.42*n)*(1.0-.5*clamp(slope*3.0,0.0,1.0));
   diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.33,.32,.3)*(.8+.4*n),clamp(slope*2.5-.2,0.0,.6)*(1.0-vWood));
   // The canopy: crowns of a few metres, lit tops and dark gaps.
   float crowns=hN(vHW.xz/4.2)*.5+hN(vHW.xz/1.6+3.1)*.25+hN(vHW.xz/12.0)*.25;
   diffuseColor.rgb*=mix(1.0,.5+.75*crowns,vWood);
   // A lake above the main water: dark, still water that mirrors the sky.
   diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.035,.06,.075),smoothstep(.35,.8,vWet));}`)
      .replace('#include <roughnessmap_fragment>','#include <roughnessmap_fragment>\n  roughnessFactor=mix(roughnessFactor,.08,smoothstep(.35,.8,vWet));');};
  landMat.customProgramCacheKey=()=>'horizon-land-v3';}
  const land=new THREE.Mesh(geo,landMat);
  land.name='horizon land';land.receiveShadow=false;land.frustumCulled=false;group.add(land);

  // Crowns along the woods' edges and in the fields, so the far shores have a skyline: each spot a
  // copse of two to four lumpy crowns of different sizes, never one round ball on its own.
  // (Indexed: 42 vertices a crown instead of 240, for the thousands of them.)
  const ico=new THREE.IcosahedronGeometry(1,1);ico.deleteAttribute('normal');ico.deleteAttribute('uv');
  const crown=mergeVertices(ico);
  {const p=crown.attributes.position,v=new THREE.Vector3();
    for(let i=0;i<p.count;i++){v.fromBufferAttribute(p,i);const k=1+.22*(noise(v.x*1.7+3,v.z*1.7+v.y*1.3)-.5)*2;v.multiplyScalar(k);v.y=v.y*.85+.62;if(v.y<.25)v.y=.25+(v.y-.25)*.4;p.setXYZ(i,v.x,v.y,v.z);}
    crown.computeVertexNormals();}
  const lumps=[];
  for(const [x,y,z,isle,garden] of trees){const r=hash(x,z),n=(garden?1:2)+Math.floor(hash(z*.7,x*1.3)*(garden?2:3)),cx=x+(hash(z,x)-.5)*G.step*step,cz=z+(r-.5)*G.step*step;
    for(let k=0;k<n;k++){const a=hash(x+k*7.1,z-k*3.3)*Math.PI*2,rr=k?(garden?9:4)+hash(z+k,x)*(garden?14:6):0,size=((isle?4:5)+r*4)*(garden?.75:1)*(k?.6+.4*hash(x-k,z+k):1);lumps.push([cx+Math.cos(a)*rr,y,cz+Math.sin(a)*rr,size,r]);}}
  const woods=new THREE.InstancedMesh(crown,capFog(new THREE.MeshStandardMaterial({roughness:1,metalness:0})),lumps.length||1);
  {const m=new THREE.Matrix4(),q=new THREE.Quaternion(),p=new THREE.Vector3(),s=new THREE.Vector3(),up=new THREE.Vector3(0,1,0);
    const tones=['#2b3f27','#334a2c','#3c5232','#28382a','#30442a'].map(h=>new THREE.Color(h));
    lumps.forEach(([x,y,z,size,r],i)=>{q.setFromAxisAngle(up,hash(x,z)*6.28);p.set(x,y-1.2,z);s.set(size*1.2,size*(.9+hash(z,x)*.5),size*1.2);m.compose(p,q,s);woods.setMatrixAt(i,m);
      woods.setColorAt(i,tones[Math.floor(hash(x*.31,z*.17)*5)%5]);});}
  woods.count=lumps.length;woods.frustumCulled=false;woods.name='horizon woods';group.add(woods);

  // ---- Buildings ------------------------------------------------------------------------------------
  // OpenStreetMap's buildings beyond the model, each a box along its longest wall: houses with red and
  // dark pitched roofs, blocks of flats and large buildings with flat ones. Walls and roofs are
  // instanced meshes sharing one placement per building; on a phone the sheds and garages are left out.
  if(blds){
    const groundAt=(x,z)=>{const fi=(x-G.x0)/(G.step*step),fj=(z-G.z0)/(G.step*step),i0=Math.max(0,Math.min(w-2,Math.floor(fi))),j0=Math.max(0,Math.min(h-2,Math.floor(fj))),a=Math.max(0,Math.min(1,fi-i0)),b=Math.max(0,Math.min(1,fj-j0));
      const g=(i,j)=>ground[j*w+i];return Math.max(SEA+.4,(g(i0,j0)*(1-a)+g(i0+1,j0)*a)*(1-b)+(g(i0,j0+1)*(1-a)+g(i0+1,j0+1)*a)*b);};
    const list=[];
    for(let i=0;i+6<blds.length;i+=7){const kind=blds[i+6];if(lite&&kind===3)continue;
      const x=blds[i]/2,z=blds[i+1]/2;list.push({x,z,y:groundAt(x,z),w:blds[i+2]/4,dd:blds[i+3]/4,rot:-(blds[i+4]+32768)/65536*Math.PI*2,h:blds[i+5]/10,kind,r:hash(x*.37,z*.11)});}
    const wallsG=new THREE.BoxGeometry(1,1,1).translate(0,.5,0);
    // A gable over a unit box: ridge along the length (x), rising 0.42 of the depth.
    const roofG=new THREE.BufferGeometry();roofG.setAttribute('position',new THREE.Float32BufferAttribute([
      -.52,0,-.55,.52,0,-.55,.52,.42,0, -.52,0,-.55,.52,.42,0,-.52,.42,0, -.52,0,.55,-.52,.42,0,.52,.42,0, -.52,0,.55,.52,.42,0,.52,0,.55,
      -.52,0,-.55,-.52,.42,0,-.52,0,.55, .52,0,-.55,.52,0,.55,.52,.42,0],3));roofG.computeVertexNormals();
    const flatG=new THREE.BoxGeometry(1.02,.5,1.02).translate(0,.25,0);
    // Wall tones by kind (house, flats, large, small) and roof tones; a place can give its own (CITY.horizonColours:
    // Venice's ochre, rose and Venetian red under terracotta).
    const HC=CITY.horizonColours||{};
    const walls=(HC.walls||[['#d6d0c4','#e0d3b0','#b8a58e','#8c3a2d','#c9c3b8','#a39f98','#9a3c2c'],['#c9c2b6','#b5aa9a','#9c8f80','#d2cdc3','#8e5a44'],['#bdbab3','#a8a49b','#d0ccc2','#8f8c85'],['#7d4a3a','#8a8680','#6f6a62']]).map(l=>l.map(c=>new THREE.Color(c)));
    const roofs=(HC.roofs||['#7a3a2c','#8d4a35','#3b3d3f','#4a4c4e','#6b2f26','#5a5148']).map(c=>new THREE.Color(c));
    // Only houses and sheds of a house's size get a gable (it rises 0.42 of the depth): a big shed roof or
    // canopy (building=roof over a terminal, a station's platforms) would make a pyramid tens of metres high.
    const gable=o=>(o.kind===0||o.kind===3)&&o.w*o.dd<=400&&o.dd<=24;
    const pitched=list.filter(gable),flat=list.filter(o=>!gable(o));
    // Facades: storeys of windows in world space (3 m a storey, a window every 2.6 m along the wall),
    // dark glass by day; after dusk a share of them lit like the city's own (FUTURE.uLit, uNight).
    const wallMat=capFog(new THREE.MeshStandardMaterial({roughness:.9}));
    {const fog=wallMat.onBeforeCompile;wallMat.onBeforeCompile=sh=>{fog(sh);sh.uniforms.uLit=FUTURE.uLit;sh.uniforms.uNight=FUTURE.uNight;
      sh.vertexShader='varying vec3 vBW;varying vec3 vBN;\n'+sh.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\n  vBW=(modelMatrix*instanceMatrix*vec4(transformed,1.0)).xyz;vBN=normalize(mat3(modelMatrix*instanceMatrix)*objectNormal);');
      sh.fragmentShader='uniform float uLit,uNight;varying vec3 vBW;varying vec3 vBN;\nfloat bH(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}\n'+sh.fragmentShader
        .replace('#include <color_fragment>',`#include <color_fragment>
  float win=0.0;vec2 cell=vec2(0.0);
  if(abs(vBN.y)<.5){vec2 along=normalize(vec2(-vBN.z,vBN.x));float u=dot(vBW.xz,along)/2.6,v=(vBW.y+.6)/3.0;cell=vec2(floor(u)+floor(dot(vBW.xz,vBN.xz)),floor(v));
    vec2 f=fract(vec2(u,v));win=step(.28,f.x)*step(f.x,.72)*step(.34,f.y)*step(f.y,.8)*step(.6,v);
    diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.13,.15,.17),win*.85);}`)
        .replace('#include <emissivemap_fragment>',`#include <emissivemap_fragment>
  totalEmissiveRadiance+=vec3(1.0,.74,.45)*win*step(bH(cell),uLit*.85)*uNight*1.15;`);};
      wallMat.customProgramCacheKey=()=>'horizon-walls-v1';}
    const wallMesh=new THREE.InstancedMesh(wallsG,wallMat,list.length||1);
    const roofMesh=new THREE.InstancedMesh(roofG,capFog(new THREE.MeshStandardMaterial({roughness:.85,side:THREE.DoubleSide})),pitched.length||1);
    const flatMesh=new THREE.InstancedMesh(flatG,capFog(new THREE.MeshStandardMaterial({roughness:.9,color:0x4f5154})),flat.length||1);
    const m=new THREE.Matrix4(),q=new THREE.Quaternion(),p=new THREE.Vector3(),sc=new THREE.Vector3(),up=new THREE.Vector3(0,1,0);
    list.forEach((o,i)=>{q.setFromAxisAngle(up,o.rot);p.set(o.x,o.y-.4,o.z);sc.set(o.w,o.h+.4,o.dd);m.compose(p,q,sc);wallMesh.setMatrixAt(i,m);const tones=walls[o.kind];wallMesh.setColorAt(i,tones[Math.floor(o.r*97)%tones.length]);});
    pitched.forEach((o,i)=>{q.setFromAxisAngle(up,o.rot);p.set(o.x,o.y+o.h,o.z);sc.set(o.w,o.dd,o.dd);m.compose(p,q,sc);roofMesh.setMatrixAt(i,m);roofMesh.setColorAt(i,roofs[Math.floor(o.r*53)%roofs.length]);});
    flat.forEach((o,i)=>{q.setFromAxisAngle(up,o.rot);p.set(o.x,o.y+o.h-.2,o.z);sc.set(o.w,1,o.dd);m.compose(p,q,sc);flatMesh.setMatrixAt(i,m);});
    for(const [mesh,n,name] of [[wallMesh,list.length,'horizon buildings'],[roofMesh,pitched.length,'horizon roofs'],[flatMesh,flat.length,'horizon flat roofs']]){mesh.count=n;mesh.frustumCulled=false;mesh.name=name;group.add(mesh);}
  }

  // ---- The sea beyond the model's water plane (x −5050…4950, z −4970…5030) -------------------------
  // A generated place's sea reaches 60 m in under the play area and its own water plane, pushed back in
  // depth so that the city's water wins where both lie: no seam between the two.
  {const waterMat=new THREE.MeshStandardMaterial({name:'M_Horizon_Water',roughness:.06,polygonOffset:Boolean(HT),polygonOffsetFactor:2,polygonOffsetUnits:2});adoptFutureMaterial(waterMat);
    // Around the model's own water plane (Kalmar's ±5 km; a generated place's play area).
    const R=16000,inner=meta.heights?[M.x0+60,M.x1-60,M.z0+60,M.z1-60]:[-5050,4950,-4970,5030];
    for(const [x0,x1,z0,z1] of [[-R,R,-R,inner[2]],[-R,R,inner[3],R],[-R,inner[0],inner[2],inner[3]],[inner[1],R,inner[2],inner[3]]]){
      const g=new THREE.PlaneGeometry(x1-x0,z1-z0).rotateX(-Math.PI/2).translate((x0+x1)/2,SEA,(z0+z1)/2);
      const sea=new THREE.Mesh(g,waterMat);sea.name='horizon sea';sea.frustumCulled=false;group.add(sea);}}

  // ---- A long bridge (horizon.json `bridge`: Kalmar's Ölandsbron) ------------------------------
  const bridge=meta.bridge?buildBridge(meta.bridge,group,capFog):null;
  return {group,ready:true,bridge:bridge&&{line:bridge.line,length:bridge.length,top:bridge.top},
    setVision(v){bridge?.setVision(v);},
    // weather: {storm, haze}; the far shores fade in rain and haze.
    update(weather,night,dt=0){
      CAP.value=Math.min(.985,.74+.24*(weather?.storm??0)+.1*(weather?.haze??0));
      bridge?.update(weather,night,dt);
    }};
}

// A long bridge on the horizon (Kalmar: Ölandsbron, 6 km from Svinö to Möllstorp): the deck rises over the
// high bridge (36 m clear for ships, about a kilometre out) and runs on at a few metres above the water;
// piers about every 40 m, every 130 m on the high part (profile approximate; length and line from
// OpenStreetMap). Trams cross it once the city builds the link (vision.bridgeTram).
function buildBridge(spec,group,capFog){
  // The deck rises from Svinö over the high bridge (36 m clear for ships, about a kilometre out) and
  // runs on at a few metres above the water to Öland; piers about every 40 m, every 130 m on the high
  // part. (Profile approximate; length and line from OpenStreetMap.)
  const line=spec.line.map(([x,z])=>new THREE.Vector2(x,z)),cum=[0];
  for(let i=1;i<line.length;i++)cum.push(cum[i-1]+line[i].distanceTo(line[i-1]));
  const L=cum[cum.length-1],high=s=>smooth(180,820,s)*(1-smooth(1450,2100,s));
  const top=s=>SEA+7.5+37.5*high(s),DECK=12.5,GIRDER=2.6;
  const at=s=>{let i=1;while(i<cum.length-1&&cum[i]<s)i++;const t=(s-cum[i-1])/Math.max(1e-6,cum[i]-cum[i-1]);
    const p=line[i-1].clone().lerp(line[i],t),dir=line[i].clone().sub(line[i-1]).normalize();return {p,dir};};
  {const N=Math.ceil(L/12),P=[],I=[];
    for(let k=0;k<=N;k++){const s=L*k/N,{p,dir}=at(s),nx=-dir.y*DECK/2,nz=dir.x*DECK/2,yt=top(s),yb=yt-GIRDER;
      P.push(p.x+nx,yt,p.y+nz, p.x-nx,yt,p.y-nz, p.x-nx,yb,p.y-nz, p.x+nx,yb,p.y+nz);}
    for(let k=0;k<N;k++){const a=k*4,b=a+4;
      for(const [u,v] of [[0,1],[1,2],[2,3],[3,0]])I.push(a+u,b+u,a+v,a+v,b+u,b+v);}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(P,3));g.setIndex(I);g.computeVertexNormals();
    const deck=new THREE.Mesh(g,capFog(new THREE.MeshStandardMaterial({color:0x9a9890,roughness:.85,side:THREE.DoubleSide})));deck.name='Ölandsbron';deck.frustumCulled=false;group.add(deck);}
  const piers=[];for(let s=40;s<L-20;){piers.push(s);s+=high(s)>.2?130:39.2;}
  const pierMesh=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1).translate(0,.5,0),capFog(new THREE.MeshStandardMaterial({color:0x8f8d86,roughness:.9})),piers.length);
  {const m=new THREE.Matrix4(),q=new THREE.Quaternion(),p=new THREE.Vector3(),sc=new THREE.Vector3(),up=new THREE.Vector3(0,1,0);
    piers.forEach((s,i)=>{const {p:xz,dir}=at(s),hgt=top(s)-GIRDER-(SEA-2),big=high(s)>.2;
      q.setFromAxisAngle(up,Math.atan2(dir.x,dir.y));p.set(xz.x,SEA-2,xz.y);sc.set(big?11:9,hgt,big?5:2.2);m.compose(p,q,sc);pierMesh.setMatrixAt(i,m);});}
  pierMesh.frustumCulled=false;pierMesh.name='Ölandsbron piers';group.add(pierMesh);
  // Lamps along the bridge, lit after dusk; not in the haze, so they read across the sound at night.
  const lampPts=[];for(let s=25;s<L;s+=52)lampPts.push(s);
  const lampMat=new THREE.MeshBasicMaterial({color:new THREE.Color(0xffc58a).multiplyScalar(3),fog:false,transparent:true,opacity:0,depthWrite:false});
  const lamps=new THREE.InstancedMesh(new THREE.SphereGeometry(1.6,6,4),lampMat,lampPts.length);
  {const m=new THREE.Matrix4();lampPts.forEach((s,i)=>{const {p}=at(s);m.makeTranslation(p.x,top(s)+7,p.y);lamps.setMatrixAt(i,m);});}
  lamps.frustumCulled=false;lamps.name='Ölandsbron lamps';group.add(lamps);

  // Trams over the bridge once the city builds the link (vision.bridgeTram 0–1): up to six units on two
  // tracks along the deck's north edge, at 60 km/h, their windows lit after dusk.
  const tramMat=capFog(new THREE.MeshStandardMaterial({color:0xe9eee9,roughness:.4,metalness:.1,emissive:0xffd9a0,emissiveIntensity:0}));
  const trams=new THREE.InstancedMesh(new THREE.BoxGeometry(2.7,3.3,32).translate(0,1.65,0),tramMat,6);trams.count=0;trams.frustumCulled=false;trams.name='Ölandsbron trams';group.add(trams);
  let tramShare=0,clock=0;
  const tm=new THREE.Matrix4(),tq=new THREE.Quaternion(),tp=new THREE.Vector3(),ts=new THREE.Vector3(1,1,1),tup=new THREE.Vector3(0,1,0);
  return {line,length:L,top,
    setVision(v){tramShare=THREE.MathUtils.clamp(v.bridgeTram??0,0,1);},
    update(weather,night,dt){
        clock+=dt;const n=Math.round(6*tramShare);trams.count=n;tramMat.emissiveIntensity=1.6*THREE.MathUtils.smoothstep(night,.2,.7);
        for(let k=0;k<n;k++){const out=k%2===0,s0=((clock*16.7+k*L/n)%L),s=out?s0:L-s0,{p,dir}=at(s);
          const off=(out?4.2:1.4)*DECK/12.5,nx=-dir.y*off,nz=dir.x*off;
          tq.setFromAxisAngle(tup,Math.atan2(dir.x,dir.y)+(out?0:Math.PI));tp.set(p.x+nx,top(s),p.y+nz);tm.compose(tp,tq,ts);trams.setMatrixAt(k,tm);}
        if(n)trams.instanceMatrix.needsUpdate=true;
        lampMat.opacity=THREE.MathUtils.smoothstep(night,.2,.7)*(1-.6*(weather?.storm??0));lamps.visible=lampMat.opacity>.01;
    }};
}
