import { LEVERS, LINK_ORDER as PLACE_LINK_ORDER } from './data/levers.js';
import { LANG, L } from './i18n.js';
import * as PLACE_PRESETS from '@city/presets.js';
import { simulate, ensemble, defaultPolicy, START, END } from './model.js';

// Policy schedules: a list of {from:year, set:{lever:level}} steps, each building on the previous.
export function policyFromSchedule(schedule){
  const steps=[...schedule].sort((a,b)=>a.from-b.from);
  const cache=new Map();
  return year=>{
    const key=steps.filter(s=>s.from<=year).length;
    if(cache.has(key))return cache.get(key);
    const p=defaultPolicy();for(const s of steps.slice(0,key))Object.assign(p,s.set);
    cache.set(key,p);return p;
  };
}
export function run(schedule,{world='ssp245',events=true,seed=7}={}){
  return simulate({policyAt:policyFromSchedule(schedule),world,events,seed});
}
// The uncertainty band around run(): the same plan under varied assumptions (model.js ensemble()).
export function bands(schedule,{world='ssp245',events=true,seed=7,members=24}={}){
  return ensemble({policyAt:policyFromSchedule(schedule),world,events,seed},{members});
}
// Curated paths for "Utforska": today's course, and the place's own visions (@city/presets.js): a
// research-based one and contrasting ones. What today's course carries is the place's own model, and so
// is the sentence that says it (presets.js TODAY: Kalmar's electric cars, Venice's tourist flats).
export const PRESETS=[
  {id:'dagens',name:'Dagens kurs',short:PLACE_PRESETS.TODAY?.short||'Inga nya vägval: det som redan pågår fortsätter, men inget mer.',schedule:[]},
  ...PLACE_PRESETS.VISIONS,
];
export function decadeOf(year){return Math.floor((year-START)/10);}
export const DECADES=Array.from({length:10},(_,i)=>START+i*10);
export { START, END, LEVERS };

// Plans in the URL: "2026.stadsodling2.analog2_2036.bilfritt3" – compact enough to share.
export function encodePlan(schedule,world='ssp245'){
  const steps=schedule.filter(s=>Object.keys(s.set).length).map(s=>[s.from,...Object.entries(s.set).map(([k,v])=>k+v)].join('.'));
  return `${world}~${steps.join('_')}`;
}
export function decodePlan(text){
  const [world,body='']=decodeURIComponent(text).split('~');
  const ids=new Set(LEVERS.map(l=>l.id));
  const schedule=body.split('_').filter(Boolean).map(step=>{
    const [from,...parts]=step.split('.');const set={};
    for(const p of parts){const m=p.match(/^([a-z]+)([0-3])$/);if(m&&ids.has(m[1]))set[m[1]]=+m[2];}
    return {from:Math.max(START,Math.min(END,+from||START)),set};
  });
  return {world:['ssp126','ssp245','ssp585'].includes(world)?world:'ssp245',schedule};
}

// Short links, short enough for a text message: a vision left as it is goes by its name and year
// (#sundstaden-2039, with its world when that is not the middle one: #sundstaden-ssp585-2039) and any
// other plan by a code (#1F3k…-2039). The code is base 62 of a bit string: a leading 1, the world (2
// bits), then for each step its year after 2026 (7 bits), which levers it sets (one bit per lever in
// LINK_ORDER) and their levels (2 bits each). LINK_ORDER only ever grows; the leading "1" of the code
// says how many levers it counts, so links made before a lever was added keep working.
// The place's own order (Kalmar's, for the links already shared; a new place: its levers as defined).
const LINK_ORDER=PLACE_LINK_ORDER;
// A place's own levers (Venice's visitor lever) come after the engine's, in codes that begin with "2".
const LINK_EXTRA=LEVERS.map(l=>l.id).filter(id=>!LINK_ORDER.includes(id)),LINK_FULL=[...LINK_ORDER,...LINK_EXTRA];
const LINK_LEVERS={1:LINK_ORDER.length,2:LINK_FULL.length};
const WORLD_IDS=['ssp126','ssp245','ssp585'];
const B62='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const toB62=bits=>{let n=BigInt('0b'+bits),s='';while(n>0n){s=B62[Number(n%62n)]+s;n/=62n;}return s;};
const fromB62=s=>{let n=0n;for(const c of s){const i=B62.indexOf(c);if(i<0)return null;n=n*62n+BigInt(i);}return n.toString(2);};
const steps=schedule=>[...schedule].sort((a,b)=>a.from-b.from).filter(s=>Object.keys(s.set).length);
function pack(schedule,world){
  const own=LINK_EXTRA.length&&steps(schedule).some(s=>Object.keys(s.set).some(k=>LINK_EXTRA.includes(k)));
  const version=own?'2':'1',order=own?LINK_FULL:LINK_ORDER.slice(0,LINK_LEVERS[1]);
  let bits='1'+WORLD_IDS.indexOf(world).toString(2).padStart(2,'0');
  for(const s of steps(schedule)){
    if(Object.keys(s.set).some(k=>!order.includes(k)))return null;
    bits+=(Math.max(START,Math.min(END,s.from))-START).toString(2).padStart(7,'0');
    bits+=order.map(k=>k in s.set?'1':'0').join('');
    for(const k of order)if(k in s.set)bits+=Math.max(0,Math.min(3,s.set[k])).toString(2).padStart(2,'0');
  }
  return version+toB62(bits);
}
function unpack(code){
  const order=code[0]==='2'?LINK_FULL:LINK_ORDER.slice(0,LINK_LEVERS[code[0]]||0);
  const bits=order.length&&fromB62(code.slice(1));if(!bits||bits[0]!=='1')return null;
  let i=1;const read=n=>{const v=parseInt(bits.slice(i,i+n),2);i+=n;return v;};
  const world=WORLD_IDS[read(2)];if(!world)return null;
  const schedule=[];
  while(i+7+order.length<=bits.length){
    const from=START+read(7),on=order.filter(()=>read(1)),set={};
    for(const k of on)set[k]=read(2);
    schedule.push({from:Math.min(END,from),set});
  }
  return i===bits.length?{world,schedule}:null;
}
// The link's part after "#" for a plan and the year shown.
export function planHash({schedule=[],world='ssp245',preset=null},year){
  year=Math.max(START,Math.min(END,Math.floor(year)));
  const code=pack(schedule,world);
  const vision=steps(schedule).every(s=>Object.values(s.set).every(v=>!v))?'dagens':
    preset&&PRESETS.some(p=>p.id===preset&&pack(p.schedule,world)===code)?preset:null;
  if(vision)return `${vision}${world==='ssp245'?'':'-'+world}-${year}`;
  return code?`${code}-${year}`:`plan=${encodePlan(schedule,world)}&year=${year}`;
}
// A shared link, short or as it was written before short links: {world, schedule, preset, year} or null.
export function parsePlanHash(hash){
  const h=String(hash||'').replace(/^#/,'');
  const old=h.match(/(?:^|&)plan=([^&]+)/);
  if(old){const y=h.match(/year=(\d+)/);return {...decodePlan(old[1]),preset:null,year:y?Math.max(START,Math.min(END,+y[1])):END};}
  const m=h.match(/^([a-z]+|[12][0-9A-Za-z]+)(?:-(ssp\d{3}))?-(\d{4})$/);if(!m)return null;
  const year=Math.max(START,Math.min(END,+m[3])),preset=PRESETS.find(p=>p.id===m[1]);
  if(preset)return {world:WORLD_IDS.includes(m[2])?m[2]:'ssp245',schedule:structuredClone(preset.schedule),preset:preset.id,year};
  const plan=!m[2]&&unpack(m[1]);
  return plan?{...plan,preset:null,year}:null;
}

if(LANG!=='sv')for(const p of PRESETS){p.name=L(p.name);p.short=L(p.short);}
