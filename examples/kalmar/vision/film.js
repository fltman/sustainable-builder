// Kalmar 2126's film: its scenes, end card and narration, read by the engine's film tools (site/tools/film.mjs
// renders and mixes, film-web.mjs makes the web copy and subtitles, film-voices.mjs voices the lines).
// vo: narration clip (public/audio) and its start within the scene; amb: ambience beds for the scene;
// ar: callouts [spot id, start s, optional anchor override [x,y,z]]; en: the captions in English (the English
// film uses the same scenes and timing, with the narration clips <vo>-en).
export const SCENES=[
  {d:9.6,preset:'dagens',year:[2026,2026],hour:15.5,cam:[[-430,380,520],[-300,260,380]],target:[[-60,0,-20],[-40,0,-20]],y:'2026',t:'Kalmar idag',s:'73 000 invånare · 60 % av resorna med bil · inget kustvatten med god status',en:{t:'Kalmar today',s:'73,000 people · 60% of trips by car · no coastal water in good status'},vo:['vo-film-1',.3],amb:{wind:.5,sea:.6,traffic:.25}},
  {d:7.4,preset:'dagens',year:[2026,2026],hour:15.5,cam:[[-32,8,22],[48,8,14]],target:[[15,6,-42],[15,6,-42]],y:'',t:'Hur vill vi leva här om hundra år?',s:'– tillsammans med barn, barnbarn och grannar',en:{t:'How do we want to live here in a hundred years?',s:'– with our children, grandchildren and neighbours'},vo:['vo-film-2',.4],amb:{traffic:.8,birds:.25}},
  {d:16,preset:'sundstaden',year:[2026,2126],hour:16,orbit:{c:[-40,0,0],r:470,h:320,a:[3.6,5.0]},y:'year',t:'Sundstaden',s:'Forskningens förslag – räknat år för år',en:{t:'The Sound City',s:'The research-based proposal – computed year by year'},vo:['vo-film-3b',.8],ar:[['bil',3.5],['mat',4.5],['sol',5.5]],amb:{wind:.6,sea:.5}},
  {d:12.5,preset:'sundstaden',year:[2126,2126],hour:15.5,cam:[[-640,120,360],[-560,95,300]],target:[[-470,25,150],[-460,25,140]],y:'2126',t:'Nya kvarter i trä',s:'där parkeringarna låg – och ett odlingstorn vid stationen',en:{t:'New timber blocks',s:'where the car parks were – and a growing tower by the station'},vo:['vo-film-4b',.4],ar:[['bo',2.2,[-450,22,215]],['mat',3.4,[-506,62,120]]],amb:{birds:.8,wind:.3}},
  {d:10,preset:'sundstaden',year:[2126,2126],hour:16.5,cam:[[-150,58,-215],[-100,50,-245]],target:[[260,0,-390],[300,0,-410]],y:'2126',t:'Livet på vattnet',seaTime:530,s:'flytande kvarter, eldrivna färjor och ett klart Kalmarsund',en:{t:'Life on the water',s:'floating homes, electric ferries and a clear Kalmar Sound'},vo:['vo-film-5b',.6],ar:[['niva',2.0,[2,2,-346]],['batar',3.0,[300,0,-330]],['hav',4.0,[700,0,-520]]],amb:{sea:1,wind:.4}},
  {d:6.5,preset:'sundstaden',year:[2126,2126],hour:15,compare:[.88,.12],cam:[[-200,230,330],[-190,220,320]],target:[[-40,0,-10],[-40,0,-10]],y:'',t:'2026 ⇆ 2126',s:'',amb:{wind:.6,sea:.4}},
  {d:8.6,preset:'sundstaden',year:[2126,2126],hour:19.4,cam:[[-170,110,210],[-120,85,190]],target:[[0,0,-40],[10,0,-50]],y:'2126',t:'Kalmar 2126',s:'Ett sekel framåt – en forskningsförankrad vision',en:{t:'Kalmar 2126',s:'A century ahead – a research-based vision'},vo:['vo-film-5',.5],amb:{birds:.4,sea:.5,market:.25}},
  // End card (seconds within the scene): the title fades up over the drifting city, the picture fades to
  // black under it as the music drops into its breakdown, and the credits stay while the music plays out.
  {d:18.6,preset:'sundstaden',year:[2126,2126],hour:19.6,cam:[[-120,85,190],[-60,120,230]],target:[[10,0,-50],[0,0,-60]],y:'',t:'',s:'',
    endCard:{title:[.64,2.64],q:[2.8,4.4],black:[8.9,11.4],out:[17.1,18.6]},amb:{birds:.3,sea:.45,wind:.3}},
];

// The end card in each language.
export const END_CARD={
  sv:{sub:'Ett sekel framåt – en forskningsförankrad vision för ett hållbart Kalmar',q:'Vilket Kalmar vill du bygga?',
    small:'Byggd på Kalmar kommuns egen statistik, 251 forskningskällor och 3D-modellen av Kvarnholmen · Kartdata © OpenStreetMap'},
  en:{sub:'A century ahead – a research-based vision for a sustainable Kalmar',q:'Which Kalmar do you want to build?',
    small:'Built on Kalmar Municipality\'s own statistics, 251 research sources and the 3D model of Kvarnholmen · Map data © OpenStreetMap'},
};

// Spoken lines (as voiced in tools/generate-audio.py, numbers written out there) for subtitles.
export const LINES={
  'vo-film-1':{sv:'Det här är Kalmar i dag. Sjuttiotre tusen invånare, bilar på varannan gata – och ett hav som blir grönt varje sommar.',
    en:'This is Kalmar today. Seventy-three thousand people, cars on every other street – and a sea that turns green every summer.'},
  'vo-film-2':{sv:'Men hur vill vi egentligen leva här om hundra år? Tillsammans med våra barn, barnbarn och grannar?',
    en:'But how do we really want to live here in a hundred years? Together with our children, grandchildren and neighbours?'},
  'vo-film-3b':{sv:'Kalmar 2126 räknar fram ett svar, år för år – ur forskningen och kommunens egen statistik. Varje vägval syns i staden.',
    en:'Kalmar 2126 works out an answer, year by year – from the research and the municipality\'s own statistics. Every choice shows in the city.'},
  'vo-film-4b':{sv:'Där parkeringarna låg växer nya kvarter i trä. Vid stationen odlar ett torn mat året runt, och Kvarnholmens gator har blivit trädgårdar.',
    en:'Where the car parks were, new timber blocks are growing. By the station a tower grows food all year round, and the streets of Kvarnholmen have become gardens.'},
  'vo-film-5b':{sv:'Havet steg – så vi lärde oss att bo på det. Båtarna går tyst på el, fartygen seglar igen, och vattnet i Kalmarsund är klart.',
    en:'The sea rose – so we learned to live on it. The boats run quietly on electricity, the ships sail again, and the water in Kalmar Sound is clear.'},
  'vo-film-5':{sv:'Det är ingen prognos. Det är ett sätt att tänka – och att välja. Vilket Kalmar vill du bygga?',
    en:'It is not a forecast. It is a way of thinking – and of choosing. Which Kalmar do you want to build?'},
};

// The lines as voiced (ElevenLabs v3 audio tags, numbers written out); the clips are the pack's audio/<id>(-en).mp3.
export const SPOKEN={
  sv:{
   "vo-journey": "[warm, calm] Välkommen till Resan. Kalmar har planer fram till tjugohundrafemtio – men ingen har skrivit ner hur vi vill leva här om hundra år. Det får du göra nu, årtionde för årtionde, tillsammans med släkten Ek. [pause] Läs vad staden brottas med och vad den kan bygga på – och gör sedan dina första vägval.",
   "vo-film-1": "[warm, calm] Det här är Kalmar i dag. Sjuttiotre tusen invånare, bilar på varannan gata – och ett hav som blir grönt varje sommar.",
   "vo-film-2": "[thoughtful] Men hur vill vi egentligen leva här om hundra år? Tillsammans med våra barn, barnbarn och grannar?",
   "vo-film-3": "[warm] Kalmar tjugoett tjugosex försöker svara – med forskningen och kommunens egen statistik, år för år. Taken börjar odla och ge el. Gatorna blir trädgårdar. Havet får tillbaka sin färg.",
   "vo-film-4": "[warm] Där det var parkering växer det mat. Och på Stortorget äter grannar tillsammans igen.",
   "vo-film-3b": "[warm] Kalmar tjugoett tjugosex räknar fram ett svar, år för år – ur forskningen och kommunens egen statistik. Varje vägval syns i staden.",
   "vo-film-4b": "[warm, quietly amazed] Där parkeringarna låg växer nya kvarter i trä. Vid stationen odlar ett torn mat året runt, och Kvarnholmens gator har blivit trädgårdar.",
   "vo-film-5b": "[calm, wonder] Havet steg – så vi lärde oss att bo på det. Båtarna går tyst på el, fartygen seglar igen, och vattnet i Kalmarsund är klart.",
   "vo-film-5": "[calm, sincere] Det är ingen prognos. Det är ett sätt att tänka – och att välja. [pause] Vilket Kalmar vill du bygga?"
  },
  en:{
   "vo-journey": "[warm, calm] Welcome to the Journey. Kalmar has plans up to twenty fifty – but nobody has written down how we want to live here in a hundred years. That is up to you now, decade by decade, together with the Ek family. [pause] Read what the town is up against and what it can build on – then make your first choices.",
   "vo-film-1": "[warm, calm] This is Kalmar today. Seventy-three thousand people, cars on every other street – and a sea that turns green every summer.",
   "vo-film-2": "[thoughtful] But how do we really want to live here in a hundred years? Together with our children, grandchildren and neighbours?",
   "vo-film-3b": "[warm] Kalmar twenty-one twenty-six works out an answer, year by year – from the research and the municipality's own statistics. Every choice shows in the city.",
   "vo-film-4b": "[warm, quietly amazed] Where the car parks were, new timber blocks are growing. By the station a tower grows food all year round, and the streets of Kvarnholmen have become gardens.",
   "vo-film-5b": "[calm, wonder] The sea rose – so we learned to live on it. The boats run quietly on electricity, the ships sail again, and the water in Kalmar Sound is clear.",
   "vo-film-5": "[calm, sincere] It is not a forecast. It is a way of thinking – and of choosing. [pause] Which Kalmar do you want to build?"
  },
};
