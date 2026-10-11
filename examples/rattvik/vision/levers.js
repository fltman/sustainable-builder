// Rättvik's words for the levers and its climate in the three worlds (the engine's site/src/data/levers.js
// has the levers themselves – cost, pace, effects – and the wording any place starts from; the levers
// left out here keep it). Swedish here; English in en.js.
export const LEVER_TEXT={
  regionalt:{name:'Mat från bygden',short:'Bygden föder Rättvik: fäbodar, andelsjordbruk och lokala förädlare',
    levels:['Export och import som idag','Lokal upphandling i skolor och omsorg','Levande fäbodar, regenerativt jordbruk, mejerier och kvarnar','Matsuveränitet: bygdens matråd och 90 dagars lager']},
  hav:{name:'Levande Siljan',short:'Återställda stränder, våtmarker och fria vandringsvägar i Siljan och åarna',
    levels:['Som idag','Våtmarker och skyddszoner längs åarna','Återställda stränder och fria vandringsvägar för harr och öring','Siljans återkomst: en sjö som regleras för livet i den, inte bara för kraften']},
  vind:{name:'Vindkraft i skogarna',short:'Ny vindkraft i kommunens skogar, ägd tillsammans med bygden',
    levels:['Dagens 15 verk på Hedbodberget','Några nya verk i befintliga parker','En stor park, delägd av byarna','Energibygd: el och vätgas till andra regioner']},
  bilfritt:{name:'Bilfritt centrum',short:'Gatorna avasfalteras till odling, träd och mötesplatser',
    levels:['Bilar som idag','Gångfartsgator kring Storgatan och torget','Bilfritt centrum, parkeringar blir parker och odling','Bilfri ort: gatorna blir trädgårdar i hela tätorten']},
  kollektivt:{name:'Kollektivt & cykel',short:'Täta bussar till byarna, cykelstråk och delade fordon',
    levels:['Bussar som idag','Tätare bussar och cykelstråk runt Siljan','Anropsstyrda skyttlar till byarna och eldrivna båtbussar på Siljan','Avgiftsfri kollektivtrafik med självkörande skyttlar till varje by']},
  forbindelser:{name:'Tåg och förbindelser',short:'Snabbare och tätare tåg till Borlänge, Falun och Stockholm, i stället för bilen',
    levels:['Som idag: två direkttåg om dagen till Stockholm','Tätare regionaltåg runt Siljan och till Borlänge','Dalabanan rustad: Stockholm på under tre timmar','Direkttåg varje timme och nattåg till kontinenten']},
  kunskap:{name:'Kunskapsorten',short:'Stiernhööksgymnasiet, lärcentrum och bygden som levande labb',
    levels:['Som idag','Lärcentrum för distansstudier vid stationen','Naturbruket som levande labb för fäbodar, skog och Siljan','Livslångt lärande för alla och medborgarforskning i varje by']},
  beredskap:{name:'Beredskap & vatten',short:'Lokala lager, vattensäkerhet, ö-drift av el',
    levels:['Hemberedskap som idag','Kommunala lager och nödvattenplan','En andra vattentäkt, 30 dagars lager, ö-drift','Självförsörjande bygd i kris: mat, vatten och energi i 90 dagar']},
  anpassning:{name:'Klimatanpassning',short:'Plats för Siljans högvatten, skyfallsytor, svalka',
    levels:['Som idag','Skyfallsytor och höjda strandpromenader','Plats för vattnet: campingen flyttar upp, våtmarker tar emot skyfallen','Svampbygd: varje by tar hand om sitt vatten, nya hus byggs över 165 meter']},
};
// stress: the climate stress added after 2026 – Kalmar's scale (its county's warming beyond today's level
// by 2126) times Dalarna's warming relative to Kalmar län's: SMHI gives Dalarna +1.8 / +3.0 / +4.9 °C by
// 2071–2100 against Kalmar län's +1.7 / +2.8 / +4.6 (research/deep/klimat-vatten). hotDays: days above
// 25 °C a year in 2071–2100 at Siljan (16 today at Leksand; the county adds 5 by RCP2.6, about 25 and
// 39 locally by RCP4.5 and 8.5). Siljan is regulated: its everyday level does not rise (seaRise2126 0);
// its 100-year level does (model.js FLOOD.rise).
export const WORLD_CLIMATE={
  ssp126:{seaRise2126:0,seaPow:.5,stress:.16,hotDays:22},
  ssp245:{seaRise2126:0,seaPow:.8,stress:.43,hotDays:25},
  ssp585:{seaRise2126:0,seaPow:.9,stress:1.07,hotDays:39},
};
// Which research each lever leans on: the engine's general evidence and Rättvik's own records (base:<id>).
export const LEVER_EVIDENCE={
  regionalt:['base:fabodbete_hektar','base:mjolkkor_antal','base:sjalvforsorjningsgrad_vikt_lan','base:jordbruksforetag_antal','food_e5','food_e16','food_e31'],
  hav:['base:siljan_ekologisk_status','base:siljansbadet_prov_algblomning','base:istacke_dagar_2016_2026','biodiversity_baltic_e11','food_e44'],
  vind:['base:vindkraft_installerad_effekt','base:elproduktion_vindkraft','base:broboberget_lannaberget_effekt','base:broboberget_lannaberget_produktion','energy_e7'],
  sol:['base:solceller_installerad_effekt','base:elproduktion_sol','energy_e17'],
  effektivitet:['base:elanvandning_total','base:industri_andel_slutlig_energianvandning','base:kalkverk_co2_fossil','energy_e12','governance_e8'],
  kollektivt:['base:kollektivtrafik_marknadsandel','base:kollektivtrafik_vardagsresor_bra_andel','base:personbilar_per_1000_inv','base:rv70_adt','mobility_e5','mobility_e6','mobility_e14'],
  forbindelser:['base:restid_tag_stockholm_min','base:direkttag_stockholm_per_vardag','base:tag_avgangar_per_vardag','base:restid_uppsala_borlange_efter_atgarder_min','base:mal_restid_mora_stockholm_min','base:bilandel_turistresor'],
  kunskap:['base:gymnasieelever_i_kommunen','base:eftergymnasial_utbildning_25_64','base:unga_tror_flytta_fran_kommunen'],
  beredskap:['base:vattentakt_tillstand_max_dygn','base:andel_egen_brunn','resilience_e1','resilience_e23','resilience_e5'],
  anpassning:['base:siljan_100arsniva_idag','base:siljan_hogsta_vattenstand_1985','base:skyfall_2023_skadade_villor','base:lagsta_grundlaggningsniva_siljan','base:camping_andel_under_100arsniva','mobility_e15','mobility_e16'],
};
