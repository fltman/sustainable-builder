import { run, PRESETS } from '../src/scenario.js';
for(const p of PRESETS){const r=run(p.schedule);console.log('\n==',p.name);
for(const y of [2026,2036,2046,2066,2086,2126]){const d=r.years[y-2026];console.log(y,'idx',Math.round(d.sdg.reduce((a,b)=>a+b)/17),'strain',d.ind.strain.toFixed(2),'cap',d.ind.capacity.toFixed(1),'trust',d.ind.trust.toFixed(2),'welfare',d.ind.welfare.toFixed(2),'wellb',d.ind.wellbeing.toFixed(2),'gini',d.ind.gini.toFixed(3),'flood',d.ind.floodRisk.toFixed(2));}
console.log(r.chronicle.map(c=>c.title+':'+c.severity.toFixed(2)).join(' | '));}
