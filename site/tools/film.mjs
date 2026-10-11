// Records a short film of a place's vision: frame-stepped rendering (?film), JPEG frames, ffmpeg → mp4.
// The film itself – scenes, end card, narration – is the place's (@city/film.js, cities/<slug>/vision/film.js).
//   CITY=<slug> node tools/film.mjs [out.mp4]   (python3 sustainable.py film <slug> runs the whole chain)
// The film server must run: CITY=<slug> npx vite --config vite.film.config.js (port 5231, FILM_PORT).
// FROM_SCENE=n re-renders scene n onwards, SCENES_ONLY=2,3,4 just those scenes; MIX_ONLY=1 only remixes.
// Earlier frames are kept in test-results/frames-<slug>. FILM_LANG=en (or it) makes the English (Italian) film:
// captions, AR, end card and narration (<clip>-en.mp3), out test-results/<slug>-2126-en.mp4.
import { chromium } from '@playwright/test';
import { mkdirSync, rmSync, existsSync, readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { cityOf } from '../city.config.mjs';
const place=cityOf();
const { SCENES, END_CARD, MUSIC }=await import(`${place.vision}/film.js`);
const { CITY }=await import(`${place.vision}/config.js`);
// Audio: the place's narration and soundtrack (its pack) before the engine's.
const audio=name=>[`${place.pack}/audio/${name}.mp3`,`public/audio/${name}.mp3`].find(existsSync);
const LANG=['en','it'].includes(process.env.FILM_LANG)?process.env.FILM_LANG:'sv',sfx=LANG==='sv'?'':`-${LANG}`;
const out=process.argv[2]||`test-results/${place.slug}-2126${sfx}.mp4`,dir=`test-results/frames-${place.slug}${sfx}`,FPS=30,MIX_ONLY=process.env.MIX_ONLY,FROM=+(process.env.FROM_SCENE||0),ONLY=process.env.SCENES_ONLY?.split(',').map(Number);
// Where in the soundtrack the film starts: the place's own (film.js MUSIC.start, chosen so its breakdown
// lands where the end card's picture has gone black), else two bars in (120 BPM), right for the engine's.
const MUSIC_START=MUSIC?.start??4;
if(!MIX_ONLY){
mkdirSync(dir,{recursive:true});
const wanted=i=>ONLY?ONLY.includes(i):i>=FROM;
const offset=SCENES.map((_,i)=>SCENES.slice(0,i).reduce((n,sc)=>n+Math.round(sc.d*FPS),0));
const sceneOf=f=>offset.findLastIndex(o=>f>=o);
for(const f of readdirSync(dir))if(wanted(sceneOf(parseInt(f))))rmSync(`${dir}/${f}`);
const browser=await chromium.launch({executablePath:`${process.env.HOME}/Library/Caches/ms-playwright/chromium-1243/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`,headless:true,args:['--use-angle=metal','--enable-gpu','--ignore-gpu-blocklist']});
const page=await browser.newPage({viewport:{width:1920,height:1080}});
page.on('pageerror',e=>console.log('[pageerror]',e.message));
// The film's language, whatever the browser's.
await page.goto(`http://localhost:${process.env.FILM_PORT||5231}/?film&preset=dagens&lang=${LANG}`);
await page.waitForFunction(()=>window.kalmar?.ready&&window.kalmarStep,null,{timeout:180000});

await page.evaluate(card=>{
  const c=document.createElement('div');c.className='film-caption';c.innerHTML='<div class="y"></div><div class="t"></div><div class="s"></div>';document.body.append(c);
  const b=document.createElement('div');b.className='film-brand';b.textContent=card.title;document.body.append(b);
  const end=document.createElement('div');end.className='film-end';
  end.innerHTML=`<div class="film-end-title">${card.title}</div><div class="film-end-sub">${card.sub}</div><div class="film-end-q">${card.q}</div><div class="film-end-small">${card.small}</div>`;
  document.body.append(end);
  const black=document.createElement('div');black.className='film-black';black.style.cssText='position:fixed;inset:0;z-index:84;background:#000;opacity:0;pointer-events:none';document.body.append(black);
},{...END_CARD[LANG],title:CITY.title});
let frame=0,preset=null;
const ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
for(const [si,sc] of SCENES.entries()){
  if(!wanted(si))continue;
  frame=offset[si];
  if(sc.preset!==preset){
    preset=sc.preset;
    await page.evaluate(p=>{kalmar.app.loadPreset(kalmar.presets.find(x=>x.id===p));kalmar.app.pause();},preset);
  }
  // Load the city where the scene happens before recording it.
  const tgt=sc.orbit?sc.orbit.c:sc.target[0];
  await page.evaluate(async([x,z])=>{await kalmar.city.ensure({x,z},420,180);},[tgt[0],tgt[2]]);
  const n=Math.round(sc.d*FPS);
  for(let i=0;i<n;i++){
    const t=i/(n-1),e=ease(t);
    await page.evaluate(({sc,t,e,warm})=>{
      const lerp=(a,b)=>a.map((v,k)=>v+(b[k]-v)*e);
      const year=sc.year[0]+(sc.year[1]-sc.year[0])*t;
      kalmar.app.setYear(year);kalmar.world.hour=sc.hour;
      const v=kalmar.view;
      if(sc.orbit){const a=sc.orbit.a[0]+(sc.orbit.a[1]-sc.orbit.a[0])*e,c=sc.orbit.c;v.controls.target.set(...c);v.camera.position.set(c[0]+Math.cos(a)*sc.orbit.r,sc.orbit.h,c[2]+Math.sin(a)*sc.orbit.r);}
      else{v.controls.target.set(...lerp(sc.target[0],sc.target[1]));v.camera.position.set(...lerp(sc.cam[0],sc.cam[1]));}
      v.camera.lookAt(v.controls.target);
      if(sc.compare){kalmar.engine.setCompare(true);document.querySelector('.compare').style.display='block';}else kalmar.engine.setCompare(false);
      const cap=document.querySelector('.film-caption');cap.querySelector('.y').textContent=sc.y==='year'?String(Math.floor(year)):sc.y;cap.querySelector('.t').textContent=sc.cap.t;cap.querySelector('.s').textContent=sc.cap.s;
      cap.style.opacity=String(Math.min(1,t*6,(1-t)*6));
      const end=document.querySelector('.film-end'),brand=document.querySelector('.film-brand'),black=document.querySelector('.film-black');
      const st=t*sc.d,ramp=r=>r?Math.min(1,Math.max(0,(st-r[0])/(r[1]-r[0]))):0,ec=sc.endCard;
      const k=ec?ramp(ec.title)*(1-ramp(ec.out)):0,dark=ec?ramp(ec.black):0;
      end.style.opacity=String(k);brand.style.opacity=String(ec?0:1);black.style.opacity=String(dark);
      end.querySelector('.film-end-q').style.opacity=String(ec?ramp(ec.q):0);
      if(sc.compare)kalmar.engine.setSplit(sc.compare[0]+(sc.compare[1]-sc.compare[0])*e);
      if(warm&&sc.seaTime)kalmar.sea.setTime(sc.seaTime);
      // AR callouts on film time.
      window.__filmClock=(window.__filmClock||0)+(warm?0:1/30);
      const want=(sc.ar||[]).filter(a=>st>=a[1]).map(([id,,at])=>{const sp=kalmar.AR_SPOTS.find(x=>x.id===id);return kalmar.arSpec(at?{...sp,id:id+':'+sc.t,at:{x:at[0],y:at[1],z:at[2]}}:{...sp,id:id+':'+sc.t},kalmar.app.S.run,year);});
      kalmar.app.callouts.show(t>.93?[]:want,window.__filmClock);
      // A few silent frames let streaming, easing and shadows settle at a scene start.
      // Behind full black there is nothing to render.
      if(dark<1)for(let k=0;k<(warm?20:1);k++)window.kalmarStep(1/30);
      kalmar.app.callouts.update(window.__filmClock,{left:40,right:innerWidth-40,top:40,bottom:innerHeight-60});
    },{sc:{...sc,cap:LANG!=='sv'&&sc[LANG]?sc[LANG]:{t:sc.t,s:sc.s}},t,e,warm:i===0});
    await page.screenshot({path:`${dir}/${String(frame++).padStart(5,'0')}.jpg`,type:'jpeg',quality:90});
  }
  console.log('scene done',sc.t,frame);
}
await browser.close();
}

// Sound: ambience beds per scene (crossfaded by volume envelopes) and the narration on top.
const LEVEL={birds:-30.6,sea:-28.4,market:-28.8,night:-18.6,traffic:-21.4,wind:-29.4};
const total=SCENES.reduce((s,sc)=>s+sc.d,0);
// When the end card's picture goes black, the city's sound goes with it; the music plays on.
const endAt=SCENES.slice(0,-1).reduce((s,sc)=>s+sc.d,0),ec=SCENES.at(-1).endCard;
const bedOut=ec?endAt+ec.black[0]:total-1.5,bedLen=ec?ec.black[1]-ec.black[0]+.5:1.5;
const beds=Object.keys(LEVEL);const inputs=[],filters=[];
beds.forEach((b,i)=>{
  inputs.push('-stream_loop','-1','-i',audio(`amb-${b}`));
  // Piecewise volume per scene with 0.8 s ramps.
  let t=0;const parts=[];
  for(const sc of SCENES){const v=(sc.amb?.[b]||0)*Math.pow(10,(-24-LEVEL[b])/20);parts.push([t,t+sc.d,v]);t+=sc.d;}
  const expr=parts.map(([a,b2,v])=>`${v.toFixed(3)}*between(t,${a.toFixed(2)},${b2.toFixed(2)})`).join('+');
  filters.push(`[${i+1}:a]atrim=0:${total.toFixed(2)},aresample=48000,volume='${expr}':eval=frame,lowpass=f=12000,afade=t=in:d=1.2,afade=t=out:st=${bedOut.toFixed(2)}:d=${bedLen.toFixed(2)}[b${i}]`);
});
let t=0,k=beds.length+1;const vo=[];
// A scene whose narration has not been voiced yet plays without it.
for(const sc of SCENES){if(sc.vo&&audio(`${sc.vo[0]}${sfx}`)){inputs.push('-i',audio(`${sc.vo[0]}${sfx}`));const ms=Math.round((t+sc.vo[1])*1000);filters.push(`[${k}:a]aresample=48000,adelay=${ms}|${ms},volume=1.0[v${vo.length}]`);vo.push(`[v${vo.length}]`);k++;}t+=sc.d;}
// The soundtrack under everything: the place's own (its pack's audio/music.mp3, from Suno) or the engine's.
let music=0;
if(audio('music')){inputs.push('-i',audio('music'));filters.push(`[${k}:a]atrim=${MUSIC_START}:${(MUSIC_START+total).toFixed(2)},asetpts=PTS-STARTPTS,aresample=48000,volume='0.38+0.2*clip((t-${endAt.toFixed(2)})/2.5,0,1)':eval=frame,afade=t=in:d=0.8,afade=t=out:st=${(total-4.5).toFixed(2)}:d=4.5[mu]`);k++;music=1;}
filters.push(`${beds.map((_,i)=>`[b${i}]`).join('')}${music?'[mu]':''}amix=inputs=${beds.length+music}:normalize=0,volume=0.55[bed]`);
// Pad the voice to the full length: the sidechain would otherwise end the whole mix with the last line.
if(!vo.length){inputs.push('-f','lavfi','-t','1','-i','anullsrc=r=48000:cl=stereo');vo.push(`[${k}:a]`);k++;}
filters.push(`${vo.join('')}amix=inputs=${vo.length}:normalize=0,apad=whole_dur=${total.toFixed(2)}[voice]`);
// Duck the beds under the voice.
filters.push(`[voice]asplit=2[vk][vm]`,`[bed][vk]sidechaincompress=threshold=0.04:ratio=6:attack=20:release=600[ducked]`,`[ducked][vm]amix=inputs=2:normalize=0,alimiter=limit=0.95[mix]`);
execFileSync('ffmpeg',['-y','-loglevel','error','-framerate',String(FPS),'-i',`${dir}/%05d.jpg`,...inputs,'-filter_complex',filters.join(';'),'-map','0:v','-map','[mix]',
  '-c:v','libx264','-pix_fmt','yuv420p','-crf','20','-preset','slow','-c:a','aac','-b:a','192k','-t',total.toFixed(2),'-movflags','+faststart',out]);
console.log('wrote',out,total.toFixed(1)+' s');
