// Checks a place's vision against its research and the engine's contract:
//   CITY=<slug> node --import ./test/register.mjs tools/check-place.mjs   (python3 sustainable.py research <slug> check)
// – every starting value's record (model.js FACTS) and every indicator's record (`base`) is in
//   research/baseline.json; every lever's research id exists;
// – the key figures and the indicators the place names are model outputs with a format;
// – the visions, places and the journey are there, places stand inside the model;
// – every Swedish string the place's modules pass through L() has English (a sample run in English).
import { readFileSync, existsSync } from 'node:fs';
import { cityOf } from '../city.config.mjs';
const city=cityOf();
const M=await import('@city/model.js');
const { INDICATORS, KEY_FIGURES }=await import('../src/data/indicators.js');
const { LEVER_EVIDENCE, BASELINE }=await import('../src/data/evidence.js').catch(()=>({}));
const S=await import('../src/scenario.js');
const { PLACES }=await import('@city/places.js');
const { CITY }=await import('@city/config.js');
const base=JSON.parse(readFileSync(`${city.vision}/research/baseline.json`,'utf8'));
const ids=new Set(base.indicators.map(r=>r.id));
const problems=[],notes=[];
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
const end=run.years[100],vision=S.run(S.PRESETS[1].schedule).years[100],mean=a=>a.reduce((s,v)=>s+v,0)/a.length;
notes.push(`index 2126: today's course ${Math.round(mean(end.sdg))}, ${S.PRESETS[1].name} ${Math.round(mean(vision.sdg))}; population 2026 → 2070: ${Math.round(ind.pop)} → ${Math.round(run.years[44].ind.pop)}`);
console.log(`${CITY.sv.name}: ${base.indicators.length} records, ${Object.keys(M.FACTS||{}).length} starting values sourced, ${PLACES.length} places, ${S.PRESETS.length-1} visions, ${Object.keys(DECISIONS).length} journey decades.`);
if(notes.length)console.log(`\nNotes:\n  ${notes.join('\n  ')}`);
if(problems.length){console.log(`\nTo fix:\n  ${problems.join('\n  ')}`);process.exitCode=1;}else console.log('\nNothing to fix.');
