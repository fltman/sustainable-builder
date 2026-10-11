import test from 'node:test';
import assert from 'node:assert/strict';
import { PRESETS, LEVERS, START, END, planHash, parsePlanHash, encodePlan, policyFromSchedule } from '../src/scenario.js';

const WORLDS=['ssp126','ssp245','ssp585'];
const samePolicy=(a,b)=>{const pa=policyFromSchedule(a),pb=policyFromSchedule(b);for(let y=START;y<=END;y++)assert.deepEqual(pb(y),pa(y),`policy in ${y}`);};

test('a vision left as it is is shared by its name',()=>{
  for(const p of PRESETS)for(const world of WORLDS){
    const hash=planHash({schedule:p.schedule,world,preset:p.id},2039.6);
    assert.equal(hash,`${p.id}${world==='ssp245'?'':'-'+world}-2039`);
    const back=parsePlanHash('#'+hash);
    assert.equal(back.preset,p.id);assert.equal(back.world,world);assert.equal(back.year,2039);
    samePolicy(p.schedule,back.schedule);
  }
});
test('no choices at all is the current course',()=>{
  assert.equal(planHash({schedule:[]},2076),'dagens-2076');
  assert.equal(planHash({schedule:[{from:START,set:{sol:0,ai:0}}],world:'ssp585'},2126),'dagens-ssp585-2126');
});
test('a vision someone has changed gets a code, not the name',()=>{
  // The place's research-based vision (its first), changed a little.
  const p=PRESETS[1],changed=structuredClone(p.schedule);changed[0].set.ai=changed[0].set.ai===3?2:3;
  const hash=planHash({schedule:changed,world:'ssp245',preset:p.id},2100);
  assert.match(hash,/^[12][0-9A-Za-z]+-2100$/);
  assert.ok(hash.length<60,`${hash.length} characters`);
  samePolicy(changed,parsePlanHash(hash).schedule);
});
test('any plan packs into a short code and back',()=>{
  let seed=7;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
  for(let n=0;n<300;n++){
    const schedule=[];
    for(let i=0,k=1+Math.floor(rnd()*11);i<k;i++){
      const set={},ids=LEVERS.map(l=>l.id).filter(()=>rnd()<.3);
      if(!ids.length)ids.push(LEVERS[Math.floor(rnd()*LEVERS.length)].id);
      for(const id of ids)set[id]=1+Math.floor(rnd()*3);
      schedule.push({from:START+Math.floor(rnd()*101),set});
    }
    const world=WORLDS[n%3],hash=planHash({schedule,world},START+Math.floor(rnd()*101));
    assert.match(hash,/^[12][0-9A-Za-z]+-\d{4}$/);
    const back=parsePlanHash(hash);
    assert.equal(back.world,world);assert.equal(back.preset,null);
    samePolicy(schedule,back.schedule);
  }
});
test('links written before the short ones still open',()=>{
  const p=PRESETS[1];
  const back=parsePlanHash(`#plan=${encodePlan(p.schedule,'ssp585')}&year=2050`);
  assert.equal(back.world,'ssp585');assert.equal(back.year,2050);
  samePolicy(p.schedule,back.schedule);
});
test('what is not a plan is not read as one',()=>{
  for(const h of ['','#','#foo','#1-2039',`#${PRESETS[1].id}`,`#${PRESETS[1].id}-ssp999x-2039`,'#1abc!-2039','#zzz-2039'])assert.equal(parsePlanHash(h),null,h);
});
