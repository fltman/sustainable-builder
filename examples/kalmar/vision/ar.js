import { INDICATORS } from '@engine/data/indicators.js';
import { LANG, L, t, dec } from '@engine/i18n.js';

// What the AR layer explains, pinned to the places where it shows: each spot reads one model
// indicator for the year shown, counts up from 2026 and carries the century's curve so far.
export const AR_SPOTS=[
  {id:'sol',at:{x:-60,y:22,z:-40},side:'auto',key:'solarMW',kicker:'Energi',title:'Solel på stadens tak',unit:'MW',
    note:d=>d.localEnergy>1?t(`Kalmar producerar ${dec(d.localEnergy)} gånger sitt eget elbehov.`,`Kalmar produces ${dec(d.localEnergy)} times its own electricity demand.`):t(`${Math.round(d.localEnergy*100)} % av elen produceras lokalt.`,`${Math.round(d.localEnergy*100)}% of electricity is produced locally.`)},
  {id:'mat',at:{x:216,y:3,z:-172},side:'auto',key:'foodRegional',kicker:'Mat',title:'Maten som kommer från länet',unit:'',
    note:d=>t(`Staden odlar själv ${Math.round(d.cityVeg*100)} % av sin frukt och sina grönsaker.`,`The city grows ${Math.round(d.cityVeg*100)}% of its own fruit and vegetables.`)},
  {id:'bil',at:{x:-100,y:2,z:2},side:'auto',key:'carShare',kicker:'Gatorna',title:'Resor som görs med bil',unit:'',
    note:d=>d.depave>.4?t('Gatorna har blivit trädgårdar, kanaler och gångstråk.','The streets have become gardens, canals and footpaths.'):t('Gatorna är fortfarande till för bilar.','The streets are still for cars.')},
  {id:'hav',at:{x:430,y:0,z:-420},side:'auto',key:'waters',kicker:'Kalmarsund',title:'Havets hälsa (1 = god status)',unit:'',
    note:d=>d.waters>.55?t('Vattnet är klart och algblomning sällsynt. Musslor och våtmarker renar.','The water is clear and algal blooms are rare. Mussels and wetlands clean it.'):d.waters>.3?t('Bättre än 2026, men fortfarande övergött.','Better than in 2026, but still over-fertilised.'):t('Algblomning varje sommar.','Algal blooms every summer.')},
  {id:'batar',at:{x:560,y:0,z:-180},side:'auto',key:'boatElectric',kicker:'Sjötrafik',title:'Båttrafik som går på el',unit:'',
    note:d=>d.boatElectric>.6?t('Tysta bärplansfärjor till Öland, båtbussar runt ön – laddade med sundets vindkraft.','Quiet hydrofoil ferries to Öland and boat buses round the island – charged with the strait’s wind power.'):t('Mest dieselbåtar fortfarande.','Mostly diesel boats still.')},
  {id:'niva',at:{x:330,y:3,z:150},side:'auto',key:'seaRise',kicker:'Klimatanpassning',title:'Havsnivå jämfört med 2026',unit:'',
    note:d=>t(`Skyddet når ${dec(d.protection)} m. Översvämningsrisk: ${d.floodRisk<.2?'låg':d.floodRisk<.5?'måttlig':'hög'}.`,`Protection reaches ${dec(d.protection)} m. Flood risk: ${d.floodRisk<.2?'low':d.floodRisk<.5?'moderate':'high'}.`)},
  {id:'gemenskap',at:{x:24,y:3,z:-8},side:'auto',key:'lowParticipation',kicker:'Gemenskap',title:'Har lågt socialt deltagande',unit:'',
    note:d=>t(`${Math.round(d.cohousing*100)} % bor i bogemenskap. Arbetsveckan är ${Math.round(d.workHours)} timmar.`,`${Math.round(d.cohousing*100)}% live in co-housing. The working week is ${Math.round(d.workHours)} hours.`)},
  {id:'trad',at:{x:0,y:0,z:0},side:'auto',key:'canopy',kicker:'Grönska',title:'Trädkronor i tätorten',unit:'',
    note:d=>t(`Träd och planteringar svalkar staden och tar hand om skyfall. ${Math.round(d.greenShare*100)} % av stadskärnan är grön mark.`,`Trees and planting cool the city and absorb cloudbursts. ${Math.round(d.greenShare*100)}% of the centre is green ground.`)},
  {id:'torn',at:{x:0,y:0,z:0},side:'auto',key:'cityVeg',kicker:'Odlingstornet',title:'Frukt och grönt odlat i staden',unit:'',
    note:d=>t(`Sexton våningar odling året runt vid Kalmar C. ${Math.round(d.foodRegional*100)} % av maten kommer från länet.`,`Sixteen floors growing food all year round by Kalmar C. ${Math.round(d.foodRegional*100)}% of the food comes from the county.`)},
  {id:'vind',at:{x:2800,y:110,z:-600},side:'auto',key:'windMW',kicker:'Havsvind',title:'Vindkraft i Kalmarsund',unit:'MW',
    note:()=>t('Delägd av invånarna.','Co-owned by the residents.')},
  {id:'bo',at:{x:-500,y:20,z:180},side:'auto',key:'pop',kicker:'Boende',title:'Invånare i Kalmar kommun',unit:'',
    note:d=>t(`Nya kvarter i trä där parkeringarna låg. ${Math.round(d.share80*100)} % är över 80 år.`,`New timber neighbourhoods where the car parks were. ${Math.round(d.share80*100)}% are over 80.`)},
  {id:'liv',at:{x:-205,y:12,z:4},side:'auto',key:'lifeExp',kicker:'Hälsa',title:'Medellivslängd',unit:'år',
    note:d=>t(`${Math.round(d.activity*100)} % rör sig tillräckligt i vardagen.`,`${Math.round(d.activity*100)}% get enough everyday exercise.`)},
];
const EN_AR={'Grönska':'Greenery','Trädkronor i tätorten':'Tree canopy in the town','Odlingstornet':'The Growing Tower','Frukt och grönt odlat i staden':'Fruit and vegetables grown in the city'};
if(LANG==='en')for(const sp of AR_SPOTS){sp.kicker=EN_AR[sp.kicker]??L(sp.kicker);sp.title=EN_AR[sp.title]??L(sp.title);}
export function arSpec(spot,run,year){
  const i=Math.max(0,Math.min(run.years.length-1,Math.floor(year)-2026)),d=run.years[i].ind,d0=run.years[0].ind,meta=INDICATORS[spot.key];
  const series=run.years.slice(0,i+1).filter((_,k)=>k%3===0||k===i).map(y=>y.ind[spot.key]);
  const fmt=meta.fmt;
  return {...spot,value:d[spot.key],from:d0[spot.key],fmt,fromText:i?`2026: ${fmt(d0[spot.key])}`:'',spark:series.length>2?series:null,note:spot.note(d)};
}
