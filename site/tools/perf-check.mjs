import { chromium } from '@playwright/test';
const browser=await chromium.launch({executablePath:`${process.env.HOME}/Library/Caches/ms-playwright/chromium-1243/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`,headless:true,args:['--use-angle=metal','--enable-gpu','--ignore-gpu-blocklist']});
const page=await browser.newPage({viewport:{width:1600,height:900}});
page.on('pageerror',e=>console.log('[pageerror]',e.message));
await page.goto('http://localhost:'+(process.env.PORT||5230)+'/?preset=sundstaden&lang=sv'+(process.env.Q||''));
await page.waitForFunction(()=>window.kalmar?.ready,null,{timeout:120000});
// Measure frame times while the century plays.
const r=await page.evaluate(async()=>{const times=[];let last=performance.now();await new Promise(res=>{const t0=last;function f(now){times.push(now-last);last=now;if(now-t0<20000)requestAnimationFrame(f);else res();}requestAnimationFrame(f);});
  times.sort((a,b)=>a-b);return {frames:times.length,median:times[times.length>>1].toFixed(1),p95:times[Math.floor(times.length*.95)].toFixed(1),max:times[times.length-1].toFixed(1),year:kalmar.app.S.year.toFixed(1)};});
console.log('playing century',JSON.stringify(r));
await browser.close();
