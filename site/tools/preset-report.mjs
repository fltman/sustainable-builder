import { KEY_FIGURES } from '../src/data/indicators.js';
import { run, PRESETS } from '../src/scenario.js';
for(const p of PRESETS){const r=run(p.schedule);console.log('\n==',p.name);
for(const y of [2026,2036,2046,2066,2086,2126]){const d=r.years[y-2026];const f=k=>typeof d.ind[k]==='number'?`${k} ${(+d.ind[k]).toFixed(k==='pop'?0:2)}`:'';
  console.log(y,'idx',Math.round(d.sdg.reduce((a,b)=>a+b)/17),[...new Set(['strain','capacity','pop',...KEY_FIGURES.slice(0,8)])].map(f).filter(Boolean).join(' · '));}
console.log(r.chronicle.map(c=>c.title+':'+c.severity.toFixed(2)).join(' | '));}
