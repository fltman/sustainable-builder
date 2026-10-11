// "Visionen": historic Venice in a given year written out as a short vision document, from Venice's own model
// (model.js): its levers (levers.js) and its measures (indicators.js). Every sentence is conditioned on the
// numbers and on how far each lever has come, so the text describes the plan the player made – including what
// it did not do – in whichever world, and each section names what has changed since 2026. Eight sections:
// homes and residents, short lets and visitors, the sea and MOSE, the lagoon and its salt marshes, boats and
// air, energy where it is allowed, heat and care for the old, voice and knowledge. Today's facts come from the
// research (research/deep/*-notes.md, research/story.json); what a lever brings follows its levels in
// levers.js. Swedish, English and Italian inline with t(sv,en,it), so en/vision-text.js and it/vision-text.js
// stay empty.
import { t, dec, int, pct } from '@engine/i18n.js';
import { PARAMS, FLOOD } from '@city/model.js';
const near=(v,step)=>Math.round(v/step)*step;
// Centimetres on the tide gauge's zero (ZMPS, Punta della Salute 1897), the scale every Venetian tide is given in.
const cm=m=>Math.round(m*100);
// The sea's mean level today: 0.353 m on ZMPS (2020–2025, research/deep/hav-tidvatten; model.js MEAN0).
const MEAN=.353;
// The share of the historic city's public walkways that lie below a water level (the Comune's table, model.js FLOOD).
const under=level=>{const T=FLOOD.table;if(level<=T[0][0])return 0;
  for(let i=1;i<T.length;i++)if(level<=T[i][0]){const [a,p]=T[i-1],[b,q]=T[i];return p+(q-p)*(level-a)/(b-a);}return 1;};
// The historic city's people by census (the Comune's series A01_T01) and the year, to five, it last had as many.
const HIST=[[1951,174808],[1961,137150],[1971,108426],[1981,93598],[1991,76644],[2001,65695],[2011,58991],[2021,50434],[2025,47625]];
const yearAt=p=>{for(let i=1;i<HIST.length;i++){const [y0,p0]=HIST[i-1],[y1,p1]=HIST[i];if(p<=p0&&p>=p1)return Math.round((y0+(y1-y0)*(p0-p)/(p0-p1))/5)*5;}return p>HIST[0][1]?1951:2025;};
// A percentage with one decimal ("18,1 %").
const pct1=v=>t(`${dec(v*100,1)} %`,`${dec(v*100,1)}%`,`${dec(v*100,1)}%`);
// Italian article before a figure as written: "il 37%", "l'8%", "l'11%", "l'80%", "lo 0%"; Il() at the start of a
// sentence, del() after "of".
const artOf=s=>{const n=parseInt(String(s),10);return n===0?'lo ':n===1||n===8||n===11||(n>=80&&n<90)?"l'":'il ';};
const il=v=>artOf(pct(v))+pct(v),Il=v=>{const s=il(v);return s[0].toUpperCase()+s.slice(1);};
// Italian "ai"/"agli" before a number: "intorno agli 86 cm", "ai 74 cm".
const agli=n=>n===1||n===8||n===11||(n>=80&&n<90)||(n>=800&&n<900)?'agli':'ai';
// Times: "1 gång", "2 gånger".
const times=n=>t(n===1?'gång':'gånger',n===1?'time':'times',n===1?'volta':'volte');
// Millions, with k decimals.
const mn=(v,k=1)=>t(`${dec(v/1e6,k)} miljoner`,`${dec(v/1e6,k)} million`,`${dec(v/1e6,k)} milioni`);
// How far a lever must be implemented (0–1) before the text shows its first, second and third level.
const L1=.12,L2=.45,L3=.8;

export function visionSections(run,year){
  const r=run.years[year-2026],d=r.ind,I=r.I,d0=run.years[0].ind;
  const lvl=id=>I[id]||0;
  // 2026 is the starting point; from 2027 a figure carries its 2026 value.
  const now=year<=2026,was=x=>now?'':` (2026: ${x})`;
  const S=[];

  // 1. Homes and residents: the emptying city, three deaths for every birth, the homes that could be homes again
  // (research/deep/samhalle-halsa; levers.js bogemenskap; model.js: the cohorts and the housing balance).
  const home=lvl('bogemenskap'),prevPop=year>2026?run.years[year-2027].ind.pop:d.pop,rising=d.pop>prevPop+20;
  const pop=int(near(d.pop,100)),born=int(d.births),died=int(d.deaths),fewerBorn=d.births<d.deaths;
  const pe=int(near(d.publicEmpty,10));
  S.push({title:t('Invånare och hem','Residents and homes','Abitanti e case'),text:[
    now?t(`Den historiska staden har ${int(d.pop)} invånare, ${pct(d.pop/174808)} av de 174 808 som bodde här 1951, och det dör tre gånger så många som det föds: 689 mot 209 år 2025.`,
        `The historic city has ${int(d.pop)} residents, ${pct(d.pop/174808)} of the 174,808 who lived here in 1951, and three times as many people die as are born: 689 against 209 in 2025.`,
        `La città storica ha ${int(d.pop)} abitanti, ${il(d.pop/174808)} dei 174.808 che ci vivevano nel 1951, e i morti sono il triplo dei nati: 689 contro 209 nel 2025.`)
    :d.pop>d0.pop+300?[
      t(`Den historiska staden har ${pop} invånare${was(int(d0.pop))}${d.pop>HIST.at(-2)[1]?`, lika många som omkring ${yearAt(d.pop)}`:''}.`,
        `The historic city has ${pop} residents${was(int(d0.pop))}${d.pop>HIST.at(-2)[1]?`, as many as around ${yearAt(d.pop)}`:''}.`,
        `La città storica ha ${pop} abitanti${was(int(d0.pop))}${d.pop>HIST.at(-2)[1]?`, tanti quanti intorno al ${yearAt(d.pop)}`:''}.`),
      fewerBorn?t(`Det dör fortfarande fler än det föds – ${died} mot ${born} om året (2026: 689 mot 209) – så staden lever på de unga och barnfamiljerna som flyttar hit.`,
          `More people still die than are born – ${died} against ${born} a year (2026: 689 against 209) – so the city lives on the young people and families who move here.`,
          `I morti sono ancora più dei nati – ${died} contro ${born} all'anno (2026: 689 contro 209) – e la città vive dei giovani e delle famiglie che vengono ad abitarci.`)
        :t(`Nu föds det fler än det dör: ${born} mot ${died} om året (2026: 209 mot 689).`,`More people are now born than die: ${born} against ${died} a year (2026: 209 against 689).`,`Ora i nati sono più dei morti: ${born} contro ${died} all'anno (2026: 209 contro 689).`)]
    :d.pop<d0.pop-300?[
      t(`Den historiska staden har ${pop} invånare${was(int(d0.pop))}, ${pct(d.pop/174808)} av dem som bodde här 1951.`,
        `The historic city has ${pop} residents${was(int(d0.pop))}, ${pct(d.pop/174808)} of those who lived here in 1951.`,
        `La città storica ha ${pop} abitanti${was(int(d0.pop))}, ${il(d.pop/174808)} di quelli che ci vivevano nel 1951.`),
      fewerBorn?t(`Det dör ${died} om året och föds ${born} (2026: 689 och 209)${rising?', men nu flyttar fler hit än härifrån, och staden har börjat växa igen':home>L2?', och de många gamla dör fortare än nya venetianer hinner flytta in':', och för få unga flyttar hit för att väga upp det'}.`,
          `${died} people die a year and ${born} are born (2026: 689 and 209)${rising?', but now more people move in than out, and the city has begun to grow again':home>L2?', and the many old people die faster than new Venetians can move in':', and too few young people move here to make up for it'}.`,
          `Muoiono ${died} persone all'anno e ne nascono ${born} (2026: 689 e 209)${rising?', ma ora arriva più gente di quanta ne parta, e la città ha ripreso a crescere':home>L2?', e i tanti anziani se ne vanno più in fretta di quanto arrivino nuovi veneziani':', e troppo pochi giovani vengono a vivere qui per compensarlo'}.`)
        :t('Det föds nu fler än det dör, men fler flyttar härifrån än hit.','More people are now born than die, but more move out than in.','Ora i nati sono più dei morti, ma se ne va più gente di quanta ne arrivi.')]
    :[t(`Den historiska staden har ${pop} invånare, ungefär lika många som 2026.`,`The historic city has ${pop} residents, about as many as in 2026.`,`La città storica ha ${pop} abitanti, più o meno quanti nel 2026.`),
      fewerBorn?t(`Det dör fortfarande fler än det föds – ${died} mot ${born} om året – och de som flyttar hit väger upp det.`,`More people still die than are born – ${died} against ${born} a year – and those who move here make up for it.`,`I morti sono ancora più dei nati – ${died} contro ${born} all'anno – e chi viene ad abitare qui compensa la differenza.`):''],
    now?t('37,4 % av bostäderna har ingen folkbokförd boende. I kommunen står 2 251 hushåll i kö till allmännyttan, medan omkring 2 950 kommunala och ATER-bostäder står tomma i väntan på renovering – uppskattningsvis 800 av dem i den historiska staden.',
        '37.4% of homes have no registered resident. In the municipality 2,251 households are waiting for public housing, while about 2,950 municipal and ATER homes stand empty awaiting renovation – an estimated 800 of them in the historic city.',
        'Il 37,4% delle abitazioni non ha residenti. Nel Comune 2251 famiglie sono in graduatoria per una casa popolare, mentre circa 2950 alloggi comunali e ATER restano vuoti in attesa di ristrutturazione – circa 800, secondo una stima, nella città storica.')
    :[home>L3?(d.emptyHomes<.25?t('Staden har getts tillbaka åt dem som bor här: en bostadsfond av turistskatten och inträdesavgiften köper och hyr ut hem till hyror som vanliga löner räcker till.',
          'The city has been given back to the people who live here: a housing fund fed by the tourist tax and the access fee buys homes and lets them at rents ordinary wages can pay.',
          "La città è stata restituita a chi la abita: un fondo per la casa, alimentato dall'imposta di soggiorno e dal contributo di accesso, compra case e le affitta a canoni alla portata dei salari normali.")
        :t('En bostadsfond av turistskatten och inträdesavgiften köper och hyr ut hem till hyror som vanliga löner räcker till.',
          'A housing fund fed by the tourist tax and the access fee buys homes and lets them at rents ordinary wages can pay.',
          "Un fondo per la casa, alimentato dall'imposta di soggiorno e dal contributo di accesso, compra case e le affitta a canoni alla portata dei salari normali."))
      :home>L2?t('En bostadsfond av turistskatten och inträdesavgiften köper och hyr ut hem åt dem som bor och arbetar här, och generationshusen har fått kök vid campot.',
          'A housing fund fed by the tourist tax and the access fee buys and lets homes for the people who live and work here, and the multi-generation houses have kitchens on the campo.',
          "Un fondo per la casa, alimentato dall'imposta di soggiorno e dal contributo di accesso, compra e affitta case per chi vive e lavora qui, e le case tra generazioni hanno una cucina sul campo.")
      :home>L1?t('De tomma kommunala och ATER-hemmen rustas och hyrs ut till unga par och familjer.','The empty municipal and ATER homes are being renovated and let to young couples and families.','Gli alloggi comunali e ATER vuoti vengono ristrutturati e affittati a giovani coppie e famiglie.'):'',
      d.publicEmpty<5?t('Alla tomma offentliga hem i den historiska staden har rustats och fått hyresgäster (2026: omkring 800).','All the empty public homes in the historic city have been renovated and let (2026: about 800).','Tutti gli alloggi pubblici vuoti della città storica sono stati ristrutturati e affittati (2026: circa 800).')
      :d.publicEmpty>d0.publicEmpty+50?t(`De tomma offentliga hemmen blir fler: ${pe} väntar på renovering (2026: omkring 800).`,`The empty public homes are growing in number: ${pe} await renovation (2026: about 800).`,`Gli alloggi pubblici vuoti aumentano: ${pe} attendono la ristrutturazione (2026: circa 800).`)
      :d.publicEmpty<d0.publicEmpty-50?t(`${pe} offentliga hem står fortfarande tomma (2026: omkring 800).`,`${pe} public homes still stand empty (2026: about 800).`,`${pe} alloggi pubblici restano ancora vuoti (2026: circa 800).`):'',
      t(`${pct(d.emptyHomes)} av bostäderna står utan folkbokförd boende${was(pct(d0.emptyHomes))}${d.emptyHomes>d0.emptyHomes+.01?' – för varje år blir fler hem turistlägenheter, fritidshem eller tomma':''}.`,
        `${pct(d.emptyHomes)} of homes have no registered resident${was(pct(d0.emptyHomes))}${d.emptyHomes>d0.emptyHomes+.01?' – every year more homes become holiday lets or second homes, or stand empty':''}.`,
        `${Il(d.emptyHomes)} delle abitazioni è senza residenti${was(pct(d0.emptyHomes))}${d.emptyHomes>d0.emptyHomes+.01?' – ogni anno altre case diventano affitti turistici o seconde case, o restano vuote':''}.`),
      Math.abs(d.housePrice/d0.housePrice-1)>.05?t(`En bostad kostar ${int(near(d.housePrice,10))} euro per kvadratmeter${was(int(d0.housePrice))}.`,`A home costs ${int(near(d.housePrice,10))} euros per square metre${was(int(d0.housePrice))}.`,`Una casa costa ${int(near(d.housePrice,10))} euro al metro quadro${was(int(d0.housePrice))}.`):''],
    now?t('Över hälften av hushållen består av en enda person, och grund- och mellanskolorna har 2 570 elever, 28,8 % färre än läsåret 2015/16.',
        'More than half of households are one person, and the primary and middle schools have 2,570 pupils, 28.8% fewer than in the 2015/16 school year.',
        "Più di metà delle famiglie è composta da una sola persona, e le scuole primarie e medie hanno 2570 alunni, il 28,8% in meno rispetto all'anno scolastico 2015/16.")
    :t(`Grund- och mellanskolorna har ${int(near(d.pupils,10))} elever${was(int(d0.pupils))}${d.pupils>1.5*d0.pupils?' – Scuola Armando Diaz i Castello är full igen, och om kvällarna leker barnen på Campo Santa Maria Formosa':d.pupils<.75*d0.pupils?' – skolor har fått slå ihop klasser och stänga':''}.`,
      `The primary and middle schools have ${int(near(d.pupils,10))} pupils${was(int(d0.pupils))}${d.pupils>1.5*d0.pupils?' – the Scuola Armando Diaz in Castello is full again, and in the evenings children play in Campo Santa Maria Formosa':d.pupils<.75*d0.pupils?' – schools have had to merge classes and close':''}.`,
      `Le scuole primarie e medie hanno ${int(near(d.pupils,10))} alunni${was(int(d0.pupils))}${d.pupils>1.5*d0.pupils?' – la scuola Armando Diaz a Castello è di nuovo piena, e la sera i bambini giocano in campo Santa Maria Formosa':d.pupils<.75*d0.pupils?' – le scuole hanno dovuto accorpare classi e chiudere':''}.`),
  ].flat().filter(Boolean).join(' ')});

  // 2. Short lets and visitors: the homes let to tourists, Venice's own right to limit them (2022), the day-trippers
  // against a carrying capacity of about 52 000 a day, the access fee (research/deep/turism-ekonomi, samhalle-halsa;
  // levers.js korttid and besok).
  const lets=lvl('korttid'),visit=lvl('besok'),T=d.shortLetHomes,T0=d0.shortLetHomes,apts=int(near(T,10)),apts0=int(T0);
  const bpr=d.bedsPerResident,cr=d.crowding,vpr=d.visitorsPerResident;
  const fee=visit>L3?t(' – varje besök bokas i förväg',' – every visit is booked in advance',' – ogni visita si prenota in anticipo')
    :visit>L2?t(' – den som vill komma bokar, och de mest trängda dagarna har ett tak',' – those who want to come book ahead, and the most crowded days have a cap',' – chi vuole venire prenota, e i giorni più affollati hanno un tetto')
    :visit>L1?t(' – inträdesavgift och bokning gäller alla högsäsongsdagar',' – the access fee and booking apply on every high-season day',' – contributo di accesso e prenotazione valgono in tutti i giorni di alta stagione')
    :t(' – inträdesavgiften gäller fortfarande bara omkring 60 dagar om året',' – the access fee still applies on only about 60 days a year'," – il contributo di accesso vale ancora solo una sessantina di giorni l'anno");
  S.push({title:t('Turistlägenheter och besökare','Short lets and visitors','Affitti brevi e visitatori'),text:[
    now?t('Det finns 6 145 registrerade turistlägenheter med 24 760 bäddar (september 2026), 1 105 fler än i april 2023, och sedan oktober 2024 finns det fler turistbäddar än invånare. Venedig fick 2022 som första stad i Italien rätt att begränsa korttidsuthyrningen, men ingen gräns gäller ännu.',
        'There are 6,145 registered tourist apartments with 24,760 beds (September 2026), 1,105 more than in April 2023, and since October 2024 there have been more tourist beds than residents. In 2022 Venice became the first city in Italy with the right to limit short-term lets, but no limit applies yet.',
        'Ci sono 6145 appartamenti turistici registrati con 24.760 posti letto (settembre 2026), 1105 in più che nell\'aprile 2023, e dall\'ottobre 2024 i posti letto turistici superano gli abitanti. Nel 2022 Venezia è stata la prima città italiana ad avere il diritto di limitare gli affitti brevi, ma nessun limite è ancora in vigore.')
    :lets>L3?t(`Bara den som själv bor i sitt hem får hyra ut rum till turister, och ${T<.28*T0?'de flesta turistlägenheter har blivit hem igen':'turistlägenheterna blir hem igen'}: ${apts} finns kvar (2026: ${apts0}).`,
        `Only people who live in their own home may let rooms to tourists, and ${T<.28*T0?'most tourist apartments have become homes again':'the tourist apartments are becoming homes again'}: ${apts} are left (2026: ${apts0}).`,
        `Solo chi abita in casa propria può affittare stanze ai turisti, e ${T<.28*T0?'la maggior parte degli appartamenti turistici è tornata a essere casa':'gli appartamenti turistici tornano a essere case'}: ne restano ${apts} (2026: ${apts0}).`)
    :lets>L2?t(`Varje sestiere har en kvot, och inga nya turistlägenheter får öppna i bostadshus: ${apts} finns kvar (2026: ${apts0}).`,
        `Every sestiere has a quota, and no new tourist apartments may open in residential buildings: ${apts} are left (2026: ${apts0}).`,
        `Ogni sestiere ha una quota, e nei palazzi residenziali non possono aprire nuovi appartamenti turistici: ne restano ${apts} (2026: ${apts0}).`)
    :lets>L1?t(`Hela bostäder får hyras ut till turister högst 120 nätter om året, i ett register med kontroller: ${apts} turistlägenheter finns kvar (2026: ${apts0}).`,
        `Whole homes may be let to tourists for at most 120 nights a year, on a register with inspections: ${apts} tourist apartments are left (2026: ${apts0}).`,
        `Le case intere si possono affittare ai turisti al massimo 120 notti l'anno, con un registro e dei controlli: restano ${apts} appartamenti turistici (2026: ${apts0}).`)
    :t(`Det finns ${apts} turistlägenheter (2026: ${apts0})${lets<.03&&T>T0+300?' – korttidsuthyrningen har fortfarande ingen gräns, och för varje år blir fler hem turistbäddar':''}.`,
        `There are ${apts} tourist apartments (2026: ${apts0})${lets<.03&&T>T0+300?' – short-term letting still has no limit, and every year more homes become tourist beds':''}.`,
        `Ci sono ${apts} appartamenti turistici (2026: ${apts0})${lets<.03&&T>T0+300?' – gli affitti brevi non hanno ancora un limite, e ogni anno altre case diventano posti letto turistici':''}.`),
    now?'':bpr<.95?t(`Turistbäddarna är färre än invånarna igen: ${dec(bpr,1)} per invånare (2026: ${dec(d0.bedsPerResident,1)}).`,`Tourist beds are fewer than residents again: ${dec(bpr,1)} per resident (2026: ${dec(d0.bedsPerResident,1)}).`,`I posti letto turistici sono di nuovo meno degli abitanti: ${dec(bpr,1)} per abitante (2026: ${dec(d0.bedsPerResident,1)}).`)
      :bpr>1.15?t(`Det finns ${dec(bpr,1)} turistbäddar per invånare (2026: ${dec(d0.bedsPerResident,1)})${bpr>2?' – i gränderna kring Rialto och San Marco bor nästan ingen längre':''}.`,
          `There are ${dec(bpr,1)} tourist beds per resident (2026: ${dec(d0.bedsPerResident,1)})${bpr>2?' – hardly anyone lives in the alleys around Rialto and San Marco any more':''}.`,
          `Ci sono ${dec(bpr,1)} posti letto turistici per abitante (2026: ${dec(d0.bedsPerResident,1)})${bpr>2?' – nelle calli intorno a Rialto e San Marco non abita quasi più nessuno':''}.`)
      :t(`Turistbäddarna är ungefär lika många som invånarna (2026: ${dec(d0.bedsPerResident,1)} per invånare).`,`There are about as many tourist beds as residents (2026: ${dec(d0.bedsPerResident,1)} per resident).`,`I posti letto turistici sono più o meno quanti gli abitanti (2026: ${dec(d0.bedsPerResident,1)} per abitante).`),
    now?t("En vanlig dag kommer i snitt 61 461 dagsbesökare, och den största dagen 2022 fanns 143 246 besökare i staden – omkring tre per invånare. En studie från Ca' Foscari har satt stadens bärkraft till omkring 52 000 besökare om dagen, och inträdesavgiften för dagsbesökare gällde 60 dagar 2026 och är fortfarande ett försök.",
        "On an ordinary day an average of 61,461 day visitors come, and on the busiest day of 2022 there were 143,246 visitors in the city – about three per resident. A study from Ca' Foscari has put the city's carrying capacity at about 52,000 visitors a day, and the access fee for day visitors applied on 60 days in 2026 and is still a trial.",
        "In un giorno qualunque arrivano in media 61.461 visitatori giornalieri, e nel giorno di punta del 2022 in città c'erano 143.246 visitatori – circa tre per abitante. Uno studio di Ca' Foscari ha stimato la capacità di carico della città in circa 52.000 visitatori al giorno, e il contributo di accesso per i visitatori giornalieri è valso 60 giorni nel 2026 ed è ancora una sperimentazione.")
    :[t(`En vanlig dag kommer ${int(near(d.dayVisitors,100))} dagsbesökare${was(int(d0.dayVisitors))} och den största dagen omkring ${int(near(d.peakDay,1000))}${was(int(d0.peakDay))}${fee}.`,
        `On an ordinary day ${int(near(d.dayVisitors,100))} day visitors come${was(int(d0.dayVisitors))} and on the busiest about ${int(near(d.peakDay,1000))}${was(int(d0.peakDay))}${fee}.`,
        `In un giorno qualunque arrivano ${int(near(d.dayVisitors,100))} visitatori giornalieri${was(int(d0.dayVisitors))} e nel giorno di punta circa ${int(near(d.peakDay,1000))}${was(int(d0.peakDay))}${fee}.`),
      cr>=1.1?t(`Med de övernattande gästerna är besökarna ${dec(cr,1)} gånger så många som staden bär (2026: ${dec(d0.crowding,1)}) – ${dec(vpr,1)} per invånare en vanlig dag (2026: ${dec(d0.visitorsPerResident,1)})${vpr>3?', och på broarna kring Rialto och San Marco är invånarna sällsynta':''}.`,
          `With the overnight guests the visitors are ${dec(cr,1)} times as many as the city can carry (2026: ${dec(d0.crowding,1)}) – ${dec(vpr,1)} per resident on an ordinary day (2026: ${dec(d0.visitorsPerResident,1)})${vpr>3?', and on the bridges around Rialto and San Marco residents are rare':''}.`,
          `Con gli ospiti che pernottano i visitatori sono ${dec(cr,1)} volte quanti la città può sostenere (2026: ${dec(d0.crowding,1)}) – ${dec(vpr,1)} per abitante in un giorno qualunque (2026: ${dec(d0.visitorsPerResident,1)})${vpr>3?', e sui ponti intorno a Rialto e San Marco i residenti sono rari':''}.`)
      :cr>=1.005?t(`Med de övernattande gästerna är besökarna ungefär så många som staden bär – ${dec(vpr,1)} per invånare en vanlig dag (2026: ${dec(d0.visitorsPerResident,1)}).`,
          `With the overnight guests the visitors are about as many as the city can carry – ${dec(vpr,1)} per resident on an ordinary day (2026: ${dec(d0.visitorsPerResident,1)}).`,
          `Con gli ospiti che pernottano i visitatori sono più o meno quanti la città può sostenere – ${dec(vpr,1)} per abitante in un giorno qualunque (2026: ${dec(d0.visitorsPerResident,1)}).`)
      :t(`Med de övernattande gästerna är besökarna inte fler än staden bär – ${dec(vpr,1)} per invånare en vanlig dag (2026: ${dec(d0.visitorsPerResident,1)})${vpr<1.2&&d.pop>=d0.pop?' – och Venedig är en stad att bo i igen, som besökarna delar med venetianerna':''}.`,
          `With the overnight guests the visitors are no more than the city can carry – ${dec(vpr,1)} per resident on an ordinary day (2026: ${dec(d0.visitorsPerResident,1)})${vpr<1.2&&d.pop>=d0.pop?' – and Venice is a city to live in again, which the visitors share with the Venetians':''}.`,
          `Con gli ospiti che pernottano i visitatori non sono più di quanti la città possa sostenere – ${dec(vpr,1)} per abitante in un giorno qualunque (2026: ${dec(d0.visitorsPerResident,1)})${vpr<1.2&&d.pop>=d0.pop?' – e Venezia è di nuovo una città da abitare, che i visitatori condividono con i veneziani':''}.`)],
    now?t(`Besökarna stannar ${mn(d.guestNights,2)} nätter om året i den historiska staden och på öarna – nio av tio är utländska gäster – och turistlägenheterna tog 31,5 % av ankomsterna 2025, mot 19,4 % 2019.`,
        `Visitors stay ${mn(d.guestNights,2)} nights a year in the historic city and on the islands – nine in ten are foreign guests – and tourist apartments took 31.5% of arrivals in 2025, against 19.4% in 2019.`,
        `I visitatori trascorrono ${mn(d.guestNights,2)} di notti all'anno nella città storica e nelle isole – nove su dieci sono stranieri – e gli appartamenti turistici hanno accolto il 31,5% degli arrivi nel 2025, contro il 19,4% del 2019.`)
    :t(`Besökarna stannar ${mn(d.guestNights)} nätter om året${was(mn(d0.guestNights))}.`,`Visitors stay ${mn(d.guestNights)} nights a year${was(mn(d0.guestNights))}.`,`I visitatori trascorrono ${mn(d.guestNights)} di notti all'anno${was(mn(d0.guestNights))}.`),
  ].flat().filter(Boolean).join(' ')});

  // 3. The sea and MOSE: the sea's rise, the gates and how often they close, the lagoon behind them, St Mark's Square,
  // the raised walkways and the city lifted with seawater, the drinking water (research/deep/hav-tidvatten; model.js
  // FLOOD; levers.js anpassning, mose and beredskap). The model gives its levels against the city's stones: once the
  // city is lifted (anpassning's third level) the city and its tide gauge rise with it, so d.seaRise – the sea against
  // the stones – is the sea's own rise less the lift (d.uplift).
  const adapt=lvl('anpassning'),gate=lvl('mose'),prep=lvl('beredskap');
  const lift=d.uplift||0,sea=d.seaRise+lift,out=MEAN+d.seaRise,shut=d.lagoonClosed,closed=shut>.98;
  const P=d.protection,C=d.barrierCloses,n=Math.round(d.moseClosures),smf=Math.round(d.stMarksFloods);
  const behind=closed?t(' bakom de stängda inloppen',' behind the closed inlets',' dietro le bocche di porto chiuse'):d.levelInside<d.level100-.05?t(' bakom de stängda luckorna',' behind the closed gates',' dietro le paratoie chiuse'):'';
  // Raising the walkways from 1.10 towards 1.20 m costs at most PARAMS.heritageCost of the heritage (model.js; lifting
  // the city whole does not); more than two points beyond that is water that got in.
  const raised=Math.max(0,Math.min(1,(Math.min(P,1.2)-1.1)/.1)),allowed=(PARAMS.heritageCost||0)*raised;
  const why=gate>L2?t(` – en reglerad lagun: luckorna reses vid varje tidvatten över ${cm(C)} cm, och fartygen går genom slussar –`,` – a regulated lagoon: the gates rise at every tide above ${cm(C)} cm, and ships pass through locks –`,` – una laguna regolata: le paratoie si alzano a ogni marea oltre ${agli(cm(C))==='agli'?'gli':'i'} ${cm(C)} cm, e le navi passano dalle conche –`)
    :gate>L1?t(` – staden har valt att resa luckorna redan vid ${cm(C)} cm, så att färre tidvatten når Markusplatsen –`,` – the city has chosen to raise the gates from ${cm(C)} cm, so that fewer tides reach St Mark's Square –`,` – la città ha scelto di alzare le paratoie già a ${cm(C)} cm, perché meno maree raggiungano piazza San Marco –`)
    :C>1.105?t(` – de höjda gångvägarna låter luckorna vänta tills ett tidvatten över ${cm(C)} cm väntas –`,` – the raised walkways let the gates wait until a tide above ${cm(C)} cm is forecast –`,` – i percorsi rialzati permettono alle paratoie di aspettare finché non è prevista una marea oltre ${agli(cm(C))==='agli'?'gli':'i'} ${cm(C)} cm –`)
    :t(', reses fortfarande när tidvatten över 110 cm väntas,',', still rising whenever a tide above 110 cm is forecast,',', alzandosi ancora quando è prevista una marea oltre i 110 cm,');
  const ready=prep>L3?t('; staden klarar sig själv i en kris – vatten, mat och el räcker i 90 dagar','; the city can manage on its own in a crisis – water, food and power last 90 days','; in caso di crisi la città se la cava da sola – acqua, cibo ed elettricità bastano per 90 giorni')
    :prep>L2?t('; en andra vattenkälla, lager för 30 dagar och reservkraft på öarna gör staden mindre sårbar','; a second water source, stocks for 30 days and backup power on the islands make the city less vulnerable',"; una seconda fonte d'acqua, scorte per 30 giorni ed energia di riserva sulle isole rendono la città meno vulnerabile")
    :prep>L1?t('; ledningarna förnyas, och ett brandvattennät skyddar centrum','; the mains are being renewed, and a fire-water network protects the centre',"; le condotte si rinnovano, e una rete antincendio protegge il centro"):'';
  S.push({title:t('Havet och MOSE','The sea and MOSE','Il mare e il MOSE'),text:[
    now?t('Medelvattnet vid Punta della Salute står 35 cm över mareografens nolla från 1897 och har stigit 4,8 mm om året sedan 1993, ungefär hälften av det sättning; ett hundraårshögvatten når uppskattningsvis 210 cm.',
        "The mean sea level at Punta della Salute stands 35 cm above the tide gauge's 1897 zero and has risen 4.8 mm a year since 1993, about half of it subsidence; a 100-year high tide reaches an estimated 210 cm.",
        "Il livello medio del mare a Punta della Salute è 35 cm sopra lo zero mareografico del 1897 ed è salito di 4,8 mm l'anno dal 1993, per circa metà a causa della subsidenza; un'acqua alta centenaria arriva a circa 210 cm.")
    :lift>=.005?t(`Havet står ${cm(sea)} cm högre än 2026. Men staden har lyfts ${cm(lift)} cm med havsvatten som pumpats ned 600–800 m under lagunen, så mot dess stenar – och mot mareografen vid Punta della Salute, som lyfts med dem – står havet ${cm(d.seaRise)} cm högre, och ett hundraårshögvatten når ${cm(d.level100)} cm (2026: uppskattningsvis 210).`,
        `The sea stands ${cm(sea)} cm higher than in 2026. But the city has been raised ${cm(lift)} cm by pumping seawater 600–800 m down under the lagoon, so against its stones – and against the tide gauge at Punta della Salute, raised with them – the sea stands ${cm(d.seaRise)} cm higher, and a 100-year high tide reaches ${cm(d.level100)} cm (2026: an estimated 210).`,
        `Il mare è ${cm(sea)} cm più alto che nel 2026. Ma la città è stata sollevata di ${cm(lift)} cm pompando acqua di mare 600–800 m sotto la laguna, così contro le sue pietre – e contro il mareografo di Punta della Salute, sollevato con loro – il mare è più alto di ${cm(d.seaRise)} cm, e un'acqua alta centenaria arriva a ${cm(d.level100)} cm (2026: circa 210).`)
    :t(`Havet står ${cm(sea)} cm högre än 2026: dess medelnivå ligger ${cm(out)} cm över mareografens nolla, och ett hundraårshögvatten når ${cm(d.level100)} cm (2026: 35 och uppskattningsvis 210).`,
        `The sea stands ${cm(sea)} cm higher than in 2026: its mean level lies ${cm(out)} cm above the tide gauge's zero, and a 100-year high tide reaches ${cm(d.level100)} cm (2026: 35 and an estimated 210).`,
        `Il mare è ${cm(sea)} cm più alto che nel 2026: il suo livello medio è ${cm(out)} cm sopra lo zero mareografico, e un'acqua alta centenaria arriva a ${cm(d.level100)} cm (2026: 35 e circa 210).`),
    !now&&out>FLOOD.streets+.005?t(`Havets medelnivå står nu ${cm(out-FLOOD.streets)} cm över Markusplatsens stenar${under(out)>=.005?`, och ${pct(under(out))} av stadens gångytor ligger lägre än havet`:''}.`,
        `The sea's mean level now stands ${cm(out-FLOOD.streets)} cm above the stones of St Mark's Square${under(out)>=.005?`, and ${pct(under(out))} of the city's walkways lie below the sea`:''}.`,
        `Il livello medio del mare è ormai ${cm(out-FLOOD.streets)} cm sopra il selciato di piazza San Marco${under(out)>=.005?`, e ${il(under(out))} dei percorsi pedonali della città è più in basso del mare`:''}.`):'',
    now?t('MOSE stängdes 49 gånger säsongen 2025/26 – i snitt 26 gånger om året sedan 2020 – fast barriärerna byggdes för 3–5 stängningar om året och för 60 cm högre hav. De reses när tidvatten över 110 cm väntas; mellan 80 och 110 cm står de öppna, och då svämmar Markusplatsen över.',
        "MOSE closed 49 times in the 2025/26 season – 26 times a year on average since 2020 – although the barriers were built for 3–5 closures a year and a sea 60 cm higher. They rise when a tide above 110 cm is forecast; between 80 and 110 cm they stay open, and St Mark's Square floods.",
        "Il MOSE si è chiuso 49 volte nella stagione 2025/26 – in media 26 volte l'anno dal 2020 – anche se le barriere erano state progettate per 3–5 chiusure l'anno e per un mare più alto di 60 cm. Si alzano quando è prevista una marea oltre i 110 cm; tra 80 e 110 cm restano aperte, e piazza San Marco si allaga.")
    :closed?t(`Inloppen är stängda för gott: lagunen hålls nere med pumpar, i snitt ${cm(d.lagoonMean)} cm över mareografens nolla, och fartygen går genom slussen vid Malamocco${sea>.6?' – havet utanför har stigit mer än de 60 cm som barriärerna byggdes för':''}.`,
        `The inlets are closed for good: the lagoon is held down by pumps, on average ${cm(d.lagoonMean)} cm above the tide gauge's zero, and ships pass through the lock at Malamocco${sea>.6?' – the sea outside has risen more than the 60 cm the barriers were built for':''}.`,
        `Le bocche di porto sono chiuse per sempre: la laguna è tenuta bassa con le pompe, in media ${cm(d.lagoonMean)} cm sopra lo zero mareografico, e le navi passano dalla conca di Malamocco${sea>.6?' – il mare fuori è salito più dei 60 cm per cui le barriere erano state progettate':''}.`)
    :n>=360?t(`MOSE reser sig vid nästan varje högvatten, och lagunen är stängd mot havet ${pct(shut)} av årets timmar${was(pct(d0.lagoonClosed))}${gate>L2?' – en reglerad lagun, där fartygen går genom slussar':''}.`,
        `MOSE rises at almost every high tide, and the lagoon is closed to the sea ${pct(shut)} of the hours in the year${was(pct(d0.lagoonClosed))}${gate>L2?' – a regulated lagoon, where ships pass through locks':''}.`,
        `Il MOSE si alza quasi a ogni alta marea, e la laguna è chiusa al mare per ${il(shut)} delle ore dell'anno${was(pct(d0.lagoonClosed))}${gate>L2?' – una laguna regolata, dove le navi passano dalle conche':''}.`)
    :n<1?t(`MOSE behöver nästan aldrig resas: luckorna väntar tills ett tidvatten över ${cm(C)} cm väntas, och lagunen står öppen mot havet året runt.`,
        `MOSE hardly ever needs to rise: the gates wait until a tide above ${cm(C)} cm is forecast, and the lagoon stays open to the sea all year.`,
        `Il MOSE non deve quasi mai alzarsi: le paratoie aspettano finché non è prevista una marea oltre ${agli(cm(C))==='agli'?'gli':'i'} ${cm(C)} cm, e la laguna resta aperta al mare tutto l'anno.`)
    :t(`MOSE stängs ${n} ${times(n)} om året (2026: ${Math.round(d0.moseClosures)})${why} och lagunen är stängd mot havet ${pct(shut)} av årets timmar${was(pct(d0.lagoonClosed))}.`,
        `MOSE closes ${n} ${times(n)} a year (2026: ${Math.round(d0.moseClosures)})${why} and the lagoon is closed to the sea ${pct(shut)} of the hours in the year${was(pct(d0.lagoonClosed))}.`,
        `Il MOSE si chiude ${n} ${times(n)} l'anno (2026: ${Math.round(d0.moseClosures)})${why} e la laguna è chiusa al mare per ${il(shut)} delle ore dell'anno${was(pct(d0.lagoonClosed))}.`),
    !now&&!closed&&sea>.6?t('Havet har stigit mer än de 60 cm som barriärerna byggdes för, och varje stängning stänger ute havets vatten och slam, så att lagunen blir varmare och mer instängd.',
        "The sea has risen more than the 60 cm the barriers were built for, and every closure shuts out the sea's water and silt, leaving the lagoon warmer and more enclosed.",
        "Il mare è salito più dei 60 cm per cui le barriere erano state progettate, e ogni chiusura tiene fuori l'acqua e i sedimenti del mare, lasciando la laguna più calda e più chiusa."):'',
    now?'':smf>=700?t('Markusplatsen står under vatten vid varje högvatten, två gånger om dygnet (2026: omkring 90 gånger om året).',"St Mark's Square is under water at every high tide, twice a day (2026: about 90 times a year).",'Piazza San Marco finisce sott\'acqua a ogni alta marea, due volte al giorno (2026: circa 90 volte l\'anno).')
      :smf<1?t('Markusplatsen står torr året runt (2026: vatten omkring 90 gånger om året).',"St Mark's Square stays dry all year round (2026: water about 90 times a year).","Piazza San Marco resta asciutta tutto l'anno (2026: acqua circa 90 volte l'anno).")
      :t(`Vattnet når Markusplatsen ${smf} ${times(smf)} om året (2026: omkring 90).`,`The water reaches St Mark's Square ${smf} ${times(smf)} a year (2026: about 90).`,`L'acqua arriva in piazza San Marco ${smf} ${times(smf)} l'anno (2026: circa 90).`),
    now?t(`Med MOSE uppe stannar ett hundraårshögvatten uppskattningsvis kring ${cm(d.levelInside)} cm i staden – men det räcker för att Markusplatsen och ${pct(d.floodShare)} av gångvägarna ska stå under vatten.`,
        `With MOSE up, a 100-year high tide stops at an estimated ${cm(d.levelInside)} cm in the city – but that is enough to put St Mark's Square and ${pct(d.floodShare)} of the walkways under water.`,
        `Con il MOSE alzato un'acqua alta centenaria si ferma in città intorno ${agli(cm(d.levelInside))} ${cm(d.levelInside)} cm – ma basta perché piazza San Marco e ${il(d.floodShare)} dei percorsi pedonali finiscano sott'acqua.`)
    :d.floodShare>=.005?t(`Vid ett hundraårshögvatten står lagunen kring ${cm(d.levelInside)} cm i staden${behind}, och ${pct(d.floodShare)} av gångvägarna hamnar under vatten${was(pct(d0.floodShare))}.`,
        `In a 100-year high tide the lagoon stands at about ${cm(d.levelInside)} cm in the city${behind}, and ${pct(d.floodShare)} of the walkways go under water${was(pct(d0.floodShare))}.`,
        `Con un'acqua alta centenaria la laguna arriva in città intorno ${agli(cm(d.levelInside))} ${cm(d.levelInside)} cm${behind}, e ${il(d.floodShare)} dei percorsi pedonali finisce sott'acqua${was(pct(d0.floodShare))}.`)
    :t(`Ett hundraårshögvatten lämnar lagunen kring ${cm(d.levelInside)} cm${behind}, ${cm(P-d.levelInside)>=2?`${cm(P-d.levelInside)} cm under gångvägarnas skydd`:'strax under gångvägarnas skydd'}.`,
        `A 100-year high tide leaves the lagoon at about ${cm(d.levelInside)} cm${behind}, ${cm(P-d.levelInside)>=2?`${cm(P-d.levelInside)} cm below the walkways' protection`:"just below the walkways' protection"}.`,
        `Un'acqua alta centenaria lascia la laguna intorno ${agli(cm(d.levelInside))} ${cm(d.levelInside)} cm${behind}, ${cm(P-d.levelInside)>=2?`${cm(P-d.levelInside)} cm sotto la protezione dei percorsi pedonali`:'appena sotto la protezione dei percorsi pedonali'}.`),
    now?'':adapt>L2?t(`Gångvägarna har höjts mot 120 cm där trösklarna tillåter, och bottenvåningarna har gjorts om för vattnet: de lägsta gatorna står torra upp till ${cm(P)} cm (2026: 80).`,
        `The walkways have been raised towards 120 cm where the doorsteps allow, and the ground floors have been rebuilt for the water: the lowest streets stay dry up to ${cm(P)} cm (2026: 80).`,
        `I percorsi pedonali sono stati rialzati verso i 120 cm dove le soglie lo consentono, e i piani terra sono stati rifatti per l'acqua: le calli più basse restano asciutte fino a ${cm(P)} cm (2026: 80).`)
      :adapt>L1?t(`Insulan San Marco och de lägsta kajerna tätas mot 110 cm: de lägsta gatorna står torra upp till ${cm(P)} cm (2026: 80).`,
        `The insula of San Marco and the lowest quays are being sealed towards 110 cm: the lowest streets stay dry up to ${cm(P)} cm (2026: 80).`,
        `L'insula di San Marco e le rive più basse vengono rese stagne verso i 110 cm: le calli più basse restano asciutte fino a ${cm(P)} cm (2026: 80).`)
      :P>d0.protection+.025?t(`Arbetet med att täta insulan San Marco går långsamt: de lägsta gatorna står torra upp till ${cm(P)} cm (2026: 80).`,
        `The work to seal the insula of San Marco is slow: the lowest streets stay dry up to ${cm(P)} cm (2026: 80).`,
        `I lavori per rendere stagna l'insula di San Marco vanno a rilento: le calli più basse restano asciutte fino a ${cm(P)} cm (2026: 80).`)
      :t('Kajerna är lika låga som 2026: Markusplatsen svämmar över så snart tidvattnet når 80 cm och luckorna står öppna.',"The quays are as low as in 2026: St Mark's Square floods as soon as the tide reaches 80 cm and the gates are open.",'Le rive sono basse come nel 2026: piazza San Marco si allaga appena la marea arriva a 80 cm e le paratoie sono aperte.'),
    !now&&d.heritage<1-allowed-.02?t('Saltvattnet har tagit hårt på kulturarvet: det har ätit sig upp i murarna, och flera bottenvåningar har övergetts.',
        'The salt water has been hard on the heritage: it has crept up into the walls, and several ground floors have been abandoned.',
        "L'acqua salata ha colpito duramente il patrimonio: è risalita nei muri, e diversi piani terra sono stati abbandonati.")
    :!now&&d.heritage<.985&&raised>0?t('Världsarvet står kvar, men höjda kajer och nya trösklar har förändrat stadens möte med vattnet.',
        'The World Heritage site still stands, but raised quays and new doorsteps have changed the way the city meets the water.',
        "Venezia resta patrimonio mondiale, ma rive rialzate e nuove soglie hanno cambiato l'incontro della città con l'acqua.")
    :now?t('Markuskyrkans förhall, stadens lägsta golv på 63 cm, stod under vatten mer än 200 gånger om året innan en barriär av glas byggdes runt kyrkan 2022.',
        "The narthex of St Mark's, the city's lowest floor at 63 cm, was under water more than 200 times a year until a glass barrier was built round the church in 2022.",
        "Il nartece della basilica di San Marco, il pavimento più basso della città a 63 cm, finiva sott'acqua più di 200 volte l'anno, finché nel 2022 è stata costruita una barriera di vetro intorno alla chiesa."):'',
    now?t('Dricksvattnet pumpas ur 34 djupa brunnar på fastlandet, och 41,7 % av vattnet i kommunens nät försvinner i läckor.',
        "Drinking water is pumped from 34 deep wells on the mainland, and 41.7% of the water in the municipality's network is lost to leaks.",
        "L'acqua potabile viene pompata da 34 pozzi profondi in terraferma, e il 41,7% dell'acqua della rete comunale si perde per strada.")
    :t(`${pct(d.waterLoss)} av vattnet försvinner i ledningarna${was(pct(d0.waterLoss))}${ready}.`,`${pct(d.waterLoss)} of the water is lost in the mains${was(pct(d0.waterLoss))}${ready}.`,`${Il(d.waterLoss)} dell'acqua si perde nelle condotte${was(pct(d0.waterLoss))}${ready}.`),
    !now&&d.water<d0.water-.05?t('En torr sommar tränger saltvattnet allt längre upp i floderna, och dricksvattnet är mindre säkert än 2026.','In a dry summer the salt water creeps further up the rivers, and the drinking water is less secure than in 2026.',"In un'estate secca l'acqua salata risale sempre più su per i fiumi, e l'acqua potabile è meno sicura che nel 2026."):'',
  ].filter(Boolean).join(' ')});

  // 4. The lagoon and its salt marshes: the marshes that drown when the sea outruns their sediment, the water's
  // status, the closed gates, the Rialto market and the lagoon's food (research/deep/lagun-natur-mat; model.js;
  // levers.js hav and regionalt).
  const hav=lvl('hav'),food=lvl('regionalt'),marsh=d.saltMarsh,m=Math.round(marsh),w=d.waters,stalls=Math.round(d.fishStalls);
  const choke=shut>.1?t(', och varje stängning håller ute slammet som stormfloderna förr förde dit',', and every closure shuts out the silt the storm surges used to bring',', e ogni chiusura tiene fuori i sedimenti che un tempo portavano le mareggiate'):'';
  S.push({title:t('Lagunen och saltängarna','The lagoon and its salt marshes','La laguna e le barene'),text:[
    now?t('Lagunen har omkring 40 km² saltängar kvar av 158 km² år 1912, och omkring en halv kvadratkilometer går förlorad varje år, eftersom havet stiger fortare än saltängarna hinner växa; 15–16 km² har byggts upp igen med muddrat sediment.',
        'The lagoon has about 40 km² of salt marsh left of 158 km² in 1912, and about half a square kilometre is lost every year, because the sea rises faster than the marshes can grow; 15–16 km² have been rebuilt with dredged sediment.',
        "La laguna conserva circa 40 km² di barene dei 158 km² del 1912, e ogni anno ne perde circa mezzo chilometro quadrato, perché il mare sale più in fretta di quanto le barene riescano a crescere; 15–16 km² sono stati ricostruiti con i fanghi di dragaggio.")
    :marsh<1?(closed?t('Saltängarna är borta: havet steg fortare än de kunde växa, och de stängda inloppen tog slammet från dem. Bakom inloppen har lagunen blivit en sjö.',
          'The salt marshes are gone: the sea rose faster than they could grow, and the closed inlets took their silt. Behind the inlets the lagoon has become a lake.',
          'Le barene sono scomparse: il mare è salito più in fretta di quanto potessero crescere, e le bocche chiuse hanno tolto loro i sedimenti. Dietro le bocche la laguna è diventata un lago.')
      :t(`Saltängarna är borta: havet steg fortare än de kunde växa${choke}. Lagunen har blivit en grund vik där vågorna rör upp bottnen.`,
          `The salt marshes are gone: the sea rose faster than they could grow${choke}. The lagoon has become a shallow bay where the waves stir up the bottom.`,
          `Le barene sono scomparse: il mare è salito più in fretta di quanto potessero crescere${choke}. La laguna è diventata uno specchio d'acqua poco profondo dove le onde sollevano il fondale.`))
    :marsh>d0.saltMarsh+3?t(`Lagunen har ${m} km² saltängar (2026: omkring 40): ${hav>L2?'muddrat sediment och slam som floderna får föra till lagunen igen bygger nya varje år':'muddermassorna har blivit nya saltängar'}${hav>L1?', och kanterna skyddas med faskiner':''}. De dämpar vågorna, binder kol och ger fåglarna platser att häcka.`,
        `The lagoon has ${m} km² of salt marsh (2026: about 40): ${hav>L2?'dredged sediment and silt the rivers may carry to the lagoon again build new ones every year':'the dredged sediment has become new salt marsh'}${hav>L1?', and their edges are protected with fascines':''}. They calm the waves, store carbon and give the birds places to nest.`,
        `La laguna ha ${m} km² di barene (2026: circa 40): ${hav>L2?'i fanghi di dragaggio e i sedimenti che i fiumi possono di nuovo portare in laguna ne costruiscono di nuove ogni anno':'i fanghi di dragaggio sono diventati nuove barene'}${hav>L1?', e i loro margini sono protetti con fascine':''}. Smorzano le onde, trattengono carbonio e offrono agli uccelli posti dove nidificare.`)
    :marsh<d0.saltMarsh-3&&hav>L1?t(`Lagunen har ${m} km² saltängar kvar (2026: omkring 40): de nya som byggs av muddrat sediment hinner inte ikapp dem som havet dränker${choke}.`,
        `The lagoon has ${m} km² of salt marsh left (2026: about 40): the new ones built from dredged sediment cannot keep up with those the sea drowns${choke}.`,
        `In laguna restano ${m} km² di barene (2026: circa 40): le nuove costruite con i fanghi di dragaggio non tengono il passo con quelle che il mare sommerge${choke}.`)
    :marsh<d0.saltMarsh-3?t(`Lagunen har ${m} km² saltängar kvar (2026: omkring 40) – havet stiger fortare än de hinner växa${choke}.`,
        `The lagoon has ${m} km² of salt marsh left (2026: about 40) – the sea rises faster than they can grow${choke}.`,
        `In laguna restano ${m} km² di barene (2026: circa 40) – il mare sale più in fretta di quanto riescano a crescere${choke}.`)
    :t(`Lagunen har omkring ${m} km² saltängar, ungefär som 2026: de nya som byggs väger ungefär upp dem som havet tar.`,
        `The lagoon has about ${m} km² of salt marsh, much as in 2026: the new ones being built roughly make up for those the sea takes.`,
        `La laguna ha circa ${m} km² di barene, più o meno come nel 2026: le nuove compensano più o meno quelle che il mare si porta via.`),
    now?t('Inget av lagunens elva klassade vattenområden har god ekologisk status, och inget av fjorton har god kemisk status.',
        "None of the lagoon's eleven classified water bodies has good ecological status, and none of fourteen has good chemical status.",
        'Nessuno degli undici corpi idrici classificati della laguna è in buono stato ecologico, e nessuno dei quattordici in buono stato chimico.')
    :w>=.6?t(`Lagunen är på väg mot god ekologisk status, som EU:s vattendirektiv kräver (index ${dec(w,2)}; 2026: ${dec(d0.waters,2)}, då inget av elva vattenområden hade god status).`,
        `The lagoon is on its way to good ecological status, as the EU Water Framework Directive requires (index ${dec(w,2)}; 2026: ${dec(d0.waters,2)}, when none of eleven water bodies had good status).`,
        `La laguna è sulla strada del buono stato ecologico richiesto dalla direttiva europea sulle acque (indice ${dec(w,2)}; 2026: ${dec(d0.waters,2)}, quando nessuno degli undici corpi idrici era in buono stato).`)
    :w>d0.waters+.05?t(`Lagunen mår bättre än 2026 (index ${dec(w,2)} mot ${dec(d0.waters,2)}) men har ännu inte god ekologisk status.`,
        `The lagoon is healthier than in 2026 (index ${dec(w,2)} against ${dec(d0.waters,2)}) but has not yet reached good ecological status.`,
        `La laguna sta meglio che nel 2026 (indice ${dec(w,2)} contro ${dec(d0.waters,2)}) ma non ha ancora raggiunto il buono stato ecologico.`)
    :w>=d0.waters-.03?t('Lagunens ekologiska status är lika dålig som 2026, då inget av elva vattenområden hade god status.','The lagoon\'s ecological status is as poor as in 2026, when none of eleven water bodies had good status.','Lo stato ecologico della laguna è scarso come nel 2026, quando nessuno degli undici corpi idrici era in buono stato.')
    :t(`Lagunen mår sämre än 2026 (index ${dec(w,2)} mot ${dec(d0.waters,2)}): ${closed?'den är stängd mot havet för gott, och vattnet står stilla och värms':shut>=.5?'den är stängd mot havet större delen av året, och vattnet står stilla och värms':shut>.1?`luckorna står stängda ${pct(shut)} av årets timmar, och det stilla vattnet värms`:'varmare vatten och färre saltängar gör den sjukare'}.`,
        `The lagoon is in worse health than in 2026 (index ${dec(w,2)} against ${dec(d0.waters,2)}): ${closed?'it is closed to the sea for good, and its water stands still and warms':shut>=.5?'it is closed to the sea most of the year, and its water stands still and warms':shut>.1?`the gates are closed ${pct(shut)} of the hours in the year, and the still water warms`:'warmer water and fewer salt marshes make it sicker'}.`,
        `La laguna sta peggio che nel 2026 (indice ${dec(w,2)} contro ${dec(d0.waters,2)}): ${closed?"è chiusa al mare per sempre, e l'acqua ristagna e si scalda":shut>=.5?"è chiusa al mare per gran parte dell'anno, e l'acqua ristagna e si scalda":shut>.1?`le paratoie restano chiuse per ${il(shut)} delle ore dell'anno, e l'acqua ferma si scalda`:"l'acqua più calda e le barene sempre meno la fanno ammalare"}.`),
    !now&&d.bloom>.4&&d.bloom>d0.bloom+.05?t('Varma somrar blommar alger och syret tar slut i de grunda, instängda delarna av lagunen, som på 1980-talet.','In warm summers algae bloom and the oxygen runs out in the shallow, enclosed parts of the lagoon, as in the 1980s.',"Nelle estati calde le alghe fioriscono e l'ossigeno si esaurisce nelle parti più basse e chiuse della laguna, come negli anni Ottanta."):'',
    now?t('Omkring 24 000 flamingor övervintrade i lagunen 2025.','Some 24,000 flamingos wintered in the lagoon in 2025.',"Nell'inverno 2025 in laguna hanno svernato circa 24.000 fenicotteri.")
    :hav>L2&&w>=d0.waters-.03?t('Sjögräs planteras tillsammans med fiskarna, och i fiskefria zoner får fisken växa till.','Seagrass is planted together with the fishermen, and in no-fishing zones the fish are left to grow.','Le fanerogame si piantano insieme ai pescatori, e nelle zone senza pesca il pesce ha il tempo di crescere.'):'',
    now?t('Rialtomarknaden har sju fiskstånd kvar av ett trettiotal på 1980-talet och grönsaksstånden har gått från 90 till under 13, medan musselskörden föll från omkring 40 000 ton 1999 till 2 159 ton 2019.',
        'The Rialto market has seven fish stalls left of some thirty in the 1980s and its vegetable stalls have gone from 90 to fewer than 13, while the clam harvest fell from about 40,000 tonnes in 1999 to 2,159 tonnes in 2019.',
        'Al mercato di Rialto restano sette banchi del pesce dei circa trenta degli anni Ottanta e i banchi della verdura sono passati da 90 a meno di 13, mentre la raccolta di vongole è scesa da circa 40.000 tonnellate nel 1999 a 2159 nel 2019.')
    :food>L3?t(`Lagunens matråd ser till att öarna, fiskevallarna och Rialto föder staden, och vid Rialto finns ${stalls} fiskstånd (2026: ${Math.round(d0.fishStalls)}).`,
        `A lagoon food council makes sure the islands, the fish farms and the Rialto feed the city, and the Rialto has ${stalls} fish stalls (2026: ${Math.round(d0.fishStalls)}).`,
        `Un consiglio del cibo della laguna fa sì che le isole, le valli da pesca e Rialto nutrano la città, e a Rialto ci sono ${stalls} banchi del pesce (2026: ${Math.round(d0.fishStalls)}).`)
    :food>L2?t(`Rialto lever igen: odlarna från Sant'Erasmo, fiskevallarna och musselodlarna säljer direkt, och marknaden har ${stalls} fiskstånd (2026: ${Math.round(d0.fishStalls)}).`,
        `The Rialto is alive again: the growers from Sant'Erasmo, the fish farms and the clam farmers sell direct, and the market has ${stalls} fish stalls (2026: ${Math.round(d0.fishStalls)}).`,
        `Rialto è tornato a vivere: gli ortolani di Sant'Erasmo, le valli da pesca e chi alleva vongole vendono direttamente, e il mercato ha ${stalls} banchi del pesce (2026: ${Math.round(d0.fishStalls)}).`)
    :food>L1?t(`Skolornas och omsorgens kök köper från Sant'Erasmo och lagunens fiskare, och Pescherian har rustats: vid Rialto finns ${stalls} fiskstånd (2026: ${Math.round(d0.fishStalls)}).`,
        `The kitchens of schools and care homes buy from Sant'Erasmo and the lagoon's fishermen, and the Pescheria has been restored: the Rialto has ${stalls} fish stalls (2026: ${Math.round(d0.fishStalls)}).`,
        `Le cucine di scuole e case di riposo comprano da Sant'Erasmo e dai pescatori della laguna, e la Pescheria è stata restaurata: a Rialto ci sono ${stalls} banchi del pesce (2026: ${Math.round(d0.fishStalls)}).`)
    :stalls<Math.round(d0.fishStalls)?t(`Rialtomarknaden har krympt till ${stalls} fiskstånd (2026: ${Math.round(d0.fishStalls)}), och nästan all mat kommer över bron från fastlandet.`,
        `The Rialto market has shrunk to ${stalls} fish stalls (2026: ${Math.round(d0.fishStalls)}), and almost all the food comes over the bridge from the mainland.`,
        `Il mercato di Rialto si è ridotto a ${stalls} banchi del pesce (2026: ${Math.round(d0.fishStalls)}), e quasi tutto il cibo arriva dalla terraferma attraverso il ponte.`)
    :t(`Rialtomarknaden har ${stalls} fiskstånd (2026: ${Math.round(d0.fishStalls)}).`,`The Rialto market has ${stalls} fish stalls (2026: ${Math.round(d0.fishStalls)}).`,`Il mercato di Rialto ha ${stalls} banchi del pesce (2026: ${Math.round(d0.fishStalls)}).`),
    t(`Uppskattningsvis ${pct(d.foodRegional)} av maten venetianerna äter kommer från lagunen och Veneto${was(pct(d0.foodRegional))}.`,
      `An estimated ${pct(d.foodRegional)} of the food Venetians eat comes from the lagoon and the Veneto${was(pct(d0.foodRegional))}.`,
      `Circa ${il(d.foodRegional)} del cibo che mangiano i veneziani viene, secondo una stima, dalla laguna e dal Veneto${was(pct(d0.foodRegional))}.`),
  ].filter(Boolean).join(' ')});

  // 5. Boats and air: the vaporetti, taxis and transport boats, the wakes, the cruise ships and the air at Rio Novo
  // (research/deep/energi-resor; levers.js kollektivt and hamn).
  const boat=lvl('kollektivt'),port=lvl('hamn'),be=d.boatElectric,no2=Math.round(d.no2),cruise=int(near(d.cruisePassengers,1000)),cruise0=int(d0.cruisePassengers);
  // Fewer taxis and transport boats: shared taxis and freight (kollektivt, at any level in the model) and fewer day visitors.
  const shared=boat>L1,fewerDay=d.dayVisitors<.85*d0.dayVisitors;
  S.push({title:t('Båtar och luft','Boats and air',"Le barche e l'aria"),text:[
    now?t('Vattenbussarna och de flesta andra båtar går på diesel – ACTV har en enda hybridvaporetto av 148 båtar – och båtar och fartyg står för 46,7 % av kommunens kväveoxider.',
        "The vaporetti and most other boats run on diesel – ACTV has a single hybrid vaporetto among 148 boats – and boats and ships produce 46.7% of the municipality's nitrogen oxides.",
        'I vaporetti e quasi tutte le altre barche vanno a gasolio – ACTV ha un solo vaporetto ibrido su 148 mezzi – e barche e navi producono il 46,7% degli ossidi di azoto del Comune.')
    :[t(`${pct(be)} av båttrafiken går på el${was(pct(d0.boatElectric))}.`,`${pct(be)} of boat traffic runs on electricity${was(pct(d0.boatElectric))}.`,`${Il(be)} del traffico acqueo va a elettricità${was(pct(d0.boatElectric))}.`),
      boat>L3?t(`Tysta kanaler: vaporetti och sopbåtar laddar vid bryggorna${be>.9?' – nästan allt på vattnet går på el':''}.`,`Quiet canals: vaporetti and refuse boats charge at the landing stages${be>.9?' – almost everything on the water runs on electricity':''}.`,`Canali silenziosi: vaporetti e barche delle immondizie si ricaricano agli imbarcaderi${be>.9?" – quasi tutto sull'acqua va a elettricità":''}.`)
      :boat>L2?t('Eldrivna vaporetti och sopbåtar laddar vid bryggorna, och varorna samlastas.','Electric vaporetti and refuse boats charge at the landing stages, and goods are carried together.','Vaporetti e barche delle immondizie elettrici si ricaricano agli imbarcaderi, e le merci viaggiano insieme.')
      :boat>L1?t('Hybridvaporetti går på Canal Grande, och fartkameror vaktar svallvågorna i alla kanaler.','Hybrid vaporetti run on the Grand Canal, and speed cameras watch for wakes in every canal.','Sul Canal Grande navigano vaporetti ibridi, e in tutti i canali i rilevatori di velocità sorvegliano il moto ondoso.'):'',
      d.boats<.9?t(`Det går ${pct(1-d.boats)} färre taxi- och transportbåtar på kanalerna än 2026${shared&&fewerDay?', eftersom taxi och transporter delas allt mer och dagsbesökarna är färre':shared?', eftersom taxi och transporter delas allt mer':fewerDay?', eftersom dagsbesökarna är färre':''}.`,
          `There are ${pct(1-d.boats)} fewer water taxis and transport boats on the canals than in 2026${shared&&fewerDay?', as taxis and deliveries are ever more shared and day visitors are fewer':shared?', as taxis and deliveries are ever more shared':fewerDay?', as day visitors are fewer':''}.`,
          `Sui canali i taxi e le barche da trasporto sono ${il(1-d.boats)} in meno rispetto al 2026${shared&&fewerDay?', perché taxi e trasporti si condividono sempre di più e i visitatori giornalieri sono meno':shared?', perché taxi e trasporti si condividono sempre di più':fewerDay?', perché i visitatori giornalieri sono meno':''}.`)
        :d.boats>1.05?t(`Fler dagsbesökare ger ${pct(d.boats-1)} fler taxibåtar på kanalerna än 2026.`,`More day visitors bring ${pct(d.boats-1)} more water taxis on the canals than in 2026.`,`Con più visitatori giornalieri, sui canali i taxi sono ${il(d.boats-1)} in più rispetto al 2026.`):'',
      boat>L2&&d.boats<.8?t(`Svallvågorna har lagt sig, och kajmurarna${marsh>=1?' och saltängarna':''} nöts mindre av motorbåtarna.`,`The wakes have settled, and the motorboats wear the quay walls${marsh>=1?' and the salt marshes':''} less.`,`Il moto ondoso si è calmato, e i motoscafi consumano meno le rive${marsh>=1?' e le barene':''}.`):''],
    now?t('Vid kanalen Rio Novo var kvävedioxiden 34 µg/m³ år 2025 – 70 % över EU:s gränsvärde från 2030.','At the Rio Novo canal nitrogen dioxide was 34 µg/m³ in 2025 – 70% above the EU limit from 2030.','Lungo il rio Novo il biossido di azoto era di 34 µg/m³ nel 2025 – il 70% sopra il limite europeo dal 2030.')
    :t(`Kvävedioxiden vid Rio Novo är ${no2} µg/m³${was(Math.round(d0.no2))}${no2<20?' – under EU:s gränsvärde från 2030, 20':no2===20?' – precis vid EU:s gränsvärde från 2030':' – EU:s gränsvärde från 2030 är 20'}.`,
        `Nitrogen dioxide at Rio Novo is ${no2} µg/m³${was(Math.round(d0.no2))}${no2<20?' – below the EU limit from 2030, 20':no2===20?' – right at the EU limit from 2030':' – the EU limit from 2030 is 20'}.`,
        `Il biossido di azoto a rio Novo è di ${no2} µg/m³${was(Math.round(d0.no2))}${no2<20?' – sotto il limite europeo dal 2030, 20':no2===20?' – proprio al limite europeo dal 2030':' – il limite europeo dal 2030 è 20'}.`),
    now?t('Sedan 1 augusti 2021 får fartyg över 25 000 bruttoton inte gå genom San Marco-bassängen och Giudeccakanalen; kryssningspassagerarna minskade från 1,6 miljoner 2019 till 0,58 miljoner 2025, och fartygen lägger till i Marghera och Fusina.',
        'Since 1 August 2021 ships over 25,000 gross tonnes may not pass through the San Marco basin and the Giudecca canal; cruise passengers fell from 1.6 million in 2019 to 0.58 million in 2025, and the ships berth at Marghera and Fusina.',
        'Dal 1° agosto 2021 le navi oltre le 25.000 tonnellate di stazza lorda non possono passare per il bacino di San Marco e il canale della Giudecca; i crocieristi sono scesi da 1,6 milioni nel 2019 a 0,58 milioni nel 2025, e le navi attraccano a Marghera e a Fusina.')
    :port>L3?t(`Inga stora fartyg går längre in i lagunen – den är till för båtarna, fisket och fåglarna – och de ${cruise} kryssningspassagerare som kommer varje år går i land utanför inloppen (2026: ${cruise0}).`,
        `No big ships enter the lagoon any more – it is for the boats, the fishing and the birds – and the ${cruise} cruise passengers who come each year land outside the inlets (2026: ${cruise0}).`,
        `Nessuna grande nave entra più in laguna – è delle barche, della pesca e degli uccelli – e i ${cruise} crocieristi che arrivano ogni anno sbarcano fuori dalle bocche di porto (2026: ${cruise0}).`)
    :port>L2?t(`Kryssnings- och containerterminalerna ligger utanför inloppen, och kanalen mellan Malamocco och Marghera har grundats upp: ${cruise} kryssningspassagerare om året (2026: ${cruise0}).`,
        `The cruise and container terminals lie outside the inlets, and the channel between Malamocco and Marghera has been made shallower: ${cruise} cruise passengers a year (2026: ${cruise0}).`,
        `I terminal delle crociere e dei container sono fuori dalle bocche di porto, e il canale tra Malamocco e Marghera è stato reso meno profondo: ${cruise} crocieristi all'anno (2026: ${cruise0}).`)
    :port>L1?t(`Bara fartyg som ryms utan ny muddring går in i lagunen, och de tar landström vid kajerna: ${cruise} kryssningspassagerare om året (2026: ${cruise0}).`,
        `Only ships that fit without new dredging enter the lagoon, and they take shore power at the quays: ${cruise} cruise passengers a year (2026: ${cruise0}).`,
        `In laguna entrano solo le navi che ci stanno senza nuovi dragaggi, e in banchina si allacciano alla corrente elettrica: ${cruise} crocieristi all'anno (2026: ${cruise0}).`)
    :t(`Kryssningsfartygen lägger fortfarande till i Marghera och Fusina, genom de djupa kanalerna i lagunen: ${cruise} kryssningspassagerare om året (2026: ${cruise0}).`,
        `The cruise ships still berth at Marghera and Fusina, through the deep channels in the lagoon: ${cruise} cruise passengers a year (2026: ${cruise0}).`,
        `Le navi da crociera attraccano ancora a Marghera e a Fusina, attraverso i canali profondi della laguna: ${cruise} crocieristi all'anno (2026: ${cruise0}).`),
  ].flat().filter(Boolean).join(' ')});

  // 6. Energy where it is allowed: gas heat and heat pumps on lagoon water, the sun only where the heritage allows it
  // (never panels on the old roofs), the city's own emissions and its visitors' (research/deep/energi-resor,
  // lagun-natur-mat; levers.js effektivitet and sol).
  const warm=lvl('effektivitet'),sun=lvl('sol'),ratio=d.tourismCO2/Math.max(1,d.ghg*d.pop);
  S.push({title:t('Energi där den får finnas','Energy where it is allowed',"L'energia dove è permessa"),text:[
    now?t('Husen värms mest med gas – 83,5 % av bostädernas energi var naturgas 2005, och ingen nyare räkning finns – men Dogepalatset värms och kyls redan med en värmepump på lagunvatten, utan utedelar på fasaden.',
        "Homes are heated mostly with gas – 83.5% of homes' energy was natural gas in 2005, and there is no newer count – but the Doge's Palace is already heated and cooled by a heat pump on lagoon water, with no outdoor units on its facade.",
        "Le case si scaldano soprattutto a gas – nel 2005 l'83,5% dell'energia delle abitazioni era metano, e non esiste un conteggio più recente – ma Palazzo Ducale si scalda e si raffresca già con una pompa di calore ad acqua di laguna, senza unità esterne sulla facciata.")
    :t(`${warm>L3?`Venedig värms och kyls med lagunens vatten – värmepumparna ${d.gasHeat<.1?'har ersatt gaspannorna i nästan alla hus':'ersätter gaspannorna hus för hus'} –`:warm>L2?'I varje sestiere ersätter värmepumpar på lagunvatten gaspannorna, utan utedelar på fasaderna,':warm>L1?'Kommunens hus och skolor har gått över till värmepumpar och isolerats varsamt,':d.gasHeat>.5?'De flesta hus värms fortfarande med gaspannor,':'Gaspannorna fasas långsamt ut, i EU:s takt,'} och ${pct(d.gasHeat)} av hemmens energi är gas${was(pct(d0.gasHeat))}.`,
        `${warm>L3?`Venice is heated and cooled with the lagoon's water – heat pumps ${d.gasHeat<.1?'have replaced the gas boilers in almost every house':'are replacing the gas boilers house by house'} –`:warm>L2?'In every sestiere heat pumps on lagoon water are replacing the gas boilers, with no outdoor units on the facades,':warm>L1?"The municipality's buildings and schools have switched to heat pumps and been carefully insulated,":d.gasHeat>.5?'Most houses are still heated by gas boilers,':"The gas boilers are being phased out slowly, at the EU's pace,"} and ${pct(d.gasHeat)} of homes' energy is gas${was(pct(d0.gasHeat))}.`,
        `${warm>L3?`Venezia si scalda e si raffresca con l'acqua della laguna – le pompe di calore ${d.gasHeat<.1?'hanno sostituito le caldaie a gas in quasi tutte le case':'sostituiscono le caldaie a gas casa per casa'} –`:warm>L2?'In ogni sestiere le pompe di calore ad acqua di laguna sostituiscono le caldaie a gas, senza unità esterne sulle facciate,':warm>L1?'Gli edifici e le scuole del Comune sono passati alle pompe di calore e sono stati isolati con cura,':d.gasHeat>.5?'Quasi tutte le case si scaldano ancora con caldaie a gas,':"Le caldaie a gas escono di scena lentamente, al ritmo dell'UE,"} e ${il(d.gasHeat)} dell'energia delle case è gas${was(pct(d0.gasHeat))}.`),
    now?t('Solpaneler är förbjudna på hus i den historiska staden byggda före 1945 och tillåts annars bara på plana tak som inte syns från kanal, lagun eller gata; kommunens 59 MW solceller står nästan alla på fastlandet.',
        "Solar panels are banned on buildings in the historic city built before 1945 and otherwise allowed only on flat roofs that cannot be seen from a canal, the lagoon or a street; nearly all the municipality's 59 MW of solar panels are on the mainland.",
        'Nella città storica i pannelli solari sono vietati sugli edifici costruiti prima del 1945 e altrimenti ammessi solo sui tetti piani non visibili da canali, laguna o calli; quasi tutti i 59 MW di fotovoltaico del Comune sono in terraferma.')
    :t(`${sun>L3?'Soltegel som ser ut som coppi ligger på tegeltaken där Soprintendenza tillåter dem – utifrån syns ingen skillnad – och energigemenskaperna delar lagringen':sun>L2?'Energigemenskaper i varje sestiere delar elen från solcellerna på stadens kanter, och de gamla taken är som förr':sun>L1?'Solceller ligger på hamnens tak vid Santa Marta och San Basilio och på garagen vid Tronchetto, i en energigemenskap med familjer som medlemmar, men de gamla taken är som förr':'Solpaneler ligger bara på enstaka plana tak från efter 1945, och de gamla taken är som förr'}: ${dec(d.solarMW,0)} MW sol i och kring den historiska staden${was(dec(d0.solarMW,0)+' MW')} ger ${pct(d.localEnergy)} av den el staden använder.`,
        `${sun>L3?'Solar tiles that look like coppi lie on the tiled roofs where the Soprintendenza allows them – from outside nobody can tell – and the energy communities share the storage':sun>L2?'Energy communities in every sestiere share the power from the solar panels at the city\'s edges, and the old roofs are as they were':sun>L1?'Solar panels lie on the port\'s roofs at Santa Marta and San Basilio and on the garages at Tronchetto, in an energy community with families as members, but the old roofs are as they were':'Solar panels lie only on the odd flat roof built after 1945, and the old roofs are as they were'}: ${dec(d.solarMW,0)} MW of sun in and around the historic city${was(dec(d0.solarMW,0)+' MW')} provide ${pct(d.localEnergy)} of the electricity the city uses.`,
        `${sun>L3?'Coppi solari che sembrano quelli antichi stanno sui tetti dove la Soprintendenza li permette – da fuori non si vede la differenza – e le comunità energetiche si dividono gli accumuli':sun>L2?"Comunità energetiche in ogni sestiere si dividono l'elettricità del fotovoltaico ai margini della città, e i tetti antichi sono quelli di sempre":sun>L1?'Ci sono pannelli solari sui tetti del porto a Santa Marta e San Basilio e sulle autorimesse del Tronchetto, in una comunità energetica con le famiglie come socie, ma i tetti antichi sono quelli di sempre':'Ci sono pannelli solari solo su qualche tetto piano costruito dopo il 1945, e i tetti antichi sono quelli di sempre'}: ${dec(d.solarMW,0)} MW di sole dentro e intorno alla città storica${was(dec(d0.solarMW,0)+' MW')} forniscono ${il(d.localEnergy)} dell'elettricità che la città consuma.`),
    now?t('Stadens egna utsläpp var 3,8 ton koldioxid per invånare 2016, och klimatplanen siktar på 72 % lägre till 2030 än 2005 – medan kolkraftverket i Fusina ensamt släppte ut 1,65 miljoner ton 2023.',
        "The city's own emissions were 3.8 tonnes of carbon dioxide per resident in 2016, and the climate plan aims for 72% lower by 2030 than in 2005 – while the coal-fired power station at Fusina alone emitted 1.65 million tonnes in 2023.",
        'Le emissioni proprie della città erano di 3,8 tonnellate di anidride carbonica per abitante nel 2016, e il piano per il clima punta a ridurle del 72% entro il 2030 rispetto al 2005 – mentre la sola centrale a carbone di Fusina ha emesso 1,65 milioni di tonnellate nel 2023.')
    :t(`Stadens egna utsläpp är ${dec(d.ghg,1)} ton koldioxid per invånare${was(dec(d0.ghg,1))}, och ${pct(d.renewable)} av elen är förnybar${was(pct(d0.renewable))}.`,
        `The city's own emissions are ${dec(d.ghg,1)} tonnes of carbon dioxide per resident${was(dec(d0.ghg,1))}, and ${pct(d.renewable)} of the electricity is renewable${was(pct(d0.renewable))}.`,
        `Le emissioni proprie della città sono di ${dec(d.ghg,1)} tonnellate di anidride carbonica per abitante${was(dec(d0.ghg,1))}, e ${il(d.renewable)} dell'elettricità è rinnovabile${was(pct(d0.renewable))}.`),
    t(`Besökarnas resor och nätter ger uppskattningsvis ${mn(d.tourismCO2)} ton CO₂e om året${was(mn(d0.tourismCO2))}${ratio>3?' – många gånger mer än invånarnas egna utsläpp':''}.`,
      `Visitors' journeys and nights cause an estimated ${mn(d.tourismCO2)} tonnes of CO₂e a year${was(mn(d0.tourismCO2))}${ratio>3?" – many times more than the residents' own emissions":''}.`,
      `I viaggi e i pernottamenti dei visitatori producono circa ${mn(d.tourismCO2)} di tonnellate di CO₂e all'anno${was(mn(d0.tourismCO2))}${ratio>3?' – molte volte più delle emissioni proprie degli abitanti':''}.`),
  ].filter(Boolean).join(' ')});

  // 7. Heat and care for the old: the ages, the hot days and the deaths in the heat, shade on the campi, the bridges
  // and the care that lets the old stay, the friends to count on (research/deep/samhalle-halsa, hav-tidvatten;
  // levers.js svalka and forebyggande).
  const cool=lvl('svalka'),care=lvl('forebyggande'),hd=Math.round(d.hotDays),deaths=Math.round(d.heatDeaths);
  S.push({title:t('Värmen och omsorgen om de gamla','Heat and care for the old','Il caldo e la cura degli anziani'),text:[
    now?t('33,1 % av invånarna är 65 år eller äldre och 12,2 % är 80 eller äldre – mot 24,7 % och 7,8 % i Italien – och 1 136 har fyllt 90.',
        '33.1% of residents are 65 or older and 12.2% are 80 or older – against 24.7% and 7.8% in Italy – and 1,136 have turned 90.',
        'Il 33,1% degli abitanti ha 65 anni o più e il 12,2% 80 o più – contro il 24,7% e il 7,8% in Italia – e 1136 hanno compiuto 90 anni.')
    :t(`${pct(d.share65)} av invånarna är 65 år eller äldre och ${pct(d.share80)} är 80 eller äldre (2026: ${pct(d0.share65)} och ${pct(d0.share80)}).`,
        `${pct(d.share65)} of residents are 65 or older and ${pct(d.share80)} are 80 or older (2026: ${pct(d0.share65)} and ${pct(d0.share80)}).`,
        `${Il(d.share65)} degli abitanti ha 65 anni o più e ${il(d.share80)} 80 o più (2026: ${pct(d0.share65)} e ${pct(d0.share80)}).`),
    now?t('Staden har omkring 22 dagar om året över 30 °C – 52 år 2024 – och 67 tropiska nätter, då det aldrig svalnar under 20 °C.',
        'The city has about 22 days a year above 30 °C – 52 in 2024 – and 67 tropical nights, when it never cools below 20 °C.',
        "La città ha circa 22 giorni l'anno sopra i 30 °C – 52 nel 2024 – e 67 notti tropicali, in cui non si scende mai sotto i 20 °C.")
    :t(`Staden har omkring ${hd} dagar om året över 30 °C${was(Math.round(d0.hotDays))}${hd>=30?(cool>L2?' – men skuggiga campi, fontäner och öppna klosterträdgårdar ger svalka':' – och de gamla som bor ensamma under heta tak är mest utsatta'):''}.`,
        `The city has about ${hd} days a year above 30 °C${was(Math.round(d0.hotDays))}${hd>=30?(cool>L2?' – but shady campi, fountains and open cloister gardens give relief':' – and the old who live alone under hot roofs are the most exposed'):''}.`,
        `La città ha circa ${hd} giorni l'anno sopra i 30 °C${was(Math.round(d0.hotDays))}${hd>=30?(cool>L2?' – ma campi ombreggiati, fontane e chiostri aperti danno sollievo':' – e gli anziani che vivono soli sotto tetti roventi sono i più esposti'):''}.`),
    t(`Värmen tar uppskattningsvis ${deaths} liv en vanlig sommar${was(Math.round(d0.heatDeaths))}${now?' – ingen räkning finns för Venedig, men Italien hade flest värmedödsfall i Europa sommaren 2022':''}.`,
      `The heat takes an estimated ${deaths} lives in an ordinary summer${was(Math.round(d0.heatDeaths))}${now?' – there is no count for Venice, but Italy had the most heat deaths in Europe in the summer of 2022':''}.`,
      `Il caldo costa circa ${deaths} vite in un'estate normale${was(Math.round(d0.heatDeaths))}${now?" – per Venezia non esiste un conteggio, ma nell'estate del 2022 l'Italia ha avuto più morti per il caldo di ogni altro paese europeo":''}.`),
    now?t('Campi är stadens vardagsrum, men de flesta är stenytor utan skugga; staden har 155 offentliga fontäner och vattenautomater.',
        "The campi are the city's living rooms, but most are stone surfaces with no shade; the city has 155 public fountains and water points.",
        "I campi sono i salotti della città, ma per lo più sono distese di pietra senz'ombra; la città ha 155 fontane pubbliche e casette dell'acqua.")
    :cool>L1?t(`${cool>L3?'Skugga, vatten och öppna trädgårdar finns i varje sestiere':cool>L2?'Varje sestiere har skugga och svala rum, och klostrens trädgårdar står öppna för grannarna':'De största campi har fått träd och fontäner'}: ${pct(d.shade)} av torgens yta ligger i skugga (2026: uppskattningsvis ${pct(d0.shade)}).`,
        `${cool>L3?'Every sestiere has shade, water and open gardens':cool>L2?'Every sestiere has shade and cool rooms, and the cloister gardens are open to the neighbours':'The largest campi have trees and fountains'}: ${pct(d.shade)} of the squares lie in shade (2026: an estimated ${pct(d0.shade)}).`,
        `${cool>L3?'Ogni sestiere ha ombra, acqua e giardini aperti':cool>L2?'Ogni sestiere ha ombra e luoghi freschi, e i giardini dei chiostri sono aperti ai vicini':'I campi più grandi hanno alberi e fontane'}: ${il(d.shade)} della superficie dei campi è in ombra (2026: circa ${pct(d0.shade)}).`):'',
    now?t('Sjukhuset SS. Giovanni e Paolo i Castello, med omkring 310 vårdplatser, är det enda på öarna, och patienterna kommer dit med ambulansbåt.',
        'The SS. Giovanni e Paolo hospital in Castello, with about 310 beds, is the only one on the islands, and patients arrive by water ambulance.',
        "L'ospedale Santi Giovanni e Paolo a Castello, con circa 310 posti letto, è l'unico delle isole, e i pazienti ci arrivano in idroambulanza.")
    :care>L2?t('Varje sestiere har ett hälsotorg, hemtjänsten kommer med båt, och grannar tittar in hos de äldsta.','Every sestiere has a health centre, home care comes by boat, and neighbours look in on the oldest.',"Ogni sestiere ha una casa della salute, l'assistenza domiciliare arriva in barca, e i vicini passano a trovare i più anziani.")
    :care>L1?t('Ramper vid sjukhuset, skolorna och hållplatserna, och hemtjänsten kommer med båt.','There are ramps at the hospital, the schools and the stops, and home care comes by boat.',"Ci sono rampe all'ospedale, alle scuole e agli imbarcaderi, e l'assistenza domiciliare arriva in barca."):'',
    now?t('95 % av broarna i stadens centrala delar har trappsteg: med vaporetto når en rullstolsburen omkring 70 % av staden, utan båt 2 %.',
        '95% of the bridges in the central city have steps: by vaporetto a wheelchair user can reach about 70% of the city, without a boat 2%.',
        'Il 95% dei ponti del centro ha gradini: in vaporetto chi usa la sedia a rotelle raggiunge circa il 70% della città, senza barca il 2%.')
    :t(`${pct(d.steppedBridges)} av broarna har trappsteg${was(pct(d0.steppedBridges))}${care>L1&&d.steppedBridges<d0.steppedBridges-.02?' – ramper och långa, sluttande trappsteg gör att allt fler går att ta sig över med rullstol och barnvagn':''}.`,
        `${pct(d.steppedBridges)} of the bridges have steps${was(pct(d0.steppedBridges))}${care>L1&&d.steppedBridges<d0.steppedBridges-.02?' – ramps and long, sloping steps mean ever more of them can be crossed in a wheelchair or with a pram':''}.`,
        `${Il(d.steppedBridges)} dei ponti ha gradini${was(pct(d0.steppedBridges))}${care>L1&&d.steppedBridges<d0.steppedBridges-.02?' – rampe e gradini agevolati permettono di attraversarne sempre di più in sedia a rotelle o con il passeggino':''}.`),
    now?t(`Invånarna i provinsen lever i snitt ${dec(d.lifeExp,1)} år – kvinnorna 86,4 och männen 82,2 – och bara 69,5 % av kommunens invånare säger att de har vänner att räkna med, mot 74,4 % i Italien.`,
        `People in the province live ${dec(d.lifeExp,1)} years on average – women 86.4 and men 82.2 – and only 69.5% of the municipality's residents say they have friends to count on, against 74.4% in Italy.`,
        `Gli abitanti della provincia vivono in media ${dec(d.lifeExp,1)} anni – le donne 86,4 e gli uomini 82,2 – e solo il 69,5% degli abitanti del Comune dice di avere amici su cui contare, contro il 74,4% in Italia.`)
    :t(`Medellivslängden är ${dec(d.lifeExp,1)} år${was(dec(d0.lifeExp,1))}, och ${pct(d.friends)} har vänner att räkna med${was(pct(d0.friends))}${d.friends<d0.friends-.02?' – ensamheten har ökat':d.friends>d0.friends+.05?' – grannarna känner varandra igen':''}.`,
        `Life expectancy is ${dec(d.lifeExp,1)} years${was(dec(d0.lifeExp,1))}, and ${pct(d.friends)} have friends to count on${was(pct(d0.friends))}${d.friends<d0.friends-.02?' – loneliness has grown':d.friends>d0.friends+.05?' – neighbours know each other again':''}.`,
        `La speranza di vita è di ${dec(d.lifeExp,1)} anni${was(dec(d0.lifeExp,1))}, e ${il(d.friends)} ha amici su cui contare${was(pct(d0.friends))}${d.friends<d0.friends-.02?' – la solitudine è cresciuta':d.friends>d0.friends+.05?' – i vicini si conoscono di nuovo':''}.`),
  ].filter(Boolean).join(' ')});

  // 8. Voice and knowledge: the vote and the citizens' assemblies, the universities and the crafts beyond tourism,
  // data and AI for the lagoon (research/deep/kommun-plats-historia, samhalle-halsa, turism-ekonomi; levers.js
  // demokrati, kunskap and ai).
  const dem=lvl('demokrati'),know=lvl('kunskap'),ai=lvl('ai'),gov=d.aiGovernance;
  const govText=gov>.6?t(', med data i invånarnas ägo och människor som fattar besluten',', with data owned by the residents and people making the decisions',', con i dati in mano agli abitanti e le decisioni prese da persone')
    :gov<.4?t(', men få vet hur systemen fattar sina beslut',', but few know how the systems make their decisions',', ma pochi sanno come i sistemi prendono le loro decisioni'):'';
  S.push({title:t('Röst och kunskap','Voice and knowledge','Voce e conoscenza'),text:[
    now?t('I kommunvalet i maj 2026 röstade 55,9 %, mot 62,2 % år 2020, och den historiska staden röstade på en annan borgmästare än fastlandet och öarna.',
        'In the municipal election of May 2026 turnout was 55.9%, against 62.2% in 2020, and the historic city voted for a different mayor from the mainland and the islands.',
        'Alle comunali del maggio 2026 ha votato il 55,9%, contro il 62,2% del 2020, e la città storica ha scelto un sindaco diverso da quello della terraferma e delle isole.')
    :t(`${dem>L3?'Ett lottat medborgarråd sammanträder i Stora rådssalen i Dogepalatset, och ett ombud för lagunens barnbarn har vetorätt i de långsiktiga frågorna. ':dem>L2?'Lottade medborgarråd i varje sestiere ger råd i de stora frågorna, och invånarna bestämmer själva över en del av budgeten. ':dem>L1?'Kommunen håller medborgardialoger i varje sestiere. ':''}I kommunvalet röstar ${pct(d.turnout)}${was(pct(d0.turnout))}.`,
        `${dem>L3?"A citizens' assembly chosen by lot meets in the Hall of the Great Council in the Doge's Palace, and an ombudsperson for the lagoon's grandchildren has a veto on the long-term questions. ":dem>L2?"Citizens' assemblies chosen by lot in every sestiere advise on the big questions, and residents decide part of the budget themselves. ":dem>L1?"The municipality holds citizens' dialogues in every sestiere. ":''}Turnout in the municipal election is ${pct(d.turnout)}${was(pct(d0.turnout))}.`,
        `${dem>L3?"Un'assemblea di cittadini sorteggiati si riunisce nella Sala del Maggior Consiglio di Palazzo Ducale, e un garante dei nipoti della laguna ha diritto di veto sulle scelte di lungo periodo. ":dem>L2?'Assemblee di cittadini sorteggiati in ogni sestiere danno consigli sulle grandi questioni, e gli abitanti decidono da sé una parte del bilancio. ':dem>L1?'Il Comune organizza dialoghi con i cittadini in ogni sestiere. ':''}Alle comunali vota ${il(d.turnout)}${was(pct(d0.turnout))}.`),
    now?t('En tredjedel av ledamöterna i kommunfullmäktige är kvinnor, och bara hälften av invånarna känner sig trygga när de går ensamma ute i mörkret.',
        "A third of the city council's members are women, and only half of the residents feel safe walking alone after dark.",
        'Un terzo dei consiglieri comunali sono donne, e solo metà degli abitanti si sente sicura a camminare da sola al buio.')
    :t(`${pct(d.womenCouncil)} av ledamöterna i kommunfullmäktige är kvinnor${was(pct(d0.womenCouncil))}, och ${pct(d.safe)} känner sig trygga när de går ensamma ute i mörkret${was(pct(d0.safe))}.`,
        `${pct(d.womenCouncil)} of the city council's members are women${was(pct(d0.womenCouncil))}, and ${pct(d.safe)} feel safe walking alone after dark${was(pct(d0.safe))}.`,
        `${Il(d.womenCouncil)} dei consiglieri comunali sono donne${was(pct(d0.womenCouncil))}, e ${il(d.safe)} si sente sicuro a camminare da solo al buio${was(pct(d0.safe))}.`),
    now?t("Omkring 24 000 studerar vid Ca' Foscari och IUAV, men få är folkbokförda här och studentbäddarna är 1 000; nästan vart femte jobb i kommunen finns i hotell och restauranger, och Squero di San Trovaso är ett av de sista varven som fortfarande bygger gondoler.",
        "About 24,000 study at Ca' Foscari and IUAV, but few are registered residents and there are 1,000 student beds; nearly one job in five in the municipality is in hotels and restaurants, and the Squero di San Trovaso is one of the last boatyards that still build gondolas.",
        "Circa 24.000 studenti frequentano Ca' Foscari e lo Iuav, ma pochi sono residenti e i posti letto per studenti sono 1000; quasi un posto di lavoro su cinque nel Comune è in alberghi e ristoranti, e lo squero di San Trovaso è uno degli ultimi cantieri dove si costruiscono ancora gondole.")
    :[know>L1?t(`${know>L3&&d.tourismJobs<.12?'Venedig är en stad av kunskap och hantverk, lika stark som turismen':know>L2?'Lagunen och kulturarvet är ett levande labb: forskare, restauratörer och hantverkare arbetar i Arsenalen, och på gondolvarvet San Trovaso lär sig unga bygga båtar i trä':'Studentbostäder och ett forskningscentrum gör att fler av dem som utbildas här kan stanna'}.`,
          `${know>L3&&d.tourismJobs<.12?'Venice is a city of knowledge and craft, as strong as its tourism':know>L2?'The lagoon and the heritage are a living lab: researchers, restorers and craftspeople work in the Arsenale, and at the San Trovaso boatyard young people learn to build wooden boats':'Student housing and a research centre mean more of those who study here can stay'}.`,
          `${know>L3&&d.tourismJobs<.12?'Venezia è una città di sapere e di mestieri, forte quanto il turismo':know>L2?"La laguna e il patrimonio sono un laboratorio vivente: ricercatori, restauratori e artigiani lavorano all'Arsenale, e allo squero di San Trovaso i giovani imparano a costruire barche di legno":'Residenze per studenti e un centro di ricerca permettono a più di chi studia qui di restare'}.`):'',
      t(`Ca' Foscari och IUAV har ${int(near(d.students,100))} studenter och staden ${int(near(d.studentBeds,10))} studentbäddar (2026: ${int(d0.students)} och ${int(d0.studentBeds)}), och ${pct1(d.tourismJobs)} av jobben i kommunen finns i hotell och restauranger${was(pct1(d0.tourismJobs))}.`,
        `Ca' Foscari and IUAV have ${int(near(d.students,100))} students and the city ${int(near(d.studentBeds,10))} student beds (2026: ${int(d0.students)} and ${int(d0.studentBeds)}), and ${pct1(d.tourismJobs)} of the jobs in the municipality are in hotels and restaurants${was(pct1(d0.tourismJobs))}.`,
        `Ca' Foscari e lo Iuav hanno ${int(near(d.students,100))} studenti e la città ${int(near(d.studentBeds,10))} posti letto per studenti (2026: ${int(d0.students)} e ${int(d0.studentBeds)}), e ${artOf(pct1(d.tourismJobs))}${pct1(d.tourismJobs)} dei posti di lavoro del Comune è in alberghi e ristoranti${was(pct1(d0.tourismJobs))}.`)],
    now?t('När tidvattnet stiger varnar högtalare i klocktornen: en ton för 110 cm, två för 120, tre för 130 och fyra för 140.',
        'When the tide rises, loudspeakers in the bell towers give warning: one tone for 110 cm, two for 120, three for 130 and four for 140.',
        "Quando la marea sale, gli altoparlanti sui campanili danno l'allarme: un suono per 110 cm, due per 120, tre per 130 e quattro per 140.")
    :ai>L3?t(`En digital tvilling av lagunen förutser tidvattnet, besökarna och båttrafiken${gov>.6?' – i invånarnas ägo och öppet granskad':govText}.`,
        `A digital twin of the lagoon forecasts the tides, the visitors and the boat traffic${gov>.6?' – owned by the residents and open to scrutiny':govText}.`,
        `Un gemello digitale della laguna prevede le maree, i visitatori e il traffico acqueo${gov>.6?' – di proprietà degli abitanti e aperto al controllo pubblico':govText}.`)
    :ai>L2?t(`AI i stadens tjänst ger skarpare tidvattenprognoser, så att MOSE reses först när det behövs, och hjälper bokningen, båttrafiken och vården på distans${govText}.`,
        `AI in the city's service gives sharper tide forecasts, so that MOSE rises only when it must, and helps the booking, the boat traffic and care at a distance${govText}.`,
        `L'IA al servizio della città dà previsioni di marea più precise, così che il MOSE si alzi solo quando serve, e aiuta le prenotazioni, il traffico acqueo e la cura a distanza${govText}.`)
    :ai>L1?t('Tidvattnet, besökarna och båttrafiken finns som öppna data i realtid för alla.','The tides, the visitors and the boat traffic are open data, in real time, for everyone.','Maree, visitatori e traffico acqueo sono dati aperti, in tempo reale, per tutti.')
    :d.aiCapacity>.3&&gov<.4?t('AI har kommit in i stadens tjänster, men utan öppen insyn i hur den används.',"AI has found its way into the city's services, but with no open view of how it is used.",'L\'IA è entrata nei servizi della città, ma senza che si possa vedere come viene usata.'):'',
  ].flat().filter(Boolean).join(' ')});
  return S;
}
