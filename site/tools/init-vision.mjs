// A first vision for a newly built place, to write on – empty wherever only the place's own research can fill it:
//   node tools/init-vision.mjs <slug> [--force]      (python3 sustainable.py vision <slug> init)
// Writes cities/<slug>/vision/ from what the pipeline and the place's own records already know: config.js
// (names, latitude, the water's level, the camera over the model, the station and the protected landmarks
// from the map), model.js (BASE: the place's own records – Kolada's key figures for a Swedish municipality –
// and a model that holds today's population until the place's own is written), indicators.js (the
// population), places.js (the map's landmarks), and empty levers, visions, people, journey, family, events,
// vision text, changes and AR. Nothing is taken from another place (AGENTS.md, Place first): the levers, the
// measures and the calculations are written from this place's research, and `research <slug> check` holds
// the place to that. The site starts at once, with no levers yet; README.md lists what to write.
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
// tools/init-vision.mjs – check every field; the examples (Kalmar, Rättvik, Venice) show what each one does.
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
  hotDaysToday:null,   // TODO research: days above 25 °C a year today (SMHI)
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

// Starting values: the place's own records only – Kolada's key figures for a Swedish municipality (python3
// sustainable.py research <slug> kolada, before this) – each with its record in FACTS. Nothing is borrowed
// from another place or filled in: a value the records lack stays out until the research gives it.
const deep=join(vision,'research/deep/kolada.json'),kol=existsSync(deep)?Object.fromEntries(read(deep).indicators.map(r=>[r.id,r])):{};
const pct=x=>+(x/100).toFixed(3);
const RECORDS={pop:['befolkning_total'],share65:['andel_65_plus',pct],share80:['andel_80_plus',pct],share0_19:['andel_0_19',pct],
  solarMW:['solceller_installerad_effekt'],windMW:['vindkraft_installerad_effekt'],elUsePerCap:['elanvandning_per_inv'],elLocalOther:['elproduktion_kraftvarme'],
  evShare:['elbilar_andel',pct],regen:['ekologisk_akermark_andel',pct],protectedNature:['skyddad_natur_total',pct],
  selfHealth:['sjalvskattad_god_halsa',pct],activity:['fysiskt_aktiva',pct],distress:['allvarlig_psykisk_pafrestning',pct],
  gini:['gini_disponibel_inkomst'],unsafe:['otrygghet_kvall',pct],overcrowding:['trangboddhet_norm2',pct],education:['gymnasieexamen_4ar',pct],
  unemployment:['arbetsloshet_20_64',pct],waste:['kommunalt_avfall_kg_per_inv'],recycling:['materialatervinning_andel',pct]};
const B={},FACTS={};
for(const [k,[id,f=x=>x]] of Object.entries(RECORDS))if(kol[id]){B[k]=f(kol[id].value);FACTS[k]=id;}
// Life expectancy: the mean of women's and men's (the women's record named); trust: one minus its lack.
if(kol.medellivslangd_kvinnor&&kol.medellivslangd_man){B.lifeExp=+((kol.medellivslangd_kvinnor.value+kol.medellivslangd_man.value)/2).toFixed(2);FACTS.lifeExp='medellivslangd_kvinnor';}
if(kol.avsaknad_tillit){B.trust=+(1-kol.avsaknad_tillit.value/100).toFixed(3);FACTS.trust='avsaknad_tillit';}
// Greenhouse gases per inhabitant by sector, where the records have them (the rest of the total: other).
const GHG={transport:'vaxthusgaser_transporter_per_inv',agriculture:'vaxthusgaser_jordbruk_per_inv',energy:'vaxthusgaser_el_fjarrvarme_per_inv',industry:'vaxthusgaser_industri_per_inv'};
const ghg={};for(const [k,id] of Object.entries(GHG))if(kol[id]){ghg[k]=kol[id].value;FACTS['ghg.'+k]=id;}
if(kol.vaxthusgaser_per_inv&&Object.keys(ghg).length===4)ghg.other=+(kol.vaxthusgaser_per_inv.value-Object.values(ghg).reduce((s,x)=>s+x,0)).toFixed(3);
if(Object.keys(ghg).length)B.ghg=ghg;
const popKnown=B.pop!=null;if(!popKnown)B.pop=0;
const obj=o=>JSON.stringify(o).replace(/"(\w+)":/g,'$1:');
w('model.js',`// ${gen} own model for the framework (site/src/model.js; the contract: AGENTS.md, "A place's own model").
// Written by tools/init-vision.mjs. BASE holds ${gen} own records only – FACTS names each one's record in
// research/baseline.json – and nothing from another place. Until ${gen} model is written there are no levers
// and the population stays as measured: write the levers (levers.js) and the measures (indicators.js) from
// ${gen} research, and here their effects year by year – sized by ${gen} own research where it exists and by
// cited general research where not (research/evidence.json), every assumption marked. The examples' models
// (Rättvik's, Venice's) show the form; their numbers are theirs.
export const BASE=${obj(B)};${popKnown?'':'   // TODO: the population (no record yet)'}
export const FACTS=${JSON.stringify(FACTS).replace(/"([\w]+)":/g,'$1:')};
export const BASE_UNCERTAIN=[];   // starting values that are the model's estimates rather than records (varied ±20 %)
export const PARAMS={};
export const FLOOD=null;          // TODO where ${gen} water can rise into its streets: node tools/flood-map.mjs ${slug}
// The framework's uncertainty – how fast and how far the levers reach, the climate's stress; add the model's own.
export const SYSTEM_SPREAD={pace:[.75,1.33],reach:[.8,1.2],stress:[.75,1.25]};
export const VARY={};
// The state in 2026.
export function init(B){return {pop:B.pop};}
// One year (c: s, I, before, B, V, W, year, t, held, stress …) → the year's measures, with the framework's
// capacity, demand and strain for the capacity bar. TODO: ${gen} levers acting on its measures; until then,
// the population as measured.
export function step({s,capacity,demand,strain}){return {pop:s.pop,capacity,demand,strain};}
// What the 3D city shows (TODO): only what can physically change in ${gen} streets, roofs and water.
export function vision(){return {};}
// Raworth's doughnut on ${gen} own measures (TODO): social shortfall and ecological overshoot, 0 = within.
export function doughnut(){return {social:{},ecological:{}};}
// The global goals from ${gen} own measures: {goal: [[measure, poor, goal], …]} (TODO; a goal without parts scores 50).
export const SDG_PARTS={};
// The shared capacity for change (TODO: from ${gen} economy, its people of working age, its trust).
export function capacity(){return 10;}
// What each lever must do – {lever, level, ind, delta, year} – checked by the tests (TODO).
export const EXPECT=[];
`);
w('levers.js',`// ${gen} own levers (LEVER_DEFS): what the place can actually decide, found in its research
// (research/story.json – challenges and assets – and research/deep/), in its own terms – none yet. Each:
// {id, theme, name, short, levels:[today's course, steady, ambitious, radical], cost, tau}; the model acts on
// them as I[id] (AGENTS.md, Place first). Also the themes they are grouped in (THEMES), ${gen} climate in the
// three worlds (WORLD_CLIMATE: {ssp126:{stress, hotDays, seaRise2126, seaPow}, ssp245, ssp585} from its
// region's scenarios) and the research each lever leans on (LEVER_EVIDENCE).
export const LEVER_DEFS=[];
export const WORLD_CLIMATE={};
export const LEVER_EVIDENCE={};
`);
w('indicators.js',`import { LOCALE } from '@engine/i18n.js';
// ${gen} own measures: display metadata for every measure its model returns (INDICATOR_DEFS: name, unit, fmt,
// better, theme, assumption), then their names, notes and records (INDICATORS: base = the record in
// research/baseline.json). TODO: the measures that matter in ${name} and can be counted there.
export const INDICATOR_DEFS={
  pop:{name:'Befolkning',unit:'invånare',fmt:v=>Math.round(v).toLocaleString(LOCALE),better:0,theme:'gemenskap'},
};
export const INDICATORS={${popKnown?"pop:{base:'befolkning_total'}":''}};
export const KEY_FIGURES=['pop'];
`);
w('presets.js',`// ${gen} visions for "Utforska" – none yet. The engine adds today's course first (TODAY: {short}, what
// today's course carries in ${gen} model). TODO: the research-based vision first, on ${gen} own levers; then two
// that contrast with it. A schedule is a list of {from:year, set:{lever:level}} steps, each building on the previous.
export const VISIONS=[];
`);
const places=[...lm.map(l=>({id:String(l.name).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,'').slice(0,20),name:l.name,x:Math.round(l.x),z:Math.round(-l.y),kind:/church|chapel/.test(l.kind)?'kulturarv':/school/.test(l.tags?.amenity||'')?'kunskap':/station/.test(l.kind)?'rorlighet':'plats'}))]
  .filter((p,i,a)=>p.id&&a.findIndex(q=>q.id===p.id)===i);
w('places.js',`import { LANG, L } from '@engine/i18n.js';
// Named places in ${gen} model (from the map's landmarks – add the square, the library, the health
// centre, the school, the shore …): now = what it is today (a sourced fact), future = what it becomes and
// the lever that brings it. TODO: write the texts from the research.
export const PLACES=${JSON.stringify(places.map(p=>({...p,now:p.name,future:''})),null,1).replace(/"(\w+)":/g,'$1:')};
if(LANG==='en')for(const p of PLACES){p.name=L(p.name);p.now=L(p.now);p.future=L(p.future);}
`);
w('people.js',`// The people of ${name} in the Sims layer. TODO from the research: what people work with today (jobsToday),
// the jobs ${gen} own levers bring ([[lever, job], …]) and what they say (thoughts, per activity).
export const jobsToday=[];
export const jobsFuture=[];
export const thoughts={sleep:['Zzz…'],home:['Lugn kväll hemma.'],work:['Mycket på jobbet idag.']};
`);
w('events.js',`// The events that test ${name} – TODO from the research: its own risks (high water, drought, heat, storms, a
// closing employer …), each resolve(ctx, r) reading the model's state; the examples' events.js show the form.
export const EVENTS=[];
`);
w('family.js',`import { t } from '@engine/i18n.js';
// TODO: a family over five generations in ${name} (the examples' family.js show the form).
export const FAMILY=[];
export function lifespans(){return {};}
export function alive(m,year,spans){return year>=m.birth&&year<(spans[m.id]??0);}
export function familyText(){return '';}
export function familyEpilogue(){return t('Hösten 2126.','Autumn 2126.');}
export const FAMILY_INTRO={sv:'',en:''};
export const FAMILY_TITLE={sv:'Släkten',en:'The family'};
`);
w('decisions.js',`// TODO: the journey's dilemmas per decade, on ${gen} own levers (the examples' decisions.js show the form).
export const DECISIONS={};
export const JOURNEY_INTRO=${popKnown?`{sv:${J(`${kommunName} har ${Math.round(B.pop).toLocaleString('sv-SE')} invånare.`)},en:${J(`${kommunName.replace(/s? kommun$/,'')} Municipality has ${Math.round(B.pop).toLocaleString('en-GB')} inhabitants.`)}}`:"{sv:'',en:''}"};
`);
w('vision-text.js','// TODO: the vision document, written from the model state (the examples\' vision-text.js show the form).\nexport function visionSections(){return [];}\n');
w('changes.js','// TODO: the visible changes and where they show (the examples\' changes.js show the form).\nexport const CHANGES=[];\nexport const moved=(c,v,v0)=>c.weight*Math.abs(c.v(v)-c.v(v0));\nexport function ranked(v,v0,min=.06){return CHANGES.map(c=>({c,m:moved(c,v,v0)})).filter(o=>o.m>=min).sort((a,b)=>b.m-a.m);}\nexport function changeSpec(){return null;}\n');
w('ar.js','// TODO: the AR spots (the examples\' ar.js show the form).\nexport const AR_SPOTS=[];\nexport function arSpec(spot){return spot;}\n');
w('en.js',`// English for ${gen} own Swedish strings (keys are exact Swedish source strings).\nexport const EN={};\n`);
if(!existsSync(join(vision,'research/evidence.json')))w('research/evidence.json',JSON.stringify({evidence:{},themes:{},quotes:[],en:{evidence:{},themes:{},quotes:[]}})+'\n');
if(!existsSync(join(vision,'research/story.json')))w('research/story.json',JSON.stringify({kommun:{name:kommunName},kommun_vision:[],challenges:[],assets:[],en:{challenges:{},assets:{},kommun_vision:[]}},null,1)+'\n');
w('README.md',`# ${name} 2126 – the vision

Started by \`python3 sustainable.py vision ${slug} init\`. The site starts as it is – the 3D town, ${gen}
own records and no levers yet. Everything that makes it a vision is written from ${gen} own conditions,
research and measured data (AGENTS.md, *Place first*; the build-sustainable and research-city skills):

- [ ] research: \`research ${slug} kolada\`, the deep topics, \`research/story.json\`, \`research ${slug} merge\`
- [ ] config.js: names, water (sea or lake), today's hot days, squares, boats, credits; the camera from \`look\`
- [ ] levers.js: what ${name} can decide, from its research (LEVER_DEFS, THEMES, WORLD_CLIMATE, LEVER_EVIDENCE)
- [ ] indicators.js: the measures that matter here and can be counted, with their records
- [ ] model.js: the starting values still missing (each with its record${popKnown?'':', the population first'}), init/step – each lever's
      effects, sized by local research or cited general research –, vision, doughnut, SDG_PARTS, capacity,
      EXPECT; FLOOD (\`node site/tools/flood-map.mjs ${slug}\`)
- [ ] presets.js (TODAY and the visions), places.js texts, people.js
- [ ] family.js, decisions.js, vision-text.js, events.js, changes.js, ar.js; en.js
- [ ] \`python3 sustainable.py research ${slug} check\` (it also flags what is borrowed from another place),
      \`python3 sustainable.py test ${slug}\`; \`look ${slug}\`
- [ ] film (optional): film.js, \`film-voices\`, \`film ${slug}\`
`);
// The records the place has so far (Kolada's, Sweden's) into research/baseline.json, so the site starts at once;
// then the ride's street addresses and, where there is water to flood from, the flood map.
const { execFileSync }=await import('node:child_process');
execFileSync(process.execPath,[join(import.meta.dirname,'merge-research.mjs'),slug],{stdio:'inherit'});
if(existsSync(join(city,'osm.json')))execFileSync(process.execPath,[join(import.meta.dirname,'addresses.mjs'),slug],{stdio:'inherit'});
if(lake!=null&&existsSync(join(city,'terrain.json')))execFileSync(process.execPath,[join(import.meta.dirname,'flood-map.mjs'),slug],{stdio:'inherit'});
console.log(`\ncities/${slug}/vision/ is ready to write on: README.md lists what is left.`);
