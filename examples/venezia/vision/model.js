// Venice's own numbers and issues for the engine's model (site/src/model.js). The place is the historic city
// (centro storico: the six sestieri and the Giudecca) – the people, homes and visitors the 3D model shows.
// Where only the whole Comune di Venezia (with Mestre and the mainland) is counted, the note says so.
// Every starting value is a record in research/baseline.json (FACTS names it) or a marked assumption
// (antagande). Research: research/deep/*.json (seven topics, compiled 2026-10-11).
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));

// Starting values, 2026.
export const BASE={
  // 47 625 residents at the end of 2025 (174 808 in 1951); a third are 65 or older, 8.5 % under 15
  // (0–19 an estimate: 0–14 plus about three years more of the same small cohorts).
  pop:47625,share65:.331,share80:.122,share0_19:.115,
  // Emissions per resident in the Comune's Covenant of Mayors inventory (2016): homes 1.38, services 1.68,
  // transport 0.68 t CO₂ – the city's own energy use, not the power plants of Fusina and Porto Marghera that
  // give the territorial 16.7 t. Split for the model (antagande): electricity in `energy` (≈ 40 % of the
  // buildings' 3.06 t, by electricity's 46.5 % of the energy used), gas heating in `other`.
  ghg:{transport:.68,agriculture:.02,energy:1.2,industry:0,other:1.93},ghgCons:7.5,
  // Renewable share of electricity in the province (17 %, 2023); solar in the historic city is small –
  // panels are banned on buildings from before 1945 (antagande: 2 MW of the Comune's 59).
  renewable:.17,solarMW:2,windMW:0,elUsePerCap:3.0,elLocalOther:0,
  // No cars in the historic city: residents walk (64.5 % of those arriving walk on) or take the water
  // bus (33 %); car trips are those that begin at Piazzale Roma (antagande 2 %). Cars per 1 000 and the EV
  // share are the whole Comune's (Mestre).
  carShare:.02,transitShare:.3,carsPer1000:460,evShare:.0082,
  regen:.15,diet:.35,foodRegional:.1,foodStockDays:7,
  // The lagoon: none of its 11 classified water bodies in good ecological status (2026), so `waters`
  // starts low; 62.4 % of the Comune is protected nature, but three quarters of the salt marshes are gone.
  waterNow:.65,waters:.25,bloom:.25,biodiversity:.4,protectedNature:.624,canopy:.04,greenShare:.05,
  lifeExp:86.4,selfHealth:.68,activity:.6,lowParticipation:.35,loneliness:.12,distress:.09,youthScreen:.85,
  // Trust is low in Italy (antagande 0.30); only half of the Comune's people feel safe walking alone after
  // dark (50.4 %, ISTAT 2024); 55.9 % of the historic city's households are one person.
  trust:.3,participation:.25,turnout:.559,gini:.3,childPoverty:.12,unsafe:.496,workHours:38,cohousing:.001,overcrowding:.1,
  education:.85,unemployment:.052,
  internet:.88,cash:.3,homePrepared:.3,waste:694.8,recycling:.637,foodWaste:65,
  // Visitors: 9.38 million guest nights in the historic city (2025), 61 461 day visitors a day (2022, mobile
  // data), 70 241 tourist beds (1.29 a resident; OCIO counts 50 207 in 2026); 37.4 % of the historic city's
  // dwellings have no registered resident (2023).
  guestNights:9376638,dayVisitors:61461,touristBeds:70241,emptyHomes:.374,
  // The fastest train to the capital: 3 h 56 to Rome (236 min).
  railMain:3.93,
  // MOSE closed 49 times in the 2025/26 season; about 40 km² of salt marsh are left (158 km² in 1912).
  moseClosures:49,marshKm2:40,pupils:2570,students:23851,
};
// The research record behind each starting value (research/baseline.json).
export const FACTS={
  pop:'soc_pop_cs_2025',share65:'soc_share_65plus_cs_2025',share80:'soc_share_80plus_cs_2025',share0_19:'soc_share_0_14_cs_2025',
  'ghg.transport':'en_co2_per_inv_transporter','ghg.energy':'en_co2_per_inv_bostader','ghg.other':'en_co2_per_inv_tjanster',
  renewable:'nt_fornybar_el_andel',solarMW:'en_solceller_effekt',transitShare:'en_till_fots_in_i_staden',carsPer1000:'nt_bilar_per_1000',evShare:'nt_elbilar_andel',
  waters:'lag_wfd_ekologisk_status',protectedNature:'nt_skyddad_natur_andel',biodiversity:'nt_skyddad_natur_andel',
  lifeExp:'soc_life_expectancy_women_province',loneliness:'soc_friends_to_count_on_comune',unsafe:'soc_feel_safe_dark_comune',
  turnout:'com_valdeltagande_2026',unemployment:'nt_arbetsloshet_kommun',waste:'nt_avfall_per_inv',recycling:'nt_utsortering_andel',
  guestNights:'tur_presenze_cs_2025',dayVisitors:'tur_dagsbesokare_per_dag_2022',touristBeds:'tur_baddar_cs',emptyHomes:'soc_dwellings_unoccupied_cs_2023',
  railMain:'en_tag_restid_roma',moseClosures:'com_mose_stangningar_sasong_2025_26',marshKm2:'lag_barene_idag',pupils:'soc_pupils_cs_primary_middle',students:'soc_university_students_2025',
};
// Starting values that are estimates rather than statistics vary ±20 % in the uncertainty runs.
export const BASE_UNCERTAIN=['foodRegional','foodStockDays','biodiversity','greenShare','cohousing','selfHealth'];

export const PARAMS={
  // The historic city loses about 1.5 % of its people a year (55 589 in 2015, 47 625 in 2025; 209 births and
  // 689 deaths in 2025): on today's course 32 356 in 2050 (the trend's own estimate) – the decline eases only
  // slowly. attractMid: the model's attract in 2026, so today's course keeps that trend; homes and fewer
  // visitors win people back (LOCAL.pop).
  growth:-.016,growthDecay:80,attractMid:.541,
  // Ageing: 65+ from 33.1 % – the Comune's own projection takes its share from 28.5 % to 34.2 % by 2040.
  ageing65:.05,ageing65Years:20,ageing80:.04,ageing80Years:25,
  // Solar: little on today's course (the ban on old roofs), up to 25 MW of tile-like panels on the roofs
  // that can carry them (antagande), 1.25 GWh a MW. Wind: the historic city's share of a park off the Lido
  // (antagande 60 MW at full ambition, 3 GWh a MW).
  solarTrend:.05,solarPotential:25,solarYield:1.25,windPotential:60,windYield:3,windYieldNew:3,
  // Adaptation that builds on the old quays and floors touches the heritage it protects.
  heritageCost:.15,
  // The train to Rome: 236 minutes; no faster line is planned.
  rail:{to:'Roma',today:3.93,planned:[],gain:.6,sdg:[4.2,2.8]},
  // Visitors: 88.9 % are foreign and many fly, so a guest night carries far more CO₂e than in a Nordic town
  // (antagande 0.12 t); a sea that floods the city often keeps some away, damaged heritage more; a fifth come
  // by car (antagande).
  tourism:{algae:.02,sea:[.15,.4,.8],heritage:.2,depave:.01,car:.2,co2:.12,sdg:[1200000,300000]},
  // Venice's boats: the Grand Canal is to run on hybrid engines by 2032 (com_canal_grande_hybridbatar_2032).
  boatKnowledge:6,
};
// The sea at Venice (research/deep/hav-tidvatten), in metres on the tide gauge's zero (ZMPS, 1897): mean
// level 0.353 m (2020–2025). The 100-year high water today about 2.10 m (estimate); St Mark's Square floods
// from 0.80 m and Rialto from 1.05 m. The share of the historic city's public walkways under water by level
// is the Comune's own table (2020). MOSE's 78 gates close when a tide of 1.10 m is forecast and hold the
// lagoon at about 0.90 m (antagande: they rise while the tide is about 70–90 cm); raising quays and floors –
// in practice 15–20 cm in the old quarters, plus a defence round St Mark's – is the adaptation (protectGain).
export const FLOOD={
  kind:'sea',high100:2.10,streets:.80,protectGain:.4,
  table:[[.8,.001],[.9,.02],[1.0,.05],[1.1,.12],[1.2,.28],[1.3,.46],[1.4,.59],[1.5,.70],[1.6,.77],[1.7,.82],[1.8,.85],[1.9,.88],[2.0,.91],[2.5,1]],
  barrier:{name:'MOSE',closes:1.10,inside:.9},
};
// Drinking water: 34 deep wells on the mainland serve Venice; 41.7 % of the water is lost in the pipes
// (antagande: a secure dry-year margin, little lost to the climate).
export const WATER={dry:1.3,growth:0,growthYears:24,planned:[],second:.8,climateLoss:.2,dryYears:.1};
// The lagoon: no water body in good status; restoration (the salt marshes, the sediment) is slow.
export const WATERS={kind:'sea',planned:[.02,2],recovery:[.05,60],tau:22};

// What only Venice has: MOSE closing more often as the sea rises, the salt marshes, and the visitors.
export const LOCAL={
  init(s,B){s.marsh=B.marshKm2;s.seaLast=0;},
  // Homes back for residents and fewer visitors win people back, up to the homes that stand empty
  // (37.4 % of 42 431; antagande: room for about 80 000 people).
  pop:({s,I})=>(.016*I.bogemenskap+.006*I.besok)*Math.max(0,1-s.pop/80000),
  step({s,I,B,t,seaRise,demandT,guestNights}){
    // MOSE: closures a year grow steeply with the sea – a CNR study gives about one a day with 50 cm more,
    // and 7–11 % of the year shut by 2050 (RCP8.5): from 49 today, ×7.4 per 50 cm (antagande: exponential).
    // A city that lives with the water – raised quays and floors, floating quarters (anpassning) – lets the
    // gates rise later, up to 35 cm (antagande). The gates were built for 60 cm more sea: beyond that the
    // lagoon behind them creeps up with the rivers, the rain and the leaks (antagande: half the excess).
    const lift=.35*I.anpassning;
    const closures=Math.min(365,B.moseClosures*Math.exp((seaRise-lift)/.25));
    const shut=clamp((closures-60)/300);
    s.barrierCloses=1.10+lift;
    s.barrierInside=.9+.5*Math.max(0,seaRise-.6);
    // The salt marshes: about 0.5 km² lost a year at today's 4.8 mm a year of rising water; a faster rise drowns
    // more (antagande), and closed gates cut the sediment they need (> 25 % less, research). Restoring them
    // with dredged sediment and the rivers' silt adds up to 2.5 km² a year at full ambition (Venice rebuilt
    // 15 km² in 2002–2011; antagande for the rest).
    const rate=Math.max(0,seaRise-s.seaLast);s.seaLast=seaRise;
    const loss=.5+100*Math.max(0,rate-.005);
    s.marsh=clamp(s.marsh-loss*(1+.3*shut)+(1+1.5*I.hav)*I.hav*(1-.5*shut),0,160);
    s.waters=clamp(s.waters-.003*shut);
    // Visitors: day visitors follow the world's demand unless the city books and caps them; short-let caps
    // and homes for residents take tourist beds back. On today's course short lets keep taking homes
    // (31.5 % of arrivals in 2025, 19.4 % in 2019).
    const dayVisitors=B.dayVisitors*demandT*(1-.45*I.besok);
    const touristBeds=B.touristBeds*(1+.003*Math.min(t,40))*(1-.3*I.besok-.25*I.bogemenskap);
    const nights=guestNights*(touristBeds/B.touristBeds);
    const visitorsPerResident=(dayVisitors+nights/365)/s.pop;
    const emptyHomes=clamp(B.emptyHomes+.0015*Math.min(t,60)-.22*I.bogemenskap-.06*I.besok,.05,.6);
    return {moseClosures:closures,saltMarsh:s.marsh,dayVisitors,touristBeds,guestNights:nights,visitorsPerResident,emptyHomes,barrierCloses:s.barrierCloses,barrierInside:s.barrierInside};
  },
};
