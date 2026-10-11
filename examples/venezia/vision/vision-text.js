// "Visionen": historic Venice in a given year written out as a short vision document, from the model state.
// Every sentence is conditioned on the numbers, so the text describes the plan the player made – including
// what it did not do – and each section names what has changed since 2026. Today's facts come from the
// research (research/deep/*-notes.md, research/story.json); what a lever brings follows its levels in
// levers.js and the places in places.js. Swedish, English and Italian inline with t(sv,en,it), so
// en/vision-text.js and it/vision-text.js stay empty.
import { t, dec, int, pct } from '@engine/i18n.js';
import { BASE, PARAMS, FLOOD } from '@city/model.js';
// Hours as "3 h 56", to the minute (the fastest train to Rome takes 236 minutes today).
const railText=v=>{const m=Math.round(v*60);return `${Math.floor(m/60)} h ${String(m%60).padStart(2,'0')}`;};
const near=(v,step)=>Math.round(v/step)*step;
// Centimetres on the tide gauge's zero (ZMPS, Punta della Salute 1897), the scale every Venetian tide is given in.
const cm=m=>Math.round(m*100);
// The lagoon's mean level today: 0.353 m on ZMPS (2020–2025, research/deep/hav-tidvatten).
const MEAN=.353;
// The share of the historic city's public walkways that lie below a water level (the Comune's table, model.js FLOOD).
const under=level=>{const T=FLOOD.table;if(level<=T[0][0])return 0;
  for(let i=1;i<T.length;i++)if(level<=T[i][0]){const [a,p]=T[i-1],[b,q]=T[i];return p+(q-p)*(level-a)/(b-a);}return 1;};
// The historic city's people by census (the Comune's series A01_T01) and the year, to five, it last had as many.
const HIST=[[1951,174808],[1961,137150],[1971,108426],[1981,93598],[1991,76644],[2001,65695],[2011,58991],[2021,50434],[2025,47625]];
const yearAt=p=>{for(let i=1;i<HIST.length;i++){const [y0,p0]=HIST[i-1],[y1,p1]=HIST[i];if(p<=p0&&p>=p1)return Math.round((y0+(y1-y0)*(p0-p)/(p0-p1))/5)*5;}return p>HIST[0][1]?1951:2025;};
// Tourist beds per resident in the historic city: 1.07 on OCIO's counter in September 2026 (research/deep/samhalle-halsa).
const BEDS0=1.07;
// Italian says l' before a percentage that begins with a vowel (l'8%, l'11%, l'80%); il() and Il() give the article.
const vowel=v=>{const n=Math.round(Math.abs(v)*100);return n===1||n===8||n===11||(n>=80&&n<90);};
const il=v=>vowel(v)?"l'":'il ',Il=v=>vowel(v)?"L'":'Il ';
// How far a lever must be implemented (0–1) before the text shows its first, second and third level.
const L1=.12,L2=.45,L3=.8;

export function visionSections(run,year){
  const r=run.years[year-2026],d=r.ind,I=r.I,d0=run.years[0].ind;
  const lvl=id=>I[id]||0;
  // 2026 is the starting point; from 2027 a figure carries its 2026 value.
  const now=year<=2026,was=x=>now?'':` (2026: ${x})`;
  const mn=(v,k=1)=>t(`${dec(v/1e6,k)} miljoner`,`${dec(v/1e6,k)} million`,`${dec(v/1e6,k)} milioni`);
  const S=[];

  // Residents and homes: the emptying city, the homes that became tourist beds, the families who could come back
  // (research/deep/samhalle-halsa, turism-ekonomi, kommun-plats-historia; story.json; levers.js bogemenskap).
  const home=lvl('bogemenskap'),prev=year>2026?run.years[year-2027].ind.pop:d.pop,rising=d.pop>prev+20;
  const beds=BEDS0*(d.touristBeds/BASE.touristBeds)/(d.pop/BASE.pop);
  const pop=int(near(d.pop,100)),pop0=int(d0.pop);
  S.push({title:t('Invånare och hem','Residents and homes','Abitanti e case'),text:[
    now?t(`Den historiska staden har ${int(d.pop)} invånare, ${pct(d.pop/174808)} av de 174 808 som bodde här 1951, och det dör tre gånger så många som det föds: 689 mot 209 år 2025.`,
        `The historic city has ${int(d.pop)} residents, ${pct(d.pop/174808)} of the 174,808 who lived here in 1951, and three times as many people die as are born: 689 against 209 in 2025.`,
        `La città storica ha ${int(d.pop)} abitanti, ${il(d.pop/174808)}${pct(d.pop/174808)} dei 174.808 che ci vivevano nel 1951, e i morti sono il triplo dei nati: 689 contro 209 nel 2025.`)
    :d.pop>HIST.at(-2)[1]?t(`Den historiska staden har ${pop} invånare${was(pop0)}, lika många som omkring ${yearAt(d.pop)}: unga och barnfamiljer flyttar hit igen, för det dör fortfarande fler än det föds.`,
        `The historic city has ${pop} residents${was(pop0)}, as many as around ${yearAt(d.pop)}: young people and families are moving here again, since more people still die than are born.`,
        `La città storica ha ${pop} abitanti${was(pop0)}, tanti quanti intorno al ${yearAt(d.pop)}: giovani e famiglie tornano a stabilirsi qui, perché i morti sono ancora più dei nati.`)
    :d.pop>d0.pop+300?t(`Den historiska staden har ${pop} invånare${was(pop0)}: unga och barnfamiljer har börjat flytta hit igen, men det dör fortfarande fler än det föds.`,
        `The historic city has ${pop} residents${was(pop0)}: young people and families have begun to move here again, though more people still die than are born.`,
        `La città storica ha ${pop} abitanti${was(pop0)}: giovani e famiglie hanno ricominciato a stabilirsi qui, ma i morti sono ancora più dei nati.`)
    :d.pop<d0.pop-300?t(`Den historiska staden har ${pop} invånare${was(pop0)}, ${pct(d.pop/174808)} av dem som bodde här 1951${rising?' – de många gamla dör, men nu flyttar fler hit än härifrån, och staden har börjat växa igen':home>L2?' – de många gamla dör fortare än nya venetianer hinner flytta in, men bostäderna står nu redo för dem som kommer':' – det dör fler än det föds, och för få unga flyttar hit'}.`,
        `The historic city has ${pop} residents${was(pop0)}, ${pct(d.pop/174808)} of those who lived here in 1951${rising?' – the many old people are dying, but more now move in than out, and the city has begun to grow again':home>L2?' – the many old people die faster than new Venetians can move in, but the homes now stand ready for those who come':' – more people die than are born, and too few young people move here'}.`,
        `La città storica ha ${pop} abitanti${was(pop0)}, ${il(d.pop/174808)}${pct(d.pop/174808)} di quelli che ci vivevano nel 1951${rising?' – i tanti anziani se ne vanno, ma ora arriva più gente di quanta ne parta, e la città ha ripreso a crescere':home>L2?' – i tanti anziani se ne vanno più in fretta di quanto arrivino nuovi veneziani, ma le case ora sono pronte per chi verrà':' – i morti sono più dei nati, e troppo pochi giovani vengono a vivere qui'}.`)
    :t(`Den historiska staden har ${pop} invånare, ungefär lika många som 2026.`,`The historic city has ${pop} residents, about as many as in 2026.`,`La città storica ha ${pop} abitanti, più o meno quanti nel 2026.`),
    now?t('37,4 % av bostäderna har ingen folkbokförd boende, och sedan 2023–2024 finns det fler turistbäddar än invånare; i kommunen står 2 251 hushåll i kö till allmännyttan, medan omkring 2 900 offentliga bostäder står tomma i väntan på renovering.',
        '37.4% of homes have no registered resident, and since 2023–2024 there have been more tourist beds than residents; in the municipality 2,251 households are waiting for public housing, while about 2,900 public homes stand empty awaiting renovation.',
        'Il 37,4% delle abitazioni non ha residenti, e dal 2023–2024 i posti letto turistici superano gli abitanti; nel Comune 2251 famiglie sono in graduatoria per una casa popolare, mentre circa 2900 alloggi pubblici restano vuoti in attesa di ristrutturazione.')
    :home>L3?t(`Staden har getts tillbaka åt dem som bor här: de flesta bostäder är hem igen – bara ${pct(d.emptyHomes)} står utan folkbokförd boende${was(pct(d0.emptyHomes))} – och varje campo har ett gemensamt kök.`,
        `The city has been given back to the people who live here: most homes are homes again – only ${pct(d.emptyHomes)} have no registered resident${was(pct(d0.emptyHomes))} – and every campo has a shared kitchen.`,
        `La città è tornata a chi la abita: quasi tutte le case sono di nuovo abitate – solo ${il(d.emptyHomes)}${pct(d.emptyHomes)} è senza residenti${was(pct(d0.emptyHomes))} – e ogni campo ha una cucina comune.`)
    :home>L2?t(`Korttidsuthyrningen har ett tak, och tomma palats och offentliga bostäder har blivit generationshus och studentbostäder; ${pct(d.emptyHomes)} av bostäderna står utan folkbokförd boende${was(pct(d0.emptyHomes))}.`,
        `Short-term lets have a ceiling, and empty palaces and public homes have become multi-generation houses and student housing; ${pct(d.emptyHomes)} of homes have no registered resident${was(pct(d0.emptyHomes))}.`,
        `Gli affitti brevi hanno un tetto, e palazzi vuoti e alloggi pubblici sono diventati case tra generazioni e residenze per studenti; ${il(d.emptyHomes)}${pct(d.emptyHomes)} delle abitazioni è senza residenti${was(pct(d0.emptyHomes))}.`)
    :home>L1?t(`Kommunens tomma bostäder har rustats upp och hyrts ut åt unga par och familjer, men ${pct(d.emptyHomes)} av bostäderna står fortfarande utan folkbokförd boende${was(pct(d0.emptyHomes))}.`,
        `The municipality's empty homes have been renovated and let to young couples and families, but ${pct(d.emptyHomes)} of homes still have no registered resident${was(pct(d0.emptyHomes))}.`,
        `Le case comunali vuote sono state ristrutturate e affittate a giovani coppie e famiglie, ma ${il(d.emptyHomes)}${pct(d.emptyHomes)} delle abitazioni è ancora senza residenti${was(pct(d0.emptyHomes))}.`)
    :t(`${pct(d.emptyHomes)} av bostäderna står utan folkbokförd boende${was(pct(d0.emptyHomes))}${d.emptyHomes>d0.emptyHomes+.01?', och för varje år blir fler lägenheter turistbostäder':''}.`,
        `${pct(d.emptyHomes)} of homes have no registered resident${was(pct(d0.emptyHomes))}${d.emptyHomes>d0.emptyHomes+.01?', and every year more flats become holiday lets':''}.`,
        `${Il(d.emptyHomes)}${pct(d.emptyHomes)} delle abitazioni è senza residenti${was(pct(d0.emptyHomes))}${d.emptyHomes>d0.emptyHomes+.01?', e ogni anno altri appartamenti diventano affitti turistici':''}.`),
    now?'':beds<.97?t(`Turistbäddarna är färre än invånarna igen: ${dec(beds,1)} per invånare (2026: 1,07).`,`Tourist beds are fewer than residents again: ${dec(beds,1)} per resident (2026: 1.07).`,`I posti letto turistici sono di nuovo meno degli abitanti: ${dec(beds,1)} per abitante (2026: 1,07).`)
      :t(`Det finns ${dec(beds,1)} turistbäddar per invånare (2026: 1,07)${beds>2?' – i gränderna kring Rialto och San Marco bor nästan ingen längre':''}.`,
        `There are ${dec(beds,1)} tourist beds per resident (2026: 1.07)${beds>2?' – hardly anyone lives in the alleys around Rialto and San Marco any more':''}.`,
        `Ci sono ${dec(beds,1)} posti letto turistici per abitante (2026: 1,07)${beds>2?' – nelle calli intorno a Rialto e San Marco non abita quasi più nessuno':''}.`),
    now?t('Över hälften av hushållen består av en enda person, och skolorna i centrum har 28,8 % färre elever än läsåret 2015/16.',
        'More than half of households are one person, and the schools in the centre have 28.8% fewer pupils than in the 2015/16 school year.',
        "Più di metà delle famiglie è composta da una sola persona, e le scuole del centro hanno il 28,8% di alunni in meno rispetto all'anno scolastico 2015/16.")
    :home>L2&&d.pop>d0.pop?t('Barnfamiljerna har kommit tillbaka: Scuola Armando Diaz i Castello är full igen, och om kvällarna leker barnen på Campo Santa Maria Formosa.',
        'Families with children have come back: the Scuola Armando Diaz in Castello is full again, and in the evenings children play in Campo Santa Maria Formosa.',
        'Le famiglie con bambini sono tornate: la scuola Armando Diaz a Castello è di nuovo piena, e la sera i bambini giocano in campo Santa Maria Formosa.')
    :d.pop<d0.pop*.8?t('Skolorna i centrum har fått slå ihop klasser och stänga, och allt fler av dem som bor kvar är gamla och bor ensamma.',
        'The schools in the centre have had to merge classes and close, and more and more of those who remain are old and live alone.',
        'Le scuole del centro hanno dovuto accorpare le classi e chiudere, e sempre più di quelli che restano sono anziani e vivono soli.'):'',
  ].filter(Boolean).join(' ')});

  // The visitors: day visitors and the access fee, guest nights, the train (research/deep/turism-ekonomi,
  // energi-resor; levers.js besok and forbindelser).
  const visit=lvl('besok'),rail=lvl('forbindelser'),rt=railText(d.railMain),rt0=rt===railText(d0.railMain)?'':was(railText(d0.railMain));
  const fee=visit>L3?t(' – besöken bokas i förväg, och staden tar aldrig emot fler än den bär',' – visits are booked in advance, and the city never takes in more than it can carry',' – le visite si prenotano in anticipo, e la città non accoglie mai più di quanto possa sostenere')
    :visit>L2?t(' – den som vill komma bokar, och de mest trängda dagarna har ett tak',' – those who want to come book ahead, and the most crowded days have a cap',' – chi vuole venire prenota, e i giorni più affollati hanno un tetto')
    :visit>L1?t(' – inträdesavgift och bokning gäller alla högsäsongsdagar',' – the access fee and booking apply on every high-season day',' – contributo di accesso e prenotazione valgono in tutti i giorni di alta stagione')
    :t(' – inträdesavgiften gäller fortfarande bara omkring 60 dagar om året',' – the access fee still applies on only about 60 days a year'," – il contributo di accesso vale ancora solo una sessantina di giorni l'anno");
  const crowd=d.visitorsPerResident>3?t(' – på broarna kring Rialto och San Marco är invånarna sällsynta',' – on the bridges around Rialto and San Marco, residents are rare',' – sui ponti intorno a Rialto e San Marco i residenti sono rari')
    :!now&&d.visitorsPerResident<1.2?t(' – Venedig är en stad att bo i igen, som besökarna delar med venetianerna',' – Venice is a city to live in again, which the visitors share with the Venetians',' – Venezia è di nuovo una città da abitare, che i visitatori condividono con i veneziani'):'';
  S.push({title:t('Besökarna','The visitors','I visitatori'),text:[
    now?t(`En vanlig dag kommer i snitt ${int(d.dayVisitors)} dagsbesökare – den största dagen 2022 var 143 246 besökare i staden, omkring tre per invånare – och en studie har satt stadens bärkraft till omkring 52 000 besökare om dagen.`,
        `On an ordinary day an average of ${int(d.dayVisitors)} day visitors come – on the busiest day of 2022, 143,246 visitors were in the city, about three per resident – and a study has put the city's carrying capacity at about 52,000 visitors a day.`,
        `In un giorno qualunque arrivano in media ${int(d.dayVisitors)} visitatori giornalieri – nel giorno di punta del 2022 in città c'erano 143.246 visitatori, circa tre per abitante – e uno studio ha stimato la capacità di carico della città in circa 52.000 visitatori al giorno.`)
    :t(`En vanlig dag kommer ${int(near(d.dayVisitors,100))} dagsbesökare${was(int(d0.dayVisitors))}${fee}.`,
        `On an ordinary day ${int(near(d.dayVisitors,100))} day visitors come${was(int(d0.dayVisitors))}${fee}.`,
        `In un giorno qualunque arrivano ${int(near(d.dayVisitors,100))} visitatori giornalieri${was(int(d0.dayVisitors))}${fee}.`),
    t(`En vanlig dag går det ${dec(d.visitorsPerResident,1)} besökare på varje invånare${was(dec(d0.visitorsPerResident,1))}${crowd}.`,
      `On an ordinary day there are ${dec(d.visitorsPerResident,1)} visitors for every resident${was(dec(d0.visitorsPerResident,1))}${crowd}.`,
      `In un giorno qualunque ci sono ${dec(d.visitorsPerResident,1)} visitatori per ogni abitante${was(dec(d0.visitorsPerResident,1))}${crowd}.`),
    now?t(`Besökarna stannar ${mn(d.guestNights,2)} nätter om året i den historiska staden och på öarna – nio av tio är utländska gäster – och korttidsuthyrda bostäder tog 31,5 % av ankomsterna 2025, mot 19,4 % 2019.`,
        `Visitors stay ${mn(d.guestNights,2)} nights a year in the historic city and on the islands – nine in ten are foreign guests – and short-term lets took 31.5% of arrivals in 2025, against 19.4% in 2019.`,
        `I visitatori trascorrono ${mn(d.guestNights,2)} di notti all'anno nella città storica e nelle isole – nove su dieci sono stranieri – e gli affitti brevi hanno accolto il 31,5% degli arrivi nel 2025, contro il 19,4% del 2019.`)
    :t(`Besökarna stannar ${mn(d.guestNights)} nätter om året${was(mn(d0.guestNights))}.`,`Visitors stay ${mn(d.guestNights)} nights a year${was(mn(d0.guestNights))}.`,`I visitatori trascorrono ${mn(d.guestNights)} di notti all'anno${was(mn(d0.guestNights))}.`),
    rail>L3?t(`De flesta besökare kommer med tåg – Venedig är Europas tågstad – och tåget tar ${rt} till Rom${rt0}.`,`Most visitors arrive by train – Venice is Europe's railway city – and the train takes ${rt} to Rome${rt0}.`,`La maggior parte dei visitatori arriva in treno – Venezia è la città dei treni d'Europa – e il treno impiega ${rt} fino a Roma${rt0}.`)
    :rail>L2?t(`Snabbare tåg tar ${rt} till Rom${rt0}, och nattåg går norrut över Alperna.`,`Faster trains take ${rt} to Rome${rt0}, and night trains run north over the Alps.`,`Treni più veloci impiegano ${rt} fino a Roma${rt0}, e treni notturni partono verso nord oltre le Alpi.`)
    :rail>L1?t(`Regionaltågen går tätare, och tåget tar ${rt} till Rom${rt0}.`,`Regional trains run more often, and the train takes ${rt} to Rome${rt0}.`,`I treni regionali sono più frequenti, e il treno impiega ${rt} fino a Roma${rt0}.`)
    :now?t(`Det snabbaste tåget tar ${rt} till Rom och 2 h 27 till Milano, och flygplatsen Marco Polo hade 11,9 miljoner passagerare 2025.`,`The fastest train takes ${rt} to Rome and 2 h 27 to Milan, and Marco Polo airport had 11.9 million passengers in 2025.`,`Il treno più veloce impiega ${rt} fino a Roma e 2 h 27 fino a Milano, e l'aeroporto Marco Polo ha avuto 11,9 milioni di passeggeri nel 2025.`)
    :t(`Tåget tar ${rt} till Rom${rt0}.`,`The train takes ${rt} to Rome${rt0}.`,`Il treno impiega ${rt} fino a Roma${rt0}.`),
    now?t('Sedan 2021 får stora kryssningsfartyg inte gå genom San Marco-bassängen och Giudeccakanalen, och kryssningspassagerarna minskade från 1,6 miljoner 2019 till 0,57 miljoner 2025.',
        'Since 2021 large cruise ships may not pass through the San Marco basin and the Giudecca canal, and cruise passengers fell from 1.6 million in 2019 to 0.57 million in 2025.',
        'Dal 2021 le grandi navi da crociera non possono più passare per il bacino di San Marco e il canale della Giudecca, e i crocieristi sono scesi da 1,6 milioni nel 2019 a 0,57 milioni nel 2025.'):'',
  ].filter(Boolean).join(' ')});

  // The sea and MOSE: the mean level and the 100-year tide on the tide gauge's zero, the barriers that close ever
  // more often, the raised quays round St Mark's, the drinking water from the mainland (research/deep/hav-tidvatten,
  // lagun-natur-mat; model.js FLOOD and LOCAL; levers.js anpassning and beredskap).
  const adapt=lvl('anpassning'),mean=MEAN+d.seaRise,lift=Math.max(0,d.barrierCloses-FLOOD.barrier.closes),eff=d.seaRise-lift;
  const daily=eff>.75?t('lagunen är oftare stängd än öppen mot havet','the lagoon is more often closed to the sea than open','la laguna è più spesso chiusa che aperta al mare')
    :t('i snitt en gång om dygnet','on average once a day','in media una volta al giorno');
  const margin=cm(d.floodMargin)>=2,same=Math.abs(d.floodShare-d0.floodShare)<.005,rialto=d.levelInside>=1.05;   // Rialto floods from 105 cm
  S.push({title:t('Havet och MOSE','The sea and MOSE','Il mare e il MOSE'),text:[
    now?t(`Medelvattnet vid Punta della Salute står ${cm(MEAN)} cm över mareografens nolla från 1897 och stiger 4,8 mm om året, och ett hundraårshögvatten når uppskattningsvis ${cm(d.level100)} cm.`,
        `The mean sea level at Punta della Salute stands ${cm(MEAN)} cm above the tide gauge's 1897 zero and rises 4.8 mm a year, and a 100-year high tide reaches an estimated ${cm(d.level100)} cm.`,
        `Il livello medio del mare a Punta della Salute è ${cm(MEAN)} cm sopra lo zero mareografico del 1897 e sale di 4,8 mm l'anno, e un'acqua alta centenaria raggiunge circa ${cm(d.level100)} cm.`)
    :t(`Havet står ${cm(d.seaRise)} cm högre än 2026: medelvattnet vid Punta della Salute ligger på ${cm(mean)} cm, och ett hundraårshögvatten når ${cm(d.level100)} cm (2026: ${cm(MEAN)} och uppskattningsvis ${cm(d0.level100)} cm).`,
        `The sea stands ${cm(d.seaRise)} cm higher than in 2026: the mean level at Punta della Salute is ${cm(mean)} cm, and a 100-year high tide reaches ${cm(d.level100)} cm (2026: ${cm(MEAN)} and an estimated ${cm(d0.level100)} cm).`,
        `Il mare è ${cm(d.seaRise)} cm più alto che nel 2026: il livello medio a Punta della Salute è di ${cm(mean)} cm, e un'acqua alta centenaria raggiunge ${cm(d.level100)} cm (2026: ${cm(MEAN)} e circa ${cm(d0.level100)} cm).`),
    !now&&mean>FLOOD.streets?t(`Medelvattnet står nu högre än Markusplatsens stenar, och ${pct(under(mean))} av stadens gångytor ligger lägre: utan skydd skulle torget stå under vatten varje dag.`,
        `The mean level now stands above the stones of St Mark's Square, and ${pct(under(mean))} of the city's walkways lie lower: without protection the square would be under water every day.`,
        `Il livello medio è ormai più alto del selciato di piazza San Marco, e ${il(under(mean))}${pct(under(mean))} dei percorsi pedonali della città è più in basso: senza difese la piazza sarebbe sott'acqua ogni giorno.`):'',
    now?t('MOSE stängdes 49 gånger säsongen 2025/26, fast barriärerna byggdes för 3–5 stängningar om året och för 60 cm högre hav. De reses när tidvatten över 110 cm väntas – mellan 80 och 110 cm står de öppna, och då svämmar Markusplatsen över.',
        "MOSE closed 49 times in the 2025/26 season, although the barriers were built for 3–5 closures a year and for a sea 60 cm higher. They are raised when a tide above 110 cm is expected – between 80 and 110 cm they stay open, and then St Mark's Square floods.",
        "Il MOSE si è chiuso 49 volte nella stagione 2025/26, anche se le barriere erano state progettate per 3–5 chiusure l'anno e per un mare più alto di 60 cm. Si alzano quando è prevista una marea oltre i 110 cm – tra 80 e 110 cm restano aperte, e piazza San Marco si allaga.")
    :d.moseClosures>=300?t(`MOSE reser sig vid nästan varje högvatten – ${daily}${lift>.05?', fast höjda kajer låter barriärerna vänta längre innan de reses':''}.`,
        `MOSE rises at almost every high tide – ${daily}${lift>.05?', although raised quays let the barriers wait longer before they rise':''}.`,
        `Il MOSE si alza quasi a ogni alta marea – ${daily}${lift>.05?', anche se le rive rialzate permettono alle barriere di aspettare più a lungo prima di alzarsi':''}.`)
    :t(`MOSE stängs ${int(d.moseClosures)} gånger om året${was(int(d0.moseClosures))}${lift>.05?' – höjda kajer och gator låter barriärerna vänta längre innan de reses':' och reses fortfarande när tidvatten över 110 cm väntas'}.`,
        `MOSE closes ${int(d.moseClosures)} times a year${was(int(d0.moseClosures))}${lift>.05?' – raised quays and streets let the barriers wait longer before they rise':' and still rises whenever a tide above 110 cm is expected'}.`,
        `Il MOSE si chiude ${int(d.moseClosures)} volte l'anno${was(int(d0.moseClosures))}${lift>.05?' – rive e calli rialzate permettono alle barriere di aspettare più a lungo prima di alzarsi':' e si alza ancora ogni volta che è prevista una marea oltre i 110 cm'}.`),
    !now&&d.seaRise>.6?t('Havet har stigit mer än de 60 cm som barriärerna byggdes för, och varje stängning stänger ute havets vatten och slam, så att lagunen blir varmare och mer instängd.',
        "The sea has risen more than the 60 cm the barriers were built for, and every closure shuts out the sea's water and silt, leaving the lagoon warmer and more enclosed.",
        "Il mare è salito più dei 60 cm per cui le barriere erano state progettate, e ogni chiusura tiene fuori l'acqua e i sedimenti del mare, lasciando la laguna più calda e più chiusa."):'',
    !now&&d.levelInside>FLOOD.barrier.inside+.04?t(`Bakom de stängda barriärerna stiger lagunen ändå med floderna, regnet och läckaget: vid ett hundraårshögvatten står vattnet kring ${cm(d.levelInside)} cm i staden.`,
        `Behind the closed barriers the lagoon still rises with the rivers, the rain and the leaks: in a 100-year high tide the water in the city stands at about ${cm(d.levelInside)} cm.`,
        `Dietro le barriere chiuse la laguna sale comunque con i fiumi, la pioggia e le infiltrazioni: con un'acqua alta centenaria in città l'acqua arriva a circa ${cm(d.levelInside)} cm.`):'',
    now?'':adapt>L3?t('Staden växer med havet: gator och kajer har höjts, bottenvåningarna har blivit förråd, verkstäder och båthus, och livet har flyttat en trappa upp.',
        'The city grows with the sea: streets and quays have been raised, the ground floors have become stores, workshops and boathouses, and life has moved one floor up.',
        'La città cresce con il mare: calli e rive sono state rialzate, i piani terra sono diventati magazzini, laboratori e cavane, e la vita si è spostata di un piano più su.')
    :adapt>L2?t('Gatorna har höjts mot 1,20 m där trösklarna tillåter, och bottenvåningarna har gjorts om så att de tål vatten.',
        'The streets have been raised towards 1.20 m where the doorsteps allow, and the ground floors have been rebuilt to withstand water.',
        "Le calli sono state rialzate verso 1,20 m dove le soglie lo consentono, e i piani terra sono stati rifatti per reggere l'acqua.")
    :adapt>L1?t('Kajerna har höjts, och en låg kant av istrisk sten håller Markusplatsen och basilikan torra.',
        "The quays have been raised, and a low edge of Istrian stone keeps St Mark's Square and the basilica dry.",
        "Le rive sono state rialzate, e un basso bordo di pietra d'Istria tiene asciutte piazza San Marco e la basilica.")
    :t('Kajerna är lika låga som 2026, och vid tidvatten över 80 cm står Markusplatsen fortfarande under vatten.',
        "The quays are as low as in 2026, and at tides above 80 cm St Mark's Square is still under water.",
        "Le rive sono basse come nel 2026, e con maree oltre gli 80 cm piazza San Marco finisce ancora sott'acqua."),
    d.floodShare>.005?(now?t(`Med MOSE uppe stannar vattnet i staden uppskattningsvis kring ${cm(d.levelInside)} cm även när havet utanför stiger mot två meter – men det räcker för att Markusplatsen och ${pct(d.floodShare)} av gångytorna ska stå under vatten.`,
        `With MOSE up, the water in the city stays at an estimated ${cm(d.levelInside)} cm even when the sea outside rises towards two metres – but that is enough to put St Mark's Square and ${pct(d.floodShare)} of the walkways under water.`,
        `Con il MOSE alzato l'acqua in città resta intorno ai ${cm(d.levelInside)} cm anche quando il mare fuori sale verso i due metri – ma basta perché piazza San Marco e ${il(d.floodShare)}${pct(d.floodShare)} dei percorsi pedonali finiscano sott'acqua.`)
      :t(`Ett hundraårshögvatten sätter ${pct(d.floodShare)} av stadens gångytor under vatten${same?', som 2026':was(pct(d0.floodShare))} – ${rialto?'Markusplatsen och Rialto':'Markusplatsen'} först.`,
        `A 100-year high tide puts ${pct(d.floodShare)} of the city's walkways under water${same?', as in 2026':was(pct(d0.floodShare))} – ${rialto?"St Mark's Square and Rialto":"St Mark's Square"} first.`,
        `Un'acqua alta centenaria allaga ${il(d.floodShare)}${pct(d.floodShare)} dei percorsi pedonali della città${same?', come nel 2026':was(pct(d0.floodShare))} – per prima ${rialto?'piazza San Marco, poi Rialto':'piazza San Marco'}.`))
    :d.protection>d0.protection+.05?t(`Staden står torr upp till ${cm(d.protection)} cm${margin?` – ${cm(d.floodMargin)} cm över det vatten som ett hundraårshögvatten lämnar bakom barriärerna`:', med knapp marginal'}.`,
        `The city stays dry up to ${cm(d.protection)} cm${margin?` – ${cm(d.floodMargin)} cm above the water a 100-year high tide leaves behind the barriers`:', with little to spare'}.`,
        `La città resta asciutta fino a ${cm(d.protection)} cm${margin?` – ${cm(d.floodMargin)} cm sopra l'acqua che un'acqua alta centenaria lascia dietro le barriere`:', con un margine minimo'}.`):'',
    // Adaptation costs at most heritageCost × its implementation (model.js); anything more is salt water that got in.
    d.heritage<1-(PARAMS.heritageCost||0)*adapt-.01?t('Saltvattnet har tagit hårt på kulturarvet: det har ätit sig upp i murarna, och flera bottenvåningar har övergetts.',
        'The salt water has been hard on the heritage: it has crept up into the walls, and several ground floors have been abandoned.',
        "L'acqua salata ha colpito duramente il patrimonio: è risalita nei muri, e diversi piani terra sono stati abbandonati.")
    :d.heritage<.985?t('Världsarvet står kvar, men höjda kajer och nya trösklar har förändrat stadens möte med vattnet.',
        'The World Heritage still stands, but raised quays and new doorsteps have changed the way the city meets the water.',
        "Il patrimonio mondiale resta intatto, ma rive rialzate e nuove soglie hanno cambiato l'incontro della città con l'acqua.")
    :now?t('Markuskyrkans förhall, stadens lägsta golv på 63 cm, stod under vatten mer än 200 gånger om året innan en barriär av glas byggdes runt kyrkan 2022.',
        "The narthex of St Mark's, the city's lowest floor at 63 cm, was under water more than 200 times a year until a glass barrier was built round the church in 2022.",
        "Il nartece della basilica di San Marco, il pavimento più basso della città a 63 cm, finiva sott'acqua più di 200 volte l'anno, finché nel 2022 è stata costruita una barriera di vetro intorno alla chiesa."):'',
    now?t('Dricksvattnet pumpas ur 34 djupa brunnar på fastlandet, och 41,7 % av vattnet i kommunens nät försvinner i läckor.',
        "Drinking water is pumped from 34 deep wells on the mainland, and 41.7% of the water in the municipality's network is lost to leaks.",
        "L'acqua potabile viene pompata da 34 pozzi profondi in terraferma, e il 41,7% dell'acqua della rete comunale si perde per strada.")
    :d.waterMargin<0?t(`Ett torrt år räcker inte vattnet: brunnarna på fastlandet ger ${pct(-d.waterMargin)} mindre än staden behöver.`,
        `In a dry year the water runs short: the wells on the mainland give ${pct(-d.waterMargin)} less than the city needs.`,
        `In un anno secco l'acqua non basta: i pozzi in terraferma danno ${il(-d.waterMargin)}${pct(-d.waterMargin)} in meno di quanto serve alla città.`):'',
    lvl('beredskap')>L3?t('Staden klarar sig själv i en kris: mat, vatten och energi räcker i 90 dagar, och elnätet kan köras i ö-drift.',
        'The city can manage on its own in a crisis: food, water and energy last 90 days, and the grid can run in island mode.',
        'In caso di crisi la città se la cava da sola: cibo, acqua ed energia bastano per 90 giorni, e la rete elettrica può funzionare in isola.')
    :lvl('beredskap')>L2?t('En andra vattenkälla, lager för en månad och ett elnät som kan köras i ö-drift gör staden mindre sårbar om ledningarna från fastlandet går sönder.',
        'A second water source, stocks for a month and a grid that can run in island mode make the city less vulnerable if the lines from the mainland fail.',
        "Una seconda fonte d'acqua, scorte per un mese e una rete elettrica che può funzionare in isola rendono la città meno vulnerabile se le linee dalla terraferma si interrompono.")
    :lvl('beredskap')>L1?t('Kommunen har nödlager och en plan för nödvatten.','The municipality has emergency stocks and an emergency water plan.',"Il Comune ha scorte di emergenza e un piano per l'acqua d'emergenza."):'',
    t(`${now?'Uppskattningsvis ':''}${pct(d.homePrepared)} av hushållen klarar en vecka på egen hand${was(pct(d0.homePrepared))}.`,`${now?'An estimated ':''}${pct(d.homePrepared)} of households can manage a week on their own${was(pct(d0.homePrepared))}.`,`${now?`Si stima che ${il(d.homePrepared)}`:Il(d.homePrepared)}${pct(d.homePrepared)} delle famiglie ${now?'possa':'può'} cavarsela da sé per una settimana${was(pct(d0.homePrepared))}.`),
  ].filter(Boolean).join(' ')});

  // The lagoon and its food: the salt marshes, the water's status, the Rialto market and the islands' gardens
  // (research/deep/lagun-natur-mat; model.js LOCAL saltMarsh; levers.js hav, regionalt, stadsodling, kost).
  const hav=lvl('hav'),food=lvl('regionalt'),days=Math.round(d.foodStockDays),days0=Math.round(d0.foodStockDays),marsh=int(d.saltMarsh);
  S.push({title:t('Lagunen och maten','The lagoon and food','La laguna e il cibo'),text:[
    now?t('Lagunen har omkring 40 km² saltängar kvar av 158 km² år 1912, och ungefär en halv kvadratkilometer går förlorad varje år när sedimentet försvinner ut i havet.',
        'The lagoon has about 40 km² of salt marsh left of 158 km² in 1912, and about half a square kilometre is lost every year as the sediment escapes to the sea.',
        'La laguna conserva circa 40 km² di barene dei 158 km² del 1912, e ogni anno ne perde circa mezzo chilometro quadrato, mentre i sedimenti finiscono in mare.')
    :d.saltMarsh<1?t('Saltängarna är borta: lagunen har blivit en grund havsvik där vågorna rör upp bottnen.',
        'The salt marshes are gone: the lagoon has become a shallow bay of the sea where the waves stir up the bottom.',
        'Le barene sono scomparse: la laguna è diventata un braccio di mare poco profondo dove le onde sollevano il fondale.')
    :d.saltMarsh>d0.saltMarsh+3?t(`Lagunen har ${marsh} km² saltängar (2026: omkring 40). De har byggts upp med muddrat sediment och slam som får komma in från havet${hav>L3?', och nu växer de i takt med havet':''}; de dämpar vågorna, binder kol och ger fåglarna platser att häcka.`,
        `The lagoon has ${marsh} km² of salt marsh (2026: about 40). They have been built up with dredged sediment and silt let in from the sea${hav>L3?', and now they grow with the sea':''}; they calm the waves, store carbon and give the birds places to nest.`,
        `La laguna ha ${marsh} km² di barene (2026: circa 40). Sono state ricostruite con i fanghi di dragaggio e con il sedimento che può di nuovo entrare dal mare${hav>L3?', e ora crescono con il mare':''}; smorzano le onde, trattengono carbonio e offrono agli uccelli posti dove nidificare.`)
    :d.saltMarsh<d0.saltMarsh-3&&hav>L1?t(`Lagunen har ${marsh} km² saltängar kvar (2026: omkring 40): de nya som byggs av muddrat sediment hinner ännu inte ikapp dem som havet tar.`,
        `The lagoon has ${marsh} km² of salt marsh left (2026: about 40): the new ones built from dredged sediment have not yet caught up with those the sea takes.`,
        `In laguna restano ${marsh} km² di barene (2026: circa 40): le nuove costruite con i fanghi di dragaggio non tengono ancora il passo con quelle che il mare si porta via.`)
    :d.saltMarsh<d0.saltMarsh-3?t(`Lagunen har ${marsh} km² saltängar kvar (2026: omkring 40) – det stigande havet och de allt oftare stängda barriärerna dränker dem.`,
        `The lagoon has ${marsh} km² of salt marsh left (2026: about 40) – the rising sea and the ever more often closed barriers are drowning them.`,
        `In laguna restano ${marsh} km² di barene (2026: circa 40) – il mare che sale e le barriere sempre più spesso chiuse le stanno sommergendo.`)
    :t(`Lagunen har omkring ${marsh} km² saltängar, ungefär som 2026: de nya som byggs väger knappt upp dem som försvinner.`,
        `The lagoon has about ${marsh} km² of salt marsh, much as in 2026: the new ones being built barely make up for those being lost.`,
        `La laguna ha circa ${marsh} km² di barene, più o meno come nel 2026: le nuove compensano appena quelle che scompaiono.`),
    d.waters>=.85&&hav>L2?t('Lagunens vattenområden har nått god ekologisk status, som EU:s vattendirektiv kräver, och sjögräsängarna breder ut sig igen.',
        "The lagoon's water bodies have reached good ecological status, as the EU Water Framework Directive requires, and the seagrass meadows are spreading again.",
        'I corpi idrici della laguna hanno raggiunto il buono stato ecologico richiesto dalla direttiva europea sulle acque, e le praterie di fanerogame tornano ad allargarsi.')
    :d.waters>=.6?t('Lagunen är på väg mot god ekologisk status (2026: inget av elva vattenområden).','The lagoon is on its way to good ecological status (2026: none of eleven water bodies).','La laguna è sulla strada del buono stato ecologico (2026: nessuno degli undici corpi idrici).')
    :d.waters>=d0.waters-.03?(now?t('Inget av lagunens elva klassade vattenområden har god ekologisk status, och inget av fjorton har god kemisk status.',
          "None of the lagoon's eleven classified water bodies has good ecological status, and none of fourteen has good chemical status.",
          'Nessuno degli undici corpi idrici classificati della laguna è in buono stato ecologico, e nessuno dei quattordici in buono stato chimico.')
      :hav>L1?t('Lagunens ekologiska status är fortfarande inte god – den svarar långsamt.',"The lagoon's ecological status is still not good – it responds slowly.",'Lo stato ecologico della laguna non è ancora buono – risponde lentamente.')
      :t('Inget av lagunens vattenområden har god ekologisk status, lika lite som 2026.',"None of the lagoon's water bodies has good ecological status, just as in 2026.",'Nessuno dei corpi idrici della laguna è in buono stato ecologico, proprio come nel 2026.'))
    :t('Lagunen mår sämre än 2026: varmare vatten och barriärer som stängs allt oftare gör den instängd.','The lagoon is in worse health than in 2026: warmer water and barriers that close ever more often leave it enclosed.','La laguna sta peggio che nel 2026: acque più calde e barriere sempre più spesso chiuse la rendono asfittica.'),
    !now&&d.bloom>.3?t('Varma somrar blommar alger i de grunda, instängda delarna av lagunen.','In warm summers algae bloom in the shallow, enclosed parts of the lagoon.','Nelle estati calde le alghe fioriscono nelle parti più basse e chiuse della laguna.'):'',
    now?t('Omkring 24 000 flamingor övervintrade i lagunen 2025.','Some 24,000 flamingos wintered in the lagoon in 2025.',"Nell'inverno 2025 in laguna hanno svernato circa 24.000 fenicotteri.")
    :d.biodiversity>d0.biodiversity+.2?t('Fiskar, fåglar och sjögräs har kommit tillbaka till de lugnare vattnen.','Fish, birds and seagrass have returned to the calmer waters.','Pesci, uccelli e fanerogame sono tornati nelle acque più calme.'):'',
    t(`${now?'Uppskattningsvis ':''}${pct(d.foodRegional)} av maten som venetianerna äter kommer från lagunen och Veneto${was(pct(d0.foodRegional))}.`,
      `${now?'An estimated ':''}${pct(d.foodRegional)} of the food Venetians eat comes from the lagoon and the Veneto${was(pct(d0.foodRegional))}.`,
      `${now?`Si stima che ${il(d.foodRegional)}`:Il(d.foodRegional)}${pct(d.foodRegional)} del cibo che mangiano i veneziani ${now?'venga':'viene'} dalla laguna e dal Veneto${was(pct(d0.foodRegional))}.`),
    food>L3?t(`Lagunens matråd bestämmer vad som odlas, fiskas och lagras, och staden har mat i lager för ${days} dagar${was(days0)}.`,
        `A lagoon food council decides what is grown, fished and stored, and the city keeps food in store for ${days} days${was(days0)}.`,
        `Un consiglio del cibo della laguna decide cosa coltivare, pescare e conservare, e la città ha scorte di cibo per ${days} giorni${was(days0)}.`)
    :food>L2?t("Rialtomarknaden lever igen: kronärtskockor från Sant'Erasmo, musslor och fisk från lagunen och fiskevallarna, och grönsaker från altanerna.",
        "The Rialto market is alive again: artichokes from Sant'Erasmo, clams and fish from the lagoon and its fish farms, and vegetables from the roof terraces.",
        "Il mercato di Rialto è tornato a vivere: carciofi di Sant'Erasmo, vongole e pesce della laguna e delle valli da pesca, e ortaggi dalle altane.")
    :food>L1?t('Skolornas och äldreboendenas kök köper sin mat av lagunöarnas odlare och fiskare.',"The kitchens of schools and care homes buy their food from the lagoon islands' growers and fishermen.",'Le cucine di scuole e case di riposo comprano il cibo dagli ortolani e dai pescatori delle isole della laguna.')
    :now?t('Rialtomarknaden har sju fiskstånd kvar av ett trettiotal på 1980-talet, och musselskörden föll från omkring 40 000 ton 1999 till under 3 000 ton 2019.',
        'The Rialto market has seven fish stalls left of some thirty in the 1980s, and the clam harvest fell from about 40,000 tonnes in 1999 to under 3,000 tonnes in 2019.',
        'Al mercato di Rialto restano sette banchi del pesce dei circa trenta degli anni Ottanta, e la raccolta di vongole è scesa da circa 40.000 tonnellate nel 1999 a meno di 3000 nel 2019.')
    :t('Rialtomarknaden har krympt ytterligare, och nästan all mat kommer över bron från fastlandet.','The Rialto market has shrunk further, and almost all the food comes over the bridge from the mainland.','Il mercato di Rialto si è ridotto ancora, e quasi tutto il cibo arriva dalla terraferma attraverso il ponte.'),
    food>L3?'':t(`Staden har mat i lager för ${now?'uppskattningsvis ':''}${days} dagar${was(days0)}.`,`The city keeps food in store for ${now?'an estimated ':''}${days} days${was(days0)}.`,`La città ha scorte di cibo per ${now?'circa ':''}${days} giorni${was(days0)}.`),
    lvl('stadsodling')>L2?t(`Klostrens och palatsens trädgårdar odlas, och växthus står på altanerna: staden odlar ${pct(d.cityVeg)} av sin egen frukt och sina grönsaker.`,
        `The gardens of the cloisters and palaces are cultivated, and greenhouses stand on the roof terraces: the city grows ${pct(d.cityVeg)} of its own fruit and vegetables.`,
        `Si coltivano i giardini dei chiostri e dei palazzi, e sulle altane ci sono serre: la città produce ${il(d.cityVeg)}${pct(d.cityVeg)} della frutta e della verdura che consuma.`)
    :lvl('stadsodling')>L1?t('Odlingslådor står i gårdarna och på skolornas tak, men staden odlar fortfarande bara en liten del av det den äter.','There are planter boxes in the courtyards and on school roofs, but the city still grows only a small part of what it eats.','Ci sono cassoni da orto nelle corti e sui tetti delle scuole, ma la città produce ancora solo una piccola parte di ciò che mangia.'):'',
    lvl('kost')>L2?t('Skolor och äldreboenden lagar säsongens mat – baljväxter, grönsaker och lagunens fisk – och svinnet är nästan borta.',"Schools and care homes cook the season's food – pulses, vegetables and fish from the lagoon – and food waste has almost disappeared.",'Scuole e case di riposo cucinano i prodotti di stagione – legumi, verdure e pesce della laguna – e lo spreco è quasi scomparso.')
    :lvl('kost')>L1?t('Mer av maten i skolor och äldreboenden är växtbaserad.','More of the food in schools and care homes is plant-based.',"Nelle mense di scuole e case di riposo c'è più cibo vegetale."):'',
  ].filter(Boolean).join(' ')});

  // Boats, energy and climate: the vaporetti and the wakes, solar on the old roofs, wind off the Lido, gas heating,
  // the city's own emissions and its visitors' (research/deep/energi-resor; levers.js kollektivt, sol, vind, effektivitet).
  const boats=lvl('kollektivt'),le=d.localEnergy;
  const share=le>1.5?t(`${dec(le,1)} gånger så mycket el som staden använder`,`${dec(le,1)} times as much electricity as the city uses`,`${dec(le,1)} volte l'elettricità che la città consuma`)
    :le>1.02?t('mer el än staden använder','more electricity than the city uses','più elettricità di quella che la città consuma')
    :le>=.98?t('ungefär lika mycket el som staden använder','about as much electricity as the city uses',"più o meno tutta l'elettricità che la città consuma")
    :t(`${pct(le)} av den el staden använder`,`${pct(le)} of the electricity the city uses`,`${il(le)}${pct(le)} dell'elettricità che la città consuma`);
  const quiet=boats>L3?t(' – kanalerna är tysta: vaporetti, taxibåtar och transportbåtar går på el, och transporterna delas',' – the canals are quiet: vaporetti, water taxis and delivery boats run on electricity, and transport is shared',' – i canali sono silenziosi: vaporetti, taxi acquei e barche da trasporto vanno a elettricità, e i trasporti si condividono')
    :boats>L2?t(' – vattenbussarna laddar vid bryggorna, och på Canal Grande hörs gondolernas åror igen'," – the vaporetti charge at the landing stages, and on the Grand Canal the gondolas' oars can be heard again",' – i vaporetti si ricaricano agli imbarcaderi, e sul Canal Grande si sentono di nuovo i remi delle gondole')
    :boats>L1?t(' – på Canal Grande går hybridbåtar',' – hybrid boats run on the Grand Canal',' – sul Canal Grande navigano barche ibride'):'';
  const ratio=d.tourismCO2/Math.max(1,d.ghg*d.pop);
  S.push({title:t('Båtar, energi och klimat','Boats, energy and climate','Barche, energia e clima'),text:[
    now?t('Vattenbussarna och de flesta andra båtar går på diesel – ACTV har en enda hybridvaporetto av 148 båtar – och båtar och fartyg står för nästan hälften av kommunens kväveoxider.',
        "The vaporetti and most other boats run on diesel – ACTV has a single hybrid vaporetto among 148 boats – and boats and ships produce almost half of the municipality's nitrogen oxides.",
        'I vaporetti e quasi tutte le altre barche vanno a gasolio – ACTV ha un solo vaporetto ibrido su 148 mezzi – e barche e navi producono quasi metà degli ossidi di azoto del Comune.')
    :t(`${pct(d.boatElectric)} av båttrafiken går på el${was(pct(d0.boatElectric))}${quiet}.`,`${pct(d.boatElectric)} of boat traffic is electric${was(pct(d0.boatElectric))}${quiet}.`,`${Il(d.boatElectric)}${pct(d.boatElectric)} del traffico acqueo va a elettricità${was(pct(d0.boatElectric))}${quiet}.`),
    !now&&boats>L2?(d.saltMarsh>=1?t('Svallvågorna har lagt sig, och kajmurarna och saltängarna nöts inte längre ner av motorbåtarna.','The wakes have settled, and the motorboats no longer wear down the quay walls and the salt marshes.','Il moto ondoso si è calmato, e i motoscafi non consumano più le rive e le barene.')
      :t('Svallvågorna har lagt sig, och kajmurarna nöts inte längre ner av motorbåtarna.','The wakes have settled, and the motorboats no longer wear down the quay walls.','Il moto ondoso si è calmato, e i motoscafi non consumano più le rive.')):'',
    now?t('Solpaneler är förbjudna på hus i den historiska staden byggda före 1945, så här produceras nästan ingen el – kommunens 59 MW solceller står nästan alla på fastlandet – och husen värms mest med gas.',
        "Solar panels are banned on buildings in the historic city built before 1945, so almost no electricity is produced here – nearly all the municipality's 59 MW of solar panels are on the mainland – and homes are heated mostly with gas.",
        'Nella città storica i pannelli solari sono vietati sugli edifici costruiti prima del 1945, quindi qui non si produce quasi elettricità – quasi tutti i 59 MW di fotovoltaico del Comune sono in terraferma – e le case si scaldano soprattutto a gas.')
    :t(`Solceller på ${Math.round(d.solarMW)} MW${d.windMW>=1?` och havsvind på ${Math.round(d.windMW)} MW`:''} ger ${share}${was(pct(d0.localEnergy))}.`,
        `${Math.round(d.solarMW)} MW of solar panels${d.windMW>=1?` and ${Math.round(d.windMW)} MW of offshore wind`:''} provide ${share}${was(pct(d0.localEnergy))}.`,
        `${Math.round(d.solarMW)} MW di fotovoltaico${d.windMW>=1?` e ${Math.round(d.windMW)} MW di eolico in mare`:''} forniscono ${share}${was(pct(d0.localEnergy))}.`),
    lvl('sol')>L3?t('Varje tak som tål dem bär solpaneler som liknar tegel, och el lagras i bottenvåningar som inte längre går att bo i.','Every roof that can bear them carries solar panels that look like tiles, and electricity is stored in ground floors that can no longer be lived in.',"Ogni tetto che può portarli ha pannelli solari simili ai coppi, e l'elettricità si accumula nei piani terra non più abitabili.")
    :lvl('sol')>L2?t('Soltegel är godkänt i hela staden, och energigemenskaper i varje sestiere delar solelen.','Solar tiles are approved throughout the city, and energy communities in every sestiere share the solar power.',"I coppi solari sono ammessi in tutta la città, e comunità energetiche in ogni sestiere si dividono l'energia del sole.")
    :lvl('sol')>L1?t('Kommunens och skolornas tak har fått solceller.',"The roofs of the municipality's buildings and the schools have solar panels.",'I tetti degli edifici comunali e delle scuole hanno pannelli solari.'):'',
    lvl('vind')>L2&&d.windMW>5?t(`Vindkraftsparken till havs utanför Lido ägs delvis av venetianerna${lvl('vind')>L3?', och vätgas från havsvinden driver hamnen och industrin på fastlandet':''}.`,
        `The offshore wind farm off the Lido is partly owned by Venetians${lvl('vind')>L3?', and hydrogen from the sea wind powers the port and the industry on the mainland':''}.`,
        `Il parco eolico al largo del Lido è in parte dei veneziani${lvl('vind')>L3?", e l'idrogeno prodotto dal vento del mare alimenta il porto e l'industria in terraferma":''}.`):'',
    lvl('effektivitet')>L3?t(`Venedig är fossilfritt: husen värms med värmepumpar på lagunvatten, allt som går att laga lagas, och ${d.recycling>=.97?'nästan allt avfall':`${pct(d.recycling)} av avfallet`} sorteras.`,
        `Venice is fossil-free: homes are heated by heat pumps using lagoon water, everything that can be repaired is repaired, and ${d.recycling>=.97?'almost all waste':`${pct(d.recycling)} of waste`} is sorted.`,
        `Venezia è libera dai fossili: le case si scaldano con pompe di calore ad acqua di laguna, tutto ciò che si può riparare si ripara, e ${d.recycling>=.97?'quasi tutti i rifiuti vengono differenziati':`${il(d.recycling)}${pct(d.recycling)} dei rifiuti viene differenziato`}.`)
    :lvl('effektivitet')>L2?t(`Värmepumpar på lagunvatten värmer husen i varje sestiere, gamla hus renoveras varsamt, och ${pct(d.recycling)} av avfallet sorteras${was(pct(d0.recycling))}.`,
        `Heat pumps using lagoon water heat the homes in every sestiere, old houses are renovated with care, and ${pct(d.recycling)} of waste is sorted${was(pct(d0.recycling))}.`,
        `Pompe di calore ad acqua di laguna scaldano le case in ogni sestiere, gli edifici antichi si ristrutturano con cura, e ${il(d.recycling)}${pct(d.recycling)} dei rifiuti viene differenziato${was(pct(d0.recycling))}.`)
    :lvl('effektivitet')>L1?t('Kommunens bostäder har energirenoverats, men de flesta hus värms fortfarande med gas.',"The municipality's homes have been renovated to save energy, but most houses are still heated with gas.",'Le case comunali sono state riqualificate, ma la maggior parte degli edifici si scalda ancora a gas.')
    :now?'':t('De flesta hus värms fortfarande med gaspannor.','Most houses are still heated by gas boilers.','La maggior parte delle case si scalda ancora con caldaie a gas.'),
    t(`Stadens egna utsläpp är ${dec(d.ghg,1)} ton koldioxid per invånare${was(dec(d0.ghg,1))}${now?' – klimatplanen siktar på 72 % lägre till 2030 än 2005, medan kolkraftverket i Fusina ensamt släppte ut 1,65 miljoner ton 2023':''}.`,
      `The city's own emissions are ${dec(d.ghg,1)} tonnes of carbon dioxide per resident${was(dec(d0.ghg,1))}${now?' – the climate plan aims for 72% lower by 2030 than in 2005, while the coal-fired power station at Fusina alone emitted 1.65 million tonnes in 2023':''}.`,
      `Le emissioni proprie della città sono di ${dec(d.ghg,1)} tonnellate di anidride carbonica per abitante${was(dec(d0.ghg,1))}${now?' – il piano per il clima punta a ridurle del 72% entro il 2030 rispetto al 2005, mentre la sola centrale a carbone di Fusina ha emesso 1,65 milioni di tonnellate nel 2023':''}.`),
    t(`Konsumtionens fotavtryck är ${now?'uppskattningsvis ':''}${dec(d.ghgCons,1)} ton per person${was(dec(d0.ghgCons,1))} – 1,5-gradersnivån 2050 är 0,7 ton.`,
      `The consumption footprint is ${now?'an estimated ':''}${dec(d.ghgCons,1)} tonnes per person${was(dec(d0.ghgCons,1))} – the 1.5-degree level for 2050 is 0.7 tonnes.`,
      `L'impronta dei consumi è di ${now?'circa ':''}${dec(d.ghgCons,1)} tonnellate a persona${was(dec(d0.ghgCons,1))} – il livello compatibile con 1,5 gradi nel 2050 è di 0,7 tonnellate.`),
    t(`Besökarnas resor och nätter ger uppskattningsvis ${mn(d.tourismCO2)} ton koldioxid om året${was(mn(d0.tourismCO2))}${ratio>3?' – många gånger mer än invånarnas egna utsläpp':''}.`,
      `Visitors' journeys and nights cause an estimated ${mn(d.tourismCO2)} tonnes of carbon dioxide a year${was(mn(d0.tourismCO2))}${ratio>3?" – many times more than the residents' own emissions":''}.`,
      `I viaggi e i pernottamenti dei visitatori producono circa ${mn(d.tourismCO2)} di tonnellate di anidride carbonica l'anno${was(mn(d0.tourismCO2))}${ratio>3?' – molte volte più delle emissioni proprie degli abitanti':''}.`),
  ].filter(Boolean).join(' ')});

  // Community and democracy: the households of one, the campi, the citizens' assemblies in the Doge's Palace
  // (research/deep/samhalle-halsa, kommun-plats-historia; places.js; levers.js bilfritt = "Svalka i campi").
  const hours=Math.round(d.workHours),hours0=Math.round(d0.workHours),campi=lvl('bilfritt'),dem=lvl('demokrati');
  S.push({title:t('Gemenskap och demokrati','Community and democracy','Comunità e democrazia'),text:[
    t(`${now?'Uppskattningsvis ':''}${pct(d.lowParticipation)} har lågt socialt deltagande${was(pct(d0.lowParticipation))} och ${pct(d.trust)} litar på andra människor${was(pct(d0.trust))}.`,
      `${now?'An estimated ':''}${pct(d.lowParticipation)} have low social participation${was(pct(d0.lowParticipation))} and ${pct(d.trust)} trust other people${was(pct(d0.trust))}.`,
      `${now?`Si stima che ${il(d.lowParticipation)}`:Il(d.lowParticipation)}${pct(d.lowParticipation)} ${now?'abbia':'ha'} una scarsa partecipazione sociale${was(pct(d0.lowParticipation))} e ${now?'che ':''}${il(d.trust)}${pct(d.trust)} si ${now?'fidi':'fida'} degli altri${was(pct(d0.trust))}.`),
    now?t('Bara 69,5 % av kommunens invånare säger att de har vänner att räkna med, och hälften känner sig otrygga när de går ensamma ute i mörkret.',
        "Only 69.5% of the municipality's residents say they have friends to count on, and half feel unsafe walking alone after dark.",
        'Solo il 69,5% degli abitanti del Comune dice di avere amici su cui contare, e la metà non si sente sicura a camminare da sola al buio.')
    :home>L2?t(`${pct(d.cohousing)} bor i generationshus eller andra bogemenskaper, där unga, familjer och de äldsta delar trapphus, kök och altaner.`,
        `${pct(d.cohousing)} live in multi-generation houses or other cohousing, where the young, families and the oldest share stairwells, kitchens and roof terraces.`,
        `${Il(d.cohousing)}${pct(d.cohousing)} vive in case tra generazioni o in altre forme di coabitazione, dove giovani, famiglie e grandi anziani condividono scale, cucine e altane.`)
    :home>L1?t(`Renoverade hus får gemensamma rum, och ${pct(d.cohousing)} bor i någon form av bogemenskap${was(pct(d0.cohousing))}.`,
        `Renovated houses get shared rooms, and ${pct(d.cohousing)} live in some form of cohousing${was(pct(d0.cohousing))}.`,
        `Le case ristrutturate hanno spazi comuni, e ${il(d.cohousing)}${pct(d.cohousing)} vive in qualche forma di coabitazione${was(pct(d0.cohousing))}.`)
    :t('De flesta bor som 2026, och över hälften av hushållen består av en enda person.','Most people live as they did in 2026, and more than half of households are one person.','Quasi tutti vivono come nel 2026, e più di metà delle famiglie è composta da una sola persona.'),
    campi>L3?t('Campi är gröna och svala: träd ger skugga, fontänerna ger dricksvatten, och klostrens trädgårdar står öppna för alla.','The campi are green and cool: trees give shade, the fountains give drinking water, and the cloister gardens are open to all.',"I campi sono verdi e freschi: gli alberi fanno ombra, le fontane danno acqua da bere, e i giardini dei chiostri sono aperti a tutti.")
    :campi>L2?t('Varje sestiere har skuggande träd och gröna gårdar, och på campi äter grannarna vid långbord om kvällarna.','Every sestiere has shade trees and green courtyards, and in the campi neighbours eat at long tables in the evenings.',"Ogni sestiere ha alberi d'ombra e corti verdi, e la sera nei campi i vicini cenano a lunghe tavolate.")
    :campi>L1?t('De största campi – Santa Maria Formosa, Santo Stefano och San Polo – har fått träd och fontäner.','The largest campi – Santa Maria Formosa, Santo Stefano and San Polo – have trees and fountains.','I campi più grandi – Santa Maria Formosa, Santo Stefano e San Polo – hanno alberi e fontane.')
    :now?t('Campi är stadens vardagsrum, men de flesta är stenytor utan skugga.',"The campi are the city's living rooms, but most are stone surfaces with no shade.","I campi sono i salotti della città, ma per lo più sono distese di pietra senz'ombra."):'',
    dem>L3?t('Ett lottat medborgarråd sammanträder i Stora rådssalen i Dogepalatset, och ett barnbarnsombud med vetorätt prövar lagunens långsiktiga frågor mot dem som ännu inte är födda.',
        "A citizens' assembly chosen by lot meets in the Great Council Hall of the Doge's Palace, and a Grandchildren's Ombudsman with a veto weighs the lagoon's long-term questions against those not yet born.",
        "Un'assemblea di cittadini sorteggiati si riunisce nella Sala del Maggior Consiglio di Palazzo Ducale, e un garante dei nipoti con diritto di veto valuta le scelte di lungo periodo per la laguna pensando a chi non è ancora nato.")
    :dem>L2?t('Lottade medborgarråd i varje sestiere ger råd i de stora frågorna, och invånarna bestämmer själva över en del av budgeten.',"Citizens' assemblies chosen by lot in every sestiere advise on the big questions, and residents decide part of the budget themselves.",'Assemblee di cittadini sorteggiati in ogni sestiere danno consigli sulle grandi questioni, e gli abitanti decidono da sé una parte del bilancio.')
    :dem>L1?t('Kommunen håller medborgardialoger i varje sestiere.',"The municipality holds citizens' dialogues in every sestiere.",'Il Comune organizza dialoghi con i cittadini in ogni sestiere.')
    :now?t('I kommunvalet 2026 röstade 55,9 %, och den historiska staden röstade på en annan borgmästarkandidat än fastlandet och öarna.',
        'In the 2026 municipal election turnout was 55.9%, and the historic city voted for a different mayoral candidate from the mainland and the islands.',
        'Alle comunali del 2026 ha votato il 55,9%, e la città storica ha scelto un candidato sindaco diverso da quello della terraferma e delle isole.'):'',
    `${t(`Arbetsveckan är ${hours} timmar${hours!==hours0?was(hours0):''}.`,`The working week is ${hours} hours${hours!==hours0?was(hours0):''}.`,`La settimana lavorativa è di ${hours} ore${hours!==hours0?was(hours0):''}.`)}${lvl('arbetstid')>L2?t(' Den frigjorda tiden går till grannarna, campo-köken och tidsbanken.',' The time freed up goes to the neighbours, the campo kitchens and the time bank.',' Il tempo liberato va ai vicini, alle cucine dei campi e alla banca del tempo.'):''}`,
    now?'':d.lowParticipation>d0.lowParticipation+.02?t('Ensamheten har ökat sedan 2026: fler bor ensamma, och grannarna blir färre.','Loneliness has grown since 2026: more people live alone, and there are fewer neighbours.','La solitudine è cresciuta dal 2026: più persone vivono sole, e i vicini sono sempre meno.')
      :d.lowParticipation<d0.lowParticipation-.02?t('Ensamheten har minskat sedan 2026.','Loneliness has fallen since 2026.','La solitudine è diminuita dal 2026.'):'',
  ].filter(Boolean).join(' ')});

  // Health and care in an old city of steps and bridges, and its heat (research/deep/samhalle-halsa, hav-tidvatten,
  // energi-resor; levers.js forebyggande).
  const care=lvl('forebyggande');
  S.push({title:t('Hälsa och omsorg','Health and care','Salute e cura'),text:[
    now?t(`Kvinnorna i provinsen lever i snitt ${dec(d.lifeExp,1)} år och männen 82,2. Uppskattningsvis ${pct(d.activity)} rör sig tillräckligt och ${pct(d.selfHealth)} anser sig ha god hälsa.`,
        `Women in the province live ${dec(d.lifeExp,1)} years on average and men 82.2. An estimated ${pct(d.activity)} get enough exercise and ${pct(d.selfHealth)} rate their health as good.`,
        `Le donne della provincia vivono in media ${dec(d.lifeExp,1)} anni e gli uomini 82,2. Si stima che ${il(d.activity)}${pct(d.activity)} faccia abbastanza movimento e che ${il(d.selfHealth)}${pct(d.selfHealth)} si consideri in buona salute.`)
    :t(`Kvinnorna lever i snitt ${dec(d.lifeExp,1)} år${was(dec(d0.lifeExp,1))} och männen omkring fyra år kortare. ${pct(d.activity)} rör sig tillräckligt och ${pct(d.selfHealth)} anser sig ha god hälsa.`,
        `Women live ${dec(d.lifeExp,1)} years on average${was(dec(d0.lifeExp,1))} and men about four years less. ${pct(d.activity)} get enough exercise and ${pct(d.selfHealth)} rate their health as good.`,
        `Le donne vivono in media ${dec(d.lifeExp,1)} anni${was(dec(d0.lifeExp,1))} e gli uomini circa quattro anni meno. ${Il(d.activity)}${pct(d.activity)} fa abbastanza movimento e ${il(d.selfHealth)}${pct(d.selfHealth)} si considera in buona salute.`),
    t(`${pct(d.share65)} av invånarna är 65 år eller äldre och ${pct(d.share80)} är 80 eller äldre${now?' – mot 25 % och 8 % i Italien':` (2026: ${pct(d0.share65)} och ${pct(d0.share80)})`}.`,
      `${pct(d.share65)} of residents are 65 or older and ${pct(d.share80)} are 80 or older${now?' – against 25% and 8% in Italy':` (2026: ${pct(d0.share65)} and ${pct(d0.share80)})`}.`,
      `${Il(d.share65)}${pct(d.share65)} degli abitanti ha 65 anni o più e ${il(d.share80)}${pct(d.share80)} 80 o più${now?" – contro il 25% e l'8% in Italia":` (2026: ${pct(d0.share65)} e ${pct(d0.share80)})`}.`),
    care>L3?t('Staden planeras för gång, möten och vila: bänkar i skuggan, ramper vid broarna och vård nära hemmet.','The city is planned for walking, meeting and resting: benches in the shade, ramps at the bridges and care close to home.',"La città è pensata per camminare, incontrarsi e riposare: panchine all'ombra, rampe ai ponti e cure vicino a casa.")
    :care>L2?t('Varje sestiere har ett hälsotorg, och hemtjänsten kommer med båt.','Every sestiere has a health centre, and home care comes by boat.',"Ogni sestiere ha una casa della salute, e l'assistenza domiciliare arriva in barca.")
    :care>L1?t('Läkarna skriver ut promenader över broarna, kultur och sällskap på recept.','Doctors prescribe walks over the bridges, culture and company.','I medici prescrivono passeggiate sui ponti, cultura e compagnia.')
    :now?t('Sjukhuset SS. Giovanni e Paolo i Castello, med omkring 310 vårdplatser, är det enda på öarna, och patienterna kommer dit med ambulansbåt.',
        'The SS. Giovanni e Paolo hospital in Castello, with about 310 beds, is the only one on the islands, and patients arrive by water ambulance.',
        "L'ospedale Santi Giovanni e Paolo a Castello, con circa 310 posti letto, è l'unico delle isole, e i pazienti ci arrivano in idroambulanza."):'',
    now?t('95 % av broarna i stadens centrala delar har trappsteg, och med vaporetto når en rullstolsburen omkring 70 % av staden – utan båt 2 %.',
        '95% of the bridges in the central city have steps, and by vaporetto a wheelchair user can reach about 70% of the city – without a boat, 2%.',
        'Il 95% dei ponti del centro ha gradini, e in vaporetto chi usa la sedia a rotelle raggiunge circa il 70% della città – senza barca il 2%.')
    :care>L2?t('Ramper och långa, sluttande trappsteg gör att allt fler broar går att ta sig över med rullstol och barnvagn.','Ramps and long, sloping steps mean ever more bridges can be crossed in a wheelchair or with a pram.','Rampe e gradini agevolati permettono di attraversare sempre più ponti in sedia a rotelle o con il passeggino.'):'',
    now?'':d.welfare>1.08?t('Omsorgen har mer resurser än 2026, trots att fler är mycket gamla.','Care has more resources than in 2026, even though more people are very old.',"L'assistenza ha più risorse che nel 2026, anche se i grandi anziani sono di più.")
      :d.welfare<.975?t('Omsorgen har mindre att röra sig med än 2026, samtidigt som fler är mycket gamla.','Care has less room to manoeuvre than in 2026, while more people are very old.',"L'assistenza ha meno margini che nel 2026, mentre i grandi anziani sono di più."):'',
    now?t('I dag har staden omkring 22 dagar om året över 30 grader och 67 tropiska nätter.','Today the city has about 22 days a year above 30 °C and 67 tropical nights.',"Oggi la città ha circa 22 giorni l'anno sopra i 30 gradi e 67 notti tropicali.")
    :d.gwl>2.2?t(`Somrarna har blivit hetare, med fler dagar över 30 grader och fler tropiska nätter${campi>L2?' – men skuggiga campi och svala gårdar ger andrum':' – och de äldre som bor ensamma under heta tak är mest utsatta'}.`,
        `Summers have grown hotter, with more days above 30 °C and more tropical nights${campi>L2?' – but shady campi and cool courtyards give relief':' – and the old who live alone under hot roofs are the most exposed'}.`,
        `Le estati sono diventate più calde, con più giorni sopra i 30 gradi e più notti tropicali${campi>L2?' – ma campi ombreggiati e corti fresche danno sollievo':' – e gli anziani che vivono soli sotto tetti roventi sono i più esposti'}.`):'',
  ].filter(Boolean).join(' ')});

  // The analogue and the accelerated: screen-free childhood and the squero, AI for the tides, the universities
  // (places.js; levers.js analog, ai, kunskap).
  const analog=lvl('analog'),ai=lvl('ai'),know=lvl('kunskap');
  S.push({title:t('Det analoga och det accelererade','The analogue and the accelerated',"L'analogico e l'accelerato"),text:[
    analog>L3?t('Barndomen är skärmfri till tolv år: böcker, hantverk och undervisning ute vid lagunen. På gondolvarvet San Trovaso lär sig unga att bygga båtar i trä, och betalningar, journaler och tidvattenvarningar fungerar också utan nät.',
        'Childhood is screen-free until twelve: books, crafts and lessons outdoors by the lagoon. At the San Trovaso boatyard young people learn to build wooden boats, and payments, medical records and tide warnings also work offline.',
        "L'infanzia è senza schermi fino a dodici anni: libri, mestieri e lezioni all'aperto in laguna. Allo squero di San Trovaso i giovani imparano a costruire barche di legno, e pagamenti, cartelle cliniche e avvisi di marea funzionano anche senza rete.")
    :analog>L2?t('Barndomen är skärmfri till tolv år, och på gondolvarvet San Trovaso lär sig unga att bygga båtar i trä; kontanter och papper finns kvar som reserv.',
        'Childhood is screen-free until twelve, and at the San Trovaso boatyard young people learn to build wooden boats; cash and paper are kept as a backup.',
        "L'infanzia è senza schermi fino a dodici anni, e allo squero di San Trovaso i giovani imparano a costruire barche di legno; contanti e carta restano come riserva.")
    :analog>L1?t('Skolan är mobilfri, och böckerna har kommit tillbaka i undervisningen.','School is phone-free, and books are back in the lessons.','La scuola è senza cellulari, e i libri sono tornati nelle lezioni.')
    :t('Nästan allt är digitalt, också reserven.','Almost everything is digital, even the backup.','Quasi tutto è digitale, anche la riserva.'),
    now?t('Squero di San Trovaso är ett av de sista varven som fortfarande bygger gondoler.','The Squero di San Trovaso is one of the last boatyards that still build gondolas.','Lo squero di San Trovaso è uno degli ultimi cantieri dove si costruiscono ancora gondole.'):'',
    t(`${now?'Uppskattningsvis ':''}${pct(d.youthScreen)} av 13–16-åringarna har mer än tre timmars skärmtid om dagen på fritiden${was(pct(d0.youthScreen))}.`,
      `${now?'An estimated ':''}${pct(d.youthScreen)} of 13–16-year-olds spend more than three hours a day on screens in their free time${was(pct(d0.youthScreen))}.`,
      `${now?`Si stima che ${il(d.youthScreen)}`:Il(d.youthScreen)}${pct(d.youthScreen)} dei ragazzi tra 13 e 16 anni ${now?'passi':'passa'} più di tre ore al giorno davanti a uno schermo nel tempo libero${was(pct(d0.youthScreen))}.`),
    ai>L2?(d.aiGovernance>.6?t('Öppen, lokal AI förutser tidvattnet, styr båttrafiken och hjälper vården – med data i invånarnas ägo och människor som fattar besluten.',
          'Open, local AI forecasts the tides, guides the boat traffic and helps the health services – with data owned by the residents and people making the decisions.',
          "Un'IA aperta e locale prevede le maree, regola il traffico acqueo e aiuta la sanità – con i dati in mano agli abitanti e le decisioni prese da persone.")
      :t('AI styr mycket av båttrafiken, vården och barriärerna, men få vet hur besluten fattas, och vinsterna har hamnat hos få.',
          'AI runs much of the boat traffic, health care and the barriers, but few know how the decisions are made, and the gains have gone to a few.',
          "L'IA governa gran parte del traffico acqueo, della sanità e delle barriere, ma pochi sanno come si prendono le decisioni, e i vantaggi sono andati a pochi."))
    :ai>L1?t('AI prövas i vården och i tidvattenprognoserna, med människor som fattar besluten.','AI is being tried out in health care and tide forecasting, with people making the decisions.',"L'IA si sperimenta nella sanità e nelle previsioni di marea, con le decisioni prese da persone.")
    :t('AI används sparsamt och mest i beprövade verktyg.','AI is used sparingly, mostly in well-tested tools.',"L'IA si usa con parsimonia, soprattutto in strumenti collaudati."),
    now?t('När tidvattnet stiger varnar högtalare i klocktornen: en ton för 110 cm, två för 120, tre för 130 och fyra för 140.',
        'When the tide rises, loudspeakers in the bell towers give warning: one tone for 110 cm, two for 120, three for 130 and four for 140.',
        "Quando la marea sale, gli altoparlanti sui campanili danno l'allarme: un suono per 110 cm, due per 120, tre per 130 e quattro per 140."):'',
    know>L3?t("Varje skola forskar på lagunen tillsammans med Ca' Foscari och IUAV, och lärandet fortsätter livet ut.","Every school does research on the lagoon with Ca' Foscari and IUAV, and learning continues for life.","Ogni scuola fa ricerca sulla laguna con Ca' Foscari e lo Iuav, e si impara per tutta la vita.")
    :know>L2?t(`Lagunen är ett levande labb: i klostret på San Giorgio Maggiore mäter forskare och skolklasser sedimentet, havet och ${d.saltMarsh>=1?'saltängarna':'strömmarna'} tillsammans.`,
        `The lagoon is a living lab: in the monastery on San Giorgio Maggiore, researchers and school classes measure the sediment, the sea and the ${d.saltMarsh>=1?'salt marshes':'currents'} together.`,
        `La laguna è un laboratorio vivente: nel monastero di San Giorgio Maggiore ricercatori e classi misurano insieme i sedimenti, il mare e ${d.saltMarsh>=1?'le barene':'le correnti'}.`)
    :know>L1?t("Studentbostäder i tomma hus gör att fler av studenterna vid Ca' Foscari och IUAV bor kvar i staden.","Student housing in empty buildings means more of the students at Ca' Foscari and IUAV live in the city.","Gli alloggi per studenti ricavati in edifici vuoti fanno sì che più studenti di Ca' Foscari e dello Iuav vivano in città.")
    :now?t("Omkring 24 000 studerar vid Ca' Foscari och IUAV, men få är folkbokförda här, och två av tre som hyr ett rum bor trångt.","About 24,000 study at Ca' Foscari and IUAV, but few are registered residents, and two in three who rent a room live in cramped conditions.","Circa 24.000 studenti frequentano Ca' Foscari e lo Iuav, ma pochi sono residenti, e due su tre di quelli che affittano una stanza vivono stretti.")
    :t("Studenterna vid Ca' Foscari och IUAV bor trångt och sällan länge, och fler unga akademiker flyttar från provinsen än till den.","The students at Ca' Foscari and IUAV live in cramped rooms and seldom for long, and more young graduates leave the province than move to it.","Gli studenti di Ca' Foscari e dello Iuav vivono stretti e per poco tempo, e i giovani laureati che lasciano la provincia sono più di quelli che arrivano."),
  ].filter(Boolean).join(' ')});
  return S;
}
