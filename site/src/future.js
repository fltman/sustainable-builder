import * as THREE from 'three';

// Turns today's Kvarnholmen into the city the player has chosen, inside the existing materials.
// Each building gets its own roof: a sedum carpet, a wildflower meadow, a kitchen garden in raised
// beds, a planted terrace, or solar modules laid along the roof plane (pitched roofs facing the sun,
// rows with planted walkways on flat roofs). Facades take climbing plants; car streets are depaved
// into planted verges around a permeable path; car parks become allotments; glass lights up at night
// and the sea changes colour with its nutrient load. Surfaces sample photographic textures from one
// texture array (public/textures, made with the imagegen skill) through an anti-tiling lookup with a
// per-building rotation, scale and tint, so no two roofs repeat the same patch.
// Everything reads shared uniforms: a decade's change is a uniform update, and every material of one
// class compiles to the same program (city-batches keeps grouping them).
export const FUTURE={
  uPlan:{value:null},uPlanRect:{value:new THREE.Vector4()},uTex:{value:null},
  uRoofCover:{value:0},uGreenRatio:{value:.5},uFacadeGreen:{value:0},uDepave:{value:0},uParking:{value:0},
  uCanal:{value:0},uVerge:{value:0},uLit:{value:.45},uTime:{value:0},uNight:{value:0},uSeaRise:{value:0},uWaterClarity:{value:.35},uBloom:{value:.3},uSeason:{value:.5},
  // Weather (src/weather.js): wind 0–1 raises the sea in a storm; drought 0–1 turns the lawns to straw.
  uWind:{value:0},uDrought:{value:0},
};
export const LAYERS=['sedum','meadow','kitchen','terrace','pavers','verge','allotment','solar'];
const L=Object.fromEntries(LAYERS.map((n,i)=>[n,i.toFixed(1)]));

const COMMON=`
float fHash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float fNoise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);
  return mix(mix(fHash(i),fHash(i+vec2(1,0)),f.x),mix(fHash(i+vec2(0,1)),fHash(i+vec2(1,1)),f.x),f.y);}
float fFbm(vec2 p){return fNoise(p)*.55+fNoise(p*2.13+7.1)*.3+fNoise(p*4.7+3.3)*.15;}
`;
const FRAG_HEAD=`uniform sampler2D uPlan;uniform highp sampler2DArray uTex;uniform vec4 uPlanRect;
uniform float uRoofCover,uGreenRatio,uFacadeGreen,uDepave,uParking,uCanal,uVerge,uLit,uTime,uNight,uSeaRise,uWaterClarity,uBloom,uSeason,uWind,uDrought;
varying vec3 vFWorld;varying vec3 vFNormal;
${COMMON}
vec4 fPlan(vec2 xz){return texture2D(uPlan,(xz-uPlanRect.xy)*uPlanRect.zw);}
mat2 fRot(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}
// Anti-tiling lookup (after Inigo Quilez): a low-frequency noise picks between offset copies of the
// tile and blends them, with explicit gradients so mipmapping stays seamless.
// Gradients come from the caller, computed outside any branch, so the lookup may sit inside one.
vec3 fTex(vec2 uv,float layer,vec2 gx,vec2 gy){
  float l=fNoise(uv*.21)*7.0,f=fract(l),ia=floor(l);
  vec2 oa=sin(vec2(3.0,7.0)*ia),ob=sin(vec2(3.0,7.0)*(ia+1.0));
  vec3 a=textureGrad(uTex,vec3(uv+oa,layer),gx,gy).rgb,b=textureGrad(uTex,vec3(uv+ob,layer),gx,gy).rgb;
  return mix(a,b,smoothstep(.2,.8,f-.1*dot(a-b,vec3(1.0))));
}
vec3 fLin(vec3 c){return pow(c,vec3(2.2));}
// Small-input hash, mirrored exactly in roofprops.js (hashCell) so the 3D roof props agree with it.
float fCell(vec2 c,float r){vec3 p=fract(vec3(c.x*.1031,c.y*.1030,r*.0973));p+=dot(p,p.yzx+33.33);return fract((p.x+p.y)*p.z);}
// Seen from above, a double-sided surface's reversed twin is a back face whose stored normal points
// down; flipping by facing gives both copies the same answer, so they can never z-fight in colour.
#define FACING vec3 fN=normalize(vFNormal)*(gl_FrontFacing?1.0:-1.0);
`;
const VERTEX_HEAD='varying vec3 vFWorld;varying vec3 vFNormal;uniform float uSeaRise;\n';
const VERTEX_BODY=`#include <begin_vertex>
#ifdef USE_BATCHING
  vFWorld=(modelMatrix*batchingMatrix*vec4(transformed,1.0)).xyz;
  vFNormal=normalize(mat3(modelMatrix)*mat3(batchingMatrix)*objectNormal);
#else
  vFWorld=(modelMatrix*vec4(transformed,1.0)).xyz;
  vFNormal=normalize(mat3(modelMatrix)*objectNormal);
#endif`;

// ---- Roofs and facades -------------------------------------------------------------------------
const BUILDING=`#include <color_fragment>
  FACING
  float fGreen=0.0,fSolar=0.0,fIvy=0.0,fRelief=0.0;
  {
    vec4 plan=fPlan(vFWorld.xz-fN.xz*0.9);
    float r=plan.r,protectedRoof=step(0.999,r);
    // Within a large block, roofs turn one by one around the block's own order.
    float ro=r>0.0?clamp(r+(fCell(floor(vFWorld.xz/11.0),r)-.5)*.14,.001,.98):fCell(floor(vFWorld.xz/16.0),0.0)*0.98;
    float roof=step(0.5,fN.y)*step(2.6,vFWorld.y)*(1.0-protectedRoof);
    // Today's pale roofing (felt, sheet metal) as it really looks from the air: weathered grey with
    // streaks, patches and a slight per-building tone, not a white slab.
    {
      float lum=dot(diffuseColor.rgb,vec3(.299,.587,.114));
      float pale=step(0.5,fN.y)*step(2.6,vFWorld.y)*smoothstep(.16,.42,lum);
      float grime=fFbm(vFWorld.xz*.35)*.6+fNoise(vFWorld.xz*2.3)*.25+fNoise(vec2(vFWorld.x*.15,vFWorld.z*1.8))*.15;
      vec3 tone=mix(vec3(.13,.13,.135),vec3(.2,.19,.17),fCell(floor(vFWorld.xz/14.0),3.0));
      vec3 aged=tone*(.7+.55*grime);
      diffuseColor.rgb=mix(diffuseColor.rgb,aged,pale*.92);
    }
    float covered=roof*step(ro,uRoofCover);
    float fFlat=step(.93,fN.y);
    vec2 h2=normalize(fN.xz+vec2(1e-4));
    float sunward=step(-.25,h2.y);
    float kind=fract(ro*613.7),design=fract(ro*97.13),tint=fract(ro*31.7);
    fGreen=covered*fFlat*step(kind,uGreenRatio+.25);
    fSolar=covered*((1.0-fFlat)*sunward+fFlat*(1.0-step(kind,uGreenRatio+.25)));
    // Green roofs: one design per building, rotated and scaled per building.
    vec2 ruv=fRot(ro*40.0)*vFWorld.xz;
    float layer=design<.42?${L.sedum}:design<.68?${L.meadow}:design<.86?${L.kitchen}:${L.terrace};
    float scale=layer==${L.sedum}?5.5:layer==${L.meadow}?7.5:layer==${L.kitchen}?9.0:7.0;
    vec2 guv=ruv/scale+ro*17.0,ggx=dFdx(guv),ggy=dFdy(guv);
    // Solar modules in the roof's own plane: along the ridge and up the slope (portrait 1.05 x 1.75 m);
    // flat-roof rows run east-west and face south, like real ballasted arrays.
    vec3 T=normalize(cross(vec3(0.0,1.0,0.0),fN+vec3(1e-4,0.0,0.0))),Bv=cross(fN,T);
    vec2 puv=fFlat>.5?vFWorld.xz:vec2(dot(vFWorld,T),dot(vFWorld,Bv));
    vec2 cell=puv/vec2(1.05,1.75),cgx=dFdx(cell),cgy=dFdy(cell);
    float rowGap=fFlat*step(.7,fract(puv.y/2.9));
    vec2 wuv=vec2(vFWorld.x+vFWorld.z,vFWorld.y),wuv4=wuv/4.0+ro*9.0,wgx=dFdx(wuv4),wgy=dFdy(wuv4);
    vec3 green=vec3(0.0);
    if(fGreen+fSolar>0.0){
      green=fLin(fTex(guv,layer,ggx,ggy));
      green*=(.85+.3*tint)*vec3(.8,1.0,.74);green=mix(green,green*vec3(1.05,.95,.8),fNoise(vFWorld.xz*.08)*.5);
    }
    float gap=0.0;
    if(fSolar>0.0){
      vec2 mf=fract(cell);
      // Module frames, anti-aliased and faded out with distance so they never glitter.
      vec2 fw=abs(cgx)+abs(cgy);
      vec2 edge=smoothstep(vec2(.0),fw*1.5+vec2(.02,.015),min(mf,1.0-mf));
      float frame=(1.0-edge.x*edge.y)*(1.0-smoothstep(.12,.45,max(fw.x,fw.y)));
      vec3 panel=fLin(textureGrad(uTex,vec3(mf,${L.solar}),cgx,cgy).rgb);
      panel*=.8+.35*fHash(floor(cell)+ro);
      vec3 solar=mix(panel,vec3(.32,.33,.35),frame);
      solar=mix(solar,green,rowGap);
      diffuseColor.rgb=mix(diffuseColor.rgb,solar,fSolar);
    }
    diffuseColor.rgb=mix(diffuseColor.rgb,green,fGreen);
    // Wet roofs in the rain.
    diffuseColor.rgb*=1.0-.22*uWind*step(.5,fN.y);
    fRelief=fGreen*dot(green,vec3(.3,.59,.11));
    fSolar*=1.0-max(rowGap,gap);fGreen=max(fGreen,rowGap*covered);
    // Climbing plants on walls of buildings whose turn has come, densest near the ground.
    float wall=1.0-step(.35,abs(fN.y));
    float chosen=step(ro,uFacadeGreen)*(1.0-protectedRoof);
    if(wall*chosen>0.0){
      float reach=1.0-smoothstep(3.0,13.0+ro*6.0,vFWorld.y);
      float ivyN=fFbm(wuv*.42+ro*40.0);
      fIvy=smoothstep(.42,.5,ivyN*reach+reach*.35-.15);
      if(fIvy>0.0){
        vec3 ivy=fLin(fTex(wuv4,${L.verge},wgx,wgy))*vec3(.75,1.0,.7);
        ivy=mix(ivy,vec3(.05,.12,.03),.35);
        diffuseColor.rgb=mix(diffuseColor.rgb,ivy,fIvy);
        fRelief=max(fRelief,fIvy*dot(ivy,vec3(.3,.59,.11)));
      }
    }
  }`;
const BUILDING_ROUGH=`#include <roughnessmap_fragment>
  roughnessFactor=mix(roughnessFactor,.34,fSolar);roughnessFactor=mix(roughnessFactor,.93,max(fGreen,fIvy));
  roughnessFactor=mix(roughnessFactor,.3,uWind*.6*step(.5,abs(vFNormal.y))*(1.0-fGreen));`;
const BUILDING_METAL=`#include <metalnessmap_fragment>
  metalnessFactor=mix(metalnessFactor,.25,fSolar);metalnessFactor=mix(metalnessFactor,0.0,max(fGreen,fIvy));`;
const BUILDING_NORMAL=`#include <normal_fragment_maps>
  {float bump=fRelief*4.0;normal=normalize(normal+vec3(-dFdx(bump),-dFdy(bump),0.0)*1.4);}`;

// ---- Streets, squares and car parks ------------------------------------------------------------
const GROUND=`#include <color_fragment>
  float fBed=0.0,fPath=0.0,fRelief=0.0,fWater=0.0;
  {
    FACING
    vec4 plan=fPlan(vFWorld.xz);
    float up=step(.3,fN.y);
    // Very pale paving and gravel reads as white from the air; give it the tone of worn stone.
    {float lum=dot(diffuseColor.rgb,vec3(.299,.587,.114));diffuseColor.rgb=mix(diffuseColor.rgb,diffuseColor.rgb*.62+vec3(.02),smoothstep(.35,.6,lum)*up);}
    float street=step(.002,plan.g)*(1.0-step(.99,plan.g));
    float conv=street*step(plan.g,uDepave)*up;
    float centre=plan.b+(fNoise(vFWorld.xz*.45)-.5)*.22;
    fBed=conv*(1.0-smoothstep(.62,.7,centre));
    fPath=conv-fBed;
    // Streets that keep their traffic still get planted kerbs: a strip along each edge.
    fBed=max(fBed,street*step(plan.g,uVerge)*up*(1.0-smoothstep(.36,.44,centre)));
    // Some depaved streets carry a canal down the middle that takes the cloudbursts (a sponge city).
    float canalStreet=step(fract(plan.g*917.13),.42)*step(fract(plan.g*917.13)*2.4,uCanal);
    float fCanal=conv*canalStreet*step(.7,plan.b);
    float fKerb=conv*canalStreet*step(.5,plan.b)*(1.0-step(.7,plan.b));
    // A car park whose turn has come: allotment plots with paved paths between them. (Some car parks
    // are plain ground under painted bays, so this applies to every ground material.)
    float lot=(1.0-step(.002,plan.g))*step(.003,plan.b)*step(plan.b,uParking)*up;
    float lane=min(1.0,step(.86,fract(vFWorld.x/11.0))+step(.88,fract(vFWorld.z/15.0)));
    float lotBed=lot*(1.0-lane),lotPath=lot*lane;
    vec2 buv=vFWorld.xz/4.5,bgx=dFdx(buv),bgy=dFdy(buv);
    vec2 auv=fRot(floor(plan.b*40.0))*vFWorld.xz/9.0,agx=dFdx(auv),agy=dFdy(auv);
    vec2 puv=vFWorld.xz/3.2,pgx=dFdx(puv),pgy=dFdy(puv);
    vec3 bed=vec3(0.0),plots=vec3(0.0),pavers=vec3(0.0);
    if(fBed>0.0)bed=fLin(fTex(buv,${L.verge},bgx,bgy));
    if(lotBed>0.0)plots=fLin(fTex(auv,${L.allotment},agx,agy));
    if(max(fPath,lotPath)>0.0)pavers=fLin(fTex(puv,${L.pavers},pgx,pgy));
    diffuseColor.rgb=mix(diffuseColor.rgb,bed,fBed);
    diffuseColor.rgb=mix(diffuseColor.rgb,plots,lotBed);
    diffuseColor.rgb=mix(diffuseColor.rgb,pavers,max(fPath,lotPath));
    vec3 kerb=vec3(.42,.41,.39)*(.85+.3*fNoise(vFWorld.xz*3.0));
    vec3 canalWater=mix(vec3(.02,.06,.07),vec3(.05,.14,.15),fNoise(vFWorld.xz*.6+uTime*.05));
    diffuseColor.rgb=mix(diffuseColor.rgb,kerb,fKerb);
    diffuseColor.rgb=mix(diffuseColor.rgb,canalWater,fCanal);
    fWater=fCanal;
    fRelief=fBed*dot(bed,vec3(.3,.59,.11))+lotBed*dot(plots,vec3(.3,.59,.11))+max(fPath,lotPath)*dot(pavers,vec3(.3,.59,.11))*.6;
    fBed=max(fBed,lotBed);fPath=max(fPath,lotPath);
    // Rain (uWind is the storm): wet stone and asphalt go dark and catch the grey sky.
    diffuseColor.rgb*=1.0-.32*uWind*up*(1.0-fBed);
  }`;
const GROUND_ROUGH=`#include <roughnessmap_fragment>
  roughnessFactor=mix(roughnessFactor,.96,fBed);roughnessFactor=mix(roughnessFactor,.82,fPath);roughnessFactor=mix(roughnessFactor,.04,fWater);
  roughnessFactor=mix(roughnessFactor,.22,uWind*.75*step(.3,abs(vFNormal.y))*(1.0-fBed));`;
const GROUND_NORMAL=`#include <normal_fragment_maps>
  {float bump=fRelief*4.0*(1.0-fWater)+fWater*fNoise(vFWorld.xz*2.0+uTime*.3)*.4;normal=normalize(normal+vec3(-dFdx(bump),-dFdy(bump),0.0)*1.2);}`;

// ---- Windows: warm light behind a share of them after dusk -------------------------------------
const GLASS=`#include <emissivemap_fragment>
  {vec2 cell=floor(vec2(vFWorld.x+vFWorld.z,vFWorld.y)/vec2(1.4,2.6));
   // uLit: the share of windows lit at this hour (people go to bed; see windowsLit in main.js).
   float lit=step(1.0-uLit,fHash(cell));
   vec3 warm=mix(vec3(1.0,.62,.32),vec3(1.0,.85,.6),fHash(cell+3.0));
   totalEmissiveRadiance+=warm*lit*uNight*1.6*step(abs(vFNormal.y),.5);}`;

// ---- The sea -------------------------------------------------------------------------------------
// Nutrient load shows as green murk and summer cyanobacteria; clear water is deep blue-green.
const WATER_VERTEX=`
  #ifdef USE_BATCHING
    mat3 fM=mat3(modelMatrix)*mat3(batchingMatrix);
  #else
    mat3 fM=mat3(modelMatrix);
  #endif
  transformed+=inverse(fM)*vec3(0.0,uSeaRise,0.0);vFWorld.y+=uSeaRise;`;
const WATER=`#include <color_fragment>
  {
    vec2 p=vFWorld.xz;
    vec3 murky=vec3(.05,.12,.085),clear=vec3(.012,.07,.11);
    vec3 sea=mix(murky,clear,uWaterClarity);
    float swirl=fFbm(p*.012+vec2(uTime*.004,uTime*.002))*fFbm(p*.05-uTime*.01);
    float bloom=smoothstep(.22,.42,swirl)*uBloom;
    sea=mix(sea,vec3(.3,.38,.12),bloom*.7);
    // A storm: darker, rougher water with breaking crests (white horses) running before the wind.
    if(uWind>0.0){
      float crest=fNoise(p*.085+vec2(uTime*.35,uTime*.12))*fNoise(p*.29-vec2(uTime*.6,uTime*.2));
      sea=mix(sea*(1.0-.35*uWind),vec3(.62,.66,.68),smoothstep(.42,.6,crest)*uWind*.75);
    }
    diffuseColor.rgb=sea;
  }`;
const WATER_NORMAL=`#include <normal_fragment_maps>
  {
    // World-space wave slopes by finite differences; small waves fade with distance so the far sea
    // does not shimmer.
    vec2 p=vFWorld.xz;float t=uTime;
    float dist=length(vFWorld-cameraPosition),fade=1.0/(1.0+dist/180.0);
    #define WAVE(q) (fNoise((q)*.11+vec2(t*.05,t*.03))*1.0+fNoise((q)*.37-vec2(t*.16,-t*.1))*.45*fade+fNoise((q)*1.1+vec2(t*.4,t*.3))*.18*fade*fade)
    float e=.35,h=WAVE(p),hx=WAVE(p+vec2(e,0.0)),hz=WAVE(p+vec2(0.0,e));
    float amp=.9*(1.0+2.4*uWind);
    vec3 wn=normalize(vec3(-(hx-h)/e*amp,1.0,-(hz-h)/e*amp));
    normal=normalize(mat3(viewMatrix)*wn);
  }`;
const WATER_ROUGH=`#include <roughnessmap_fragment>
  roughnessFactor=.06;`;

// ---- Lawns: green, or straw in a drought summer, in patches as real lawns dry out --------------------
const LAWN=`#include <color_fragment>
  if(uDrought>0.0){
    float patchy=fNoise(vFWorld.xz*.045)*.7+fNoise(vFWorld.xz*.23)*.3;
    float dry=uDrought*smoothstep(.15,.6,patchy+.35*uDrought-.2);
    float lum=dot(diffuseColor.rgb,vec3(.299,.587,.114));
    vec3 straw=vec3(.45,.37,.2)*(.6+1.5*lum);
    diffuseColor.rgb=mix(diffuseColor.rgb,straw,dry*.85);
  }`;

const classes={};
// Generated places tint one shared texture per building, through its alpha: walls (alpha 1) take the
// tint, window frames, glass and sills (alpha 0) keep their own colour (CITY.tintMask; the tint is the
// material's colour, or the batch's per-instance colour).
const MASK=[
  ['vec4 diffuseColor = vec4( diffuse, opacity );','vec4 diffuseColor = vec4( 1.0, 1.0, 1.0, opacity );\n\tvec3 wbTint = diffuse;'],
  ['#include <map_fragment>',`#ifdef USE_MAP
    vec4 sampledDiffuseColor = texture2D( map, vMapUv );
    diffuseColor.rgb *= sampledDiffuseColor.rgb;
    float wbMask = sampledDiffuseColor.a;
  #else
    float wbMask = 1.0;
  #endif`],
  ['#include <color_fragment>',`#if defined( USE_COLOR )
    wbTint *= vColor.rgb;
  #endif
  diffuseColor.rgb *= mix( vec3( 1.0 ), wbTint, wbMask );`],
];
function make(kind,{vertex=VERTEX_BODY,parts}){
  for(const mask of [false,true]){
    const fn=shader=>{
      for(const name in FUTURE)shader.uniforms[name]=FUTURE[name];
      shader.vertexShader=VERTEX_HEAD+shader.vertexShader.replace('#include <begin_vertex>',vertex);
      shader.fragmentShader=FRAG_HEAD+shader.fragmentShader;
      for(const [chunk,code] of parts)shader.fragmentShader=shader.fragmentShader.replace(chunk,code);
      if(mask)for(const [chunk,code] of MASK)shader.fragmentShader=shader.fragmentShader.replace(chunk,code);
    };
    classes[kind+(mask?'-mask':'')]={fn,key:`future-v7-${kind}${mask?'-mask':''}`};
  }
}
make('building',{parts:[['#include <color_fragment>',BUILDING],['#include <roughnessmap_fragment>',BUILDING_ROUGH],['#include <metalnessmap_fragment>',BUILDING_METAL],['#include <normal_fragment_maps>',BUILDING_NORMAL]]});
make('ground',{parts:[['#include <color_fragment>',GROUND],['#include <roughnessmap_fragment>',GROUND_ROUGH],['#include <normal_fragment_maps>',GROUND_NORMAL]]});
make('glass',{parts:[['#include <emissivemap_fragment>',GLASS]]});
make('lawn',{parts:[['#include <color_fragment>',LAWN]]});
make('water',{vertex:VERTEX_BODY+WATER_VERTEX,parts:[['#include <color_fragment>',WATER],['#include <normal_fragment_maps>',WATER_NORMAL],['#include <roughnessmap_fragment>',WATER_ROUGH]]});

export function classify(name){
  if(/Water/i.test(name))return 'water';
  if(/Glass|Window_Glass|Window_Pane|Lens/i.test(name))return 'glass';
  // Generated places (wasteland-builder's generator: M_Ground_<surface>, M_Wall_…, M_Roof_…).
  if(/^M_Ground_(Grass|Park|Cemetery|Pitch|Field)/.test(name))return 'lawn';
  if(/^M_Ground_Forest|^M_(Conifer|Container|Furniture|Fixture|Rail|StoneWall)/.test(name))return null;
  if(/^M_Ground_|^M_(Curb|Quay)$/.test(name))return 'ground';
  if(/Castle27|Church|Cathedral|Altar|Organ|Pew|Font_|Portal19|Interior|Column/i.test(name))return null;
  if(/Asphalt|Cobble|Setts|Slabs|Paving|Ground|Gravel|Kerb|ParkingPaint|Tactile|TileApron|Block79_Sand/i.test(name))return 'ground';
  if(/Grass|Lawn/i.test(name)&&!/Hedge|Leaves/i.test(name))return 'lawn';
  // Plants keep their own colours (a tree's "Leaf" must not get the roofs' solar panels).
  if(/Grass|Lawn|Hedge|Leaf|Leaves|Bark|Flower|Common|Mound|Reed|Block107_(Chestnut|Lime|Elm|Ash)|Rail25|Ballast|Sleeper|Bench|Iron|Lamp|Gold|Bronze/i.test(name))return null;
  return 'building';
}
export function adoptFutureMaterial(material){
  if(!material.isMeshStandardMaterial||material.userData.future)return;
  const kind=classify(material.userData.futureName||material.name||'');
  material.userData.future=kind||'none';
  if(!kind)return;
  const c=classes[kind+(material.userData.tintMask&&kind!=='water'?'-mask':'')];
  material.onBeforeCompile=c.fn;
  material.customProgramCacheKey=()=>c.key;
  if(kind==='water'){material.transparent=false;material.envMapIntensity=.6;material.roughness=.06;material.metalness=0;material.map=null;material.normalMap=null;material.color.set(1,1,1);}
  if(kind==='glass'){material.emissive=new THREE.Color(0,0,0);}
  material.needsUpdate=true;
}
// The surface textures as one array (one layer per name in LAYERS). Until the images arrive the city
// shows a 1-pixel neutral layer set, so materials can compile at once.
export function placeholderTextures(){
  const t=new THREE.DataArrayTexture(new Uint8Array(4*LAYERS.length).fill(128),1,1,LAYERS.length);
  t.needsUpdate=true;FUTURE.uTex.value=t;return t;
}
export async function loadSurfaceTextures(renderer,{lite=false}={}){
  const size=lite?512:1024,data=new Uint8Array(size*size*4*LAYERS.length);
  const canvas=document.createElement('canvas');canvas.width=canvas.height=size;
  const g=canvas.getContext('2d',{willReadFrequently:true});
  // Decode in parallel, copy into the array one at a time through one canvas.
  const images=await Promise.all(LAYERS.map(async name=>{const img=new Image();img.src=`textures/${name}${lite?'-512':''}.jpg`;await img.decode();return img;}));
  images.forEach((img,i)=>{g.clearRect(0,0,size,size);g.drawImage(img,0,0,size,size);data.set(g.getImageData(0,0,size,size).data,i*size*size*4);});
  const tex=new THREE.DataArrayTexture(data,size,size,LAYERS.length);
  tex.format=THREE.RGBAFormat;tex.wrapS=tex.wrapT=THREE.RepeatWrapping;tex.generateMipmaps=true;
  tex.minFilter=THREE.LinearMipmapLinearFilter;tex.magFilter=THREE.LinearFilter;
  tex.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());tex.needsUpdate=true;
  FUTURE.uTex.value=tex;
  return tex;
}
