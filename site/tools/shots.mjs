// Headless screenshots for review: node tools/shots.mjs [url-query] [out.png] [waitSeconds]
import { chromium } from '@playwright/test';
const query=process.argv[2]||'',out=process.argv[3]||'test-results/shot.png',wait=+(process.argv[4]||12);
const browser=await chromium.launch({executablePath:process.env.CHROME||`${process.env.HOME}/Library/Caches/ms-playwright/chromium-1243/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`,headless:!process.env.HEADED,args:['--use-angle=metal','--enable-gpu','--ignore-gpu-blocklist','--enable-unsafe-swiftshader']});
const [vw,vh]=(process.env.VIEWPORT||'1600x900').split('x').map(Number);
const page=await browser.newPage({viewport:{width:vw,height:vh},hasTouch:Boolean(process.env.TOUCH),isMobile:Boolean(process.env.TOUCH),deviceScaleFactor:process.env.TOUCH?2:1});
page.on('console',m=>{if(['error','warning'].includes(m.type()))console.log('[console]',m.type(),m.text().slice(0,400));});
page.on('pageerror',e=>console.log('[pageerror]',e.message));
// A language in the address skips the first screen (src/boot.js); SPLASH=1 photographs that screen.
const [path,hash='']=query.split('#');
const url=(process.env.SPLASH||/[?&]lang=/.test(path))?query:`${path.includes('?')?path+'&':path+'?'}lang=sv${hash?'#'+hash:''}`;
await page.goto(`http://localhost:${process.env.PORT||5230}/${url}`);
if(process.env.SPLASH){await page.waitForTimeout(wait*1000);await page.screenshot({path:out});await browser.close();process.exit(0);}
await page.waitForFunction(()=>window.kalmar?.ready,null,{timeout:120000});
await page.waitForTimeout(wait*1000);
const info=await page.evaluate(()=>({fps:kalmar.fps,city:kalmar.city.stats(),calls:kalmar.renderer.info.render.calls,tris:kalmar.renderer.info.render.triangles,batches:kalmar.batches.stats(),gl:(()=>{const g=kalmar.renderer.getContext();const e=g.getExtension('WEBGL_debug_renderer_info');return e?g.getParameter(e.UNMASKED_RENDERER_WEBGL):'?';})()}));
console.log(JSON.stringify(info));
if(process.env.EVAL){console.log(JSON.stringify(await page.evaluate(process.env.EVAL)));await page.waitForTimeout(+(process.env.AFTER||1500));}
await page.screenshot({path:out});
await browser.close();
