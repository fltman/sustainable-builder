import { INDICATORS } from '@engine/data/indicators.js';
import { LANG, L, t, dec, int, pct } from '@engine/i18n.js';
import { PARAMS } from './model.js';
import { hotDays, tropicalNights, il } from './changes.js';

// What the AR layer explains, pinned to the places in Venice where it shows: each spot reads one of Venice's own
// measures (indicators.js) for the year shown, counts up from 2026 and carries the century's curve so far; its
// note reads the year's measures and levers (arSpec below: note(d,d0,I)).
// The places are places.js's (model metres, x east and z south of the centre between Rialto and San Marco),
// y a few metres over the ground and roofs there (the buildings' heights in city.json; the 3D ground y = 0,
// the lagoon's surface y = -1.2). Two spots also follow what is in view (main.js engine.arAnchors): the fruit trees
// in the gardens → trad, the stalls and long tables on the campi → gemenskap. Venice has no verge beds, flood wall,
// timber blocks or growing tower, so mat, niva and bo stay at their places.
// Kickers, titles and units are Swedish, translated in place (en/ar.js, it/ar.js – or the engine's and the
// indicators' dictionaries where they already have them); notes with figures are written with t(sv,en,it).
const cm=m=>Math.round(m*100);
// How far a lever must be implemented (0–1) before a note names its first, second and third level (as vision-text.js).
const L1=.12,L2=.45,L3=.8;
// Raising the walkways from 1.10 towards 1.20 m costs at most PARAMS.heritageCost of the heritage (model.js); more than
// two points beyond that is water that got in.
const heritageAllowed=d=>(PARAMS.heritageCost||0)*Math.max(0,Math.min(1,(Math.min(d.protection,1.2)-1.1)/.1));
export const AR_SPOTS=[
  // The tide gauge at Punta della Salute, whose zero (the mean of 1885–1909) every Venetian level is measured from;
  // the sea's mean is 0.35 m on it today (2020–2025). The model's levels stand against the city's stones, and the
  // gauge stands on them: lifted with seawater, the city and its gauge rise together.
  {id:'niva',at:{x:-87,y:5,z:438},side:'auto',key:'level100',kicker:'Tidvattnet',title:'Hundraårshögvattnet vid Punta della Salute',unit:'över tidvattennollan',
    note:(d,d0)=>{const lift=d.uplift||0,out=d0.lagoonMean+d.seaRise,closed=d.lagoonClosed>.98;
      return t(`Havets medelnivå står ${dec(out,2)} m över nollan från 1897 (2026: ${dec(d0.lagoonMean,2)} m)${lift>=.005?` – mot stenar som har lyfts ${cm(lift)} cm`:''}. ${closed?'Bakom de stängda inloppen':'Bakom MOSE'} stannar ett hundraårshögvatten vid ${dec(d.levelInside,2)} m.`,
        `The sea's mean level stands ${dec(out,2)} m above the 1897 zero (2026: ${dec(d0.lagoonMean,2)} m)${lift>=.005?` – against stones that have been raised ${cm(lift)} cm`:''}. ${closed?'Behind the closed inlets':'Behind MOSE'} a 100-year high water stops at ${dec(d.levelInside,2)} m.`,
        `Il livello medio del mare è a ${dec(out,2)} m sopra lo zero del 1897 (2026: ${dec(d0.lagoonMean,2)} m)${lift>=.005?` – contro pietre sollevate di ${cm(lift)} cm`:''}. ${closed?'Dietro le bocche chiuse':'Dietro il MOSE'} un'acqua alta centenaria si ferma a ${dec(d.levelInside,2)} m.`);}},
  // The Riva degli Schiavoni by San Zaccaria, on the Bacino, where the storm of 12 November 2019 tore the
  // kiosks loose; the gates are at the Lido inlet, 3 km to the east, and at Malamocco and Chioggia.
  {id:'mose',at:{x:498,y:4,z:124},side:'auto',key:'moseClosures',kicker:'MOSE',title:'MOSE-stängningar om året',unit:'',
    note:d=>{const shut=d.lagoonClosed,C=d.barrierCloses;
      return shut>.98?L('Inloppen är stängda för gott: lagunen har blivit en sjö bakom en mur, och fartygen går genom slussen vid Malamocco.')
      :shut>=.5?t(`Lagunen är stängd mot havet ${pct(shut)} av årets timmar – oftare stängd än öppen. Luckorna reser sig när ett tidvatten över ${dec(C,2)} m väntas.`,
        `The lagoon is closed to the sea ${pct(shut)} of the hours in the year – more often closed than open. The gates rise when a tide above ${dec(C,2)} m is forecast.`,
        `La laguna è chiusa al mare per ${il(shut,false)} delle ore dell'anno – più spesso chiusa che aperta. Le paratoie si alzano quando è prevista una marea oltre ${dec(C,2)} m.`)
      :d.moseClosures>=360?t(`Luckorna reser sig nästan varje dag, när ett tidvatten över ${dec(C,2)} m väntas, och lagunen är stängd ${pct(shut)} av årets timmar.`,
        `The gates rise almost every day, whenever a tide above ${dec(C,2)} m is forecast, and the lagoon is closed ${pct(shut)} of the hours in the year.`,
        `Le paratoie si alzano quasi ogni giorno, quando è prevista una marea oltre ${dec(C,2)} m, e la laguna è chiusa per ${il(shut,false)} delle ore dell'anno.`)
      :t(`Luckorna vid Lido, Malamocco och Chioggia reser sig när ett tidvatten över ${dec(C,2)} m väntas. MOSE byggdes för 3–5 stängningar om året.`,
        `The gates at the Lido, Malamocco and Chioggia rise when a tide above ${dec(C,2)} m is forecast. MOSE was built for 3–5 closures a year.`,
        `Le paratoie di Lido, Malamocco e Chioggia si alzano quando è prevista una marea oltre ${dec(C,2)} m. Il MOSE era stato progettato per 3–5 chiusure l'anno.`);}},
  // Piazza San Marco, the lowest of the great squares: it floods from 0.80 m – the tides that reach it a year
  // (the model's stMarksFloods) and the walkways a 100-year storm puts under water.
  {id:'piazza',at:{x:92,y:3,z:83},side:'auto',key:'stMarksFloods',kicker:'Markusplatsen',title:'Vatten på Markusplatsen',unit:'tidvatten om året',
    note:d=>t(`${d.protection>.805?`Torget och de lägsta gatorna står torra upp till ${dec(d.protection,2)} m; förr svämmade det över redan vid 0,80 m.`:'Torget svämmar över så snart lagunen når 0,80 m och luckorna står öppna.'} ${d.floodShare>=.005?`Vid ett hundraårshögvatten står ${pct(d.floodShare)} av gångvägarna under vatten.`:'Ett hundraårshögvatten håller sig under skyddet.'}`,
      `${d.protection>.805?`The square and the lowest streets stay dry up to ${dec(d.protection,2)} m; it used to flood from 0.80 m.`:'The square floods as soon as the lagoon reaches 0.80 m and the gates are open.'} ${d.floodShare>=.005?`In a 100-year high water ${pct(d.floodShare)} of the walkways are under water.`:'A 100-year high water stays below the protection.'}`,
      `${d.protection>.805?`La piazza e le calli più basse restano asciutte fino a ${dec(d.protection,2)} m; un tempo andavano sott'acqua già a 0,80 m.`:'La piazza va sott\'acqua appena la laguna arriva a 0,80 m e le paratoie sono aperte.'} ${d.floodShare>=.005?`Con un'acqua alta centenaria ${il(d.floodShare,false)} dei percorsi pedonali è sott'acqua.`:"Un'acqua alta centenaria resta sotto la protezione."}`)},
  // St Mark's Basilica, whose narthex (63 cm) is the city's lowest floor.
  {id:'kulturarv',at:{x:181,y:24,z:50},side:'auto',key:'heritage',kicker:'Markuskyrkan',title:'Kulturarvet (1 = intakt)',unit:'',
    note:d=>d.heritage<1-heritageAllowed(d)-.02?L('Saltvattnet har gnagt på tegel och marmor; högvattnen har skadat det som stått i tusen år.')
      :d.heritage<.985&&heritageAllowed(d)>0?L('Höjda kajer och nya trösklar har tagit något av de gamla stenarna – priset för att hålla vattnet ute.')
      :L('Förhallens mosaikgolv från 1100-talet, som förr stod under vatten över 200 gånger om året, skyddas av glasbarriären från 2022.')},
  // The top of the Campanile (98.6 m): the view over the lagoon and its salt marshes.
  {id:'barene',at:{x:121,y:80,z:107},side:'auto',key:'saltMarsh',kicker:'Kampanilen',title:'Saltängar i lagunen',unit:'km²',
    note:(d,d0,I)=>d.saltMarsh<1?L('Saltängarna är borta: från tornet syns bara öppet vatten där de låg. År 1912 fanns 158 km².')
      :d.saltMarsh>=d0.saltMarsh+3?L('Från tornet syns nya barene där det i dag är öppet vatten, byggda av muddrat slam. År 1912 fanns 158 km².')
      :d.saltMarsh<=d0.saltMarsh-3?((I.hav||0)>L1?L('Nya saltängar byggs av muddermassor, men havet dränker dem fortare än de växer. År 1912 fanns 158 km².')
        :L('Saltängarna drunknar när havet stiger fortare än de växer. År 1912 fanns 158 km².'))
      :L('Omkring en halv kvadratkilometer försvinner varje år, och nya byggs av muddermassor. År 1912 fanns 158 km².')},
  // The quay of San Giorgio Maggiore, facing the Bacino: the Fondazione Cini's island.
  {id:'lagun',at:{x:451,y:3,z:566},side:'auto',key:'waters',kicker:'Lagunen',title:'Lagunens hälsa (1 = god status)',unit:'',
    note:(d,d0,I)=>d.lagoonClosed>.98?L('Inloppen är stängda för gott: lagunen har blivit en sjö, och vattnet byts inte längre med havet.')
      :d.bloom>.35?L('Algblomning och syrebrist de varmaste somrarna.')
      :d.waters>d0.waters+.1?((I.hav||0)>L2?L('Lagunen återhämtar sig: sjögräs på bottnarna, fiskefria zoner och klarare vatten för varje år.'):L('Lagunen återhämtar sig: klarare vatten för varje år.'))
      :d.waters<d0.waters-.05?(d.lagoonClosed>.1?t(`Lagunen mår sämre än 2026: luckorna står stängda ${pct(d.lagoonClosed)} av årets timmar, och det stilla vattnet värms.`,
          `The lagoon is in worse health than in 2026: the gates are closed ${pct(d.lagoonClosed)} of the hours in the year, and the still water warms.`,
          `La laguna sta peggio che nel 2026: le paratoie restano chiuse per ${il(d.lagoonClosed,false)} delle ore dell'anno, e l'acqua ferma si scalda.`)
        :L('Lagunen mår sämre än 2026: varmare vatten och färre saltängar.'))
      :L('Inget av lagunens elva vattenområden hade god ekologisk status 2026, och sedimentet rinner ut i havet.')},
  // The Rialto bridge, the city's most crowded walk.
  {id:'besok',at:{x:-123,y:11,z:-340},side:'auto',key:'dayVisitors',kicker:'Rialtobron',title:'Dagsbesökare en vanlig dag',unit:'',
    note:(d,d0)=>t(`${dec(d.visitorsPerResident,1)} besökare per invånare en vanlig dag (2026: ${dec(d0.visitorsPerResident,1)}). En studie satte stadens bärkraft till omkring 52 000 besökare om dagen.`,
      `${dec(d.visitorsPerResident,1)} visitors per resident on an ordinary day (2026: ${dec(d0.visitorsPerResident,1)}). A study put the city's carrying capacity at about 52,000 visitors a day.`,
      `${dec(d.visitorsPerResident,1)} visitatori per abitante in un giorno normale (2026: ${dec(d0.visitorsPerResident,1)}). Uno studio ha stimato la capacità di carico della città in circa 52.000 visitatori al giorno.`)},
  // Fondaco dei Tedeschi: a trading house of 1508, a department store until 2025 – a house for residents in
  // the vision (places.js).
  {id:'bo',at:{x:-64,y:24,z:-362},side:'auto',key:'emptyHomes',kicker:'Bostäderna',title:'Bostäder utan boende',unit:'',
    note:(d,d0)=>{const beds=INDICATORS.touristBeds.fmt,pop=INDICATORS.pop.fmt,apts=INDICATORS.shortLetHomes.fmt;
      return t(`${beds(d.touristBeds)} turistbäddar mot ${pop(d.pop)} invånare och ${apts(d.shortLetHomes)} turistlägenheter (2026: ${beds(d0.touristBeds)}, ${pop(d0.pop)} och ${apts(d0.shortLetHomes)}).`,
        `${beds(d.touristBeds)} tourist beds against ${pop(d.pop)} residents, and ${apts(d.shortLetHomes)} tourist apartments (2026: ${beds(d0.touristBeds)}, ${pop(d0.pop)} and ${apts(d0.shortLetHomes)}).`,
        `${beds(d.touristBeds)} posti letto turistici contro ${pop(d.pop)} abitanti, e ${apts(d.shortLetHomes)} appartamenti turistici (2026: ${beds(d0.touristBeds)}, ${pop(d0.pop)} e ${apts(d0.shortLetHomes)}).`);}},
  // Scuola Armando Diaz in Castello: open schools are the clearest sign that families stay.
  {id:'folk',at:{x:454,y:16,z:-60},side:'auto',key:'pop',kicker:'Invånarna',title:'Invånare i den historiska staden',unit:'',
    note:(d,d0)=>t(`${pct(d.share65)} är 65 eller äldre, och grund- och mellanskolorna har ${int(Math.round(d.pupils/10)*10)} elever (2026: ${int(d0.pupils)}).`,
        `${pct(d.share65)} are 65 or older, and the primary and middle schools have ${int(Math.round(d.pupils/10)*10)} pupils (2026: ${int(d0.pupils)}).`,
        `${il(d.share65)} ha 65 anni o più, e le scuole primarie e medie hanno ${int(Math.round(d.pupils/10)*10)} alunni (2026: ${int(d0.pupils)}).`)
      +' '+(d.pupils>1.2*d0.pupils?L('Familjer har flyttat in i de tomma husen, och skolorna har barn igen.'):L('År 1951 bodde 174 808 människor i den historiska staden.'))},
  // Campo Santa Maria Formosa (and the stalls and long tables wherever they are in view).
  {id:'gemenskap',at:{x:294,y:4,z:-254},side:'auto',key:'friends',kicker:'Gemenskap',title:'Har vänner att räkna med',unit:'',
    note:(d,d0)=>t(`${pct(d.safe)} känner sig trygga när de går ensamma ute på kvällen (2026: ${pct(d0.safe)}).`,
      `${pct(d.safe)} feel safe walking alone after dark (2026: ${pct(d0.safe)}).`,
      `${il(d.safe)} si sente sicuro a camminare da solo dopo il tramonto (2026: ${pct(d0.safe)}).`)},
  // The Rialto market and its fish hall.
  {id:'mat',at:{x:-233,y:6,z:-516},side:'auto',key:'fishStalls',kicker:'Mat',title:'Fiskstånd vid Rialto',unit:'stånd',
    note:(d,d0,I)=>(I.regionalt||0)>L1?t(`Kronärtskockor från Sant'Erasmo, fisk och musslor från lagunen och fiskevallarna: uppskattningsvis ${pct(d.foodRegional)} av maten kommer från lagunen och Veneto (2026: ${pct(d0.foodRegional)}).`,
        `Artichokes from Sant'Erasmo, fish and clams from the lagoon and its fish farms: an estimated ${pct(d.foodRegional)} of the food comes from the lagoon and the Veneto (2026: ${pct(d0.foodRegional)}).`,
        `Carciofi di Sant'Erasmo, pesce e vongole della laguna e delle valli da pesca: si stima che ${il(d.foodRegional,false)} del cibo venga dalla laguna e dal Veneto (2026: ${pct(d0.foodRegional)}).`)
      :t(`Sju fiskstånd fanns kvar 2024, mot ett trettiotal på 1980-talet. Uppskattningsvis ${pct(d.foodRegional)} av maten kommer från lagunen och Veneto.`,
        `Seven fish stalls were left in 2024, against some thirty in the 1980s. An estimated ${pct(d.foodRegional)} of the food comes from the lagoon and the Veneto.`,
        `Nel 2024 restavano sette banchi del pesce, contro una trentina negli anni Ottanta. Si stima che ${il(d.foodRegional,false)} del cibo venga dalla laguna e dal Veneto.`)},
  // The Accademia bridge over the Grand Canal.
  {id:'batar',at:{x:-668,y:7,z:369},side:'auto',key:'boatElectric',kicker:'Canal Grande',title:'Båttrafik som går på el',unit:'',
    note:(d,d0)=>(d.boatElectric>.6?(d.boats<.8?L('Tysta vaporetti och taxibåtar laddar vid bryggorna; svallvågorna mot kajerna har minskat.'):L('Tysta vaporetti och taxibåtar laddar vid bryggorna.')):L('Fortfarande mest diesel på kanalerna.'))
      +' '+t(`Kvävedioxiden vid Rio Novo: ${Math.round(d.no2)} µg/m³ (2026: ${Math.round(d0.no2)}; EU:s gräns från 2030: 20).`,`Nitrogen dioxide at Rio Novo: ${Math.round(d.no2)} µg/m³ (2026: ${Math.round(d0.no2)}; the EU limit from 2030: 20).`,`Biossido di azoto a rio Novo: ${Math.round(d.no2)} µg/m³ (2026: ${Math.round(d0.no2)}; il limite europeo dal 2030: 20).`)},
  // The hospital at Santi Giovanni e Paolo, in the Scuola Grande di San Marco.
  {id:'liv',at:{x:467,y:17,z:-596},side:'auto',key:'lifeExp',kicker:'Hälsa',title:'Medellivslängd',unit:'år',
    note:d=>t(`${pct(d.share80)} är över 80, och ${pct(d.steppedBridges)} av broarna har trappsteg.`,
      `${pct(d.share80)} are over 80, and ${pct(d.steppedBridges)} of the bridges have steps.`,
      `${il(d.share80)} ha più di 80 anni, e ${il(d.steppedBridges,false)} dei ponti ha gradini.`)},
  // Over the tiled roofs between Rialto and its market: no panels on them – solar panels are banned on buildings from
  // before 1945, and solar tiles that look like coppi come only with Sol där det är tillåtet's third level; the city's
  // sun comes from the port's and the garages' roofs at its edges. And how the houses are heated.
  {id:'sol',at:{x:-181,y:14,z:-434},side:'auto',key:'solarMW',kicker:'Energi',title:'Solel i och kring den historiska staden',unit:'MW',
    note:(d,d0,I)=>((I.sol||0)>L3?L('Soltegel som ser ut som coppi ligger på de tak där Soprintendenza tillåter dem – utifrån syns ingen skillnad.')
        :(I.sol||0)>L1?L('Inga paneler på de gamla taken: solpaneler är förbjudna på hus från före 1945. Solelen kommer från hamnens och garagens tak vid stadens kanter.')
        :L('Inga paneler på de gamla taken: solpaneler är förbjudna på hus från före 1945 och tillåts bara på enstaka plana tak.'))
      +' '+t(`${pct(d.gasHeat)} av hemmens energi är gas (2026: ${pct(d0.gasHeat)}).`,`${pct(d.gasHeat)} of homes' energy is gas (2026: ${pct(d0.gasHeat)}).`,`${il(d.gasHeat)} dell'energia delle case è gas (2026: ${pct(d0.gasHeat)}).`)},
  // Campo Santo Stefano, where the shade sails and trees in planters come with Svalka i campi (and the fruit trees in
  // the gardens wherever they are in view).
  {id:'trad',at:{x:-555,y:5,z:210},side:'auto',key:'shade',kicker:'Svalka',title:'Skugga på campi',unit:'',
    note:(d,d0)=>t(`Omkring ${Math.round(hotDays(d))} dagar över 30 °C och ${Math.round(tropicalNights(d))} tropiska nätter om året (2026: ${Math.round(hotDays(d0))} och 67).`,
      `About ${Math.round(hotDays(d))} days above 30 °C and ${Math.round(tropicalNights(d))} tropical nights a year (2026: ${Math.round(hotDays(d0))} and 67).`,
      `Circa ${Math.round(hotDays(d))} giorni sopra i 30 °C e ${Math.round(tropicalNights(d))} notti tropicali all'anno (2026: ${Math.round(hotDays(d0))} e 67).`)},
  // Palazzo Ducale: the Hall of the Great Council, where a citizens' assembly chosen by lot meets again with Vattenstadens
  // röst's third level.
  {id:'rad',at:{x:242,y:28,z:88},side:'auto',key:'turnout',kicker:'Dogepalatset',title:'Valdeltagande',unit:'',
    note:(d,d0,I)=>(I.demokrati||0)>L3?L('I Stora rådssalen möts igen ett råd: det lottade medborgarrådet, med ett ombud för lagunens framtida generationer.')
      :t(`${pct(d.womenCouncil)} av ledamöterna i kommunfullmäktige är kvinnor (2026: ${pct(d0.womenCouncil)}).`,
        `${pct(d.womenCouncil)} of the city council's members are women (2026: ${pct(d0.womenCouncil)}).`,
        `${il(d.womenCouncil)} dei consiglieri comunali sono donne (2026: ${pct(d0.womenCouncil)}).`)},
];
if(LANG!=='sv')for(const sp of AR_SPOTS){sp.kicker=L(sp.kicker);sp.title=L(sp.title);sp.unit=L(sp.unit);}
export function arSpec(spot,run,year){
  const i=Math.max(0,Math.min(run.years.length-1,Math.floor(year)-2026)),y=run.years[i],d=y.ind,d0=run.years[0].ind,meta=INDICATORS[spot.key];
  const series=run.years.slice(0,i+1).filter((_,k)=>k%3===0||k===i).map(y=>y.ind[spot.key]);
  const fmt=meta.fmt;
  return {...spot,value:d[spot.key],from:d0[spot.key],fmt,fromText:i?`2026: ${fmt(d0[spot.key])}`:'',spark:series.length>2?series:null,note:spot.note(d,d0,y.I||{})};
}
