import { LEVERS, WORLDS, ALL_LEVER_IDS } from './data/levers.js';
import { EVENTS } from '@city/events.js';
import * as M from '@city/model.js';
import { L } from './i18n.js';

// The framework that runs a place's own model over the century, one step a year. Every place owns its
// levers (@city/levers.js LEVER_DEFS), its measures (@city/indicators.js) and its calculations
// (@city/model.js): init(B) – the state in 2026 from its starting values; step(c) – one year, returning
// the year's indicators; vision(d,I,s) – what the 3D city shows; doughnut(d); SDG_PARTS; capacity(s); and
// the uncertainty it varies (SYSTEM_SPREAD, VARY). Kalmar's model is Kalmar's own (examples/kalmar/vision/
// system.js); a place builds its own from its own conditions and research.
// The framework does what is common to every place: policies act through *implementation* (0–1), which
// approaches the chosen ambition at each lever's own pace and slows when the city asks more of itself
// than its shared capacity allows; the three worlds (climate stress, the water's rise, the 100-year
// level); the events and their chronicle; the uncertainty ensemble; and the SDG scores and doughnut from
// the place's own parts. This is a thinking tool, not a forecast.
export const START=2026,END=2126;
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
// held: in 2026, the measured year, nothing moves yet – the state stays as measured (see simulate()).
let held=false;
const lag=(x,target,tau)=>held?x:x+(target-x)*(1-Math.exp(-1/Math.max(.5,tau)));
const rnd=s=>{const x=Math.sin(s*127.1+311.7)*43758.5453;return x-Math.floor(x);};

export const BASE=M.BASE;
// The place's parameters as its model uses them (its defaults applied: M.P), else as written.
export const PARAMS=M.P||M.PARAMS||{};
const F=M.FLOOD||null;

// Uncertainty: the same plan run again under other defensible assumptions – the framework's (how fast
// policies take effect and how much of their ambition they deliver, the sea, the storm surge and climate
// stress within the chosen world) and the place model's own (SYSTEM_SPREAD lists them all, in the order
// they are drawn; SPREAD adds more), and today's value of indicators that are model constructs rather
// than statistics (BASE_UNCERTAIN). A Latin hypercube over these ranges; each member also draws its own
// event years. The charts show the 10th–90th percentile per year.
export const SPREAD={...(M.SYSTEM_SPREAD||{pace:[.75,1.33],reach:[.8,1.2],sea:[.7,1.45],surge:[-.07,.07],stress:[.75,1.25]}),...(M.SPREAD||{})};
const BASE_UNCERTAIN=M.BASE_UNCERTAIN||[];
for(const k of BASE_UNCERTAIN)SPREAD['base:'+k]=[.8,1.2];

export function ensemble(opts={},{members=24,lo=.1,hi=.9}={}){
  const dims=Object.entries(SPREAD);
  const order=dims.map((_,j)=>[...Array(members).keys()].sort((a,b)=>rnd(a*7.3+j*101.7)-rnd(b*7.3+j*101.7)));
  const runs=[];
  for(let m=0;m<members;m++){
    const vary={};dims.forEach(([k,[a,b]],j)=>{vary[k]=a+(b-a)*(order[j][m]+rnd(m*13.1+j*3.7))/members;});
    runs.push(simulate({...opts,seed:(opts.seed??7)+m*17+1,vary}).years);
  }
  const keys=Object.keys(runs[0][0].ind).filter(k=>typeof runs[0][0].ind[k]==='number'),n=runs[0].length;
  const q=(arr,p)=>{arr.sort((a,b)=>a-b);const i=p*(arr.length-1),f=Math.floor(i);return arr[f]+(arr[Math.min(arr.length-1,f+1)]-arr[f])*(i-f);};
  const band={members,lo:{},hi:{},sdg:{lo:new Float64Array(n),hi:new Float64Array(n)}};
  for(const k of keys){band.lo[k]=new Float64Array(n);band.hi[k]=new Float64Array(n);}
  const col=new Float64Array(members);
  for(let y=0;y<n;y++){
    for(const k of keys){for(let m=0;m<members;m++)col[m]=runs[m][y].ind[k];band.lo[k][y]=q(col,lo);band.hi[k][y]=q(col,hi);}
    for(let m=0;m<members;m++){const g=runs[m][y].sdg;col[m]=g.reduce((s,v)=>s+v,0)/g.length;}
    band.sdg.lo[y]=q(col,lo);band.sdg.hi[y]=q(col,hi);
  }
  return band;
}

// Flooding (FLOOD, when the place has water that can rise into its streets): today's 100-year level and
// the level where the streets begin to flood, in the place's height system (m RH 2000 in Sweden), and
// the share of the core under water at a given level with no defences (table; harbour: a second area
// that goes first). A place without FLOOD never floods.
export const FLOOD=F;
export const HIGH_WATER_100=F?F.high100:0,STREETS_FLOOD=F?F.streets:0;
const interp=(tab,x)=>{if(x<=tab[0][0])return tab[0][1]*clamp(1-(tab[0][0]-x)/.3);for(let i=1;i<tab.length;i++)if(x<=tab[i][0]){const [a,u]=tab[i-1],[b,v]=tab[i];return u+(v-u)*(x-a)/(b-a);}return tab.at(-1)[1];};
export const flooded=(level,{harbour=false}={})=>F?interp(harbour&&F.harbour?F.harbour:F.table,level):0;

export function defaultPolicy(){return Object.fromEntries(LEVERS.map(l=>[l.id,0]));}

// policyAt(year) → {lever:level 0–3}
export function simulate({policyAt=()=>defaultPolicy(),world='ssp245',events=true,seed=1,until=END,vary=null}={}){
  const W=WORLDS.find(w=>w.id===world)||WORLDS[1];
  // vary: one set of alternative assumptions (see ensemble() above); none = the central run.
  const V={pace:1,reach:1,sea:1,stress:1,surge:0,...(M.VARY||{}),...vary};
  const B={...BASE};for(const k of BASE_UNCERTAIN)if(V['base:'+k])B[k]*=V['base:'+k];
  const I=Object.fromEntries(ALL_LEVER_IDS.map(id=>[id,0]));   // hidden levers stay at today's course
  const s=M.init(B);
  const out=[],chronicle=[];
  const evs=events?EVENTS.map((e,i)=>({...e,year:e.year+Math.round((rnd(seed*31+i)-.5)*4)})):[];
  for(let year=START;year<=until;year++){
    const t=year-START,soon=clamp(t/12);                                             // shifted trends start from today's measured values
    held=t===0;
    const policy=policyAt(year);
    // --- The world --------------------------------------------------------------------
    const stress=W.stress*V.stress*W.shape(t);
    // The water's rise since 2026 at the place (the sea net of land uplift, or a lake's high water).
    const seaRise=F?W.seaRise2126*V.sea*Math.pow(clamp(t/100,0,1.2),W.seaPow):0;
    // The 100-year level rises with the sea – or, for a regulated lake whose everyday level stays,
    // by the change in its high water (FLOOD.rise by world, by 2126).
    const floodRise=F?.rise?F.rise[W.id]*V.sea*Math.pow(clamp(t/100,0,1.2),F.risePow??.8):seaRise;
    const level100=F?HIGH_WATER_100+V.surge+floodRise:0;                              // today's 100-year level (FLOOD.high100)
    // --- Capacity and implementation ---------------------------------------------------
    const capacity=M.capacity?M.capacity(s,B):10;                                   // the place's shared capacity for change
    // Building something costs more than keeping it running: a finished lever demands half its build cost.
    let demand=0;for(const l of LEVERS){const lv=policy[l.id]||0;if(!lv)continue;const done=Math.min(1,I[l.id]/(lv/3));demand+=l.cost*lv*.5*(1-.5*done);}
    const strain=demand/Math.max(1,capacity),load=t?strain:0;   // load: what the strain does to the city, from 2027
    const before={...I};
    // 2026 is the year of the decisions and stays as measured: what is decided starts in 2027. (The
    // plan's load on the city still shows in 2026, in demand.)
    if(t>0)for(const l of LEVERS){
      const target=(policy[l.id]||0)/3*V.reach,slow=strain>1?Math.pow(strain,1.6):1;
      // Change takes the lever's own time (τ years to ~63 %, ~2τ to 90 %); rolling back is faster.
      I[l.id]=target>I[l.id]?lag(I[l.id],target,l.tau*.9*slow*V.pace):lag(I[l.id],target,l.tau/3);
    }
    // --- Events -------------------------------------------------------------------------------------
    // The year's events, run by the place's model when its state is ready for them (ctx: what they test).
    const runEvents=ctx=>{for(const e of evs.filter(e=>e.year===year)){
      const r=e.resolve(ctx,rnd(seed*7+year));
      if(!r)continue;
      // weather: what the sky does that year (weather.js) – the event's own, or by its id as in Kalmar.
      const sky=r.weather??e.weather;
      chronicle.push({year,id:e.id,icon:e.icon,title:L(e.title),severity:r.severity,text:L(r.text)+(r.extra?' '+L(r.extra):''),good:r.good,effects:r.effects,level:r.level,protection:ctx.s.protection,
        weather:typeof sky==='function'?sky(r.severity,r):sky});
      if(r.apply)r.apply(ctx.s);
    }};
    // --- The place's own model: its levers acting on its measures this year -------------------
    const ind=M.step({s,I,before,B,V,W,year,t,soon,held,policy,stress,seaRise,floodRise,level100,capacity,demand,strain,load,flooded,events:runEvents});
    out.push({year,policy:{...policy},I:{...I},ind,sdg:sdgScores(ind),doughnut:doughnut(ind),vision:visionOf(ind,I,s)});
  }
  return {years:out,chronicle,world:W};
}

// 0–100 per goal: each goal blends the place's normalised indicators between a poor value and the goal:
// [indicator (or a function of the indicators), poor, goal], or a fixed score (SDG_PARTS in @city/model.js).
const norm=(v,bad,good)=>clamp((v-bad)/(good-bad))*100;
const SDG_PARTS=M.SDG_PARTS||{};
export function sdgScores(d){
  const avg=(...a)=>a.reduce((s,v)=>s+v,0)/a.length;
  const v=k=>typeof k==='function'?k(d):d[k];
  return Array.from({length:17},(_,i)=>avg(...(SDG_PARTS[i+1]||[50]).map(p=>typeof p==='number'?p:norm(v(p[0]),p[1],p[2]))));
}
// Doughnut (Raworth): the place's social shortfall 0–1 (0 = foundation met) and ecological overshoot (0 =
// inside the ceiling), by the place's own measures.
export function doughnut(d){return M.doughnut?M.doughnut(d):{social:{},ecological:{}};}
// What the 3D city shows (features.js, future.js, traffic.js, sea.js): the place's own vision over a still
// city – a place leaves out what cannot happen there (Venice's palaces get no solar panels).
const STILL={depave:0,verge:0,maturity:.35,housing:0,tower:0,canals:0,boats:0,ships:0,ferries:0,floatVillage:0,gardens:0,greenhouses:0,
  foodForest:0,market:0,community:0,shade:0,roofCover:0,greenRatio:.5,facadeGreen:0,mussels:0,floating:0,wind:0,wall:0,seaRise:0,waterClarity:.5,
  bloom:0,cars:1,parking:0,bikes:.5,pods:0,people:1,old:.2,old80:.05,ev:0,dry:0};
export function visionOf(d,I,s){return {...STILL,...M.vision?.(d,I,s)};}
// What the residents' everyday reads from the year (residents.js): the place's own mapping (residents(d,I)),
// else its measures of these names – and nothing (no algal bloom, no loneliness beyond the usual) where it has none.
export function residentsContext(d,I){
  return {cohousing:d.cohousing??0,digital:d.digitalDependence??.85,bloom:d.bloom??0,lonely:d.lowParticipation??.38,
    workday:1-(40-(d.workHours??38))/40,...M.residents?.(d,I)};
}
