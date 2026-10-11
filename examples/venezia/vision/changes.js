import { INDICATORS } from '@engine/data/indicators.js';
import { L, t, dec, pct } from '@engine/i18n.js';
import { BASE } from './model.js';
import { CITY } from './config.js';

// "What has changed?": the visible changes in Venice, where each one shows and how to say it.
// Each reads one value of the vision (the engine's model.js visionOf, 0–1 unless noted) and is ranked by
// how far it has moved, weighted by how much it shows from the air. `anchor` names the things that appear
// with it – features.js layers grow in their items' order, so the newly shown ones mark the spot (main.js
// engine.changeAt) – or gives a fixed place: model metres, x east and z south of the centre (places.js),
// y a few metres over the ground and roofs there (the buildings' heights in city.json).
// Only what the engine can show in Venice is here. The historic city has no car streets, car parks or
// station (config.js), so the verge trees, street gardens, food parks, timber blocks and growing tower
// never appear – and nor do trees on the paved campi; it has no flood wall, mussel lines, wind turbines
// or floating quarter in the model either. What changes is on the roofs (solar tiles on the pitched ones,
// gardens on the flat ones and the altane), on the walls, in the walled gardens and on the campi (market
// stalls and long tables), in the water (its level, its colour) and among the people. The raised quays
// show when the water comes (the flood map holds it back up to the protection); the electric boats look
// like today's, so their callout says what has changed.
// show() gives the callout's figure: a model indicator where one says it best. Static words go through
// L() (en/changes.js, it/changes.js); sentences with figures are written with t(sv,en,it).
const fmtOf=k=>INDICATORS[k].fmt;
const metres=v=>`${dec(v,2)} m`;
// Heat in the year shown, from the world's warming then (ind.gwl, °C over pre-industrial; 1.4 in 2026):
// 21.7 days above 30 °C (CITY.hotDaysToday) and 66.9 tropical nights a year at Istituto Cavanis
// 2001–2025; about 45 days by 2071–2100 with RCP4.5 (about 1 °C more warming) and 69–76 days and some 125
// nights with RCP8.5 (about 1.8 °C more) – so about 26 days and 33 nights a degree (antagande,
// research/deep/hav-tidvatten).
export const hotDays=d=>(CITY.hotDaysToday??22)+26*Math.max(0,(d.gwl??1.4)-1.4);
export const tropicalNights=d=>66.9+33*Math.max(0,(d.gwl??1.4)-1.4);
// A percentage with its Italian article: "il 38%", "l'8%", "l'80%", "lo 0%" (cap: at the start of a sentence).
export const il=(v,cap=true)=>{const n=Math.round(v*100),a=n===0?'lo ':n===1||n===8||n===11||(n>=80&&n<90)?"l'":'il ';return (cap?a[0].toUpperCase()+a.slice(1):a)+pct(v);};
export const CHANGES=[
  // Solar tiles on the roofs that may carry them: every pitched roof whose turn has come, and the flat
  // ones not planted (future.js); bigger roofs go first. Over a block of tiled roofs north-east of Rialto.
  {id:'sol',color:'#e0a92b',weight:.8,v:v=>v.roofCover,anchor:{x:35,y:14,z:-254},
    title:()=>L('Soltegel på taken'),
    show:(d,d0)=>({value:d.solarMW,from:d0.solarMW,fmt:fmtOf('solarMW'),unit:L('MW solel i den historiska staden')}),
    note:d=>d.localEnergy<1?t(`Panelerna liknar de gamla takpannorna och ligger på de tak som får bära dem – 2026 var solpaneler förbjudna på hus byggda före 1945. ${pct(d.localEnergy)} av elen produceras lokalt.`,
      `The panels look like the old roof tiles and lie on the roofs that may carry them – in 2026 solar panels were banned on houses built before 1945. ${pct(d.localEnergy)} of the electricity is produced locally.`,
      `I pannelli sembrano i vecchi coppi e stanno sui tetti che possono portarli – nel 2026 il fotovoltaico era vietato sulle case costruite prima del 1945. ${il(d.localEnergy)} dell'elettricità è prodotto in loco.`)
      :L('Panelerna liknar de gamla takpannorna, och tillsammans med havsvinden utanför Lido ger de mer el än staden använder.')},
  // Gardens on the altane and the flat roofs: kitchen gardens, terraces, sedum and meadows, with beds, small
  // greenhouses, potted trees and people on them (future.js, roofprops.js). Over a big flat roof in Castello.
  {id:'altaner',color:'#7aa83a',weight:.8,v:v=>v.roofCover*Math.min(1,v.greenRatio+.25),anchor:{x:279,y:20,z:-39},
    title:()=>L('Trädgårdar på altanerna'),
    show:(d,d0)=>({value:d.cityVeg,from:d0.cityVeg,fmt:pct,unit:L('av frukt och grönt odlas i staden')}),
    note:()=>L('Odlingslådor, små växthus och krukträd på altanerna och de platta taken – och grannar som vattnar dem om kvällarna.')},
  // Climbing plants on the walls of the buildings whose turn has come, densest near the ground (future.js).
  // The houses behind the Riva degli Schiavoni.
  {id:'fasader',color:'#7aa83a',weight:.5,v:v=>v.facadeGreen,anchor:{x:470,y:7,z:40},
    title:()=>L('Blåregn och murgröna på husen'),
    show:(d,d0,v,v0)=>({value:v.facadeGreen,from:v0.facadeGreen,fmt:pct,unit:L('av husen har klätterväxter')}),
    note:()=>L('Klätterväxterna svalkar väggarna och de smala gränderna under de heta somrarna.')},
  // Fruit trees and berry bushes under the old trees of the gardens – the cloisters, the palazzi's walled
  // gardens and the Giardini Reali (features.js: the food forest on green ground).
  {id:'tradgardar',color:'#7aa83a',weight:.8,v:v=>v.foodForest,anchor:'fruit',
    title:()=>L('Fruktträd i klostrens och palatsens trädgårdar'),
    show:(d,d0)=>({value:d.greenShare,from:d0.greenShare,fmt:pct,unit:L('av den historiska staden är grön mark')}),
    note:()=>L('Fikon, granatäpplen och vinrankor under de gamla träden – och trädgårdarna bakom murarna står öppna för grannarna.')},
  // Market stalls fill the Rialto market again (CITY.squares: the Erberia by the fish hall).
  {id:'marknad',color:'#d0614e',weight:.8,v:v=>(v.market-.15)*1.2,anchor:{x:-240,y:3,z:-520},
    title:()=>L('Marknadsstånden fyller Rialto igen'),
    show:(d,d0)=>({value:d.foodRegional,from:d0.foodRegional,fmt:pct,unit:L('av maten kommer från lagunen och fastlandet')}),
    note:()=>L("Kronärtskockor från Sant'Erasmo, fisk och musslor från lagunen och grönsaker från altanerna. År 2024 fanns sju fiskstånd kvar i fiskhallen, mot ett trettiotal på 1980-talet.")},
  // Long tables for shared meals on the campi (CITY.squares: Santa Maria Formosa, San Polo, Santo Stefano).
  {id:'langbord',color:'#d0614e',weight:.8,v:v=>(v.community-.08)*1.2,anchor:{x:300,y:3,z:-240},
    title:()=>L('Långbord på campi'),
    show:(d,d0)=>({value:d.lowParticipation,from:d0.lowParticipation,fmt:pct,unit:L('har lågt socialt deltagande')}),
    note:d=>t(`Grannarna äter tillsammans på torgen om söndagarna. ${pct(d.cohousing)} bor i generationshus eller bogemenskap.`,
      `Neighbours eat together on the squares on Sundays. ${pct(d.cohousing)} live in multi-generation houses or co-housing.`,
      `La domenica i vicini mangiano insieme nei campi. ${il(d.cohousing)} vive in case intergenerazionali o in coabitazione.`)},
  // Raised quays and fondamenta (Leva med vattnet): the protection rises from the lowest walkways, 0.80 m,
  // by up to 0.40 m (vision.wall: the metres gained, model.js FLOOD.protectGain); the flood map keeps the
  // city dry until the water passes it – a few centimetres of stone that show most when the water comes,
  // so the weight is modest. At the Molo, where the Piazzetta meets the Bacino.
  {id:'kajer',color:'#4a8c7a',weight:.7,v:v=>(v.wall??0)/.4,anchor:{x:165,y:2,z:218},
    title:()=>L('Höjda kajer och fondamenta'),
    show:(d,d0)=>({value:d.protection,from:d0.protection,fmt:metres,unit:L('över tidvattennollan')}),
    note:d=>t(`Så högt kan lagunen stå innan de lägsta gatorna blir våta – Markusplatsen svämmade förr över redan vid 0,80 m. Hundraårshögvattnet utanför MOSE når ${dec(d.level100,2)} m det här året.`,
      `The lagoon can stand this high before the lowest streets get wet – St Mark's Square used to flood from 0.80 m. The 100-year high water outside MOSE reaches ${dec(d.level100,2)} m this year.`,
      `Fin qui può salire la laguna prima che le calli più basse si bagnino – un tempo Piazza San Marco andava sott'acqua già a 0,80 m. L'acqua alta centenaria fuori dal MOSE arriva quest'anno a ${dec(d.level100,2)} m.`)},
  // The sea against the stones: the water surface rises with the sea (vision.seaRise) – today's course
  // as much as any vision. At the tide gauge on Punta della Salute.
  {id:'hav',color:'#4a8c7a',weight:.45,v:v=>v.seaRise/.6,anchor:{x:-87,y:3,z:438},
    title:()=>L('Havet står högre mot stenarna'),
    show:d=>({value:d.seaRise,from:0,fmt:fmtOf('seaRise'),unit:L('jämfört med 2026')}),
    note:d=>(d.moseClosures>=360?L('MOSE står uppe nästan jämt.'):t(`MOSE stänger omkring ${Math.round(d.moseClosures)} gånger om året (2026: 49).`,`MOSE closes about ${Math.round(d.moseClosures)} times a year (2026: 49).`,`Il MOSE chiude circa ${Math.round(d.moseClosures)} volte l'anno (2026: 49).`))
      +(d.seaRise>.6?' '+L('Havet har passerat de 60 centimeter som barriären byggdes för.'):'')},
  // Clearer or murkier water: the lagoon's colour follows its health and its blooms (future.js). Out in the
  // Bacino between San Marco and San Giorgio.
  {id:'lagun',color:'#3a7ca5',weight:.6,v:v=>v.waterClarity-.5*v.bloom,anchor:{x:300,y:.5,z:350},
    title:(v,v0)=>v.waterClarity-.5*v.bloom>=v0.waterClarity-.5*v0.bloom?L('Klarare vatten i lagunen'):L('Grumligare vatten i lagunen'),
    show:(d,d0)=>({value:d.waters,from:d0.waters,fmt:fmtOf('waters'),unit:L('lagunens hälsa, 1 = god status')}),
    note:(d,d0)=>t(`Saltängar: ${Math.round(d.saltMarsh)} km² (2026: ${Math.round(d0.saltMarsh)} km²).`,`Salt marshes: ${Math.round(d.saltMarsh)} km² (2026: ${Math.round(d0.saltMarsh)} km²).`,`Barene: ${Math.round(d.saltMarsh)} km² (2026: ${Math.round(d0.saltMarsh)} km²).`)
      +(d.bloom>.35?' '+L('Algblomning de varmaste somrarna.'):'')},
  // Boats on electricity (Vaporetton på el; vision.boats and ferries follow it): the vaporetti on the Grand
  // Canal by Rialto look the same as today's, so the callout says what has changed.
  {id:'batar',color:'#3a7ca5',weight:.5,v:v=>Math.max(v.boats-.15,v.ferries??0)*1.2,anchor:{x:-150,y:1.5,z:-305},
    title:()=>L('Båtar på el på Canal Grande'),
    show:(d,d0)=>({value:d.boatElectric,from:d0.boatElectric,fmt:pct,unit:L('av båttrafiken går på el')}),
    note:()=>L('Vaporetti, taxibåtar och transportbåtar laddar vid bryggorna, och svallvågorna och avgaserna längs kanalerna minskar.')},
  // Today's course tells its story too: fewer and older Venetians – or more again (the residents in the
  // streets follow vision.people and their ages vision.old).
  {id:'folk',color:'#d0614e',weight:.5,v:v=>(v.people??1)-1+3*((v.old??BASE.share65)-BASE.share65),anchor:'crowd',
    title:(v,v0)=>(v.people??1)>(v0.people??1)+.04?L('Fler venetianer igen'):(v.people??1)<(v0.people??1)-.04?L('Färre och äldre venetianer'):L('Ett äldre Venedig'),
    show:(d,d0)=>({value:d.pop,from:d0.pop,fmt:fmtOf('pop'),unit:L('invånare i den historiska staden')}),
    note:(d,d0)=>t(`${pct(d.share65)} är 65 eller äldre, och ${pct(d.emptyHomes)} av bostäderna saknar boende (2026: ${pct(d0.emptyHomes)}).`,
      `${pct(d.share65)} are 65 or older, and ${pct(d.emptyHomes)} of the homes have no residents (2026: ${pct(d0.emptyHomes)}).`,
      `${il(d.share65)} ha 65 anni o più, e ${il(d.emptyHomes,false)} delle abitazioni è senza residenti (2026: ${pct(d0.emptyHomes)}).`)},
  // Hotter summers: the few lawns – the Giardini Reali by the Piazzetta – turn to straw (vision.dry).
  {id:'somrar',color:'#c9a227',weight:.8,v:v=>v.dry??0,anchor:{x:47,y:1,z:219},
    title:v=>(v.dry??0)>.25?L('Brända gräsmattor och heta nätter'):L('Hetare somrar'),
    show:(d,d0)=>({value:hotDays(d),from:hotDays(d0),fmt:v=>String(Math.round(v)),unit:L('dagar över 30 °C om året')}),
    note:d=>t(`Och omkring ${Math.round(tropicalNights(d))} tropiska nätter, då det aldrig svalnar under 20 °C (2026: 67) – båda uppskattade ur uppvärmningen.`,
      `And about ${Math.round(tropicalNights(d))} tropical nights, when it never cools below 20 °C (2026: 67) – both estimated from the warming.`,
      `E circa ${Math.round(tropicalNights(d))} notti tropicali, in cui non si scende mai sotto i 20 °C (2026: 67) – entrambi stimati dal riscaldamento.`)},
];
// How far a change has moved between two visions, weighted by how much it shows.
export const moved=(c,v,v0)=>c.weight*Math.abs(c.v(v)-c.v(v0));
// The changes worth showing between the visions of two years, the largest first.
export function ranked(v,v0,min=.06){
  return CHANGES.map(c=>({c,m:moved(c,v,v0)})).filter(o=>o.m>=min).sort((a,b)=>b.m-a.m);
}
// The callout for one change: 2026 against the year shown.
export function changeSpec(c,run,year,at){
  const i=Math.max(0,Math.min(run.years.length-1,Math.floor(year)-2026)),y=run.years[i],y0=run.years[0];
  const s=c.show(y.ind,y0.ind,y.vision,y0.vision);
  return {id:'chg-'+c.id,at,color:c.color,kicker:`2026 → ${Math.floor(year)}`,title:c.title(y.vision,y0.vision),value:s.value,from:s.from,fmt:s.fmt,unit:s.unit,
    fromText:`2026: ${s.fmt(s.from)}`,note:c.note(y.ind,y0.ind),side:'auto'};
}
