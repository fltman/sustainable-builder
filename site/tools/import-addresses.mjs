// Street addresses for the robot taxi: every OSM address (addr:street + addr:housenumber) on and
// around Kvarnholmen, projected into model metres, written to public/addresses.json.
//   node tools/import-addresses.mjs [path/to/osm-kvarnholmen-full.osm]
// The OSM extract belongs to the kalmar-kvarnholmen model project; the projection is the model's own
// (origin 56.66412 N 16.3656 E, rotated 28.2°; three.js x = x, z = −y).
import { readFileSync, writeFileSync } from 'node:fs';

const src=process.argv[2]||new URL('../../kalmar-kvarnholmen/references/osm-kvarnholmen-full.osm',import.meta.url);
const osm=readFileSync(src,'utf8');
const LAT0=56.66412,LON0=16.3656,AR=28.2*Math.PI/180,M=111320;
const project=(lat,lon)=>{
  const e=(lon-LON0)*M*Math.cos(LAT0*Math.PI/180),n=(lat-LAT0)*M;
  const x=e*Math.cos(AR)+n*Math.sin(AR),y=-e*Math.sin(AR)+n*Math.cos(AR);
  return [Math.round(x*10)/10,Math.round(-y*10)/10];
};
const tagsOf=body=>Object.fromEntries([...body.matchAll(/<tag k="([^"]+)" v="([^"]*)"\s*\/>/g)].map(m=>[m[1],unescape(m[2])]));
const unescape=s=>s.replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&apos;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>');

const nodes=new Map(),found=[];
for(const m of osm.matchAll(/<node id="(\d+)"[^>]*?lat="([-\d.]+)" lon="([-\d.]+)"[^>]*?(\/>|>([\s\S]*?)<\/node>)/g)){
  const lat=+m[2],lon=+m[3];nodes.set(m[1],[lat,lon]);
  if(m[5]){const t=tagsOf(m[5]);if(t['addr:street']&&t['addr:housenumber'])found.push({t,at:project(lat,lon)});}
}
const ways=new Map();
for(const m of osm.matchAll(/<way id="(\d+)"[^>]*>([\s\S]*?)<\/way>/g)){
  const refs=[...m[2].matchAll(/<nd ref="(\d+)"\s*\/>/g)].map(r=>r[1]);ways.set(m[1],refs);
  const t=tagsOf(m[2]);
  if(t['addr:street']&&t['addr:housenumber']){
    // Buildings: the centre of the outline.
    const pts=refs.map(r=>nodes.get(r)).filter(Boolean);if(!pts.length)continue;
    const ring=pts.length>1&&pts[0]===pts.at(-1)?pts.slice(0,-1):pts;
    const lat=ring.reduce((s,p)=>s+p[0],0)/ring.length,lon=ring.reduce((s,p)=>s+p[1],0)/ring.length;
    found.push({t,at:project(lat,lon)});
  }
}
// Check the projection against the street map the city was built from (same OSM ways).
const map=JSON.parse(readFileSync(new URL('../public/map.json',import.meta.url),'utf8'));
const errs=[];let checked=0;
for(const r of map.roads){const refs=ways.get(r.id);if(!refs||refs.length!==r.p.length)continue;
  refs.forEach((ref,i)=>{const ll=nodes.get(ref);if(!ll)return;const [x,z]=project(...ll);errs.push(Math.hypot(x-r.p[i][0],z-r.p[i][1]));});checked++;}
errs.sort((a,b)=>a-b);

// One entry per street and number ("12A", "3–5"); several entrances on one number are averaged.
const key=new Map();
// Street names as people write them (OSM has the odd stray comma); "Kom snart igen" is left out, as in the street list.
const streetOf=t=>t['addr:street'].trim().replace(/[\s,;]+$/,'');
for(const {t,at} of found){
  const street=streetOf(t);if(/^Kom snart igen$/.test(street))continue;
  for(const num of t['addr:housenumber'].split(/[;,]/).map(s=>s.trim().replace(/-/g,'–')).filter(Boolean)){
    const k=street+'|'+num,cur=key.get(k);
    if(cur){cur.x+=at[0];cur.z+=at[1];cur.n++;}else key.set(k,{street,num,x:at[0],z:at[1],n:1});
  }
}
const numeric=s=>parseInt(s,10)||0;
const list=[...key.values()].map(a=>({street:a.street,num:a.num,x:Math.round(a.x/a.n*10)/10,z:Math.round(a.z/a.n*10)/10}))
  .sort((a,b)=>a.street.localeCompare(b.street,'sv')||numeric(a.num)-numeric(b.num)||a.num.localeCompare(b.num,'sv'));
writeFileSync(new URL('../public/addresses.json',import.meta.url),JSON.stringify({
  source:'© OpenStreetMap contributors (ODbL), via kalmar-kvarnholmen/references/osm-kvarnholmen-full.osm',
  addresses:list.map(a=>[a.street,a.num,a.x,a.z]),
}));
console.log(`${list.length} addresses on ${new Set(list.map(a=>a.street)).size} streets; projection checked on ${checked} roads, median error ${errs[errs.length>>1].toFixed(2)} m`);
