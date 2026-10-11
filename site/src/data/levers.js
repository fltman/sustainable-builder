import { LANG, L } from '../i18n.js';
import { LEVER_TEXT, WORLD_CLIMATE } from '@city/levers.js';
// The municipality's levers ("vägval"). Each has levels 0–3: 0 = today's course, 1 = steady,
// 2 = ambitious, 3 = radical. `cost` is the yearly demand on the city's shared capacity (money,
// people, attention) at full implementation; `tau` how many years implementation takes to settle.
// Every effect in model.js cites the evidence id it leans on (data/evidence.js). The words here fit any
// place; a place says them its own way in @city/levers.js (LEVER_TEXT: Kalmar's "Levande Kalmarsund").
// Texts are Swedish, translated with L().
export const THEMES=[
  {id:'mat',name:'Mat & odling',color:'#7aa83a'},
  {id:'energi',name:'Energi & klimat',color:'#e0a92b'},
  {id:'stad',name:'Stad & rörlighet',color:'#3f8fc2'},
  {id:'gemenskap',name:'Gemenskap & demokrati',color:'#d0614e'},
  {id:'halsa',name:'Hälsa & omsorg',color:'#c9497a'},
  {id:'teknik',name:'Teknik, AI & det analoga',color:'#7c5cc4'},
  {id:'resiliens',name:'Resiliens & beredskap',color:'#4a8c7a'},
];
export const LEVELS=['Dagens kurs','Stadig','Ambitiös','Radikal'];
const DEFS=[
  {id:'stadsodling',theme:'mat',name:'Stadsodling',short:'Odling på gator, parkeringar, tak och i växthus',cost:1.2,tau:8,
    levels:['Koloniområden som idag','Odlingslådor i kvarteren','Parkeringar blir matparker, växthus på tak','Ätbar stad: matskog, akvaponik och odling på varje gata']},
  {id:'regionalt',theme:'mat',name:'Regional mat',short:'Bygden föder orten: regenerativt jordbruk, lokala förädlare',cost:1.4,tau:14,
    levels:['Export och import som idag','Lokal upphandling i skolor och omsorg','Regenerativt jordbruk, lokala mejerier och kvarnar','Matsuveränitet: regionala livsmedelsråd och 90 dagars lager']},
  {id:'kost',theme:'mat',name:'Kost & måltider',short:'Växtrika offentliga måltider, mindre matsvinn',cost:.5,tau:8,
    levels:['Som idag','Mer växtbaserat i offentliga kök','Planetary health diet i all offentlig mat','Ny matkultur: säsong, baljväxter, nolltolerans mot svinn']},
  {id:'hav',theme:'mat',name:'Levande vatten',short:'Våtmarker, fiskevård och mindre näring ut i sjöar och hav',cost:1.0,tau:18,
    levels:['Som idag','Våtmarker och strandzoner','Våtmarker, skyddade lekområden och fiskefria zoner','Vattnets återkomst: storskalig restaurering tillsammans med bönderna']},
  {id:'sol',theme:'energi',name:'Sol & energigemenskaper',short:'Solceller på tak, delad lagring, invånarägd energi',cost:1.0,tau:10,
    levels:['Enskilda solcellstak','Solceller på kommunens tak','Energigemenskaper i varje kvarter','Varje lämpligt tak producerar, orten delar lagring']},
  {id:'vind',theme:'energi',name:'Vindkraft',short:'Ny vindkraft, ägd tillsammans med invånarna',cost:1.3,tau:12,
    levels:['Befintliga verk','Några nya verk','En större park, delägd av invånarna','Energibygd: el och vätgas till andra regioner']},
  {id:'effektivitet',theme:'energi',name:'Renovering & cirkulärt',short:'Energieffektiva hus, återbruk, reparation och delning',cost:1.1,tau:15,
    levels:['Som idag','Energirenovering av allmännyttan','Cirkulärt byggande, lånebibliotek för saker','Nollavfall: allt repareras, delas eller återbrukas']},
  {id:'bilfritt',theme:'stad',name:'Bilfri stadskärna',short:'Gatorna avasfalteras till odling, träd och mötesplatser',cost:1.0,tau:10,
    levels:['Bilar som idag','Gångfartsgator i centrum','Bilfritt centrum, parkeringar blir parker','Bilfri ort: gatorna blir trädgårdar i hela tätorten']},
  {id:'kollektivt',theme:'stad',name:'Kollektivt & cykel',short:'Tätare bussar, cykelstråk och delade fordon',cost:1.4,tau:14,
    levels:['Bussar som idag','Täta busslinjer och cykelstråk','Snabbcykelvägar, anropsstyrda skyttlar och eldrivna bussar','Avgiftsfri kollektivtrafik med självkörande skyttlar till varje by']},
  {id:'forbindelser',theme:'stad',name:'Tåg och förbindelser',short:'Snabbare och tätare tåg till de stora städerna, i stället för bil och flyg',cost:1,tau:16,
    levels:['Som idag','Tätare regionaltåg och snabbussar','Snabbare tåg och bättre byten mot storstäderna','Direkttåg till huvudstaden och nattåg till Europa']},
  {id:'bogemenskap',theme:'gemenskap',name:'Bogemenskap',short:'Kollektivhus, flergenerationsboende, kvarterskök',cost:.9,tau:15,
    levels:['Som idag','Gemensamma lokaler i nya hus','Generationshus och kvarterskök i varje kvarter','Delat boende som norm: alla åldrar under samma tak']},
  {id:'demokrati',theme:'gemenskap',name:'Medborgarråd & barnbarnsombud',short:'Lottade medborgarråd, deltagande budget, ett ombud för framtida generationer',cost:.5,tau:6,
    levels:['Representativ demokrati som idag','Medborgardialoger','Lottade medborgarråd och deltagande budget','Barnbarnsombud med vetorätt i långsiktiga frågor']},
  {id:'arbetstid',theme:'gemenskap',name:'Tid för varandra',short:'Kortare arbetstid, tidsbank, medborgartjänst',cost:.9,tau:12,
    levels:['40 timmar som idag','Försök med 6-timmarsdag i kommunen','Fyradagarsvecka och tidsbank','30-timmarsvecka och ett år av medborgartjänst']},
  {id:'forebyggande',theme:'halsa',name:'Förebyggande hälsa',short:'Natur på recept, aktiv vardag, hälsotorg',cost:.8,tau:10,
    levels:['Vård när man blir sjuk','Fysisk aktivitet och natur på recept','Hälsotorg i varje stadsdel','Hälsa i allt: stadsplanering för rörelse och möten']},
  {id:'ai',theme:'teknik',name:'AI för välfärden',short:'AI i diagnostik, energinät, odling och klimatmodeller',cost:1.0,tau:8,
    levels:['Ingen samordning','Pilotprojekt i vården','Lokal, öppen AI i vård, energi och jordbruk','AI-accelererad välfärd med data i medborgarnas ägo']},
  {id:'analog',theme:'teknik',name:'Det analoga',short:'Skärmfri barndom, analoga reserver, rätt till ett analogt liv',cost:.5,tau:8,
    levels:['Digitalt först','Böcker och mobilfri skola','Skärmfri barndom till 12 år, kontanter och papper som reserv','Rätten till ett analogt liv: varje tjänst finns även utan skärm']},
  {id:'kunskap',theme:'teknik',name:'Kunskapsorten',short:'Skola, högskola och folkbildning tillsammans med invånarna',cost:.7,tau:10,
    levels:['Som idag','Lärcentrum och distansstudier i orten','Orten som levande labb: forskning tillsammans med invånarna','Livslångt lärande för alla och medborgarforskning i varje skola']},
  {id:'beredskap',theme:'resiliens',name:'Beredskap & vatten',short:'Lokala lager, vattensäkerhet, ö-drift av el',cost:1.1,tau:10,
    levels:['Hemberedskap som idag','Kommunala lager och vattenplan','En andra vattenkälla, 30 dagars lager, ö-drift','Självförsörjande i kris: mat, vatten och energi i 90 dagar']},
  {id:'anpassning',theme:'resiliens',name:'Klimatanpassning',short:'Skydd mot högvatten, skyfallsytor, svalka',cost:1.3,tau:16,
    levels:['Som idag','Skyfallsytor och höjda kajer','Skyddsvallar och svampstad','Plats för vattnet: upphöjda och flytande kvarter']},
];
export const LEVERS=DEFS.map(d=>({...d,...LEVER_TEXT?.[d.id]}));
export const LEVER=Object.fromEntries(LEVERS.map(l=>[l.id,l]));
// The three worlds around the place. gwl2100: global warming by 2100 in °C (IPCC AR6 best estimates),
// for the tourist season; shape: how fast the climate arrives (share of the 2126 level by year t): the low
// path levels off by mid-century, the middle one rises early, the fossil one keeps climbing. The place
// adds its own climate (@city/levers.js WORLD_CLIMATE): stress, the climate stress added after 2026 scaled
// by its county's warming by 2126 (SMHI); hotDays, days above 25 °C a year in 2071–2100; seaRise2126 and
// seaPow, how far its sea or lake's high water rises by 2126 and the curve it follows.
const CLIMATE_DEFAULT={ssp126:{stress:.15,hotDays:20,seaRise2126:0,seaPow:.5},ssp245:{stress:.4,hotDays:28,seaRise2126:0,seaPow:.8},ssp585:{stress:1,hotDays:45,seaRise2126:0,seaPow:.9}};
export const WORLDS=[
  {id:'ssp126',name:'Världen samarbetar',short:'Global uppvärmning stannar kring 1,8 °C (SSP1-2.6)',gwl2100:1.8,shape:t=>1-Math.exp(-t/15)},
  {id:'ssp245',name:'Mellanvägen',short:'Omkring 2,7 °C till 2100 (SSP2-4.5)',gwl2100:2.7,shape:t=>Math.pow(Math.min(1,t/100),.45)},
  {id:'ssp585',name:'Fossil värld',short:'Över 4 °C till 2100 (SSP5-8.5)',gwl2100:4.4,shape:t=>Math.min(1,t/100)},
].map(w=>({...w,...CLIMATE_DEFAULT[w.id],...WORLD_CLIMATE?.[w.id]}));

// English: translate the static texts in place when the interface runs in English.
if(LANG==='en'){
  for(const th of THEMES)th.name=L(th.name);
  LEVELS.forEach((v,i)=>LEVELS[i]=L(v));
  for(const l of LEVERS){l.name=L(l.name);l.short=L(l.short);l.levels=l.levels.map(L);}
  for(const w of WORLDS){w.name=L(w.name);w.short=L(w.short);}
}
