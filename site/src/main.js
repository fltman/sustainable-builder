import './style.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { computeBoundsTree, disposeBoundsTree, acceleratedRaycast } from 'three-mesh-bvh';
import { createCity } from './city.js';
import { createCityBatches } from './city-batches.js';
import { createBVHBuilder } from './bvh-builder.js';
import { createWorld } from './world.js';
import { createCamera } from './camera.js';
import { createPlanning } from './planning.js';
import { FUTURE, adoptFutureMaterial, placeholderTextures, loadSurfaceTextures } from './future.js';
import { scanLand } from './landuse.js';
import { createFeatures } from './features.js';
import { createGraph } from './graph.js';
import { createTraffic } from './traffic.js';
import { createResidents } from './residents.js';
import { PLACES } from '@city/places.js';
import { FAMILY, lifespans } from '@city/family.js';
import { createApp } from './ui/app.js';
import { t, LANG, STORE } from './i18n.js';
import { createResolutionGovernor } from './resolution.js';
import { createAudio } from './audio.js';
import { createPost } from './post.js';
import { createClouds } from './clouds.js';
import { createRoofProps } from './roofprops.js';
import { createDistricts } from './districts.js';
import { AR_SPOTS, arSpec } from '@city/ar.js';
import { createSea } from './sea.js';
import { createFlood, SEA_CAP } from './flood.js';
import { residentsContext } from './model.js';
import { createWeather } from './weather.js';
import { createHorizon } from './horizon.js';
import { createRide } from './ride.js';
import { loadCrowd } from './crowd.js';
import { loadVehicles } from './vehicles3d.js';
import { LAND } from './landuse.js';
import { CITY, PLACE } from './city-config.js';

THREE.BufferGeometry.prototype.computeBoundsTree=computeBoundsTree;
THREE.BufferGeometry.prototype.disposeBoundsTree=disposeBoundsTree;
THREE.Mesh.prototype.raycast=acceleratedRaycast;
const params=new URLSearchParams(location.search);
const touch=params.has('touch')||matchMedia('(pointer: coarse)').matches;
// safe: the last page in this tab died while loading or running (a phone that ran out of memory –
// src/boot.js notices); start again on the leanest settings.
const safe=Boolean(window.__kalmarSafe)||params.has('safe');
const lite=touch||params.has('lite')||safe;

// Loading screen: the first screen from index.html, now showing the meter (src/boot.js).
const loading=document.getElementById('loading');
document.documentElement.lang=LANG;
const progress=(p,text)=>{document.getElementById('load-fill').style.width=`${Math.round(p*100)}%`;if(text)document.getElementById('load-text').textContent=text;};
function fail(e){console.error(e);progress(1,t(`Något gick fel: ${e.message||e}. Ladda om sidan i en webbläsare med WebGL.`,`Something went wrong: ${e.message||e}. Reload the page in a browser with WebGL.`,`Qualcosa è andato storto: ${e.message||e}. Ricarica la pagina in un browser con WebGL.`));}

try{
const renderer=new THREE.WebGLRenderer({canvas:document.getElementById('scene'),antialias:true,powerPreference:'high-performance'});
// The 3D view is a picture; what it shows is also told in words in the Vision tab.
renderer.domElement.setAttribute('role','img');renderer.domElement.setAttribute('aria-label',t(`${PLACE.model} i 3D, år för år. Det som syns beskrivs också i text under Visionen.`,`${PLACE.model} in 3D, year by year. What it shows is also described in words under Vision.`,`${PLACE.model} in 3D, anno per anno. Ciò che si vede è descritto anche a parole sotto Visione.`));
const basePixelRatio=Math.min(devicePixelRatio,lite?1:1.25);renderer.setPixelRatio(basePixelRatio);renderer.setSize(innerWidth,innerHeight);
renderer.toneMapping=THREE.AgXToneMapping;renderer.shadowMap.enabled=!lite;renderer.shadowMap.type=THREE.PCFShadowMap;
// Shadows are re-rendered every other frame (the sun and the frustum move slowly).
renderer.shadowMap.autoUpdate=false;renderer.shadowMap.needsUpdate=true;let shadowTick=0;
const scene=new THREE.Scene();
const resolution=createResolutionGovernor({min:.6});
const tune={};for(const k of ['exposure','env','hemi','sun'])if(params.has(k))tune[k]=+params.get(k);
const world=createWorld(scene,renderer,{lite,tune});
world.hour=params.has('hour')?+params.get('hour'):16.5;
const clouds=createClouds(scene,world.sun);if(params.has('clouds'))clouds.cover=+params.get('clouds');
const view=createCamera(renderer);
const post=params.has('nopost')||safe?null:createPost(renderer,scene,view.camera,{lite});
post?.setClouds(clouds);
if(params.has('cam')){const [x,y,z]=params.get('cam').split(',').map(Number);view.camera.position.set(x,y,z);}
if(params.has('target')){const [x,y,z]=params.get('target').split(',').map(Number);view.controls.target.set(x,y,z);}
view.controls.update();
progress(.05,t('Läser kartan …','Reading the map …','Lettura della mappa …'));
// People and vehicles modelled in Blender (tools/build-crowd.py, tools/build-vehicles.py). If they
// cannot be loaded, the procedural kit figures stand in.
const crowdP=safe?Promise.resolve(null):loadCrowd({time:FUTURE.uTime}).catch(e=>{console.warn('Folkmassan:',e);return null;});
const vehiclesP=loadVehicles().catch(e=>{console.warn('Fordonen:',e);return null;});
const map=await fetch('city/map.json').then(r=>r.json());
const planning=createPlanning(map);
FUTURE.uPlan.value=planning.paint();FUTURE.uPlanRect.value.copy(planning.uniform);
placeholderTextures();
const surfaces=loadSurfaceTextures(renderer,{lite}).catch(e=>console.warn('Ytornas texturer:',e));
const loader=new GLTFLoader();loader.setMeshoptDecoder(MeshoptDecoder);
const batches=createCityBatches(scene,lite?{headroom:1.08,growth:1.25}:{});
const [crowd,vehicles]=await Promise.all([crowdP,vehiclesP]);
const roofProps=createRoofProps(scene,planning,{lite,crowd});
const city=await createCity(scene,loader,renderer,{lite,dropMesh:o=>Boolean(CITY.hide?.test(o.material?.name||'')),adoptMaterial:adoptFutureMaterial,buildBVH:createBVHBuilder(),batches,onTile:t=>roofProps.addTile(t),onUnload:t=>roofProps.removeTile(t)});
// Phones keep a smaller city in memory (iOS Safari closes tabs that use too much): a shorter load
// radius and less of it in full detail.
const radiusFor=d=>THREE.MathUtils.clamp(140+d*.7,lite?130:180,safe?160:lite?210:650);
// On a phone full detail is for close-ups only: zoomed out, nearby blocks use the simplified tiles too.
const nearFor=params.has('near')?()=>+params.get('near'):lite?d=>THREE.MathUtils.clamp(115-d*.3,25,safe?45:60):d=>THREE.MathUtils.clamp(70+d*.16,100,165);
const streamCentre=new THREE.Vector3();
const centre=()=>{const t=view.controls.target,c=view.camera.position;return streamCentre.set(t.x+(c.x-t.x)*.3,0,t.z+(c.z-t.z)*.3);};
{const d=view.camera.position.distanceTo(view.controls.target);await city.ensure(centre(),radiusFor(d),nearFor(d),p=>progress(.1+.6*p,t(`Bygger ${PLACE.centre}, kvarter för kvarter …`,`Building ${PLACE.centre}, block by block …`,`Costruzione ${PLACE.centreGenitive}, isolato per isolato …`)));}
await surfaces;
progress(.72,t('Kartlägger gator, parker och kajer …','Mapping streets, parks and quays …','Mappatura di strade, parchi e banchine …'));
// Asphalt off the mapped streets – or on a parking aisle (OSM service way) – is a car park.
// The ground scan covers the place's model (CITY.scan, else the map's bounds) up to its highest ground.
const groundTop=map.terrain?Math.max(...map.terrain.dm)/10:0;
const scanRect=CITY.scan||(map.bounds?{minX:map.bounds[0],minZ:map.bounds[1],maxX:map.bounds[2],maxZ:map.bounds[3]}:{});
const land=await scanLand(city.tiles.find(t=>t.id==='base').meshes,{...scanRect,top:groundTop+60,maxY:groundTop+14,bridges:map.bridges||[],isRoad:(x,z)=>{const r=planning.roadAt(x,z,.5);return Boolean(r)&&!(r.kind==='service'&&r.w<=4);}});
progress(.85,t('Planterar framtiden …','Planting the future …','Semina del futuro …'));
const districts=createDistricts(scene,planning,land,{lite});
const lotKey=(x,z)=>Math.floor(x/48)+','+Math.floor(z/48);
const features=createFeatures(scene,planning,land,{lite,crowd,vehicles,skipLot:(x,z)=>districts.usedLots.has(lotKey(x,z))});
const sea=createSea(scene,land,{lite,vehicles});
const weather=createWeather(scene,{world,clouds,features,renderer,lite});
const flood=await createFlood(scene);
const horizon=await createHorizon(scene,{lite});
const graph=createGraph(planning.roads);
// A place can change the street fleets (CITY.traffic: Venice has no cars and forbids bicycles).
const traffic=createTraffic(scene,graph,land,{crowd,vehicles,max:{car:180,bike:260,pod:28,...CITY.traffic}});
// The canals' centre lines (map.json waterways), for boats that find their way: Venice's gondolas and water taxis.
const waterGraph=map.waterways?.length?createGraph(map.waterways,{merge:4}):null;
const ride=createRide({view,land,planning,graph,scene,LAND,crowd,vehicles,waterGraph});
const residents=createResidents(scene,{graph,land,planning,features,places:PLACES,family:FAMILY,crowd},{count:safe?150:lite?220:420});
progress(.95,t('Väcker invånarna …','Waking the residents …','Risveglio degli abitanti …'));

// The vision the city shows eases toward the year's target, so scrubbing and playing read as growth.
let shown=null,target=null,ctxYear=2026,ctxInfo=null;
function pushUniforms(v){
  FUTURE.uRoofCover.value=v.roofCover;FUTURE.uGreenRatio.value=v.greenRatio;FUTURE.uFacadeGreen.value=v.facadeGreen;FUTURE.uDepave.value=v.depave;FUTURE.uParking.value=v.parking;
  FUTURE.uSeaRise.value=v.seaRise;FUTURE.uWaterClarity.value=v.waterClarity;FUTURE.uBloom.value=v.bloom;FUTURE.uCanal.value=v.canals??0;FUTURE.uVerge.value=v.verge??0;
  weather.base.drought=v.dry??0;FUTURE.uDrought.value=Math.max(weather.now.drought,weather.base.drought);
}
function pushVision(v){pushUniforms(v);features.setVision(v);traffic.setVision(v);districts.setVision(v);sea.setVision(v);horizon?.setVision?.(v);}
let spanCache=null,spanRun=null;
const audio=createAudio();
const losRay=new THREE.Raycaster();
const engine={
  world,residents,audio,ride,
  setFlood(level){flood.set(level);},
  setWeather(w){weather.set(w);},
  // Where a change shows (ui/changes.js): of the things that appear between two values of the vision –
  // layers and timber blocks grow in their items' order – the one nearest the view; or a fixed place.
  changeAt(anchor,a,b){
    if(anchor&&typeof anchor==='object')return anchor;
    const tg=view.controls.target,lo=Math.min(a,b),hi=Math.max(a,b),L=features.layers;
    const nearest=(list,lift)=>{let best=null,bd=Infinity;for(const it of list){const d=Math.hypot(it.x-tg.x,it.z-tg.z);if(d<bd){bd=d;best=it;}}return best&&{x:best.x,y:(best.y??0)+lift(best),z:best.z};};
    const fresh=(items,lift)=>nearest(items.filter(it=>it.order>lo&&it.order<=hi),lift)||nearest(items.filter(it=>it.order<=hi),lift);
    switch(anchor){
      case 'trees':return fresh(L.trees.items,()=>4.5);
      case 'farmBeds':return fresh(L.farmBeds.items,()=>.8);
      case 'fruit':return fresh(L.fruit.items,()=>3);
      case 'buoys':return fresh(L.buoys.items,()=>1);
      case 'turbines':return fresh(L.turbines.items,()=>111);
      case 'blocks':return fresh(districts.blocks,b=>b.floors*3.1);
      case 'wall':return nearest(L.wall.items,()=>2);
      case 'tower':return districts.tower&&{x:districts.tower.x,y:districts.tower.y+districts.tower.height*.55,z:districts.tower.z};
      case 'village':return sea.village?{x:sea.village.x,y:2,z:sea.village.z}:fresh(L.rafts.items,()=>1.5);
      // Where people are: the resident outdoors with the most others around, near the view.
      case 'crowd':{
        const out=residents.people.filter(p=>p.visible&&Math.hypot(p.pos.x-tg.x,p.pos.z-tg.z)<350);let best=null,bn=0;
        for(const p of out){let n=0;for(const q of out)if(Math.abs(q.pos.x-p.pos.x)<25&&Math.abs(q.pos.z-p.pos.z)<25)n++;if(n>bn){bn=n;best=p;}}
        return best&&{x:best.pos.x,y:land.heightAt(best.pos.x,best.pos.z)+2,z:best.pos.z};
      }
      // The car nearest the view, or a car street.
      case 'cars':return nearest(traffic.fleets.car.agents.filter(a=>a.x!=null),()=>1.6)||{x:-100,y:2,z:2};
    }
    return null;
  },
  get flying(){return view.flying;},
  view:{get dist(){return view.camera.userData.dist||200;}},
  applyVision(v,immediate,year,info){
    target=v;ctxYear=year;ctxInfo=info;
    if(immediate||!shown){shown={...v};pushVision(shown);}
  },
  follow(p){view.follow(()=>residents.position(p));},
  stopFollow(){view.stopFollow();},
  mapControl(action){
    if(ride.mode)return;
    ({in:()=>view.orbit({zoom:.7}),out:()=>view.orbit({zoom:1.43}),left:()=>view.orbit({turn:.35}),right:()=>view.orbit({turn:-.35}),up:()=>view.orbit({tilt:-.15}),down:()=>view.orbit({tilt:.15}),north:()=>view.north(),home:()=>view.home()})[action]?.();
  },
  get heading(){return view.heading();},
  flyTo(x,z){view.flyTo({x,y:0,z},{distance:Math.min(260,view.camera.position.distanceTo(view.controls.target)),duration:2});},
  // AR anchors on what is actually in view: the nearest visible instance of each kind of thing
  // (in front of the camera, within reach), mapped to the AR spot that explains it.
  arAnchors(reach=120){
    const cam=view.camera.position,dir=new THREE.Vector3();view.camera.getWorldDirection(dir);
    const out=[],L=features.layers;
    // Up to three in-front candidates of each kind; the interface keeps the first one on screen.
    const near=(list,count,spot,lift=1.2)=>{
      const c=[];
      for(let i=0;i<count;i++){const it=list[i],dx=it.x-cam.x,dz=it.z-cam.z,d=Math.hypot(dx,dz);
        if(d<5||d>reach||(dx*dir.x+dz*dir.z)/d<.2)continue;c.push([d,it]);}
      c.sort((a,b)=>a[0]-b[0]);
      for(const [d,it] of c.slice(0,3))out.push({spot,at:{x:it.x,y:(it.y??0)+lift,z:it.z},d});
    };
    near(L.beds.items,L.beds.count,'mat',.6);near(L.farmBeds.items,L.farmBeds.count,'mat',.6);
    near(L.trees.items,L.trees.count,'trad',4.5);near(L.fruit.items,L.fruit.count,'trad',3);
    near(L.tables.items,L.tables.count,'gemenskap',1);near(L.stalls.items,L.stalls.count,'gemenskap',2);
    near(L.wall.items,L.wall.mesh.count?L.wall.items.length:0,'niva',1.5);
    const blocks=districts.blocks.filter((_,i)=>i<districts.stats().shown/2).map(b=>({x:b.x,y:b.y+b.floors*3.1,z:b.z}));near(blocks,blocks.length,'bo',0);
    if(districts.tower&&districts.tower.group.visible)near([{x:districts.tower.x,y:districts.tower.y+40,z:districts.tower.z}],1,'torn',0);
    return out;
  },
  // True when nothing in the city stands between the camera and (x,y,z) and it is close enough to read.
  visible(x,y,z,maxDist){
    const target=new THREE.Vector3(x,y,z),from=view.camera.position,d=from.distanceTo(target);
    if(d>maxDist)return false;
    losRay.set(from,target.clone().sub(from).normalize());losRay.far=d-2;
    const hit=city.pick(losRay);return !hit||hit.distance>d-4;
  },
  project(x,y,z){
    const v=new THREE.Vector3(x,y,z),d=v.distanceTo(view.camera.position);if(d>2600)return null;
    v.project(view.camera);if(v.z>1||Math.abs(v.x)>1.05||Math.abs(v.y)>1.05)return null;
    return {x:(v.x+1)/2*innerWidth,y:(1-v.y)/2*innerHeight,d,fade:d<1400?1:Math.max(0,1-(d-1400)/1200)};
  },
};
// Before/after: the left part of the screen renders the city of 2026, the right part the year shown.
const compare={on:false,split:.5,el:null};
engine.setCompare=on=>{
  compare.on=on;
  if(on&&!compare.el){
    const d=document.createElement('div');d.className='compare';d.innerHTML='<div class="compare-line"></div><div class="compare-handle">⟷</div><span class="compare-tag left">2026</span><span class="compare-tag right"></span>';
    document.body.append(d);compare.el=d;
    const move=e=>{compare.split=Math.max(.05,Math.min(.95,e.clientX/innerWidth));d.style.left=compare.split*100+'%';};
    d.querySelector('.compare-handle').addEventListener('pointerdown',e=>{e.preventDefault();const up=()=>{removeEventListener('pointermove',move);removeEventListener('pointerup',up);};addEventListener('pointermove',move);addEventListener('pointerup',up);});
  }
  if(compare.el){compare.el.style.display=on?'block':'none';compare.el.style.left=compare.split*100+'%';}
};
engine.setSplit=v=>{compare.split=v;if(compare.el)compare.el.style.left=v*100+'%';};
// A still of the city for the postcard (ui/postcard.js): the frames are drawn at a resolution that gives
// the long side `long` pixels – a few, so the ambient occlusion settles at the new size – and the last
// is copied the moment it is rendered (the canvas keeps no buffer); then the screen goes back.
let still=null;
engine.snapshot=(long=1600)=>new Promise(resolve=>{still={long,resolve,wait:-1};});
const app=createApp(engine);
residents.settle(2026,world.hour);

// Clicks: a short tap on a resident selects them (drags orbit the camera).
let down=null;
renderer.domElement.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY,t:performance.now()};});
renderer.domElement.addEventListener('pointerup',e=>{
  if(!down||Math.hypot(e.clientX-down.x,e.clientY-down.y)>6||performance.now()-down.t>500)return;
  if(app.mapTap())return;
  const ndc={x:e.clientX/innerWidth*2-1,y:-(e.clientY/innerHeight)*2+1};
  const p=residents.pick(ndc,view.camera,innerWidth,innerHeight,18);
  app.select(p);
});
addEventListener('resize',()=>{renderer.setSize(innerWidth,innerHeight);view.resize();post?.setSize(innerWidth,innerHeight);});

// How much of the city is out and about at this hour (0 at night, 1 at the daytime peak).
function outdoors(h){
  const k=[[0,.05],[4.5,.02],[6,.25],[7.5,.85],[9,.8],[12,1],[16.5,1],[18,.9],[21,.6],[22.5,.3],[23.5,.1],[24,.05]];
  for(let i=1;i<k.length;i++)if(h<=k[i][0]){const [a,va]=k[i-1],[b,vb]=k[i];return va+(vb-va)*(h-a)/(b-a);}
  return .05;
}
// Share of lit windows by the hour: evenings at home, bedtime from ten, a few night owls, early risers.
function windowsLit(h){
  const k=[[0,.16],[1,.09],[3,.05],[5,.08],[6,.22],[7.5,.3],[16,.3],[18,.5],[21,.5],[22,.4],[23,.27],[24,.16]];
  for(let i=1;i<k.length;i++)if(h<=k[i][0]){const [a,va]=k[i-1],[b,vb]=k[i];return va+(vb-va)*(h-a)/(b-a);}
  return .16;
}
let last=performance.now(),fps=0,frames=0,fpsTime=0;
const prof=params.has('prof')?{}:null;let pt=0;
const mark=name=>{if(!prof)return;const t=performance.now();prof[name]=(prof[name]||0)*.95+(t-pt)*.05;pt=t;};
// A fault in the interface must never stop the city: the next frame is asked for first, and an error
// in the panels is reported once rather than every frame.
const faults=new Set();
function frame(now){
  if(!film)requestAnimationFrame(frame);
  // The first frame's timestamp can be older than `last` (set while loading): never a negative step.
  const dt=Math.max(0,Math.min(.1,(now-last)/1000));last=now;pt=performance.now();
  FUTURE.uTime.value+=dt;
  // Ease the shown city toward the target vision.
  if(target&&shown){
    let moved=false;const k=1-Math.exp(-dt*3.5);
    for(const key in target){const dv=target[key]-shown[key];if(Math.abs(dv)>1e-4){shown[key]+=dv*k;moved=true;}}
    if(moved)pushVision(shown);
  }
  // Storms: the water on land and the sea surface rise together.
  FUTURE.uSeaRise.value=Math.min(SEA_CAP,(shown?.seaRise??0)+flood.update(dt,shown));
  if(compare.on&&flood.mesh)flood.mesh.visible=false;
  mark('vision');
  if(app.S.run&&spanRun!==app.S.run){spanRun=app.S.run;spanCache=lifespans(app.S.run);}
  const ind=ctxInfo?.d?.ind||{};
  const rc=residentsContext(ind,ctxInfo?.I||{});
  residents.setContext({vision:shown||{},spans:spanCache||{},I:ctxInfo?.I||{},community:shown?.community??.1,cohousing:rc.cohousing,analog:rc.analog,digital:rc.digital,
    bloom:rc.bloom,lonely:rc.lonely,socialDecay:.7+rc.lonely,workday:rc.workday,stayIn:weather.now.empty});
  // 1× = one game hour per 75 real seconds; 60× = a day in half a minute. While the century plays the
  // day runs as a time-lapse instead – about a day every twelve seconds, the dark hours three times
  // faster still – so the years are not spent in the dark (⏸ keeps the hour where it is).
  const speed=app.S.speed;
  const gameMinutes=speed&&app.lapse?Math.max(dt*speed*.8,dt*120*(1+2*FUTURE.uNight.value)):dt*speed*.8;
  world.hour=world.hour+gameMinutes/60;FUTURE.uLit.value=windowsLit(world.hour)*(1-.75*weather.now.dark);
  const dist=ride.mode?ride.update(dt):view.update(dt);mark('camera');
  weather.update(dt,view.camera,dist);horizon.update(world.weather,FUTURE.uNight.value,dt);
  city.update(dt,centre(),radiusFor(dist),nearFor(dist));mark('city');
  const sky=world.update(view.controls.target,Math.min(600,dist*1.1));
  clouds.update(view.controls.target,world.sky.material.uniforms.sunPosition.value,sky.day,view.camera);
  mark('world');features.update(dt,world.hour);districts.update();sea.update(dt,ride.boatAt);mark('features');
  if(shown)roofProps.update(dt,shown,world.hour);mark('roofprops');
  traffic.setActivity(outdoors(world.hour)*(1-.6*weather.now.empty));
  {const pace=Math.max(.25,Math.min(3,speed||.25));traffic.update(dt*pace,view.controls.target,Math.max(260,dist*1.4),pace);}
  mark('traffic');residents.update(dt,Math.min(gameMinutes,dt*48),ctxYear,world.hour,Math.max(.4,Math.min(3,speed||.4)));mark('residents');
  try{app.frame(dt);}catch(e){if(!faults.has(e.message)){faults.add(e.message);console.error(e);}}mark('app');
  if(audio.on){const t=view.controls.target;let water=0;for(const [dx,dz] of [[0,0],[70,0],[-70,0],[0,70],[0,-70]])if(land.kindAt(t.x+dx,t.z+dz)===LAND.WATER||land.kindAt(t.x+dx,t.z+dz)===LAND.NONE)water+=.2;
    audio.update(dt,shown,{hour:world.hour,night:FUTURE.uNight.value,dist,nearWater:water,storm:weather.now.storm,empty:weather.now.empty});}
  // Resolution governor (not in film mode, where frames are stepped): drop render resolution when
  // most frames miss 60 Hz. Applied before rendering, so a resize never shows an empty frame.
  if(still&&still.wait<0){
    still.restore=renderer.getPixelRatio();
    const pr=Math.min(2.5,Math.max(still.restore,still.long/Math.max(innerWidth,innerHeight)));
    if(pr>still.restore+.01){renderer.setPixelRatio(pr);post?.setSize(innerWidth,innerHeight);still.wait=3;}else still.wait=0;
  }
  if(!still&&!params.has('film')&&resolution.update(dt)){renderer.setPixelRatio(basePixelRatio*resolution.scale);post?.setSize(innerWidth,innerHeight);}
  // Before rendering, so the very first frame already has its shadow map.
  if((shadowTick=(shadowTick+1)%2)===1)renderer.shadowMap.needsUpdate=true;
  if(compare.on&&app.S.run&&shown){
    // The before/after view renders straight to the screen in two scissored halves.
    if(post)post.enabled=false;
    // 2026 on the left. On the right the year shown – or, while the timeline is still near 2026,
    // the end of the plan, so the comparison always shows what the choices lead to.
    const late=ctxYear>=2036,rightYear=late?ctxYear:2126;
    compare.el.querySelector('.compare-tag.right').textContent=String(rightYear);
    const w=renderer.domElement.clientWidth,h=renderer.domElement.clientHeight,x=Math.round(w*compare.split);
    const saved={...shown},then=app.S.run.years[0].vision,end=app.S.run.years[app.S.run.years.length-1].vision;
    const apply=v=>{pushUniforms(v);features.showFor(v);districts.setVision(v);sea.setVision(v);};
    renderer.setScissorTest(true);
    if(!late)apply(end);
    renderer.setScissor(x,0,w-x,h);renderer.render(scene,view.camera);
    // The 2026 half reuses this frame's shadow map.
    apply(then);
    renderer.setScissor(0,0,x,h);renderer.render(scene,view.camera);
    pushUniforms(saved);features.restore();districts.setVision(saved);sea.setVision(saved);
    renderer.setScissorTest(false);
  }else if(post){if(!post.enabled)post.enabled=true;post.render(dt,FUTURE.uNight.value,world.weather);}
  else renderer.render(scene,view.camera);
  mark('render');
  if(still&&still.wait>=0&&still.wait--===0){
    const c=document.createElement('canvas');c.width=renderer.domElement.width;c.height=renderer.domElement.height;
    c.getContext('2d').drawImage(renderer.domElement,0,0);
    if(renderer.getPixelRatio()!==still.restore){renderer.setPixelRatio(still.restore);post?.setSize(innerWidth,innerHeight);}
    still.resolve(c);still=null;
  }
  frames++;fpsTime+=dt;if(fpsTime>1){fps=frames/fpsTime;frames=fpsTime=0;}
}
progress(1,t('Klart.','Ready.','Pronto.'));
loading.style.transition='opacity .6s';loading.style.opacity='0';setTimeout(()=>loading.remove(),700);
// A language switch inside the app comes back to the same plan; everyone else starts at the start
// screen (a shared plan in the address is offered there first).
let resume=null;try{resume=sessionStorage.getItem(`${STORE}-resume`);sessionStorage.removeItem(`${STORE}-resume`);}catch{}
if(resume&&app.loadShared('#'+resume)){}
else if(params.has('preset')){const {PRESETS}=await import('./scenario.js');app.loadPreset(PRESETS.find(p=>p.id===params.get('preset'))||PRESETS[1]);}
else if(params.has('sandbox'))app.setMode('sandbox');
else if(params.has('journey'))app.startJourney();
else if(app.sharedLink(location.hash))app.openShared(location.hash);
else app.showStart();
if(params.has('year')){app.pause();app.setYear(+params.get('year'));}
// ?film: no animation loop; a recorder steps frames itself (tools/film.mjs) for smooth, exact video.
const film=params.has('film');
if(film){document.body.classList.add('film');let t=performance.now();window.kalmarStep=dt=>{t+=dt*1000;frame(t);};}
else requestAnimationFrame(frame);
const {PRESETS:presets}=await import('./scenario.js');
window.kalmar={flood,weather,horizon,crowd,vehicles,prof,AR_SPOTS,arSpec,THREE,renderer,post,clouds,roofProps,districts,sea,scene,view,city,world,planning,FUTURE,batches,land,features,traffic,residents,graph,app,engine,presets,get fps(){return fps;},ready:true};
}catch(e){fail(e);}
