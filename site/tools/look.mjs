// Looks at the running site the way a visitor would, for the agent building a place: opens it, notes
// every error, and saves pictures of the city in a few years and plans.
//   node tools/look.mjs [--url http://127.0.0.1:5230/] [--out ../cities/<slug>/renders/site] [--years 2026,2076,2126]
//   node tools/look.mjs --shots shots.json   – named views: [{name, preset, year, hour, cam:[x,y,z], target:[x,y,z]}]
//                                              (camera positions for a film are checked this way)
// The site must be running (python3 sustainable.py site <slug>, or npm run dev).
import { chromium } from '@playwright/test';
import { mkdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { citySlug, ROOT } from '../city.config.mjs';

const arg=(k,d)=>{const i=process.argv.indexOf(`--${k}`);return i>0?process.argv[i+1]:d;};
const url=arg('url','http://127.0.0.1:5230/');
const out=resolve(arg('out',`${ROOT}/cities/${citySlug()}/renders/site`));
const years=arg('years','2026,2076,2126').split(',').map(Number);
const plans=arg('plans','dagens,vision').split(',');
mkdirSync(out,{recursive:true});

const chrome=process.env.CHROME||`${process.env.HOME}/Library/Caches/ms-playwright/chromium-1243/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`;
const browser=await chromium.launch({executablePath:chrome,args:['--use-angle=metal','--enable-gpu','--ignore-gpu-blocklist']}).catch(()=>chromium.launch());
const page=await browser.newPage({viewport:{width:1440,height:900}});
const errors=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
// A shared link opens the site straight into the city (no start screen).
await page.goto(`${url}?lang=sv&hour=13#dagens-2026`);
await page.waitForFunction(()=>window.kalmar?.ready,null,{timeout:180000});
await page.waitForTimeout(2500);
// A shared link starts the century playing: stop it, and the day at midday.
await page.evaluate(()=>{window.kalmar.app.pause?.();window.kalmar.app.S.speed=0;window.kalmar.world.hour=13;});
const shots=[];
const views=arg('shots')?JSON.parse(readFileSync(arg('shots'),'utf8')):null;
// The link's opening flight moves the camera for a few seconds: let it land before the first view.
if(views)await page.waitForTimeout(5000);
const place=v=>{const K=window.kalmar;K.view.controls.target.set(...v.target);K.view.camera.position.set(...v.cam);K.view.camera.lookAt(K.view.controls.target);K.view.controls.update();};
if(views)for(const v of views){
  await page.evaluate(v=>{const K=window.kalmar,p=(K.presets||[]).find(x=>x.id===(v.preset==='vision'?(K.presets[1]||K.presets[0]).id:v.preset));if(p)K.app.loadPreset(p);K.app.pause?.();K.app.setYear(v.year??2126);K.world.hour=v.hour??14;
    for(const n of document.querySelectorAll('.toast,.news'))n.remove();},v);
  await page.evaluate(place,v);
  await page.evaluate(async([x,z])=>{await window.kalmar.city.ensure({x,z},420,180);},[v.target[0],v.target[2]]);
  await page.waitForTimeout(1500);await page.evaluate(place,v);   // (a preset may start a flight of its own)
  await page.waitForTimeout(2500);
  const file=`${out}/${v.name}.jpg`;await page.screenshot({path:file,type:'jpeg',quality:82});shots.push(file);
}
if(!views)for(const plan of plans){
  const id=await page.evaluate(p=>{const P=window.kalmar.presets||[];return p==='vision'?(P[1]||P[0])?.id:p;},plan);
  for(const y of years){
    await page.evaluate(([id,y])=>{const {app}=window.kalmar;const p=(window.kalmar.presets||[]).find(x=>x.id===id);if(p)app.loadPreset(p);app.pause?.();app.setYear(y);},[id,y]);
    await page.evaluate(()=>{for(const n of document.querySelectorAll('.toast,.news'))n.remove();});
    await page.waitForTimeout(3500);
    const file=`${out}/${id}-${y}.jpg`;await page.screenshot({path:file,type:'jpeg',quality:82});shots.push(file);
  }
}
const info=await page.evaluate(()=>({fps:window.kalmar.fps,tiles:window.kalmar.city?.tiles?.length,title:document.title}));
await browser.close();
console.log(`${info.title}: ${shots.length} pictures in ${out} (tiles ${info.tiles}, ${Math.round(info.fps||0)} fps)`);
if(errors.length){console.log(`\n${errors.length} errors:\n  ${[...new Set(errors)].slice(0,20).join('\n  ')}`);process.exitCode=1;}
