// Venezia 2126's levers ("vägval") – what Venice, its people and its institutions can decide, in its own terms,
// from its research (research/story.json, research/deep/*-notes.md: "Beslut framför oss"): homes and short lets,
// visitors, the port and the boats, the lagoon's marshes, living with the water and the gates, heat, an old
// city's care and bridges, energy where the heritage allows it, knowledge and crafts beyond tourism, the people's
// say. Its model (model.js) acts on them. Each has levels 0–3: 0 = today's course, 1 = steady, 2 = ambitious,
// 3 = radical; `cost` is the yearly demand on the city's shared capacity at full implementation, `tau` how many
// years implementation takes to settle. Swedish here; English in en/core.js, Italian in it/core.js.
// No cars to give up (the historic city has none), no wind parks, no gardens or panels on the palazzi: Venice's
// levers are not Kalmar's. Ids are kept where the idea carries over and given Venice's meaning.
export const LEVER_DEFS=[
  {id:'bogemenskap',theme:'gemenskap',name:'Hem för venetianer',cost:1.2,tau:12,
    short:'Tomma kommunala hem rustas och hyrs ut, en bostadsfond köper hem åt dem som bor och arbetar här',
    levels:['Som idag: omkring 800 offentliga hem står tomma i väntan på renovering','De tomma kommunala och ATER-hemmen rustas och hyrs ut till unga par och familjer',
      'En bostadsfond av turistskatten och inträdesavgiften köper och hyr ut hem; generationshus och kök vid campot','Staden åt invånarna: de flesta bostäder är hem igen, till hyror som vanliga löner räcker till']},
  {id:'korttid',theme:'gemenskap',name:'Turistlägenheterna',cost:.6,tau:5,
    short:'Venedigs egen rätt att begränsa korttidsuthyrningen (2022): tak, kvoter och hem tillbaka till boende',
    levels:['Som idag: inga gränser, 6 145 turistlägenheter och fler varje år','Högst 120 nätter om året för hela bostäder, register och kontroller',
      'Kvoter per sestiere och inga nya turistlägenheter i bostadshus','Bara rum i hem där ägaren själv bor: lägenheterna blir hem igen']},
  {id:'demokrati',theme:'gemenskap',name:'Vattenstadens röst',cost:.4,tau:5,
    short:'Lottade medborgarråd i varje sestiere, deltagande budget och ett ombud för lagunens framtida generationer',
    levels:['Representativ demokrati som idag','Medborgardialoger i sestieri',
      'Lottade medborgarråd och deltagande budget i varje sestiere','Ett ombud för lagunens barnbarn med vetorätt i långsiktiga frågor']},
  {id:'besok',theme:'stad',name:'Besökare i lagom mängd',cost:.8,tau:5,
    short:'Inträdesavgift, bokning och tak för dagsbesökare, inom stadens bärkraft på omkring 52 000 besökare om dagen',
    levels:['Inträdesavgift 60 dagar om året som idag','Avgift och bokning alla högsäsongsdagar',
      'Tak på 50 000 dagsbesökare om dagen, högre avgift de mest trängda dagarna','Varje besök bokas: inte fler besökare än staden bär, omkring 52 000 om dagen']},
  {id:'hamn',theme:'stad',name:'Hamnen och fartygen',cost:1.3,tau:15,
    short:'Kryssningsfartyg och containrar ut ur lagunen, inga djupare kanaler, landström vid kajerna',
    levels:['Som idag: kryssningsfartyg till Marghera och Fusina, djupa kanaler genom lagunen','Bara fartyg som ryms utan ny muddring, landström vid kajerna',
      'Kryssnings- och containerterminaler utanför inloppen, Malamocco–Marghera-kanalen grundas upp','Inga stora fartyg i lagunen: den är till för båtarna, fisket och fåglarna']},
  {id:'kollektivt',theme:'stad',name:'Båtarna på el',cost:1.0,tau:10,
    short:'Eldrivna vaporetti, delade taxi- och transportbåtar, fartkameror mot svallvågorna',
    levels:['Dieselbåtar som idag, hybrider på Canal Grande till 2032','Hybridvaporetti och fartkameror i alla kanaler',
      'Eldrivna vaporetti och sopbåtar laddas vid bryggorna, varorna samlastas','Tysta kanaler: allt på vattnet går på el, och taxi och transporter delas']},
  {id:'hav',theme:'mat',name:'Levande lagun',cost:1.1,tau:12,
    short:'Saltängar av muddrat sediment, faskiner mot erosionen, sjögräs och slam från floderna',
    levels:['Som idag: saltängarna krymper med en halv kvadratkilometer om året','Muddermassorna blir nya saltängar, kanterna skyddas med faskiner',
      'Sjögräs planteras, floderna får föra slam till lagunen igen, fiskefria zoner','Lagunens återkomst: nya saltängar varje år, så långt sedimentet räcker']},
  {id:'regionalt',theme:'mat',name:'Lagunens mat och Rialto',cost:.6,tau:10,
    short:'Sant\'Erasmos odlingar, fiskevallarna och lagunens fiskare säljer vid Rialto och till stadens kök',
    levels:['Som idag: sju fiskstånd kvar vid Rialto','Skolor och omsorg köper från Sant\'Erasmo och lagunens fiskare, Pescherian rustas',
      'Rialto lever igen: odlarna, vallarna och musselodlarna säljer direkt','Lagunens matråd: öarna, vallarna och Rialto föder staden']},
  {id:'effektivitet',theme:'energi',name:'Värme ur lagunen',cost:1.2,tau:15,
    short:'Värmepumpar på lagunvatten i stället för gaspannor, varsam isolering av gamla hus',
    levels:['Gaspannor som idag','Kommunens hus och skolor går över till värmepumpar och isoleras varsamt',
      'Lagunvärme i varje sestiere, gaspannorna fasas ut','Fossilfritt Venedig: husen värms och kyls med lagunens vatten']},
  {id:'sol',theme:'energi',name:'Sol där det är tillåtet',cost:.6,tau:8,
    short:'Energigemenskaper med solceller på hamnens och garagens tak, soltegel som ser ut som coppi – aldrig paneler på de gamla taken',
    levels:['Enstaka paneler på plana tak från efter 1945','Solceller på hamnens och garagens tak i en energigemenskap',
      'Energigemenskaper i varje sestiere som delar el från stadens kanter','Soltegel som ser ut som coppi där Soprintendenza tillåter dem, lagring som delas']},
  {id:'forebyggande',theme:'halsa',name:'Att bli gammal i Venedig',cost:.8,tau:10,
    short:'Ramper och lätta trappsteg på broarna, hemtjänst med båt, sällskap mot ensamheten',
    levels:['Vård när man blir sjuk; 95 % av broarna har trappsteg','Ramper vid sjukhuset, skolorna och hållplatserna, hemtjänst med båt',
      'Ett hälsotorg i varje sestiere och grannar som tittar in','Varje stråk går att ta sig fram på med rullstol eller rollator']},
  {id:'svalka',theme:'halsa',name:'Svalka i campi',cost:.5,tau:8,
    short:'Träd, skugga och fontäner på torgen, kloster och trädgårdar öppnas som svala rum',
    levels:['Stenytor som idag','Träd och fontäner på de största campi',
      'Skugga och svala rum i varje sestiere, klosterträdgårdar öppna för grannarna','Ett svalt Venedig: skugga, vatten och öppna trädgårdar överallt']},
  {id:'ai',theme:'teknik',name:'Data och AI för lagunen',cost:.8,tau:8,
    short:'Tidvattenprognoser som låter MOSE stänga bara när det behövs, besöksflöden, båtarnas fart och vård på distans – öppet och i stadens ägo',
    levels:['Som idag: data om tidvatten, besökare och båtar i var sin lucka','Öppna data: tidvatten, besökare och båttrafik i realtid för alla',
      'AI i stadens tjänst: skarpare tidvattenprognoser, bokning och båttrafik, vård på distans','En digital tvilling av lagunen i invånarnas ägo, öppet granskad']},
  {id:'kunskap',theme:'teknik',name:'Kunskap och hantverk',cost:.9,tau:12,
    short:'Universitetsstad, forskning om lagunen och restaureringens hantverk – jobb bortom turismen',
    levels:['Som idag: nästan vart femte jobb i hotell och restauranger','Studentbostäder och ett forskningscentrum, de som utbildas här kan stanna',
      'Lagunen och kulturarvet som levande labb: forskning, restaurering och hantverk i Arsenalen','En stad av kunskap och hantverk, lika stark som turismen']},
  {id:'anpassning',theme:'resiliens',name:'Leva med vattnet',cost:1.6,tau:15,
    short:'Insulan San Marco och de lägsta kajerna tätas, gångvägarna höjs, staden lyfts med havsvatten under lagunen',
    levels:['Som idag: Markusplatsen svämmar över från 80 cm','Insulan San Marco och de lägsta kajerna tätas till 1,10 m',
      'Gångvägarna höjs mot 1,20 m, bottenvåningarna görs om för vattnet','Staden lyfts: havsvatten pumpas ned under lagunen och höjer Venedig 25–30 cm']},
  {id:'mose',theme:'resiliens',name:'Lagunens portar',cost:1.0,tau:10,
    short:'Hur ofta MOSE stänger lagunen: när staden annars svämmar över, oftare – eller för gott',
    levels:['MOSE stänger när staden annars svämmar över, från 110 cm','MOSE stänger redan från 100 cm, så att Markusplatsen hålls torr',
      'En reglerad lagun: luckorna stängs vid varje tidvatten över 90 cm, fartygen går genom slussar','En stängd lagun: inloppen stängs för gott och lagunen hålls nere med pumpar']},
  {id:'beredskap',theme:'resiliens',name:'Vatten och beredskap',cost:.7,tau:10,
    short:'Ledningar som inte läcker, brandvatten i varje sestiere, lager och reservkraft för en stad på öar',
    levels:['Som idag: 41,7 % av vattnet försvinner i ledningarna','Ledningarna förnyas, ett brandvattennät i centrum',
      'En andra vattenkälla, lager för 30 dagar, reservkraft på öarna','En självförsörjande stad i kris: vatten, mat och el i 90 dagar']},
];
// The levers' order in share links – fixed once published; it only ever grows.
export const LINK_ORDER=['bogemenskap','korttid','demokrati','besok','hamn','kollektivt','hav','regionalt','effektivitet','sol','forebyggande','svalka','ai','kunskap','anpassning','mose','beredskap'];

// The climate in the three worlds (research/deep/hav-tidvatten). seaRise2126: Venice's relative sea level (the sea
// plus the sinking ground) over today's mean (0.353 m ZMPS, 2020–2025): about 1.21 m in 2126 by SSP2-4.5 and
// 1.52 m by SSP5-8.5 (estimates from the regional projections; 47 cm by 2100 in RCP2.6); seaPow > 1, the rise
// speeds up. hotDays: days above 30 °C a year in 2071–2100 (21.7 today at Venice; +23 by RCP4.5, +55 by RCP8.5);
// stress: Kalmar's scale for the added climate stress, a little higher for Venice's heat (+2.0 / +3.8 °C by
// 2071–2100 from an already hot summer; antagande).
export const WORLD_CLIMATE={
  ssp126:{seaRise2126:.5,seaPow:.9,stress:.2,hotDays:30},
  ssp245:{seaRise2126:.86,seaPow:1.15,stress:.45,hotDays:45},
  ssp585:{seaRise2126:1.17,seaPow:1.3,stress:1.1,hotDays:76},
};
// Which research each lever leans on: Venice's own claims (research/evidence.json, ve_*), its records
// (base:<id>, research/baseline.json) and the engine's general research.
export const LEVER_EVIDENCE={
  bogemenskap:['base:soc_dwellings_unoccupied_cs_2023','base:soc_public_housing_comune_empty_2025','base:soc_public_housing_ater_empty_share_2025','base:soc_erp_applicants_2025','base:nt_bostadspris_centro_storico','ve_coses_2009','ve_piano_casa_2026','community_e12','community_e13'],
  korttid:['base:soc_tourist_rental_units_cs_2026','base:soc_tourist_beds_per_resident_cs_2026','base:tur_korttidsuthyrning_andel_ankomster_cs','base:com_korttidsuthyrning_grans','ve_nyc_ll18','ve_garcia_lopez_2020','ve_coses_2009'],
  demokrati:['base:com_valdeltagande_2026','base:com_valdeltagande_2020','base:com_centro_storico_martella','community_e16','community_e18','community_e21','governance_e1','governance_e2'],
  besok:['base:tur_dagsbesokare_per_dag_2022','base:tur_besokare_toppdag_2022','base:tur_barkraft_per_dag','base:tur_cda_betalningar_2026','base:tur_cda_dagar_over_20000','ve_bertocchi_2020','ve_cda_2024_2026'],
  hamn:['base:com_kryssningsfartyg_grans','base:tur_kryssning_2019','base:en_kryssning_passagerare','base:lag_strandretratt_fartygsvagor','base:en_nox_andel_batar_fartyg','base:en_landstrom_investering','base:lag_sediment_nettoforlust'],
  kollektivt:['base:en_actv_flotta_vatten','base:en_actv_hybridfartyg','base:com_canal_grande_hybridbatar_2032','base:en_no2_rio_novo','base:en_nox_lagunbatar','base:en_fartmatning_sensorer','ve_hybrid_vaporetto'],
  hav:['base:lag_barene_idag','base:lag_barene_1912','base:lag_barene_forlust_per_ar','base:lag_aterskapade_barene','base:lag_skyddade_barene_life_vimine','base:lag_sjogras_seresto','ve_marsh_accretion','ve_tognin_2021'],
  regionalt:['base:lag_rialto_fiskstand','base:lag_santerasmo_kronartskocka','base:lag_valli_da_pesca','base:lag_vongole_produktion','base:lag_grossistmarknad_fisk','food_e5','food_e34'],
  effektivitet:['base:en_bostader_naturgas_andel','base:en_naturgas_per_invanare','base:en_co2_per_inv_bostader','base:lag_byggnader_fore_1919','ve_palazzo_ducale_lagunvarme','energy_e12'],
  sol:['base:lag_solceller_byggar_grans','base:en_solceller_effekt','base:en_solel_andel_av_elanvandning','ve_comune_abaco_solare','ve_cer_adsp_2025','ve_invisible_solar','energy_e17'],
  forebyggande:['base:soc_share_80plus_cs_2025','base:en_broar_med_trappor_andel','base:en_tillganglig_yta_med_vaporetto','base:soc_hospital_beds_ss_giovanni_paolo','base:soc_one_person_households_cs_2025','ve_techne_2020','community_e1','community_e14'],
  svalka:['base:mare_hetdagar_30_idag','base:mare_hetdagar_30_okning_rcp85','base:mare_tropiska_natter_idag','base:soc_share_65plus_cs_2025','ve_ballester_2023','ve_iungman_2023','health_e3'],
  ai:['base:mose_stangningsgrans','base:en_fartmatning_sensorer','base:tur_cda_betalningar_2026','ve_alberti_2023','tech_ai_e9','tech_ai_e10','tech_ai_e19','tech_ai_e15'],
  kunskap:['base:soc_university_students_2025','base:soc_student_beds_esu','base:tur_sysselsatta_hotell_restaurang_andel','base:soc_graduate_migration_province','base:tur_murano_sysselsatta','base:tur_studenter_iuav'],
  anpassning:['base:mare_san_marco_troskel','base:mare_rialhojning_malniva','base:lag_hojning_max_cm','base:mare_oversvammad_andel_110','base:com_kajer_hojda','ve_teatini_2011','ve_comerlati_2004'],
  mose:['base:mod_mose_stangningar_medel_2020_2026','base:mose_stangningar_2025_2026','base:mose_dimensionerad_havshojning','base:lag_mose_stangd_tid_2050','base:lag_mose_marsksediment','ve_umgiesser_2020','ve_cibic_2025','ve_tognin_2021'],
  beredskap:['base:nt_vattenforluster','base:mare_dricksvatten_brunnar','base:nt_vatten_per_inv','base:mare_sommarnederbord_rcp85','base:com_fenice_brand','resilience_e1','resilience_e5'],
};
