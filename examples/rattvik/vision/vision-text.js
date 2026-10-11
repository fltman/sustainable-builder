// "Visionen": Rättvik in a given year written out as a short vision document from Rättvik's own model
// (model.js): its levers (levers.js) and its measures (indicators.js). Every sentence is conditioned on the
// model's numbers and on how far each lever has come (I, 0–1), so the text describes the plan that was made –
// including what it did not do – and each figure carries its 2026 value. What a lever brings follows its
// levels in levers.js; today's facts come from the research (research/baseline.json, research/story.json,
// research/deep/*-notes.md). Swedish and English inline with t().
import { t, dec, int, pct } from '@engine/i18n.js';
import { PARAMS } from '@city/model.js';
// Hours as "3 h 21", to the minute (the fastest direct train to Stockholm takes 201 minutes today).
const railText=v=>{const m=Math.round(v*60);return `${Math.floor(m/60)} h ${String(m%60).padStart(2,'0')}`;};
const near=(v,step)=>Math.round(v/step)*step;
// Shares with one decimal (protected nature: 1.8 % today).
const pct1=v=>t(`${dec(v*100,1)} %`,`${dec(v*100,1)}%`);
// Small counts in words (the villages with a summer boat: up to six).
const WORDS={sv:['inga','en','två','tre','fyra','fem','sex'],en:['no','one','two','three','four','five','six']};
const word=n=>t(WORDS.sv[n]??String(n),WORDS.en[n]??String(n));
// A list in words: "a, b och c".
const list=a=>a.length>1?a.slice(0,-1).join(', ')+t(' och ',' and ')+a.at(-1):a[0]||'';
// How far a lever must be implemented (0–1) before the text shows its first, second and third level.
const L1=.12,L2=.45,L3=.8;

export function visionSections(run,year){
  const r=run.years[year-2026],d=r.ind,I=r.I,v=r.vision||{},d0=run.years[0].ind;
  const lvl=id=>I[id]||0;
  // 2026 is the starting point; from 2027 a figure carries its 2026 value.
  const now=year<=2026,was=x=>now?'':` (2026: ${x})`;
  // Metres or centimetres, for heights above the 100-year level.
  const len=m=>m>=1?`${dec(m,1)} m`:`${Math.max(1,Math.round(m*100))} cm`;
  // Hectares: as measured in 2026 (608 ha of forest grazing, 229 ha of grain), to the nearest five later.
  const ha=(x,exact)=>int(exact?Math.round(x):near(x,5));
  const S=[];

  // Food: the fäbodar's forest grazing, the farms, the grain and the kitchens (research/deep/natur-mat-stad,
  // story.json) – the regionalt lever and Rättvik's food measures.
  const reg=lvl('regionalt');
  const farmed=d.regen>=.97?t('Nästan all åkermark','Almost all the farmland'):t(`${pct(d.regen)} av åkermarken`,`${pct(d.regen)} of the farmland`);
  const grazing=t(`skogsbetet omfattar ${ha(d.fabodHa)} hektar (2026: ${ha(d0.fabodHa,true)})`,`the forest grazing covers ${ha(d.fabodHa)} hectares (2026: ${ha(d0.fabodHa,true)})`);
  S.push({title:t('Maten och fäbodarna','Food and the summer farms'),text:[
    t(`${now?'Uppskattningsvis ':''}${pct(d.foodRegional)} av maten som Rättviksborna äter kommer från länet${was(pct(d0.foodRegional))}.`,
      `${now?'An estimated ':''}${pct(d.foodRegional)} of the food people in Rättvik eat comes from the county${was(pct(d0.foodRegional))}.`),
    now?t(`Fäbodbruket står sedan 2024 på Unescos lista över mänsklighetens immateriella kulturarv, men mjölkkorna har halverats sedan 1981 och finns kvar på fem gårdar; fäbodarnas skogsbete omfattar ${ha(d.fabodHa,true)} hektar.`,
        `Summer farming has been on UNESCO’s list of the intangible cultural heritage of humanity since 2024, but the dairy cows have halved since 1981 and remain on five farms; the summer farms’ forest grazing covers ${ha(d.fabodHa,true)} hectares.`)
    :reg>L2?t(`Fäbodarna lever: unga brukare har tagit över, om somrarna betar korna och getterna i skogen, och fäbodarnas smör, ost och messmör säljs på torget – ${grazing}.`,
        `The summer farms are alive: young farmers have taken over, in summer the cows and goats graze in the forest, and the farms’ butter, cheese and whey butter are sold in the square – ${grazing}.`)
    :reg>L1?t(`Skolor och äldreboenden lagar säsongens mat från bygdens gårdar och skoljordbruket, men fäbodarna hålls levande av ett fåtal brukare – ${grazing}.`,
        `Schools and care homes cook the season’s food from local farms and the school farm, but the summer farms are kept alive by only a few farmers – ${grazing}.`)
    :d.fabodHa<d0.fabodHa*.95?t(`Fäbodbetet krymper när korna och brukarna blir färre – ${grazing}.`,`The summer-farm grazing shrinks as the cows and the farmers grow fewer – ${grazing}.`)
    :t(`Fäbodbruket är ett kulturarv som få kan leva av – ${grazing}.`,`Summer farming is a heritage few can make a living from – ${grazing}.`),
    reg>L2?t(`${farmed} brukas ekologiskt${was(pct(d0.regen))}, och mejerier och kvarnar förädlar maten i bygden: mindre men bättre kött, från betet och älgjakten.`,
      `${farmed} is farmed organically${was(pct(d0.regen))}, and dairies and mills process the food locally: less but better meat, from grazing and the elk hunt.`):'',
    reg>L3?t(`Spannmål växer på åkrarna igen – ${ha(d.grainHa)} hektar (2026: ${ha(d0.grainHa,true)}) – och ett matråd planerar för att bygden ska kunna föda sig själv.`,
      `Grain grows on the fields again – ${ha(d.grainHa)} hectares (2026: ${ha(d0.grainHa,true)}) – and a food council plans for the area to be able to feed itself.`)
    :now?t(`Spannmål odlas på ${ha(d.grainHa,true)} hektar, mot minst ${int(941)} hektar 1981; fyra femtedelar av åkermarken är vall till djuren.`,
      `Grain is grown on ${ha(d.grainHa,true)} hectares, against at least ${int(941)} hectares in 1981; four fifths of the farmland is grass for the animals.`):'',
    now?t('Kommunens kök köper 40 % lokalproducerat, och skoljordbruket vid Stiernhööksgymnasiet ger skolmaten kött, potatis och spannmål.','The municipality’s kitchens buy 40% locally produced food, and the school farm at Stiernhööksgymnasiet supplies school meals with meat, potatoes and grain.'):'',
    // The food parks the 3D town shows on the old car parks (model.js vision: parking, greenhouses).
    !now&&(v.parking??0)>.15?t(`${(v.parking??0)>.5?'De flesta':'Några'} av parkeringarna i centrum har blivit matparker${(v.greenhouses??0)>.5?' med växthus':''}.`,
      `${(v.parking??0)>.5?'Most':'Some'} of the car parks in the centre have become food parks${(v.greenhouses??0)>.5?' with greenhouses':''}.`):'',
    now?t('Maten i butikerna räcker uppskattningsvis en vecka; det nationella planeringsmålet är tre månader.','The food in the shops would last an estimated week; the national planning goal is three months.')
      :t(`Maten i kommunens lager och butiker räcker ${Math.round(d.foodStockDays)} dagar (2026: uppskattningsvis ${Math.round(d0.foodStockDays)}).`,`The food in the municipality’s stores and shops would last ${Math.round(d.foodStockDays)} days (2026: an estimated ${Math.round(d0.foodStockDays)}).`),
    !now&&d.foodRegional<d0.foodRegional-.01?t('Beroendet av mat utifrån har ökat sedan 2026.','Dependence on food from elsewhere has grown since 2026.'):'',
  ].filter(Boolean).join(' ')});

  // Lake Siljan and the forest: the lake's status, held down by the dams and the regulation, the Siljan trout,
  // clear water without algal blooms, and the forest that is nine tenths of the land, with little of it
  // protected (research/deep/klimat-vatten, natur-mat-stad) – the hav and skog levers.
  const hav=lvl('hav'),skog=lvl('skog');
  // What has taken biodiversity (model.js biodiversity): a warmer climate, less summer-farm grazing, wind in the forests.
  const fewer=[d.stress>.2?t('i ett varmare klimat','in a warmer climate'):'',d.fabodHa<d0.fabodHa*.9?t('med färre betade fäbodmarker','with less summer-farm grazing'):'',
    d.windMW>d0.windMW+250?t('med nya vindparker i skogarna','with new wind farms in the forests'):''].filter(Boolean);
  S.push({title:t('Siljan och skogen','Lake Siljan and the forest'),text:[
    now?t('Siljans vatten är klart och näringsfattigt, men den ekologiska statusen är bara måttlig: kraftutbyggnaden 1955–1970 stängde ute Siljansöringen från mer än 95 % av dess lek- och uppväxtområden, och ålen har försvunnit.',
        'Lake Siljan’s water is clear and low in nutrients, but its ecological status is only moderate: the hydropower built in 1955–1970 shut the Siljan trout out of more than 95% of its spawning and nursery grounds, and the eel has disappeared.')
    :d.waters>=.85?t(`Siljan är nära god ekologisk status (2026: måttlig)${year>2033?' – målet var att nå dit till 2033':''}.`,`Lake Siljan is close to good ecological status (2026: moderate)${year>2033?' – the target was to get there by 2033':''}.`)
    :d.waters>=.6?t('Siljan är på väg mot god ekologisk status (2026: måttlig).','Lake Siljan is on its way to good ecological status (2026: moderate).')
    :d.waters>=d0.waters-.03?t('Siljans ekologiska status är fortfarande måttlig, som 2026.','Lake Siljan’s ecological status is still moderate, as in 2026.')
    :t('Siljan mår sämre än 2026 i det varmare klimatet.','Lake Siljan is in worse health than in 2026 in the warmer climate.'),
    now?'':t(`Öringen når ${pct(d.troutAccess)} av sina forna lek- och uppväxtområden (2026: ${pct(d0.troutAccess)})`,`The trout can reach ${pct(d.troutAccess)} of its former spawning and nursery grounds (2026: ${pct(d0.troutAccess)})`)
      +(hav>L3?t(' – sjön regleras numera för livet i den och inte bara för kraften, och vårfloden är naturligare.',' – the lake is now regulated for the life in it, not only for the power, and the spring flood is more natural.')
      :hav>L2?t(' – fiskvägar leder öring och harr förbi fler dammar, och nya lekplatser har byggts.',' – fish passes take trout and grayling past more dams, and new spawning grounds have been made.')
      :hav>L1?t(' – Enåns mynning och stränderna har restaurerats, och skyddszoner växer längs åarna.',' – the mouth of the Enån and the shores have been restored, and buffer zones grow along the rivers.')
      :d.troutAccess>d0.troutAccess+.02?t(' – fiskvägarna förbi kraftverken Spjutmo, Blyberg och Väsa i Österdalälven har öppnat en del av vägen.',' – the fish passes past the Spjutmo, Blyberg and Väsa power stations on the Österdalälven have opened part of the way.')
      :t(' – fiskvägar byggs förbi kraftverken Spjutmo, Blyberg och Väsa i Österdalälven.',' – fish passes are being built past the Spjutmo, Blyberg and Väsa power stations on the Österdalälven.')),
    now?t('Inget av 26 badvattenprov vid Siljansbadet 2023–2026 visade algblomning, och isen ligger i dag omkring 74 dagar om vintern, mot 129 på 1800-talet.','None of 26 bathing-water samples at Siljansbadet in 2023–2026 showed algal blooms, and the ice now lasts about 74 days a winter, against 129 in the 1800s.')
      :d.stress>.5?t('Siljan är fortfarande näringsfattig och utan algblomning, men de kraftigare regnen gör vattnet något brunare.','Lake Siljan is still low in nutrients and free of algal blooms, but the heavier rains make the water a little browner.')
      :t('Badvattnet vid Siljansbadet är klart, utan algblomning.','The bathing water at Siljansbadet is clear, with no algal blooms.'),
    now?t(`Nästan nio tiondelar av kommunens land är skog, men bara ${pct1(d.protectedNature)} av kommunen är skyddad natur, mot 12,1 % i riket; 556 rödlistade arter har hittats här sedan 2000.`,
        `Almost nine tenths of the municipality’s land is forest, but only ${pct1(d.protectedNature)} of the municipality is protected nature, against 12.1% in Sweden as a whole; 556 red-listed species have been found here since 2000.`)
    :t(`${pct1(d.protectedNature)} av kommunens yta är skyddad natur (2026: ${pct1(d0.protectedNature)}; i riket 12,1 %)`,`${pct1(d.protectedNature)} of the municipality is protected nature (2026: ${pct1(d0.protectedNature)}; Sweden 12.1%)`)
      +(skog>L3?t(' – myrarna håller vattnet som magasin i landskapet, och skogen närmast samhället och byarna brukas utan kalhyggen.',' – the mires hold water like reservoirs in the landscape, and the forest nearest the town and the villages is managed without clear-felling.')
      :skog>L2?t(' – skogen närmast samhället brukas utan kalhyggen, och dikade myrar har återvätts så att de håller vattnet.',' – the forest nearest the town is managed without clear-felling, and drained mires have been rewetted so that they hold the water.')
      :skog>L1?t(' – kommunen har bildat nya naturreservat, och korna betar i skogen runt fäbodarna.',' – the municipality has created new nature reserves, and cows graze in the forest round the summer farms.')
      :d.protectedNature>d0.protectedNature+.004?t(' – några nya naturreservat har bildats, men det mesta av skogen brukas som förut.',' – a few new nature reserves have been created, but most of the forest is managed as before.')
      :t(' – skogen brukas som förut.',' – the forest is managed as before.')),
    now?'':d.biodiversity>d0.biodiversity+.03?t('Den biologiska mångfalden har ökat sedan 2026.','Biodiversity has increased since 2026.')
      :d.biodiversity<d0.biodiversity-.03?t(`Den biologiska mångfalden har minskat sedan 2026${fewer.length?' '+list(fewer):''}.`,`Biodiversity has declined since 2026${fewer.length?' '+list(fewer):''}.`):'',
  ].filter(Boolean).join(' ')});

  // Energy: the wind farm on Hedbodberget and the permitted parks in the north, who owns the power, the sun on
  // the roofs, and the lime works, whose carbon dioxide comes out of the stone itself (research/deep/energi-resor).
  const le=d.localEnergy,share=le>1.5?t(`${dec(le,1)} gånger så mycket el som kommunen använder`,`${dec(le,1)} times as much electricity as the municipality uses`)
    :le>1.02?t('mer el än kommunen använder','more electricity than the municipality uses'):le>=.98?t('ungefär lika mycket el som kommunen använder','about as much electricity as the municipality uses')
    :t(`${pct(le)} av den el kommunen använder`,`${pct(le)} of the electricity the municipality uses`);
  const wind=Math.round(d.windMW),wind0=Math.round(d0.windMW),vind=lvl('vind');
  const owned=t(`${pct(d.localOwned)} av elen som görs i kommunen ägs av bygden – invånarna, byarna och kommunen (2026: uppskattningsvis ${pct(d0.localOwned)})`,
    `${pct(d.localOwned)} of the electricity made in the municipality is owned locally – by residents, villages and the municipality (2026: an estimated ${pct(d0.localOwned)})`);
  const grew=t(`Vindkraften i skogarna har vuxit från ${wind0} till ${wind} MW`,`Wind power in the forests has grown from ${wind0} to ${wind} MW`);
  S.push({title:t('Energi och klimat','Energy and climate'),text:[
    t(`Solceller på ${Math.round(d.solarMW)} MW, vindkraft på ${wind} MW och vattenkraften ger ${share}${was(pct(d0.localEnergy))}${le>1.02?' – överskottet går ut på nätet':''}.`,
      `${Math.round(d.solarMW)} MW of solar panels, ${wind} MW of wind power and the hydropower provide ${share}${was(pct(d0.localEnergy))}${le>1.02?' – the surplus goes out on the grid':''}.`),
    now?t('Vindkraften består av 15 verk på Hedbodberget, byggda 2009–2011; två av dem ägs av kommunen och invånarnas förening Rättviksvind. Broboberget och Lannaberget har tillstånd för upp till 115 verk men inget investeringsbeslut, och elnätets första etapp dit är planerad till 2027.',
        'The wind power comes from 15 turbines on Hedbodberget, built in 2009–2011; two of them are owned by the municipality and the residents’ association Rättviksvind. Broboberget and Lannaberget have permits for up to 115 turbines but no investment decision, and the grid’s first stage there is planned for 2027.')
    :d.windMW<d0.windMW+.5?t(`Inga nya vindkraftverk har byggts i skogarna sedan 2026; ${owned}.`,`No new wind turbines have been built in the forests since 2026; ${owned}.`)
    // Who owns the new wind (model.js localOwned): the villages co-own up to a third of the northern parks from
    // the lever's second level, the kommun is part-owner from its first; otherwise companies from elsewhere.
    :vind<=L1?t(`${grew}, men de nya verken ägs av bolag utifrån: ${owned}.`,`${grew}, but the new turbines are owned by companies from elsewhere: ${owned}.`)
    :vind>L2?t(`${grew}, och byarna och kommunen äger andelar i de nya parkerna: ${owned}.${vind>L3?' Också Gundåsmoren har byggts ut, och el blir vätgas i Furudal.':''}`,
        `${grew}, and the villages and the municipality own shares in the new wind farms: ${owned}.${vind>L3?' Gundåsmoren has been built too, and power becomes hydrogen in Furudal.':''}`)
    :t(`${grew}, med kommunen som delägare i den första etappen: ${owned}.`,`${grew}, with the municipality as a part-owner of the first stage: ${owned}.`),
    lvl('sol')>L2?t('Många tak, lador och parkeringar i byarna och i tätorten ägs gemensamt av energigemenskaper som delar solel och batterier.','Many roofs, barns and car parks in the villages and the town are owned jointly by energy communities that share solar power and batteries.'):'',
    lvl('effektivitet')>L2?t(`Husen är energirenoverade, och i Lokstallarna lagas, lånas och byts saker i stället för att köpas nya; ${pct(d.recycling)} av avfallet materialåtervinns${was(pct(d0.recycling))}.`,
      `The houses have been renovated to save energy, and at Lokstallarna things are repaired, lent and swapped instead of bought new; ${pct(d.recycling)} of the waste is recycled${was(pct(d0.recycling))}.`):'',
    // The lime works: capture comes with the EU's emissions trading, or earlier with power from the forests'
    // wind (model.js capture).
    now?t(`SMA Minerals kalkverk släppte ut ${int(119818)} ton fossil koldioxid 2024. När kalksten bränns frigörs koldioxid ur själva stenen: den kan bara fångas in – ett annat bränsle tar inte bort den.`,
        `SMA Mineral’s lime works emitted ${int(119818)} tonnes of fossil carbon dioxide in 2024. When limestone is burnt, carbon dioxide is released from the stone itself: it can only be captured – another fuel does not remove it.`)
    :d.capture>.05?t(`Kalkverket fångar in ${pct(d.capture)} av sin koldioxid${vind>L2?' – elen från de nya vindparkerna räcker också till avskiljningen':' – EU:s utsläppshandel har gjort det dyrt att släppa ut den'}.`,
        `The lime works captures ${pct(d.capture)} of its carbon dioxide${vind>L2?' – the power from the new wind farms is enough for the capture as well':' – the EU’s emissions trading has made it expensive to emit'}.`)
    :t('Kalkverket släpper fortfarande ut sin koldioxid: den kommer ur själva kalkstenen och kan bara fångas in.','The lime works still emits its carbon dioxide: it comes from the limestone itself and can only be captured.'),
    t(`Utsläppen inom kommunen är ${dec(d.ghg,1)} ton per invånare${was(dec(d0.ghg,1))}, och ${dec(d.ghgIndustry,1)} ton av dem kommer från kalkverket och industrin${was(dec(d0.ghgIndustry,1))}.`,
      `Emissions within the municipality are ${dec(d.ghg,1)} tonnes per resident${was(dec(d0.ghg,1))}, ${dec(d.ghgIndustry,1)} tonnes of them from the lime works and industry${was(dec(d0.ghgIndustry,1))}.`),
    t(`Konsumtionens fotavtryck är ${dec(d.ghgCons,1)} ton per person${was(dec(d0.ghgCons,1))} – 1,5-gradersnivån 2050 är 0,7 ton.`,`The consumption footprint is ${dec(d.ghgCons,1)} tonnes per person${was(dec(d0.ghgCons,1))} – the 1.5-degree level for 2050 is 0.7 tonnes.`),
  ].filter(Boolean).join(' ')});

  // Streets and travel: Storgatan and the square, the buses and shuttles to the villages, the railway to
  // Stockholm (research/deep/energi-resor, kommun-plats-historia) – the bilfritt, kollektivt and forbindelser levers.
  const rt=railText(d.railMain),rt0=was(railText(d0.railMain)),kol=lvl('kollektivt'),forb=lvl('forbindelser');
  S.push({title:t('Gator och resor','Streets and travel'),text:[
    t(`Bilen används för ${now?'uppskattningsvis ':''}${pct(d.carShare)} av resorna${was(pct(d0.carShare))}; ${pct(d.activeShare)} går eller cyklar och ${pct(d.transitShare)} åker kollektivt.`,
      `The car is used for ${now?'an estimated ':''}${pct(d.carShare)} of trips${was(pct(d0.carShare))}; ${pct(d.activeShare)} walk or cycle and ${pct(d.transitShare)} take public transport.`),
    d.depave>.7?t('Gatorna i hela tätorten har blivit trädgårdar, och Storgatan är en bilfri affärsgata med odlingsbäddar, uteserveringar och lastcyklar framför de gamla skyltfönstren.','The streets throughout the town have become gardens, and Storgatan is a car-free shopping street with vegetable beds, outdoor cafés and cargo bikes in front of its old shop windows.')
    :d.depave>.35?t('Storgatan och torget är bilfria, med odlingsbäddar, uteserveringar och lastcyklar framför de gamla skyltfönstren, och parkeringarna har blivit parker och odlingar.','Storgatan and the square are car-free, with vegetable beds, outdoor cafés and cargo bikes in front of the old shop windows, and the car parks have become parks and gardens.')
    :d.depave>.1?t('Gatorna kring Storgatan och torget är gångfartsgator, och en del av asfalten har brutits upp för träd och planteringar.','The streets around Storgatan and the square are walking-pace streets, and some of the asphalt has been dug up for trees and planting.')
    :now?t('Storgatan är gångfartsgata, men riksväg 70 och järnvägen skiljer samhället från Siljan.','Storgatan is a walking-pace street, but national road 70 and the railway cut the town off from the lake.')
    :t('Gatorna ser ut ungefär som 2026, och riksväg 70 och järnvägen skiljer fortfarande samhället från Siljan.','The streets look much as they did in 2026, and national road 70 and the railway still cut the town off from the lake.'),
    now?t('Bara drygt en tredjedel av invånarna tycker att kollektivtrafiken fungerar för vardagens resor, och busslinjen till Borlänge lades ned 2025; regionen prövar anropsstyrd trafik med Rättvik och Leksand.',
        'Only just over a third of residents think public transport works for everyday trips, and the bus line to Borlänge was cut in 2025; the region is trying on-demand services with Rättvik and Leksand.')
    :t(`${pct(d.transitGood)} av invånarna tycker att kollektivtrafiken fungerar för vardagens resor (2026: ${pct(d0.transitGood)}).`,`${pct(d.transitGood)} of residents think public transport works for everyday trips (2026: ${pct(d0.transitGood)}).`)
      +' '+(kol>L3?t(`Den är avgiftsfri, och ${d.aiCapacity>.45?'självkörande ':''}skyttlar går till varje by dygnet runt.`,`It is free, and ${d.aiCapacity>.45?'self-driving ':''}shuttles run to every village around the clock.`)
      :kol>L2?t('Anropsstyrda skyttlar kör till byarna – Boda, Furudal och Vikarbyn – när någon behöver åka, och möter tågen.','On-demand shuttles run to the villages – Boda, Furudal and Vikarbyn – whenever someone needs to travel, and meet the trains.')
      :kol>L1?t('Bussarna runt Siljan går tätare, och cykelvägar och samåkning knyter ihop byarna.','The buses round Lake Siljan run more often, and cycle paths and car-sharing link the villages.')
      :t('Bussarna till byarna går ungefär lika glest som 2026.','The buses to the villages run about as rarely as in 2026.')),
    forb>L3?t(`Tåget tar ${rt} till Stockholm${rt0}; direkttåg går varje timme, och nattåget mot kontinenten stannar i Rättvik.`,`The train takes ${rt} to Stockholm${rt0}; direct trains run every hour, and the night train to the Continent stops in Rättvik.`)
    :forb>L2?t(`Dalabanan har fått mötesspår, och tåget tar ${rt} till Stockholm${rt0}.`,`The Dala line has passing loops, and the train takes ${rt} to Stockholm${rt0}.`)
    :forb>L1?t(`Regionaltågen runt Siljan och till Borlänge går tätare, och tåget tar ${rt} till Stockholm${rt0}.`,`Regional trains round Lake Siljan and to Borlänge run more often, and the train takes ${rt} to Stockholm${rt0}.`)
    :t(`Tåget tar ${rt} till Stockholm${rt0}, men bara två tåg om dagen går direkt.`,`The train takes ${rt} to Stockholm${rt0}, but only two trains a day go direct.`),
    now?t(`Det finns ${Math.round(d.carsPer1000)} bilar per 1 000 invånare – i riket 475 – och ${pct(d.evShare)} av dem går på el.`,`There are ${Math.round(d.carsPer1000)} cars per 1,000 residents – 475 in Sweden as a whole – and ${pct(d.evShare)} of them are electric.`)
    :t(`${pct(d.evShare)} av bilarna går på el, och det finns ${Math.round(d.carsPer1000)} bilar per 1 000 invånare${was(Math.round(d0.carsPer1000))}.`,`${pct(d.evShare)} of cars are electric, and there are ${Math.round(d.carsPer1000)} cars per 1,000 residents${was(Math.round(d0.carsPer1000))}.`),
  ].filter(Boolean).join(' ')});

  // The visitors and the summer town: the guest nights and their seasons, Classic Car Week, the boats round
  // Siljan, the people of a July day and how the visitors come (research/deep/turism-ekonomi) – the turism lever,
  // and the boat lines that come with the villages' buses or the visitors (model.js boatLines).
  const tur=lvl('turism'),boats=Math.round(d.boatVillages||0);
  S.push({title:t('Besökarna och sommarorten','The visitors and the summer town'),text:[
    now?t(`Besökarna stannar ${int(near(d.guestNights,1000))} nätter om året på kommunens hotell, stugbyar och campingar, mer än hälften av dem på camping; 2019 var det ${int(281000)}.`,
        `Visitors stay ${int(near(d.guestNights,1000))} nights a year in the municipality’s hotels, cabins and campsites, more than half of them at campsites; in 2019 it was ${int(281000)}.`)
      :t(`Besökarna stannar ${int(near(d.guestNights,1000))} nätter om året på kommunens hotell, stugbyar och campingar${was(int(near(d0.guestNights,1000)))}.`,`Visitors stay ${int(near(d.guestNights,1000))} nights a year in the municipality’s hotels, cabins and campsites${was(int(near(d0.guestNights,1000)))}.`),
    now?t('Två tredjedelar av gästnätterna är i juni–augusti, och juli ensam har en tredjedel.','Two thirds of the guest nights fall in June–August, and July alone has a third.')
      :t(`${pct(d.summerShare)} av gästnätterna är i juni–augusti${was(pct(d0.summerShare))}`,`${pct(d.summerShare)} of the guest nights fall in June–August${was(pct(d0.summerShare))}`)
        +(tur>L2?t(' – fäbodarna, kulturen och friluftslivet drar gäster också vår, höst och vinter.',' – the summer farms, culture and the outdoors draw guests in spring, autumn and winter too.')
        :tur>L1?t(' – Siljansleden, kanoterna och geoparken drar gäster också utanför sommaren.',' – the Siljan Trail, the canoes and the geopark draw guests outside the summer too.'):'.'),
    !now&&d.stress>.25?(tur<L1?t('Snön och isen sviker allt oftare, och vinterns gäster har blivit färre.','Snow and ice fail more and more often, and winter’s guests have grown fewer.')
      :t('Snön och isen sviker allt oftare.','Snow and ice fail more and more often.')):'',
    // Classic Car Week: its cruising moves out of the centre with a car-free centre (bilfritt from level 2) and
    // loses part of its 35 000 nights unless the visitors' plan reshapes the week (model.js ccw).
    now?t(`Classic Car Week drar omkring ${int(10000)} bilar till centrum vecka 31 och ger omkring ${int(35000)} gästnätter – men den veckan anmäls en femtedel av årets brott i kommunen.`,
        `Classic Car Week brings some ${int(10000)} cars to the centre in week 31 and some ${int(35000)} guest nights – but a fifth of the year’s reported crimes in the municipality come that week.`)
    :lvl('bilfritt')>L2?t(`Classic Car Weeks cruising har flyttat ut ur centrum, till Rättviksparken och travbanan${tur>L2?', och veckan har gjorts om så att den behåller de flesta av sina gäster':', och veckan har tappat en del av sina gäster'}.`,
        `Classic Car Week’s cruising has moved out of the centre, to Rättviksparken and the trotting track${tur>L2?', and the week has been reshaped so that it keeps most of its guests':', and the week has lost some of its guests'}.`)
    :t('Classic Car Week fyller fortfarande centrum med bilar vecka 31.','Classic Car Week still fills the centre with cars in week 31.'),
    // The boats round Siljan: electric boat buses from Långbryggan to the villages in summer (boatVillages).
    now?t('I dag går bara M/S Gustaf Wasa, byggd 1876, sommarturer från Långbryggan; ångbåtarna mellan byarna runt Siljan slutade gå när järnvägen kom.','Today only M/S Gustaf Wasa, built in 1876, runs summer trips from Långbryggan; the steamboats between the villages round Lake Siljan stopped when the railway came.')
    :boats>=6?t('Om somrarna går eldrivna båtbussar från Långbryggan till sex byar runt Siljan – Tällberg, Leksand, Siljansnäs, Sollerön, Vikarbyn och Mora – med besökare, sommarboende och utflykter, som ångbåtarna en gång.',
        'In summer electric boat buses run from Långbryggan to six villages round Lake Siljan – Tällberg, Leksand, Siljansnäs, Sollerön, Vikarbyn and Mora – with visitors, summer residents and day-trippers, as the steamboats once did.')
    :boats>=1?t(`Om somrarna går eldrivna båtbussar från Långbryggan till ${word(boats)} ${boats===1?'by':'byar'} runt Siljan, med besökare och sommarboende.`,`In summer electric boat buses run from Långbryggan to ${word(boats)} ${boats===1?'village':'villages'} round Lake Siljan, with visitors and summer residents.`)
    :t('Inga båtlinjer går mellan byarna runt Siljan.','No boat lines run between the villages round Lake Siljan.'),
    now?'':t(`${pct(d.boatElectric)} av båttrafiken på Siljan går på el${was(pct(d0.boatElectric))}.`,`${pct(d.boatElectric)} of boat traffic on Lake Siljan is electric${was(pct(d0.boatElectric))}.`),
    t(`En julidag är omkring ${int(near(d.summerPeople,100))} människor i kommunen${was(int(near(d0.summerPeople,100)))}, ${pct(d.summerPeople/d.pop-1)} fler än på hösten${now?` – många i de ${int(2980)} fritidshusen – och på Classic Car Weeks lördag tre gånger så många som vanligt`:''}.`,
      `On a July day some ${int(near(d.summerPeople,100))} people are in the municipality${was(int(near(d0.summerPeople,100)))}, ${pct(d.summerPeople/d.pop-1)} more than in autumn${now?` – many in the ${int(2980)} second homes – and on the Saturday of Classic Car Week three times as many as usual`:''}.`),
    d.touristCar<.85?t(`${pct(1-d.touristCar)} av besökarna kommer utan bil, med tåg, buss${boats>=1?' eller båt':' eller cykel'}${was(pct(1-d0.touristCar))}.`,`${pct(1-d.touristCar)} of visitors arrive without a car, by train, bus${boats>=1?' or boat':' or bike'}${was(pct(1-d0.touristCar))}.`)
      :t(`${pct(d.touristCar)} av besökarna kommer med bil${was(pct(d0.touristCar))}.`,`${pct(d.touristCar)} of visitors come by car${was(pct(d0.touristCar))}.`),
    now?t(`Besöksnäringen är kommunens största privata näring och ger ${int(d.tourismJobs)} årsarbeten, och Dalhalla, i det gamla kalkbrottet, har omkring ${int(120000)} konsertbesökare om sommaren.`,
        `Tourism is the municipality’s largest private industry and gives ${int(d.tourismJobs)} full-time jobs, and Dalhalla, in the old limestone quarry, has some ${int(120000)} concert-goers each summer.`)
      :t(`Besökarna ger ${int(d.tourismJobs)} årsarbeten i kommunen${was(int(d0.tourismJobs))}.`,`The visitors give ${int(d.tourismJobs)} full-time jobs in the municipality${was(int(d0.tourismJobs))}.`),
  ].filter(Boolean).join(' ')});

  // Community and democracy: the village halls and associations, homes for every age, the villages' voice, the
  // people who move in – the only reason Rättvik does not shrink – and the young who think they will leave
  // (research/deep/samhalle-halsa, kommun-plats-historia) – the bogemenskap, demokrati and kunskap levers.
  const kun=lvl('kunskap');
  S.push({title:t('Gemenskap och demokrati','Community and democracy'),text:[
    t(`${pct(d.lowParticipation)} har lågt socialt deltagande${was(pct(d0.lowParticipation))} och ${pct(d.trust)} litar på andra människor${was(pct(d0.trust))}.`,`${pct(d.lowParticipation)} have low social participation${was(pct(d0.lowParticipation))} and ${pct(d.trust)} trust other people${was(pct(d0.trust))}.`),
    now?t('Färre känner sig ensamma än i Dalarna och i riket, bara 11 % är otrygga ute på kvällen, och kommunen har 93 föreningar, 24 av dem bygdegårdsföreningar.','Fewer feel lonely than in Dalarna and in Sweden as a whole, only 11% feel unsafe out in the evening, and the municipality has 93 associations, 24 of them village-hall associations.')
      :t(`${pct(d.unsafe)} känner sig otrygga ute på kvällen (2026: ${pct(d0.unsafe)}).`,`${pct(d.unsafe)} feel unsafe out in the evening (2026: ${pct(d0.unsafe)}).`),
    lvl('bogemenskap')>L2?t(`${pct(d.cohousing)} bor i generationshus eller andra bogemenskaper; i Generationshuset och i ekobyn i Persborg delar förskolebarn, unga och de äldsta trapphus och kök.`,`${pct(d.cohousing)} live in generation houses or other cohousing; in the Generation House and the eco-village at Persborg, preschoolers, young people and the oldest share stairwells and kitchens.`)
    :lvl('bogemenskap')>L1?t(`Nya hyresrätter för unga och äldre byggs med gemensamma lokaler, och ${pct(d.cohousing)} bor i någon form av bogemenskap${was(pct(d0.cohousing))}.`,`New rented flats for the young and the old are built with shared rooms, and ${pct(d.cohousing)} live in some form of cohousing${was(pct(d0.cohousing))}.`)
    :now?t('De flesta bor i egna hus, 45 % av dem över 65 bor ensamma, och det finns inget kollektivhus i kommunen.','Most people live in houses of their own, 45% of those over 65 live alone, and there is no cohousing in the municipality.')
    :t('De flesta bor som 2026, i egna hus, och många av de äldre bor ensamma.','Most people live as they did in 2026, in houses of their own, and many of the old live alone.'),
    lvl('demokrati')>L3?t('Ett ungdomsråd och ett barnbarnsombud har veto i frågor som binder bygden, och det lottade medborgarrådet möts varje sommar vid Vasastenen.','A youth council and a grandchildren’s ombudsman have a veto on questions that bind the community, and the citizens’ assembly chosen by lot meets every summer at Vasastenen.')
    :lvl('demokrati')>L2?t('Lottade medborgarråd ger råd i de stora frågorna, och byarna bestämmer själva över en del av budgeten.','Citizens’ assemblies chosen by lot give advice on the big questions, and the villages decide on part of the budget themselves.')
    :lvl('demokrati')>L1?t('Kommunen håller dialogmöten i bystugorna före stora beslut.','The municipality holds dialogue meetings in the village halls before big decisions.')
    :now?t('84 % röstade i kommunvalet 2026, lika många som 2022.','84% voted in the 2026 municipal election, the same as in 2022.'):'',
    t(`${pct(d.youthVoice)} av de unga anser att de kan föra fram sina åsikter till dem som bestämmer${was(pct(d0.youthVoice))}.`,`${pct(d.youthVoice)} of young people think they can put their views to those who decide${was(pct(d0.youthVoice))}.`),
    now?t(`Rättviks kommun har ${int(d.pop)} invånare. Det dör dubbelt så många som det föds, så det är inflyttningen som avgör: i snitt flyttade 101 fler in än ut om året 2015–2024.`,
        `Rättvik Municipality has ${int(d.pop)} residents. Twice as many die as are born, so moving in decides: on average 101 more people moved in than out each year in 2015–2024.`)
      :t(`Rättviks kommun har ${int(near(d.pop,10))} invånare${was(int(d0.pop))}. Det dör ${int(Math.abs(d.naturalChange))} ${d.naturalChange<0?'fler än det föds':'färre än det föds'} om året, och ${int(Math.abs(d.netMigration))} fler flyttar ${d.netMigration>=0?'in än ut':'ut än in'}${was(int(d0.netMigration))}.`,
        `Rättvik Municipality has ${int(near(d.pop,10))} residents${was(int(d0.pop))}. ${int(Math.abs(d.naturalChange))} ${d.naturalChange<0?'more':'fewer'} people die than are born each year, and ${int(Math.abs(d.netMigration))} more move ${d.netMigration>=0?'in than out':'out than in'}${was(int(d0.netMigration))}.`),
    now?t('63 % av de unga tror att de kommer att flytta härifrån, främst för arbete och studier; närmaste högskola ligger i Falun och Borlänge.','63% of young people think they will move away, mainly for work and studies; the nearest college is in Falun and Borlänge.')
      :t(`${pct(d.youthLeave)} av de unga tror att de kommer att flytta härifrån (2026: ${pct(d0.youthLeave)})`,`${pct(d.youthLeave)} of young people think they will move away (2026: ${pct(d0.youthLeave)})`)
        +(kun>L3?t(' – undersköterskor och lärare utbildas numera i bygden, och alla kan lära sig nytt hela livet.',' – assistant nurses and teachers are now trained locally, and everyone can keep learning all their lives.')
        :kun>L2?t(' – byskolorna har blivit byarnas hus, och naturbruket vid Stiernhööksgymnasiet är bygdens levande labb för fäbodar, skog och Siljan.',' – the village schools have become the villages’ houses, and the natural resource programme at Stiernhööksgymnasiet is the area’s living lab for summer farms, forest and Lake Siljan.')
        :kun>L1?t(' – ett lärcentrum vid stationen gör att man kan läsa vidare på distans utan att flytta.',' – a learning centre by the station lets people study further at a distance without moving away.')
        :t(' – utan lärcentrum eller högskola i bygden flyttar många för att studera.',' – with no learning centre or college locally, many move away to study.')),
    now?'':d.lowParticipation>d0.lowParticipation+.02?t('Ensamheten har ökat sedan 2026: fler bor ensamma och mer av vardagen sker på skärm.','Loneliness has grown since 2026: more people live alone and more of everyday life happens on screens.')
      :d.lowParticipation<d0.lowParticipation-.02?t('Ensamheten har minskat sedan 2026.','Loneliness has fallen since 2026.'):'',
  ].filter(Boolean).join(' ')});

  // Health and care in an old municipality: the very old, loneliness among those with home care, care close
  // by (research/deep/samhalle-halsa, story.json) – the forebyggande lever, and welfare technology (ai).
  const fore=lvl('forebyggande');
  S.push({title:t('Hälsa och omsorg','Health and care'),text:[
    t(`Medellivslängden är ${dec(d.lifeExp,1)} år${was(dec(d0.lifeExp,1))}. ${pct(d.activity)} rör sig tillräckligt och ${pct(d.selfHealth)} anser sig ha god hälsa.`,`Life expectancy is ${dec(d.lifeExp,1)} years${was(dec(d0.lifeExp,1))}. ${pct(d.activity)} get enough exercise and ${pct(d.selfHealth)} rate their health as good.`),
    t(`${pct(d.share65)} av invånarna är 65 år eller äldre och ${pct(d.share80)} är 80 eller äldre${now?' – försörjningskvoten är bland de högsta i landet':` (2026: ${pct(d0.share65)} och ${pct(d0.share80)})`}.`,
      `${pct(d.share65)} of residents are 65 or older and ${pct(d.share80)} are 80 or older${now?' – the dependency ratio is among the highest in Sweden':` (2026: ${pct(d0.share65)} and ${pct(d0.share80)})`}.`),
    now?t('Hemtjänsten når allt fler, men hälften av de äldre som har hemtjänst besväras av ensamhet, och regionens vårdbuss till Furudal, Bingsjö och Boda, beslutad 2023, har ännu inte kommit.','Home care reaches more and more people, but half of the elderly who receive it are troubled by loneliness, and the region’s healthcare bus to Furudal, Bingsjö and Boda, decided in 2023, has still not come.')
      :t(`${pct(d.elderLonely)} av de äldre som har hemtjänst besväras av ensamhet (2026: ${pct(d0.elderLonely)}).`,`${pct(d.elderLonely)} of the elderly who receive home care are troubled by loneliness (2026: ${pct(d0.elderLonely)}).`),
    fore>L3?t('Bygden är planerad för rörelse och möten, och den vanligaste ordinationen på Hälsotorget är natur, rörelse och sällskap.','The community is planned for movement and meeting, and the most common prescription at the Health Square is nature, movement and company.')
    :fore>L2?t('Sköterskor i byarnas hälsostugor och trivselträffar varje vecka håller de äldre friskare och i sällskap.','Nurses in the villages’ health cottages and weekly social gatherings keep the elderly healthier and in company.')
    :fore>L1?t('Vårdcentralen skriver ut rörelse och natur på recept, och hembesök förebygger fall.','The health centre prescribes exercise and nature, and home visits prevent falls.'):'',
    !now&&lvl('ai')>L2&&lvl('analog')<L2?t('Fjärrtillsyn och sensorer gör en del av besöken – och de äldre som mest möter en skärm känner sig ensammare.','Remote supervision and sensors make some of the visits – and the elderly who mostly meet a screen feel lonelier.'):'',
    now?'':d.welfare>1.03?t('Välfärden har mer att röra sig med än 2026, trots att fler är gamla.','The welfare services have more room to manoeuvre than in 2026, even though more people are old.')
      :d.welfare<.97?t('Välfärden har mindre att röra sig med än 2026, samtidigt som fler är mycket gamla.','The welfare services have less room to manoeuvre than in 2026, while more people are very old.'):'',
  ].filter(Boolean).join(' ')});

  // The analogue and the accelerated: the screen-free childhood, the crafts in the church stables, the
  // Analogue House, AI (places.js) – the analog and ai levers.
  S.push({title:t('Det analoga och det accelererade','The analogue and the accelerated'),text:[
    lvl('analog')>L3?t('Barndomen är skärmfri till tolv år: böcker, slöjd och uteundervisning vid Siljan. I kyrkstallarna lär sig unga timring, smide och dräktsömnad. Kulturhuset är bygdens analoga hus med papperskopior av allt viktigt, och betalningar, journaler och larm fungerar också utan nät.',
      'Childhood is screen-free until twelve: books, crafts and outdoor lessons by Lake Siljan. In the church stables young people learn log building, smithing and folk-costume sewing. The culture house is the Analogue House with paper copies of everything important, and payments, medical records and alarms also work offline.')
    :lvl('analog')>L2?t('Barndomen är skärmfri till tolv år: böcker, slöjd och uteundervisning vid Siljan. I kyrkstallarna lär sig unga timring, smide och dräktsömnad, och varje by har kontanter och papper som reserv.',
      'Childhood is screen-free until twelve: books, crafts and outdoor lessons by Lake Siljan. In the church stables young people learn log building, smithing and folk-costume sewing, and every village keeps cash and paper as a backup.')
    :lvl('analog')>L1?t('Skolan är mobilfri, och böckerna har kommit tillbaka i undervisningen.','School is phone-free, and books are back in the lessons.')
    :now?t('Det digitala kommer först, och 3 % av svenskarna – nästan alla pensionärer – använder inte internet alls.','Digital comes first, and 3% of Swedes – almost all of them pensioners – do not use the internet at all.')
    :t('Nästan allt är digitalt, också reserven.','Almost everything is digital, even the backup.'),
    now?t(`${pct(d.youthScreen)} av Sveriges 13–16-åringar har mer än tre timmars skärmtid om dagen på fritiden; det finns inget eget mått för Rättvik.`,`${pct(d.youthScreen)} of Sweden’s 13–16-year-olds spend more than three hours a day on screens in their free time; there is no figure for Rättvik alone.`)
      :t(`${pct(d.youthScreen)} av 13–16-åringarna har mer än tre timmars skärmtid om dagen på fritiden (2026: rikets ${pct(d0.youthScreen)}).`,`${pct(d.youthScreen)} of 13–16-year-olds spend more than three hours a day on screens in their free time (2026: Sweden’s ${pct(d0.youthScreen)}).`),
    lvl('ai')>L2?(d.aiGovernance>.6?t('AI som Dalarnas kommuner äger tillsammans hjälper till i omsorgen, skolan och förvaltningen – med öppna algoritmer och människor som fattar besluten.','AI owned jointly by Dalarna’s municipalities helps in care, schools and administration – with open algorithms and people making the decisions.')
      :t('AI sköter mycket av omsorgen och förvaltningen, men få vet hur besluten fattas.','AI runs much of care and administration, but few know how the decisions are made.'))
    :lvl('ai')>L1?t('AI prövas i vården, med människor som fattar besluten.','AI is being tried out in healthcare, with people making the decisions.')
    :now?t('Hemtjänsten har digital nattillsyn, men AI prövas bara i enstaka försök.','Home care has digital night-time supervision, but AI is tried only in a few trials.')
    :t('AI används sparsamt och mest i beprövade verktyg.','AI is used sparingly, mostly in well-tested tools.'),
  ].filter(Boolean).join(' ')});

  // Lake Siljan's high water against the lowest streets, the cloudbursts, the shore below Kyrkudden, drinking
  // water and preparedness (research/deep/klimat-vatten). The lake is regulated: its everyday level stays, its
  // high water rises (model.js FLOOD) – the anpassning and beredskap levers.
  const streets=d0.protection,anp=lvl('anpassning');
  const eased=[anp>L1?t('skyfallsytor','cloudburst parks'):'',anp>L1?t('öppna diken','open channels'):'',d.depave>.1?t('gator som blivit trädgårdar','streets turned into gardens'):'',skog>L2?t('återvätta myrar','rewetted mires'):''].filter(Boolean);
  S.push({title:t('Vatten och beredskap','Water and preparedness'),text:[
    t(`Siljans hundraårsnivå ligger på ${now?'uppskattningsvis ':''}${dec(d.level100,2)} m ö.h.${was(`${dec(d0.level100,2)} m`)}, och de lägsta gatorna, Badhusgatan och Båthamnsvägen, ligger kring ${dec(streets,1)} m.`,
      `Lake Siljan’s 100-year level stands at ${now?'an estimated ':''}${dec(d.level100,2)} m above sea level${was(`${dec(d0.level100,2)} m`)}, and the lowest streets, Badhusgatan and Båthamnsvägen, lie at about ${dec(streets,1)} m.`),
    !now&&d.level100>d0.level100+.02?t('Sjöns vanliga nivå står kvar – regleringen håller den – men högvattnet stiger med blötare vintrar och höstar.','The lake’s normal level stays where it was – the regulation holds it – but the high water rises with wetter winters and autumns.'):'',
    d.floodShare>0?t(`Ett hundraårshögvatten når nu in på gatorna: ${pct(d.floodShare)} av centrum står under vatten, först kring Enåns mynning och Badhusgatan.`,`A 100-year high water now reaches the streets: ${pct(d.floodShare)} of the centre is under water, first around the mouth of the Enån and Badhusgatan.`)
    :d.protection>streets+.15?t(`${anp>L2?'Höjda strandstråk och plats för vattnet håller':'Höjda strandstråk håller'} högvattnet borta från gatorna upp till ${dec(d.protection,1)} m – ${len(d.floodMargin)} över hundraårsnivån.`,`${anp>L2?'Raised shore paths and room for the water keep':'Raised shore paths keep'} high water off the streets up to ${dec(d.protection,1)} m – ${len(d.floodMargin)} above the 100-year level.`)
    :d.floodMargin<.12?t(`Marginalen mellan hundraårsnivån och de lägsta gatorna är bara ${len(d.floodMargin)}${was(len(d0.floodMargin))}.`,`The margin between the 100-year level and the lowest streets is only ${len(d.floodMargin)}${was(len(d0.floodMargin))}.`)
    :t(`Ett hundraårshögvatten når ${now?'redan stranden och nästan halva campingen':'stranden och campingens lägre delar'}, men inte gatorna.`,`A 100-year high water ${now?'already reaches the beach and almost half the campsite':'reaches the beach and the lower parts of the campsite'}, but not the streets.`),
    anp>L3?t('Campingen har flyttat upp från stranden, varje by tar hand om sitt eget regnvatten, och nya hus byggs över 165 meter, som i Leksand.','The campsite has moved up from the beach, every village handles its own rainwater, and new houses are built above 165 metres, as in Leksand.')
    :anp>L2?t('Campingen har flyttat upp från stranden, och strandängar tar emot högvattnet.','The campsite has moved up from the beach, and shore meadows take the high water.')
    :anp>L1?t('Skyfallsytor och öppna diken tar emot regnet i de mest utsatta kvarteren.','Cloudburst parks and open channels take the rain in the most exposed neighbourhoods.'):'',
    // A cloudburst like Storm Hans (about 150 houses in 2023) grows with the rain and shrinks with room for
    // the water (model.js cloudburstHomes).
    now?t('Skyfallen när ovädret Hans drog in i augusti 2023 skadade omkring 150 hus i kommunen, de flesta i sluttningarna mot Siljan, och det finns ingen skyfallskarta för hela samhället.','The cloudbursts when Storm Hans struck in August 2023 damaged some 150 houses in the municipality, most of them on the slopes down to Lake Siljan, and there is no cloudburst map for the whole town.')
      :t(`Ett skyfall som ovädret Hans skulle nu skada omkring ${int(near(d.cloudburstHomes,5))} hus (2023: omkring 150)`,`A cloudburst like Storm Hans would now damage some ${int(near(d.cloudburstHomes,5))} houses (2023: some 150)`)
        +(d.cloudburstHomes<140&&eased.length?t(` – ${list(eased)} tar udden av regnet.`,` – ${list(eased)} take the edge off the rain.`)
        :d.cloudburstHomes>160?t(' – regnen har blivit kraftigare.',' – the rains have grown heavier.'):'.'),
    // Kyrkudden: adaptation costs at most heritageCost × its implementation (model.js); anything more is a
    // high water that got in among the church stables (events.js).
    d.heritage<1-(PARAMS.heritageCost||0)*anp-.01?t('Kyrkudden med kyrkan och Vasastenen står kvar, men högvattnet har stått in bland kyrkstallarna, och några av dem har tagit skada.','Kyrkudden, with the church and Vasastenen, still stands, but high water has got in among the church stables, and some of them have been damaged.')
    :d.heritage<.985?t('Kyrkudden med kyrkan, de 87 kyrkstallarna och Vasastenen står kvar, men höjda strandkanter har förändrat den öppna stranden nedanför.','Kyrkudden, with the church, the 87 church stables and Vasastenen, still stands, but raised shore edges have changed the open shore below.')
    :now?t('Kyrkudden med kyrkan, de 87 kyrkstallarna och Vasastenen är riksintresse för kulturmiljövården, och stranden nedanför är öppen.','Kyrkudden, with the church, the 87 church stables and Vasastenen, is of national interest for cultural heritage, and the shore below is open.')
    :t('Kyrkudden med kyrkan och de 87 kyrkstallarna ser ut som 2026, och stranden nedanför är lika öppen.','Kyrkudden, with the church and the 87 church stables, looks as it did in 2026, and the shore below is just as open.'),
    now?t(`Dricksvattnet kommer ur grundvattnet i Gärdsjö, och nästan fyra av tio har egen brunn; ett torrt år finns uppskattningsvis ${pct(d.waterMargin)} mer vatten än kommunen behöver.`,`Drinking water comes from the groundwater at Gärdsjö, and almost four in ten have their own well; in a dry year there is an estimated ${pct(d.waterMargin)} more water than the municipality needs.`)
    :d.waterMargin<0?t(`Ett torrt år räcker inte vattnet: vattentäkterna ger ${pct(-d.waterMargin)} mindre än kommunen behöver (2026: uppskattningsvis ${pct(d0.waterMargin)} mer), och det blir bevattningsförbud ${pct(d.restrictions)} av somrarna.`,`In a dry year the water runs short: the water sources give ${pct(-d.waterMargin)} less than the municipality needs (2026: an estimated ${pct(d0.waterMargin)} more), and ${pct(d.restrictions)} of summers bring a ban on watering.`)
    :d.waterMargin<.1?t(`Vattnet räcker knappt ett torrt år – marginalen är ${pct(d.waterMargin)} (2026: uppskattningsvis ${pct(d0.waterMargin)}).`,`The water barely lasts a dry year – the margin is ${pct(d.waterMargin)} (2026: an estimated ${pct(d0.waterMargin)}).`)
    :t(`Även ett torrt år finns ${pct(d.waterMargin)} mer vatten än kommunen behöver (2026: uppskattningsvis ${pct(d0.waterMargin)}).`,`Even in a dry year there is ${pct(d.waterMargin)} more water than the municipality needs (2026: an estimated ${pct(d0.waterMargin)}).`),
    lvl('beredskap')>L3?t('Bygden är byggd för att klara sig själv i en kris: varje by har vatten, mat och el i reserv, och elnätet kan köras i ö-drift.','The community is built to manage on its own in a crisis: every village has water, food and power in reserve, and the grid can run in island mode.')
    :lvl('beredskap')>L2?t('Kommunen har en andra vattentäkt, lager för en månad och ett elnät som kan köras i ö-drift från Gråda om stamnätet faller.','The municipality has a second water source, stocks for a month and a grid that can run in island mode from Gråda if the national grid fails.')
    :lvl('beredskap')>L1?t('Ledningsnätet förnyas, och kommunen har nödlager och en plan för nödvatten.','The water mains are being renewed, and the municipality has emergency stocks and an emergency water plan.'):'',
    t(`${pct(d.homePrepared)} av hushållen klarar en vecka på egen hand${was(pct(d0.homePrepared))}.`,`${pct(d.homePrepared)} of households can manage a week on their own${was(pct(d0.homePrepared))}.`),
  ].filter(Boolean).join(' ')});
  return S;
}
