import { LANG, L } from '@engine/i18n.js';
// The journey's dilemmas, three per decade. Each option sets lever levels from that decade on.
// `ev` lists research ids (research/vision-research.json) shown as "Forskningen säger".
// Facts about today are sourced there; later decades are imagined situations built on the trends.
export const DECISIONS={
  2026:[
    {id:'skeppsbron',title:'Parkeringarna vid hamnen',ev:['mobility_e2','food_e20','mobility_e8'],
      ctx:'Stora asfaltsytor vid Skeppsbron och Ölandskajen används som parkering. 44 % av bilresorna i tätorten är kortare än fem kilometer.',
      options:[
        {label:'Behåll parkeringen',text:'Bilen behövs för handeln och besökarna.',set:{bilfritt:0,stadsodling:0}},
        {label:'Matpark och odlingslotter',text:'Asfalten bryts upp: fruktträd, växthus och odlingar som grannar sköter tillsammans.',set:{stadsodling:2,bilfritt:1},note:'Kostar platser för bilister och kräver att någon organiserar odlingen.'},
        {label:'Sälj marken för bostäder',text:'Pengar till kommunkassan och nya lägenheter – men ingen grönska.',set:{stadsodling:0,bilfritt:1},effect:{welfare:.02}},
      ]},
    {id:'skarmar',title:'Skärmarna i skolan',ev:['digital_resilience_e5','digital_resilience_e4','digital_resilience_e7','digital_resilience_e8'],
      ctx:'Sedan augusti 2026 samlar skolorna in elevernas mobiler. Folkhälsomyndigheten rekommenderar högst 1–2 timmar skärmtid på fritiden för 6–12-åringar, men 87 % av unga ligger över tre timmar.',
      options:[
        {label:'Följ lagen, inget mer',text:'Mobilerna samlas in under skoldagen. Resten är upp till familjerna.',set:{analog:1}},
        {label:'Skärmfri barndom till 12 år',text:'Böcker, slöjd, uteundervisning. AI och skärmar först i högstadiet – som verktyg.',set:{analog:2},note:'Forskningen om mobilförbud är blandad: norsk registerstudie visar färre vårdbesök bland flickor, en brittisk studie ingen skillnad.'},
        {label:'En AI-lärare till varje barn',text:'Personlig AI-handledning i alla ämnen från förskoleklass.',set:{ai:2,analog:0},note:'Kan lyfta svaga elever, men riskerar mer skärmtid och beroende.'},
      ]},
    {id:'barnbarnsombud',title:'Ett ombud för dem som inte är födda än',ev:['governance_e1','governance_e2','governance_e19','governance_e3'],
      ctx:'Kalmars längsta officiella planeringshorisont är 2050. I Wales finns sedan 2015 en lag och ett ombud för framtida generationer, som bland annat bidrog till att stoppa en motorvägsutbyggnad.',
      options:[
        {label:'Nej, fyra år i taget',text:'Politiken ska vara fri att prioritera nuet.',set:{demokrati:0}},
        {label:'Lottade medborgarråd',text:'Ett råd av slumpvis utvalda invånare ger råd i de stora frågorna.',set:{demokrati:2}},
        {label:'Barnbarnsombud med veto',text:'Ett ombud som kan stoppa beslut som skadar kommande generationer.',set:{demokrati:3},note:'Granskningar i Wales visar att lagen fått tyngd men ännu inte driver systemförändring överallt.'},
      ]},
  ],
  2036:[
    {id:'vatten',title:'Torkan och vattnet',ev:['base:dricksvattenmarginal_kalmar','base:hushallens_vattenbehov_2050_kalmar','base:oberoende_ravattensystem_kalmar','base:kalmarsundsverket_atervunnet_vatten_kapacitet','base:avsaltning_morbylanga_kapacitet','resilience_e8','resilience_e13','biodiversity_baltic_e11'],
      ctx:'Kalmar har ett enda råvattensystem: Nybroåsen, påfyllt med vatten från Hagbyån. Torråret 2025 föll marginalen från 39 till 19 %, och kommunens vattenplan räknar med att behovet växer med en tredjedel till 2050. På Öland klarar avsaltningsverken knappt halva julitoppen.',
      options:[
        {label:'En andra vattenkälla',text:'Kalmarsundsverkets renade vatten blir dricksvatten, och ett avsaltningsverk på stadens solel tar topparna.',set:{beredskap:2,sol:2}},
        {label:'Våtmarker och vattenspar',text:'Hålla vattnet i landskapet med våtmarker och infiltration, och använda en sjättedel mindre per person.',set:{hav:2,anpassning:1,effektivitet:1}},
        {label:'Vänta och se',text:'Förra torkan gick över.',set:{},note:'Med dagens källor räcker vattnet inte ett torrt år någon gång kring 2040.'},
      ]},
    {id:'bilfritt',title:'Ett bilfritt Kvarnholmen?',ev:['mobility_e8','mobility_e10','mobility_e19','mobility_e7'],
      ctx:'Pontevedra i Spanien har återtagit ungefär 80 % av gatuytan från bilen. I Gent minskade biltrafiken med 17 % efter cirkulationsplanen – men 30 % av invånarna sa att de handlade mer sällan i centrum.',
      options:[
        {label:'Gångfartsgator',text:'Bilar får köra, men på gåendes villkor.',set:{bilfritt:1}},
        {label:'Bilfritt med medborgarråd',text:'Invånarna utformar omvandlingen kvarter för kvarter.',set:{bilfritt:2,demokrati:2},note:'Långsammare men med mindre motstånd.'},
        {label:'Bilfritt på en gång',text:'Gatorna bryts upp inom fem år.',set:{bilfritt:3},note:'Snabbt, men motståndet kan kosta tillit.'},
      ]},
    {id:'universitet',title:'Universitetet vid sundet',ev:['base:helarsstudenter_kalmar','base:lnu_sparkrav_mnkr','base:universitetskajen_forsta_hyresavtal_lopertid','base:kvarstannande_examinerade_3ar','base:lmo_provtagningstillfallen','base:sjofartshogskolan_studenter'],
      ctx:'Linnéuniversitetet har ungefär 6 000 helårsstudenter i Kalmar och sedan 2021 ett campus vid Kalmar C. Nu ska universitetet spara 120 miljoner kronor, hyresavtalen för halva campus löper ut 2028 och 2030, och ungdomskullarna krymper efter 2035. 38 % av de examinerade bor kvar i regionen.',
      options:[
        {label:'Universitetet sköter sitt',text:'Kommunen fortsätter med sitt forskningsanslag på 1,5 miljoner kronor om året.',set:{kunskap:0},note:'Rektorn har talat om upp till 1 000 färre studenter till 2030.'},
        {label:'Säkra campus och bostäder',text:'Staden går in i hyresavtalen och ger nyutexaminerade förtur till lägenheter.',set:{kunskap:1}},
        {label:'Kalmarsund som levande labb',text:'Skolklasser, fiskare och forskare mäter och restaurerar sundet tillsammans, och Sjöfartshögskolan blir testbädd för fossilfri sjöfart.',set:{kunskap:2}},
      ]},
    {id:'aivard',title:'AI i vården',ev:['tech_ai_e1','tech_ai_e3','tech_ai_e5','tech_ai_e15'],
      ctx:'I den svenska MASAI-studien hittade AI-stödd mammografi 29 % fler cancrar med 44 % mindre arbete för röntgenläkarna. Samtidigt tappade läkare som vant sig vid AI förmåga när den togs bort.',
      options:[
        {label:'Öppen, lokal AI',text:'Regionen bygger egna system med data i invånarnas ägo och mänskligt sista ord.',set:{ai:2,demokrati:2}},
        {label:'Köp av techjättarna',text:'Snabbast och billigast – men data och kontroll hamnar utanför Kalmar.',set:{ai:3}},
        {label:'Försiktighet',text:'Bara beprövade verktyg, och ingen AI i patientmötet.',set:{ai:1}},
      ]},
  ],
  2046:[
    {id:'vind',title:'Vindkraft i Kalmarsund',ev:['energy_e6','energy_e7','energy_e8'],
      ctx:'Kårehamn utanför Öland ger cirka 194 GWh per år. 2024 avslog regeringen tretton havsvindparker i Östersjön av försvarsskäl. Nu finns ett nytt förslag i södra Kalmarsund.',
      options:[
        {label:'Invånarägd vindpark',text:'Kalmarborna äger andelar, försvaret är med från början.',set:{vind:2,demokrati:2}},
        {label:'Exportpark',text:'En stor park som gör Kalmar till en energiregion.',set:{vind:3},note:'Mer intäkter, mer lokalt motstånd.'},
        {label:'Ingen havsvind',text:'Utsikten mot Öland och fåglarna går före.',set:{vind:0}},
      ]},
    {id:'arbetstid',title:'Tid för varandra',ev:['community_e22','community_e23','community_e24','community_e25'],
      ctx:'Automatiseringen frigör arbetstid. Försök med fyradagarsvecka i Storbritannien och Island blev kvar hos de flesta arbetsgivare; sextimmarsdagen på Svartedalen kostade 12 miljoner kronor.',
      options:[
        {label:'Fyradagarsvecka och tidsbank',text:'Den fria dagen går till odling, omsorg och föreningar.',set:{arbetstid:2}},
        {label:'Behåll 40 timmar',text:'Produktionen och skatteintäkterna går först.',set:{arbetstid:0}},
        {label:'30 timmar och medborgartjänst',text:'Ett år av samhällstjänst för alla unga.',set:{arbetstid:3}},
      ]},
    {id:'tag',title:'Tåget till Stockholm',ev:['base:restid_tag_kalmar_stockholm_min','base:restid_tag_kalmar_kobenhavn_min','base:stangadalsbanan_elektrifierad_andel','base:restid_mal_kalmar_vaxjo_2040','base:flyg_passagerare_kalmar_2025','base:flyg_passagerare_kalmar_2019','mobility_e3'],
      ctx:'Från Kalmar C tar tåget 67 minuter till Växjö och 3 h 44 till Köpenhamn, men till Stockholm krävs byte och omkring fyra och en halv timme. Stångådalsbanan mot Linköping har ingen el. Flyget till Arlanda har tappat 62 % av resenärerna sedan 2019.',
      options:[
        {label:'Tätare regionaltåg',text:'Fler avgångar och snabbussar till Öland, men samma banor.',set:{forbindelser:1}},
        {label:'Direkttåg under fyra timmar',text:'Regionen driver och medfinansierar dubbelspår till Växjö, Alvestatriangeln och el på Stångådalsbanan.',set:{forbindelser:3},note:'Statens beslut – och under fyra timmar upphör stödet till flyget.'},
        {label:'Flyget räcker',text:'Satsa på flygplatsen i stället.',set:{forbindelser:0},note:'Flyget har tappat 62 % av resenärerna sedan 2019.'},
      ]},
    {id:'musslor',title:'Musslorna och havet',ev:['biodiversity_baltic_e4','food_e38','food_e44','biodiversity_baltic_e19'],
      ctx:'Nästan 94 % av Östersjön är övergödd och ingen kustvattenförekomst i Kalmar har god status. Musslor och våtmarker tar upp kväve – men havet svarar med decenniers fördröjning.',
      options:[
        {label:'Musselodling och våtmarker',text:'Tillsammans med bönderna längs Hagbyån och Ljungbyån.',set:{hav:2,regionalt:2}},
        {label:'Allt på restaurering',text:'Fiskefria zoner, tusentals hektar våtmark, fånggrödor på slätten.',set:{hav:3}},
        {label:'Det är ett internationellt problem',text:'Låt HELCOM och EU sköta det.',set:{hav:0}},
      ]},
  ],
  2056:[
    {id:'stormflod',title:'Havet stiger',ev:['resilience_e17','resilience_e16','resilience_e18'],
      ctx:'Ett 100-årshögvatten når i dag 1,29 m (RH 2000) och väntas nå nästan 2 m år 2100 vid höga utsläpp. Kvarnholmens lägsta kaj ligger på 1,5 m och gatorna börjar svämma över vid 1,8 m. Nya hus byggs redan på +2,8 m.',
      options:[
        {label:'Skyddsvall runt Kvarnholmen',text:'En vall med promenad ovanpå – men kajerna från 1600-talet förändras.',set:{anpassning:2}},
        {label:'Flytande sundsdistrikt',text:'Bygg med havet: flytande hus, odlingar och parker i hamnbassängen.',set:{anpassning:3}},
        {label:'Höj kajerna lite i taget',text:'Billigast i dag.',set:{anpassning:1}},
      ]},
    {id:'generationshus',title:'Ensamheten',ev:['community_e1','community_e6','community_e12','community_e14'],
      ctx:'Var fjärde vuxen i Sverige besväras av ensamhet, och 41 % av hushållen är en person. Starka sociala band ökar chansen att överleva med 50 %.',
      options:[
        {label:'Generationshus i varje kvarter',text:'Förskola, seniorer och studenter under samma tak, kvarterskök för alla.',set:{bogemenskap:3}},
        {label:'Gemensamma lokaler',text:'Varje nytt hus får en samlingslokal.',set:{bogemenskap:1}},
        {label:'Varje hushåll för sig',text:'Bostaden är en privatsak.',set:{bogemenskap:0}},
      ]},
    {id:'matlager',title:'Om kriget kommer',ev:['resilience_e1','resilience_e5','resilience_e23','food_e17'],
      ctx:'Totalförsvaret planerar för minst tre månaders kris. Bara 36 % av hushållen har dricksvatten för en vecka hemma.',
      options:[
        {label:'90 dagar självförsörjning',text:'Regionala lager, ö-drift av elnätet och mat från slätten.',set:{beredskap:3,regionalt:2}},
        {label:'30 dagar och övningar',text:'Kommunala lager och en årlig beredskapsvecka.',set:{beredskap:2}},
        {label:'Staten får sköta det',text:'Beredskap är inte kommunens sak.',set:{beredskap:0}},
      ]},
  ],
  2066:[
    {id:'maten',title:'Vad äter Kalmar?',ev:['food_e9','food_e34','food_e6','food_e5'],
      ctx:'Svensk genomsnittskost överskrider planetens gränser ungefär tre gånger. Ett nordiskt ekologiskt livsmedelssystem skulle ändå kunna föda befolkningen.',
      options:[
        {label:'Planetary health diet i all offentlig mat',text:'Baljväxter, säsong och lite kött i skolor och omsorg.',set:{kost:2}},
        {label:'En ny matkultur',text:'Nolltolerans mot svinn och en stad som lagar mat tillsammans.',set:{kost:3,bogemenskap:2}},
        {label:'Var och en väljer',text:'Det offentliga ska inte styra vad folk äter.',set:{kost:0}},
      ]},
    {id:'cirkular',title:'Saker vi delar',ev:['governance_e14','governance_e8','energy_e12'],
      ctx:'Svenska hushålls konsumtion orsakar runt 8 ton växthusgaser per person och år. Nivån för ett 1,5-gradersliv är 0,7 ton år 2050.',
      options:[
        {label:'Lånebibliotek och reparation',text:'Verktyg, kläder och elektronik delas och lagas.',set:{effektivitet:2}},
        {label:'Nollavfall',text:'Allt byggs för att repareras, delas eller återbrukas.',set:{effektivitet:3}},
        {label:'Marknaden löser det',text:'Inga kommunala insatser.',set:{effektivitet:0}},
      ]},
    {id:'halsotorg',title:'Hälsa före vård',ev:['health_e1','health_e12','health_e3'],
      ctx:'120 minuter i veckan i naturen hänger ihop med 59 % högre chans till god hälsa. Folkhälsoinsatser ger i median 14 kronor tillbaka per satsad krona.',
      options:[
        {label:'Natur och rörelse på recept',text:'Hälsotorg i varje stadsdel.',set:{forebyggande:2}},
        {label:'Hälsa i allt',text:'Stadsplanering för rörelse, möten och grönska.',set:{forebyggande:3}},
        {label:'Mer sjukvård',text:'Pengarna går till operationer och vårdplatser.',set:{forebyggande:0}},
      ]},
  ],
  2076:[
    {id:'aimakt',title:'Vem äger maskinerna?',ev:['tech_ai_e17','tech_ai_e11','tech_ai_e19'],
      ctx:'Nya AI-system kan göra mycket av dagens arbete. Amsterdam har publicerat beskrivningar av sina algoritmer i ett öppet register.',
      options:[
        {label:'Algoritmregister och medborgarråd',text:'All offentlig AI granskas öppet; vinsterna blir kortare arbetstid.',set:{demokrati:3,arbetstid:2}},
        {label:'Full fart',text:'Automatisera allt som går, så snabbt som möjligt.',set:{ai:3}},
        {label:'Rätten till ett analogt liv',text:'Varje tjänst ska också finnas utan skärm.',set:{analog:3}},
      ]},
    {id:'olandsbron',title:'Den nya Ölandsbron',ev:['base:olandsbron_livslangd_planerad_till','base:olandsbron_renovering_2027_2030_mnkr','base:oland_arbetspendlare_till_kalmar','base:olandsbron_gang_cykelforbud_sedan','base:olandsleden_tallhagen_lagsta_niva','mobility_e3','mobility_e5'],
      ctx:'Ölandsbron från 1972 ska hålla till minst 2075 – sedan måste den ersättas. En ny bro kostar 10–15 miljarder kronor och blir statens beslut, men regionen avgör vad den bär. 6 900 pendlar över sundet, och gång och cykel har varit förbjudet på bron sedan 2009.',
      options:[
        {label:'Spårväg och cykel till Färjestaden',text:'Spårvagnen tar 20 minuter från Kalmar C, en vindskyddad cykelbana går över sundet, och Ölandsleden höjs över havet.',set:{kollektivt:3}},
        {label:'Spårväg i staden, bussar över bron',text:'Spårvägen går till brofästet; bussar i egna körfält tar resten.',set:{kollektivt:2}},
        {label:'En ny bro för bilar',text:'Fyra körfält som i dag.',set:{kollektivt:1}},
      ]},
    {id:'slatten',title:'Kalmarslätten',ev:['food_e13','food_e31','food_e32','biodiversity_baltic_e12'],
      ctx:'Länet har dubbelt så mycket åkermark per invånare som riket. Ekologiska skördar är i snitt lägre, men fånggrödor halverar kväveläckaget och binder kol.',
      options:[
        {label:'Regenerativt jordbruk',text:'Levande jordar, lokala mejerier och kvarnar.',set:{regionalt:2}},
        {label:'Matsuveränitet',text:'Ett regionalt livsmedelsråd styr mot att föda länet först.',set:{regionalt:3}},
        {label:'Exportjordbruk',text:'Kyckling och mjölk till världsmarknaden.',set:{regionalt:0}},
      ]},
  ],
  2086:[
    {id:'kulturarv',title:'1600-talsstaden och havet',ev:['resilience_e17','resilience_e18'],
      ctx:'Varje stormflod tar något av Kvarnholmen. Ska vallen bli högre, eller ska delar av stadskärnan få ge plats åt havet?',
      options:[
        {label:'Höj vallen',text:'Allt ska skyddas.',set:{anpassning:3}},
        {label:'Ge havet plats',text:'Flytta det lägsta, behåll det viktigaste.',set:{anpassning:2},note:'Mindre ingrepp, mer förlust vid storm.'},
        {label:'Lita på det vi har',text:'Ingen ny satsning.',set:{}},
      ]},
    {id:'sol',title:'Varje tak',ev:['energy_e1','energy_e2','energy_e17'],
      ctx:'Ett söderlutande tak i Kalmar ger cirka 1 010 kWh per installerad kilowatt och år – men juni ger 28 gånger mer än december.',
      options:[
        {label:'Energigemenskaper',text:'Kvarteren äger och delar sin sol och sina batterier.',set:{sol:3}},
        {label:'Kommunens tak räcker',text:'Skolor och sporthallar.',set:{sol:1}},
        {label:'Låt bli taken',text:'Kulturmiljön först.',set:{sol:0}},
      ]},
    {id:'inflyttning',title:'De som kommer',ev:['demography_e10','demography_e18','community_e1'],
      ctx:'Allt fler söker sig norrut från platser där klimatet blivit outhärdligt. Kalmar kan växa – om det finns plats i husen och i gemenskapen.',
      options:[
        {label:'Generationshus och kvarterskök',text:'Nya Kalmarbor välkomnas in i gemenskaperna.',set:{bogemenskap:3}},
        {label:'Bygg mer, snabbt',text:'Bostäder först, gemenskapen får komma sen.',set:{bogemenskap:1}},
        {label:'Stäng dörren',text:'Kalmar ska inte växa.',set:{bogemenskap:0,demokrati:1}},
      ]},
  ],
  2096:[
    {id:'arv',title:'Vad lämnar vi efter oss?',ev:['governance_e5','governance_e1'],
      ctx:'Haudenosaunee-folkets princip om den sjunde generationen: beslut ska ta hänsyn till dem som lever sju generationer framåt.',
      options:[
        {label:'Sju generationer i grundlagen',text:'Kommunens budget prövas mot år 2300.',set:{demokrati:3}},
        {label:'Ett nytt Kalmarsund',text:'Allt överskott till havet och slätten.',set:{hav:3,regionalt:3}},
        {label:'Vila på det som byggts',text:'Inga nya stora projekt.',set:{}},
      ]},
    {id:'aldst',title:'De äldsta',ev:['demography_e5','demography_e6','community_e14'],
      ctx:'Allt fler blir över hundra år. Vem tar hand om de äldsta när de flesta lever längre än någonsin?',
      options:[
        {label:'Omsorg i kvarteret',text:'Studenter bor gratis mot att de umgås med de äldre.',set:{bogemenskap:3,arbetstid:2}},
        {label:'Robotomsorg',text:'AI och robotar tar över det mesta av omsorgen.',set:{ai:3}},
        {label:'Familjen får ta ansvar',text:'Som förr.',set:{arbetstid:0}},
      ]},
    {id:'stad',title:'Den ätbara staden',ev:['food_e23','food_e41','food_e25'],
      ctx:'Stadsodlingens skördar är i nivå med eller bättre än konventionellt jordbruk. Vertikalodling under lampor kräver däremot mycket el.',
      options:[
        {label:'Matskog på varje gata',text:'Frukt, nötter och bär överallt.',set:{stadsodling:3}},
        {label:'Vertikala odlingshus',text:'Högteknologisk odling året runt.',set:{stadsodling:2,ai:2}},
        {label:'Parkerna får vara parker',text:'',set:{stadsodling:1}},
      ]},
  ],
  2106:[
    {id:'hundra',title:'Inför hundraårsjubileet',ev:['governance_e10','governance_e6'],
      ctx:'Inget land i världen tillgodoser i dag alla grundbehov inom planetens gränser. Kan Kalmar bli det första stället som gör det?',
      options:[
        {label:'Munken som kompass',text:'All politik mäts mot det trygga och rättvisa utrymmet.',set:{effektivitet:3,kost:3}},
        {label:'Mer av allt som fungerat',text:'Höj ambitionen ett steg överallt där staden orkar.',set:{sol:3,kollektivt:3,forebyggande:3}},
        {label:'Fira och vila',text:'Det har varit ett långt sekel.',set:{}},
      ]},
    {id:'turism',title:'Sommarstaden',ev:['base:gastnatter_kalmar_kommun','base:gastnatter_sommarandel_lan','base:oland_befolkning_juli_faktor','base:bilandel_turistresor_lan','base:oland_algblomning_turismforlust_2005','base:jrc_turismefterfragan_se21_sommar'],
      ctx:'Kalmar och Öland tar emot ett par miljoner gästnätter om året, nästan tre fjärdedelar av dem på sommaren, och nio av tio besökare kommer med bil. I ett varmare Europa blir Östersjökusten en sommartillflykt – men Öland har redan tre gånger så många människor i juli som på hösten, och vattnet räcker knappt.',
      options:[
        {label:'Långsam turism',text:'Tåg, buss och cykel till öarna och vatten som räcker även en torr juli.',set:{kollektivt:3,beredskap:3,forbindelser:3}},
        {label:'Ett rent sund först',text:'Badvatten och strandängar före fler bäddar.',set:{hav:3}},
        {label:'Fler bäddar och kryssningar',text:'Bygg ut för de nya sommargästerna.',set:{},note:'Fler besökare – och mer vatten, trafik och utsläpp att hantera.'},
      ]},
    {id:'skarmfri',title:'Barndomen',ev:['digital_resilience_e4','digital_resilience_e8'],
      ctx:'Barnen som föds nu blir vuxna år 2126. Hur ska deras barndom se ut?',
      options:[
        {label:'Skärmfri och vild',text:'Natur, lek och böcker.',set:{analog:3}},
        {label:'Balans',text:'Teknik som verktyg, inte sällskap.',set:{analog:2,ai:2}},
        {label:'Uppkopplad från början',text:'',set:{analog:0}},
      ]},
  ],
  2116:[
    {id:'sista',title:'Det sista decenniet',ev:['governance_e19','governance_e23'],
      ctx:'Snart har ett sekel gått. Vilket löfte ger Kalmar till dem som lever år 2226?',
      options:[
        {label:'En ny hundraårsplan',text:'Skriven av ett medborgarråd där varannan ledamot är under 25.',set:{demokrati:3}},
        {label:'Ett levande hav',text:'Kalmarsund ska ha god status för alltid.',set:{hav:3}},
        {label:'En stad för alla åldrar',text:'',set:{bogemenskap:3,forebyggande:3}},
      ]},
    {id:'energi',title:'Energiexporten',ev:['energy_e6','energy_e16'],
      ctx:'Sveriges elanvändning väntas mer än fördubblas. Kalmar kan bli en av landets kraftkällor.',
      options:[{label:'Bygg ut',text:'',set:{vind:3,sol:3}},{label:'Lagom',text:'',set:{vind:2}},{label:'Inget mer',text:'',set:{}}]},
    {id:'tid',title:'Arbetet',ev:['community_e22','tech_ai_e17'],
      ctx:'Hur mycket ska en människa behöva arbeta år 2126?',
      options:[{label:'30 timmar',text:'',set:{arbetstid:3}},{label:'35 timmar',text:'',set:{arbetstid:2}},{label:'40 timmar',text:'',set:{arbetstid:0}}]},
  ],
};

if(LANG==='en')for(const list of Object.values(DECISIONS))for(const c of list){c.title=L(c.title);c.ctx=L(c.ctx);for(const o of c.options){o.label=L(o.label);if(o.text)o.text=L(o.text);if(o.note)o.note=L(o.note);}}
// How the journey begins (the first page of Resan).
export const JOURNEY_INTRO={sv:'Kalmar kommun har 73 000 invånare och mål om att vara klimatneutral 2030. Men den längsta officiella planeringshorisonten sträcker sig till 2050 – ingen har skrivit ner hur vi vill leva här om hundra år. Det får du göra nu, tillsammans med släkten Ek på Kvarnholmen.',
  en:'Kalmar Municipality has 73,000 inhabitants and a goal of being climate-neutral by 2030. But its longest official planning horizon reaches 2050 – no one has written down how we want to live here in a hundred years. Now you get to, together with the Ek family on Kvarnholmen.'};

// The journey's closing lines: what Kalmar's century came to, in Kalmar's own measures (the framework shows
// them under "Ditt Kalmar 2126"). d: the year 2126, d0: 2026, I: the levers' implementation, today: today's
// course run to 2126.
import { t as tt } from '@engine/i18n.js';
import { INDICATORS } from '@engine/data/indicators.js';
import { PLACE } from '@engine/city-config.js';
export function JOURNEY_SUMMARY({d,d0,I,today}){
  const t=tt;const lines=[];
  lines.push(t(`${INDICATORS.foodRegional.fmt(d.ind.foodRegional)} av maten kommer från länet, och ${INDICATORS.cityVeg.fmt(d.ind.cityVeg)} av frukten och grönsakerna odlas i staden.`,`${INDICATORS.foodRegional.fmt(d.ind.foodRegional)} of the food comes from the county, and ${INDICATORS.cityVeg.fmt(d.ind.cityVeg)} of the fruit and vegetables are grown in the city.`,`Cibo prodotto in regione: ${INDICATORS.foodRegional.fmt(d.ind.foodRegional)}; frutta e verdura coltivate in città: ${INDICATORS.cityVeg.fmt(d.ind.cityVeg)}.`));
  lines.push(`${t(`Bilen används för ${INDICATORS.carShare.fmt(d.ind.carShare)} av resorna.`,`The car is used for ${INDICATORS.carShare.fmt(d.ind.carShare)} of trips.`,`Spostamenti in auto: ${INDICATORS.carShare.fmt(d.ind.carShare)}.`)} ${d.ind.depave>.4?t(`De flesta av ${PLACE.centreGenitive} gator är trädgårdar.`,`Most of ${PLACE.centre}'s streets are gardens.`,`La maggior parte delle strade ${PLACE.centreGenitive} sono giardini.`):t('Gatorna ser ut ungefär som 2026.','The streets look much as they did in 2026.','Le strade sono più o meno come nel 2026.')}`);
  lines.push(I.analog>.6?t('Barndomen är skärmfri till tolv år, och allt viktigt – betalningar, journaler, larm – fungerar också utan nät.','Childhood is screen-free until twelve, and everything important – payments, medical records, alarms – also works without the network.',"L'infanzia è senza schermi fino ai dodici anni, e tutto ciò che conta – pagamenti, cartelle cliniche, allarmi – funziona anche senza rete."):I.analog>.3?t('Skolan är mobilfri och kontanter finns kvar som reserv.','School is phone-free and cash remains as a backup.','La scuola è senza cellulari e i contanti restano come riserva.'):t('Nästan allt är digitalt, också reserven.','Almost everything is digital, the backups too.','Quasi tutto è digitale, anche le riserve.'));
  lines.push(I.ai>.6?(d.ind.aiGovernance>.6?t('AI används i vård, energi och odling – öppet granskad och i invånarnas ägo.','AI is used in care, energy and farming – openly scrutinised and owned by the residents.',"L'IA si usa nella sanità, nell'energia e in agricoltura – controllata apertamente e di proprietà dei residenti."):t('AI sköter mycket av vården och förvaltningen, men få vet hur besluten fattas.','AI runs much of healthcare and administration, but few know how decisions are made.',"L'IA gestisce gran parte della sanità e dell'amministrazione, ma pochi sanno come vengono prese le decisioni.")):t('AI används sparsamt.','AI is used sparingly.',"L'IA si usa con parsimonia."));
  {const lp=INDICATORS.lowParticipation.fmt(d.ind.lowParticipation),lp0=INDICATORS.lowParticipation.fmt(d0.ind.lowParticipation),co=INDICATORS.cohousing.fmt(d.ind.cohousing);lines.push(t(`${lp} har lågt socialt deltagande (2026: ${lp0}). ${co} bor i någon form av bogemenskap.`,`${lp} have low social participation (2026: ${lp0}). ${co} live in some form of co-housing.`,`Scarsa partecipazione sociale: ${lp} (2026: ${lp0}). Abitare collaborativo, in qualche forma: ${co}.`));}
  {const le=INDICATORS.lifeExp.fmt(d.ind.lifeExp),sr=INDICATORS.seaRise.fmt(d.ind.seaRise).replace('+',''),fr=d.ind.floodRisk;lines.push(t(`Medellivslängden är ${le} år. Havet har stigit ${sr} och översvämningsrisken ${PLACE.onCentre} är ${fr<.2?'låg':fr<.5?'måttlig':'hög'}.`,`Life expectancy is ${le} years. The sea has risen ${sr} and the flood risk ${PLACE.onCentre} is ${fr<.2?'low':fr<.5?'moderate':'high'}.`,`La speranza di vita è di ${le} anni. Il mare si è alzato di ${sr} e il rischio di allagamento ${PLACE.onCentre} è ${fr<.2?'basso':fr<.5?'moderato':'alto'}.`));}
  return lines;
}

// The decade's headline: Kalmar's travel and food after the index and people.
export function JOURNEY_HEADLINE(d){
  const car=INDICATORS.carShare.fmt(d.ind.carShare),food=INDICATORS.foodRegional.fmt(d.ind.foodRegional);
  return tt(`${car} av resorna med bil · ${food} av maten från länet`,`${car} of trips by car · ${food} of food from the county`,`${car} degli spostamenti in auto · ${food} del cibo prodotto in regione`);
}
