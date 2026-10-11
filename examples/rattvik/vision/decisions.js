import { LANG, L, t, dec } from '@engine/i18n.js';
import { INDICATORS } from '@engine/data/indicators.js';
// Rättvik's journey: three or four dilemmas at the start of each decade, on Rättvik's own levers (levers.js).
// Each option sets lever levels from that decade on; an empty set keeps the course the earlier decades set.
// `ev` lists research ids shown as "Forskningen säger": claims in site/research/vision-research.json, Rättvik's
// own evidence (research/evidence.json, rattvik_e*) or its records as "base:<id>" (research/baseline.json, from
// the deep research in research/deep/). The first two decades are the decisions the kommun faces now
// (research/deep/kommun-plats-historia-notes.md, "Beslut framför oss"); later decades are imagined situations
// built on the trends, with their facts dated, so that no context depends on what was chosen before.
// Earlier choices matter later because each lever climbs a ladder through the century: a later dilemma offers
// the same lever only at the level an earlier one could reach or higher, or keeps it ({}), so no option quietly
// undoes an earlier choice – the few that do say so (Siljan's power first, the turbines torn down, a digital
// childhood). The wind decided in 2026 decides when the lime works captures its carbon dioxide; the villages'
// voice of 2046 eases what comes after (model.js: resistance); homes for the young (2056) lead to generation
// houses and villages full again (2076, 2086); the summer farms of 2036 to a bygd that can feed itself (2076).
// No two dilemmas of a decade set the same lever. Every option's text says what Rättvik's model does with it.
export const DECISIONS={
  2026:[
    {id:'bilveckan',title:'Bilveckan',ev:['base:ccw_bilar','base:sommarbefolkning_topp_faktor','base:classic_car_week_andel_brott','base:classic_car_week_gastnatter','base:turismkonsumtion','rattvik_e11','mobility_e13','mobility_e19'],
      ctx:'Classic Car Week har hållits vecka 31 sedan 1992, och på veckans lördag är tre gånger så många människor i kommunen som en vanlig dag. Veckan ger omkring 35 000 gästnätter, och en del handlare dubblar sin omsättning. Men enligt polisen anmäls en femtedel av årets brott i kommunen just den veckan, och kommunen vill se förändringar till 2027.',
      options:[
        {label:'Som förr',text:'Handeln och besöksnäringen behåller sommarens största vecka, och Rättvik ett av sina mest kända evenemang – men bullret, fyllan och brotten följer med.',set:{bilfritt:0}},
        {label:'Gångfart i centrum',text:'Storgatan, torget och vägen ner till stranden blir gångfartsgator, men bilveckan får vara kvar som den är. Ett lugnare centrum resten av året och nästan alla veckans gäster kvar – men gångfartsgatorna möter protester, och cruisingen genom centrum fortsätter varje sommar.',note:'När veckan ställdes in 2020 kom cruisingen ändå.',set:{bilfritt:1}},
        {label:'Ett bilfritt sommarcentrum',text:'Torget och gatorna kring stationen blir bilfria hela sommaren, med marknad och musik, och bilveckans cruising flyttar ut till Rättviksparken och travbanan. Lugnare och grönare – men beslutet delar bygden, handlarna kan förlora sin bästa vecka, och ungefär var fjärde av veckans gästnätter hamnar någon annanstans.',set:{bilfritt:2}},
      ]},
    {id:'energiplanen',title:'Energiplanen, vinden och kalkverket',ev:['base:lokal_elproduktion_andel_av_elanvandning','base:vindkraft_antal_verk','base:vindkraft_lokalagda_verk','base:broboberget_lannaberget_produktion','base:kalkverk_co2_fossil','rattvik_e1','rattvik_e2','rattvik_e8','rattvik_e12','energy_e17'],
      ctx:'Rättvik gör tre fjärdedelar av den el som kommunen använder, mest i Hedbodbergets 15 vindkraftverk, och två av dem ägs av kommunen och föreningen Rättviksvind. Broboberget och Lannaberget i norr har tillstånd för upp till 115 verk men inget investeringsbeslut, och för Gundåsmoren har kommunen veto. Industrin, framför allt kalkverket, står för fyra femtedelar av kommunens utsläpp; koldioxiden ur kalkstenen går bara att fånga in, och det kräver mycket el. Våren 2027 ska kommunen anta en energi- och klimatplan.',
      options:[
        {label:'En första etapp',text:'Hedbodberget förnyas när verken blir gamla, och en första etapp byggs i norr med kommunen som delägare, men Gundåsmoren får nej. Mer el och lite mer pengar till bygden – men det mesta i norr ägs av bolag utifrån, och kalkverket fångar in sin koldioxid först när EU:s utsläppshandel tvingar fram det.',set:{vind:1}},
        {label:'Byarna äger vinden',text:'Kommunen och byarna går in som delägare i Broboberget och Lannaberget, och de som bor nära får del av intäkterna. Elen räcker till att kalkverket börjar fånga in sin koldioxid flera år tidigare, och mer av den – men skogen och tystnaden i norr förändras för dem som bor där, och byggs det över deras huvuden blir det strid.',note:'Regeringen föreslog 2026 att den som äger ett bostadshus inom nio verkshöjder från ett vindkraftverk ska få en del av intäkterna.',set:{vind:2}},
        {label:'Solen först',text:'Kommunen säger nej till Gundåsmoren och satsar på solceller på tak, lador och parkeringar, ägda av byarnas energigemenskaper. Elen blir bygdens egen – men solen ger minst när det är kallt och mörkt, det som har tillstånd i norr byggs ändå om marknaden vill, och kalkverket får vänta på utsläppshandeln.',set:{sol:2}},
      ]},
    {id:'byskolorna',title:'Byskolorna',ev:['base:grundskolor_antal','base:satra_skola_elever','base:forandring_barn_6_12_till_2034','base:ak9_betyg_alla_amnen','base:unga_tror_flytta_fran_kommunen','base:tillsvidareanstallda','demography_e8'],
      ctx:'Rättvik har åtta kommunala grundskolor, och den minsta, Sätra, har ett tiotal elever. Barnen i åldern 6–12 år väntas bli 9 % färre till 2034, och 2025 hade bara 66 % av niondeklassarna betyg i alla ämnen. Rättviksmodellen lovar att bevara byarna och byskolorna – men små skolor kostar mer per elev och är svåra att bemanna med behöriga lärare.',
      options:[
        {label:'Alla skolor kvar',text:'Varje by behåller sin skola som den är, och barnfamiljerna får ett skäl att bo kvar. Men det kostar mer per elev, behöriga lärare räcker inte till alla klassrum, och den som vill studera vidare måste fortfarande flytta.',set:{}},
        {label:'Färre skolor och ett lärcentrum',text:'Lågstadiet och mellanstadiet samlas i färre skolor med skolskjuts, och det som sparas går till behöriga lärare och ett lärcentrum vid stationen för den som vill studera vidare på distans. Fler läser vidare utan att flytta – men byarna förlorar en mötesplats, och de yngsta får långa bussresor.',set:{kunskap:1}},
        {label:'Skolan blir byns hus',text:'Byskolorna blir kvar och delar hus med förskolan, biblioteket och de äldres träffar, och naturbruksgymnasiet blir ett labb för fäbodar, skog och Siljan. Huset lever hela dagen och fler unga ser en framtid här – men det kostar mest av de tre vägarna, och en del lektioner sker via skärm.',set:{kunskap:2}},
      ]},
    {id:'dalaenergi',title:'Pengarna från Dala Energi',ev:['base:dala_energi_reavinst','base:resultat_2025_exkl_reavinst','base:besparing_socialforvaltning','base:okning_85_89_till_2034','base:rfab_underhall_budget','rattvik_e4'],
      ctx:'När kommunen 2025 löste in hälften av sina aktier i Dala Energi gav det en vinst på 311 miljoner kronor, mer än en tredjedel av ett års skatteintäkter och statsbidrag. För pengarna köptes en tiondel av Sambygd, som äger el- och fibernätet. Utan engångsvinsten blev resultatet 1,7 %, under målet på 2 %, och samma år varslades omkring 60 tjänster i äldreomsorgen och LSS – inför ett decennium då 85–89-åringarna väntas bli nästan tre fjärdedelar fler.',
      options:[
        {label:'Behåll nätet',text:'Kommunen sitter kvar som delägare i el- och fibernätet, med utdelning och en röst när nätet byggs ut. Men pengarna är bundna, och äldreomsorgen och husen får klara sig med det som finns.',set:{}},
        {label:'En buffert för de äldsta',text:'Andelen säljs, och pengarna går till äldreomsorgens toppår kring 2034: hembesök som förebygger fall, rörelse på recept och trivselträffar i byarna. Fler klarar sig hemma längre och färre är ensamma – men det är engångspengar till en kostnad som består.',note:'En allvarlig fallolycka ger i snitt 322 extra hemtjänsttimmar året efter.',set:{forebyggande:1}},
        {label:'Sälj och rusta husen',text:'Pengarna går till Rättviks Fastigheter: eftersatt underhåll, energirenovering och nya hyresrätter med gemensamma lokaler för unga och äldre. Bättre hus, lägre energikostnader och fler som kan flytta hemifrån eller från villan – men pengarna räcker bara en gång.',note:'Bostadsbolaget har 30 kronor per kvadratmeter om året till underhåll men bedömer att det behövs 120–130.',set:{effektivitet:1,bogemenskap:1}},
      ]},
  ],
  2036:[
    {id:'vardnara',title:'Vården i byarna',ev:['base:okning_85_89_till_2034','base:hemtjanst_65plus_antal','base:ensamhet_hemtjanst_65plus','base:listade_invanare_per_allmanlakare','base:hyrlakare_andel_vardcentral','rattvik_e5','tech_ai_e1','digital_resilience_e15'],
      ctx:'Kommunen räknade med 74 % fler 85–89-åringar 2034 än 2025, allt mer avancerad vård gavs i hemmen, och hälften av de äldre med hemtjänst besvärades av ensamhet. Regionens vårdbuss till Furudal, Bingsjö och Boda beslutades 2023 men hade inte kommit tre år senare, och hyrläkare gjorde nästan en femtedel av läkararbetet på länets vårdcentraler.',
      options:[
        {label:'Vård via skärm och sensorer',text:'Läkaren nås på skärmen, sensorer larmar i hemmen och AI hjälper till att sortera ärendena, men det är människor som fattar besluten. Fler kan bo kvar i byarna – men den som inte klarar tekniken hamnar utanför, och besöken blir färre.',note:'Nästan var fjärde svensk har avstått från att boka vård för att e-tjänsterna var för svåra.',set:{ai:1}},
        {label:'Sköterskan i byn',text:'Hälsostugor med distriktssköterska i Furudal och Boda, hembesök innan någon blir sjuk och trivselträffar varje vecka. Nära och mänskligt, och de gamla lever längre – men det kräver personal som både kommunen och regionen redan har svårt att hitta.',set:{forebyggande:2}},
        {label:'Ett hälsokvarter i samhället',text:'Vårdcentralen, äldreboendet och familjecentralen vid Centralgatan växer ihop till ett hälsokvarter med korta avstånd för personalen. Det kostar inte mer än i dag – men byborna får längre resor, och fler gamla måste flytta från sin by.',set:{}},
      ]},
    {id:'dalabanan',title:'Tåget till Stockholm',ev:['base:restid_tag_stockholm_min','base:direkttag_stockholm_per_vardag','base:restid_buss_falun_min','base:restid_uppsala_borlange_efter_atgarder_min','base:mal_restid_mora_stockholm_min','base:flyglinje_mora_arlanda_statligt_stod','base:bilandel_turistresor'],
      ctx:'År 2026 gick två direkttåg om dagen till Stockholm, det snabbaste på 3 timmar och 21 minuter, och bussen till Falun var snabbare än tåget sedan spåret dit revs på 1960-talet. Upprustningen av Dalabanan skulle korta resan med sju minuter till omkring 2031, men regionens mål – Mora–Stockholm på under tre timmar – hade inga pengar.',
      options:[
        {label:'Tätare tåg runt Siljan',text:'Fler regionaltåg mellan Mora, Rättvik, Leksand och Borlänge och bättre byten mot Stockholm. Billigt och vardagsnära – men resan till Stockholm blir bara en kvart kortare och tar fortfarande över tre timmar.',set:{forbindelser:1}},
        {label:'Stockholm på under tre timmar',text:'Rättvik driver på och betalar en del av mötesspår och snabbare tåg. Då går det att bo vid Siljan och arbeta i Stockholm några dagar i veckan, och fler besökare kommer med tåg – men en liten kommuns pengar binds i statens järnväg i många år.',set:{forbindelser:2}},
        {label:'Laddstolpar och buss',text:'Kommunen satsar på laddning och bussen till Falun i stället för på järnvägen. Det blir billigare – men nio av tio besökare kommer fortfarande med bil, och den som inte kör har svårt att ta sig härifrån.',set:{forbindelser:0}},
      ]},
    {id:'skogen',title:'Skogen',ev:['base:skogsmark_andel_landareal','base:skyddad_natur_total','base:foryngringsavverkning_anmald_hektar','base:skogsagare_privatpersoner_antal','base:rodlistade_arter_observerade_antal','base:lerdalsberget_naturreservat','rattvik_e7','biodiversity_baltic_e15'],
      ctx:'Nio tiondelar av Rättviks land är skog, men bara 1,8 % av kommunen är skyddad natur, mot 12,1 % i riket, och sedan 2000 har 556 rödlistade arter hittats här. Omkring 1 400 hektar anmäls för avverkning varje år, och en tredjedel av skogen ägs av 2 291 privatpersoner, 679 av dem utanför Dalarna. EU:s restaureringsförordning kräver att all natur som behöver det ska restaureras till 2050.',
      options:[
        {label:'Reservat och skogsbete',text:'Fler kommunala naturreservat som Lerdalsberget, och skogsbete runt fäbodarna. Den gamla skogen nära byarna får stå kvar – men varje reservat ska köpas loss, och skogsägarna får mindre virke att sälja.',set:{skog:1}},
        {label:'Hyggesfritt och blöta myrar',text:'Hyggesfritt i skogen runt samhället och byarna, och utdikade myrar läggs igen så att de håller vattnet. Mer liv i skogen, och myrarna dämpar både skyfall och torka – men skogsägarna får mindre betalt, och utan deras stöd blir det strid om varje bestånd.',set:{skog:2}},
        {label:'Skogen är ägarnas',text:'Skogsbruket fortsätter som i dag, och ungefär ett nytt reservat kommer till vart tionde år. Virket och jobben stannar i bygden – men den gamla skogen krymper, och de hotade arterna får det svårare.',set:{}},
      ]},
    {id:'fabodarna',title:'Fäbodarna och maten',ev:['base:fabodbete_hektar','base:mjolkkor_antal','base:jordbruksforetag_antal','base:lokalproducerade_livsmedel','base:andel_ravaror_atertaget','base:sjalvforsorjningsgrad_vikt_lan','food_e34','food_e5'],
      ctx:'Fäbodbruket blev Unescos immateriella kulturarv 2024, och fäbodbetet var två tredjedelar av Rättviks betesmark. Men mjölkkorna halverades mellan 1981 och 2023 och fanns till slut på fem gårdar, och en tredjedel av länets bönder var över 60. Kommunens kök köpte 40 % lokalproducerat 2025, nästan en femtedel av råvarorna från naturbruksgymnasiets egen gård.',
      options:[
        {label:'Bygdens mat i köken',text:'Skolor och äldreboenden lagar säsongens mat av kött, mjölk, potatis och spannmål från bygdens gårdar, fäbodar och skoljordbruket. Pengarna stannar i bygden och korna på betet – men maten kostar mer, och menyn följer säsongen.',set:{regionalt:1}},
        {label:'Levande fäbodar',text:'Unga brukare får mark, stöd och mejerier, och korna går på skogsbete om somrarna som förr; köken tar mindre men bättre kött, från betet. Landskapet hålls öppet och kunskapen förs vidare – men det är hårt arbete för små pengar, och vargen och björnen finns i skogen.',set:{regionalt:2}},
        {label:'Låt skogen ta tillbaka',text:'Stödet går till de gårdar som bär sig, och de minsta fäbodarna växer igen. Billigare – men det öppna landskapet krymper, och ett levande kulturarv blir ett museum.',set:{}},
      ]},
  ],
  2046:[
    {id:'regleringen',title:'Siljans reglering',ev:['base:siljan_ekologisk_status','base:siljansoring_lekomraden_utestangda','base:osterdalalven_fiskvagar','base:elproduktion_vattenkraft','rattvik_e6','biodiversity_baltic_e15'],
      ctx:'Siljan regleras från Gråda kraftverk sedan 1951, och utbyggnaden av Österdalälven stängde ute Siljansöringen från mer än 95 % av dess lekplatser; ålen försvann helt. Fiskvägarna förbi Spjutmo, Blyberg och Väsa öppnade en del av älven igen 2023, men sjön skulle ha nått god ekologisk status till 2033 och har den inte. Nu ställs fler fiskvägar och en naturligare vårflod mot elen och reglerkraften från dammarna.',
      options:[
        {label:'Fiskvägar och fria åar',text:'Fiskvägar förbi fler dammar och nya lekplatser i åarna, så att öring och harr kan vandra igen. Livet i sjön kommer långsamt tillbaka – men kraftverken förlorar en del el.',set:{hav:2}},
        {label:'Sjön före kraften',text:'Siljan regleras för livet i sjön, med en naturligare vårflod och lekplatser som återställs i stor skala. Sjön kan nå god status – men dammarna ger mindre el och reglerkraft, och vattenståndet varierar mer.',set:{hav:3}},
        {label:'Kraften går först',text:'Regleringen justeras bara lite, och vattenkraften ger el och reglerkraft som förut – Gråda kan till och med starta elnätet på egen hand i en kris. Billigast och tryggast för elen – men öringen når bara de lekplatser som fiskvägarna redan har öppnat.',set:{hav:0}},
      ]},
    {id:'ledningarna',title:'Rören under gatorna',ev:['base:va_ledningsnat','base:va_skyfall_riskplatser','base:va_brukningsavgift_hojning_2025','base:koncern_laneskuld_per_invanare','base:skyfall_2023_skadade_villor','base:dimensionerande_skyfall_100ar_2h','mobility_e15','mobility_e16'],
      ctx:'De 60 milen vatten- och avloppsledningar byggdes till stor del 1955–1979, och de äldsta är nu över 90 år gamla. Dagvattnet renas inte, och elva pumpstationer riskerar att svämma över vid skyfall. Redan 2025 höjdes taxan med 20 %, och kommunkoncernens lån var 113 000 kronor per invånare, mest för vatten och avlopp.',
      options:[
        {label:'Förnya i rask takt',text:'Gamla ledningar byts i snabb takt, och en nödvattenplan och kommunala lager kommer till. Färre läckor och bräddningar och tryggare dricksvatten – men taxan höjs igen och lånen växer.',set:{beredskap:1}},
        {label:'Ge regnet plats',text:'Öppna diken, dammar och gröna tak tar hand om regnet där det faller och avlastar de gamla rören. Billigare än nya rör och färre översvämmade källare – men det tar mark, och rören blir inte yngre.',set:{anpassning:1}},
        {label:'Laga det som går sönder',text:'Taxan hålls nere, och pengarna räcker till annat. Men ledningarna blir äldre för varje år, och nästa skyfall möter samma nät.',set:{}},
      ]},
    {id:'byarnas_rost',title:'Byarnas röst',ev:['base:foreningar_i_registret','base:valdeltagande_kommunval','base:unga_mojlighet_paverka','rattvik_e17','rattvik_e18','community_e18','community_e21','governance_e1'],
      ctx:'År 2026 fanns 24 bystuge- och bygdegårdsföreningar i kommunen, och 84 % röstade i kommunvalet. Men bara drygt en femtedel av de unga tyckte att de kunde föra fram sina åsikter till dem som bestämmer, och deras förtroende för politikerna hade fallit från 45 till 36 % på tre år. Vindkraften, bilveckan och skogen har delat bygden – och medborgarråd gör besluten mer legitima, om det de föreslår också blir av.',
      options:[
        {label:'Fråga byarna först',text:'Kommunen håller dialogmöten i bystugorna och på skolorna före stora beslut, men fullmäktige bestämmer som förut. Billigt och snabbt – men den som inte kommer på mötena hörs inte.',set:{demokrati:1}},
        {label:'Byarna får en egen budget',text:'Varje bygd bestämmer själv över en del av investeringarna, och lottade invånare ger råd i de stora frågorna. Fler blir delaktiga och stora förändringar möter mindre motstånd – men det tar tid, och de som redan hörs mest kan ta över mötena.',set:{demokrati:2}},
        {label:'Ett ungdomsråd med veto',text:'Byarnas budgetar och medborgarråd, och dessutom ett lottat råd av unga och ett ombud för barnbarnen som får stoppa beslut som binder bygden längre än en generation. Framtiden får en röst – men fullmäktige lämnar ifrån sig makt till några som ingen har valt.',set:{demokrati:3}},
      ]},
    {id:'resorna',title:'Bussar och båtar till byarna',ev:['base:kollektivtrafik_vardagsresor_bra_andel','base:personbilar_per_1000_inv','base:kollektivtrafik_marknadsandel','base:batlinje_rattvik_leksand_1895','base:gustaf_wasa_byggd','rattvik_e19','rattvik_e20','mobility_e14'],
      ctx:'År 2025 tyckte bara drygt en tredjedel av rättvikarna att kollektivtrafiken fungerade för vardagens resor, mot två tredjedelar i riket, och kommunen hade 679 bilar per 1 000 invånare. Förr band ångbåtarna ihop byarna runt Siljan – från 1895 gick en båt mellan Rättvik och Leksand – tills tåget och bilarna tog över, och sedan dess går bara Gustaf Wasas sommarturer. Eldrivna båtar går redan i kollektivtrafik på andra håll i landet, och till Leksand är det två mil över vattnet.',
      options:[
        {label:'Tätare bussar och cykelvägar',text:'Fler turer på stråken runt Siljan, cykelvägar mellan byarna och samåkning. Enkelt och beprövat – men den som bor långt från stråken behöver fortfarande bilen, och på Siljan går bara Gustaf Wasa.',set:{kollektivt:1}},
        {label:'Skyttlar och sommarbåtar',text:'Små eldrivna bussar som beställs med telefonen hämtar vid grinden och möter tågen, och om sommaren går eldrivna båtar från Långbryggan till byarna runt Siljan – Tällberg, Leksand, Siljansnäs, Sollerön, Vikarbyn och Mora. Bilen behövs mindre och byarna får en väg till varandra igen – men varje resa kostar mer än med en vanlig buss, och båtarna går bara när isen har gått.',set:{kollektivt:2}},
        {label:'Samåkning och laddstolpar',text:'Kommunen satsar på samåkning och laddning i stället för bussar som går nästan tomma. Billigast – men den som inte kan köra, ung som gammal, blir beroende av andra.',set:{kollektivt:0}},
      ]},
  ],
  2056:[
    {id:'vattnet',title:'En andra vattentäkt',ev:['base:vattentakt_tillstand_max_dygn','base:andel_egen_brunn','base:befolkning_juli_okning','base:dagar_lag_markfuktighet_2069_2098_rcp85','base:dryck_hemma_en_vecka','resilience_e5','resilience_e4','resilience_e23'],
      ctx:'Tätorten får sitt vatten ur Gärdsjö grundvattentäkt, med tillstånd för 4 500 kubikmeter om dygnet, och nästan fyra av tio rättvikare har egen brunn. I juli är det 58 % fler människor i kommunen än i november, och med höga utsläpp väntades marken vara torr 30–40 dagar om året i slutet av seklet, mot 5–10 dagar kring 2015. Totalförsvaret planerar för kriser som varar i minst tre månader.',
      options:[
        {label:'En reservvattentäkt',text:'Tätorten får en andra vattentäkt, kommunen lager för en månad, och Gråda kan driva elnätet i ö-drift i en kris. Beprövat och rimligt – men det kostar, och byarna får till stor del klara sig själva.',set:{beredskap:2}},
        {label:'Varje by klarar sig själv',text:'Varje by får reservvatten, el som kan gå i ö-drift och mat för två månader – nästan tre om bygden odlar sin egen – och bystugorna blir samlingsplatser i kris. Tryggt även om landet står still – men dyrt att hålla i ordning år efter år för något som kanske aldrig händer.',set:{beredskap:3}},
        {label:'Spara i stället för att borra',text:'Vattenmätare, snålare hus och regnvatten till trädgårdarna, och att laga och låna i stället för att köpa nytt. Behovet minskar och avfallet med det – men ett riktigt torrår räcker det inte långt, och i en kris finns ingen reserv.',set:{effektivitet:2}},
      ]},
    {id:'stranden',title:'Stranden och högvattnet',ev:['base:siljan_100arsniva_idag','base:siljan_100arsniva_2071_2100_rcp85','base:camping_andel_under_100arsniva','base:lagsta_strandgata_niva','base:byggnader_under_100arsniva','base:lagsta_grundlaggningsniva_siljan','base:siljan_hogsta_vattenstand_1985'],
      ctx:'Siljans hundraårsnivå låg kring 163,7 meter över havet 2026 och väntas stiga något när vintrarna blir blötare. Nästan halva campingen vid Siljansbadet ligger under den nivån, och de lägsta gatorna vid Enån ligger bara 30 centimeter över den. I Leksand ska nya hus vid Siljans utlopp grundläggas på minst 165 meter.',
      options:[
        {label:'Höj strandkanten',text:'Strandstråket vid Enåns mynning och Badhusgatan höjs, och det som byggs nära vattnet läggs på upphöjd mark. Centrum klarar ett högre högvatten – men campingen ligger kvar där vattnet kommer först, och en bit av den öppna stranden nedanför Kyrkudden blir vall.',set:{anpassning:1}},
        {label:'Ge Siljan plats',text:'Campingen flyttar upp från stranden, strandängarna blir park och översvämningsyta, och strandstråken höjs. Tryggt när sjön stiger – men flytten kostar, och sommargästerna vill helst bo vid vattnet.',set:{anpassning:2}},
        {label:'Lita på regleringen',text:'Sjön är reglerad, och det högsta vattenståndet sedan regleringen uppmättes redan 1985. Billigast i dag – men varje högvatten tar något av stranden, campingen och husen vid Enån.',set:{}},
      ]},
    {id:'de_unga',title:'Att stanna eller flytta',ev:['base:unga_tror_flytta_fran_kommunen','base:unga_nojda_med_livet','base:gymnasieelever_i_kommunen','base:naturbruk_forstahandssokande','base:bostadsmarknadslage_ungdomar_bme','base:persborg_planerade_bostader','demography_e14'],
      ctx:'År 2024 trodde två av tre unga i Rättvik att de skulle flytta, mest för jobb och studier, fast det bästa med att bo här var familjen och naturen. Stiernhööksgymnasiet hade fler sökande än platser till lantbruket, men närmaste högskola låg i Falun och Borlänge, och kommunen bedömde att det fanns för få bostäder för unga.',
      options:[
        {label:'Bygden som klassrum',text:'Naturbruksgymnasiet växer till ett centrum för utbildning och forskning om fäbodar, skog och Siljan, tillsammans med högskolan, och byskolorna blir byns hus. Unga stannar och nya kommer – men det kostar mycket för en liten kommun, och det tar en generation innan det bär.',set:{kunskap:2}},
        {label:'Ett eget hem i bygden',text:'Hyresrätter för unga och generationshus som ekobyn i Persborg, i samhället och i byarna, så att den som vill kan flytta hemifrån utan att flytta härifrån. Fler stannar, bildar familj och ser till sina gamla – men det byggs på lånade pengar, och alla vill inte bo så nära sina grannar.',set:{bogemenskap:2}},
        {label:'Välkommen tillbaka',text:'Unga ska ut i världen; kommunen satsar i stället på att locka hem dem som flyttat, när de har fått familj och erfarenhet. Billigt – men många kommer aldrig tillbaka, och skolan och omsorgen behöver folk nu.',set:{}},
      ]},
    {id:'besoksnaringen',title:'Gästerna året runt',ev:['base:gastnatter','base:gastnatter_2019','base:gastnatter_sommar_andel','base:camping_andel_gastnatter','base:turism_arsarbetskrafter','rattvik_e3','rattvik_e11','rattvik_e21'],
      ctx:'År 2025 hade Rättvik 19 % färre gästnätter än 2019, och utanför sommaren en fjärdedel färre. Två tredjedelar av gästnätterna var i juni–augusti, mer än hälften på camping, och besökarna gav bara 186 årsarbeten. I ett varmare Europa väntas fler söka sig norrut, mest på våren och hösten.',
      options:[
        {label:'Leder, cykel och kanot',text:'Siljansleden, geoparken och kanotlederna sköts och marknadsförs hela året. Fler gäster på våren och hösten – men juli och campingen står fortfarande för det mesta.',set:{turism:1}},
        {label:'Fäbodar, kultur och båtar',text:'Fäbodvistelser, spelmansstämmor och båtturer till byarna runt Siljan blir en semester utan bil, året runt. Fler gäster utanför juli och fler helårsjobb – men fler gäster betyder fler resor hit, och bygden får dela sina fäbodar och stränder.',set:{turism:2}},
        {label:'Sommaren räcker',text:'Rättvik lever på juli, campingen och bilveckan som förut. Inga nya satsningar – men jobben förblir säsongsjobb, och resten av året står sängarna tomma.',set:{}},
      ]},
  ],
  2066:[
    {id:'energibygden',title:'Energibygden',ev:['energy_e16','base:broboberget_lannaberget_produktion','base:elanvandning_total','base:kalkverk_co2_fossil','base:okat_behov_elnat_forbrukning_dalarna','base:vindkraft_lokalagda_verk','rattvik_e1','rattvik_e8'],
      ctx:'Sveriges elanvändning väntades mer än fördubblas till 2045, och vinden i norra Rättviks skogar räcker till långt mer än bygden behöver: bara Broboberget och Lannaberget fick tillstånd för omkring 1,5 TWh om året, tio gånger kommunens elanvändning 2024. En förstudie 2025 såg Furudal som ett grönt industrikluster med vätgas ur vind och vatten, och Gundåsmoren nära Furudal har sökts på nytt.',
      options:[
        {label:'Byarnas egna parker',text:'Parkerna i norr byggs ut och ägs till en del av byarna, men Gundåsmoren får nej igen. Mer el och mer pengar till bygden – men skogen i norr får fler verk, och de som bor nära får leva med dem.',set:{vind:2}},
        {label:'Energibygd',text:'Också Gundåsmoren byggs, och el och vätgas från Furudal går till industrin i landet. Jobb, intäkter och nästan inga utsläpp från kalkverket – men skogen i norr blir industrimark, grannarna protesterar, och mycket av vinsten hamnar hos bolagen.',set:{vind:3}},
        {label:'Skogen får vara skog',text:'Inga nya parker; de som finns förnyas när de blir gamla. Skogen och tystnaden i norr får vara i fred – men elen till framtidens industri görs någon annanstans, och kalkverket fångar bara in så mycket som utsläppshandeln kräver.',set:{}},
      ]},
    {id:'maskinerna',title:'Maskinerna och människorna',ev:['base:forsorjningskvot','base:tillsvidareanstallda','base:internet_icke_anvandare','rattvik_e5','tech_ai_e17','tech_ai_e19','digital_resilience_e14','digital_resilience_e12'],
      ctx:'AI-system kan nu göra mycket av arbetet i vård, skola och förvaltning – och få kommuner har haft så få invånare i arbetsför ålder som Rättvik. Hemtjänsten började med fjärrtillsyn redan 2025, men välfärdstekniken sparade mindre än man hade hoppats, och då använde tre procent av svenskarna inte internet alls, nästan alla pensionärer.',
      options:[
        {label:'AI i egen ägo',text:'Kommunerna i Dalarna äger sina AI-system tillsammans, på samma sätt som Rättvik redan äger sitt vatten- och avfallsbolag ihop med grannarna, och varje beslut kan granskas. Personalen får lite hjälp – men det är dyrare och långsammare än att köpa av de stora bolagen, och tillsyn på skärm ersätter en del besök.',set:{ai:2}},
        {label:'Automatisera allt som går',text:'AI och robotar tar över allt de kan i förvaltning, vård och skola, och personalen som finns kvar räcker till mötena med människor. Mest hjälp till de få händerna – men kunnandet tunnas ut, få vet hur besluten fattas, och de gamla får färre besök.',set:{ai:3}},
        {label:'En människa i varje lucka',text:'Varje tjänst ska också gå att få utan skärm – telefon, papper, kontanter och en människa i bystugan – och barnen växer upp med mindre skärm. Ingen lämnas utanför, och bygden klarar ett nätavbrott – men dubbla system kostar, och personalen behövs också i omsorgen.',set:{analog:3}},
      ]},
    {id:'vintern',title:'Vintern som försvinner',ev:['base:istacke_dagar_2016_2026','base:skiddagar_2100_rcp45','base:gastnatter_vinter','base:vattentakt_tillstand_max_dygn','rattvik_e3','health_e1'],
      ctx:'Isen låg på Siljan 129 dagar om året i slutet av 1800-talet men 74 dagar under vintrarna 2016–2026, och vintern 2024/25 bara 35. Bilveckans vinterdag på isen flyttade till Oresjön redan 2024. Nära Falun väntades dagarna med bra skidföre bli färre än 40 om året till seklets slut, mot 90 förr – och många av vinterns gäster kommer för snön och isen.',
      options:[
        {label:'Konstsnö och konstis',text:'Snökanoner i Lerdalshöjden och spolade isbanor håller vintern vid liv. Backen och en del vinterjobb blir kvar ett tag – men snön kräver el och lika mycket vatten ur Enån per dygn som hela Gärdsjö vattentäkt, och vintergästerna blir ändå färre.',set:{}},
        {label:'Siljansbygden året runt',text:'Fäbodar, leder, bad och kultur från april till november, med tåg hit och längre vistelser i stället för korta helger. Gästerna sprids över året och fler jobb blir helårsjobb – men vintersporten krymper, och fler gäster betyder fler resor.',set:{turism:3}},
        {label:'Friluftsliv för oss själva',text:'Pengarna går till spår, bad och bastu runt Siljan, och hälsostugorna i byarna skriver ut rörelse och natur på recept. Rättvikarna rör sig fler månader om året och lever längre – men vintergästerna blir färre, och backens jobb med dem.',set:{forebyggande:2}},
      ]},
  ],
  2076:[
    {id:'omsorgen',title:'Vem ska vårda?',ev:['base:andel_80plus_prognos_2040','base:forsorjningskvot','base:ensamhet_hemtjanst_65plus','base:persborg_planerade_bostader','rattvik_e4','rattvik_e5','community_e14','demography_e15'],
      ctx:'SCB räknade med att var sjätte rättvikare skulle vara över 80 år kring 2070, och redan 2025 hade kommunen en av landets högsta försörjningskvoter – 1,09 unga och gamla för varje invånare i arbetsför ålder. Hälften av de äldre med hemtjänst besvärades av ensamhet, och äldreomsorgen behövde växa snabbare än ekonomin bara för att räcka till som förut.',
      options:[
        {label:'Generationshus',text:'Unga och gamla bor som grannar i samma hus och på samma gårdar, som i ekobyn i Persborg, och hjälper varandra med det vardagliga. Mindre ensamhet och fler som flyttar hit – men alla vill inte bo så, och det tar decennier att bygga om.',set:{bogemenskap:2}},
        {label:'Robotar och sensorer',text:'Robotar lyfter och städar, och AI håller koll dygnet runt, så att personalen räcker längre. Fler får hjälp – men händerna som hjälper är allt oftare maskinernas, och ensamheten bland de gamla växer.',set:{ai:3}},
        {label:'Friska äldre',text:'Hela bygden planeras för rörelse och möten, med hälsostugor, trivselträffar varje dag och hembesök innan någon blir sjuk. De gamla lever längre och friskare och är mindre ensamma – men fler blir mycket gamla, och vården behövs ändå till slut.',set:{forebyggande:3}},
      ]},
    {id:'gatorna',title:'Gatorna i samhället',ev:['base:personbilar_per_1000_inv','base:hardgjord_mark_andel_tatort','base:classic_car_week_gastnatter','mobility_e8','mobility_e11','mobility_e7'],
      ctx:'Storgatan var genomfartsväg tills riksvägen flyttades på 1980-talet, och 2025 fanns 679 bilar per 1 000 invånare i kommunen. En femtedel av tätorten var hårdgjord mark. I spanska Pontevedra hade gatorna redan för länge sedan blivit gångstråk och torg, och mycket av trafiken försvann i stället för att flytta.',
      options:[
        {label:'Ett bilfritt centrum',text:'Torget, Storgatan och vägen ner till stranden blir bilfria, och bilveckans cruising flyttar ut till Rättviksparken och travbanan; bostadsgatorna är som förut. Ett levande och grönare centrum – men beslutet delar bygden, parkeringarna flyttar ut, och den som går med rullator får längre att gå.',set:{bilfritt:2}},
        {label:'Bilfri ort',text:'Gatorna i hela samhället blir trädgårdar, cykelvägar och mötesplatser, och bilarna stannar i utkanten. Tyst, grönt och tryggt för barnen – men striden blir hård, den som kommer från byarna får byta färdmedel vid infarten, och bilveckan finns bara kvar på travbanan.',set:{bilfritt:3}},
        {label:'Gatorna får vara gator',text:'Bilar, elbilar och skyttlar delar gatorna som nu. Enkelt för alla som kör – men asfalten tar plats som kunde bli grönska.',set:{}},
      ]},
    {id:'maten',title:'Kan bygden föda sig själv?',ev:['base:sjalvforsorjningsgrad_vikt_lan','base:spannmal_hektar','base:vall_andel_akermark','base:livsmedelsberedskap_planeringsmal_dagar','base:akermark_per_invanare','food_e5','food_e4','resilience_e6'],
      ctx:'Dalarna producerade 2023 bara drygt en tredjedel av den mat som åts i länet, och spannmålen i Rättvik hade krympt från minst 941 till 229 hektar sedan 1981; fyra femtedelar av åkern var vall till djuren. Sverige planerar för att klara livsmedelsförsörjningen i minst tre månader i en kris. Ett nordiskt ekologiskt jordbruk utan konkurrens mellan mat och foder kan föda alla – med mycket mindre kött.',
      options:[
        {label:'Bygden föder sig själv',text:'Ett matråd planerar för att bygden ska kunna föda sig själv: spannmål och baljväxter på åkrarna igen, kvarnar och mejerier, och mindre men bättre kött från betet. Mer av maten härifrån och öppna marker – men maten blir dyrare, och skogsbygdens jord ger inte mycket.',set:{regionalt:3}},
        {label:'Lager i varje by',text:'Mat för två månader, reservvatten och el i ö-drift i varje by – men maten köps där den är billigast. Tryggt i en kris – men dyrt att hålla i ordning, och gårdarna runt Siljan får ingen ny köpare.',set:{beredskap:3}},
        {label:'Maten är privat',text:'Kommunen lägger sig inte i vad folk äter utanför skolan och omsorgen. Inga pekpinnar och billigast – men maten kommer långt ifrån, och bygden är lika sårbar i en kris som förut.',set:{}},
      ]},
  ],
  2086:[
    {id:'inflyttarna',title:'De nya rättvikarna',ev:['base:emigranter_1864_1889','base:fodelseoverskott_2025','base:flyttnetto_2025','base:befolkning_prognos_2070','rattvik_e14','demography_e17','community_e12'],
      ctx:'Mellan 1864 och 1889 utvandrade nästan tusen rättvikare till Amerika, ofta hela familjer som blev grannar igen i Minnesota. Nu söker sig fler hit från länder där somrarna har blivit för heta. I Rättvik har det dött fler än det fötts varje år sedan 2000, och det är inflyttarna som har hållit bygden levande.',
      options:[
        {label:'Byarna fylls igen',text:'Tomma gårdar och fritidshus blir hem för nya familjer, som blir grannar med varandra och med bygdens gamla, och att bo över generationerna blir det vanliga. Byarna lever igen – men det kräver mycket av få grannar, och alla vill inte bo så nära.',set:{bogemenskap:3}},
        {label:'Utbildade i bygden',text:'De nya rättvikarna – och alla andra som vill – läser svenska, blir undersköterskor och lärare och studerar vidare här, livet ut. Fler händer i omsorgen och skolan – men det kostar, och det tar år innan utbildningen bär.',set:{kunskap:3}},
        {label:'Så många som vi klarar',text:'Kommunen tar emot så många som skolan, vården och bostäderna räcker till. Ordning och trygghet – men bygden fortsätter att åldras, och omsorgen saknar händer.',set:{}},
      ]},
    {id:'taken',title:'Solen på gårdarna',ev:['base:riksintressen_kulturmiljo_antal','base:solceller_installerad_effekt','base:elproduktion_sol','base:elanvandning_fritidshus','energy_e17','energy_e10'],
      ctx:'De täta byarna med kringbyggda gårdar i Söderås är ett av kommunens 18 riksintressen för kulturmiljön. Nu kan nästan varje tak ge el, och batterierna har blivit billiga – men solceller på de gamla gårdarna förändrar det landskap som riksintresset ska skydda.',
      options:[
        {label:'Solparker utanför byarna',text:'Byarnas energigemenskaper äger solceller på lador, parkeringar och gamla grustag och delar batterier, och de skyddade gårdarna får vara som de är. Mycket el som bygden äger och orörda byar – men parkerna tar mark.',set:{sol:2}},
        {label:'Varje tak producerar',text:'Alla lämpliga tak i samhället och byarna får solceller i takets färg, och bara de mest skyddade gårdarna slipper. Billig el som bygden äger – men byarnas utseende förändras.',set:{sol:3}},
        {label:'Bara nya tak',text:'Solceller på nya hus, men inte på de gamla gårdarna. Byarna ser ut som de alltid gjort – men mindre av elen blir bygdens egen.',set:{}},
      ]},
    {id:'skyfallen',title:'Skyfallen',ev:['base:skyfall_2023_skadade_villor','base:max_dygnsnederbord_forandring_2069_2098_rcp85','base:vinternederbord_forandring_2071_2100_rcp85','base:skyfall_klimatfaktor_2071_2100_rcp85','base:lagsta_grundlaggningsniva_siljan','rattvik_e10','mobility_e15','mobility_e16'],
      ctx:'I augusti 2023 skadade skyfall omkring 150 villor i Lerdal, Gärdebyn, Söderås och Utby, och 2,5 mil väg förstördes. Med höga utsläpp väntas årets största dygnsregn bli en femtedel kraftigare och vinterns nederbörd en tredjedel större till seklets slut.',
      options:[
        {label:'Skydda det viktigaste',text:'Vägar, pumpstationer och de mest utsatta husen skyddas, och strandängarna tar emot vattnet. Rimligt och beprövat – men husen i sluttningarna får till stor del klara sig själva.',set:{anpassning:2}},
        {label:'En svampbygd',text:'Varje by tar hand om sitt vatten med dammar, diken och våtmarker, och nya hus byggs över 165 meter. Skyfall och högvatten gör liten skada – men det tar mark och pengar, och en del tomter kan aldrig bebyggas.',set:{anpassning:3}},
        {label:'Laga efter ovädret',text:'Kommunen lagar efter varje oväder i stället för att bygga om i förväg. Billigast de flesta år – men de år det smäller blir det dyrt, och försäkringarna blir dyrare för alla.',set:{}},
      ]},
  ],
  2096:[
    {id:'kretsloppet',title:'Lagat, lånat och återbrukat',ev:['base:kommunalt_avfall_kg_per_inv','base:materialatervinning_andel','base:kretsloppsplan_mal_avfallsminskning','governance_e8','governance_e12','governance_e13'],
      ctx:'Hösten 2025 öppnade återbruket Ta Till Vara i Rättvik, och kretsloppsplanen sade att avfallet skulle minska med en fjärdedel till 2030. Samma år samlades 395 kilo avfall in per invånare.',
      options:[
        {label:'Laga och låna',text:'Reparationsverkstäder och lånebibliotek för verktyg och kläder i varje by, och hus som byggs av återbrukat virke. Mindre avfall och fler som kan laga – men de flesta köper nytt ändå.',set:{effektivitet:2}},
        {label:'Nollavfall',text:'Allt som säljs i bygden ska gå att laga, låna eller återbruka, och Lokstallarna blir verkstad och lånebibliotek för allt från skidor till symaskiner. Nästan inget slängs – men mycket blir dyrare att köpa, och alla måste vara med.',set:{effektivitet:3}},
        {label:'Sortera som förr',text:'Återvinningscentralerna och återbruksbutiken får räcka. Enkelt – men sakerna kommer och går lika fort som förut.',set:{}},
      ]},
    {id:'sommarstaden',title:'Sommarstaden',ev:['base:hogsommardygn_1991_2020_lokal','base:hogsommardygn_2071_2100_rcp85_lokal','base:fritidshus_antal','base:fritidshus_lokalt_agda_andel','base:befolkning_juli_okning','base:bilandel_turistresor','base:klimat_bilresa_100mil','rattvik_e3'],
      ctx:'Kring 2020 var det omkring 16 högsommardagar om året vid Siljan, och till seklets slut väntades 25 till 39. När sydligare stränder blir för heta söker sig fler till svala sjöar och skogar – redan 2025 fanns 2 980 fritidshus i Rättvik, fyra av fem ägda av folk som bodde någon annanstans, och i juli var det 58 % fler människor i kommunen. Nio av tio turister kom till Dalarna med bil.',
      options:[
        {label:'Tåg hela vägen',text:'Tåg varje timme till Stockholm och nattåg från kontinenten, och fler fritidshusägare flyttar hit på riktigt. Allt fler sommargäster kommer utan bil – men staten och regionen måste vara med och betala, och resan tar längre tid än med flyg.',set:{forbindelser:3}},
        {label:'Fler bäddar vid Siljan',text:'Fler campingplatser, stugor och hotell tar emot de nya sommargästerna. Jobb och pengar till bygden – men vatten, vägar och stränder ska räcka till många fler i juli, och priserna stiger för dem som bor här.',set:{}},
        {label:'Gästerna sprids över året',text:'Paket med tåg och längre vistelser på våren och hösten, och fritidshusen hyrs ut när ägarna inte är där. Fler gäster på våren och hösten och fler helårsjobb – men fler gäster betyder fler resor hit, och bygden måste ha något att erbjuda också i november.',set:{turism:3}},
      ]},
    {id:'vindkraften',title:'Verken blir gamla',ev:['base:vindkraft_antal_verk','base:vindkraft_lokalagda_verk','base:broboberget_lannaberget_effekt','base:kalkverk_co2_fossil','rattvik_e8','energy_e9'],
      ctx:'Vindkraftverken som byggdes i norr på 2030- och 2040-talen är gamla, och skogen har vuxit upp runt dem. De har gett el till regionen och till kalkverket – men den som bor nära har levt med ljudet och de blinkande ljusen i ett halvt sekel. Nu ska de bytas ut eller rivas.',
      options:[
        {label:'Bygg nytt och större',text:'De gamla verken ersätts av nya, Gundåsmoren och fler parker i norr byggs, och byarna äger en del. El och vätgas till landet och intäkter till bygden i ett halvsekel till – men skogen i norr förblir industrimark.',set:{vind:3}},
        {label:'Förnya det som står',text:'De parker som finns får nya verk på samma platser, men inga nya byggs. Ingen ny mark tas – men bygden går miste om elen och intäkterna från fler parker.',set:{}},
        {label:'Låt skogen ta tillbaka',text:'Verken i norr rivs när de är uttjänta, och bara Hedbodberget och det som bolagen bygger på egen hand står kvar. Skogen och tystnaden kommer tillbaka – men mindre egen el och mindre pengar till bygden, och kalkverket fångar bara in så mycket som utsläppshandeln kräver.',set:{vind:0}},
      ]},
  ],
  2106:[
    {id:'barndomen',title:'Barndomen vid Siljan',ev:['base:gymnasieelever_ar1_mar_bra','base:psykisk_ohalsa_barn_unga','base:unga_skarmtid_over_3h','digital_resilience_e4','digital_resilience_e5','digital_resilience_e8','health_e2'],
      ctx:'I elevhälsans samtal 2025/26 mådde nio av tio fjärdeklassare i Rättvik bra, men bara två av tre förstaårselever på gymnasiet – och fyra av tio av dem var nedstämda varje vecka. Folkhälsomyndigheten rekommenderade redan 2024 högst en till två timmar skärm om dagen på fritiden för barn mellan 6 och 12 år.',
      options:[
        {label:'Skärmfri barndom',text:'Ingen egen skärm före tolv år: skogen, sjön, fiolen och slöjden i stället, och allt viktigt finns också utan skärm. Mer lek och sömn – men barnen lär sig tekniken senare än andra, och föräldrarna får stå emot.',set:{analog:3}},
        {label:'Mobilfri skola, fria hem',text:'Skolan är mobilfri, som den har varit sedan 2026, och hemma bestämmer familjerna. Lätt att enas om – men skärmtiden på kvällarna blir som förut.',set:{}},
        {label:'Digital från första dagen',text:'Barnen lär sig med AI-handledare och skärmar från förskolan, och de analoga reserverna läggs ner. Tidigt kunnande och lägre kostnader – men mindre rörelse och lek, mer tid framför skärmen, och bygden står sig sämre när nätet går ner.',set:{analog:0}},
      ]},
    {id:'byarna',title:'Ska alla byar leva?',ev:['base:kommun_yta','base:skogsmark_andel_landareal','base:folkmangd_tatort','base:befolkning_1970','base:kollektivtrafik_vardagsresor_bra_andel','mobility_e14'],
      ctx:'Vision 2030 ville ha attraktiva boendemiljöer i hela kommunen, och Rättviksmodellen lovade att bevara byarna. Men nästan nio tiondelar av kommunen är skog, och mellan 1970 och 2023 växte tätorten från 3 900 till 5 400 invånare medan resten av kommunen krympte.',
      options:[
        {label:'Några starka byar',text:'Skola, butik och vårdmottagning samlas i de största byarna, som Furudal, Boda och Vikarbyn, och skyttlar på beställning och sommarbåtar binder ihop dem med tåget. Billigare än att bära allt överallt – men de minsta byarna blir fritidsbyar och fäbodar.',set:{kollektivt:2}},
        {label:'Skyttlar till varje by',text:'Avgiftsfria, självkörande skyttlar går till varje by dygnet runt, så att man kan bo var som helst utan bil. Hela kommunen lever – men det är dyrt att köra halvtomma skyttlar på skogsvägarna.',set:{kollektivt:3}},
        {label:'Samla bygden i samhället',text:'Nya bostäder byggs i tätorten nära tåg, vård och skola, och byarna får klara sig med det som finns. Inget nytt att betala – men Rättviksmodellen överges, och landskapet töms på folk.',set:{}},
      ]},
    {id:'skogen_varme',title:'Skogen i ett varmare klimat',ev:['base:dagar_lag_markfuktighet_2069_2098_rcp85','base:skyddad_natur_total','base:skogsmark_andel_landareal','base:rodlistade_arter_observerade_antal','rattvik_e7','biodiversity_baltic_e13','biodiversity_baltic_e15','resilience_e5'],
      ctx:'Med höga utsläpp väntades marken vara torr 30–40 dagar om året i slutet av seklet, mot 5–10 dagar kring 2015, och en torr sommar gör skogen brännbar. Nio tiondelar av kommunen är skog, och utdikade myrar håller inte vattnet. EU ville att 30 % av landet skulle vara skyddat – Rättvik låg långt efter.',
      options:[
        {label:'Levande skogsbygd',text:'Lika mycket skyddad natur som i riket, hyggesfritt nära byarna och myrarna återvätta som vattenmagasin. Skogen klarar torka och skyfall bättre och arterna får plats – men virket och jobben i skogen blir färre, många skogsägare protesterar, och det tar ett halvt sekel innan det märks.',set:{skog:3}},
        {label:'Brandvärn och vatten i varje by',text:'Frivilliga brandvärn, brandgator, reservvatten och lager i varje by, så att en skogsbrand eller en torka inte blir en katastrof. Tryggt – men skogen själv blir inte friskare, och beredskapen kostar år efter år.',set:{beredskap:3}},
        {label:'Skogen ger virke',text:'Skogen brukas som förut och ger virke, energi och jobb. Inga nya kostnader – men en torr sommar kan ta det som har växt i ett halvt sekel.',set:{}},
      ]},
  ],
  2116:[
    {id:'rattvik800',title:'Rättvik 800 år',ev:['base:rattvik_egen_socken','base:vasa_tal_ar','base:kyrkstall_aldsta','base:lagsta_grundlaggningsniva_siljan','governance_e5','governance_e1','governance_e2'],
      ctx:'Omkring 1325 blev Rättvik en egen socken, och vid kyrkan talade Gustav Vasa till dalkarlarna 1520. År 2026 sträckte sig kommunens vision och översiktsplan bara till 2030. Vad ska Rättvik lova dem som lever här år 2226?',
      options:[
        {label:'Ett ombud för barnbarnen',text:'Byarna och de unga skriver en hundraårsplan, och ett ombud för kommande generationer får vetorätt i frågor som binder bygden längre än en generation. Långsiktigt – men varje framtida fullmäktige får mindre frihet.',set:{demokrati:3}},
        {label:'Inget hus under 165 meter',text:'Rättvik lovar att inga nya hus byggs där Siljan kan nå, att varje by tar hand om sitt eget vatten och att strandstråken höjs där samhället möter sjön. Tryggt för dem som kommer – men en del mark kan aldrig bebyggas, och vallarna förändrar stranden nedanför Kyrkudden.',set:{anpassning:3}},
        {label:'Låt de kommande bestämma',text:'Varje generation får forma sin egen tid, som den här har gjort. Frihet för dem som kommer – men inget löfte till dem.',set:{}},
      ]},
    {id:'siljan',title:'Siljan om hundra år',ev:['base:siljansringen_alder','base:istacke_dagar_2016_2026','base:siljan_ekologisk_status','rattvik_e6','biodiversity_baltic_e15','governance_e5'],
      ctx:'Siljan ligger i kanten av en krater som en meteorit slog för 377 miljoner år sedan. Isen som förr låg kvar till maj lägger sig allt mer sällan, ålen är sedan länge borta, och sjön har gett fisk, kraft och resvägar åt varje generation.',
      options:[
        {label:'Siljans återkomst',text:'Sjön regleras för livet i den: fria vandringsvägar, återställda stränder och försök att få tillbaka ålen. Ett levande arv till dem som kommer – men dammarna ger mindre el, och stränderna får se ut som naturen vill.',set:{hav:3}},
        {label:'Som det är',text:'Det som har gjorts för sjön står kvar, och stränder och åar sköts i den takt pengarna räcker. Inga nya ingrepp – men ålen kommer inte tillbaka.',set:{}},
        {label:'Sjön får ge mer',text:'Värme ur sjövattnet till samhället och mer reglerkraft från dammarna, och fiskvägarna får förfalla. Billig energi – men livet i sjön får stå tillbaka.',set:{hav:0}},
      ]},
    {id:'fiolen',title:'Tid för fiolen',ev:['base:foreningar_i_registret','base:idrottsforeningar_lok_per_10000','base:unga_medlem_forening','tech_ai_e17','community_e22','demography_e15'],
      ctx:'”Om tre rättvikare träffas spelar fyra fiol”, säger man i bygden, och 2026 fanns 93 föreningar i kommunens register. Nu kan maskinerna göra det mesta av det arbete som går att automatisera. Vad ska rättvikarna göra med den tid som blir över?',
      options:[
        {label:'Spelstugor och slöjd',text:'Rätten till ett analogt liv: spelstugor, slöjdhus och bystugor i varje by, och allt viktigt finns också utan skärm. Tid för fiolen och för varandra – men dubbla system kostar, och alla vill inte lägga ifrån sig skärmen.',set:{analog:3}},
        {label:'Lärande hela livet',text:'En folkhögskola i Rättvik, kurser på Folkmusikens hus och utbildning i bygden för alla åldrar. Fler kan mer och färre unga flyttar för att studera – men det kostar, och alla vill inte gå i skolan igen.',set:{kunskap:3}},
        {label:'Tid för varandra',text:'Att bo tillsammans över generationerna blir det vanliga, och tiden går till grannar, gamla och barn. Färre är ensamma – men alla vill inte leva så nära andra.',set:{bogemenskap:3}},
      ]},
  ],
};

if(LANG!=='sv')for(const list of Object.values(DECISIONS))for(const c of list){c.title=L(c.title);c.ctx=L(c.ctx);for(const o of c.options){o.label=L(o.label);if(o.text)o.text=L(o.text);if(o.note)o.note=L(o.note);}}
// How the journey begins (the first page of Resan): Rättvik today and the kommun's own horizon.
export const JOURNEY_INTRO={sv:'Rättviks kommun hade 10 978 invånare 2025, och var tredje var 65 år eller äldre. Kommunens Vision 2030, ”Rättvik, där tradition möter framtid”, och översiktsplanen sträcker sig fyra år framåt – ingen har skrivit ner hur bygden vid Siljan ska leva om hundra år. Det bestämmer du nu, decennium för decennium, tillsammans med släkten.',
  en:'Rättvik Municipality had 10,978 inhabitants in 2025, and one in three was 65 or older. Its Vision 2030, “Rättvik, where tradition meets the future”, and its comprehensive plan reach four years ahead – no one has written down how the community by Lake Siljan should live a hundred years from now. You decide that now, decade by decade, together with the family.'};

const fmt=(k,v)=>INDICATORS[k].fmt(v);
// The decade's headline, after the index and the people (the engine shows it as each decade opens): the young
// who think they will move away – whether the bygd can hold its people – and the summer farms' forest grazing –
// whether its open landscape and living heritage last. Both are Rättvik's own measures and move with most of
// its choices.
export function JOURNEY_HEADLINE(d){
  const young=fmt('youthLeave',d.ind.youthLeave),ha=fmt('fabodHa',d.ind.fabodHa);
  return t(`${young} av de unga tror att de flyttar · ${ha} hektar fäbodbete`,`${young} of the young expect to move away · ${ha} hectares of summer-farm grazing`,`${young} dei giovani pensa di andarsene · ${ha} ettari di pascolo degli alpeggi`);
}

// The journey's closing lines: what Rättvik's century came to, in Rättvik's own measures (the framework shows
// them under "Ditt Rättvik 2126"). d: the year 2126, d0: 2026, I: the levers' implementation, today: today's
// course run to 2126.
export function JOURNEY_SUMMARY({d,d0,I,today}){
  const v=d.ind,v0=d0.ind,vt=today?.years?.[100]?.ind,lines=[];
  // People: the dead outnumber the born, so those who move in decide.
  lines.push(t(`Rättviks kommun har ${fmt('pop',v.pop)} invånare (2026: ${fmt('pop',v0.pop)}${vt&&Math.abs(vt.pop-v.pop)>5?`; med dagens kurs ${fmt('pop',vt.pop)}`:''}), och ${fmt('share80',v.share80)} är 80 år eller äldre. ${fmt('youthLeave',v.youthLeave)} av de unga tror att de kommer att flytta (2026: ${fmt('youthLeave',v0.youthLeave)}).`,
    `Rättvik Municipality has ${fmt('pop',v.pop)} inhabitants (2026: ${fmt('pop',v0.pop)}${vt&&Math.abs(vt.pop-v.pop)>5?`; on today's course ${fmt('pop',vt.pop)}`:''}), and ${fmt('share80',v.share80)} are 80 or older. ${fmt('youthLeave',v.youthLeave)} of the young think they will move away (2026: ${fmt('youthLeave',v0.youthLeave)}).`));
  // The old: care close by and company, or remote supervision.
  lines.push(t(`${fmt('elderLonely',v.elderLonely)} av de äldre som har hemtjänst besväras av ensamhet (2026: ${fmt('elderLonely',v0.elderLonely)}), och medellivslängden är ${fmt('lifeExp',v.lifeExp)} år.`,
    `${fmt('elderLonely',v.elderLonely)} of the elderly with home care are troubled by loneliness (2026: ${fmt('elderLonely',v0.elderLonely)}), and life expectancy is ${fmt('lifeExp',v.lifeExp)} years.`));
  // The fäbodar and the food.
  lines.push(t(`Fäbodarnas skogsbete omfattar ${fmt('fabodHa',v.fabodHa)} hektar (2026: ${fmt('fabodHa',v0.fabodHa)}), och ${fmt('foodRegional',v.foodRegional)} av maten kommer från länet.`,
    `The summer farms' forest grazing covers ${fmt('fabodHa',v.fabodHa)} hectares (2026: ${fmt('fabodHa',v0.fabodHa)}), and ${fmt('foodRegional',v.foodRegional)} of the food comes from the county.`));
  // Siljan and the forest.
  lines.push(v.waters>=.8?t(`Siljan har god ekologisk status, och öringen når ${fmt('troutAccess',v.troutAccess)} av sina gamla lekplatser (2026: ${fmt('troutAccess',v0.troutAccess)}). ${fmt('protectedNature',v.protectedNature)} av kommunen är skyddad natur.`,
      `Lake Siljan has good ecological status, and the trout reaches ${fmt('troutAccess',v.troutAccess)} of its old spawning grounds (2026: ${fmt('troutAccess',v0.troutAccess)}). ${fmt('protectedNature',v.protectedNature)} of the municipality is protected nature.`)
    :t(`Siljan är klar men har fortfarande inte god ekologisk status; öringen når ${fmt('troutAccess',v.troutAccess)} av sina gamla lekplatser. ${fmt('protectedNature',v.protectedNature)} av kommunen är skyddad natur (2026: ${fmt('protectedNature',v0.protectedNature)}).`,
      `Lake Siljan is clear but still not in good ecological status; the trout reaches ${fmt('troutAccess',v.troutAccess)} of its old spawning grounds. ${fmt('protectedNature',v.protectedNature)} of the municipality is protected nature (2026: ${fmt('protectedNature',v0.protectedNature)}).`));
  // Energy and the lime works.
  lines.push(t(`Bygden gör ${v.localEnergy>1.5?`${dec(v.localEnergy,1)} gånger så mycket el som den använder`:`el motsvarande ${fmt('localEnergy',v.localEnergy)} av vad den använder`}, och utsläppen inom kommunen är ${fmt('ghg',v.ghg)} ton per invånare (2026: ${fmt('ghg',v0.ghg)})${v.capture>.5?' – kalkverket fångar in sin koldioxid':' – det mesta från kalkverket'}.`,
    `The area makes ${v.localEnergy>1.5?`${dec(v.localEnergy,1)} times the electricity it uses`:`electricity equal to ${fmt('localEnergy',v.localEnergy)} of what it uses`}, and emissions within the municipality are ${fmt('ghg',v.ghg)} tonnes per inhabitant (2026: ${fmt('ghg',v0.ghg)})${v.capture>.5?' – the lime works captures its carbon dioxide':' – most of it from the lime works'}.`));
  // Travel and the visitors.
  {const boats=Math.round(v.boatVillages??0);
  lines.push(t(`Bilen används för ${fmt('carShare',v.carShare)} av resorna och tåget till Stockholm tar ${fmt('railMain',v.railMain)}${boats>=3?`; om sommaren går eldrivna båtar från Långbryggan till ${boats} byar runt Siljan`:''}. Besökarna stannar ${fmt('guestNights',v.guestNights)} nätter om året, ${fmt('summerShare',v.summerShare)} av dem på sommaren.`,
    `The car is used for ${fmt('carShare',v.carShare)} of trips and the train to Stockholm takes ${fmt('railMain',v.railMain)}${boats>=3?`; in summer electric boats run from Långbryggan to ${boats} villages round Lake Siljan`:''}. Visitors stay ${fmt('guestNights',v.guestNights)} nights a year, ${fmt('summerShare',v.summerShare)} of them in summer.`));}
  // Water: Siljan's high water and the cloudbursts.
  {const fr=v.floodRisk;lines.push(t(`Siljans hundraårsnivå ligger på ${fmt('level100',v.level100)} och översvämningsrisken är ${fr<.2?'låg':fr<.5?'måttlig':'hög'}; ett skyfall som Hans skulle skada omkring ${fmt('cloudburstHomes',v.cloudburstHomes)} hus (2023: omkring 150).`,
    `Lake Siljan's 100-year level stands at ${fmt('level100',v.level100)} and the flood risk is ${fr<.2?'low':fr<.5?'moderate':'high'}; a cloudburst like Storm Hans would damage about ${fmt('cloudburstHomes',v.cloudburstHomes)} houses (2023: about 150).`));}
  return lines;
}
