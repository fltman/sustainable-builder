import { INDICATORS } from '@engine/data/indicators.js';
import { LANG, L, t, dec } from '@engine/i18n.js';
import { BASE } from './model.js';

// What the AR layer explains, pinned to the places in Rättvik where it shows: each spot reads one model
// indicator for the year shown, counts up from 2026 and carries the century's curve so far.
// A spot at {0,0,0} is only placed on what is in view (main.js engine.arAnchors: beds and food parks → mat,
// street trees and food forests → trad, stalls and long tables → gemenskap, the timber blocks → bo, the
// growing tower → torn); the others also stand at a fixed place (places.js): model metres, x east and z
// south of the centre, y a few metres over the ground and any roof there (Lantmäteriet's heights in
// city.json; the 3D ground y = 0 is 163.38 m RH 2000, Siljan's surface y = -1.2).
const pc=v=>Math.round(v*100);
const fmtOf=k=>INDICATORS[k].fmt;
export const AR_SPOTS=[
  // Over the shops and flats along Storgatan (roofs up to 18 m).
  {id:'sol',at:{x:500,y:22,z:300},side:'auto',key:'solarMW',kicker:'Energi',title:'Solel på ortens tak',unit:'MW',
    note:d=>d.localEnergy>1?t(`Rättvik producerar ${dec(d.localEnergy)} gånger sitt eget elbehov, mest med vindkraft i skogarna i norr.`,`Rättvik produces ${dec(d.localEnergy)} times its own electricity demand, mostly from wind power in the northern forests.`)
      :t(`${pc(d.localEnergy)} % av elen produceras i kommunen, mest av vindkraften på Hedbodberget.`,`${pc(d.localEnergy)}% of the electricity is produced in the municipality, most of it by the wind farm on Hedbodberget.`)},
  // Torget, between the station and Storgatan.
  {id:'mat',at:{x:405,y:6,z:71},side:'auto',key:'foodRegional',kicker:'Mat',title:'Maten som kommer från länet',unit:'',
    note:d=>d.foodRegional>.4?t(`Fäbodar, mejerier och kvarnar föder bygden, och orten odlar själv ${pc(d.cityVeg)} % av sin frukt och sina grönsaker.`,`Summer farms, dairies and mills feed the countryside, and the town grows ${pc(d.cityVeg)}% of its own fruit and vegetables.`)
      :t(`Orten odlar själv ${pc(d.cityVeg)} % av sin frukt och sina grönsaker.`,`The town grows ${pc(d.cityVeg)}% of its own fruit and vegetables.`)},
  // Riksvägen, road 70, where it passes the start of Storgatan.
  {id:'bil',at:{x:412,y:5,z:215},side:'auto',key:'carShare',kicker:'Gatorna',title:'Resor som görs med bil',unit:'',
    note:d=>d.depave>.4?t('Gatorna har blivit trädgårdar, regnbäddar och gångstråk.','The streets have become gardens, rain gardens and footpaths.'):t('Gatorna och riksvägen är fortfarande till för bilar.','The streets and the main road are still for cars.')},
  // Out on Rättviken.
  {id:'siljan',at:{x:-300,y:.5,z:0},side:'auto',key:'waters',kicker:'Siljan',title:'Siljans hälsa (1 = god status)',unit:'',
    note:d=>d.bloom>.3?t('Algblomning syns nu de varmaste somrarna.','Algal blooms now appear in the warmest summers.')
      :d.waters>.65?t('Klart vatten, återställda stränder och fria vandringsvägar för harr och öring.','Clear water, restored shores and free passage for grayling and trout.')
      :t('Klart och näringsfattigt, men dammar och reglering håller tillbaka livet i sjön.','Clear and low in nutrients, but dams and regulation hold back the life in the lake.')},
  // The outer end of Långbryggan, where the boats come in.
  {id:'batar',at:{x:-300,y:2.5,z:515},side:'auto',key:'boatElectric',kicker:'Sjötrafik',title:'Båttrafik som går på el',unit:'',
    note:d=>d.boatElectric>.6?t('Tysta båtbussar från Långbryggan till Leksand, Mora och Siljansnäs, laddade med bygdens egen el.','Quiet boat buses from Långbryggan to Leksand, Mora and Siljansnäs, charged with the area’s own electricity.'):t('Mest dieselbåtar fortfarande.','Mostly diesel boats still.')},
  // The campsite at Siljansbadet, the lowest built ground (about 163.8 m).
  {id:'niva',at:{x:-70,y:3,z:-223},side:'auto',key:'level100',kicker:'Högvatten',title:'Siljans hundraårsnivå',unit:'',
    note:d=>{const risk=d.floodRisk<.2?['låg','low']:d.floodRisk<.5?['måttlig','moderate']:['hög','high'];
      return d.protection>164.05?t(`Skyddet når ${dec(d.protection,1)} m, och de lägsta gatorna ligger på 164,0 m. Översvämningsrisk: ${risk[0]}.`,`The protection reaches ${dec(d.protection,1)} m, and the lowest streets lie at 164.0 m. Flood risk: ${risk[1]}.`)
        :t(`De lägsta gatorna ligger på 164,0 m och campingen delvis under hundraårsnivån. Översvämningsrisk: ${risk[0]}.`,`The lowest streets lie at 164.0 m and the campsite partly below the 100-year level. Flood risk: ${risk[1]}.`);}},
  // Lokstallarna's yard (and the stalls and tables wherever they are in view).
  {id:'gemenskap',at:{x:30,y:5,z:-235},side:'auto',key:'lowParticipation',kicker:'Gemenskap',title:'Har lågt socialt deltagande',unit:'',
    note:d=>t(`${pc(d.cohousing)} % bor i bogemenskap. Arbetsveckan är ${Math.round(d.workHours)} timmar.`,`${pc(d.cohousing)}% live in co-housing. The working week is ${Math.round(d.workHours)} hours.`)},
  {id:'trad',at:{x:0,y:0,z:0},side:'auto',key:'canopy',kicker:'Grönska',title:'Trädkronor i tätorten',unit:'',
    note:d=>t(`Tallar, björkar och fruktträd svalkar orten och tar hand om skyfall. ${pc(d.greenShare)} % av centrum är grön mark.`,`Pines, birches and fruit trees cool the town and soak up cloudbursts. ${pc(d.greenShare)}% of the centre is green ground.`)},
  {id:'torn',at:{x:0,y:0,z:0},side:'auto',key:'cityVeg',kicker:'Odlingstornet',title:'Frukt och grönt odlat i orten',unit:'',
    note:d=>t(`Sexton våningar odling året runt vid stationen. ${pc(d.foodRegional)} % av maten kommer från länet.`,`Sixteen floors growing food all year round by the station. ${pc(d.foodRegional)}% of the food comes from the county.`)},
  // The wind farms stand 35–50 km to the north-east, beyond the model: the spot hangs over its
  // north-eastern corner, above the trees, pointing the way.
  {id:'vind',at:{x:820,y:35,z:-820},side:'auto',key:'windMW',kicker:'Vindkraft',title:'Vindkraft i skogarna',unit:'MW',
    note:d=>d.windMW>60?t('Nya vindparker i skogarna 3,5–5 mil nordost om Rättvik, delägda av invånarna.','New wind farms in the forests 35–50 km north-east of Rättvik, co-owned by the residents.')
      :t('Femton verk på Hedbodberget, 3,5 mil nordost om Rättvik, sedan 2009–2011.','Fifteen turbines on Hedbodberget, 35 km north-east of Rättvik, since 2009–2011.')},
  // Församlingshemmet – Generationshuset (and the timber blocks wherever they are in view).
  {id:'bo',at:{x:514,y:22,z:20},side:'auto',key:'pop',kicker:'Boende',title:'Invånare i Rättviks kommun',unit:'',
    note:d=>t(`${pc(d.share80)} % är över 80 år, och ${pc(d.cohousing)} % bor i bogemenskap.`,`${pc(d.share80)}% are over 80, and ${pc(d.cohousing)}% live in co-housing.`)},
  // Vårdcentralen – Hälsotorget.
  {id:'liv',at:{x:318,y:10,z:-295},side:'auto',key:'lifeExp',kicker:'Hälsa',title:'Medellivslängd',unit:'år',
    note:d=>t(`${pc(d.activity)} % rör sig tillräckligt i vardagen.`,`${pc(d.activity)}% get enough everyday exercise.`)},
  // Over the station building.
  {id:'tag',at:{x:329,y:19,z:118},side:'auto',key:'railMain',kicker:'Tåget',title:'Tåget till Stockholm',unit:'',
    note:d=>d.railMain<3?t('Under tre timmar till Stockholm, med fler direkttåg.','Under three hours to Stockholm, with more direct trains.')
      :t('Dalabanan är enkelspårig norr om Borlänge, och få tåg går direkt till Stockholm.','The Dalabanan line is single-track north of Borlänge, and few trains run direct to Stockholm.')},
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
    note:d=>t(`${pc(1-d.pop/d.summerPeople)} % av dem är sommarboende och besökare. Gästnätter: ${fmtOf('guestNights')(d.guestNights)} om året (2026: ${fmtOf('guestNights')(BASE.guestNights)}).`,`${pc(1-d.pop/d.summerPeople)}% of them are summer residents and visitors. Guest nights: ${fmtOf('guestNights')(d.guestNights)} a year (2026: ${fmtOf('guestNights')(BASE.guestNights)}).`)},
];
if(LANG==='en')for(const sp of AR_SPOTS){sp.kicker=L(sp.kicker);sp.title=L(sp.title);sp.unit=L(sp.unit);}
export function arSpec(spot,run,year){
  const i=Math.max(0,Math.min(run.years.length-1,Math.floor(year)-2026)),d=run.years[i].ind,d0=run.years[0].ind,meta=INDICATORS[spot.key];
  const series=run.years.slice(0,i+1).filter((_,k)=>k%3===0||k===i).map(y=>y.ind[spot.key]);
  const fmt=meta.fmt;
  return {...spot,value:d[spot.key],from:d0[spot.key],fmt,fromText:i?`2026: ${fmt(d0[spot.key])}`:'',spark:series.length>2?series:null,note:spot.note(d)};
}
