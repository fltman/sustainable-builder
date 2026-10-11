import { LANG, LOCALE, dec } from '@engine/i18n.js';
// Venice's indicators: the engine's (site/src/data/indicators.js) with Venice's names and notes, the record
// each 2026 value comes from (`base`, in research/baseline.json) and the measures only Venice has (model.js
// LOCAL). Swedish here; English in en/indicators.js, Italian in it/indicators.js.
const pct=v=>LANG==='sv'?`${Math.round(v*100)} %`:`${Math.round(v*100)}%`;
const num=(d=0)=>v=>v.toLocaleString(LOCALE,{maximumFractionDigits:d,minimumFractionDigits:d});
const metres=v=>`${dec(v,2)} m`;
export const INDICATORS={
  pop:{name:'Invånare i den historiska staden',base:'soc_pop_cs_2025',note:'47 625 vid utgången av 2025 – 174 808 år 1951. Döda är tre gånger fler än födda (689 mot 209 år 2025), och sju tiondelar av minskningen sedan 2015 kommer av det, inte av utflyttning. Fortsätter trenden bor 32 356 här år 2050.'},
  share65:{base:'soc_share_65plus_cs_2025',note:'33,1 % är 65 eller äldre och 12,2 % 80 eller äldre (2025), mot 24,7 % och 7,8 % i Italien. Bara 8,5 % är under 15.'},
  ghg:{name:'Utsläpp från stadens egen energi',base:'en_co2_per_inv_transporter',note:'Kommunens inventering inom borgmästaravtalet: 3,83 ton CO₂ per invånare 2016 (5,54 år 2005) – hem 1,38, service 1,68, transporter 0,68. Räknar man allt inom kommungränsen, med kolkraften i Fusina och industrin i Porto Marghera, blir det 16,7 ton. Klimatplanens mål är −72 % till 2030 mot 2005.'},
  ghgCons:{note:'Det finns inget eget mått för Venedig. Utgångsvärdet 7,5 ton per person är ett antagande för Italien.'},
  localEnergy:{note:'Solel ger 2,9 % av elen i hela kommunen (59 MW, 2024). I den historiska staden är solpaneler förbjudna på hus byggda före 1945, så nästan ingen el produceras här i dag (antagande).'},
  carShare:{name:'Resor med bil',note:'Den historiska staden har inga bilar: de som kommer till Piazzale Roma går vidare till fots (64,5 %) eller tar båten (33 %). Utgångsvärdet 2 % är ett antagande för resor som börjar med bil.'},
  greenShare:{name:'Grön mark i den historiska staden',note:'Parker, trädgårdar och klostergårdar är få – omkring 3 % i OpenStreetMap, och privata trädgårdar till. Utgångsvärdet 5 % är ett antagande.'},
  canopy:{note:'Hela kommunen har 28,2 inventerade träd per 100 invånare, men i den historiska staden står träden mest i Giardini och i gårdarna (antagande 4 %).'},
  waters:{name:'Lagunens hälsa',unit:'index, 1 = god status',base:'lag_wfd_ekologisk_status',note:'Inget av lagunens 11 klassade vattenområden har god ekologisk status, och inget av 14 god kemisk status (beslut juli 2026). Sedimentet försvinner ut i havet, 0,8 miljoner m³ om året.'},
  bloom:{name:'Algblomning i lagunen',unit:'index 0–1',fmt:num(2),better:-1,theme:'mat',assumption:true,note:'Lagunen hade svåra algblomningar på 1980-talet; i dag är de mindre. Ett varmare hav ökar risken (antagande).'},
  water:{note:'Index av marginalen ett torrår, en andra vattenkälla och somrar utan bevattningsförbud. Venedigs vatten kommer från 34 djupa brunnar på fastlandet; 41,7 % av vattnet försvinner i ledningarna (antagande om marginalen).'},
  level100:{name:'Hundraårshögvattnet vid Punta della Salute',unit:'m över ZMPS',fmt:metres,better:-1,theme:'resiliens',base:'mare_hogvatten_100ar_idag',
    note:'Omkring 2,10 m i dag (uppskattning). Rekordet är 1,94 m den 4 november 1966; den 12 november 2019 nådde vattnet 1,87 m. Markusplatsen svämmar över från 0,80 m och Rialto från 1,05 m.'},
  levelInside:{name:'Vattnet i staden vid ett 100-årshögvatten',unit:'m över ZMPS',fmt:metres,better:-1,theme:'resiliens',assumption:true,
    note:'Med MOSE uppe stannar vattnet i lagunen omkring 0,90 m även när havet utanför når 2 m (antagande). Utan barriären möter staden hela högvattnet.'},
  seaRise:{name:'Havet jämfört med 2026',fmt:v=>`+${dec(v,2)} m`,unit:'meter (havet och sättningen)',base:'mare_havsnivatrend_1993_2024',
    note:'Medelvattenståndet vid Punta della Salute var 0,353 m över ZMPS 2020–2025 och har stigit 4,8 mm om året sedan 1993. Mot 2126 omkring 1,21 m (SSP2-4.5) eller 1,52 m (SSP5-8.5) – uppskattningar ur de regionala framskrivningarna.'},
  floodRisk:{name:'Översvämningsrisk i den historiska staden',note:'Index för hur nära vattnet i staden kommer skyddet – i dag de lägsta gångvägarna vid 0,80 m.'},
  floodShare:{name:'Gångvägarna under vatten vid ett 100-årshögvatten',base:'mare_oversvammad_andel_110',note:'Andel av de offentliga gångvägarna under vatten, ur kommunens tabell (2020): 12 % vid 1,10 m, 59 % vid 1,40 m och 91 % vid 2,0 m. Med MOSE uppe är det nivån bakom barriären som räknas.'},
  heritage:{name:'Kulturarvet i den historiska staden',base:'lag_kulturminnesmarkta_byggnader',note:'Venedig och dess lagun är världsarv sedan 1987; 2 742 byggnader är kulturminnesförklarade, och 83 % av bostadshusen är byggda före 1919.'},
  trust:{note:'Tilliten till andra är låg i Italien (antagande 30 %). I kommunen säger 69,5 % att de har vänner att räkna med (2024).'},
  unsafe:{base:'soc_feel_safe_dark_comune',note:'Bara 50,4 % av kommunens invånare känner sig trygga när de går ensamma i mörker (ISTAT 2024).'},
  lifeExp:{base:'soc_life_expectancy_women_province',note:'86,4 år för kvinnor och 82,2 för män i provinsen (2025), mot 85,5 och 81,4 i Italien.'},
  cohousing:{note:'Generationshus och kollektivhus är nästan okända i Venedig (antagande 0,1 %).'},
  evShare:{note:'0,82 % av personbilarna i kommunen var elbilar 2024 (bilarna står på fastlandet och vid Piazzale Roma).'},
  boatElectric:{name:'Eldrivna båtar',note:'ACTV hade 148 båtar för passagerare och en enda hybridvaporetto (2025). Målet är att alla båtar på Canal Grande har hybridmotor 2032. Båtar och fartyg står för 47 % av kommunens kväveoxider.'},
  guestNights:{name:'Gästnätter i den historiska staden',base:'tur_presenze_cs_2025',note:'9,38 miljoner 2025 mot 8,82 miljoner 2019; 88,9 % utländska gäster, i snitt 2,36 nätter. Korttidsuthyrda bostäder tog 31,5 % av ankomsterna (19,4 % år 2019).'},
  tourismCO2:{name:'Besökarnas klimatpåverkan',note:'Antagande: 0,12 ton CO₂e per gästnatt med resan – de flesta kommer från andra länder och många flyger (Marco Polo hade 11,9 miljoner passagerare 2025).'},
  railMain:{name:'Tåget till Rom',unit:'timmar',better:-1,theme:'stad',base:'en_tag_restid_roma',
    fmt:v=>{const h=Math.floor(v+1/120),m=Math.round((v-h)*60/5)*5;return `${h} h ${String(m).padStart(2,'0')}`;},
    note:'Snabbaste tåget Venezia Santa Lucia–Roma Termini tar 3 h 56; till Milano 2 h 27. 273 tåg avgår om dagen.'},
  solarMW:{base:'en_solceller_effekt',note:'Kommunen har 59 MW solceller (2024), nästan alla på fastlandet: på hus i den historiska staden byggda före 1945 är solpaneler förbjudna. Utgångsvärdet 2 MW är ett antagande.'},
  windMW:{note:'Ingen vindkraft i dag. En park till havs utanför Lido är ett förslag i visionen, inte en plan.'},
  workHours:{note:'Antagande: 38 timmar i veckan, som avtalad arbetstid i Italien.'},
  // Venice's own measures (model.js LOCAL).
  moseClosures:{name:'MOSE-stängningar om året',unit:'stängningar',fmt:num(0),better:-1,theme:'resiliens',base:'com_mose_stangningar_sasong_2025_26',
    note:'49 stängningar säsongen 2025/26 (20 säsongen 2020/21). En studie från CNR ger ungefär en stängning om dygnet med 50 cm högre hav; då är lagunen nästan stängd, och vattenutbytet och sedimentet till saltängarna minskar. MOSE dimensionerades för 60 cm.'},
  saltMarsh:{name:'Saltängar i lagunen',unit:'km²',fmt:num(0),better:1,theme:'mat',base:'lag_barene_idag',
    note:'Omkring 40 km² i dag mot 158 km² år 1912; omkring 0,5 km² går förlorade om året. 15 km² byggdes upp igen med muddrat sediment 2002–2011.'},
  dayVisitors:{name:'Dagsbesökare en vanlig dag',unit:'besökare',fmt:v=>num(0)(Math.round(v/100)*100),better:-1,theme:'stad',base:'tur_dagsbesokare_per_dag_2022',
    note:'61 461 om dagen i snitt (2022, mobildata); den största dagen 143 246. En studie satte stadens bärkraft till 52 111 besökare om dagen. Inträdesavgiften gällde 60 dagar 2026.'},
  touristBeds:{name:'Turistbäddar i den historiska staden',unit:'bäddar',fmt:v=>num(0)(Math.round(v/100)*100),better:0,theme:'stad',base:'tur_baddar_cs',
    note:'70 241 i kommunens turiststatistik 2025 (med Murano och Burano), 1,29 per invånare; OCIO:s räknare anger 50 207 i september 2026. Bäddarna blev fler än invånarna 2023–2024.'},
  visitorsPerResident:{name:'Besökare per invånare en vanlig dag',unit:'besökare',fmt:num(1),better:-1,theme:'gemenskap',assumption:true,
    note:'Dagsbesökare och övernattande gäster en vanlig dag delat med invånarna: i dag omkring 1,8 – på toppdagar fyra. Ett modellmått.'},
  emptyHomes:{name:'Bostäder utan boende',unit:'av bostäderna',fmt:pct,better:-1,theme:'gemenskap',base:'soc_dwellings_unoccupied_cs_2023',
    note:'37,4 % av den historiska stadens 42 431 bostäder har ingen folkbokförd boende (2023) – inom modellens kvadrat 44,7 %. 6 145 är registrerade turistlägenheter; 2 251 hushåll står i kö till allmännyttan.'},
};
// The key-figure board, in reading order.
export const KEY_FIGURES=['pop','share65','emptyHomes','visitorsPerResident','dayVisitors','touristBeds','moseClosures','level100','floodShare','saltMarsh','waters','ghg','localEnergy','boatElectric','lifeExp','trust','heritage','guestNights','railMain'];
