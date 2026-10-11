import { INDICATORS } from '@engine/data/indicators.js';
import { LANG, L, t, dec, int } from '@engine/i18n.js';
import { BASE } from './model.js';

// What the AR layer explains, pinned to the places in Rättvik where it shows: each spot reads one of Rättvik's
// own measures (indicators.js, from model.js) for the year shown, counts up from 2026 and carries the
// century's curve so far; its note says what lies behind the figure, in the model's numbers.
// A spot at {0,0,0} is only placed on what is in view (main.js engine.arAnchors: beds and food parks → mat,
// street trees and fruit trees → trad, stalls and long tables → gemenskap, the timber blocks → bo); the others
// also stand at a fixed place (places.js): model metres, x east and z south of the centre, y a few metres over
// the ground and any roof there (Lantmäteriet's heights in city.json; the 3D ground y = 0 is 163.38 m
// RH 2000, Siljan's surface y = -1.2). Rättvik has no growing tower, flood wall or wind turbines in view: the
// wind farms and the lime works lie beyond the model, so their spots hang over its edge, pointing the way.
const pc=v=>Math.round(v*100);
const fmtOf=k=>INDICATORS[k].fmt;
const WORDS={sv:['inga','en','två','tre','fyra','fem','sex'],en:['no','one','two','three','four','five','six']};
const word=n=>t(WORDS.sv[n]??String(n),WORDS.en[n]??String(n));
// Who lives in generation houses or other co-housing (none in Rättvik today).
const cohousing=d=>pc(d.cohousing)<1?t('Nästan ingen bor i generationshus eller bogemenskap','Almost no one lives in a generation house or co-housing')
  :t(`${pc(d.cohousing)} % bor i generationshus eller bogemenskap`,`${pc(d.cohousing)}% live in generation houses or co-housing`);
export const AR_SPOTS=[
  // Over the shops and flats along Storgatan (roofs up to 18 m).
  {id:'sol',at:{x:500,y:22,z:300},side:'auto',key:'solarMW',kicker:'Energi',title:'Solel på ortens tak',unit:'MW',
    note:d=>{const wind=d.windMW<31?t('vindkraften på Hedbodberget','the wind farm on Hedbodberget'):t('vindkraften i skogarna i norr','wind power in the northern forests');
      return (d.localEnergy>1.5?t(`Rättvik gör ${dec(d.localEnergy)} gånger så mycket el som det använder, mest med ${wind}.`,`Rättvik makes ${dec(d.localEnergy)} times as much electricity as it uses, mostly from ${wind}.`)
        :d.localEnergy>1.02?t(`Rättvik gör mer el än det använder, mest med ${wind}.`,`Rättvik makes more electricity than it uses, mostly from ${wind}.`)
        :t(`${pc(d.localEnergy)} % av elen görs i kommunen, mest av ${wind}.`,`${pc(d.localEnergy)}% of the electricity is made in the municipality, most of it by ${wind}.`))
        +t(` ${pc(d.localOwned)} % av den ägs av bygden.`,` ${pc(d.localOwned)}% of it is owned locally.`);}},
  // Torget, between the station and Storgatan.
  {id:'mat',at:{x:405,y:6,z:71},side:'auto',key:'foodRegional',kicker:'Mat',title:'Maten som kommer från länet',unit:'',
    note:d=>t(`Fäbodarnas skogsbete omfattar ${int(d.fabodHa)} hektar (2026: ${int(BASE.fabodHa)})${d.foodRegional>.4?', och mejerier och kvarnar förädlar bygdens mat':''}.`,
      `The summer farms’ forest grazing covers ${int(d.fabodHa)} hectares (2026: ${int(BASE.fabodHa)})${d.foodRegional>.4?', and dairies and mills process the area’s food':''}.`)},
  // Riksvägen, road 70, where it passes the start of Storgatan.
  {id:'bil',at:{x:412,y:5,z:215},side:'auto',key:'carShare',kicker:'Gatorna',title:'Resor som görs med bil',unit:'',
    note:d=>(d.depave>.4?t('Gatorna kring torget och Storgatan har blivit trädgårdar, regnbäddar och gångstråk. ','The streets round the square and Storgatan have become gardens, rain gardens and footpaths. ')
      :t('Gatorna och riksvägen är fortfarande till för bilarna. ','The streets and the main road are still for cars. '))
      +t(`Det finns ${Math.round(d.carsPer1000)} bilar per 1 000 invånare.`,`There are ${Math.round(d.carsPer1000)} cars per 1,000 residents.`)},
  // Out on Rättviken.
  {id:'siljan',at:{x:-300,y:.5,z:0},side:'auto',key:'waters',kicker:'Siljan',title:'Siljans hälsa (1 = god status)',unit:'',
    note:d=>(d.waters>.65?(d.stress>.5?t('Näringsfattigt vatten utan algblomning, något brunare efter de kraftigare regnen, och stränder och åmynningar har restaurerats. ','Water low in nutrients and free of algal blooms, a little browner after the heavier rains, and the shores and river mouths have been restored. ')
        :t('Klart vatten utan algblomning, och stränder och åmynningar har restaurerats. ','Clear water without algal blooms, and the shores and river mouths have been restored. '))
      :t('Klart och näringsfattigt, men dammar och reglering håller tillbaka livet i sjön. ','Clear and low in nutrients, but dams and regulation hold back the life in the lake. '))
      +t(`Öringen når ${pc(d.troutAccess)} % av sina forna lekplatser.`,`The trout can reach ${pc(d.troutAccess)}% of its former spawning grounds.`)},
  // The outer end of Långbryggan, where the boat buses come in (model.js boatVillages: the summer lines).
  {id:'batar',at:{x:-300,y:2.5,z:515},side:'auto',key:'boatVillages',kicker:'Sjötrafik',title:'Byar med sommarbåt från Rättvik',unit:'',
    note:d=>{const n=Math.round(d.boatVillages);
      return (n>=1?t(`Om somrarna går tysta båtbussar på el härifrån till ${word(n)} ${n===1?'by':'byar'} runt Siljan, med besökare och sommarboende.`,`In summer quiet electric boat buses run from here to ${word(n)} ${n===1?'village':'villages'} round Lake Siljan, with visitors and summer residents.`)
        :t('Inga båtlinjer går mellan byarna – ångbåtarna slutade gå när järnvägen kom.','No boat lines run between the villages – the steamboats stopped when the railway came.'))
        +t(` ${pc(d.boatElectric)} % av båttrafiken på Siljan går på el.`,` ${pc(d.boatElectric)}% of boat traffic on Lake Siljan is electric.`);}},
  // The campsite at Siljansbadet, the lowest built ground (about 163.8 m).
  {id:'niva',at:{x:-70,y:3,z:-223},side:'auto',key:'level100',kicker:'Högvatten',title:'Siljans hundraårsnivå',unit:'',
    note:d=>{const risk=d.floodRisk<.2?['låg','low']:d.floodRisk<.5?['måttlig','moderate']:['hög','high'];
      return d.protection>164.05?t(`Höjda strandstråk och plats för vattnet skyddar gatorna upp till ${dec(d.protection,1)} m; de lägsta ligger på 164,0 m. Översvämningsrisk: ${risk[0]}.`,`Raised shore paths and room for the water protect the streets up to ${dec(d.protection,1)} m; the lowest lie at 164.0 m. Flood risk: ${risk[1]}.`)
        :t(`De lägsta gatorna ligger på 164,0 m och campingen delvis under hundraårsnivån. Översvämningsrisk: ${risk[0]}.`,`The lowest streets lie at 164.0 m and the campsite partly below the 100-year level. Flood risk: ${risk[1]}.`);}},
  // Lokstallarna's yard (and the stalls and tables wherever they are in view).
  {id:'gemenskap',at:{x:30,y:5,z:-235},side:'auto',key:'lowParticipation',kicker:'Gemenskap',title:'Har lågt socialt deltagande',unit:'',
    note:d=>t(`${cohousing(d)}, och ${pc(d.elderLonely)} % av de äldre med hemtjänst besväras av ensamhet.`,`${cohousing(d)}, and ${pc(d.elderLonely)}% of the elderly with home care are troubled by loneliness.`)},
  {id:'trad',at:{x:0,y:0,z:0},side:'auto',key:'canopy',kicker:'Grönska',title:'Trädkronor i tätorten',unit:'',
    note:d=>t(`Tallar, björkar och fruktträd svalkar orten och tar hand om skyfall. ${pc(d.greenShare)} % av centrum är grön mark.`,`Pines, birches and fruit trees cool the town and soak up cloudbursts. ${pc(d.greenShare)}% of the centre is green ground.`)},
  // The wind farms stand 35–50 km to the north-east, beyond the model: the spot hangs over its north-eastern
  // corner, above the trees, pointing the way. Who owns them is the model's (localOwned): the new parks are
  // mostly owned from elsewhere unless the villages co-own them (the vind lever from its second level).
  {id:'vind',at:{x:820,y:35,z:-820},side:'auto',key:'windMW',kicker:'Vindkraft',title:'Vindkraft i skogarna',unit:'MW',
    note:d=>(d.windMW<31?t('Femton verk på Hedbodberget, 3,5 mil nordost om Rättvik, sedan 2009–2011; två av dem ägs av kommunen och invånarna.','Fifteen turbines on Hedbodberget, 35 km north-east of Rättvik, since 2009–2011; two of them are owned by the municipality and its residents.')
      :d.localOwned<.2?t('Nya vindparker i skogarna 3,5–5 mil nordost om Rättvik, de flesta ägda av bolag utifrån.','New wind farms in the forests 35–50 km north-east of Rättvik, most of them owned by companies from elsewhere.')
      :d.localOwned>=.3?t('Nya vindparker i skogarna 3,5–5 mil nordost om Rättvik, delvis ägda av byarna och kommunen.','New wind farms in the forests 35–50 km north-east of Rättvik, partly owned by the villages and the municipality.')
      :t('Nya vindparker i skogarna 3,5–5 mil nordost om Rättvik.','New wind farms in the forests 35–50 km north-east of Rättvik.'))
      +t(` ${pc(d.localOwned)} % av elen som görs i kommunen ägs av bygden.`,` ${pc(d.localOwned)}% of the electricity made in the municipality is owned locally.`)},
  // SMA Mineral's lime works at Gärdebyn (60.905 N, 15.167 E: Naturvårdsverket's register), about 4 km to the
  // east-north-east, beyond the model: the spot hangs over its eastern edge in that direction. Its carbon
  // dioxide comes out of the limestone itself and can only be captured (model.js capture).
  {id:'kalk',at:{x:850,y:30,z:-590},side:'auto',key:'capture',kicker:'Kalkverket',title:'Kalkverkets koldioxid som fångas in',unit:'',
    note:d=>d.capture>.05?t(`Kalkverket i Gärdebyn, 4 km bort, fångar in sin koldioxid: industrin släpper nu ut ${dec(d.ghgIndustry,1)} ton per invånare (2026: ${dec(BASE.ghg.industry,1)}).`,`The lime works at Gärdebyn, 4 km away, captures its carbon dioxide: industry now emits ${dec(d.ghgIndustry,1)} tonnes per resident (2026: ${dec(BASE.ghg.industry,1)}).`)
      :t(`Kalkverket i Gärdebyn, 4 km bort, släppte ut ${int(119818)} ton fossil koldioxid 2024 – den kommer ur kalkstenen själv och kan bara fångas in.`,`The lime works at Gärdebyn, 4 km away, emitted ${int(119818)} tonnes of fossil carbon dioxide in 2024 – it comes from the limestone itself and can only be captured.`)},
  // Församlingshemmet – Generationshuset (and the timber blocks wherever they are in view).
  {id:'bo',at:{x:514,y:22,z:20},side:'auto',key:'pop',kicker:'Boende',title:'Invånare i Rättviks kommun',unit:'',
    note:d=>t(`${pc(d.share80)} % är 80 år eller äldre, ${cohousing(d).replace(/^N/,'n')}, och ${pc(d.youthLeave)} % av de unga tror att de kommer att flytta härifrån.`,
      `${pc(d.share80)}% are 80 or older, ${cohousing(d).replace(/^A/,'a')}, and ${pc(d.youthLeave)}% of young people think they will move away.`)},
  // Vårdcentralen – Hälsotorget.
  {id:'liv',at:{x:318,y:10,z:-295},side:'auto',key:'lifeExp',kicker:'Hälsa',title:'Medellivslängd',unit:'år',
    note:d=>t(`${pc(d.activity)} % rör sig tillräckligt i vardagen.`,`${pc(d.activity)}% get enough everyday exercise.`)},
  // Over the station building.
  {id:'tag',at:{x:329,y:19,z:118},side:'auto',key:'railMain',kicker:'Tåget',title:'Tåget till Stockholm',unit:'',
    note:d=>d.railMain<3?t('Mötesspår och snabbare tåg: under tre timmar till Stockholm.','Passing loops and faster trains: under three hours to Stockholm.')
      :t('Dalabanan är enkelspårig, och bara två tåg om dagen går direkt till Stockholm.','The Dalabanan line is single-track, and only two trains a day run direct to Stockholm.')},
  // Kulturhuset – Det analoga huset.
  {id:'analog',at:{x:630,y:18,z:461},side:'auto',key:'analogResilience',kicker:'Det analoga huset',title:'Analog reserv',unit:'',
    note:d=>(d.analogResilience>.45?t('Böcker, papperskopior av allt viktigt, radio och verkstäder – bygdens reserv när näten går ner. ','Books, paper copies of everything important, radio and workshops – the area’s backup when the networks go down. ')
      :t('Det mesta finns bara digitalt. ','Most things exist only digitally. '))
      +t(`${pc(d.youthScreen)} % av de unga har mer än tre timmars skärmtid om dagen.`,`${pc(d.youthScreen)}% of young people spend more than three hours a day on screens.`)},
  // Kyrkudden's church stables, by the shore.
  {id:'kulturarv',at:{x:-782,y:6,z:-610},side:'auto',key:'heritage',kicker:'Kyrkudden',title:'Kulturarvet på Kyrkudden (1 = intakt)',unit:'',
    note:d=>d.heritage>.985?t('Kyrkan, de 87 kyrkstallarna – det äldsta från 1492 – och Vasastenen står som de stått i århundraden.','The church, the 87 church stables – the oldest from 1492 – and Vasastenen stand as they have for centuries.')
      :d.heritage>.95?t('Skydden mot högvattnet har tagit något av den öppna stranden vid kyrkstallarna.','The defences against high water have taken something of the open shore by the church stables.')
      :t('Siljans högvatten har skadat kyrkstallarna närmast stranden.','Lake Siljan’s high water has damaged the church stables nearest the shore.')},
  // The beach by Långbryggan's landward end.
  {id:'sommar',at:{x:150,y:3,z:150},side:'auto',key:'summerPeople',kicker:'Sommarstaden',title:'Människor i Rättvik en julidag',unit:'',
    note:d=>t(`${pc(1-d.pop/d.summerPeople)} % av dem är sommarboende och besökare. ${pc(d.summerShare)} % av årets ${fmtOf('guestNights')(d.guestNights)} gästnätter är i juni–augusti (2026: ${pc(BASE.summerShare)} % av ${fmtOf('guestNights')(BASE.guestNights)}).`,
      `${pc(1-d.pop/d.summerPeople)}% of them are summer residents and visitors. ${pc(d.summerShare)}% of the year’s ${fmtOf('guestNights')(d.guestNights)} guest nights fall in June–August (2026: ${pc(BASE.summerShare)}% of ${fmtOf('guestNights')(BASE.guestNights)}).`)},
];
if(LANG==='en')for(const sp of AR_SPOTS){sp.kicker=L(sp.kicker);sp.title=L(sp.title);sp.unit=L(sp.unit);}
export function arSpec(spot,run,year){
  const i=Math.max(0,Math.min(run.years.length-1,Math.floor(year)-2026)),d=run.years[i].ind,d0=run.years[0].ind,meta=INDICATORS[spot.key];
  const series=run.years.slice(0,i+1).filter((_,k)=>k%3===0||k===i).map(y=>y.ind[spot.key]);
  const fmt=meta.fmt;
  return {...spot,value:d[spot.key],from:d0[spot.key],fmt,fromText:i?`2026: ${fmt(d0[spot.key])}`:'',spark:series.length>2?series:null,note:spot.note(d)};
}
