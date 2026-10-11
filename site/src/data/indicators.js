import { LANG, L } from '../i18n.js';
import { INDICATORS as PLACE, KEY_FIGURES as PLACE_FIGURES } from '@city/indicators.js';
// Display metadata for model indicators, the same for every place. A place adds its own names and notes,
// `base` – the record in its research/baseline.json the 2026 value comes from (its source is shown in
// the interface) – and the measures only it has (@city/indicators.js). `assumption` marks indicators
// that are model constructs rather than measured statistics.
// Number formats follow the interface language (decimal comma and "42 %" in Swedish).
const pct=v=>LANG==='en'?`${Math.round(v*100)}%`:`${Math.round(v*100)} %`,pct1=v=>LANG==='en'?`${(v*100).toFixed(1)}%`:`${(v*100).toFixed(1).replace('.',',')} %`;
const num=(d=0)=>v=>v.toLocaleString(LANG==='en'?'en-GB':'sv-SE',{maximumFractionDigits:d,minimumFractionDigits:d});
const GENERIC={
  pop:{name:'Befolkning',unit:'invånare',fmt:v=>num(0)(v>=1e5?Math.round(v/1000)*1000:Math.round(v/100)*100),better:0,theme:'gemenskap'},
  ghg:{name:'Utsläpp inom kommunen',unit:'ton CO₂e per invånare',fmt:num(2),better:-1,theme:'energi'},
  ghgCons:{name:'Konsumtionens utsläpp',unit:'ton CO₂e per person',fmt:num(1),better:-1,theme:'energi'},
  foodRegional:{name:'Mat från länet',unit:'av det vi äter',fmt:pct,better:1,assumption:true,theme:'mat'},
  cityVeg:{name:'Grönsaker odlade i staden',unit:'av frukt och grönt',fmt:pct,better:1,assumption:true,theme:'mat'},
  localEnergy:{name:'Lokal elproduktion',unit:'av elanvändningen',fmt:v=>v>1.5?(LANG==='en'?`${v.toFixed(1)} × demand`:`${v.toFixed(1).replace('.',',')} × behovet`):v>1?`${Math.round(v*100)} %`:pct(v),better:1,theme:'energi'},
  carShare:{name:'Resor med bil',unit:'av alla resor',fmt:pct,better:-1,theme:'stad'},
  greenShare:{name:'Grön mark i stadskärnan',unit:'genomsläpplig yta',fmt:pct,better:1,theme:'stad'},
  boatElectric:{name:'Eldriven sjötrafik',unit:'av båttrafiken',fmt:pct,better:1,assumption:true,theme:'stad'},
  canopy:{name:'Trädkronor i tätorten',unit:'krontäckning',fmt:pct,better:1,theme:'stad'},
  lifeExp:{name:'Medellivslängd',unit:'år',fmt:num(1),better:1,theme:'halsa'},
  lowParticipation:{name:'Lågt socialt deltagande',unit:'av invånarna',fmt:pct,better:-1,theme:'gemenskap'},
  trust:{name:'Tillit till andra',unit:'av invånarna',fmt:pct,better:1,theme:'gemenskap'},
  distress:{name:'Allvarlig psykisk påfrestning',unit:'av vuxna',fmt:pct,better:-1,theme:'halsa'},
  youthScreen:{name:'Unga med mer än 3 timmars skärmtid',unit:'per dag (fritid)',fmt:pct,better:-1,theme:'teknik'},
  waters:{name:'Vattnets hälsa',unit:'index, 1 = god status',fmt:num(2),better:1,assumption:true,theme:'mat'},
  water:{name:'Vattensäkerhet',unit:'index 0–1',fmt:num(2),better:1,assumption:true,theme:'resiliens'},
  seaRise:{name:'Högvattnet jämfört med 2026',unit:'meter (efter landhöjning)',fmt:v=>`+${LANG==='en'?v.toFixed(2):v.toFixed(2).replace('.',',')} m`,better:-1,theme:'resiliens'},
  floodRisk:{name:'Översvämningsrisk i centrum',unit:'index 0–1',fmt:num(2),better:-1,assumption:true,theme:'resiliens'},
  floodShare:{name:'Centrum under vatten vid ett 100-årshögvatten',unit:'av centrum',fmt:pct,better:-1,theme:'resiliens'},
  foodStockDays:{name:'Matlager i kommunen',unit:'dagar',fmt:num(0),better:1,assumption:true,theme:'resiliens'},
  homePrepared:{name:'Hemberedskap en vecka',unit:'av hushållen',fmt:pct,better:1,theme:'resiliens'},
  analogResilience:{name:'Analog reserv',unit:'index 0–1',fmt:num(2),better:1,assumption:true,theme:'teknik'},
  aiCapacity:{name:'AI i välfärden',unit:'index 0–1',fmt:num(2),better:0,assumption:true,theme:'teknik'},
  aiGovernance:{name:'Demokratisk kontroll över AI',unit:'index 0–1',fmt:num(2),better:1,assumption:true,theme:'teknik'},
  workHours:{name:'Arbetstid',unit:'timmar per vecka',fmt:num(0),better:-1,theme:'gemenskap'},
  cohousing:{name:'Bor i bogemenskap',unit:'av invånarna',fmt:pct,better:1,theme:'gemenskap'},
  gini:{name:'Inkomstskillnader',unit:'Gini 0–1',fmt:num(3),better:-1,theme:'gemenskap'},
  childPoverty:{name:'Barnfattigdom',unit:'av barnen',fmt:pct1,better:-1,theme:'gemenskap'},
  heritage:{name:'Kulturarvet i centrum',unit:'index, 1 = intakt',fmt:num(2),better:1,assumption:true,theme:'stad'},
  biodiversity:{name:'Biologisk mångfald',unit:'index 0–1',fmt:num(2),better:1,assumption:true,theme:'mat'},
  solarMW:{name:'Solel',unit:'MW installerat',fmt:num(0),better:1,theme:'energi'},
  windMW:{name:'Vindkraft',unit:'MW installerat',fmt:num(0),better:1,theme:'energi'},
  unemployment:{name:'Arbetslöshet',unit:'20–64 år',fmt:pct1,better:-1,theme:'gemenskap'},
  education:{name:'Gymnasieexamen inom 4 år',unit:'av eleverna',fmt:pct,better:1,theme:'teknik'},
  selfHealth:{name:'Självskattad god hälsa',unit:'av vuxna',fmt:pct,better:1,theme:'halsa'},
  activity:{name:'Fysiskt aktiva',unit:'av vuxna',fmt:pct,better:1,theme:'halsa'},
  unsafe:{name:'Otrygga ute på kvällen',unit:'av invånarna',fmt:pct,better:-1,theme:'gemenskap'},
  welfare:{name:'Välfärdskapacitet',unit:'index, 2026 = 1',fmt:num(2),better:1,assumption:true,theme:'gemenskap'},
  wellbeing:{name:'Välbefinnande',unit:'index 0–1',fmt:num(2),better:1,assumption:true,theme:'halsa'},
  preparedness:{name:'Beredskap',unit:'index 0–1',fmt:num(2),better:1,assumption:true,theme:'resiliens'},
  restrictions:{name:'Somrar med bevattningsförbud',unit:'av somrarna',fmt:pct,better:-1,theme:'resiliens'},
  share65:{name:'Invånare 65 år och äldre',unit:'av befolkningen',fmt:pct,better:0,theme:'gemenskap'},
  evShare:{name:'Elbilar',unit:'av personbilarna',fmt:pct,better:1,theme:'stad'},
  waterMargin:{name:'Vattenmarginal ett torrår',unit:'råvatten utöver behovet',fmt:v=>(v<0?'−':'')+pct(Math.abs(v)),better:1,theme:'resiliens'},
  guestNights:{name:'Gästnätter i kommunen',unit:'per år',fmt:v=>num(0)(Math.round(v/1000)*1000),better:0,theme:'stad'},
  tourismCO2:{name:'Besökarnas klimatpåverkan',unit:'ton CO₂e per år',fmt:v=>num(0)(Math.round(v/100)*100),better:-1,assumption:true,theme:'energi'},
  railMain:{name:'Tåget till huvudstaden',unit:'timmar',fmt:v=>{const h=Math.floor(v+1/120),m=Math.round((v-h)*60/5)*5;return LANG==='en'?`${h} h ${String(m).padStart(2,'0')}`:`${h} h ${String(m).padStart(2,'0')}`;},better:-1,theme:'stad'},
};
export const INDICATORS={};
for(const k of new Set([...Object.keys(GENERIC),...Object.keys(PLACE)]))INDICATORS[k]={...GENERIC[k],...PLACE[k]};
// The key-figure board, in reading order (the place's own, or these).
export const KEY_FIGURES=PLACE_FIGURES||['pop','lifeExp','ghgCons','foodRegional','localEnergy','carShare','lowParticipation','trust','waters','waterMargin','homePrepared','analogResilience','workHours','cohousing','heritage'];

if(LANG==='en')for(const m of Object.values(INDICATORS)){m.name=L(m.name);m.unit=L(m.unit);if(m.note)m.note=L(m.note);}
