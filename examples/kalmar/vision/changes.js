import { INDICATORS } from '@engine/data/indicators.js';
import { t, dec, pct } from '@engine/i18n.js';

// "What has changed?": the visible changes in the city, where each one shows and how to say it.
// Each reads one value of the vision (model.js visionOf, 0–1 unless noted) and is ranked by how far it
// has moved, weighted by how much it shows from the air. `anchor` names the things that appear with
// it – features.js layers and the timber blocks grow in their items' order, so the newly shown ones
// mark the spot (main.js engine.changeAt) – or gives a fixed place.
// show() gives the callout's figure: a model indicator where one says it best.
const fmtOf=k=>INDICATORS[k].fmt;
export const CHANGES=[
  {id:'gator',color:'#3f8fc2',weight:1.2,v:v=>Math.max(v.depave,v.verge??0),anchor:'trees',
    title:v=>v.depave>.12?t('Gatorna blir trädgårdar','The streets become gardens'):t('Träd och odling längs gatorna','Trees and beds along the streets'),
    show:(d,d0,v)=>v.depave>.12?{value:d.depave,from:0,fmt:pct,unit:t('av gatorna','of the streets')}:{value:d.canopy,from:d0.canopy,fmt:pct,unit:t('trädkronor i tätorten','tree canopy in the town')},
    note:(d,d0)=>t(`Bilen används för ${pct(d.carShare)} av resorna (2026: ${pct(d0.carShare)}).`,`The car is used for ${pct(d.carShare)} of trips (2026: ${pct(d0.carShare)}).`)},
  {id:'tak',color:'#e0a92b',weight:.9,v:v=>v.roofCover,anchor:{x:-60,y:22,z:-40},
    title:()=>t('Solceller och gröna tak','Solar panels and green roofs'),
    show:(d,d0,v,v0)=>({value:v.roofCover,from:v0.roofCover,fmt:pct,unit:t('av taken','of the roofs')}),
    note:(d,d0)=>t(`Solel: ${Math.round(d.solarMW)} MW (2026: ${Math.round(d0.solarMW)} MW).`,`Solar power: ${Math.round(d.solarMW)} MW (2026: ${Math.round(d0.solarMW)} MW).`)},
  {id:'matpark',color:'#7aa83a',weight:1.1,v:v=>v.parking,anchor:'farmBeds',
    title:()=>t('Parkeringarna blir matparker','The car parks become food parks'),
    show:(d,d0,v)=>({value:v.parking,from:0,fmt:pct,unit:t('av parkeringarna','of the car parks')}),
    note:d=>t(`Staden odlar ${pct(d.cityVeg)} av sin frukt och sina grönsaker.`,`The city grows ${pct(d.cityVeg)} of its own fruit and vegetables.`)},
  {id:'tra',color:'#b07a45',weight:1.2,v:v=>v.housing,anchor:'blocks',
    title:()=>t('Nya kvarter i trä','New timber neighbourhoods'),
    show:(d,d0)=>({value:d.pop,from:d0.pop,fmt:fmtOf('pop'),unit:t('invånare i kommunen','inhabitants in the municipality')}),
    note:()=>t('Fyra till sju våningar trä med odlade balkonger, där bilarna stod.','Four to seven storeys of timber with balconies full of plants, where the cars stood.')},
  {id:'torn',color:'#7aa83a',weight:1,v:v=>v.tower,anchor:'tower',
    title:()=>t('Odlingstornet vid Kalmar C','The Growing Tower by Kalmar C'),
    show:(d,d0)=>({value:d.cityVeg,from:d0.cityVeg,fmt:pct,unit:t('av frukt och grönt odlas i staden','of fruit and vegetables grown in the city')}),
    note:()=>t('Sexton våningar odling året runt.','Sixteen floors of growing all year round.')},
  {id:'matskog',color:'#7aa83a',weight:.8,v:v=>v.foodForest,anchor:'fruit',
    title:()=>t('Matskog i parkerna','Food forests in the parks'),
    show:(d,d0)=>({value:d.foodRegional,from:d0.foodRegional,fmt:pct,unit:t('av maten kommer från länet','of the food comes from the county')}),
    note:()=>t('Frukt- och nötträd och bärbuskar under de gamla träden.','Fruit and nut trees and berry bushes under the old trees.')},
  {id:'torg',color:'#d0614e',weight:.8,v:v=>Math.max(v.market-.15,v.community-.08)*1.3,anchor:{x:24,y:3,z:-8},
    title:()=>t('Torghandel och långbord','Market stalls and long tables'),
    show:(d,d0)=>({value:d.lowParticipation,from:d0.lowParticipation,fmt:pct,unit:t('har lågt socialt deltagande','have low social participation')}),
    note:d=>t(`${pct(d.cohousing)} bor i någon form av bogemenskap.`,`${pct(d.cohousing)} live in some form of co-housing.`)},
  {id:'vall',color:'#4a8c7a',weight:1.1,v:v=>(v.wall??0)/1.6,anchor:'wall',
    title:()=>t('Skyddsvallen','The flood wall'),
    show:d=>({value:d.protection,from:1.8,fmt:v=>dec(v,1),unit:t('meter över havet (RH 2000)','metres above sea level (RH 2000)')}),
    note:d=>t(`En 100-årsstorm når ${dec(d.level100,2)} m det här året.`,`A 100-year storm reaches ${dec(d.level100,2)} m this year.`)},
  {id:'flytande',color:'#4a8c7a',weight:.9,v:v=>Math.max(v.floatVillage??0,v.floating??0),anchor:'village',
    title:()=>t('Flytande kvarter i hamnen','A floating neighbourhood in the harbour'),
    show:(d,d0,v)=>({value:Math.round(12*Math.max(v.floatVillage??0,v.floating??0)),from:0,fmt:v=>String(Math.round(v)),unit:t('hus på pontoner','houses on pontoons')}),
    note:d=>t(`Havet står ${INDICATORS.seaRise.fmt(d.seaRise).replace('+','')} högre än 2026; husen stiger med det.`,`The sea is ${INDICATORS.seaRise.fmt(d.seaRise).replace('+','')} higher than in 2026; the houses rise with it.`)},
  {id:'musslor',color:'#3a7ca5',weight:.6,v:v=>v.mussels,anchor:'buoys',
    title:()=>t('Musselodlingar renar sundet','Mussel farms clean the sound'),
    show:(d,d0)=>({value:d.waters,from:d0.waters,fmt:fmtOf('waters'),unit:t('Kalmarsunds hälsa, 1 = god status','health of Kalmarsund, 1 = good status')}),
    note:d=>d.bloom>.5?t('Algblomning varje sommar ännu.','Algal blooms every summer still.'):t('Algblomningen har blivit ovanlig.','Algal blooms have become rare.')},
  {id:'vind',color:'#e0a92b',weight:.9,v:v=>v.wind,anchor:'turbines',
    title:()=>t('Havsvind i Kalmarsund','Offshore wind in Kalmarsund'),
    show:(d,d0)=>({value:d.windMW,from:d0.windMW,fmt:fmtOf('windMW'),unit:'MW'}),
    note:d=>t(`Lokal el: ${INDICATORS.localEnergy.fmt(d.localEnergy)} av behovet. Delägd av invånarna.`,`Local electricity: ${INDICATORS.localEnergy.fmt(d.localEnergy)} of demand. Co-owned by the residents.`)},
  {id:'hav',color:'#3a7ca5',weight:.5,v:v=>v.waterClarity-.5*v.bloom,anchor:{x:300,y:0,z:-380},
    title:(v,v0)=>v.waterClarity-.5*v.bloom>=v0.waterClarity-.5*v0.bloom?t('Klarare vatten i sundet','Clearer water in the sound'):t('Grumligare vatten i sundet','Murkier water in the sound'),
    show:(d,d0)=>({value:d.waters,from:d0.waters,fmt:fmtOf('waters'),unit:t('Kalmarsunds hälsa, 1 = god status','health of Kalmarsund, 1 = good status')}),
    note:d=>d.bloom>.5?t('Algblomning varje sommar.','Algal blooms every summer.'):t('Algblomning är sällsynt.','Algal blooms are rare.')},
  {id:'batar',color:'#3a7ca5',weight:.5,v:v=>Math.max(v.boats-.15,v.ferries)*1.2,anchor:{x:520,y:0,z:-200},
    title:()=>t('Båtar på el i sundet','Electric boats in the sound'),
    show:(d,d0)=>({value:d.boatElectric,from:d0.boatElectric,fmt:pct,unit:t('av båttrafiken går på el','of boat traffic is electric')}),
    note:()=>t('Bärplansfärjor till Öland och båtbussar runt ön.','Hydrofoil ferries to Öland and boat buses round the island.')},
  {id:'bro',color:'#3f8fc2',weight:1,v:v=>v.bridgeTram??0,anchor:{x:2258,y:52,z:-772},
    title:()=>t('Spårvagn över Ölandsbron','A tram across the Öland Bridge'),
    show:(d,d0)=>({value:d.bridgeSummer,from:d0.bridgeSummer,fmt:fmtOf('bridgeSummer'),unit:t('fordon på bron en sommardag','vehicles on the bridge on a summer day')}),
    note:()=>t('20 minuter med spårvagn från Kalmar C till Färjestaden, och en vindskyddad cykelbana över sundet.','20 minutes by tram from Kalmar C to Färjestaden, and a wind-sheltered cycle path across the sound.')},
  {id:'havsniva',color:'#4a8c7a',weight:.35,v:v=>v.seaRise/.6,anchor:{x:150,y:1,z:40},
    title:()=>t('Havet stiger','The sea rises'),
    show:d=>({value:d.seaRise,from:0,fmt:fmtOf('seaRise'),unit:t('jämfört med 2026','compared with 2026')}),
    note:d=>d.floodShare>0?t(`I en 100-årsstorm står ${pct(d.floodShare)} av Kvarnholmen under vatten.`,`In a 100-year storm ${pct(d.floodShare)} of Kvarnholmen is under water.`):t('En 100-årsstorm når inte in på gatorna.','A 100-year storm does not reach the streets.')},
  {id:'bilar',color:'#3f8fc2',weight:.6,v:v=>1-v.cars,anchor:{x:-100,y:2,z:2},
    title:(v,v0)=>v.cars<=v0.cars?t('Färre bilar på gatorna','Fewer cars on the streets'):t('Fler bilar på gatorna','More cars on the streets'),
    show:(d,d0)=>({value:d.carShare,from:d0.carShare,fmt:pct,unit:t('av resorna görs med bil','of trips are made by car')}),
    note:d=>t(`Det finns ${Math.round(d.carsPer1000??0)} bilar per 1 000 invånare.`,`There are ${Math.round(d.carsPer1000??0)} cars per 1,000 inhabitants.`)},
  // Today's course tells its story too: an older, larger town, electric cars and drier summers.
  {id:'folk',color:'#d0614e',weight:.45,v:v=>(v.people??1)-1+3*((v.old??.207)-.207),anchor:'crowd',
    title:(v,v0)=>(v.people??1)>(v0.people??1)+.04?t('Fler och äldre Kalmarbor','More people in Kalmar, and older'):t('En äldre stad','An older town'),
    show:(d,d0)=>({value:d.share65,from:d0.share65,fmt:pct,unit:t('är 65 år eller äldre','are 65 or older')}),
    note:(d,d0)=>t(`Kommunen har ${fmtOf('pop')(d.pop)} invånare (2026: ${fmtOf('pop')(d0.pop)}), och ${pct(d.share80)} är över 80.`,`The municipality has ${fmtOf('pop')(d.pop)} residents (2026: ${fmtOf('pop')(d0.pop)}), and ${pct(d.share80)} are over 80.`)},
  {id:'elbilar',color:'#3f8fc2',weight:.22,v:v=>v.ev??0,anchor:'cars',
    title:()=>t('Elbilarna tar över','Electric cars take over'),
    show:(d,d0)=>({value:d.evShare,from:d0.evShare,fmt:pct,unit:t('av bilarna går på el','of cars are electric')}),
    note:d=>t(`Tystare i låg fart, men däcken hörs. Bilen används för ${pct(d.carShare)} av resorna.`,`Quieter at low speed, though the tyres are still heard. The car is used for ${pct(d.carShare)} of trips.`)},
  {id:'somrar',color:'#c9a227',weight:.8,v:v=>v.dry??0,anchor:{x:-820,y:0,z:250},
    title:v=>(v.dry??0)>.25?t('Bruna somrar','Brown summers'):t('Torrare somrar','Drier summers'),
    show:(d,d0)=>({value:d.restrictions,from:d0.restrictions,fmt:pct,unit:t('av somrarna har bevattningsförbud','of summers have a watering ban')}),
    note:d=>d.waterMargin<0?t(`Ett torrår räcker inte vattnet: marginalen är ${fmtOf('waterMargin')(d.waterMargin)} (2026: 19 %).`,`In a dry year the water runs short: the margin is ${fmtOf('waterMargin')(d.waterMargin)} (2026: 19%).`)
      :t(`Vattnet räcker även ett torrår: marginalen är ${fmtOf('waterMargin')(d.waterMargin)} (2026: 19 %).`,`The water lasts even a dry year: the margin is ${fmtOf('waterMargin')(d.waterMargin)} (2026: 19%).`)},
  {id:'fasader',color:'#7aa83a',weight:.5,v:v=>v.facadeGreen,anchor:{x:-30,y:8,z:-30},
    title:()=>t('Gröna fasader','Green facades'),
    show:(d,d0,v,v0)=>({value:v.facadeGreen,from:v0.facadeGreen,fmt:pct,unit:t('av husen har klätterväxter','of buildings carry climbing plants')}),
    note:d=>t(`${pct(d.greenShare)} av stadskärnan är grön mark.`,`${pct(d.greenShare)} of the centre is green ground.`)},
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
