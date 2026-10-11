import research from '../../research/vision-research.json';
import researchEn from '../../research/vision-research.en.json';
import baseline from '@city/research/baseline.json';
import baselineEn from '@city/research/baseline.en.json';
import local from '@city/research/evidence.json';
import { LEVER_EVIDENCE as PLACE_EVIDENCE } from '@city/levers.js';
import { LANG } from '../i18n.js';
// The research behind the model, for any place (research/vision-research.json), and the place's own:
// its starting point (@city/research/baseline.json: sourced records, challenges and assets) and the
// claims about the place itself (@city/research/evidence.json, which may also give a general claim a
// local context).
const themes=research.themes;
const quotes=[...(research.quotes||[]),...(local.quotes||[])];
// In English (and Italian, until the research has Italian) the *_sv fields are overwritten with the
// translations (the interface reads those fields).
if(LANG!=='sv'){
  for(const th of themes){const e=researchEn.themes[th.id];if(e){th.title_sv=e.title;th.summary_sv=e.summary;}
    for(const ev of th.evidence){const x=researchEn.evidence[ev.id];if(x){ev.claim_sv=x.claim;if(x.context)ev.context_sv=x.context;}}}
  for(const [id,ev] of Object.entries(local.evidence||{})){const x=local.en?.evidence?.[id];if(x){ev.claim_sv=x.claim;if(x.context)ev.context_sv=x.context;}}
  const qen=[...(researchEn.quotes||[]).slice(0,(research.quotes||[]).length),...(local.en?.quotes||[])];
  quotes.forEach((q,i)=>{const x=qen[i];if(x){q.text_sv=x.text;q.who=x.who;}});
  for(const i of baseline.indicators){const x=baselineEn.indicators?.[i.id];if(x){i.name_sv=x.name;i.note_sv=x.note;if(x.unit)i.unit=x.unit;}}
  for(const k of ['challenges','assets'])for(const c of baseline[k]||[]){const x=baselineEn[k]?.[c.id];if(x){c.title_sv=x.title;c.text_sv=x.text;}}
  (baseline.kommun_vision||[]).forEach((v,i)=>{const x=baselineEn.kommun_vision?.[i];if(x){v.title_sv=x.title;v.text_sv=x.text;}});
}
export const EVIDENCE={...Object.fromEntries(themes.flatMap(t=>t.evidence.map(e=>[e.id,{...e,theme:t.id}]))),...local.evidence};
export const QUOTES=quotes;
export const BASELINE=Object.fromEntries(baseline.indicators.map(i=>[i.id,i]));
export const CHALLENGES=baseline.challenges||[];
export const ASSETS=baseline.assets||[];
export const KOMMUN_VISION=baseline.kommun_vision||[];
export const RESEARCH_THEMES=themes;

// Links the levers to the research (ids from vision-research.json) and to the place's own records
// ("base:<id>" in its baseline). The place's lists (@city/levers.js LEVER_EVIDENCE) replace these per
// lever; ids that the place's research does not have are left out.
const GENERIC={
  stadsodling:['food_e23','food_e20','food_e41','food_e25'],
  regionalt:['food_e5','food_e16','food_e31'],
  kost:['food_e6','food_e9','food_e34','food_e10'],
  hav:['biodiversity_baltic_e4','biodiversity_baltic_e11','food_e44'],
  sol:['energy_e17'],
  vind:['energy_e7'],
  effektivitet:['energy_e12','governance_e8'],
  bilfritt:['mobility_e8','mobility_e10','mobility_e19','mobility_e7'],
  kollektivt:['mobility_e5','mobility_e6','mobility_e14'],
  forbindelser:[],
  bogemenskap:['community_e1','community_e12','community_e13','community_e14','community_e8'],
  demokrati:['governance_e1','governance_e2','community_e16','community_e18','community_e17','governance_e3'],
  arbetstid:['community_e22','community_e23','community_e24','community_e25'],
  forebyggande:['health_e1','health_e3','health_e12','health_e6'],
  ai:['tech_ai_e1','tech_ai_e6','tech_ai_e11','tech_ai_e3','tech_ai_e5','tech_ai_e17'],
  kunskap:[],
  analog:['digital_resilience_e5','digital_resilience_e4','digital_resilience_e11','digital_resilience_e12','digital_resilience_e8','digital_resilience_e7','digital_resilience_e15'],
  beredskap:['resilience_e1','resilience_e23','resilience_e5'],
  anpassning:['mobility_e15','mobility_e16'],
};
const known=id=>id.startsWith('base:')?Boolean(BASELINE[id.slice(5)]):Boolean(EVIDENCE[id]);
export const LEVER_EVIDENCE=Object.fromEntries(Object.entries({...GENERIC,...PLACE_EVIDENCE}).map(([k,ids])=>[k,ids.filter(known)]));
