// Rättvik's own numbers and issues for the engine's model (site/src/model.js).
// Every starting value is a record in research/baseline.json (FACTS names it) or a marked assumption
// (antagande). Research: Kolada (research/deep/kolada.json) and the deep research in research/deep/.
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));

// Starting values, 2026 (Rättviks kommun's own numbers where they exist).
export const BASE={
  pop:10978,share65:.346,share80:.113,share0_19:.175,
  // Territorial emissions per inhabitant (2024): industry is the lime works – 13.8 of 17.5 tonnes.
  ghg:{transport:2.204,agriculture:.643,energy:.021,industry:13.766,other:.871},ghgCons:7.6,
  // Renewable share of final energy: 67.5 % outside industry, which uses 48 % and is mostly fossil (estimate).
  renewable:.4,solarMW:7.42,windMW:30,elUsePerCap:12.714,elLocalOther:16106,
  // Trips by car: 53 % in Sweden (RVU 2024); more in a rural kommun with 679 cars per 1 000 (estimate 65 %).
  // Public transport: 9 % of motorised trips in Dalarna, about 7 % of all trips.
  carShare:.65,transitShare:.07,carsPer1000:679,evShare:.037,
  regen:.296,diet:.35,foodRegional:.15,foodStockDays:7,
  waterNow:.62,waters:.5,bloom:.1,biodiversity:.33,protectedNature:.018,canopy:.293,greenShare:.4,
  lifeExp:83.96,selfHealth:.658,activity:.635,lowParticipation:.265,loneliness:.039,distress:.075,youthScreen:.87,
  trust:.732,participation:.3,turnout:.8411,gini:.256,childPoverty:.094,unsafe:.11,workHours:38,cohousing:.002,overcrowding:.085,
  education:.712,unemployment:.031,
  internet:.93,cash:.05,homePrepared:.43,waste:395,recycling:.45,foodWaste:84,
  guestNights:226773,railMain:3.35,julyExtra:.583,secondHomes:2980,
};
// The research record behind each starting value (research/baseline.json).
export const FACTS={
  pop:'befolkning_total',share65:'andel_65_plus',share80:'andel_80_plus',share0_19:'andel_0_19',
  'ghg.transport':'vaxthusgaser_transporter_per_inv','ghg.agriculture':'vaxthusgaser_jordbruk_per_inv','ghg.energy':'vaxthusgaser_el_fjarrvarme_per_inv','ghg.industry':'vaxthusgaser_industri_per_inv',
  solarMW:'solceller_installerad_effekt',windMW:'vindkraft_installerad_effekt',elUsePerCap:'elanvandning_per_inv',elLocalOther:'elproduktion_vattenkraft',
  renewable:'fossilfri_andel_slutanvandning_utom_industri',carShare:'bilandel_resor_sverige',transitShare:'kollektivtrafik_marknadsandel',carsPer1000:'personbilar_per_1000_inv',railMain:'restid_tag_stockholm_min',
  evShare:'elbilar_andel',regen:'ekologisk_akermark_andel',protectedNature:'skyddad_natur_total',biodiversity:'skyddad_natur_total',canopy:'tradbevuxen_mark_andel_tatort',
  waters:'siljan_ekologisk_status',bloom:'siljansbadet_prov_algblomning',
  lifeExp:'medellivslangd_kvinnor',selfHealth:'sjalvskattad_god_halsa',activity:'fysiskt_aktiva',lowParticipation:'lagt_socialt_deltagande',loneliness:'ensamhet_ofta',
  distress:'allvarlig_psykisk_pafrestning',trust:'avsaknad_tillit',turnout:'valdeltagande_kommunval_2022',gini:'gini_disponibel_inkomst',childPoverty:'barnfattigdom_andel',
  unsafe:'otrygghet_kvall',overcrowding:'trangboddhet_norm2',education:'gymnasieexamen_4ar',unemployment:'arbetsloshet_20_64',waste:'kommunalt_avfall_kg_per_inv',
  recycling:'materialatervinning_andel',guestNights:'gastnatter',julyExtra:'befolkning_juli_okning',secondHomes:'fritidshus_antal',
  // Sweden's own figures (pipeline/research/national-se.json).
  youthScreen:'unga_skarmtid_over_3h',internet:'internet_dagligen',cash:'kontant_senaste_kop',homePrepared:'hemberedskap_en_vecka',
  foodWaste:'livsmedelsavfall_per_person_sverige',workHours:'arbetstid_overenskommen',foodStockDays:'livsmedelsberedskap_planeringsmal_dagar',ghgCons:'konsumtionsbaserade_utslapp_sverige',
};
// Starting values that are estimates rather than statistics vary ±20 % in the uncertainty runs.
export const BASE_UNCERTAIN=['foodRegional','foodStockDays','waters','biodiversity','greenShare','cohousing'];

export const PARAMS={
  // Rättviks kommun's projection (2024): 11 083 (2030), 11 107 (2040), 11 580 (2070) on today's course,
  // from 10 978 (2025): a slow, lasting rise – deaths are twice the births, so it all rests on people moving
  // in (10 962 in August 2026, already below the path). attractMid: Rättvik as attractive as today (the
  // model's attract, 0.76 in 2026) keeps that trend; npm test checks today's course against the projection.
  growth:.0012,growthDecay:60,attractMid:.76,
  // Ageing (the same projection): 65+ from 34.6 % to 36.5 % by 2040, 80+ from 11.3 % to 14.5 %.
  ageing65:.048,ageing65Years:28,ageing80:.06,ageing80Years:15,
  // Solar: the national trend and the roofs, in proportion to the town (defaults); Dalarna's sun gives
  // somewhat less than Kalmar's: 6.0 GWh from 7.4 MW in 2024 (Kolada). Wind: 15 turbines on Hedbodberget,
  // 30 MW, 82.5 GWh in 2024 (2.75 GWh/MW). Broboberget/Lannaberget has permits for up to 115 turbines and
  // a grid agreement for 740 MW, partly in Ovanåker, with no investment decision; the grid in Dalarna
  // takes no new large production until a new substation is built (antagande: 400 MW in Rättvik at full
  // ambition, at 3.3 GWh/MW).
  solarYield:.85,windPotential:400,windYield:2.75,windYieldNew:3.3,
  // Kyrkudden's church stables and the old shore: adaptation that builds walls costs a little of them.
  heritageCost:.05,
  // A train to the capital: 3 h 21 at best, two direct trains a weekday (SJ, Mora–Stockholm). Trafikverket's
  // works cut Uppsala–Borlänge by 7 minutes by about 2031 (planned); the region's unfunded goal, Mora–
  // Stockholm under three hours, is what the push for links (forbindelser) can win.
  rail:{to:'Stockholm',today:3.35,planned:[[.12,2028,4]],gain:.6,sdg:[3.45,2.6]},
  // Visitors: 226 773 commercial guest nights in 2025 (281 099 in 2019), two thirds in June–August, more
  // than half on campsites; Classic Car Week about 35 000 of them, Dalhalla 120 000 visitors. Blooms matter
  // little in Siljan's clear water; no sea to rise; 91.5 % of tourist trips to Dalarna are by car.
  tourism:{algae:.02,sea:[0,1,1],heritage:.1,depave:.02,car:.915,co2:.039,sdg:[12000,2500]},
};
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
// Drinking water: groundwater from Gärdsjö, a new well field and works in 2025, permitted for
// 4 500 m³/day; nearly 40 % have their own wells. No dry-year margin is published (antagande: 25 %
// to spare in a dry year on today's course; the summer guests weigh on it).
export const WATER={dry:1.25,growth:.05,growthYears:24,planned:[],second:.6,climateLoss:.25,dryYears:.15};
// Siljan: moderate ecological status (VISS, because of the dams and the regulation; nutrients are good),
// no algal blooms in 26 beach samples 2023–2026. Shores and tributaries can be restored, slowly.
export const WATERS={kind:'lake',planned:[0,1],recovery:[.06,50],tau:18};

// The part of the model only Rättvik has: the summer town. 2 980 second homes, 83 % of them owned from
// elsewhere, and 58 % more people in the kommun in July than in October–November (SCB's mobile data,
// 2022; three times the median on Classic Car Week's Saturday). The second-home summer stays; the
// visitors' share of it follows the guest nights. The indicator: people in the kommun on a July day.
export const LOCAL={
  step({s,B,guestNights}){
    const summerPeople=s.pop*(1+B.julyExtra*(.6+.4*guestNights/B.guestNights));
    return {summerPeople};
  },
};
