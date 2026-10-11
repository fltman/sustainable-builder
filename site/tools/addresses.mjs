// Street addresses for the ride's destination list, from the place's OpenStreetMap data:
//   node tools/addresses.mjs <slug>      → cities/<slug>/pack/addresses.json
// Every node or building with addr:street and addr:housenumber, at its point or its outline's centre,
// in the model's plane (x east, z south; the pipeline's projection).
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from '../city.config.mjs';

const slug=process.argv[2];
if(!slug){console.error('usage: node tools/addresses.mjs <slug>');process.exit(1);}
const city=join(ROOT,'cities',slug);
const place=JSON.parse(readFileSync(join(city,'place.json'),'utf8'));
const osm=JSON.parse(readFileSync(join(city,'osm.json'),'utf8'));
const [lat0,lon0]=place.center,E=111320,kx=E*Math.cos(lat0*Math.PI/180);
const xy=(lat,lon)=>[+((lon-lon0)*kx).toFixed(1),+(-(lat-lat0)*E).toFixed(1)];
const nodes=new Map(osm.elements.filter(e=>e.type==='node').map(n=>[n.id,n]));
const seen=new Set(),rows=[];
for(const e of osm.elements){
  const t=e.tags||{};if(!t['addr:street']||!t['addr:housenumber'])continue;
  let lat=e.lat,lon=e.lon;
  if(e.type==='way'){const pts=(e.nodes||[]).map(id=>nodes.get(id)).filter(Boolean);if(!pts.length)continue;lat=pts.reduce((s,p)=>s+p.lat,0)/pts.length;lon=pts.reduce((s,p)=>s+p.lon,0)/pts.length;}
  else if(e.center){lat=e.center.lat;lon=e.center.lon;}
  if(lat==null)continue;
  const key=`${t['addr:street']} ${t['addr:housenumber']}`;if(seen.has(key))continue;seen.add(key);
  rows.push([t['addr:street'],t['addr:housenumber'],...xy(lat,lon)]);
}
rows.sort((a,b)=>a[0].localeCompare(b[0],'sv')||(parseInt(a[1])||0)-(parseInt(b[1])||0));
writeFileSync(join(city,'pack/addresses.json'),JSON.stringify({source:'© OpenStreetMap contributors (ODbL)',addresses:rows}));
console.log(`${rows.length} addresses → cities/${slug}/pack/addresses.json`);
