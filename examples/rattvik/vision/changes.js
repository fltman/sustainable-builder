import { INDICATORS } from '@engine/data/indicators.js';
import { t, pct } from '@engine/i18n.js';
import { BASE } from './model.js';

// "What has changed?": the visible changes in Rättvik, where each one shows and how to say it – only what
// Rättvik's model lets the 3D town show (model.js vision): streets and car parks turned into gardens and food
// parks, channels for the cloudbursts, solar and turf roofs, timber houses of two to four storeys, berry
// bushes and fruit trees, stalls and long tables, the summer boat buses and the small boats on Rättviken, the
// shuttles, the water, the cars, the people, drier summers and green facades.
// Each reads one value of the vision (the engine's model.js visionOf, 0–1 unless noted) and is ranked by
// how far it has moved, weighted by how much it shows from the air. `anchor` names the things that appear
// with it – features.js layers and the timber blocks grow in their items' order, so the newly shown ones
// mark the spot (main.js engine.changeAt) – or gives a fixed place: model metres, x east and z south of
// the centre, y a few metres over the ground and roofs there (Lantmäteriet's heights in city.json; the 3D
// ground y = 0 stands for 163.38 m RH 2000).
// Not here, because nothing in the model area shows them: the fäbodar and the forests, the wind power 35–50 km
// to the north-east, the lime works' capture, the trout, and Siljan's rising 100-year level and the room made
// for it (no wall is drawn, and the campsite moving up shows only when a high water comes) – the vision text,
// the AR layer and the figures tell those. Siljan has no floating homes, ferries, mussel lines or bridge.
// show() gives the callout's figure: one of Rättvik's own measures (indicators.js) where one says it best.
const fmtOf=k=>INDICATORS[k].fmt;
const n0=v=>String(Math.round(v));
export const CHANGES=[
  {id:'gator',color:'#3f8fc2',weight:1.2,v:v=>Math.max(v.depave,v.verge??0),anchor:'trees',
    title:v=>v.depave>.12?t('Gatorna blir trädgårdar','The streets become gardens'):t('Träd och odling längs gatorna','Trees and beds along the streets'),
    show:(d,d0,v)=>v.depave>.12?{value:d.depave,from:0,fmt:pct,unit:t('av gatorna i centrum','of the streets in the centre')}:{value:d.canopy,from:d0.canopy,fmt:pct,unit:t('trädkronor i tätorten','tree canopy in the town')},
    note:(d,d0)=>t(`Bilen används för ${pct(d.carShare)} av resorna (2026: ${pct(d0.carShare)}), och ${pct(d.activeShare)} går eller cyklar.`,`The car is used for ${pct(d.carShare)} of trips (2026: ${pct(d0.carShare)}), and ${pct(d.activeShare)} walk or cycle.`)},
  // Open channels down the middle of the converted streets take the cloudbursts (future.js draws them
  // only where a street has become a garden, so the converted streets' trees mark them).
  {id:'skyfall',color:'#4a8c7a',weight:.7,v:v=>Math.min(v.depave,v.canals??0),anchor:'trees',
    title:()=>t('Gatorna tar hand om skyfallen','The streets take the cloudbursts'),
    show:(d,d0)=>({value:d.cloudburstHomes,from:d0.cloudburstHomes,fmt:fmtOf('cloudburstHomes'),unit:t('hus skulle skadas av ett skyfall som Hans','houses would be damaged by a cloudburst like Storm Hans')}),
    note:(d,d0)=>t(`Öppna diken mitt i gatan leder regnet till regnbäddar och översvämningsängar. ${pct(d.greenShare)} av centrum är grön, genomsläpplig mark (2026: ${pct(d0.greenShare)}).`,
      `Open channels down the middle of the street lead the rain to rain gardens and flood meadows. ${pct(d.greenShare)} of the centre is green, permeable ground (2026: ${pct(d0.greenShare)}).`)},
  // Over the shops and flats along Storgatan (roofs up to 18 m).
  {id:'tak',color:'#e0a92b',weight:.9,v:v=>v.roofCover,anchor:{x:520,y:22,z:290},
    title:()=>t('Solceller och gröna tak','Solar panels and green roofs'),
    show:(d,d0,v,v0)=>({value:v.roofCover,from:v0.roofCover,fmt:pct,unit:t('av taken','of the roofs')}),
    note:(d,d0)=>t(`Solel: ${Math.round(d.solarMW)} MW (2026: ${Math.round(d0.solarMW)} MW), och gröna torvtak håller kvar regnet. ${pct(d.localOwned)} av elen som görs i kommunen ägs av bygden.`,
      `Solar power: ${Math.round(d.solarMW)} MW (2026: ${Math.round(d0.solarMW)} MW), and green turf roofs hold back the rain. ${pct(d.localOwned)} of the electricity made in the municipality is owned locally.`)},
  // The car parks: vegetable beds and fruit trees, and greenhouses on some of them.
  {id:'matpark',color:'#7aa83a',weight:1.1,v:v=>v.parking,anchor:'farmBeds',
    title:v=>(v.greenhouses??0)>.5?t('Parkeringarna blir matparker och växthus','The car parks become food parks and greenhouses'):t('Parkeringarna blir matparker','The car parks become food parks'),
    show:(d,d0,v)=>({value:Math.min(1,v.parking),from:0,fmt:pct,unit:t('av parkeringarna','of the car parks')}),
    note:(d,d0)=>t(`${pct(d.foodRegional)} av maten kommer från länet (2026: uppskattningsvis ${pct(d0.foodRegional)}).`,`${pct(d.foodRegional)} of the food comes from the county (2026: an estimated ${pct(d0.foodRegional)}).`)},
  // New houses of two to four storeys (config.js housingFloors) on the car parks by Storgatan, where Rättvik
  // grows beyond its projection or builds homes for the young and the old (model.js housing).
  {id:'tra',color:'#b07a45',weight:1.2,v:v=>v.housing,anchor:'blocks',
    title:()=>t('Nya hus i trä','New timber houses'),
    show:(d,d0)=>({value:d.pop,from:d0.pop,fmt:fmtOf('pop'),unit:t('invånare i kommunen','inhabitants in the municipality')}),
    note:(d,d0)=>t(`Två till fyra våningar i trä där bilarna stod – hyresrätter och generationsboenden för unga, äldre och nyinflyttade. ${Math.round(Math.abs(d.netMigration))} fler flyttar ${d.netMigration>=0?'in än ut':'ut än in'} om året (2026: ${Math.round(d0.netMigration)}).`,
      `Two to four storeys of timber where the cars stood – rented flats and generation homes for the young, the old and newcomers. ${Math.round(Math.abs(d.netMigration))} more people move ${d.netMigration>=0?'in than out':'out than in'} each year (2026: ${Math.round(d0.netMigration)}).`)},
  {id:'matskog',color:'#7aa83a',weight:.8,v:v=>v.foodForest,anchor:'fruit',
    title:()=>t('Bär och frukt i parkerna','Berries and fruit in the parks'),
    show:(d,d0)=>({value:d.foodRegional,from:d0.foodRegional,fmt:pct,unit:t('av maten kommer från länet','of the food comes from the county')}),
    note:()=>t('Bärbuskar och fruktträd i parkerna och på skolgårdarna, under tallarna där tallheden en gång stod.','Berry bushes and fruit trees in the parks and school yards, under the pines where the pine heath once stood.')},
  // Torget between the station and Storgatan (its stalls and tables also come to Lokstallarna's yard): the
  // stalls follow the food and the visitors (vision.market), the long tables the generation houses, the
  // villages' voice and care close by (vision.community).
  {id:'torg',color:'#d0614e',weight:.8,v:v=>Math.max(v.market-.15,v.community-.08)*1.3,anchor:{x:405,y:6,z:71},
    title:v=>v.community-.08>.1?(v.market-.15>.1?t('Torghandel och långbord','Market stalls and long tables'):t('Långbord på torget','Long tables in the square')):t('Torghandel','Market stalls'),
    show:(d,d0,v)=>v.community-.08>.1?{value:d.lowParticipation,from:d0.lowParticipation,fmt:pct,unit:t('har lågt socialt deltagande','have low social participation')}
      :{value:d.foodRegional,from:d0.foodRegional,fmt:pct,unit:t('av maten kommer från länet','of the food comes from the county')},
    note:(d,d0,v)=>t(`${(v?.community??0)-.08>.1?'Långbord där grannar äter tillsammans, och torghandel med mat från bygden.':'Torghandel med mat från bygden och för besökarna.'} ${pct(d.elderLonely)} av de äldre med hemtjänst besväras av ensamhet (2026: ${pct(d0.elderLonely)}).`,
      `${(v?.community??0)-.08>.1?'Long tables where neighbours eat together, and stalls with food from the countryside.':'Stalls with food from the countryside and for the visitors.'} ${pct(d.elderLonely)} of the elderly with home care are troubled by loneliness (2026: ${pct(d0.elderLonely)}).`)},
  // The summer boat buses from Långbryggan's landing, towards Tällberg and Leksand and towards Vikarbyn,
  // Sollerön and Mora (config.js boats.lines, scaled by model.js boatLines): counted as the boats drawn on
  // each line (none until boatLines reaches a quarter).
  {id:'batar',color:'#3a7ca5',weight:.8,v:v=>Math.round(2*Math.min(1,v.boatLines??0))/2,anchor:{x:-350,y:3,z:525},
    title:()=>t('Båtbussar till byarna runt Siljan','Boat buses to the villages round Lake Siljan'),
    show:(d,d0)=>({value:d.boatVillages,from:d0.boatVillages,fmt:n0,unit:t('byar med sommarbåt från Långbryggan','villages with a summer boat from Långbryggan')}),
    note:d=>t(`Om somrarna går eldrivna båtbussar mot Tällberg och Leksand och mot Vikarbyn, Sollerön och Mora, med besökare och sommarboende – som ångbåtarna en gång. ${pct(d.boatElectric)} av båttrafiken på Siljan går på el.`,
      `In summer electric boat buses run towards Tällberg and Leksand and towards Vikarbyn, Sollerön and Mora, with visitors and summer residents – as the steamboats once did. ${pct(d.boatElectric)} of boat traffic on Lake Siljan is electric.`)},
  // The small tour and hire boats round Rättviken (config.js boats.loops; vision.boats: more with the
  // visitors' plan and the boat lines).
  {id:'smabatar',color:'#3a7ca5',weight:.45,v:v=>(v.boats??0)-.12,anchor:{x:-380,y:1.5,z:320},
    title:()=>t('Fler småbåtar på Rättviken','More small boats on Rättviken'),
    show:(d,d0)=>({value:d.boatElectric,from:d0.boatElectric,fmt:pct,unit:t('av båttrafiken går på el','of boat traffic is electric')}),
    note:(d,d0)=>t(`Turbåtar och båtar att hyra för besökarna, som stannar ${fmtOf('guestNights')(d.guestNights)} nätter om året (2026: ${fmtOf('guestNights')(d0.guestNights)}).`,
      `Tour boats and boats for hire for the visitors, who stay ${fmtOf('guestNights')(d.guestNights)} nights a year (2026: ${fmtOf('guestNights')(d0.guestNights)}).`)},
  {id:'sjo',color:'#3a7ca5',weight:.5,v:v=>v.waterClarity-.5*v.bloom,anchor:{x:-350,y:.5,z:-50},
    title:(v,v0)=>v.waterClarity-.5*v.bloom>=v0.waterClarity-.5*v0.bloom?t('Klarare vatten i Siljan','Clearer water in Lake Siljan'):t('Brunare vatten i Siljan','Browner water in Lake Siljan'),
    show:(d,d0)=>({value:d.waters,from:d0.waters,fmt:fmtOf('waters'),unit:t('Siljans hälsa, 1 = god status','Lake Siljan\'s health, 1 = good status')}),
    // (Restored shores and free passage clear it a little; heavier rain browns it – model.js waterClarity.)
    note:(d,d0)=>t(`Öringen når ${pct(d.troutAccess)} av sina forna lek- och uppväxtområden (2026: ${pct(d0.troutAccess)}). Sjön är näringsfattig och utan algblomning.`,
      `The trout can reach ${pct(d.troutAccess)} of its former spawning and nursery grounds (2026: ${pct(d0.troutAccess)}). The lake is low in nutrients and free of algal blooms.`)},
  // The shuttles on the streets between the station and the villages (vision.pods: the villages' buses, more
  // of them with welfare AI), on Järnvägsgatan in front of the station.
  {id:'skyttlar',color:'#3f8fc2',weight:.5,v:v=>v.pods??0,anchor:{x:330,y:5,z:95},
    title:()=>t('Skyttlar till byarna','Shuttles to the villages'),
    show:(d,d0)=>({value:d.transitGood,from:d0.transitGood,fmt:pct,unit:t('tycker att kollektivtrafiken fungerar i vardagen','think public transport works for everyday trips')}),
    note:(d,d0)=>t(`Små skyttlar kör mellan stationen och byarna. ${pct(d.transitShare)} av resorna görs med buss och tåg (2026: uppskattningsvis ${pct(d0.transitShare)}).`,
      `Small shuttles run between the station and the villages. ${pct(d.transitShare)} of trips are made by bus and train (2026: an estimated ${pct(d0.transitShare)}).`)},
  // On Riksvägen, road 70, where it passes the start of Storgatan.
  {id:'bilar',color:'#3f8fc2',weight:.6,v:v=>1-v.cars,anchor:{x:412,y:5,z:215},
    title:(v,v0)=>v.cars<=v0.cars?t('Färre bilar på gatorna','Fewer cars on the streets'):t('Fler bilar på gatorna','More cars on the streets'),
    show:(d,d0)=>({value:d.carShare,from:d0.carShare,fmt:pct,unit:t('av resorna görs med bil','of trips are made by car')}),
    note:(d,d0)=>t(`Det finns ${Math.round(d.carsPer1000??0)} bilar per 1 000 invånare (2026: ${Math.round(d0.carsPer1000??0)}).`,`There are ${Math.round(d.carsPer1000??0)} cars per 1,000 inhabitants (2026: ${Math.round(d0.carsPer1000??0)}).`)},
  // Today's course tells its story too: an older town, electric cars and drier summers.
  {id:'folk',color:'#d0614e',weight:.45,v:v=>(v.people??1)-1+3*((v.old??BASE.share65)-BASE.share65),anchor:'crowd',
    title:(v,v0)=>(v.people??1)>(v0.people??1)+.04?t('Fler och äldre rättvikare','More people in Rättvik, and older'):t('Ett äldre Rättvik','An older Rättvik'),
    show:(d,d0)=>({value:d.share65,from:d0.share65,fmt:pct,unit:t('är 65 år eller äldre','are 65 or older')}),
    note:(d,d0)=>t(`Kommunen har ${fmtOf('pop')(d.pop)} invånare (2026: ${fmtOf('pop')(d0.pop)}), och ${pct(d.share80)} är över 80. ${pct(d.youthLeave)} av de unga tror att de kommer att flytta härifrån (2026: ${pct(d0.youthLeave)}).`,
      `The municipality has ${fmtOf('pop')(d.pop)} residents (2026: ${fmtOf('pop')(d0.pop)}), and ${pct(d.share80)} are over 80. ${pct(d.youthLeave)} of young people think they will move away (2026: ${pct(d0.youthLeave)}).`)},
  {id:'elbilar',color:'#3f8fc2',weight:.22,v:v=>v.ev??0,anchor:'cars',
    title:()=>t('Elbilarna tar över','Electric cars take over'),
    show:(d,d0)=>({value:d.evShare,from:d0.evShare,fmt:pct,unit:t('av bilarna går på el','of cars are electric')}),
    note:d=>t(`Tystare i låg fart, men däcken hörs. Bilen används för ${pct(d.carShare)} av resorna.`,`Quieter at low speed, though the tyres are still heard. The car is used for ${pct(d.carShare)} of trips.`)},
  // The big green at Prästskogen, between the health centre and Nyhedsskolan.
  {id:'somrar',color:'#c9a227',weight:.8,v:v=>v.dry??0,anchor:{x:422,y:6,z:-430},
    title:v=>(v.dry??0)>.25?t('Bruna somrar','Brown summers'):t('Torrare somrar','Drier summers'),
    show:(d,d0)=>({value:d.restrictions,from:d0.restrictions,fmt:pct,unit:t('av somrarna har bevattningsförbud','of summers have a watering ban')}),
    note:(d,d0)=>d.waterMargin<0?t(`Ett torrår räcker inte vattnet: marginalen är ${fmtOf('waterMargin')(d.waterMargin)} (2026: ${fmtOf('waterMargin')(d0.waterMargin)}).`,`In a dry year the water runs short: the margin is ${fmtOf('waterMargin')(d.waterMargin)} (2026: ${fmtOf('waterMargin')(d0.waterMargin)}).`)
      :t(`Vattnet räcker även ett torrår: marginalen är ${fmtOf('waterMargin')(d.waterMargin)} (2026: ${fmtOf('waterMargin')(d0.waterMargin)}).`,`The water lasts even a dry year: the margin is ${fmtOf('waterMargin')(d.waterMargin)} (2026: ${fmtOf('waterMargin')(d0.waterMargin)}).`)},
  // The facades along Storgatan.
  {id:'fasader',color:'#7aa83a',weight:.5,v:v=>v.facadeGreen,anchor:{x:514,y:7,z:318},
    title:()=>t('Gröna fasader','Green facades'),
    show:(d,d0,v,v0)=>({value:v.facadeGreen,from:v0.facadeGreen,fmt:pct,unit:t('av husen har klätterväxter','of buildings carry climbing plants')}),
    note:(d,d0)=>t(`${pct(d.greenShare)} av centrum är grön mark (2026: ${pct(d0.greenShare)}).`,`${pct(d.greenShare)} of the centre is green ground (2026: ${pct(d0.greenShare)}).`)},
];
// How far a change has moved between two visions, weighted by how much it shows.
export const moved=(c,v,v0)=>c.weight*Math.abs(c.v(v)-c.v(v0));
// The changes worth showing between the visions of two years, the largest first.
export function ranked(v,v0,min=.06){
  return CHANGES.map(c=>({c,m:moved(c,v,v0)})).filter(o=>o.m>=min).sort((a,b)=>b.m-a.m);
}
// The callout for one change: 2026 against the year shown (a note may also read the vision, as a title does).
export function changeSpec(c,run,year,at){
  const i=Math.max(0,Math.min(run.years.length-1,Math.floor(year)-2026)),y=run.years[i],y0=run.years[0];
  const s=c.show(y.ind,y0.ind,y.vision,y0.vision);
  return {id:'chg-'+c.id,at,color:c.color,kicker:`2026 → ${Math.floor(year)}`,title:c.title(y.vision,y0.vision),value:s.value,from:s.from,fmt:s.fmt,unit:s.unit,
    fromText:`2026: ${s.fmt(s.from)}`,note:c.note(y.ind,y0.ind,y.vision,y0.vision),side:'auto'};
}
