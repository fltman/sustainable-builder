// Clicks through the whole site in a real browser and fails on any script error or missing file:
// every start, every tab at several years, the menus, the levers and worlds, compare, AR, sound, the
// three ways to explore the streets, a shared plan, the change markers, the printout, the journey to its end,
// English, a phone, and the keyboard (dialogs, the timeline slider, tabs, menu, what a screen reader
// is told, less motion).
// Run it before publishing:
//   npm run smoke            against the dev server on :5230 (or SMOKE_URL=…)
//   npm run release          tests, builds, then smoke-tests the built dist/ in vite preview
// HEADED=1 shows the browser; ONLY=journey,phone runs some of the scenarios.
import { chromium } from '@playwright/test';
import { preview } from 'vite';
import { existsSync, readFileSync } from 'node:fs';
import { citySlug, cityOf } from '../city.config.mjs';
// The place under test (CITY=<slug>, or site/.city).
const { CITY }=await import(`${cityOf().vision}/config.js`);
// The place's own first language (Venice speaks Italian and English, no Swedish) and the interface's words in it.
const LANGS=CITY.langs||['sv','en'],L0=LANGS.includes('sv')?'sv':LANGS[0],PLACE_NAME=(CITY[L0]||CITY.sv).name;
const TX={'Fritt läge':{en:'Free mode',it:'Modalità libera'},'Om modellen':{en:'About the model',it:'Informazioni sul modello'},'Alla källor':{en:'All sources',it:'Tutte le fonti'},
  'Siffror':{en:'Figures',it:'Numeri'},'Mål':{en:'Goals',it:'Obiettivi'},'Stäng':{en:'Close',it:'Chiudi'},'Avsluta':{en:'Exit',it:'Esci'},
  'Dela din plan':{en:'Share your plan',it:'Condividi il tuo piano'},'Se filmen':{en:'Watch the film',it:'Guarda il film'},'Startmenyn':{en:'Start screen',it:'Schermata iniziale'},
  'Den delade visionen':{en:'The shared vision',it:'La visione condivisa'},'Utforska en vision':{en:'Explore a vision',it:'Esplora una visione'},
  'Resan 2026':{en:'The journey 2026',it:'Il viaggio 2026'},'Till de första vägvalen':{en:'To the first choices',it:'Alle prime scelte'},
  'Forskningen säger':{en:'What the research says',it:'Cosa dice la ricerca'},'Spola fram till':{en:'Fast-forward to',it:'Avanti fino al'},
  'Avsluta resan':{en:'End the journey',it:'Termina il viaggio'},'Vykort från 2126':{en:'Postcard from 2126',it:'Cartolina dal 2126'},
  'Skriv ut':{en:'Print',it:'Stampa'},'Spara ett vykort':{en:'Save a postcard',it:'Salva una cartolina'},'vatten':{en:'water',it:'acqua'}};
const tx=s=>L0==='sv'?s:(TX[s]?.[L0]??s);
const EXPLORE_FREELY={sv:`Utforska ditt ${PLACE_NAME} fritt`,en:`Explore your ${PLACE_NAME} freely`,it:`Esplora liberamente la tua ${PLACE_NAME}`}[L0];
// The place's film, if it has one (config or a rendered film in the pack), and an address to ride to.
const HAS_FILM=Boolean(CITY.film)||[`${citySlug()}-2126`,`${citySlug()}-2126-${L0}`].some(f=>existsSync(`${cityOf().pack}/film/${f}.mp4`));
const ADDRESSES=existsSync(`${cityOf().pack}/addresses.json`)?JSON.parse(readFileSync(`${cityOf().pack}/addresses.json`,'utf8')).addresses:[];
const ADDRESS=ADDRESSES.some(([s,n])=>s==='Storgatan'&&n==='12')?'Storgatan 12':ADDRESSES.length?ADDRESSES[0].slice(0,2).join(' '):null;

const DIST=process.argv.includes('--dist'),ONLY=process.env.ONLY?.split(',');
let server=null,base=process.env.SMOKE_URL||'http://localhost:5230/';
if(DIST){server=await preview({preview:{port:5239,strictPort:true,host:'127.0.0.1'},logLevel:'warn'});base='http://127.0.0.1:5239/';}
const browser=await chromium.launch({executablePath:process.env.CHROME||`${process.env.HOME}/Library/Caches/ms-playwright/chromium-1243/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`,
  headless:!process.env.HEADED,args:['--use-angle=metal','--enable-gpu','--ignore-gpu-blocklist','--enable-unsafe-swiftshader','--autoplay-policy=no-user-gesture-required']});

const faults=[];let step='';
const fault=msg=>faults.push(`${step}: ${msg}`);
// language: come through the first screen and choose it there, as someone opening a link does.
async function open(query,{phone=false,reduced=false,language=null}={}){
  const ctx=await browser.newContext({...(phone?{viewport:{width:390,height:844},hasTouch:true,isMobile:true,deviceScaleFactor:2}:{viewport:{width:1440,height:900}}),reducedMotion:reduced?'reduce':'no-preference'});
  await ctx.grantPermissions(['clipboard-read','clipboard-write']).catch(()=>{});
  const page=await ctx.newPage();
  page.on('pageerror',e=>fault(e.message));
  page.on('console',m=>{if(m.type()==='error')fault(`console: ${m.text().slice(0,300)}`);});
  page.on('response',r=>{if(r.status()>=400&&r.url().startsWith(base))fault(`${r.status()} ${r.url().slice(base.length)}`);});
  // A request cut short on purpose (the film closed, a page left) is not a fault.
  page.on('requestfailed',r=>{if(r.url().startsWith(base)&&!/ERR_ABORTED/.test(r.failure()?.errorText))fault(`${r.failure()?.errorText} ${r.url().slice(base.length)}`);});
  await page.goto(base+query);
  if(language)await page.locator(`.lang-pick button[data-lang=${language}]`).click();
  await page.waitForFunction(()=>window.kalmar?.ready,null,{timeout:180000});
  await page.waitForTimeout(1500);
  return page;
}
async function scenario(name,fn){
  if(ONLY&&!ONLY.includes(name))return;
  step=name;const before=faults.length,t0=Date.now();
  try{await fn();}catch(e){const lines=e.message.split('\n');fault([lines[0],lines.find(l=>/waiting for/.test(l))?.trim()].filter(Boolean).join(' – '));}
  console.log(`${faults.length>before?'✗':'✓'} ${name} (${Math.round((Date.now()-t0)/1000)} s)`);
}
const pause=(page,ms=500)=>page.waitForTimeout(ms);
// Clicks the timeline at a share of its length (0 = 2026, 1 = 2126).
async function at(page,share){const b=await page.locator('.tl-track').boundingBox();await page.mouse.click(b.x+b.width*share,b.y+b.height-8);await pause(page,700);}
async function everyTab(page){for(const tab of await page.locator('#right .tabs button').all()){await tab.click();await pause(page,350);}}
async function menu(page,item){await page.locator('.menu-btn').click();await page.locator('.menu-item',{hasText:item}).click();await pause(page,800);}
const closeAll=page=>page.keyboard.press('Escape').then(()=>pause(page,300));

await scenario('fritt',async()=>{
  const page=await open(`?lang=${L0}`);
  await page.getByText(tx('Fritt läge')).click();await pause(page,1000);
  // A plan: some levers up, then the century at three years with every tab.
  const levers=page.locator('#left .lever');
  for(const [i,lvl] of [[0,2],[3,3],[6,1],[9,2]])await levers.nth(i).locator('.levels button').nth(lvl).click();
  await pause(page,800);
  for(const share of [.08,.6,1]){await at(page,share);await everyTab(page);}
  // The storm figure, a goal, a lever's research, an event on the timeline, a place pin.
  await page.locator('#right .tabs button',{hasText:tx('Siffror')}).click();await pause(page);
  await page.locator('.tile.clickable').click();await pause(page,1500);
  await page.locator('.flood-badge button').click().catch(()=>fault('no hide button on the storm badge'));
  await page.locator('#right .tabs button',{hasText:tx('Mål')}).click();await page.locator('.sdg').nth(12).click();await pause(page);await closeAll(page);
  await levers.nth(1).locator('.info').click();await pause(page);await closeAll(page);
  await page.locator('.tl-event').nth(4).click();await pause(page,800);
  const pin=page.locator('.pin:visible').first();if(await pin.count()){await pin.click();await pause(page,1200);await closeAll(page);}
  // Worlds, events off and on, play for a while.
  for(const w of await page.locator('#left .worlds button').all()){await w.click();await pause(page,600);}
  await page.locator('#left input[type=checkbox]').click();await pause(page);await page.locator('#left input[type=checkbox]').click();
  // Play for a while: the years run and the camera stays where it was put.
  const cam=()=>page.evaluate(()=>kalmar.view.camera.position.toArray().map(Math.round).join(','));
  const cam0=await cam();
  await page.locator('.tl-play .icon-btn').click();await pause(page,6500);await page.locator('.tl-play .icon-btn').click();
  const cam1=await cam();if(cam1!==cam0)fault(`the camera moved on its own while the century played (${cam0} → ${cam1})`);
  // Compare, AR, sound, the day speeds and the map buttons.
  await page.locator('.btn.cmp').click();await pause(page,1500);await page.locator('.btn.cmp').click();
  await page.getByRole('button',{name:'AR',exact:true}).click();await pause(page,2500);await page.getByRole('button',{name:'AR',exact:true}).click();
  await page.locator('.icon-btn.sound').click();await pause(page,2500);await page.locator('.icon-btn.sound').click();
  for(const b of await page.locator('.tl-day .seg button').all())await b.click();
  for(const b of await page.locator('.tl-nav .nav-btn').all()){await b.dispatchEvent('pointerdown');await b.dispatchEvent('pointerup');}
  await pause(page,1200);
  // A postcard of the view, saved as a picture.
  await page.locator('.card-btn').click();await page.locator('.postcard-frame img').waitFor({timeout:20000});
  const [card]=await Promise.all([page.waitForEvent('download'),page.locator('.postcard .btn.primary').click()]);
  if(!new RegExp(`^${citySlug()}-2126-\\d{4}`).test(card.suggestedFilename()))fault(`postcard named ${card.suggestedFilename()}`);await card.delete();
  await page.locator('.postcard .btn',{hasText:tx('Stäng')}).click();
  // The menu: about, sources (with a search), share, start screen, film.
  await menu(page,tx('Om modellen'));await page.locator('.modal .btn',{hasText:tx('Alla källor')}).click();await pause(page);
  await page.locator('.drawer input').fill(tx('vatten'));await pause(page);await closeAll(page);
  await menu(page,tx('Dela din plan'));
  const plan=await page.locator('.modal input').inputValue();await closeAll(page);
  if(HAS_FILM){await menu(page,tx('Se filmen'));await pause(page,2500);await page.locator('.film-close').click();}
  await menu(page,tx('Startmenyn'));await page.locator('.modal').waitFor();await closeAll(page);
  // The streets, every way the place offers (on foot, by bike, by robot taxi; Venice: on foot, by gondola,
  // by water taxi) – those that drive themselves, to an address.
  await page.locator('.ride-btn').click();const ways=await page.locator('.modal .choice').count();await closeAll(page);
  if(ways<2)fault(`only ${ways} way to explore the streets`);
  for(let i=0;i<ways;i++){
    await page.locator('.ride-btn').click();await page.locator('.modal .choice').nth(i).click();await pause(page,2500);
    if(ADDRESS&&await page.locator('.ride-dest input').isVisible()){await page.locator('.ride-dest input').fill(ADDRESS);await page.keyboard.press('Enter');await pause(page,4000);}
    await page.locator('.ride-hud .btn',{hasText:tx('Avsluta')}).click();await pause(page,800);
  }
  await page.context().close();
  // The shared plan – a short link – opens straight away in a fresh visit, also for someone who comes
  // through the language screen first.
  const hash=plan.slice(plan.indexOf('#')),year=plan.match(/-(\d{4})$/)?.[1];
  if(plan.length>90)fault(`the link to the plan is ${plan.length} characters: ${plan}`);
  const shared=await open(`?lang=${L0}${hash}`);await pause(shared,1000);
  if(await shared.locator('.year').textContent()!==year)fault(`the shared plan did not open at ${year}`);
  if(!await shared.locator('.toast',{hasText:tx('Den delade visionen')}).count())fault('no word that the plan is a shared one');
  await everyTab(shared);await shared.context().close();
  const viaLanguage=await open(hash,{language:'en'});await pause(viaLanguage,1000);
  if(await viaLanguage.locator('.year').textContent()!==year)fault('the shared plan is lost on the way through the language screen');
  await viaLanguage.context().close();
});

await scenario('visioner',async()=>{
  const page=await open(`?lang=${L0}`);
  await page.getByText(tx('Utforska en vision')).click();await pause(page,800);
  const n=await page.locator('.modal .choice').count();
  for(let i=0;i<n;i++){
    if(i){await menu(page,tx('Startmenyn'));await page.getByText(tx('Utforska en vision')).click();await pause(page,800);}
    await page.locator('.modal .choice').nth(i).click();await pause(page,4000);
    await at(page,.75);
    // A year chosen on the timeline shows what has changed since 2026.
    await page.waitForFunction(()=>[...document.querySelectorAll('.ar-panel')].some(p=>p.style.display!=='none'),null,{timeout:6000}).catch(()=>fault(`no change markers in vision ${i+1}`));
    await everyTab(page);
  }
  // The printout: built for the year shown, with the picture of the city.
  await page.evaluate(()=>kalmar.app.printPlan({preview:true}));
  const paper=await page.evaluate(()=>{const p=document.getElementById('print');const r={chars:p?.innerText.length||0,img:p?.querySelector('img')?.naturalWidth||0};p?.remove();return r;});
  if(paper.chars<4000||paper.img<1000)fault(`the printout is thin: ${paper.chars} characters, picture ${paper.img} px wide`);
  await page.context().close();
});

await scenario('resan',async()=>{
  const page=await open(`?lang=${L0}`);
  await page.getByText(tx('Resan 2026')).click();await pause(page,800);
  await page.getByText(tx('Till de första vägvalen')).click();await pause(page,800);
  for(const card of await page.locator('.modal .card').all())await card.locator('.option').nth(1).click();
  await page.locator('.modal .card .btn',{hasText:tx('Forskningen säger')}).first().click();
  await page.getByText(new RegExp(tx('Spola fram till'))).click();
  // A decade plays out (11 s, longer while news is read) and the next one opens.
  await page.locator('.modal .decade-head').waitFor({timeout:40000});
  await at(page,.9);
  await page.getByText(tx('Avsluta resan')).click();await pause(page,1200);
  if(!await page.locator('.modal svg path').count())fault('no doughnut in the journey\'s summary');
  // The postcard from 2126 opens over the summary and closes back to it.
  await page.getByText(tx('Vykort från 2126')).click();await page.locator('.postcard-frame img').waitFor({timeout:20000});
  await page.locator('.postcard .btn',{hasText:tx('Stäng')}).click();await pause(page,300);
  if(!await page.locator('.modal .btn',{hasText:tx('Skriv ut')}).count())fault('no print button in the journey\'s summary');
  await page.getByText(EXPLORE_FREELY).click();await pause(page,800);
  await everyTab(page);await page.context().close();
});

await scenario('english',async()=>{
  const page=await open('?lang=en');
  await page.getByText('Free mode').click();await pause(page,800);
  await at(page,.6);await everyTab(page);
  await menu(page,'About the model');await closeAll(page);
  await page.context().close();
});

await scenario('phone',async()=>{
  const page=await open(`?lang=${L0}`,{phone:true});
  await page.getByText(tx('Fritt läge')).tap();await pause(page,1000);
  const b=await page.locator('.tl-track').boundingBox();await page.touchscreen.tap(b.x+b.width*.6,b.y+b.height-8);await pause(page,800);
  await page.locator('.edge-left').tap();await pause(page,600);
  await page.locator('#left .lever').first().locator('.levels button').nth(2).tap();await pause(page,600);
  await page.locator('.edge-right').tap();await pause(page,600);
  for(const tab of await page.locator('#right .tabs button').all()){await tab.tap();await pause(page,300);}
  await page.locator('.menu-btn').tap();await page.locator('.menu-item',{hasText:tx('Om modellen')}).tap();await pause(page,600);await closeAll(page);
  // The postcard from the menu, in the phone's tall format.
  await page.locator('.menu-btn').tap();await page.locator('.menu-item',{hasText:tx('Spara ett vykort')}).tap();
  await page.locator('.postcard-frame img').waitFor({timeout:30000});
  const size=await page.locator('.postcard-frame img').evaluate(i=>[i.naturalWidth,i.naturalHeight]);
  if(size[0]!==1080||size[1]!==1350)fault(`phone postcard is ${size.join('×')}`);
  await page.locator('.postcard .btn',{hasText:tx('Stäng')}).tap();
  await page.context().close();
});

await scenario('tangentbord',async()=>{
  const page=await open(`?lang=${L0}`,{reduced:true});
  const focus=()=>page.evaluate(()=>{const a=document.activeElement;return {tag:a?.tagName,text:(a?.innerText||a?.getAttribute('aria-label')||'').slice(0,40),dialog:Boolean(a?.closest('[role=dialog][aria-modal=true][aria-labelledby]')),menuBtn:a?.classList.contains('menu-btn')};});
  if(!(await focus()).dialog)fault('the start screen does not take the focus');
  for(let i=0;i<24;i++){const f=await focus();if(!f.dialog){fault('Tab leaves the start screen');break;}if(f.text.includes(tx('Fritt läge')))break;await page.keyboard.press('Tab');}
  await page.keyboard.press('Enter');await pause(page,1200);
  if(await page.locator('.overlay').count())fault('Enter on “Fritt läge” does not start it');
  // The timeline as a slider, and what a screen reader hears.
  await page.locator('.tl-thumb[role=slider]').focus();
  await page.keyboard.press('End');await page.keyboard.press('PageDown');await page.keyboard.press('ArrowLeft');await pause(page,1500);
  const now=await page.locator('[role=slider]').getAttribute('aria-valuenow'),said=await page.locator('[role=status][aria-live]').first().textContent();
  if(now!=='2115')fault(`the slider is at ${now}, not 2115`);
  if(!/^2115/.test(said||''))fault(`the live region says “${said}”`);
  // Tabs with the arrow keys.
  await page.locator('#right [role=tab][aria-selected=true]').focus();await page.keyboard.press('ArrowRight');await pause(page,300);
  if(await page.evaluate(()=>document.activeElement.getAttribute('aria-selected'))!=='true')fault('→ does not choose the next tab');
  // The menu and a dialog from it: Escape closes each and the focus goes back to the menu button.
  await page.locator('.menu-btn').focus();await page.keyboard.press('Enter');await pause(page,200);
  await page.keyboard.press('Escape');await pause(page,200);
  if(!(await focus()).menuBtn)fault('Escape in the menu does not return to the menu button');
  await page.locator('.menu-btn').click();await page.locator('.menu-item',{hasText:tx('Om modellen')}).click();await pause(page,500);
  if(!(await focus()).dialog)fault('“Om modellen” does not take the focus');
  await page.keyboard.press('Escape');await pause(page,400);
  if(!(await focus()).menuBtn)fault('closing “Om modellen” does not return to the menu button');
  // Every visible button has a name.
  const unnamed=await page.evaluate(()=>[...document.querySelectorAll('button')].filter(b=>b.offsetParent!==null&&!(b.getAttribute('aria-label')||b.innerText.trim())).map(b=>b.className));
  if(unnamed.length)fault(`buttons without a name: ${unnamed.join(', ')}`);
  await page.context().close();
});

await browser.close();await server?.httpServer?.close();
if(faults.length){console.log(`\n${faults.length} fel:`);for(const f of [...new Set(faults)])console.log('  ✗',f);process.exit(1);}
console.log('\nInga fel.');
