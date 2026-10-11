// Swedish / English. The language comes from ?lang=sv|en, else the first screen's choice (src/boot.js),
// else the saved choice, else the browser.
// Static strings are written in Swedish in the data files and looked up with L(sv) in data/en.js and the
// place's own @city/en.js;
// sentences built from numbers use t(sv,en) where they are written. Safe to import in Node (tests).
import { EN as ENGINE_EN } from './data/en.js';
import { EN as PLACE_EN } from '@city/en.js';
const EN={...ENGINE_EN,...PLACE_EN};
const hasWindow=typeof window!=='undefined';
const pick=()=>{
  if(!hasWindow)return 'sv';
  const q=new URLSearchParams(location.search).get('lang');
  let saved=null;try{saved=localStorage.getItem('kalmar-lang');}catch{}
  const l=q||window.__kalmarLang||saved||(navigator.language||'sv').slice(0,2);
  return l==='en'?'en':'sv';
};
export let LANG=pick();
export const t=(sv,en)=>LANG==='en'?en:sv;
// Look up a static Swedish string; unknown strings stay Swedish.
export const L=s=>LANG==='en'&&typeof s==='string'?(EN[s]??s):s;
// Numbers: decimal comma in Swedish, point in English.
export const dec=(v,d=1)=>{const s=(+v).toFixed(d);return LANG==='en'?s:s.replace('.',',');};
export const int=v=>Math.round(v).toLocaleString(LANG==='en'?'en-GB':'sv-SE');
export const pct=v=>`${Math.round(v*100)} %`.replace(' %',LANG==='en'?'%':' %');
// Switch language inside the app: the plan and year ride along in sessionStorage (not the address,
// so a later visit still starts from the first screen) and the page reloads in the other language.
export function setLang(l,resume=''){
  try{localStorage.setItem('kalmar-lang',l);if(resume)sessionStorage.setItem('kalmar-resume',resume);}catch{}
  const u=new URL(location.href);u.searchParams.delete('lang');u.hash='';
  if(u.href===location.href)location.reload();else location.href=u.href;
}
