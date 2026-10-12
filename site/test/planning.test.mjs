import { cityOf } from '../city.config.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { createPlanning, centroid, pointInPolygon } from '../src/planning.js';
import { createGraph } from '../src/graph.js';
import { CITY } from '../src/city-config.js';
// The place's 3D map (python3 sustainable.py build <slug>). A fresh clone has none – not even Kalmar's,
// whose pack is Kalmar 2126's own (examples/kalmar/README.md) – so these wait until the city is built.
const file=cityOf().pack+'/map.json',map=existsSync(file)?JSON.parse(readFileSync(file)):null;
const built={skip:!map&&'the 3D city is not built yet'};
test('polygon helpers',()=>{
  const sq=[[0,0],[10,0],[10,10],[0,10]];
  assert.deepEqual(centroid(sq),[5,5]);
  assert.ok(pointInPolygon(5,5,sq));assert.ok(!pointInPolygon(15,5,sq));
});
test('planning ranks roofs by area share and protects the landmarks',built,()=>{
  const p=createPlanning(map);
  const orders=p.buildings.filter(b=>!b.heritage).map(b=>b.order);
  assert.ok(Math.min(...orders)>0&&Math.max(...orders)<1);
  assert.ok(p.buildings.some(b=>b.heritage));
  // Car streets where the place has cars (not in Venice); its first square lies on its land (Kalmar's Stortorget on Kvarnholmen).
  assert.ok(p.roads.some(r=>!r.car));if(CITY.traffic?.car!==0)assert.ok(p.roads.some(r=>r.car));
  const sq=CITY.squares?.[0]||{x:20,z:-10};assert.ok(p.onIsland(sq.x,sq.z),'the first square lies on the land');
});
test('the street graph routes across the place',built,()=>{
  const p=createPlanning(map),g=createGraph(p.roads);
  const a=g.nearest(-300,-60),b=g.nearest(80,150);
  const path=g.path(a,b);
  assert.ok(path&&path.length>3);
});
test('most of the street graph is one connected network',built,()=>{
  const p=createPlanning(map),g=createGraph(p.roads);
  const seen=new Set([g.nearest(20,-10)]),stack=[...seen];
  while(stack.length){const id=stack.pop();for(const e of g.nodes[id].edges){const o=g.other(e,id);if(!seen.has(o)){seen.add(o);stack.push(o);}}}
  const live=g.nodes.filter(n=>n.edges.length).length;
  console.log(`connected ${seen.size}/${live}`);
  assert.ok(seen.size/live>.85);
});
