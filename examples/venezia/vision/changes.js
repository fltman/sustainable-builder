import { INDICATORS } from '@engine/data/indicators.js';
import { L, t, dec, int, pct } from '@engine/i18n.js';
import { BASE } from './model.js';
import { CITY } from './config.js';

// "What has changed?": the visible changes in Venice, where each one shows and how to say it.
// Each reads one value of the vision (model.js vision(), merged by the engine's visionOf; 0–1 unless noted) and
// is ranked by how far it has moved, weighted by how much it shows from the air. `anchor` names the things that
// appear with it – features.js layers grow in their items' order, so the newly shown ones mark the spot (main.js
// engine.changeAt) – or gives a fixed place: model metres, x east and z south of the centre (places.js), y a few
// metres over the ground and roofs there (the buildings' heights in city.json).
// Only what Venice's model lets the 3D city show is here: its roofs and facades never change (no panels, gardens
// or climbers on the palazzi – roofCover and facadeGreen stay 0), and it has no car streets, flood wall, timber
// blocks or growing tower. What changes is the market stalls at the Rialto market and on the campi (vision.market,
// from Rialto's fish stalls), the long tables on the campi (vision.community), the people and their ages
// (vision.people, old), the taxis and transport boats on the Grand Canal and in the Bacino (vision.boats), the
// lagoon's level against the stones (vision.seaRise: its mean seen from the city) and its colour (waterClarity,
// bloom), the raised walkways, which show when a high water comes (vision.wall: the flood map keeps the city dry
// up to the protection), the shade on the campi – sails and trees in stone planters (vision.shade) – the fruit trees
// in the walled gardens (foodForest) and the lawns in a hot summer (dry).
// The electric vaporetti look like today's, so the boats' callout says what has changed.
// show() gives the callout's figure: a model indicator where one says it best. Static words go through L()
// (en/changes.js, it/changes.js); sentences with figures are written with t(sv,en,it). title(v,v0,d,d0) and
// note(d,d0,I) read the year's vision, measures and levers (changeSpec below).
const fmtOf=k=>INDICATORS[k].fmt;
const metres=v=>`${dec(v,2)} m`;
const cm=m=>Math.round(m*100);
// How far a lever must be implemented (0–1) before a note names its first and second level (as vision-text.js).
const L1=.12,L2=.45;
// Heat in the year shown: the model's own count of days above 30 °C (model.js hotDays; 21.7 a year at Istituto
// Cavanis 2001–2025, CITY.hotDaysToday) and tropical nights estimated from the world's warming then (ind.gwl, °C
// over pre-industrial; 1.4 in 2026): 66.9 nights a year today, about 40 more by 2071–2100 with RCP4.5 (about 1 °C
// more warming) and some 72 more with RCP8.5 (about 1.8 °C more) – so about 33 nights a degree (antagande,
// research/deep/hav-tidvatten).
export const hotDays=d=>d.hotDays??(CITY.hotDaysToday??22)+26*Math.max(0,(d.gwl??1.4)-1.4);
export const tropicalNights=d=>66.9+33*Math.max(0,(d.gwl??1.4)-1.4);
// A percentage with its Italian article: "il 38%", "l'8%", "l'80%", "lo 0%" (cap: at the start of a sentence).
export const il=(v,cap=true)=>{const n=Math.round(v*100),a=n===0?'lo ':n===1||n===8||n===11||(n>=80&&n<90)?"l'":'il ';return (cap?a[0].toUpperCase()+a.slice(1):a)+pct(v);};
// Italian article before a figure as written ("l'8,5%", "il 14,3%").
const artIt=s=>{const n=parseInt(String(s),10);return n===0?'lo ':n===1||n===8||n===11||(n>=80&&n<90)?"l'":'il ';};
const pct1=v=>t(`${dec(v*100,1)} %`,`${dec(v*100,1)}%`,`${dec(v*100,1)}%`);
const times=n=>t(n===1?'gång':'gånger',n===1?'time':'times',n===1?'volta':'volte');
export const CHANGES=[
  // Market stalls fill the Rialto market again – and come to the campi (CITY.squares: the Erberia by the fish hall,
  // Santa Maria Formosa, San Polo, Santo Stefano). They follow Rialto's fish stalls (vision.market): seven in 2024,
  // about thirty in the 1980s; more with the people who cook here and a market the city backs (regionalt).
  {id:'marknad',color:'#d0614e',weight:.8,v:v=>v.market*1.2,anchor:{x:-240,y:3,z:-520},
    title:(v,v0,d,d0)=>d.fishStalls<d0.fishStalls?L('Färre stånd vid Rialto'):d.fishStalls>=15?L('Marknadsstånden fyller Rialto igen'):L('Fler stånd vid Rialto'),
    show:(d,d0)=>({value:d.fishStalls,from:d0.fishStalls,fmt:fmtOf('fishStalls'),unit:L('fiskstånd vid Rialto')}),
    note:(d,d0,I)=>d.fishStalls<d0.fishStalls?L('Marknaden följer dem som bor och lagar mat här: år 2024 fanns sju fiskstånd kvar, mot ett trettiotal på 1980-talet.')
      :(I.regionalt||0)>L1?t(`Odlarna från Sant'Erasmo, fiskevallarna och lagunens fiskare säljer vid Rialto. Uppskattningsvis ${pct(d.foodRegional)} av maten kommer från lagunen och Veneto (2026: ${pct(d0.foodRegional)}).`,
        `The growers from Sant'Erasmo, the fish farms and the lagoon's fishermen sell at the Rialto. An estimated ${pct(d.foodRegional)} of the food comes from the lagoon and the Veneto (2026: ${pct(d0.foodRegional)}).`,
        `Gli ortolani di Sant'Erasmo, le valli da pesca e i pescatori della laguna vendono a Rialto. Si stima che ${il(d.foodRegional,false)} del cibo venga dalla laguna e dal Veneto (2026: ${pct(d0.foodRegional)}).`)
      :L('Fler venetianer lagar mat hemma, och marknaden följer dem.')},
  // Long tables for shared meals on the campi (vision.community): neighbours who know each other, the
  // multi-generation houses' kitchens on the campo (bogemenskap) and the sestieri's assemblies (demokrati).
  {id:'langbord',color:'#d0614e',weight:.8,v:v=>v.community*1.2,anchor:{x:300,y:3,z:-240},
    title:(v,v0)=>v.community<v0.community?L('Tommare campi'):L('Långbord på campi'),
    show:(d,d0)=>({value:d.friends,from:d0.friends,fmt:fmtOf('friends'),unit:t('har vänner att räkna med','have friends to count on','ha amici su cui contare')}),
    note:(d,d0,I)=>d.friends<d0.friends?L('Färre grannar möts på campo om kvällarna, och ensamheten har ökat.')
      :t(`Grannarna äter tillsammans på campo om kvällarna${(I.bogemenskap||0)>L2?' – generationshusen har sina kök vid torget':''}${(I.demokrati||0)>L2?', och sestierets medborgarråd samlas vid samma bord':''}.`,
        `Neighbours eat together on the campo in the evenings${(I.bogemenskap||0)>L2?' – the multi-generation houses have their kitchens on the square':''}${(I.demokrati||0)>L2?", and the sestiere's citizens' assembly gathers at the same tables":''}.`,
        `La sera i vicini cenano insieme in campo${(I.bogemenskap||0)>L2?' – le case tra generazioni hanno la cucina sul campo':''}${(I.demokrati||0)>L2?", e l'assemblea dei cittadini del sestiere si riunisce alle stesse tavolate":''}.`)},
  // The people in the calli: more Venetians again – or fewer – and their ages (vision.people and old follow the
  // model's residents and its share 65+). Where most people are, near the view.
  {id:'folk',color:'#d0614e',weight:.5,v:v=>(v.people??1)-1+3*((v.old??BASE.share65)-BASE.share65),anchor:'crowd',
    title:(v,v0)=>{const p=v.people??1,p0=v0.people??1,o=v.old??BASE.share65,o0=v0.old??BASE.share65;
      return p>p0+.04?(o<o0-.01?L('Fler och yngre venetianer'):L('Fler venetianer igen')):p<p0-.04?(o>o0+.01?L('Färre och äldre venetianer'):L('Färre venetianer')):o>o0?L('Ett äldre Venedig'):L('Ett yngre Venedig');},
    show:(d,d0)=>({value:d.pop,from:d0.pop,fmt:fmtOf('pop'),unit:L('invånare i den historiska staden')}),
    note:(d,d0)=>t(`${pct(d.share65)} är 65 eller äldre och ${pct1(d.share0_14)} barn under 15 (2026: ${pct(d0.share65)} och ${pct1(d0.share0_14)}); ${pct(d.emptyHomes)} av bostäderna saknar boende (2026: ${pct(d0.emptyHomes)}).`,
      `${pct(d.share65)} are 65 or older and ${pct1(d.share0_14)} are children under 15 (2026: ${pct(d0.share65)} and ${pct1(d0.share0_14)}); ${pct(d.emptyHomes)} of the homes have no residents (2026: ${pct(d0.emptyHomes)}).`,
      `${il(d.share65)} ha 65 anni o più e i bambini sotto i 15 anni sono ${artIt(pct1(d.share0_14))}${pct1(d.share0_14)} (2026: ${pct(d0.share65)} e ${pct1(d0.share0_14)}); ${il(d.emptyHomes,false)} delle abitazioni è senza residenti (2026: ${pct(d0.emptyHomes)}).`)},
  // Fewer taxis and transport boats on the Grand Canal and in the Bacino (vision.boats: shared taxis and freight,
  // kollektivt, and fewer day-trippers). The vaporetti by Rialto look the same as today's, so the callout says that
  // they now run on electricity.
  {id:'batar',color:'#3a7ca5',weight:.6,v:v=>Math.min(1,v.boats??1),anchor:{x:-150,y:1.5,z:-305},
    title:()=>L('Färre motorbåtar på Canal Grande'),
    show:(d,d0)=>({value:d.boatElectric,from:d0.boatElectric,fmt:fmtOf('boatElectric'),unit:L('av båttrafiken går på el')}),
    note:(d,d0,I)=>((I.kollektivt||0)>L2?L('Taxi och transporter delas och varorna samlastas, och vaporetti och sopbåtar laddar vid bryggorna: svallvågorna och avgaserna längs kanalerna minskar.')
        :(I.kollektivt||0)>L1?L('Hybridvaporetti och fartkameror i alla kanaler, och taxi och transporter delas allt mer.')
        :L('Färre dagsbesökare ger färre taxibåtar på kanalerna.'))
      +' '+t(`Kvävedioxiden vid Rio Novo: ${Math.round(d.no2)} µg/m³ (2026: ${Math.round(d0.no2)}).`,`Nitrogen dioxide at Rio Novo: ${Math.round(d.no2)} µg/m³ (2026: ${Math.round(d0.no2)}).`,`Biossido di azoto a rio Novo: ${Math.round(d.no2)} µg/m³ (2026: ${Math.round(d0.no2)}).`)},
  // The lagoon against the stones: its surface follows its mean level seen from the city (vision.seaRise: the sea's
  // rise, less the city's lift, less what the closed gates hold back) – today's course as much as any vision. At
  // the tide gauge on Punta della Salute.
  {id:'hav',color:'#4a8c7a',weight:.45,v:v=>v.seaRise/.6,anchor:{x:-87,y:3,z:438},
    title:(v,v0)=>v.seaRise<v0.seaRise-.02?L('Lagunen hålls nere bakom de stängda inloppen'):L('Lagunen står högre mot stenarna'),
    show:(d,d0)=>({value:d.lagoonMean,from:d0.lagoonMean,fmt:fmtOf('lagoonMean'),unit:L('lagunens medelnivå över tidvattennollan')}),
    note:d=>{const lift=d.uplift||0,sea=d.seaRise+lift,n=Math.round(d.moseClosures);
      if(d.lagoonClosed>.98)return t(`Havet utanför står ${cm(sea)} cm högre än 2026, men inloppen är stängda för gott och lagunen hålls nere med pumpar.`,
        `The sea outside stands ${cm(sea)} cm higher than in 2026, but the inlets are closed for good and the lagoon is held down by pumps.`,
        `Il mare fuori è ${cm(sea)} cm più alto che nel 2026, ma le bocche di porto sono chiuse per sempre e la laguna è tenuta bassa con le pompe.`);
      return t(`Havet står ${cm(sea)} cm högre än 2026${lift>=.005?`, men staden har lyfts ${cm(lift)} cm`:''}${d.lagoonClosed>.1?`, och luckorna håller ute högvattnen ${pct(d.lagoonClosed)} av årets timmar`:''}. MOSE stänger ${n>=360?'nästan varje dag':`${n} ${times(n)} om året`} (2026: 26).${sea>.6?' Havet har passerat de 60 centimeter som barriären byggdes för.':''}`,
        `The sea stands ${cm(sea)} cm higher than in 2026${lift>=.005?`, but the city has been raised ${cm(lift)} cm`:''}${d.lagoonClosed>.1?`, and the gates keep the high waters out ${pct(d.lagoonClosed)} of the hours in the year`:''}. MOSE closes ${n>=360?'almost every day':`${n} ${times(n)} a year`} (2026: 26).${sea>.6?' The sea has passed the 60 centimetres the barrier was built for.':''}`,
        `Il mare è ${cm(sea)} cm più alto che nel 2026${lift>=.005?`, ma la città è stata sollevata di ${cm(lift)} cm`:''}${d.lagoonClosed>.1?`, e le paratoie tengono fuori l'acqua alta per ${il(d.lagoonClosed,false)} delle ore dell'anno`:''}. Il MOSE chiude ${n>=360?'quasi ogni giorno':`${n} ${times(n)} l'anno`} (2026: 26).${sea>.6?' Il mare ha superato i 60 centimetri per cui la barriera era stata progettata.':''}`);}},
  // Clearer or murkier water: the lagoon's colour follows its health and its blooms (vision.waterClarity, bloom).
  // Out in the Bacino between San Marco and San Giorgio.
  {id:'lagun',color:'#3a7ca5',weight:.6,v:v=>v.waterClarity-.5*v.bloom,anchor:{x:300,y:.5,z:350},
    title:(v,v0)=>v.waterClarity-.5*v.bloom>=v0.waterClarity-.5*v0.bloom?L('Klarare vatten i lagunen'):L('Grumligare vatten i lagunen'),
    show:(d,d0)=>({value:d.waters,from:d0.waters,fmt:fmtOf('waters'),unit:L('lagunens hälsa, 1 = god status')}),
    note:(d,d0)=>t(`Saltängar: ${Math.round(d.saltMarsh)} km² (2026: ${Math.round(d0.saltMarsh)} km²).`,`Salt marshes: ${Math.round(d.saltMarsh)} km² (2026: ${Math.round(d0.saltMarsh)} km²).`,`Barene: ${Math.round(d.saltMarsh)} km² (2026: ${Math.round(d0.saltMarsh)} km²).`)
      +(d.lagoonClosed>.98?' '+L('Inloppen är stängda för gott, och vattnet byts inte längre med havet.')
        :d.lagoonClosed>=.25?' '+t(`Lagunen är stängd mot havet ${pct(d.lagoonClosed)} av årets timmar.`,`The lagoon is closed to the sea ${pct(d.lagoonClosed)} of the hours in the year.`,`La laguna è chiusa al mare per ${il(d.lagoonClosed,false)} delle ore dell'anno.`):'')
      +(d.bloom>.35?' '+L('Algblomning de varmaste somrarna.'):'')},
  // Raised quays and fondamenta (Leva med vattnet): the protection rises from the lowest walkways, 0.80 m, by up to
  // 0.40 m (vision.wall: the metres gained, model.js FLOOD.protectGain); the flood map keeps the city dry until the
  // water passes it – a few centimetres of stone that show most when the water comes, so the weight is modest. At
  // the Molo, where the Piazzetta meets the Bacino.
  {id:'kajer',color:'#4a8c7a',weight:.7,v:v=>(v.wall??0)/.4,anchor:{x:165,y:2,z:218},
    title:()=>L('Höjda kajer och fondamenta'),
    show:(d,d0)=>({value:d.protection,from:d0.protection,fmt:metres,unit:L('över tidvattennollan')}),
    note:d=>{const lift=d.uplift||0,dry=d.levelInside<=d.protection;
      return t(`Så högt kan lagunen stå innan de lägsta gatorna blir våta – Markusplatsen svämmade förr över redan vid 0,80 m. Ett hundraårshögvatten lämnar lagunen vid ${dec(d.levelInside,2)} m i staden, ${dry?'under skyddet':'över skyddet'}.${lift>=.005?` Staden har dessutom lyfts ${cm(lift)} cm.`:''}`,
        `The lagoon can stand this high before the lowest streets get wet – St Mark's Square used to flood from 0.80 m. A 100-year high water leaves the lagoon at ${dec(d.levelInside,2)} m in the city, ${dry?'below the protection':'above the protection'}.${lift>=.005?` The city has also been raised ${cm(lift)} cm.`:''}`,
        `Fin qui può salire la laguna prima che le calli più basse si bagnino – un tempo piazza San Marco andava sott'acqua già a 0,80 m. Un'acqua alta centenaria lascia la laguna a ${dec(d.levelInside,2)} m in città, ${dry?'sotto la protezione':'sopra la protezione'}.${lift>=.005?` La città è stata anche sollevata di ${cm(lift)} cm.`:''}`);}},
  // Shade on the campi (Svalka i campi; vision.shade): sails over the paving and trees in stone planters – the campi
  // cannot be dug up, for the wells and cisterns beneath them (features.js: CITY.squares). On Campo San Polo.
  {id:'skugga',color:'#7aa83a',weight:.7,v:v=>v.shade??0,anchor:{x:-590,y:4,z:-290},
    title:()=>L('Skugga på campi'),
    show:(d,d0)=>({value:d.shade,from:d0.shade,fmt:fmtOf('shade'),unit:t('av torgens yta ligger i skugga','of the squares lie in shade','della superficie dei campi è in ombra')}),
    note:(d,d0)=>L('Segel över stenläggningen och träd i stenkrukor: under campi ligger brunnarna och cisternerna, så marken grävs inte upp.')
      +' '+t(`Omkring ${Math.round(hotDays(d))} dagar över 30 °C om året (2026: ${Math.round(hotDays(d0))}).`,`About ${Math.round(hotDays(d))} days above 30 °C a year (2026: ${Math.round(hotDays(d0))}).`,`Circa ${Math.round(hotDays(d))} giorni sopra i 30 °C all'anno (2026: ${Math.round(hotDays(d0))}).`)},
  // Fruit trees and berry bushes under the old trees of the walled gardens – the cloisters, the palazzi's gardens and
  // the Giardini Reali (features.js: the food forest on green ground; vision.foodForest from Svalka i campi and the
  // lagoon's food). Its figure: the food from the lagoon and the Veneto.
  {id:'tradgardar',color:'#7aa83a',weight:.8,v:v=>v.foodForest,anchor:'fruit',
    title:()=>L('Fruktträd i klostrens och palatsens trädgårdar'),
    show:(d,d0)=>({value:d.foodRegional,from:d0.foodRegional,fmt:fmtOf('foodRegional'),unit:L('av maten kommer från lagunen och Veneto')}),
    note:(d,d0,I)=>(I.svalka||0)>L2?L('Fikon, granatäpplen och vinrankor under de gamla träden – trädgårdarna bakom murarna står öppna för grannarna som svala rum under de heta somrarna.')
      :L('Trädgårdarna bakom murarna odlas igen: fikon, granatäpplen och vinrankor under de gamla träden.')},
  // Hotter summers: the few lawns – the Giardini Reali by the Piazzetta – turn to straw (vision.dry).
  {id:'somrar',color:'#c9a227',weight:.8,v:v=>v.dry??0,anchor:{x:47,y:1,z:219},
    title:v=>(v.dry??0)>.25?L('Brända gräsmattor och heta nätter'):L('Hetare somrar'),
    show:(d,d0)=>({value:hotDays(d),from:hotDays(d0),fmt:v=>String(Math.round(v)),unit:L('dagar över 30 °C om året')}),
    note:(d,d0)=>t(`Och omkring ${Math.round(tropicalNights(d))} tropiska nätter, då det aldrig svalnar under 20 °C (2026: 67) – uppskattade ur uppvärmningen. Värmen tar uppskattningsvis ${int(d.heatDeaths)} liv en vanlig sommar (2026: ${int(d0.heatDeaths)}).`,
      `And about ${Math.round(tropicalNights(d))} tropical nights, when it never cools below 20 °C (2026: 67) – estimated from the warming. The heat takes an estimated ${int(d.heatDeaths)} lives in an ordinary summer (2026: ${int(d0.heatDeaths)}).`,
      `E circa ${Math.round(tropicalNights(d))} notti tropicali, in cui non si scende mai sotto i 20 °C (2026: 67) – stimate dal riscaldamento. Il caldo costa circa ${int(d.heatDeaths)} vite in un'estate normale (2026: ${int(d0.heatDeaths)}).`)},
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
  return {id:'chg-'+c.id,at,color:c.color,kicker:`2026 → ${Math.floor(year)}`,title:c.title(y.vision,y0.vision,y.ind,y0.ind),value:s.value,from:s.from,fmt:s.fmt,unit:s.unit,
    fromText:`2026: ${s.fmt(s.from)}`,note:c.note(y.ind,y0.ind,y.I||{}),side:'auto'};
}
