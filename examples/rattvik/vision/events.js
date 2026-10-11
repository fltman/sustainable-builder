import { FLOOD } from './model.js';
// Events that test Rättvik. Each resolves against the state it meets: the same drought is a news item in
// a prepared Rättvik and a crisis in an unprepared one. Years are jittered ±2 per run, so none comes
// before 2029 (2026 stays as measured). severity 0–1; apply() changes the state the way Kalmar's events
// do (examples/kalmar/vision/events.js): welfare damage, the mood that feeds trust, health shocks, visitors
// kept away and, when Siljan gets into the town, the church stables on Kyrkudden.
// The facts are in research/deep: klimat-vatten (Siljan, Storm Hans, the water), turism-ekonomi (2020's
// visitors), samhalle-halsa (the elderly, the refugees of 2016), energi-resor (wind, the lime works) and
// natur-mat-stad (the forest, the stables).
// Titles and texts are static Swedish; en/events.js has their English (the engine translates with L()).
// The engine's weather (weather.js weatherOf) goes by the id – torka… is a dry, hazy summer (the forest
// fire's smoke too); varmebolja…, pandemi… and energichock… have their own – and an entry with a level is
// a high water: storm clouds, and the lake drawn at that level in 3D. An event can also give its own
// `weather` ({storm, haze, drought, empty, dark}, or a function of the severity): the cloudburst does.
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const band=(v,good,mid,bad)=>v<.3?good:v<.6?mid:bad;

// Siljan's high water (FLOOD in model.js), in m RH 2000. Up to the protection – the lowest streets at
// 164.0 m (Badhusgatan by Enån, 164.1–164.7 m in Lantmäteriet's elevation model), raised by up to a metre
// where the shore is adapted – the streets stay dry, though the beach and the camping take water from
// about 163.4 m (1985's record was 163.44 m). Over the protection the water reaches all ground below it
// (the 3D view's flood map does the same): houses get water, so it is never mild (0.3 or more), and the
// share of the model's land under water above the streets' level (model.js flooded()) grows by a tenth
// from 164.0 m to 165.0 m, where three quarters of Storgatan (164.5–166.1 m) are wet. 165.4 m, the
// highest level known (1860), is past the worst case. The news follows the level: Badhusgatan first,
// then the low blocks by Enån and Storgatan's lowest end, then Storgatan and the centre.
const STREETS=FLOOD.streets;
const highWater=({flooded,s},w)=>w<=s.protection?0:Math.min(1,.3+(flooded(w)-flooded(STREETS))/.12);
// The church stables stand at the shore of Kyrkudden: a third of the ground OpenStreetMap maps as their
// "Kyrkstad" lies below 164.0 m, half below 164.5 m and two thirds below 165.4 m (Lantmäteriet). Water over
// the protection gets in among them from about 164.2 m, and among most of them by 164.8 m.
const stables=(c,w)=>w>c.s.protection?clamp((w-164.2)/.6):0;
// A high water's news: dry streets – below them, or held back by an adapted shore – or how far the flood
// reached, and the stables.
const highWaterNews=(c,w,[dry,dryAdapted,low,mid,bad])=>{
  const sev=highWater(c,w),kyrk=stables(c,w);
  return {severity:sev,level:w,kyrk,extra:kyrk>.05?'Vattnet nådde också kyrkstallarna på Kyrkudden, de äldsta från 1400-talet.':'',
    text:sev>0?(w<164.3?low:w<164.65?mid:bad):w>STREETS||c.s.protection>STREETS+.3?dryAdapted:dry};
};

export const EVENTS=[
  // Groundwater: Gärdsjö (permitted 4 500 m³ a day) serves the town, but nearly 40 % have their own wells,
  // twice the county's share, and the summer guests add 58 % to the people in the kommun in July.
  {id:'torka_2031',year:2031,icon:'☀',title:'Torkasommaren',
    resolve:({s,stress},r)=>{const hazard=.45+.3*stress+.2*r,sev=Math.max(0,hazard*(1-s.water));return {severity:sev,
      text:band(sev,s.water>.6?'Grundvattnet sjönk till rekordlåga nivåer. Gärdsjö vattentäkt räckte, och grannar delade vatten med dem vars egna brunnar sinade.':'Grundvattnet sjönk och en del enskilda brunnar sinade, men vattnet räckte – den här gången.',
        'När sommargästerna kom räckte inte vattnet: bevattningsförbud i sex veckor. Hundratals enskilda brunnar sinade och vatten kördes ut till byarna.',
        'Vattnet ransonerades. Brunnarna i byarna sinade, betet på fäbodarna torkade bort och tankbilar körde vatten hela sommaren.'),
      apply:st=>{st.damage+=.05*sev;st.eventMood-=.02*sev;st.visitShock=Math.max(st.visitShock,.05*(.5+.5*sev));}};}},
  // Inland and at the end of long supply lines: a week of food in the shops (foodStockDays), fuel by road.
  {id:'leveranskris_2037',year:2037,icon:'📦',title:'Leveranskrisen',
    resolve:({s,localEnergy,preparedness},r)=>{const sev=Math.max(0,(.7+.2*r)*(1-.6*preparedness-.3*s.foodRegional-.2*Math.min(1,localEnergy)));return {severity:sev,
      text:band(sev,preparedness>.55?'Transporterna till Dalarna stördes i flera veckor. Rättvik klarade sig på egna lager, egen el och mat från gårdar och fäbodar – och grannbyarna fick hjälp.':'Transporterna stördes i flera veckor. Det blev ont om en del varor, men krisen gick över.',
        'Hyllorna gapade tomma i två veckor och dieseln ransonerades. Frivilliga i bygdegårdarna ordnade matutdelning.',
        'Akut brist på mat och drivmedel. Butikerna hade lager för en vecka, och kommunens beredskap räckte inte långt.'),
      apply:st=>{st.damage+=.08*sev;st.eventMood+=sev<.3?.03:-.04*sev;}};}},
  // A cloudburst like Storm Hans (6–8 August 2023: about 150 houses damaged and 25 km of road destroyed in
  // the kommun, Lerdal and Gärdebyn worst, the railway embankment at Tällberg washed away), heavier in a
  // warmer climate. Streets turned to rain gardens and open channels (depaving), planted verges, a
  // cloudburst plan with flood meadows (adaptation) and a prepared town take the edge off.
  {id:'skyfall_2042',year:2042,icon:'⛈',title:'Skyfallet',weather:sev=>({storm:.65+.35*Math.min(1,sev*1.6),empty:.6}),
    resolve:({s,I,stress,preparedness},r)=>{const hazard=.45+.4*stress+.2*r,shield=.5*I.anpassning+.3*clamp(s.depaved/.4)+.15*clamp(s.verges)+.2*preparedness,sev=Math.max(0,hazard*(1-shield));return {severity:sev,
      text:band(sev,s.depaved>.2||I.anpassning>.3?'Ett skyfall lika kraftigt som ovädret Hans 2023. Regnbäddar, öppna diken och översvämningsängar tog hand om vattnet, och bara några källare fick vatten.':'Ett kraftigt skyfall drog in över Siljan. Diken och dagvattenledningar gick fulla, men skadorna blev små.',
        'Som när ovädret Hans drog fram 2023: källare fylldes med vatten och vägar spolades bort. Lerdal och Gärdebyn drabbades värst.',
        'Det värsta skyfallet i mannaminne. Bäckarna från Lerdalsberget blev forsar, hus och vägar förstördes och tågen stod still i veckor när banvallen spolades bort.'),
      apply:st=>{st.damage+=.1*sev;st.eventMood-=.03*sev;}};}},
  // An old bygd: a third of the people are over 65 and 45 % of them live alone. The pine heath already
  // shades the centre; neighbours who look in, and preventive care with heat plans, save the most.
  {id:'varmebolja_2047',year:2047,icon:'🌡',title:'Värmeböljan',
    resolve:({s,I,nature,stress},r)=>{const sev=Math.max(0,(.45+.45*stress+.2*r)*(s.share65/.3)*(1-.2*nature-.6*(1-s.lowParticipation)-.15*I.forebyggande));return {severity:sev,
      text:band(sev,s.lowParticipation<.2?'Två veckor över 30 grader i en bygd där var tredje är över 65. Grannar och hemtjänst ringde på hos de äldre, och ingen dog ensam.':'Två veckor över 30 grader. Vården och hemtjänsten klarade trycket.',
        'Överdödlighet bland de äldre – många bodde ensamma utan någon som kollade till dem.',
        'Värmen tog många liv. Var tredje rättvikare är över 65, och många äldre satt isolerade i sina hus.'),
      apply:st=>{st.lifeShock+=.6*sev;st.eventMood-=.03*sev;st.visitShock=Math.max(st.visitShock,.05*(.5+.5*sev));}};}},
  {id:'digitalt_haveri_2052',year:2052,icon:'⚡',title:'Det digitala haveriet',
    resolve:({s},r)=>{const sev=Math.max(0,(.55+.3*r)*(s.digitalDependence-.6*s.analogResilience));return {severity:sev,
      text:band(sev,s.analogResilience>.45?'Nät och betalsystem låg nere i fyra dagar. Kontanter, papperslistor, radio och det analoga huset höll Rättvik igång.':'Nät och betalsystem låg nere i ett dygn. Det mesta fungerade igen innan oron spred sig.',
        'Fyra dagar utan betalningar, journaler och tidtabeller. Apoteket stängde och hemtjänsten fick leta fram papperslistor.',
        'Samhället stannade. Ingen kunde betala, vården arbetade i blindo och trygghetslarmen hos de äldre slocknade.'),
      apply:st=>{st.damage+=.06*sev;st.eventMood-=.05*sev;st.trust-=.04*sev;}};}},
  // Snowmelt and spring rain, a little under to a little over the year's 100-year level – higher than any
  // year since the regulation, never yet over the lowest streets. A flooded camping in early summer costs
  // part of the season (camping has half the guest nights) unless it has moved up.
  {id:'varflod_2057',year:2057,icon:'🌊',title:'Vårfloden',
    resolve:(c,r)=>{const w=c.level100-.2+.3*r,f=highWaterNews(c,w,[
        'Snösmältning och vårregn lyfte Siljan högre än vid rekordet 1985. Stranden, delar av campingen och Långbryggans landfäste stod under vatten i veckor, men gatorna klarade sig.',
        'Snösmältning och vårregn lyfte Siljan högre än vid rekordet 1985. Campingen hade redan flyttat upp från de lägsta delarna, och de upphöjda strandstråken höll gatorna torra.',
        'Siljan nådde de lägsta gatorna. Badhusgatan stod under vatten och campingen fick utrymmas, men centrum klarade sig.',
        'Siljan steg in över Badhusgatan och de lägsta kvarteren vid Enån. Källare fylldes och vattnet stod kvar i veckor.',
        'Siljan svämmade in i centrum. Storgatan och kvarteren kring Enån stod under vatten i en månad.']);
      const camp=clamp((w-163.4)/.5)*(1-clamp(c.I.anpassning/.5)),sev=f.severity;
      return {severity:sev,level:w,extra:f.extra,text:f.text,
        apply:st=>{st.damage+=.1*sev;st.eventMood-=.03*sev;st.heritage-=.1*f.kyrk;st.visitShock=Math.max(st.visitShock,.05*camp);}};}},
  // 2020 cost Rättvik 28 % of its guest nights (203 421 against 281 099 in 2019) and Classic Car Week.
  {id:'pandemi_2062',year:2062,icon:'🦠',title:'Pandemin',
    resolve:({s},r)=>{const sev=Math.max(0,(.5+.3*r)*(1-.35*s.aiCapacity*s.aiGovernance-.25*(1-s.lowParticipation)-.2*s.selfHealth));return {severity:sev,
      text:band(sev,s.lowParticipation<.2?'Tidig upptäckt och grannskapsnätverk bromsade smittan snabbt. Ingen behövde vara ensam i karantän – grannarna handlade åt de äldre.':'Smittan bromsades efter några tuffa månader, men sommarens evenemang ställdes in.',
        'Två år av restriktioner. Classic Car Week och sommarens evenemang ställdes in, ensamheten bland de äldre ökade och vården gick på knäna.',
        'Vården kollapsade. Smittan gick hårt åt de äldre, och bygden blev mer splittrad.'),
      apply:st=>{st.lifeShock+=.5*sev;st.damage+=.05*sev;st.lowParticipation+=.03*sev;st.visitShock=Math.max(st.visitShock,.28*(.4+.6*sev));}};}},
  // 89.5 % of the kommun is forest. Fire weather grows with warming; a prepared bygd (warnings, stores,
  // radio, volunteer fire crews), grazed fäbod forests and open land, and trust that brings people out
  // keep a fire small. (The id starts with torka: the summer is dry and hazy with smoke in the 3D view.)
  {id:'torka_skogsbrand_2068',year:2068,icon:'🔥',title:'Skogsbranden',
    resolve:({s,I,stress,preparedness},r)=>{const hazard=.35+.6*stress+.25*r,sev=Math.max(0,hazard*(1-.5*preparedness-.15*I.regionalt-.15*s.trust));return {severity:sev,
      text:band(sev,preparedness>.6?'Efter en het och torr sommar brann skogen i två veckor norr om Rättvik. Tidiga varningar, frivilliga brandvärn och brandgator höll elden borta från byar och fäbodar.':'Några skogsbränder i kommunen släcktes innan de hann växa. Röken låg över Siljan i ett par dagar.',
        'Skogen brann i veckor. Fäbodar och byar fick utrymmas, röken låg tung över Siljan och turisterna stannade borta.',
        'Den största skogsbranden i Dalarna i mannaminne. Tusentals hektar skog och flera fäbodar brann ner, och hela byar fick utrymmas.'),
      apply:st=>{st.damage+=.08*sev;st.eventMood-=.03*sev;st.visitShock=Math.max(st.visitShock,.05*(.5+.5*sev));}};}},
  // The refugees of 2016 (+203 people moving in, net) kept Rättvik from shrinking; deaths are twice the births.
  {id:'klimatflykt_2074',year:2074,icon:'🧭',title:'Människor på flykt till Norden',
    resolve:({s,W},r)=>{const sev=Math.max(0,(.3+.5*W.stress)*(1-.4*s.cohousing/.4-.3*s.trust-.2*s.welfare/1.3));return {severity:sev,good:sev<.3,
      text:band(sev,s.cohousing>.15?'Flera hundra klimatflyktingar kom till Rättvik. Generationshus och bygdegårdar tog emot, byskolorna fick barn igen och många blev odlare, lärare och undersköterskor.':'Flera hundra klimatflyktingar kom till Rättvik, och de flesta fick snabbt både bostad och arbete – bygden behövde fler i arbetsför ålder.',
        'Bostadsbristen blev akut och tonen hårdnade, men de flesta fann till slut en plats.',
        'Trångboddhet och misstro. Bygden delades i ”vi” och ”de”.'),
      apply:st=>{st.pop*=1+.06*(1-sev*.3);st.trust+=sev<.3?.02:-.05*sev;}};}},
  {id:'ai_genombrott_2081',year:2081,icon:'✦',title:'AI-genombrottet',
    resolve:({s})=>{const gov=s.aiGovernance,cap=s.aiCapacity;const sev=Math.max(0,cap*(1-gov)-.1);return {severity:sev,good:gov>.5,
      text:gov>.6?'Nya AI-system kunde ta över mycket arbete. Medborgarrådet beslutade att vinsterna skulle bli tid och fler händer i omsorgen – inte arbetslöshet.':gov>.4?'Automatiseringen tog många jobb. Kommunen hann ställa om, men inte för alla.':'Några få bolag långt härifrån ägde systemen. Arbeten försvann och klyftorna växte.',
      apply:st=>{st.gini+=.05*sev;st.welfare+=.05*(1-sev);st.trust-=.04*sev;}};}},
  {id:'megatorka_2092',year:2092,icon:'☀',title:'Den långa torkan',
    resolve:({s,stress},r)=>{const sev=Math.max(0,(.5+.35*stress+.15*r)*(1-s.water)*(1-.4*s.foodRegional));return {severity:sev,
      text:band(sev,s.water>.6?'Tre torra år i rad. En andra vattentäkt, sparsamhet och åkrar med levande jordar höll ställningarna.':'Tre torra år i rad. Det var knappt, men vattnet räckte.',
        'Vattenbrist varje sommar. Brunnarna i byarna sinade, och odlingarna fick gå före gräsmattor och biltvätt.',
        'Brunnar sinade och betet brändes av. Bönder och fäbodbrukare gav upp, och maten fick köpas dyrt utifrån.'),
      apply:st=>{st.damage+=.08*sev;st.eventMood-=.03*sev;st.visitShock=Math.max(st.visitShock,.05*(.5+.5*sev));}};}},
  // Rättvik makes three quarters of its electricity (wind on Hedbodberget, hydro, sun); the permitted
  // parks in the northern forests could make ten times its use.
  {id:'energichock_2104',year:2104,icon:'⚡',title:'Energichocken i Europa',
    resolve:({localEnergy},r)=>{const sev=Math.max(0,(.6+.2*r)*(1-Math.min(1,localEnergy)));return {severity:sev,good:localEnergy>1.1,
      text:localEnergy>1.1?'När Europa saknade el exporterade Rättvik vindkraft från skogarna i norr. Intäkterna gick till invånarnas egna vindkraftsföreningar och till bygderna.':band(sev,'Elpriserna steg, men bygdens egen vind-, vatten- och solkraft dämpade smällen.','Dyr el i två vintrar. Många frös, mest i de eluppvärmda husen i byarna.','Elransonering. Kalkverket stängde och folk frös i sina hem.'),
      apply:st=>{st.welfare+=localEnergy>1.1?.04:0;st.damage+=.06*sev;}};}},
  // Weeks of autumn rain on a lake whose 100-year level has risen (wetter autumns and winters): from a
  // little to half a metre over the year's 100-year level.
  {id:'hostflod_2116',year:2116,icon:'🌊',title:'Höstfloden',
    resolve:(c,r)=>{const w=c.level100+.1+.35*r,f=highWaterNews(c,w,[
        'Veckor av höstregn lyfte Siljan högre än någon gång sedan regleringen. Stranden och stora delar av campingen stod under vatten, men vattnet stannade under de lägsta gatorna.',
        'Veckor av höstregn lyfte Siljan högre än någon gång sedan regleringen, men de upphöjda strandstråken höll vattnet borta från centrum.',
        'Siljan nådde de lägsta gatorna. Badhusgatan och kvarteren vid Enåns mynning stod under vatten i två veckor, men centrum klarade sig.',
        'Siljan steg in i de lägsta kvarteren. Källare vid Enån fylldes, vattnet nådde Storgatans södra ände och stod kvar i veckor.',
        'Siljan svämmade in i centrum. Storgatan och kvarteren kring Enån stod under vatten i en månad, och frågan om att överge de lägsta kvarteren väcktes på allvar.']);
      const sev=f.severity;
      return {severity:sev,level:w,extra:f.extra,text:f.text,
        apply:st=>{st.damage+=.14*sev;st.eventMood-=.05*sev;st.heritage-=.2*f.kyrk;}};}},
];
