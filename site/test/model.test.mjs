import { cityOf } from '../city.config.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { simulate, BASE, defaultPolicy, FLOOD, PARAMS } from '../src/model.js';
import { run, PRESETS, policyFromSchedule } from '../src/scenario.js';
import { LEVERS, WORLDS } from '../src/data/levers.js';
import { DECISIONS } from '@city/decisions.js';
import * as M from '@city/model.js';
const mean=a=>a.reduce((s,v)=>s+v,0)/a.length;
const all=level=>()=>Object.fromEntries(LEVERS.map(l=>[l.id,level]));

test('2026 starts from the place\'s own measured numbers',()=>{
  const r=simulate();const d=r.years[0].ind;
  assert.ok(Math.abs(d.pop-BASE.pop)/BASE.pop<.01,'every place counts its people');
  // Nothing moves in the measured year: every figure the model starts from is as measured.
  for(const [k,v] of Object.entries(BASE))if(typeof v==='number'&&typeof d[k]==='number')assert.ok(Math.abs(d[k]-v)<=Math.abs(v)*.001+1e-9,`${k} in 2026: ${d[k]} (measured ${v})`);
  if(BASE.ghg&&typeof d.ghg==='number')assert.ok(Math.abs(d.ghg-Object.values(BASE.ghg).reduce((a,b)=>a+b,0))<.005,'emissions as measured');
  assert.equal(r.years.length,101);
});
test('2026 is the same measured place whatever is decided; the decisions start acting in 2027',()=>{
  const today=run(PRESETS[0].schedule).years[0];
  for(const p of [...PRESETS.slice(1),{schedule:[{from:2026,set:all(3)()}]}]){
    const r=run(p.schedule),d=r.years[0];
    for(const k of Object.keys(today.ind))if(!['demand','strain'].includes(k))assert.equal(d.ind[k],today.ind[k],`${p.id||'everything radical'}: ${k} in 2026`);
    assert.deepEqual(d.vision,today.vision);
    assert.ok(Object.values(r.years[1].I).some(v=>v>0),'change begins in 2027');
  }
});
test('every preset, world and lever bundle stays finite and in range',()=>{
  for(const world of WORLDS.map(w=>w.id))for(const policyAt of [defaultPolicy,all(1),all(2),all(3),...PRESETS.map(p=>policyFromSchedule(p.schedule))]){
    const r=simulate({policyAt,world});
    for(const y of r.years){
      for(const [k,v] of Object.entries(y.ind))assert.ok(Number.isFinite(v),`${y.year} ${k}`);
      for(const s of y.sdg)assert.ok(s>=0&&s<=100);
      for(const v of Object.values(y.vision))assert.ok(Number.isFinite(v));
    }
  }
});
test('the research-based vision beats today\'s course by far, and keeps the water out',()=>{
  // The place's research-based vision is its first (Kalmar's Sundstaden, Rättvik's Siljansbygden).
  const today=run([]),vision=run(PRESETS[1].schedule);
  assert.ok(mean(vision.years[100].sdg)>mean(today.years[100].sdg)+30);
  assert.ok(vision.years[100].ind.floodRisk<.2);
});
test('today\'s course meets a rising sea or lake: the flood risk grows',{skip:!FLOOD&&'the place has no flood module'},()=>{
  const today=run([]);
  assert.ok(today.years[100].ind.floodRisk>today.years[0].ind.floodRisk);
});
// What the place's levers do is the place's own model (@city/model.js EXPECT): a lever at `level` (3) moves
// a measure by at least `delta` by year 50 (or `year`); compare: every lever at one level against another.
test('the place\'s levers move the measures its model says they move',()=>{
  const E=M.EXPECT||[];assert.ok(E.length>=3,'a place states what its levers do (EXPECT in model.js)');
  const ids=new Set(LEVERS.map(l=>l.id));
  const base=simulate({events:false}).years;
  for(const e of E){
    const y=e.year??50;
    if(e.compare){
      const [a,b]=e.compare,ra=simulate({policyAt:all(a),events:false}).years[y].ind,rb=simulate({policyAt:all(b),events:false}).years[y].ind;
      const diff=ra[e.ind]-rb[e.ind];assert.ok(e.delta<0?diff<=e.delta:diff>=e.delta,`every lever at ${a} against ${b}: ${e.ind} ${diff}`);continue;
    }
    assert.ok(ids.has(e.lever),`EXPECT names a real lever: ${e.lever}`);
    const d=simulate({policyAt:()=>({...defaultPolicy(),[e.lever]:e.level??3}),events:false}).years[y].ind;
    const diff=d[e.ind]-base[y].ind[e.ind];
    assert.ok(e.delta<0?diff<=e.delta:diff>=e.delta,`${e.lever} → ${e.ind}: ${diff} (expected ${e.delta>0?'≥':'≤'} ${e.delta})`);
  }
});
test('asking too much at once strains the city',()=>{
  assert.ok(simulate({policyAt:all(3),events:false}).years[1].ind.strain>2);
});
test('runs are deterministic per seed',()=>{
  const a=simulate({seed:3}),b=simulate({seed:3});
  assert.deepEqual(a.chronicle.map(c=>[c.year,c.severity]),b.chronicle.map(c=>[c.year,c.severity]));
});
test('every journey decade has three or four dilemmas whose options name real levers',()=>{
  const ids=new Set(LEVERS.map(l=>l.id));
  for(let y=2026;y<2126;y+=10){
    assert.ok([3,4].includes(DECISIONS[y]?.length),`decade ${y}`);
    for(const c of DECISIONS[y])for(const o of c.options)for(const k of Object.keys(o.set))assert.ok(ids.has(k),`${c.id}: ${k}`);
  }
  // Research behind a dilemma: claims, or Kalmar's own figures ("base:<id>").
  const base=new Set(JSON.parse(readFileSync(cityOf().vision+'/research/baseline.json','utf8')).indicators.map(i=>i.id));
  for(const list of Object.values(DECISIONS))for(const c of list)for(const e of c.ev||[])if(e.startsWith('base:'))assert.ok(base.has(e.slice(5)),`${c.id}: ${e}`);
});

test('uncertainty bands start at today\'s measured values and widen over the century',async()=>{
  const { ensemble }=await import('../src/model.js');
  const b=ensemble({},{members:16});
  for(const k of ['pop',...(M.BAND_CHECK||[])]){
    assert.ok(b.hi[k][0]-b.lo[k][0]<=Math.abs(b.lo[k][0])*.01+1e-9,`${k} band at 2026 should be (near) zero`);
    assert.ok(b.hi[k][100]-b.lo[k][100]>b.hi[k][0]-b.lo[k][0],`${k} band should widen`);
  }
  for(const k of Object.keys(b.lo))for(let y=0;y<=100;y++)assert.ok(b.lo[k][y]<=b.hi[k][y]+1e-12);
  // Indicators that are model constructs are uncertain already today (BASE_UNCERTAIN).
  const construct=(M.BASE_UNCERTAIN||[]).find(k=>k in b.lo);
  if(construct)assert.ok(b.hi[construct][0]>b.lo[construct][0],construct);
});
