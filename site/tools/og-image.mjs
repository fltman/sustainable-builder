// The link preview (Open Graph / Twitter card): public/og.jpg, 1200×630, a frame of the film's
// golden-hour city with the splash screen's title.   node tools/og-image.mjs [frame.jpg]
// Without an argument the frame is taken from art/kalmar-2126-film.mp4 at 70.65 s (the poster frame).
import { chromium } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { readFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

let frame=process.argv[2];
if(!frame){frame=join(mkdtempSync(join(tmpdir(),'og-')),'frame.jpg');
  execFileSync('ffmpeg',['-y','-loglevel','error','-ss','70.65','-i','art/kalmar-2126-film.mp4','-frames:v','1','-q:v','2',frame]);}
const bg='data:image/jpeg;base64,'+readFileSync(frame).toString('base64');
const html=`<!doctype html><meta charset="utf-8"><style>
html,body{margin:0;width:1200px;height:630px;overflow:hidden;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
.bg{position:absolute;inset:0;background:url(${bg}) center 62%/cover}
.shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(8,22,36,.7) 0%,rgba(8,22,36,.36) 32%,rgba(8,22,36,0) 50%)}
.t{position:absolute;left:64px;top:52px;color:#fff;text-shadow:0 2px 18px rgba(0,0,0,.4)}
h1{margin:0;font-size:76px;letter-spacing:.14em;font-weight:800;line-height:1}
p{margin:14px 0 0;font-size:30px;color:rgba(255,255,255,.92)}
p+p{margin-top:6px;font-size:24px;color:rgba(255,255,255,.7)}
</style><div class="bg"></div><div class="shade"></div>
<div class="t"><h1>KALMAR 2126</h1><p>Ett sekel framåt – en hållbar vision</p><p>A century ahead – a sustainable vision</p></div>`;
const browser=await chromium.launch({executablePath:process.env.CHROME||`${process.env.HOME}/Library/Caches/ms-playwright/chromium-1243/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`}),page=await browser.newPage({viewport:{width:1200,height:630}});
await page.setContent(html);await page.waitForLoadState('load');
await page.screenshot({path:'public/og.jpg',type:'jpeg',quality:86});
await browser.close();
console.log('public/og.jpg');
