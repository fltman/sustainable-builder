// Rättvik 2126's film: its scenes, end card and narration, read by the engine's film tools (site/tools/film.mjs
// renders and mixes, film-web.mjs makes the web copy and subtitles; sustainable.py film-voices voices the lines).
// Camera positions are model metres (x east, y up, z south), checked with tools/look.mjs --shots; the ground
// at the station is about 3 m, on Kyrkudden 7 m. vo: narration clip and its start within the scene; amb:
// ambience beds; en: the captions in English (the English film uses the same scenes and timing).
export const SCENES=[
  {d:11,preset:'dagens',year:[2026,2026],hour:15.5,cam:[[760,520,560],[660,450,480]],target:[[120,0,-40],[110,0,-50]],y:'2026',t:'Rättvik idag',s:'10 978 invånare · 35 % över 65 · två direkttåg om dagen till Stockholm',
    en:{t:'Rättvik today',s:'10,978 people · 35% over 65 · two direct trains a day to Stockholm'},vo:['vo-film-1',.3],amb:{wind:.5,sea:.35,traffic:.3,birds:.2}},
  {d:7.4,preset:'dagens',year:[2026,2026],hour:15.5,cam:[[451,6.6,27.4],[441.8,6.4,35.1]],target:[[405,6,66],[404,6,64]],y:'',t:'Hur vill vi leva här om hundra år?',s:'– tillsammans med barn, barnbarn och grannar',
    en:{t:'How do we want to live here in a hundred years?',s:'– with our children, grandchildren and neighbours'},vo:['vo-film-2',.4],amb:{traffic:.7,birds:.3}},
  {d:16,preset:'siljansbygden',year:[2026,2126],hour:16,orbit:{c:[150,0,-50],r:760,h:420,a:[.2,1.3]},y:'year',t:'Siljansbygden',s:'Forskningens förslag – räknat år för år',
    en:{t:'The Siljan Country',s:'The research-based proposal – computed year by year'},vo:['vo-film-3b',.8],amb:{wind:.6,sea:.3,birds:.3}},
  {d:12.5,preset:'siljansbygden',year:[2126,2126],hour:15.5,cam:[[600,110,320],[520,90,270]],target:[[340,0,110],[330,0,100]],y:'2126',t:'Gatorna blev trädgårdar',s:'och torget säljer mat från fäbodarna',
    en:{t:'The streets became gardens',s:'and the square sells food from the summer farms'},vo:['vo-film-4b',.4],amb:{birds:.8,market:.4,wind:.3}},
  {d:10,preset:'siljansbygden',year:[2126,2126],hour:16.5,cam:[[-460,60,660],[-400,52,600]],target:[[-80,0,300],[-60,0,290]],y:'2126',t:'Livet på Siljan',seaTime:300,s:'eldrivna båtbussar, klart vatten och plats för högvattnet',
    en:{t:'Life on Lake Siljan',s:'electric boat buses, clear water and room for the high water'},vo:['vo-film-5b',.6],amb:{sea:.7,wind:.4,birds:.3}},
  {d:6.5,preset:'siljansbygden',year:[2126,2126],hour:15,compare:[.88,.12],cam:[[700,480,520],[690,470,510]],target:[[120,0,-40],[120,0,-40]],y:'',t:'2026 ⇆ 2126',s:'',amb:{wind:.6,sea:.3}},
  {d:8.6,preset:'siljansbygden',year:[2126,2126],hour:19.4,cam:[[-440,75,-300],[-480,68,-330]],target:[[-715,8,-540],[-720,8,-541]],y:'2126',t:'Rättvik 2126',s:'Ett sekel framåt vid Siljan – en forskningsförankrad vision',
    en:{t:'Rättvik 2126',s:'A century ahead by Lake Siljan – a research-based vision'},vo:['vo-film-5',.5],amb:{birds:.4,sea:.35,wind:.3}},
  // End card (seconds within the scene): the title fades up over the drifting town, the picture fades to
  // black under it as the music drops, and the credits stay while the music plays out.
  {d:18.6,preset:'siljansbygden',year:[2126,2126],hour:19.6,cam:[[-480,68,-330],[-420,110,-250]],target:[[-720,8,-541],[-700,0,-560]],y:'',t:'',s:'',
    endCard:{title:[.64,2.64],q:[2.8,4.4],black:[8.9,11.4],out:[17.1,18.6]},amb:{birds:.3,sea:.35,wind:.3}},
];

// The end card in each language.
export const END_CARD={
  sv:{sub:'Ett sekel framåt – en forskningsförankrad vision för ett hållbart Rättvik',q:'Vilket Rättvik vill du bygga?',
    small:'Byggd på Rättviks kommuns egen statistik, 410 belagda uppgifter och en 3D-modell ur OpenStreetMap med höjddata från Lantmäteriet och Copernicus · Kartdata © OpenStreetMap'},
  en:{sub:'A century ahead – a research-based vision for a sustainable Rättvik',q:'Which Rättvik do you want to build?',
    small:'Built on Rättvik Municipality\'s own statistics, 410 sourced figures and a 3D model from OpenStreetMap with elevation data from Lantmäteriet and Copernicus · Map data © OpenStreetMap'},
};

// The narration as written (subtitles).
export const LINES={
  'vo-film-1':{sv:'Det här är Rättvik i dag. Elva tusen invånare vid Siljan, mer än var tredje över 65 – och på sommaren nästan 60 procent fler.',
    en:'This is Rättvik today. Eleven thousand people by Lake Siljan, more than one in three over 65 – and almost 60 percent more in summer.'},
  'vo-film-2':{sv:'Men hur vill vi egentligen leva här om hundra år? Tillsammans med våra barn, barnbarn och grannar?',
    en:'But how do we really want to live here in a hundred years? Together with our children, grandchildren and neighbours?'},
  'vo-film-3b':{sv:'Rättvik 2126 räknar fram ett svar, år för år – ur forskningen och kommunens egen statistik. Varje vägval syns i orten.',
    en:'Rättvik 2126 works out an answer, year by year – from the research and the municipality\'s own statistics. Every choice shows in the town.'},
  'vo-film-4b':{sv:'Gatorna kring stationen och torget har blivit trädgårdar. Fäbodarna lever igen, och maten på torget kommer från bygden.',
    en:'The streets round the station and the square have become gardens. The summer farms are alive again, and the food on the square comes from the countryside.'},
  'vo-film-5b':{sv:'Siljan är lika klar som förr. Båtarna går tyst på el mellan byarna – och högvattnet har fått plats att komma och gå.',
    en:'Lake Siljan is as clear as it ever was. The boats run quietly on electricity between the villages – and the high water has room to come and go.'},
  'vo-film-5':{sv:'Det är ingen prognos. Det är ett sätt att tänka – och att välja. Vilket Rättvik vill du bygga?',
    en:'It is not a forecast. It is a way of thinking – and of choosing. Which Rättvik do you want to build?'},
};

// The narration as voiced (ElevenLabs audio tags, numbers written out): sustainable.py film-voices rattvik.
export const SPOKEN={
  sv:{
    'vo-film-1':'[warm, calm] Det här är Rättvik i dag. Elvatusen invånare vid Siljan, mer än var tredje över sextiofem – och på sommaren nästan sextio procent fler.',
    'vo-film-2':'[thoughtful] Men hur vill vi egentligen leva här om hundra år? Tillsammans med våra barn, barnbarn och grannar?',
    'vo-film-3b':'[warm] Rättvik tjugoett tjugosex räknar fram ett svar, år för år – ur forskningen och kommunens egen statistik. Varje vägval syns i orten.',
    'vo-film-4b':'[warm, quietly amazed] Gatorna kring stationen och torget har blivit trädgårdar. Fäbodarna lever igen, och maten på torget kommer från bygden.',
    'vo-film-5b':'[calm, wonder] Siljan är lika klar som förr. Båtarna går tyst på el mellan byarna – och högvattnet har fått plats att komma och gå.',
    'vo-film-5':'[calm, sincere] Det är ingen prognos. Det är ett sätt att tänka – och att välja. [pause] Vilket Rättvik vill du bygga?',
  },
  en:{
    'vo-film-1':'[warm, calm] This is Rättvik today. Eleven thousand people by Lake Siljan, more than one in three over sixty-five – and almost sixty percent more in summer.',
    'vo-film-2':'[thoughtful] But how do we really want to live here in a hundred years? Together with our children, grandchildren and neighbours?',
    'vo-film-3b':'[warm] Rättvik twenty-one twenty-six works out an answer, year by year – from the research and the municipality\'s own statistics. Every choice shows in the town.',
    'vo-film-4b':'[warm, quietly amazed] The streets round the station and the square have become gardens. The summer farms are alive again, and the food on the square comes from the countryside.',
    'vo-film-5b':'[calm, wonder] Lake Siljan is as clear as it ever was. The boats run quietly on electricity between the villages – and the high water has room to come and go.',
    'vo-film-5':'[calm, sincere] It is not a forecast. It is a way of thinking – and of choosing. [pause] Which Rättvik do you want to build?',
  },
};
// The soundtrack (media/audio/music.mp3, Suno v6: "Rättvik 2126 – Midsommarnatt", melodic deep house with a
// Dalecarlian fiddle hook, 121 BPM): the film starts 42.4 s in, in the groove, so the breakdown at 126.0 s
// comes just as the end card's picture has gone black (83.4 s into the film), as in Kalmar 2126's film.
export const MUSIC={start:42.4};
// The narrator: Kalmar 2126's voice and model.
export const VOICE={id:'B7OAdN7qiPFwZhhjfkxq',model:'eleven_v4'};
