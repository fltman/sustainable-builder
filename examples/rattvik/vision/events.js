import { FLOOD, BASE, P, WATER } from './model.js';
import { t, int } from '@engine/i18n.js';
// Events that test Rättvik, read against Rättvik's own model (model.js): each resolves against the state and the
// measures it meets, so the same dry summer is a news item in a prepared Rättvik and a crisis in an unprepared
// one. Years are jittered ±2 per run; the events lie five years apart, so two never fall in the same year (the
// 3D view shows one event's weather a year), and none comes before 2029 (2026 stays as measured). severity 0–1
// (good: a turn for the better, whatever the severity); apply() changes the model's state – welfare damage, the
// mood that feeds trust, health shocks, loneliness, this year's visitors (visitShock), the fäbodar's grazing,
// the people who arrive and, when Siljan gets into the town, the church stables on Kyrkudden.
// The events read what model.js passes them (step(): s, I, year, the water levels, stress, localEnergy,
// preparedness, nature and W). A few measures the model works out before the events but does not pass – the
// houses a cloudburst damages, the dry-year water margin, the share of the power the bygd owns, and Classic Car
// Week's and the winter's guest nights – are worked out here with the model's own formulas (below), and taken
// from the context instead should the model pass them.
// The facts are in research/deep: klimat-vatten (Siljan, Storm Hans, the water, the ice), turism-ekonomi (the
// winter, Classic Car Week, 2020's visitors), samhalle-halsa (the elderly, the refugees of 2016), energi-resor
// (Broboberget, the lime works) and natur-mat-stad (the forest, the fäbodar, the stables); and in
// research/evidence.json (rattvik_e1–e21).
// Titles and texts without numbers are static Swedish, translated by en/events.js (the engine uses L());
// sentences with the model's numbers are written in both languages with t(). Every event names its weather (the
// engine's weather.js: {storm, haze, drought, empty, dark}, or a function of the severity), and a high water
// returns the level Siljan reaches, which the 3D view draws.
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const band=(v,good,mid,bad)=>v<.3?good:v<.6?mid:bad;
const near=(v,step)=>Math.round(v/step)*step;
const pct=v=>t(`${Math.round(v*100)} %`,`${Math.round(v*100)}%`);
const cap=s=>s[0].toUpperCase()+s.slice(1);
// "var sjätte" / "one in six": the share of a group as one in n.
const ORD=['','','andra','tredje','fjärde','femte','sjätte','sjunde','åttonde','nionde','tionde','elfte','tolfte'];
const NUM=['','','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve'];
const oneIn=v=>{const n=Math.max(2,Math.min(12,Math.round(1/Math.max(v,.01))));return [`var ${ORD[n]}`,`one in ${NUM[n]}`];};
// How many of a group, in words.
const part=v=>v>=.58?['nästan två av tre','nearly two in three']:v>=.52?['mer än hälften','more than half']:v>=.47?['hälften','half']
  :v>=.42?['nästan hälften','nearly half']:v>=.36?['fyra av tio','four in ten']:v>=.3?['var tredje','one in three']:['var fjärde','one in four'];
// "A, B och C" / "A, B and C", with a capital first letter.
const list=(items,i)=>{const w=items.map(x=>x[i]);return cap(w.length>1?`${w.slice(0,-1).join(', ')} ${i?'and':'och'} ${w.at(-1)}`:w[0]);};

// --- The model's measures the events need (model.js step(); read from ctx first) --------------------------
// The houses a cloudburst like Storm Hans damages this year: heavier rain in a warmer climate (damage with its
// square), less where there is room for the water – cloudburst plans and flood meadows, depaved streets, planted
// verges and rewetted mires (model.js cloudburstHomes).
const cloudburstHomes=c=>c.cloudburstHomes??BASE.cloudburstHomes*(1+.37*c.stress)**2*(1-.5*c.I.anpassning-.12*c.s.depaved-.06*c.I.skog-.05*c.s.verges);
// The raw water beyond the need in a dry year (model.js waterMargin, with the central run's supply): Gärdsjö's
// margin (25 % today, antagande) against the people and the summer guests, less in a warmer climate, more with a
// second source (beredskap), thrift, mires that hold the water and room for it.
const waterMargin=c=>{
  if(c.waterMargin!=null)return c.waterMargin;
  const {s,I,stress,year}=c,yrs=year-2026;
  const demand=(s.pop/BASE.pop)*(1+WATER.growth*clamp(yrs/WATER.growthYears))*(1-.12*I.effektivitet);
  const dry=(1+BASE.waterMargin)*(1-WATER.climateLoss*stress)+WATER.second*Math.pow(I.beredskap,1.6)+.05*I.beredskap+.04*I.skog+.03*I.anpassning;
  return dry/demand-1;
};
// The share of the electricity made in the kommun that its people, villages and kommun own: two turbines on
// Hedbodberget, most rooftop solar and their part of the new wind (model.js localOwned).
const coOwned=I=>.05+.3*Math.min(1,I.vind/.67);   // the villages' and the kommun's part of the new parks in the north
const localOwned=c=>{
  if(c.localOwned!=null)return c.localOwned;
  const {s,I}=c,newWind=Math.max(0,s.windMW-BASE.windMW)*P.windYieldNew;
  const made=s.solarMW*P.solarYield+Math.min(s.windMW,BASE.windMW)*P.windYield+newWind+BASE.elHydro*(1-.1*I.hav);
  return clamp((2*2*P.windYield+s.solarMW*P.solarYield*(.8+.2*I.sol)+newWind*coOwned(I))/made);
};
// This year's guest nights by season before the year's shocks (model.js visitors): Classic Car Week's nights –
// fewer when its cruising leaves the centre, unless the week is reshaped – and the winter's share of the year.
const seasons=c=>{
  const {s,I,stress,W,year}=c,warm=(W.gwl2100-1.4)*W.shape(year-2026);
  const ccw=c.ccwNights??BASE.ccwNights*(1-.3*clamp((I.bilfritt-.3)/.4)*(1-.6*I.turism));
  const summer0=BASE.guestNights*BASE.summerShare,shoulder0=BASE.guestNights-summer0-BASE.winterNights;
  const summer=(summer0-BASE.ccwNights+ccw)*(1+.02*warm)*(1+.05*I.turism+.02*s.boatLines);
  const shoulder=shoulder0*(1+.02*warm)*(1+.45*I.turism);
  const winter=c.winterNights??BASE.winterNights*(1-.5*clamp(stress)*(1-.5*I.turism))*(1+.3*I.turism);
  return {ccw,winter,winterShare:winter/(summer+shoulder+winter)};
};
// A dry summer: how hard it hits is the worse of the town's supply – its margin against the model's thresholds,
// a watering ban below 5 % and rationing below −10 % (model.js restrictions) – and the private wells (nearly
// 40 % of homes, twice the county's share: drier in a warmer climate, eased by water carried out under an
// emergency plan, beredskap). wells: how much the wells weigh (one summer or several).
const drySev=(c,m,r,wells)=>{
  const town=m>=.05?.25*clamp((.25-m)/.2):.3+2*(.05-m);
  return clamp(Math.max(town,wells*(.45+.3*c.stress+.2*r)*(1-.7*c.I.beredskap)));
};

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
// reached, and the stables. The adapted shore's news (the camping moved up, raised shore paths) needs the
// shore raised by about half a metre (anpassning on its way to level two, model.js protection).
const highWaterNews=(c,w,[dry,dryAdapted,low,mid,bad])=>{
  const sev=highWater(c,w),kyrk=stables(c,w);
  return {severity:sev,level:w,kyrk,extra:kyrk>.05?'Vattnet nådde också kyrkstallarna på Kyrkudden, de äldsta från 1400-talet.':'',
    text:sev>0?(w<164.3?low:w<164.65?mid:bad):w>STREETS||c.s.protection>STREETS+.45?dryAdapted:dry};
};

export const EVENTS=[
  // Broboberget and Lannaberget, 5 mil north-east near Håven: permitted since 2022 for up to 115 turbines, with
  // 740 MW of grid from Ellevio's first stage in 2027 (part of it in Ovanåker), but no investment decision yet
  // (energi-resor). Rättvik was early with citizens' shares – Rättviksvind's turbine on Hedbodberget – and from
  // July 2026 those within nine tower heights get a share of the revenue (rattvik_e8). The model: the kommun's
  // push (vind) builds the northern parks, the villages and the kommun owning up to a third of them
  // (coOwned); without it the market builds about 120 MW, owned from elsewhere, in 2032–46 – the permit is final,
  // so the kommun cannot stop that. Wind pushed through without a say costs trust (model.js resistance) – Håven's
  // residents spoke of "en otrevlig människosyn" in 2022.
  {id:'broboberget_2031',year:2031,icon:'🌬',title:'Beslutet om Broboberget',weather:{},
    resolve:({I},r)=>{const co=coOwned(I),kommun=I.vind>=.05,owned=co>=.2,say=kommun&&I.demokrati>=.3;
      // The conflict: less the more the bygd owns, less with dialogues in the village halls, more without a say.
      const sev=clamp((.25+.2*r)*(1-2*(co-.05))*(say?1-.4*I.demokrati:1)+(say?0:.12));
      return {severity:sev,good:owned&&say,
        text:!kommun?'wpd beslutade att bygga en första del av Broboberget på egen hand. Parken ägs av bolag långt härifrån, och bara de som bor inom nio verkshöjder får vindkraftsersättning.'
          :owned?'Kommunen och byarna i norr gick in som delägare i Broboberget och Lannaberget, med en vindkraftsförening som Rättviksvind på Hedbodberget. Bygget börjar nu, och en del av intäkterna stannar i bygden.'
          :'Den första etappen på Broboberget byggs nu, med kommunen som delägare, och Hedbodbergets verk från 2009 förnyas.',
        extra:!kommun?'Tillståndet vann laga kraft redan 2022, och de som bor närmast hade inget att säga till om – i Håven talade man om en otrevlig människosyn.'
          :say?'Byarna i norr fick säga sitt i bystugorna innan beslutet togs.':'Men de som bor närmast fick inte säga sitt, och i Håven talade man om en otrevlig människosyn.',
        apply:st=>{st.eventMood+=(owned?.02:0)-(say?0:.03*sev);}};}},
  // Groundwater: Gärdsjö (permitted 4 500 m³ a day, new works 2025) serves the town; nearly 40 % have their own
  // wells, and July has 58 % more people than the autumn. This summer is a little drier or wetter than the dry
  // year the model's margin is measured for (±5 points).
  {id:'torka_2036',year:2036,icon:'☀',title:'Torkasommaren',weather:sev=>({haze:.55,drought:.6+.4*Math.min(1,sev*1.5)}),
    resolve:(c,r)=>{const m=waterMargin(c)+.05-.1*r,sev=drySev(c,m,r,.4);
      return {severity:sev,
        text:m>=.05?t(`Grundvattnet sjönk till rekordlåga nivåer, men Gärdsjö vattentäkt hade ${pct(m)} att ge av.`,`Groundwater fell to record lows, but the Gärdsjö water supply had ${pct(m)} to spare.`)
          :m>=-.1?'När sommargästerna kom räckte vattnet nätt och jämnt: bevattningsförbud i sex veckor. Hundratals enskilda brunnar sinade.'
          :'Vattnet ransonerades: Gärdsjö räckte inte till bygden och sommargästerna. Brunnarna i byarna sinade, och betet på fäbodarna torkade bort.',
        extra:c.I.beredskap>=.3?'Kommunens nödvattenplan körde ut vatten till dem vars egna brunnar sinade – nästan fyra av tio har egen brunn.'
          :'Grannar delade vatten med dem vars egna brunnar sinade – nästan fyra av tio har egen brunn.',
        apply:st=>{st.damage+=.05*sev;st.eventMood-=.02*sev;if(m<.05)st.visitShock=Math.max(st.visitShock,.03*sev);if(m<-.1)st.fabodHa*=1-.05*sev;}};}},
  // SMA Minerals' lime works released 119 818 t of fossil CO₂ in 2024 – about 10.9 of the kommun's 17.5 t per
  // inhabitant; industry, mostly the lime works, makes four fifths – most of it from the limestone itself, so only
  // capture (or moving) removes it; under 2023's rules for the EU's emissions trading new allowances run out about
  // 2039 (energi-resor, rattvik_e1–e2). The model: the kilns
  // capture 80 % by 2055 on the ETS's course; once the bygd has made its deal for the forests' wind (vind from level
  // two), the kilns go electric and capture 95 % twelve years after rebuilding, which starts four years after the deal
  // and at the earliest in 2030 (model.js PARAMS.captureLocal); capture needs about 120 GWh a year, nearly what the
  // kommun used in 2026. The event tells where the kilns stand: capturing, being rebuilt, or waiting for the ETS.
  {id:'kalkverket_2041',year:2041,icon:'🏭',title:'Kalkverkets vägval',weather:{},
    resolve:({s},r)=>{const early=s.capture>=.25,deal=s.captureDeal!=null,sev=early?.05+.1*r:deal?.15+.1*r:.3+.15*r;
      return {severity:sev,good:early||deal,
        text:early?'Kalkverkets ugnar går på el från vindkraften i norr, och koldioxiden ur kalkstenen fångas in – långt innan utsläppshandeln hade krävt det. Industrin, framför allt kalkverket, står för fyra femtedelar av kommunens utsläpp.'
          :deal?'SMA Minerals bygger om kalkverkets ugnar för el och avskiljning, med el från vindparkerna i norr som byarna äger del i. Om några år fångas det mesta av koldioxiden in – före utsläppshandelns krav.'
          :'Utsläppsrätterna blev för få och för dyra, och kalkverket fick välja mellan att fånga in koldioxiden och att flytta. SMA Minerals stannade och bygger avskiljning, men det tar femton år, och elen till den – nästan lika mycket som hela kommunen använde 2026 – köps på elmarknaden.',
        apply:st=>{if(early||deal)st.eventMood+=.02;}};}},
  // A cloudburst like Storm Hans (6–8 August 2023: about 150 houses damaged and 25 km of road destroyed in the
  // kommun, Lerdal and Gärdebyn worst, the railway embankment at Tällberg washed away). The model's measure
  // (cloudburstHomes) is this cloudburst in the year's climate and with the year's room for the water; this one is
  // a little smaller or larger (±15 %).
  {id:'skyfall_2046',year:2046,icon:'⛈',title:'Skyfallet',weather:sev=>({storm:.65+.35*Math.min(1,sev*1.6),empty:.6}),
    resolve:(c,r)=>{const homes=cloudburstHomes(c)*(.85+.3*r),n=int(near(homes,10)),sev=clamp((homes-40)/220);
      return {severity:sev,
        text:band(sev,c.I.anpassning>.3||c.s.depaved>.2
            ?t(`Ett skyfall som ovädret Hans 2023. Skyfallsytor, öppna diken och översvämningsängar tog hand om det mesta av vattnet: omkring ${n} hus fick skador, mot 150 när Hans drog fram.`,`A cloudburst like Storm Hans in 2023. Rain gardens, open channels and flood meadows took most of the water: about ${n} houses were damaged, against 150 when Hans swept through.`)
            :t(`Ett kraftigt skyfall drog in över Siljan. Diken och dagvattenledningar gick fulla, och omkring ${n} hus fick skador.`,`A heavy cloudburst swept in over Lake Siljan. Ditches and storm drains ran full, and about ${n} houses were damaged.`),
          t(`Som när ovädret Hans drog fram 2023: omkring ${n} hus fick vatten i källaren och vägar spolades bort. Lerdal och Gärdebyn drabbades värst.`,`As when Storm Hans swept through in 2023: about ${n} houses had water in their cellars and roads were washed away. Lerdal and Gärdebyn were hit hardest.`),
          t(`Det värsta skyfallet i mannaminne: omkring ${n} hus skadades. Bäckarna från Lerdalsberget blev forsar, vägar förstördes och tågen stod still i veckor när banvallen vid Tällberg spolades bort.`,`The worst cloudburst in living memory: about ${n} houses were damaged. The streams off Lerdalsberget became torrents, roads were destroyed and the trains stood still for weeks when the railway embankment at Tällberg washed away.`)),
        apply:st=>{st.damage+=.1*sev;st.eventMood-=.03*sev;}};}},
  // Classic Car Week, week 31 since 1992: some 10 000 cars, three times the usual number of people on its
  // Saturday, about 35 000 guest nights – and a fifth of the year's reported crimes in the kommun; the police
  // called 2026's week "ren misär" (turism-ekonomi). Moving more of it to Rättviksparken and the trotting track is
  // the choice before the kommun (kommun-plats-historia). The model: when the centre goes car-free (bilfritt from
  // level two) the cruising moves out and the week loses up to 30 % of its nights – less where the visitors' plan
  // (turism) reshapes it; the cruising adds to the insecurity (unsafe).
  {id:'bilveckan_2051',year:2051,icon:'🚗',title:'Bilveckan',weather:sev=>({haze:.3*Math.min(1,sev*1.5)}),
    resolve:(c,r)=>{const {I}=c,out=clamp((I.bilfritt-.3)/.4),loss=1-seasons(c).ccw/BASE.ccwNights,moved=out>=.5;
      const sev=clamp((.4+.35*r)*(1-out)*(1-.3*I.demokrati)+.6*loss);
      return {severity:sev,good:moved,
        text:!moved?'Tiotusen bilar och cruising dygnet runt genom centrum. Polisen kallade veckan ren misär: en femtedel av årets anmälda brott i kommunen kom på en vecka.'
          :loss<.1?'Classic Car Week utan cruising i centrum: bilarna visades i Rättviksparken och på travbanan, och veckan hade blivit en folkfest med marknad och musik. Gästerna kom tillbaka, och polisen hade en lugn vecka.'
          :t(`Cruisingen hade flyttat ut till Rättviksparken och travbanan, och centrum var lugnt under bilveckan för första gången sedan 1990-talet. Men en del kom just för att köra genom centrum: veckan hade ${pct(loss)} färre gästnätter än förr.`,`The cruising had moved out to Rättviksparken and the trotting track, and the centre was quiet during Classic Car Week for the first time since the 1990s. But some came just to drive through the centre: the week had ${pct(loss)} fewer guest nights than before.`),
        apply:st=>{if(moved)st.eventMood+=.01;else{st.unsafe+=.02*sev;st.eventMood-=.02*sev;}}};}},
  // AI that can do much of the work (the model's global AI curve passes its middle about 2045). How much of it
  // reaches Rättvik's welfare is the ai lever (aiCapacity); who controls it – the EU's rules, the villages'
  // voice, an analogue reserve, AI that Dalarna's kommuner own together – is aiGovernance.
  {id:'ai_genombrott_2056',year:2056,icon:'✦',title:'AI-genombrottet',weather:{},
    resolve:({s})=>{const used=s.aiCapacity>=.35,gov=s.aiGovernance,sev=used?clamp(s.aiCapacity*(1-gov)-.05):.1;
      return {severity:sev,good:used&&gov>=.55,
        text:!used?'Nya AI-system tog över mycket kontorsarbete i landet. I Rättvik märktes det mest i bankärenden och på vårdcentralen; i omsorgen behövdes lika många händer som förut.'
          :gov>=.55?'Nya AI-system kunde ta över mycket arbete. Rättvik höll fast vid att människor fattar besluten, och vinsterna blev tid och fler händer i omsorgen – inte färre anställda.'
          :gov>=.35?'Automatiseringen tog många jobb i förvaltningen och vården. Kommunen hann ställa om, men inte för alla.'
          :'Några få bolag långt härifrån ägde systemen. Arbeten försvann, klyftorna växte och kameror ersatte besöken hos de äldre.',
        apply:st=>{if(!used)return;st.gini+=.04*sev;st.welfare+=.04*(gov-.4);st.trust-=.04*sev;}};}},
  // A heatwave in an old bygd: 11 % are 80 or older today (Sweden 6 %), 16–17 % later on today's course, and half
  // of the old with home care are troubled by loneliness (elderLonely). Deaths rise 10 % a day at 26 °C three days
  // running (base:dodlighetsokning_varme_26c). Neighbours and village halls that look in, preventive care with
  // heat plans (forebyggande) and green shade save the most.
  {id:'varmebolja_2061',year:2061,icon:'🌡',title:'Värmeböljan',weather:{haze:1,drought:.75,empty:.55},
    resolve:({s,I,nature,stress},r)=>{const lonely=s.elderLonely,one=oneIn(s.share80);
      const sev=clamp((.35+.45*stress+.2*r)*(s.share80/.15)*(.4+.6*lonely/BASE.elderLonely)*(1-.3*I.forebyggande)*(1-.15*nature));
      return {severity:sev,
        text:band(sev,lonely<.45?t(`Två veckor över 30 grader i en bygd där ${one[0]} är över 80. Grannar, bystugorna och hemtjänsten ringde på hos de äldre varje dag, och ingen dog ensam.`,`Two weeks above 30 degrees in a community where ${one[1]} is over 80. Neighbours, the village halls and home care knocked on old people's doors every day, and no one died alone.`)
            :'Två veckor över 30 grader. Vården och hemtjänsten klarade trycket.',
          lonely>=.45?t(`Överdödlighet bland de äldre. ${cap(one[0])} i bygden är över 80, och bland dem som har hemtjänst besväras ${part(lonely)[0]} av ensamhet – många hade ingen som tittade till dem.`,`Excess deaths among the elderly. ${cap(one[1])} in the community is over 80, and ${part(lonely)[1]} of those with home care are troubled by loneliness – many had no one to look in on them.`)
            :'Överdödlighet bland de äldre, fast grannarna och hemtjänsten gjorde vad de kunde.',
          t(`Värmen tog många liv. ${cap(one[0])} rättvikare är över 80, och många satt ensamma i sina hus.`,`The heat took many lives. ${cap(one[1])} people in Rättvik is over 80, and many sat alone in their houses.`)),
        apply:st=>{st.lifeShock+=.6*sev;st.eventMood-=.03*sev;}};}},
  // Snowmelt and spring rain, a little under to a little over the year's 100-year level – higher than any
  // year since the regulation, never yet over the lowest streets. A flooded camping in early summer costs
  // part of the season (camping has half the guest nights) unless it has moved up.
  {id:'varflod_2066',year:2066,icon:'🌊',title:'Vårfloden',weather:sev=>({storm:.5+.4*Math.min(1,sev*1.5),empty:.4+.3*sev}),
    resolve:(c,r)=>{const w=c.level100-.2+.3*r,f=highWaterNews(c,w,[
        'Snösmältning och vårregn lyfte Siljan högre än vid rekordet 1985. Stranden, delar av campingen och Långbryggans landfäste stod under vatten i veckor, men gatorna klarade sig.',
        'Snösmältning och vårregn lyfte Siljan högre än vid rekordet 1985. Campingen hade redan flyttat upp från de lägsta delarna, och de upphöjda strandstråken höll gatorna torra.',
        'Siljan nådde de lägsta gatorna. Badhusgatan stod under vatten och campingen fick utrymmas, men centrum klarade sig.',
        'Siljan steg in över Badhusgatan och de lägsta kvarteren vid Enån. Källare fylldes och vattnet stod kvar i veckor.',
        'Siljan svämmade in i centrum. Storgatan och kvarteren kring Enån stod under vatten i en månad.']);
      const camp=clamp((w-163.4)/.5)*(1-clamp(c.I.anpassning/.5)),sev=f.severity;
      return {severity:sev,level:w,extra:f.extra,text:f.text,
        apply:st=>{st.damage+=.1*sev;st.eventMood-=.03*sev;st.heritage-=.1*f.kyrk;st.visitShock=Math.max(st.visitShock,.05*camp);}};}},
  // Snow and ice fail: Siljan was ice-covered 129 days a winter in 1871–1900 and 74 in 2016–2026 (35 in 2024/25);
  // near Falun the good ski days fall from about 90 to under 40 by the century's end (RCP4.5); Classic Car Week's
  // winter day on the ice was cancelled in 2022 and 2023 (turism-ekonomi). The model: half of winter's guest
  // nights (26 164 in December–March) depend on snow and ice (antagande, rattvik_e3); in a winter without them
  // most of that half is lost, less where year-round offers – the fäbodar, culture, Siljansleden and the geopark
  // (turism) – bring guests for other things. The slalom slope at Lerdalshöjden makes snow with water from the Enån.
  {id:'vinter_2071',year:2071,icon:'❄',title:'Vintern utan snö',weather:{storm:.3,haze:.25,empty:.35},
    resolve:(c,r)=>{const loss=clamp((.35+.2*r)*(1-.6*c.I.turism)),share=seasons(c).winterShare,sev=clamp(1.3*loss),n=pct(loss);
      return {severity:sev,
        text:band(sev,t(`En vinter nästan utan snö, och isen på Siljan bar aldrig. Slalombacken i Lerdal stängde tidigt, men gästerna kom ändå – för fäbodarna, kulturen och vandringarna på Siljansleden – och vinterns gästnätter föll bara med ${n}.`,`A winter with hardly any snow, and the ice on Lake Siljan never held. The slalom slope at Lerdal closed early, but the guests came anyway – for the summer farms, the culture and the walks on the Siljan Trail – and the winter's guest nights fell by only ${n}.`),
          t(`En vinter nästan utan snö. Isen på Siljan bar aldrig, slalombacken i Lerdal höll öppet några veckor på konstsnö, och vinterns gästnätter föll med ${n}.`,`A winter with hardly any snow. The ice on Lake Siljan never held, the slalom slope at Lerdal stayed open for a few weeks on artificial snow, and the winter's guest nights fell by ${n}.`),
          t(`Snön uteblev och isen på Siljan bar aldrig. Slalombacken stängde, vinterns evenemang ställdes in och gästnätterna föll med ${n}. Flera av vinterjobben försvann.`,`The snow never came and the ice on Lake Siljan never held. The slalom slope closed, the winter's events were cancelled and guest nights fell by ${n}. Several of the winter jobs disappeared.`)),
        apply:st=>{st.visitShock=Math.max(st.visitShock,loss*share);st.damage+=.02*sev;}};}},
  // 89.5 % of the kommun is forest. Fire weather grows with warming: SMHI gives 30–40 days a year of low soil
  // moisture in the county by 2069–2098 in RCP8.5 (20–25 in RCP4.5) against 5–10 today
  // (base:dagar_lag_markfuktighet_2069_2098_rcp85). Rewetted mires and continuous-cover forest near the villages
  // (skog), forest grazing round the fäbodar that keeps the undergrowth down, a prepared bygd (warnings, stores,
  // volunteer fire crews) and trust that brings people out keep a fire small (sizes antagande).
  {id:'skogsbrand_2076',year:2076,icon:'🔥',title:'Skogsbranden',weather:sev=>({haze:.5+.5*Math.min(1,sev*1.5),drought:.7}),
    resolve:({s,I,stress,preparedness},r)=>{const grazed=clamp(s.fabodHa/BASE.fabodHa-1),hazard=.3+.6*stress+.25*r;
      const sev=clamp(hazard*(1-.35*preparedness-.25*I.skog-.1*grazed-.1*s.trust));
      const held=[I.skog>=.45&&['återvätta myrar','rewetted mires'],grazed>=.3&&['betade fäbodskogar','grazed summer-farm forests'],preparedness>=.5&&['frivilliga brandvärn','volunteer fire crews']].filter(Boolean);
      return {severity:sev,
        text:band(sev,held.length?t(`Efter en het och torr sommar brann skogen i två veckor norr om Rättvik. ${list(held,0)} höll elden borta från byar och fäbodar.`,`After a hot, dry summer the forest north of Rättvik burned for two weeks. ${list(held,1)} kept the fire away from villages and summer farms.`)
            :'Några skogsbränder i kommunen släcktes innan de hann växa. Röken låg över Siljan i ett par dagar.',
          'Skogen brann i veckor. Fäbodar och byar fick utrymmas, röken låg tung över Siljan och turisterna stannade borta.',
          'Den största skogsbranden i Dalarna i mannaminne. Tusentals hektar skog och flera fäbodar brann ner, och hela byar fick utrymmas.'),
        apply:st=>{st.damage+=.08*sev;st.eventMood-=.03*sev;if(sev>=.3)st.visitShock=Math.max(st.visitShock,.05*(.5+.5*sev));if(sev>=.6)st.fabodHa*=1-.05*sev;}};}},
  // The Siljan trout, a large, long-migrating strain, was shut out of more than 95 % of its spawning and nursery
  // grounds when the Österdalälven was dammed in 1955–1970, and fell from thousands to a few hundred; passages
  // past Spjutmo, Blyberg and Väsa have opened since 2023 (rattvik_e6, base:osterdalalven_fiskvagar). The model's
  // troutAccess: about a tenth with today's fishways, up to 40 % with a living Siljan – free passage past more
  // dams, restored river mouths and a more natural spring flood (hav).
  {id:'oringen_2081',year:2081,icon:'🐟',title:'Siljansöringen',weather:{},
    resolve:({s})=>{const a=s.troutAccess,n=pct(a),sev=clamp(.55-1.6*(a-.05));
      return {severity:sev,good:a>=.25,
        text:a>=.25?t(`Siljansöringen vandrar igen förbi dammarna i Österdalälven: ${n} av de forna lek- och uppväxtområdena går att nå, mot 5 % år 2026. Om hösten samlas folk vid fiskvägarna för att se storöringen gå upp.`,`The Siljan trout migrates past the dams in the Österdalälven again: ${n} of its old spawning and nursery grounds can be reached, against 5% in 2026. In autumn people gather at the fishways to watch the big trout go up.`)
          :a>=.12?t(`Fiskvägarna förbi Spjutmo, Blyberg och Väsa fungerar, och öringen når ${n} av sina forna lekplatser. Stammen växer, men långsamt.`,`The fishways past Spjutmo, Blyberg and Väsa work, and the trout reaches ${n} of its old spawning grounds. The stock is growing, but slowly.`)
          :t(`Fiskvägarna förbi Spjutmo, Blyberg och Väsa är byggda, men öringen når bara ${n} av sina forna lekplatser – de andra dammarna och regleringen stänger fortfarande ute den. I Siljan finns bara några hundra storöringar.`,`The fishways past Spjutmo, Blyberg and Väsa are built, but the trout reaches only ${n} of its old spawning grounds – the other dams and the regulation still shut it out. Lake Siljan has only a few hundred big trout.`),
        apply:st=>{if(a>=.25)st.eventMood+=.02;}};}},
  // People fleeing a hotter south. The refugees of 2016 (+203 people moving in, net) kept Rättvik from shrinking –
  // the dead are twice the born. The model: those who come join the people above SCB's path, mostly young
  // families; Rättvik holds as many as its homes, work and services hold, so arrivals beyond that move on again –
  // about half within ten years in every vision, each being near the size it holds by then (model.js premium).
  // How they are met is the generation houses (cohousing), trust and welfare.
  {id:'klimatflykt_2086',year:2086,icon:'🧭',title:'Människor på flykt till Norden',weather:{},
    resolve:({s,W})=>{const sev=clamp((.3+.5*W.stress)*(1-s.cohousing-.3*s.trust-.2*s.welfare/1.3)),n=int(near(.06*(1-sev*.3)*s.pop,50));
      return {severity:sev,good:sev<.3,
        text:band(sev,s.cohousing>.15?t(`Omkring ${n} människor på flykt från värmen kom till Rättvik. Generationshus och bystugor tog emot, och byskolorna fick barn igen.`,`About ${n} people fleeing the heat came to Rättvik. Multigenerational houses and village halls took them in, and the village schools got children again.`)
            :t(`Omkring ${n} människor på flykt från värmen kom till Rättvik, och de flesta fick snabbt både bostad och arbete – bygden behövde fler i arbetsför ålder.`,`About ${n} people fleeing the heat came to Rättvik, and most quickly found both a home and work – the community needed more people of working age.`),
          t(`Omkring ${n} människor på flykt från värmen kom till Rättvik. Bostadsbristen blev akut och tonen hårdnade, men de flesta fann en plats.`,`About ${n} people fleeing the heat came to Rättvik. The housing shortage became acute and the tone hardened, but most found a place.`),
          t(`Omkring ${n} människor på flykt från värmen kom till Rättvik. Trångboddhet och misstro: bygden delades i ”vi” och ”de”.`,`About ${n} people fleeing the heat came to Rättvik. Overcrowding and mistrust: the community split into “us” and “them”.`)),
        extra:'Rättvik rymmer ändå bara så många som bostäderna, arbetet och servicen bär: tio år senare hade ungefär hälften flyttat vidare.',
        apply:st=>{st.pop*=1+.06*(1-sev*.3);st.trust+=sev<.3?.02:-.05*sev;}};}},
  // 2020 cost Rättvik 28 % of its guest nights (203 421 against 281 099 in 2019) and Classic Car Week.
  {id:'pandemi_2091',year:2091,icon:'🦠',title:'Pandemin',weather:sev=>({empty:.55+.4*sev}),
    resolve:({s},r)=>{const sev=clamp((.5+.3*r)*(1-.35*s.aiCapacity*s.aiGovernance-.25*(1-s.lowParticipation)-.2*s.selfHealth));
      return {severity:sev,
        text:band(sev,s.lowParticipation<.2?'Tidig upptäckt och grannskapsnätverk bromsade smittan snabbt. Ingen behövde vara ensam i karantän – grannarna handlade åt de äldre.':'Smittan bromsades efter några tuffa månader, men sommarens evenemang ställdes in.',
          'Två år av restriktioner. Classic Car Week och sommarens evenemang ställdes in, ensamheten bland de äldre ökade och vården gick på knäna.',
          'Vården kollapsade. Smittan gick hårt åt de äldre, och bygden blev mer splittrad.'),
        apply:st=>{st.lifeShock+=.5*sev;st.damage+=.05*sev;st.lowParticipation+=.03*sev;st.elderLonely+=.04*sev;st.visitShock=Math.max(st.visitShock,.28*(.4+.6*sev));}};}},
  // Inland and at the end of long supply lines: a week of food in the shops today (foodStockDays, antagande; the
  // national planning goal is three months), fuel by road 70; Dalarna is 38 % self-sufficient in food by weight.
  {id:'leveranskris_2096',year:2096,icon:'📦',title:'Leveranskrisen',weather:{empty:.3},
    resolve:({s,localEnergy,preparedness},r)=>{const sev=clamp((.7+.2*r)*(1-.6*preparedness-.3*s.foodRegional-.2*Math.min(1,localEnergy))),days=Math.round(s.foodStockDays);
      return {severity:sev,
        text:band(sev,preparedness>.55?t(`Transporterna till Dalarna stördes i flera veckor. Rättvik klarade sig på lager för ${days} dagar, egen el och mat från gårdar och fäbodar – och grannbyarna fick hjälp.`,`Deliveries to Dalarna were disrupted for weeks. Rättvik got by on ${days} days of stores, its own electricity and food from its farms and summer farms – and helped the neighbouring villages.`)
            :'Transporterna stördes i flera veckor. Det blev ont om en del varor, men krisen gick över.',
          'Hyllorna gapade tomma i två veckor och dieseln ransonerades. Frivilliga i bystugorna ordnade matutdelning.',
          t(`Akut brist på mat och drivmedel. Butikerna och kommunen hade lager för ${days} dagar, och beredskapen räckte inte långt.`,`An acute shortage of food and fuel. The shops and the municipality had stores for ${days} days, and the emergency preparations did not go far.`)),
        apply:st=>{st.damage+=.08*sev;st.eventMood+=sev<.3?.03:-.04*sev;}};}},
  {id:'digitalt_haveri_2101',year:2101,icon:'⚡',title:'Det digitala haveriet',weather:sev=>({empty:.25+.4*sev}),
    resolve:({s},r)=>{const sev=clamp((.55+.3*r)*(s.digitalDependence-.6*s.analogResilience));
      return {severity:sev,
        text:band(sev,s.analogResilience>.45?'Nät och betalsystem låg nere i fyra dagar. Kontanter, papperslistor, radio och byarnas analoga reserver höll Rättvik igång.':'Nät och betalsystem låg nere i ett dygn. Det mesta fungerade igen innan oron spred sig.',
          'Fyra dagar utan betalningar, journaler och tidtabeller. Apoteket stängde och hemtjänsten fick leta fram papperslistor.',
          'Samhället stannade. Ingen kunde betala, vården arbetade i blindo och trygghetslarmen hos de äldre slocknade.'),
        apply:st=>{st.damage+=.06*sev;st.eventMood-=.05*sev;st.trust-=.04*sev;}};}},
  // Three dry years in a row, in the century's warmer climate: the dry-year margin and the wells as the drought
  // summer, a little worse each year (−5 to −15 points), and the fäbodar's grazing.
  {id:'megatorka_2106',year:2106,icon:'☀',title:'Den långa torkan',weather:sev=>({haze:.6,drought:.7+.3*Math.min(1,sev*1.5)}),
    resolve:(c,r)=>{const m=waterMargin(c)-.05-.1*r,sev=drySev(c,m,r,.6);
      return {severity:sev,
        text:m>=.05?(c.I.beredskap>=.5?'Tre torra år i rad. Reservvattentäkten och sparsamhet höll ställningarna.':'Tre torra år i rad. Det var knappt, men vattnet räckte.')
          :m>=-.1?'Bevattningsförbud tre somrar i rad. Brunnarna i byarna sinade, och odlingarna fick gå före gräsmattor och biltvätt.'
          :c.s.fabodHa>700?'Vattnet ransonerades tre somrar i rad. Brunnar sinade och betet brändes av, och flera fäbodbrukare gav upp.'
          :'Vattnet ransonerades tre somrar i rad. Brunnar sinade och betet brändes av, och maten fick köpas dyrt utifrån.',
        apply:st=>{st.damage+=.08*sev;st.eventMood-=.03*sev;if(m<.05)st.visitShock=Math.max(st.visitShock,.04*sev);if(m<-.1)st.fabodHa*=1-.1*sev;}};}},
  // An electricity price shock in Europe. Rättvik makes more than its use once the parks in the north are built,
  // but what protects its people is owning a share of it (localOwned: dividends and revenue that stay) and
  // renovated houses (effektivitet); the villages' electrically heated houses are the most exposed.
  {id:'energichock_2111',year:2111,icon:'⚡',title:'Energichocken i Europa',weather:(sev,r)=>r.good?{}:{dark:.35+.6*sev},
    resolve:(c,r)=>{const {s,localEnergy}=c,own=localOwned(c),good=own>=.3;
      const sev=clamp((.6+.2*r)*(1-1.4*own)*(.4+.6*s.efficiency)*(localEnergy>1?.85:1));
      return {severity:sev,good,
        text:good?t(`När Europa saknade el gick vindkraften i skogarna för fullt. Byarna, invånarna och kommunen äger ${own>=.36?'mer än en tredjedel':'en tredjedel'} av elen som görs i kommunen, och utdelningen stannade i bygden.`,`When Europe ran short of electricity, the wind farms in the forests ran flat out. The villages, the residents and the municipality own ${own>=.36?'more than a third':'a third'} of the electricity made in the municipality, and the dividends stayed in the community.`)
          :band(sev,'Elpriserna steg, men renoverade hus och bygdens egen sol- och vattenkraft dämpade smällen.',
            localEnergy>1?'Vindkraften i skogarna gick för fullt, men den ägs av bolag långt härifrån: rättvikarna betalade samma dyra el som alla andra, och många frös i de eluppvärmda husen i byarna.':'Dyr el i två vintrar. Många frös, mest i de eluppvärmda husen i byarna.',
            'Elransonering i hela Europa. Kalkverket stod still i veckor och folk frös i sina hem.'),
        apply:st=>{if(good)st.welfare+=.03;st.damage+=.06*sev;st.eventMood-=.02*sev;}};}},
  // Weeks of autumn rain on a lake whose 100-year level has risen (wetter autumns and winters): from a
  // little to half a metre over the year's 100-year level.
  {id:'hostflod_2116',year:2116,icon:'🌊',title:'Höstfloden',weather:sev=>({storm:.7+.3*Math.min(1,sev*1.5),empty:.6}),
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
