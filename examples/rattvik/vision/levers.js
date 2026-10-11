// Rättvik 2126's levers ("vägval"): what Rättvik can decide – the kommun, often with the region, the state,
// the power and forest companies and its villages – in its own terms, from its research (research/story.json,
// research/deep/kommun-plats-historia-notes.md "Beslut framför oss"). Rättvik's own model (model.js) acts on
// them. Each has levels 0–3: 0 = today's course, 1 = steady, 2 = ambitious, 3 = radical. `cost` is the yearly
// demand on Rättvik's shared capacity for change at full implementation (a small kommun with a thin budget
// and too few of working age: rural buses, housing, water pipes and food systems weigh most); `tau` how many
// years implementation takes to settle (forests, lakes, railways and fäbodar are slow).
// Kept from Kalmar 2126's ids where the concept carries over (regionalt, hav, vind, sol, effektivitet, bilfritt,
// kollektivt, forbindelser, bogemenskap, demokrati, forebyggande, ai, analog, kunskap, beredskap, anpassning),
// each with Rättvik's meaning; Kalmar's urban farming, diet and working-time levers are not Rättvik's – the food
// on its tables is part of the fäbodar and the bygd's food, and in a kommun with Sweden's tenth-highest
// dependency ratio a shorter working week is not a lever it holds. Rättvik's own: the forest and its mires
// (skog) and the visitors (turism). Texts are Swedish, translated with L() (en/core.js).
// Rättvik's own themes (the engine's are a town's): the fäbodar and the food; Siljan and the forest, which are
// most of the kommun; energy; the centre and the journeys to the villages and the capital; the visitors and the
// schools that decide whether the young can stay; the villages' life and voice; care; technology and the
// analogue; water and preparedness.
export const THEMES=[
  {id:'mat',name:'Fäbodar & mat',color:'#7aa83a'},
  {id:'natur',name:'Siljan & skogen',color:'#2f6b34'},
  {id:'energi',name:'Energi & klimat',color:'#e0a92b'},
  {id:'stad',name:'Centrum & resor',color:'#3f8fc2'},
  {id:'naring',name:'Besökare & kunskap',color:'#a0673c'},
  {id:'gemenskap',name:'Byarna & gemenskapen',color:'#d0614e'},
  {id:'halsa',name:'Omsorg & hälsa',color:'#c9497a'},
  {id:'teknik',name:'Teknik, AI & det analoga',color:'#7c5cc4'},
  {id:'resiliens',name:'Vatten & beredskap',color:'#4a8c7a'},
];
// What builds Rättvik's capacity for change, said when a plan asks too much (model.js capacity()): care that
// keeps up, trust and the villages' associations, young people with a say – and too few of working age.
export const CAPACITY_NOTE={
  sv:'I Rättvik bärs förändringen av en omsorg som räcker till, av tilliten och föreningslivet i byarna och av unga som får vara med – och av för få i arbetsför ålder. Bostäder för alla åldrar, omsorg nära och byarnas röst gör att bygden orkar mer.',
  en:'In Rättvik change is carried by care that keeps up, by trust and the villages\' associations and by young people who have a say – and by too few of working age. Homes for every age, care close by and the villages\' voice let the community take on more.',
  it:'A Rättvik il cambiamento poggia su un\'assistenza che regge, sulla fiducia e sulle associazioni dei villaggi, su giovani che hanno voce – e su troppo poche persone in età lavorativa. Case per tutte le età, cure vicine e la voce dei villaggi permettono di fare di più.',
};
export const LEVER_DEFS=[
  {id:'regionalt',theme:'mat',name:'Fäbodarna och maten',short:'Fäbodar och gårdar, mejerier och kvarnar – och maten i kommunens kök',cost:1.2,tau:14,
    levels:['Som idag: färre kor och fäbodar för varje år, och maten kommer långt ifrån','Skolor och äldreboenden lagar säsongens mat från bygden och skoljordbruket','Levande fäbodar med unga brukare, mejerier och kvarnar – mindre men bättre kött, från betet','Matsuveränitet: spannmål på åkrarna igen och ett matråd som planerar för att bygden ska kunna föda sig själv']},
  {id:'hav',theme:'natur',name:'Levande Siljan',short:'Fria vandringsvägar för öring och harr, restaurerade åmynningar och en reglering för livet i sjön',cost:.8,tau:18,
    levels:['Som idag: Siljan regleras för kraften, fiskvägarna i Österdalälven byggs','Enåns mynning och stränderna restaureras, skyddszoner längs åarna','Fiskvägar förbi fler dammar och nya lekplatser för öring och harr','Siljans återkomst: en naturligare vårflod och en sjö som regleras för livet i den']},
  {id:'skog',theme:'natur',name:'Skogen och myrarna',short:'Mer skyddad skog, hyggesfritt nära byarna och myrar som håller vattnet',cost:.9,tau:20,
    levels:['Som idag: 1,8 % av kommunen är skyddad natur','Nya kommunala naturreservat och skogsbete runt fäbodarna','Hyggesfritt i den tätortsnära skogen och återvätta myrar','Levande skogsbygd: lika mycket skyddad natur som i riket, och myrarna som vattenmagasin']},
  {id:'vind',theme:'energi',name:'Vindkraften i norr',short:'Vindkraft i skogarna i norr, delägd av byarna och med intäkter till dem som bor nära',cost:1,tau:12,
    levels:['Som idag: Hedbodbergets 15 verk – det som har tillstånd i norr byggs bara om marknaden vill','Hedbodberget förnyas och en första etapp i norr byggs, med kommunen som delägare','Broboberget och Lannaberget byggs, delägda av byarna – och elen låter kalkverket fånga sin koldioxid','Energibygd: också Gundåsmoren, och el till vätgas i Furudal']},
  {id:'sol',theme:'energi',name:'Solen på taken',short:'Solceller på tak, lador och parkeringar, ägda av byarnas energigemenskaper',cost:.8,tau:10,
    levels:['Enskilda solcellstak som idag','Solceller på kommunens och bostadsbolagets tak','Energigemenskaper i byarna: solceller på lador och parkeringar, delade batterier','Varje lämpligt tak producerar – utom där kulturmiljön ska skyddas']},
  {id:'effektivitet',theme:'energi',name:'Rusta husen och återbruka',short:'Energirenovering och underhåll, och att laga och låna i stället för att köpa nytt',cost:1.1,tau:15,
    levels:['Som idag: eftersatt underhåll i kommunens hus','Energirenovering av allmännyttan och kommunens lokaler','Återbruk och reparation i Lokstallarna, lånebibliotek för saker','Nollavfall: allt i bygden lagas, lånas eller återbrukas']},
  {id:'bilfritt',theme:'stad',name:'Centrum och stranden',short:'Ett gångvänligt centrum nära Siljan – gatorna blir trädgårdar och mötesplatser',cost:.8,tau:10,
    levels:['Bilar och bilveckan i centrum som idag','Gångfartsgator kring Storgatan, torget och vägen ner till stranden','Bilfritt centrum: gator och parkeringar blir trädgårdar, och bilveckans cruising flyttar ut','Bilfri tätort: gatorna blir trädgårdar och bilarna parkeras i utkanten']},
  {id:'kollektivt',theme:'stad',name:'Resor till byarna',short:'Bussar, anropsstyrda skyttlar och cykelvägar mellan byarna',cost:1.4,tau:12,
    levels:['Bussar som idag','Tätare bussar runt Siljan, cykelvägar och samåkning mellan byarna','Anropsstyrda skyttlar till varje by som möter tågen, och båtlinjer på Siljan om sommaren','Avgiftsfria, självkörande skyttlar till varje by dygnet runt']},
  {id:'forbindelser',theme:'stad',name:'Tåget',short:'Siljansbanan och Dalabanan: tätare och snabbare tåg till Borlänge och Stockholm',cost:1,tau:18,
    levels:['Som idag: två direkttåg om dagen till Stockholm','Tätare regionaltåg runt Siljan och till Borlänge','Mötesspår och snabbare tåg: Stockholm på under tre timmar','Direkttåg varje timme och nattåg till kontinenten']},
  {id:'turism',theme:'naring',name:'Besöksnäringen året runt',short:'Från en sommarvecka med bil till en bygd att besöka året runt – utan bil',cost:.9,tau:12,
    levels:['Som idag: juli, campingen och bilveckan','Leder, cykel och kanot: Siljansleden och geoparken hela året','Fäbodar, kultur och friluftsliv året runt, och resor hit utan bil','Siljansbygden året runt: gästerna stannar längre, och de flesta kommer med tåg']},
  {id:'bogemenskap',theme:'gemenskap',name:'Bo i alla åldrar',short:'Hyresrätter för unga, trygghetsboenden och generationshus',cost:1.2,tau:15,
    levels:['Som idag: få lediga hyresrätter och inga kollektivhus','Nya hyresrätter för unga och äldre, med gemensamma lokaler','Generationshus i samhället och i byarna, som ekobyn i Persborg','Att bo tillsammans över generationerna är det vanliga']},
  {id:'demokrati',theme:'gemenskap',name:'Byarnas röst',short:'Dialoger i bystugorna, byarnas egna budgetar och lottade råd',cost:.5,tau:6,
    levels:['Representativ demokrati som idag','Dialogmöten i bystugorna före stora beslut','Byarnas egna budgetar och lottade medborgarråd','Ett ungdomsråd och ett barnbarnsombud med veto i frågor som binder bygden']},
  {id:'forebyggande',theme:'halsa',name:'Omsorg och hälsa nära',short:'Sköterskan i byn, hembesök innan någon blir sjuk, natur och rörelse på recept',cost:.8,tau:10,
    levels:['Vård när man blir sjuk','Rörelse och natur på recept, och hembesök som förebygger fall','Hälsostugor med sköterska i byarna och trivselträffar varje vecka','Hälsa i allt: en bygd planerad för rörelse, möten och friska äldre']},
  {id:'ai',theme:'teknik',name:'Välfärdsteknik och AI',short:'Fjärrtillsyn, sensorer och AI i omsorg, skola och förvaltning',cost:.9,tau:8,
    levels:['Som idag: digital nattillsyn och enstaka försök','Försök med AI i vården, med människor som fattar besluten','AI som Dalarnas kommuner äger tillsammans, i omsorg, skola och förvaltning','Automatisera allt som går, så att personalen räcker till']},
  {id:'analog',theme:'teknik',name:'Det analoga',short:'Skärmfri barndom, papper och kontanter som reserv, en människa i varje lucka',cost:.5,tau:8,
    levels:['Digitalt först','Mobilfri skola och böcker i undervisningen','Skärmfri barndom till 12 år och analoga reserver i varje by','Rätten till ett analogt liv: varje tjänst finns också utan skärm']},
  {id:'kunskap',theme:'naring',name:'Kunskapsbygden',short:'Byskolor som bycentrum, lärcentrum och naturbruket som levande labb',cost:.8,tau:12,
    levels:['Som idag','Lärcentrum vid stationen för studier på distans','Byskolorna blir byns hus, och naturbruket ett labb för fäbodar, skog och Siljan','Livslångt lärande för alla – och undersköterskor och lärare utbildas i bygden']},
  {id:'beredskap',theme:'resiliens',name:'Vatten och beredskap',short:'Nya ledningar, en reservvattentäkt, lager och el i ö-drift',cost:1.2,tau:10,
    levels:['Hemberedskap som idag','Ledningsnätet förnyas, nödvattenplan och kommunala lager','En reservvattentäkt, lager för 30 dagar och ö-drift från Gråda','Varje by klarar sig själv i 90 dagar: vatten, mat och el']},
  {id:'anpassning',theme:'resiliens',name:'Plats för vattnet',short:'Skyfallsytor, öppna diken och plats för Siljans högvatten',cost:1,tau:14,
    levels:['Som idag','Skyfallsytor och öppna diken i de mest utsatta kvarteren','Campingen flyttar upp, strandängar tar emot högvattnet och strandstråken höjs','Svampbygd: varje by tar hand om sitt vatten, och nya hus byggs över 165 meter']},
];
// The levers' order in share links: Rättvik's own (it only ever grows from here).
export const LINK_ORDER=['regionalt','hav','skog','vind','sol','effektivitet','bilfritt','kollektivt','forbindelser','turism','bogemenskap','demokrati','forebyggande','ai','analog','kunskap','beredskap','anpassning'];

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
// Which research each lever leans on: Rättvik's own records (base:<id>), its evidence (rattvik_e*) and the
// engine's general research.
export const LEVER_EVIDENCE={
  regionalt:['base:fabodbete_hektar','base:mjolkkor_antal','base:spannmal_hektar','base:sjalvforsorjningsgrad_vikt_lan','base:lokalproducerade_livsmedel','base:andel_ravaror_atertaget','food_e5','food_e34','food_e9','food_e2'],
  hav:['base:siljan_ekologisk_status','base:siljansoring_lekomraden_utestangda','base:osterdalalven_fiskvagar','base:siljansbadet_prov_algblomning','rattvik_e6','biodiversity_baltic_e15'],
  skog:['base:skyddad_natur_total','base:naturreservat_antal','base:rodlistade_arter_observerade_antal','base:foryngringsavverkning_anmald_hektar','base:skogsmark_andel_landareal','rattvik_e7','biodiversity_baltic_e15','biodiversity_baltic_e13'],
  vind:['base:vindkraft_installerad_effekt','base:elproduktion_vindkraft','base:broboberget_lannaberget_effekt','base:broboberget_lannaberget_produktion','base:kalkverk_co2_fossil','rattvik_e1','rattvik_e2','rattvik_e8','energy_e17'],
  sol:['base:solceller_installerad_effekt','base:elproduktion_sol','base:riksintressen_kulturmiljo_antal','energy_e17','energy_e20'],
  effektivitet:['base:energianvandning_lokaler','base:rfab_underhall_budget','base:kretsloppsplan_mal_avfallsminskning','base:kommunalt_avfall_kg_per_inv','energy_e12','governance_e8'],
  bilfritt:['base:ccw_bilar','base:classic_car_week_andel_brott','base:hardgjord_mark_andel_tatort','mobility_e8','mobility_e13','mobility_e19'],
  kollektivt:['base:kollektivtrafik_vardagsresor_bra_andel','base:kollektivtrafik_marknadsandel','base:personbilar_per_1000_inv','base:utpendling_antal','base:batlinje_rattvik_leksand_1895','base:gustaf_wasa_byggd','rattvik_e19','rattvik_e20','mobility_e5','mobility_e14'],
  forbindelser:['base:restid_tag_stockholm_min','base:direkttag_stockholm_per_vardag','base:restid_uppsala_borlange_efter_atgarder_min','base:mal_restid_mora_stockholm_min','base:restid_buss_falun_min','base:bilandel_turistresor'],
  turism:['base:gastnatter','base:gastnatter_sommar_andel','base:gastnatter_vinter','base:camping_andel_gastnatter','base:turism_arsarbetskrafter','base:skiddagar_2100_rcp45','base:istacke_dagar_2016_2026','rattvik_e3','rattvik_e11','rattvik_e21'],
  bogemenskap:['base:bostadsmarknadslage_bme','base:andel_hyresratt','base:persborg_planerade_bostader','base:kollektivhus_lagenheter_lan','base:ensamhet_hemtjanst_65plus','base:befolkning_siljansbygden_1990_2024','rattvik_e16','rattvik_e13','community_e12','community_e14','community_e13'],
  demokrati:['base:unga_mojlighet_paverka','base:valdeltagande_kommunval','base:foreningar_i_registret','rattvik_e17','rattvik_e18','governance_e1','community_e18','community_e21','community_e17'],
  forebyggande:['base:ensamhet_hemtjanst_65plus','base:hemtjanst_65plus_antal','base:okning_85_89_till_2034','base:fysiskt_aktiva','rattvik_e4','health_e1','health_e12','community_e9'],
  ai:['base:forsorjningskvot','base:tillsvidareanstallda','rattvik_e5','tech_ai_e1','tech_ai_e3','tech_ai_e17','digital_resilience_e15'],
  analog:['base:unga_skarmtid_over_3h','base:gymnasieelever_ar1_mar_bra','base:internet_icke_anvandare','digital_resilience_e5','digital_resilience_e4','digital_resilience_e8','digital_resilience_e7','digital_resilience_e15'],
  kunskap:['base:unga_tror_flytta_fran_kommunen','base:eftergymnasial_utbildning_25_64','base:gymnasieelever_i_kommunen','base:naturbruk_forstahandssokande','base:grundskolor_antal','base:ak9_betyg_alla_amnen'],
  beredskap:['base:vattentakt_tillstand_max_dygn','base:andel_egen_brunn','base:va_ledningsnat','base:hemberedskap_en_vecka','resilience_e1','resilience_e5','resilience_e23'],
  anpassning:['base:siljan_100arsniva_idag','base:lagsta_strandgata_niva','base:camping_andel_under_100arsniva','base:skyfall_2023_skadade_villor','base:skyfall_klimatfaktor_2071_2100_rcp85','base:lagsta_grundlaggningsniva_siljan','mobility_e15','mobility_e16'],
};
