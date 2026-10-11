// Venezia 2126's own model for the engine's framework (site/src/model.js): Venice's levers (levers.js) acting
// on Venice's measures (indicators.js), one step a year. The place is the historic city (centro storico: the
// six sestieri and the Giudecca) – its people, homes, visitors, lagoon and stones, which the 3D model shows.
// Every starting value is a record in research/baseline.json (FACTS names it) or a marked assumption
// (antagande); every effect size cites Venice's research (research/deep/*-notes.md, the ve_* claims in
// research/evidence.json) or the engine's general research (site/research/vision-research.json), and says so
// where it is assumed. Where only the whole Comune di Venezia (with Mestre) is counted, the note says so.
// The century in five parts:
//  1. People and homes – the historic city's cohorts age, and three die for every one born; a home that stays a
//     home gets new Venetians, one lost to tourists or second homes does not (the housing balance).
//  2. Visitors – tourist beds and day-trippers against a carrying capacity of about 52 000 a day.
//  3. The sea – the tide's peaks against the walkways, MOSE's gates and the lagoon behind them.
//  4. The lagoon – salt marshes that drown when the sea outruns their sediment, and water that suffers when
//     the gates stay shut.
//  5. Energy and boats, heat and health, the stones, and the people's own say.
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const sig=x=>1/(1+Math.exp(-x));
const START=2026;

// Starting values, 2026 (the latest year measured).
export const BASE={
  // 47 625 residents at the end of 2025 (174 808 in 1951); 33.1 % are 65 or older, 12.2 % 80 or older,
  // 8.5 % under 15 and 12.8 % under 20. In 2025, 209 were born and 689 died; 1 631 moved in and 2 015 moved out.
  pop:47625,share65:.331,share80:.122,share0_14:.085,share0_19:.128,births:209,deaths:689,
  // 42 431 dwellings in the historic city, 37.4 % without a registered resident (census 2023); 26 499
  // households; 6 145 registered tourist apartments with 24 760 beds, and 25 447 beds in hotels and B&Bs
  // (OCIO's counter, September 2026: 50 207 tourist beds in all). About a thousand public homes in the lagoon
  // stand empty awaiting renovation; antagande: 800 of them in the historic city.
  dwellings:42431,households:26499,emptyHomes:.374,shortLetHomes:6145,touristBeds:50207,publicEmpty:800,
  // A home costs 4 332 €/m² in the historic city (OMI 2025) against 1 660 on the mainland.
  housePrice:4332,
  // Visitors: 9.38 million guest nights (2025, the Comune's "centro storico" with the lesser islands),
  // 61 461 day visitors on an average day (2022, mobile data) and 143 246 visitors on the busiest; a study
  // puts the city's carrying capacity at 52 111 visitors a day; 584 284 cruise passengers (2025).
  guestNights:9376638,dayVisitors:61461,peakDay:143246,cruisePassengers:584284,
  // The universities: 23 851 students at Ca' Foscari and IUAV, 1 000 student beds (ESU); 2 570 pupils in
  // the historic city's primary and middle schools; 18.1 % of the Comune's jobs in hotels and restaurants.
  students:23851,studentBeds:1000,pupils:2570,tourismJobs:.181,unemployment:.052,
  // MOSE: 156 closures in six seasons 2020/21–2025/26, 26 a season on average (49 in 2025/26); about 40 km²
  // of salt marsh left (158 km² in 1912); none of the lagoon's 11 water bodies in good ecological status
  // (waters: an index, 1 = all in good status; antagande 0.25 for "moderate to poor").
  moseClosures:26,saltMarsh:40,waters:.25,bloom:.25,
  // Rialto's fish market has 7 stalls (about thirty in the 1980s). Food from the lagoon and the Veneto: no
  // measure exists (antagande 15 %).
  fishStalls:7,foodRegional:.15,
  // CO₂ per resident in the Comune's Covenant of Mayors inventory (2016: 3.83 t): homes 1.38, services 1.68,
  // transport 0.68. The buildings' 3.06 t split by fuel (antagande): electricity is 46.5 % of the energy they
  // use and carried more CO₂ per kWh than gas in 2016 (about 0.32 against 0.20 t/MWh), so 1.71 t power, 1.35 t
  // heat; the rest (0.09 t) is public lighting and the like.
  ghg:{heat:1.35,power:1.71,transport:.68,other:.09},
  // 83.5 % of homes' energy was gas (2005; no newer count for the historic city); 17 % of the province's
  // electricity is renewable (2023); antagande 2 MW of the Comune's 59 MW of solar in the historic city,
  // where panels are banned on buildings from before 1945; 5 970 kWh of electricity per resident (Comune).
  gasHeat:.835,renewable:.17,solarMW:2,elUsePerCap:5.97,
  // Boats: one hybrid vaporetto of ACTV's 148 boats (2025); NO₂ 34 µg/m³ at Rio Novo, the boats' station
  // (2025; the EU limit from 2030 is 20).
  boatElectric:.01,no2:34,
  // Health: life expectancy 84.2 years in the province (2025, both sexes); 69.5 % have friends to count on and
  // 50.4 % feel safe walking alone after dark (Comune, 2024); heat-related deaths in the historic city: no
  // count exists (antagande 13 a year, from Italy's 295 per million in the hot summer of 2022 and Venice's
  // older people, in an ordinary summer).
  lifeExp:84.2,friends:.695,safe:.504,heatDeaths:13,
  // 95.1 % of the 244 bridges in the model's square have steps; shade on the campi: no measure (antagande 8 %).
  steppedBridges:.951,shade:.08,
  // Democracy: 55.9 % voted in the municipal election of May 2026; 33.3 % of the council are women.
  turnout:.559,womenCouncil:.333,
  // 26.7 % of the historic city's houses were in mediocre or poor condition (census 2011).
  poorCondition:.267,
  // Water: 41.7 % of the water fed into the Comune's pipes is lost (2022); the water-security index is an
  // assumption (0.65: deep wells on the mainland, salt creeping up the rivers in droughts).
  waterLoss:.417,water:.65,
  // The fastest train to Rome: 3 h 56 (no faster line is planned).
  railMain:3.93,
};
// The research record behind each starting value (research/baseline.json).
export const FACTS={
  pop:'soc_pop_cs_2025',share65:'soc_share_65plus_cs_2025',share80:'soc_share_80plus_cs_2025',share0_14:'soc_share_0_14_cs_2025',share0_19:'mod_andel_0_19_centro_storico_2025',
  births:'soc_births_cs_2025',deaths:'soc_deaths_cs_2025',dwellings:'soc_dwellings_unoccupied_cs_2023',households:'soc_households_cs_2025',
  emptyHomes:'soc_dwellings_unoccupied_cs_2023',shortLetHomes:'soc_tourist_rental_units_cs_2026',touristBeds:'soc_tourist_beds_cs_2026',
  publicEmpty:'mod_tomma_offentliga_bostader_2026',housePrice:'nt_bostadspris_centro_storico',
  guestNights:'tur_presenze_cs_2025',dayVisitors:'tur_dagsbesokare_per_dag_2022',peakDay:'tur_besokare_toppdag_2022',cruisePassengers:'en_kryssning_passagerare',
  students:'soc_university_students_2025',studentBeds:'soc_student_beds_esu',pupils:'soc_pupils_cs_primary_middle',
  tourismJobs:'tur_sysselsatta_hotell_restaurang_andel',unemployment:'nt_arbetsloshet_kommun',
  moseClosures:'mod_mose_stangningar_medel_2020_2026',saltMarsh:'lag_barene_idag',waters:'lag_wfd_ekologisk_status',
  fishStalls:'lag_rialto_fiskstand',
  'ghg.heat':'en_co2_per_inv_bostader','ghg.power':'en_co2_per_inv_tjanster','ghg.transport':'en_co2_per_inv_transporter','ghg.other':'en_co2_uppfoljning_2016',
  gasHeat:'en_bostader_naturgas_andel',renewable:'nt_fornybar_el_andel',solarMW:'en_solceller_effekt',elUsePerCap:'en_el_per_invanare',
  boatElectric:'en_actv_hybridfartyg',no2:'en_no2_rio_novo',
  lifeExp:'mod_medellivslangd_provinsen_2025',friends:'soc_friends_to_count_on_comune',safe:'soc_feel_safe_dark_comune',heatDeaths:'mod_varmedodsfall_uppskattning',
  steppedBridges:'en_broar_med_trappor_andel',turnout:'com_valdeltagande_2026',womenCouncil:'nt_kvinnor_kommunfullmaktige',
  poorCondition:'lag_byggnader_daligt_skick',waterLoss:'nt_vattenforluster',railMain:'en_tag_restid_roma',
};
// Starting values that are estimates rather than statistics vary ±20 % in the uncertainty runs.
export const BASE_UNCERTAIN=['foodRegional','publicEmpty','heatDeaths','shade','water'];

// The sea at Venice (research/deep/hav-tidvatten), in metres on the tide gauge's zero (ZMPS, Punta della
// Salute 1897): the mean level 0.353 m (2020–2025). The 100-year high water today is about 2.10 m (estimate).
// The share of the historic city's public walkways under water by level is the Comune's own table (2020):
// St Mark's Square floods from 0.80 m, 12 % of the walkways at 1.10 m, 59 % at 1.40 m. MOSE's 78 gates rise
// when a tide over 1.10 m is forecast (`closes`; the model moves it: s.barrierCloses) and hold the lagoon at
// about `inside` (s.barrierInside). `streets` is where the walkways begin to flood: the protection
// (s.protection) rises from it as the city defends and raises its insulae.
export const FLOOD={
  kind:'sea',high100:2.10,streets:.80,protectGain:.4,
  table:[[.8,.001],[.9,.02],[1.0,.05],[1.1,.12],[1.2,.28],[1.3,.46],[1.4,.59],[1.5,.70],[1.6,.77],[1.7,.82],[1.8,.85],[1.9,.88],[2.0,.91],[2.5,1]],
  barrier:{name:'MOSE',closes:1.10,inside:.9},
};
const MEAN0=.353;

// High-water peaks a year that rise more than x metres above the mean sea level. Anchored to the Comune's
// counts 1966–2021 on a mean of about 0.26 m (tides ≥ 80 cm: 70 a year; ≥ 110 cm: 5.2; ≥ 140 cm: one in 2.5
// years – mare_hogvatten_80_per_ar, mare_hogvatten_140_aterkomsttid), to Umgiesser (2020: with 50 cm more sea
// the gates close about once a day; ve_umgiesser_2020) and to the ~705 high waters of a semi-diurnal tide;
// log-linear between the anchors (antagande on the shape; beyond them the tail falls by e every 0.116 m).
const PEAKS=[[-.3,705],[0,690],[.25,365],[.54,70],[.84,5.2],[1.14,.4]];
function peaks(x){
  if(x<=PEAKS[0][0])return 705;
  for(let i=1;i<PEAKS.length;i++)if(x<=PEAKS[i][0]){const [a,u]=PEAKS[i-1],[b,v]=PEAKS[i];return Math.exp(Math.log(u)+(Math.log(v)-Math.log(u))*(x-a)/(b-a));}
  return .4*Math.exp(-(x-1.14)/.116);
}
// The Comune's flood table: the share of the walkways under water at a level (no defences).
const floodTable=x=>{const T=FLOOD.table;if(x<=T[0][0])return T[0][1]*clamp(1-(T[0][0]-x)/.3);for(let i=1;i<T.length;i++)if(x<=T[i][0]){const [a,u]=T[i-1],[b,v]=T[i];return u+(v-u)*(x-a)/(b-a);}return 1;};
// The share of the year the lagoon is shut, by the margin between the closing level and the mean sea (m):
// 3 % of the year in 2020, 7–11 % by 2050 with RCP8.5 (lag_mose_stangd_tid_2050), "on average more hours
// closed than open" with 75 cm more sea (Umgiesser 2020). A logistic through these points (antagande).
const closedShareAt=margin=>1/(1+Math.exp((margin-.037)/.204));

// The household side of the population (research/deep/samhalle-halsa, the Comune's flows for 2025): 2 015
// people moved out and 1 631 in. Antagande: a departing household has 1.9 people, so 1 060 households – 4 % of
// them – left; six in ten deaths free a home (55.9 % of households are one person, and most who die are over 80
// and live alone); with 26 499 households losing about 300 a year (31 221 in 2011), one freed home in five
// (0.204) left resident use – to tourists, second homes or decay – and the rest went to newcomers, 1.39 people
// a home (students and young singles, few families). Homes hold at most 2.0 people on average (Italy's
// households: 2.3, shrinking towards 2.1 by the 2040s) – beyond that the young move out. The homes the city
// renovates or buys for young couples and families hold 2.4 (antagande).
const H_OUT=1.9,DEATH_HOME=.6,DEPART_RATE=1060/26499,H_IN0=1.39,LEAK0=.204,HH_MAX=2.0,H_CITY=2.4;
// The cohorts: children 0–14, young adults 15–44, 45–64, 65–79 and 80+ (the Comune's age classes for the end of
// 2025: of the 27 806 aged 15–64, 13 138 – 47.25 % – are under 45; 2 054 of those are 15–19, about 15.6 %, the
// part of the 15–44 group that the under-20s (share0_19, for the residents' everyday) count, calibrated in init so
// that 2026 shows the measured 12.8 %). Each year the oldest fifth of a cohort's top five-year class moves up
// (EDGE: 10–14, 40–44, 60–64 and 75–79 in the same table) – the large 60–64 class is why the old will be more.
// Who moves (antagande): newcomers are mostly young adults; leavers are drawn from every age, most readily young
// adults and families, and old people moving to care or to children on the mainland (propensities relative to
// each age's numbers; the old's set so that the share 65+ rises about as ISTAT projects for the Comune – 28.7 %
// to 34.2 % in 2025–2040, 0.37 points a year – peaking near 37 % around 2040 on today's course).
const YOUNG_SHARE=13138/27806,EDGE={c:1659/5/4034,y:2361/5/13138,m:4124/5/14668,o:3179/5/9971},IN_AGE={y:.8,m:.14,o:.04,e:.02},OUT_W={c:1.3,y:1.6,m:.7,o:.25,e:.5};
// Mortality by age group before scaling (antagande, from Italian life tables; scaled so the measured 689
// deaths come out): 15–44 0.05 %, 45–64 0.35 %, 65–79 1.6 %, 80+ 10 % a year.
const MORT={y:.0005,m:.0035,o:.016,e:.10};
// Tourist apartments: +325 a year on today's course (OCIO: 5 040 in April 2023, 6 145 in September 2026),
// slowing as the market fills (antagande: a ceiling of 12 000, 28 % of the dwellings); hotels are capped
// (no new hotels since 2017). 4.03 beds an apartment (24 760 / 6 145).
const T_GROW=325,T_MAX=12000,BEDS_PER_APT=24760/6145,HOTEL_BEDS=25447;
const CAPACITY_VISITORS=52111;
// The model's own parameters, for the texts that cite them: the households, the leak of freed homes, the tourist
// apartments' ceiling, the carrying capacity, and the heritage that raising the walkways from 1.10 to 1.20 m can
// cost (past the 15–20 cm thresholds allow; antagande: at most 3 % of the heritage index).
export const PARAMS={hhMax:HH_MAX,leak0:LEAK0,departRate:DEPART_RATE,shortLetMax:T_MAX,capacityVisitors:CAPACITY_VISITORS,heritageCost:.03};

// The uncertainty this model varies besides the framework's (pace, reach, sea, surge, stress): how much life
// expectancy rises (life), how the world's tourist demand grows (demand), how readily freed homes leave
// resident use (leak), how much sediment the marshes catch (marsh), how fast Italy's power and heat
// decarbonise (national), and how fast society drifts apart on today's course (drift).
export const SYSTEM_SPREAD={pace:[.75,1.33],reach:[.8,1.2],life:[.6,1.4],demand:[.6,1.4],leak:[.75,1.25],marsh:[.7,1.3],national:[.7,1.4],drift:[.5,1.5],
  sea:[.7,1.45],surge:[-.07,.07],stress:[.75,1.25]};
export const VARY={life:1,demand:1,leak:1,marsh:1,national:1,drift:1};

export function init(B){
  const pop=B.pop,c=pop*B.share0_14,o=pop*(B.share65-B.share80),e=pop*B.share80,adults=pop-c-o-e,y=YOUNG_SHARE*adults,m=adults-y;
  // Mortality scaled so that 2026's deaths are the measured 689; fertility so that its births are 209.
  const raw=MORT.y*y+MORT.m*m+MORT.o*o+MORT.e*e;
  return {
    pop,c,y,m,o,e,share65:B.share65,share80:B.share80,mortScale:B.deaths/raw,fert:B.births/y,teens:(B.share0_19*pop-c)/y,
    H:B.households,T:B.shortLetHomes,PE:B.publicEmpty,studentBeds:B.studentBeds,
    protection:FLOOD.streets,uplift:0,barrierCloses:FLOOD.barrier.closes,barrierInside:FLOOD.barrier.inside,
    marsh:B.saltMarsh,waters:B.waters,seaLast:0,
    gasHeat:B.gasHeat,solarMW:B.solarMW,lifeExp:B.lifeExp,lifeShock:0,friends:B.friends,safe:B.safe,turnout:B.turnout,
    poor:B.poorCondition,heritage:1,shade:B.shade,stepped:B.steppedBridges,waterLoss:B.waterLoss,water:B.water,
    funds:1,damage:0,eventMood:0,visitShock:0,aiCapacity:.12,aiGovernance:.25,
    // Calibrations on the measured year: MOSE's 26 closures a season with the gates raised for forecasts over
    // 1.01 m (9 cm under the closing level), and the share of the electricity made by the city's own sun.
    kClose:B.moseClosures/peaks(FLOOD.barrier.closes-.09-MEAN0),local0:B.solarMW*1.2/(B.pop*B.elUsePerCap/1000),
  };
}

// The city's shared capacity for change: its people (fewer residents carry less), its ties (friends to count
// on), its democracy (turnout) and its money (what its visitors pay in tax and fees, less the damage of floods and
// crises).
export const capacity=s=>10*(.75+.25*clamp(s.pop/BASE.pop,.4,1.6))*(.7+.43*s.friends)*(.85+.27*s.turnout)*s.funds;

export function step(c){
  const {s,I,before,B,V,W,year,t,held,stress,seaRise,level100,load,flooded}=c;
  const lag=(x,target,tau)=>held?x:x+(target-x)*(1-Math.exp(-1/Math.max(.5,tau)));
  // Italy's and the EU's own course: a decarbonising grid and gas boilers phased out (the EU buildings directive
  // of 2024: fossil boilers out by 2040) – slower in a heritage city with no room for outdoor units (antagande).
  const national=clamp(t/(30*V.national));

  // --- The sea, MOSE and the walkways ------------------------------------------------------------------------
  // Leva med vattnet (anpassning) raises the protection of the lowest walkways: the insula of San Marco and the
  // lowest quays tight to 1.10 m (the state's target, mare_rialhojning_malniva), then walkways raised towards
  // 1.20 m where thresholds allow (at most 15–20 cm in practice, lag_hojning_max_cm) and ground floors made for
  // the water. On today's course the San Marco works, under way since 2019, finish slowly (antagande: 0.90 m by
  // about 2046). Raising takes years (τ 8).
  const protTarget=FLOOD.streets+.1*clamp(t/20)+.2*clamp(I.anpassning/.33)+.1*clamp((I.anpassning-.33)/.34);
  const pBefore=s.protection;
  s.protection=lag(s.protection,Math.max(s.protection,protTarget),8);
  const P=s.protection;
  // At the radical level the whole city is lifted by pumping seawater into an aquifer 600–800 m below the
  // lagoon: 25–30 cm in ten years in the models (ve_teatini_2011) – antagande: 0.28 m, begun as the level is
  // reached, τ 5 years. Only the city rises, not the lagoon and its marshes.
  s.uplift=lag(s.uplift,.28*clamp((I.anpassning-.67)/.33),5);
  const seaCity=seaRise-s.uplift,ML=MEAN0+seaCity,L100=level100-s.uplift;
  // Lagunens portar (mose): the gates close when the city would flood – at 1.10 m, or at the raised walkways'
  // level once the city has raised them – or earlier by choice: from 1.00 m to keep St Mark's dry (level 1), at
  // every tide over 0.90 m with locks for the ships (level 2, a regulated lagoon). At level 3 the inlets are shut
  // for good and the lagoon is held with pumps (permanent, 0–1).
  const cCity=Math.max(FLOOD.barrier.closes,P),permanent=clamp((I.mose-.67)/.33);
  const C=cCity-(cCity-.9)*clamp(I.mose/.67);
  // Closures a year: the peaks the gates are raised for – forecasts within 9 cm of the closing level today; sharper
  // forecasts (ai) narrow that margin to 4 cm (antagande; raising the gates hours before the peak damps it best,
  // ve_alberti_2023) – at most one a day as closures merge.
  const margin=.09-.05*I.ai,raised=m=>Math.min(365,s.kClose*peaks(C-m-ML));
  const closures=raised(margin)*(1-permanent)+365*permanent;
  // The share of the year shut (1 when closed for good): today's operation (357 hours in 2020, lag_mose_stangd_tid_2050),
  // less what sharper forecasts spare – the closures for tides that stay under the closing level, the shortest ones
  // (antagande: half an average closure each) – and a part of every closure as the gates rise closer to the peak and
  // open sooner after it (antagande: up to 15 %, less as closures run into one another).
  const shut0=closedShareAt(C-ML),spared=1-raised(margin)/Math.max(1e-9,raised(.09));
  const shut=permanent+(1-permanent)*shut0*(1-.5*spared)*(1-.15*I.ai*(1-shut0));
  // The lagoon behind closed gates: held at about 0.80 m when they shut, creeping up with rain, rivers and leaks
  // the longer they stay shut and once the sea passes the 60 cm the gates were built for (antagande, after
  // Ferrarin et al. 2024 and Umgiesser 2020); pumped down to 0.50 m when the lagoon is closed for good.
  const lagoonHeld=(.8+.25*shut+.4*Math.max(0,seaRise-.6))*(1-permanent)+(.5+.3*Math.max(0,seaRise-.6))*permanent-s.uplift;
  s.barrierCloses=C;s.barrierInside=lagoonHeld+.05;
  // The lagoon's mean level seen from the city: the sea's, held down only while the gates are shut.
  const lagoonMean=ML-shut*Math.max(0,ML-(lagoonHeld-.2));
  // Water on St Mark's Square (the lowest walkways): the tides that reach the protection while the gates are
  // open, the closures when the lagoon is held above it, and every tide once the lagoon's mean stands above it.
  const openFloods=Math.max(0,peaks(P-ML)-peaks(C-margin-ML))*(1-shut);
  const stMarksFloods=Math.min(705,openFloods+closures*clamp((lagoonHeld-P)/.1)+705*clamp((lagoonMean-P)/.1));
  // A 100-year storm: the gates shut and the city sees the lagoon held behind them (plus the storm's set-up).
  const inside=L100>C||permanent>.5?Math.min(L100,lagoonHeld+.05):L100;
  const floodShare=inside>P?floodTable(inside):0;
  // The flood risk: half the 100-year storm against the protection, half how often the stones are wet.
  const floodRisk=clamp(.5*sig((inside-P)/.1)+.5*clamp(Math.log(1+stMarksFloods)/Math.log(361)));

  // --- People and homes ------------------------------------------------------------------------------------
  // Visitors, prices and floods are last year's – they push people out before the year's homes are counted.
  const crowd0=(B.dayVisitors+B.guestNights/365)/B.pop,crowdNow=s.visitorsPerResident??crowd0;
  const price=s.price??B.housePrice,floods0=s.floods0??stMarksFloods,floodsNow=s.floods??stMarksFloods;s.floods0=floods0;
  // Departures (households a year): crowding pushes residents out (antagande, after Baldin, Bertocchi and
  // Camatti 2025 on visitors crowding residents out), prices (60.3 % of those who left named them, COSES 2009,
  // ve_coses_2009), water in the ground floors (35.1 % of those who left in 1964–68 had lived on regularly
  // flooded ground floors, CENSIS 1973); care close to home and step-free bridges keep the old (antagande −25 %),
  // jobs beyond tourism the young (graduates leave the province at 11.3 per 1 000 a year; antagande −15 %).
  const depart=DEPART_RATE*s.H*Math.pow(crowdNow/crowd0,.3)*Math.pow(price/B.housePrice,.5)*clamp(1+.15*(floodsNow/floods0-1),.8,2)
    *(1-.25*I.forebyggande)*(1-.15*I.kunskap)*(1-.05*I.ai*(.5+.5*s.aiGovernance));   // care at a distance (antagande)
  // The leak: the share of freed homes that leave resident use. Tourist demand pulls them (less as the market
  // fills); a cap on short lets (korttid) closes most of that door (Venice's own power, art. 37-bis DL 50/2022;
  // New York's law of 2023 removed 85–92 % of the listings, ve_nyc_ll18); the housing fund's right of first refusal
  // and leases for residents (bogemenskap from level two: `fund`) keep others; regularly flooded ground floors are
  // given up (antagande). Level one only renovates the empty public homes (below).
  const nonRes0=(B.dwellings-B.households)/B.dwellings,nonRes=(B.dwellings-s.H)/B.dwellings;
  const fill=clamp((.75-nonRes)/(.75-nonRes0),0,1.5),fund=clamp((I.bogemenskap-.33)/.67);
  const leak=LEAK0*V.leak*fill*(1-.7*I.korttid)*(1-.5*fund)*clamp(1+.1*(floodsNow/floods0-1),.8,1.6);
  // Newcomers' households: the homes the city renovates or buys go to young couples and families (antagande 2.4 people
  // a home); rents that ordinary wages cover (level three) bring more families to the rest too (antagande +0.3).
  const hIn=H_IN0+.3*clamp((I.bogemenskap-.67)/.33);
  // Homes added for residents: empty public homes renovated (about 800 in the historic city; 40 a year at level
  // 1, 120 at level 3 – the Piano Casa had 17.5 M€ for 2026 but 3.9 M€ a year after, ve_piano_casa_2026, and ATER
  // renovates 34 a year while 150 are handed back: on today's course they keep piling up, antagande +25 a year, up
  // to about half the public stock),
  // homes bought or leased for residents by a housing fund fed by the tourist tax and the access fee (levels 2–3,
  // up to 150 a year with today's 40 M€ from the visitors – 38.7 M€ of tourist tax at about 300 000 € a home,
  // antagande – more or fewer as the visitors pay more or less, while more than an eighth of the dwellings are second
  // homes or empty), and tourist apartments returned under a cap.
  const renov=held?0:Math.min(s.PE,120*I.bogemenskap);
  const peGrow=held?0:25*(1-clamp(I.bogemenskap*3))*clamp(1-s.PE/2500);
  const buy=held?0:150*fund*(s.money??1)*clamp((B.dwellings-s.H-s.T-s.PE-.12*B.dwellings)/2000);
  // Tourist apartments: grow with the world's demand on today's course; a cap stops new ones and returns the
  // rest towards the quota (level 1: a 120-night limit, a quarter fewer; level 3: only rooms in the owner's own
  // home, nine in ten fewer), τ 6 years as licences lapse (antagande); seven in ten of the returned apartments
  // go to people who live here (antagande: 81 % of those who would come back would do so if homes were
  // affordable, COSES 2009), the rest to second homes and the empty.
  const demandT=1+.25*V.demand*(1-Math.exp(-t/30));
  const tGrow=held?0:T_GROW*clamp((T_MAX-s.T)/(T_MAX-B.shortLetHomes))*Math.sqrt(demandT)*(1-clamp(I.korttid*3));
  const tTarget=B.shortLetHomes*(1-.9*I.korttid);
  const tBack=held?0:Math.max(0,s.T-tTarget)*(1-Math.exp(-1/6))*clamp(I.korttid*3);
  const toResidents=.7*tBack;
  // Student beds: a city campus (kunskap) builds them (antagande up to 5 000; 200 empty ATER homes already went
  // to IUAV); one bed in two holds a registered resident.
  const studentNew=held?0:Math.max(0,1000+4000*I.kunskap-s.studentBeds)*(1-Math.exp(-1/6));
  // The year's people: a year more of life expectancy lowers mortality about 9 % at every age (Gompertz);
  // families who get a home of their own have more children (antagande +15 % with the housing fund at level 3).
  const mort=s.mortScale*Math.exp(-.09*(s.lifeExp-B.lifeExp));
  const dead={y:mort*MORT.y*s.y,m:mort*MORT.m*s.m,o:mort*MORT.o*s.o,e:mort*MORT.e*s.e};
  const deaths=dead.y+dead.m+dead.o+dead.e;
  const births=s.fert*s.y*(1+.15*fund);
  const freed=DEATH_HOME*deaths+depart,newHomes=renov+buy+toResidents,marketHomes=freed*(1-leak)+toResidents;
  // Leavers: the departing households (1.9 people where households are 1.8) and the young who find no room once
  // homes are full (half the excess a year).
  const crowdedOut=Math.max(0,s.pop-HH_MAX*s.H)*.5;
  const arrivals=marketHomes*hIn+(renov+buy)*H_CITY+.5*studentNew,leavers=depart*H_OUT*(s.pop/s.H)/1.8+crowdedOut;
  // Children among the newcomers: more with family homes (the larger households).
  const kidsIn=clamp((arrivals/Math.max(1,marketHomes+renov+buy+.5*studentNew)-1.2)/2.5);
  if(!held){
    const age={c:s.c*EDGE.c,y:s.y*EDGE.y,m:s.m*EDGE.m,o:s.o*EDGE.o},adultsIn=arrivals*(1-kidsIn);
    const w={c:OUT_W.c*s.c,y:OUT_W.y*s.y,m:OUT_W.m*s.m,o:OUT_W.o*s.o,e:OUT_W.e*s.e},wSum=w.c+w.y+w.m+w.o+w.e||1,out=k=>Math.min(.5*s[k],leavers*w[k]/wSum);
    const oc=out('c'),oy=out('y'),om=out('m'),oo=out('o'),oe=out('e');
    s.c=Math.max(0,s.c+births-age.c+arrivals*kidsIn-oc);
    s.y=Math.max(0,s.y+age.c-age.y-dead.y+adultsIn*IN_AGE.y-oy);
    s.m=Math.max(0,s.m+age.y-age.m-dead.m+adultsIn*IN_AGE.m-om);
    s.o=Math.max(0,s.o+age.m-age.o-dead.o+adultsIn*IN_AGE.o-oo);
    s.e=Math.max(0,s.e+age.o-dead.e+adultsIn*IN_AGE.e-oe);
    s.H=clamp(s.H-leak*freed+newHomes,5000,.92*B.dwellings);
    s.T=Math.max(0,s.T+tGrow-tBack);
    s.PE=Math.max(0,s.PE-renov+peGrow);
    s.studentBeds+=studentNew;
  }
  s.pop=s.c+s.y+s.m+s.o+s.e;
  s.share65=(s.o+s.e)/s.pop;s.share80=s.e/s.pop;
  const emptyHomes=clamp(B.emptyHomes+(B.households-s.H)/B.dwellings,.02,.95);
  const touristBeds=HOTEL_BEDS+s.T*BEDS_PER_APT;
  // Prices: today's slow rise (antagande +0.4 % a year for 60 years), tourist apartments (in Barcelona Airbnb
  // raised rents 1.9 % on average and 7 % where it was densest, ve_garcia_lopez_2020; Venice's 14.5 % of the
  // dwellings let to tourists is denser still – antagande: 1 % of the price per percentage point of the
  // dwellings), and homes the housing fund holds for residents (antagande −15 % at level 3).
  s.price=B.housePrice*(1+.004*Math.min(t,60))*(1+(s.T-B.shortLetHomes)/B.dwellings)*(1-.15*fund);

  // --- Visitors --------------------------------------------------------------------------------------------
  // The world's demand grows and levels off (demandT: antagande +25 % by about 2090, varied ±40 %); a sea in the
  // streets, a stinking lagoon and decaying stones keep some away; a shock (a pandemic) empties the city a year.
  const shock=1-s.visitShock;s.visitShock=0;
  const deter=clamp(1-.08*clamp(Math.log(1+stMarksFloods)/Math.log(1+floods0)-1)-.1*Math.max(0,(s.bloom??B.bloom)-B.bloom)-.3*Math.max(0,s.poor-B.poorCondition),.5,1);
  // Guest nights follow the beds (the hotels, at 56.4 % occupancy, take part of what the apartments lose).
  const guestNights=B.guestNights*Math.pow(touristBeds/B.touristBeds,.7)*Math.sqrt(demandT)*deter*shock;
  const overnight=guestNights/365;
  // Hamnen och fartygen (hamn): only ships that fit the lagoon without new dredging (level 1), the cruise and
  // container terminals outside the inlets (level 2), no big ships at all (level 3); the cruise passengers
  // come and go with them (584 284 in 2025, 1.61 million in 2019).
  const cruise=B.cruisePassengers*Math.sqrt(demandT)*(1-.5*clamp(I.hamn/.67)-.4*clamp((I.hamn-.67)/.33));
  // Besökare i lagom mängd (besok): a fee and booking on every busy day trims and spreads the day-trippers (paying
  // day visitors per fee day fell from 16 676 in 2024 to 11 326 in 2026, and days over 20 000 from four to one,
  // ve_cda_2024_2026; antagande −10 %); then a cap of 50 000 day visitors a day (level 2), and at level 3 every
  // visit booked within the carrying capacity of 52 111 a day with the overnight guests (ve_bertocchi_2020).
  // The cap trims the busy days most: a smooth minimum of demand and cap (antagande).
  const dayDemand=Math.max(0,B.dayVisitors*demandT*(1-.1*clamp(I.besok*3))*deter*shock-(B.cruisePassengers-cruise)/365);
  const r=clamp((I.besok-.33)/.67);
  const dayCap=I.besok<1/3?Infinity:r<.5?120000*Math.pow(50000/120000,r/.5):50000*Math.pow(Math.max(5000,CAPACITY_VISITORS-overnight)/50000,(r-.5)/.5);
  const dayVisitors=dayDemand/Math.pow(1+Math.pow(dayDemand/dayCap,4),.25);
  const visitorsDay=dayVisitors+overnight;
  const crowding=visitorsDay/CAPACITY_VISITORS,visitorsPerResident=visitorsDay/s.pop;
  s.visitorsPerResident=visitorsPerResident;s.floods=stMarksFloods;
  // The busiest day: 1.64 times an average one (2022's 143 246); a cap holds it near the cap.
  // Real-time counting and booking (ai, the Smart Control Room's data used for the visitors) spread them further
  // (antagande −10 %).
  const peakDay=Math.min(visitorsDay*B.peakDay/(B.dayVisitors+B.guestNights/365),Number.isFinite(dayCap)?1.08*dayCap+1.1*overnight:Infinity)*(1-.1*I.ai);
  // The visitors' climate footprint (antagande): 0.12 t CO₂e a guest night with the journey (88.9 % foreign, many
  // by air), 0.02 t a day-tripper, 0.3 t a cruise passenger; aviation and shipping decarbonise slowly.
  const tourismCO2=(guestNights*.12+dayVisitors*365*.02+cruise*.3)*(1-.35*clamp(t/60));
  // Jobs: hotels and restaurants follow the visitors; knowledge, crafts, the lagoon's works and the city's own
  // building add others (antagande).
  const tourismAct=.6*guestNights/B.guestNights+.4*dayVisitors/B.dayVisitors;
  const otherJobs=1+.25*I.kunskap+.05*I.hav+.05*I.anpassning+.03*I.effektivitet+.03*I.regionalt;
  const tourismJobs=B.tourismJobs*tourismAct/(B.tourismJobs*tourismAct+(1-B.tourismJobs)*otherJobs);
  const unemployment=clamp(B.unemployment+.04*Math.max(0,1-tourismAct)*(1-.7*I.kunskap)-.01*I.kunskap-.004*I.regionalt,.02,.15);

  // --- Knowledge -------------------------------------------------------------------------------------------
  // Fewer young Italians (antagande −10 % by 2056, partly made up by foreign students); a city campus with homes
  // for students and research in the Arsenale and on the Lido (kunskap) draws more (antagande +25 %).
  const students=B.students*(1-.1*clamp(t/30))*(1+.25*I.kunskap);
  const pupils=B.pupils*s.c/(B.pop*B.share0_14);
  // Data and AI: AI spreads in the world (antagande: most services by the 2050s); how much the city puts it to work
  // for the lagoon and its people (ai), and how firmly its use is governed – the EU's AI Act (high-risk rules from
  // 2027), the people's say (demokrati) and open, city-owned systems (ai).
  const aiWorld=.12+.83*(sig((year-2045)/7)-sig(-19/7));
  s.aiCapacity=lag(s.aiCapacity,.12+(aiWorld-.12)*(.3+.7*I.ai),3);
  s.aiGovernance=lag(s.aiGovernance,clamp(.2+.05*clamp((year-2026)/2)+.4*I.demokrati+.15*I.ai),5);

  // --- The lagoon ------------------------------------------------------------------------------------------
  // The salt marshes: at today's 4.8 mm a year of relative sea rise and about 3 mm of accretion (1.7–4.3 at San
  // Felice, ve_marsh_accretion) they lose about 0.5 km² a year (lag_barene_forlust_per_ar). The sea's rise (not
  // the city's lift) sets the pace; closed gates keep out the storm surges and the >70 % of the sediment they
  // carry (MOSE already cuts it ≥ 25 %, ve_tognin_2021; antagande: all of it once the lagoon is shut a quarter of
  // the year). Levande lagun (hav) builds marsh from dredged sediment (0.6 km² a year in 1990–2011, about 0.09
  // since; antagande up to 1.1 at level 3, twice the old pace, with sediment let in from the rivers – about
  // 15 000 m³ of sediment a hectare, so the lagoon's dredging and rivers cannot do much more) and protects the
  // edges with fascines (LIFE VIMINE); no big ships (hamn) and slower boats (kollektivt) stop the wakes that eat
  // the channel banks (3.5 m a year along the Malamocco–Marghera channel). Building is harder the faster the sea,
  // and the nearer the marshes come to their extent of the 1930s (104 km², antagande: room for about 110).
  const rate=held?.0048:Math.max(0,seaRise-s.seaLast);if(!held)s.seaLast=seaRise;
  const blocked=clamp(.36*Math.sqrt(shut/.03));
  const accretion=.004*V.marsh*(1+.35*I.hav)*(1-.7*blocked);
  const deficit=1000*(rate-accretion);   // mm a year
  const loss=Math.max(0,.5*deficit/1.8)*(1-.3*I.hav)*(1-.2*I.hamn)*(1-.1*I.kollektivt)*(1-.05*I.ai)*(1+.5*permanent);
  const build=(.09+I.hav)*(1-.6*permanent)/(1+.06*Math.max(0,deficit-2))*clamp((110-s.marsh)/70);
  if(!held)s.marsh=clamp(s.marsh-loss+build,0,160);
  // The lagoon's water (the EU water directive's status, as an index): marshes and seagrass (LIFE SeResto planted
  // 10 km²), no big ships, sustainable clam farming and calmer boats help; long closures hurt – closed, still
  // water changes plankton, nutrients and bottom life within two days and warms (ve_cibic_2025, Canu et al.
  // 2026) – and a lagoon shut for good becomes a lake; a warmer climate hurts; the basin's nutrient loads keep
  // falling slowly (antagande +0.05 by 2086). Damage comes faster than recovery (τ 8 against 20).
  const watersTarget=clamp(B.waters+.3*I.hav+.08*I.hamn+.05*I.regionalt+.04*I.kollektivt+.15*(s.marsh-B.saltMarsh)/60
    -.6*Math.max(0,shut-.03)-.12*stress+.05*clamp(t/60)-.15*permanent);
  s.waters=lag(s.waters,watersTarget,s.waters>watersTarget?8:20);
  const bloom=clamp(B.bloom+.6*(B.waters-s.waters)+.25*stress+.4*Math.max(0,shut-.03));
  s.bloom=bloom;
  // Rialto: fish stalls follow the people who cook (residents), the lagoon's fish and a market the city backs
  // (regionalt: the Pescheria revived, schools and care buying from the lagoon's fishers and Sant'Erasmo;
  // antagande), up to about the thirty of the 1980s.
  const stallsRaw=B.fishStalls*Math.pow(s.pop/B.pop,.8)*Math.sqrt(clamp(.6+.4*s.waters/B.waters,.3,2.5))*(1+3*I.regionalt);
  const fishStalls=40*stallsRaw/(40+stallsRaw)*(40+B.fishStalls)/40;
  const foodRegional=clamp(B.foodRegional+.25*I.regionalt+.05*(s.waters-B.waters)+.02*I.hav,0,.8);

  // --- Energy and boats ------------------------------------------------------------------------------------
  // Gas heating: falls slowly on today's course (antagande: 45 % fewer gas homes when the boiler rules have run
  // their course), and much faster with heat pumps on lagoon water (effektivitet: the Doge's Palace already heats
  // and cools with lagoon water, ve_palazzo_ducale_lagunvarme; no outdoor units on the facades), τ 8.
  s.gasHeat=lag(s.gasHeat,Math.max(.03,B.gasHeat*(1-.45*national)-.75*I.effektivitet),8);
  // Electricity: 5 970 kWh a resident in the Comune's count, which shares the hotels', shops' and workplaces' use
  // among the residents – households used 289 of its 1 491 GWh (en_elanvandning_distributionsnat). So the homes'
  // fifth follows the residents and the rest the city's activity – its visitors and its residents (antagande: half
  // each); a third more where gas heat has become heat pumps (antagande: 720 m³ of gas ≈ 7 MWh of heat, at COP 3.5),
  // and AI's own appetite.
  const homesEl=289/1491,activity=.5*tourismAct+.5*s.pop/B.pop;
  const elUse=B.pop*B.elUsePerCap/1000*(homesEl*s.pop/B.pop+(1-homesEl)*activity)*(1+.35*(B.gasHeat-s.gasHeat)/B.gasHeat+.05*(s.aiCapacity-.12)*I.ai);   // GWh
  // Sun where Venice allows it: on post-1945 flat roofs today (+0.05 MW a year, antagande); with energy
  // communities, on the port's and the garages' roofs at Santa Marta, San Basilio and Tronchetto (the port
  // authority's six plants, approved by the Soprintendenza in 2024, ve_cer_adsp_2025; antagande 6 MW), and at the
  // radical level solar tiles that look like coppi on a sixth of the tiled roofs (about 1 kW per 90 m²,
  // ve_invisible_solar; antagande 6 MW). Never panels on the old roofs (ve_comune_abaco_solare).
  s.solarMW=lag(s.solarMW,B.solarMW+.05*t+6*clamp(I.sol/.67)+6*clamp((I.sol-.67)/.33),5);
  const localEnergy=s.solarMW*1.2/elUse;
  const renewable=clamp(B.renewable+(.97-B.renewable)*national+.5*Math.max(0,localEnergy-s.local0));
  // Boats on electricity (the share of the boat traffic): hybrids on the Grand Canal by 2032 (the PAESC's goal)
  // and the national trend on today's course; electric vaporetti, taxis and waste boats charged at the stops
  // (kollektivt) bring it forward (a hybrid retrofit already cuts a vaporetto's emissions 28 %, ve_hybrid_vaporetto).
  const be=(y,k)=>(.5+.45*k)*sig((y-(2050-18*k))/7);
  const boatElectric=clamp(B.boatElectric+be(year,I.kollektivt)-be(START,0));
  // Motor boats on the canals (taxis and transport, an index): fewer with shared freight and taxis (kollektivt)
  // and with fewer day-trippers (antagande).
  const boats=(1-.35*I.kollektivt)*(.55+.45*dayVisitors/B.dayVisitors);
  // NO₂ at Rio Novo: the mainland's background (antagande 16 µg/m³), the boats (14) and the ships (4) – in the
  // lockdown of 2020–21, with few boats, it fell from 51 to 31 (en_no2_rio_novo); boats and ships make 46.7 % of
  // the Comune's NOx (en_nox_andel_batar_fartyg).
  const no2=16*(1-.45*national)+14*(1-boatElectric)/(1-B.boatElectric)*boats+4*(1-.6*I.hamn)*Math.sqrt(cruise/B.cruisePassengers);
  // CO₂ per resident (the Covenant's scope): gas heat, the power's carbon, the boats and cars, the rest.
  const ghgHeat=B.ghg.heat*s.gasHeat/B.gasHeat*(1-.1*I.effektivitet);
  const ghgPower=B.ghg.power*(1-renewable)/(1-B.renewable)*(elUse/s.pop)/(B.elUsePerCap/1000);
  const ghgTransport=B.ghg.transport*(1-.9*boatElectric)/(1-.9*B.boatElectric)*(1-.3*national);
  const ghg=ghgHeat+ghgPower+ghgTransport+B.ghg.other*(1-.5*national);

  // --- Heat, health and the people's ties --------------------------------------------------------------------
  // Hot days over 30 °C: 21.7 a year today, +23 with RCP4.5 and +55 with RCP8.5 by 2071–2100 (WORLD_CLIMATE).
  const hotDays=22+(W.hotDays-22)*W.shape(t);
  // Heat deaths follow the hot days and the old; shade, fountains and cool rooms on the campi (svalka: greening to
  // 30 % tree cover would avoid a third of Europe's urban heat deaths, ve_iungman_2023 – the stone city cannot get
  // there, antagande −30 %), heat pumps that also cool (antagande −15 %) and neighbours and care that look in
  // during heatwaves (forebyggande, antagande −25 %) avoid some; people and houses adapt (antagande −25 % by 2106).
  const old=(s.e+.3*s.o)/(B.pop*B.share80+.3*B.pop*(B.share65-B.share80));
  const heatDeaths=B.heatDeaths*Math.pow(hotDays/22,.8)*old*(1-.3*I.svalka)*(1-.15*I.effektivitet)*(1-.25*I.forebyggande)*(1-.25*clamp(t/80));
  // Friends to count on: society drifts apart on today's course (antagande −4 points by about 2070, varied ±50 %),
  // less where people share homes and have a say; homes shared across generations and kitchens on the campi
  // (bogemenskap), assemblies (demokrati), cool campi to meet on (svalka) and company for the old (forebyggande)
  // add (antagande, after the engine's community_e1 and community_e12); crowds of visitors take away; asking too
  // much at once (load) and changes forced through without a say (resistance) cost.
  const resistance=held?0:1.5*Math.max(0,I.korttid-before.korttid)*(1-.7*I.demokrati)+Math.max(0,I.besok-before.besok)*(1-.6*I.demokrati)
    +.8*Math.max(0,I.mose-before.mose)*(1-.5*I.demokrati)+.8*Math.max(0,I.anpassning-before.anpassning)*(1-.5*I.demokrati);
  const drift=-.04*V.drift*(1-Math.exp(-t/40))*(1-.6*Math.max(I.bogemenskap,I.demokrati));
  s.friends=lag(s.friends,clamp(B.friends+drift+.06*I.bogemenskap+.03*I.demokrati+.03*I.svalka+.04*I.forebyggande
    -.03*(visitorsPerResident/crowd0-1)+.02*clamp(s.pop/B.pop-1,-.5,.6)-.05*Math.max(0,load-1)-.03*s.aiCapacity*(1-s.aiGovernance)-resistance+s.eventMood,.4,.92),5);
  s.eventMood*=.6;
  // Safe after dark: more residents in the calli, fewer crowds (pickpocketing is 3.4 times the national rate),
  // neighbours who know each other (antagande).
  s.safe=lag(s.safe,clamp(B.safe+.06*clamp(s.pop/B.pop-1,-.5,1)-.05*(visitorsPerResident/crowd0-1)+.03*I.demokrati+.03*I.bogemenskap+.02*I.svalka,.25,.85),5);
  // Turnout: falling (62.2 % in 2020, 55.9 % in 2026) unless people get a real say (demokrati: assemblies chosen
  // by lot in every sestiere, participatory budgets, an ombudsperson for the lagoon's grandchildren; antagande).
  s.turnout=lag(s.turnout,clamp(B.turnout-.04*V.drift*clamp(t/30)*(1-I.demokrati)+.1*I.demokrati+.3*(s.friends-B.friends),.3,.9),4);
  const womenCouncil=clamp(B.womenCouncil+.1*clamp(t/40)+.07*I.demokrati,0,.5);
  // Life expectancy: the province's projected rise (antagande +5.5 years by 2126, after ISTAT's projection for the
  // Veneto to 2080, varied ±40 %), care and step-free bridges (forebyggande), friends (social ties and survival,
  // community_e1), cleaner air, and the heat.
  const lifeTarget=B.lifeExp+5.5*V.life*(1-Math.exp(-t/50))+.9*I.forebyggande+3*(s.friends-B.friends)+.015*(B.no2-no2)-.02*(heatDeaths-B.heatDeaths);
  s.lifeExp=lag(s.lifeExp,lifeTarget,6)-s.lifeShock;s.lifeShock*=.4;
  // Step-free bridges (forebyggande: ramps under 8 % where the span allows, and the "gradino agevolato"; 37 of the
  // city's 430 bridges have been made accessible, ve_techne_2020; antagande: 40 % of the stepped ones at level 3, a
  // few a decade on today's course), τ 10.
  s.stepped=lag(s.stepped,B.steppedBridges-.03*clamp(t/50)-.4*I.forebyggande,10);
  // Shade on the campi: trees where the ground allows, pergolas and sails, and fountains (antagande +35 points at
  // level 3), τ 10 as the trees grow.
  s.shade=lag(s.shade,B.shade+.35*I.svalka,10);
  const nature=clamp(.6*s.shade/.4+.4*I.svalka);

  // --- The stones ------------------------------------------------------------------------------------------
  // Houses in mediocre or poor condition: salt water in the ground floors and walkways, the wakes that loosen the
  // foundations (moto ondoso), empty houses that decay; renovated homes, the restorers' crafts and the Special
  // Law's work on quays and foundations mend them (antagande on all sizes), τ 15. Raising the walkways over the
  // 15–20 cm thresholds allow costs a little heritage (lag_hojning_max_cm; antagande); lifting the city whole
  // does not.
  if(!held)s.heritage=clamp(s.heritage-.3*Math.max(0,Math.min(P,1.2)-Math.max(pBefore,1.1))*(1-clamp((I.anpassning-.67)*3))+.002*(1-s.heritage));
  const floodWear=.05*clamp(Math.log(1+stMarksFloods)/Math.log(1+floods0)-1,-1,1.5)+.1*floodShare;
  s.poor=lag(s.poor,clamp(B.poorCondition+floodWear-.04*I.kollektivt-.02*I.hamn-.02*I.ai-.06*I.anpassning-.06*I.bogemenskap-.04*I.kunskap
    +.1*Math.max(0,emptyHomes-B.emptyHomes)+.03*stress+.4*(1-s.heritage),.05,.8),15);

  // --- Water and preparedness --------------------------------------------------------------------------------
  // Losses in the pipes: Veritas's slow renewal (antagande −10 % by 2066) and a renewal programme (beredskap).
  s.waterLoss=lag(s.waterLoss,Math.max(.12,B.waterLoss*(1-.1*clamp(t/40))-.2*I.beredskap),10);
  // Water security: deep wells on the mainland, salt creeping up the rivers in droughts (stress), a second
  // source and a renewed network (antagande).
  s.water=lag(s.water,clamp(B.water-.15*stress+.2*I.beredskap+.3*(B.waterLoss-s.waterLoss)),4);
  const preparedness=clamp(.3*s.water+.25*I.beredskap+.2*(1-floodRisk)+.1*clamp(localEnergy/.1)+.15*s.friends);
  // The city's money from its visitors (s.money, 1 = today's): the tourist tax on every guest night (38.7 M€,
  // tur_imposta_soggiorno_2025) and what the access fee leaves after its controls (5.22 M€ on 60 days in 2026,
  // tur_cda_intakter_2025; antagande: three tenths left, as 1.77 M€ went to lower waste fees). The fee is a way
  // to steer the flows, not a till: on every high-season day (level 1, antagande 150 days), dearer on the most
  // crowded (level 2, +30 %) and on every day of the year (level 3) it brings a few million more from fewer day
  // visitors; short lets returned to homes cost tax. Together the two are 5.1 % of the Comune's revenues
  // (tur_turistskatter_andel_intakter) and a larger part of what it can spend on change (antagande: a fifth of the
  // city's means for change follows them); the damage of floods and crises takes from them.
  const feeDays=60+90*clamp(I.besok*3)+215*clamp((I.besok-.67)/.33),feeRate=1+.3*clamp((I.besok-.33)/.34);
  const fee=5.22*Math.pow(feeDays/60,.8)*(dayVisitors/B.dayVisitors)*feeRate,tax=38.7*guestNights/B.guestNights;
  const money=(tax+.3*fee)/(38.7+.3*5.22);s.money=money;
  s.funds=lag(s.funds,clamp(1+.2*(money-1)-s.damage,.5,1.5),5);s.damage*=.75;
  // How strongly the city draws and keeps its people (0–1): few freed homes lost, few households leaving.
  const attract=clamp(.5*(1-leak/(2*LEAK0))+.5*(1-depart/(2*DEPART_RATE*s.H)));

  // --- Events ----------------------------------------------------------------------------------------------
  // The events read the year's own figures too (shut share, hot days, beds, empty homes, fish stalls, heat deaths).
  c.events({s,I,year,seaRise:seaCity,level100:L100,flooded,floodRisk,stress,localEnergy,preparedness,nature,W,shut,hotDays,touristBeds,emptyHomes,fishStalls,heatDeaths});

  // Besides the measures: floodMargin, how far the protection stands above the water a 100-year storm leaves
  // behind the barriers (m); gwl, the world's warming in °C over pre-industrial (1.4 in 2026, the world's own
  // level by its shape) – the heat the texts tell of (changes.js).
  return {
    pop:s.pop,share65:s.share65,share80:s.share80,share0_14:s.c/s.pop,share0_19:(s.c+s.teens*s.y)/s.pop,births,deaths,households:s.H,emptyHomes,shortLetHomes:s.T,touristBeds,
    bedsPerResident:touristBeds/s.pop,housePrice:s.price,publicEmpty:s.PE,attract,
    guestNights,dayVisitors,visitorsPerResident,crowding,peakDay,cruisePassengers:cruise,tourismCO2,tourismJobs,unemployment,
    students,studentBeds:s.studentBeds,pupils,
    seaRise:seaCity,level100:L100,levelInside:inside,protection:P,floodMargin:P-inside,gwl:1.4+(W.gwl2100-1.4)*W.shape(t),barrierCloses:C,barrierInside:s.barrierInside,uplift:s.uplift,
    moseClosures:closures,lagoonClosed:shut,stMarksFloods,floodShare,floodRisk,lagoonMean,
    saltMarsh:s.marsh,waters:s.waters,bloom,fishStalls,foodRegional,carShare:0,
    ghg,gasHeat:s.gasHeat,solarMW:s.solarMW,localEnergy,renewable,boatElectric,no2,boats,
    hotDays,heatDeaths,lifeExp:s.lifeExp,friends:s.friends,safe:s.safe,turnout:s.turnout,womenCouncil,
    steppedBridges:s.stepped,shade:s.shade,nature,poorCondition:s.poor,heritage:s.heritage,
    waterLoss:s.waterLoss,water:s.water,preparedness,railMain:B.railMain,aiCapacity:s.aiCapacity,aiGovernance:s.aiGovernance,
    capacity:c.capacity,demand:c.demand,strain:c.strain,stress,
  };
}

// 0–100 per goal: each blends Venice's normalised measures between a poor value and the goal ([measure, poor,
// goal]). The goal's detail view lists the measures named here.
export const SDG_PARTS={
  1:[['housePrice',6000,2500],['emptyHomes',.5,.1]],                                       // Ingen fattigdom: a home one can afford
  2:[['foodRegional',.05,.5],['fishStalls',0,30]],                                         // Ingen hunger: the lagoon's food
  3:[['lifeExp',82,90],['heatDeaths',40,0],['friends',.6,.85]],                            // Hälsa
  4:[['pupils',1200,5000],['students',15000,30000],['studentBeds',0,6000]],                // Utbildning
  5:[['womenCouncil',.2,.5],['friends',.6,.85]],                                           // Jämställdhet
  6:[['waterLoss',.5,.1],['water',.3,.9],['waters',0,.8]],                                 // Vatten
  7:[['renewable',.1,1],['gasHeat',.9,0],['localEnergy',0,.12]],                           // Energi
  8:[['unemployment',.1,.03],['tourismJobs',.3,.1]],                                       // Arbete: jobs beyond tourism
  9:[['boatElectric',0,1],['steppedBridges',1,.5],['preparedness',.2,.9]],                 // Infrastruktur
  10:[['steppedBridges',1,.5],['housePrice',6000,2500],['safe',.4,.8]],                    // Jämlikhet: a city for old and young
  11:[['pop',25000,75000],['emptyHomes',.5,.1],['crowding',2.5,1],['stMarksFloods',200,0],['poorCondition',.4,.1]],   // Städer
  12:[['tourismCO2',2e6,4e5],['visitorsPerResident',3,.8]],                                // Konsumtion: visitors in measure
  13:[['ghg',4,.2],['floodRisk',1,0],['heatDeaths',40,0]],                                 // Klimat
  14:[['waters',0,.8],['saltMarsh',20,80],['bloom',1,0]],                                  // Hav: the lagoon
  15:[['saltMarsh',20,80],['shade',.05,.45],['lagoonClosed',.5,0]],                        // Ekosystem
  16:[['turnout',.45,.8],['safe',.4,.8]],                                                  // Fred och institutioner
  17:[['turnout',.45,.8],['friends',.6,.85],['preparedness',.2,.9]],                       // Partnerskap
};
// Raworth's doughnut in Venice's own measures: social shortfall (0 = the foundation met, up to 1) and
// ecological overshoot (0 = inside the ceiling).
export function doughnut(d){
  return {
    social:{
      food:clamp(.45-.5*d.foodRegional-.01*d.fishStalls),health:clamp((88-d.lifeExp)/10)*.6+clamp(d.heatDeaths/60)*.4,
      education:clamp(1-d.pupils/4000)*.6,income:clamp(d.unemployment*4+Math.max(0,d.tourismJobs-.1)*1.5),
      peace:clamp((1-d.safe)*1.2),voice:clamp(.8-d.turnout),equity:clamp((d.housePrice-2000)/5000),gender:clamp(.5-d.womenCouncil),
      housing:clamp(d.emptyHomes*1.4),networks:clamp((1-d.friends)*1.6),energy:clamp(d.gasHeat*.4),water:clamp(.8-d.water),
    },
    ecological:{
      climate:clamp(d.ghg/2.5-.2+d.tourismCO2/1e7,0,2),acidification:clamp(d.ghg/6,0,1.5),chemical:clamp(.7-.6*d.waters),
      nutrients:clamp(1-d.waters*1.4+.3*d.bloom,0,1.5),freshwater:clamp(d.waterLoss*1.2),land:clamp((80-d.saltMarsh)/80,0,1.5),
      biodiversity:clamp(1-d.waters-.006*d.saltMarsh+.5*d.lagoonClosed,0,1.5),air:clamp(d.no2/40,0,1.5),ozone:.05,
    },
  };
}
// What the 3D city shows (features.js, future.js, sea.js, traffic.js, flood.js) – only what can happen in historic
// Venice. No panels or gardens on its roofs (roofCover 0: panels are banned on pre-1945 buildings, and solar
// tiles look like the coppi they replace), no ivy on its palazzi, no streets to depave, no car parks, no canals
// dug, no floating villages, no wind turbines, no cars or bicycles.
export function vision(d,I,s){
  return {
    // The lagoon: its mean level seen from the city (the 3D ground stands for the walkways at 1.50 m); its colour
    // from its health; algal blooms when it suffers.
    seaRise:d.lagoonMean-MEAN0,waterClarity:clamp(.2+d.waters),bloom:d.bloom,
    // The raised and defended insulae: a storm floods the city only above the protection (flood.js keeps the
    // walkways behind it dry).
    wall:Math.max(0,d.protection-FLOOD.streets),
    // Taxis and transport boats on the canals (config.js: the lines with vision:'boats').
    boats:clamp(d.boats),
    // Fruit trees in the gardens and cloisters that are opened and planted (svalka, regionalt).
    foodForest:clamp(.35*I.svalka+.25*I.regionalt),maturity:clamp(.35+.5*s.shade),
    // Shade on the campi (svalka): sails over the paving and trees in planters – the campi cannot be dug (wells,
    // cisterns), so the trees stand in stone planters.
    shade:clamp((d.shade-BASE.shade)/.35),
    // Market stalls and long tables on the campi: Rialto's and the campo markets revived, neighbours' dinners.
    market:clamp(.15+.6*(d.fishStalls-BASE.fishStalls)/25),community:clamp(.08+.9*(d.friends-BASE.friends)+.25*I.demokrati+.15*I.bogemenskap),
    // The people in the calli: residents and their age; no cars and no bicycles.
    people:d.pop/BASE.pop,old:d.share65,old80:d.share80,cars:0,bikes:0,pods:0,ev:0,parking:0,depave:0,verge:0,
    // The few lawns yellow in hot, dry summers.
    dry:clamp(.3*d.stress),
  };
}
// What the residents' everyday reads from the year (residents.js): loneliness as the share without friends to
// count on (ISTAT's 30.5 % in 2026); no algal-bloom thought on the quays – nobody bathes from Venice's fondamenta
// (bathing in the canals is forbidden), so the lagoon's blooms show in its colour instead; no co-housing measure.
export function residents(d){
  return {lonely:clamp(1-d.friends),bloom:0,cohousing:0};
}
// What Venice's levers must do (site/test/model.test.mjs checks them by year 50, or `year`): a lever at `level`
// (3) moves a measure by at least `delta`; compare: every lever at the first level against the second – asking
// too much at once costs the city's ties.
export const EXPECT=[
  {lever:'bogemenskap',ind:'emptyHomes',delta:-.04},
  // Level one renovates the empty public homes and lets them – no more.
  {lever:'bogemenskap',level:1,ind:'publicEmpty',delta:-800},
  {lever:'bogemenskap',ind:'pop',delta:2000},
  {lever:'korttid',ind:'shortLetHomes',delta:-3000},
  {lever:'korttid',ind:'pop',delta:1000},
  {lever:'besok',ind:'crowding',delta:-.5},
  {lever:'hav',ind:'saltMarsh',delta:10},
  {lever:'anpassning',ind:'stMarksFloods',delta:-20},
  {lever:'anpassning',ind:'floodRisk',delta:-.05},
  {lever:'mose',ind:'lagoonClosed',delta:.3},
  {lever:'mose',ind:'waters',delta:-.05},
  {lever:'kollektivt',ind:'no2',delta:-3},
  {lever:'effektivitet',ind:'gasHeat',delta:-.2},
  {lever:'svalka',ind:'heatDeaths',delta:-1},
  {lever:'kunskap',ind:'studentBeds',delta:2000},
  {lever:'ai',ind:'moseClosures',delta:-20},
  // Fewer and shorter closures: the lagoon is shut for less of the year.
  {lever:'ai',ind:'lagoonClosed',delta:-.01},
  {lever:'forebyggande',ind:'steppedBridges',delta:-.15},
  {lever:'regionalt',ind:'fishStalls',delta:3},
  {lever:'sol',ind:'solarMW',delta:5},
  {lever:'hamn',ind:'cruisePassengers',delta:-200000},
  {lever:'demokrati',ind:'turnout',delta:.04},
  {lever:'beredskap',ind:'waterLoss',delta:-.1},
  {compare:[3,1],year:12,ind:'friends',delta:-1e-6},
];
// The measures whose uncertainty band the tests check (besides the population): measured today, uncertain later.
export const BAND_CHECK=['lifeExp','friends'];
