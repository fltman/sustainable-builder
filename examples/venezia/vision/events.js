import { FLOOD, BASE } from './model.js';
// Events that test Venice. Each resolves against the state it meets: the same storm is a news item in a
// Venice that has raised its quays and a disaster in one that has not. Years are jittered ±2 per run, so
// none comes before 2029 (2026 stays as measured). severity 0–1; apply() changes the state the way the
// examples' events do (examples/rattvik/vision/events.js): welfare damage, the mood that feeds trust,
// health shocks, visitors kept away – and here also the heritage, the lagoon's water and the people who
// come or leave.
// The facts are in research/deep: hav-tidvatten (the tides, MOSE, the heat, the water), lagun-natur-mat
// (the salt marshes, the lagoon's water, the clams, the birds), turism-ekonomi (the visitors, 2020, the
// record day of 2022, UNESCO), samhalle-halsa (an old city that lives alone, the empty homes) and
// energi-resor (gas heating, the boats).
// Titles and texts are static Swedish; en/events.js and it/events.js have their English and Italian (the
// engine translates them with L()).
// Each event gives its weather (weather.js weatherOf: {storm, haze, drought, empty, dark}, or a function of
// the severity and the outcome; {} is a calm day): a storm with rain and white horses for the high waters
// – the sea drawn at their level, and behind MOSE the lagoon at the level the barrier holds – haze and
// straw-coloured lawns for heat and drought, empty streets in the pandemic, a city dimmed at night by an
// energy crisis that went badly.
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const band=(v,good,mid,bad)=>v<.3?good:v<.6?mid:bad;
const BR=FLOOD.barrier;

// An event's `level` is the sea's, in metres on the tide gauge's zero (ZMPS, Punta della Salute 1897):
// what the city sees is what MOSE lets in. The gates rise when a tide above their closing level is
// forecast (s.barrierCloses: 1.10 m today, later where the city has raised itself; model.js LOCAL) and
// hold the lagoon at about s.barrierInside (0.90 m, creeping up once the sea passes the 60 cm the gates
// were built for). The engine's flood badge and flood map draw the same from the same numbers.
const inCity=(c,w)=>w>(c.s.barrierCloses??BR.closes)?Math.min(w,c.s.barrierInside??BR.inside):w;
// The harm: none up to the protection (s.protection: the lowest walkways at 0.80 m, raised by up to
// 0.40 m by Leva med vattnet); above it a fifth for the first wet stones – St Mark's Square under water –
// and the rest with the share of the public walkways under water (the Comune's table, model.js flooded():
// 2 % at 0.90 m, 12 % at 1.10 m, 59 % at 1.40 m): all of it once a third is wet (about 1.2 m).
const harm=(c,x)=>x<=c.s.protection?0:Math.min(1,.2+c.flooded(x)/.4);
// The basilica's narthex (63 cm, flooded over 200 times a year before 2019) is behind the glass barrier
// of 2022, built for 110 cm.
const narthex=(c,x)=>x>Math.max(1.1,c.s.protection)?'Vattnet tog sig också förbi glasbarriären in i Markuskyrkans förhall, där mosaikgolvet från 1100-talet än en gång fick salt.':'';
// How shut the lagoon is: with 50 cm more sea MOSE closes about once a day (Umgiesser 2020), with 75 cm
// the lagoon is more closed than open – later where the city has raised itself and the gates rise
// higher (s.barrierCloses over 1.10 m).
const shut=c=>clamp((c.seaRise-((c.s.barrierCloses??BR.closes)-BR.closes))/.5);

export const EVENTS=[
  // A storm like 12 November 2019 (187 cm; 1966: 194 cm): the sea a little under today's 100-year level
  // (about 2.10 m). MOSE (in service since October 2020) holds the lagoon at about 0.90 m, so the lowest
  // ground – St Mark's Square floods from 0.80 m – still gets water unless the quays have been raised.
  {id:'stormflod_2031',year:2031,icon:'🌊',title:'Stormfloden',weather:{storm:1,empty:.7},
    resolve:(c,r)=>{const w=c.level100-.3+.2*r,x=inCity(c,w),sev=harm(c,x);return {severity:sev,level:w,extra:narthex(c,x),
      text:x<=c.s.protection?'Sirocco, fullmåne och ett djupt lågtryck över Adriatiska havet: utanför lidona steg havet lika högt som den 12 november 2019, när nästan hela staden stod under vatten. Nu reste sig MOSE:s 78 luckor, och de höjda kajerna höll staden torr.'
        :c.flooded(x)<.04?'Sirocco, fullmåne och ett djupt lågtryck över Adriatiska havet: utanför lidona steg havet lika högt som den 12 november 2019, när nästan hela staden stod under vatten. Nu reste sig MOSE:s 78 luckor – men lagunen bakom dem stod så högt att Markusplatsen och de lägsta gränderna ändå fick vatten.'
        :'Sirocco och ett djupt lågtryck drev upp havet mot lidona. MOSE stängde, men lagunen bakom luckorna steg ändå in över en stor del av staden, och butiker och bottenvåningar fick vatten igen.',
      apply:st=>{st.damage+=.1*sev;st.eventMood-=.02*sev;st.heritage-=.04*sev;}};}},
  // A winter without snow in the Alps (as in 2022–23): the rivers low and salt water far up them; and a
  // high pressure that draws the water out of the lagoon – at −55 cm the inner canals are hard to use,
  // the record is −124 cm (1882), −83 cm in 2008. A higher sea makes such low waters rarer (fewer under
  // −60 cm every decade). Venice's water comes from 34 deep wells on the mainland, with river water from
  // the Sile when demand is high; 41.7 % is lost in the pipes.
  {id:'torka_2036',year:2036,icon:'☀',title:'Torkan och lågvattnet',weather:sev=>({haze:.45,drought:.2+.3*Math.min(1,sev*1.5)}),
    resolve:({s,stress,seaRise,preparedness},r)=>{const hazard=.45+.3*stress+.2*r,low=.35*(1-clamp(seaRise/.5)),sev=Math.max(0,hazard*(1.2*(1-s.water)+low*(1-.6*preparedness)));return {severity:sev,
      text:band(sev,'En vinter utan snö i Alperna: Po, Brenta och Sile sjönk till rekordlåga nivåer och saltvattnet trängde långt upp i floderna. Ett högtryck drog ut vattnet ur lagunen och torrlade de inre kanalerna några dagar, men brunnarna på fastlandet räckte, och båtarna väntade ut lågvattnet.',
        'En vinter utan snö i Alperna och ett högtryck som drog ut vattnet ur lagunen: gondoler och transportbåtar stod på botten i de inre kanalerna, ambulansbåtarna fick ta omvägar, och på fastlandet ransonerades vattnet när saltvattnet trängde upp i floderna.',
        'Torkan blev en kris. Saltvattnet trängde in i floderna och brunnsfälten, vattnet ransonerades i hela kommunen, och när lågvattnet torrlade kanalerna kom varken sopbåtar, varor eller ambulanser fram.'),
      apply:st=>{st.damage+=.05*sev;st.eventMood-=.02*sev;st.visitShock=Math.max(st.visitShock,.03*sev);}};}},
  // 2020: the historic city's guest nights fell by 71 % (2.53 million against 8.82 million in 2019), the
  // boats stopped and the canals cleared; nearly a fifth of the jobs are in hotels and restaurants. A third
  // of the residents are 65 or older, and almost as many live alone (14 800 one-person households, 55.9 %
  // of all).
  {id:'pandemi_2040',year:2040,icon:'🦠',title:'Pandemin',weather:sev=>({empty:.55+.4*sev}),
    resolve:({s},r)=>{const sev=Math.max(0,(.5+.3*r)*(1-.35*s.aiCapacity*s.aiGovernance-.3*(1-s.lowParticipation)-.2*s.selfHealth));return {severity:sev,
      text:band(sev,s.lowParticipation<.25?'Tidig upptäckt och grannar som handlade åt de äldre bromsade smittan snabbt. Turisterna försvann i några månader, och venetianerna fick tillbaka sin stad: klart vatten i kanalerna och tysta campi.':'Smittan bromsades efter några tuffa månader. Turisterna försvann, båtarna stod still och vattnet i kanalerna blev klart som 2020.',
        'Ett år av restriktioner. Hotellen och de korttidsuthyrda lägenheterna stod tomma, som 2020 när gästnätterna föll med sju tiondelar, och i en stad där nästan vart femte jobb finns i hotell och restauranger stannade ekonomin.',
        'Smittan gick hårt åt en stad där var tredje är över 65 och nästan lika många bor ensamma. Sjukhuset vid Santi Giovanni e Paolo gick på knäna, och många som förlorat jobbet i turismen flyttade till fastlandet.'),
      apply:st=>{st.lifeShock+=.5*sev;st.damage+=.08*sev;st.lowParticipation+=.03*sev;st.visitShock=Math.max(st.visitShock,.71*(.4+.6*sev));if(sev>.6)st.pop*=1-.01*sev;}};}},
  // Days above 30 °C: 21.7 a year at Istituto Cavanis 2001–2025 (52 in 2024); tropical nights 66.9 (95 in
  // 2022), +40 by 2071–2100 with RCP4.5 and +72 with RCP8.5. An old city that lives alone: shade and water
  // on the campi (Svalka i campi), neighbours who look in and care close to home save the most.
  {id:'varmebolja_2045',year:2045,icon:'🌡',title:'Värmeböljan',weather:sev=>({haze:.8+.2*Math.min(1,sev*2),drought:.65,empty:.4+.3*Math.min(1,sev*1.5)}),
    resolve:({s,I,nature,stress},r)=>{const sev=Math.max(0,(.4+.5*stress+.2*r)*(s.share65/.33)*(1-.3*nature-.5*(1-s.lowParticipation)-.2*I.forebyggande-.2*I.bilfritt));return {severity:sev,
      text:band(sev,I.bilfritt>.3?'Tre veckor över 30 grader och nätter som aldrig svalnade. Under träden på de nya gröna campi, vid fontänerna och i kyrkorna som öppnats som svalrum satt de äldre om kvällarna, och grannarna ringde på hos dem som bodde ensamma.':'Tre veckor över 30 grader och nätter som aldrig svalnade. Grannar, hemtjänst och kyrkor som öppnats som svalrum höll koll på de äldre, och ingen dog ensam.',
        'Tre veckor över 30 grader och fler tropiska nätter än någonsin. Sjukhuset vid Santi Giovanni e Paolo fylldes av äldre med värmeslag, men vården klarade trycket.',
        'Värmen tog många liv. Var tredje venetian är över 65 och nästan lika många bor ensamma; i de heta lägenheterna under taken märkte ingen att något var fel.'),
      apply:st=>{st.lifeShock+=.6*sev;st.eventMood-=.03*sev;st.visitShock=Math.max(st.visitShock,.05*(.5+.5*sev));}};}},
  // UNESCO's World Heritage Centre proposed Venice for the list of World Heritage in Danger in 2021 and 2023
  // (mass tourism, people moving out, the lagoon); the committee warned again in 2025 and 2026. The
  // pressure it weighs: no limit on the visitors (Besökare i lagom mängd), a city emptying of residents
  // (against 2026's 47 625), and a lagoon without one water body in good status.
  {id:'unesco_2049',year:2049,icon:'🏛',title:'Världsarvskommittén',weather:{},
    resolve:({s,I})=>{const pressure=.4*(1-I.besok)+.3*clamp((BASE.pop-s.pop)/(.3*BASE.pop))+.3*clamp((.5-s.waters)/.4),sev=clamp((pressure-.3)/.6);return {severity:sev,good:pressure<.45,
      text:pressure<.45?'UNESCO:s världsarvskommitté strök Venedig från bevakningen. Bokade besök, bostäder som blivit hem igen och en lagun som börjat andas räckte som svar på kraven från 2020-talet.'
        :pressure<.65?'Världsarvskommittén varnade igen men lät bli att föra upp Venedig på listan över hotade världsarv. Kraven stod kvar: färre besökare, fler invånare och en lagun som får andas.'
        :'Venedig fördes upp på UNESCO:s lista över hotade världsarv – för massturismen, utflyttningen och en lagun som tappar sina saltängar. Det som föreslogs 2021 och 2023 hade blivit verklighet.',
      apply:st=>{if(pressure<.45){st.eventMood+=.03;st.trust+=.01;}else{st.eventMood-=.04*sev;st.trust-=.02*sev;}}};}},
  // The busiest day of 2022 had 143 246 visitors (30 October), three for every resident; a study put the
  // city's carrying capacity at 52 111 a day. In 1951, 174 808 people lived in the historic city. The
  // access fee, booking and a cap (Besökare i lagom mängd) decide how such a day goes; the fewer the
  // residents, the harder it falls on them.
  {id:'rekorddagen_2053',year:2053,icon:'👥',title:'Rekorddagen',weather:{},
    resolve:({s,I},r)=>{const crowd=clamp(BASE.pop/s.pop*.6),sev=Math.max(0,(.55+.3*r)*(1-.85*I.besok)*(.5+.5*crowd));return {severity:sev,
      text:band(sev,I.besok>.5?'En långhelg med billiga flyg: nära 170 000 ville komma samma dag. Bokningen släppte in omkring 50 000 och erbjöd resten andra dagar, och venetianerna kunde gå över Rialtobron som vanligt.':'En långhelg med billiga flyg och fullt i staden, men avgiften och bokningen spred besökarna över fler dagar. Det var trångt vid Rialto, men staden fungerade.',
        'Nära 170 000 besökare på en dag. Polisen stängde gångvägarna mot Rialto och Markusplatsen i flera timmar, men avgiften och bokningen höll undan det värsta.',
        'Nära 170 000 besökare på en dag – nästan lika många som bodde i den historiska staden 1951. Polisen stängde gångvägarna mot Rialto och Markusplatsen, vaporetton gick fulla förbi hållplatserna och de äldre kom inte fram till sjukhuset.'),
      apply:st=>{st.eventMood-=.03*sev;st.trust-=.02*sev;st.pop*=1-.004*sev;}};}},
  // A tide of about a metre – under the level at which MOSE rises (110 cm; the gates go up from forecasts
  // of 101 cm), so they stay open: St Mark's Square floods from 0.80 m (16–20 cm deep at 0.96–1.00 m) and
  // 3–5 % of the walkways are wet. Raised quays and a defence round the square (Leva med vattnet) keep them
  // dry; with a higher sea such tides come every autumn.
  {id:'acqua_alta_2064',year:2064,icon:'🌊',title:'Acqua alta under MOSE-gränsen',weather:{storm:.35,empty:.4},
    resolve:(c,r)=>{const w=.96+.04*r,x=inCity(c,w),sev=harm(c,x);return {severity:sev,level:w,extra:narthex(c,x),
      text:x<=c.s.protection?'Ett högvatten på omkring en meter – under gränsen där MOSE reser sig, så luckorna fick stå öppna och lagunen andas. Förr hade Markusplatsen stått under vatten; nu höll de höjda kajerna och kanten runt piazzan staden torr.'
        :'Ett högvatten på omkring en meter – under gränsen där MOSE reser sig, så luckorna stod öppna. Markusplatsen och de lägsta gränderna stod under vatten, gångbryggorna lades ut och butikerna i bottenvåningarna fick vatten igen. Med det stigande havet kommer sådana tidvatten nu varje höst.',
      apply:st=>{st.damage+=.06*sev;st.eventMood-=.02*sev;st.heritage-=.03*sev;}};}},
  // A hot, still summer in a shallow lagoon (average depth 1.2 m): Ulva blooms and anoxia hit in the 1980s;
  // in 2024 the clams died with the blue crab. Closed gates stop the exchange with the sea (a third of the
  // lagoon would need over 20 days to change its water and the summer water would pass 30 °C for three
  // months with RCP8.5, Canu et al. 2026). Salt marshes, seagrass and open inlets (Levande lagun) help.
  {id:'lagunen_2066',year:2066,icon:'🐟',title:'Lagunen i hettan',weather:sev=>({haze:.5,drought:.15,empty:.2+.3*Math.min(1,sev)}),
    resolve:(c,r)=>{const {s,I,stress}=c,hazard=.35+.6*stress+.2*r,closed=shut(c),sev=Math.max(0,hazard*(.5*closed+.7*(1-s.waters/.8)));return {severity:sev,
      text:band(sev,I.hav>.4?'En het, stilla sommar, men lagunen andades: saltängar, sjögräs och inlopp som fick stå öppna höll syret uppe, och fisken i fiskevallarna klarade sig.':'En het, stilla sommar. Algerna växte till i de grundaste delarna av lagunen, men vinden vände i tid.',
        'En het, stilla sommar och luckor som stängts allt oftare: i de grunda delarna av lagunen tog syret slut, algerna ruttnade och döda fiskar flöt upp vid fiskevallarna. Musselodlarna förlorade halva skörden.',
        'Lagunen kvävdes. Efter veckor av hetta i en lagun som nästan aldrig fick byta vatten med havet tog syret slut: döda fiskar och musslor flöt i kanalerna, stanken låg över staden och turisterna vände.'),
      apply:st=>{st.waters=Math.max(0,st.waters-.04*sev);st.damage+=.05*sev;st.eventMood-=.02*sev;st.visitShock=Math.max(st.visitShock,.1*sev);}};}},
  // People fleeing a hotter world across the Mediterranean. 37.4 % of the historic city's homes have no
  // registered resident (2023) and the schools have lost 29 % of their pupils in nine years: homes for
  // residents (Bostäder för venetianer) decide whether the newcomers become neighbours.
  {id:'klimatflykt_2071',year:2071,icon:'🧭',title:'Människor på flykt över Medelhavet',weather:{},
    resolve:({s,I,W})=>{const sev=Math.max(0,(.3+.5*W.stress)*(1-.45*I.bogemenskap-.3*s.trust-.15*s.welfare/1.3));return {severity:sev,good:sev<.3,
      text:band(sev,I.bogemenskap>.5?'Flera tusen klimatflyktingar kom till Venedig från Afrika och Sydasien. De tomma husen hade blivit hem igen, och de nya blev grannar: skolorna i Castello fick fler barn, och båtvarven och sjukhuset fick fler händer.':'Flera tusen klimatflyktingar kom till Venedig, och de flesta fick snabbt både bostad och arbete – staden behövde fler i arbetsför ålder.',
        'Flera tusen klimatflyktingar kom till Venedig. Bostäder fanns – var tredje stod tom – men de var dyra, och många fick bo trångt på fastlandet i stället.',
        'Trångboddhet och misstro. Lägenheterna stod tomma för turisterna medan de nya fick bo i läger på fastlandet, och staden delades i ”vi” och ”de”.'),
      apply:st=>{st.pop*=1+.05*(1-sev);st.trust+=sev<.3?.02:-.05*sev;}};}},
  // The salt marshes (barene): about 40 km² today against 158 km² in 1912, 0.5 km² lost a year; 15 km²
  // rebuilt with dredged sediment 2002–2011 (model.js LOCAL: s.marsh). About 24 000 flamingos wintered in
  // the lagoon in 2025; 195 672 water birds overwintered on average 2003–07, four in five in the valli.
  {id:'flamingor_2077',year:2077,icon:'🦩',title:'Flamingorna',weather:{},
    resolve:({s})=>{const marsh=s.marsh??BASE.marshKm2,sev=clamp((45-marsh)/40);return {severity:sev,good:marsh>=50,
      text:marsh>=50?'Flamingorna häckade på de nya saltängarna mitt i lagunen. Barene byggs nu i takt med att havet stiger, och vadarna, fiskynglet och krabborna har fått tillbaka sina skrymslen.'
        :marsh>=15?'Saltängarna håller ställningarna – de nya väger upp dem som drunknar, och flamingorna och vadarna har kvar sina slikbankar.'
        :'De sista saltängarna i mellersta lagunen sjönk under ytan. Utan dem rullar vågorna fritt mot stränderna, slammet rinner ut i havet, och flamingorna och vadarna har lämnat lagunen.',
      apply:st=>{if(marsh>=50){st.biodiversity+=.02;st.eventMood+=.02;}else{st.biodiversity-=.03*sev;st.eventMood-=.01*sev;}}};}},
  // AI for the lagoon (AI för lagunen): tide forecasts, boat traffic, care. Raising the gates hours before
  // the peak damps it best (Alberti et al. 2023); who owns the systems decides who gains.
  {id:'ai_genombrott_2083',year:2083,icon:'✦',title:'AI-genombrottet',weather:{},
    resolve:({s})=>{const gov=s.aiGovernance,cap=s.aiCapacity,sev=Math.max(0,cap*(1-gov)-.1);return {severity:sev,good:gov>.5,
      text:gov>.6?'Nya AI-system kunde ta över mycket arbete. Lagunens öppna modeller förutsåg varje tidvatten på centimetern ett dygn i förväg, så att MOSE bara reste sig när det behövdes – och medborgarråden beslutade att vinsterna skulle bli tid och fler händer i omsorgen.'
        :gov>.4?'Automatiseringen tog många jobb i hotellen, butikerna och hamnen. Kommunen hann ställa om, men inte för alla.'
        :'Några få bolag långt härifrån ägde systemen, också de som styr besöksflödena och tidvattenprognoserna. Arbeten försvann och klyftorna växte.',
      apply:st=>{st.gini+=.05*sev;st.welfare+=.05*(1-sev);st.trust-=.04*sev;}};}},
  // Sirocco and rain for days, and the Adriatic's seiche (about 22 hours) bringing new high water each
  // night: in the 2025/26 season MOSE closed 30 times in three weeks. Behind closed gates the lagoon fills
  // with rain and rivers (s.barrierInside), ships for Porto Marghera wait outside, and the lagoon's water
  // stands still. The sea about a quarter of a metre under the 100-year level of its year.
  {id:'stangning_2090',year:2090,icon:'🌊',title:'Tio dygn bakom luckorna',weather:{storm:.7,empty:.6},
    resolve:(c,r)=>{const w=c.level100-.25+.25*r,x=inCity(c,w),wet=harm(c,x),closed=shut(c),sev=Math.max(wet,.45*closed);return {severity:sev,level:w,
      extra:c.seaRise>.6?'Havet står nu mer än de 60 centimeter högre som MOSE byggdes för.':'',
      text:x>c.s.protection?(closed>.5?'Sirocco och regn i tio dagar, och nya högvatten varje natt. MOSE stod uppe i tio dygn i sträck: bakom luckorna steg lagunen med regnet och floderna tills Markusplatsen och de lägsta gränderna stod under vatten, och fartygen till Porto Marghera fick vänta ute till havs.'
          :'Sirocco och regn i tio dagar, och nya högvatten varje natt. MOSE stod uppe i tio dygn i sträck, och bakom luckorna steg lagunen med regnet och floderna tills Markusplatsen och de lägsta gränderna stod under vatten.')
        :closed>.5?'Sirocco och regn i tio dagar, och nya högvatten varje natt. MOSE stod uppe i tio dygn i sträck och staden höll sig torr – men fartygen till Porto Marghera fick vänta ute till havs, och lagunens vatten stod stilla så länge att fisket fick stänga.'
        :'Sirocco och regn i tio dagar, och nya högvatten varje natt. MOSE stod uppe i tio dygn i sträck; bakom luckorna steg lagunen med regnet och floderna, men de höjda kajerna höll staden torr.',
      apply:st=>{st.damage+=.08*sev;st.eventMood-=.03*sev;st.waters=Math.max(0,st.waters-.02*closed);st.heritage-=.04*wet;}};}},
  // 83.5 % of homes were heated with gas (2005); MOSE's gates cost about 4.5 million euro in energy (2025).
  // Lagoon-water heat pumps and careful insulation (Gamla hus, ny energi), solar tiles and wind off the
  // Lido make the city's own heat and power.
  {id:'energichock_2100',year:2100,icon:'⚡',title:'Energichocken i Europa',weather:(sev,r)=>r.good?{}:{dark:.35+.6*sev},
    resolve:({I,localEnergy},r)=>{const sev=Math.max(0,(.6+.2*r)*(1-.5*Math.min(1,localEnergy)-.4*I.effektivitet));return {severity:sev,good:sev<.25,
      text:sev<.25?(I.vind>.3?'När gasen och elen i Europa blev dyr och knapp höll lagunvärmen husen varma, och soltegel och havsvinden utanför Lido gav det mesta av elen – också till MOSE:s pumpar.':'När gasen och elen i Europa blev dyr och knapp höll lagunvärmen och de tätade husen värmen, och staden klarade vintern utan ransonering.')
        :band(sev,'Elpriserna steg, men lagunvärmen och solteglen dämpade smällen.','Gas och el blev dyra i två vintrar. Venetianerna frös i de gamla husen, och kommunen fick betala allt mer för att hålla MOSE:s luckor och pumpar igång.','Gasransonering. De flesta hem i den historiska staden värms med gas, och i de fuktiga stenhusen frös de äldre vintern igenom; skolor och museer stängdes.'),
      apply:st=>{st.welfare+=sev<.25?.03:0;st.damage+=.06*sev;}};}},
  // A storm on top of the risen sea: about 0.15–0.45 m over the 100-year level of its year – past the 3 m
  // tides MOSE was built for in the warmer worlds (the 100-year level reaches about 2.6 m by 2100 with
  // RCP4.5 and 3.3 m with RCP8.5). The gates hold in the model; what floods is the lagoon behind them.
  {id:'stormflod_2114',year:2114,icon:'🌊',title:'Den stora stormfloden',weather:{storm:1,empty:.7},
    resolve:(c,r)=>{const w=c.level100+.15+.3*r,x=inCity(c,w),wet=harm(c,x),beyond=clamp((w-3)/.4),sev=Math.min(1,wet+.4*beyond);return {severity:sev,level:w,extra:narthex(c,x),
      text:w>3?(x<=c.s.protection?'Den värsta stormen sedan mätningarna började: utanför lidona steg havet över tre meter, mer än MOSE byggdes för. Luckorna höll och de höjda kajerna likaså, och staden stod torr medan stormen slet i Pellestrinas gamla stenvallar.'
          :c.flooded(x)<.15?'Den värsta stormen sedan mätningarna började: utanför lidona steg havet över tre meter, mer än MOSE byggdes för. Luckorna höll, men lagunen bakom dem hade redan stigit med regnet och floderna – Markusplatsen och de lägsta gränderna stod under vatten i flera dagar.'
          :'Den värsta stormen sedan mätningarna började: utanför lidona steg havet över tre meter, mer än MOSE byggdes för. Luckorna höll, men lagunen bakom dem steg in över stora delar av staden, och frågan om att stänga lagunen för gott – eller lämna de lägsta kvarteren – väcktes på allvar.')
        :x<=c.s.protection?'En av de värsta stormarna sedan mätningarna började drev havet nästan tre meter upp mot lidona. MOSE höll, och bakom luckorna stod staden torr.'
        :'En av de värsta stormarna sedan mätningarna började drev havet nästan tre meter upp mot lidona. MOSE höll, men lagunen bakom luckorna stod så högt att de lägsta gränderna fick vatten.',
      apply:st=>{st.damage+=.14*sev;st.eventMood-=.05*sev;st.heritage-=.15*wet;}};}},
];
