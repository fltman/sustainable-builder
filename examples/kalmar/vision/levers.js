// Kalmar's words for the levers and its climate in the three worlds (the engine's site/src/data/levers.js
// has the levers themselves – cost, pace, effects – and the wording any place starts from).
// Swedish here; English in en.js.
export const LEVER_TEXT={
  stadsodling:{name:'Stadsodling',short:'Odling på gator, parkeringar, tak och i växthus',
    levels:['Koloniområden som idag','Odlingslådor i kvarteren','Parkeringar blir matparker, växthus på tak','Ätbar stad: matskog, akvaponik och odling på varje gata']},
  regionalt:{name:'Regional mat',short:'Kalmarslätten föder Kalmar: regenerativt jordbruk, lokala förädlare',
    levels:['Export och import som idag','Lokal upphandling i skolor och omsorg','Regenerativt jordbruk, lokala mejerier och kvarnar','Matsuveränitet: regionala livsmedelsråd och 90 dagars lager']},
  kost:{name:'Kost & måltider',short:'Växtrika offentliga måltider, mindre matsvinn',
    levels:['Som idag','Mer växtbaserat i offentliga kök','Planetary health diet i all offentlig mat','Ny matkultur: säsong, baljväxter, nolltolerans mot svinn']},
  hav:{name:'Levande Kalmarsund',short:'Musselodling, våtmarker och fiskevård mot övergödning',
    levels:['Som idag','Våtmarker och strandzoner','Musselodlingar, våtmarker och fiskefria zoner','Havets återkomst: storskalig restaurering med bönderna']},
  sol:{name:'Sol & energigemenskaper',short:'Solceller på tak, delad lagring, invånarägd energi',
    levels:['Enskilda solcellstak','Solceller på kommunens tak','Energigemenskaper i varje kvarter','Varje lämpligt tak producerar, staden delar lagring']},
  vind:{name:'Havsvind i Kalmarsund',short:'Ny havsvindkraft, ägd tillsammans med invånarna',
    levels:['Befintliga verk','En ny park utanför Kårehamn','Stor park i södra Kalmarsund, delägd av invånare','Energiregion: export av el och vätgas till Europa']},
  effektivitet:{name:'Renovering & cirkulärt',short:'Energieffektiva hus, återbruk, reparation och delning',
    levels:['Som idag','Energirenovering av allmännyttan','Cirkulärt byggande, lånebibliotek för saker','Nollavfall: allt repareras, delas eller återbrukas']},
  bilfritt:{name:'Bilfri stadskärna',short:'Gatorna avasfalteras till odling, träd och mötesplatser',
    levels:['Bilar som idag','Gångfartsgator på Kvarnholmen','Bilfritt Kvarnholmen, parkeringar blir parker','Bilfri stad: gator blir trädgårdar i hela centrala Kalmar']},
  kollektivt:{name:'Kollektivt & cykel',short:'Spårväg, cykelstråk, delade fordon',
    levels:['Bussar som idag','Täta busslinjer, cykelstråk och elbåtar i hamnen','Spårväg, snabbcykelvägar och eldrivna färjor till Öland','Avgiftsfri kollektivtrafik: skyttlar, båtbussar och spårväg över en ny Ölandsbro']},
  forbindelser:{name:'Tåg och förbindelser',short:'Snabbare tåg till Växjö, Köpenhamn och Stockholm, i stället för flyget',
    levels:['Som idag: byte till Stockholm, flyg till Arlanda','Tätare regionaltåg och snabbussar till Öland','Snabbare tåg till Växjö och Köpenhamn, el på Stångådalsbanan','Direkttåg till Stockholm på under fyra timmar och nattåg till Europa']},
  bogemenskap:{name:'Bogemenskap',short:'Kollektivhus, flergenerationsboende, kvarterskök',
    levels:['Som idag','Gemensamma lokaler i nya hus','Generationshus och kvarterskök i varje kvarter','Delat boende som norm: alla åldrar under samma tak']},
  demokrati:{name:'Medborgarråd & barnbarnsombud',short:'Lottade medborgarråd, deltagande budget, ett ombud för framtida generationer',
    levels:['Representativ demokrati som idag','Medborgardialoger','Lottade medborgarråd och deltagande budget','Barnbarnsombud med vetorätt i långsiktiga frågor']},
  arbetstid:{name:'Tid för varandra',short:'Kortare arbetstid, tidsbank, medborgartjänst',
    levels:['40 timmar som idag','Försök med 6-timmarsdag i kommunen','Fyradagarsvecka och tidsbank','30-timmarsvecka och ett år av medborgartjänst']},
  forebyggande:{name:'Förebyggande hälsa',short:'Natur på recept, aktiv vardag, hälsotorg',
    levels:['Vård när man blir sjuk','Fysisk aktivitet och natur på recept','Hälsotorg i varje stadsdel','Hälsa i allt: stadsplanering för rörelse och möten']},
  ai:{name:'AI för välfärden',short:'AI i diagnostik, energinät, odling och klimatmodeller',
    levels:['Ingen samordning','Pilotprojekt i vården','Lokal, öppen AI i vård, energi och jordbruk','AI-accelererad välfärd med data i medborgarnas ägo']},
  analog:{name:'Det analoga',short:'Skärmfri barndom, analoga reserver, rätt till ett analogt liv',
    levels:['Digitalt först','Böcker och mobilfri skola','Skärmfri barndom till 12 år, kontanter och papper som reserv','Rätten till ett analogt liv: varje tjänst finns även utan skärm']},
  kunskap:{name:'Kunskapsstaden',short:'Linnéuniversitetet och staden: campus vid Kalmar C, bostäder för nyutexaminerade, Kalmarsund som levande labb',
    levels:['Universitetet sköter sitt','Säkra campus vid Kalmar C och bostäder för nyutexaminerade','Staden som levande labb: Kalmarsund, sjöfarten och e-hälsan tillsammans med invånarna','Ett hav- och klimatuniversitet i världsklass, med medborgarforskning i varje skola']},
  beredskap:{name:'Beredskap & vatten',short:'Lokala lager, vattensäkerhet, ö-drift av el',
    levels:['Hemberedskap som idag','Kommunala lager och vattenplan','Avsaltning med solel, 30 dagars lager, ö-drift','Självförsörjande region i kris: mat, vatten och energi i 90 dagar']},
  anpassning:{name:'Klimatanpassning',short:'Skydd mot havet, skyfallsytor, svalka',
    levels:['Som idag','Skyfallsytor och höjda kajer','Skyddsvall runt Kvarnholmen och svampstad','Ett flytande sundsdistrikt och plats för havet']},
};
// stress: the climate stress added after 2026, scaled by Kalmar län's warming beyond today's level by 2126
// (+0.4 / +1.5 / +4.4 °C; SMHI's county scenarios, research/deep/klimat). seaRise2126/seaPow: SMHI's
// median mean sea level for Kalmar (2025, net of land uplift) in 2126, and the curve that also meets its
// 2100 value. hotDays: days above 25 °C a year in 2071–2100 (about 15 today).
export const WORLD_CLIMATE={
  ssp126:{seaRise2126:.38,seaPow:.5,stress:.15,hotDays:27},
  ssp245:{seaRise2126:.6,seaPow:.8,stress:.4,hotDays:35},
  ssp585:{seaRise2126:.89,seaPow:.9,stress:1,hotDays:57},
};

// Which research each lever leans on: the engine's general evidence and Kalmar's own records (base:<id>).
export const LEVER_EVIDENCE={
  stadsodling:['food_e23','food_e20','food_e37','food_e41','food_e25'],
  regionalt:['food_e13','food_e5','food_e16','food_e31'],
  kost:['food_e6','food_e9','food_e34','food_e10'],
  hav:['biodiversity_baltic_e4','food_e38','biodiversity_baltic_e11','food_e44','biodiversity_baltic_e19'],
  sol:['energy_e1','energy_e2','energy_e17','energy_e18'],
  vind:['energy_e6','energy_e8','energy_e7'],
  effektivitet:['energy_e12','governance_e14','governance_e8'],
  bilfritt:['mobility_e2','mobility_e8','mobility_e10','mobility_e19','mobility_e7'],
  kollektivt:['mobility_e3','mobility_e5','mobility_e6','mobility_e14','base:olandsbron_livslangd_planerad_till','base:oland_arbetspendlare_till_kalmar','base:olandsbron_gang_cykelforbud_sedan','base:cykelfarja_dessi_passagerare'],
  forbindelser:['base:restid_tag_kalmar_stockholm_min','base:restid_tag_kalmar_kobenhavn_min','base:restid_tag_kalmar_vaxjo_min','base:stangadalsbanan_elektrifierad_andel','base:restid_mal_kalmar_vaxjo_2040','base:kalmar_c_resor_prognos_2045','base:flyg_passagerare_kalmar_2025','base:flyg_passagerare_kalmar_2019','base:flyg_co2_inrikes_kalmar_2024'],
  bogemenskap:['community_e1','community_e12','community_e13','community_e14','community_e8'],
  demokrati:['governance_e1','governance_e2','community_e16','community_e18','community_e17','governance_e3'],
  arbetstid:['community_e22','community_e23','community_e24','community_e25'],
  forebyggande:['health_e1','health_e3','health_e12','health_e6'],
  ai:['tech_ai_e1','tech_ai_e6','tech_ai_e11','tech_ai_e3','tech_ai_e5','tech_ai_e17'],
  kunskap:['base:helarsstudenter_kalmar','base:lnu_andel_verksamhet_kalmar','base:kvarstannande_examinerade_3ar','base:lnu_sparkrav_mnkr','base:universitetskajen_forsta_hyresavtal_lopertid','base:lmo_provtagningstillfallen','base:eemis_medarbetare','base:sjofartshogskolan_studenter','base:ecodriving_bransle_besparing','base:studentbostader_kalmarhem'],
  analog:['digital_resilience_e5','digital_resilience_e4','digital_resilience_e11','digital_resilience_e12','digital_resilience_e8','digital_resilience_e7','digital_resilience_e15'],
  beredskap:['base:dricksvattenmarginal_kalmar','base:oberoende_ravattensystem_kalmar','base:kalmarsundsverket_atervunnet_vatten_kapacitet','base:avsaltning_morbylanga_investering','resilience_e1','resilience_e23','resilience_e5','resilience_e8','resilience_e13','resilience_e15'],
  anpassning:['resilience_e17','resilience_e16','resilience_e18','mobility_e15','mobility_e16'],
};
