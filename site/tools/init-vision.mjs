// A first vision for a newly built place, to write on:
//   node tools/init-vision.mjs <slug> [--force]      (python3 sustainable.py vision <slug> init)
// Writes cities/<slug>/vision/ from what the pipeline and the research already know: config.js (names,
// latitude, the water's level, the camera over the model, the station and the protected landmarks from
// the map), model.js (BASE from Kolada and Sweden's records where they exist – the rest marked as
// assumptions to research), places.js (the map's landmarks, texts to write), the levers, indicators,
// visions and people in the engine's general words, and empty journey, family, events, vision text,
// changes and AR modules – the site runs at once, and README.md lists what to write.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from '../city.config.mjs';

const slug=process.argv[2],force=process.argv.includes('--force');
if(!slug){console.error('usage: node tools/init-vision.mjs <slug> [--force]');process.exit(1);}
const city=join(ROOT,'cities',slug),vision=join(city,'vision');
if(existsSync(join(vision,'config.js'))&&!force){console.error(`cities/${slug}/vision/config.js exists (use --force to start over)`);process.exit(1);}
const read=f=>JSON.parse(readFileSync(f,'utf8'));
const place=read(join(city,'place.json')),cj=existsSync(join(city,'city.json'))?read(join(city,'city.json')):{},map=read(join(city,'pack/map.json'));
mkdirSync(join(vision,'en'),{recursive:true});mkdirSync(join(vision,'research/deep'),{recursive:true});
const w=(f,s)=>{writeFileSync(join(vision,f),s);console.log('  wrote',f);};
const J=v=>JSON.stringify(v);
const name=place.name,gen=/[sxz]$/.test(name)?name:name+'s';
const kommunName=(place.display_name||'').split(',').map(s=>s.trim()).find(s=>/ kommun$/.test(s))||`${gen} kommun`;
const region=place.region||'';
const [bx0,bz0,bx1,bz1]=map.bounds||[-500,-500,500,500],half=Math.max(bx1-bx0,bz1-bz0)/2;
const lake=cj.terrain?.lake,waterY=cj.water_z??-1.2;
const lm=cj.landmarks||[];
const station=lm.find(l=>/station/i.test(l.kind)||/station/i.test(l.name));
const churches=lm.filter(l=>/church|cathedral|chapel/i.test(l.kind)).map(l=>({x:Math.round(l.x),z:Math.round(-l.y),r:Math.round(Math.sqrt(l.area||400)/1.6+8)}));
const dist=Math.round(half*1.05);

w('config.js',`// ${name}: names, where things are in the 3D model (metres, x east, z south, the centre of place.json at
// the origin: ${place.center[0]} N, ${place.center[1]} E) and what the site says about itself. Written by
// tools/init-vision.mjs – check every field; the Kalmar and Rättvik examples show what each one does.
export const CITY={
  slug:${J(slug)},
  sv:{name:${J(name)},genitive:${J(gen)},kommun:${J(kommunName)},kommunGenitive:${J(kommunName+'s')},region:${J(region)},country:'Sverige',
    centre:${J(gen+' centrum')},onCentre:${J('i '+gen+' centrum')},centreGenitive:${J(gen+' centrums')},tagline:'Ett sekel framåt – en hållbar vision',waters:'',
    model:${J(name)},modelOf:${J('en 3D-modell av '+name+' byggd ur OpenStreetMap')},rise:${J(lake!=null?'högvattnet står {m} m högre år 2126':'havet står {m} m högre år 2126')}},
  en:{name:${J(name)},genitive:${J(name+"'s")},kommun:${J(kommunName.replace(/s? kommun$/,'')+' Municipality')},kommunGenitive:${J(kommunName.replace(/s? kommun$/,'')+" Municipality's")},region:${J(region)},country:'Sweden',
    centre:${J('central '+name)},onCentre:${J('in central '+name)},centreGenitive:${J('central '+name+"'s")},tagline:'A century ahead – a sustainable vision',waters:'',
    model:${J(name)},modelOf:${J('a 3D model of '+name+' built from OpenStreetMap')},rise:${J(lake!=null?'the high water is {m} m higher by 2126':'the sea is {m} m higher by 2126')}},
  title:${J(name.toUpperCase()+' 2126')},
  url:${J(`./`)},
  meta:{pageTitle:${J(name+' 2126')},description:${J(`En forskningsförankrad framtidsvision för ett hållbart ${name} om hundra år. A research-based vision of a sustainable ${name} a hundred years from now.`)},
    ogTitle:${J(name+' 2126 – ett sekel framåt')},ogDescription:${J(`Välj ${gen} väg de kommande hundra åren. Choose ${name}'s path for the next hundred years.`)},ogImageAlt:${J(name+' år 2126.')}},
  hotDaysToday:15,   // TODO research: days above 25 °C a year today (SMHI)
  lat:${place.center[0]},lon:${place.center[1]},
  // The model's water surface (y) and the real level it stands for (m RH 2000)${lake!=null?' – the main water in the elevation model':''}.
  water:{y:${waterY},level:${lake!=null?lake:0},kind:${J(lake!=null?'lake':'sea')}},   // TODO: 'sea' or 'lake'
  camera:{position:[${Math.round(dist*.55)},${Math.round(dist*.62)},${Math.round(dist*.62)}],target:[0,0,0],home:{distance:${dist},polar:.9,azimuth:.7},bounds:{minX:${bx0},maxX:${bx1},minZ:${bz0},maxZ:${bz1}},maxDistance:${Math.round(half*2.2)}},
  planRect:{minX:${bx0-30},minZ:${bz0-30},maxX:${bx1+30},maxZ:${bz1+30}},
  heritage:${J(churches)},   // the map's churches; add other protected landmarks
  squares:[],   // TODO: the main square(s) {x,z,r}
  station:${station?`{x:${Math.round(station.x)},z:${Math.round(-station.y)}}`:'null'},
  floodWall:false,
  boats:{},   // TODO when the place has open water: ferries {a,b} and loops [[x,z]…] on the water
  hide:/^M_Container/,
  tintMask:true,
  materialAlias:{M_Ground_Ground:'M_Ground_Grass'},
  rideSkip:/^$/,
  alwaysPinned:[],
  credits:{
    about:{sv:'Stadsmodellen är byggd med sustainable-builder ur OpenStreetMap (kartdata © OpenStreetMap contributors, ODbL)${cj.terrain?.attribution?' och '+cj.terrain.attribution.replace(/^Höjddata: /,''):''}.',
      en:'The town model is built with sustainable-builder from OpenStreetMap (map data © OpenStreetMap contributors, ODbL)${cj.terrain?.attribution?' and '+cj.terrain.attribution.replace(/^Höjddata: /,''):''}.'},
    short:{sv:'Kartdata © OpenStreetMap-bidragsgivare',en:'Map data © OpenStreetMap contributors'},
  },
  film:null,
  sources:{sv:'SCB, Kolada och ${kommunName}',en:'Statistics Sweden, Kolada and ${kommunName.replace(/s? kommun$/,'')} Municipality'},
};
`);

// Starting values: Kolada's and Sweden's records where they exist; the rest Kalmar's, marked as assumptions.
const deep=join(vision,'research/deep/kolada.json'),kol=existsSync(deep)?Object.fromEntries(read(deep).indicators.map(r=>[r.id,r])):{};
const nat=Object.fromEntries(read(join(ROOT,'pipeline/research/national-se.json')).indicators.map(r=>[r.id,r]));
const v=(id,f=x=>x)=>kol[id]?f(kol[id].value):null;
const pct=x=>+(x/100).toFixed(3);
const lifeExp=kol.medellivslangd_kvinnor&&kol.medellivslangd_man?+((kol.medellivslangd_kvinnor.value+kol.medellivslangd_man.value)/2).toFixed(2):null;
const ghgParts=['vaxthusgaser_transporter_per_inv','vaxthusgaser_jordbruk_per_inv','vaxthusgaser_el_fjarrvarme_per_inv','vaxthusgaser_industri_per_inv'].map(id=>v(id));
const ghgTotal=v('vaxthusgaser_per_inv');
const other=ghgTotal!=null&&ghgParts.every(x=>x!=null)?+(ghgTotal-ghgParts.reduce((s,x)=>s+x,0)).toFixed(3):.577;
const B={pop:v('befolkning_total')??10000,share65:v('andel_65_plus',pct)??.21,share80:v('andel_80_plus',pct)??.06,share0_19:v('andel_0_19',pct)??.22,
  ghg:{transport:ghgParts[0]??1.4,agriculture:ghgParts[1]??.9,energy:ghgParts[2]??.04,industry:ghgParts[3]??.06,other},ghgCons:7.6,
  renewable:.6,solarMW:v('solceller_installerad_effekt')??5,windMW:v('vindkraft_installerad_effekt')??0,elUsePerCap:v('elanvandning_per_inv')??7,elLocalOther:v('elproduktion_kraftvarme')??0,
  carShare:.6,transitShare:.1,carsPer1000:500,evShare:v('elbilar_andel',pct)??.06,
  regen:v('ekologisk_akermark_andel',pct)??.1,diet:.35,foodRegional:.2,foodStockDays:7,
  waterNow:.6,waters:.5,bloom:.3,biodiversity:.35,protectedNature:v('skyddad_natur_total',pct)??.02,canopy:.25,greenShare:.3,
  lifeExp:lifeExp??83.5,selfHealth:v('sjalvskattad_god_halsa',pct)??.72,activity:v('fysiskt_aktiva',pct)??.66,lowParticipation:.3,loneliness:.06,distress:v('allvarlig_psykisk_pafrestning',pct)??.1,youthScreen:.87,
  trust:kol.avsaknad_tillit?+(1-kol.avsaknad_tillit.value/100).toFixed(3):.66,participation:.3,turnout:.84,gini:v('gini_disponibel_inkomst')??.27,childPoverty:.1,unsafe:v('otrygghet_kvall',pct)??.2,workHours:38,cohousing:.002,overcrowding:v('trangboddhet_norm2',pct)??.09,
  education:v('gymnasieexamen_4ar',pct)??.7,unemployment:v('arbetsloshet_20_64',pct)??.05,
  internet:.93,cash:.05,homePrepared:.43,waste:v('kommunalt_avfall_kg_per_inv')??400,recycling:v('materialatervinning_andel',pct)??.4,foodWaste:84};
const FACTS=Object.fromEntries(Object.entries({pop:'befolkning_total',share65:'andel_65_plus',share80:'andel_80_plus',share0_19:'andel_0_19',
  'ghg.transport':'vaxthusgaser_transporter_per_inv','ghg.agriculture':'vaxthusgaser_jordbruk_per_inv','ghg.energy':'vaxthusgaser_el_fjarrvarme_per_inv','ghg.industry':'vaxthusgaser_industri_per_inv',
  solarMW:'solceller_installerad_effekt',windMW:'vindkraft_installerad_effekt',elUsePerCap:'elanvandning_per_inv',elLocalOther:'elproduktion_kraftvarme',evShare:'elbilar_andel',regen:'ekologisk_akermark_andel',
  protectedNature:'skyddad_natur_total',lifeExp:'medellivslangd_kvinnor',selfHealth:'sjalvskattad_god_halsa',activity:'fysiskt_aktiva',distress:'allvarlig_psykisk_pafrestning',trust:'avsaknad_tillit',
  gini:'gini_disponibel_inkomst',unsafe:'otrygghet_kvall',overcrowding:'trangboddhet_norm2',education:'gymnasieexamen_4ar',unemployment:'arbetsloshet_20_64',waste:'kommunalt_avfall_kg_per_inv',recycling:'materialatervinning_andel'}).filter(([,id])=>kol[id]));
Object.assign(FACTS,Object.fromEntries(Object.entries({youthScreen:'unga_skarmtid_over_3h',internet:'internet_dagligen',cash:'kontant_senaste_kop',homePrepared:'hemberedskap_en_vecka',foodWaste:'livsmedelsavfall_per_person_sverige',
  workHours:'arbetstid_overenskommen',foodStockDays:'livsmedelsberedskap_planeringsmal_dagar',loneliness:'ensamhet_ofta_alltid_sverige'}).filter(([,id])=>nat[id])));
w('model.js',`// ${name}'s own numbers for the engine's model (site/src/model.js). Written by tools/init-vision.mjs from
// Kolada and Sweden's records (FACTS names each value's record); every value without a record is an
// assumption to research (TODO) – see the research-city skill and the Kalmar and Rättvik examples.
export const BASE=${JSON.stringify(B).replace(/"(\w+)":/g,'$1:')};
export const FACTS=${JSON.stringify(FACTS).replace(/"([\w.]+)":/g,(m,k)=>/\./.test(k)?m:`${k}:`)};
export const BASE_UNCERTAIN=['foodRegional','foodStockDays','waters','biodiversity','greenShare','cohousing'];
// TODO: calibrate growth on the official projection (attractMid = the model's attract in 2026), ageing on
// the projected 65+/80+ shares, wind and solar on the place's potential, rail on the fastest train to the
// capital, tourism on its guest nights (BASE.guestNights) – or leave rail/tourism out.
export const PARAMS={growth:.004,growthDecay:30};
export const FLOOD=null;   // TODO: a sea or lake that floods the streets – node tools/flood-map.mjs ${slug}
export const WATER={};     // TODO: the drinking water's dry-year margin and plans
export const WATERS={};    // TODO: the sea or lake's state (VISS)
export const LOCAL={};     // what only ${name} has (Kalmar's bridge, Rättvik's summer town)
`);
w('levers.js',`// ${name}'s words for the levers (the engine's general ones are used where this says nothing), its
// climate in the three worlds (TODO: SMHI's county scenarios – see Rättvik's levers.js) and which research
// each lever leans on.
export const LEVER_TEXT={};
export const WORLD_CLIMATE={};
export const LEVER_EVIDENCE={};
`);
w('indicators.js',`// ${name}'s names, notes and records for the indicators (the engine's are used where this says nothing).
export const INDICATORS={};
export const KEY_FIGURES=null;
`);
w('presets.js',`// ${name}'s visions (the engine adds today's course first). TODO: the research-based one first, written
// from the research; then two that contrast with it.
export const VISIONS=[
  {id:'forskningen',name:'Forskningens förslag',short:'Börja med gemenskap, beredskap och demokrati, bygg sedan om gatorna och energin.',
    schedule:[
      {from:2026,set:{demokrati:2,bogemenskap:2,analog:2,beredskap:2,forebyggande:1,regionalt:1,kost:2,stadsodling:1,kollektivt:1,sol:2,hav:1,bilfritt:1,arbetstid:1,anpassning:1,effektivitet:1,ai:1,kunskap:1}},
      {from:2036,set:{bilfritt:2,hav:2,regionalt:2,anpassning:2,forebyggande:2,demokrati:3,kunskap:2}},
      {from:2046,set:{vind:2,ai:2,arbetstid:2,kollektivt:2,effektivitet:2,forbindelser:2}},
      {from:2056,set:{stadsodling:2,bogemenskap:3,hav:3}},
      {from:2066,set:{regionalt:3,sol:3,anpassning:3}},
      {from:2076,set:{beredskap:3,kost:3,kollektivt:3}},
    ]},
  {id:'teknik',name:'Teknikstaden',short:'Allt på AI, automation och energi – men lite om gemenskap, demokrati och analoga reserver.',
    schedule:[{from:2026,set:{ai:3,sol:3,vind:3,kollektivt:3,effektivitet:2,anpassning:2,stadsodling:1,beredskap:1,kunskap:2,forbindelser:3}}]},
  {id:'byn',name:'Den analoga byn',short:'Gemenskap, odling och tid för varandra – men ingen AI och ingen storskalig energi.',
    schedule:[{from:2026,set:{analog:3,arbetstid:3,bogemenskap:3,stadsodling:3,regionalt:3,kost:3,demokrati:2,beredskap:2,bilfritt:2,kunskap:2,forbindelser:2}}]},
];
`);
const places=[...lm.map(l=>({id:String(l.name).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,'').slice(0,20),name:l.name,x:Math.round(l.x),z:Math.round(-l.y),kind:/church|chapel/.test(l.kind)?'kulturarv':/school/.test(l.tags?.amenity||'')?'kunskap':/station/.test(l.kind)?'rorlighet':'plats'}))]
  .filter((p,i,a)=>p.id&&a.findIndex(q=>q.id===p.id)===i);
w('places.js',`import { LANG, L } from '@engine/i18n.js';
// Named places in ${name}'s model (from the map's landmarks – add the square, the library, the health
// centre, the school, the shore …): now = what it is today (a sourced fact), future = what it becomes and
// the lever that brings it. TODO: write the texts from the research.
export const PLACES=${JSON.stringify(places.map(p=>({...p,now:p.name,future:''})),null,1).replace(/"(\w+)":/g,'$1:')};
if(LANG==='en')for(const p of PLACES){p.name=L(p.name);p.now=L(p.now);p.future=L(p.future);}
`);
w('people.js',`// The people of ${name} in the Sims layer: today's jobs, the levers' jobs, what they say. TODO: make them ${gen}.
export const jobsToday=['undersköterska','lärare','säljare','snickare','sjuksköterska','busschaufför','kock','lagerarbetare','frisör','elektriker'];
export const jobsFuture=[['stadsodling','stadsodlare'],['regionalt','andelsbonde'],['sol','energitekniker i kvarterets energigemenskap'],['effektivitet','reparatör på återbruket'],['bogemenskap','kvartersvärd i Generationshuset'],['demokrati','samordnare för medborgarrådet'],['ai','AI-granskare'],['beredskap','beredskapssamordnare'],['forebyggande','hälsocoach på Hälsotorget'],['analog','bibliotekarie i Det analoga huset']];
export const thoughts={sleep:['Zzz…'],home:['Lugn kväll hemma.'],screen:['Bara ett avsnitt till.'],work:['Mycket på jobbet idag.'],school:['Utedag med klassen idag.'],garden:['Odlingen är bästa terapin.'],
  meal:['Det smakar bättre när man äter tillsammans.'],market:['Torget lever igen.'],park:['Fåglarna är tillbaka.'],quay:['Vattnet glittrar idag.'],library:['Mobilen ligger kvar i hallen.'],care:['Generationshuset är som en stor familj.']};
`);
w('events.js','// TODO: the events that test the place (see examples/kalmar/vision/events.js and Rättvik\'s).\nexport const EVENTS=[];\n');
w('family.js',`import { t } from '@engine/i18n.js';
// TODO: a family over five generations in ${name} (see Rättvik's and Kalmar's family.js).
export const FAMILY=[];
export function lifespans(){return {};}
export function alive(m,year,spans){return year>=m.birth&&year<(spans[m.id]??0);}
export function familyText(){return '';}
export function familyEpilogue(){return t('Hösten 2126.','Autumn 2126.');}
export const FAMILY_INTRO={sv:'',en:''};
export const FAMILY_TITLE={sv:'Släkten',en:'The family'};
`);
w('decisions.js',`// TODO: the journey's dilemmas per decade (see the examples' decisions.js).
export const DECISIONS={};
export const JOURNEY_INTRO={sv:${J(`${kommunName} har ${Math.round(B.pop).toLocaleString('sv-SE')} invånare.`)},en:${J(`${kommunName.replace(/s? kommun$/,'')} Municipality has ${Math.round(B.pop).toLocaleString('en-GB')} inhabitants.`)}};
`);
w('vision-text.js','// TODO: the vision document, written from the model state (see the examples\' vision-text.js).\nexport function visionSections(){return [];}\n');
w('changes.js','// TODO: the visible changes and where they show (see the examples\' changes.js).\nexport const CHANGES=[];\nexport const moved=(c,v,v0)=>c.weight*Math.abs(c.v(v)-c.v(v0));\nexport function ranked(v,v0,min=.06){return CHANGES.map(c=>({c,m:moved(c,v,v0)})).filter(o=>o.m>=min).sort((a,b)=>b.m-a.m);}\nexport function changeSpec(){return null;}\n');
w('ar.js','// TODO: the AR spots (see the examples\' ar.js).\nexport const AR_SPOTS=[];\nexport function arSpec(spot){return spot;}\n');
w('en.js',`// English for ${name}'s own Swedish strings (keys are exact Swedish source strings).\nexport const EN={};\n`);
if(!existsSync(join(vision,'research/evidence.json')))w('research/evidence.json',JSON.stringify({evidence:{},themes:{},quotes:[],en:{evidence:{},themes:{},quotes:[]}})+'\n');
if(!existsSync(join(vision,'research/story.json')))w('research/story.json',JSON.stringify({kommun:{name:kommunName},kommun_vision:[],challenges:[],assets:[],en:{challenges:{},assets:{},kommun_vision:[]}},null,1)+'\n');
w('README.md',`# ${name} 2126 – the vision

Started by \`python3 sustainable.py vision ${slug} init\`. The site runs as it is; what makes it ${gen} is
still to write (the build-sustainable and research-city skills):

- [ ] research: \`research ${slug} kolada\`, the deep topics, \`research/story.json\`, \`research ${slug} merge\`
- [ ] config.js: names, water (sea or lake), squares, boats, credits; the camera from \`look\`
- [ ] model.js: the starting values without a record, PARAMS calibrated, FLOOD (\`node site/tools/flood-map.mjs ${slug}\`), WATER, WATERS, LOCAL
- [ ] levers.js, indicators.js, presets.js in ${gen} words; places.js texts
- [ ] family.js, decisions.js, vision-text.js, events.js, changes.js, ar.js, people.js; en.js
- [ ] \`python3 sustainable.py test ${slug}\` and \`research ${slug} check\`; \`look ${slug}\`
- [ ] film (optional): film.js, \`film-voices\`, \`film ${slug}\`
`);
// The ride's street addresses and, where there is water to flood from, the flood map.
const { execFileSync }=await import('node:child_process');
if(existsSync(join(city,'osm.json')))execFileSync(process.execPath,[join(import.meta.dirname,'addresses.mjs'),slug],{stdio:'inherit'});
if(lake!=null&&existsSync(join(city,'terrain.json')))execFileSync(process.execPath,[join(import.meta.dirname,'flood-map.mjs'),slug],{stdio:'inherit'});
console.log(`\ncities/${slug}/vision/ is ready to write on: README.md lists what is left.`);
