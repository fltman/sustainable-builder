// Keeps the starting point current. Kolada publishes new figures for every municipality each year;
// every record in research/kalmar-baseline.json whose source is a Kolada API query is checked against
// the KPI's whole series for the same municipality:
//   node tools/update-baseline.mjs            reports what is newer than what the site has
//   node tools/update-baseline.mjs --write    updates those records (value, year, source URL) here and
//                                             in research/deep/, and logs them in research/baseline-updates.md
// Only records whose stored value is Kolada's own figure for the stored year are updated (a derived
// figure – a sum, a share, another unit – is reported for a look by hand). The model's constants in
// src/model.js (BASE) are never changed here: a new starting value moves 2026 in every plan, so the
// report lists the ones that follow a record, to update by hand and check with npm test.
import { readFileSync, writeFileSync, readdirSync, appendFileSync, existsSync } from 'node:fs';

const WRITE=process.argv.includes('--write');
const root=new URL('../research/',import.meta.url),deep=new URL('deep/',root);
const read=u=>JSON.parse(readFileSync(u,'utf8'));
const base=read(new URL('kalmar-baseline.json',root));
const KOLADA=/^https:\/\/api\.kolada\.se\/(v\d)\/data\/kpi\/([A-Z]\d{5})\/municipality\/(\d{4})\/year\/(\d{4})$/;

// Which model constant a record is the starting value of (src/data/indicators.js `base`, or a
// record's own note of what it replaces).
const indicators=readFileSync(new URL('../src/data/indicators.js',import.meta.url),'utf8');
const modelKeyOf=r=>{const m=indicators.match(new RegExp(`\\n  (\\w+):\\{[^\\n]*base:'${r.id}'`));return m?.[1]||(r.replaces?String(r.replaces).split(/[ (]/)[0]:null);};

async function series(version,kpi,mun){
  for(let i=0;i<3;i++){
    const res=await fetch(`https://api.kolada.se/${version}/data/kpi/${kpi}/municipality/${mun}`,{headers:{Accept:'application/json','User-Agent':'kalmar-2126/0.1 (baseline update)'}}).catch(()=>null);
    if(res?.ok)return (await res.json()).values||[];
    await new Promise(r=>setTimeout(r,2000*(i+1)));
  }
  throw new Error(`Kolada did not answer for ${kpi}`);
}
// The stored value is Kolada's figure for its year in one of the series' genders (T, K or M), allowing
// for the rounding it was written down with.
const near=(a,b)=>Math.abs(a-b)<=Math.max(.051,Math.abs(b)*.0005);
const fmt=v=>typeof v==='number'?v.toLocaleString('sv-SE',{maximumFractionDigits:2}):String(v);

const rows=[],updates=[],derived=[],failed=[];
const records=base.indicators.filter(r=>KOLADA.test(r.source?.url||''));
for(const r of records){
  const [,version,kpi,mun,year]=r.source.url.match(KOLADA);
  let data;try{data=await series(version,kpi,mun);}catch(e){failed.push(`${r.id}: ${e.message}`);continue;}
  const at=y=>data.find(p=>p.period===y)?.values||[];
  const gender=['T','K','M'].find(g=>{const v=at(+year).find(x=>x.gender===g)?.value;return v!=null&&near(r.value,v);});
  if(!gender){derived.push(r);continue;}
  const latest=data.filter(p=>p.values.some(x=>x.gender===gender&&x.value!=null)).sort((a,b)=>b.period-a.period)[0];
  if(!latest||latest.period<=+year)continue;
  const value=latest.values.find(x=>x.gender===gender).value;
  // Kolada keeps more decimals than the record did; keep the record's precision.
  const decimals=(String(r.value).split('.')[1]||'').length,rounded=+value.toFixed(Math.max(decimals,Number.isInteger(value)?0:1));
  updates.push({r,gender,from:{year:+year,value:r.value},to:{year:latest.period,value:rounded},url:r.source.url.replace(/\/year\/\d{4}$/,`/year/${latest.period}`),model:modelKeyOf(r)});
}

console.log(`${records.length} records from Kolada: ${updates.length} with newer figures, ${derived.length} derived (check by hand), ${failed.length} not answered.\n`);
for(const u of updates)console.log(`  ${u.r.id}: ${fmt(u.from.value)} (${u.from.year}) → ${fmt(u.to.value)} (${u.to.year}) ${u.r.unit}${u.model?`   ← model: ${u.model}`:''}`);
if(derived.length)console.log(`\nDerived from Kolada – not updated automatically:\n${derived.map(r=>`  ${r.id} (${r.source.url.split('/kpi/')[1]})`).join('\n')}`);
if(failed.length)console.log(`\nNo answer:\n  ${failed.join('\n  ')}`);
const model=updates.filter(u=>u.model);
if(model.length)console.log(`\nStarting values in the model (src/model.js BASE, or src/data/indicators.js) to look at by hand:\n${model.map(u=>`  ${u.model}: ${u.r.id} ${fmt(u.from.value)} → ${fmt(u.to.value)} ${u.r.unit}`).join('\n')}`);

if(WRITE&&updates.length){
  const today=new Date().toISOString().slice(0,10);
  const apply=rec=>{const u=updates.find(x=>x.r.id===rec.id);if(!u)return false;
    rec.previous={year:u.from.year,value:u.from.value};rec.value=u.to.value;rec.year=u.to.year;rec.source={...rec.source,url:u.url};rec.updated=today;return true;};
  for(const rec of base.indicators)apply(rec);
  writeFileSync(new URL('kalmar-baseline.json',root),JSON.stringify(base,null,1)+'\n');
  // The deep research files feed the baseline (tools/merge-research.mjs): update them too, so a new
  // merge keeps the new figures.
  for(const f of readdirSync(deep).filter(f=>f.endsWith('.json')&&f!=='en.json'&&!f.endsWith('.en.json'))){
    const doc=read(new URL(f,deep));let changed=false;for(const rec of doc.indicators)if(apply(rec))changed=true;
    if(changed)writeFileSync(new URL(f,deep),JSON.stringify(doc,null,2)+'\n');
  }
  const log=new URL('baseline-updates.md',root);
  if(!existsSync(log))writeFileSync(log,'# Updates to the starting point\n\nWritten by `node tools/update-baseline.mjs --write`. Notes (`note_sv`, and the English in `kalmar-baseline.en.json`) may still name the old year.\n');
  appendFileSync(log,`\n## ${today}\n\n${updates.map(u=>`- \`${u.r.id}\` ${u.r.name_sv}: ${fmt(u.from.value)} (${u.from.year}) → ${fmt(u.to.value)} (${u.to.year}) ${u.r.unit}${u.model?` – model: \`${u.model}\``:''}`).join('\n')}\n`);
  console.log(`\nUpdated ${updates.length} records; see research/baseline-updates.md. Then: npm test, and look at the model's starting values above.`);
}
