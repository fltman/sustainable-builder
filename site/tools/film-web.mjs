// Web copy of a place's film for the site: a streamable mp4, a poster and Swedish/English subtitles, in the
// place's pack (film/<slug>-2126.mp4, film/poster.jpg, film/<slug>-2126.sv.vtt …).
//   CITY=<slug> node tools/film-web.mjs [master.mp4]   (master from tools/film.mjs; SUBS_ONLY=1 rewrites only the subtitles)
// FILM_LANG=en: the English film (<slug>-2126-en.mp4) with English subtitles timed on the English narration.
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { execFileSync, spawnSync } from 'node:child_process';
import { cityOf } from '../city.config.mjs';
const place=cityOf();
const { SCENES, LINES, END_CARD }=await import(`${place.vision}/film.js`);
const LANG=process.env.FILM_LANG==='en'?'en':'sv',sfx=LANG==='en'?'-en':'';
const name=`${place.slug}-2126${sfx}`,master=process.argv[2]||`test-results/${name}.mp4`,out=`${place.pack}/film`;
mkdirSync(out,{recursive:true});
const ff=args=>execFileSync('ffmpeg',['-y','-loglevel','error',...args]);
const probe=f=>+execFileSync('ffprobe',['-v','error','-show_entries','format=duration','-of','csv=p=0',f]).toString();

if(!process.env.SUBS_ONLY){
// Video: 1080p H.264 capped at 5 Mbit/s (the film grain would otherwise eat the bitrate), audio AAC.
ff(['-i',master,'-c:v','libx264','-preset','slow','-crf','23','-maxrate','5M','-bufsize','10M','-pix_fmt','yuv420p','-profile:v','high',
  '-c:a','aac','-b:a','160k','-movflags','+faststart',`${out}/${name}.mp4`]);
// Poster: the place of 2126, just before the end title fades up (END_CARD.poster, else 4 s before the end card).
const posterAt=END_CARD.poster??SCENES.slice(0,-1).reduce((s,sc)=>s+sc.d,0)-4;
if(LANG==='sv')ff(['-ss',String(posterAt),'-i',master,'-frames:v','1','-vf','scale=1280:-1','-q:v','4',`${out}/poster.jpg`]);
}

// Subtitles: each spoken line is split into sentences, and the sentence breaks are put in pauses
// of the voice clip (ffmpeg silencedetect).
const pauses=f=>{
  const log=spawnSync('ffmpeg',['-i',f,'-af','silencedetect=n=-38dB:d=0.18','-f','null','-'],{encoding:'utf8'}).stderr;
  const starts=[...log.matchAll(/silence_start: ([\d.]+)/g)].map(m=>+m[1]),ends=[...log.matchAll(/silence_end: ([\d.]+)/g)].map(m=>+m[1]);
  return starts.map((s,i)=>({s,e:ends[i]??s,len:(ends[i]??s)-s}));
};
const sentences=txt=>txt.match(/[^.?!]+[.?!]+/g).map(x=>x.trim());
const stamp=s=>{const h=Math.floor(s/3600),m=Math.floor(s/60)%60,sec=(s%60).toFixed(3).padStart(6,'0');return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${sec}`;};
// The Swedish film carries Swedish and English subtitles; the English film English ones.
const SUBS=LANG==='en'?['en']:['sv','en'],cues={sv:[],en:[]};
let t0=0;
for(const sc of SCENES){
  if(sc.vo){
    const [clip,at]=sc.vo,f=[`${place.pack}/audio/${clip}${sfx}.mp3`,`public/audio/${clip}${sfx}.mp3`].find(existsSync);
    if(!f){t0+=sc.d;continue;}
    const dur=probe(f),start=t0+at;
    const ps=pauses(f).filter(p=>p.s>0.3&&p.e<dur-0.3);
    // Speech bounds: skip leading and trailing silence.
    const all=pauses(f),lead=all[0]&&all[0].s<0.05?all[0].e:0,tail=all.at(-1)&&all.at(-1).e>dur-0.05?all.at(-1).s:dur;
    for(const lang of SUBS){
      const parts=sentences(LINES[clip][lang]);
      // Each break goes in the pause nearest where the spoken text says the sentence ends (by character
      // count); the other language's subtitles share the timing.
      const said=sentences(LINES[clip][LANG]),total=said.join(' ').length;let acc=0;const breaks=[];
      for(let i=0;i<said.length-1;i++){acc+=said[i].length+1;const want=lead+(tail-lead)*acc/total;
        const free=ps.filter(p=>!breaks.includes(p)&&(!breaks.length||p.s>breaks.at(-1).e));
        breaks.push(free.reduce((b,p)=>Math.abs((p.s+p.e)/2-want)-p.len<Math.abs((b.s+b.e)/2-want)-b.len?p:b,free[0]));}
      let from=lead;
      parts.forEach((p,i)=>{const to=i<breaks.length?breaks[i].s:tail,next=i<breaks.length?breaks[i].e:to;
        cues[lang].push([start+from,start+(i<breaks.length?Math.min(to+.25,next-.04):to+.25),p]);from=next;});
    }
  }
  t0+=sc.d;
}
// Cues sit above the film's own captions (bottom left) and brand (bottom right).
const CUE='line:-5 size:70%';
for(const lang of SUBS){
  const vtt='WEBVTT\n\n'+cues[lang].map(([a,b,txt],i)=>`${i+1}\n${stamp(a)} --> ${stamp(b)} ${CUE}\n${txt}\n`).join('\n');
  writeFileSync(`${out}/${name}.${lang}.vtt`,vtt);
}
console.log('web film',LANG,(probe(`${out}/${name}.mp4`)).toFixed(1)+' s',cues[LANG].length,'cues');
