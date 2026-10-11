// Kalmar's own numbers and issues for the engine's model (site/src/model.js).
// Every starting value is a record in research/baseline.json (FACTS names it) or a marked assumption;
// effect sizes and their evidence are documented in the engine. The local part – Ölandsbron, Öland's
// summer, Linnéuniversitetet, the trains to Stockholm and Copenhagen, the airport – is LOCAL below.
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));

// Starting values, 2026 (Kalmar kommun's own numbers where they exist).
export const BASE={
  pop:73068,share65:.207,share80:.064,share0_19:.226,
  ghg:{transport:1.41,agriculture:.9,energy:.041,industry:.062,other:.577},ghgCons:7.1,
  renewable:.62,solarMW:47.4,windMW:81,elUsePerCap:7.34,elLocalOther:92891,
  carShare:.6,transitShare:.14,carsPer1000:498,evShare:.061,
  regen:.059,diet:.35,foodRegional:.2,foodStockDays:7,
  waterNow:.54,waters:.31,bloom:.71,biodiversity:.35,protectedNature:.022,canopy:.22,greenShare:.18,
  lifeExp:83.85,selfHealth:.747,activity:.677,lowParticipation:.379,loneliness:.06,distress:.11,youthScreen:.87,
  trust:.661,participation:.3,turnout:.8459,gini:.279,childPoverty:.105,unsafe:.31,workHours:38,cohousing:.002,overcrowding:.096,
  education:.711,unemployment:.051,
  internet:.93,cash:.05,homePrepared:.43,waste:378,recycling:.43,foodWaste:84,
  guestNights:452248,guestNightsOland:1443657,olandResidents:26850,olandSummerExtra:52900,students:6000,
  railMain:4.5,railCph:3.73,airPassengers:88216,bridgeWinter:15000,bridgeSummerExtra:10000,
};
// The research record behind each starting value (research/baseline.json).
export const FACTS={
  pop:'befolkning_total',share65:'andel_65_plus',share80:'andel_80_plus',share0_19:'andel_0_19',
  'ghg.transport':'vaxthusgaser_transporter_per_inv','ghg.agriculture':'vaxthusgaser_jordbruk_per_inv','ghg.energy':'vaxthusgaser_el_fjarrvarme_per_inv','ghg.industry':'vaxthusgaser_industri_per_inv',
  ghgCons:'konsumtionsutslapp_total_kalmar_uppskattad',renewable:'fornybar_andel_energianvandning',solarMW:'solceller_installerad_effekt',windMW:'vindkraft_installerad_effekt',
  elUsePerCap:'elanvandning_per_inv',elLocalOther:'elproduktion_kraftvarme',carShare:'bilandel_resor',transitShare:'kollektivtrafik_andel_alla_resor_uppskattning',
  carsPer1000:'personbilar_per_1000',evShare:'elbilar_andel',regen:'ekologisk_akermark_andel',waterNow:'dricksvattenmarginal_kalmar',waters:'kustvatten_kalmar_god_ekologisk_status_antal',
  biodiversity:'skyddad_natur_total',protectedNature:'skyddad_natur_total',canopy:'tradkronstackning_tatort',greenShare:'genomslapplig_yta_kvarnholmen',
  lifeExp:'medellivslangd_kvinnor',selfHealth:'sjalvskattad_god_halsa',activity:'fysiskt_aktiva',lowParticipation:'lagt_socialt_deltagande_lan',loneliness:'ensamhet_ofta_alltid_sverige',
  distress:'allvarlig_psykisk_pafrestning',youthScreen:'unga_skarmtid_over_3h',trust:'avsaknad_tillit',turnout:'valdeltagande_kommunval',gini:'gini_disponibel_inkomst',
  childPoverty:'barnfattigdom_raddabarnen',unsafe:'otrygghet_kvall',workHours:'arbetstid_overenskommen',cohousing:'kollektivhus_kalmar_lan',overcrowding:'trangboddhet_norm2',
  education:'gymnasieexamen_4ar',unemployment:'arbetsloshet_20_64',internet:'internet_dagligen',cash:'kontant_senaste_kop',homePrepared:'hemberedskap_en_vecka',
  waste:'kommunalt_avfall_kg_per_inv',recycling:'materialatervinning_andel',foodWaste:'livsmedelsavfall_per_person_sverige',guestNights:'gastnatter_kalmar_kommun',
  guestNightsOland:'gastnatter_borgholm',students:'helarsstudenter_kalmar',railMain:'restid_tag_kalmar_stockholm_min',airPassengers:'flyg_passagerare_kalmar_2025',
  bridgeWinter:'olandsbron_fordon_per_dygn',
};
// Starting values that are estimates rather than statistics vary ±20 % in the uncertainty runs.
export const BASE_UNCERTAIN=['foodRegional','foodStockDays','waters','biodiversity','greenShare','cohousing'];

// How Kalmar's numbers move (all documented in the engine where they are used).
export const PARAMS={
  // SCB: 75 100 (2030), 80 200 (2050), 83 600 (2070) on today's course (E: demography_e10, demography_e18).
  growth:.0058,growthDecay:30,
  // Ageing after SCB's projection.
  ageing65:.07,ageing65Years:28,ageing80:.05,ageing80Years:35,
  // Solar: the national trend adds about 3 MW a year; 430 MW more covers about ¾ of the roofs (antagande).
  // Wind: a large co-owned offshore park in southern Kalmarsund (antagande: offshore_wind_scale). Today's
  // turbines give 2.4 GWh per MW (measured 2023–24), new offshore turbines 3.4 (Kårehamn: 4.0).
  solarTrend:3,solarPotential:430,solarYield:.93,windPotential:1250,windYield:2.4,windYieldNew:3.4,
  // The 1600s quays: walls cost some of what they protect (E: heritage).
  heritageCost:.12,
  // A train to the capital: about 4 h 30 with a change today; Ostlänken shortens it in the 2040s, the
  // region's own push (forbindelser) up to an hour more.
  rail:{to:'Stockholm',today:4.5,planned:[[.3,2036,10]],gain:1,sdg:[4.6,3.2]},
  // Visitors (E: turism): growth with incomes capped by the beds, warmer seasons, algal blooms, a risen
  // sea taking the guest harbour, heritage and a car-free centre. 91.5 % come by car; 39 kg CO₂e a guest night.
  tourism:{algae:.035,sea:[.05,.7,.3],heritage:.1,depave:.02,car:.915,co2:.039,sdg:[20000,4000]},
  // Electric shipping: Sjöfartshögskolan as a test bed (E: universitet).
  boatKnowledge:4,
};
// Kvarnholmen's ground (research/deep/oversvamning, derived from MCF's flood maps and consistent with
// Länsstyrelsen's 1.6–2 m for the harbour): the lowest quay is 1.5 m RH 2000 and streets begin to flood
// at 1.8 m; half the island lies below 2.7 m. table: share of the island under water at a given sea
// level (m RH 2000) with no defences; harbour: the harbour districts (rail yard, Barlastholmen), which go
// first. Protection: ⅓ local barriers 2.3 m, ⅔ raised quays 2.8 m, all a harbour barrier 3.4 m.
export const FLOOD={
  kind:'sea',high100:1.29,streets:1.8,protectGain:1.6,
  table:[[1.2,.011],[1.3,.013],[1.4,.018],[1.5,.022],[1.6,.028],[1.7,.036],[1.8,.053],[1.9,.087],[2.0,.167],[2.1,.223],[2.2,.296],[2.3,.338],[2.4,.383],[2.5,.416],[2.6,.451],[2.7,.489],[2.8,.521],[2.9,.55],[3.0,.57],[3.2,.596],[3.4,.645],[3.6,.71],[3.8,.777],[4.0,.869],[4.2,.933],[4.5,.949],[4.7,.98]],
  harbour:[[1.2,.03],[1.3,.048],[1.5,.077],[1.7,.116],[1.8,.172],[1.9,.324],[2.0,.675],[2.1,.796],[2.2,.91],[2.3,.954],[2.4,.986],[2.6,1]],
};
// Drinking water (E: dricksvatten): one raw-water system – Nybroåsen, fed with water from Hagbyån. In the
// dry year 2025 the margin of available raw water over need fell from 39 to 19 % (dry: 1.19). Demand
// follows the population and the new connections of the municipal water plan (+20 % beyond the
// population by 2050); supply loses up to a third to a hotter climate in a dry year (SGU/SMHI, SSP5-8.5).
// The planned wellfields and non-drinking reuse from Kalmarsundsverket (2027) are today's course; a
// second source that does not depend on rain – recycled wastewater or desalination on solar power –
// comes from preparedness (second). Dry summers come in 15 % of years today.
export const WATER={dry:1.19,growth:.2,growthYears:24,planned:[[.12,2028,4],[.06,2027,4]],plannedClimate:.2,second:.81,climateLoss:.33,dryYears:.15};
// Kalmarsund (E: helcom_bsap, mussels): Kalmarsundsverket cuts N and P by 35 % from 2027 (planned); the
// Baltic recovers slowly (recovery) – τ 22 years. HELCOM's CyaBI next to Kalmarsund: 0.71 (BASE.bloom).
export const WATERS={kind:'sea',planned:[.02,2],recovery:[.05,60],tau:22};

// The part of the model only Kalmar has. Called by the engine in this order each year: pop() while
// the population grows, step() after the visitors are counted, then vision() for the 3D city.
export const SPREAD={univ:[.7,1.3]};
export const LOCAL={
  init(s){Object.assign(s,{univ:1,bridgeMulti:0,roadRaised:0});},
  // Linnéuniversitetet (E: universitet): Kalmar is about 37 % of it, some 6 000 full-time students and
  // 5 000 people in all with staff and families; 38 % of graduates stay in the region. The savings of
  // 2027–29 (the rector: up to 1 000 fewer students) and a 19–24 cohort that peaks in 2035 and is 14 %
  // smaller by 2050 (SCB) weigh on it; a city that secures the campus at Kalmar C, houses its graduates
  // and works with the university as a living lab keeps and grows it (antagande, sized in the notes).
  // (Half the cohort's fall reaches the campus: it also recruits older and distance students.)
  beforePop({s,I,year,soon,V,lag}){
    const cohort=1+.03*clamp((year-2026)/9)-.1*clamp((year-2035)/15);
    const cuts=1-(.15*clamp((year-2026)/4)-.07*clamp((year-2030)/10))*(1-clamp(1.6*I.kunskap));
    s.univ=lag(s.univ,clamp((1+(V.univ-1)*soon)*cohort*cuts*(1+.3*I.kunskap),.4,1.6),4);
  },
  pop:({s})=>.002*(s.univ-1),
  // Öland in July: the island's 26 850 people become about 80 000; 7 000 m³/day of desalination and the
  // 1 000 m³/day pipeline cover about half the peak, the rest is groundwater, which a dry summer cuts by
  // a fifth today and by half in the 2080s in SSP5-8.5. More desalination comes with preparedness.
  step({s,I,B,year,policy,stress,seaRise,demandT,comfort,algae,shock,touristCar,ev,national}){
    const olandDryGround=7700*(1-.2-.35*stress);
    // Öland's guest nights (Borgholm and Mörbylånga): the beaches are the most sensitive to algal blooms,
    // and a risen sea takes the grazed shore meadows of the world heritage.
    const meadowsLost=seaRise<1?.032*seaRise:.032+.05*(seaRise-1);
    const guestNightsOland=B.guestNightsOland*demandT*comfort*algae(.075)*(1-.5*meadowsLost)*shock;
    const olandJuly=B.olandResidents+B.olandSummerExtra*(.28*guestNightsOland/B.guestNightsOland+.72);
    // Links (E: forbindelser): Copenhagen 3 h 44; under four hours to Stockholm the state stops
    // subsidising flights; the airport has already lost 62 % of its passengers since 2019.
    const railCph=3.73-.35*I.forbindelser;
    const airPassengers=B.airPassengers*Math.max(.12,1-.65*clamp((year-2026)/25))*(1-.6*I.forbindelser);
    // Ölandsbron (1972) is renovated in 2027–30 and planned to last until at least 2075. It is replaced in
    // the early 2070s either way; what the new bridge carries is decided around 2068 – a tram and a
    // wind-shielded cycle path where the region pushes for it (a 10–15 billion kronor state project, after
    // Denmark's Storstrøm Bridge), with the approach road at Tallhagen (2.3 m) raised. Buses get lanes of
    // their own on today's bridge from the 2030s where the city's transit reaches that far.
    if(year===2068)s.bridgeMulti=(policy.forbindelser||0)>=2||(policy.kollektivt||0)>=3?1:0;   // what the region has chosen to push for
    s.roadRaised=(year>=2072&&s.bridgeMulti)||I.anpassning>.6?1:0;
    const bridgeTram=year>=2068?s.bridgeMulti*clamp((year-2070)/4)*clamp((I.kollektivt-.5)*3):0;
    const bridgeBus=clamp((I.kollektivt-.2)*2)*clamp((year-2032)/4)*(1-bridgeTram);
    const bridgeSummer=(B.bridgeWinter*Math.pow(s.pop/B.pop,.6)+B.bridgeSummerExtra*(olandJuly-B.olandResidents)/B.olandSummerExtra*(touristCar/.915))*(1-.12*bridgeBus-.3*bridgeTram);
    // Öland's water on a dry July day: what is missing after desalination, the pipeline and groundwater.
    const olandWaterGap=Math.max(0,14700*olandJuly/(B.olandResidents+B.olandSummerExtra)-(8000+4000*Math.pow(I.beredskap,1.2)+olandDryGround));
    return {olandWaterGap,students:B.students*s.univ,guestNightsOland,olandJuly,railCph,airPassengers,
      bridgeSummer,bridgeTram,bridgeBus,bridgeMulti:s.bridgeMulti,roadRaised:s.roadRaised};
  },
  vision:d=>({bridgeTram:d.bridgeTram??0}),
};
// The global goals' measures beyond the engine's own: the university's students, the train to
// Stockholm and the visitors' climate footprint (normalised between a poor value and the goal).
export const SDG_PARTS={
  4:[['education',.6,.95],['youthScreen',1,.3],['students',4000,7500]],
};
