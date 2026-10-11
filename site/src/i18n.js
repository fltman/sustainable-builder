// Swedish / English – and the place's own language where it speaks a third (CITY.langs: Venice's
// ['it','en','sv']). The language comes from ?lang=, else the first screen's choice (src/boot.js),
// else the saved choice, else the browser.
// Static strings are written in Swedish in the data files and looked up with L(sv) in data/en.js and the
// place's own @city/en.js (Italian: data/it.js and @city/it.js, falling back to English);
// sentences built from numbers use t(sv,en,it) where they are written (no Italian given: the English).
// Safe to import in Node (tests).
import { EN as ENGINE_EN } from './data/en.js';
import { IT as ENGINE_IT } from './data/it.js';
import { EN as PLACE_EN } from '@city/en.js';
import { IT as PLACE_IT } from '@city/it.js';
const EN={...ENGINE_EN,...PLACE_EN},IT={...ENGINE_IT,...PLACE_IT};
// The place's languages, its own first (vite.config.js defines __LANGS__ from CITY.langs).
export const LANGS=typeof __LANGS__!=='undefined'?__LANGS__:['sv','en'];
// The place's own keys in the browser's storage ("venezia-lang"): places on the same web host keep their own.
export const STORE=typeof __CITY__!=='undefined'?__CITY__:'kalmar';
const hasWindow=typeof window!=='undefined';
const pick=()=>{
  if(!hasWindow)return typeof process!=='undefined'&&LANGS.includes(process.env?.SITE_LANG)?process.env.SITE_LANG:'sv';
  const q=new URLSearchParams(location.search).get('lang');
  let saved=null;try{saved=localStorage.getItem(`${STORE}-lang`);}catch{}
  const l=q||window.__kalmarLang||saved||(navigator.language||'sv').slice(0,2);
  if(LANGS.includes(l))return l;
  // A Swedish place speaks Swedish to the rest of the world; a place in another language, English.
  return LANGS.includes('sv')&&LANGS.length<=2?'sv':LANGS.includes('en')?'en':LANGS[0];
};
export let LANG=pick();
// The locale for numbers and dates.
export const LOCALE={sv:'sv-SE',en:'en-GB',it:'it-IT'}[LANG]||'en-GB';
export const t=(sv,en,it)=>LANG==='sv'?sv:LANG==='it'?(it??en):en;
// Look up a static Swedish string; unknown strings stay Swedish (Italian: the English if no Italian).
export const L=s=>LANG==='sv'||typeof s!=='string'?s:LANG==='it'?(IT[s]??EN[s]??s):(EN[s]??s);
// Numbers: decimal comma in Swedish and Italian, point in English.
export const dec=(v,d=1)=>{const s=(+v).toFixed(d);return LANG==='en'?s:s.replace('.',',');};
export const int=v=>Math.round(v).toLocaleString(LOCALE);
export const pct=v=>`${Math.round(v*100)}${LANG==='sv'?' %':'%'}`;
// Switch language inside the app: the plan and year ride along in sessionStorage (not the address,
// so a later visit still starts from the first screen) and the page reloads in the other language.
export function setLang(l,resume=''){
  try{localStorage.setItem(`${STORE}-lang`,l);if(resume)sessionStorage.setItem(`${STORE}-resume`,resume);}catch{}
  const u=new URL(location.href);u.searchParams.delete('lang');u.hash='';
  if(u.href===location.href)location.reload();else location.href=u.href;
}
