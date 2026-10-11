// Clicks through the journey: start → two decades of choices → events → finish report.
import { chromium } from '@playwright/test';
const browser=await chromium.launch({executablePath:process.env.CHROME||`${process.env.HOME}/Library/Caches/ms-playwright/chromium-1243/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`,headless:!process.env.HEADED,args:['--use-angle=metal','--enable-gpu','--ignore-gpu-blocklist']});
const page=await browser.newPage({viewport:{width:1600,height:900}});
page.on('pageerror',e=>console.log('[pageerror]',e.message));
page.on('console',m=>{if(m.type()==='error'&&!/404/.test(m.text()))console.log('[console]',m.text().slice(0,300));});
await page.goto('http://localhost:5230/?lang=sv');
await page.waitForFunction(()=>window.kalmar?.ready,null,{timeout:120000});
await page.waitForTimeout(1500);
await page.screenshot({path:'test-results/j0-start.png'});
await page.click('text=Resan 2026 → 2126');
await page.waitForTimeout(800);
await page.screenshot({path:'test-results/j1-intro.png'});
await page.click('text=Till de första vägvalen');
await page.waitForTimeout(800);
await page.screenshot({path:'test-results/j2-decade.png'});
for(let d=0;d<2;d++){
  const cards=await page.$$('.card');
  for(const c of cards){const opts=await c.$$('.option');await opts[1]?.click();}
  await page.click('text=/Spola fram till/');
  const t0=Date.now();let fpsMin=999;
  while(Date.now()-t0<14000){await page.waitForTimeout(1000);const f=await page.evaluate(()=>kalmar.fps);fpsMin=Math.min(fpsMin,f);if(await page.$('.toast')){await page.screenshot({path:`test-results/j3-toast-${d}.png`});}}
  console.log('decade',d,'min fps',fpsMin.toFixed(1),'year',await page.evaluate(()=>kalmar.app.S.year.toFixed(1)));
  await page.waitForTimeout(6000);
  await page.screenshot({path:`test-results/j4-decade-${d+1}.png`});
}
await page.click('text=Avsluta resan');
await page.waitForTimeout(1500);
await page.screenshot({path:'test-results/j5-final.png',fullPage:false});
console.log(await page.evaluate(()=>({year:kalmar.app.S.year,schedule:kalmar.app.S.schedule})));
await browser.close();
