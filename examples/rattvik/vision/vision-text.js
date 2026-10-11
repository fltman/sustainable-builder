// "Visionen": Rättvik in a given year written out as a short vision document, from the model state.
// Every sentence is conditioned on the numbers, so the text describes the plan the player made –
// including what it did not do – and each section names what has changed since 2026. Today's facts come
// from the research (research/deep/*-notes.md, research/story.json); what a lever brings follows its
// levels in levers.js and the places in places.js. Swedish and English inline with t().
import { t, dec, int, pct } from '@engine/i18n.js';
import { BASE, PARAMS } from '@city/model.js';
// Hours as "3 h 21", to the minute (the fastest direct train to Stockholm takes 201 minutes today).
const railText=v=>{const m=Math.round(v*60);return `${Math.floor(m/60)} h ${String(m%60).padStart(2,'0')}`;};
const near=(v,step)=>Math.round(v/step)*step;
// The model counts industry together with the remaining sources ("other"); industry's share of them – above
// all the lime works, 119 818 t of fossil CO₂ in 2024 (research/deep/energi-resor).
const G=BASE.ghg||{},IND=G.industry?G.industry/(G.industry+(G.other||0)):.94;
// How far a lever must be implemented (0–1) before the text shows its first, second and third level.
const L1=.12,L2=.45,L3=.8;

export function visionSections(run,year){
  const r=run.years[year-2026],d=r.ind,I=r.I,d0=run.years[0].ind;
  const lvl=id=>I[id]||0;
  // 2026 is the starting point; from 2027 a figure carries its 2026 value.
  const now=year<=2026,was=x=>now?'':` (2026: ${x})`;
  // Metres or centimetres, for heights above the 100-year level.
  const len=m=>m>=1?`${dec(m,1)} m`:`${Math.max(1,Math.round(m*100))} cm`;
  const S=[];

  // Food from the countryside: the summer farms, the farms and the municipality's kitchens
  // (research/deep/natur-mat-stad, story.json).
  const farmed=d.regen>=.97?t('Nästan all åkermark','Almost all the farmland'):t(`${pct(d.regen)} av åkermarken`,`${pct(d.regen)} of the farmland`);
  S.push({title:t('Maten och fäbodarna','Food and the summer farms'),text:[
    t(`${now?'Uppskattningsvis ':''}${pct(d.foodRegional)} av maten som Rättviksborna äter kommer från länet${was(pct(d0.foodRegional))}.`,
      `${now?'An estimated ':''}${pct(d.foodRegional)} of the food people in Rättvik eat comes from the county${was(pct(d0.foodRegional))}.`),
    lvl('regionalt')>L2?t(`Fäbodarna lever: om somrarna betar korna och getterna i skogen, och fäbodarnas smör, ost och messmör säljs på torget. ${farmed} brukas ekologiskt eller regenerativt${was(pct(d0.regen))}, och mejerier och kvarnar förädlar maten i bygden.`,
      `The summer farms are alive: in summer the cows and goats graze in the forest, and the farms’ butter, cheese and whey butter are sold in the square. ${farmed} is farmed organically or regeneratively${was(pct(d0.regen))}, and dairies and mills process the food locally.`)
    :lvl('regionalt')>L1?t('Kommunens kök köper maten från bygdens gårdar, men fäbodarna hålls levande av ett fåtal brukare.','The municipality’s kitchens buy their food from local farms, but the summer farms are kept alive by only a few farmers.')
    :now?t('Fäbodbruket står sedan 2024 på Unescos lista över mänsklighetens immateriella kulturarv men hålls levande av ett fåtal brukare; 437 mjölkkor på fem gårdar täcker ändå kommunens förbrukning av mjölk.','Summer farming has been on UNESCO’s list of the intangible cultural heritage of humanity since 2024 but is kept alive by only a few farmers; even so, 437 dairy cows on five farms cover all the milk the municipality drinks.')
    :t('Fäbodbruket är ett kulturarv som få kan leva av, och maten i butikerna har oftast rest långt.','Summer farming is a heritage few can make a living from, and the food in the shops has usually travelled far.'),
    lvl('regionalt')>L3?t('Bygdens matråd bestämmer vad som odlas och vad som lagras.','A local food council decides what is grown and what is stored.'):'',
    lvl('stadsodling')>L2?t(`Tätorten odlar ${pct(d.cityVeg)} av sin egen frukt och sina grönsaker – i skolträdgårdar, på gamla parkeringar och i växthus.`,`The town grows ${pct(d.cityVeg)} of its own fruit and vegetables – in school gardens, on old car parks and in greenhouses.`)
    :lvl('stadsodling')>L1?t('Odlingslådor finns i många kvarter, men tätorten odlar fortfarande bara en liten del av det den äter.','Many neighbourhoods have planter boxes, but the town still grows only a small share of what it eats.'):'',
    lvl('kost')>L2?t('Skolor och äldreboenden lagar växtrik mat av säsongens råvaror, mycket av den från skoljordbruket vid Stiernhööksgymnasiet, och svinnet är nästan borta.','Schools and care homes cook plant-rich meals from seasonal produce, much of it from the school farm at Stiernhööksgymnasiet, and food waste has almost disappeared.')
    :now?t('Kommunens kök köper 40 % lokalproducerat, och skoljordbruket vid Stiernhööksgymnasiet ger skolmaten kött, potatis och spannmål.','The municipality’s kitchens buy 40% locally produced food, and the school farm at Stiernhööksgymnasiet supplies school meals with meat, potatoes and grain.'):'',
    t(`Kommunen har mat i lager för ${Math.round(d.foodStockDays)} dagar${was(Math.round(d0.foodStockDays))}.`,`The municipality keeps food in store for ${Math.round(d.foodStockDays)} days${was(Math.round(d0.foodStockDays))}.`),
    !now&&d.foodRegional<d0.foodRegional-.01?t('Beroendet av mat utifrån har ökat sedan 2026.','Dependence on food from elsewhere has grown since 2026.'):'',
  ].filter(Boolean).join(' ')});

  // Energy: the wind farm on Hedbodberget, the permitted parks in the north and the grid; the lime works,
  // whose carbon dioxide comes out of the stone itself (research/deep/energi-resor).
  const le=d.localEnergy,share=le>1.5?t(`${dec(le,1)} gånger så mycket el som kommunen använder`,`${dec(le,1)} times as much electricity as the municipality uses`)
    :le>1.02?t('mer el än kommunen använder','more electricity than the municipality uses'):le>=.98?t('ungefär lika mycket el som kommunen använder','about as much electricity as the municipality uses')
    :t(`${pct(le)} av den el kommunen använder`,`${pct(le)} of the electricity the municipality uses`);
  const ind=Math.max(0,d.ghg-d.ghgTransport-d.ghgAgri)*IND,ind0=Math.max(0,d0.ghg-d0.ghgTransport-d0.ghgAgri)*IND;
  const wind=Math.round(d.windMW),wind0=Math.round(d0.windMW);
  S.push({title:t('Energi och klimat','Energy and climate'),text:[
    t(`Solceller på ${Math.round(d.solarMW)} MW, vindkraft på ${wind} MW och vattenkraften ger ${share}${was(pct(d0.localEnergy))}${le>1.02?' – överskottet går ut på nätet':''}.`,
      `${Math.round(d.solarMW)} MW of solar panels, ${wind} MW of wind power and the hydropower provide ${share}${was(pct(d0.localEnergy))}${le>1.02?' – the surplus goes out on the grid':''}.`),
    now?t('Vindkraften består av 15 verk på Hedbodberget, byggda 2009–2011. Broboberget och Lannaberget har tillstånd för upp till 115 verk men inget investeringsbeslut, och elnätet i Dalarna tar inte emot mer storskalig produktion förrän en ny stamnätsstation är byggd.',
      'The wind power comes from 15 turbines on Hedbodberget, built in 2009–2011. Broboberget and Lannaberget have permits for up to 115 turbines but no investment decision, and the grid in Dalarna takes no more large-scale production until a new national-grid substation is built.')
    :d.windMW<d0.windMW+.5?t('Inga nya vindkraftverk har byggts i skogarna sedan 2026.','No new wind turbines have been built in the forests since 2026.')
    :d.windMW<120?t(`Några nya verk har byggts i skogarna${lvl('vind')>L2?', delägda av byarna':''}: vindkraften är ${wind} MW (2026: ${wind0} MW).`,`A few new turbines have been built in the forests${lvl('vind')>L2?', part-owned by the villages':''}: the wind power is ${wind} MW (2026: ${wind0} MW).`)
    :t(`Vindkraften i skogarna har vuxit från ${wind0} till ${wind} MW sedan elnätet byggts ut${lvl('vind')>L2?', och byarna äger andelar i parkerna':''}${lvl('vind')>L3?' – el och vätgas går till andra regioner':''}.`,
      `Wind power in the forests has grown from ${wind0} to ${wind} MW since the grid was expanded${lvl('vind')>L2?', and the villages own shares in the wind farms':''}${lvl('vind')>L3?' – electricity and hydrogen go to other regions':''}.`),
    lvl('sol')>L2?t('Många tak i byarna och i tätorten ägs gemensamt av energigemenskaper som delar solel och batterier.','Many roofs in the villages and the town are owned jointly by energy communities that share solar power and batteries.'):'',
    lvl('effektivitet')>L2?t(`Husen är energirenoverade, och i Lokstallarna lagas, lånas och byts saker i stället för att köpas nya; ${pct(d.recycling)} av avfallet materialåtervinns${was(pct(d0.recycling))}.`,
      `The houses have been renovated to save energy, and at Lokstallarna things are repaired, lent and swapped instead of bought new; ${pct(d.recycling)} of the waste is recycled${was(pct(d0.recycling))}.`):'',
    t(`Utsläppen inom kommunen är ${dec(d.ghg,1)} ton per invånare${was(dec(d0.ghg,1))}, och ${dec(ind,1)} ton av dem kommer från industrin – framför allt kalkverket.`,
      `Emissions within the municipality are ${dec(d.ghg,1)} tonnes per resident${was(dec(d0.ghg,1))}, ${dec(ind,1)} tonnes of them from industry – above all the lime works.`),
    !now&&ind<ind0*.55?t('Kalkverkets utsläpp har mer än halverats sedan 2026, men det mesta av det som är kvar är koldioxid ur själva kalkstenen: den kan bara fångas in – ett annat bränsle tar inte bort den.','The lime works’ emissions have more than halved since 2026, but most of what remains is carbon dioxide from the limestone itself: it can only be captured – another fuel does not remove it.')
      :t('När kalksten bränns frigörs koldioxid ur själva stenen: den kan bara fångas in – ett annat bränsle tar inte bort den.','When limestone is burnt, carbon dioxide is released from the stone itself: it can only be captured – another fuel does not remove it.'),
    t(`Konsumtionens fotavtryck är ${dec(d.ghgCons,1)} ton per person${was(dec(d0.ghgCons,1))} – 1,5-gradersnivån 2050 är 0,7 ton.`,`The consumption footprint is ${dec(d.ghgCons,1)} tonnes per person${was(dec(d0.ghgCons,1))} – the 1.5-degree level for 2050 is 0.7 tonnes.`),
  ].filter(Boolean).join(' ')});

  // Streets and travel: Storgatan and the square, the buses to the villages, the railway to Stockholm
  // (research/deep/energi-resor, kommun-plats-historia, natur-mat-stad).
  const rt=railText(d.railMain),rt0=was(railText(d0.railMain));
  S.push({title:t('Gator och resor','Streets and travel'),text:[
    t(`Bilen används för ${now?'uppskattningsvis ':''}${pct(d.carShare)} av resorna${was(pct(d0.carShare))}; ${pct(d.activeShare)} går eller cyklar och ${pct(d.transitShare)} åker kollektivt.`,
      `The car is used for ${now?'an estimated ':''}${pct(d.carShare)} of trips${was(pct(d0.carShare))}; ${pct(d.activeShare)} walk or cycle and ${pct(d.transitShare)} take public transport.`),
    d.depave>.7?t('Gatorna i hela tätorten har blivit trädgårdar, och Storgatan är en bilfri affärsgata med odlingsbäddar, uteserveringar och lastcyklar framför de gamla skyltfönstren.','The streets throughout the town have become gardens, and Storgatan is a car-free shopping street with vegetable beds, outdoor cafés and cargo bikes in front of its old shop windows.')
    :d.depave>.35?t('Storgatan och torget är bilfria, med odlingsbäddar, uteserveringar och lastcyklar framför de gamla skyltfönstren, och parkeringarna har blivit parker och odlingar.','Storgatan and the square are car-free, with vegetable beds, outdoor cafés and cargo bikes in front of the old shop windows, and the car parks have become parks and gardens.')
    :d.depave>.1?t('Gatorna kring Storgatan och torget är gångfartsgator, och en del av asfalten har brutits upp för träd och planteringar.','The streets around Storgatan and the square are walking-pace streets, and some of the asphalt has been dug up for trees and planting.')
    :now?t('Storgatan är gångfartsgata, men riksväg 70 och järnvägen skiljer samhället från Siljan.','Storgatan is a walking-pace street, but national road 70 and the railway cut the town off from the lake.')
    :t('Gatorna ser ut ungefär som 2026, och riksväg 70 och järnvägen skiljer fortfarande samhället från Siljan.','The streets look much as they did in 2026, and national road 70 and the railway still cut the town off from the lake.'),
    d.depave>.35?t('Classic Car Week hålls numera i Rättviksparken och på travbanan i stället för i centrum.','Classic Car Week is now held at Rättviksparken and the trotting track instead of in the centre.')
    :now?t('Classic Car Week drar omkring 10 000 bilar till centrum vecka 31 – och delar orten.','Classic Car Week brings some 10,000 cars to the centre in week 31 – and divides the town.'):'',
    lvl('kollektivt')>L3?t(`Kollektivtrafiken är avgiftsfri, och ${d.aiCapacity>.45?'självkörande ':''}skyttlar går till varje by.`,`Public transport is free, and ${d.aiCapacity>.45?'self-driving ':''}shuttles run to every village.`)
    :lvl('kollektivt')>L2?t('Anropsstyrda skyttlar kör till byarna – Boda, Furudal och Vikarbyn – när någon behöver åka, och möter tågen.','On-demand shuttles run to the villages – Boda, Furudal and Vikarbyn – whenever someone needs to travel, and meet the trains.')
    :lvl('kollektivt')>L1?t('Bussarna går tätare, och cykelstråk löper runt Siljan.','The buses run more often, and cycle routes run round Lake Siljan.')
    :now?t('Bara drygt en tredjedel av invånarna tycker att kollektivtrafiken fungerar för vardagens resor.','Only just over a third of residents think public transport works for everyday trips.')
    :t('Bussarna till byarna går ungefär lika glest som 2026.','The buses to the villages run about as rarely as in 2026.'),
    lvl('forbindelser')>L3?t(`Tåget tar ${rt} till Stockholm${rt0}; direkttåg går varje timme, och nattåget mot kontinenten stannar i Rättvik.`,`The train takes ${rt} to Stockholm${rt0}; direct trains run every hour, and the night train to the Continent stops in Rättvik.`)
    :lvl('forbindelser')>L2?t(`Dalabanan är upprustad, och tåget tar ${rt} till Stockholm${rt0}.`,`The Dala line has been upgraded, and the train takes ${rt} to Stockholm${rt0}.`)
    :lvl('forbindelser')>L1?t(`Regionaltågen runt Siljan och till Borlänge går tätare, och tåget tar ${rt} till Stockholm${rt0}.`,`Regional trains round Lake Siljan and to Borlänge run more often, and the train takes ${rt} to Stockholm${rt0}.`)
    :t(`Tåget tar ${rt} till Stockholm${rt0}, men bara två tåg om dagen går direkt.`,`The train takes ${rt} to Stockholm${rt0}, but only two trains a day go direct.`),
    now?t(`Det finns ${Math.round(d.carsPer1000)} bilar per 1 000 invånare – i riket 475 – och ${pct(d.evShare)} av dem går på el.`,`There are ${Math.round(d.carsPer1000)} cars per 1,000 residents – 475 in Sweden as a whole – and ${pct(d.evShare)} of them are electric.`)
    :t(`${pct(d.evShare)} av bilarna går på el, och det finns ${Math.round(d.carsPer1000)} bilar per 1 000 invånare${was(Math.round(d0.carsPer1000))}.`,`${pct(d.evShare)} of cars are electric, and there are ${Math.round(d.carsPer1000)} cars per 1,000 residents${was(Math.round(d0.carsPer1000))}.`),
  ].filter(Boolean).join(' ')});

  // Community and democracy: the village halls and associations, the old who live alone, the young who
  // leave (research/deep/samhalle-halsa, kommun-plats-historia).
  const hours=Math.round(d.workHours),hours0=Math.round(d0.workHours);
  S.push({title:t('Gemenskap och demokrati','Community and democracy'),text:[
    t(`${pct(d.lowParticipation)} har lågt socialt deltagande${was(pct(d0.lowParticipation))} och ${pct(d.trust)} litar på andra människor.`,`${pct(d.lowParticipation)} have low social participation${was(pct(d0.lowParticipation))} and ${pct(d.trust)} trust other people.`),
    now?t('Färre känner sig ensamma än i Dalarna och i riket, och kommunen har 93 föreningar, 24 av dem bystugeföreningar.','Fewer feel lonely than in Dalarna and in Sweden as a whole, and the municipality has 93 associations, 24 of them village-hall associations.'):'',
    lvl('bogemenskap')>L2?t(`${pct(d.cohousing)} bor i generationshus eller andra bogemenskaper; i Generationshuset och i ekobyn i Persborg delar förskolebarn, unga och de äldsta trapphus och kök.`,`${pct(d.cohousing)} live in generation houses or other cohousing; in the Generation House and the eco-village at Persborg, preschoolers, young people and the oldest share stairwells and kitchens.`)
    :lvl('bogemenskap')>L1?t(`Nya hus byggs med gemensamma lokaler, och ${pct(d.cohousing)} bor i någon form av bogemenskap${was(pct(d0.cohousing))}.`,`New houses are built with shared rooms, and ${pct(d.cohousing)} live in some form of cohousing${was(pct(d0.cohousing))}.`)
    :now?t('De flesta bor i egna hus, nästan hälften av dem över 65 bor ensamma, och det finns inget kollektivhus i kommunen.','Most people live in houses of their own, almost half of those over 65 live alone, and there is no cohousing in the municipality.')
    :t('De flesta bor som 2026, i egna hus, och många av de äldre bor ensamma.','Most people live as they did in 2026, in houses of their own, and many of the old live alone.'),
    lvl('demokrati')>L3?t('Ett lottat medborgarråd sammanträder i Stiernhöökssalen och varje sommar vid Vasastenen, och Barnbarnsombudet prövar varje långsiktigt beslut mot dem som ännu inte är födda.','A citizens’ assembly chosen by lot meets in the Stiernhöök hall and every summer at Vasastenen, and the Grandchildren’s Ombudsman weighs every long-term decision against those not yet born.')
    :lvl('demokrati')>L2?t('Lottade medborgarråd ger råd i de stora frågorna, och byarna bestämmer själva över en del av budgeten.','Citizens’ assemblies chosen by lot give advice on the big questions, and the villages decide on part of the budget themselves.')
    :lvl('demokrati')>L1?t('Kommunen håller medborgardialoger i bystugorna.','The municipality holds citizens’ dialogues in the village halls.')
    :now?t('84 % röstade i kommunvalet 2026, lika många som 2022.','84% voted in the 2026 municipal election, the same as in 2022.'):'',
    `${t(`Arbetsveckan är ${hours} timmar${hours!==hours0?was(hours0):''}.`,`The working week is ${hours} hours${hours!==hours0?was(hours0):''}.`)}${lvl('arbetstid')>L2?t(' Den frigjorda tiden går till fäbodarna, spelmanslagen, bystugorna och tidsbanken.',' The time freed up goes to the summer farms, the fiddlers’ groups, the village halls and the time bank.'):''}`,
    now?'':d.lowParticipation>d0.lowParticipation+.02?t('Ensamheten har ökat sedan 2026: fler bor ensamma och mer av vardagen sker på skärm.','Loneliness has grown since 2026: more people live alone and more of everyday life happens on screens.')
      :d.lowParticipation<d0.lowParticipation-.02?t('Ensamheten har minskat sedan 2026.','Loneliness has fallen since 2026.'):'',
    now?t(`Rättviks kommun har ${int(d.pop)} invånare; det dör dubbelt så många som det föds, och två av tre unga tror att de kommer att flytta härifrån.`,`Rättvik Municipality has ${int(d.pop)} residents; twice as many die as are born, and two in three young people think they will move away.`)
    :t(`Rättviks kommun har ${int(near(d.pop,100))} invånare${was(int(d0.pop))}${d.pop>d0.pop+50?' – det är inflyttningen som får den att växa, för det dör fler än det föds':d.pop<d0.pop-50?' – det dör fler än det föds, och för få flyttar hit':''}.`,
      `Rättvik Municipality has ${int(near(d.pop,100))} residents${was(int(d0.pop))}${d.pop>d0.pop+50?' – it grows because people move in, since more die than are born':d.pop<d0.pop-50?' – more die than are born, and too few move in':''}.`),
    now?'':lvl('kunskap')>L2?t(`Naturbruket vid Stiernhööksgymnasiet är bygdens levande labb för fäbodar, skog och Siljan${d.pop>d0.pop?', och fler unga stannar kvar eller kommer tillbaka':''}.`,`The natural resource programme at Stiernhööksgymnasiet is the region’s living lab for summer farms, forest and Lake Siljan${d.pop>d0.pop?', and more young people stay or come back':''}.`)
      :lvl('kunskap')>L1?t('Ett lärcentrum vid stationen gör att man kan läsa vidare på distans utan att flytta.','A learning centre by the station lets people study further at a distance without moving away.')
      :t('Två av tre unga trodde 2026 att de skulle flytta härifrån, och utan lärcentrum eller högskola i bygden gör många det fortfarande.','Two in three young people thought in 2026 that they would move away, and with no learning centre or college locally, many still do.'),
  ].filter(Boolean).join(' ')});

  // Health and care in an old municipality (research/deep/samhalle-halsa, story.json).
  S.push({title:t('Hälsa och omsorg','Health and care'),text:[
    t(`Medellivslängden är ${dec(d.lifeExp,1)} år${was(dec(d0.lifeExp,1))}. ${pct(d.activity)} rör sig tillräckligt och ${pct(d.selfHealth)} anser sig ha god hälsa.`,`Life expectancy is ${dec(d.lifeExp,1)} years${was(dec(d0.lifeExp,1))}. ${pct(d.activity)} get enough exercise and ${pct(d.selfHealth)} rate their health as good.`),
    t(`${pct(d.share65)} av invånarna är 65 år eller äldre och ${pct(d.share80)} är 80 eller äldre${now?' – försörjningskvoten är bland de högsta i landet':` (2026: ${pct(d0.share65)} och ${pct(d0.share80)})`}.`,
      `${pct(d.share65)} of residents are 65 or older and ${pct(d.share80)} are 80 or older${now?' – the dependency ratio is among the highest in Sweden':` (2026: ${pct(d0.share65)} and ${pct(d0.share80)})`}.`),
    lvl('forebyggande')>L2?t('Den vanligaste ordinationen på Hälsotorget vid vårdcentralen är natur, rörelse och sällskap.','The most common prescription at the Health Square by the health centre is nature, movement and company.')
    :lvl('forebyggande')>L1?t('Vårdcentralen skriver ut fysisk aktivitet och natur på recept.','The health centre prescribes physical activity and time in nature.'):'',
    now?t('Hemtjänsten når allt fler, men hälften av de äldre som har hemtjänst besväras av ensamhet, och regionens vårdbuss till Furudal, Bingsjö och Boda, beslutad 2023, har ännu inte kommit.','Home care reaches more and more people, but half of the elderly who receive it are troubled by loneliness, and the region’s healthcare bus to Furudal, Bingsjö and Boda, decided in 2023, has still not come.')
    :d.welfare>1.08?t('Välfärden har mer resurser än 2026, trots att fler är gamla.','The welfare services have more resources than in 2026, even though more people are old.')
    :d.welfare<.975?t('Välfärden har mindre att röra sig med än 2026, samtidigt som fler är mycket gamla.','The welfare services have less room to manoeuvre than in 2026, while more people are very old.'):'',
  ].filter(Boolean).join(' ')});

  // The analogue and the accelerated: the screen-free childhood, the crafts in the church stables, the
  // Analogue House, AI (places.js).
  S.push({title:t('Det analoga och det accelererade','The analogue and the accelerated'),text:[
    lvl('analog')>L3?t('Barndomen är skärmfri till tolv år: böcker, slöjd och uteundervisning vid Siljan. I kyrkstallarna lär sig unga timring, smide och dräktsömnad. Kulturhuset är bygdens analoga hus med papperskopior av allt viktigt, och betalningar, journaler och larm fungerar också utan nät.',
      'Childhood is screen-free until twelve: books, crafts and outdoor lessons by Lake Siljan. In the church stables young people learn log building, smithing and folk-costume sewing. The culture house is the Analogue House with paper copies of everything important, and payments, medical records and alarms also work offline.')
    :lvl('analog')>L2?t('Barndomen är skärmfri till tolv år: böcker, slöjd och uteundervisning vid Siljan. I kyrkstallarna lär sig unga timring, smide och dräktsömnad, och kontanter och papper finns kvar som reserv.',
      'Childhood is screen-free until twelve: books, crafts and outdoor lessons by Lake Siljan. In the church stables young people learn log building, smithing and folk-costume sewing, and cash and paper are kept as a backup.')
    :lvl('analog')>L1?t('Skolan är mobilfri, och böckerna har kommit tillbaka i undervisningen.','School is phone-free, and books are back in the lessons.')
    :t('Nästan allt är digitalt, också reserven.','Almost everything is digital, even the backup.'),
    t(`${pct(d.youthScreen)} av 13–16-åringarna har mer än tre timmars skärmtid om dagen på fritiden${was(pct(d0.youthScreen))}.`,`${pct(d.youthScreen)} of 13–16-year-olds spend more than three hours a day on screens in their free time${was(pct(d0.youthScreen))}.`),
    lvl('ai')>L2?(d.aiGovernance>.6?t('AI har accelererat vården, elnätet, skogsbruket och odlingen – med öppna algoritmer, data i invånarnas ägo och människor som fattar besluten.','AI has accelerated healthcare, the power grid, forestry and farming – with open algorithms, data owned by the residents and people making the decisions.')
      :t('AI sköter mycket av vården och förvaltningen, men få vet hur besluten fattas, och vinsterna har hamnat hos få.','AI runs much of healthcare and public administration, but few know how the decisions are made, and the gains have gone to a few.'))
    :lvl('ai')>L1?t('AI prövas i vården, med människor som fattar besluten.','AI is being tried out in healthcare, with people making the decisions.')
    :t('AI används sparsamt och mest i beprövade verktyg.','AI is used sparingly, mostly in well-tested tools.'),
  ].join(' ')});

  // Lake Siljan's high water against the lowest streets, the shore below Kyrkudden, drinking water and
  // preparedness (research/deep/klimat-vatten). The lake is regulated: its everyday level stays, its high
  // water rises (model.js FLOOD).
  const streets=d0.protection;
  S.push({title:t('Vatten och beredskap','Water and preparedness'),text:[
    t(`Siljans hundraårsnivå ligger på ${now?'uppskattningsvis ':''}${dec(d.level100,2)} m ö.h.${was(`${dec(d0.level100,2)} m`)}, och de lägsta gatorna, Badhusgatan och Båthamnsvägen, ligger kring ${dec(streets,1)} m.`,
      `Lake Siljan’s 100-year level stands at ${now?'an estimated ':''}${dec(d.level100,2)} m above sea level${was(`${dec(d0.level100,2)} m`)}, and the lowest streets, Badhusgatan and Båthamnsvägen, lie at about ${dec(streets,1)} m.`),
    !now&&d.level100>d0.level100+.02?t('Sjöns vanliga nivå står kvar – regleringen håller den – men högvattnet stiger med blötare vintrar och höstar.','The lake’s normal level stays where it was – the regulation holds it – but the high water rises with wetter winters and autumns.'):'',
    d.floodShare>0?t(`Ett hundraårshögvatten når nu in på gatorna: ${pct(d.floodShare)} av centrum står under vatten, först kring Enåns mynning och Badhusgatan.`,`A 100-year high water now reaches the streets: ${pct(d.floodShare)} of the centre is under water, first around the mouth of the Enån and Badhusgatan.`)
    :d.protection>streets+.15?t(`${lvl('anpassning')>L2?'Höjda strandpromenader och plats för vattnet håller':'Höjda strandpromenader håller'} högvattnet borta från gatorna upp till ${dec(d.protection,1)} m – ${len(d.floodMargin)} över hundraårsnivån.`,`${lvl('anpassning')>L2?'Raised shore paths and room for the water keep':'Raised shore paths keep'} high water off the streets up to ${dec(d.protection,1)} m – ${len(d.floodMargin)} above the 100-year level.`)
    :d.floodMargin<.12?t(`Marginalen mellan hundraårsnivån och de lägsta gatorna är bara ${len(d.floodMargin)}${was(len(d0.floodMargin))}.`,`The margin between the 100-year level and the lowest streets is only ${len(d.floodMargin)}${was(len(d0.floodMargin))}.`)
    :t(`Ett hundraårshögvatten når ${now?'redan stranden och nästan halva campingen':'stranden och campingens lägre delar'}, men inte gatorna.`,`A 100-year high water ${now?'already reaches the beach and almost half the campsite':'reaches the beach and the lower parts of the campsite'}, but not the streets.`),
    lvl('anpassning')>L3?t('Campingen har flyttat upp från stranden, varje by tar hand om sitt eget regnvatten, och nya hus byggs över 165 meter, som i Leksand.','The campsite has moved up from the beach, every village handles its own rainwater, and new houses are built above 165 metres, as in Leksand.')
    :lvl('anpassning')>L2?t('Campingen har flyttat upp från stranden, och våtmarker och skyfallsytor tar emot regnet när det öser ner.','The campsite has moved up from the beach, and wetlands and cloudburst parks take the rain when it pours.')
    :lvl('anpassning')>L1?t('Skyfallsytor tar emot regnet i de mest utsatta kvarteren.','Cloudburst parks take the rain in the most exposed neighbourhoods.')
    :now?t('Skyfallen när ovädret Hans drog in 2023 skadade omkring 150 hus, och det finns ingen skyfallskarta för hela samhället.','The cloudbursts when Storm Hans struck in 2023 damaged some 150 houses, and there is no cloudburst map for the whole town.')
    :d.stress>.3?t('Skyfallen har blivit kraftigare, och samhället har inte byggts om för dem.','Cloudbursts have grown heavier, and the town has not been rebuilt for them.'):'',
    // Kyrkudden: adaptation costs at most heritageCost × its implementation (model.js); anything more is a
    // high water that got in among the church stables (events.js).
    d.heritage<1-(PARAMS.heritageCost||0)*lvl('anpassning')-.01?t('Kyrkudden med kyrkan och Vasastenen står kvar, men högvattnet har stått in bland kyrkstallarna, och några av dem har tagit skada.','Kyrkudden, with the church and Vasastenen, still stands, but high water has got in among the church stables, and some of them have been damaged.')
    :d.heritage<.985?t('Kyrkudden med kyrkan, de 87 kyrkstallarna och Vasastenen står kvar, men höjda strandkanter har förändrat den öppna stranden nedanför.','Kyrkudden, with the church, the 87 church stables and Vasastenen, still stands, but raised shore edges have changed the open shore below.')
    :now?t('Kyrkudden med kyrkan, de 87 kyrkstallarna och Vasastenen är riksintresse för kulturmiljövården, och stranden nedanför är öppen.','Kyrkudden, with the church, the 87 church stables and Vasastenen, is of national interest for cultural heritage, and the shore below is open.')
    :t('Kyrkudden med kyrkan och de 87 kyrkstallarna ser ut som 2026, och stranden nedanför är lika öppen.','Kyrkudden, with the church and the 87 church stables, looks as it did in 2026, and the shore below is just as open.'),
    now?t(`Dricksvattnet kommer ur grundvattnet i Gärdsjö, och nästan fyra av tio har egen brunn; ett torrt år finns uppskattningsvis ${pct(d.waterMargin)} mer vatten än kommunen behöver.`,`Drinking water comes from the groundwater at Gärdsjö, and almost four in ten have their own well; in a dry year there is an estimated ${pct(d.waterMargin)} more water than the municipality needs.`)
    :d.waterMargin<0?t(`Ett torrt år räcker inte vattnet: vattentäkterna ger ${pct(-d.waterMargin)} mindre än kommunen behöver (2026: uppskattningsvis ${pct(d0.waterMargin)} mer), och det blir bevattningsförbud ${pct(d.restrictions)} av somrarna.`,`In a dry year the water runs short: the water sources give ${pct(-d.waterMargin)} less than the municipality needs (2026: an estimated ${pct(d0.waterMargin)} more), and ${pct(d.restrictions)} of summers bring a ban on watering.`)
    :d.waterMargin<.1?t(`Vattnet räcker knappt ett torrt år – marginalen är ${pct(d.waterMargin)} (2026: uppskattningsvis ${pct(d0.waterMargin)}).`,`The water barely lasts a dry year – the margin is ${pct(d.waterMargin)} (2026: an estimated ${pct(d0.waterMargin)}).`)
    :t(`Även ett torrt år finns ${pct(d.waterMargin)} mer vatten än kommunen behöver (2026: uppskattningsvis ${pct(d0.waterMargin)}).`,`Even in a dry year there is ${pct(d.waterMargin)} more water than the municipality needs (2026: an estimated ${pct(d0.waterMargin)}).`),
    lvl('beredskap')>L3?t('Bygden är byggd för att klara sig själv i en kris: lager av mat, en andra vattentäkt och ett elnät som kan köras i ö-drift.','The community is built to manage on its own in a crisis: food stocks, a second water source and a grid that can run in island mode.')
    :lvl('beredskap')>L2?t('Kommunen har en andra vattentäkt, lager för en månad och ett elnät som kan köras i ö-drift om stamnätet faller.','The municipality has a second water source, stocks for a month and a grid that can run in island mode if the national grid fails.')
    :lvl('beredskap')>L1?t('Kommunen har nödlager och en plan för nödvatten.','The municipality has emergency stocks and an emergency water plan.'):'',
    t(`${pct(d.homePrepared)} av hushållen klarar en vecka på egen hand${was(pct(d0.homePrepared))}.`,`${pct(d.homePrepared)} of households can manage a week on their own${was(pct(d0.homePrepared))}.`),
  ].filter(Boolean).join(' ')});

  // Lake Siljan and the summer town: the lake's health and boats, the people of a July day, the visitors
  // (research/deep/klimat-vatten, turism-ekonomi, samhalle-halsa).
  const hav=lvl('hav');
  S.push({title:t('Siljan och sommarorten','Lake Siljan and the summer town'),text:[
    d.waters>=.85&&hav>L2?t(`Siljan har nått god ekologisk status${year>2033?' – målet var att nå dit till 2033':''}.`,`Lake Siljan has reached good ecological status${year>2033?' – the target was to get there by 2033':''}.`)
    :d.waters>=.6?(hav>L1?t('Siljan är på väg mot god ekologisk status (2026: måttlig).','Lake Siljan is on its way to good ecological status (2026: moderate).')
      :t('Siljan mår bättre än 2026, men dammarna och regleringen håller fortfarande nere dess ekologiska status.','Lake Siljan is healthier than in 2026, but the dams and the regulation still hold back its ecological status.'))
    :d.waters>=d0.waters-.03?(now?t('Siljans vatten är näringsfattigt och klart, men den ekologiska statusen är bara måttlig: dammarna och regleringen har stängt ute öringen från nästan alla dess lekplatser.','Lake Siljan’s water is clear and low in nutrients, but its ecological status is only moderate: the dams and the regulation have shut the trout out of almost all its spawning grounds.')
      :hav>L1?t('Siljans ekologiska status är fortfarande måttlig – sjön svarar långsamt.','Lake Siljan’s ecological status is still moderate – the lake responds slowly.')
      :t('Siljans ekologiska status är måttlig, som 2026: dammarna och regleringen stänger fortfarande ute öringen från de flesta lekplatserna.','Lake Siljan’s ecological status is moderate, as in 2026: the dams and the regulation still shut the trout out of most of its spawning grounds.'))
    :t('Siljan mår sämre än 2026 i det varmare klimatet.','Lake Siljan is in worse health than in 2026 in the warmer climate.'),
    hav>L3?t('Sjön regleras numera för livet i den och inte bara för kraften, och harr och öring vandrar fritt i åarna igen.','The lake is now regulated for the life in it, not only for the power, and grayling and trout migrate freely in the rivers again.')
    :hav>L2?t('Stränderna är återställda, och harr och öring kan vandra förbi dammarna i åarna igen.','The shores have been restored, and grayling and trout can get past the dams in the rivers again.')
    :hav>L1?t('Våtmarker och skyddszoner längs åarna fångar näring och slam innan det når sjön.','Wetlands and buffer zones along the rivers catch nutrients and silt before they reach the lake.'):'',
    now?t('Inget av 26 badvattenprov vid Siljansbadet 2023–2026 visade algblomning, och isen ligger i dag omkring 74 dagar per vinter, mot 129 i slutet av 1800-talet.','None of 26 bathing-water samples at Siljansbadet in 2023–2026 showed algal blooms, and the ice now lasts about 74 days a winter, against 129 in the late 1800s.')
    :d.bloom<.16?t('Badvattnet vid Siljansbadet är klart, utan algblomning.','The bathing water at Siljansbadet is clear, with no algal blooms.')
    :d.bloom<.25?t('Varma somrar syns ibland algblomning i grunda vikar, men vid Siljansbadet är vattnet klart.','In warm summers algal blooms sometimes appear in shallow bays, but the water at Siljansbadet is clear.')
    :t('Algblomning återkommer i de grunda vikarna varma somrar – något som inte fanns i proven 2023–2026.','Algal blooms recur in the shallow bays in warm summers – something not seen in the samples of 2023–2026.'),
    now?'':t(`${pct(d.boatElectric)} av båttrafiken på Siljan går på el${lvl('kollektivt')>L2&&d.boatElectric>.5?' – eldrivna båtbussar går från Långbryggan till Leksand, Mora och Siljansnäs':''}.`,`${pct(d.boatElectric)} of boat traffic on Lake Siljan is electric${lvl('kollektivt')>L2&&d.boatElectric>.5?' – electric boat buses run from Långbryggan to Leksand, Mora and Siljansnäs':''}.`),
    Number.isFinite(d.summerPeople)?t(`En julidag är omkring ${int(near(d.summerPeople,100))} människor i kommunen${was(int(near(d0.summerPeople,100)))}, ${pct(d.summerPeople/d.pop-1)} fler än på hösten${now?` – många i de ${int(2980)} fritidshusen – och på Classic Car Weeks lördag tre gånger så många som vanligt`:''}.`,
      `On a July day some ${int(near(d.summerPeople,100))} people are in the municipality${was(int(near(d0.summerPeople,100)))}, ${pct(d.summerPeople/d.pop-1)} more than in autumn${now?` – many in the ${int(2980)} second homes – and on the Saturday of Classic Car Week three times as many as usual`:''}.`):'',
    Number.isFinite(d.guestNights)?(now?t(`Besökarna stannar ${int(near(d.guestNights,1000))} nätter om året på kommunens hotell, stugbyar och campingar, mer än hälften av dem på camping; 2019 var det ${int(281000)}.`,
        `Visitors stay ${int(near(d.guestNights,1000))} nights a year in the municipality’s hotels, cabins and campsites, more than half of them at campsites; in 2019 it was ${int(281000)}.`)
      :t(`Besökarna stannar ${int(near(d.guestNights,1000))} nätter om året på kommunens hotell, stugbyar och campingar${was(int(near(d0.guestNights,1000)))}.`,`Visitors stay ${int(near(d.guestNights,1000))} nights a year in the municipality’s hotels, cabins and campsites${was(int(near(d0.guestNights,1000)))}.`)):'',
    now?t(`Dalhalla, i det gamla kalkbrottet, har omkring ${int(120000)} konsertbesökare om sommaren.`,`Dalhalla, in the old limestone quarry, has some ${int(120000)} concert-goers each summer.`):'',
    !now&&year>2050&&d.gwl>2.2?t('Med varmare somrar har säsongen blivit längre – stranden, campingarna och Dalhalla har gäster från maj till september – medan vintrarna med säker is på Siljan har blivit färre.','With warmer summers the season has grown longer – the beach, the campsites and Dalhalla have guests from May to September – while winters with safe ice on Lake Siljan have become fewer.'):'',
    Number.isFinite(d.touristCar)?(d.touristCar<.85?t(`${pct(1-d.touristCar)} av besökarna kommer med tåg, buss eller cykel${was(pct(1-d0.touristCar))}.`,`${pct(1-d.touristCar)} of visitors arrive by train, bus or bike${was(pct(1-d0.touristCar))}.`)
      :t(`${pct(d.touristCar)} av besökarna kommer med bil${was(pct(d0.touristCar))}.`,`${pct(d.touristCar)} of visitors come by car${was(pct(d0.touristCar))}.`)):'',
  ].filter(Boolean).join(' ')});
  return S;
}
