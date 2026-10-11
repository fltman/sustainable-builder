import { INDICATORS } from '@engine/data/indicators.js';
import { t, dec, pct } from '@engine/i18n.js';
import { BASE } from './model.js';

// "What has changed?": the visible changes in Rättvik, where each one shows and how to say it.
// Each reads one value of the vision (the engine's model.js visionOf, 0–1 unless noted) and is ranked by
// how far it has moved, weighted by how much it shows from the air. `anchor` names the things that appear
// with it – features.js layers and the timber blocks grow in their items' order, so the newly shown ones
// mark the spot (main.js engine.changeAt) – or gives a fixed place: model metres, x east and z south of
// the centre, y a few metres over the ground and roofs there (Lantmäteriet's heights in city.json; the 3D
// ground y = 0 stands for 163.38 m RH 2000).
// Rättvik has no flood wall, mussel lines, offshore wind or bridge (config.js), so none of those is here.
// Its new wind power would stand in the forests 35–50 km to the north-east, out of sight, and Siljan's
// rising 100-year level is no part of the vision: the AR layer and the figures tell those.
// show() gives the callout's figure: a model indicator where one says it best.
const fmtOf=k=>INDICATORS[k].fmt;
export const CHANGES=[
  {id:'gator',color:'#3f8fc2',weight:1.2,v:v=>Math.max(v.depave,v.verge??0),anchor:'trees',
    title:v=>v.depave>.12?t('Gatorna blir trädgårdar','The streets become gardens'):t('Träd och odling längs gatorna','Trees and beds along the streets'),
    show:(d,d0,v)=>v.depave>.12?{value:d.depave,from:0,fmt:pct,unit:t('av gatorna','of the streets')}:{value:d.canopy,from:d0.canopy,fmt:pct,unit:t('trädkronor i tätorten','tree canopy in the town')},
    note:(d,d0)=>t(`Bilen används för ${pct(d.carShare)} av resorna (2026: ${pct(d0.carShare)}).`,`The car is used for ${pct(d.carShare)} of trips (2026: ${pct(d0.carShare)}).`)},
  // Open channels down the middle of the converted streets take the cloudbursts (future.js draws them
  // only where a street has become a garden, so the converted streets' trees mark them).
  {id:'skyfall',color:'#4a8c7a',weight:.7,v:v=>Math.min(v.depave,v.canals??0),anchor:'trees',
    title:()=>t('Gatorna tar hand om skyfallen','The streets take the cloudbursts'),
    show:(d,d0)=>({value:d.greenShare,from:d0.greenShare,fmt:pct,unit:t('av centrum är grön, genomsläpplig mark','of the centre is green, permeable ground')}),
    note:()=>t('Öppna diken mitt i gatan leder regnet till regnbäddar och översvämningsängar. Ovädret Hans skadade omkring 150 hus i kommunen 2023.','Open channels down the middle of the street lead the rain to rain gardens and flood meadows. Storm Hans damaged some 150 houses in the municipality in 2023.')},
  // Over the shops and flats along Storgatan (roofs up to 18 m).
  {id:'tak',color:'#e0a92b',weight:.9,v:v=>v.roofCover,anchor:{x:520,y:22,z:290},
    title:()=>t('Solceller och gröna tak','Solar panels and green roofs'),
    show:(d,d0,v,v0)=>({value:v.roofCover,from:v0.roofCover,fmt:pct,unit:t('av taken','of the roofs')}),
    note:(d,d0)=>t(`Solel: ${Math.round(d.solarMW)} MW (2026: ${Math.round(d0.solarMW)} MW).`,`Solar power: ${Math.round(d.solarMW)} MW (2026: ${Math.round(d0.solarMW)} MW).`)},
  {id:'matpark',color:'#7aa83a',weight:1.1,v:v=>v.parking,anchor:'farmBeds',
    title:()=>t('Parkeringarna blir matparker','The car parks become food parks'),
    show:(d,d0,v)=>({value:Math.min(1,v.parking),from:0,fmt:pct,unit:t('av parkeringarna','of the car parks')}),
    note:d=>t(`Orten odlar ${pct(d.cityVeg)} av sin frukt och sina grönsaker.`,`The town grows ${pct(d.cityVeg)} of its own fruit and vegetables.`)},
  {id:'tra',color:'#b07a45',weight:1.2,v:v=>v.housing,anchor:'blocks',
    title:()=>t('Nya kvarter i trä','New timber neighbourhoods'),
    show:(d,d0)=>({value:d.pop,from:d0.pop,fmt:fmtOf('pop'),unit:t('invånare i kommunen','inhabitants in the municipality')}),
    note:()=>t('Fyra till sju våningar trä med odlade balkonger där bilarna stod – hyresrätter för unga, äldre och nyinflyttade.','Four to seven storeys of timber with balconies full of plants where the cars stood – rented flats for the young, the old and newcomers.')},
  {id:'torn',color:'#7aa83a',weight:1,v:v=>v.tower,anchor:'tower',
    title:()=>t('Odlingstornet vid stationen','The Growing Tower by the station'),
    show:(d,d0)=>({value:d.cityVeg,from:d0.cityVeg,fmt:pct,unit:t('av frukt och grönt odlas i orten','of fruit and vegetables grown in the town')}),
    note:()=>t('Sexton våningar odling året runt, också under den långa vintern.','Sixteen floors growing all year round, through the long winter too.')},
  {id:'matskog',color:'#7aa83a',weight:.8,v:v=>v.foodForest,anchor:'fruit',
    title:()=>t('Matskog i parkerna','Food forests in the parks'),
    show:(d,d0)=>({value:d.foodRegional,from:d0.foodRegional,fmt:pct,unit:t('av maten kommer från länet','of the food comes from the county')}),
    note:()=>t('Bärbuskar, fruktträd och hassel under tallarna, där tallheden en gång stod.','Berry bushes, fruit trees and hazel under the pines, where the pine heath once stood.')},
  // Torget between the station and Storgatan (its stalls and tables also come to Lokstallarna's yard).
  {id:'torg',color:'#d0614e',weight:.8,v:v=>Math.max(v.market-.15,v.community-.08)*1.3,anchor:{x:405,y:6,z:71},
    title:()=>t('Torghandel och långbord','Market stalls and long tables'),
    show:(d,d0)=>({value:d.lowParticipation,from:d0.lowParticipation,fmt:pct,unit:t('har lågt socialt deltagande','have low social participation')}),
    note:d=>t(`Fäbodost, bröd och grönsaker från bygden. ${pct(d.cohousing)} bor i någon form av bogemenskap.`,`Summer-farm cheese, bread and vegetables from the countryside. ${pct(d.cohousing)} live in some form of co-housing.`)},
  // Rättvik meets the high water with room for it and raised shore paths, not a wall: the protection
  // rises from the lowest streets (164.0 m) by up to a metre, to Leksand's lowest building level by
  // Siljan, 165 m (vision.wall: the metres gained). It shows at the campsite, the lowest built ground.
  {id:'strand',color:'#4a8c7a',weight:.7,v:v=>v.wall??0,anchor:{x:-70,y:3,z:-223},
    title:()=>t('Mer plats för Siljan','More room for Lake Siljan'),
    show:(d,d0)=>({value:d.protection,from:d0.protection,fmt:v=>dec(v,1),unit:t('meter över havet (RH 2000)','metres above sea level (RH 2000)')}),
    note:d=>t(`Campingen flyttar upp och strandstråken höjs: så högt kan Siljan stiga innan gatorna får vatten. Hundraårsnivån är ${dec(d.level100,2)} m det här året.`,`The campsite moves up and the shore paths are raised: Lake Siljan can rise this high before the streets take water. The 100-year level is ${dec(d.level100,2)} m this year.`)},
  {id:'flytande',color:'#4a8c7a',weight:.9,v:v=>Math.max(v.floatVillage??0,v.floating??0),anchor:'village',
    title:()=>t('Flytande trädgårdar och hus i Rättviken','Floating gardens and homes in Rättviken'),
    show:(d,d0,v)=>{const n=Math.round(12*Math.max(v.floatVillage??0,v.floating??0));return {value:n,from:0,fmt:v=>String(Math.round(v)),unit:t('hus på pontoner',n===1?'house on pontoons':'houses on pontoons')};},
    note:()=>t('Husen och odlingsflottarna stiger och sjunker med Siljan – också när högvattnet kommer.','The houses and the garden rafts rise and fall with Lake Siljan – when the high water comes too.')},
  // On the boat buses' round in Rättviken, off Långbryggan.
  {id:'batar',color:'#3a7ca5',weight:.5,v:v=>Math.max(v.boats-.15,v.ferries)*1.2,anchor:{x:-300,y:1.5,z:380},
    title:()=>t('Båtar på el på Siljan','Electric boats on Lake Siljan'),
    show:(d,d0)=>({value:d.boatElectric,from:d0.boatElectric,fmt:pct,unit:t('av båttrafiken går på el','of boat traffic is electric')}),
    note:()=>t('Båtbussar från Långbryggan till Leksand, Mora och Siljansnäs.','Boat buses from Långbryggan to Leksand, Mora and Siljansnäs.')},
  {id:'sjo',color:'#3a7ca5',weight:.5,v:v=>v.waterClarity-.5*v.bloom,anchor:{x:-350,y:.5,z:-50},
    title:(v,v0)=>v.waterClarity-.5*v.bloom>=v0.waterClarity-.5*v0.bloom?t('Klarare vatten i Siljan','Clearer water in Lake Siljan'):t('Grumligare vatten i Siljan','Murkier water in Lake Siljan'),
    show:(d,d0)=>({value:d.waters,from:d0.waters,fmt:fmtOf('waters'),unit:t('Siljans hälsa, 1 = god status','Lake Siljan\'s health, 1 = good status')}),
    note:d=>d.bloom>.3?t('Algblomning syns nu de varmaste somrarna.','Algal blooms now appear in the warmest summers.')
      :d.waters>.65?t('Återställda stränder och fria vandringsvägar för harr och öring. Ingen algblomning.','Restored shores and free passage for grayling and trout. No algal blooms.')
      :t('Klart och näringsfattigt, men dammar och reglering håller tillbaka livet i sjön.','Clear and low in nutrients, but dams and regulation hold back the life in the lake.')},
  // On Riksvägen, road 70, where it passes the start of Storgatan.
  {id:'bilar',color:'#3f8fc2',weight:.6,v:v=>1-v.cars,anchor:{x:412,y:5,z:215},
    title:(v,v0)=>v.cars<=v0.cars?t('Färre bilar på gatorna','Fewer cars on the streets'):t('Fler bilar på gatorna','More cars on the streets'),
    show:(d,d0)=>({value:d.carShare,from:d0.carShare,fmt:pct,unit:t('av resorna görs med bil','of trips are made by car')}),
    note:(d,d0)=>t(`Det finns ${Math.round(d.carsPer1000??0)} bilar per 1 000 invånare (2026: ${Math.round(d0.carsPer1000??0)}).`,`There are ${Math.round(d.carsPer1000??0)} cars per 1,000 inhabitants (2026: ${Math.round(d0.carsPer1000??0)}).`)},
  // Today's course tells its story too: an older town, electric cars and drier summers.
  {id:'folk',color:'#d0614e',weight:.45,v:v=>(v.people??1)-1+3*((v.old??BASE.share65)-BASE.share65),anchor:'crowd',
    title:(v,v0)=>(v.people??1)>(v0.people??1)+.04?t('Fler och äldre rättvikare','More people in Rättvik, and older'):t('Ett äldre Rättvik','An older Rättvik'),
    show:(d,d0)=>({value:d.share65,from:d0.share65,fmt:pct,unit:t('är 65 år eller äldre','are 65 or older')}),
    note:(d,d0)=>t(`Kommunen har ${fmtOf('pop')(d.pop)} invånare (2026: ${fmtOf('pop')(d0.pop)}), och ${pct(d.share80)} är över 80.`,`The municipality has ${fmtOf('pop')(d.pop)} residents (2026: ${fmtOf('pop')(d0.pop)}), and ${pct(d.share80)} are over 80.`)},
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
    note:d=>t(`${pct(d.greenShare)} av centrum är grön mark.`,`${pct(d.greenShare)} of the centre is green ground.`)},
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
