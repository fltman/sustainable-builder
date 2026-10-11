// Venezia 2126's film: its scenes, end card and narration, read by the engine's film tools (site/tools/film.mjs
// renders and mixes, film-web.mjs makes the web copy and subtitles; sustainable.py film-voices voices the lines).
// Camera positions are model metres (x east, y up, z south), checked with tools/look.mjs --shots; the water is at
// y −1.2 and the quays at about 0. Every camera stays at least 4° above its target (the controls' maxPolarAngle)
// and its target inside the play area (±900 m), so the controls never move it. The high shots look steeply down
// or stay low: from higher up the edge of the rendered world shows. vo: narration clip and its start within the
// scene; amb: ambience beds (Venice has no traffic: sea, wind, birds, market); en/it: the captions in English and
// Italian (the English film uses the same scenes and timing; the narrator does not speak Italian).
export const SCENES=[
  // Today: the Bacino di San Marco from above San Giorgio Maggiore – the Piazzetta, the Doge's Palace, the Riva.
  {d:11,preset:'dagens',year:[2026,2026],hour:15.5,cam:[[650,88,660],[590,80,610]],target:[[70,0,150],[60,0,140]],y:'2026',t:'Venedig idag',s:'47 625 invånare · fler turistbäddar än invånare · MOSE stängdes 49 gånger 2025/26',
    en:{t:'Venice today',s:'47,625 residents · more tourist beds than residents · MOSE closed 49 times in 2025/26'},
    it:{t:'Venezia oggi',s:'47.625 abitanti · più posti letto turistici che abitanti · il MOSE si è chiuso 49 volte nel 2025/26'},vo:['vo-film-1',.3],amb:{wind:.5,sea:.6,birds:.15}},
  // The question: down the Grand Canal to the Rialto bridge, the city's busiest crossing.
  {d:7.4,preset:'dagens',year:[2026,2026],hour:15.5,cam:[[-238,26,-226],[-226,25,-238]],target:[[-125,8,-345],[-125,8,-345]],y:'',t:'Hur vill vi leva här om hundra år?',s:'– tillsammans med barn, barnbarn och grannar',
    en:{t:'How do we want to live here in a hundred years?',s:'– with our children, grandchildren and neighbours'},
    it:{t:'Come vogliamo vivere qui fra cent\'anni?',s:'– insieme ai figli, ai nipoti e ai vicini'},vo:['vo-film-2',.4],amb:{market:.5,sea:.35,birds:.2}},
  // The century in the research-based vision: a slow, steep turn over San Marco and Castello while the people, the
  // boats, the stalls and the water change (Venice's model leaves the roofs and facades as they are).
  {d:13.7,preset:'lagunaviva',year:[2026,2126],hour:16,orbit:{c:[40,0,40],r:380,h:290,a:[.25,1.3]},y:'year',t:'Laguna viva',s:'Forskningens förslag – räknat år för år',
    en:{t:'Laguna viva',s:'The research-based proposal – computed year by year'},
    it:{t:'Laguna viva',s:'La proposta della ricerca – calcolata anno per anno'},vo:['vo-film-3',.8],amb:{wind:.6,sea:.3}},
  // 2126: the Grand Canal from the Accademia bridge towards the Salute, with its boats.
  {d:9,preset:'lagunaviva',year:[2126,2126],hour:16.5,cam:[[-664,38,398],[-622,37,404]],target:[[-300,8,448],[-296,8,449]],y:'2126',t:'Canal Grande går på el',s:'tysta vaporetti – och venetianer i palatsen igen',
    en:{t:'The Grand Canal runs on electricity',s:'quiet vaporetti – and Venetians in the palaces again'},
    it:{t:'Il Canal Grande va a elettricità',s:'vaporetti silenziosi – e di nuovo veneziani nei palazzi'},vo:['vo-film-4',.4],amb:{sea:.5,birds:.4,wind:.2}},
  // 2126: Campo Santa Maria Formosa in the evening – market stalls, long tables, neighbours.
  {d:9,preset:'lagunaviva',year:[2126,2126],hour:17.5,cam:[[330,28,-186],[318,25,-200]],target:[[278,0,-266],[276,0,-270]],y:'2126',t:'Barnen är tillbaka',s:'Campo Santa Maria Formosa – tomma lägenheter har blivit hem',
    en:{t:'The children are back',s:'Campo Santa Maria Formosa – empty flats have become homes'},
    it:{t:'I bambini sono tornati',s:'Campo Santa Maria Formosa – gli appartamenti vuoti sono tornati case'},vo:['vo-film-5',.4],amb:{market:.6,birds:.6,wind:.2}},
  // 2126: the lagoon opening east past the Riva degli Schiavoni towards the Lido. (The engine draws no salt
  // marshes; the caption carries them: in the film's world, SSP2-4.5, Laguna viva keeps about 23 km² in 2126 of the
  // 40 of 2026, while today's course has none left by about 2060 – model.js; the gates are shut a quarter of the
  // year, against two thirds on today's course.)
  {d:9.5,preset:'lagunaviva',year:[2126,2126],hour:16,cam:[[100,60,300],[190,64,312]],target:[[900,0,330],[900,0,345]],y:'2126',t:'Lagunen andas',s:'saltängarna finns kvar – 23 km² år 2126; på dagens kurs är de borta omkring 2060',
    en:{t:'The lagoon breathes',s:'the salt marshes survive – 23 km² in 2126; on the current course they are gone by about 2060'},
    it:{t:'La laguna respira',s:'le barene resistono – 23 km² nel 2126; con la rotta attuale spariscono verso il 2060'},vo:['vo-film-6',.4],amb:{sea:.8,wind:.5,birds:.3}},
  // 2126: the Piazzetta from the Bacino, the water lapping below the Molo and the square dry behind it. The camera
  // stays low enough that the Campanile's top (and the model's loose cap above it) is out of frame. The sea itself is
  // 86 cm higher (SSP2-4.5), the city has been lifted 28 cm with seawater, the walkways raised to 1.20 m, and MOSE
  // closes almost every day (model.js).
  {d:11.5,preset:'lagunaviva',year:[2126,2126],hour:18.3,cam:[[162,18,282],[162,17,250]],target:[[158,0,52],[158,0,40]],y:'2126',t:'Markusplatsen står torr',s:'havet står 86 cm högre – men staden har lyfts 28 cm, och höjda kajer och MOSE gör resten',
    en:{t:'St Mark\'s Square stays dry',s:'the sea is 86 cm higher – but the city has been raised 28 cm, and raised quays and MOSE do the rest'},
    it:{t:'Piazza San Marco resta asciutta',s:'il mare è più alto di 86 cm – ma la città è stata sollevata di 28 cm, e rive rialzate e MOSE fanno il resto'},vo:['vo-film-7',.4],amb:{sea:.6,market:.25,birds:.3}},
  // Dusk over the Giudecca canal: the Zattere and the Salute against the sunset, a water bus crossing.
  {d:8.6,preset:'lagunaviva',year:[2126,2126],hour:19.4,cam:[[420,60,560],[380,58,540]],target:[[-180,10,470],[-190,10,468]],y:'2126',t:'Venezia 2126',s:'Ett sekel framåt i lagunen – en forskningsförankrad vision',
    en:{t:'Venezia 2126',s:'A century ahead in the lagoon – a research-based vision'},
    it:{t:'Venezia 2126',s:'Un secolo avanti nella laguna – una visione fondata sulla ricerca'},vo:['vo-film-8',.5],amb:{sea:.45,birds:.3,wind:.3}},
  // End card (seconds within the scene): the title fades up over the drifting city, the picture fades to black
  // under it as the music drops, and the credits stay while the music plays out.
  {d:18.6,preset:'lagunaviva',year:[2126,2126],hour:19.6,cam:[[380,58,540],[460,120,640]],target:[[-190,10,468],[-200,0,460]],y:'',t:'',s:'',
    endCard:{title:[.64,2.64],q:[2.8,4.4],black:[8.9,11.4],out:[17.1,18.6]},amb:{sea:.4,wind:.3,birds:.2}},
];
// The soundtrack (media/audio/music.mp3, Suno v6: "Venezia 2126 – Barcarola", melodic dub techno with a barcarolle
// melody and baroque harpsichord, 119 BPM): the film starts 28.2 s in, so the bass drops out (119.6 s) just as the
// end card's picture has gone black (91.1 s into the film), as in Kalmar 2126's and Rättvik 2126's films.
export const MUSIC={start:28.2};

// The end card in each language (the sourced figures: the records in research/baseline.json).
export const END_CARD={
  sv:{sub:'Ett sekel framåt i lagunen – en forskningsförankrad vision för ett hållbart Venedig',q:'Vilket Venedig vill du bygga?',
    small:'Byggd på Venedigs kommuns och ISTAT:s statistik, 424 belagda uppgifter och en 3D-modell ur OpenStreetMap med höjddata från Regione del Veneto och Copernicus · Kartdata © OpenStreetMap'},
  en:{sub:'A century ahead in the lagoon – a research-based vision for a sustainable Venice',q:'Which Venice do you want to build?',
    small:'Built on the statistics of the City of Venice and ISTAT, 424 sourced figures and a 3D model from OpenStreetMap with elevation data from the Veneto Region and Copernicus · Map data © OpenStreetMap'},
  it:{sub:'Un secolo avanti nella laguna – una visione per una Venezia sostenibile, fondata sulla ricerca',q:'Quale Venezia vuoi costruire?',
    small:'Costruita sulle statistiche del Comune di Venezia e dell\'ISTAT, 424 dati documentati e un modello 3D da OpenStreetMap con i dati altimetrici della Regione del Veneto e di Copernicus · Dati cartografici © OpenStreetMap'},
};

// The narration as written (subtitles). Each line has as many sentences in every language: film-web.mjs times
// the subtitles sentence by sentence on the voiced clip.
export const LINES={
  'vo-film-1':{sv:'Det här är Venedig i dag. Fyrtioåtta tusen invånare – en fjärdedel av dem som bodde här 1951 – och fler turistbäddar än invånare.',
    en:'This is Venice today. Forty-eight thousand people – a quarter of those who lived here in 1951 – and more tourist beds than residents.',
    it:'Questa è Venezia oggi. Quarantottomila abitanti – un quarto di quelli che ci vivevano nel 1951 – e più posti letto turistici che residenti.'},
  'vo-film-2':{sv:'Men hur vill vi egentligen leva här om hundra år? Tillsammans med våra barn, barnbarn och grannar?',
    en:'But how do we really want to live here in a hundred years? Together with our children, grandchildren and neighbours?',
    it:'Ma come vogliamo davvero vivere qui fra cent\'anni? Insieme ai nostri figli, ai nipoti e ai vicini?'},
  'vo-film-3':{sv:'Venezia 2126 räknar fram ett svar, år för år – ur forskningen och stadens egen statistik. Valen syns i staden – i människorna, båtarna och vattnet.',
    en:'Venezia 2126 works out an answer, year by year – from the research and the city\'s own statistics. The choices show in the city – in its people, its boats and its water.',
    it:'Venezia 2126 calcola una risposta, anno per anno – dalla ricerca e dalle statistiche del Comune. Le scelte si vedono in città – nella gente, nelle barche e nell\'acqua.'},
  'vo-film-4':{sv:'Canal Grande är tyst. Vattenbussarna går på el, och i palatsen längs kanalen bor det venetianer igen.',
    en:'The Grand Canal is quiet. The vaporetti run on electricity, and Venetians live in the palaces along the canal again.',
    it:'Il Canal Grande è silenzioso. I vaporetti vanno a elettricità, e nei palazzi lungo il canale abitano di nuovo i veneziani.'},
  'vo-film-5':{sv:'På torgen leker barnen igen. De tomma lägenheterna har blivit hem – och besökarna bokar sin dag.',
    en:'Children play in the squares again. The empty flats have become homes – and visitors book their day.',
    it:'Nei campi i bambini giocano di nuovo. Gli appartamenti vuoti sono tornati case – e i visitatori prenotano la loro giornata.'},
  'vo-film-6':{sv:'Lagunen andas fortfarande. Saltängarna håller stånd – färre än i dag, men levande, där dagens kurs dränker dem alla.',
    en:'The lagoon still breathes. The salt marshes hold on – fewer than today, but alive, where today\'s course drowns them all.',
    it:'La laguna respira ancora. Le barene resistono – meno di oggi, ma vive, mentre la rotta attuale le sommerge tutte.'},
  'vo-film-7':{sv:'Havet har stigit nästan nittio centimeter, och staden har höjts nästan trettio. Men Markusplatsen är torr – staden har lärt sig att leva med vattnet.',
    en:'The sea is almost ninety centimetres higher, and the city has been raised almost thirty. But St Mark\'s Square is dry – the city has learned to live with the water.',
    it:'Il mare è salito di quasi novanta centimetri, e la città si è alzata di quasi trenta. Ma piazza San Marco è asciutta – la città ha imparato a vivere con l\'acqua.'},
  'vo-film-8':{sv:'Det är ingen prognos. Det är ett sätt att tänka – och att välja. Vilket Venedig vill du bygga?',
    en:'It is not a forecast. It is a way of thinking – and of choosing. Which Venice do you want to build?',
    it:'Non è una previsione. È un modo di pensare – e di scegliere. Quale Venezia vuoi costruire?'},
};

// The narration as voiced (ElevenLabs audio tags, numbers written out): sustainable.py film-voices venezia.
// Swedish and English only – the narrator does not speak Italian; the Italian lines above are subtitles.
export const SPOKEN={
  sv:{
    'vo-film-1':'[warm, calm] Det här är Venedig i dag. Fyrtioåttatusen invånare – en fjärdedel av dem som bodde här nittonhundrafemtioett – och fler turistbäddar än invånare.',
    'vo-film-2':'[thoughtful] Men hur vill vi egentligen leva här om hundra år? Tillsammans med våra barn, barnbarn och grannar?',
    'vo-film-3':'[warm] Venezia tjugoett tjugosex räknar fram ett svar, år för år – ur forskningen och stadens egen statistik. Valen syns i staden – i människorna, båtarna och vattnet.',
    'vo-film-4':'[warm, quietly amazed] Canal Grande är tyst. Vattenbussarna går på el, och i palatsen längs kanalen bor det venetianer igen.',
    'vo-film-5':'[warm, smiling] På torgen leker barnen igen. De tomma lägenheterna har blivit hem – och besökarna bokar sin dag.',
    'vo-film-6':'[calm, wonder] Lagunen andas fortfarande. Saltängarna håller stånd – färre än i dag, men levande, där dagens kurs dränker dem alla.',
    'vo-film-7':'[calm, steady] Havet har stigit nästan nittio centimeter, och staden har höjts nästan trettio. Men Markusplatsen är torr – staden har lärt sig att leva med vattnet.',
    'vo-film-8':'[calm, sincere] Det är ingen prognos. Det är ett sätt att tänka – och att välja. [pause] Vilket Venedig vill du bygga?',
  },
  en:{
    'vo-film-1':'[warm, calm] This is Venice today. Forty-eight thousand people – a quarter of those who lived here in nineteen fifty-one – and more tourist beds than residents.',
    'vo-film-2':'[thoughtful] But how do we really want to live here in a hundred years? Together with our children, grandchildren and neighbours?',
    'vo-film-3':'[warm] Venezia twenty-one twenty-six works out an answer, year by year – from the research and the city\'s own statistics. The choices show in the city – in its people, its boats and its water.',
    'vo-film-4':'[warm, quietly amazed] The Grand Canal is quiet. The vaporetti run on electricity, and Venetians live in the palaces along the canal again.',
    'vo-film-5':'[warm, smiling] Children play in the squares again. The empty flats have become homes – and visitors book their day.',
    'vo-film-6':'[calm, wonder] The lagoon still breathes. The salt marshes hold on – fewer than today, but alive, where today\'s course drowns them all.',
    'vo-film-7':'[calm, steady] The sea is almost ninety centimetres higher, and the city has been raised almost thirty. But St Mark\'s Square is dry – the city has learned to live with the water.',
    'vo-film-8':'[calm, sincere] It is not a forecast. It is a way of thinking – and of choosing. [pause] Which Venice do you want to build?',
  },
  it:{
    'vo-film-1':'[warm, calm] Questa è Venezia oggi. Quarantottomila abitanti – un quarto di quelli che ci vivevano nel millenovecentocinquantuno – e più posti letto turistici che residenti.',
    'vo-film-2':"[thoughtful] Ma come vogliamo davvero vivere qui fra cent'anni? Insieme ai nostri figli, ai nipoti e ai vicini?",
    'vo-film-3':'[warm] Venezia duemilacentoventisei calcola una risposta, anno per anno – dalla ricerca e dalle statistiche del Comune. Le scelte si vedono in città – nella gente, nelle barche e nell\'acqua.',
    'vo-film-4':'[warm, quietly amazed] Il Canal Grande è silenzioso. I vaporetti vanno a elettricità, e nei palazzi lungo il canale abitano di nuovo i veneziani.',
    'vo-film-5':'[warm, smiling] Nei campi i bambini giocano di nuovo. Gli appartamenti vuoti sono tornati case – e i visitatori prenotano la loro giornata.',
    'vo-film-6':'[calm, wonder] La laguna respira ancora. Le barene resistono – meno di oggi, ma vive, mentre la rotta attuale le sommerge tutte.',
    'vo-film-7':"[calm, steady] Il mare è salito di quasi novanta centimetri, e la città si è alzata di quasi trenta. Ma piazza San Marco è asciutta – la città ha imparato a vivere con l'acqua.",
    'vo-film-8':'[calm, sincere] Non è una previsione. È un modo di pensare – e di scegliere. [pause] Quale Venezia vuoi costruire?',
  },
};
// The narrators: in English Kalmar 2126's voice (the author's own); in Italian a native narrator from
// ElevenLabs' library ("Marco – Deep, Rich and Reflective", added to the account as "Marco – Venezia 2126").
export const VOICE={id:'B7OAdN7qiPFwZhhjfkxq',model:'eleven_v4',it:{id:'13Cuh3NuYvWOVQtLbRN8'}};
