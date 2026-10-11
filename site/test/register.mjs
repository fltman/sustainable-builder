// Node resolves @city/… and @engine/… the way vite.config.js does: node --import ./test/register.mjs …
import { registerHooks } from 'node:module';
import { pathToFileURL } from 'node:url';
import { cityOf, ENGINE } from '../city.config.mjs';
const city=cityOf();
registerHooks({resolve(spec,ctx,next){
  if(spec.startsWith('@city/'))return next(pathToFileURL(`${city.vision}/${spec.slice(6)}`).href,ctx);
  if(spec.startsWith('@engine/'))return next(pathToFileURL(`${ENGINE}/${spec.slice(8)}`).href,ctx);
  return next(spec,ctx);
}});
