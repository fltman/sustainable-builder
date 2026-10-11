import { INDICATORS } from '@engine/data/indicators.js';
import { LANG, L, t, dec, pct } from '@engine/i18n.js';
import { BASE } from './model.js';
import { CITY } from './config.js';
import { hotDays, tropicalNights, il } from './changes.js';

// What the AR layer explains, pinned to the places in Venice where it shows: each spot reads one model
// indicator for the year shown, counts up from 2026 and carries the century's curve so far.
// The places are places.js's (model metres, x east and z south of the centre between Rialto and San Marco),
// y a few metres over the ground and roofs there (the buildings' heights in city.json; the 3D ground y = 0,
// the lagoon's surface y = -1.2). Two spots also follow what is in view (main.js engine.arAnchors): the
// fruit trees in the gardens → trad, the stalls and long tables on the campi → gemenskap. Venice has no
// verge beds, flood wall, timber blocks or growing tower, so mat, niva and bo stay at their places.
// Kickers, titles and units are Swedish, translated in place (en/ar.js, it/ar.js – or the engine's and the
// indicators' dictionaries where they already have them); notes with figures are written with t(sv,en,it).
const fmtOf=k=>INDICATORS[k].fmt;
export const AR_SPOTS=[
  // The tide gauge at Punta della Salute, whose zero (the mean of 1885–1909) every Venetian level is
  // measured from; the lagoon's mean is 0.35 m on it today (2020–2025).
  {id:'niva',at:{x:-87,y:5,z:438},side:'auto',key:'level100',kicker:'Tidvattnet',title:'Hundraårshögvattnet vid Punta della Salute',unit:'över tidvattennollan',
    note:d=>t(`Medelvattnet står ${dec(CITY.water.level+d.seaRise,2)} m över nollan från 1897 (2026: 0,35 m). Bakom MOSE stannar ett hundraårshögvatten vid ${dec(d.levelInside,2)} m.`,
      `The mean sea stands ${dec(CITY.water.level+d.seaRise,2)} m above the 1897 zero (2026: 0.35 m). Behind MOSE a 100-year high water stops at ${dec(d.levelInside,2)} m.`,
      `Il livello medio del mare è a ${dec(CITY.water.level+d.seaRise,2)} m sopra lo zero del 1897 (2026: 0,35 m). Dietro il MOSE un'acqua alta centenaria si ferma a ${dec(d.levelInside,2)} m.`)},
  // The Riva degli Schiavoni by San Zaccaria, on the Bacino, where the storm of 12 November 2019 tore the
  // kiosks loose; the gates are at the Lido inlet, 3 km to the east, and at Malamocco and Chioggia.
  {id:'mose',at:{x:498,y:4,z:124},side:'auto',key:'moseClosures',kicker:'MOSE',title:'MOSE-stängningar om året',unit:'',
    note:d=>d.moseClosures>=360?L('Luckorna står uppe nästan jämt: lagunen har blivit en sjö bakom en mur, och vattnet byts bara när de sänks.')
      :d.moseClosures>180?t(`Lagunen är stängd oftare än öppen. Luckorna reser sig när ett tidvatten över ${dec(d.barrierCloses,2)} m väntas.`,
        `The lagoon is closed more often than open. The gates rise when a tide above ${dec(d.barrierCloses,2)} m is forecast.`,
        `La laguna è chiusa più spesso che aperta. Le paratoie si alzano quando è prevista una marea oltre ${dec(d.barrierCloses,2)} m.`)
      :t(`Luckorna vid Lido, Malamocco och Chioggia reser sig när ett tidvatten över ${dec(d.barrierCloses,2)} m väntas. MOSE byggdes för 3–5 stängningar om året.`,
        `The gates at the Lido, Malamocco and Chioggia rise when a tide above ${dec(d.barrierCloses,2)} m is forecast. MOSE was built for 3–5 closures a year.`,
        `Le paratoie di Lido, Malamocco e Chioggia si alzano quando è prevista una marea oltre ${dec(d.barrierCloses,2)} m. Il MOSE era stato progettato per 3–5 chiusure l'anno.`)},
  // Piazza San Marco, the lowest of the great squares: it floods from 0.80 m.
  {id:'piazza',at:{x:92,y:3,z:83},side:'auto',key:'floodShare',kicker:'Markusplatsen',title:'Gångvägarna under vatten vid ett 100-årshögvatten',unit:'',
    note:d=>d.protection>.85?t(`Kajerna och kanten runt piazzan når ${dec(d.protection,2)} m; torget svämmade förr över redan vid 0,80 m.`,
        `The quays and the edge round the piazza reach ${dec(d.protection,2)} m; the square used to flood from 0.80 m.`,
        `Le rive e il bordo attorno alla piazza arrivano a ${dec(d.protection,2)} m; un tempo la piazza andava sott'acqua già a 0,80 m.`)
      :t(`Torget svämmar över från 0,80 m. Med MOSE uppe stannar ett hundraårshögvatten vid ${dec(d.levelInside,2)} m.`,
        `The square floods from 0.80 m. With MOSE up a 100-year high water stops at ${dec(d.levelInside,2)} m.`,
        `La piazza va sott'acqua da 0,80 m. Con il MOSE alzato un'acqua alta centenaria si ferma a ${dec(d.levelInside,2)} m.`)},
  // St Mark's Basilica, whose narthex (63 cm) is the city's lowest floor.
  {id:'kulturarv',at:{x:181,y:24,z:50},side:'auto',key:'heritage',kicker:'Markuskyrkan',title:'Kulturarvet (1 = intakt)',unit:'',
    note:d=>d.heritage>.985?L('Förhallens mosaikgolv från 1100-talet, som förr stod under vatten över 200 gånger om året, skyddas av glasbarriären från 2022.')
      :d.protection>.9?L('Höjda kajer och nya trösklar har tagit något av de gamla stenarna – priset för att hålla vattnet ute.')
      :L('Saltvattnet har gnagt på tegel och marmor; högvattnen har skadat det som stått i tusen år.')},
  // The top of the Campanile (98.6 m): the view over the lagoon and its salt marshes.
  {id:'barene',at:{x:121,y:80,z:107},side:'auto',key:'saltMarsh',kicker:'Kampanilen',title:'Saltängar i lagunen',unit:'km²',
    note:d=>d.saltMarsh>=50?L('Från tornet syns gröna barene där det i dag är öppet vatten; de byggs av muddrat slam i takt med att havet stiger.')
      :d.saltMarsh>=15?L('Omkring en halv kvadratkilometer försvinner varje år, och nya byggs av muddermassor. År 1912 fanns 158 km².')
      :L('Saltängarna drunknar när havet stiger och MOSE stänger ute slammet. År 1912 fanns 158 km².')},
  // The quay of San Giorgio Maggiore, facing the Bacino: the Fondazione Cini's island.
  {id:'lagun',at:{x:451,y:3,z:566},side:'auto',key:'waters',kicker:'Lagunen',title:'Lagunens hälsa (1 = god status)',unit:'',
    note:d=>d.bloom>.35?L('Algblomning och syrebrist de varmaste somrarna.')
      :d.waters>.65?L('Sjögräs, saltängar och klarare vatten; fisken i fiskevallarna och musslorna mår bättre.')
      :d.waters>BASE.waters+.1?L('Lagunen återhämtar sig: nya saltängar, sjögräs på bottnarna och klarare vatten för varje år.')
      :L('Inget av lagunens elva vattenområden hade god ekologisk status 2026, och sedimentet rinner ut i havet.')},
  // The Rialto bridge, the city's most crowded walk.
  {id:'besok',at:{x:-123,y:11,z:-340},side:'auto',key:'dayVisitors',kicker:'Rialtobron',title:'Dagsbesökare en vanlig dag',unit:'',
    note:d=>t(`${dec(d.visitorsPerResident,1)} besökare per invånare en vanlig dag (2026: 1,8). En studie satte stadens bärkraft till omkring 52 000 besökare om dagen.`,
      `${dec(d.visitorsPerResident,1)} visitors per resident on an ordinary day (2026: 1.8). A study put the city's carrying capacity at about 52,000 visitors a day.`,
      `${dec(d.visitorsPerResident,1)} visitatori per abitante in un giorno normale (2026: 1,8). Uno studio ha stimato la capacità di carico della città in circa 52.000 visitatori al giorno.`)},
  // Fondaco dei Tedeschi: a trading house of 1508, a department store until 2025 – a house for residents in
  // the vision (places.js).
  {id:'bo',at:{x:-64,y:24,z:-362},side:'auto',key:'emptyHomes',kicker:'Bostäderna',title:'Bostäder utan boende',unit:'',
    note:d=>{const beds=fmtOf('touristBeds'),pop=fmtOf('pop');return t(`${beds(d.touristBeds)} turistbäddar mot ${pop(d.pop)} invånare (2026: ${beds(BASE.touristBeds)} mot ${pop(BASE.pop)}).`,
      `${beds(d.touristBeds)} tourist beds against ${pop(d.pop)} residents (2026: ${beds(BASE.touristBeds)} against ${pop(BASE.pop)}).`,
      `${beds(d.touristBeds)} posti letto turistici contro ${pop(d.pop)} abitanti (2026: ${beds(BASE.touristBeds)} contro ${pop(BASE.pop)}).`);}},
  // Scuola Armando Diaz in Castello: open schools are the clearest sign that families stay.
  {id:'folk',at:{x:454,y:16,z:-60},side:'auto',key:'pop',kicker:'Invånarna',title:'Invånare i den historiska staden',unit:'',
    note:d=>t(`${pct(d.share65)} är 65 eller äldre.`,`${pct(d.share65)} are 65 or older.`,`${il(d.share65)} ha 65 anni o più.`)+' '
      +(d.pop>BASE.pop||d.emptyHomes<.25?L('Familjer har flyttat in i de tomma husen, och skolorna har barn igen.'):L('År 1951 bodde 174 808 människor i den historiska staden.'))},
  // Campo Santa Maria Formosa (and the stalls and long tables wherever they are in view).
  {id:'gemenskap',at:{x:294,y:4,z:-254},side:'auto',key:'lowParticipation',kicker:'Gemenskap',title:'Har lågt socialt deltagande',unit:'',
    note:d=>t(`${pct(d.cohousing)} bor i generationshus eller bogemenskap. Arbetsveckan är ${Math.round(d.workHours)} timmar.`,
      `${pct(d.cohousing)} live in multi-generation houses or co-housing. The working week is ${Math.round(d.workHours)} hours.`,
      `${il(d.cohousing)} vive in case intergenerazionali o in coabitazione. La settimana lavorativa è di ${Math.round(d.workHours)} ore.`)},
  // The Rialto market and its fish hall.
  {id:'mat',at:{x:-233,y:6,z:-516},side:'auto',key:'foodRegional',kicker:'Mat',title:'Maten från lagunen och fastlandet',unit:'',
    note:d=>d.foodRegional>.4?t(`Fisk och musslor från lagunen och kronärtskockor från Sant'Erasmo; staden odlar ${pct(d.cityVeg)} av sin frukt och sina grönsaker på altaner och gårdar.`,
        `Fish and clams from the lagoon and artichokes from Sant'Erasmo; the city grows ${pct(d.cityVeg)} of its fruit and vegetables on altane and in courtyards.`,
        `Pesce e vongole della laguna e carciofi di Sant'Erasmo; la città coltiva ${il(d.cityVeg,false)} della sua frutta e verdura su altane e corti.`)
      :t(`Sju fiskstånd fanns kvar 2024, mot ett trettiotal på 1980-talet. Staden odlar ${pct(d.cityVeg)} av sin frukt och sina grönsaker.`,
        `Seven fish stalls were left in 2024, against some thirty in the 1980s. The city grows ${pct(d.cityVeg)} of its fruit and vegetables.`,
        `Nel 2024 restavano sette banchi del pesce, contro una trentina negli anni Ottanta. La città coltiva ${il(d.cityVeg,false)} della sua frutta e verdura.`)},
  // The Accademia bridge over the Grand Canal.
  {id:'batar',at:{x:-668,y:7,z:369},side:'auto',key:'boatElectric',kicker:'Canal Grande',title:'Båttrafik som går på el',unit:'',
    note:d=>d.boatElectric>.6?L('Tysta vaporetti och taxibåtar laddar vid bryggorna; svallvågorna mot kajerna har minskat.')
      :L('Mest diesel fortfarande: båtar och fartyg står för nästan hälften av kommunens kväveoxider.')},
  // The hospital at Santi Giovanni e Paolo, in the Scuola Grande di San Marco.
  {id:'liv',at:{x:467,y:17,z:-596},side:'auto',key:'lifeExp',kicker:'Hälsa',title:'Medellivslängd',unit:'år',
    note:d=>t(`${pct(d.share80)} är över 80. ${pct(d.activity)} rör sig tillräckligt i vardagen – över broarna, varje dag.`,
      `${pct(d.share80)} are over 80. ${pct(d.activity)} get enough everyday exercise – over the bridges, every day.`,
      `${il(d.share80)} ha più di 80 anni. ${il(d.activity)} fa abbastanza movimento ogni giorno – su e giù per i ponti.`)},
  // Over the tiled roofs between Rialto and its market.
  {id:'sol',at:{x:-181,y:14,z:-434},side:'auto',key:'solarMW',kicker:'Energi',title:'Solel på stadens tak',unit:'MW',
    note:d=>d.localEnergy<1?t(`${pct(d.localEnergy)} av elen produceras lokalt. Soltegel som liknar de gamla takpannorna gör det möjligt på hus där vanliga paneler är förbjudna.`,
        `${pct(d.localEnergy)} of the electricity is produced locally. Solar tiles that look like the old roof tiles make it possible on houses where ordinary panels are banned.`,
        `${il(d.localEnergy)} dell'elettricità è prodotto in loco. I coppi solari, simili a quelli antichi, lo rendono possibile sulle case dove i pannelli normali sono vietati.`)
      :L('Taken och havsvinden utanför Lido ger mer el än staden använder.')},
  // The Giardini Reali by the Piazzetta (and the fruit trees in the gardens wherever they are in view).
  {id:'trad',at:{x:47,y:6,z:219},side:'auto',key:'canopy',kicker:'Svalka',title:'Trädkronor i den historiska staden',unit:'',
    note:d=>t(`Omkring ${Math.round(hotDays(d))} dagar över 30 °C och ${Math.round(tropicalNights(d))} tropiska nätter om året (2026: 22 och 67).`,
      `About ${Math.round(hotDays(d))} days above 30 °C and ${Math.round(tropicalNights(d))} tropical nights a year (2026: 22 and 67).`,
      `Circa ${Math.round(hotDays(d))} giorni sopra i 30 °C e ${Math.round(tropicalNights(d))} notti tropicali all'anno (2026: 22 e 67).`)},
  // Palazzo Ducale: the Hall of the Great Council.
  {id:'rad',at:{x:242,y:28,z:88},side:'auto',key:'trust',kicker:'Dogepalatset',title:'Tillit till andra',unit:'',
    note:d=>d.trust>.45?L('I Stora rådssalen möts igen ett råd: det lottade medborgarrådet, med ett ombud för lagunens framtida generationer.')
      :t(`${pct(1-d.unsafe)} känner sig trygga ute på kvällen. I kommunvalet 2026 röstade 55,9 %.`,
        `${pct(1-d.unsafe)} feel safe out in the evening. Turnout in the 2026 municipal election was 55.9%.`,
        `${il(1-d.unsafe)} si sente sicuro fuori la sera. Alle comunali del 2026 ha votato il 55,9%.`)},
];
if(LANG!=='sv')for(const sp of AR_SPOTS){sp.kicker=L(sp.kicker);sp.title=L(sp.title);sp.unit=L(sp.unit);}
export function arSpec(spot,run,year){
  const i=Math.max(0,Math.min(run.years.length-1,Math.floor(year)-2026)),d=run.years[i].ind,d0=run.years[0].ind,meta=INDICATORS[spot.key];
  const series=run.years.slice(0,i+1).filter((_,k)=>k%3===0||k===i).map(y=>y.ind[spot.key]);
  const fmt=meta.fmt;
  return {...spot,value:d[spot.key],from:d0[spot.key],fmt,fromText:i?`2026: ${fmt(d0[spot.key])}`:'',spark:series.length>2?series:null,note:spot.note(d)};
}
