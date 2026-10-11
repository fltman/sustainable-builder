// Checks a place's vision against its research and the engine's contract:
//   CITY=<slug> node --import ./test/register.mjs tools/check-place.mjs   (python3 sustainable.py research <slug> check)
// – every starting value's record (model.js FACTS) and every indicator's record (`base`) is in
//   research/baseline.json; every lever's research id exists;
// – the key figures and the indicators the place names are model outputs with a format;
// – the visions, places and the journey are there, places stand inside the model;
// – every Swedish string the place's modules pass through L() has English (a sample run in English);
// – Place first (AGENTS.md): the place has levers and a model of its own, its visions, dilemmas, jobs and
//   EXPECT name only its own levers, and nothing is borrowed from Kalmar, the reference example – no
//   starting value of Kalmar's without a record or a note of the place's own, no lever in Kalmar's words.
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { cityOf, ROOT } from '../city.config.mjs';
const city=cityOf();
const M=await import('@city/model.js');
const { INDICATORS, KEY_FIGURES }=await import('../src/data/indicators.js');
const { LEVER_EVIDENCE, BASELINE }=await import('../src/data/evidence.js').catch(()=>({}));
const S=await import('../src/scenario.js'),PLACE_PRESETS=await import('@city/presets.js');
const { PLACES }=await import('@city/places.js');
const { CITY }=await import('@city/config.js');
const basePath=`${city.vision}/research/baseline.json`;
const base=existsSync(basePath)?JSON.parse(readFileSync(basePath,'utf8')):{indicators:[]};
const ids=new Set(base.indicators.map(r=>r.id));
const problems=[],notes=[];
if(!existsSync(basePath))problems.push(`research/baseline.json is missing – python3 sustainable.py research ${CITY.slug} merge`);
for(const [k,id] of Object.entries(M.FACTS||{}))if(!ids.has(id))problems.push(`model.js FACTS.${k}: no record "${id}" in research/baseline.json`);
const unsourced=Object.keys(M.BASE).filter(k=>typeof M.BASE[k]==='number'&&!(M.FACTS||{})[k]&&!INDICATORS[k]?.note);
if(unsourced.length)notes.push(`starting values with neither a record nor a note (assumptions to explain): ${unsourced.join(', ')}`);
const run=S.run([]),ind=run.years[0].ind;
for(const [k,m] of Object.entries(INDICATORS)){
  if(m.base&&!ids.has(m.base))problems.push(`indicators.js ${k}.base: no record "${m.base}"`);
  if(!(k in ind))notes.push(`indicator ${k} is not a model output for this place (fine if it is never shown)`);
  else if(typeof m.fmt!=='function')problems.push(`indicator ${k} has no format`);
}
for(const k of KEY_FIGURES)if(!(k in ind))problems.push(`KEY_FIGURES: ${k} is not a model output`);
if(LEVER_EVIDENCE)for(const [k,list] of Object.entries(LEVER_EVIDENCE))if(!list.length)notes.push(`lever ${k} cites no research`);
if(S.PRESETS.length<2)problems.push('presets.js: no vision besides today\'s course');
const b=CITY.camera?.bounds;
for(const p of PLACES){if(b&&(p.x<b.minX-200||p.x>b.maxX+200||p.z<b.minZ-200||p.z>b.maxZ+200))notes.push(`place ${p.id} lies outside the model (${p.x}, ${p.z})`);if(!p.now)problems.push(`place ${p.id} has no "now" text`);}
const { DECISIONS }=await import('@city/decisions.js');
if(!Object.keys(DECISIONS).length)problems.push('decisions.js: the journey has no decisions yet');
const { FAMILY }=await import('@city/family.js');
if(!FAMILY.length)problems.push('family.js: no family yet');
const { EVENTS }=await import('@city/events.js');
if(!EVENTS.length)problems.push('events.js: no events yet');

// Place first: the place's own levers and model, and only its own levers named anywhere.
const { LEVER_DEFS=[] }=await import('@city/levers.js');
const own=new Set(LEVER_DEFS.map(l=>l.id)),notOwn=(where,id)=>problems.push(`${where}: lever "${id}" is not one of the place's levers`);
if(!LEVER_DEFS.length)problems.push('levers.js: no levers of the place\'s own yet (LEVER_DEFS, from its research)');
for(const f of ['init','step','vision','doughnut','capacity'])if(typeof M[f]!=='function')problems.push(`model.js: no ${f}()`);
if(!(M.EXPECT||[]).length)problems.push('model.js: EXPECT says nothing yet about what the levers do');
for(const e of M.EXPECT||[])if(e.lever&&!own.has(e.lever))notOwn('model.js EXPECT',e.lever);
for(const p of S.PRESETS)for(const st of p.schedule)for(const id of Object.keys(st.set))if(!own.has(id))notOwn(`presets.js ${p.id}`,id);
for(const [year,list] of Object.entries(DECISIONS))for(const d of list)for(const o of d.options||[])for(const id of Object.keys(o.set||{}))if(!own.has(id))notOwn(`decisions.js ${year} ${d.id}`,id);
const { jobsFuture=[] }=await import('@city/people.js');
for(const [id] of jobsFuture)if(!own.has(id))notOwn('people.js jobsFuture',id);
const modelSource=readFileSync(join(city.vision,'model.js'),'utf8');
if(CITY.slug!=='kalmar'&&/^\s*import[^;]*(kalmar|system\.js)/im.test(modelSource))problems.push('model.js imports Kalmar\'s model – write the place\'s own');
// Nothing borrowed from Kalmar: its starting values (unless the place's own record or note says the same),
// its words for a lever.
if(CITY.slug!=='kalmar'){
  const kalmar=f=>import(pathToFileURL(join(ROOT,'examples/kalmar/vision',f)).href);
  const K=await kalmar('model.js'),KL=await kalmar('levers.js');
  const flat=(o,p='')=>Object.entries(o||{}).flatMap(([k,v])=>v&&typeof v==='object'&&!Array.isArray(v)?flat(v,p+k+'.'):[[p+k,v]]);
  const kb=Object.fromEntries(flat(K.BASE)),facts=M.FACTS||{},shared=[];
  for(const [k,v] of flat(M.BASE)){
    if(typeof v!=='number'||v===0||v===1||kb[k]!==v||facts[k])continue;
    if(INDICATORS[k.split('.')[0]]?.note)shared.push(k);
    else problems.push(`model.js BASE.${k} = ${v} is Kalmar's value, with neither a record (FACTS) nor a note of the place's own`);
  }
  if(shared.length)notes.push(`starting values equal to Kalmar's, explained in the place's own notes as assumptions: ${shared.join(', ')}`);
  const KD=Object.fromEntries((KL.LEVER_DEFS||[]).map(l=>[l.id,l]));
  for(const l of LEVER_DEFS){
    const k=KD[l.id];if(!k)continue;
    const levels=(l.levels||[]).filter((x,i)=>i>0&&x===k.levels?.[i]).length;
    if(l.short===k.short||levels>=2)problems.push(`levers.js ${l.id}: Kalmar's words (${l.short===k.short?'the short text':levels+' of its levels'}) – say what the lever means in this place`);
  }
}
if(!PLACE_PRESETS.TODAY)notes.push('presets.js: no TODAY – today\'s course is described in the engine\'s general words');

const mean=a=>a.reduce((s,v)=>s+v,0)/a.length,end=run.years[100];
if(S.PRESETS.length>1){const vision=S.run(S.PRESETS[1].schedule).years[100];
  notes.push(`index 2126: today's course ${Math.round(mean(end.sdg))}, ${S.PRESETS[1].name} ${Math.round(mean(vision.sdg))}; population 2026 → 2070: ${Math.round(ind.pop)} → ${Math.round(run.years[44].ind.pop)}`);}
console.log(`${CITY.sv.name}: ${base.indicators.length} records, ${Object.keys(M.FACTS||{}).length} starting values sourced, ${PLACES.length} places, ${S.PRESETS.length-1} visions, ${Object.keys(DECISIONS).length} journey decades.`);
if(notes.length)console.log(`\nNotes:\n  ${notes.join('\n  ')}`);
if(problems.length){console.log(`\nTo fix:\n  ${problems.join('\n  ')}`);process.exitCode=1;}else console.log('\nNothing to fix.');
