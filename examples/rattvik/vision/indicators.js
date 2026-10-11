import { LANG } from '@engine/i18n.js';
// Rättvik's indicators: the engine's (site/src/data/indicators.js) with Rättvik's names and notes, the
// record each 2026 value comes from (`base`, in research/baseline.json) and the measures only Rättvik has.
const pct=v=>LANG==='en'?`${Math.round(v*100)}%`:`${Math.round(v*100)} %`;
const num=(d=0)=>v=>v.toLocaleString(LANG==='en'?'en-GB':'sv-SE',{maximumFractionDigits:d,minimumFractionDigits:d});
const metres=v=>`${LANG==='en'?v.toFixed(2):v.toFixed(2).replace('.',',')} m`;
export const INDICATORS={
  pop:{base:'befolkning_total',note:'Kommunens prognos (2024) ger 11 083 invånare 2030 och 11 580 år 2070 med dagens kurs. Dödsfallen är dubbelt så många som födslarna, så det är inflyttningen som avgör.'},
  share65:{base:'andel_65_plus',note:'34,6 % är 65 eller äldre (2025) mot 21,1 % i riket och 26,4 % i Dalarna, och 11,3 % är 80 eller äldre (riket 6,4 %). Kommunens prognos ger 36,5 % respektive 14,5 % år 2040.'},
  ghg:{base:'vaxthusgaser_per_inv',note:'17,5 ton per invånare 2024, varav 13,8 ton från industrin – framför allt kalkverket, där mycket av koldioxiden kommer ur kalkstenen själv och inte går att byta bort med ett annat bränsle.'},
  ghgCons:{base:'konsumtionsbaserade_utslapp_sverige',note:'Det finns inget eget mått för Rättvik. Utgångsvärdet är rikets 7,6 ton per person (antagande).'},
  foodRegional:{note:'Dalarna är 38 % självförsörjande räknat i vikt och 29 % i energi (Länsstyrelsen 2025). Hur stor del av maten i Rättvik som kommer från länet mäts inte; utgångsvärdet 15 % är ett antagande.'},
  localEnergy:{base:'lokal_elproduktion_andel_av_elanvandning',note:'104,7 GWh av 139,8 GWh 2024: vindkraften på Hedbodberget 82,5 GWh, vattenkraft 16,1 GWh och sol 6,0 GWh. Fritidshusen använder 11 % av elen.'},
  carShare:{base:'bilandel_resor_sverige',note:'Det finns ingen resvaneundersökning för Rättvik. I Sverige görs 53 % av resorna med bil; i en landsbygdskommun med 679 bilar per 1 000 invånare antas 65 %.'},
  greenShare:{name:'Grön mark i tätorten',note:'SCB: 68,8 % av tätorten är grönyta och 21,9 % hårdgjord. Modellens utgångsvärde 40 % gäller centrum kring stationen och Storgatan (antagande).'},
  canopy:{base:'tradbevuxen_mark_andel_tatort',note:'Trädbevuxen mark i tätorten enligt SCB (29,3 %), i brist på ett mått på krontäckning.'},
  waters:{name:'Siljans hälsa',unit:'index, 1 = god status',base:'siljan_ekologisk_status',note:'Siljan har måttlig ekologisk status i VISS, på grund av dammar och reglering – näringsämnena är bra. Inga algblomningar i 26 badvattenprov 2023–2026.'},
  bloom:{name:'Algblomning i Siljan',unit:'index 0–1',fmt:num(2),better:-1,theme:'mat',assumption:true,base:'siljansbadet_prov_algblomning',note:'Inga algblomningar i 26 badvattenprov vid Siljansbadet 2023–2026. Ett varmare klimat ökar risken.'},
  water:{note:'Index av marginalen ett torrår, en andra vattenkälla och somrar utan bevattningsförbud. Rättvik tar sitt vatten ur Gärdsjö grundvattentäkt (tillstånd för 4 500 m³ om dygnet, nya verk 2025); nästan 40 % har egen brunn. Marginalen ett torrår är inte publicerad (antagande).'},
  waterMargin:{note:'Antagande: 25 % till godo ett torrår i dag. Behovet växer med befolkningen och sommargästerna; ett varmare klimat tar en del av grundvattnet ett torrt år.'},
  level100:{name:'Siljans hundraårsnivå',unit:'m ö.h. (RH 2000)',fmt:v=>`${LANG==='en'?v.toFixed(2):v.toFixed(2).replace('.',',')} m`,better:-1,theme:'resiliens',base:'siljan_100arsniva_idag',
    note:'Omkring 163,7 m i dag (uppskattning ur MSB:s hundraårsflöde och regleringens avbördningstabell). De lägsta gatorna, Badhusgatan och Båthamnsvägen, ligger kring 164,0 m; högsta kända nivån var 165,4 m år 1860.'},
  seaRise:{name:'Siljans medelnivå jämfört med 2026',fmt:metres,note:'Siljan är reglerad: medelnivån står kvar. Det är högvattnet som stiger.'},
  floodRisk:{name:'Översvämningsrisk vid Siljan',base:'siljan_100arsniva_idag',note:'Index för hur nära Siljans hundraårsnivå kommer skyddsnivån – i dag de lägsta gatorna vid 164,0 m.'},
  floodShare:{name:'Centrum under vatten vid ett 100-årshögvatten',base:'camping_andel_under_100arsniva',note:'Andel av modellens mark som står under vatten om Siljan når hundraårsnivån och tar sig förbi skyddet, ur Lantmäteriets höjdmodell. I dag ligger 45 % av campingen och 8 byggnader under hundraårsnivån.'},
  heritage:{name:'Kulturarvet på Kyrkudden',base:'byggnadsminnen_antal',note:'Kyrkan, de 87 kyrkstallarna och Vasastenen är riksintresse för kulturmiljövården (W89). Kommunen har 12 byggnadsminnen och 18 riksintressen.'},
  lowParticipation:{base:'lagt_socialt_deltagande',note:'26,5 % (2014, före pandemin – 2024 års enkät mäter det inte). Ensamheten är lägre än i Dalarna och riket.'},
  trust:{base:'avsaknad_tillit',note:'Utgångsvärdet är 100 % minus de 26,8 % som saknar tillit till andra.'},
  childPoverty:{base:'barnfattigdom_andel'},
  cohousing:{note:'Det finns inget kollektivhus i Rättvik; det enda i Dalarna är Tersen i Falun med 44 lägenheter.'},
  evShare:{note:'3,7 % av bilarna i Rättvik var elbilar 2025. Modellen antar att EU:s utsläppskrav på nya bilar gör nästan hela bilparken eldriven kring 2050.'},
  guestNights:{name:'Gästnätter i Rättviks kommun',base:'gastnatter',note:'Kommersiella boenden: 226 773 år 2025 mot 281 099 år 2019. Två tredjedelar på sommaren och mer än hälften på camping; Classic Car Week ger omkring 35 000.'},
  tourismCO2:{name:'Besökarnas klimatpåverkan i Rättvik',note:'39 kg CO₂e per gästnatt, varav 54 % resan dit (Kalmars uppskattning; Chalmers: 76 kg för 100 mil med fossilbil, 3,7 kg per hotellnatt). 91,5 % av turistresorna till Dalarna görs med bil.'},
  railMain:{name:'Tåget till Stockholm',unit:'timmar',better:-1,theme:'stad',base:'restid_tag_stockholm_min',
    fmt:v=>{const h=Math.floor(v+1/120),m=Math.round((v-h)*60/5)*5;return `${h} h ${String(m).padStart(2,'0')}`;},
    note:'3 h 21 med de två direkttågen om dagen. Trafikverkets åtgärder på Dalabanan kortar Uppsala–Borlänge med 7 minuter till omkring 2031; regionens mål Mora–Stockholm under tre timmar saknar pengar.'},
  summerPeople:{name:'Människor i Rättvik en julidag',unit:'personer',fmt:v=>num(0)(Math.round(v/100)*100),better:0,theme:'gemenskap',base:'befolkning_juli_okning',
    note:'I juli finns 58 % fler i kommunen än i oktober–november (SCB:s mobildata 2022), de flesta i de 2 980 fritidshusen – 83 % ägda av folk från annat håll. På Classic Car Weeks lördag är det tre gånger så många som vanligt.'},
  windMW:{base:'vindkraft_installerad_effekt',note:'15 verk på Hedbodberget sedan 2009–2011, inga nya på 13 år. Broboberget/Lannaberget har tillstånd för upp till 115 verk men inget investeringsbeslut, och elnätet i Dalarna tar inte emot ny storskalig produktion förrän en ny stamnätsstation är byggd.'},
  solarMW:{base:'solceller_installerad_effekt'},
  workHours:{note:'Överenskommen arbetstid för 20–64-åringar i Sverige är 38,1 timmar i veckan (SCB, 2025).'},
};
// The key-figure board, in reading order.
export const KEY_FIGURES=['pop','share65','lifeExp','ghgCons','foodRegional','localEnergy','carShare','lowParticipation','trust','waters','waterMargin','level100','floodShare','homePrepared','analogResilience','workHours','cohousing','guestNights','summerPeople','railMain','heritage'];
