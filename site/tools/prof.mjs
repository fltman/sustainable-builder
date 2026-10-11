import { chromium } from '@playwright/test';
const browser=await chromium.launch({executablePath:`${process.env.HOME}/Library/Caches/ms-playwright/chromium-1243/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`,headless:true,args:['--use-angle=metal','--enable-gpu','--ignore-gpu-blocklist']});
const page=await browser.newPage({viewport:{width:1600,height:900}});
page.on('pageerror',e=>console.log('[pageerror]',e.message));
await page.goto('http://localhost:5230/?preset=sundstaden&lang=sv&prof'+(process.argv[2]||''));
await page.waitForFunction(()=>window.kalmar?.ready,null,{timeout:120000});
await page.waitForTimeout(12000);
console.log(JSON.stringify(await page.evaluate(()=>({fps:kalmar.fps.toFixed(1),...Object.fromEntries(Object.entries(kalmar.prof).map(([k,v])=>[k,v.toFixed(2)])),calls:kalmar.renderer.info.render.calls,tris:kalmar.renderer.info.render.triangles}))));
await browser.close();
