// First screen. The language is chosen here, before the app is imported: the data modules translate
// themselves when they load (src/i18n.js), so choosing first means nothing has to reload. Recorders
// and links that name a language (?lang=, ?film) and a language switch inside the app (which carries
// the plan over in sessionStorage) go straight on.
//
// Phones: iOS Safari closes a tab that uses too much memory and reloads it. While the page lives it
// leaves a heartbeat in sessionStorage; a reload the visitor makes removes it (pagehide), so a
// heartbeat still there means the page died. Then the app starts again at once, in the chosen
// language, on its leanest settings (window.__kalmarSafe) – and after three deaths it says so.
const params=new URLSearchParams(location.search);
const STORE=typeof __CITY__!=='undefined'?__CITY__:'kalmar';   // the place's own storage keys (see src/i18n.js)
const save=(k,v)=>{try{localStorage.setItem(k,v);}catch{}};
const ss={get:k=>{try{return sessionStorage.getItem(k);}catch{return null;}},set:(k,v)=>{try{sessionStorage.setItem(k,v);}catch{}},del:k=>{try{sessionStorage.removeItem(k);}catch{}}};
let saved=null;try{saved=localStorage.getItem(`${STORE}-lang`);}catch{}
const resume=Boolean(ss.get(`${STORE}-resume`));
const beat=Number(ss.get(`${STORE}-alive`)||0),died=beat>0;
// Died while in use (a recent heartbeat) is a crash; an old one is a tab Safari put away in the background.
let crashes=+(ss.get(`${STORE}-crashes`)||0);if(died&&Date.now()-beat<20000)ss.set(`${STORE}-crashes`,String(++crashes));
const splash=document.getElementById('loading'),pickBox=splash.querySelector('.lang-pick'),load=splash.querySelector('.splash-load');

// Fetch what every visit needs while the visitor reads the first screen.
for(const u of ['city/map.json','city/tiles/tiles.json','models/crowd/crowd.json','models/vehicles.glb',...(__PACK__.addresses?['city/addresses.json']:[])])fetch(u).catch(()=>{});

// The first screen's and the start menu's picture: the place's 2126, from its film's poster (none without a film).
if(typeof __FILM__!=='undefined'&&__FILM__?.poster)document.documentElement.style.setProperty('--hero',`url("${new URL(`city/${__FILM__.poster}`,document.baseURI).href}")`);

// The place's languages (vite.config.js: CITY.langs, its own first) and the first screen's words in each.
const LANGS=typeof __LANGS__!=='undefined'?__LANGS__:['sv','en'],known=l=>LANGS.includes(l);
const W={sv:{again:'Startar om med mindre detaljer så att telefonen orkar …',loading:c=>`Laddar ${c} …`,memory:'Sidan behöver mer minne än telefonen har ledigt just nu. Stäng andra flikar och försök igen – eller öppna den på en dator.',retry:'Försök igen'},
  en:{again:'Starting again with less detail, so the phone can keep up …',loading:c=>`Loading ${c} …`,memory:'This page needs more memory than the phone has free right now. Close other tabs and try again – or open it on a computer.',retry:'Try again'},
  it:{again:'Riparto con meno dettagli, così il telefono ce la fa …',loading:c=>`Carico ${c} …`,memory:'La pagina ha bisogno di più memoria di quella che il telefono ha libera adesso. Chiudi le altre schede e riprova – oppure aprila su un computer.',retry:'Riprova'}};
function start(lang){
  window.__kalmarLang=lang;save(`${STORE}-lang`,lang);document.documentElement.lang=lang;
  window.__kalmarSafe=crashes>0;
  splash.classList.add('chosen');pickBox.hidden=true;load.hidden=false;
  document.getElementById('load-text').textContent=crashes>0?W[lang].again:W[lang].loading(__PLACE__[lang].centre);
  const alive=()=>ss.set(`${STORE}-alive`,String(Date.now()));alive();setInterval(alive,4000);
  addEventListener('pagehide',()=>ss.del(`${STORE}-alive`));
  import('./main.js');
}
const given=params.get('lang'),home=LANGS[0],lastLang=known(given)?given:!given&&known(saved)?saved:home;
if(crashes>=3){
  // Out of memory again and again: say so instead of looping.
  pickBox.hidden=true;load.hidden=false;
  const w=W[known(saved)?saved:home];
  document.getElementById('load-text').textContent=w.memory;
  splash.querySelector('.meter').hidden=true;
  const retry=document.createElement('button');retry.className='splash-retry';retry.textContent=w.retry;
  retry.onclick=()=>{ss.del(`${STORE}-crashes`);ss.del(`${STORE}-alive`);location.reload();};load.append(retry);
}
else if(given||params.has('film')||resume||died)start(lastLang);
else{
  // The last choice (or the browser's language) is the default: Enter picks it.
  const nav=(navigator.language||'sv').slice(0,2),def=known(saved)?saved:known(nav)?nav:'en';
  const buttons=[...pickBox.querySelectorAll('button')];
  for(const b of buttons){b.onclick=()=>start(b.dataset.lang);if(b.dataset.lang===def)b.classList.add('default');}
  buttons.find(b=>b.dataset.lang===def)?.focus();
}
