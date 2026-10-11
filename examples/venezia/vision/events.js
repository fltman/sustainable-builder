import { FLOOD, BASE } from './model.js';
import { t, L, dec, int, pct } from '@engine/i18n.js';
// Events that test Venice. Each resolves against the state Venice's own model (model.js) has reached that year
// and the plan's levers: the same storm is a news item in a Venice that has raised its walkways and a disaster in
// one that has not; the same heatwave is survived on shaded campi with care that looks in, and kills in a city of
// hot stone where the old live alone. Years are jittered ±2 per run, so none comes before 2029 (2026 stays as
// measured). severity 0–1; apply() changes the model's own state: the city's money for change (damage → funds),
// the mood that feeds the friends people count on (eventMood), lives shortened (lifeShock), visitors kept away
// (visitShock), the stones (heritage), the lagoon's water (waters), and the people and households who come or
// leave (the cohorts c, y, m, o, e and households H – the population is their sum).
// What an event reads: ctx (model.js passes s, I, year, seaRise – the sea against the city's stones –, level100,
// flooded, floodRisk, stress, localEnergy, preparedness, nature and W). The year's measures it does not pass –
// how much of the year the lagoon is shut, the hot days, the tourist beds, the empty homes, Rialto's fish stalls –
// are recomputed below from the same state with model.js's own formulas.
// The facts are in research/deep: hav-tidvatten (the tides, MOSE, its cost, the heat, the water), lagun-natur-mat
// (the salt marshes, the lagoon's water, the flamingos, Rialto's market), turism-ekonomi (the visitors, the record
// day of 2022, the cruise ships, UNESCO), samhalle-halsa (an old city that lives alone, the empty homes, OCIO's
// counter) and energi-resor (gas heating, the boats, the port).
// Titles and fixed sentences are Swedish strings that go through L() (English in en/events.js, Italian in
// it/events.js); sentences with the model's numbers in them are written in all three languages here, with t().
// Each event gives its weather (weather.js: {storm, haze, drought, empty, dark}, or a function of the severity
// and the outcome; {} is a calm day): a storm with rain and white horses for the high waters – the sea drawn at
// their `level`, and behind MOSE the lagoon at the level the barrier holds – haze and straw-coloured lawns for
// heat and drought, empty calli in the pandemic, a city dimmed at night by an energy crisis that went badly.
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const band=(v,good,mid,bad)=>v<.3?good:v<.6?mid:bad;
const say=(...parts)=>parts.filter(Boolean).map(L).join(' ');
const hundreds=v=>int(Math.round(v/100)*100),thousands=v=>int(Math.round(v/1000)*1000);
// Lists in each language: "a, b och c" / "a, b and c" / "a, b e c".
const list=parts=>parts.length<2?parts[0]||'':`${parts.slice(0,-1).join(', ')} ${t('och','and','e')} ${parts.at(-1)}`;
// Small numbers in words.
const word=n=>t(['inga','ett','två','tre','fyra','fem','sex','sju','åtta','nio','tio'][n],['no','one','two','three','four','five','six','seven','eight','nine','ten'][n],['nessun','un','due','tre','quattro','cinque','sei','sette','otto','nove','dieci'][n])??int(n);
// Italian articles before a percentage: "l'8%", "l'11%", "il 37%".
const il=p=>(/^(8|11\D|1\D)/.test(p)?"l'":'il ')+p;
const BR=FLOOD.barrier;
// The sea's mean level on the tide gauge's zero (ZMPS, Punta della Salute 1897), 2020–2025 (model.js MEAN0).
const MEAN=.353;

// The year's measures: model.js passes them (ctx.shut, hotDays, touristBeds, emptyHomes, fishStalls); the same
// formulas below are only a fallback for a ctx without them.
// The share of the year's hours the lagoon is shut: for good at the radical level of Lagunens portar, otherwise
// by the margin between the closing level and the sea's mean (model.js closedShareAt).
const forGood=({I})=>clamp((I.mose-.67)/.33)>.5;
const shutShare=c=>{if(c.shut!=null)return c.shut;const {s,I,seaRise}=c,p=clamp((I.mose-.67)/.33);return p+(1-p)/(1+Math.exp((s.barrierCloses-MEAN-seaRise-.037)/.204));};
// Days over 30 °C in an ordinary year of this world (model.js hotDays).
const hotDays=c=>c.hotDays??22+(c.W.hotDays-22)*c.W.shape(c.year-2026);
// Tourist beds: 25 447 in hotels and B&Bs, 4.03 an apartment (model.js touristBeds).
const bedsOf=s=>BASE.touristBeds+(s.T-BASE.shortLetHomes)*24760/6145;
// Dwellings with no registered resident (model.js emptyHomes).
const emptyOf=s=>clamp(BASE.emptyHomes+(BASE.households-s.H)/BASE.dwellings,.02,.95);
// Rialto's fish stalls (model.js fishStalls).
const stallsOf=c=>{if(c.fishStalls!=null)return c.fishStalls;const {s,I}=c,raw=BASE.fishStalls*Math.pow(s.pop/BASE.pop,.8)*Math.sqrt(clamp(.6+.4*s.waters/BASE.waters,.3,2.5))*(1+3*I.regionalt);
  return 40*raw/(40+raw)*(40+BASE.fishStalls)/40;};

// An event's `level` is the sea's, in metres on the tide gauge's zero: what the city sees is what MOSE lets in.
// The gates rise when a tide above their closing level is forecast (s.barrierCloses: 1.10 m today, higher where
// the city has raised its walkways, lower where it chooses to close more often) and hold the lagoon at about
// s.barrierInside (0.86 m today, creeping up the longer they stay shut and once the sea passes the 60 cm they were
// built for). The engine's flood badge and flood map draw the same from the same numbers.
const inCity=(c,w)=>w>(c.s.barrierCloses??BR.closes)?Math.min(w,c.s.barrierInside??BR.inside):w;
// The harm: none up to the protection (s.protection: the lowest walkways, St Mark's Square at 0.80 m, raised by up
// to 0.40 m by Leva med vattnet); above it a fifth for the first wet stones and the rest with the share of the public
// walkways under water (the Comune's table, model.js FLOOD.table: 2 % at 0.90 m, 12 % at 1.10 m, 59 % at 1.40 m) –
// all of it once a third are wet (about 1.2 m).
const harm=(c,x)=>x<=c.s.protection?0:Math.min(1,.2+c.flooded(x)/.4);
// The basilica's narthex (63 cm, flooded over 200 times a year before 2019) is behind the glass barrier of 2022,
// built for 110 cm.
const narthex=(c,x)=>x>Math.max(1.1,c.s.protection)?'Vattnet tog sig också förbi glasbarriären in i Markuskyrkans förhall, där mosaikgolvet från 1100-talet än en gång fick salt.':'';
// A storm tide against the records: 194 cm on 4 November 1966, 187 cm on 12 November 2019.
const record=w=>w>=1.94?t('högre än den 4 november 1966','higher than on 4 November 1966','più che il 4 novembre 1966')
  :w>=1.87?t('högre än den 12 november 2019, när nästan hela staden stod under vatten','higher than on 12 November 2019, when almost the whole city stood under water',"più che il 12 novembre 2019, quando quasi tutta la città finì sott'acqua")
  :t('nästan lika högt som den 12 november 2019, när nästan hela staden stod under vatten','almost as high as on 12 November 2019, when almost the whole city stood under water',"quasi quanto il 12 novembre 2019, quando quasi tutta la città finì sott'acqua");

export const EVENTS=[
  // A storm like 12 November 2019 (187 cm; 1966: 194 cm): the sea a little under today's 100-year level (about
  // 2.10 m). MOSE (in service since October 2020) rises and holds the lagoon at about 0.86 m – above St Mark's
  // Square (0.80 m) unless the insula of San Marco has been sealed and the lowest quays raised (Leva med vattnet).
  // The state's work to seal the insula to 1.10 m began in 2019 and goes slowly on today's course.
  {id:'stormflod_2031',year:2031,icon:'🌊',title:'Stormfloden',weather:{storm:1,empty:.7},
    resolve:(c,r)=>{const w=c.level100-.3+.2*r,x=inCity(c,w),P=c.s.protection,sev=harm(c,x),lead=t(`Sirocco, fullmåne och ett djupt lågtryck över Adriatiska havet: utanför lidona steg havet till ${dec(w,2)} m, ${record(w)}.`,`Sirocco, a full moon and a deep low over the Adriatic: outside the Lido the sea rose to ${dec(w,2)} m, ${record(w)}.`,`Scirocco, luna piena e una profonda bassa pressione sull'Adriatico: fuori dai lidi il mare è salito a ${dec(w,2)} m, ${record(w)}.`);
      return {severity:sev,level:w,extra:say(narthex(c,x),x>P&&P<1.095?'Arbetet med att täta insulan San Marco till 1,10 m, påbörjat 2019, var ännu inte klart.':''),
        text:say(lead,x<=P?t(`Nu reste sig MOSE:s 78 luckor, lagunen bakom dem stannade på ${dec(x,2)} m, och de höjda kajerna höll staden torr.`,`This time MOSE's 78 gates rose, the lagoon behind them stopped at ${dec(x,2)} m, and the raised quays kept the city dry.`,`Questa volta le 78 paratoie del MOSE si sono alzate, la laguna dietro di loro si è fermata a ${dec(x,2)} m e le rive rialzate hanno tenuto la città all'asciutto.`)
          :c.flooded(x)<.04?t(`Nu reste sig MOSE:s 78 luckor – men lagunen bakom dem stod på ${dec(x,2)} m, högre än Markusplatsen, så piazzan och de lägsta gränderna fick ändå vatten.`,`This time MOSE's 78 gates rose – but the lagoon behind them stood at ${dec(x,2)} m, above St Mark's Square, so the piazza and the lowest alleys still took water.`,`Questa volta le 78 paratoie del MOSE si sono alzate – ma dietro di loro la laguna era a ${dec(x,2)} m, più in alto di piazza San Marco, così la piazza e le calli più basse sono andate comunque sott'acqua.`)
          :t(`MOSE stängde, men lagunen bakom luckorna steg till ${dec(x,2)} m och in över ${pct(c.flooded(x))} av gångvägarna, och butiker och bottenvåningar fick vatten igen.`,`MOSE closed, but the lagoon behind the gates rose to ${dec(x,2)} m and over ${pct(c.flooded(x))} of the walkways, and shops and ground floors flooded again.`,`Il MOSE ha chiuso, ma la laguna dietro le paratoie è salita a ${dec(x,2)} m e ha invaso ${il(pct(c.flooded(x)))} dei percorsi pedonali, e negozi e pianterreni si sono allagati di nuovo.`)),
        apply:st=>{st.damage+=.1*sev;st.eventMood-=.02*sev;st.heritage=clamp(st.heritage-.04*sev);}};}},
  // OCIO's counter of residents against tourist beds has stood in the window of the Libreria Marco Polo since
  // April 2023; the beds passed the residents in October 2024 (48 469 against 48 451) and stood at 50 207 against
  // 46 964 in September 2026. Turistlägenheterna (korttid, Venice's own power since 2022) decides whether
  // flats come back as homes; Hem för venetianer whether the residents grow in number.
  {id:'rakningen_2034',year:2034,icon:'🏠',title:'Räknaren i fönstret',weather:{},
    resolve:c=>{const {s,I}=c,b=c.touristBeds??bedsOf(s),per=b/s.pop,sev=clamp((per-.85)/.7),back=BASE.shortLetHomes-s.T,more=s.T-BASE.shortLetHomes,P=hundreds(s.pop),B=hundreds(b);
      return {severity:sev,good:per<1,
        text:per<1?say(t(`Räknaren som OCIO satte upp i fönstret på Libreria Marco Polo 2023 visade fler invånare än turistbäddar igen: ${P} mot ${B}.`,`The counter OCIO put up in the window of the Libreria Marco Polo in 2023 showed more residents than tourist beds again: ${P} against ${B}.`,`Il contatore che l'OCIO ha messo nella vetrina della Libreria Marco Polo nel 2023 segnava di nuovo più residenti che posti letto turistici: ${P} contro ${B}.`),
            back>=100?t(`${hundreds(back)} turistlägenheter hade blivit hem igen.`,`${hundreds(back)} tourist flats had become homes again.`,`${hundreds(back)} appartamenti turistici erano tornati a essere case.`):'Venetianerna hade blivit fler.')
          :per<1.25?say(t(`Räknaren i fönstret på Libreria Marco Polo visade ${P} invånare och ${B} turistbäddar.`,`The counter in the window of the Libreria Marco Polo showed ${P} residents and ${B} tourist beds.`,`Il contatore nella vetrina della Libreria Marco Polo segnava ${P} residenti e ${B} posti letto turistici.`),
            I.korttid>.15?'Taket på korttidsuthyrningen hade bromsat ökningen, men bäddarna var fortfarande fler än venetianerna.':'Bäddarna hade varit fler än venetianerna sedan hösten 2024.')
          :say(t(`Räknaren i fönstret på Libreria Marco Polo visade ${P} invånare och ${B} turistbäddar – ${dec(per,1)} för varje venetian.`,`The counter in the window of the Libreria Marco Polo showed ${P} residents and ${B} tourist beds – ${dec(per,1)} for every Venetian.`,`Il contatore nella vetrina della Libreria Marco Polo segnava ${P} residenti e ${B} posti letto turistici – ${dec(per,1)} per ogni veneziano.`),
            more>=100?t(`Sedan 2026 hade ${hundreds(more)} nya turistlägenheter registrerats, många i hem där en äldre venetian hade bott.`,`Since 2026, ${hundreds(more)} new tourist flats had been registered, many in homes where an old Venetian had lived.`,`Dal 2026 erano stati registrati ${hundreds(more)} nuovi appartamenti turistici, molti in case dove aveva abitato un anziano veneziano.`):'Det var inte bäddarna som hade blivit fler, utan invånarna som hade blivit färre.'),
        apply:st=>{st.eventMood+=per<1?.02:-.02*sev;}};}},
  // A winter without snow in the Alps (as in 2022–23): the rivers low and salt water far up them; and a high
  // pressure that draws the water out of the lagoon – at −55 cm the inner canals are hard to use, the record is
  // −124 cm (1882), −83 cm in 2008. A higher sea makes such low waters rarer (fewer under −60 cm every decade).
  // Venice's water comes from 34 deep wells on the mainland, with river water from the Sile when demand is high;
  // 41.7 % is lost in the pipes. Vatten och beredskap (s.water, preparedness) decides how it goes.
  {id:'torka_2038',year:2038,icon:'☀',title:'Torkan och lågvattnet',weather:sev=>({haze:.45,drought:.2+.3*Math.min(1,sev*1.5)}),
    resolve:({s,stress,seaRise,preparedness},r)=>{const hazard=.45+.3*stress+.2*r,low=.35*(1-clamp(seaRise/.5)),sev=clamp(hazard*(1.2*(1-s.water)+low*(1-.6*preparedness)));return {severity:sev,
      text:band(sev,'En vinter utan snö i Alperna: Po, Brenta och Sile sjönk till rekordlåga nivåer och saltvattnet trängde långt upp i floderna. Ett högtryck drog ut vattnet ur lagunen och torrlade de inre kanalerna några dagar, men brunnarna på fastlandet räckte, och båtarna väntade ut lågvattnet.',
        'En vinter utan snö i Alperna och ett högtryck som drog ut vattnet ur lagunen: gondoler och transportbåtar stod på botten i de inre kanalerna, ambulansbåtarna fick ta omvägar, och på fastlandet ransonerades vattnet när saltvattnet trängde upp i floderna.',
        'Torkan blev en kris. Saltvattnet trängde in i floderna och brunnsfälten, vattnet ransonerades i hela kommunen, och när lågvattnet torrlade kanalerna kom varken sopbåtar, varor eller ambulanser fram.'),
      apply:st=>{st.damage+=.05*sev;st.eventMood-=.02*sev;st.visitShock=Math.max(st.visitShock,.03*sev);}};}},
  // 2020: the historic city's guest nights fell by 71 % (2.53 million against 8.82 million in 2019), the boats
  // stopped and the canals cleared; nearly a fifth of the jobs are in hotels and restaurants. A third of the
  // residents are 65 or older, and almost as many live alone (14 800 one-person households, 55.9 % of all). The
  // old are spared by care at home (forebyggande), neighbours (friends) and early warning (AI, governed); the
  // economy by fewer visitors per resident and jobs beyond tourism (kunskap).
  {id:'pandemi_2040',year:2040,icon:'🦠',title:'Pandemin',weather:sev=>({empty:.55+.4*sev}),
    resolve:({s,I},r)=>{const health=(.4+.25*r)*(s.share65/BASE.share65)*(1-.35*I.forebyggande)*(1.3-.6*s.friends)*(1-.25*s.aiCapacity*s.aiGovernance),
      economy=.3*clamp(s.visitorsPerResident/1.83)*(1-.5*I.kunskap),sev=clamp(health+economy-.15);return {severity:sev,
      text:band(sev,s.friends>.75?'Tidig upptäckt och grannar som handlade åt de äldre bromsade smittan snabbt. Turisterna försvann i några månader, och venetianerna fick tillbaka sin stad: klart vatten i kanalerna och tysta campi.':'Smittan bromsades efter några tuffa månader. Turisterna försvann, båtarna stod still och vattnet i kanalerna blev klart som 2020.',
        say('Ett år av restriktioner. Hotellen och de korttidsuthyrda lägenheterna stod tomma, som 2020 när gästnätterna föll med sju tiondelar, och i en stad där nästan vart femte jobb finns i hotell och restauranger stannade ekonomin.',I.kunskap>.4?'Universitetet, restaureringsverkstäderna och lagunens arbeten höll ändå många i arbete.':''),
        s.share65>=.3?'Smittan gick hårt åt en stad där var tredje är över 65 och nästan lika många bor ensamma. Sjukhuset vid Santi Giovanni e Paolo gick på knäna, och många som förlorat jobbet i turismen flyttade till fastlandet.'
          :'Smittan gick hårt åt en stad där var fjärde är över 65 och många bor ensamma. Sjukhuset vid Santi Giovanni e Paolo gick på knäna, och många som förlorat jobbet i turismen flyttade till fastlandet.'),
      apply:st=>{st.lifeShock+=.5*sev;st.damage+=.08*sev;st.friends-=.03*sev;st.visitShock=Math.max(st.visitShock,.71*(.4+.6*sev));if(sev>.6)st.y*=1-.05*(sev-.4);}};}},
  // The port after the ban of 1 August 2021 (ships over 25 000 GT out of the San Marco basin and the Giudecca
  // canal): the cruise ships dock at Marghera and Fusina through the deep Malamocco–Marghera channel, whose banks
  // retreat 3–4 m a year in the ships' wakes. UNESCO (48 COM 7B.40) wants the ships led to ports outside the
  // lagoon and a strategic environmental assessment of the new port plan. Hamnen och fartygen (hamn) decides it.
  {id:'hamnplanen_2042',year:2042,icon:'🚢',title:'Hamnplanen',weather:{},
    resolve:({I})=>{const h=I.hamn,sev=clamp(.5-.85*h);return {severity:sev,good:h>.3,
      text:h>.55?'Den nya hamnplanen antogs: kryssnings- och containerterminalerna flyttas ut till kajer utanför inloppen, och kanalen Malamocco–Marghera får grundas upp igen. UNESCO, som hade krävt en miljöbedömning av hamnen sedan 2020-talet, kallade beslutet ett föredöme.'
        :h>.2?'Den nya hamnplanen stoppade all ny muddring: bara fartyg som ryms i dagens kanaler får gå in i lagunen, och vid kajerna i Marittima och Marghera stänger de av motorerna och tar landström.'
        :'Den nya hamnplanen höll kvar kryssningsfartygen i Marghera och Fusina, och de djupa kanalerna genom lagunen muddras som förut. Svallet från fartygen äter fortsatt på stranden längs kanalen Malamocco–Marghera, tre till fyra meter om året, och UNESCO upprepade sin varning.',
      apply:st=>{st.eventMood+=h>.3?.01:-.02*sev;}};}},
  // Days above 30 °C: 21.7 a year at Istituto Cavanis 2001–2025 (52 in 2024); tropical nights 66.9 (95 in 2022).
  // An old city that lives alone. The model's heat deaths fall with shade, fountains and cool rooms on the campi
  // (svalka, −30 %), heat pumps that also cool (effektivitet, −15 %) and care that looks in (forebyggande, −25 %);
  // here also with neighbours to count on.
  {id:'varmebolja_2046',year:2046,icon:'🌡',title:'Värmeböljan',weather:sev=>({haze:.8+.2*Math.min(1,sev*2),drought:.65,empty:.4+.3*Math.min(1,sev*1.5)}),
    resolve:({s,I,stress},r)=>{const sev=clamp((.4+.5*stress+.2*r)*Math.sqrt(s.share80/BASE.share80)*(1-.3*I.svalka)*(1-.15*I.effektivitet)*(1-.25*I.forebyggande)*(1.35-.5*s.friends)-.05);return {severity:sev,
      text:band(sev,I.svalka>.3?'Tre veckor över 30 grader och nätter som aldrig svalnade. Under träden på de nya gröna campi, vid fontänerna och i klostren som öppnats som svalrum satt de äldre om kvällarna, och grannarna ringde på hos dem som bodde ensamma.':'Tre veckor över 30 grader och nätter som aldrig svalnade. Grannar, hemtjänst och kyrkor som öppnats som svalrum höll koll på de äldre, och ingen dog ensam.',
        I.forebyggande>.4?'Tre veckor över 30 grader och fler tropiska nätter än någonsin. Sjukhuset vid Santi Giovanni e Paolo fylldes av äldre med värmeslag, men hemtjänstens båtar gick runt till de ensamma varje morgon, och vården klarade trycket.':'Tre veckor över 30 grader och fler tropiska nätter än någonsin. Sjukhuset vid Santi Giovanni e Paolo fylldes av äldre med värmeslag, men vården klarade trycket.',
        s.share65>=.3?'Värmen tog många liv. Var tredje venetian är över 65 och nästan lika många bor ensamma; i de heta lägenheterna under taken märkte ingen att något var fel.':'Värmen tog många liv. Var fjärde venetian är över 65, många bor ensamma, och i de heta lägenheterna under taken märkte ingen att något var fel.'),
      apply:st=>{st.lifeShock+=.6*sev;st.eventMood-=.03*sev;st.visitShock=Math.max(st.visitShock,.05*(.5+.5*sev));}};}},
  // UNESCO's World Heritage Centre proposed Venice for the List of World Heritage in Danger in 2021 and 2023 (mass
  // tourism, people moving out, the lagoon, the ships); the committee warned again in 2025 and 2026, and asks for
  // a carrying-capacity study, a sustainable tourism plan, an assessment of the port and MOSE run with the lagoon's
  // ecology in mind. The pressure it weighs here: no limit on the visitors (besok), a city emptying of residents
  // (against 2026's 47 625), a sick lagoon losing its salt marshes, the big ships (hamn) and the gates shut ever
  // more often (mose).
  {id:'unesco_2052',year:2052,icon:'🏛',title:'Världsarvskommittén',weather:{},
    resolve:c=>{const {s,I}=c,shut=shutShare(c);
      const parts={tour:1-I.besok,people:clamp((BASE.pop-s.pop)/(.3*BASE.pop)),lagoon:Math.max(clamp((.5-s.waters)/.4),clamp((40-s.marsh)/30)),ships:1-clamp(I.hamn/.67),gates:clamp((shut-.03)/.25)};
      const pressure=.3*parts.tour+.25*parts.people+.2*parts.lagoon+.15*parts.ships+.1*parts.gates,sev=clamp((pressure-.3)/.5);
      const goods=[I.besok>.6&&t('bokade besök','booked visits','le visite prenotate'),s.pop>=.97*BASE.pop&&t('bostäder som blivit hem igen','flats that have become homes again','le case tornate ad essere abitate'),
        parts.lagoon<.3&&t('en lagun som börjat andas','a lagoon that has begun to breathe','una laguna che ha ripreso a respirare'),parts.ships<.3&&t('en hamnplan som tar de stora fartygen ut ur lagunen','a port plan that takes the big ships out of the lagoon','un piano del porto che porta le grandi navi fuori dalla laguna')].filter(Boolean);
      // The lagoon's troubles in one phrase: its salt marshes or its water, and the gates.
      const sick=parts.lagoon>.5,shut2=parts.gates>.4,marshes=s.marsh<38;
      const lagoonBad=sick&&shut2?(marshes?t('en lagun som tappar sina saltängar och stängs allt oftare bakom MOSE','a lagoon losing its salt marshes and shut ever more often behind MOSE','una laguna che perde le sue barene ed è chiusa sempre più spesso dietro il MOSE')
          :t('en lagun utan ett enda vattenområde i god status, som stängs allt oftare bakom MOSE','a lagoon without a single water body in good status, shut ever more often behind MOSE','una laguna senza un solo corpo idrico in buono stato, chiusa sempre più spesso dietro il MOSE'))
        :sick?(marshes?t('en lagun som tappar sina saltängar','a lagoon losing its salt marshes','una laguna che perde le sue barene'):t('en lagun utan ett enda vattenområde i god status','a lagoon without a single water body in good status','una laguna senza un solo corpo idrico in buono stato'))
        :shut2?t('en lagun som stängs allt oftare bakom MOSE','a lagoon shut ever more often behind MOSE','una laguna chiusa sempre più spesso dietro il MOSE'):'';
      const bads=[parts.tour>.6&&t('massturismen','mass tourism','il turismo di massa'),parts.people>.3&&t('utflyttningen','the people moving away','lo spopolamento'),lagoonBad,
        parts.ships>.6&&t('de stora fartygen i lagunen','the big ships in the lagoon','le grandi navi in laguna')].filter(Boolean);
      if(!bads.length)bads.push(parts.tour>=parts.people?t('massturismen','mass tourism','il turismo di massa'):t('utflyttningen','the people moving away','lo spopolamento'));
      if(!goods.length)goods.push(t('stadens egna planer','the city\'s own plans','i piani della città'));
      return {severity:sev,good:pressure<.4,
        text:pressure<.4?t(`UNESCO:s världsarvskommitté strök Venedig från bevakningen: ${list(goods)} räckte som svar på kraven från 2020-talet.`,`UNESCO's World Heritage Committee took Venice off its watch: ${list(goods)} answered the demands of the 2020s.`,`Il Comitato del Patrimonio Mondiale dell'UNESCO ha tolto Venezia dalla sorveglianza: ${list(goods)} hanno risposto alle richieste degli anni Venti.`)
          :pressure<.6?t(`Världsarvskommittén varnade igen men lät bli att föra upp Venedig på listan över hotade världsarv. Den pekade på ${list(bads)}${goods.length&&bads.length<4?`, men noterade ${list(goods)}`:''}.`,`The World Heritage Committee warned again but stopped short of putting Venice on the List of World Heritage in Danger. It pointed to ${list(bads)}${goods.length&&bads.length<4?`, but noted ${list(goods)}`:''}.`,`Il Comitato del Patrimonio Mondiale ha lanciato un nuovo avvertimento, ma senza iscrivere Venezia nella Lista del patrimonio in pericolo. Ha indicato ${list(bads)}${goods.length&&bads.length<4?`, ma ha riconosciuto ${list(goods)}`:''}.`)
          :t(`Venedig fördes upp på UNESCO:s lista över hotade världsarv – för ${list(bads)}. Det som föreslogs 2021 och 2023 hade blivit verklighet.`,`Venice was put on UNESCO's List of World Heritage in Danger – for ${list(bads)}. What had been proposed in 2021 and 2023 had come true.`,`Venezia è stata iscritta nella Lista del patrimonio mondiale in pericolo dell'UNESCO – per ${list(bads)}. Ciò che era stato proposto nel 2021 e nel 2023 è diventato realtà.`),
        apply:st=>{if(pressure<.4){st.eventMood+=.03;st.friends+=.01;}else{st.eventMood-=.04*sev;st.friends-=.02*sev;}}};}},
  // The busiest day of 2022 had 143 246 visitors (30 October), three for every resident, 1.64 times an ordinary
  // day; a study puts the city's carrying capacity at 52 111 a day. In 1951, 174 808 people lived in the historic
  // city. The day is the model's own: the year's visitors on an ordinary day (s.visitorsPerResident) times 1.64,
  // less what real-time counting spreads (ai) – unless Besökare i lagom mängd caps it: a cap of 50 000 day visitors
  // at its second level, every visit booked within the carrying capacity at its third.
  {id:'rekorddagen_2055',year:2055,icon:'👥',title:'Rekorddagen',weather:{},
    resolve:({s,I})=>{const capped=I.besok>=1/3,N=s.visitorsPerResident*s.pop*BASE.peakDay/(BASE.dayVisitors+BASE.guestNights/365)*(1-.1*I.ai),per=N/s.pop;
      const sev=capped?clamp(.75-.85*I.besok):clamp((per-1.6)/2.6),many=N>=150000?(N<174808?t('nästan lika många som bodde i den historiska staden 1951','almost as many as lived in the historic city in 1951','quasi quanti abitavano nella città storica nel 1951'):t('fler än som bodde i den historiska staden 1951','more than lived in the historic city in 1951','più di quanti abitavano nella città storica nel 1951')):t(`${dec(per,1)} för varje invånare`,`${dec(per,1)} for every resident`,`${dec(per,1)} per ogni residente`);
      return {severity:sev,
        text:capped?(I.besok>.8?'En långhelg med billiga flyg: omkring 170 000 ville komma samma dag. Varje besök var bokat, och bokningen höll besökarna nära vad staden bär, omkring 52 000 om dagen; resten fick andra dagar, och venetianerna gick över Rialtobron som vanligt.'
            :I.besok>.64?'En långhelg med billiga flyg: omkring 170 000 ville komma samma dag. Taket höll dagsbesökarna vid 50 000, bokningen erbjöd resten andra dagar, och venetianerna kunde gå över Rialtobron som vanligt.'
            :'En långhelg med billiga flyg och fullt i staden, men avgiften och bokningen spred besökarna över fler dagar. Det var trångt vid Rialto, men staden fungerade.')
          :band(sev,t(`En långhelg med billiga flyg fyllde staden: omkring ${thousands(N)} besökare på en dag, ${dec(per,1)} för varje invånare. Det var trångt vid Rialto, men staden fungerade.`,`A long weekend of cheap flights filled the city: about ${thousands(N)} visitors in one day, ${dec(per,1)} for every resident. It was crowded at Rialto, but the city worked.`,`Un ponte con voli a basso costo ha riempito la città: circa ${thousands(N)} visitatori in un giorno, ${dec(per,1)} per ogni residente. A Rialto c'era ressa, ma la città ha funzionato.`),
            t(`Omkring ${thousands(N)} besökare på en dag – ${dec(per,1)} för varje invånare. Polisen stängde gångvägarna mot Rialto och Markusplatsen i flera timmar.`,`About ${thousands(N)} visitors in one day – ${dec(per,1)} for every resident. The police closed the walkways to Rialto and St Mark's Square for hours.`,`Circa ${thousands(N)} visitatori in un giorno – ${dec(per,1)} per ogni residente. La polizia ha chiuso per ore i percorsi verso Rialto e piazza San Marco.`),
            t(`Omkring ${thousands(N)} besökare på en dag – ${many}. Polisen stängde gångvägarna mot Rialto och Markusplatsen, vaporettona gick fulla förbi hållplatserna och de äldre kom inte fram till sjukhuset.`,`About ${thousands(N)} visitors in one day – ${many}. The police closed the walkways to Rialto and St Mark's Square, full vaporetti sailed past the stops and the elderly could not get to the hospital.`,`Circa ${thousands(N)} visitatori in un giorno – ${many}. La polizia ha chiuso i percorsi verso Rialto e piazza San Marco, i vaporetti tiravano dritto pieni davanti agli imbarcaderi e gli anziani non riuscivano ad arrivare all'ospedale.`)),
        apply:st=>{st.eventMood-=.03*sev;st.friends-=.02*sev;st.safe=Math.max(.25,st.safe-.02*sev);}};}},
  // MOSE's 78 gates (four barriers, 1.6 km) were built for 3–5 closures a year; they closed 49 times in the season
  // 2025/26. A closure costs about 200 000 euro, the energy 4.5 million euro in 2025, and the law grants 63 million a
  // year for running and maintaining the barriers; the Corte dei conti calls them "energivora" and recommended a
  // solar plant. The wear grows with the time the gates stand up (the lagoon's shut share); sharper forecasts (ai)
  // spare needless closures; at the radical level of Lagunens portar the inlets are shut for good and pumps hold
  // the lagoon down.
  {id:'underhallet_2057',year:2057,icon:'⚙',title:'Luckornas översyn',weather:{},
    resolve:c=>{const {s,I}=c,perm=forGood(c),wear=clamp((shutShare(c)-.02)/.1),sev=perm?.45:clamp(.1+.55*wear+.3*(1-s.funds))*(1-.25*I.ai);
      return {severity:sev,good:!perm&&sev<.3,
        extra:say(!perm&&I.ai>.4?'Skarpare tidvattenprognoser hade sparat många onödiga resningar.':'',I.sol>.5?(perm?'Solceller på hamnens tak gav en del av elen till pumparna, som Corte dei conti hade föreslagit för MOSE redan på 2020-talet.':'Solceller på hamnens tak gav en del av elen till luckornas kompressorer, som Corte dei conti hade föreslagit redan på 2020-talet.'):''),
        text:perm?'Inloppen är stängda för gott, och luckorna rör sig inte längre. I stället går pumparna som håller lagunen nere dygnet runt, och räkningen för el och underhåll – redan 2025 kostade bara elen till MOSE 4,5 miljoner euro – växer år för år.'
          :band(sev,'MOSE:s 78 luckor fick sin första stora översyn: en barriär i taget lyftes luckorna upp, gångjärnen byttes och tryckluftsledningarna lades om. Arbetet blev klart före höstens högvatten, och räkningen gick att bära.',
            'MOSE:s 78 luckor fick sin första stora översyn, en barriär i taget. Slitaget var större än planerat – luckorna reses långt oftare än de tre till fem gånger om året de byggdes för – och räkningen växte. Staten tog en del av pengarna ur speciallagen för Venedig, pengar som annars hade gått till kajerna och bostäderna.',
            'MOSE:s luckor behövde en stor översyn, men de reses så ofta att det knappt fanns ett lugnt fönster att lyfta upp en barriär i taget. Arbetet drog ut över flera vintrar, räkningen blev mycket större än planerat, och pengarna togs ur speciallagen för Venedig – ur kajerna, bostäderna och skolorna.'),
        apply:st=>{st.damage+=.05*sev;st.eventMood-=.01*sev;}};}},
  // Rialto's Pescheria, Domenico Rupolo's hall of 1907: seven fish stalls in 2024 against about thirty in the
  // 1980s; the vegetable stalls fell from 90 to fewer than 13, the butchers from 27 to 2, and the floor above has
  // stood empty since 2008 (a motion in the council, 2024). The stalls are the model's own count: they follow the
  // people who cook here, the lagoon's fish and a market the city backs (Lagunens mat och Rialto).
  {id:'pescherian_2058',year:2058,icon:'🦐',title:'Fiskstånden vid Rialto',weather:{},
    resolve:c=>{const {I}=c,n=stallsOf(c),k=Math.round(n),sev=clamp((7-n)/5);return {severity:sev,good:n>=8,
      text:k>=15?t(`Pescherian vid Rialto, Domenico Rupolos fiskhall från 1907, var full igen: ${k} fiskstånd mot sju år 2024, med fisk från lagunens fiskare och fiskevallarna${I.regionalt>.4?' och kronärtskockor från Sant\'Erasmo i grönsakshallen bredvid':''}.`,`The Pescheria at Rialto, Domenico Rupolo's fish hall of 1907, was full again: ${k} fish stalls against seven in 2024, with fish from the lagoon's fishers and the valli${I.regionalt>.4?" and artichokes from Sant'Erasmo in the vegetable hall next door":''}.`,`La Pescheria di Rialto, il mercato del pesce di Domenico Rupolo del 1907, era di nuovo piena: ${k} banchi contro i sette del 2024, con il pesce dei pescatori della laguna e delle valli${I.regionalt>.4?" e i carciofi di Sant'Erasmo nell'erbaria accanto":''}.`)
        :k>=9?say(t(`Fiskstånden vid Rialto hade blivit fler igen: ${k} mot sju år 2024.`,`The fish stalls at Rialto had grown in number again: ${k} against seven in 2024.`,`I banchi del pesce a Rialto erano tornati a crescere: ${k} contro i sette del 2024.`),I.regionalt>.25?'Skolorna och omsorgen köpte sin fisk av lagunens fiskare, och Pescherian hade rustats.':'')
        :k>=6?t(`Pescherian vid Rialto höll ställningarna med ${k} fiskstånd (sju år 2024), men de flesta sålde fisk från grossistmarknaden på Tronchetto snarare än från lagunen.`,`The Pescheria at Rialto held on with ${k} fish stalls (seven in 2024), but most sold fish from the wholesale market at Tronchetto rather than from the lagoon.`,`La Pescheria di Rialto resisteva con ${k} banchi (sette nel 2024), ma quasi tutti vendevano pesce del mercato all'ingrosso del Tronchetto più che della laguna.`)
        :k<=1?'Ett enda fiskstånd var kvar i Pescherian vid Rialto, mot ett trettiotal på 1980-talet. Fiskhandlarna som gick i pension fick inga efterträdare: de som lagar mat här hade blivit för få.'
        :t(`Bara ${word(k)} fiskstånd var kvar i Pescherian vid Rialto, mot ett trettiotal på 1980-talet. Fiskhandlarna som gick i pension fick inga efterträdare: de som lagar mat här hade blivit för få.`,`Only ${word(k)} fish stalls were left in the Pescheria at Rialto, against about thirty in the 1980s. The fishmongers who retired found no one to take over: too few people cook here now.`,`Nella Pescheria di Rialto restavano solo ${word(k)} banchi del pesce, contro una trentina negli anni Ottanta. I pescivendoli che andavano in pensione non trovavano nessuno a cui passare il banco: chi cucina qui è diventato troppo poco.`),
      apply:st=>{st.eventMood+=n>=8?.01:-.01*sev;}};}},
  // A tide of about a metre: under the 1.10 m at which MOSE rises today (forecasts of 1.01 m and up), so between
  // 0.80 and 1.10 m St Mark's Square is unprotected – unless the city closes the gates earlier (Lagunens portar:
  // from 1.00 m, or 0.90 m in a regulated lagoon) or raises the insula and the lowest quays (Leva med vattnet).
  // With the rising sea such tides come every autumn: s.floods is the year's tides that reach St Mark's.
  {id:'acqua_alta_2063',year:2063,icon:'🌊',title:'Högvattnet på en meter',weather:{storm:.35,empty:.4},
    resolve:(c,r)=>{const w=.96+.04*r,C=c.s.barrierCloses,closes=w>C,x=inCity(c,w),P=c.s.protection,n=Math.round(c.s.floods??0);
      const sev=closes&&x<=P?.1:harm(c,x)*(.6+.4*clamp(Math.log(1+n)/Math.log(361)));
      return {severity:sev,good:x<=P,level:w,extra:narthex(c,x),
        text:closes?(x<=P?t(`Ett högvatten på ${dec(w,2)} m, under de 1,10 m där MOSE reste sig förr. Nu stänger luckorna redan vid ${dec(C,2)} m, så Markusplatsen höll sig torr – men lagunen fick inte byta vatten med havet den dagen.`,`A high water of ${dec(w,2)} m, below the 1.10 m at which MOSE used to rise. Now the gates close at ${dec(C,2)} m, so St Mark's Square stayed dry – but the lagoon could not exchange its water with the sea that day.`,`Un'acqua alta di ${dec(w,2)} m, sotto quel metro e dieci a cui un tempo si alzava il MOSE. Ora le paratoie chiudono già a ${dec(C,2)} m, così piazza San Marco è rimasta all'asciutto – ma quel giorno la laguna non ha potuto scambiare acqua con il mare.`)
            :t(`Ett högvatten på ${dec(w,2)} m. MOSE stänger nu redan vid ${dec(C,2)} m, men lagunen bakom luckorna stod på ${dec(x,2)} m, och Markusplatsen fick ändå vatten.`,`A high water of ${dec(w,2)} m. MOSE now closes at ${dec(C,2)} m, but the lagoon behind the gates stood at ${dec(x,2)} m, and St Mark's Square still took water.`,`Un'acqua alta di ${dec(w,2)} m. Ora il MOSE chiude già a ${dec(C,2)} m, ma dietro le paratoie la laguna era a ${dec(x,2)} m, e piazza San Marco è andata comunque sott'acqua.`))
          :x<=P?'Ett högvatten på omkring en meter – under gränsen där MOSE reser sig, så luckorna fick stå öppna och lagunen andas. Förr hade Markusplatsen stått under vatten; nu höll de höjda kajerna och kanten runt piazzan staden torr.'
          :say(t(`Ett högvatten på ${dec(w,2)} m – under gränsen där MOSE reser sig, så luckorna stod öppna. Markusplatsen och de lägsta gränderna stod under vatten, gångbryggorna lades ut och butikerna i bottenvåningarna fick vatten igen.`,`A high water of ${dec(w,2)} m – below the line at which MOSE rises, so the gates stayed open. St Mark's Square and the lowest alleys were under water, the raised walkways went out and the ground-floor shops flooded again.`,`Un'acqua alta di ${dec(w,2)} m – sotto la soglia a cui si alza il MOSE, così le paratoie sono rimaste giù. Piazza San Marco e le calli più basse sono finite sott'acqua, sono uscite le passerelle e i negozi al pianterreno si sono allagati di nuovo.`),
            n>=20?t(`Det året nådde vattnet Markusplatsen ${int(n)} gånger.`,`That year the water reached St Mark's Square ${int(n)} times.`,`Quell'anno l'acqua è arrivata in piazza San Marco ${int(n)} volte.`):''),
        apply:st=>{st.damage+=.06*sev;st.eventMood-=.02*sev;st.heritage=clamp(st.heritage-.03*sev);}};}},
  // A hot, still summer in a shallow lagoon (average depth 1.2 m): Ulva blooms and anoxia hit in the 1980s; in 2024
  // the clams died with the blue crab. Closed gates stop the exchange with the sea – closed, still water changes
  // plankton and bottom life within two days (Cibic et al. 2025), and with RCP8.5 a third of the lagoon would need
  // over 20 days to change its water and the summer water would pass 30 °C for three months (Canu et al. 2026).
  // Salt marshes, seagrass and open inlets (Levande lagun) help; a lagoon shut for good is a lake.
  {id:'lagunen_2067',year:2067,icon:'🐟',title:'Lagunen i hettan',weather:sev=>({haze:.5,drought:.15,empty:.2+.3*Math.min(1,sev)}),
    resolve:(c,r)=>{const {s,I,stress}=c,shut=shutShare(c),perm=forGood(c),hazard=.35+.6*stress+.2*r,sev=clamp(hazard*(.5*clamp((shut-.03)/.4)+.7*(1-s.waters/.8)));return {severity:sev,
      text:perm?'En het, stilla sommar i en lagun som stängts för gott: utan tidvatten hade den blivit en varm sjö. Syret tog slut i de grunda delarna, algerna ruttnade och döda fiskar flöt i kanalerna; fiskevallarna och musselodlarna gav upp.'
        :band(sev,I.hav>.4?(shut<.1?'En het, stilla sommar, men lagunen andades: saltängar, sjögräs och inlopp som fick stå öppna höll syret uppe, och fisken i fiskevallarna klarade sig.':'En het, stilla sommar, men saltängarna och sjögräset höll syret uppe, fast luckorna stod stängda allt oftare, och fisken i fiskevallarna klarade sig.'):'En het, stilla sommar. Algerna växte till i de grundaste delarna av lagunen, men vinden vände i tid.',
          shut>.08?'En het, stilla sommar och luckor som stängts allt oftare: i de grunda delarna av lagunen tog syret slut, algerna ruttnade och döda fiskar flöt upp vid fiskevallarna. Musselodlarna förlorade halva skörden.':'En het, stilla sommar i en lagun utan ett enda vattenområde i god status: i de grunda delarna tog syret slut, algerna ruttnade och döda fiskar flöt upp vid fiskevallarna. Musselodlarna förlorade halva skörden.',
          shut>.25?'Lagunen kvävdes. Efter veckor av hetta i en lagun som nästan aldrig fick byta vatten med havet tog syret slut: döda fiskar och musslor flöt i kanalerna, stanken låg över staden och turisterna vände.':'Lagunen kvävdes. Efter veckor av hetta i en sjuk och grund lagun tog syret slut: döda fiskar och musslor flöt i kanalerna, stanken låg över staden och turisterna vände.'),
      apply:st=>{st.waters=Math.max(0,st.waters-.04*sev);st.damage+=.05*sev;st.eventMood-=.02*sev;st.visitShock=Math.max(st.visitShock,.1*sev);}};}},
  // People fleeing a hotter Africa and South Asia across the Mediterranean. 37.4 % of the historic city's homes
  // have no registered resident (2023), most as tourist flats and second homes, and the schools have lost 29 % of
  // their pupils in nine years: homes held for residents (Hem för venetianer) and flats returned from the tourists
  // (Turistlägenheterna) decide how many become neighbours here – they are added to the city's households and
  // cohorts – and neighbours to count on how they are met.
  {id:'klimatflykt_2071',year:2071,icon:'🧭',title:'Människor på flykt över Medelhavet',weather:{},
    resolve:c=>{const {s,I,W}=c,h=120+600*I.bogemenskap+200*I.korttid,p=2*h,e=c.emptyHomes??emptyOf(s),sev=clamp((.3+.5*W.stress)*(1-.45*I.bogemenskap-.3*(s.friends-.4)-.15*s.funds/1.3));
      const lead=t('Flera tusen människor på flykt undan värmen i Afrika och Sydasien kom till Venedigs kommun.','Several thousand people fleeing the heat in Africa and South Asia came to the City of Venice.','Diverse migliaia di persone in fuga dal caldo in Africa e in Asia meridionale sono arrivate nel Comune di Venezia.');
      const what=s.T>2000?t('turistlägenheter, fritidshem och dyra','tourist flats, second homes and dear','appartamenti turistici, seconde case, e costavano troppo'):t('fritidshem och dyra','second homes and dear','seconde case, e costavano troppo');
      return {severity:sev,good:sev<.3,
        text:band(sev,I.bogemenskap>.5?say(lead,t(`I den historiska staden fick omkring ${hundreds(p)} av dem hem i de rustade offentliga bostäderna och i hem som bostadsfonden köpt, och de blev grannar: skolorna i Castello fick fler barn, och båtvarven och sjukhuset fick fler händer.`,`In the historic city about ${hundreds(p)} of them found homes in the renovated public flats and in homes the housing fund had bought, and they became neighbours: the schools in Castello got more children, and the boatyards and the hospital more hands.`,`Nella città storica circa ${hundreds(p)} di loro hanno trovato casa negli alloggi pubblici ristrutturati e nelle case comprate dal fondo per l'abitare, e sono diventati vicini: le scuole di Castello hanno avuto più bambini, i cantieri e l'ospedale più braccia.`))
            :say(lead,t(`Omkring ${hundreds(p)} av dem fick snabbt både bostad och arbete i den historiska staden – staden behövde fler i arbetsför ålder.`,`About ${hundreds(p)} of them quickly found both a home and work in the historic city – it needed more people of working age.`,`Circa ${hundreds(p)} di loro hanno trovato presto casa e lavoro nella città storica, che aveva bisogno di più persone in età da lavoro.`)),
          say(lead,t(`I den historiska staden stod ${pct(e)} av bostäderna utan boende, men de var ${what}: bara omkring ${hundreds(p)} av de nya fick hem här, och de andra fick bo trångt på fastlandet.`,`In the historic city ${pct(e)} of the homes had no one living in them, but they were ${what}: only about ${hundreds(p)} of the newcomers found homes here, and the rest had to live crowded on the mainland.`,`Nella città storica ${il(pct(e))} delle case era senza residenti, ma erano ${what}: solo circa ${hundreds(p)} dei nuovi arrivati hanno trovato casa qui, e gli altri hanno dovuto vivere ammassati in terraferma.`)),
          say(lead,t(`Trångboddhet och misstro: ${pct(e)} av bostäderna i den historiska staden stod utan boende, men bara omkring ${hundreds(p)} av de nya fick hem där. De andra bodde i läger på fastlandet, och staden delades i ”vi” och ”de”.`,`Overcrowding and mistrust: ${pct(e)} of the homes in the historic city had no one living in them, but only about ${hundreds(p)} of the newcomers found homes there. The rest lived in camps on the mainland, and the city split into “us” and “them”.`,`Sovraffollamento e diffidenza: ${il(pct(e))} delle case della città storica era senza residenti, ma solo circa ${hundreds(p)} dei nuovi arrivati vi hanno trovato casa. Gli altri vivevano in campi in terraferma, e la città si è divisa tra «noi» e «loro».`))),
        apply:st=>{st.H+=h;st.y+=.55*p;st.c+=.3*p;st.m+=.15*p;st.friends+=sev<.3?.02:-.05*sev;}};}},
  // The salt marshes (barene): about 40 km² today against 158 km² in 1912, 0.5 km² lost a year (s.marsh). About
  // 24 000 flamingos wintered in the lagoon in 2025 – breeding was tried in 2008 and 2013 and failed; 195 672 water
  // birds overwintered on average 2003–07, four in five in the valli.
  {id:'flamingor_2074',year:2074,icon:'🦩',title:'Flamingorna',weather:{},
    resolve:({s})=>{const m=s.marsh,km=int(m),sev=clamp((45-m)/40);return {severity:sev,good:m>=50,
      text:m>=50?t(`Flamingorna häckade på de nya saltängarna mitt i lagunen – första gången det lyckades, efter försöken 2008 och 2013. Barene, nu ${km} km², byggs i takt med att havet stiger, och vadarna, fiskynglet och krabborna har fått tillbaka sina skrymslen.`,`The flamingos nested on the new salt marshes in the middle of the lagoon – the first time it worked, after the attempts of 2008 and 2013. The barene, ${km} km² now, are built as fast as the sea rises, and the waders, the young fish and the crabs have their nooks back.`,`I fenicotteri hanno nidificato sulle nuove barene in mezzo alla laguna – la prima volta che ci sono riusciti, dopo i tentativi del 2008 e del 2013. Le barene, ora ${km} km², si costruiscono al passo con il mare che sale, e i limicoli, il novellame e i granchi hanno ritrovato i loro rifugi.`)
        :m>=40?t(`Saltängarna har vuxit till ${km} km², och flamingorna och vadarna har kvar sina slikbankar – men häckningsförsöken misslyckas fortfarande.`,`The salt marshes have grown to ${km} km², and the flamingos and waders keep their mudflats – but their attempts to breed still fail.`,`Le barene sono cresciute fino a ${km} km², e i fenicotteri e i limicoli conservano le loro velme – ma i tentativi di nidificare falliscono ancora.`)
        :m>=15?t(`Saltängarna krymper – ${km} km² mot omkring 40 år 2026 – men flamingorna och vadarna har ännu kvar sina slikbankar.`,`The salt marshes are shrinking – ${km} km² against about 40 in 2026 – but the flamingos and waders still have their mudflats.`,`Le barene si riducono – ${km} km² contro i circa 40 del 2026 – ma i fenicotteri e i limicoli hanno ancora le loro velme.`)
        :m>=3?t(`Bara ${km} km² saltängar finns kvar i lagunen, mot 158 år 1912. Vågorna rullar fritt mot stränderna, slammet rinner ut i havet, och flamingorna och vadarna håller sig i fiskevallarna.`,`Only ${km} km² of salt marsh are left in the lagoon, against 158 in 1912. The waves roll freely against the shores, the silt drains out to sea, and the flamingos and waders keep to the valli.`,`In laguna restano solo ${km} km² di barene, contro i 158 del 1912. Le onde corrono libere contro le sponde, i sedimenti finiscono in mare, e i fenicotteri e i limicoli stanno nelle valli da pesca.`)
        :'De sista saltängarna i mellersta lagunen sjönk under ytan. Utan dem rullar vågorna fritt mot stränderna, slammet rinner ut i havet, och flamingorna och vadarna har lämnat lagunen för fiskevallarna.',
      apply:st=>{if(m>=50){st.waters=Math.min(1,st.waters+.01);st.eventMood+=.02;}else{st.waters=Math.max(0,st.waters-.01*sev);st.eventMood-=.01*sev;}}};}},
  // Data och AI för lagunen (ai): tide forecasts that let MOSE close only when it must (raising the gates hours
  // before the peak damps it best, Alberti et al. 2023), visitor flows, boats and care. Who owns and governs the
  // systems (s.aiGovernance: the EU's AI Act, the people's say, city-owned systems) decides who gains.
  {id:'ai_genombrott_2080',year:2080,icon:'✦',title:'AI-genombrottet',weather:{},
    resolve:({s,I})=>{const gov=s.aiGovernance,cap=s.aiCapacity,sev=Math.max(0,cap*(1-gov)-.1);return {severity:sev,good:gov>.5,
      text:gov>.6?(I.ai>.4?'Nya AI-system kunde ta över mycket arbete. Lagunens öppna modeller förutsåg varje tidvatten på centimetern ett dygn i förväg, så att MOSE bara reste sig när det behövdes – och medborgarråden beslutade att vinsterna skulle bli tid och fler händer i omsorgen.'
          :'Nya AI-system kunde ta över mycket arbete. Medborgarråden beslutade att vinsterna skulle bli tid och fler händer i omsorgen, och systemen som styr stadens tjänster granskas öppet.')
        :gov>.4?'Automatiseringen tog många jobb i hotellen, butikerna och hamnen. Kommunen hann ställa om, men inte för alla.'
        :'Några få bolag långt härifrån ägde systemen, också de som styr besöksflödena och tidvattenprognoserna. Arbeten försvann och klyftorna växte.',
      apply:st=>{st.funds+=gov>.5?.03:0;st.friends-=.03*sev;}};}},
  // Sirocco and rain for days, and the Adriatic's seiche (about 22 hours) bringing new high water each night: in
  // the 2025/26 season MOSE closed 30 times in three weeks. Behind closed gates the lagoon fills with rain and
  // rivers (s.barrierInside), ships for Porto Marghera wait outside, and the lagoon's water stands still. The sea
  // about a quarter of a metre under the 100-year level of its year; the lagoon's shut share is the model's.
  {id:'stangning_2088',year:2088,icon:'🌊',title:'Tio dygn bakom luckorna',weather:{storm:.7,empty:.6},
    resolve:(c,r)=>{const w=c.level100-.25+.25*r,x=inCity(c,w),P=c.s.protection,wet=harm(c,x),perm=forGood(c),closed=clamp((shutShare(c)-.03)/.3),sev=Math.max(wet,.45*closed);
      return {severity:sev,level:w,extra:say(narthex(c,x),c.seaRise+c.s.uplift>.6?'Havet står nu mer än de 60 centimeter högre som MOSE byggdes för.':''),
        text:perm?(x>P?t(`Sirocco och regn i tio dagar, och nya högvatten varje natt utanför lidona. Inloppen är stängda för gott, men pumparna hann inte med regnet och floderna: lagunen steg till ${dec(x,2)} m, och Markusplatsen och de lägsta gränderna stod under vatten.`,`Sirocco and rain for ten days, and a new high water every night outside the Lido. The inlets are shut for good, but the pumps could not keep up with the rain and the rivers: the lagoon rose to ${dec(x,2)} m, and St Mark's Square and the lowest alleys were under water.`,`Scirocco e pioggia per dieci giorni, e una nuova acqua alta ogni notte fuori dai lidi. Le bocche di porto sono chiuse per sempre, ma le pompe non riuscivano a star dietro alla pioggia e ai fiumi: la laguna è salita a ${dec(x,2)} m, e piazza San Marco e le calli più basse sono finite sott'acqua.`)
            :t(`Sirocco och regn i tio dagar, och nya högvatten varje natt utanför lidona. Inloppen är stängda för gott, och pumparna höll lagunen på ${dec(x,2)} m: staden höll sig torr, men lagunens vatten stod lika stilla som det gjort i åratal.`,`Sirocco and rain for ten days, and a new high water every night outside the Lido. The inlets are shut for good, and the pumps held the lagoon at ${dec(x,2)} m: the city stayed dry, but the lagoon's water lay as still as it had for years.`,`Scirocco e pioggia per dieci giorni, e una nuova acqua alta ogni notte fuori dai lidi. Le bocche di porto sono chiuse per sempre, e le pompe hanno tenuto la laguna a ${dec(x,2)} m: la città è rimasta all'asciutto, ma l'acqua della laguna era ferma come da anni.`))
          :x>P?(closed>.5?'Sirocco och regn i tio dagar, och nya högvatten varje natt. MOSE stod uppe i tio dygn i sträck: bakom luckorna steg lagunen med regnet och floderna tills Markusplatsen och de lägsta gränderna stod under vatten, och fartygen till Porto Marghera fick vänta ute till havs.'
            :'Sirocco och regn i tio dagar, och nya högvatten varje natt. MOSE stod uppe i tio dygn i sträck, och bakom luckorna steg lagunen med regnet och floderna tills Markusplatsen och de lägsta gränderna stod under vatten.')
          :closed>.5?'Sirocco och regn i tio dagar, och nya högvatten varje natt. MOSE stod uppe i tio dygn i sträck och staden höll sig torr – men fartygen till Porto Marghera fick vänta ute till havs, och lagunens vatten stod stilla så länge att fisket fick stänga.'
          :'Sirocco och regn i tio dagar, och nya högvatten varje natt. MOSE stod uppe i tio dygn i sträck; bakom luckorna steg lagunen med regnet och floderna, men de höjda kajerna höll staden torr.',
        apply:st=>{st.damage+=.08*sev;st.eventMood-=.03*sev;st.waters=Math.max(0,st.waters-.02*closed);st.heritage=clamp(st.heritage-.04*wet);}};}},
  // A record summer: 52 days above 30 °C in 2024 (21.7 a year in 2001–2025), 95 tropical nights in 2022. The days
  // of an ordinary year are the model's own; how many die in such heat follows the model's heat deaths per old
  // person: shade, fountains and open gardens (svalka), houses cooled with lagoon water (effektivitet) and care that
  // looks in on those who live alone (forebyggande), as people and houses slowly adapt.
  {id:'varmerekord_2094',year:2094,icon:'🔥',title:'Värmerekordet',weather:sev=>({haze:.85+.15*Math.min(1,sev*2),drought:.7,empty:.45+.3*Math.min(1,sev*1.5)}),
    resolve:(c,r)=>{const {I,year}=c,hd=hotDays(c),risk=Math.pow(hd/22,.8)*(1-.3*I.svalka)*(1-.15*I.effektivitet)*(1-.25*I.forebyggande)*(1-.25*clamp((year-2026)/80)),sev=clamp((risk*(.85+.3*r)-.75)/1.1);
      const lead=t(`Det hetaste året sedan mätningarna vid Istituto Cavanis började. Ett vanligt år har nu omkring ${int(hd)} dagar över 30 grader, mot 22 år 2026 – och det här året blev de fler än någonsin.`,`The hottest year since records began at the Istituto Cavanis. An ordinary year now has about ${int(hd)} days above 30 °C, against 22 in 2026 – and this one had more than ever.`,`L'anno più caldo da quando esistono le misure all'Istituto Cavanis. Un anno normale ha ormai circa ${int(hd)} giorni sopra i 30 gradi, contro i 22 del 2026 – e quest'anno sono stati più che mai.`);
      const shade=I.svalka>.4,cool=I.effektivitet>.5,care=I.forebyggande>.4;
      const saved=[shade&&t('de skuggiga campi med sina fontäner','the shaded campi with their fountains','ai campi ombreggiati con le loro fontane'),cool&&t('husen som kyls med lagunens vatten','houses cooled with the lagoon\'s water',"alle case rinfrescate con l'acqua della laguna"),care&&t('hemtjänsten som ringde på hos de ensamma varje dag','the home carers who rang at the doors of those living alone every day',"all'assistenza domiciliare che ogni giorno suonava alla porta di chi viveva da solo")].filter(Boolean);
      return {severity:sev,
        text:say(lead,band(sev,saved.length?t(`Men tack vare ${list(saved)} klarade sig de äldre.`,`But thanks to ${list(saved)}, the elderly came through.`,`Ma grazie ${list(saved)}, gli anziani ce l'hanno fatta.`):'Värmen var svår men gick över, och grannarna höll koll på de äldre.',
          saved.length?t(`Sjukhuset vid Santi Giovanni e Paolo fylldes av äldre med värmeslag; ${list(saved)} räddade många, men inte alla.`,`The hospital at Santi Giovanni e Paolo filled with old people with heatstroke; ${list(saved)} saved many, but not all.`,`L'ospedale di Santi Giovanni e Paolo si è riempito di anziani colpiti da colpo di calore; molti si sono salvati grazie ${list(saved)}, ma non tutti.`):'Sjukhuset vid Santi Giovanni e Paolo fylldes av äldre med värmeslag, och vården gick på knäna.',
          saved.length?'Värmen tog många liv, mest bland de gamla som bodde ensamma under taken.':'Värmen tog många liv, mest bland de gamla som bodde ensamma under taken: campi av sten utan skugga, hus utan svalka och ingen som ringde på.')),
      apply:st=>{st.lifeShock+=.5*sev;st.eventMood-=.03*sev;st.visitShock=Math.max(st.visitShock,.06*sev);}};}},
  // 83.5 % of homes' energy was gas (2005; s.gasHeat falls with the EU's boiler rules and with heat pumps on lagoon
  // water, Värme ur lagunen – the Doge's Palace already heats and cools with it); MOSE's energy cost 4.5 million euro
  // in 2025, and a lagoon shut for good needs pumps. The city's own sun (Sol där det är tillåtet) can only soften it.
  {id:'energichock_2100',year:2100,icon:'⚡',title:'Energichocken i Europa',weather:(sev,r)=>r.good?{}:{dark:.35+.6*sev},
    resolve:(c,r)=>{const {s,I}=c,gas=s.gasHeat,perm=forGood(c),sev=clamp((.55+.25*r)*(.25+.75*clamp(gas/BASE.gasHeat))*(1-.15*I.sol)),good=sev<.25;return {severity:sev,good,
      text:good?(I.effektivitet>.5?t(`När gasen och elen i Europa blev dyr och knapp höll lagunvärmen husen varma${I.sol>.4?`, och energigemenskapernas sol delade el med grannarna${perm?' – också till pumparna som håller lagunen nere':''}`:''}.`,`When gas and electricity grew dear and scarce in Europe, lagoon heat kept the houses warm${I.sol>.4?`, and the energy communities shared their sun with the neighbours${perm?' – and with the pumps that hold the lagoon down':''}`:''}.`,`Quando gas ed elettricità in Europa sono diventati cari e scarsi, il calore della laguna ha tenuto calde le case${I.sol>.4?`, e il sole delle comunità energetiche è stato condiviso con i vicini${perm?' – anche con le pompe che tengono bassa la laguna':''}`:''}.`)
          :'När gasen och elen i Europa blev dyr och knapp hade de flesta gaspannor redan bytts ut, och staden klarade vintern utan ransonering.')
        :band(sev,'Elpriserna steg, men lagunvärmen och de tätade husen dämpade smällen.',
          t(`Gas och el blev dyra i två vintrar. ${pct(gas)} av hemmens energi kom fortfarande från gas; venetianerna frös i de gamla husen, och kommunen fick betala allt mer för att hålla MOSE:s ${perm?'pumpar':'luckor'} igång.`,`Gas and electricity were dear for two winters. ${pct(gas)} of the homes' energy still came from gas; Venetians were cold in the old houses, and the city had to pay ever more to keep MOSE's ${perm?'pumps':'gates'} running.`,`Gas ed elettricità sono rimasti cari per due inverni. ${il(pct(gas)).replace(/^./,ch=>ch.toUpperCase())} dell'energia delle case veniva ancora dal gas; i veneziani hanno patito il freddo nelle vecchie case, e il Comune ha dovuto pagare sempre di più per tenere in funzione ${perm?'le pompe':'le paratoie'} del MOSE.`),
          gas>.5?'Gasransonering. De flesta hem i den historiska staden värms fortfarande med gas, och i de fuktiga stenhusen frös de äldre vintern igenom; skolor och museer stängdes.':'Gasransonering. Många hem i den historiska staden värms fortfarande med gas, och i de fuktiga stenhusen frös de äldre vintern igenom; skolor och museer stängdes.'),
      apply:st=>{st.funds+=good?.03:0;st.damage+=.06*sev;}};}},
  // A storm on top of the risen sea: about 0.15–0.45 m over the 100-year level of its year – past the 3 m tides
  // MOSE was built for in the warmer worlds (the 100-year level reaches about 2.6 m by 2100 with RCP4.5 and 3.3 m
  // with RCP8.5). The gates hold in the model; what floods is the lagoon behind them, against the raised walkways
  // and a city perhaps lifted by seawater pumped under the lagoon (s.uplift).
  {id:'stormflod_2114',year:2114,icon:'🌊',title:'Den stora stormfloden',weather:{storm:1,empty:.7},
    resolve:(c,r)=>{const w=c.level100+.15+.3*r,x=inCity(c,w),P=c.s.protection,wet=harm(c,x),beyond=clamp((w-3)/.4),sev=Math.min(1,wet+.4*beyond),perm=forGood(c),f=c.flooded(x);
      const lead=w>3?t(`Den värsta stormen sedan mätningarna började: utanför lidona steg havet till ${dec(w,2)} m, mer än de tre meter MOSE byggdes för.`,`The worst storm since measurements began: outside the Lido the sea rose to ${dec(w,2)} m, more than the three metres MOSE was built for.`,`La peggiore tempesta da quando esistono le misure: fuori dai lidi il mare è salito a ${dec(w,2)} m, più dei tre metri per cui il MOSE era stato progettato.`)
        :t(`En av de värsta stormarna sedan mätningarna började drev havet till ${dec(w,2)} m utanför lidona.`,`One of the worst storms since measurements began drove the sea to ${dec(w,2)} m outside the Lido.`,`Una delle peggiori tempeste da quando esistono le misure ha spinto il mare a ${dec(w,2)} m fuori dai lidi.`);
      return {severity:sev,level:w,extra:say(narthex(c,x),x<=P&&c.s.uplift>.1?t(`Att staden hade lyfts ${int(c.s.uplift*100)} cm med havsvatten som pumpats ned under lagunen gjorde sitt till.`,`That the city had been lifted ${int(c.s.uplift*100)} cm by seawater pumped down under the lagoon helped.`,`Ha aiutato anche il fatto che la città fosse stata sollevata di ${int(c.s.uplift*100)} cm pompando acqua di mare sotto la laguna.`):''),
        text:say(lead,x<=P?(w>3?'Luckorna höll och de höjda kajerna likaså, och staden stod torr medan stormen slet i Pellestrinas gamla stenvallar.':'MOSE höll, och bakom luckorna stod staden torr.')
          :x-P<.05?t(`Luckorna höll, men lagunen bakom dem steg med regnet och floderna till ${dec(x,2)} m, just över kanten på Markusplatsen, och vattnet rann in på piazzan.`,`The gates held, but the lagoon behind them rose with the rain and the rivers to ${dec(x,2)} m, just over the edge of St Mark's Square, and the water ran into the piazza.`,`Le paratoie hanno tenuto, ma la laguna dietro di loro è salita con la pioggia e i fiumi a ${dec(x,2)} m, appena oltre il bordo di piazza San Marco, e l'acqua è entrata in piazza.`)
          :f<.15?t(`Luckorna höll, men lagunen bakom dem hade redan stigit med regnet och floderna till ${dec(x,2)} m – Markusplatsen och de lägsta gränderna stod under vatten i flera dagar.`,`The gates held, but the lagoon behind them had already risen with the rain and the rivers to ${dec(x,2)} m – St Mark's Square and the lowest alleys were under water for days.`,`Le paratoie hanno tenuto, ma la laguna dietro di loro era già salita con la pioggia e i fiumi a ${dec(x,2)} m – piazza San Marco e le calli più basse sono rimaste sott'acqua per giorni.`)
          :t(`Luckorna höll, men lagunen bakom dem steg till ${dec(x,2)} m och in över ${pct(f)} av gångvägarna, och frågan om att ${perm?'lämna de lägsta kvarteren':'stänga lagunen för gott – eller lämna de lägsta kvarteren –'} väcktes på allvar.`,`The gates held, but the lagoon behind them rose to ${dec(x,2)} m and over ${pct(f)} of the walkways, and the question of ${perm?'leaving the lowest quarters':'closing the lagoon for good – or leaving the lowest quarters –'} was raised in earnest.`,`Le paratoie hanno tenuto, ma la laguna dietro di loro è salita a ${dec(x,2)} m e ha invaso ${il(pct(f))} dei percorsi pedonali, e la questione di ${perm?'abbandonare i quartieri più bassi':'chiudere la laguna per sempre – o di abbandonare i quartieri più bassi –'} è stata posta sul serio.`)),
        apply:st=>{st.damage+=.14*sev;st.eventMood-=.05*sev;st.heritage=clamp(st.heritage-.15*wet);}};}},
];
