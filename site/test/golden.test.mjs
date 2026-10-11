import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { citySlug } from '../city.config.mjs';

// The engine must give the Kalmar example exactly the numbers Kalmar 2126 gave before it was made
// place-independent (test/golden/kalmar-model.json: all visions in all three worlds, the uncertainty
// bands, the events). Runs when the site is built for Kalmar: CITY=kalmar npm test.
const kalmar=citySlug()==='kalmar';
test('the Kalmar example reproduces Kalmar 2126',{skip:!kalmar&&'not built for Kalmar'},async()=>{
  const golden=JSON.parse(readFileSync(new URL('./golden/kalmar-model.json',import.meta.url),'utf8'));
  const S=await import('../src/scenario.js');
  // Two measures were renamed when the engine left Kalmar: Kalmarsund's health is the place's own waters, the
  // train to Stockholm the main rail link.
  const RENAMED={baltic:'waters',railStockholm:'railMain'},renamed=k=>RENAMED[k]||k;
  const close=(a,b,path)=>{
    if(typeof b!=='number'){assert.deepEqual(a,b,path);return;}
    assert.ok(Math.abs(a-b)<=1e-9*Math.max(1,Math.abs(b)),`${path}: ${a} ≠ ${b}`);
  };
  for(const [key,want] of Object.entries(golden.runs)){
    const [id,world]=key.split('/'),p=S.PRESETS.find(x=>x.id===id);
    const r=S.run(p.schedule,{world});
    for(const [y,w] of Object.entries(want.years)){
      const d=r.years[y-2026];
      for(const [k,v] of Object.entries(w.ind))close(d.ind[renamed(k)],v,`${key} ${y} ind.${k}`);
      w.sdg.forEach((v,i)=>close(d.sdg[i],v,`${key} ${y} sdg ${i+1}`));
      for(const [k,v] of Object.entries(w.vision))close(d.vision[k],v,`${key} ${y} vision.${k}`);
    }
    assert.deepEqual(JSON.parse(JSON.stringify(r.chronicle.map(c=>({year:c.year,id:c.id,severity:c.severity,good:c.good})))),want.chronicle,`${key} events`);
  }
  const YEARS=[2026,2027,2028,2030,2033,2036,2040,2046,2050,2056,2060,2066,2070,2076,2080,2086,2090,2096,2100,2110,2120,2126];
  for(const [id,want] of Object.entries(golden.bands)){
    const b=S.bands(S.PRESETS.find(x=>x.id===id).schedule,{world:'ssp245'});
    for(const side of ['lo','hi'])for(const [k,arr] of Object.entries(want[side]))arr.forEach((v,i)=>close(b[side][renamed(k)][YEARS[i]-2026],v,`${id} band ${side}.${k} ${YEARS[i]}`));
    want.sdg.lo.forEach((v,i)=>close(b.sdg.lo[YEARS[i]-2026],v,`${id} band sdg.lo ${YEARS[i]}`));
  }
});
