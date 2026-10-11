import * as THREE from 'three';
import * as K from './meshes.js';
import { figureFor, personBatch, setWalkRate } from './folk.js';
import { hash } from './planning.js';
import { LAND } from './landuse.js';
import { firstName, surname } from './names.js';
import { LANG, L } from './i18n.js';
import * as PEOPLE from '@city/people.js';
import { BASE } from './model.js';
const JOBS_TODAY=PEOPLE.jobsToday,JOBS_FUTURE=PEOPLE.jobsFuture;

// The Sims layer. The residents of the place's centre have needs (rest, food, company, nature, meaning), a
// home, an age-appropriate day, and choose what to do next by utility: how much an activity would
// help their most pressing needs, whether it exists in this year's city, the hour and the walk.
// The city the player builds decides which activities exist: shared meals need long tables, garden
// work needs cultivated streets, a library hour needs an analogue culture worth having.
export const NEEDS=[
  {id:'energy',name:'Vila',decay:3.2},
  {id:'food',name:'Mat',decay:5},
  {id:'social',name:'Gemenskap',decay:3},
  {id:'nature',name:'Natur',decay:2.4},
  {id:'purpose',name:'Mening',decay:2},
];
// gains per hour of activity; indoors: hidden while there.
const ACTIVITIES={
  sleep:{name:'Sover',place:'home',indoor:true,gain:{energy:14},hours:[22,7],min:300},
  home:{name:'Hemma',place:'home',indoor:true,gain:{energy:3,food:20},min:60},
  screen:{name:'Skärmtid hemma',place:'home',indoor:true,gain:{energy:2,purpose:2},drain:{social:2,nature:1},min:60},
  work:{name:'Arbetar',place:'work',indoor:true,gain:{purpose:9},drain:{energy:2},hours:[8,16],adult:true,min:240},
  school:{name:'I skolan',place:'school',indoor:true,gain:{purpose:8,social:6},hours:[8,15],child:true,min:240},
  garden:{name:'Odlar',place:'garden',gain:{nature:14,purpose:7,social:4},drain:{energy:2},hours:[7,20],min:70},
  meal:{name:'Gemensam måltid',place:'meal',gain:{food:45,social:22},hours:[11,13,17,20],min:60},
  market:{name:'På torget',place:'market',gain:{food:18,social:10},hours:[8,16],min:35},
  park:{name:'Promenerar i parken',place:'park',gain:{nature:18,energy:2},hours:[6,22],min:40},
  quay:{name:'Vid vattnet',place:'quay',gain:{nature:16,social:6},hours:[7,22],min:45},
  library:{name:'Läser på biblioteket',place:'library',indoor:true,gain:{purpose:10,social:5},hours:[9,20],min:60},
  care:{name:'Hälsar på i Generationshuset',place:'care',indoor:true,gain:{social:16,purpose:8},hours:[10,19],min:60},
};
// What people do for a living follows the city: today's jobs, and new ones as the levers take hold.
export function jobFor(p,age,year,I={}){return L(jobForSv(p,age,year,I));}
function jobForSv(p,age,year,I={}){
  if(age<6)return 'förskolebarn';if(age<19)return 'elev';
  if(age<23)return PEOPLE.youth?.(I)||'student';                    // the place's own (Kalmar: a year of civic service)
  if(age>=(PEOPLE.retireAge??67))return 'pensionär';
  const pool=[...JOBS_TODAY.map(j=>[j,1])];for(const [lever,job] of JOBS_FUTURE){const w=(I[lever]||0)*3;if(w>.3)pool.push([job,w]);}
  const total=pool.reduce((s,[,w])=>s+w,0);let r=hash(p.id*7.7+Math.floor(year/10)*3.1)*total;
  for(const [j,w] of pool){if((r-=w)<=0)return j;}return pool[0][0];
}
if(LANG!=='sv'){for(const n of NEEDS)n.name=L(n.name);for(const a of Object.values(ACTIVITIES))a.name=L(a.name);}
// The place's age mix in 2026 (its starting values: SCB via Kolada in Sweden).
// The age mix in 2026 (a share the place lacks falls back to a typical one, so no age is ever NaN).
const BASE_MIX={young:BASE.share0_19??(BASE.share0_14!=null?BASE.share0_14*1.33:.2),old:BASE.share65??.2,old80:BASE.share80??.05};
// The age at place u (0–1) in an age mix, spread evenly within each band; the under-20s keep 2026's share.
export function ageFrom(u,old=BASE_MIX.old,old80=BASE_MIX.old80){
  const y=BASE_MIX.young;
  const a=u<y?u/y*20:u<1-old?20+(u-y)/(1-old-y)*45:u<1-old80?65+(u-(1-old))/(old-old80)*15:80+(u-(1-old80))/old80*17;
  return Math.min(97,Math.floor(a));
}
const SHIRTS=[0xd9534f,0x3b7dd8,0xf0ad4e,0x5cb85c,0x8e44ad,0xf4f4f4,0x2c3e50,0xe67e22,0x1abc9c,0xc0392b,0xf1c40f,0x6d4c41,0x90a4ae,0xff8a80,0x7986cb];

export function createResidents(scene,{graph,land,planning,features,places:named,family=[],crowd=null},{count=420}={}){
  // Homes: residential-sized footprints in the model, entered from the nearest street node.
  const homes=planning.buildings.filter(b=>b.area>80&&b.area<4000&&!b.heritage&&planning.onIsland(b.cx,b.cz)).map(b=>({x:b.cx,z:b.cz,node:graph.nearest(b.cx,b.cz),b}));
  const spot=(x,z,type,extra={})=>({x,z,type,node:graph.nearest(x,z),...extra});
  const quays=[],parks=[];
  for(const c of land.cells(LAND.GREEN))if(hash(c.x*.37+c.z*1.3)<.06)parks.push(spot(c.x,c.z,'park'));
  // Quay spots: walkable cells next to water.
  for(const c of land.cells(LAND.PAVED).concat(land.cells(LAND.LAND)))if(hash(c.x*.11+c.z*.7)<.05&&[[6,0],[-6,0],[0,6],[0,-6]].some(([dx,dz])=>land.kindAt(c.x+dx,c.z+dz)===LAND.WATER))quays.push(spot(c.x,c.z,'quay'));
  const workplaces=named.filter(p=>p.work).map(p=>spot(p.x,p.z,'work',{name:p.name}));
  const schools=named.filter(p=>p.school).map(p=>spot(p.x,p.z,'school',{name:p.name}));
  const libraries=named.filter(p=>p.library).map(p=>spot(p.x,p.z,'library',{name:p.name}));
  const care=named.filter(p=>p.care).map(p=>spot(p.x,p.z,'care',{name:p.name}));
  const fromLayer=(layer,type,every=1)=>layer.items.filter((_,i)=>i%every===0).map(it=>spot(it.x,it.z,type,{order:it.order,layer,idx:layer.items.indexOf(it),rot:it.rot,y:it.y}));
  const gardens=[...fromLayer(features.layers.beds,'garden',6),...fromLayer(features.layers.farmBeds,'garden',2)];
  const meals=fromLayer(features.layers.tables,'meal');
  const markets=fromLayer(features.layers.stalls,'market');
  let vision={},ctx={};
  const open=s=>!s.layer||s.layer.mesh.count>s.idx;
  const PLACES={home:null,work:workplaces,school:schools,garden:gardens,meal:meals,market:markets,park:parks,quay:quays,library:libraries,care};

  // People: the age mix is the year's – each person keeps a place in it (u), so as the place ages the
  // same people are older (ageFrom); names follow the birth decade of the year shown. As the place grows
  // more of them are out (the first `count` live here in 2026; up to 60 % more join as the population
  // grows, ctx.people). The featured family has real birth years and ages through the century.
  const people=[],base=count;
  let r=7;const R=()=>hash(r++*1.618);
  const blank=()=>Object.fromEntries(NEEDS.map(n=>[n.id,40+R()*50]));
  for(let i=0;i<Math.round(base*1.6);i++){
    const home=homes[Math.floor(R()*homes.length)];
    const u=R(),female=R()<.5;
    people.push({id:i,female,u,age0:ageFrom(u),nameSeed:R(),last:surname(R()),first:'',decade:null,home,shirt:SHIRTS[Math.floor(R()*SHIRTS.length)],
      bias:{garden:R(),screen:R(),meal:R(),park:R(),library:R()},
      needs:blank(),activity:'home',place:home,until:0,path:null,pos:new THREE.Vector3(home.x,0,home.z),heading:0,walking:false,visible:false,thought:''});
  }
  for(const m of family){
    const home={x:m.home.x,z:m.home.z,node:graph.nearest(m.home.x,m.home.z)};
    people.push({id:people.length,family:m,female:m.female,birth:m.birth,first:m.first,last:m.last,home,shirt:m.shirt,
      bias:{garden:.8,screen:.3,meal:.9,park:.7,library:.6},needs:blank(),activity:'home',place:home,until:0,path:null,pos:new THREE.Vector3(home.x,0,home.z),heading:0,walking:false,visible:false,thought:''});
  }
  count=people.length;
  let spans={},mix={old:BASE_MIX.old,old80:BASE_MIX.old80},living=base;
  function names(year){
    const dec=Math.floor(year/10);
    for(const p of people)if(!p.family&&p.decade!==dec){p.decade=dec;p.first=firstName(year-p.age0,p.female,p.nameSeed);}
  }
  // Drawn with the Blender crowd (src/folk.js): each person keeps a figure for their age and gender.
  const batch=personBatch(scene,crowd,count,{name:'residents'});
  // Looks follow the person, not the draw slot (slots change every frame).
  const looks=K.personLooks(count,3);
  const GREY=[.42,.41,.4];let drawn=0;
  // Walking pace in m/s: children and the very old walk slower.
  const pace=age=>age<8?1.15:age>75?.85:1.35;
  const bob=new THREE.Mesh(K.plumbob(),new THREE.MeshStandardMaterial({color:0x37d96b,emissive:0x1a9e45,emissiveIntensity:.6,roughness:.3,transparent:true,opacity:.92}));bob.visible=false;scene.add(bob);

  const ageAt=(p,year)=>p.family?year-p.birth:p.age0;
  // Idle people spread around their spot instead of standing on one point.
  const spread=p=>{const r=1.6+(p.id%6)*.75,a=p.id*2.39996;return [Math.sin(a)*r,Math.cos(a)*r];};
  // At a shared meal people sit on the benches, between the seats the ambient crowd uses (features.js).
  const seatAt=p=>{const s=p.place,side=p.id%2?1:-1,along=((p.id>>1)%3-1)*1.9,c=Math.cos(s.rot),sn=Math.sin(s.rot);
    return {x:s.x+c*along+sn*side*.85,z:s.z-sn*along+c*side*.85,y:s.y,rot:s.rot+(side>0?Math.PI:0)};};
  const seated=p=>!p.walking&&p.activity==='meal'&&p.place?.rot!=null;
  // Walkers keep their own lane across the street instead of filing along its centre line.
  const lane=p=>((p.id*.618034)%1-.5)*2.6;
  const standAt=p=>{if(p.walking){const l=lane(p);return [p.pos.x+Math.cos(p.heading)*l,p.pos.z-Math.sin(p.heading)*l];}if(seated(p)){const t=seatAt(p);return [t.x,t.z];}const [dx,dz]=spread(p);return [p.pos.x+dx,p.pos.z+dz];};
  const exists=(p,year)=>p.family?year>=p.birth&&year<(spans[p.family.id]??9999):p.id<living;
  function routeTo(p,target){
    const nodes=graph.path(p.place?.node??graph.nearest(p.pos.x,p.pos.z),target.node);
    p.path=nodes?nodes.map(id=>graph.nodes[id]).concat([{x:target.x,z:target.z}]):[{x:target.x,z:target.z}];
    p.step=0;p.walking=true;p.target=target;
  }
  function candidates(p,type){
    if(type==='home')return [p.home];
    const list=(PLACES[type]||[]).filter(open);
    if(!list.length)return [];
    // The nearest few, so people choose their own neighbourhood.
    return list.map(s=>[Math.hypot(s.x-p.pos.x,s.z-p.pos.z),s]).sort((a,b)=>a[0]-b[0]).slice(0,6).map(e=>e[1]);
  }
  function inHours(a,h){
    if(!a.hours)return true;
    const hs=a.hours;for(let i=0;i<hs.length;i+=2){const [s,e]=[hs[i],hs[i+1]];if(s<e?h>=s&&h<e:h>=s||h<e)return true;}return false;
  }
  function choose(p,year,hour){
    const age=ageAt(p,year);let best=null,score=-Infinity;
    for(const [id,a] of Object.entries(ACTIVITIES)){
      if(a.adult&&(age<20||age>(ctx.retire??((PEOPLE.retireAge??67)-1))))continue;
      if(a.child&&(age<6||age>18))continue;
      if(id==='sleep'&&!inHours(a,hour))continue;
      if(!inHours(a,hour))continue;
      const spots=candidates(p,a.place);if(!spots.length)continue;
      const s=spots[Math.floor(hash(p.id*1.37+Math.floor(hour)*7.1)*spots.length)];
      let v=0;
      for(const [need,g] of Object.entries(a.gain))v+=g*(100-p.needs[need])/100;
      for(const [need,g] of Object.entries(a.drain||{}))v-=g*.3;
      if(id==='sleep')v+=hour>=23||hour<6?40:0;
      if(id==='work'||id==='school')v+=30*(ctx.workday??1);
      if(id==='screen')v*=.4+1.2*(ctx.digital??.8)*p.bias.screen;
      if(id==='library')v*=.3+1.4*(ctx.analog??.2)*p.bias.library;
      if(id==='garden')v*=.6+p.bias.garden;
      if(id==='meal')v*=.5+p.bias.meal+(ctx.community??.4);
      if(id==='care')v*=(ctx.cohousing??0)*(age>60||age<14?1.5:.6);
      // The walk counts: a 15-minute city keeps most choices close.
      const dist=Math.hypot(s.x-p.pos.x,s.z-p.pos.z);v-=dist*.018;
      v+=hash(p.id*3.3+hour*1.7+year)*3;
      if(v>score){score=v;best={id,a,s};}
    }
    return best;
  }
  const THOUGHTS=PEOPLE.thoughts;
  function think(p,id,year){return L(thinkSv(p,id,year));}
  function thinkSv(p,id,year){
    const list=THOUGHTS[id]||[''];let t=list[Math.floor(hash(p.id+year*.13+(p.thoughtSeed=(p.thoughtSeed||0)+1))*list.length)];
    if(id==='home'&&(ctx.lonely??0)>.3&&p.needs.social<35)t='Det var länge sedan någon frågade hur jag mår.';
    // What people think of the place's own changes, where it says (people.js situational: Kalmar's cherries on Storgatan).
    const own=PEOPLE.situational?.(p,id,year,{ctx,vision,hash});if(own)t=own;
    return t;
  }
  function start(p,choice,year){
    p.activity=choice.id;p.place=choice.s;p.until=choice.a.min*(0.7+hash(p.id+year)*0.6);
    p.thought=think(p,choice.id,year);
    const d=Math.hypot(choice.s.x-p.pos.x,choice.s.z-p.pos.z);
    if(d>6)routeTo(p,choice.s);else{p.walking=false;p.path=null;}
  }
  let selected=null,clock=0;
  const m=new THREE.Matrix4(),q=new THREE.Quaternion(),pv=new THREE.Vector3(),sv=new THREE.Vector3(1,1,1),up=new THREE.Vector3(0,1,0);
  // dtGame: game minutes elapsed; dtReal: seconds (walking is drawn in real time).
  function update(dtReal,dtGame,year,hour,walkScale=1){
    clock+=dtReal;names(year);
    setWalkRate(crowd,walkScale);batch.begin();
    let n=0;
    for(const p of people){
      if(!exists(p,year)){p.visible=false;p.here=false;continue;}
      // Someone who has just moved in (the place has grown) is already about their day, not all heading out at once.
      if(!p.here){p.here=true;if(!p.family)place(p,year,hour);}
      // Bedtime: from half past eleven to five everyone is home asleep, apart from a few night owls
      // (and the night-shift workers among them). They head home on their own before that.
      const owl=hash(p.id*5.31)<.04,lateNight=hour>=23.5||hour<5;
      if(lateNight&&!owl&&p.activity!=='sleep'){p.activity='sleep';p.place=p.home;p.pos.set(p.home.x,0,p.home.z);p.walking=false;p.path=null;p.until=60*(hour>=23.5?29-hour:5-hour);p.thought=think(p,'sleep',year);}
      const age=ageAt(p,year);
      for(const need of NEEDS)p.needs[need.id]=Math.max(0,p.needs[need.id]-need.decay*(need.id==='social'?(ctx.socialDecay??1):1)*dtGame/60);
      const a=ACTIVITIES[p.activity];
      if(p.walking&&p.path){
        let move=pace(age)*walkScale*dtReal;
        while(move>0&&p.step<p.path.length){
          const t=p.path[p.step],dx=t.x-p.pos.x,dz=t.z-p.pos.z,d=Math.hypot(dx,dz);
          if(d<=move){p.pos.x=t.x;p.pos.z=t.z;p.step++;move-=d;}
          else{p.pos.x+=dx/d*move;p.pos.z+=dz/d*move;p.heading=Math.atan2(dx,dz);move=0;}
        }
        if(p.step>=p.path.length){p.walking=false;p.path=null;}
      }else{
        for(const [need,g] of Object.entries(a.gain))p.needs[need]=Math.min(100,p.needs[need]+g*dtGame/60);
        for(const [need,g] of Object.entries(a.drain||{}))p.needs[need]=Math.max(0,p.needs[need]-g*dtGame/60);
        p.until-=dtGame;
        if(p.until<=0){const c=choose(p,year,hour);if(c)start(p,c,year);else p.until=30;}
      }
      // A storm, a heatwave or a pandemic keeps a share of them indoors (ctx.stayIn 0–1).
      p.visible=(p.walking||!a.indoor)&&!(ctx.stayIn>0&&hash(p.id*7.13)<ctx.stayIn);
      if(!p.visible)continue;
      // Idle people outdoors stand around their spot, not all on the same point.
      const fig=figureFor(age,p.female,p.id*3.7),sit=seated(p);
      let x,z,y,heading;
      if(sit){const t=seatAt(p);x=t.x;z=t.z;y=t.y;heading=t.rot;}
      else{[x,z]=standAt(p);y=land.heightAt(x,z);
        // Walkers face their way; people at a place turn towards its middle.
        if(p.walking)heading=p.heading;else{const [dx,dz]=spread(p);heading=Math.atan2(-dx,-dz);}}
      pv.set(x,y,z);q.setFromAxisAngle(up,heading);sv.setScalar(fig.scale);m.compose(pv,q,sv);
      // Cadence: the figure's own stride at this person's pace (the material carries the game speed).
      const v=crowd?.byName[fig.variant],mode=sit?2:p.walking?Math.min(1.5,Math.max(.5,v?pace(age)/v.walkSpeed:1)):0;
      // Hair greys from fifty.
      const g=Math.min(1,Math.max(0,(age-50)/30)),hx=looks.hair.getX(p.id),hy=looks.hair.getY(p.id),hz=looks.hair.getZ(p.id);
      const hair=[hx+(GREY[0]-hx)*g,hy+(GREY[1]-hy)*g,hz+(GREY[2]-hz)*g];
      batch.add(fig.variant,m,{mode,phase:p.id*1.7,top:p.shirt,hair,skin:[looks.skin.getX(p.id),looks.skin.getY(p.id),looks.skin.getZ(p.id)]});
      p.slot=n;n++;
    }
    batch.end();drawn=n;
    if(selected&&selected.visible){const [bx,bz]=standAt(selected);bob.position.set(bx,land.heightAt(bx,bz)+2.35+Math.sin(clock*2)*.08,bz);bob.visible=true;bob.rotation.y=clock*1.5;}
    else bob.visible=false;
  }
  const _c=new THREE.Color();
  // Screen-space pick: the nearest visible resident within a few pixels of the click.
  function pick(ndc,camera,width,height,radius=16){
    let best=null,bd=radius*radius;const v=new THREE.Vector3();
    for(const p of people){
      if(!p.visible)continue;
      const [sx,sz]=standAt(p);v.set(sx,land.heightAt(sx,sz)+1.1,sz).project(camera);
      if(v.z>1)continue;
      const dx=(v.x-ndc.x)*width/2,dy=(v.y-ndc.y)*height/2,d=dx*dx+dy*dy;
      if(d<bd){bd=d;best=p;}
    }
    return best;
  }
  function setContext(c){
    ctx=c;vision=c.vision||{};if(c.spans)spans=c.spans;
    living=Math.round(base*Math.max(.6,Math.min(1.6,vision.people??1)));
    // A new age mix: everyone's age from their place in it, and first names to match.
    const old=vision.old??BASE_MIX.old,old80=vision.old80??BASE_MIX.old80;
    if(Math.abs(old-mix.old)>.002||Math.abs(old80-mix.old80)>.002){
      mix={old,old80};
      for(const p of people)if(!p.family){const a=ageFrom(p.u,old,old80);if(a!==p.age0){p.age0=a;p.decade=null;}}
    }
  }
  // Spread the population over the day's activities at once (instead of everyone starting at home).
  function place(p,year,hour){const c=choose(p,year,hour);if(c){p.activity=c.id;p.place=c.s;p.pos.set(c.s.x,0,c.s.z);p.until=hash(p.id)*c.a.min;p.walking=false;p.path=null;p.thought=think(p,c.id,year);}}
  function settle(year,hour){
    names(year);
    for(const p of people){if(!exists(p,year))continue;place(p,year,hour);p.here=true;}
  }
  return {people,batch,update,pick,setContext,settle,exists,jobFor:(p,year)=>jobFor(p,ageAt(p,year),year,ctx.I||{}),family:()=>people.filter(p=>p.family),select:p=>{selected=p;},get selected(){return selected;},ACTIVITIES,ageAt,
    position:p=>{if(!p)return null;const [x,z]=standAt(p);return {x,y:land.heightAt(x,z),z};},
    stats:()=>({visible:drawn,walking:people.filter(p=>p.walking).length,mood:people.reduce((s,p)=>s+NEEDS.reduce((t,n)=>t+p.needs[n.id],0)/NEEDS.length,0)/people.length})};
}
