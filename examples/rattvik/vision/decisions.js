import { LANG, L } from '@engine/i18n.js';
// Rättvik's journey: three or four dilemmas at the start of each decade. Each option sets lever levels
// from that decade on (an empty set keeps the current course). `ev` lists research ids shown as
// "Forskningen säger": claims in site/research/vision-research.json, or Rättvik's own records as
// "base:<id>" (research/baseline.json, from the deep research in research/deep/). The first decades are
// the decisions the kommun faces now (research/deep/kommun-plats-historia-notes.md, "Beslut framför oss");
// later decades are imagined situations built on the trends, with their facts dated.
export const DECISIONS={
  2026:[
    {id:'bilveckan',title:'Bilveckan',ev:['base:ccw_bilar','base:sommarbefolkning_topp_faktor','base:classic_car_week_andel_brott','base:classic_car_week_gastnatter','base:turismkonsumtion','mobility_e13','mobility_e19'],
      ctx:'Classic Car Week har hållits vecka 31 sedan 1992, och på veckans lördag är tre gånger så många människor i kommunen som en vanlig dag. En del handlare dubblar sin omsättning. Men enligt polisen anmäls en femtedel av årets brott i kommunen just den veckan, och kommunen vill se förändringar till 2027.',
      options:[
        {label:'Som förr',text:'Handeln och besöksnäringen behåller sommarens största vecka, och Rättvik ett av sina mest kända evenemang – men bullret, fyllan och brotten följer med.',set:{bilfritt:0}},
        {label:'Bilarna till parken',text:'Cruisingen flyttar till Rättviksparken och travbanan, och centrum får gångfartsgator och nattro. Veckan blir kvar – men många kommer just för att köra genom centrum.',note:'När veckan ställdes in 2020 kom cruisingen ändå.',set:{bilfritt:1}},
        {label:'Ett bilfritt sommarcentrum',text:'Torget och gatorna kring stationen blir bilfria hela sommaren, med marknad och musik, och bilveckan får hålla till någon annanstans. Lugnare och renare – men handlarna kan förlora sin bästa vecka och kommunen omkring 35 000 gästnätter.',set:{bilfritt:2}},
      ]},
    {id:'vindkraften',title:'Energiplanen och vinden',ev:['base:lokal_elproduktion_andel_av_elanvandning','base:vindkraft_antal_verk','base:elproduktion_vindkraft','base:broboberget_lannaberget_produktion','base:okat_behov_elnat_forbrukning_dalarna','base:solceller_installerad_effekt','energy_e17','energy_e9'],
      ctx:'I Rättvik produceras tre fjärdedelar av den el som kommunen använder, mest i de 15 vindkraftverken på Hedbodberget – men inget nytt verk har byggts sedan början av 2010-talet. Våren 2027 ska kommunen anta en energi- och klimatplan, och för Gundåsmoren nära Furudal, med upp till 25 verk, har kommunen vetorätt. Elnätet i Dalarna tar inte emot mer storskalig kraft förrän en ny stamstation är byggd.',
      options:[
        {label:'Ja, med byarna som delägare',text:'Gundåsmoren byggs, invånarna kan köpa andelar som i Rättviksvind, och de närboende får del av intäkterna. El, pengar och jobb till norra Rättvik – men skogen och tystnaden förändras för dem som bor nära, och elen kommer inte ut förrän nätet är byggt.',set:{vind:2}},
        {label:'Solen först',text:'Solceller på tak, lador och parkeringar, ägda av energigemenskaper i byarna, och inga nya vindkraftverk tills vidare. Elen blir bygdens egen – men solen ger minst när det är kallt och mörkt.',set:{sol:2}},
        {label:'Säg nej',text:'Kommunen använder sitt veto, och skogarna får vara i fred. Men intäkterna och jobben hamnar i andra kommuner, och verken på Hedbodberget blir inte yngre.',set:{vind:0}},
      ]},
    {id:'byskolorna',title:'Byskolorna',ev:['base:grundskolor_antal','base:satra_skola_elever','base:forandring_barn_6_12_till_2034','base:ak9_betyg_alla_amnen','base:tillsvidareanstallda','demography_e8'],
      ctx:'Rättvik har åtta kommunala grundskolor, och den minsta, Sätra, har ett tiotal elever. Barnen i åldern 6–12 år väntas bli 9 % färre till 2034, och 2025 hade bara 66 % av niondeklassarna betyg i alla ämnen. Rättviksmodellen lovar att bevara byarna och byskolorna – men små skolor kostar mer per elev och är svåra att bemanna med behöriga lärare.',
      options:[
        {label:'Alla skolor kvar',text:'Varje by behåller sin skola, och barnfamiljerna får ett skäl att bo kvar. Det kostar mer per elev, och behöriga lärare räcker inte till alla klassrum.',set:{kunskap:1}},
        {label:'Färre och större skolor',text:'Lågstadiet och mellanstadiet samlas i färre skolor med skolskjuts. Pengarna räcker till behöriga lärare och bättre lokaler – men byarna förlorar en mötesplats, och de yngsta får långa bussresor.',set:{}},
        {label:'Skolan blir byns hus',text:'Byskolan delar hus med förskolan, biblioteket och de äldres träffar, och vuxna studerar där på distans. Huset lever hela dagen – men det kostar mer, och en del lektioner sker via skärm.',set:{kunskap:1,bogemenskap:1}},
      ]},
    {id:'dalaenergi',title:'Pengarna från Dala Energi',ev:['base:dala_energi_reavinst','base:resultat_2025_exkl_reavinst','base:soliditet_inkl_pension','base:besparing_socialforvaltning','base:personalomsattning','base:rfab_underhall_budget','community_e24'],
      ctx:'När kommunen 2025 löste in hälften av sina aktier i Dala Energi gav det en vinst på 311 miljoner kronor, mer än en tredjedel av ett års skatteintäkter och statsbidrag. För pengarna köptes en tiondel av Sambygd, som äger el- och fibernätet. Utan engångsvinsten blev resultatet 1,7 %, under målet på 2 %, och samma år varslades omkring 60 tjänster i äldreomsorgen och LSS.',
      options:[
        {label:'Behåll nätet',text:'Kommunen sitter kvar som delägare i el- och fibernätet, med utdelning och en röst när nätet byggs ut. Men pengarna är bundna när äldreomsorgen och husen behöver dem.',set:{}},
        {label:'Sälj och satsa på personalen',text:'Andelen säljs, och pengarna går till försök med sextimmarsdag i hemtjänsten och på äldreboendena. Personalen stannar och fler söker sig hit – men det är engångspengar till en kostnad som består.',note:'Sextimmarsförsöket på Svartedalens äldreboende i Göteborg kostade 12 miljoner kronor för 17 extra anställda.',set:{arbetstid:1}},
        {label:'Sälj och rusta husen',text:'Pengarna går till Rättviks Fastigheter: eftersatt underhåll, energirenovering och nya hyresrätter med gemensamma lokaler för unga och äldre. Bättre hus och lägre energikostnader – men pengarna räcker bara en gång.',set:{effektivitet:1,bogemenskap:1}},
      ]},
  ],
  2036:[
    {id:'vardnara',title:'Vården i byarna',ev:['base:okning_85_89_till_2034','base:hemtjanst_65plus_antal','base:ensamhet_hemtjanst_65plus','base:listade_invanare_per_allmanlakare','base:hyrlakare_andel_vardcentral','tech_ai_e1','tech_ai_e3','digital_resilience_e15'],
      ctx:'Kommunen räknade med 74 % fler 85–89-åringar 2034 än 2025, och allt mer avancerad vård ges i hemmen. Regionens vårdbuss till Furudal, Bingsjö och Boda beslutades 2023 men hade inte kommit tre år senare, och hyrläkare gjorde nästan en femtedel av läkararbetet på länets vårdcentraler.',
      options:[
        {label:'Vård via skärm och sensorer',text:'Läkaren nås på skärmen, sensorer larmar i hemmen och AI sorterar ärendena, så att fler kan bo kvar i byarna. Men den som inte klarar tekniken hamnar utanför, och människorna som kommer på besök blir färre.',note:'Nästan var fjärde svensk har avstått från att boka vård för att e-tjänsterna var för svåra.',set:{ai:2}},
        {label:'Sköterskan i byn',text:'Hälsostugor med distriktssköterska i Furudal och Boda, och hembesök innan någon blir sjuk. Nära och mänskligt – men det kräver personal som både kommunen och regionen redan har svårt att hitta.',set:{forebyggande:2}},
        {label:'Ett hälsokvarter i samhället',text:'Vårdcentralen, äldreboendet och familjecentralen vid Centralgatan växer till ett hälsokvarter med korta avstånd för personalen. Effektivt och tryggt för de flesta – men byborna får längre resor, och fler gamla måste flytta från sin by.',set:{}},
      ]},
    {id:'dalabanan',title:'Tåget till Stockholm',ev:['base:restid_tag_stockholm_min','base:direkttag_stockholm_per_vardag','base:restid_buss_falun_min','base:restid_uppsala_borlange_efter_atgarder_min','base:mal_restid_mora_stockholm_min','base:flyglinje_mora_arlanda_statligt_stod','base:bilandel_turistresor'],
      ctx:'År 2026 gick två direkttåg om dagen till Stockholm, det snabbaste på 3 timmar och 21 minuter, och bussen till Falun var snabbare än tåget sedan spåret dit revs på 1960-talet. Upprustningen av Dalabanan skulle korta resan med sju minuter till omkring 2031, men regionens mål – Mora–Stockholm på under tre timmar – hade inga pengar.',
      options:[
        {label:'Tätare tåg runt Siljan',text:'Fler regionaltåg mellan Mora, Rättvik, Leksand och Borlänge och bättre byten mot Stockholm. Billigt och vardagsnära – men resan till Stockholm tar lika lång tid som förut.',set:{forbindelser:1}},
        {label:'Stockholm på under tre timmar',text:'Rättvik driver på och betalar en del av mötesspår och snabbare tåg. Då går det att bo vid Siljan och arbeta i Stockholm några dagar i veckan – men en liten kommuns pengar binds i statens järnväg i många år.',set:{forbindelser:2}},
        {label:'Laddstolpar och buss',text:'Kommunen satsar på laddning och bussen till Falun i stället för på järnvägen. Det blir billigare – men nio av tio turister kommer till Dalarna med bil, och den som inte kör har svårt att ta sig härifrån.',set:{forbindelser:0}},
      ]},
    {id:'ledningarna',title:'Rören under gatorna',ev:['base:va_ledningsnat','base:va_skyfall_riskplatser','base:va_brukningsavgift_hojning_2025','base:koncern_laneskuld_per_invanare','base:skyfall_2023_skadade_villor','base:dimensionerande_skyfall_100ar_2h','mobility_e15','mobility_e16'],
      ctx:'De 60 milen vatten- och avloppsledningar är till stor del byggda 1955–1979, dagvattnet renas inte, och elva pumpstationer riskerar att svämma över vid skyfall. Taxan höjdes med 20 % 2025 och 5 % 2026, och kommunkoncernens lån var 113 000 kronor per invånare, mest för vatten och avlopp. Ovädret Hans skadade omkring 150 villor i kommunen 2023.',
      options:[
        {label:'Förnya i rask takt',text:'Gamla ledningar byts i snabb takt, och en nödvattenplan tas fram. Färre läckor och bräddningar och tryggare dricksvatten – men taxan höjs igen och lånen växer.',set:{beredskap:1}},
        {label:'Ge regnet plats',text:'Öppna diken, dammar och gröna tak tar hand om regnet där det faller och avlastar de gamla rören. Billigare än nya rör och grönare gator – men det tar mark, och rören blir inte yngre.',set:{anpassning:1}},
        {label:'Laga det som går sönder',text:'Taxan hålls nere, och pengarna räcker till annat. Men ledningarna blir äldre för varje år, och nästa skyfall möter samma nät.',set:{}},
      ]},
    {id:'skolmaten',title:'Maten i skolan och omsorgen',ev:['base:lokalproducerade_livsmedel','base:andel_ravaror_atertaget','base:sjalvforsorjningsgrad_vikt_lan','base:mjolkkor_antal','food_e34','food_e9','food_e16'],
      ctx:'År 2025 var 40 % av maten i kommunens kök lokalproducerad, och nästan en femtedel av råvarorna kom från naturbruksgymnasiets egen gård. Men Dalarna producerar bara drygt en tredjedel av den mat som äts i länet, och mjölkkorna i Rättvik fanns 2023 på fem gårdar.',
      options:[
        {label:'Bygdens mat',text:'Skolor och äldreboenden köper kött, mjölk, potatis och bröd från bygdens gårdar och fäbodar. Pengarna stannar i bygden och korna på betet – men maten kostar mer, och menyn följer säsongen.',set:{regionalt:1}},
        {label:'Mer baljväxter, mindre kött',text:'All offentlig mat följer en kost som ryms inom planetens gränser: baljväxter, rotfrukter och lite kött. Bättre för klimatet och folkhälsan – men bygdens kött och mjölk får färre köpare i de offentliga köken.',set:{kost:2}},
        {label:'Lägsta pris',text:'Upphandlingen går på pris, och det som sparas går till fler händer i omsorgen. Billigast – men maten kommer varifrån som helst, och gårdarna runt Siljan tappar en köpare.',set:{}},
      ]},
  ],
  2046:[
    {id:'regleringen',title:'Siljans reglering',ev:['base:siljan_ekologisk_status','base:siljan_dammningsgrans','base:siljan_medelvattenstand','base:siljan_andel_ar_over_dammningsgrans','biodiversity_baltic_e15','biodiversity_baltic_e13','biodiversity_baltic_e10'],
      ctx:'Siljan regleras från Gråda kraftverk sedan 1951. Kraftverken i Österdalälven stängde ute Siljansöringen från mer än 95 % av lekplatserna, ålen har försvunnit, och sjöns ekologiska status är bara måttlig. Nu ska regleringen få nya miljövillkor, och fiskvägar och en annan vårtappning ställs mot elen från vattenkraften.',
      options:[
        {label:'Fiskvägar och fria åar',text:'Fiskvägar förbi dammarna och restaurerade åmynningar och stränder, så att harr och öring kan vandra igen. Livet i sjön kommer långsamt tillbaka – men kraftverken förlorar en del el.',set:{hav:2}},
        {label:'Sjön före kraften',text:'Siljan regleras för livet i sjön, med en naturligare vårflod och lekplatser som återställs i stor skala. Den största förändringen sedan 1950-talet – men mindre el och reglerkraft just när den behövs, och vattenstånd som varierar mer.',set:{hav:3}},
        {label:'Kraften går först',text:'Regleringen justeras lite, och vattenkraften ger el och reglerkraft som förut – Gråda kan till och med starta elnätet på egen hand i en kris. Billigast och tryggast för elen – men öringen blir inte fler.',set:{hav:0}},
      ]},
    {id:'stranden',title:'Stranden och högvattnet',ev:['base:siljan_100arsniva_idag','base:siljan_100arsniva_2071_2100_rcp85','base:camping_andel_under_100arsniva','base:lagsta_strandgata_niva','base:byggnader_under_100arsniva','base:lagsta_grundlaggningsniva_siljan','base:siljan_hogsta_vattenstand_1985'],
      ctx:'Siljans hundraårsnivå ligger omkring 163,7 meter över havet och väntas stiga något när vintrarna blir blötare. Nästan halva campingen vid Siljansbadet ligger under den nivån, och de lägsta gatorna vid Enån ligger bara 30 centimeter över den. I Leksand ska nya hus vid Siljans utlopp grundläggas på minst 165 meter.',
      options:[
        {label:'Bygg högt vid stranden',text:'Nya bostäder och ett hotell vid Långbryggan byggs på upphöjd mark bakom en höjd strandpromenad. Fler skattebetalare och gäster året runt – men den öppna stranden krymper, och det som byggs vid vattnet måste skyddas för all framtid.',set:{anpassning:1}},
        {label:'Ge Siljan plats',text:'Campingen flyttar upp från stranden, och strandängarna blir park och översvämningsyta. Tryggt när sjön stiger – men flytten kostar, och sommargästerna vill helst bo vid vattnet.',set:{anpassning:2}},
        {label:'Lita på regleringen',text:'Sjön är reglerad, och det högsta vattenståndet sedan regleringen uppmättes redan 1985. Billigast i dag – men varje högvatten tar något av stranden, campingen och husen vid Enån.',set:{}},
      ]},
    {id:'byarnas_rost',title:'Byarnas röst',ev:['base:foreningar_i_registret','base:valdeltagande_kommunval','base:unga_mojlighet_paverka','community_e18','community_e21','community_e17','governance_e1'],
      ctx:'År 2026 fanns 24 bystuge- och bygdegårdsföreningar i kommunen, och 84 % röstade i kommunvalet. Men bara drygt en femtedel av de unga tyckte att de kunde föra fram sina åsikter till dem som bestämmer, och deras förtroende för politikerna hade fallit från 45 till 36 % på tre år.',
      options:[
        {label:'Fråga byarna först',text:'Kommunen håller dialogmöten i bystugorna och på skolorna före stora beslut, men fullmäktige bestämmer som förut. Billigt och snabbt – men den som inte kommer på mötena hörs inte.',set:{demokrati:1}},
        {label:'Byarna får en egen budget',text:'Varje bygd bestämmer själv över en del av investeringarna, och lottade invånare ger råd i de stora frågorna. Fler blir delaktiga – men det tar tid, och de som redan hörs mest kan ta över mötena.',set:{demokrati:2}},
        {label:'Ett ungdomsråd med veto',text:'Ett lottat råd av unga under 25 får stoppa beslut som binder bygden längre än en generation. Framtiden får en röst – men fullmäktige lämnar ifrån sig makt till några som ingen har valt.',set:{demokrati:3}},
      ]},
    {id:'bussarna',title:'Bussen till byarna',ev:['base:kollektivtrafik_vardagsresor_bra_andel','base:kollektivtrafik_marknadsandel','base:personbilar_per_1000_inv','base:korstracka_personbil_per_inv','mobility_e14','mobility_e5'],
      ctx:'År 2025 tyckte bara drygt en tredjedel av rättvikarna att kollektivtrafiken fungerade för vardagens resor, mot två tredjedelar i riket, och kommunen hade 679 bilar per 1 000 invånare. Kollektivtrafikens andel av resorna i Dalarna hade minskat sedan 2019, och busslinjen mellan Rättvik och Borlänge lades ned samma år.',
      options:[
        {label:'Tätare bussar och cykelvägar',text:'Fler turer på stråken runt Siljan och cykelvägar mellan byarna. Enkelt och beprövat – men den som bor långt från stråken behöver fortfarande bilen.',set:{kollektivt:1}},
        {label:'Skyttlar på beställning',text:'Små eldrivna bussar som beställs med telefonen hämtar vid grinden, och båtbussar går över Siljan. Bilen behövs mindre – men varje resa kostar mer än med en vanlig buss.',set:{kollektivt:2}},
        {label:'Samåkning och laddstolpar',text:'Kommunen satsar på samåkning och laddning i stället för bussar som går nästan tomma. Billigast – men den som inte kan köra, ung som gammal, blir beroende av andra.',set:{kollektivt:0}},
      ]},
  ],
  2056:[
    {id:'fabodarna',title:'Fäbodarna',ev:['base:fabodbete_hektar','base:mjolkkor_antal','base:jordbruksforetag_antal','base:spannmal_hektar','base:sjalvforsorjningsgrad_vikt_lan','base:vegetationsperiod_2100_rcp85','food_e5','food_e46'],
      ctx:'Fäbodbruket blev Unescos immateriella kulturarv 2024, och fäbodbetet var två tredjedelar av Rättviks betesmark. Men mjölkkorna halverades mellan 1981 och 2023 och fanns till slut på fem gårdar, och en tredjedel av länets bönder var över 60. Med ett varmare klimat kan odlingssäsongen runt Siljan bli två månader längre.',
      options:[
        {label:'Levande fäbodar',text:'Unga brukare får mark, stöd och mejerier, och korna går på skogsbete om somrarna som förr. Landskapet hålls öppet och kunskapen förs vidare – men det är hårt arbete för små pengar, och vargen och björnen finns i skogen.',set:{regionalt:2}},
        {label:'Bygden föder sig själv',text:'Ett matråd planerar för att bygden ska kunna föda sig själv, med spannmål på åkrarna igen, kvarnar och lager för 90 dagar. Tryggt i en kris – men maten blir dyrare, och skogsbygdens jord ger inte mycket.',set:{regionalt:3}},
        {label:'Låt skogen ta tillbaka',text:'Stödet går till de gårdar som bär sig, och de minsta fäbodarna växer igen. Billigare – men det öppna landskapet krymper, och ett levande kulturarv blir ett museum.',set:{}},
      ]},
    {id:'krisen',title:'Om elen och vattnet går',ev:['base:andel_egen_brunn','base:vattentakt_tillstand_max_dygn','base:sjalvforsorjningsgrad_vikt_lan','resilience_e5','resilience_e1','resilience_e23','resilience_e21'],
      ctx:'Nästan fyra av tio rättvikare har egen brunn, dubbelt så många som i länet, och kraftverket i Gråda kan starta elnätet på egen hand. Men 2025 hade bara drygt en tredjedel av svenskarna dryck hemma för en vecka, och totalförsvaret planerar för kriser som varar minst tre månader.',
      options:[
        {label:'En reservtäkt och en månads lager',text:'Tätorten får en andra vattentäkt, kommunen lager för 30 dagar och vården reservkraft. Beprövat och rimligt – men byarna får till stor del klara sig själva.',set:{beredskap:2}},
        {label:'Byarna klarar sig själva',text:'Varje by får reservvatten, el som kan gå i ö-drift och mat för 90 dagar, och bystugorna blir samlingsplatser i kris. Tryggt även om landet står still – men dyrt att hålla i ordning år efter år för något som kanske aldrig händer.',set:{beredskap:3}},
        {label:'Varje hushåll sin beredskap',text:'Kommunen informerar, och hushållen ska klara en vecka på egen hand. Billigt – men de gamla och de som bor ensamma har svårast att klara sig.',set:{}},
      ]},
    {id:'de_unga',title:'Att stanna eller flytta',ev:['base:unga_tror_flytta_fran_kommunen','base:unga_nojda_med_livet','base:gymnasieelever_i_kommunen','base:naturbruk_forstahandssokande','base:andel_20_64','demography_e8'],
      ctx:'År 2024 trodde två av tre unga i Rättvik att de skulle flytta, mest för jobb och studier, fast det bästa med att bo här var familjen och naturen. Stiernhööksgymnasiet hade fler sökande än platser till lantbruket, men närmaste högskola ligger i Falun och Borlänge.',
      options:[
        {label:'Lärcentrum vid stationen',text:'Den som vill studera vidare kan göra det på distans i Rättvik, med handledare och studiekamrater i samma hus. Billigt och nära – men de flesta utbildningar och jobb finns fortfarande i städerna.',set:{kunskap:1}},
        {label:'Bygden som klassrum',text:'Naturbruksgymnasiet växer till ett centrum för utbildning och forskning om fäbodar, skog och Siljan, tillsammans med högskolan. Unga stannar och nya kommer – men det kostar mycket för en liten kommun, och det tar en generation innan det bär.',set:{kunskap:2}},
        {label:'Välkommen tillbaka',text:'Unga ska ut i världen; kommunen satsar i stället på att locka hem dem som flyttat, när de har fått familj och erfarenhet. Billigt – men många kommer aldrig tillbaka, och skolan och omsorgen behöver folk nu.',set:{}},
      ]},
  ],
  2066:[
    {id:'energibygden',title:'Energibygden',ev:['energy_e16','base:broboberget_lannaberget_produktion','base:elanvandning_total','base:kalkverk_co2_fossil','base:vaxthusgaser_industri_per_inv','base:okat_behov_elnat_forbrukning_dalarna','energy_e9'],
      ctx:'Sveriges elanvändning väntades mer än fördubblas till 2045, och vinden i norra Rättviks skogar räcker till långt mer än bygden behöver: bara Broboberget och Lannaberget fick tillstånd för upp till 115 verk, omkring 1,5 TWh om året – tio gånger kommunens elanvändning. Kalkverkets koldioxid, nästan två tredjedelar av kommunens utsläpp, kan bara fångas in – och det kräver mycket el.',
      options:[
        {label:'Bygdens egna parker',text:'Några parker till, delägda av byarna, men ingen ny industri. El och pengar till bygden – men kalkverket släpper ut som förut.',set:{vind:2}},
        {label:'Energibygd',text:'Skogarna i norr blir kraftverk: el och vätgas från Furudal till industrin i landet, och kalkverket fångar in sin koldioxid. Jobb, intäkter och mycket lägre utsläpp – men skogen i norr blir industrimark, och mycket av vinsten hamnar hos bolagen.',set:{vind:3,effektivitet:2}},
        {label:'Skogen får vara skog',text:'Inga nya parker; de som finns förnyas när de blir gamla. Skogen och tystnaden i norr får vara i fred – men elen till framtidens industri görs någon annanstans, och kalkverkets utsläpp ligger kvar.',set:{}},
      ]},
    {id:'omsorgen',title:'Vem ska vårda?',ev:['base:andel_80plus_prognos_2040','base:forsorjningskvot','base:ensamhet_hemtjanst_65plus','base:hemtjanst_65plus_antal','base:persborg_planerade_bostader','community_e14','demography_e7','demography_e15'],
      ctx:'Var sjätte rättvikare väntas vara över 80 år 2070. Redan 2025 hade kommunen en av landets högsta försörjningskvoter – 1,09 unga och gamla för varje invånare i arbetsför ålder – och hälften av de äldre med hemtjänst besvärades av ensamhet.',
      options:[
        {label:'Generationsbyar',text:'Unga och gamla bor som grannar i samma hus och på samma gårdar, så som det en gång var tänkt i Persborg, och hjälper varandra med det vardagliga. Mindre ensamhet och fler händer – men alla vill inte bo så, och det tar decennier att bygga om.',set:{bogemenskap:3}},
        {label:'Robotar och sensorer',text:'Robotar lyfter och städar, och AI håller koll dygnet runt, så att personalen räcker till. Fler får hjälp – men händerna som hjälper är allt oftare maskinernas.',set:{ai:3}},
        {label:'Ett år för de gamla',text:'Alla unga gör ett år av samhällstjänst, mycket av det i omsorgen, och arbetsveckan blir kortare så att fler hinner hjälpa sina egna. Möten mellan generationerna – men tvång och kortare arbetstid kostar, och omsorg kräver kunnande.',set:{arbetstid:3}},
      ]},
    {id:'vintern',title:'Vintern som försvinner',ev:['base:istacke_dagar_2016_2026','base:skiddagar_2100_rcp45','base:vattentakt_tillstand_max_dygn','base:hogsommardygn_2071_2100_rcp45_lokal','health_e1','health_e6'],
      ctx:'Isen låg på Siljan 129 dagar om året i slutet av 1800-talet men 74 dagar under vintrarna 2016–2026, och vintern 2024/25 bara 35. Bilveckans vinterdag på isen flyttade till Oresjön redan 2024. Nära Falun väntades dagarna med bra skidföre bli färre än 40 om året till seklets slut, mot 90 förr.',
      options:[
        {label:'Konstsnö och konstis',text:'Snökanoner i Lerdalshöjden och spolade isbanor håller vintern vid liv för turister och barn. Backen och vinterjobben blir kvar – men snön kräver el, och backen får ta lika mycket vatten ur Enån per dygn som kommunens största vattentäkt.',set:{}},
        {label:'Friluftsliv året runt',text:'Pengarna går till leder, cykelvägar, bad och kanot runt Siljan, och vården skriver ut natur på recept. Fler rör sig fler månader om året – men vinterturisterna och backens jobb försvinner.',set:{forebyggande:2}},
        {label:'En bygd i rörelse',text:'Hela samhället planeras för att man ska gå, cykla och mötas året runt, med upplysta spår och bastu vid varje badplats. Friskare och mindre ensamma – men det tar mark och pengar, och vinterturisterna försvinner ändå.',set:{forebyggande:3}},
      ]},
  ],
  2076:[
    {id:'maskinerna',title:'Maskinerna och människorna',ev:['base:forsorjningskvot','base:tillsvidareanstallda','tech_ai_e17','tech_ai_e3','tech_ai_e19','digital_resilience_e14','digital_resilience_e12'],
      ctx:'AI-system kan nu göra mycket av arbetet i vård, skola och förvaltning – och få kommuner har haft så få invånare i arbetsför ålder som Rättvik. Hemtjänsten började med fjärrtillsyn redan 2025, men då använde tre procent av svenskarna inte internet alls, nästan alla pensionärer.',
      options:[
        {label:'AI i egen ägo',text:'Kommunerna i Dalarna äger sina AI-system tillsammans, på samma sätt som Rättvik redan äger sitt vatten- och avfallsbolag ihop med grannarna, och varje beslut kan granskas. Kontroll och förtroende – men dyrare och långsammare än att köpa av de stora bolagen.',set:{ai:2}},
        {label:'Automatisera allt som går',text:'AI och robotar tar över allt de kan i förvaltning, vård och skola, och personalen som finns kvar räcker till mötena med människor. Välfärden klarar sig med få händer – men kunnandet tunnas ut, och få vet hur besluten fattas.',set:{ai:3}},
        {label:'En människa i varje lucka',text:'Varje tjänst ska också gå att få utan skärm: telefon, papper, kontanter och en människa i bystugan. Ingen lämnas utanför – men dubbla system kostar, och personalen behövs också i omsorgen.',set:{analog:3}},
      ]},
    {id:'gatorna',title:'Gatorna i samhället',ev:['base:personbilar_per_1000_inv','base:hardgjord_mark_andel_tatort','base:gronyta_andel_tatort','mobility_e8','mobility_e11','mobility_e7'],
      ctx:'Storgatan var genomfartsväg tills riksvägen flyttades på 1980-talet, och 2025 fanns 679 bilar per 1 000 invånare i kommunen. Med självkörande skyttlar behöver allt färre en egen bil, och en femtedel av tätorten är fortfarande hårdgjord mark.',
      options:[
        {label:'Ett bilfritt centrum',text:'Torget, Storgatan och vägen ner till stranden blir bilfria, men bostadsgatorna är som förut. Ett levande centrum – men parkeringarna flyttar ut, och den som går med rullator får längre att gå.',set:{bilfritt:2}},
        {label:'Bilfri ort',text:'Gatorna i hela samhället blir trädgårdar, cykelvägar och mötesplatser, och bilarna stannar i utkanten. Tyst, grönt och tryggt för barnen – men den som kommer från byarna får byta färdmedel vid infarten.',set:{bilfritt:3}},
        {label:'Gatorna får vara gator',text:'Bilar, elbilar och skyttlar delar gatorna som nu. Enkelt för alla som kör – men asfalten tar plats som kunde bli grönska.',set:{}},
      ]},
    {id:'maten',title:'Vad äter Rättvik?',ev:['base:vall_andel_akermark','base:spannmal_hektar','base:akermark_per_invanare','food_e6','food_e4','food_e9','food_e36'],
      ctx:'Fyra femtedelar av Rättviks åkermark odlades 2025 med vall till djuren, och spannmålen hade krympt med tre fjärdedelar sedan 1981. Korna och fåren håller fäbodmarkerna öppna, men baljväxter och spannmål ger mer mat åt människor per hektar.',
      options:[
        {label:'Mindre kött, från betet',text:'All offentlig mat följer planetens gränser, och det kött som äts kommer från djur som betat fäbodmarker och vall – och från älgjakten. Öppna landskap och lägre utsläpp – men köttet blir dyrt och sällsynt.',set:{kost:2}},
        {label:'En ny matkultur',text:'Baljväxter och spannmål från åkern, svamp och bär från skogen, säsong i alla kök och nolltolerans mot svinn. Mest mat på minst mark – men det kräver nya vanor och nya grödor i ett nordligt klimat.',set:{kost:3}},
        {label:'Maten är privat',text:'Kommunen lägger sig inte i vad folk äter utanför skolan och omsorgen. Inga pekpinnar – men kosten och utsläppen följer det som säljs i butiken.',set:{}},
      ]},
  ],
  2086:[
    {id:'inflyttarna',title:'De nya rättvikarna',ev:['base:emigranter_1864_1889','base:fodelseoverskott_2025','base:flyttnetto_2025','base:befolkning_prognos_2070','demography_e17','community_e12'],
      ctx:'Mellan 1864 och 1889 utvandrade nästan tusen rättvikare till Amerika, ofta hela familjer som blev grannar igen i Minnesota. Nu kommer människor hit från länder där somrarna blivit för heta. I Rättvik har det dött fler än det fötts varje år sedan 2000, och det är inflyttarna som har hållit bygden levande.',
      options:[
        {label:'Generationshus i samhället',text:'Nya och gamla rättvikare flyttar in i generationshus med gemensamt kök nära skolan, vården och tåget. Man lär känna varandra över maten – men byarna får inga nya grannar.',set:{bogemenskap:2}},
        {label:'Byarna fylls igen',text:'Tomma gårdar och fritidshus blir hem för nya familjer, som blir grannar med varandra och med bygdens gamla, och bystugan blir skola i svenska. Byarna lever igen – men det kräver mycket av få grannar, och alla vill inte bo så nära.',set:{bogemenskap:3}},
        {label:'Så många som vi klarar',text:'Kommunen tar emot så många som skolan, vården och bostäderna räcker till. Ordning och trygghet – men bygden fortsätter att åldras, och omsorgen saknar händer.',set:{}},
      ]},
    {id:'taken',title:'Solen på gårdarna',ev:['base:riksintressen_kulturmiljo_antal','base:solceller_installerad_effekt','base:elproduktion_sol','energy_e17','energy_e10','energy_e3'],
      ctx:'De täta byarna med kringbyggda gårdar i Söderås är ett av kommunens 18 riksintressen för kulturmiljön. Nu kan nästan varje tak ge el, och batterierna har blivit billiga – men solceller på de gamla gårdarna förändrar det landskap som riksintresset ska skydda.',
      options:[
        {label:'Solparker utanför byarna',text:'Byarna äger solparker på lador, parkeringar och gamla grustag, och de skyddade gårdarna får vara som de är. Mycket el och orörda byar – men parkerna tar mark.',set:{sol:2}},
        {label:'Varje tak producerar',text:'Alla lämpliga tak, också de gamla gårdarnas, får solceller i takets färg, och byarna delar batterier. Billig el som bygden äger – men byarnas utseende förändras.',set:{sol:3}},
        {label:'Bara nya tak',text:'Solceller på nya hus och på kommunens tak, men inte på de gamla gårdarna. Byarna ser ut som de alltid gjort – men mer el måste köpas utifrån.',set:{sol:1}},
      ]},
    {id:'skyfallen',title:'Skyfallen',ev:['base:skyfall_2023_skadade_villor','base:max_dygnsnederbord_forandring_2069_2098_rcp85','base:vinternederbord_forandring_2071_2100_rcp85','base:dimensionerande_skyfall_100ar_2h','base:lagsta_grundlaggningsniva_siljan','mobility_e15','mobility_e16'],
      ctx:'I augusti 2023 skadade skyfall omkring 150 villor i Lerdal, Gärdebyn, Söderås och Utby, och 2,5 mil väg förstördes. Med höga utsläpp väntas årets största dygnsregn bli en femtedel kraftigare och vinterns nederbörd en tredjedel större till seklets slut.',
      options:[
        {label:'Skydda det viktigaste',text:'Vägar, pumpstationer och de mest utsatta husen skyddas, och stranden får ta emot vattnet. Rimligt och beprövat – men husen i sluttningarna får till stor del klara sig själva.',set:{anpassning:2}},
        {label:'En svampbygd',text:'Varje by tar hand om sitt vatten med dammar, diken och våtmarker, och nya hus byggs över 165 meter. Skyfall och högvatten gör liten skada – men det tar mark och pengar, och en del tomter kan aldrig bebyggas.',set:{anpassning:3}},
        {label:'Laga efter ovädret',text:'Kommunen lagar efter varje oväder i stället för att bygga om i förväg. Billigast de flesta år – men de år det smäller blir det dyrt, och försäkringarna blir dyrare för alla.',set:{}},
      ]},
  ],
  2096:[
    {id:'odlingen',title:'Odlingen i samhället',ev:['base:gronyta_andel_tatort','base:narhet_gronomrade_200m_andel','base:fjarrvarme_produktion','food_e23','food_e25','food_e42'],
      ctx:'Rättviks tätort var till två tredjedelar grön redan 2020, och 84 % av invånarna bodde inom 200 meter från ett grönområde. Värmeverket vid Stiernhööksgymnasiet gör över 50 GWh värme om året, och odlingssäsongen har blivit längre.',
      options:[
        {label:'Växthus vid stationen',text:'Ett stort växthus vid stationen och odlingar på parkeringarna ger grönt året runt. Mycket mat på liten yta – men det drar el och värme, och de flesta odlar inte själva.',set:{stadsodling:2}},
        {label:'Ett ätbart samhälle',text:'Fruktträd, bärbuskar och odlingar längs gator och på skolgårdar, och växthus som värms med spillvärme från värmeverket. Grönsaker året runt från samhället självt – men det kräver händer varje dag, och gräsmattorna försvinner.',set:{stadsodling:3}},
        {label:'Trädgårdarna räcker',text:'Rättvikarna odlar redan i sina trädgårdar och på kolonilotter. Ingen ny satsning – men den som bor i lägenhet har ingenstans att odla.',set:{}},
      ]},
    {id:'kretsloppet',title:'Lagat, lånat och återbrukat',ev:['base:kommunalt_avfall_kg_per_inv','base:materialatervinning_andel','base:kretsloppsplan_mal_avfallsminskning','governance_e8','governance_e12','governance_e13'],
      ctx:'Hösten 2025 öppnade återbruket Ta Till Vara i Rättvik, och kretsloppsplanen sade att avfallet skulle minska med en fjärdedel till 2030. Samma år samlades 395 kilo avfall in per invånare.',
      options:[
        {label:'Laga och låna',text:'Reparationsverkstäder och lånebibliotek för verktyg och kläder i varje by, och hus som byggs av återbrukat virke. Mindre avfall och fler som kan laga – men de flesta köper nytt ändå.',set:{effektivitet:2}},
        {label:'Nollavfall',text:'Allt som säljs i bygden ska gå att laga, låna eller återbruka, och Lokstallarna blir verkstad och lånebibliotek för allt från skidor till symaskiner. Nästan inget slängs – men mycket blir dyrare att köpa, och alla måste vara med.',set:{effektivitet:3}},
        {label:'Sortera som förr',text:'Återvinningscentralerna och återbruksbutiken får räcka. Enkelt – men sakerna kommer och går lika fort som förut.',set:{}},
      ]},
    {id:'sommarrattvikarna',title:'Sommarrättvikarna',ev:['base:fritidshus_antal','base:fritidshus_lokalt_agda_andel','base:befolkning_juli_okning','base:elanvandning_fritidshus','community_e18','community_e21'],
      ctx:'År 2025 fanns 2 980 fritidshus i Rättvik, över fyra gånger så många per invånare som i riket, och drygt fyra av fem ägdes av folk som bodde någon annanstans. I juli var det 58 % fler människor i kommunen än i november – men den som bara är här på sommaren har ingen röst i kommunvalet.',
      options:[
        {label:'En röst för sommargästerna',text:'Fritidshusägarna får vara med i byarnas råd och budgetar och betalar en avgift till vägar, vatten och föreningar. Fler som bryr sig om bygden, och mer pengar – men de som bor här året runt får dela makten.',set:{demokrati:2}},
        {label:'Fritidshus blir hem',text:'Snabba tåg och arbetsplatser på distans gör att fler fritidshusägare flyttar hit på riktigt. Fler invånare och skattebetalare – men husen blir dyrare för unga som vill bo kvar.',set:{forbindelser:2}},
        {label:'Två befolkningar',text:'Bygden lever som förr med en befolkning på vintern och en större på sommaren. Enkelt och billigt – men många hus står tomma större delen av året.',set:{}},
      ]},
  ],
  2106:[
    {id:'barndomen',title:'Barndomen vid Siljan',ev:['base:gymnasieelever_ar1_mar_bra','base:psykisk_ohalsa_barn_unga','digital_resilience_e4','digital_resilience_e5','digital_resilience_e8','health_e2'],
      ctx:'I elevhälsans samtal 2025/26 mådde nio av tio fjärdeklassare i Rättvik bra, men bara två av tre förstaårselever på gymnasiet – och fyra av tio av dem var nedstämda varje vecka. Folkhälsomyndigheten rekommenderade redan 2024 högst en till två timmar skärm om dagen på fritiden för barn mellan 6 och 12 år.',
      options:[
        {label:'Skärmfri barndom',text:'Ingen egen skärm före tolv år: skogen, sjön, fiolen och slöjden i stället, och allt viktigt finns också utan skärm. Mer lek och sömn – men barnen lär sig tekniken senare än andra, och föräldrarna får stå emot.',set:{analog:3}},
        {label:'Mobilfri skola, fria hem',text:'Skolan är mobilfri, som den har varit sedan 2026, och hemma bestämmer familjerna. Lätt att enas om – men skärmtiden på kvällarna blir som förut.',set:{}},
        {label:'Digital från första dagen',text:'Barnen lär sig med AI-handledare och skärmar från förskolan, så att de är redo för en digital värld. Tidigt kunnande – men mindre rörelse och lek, och mer tid framför skärmen.',set:{analog:0}},
      ]},
    {id:'byarna',title:'Ska alla byar leva?',ev:['base:kommun_yta','base:skogsmark_andel_landareal','base:folkmangd_tatort','base:befolkning_1970','base:kollektivtrafik_vardagsresor_bra_andel','mobility_e14'],
      ctx:'Vision 2030 ville ha attraktiva boendemiljöer i hela kommunen, och Rättviksmodellen lovade att bevara byarna. Men nästan nio tiondelar av kommunen är skog, och mellan 1970 och 2023 växte tätorten från 3 900 till 5 400 invånare medan resten av kommunen krympte.',
      options:[
        {label:'Några starka byar',text:'Skola, butik och täta skyttlar samlas i de största byarna, som Furudal, Boda och Vikarbyn, och de minsta blir fritidsbyar och fäbodar. Billigare och hållbart – men gårdar som brukats i generationer töms.',set:{kollektivt:2}},
        {label:'Skyttlar till varje by',text:'Avgiftsfria, självkörande skyttlar går till varje by dygnet runt, så att man kan bo var som helst utan bil. Hela kommunen lever – men det är dyrt att köra halvtomma skyttlar på skogsvägarna.',set:{kollektivt:3}},
        {label:'Samla bygden i samhället',text:'Nya bostäder byggs i tätorten nära tåg, vård och skola, och byarna får klara sig med det som finns. Effektivt – men Rättviksmodellen överges, och landskapet töms på folk.',set:{}},
      ]},
    {id:'sommarstaden',title:'Sommarstaden',ev:['base:hogsommardygn_1991_2020_lokal','base:hogsommardygn_2071_2100_rcp85_lokal','base:bilandel_turistresor','base:gastnatter','base:gastnatter_sommar_andel','base:camping_andel_gastnatter','base:klimat_bilresa_100mil'],
      ctx:'Kring 2020 var det omkring 16 högsommardagar om året vid Siljan, och till seklets slut väntades 25 till 39. Redan då kom nio av tio turister till Dalarna med bil, och en tredjedel av årets gästnätter i Rättvik var i juli. Nu, när sydligare stränder blir för heta, söker sig fler till svala sjöar och skogar.',
      options:[
        {label:'Tåg hela vägen',text:'Tåg varje timme till Stockholm och nattåg från kontinenten, med elbåtar och cyklar på plats. Sommargästerna kommer utan bil – men staten och regionen måste vara med och betala, och resan tar längre tid än med flyg.',set:{forbindelser:3}},
        {label:'Fler bäddar vid Siljan',text:'Fler campingplatser, stugor och hotell tar emot de nya sommargästerna. Jobb och pengar till bygden – men vatten, vägar och stränder ska räcka till många fler, och priserna stiger för dem som bor här.',set:{}},
        {label:'Stränderna åt sjön',text:'Inga nya anläggningar vid vattnet: strandängar och vassar får växa tillbaka, och gästerna bor längre upp. Siljan mår bättre – men färre gäster får plats, och handeln och campingarna går miste om pengar.',set:{hav:2}},
      ]},
  ],
  2116:[
    {id:'rattvik800',title:'Rättvik 800 år',ev:['base:rattvik_egen_socken','base:vasa_tal_ar','base:valdeltagande_kommunval','governance_e5','governance_e1','governance_e23'],
      ctx:'Omkring 1325 blev Rättvik en egen socken, och vid kyrkan talade Gustav Vasa till dalkarlarna 1520. År 2026 sträckte sig kommunens vision och översiktsplan bara till 2030. Vad ska Rättvik lova dem som lever här år 2226?',
      options:[
        {label:'Medborgarråd för gott',text:'Lottade medborgarråd och byarnas egna budgetar blir en fast del av hur Rättvik styrs. Fler är med och bestämmer – men det går långsamt, och ansvaret blir otydligare.',set:{demokrati:2}},
        {label:'En plan för nästa sekel',text:'Byarna och de unga skriver en hundraårsplan, och ett ombud för kommande generationer får vetorätt i frågor som binder bygden längre än en generation. Långsiktigt – men varje framtida fullmäktige får mindre frihet.',set:{demokrati:3}},
        {label:'Låt de kommande bestämma',text:'Varje generation får forma sin egen tid, som den här har gjort. Frihet för dem som kommer – men inget löfte till dem.',set:{}},
      ]},
    {id:'fiolen',title:'Tid för fiolen',ev:['base:foreningar_i_registret','base:idrottsforeningar_lok_per_10000','community_e22','community_e23','community_e25','tech_ai_e17'],
      ctx:'”Om tre rättvikare träffas spelar fyra fiol”, säger man i bygden, och 2026 fanns 93 föreningar i kommunens register. Maskinerna gör nu det mesta av det arbete som går att automatisera. Hur mycket ska en rättvikare arbeta år 2126?',
      options:[
        {label:'Fyra dagar och en tidsbank',text:'Fyradagarsvecka, och timmar som läggs på grannarna kan bytas mot hjälp tillbaka i en tidsbank. Mer tid och mer hjälp mellan grannar – men det passar inte alla yrken.',set:{arbetstid:2}},
        {label:'30 timmar och ett år för bygden',text:'Kortare arbetsvecka och ett år av samhällstjänst för alla unga; resten av tiden går till föreningar, fäbodar och musik. Tid för varandra – men lägre löner och färre timmar i vården.',set:{arbetstid:3}},
        {label:'Fem dagar som förr',text:'40 timmar i veckan, och överskottet går till välfärden. Mer pengar till omsorgen – men mindre tid till allt annat.',set:{arbetstid:0}},
      ]},
    {id:'siljan',title:'Siljan om hundra år',ev:['base:siljansringen_alder','base:istacke_dagar_2016_2026','base:siljan_ekologisk_status','biodiversity_baltic_e15','governance_e5'],
      ctx:'Siljan ligger i kanten av en krater som en meteorit slog för 377 miljoner år sedan. Isen som förr låg kvar till maj lägger sig knappt längre, ålen är sedan länge borta, och sjön har gett fisk, kraft och resvägar åt varje generation.',
      options:[
        {label:'Vård i lugn takt',text:'Stränder och åar fortsätter att restaureras i den takt pengarna räcker. Sjön blir bättre – men ålen kommer inte tillbaka.',set:{hav:2}},
        {label:'Siljans återkomst',text:'Sjön regleras för livet i den: fria vandringsvägar, återställda stränder och ålen tillbaka. Ett levande arv till dem som kommer – men dammarna ger mindre el, och stränderna får se ut som naturen vill.',set:{hav:3}},
        {label:'Sjön får ge mer',text:'Värme ur sjövattnet till samhället och mer reglerkraft från dammarna. Billig energi och fler jobb – men livet i sjön får stå tillbaka.',set:{hav:0}},
      ]},
  ],
};

if(LANG==='en')for(const list of Object.values(DECISIONS))for(const c of list){c.title=L(c.title);c.ctx=L(c.ctx);for(const o of c.options){o.label=L(o.label);if(o.text)o.text=L(o.text);if(o.note)o.note=L(o.note);}}
// How the journey begins (the first page of Resan): Rättvik today and the kommun's own horizon.
export const JOURNEY_INTRO={sv:'Rättviks kommun hade 10 978 invånare 2025, och var tredje var 65 år eller äldre. Kommunens Vision 2030, ”Rättvik, där tradition möter framtid”, och översiktsplanen sträcker sig fyra år framåt – ingen har skrivit ner hur bygden vid Siljan ska leva om hundra år. Det bestämmer du nu, decennium för decennium, tillsammans med släkten.',
  en:'Rättvik Municipality had 10,978 inhabitants in 2025, and one in three was 65 or older. Its Vision 2030, “Rättvik, where tradition meets the future”, and its comprehensive plan reach four years ahead – no one has written down how the community by Lake Siljan should live a hundred years from now. You decide that now, decade by decade, together with the family.'};
