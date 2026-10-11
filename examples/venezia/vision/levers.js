// Venice's words for the levers and its climate in the three worlds (the engine's site/src/data/levers.js
// has the levers themselves – cost, pace, effects – and the wording any place starts from; every lever is
// said here in Venice's own terms). Swedish here; English in en/core.js, Italian in it/core.js.
export const LEVER_TEXT={
  stadsodling:{name:'Odling på altaner och gårdar',short:'Grönsaker på takterrasserna, i innergårdarna och i klostrens trädgårdar',
    levels:['Krukor på altanerna som idag','Odlingslådor i gårdarna och på skolornas tak','Klostrens och palatsens trädgårdar odlas, växthus på altanerna','Ätbar stad: varje gård och altan bär mat']},
  regionalt:{name:'Mat från lagunen',short:'Sant\'Erasmo, Vignole och fastlandet föder staden; fiske och musslor i lagunen',
    levels:['Import som idag – Rialtomarknaden krymper','Lokal upphandling till skolor och omsorg','Lagunöarnas odlingar och fiskevallarna lever igen','Matsuveränitet: lagunens matråd och 90 dagars lager']},
  kost:{name:'Kost & måltider',short:'Säsong och lagun på tallriken, mindre matsvinn',
    levels:['Som idag','Mer växtbaserat i offentliga kök','Planetary health diet i all offentlig mat','Ny matkultur: säsong, baljväxter och lagunens fisk, inget svinn']},
  hav:{name:'Levande lagun',short:'Saltängar, sjögräs och sediment tillbaka; lugnare vatten för fisk och fågel',
    levels:['Som idag – saltängarna krymper','Nya saltängar av muddermassor','Sedimentet får komma tillbaka, sjögräs planteras, fiskefria zoner','Lagunens återkomst: saltängarna växer i takt med havet']},
  sol:{name:'Sol på Venedigs tak',short:'Solpaneler som ser ut som tegel, på de tak som får bära dem',
    levels:['Enstaka paneler där reglerna tillåter','Solceller på kommunens och skolornas tak','Energigemenskaper i varje sestiere, soltegel godkänt i hela staden','Varje lämpligt tak producerar, lagring i bottenvåningar som inte går att bo i']},
  vind:{name:'Havsvind i Adriatiska havet',short:'Vindkraft till havs utanför Lido, ägd tillsammans med invånarna',
    levels:['Ingen vindkraft','Planering av en park till havs','En park utanför Lido, delägd av venetianerna','Havsvind och vätgas för hamnen och fastlandet']},
  effektivitet:{name:'Gamla hus, ny energi',short:'Värmepumpar på lagunvatten, varsam isolering, reparation och återbruk',
    levels:['Gaspannor som idag','Energirenovering av kommunens bostäder','Lagunvärme i varje sestiere, cirkulärt byggande','Fossilfritt Venedig: allt repareras och återbrukas, husen värms med vatten']},
  bilfritt:{name:'Svalka i campi',short:'Träd, skugga och dricksvatten på torgen mot värmeböljorna',
    levels:['Stenytor som idag','Träd och fontäner på de största campi','Skuggande träd och gröna gårdar i varje sestiere','Svalt Venedig: gröna campi, öppna trädgårdar och vatten överallt']},
  kollektivt:{name:'Vaporetton på el',short:'Eldrivna vaporetti, fler linjer till öarna och lugnare båtar',
    levels:['Dieselbåtar som idag','Hybridbåtar på Canal Grande','Eldriven kollektivtrafik på vattnet, laddning vid bryggorna','Tysta kanaler: allt på vattnet går på el, taxi och transporter delas']},
  forbindelser:{name:'Tåg och förbindelser',short:'Snabbtåg till Milano, Rom och Europa i stället för flyg och kryssningsfartyg',
    levels:['Som idag','Tätare regionaltåg och bättre byten','Snabbare tåg till Milano och Rom, nattåg norrut','Europas tågstad: besökarna kommer med tåg']},
  bogemenskap:{name:'Bostäder för venetianer',short:'Tomma hus blir hem för boende, studenter och familjer; gemenskap över generationerna',
    levels:['Som idag','Kommunens tomma bostäder renoveras och hyrs ut','Tak för korttidsuthyrning, generationshus och studentbostäder','Staden åt invånarna: de flesta bostäder är hem igen, gemensamma kök i varje campo']},
  demokrati:{name:'Medborgarråd & barnbarnsombud',short:'Lottade medborgarråd i varje sestiere och ett ombud för lagunens framtida generationer',
    levels:['Representativ demokrati som idag','Medborgardialoger','Lottade medborgarråd och deltagande budget','Barnbarnsombud med vetorätt i lagunens långsiktiga frågor']},
  arbetstid:{name:'Tid för varandra',short:'Kortare arbetstid, tidsbank, medborgartjänst',
    levels:['40 timmar som idag','Försök med 6-timmarsdag i kommunen','Fyradagarsvecka och tidsbank','30-timmarsvecka och ett år av medborgartjänst']},
  forebyggande:{name:'Hälsa i en åldrande stad',short:'Promenader över broarna, gemenskap mot ensamhet, vård nära hemmet',
    levels:['Vård när man blir sjuk','Rörelse, natur och kultur på recept','Hälsotorg i varje sestiere, hemtjänst med båt','Hälsa i allt: staden planeras för gång, möten och vila']},
  ai:{name:'AI för lagunen',short:'AI i tidvattenprognoser, båttrafik, vård och klimatmodeller',
    levels:['Ingen samordning','Pilotprojekt i vården och för tidvattnet','Lokal, öppen AI för tidvatten, trafik, vård och energi','AI-stödd välfärd med data i invånarnas ägo']},
  analog:{name:'Det analoga',short:'Skärmfri barndom, analoga reserver, rätt till ett analogt liv',
    levels:['Digitalt först','Böcker och mobilfri skola','Skärmfri barndom till 12 år, kontanter och papper som reserv','Rätten till ett analogt liv: varje tjänst finns även utan skärm']},
  kunskap:{name:'Kunskapsstaden',short:'Ca\' Foscari, IUAV och lagunen som levande labb; de unga stannar',
    levels:['Som idag','Studentbostäder och distansarbete i den historiska staden','Lagunen som levande labb: forskning tillsammans med invånarna','Livslångt lärande och medborgarforskning i varje skola']},
  beredskap:{name:'Beredskap & vatten',short:'Lokala lager, vattensäkerhet, ö-drift av el',
    levels:['Hemberedskap som idag','Kommunala lager och vattenplan','En andra vattenkälla, 30 dagars lager, ö-drift','Självförsörjande i kris: mat, vatten och energi i 90 dagar']},
  anpassning:{name:'Leva med vattnet',short:'Höjda kajer och gator, skydd för Markusplatsen, bottenvåningar som tål vatten',
    levels:['MOSE stänger vid 110 cm som idag','Höjda kajer och ett skydd runt Markusplatsen','Gatorna höjs mot 1,20 m, bottenvåningarna görs om','Staden växer med havet: upphöjda och flytande kvarter']},
};
// The climate in the three worlds (research/deep/hav-tidvatten). seaRise2126: Venice's relative sea level (the
// sea plus the sinking ground) over today's mean (0.353 m ZMPS, 2020–2025): about 1.21 m in 2126 by SSP2-4.5
// and 1.52 m by SSP5-8.5 (estimates from the regional projections; 47 cm by 2100 in RCP2.6); seaPow > 1, the
// rise speeds up. hotDays: days above 30 °C a year in 2071–2100 (21.7 today at Venice; +23 by RCP4.5, +55 by
// RCP8.5); stress: Kalmar's scale for the added climate stress, a little higher for Venice's heat (+2.0 /
// +3.8 °C by 2071–2100 from an already hot summer; antagande).
export const WORLD_CLIMATE={
  ssp126:{seaRise2126:.5,seaPow:.9,stress:.2,hotDays:30},
  ssp245:{seaRise2126:.86,seaPow:1.15,stress:.45,hotDays:45},
  ssp585:{seaRise2126:1.17,seaPow:1.3,stress:1.1,hotDays:76},
};
// Venice's own lever (the engine adds it to its own; its effects are model.js LOCAL): how many visitors the city
// takes in a day. The access fee began in 2024 on 29 days; 60 days in 2026 (research/deep/turism-ekonomi). A
// study put the historic city's carrying capacity at about 52 000 visitors a day.
export const EXTRA_LEVERS=[
  {id:'besok',theme:'stad',name:'Besökare i lagom mängd',short:'Inträdesavgift, bokning och tak för dagsbesökare; färre turistbäddar och fler hem',cost:.8,tau:8,
    levels:['Inträdesavgift 60 dagar om året som idag','Avgift och bokning alla högsäsongsdagar','Tak på 50 000 besökare om dagen, turistbäddarna minskar','En stad att bo i: besöken bokas och turistbäddarna blir färre än invånarna igen']},
];
// Which research each lever leans on: the engine's general evidence and Venice's own records (base:<id>).
export const LEVER_EVIDENCE={
  besok:['base:tur_dagsbesokare_per_dag_2022','base:tur_barkraft_per_dag','base:tur_cda_betalningar_2025','base:tur_baddar_cs','base:tur_baddar_fler_an_invanare_ar'],
  bogemenskap:['base:com_folkmangd_centro_storico','base:com_folkmangd_centro_storico_1951','base:nt_tomma_bostader','base:tur_korttidsuthyrning_andel_ankomster_cs','base:com_korttidsuthyrning_grans'],
  hav:['base:lag_barene_idag','base:lag_barene_1912','base:lag_barene_forlust_per_ar','base:lag_aterskapade_barene','base:lag_wfd_ekologisk_status','base:lag_sediment_nettoforlust'],
  anpassning:['base:com_mose_grans','base:com_mose_stangningar_sasong_2025_26','base:com_mose_stangningar_vid_50cm','base:com_oversvamning_110cm','base:lag_hojning_max_cm','base:nt_oversvamningsrisk_befolkning'],
  kollektivt:['base:en_actv_flotta_vatten','base:en_actv_hybridfartyg','base:en_kollektivtrafik_resor','base:en_nox_andel_batar_fartyg','base:com_canal_grande_hybridbatar_2032'],
  sol:['base:en_solceller_effekt','base:en_solel_andel_av_elanvandning','base:lag_solceller_byggar_grans'],
  effektivitet:['base:en_bostader_naturgas_andel','base:en_co2_per_inv_bostader','base:lag_byggnader_fore_1919'],
  forbindelser:['base:en_tag_restid_milano','base:en_tag_restid_roma','base:en_kryssning_passagerare','base:en_flygplats_passagerare'],
  regionalt:['base:lag_vongole_produktion','base:lag_rialto_fiskstand','base:lag_santerasmo_kronartskocka','base:lag_valli_da_pesca'],
  kunskap:['base:tur_studenter_cafoscari','base:tur_studenter_iuav','base:nt_hogskoleutbildade_25_64'],
  demokrati:['base:com_valdeltagande_2026','base:nt_kvinnor_kommunfullmaktige'],
};
