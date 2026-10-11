// Rättvik 2126's own model: Rättvik's levers (levers.js) acting on Rättvik's measures (indicators.js), one
// step a year, run by the engine's framework (site/src/model.js). It is built from Rättvik's conditions, not
// Kalmar's: an old inland municipality of 11 000 by a clear, nutrient-poor, regulated lake, where the dead
// outnumber the born two to one and only those who move in keep the population up; where the working-age
// share decides what welfare can do; where nine tenths of the land is forest, the fäbodar keep the open
// landscape, a lime works makes four fifths of the emissions, the visitors come in July and by car, and the
// danger from water is cloudbursts on the slopes and Siljan's slow high water – not algal blooms or the sea.
// Every starting value is a record in research/baseline.json (FACTS names it) or a marked assumption
// (antagande, explained in the measure's note). Effect sizes cite Rättvik's research (base:<id>), its evidence
// (research/evidence.json, ids rattvik_e*) or the engine's general research (site/research/
// vision-research.json); where no study gives a size, the comment says antagande. A thinking tool, not a
// forecast.
const START=2026;
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const sig=x=>1/(1+Math.exp(-x));
// A piecewise-linear path through [year, value] points, flat beyond its ends.
const path=(pts,y)=>{if(y<=pts[0][0])return pts[0][1];for(let i=1;i<pts.length;i++)if(y<=pts[i][0]){const [a,u]=pts[i-1],[b,v]=pts[i];return u+(v-u)*(y-a)/(b-a);}return pts.at(-1)[1];};

// Starting values, 2026 (the latest measured year; Rättviks kommun's own numbers where they exist).
export const BASE={
  pop:10978,share65:.346,share80:.113,share0_19:.175,
  // Territorial emissions per inhabitant (2024): industry is the lime works – 13.8 of 17.5 tonnes.
  ghg:{transport:2.204,agriculture:.643,energy:.021,industry:13.766,other:.871},ghgCons:7.6,
  // Fossil-free share of final energy outside industry (2023); transport is only 19 % renewable.
  renewable:.675,
  // Electricity (2024): use 139.8 GWh; made in the kommun 104.7 GWh – wind 82.5 on Hedbodberget (30 MW),
  // hydro 16.1, solar 6.0 from 7.42 MW.
  solarMW:7.42,windMW:30,elUse:139.83,elHydro:16.106,
  // Trips by car: 53 % in Sweden (RVU 2024); more in a rural kommun with 679 cars per 1 000 (antagande 65 %).
  // Public transport: 9 % of motorised trips in Dalarna, about 7 % of all trips (antagande).
  carShare:.65,transitShare:.07,carsPer1000:679,evShare:.037,transitGood:.365,railMain:3.35,boatElectric:.04,
  // Food and land: organic farmland, the summer farms' forest grazing, the grain on the fields; food from the
  // county (Dalarna is 38 % self-sufficient by weight), a week of food in the shops and today's diet are
  // assumptions.
  regen:.296,foodRegional:.15,foodStockDays:7,fabodHa:608,grainHa:229,diet:.35,
  // Siljan: moderate ecological status (VISS, class 3 of 5) because of fish and connectivity – index, 1 = good
  // status; the Siljan trout is shut out of more than 95 % of its former spawning grounds.
  waters:.5,troutAccess:.05,protectedNature:.018,biodiversity:.33,canopy:.293,greenShare:.4,
  lifeExp:83.96,selfHealth:.658,activity:.635,lowParticipation:.265,distress:.075,youthScreen:.87,elderLonely:.527,
  trust:.732,youthVoice:.22,gini:.256,childPoverty:.094,unsafe:.11,cohousing:.002,
  education:.712,higherEd:.344,youthLeave:.63,unemployment:.031,
  homePrepared:.43,waste:395,recycling:.45,
  // Visitors: commercial guest nights 2025, the summer's share (June–August), winter (December–March),
  // Classic Car Week's nights, the jobs they give and how they come; July has 58 % more people than autumn.
  guestNights:226773,summerShare:.661,winterNights:26164,ccwNights:35000,tourismJobs:186,touristCar:.915,julyExtra:.583,
  // Water: the dry-year margin is not published (antagande 25 %); the water index follows from it (0.6).
  // Storm Hans (August 2023) damaged about 150 houses: the measure of a cloudburst today.
  waterMargin:.25,water:.6,cloudburstHomes:150,
};
// The research record behind each starting value (research/baseline.json). Values that are assumptions have
// no record here; their notes in indicators.js say so.
export const FACTS={
  pop:'befolkning_total',share65:'andel_65_plus',share80:'andel_80_plus',share0_19:'andel_0_19',
  'ghg.transport':'vaxthusgaser_transporter_per_inv','ghg.agriculture':'vaxthusgaser_jordbruk_per_inv','ghg.energy':'vaxthusgaser_el_fjarrvarme_per_inv','ghg.industry':'vaxthusgaser_industri_per_inv',
  ghgCons:'konsumtionsbaserade_utslapp_sverige',renewable:'fossilfri_andel_slutanvandning_utom_industri',
  solarMW:'solceller_installerad_effekt',windMW:'vindkraft_installerad_effekt',elUse:'elanvandning_total',elHydro:'elproduktion_vattenkraft',
  carsPer1000:'personbilar_per_1000_inv',evShare:'elbilar_andel',transitGood:'kollektivtrafik_vardagsresor_bra_andel',railMain:'restid_tag_stockholm_min',
  boatElectric:'fritidsbatar_elmotor_andel_sverige',
  regen:'ekologisk_akermark_andel',fabodHa:'fabodbete_hektar',grainHa:'spannmal_hektar',
  waters:'siljan_ekologisk_status',troutAccess:'siljansoring_lekomraden_utestangda',protectedNature:'skyddad_natur_total',canopy:'tradbevuxen_mark_andel_tatort',
  lifeExp:'medellivslangd_kvinnor',selfHealth:'sjalvskattad_god_halsa',activity:'fysiskt_aktiva',lowParticipation:'lagt_socialt_deltagande',distress:'allvarlig_psykisk_pafrestning',
  youthScreen:'unga_skarmtid_over_3h',elderLonely:'ensamhet_hemtjanst_65plus',
  trust:'avsaknad_tillit',youthVoice:'unga_mojlighet_paverka',gini:'gini_disponibel_inkomst',childPoverty:'barnfattigdom_andel',unsafe:'otrygghet_kvall',cohousing:'kollektivhus_lagenheter_lan',
  education:'gymnasieexamen_4ar',higherEd:'eftergymnasial_utbildning_25_64',youthLeave:'unga_tror_flytta_fran_kommunen',unemployment:'arbetsloshet_20_64',
  homePrepared:'hemberedskap_en_vecka',waste:'kommunalt_avfall_kg_per_inv',recycling:'materialatervinning_andel',
  guestNights:'gastnatter',summerShare:'gastnatter_sommar_andel',winterNights:'gastnatter_vinter',ccwNights:'classic_car_week_gastnatter',tourismJobs:'turism_arsarbetskrafter',
  touristCar:'bilandel_turistresor',julyExtra:'befolkning_juli_okning',cloudburstHomes:'skyfall_2023_skadade_villor',
};
// Starting values that are estimates rather than statistics vary ±20 % in the uncertainty runs.
export const BASE_UNCERTAIN=['foodRegional','foodStockDays','waters','biodiversity','greenShare','cohousing','waterMargin','carShare'];

export const PARAMS={
  // SCB's projection (2024) on today's course: 11 083 (2030), 11 107 (2040), 11 224 (2050), 11 580 (2070). After
  // 2070 no projection exists: Rättvik grew at 0.7 of Sweden's pace in 2050–70, and at that ratio to SCB's
  // national extension (+0.19 %/yr 2070–2120, demography_e2) it reaches about 12 450 by 2126 (antagande).
  popPath:[[2026,10978],[2030,11083],[2040,11107],[2050,11224],[2070,11580],[2126,12450]],
  // Its age structure on the same course: 65+ 34.6 % → 36.5 % (2040) → 37.4 % (2070); 80+ 11.3 % → 14.0 % (2030)
  // → 14.5 % (2040) → 16.4 % (2070); the children fewer to 2040 and back by 2060 (SCB's dependency ratio
  // 1.08 → 1.11 → 1.20 in 2060). Beyond 2070 Sweden keeps ageing (demography_e7): +1 point (antagande).
  share65Path:[[2026,.346],[2040,.365],[2060,.375],[2070,.374],[2126,.385]],
  share80Path:[[2026,.113],[2030,.14],[2040,.145],[2070,.164],[2126,.175]],
  share0_19Path:[[2026,.175],[2040,.161],[2060,.17],[2126,.17]],
  // Births and deaths (2025): 72 born, 143 dead; SCB assumes about 79 births a year as fertility recovers.
  // Deaths follow the share of 80+ (elasticity 0.6, antagande) and fall 6 % for each year life expectancy runs
  // above its trend (antagande). The migration that keeps today's course on SCB's path is what remains:
  // about 100 a year, as 2015–2024 averaged (base:flyttnetto_2025).
  births0:72,deaths0:143,birthsLater:79,
  // Life expectancy: SCB's women 85.5 → 89.7 and men 82.5 → 87.5 by 2070 (demography_e5): +4.6 years.
  lifeGain:7,lifeYears:41,
  // How much bigger than SCB's path an attractive Rättvik can become, and how fast. Rättvik has held 10 600–
  // 11 450 inhabitants since 1970 while its neighbours drifted apart: since 1990 Leksand +9 %, Mora ±0, Orsa
  // −7 %, Malung-Sälen −12 %, Älvdalen −18 % – and Åre +27 % with a ski boom (base:befolkning_siljansbygden_
  // 1990_2024). Many more want to live in the countryside than move there (rattvik_e13); the pandemic's
  // in-migration to small towns and rural kommuner with tourism (Rättvik +168 in 2020 against a usual 100)
  // faded within two years (rattvik_e14), and those who left Stockholm keeping their jobs were few
  // (rattvik_e15). So the most attractive Rättvik settles about a tenth above SCB's path (premiumMax:
  // rattvik_e16, antagande within that range – 5 to 18 % in the uncertainty runs), people moving in over
  // decades: half the gap in about ten years, never more than 0.5 % of the population a year (the pandemic
  // year's surplus was 0.6 %). A warmer Europe may send a few more north: up to 3 % more in the fossil world,
  // from 2045 (antagande). The size is what homes, work and services hold – so when an event brings more
  // than that, some move on again, as many placed in small kommuner do.
  premiumMax:.1,migYears:15,migCap:.005,climatePremium:.03,
  // Solar: Rättvik's share of Sweden's growth (≈ 0.35 MW a year; 7 MW were connected by 2024) and the roofs,
  // barns and car parks (antagande 80 MW, 5 m² per kWp – energy_e20); 6.0 GWh came from 7.42 MW in 2024.
  solarTrend:.35,solarPotential:80,solarYield:.813,
  // Wind: Hedbodberget's 15 turbines give 2.75 GWh per MW; Broboberget/Lannaberget is permitted for up to
  // 115 turbines with 740 MW of grid (about 1.5 TWh a year, 2.03 GWh per MW), part of it in Ovanåker
  // (antagande: 400 MW in Rättvik); Gundåsmoren up to 25 turbines (antagande 150 MW). The grid takes new
  // production from its first stage in 2027. Without a decision of the kommun's, the market builds a part
  // of the permitted park later (antagande 120 MW, 2032–46).
  windYield:2.75,windYieldNew:2.03,windNorth:400,windGundas:150,windMarket:120,
  // The lime works (119 818 t fossil CO₂ in 2024): the EU's emissions trading and its 2040 target make the
  // kilns capture their CO₂ or move (rattvik_e1, rattvik_e2) – today's course: 80 % by 2055 (antagande). SMA
  // Mineral's own way is electric calcination, which releases the stone's CO₂ pure enough to capture (rattvik_e2):
  // with a deal for power from the forests' wind (vind from level two) the kilns are rebuilt four years after the
  // deal, at the earliest ten years before the trading course begins, and capture 95 % twelve years later – as far
  // as the new wind's power reaches (antagande). Capture or electric calcination needs about 1 MWh of electricity
  // per tonne (antagande): 120 GWh a year.
  captureTrend:[.8,2040,15],captureEl:120,captureLocal:{lead:10,build:4,years:12,max:.95},
  // Kyrkudden's church stables and the open shore below them: raised shore edges cost a little of them.
  heritageCost:.05,
  // A train to the capital: 3 h 21 at best, two direct trains a weekday. Trafikverket's works cut Uppsala–
  // Borlänge from 100 to 93 minutes by about 2031; the region's goal, Mora–Stockholm under three hours
  // (Rättvik ≈ 2 h 35), is unfunded – what the push for the railway (forbindelser) can win.
  rail:{today:3.35,planned:[.117,2027,4],gain:.65},
};
export const P=PARAMS;

// Siljan (research/deep/klimat-vatten): a regulated lake, mean level 161.58 m RH 2000 (161.18 m RH 1900),
// highest 1985 at 163.44 m. Today's 100-year level about 163.7 m RH 2000 (estimate, from MSB's 100-year
// flow through the regulation's discharge table); the lowest streets (Badhusgatan, Båthamnsvägen) at
// about 164.0 m – 5 % of the car streets lie below 163.99 m in Lantmäteriet's elevation model
// (tools/flood-map.mjs). The everyday level stays (regulated); the high water rises with heavier winter
// and autumn flows: about +0.3 m by 2071–2100 in RCP8.5 (SMHI: +13 % for the 50-year flow) – though
// MSB's older study points the other way. Adaptation means room for the water and raised shore paths,
// up to Leksand's recommended lowest building level, 165 m (protectGain ~1 m).
export const FLOOD={
  kind:'lake',high100:163.7,streets:164.0,protectGain:1.0,
  rise:{ssp126:.05,ssp245:.15,ssp585:.35},risePow:.8,
  table:[[162.38,.002],[162.58,.006],[162.78,.011],[162.98,.021],[163.18,.034],[163.38,.046],[163.58,.056],[163.78,.073],[163.98,.084],[164.18,.097],[164.38,.105],[164.58,.112],[164.78,.144],[164.98,.17],[165.18,.183],[165.38,.196],[165.58,.23],[165.78,.254],[165.98,.273],[166.18,.3]],
};
// Drinking water: groundwater from Gärdsjö, a new well field and works in 2025, permitted for 4 500 m³ a day;
// nearly 40 % have their own wells. The dry-year margin (BASE.waterMargin, antagande); demand +5 % by 2050 with
// the summer guests; a second source comes with preparedness; a dry year can take a quarter of the
// groundwater in a hot climate (antagande); dry summers come in 15 % of years today.
export const WATER={growth:.05,growthYears:24,second:.6,climateLoss:.25,dryYears:.15};

// The uncertainty the ensemble varies (site/src/model.js ensemble(), in this order): the framework's pace,
// reach, sea, surge and stress, and Rättvik's own – life expectancy, technology, the EU car rules, Sweden's
// transition, AI, social drift, migration, the water supply, the lime works' capture, the market's wind and
// visitors' demand.
// (growth: how many more or fewer move here than SCB assumes – up to ±8 % of the population by 2086; pull: how
// much bigger an attractive Rättvik can become, 5–18 %.)
export const SYSTEM_SPREAD={pace:[.75,1.33],reach:[.8,1.2],life:[.6,1.4],tech:[.5,1.5],ev:[-5,5],national:[.7,1.4],ai:[-8,8],drift:[.5,1.5],
  sea:[.7,1.45],surge:[-.07,.07],stress:[.75,1.25],growth:[.6,1.4],waterSupply:[.93,1.07],ets:[.7,1.3],windMarket:[0,1.6],tour:[.5,1.5],pull:[.5,1.8]};
export const VARY={ev:0,national:1,ai:0,drift:1,growth:1,life:1,tech:1,waterSupply:1,ets:1,windMarket:1,tour:1,pull:1};

const F=FLOOD,WA=WATER;
const AI0=.12,DEP0=(BASE.share0_19+BASE.share65)/(1-BASE.share0_19-BASE.share65);
const natureOf=(green,canopy,prot)=>clamp(.5*green/.5+.3*canopy/.35+.2*Math.min(1,prot/.1));
const nature0=natureOf(BASE.greenShare,BASE.canopy,BASE.protectedNature);
// Today's course, step by step: the growth SCB projects, and its births and deaths at the trend's age.
const popAt=y=>path(PARAMS.popPath,y);
const birthRate=t=>(PARAMS.births0+(PARAMS.birthsLater-PARAMS.births0)*clamp(t/20))/BASE.pop;
const deathRate=(share80,excess)=>PARAMS.deaths0/BASE.pop*Math.pow(share80/BASE.share80,.6)*Math.exp(-.06*excess);

export function init(B){
  return {
    year:START,pop:B.pop,popTrend:B.pop,devY:0,devO:0,devL:0,share65:B.share65,share80:B.share80,share0_19:B.share0_19,
    regen:B.regen,diet:B.diet,foodRegional:B.foodRegional,foodStockDays:B.foodStockDays,fabodHa:B.fabodHa,grainHa:B.grainHa,
    solarMW:B.solarMW,windMW:B.windMW,efficiency:1,capture:0,captureLocal:0,captureDeal:null,carShare:B.carShare,transitShare:B.transitShare,transitGood:B.transitGood,boatLines:0,
    waters:B.waters,troutAccess:B.troutAccess,protectedNature:B.protectedNature,biodiversity:B.biodiversity,canopy:B.canopy,greenShare:B.greenShare,
    protection:F.streets,water:B.water,
    lifeExp:B.lifeExp,lifeDev:0,lifeShock:0,activity:B.activity,selfHealth:B.selfHealth,distress:B.distress,lowParticipation:B.lowParticipation,
    elderLonely:B.elderLonely,youthScreen:B.youthScreen,
    trust:B.trust,youthVoice:B.youthVoice,gini:B.gini,cohousing:B.cohousing,unsafe:B.unsafe,
    education:B.education,higherEd:B.higherEd,youthLeave:B.youthLeave,
    digitalDependence:.85,analogResilience:.2,aiCapacity:AI0,aiGovernance:.25,homePrepared:B.homePrepared,welfare:1,
    damage:0,eventMood:0,visitShock:0,heritage:1,tourismJobs:B.tourismJobs,guestNights:B.guestNights,touristCar:B.touristCar,
    depaved:0,verges:0,roofs:.03,facade:0,forest:0,lots:0,housing:0,canalsBuilt:0,maturity:.35,solarRoof:0,
  };
}
// Rättvik's shared capacity for change: its welfare and economy, trust, how many take part in the
// associations and village halls, the young people's voice – and how many there are of working age to
// carry it (the dependency ratio, 1.09 today and among Sweden's highest).
export function capacity(s){
  const dep=(s.share0_19+s.share65)/Math.max(.2,1-s.share0_19-s.share65);
  return 10*s.welfare*((.75+.5*s.trust)/(.75+.5*BASE.trust))*((.85+.3*(1-s.lowParticipation))/(.85+.3*(1-BASE.lowParticipation)))
    *((1+.2*s.youthVoice)/(1+.2*BASE.youthVoice))*Math.sqrt(DEP0/dep);
}

export function step(c){
  const {s,I,before,B,V,W,year,t,soon,held,stress,seaRise,level100,load,flooded}=c;
  const lag=(x,target,tau)=>held?x:x+(target-x)*(1-Math.exp(-1/Math.max(.5,tau)));
  // What gets built accumulates at a limited yearly rate (a few % of streets, roofs and lots a year).
  const build=(key,target,up,down=up*2)=>{const x=s[key]??0;if(held)return x;s[key]=x+Math.max(-down,Math.min(up,target-x));return s[key];};
  // --- The world around Rättvik -------------------------------------------------------------------
  // The EU's 2035 rule for new cars (from today's 3.7 % towards 99 %), Sweden's net zero by 2045, global AI.
  const evCurve=y=>sig((y-2037)/3.6),ev=clamp(B.evShare+(.99-B.evShare)*(sig((year-2037-V.ev*soon)/3.6)-evCurve(START))/(1-evCurve(START)));
  const national=clamp((year-2026)/(24*V.national));
  const aiGlobal=clamp(.15+.8*sig((year-2045-V.ai*soon)/7));
  const gwl=1.4+(W.gwl2100-1.4)*W.shape(t);
  // Society drifts without new decisions (antagande, from the trends in research/): e-bikes and remote work
  // take a few car trips (fewer than in a town); social life thins with more living alone and a digital
  // everyday; the old who live alone grow lonelier; the food chain keeps consolidating.
  const driftCar=-.04*V.drift*clamp(t/45),driftTransit=.01*V.drift*clamp(t/45);
  const driftLonely=.08*V.drift*(1-Math.exp(-t/35)),driftElder=.05*V.drift*(1-Math.exp(-t/30)),driftTrust=-.05*V.drift*(1-Math.exp(-t/40)),driftFood=-.03*V.drift*clamp(t/50);
  // Change meets resistance unless people have a real say: wind in the forests, protected forest (2 291
  // private forest owners), a centre without Classic Car Week's cruising, and moving the campsite (antagande).
  // In the centre it is the cruising and the parking that are contested, not the pace: walking-pace streets
  // (level one) meet a tenth of it, a car-free centre the cruising has to leave the rest (antagande).
  const dI=k=>Math.max(0,I[k]-before[k]),contested=x=>.1*clamp(x/.33)+.9*clamp((x-.33)/.67);
  const resistance=3*Math.max(0,contested(I.bilfritt)-contested(before.bilfritt))*(1-.7*I.demokrati)+1.5*dI('vind')*(1-.6*I.demokrati)+1.5*dI('skog')*(1-.5*I.demokrati)+dI('anpassning')*(1-.5*I.demokrati);

  // --- Food and the open landscape ------------------------------------------------------------------
  // Without a decision the summer farms keep shrinking: dairy cows halved since 1981 to five farms, a third of
  // Dalarna's farmers are 60 or older – a third less forest grazing by 2070 (antagande). Living fäbodar with
  // young farmers, dairies and grazing double it (antagande; Dalarna's summer farms with animals went from
  // 52 to 93 in 1994–2008); forest grazing in protected forest and visitors add a little.
  s.fabodHa=lag(s.fabodHa,B.fabodHa*(1-.35*clamp(t/45)*(1-I.regionalt)+I.regionalt+.2*I.skog+.1*I.turism),8);
  // Food sovereignty brings grain back to the fields (941 ha in 1981, 229 today) – from the ambitious level.
  s.grainHa=lag(s.grainHa,B.grainHa*(1+2.5*clamp((I.regionalt-.5)/.5)+.3*I.beredskap*I.regionalt),6);
  s.regen=lag(s.regen,clamp(B.regen+.45*I.regionalt+.05*I.skog),6);
  // Rättvik's own food culture: less but better meat – from the fäbodar's grazing and the elk hunt – and more
  // grain, roots and legumes in seasonal public meals (food_e34: −28 % climate impact per school meal).
  s.diet=lag(s.diet,B.diet+.3*I.regionalt,5);
  s.foodRegional=lag(s.foodRegional,clamp(B.foodRegional+driftFood*(1-I.regionalt)+.3*I.regionalt+.03*I.turism+.03*I.beredskap,0,.6),6);
  s.foodStockDays=lag(s.foodStockDays,B.foodStockDays+50*I.beredskap+25*I.regionalt*I.beredskap,4);

  // --- Energy, and the lime works ------------------------------------------------------------------
  s.solarMW=lag(s.solarMW,B.solarMW+PARAMS.solarTrend*V.tech*t+PARAMS.solarPotential*I.sol,4);
  const grid=clamp((year-2027)/6),north=Math.min(1,I.vind/.67);
  const market=PARAMS.windMarket*V.windMarket*clamp((year-2032)/14);
  s.windMW=lag(s.windMW,B.windMW+market*(1-north)+PARAMS.windNorth*north*grid+PARAMS.windGundas*clamp((I.vind-.67)/.33)*grid,5);
  // Capture at the kilns: the ETS's course – or, from the year the bygd makes its deal for the wind's power (vind
  // from level two, s.captureDeal), its own faster way, as far as the new wind's power reaches (PARAMS.captureLocal).
  const [capMax,capFrom,capYears]=PARAMS.captureTrend,CL=PARAMS.captureLocal;
  const captureTrend=capMax*clamp((year-capFrom)/(capYears*V.ets));
  if(s.captureDeal==null&&(c.policy.vind||0)>=2)s.captureDeal=year;
  const newWindGWh=Math.max(0,s.windMW-B.windMW)*PARAMS.windYieldNew;
  const localFrom=s.captureDeal==null?Infinity:Math.max(capFrom-CL.lead,s.captureDeal+CL.build);
  if(!held)s.captureLocal=Math.min(CL.max*clamp(newWindGWh/PARAMS.captureEl),Math.max(s.captureLocal,captureTrend)+(year>=localFrom?CL.max/CL.years:0));
  s.capture=lag(s.capture,Math.max(captureTrend,s.captureLocal),3);
  s.efficiency=lag(s.efficiency,1-.2*I.effektivitet,6);   // renovated homes and premises, heat pumps (energy_e12)
  // Electricity: more people, efficiency, the electric cars (about 15 GWh with all of today's cars), and the
  // capture; Siljan regulated for its life costs a little of the kommun's own hydro (antagande).
  const elUse=B.elUse*(s.pop/B.pop)*s.efficiency*(1+.11*(ev*s.carShare/B.carShare-B.evShare))+PARAMS.captureEl*s.capture;
  const elProd=s.solarMW*PARAMS.solarYield+Math.min(s.windMW,B.windMW)*PARAMS.windYield+Math.max(0,s.windMW-B.windMW)*PARAMS.windYieldNew+B.elHydro*(1-.1*I.hav);
  const localEnergy=elProd/elUse;
  // Who owns the power: the kommun's own turbine and Rättviksvind's on Hedbodberget (2 of the 15, base:
  // vindkraft_lokalagda_verk) and most rooftop solar are local; new wind is owned from elsewhere unless the
  // villages co-own it – up to a third of the northern parks (antagande; the 2026 law gives neighbours a
  // share of the revenue anyway, rattvik_e8).
  const localOwned=clamp((2*2*PARAMS.windYield+s.solarMW*PARAMS.solarYield*(.8+.2*I.sol)+newWindGWh*(.05+.3*north))/elProd);
  // Outside industry almost all fossil energy is transport fuel: the fossil-free share follows the cars.
  const transportFossil=(s.carShare/B.carShare)*(1-.95*ev)/(1-.95*B.evShare)*(1-.3*national);
  const renewable=clamp(1-(1-B.renewable)*(.94*transportFossil+.06*(1-national)));

  // --- Travel ------------------------------------------------------------------------------------------
  // Rural Rättvik: most trips start in the villages, so a car-free centre moves little and buses, shuttles
  // and cycle paths between the villages more (demand-responsive transport complements, rarely replaces, the
  // car – antagande); the train takes commuters to Leksand, Mora and Borlänge. The car keeps at least 30 %.
  s.carShare=lag(s.carShare,clamp(B.carShare+driftCar-.06*I.bilfritt-.12*I.kollektivt-.05*I.forbindelser-.02*(s.cohousing-B.cohousing)/.2,.3),4);
  s.transitShare=lag(s.transitShare,clamp(B.transitShare+driftTransit+.1*I.kollektivt+.04*I.forbindelser,0,.3),4);
  const activeShare=clamp(1-s.carShare-s.transitShare,.1);
  const carsPer1000=B.carsPer1000*Math.pow(s.carShare/B.carShare,1.1)*(1-.15*I.kollektivt*I.bilfritt);
  // Who finds public transport good for everyday trips (36.5 %; Sweden 68.8 %): Region Dalarna's demand-
  // responsive pilot with Rättvik (antagande +3 points), then the kommun's own push.
  s.transitGood=lag(s.transitGood,clamp(B.transitGood+.03*clamp(t/8)+.33*I.kollektivt+.08*I.forbindelser,0,.85),5);
  const R=PARAMS.rail,railMain=R.today-R.planned[0]*clamp((year-R.planned[1])/R.planned[2])-R.gain*I.forbindelser;
  // Boats between the villages, in summer: electric boat buses from Långbryggan to the old steamboat piers
  // round Siljan – Tällberg and Leksand, Siljansnäs, Sollerön, Vikarbyn and Mora – as Siljan's steamboats ran
  // before the railway reached the villages (base:batlinje_rattvik_leksand_1895). Electric passenger boats
  // run on Swedish lines today, and an electric tourist boat makes 30 nautical miles on a charge (rattvik_e19,
  // rattvik_e20): Leksand is about 20 km away by water, Mora about 38. The lake is open from April (the ice
  // now lies about 74 days – base:istacke_dagar_2016_2026), so the lines run May–September. The train stays
  // faster (Leksand 15 minutes, Mora 23), which is what ended the steamboats' trade: the boats carry visitors,
  // second-home families and outings to the villages without a station, not commuters. They come with the
  // villages' buses (kollektivt: "båtlinjer på Siljan om sommaren" from the ambitious level) or the
  // visitors' plan (turism) and take a few years to start (boats, chargers at the piers).
  s.boatLines=lag(s.boatLines,clamp(clamp((I.kollektivt-.33)/.34)+.5*clamp((I.turism-.33)/.34))*clamp((year-2029)/3),4);

  // --- What is built in the town --------------------------------------------------------------------
  const depave=build('depaved',clamp(.75*I.bilfritt*(.75+.25*I.regionalt)),.02);
  // Trees and beds along the kerbs of some streets (a birch avenue lined Storgatan around 1900) – not all of them.
  const verges=build('verges',clamp(.3*I.anpassning+.2*I.forebyggande+.1*I.skog),.03);

  // --- Siljan, the forest and the town's green -------------------------------------------------------
  // Siljan's status is held down by fish and connectivity: the fishways being built past Spjutmo, Blyberg and
  // Väsa (2019 settlement) and the review of Gråda's permit from 2026 lift it a little on today's course
  // (antagande); the lake regulated for its life, free passage and restored river mouths lift it to good; a
  // warmer lake stresses the cold-water fish (trout, grayling, vendace) and browns with more runoff.
  s.waters=lag(s.waters,clamp(B.waters+.06*clamp((year-2026)/8)+.32*I.hav+.03*I.skog-.08*stress,0,1.2),15);
  s.troutAccess=lag(s.troutAccess,clamp(B.troutAccess+.05*clamp((year-2026)/6)+.3*I.hav),10);
  // Protected nature: 1.8 % of the kommun (Sweden 12.1 %; Sweden's forest land 9.4 % formally protected, the
  // EU's goal 30 % of land – rattvik_e7): about one new reserve a decade on today's course (antagande), up to
  // Sweden's level with new reserves, set-asides and rewetted mires.
  s.protectedNature=lag(s.protectedNature,B.protectedNature+.012*clamp(t/30)+.1*I.skog,12);
  s.biodiversity=lag(s.biodiversity,clamp(B.biodiversity+.25*(s.protectedNature-B.protectedNature)/.1+.08*(s.fabodHa/B.fabodHa-1)+.08*I.hav
    +.05*(s.greenShare-B.greenShare)/.2-.1*stress-.03*Math.max(0,s.windMW-B.windMW)/500),8);
  s.greenShare=lag(s.greenShare,clamp(B.greenShare+.3*depave+.08*I.anpassning+.05*s.lots,0,.8),3);
  s.canopy=lag(s.canopy,clamp(B.canopy+.15*depave+.05*I.anpassning+.04*I.skog+.03*I.regionalt,0,.55),8);
  const nature=natureOf(s.greenShare,s.canopy,s.protectedNature);

  // --- Emissions ---------------------------------------------------------------------------------------
  // Transport: the territorial figure counts all traffic on the kommun's roads – the residents' trips (half,
  // antagande), road 70's through traffic and freight, and the visitors' cars.
  const visitorsTravel=(s.touristCar/B.touristCar)*(s.guestNights/B.guestNights);
  const ghgTransport=B.ghg.transport*(.5*s.carShare/B.carShare+.3+.2*visitorsTravel)*(1-.93*ev)/(1-.93*B.evShare)*(1-.3*national);
  // More grazing animals on the fäbodar add a little; organic farming and the national trend take some.
  const ghgAgri=B.ghg.agriculture*(1+.1*(s.fabodHa/B.fabodHa-1))*(1-.1*(s.regen-B.regen)/.5)*(1-.15*national);
  const ghgEnergy=B.ghg.energy*(1-.5*national);
  const ghgIndustry=B.ghg.industry*(1-.2*national)*(1-.9*s.capture);
  const ghgOther=B.ghg.other*(1-.5*national)*(1-.2*I.effektivitet);
  const ghg=Math.max(0,ghgTransport+ghgAgri+ghgEnergy+ghgIndustry+ghgOther);
  // The consumption footprint (Sweden's 7.6 t – governance_e13): food, things, cars and long journeys.
  const ghgCons=Math.max(.5,B.ghgCons*(1-.35*national)-(s.diet-B.diet)/.3-.7*I.effektivitet-.7*(B.carShare-s.carShare)/.35-.2*I.bogemenskap-.2*I.forbindelser);

  // --- Siljan's high water and the cloudbursts ------------------------------------------------------
  s.protection=lag(s.protection,F.streets+F.protectGain*I.anpassning,4);
  const floodMargin=s.protection-level100;
  const floodShare=level100>s.protection?flooded(level100):0;
  const floodRisk=clamp(sig(-floodMargin/.18));
  const heritage=clamp(s.heritage-PARAMS.heritageCost*I.anpassning);
  // A cloudburst like Storm Hans (about 150 houses in 2023) grows with the rain: short cloudbursts +20 %
  // (RCP4.5) to +40 % (RCP8.5) by 2071–2100 (base:skyfall_klimatfaktor_2071_2100_rcp85), the damage roughly with
  // its square (antagande). Rain gardens and flood meadows (mobility_e15, mobility_e16), depaved streets,
  // planted verges and rewetted mires upstream take the edge off.
  const rain=1+.37*stress;
  const cloudburstHomes=B.cloudburstHomes*rain*rain*(1-.5*I.anpassning-.12*depave-.06*I.skog-.05*verges);

  // --- Drinking water ---------------------------------------------------------------------------------
  const waterDemand=(s.pop/B.pop)*(1+WA.growth*clamp(t/WA.growthYears))*(1-.12*I.effektivitet);
  const secondSource=WA.second*Math.pow(I.beredskap,1.6);
  const waterDry=(1+B.waterMargin)*(1+(V.waterSupply-1)*soon)*(1-WA.climateLoss*stress)+secondSource+.05*I.beredskap+.04*I.skog+.03*I.anpassning;
  const waterMargin=waterDry/waterDemand-1,dryYears=WA.dryYears*(1+1.5*stress);
  const restrictions=dryYears*clamp((.05-waterMargin)/.2),restrictionFree=1-restrictions;
  s.water=lag(s.water,clamp(.5*clamp((waterMargin+.1)/.5)+.25*clamp(secondSource/.3)+.25*restrictionFree),2);

  // --- Health and the old --------------------------------------------------------------------------------
  s.activity=lag(s.activity,clamp(B.activity+.08*I.forebyggande+.05*I.kollektivt+.04*I.bilfritt+.04*I.turism+.03*I.skog-.03*stress),4);
  const digitalIsolation=.04*I.ai*(1-I.analog)+.03*(s.digitalDependence-.85);
  // (The villages' councils and budgets are one more place to meet: a small part of what homes, care and
  // the analogue do – antagande.)
  s.lowParticipation=lag(s.lowParticipation,clamp(B.lowParticipation+driftLonely*(1-.6*Math.max(I.bogemenskap,.5*I.demokrati))
    -.08*I.bogemenskap-.04*I.demokrati-.04*I.forebyggande-.03*I.analog-.02*depave-.02*I.kunskap+digitalIsolation,.06,.6),5);
  // Half of the old with home care are troubled by loneliness (52.7 %): generation houses and neighbours,
  // visits that prevent rather than react, meeting places in the villages and transport to them lower it
  // (community_e9: 17 % against 36 % often lonely where activities are daily); remote supervision replacing
  // visits raises it unless a person still comes (rattvik_e5); stretched care leaves less time per visit.
  s.elderLonely=lag(s.elderLonely,clamp(B.elderLonely+driftElder*(1-.5*Math.max(I.bogemenskap,I.forebyggande))
    -.1*I.bogemenskap-.06*I.forebyggande-.02*I.kollektivt-.02*I.analog+.06*I.ai*(1-I.analog)+.15*Math.max(0,1-s.welfare),.2,.8),5);
  s.youthScreen=lag(s.youthScreen,clamp(B.youthScreen-.5*I.analog+.06*I.ai*(1-I.analog)),4);
  s.distress=lag(s.distress,clamp(B.distress-.02*I.analog-.04*(B.lowParticipation-s.lowParticipation)/.3+.03*(s.gini-B.gini)/.05+.015*stress-.01*I.forebyggande,.03),4);
  // Life expectancy: SCB's trend, more exercise and company, preventive care; heat weighs on an old town
  // (deaths +10 % a day at 26 °C three days running – base:dodlighetsokning_varme_26c), less where it is green.
  const lifeTrend=B.lifeExp+PARAMS.lifeGain*V.life*(1-Math.exp(-t/PARAMS.lifeYears));
  const lifeTarget=lifeTrend+I.forebyggande+.5*I.ai*(.5+.5*s.aiGovernance)+4*(s.activity-B.activity)+2.5*(B.lowParticipation-s.lowParticipation)
    +1.5*(B.elderLonely-s.elderLonely)+.3*(s.welfare-1)-1.5*stress*(s.share80/B.share80)*(1-.4*nature)*(1-.3*I.forebyggande);
  // (The trend is followed as it comes; what the levers, heat and loneliness add or take settles over six years.)
  s.lifeDev=lag(s.lifeDev,lifeTarget-lifeTrend,6)-s.lifeShock;s.lifeShock*=.4;
  s.lifeExp=lifeTrend+s.lifeDev;
  const lifeExcess=s.lifeDev;
  s.selfHealth=lag(s.selfHealth,clamp(B.selfHealth+.5*(s.activity-B.activity)+.25*(B.lowParticipation-s.lowParticipation)-.3*(s.distress-B.distress)+.04*(nature-nature0)),4);

  // --- Society ----------------------------------------------------------------------------------------
  s.aiCapacity=lag(s.aiCapacity,aiGlobal*(.3+.7*I.ai),3);
  // The EU AI Act's high-risk rules (2027), village democracy, an analogue reserve – and AI the kommuner of
  // Dalarna own together, as they already own their water and waste company.
  s.aiGovernance=lag(s.aiGovernance,clamp(.2+.05*clamp((year-2026)/2)+.25*I.demokrati+.25*I.analog+.15*I.ai),5);
  // The young who think they can make themselves heard in the kommun (22 %; Dalarna 16 %): village budgets,
  // citizens' assemblies and a youth council with a veto; school as a living lab. At most about as many as
  // want to have a say – 42.5 % of Sweden's 16–25-year-olds (rattvik_e17): a radical youth democracy
  // doubles today's share (antagande).
  s.youthVoice=lag(s.youthVoice,clamp(B.youthVoice+.2*I.demokrati+.03*I.kunskap,.05,.5),5);
  s.gini=lag(s.gini,clamp(B.gini-.012*I.bogemenskap-.01*I.demokrati+.03*Math.max(0,s.aiCapacity-AI0)*(1-s.aiGovernance)+.01*stress,.18,.45),8);
  // Trust in other people (73 %; Sweden 70 %). A say in the decisions mostly makes the decisions legitimate –
  // and only where what people propose is carried out (rattvik_e18): that is the resistance it takes away
  // above; it holds back the slow drift a little and adds little to trust in each other (antagande).
  s.trust=lag(s.trust,clamp(B.trust+driftTrust*(1-.5*I.demokrati)+.03*I.demokrati+.05*I.bogemenskap+.03*I.forebyggande-1.2*(s.gini-B.gini)-.12*Math.max(0,load-1)-resistance+s.eventMood,
    Math.min(.3,.7*B.trust),.88),6);
  s.eventMood*=.6;
  // Generation houses and other shared housing (none in Rättvik today; Tersen in Falun the only one in
  // Dalarna; Persborg is planned as an eco-village for living across generations).
  s.cohousing=lag(s.cohousing,B.cohousing+.25*I.bogemenskap,8);
  // Classic Car Week brings a fifth of the year's reported crimes; a centre without its cruising, and trust.
  s.unsafe=lag(s.unsafe,clamp(B.unsafe-.03*I.bilfritt-.3*(s.trust-B.trust)-.02*I.bogemenskap,.04),5);
  s.education=lag(s.education,clamp(B.education+.06*I.kunskap+.05*I.analog+.03*I.ai*(.5+.5*I.analog)),6);
  // Post-secondary education (34 %; Dalarna 38 %, Sweden 48.5 %): the gap narrows slowly on its own
  // (antagande); a learning centre for distance studies and the natural resource programme as a living lab.
  s.higherEd=lag(s.higherEd,clamp(B.higherEd+.07*(1-Math.exp(-t/40))+.1*I.kunskap+.03*I.forbindelser+.02*I.bogemenskap,.2,.7),8);
  s.digitalDependence=lag(s.digitalDependence,clamp(.85+.12*s.aiCapacity-.38*I.analog),5);
  s.analogResilience=lag(s.analogResilience,clamp(.2+.62*I.analog+.12*I.beredskap),5);
  s.homePrepared=lag(s.homePrepared,clamp(B.homePrepared+.35*I.beredskap+.05*I.demokrati+.08*(s.analogResilience-.2)+.05*(s.trust-B.trust)),5);
  // Welfare: the money and the hands to care and teach (index, 2026 = 1). More old and young per working-age
  // resident (SCB: 1.09 → 1.20 by 2060) is the big pressure – elderly care must grow from 2.7 to 3.6 % of GDP
  // by 2040 to keep today's coverage (rattvik_e4). Prevention postpones care (322 extra home-care hours after
  // a serious fall – rattvik_e4); welfare technology helps less than hoped (rattvik_e5); local training of
  // assistant nurses and teachers, neighbours who help, wind revenues and visitors' spending add a little;
  // rural public transport, reserves and double systems cost (sizes antagande).
  const depNow=(s.share0_19+s.share65)/Math.max(.2,1-s.share0_19-s.share65);
  s.welfare=lag(s.welfare,clamp(1-.9*(depNow-DEP0)+.1*(s.pop/s.popTrend-1)+.06*(s.aiCapacity-AI0)/.88*(.5+.5*s.aiGovernance)+.04*I.forebyggande+.03*I.kunskap
    +.02*I.bogemenskap+.02*I.vind+.015*I.turism+.01*I.effektivitet-.02*I.kollektivt-.015*I.beredskap-.01*I.analog-.05*Math.max(0,load-1)-s.damage,.5,1.5),10);
  s.damage*=.75;
  const unemployment=clamp(B.unemployment+.012*Math.max(0,s.aiCapacity-AI0)*(1-.5*I.kunskap)-.005*I.turism-.005*I.vind-.004*I.regionalt-.003*I.effektivitet-.003*I.kunskap+.002*I.skog,.015,.12);
  // (Energy communities with batteries can keep the most important loads running in island mode.)
  const preparedness=clamp(.3*s.homePrepared+.2*clamp(s.foodStockDays/90)+.2*s.water+.15*clamp(localEnergy)+.15*s.analogResilience+.04*I.sol);
  // Young people who think they will move away (63 %): for work (54 %) and studies (37 %). Studies at a
  // distance, jobs in tourism, energy and food, homes for the young and a train to Borlänge and Falun keep
  // some; fewer services push (sizes antagande; some will always leave to study).
  s.youthLeave=lag(s.youthLeave,clamp(B.youthLeave+.02*(1-Math.exp(-t/20))-.08*I.kunskap-.05*I.bogemenskap-.04*I.forbindelser-.03*I.turism
    -.025*I.vind-.02*I.regionalt-.02*I.kollektivt-.3*(s.welfare-1)+(unemployment-B.unemployment),.35,.85),5);

  // --- People: born, dying and moving in ------------------------------------------------------------
  // Attractiveness relative to today: homes for the young and the old, work, services in the villages, the
  // train and the buses, nature, company and trust, against floods and cloudbursts (weights antagande).
  const attractDev=.25*I.bogemenskap+.12*(s.tourismJobs/B.tourismJobs-1)+2*(B.unemployment-unemployment)+.04*I.vind
    +.6*(s.welfare-1)+.05*I.forebyggande+.06*I.kunskap+.15*(B.railMain-railMain)/.75+.08*(s.transitGood-B.transitGood)/.4
    +.15*(nature-nature0)+.1*(B.lowParticipation-s.lowParticipation)/.2+.05*(s.trust-B.trust)/.2+.04*I.bilfritt+.03*I.hav
    -.1*(floodRisk-.16)-.05*(cloudburstHomes/B.cloudburstHomes-1)+.02*s.boatLines;
  // SCB's path already holds today's course and its slow decline of services: only the departure from that
  // course moves people (attractRef: today's course's own attractiveness in the middle world, calibrated).
  const attractRef=path([[2026,0],[2030,.013],[2040,.002],[2050,-.023],[2070,-.065],[2100,-.071],[2126,-.093]],year);
  // The index (0–1, 0.74 today) follows the departure from today at half its pace near today's value and
  // approaches 1 without reaching it, so the visions stay apart (a logistic; antagande).
  const attract=sig(Math.log(.74/.26)+attractDev/.385);
  const trend80=path(PARAMS.share80Path,year);
  const gTrend=popAt(year+1)/popAt(year)-1,trendBirths=birthRate(t)*s.popTrend,trendDeaths=deathRate(trend80,0)*s.popTrend;
  const migrationTrend=gTrend-(birthRate(t)-deathRate(trend80,0));
  // The size Rättvik's homes, work and services hold above (or below) SCB's path: its attractiveness – which
  // saturates – a warmer Europe's pressure, and how far the uncertainty runs put migration from SCB's
  // assumption (growth). People move in or on until the town has that size (PARAMS.premiumMax).
  const premium=PARAMS.premiumMax*V.pull*Math.tanh((attractDev-attractRef)/.4)
    +PARAMS.climatePremium*W.stress*clamp((year-2045)/40)+.2*(V.growth-1)*clamp(t/60);
  // The people above (or below) SCB's path are tracked in three groups that age and die: those who move in
  // (or on) and their children – mostly of working age (85 %), passing 65 after about 45 years on average, the
  // old among them dying at about 5 % a year – and those who live longer than the trend, who are old and die
  // at about 7 % a year (that keeps the gain near births and arrivals times the years gained). Migration fills
  // the gap between the size Rättvik holds and the movers already here; longer lives come on top (antagande).
  const pull=clamp((premium*s.popTrend-(s.devY+s.devO))/PARAMS.migYears,-PARAMS.migCap*s.pop,PARAMS.migCap*s.pop);
  const births=birthRate(t)*(s.popTrend+1.3*s.devY);
  const deaths=deathRate(trend80,lifeExcess)*s.popTrend+.05*s.devO+.002*s.devY+.07*s.devL;
  // (The trend's migration belongs to the projected population; the pull is what moves on top of it.)
  const netMigration=s.popTrend*migrationTrend+pull;
  if(!held){
    const birthDev=births-trendBirths,longer=trendDeaths-deathRate(trend80,lifeExcess)*s.popTrend;
    const toOld=.022*s.devY;
    s.devY+=.85*pull+birthDev-.002*s.devY-toOld;
    s.devO+=.15*pull+toOld-.05*s.devO;
    s.devL+=longer-.07*s.devL;
    s.popTrend*=1+gTrend;s.pop=s.popTrend+s.devY+s.devO+s.devL;
  }
  // The age structure: SCB's, with the people above or below its path (most of those who live longer are 80+).
  s.share65=clamp((path(PARAMS.share65Path,year)*s.popTrend+s.devO+s.devL)/s.pop,.15,.6);
  s.share80=clamp((trend80*s.popTrend+.3*s.devO+.75*s.devL)/s.pop,.04,.35);
  s.share0_19=clamp((path(PARAMS.share0_19Path,year)*s.popTrend+.3*s.devY)/s.pop,.08,.35);
  const depRatio=(s.share0_19+s.share65)/Math.max(.2,1-s.share0_19-s.share65);

  // --- Events -------------------------------------------------------------------------------------------
  // The events read the year's own figures too (cloudburst houses, the water margin, the power the bygd owns).
  c.events({s,I,year,seaRise,level100,flooded,floodMargin,floodRisk,stress,localEnergy,preparedness,nature,W,cloudburstHomes,waterMargin,localOwned});
  // People an event brings (or takes) join the movers above SCB's path, mostly young families – and, as with
  // any move, the size the town holds decides how many stay.
  {const moved=s.pop-(s.popTrend+s.devY+s.devO+s.devL);if(moved){s.devY+=.85*moved;s.devO+=.15*moved;}}

  // --- Visitors (base:gastnatter, research/deep/turism-ekonomi) ---------------------------------------------
  // Two thirds of the nights are in June–August, more than half on campsites; winter (December–March) has
  // 26 164. Demand grows slowly with incomes (antagande, capped by beds and campsites); warmer summers draw
  // more to cool lakes and forests – northern Europe gains, most in the shoulder seasons (rattvik_e3:
  // antagande +2 % per degree) – while snow and ice fail (good ski days 90 → under 40 by 2100; ice 129 → 74
  // days): half of winter's nights depend on them (antagande). Year-round offers – the geopark, Siljansleden,
  // the fäbodar, culture – bring back the off-season lost since 2019 (−25 %) and more (antagande +45 %).
  // Classic Car Week (35 000 nights) loses part when its cruising leaves the centre, unless it is reshaped.
  const shock=1-s.visitShock;s.visitShock=0;
  const demandT=Math.min(1.25,Math.pow(1.004,t*V.tour)),warm=gwl-1.4;
  const summer0=B.guestNights*B.summerShare,shoulder0=B.guestNights-summer0-B.winterNights;
  const ccw=B.ccwNights*(1-.3*clamp((I.bilfritt-.3)/.4)*(1-.6*I.turism));
  // (A summer round Siljan by boat adds a little: antagande, rattvik_e21.)
  const summer=(summer0-B.ccwNights+ccw)*(1+.02*warm)*(1+.05*I.turism+.02*s.boatLines);
  const shoulder=shoulder0*(1+.02*warm)*(1+.45*I.turism);
  const winter=B.winterNights*(1-.5*clamp(stress)*(1-.5*I.turism))*(1+.3*I.turism);
  const guestNights=(summer+shoulder+winter)*demandT*(1-.1*(1-heritage))*shock;
  const summerShare=summer/(summer+shoulder+winter);
  s.guestNights=guestNights;
  // Year-round work is full-time work: the jobs grow a little faster than the nights (antagande).
  const tourismJobs=B.tourismJobs*Math.pow(guestNights/B.guestNights,.9)*(1+.1*I.turism);
  s.tourismJobs=tourismJobs;
  // 91.5 % of tourist trips to Dalarna are by car: trains every hour and packages without a car take a share,
  // and boats from the station's town to the villages round the lake a little more (antagande, rattvik_e21).
  const touristCar=clamp(B.touristCar-.3*I.forbindelser-.08*I.turism-.04*I.kollektivt-.04*s.boatLines,.45);
  s.touristCar=touristCar;
  // 39 kg CO₂e a guest night, 54 % of it the journey (base:utslapp_per_gastnatt, base:klimat_bilresa_100mil).
  const tourismCO2=guestNights*.039*(.54*(touristCar/B.touristCar)*(1-.6*ev)/(1-.6*B.evShare)*(1-.3*national)+.46*(1-.4*national));
  // People in the kommun on a July day: the second-home summer stays (2 980 homes, 83 % owned from elsewhere),
  // the visitors' part follows the nights; some second homes become homes with the train and new housing.
  const secondHomes=1-.1*I.forbindelser-.05*I.bogemenskap;
  const summerPeople=s.pop*(1+B.julyExtra*(.6*secondHomes+.4*guestNights/B.guestNights));
  // Electric boats: the national trend (4 % of motorboats today), sooner with the visitors' plan and the
  // villages' buses, and the summer boat lines, electric from the start (antagande).
  const boatBoost=Math.max(I.turism,I.kollektivt),bc=y=>sig((y-(2048-10*boatBoost))/6);
  const boatElectric=clamp(B.boatElectric+(.95-B.boatElectric)*Math.max(0,bc(year)-bc(START))/(1-bc(START))*(.6+.4*boatBoost)+.1*s.boatLines);

  // --- The built town, for the 3D view ------------------------------------------------------------------------
  s.solarRoof=clamp((s.solarMW-B.solarMW)/PARAMS.solarPotential);
  // Panels on the suitable roofs (many face north or are protected), green turf roofs where rain is held.
  build('roofs',clamp(.03+.6*s.solarRoof+.15*I.anpassning),.02);
  build('facade',clamp(.25*I.anpassning+.15*I.bilfritt),.012);
  // Berry bushes and fruit trees (apples grow in Dalarna's zone 4–5) in some of the parks and school yards.
  build('forest',clamp(.3*I.regionalt+.1*I.skog+.1*I.forebyggande),.02);
  build('lots',clamp(.45*I.regionalt*(.5+.5*I.bilfritt)+.15*I.bilfritt+.1*I.bogemenskap),.025);
  // New houses of two to four storeys (config.js housingFloors) on the car parks by Storgatan – five blocks,
  // some 60 homes – where Rättvik grows beyond its projection (about two people a home, a third of the new
  // homes in the centre: antagande) or builds homes for the young and the old (bogemenskap).
  build('housing',clamp((s.pop-s.popTrend)/360+.3*I.bogemenskap),.015);
  // Open channels for the cloudbursts down some of the converted streets.
  build('canalsBuilt',clamp(.5*I.anpassning),.03);
  if(s.depaved+s.verges+s.forest>.05)s.maturity+=(1-s.maturity)/30;

  return {
    pop:s.pop,share65:s.share65,share80:s.share80,share0_19:s.share0_19,depRatio,births,deaths,naturalChange:births-deaths,netMigration,attract,
    ghg,ghgTransport,ghgAgri,ghgIndustry,ghgCons,renewable,localEnergy,localOwned,elUse,solarMW:s.solarMW,windMW:s.windMW,capture:s.capture,
    carShare:s.carShare,transitShare:s.transitShare,activeShare,carsPer1000,evShare:ev,transitGood:s.transitGood,railMain,boatElectric,
    boatVillages:6*s.boatLines,
    fabodHa:s.fabodHa,grainHa:s.grainHa,regen:s.regen,diet:s.diet,foodRegional:s.foodRegional,foodStockDays:s.foodStockDays,
    waters:s.waters,troutAccess:s.troutAccess,bloom:0,protectedNature:s.protectedNature,biodiversity:s.biodiversity,greenShare:s.greenShare,canopy:s.canopy,depave,nature,
    seaRise,level100,protection:s.protection,floodMargin,floodRisk,floodShare,heritage,cloudburstHomes,
    water:s.water,waterMargin,waterDemand,restrictions,
    lifeExp:s.lifeExp,selfHealth:s.selfHealth,activity:s.activity,lowParticipation:s.lowParticipation,elderLonely:s.elderLonely,distress:s.distress,youthScreen:s.youthScreen,
    trust:s.trust,youthVoice:s.youthVoice,gini:s.gini,childPoverty:clamp(B.childPoverty*(s.gini/B.gini)*(1.1-.1*s.welfare)),unsafe:s.unsafe,cohousing:s.cohousing,
    education:s.education,higherEd:s.higherEd,youthLeave:s.youthLeave,unemployment,welfare:s.welfare,
    waste:B.waste*(1-.4*I.effektivitet),recycling:clamp(B.recycling+.4*I.effektivitet),
    digitalDependence:s.digitalDependence,analogResilience:s.analogResilience,aiCapacity:s.aiCapacity,aiGovernance:s.aiGovernance,homePrepared:s.homePrepared,preparedness,
    guestNights,summerShare,tourismJobs,touristCar,tourismCO2,summerPeople,
    capacity:c.capacity,demand:c.demand,strain:c.strain,stress,gwl,
  };
}

// 0–100 per goal: each blends Rättvik's own measures between a poor value and a sustainable level for Rättvik
// ([measure or a function of the measures, poor, goal]) or a fixed score.
export const SDG_PARTS={
  1:[['childPoverty',.2,.02],['gini',.35,.22]],                                                       // Ingen fattigdom
  2:[['foodRegional',.05,.5],['fabodHa',300,1200],['regen',.1,.8],['foodStockDays',0,90]],              // Ingen hunger: the bygd's own food
  3:[['lifeExp',80,92],['selfHealth',.55,.9],['elderLonely',.7,.2],['distress',.18,.04]],              // Hälsa
  4:[['education',.6,.95],['higherEd',.25,.55],['youthScreen',1,.3]],                                  // Utbildning
  5:[['welfare',.85,1.2],['cohousing',0,.25],55],                                                      // Jämställdhet: care that does not fall on daughters
  6:[['water',.2,.9],['waterMargin',-.1,.5],['waters',.2,1]],                                           // Vatten
  7:[['renewable',.5,1],[d=>Math.min(d.localEnergy,1.5),.4,1.2],['localOwned',0,.5]],                   // Energi: enough, and owned by the bygd
  8:[['unemployment',.1,.02],['welfare',.8,1.25],['tourismJobs',120,300],['youthLeave',.8,.35]],       // Arbete
  9:[['ghgIndustry',14,.5],['railMain',3.45,2.6],['transitGood',.2,.8],['preparedness',.2,.9]],        // Industri och infrastruktur: the lime works, the railway
  10:[['gini',.35,.2],['elderLonely',.7,.2],['transitGood',.2,.8]],                                      // Jämlikhet: income, age and the villages' access
  11:[['greenShare',.2,.6],['carShare',.7,.3],['floodRisk',1,0],['cloudburstHomes',300,30],['unsafe',.3,.05],['heritage',.5,1]],   // Hållbara samhällen
  12:[['ghgCons',8,1],['recycling',.3,.9],['tourismCO2',12000,2500]],                                   // Konsumtion
  13:[['ghg',18,1],['floodRisk',1,0],['cloudburstHomes',300,30],['preparedness',.2,.9]],               // Klimat
  14:[['waters',.2,1],['troutAccess',0,.4]],                                                             // Hav – here Siljan
  15:[['biodiversity',.2,.85],['protectedNature',0,.15],['fabodHa',300,1200],['canopy',.2,.45]],       // Ekosystem
  16:[['trust',.5,.85],['youthVoice',.1,.5],['unsafe',.3,.05]],                                          // Fred och institutioner: trust, a say (as many as want one), safety
  17:[['lowParticipation',.45,.12],['aiGovernance',.1,.9],['welfare',.85,1.2]],                          // Partnerskap: the associations and villages, AI owned together, the kommun's own means
};
// The doughnut (Raworth's dimensions, fixed by the chart): social shortfall 0–1 (0 = the foundation is met)
// and ecological overshoot (0 = inside the ceiling), from Rättvik's own measures.
export function doughnut(d){
  return {
    social:{
      food:clamp(1-d.foodRegional/.5)*.4+clamp(1-d.foodStockDays/90)*.3,
      health:clamp(clamp((88-d.lifeExp)/10)*.5+clamp(d.distress-.05)*2+clamp(d.elderLonely-.3)*.5),
      education:clamp(clamp(.95-d.education)+clamp(.5-d.higherEd)*.5),
      income:clamp(d.unemployment*4+d.childPoverty*2),
      peace:clamp(d.unsafe*1.5),voice:clamp(.6-d.youthVoice),equity:clamp((d.gini-.2)*4),
      // Care that cannot keep up falls on relatives, mostly women.
      gender:clamp((1.1-d.welfare)*1.2),housing:clamp(.25-.8*d.cohousing),
      networks:clamp(d.lowParticipation*1.6),energy:clamp(1-d.localEnergy)*.3,water:clamp(.8-d.water),
    },
    ecological:{
      climate:clamp(d.ghgCons/2.5-.4,0,2),acidification:clamp(d.ghgCons/6,0,1.5),chemical:clamp(.7-d.recycling*.8),
      // Siljan is nutrient-poor; the little nitrogen comes from the farms.
      nutrients:clamp(.15*(1-d.regen)),freshwater:clamp((1-d.water)*.6),
      land:clamp(.9-4*d.protectedNature-.3*d.regen),biodiversity:clamp(1-d.biodiversity*1.3,0,1.5),
      air:clamp(d.carShare*.8*(1-.8*d.evShare)),ozone:.05,
    },
  };
}
// What the 3D town shows – only what can happen in Rättvik: streets round the station and the square
// becoming gardens, food parks and greenhouses (heated by the district heating's surplus), berry bushes and
// fruit trees in the parks, the square's market and long tables, solar panels and green turf roofs (a Dalarna
// tradition), open channels for cloudbursts in the converted streets, new houses of two to four storeys where
// the town grows, electric boats and boat buses to the villages in summer, and on today's course more and
// older people, electric cars and drier summers.
// Not here: wing-sail ships, hydrofoils, mussel lines, floating homes on a regulated lake that freezes, a
// growing tower, wind turbines (they stand 35–50 km away) or algal blooms in a nutrient-poor lake.
export function vision(d,I,s){
  return {
    depave:d.depave,verge:s.verges,maturity:s.maturity,housing:s.housing,tower:0,canals:s.canalsBuilt,
    // Small boats on Rättviken – a few today, more tour and hire boats with the visitors' plan – and the
    // summer boat buses from Långbryggan towards Leksand and towards Vikarbyn and Mora (config.js boats.lines,
    // scaled by boatLines). No hydrofoils, no cargo ships.
    boats:clamp(.12+.25*I.turism+.1*s.boatLines),boatLines:s.boatLines,ships:0,ferries:0,floatVillage:0,floating:0,
    gardens:clamp(.3+.5*I.regionalt),greenhouses:clamp(.2+.6*I.regionalt),foodForest:s.forest,
    market:clamp(.15+.55*I.regionalt+.2*I.turism),community:clamp(.08+.45*I.bogemenskap+.3*I.demokrati+.15*I.forebyggande),
    roofCover:s.roofs,greenRatio:clamp(.2+.5*I.anpassning/(I.anpassning+s.solarRoof+.01)),facadeGreen:s.facade*(.5+.5*s.maturity),
    mussels:0,wind:0,wall:Math.max(0,s.protection-FLOOD.streets),seaRise:d.seaRise,
    // Clear and nutrient-poor: a little browner with heavier runoff in a warmer climate (antagande).
    waterClarity:clamp(.88+.04*I.hav-.1*d.stress*(1-.5*I.skog)),bloom:0,
    cars:clamp(d.carShare/BASE.carShare*(1-d.depave*.6)),parking:s.lots,bikes:clamp(.25+.75*d.activeShare/.5),pods:clamp(I.kollektivt*d.aiCapacity*.8),
    people:d.pop/BASE.pop,old:d.share65,old80:d.share80,ev:d.evShare,dry:clamp(.3*d.stress+1.4*d.restrictions),
  };
}
// The residents' everyday in the 3D town (site/src/residents.js), from Rättvik's measures: how much they care
// for one another across the ages (generation houses, and the visits and meetings of care close by); how much
// of the day the screens take; no algal blooms on the beach (none in 26 samples at Siljansbadet); loneliness
// among them all – the old with home care (52.7 % lonely) weighted by their share, the others by how few take
// part in anything (26.5 %); and a usual working week (Rättvik has no working-time lever).
// (Before the first year is computed the measures are empty: today's values stand in.)
export function residents(d,I){
  const v=k=>d[k]??BASE[k],old=v('share65');
  return {
    cohousing:clamp(1.6*v('cohousing')+.15*(I.forebyggande||0)),
    digital:d.digitalDependence??.85,
    bloom:0,
    lonely:clamp(old*v('elderLonely')+(1-old)*v('lowParticipation')),
    workday:.95,
  };
}
// What Rättvik's levers must do (site/test/model.test.mjs checks them by year 50, or `year`): a lever at
// `level` (3) moves a measure by at least `delta`; compare: every lever at one level against another.
export const EXPECT=[
  {lever:'hav',ind:'waters',delta:.1},
  {lever:'hav',ind:'troutAccess',delta:.1},
  {lever:'skog',ind:'protectedNature',delta:.04},
  {lever:'regionalt',ind:'fabodHa',delta:200},
  {lever:'regionalt',ind:'foodRegional',delta:.1},
  {lever:'vind',ind:'localEnergy',delta:.5},
  {lever:'vind',ind:'ghgIndustry',delta:-1},
  // The deal for the wind's power lets the lime works capture long before the emissions trading forces it.
  {lever:'vind',level:2,ind:'capture',year:14,delta:.4},
  {lever:'sol',ind:'solarMW',delta:30},
  {lever:'kollektivt',ind:'transitGood',delta:.15},
  {lever:'kollektivt',ind:'boatVillages',delta:3},
  {lever:'forbindelser',ind:'railMain',delta:-.3},
  {lever:'turism',ind:'summerShare',delta:-.03},
  {lever:'bogemenskap',ind:'elderLonely',delta:-.05},
  {lever:'forebyggande',ind:'lifeExp',delta:.5},
  {lever:'kunskap',ind:'higherEd',delta:.05},
  {lever:'kunskap',ind:'youthLeave',delta:-.03},
  {lever:'demokrati',ind:'youthVoice',delta:.15},
  {lever:'analog',ind:'youthScreen',delta:-.2},
  {lever:'ai',ind:'aiCapacity',delta:1e-6},
  // Remote supervision without a person who still comes leaves the old lonelier (rattvik_e5).
  {lever:'ai',ind:'elderLonely',delta:1e-6},
  {lever:'beredskap',ind:'waterMargin',delta:.1},
  {lever:'anpassning',ind:'floodRisk',delta:-1e-6},
  {lever:'anpassning',ind:'cloudburstHomes',delta:-20},
  {lever:'anpassning',ind:'heritage',delta:-1e-6},
  {compare:[3,1],year:12,ind:'trust',delta:-1e-6},
];
// The measures whose uncertainty band the tests check (besides the population): measured today, uncertain later.
export const BAND_CHECK=['trust','lifeExp','guestNights'];
