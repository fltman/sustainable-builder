import { simulate, defaultPolicy } from '../src/model.js';
import { LEVERS } from '../src/data/levers.js';
const runs={
  dagens:()=>defaultPolicy(),
  stadig:()=>Object.fromEntries(LEVERS.map(l=>[l.id,1])),
  ambitios:()=>Object.fromEntries(LEVERS.map(l=>[l.id,2])),
  radikal:()=>Object.fromEntries(LEVERS.map(l=>[l.id,3])),
};
const keys=['pop','ghg','ghgCons','carShare','foodRegional','localEnergy','lifeExp','lowParticipation','trust','gini','waters','water','floodRisk','welfare','strain','wellbeing','seaRise','protection'];
for(const [name,p] of Object.entries(runs)){
  const r=simulate({policyAt:p,world:process.argv[2]||'ssp245'});
  console.log('\n==',name);
  for(const y of [2026,2040,2060,2100,2126]){
    const s=r.years.find(x=>x.year===y);
    console.log(y,keys.map(k=>`${k}=${(+s.ind[k]).toFixed(k==='pop'?0:2)}`).join(' '),'SDG',Math.round(s.sdg.reduce((a,b)=>a+b)/17));
  }
  console.log(r.chronicle.map(c=>`${c.year} ${c.title} ${c.severity.toFixed(2)}`).join(' | '));
  const bad=r.years.flatMap(y=>Object.entries(y.ind).filter(([k,v])=>!Number.isFinite(v)).map(([k])=>y.year+':'+k));
  if(bad.length)console.log('NaN!',bad.slice(0,5));
}
