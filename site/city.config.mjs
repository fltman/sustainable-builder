// Which place the site is built for: CITY=<slug>, else the slug in site/.city (written by
// `python3 sustainable.py site <slug>`), else the Kalmar example. A place's sources – texts, model,
// research – are in cities/<slug>/vision (examples/<slug>/vision for the bundled examples); what the
// browser loads – tiles, map, media – is its pack, cities/<slug>/pack, served as /city.
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
export const SITE=dirname(fileURLToPath(import.meta.url));
export const ROOT=resolve(SITE,'..');
export const ENGINE=resolve(SITE,'src');
export function citySlug(){
  if(process.env.CITY)return process.env.CITY;
  const f=resolve(SITE,'.city');return existsSync(f)?readFileSync(f,'utf8').trim():'kalmar';
}
export function cityOf(slug=citySlug()){
  const vision=['cities','examples'].map(b=>resolve(ROOT,b,slug,'vision')).find(d=>existsSync(resolve(d,'config.js')));
  if(!vision)throw new Error(`No place "${slug}": expected cities/${slug}/vision or examples/${slug}/vision`);
  return {slug,vision,pack:resolve(ROOT,'cities',slug,'pack')};
}
