// Merges a place's deep research into the starting point the site reads:
//   node tools/merge-research.mjs <slug>        (python3 sustainable.py research <slug> merge)
// Reads cities/<slug>/vision/research/deep/<topic>.json (records in the baseline schema; English in
// <topic>.en.json) and research/story.json (challenges, assets, the municipality's own vision) and writes
// research/baseline.json and baseline.en.json. A record whose id comes again in a later topic replaces
// the earlier one (topics are read in name order; kolada.json first, so hand research wins). Running it
// again changes nothing. Every record must follow the schema – a value, a unit, a year, a source URL.
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from '../city.config.mjs';

const slug=process.argv[2];
if(!slug){console.error('usage: node tools/merge-research.mjs <slug>');process.exit(1);}
const vision=[join(ROOT,'cities',slug,'vision'),join(ROOT,'examples',slug,'vision')].find(d=>existsSync(join(d,'config.js')));
if(!vision){console.error(`No vision for ${slug}`);process.exit(1);}
const dir=join(vision,'research/deep'),read=f=>JSON.parse(readFileSync(f,'utf8'));
const DIRS=['context','lower_better','higher_better'],CONF=['high','medium','estimate'];
const topics=readdirSync(dir).filter(f=>f.endsWith('.json')&&!f.endsWith('.en.json')&&f!=='en.json')
  .sort((a,b)=>(a==='kolada.json'?-1:b==='kolada.json'?1:a.localeCompare(b)));
const records=new Map(),en={},problems=[];
// A Swedish place starts from the records that hold for all of Sweden (pipeline/research/national-se.json);
// its own research replaces them on the same id.
const placeFile=[join(ROOT,'cities',slug,'place.json')].find(existsSync);
if(placeFile&&read(placeFile).country_code==='se'){
  const nat=read(join(ROOT,'pipeline/research/national-se.json')),natEn=read(join(ROOT,'pipeline/research/national-se.en.json')).indicators;
  for(const r of nat.indicators){records.set(r.id,{...r,topic:'nationellt'});if(natEn[r.id])en[r.id]=natEn[r.id];}
}
for(const f of topics){
  const doc=read(join(dir,f)),topic=doc.topic||f.replace(/\.json$/,'');
  const enFile=join(dir,f.replace(/\.json$/,'.en.json')),enDoc=existsSync(enFile)?read(enFile).indicators||{}:{};
  for(const r of doc.indicators||[]){
    const bad=[typeof r.id!=='string'&&'id',typeof r.value!=='number'&&'value',!r.unit&&'unit',!r.year&&'year',!r.scope&&'scope',
      !DIRS.includes(r.direction)&&'direction',!CONF.includes(r.confidence)&&'confidence',!/^https?:\/\//.test(r.source?.url||'')&&'source.url',!r.name_sv&&'name_sv'].filter(Boolean);
    if(bad.length){problems.push(`${f}: ${r.id||'(no id)'} – ${bad.join(', ')}`);continue;}
    records.set(r.id,{...r,topic});
    if(enDoc[r.id])en[r.id]=enDoc[r.id];
  }
}
// A baseline this tool did not write (no `topics`, like the Kalmar example's) may hold records that are in
// no topic file: keep it unless --force.
const existing=join(vision,'research/baseline.json');
if(existsSync(existing)&&!process.argv.includes('--force')){
  const old=read(existing),lost=old.topics?[]:(old.indicators||[]).filter(r=>!records.has(r.id));
  if(lost.length){console.error(`research/baseline.json has ${lost.length} records that are in no topic file (e.g. ${lost.slice(0,3).map(r=>r.id).join(', ')}); not overwriting it. Use --force to replace it anyway.`);process.exit(1);}
}
const storyFile=join(vision,'research/story.json'),story=existsSync(storyFile)?read(storyFile):{};
const base={compiled:new Date().toISOString().slice(0,10),kommun:story.kommun||{},indicators:[...records.values()],
  challenges:story.challenges||[],assets:story.assets||[],kommun_vision:story.kommun_vision||[],topics:topics.map(f=>f.replace(/\.json$/,''))};
const baseEn={indicators:en,challenges:story.en?.challenges||{},assets:story.en?.assets||{},kommun_vision:story.en?.kommun_vision||[]};
writeFileSync(join(vision,'research/baseline.json'),JSON.stringify(base,null,1)+'\n');
writeFileSync(join(vision,'research/baseline.en.json'),JSON.stringify(baseEn,null,1)+'\n');
const missingEn=base.indicators.filter(r=>!en[r.id]).map(r=>r.id);
console.log(`${base.indicators.length} records from ${topics.length} topics → research/baseline.json`
  +`; ${base.challenges.length} challenges, ${base.assets.length} assets`+(missingEn.length?`; no English for ${missingEn.length}`:''));
if(problems.length){console.log(`\nLeft out (not in the schema):\n  ${problems.join('\n  ')}`);process.exitCode=1;}
