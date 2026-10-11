import { el, sparkline, ring, doughnutChart, centuryChart, tooltip } from './charts.js';
import { LEVERS, THEMES, LEVELS, LEVER, WORLDS, CAPACITY_NOTE } from '../data/levers.js';
import { SDGS, DOUGHNUT } from '../data/sdg.js';
import { INDICATORS, KEY_FIGURES } from '../data/indicators.js';
import { PLACES } from '@city/places.js';
import { LEVER_EVIDENCE, EVIDENCE, BASELINE, QUOTES } from '../data/evidence.js';
import { NEEDS } from '../residents.js';
import { run, bands, PRESETS, START, END, planHash, parsePlanHash } from '../scenario.js';
import { flooded, FLOOD } from '../model.js';
import { t, L, LANG, LANGS, LOCALE, setLang, dec, pct as fmtPct } from '../i18n.js';
import { createJourney } from './journey.js';
import { FAMILY, FAMILY_INTRO, FAMILY_TITLE, lifespans, alive, familyText } from '@city/family.js';
import { CITY, PLACE, FILM } from '../city-config.js';
import { visionSections } from '@city/vision-text.js';
import { createCallouts } from './callouts.js';
import { AR_SPOTS, arSpec } from '@city/ar.js';
import { CHANGES, ranked, changeSpec } from '@city/changes.js';
import { weatherOf } from '../weather.js';
import { drawPostcard } from './postcard.js';
import { buildPrintout, printout } from './printout.js';

// The interface around the 3D city: levers on the left, goals/doughnut/figures/chronicle on the right,
// the century timeline at the bottom, a Sims-style card for the selected resident, and pins for places.
const THEME=Object.fromEntries(THEMES.map(th=>[th.id,th]));
const mean=a=>a.reduce((s,v)=>s+v,0)/a.length;
const lerp=(a,b,k)=>a+(b-a)*k;

// The place's research-based vision (its first) and the ones that contrast with it.
const VISION=PRESETS[1]||PRESETS[0],OTHERS=PRESETS.slice(2);
const list=(a,and)=>a.length<2?a.join(''):`${a.slice(0,-1).join(', ')} ${and} ${a.at(-1)}`;
export function createApp(engine){
  const app=document.getElementById('app');
  const S={mode:'start',world:'ssp245',events:true,schedule:[],run:null,year:START,playing:false,tab:'vision',speed:1,selected:null,preset:null,journey:null};
  // ---------- Accessibility ----------
  // Icon buttons get a name and what changes is said in a polite live region; a wish for less motion
  // turns the camera's glides into cuts and stops the animations (camera.js, style.css).
  const named=(b,text)=>{b.setAttribute('aria-label',text);b.title=text;return b;};
  const live=el('div','sr-only');live.setAttribute('role','status');live.setAttribute('aria-live','polite');document.body.append(live);
  const say=text=>{live.textContent='';setTimeout(()=>{live.textContent=text;},80);};
  // Keyboard users can skip past the controls to the vision in words.
  const skip=el('a','skip-link',t('Hoppa till visionen i text','Skip to the vision in words','Salta alla visione in parole'));skip.href='#right';
  skip.onclick=e=>{e.preventDefault();rightP.classList.remove('closed');syncToggles();setTab('vision');rb.tabIndex=-1;rb.focus();};
  document.body.prepend(skip);
  // ---------- Top bar ----------
  // One bar, three columns (brand | year | actions); the clock lives in the bottom bar with the timeline.
  const top=el('div');top.id='topbar';
  const brand=el('div','brand');brand.append(el('b','',`${CITY.title}`),el('span','',t('Ett sekel framåt – en hållbar vision','A century ahead – a sustainable vision','Un secolo avanti – una visione sostenibile')));
  const yearBox=el('div','year-box');const yearEl=el('div','year','2026'),eraEl=el('div','era',t(`Dagens ${PLACE.name}`,`${PLACE.name} today`,`${PLACE.name} oggi`));yearBox.append(yearEl,eraEl);
  const right=el('div','top-right');
  const clock=el('div','clock');const sun=el('span','','☀'),time=el('span','time','13:30');clock.append(sun,time);
  const speeds=el('div','seg');[['⏸',0],['1×',1],['10×',10],['60×',60]].forEach(([lab,v])=>{const b=el('button',v===1?'on':'',lab);named(b,v?t(`Klockan går ${v} gånger fortare`,`The clock runs ${v} times faster`,`L'orologio va ${v} volte più veloce`):t('Pausa dygnet','Pause the day','Metti in pausa la giornata'));b.setAttribute('aria-pressed',String(v===1));b.onclick=()=>{S.speed=v;[...speeds.children].forEach(x=>{x.classList.toggle('on',x===b);x.setAttribute('aria-pressed',String(x===b));});};speeds.append(b);});
  // Speaker icon drawn in the ink colour (emoji speakers render red on some systems).
  const speaker=on=>`<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H3v6h3l5 4z" fill="currentColor"/>${on?'<path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/>':'<path d="m16 9 6 6M22 9l-6 6"/>'}</svg>`;
  const soundBtn=el('button','icon-btn sound');soundBtn.innerHTML=speaker(false);soundBtn.title=t('Ljud på/av','Sound on/off',"Attiva/disattiva l'audio");soundBtn.setAttribute('aria-label',soundBtn.title);
  const setSound=on=>{soundBtn.innerHTML=speaker(on);soundBtn.classList.toggle('on',on);};
  soundBtn.onclick=async()=>setSound(await engine.audio.toggle());
  // Upplev opens the choice of walking, cycling or the robot taxi; like AR and Compare it is green only
  // while it is in use (on the streets), so it never looks already chosen.
  const rideBtn=el('button','btn ride-btn');rideBtn.innerHTML=`<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="13.5" cy="4.5" r="2"/><path d="M12.5 8.5 11 14l-3 6M11 14l3.5 2.5 1 3.5M7.5 12l4-3.5 4 3"/></svg><span>${t('Upplev','Explore','Esplora')}</span>`;
  rideBtn.title=t('Gå, cykla eller åk robottaxi genom staden','Walk, cycle or take a robot taxi through the city','Cammina, pedala o prendi un robotaxi per la città');rideBtn.onclick=()=>showRideMenu();
  const arBtn=el('button','btn','AR');arBtn.title=t('Förklaringar i staden – värden för valt år','Explanations in the city – values for the chosen year',"Spiegazioni nella città – valori per l'anno scelto");
  arBtn.onclick=()=>{S.ar=!S.ar;arBtn.classList.toggle('primary',S.ar);if(!S.ar)callouts.clear(performance.now()/1000);arTimer=0;story.until=0;story.marked=[];};
  const cmpBtn=el('button','btn cmp',t('⇆ Jämför','⇆ Compare','⇆ Confronta'));cmpBtn.title=t('Delad skärm: 2026 till vänster, valt år till höger','Split screen: 2026 on the left, the chosen year on the right',"Schermo diviso: il 2026 a sinistra, l'anno scelto a destra");
  cmpBtn.onclick=()=>{S.compare=!S.compare;cmpBtn.classList.toggle('primary',S.compare);engine.setCompare(S.compare);};
  const cardBtn=el('button','btn card-btn');cardBtn.innerHTML=`<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M4 7.5h3.2L9 5h6l1.8 2.5H20a1 1 0 0 1 1 1V18a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8.5a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="3.4"/></svg>${t('Vykort','Postcard','Cartolina')}`;
  cardBtn.title=t('Spara vyn som ett vykort med år och vad som ändrats','Save the view as a postcard with the year and what has changed',"Salva la vista come cartolina, con l'anno e ciò che è cambiato");cardBtn.onclick=()=>showPostcard();
  // The other languages: the button takes the first, the menu offers each (Venice: Italian, English, Swedish).
  const OTHER=LANGS.filter(l=>l!==LANG),SWITCH={sv:'Byt till svenska',en:'Switch to English',it:"Passa all'italiano"},IN={sv:'På svenska',en:'In English',it:'In italiano'};
  const langBtn=el('button','btn ghost',OTHER[0].toUpperCase());named(langBtn,SWITCH[OTHER[0]]);langBtn.lang=OTHER[0];
  const switchLang=(l=OTHER[0])=>setLang(l,S.run?planNow():'');langBtn.onclick=()=>switchLang();langBtn.classList.add('lang-btn');
  // The menu: start screen, share, about, sources.
  const menuWrap=el('div','menu-wrap');const menuBtn=el('button','btn menu-btn',t('Meny ▾','Menu ▾','Menu ▾'));const menu=el('div','panel menu hidden');
  for(const [label,fn] of [[t('Spara ett vykort','Save a postcard','Salva una cartolina'),()=>showPostcard()],[t('Skriv ut min vision','Print my vision','Stampa la mia visione'),()=>printPlan()],...(FILM?[[t('Se filmen','Watch the film','Guarda il film'),()=>showFilm()]]:[]),[t('Startmenyn','Start screen','Schermata iniziale'),()=>showStart()],[t('Dela din plan','Share your plan','Condividi il tuo piano'),()=>sharePlan()],[t('Om modellen','About the model','Informazioni sul modello'),()=>showAbout()],[t('Källor','Sources','Fonti'),()=>showSources()]]){
    const b=el('button','menu-item',label);b.onclick=()=>{menuOpen(false);fn();};menu.append(b);}
  // On phones the language switch lives in the menu.
  for(const l of OTHER){const b=el('button','menu-item menu-lang',IN[l]);b.lang=l;b.onclick=()=>switchLang(l);menu.append(b);}
  menuBtn.setAttribute('aria-haspopup','true');menuBtn.setAttribute('aria-expanded','false');
  const menuOpen=on=>{menu.classList.toggle('hidden',!on);menuBtn.setAttribute('aria-expanded',String(on));if(on)menu.querySelector('button')?.focus();};
  menuBtn.onclick=e=>{e.stopPropagation();menuOpen(menu.classList.contains('hidden'));};
  menu.addEventListener('keydown',e=>{if(e.key==='Escape'){e.stopPropagation();menuOpen(false);menuBtn.focus();}});
  addEventListener('click',e=>{if(!menuWrap.contains(e.target))menuOpen(false);});
  menuWrap.append(menuBtn,menu);
  right.append(rideBtn,arBtn,cmpBtn,cardBtn,el('div','top-sep'),soundBtn,langBtn,menuWrap);
  top.className='panel';top.append(brand,yearBox,right);app.append(top);

  // ---------- Left: levers ----------
  const left=el('div','panel');left.id='left';
  const lh=el('div','panel-head');const lt=el('h2','',t(`Vägval för ${PLACE.name}`,`Choices for ${PLACE.name}`,`Scelte per ${PLACE.name}`));const lp=el('p','',t('Välj hur långt kommunen ska gå inom varje område. Ändringarna gäller från 2026 och genomförs i den takt staden orkar.','Choose how far the municipality should go in each area. Changes apply from 2026 and are carried out as fast as the city can manage.','Scegli fin dove deve spingersi il Comune in ogni ambito. Le modifiche valgono dal 2026 e si realizzano al ritmo che la città riesce a sostenere.'));
  const cap=el('div','capacity');const capRow=el('div','row');const capL=el('span','',t('Stadens förmåga','The city\'s capacity','Capacità della città')),capR=el('span','','');capRow.append(capL,capR);
  const meter=el('div','meter');const meterFill=el('i');meter.append(meterFill);cap.append(capRow,meter);
  const capNote=el('p','small muted','');capNote.style.margin='6px 0 0';cap.append(capNote);
  lh.append(lt,lp,cap);
  const lb=el('div','panel-body');
  const leverRows={};
  for(const theme of THEMES){
    if(!LEVERS.some(l=>l.theme===theme.id))continue;   // a theme the place has no levers in
    const box=el('div','theme');const tt=el('div','theme-title');const sw=el('i');sw.style.background=theme.color;tt.append(sw,document.createTextNode(theme.name));box.append(tt);
    for(const lever of LEVERS.filter(l=>l.theme===theme.id)){
      const row=el('div','lever');const head=el('div','lever-top');const name=el('div','lever-name',lever.name);
      const info=named(el('button','info','i'),t(`Forskningen bakom ${lever.name}`,`The research behind ${lever.name}`,`Cosa dice la ricerca: ${lever.name}`));info.onclick=()=>showLever(lever.id);
      head.append(name,info);
      const levels=el('div','levels');levels.setAttribute('role','group');levels.setAttribute('aria-label',lever.name);const buttons=LEVELS.map((label,i)=>{const b=el('button','',[t('Idag','Today','Oggi'),t('Stadig','Steady','Graduale'),t('Ambitiös','Ambitious','Ambizioso'),t('Radikal','Radical','Radicale')][i]);b.title=lever.levels[i];b.onclick=()=>setLever(lever.id,i);levels.append(b);return b;});
      const desc=el('div','lever-desc',lever.levels[0]);
      const impl=el('div','impl');const implFill=el('i');implFill.style.background=theme.color;impl.append(implFill);
      row.append(head,levels,desc,impl);box.append(row);
      leverRows[lever.id]={buttons,desc,implFill,theme,row};
    }
    lb.append(box);
  }
  const worldBox=el('div','theme');const wt=el('div','theme-title');wt.append(document.createTextNode(t(`Världen runt ${PLACE.name}`,`The world around ${PLACE.name}`,`Il mondo intorno a ${PLACE.name}`)));worldBox.append(wt);
  const worlds=el('div','worlds');worlds.style.padding='0 6px';
  worlds.setAttribute('role','group');worlds.setAttribute('aria-label',t(`Världen runt ${PLACE.name}`,`The world around ${PLACE.name}`,`Il mondo intorno a ${PLACE.name}`));
  const worldButtons=WORLDS.map(w=>{const b=el('button','');b.append(el('b','',w.name),el('span','small muted',w.short));b.onclick=()=>{S.world=w.id;resimulate();};worlds.append(b);return [w.id,b];});
  const evToggle=el('label','small');evToggle.style.cssText='display:flex;gap:8px;align-items:center;margin:10px 8px;color:var(--ink-2)';
  const evBox=el('input');evBox.type='checkbox';evBox.checked=true;evBox.onchange=()=>{S.events=evBox.checked;resimulate();};evToggle.append(evBox,document.createTextNode(`${t('Kriser och händelser','Crises and events','Crisi ed eventi')} (${PLACE.crises||t('torka, översvämning, pandemi …','drought, floods, pandemic …','siccità, alluvioni, pandemie …')})`));   // the place's own (config.js crises)
  worldBox.append(worlds,evToggle);lb.append(worldBox);
  left.append(lh,lb);app.append(left);
  // Edge handles: always visible on the panel's outer edge; when the panel is folded away they stay at
  // the screen edge, so it is clear where it went. (On phones they are buttons above the timeline.)
  const toggleL=el('button','edge-handle edge-left');toggleL.innerHTML=`<span class="chev">‹</span><span class="lab">${t('Vägval','Choices','Scelte')}</span>`;toggleL.title=t('Fäll ihop eller visa vägvalen','Fold or show the choices','Chiudi o mostra le scelte');toggleL.onclick=()=>{left.classList.toggle('closed');if(narrow()&&!left.classList.contains('closed'))rightP.classList.add('closed');syncToggles();};
  app.append(toggleL);


  // ---------- Right: dashboard ----------
  const rightP=el('div','panel');rightP.id='right';
  const tabs=el('div','tabs');
  const TABS=[['vision',t('Visionen','Vision','Visione')],['mal',t('Mål','Goals','Obiettivi')],['munk',t('Munken','Doughnut','Ciambella')],['tal',t('Siffror','Figures','Numeri')],['slakt',t('Släkten','Family','Famiglia')],['kronika',t('Krönika','Chronicle','Cronaca')]];
  const tabButtons=TABS.map(([id,label])=>{const b=el('button',id===S.tab?'on':'',label);b.id='tab-'+id;b.setAttribute('role','tab');b.setAttribute('aria-selected',String(id===S.tab));b.tabIndex=id===S.tab?0:-1;b.setAttribute('aria-controls','tabpanel');b.onclick=()=>setTab(id);tabs.append(b);return b;});
  tabs.setAttribute('role','tablist');tabs.setAttribute('aria-label',t('Visionen och siffrorna','The vision and the figures','La visione e i numeri'));
  // Arrow keys move between the tabs (and choose them), as in any tab list.
  tabs.addEventListener('keydown',e=>{const d={ArrowRight:1,ArrowLeft:-1}[e.key];if(!d)return;e.preventDefault();e.stopPropagation();
    const i=(TABS.findIndex(x=>x[0]===S.tab)+d+TABS.length)%TABS.length;setTab(TABS[i][0]);tabButtons[i].focus();});
  function setTab(id){S.tab=id;tabButtons.forEach((x,i)=>{const on=TABS[i][0]===id;x.classList.toggle('on',on);x.setAttribute('aria-selected',String(on));x.tabIndex=on?0:-1;});rb.setAttribute('aria-labelledby','tab-'+id);renderDashboard(true);}

  const rb=el('div','panel-body');rb.id='tabpanel';rb.setAttribute('role','tabpanel');
  rightP.append(tabs,rb);app.append(rightP);
  const toggleR=el('button','edge-handle edge-right');toggleR.innerHTML=`<span class="lab">${t('Visionen & data','Vision & data','Visione & dati')}</span><span class="chev">›</span>`;toggleR.title=t('Fäll ihop eller visa visionen och siffrorna','Fold or show the vision and figures','Chiudi o mostra la visione e i numeri');toggleR.onclick=()=>{rightP.classList.toggle('closed');if(narrow()&&!rightP.classList.contains('closed'))left.classList.add('closed');syncToggles();};app.append(toggleR);

  // On a phone the panels are bottom sheets, closed until asked for.
  function narrow(){return matchMedia('(max-width:900px)').matches;}
  function syncToggles(){
    const lc=left.classList.contains('closed'),rc=rightP.classList.contains('closed');
    // Sideways on a wide screen; on a phone the sheets come up from the bottom.
    const nw=narrow();toggleL.querySelector('.chev').textContent=nw?(lc?'▴':'▾'):lc?'›':'‹';toggleR.querySelector('.chev').textContent=nw?(rc?'▴':'▾'):rc?'‹':'›';
    toggleL.classList.toggle('is-closed',lc);toggleR.classList.toggle('is-closed',rc);toggleL.setAttribute('aria-expanded',String(!lc));toggleR.setAttribute('aria-expanded',String(!rc));
    document.body.classList.toggle('sheet-open',narrow()&&!(lc&&rc));
    toggleL.classList.toggle('hidden',S.mode==='journey'&&!narrow()&&false);
  }
  if(narrow()){left.classList.add('closed');rightP.classList.add('closed');}
  syncToggles();addEventListener('resize',syncToggles);
  // ---------- The story ----------
  // While the century plays (or a decade of the journey runs) a marker says what has changed since 2026
  // where it can be seen (ui/changes.js); the news arrives as it happens, and the years hold while it is
  // read and its weather passes. A click on the timeline marks the largest changes in view for that
  // year. The camera never moves on its own – it stays where the user put it, so the eye stays on what
  // happens rather than on the camera.
  const story={next:0,seen:{},marked:[],until:0,refresh:0,told:new Set(),hold:0,toast:null,toastTime:0};
  // ---------- Timeline ----------
  const tl=el('div','panel');tl.id='timeline';
  const playBox=el('div','tl-play');const play=el('button','icon-btn','▶');named(play,t('Spela upp seklet','Play the century','Riproduci il secolo'));play.onclick=()=>togglePlay();
  const setPlayIcon=()=>{play.textContent=S.playing?'❚❚':'▶';named(play,S.playing?t('Pausa seklet','Pause the century','Metti in pausa il secolo'):t('Spela upp seklet','Play the century','Riproduci il secolo'));};
  const playLabel=el('div','tl-label',t('Spela seklet','Play the century','Riproduci il secolo'));playBox.append(play,playLabel);
  const track=el('div','tl-track');const tsvg=document.createElementNS('http://www.w3.org/2000/svg','svg');const thumb=el('div','tl-thumb');const tev=el('div','tl-events');
  track.append(tsvg,tev,thumb);
  // Time of day: clock above the day speeds.
  const dayBox=el('div','tl-day');dayBox.append(clock,speeds);
  tl.append(playBox,track,el('div','tl-sep'),dayBox);app.append(tl);
  let chartGeo=null;
  // The hint over the city when the timeline seems to do nothing (timeHint below).
  const planEmpty=()=>S.schedule.every(p=>Object.values(p.set).every(v=>!v));
  let hint=null,hintSeen=new Set(),hintTimer=0;
  const yearAt=e=>{const r=track.getBoundingClientRect();return START+Math.max(0,Math.min(1,(e.clientX-r.left)/r.width))*(END-START);};
  let dragging=false;
  track.addEventListener('pointerdown',e=>{if(S.mode==='journey'){timeHint('journey');return;}dragging=true;track.setPointerCapture(e.pointerId);S.playing=false;setPlayIcon();unmark();setYear(yearAt(e));});
  track.addEventListener('pointermove',e=>{
    if(dragging){setYear(yearAt(e));return;}
    if(!S.run)return;const y=Math.round(yearAt(e)),d=S.run.years[y-START];
    tooltip(e.clientX,e.clientY,[`${t(`${PLACE.name}-index`,`${PLACE.name} index`,`Indice ${PLACE.name}`)} ${Math.round(mean(d.sdg))}`,String(y),t('Medel av de 17 målen, 100 = målbilden','Mean of the 17 goals, 100 = the target','Media dei 17 obiettivi, 100 = il traguardo')]);
  });
  track.addEventListener('pointerup',()=>{if(dragging){markChanges();tellYear();}dragging=false;});track.addEventListener('pointerleave',()=>tooltip());
  // For the keyboard and screen readers the timeline's thumb is a slider: the arrows step a year, Page
  // Up and Page Down a decade, Home and End go to 2026 and 2126. (The thumb, not the whole track, so the
  // events on the track stay buttons of their own.)
  thumb.tabIndex=0;thumb.setAttribute('role','slider');thumb.setAttribute('aria-label',t('År','Year','Anno'));thumb.setAttribute('aria-valuemin',START);thumb.setAttribute('aria-valuemax',END);
  let keyTimer=0;
  thumb.addEventListener('keydown',e=>{
    const step={ArrowRight:1,ArrowUp:1,ArrowLeft:-1,ArrowDown:-1,PageUp:10,PageDown:-10}[e.key];
    const to=e.key==='Home'?START:e.key==='End'?END:step!=null?Math.floor(S.year)+step:null;
    if(to==null)return;e.preventDefault();e.stopPropagation();
    if(S.mode==='journey'){timeHint('journey');return;}
    if(S.playing)togglePlay(false);unmark();setYear(to);
    clearTimeout(keyTimer);keyTimer=setTimeout(()=>{markChanges();tellYear();},700);
  });

  // ---------- Inspector ----------
  const insp=el('div','panel hidden-soft');insp.id='inspector';
  const ih=el('div','res-head');const avatar=el('div','avatar','');const ihText=el('div');const iName=el('h3','',''),iSub=el('p','','');ihText.append(iName,iSub);
  const iClose=named(el('button','icon-btn','×'),t('Stäng','Close','Chiudi'));iClose.style.cssText='margin-left:auto;width:28px;height:28px';iClose.onclick=()=>select(null);
  ih.append(avatar,ihText,iClose);
  const actLine=el('div','small muted','');actLine.style.marginTop='8px';const thought=el('div','thought','');const needs=el('div','needs');const needBars={};
  for(const n of NEEDS){const l=el('span','',n.name);const b=el('div','bar');const f=el('i');b.append(f);needs.append(l,b);needBars[n.id]=f;}
  const actions=el('div','res-actions');const follow=el('button','btn',t('Följ','Follow','Segui'));follow.onclick=()=>{if(S.selected){engine.follow(S.selected);follow.textContent=t('Följer …','Following …','Sto seguendo …');}};
  const another=el('button','btn ghost',t('Någon annan','Someone else','Qualcun altro'));another.onclick=()=>{const vis=engine.residents.people.filter(p=>p.visible);if(vis.length)select(vis[Math.floor(Math.random()*vis.length)],true);};
  actions.append(follow,another);
  insp.append(ih,actLine,thought,needs,actions);insp.setAttribute('role','region');insp.setAttribute('aria-label',t('Invånaren','The resident',"L'abitante"));app.append(insp);

  // ---------- Pins ----------
  const pinLayer=el('div','pins');app.append(pinLayer);
  const pins=PLACES.map(p=>{const pin=el('button','pin');const lab=el('span');const dot=el('i');lab.append(dot,document.createTextNode(p.name));pin.append(lab);pin.onclick=()=>showPlace(p);pinLayer.append(pin);return {p,pin,dot};});

  // ---------- Behaviour ----------
  function setLever(id,level){
    if(S.mode==='journey')return;
    S.preset=null;
    const first=S.schedule.find(s=>s.from===START)||(S.schedule.unshift({from:START,set:{}}),S.schedule[0]);
    // Changing a lever in the free mode rewrites the plan from 2026: one clear policy.
    for(const s of S.schedule)if(s.from>START)delete s.set[id];
    first.set[id]=level;resimulate();
  }
  function currentPolicy(){return S.run?S.run.years[Math.min(END,Math.floor(S.year))-START].policy:{};}
  // The uncertainty band is 24 more runs of the same plan (model.js ensemble()); it follows a moment
  // after the plan itself so that choosing stays instant, also on phones.
  let bandTimer=0;
  function resimulate(){
    S.run=run(S.schedule,{world:S.world,events:S.events});S.band=null;if(hint&&!planEmpty())timeHint(null);
    worldButtons.forEach(([id,b])=>{b.classList.toggle('on',id===S.world);b.setAttribute('aria-pressed',String(id===S.world));});
    drawCentury();renderLevers();renderDashboard(true);applyYear(true);
    clearTimeout(bandTimer);
    bandTimer=setTimeout(()=>{const r=S.run;const b=bands(S.schedule,{world:S.world,events:S.events});if(S.run!==r)return;S.band=b;drawCentury();renderDashboard(true);},150);
  }
  const bandOf=k=>S.band&&S.band.lo[k]?{lo:S.band.lo[k],hi:S.band.hi[k]}:null;
  function drawCentury(){
    const vals=S.run.years.map(y=>mean(y.sdg));
    chartGeo=centuryChart(tsvg,S.run.years.map(y=>y.year),vals,{band:S.band?.sdg||null});
    tev.replaceChildren();
    for(const c of S.run.chronicle){
      const b=named(el('button','tl-event',c.icon),`${c.year}: ${c.title}`);const col=c.good||c.severity<.3?'var(--good)':c.severity<.6?'var(--warning)':'var(--critical)';
      b.style.left=`${(c.year-START)/(END-START)*100}%`;b.style.borderColor=col;
      b.onpointermove=e=>{e.stopPropagation();tooltip(e.clientX,e.clientY,[c.title,String(c.year),c.text.slice(0,140)+(c.text.length>140?' …':'')]);};
      b.onpointerdown=e=>e.stopPropagation();
      b.onpointerleave=()=>tooltip();
      b.onclick=e=>{e.stopPropagation();if(S.mode!=='journey'){S.playing=false;setPlayIcon();setYear(c.year+.5);}setTab('kronika');};
      tev.append(b);
    }
  }
  function renderLevers(){
    const p=currentPolicy(),y=S.run.years[Math.floor(S.year)-START];
    for(const l of LEVERS){
      const r=leverRows[l.id],lvl=p[l.id]||0;
      r.buttons.forEach((b,i)=>{b.classList.toggle('on',i===lvl);b.setAttribute('aria-pressed',String(i===lvl));b.style.background=i===lvl?r.theme.color:'';b.disabled=S.mode==='journey';});
      r.desc.textContent=l.levels[lvl];
      r.implFill.style.width=`${Math.round((y?.I[l.id]||0)*100)}%`;
    }
    const d=y.ind,ratio=d.demand/Math.max(1,d.capacity);
    meterFill.style.width=`${Math.min(100,ratio*100)}%`;meter.className='meter'+(ratio>1.15?' over':ratio>.9?' warn':'');
    capR.textContent=t(`${Math.round(ratio*100)} % använd`,`${Math.round(ratio*100)}% used`,`${Math.round(ratio*100)}% utilizzata`);
    capNote.textContent=ratio>1.15?t('Staden tar på sig mer än den orkar: allt går långsammare och tilliten sjunker.','The city is taking on more than it can manage: everything slows down and trust falls.','La città si sta caricando di più di quanto riesca a sostenere: tutto rallenta e la fiducia cala.')+(CAPACITY_NOTE?' '+t(CAPACITY_NOTE.sv,CAPACITY_NOTE.en,CAPACITY_NOTE.it):''):ratio>.9?t('Nära gränsen för vad staden orkar just nu.','Close to the limit of what the city can manage right now.','Vicino al limite di ciò che la città riesce a sostenere in questo momento.'):t('Det finns utrymme för fler satsningar.','There is room for more initiatives.',"C'è spazio per altre iniziative.");
  }
  let lastDash=0,lastYearShown=-1,dashPending=false;
  function renderDashboard(force=false){
    const now=performance.now();if(!force&&now-lastDash<180){dashPending=true;return;}
    const yi=Math.min(END,Math.floor(S.year))-START,d=S.run.years[yi],base=S.run.years[0];
    dashPending=false;
    if(!force&&yi===lastYearShown)return;lastDash=now;lastYearShown=yi;
    rb.replaceChildren();
    if(S.tab==='mal'){
      const ov=el('div','overall');const avg=mean(d.sdg),b0=mean(base.sdg);
      const big=el('div','big',String(Math.round(avg)));const box=el('div');const h=el('b','',t(`${PLACE.name}-index`,`${PLACE.name} index`,`Indice ${PLACE.name}`));
      const p=el('p','',t(`Medel av de 17 globala målen, där 100 betyder att målbilden för ett hållbart ${PLACE.name} är nådd. ${yi?`2026: ${Math.round(b0)}.`:''}`,`Mean of the 17 global goals, where 100 means the target for a sustainable ${PLACE.name} is reached. ${yi?`2026: ${Math.round(b0)}.`:''}`,`Media dei 17 obiettivi globali, dove 100 significa aver raggiunto il traguardo di una ${PLACE.name} sostenibile. ${yi?`2026: ${Math.round(b0)}.`:''}`));box.append(h,p);ov.append(big,box);rb.append(ov);
      const grid=el('div','sdg-grid');
      SDGS.forEach((g,i)=>{
        const tile=el('button','sdg');const num=el('div','num',String(g.n));num.style.background=g.color;
        const r=ring(d.sdg[i],g.color);const dv=d.sdg[i]-base.sdg[i];
        const delta=el('div','delta '+(Math.abs(dv)<1?'flat':dv>0?'up':'down'),yi?(Math.abs(dv)<1?'±0':`${dv>0?'▲':'▼'} ${Math.abs(Math.round(dv))}`):'');
        tile.append(num,r,el('div','name',g.name),delta);tile.onclick=()=>showGoal(i);grid.append(tile);
      });
      rb.append(grid);
    }else if(S.tab==='munk'){
      const w=el('div','doughnut-wrap');
      const intro=el('p','small',t('Doughnut-ekonomi (Kate Raworth): den gröna ringen är det trygga och rättvisa utrymmet. Röda kilar inåt är brister i den sociala grunden; röda kilar utåt är överskridna ekologiska gränser.','Doughnut economics (Kate Raworth): the green ring is the safe and just space. Red wedges pointing inwards are shortfalls in the social foundation; red wedges pointing outwards are overshot ecological limits.',"Economia della ciambella (Kate Raworth): l'anello verde è lo spazio sicuro e giusto. I cunei rossi verso l'interno sono carenze nelle fondamenta sociali; quelli verso l'esterno sono limiti ecologici superati."));intro.style.cssText='margin:6px 10px 4px;color:var(--ink-2);line-height:1.4';
      w.append(intro,doughnutChart(d.doughnut,DOUGHNUT));
      const leg=el('div','legend');for(const [c,lab] of [['#8fcca5',t('Tryggt och rättvist utrymme','Safe and just space','Spazio sicuro e giusto')],['#d03b3b',t('Brist / överskridande','Shortfall / overshoot','Carenza / superamento')]]){const s=el('span');const i=el('i');i.style.background=c;s.append(i,document.createTextNode(lab));leg.append(s);}
      w.append(leg);
      const list=el('div','dim-list');
      for(const [kind,label,dims,max] of [['social',t('Social grund – brister','Social foundation – shortfalls','Fondamenta sociali – carenze'),DOUGHNUT.social,1],['ecological',t('Ekologiskt tak – överskridanden','Ecological ceiling – overshoots','Tetto ecologico – superamenti'),DOUGHNUT.ecological,1.5]]){
        list.append(el('h5','',label));
        for(const [id,name] of dims){const v=d.doughnut[kind][id];const row=el('div','dim-row');const bar=el('div','bar');const f=el('i');f.style.width=`${Math.min(100,v/max*100)}%`;f.style.background=v<.1?'var(--good)':v<.4?'var(--warning)':'var(--critical)';bar.append(f);row.append(el('span','',name),bar,el('b','',`${Math.round(v*100)}%`));list.append(row);}
      }
      w.append(list);rb.append(w);
    }else if(S.tab==='tal'){
      const tiles=el('div','tiles');
      for(const k of KEY_FIGURES){
        const meta=INDICATORS[k];const vals=S.run.years.map(y=>y.ind[k]);const v=vals[yi],v0=vals[0];
        const tile=el('div','tile');tile.append(el('div','label',meta.name));
        const val=el('div','value',meta.fmt(v));tile.append(val,el('div','unit',meta.unit));
        if(yi){const dv=v-v0,good=meta.better===0?null:dv*meta.better>0,small=Math.abs(dv)<Math.abs(v0)*.02+1e-6;
          tile.append(el('div','delta '+(small?'flat':good===null?'flat':good?'up':'down'),small?t('oförändrat','unchanged','invariato'):`${dv>0?'▲':'▼'} ${t('från','from','da')} ${meta.fmt(v0)}`));}
        tile.append(sparkline(vals,{index:yi,width:150,height:30,color:THEME[meta.theme]?.color||'#2f7d4f',fmt:meta.fmt,years:S.run.years.map(y=>y.year),band:bandOf(k)}));
        if(meta.assumption){const f=el('span','flag',t('modell','model','modello'));f.title=t('Modellbegrepp eller antagande – se "Om modellen"','Model concept or assumption – see "About the model"','Concetto del modello o ipotesi – vedi "Informazioni sul modello"');tile.append(f);}
        if(k==='floodShare'){tile.classList.add('clickable');tile.classList.toggle('on',Boolean(S.floodPreview));tile.title=FLOOD?.kind==='lake'?(S.floodPreview?t('Klicka för att dölja högvattnet','Click to hide the high water','Clicca per nascondere la piena'):t('Klicka för att se ett 100-årshögvatten i 3D just det här året','Click to see a 100-year high water in 3D in this very year',"Clicca per vedere in 3D una piena centenaria proprio in quest'anno"))
          :S.floodPreview?t('Klicka för att dölja stormen','Click to hide the storm',"Clicca per nascondere l'acqua alta"):t('Klicka för att se en 100-årsstorm i 3D just det här året','Click to see a 100-year storm in 3D in this very year',"Clicca per vedere in 3D un'acqua alta centenaria proprio in quest'anno");
          tile.onclick=()=>{S.floodPreview=!S.floodPreview;if(S.floodPreview)engine.flyTo(150,40);applyYear();renderDashboard(true);};
          tile.setAttribute('role','button');tile.tabIndex=0;tile.setAttribute('aria-pressed',String(Boolean(S.floodPreview)));tile.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();tile.onclick();}};}
        const src=meta.base&&BASELINE[meta.base];
        if(src){tile.title=`2026: ${src.value} ${src.unit} (${src.year}, ${src.scope}). ${t('Källa','Source','Fonte')}: ${src.source.publisher}`;tile.style.cursor='help';}
        tiles.append(tile);
      }
      rb.append(tiles);
      rb.append(el('p','band-note',t('Det ljusa bandet runt varje kurva är en trolig spännvidd: samma plan körd 24 gånger med andra rimliga antaganden om takt, trender, havsnivå och händelser (10–90 %). Ju längre fram, desto bredare.','The pale band around each curve is a likely range: the same plan run 24 times with other reasonable assumptions about pace, trends, sea level and events (10–90%). The further ahead, the wider.','La banda chiara intorno a ogni curva è un intervallo probabile: lo stesso piano calcolato 24 volte con altre ipotesi ragionevoli su ritmo, tendenze, livello del mare ed eventi (10–90%). Più avanti si guarda, più si allarga.')));
    }else if(S.tab==='vision'){
      const y=Math.floor(S.year),w=el('div','chron');
      const h=el('h3','',y===START?`${PLACE.name} 2026`:`${PLACE.name} ${y}`);h.style.cssText='margin:8px 6px 2px;font-size:18px';w.append(h);
      w.append(Object.assign(el('p','small',y===START?t('Utgångsläget. Dra i tidslinjen eller spela seklet för att se vart vägvalen leder.','The starting point. Drag the timeline or play the century to see where the choices lead.','Il punto di partenza. Trascina la linea del tempo o riproduci il secolo per vedere dove portano le scelte.'):t(`Så här lever man i ${PLACE.name} det här året, med de vägval som gjorts. Texten räknas fram ur modellen.`,`This is life in ${PLACE.name} this year, with the choices that have been made. The text is computed from the model.`,`Così si vive a ${PLACE.name} quest'anno, con le scelte fatte finora. Il testo è calcolato dal modello.`)),{style:'margin:0 6px 6px;color:var(--ink-2)'}));
      for(const sec of visionSections(S.run,y)){const it=el('div','evidence');it.style.padding='10px 6px';const head=el('h4','',sec.title);head.style.cssText='margin:0 0 4px;font-size:13px';it.append(head,el('p','',sec.text));w.append(it);}
      rb.append(w);
    }else if(S.tab==='slakt'){
      const y=Math.floor(S.year),spans=lifespans(S.run),wrap=el('div','chron');
      const intro=el('p','small',FAMILY_INTRO[LANG]||FAMILY_INTRO.sv);intro.style.cssText='margin:4px 6px 8px;color:var(--ink-2);line-height:1.4';wrap.append(intro);
      const decade=Math.min(2116,START+Math.floor((y-START)/10)*10);const fam=el('div','family');fam.style.margin='0 4px 8px';fam.append(el('h4','',t(`${decade}-talet`,`${decade}–${decade+9}`,`${decade}–${decade+9}`)),el('p','',familyText(decade,S.run)));wrap.append(fam);
      for(const m of FAMILY){
        const row=el('div','chron-item');const age=y-m.birth,isAlive=alive(m,y,spans);
        const h=el('h4');const dot=el('i','status-dot');dot.style.background=isAlive?'#'+m.shirt.toString(16).padStart(6,'0'):'transparent';dot.style.border='1px solid var(--line-2)';
        h.append(dot,document.createTextNode(`${m.first} ${m.last}`));
        const body=el('div');body.append(h,el('p','',y<m.birth?t(`Föds ${m.birth}`,`Born ${m.birth}`,`Nasce nel ${m.birth}`):isAlive?t(`${age} år`,`${age} years`,`${age} anni`):t(`${m.birth}–${spans[m.id]} (${spans[m.id]-m.birth} år)`,`${m.birth}–${spans[m.id]} (aged ${spans[m.id]-m.birth})`,`${m.birth}–${spans[m.id]} (${spans[m.id]-m.birth} anni)`)));
        if(isAlive){const b=el('button','btn ghost small',t('Visa i staden','Show in the city','Mostra in città'));b.style.cssText='padding:3px 8px;margin-top:4px';b.onclick=()=>{const p=engine.residents.people.find(p=>p.family?.id===m.id);if(p)select(p,true);};body.append(b);}
        row.append(el('div','y',String(m.birth)),body);wrap.append(row);
      }
      rb.append(wrap);
    }else{
      const c=el('div','chron');
      const intro=el('p','small',t(`Händelser som prövar staden. Utfallet beror på vägvalen: samma torka blir en notis i ett förberett ${PLACE.name} och en kris i ett oförberett.`,`Events that test the city. The outcome depends on the choices: the same drought is a news item in a prepared ${PLACE.name} and a crisis in an unprepared one.`,`Eventi che mettono alla prova la città. L'esito dipende dalle scelte: la stessa siccità è una notizia breve in una ${PLACE.name} preparata e una crisi in una città impreparata.`));intro.style.cssText='margin:4px 6px 8px;color:var(--ink-2);line-height:1.4';c.append(intro);
      for(const e of S.run.chronicle){
        const it=el('div','chron-item'+(e.year>S.year?' future':''));const h=el('h4');const dot=el('i','status-dot');dot.style.background=e.good||e.severity<.3?'var(--good)':e.severity<.6?'var(--warning)':'var(--critical)';
        h.append(dot,document.createTextNode(`${e.icon} ${e.title}`));const body=el('div');body.append(h,el('p','',e.text));
        it.append(el('div','y',String(e.year)),body);c.append(it);
      }
      rb.append(c);
    }
  }
  // Year → city. Fractional years interpolate the vision so the century plays as growth.
  function visionAt(y){
    const i=Math.max(0,Math.min(END-START,Math.floor(y)-START)),j=Math.min(END-START,i+1),t=Math.max(0,Math.min(1,y-Math.floor(y)));
    const a=S.run.years[i].vision,b=S.run.years[j].vision,v={};for(const k in a)v[k]=lerp(a[k],b[k],t);return v;
  }
  function eraName(y){
    if(y<2027)return t(`Dagens ${PLACE.name}`,`${PLACE.name} today`,`${PLACE.name} oggi`);
    const d=Math.floor((y-START)/10);
    return [t('Grundläggningen','The foundation','Le fondamenta'),t('Omställningen','The transition','La transizione'),t('Andra generationen','The second generation','La seconda generazione'),t('Mitten av seklet','Mid-century','Metà secolo'),t('Barnbarnens tid','The grandchildren\'s time','Il tempo dei nipoti'),t('Sjuttiotalet','The seventies','Gli anni Settanta'),t('Det långa åttiotalet','The long eighties','I lunghi anni Ottanta'),t('Nittiotalet','The nineties','Gli anni Novanta'),t('Ett nytt sekel','A new century','Un nuovo secolo'),t('Hundra år senare','A hundred years later',"Cent'anni dopo")][Math.min(9,d)];
  }
  let ariaYear=0;
  function applyYear(immediate=false){
    const y=S.year;yearEl.textContent=String(Math.floor(y));eraEl.textContent=eraName(y);
    if(Math.floor(y)!==ariaYear){ariaYear=Math.floor(y);thumb.setAttribute('aria-valuenow',ariaYear);thumb.setAttribute('aria-valuetext',`${ariaYear}, ${eraName(y)}`);}
    thumb.style.left=`${(y-START)/(END-START)*100}%`;
    const d=S.run.years[Math.floor(y)-START];
    engine.applyVision(visionAt(y),immediate,Math.floor(y),{d,policy:d.policy,I:d.I});
    showStorm(d,Math.floor(y));
    // (The film sweeps through the century too fast for weather: it would only flicker.)
    engine.setWeather?.(weatherOf(S.events&&!film()?S.run.chronicle.find(c=>c.year===Math.floor(y)):null,{preview:S.floodPreview}));
    if(y>=START+8&&S.mode!=='journey'&&S.mode!=='start'&&!S.preset&&planEmpty())timeHint('empty');
    renderLevers();renderDashboard();
  }
  // With no choices made the city keeps today's course and looks much the same all century – which
  // reads as a timeline that does nothing. Say so once, and offer a vision; in the journey, say why the
  // timeline is locked.
  function timeHint(kind){
    if(kind===null){hint?.remove();hint=null;return;}
    if(hint||hintSeen.has(kind))return;if(kind==='empty')hintSeen.add(kind);   // the journey's may come back
    hint=el('div','panel toast time-hint');const body=el('div');
    if(kind==='journey')body.append(el('h4','',t('Tiden går ett decennium i taget','Time moves one decade at a time','Il tempo avanza un decennio alla volta')),el('p','',t('På resan spolas tiden fram när du har fattat årtiondets beslut. Avsluta resan om du vill dra fritt i tidslinjen.','On the journey, time moves on once you have made the decade\'s decisions. End the journey to drag the timeline freely.','Nel viaggio il tempo avanza quando hai preso le decisioni del decennio. Termina il viaggio per trascinare liberamente la linea del tempo.')));
    else{body.append(el('h4','',t('Inga vägval gjorda än','No choices made yet','Ancora nessuna scelta')),el('p','',t(`${PLACE.name} följer då dagens kurs: fler solceller, elbilar och ett stigande hav, men gatorna ser ut ungefär som i dag. Välj vägval eller en färdig vision för att se staden förändras.`,`${PLACE.name} then keeps today's course: more solar panels, electric cars and a rising sea, but the streets look much as they do today. Pick some choices or a ready-made vision to watch the city change.`,`${PLACE.name} segue allora la rotta attuale: più pannelli solari, auto elettriche e un mare che sale, ma le strade restano più o meno come oggi. Fai qualche scelta o prendi una visione già pronta per vedere la città cambiare.`)));
      const b=el('button','btn primary small',t('Välj en vision','Pick a vision','Scegli una visione'));b.style.marginTop='8px';b.onclick=()=>{timeHint(null);togglePlay(false);showPresets();};body.append(b);}
    const x=named(el('button','icon-btn','×'),t('Stäng','Close','Chiudi'));x.style.cssText='width:26px;height:26px';x.onclick=()=>timeHint(null);
    hint.append(el('div','ic',kind==='journey'?'⏳':'🧭'),body,x);document.body.append(hint);
    hint.style.bottom=`${innerHeight-tl.getBoundingClientRect().top+10}px`;   // just above the timeline it explains
    clearTimeout(hintTimer);hintTimer=setTimeout(()=>timeHint(null),kind==='journey'?6000:14000);
  }
  // Storms on land: in a storm's year the water rises over the ground it reaches (src/flood.js). The
  // "100-year storm" figure can also be shown for any year by clicking it (S.floodPreview).
  const floodBadge=el('div','flood-badge');floodBadge.hidden=true;app.append(floodBadge);
  let stormShown;
  function showStorm(d,year){
    const ev=S.floodPreview?null:S.run.chronicle.find(c=>c.level!=null&&c.year===year);
    const level=S.floodPreview?d.ind.level100:ev?ev.level:null;
    const key=level==null?'':`${year}|${level.toFixed(3)}|${d.ind.protection.toFixed(2)}|${S.floodPreview}`;
    if(key===stormShown)return;stormShown=key;
    // Behind a storm-surge barrier (FLOOD.barrier: Venice's MOSE) the town sees the water it holds, not the sea's.
    const BR=FLOOD?.barrier,shut=BR&&level!=null&&level>(d.ind.barrierCloses??BR.closes),inside=shut?Math.min(level,d.ind.barrierInside??BR.inside):level;
    engine.setFlood?.(inside);
    if(level==null){floodBadge.hidden=true;return;}
    const prot=d.ind.protection,lvl=dec(level,2),head=S.floodPreview?(FLOOD?.kind==='lake'?t(`100-årshögvatten år ${year}`,`100-year high water in ${year}`,`Piena centenaria nel ${year}`):t(`100-årsstorm år ${year}`,`100-year storm in ${year}`,`Acqua alta centenaria nel ${year}`)):`${ev.title} ${year}`;
    // By the sea a wall and quays (Kalmar's quay edge at 1.5 m); by a lake raised shores, beaches and jetties
    // (FLOOD.quay: where the water starts to cover them, else half a metre below the streets).
    const lake=FLOOD?.kind==='lake',quay=FLOOD?.quay??(lake?FLOOD.streets-.5:1.5),raised=prot>(FLOOD?.streets??1.8)+.05;
    const text=shut?(inside>prot?t(`${head}: havet når ${lvl} m – ${BR.name} stänger, och i staden stannar vattnet på ${dec(inside,2)} m: ${Math.round(flooded(inside)*100)} % av ${PLACE.centre} står under vatten.`,`${head}: the sea reaches ${lvl} m – ${BR.name} closes, and in the city the water stops at ${dec(inside,2)} m: ${Math.round(flooded(inside)*100)}% of ${PLACE.centre} is under water.`,`${head}: il mare raggiunge ${lvl} m – si alza la barriera ${BR.name} e in città l'acqua si ferma a ${dec(inside,2)} m: ${Math.round(flooded(inside)*100)}% ${PLACE.centreGenitive} sott'acqua.`)
        :t(`${head}: havet når ${lvl} m – ${BR.name} stänger, och staden klarar sig.`,`${head}: the sea reaches ${lvl} m – ${BR.name} closes, and the city stays dry.`,`${head}: il mare raggiunge ${lvl} m – si alza la barriera ${BR.name} e la città resta all'asciutto.`))
      :level>prot?t(`${head}: vattnet når ${lvl} m och ${Math.round(flooded(level)*100)} % av ${PLACE.centre} står under vatten.`,`${head}: the water reaches ${lvl} m and ${Math.round(flooded(level)*100)}% of ${PLACE.centre} is under water.`,`${head}: l'acqua raggiunge ${lvl} m – ${Math.round(flooded(level)*100)}% ${PLACE.centreGenitive} sott'acqua.`)
      :raised?(lake?t(`${head}: vattnet når ${lvl} m – det höjda strandskyddet på ${dec(prot,1)} m håller.`,`${head}: the water reaches ${lvl} m – the raised shore protection at ${dec(prot,1)} m holds.`,`${head}: l'acqua raggiunge ${lvl} m – la difesa delle rive, rialzata a ${dec(prot,1)} m, tiene.`)
        :t(`${head}: vattnet når ${lvl} m – vallen på ${dec(prot,1)} m håller.`,`${head}: the water reaches ${lvl} m – the ${dec(prot,1)} m flood wall holds.`,`${head}: l'acqua raggiunge ${lvl} m – l'argine di ${dec(prot,1)} m tiene.`))
      :level>quay?(lake?t(`${head}: vattnet når ${lvl} m – stränder och bryggor står under vatten, men gatorna klarar sig.`,`${head}: the water reaches ${lvl} m – beaches and jetties are under water, but the streets stay dry.`,`${head}: l'acqua raggiunge ${lvl} m – spiagge e pontili sono sott'acqua, ma le strade restano all'asciutto.`)
        :t(`${head}: vattnet når ${lvl} m – kajerna spolas över, men gatorna klarar sig.`,`${head}: the water reaches ${lvl} m – the quays are washed over, but the streets stay dry.`,`${head}: l'acqua raggiunge ${lvl} m – le banchine vengono sommerse, ma le strade restano all'asciutto.`))
      :lake?t(`${head}: vattnet når ${lvl} m – under strandkanten.`,`${head}: the water reaches ${lvl} m – below the shoreline.`,`${head}: l'acqua raggiunge ${lvl} m – sotto il livello della riva.`)
      :t(`${head}: vattnet når ${lvl} m – under kajkanten.`,`${head}: the water reaches ${lvl} m – below the quay edge.`,`${head}: l'acqua raggiunge ${lvl} m – sotto il bordo delle banchine.`);
    floodBadge.replaceChildren(el('span','',text));
    if(S.floodPreview){const x=el('button','',t('Dölj','Hide','Nascondi'));x.onclick=()=>{S.floodPreview=false;applyYear();renderDashboard(true);};floodBadge.append(x);}
    floodBadge.hidden=false;
  }
  function setYear(y){S.year=Math.max(START,Math.min(END,y));applyYear();}
  function togglePlay(on=!S.playing){
    if(S.mode==='journey'){if(on)timeHint('journey');return;}
    S.playing=on;setPlayIcon();
    if(S.playing&&S.year>=END-.01)S.year=START;
    if(S.playing)storyStart();
  }
  // The news ahead is told as the years reach it; from 2026 the changes count from the start again.
  function storyStart(){
    story.told=new Set(S.run.chronicle.filter(e=>e.year<=Math.floor(S.year)).map(e=>e.id));
    story.hold=0;story.next=1.5;if(S.year<START+1)story.seen={};
  }
  function select(p,fly=false){
    S.selected=p;engine.residents.select(p);follow.textContent=t('Följ','Follow','Segui');
    if(!p){insp.classList.add('hidden-soft');engine.stopFollow();return;}
    insp.classList.remove('hidden-soft');
    if(fly)engine.follow(p);
    renderInspector();
  }
  function renderInspector(){
    const p=S.selected;if(!p)return;
    const age=engine.residents.ageAt(p,Math.floor(S.year));
    avatar.textContent=p.first[0];avatar.style.background='#'+p.shirt.toString(16).padStart(6,'0');
    iName.textContent=`${p.first} ${p.last}`;
    const act=engine.residents.ACTIVITIES[p.activity];
    const job=engine.residents.jobFor(p,Math.floor(S.year));
    iSub.textContent=`${t(`${age} år`,`${age} years`,`${age} anni`)} · ${job[0].toUpperCase()+job.slice(1)}${p.family?` · ${(FAMILY_TITLE[LANG]||FAMILY_TITLE.sv).replace(/^./,c=>c.toLowerCase())}`:''}`;
    actLine.textContent=`${p.walking?t('På väg','On the way','In cammino'):act?.name||''}${p.place?.name?' – '+p.place.name:''}`;
    thought.textContent=`”${p.thought||'…'}”`;
    for(const n of NEEDS){const v=p.needs[n.id];needBars[n.id].style.width=`${v}%`;needBars[n.id].style.background=v>60?'var(--leaf)':v>30?'var(--warning)':'var(--critical)';}
  }
  // ---------- Drawers & modals ----------
  let drawer=null;
  function openDrawer(title,build){
    closeDrawer();drawer=el('div','panel drawer');const head=el('div','panel-head');head.style.cssText='display:flex;gap:10px;align-items:flex-start';
    const h=el('h3','',title);h.id='drawer-title';const x=named(el('button','icon-btn','×'),t('Stäng','Close','Chiudi'));x.style.marginLeft='auto';x.onclick=closeDrawer;head.append(h,x);
    const body=el('div','panel-body');build(body);drawer.append(head,body);document.body.append(drawer);
    // A side panel: named by its title; focus goes to it and back where it came from when it closes.
    drawer.setAttribute('role','dialog');drawer.setAttribute('aria-labelledby','drawer-title');drawer.returnTo=document.activeElement;x.focus({preventScroll:true});
  }
  function closeDrawer(){const back=drawer?.returnTo;drawer?.remove();drawer=null;if(back?.isConnected&&document.activeElement===document.body)back.focus({preventScroll:true});}
  // Research behind a lever or a dilemma: claims from research/vision-research.json, or – as "base:<id>" –
  // Kalmar's own figures from research/kalmar-baseline.json (the deep research in research/deep/).
  function evidenceList(body,ids){
    for(const id of ids){
      if(id.startsWith('base:')){const b=BASELINE[id.slice(5)];if(!b)continue;
        const n=v=>typeof v==='number'?v.toLocaleString(LOCALE,{maximumFractionDigits:2}):v;
        const box=el('div','evidence');const p=el('p');p.append(el('b','',`${b.name_sv}: `),document.createTextNode(`${n(b.value)} ${b.unit} (${b.year}${b.scope?', '+b.scope:''})`));box.append(p);
        if(b.note_sv)box.append(el('p','small muted',b.note_sv));
        const a=el('a','',`${b.source.publisher}: ${b.source.title}`);a.href=b.source.url;a.target='_blank';a.rel='noopener';
        box.append(a,el('span','conf',b.confidence==='high'?t('säker uppgift','reliable figure','dato affidabile'):b.confidence==='medium'?t('medelsäker uppgift','fairly reliable figure','dato abbastanza affidabile'):t('uppskattning','estimate','stima')));body.append(box);continue;}
      const e=EVIDENCE[id];if(!e)continue;
      const box=el('div','evidence');box.append(el('p','',e.claim_sv));
      const a=el('a','',`${e.source.authors?e.source.authors.split(',')[0]+' '+t('m.fl.','et al.','et al.')+', ':''}${e.source.title} (${e.source.publisher||''} ${e.source.year||''})`);a.href=e.source.url;a.target='_blank';a.rel='noopener';
      box.append(a,el('span','conf',e.confidence==='assumption'?t('antagande','assumption','ipotesi'):e.confidence==='high'?t('stark evidens','strong evidence','evidenza forte'):e.confidence==='medium'?t('måttlig evidens','moderate evidence','evidenza moderata'):t('svag evidens','weak evidence','evidenza debole')));body.append(box);}
  }
  function showLever(id){
    const l=LEVER[id];
    openDrawer(l.name,body=>{
      body.append(el('p','',l.short));
      const lv=el('div');lv.style.margin='10px 0';
      l.levels.forEach((txt,i)=>{const r=el('div','small');r.style.cssText='padding:6px 0;border-top:1px solid var(--line)';const b=el('b','',`${[t('Idag','Today','Oggi'),t('Stadig','Steady','Graduale'),t('Ambitiös','Ambitious','Ambizioso'),t('Radikal','Radical','Radicale')][i]}: `);r.append(b,document.createTextNode(txt));lv.append(r);});
      body.append(lv,el('h4','',t('Forskningen säger','What the research says','Cosa dice la ricerca')));evidenceList(body,LEVER_EVIDENCE[id]||[]);
    });
  }
  function showGoal(i){
    const g=SDGS[i],yi=Math.floor(S.year)-START,d=S.run.years[yi];
    openDrawer(t(`Mål ${g.n}: ${g.name}`,`Goal ${g.n}: ${g.name}`,`Obiettivo ${g.n}: ${g.name}`),body=>{
      const top=el('div');top.style.cssText='display:flex;gap:14px;align-items:center;margin-bottom:8px';top.append(ring(d.sdg[i],g.color,64));
      top.append(el('p','small',t(`Poäng ${Math.round(d.sdg[i])} av 100 år ${Math.floor(S.year)} (2026: ${Math.round(S.run.years[0].sdg[i])}). Poängen väger samman indikatorerna nedan, mätta mot en hållbar nivå för ${PLACE.name}.`,`Score ${Math.round(d.sdg[i])} of 100 in ${Math.floor(S.year)} (2026: ${Math.round(S.run.years[0].sdg[i])}). The score combines the indicators below, measured against a sustainable level for ${PLACE.name}.`,`Punteggio ${Math.round(d.sdg[i])} su 100 nel ${Math.floor(S.year)} (2026: ${Math.round(S.run.years[0].sdg[i])}). Il punteggio combina gli indicatori qui sotto, misurati rispetto a un livello sostenibile per ${PLACE.name}.`)));body.append(top);
      for(const k of g.ind){const m=INDICATORS[k];if(!m)continue;const vals=S.run.years.map(y=>y.ind[k]);
        const row=el('div','evidence');const h=el('p');const b=el('b','',m.name);h.append(b,document.createTextNode(`: ${m.fmt(vals[yi])} (${m.unit}) – 2026: ${m.fmt(vals[0])}`));row.append(h,sparkline(vals,{index:yi,width:360,height:40,color:g.color,fmt:m.fmt,years:S.run.years.map(y=>y.year),band:bandOf(k)}));
        const src=m.base&&BASELINE[m.base];if(src){const a=el('a','',`${t('Utgångsvärde','Starting value','Valore di partenza')}: ${src.name_sv} ${src.value} ${src.unit} (${src.year}, ${src.scope}) – ${src.source.publisher}`);a.href=src.source.url;a.target='_blank';a.rel='noopener';row.append(a);}
        if(m.note)row.append(el('p','small muted',m.note));if(m.assumption)row.append(el('span','conf',t('modellbegrepp','model concept','concetto del modello')));body.append(row);}
    });
  }
  function showPlace(p){
    const lever=p.lever&&LEVER[p.lever];const I=S.run.years[Math.floor(S.year)-START].I;const built=lever&&I[p.lever]>.35;
    engine.flyTo(p.x,p.z);
    openDrawer(p.name,body=>{
      body.append(el('h4','',t('Idag','Today','Oggi')),el('p','',p.now));
      if(p.future){body.append(el('h4','',built?t(`År ${Math.floor(S.year)}`,`In ${Math.floor(S.year)}`,`Nel ${Math.floor(S.year)}`):t('Om staden väljer det','If the city chooses it','Se la città lo sceglie')),el('p','',p.future));}
      if(lever){const b=el('button','btn',t('Vägvalet: ','The choice: ','La scelta: ')+lever.name);b.onclick=()=>showLever(lever.id);body.append(b);}
    });
  }
  let overlay=null;
  function modal(build,{cls='',closable=true}={}){
    overlay?.remove();overlay=el('div','overlay');const box=el('div','panel modal '+cls);build(box,()=>{overlay?.remove();overlay=null;});overlay.append(box);
    if(closable)overlay.onclick=e=>{if(e.target===overlay){overlay.remove();overlay=null;}};document.body.append(overlay);dialog(overlay,box);return box;
  }
  // A modal dialog for assistive technology: named by its heading, Tab stays inside it while it is
  // open, and focus goes back to where it was once it is gone.
  function dialog(ov,box){
    box.setAttribute('role','dialog');box.setAttribute('aria-modal','true');box.tabIndex=-1;
    const h=box.querySelector('h1,h2,h3');if(h){h.id=h.id||'dlg-'+Math.random().toString(36).slice(2,8);box.setAttribute('aria-labelledby',h.id);}
    // (An item in the menu is hidden by the time the dialog closes: focus goes back to the menu button.)
    const back=document.activeElement?.closest?.('.menu')?menuBtn:document.activeElement,focusables=()=>[...box.querySelectorAll('button,a[href],input,select,textarea,video,[tabindex]:not([tabindex="-1"])')].filter(x=>!x.disabled&&x.offsetParent!==null);
    ov.addEventListener('keydown',e=>{if(e.key!=='Tab')return;const f=focusables();if(!f.length)return;const first=f[0],last=f[f.length-1];
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}});
    requestAnimationFrame(()=>{if(!ov.isConnected)return;const f=focusables();(f[0]||box).focus({preventScroll:true});});
    const gone=new MutationObserver(()=>{if(ov.isConnected)return;gone.disconnect();if(back?.isConnected&&(document.activeElement===document.body||!document.activeElement))back.focus({preventScroll:true});});
    gone.observe(document.body,{childList:true});
  }
  function closeModal(){overlay?.remove();overlay=null;}
  // The start screen. While a shared link is in the address it offers that plan first (and any other
  // start leaves the link behind).
  function showStart(){
    const shared=parsePlanHash(location.hash)?location.hash:null;
    modal((box,close)=>{
      const hero=el('div','hero');hero.append(el('h1','',`${CITY.title}`));
      // The place's own question (config.js intro: what its levers are about), else the plain one.
      hero.append(el('p','',PLACE.intro||t(`Hur vill vi leva i ${PLACE.name} om hundra år – tillsammans med våra barn, barnbarn och grannar?`,`How do we want to live in ${PLACE.name} in a hundred years – with our children, grandchildren and neighbours?`,`Come vogliamo vivere a ${PLACE.name} fra cent'anni – insieme ai nostri figli, ai nipoti e ai vicini?`)));
      hero.append(el('p','',t(`Det här är en forskningsförankrad framtidssimulering byggd på ${PLACE.modelOf} och ${PLACE.kommunGenitive} egen statistik.`,`This is a research-based future simulation built on ${PLACE.modelOf} and ${PLACE.kommunGenitive} own statistics.`,`Questa è una simulazione del futuro ancorata alla ricerca, che poggia su ${PLACE.modelOf} e sulle statistiche ${PLACE.kommunGenitive}.`)));
      // The place's film, when it has one (FILM).
      if(FILM){const fb=el('button','hero-film');fb.innerHTML=`<span class="play">▶</span>${t('Se filmen','Watch the film','Guarda il film')}<small>${t(FILM.length.sv,FILM.length.en,FILM.length.it).replace(/ minut(es)?$/,' min')}</small>`;fb.onclick=()=>showFilm();hero.append(fb);}
      const q=QUOTES.find(q=>/Wales|Future Generations/.test(q.who))||QUOTES[0];
      if(q){const bq=el('blockquote','',`”${q.text_sv.replace(' (översättning)','')}” – ${q.who}`);hero.append(bq);}
      const ch=el('div','choices');
      ch.append(el('div','small muted',t('VÄLJ HUR DU VILL BÖRJA','CHOOSE HOW TO START','SCEGLI COME INIZIARE')));
      // Someone sent a link with their plan: offer it first. Any other start leaves it behind.
      const dropShared=()=>{if(shared)history.replaceState(null,'',location.pathname+location.search);};
      if(shared){const sp=parsePlanHash(shared),name=sp?.preset&&PRESETS.find(p=>p.id===sp.preset)?.name;
        const what=sp?`: ${name?`${name}, `:''}${t(`år ${sp.year}`,String(sp.year),String(sp.year))}`:'';
        const c0=el('button','choice shared');c0.append(el('b','',t('Den delade visionen','The shared vision','La visione condivisa')+what),el('span','',t(`Någon har delat sin plan för ${PLACE.name} med dig. Öppna den och se staden de valde – år för år.`,`Someone has shared their plan for ${PLACE.name} with you. Open it and see the city they chose – year by year.`,`Qualcuno ha condiviso con te il suo piano per ${PLACE.name}. Aprilo e guarda la città che ha scelto – anno dopo anno.`)));
        c0.onclick=()=>{close();if(!loadShared(shared))showStart();autoSound();};ch.append(c0);}
      const c1=el('button','choice');c1.append(el('b','',t('Resan 2026 → 2126','The journey 2026 → 2126','Il viaggio 2026 → 2126')),el('span','',t('Spela seklet decennium för decennium. Varje årtionde ställs du inför vägval med forskningen som stöd, och kriser prövar det du byggt. Följ en släkt genom fem generationer.','Play the century decade by decade. Each decade brings choices backed by research, and crises test what you have built. Follow one family through five generations.','Attraversa il secolo decennio dopo decennio. Ogni decennio porta scelte sostenute dalla ricerca, e le crisi mettono alla prova ciò che hai costruito. Segui una famiglia per cinque generazioni.')));
      c1.onclick=()=>{close();dropShared();startJourney();autoSound();};
      const c2=el('button','choice');c2.append(el('b','',t('Utforska en vision','Explore a vision','Esplora una visione')),el('span','',t(`Se ${VISION.name} – forskningens förslag – växa fram år för år. Jämför med ${list(['dagens kurs',...OTHERS.map(p=>p.name)],'och')}.`,`Watch ${VISION.name} – the research-based proposal – grow year by year. Compare it with ${list(['the current course',...OTHERS.map(p=>p.name)],'and')}.`,`Guarda ${VISION.name} – la proposta fondata sulla ricerca – prendere forma anno dopo anno. Confrontala con ${list(['la rotta attuale',...OTHERS.map(p=>p.name)],'e')}.`)));
      c2.onclick=()=>{close();dropShared();showPresets();autoSound();};
      const c3=el('button','choice');c3.append(el('b','',t('Fritt läge','Free mode','Modalità libera')),el('span','',t('Dra i alla spakar själv och se hela seklet räknas om direkt.','Pull every lever yourself and watch the whole century recalculate instantly.',"Muovi tu tutte le leve e guarda l'intero secolo ricalcolarsi all'istante.")));
      c3.onclick=()=>{close();dropShared();setMode('sandbox');autoSound();};
      ch.append(c1,c2,c3);
      ch.append(el('div','small muted',t(`VÄRLDEN RUNT ${PLACE.name.toUpperCase()}`,`THE WORLD AROUND ${PLACE.name.toUpperCase()}`,`IL MONDO INTORNO A ${PLACE.name.toUpperCase()}`)));
      // The world is a setting for whichever start is picked above: say what it means at once, and
      // recompute the century behind the menu so the timeline follows.
      const note=el('p','small world-note');
      const describe=w=>{const up=S.run?.years.at(-1)?.vision?.seaRise??w.seaRise2126,sea=dec(up,2);
        // How far the place's water rises (CITY's rise: "havet står {m} m högre år 2126") – nothing to say where it
        // does not (Rättvik's regulated lake) – and its hot days.
        const rise=FLOOD&&PLACE.rise&&Math.abs(up)>=.005?PLACE.rise.replace('{m}',sea):'';
        // (Hot days only where the place's climate says them – levers.js WORLD_CLIMATE – and today's only where
        // it has measured them: config.js hotDaysToday.)
        const deg=CITY.hotThreshold??25,now=CITY.hotDaysToday,hot=w.hotDays==null?'':t(`omkring ${w.hotDays} dagar över ${deg} °C om året${now!=null?` mot ${now} i dag`:''}`,`about ${w.hotDays} days above ${deg} °C a year${now!=null?` against ${now} today`:''}`,`circa ${w.hotDays} giorni sopra i ${deg} °C all'anno${now!=null?` contro i ${now} di oggi`:''}`);
        const said=[rise,hot].filter(Boolean).join(', '),lead=`${w.name}: ${said?said+', '+t('och ','and ','e '):''}`;
        note.textContent=w.stress<.25?t(`${lead}torka, värmeböljor och stormar blir bara något vanligare än i dag. Gäller det du väljer ovan.`,`${lead}droughts, heatwaves and storms become only a little more common than today. Applies to whatever you choose above.`,`${lead}siccità, ondate di calore e tempeste diventano solo un po' più frequenti di oggi. Vale per qualunque scelta tu faccia qui sopra.`)
          :w.stress<.7?t(`${lead}torka, värmeböljor och stormar blir vanligare. Gäller det du väljer ovan.`,`${lead}droughts, heatwaves and storms become more common. Applies to whatever you choose above.`,`${lead}siccità, ondate di calore e tempeste diventano più frequenti. Vale per qualunque scelta tu faccia qui sopra.`)
          :t(`${lead}torka, värmeböljor och stormar blir betydligt vanligare och hårdare. Gäller det du väljer ovan.`,`${lead}droughts, heatwaves and storms become far more common and severe. Applies to whatever you choose above.`,`${lead}siccità, ondate di calore e tempeste diventano molto più frequenti e violente. Vale per qualunque scelta tu faccia qui sopra.`);
        note.classList.remove('flash');void note.offsetWidth;note.classList.add('flash');};
      const ws=el('div','worlds');WORLDS.forEach(w=>{const b=el('button',w.id===S.world?'on':'');b.append(el('b','',w.name),el('span','small muted',w.short));
        b.onclick=()=>{S.world=w.id;[...ws.children].forEach(x=>x.classList.toggle('on',x===b));resimulate();describe(w);};ws.append(b);});
      describe(WORLDS.find(w=>w.id===S.world)||WORLDS[1]);note.classList.remove('flash');
      ch.append(ws,note);
      box.append(hero,ch);
    },{cls:'start',closable:S.mode!=='start'});
  }
  // The film (tools/film.mjs → tools/film-web.mjs) in its own player above everything else, in the
  // site's language. The city's sound and the century playback pause while it runs.
  function showFilm(){
    const soundWas=engine.audio.on,playWas=S.playing;
    if(soundWas)engine.audio.toggle().then(setSound);
    if(playWas)togglePlay(false);
    const ov=el('div','overlay film-overlay'),box=el('div','film-player');
    const film=`city/${FILM[LANG]||FILM.en||FILM.sv}`;
    const v=document.createElement('video');Object.assign(v,{controls:true,autoplay:true,playsInline:true,preload:'auto',poster:`city/${FILM.poster}`,src:`${film}.mp4`});
    // Subtitles to switch on: Swedish and English under the Swedish film, English under the English one,
    // Italian and English under the Italian one.
    for(const [lang,label] of LANG==='en'?[['en','English']]:LANG==='it'?[['it','Italiano'],['en','English']]:[['sv','Svenska'],['en','English']]){
      const tr=document.createElement('track');Object.assign(tr,{kind:'subtitles',srclang:lang,label,src:`${film}.${lang}.vtt`});v.append(tr);}
    const head=el('div','film-head');head.append(el('b','',t(`${PLACE.name} 2126 – filmen`,`${PLACE.name} 2126 – the film`,`${PLACE.name} 2126 – il film`)),el('span','',t(`${FILM.length.sv} · ljud på`,`${FILM.length.en} · sound on`,`${FILM.length.it??FILM.length.en} · con l'audio`)));
    const x=el('button','film-close','×');x.title=t('Stäng','Close','Chiudi');x.setAttribute('aria-label',x.title);
    const onKey=e=>{if(e.code==='Escape'){e.stopImmediatePropagation();close();}};
    const close=()=>{v.pause();ov.remove();removeEventListener('keydown',onKey,true);
      if(soundWas&&!engine.audio.on)engine.audio.toggle().then(setSound);
      if(playWas&&!S.playing)togglePlay(true);};
    addEventListener('keydown',onKey,true);x.onclick=close;ov.onclick=e=>{if(e.target===ov)close();};
    box.append(head,v,x);ov.append(box);document.body.append(ov);dialog(ov,box);box.setAttribute('aria-label',t(`${PLACE.name} 2126 – filmen`,`${PLACE.name} 2126 – the film`,`${PLACE.name} 2126 – il film`));
  }
  async function autoSound(){if(!engine.audio.on)setSound(await engine.audio.toggle());}
  // A shared link goes straight to the plan it carries – the one the sender wanted to show – with a
  // word on what it is and how to make one's own.
  function openShared(hash){
    const p=parsePlanHash(hash);if(!p||!loadShared(hash))return showStart();
    const name=p.preset&&PRESETS.find(x=>x.id===p.preset)?.name;
    news({year:p.year,icon:'✉',title:t('Den delade visionen','The shared vision','La visione condivisa')+(name?`: ${name}`:''),
      text:t(`Någon har delat sin plan för ${PLACE.name} med dig. Tryck ▶ för att spela seklet, eller välj Meny → Startmenyn för att göra din egen.`,`Someone has shared their plan for ${PLACE.name} with you. Press ▶ to play the century, or choose Menu → Start menu to make your own.`,`Qualcuno ha condiviso con te il suo piano per ${PLACE.name}. Premi ▶ per riprodurre il secolo, oppure scegli Menu → Schermata iniziale per crearne uno tuo.`)},{secs:16,cue:false});
    autoSound();
  }
  function showPresets(){
    modal((box,close)=>{
      box.append(el('h1','',t('Utforska en vision','Explore a vision','Esplora una visione')),el('p','',t('Varje väg räknas fram år för år i samma modell. Spela upp seklet och se staden förändras – eller dra i tidslinjen.','Each path is computed year by year in the same model. Play the century and watch the city change – or drag the timeline.','Ogni percorso è calcolato anno per anno nello stesso modello. Riproduci il secolo e guarda la città cambiare – oppure trascina la linea del tempo.')));
      const grid=el('div','cards');
      for(const p of PRESETS){const r=run(p.schedule,{world:S.world});const c=el('button','choice');const score=Math.round(mean(r.years[100].sdg));
        c.append(el('b','',p.name),el('span','',p.short),el('div','small',`${t(`${PLACE.name}-index`,`${PLACE.name} index`,`Indice ${PLACE.name}`)} 2126: ${score}`));c.onclick=()=>{close();loadPreset(p);};grid.append(c);}
      box.append(grid);
    });
  }
  function loadPreset(p){
    S.preset=p.id;S.schedule=structuredClone(p.schedule);setMode('explore');S.year=START;resimulate();
    S.playing=true;setPlayIcon();storyStart();
  }
  // The plan and the year shown, as a short link (scenario.js planHash: #sundstaden-2039, #1F3k…-2039).
  function planNow(){return planHash({schedule:S.schedule,world:S.world,preset:S.mode==='journey'?null:S.preset},S.year);}
  const planLink=()=>`${location.origin}${location.pathname}#${planNow()}`;
  function sharePlan(){
    const url=planLink();
    navigator.clipboard?.writeText(url).catch(()=>{});
    modal((box,close)=>{box.append(el('h1','',t('Dela din vision','Share your vision','Condividi la tua visione')),el('p','',t(`Länken innehåller hela planen – vägvalen, när de gjordes och vilken värld runt ${PLACE.name} du valt. Den som öppnar den ser samma ${PLACE.name}.`,`The link contains the whole plan – the choices, when they were made and which world around ${PLACE.name} you chose. Anyone who opens it sees the same ${PLACE.name}.`,`Il link contiene l'intero piano – le scelte, quando sono state fatte e quale mondo intorno a ${PLACE.name} hai scelto. Chi lo apre vede la stessa ${PLACE.name}.`)));
      const inp=el('input');inp.value=url;inp.readOnly=true;inp.style.cssText='width:100%;padding:10px;border-radius:10px;border:1px solid var(--line-2);font:inherit;font-size:12px';inp.onclick=()=>inp.select();box.append(inp);
      const a=el('div','actions');const b=el('button','btn primary',t('Klar','Done','Fatto'));b.onclick=close;a.append(el('span','small muted',t('Länken är kopierad.','The link has been copied.','Il link è stato copiato.')),b);box.append(a);});
  }
  function loadShared(hash){
    const p=parsePlanHash(hash);if(!p)return false;
    S.world=p.world;S.schedule=p.schedule.length?p.schedule:[{from:START,set:{}}];S.preset=p.preset;
    setMode('explore');resimulate();setYear(p.year);return true;
  }
  function showSources(){
    openDrawer(t('Källor och utgångsvärden','Sources and starting values','Fonti e valori di partenza'),body=>{
      body.append(el('p','small',t(`${PLACE.kommunGenitive} utgångsläge (${Object.keys(BASELINE).length} indikatorer) samt forskningsunderlaget finns i research/ i projektet. Klicka på en källa för att öppna den.`,`${PLACE.kommunGenitive} starting point (${Object.keys(BASELINE).length} indicators) and the research are in research/ in the project. Click a source to open it.`,`Il punto di partenza ${PLACE.kommunGenitive} (${Object.keys(BASELINE).length} indicatori) e la documentazione di ricerca si trovano in research/ nel progetto. Clicca su una fonte per aprirla.`)));
      const q=el('input');q.placeholder=t('Sök …','Search …','Cerca …');q.style.cssText='width:100%;padding:8px 10px;border-radius:10px;border:1px solid var(--line-2);font:inherit;margin:6px 0 4px';body.append(q);
      const list=el('div');body.append(list);
      const draw=()=>{list.replaceChildren();const qq=q.value.toLowerCase();
        for(const b of Object.values(BASELINE)){if(qq&&!(b.name_sv+b.note_sv+b.source.publisher).toLowerCase().includes(qq))continue;
          const row=el('div','evidence');const p=el('p');const nb=el('b','',b.name_sv);const n=v=>typeof v==='number'?v.toLocaleString(LOCALE,{maximumFractionDigits:3}):v;
          p.append(nb,document.createTextNode(`: ${n(b.value)} ${b.unit}${b.range?` (${t('spann','range','intervallo')} ${n(b.range[0])}–${n(b.range[1])})`:''} (${b.year}, ${b.scope})`));row.append(p);
          if(b.note_sv)row.append(el('p','small muted',b.note_sv));
          const a=el('a','',`${b.source.publisher}: ${b.source.title}`);a.href=b.source.url;a.target='_blank';a.rel='noopener';row.append(a,el('span','conf',b.confidence==='high'?t('säker','reliable','affidabile'):b.confidence==='medium'?t('medel','medium','abbastanza affidabile'):t('uppskattning','estimate','stima')));list.append(row);}};
      q.oninput=draw;draw();
    });
  }
  function showAbout(){
    modal((box,close)=>{
      box.append(el('h1','',t('Om modellen','About the model','Informazioni sul modello')));
      box.append(el('p','',t(`${PLACE.name} 2126 är ett tankeverktyg, inte en prognos. Modellen följer ett nittiotal storheter år för år från 2026 till 2126. Utgångsläget är ${PLACE.genitive} egen statistik: ${Object.keys(BASELINE).length} belagda uppgifter från bland andra ${CITY.sources.sv}.`,`${PLACE.name} 2126 is a thinking tool, not a forecast. The model follows some ninety quantities year by year from 2026 to 2126. The starting point is ${PLACE.genitive} own statistics: ${Object.keys(BASELINE).length} sourced figures from ${CITY.sources.en}, among others.`,`${PLACE.name} 2126 è uno strumento per pensare, non una previsione. Il modello segue una novantina di grandezze anno per anno, dal 2026 al 2126. Il punto di partenza sono le statistiche ${PLACE.genitive}: ${Object.keys(BASELINE).length} dati documentati, da fonti come ${CITY.sources.it??CITY.sources.en}.`)));
      box.append(el('h2','',t('Hur vägvalen verkar','How the choices work','Come funzionano le scelte')));
      box.append(el('p','',t(`Varje vägval har fyra nivåer. Det som påverkar staden är genomförandet, som växer mot den valda nivån i vägvalets egen takt: träd tar årtionden, ett medborgarråd några år. Om staden tar på sig mer än den orkar går allt långsammare och tilliten sjunker. Förmågan växer med välfärd, tillit och delaktighet, så att investera i gemenskap och demokrati är också att investera i förmågan att förändra. Året 2026 visar ${PLACE.name} som det mäts i dag, i alla planer; det som beslutas börjar verka 2027.`,`Each choice has four levels. What affects the city is implementation, which grows towards the chosen level at the choice's own pace: trees take decades, a citizens' assembly a few years. If the city takes on more than it can manage, everything slows down and trust falls. Capacity grows with welfare, trust and participation, so investing in community and democracy is also investing in the ability to change. The year 2026 shows ${PLACE.name} as it is measured today, in every plan; what is decided starts to take effect in 2027.`,`Ogni scelta ha quattro livelli. Ciò che incide sulla città è l'attuazione, che cresce verso il livello scelto al ritmo proprio di ciascuna scelta: gli alberi richiedono decenni, un'assemblea cittadina pochi anni. Se la città si carica di più di quanto riesca a sostenere, tutto rallenta e la fiducia cala. La capacità cresce con il benessere, la fiducia e la partecipazione: investire nella comunità e nella democrazia significa quindi investire anche nella capacità di cambiare. Il 2026 mostra ${PLACE.name} com'è misurata oggi, in tutti i piani; ciò che si decide inizia a produrre effetti nel 2027.`)));
      box.append(el('h2','',t('Avvägningar som finns med','Trade-offs included','Compromessi considerati')));
      box.append(el('p','',t('Snabb omvandling till bilfritt möter motstånd om invånarna inte får inflytande (Gent: 30 % handlade mer sällan i centrum efter cirkulationsplanen). AI drar el och ökar klyftorna om den inte styrs demokratiskt. Analoga reserver kostar effektivitet men bär i kris. Skyddsvallar räddar staden men tar något av 1600-talskajerna. Havsvindparker har stoppats av försvarsskäl (13 parker avslogs 2024).','A rapid car-free conversion meets resistance if residents have no say (Ghent: 30% shopped less often in the centre after the circulation plan). AI uses electricity and widens gaps unless it is governed democratically. Analogue backups cost efficiency but hold in a crisis. Flood walls save the city but take something from the 17th-century quays. Offshore wind farms have been stopped for defence reasons (13 farms were rejected in 2024).',"Una rapida trasformazione senza auto incontra resistenze se i residenti non hanno voce in capitolo (Gand: il 30% faceva acquisti in centro meno spesso dopo il piano di circolazione). L'IA consuma elettricità e allarga le disuguaglianze se non è governata democraticamente. Le riserve analogiche costano efficienza ma reggono nelle crisi. Gli argini salvano la città ma tolgono qualcosa alle banchine del Seicento. Alcuni parchi eolici in mare sono stati fermati per motivi di difesa (13 progetti respinti nel 2024).")));
      box.append(el('h2','',t('Antaganden','Assumptions','Ipotesi')));
      box.append(el('p','',t('Värden märkta "modell" är modellbegrepp eller antaganden, till exempel andelen mat från länet. Sverige saknar ett samlat mått på självförsörjning. Alla effektstorlekar finns dokumenterade i källkoden (src/model.js) med hänvisning till forskningsunderlaget i research/, som innehåller 251 belagda påståenden med källor.','Values marked "model" are model concepts or assumptions, for example the share of food from the county. Sweden has no single measure of self-sufficiency. Every effect size is documented in the source code (src/model.js) with references to the research in research/, which holds 251 sourced claims.','I valori contrassegnati "modello" sono concetti del modello o ipotesi, per esempio la quota di cibo prodotto in regione. La Svezia non ha una misura unica dell\'autosufficienza. Tutte le stime degli effetti sono documentate nel codice sorgente (src/model.js) con rimandi alla documentazione di ricerca in research/, che contiene 251 affermazioni con fonti.')));
      box.append(el('h2','',t('Osäkerhet','Uncertainty','Incertezza')));
      box.append(el('p','',t(`Ingen vet hur ${PLACE.name} ser ut om hundra år. Officiella prognoser slutar runt 2070 för befolkningen och 2100–2150 för klimatet; därefter är allt scenarier. Därför körs varje plan 24 gånger till, med andra rimliga antaganden: hur snabbt och hur fullt besluten genomförs, när elbilar, AI och ett fossilfritt Sverige slår igenom, hur starka samhällstrenderna är, havsnivån och stormfloden inom den valda världen, befolkningsutvecklingen och dagens värde för de storheter som är modellbegrepp. Händelserna inträffar olika år i varje körning. Det ljusa bandet i diagrammen visar var 80 % av körningarna hamnar.`,`No one knows what ${PLACE.name} will look like in a hundred years. Official projections end around 2070 for population and 2100–2150 for climate; beyond that everything is scenarios. So every plan is run 24 more times with other reasonable assumptions: how fast and how fully decisions are carried out, when electric cars, AI and a fossil-free Sweden take hold, how strong social trends are, sea level and storm surge within the chosen world, population growth, and today's value of the quantities that are model concepts. Events happen in different years in each run. The pale band in the charts shows where 80% of the runs end up.`,`Nessuno sa come sarà ${PLACE.name} fra cent'anni. Le proiezioni ufficiali si fermano intorno al 2070 per la popolazione e al 2100–2150 per il clima; oltre, tutto è scenario. Per questo ogni piano viene calcolato altre 24 volte con altre ipotesi ragionevoli: quanto in fretta e quanto pienamente si attuano le decisioni, quando si affermano le auto elettriche, l'IA e una Svezia senza fonti fossili, quanto sono forti le tendenze sociali, il livello del mare e le mareggiate nel mondo scelto, l'andamento della popolazione e il valore attuale delle grandezze che sono concetti del modello. Gli eventi cadono in anni diversi in ogni simulazione. La banda chiara nei grafici mostra dove finisce l'80% delle simulazioni.`)));
      box.append(el('h2','',t('Tillgänglighet','Accessibility','Accessibilità')));
      box.append(el('p','',t('Allt går att styra med tangentbordet: Tab flyttar mellan knapparna, piltangenterna stegar ett år i tidslinjen (Page Up och Page Down ett decennium) och byter flik, WASD eller piltangenterna flyttar kameran och Esc stänger. Det 3D-vyn visar beskrivs också i ord under Visionen, och siffrorna finns under Mål och Siffror; en skärmläsare får höra vilket år som valts och vad som ändrats mest. Kameran rör sig bara när du styr den eller väljer en plats; ber datorn om mindre rörelse hoppar den dit i stället för att glida, och animationerna stängs av. Filmen har undertexter. Platsnålarna nås med Tab när de syns i bild, men invånarna i 3D-vyn går bara att välja med mus eller finger.','Everything can be used from the keyboard: Tab moves between the buttons, the arrow keys step a year on the timeline (Page Up and Page Down a decade) and change tabs, WASD or the arrow keys move the camera, and Esc closes. What the 3D view shows is also described in words under Vision, and the figures are under Goals and Figures; a screen reader hears which year is chosen and what has changed most. The camera only moves when you steer it or choose a place; if the computer asks for less motion it cuts there instead of gliding, and the animations stop. The film has subtitles. The place pins can be reached with Tab while they are in view, but the residents in the 3D view can only be picked with a mouse or a finger.',"Tutto si può usare da tastiera: Tab passa da un pulsante all'altro, i tasti freccia spostano la linea del tempo di un anno (Page Up e Page Down di un decennio) e cambiano scheda, WASD o i tasti freccia muovono la telecamera ed Esc chiude. Ciò che mostra la vista 3D è descritto anche a parole sotto Visione, e i numeri si trovano sotto Obiettivi e Numeri; un lettore di schermo sente quale anno è stato scelto e che cosa è cambiato di più. La telecamera si muove solo quando la guidi tu o scegli un luogo; se il computer chiede meno movimento, salta direttamente lì invece di scivolare, e le animazioni si fermano. Il film ha i sottotitoli. Gli indicatori dei luoghi si raggiungono con Tab quando sono visibili, ma gli abitanti nella vista 3D si possono scegliere solo con il mouse o con un dito.")));
      box.append(el('h2','',t('Kartdata och 3D-modell','Map data and 3D model','Dati cartografici e modello 3D')));
      box.append(el('p','',CITY.credits.about[LANG]||CITY.credits.about.sv));
      const a=el('div','actions');const src=el('button','btn',t('Alla källor','All sources','Tutte le fonti'));src.onclick=()=>{close();showSources();};const b=el('button','btn primary',t('Stäng','Close','Chiudi'));b.onclick=close;a.append(src,b);box.append(a);
    });
  }
  function setMode(mode){
    S.mode=mode;
    left.classList.toggle('closed',mode==='journey'||narrow());syncToggles();
    lt.textContent=mode==='journey'?t('Stadsplanen','The city plan','Il piano della città'):t(`Vägval för ${PLACE.name}`,`Choices for ${PLACE.name}`,`Scelte per ${PLACE.name}`);
    lp.textContent=mode==='journey'?t('Vägvalen ändras genom besluten varje decennium.','The choices change through the decisions each decade.','Le scelte cambiano con le decisioni di ogni decennio.'):t('Välj hur långt kommunen ska gå inom varje område. Ändringarna gäller från 2026 och genomförs i den takt staden orkar.','Choose how far the municipality should go in each area. Changes apply from 2026 and are carried out as fast as the city can manage.','Scegli fin dove deve spingersi il Comune in ogni ambito. Le modifiche valgono dal 2026 e si realizzano al ritmo che la città riesce a sostenere.');
    play.classList.toggle('locked',mode==='journey');play.setAttribute('aria-disabled',String(mode==='journey'));playLabel.textContent=mode==='journey'?'':t('Spela seklet','Play the century','Riproduci il secolo');
    if(mode==='sandbox'&&!S.schedule.length)S.schedule=[{from:START,set:{}}];
    if(!S.run)resimulate();
  }
  // ---------- Postcard ----------
  // A postcard from the year shown (ui/postcard.js): the view as it is, with the year, what has changed
  // since 2026 and the plan, to save or share. It opens in a layer of its own, so it also works over the
  // journey's closing summary.
  function cardText(){
    const y=Math.min(END,Math.floor(S.year)),d=S.run.years[y-START],base=S.run.years[0];
    const top=(story.until&&story.marked[0]?.c)||ranked(visionAt(S.year),base.vision,.06)[0]?.c;
    let lead=t(`Utgångsläget: ${PLACE.name} som det mäts i dag.`,`The starting point: ${PLACE.name} as it is measured today.`,`Il punto di partenza: ${PLACE.name} com'è misurata oggi.`);
    if(y>START&&top){const c=changeSpec(top,S.run,y,null);lead=`${c.title}: ${c.fmt(c.value)} ${c.unit} (2026: ${c.fmt(c.from)}).`;}
    else if(y>START)lead=t('Staden ser ut ungefär som 2026.','The city looks much as it did in 2026.',"La città appare più o meno com'era nel 2026.");
    const lines=[t(`${PLACE.name}-index ${Math.round(mean(d.sdg))} av 100 (2026: ${Math.round(mean(base.sdg))}).`,`${PLACE.name} index ${Math.round(mean(d.sdg))} of 100 (2026: ${Math.round(mean(base.sdg))}).`,`Indice ${PLACE.name} ${Math.round(mean(d.sdg))} su 100 (2026: ${Math.round(mean(base.sdg))}).`)];
    const ev=S.events&&S.run.chronicle.find(e=>e.year===y);
    if(ev)lines.push(`${ev.icon} ${ev.title}: ${ev.text.split('. ')[0].replace(/\.$/,'')}.`);
    const plan=S.mode==='journey'?t(`Resan – mitt ${PLACE.name}`,`The journey – my ${PLACE.name}`,`Il viaggio – la mia ${PLACE.name}`):S.preset?PRESETS.find(p=>p.id===S.preset)?.name:planEmpty()?t('Dagens kurs','The current course','La rotta attuale'):t('Min plan','My plan','Il mio piano');
    const url=(document.querySelector('meta[property="og:url"]')?.content||location.origin+location.pathname).replace(/^https?:\/\//,'').replace(/\/$/,'');
    return {year:y,era:eraName(S.year),plan,world:WORLDS.find(w=>w.id===S.world)?.name||'',lead,lines,url,
      credit:CITY.credits.short[LANG]||CITY.credits.short.sv};
  }
  // The words that go with a shared postcard: which Kalmar and when, what has changed most, what
  // Kalmar 2126 is, and the link.
  function shareText(c,link){
    const which=S.mode==='journey'?t(`mitt ${PLACE.name} från Resan`,`my ${PLACE.name} from the Journey`,`la mia ${PLACE.name} dal Viaggio`):
      S.preset==='dagens'||(!S.preset&&planEmpty())?t('dagens kurs, utan nya beslut','the current course, with no new decisions','la rotta attuale, senza nuove decisioni'):
      S.preset?c.plan:t('min egen plan','my own plan','il mio piano');
    const world=S.world==='ssp245'?'':` (${c.world})`;
    return `${t(`Vykort från ${PLACE.name} år ${c.year}`,`A postcard from ${PLACE.name} in ${c.year}`,`Una cartolina da ${PLACE.name} nel ${c.year}`)} – ${which}${world}. ${c.lead}\n\n`+
      t(`${PLACE.name} 2126 är en simulering av hur ${PLACE.name} kan utvecklas de kommande hundra åren, byggd på forskning och ${PLACE.genitive} egen statistik. Se hela visionen eller gör dina egna vägval:`,
        `${PLACE.name} 2126 simulates how ${PLACE.name}, ${PLACE.country}, could develop over the next hundred years, built on research and ${PLACE.genitive} own statistics. See the whole vision or make your own choices:`,`${PLACE.name} 2126 simula come ${PLACE.name} (${PLACE.country}) potrebbe svilupparsi nei prossimi cent'anni, sulla base della ricerca e delle statistiche ${PLACE.genitive}. Guarda tutta la visione o fai le tue scelte:`)+`\n${link}`;
  }
  async function showPostcard(){
    if(S.playing)togglePlay(false);
    const text=cardText();
    const ov=el('div','overlay postcard-overlay'),box=el('div','panel modal postcard');
    const frame=el('div','postcard-frame',t('Tar bilden …','Taking the picture …','Scatto la foto …')),acts=el('div','actions');
    let url=null;
    const close=()=>{ov.remove();if(url)URL.revokeObjectURL(url);removeEventListener('keydown',onKey,true);};
    const onKey=e=>{if(e.code==='Escape'){e.stopImmediatePropagation();close();}};
    addEventListener('keydown',onKey,true);ov.onclick=e=>{if(e.target===ov)close();};
    const x=el('button','btn',t('Stäng','Close','Chiudi'));x.onclick=close;acts.append(x);
    box.append(el('h1','',t(`Vykort från ${text.year}`,`Postcard from ${text.year}`,`Cartolina dal ${text.year}`)),frame,acts);ov.append(box);document.body.append(ov);dialog(ov,box);
    const shot=await engine.snapshot(1600);
    const blob=await new Promise(r=>drawPostcard(shot,text).toBlob(r,'image/jpeg',.9));
    if(!ov.isConnected||!blob)return;
    url=URL.createObjectURL(blob);
    const img=el('img');img.src=url;img.alt=`${PLACE.name} ${text.year}. ${text.lead} ${text.lines.join(' ')}`;frame.replaceChildren(img);
    const name=`${CITY.slug}-2126-${text.year}${S.preset?'-'+S.preset:''}.jpg`,file=new File([blob],name,{type:'image/jpeg'}),link=planLink();
    const save=el('a','btn primary',t('Spara bilden','Save the picture',"Salva l'immagine"));save.href=url;save.download=name;
    const copy=el('button','btn',t('Kopiera länken till planen','Copy the link to the plan','Copia il link al piano'));
    copy.onclick=()=>navigator.clipboard?.writeText(link).then(()=>{copy.textContent=t('Länken är kopierad','The link is copied','Link copiato');}).catch(()=>{});
    acts.prepend(save);
    // Phones (and Safari) share the picture itself through the system's share sheet, with a few words
    // on what it shows and what Kalmar 2126 is, and the short link to the plan.
    if(navigator.canShare?.({files:[file]})){const share=el('button','btn',t('Dela …','Share …','Condividi …'));share.onclick=()=>navigator.share({files:[file],title:`${PLACE.name} 2126`,text:shareText(text,link)}).catch(()=>{});save.after(share);}
    x.before(copy);
  }
  // ---------- Printout ----------
  // "Min vision för Kalmar" on paper (ui/printout.js): the year shown – or 2126 while the timeline is
  // still near 2026 – with a picture of the city as it looks right now.
  async function printPlan({preview=false}={}){
    if(S.playing)togglePlay(false);
    if(S.year<START+10&&S.mode!=='journey'){S.year=END;applyYear(true);}
    unmark();say(t('Utskriften förbereds …','Preparing the printout …','Preparo la stampa …'));
    await new Promise(r=>setTimeout(r,preview?400:900));
    const shot=await engine.snapshot(1800),text=cardText();
    const opts={run:S.run,year:S.year,plan:text.plan,world:text.world,url:planLink(),image:shot.toDataURL('image/jpeg',.88),lead:text.lead};
    return preview?buildPrintout(opts):printout(opts);
  }
  // ---------- Journey ----------
  const journey=createJourney({S,modal,closeModal,resimulate:()=>resimulate(),setYear,engine,evidenceList,el,setMode:m=>setMode(m),onEvent:e=>say(`${e.year}. ${e.title}. ${e.text}`),postcard:()=>showPostcard(),print:()=>printPlan()});
  function startJourney(){S.schedule=[{from:START,set:{}}];S.year=START;story.seen={};setMode('journey');resimulate();journey.start();}

  // ---------- Ride: walk, cycle, robot taxi ----------
  const rideHud=el('div','panel ride-hud hidden');document.body.append(rideHud);
  const rideTitle=el('div','ride-title'),rideHint=el('div','ride-hint small'),rideInfo=el('div','ride-info small');
  const destRow=el('div','ride-dest');const destInput=el('input');destInput.placeholder=t('Vart vill du åka? Gata och nummer, eller en plats …','Where to? Street and number, or a place …','Dove vuoi andare? Via e numero, oppure un luogo …');destInput.setAttribute('list','ride-addresses');destInput.setAttribute('aria-label',t('Adress eller plats','Address or place','Indirizzo o luogo'));
  const dl=document.createElement('datalist');dl.id='ride-addresses';destRow.append(destInput,dl);
  const goBtn=el('button','btn primary',t('Åk','Go','Vai'));destRow.append(goBtn);
  const exitBtn=el('button','btn',t('Avsluta','Exit','Esci'));exitBtn.onclick=()=>stopRide();
  const rideTop=el('div','ride-top');rideTop.append(rideTitle,exitBtn);
  rideHud.append(rideTop,destRow,rideInfo,rideHint);
  const MODES={walk:[t('🚶 Till fots','🚶 On foot','🚶 A piedi'),t('W/S framåt och bakåt · A/D vrid · Q/E sidled · Shift springer · dra med musen för att se dig om','W/S forward and back · A/D turn · Q/E sidestep · Shift runs · drag the mouse to look around','W/S avanti e indietro · A/D gira · Q/E passo laterale · Shift corri · trascina il mouse per guardarti intorno')],
    bike:[t('🚲 På cykel','🚲 By bike','🚲 In bici'),t('W trampar · S bromsar · A/D styr · dra med musen för att se dig om · V växlar till vy bakifrån','W pedals · S brakes · A/D steers · drag the mouse to look around · V switches to the view from behind','W pedala · S frena · A/D sterza · trascina il mouse per guardarti intorno · V passa alla vista da dietro')],
    taxi:[t('🚕 Robottaxi','🚕 Robot taxi','🚕 Robotaxi'),t('Skriv en adress – taxin kör själv. Dra med musen för att se dig om · V växlar vy inifrån/utifrån.','Type an address – the taxi drives itself. Drag the mouse to look around · V switches between inside and outside.','Scrivi un indirizzo – il taxi guida da solo. Trascina per guardarti intorno · V cambia vista.')],
    gondola:[t('🛶 Gondol','🛶 Gondola','🛶 In gondola'),t('Skriv en adress – gondoljären ror dit längs kanalerna. Dra med musen för att se dig om · V växlar vy inifrån/utifrån.','Type an address – the gondolier rows you there along the canals. Drag the mouse to look around · V switches between inside and outside.','Scrivi un indirizzo – il gondoliere ti porta lungo i canali. Trascina per guardarti intorno · V cambia vista.')],
    boat:[t('🚤 Vattentaxi','🚤 Water taxi','🚤 Taxi acqueo'),t('Skriv en adress – den eldrivna taxibåten tar sig dit längs kanalerna. Dra med musen för att se dig om · V växlar vy inifrån/utifrån.','Type an address – the electric water taxi finds its way along the canals. Drag the mouse to look around · V switches between inside and outside.','Scrivi un indirizzo – il taxi acqueo elettrico arriva lungo i canali. Trascina per guardarti intorno · V cambia vista.')]};
  // A place chooses its modes (CITY.ride.modes – Venice: on foot, by gondola and by water taxi); the boats
  // need the canals' centre lines in the pack (map.json waterways).
  const ALLOWED=CITY.ride?.modes||['walk','bike','taxi'];
  for(const m of Object.keys(MODES))if(!ALLOWED.includes(m)||(['gondola','boat'].includes(m)&&!engine.ride.water))delete MODES[m];
  // Modes that drive themselves to an address.
  const AUTO=new Set(['taxi','gondola','boat']);
  function showRideMenu(){
    modal((box,close)=>{
      box.append(el('h1','',t(`Upplev ${PLACE.name}`,`Experience ${PLACE.name}`,`Vivi ${PLACE.name}`)),el('p','',t('Lämna kartvyn och upplev staden på gatunivå, i det år du valt. Du startar där kartan tittar just nu.','Leave the map view and experience the city at street level, in the year you have chosen. You start where the map is looking now.',"Lascia la vista dall'alto e vivi la città al livello della strada, nell'anno che hai scelto. Parti dal punto che la mappa sta inquadrando adesso.")));
      const grid=el('div','cards');
      for(const [m,[title,hint]] of Object.entries(MODES)){const c=el('button','choice');c.append(el('b','',title),el('span','',{taxi:t('Självkörande eltaxi. Ange en adress och luta dig tillbaka.','A self-driving electric taxi. Enter an address and sit back.','Un taxi elettrico a guida autonoma. Scrivi un indirizzo e rilassati.'),
          bike:t('Cykla längs gatorna och stråken.','Cycle along the streets and paths.','Pedala lungo strade e percorsi.'),
          gondola:t('Glid genom kanalerna i en gondol, i gondoljärens takt.','Glide through the canals in a gondola, at the gondolier\'s pace.','Scivola tra i canali in gondola, al ritmo del gondoliere.'),
          boat:t('En tyst eldriven vattentaxi längs kanalerna. Ange en adress.','A quiet electric water taxi along the canals. Enter an address.','Un taxi acqueo elettrico e silenzioso lungo i canali. Scrivi un indirizzo.')}[m]
          ??t('Gå runt bland husen, torgen och odlingarna.','Walk among the houses, squares and gardens.','Cammina tra le case, i campi e gli orti.')));c.onclick=()=>{close();startRide(m);};grid.append(c);}
      box.append(grid);
    });
  }
  let preRide=null;
  function startRide(mode){
    S.playing=false;setPlayIcon();
    preRide={left:left.classList.contains('closed'),right:rightP.classList.contains('closed')};
    left.classList.add('closed');rightP.classList.add('closed');syncToggles();
    engine.ride.start(mode);
    rideTitle.textContent=MODES[mode][0];rideHint.textContent=MODES[mode][1];
    destRow.style.display=AUTO.has(mode)?'flex':'none';rideInfo.textContent=AUTO.has(mode)?t('Ingen adress än.','No address yet.','Nessun indirizzo ancora.'):'';
    if(AUTO.has(mode)){engine.ride.ready.then(()=>dl.replaceChildren(...engine.ride.addresses.map(a=>{const o=document.createElement('option');o.value=a.name;if(a.kind!=='adress')o.label=a.kind==='plats'?t('plats','place','luogo'):t('gata','street','via');return o;})));setTimeout(()=>destInput.focus(),50);}
    rideHud.classList.remove('hidden');document.body.classList.add('riding');rideBtn.classList.add('primary');
  }
  function stopRide(){
    engine.ride.stop();rideHud.classList.add('hidden');document.body.classList.remove('riding');rideBtn.classList.remove('primary');
    if(preRide){left.classList.toggle('closed',preRide.left);rightP.classList.toggle('closed',preRide.right);syncToggles();}
  }
  // "Storgatan 12", "storgatan 12 b", a street, or a place. A number the map does not have goes to
  // the nearest number on the same side of that street.
  const rideNote={text:'',until:0};
  function findAddress(input){
    const norm=x=>x.toLowerCase().replace(/\s+/g,' ').trim(),q=norm(input),list=engine.ride.addresses;
    const exact=list.find(a=>norm(a.name)===q);if(exact)return {hit:exact};
    const m=q.match(/^(.*?)\s*(\d+)\s*([a-zåäö]?)$/);
    if(m&&m[1]){
      const streets=list.filter(a=>a.kind==='gata'),st=streets.find(a=>norm(a.name)===m[1])||streets.find(a=>norm(a.name).startsWith(m[1]))||streets.find(a=>norm(a.name).includes(m[1]));
      if(st){
        const asked=`${st.name} ${m[2]}${m[3].toUpperCase()}`,nums=list.filter(a=>a.street===st.name);
        const same=nums.find(a=>norm(a.num)===m[2]+m[3]);if(same)return {hit:same};
        const n=+m[2],num=a=>parseInt(a.num)||0,side=nums.filter(a=>num(a)%2===n%2),pool=side.length?side:nums;
        if(pool.length)return {hit:pool.reduce((b,a)=>Math.abs(num(a)-n)<Math.abs(num(b)-n)?a:b),asked};
        return {hit:st,asked};
      }
    }
    const hit=list.find(a=>a.kind!=='adress'&&norm(a.name).startsWith(q))||list.find(a=>norm(a.name).startsWith(q))||list.find(a=>norm(a.name).includes(q));
    return hit?{hit}:null;
  }
  function go(){
    if(!destInput.value.trim())return;
    const found=findAddress(destInput.value);
    if(!found){rideInfo.textContent=t(`Hittar ingen adress som matchar ”${destInput.value}”.`,`No address matches “${destInput.value}”.`,`Nessun indirizzo corrisponde a “${destInput.value}”.`);return;}
    const {hit,asked}=found;destInput.value=hit.name;
    const note=asked?t(`${asked} finns inte på kartan – närmast är ${hit.name}. `,`${asked} is not on the map – the nearest is ${hit.name}. `,`${asked} non è sulla mappa – il più vicino è ${hit.name}. `):'';
    Object.assign(rideNote,{text:note,until:performance.now()+6000});
    rideInfo.textContent=engine.ride.setDestination(hit)?note+t(`På väg till ${hit.name} …`,`On the way to ${hit.name} …`,`In viaggio verso ${hit.name} …`):t(`Hittar ingen väg till ${hit.name}.`,`No route to ${hit.name}.`,`Nessun percorso per ${hit.name}.`);
    destInput.blur();
  }
  goBtn.onclick=go;destInput.addEventListener('keydown',e=>{if(e.key==='Enter')go();e.stopPropagation();});
  engine.ride.onArrive=d=>{rideInfo.textContent=t(`Framme vid ${d.name}. Vart vill du åka nu?`,`Arrived at ${d.name}. Where to next?`,`Destinazione raggiunta: ${d.name}. Dove vuoi andare adesso?`);destInput.value='';destInput.focus();};
  function updateRideHud(){
    if(!AUTO.has(engine.ride.mode)||!engine.ride.dest||engine.ride.arrived)return;
    const r=engine.ride.remaining(),v=Math.max(1,engine.ride.speed);
    {const dist=r>950?dec(r/1000)+' km':Math.round(r/10)*10+' m',min=Math.max(1,Math.round(r/v/60)),kmh=Math.round(engine.ride.speed*3.6);
    rideInfo.textContent=(performance.now()<rideNote.until?rideNote.text:'')+t(`På väg till ${engine.ride.dest.name} · ${dist} kvar · cirka ${min} min · ${kmh} km/h`,`On the way to ${engine.ride.dest.name} · ${dist} to go · about ${min} min · ${kmh} km/h`,`In viaggio verso ${engine.ride.dest.name} · mancano ${dist} · circa ${min} min · ${kmh} km/h`);}
  }
  // ---------- Map controls ----------
  const nav=el('div','tl-nav');
  const navBtn=(cls,label,title,action)=>{const b=el('button','nav-btn '+cls,label);b.title=title;b.setAttribute('aria-label',title);
    // Hold to repeat.
    let timer=null;const stop=()=>{clearInterval(timer);timer=null;};
    b.addEventListener('pointerdown',e=>{e.preventDefault();engine.mapControl(action);if(!['north','home'].includes(action))timer=setInterval(()=>engine.mapControl(action),260);});
    b.addEventListener('pointerup',stop);b.addEventListener('pointerleave',stop);b.addEventListener('pointercancel',stop);
    b.addEventListener('click',e=>{if(e.detail===0)engine.mapControl(action);});
    return b;};
  const compass=navBtn('compass','','',`north`);named(compass,t('Norr uppåt','North up','Nord in alto'));compass.innerHTML='<svg viewBox="0 0 24 24" width="22" height="22"><path d="M12 2 L16 12 L12 10.5 L8 12 Z" fill="#d03b3b"/><path d="M12 22 L8 12 L12 13.5 L16 12 Z" fill="#9aa3ab"/><text x="12" y="7.2" text-anchor="middle" font-size="0" fill="#fff">N</text></svg>';
  const rot=el('div','nav-row');rot.append(navBtn('rot','↺',t('Vrid åt vänster','Rotate left','Ruota a sinistra'),'left'),compass,navBtn('rot','↻',t('Vrid åt höger','Rotate right','Ruota a destra'),'right'));
  const zoom=el('div','nav-col');zoom.append(navBtn('','+',t('Zooma in','Zoom in','Ingrandisci'),'in'),navBtn('','−',t('Zooma ut','Zoom out','Rimpicciolisci'),'out'));
  const tilt=el('div','nav-col');tilt.append(navBtn('small','⤒',t('Luta uppåt (se mer horisont)','Tilt up (more horizon)',"Inclina verso l'alto (più orizzonte)"),'down'),navBtn('small','⤓',t('Luta nedåt (mer ovanifrån)','Tilt down (more from above)',"Inclina verso il basso (più dall'alto)"),'up'));
  const homeB=navBtn('','⌂',t(`Översikt över hela ${PLACE.centre}`,`Overview of all of ${PLACE.centre}`,`Vista d'insieme ${PLACE.centreGenitive}`),'home');
  nav.append(rot,el('div','nav-sep'),zoom,tilt,homeB);tl.append(el('div','tl-sep'),nav);
  // ---------- AR layer ----------
  const callouts=createCallouts((x,y,z)=>engine.project(x,y,z));
  let arTimer=0,arYear=-1;
  // The free screen area between the interface panels (AR panels and pins must stay inside it).
  function freeArea(){
    const W=innerWidth,H=innerHeight,vis=e=>{if(!e||e.classList.contains('closed')||e.classList.contains('hidden'))return false;const r=e.getBoundingClientRect();return r.width>0&&r.right>0&&r.left<W&&getComputedStyle(e).display!=='none';};
    let l=8,r=W-8,tp=8,b=H-8;
    const tb=top.getBoundingClientRect();tp=Math.max(tp,tb.bottom+8);
    if(!narrow())for(const e of [toggleL,toggleR]){const q=e.getBoundingClientRect();if(q.width<2)continue;if(q.left<W/2)l=Math.max(l,q.right+6);else r=Math.min(r,q.left-6);}
    if(vis(left)){const q=left.getBoundingClientRect();if(q.width<W*.6)l=Math.max(l,q.right+10);else b=Math.min(b,q.top-8);}
    if(vis(rightP)){const q=rightP.getBoundingClientRect();if(q.width<W*.6)r=Math.min(r,q.left-10);else b=Math.min(b,q.top-8);}
    // Anything else on screen narrows the area from the edge it sits at (hidden elements are skipped).
    for(const e of [document.getElementById('timeline'),document.querySelector('.ride-hud:not(.hidden)'),insp.classList.contains('hidden-soft')?null:insp]){
      if(!e)continue;const q=e.getBoundingClientRect();if(q.height<2||q.width<2)continue;
      if(q.top>H/2)b=Math.min(b,q.top-8);
      else if(q.left<W/2&&q.right<W*.6)l=Math.max(l,q.right+10);
      else tp=Math.max(tp,q.bottom+8);
    }
    return {left:l,right:r,top:tp,bottom:b};
  }
  function updateAR(dt){
    const now=performance.now()/1000;
    if(S.ar&&S.run&&(arTimer-=dt)<=0){
      arTimer=.5;
      const A=freeArea(),cx=(A.left+A.right)/2,cy=(A.top+A.bottom)/2;
      // Only what is actually in view: on screen inside the free area, close enough for the zoom,
      // and with a clear line of sight from the camera.
      const reach=Math.max(220,(engine.view?.dist||200)*2.4);
      const inside=p=>p&&p.x>A.left+40&&p.x<A.right-40&&p.y>A.top+60&&p.y<A.bottom-20;
      // Fixed places (the sea, the wall, the tower …) and the nearest visible things of each kind.
      const fixed=AR_SPOTS.filter(sp=>sp.at.x||sp.at.z).map(sp=>({sp,at:sp.at,p:engine.project(sp.at.x,sp.at.y,sp.at.z)}));
      const local=engine.arAnchors(Math.min(260,reach)).map(a=>({sp:AR_SPOTS.find(s=>s.id===a.spot),at:a.at,p:engine.project(a.at.x,a.at.y,a.at.z)})).filter(o=>o.sp);
      const seen=new Set(),pick=[];
      for(const o of [...local,...fixed].filter(o=>inside(o.p)&&engine.visible(o.at.x,o.at.y+1,o.at.z,reach)).sort((a,b)=>Math.hypot(a.p.x-cx,a.p.y-cy)-Math.hypot(b.p.x-cx,b.p.y-cy))){
        if(seen.has(o.sp.id))continue;seen.add(o.sp.id);pick.push(o);if(pick.length>=3)break;
      }
      const vis=pick.map(o=>({sp:{...o.sp,at:o.at}}));
      callouts.show(vis.map(o=>arSpec(o.sp,S.run,S.year)),now);
    }
    // The film drives the callouts on its own clock.
    if(!document.body.classList.contains('film'))callouts.update(now,freeArea());
  }
  // ---------- The story: markers, the following camera, the news ----------
  const film=()=>document.body.classList.contains('film');
  // Markers for changes: [{c (a CHANGES entry), at, delay}] for the year shown, for `secs` seconds.
  function mark(list,secs){
    if(S.ar||film())return;
    story.marked=list;story.until=performance.now()/1000+secs;story.refresh=0;
    callouts.show(list.map(o=>({...changeSpec(o.c,S.run,S.year,o.at),delay:o.delay??0})),performance.now()/1000);
  }
  function unmark(){if(story.until&&!S.ar)callouts.clear(performance.now()/1000);story.until=0;story.marked=[];}
  // Where a change shows, if it is in the free part of the view: {c, at} or null.
  function inView(c,from,to,A=freeArea()){
    const at=engine.changeAt(c.anchor,from,to),p=at&&engine.project(at.x,at.y,at.z);
    return p&&p.x>A.left+40&&p.x<A.right-40&&p.y>A.top+60&&p.y<A.bottom-20?{c,at}:null;
  }
  // A year chosen on the timeline: up to three of the largest changes since 2026 that are in view.
  function markChanges(){
    if(S.mode==='start'||S.mode==='journey'||film())return;
    const y=S.year,v=visionAt(y),v0=S.run.years[0].vision,list=ranked(v,v0,.1),picks=[],A=freeArea();
    for(const o of list){
      if(picks.length>=3)break;
      const p=inView(o.c,o.c.v(v0),o.c.v(v),A);if(p)picks.push(p);
    }
    if(!picks.length)return unmark();
    for(const o of picks)story.seen[o.c.id]=o.c.v(v);
    mark(picks,9);
  }
  // The year chosen, in words for a screen reader: the Kalmar index and the largest change since 2026.
  function tellYear(){
    if(!S.run)return;
    const y=Math.floor(S.year),d=S.run.years[y-START],top=ranked(visionAt(y),S.run.years[0].vision,.1)[0];
    let text=`${y}, ${eraName(y)}. ${t(`${PLACE.name}-index ${Math.round(mean(d.sdg))}`,`${PLACE.name} index ${Math.round(mean(d.sdg))}`,`Indice ${PLACE.name} ${Math.round(mean(d.sdg))}`)}.`;
    if(top&&y>START){const c=changeSpec(top.c,S.run,y,null);text+=` ${c.title}: ${c.fmt(c.value)} ${c.unit} (2026: ${c.fmt(c.from)}).`;}
    const ev=S.events&&S.run.chronicle.find(e=>e.year===y);if(ev)text+=` ${ev.title}.`;
    say(text);
  }
  // While the years run: every few seconds the change in view that has moved most since it was last shown.
  function markChange(){
    const v=visionAt(S.year),v0=S.run.years[0].vision,A=freeArea();
    const list=CHANGES.map(c=>{const from=story.seen[c.id]??c.v(v0);return {c,from,m:c.weight*Math.abs(c.v(v)-from)};}).filter(o=>o.m>=.12).sort((a,b)=>b.m-a.m);
    for(const o of list){
      const p=inView(o.c,o.from,o.c.v(v),A);if(!p)continue;
      story.seen[o.c.id]=o.c.v(v);mark([p],7);return;
    }
  }
  function news(e,{secs=6,cue=true}={}){
    story.toast?.remove();
    const box=el('div','panel toast'),body=el('div');body.append(el('h4','',`${e.year} · ${e.title}`),el('p','',e.text));
    // Closing the news lets the years run on at once.
    const x=named(el('button','icon-btn','×'),t('Stäng','Close','Chiudi'));x.style.cssText='width:26px;height:26px';x.onclick=()=>{box.remove();story.toast=null;story.hold=0;};
    box.append(el('div','ic',e.icon),body,x);document.body.append(box);story.toast=box;story.toastTime=secs;if(cue)engine.audio.cue('event');
    say(`${e.year}. ${e.title}. ${e.text}`);
  }
  function storyFrame(dt){
    const now=performance.now()/1000;
    if(story.toast&&(story.toastTime-=dt)<=0){story.toast.remove();story.toast=null;}
    if(story.until){
      if(now>story.until||S.ar){if(!S.ar)callouts.clear(now);story.until=0;story.marked=[];}
      // While the years run, the markers keep their figures current.
      else if(S.playing&&(story.refresh-=dt)<=0){story.refresh=.5;callouts.show(story.marked.map(o=>changeSpec(o.c,S.run,S.year,o.at)),now);}
    }
    // While the years run, a change in view is marked every 5 s – not while the news is being read.
    const running=(S.playing&&S.mode!=='journey')||journey.animating;
    if(!running||story.hold>0||engine.ride.mode||S.compare||film())return;
    if((story.next-=dt)<=0){story.next=5;markChange();}
  }
  // ---------- Per-frame ----------
  const pinV={x:0,y:0,z:0};
  function frame(dt){
    updateAR(dt);
    compass.firstChild.style.transform=`rotate(${(-(engine.heading||0))*180/Math.PI}deg)`;
    if(engine.ride.mode&&(frame.r=(frame.r||0)+dt)>.3){frame.r=0;updateRideHud();}
    if(dashPending)renderDashboard();
    if(S.playing&&S.mode!=='journey'){
      if(story.hold>0)story.hold-=dt;
      else{
        const from=Math.floor(S.year);S.year=Math.min(END,S.year+dt*2.2);
        // An event reached: the years hold while its news is read and its weather passes.
        const ev=S.run.chronicle.find(e=>!story.told.has(e.id)&&e.year>from&&e.year<=Math.floor(S.year));
        // Weather to see holds longer; other news holds while it is read.
        if(ev){story.told.add(ev.id);S.year=ev.year+.5;news(ev);const w=weatherOf(ev);story.hold=w.storm||w.haze||w.empty?4.6:2.4;}
        if(S.year>=END){S.playing=false;setPlayIcon();}
      }
      applyYear();
    }
    journey.frame(dt);
    storyFrame(dt);
    const h=engine.world.hour;time.textContent=`${String(Math.floor(h)).padStart(2,'0')}:${String(Math.floor(h%1*60)).padStart(2,'0')}`;sun.textContent=h>5&&h<21.5?'☀':'☾';
    if(S.selected&&(frame.t=(frame.t||0)+dt)>.4){frame.t=0;renderInspector();}
    // Pins: present places always, future places once their lever is under way.
    const I=S.run?.years[Math.floor(S.year)-START].I||{};
    pinLayer.style.display=engine.ride.mode||S.ar?'none':'';
    if(!engine.ride.mode&&!S.ar){
      const A=freeArea(),placed=[];
      // Nearest first; a pin that would overlap a placed one, or leave the free area, is hidden.
      const list=pins.map(o=>{const show=!o.p.lever||I[o.p.lever]>.35||(CITY.alwaysPinned||[]).includes(o.p.id);
        return {...o,s:show&&engine.project(o.p.x,o.p.y??(o.p.kind==='energi'?120:14),o.p.z)};}).sort((a,b)=>(a.s?.d??1e9)-(b.s?.d??1e9));
      for(const {p,pin,dot,s} of list){
        if(!s||s.x<A.left+10||s.x>A.right-10||s.y<A.top+30||s.y>A.bottom){pin.style.display='none';continue;}
        const w=p.name.length*7.2+30,box={l:s.x-w/2,r:s.x+w/2,t:s.y-40,b:s.y};
        if(placed.some(q=>box.l<q.r+6&&q.l<box.r+6&&box.t<q.b+4&&q.t<box.b+4)){pin.style.display='none';continue;}
        placed.push(box);
        pin.style.display='flex';pin.style.left=s.x+'px';pin.style.top=s.y+'px';pin.style.opacity=String(s.fade);
        pin.classList.toggle('future',Boolean(p.lever&&I[p.lever]>.35));dot.style.background=p.lever?THEME[LEVER[p.lever].theme].color:'#7d8781';
      }
    }
  }
  // On a phone a tap on the map puts an open sheet away (the tap selects no one).
  function mapTap(){
    if(!narrow()||(left.classList.contains('closed')&&rightP.classList.contains('closed')))return false;
    left.classList.add('closed');rightP.classList.add('closed');syncToggles();return true;
  }
  addEventListener('resize',()=>{if(S.run)drawCentury();});
  addEventListener('keydown',e=>{if(e.code==='Escape'){if(engine.ride.mode){stopRide();return;}closeDrawer();if(S.mode!=='start')closeModal();}});
  resimulate();
  return {S,frame,select,showStart,resimulate,setYear,callouts,pause:()=>togglePlay(false),loadShared,openShared,showSources,setMode,startJourney,loadPreset,renderDashboard,
    onResidentClick:p=>select(p),mapTap,printPlan,sharedLink:h=>parsePlanHash(h)?h:null,
    // The century is playing (the timeline, or the journey between its decisions): the day runs as a time-lapse.
    get lapse(){return ((S.playing&&S.mode!=='journey')||journey.animating)&&!film();}};
}
