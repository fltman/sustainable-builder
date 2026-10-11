// The soundscape: looping ElevenLabs ambiences (public/audio, tools/generate-audio.py) mixed by what
// the camera sees – the sea and the wind from above, the street up close; traffic that thins as the
// streets are depaved and loses its rumble as the cars go electric, birdsong that grows with the green, voices on the squares at meal times,
// crickets on summer nights – plus bicycle bells, gulls, the cathedral bell on the hour, and
// narration. Loops are normalised by their measured loudness (mean dB) so the mix stays even.
const LOOPS={birds:-30.6,sea:-28.4,market:-28.8,night:-18.6,traffic:-21.4,wind:-29.4};
const SHOTS=['bell','bikebell','gulls','decade','event'];
export function createAudio(){
  let ctx=null,master=null,ambBus=null,voBus=null,musicBus=null,on=false,loaded=null,lastHour=null,voice=null;
  const buffers={},gains={};
  // The place's own voices and soundtrack come from its pack (city/audio), the rest – and a soundtrack
  // when the place has none – from the engine's (audio/).
  async function load(name){
    let r=/^(vo-|music)/.test(name)?await fetch(`city/audio/${name}.mp3`).catch(()=>null):null;
    if(!r?.ok)r=await fetch(`audio/${name}.mp3`);
    if(!r.ok)throw new Error(name);return ctx.decodeAudioData(await r.arrayBuffer());
  }
  async function init(){
    ctx=new (window.AudioContext||window.webkitAudioContext)();
    master=ctx.createGain();master.gain.value=0;master.connect(ctx.destination);
    ambBus=ctx.createGain();ambBus.connect(master);voBus=ctx.createGain();voBus.connect(master);
    musicBus=ctx.createGain();musicBus.gain.value=.32;musicBus.connect(master);
    // Rain is synthesised – white noise between 500 Hz and 5 kHz – so a storm needs no recording.
    {const noise=ctx.createBuffer(1,ctx.sampleRate*2,ctx.sampleRate),ch=noise.getChannelData(0);for(let i=0;i<ch.length;i++)ch[i]=Math.random()*2-1;
      const src=ctx.createBufferSource();src.buffer=noise;src.loop=true;
      const hp=ctx.createBiquadFilter();hp.type='highpass';hp.frequency.value=500;const lp=ctx.createBiquadFilter();lp.type='lowpass';lp.frequency.value=5000;
      const g=ctx.createGain();g.gain.value=0;src.connect(hp);hp.connect(lp);lp.connect(g);g.connect(ambBus);src.start();gains.rain=g;}
    // Optional soundtrack (public/audio/music.mp3, from Suno): plays quietly under the city if present.
    load('music').then(b=>{const src=ctx.createBufferSource();src.buffer=b;src.loop=true;src.connect(musicBus);src.start();}).catch(()=>{});
    loaded=Promise.all([
      ...Object.keys(LOOPS).map(async k=>{buffers[k]=await load('amb-'+k);}),
      ...SHOTS.map(async k=>{buffers[k]=await load('sfx-'+k).catch(()=>null);}),
    ]).then(()=>{
      for(const [k,db] of Object.entries(LOOPS)){
        const src=ctx.createBufferSource();src.buffer=buffers[k];src.loop=true;
        const norm=ctx.createGain();norm.gain.value=Math.pow(10,(-24-db)/20);
        const g=ctx.createGain();g.gain.value=0;src.connect(norm);
        // Electric cars: the engines' low rumble goes, the tyres stay (a low shelf that deepens with the
        // share of electric cars, model.js evShare).
        if(k==='traffic'){const shelf=ctx.createBiquadFilter();shelf.type='lowshelf';shelf.frequency.value=280;shelf.gain.value=0;norm.connect(shelf);shelf.connect(g);gains.shelf=shelf;}
        else norm.connect(g);
        g.connect(ambBus);
        // Start each loop at a different point so their seams never line up.
        src.start(0,Math.random()*buffers[k].duration);gains[k]=g;
      }
    }).catch(e=>console.warn('Ljud:',e.message));
    return loaded;
  }
  function shot(name,{gain=1,rate=1,pan=0}={}){
    const b=buffers[name];if(!b||!ctx)return;
    const src=ctx.createBufferSource();src.buffer=b;src.playbackRate.value=rate;
    const g=ctx.createGain();g.gain.value=gain;const p=ctx.createStereoPanner();p.pan.value=pan;
    src.connect(g);g.connect(p);p.connect(ambBus);src.start();
  }
  const set=(k,v)=>gains[k]?.gain.setTargetAtTime(v,ctx.currentTime,.6);
  // v: the shown vision; s: {hour, night 0–1, dist (camera to target, m), nearWater 0–1, and the
  // weather: storm 0–1 (wind, rain, a heavier sea), empty 0–1 (streets and squares left empty)}
  function update(dt,v,s){
    if(!on||!ctx||!v||!gains.sea)return;
    const near=Math.max(0,Math.min(1,1-(s.dist-40)/600)),day=1-s.night,storm=s.storm??0,quiet=1-Math.max(storm,s.empty??0);
    const green=Math.min(1,.2+.5*v.depave+.4*v.foodForest+.2*v.parking);
    const meal=(s.hour>=11.5&&s.hour<13.5)||(s.hour>=17&&s.hour<21.5);
    set('sea',(.25+.65*s.nearWater*(.5+.5*near)+.15*(1-near))*(1+.7*storm));
    set('wind',(.12+.6*(1-near))*(1-storm)+1.1*storm);
    set('rain',.3*storm);
    // Electric traffic is quieter at city speeds: about 3 dB less overall, most of it in the low end.
    const ev=v.ev??.06;
    set('traffic',.85*near*Math.min(1,v.cars)*(.35+.65*day)*(.3+.7*quiet)*(1-.3*ev));
    gains.shelf?.gain.setTargetAtTime(-12*ev,ctx.currentTime,.6);
    set('birds',near*day*(.25+.75*green)*(1-.9*storm));
    set('market',near*Math.min(1,.15+v.community+v.market*.5)*(meal?1:.35)*(.2+.8*day)*quiet);
    set('night',near*s.night*(.3+.7*green)*(1-storm));
    if(day>.4&&Math.random()<dt*near*.12*v.bikes*quiet)shot('bikebell',{gain:.35,rate:.95+Math.random()*.1,pan:Math.random()*1.6-.8});
    if(Math.random()<dt*.04*(.3+s.nearWater)*(1-storm))shot('gulls',{gain:.25+.2*(1-near),rate:.9+Math.random()*.2,pan:Math.random()*1.6-.8});
    const h=Math.floor(s.hour);
    if(lastHour!==null&&h!==lastHour&&h>=8&&h<=21)for(let i=0;i<Math.min(3,1+h%3);i++)setTimeout(()=>shot('bell',{gain:.5*(.4+.6*near)}),i*2600);
    lastHour=h;
  }
  return {
    get on(){return on;},
    async toggle(){
      if(!ctx)await init();
      on=!on;if(on)await ctx.resume();
      master.gain.setTargetAtTime(on?.9:0,ctx.currentTime,.4);
      return on;
    },
    // A cue for the journey: a decade turning, an event arriving.
    cue(name){if(on)shot(name==='decade'?'decade':'event',{gain:.6});},
    // Narration; the ambience ducks under it.
    async say(name){
      if(!on||!ctx)return;
      if(voice){try{voice.stop();}catch{}}
      const b=buffers[name]||(buffers[name]=await load(name).catch(()=>null));if(!b)return;
      voice=ctx.createBufferSource();voice.buffer=b;voice.connect(voBus);
      ambBus.gain.setTargetAtTime(.45,ctx.currentTime,.3);musicBus.gain.setTargetAtTime(.12,ctx.currentTime,.3);
      voice.onended=()=>{ambBus.gain.setTargetAtTime(1,ctx.currentTime,.8);musicBus.gain.setTargetAtTime(.32,ctx.currentTime,1.2);};
      voice.start();
    },
    hush(){if(voice){try{voice.stop();}catch{}voice=null;}},
    update,
  };
}
