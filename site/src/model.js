import { LEVERS, WORLDS } from './data/levers.js';
import { EVENTS } from '@city/events.js';
import * as M from '@city/model.js';
// A place's optional tables, read by name (a place that leaves one out is no build warning).
const own=k=>M[k]||{};
import { L } from './i18n.js';

// A place 2026–2126 as a small system-dynamics model, one step per year.
// The starting values are the place's own numbers (@city/model.js BASE, each a record in its
// research/baseline.json), and so are its local parameters (PARAMS, FLOOD, WATER, WATERS) and the part of
// the model only it has (LOCAL: Kalmar's bridge, island and university, for example).
// Policies act through *implementation* (0–1), which approaches the chosen ambition at the lever's
// own pace and slows when the city asks more of itself than its shared capacity allows. Capacity grows
// with welfare, trust and participation – so investing in community is also investing in the means to
// change. Exogenous trends (electric vehicles, national decarbonisation, ageing, global AI, the sea)
// run regardless; events test resilience. All effect sizes are documented in data/evidence.js: those
// marked "antagande" are modelling assumptions, the rest lean on cited studies. This is a thinking
// tool, not a forecast.
export const START=2026,END=2126;
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
// held: in 2026, the measured year, nothing moves yet – the state stays as measured (see simulate()).
let held=false;
const lag=(x,target,tau)=>held?x:x+(target-x)*(1-Math.exp(-1/Math.max(.5,tau)));
const sig=(x)=>1/(1+Math.exp(-x));
const rnd=s=>{const x=Math.sin(s*127.1+311.7)*43758.5453;return x-Math.floor(x);};

export const BASE=M.BASE;
// The place's parameters, over defaults that suit a Swedish town of its size.
const P={growth:.0058,growthDecay:30,attract:.006,attractMid:.67,popKnowledge:.0012,popLinks:.0006,
  ageing65:.07,ageing65Years:28,ageing80:.05,ageing80Years:35,
  solarTrend:3*BASE.pop/73068,solarPotential:430*BASE.pop/73068,solarYield:.9,windPotential:0,windYield:2.4,windYieldNew:3.4,
  heritageCost:0,rail:null,tourism:null,boatKnowledge:0,...M.PARAMS};
export const PARAMS=P;
const F=M.FLOOD||null,WA={dry:1.2,growth:0,growthYears:24,planned:[],plannedClimate:0,second:.8,climateLoss:.33,dryYears:.15,...M.WATER};
const WS={planned:[0,1],recovery:[.05,60],tau:22,...M.WATERS};
const LOCAL=M.LOCAL||{};

// Uncertainty (antagande): the same plan run again under other defensible assumptions – how fast
// policies take effect and how much of their ambition they deliver, when electric vehicles, national
// decarbonisation and AI arrive, how strong society's drift is, the sea, the storm surge and climate
// stress within the chosen world, the population trend, and today's value of indicators that are
// model constructs rather than statistics. A Latin hypercube over these ranges; each member also
// draws its own event years. The charts show the 10th–90th percentile per year.
export const SPREAD={pace:[.75,1.33],reach:[.8,1.2],life:[.6,1.4],tech:[.5,1.5],ev:[-5,5],national:[.7,1.4],ai:[-8,8],drift:[.5,1.5],
  sea:[.7,1.45],surge:[-.07,.07],stress:[.75,1.25],growth:[.6,1.4],waterSupply:[.93,1.07],...own('SPREAD')};
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
  // vary: one set of alternative assumptions (see ensemble() below); none = the central run.
  const V={pace:1,reach:1,ev:0,national:1,ai:0,drift:1,sea:1,stress:1,growth:1,surge:0,life:1,tech:1,waterSupply:1,univ:1,...vary};
  const B={...BASE};for(const k of BASE_UNCERTAIN)if(V['base:'+k])B[k]*=V['base:'+k];
  const I=Object.fromEntries(LEVERS.map(l=>[l.id,0]));
  const s={
    year:START,pop:B.pop,share65:B.share65,share80:B.share80,
    urbanFarm:.03,regen:B.regen,diet:B.diet,foodRegional:B.foodRegional,foodStockDays:B.foodStockDays,
    solarMW:B.solarMW,windMW:B.windMW,efficiency:1,carShare:B.carShare,transitShare:B.transitShare,
    greenShare:B.greenShare,canopy:B.canopy,protection:STREETS_FLOOD,water:B.waterNow,biodiversity:B.biodiversity,waters:B.waters,
    lifeExp:B.lifeExp,lifeShock:0,activity:B.activity,lowParticipation:B.lowParticipation,distress:B.distress,youthScreen:B.youthScreen,selfHealth:B.selfHealth,
    trust:B.trust,participation:B.participation,gini:B.gini,cohousing:B.cohousing,workHours:B.workHours,unsafe:B.unsafe,education:B.education,
    digitalDependence:.85,analogResilience:.2,aiCapacity:.12,aiGovernance:.25,welfare:1,circularity:.1,homePrepared:B.homePrepared,
    damage:0,eventMood:0,visitShock:0,heritage:1,depaved:0,verges:0,roofs:.03,facade:0,forest:0,lots:0,housing:0,canalsBuilt:0,floatv:0,maturity:.35,
  };
  LOCAL.init?.(s,B);
  const out=[],chronicle=[];
  const evs=events?EVENTS.map((e,i)=>({...e,year:e.year+Math.round((rnd(seed*31+i)-.5)*4)})):[];
  for(let year=START;year<=until;year++){
    const t=year-START,soon=clamp(t/12);                                             // shifted trends start from today's measured values
    held=t===0;
    const policy=policyAt(year);
    // --- Exogenous trends -------------------------------------------------------------
    // EU 2035 fleet shift (E: ev_transition), from the measured share in 2026 towards 99 %.
    const evCurve=y=>sig((y-2037)/3.6),ev=clamp(B.evShare+(.99-B.evShare)*(sig((year-2037-V.ev*soon)/3.6)-evCurve(START))/(1-evCurve(START)));
    const national=clamp((year-2026)/(24*V.national));                                             // Sweden net zero 2045 (E: se_net_zero)
    const aiGlobal=clamp(.15+.8*sig((year-2045-V.ai*soon)/7));
    const stress=W.stress*V.stress*W.shape(t);
    // Society drifts without any new decision (antagande, based on the trends in research/):
    // e-bikes and remote work slowly take car trips; social participation keeps eroding as it has
    // since 2006 with more single households and a digital everyday; the food system keeps
    // consolidating and importing.
    const driftCar=-.09*V.drift*clamp(t/45),driftTransit=.02*V.drift*clamp(t/45);
    const driftLonely=.1*V.drift*(1-Math.exp(-t/35)),driftTrust=-.05*V.drift*(1-Math.exp(-t/40)),driftFood=-.04*V.drift*clamp(t/50);                                          // drought/heat frequency (E: smhi_climate)
    // The water's rise since 2026 at the place (the sea net of land uplift, or a lake's high water; E: smhi_sea).
    const seaRise=F?W.seaRise2126*V.sea*Math.pow(clamp(t/100,0,1.2),W.seaPow):0;
    // The 100-year level rises with the sea – or, for a regulated lake whose everyday level stays,
    // by the change in its high water (FLOOD.rise by world, by 2126).
    const floodRise=F?.rise?F.rise[W.id]*V.sea*Math.pow(clamp(t/100,0,1.2),F.risePow??.8):seaRise;
    const level100=F?HIGH_WATER_100+V.surge+floodRise:0;                              // today's 100-year level (FLOOD.high100)
    // --- Capacity and implementation ---------------------------------------------------
    const capacity=10*s.welfare*(.75+.5*s.trust)*(.85+.3*s.participation)*(1+.25*s.cohousing);
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
    // Change has a price: fast car-free conversion meets resistance unless people have a real say,
    // and wind parks meet local opposition unless they are co-owned (E: change_resistance, antagande).
    const resistance=4*Math.max(0,I.bilfritt-before.bilfritt)*(1-.7*I.demokrati)+1.5*Math.max(0,I.vind-before.vind)*(1-.6*I.demokrati)+1.5*Math.max(0,I.anpassning-before.anpassning)*(1-.5*I.demokrati);
    // --- Food ---------------------------------------------------------------------------
    s.urbanFarm=.03+.97*I.stadsodling*(.55+.45*I.bilfritt);
    s.regen=lag(s.regen,clamp(B.regen+.78*I.regionalt+.1*I.kost),6);   // (a place that starts high reaches all its farmland)
    s.diet=lag(s.diet,B.diet+.35*I.kost+.05*I.regionalt,5);
    s.foodRegional=lag(s.foodRegional,clamp(B.foodRegional+driftFood*(1-I.regionalt)+.42*I.regionalt+.08*I.kost+.06*s.urbanFarm+.06*I.hav+.05*I.beredskap,0,.9),5);
    s.foodStockDays=lag(s.foodStockDays,B.foodStockDays+55*I.beredskap+25*I.regionalt*I.beredskap,4);
    const cityVeg=.01+.25*s.urbanFarm;                                                // share of fruit & veg grown in the city (E: urban_ag_share)
    // --- Energy ---------------------------------------------------------------------------
    // Solar follows the national trend (solarTrend MW a year) and the city's own roofs (solarPotential:
    // the MW that cover most suitable roofs); wind the place's own potential (E: solar_yield, solar_potential).
    s.solarMW=lag(s.solarMW,B.solarMW+P.solarTrend*V.tech*t+P.solarPotential*I.sol,4);
    s.windMW=lag(s.windMW,B.windMW+P.windPotential*I.vind,5);                                     // (antagande: offshore_wind_scale)
    s.efficiency=lag(s.efficiency,1-.3*I.effektivitet-.05*I.arbetstid,6);
    const elUse=s.pop*B.elUsePerCap*s.efficiency*(1+.22*ev*s.carShare/B.carShare+.15*s.aiCapacity*I.ai)/1000;   // AI's own appetite for power (E: ai_energy)      // GWh
    // Today's turbines give windYield GWh per MW, new ones windYieldNew.
    const elProd=(s.solarMW*P.solarYield+Math.min(s.windMW,B.windMW)*P.windYield+Math.max(0,s.windMW-B.windMW)*P.windYieldNew+B.elLocalOther/1000);  // GWh (E: solar_yield, offshore_cf)
    const localEnergy=elProd/elUse;
    const fossil=(1-B.renewable-.02)*(s.carShare/B.carShare)*(1-.95*ev)/(1-.95*B.evShare)*(1-.4*national)+.02*(1-national);
    const renewable=clamp(1-fossil);
    // --- Mobility & city form --------------------------------------------------------------
    s.carShare=lag(s.carShare,clamp(B.carShare+driftCar-.28*I.bilfritt-.2*I.kollektivt-.04*I.arbetstid-.03*s.cohousing,.07),3);
    s.transitShare=lag(s.transitShare,clamp(B.transitShare+driftTransit+.24*I.kollektivt+.05*I.bilfritt,0,.5),3);
    const activeShare=clamp(1-s.carShare-s.transitShare,.1);
    const carsPer1000=B.carsPer1000*Math.pow(s.carShare/B.carShare,1.15)*(1-.25*I.kollektivt*I.bilfritt);
    // What gets built accumulates at a limited yearly rate (a few % of streets, roofs and car parks
    // a year – antagande), so a city that keeps its course keeps changing for decades.
    const build=(key,target,up,down=up*2)=>{const x=s[key]??0;if(held)return x;s[key]=x+Math.max(-down,Math.min(up,target-x));return s[key];};
    const depave=build('depaved',clamp(.95*I.bilfritt*(.7+.3*I.stadsodling)),.025);
    s.greenShare=lag(s.greenShare,clamp(B.greenShare+.32*depave+.12*s.urbanFarm+.08*I.anpassning,0,.7),3);
    s.canopy=lag(s.canopy,clamp(B.canopy+.18*depave+.06*I.anpassning+.04*I.stadsodling,0,.6),8);   // trees take years
    // --- Climate ------------------------------------------------------------------------------
    const ghgTransport=B.ghg.transport*(s.carShare/B.carShare)*(1-.93*ev)/(1-.93*B.evShare)*(1-.3*national);
    const ghgAgri=B.ghg.agriculture*(1-.25*(s.regen-B.regen)/.9)*(1-.3*(s.diet-B.diet)/.4)*(1-.15*national);
    const ghgEnergy=B.ghg.energy*(1-.6*I.sol)*(1-.5*national);
    const ghgOther=(B.ghg.industry+B.ghg.other)*(1-.55*national)*(1-.3*I.effektivitet);
    const ghg=Math.max(0,ghgTransport+ghgAgri+ghgEnergy+ghgOther);
    const ghgCons=Math.max(.5,B.ghgCons*(1-.35*national)-1.1*(s.diet-B.diet)/.4-.9*I.effektivitet-.8*(B.carShare-s.carShare)/.5-.35*I.arbetstid-.2*I.bogemenskap-.3*I.forbindelser);   // (E: lifestyles_15; trains: forbindelser)
    // Adaptation raises the protection up to protectGain metres above the streets (FLOOD).
    if(F)s.protection=lag(s.protection,STREETS_FLOOD+F.protectGain*I.anpassning,4);
    const floating=I.anpassning>.8?(I.anpassning-.8)*5:0;
    const floodMargin=F?s.protection-level100:1;
    const floodShare=F&&level100>s.protection?flooded(level100):0;                       // the core under water in a 100-year flood
    const floodRisk=F?clamp(sig(-floodMargin/.18)*(1-.4*floating)):0;
    // Walls and barriers on old quays cost some of what they protect; floods cost more (E: heritage).
    const heritage=clamp(s.heritage-P.heritageCost*I.anpassning*(1-floating*.5));
    // --- Water & nature --------------------------------------------------------------------------
    // Drinking water (E: dricksvatten; the place's own numbers in WATER): the margin of available raw
    // water over need in a dry year (dry: 1.2 = 20 % to spare). Demand follows the population and the
    // municipal water plan (growth by growthYears); supply loses up to climateLoss to a hotter climate in
    // a dry year; the planned works are today's course; a second source that does not depend on rain –
    // recycled wastewater, or desalination on the city's solar power – comes from preparedness; wetlands
    // and infiltration store water; efficiency cuts use per person (−15 %). The index weighs the dry-year
    // margin, an independent second source and summers without restrictions (dry summers come in
    // dryYears of years today, up to 2.5 times as often by 2126 in SSP5-8.5).
    const waterDemand=(s.pop/B.pop)*(1+WA.growth*clamp(t/WA.growthYears))*(1-.15*I.effektivitet);
    let planned=0;for(const [gain,from,years] of WA.planned)planned+=gain*clamp((year-from)/years);
    planned*=1-WA.plannedClimate*stress;
    const secondSource=WA.second*Math.pow(I.beredskap,1.6);
    const waterDry=WA.dry*(1+(V.waterSupply-1)*soon)*(1-WA.climateLoss*stress)+planned+secondSource+.06*I.anpassning+.03*I.hav;
    const waterMargin=waterDry/waterDemand-1,dryYears=WA.dryYears*(1+1.5*stress);
    // Summers with watering bans: the dry ones, once the dry-year margin is gone.
    const restrictions=dryYears*clamp((.05-waterMargin)/.2),restrictionFree=1-restrictions;
    s.water=lag(s.water,clamp(.5*clamp((waterMargin+.1)/.5)+.25*clamp(secondSource/.3)+.25*restrictionFree),2);
    s.biodiversity=lag(s.biodiversity,clamp(-.03*I.vind+B.biodiversity+.28*(s.greenShare-B.greenShare)/.4+.2*(s.regen-B.regen)+.1*I.hav+.05*I.stadsodling-.12*stress),8);
    // The place's own sea or lake (WATERS; E: helcom_bsap, mussels): restoration, farming and diet, the
    // planned works and a slow recovery, against a warmer climate; blooms follow its health.
    s.waters=lag(s.waters,clamp(B.waters+.38*I.hav*(1+.15*I.kunskap)+.2*(s.regen-B.regen)/.9+.08*(s.diet-B.diet)/.4+WS.planned[0]*clamp(t/WS.planned[1])+WS.recovery[0]*clamp(t/WS.recovery[1])-.12*stress),WS.tau);
    const bloom=clamp(B.bloom+.65*(B.waters-s.waters)+.2*stress);
    // --- Health --------------------------------------------------------------------------------
    s.activity=lag(s.activity,clamp(B.activity+.12*I.bilfritt+.07*I.kollektivt+.08*I.forebyggande+.04*s.urbanFarm),4);   // (E: active_travel)
    const digitalIsolation=.05*I.ai*(1-I.analog)+.03*(s.digitalDependence-.85);
    s.lowParticipation=lag(s.lowParticipation,clamp(B.lowParticipation+driftLonely*(1-.6*Math.max(I.bogemenskap,I.demokrati,I.arbetstid))-.12*I.bogemenskap-.07*I.demokrati-.08*I.arbetstid-.05*s.urbanFarm-.04*I.analog-.03*depave+digitalIsolation,.06),5);   // (E: social_infra)
    const loneliness=B.loneliness*s.lowParticipation/B.lowParticipation;
    s.youthScreen=lag(s.youthScreen,clamp(B.youthScreen-.5*I.analog+.06*I.ai*(1-I.analog)),4);   // (E: screen_guidelines)
    s.distress=lag(s.distress,clamp(B.distress-.025*I.analog-.02*(s.greenShare-B.greenShare)/.3-.04*(B.lowParticipation-s.lowParticipation)/.3+.03*(s.gini-B.gini)/.05+.015*stress-.01*I.forebyggande,.03),4);
    const nature=clamp(.5*s.greenShare/.4+.5*s.canopy/.4);
    const lifeTarget=B.lifeExp+6*V.life*(1-Math.exp(-t/45))+1.1*I.forebyggande+1.4*I.ai*(.5+.5*s.aiGovernance)+4*(s.activity-B.activity)+5*(B.lowParticipation-s.lowParticipation)*.5-1.2*stress*(1-nature);   // (E: holt_lunstad, nature_health)
    s.lifeExp=lag(s.lifeExp,lifeTarget,6)-s.lifeShock;s.lifeShock*=.4;
    s.selfHealth=lag(s.selfHealth,clamp(B.selfHealth+.5*(s.activity-B.activity)+.25*(B.lowParticipation-s.lowParticipation)-.3*(s.distress-B.distress)+.04*nature),4);
    // --- Society ----------------------------------------------------------------------------------
    s.aiCapacity=lag(s.aiCapacity,aiGlobal*(.3+.7*I.ai),3);
    s.aiGovernance=lag(s.aiGovernance,clamp(.2+.05*clamp((year-2026)/2)+.4*I.demokrati+.25*I.analog+.15*I.ai),5);   // EU AI Act, high-risk rules 2027
    s.participation=lag(s.participation,clamp(B.participation+.35*I.demokrati+.15*I.arbetstid+.08*I.bogemenskap),5);
    s.gini=lag(s.gini,clamp(B.gini+.008*I.regionalt-.03*I.bogemenskap-.015*I.arbetstid-.02*I.demokrati+.05*s.aiCapacity*(1-s.aiGovernance)+.01*stress,.18,.45),8);
    s.trust=lag(s.trust,clamp(B.trust+driftTrust*(1-I.demokrati)+.12*I.demokrati+.06*I.bogemenskap+.04*s.urbanFarm+.03*I.analog-1.2*(s.gini-B.gini)-.12*Math.max(0,load-1)-resistance+s.eventMood,.3,.86),6);   // (E: citizens_assemblies)
    s.eventMood*=.6;
    s.cohousing=lag(s.cohousing,B.cohousing+.42*I.bogemenskap,6);
    s.workHours=lag(s.workHours,B.workHours-8*I.arbetstid,4);
    s.unsafe=lag(s.unsafe,clamp(B.unsafe-.1*depave-.06*(s.trust-B.trust)/.2-.05*I.bogemenskap,.06),5);
    s.education=lag(s.education,clamp(B.education+.07*I.analog+.06*I.ai*(.5+.5*I.analog)+.04*s.cohousing-.04*(s.youthScreen-.5)),6);   // (E: reading_screens)
    s.digitalDependence=lag(s.digitalDependence,clamp(.85+.12*s.aiCapacity-.38*I.analog),5);
    s.analogResilience=lag(s.analogResilience,clamp(.2+.62*I.analog+.12*I.beredskap),5);
    s.homePrepared=lag(s.homePrepared,clamp(B.homePrepared+.4*I.beredskap+.08*s.analogResilience+.05*(s.trust-B.trust)),5);
    s.circularity=lag(s.circularity,clamp(.1+.6*I.effektivitet+.1*I.bogemenskap),6);
    const dependency=(s.share65-B.share65);
    s.welfare=lag(s.welfare,clamp(1+.14*s.aiCapacity*(.5+.5*s.aiGovernance)+.05*I.effektivitet+.08*I.vind+.05*I.regionalt+.04*I.sol-.07*I.arbetstid*(1-s.aiCapacity)-.9*dependency+.07*s.cohousing+.05*(s.trust-B.trust)-.03*I.analog-.04*I.bilfritt*(1-I.kollektivt)-.05*Math.max(0,load-1)-s.damage,.5,1.6),10);
    s.damage*=.75;
    const unemployment=clamp(B.unemployment+.004*I.hav+.03*Math.max(0,s.aiCapacity-.12)*(1-I.arbetstid)-.012*I.regionalt-.01*I.stadsodling-.008*I.effektivitet,.02,.15);
    const preparedness=clamp(.3*s.homePrepared+.2*clamp(s.foodStockDays/90)+.2*s.water+.15*clamp(localEnergy)+.15*s.analogResilience);
    // --- Population -----------------------------------------------------------------------------
    // Ageing follows SCB's projection for the place (PARAMS.ageing…); longer lives than the trend add a
    // little more (excess only).
    const lifeExcess=s.lifeExp-(B.lifeExp+6*V.life*(1-Math.exp(-t/45)));
    // (Bounds that leave room above an already old place's own starting point and trend.)
    s.share65=clamp(B.share65+P.ageing65*(1-Math.exp(-t/P.ageing65Years))+.0024*lifeExcess,.15,Math.max(.35,B.share65+P.ageing65+.05));
    s.share80=clamp(B.share80+P.ageing80*(1-Math.exp(-t/P.ageing80Years))+.004*lifeExcess,.04,Math.max(.2,B.share80+P.ageing80+.04));
    const wellbeing=clamp(.25*s.selfHealth+.2*(1-s.lowParticipation)+.15*nature+.15*(1-s.distress*3)+.1*s.trust+.1*clamp((40-s.workHours)/10)+.05*(1-s.unsafe));
    const attract=clamp(.4*wellbeing+.3*s.welfare/1.3+.3*(1-floodRisk));
    const climateMigrants=year>2045?.003*W.stress*clamp((year-2045)/30):0;
    LOCAL.beforePop?.({s,I,B,year,t,soon,V,lag,policy});
    // The trend follows SCB's projection on today's course (PARAMS.growth, fading over growthDecay
    // years); a place people want to live in, knowledge and links add to it (E: demography_e10, demography_e18).
    if(!held){
      let g=1+P.growth*V.growth*Math.exp(-t/P.growthDecay)+P.attract*(attract-P.attractMid)+climateMigrants;
      if(LOCAL.pop)g+=LOCAL.pop({s,I,B,year,t});
      g+=P.popKnowledge*I.kunskap;g+=P.popLinks*I.forbindelser;
      s.pop*=g;
    }
    // --- Events -------------------------------------------------------------------------------------
    const ctx={s,I,year,seaRise,level100,flooded,floodMargin,floodRisk,stress,localEnergy,preparedness,nature,loneliness,bloom,W};
    for(const e of evs.filter(e=>e.year===year)){
      const r=e.resolve(ctx,rnd(seed*7+year));
      if(!r)continue;
      // weather: what the sky does that year (weather.js) – the event's own, or by its id as in Kalmar.
      const sky=r.weather??e.weather;
      chronicle.push({year,id:e.id,icon:e.icon,title:L(e.title),severity:r.severity,text:L(r.text)+(r.extra?' '+L(r.extra):''),good:r.good,effects:r.effects,level:r.level,protection:s.protection,
        weather:typeof sky==='function'?sky(r.severity,r):sky});
      if(r.apply)r.apply(s);
    }
    // --- Visitors (E: turism; PARAMS.tourism) -------------------------------------------------------------
    // Demand grows with incomes (elasticity 0.32), capped by the beds (antagande); warmer summers and
    // shoulder seasons draw more visitors (JRC: +3 %/°C in summer, +3.5 % in spring and autumn); algal
    // blooms keep them away; a drought or heatwave summer costs about 5 % (2018) and a pandemic about 21 %
    // (2020); a risen sea takes harbours and shores; damaged heritage costs some. A green, car-free centre
    // adds a little (antagande). Most come by car; better trains and buses take a share of them, which
    // cuts the CO₂e a guest night (54 % of it the journey) without fewer visitors.
    const T=P.tourism;
    const gwl=1.4+(W.gwl2100-1.4)*W.shape(t),comfort=1+.0288*(gwl-1.4),demandT=Math.min(1.35,Math.pow(1.0048,t));
    const algae=p=>1-p*Math.max(0,bloom-B.bloom)/.29+.03*Math.max(0,B.bloom-bloom)/.45,shock=1-s.visitShock;s.visitShock=0;
    let guestNights=0,touristCar=0,tourismCO2=0;
    if(T){
      guestNights=B.guestNights*demandT*comfort*algae(T.algae)*(1-T.sea[0]*clamp((seaRise-T.sea[1])/T.sea[2]))*(1-T.heritage*(1-heritage))*(1+T.depave*depave)*shock;
      touristCar=clamp(T.car-.3*(I.forbindelser??0)-.08*I.kollektivt,.45);
      tourismCO2=guestNights*T.co2*(.54*(touristCar/T.car)*(1-.6*ev)*(1-.3*national)+.46*(1-.4*national));
    }
    // --- Links (E: forbindelser; PARAMS.rail) ---------------------------------------------------------
    // The fastest train to the capital: today's time, what is already planned, and up to `gain` hours
    // more where the region pushes for it (forbindelser).
    let railMain=0;
    if(P.rail){railMain=P.rail.today;for(const [h,from,years] of P.rail.planned)railMain-=h*clamp((year-from)/years);railMain-=P.rail.gain*I.forbindelser;}
    const local=LOCAL.step?.({s,I,B,P,year,t,policy,stress,seaRise,level100,demandT,comfort,algae,shock,guestNights,touristCar,ev,national,heritage,bloom})||{};
    // --- Indicators ---------------------------------------------------------------------------------
    // Electric boats: batteries and hydrofoils take short routes first (antagande; national trend plus
    // the city's own boat buses).
    const boatElectric=clamp(.03+.92*sig((year-(2048-14*I.kollektivt-P.boatKnowledge*I.kunskap))/6)*(.55+.45*Math.max(I.kollektivt,I.effektivitet)));
    const ind={boatElectric,
      pop:s.pop,share65:s.share65,share80:s.share80,ghg,ghgTransport,ghgAgri,ghgCons,renewable,localEnergy,solarMW:s.solarMW,windMW:s.windMW,
      carShare:s.carShare,transitShare:s.transitShare,activeShare,carsPer1000,evShare:ev,
      urbanFarm:s.urbanFarm,cityVeg,regen:s.regen,diet:s.diet,foodRegional:s.foodRegional,foodStockDays:s.foodStockDays,
      greenShare:s.greenShare,canopy:s.canopy,depave,water:s.water,biodiversity:s.biodiversity,waters:s.waters,bloom,
      seaRise,level100,protection:s.protection,floodMargin,floodRisk,floodShare,heritage,
      lifeExp:s.lifeExp,selfHealth:s.selfHealth,activity:s.activity,lowParticipation:s.lowParticipation,loneliness,distress:s.distress,youthScreen:s.youthScreen,
      trust:s.trust,participation:s.participation,gini:s.gini,childPoverty:clamp(B.childPoverty*(s.gini/B.gini)*(1.1-.1*s.welfare)),unsafe:s.unsafe,workHours:s.workHours,cohousing:s.cohousing,
      education:s.education,unemployment,welfare:s.welfare,circularity:s.circularity,waste:B.waste*(1-.5*I.effektivitet),recycling:clamp(B.recycling+.45*I.effektivitet),
      digitalDependence:s.digitalDependence,analogResilience:s.analogResilience,aiCapacity:s.aiCapacity,aiGovernance:s.aiGovernance,homePrepared:s.homePrepared,preparedness,
      wellbeing,attract,capacity,demand,strain,stress,nature,
      waterMargin,waterDemand,restrictions,gwl,
      ...(T?{guestNights,touristCar,tourismCO2}:{}),...(P.rail?{railMain}:{}),...local,
    };
    // The rest of the built city.
    build('verges',clamp(.75*I.stadsodling+.3*I.anpassning+.2*I.forebyggande),.035);
    // Solar on the roofs follows the panels actually installed, so the national trend shows on today's
    // course too (solarPotential MW more ≈ ¾ of the roofs – antagande); rooftop gardens and greenhouses
    // come from urban farming and adaptation.
    s.solarRoof=clamp((s.solarMW-B.solarMW)/P.solarPotential);
    build('roofs',clamp(.03+.75*s.solarRoof+.25*I.anpassning+.4*I.stadsodling),.022);
    build('facade',clamp(.6*I.anpassning+.3*I.stadsodling),.016);
    build('forest',clamp(.9*I.stadsodling*.7+.3*I.anpassning),.025);
    build('lots',Math.max(clamp(.95*Math.max(I.bilfritt*.8,I.stadsodling)*(.6+.4*I.bilfritt)),clamp(.2*I.bilfritt+.55*I.bogemenskap*(.4+.6*I.bilfritt)+.2*I.effektivitet+.1*I.anpassning)+.05),.03);
    // New homes follow the population: the timber districts keep growing as long as the place does
    // (fully built when it has grown by about half again – 40 000 people in Kalmar).
    build('housing',clamp(.2*I.bilfritt+.55*I.bogemenskap*(.4+.6*I.bilfritt)+.2*I.effektivitet+.1*I.anpassning)*clamp(.3+.7*(s.pop-B.pop)/(40000*B.pop/73068)),.02);
    build('canalsBuilt',clamp(I.anpassning*1.25),.03);build('floatv',clamp((I.anpassning-.45)*2.2)*clamp(.4+seaRise*1.5),.025);
    // Trees, food forests and climbers mature over decades once planting has begun.
    if(s.depaved+s.verges+s.forest>.05)s.maturity+=(1-s.maturity)/30;
    out.push({year,policy:{...policy},I:{...I},ind,sdg:sdgScores(ind),doughnut:doughnut(ind),vision:visionOf(ind,I,s)});
  }
  return {years:out,chronicle,world:W};
}

// 0–100 per goal: each goal blends normalised indicators between a poor value and the goal: [indicator,
// poor, goal] or a fixed score. A place adds its own measures (SDG_PARTS in @city/model.js): Kalmar its
// university's students, for example.
const norm=(v,bad,good)=>clamp((v-bad)/(good-bad))*100;
const SDG_PARTS={
  1:[['childPoverty',.2,.02],['gini',.35,.22]],                                                    // Ingen fattigdom
  2:[['foodRegional',.1,.7],['regen',0,.6],['foodStockDays',0,90]],                                // Ingen hunger
  3:[['lifeExp',80,92],['selfHealth',.6,.9],['distress',.18,.04],['lowParticipation',.5,.1]],      // Hälsa
  4:[['education',.6,.95],['youthScreen',1,.3]],                                                    // Utbildning
  5:[['workHours',40,30],['cohousing',0,.3],55],                                                    // Jämställdhet
  6:[['water',.2,.9],['waters',0,.8]],                                                              // Vatten
  7:[['renewable',.3,1],['localEnergyCapped',.2,1.0]],                                              // Energi
  8:[['unemployment',.1,.02],['welfare',.8,1.3],['workHours',42,32]],                               // Arbete
  9:[['aiCapacity',0,.9],['aiGovernance',.1,.9],['preparedness',.2,.9],...(P.rail?[['railMain',...P.rail.sdg]]:[])],   // Innovation och infrastruktur
  10:[['gini',.35,.2],['lowParticipation',.5,.1]],                                                  // Jämlikhet
  11:[['greenShare',.1,.5],['carShare',.65,.1],['floodRisk',1,0],['unsafe',.4,.08],['heritage',.5,1]],// Städer
  12:[['ghgCons',8,1],['circularity',0,.8],['recycling',.3,.9],...(P.tourism?[['tourismCO2',...P.tourism.sdg]]:[])],   // Konsumtion
  13:[['ghg',3.5,.2],['floodRisk',1,0],['preparedness',.2,.9]],                                     // Klimat
  14:[['waters',0,.8],['bloom',1,0]],                                                               // Hav (or the place's lake)
  15:[['biodiversity',.3,.85],['canopy',.15,.45],['regen',0,.6]],                                   // Ekosystem
  16:[['trust',.5,.85],['participation',.2,.8],['unsafe',.4,.08]],                                  // Fred & institutioner
  17:[['participation',.2,.8],['aiGovernance',.1,.9],['trust',.5,.85]],                             // Partnerskap
  ...own('SDG_PARTS'),
};
export function sdgScores(d){
  const avg=(...a)=>a.reduce((s,v)=>s+v,0)/a.length;
  const v=k=>k==='localEnergyCapped'?Math.min(d.localEnergy,1.2):d[k];
  return Array.from({length:17},(_,i)=>avg(...SDG_PARTS[i+1].map(p=>typeof p==='number'?p:norm(v(p[0]),p[1],p[2]))));
}
// Doughnut (Raworth): social shortfall 0–1 (0 = foundation met), ecological overshoot (0 = inside the ceiling).
export function doughnut(d){
  return {
    social:{
      food:clamp(1-d.foodRegional/.6)*.6,health:clamp((88-d.lifeExp)/10)*.5+clamp(d.distress-.05)*2,education:clamp(.95-d.education),income:clamp(d.unemployment*4+d.childPoverty*2),
      peace:clamp(d.unsafe*1.5),voice:clamp(.8-d.participation),equity:clamp((d.gini-.2)*4),gender:clamp((d.workHours-30)/20),housing:.15*(1-d.cohousing),
      networks:clamp(d.lowParticipation*1.6),energy:clamp(1-d.localEnergy)*.3,water:clamp(.8-d.water),
    },
    ecological:{
      climate:clamp(d.ghgCons/2.5-.4,0,2),acidification:clamp(d.ghgCons/6,0,1.5),chemical:clamp(.6-d.circularity*.6),nutrients:clamp(1-d.waters*1.4,0,1.5),
      freshwater:clamp((1-d.water)*.9),land:clamp(.8-d.regen-d.diet*.4),biodiversity:clamp(1-d.biodiversity*1.3,0,1.5),air:clamp(d.carShare*.8),ozone:.05,
    },
  };
}
// What the 3D city shows for this state (features.js, future.js, traffic.js).
export function visionOf(d,I,s){
  return {
    depave:d.depave,verge:s.verges,maturity:s.maturity,
    // New timber neighbourhoods where the car parks were; the vertical farm by the station.
    housing:s.housing,
    tower:clamp((I.stadsodling-.5)*2.4)*clamp((I.regionalt+I.ai)*1.2),
    canals:s.canalsBuilt,boats:clamp(.15+.85*I.kollektivt),ships:clamp(I.effektivitet*.7+I.regionalt*.5+I.vind*.3),ferries:clamp(I.kollektivt*1.3),floatVillage:s.floatv,gardens:clamp(.3+.7*I.stadsodling),greenhouses:clamp(.2+.8*I.stadsodling),
    foodForest:s.forest,market:clamp(.15+.55*I.regionalt+.3*I.bogemenskap),community:clamp(.08+.5*I.bogemenskap+.25*I.demokrati+.2*I.arbetstid),
    roofCover:s.roofs,greenRatio:clamp(.25+.5*(I.anpassning+I.stadsodling)/(I.anpassning+I.stadsodling+s.solarRoof+.01)),
    facadeGreen:s.facade*(.5+.5*s.maturity),mussels:clamp(I.hav*1.1),floating:clamp(I.anpassning>.6?(I.anpassning-.6)*2.5:0),
    wind:P.windPotential?clamp(Math.max(0,s.windMW-BASE.windMW)/P.windPotential):0,wall:Math.max(0,s.protection-STREETS_FLOOD),seaRise:d.seaRise,
    waterClarity:clamp(.2+d.waters),bloom:d.bloom,
    cars:clamp(d.carShare/BASE.carShare*(1-d.depave*.6)),
    parking:s.lots,bikes:clamp(.25+.75*d.activeShare/.5),pods:clamp(I.kollektivt*d.aiCapacity*1.4),
    // Today's course shows too: more and older people in the streets, cars going electric (quieter in
    // the sound), and lawns that yellow in a warmer climate – most of all once dry summers bring
    // watering bans.
    people:d.pop/BASE.pop,old:d.share65,old80:d.share80,ev:d.evShare,dry:clamp(.3*d.stress+1.4*d.restrictions),
    ...LOCAL.vision?.(d,I,s),
  };
}
