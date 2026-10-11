import { defineConfig } from 'vite';
import { createReadStream, existsSync, statSync, cpSync } from 'node:fs';
import { join, normalize, extname } from 'node:path';
import { cityOf, ENGINE, ROOT } from './city.config.mjs';
// The engine imports the place's own modules as @city/… (city.config.mjs decides which place);
// the place's modules import the engine as @engine/…. Its pack (tiles, map, media: cities/<slug>/pack)
// is served as /city and copied into the built site; the page head and the first screen get the
// place's names before any script runs (index.html: %TITLE%, %URL% …).
const city=cityOf();
const { CITY }=await import(`${city.vision}/config.js`);
const esc=s=>String(s??'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
// The site's languages: the place's own first (CITY.langs, e.g. Venice's ['it','en','sv']), else Swedish and English.
const LANGS=CITY.langs||['sv','en'];
const LANG_NAME={sv:['Svenska','Börja på svenska'],en:['English','Start in English'],it:['Italiano','Inizia in italiano']};
const OG_LOCALE={sv:'sv_SE',en:'en_GB',it:'it_IT'};
const FIELDS={TITLE:CITY.title,PAGE_TITLE:CITY.meta?.pageTitle||`${CITY.sv.name} 2126`,URL:CITY.url||'./',DESCRIPTION:CITY.meta?.description,
  OG_TITLE:CITY.meta?.ogTitle,OG_DESCRIPTION:CITY.meta?.ogDescription,OG_IMAGE_ALT:CITY.meta?.ogImageAlt,HTML_LANG:LANGS[0]};
// Markup the head and the first screen get as it is (built here from the config, escaped where it is text).
const RAW={TAGLINES:LANGS.map(l=>`<span lang="${l}">${esc(CITY[l]?.tagline)}</span>`).join(''),
  LANG_PICK:LANGS.map(l=>`<button data-lang="${l}"${l===LANGS[0]?'':` lang="${l}"`}><b>${LANG_NAME[l][0]}</b><span>${LANG_NAME[l][1]}</span></button>`).join('\n      '),
  OG_LOCALES:LANGS.map((l,i)=>`<meta property="og:locale${i?':alternate':''}" content="${OG_LOCALE[l]}">`).join('\n')};
const names=l=>Object.fromEntries(['name','genitive','centre','tagline'].map(k=>[k,CITY[l][k]]));
// A place without Italian imports the engine's empty IT as @city/it.js.
const optional=f=>existsSync(join(city.vision,f))?join(city.vision,f):join(ENGINE,'data/it-place.js');
// A film made by `sustainable.py film` shows on the site when the config names none: one per language,
// pack/film/<slug>-2126.mp4 in Swedish and <slug>-2126-<lang>.mp4 in the others (Venice: -it and -en).
const filmBase=`film/${city.slug}-2126`,filmOf=l=>l==='sv'?filmBase:`${filmBase}-${l}`;
const films=Object.fromEntries(LANGS.filter(l=>existsSync(join(city.pack,`${filmOf(l)}.mp4`))).map(l=>[l,filmOf(l)])),hasFilm=Object.keys(films).length>0;
// Which optional pack files the place has, so the engine never asks for one that is not there.
const PACK=Object.fromEntries(Object.entries({horizon:'horizon.json',addresses:'addresses.json',flood:'terrain/flood.json'}).map(([k,f])=>[k,existsSync(join(city.pack,f))]));
const FILM=CITY.film||(hasFilm?{...films,poster:'film/poster.jpg',length:{sv:'1½ minut',en:'1½ minutes',it:'un minuto e mezzo'}}:null);
const TYPES={'.json':'application/json','.glb':'model/gltf-binary','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp',
  '.mp3':'audio/mpeg','.mp4':'video/mp4','.vtt':'text/vtt','.bin':'application/octet-stream','.svg':'image/svg+xml'};
const servePack=(req,res,next)=>{
  const path=decodeURIComponent((req.url||'').split('?')[0]),file=normalize(join(city.pack,path));
  if(!file.startsWith(city.pack)||!existsSync(file)||statSync(file).isDirectory())return next();
  res.setHeader('Content-Type',TYPES[extname(file).toLowerCase()]||'application/octet-stream');res.setHeader('Content-Length',statSync(file).size);
  createReadStream(file).pipe(res);
};
let outDir='dist';
const pack={name:'place-pack',
  configureServer(server){server.middlewares.use('/city',servePack);},
  configurePreviewServer(server){server.middlewares.use('/city',servePack);},
  configResolved(c){outDir=c.build.outDir;},
  // The built site carries the place's pack (dereferenced: hard links and clones become files).
  writeBundle(){if(existsSync(city.pack))cpSync(city.pack,join(outDir,'city'),{recursive:true,dereference:true,filter:f=>!/\/(config\.json|splash\.jpg|\.DS_Store)$/.test(f)});},
};
export const shared={
  base:'./',
  resolve:{alias:[{find:'@city/it.js',replacement:optional('it.js')},{find:'@city',replacement:city.vision},{find:'@engine',replacement:ENGINE}]},
  define:{__CITY__:JSON.stringify(city.slug),__PLACE__:JSON.stringify(Object.fromEntries(LANGS.map(l=>[l,names(l)]))),__LANGS__:JSON.stringify(LANGS),
    __FILM__:JSON.stringify(FILM),__PACK__:JSON.stringify(PACK)},
  build:{chunkSizeWarningLimit:2000},
  plugins:[{name:'place-head',transformIndexHtml:html=>html.replace(/%([A-Z_]+)%/g,(m,k)=>k in RAW?RAW[k]:k in FIELDS?esc(FIELDS[k]):m)},pack],
};
export default defineConfig({...shared,server:{host:'0.0.0.0',port:5230,fs:{allow:[ROOT]}}});
