import { CITY } from '@city/config.js';
import { LANG } from './i18n.js';
// The place the site is built for (@city/config.js): CITY is its configuration, PLACE its names in the
// interface language – PLACE.name, PLACE.genitive ("Kalmars"), PLACE.kommun, PLACE.centre (the part
// the 3D model shows), PLACE.onCentre ("på Kvarnholmen") and so on.
export { CITY };
export const PLACE=CITY[LANG]||(LANG!=='sv'&&CITY.en)||CITY.sv;   // a language the config lacks: its English names
// A real height (in the place's height system, m RH 2000 in Sweden) as y in the model.
export const modelY=h=>h-CITY.water.level+CITY.water.y;
// The place's film: named in its config, or found in its pack at build time (vite.config.js).
export const FILM=CITY.film||(typeof __FILM__!=='undefined'?__FILM__:null);
