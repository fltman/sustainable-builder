import { LANG, L } from '../i18n.js';
import * as PLACE_LEVERS from '@city/levers.js';
const {LEVER_TEXT,WORLD_CLIMATE}=PLACE_LEVERS;
// The municipality's levers ("vägval"): the place's own (@city/levers.js LEVER_DEFS), what it can decide by
// its own research – the engine has none. Each has levels 0–3: 0 = today's course, 1 = steady,
// 2 = ambitious, 3 = radical. `cost` is the yearly demand on the city's shared capacity (money,
// people, attention) at full implementation; `tau` how many years implementation takes to settle.
// Texts are Swedish, translated with L().
// The themes the levers are grouped in: the place's own (@city/levers.js THEMES: Kalmar's "Teknik, AI & det
// analoga", Venice's "Lagunen & maten"), else these plain ones.
export const THEMES=PLACE_LEVERS.THEMES||[
  {id:'mat',name:'Mat & odling',color:'#7aa83a'},
  {id:'energi',name:'Energi & klimat',color:'#e0a92b'},
  {id:'stad',name:'Stad & rörlighet',color:'#3f8fc2'},
  {id:'gemenskap',name:'Gemenskap & demokrati',color:'#d0614e'},
  {id:'halsa',name:'Hälsa & omsorg',color:'#c9497a'},
  {id:'teknik',name:'Teknik & kunskap',color:'#7c5cc4'},
  {id:'resiliens',name:'Resiliens & beredskap',color:'#4a8c7a'},
];
export const LEVELS=['Dagens kurs','Stadig','Ambitiös','Radikal'];
// The place's levers: its own (@city/levers.js LEVER_DEFS), which its model acts on.
const DEFS=PLACE_LEVERS.LEVER_DEFS||[];
// The order of the levers in share links: it only ever grows (@city/levers.js LINK_ORDER), else the levers' own.
export const LINK_ORDER=PLACE_LEVERS.LINK_ORDER||DEFS.map(d=>d.id);
// A place can add levers of its own (@city/levers.js EXTRA_LEVERS: Venice's visitor management): same shape as
// DEFS; their effects are the place's own model (@city/model.js LOCAL), which reads them as I[id].
// A place can also leave out engine levers that mean nothing there (@city/levers.js HIDDEN_LEVERS: Venice has no
// cars to give up): they are not shown, and the model keeps them at today's course (I = 0).
const HIDDEN=new Set(PLACE_LEVERS.HIDDEN_LEVERS||[]);
export const ALL_LEVER_IDS=[...DEFS,...(PLACE_LEVERS.EXTRA_LEVERS||[])].map(d=>d.id);
export const LEVERS=[...DEFS,...(PLACE_LEVERS.EXTRA_LEVERS||[])].filter(d=>!HIDDEN.has(d.id)).map(d=>({...d,...LEVER_TEXT?.[d.id]}));
export const LEVER=Object.fromEntries(LEVERS.map(l=>[l.id,l]));
// What builds the city's capacity for change there, said when a plan asks too much ({sv,en,it}; none: nothing said).
export const CAPACITY_NOTE=PLACE_LEVERS.CAPACITY_NOTE||null;
// The three worlds around the place. gwl2100: global warming by 2100 in °C (IPCC AR6 best estimates),
// for the tourist season; shape: how fast the climate arrives (share of the 2126 level by year t): the low
// path levels off by mid-century, the middle one rises early, the fossil one keeps climbing. The place
// adds its own climate (@city/levers.js WORLD_CLIMATE): stress, the climate stress added after 2026 scaled
// by its county's warming by 2126 (SMHI); hotDays, days above 25 °C a year in 2071–2100; seaRise2126 and
// seaPow, how far its sea or lake's high water rises by 2126 and the curve it follows.
// Until the place gives its own climate the worlds only differ in stress; no hot days are said for it.
const CLIMATE_DEFAULT={ssp126:{stress:.15,seaRise2126:0,seaPow:.5},ssp245:{stress:.4,seaRise2126:0,seaPow:.8},ssp585:{stress:1,seaRise2126:0,seaPow:.9}};
export const WORLDS=[
  {id:'ssp126',name:'Världen samarbetar',short:'Global uppvärmning stannar kring 1,8 °C (SSP1-2.6)',gwl2100:1.8,shape:t=>1-Math.exp(-t/15)},
  {id:'ssp245',name:'Mellanvägen',short:'Omkring 2,7 °C till 2100 (SSP2-4.5)',gwl2100:2.7,shape:t=>Math.pow(Math.min(1,t/100),.45)},
  {id:'ssp585',name:'Fossil värld',short:'Över 4 °C till 2100 (SSP5-8.5)',gwl2100:4.4,shape:t=>Math.min(1,t/100)},
].map(w=>({...w,...CLIMATE_DEFAULT[w.id],...WORLD_CLIMATE?.[w.id]}));

// English and Italian: translate the static texts in place when the interface runs in either.
if(LANG!=='sv'){
  for(const th of THEMES)th.name=L(th.name);
  LEVELS.forEach((v,i)=>LEVELS[i]=L(v));
  for(const l of LEVERS){l.name=L(l.name);l.short=L(l.short);l.levels=l.levels.map(L);}
  for(const w of WORLDS){w.name=L(w.name);w.short=L(w.short);}
}
