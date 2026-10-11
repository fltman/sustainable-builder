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
const save=(k,v)=>{try{localStorage.setItem(k,v);}catch{}};
const ss={get:k=>{try{return sessionStorage.getItem(k);}catch{return null;}},set:(k,v)=>{try{sessionStorage.setItem(k,v);}catch{}},del:k=>{try{sessionStorage.removeItem(k);}catch{}}};
let saved=null;try{saved=localStorage.getItem('kalmar-lang');}catch{}
const resume=Boolean(ss.get('kalmar-resume'));
const beat=Number(ss.get('kalmar-alive')||0),died=beat>0;
// Died while in use (a recent heartbeat) is a crash; an old one is a tab Safari put away in the background.
let crashes=+(ss.get('kalmar-crashes')||0);if(died&&Date.now()-beat<20000)ss.set('kalmar-crashes',String(++crashes));
const splash=document.getElementById('loading'),pickBox=splash.querySelector('.lang-pick'),load=splash.querySelector('.splash-load');

// Fetch what every visit needs while the visitor reads the first screen.
for(const u of ['city/map.json','city/tiles/tiles.json','models/crowd/crowd.json','models/vehicles.glb',...(__PACK__.addresses?['city/addresses.json']:[])])fetch(u).catch(()=>{});

function start(lang){
  window.__kalmarLang=lang;save('kalmar-lang',lang);document.documentElement.lang=lang;
  window.__kalmarSafe=crashes>0;
  splash.classList.add('chosen');pickBox.hidden=true;load.hidden=false;
  document.getElementById('load-text').textContent=crashes>0
    ?(lang==='en'?'Starting again with less detail, so the phone can keep up …':'Startar om med mindre detaljer så att telefonen orkar …')
    :(lang==='en'?`Loading ${__PLACE__.en.centre} …`:`Laddar ${__PLACE__.sv.centre} …`);
  const alive=()=>ss.set('kalmar-alive',String(Date.now()));alive();setInterval(alive,4000);
  addEventListener('pagehide',()=>ss.del('kalmar-alive'));
  import('./main.js');
}
const given=params.get('lang'),lastLang=given==='en'||(!given&&saved==='en')?'en':'sv';
if(crashes>=3){
  // Out of memory again and again: say so instead of looping.
  pickBox.hidden=true;load.hidden=false;
  const en=saved==='en';
  document.getElementById('load-text').textContent=en?'This page needs more memory than the phone has free right now. Close other tabs and try again – or open it on a computer.':'Sidan behöver mer minne än telefonen har ledigt just nu. Stäng andra flikar och försök igen – eller öppna den på en dator.';
  splash.querySelector('.meter').hidden=true;
  const retry=document.createElement('button');retry.className='splash-retry';retry.textContent=en?'Try again':'Försök igen';
  retry.onclick=()=>{ss.del('kalmar-crashes');ss.del('kalmar-alive');location.reload();};load.append(retry);
}
else if(given||params.has('film')||resume||died)start(lastLang);
else{
  // The last choice (or the browser's language) is the default: Enter picks it.
  const def=saved||((navigator.language||'sv').startsWith('sv')?'sv':'en');
  const buttons=[...pickBox.querySelectorAll('button')];
  for(const b of buttons){b.onclick=()=>start(b.dataset.lang);if(b.dataset.lang===def)b.classList.add('default');}
  buttons.find(b=>b.dataset.lang===def)?.focus();
}
