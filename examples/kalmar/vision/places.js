import { LANG, L } from '@engine/i18n.js';
// Named places on and around Kvarnholmen. Coordinates are model metres (x east, z south; Stortorget
// near the origin); real buildings sit on their OpenStreetMap footprint (tools/import-addresses.mjs
// uses the same projection). Today's places are real; future places (`lever`) appear when the city has chosen
// them and are written as plausible proposals, not existing plans.
export const PLACES=[
  {id:'stortorget',name:'Stortorget',x:24,z:-8,kind:'torg',work:true,
    now:'Kalmars stora torg, ritat på 1650-talet när staden flyttades till Kvarnholmen.',
    future:'Torghandel med mat från slätten varje dag och långbord där grannar äter tillsammans.',lever:'bogemenskap'},
  {id:'domkyrkan',name:'Kalmar domkyrka',x:10,z:-48,kind:'kulturarv',
    now:'Nicodemus Tessin d.ä:s barockkyrka, invigd 1703.',future:'Står kvar som den alltid gjort, fredad från både solceller och klätterväxter.'},
  {id:'radhuset',name:'Rådhuset – Medborgarrådet',x:73,z:-36,kind:'demokrati',work:true,lever:'demokrati',
    now:'Rådhuset vid Stortorget.',future:'Här sammanträder det lottade medborgarrådet och Barnbarnsombudet, som granskar varje långsiktigt beslut ur kommande generationers perspektiv.'},
  {id:'generationshuset',name:'Generationshuset',x:-95,z:-140,kind:'gemenskap',care:true,lever:'bogemenskap',
    now:'Ett vanligt bostadskvarter.',future:'Ett flergenerationsboende: förskola i bottenvåningen, seniorer och studenter på samma trapphus, kvarterskök för alla.'},
  {id:'biblioteket',name:'Stadsbiblioteket – Det analoga huset',x:-391,z:-367,kind:'analog',library:true,lever:'analog',
    now:'Kalmar stadsbibliotek vid Tullslätten.',future:'Mobilfritt hus med böcker, verkstäder, schack, radio och papperskopior av allt viktigt – stadens analoga reserv.'},
  {id:'halsotorget',name:'Hälsotorget',x:-205,z:4,kind:'halsa',work:true,lever:'forebyggande',
    now:'Butiker längs Storgatan.',future:'Vårdcentral, gym, kurator och AI-stödd diagnostik under samma tak – med naturrecept som vanligaste ordination.'},
  {id:'stationen',name:'Kalmar C',x:-438,z:87,kind:'rorlighet',work:true,lever:'forbindelser',
    now:'Järnvägsstation och bussterminal med 70 tågrörelser om dygnet: Växjö på 67 minuter, Köpenhamn på 3 h 44, Stockholm på omkring 4 h 30 med byte. Stångådalsbanan mot Linköping har ingen el.',future:'Direkttåg till Stockholm på under fyra timmar, nattåg till Europa – och spårvagnen ut över den nya Ölandsbron.'},
  {id:'linne',name:'Linnéuniversitetet',x:-470,z:285,kind:'kunskap',work:true,lever:'kunskap',
    now:'Campus Universitetskajen vid Kalmar C, invigt 2021: sex hus, cirka 6 000 helårsstudenter och Sjöfartshögskolan. Hyresavtalen för halva campus löper ut 2028 och 2030 (ungefärligt läge).',future:'Kalmarsund som levande labb med skolklasser och fiskare, Östersjöforskning och Sjöfartshögskolans testbädd för fossilfria fartyg.'},
  {id:'olandsbron',name:'Ölandsbron',x:2258,y:52,z:-772,kind:'rorlighet',lever:'kollektivt',
    now:'6 072 meter, invigd 1972, med 36 meter fritt för fartygen under högbron. 15 000 fordon om dygnet, 25 000 på sommaren; gång och cykel förbjudet sedan 2009. Renoveras 2027–2030 och ska hålla till minst 2075.',future:'En ny bro med spårväg och vindskyddad cykelbana, och Ölandsleden höjd över havet: 20 minuter med spårvagn från Kalmar C till Färjestaden.'},
  {id:'skolan',name:'Skolan på Kvarnholmen',x:-150,z:40,kind:'skola',school:true,lever:'analog',
    now:'Skola i stadskärnan (ungefärligt läge).',future:'Skärmfritt till tolv års ålder: böcker, slöjd, uteundervisning i matparken – och AI som lärarens verktyg, inte barnens.'},
  {id:'gymnasiet',name:'Gymnasiet',x:-60,z:-190,kind:'skola',school:true,
    now:'Gymnasieskola (ungefärligt läge).',future:'Ett år av medborgartjänst efter studenten: omsorg, odling eller beredskap.'},
  {id:'museet',name:'Kalmar läns museum',x:271,z:106,kind:'kulturarv',work:true,
    now:'Länsmuseet i Ångkvarnen vid Skeppsbron.',future:'Visar hur Kalmar klarade de stora stormflodarna – och vad som gick förlorat.'},
  {id:'beredskap',name:'Beredskapsförrådet',x:-520,z:-150,kind:'beredskap',work:true,lever:'beredskap',
    now:'Industrimark.',future:'Kommunens lager: mat för 30–90 dagar, vattenrening, reservkraft och radio. Övas varje höst.'},
  {id:'slottet',name:'Kalmar slott',x:-865,z:300,kind:'kulturarv',
    now:'Renässansslottet, byggt om under Vasakungarna.',future:'Står på sin holme – med vatten allt närmare vallarna.'},
  {id:'vallen',name:'Sundsvallen',x:300,z:120,kind:'anpassning',lever:'anpassning',
    now:'Kajkanten mot Kalmarsund.',future:'En promenad på skyddsvallen runt Kvarnholmen, 1–2 m över dagens kajer.'},
  {id:'musslor',name:'Musselodlingarna',x:720,z:-250,kind:'hav',lever:'hav',
    now:'Öppet vatten i Kalmarsund.',future:'Musslor och sjögräs som tar upp kväve och fosfor ur sundet – och blir foder och gödsel.'},
  {id:'vindparken',name:'Södra Kalmarsunds vindpark',x:2800,z:-600,kind:'energi',lever:'vind',
    now:'Kårehamn utanför Öland producerar redan havsvind.',future:'En invånardelägd havsvindpark som gör Kalmar till en energiexportör.'},
];

if(LANG==='en')for(const p of PLACES){p.name=L(p.name);p.now=L(p.now);if(p.future)p.future=L(p.future);}
