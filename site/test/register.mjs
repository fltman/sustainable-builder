// Node resolves @city/… and @engine/… the way vite.config.js does: node --import ./test/register.mjs …
import { registerHooks } from 'node:module';
import { existsSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { cityOf, ENGINE } from '../city.config.mjs';
const city=cityOf();
registerHooks({resolve(spec,ctx,next){
  // A place without Italian: the engine's empty IT.
  if(spec==='@city/it.js'&&!existsSync(`${city.vision}/it.js`))return next(pathToFileURL(`${ENGINE}/data/it-place.js`).href,ctx);
  if(spec.startsWith('@city/'))return next(pathToFileURL(`${city.vision}/${spec.slice(6)}`).href,ctx);
  if(spec.startsWith('@engine/'))return next(pathToFileURL(`${ENGINE}/${spec.slice(8)}`).href,ctx);
  return next(spec,ctx);
}});
