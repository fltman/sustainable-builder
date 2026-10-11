// Släkten Vianello: one family in Castello, by Campo Santa Maria Formosa, followed through five generations –
// the family that stayed when the neighbours moved to the mainland. Nives was eleven when the acqua granda of
// 4 November 1966 filled the ground floor and her father drew a pencil line on the wall of the hall where the water
// stopped; her granddaughter Matilde is seven in 2026 and, if Venice takes care of its people, walks over the
// bridge to the Salute on 21 November 2126, aged 107. Their lives follow Venice's own model (model.js) and the
// levers the player chooses: how long they live (life expectancy, friends to count on), whether the old have
// company and can cross the bridges (Att bli gammal i Venedig: care, ramps), who finds a home in the historic city
// and who leaves for Mestre (Hem för venetianer, Turistlägenheterna: homes held for residents, flats back from the
// tourists, prices, empty homes), what they work with (the lagoon's marshes, its forecasts, the knowledge city, the
// boats), how hot the campo is in July (Svalka i campi), how often MOSE shuts the lagoon and whether the water
// comes into the hall again. Today's facts are from research/deep (1966 and 2019, the exodus, the rents and the
// students, the Ospedale Civile, the gondoliers and their licences, the traghetti, the Fondaco, the Salute and the
// Redentore); every other number is the model's. Swedish here; the static sentences go through L() (English in
// en/family.js, Italian in it/family.js), the sentences built from numbers are written in all three with t().
import { t, L, int, dec, pct } from '@engine/i18n.js';
import { CITY } from '@engine/city-config.js';
import { BASE } from './model.js';

// Homes are real residential buildings in the model (OpenStreetMap, metres from 45.435 N 12.3375 E, x east,
// z south): the house on Campo Santa Maria Formosa (Castello 5229–5239), where Matilde's line lives on; Marco
// and Chiara's flat on Calle Longa Santa Maria Formosa (by Castello 5183); Giulia's on Ramo Grimani (4860).
const CAMPO={x:320,z:-282},CALLE_LONGA={x:368,z:-300},GRIMANI={x:350,z:-196};
// Nives and her late husband Toni, a gondolier; their children Paola (who moved to Mestre) and Marco (a
// gondolier like his father), Marco's wife Chiara, a nurse; Paola's daughter Giulia, who studies the lagoon,
// and Marco's daughter Matilde; then Giulia's son Elia, Matilde's children Bianca and Nicolò, and their
// children Nina, Zeno and Ottavia. Matilde's line keeps her surname. `span` is a personal margin on the
// model's life expectancy (below).
export const FAMILY=[
  {id:'nives',first:'Nives',last:'Vianello',birth:1955,female:true,shirt:0x8e44ad,span:4,home:CAMPO},
  {id:'paola',first:'Paola',last:'Vianello',birth:1977,female:true,shirt:0x2a78d6,span:-1,home:CAMPO},
  {id:'marco',first:'Marco',last:'Vianello',birth:1980,female:false,shirt:0x1f3a5f,span:-4,home:CALLE_LONGA},
  {id:'chiara',first:'Chiara',last:'Penzo',birth:1983,female:true,shirt:0x16a085,span:0,home:CALLE_LONGA},
  {id:'giulia',first:'Giulia',last:'Favaretto',birth:2005,female:true,shirt:0x27ae60,span:2,home:GRIMANI},
  {id:'matilde',first:'Matilde',last:'Vianello',birth:2019,female:true,shirt:0xc0392b,span:19,home:CALLE_LONGA},
  {id:'elia',first:'Elia',last:'Favaretto',birth:2038,female:false,shirt:0xf39c12,span:-2,home:GRIMANI},
  {id:'bianca',first:'Bianca',last:'Vianello',birth:2047,female:true,shirt:0xf1c40f,span:2,home:CAMPO},
  {id:'nicolo',first:'Nicolò',last:'Vianello',birth:2053,female:false,shirt:0x34495e,span:0,home:CAMPO},
  {id:'nina',first:'Nina',last:'Favaretto',birth:2075,female:true,shirt:0x1abc9c,span:3,home:GRIMANI},
  {id:'zeno',first:'Zeno',last:'Vianello',birth:2081,female:false,shirt:0xe67e22,span:1,home:CAMPO},
  {id:'ottavia',first:'Ottavia',last:'Vianello',birth:2098,female:true,shirt:0xd35400,span:2,home:CAMPO},
];
const BORN=Object.fromEntries(FAMILY.map(m=>[m.id,m.birth])),MEMBER=Object.fromEntries(FAMILY.map(m=>[m.id,m]));
const at=(run,y)=>run.years[Math.max(0,Math.min(run.years.length-1,y-2026))];

// The turns of their lives, each read from the run in the decade it happens in, so that the journey never tells
// of a choice not yet made – from the year before the decade begins, which that decade's choices cannot change (a
// choice made in 2036 already moves 2036), so that a later decade never contradicts an earlier one.
// Nives moves into the Fondaco dei Tedeschi – homes for young and old round its courtyard (places.js), what Hem
// för venetianer builds from its second level ("generationshus och kök vid campot") – if that work is well under
// way by 2036.
const nivesMoved=run=>at(run,2035).I.bogemenskap>.35;
// Otherwise company at home: neighbours to count on (friends) or care that looks in on the old (forebyggande).
const nivesCompany=run=>{const a=at(run,2035);return nivesMoved(run)||a.ind.friends>.72||a.I.forebyggande>.4;};
// Year of death from the model's life expectancy when each member is 70 (at the earliest 2035, so that the first
// decade's choices count for the old too), plus a personal margin; the model's figure is for both sexes (women
// 86.4 years in the province, men 82.2), so the men's margins are lower. Nives lives some years longer with company
// than alone (social ties and survival: the engine's evidence holt_lunstad).
export function lifespans(run){
  const out={},company=nivesCompany(run);
  for(const m of FAMILY){
    const le=at(run,Math.min(2126,Math.max(2035,m.birth+70))).ind.lifeExp;
    out[m.id]=Math.round(m.birth+le+m.span+(m.birth<2000?-1:0)+(m.id==='nives'&&company?4:0));
  }
  return out;
}
export function alive(m,year,spans){return year>=m.birth&&year<spans[m.id];}

const join=(...parts)=>parts.filter(Boolean).join(' ');
const hundreds=v=>int(Math.round(v/100)*100);
// What Giulia leaves behind: seventy years of notes on the lagoon, by the work she did.
const notebooks=run=>['barene','lab'].includes(giuliaWork(run))?L('Hennes anteckningsböcker om barene, sjuttio år av mätningar, står i biblioteket på San Giorgio.'):L('Hennes anteckningar om tidvattnet och MOSE:s stängningar, sjuttio år av mätningar, står i biblioteket på San Giorgio.');
// The train to Rome as the key figures show it, to the nearest five minutes.
const rail=h=>{const m=Math.round(h*12)*5,a=Math.floor(m/60),b=m%60;return t(b?`${a} timmar och ${b} minuter`:`${a} timmar`,b?`${a} hours ${b} minutes`:`${a} hours`,b?`${a} ore e ${b} minuti`:`${a} ore`);};
// Small numbers in words ("fyra av tio").
const word=n=>t(['ingen','en','två','tre','fyra','fem','sex','sju','åtta','nio','tio'][n],['no','one','two','three','four','five','six','seven','eight','nine','ten'][n],['nessuna','una','due','tre','quattro','cinque','sei','sette','otto','nove','dieci'][n]);
// Italian articles before a percentage: "l'8%", "l'11%", "il 37%".
const il=p=>(/^(8|11\D|1\D)/.test(p)?"l'":'il ')+p;

// Giulia studies the lagoon; by 2036 she works with it the way the city lets her: building salt marshes (Levande
// lagun), making the tide forecasts with AI, in the living lab on San Giorgio (Kunskap och hantverk), or counting
// MOSE's closures.
const giuliaWork=run=>{const I=at(run,2035).I;return I.hav>.25?'barene':I.ai>.4?'tide':I.kunskap>.25?'lab':'mose';};
// She rents a flat in the historic city by 2036 if flats have come back from the tourists or the city has begun to
// house its own people.
const giuliaIn=run=>{const a=at(run,2035);return a.ind.shortLetHomes<.85*BASE.shortLetHomes||a.I.bogemenskap>.25||a.ind.emptyHomes<.33;};
// Matilde, 27 in 2046, stays if a young family can find a home it can pay for: homes held for residents, prices
// below today's, few empty homes – or a city that keeps its people.
const matildeStays=run=>{const a=at(run,2045),d=a.ind;return a.I.bogemenskap>.5||d.housePrice<.97*BASE.housePrice||d.emptyHomes<.3||d.attract>.75;};
// Paola comes back to the campo by 2046 if homes have come back to the residents.
const paolaBack=run=>{const a=at(run,2045);return a.ind.emptyHomes<.3||a.I.bogemenskap>.6;};
// The flat on the campo after Nives: Paola's, Matilde's, or let to visitors (sold as a second home where short lets
// are no longer allowed in residential buildings).
const houseFate=run=>paolaBack(run)?'paola':matildeStays(run)?'matilde':'let';
// Bianca, 19 in 2066, stays if Venice is a place to stay in or its university a reason to; if she leaves for
// Milan she comes back by 2076 if the city has become one.
const biancaStays=run=>{const a=at(run,2065);return a.ind.attract>.7||a.I.kunskap>.6;};
const biancaBack=run=>biancaStays(run)||at(run,2075).ind.attract>.75;

// Ottavia, 18 in 2116, stays (or moves in from Mestre) if the city keeps its young: a city that holds its people, or
// knowledge jobs and work to be had.
const ottaviaStays=run=>{const a=at(run,2115);return a.ind.attract>.8||(a.I.kunskap>.5&&a.ind.unemployment<.05);};

// The pencil lines in the hall of the house on the campo: 194 cm in 1966, 187 cm in 2019. The campo by the house
// lies at about 1.38 m (the model's terrain: Regione del Veneto's DTM, calibrated on the Comune's walkway heights),
// so in 1966 the water stood more than half a metre deep in the hall. The water in the city in a storm of the
// chronicle (events.js) is what MOSE lets in, as the flood badge draws it: the lagoon behind the closed gates.
const HALL=1.38;
const waterIn=(run,e)=>{const d=at(run,e.year).ind;return e.level>d.barrierCloses?Math.min(e.level,d.barrierInside):e.level;};
// The highest water in the city among the chronicle's floods in [from, to).
const worstFlood=(run,from,to)=>{let w=null;for(const e of run.chronicle)if(e.level!=null&&e.year>=from&&e.year<to){const x=waterIn(run,e);if(!w||x>w.x)w={year:e.year,x,P:at(run,e.year).ind.protection};}return w;};
// The year the water came into the hall again (0: not before `year`).
const newLine=(run,year)=>{for(const e of run.chronicle)if(e.level!=null&&e.year<year){const x=waterIn(run,e);if(x>HALL+.02&&x>at(run,e.year).ind.protection)return e.year;}return 0;};
// The decade's news from the hall: a third line, or the storm that came closest without one.
const hallNews=(run,year)=>{
  const f=worstFlood(run,year-10,year);if(!f)return '';
  const away=year>=2046&&!matildeStays(run);
  if(f.x>HALL+.02&&f.x>f.P){const cm=Math.round((f.x-HALL)*100);return t(
    `År ${f.year} kom vattnet in i entrén vid campot igen, fast MOSE var uppe: lagunen bakom luckorna hade stigit till ${dec(f.x,2)} m. Matilde${away?' kom över från Mestre och':''} drog ett tredje streck, ${cm<=12?'en handsbredd':`${cm} cm`} över golvet.`,
    `In ${f.year} the water came into the hall on the campo again, although MOSE was up: the lagoon behind the gates had risen to ${dec(f.x,2)} m. Matilde${away?' came over from Mestre and':''} drew a third line, ${cm<=12?"a hand's breadth":`${cm} cm`} above the floor.`,
    `Nel ${f.year} l'acqua è entrata di nuovo nell'androne in campo, anche con il MOSE alzato: la laguna dietro le paratoie era salita a ${dec(f.x,2)} m. Matilde${away?' è venuta da Mestre e':''} ha tracciato una terza riga, ${cm<=12?'a un palmo':`a ${cm} cm`} dal pavimento.`);}
  if(f.x>f.P&&HALL-f.x<.3){const cm=Math.max(5,Math.round((HALL-f.x)*20)*5);return t(
    `I stormen ${f.year} stod lagunen bakom MOSE på ${dec(f.x,2)} m. Markusplatsen och de lägsta gränderna gick under, men vattnet stannade ${cm} cm under tröskeln till entrén vid campot, och inget nytt streck behövdes.`,
    `In the storm of ${f.year} the lagoon behind MOSE stood at ${dec(f.x,2)} m. St Mark's Square and the lowest alleys went under, but the water stopped ${cm} cm below the threshold of the hall on the campo, and no new line was needed.`,
    `Nella mareggiata del ${f.year} la laguna dietro il MOSE è arrivata a ${dec(f.x,2)} m. Piazza San Marco e le calli più basse sono finite sott'acqua, ma l'acqua si è fermata ${cm} cm sotto la soglia dell'androne in campo, e non è servita nessuna riga nuova.`);}
  return '';
};

// A paragraph per decade, written from the state at the start of that decade: the end of the year before, which the
// decade's own choices have not yet moved (so the journey's page and the Family tab tell the same story, and "last
// season" is last year's).
export function familyText(year,run){
  const r=at(run,year-1),d=r.ind,I=r.I,spans=lifespans(run),W=run.world||{};
  const age=id=>year-BORN[id],is=id=>alive(MEMBER[id],year,spans),lived=id=>spans[id]-BORN[id];
  const died=id=>{const m=MEMBER[id];return t(`${m.first} dog ${spans[id]}, ${lived(id)} år gammal.`,`${m.first} died in ${spans[id]}, aged ${lived(id)}.`,`${m.first} è ${m.female?'morta':'morto'} nel ${spans[id]}, a ${lived(id)} anni.`);};
  // Died in the decade just gone.
  const lately=id=>!is(id)&&spans[id]>year-10?died(id):'';
  // What tested Venice in the decade just gone (events.js), as the family remembers it; the wording alternates
  // so that two events in a decade, or the same verdict decade after decade, do not repeat.
  const evText=run.chronicle.filter(e=>e.year<year&&e.year>=year-10).map((e,i)=>{
    const k=e.good||e.severity<.3?0:e.severity<.6?1:2,v=(i+(year-2026)/10)%2;
    return t(`${e.title} ${e.year} – ${[['Venedig klarade det bra.','staden höll ihop.'],['det satte spår, också i familjen.','det kändes i hela staden.'],['det slog hårt mot hela staden.','familjen minns det som en svår tid.']][k][v]}`,
      `${e.title}, ${e.year} – ${[['Venice came through well.','the city held together.'],['it left a mark, on the family too.','the whole city felt it.'],['it hit the whole city hard.','the family remembers it as a hard time.']][k][v]}`,
      `${e.title}, ${e.year} – ${[['Venezia ne è uscita bene.','la città ha tenuto.'],['ha lasciato il segno, anche in famiglia.','in tutta la città se n\'è sentito il peso.'],['ha colpito duramente tutta la città.','per la famiglia è stato un periodo difficile.']][k][v]}`);
  }).join(' ');
  // The bridges: 95 % had steps in 2026 (232 of the 244 in the model's square); ramps and the "gradino agevolato"
  // (forebyggande) make some step-free.
  const stepFree=1-d.steppedBridges;
  switch(year){
    case 2026:return t(
      `Nives Vianello, ${age('nives')}, bor ensam en trappa upp i huset vid Campo Santa Maria Formosa. Den 4 november 1966 var hon elva. Vattnet nådde 194 cm vid Punta della Salute, familjen bodde i bottenvåningen, och hennes pappa drog ett blyertsstreck på väggen där vattnet stannade. Grannarna flyttade till Mestre – den historiska staden hade ${int(121309)} invånare 1966 och har ${int(47625)} i dag – men familjen flyttade upp en trappa och stannade. Bredvid strecket finns ett till: 12 november 2019, 187 cm. Sedan 2020 reser sig MOSE mot de högsta tidvattnen, 49 gånger förra säsongen. Sonen Marco är gondoljär som sin far Toni, hans fru Chiara är sjuksköterska på Ospedale Civile, och deras dotter Matilde, ${age('matilde')}, vill lära sig ro stående. Nives dotter Paola bor i Mestre, där bostäderna kostar en dryg tredjedel så mycket. Paolas dotter Giulia, ${age('giulia')}, läser om lagunen vid Ca' Foscari och pendlar över Ponte della Libertà – bara var fjärde student klarar hyran själv.`,
      `Nives Vianello, ${age('nives')}, lives alone on the first floor of the house on Campo Santa Maria Formosa. On 4 November 1966 she was eleven. The water reached 194 cm at Punta della Salute, the family lived on the ground floor, and her father drew a pencil line on the wall where the water stopped. The neighbours moved to Mestre – the historic city had ${int(121309)} inhabitants in 1966 and has ${int(47625)} today – but the family moved one floor up and stayed. Beside the line there is another: 12 November 2019, 187 cm. Since 2020 MOSE has risen against the highest tides, 49 times last season. Her son Marco is a gondolier like his father Toni, his wife Chiara is a nurse at the Ospedale Civile, and their daughter Matilde, ${age('matilde')}, wants to learn to row standing up. Nives's daughter Paola lives in Mestre, where homes cost a little over a third as much. Paola's daughter Giulia, ${age('giulia')}, studies the lagoon at Ca' Foscari and commutes over the Ponte della Libertà – only one student in four can pay the rent on their own.`,
      `Nives Vianello, ${age('nives')} anni, vive da sola al primo piano della casa in Campo Santa Maria Formosa. Il 4 novembre 1966 aveva undici anni. L'acqua arrivò a 194 cm a Punta della Salute, la famiglia abitava al pianterreno e suo padre tracciò sul muro una riga a matita, dove l'acqua si era fermata. I vicini se ne andarono a Mestre – la città storica aveva ${int(121309)} abitanti nel 1966, oggi ne ha ${int(47625)} – ma la famiglia salì di un piano e restò. Accanto alla riga ce n'è un'altra: 12 novembre 2019, 187 cm. Dal 2020 il MOSE si alza contro le maree più alte: 49 volte la scorsa stagione. Il figlio Marco fa il gondoliere come suo padre Toni, sua moglie Chiara è infermiera all'Ospedale Civile e la loro figlia Matilde, ${age('matilde')} anni, vuole imparare a vogare in piedi. La figlia di Nives, Paola, vive a Mestre, dove le case costano poco più di un terzo. Sua figlia Giulia, ${age('giulia')} anni, studia la laguna a Ca' Foscari e fa la pendolare sul Ponte della Libertà: solo uno studente su quattro riesce a pagarsi l'affitto da solo.`);
    case 2036:{
      const n=age('nives'),c=age('chiara'),g=age('giulia'),m=age('matilde');
      // Nives at 81: the Fondaco, company at home or alone; and whether the bridges let her out.
      const bridges=stepFree>.1
        ?t(`Allt fler broar har fått ramper och lätta trappsteg – ${pct(stepFree)} av dem är fria från trappor nu – och på bra dagar tar hon sig till Rialto med rollatorn.`,
          `More and more bridges have ramps and gentle steps – ${pct(stepFree)} of them are step-free now – and on good days she gets to the Rialto with her rollator.`,
          `Sempre più ponti hanno rampe e gradini agevolati – ${il(pct(stepFree))} è ormai senza scalini – e nei giorni buoni arriva a Rialto con il deambulatore.`)
        :t(`Över broarna kommer hon inte längre: ${pct(d.steppedBridges)} av dem har trappsteg, och campot är så långt hon når.`,
          `She can no longer manage the bridges: ${pct(d.steppedBridges)} of them have steps, and the campo is as far as she gets.`,
          `I ponti non li fa più: ${il(pct(d.steppedBridges))} ha gradini, e il campo è il punto più lontano che riesce a raggiungere.`);
      const nives=!is('nives')?died('nives'):nivesMoved(run)
        ?t(`Nives, ${n}, har flyttat in i Fondaco dei Tedeschi vid Rialto, där lyxvaruhuset stängde 2025. Nu bor unga och gamla kring gården, och i det gemensamma köket lär hon studenterna att göra sarde in saor.`,
          `Nives, ${n}, has moved into the Fondaco dei Tedeschi by the Rialto, where the luxury department store closed in 2025. Young and old now live round its courtyard, and in the shared kitchen she teaches the students to make sarde in saor.`,
          `Nives, ${n} anni, si è trasferita al Fondaco dei Tedeschi, a Rialto, dove nel 2025 ha chiuso il grande magazzino di lusso. Adesso giovani e anziani abitano attorno al cortile, e nella cucina comune lei insegna agli studenti a fare le sarde in saor.`)
        :nivesCompany(run)
        ?join(t(`Nives, ${n}, bor kvar vid campot. ${I.forebyggande>.4?'Hemtjänstens båt lägger till vid kajen varje morgon, och':'Grannarna ringer på varje dag, och'} när sirenerna varnar för acqua alta är det alltid någon som sätter upp skottet i porten åt henne.`,
            `Nives, ${n}, still lives on the campo. ${I.forebyggande>.4?"The home carers' boat ties up at the fondamenta every morning, and":'The neighbours ring her bell every day, and'} when the sirens warn of acqua alta someone always puts up the flood board at the street door for her.`,
            `Nives, ${n} anni, abita ancora in campo. ${I.forebyggande>.4?"Ogni mattina la barca dell'assistenza domiciliare attracca in fondamenta, e":'I vicini suonano il campanello ogni giorno, e'} quando le sirene annunciano l'acqua alta c'è sempre qualcuno che le monta la paratia al portone.`),bridges)
        :join(t(`Nives, ${n}, bor kvar ensam vid campot. Runt henne står ${word(Math.round(d.emptyHomes*10))} av tio bostäder tomma eller hyrs ut till turister.${d.shortLetHomes>.8*BASE.shortLetHomes?' Resväskorna skramlar i trappan varje morgon, och':''} ${d.shortLetHomes>.8*BASE.shortLetHomes?'när':'När'} sirenerna varnar för acqua alta är det ingen som knackar på.`,
            `Nives, ${n}, still lives alone on the campo. Around her, ${word(Math.round(d.emptyHomes*10))} in ten homes stand empty or are let to tourists.${d.shortLetHomes>.8*BASE.shortLetHomes?' Suitcases rattle down the stairs every morning, and':''} ${d.shortLetHomes>.8*BASE.shortLetHomes?'when':'When'} the sirens warn of acqua alta nobody knocks.`,
            `Nives, ${n} anni, vive ancora da sola in campo. Intorno a lei ${word(Math.round(d.emptyHomes*10))} case su dieci sono vuote o affittate ai turisti.${d.shortLetHomes>.8*BASE.shortLetHomes?' Ogni mattina i trolley sbattono giù per le scale, e':''} ${d.shortLetHomes>.8*BASE.shortLetHomes?'quando':'Quando'} le sirene annunciano l'acqua alta nessuno bussa alla sua porta.`),bridges);
      const chiara=I.forebyggande>.35
        ?t(`Chiara, ${c}, åker ut från det nya hälsotorget i Castello med båt och besöker de gamla hemma; ${pct(d.share80)} av invånarna är 80 eller äldre.`,
          `Chiara, ${c}, goes out by boat from the new health centre in Castello to see the old in their homes; ${pct(d.share80)} of the inhabitants are 80 or older.`,
          `Chiara, ${c} anni, parte in barca dalla nuova casa della salute di Castello per visitare gli anziani a domicilio; ${il(pct(d.share80))} degli abitanti ha 80 anni o più.`)
        :t(`På Ospedale Civile, där Chiara, ${c}, arbetar, är det ont om sjuksköterskor; de flesta kollegerna pendlar från fastlandet, och ${pct(d.share80)} av invånarna är 80 eller äldre.`,
          `At the Ospedale Civile, where Chiara, ${c}, works, nurses are scarce; most of her colleagues commute from the mainland, and ${pct(d.share80)} of the inhabitants are 80 or older.`,
          `All'Ospedale Civile, dove lavora Chiara, ${c} anni, mancano infermieri: quasi tutti i colleghi vengono dalla terraferma, e ${il(pct(d.share80))} degli abitanti ha 80 anni o più.`);
      const before=at(run,year-2).ind.saltMarsh,km=int(d.saltMarsh),slower=before-d.saltMarsh<.5;
      const giulia={
        barene:d.saltMarsh>before
          ?t(`Giulia, ${g}, bygger nya saltängar av muddrat sediment och skyddar kanterna med faskiner. Barene växer igen: ${km} km².`,
            `Giulia, ${g}, builds new salt marshes from dredged sediment and protects their edges with fascines. The barene are growing again: ${km} km².`,
            `Giulia, ${g} anni, costruisce nuove barene con i sedimenti dragati e ne protegge i bordi con le fascine. Le barene tornano a crescere: ${km} km².`)
          :t(`Giulia, ${g}, bygger nya saltängar av muddrat sediment och skyddar kanterna med faskiner. Barene krymper ännu – ${km} km², mot 40 när hon började plugga${slower?' – men långsammare än förr':''}.`,
            `Giulia, ${g}, builds new salt marshes from dredged sediment and protects their edges with fascines. The barene are still shrinking – ${km} km², against 40 when she began her studies${slower?' – but more slowly than before':''}.`,
            `Giulia, ${g} anni, costruisce nuove barene con i sedimenti dragati e ne protegge i bordi con le fascine. Le barene si riducono ancora – ${km} km², contro i 40 di quando cominciò a studiare${slower?', ma più lentamente di prima':''}.`),
        tide:t(`Giulia, ${g}, gör tidvattenprognoser med AI åt Autorità per la Laguna vid Rialto. Barriärerna reste sig ${int(d.moseClosures)} gånger förra säsongen, och varje stängning tar slam från saltängarna.`,
          `Giulia, ${g}, makes AI tide forecasts for the Autorità per la Laguna at the Rialto. The barriers rose ${int(d.moseClosures)} times last season, and every closure keeps silt from the salt marshes.`,
          `Giulia, ${g} anni, fa le previsioni di marea con l'IA per l'Autorità per la Laguna, a Rialto. La scorsa stagione le paratoie si sono alzate ${int(d.moseClosures)} volte, e ogni chiusura toglie sedimento alle barene.`),
        lab:t(`Giulia, ${g}, forskar i lagunens levande labb på San Giorgio, där skolklasserna mäter sedimentet och havet tillsammans med forskarna.`,
          `Giulia, ${g}, does research in the lagoon's living lab on San Giorgio, where school classes measure the sediment and the sea together with the scientists.`,
          `Giulia, ${g} anni, fa ricerca nel laboratorio vivente della laguna a San Giorgio, dove le scolaresche misurano i sedimenti e il mare insieme ai ricercatori.`),
        mose:t(`Giulia, ${g}, räknar MOSE:s stängningar åt Autorità per la Laguna vid Rialto: ${int(d.moseClosures)} förra säsongen, mot 49 när hon pluggade. Varje stängning tar slam från saltängarna, och det är dem hon helst skulle vilja rädda.`,
          `Giulia, ${g}, counts MOSE's closures for the Autorità per la Laguna at the Rialto: ${int(d.moseClosures)} last season, against 49 when she was a student. Every closure keeps silt from the salt marshes, and they are what she would most like to save.`,
          `Giulia, ${g} anni, conta le chiusure del MOSE per l'Autorità per la Laguna, a Rialto: ${int(d.moseClosures)} la scorsa stagione, contro le 49 di quando studiava. Ogni chiusura toglie sedimento alle barene, e sono proprio le barene che vorrebbe salvare.`),
      }[giuliaWork(run)];
      const giuliaHome=giuliaIn(run)
        ?(d.shortLetHomes<.85*BASE.shortLetHomes?L('Hon har fått hyra en lägenhet på Ramo Grimani, några minuter från campot, som i tio år hyrdes ut till turister.'):L('Hon har fått hyra en av de rustade kommunala lägenheterna på Ramo Grimani, några minuter från campot.'))
        :L('Hon bor kvar i Mestre och tar bussen över Ponte della Libertà varje morgon.');
      const matilde=join(t(`Matilde, ${m}, ror sin pappas gondol på söndagsmornarna och vill bli gondoljär som han; Venedig fick sin första kvinnliga gondoljär 2009.`,
          `Matilde, ${m}, rows her father's gondola on Sunday mornings and wants to be a gondolier like him; Venice got its first woman gondolier in 2009.`,
          `Matilde, ${m} anni, voga sulla gondola del padre la domenica mattina e vuole fare la gondoliera come lui; Venezia ha avuto la sua prima gondoliera nel 2009.`),
        d.pop>1.02*BASE.pop?L('Fler i hennes klass på liceot bor i den historiska staden nu; familjer har flyttat hit igen.'):L('De flesta i hennes klass på liceot pendlar in från fastlandet.'));
      return join(nives,chiara,giulia,giuliaHome,matilde,hallNews(run,year),evText);
    }
    case 2046:{
      const n=age('nives'),p=age('paola'),mc=age('marco'),m=age('matilde'),atHome=is('nives')&&!nivesMoved(run),stays=matildeStays(run);
      const nives=is('nives')
        ?(nivesMoved(run)
          ?t(`Nives fyller ${n} i Fondaco. Varje 21 november går hon fortfarande över bron till Salute, på en students arm.`,
            `Nives turns ${n} in the Fondaco. Every 21 November she still walks over the bridge to the Salute, on a student's arm.`,
            `Nives compie ${n} anni al Fondaco. Ogni 21 novembre attraversa ancora il ponte per la Salute, al braccio di uno studente.`)
          :t(`Nives fyller ${n}. Hon har inte gått nerför trapporna sedan i våras, men ${I.forebyggande>.5?'hemtjänsten kommer varje morgon, och':''} grannarna kommer upp med mat och skvaller.`,
            `Nives turns ${n}. She has not been down the stairs since the spring, but ${I.forebyggande>.5?'the home carers come every morning, and':''} the neighbours come up with food and gossip.`,
            `Nives compie ${n} anni. Dalla primavera non scende più le scale, ma ${I.forebyggande>.5?"l'assistenza domiciliare passa ogni mattina, e":''} i vicini salgono con la spesa e i pettegolezzi.`).replace(/  +/g,' '))
        :join(died('nives'),at(run,spans.nives).ind.friends>.74
          ?L('Halva campot kom till begravningen i Santa Maria Formosa.')
          :L('Begravningen hölls i Santa Maria Formosa. Bänkarna var nästan tomma; församlingen slogs ihop med grannförsamlingarna för länge sedan.'));
      const house={
        paola:atHome
          ?t(`Paola, ${p}, har flyttat tillbaka till campot för att ta hand om sin mamma.`,
            `Paola, ${p}, has moved back to the campo to look after her mother.`,
            `Paola, ${p} anni, è tornata in campo per stare vicino alla madre.`)
          :t(`Paola, ${p}, har flyttat tillbaka till lägenheten vid campot där hon växte upp; det går att få ett hem i den historiska staden igen.`,
            `Paola, ${p}, has moved back into the flat on the campo where she grew up; it is possible to find a home in the historic city again.`,
            `Paola, ${p} anni, è tornata nell'appartamento in campo dove è cresciuta: nella città storica si trova di nuovo casa.`),
        matilde:atHome
          ?t(`Paola, ${p}, bor kvar i Mestre, och Matilde har flyttat in hos sin farmor vid campot.`,
            `Paola, ${p}, still lives in Mestre, and Matilde has moved in with her grandmother on the campo.`,
            `Paola, ${p} anni, vive ancora a Mestre, e Matilde è andata a stare dalla nonna in campo.`)
          :t(`Paola, ${p}, bor kvar i Mestre. Lägenheten vid campot har Matilde tagit över.`,
            `Paola, ${p}, still lives in Mestre. Matilde has taken over the flat on the campo.`,
            `Paola, ${p} anni, vive ancora a Mestre. L'appartamento in campo l'ha preso Matilde.`),
        let:atHome
          ?t(`Paola, ${p}, bor kvar i Mestre och kommer över varje söndag.`,
            `Paola, ${p}, still lives in Mestre and comes over every Sunday.`,
            `Paola, ${p} anni, vive ancora a Mestre e viene in campo ogni domenica.`)
          :I.korttid>.6
          ?t(`Paola, ${p}, bor kvar i Mestre. Lägenheten vid campot såldes till en familj från Milano som kommer till Biennalen; turistuthyrning är inte längre tillåten i bostadshusen, men ${pct(d.emptyHomes)} av bostäderna i den historiska staden har ändå ingen som bor i dem.`,
            `Paola, ${p}, still lives in Mestre. The flat on the campo was sold to a family from Milan who come for the Biennale; letting to tourists is no longer allowed in residential buildings, but ${pct(d.emptyHomes)} of the homes in the historic city still have nobody living in them.`,
            `Paola, ${p} anni, vive ancora a Mestre. L'appartamento in campo è stato venduto a una famiglia di Milano che viene per la Biennale; gli affitti turistici nelle case d'abitazione non sono più permessi, ma ${il(pct(d.emptyHomes))} delle case della città storica non ha comunque nessuno che ci abiti.`)
          :t(`Paola, ${p}, bor kvar i Mestre, och lägenheten vid campot hyrs ut till turister, en av ${hundreds(d.shortLetHomes)} turistlägenheter i den historiska staden; ${pct(d.emptyHomes)} av bostäderna där har ingen som bor i dem.`,
            `Paola, ${p}, still lives in Mestre, and the flat on the campo is let to tourists, one of ${hundreds(d.shortLetHomes)} tourist flats in the historic city; ${pct(d.emptyHomes)} of the homes there have nobody living in them.`,
            `Paola, ${p} anni, vive ancora a Mestre, e l'appartamento in campo è affittato ai turisti, uno dei ${hundreds(d.shortLetHomes)} appartamenti turistici della città storica; ${il(pct(d.emptyHomes))} delle case lì non ha nessuno che ci abiti.`),
      }[houseFate(run)];
      const marco=!is('marco')?died('marco'):d.boatElectric>.5
        ?t(`Marco, ${mc}, har lagt av med gondolen. På eftermiddagarna sitter han på kajen med en ombra, ett litet glas vin, och säger att han hör kanalen igen nu när vaporettona går på el.`,
          `Marco, ${mc}, has given up the gondola. In the afternoons he sits on the fondamenta with an ombra, a small glass of wine, and says he can hear the canal again now that the vaporetti run on electricity.`,
          `Marco, ${mc} anni, ha appeso il remo al chiodo. Il pomeriggio siede in fondamenta con un'ombra e dice che sente di nuovo il canale, adesso che i vaporetti sono elettrici.`)
        :t(`Marco, ${mc}, har lagt av med gondolen. På eftermiddagarna sitter han på kajen med en ombra, ett litet glas vin, och räknar taxibåtarna som kör för fort; svallvågorna har ätit på kajmurarna under hela hans yrkesliv.`,
          `Marco, ${mc}, has given up the gondola. In the afternoons he sits on the fondamenta with an ombra, a small glass of wine, and counts the water taxis going too fast; their wakes have eaten at the quay walls all his working life.`,
          `Marco, ${mc} anni, ha appeso il remo al chiodo. Il pomeriggio siede in fondamenta con un'ombra e conta i taxi che corrono troppo: il moto ondoso ha roso le rive per tutta la sua vita di lavoro.`);
      // Matilde at 27 takes over her father's licence – a licence is personal and tied to a gondola station, and in
      // a family business a family member has priority.
      const licence=t(`Matilde, ${m}, har tagit över sin pappas gondoljärlicens; i ett familjeföretag har familjen förtur.`,
        `Matilde, ${m}, has taken over her father's gondolier's licence; in a family business the family has priority.`,
        `Matilde, ${m} anni, ha preso la licenza da gondoliera del padre: nelle imprese di famiglia i familiari hanno la precedenza.`);
      const matilde=stays
        ?join(licence,I.besok>.5?L('På morgnarna ror hon traghetton vid Santa Sofia, gondolfärjan som tar venetianer över Canal Grande, och på eftermiddagarna besökare som har bokat i förväg.')
          :t(`Hon ror turister under Rialtobron från morgon till kväll; en vanlig dag kommer ${hundreds(d.dayVisitors)} dagsbesökare till staden.`,
            `She rows tourists under the Rialto bridge from morning to night; on an ordinary day ${hundreds(d.dayVisitors)} day visitors come to the city.`,
            `Porta i turisti sotto il ponte di Rialto dalla mattina alla sera: in un giorno qualsiasi arrivano in città ${hundreds(d.dayVisitors)} escursionisti.`))
        :join(licence,t(`Men hon bor i Mestre med sin sambo; en lägenhet i den historiska staden, ${int(Math.round(d.housePrice/10)*10)} euro kvadratmetern, har de inte råd med. Hon tar bussen över Ponte della Libertà i gryningen och ror i en stad med ${dec(d.visitorsPerResident,1)} besökare per invånare en vanlig dag.`,
          `But she lives in Mestre with her partner; a flat in the historic city, at ${int(Math.round(d.housePrice/10)*10)} euro a square metre, is beyond them. She takes the bus over the Ponte della Libertà at dawn and rows in a city with ${dec(d.visitorsPerResident,1)} visitors for every inhabitant on an ordinary day.`,
          `Ma vive a Mestre con il compagno: un appartamento nella città storica, a ${int(Math.round(d.housePrice/10)*10)} euro al metro quadro, non se lo possono permettere. All'alba prende l'autobus sul Ponte della Libertà e voga in una città che, in un giorno qualsiasi, ha ${dec(d.visitorsPerResident,1)} visitatori per abitante.`));
      return join(nives,house,marco,matilde,hallNews(run,year),evText);
    }
    case 2056:{
      const m=age('matilde'),b=age('bianca'),nc=age('nicolo'),g=age('giulia'),stays=matildeStays(run),fate=houseFate(run);
      const gone=join(lately('nives'),lately('paola'),lately('marco'));
      const kids=t(`Matilde, ${m}, har två barn: Bianca, ${b}, och Nicolò, ${nc}.`,`Matilde, ${m}, has two children: Bianca, ${b}, and Nicolò, ${nc}.`,`Matilde, ${m} anni, ha due figli: Bianca, di ${b} anni, e Nicolò, di ${nc}.`);
      // Where they live: Mestre, a multi-generation house on the campo (Hem för venetianer, level 2 and up), the
      // flat where Nives lived, or a rented flat nearby.
      const home=!stays?L('De bor i Mestre. På söndagarna åker de över till Venedig, och barnen tror att det är en stad man hälsar på i.')
        :I.bogemenskap>.5?join(fate==='paola'&&is('paola')
            ?L('Huset vid campot har blivit ett generationshus: Paola bor en trappa upp, Matilde och barnen två trappor upp och studenter under taket.')
            :L('Huset vid campot har blivit ett generationshus: Matilde och barnen bor en trappa upp, där Nives bodde, och studenter under taket.'),
          I.anpassning>.4?L('I bottenvåningen, som nu tål vatten, lagar grannarna mat tillsammans.'):'')
        :fate==='matilde'?L('De bor i lägenheten vid campot där Nives bodde.'):L('De hyr en lägenhet på Calle Longa, ett stenkast från campot.');
      // The campo in July (Svalka i campi: the shade on the campi), the market (Lagunens mat och Rialto: the fish
      // stalls) and the school (the pupils of the historic city's primary and middle schools, 2 570 in 2024/25).
      const campo=stays?join(d.shade>.18
          ?L('Bianca leker på campot under de nya träden, där det är svalt även i juli.')
          :t(`I juli är stenarna på campot för heta att leka på – ett vanligt år har nu ${int(d.hotDays)} dagar över 30 grader – och Bianca får vara inne på eftermiddagarna.`,
            `In July the stones of the campo are too hot to play on – an ordinary year now has ${int(d.hotDays)} days above 30 °C – and Bianca has to stay indoors in the afternoons.`,
            `A luglio i masegni del campo scottano troppo per giocarci – un anno normale ha ormai ${int(d.hotDays)} giorni sopra i 30 gradi – e il pomeriggio Bianca deve restare in casa.`),
        I.regionalt>.3&&d.fishStalls>8?t(`På lördagarna handlar de vid Rialto, där fiskstånden är ${int(d.fishStalls)} igen och odlarna från Sant'Erasmo säljer sina kronärtskockor.`,
          `On Saturdays they shop at the Rialto, where there are ${int(d.fishStalls)} fish stalls again and the growers from Sant'Erasmo sell their artichokes.`,
          `Il sabato fanno la spesa a Rialto, dove i banchi del pesce sono di nuovo ${int(d.fishStalls)} e gli ortolani di Sant'Erasmo vendono i loro carciofi.`):'',
        d.pupils>1.1*BASE.pupils?L('På Scuola Armando Diaz har klasserna börjat växa igen.'):d.pupils<.85*BASE.pupils?L('Scuola Armando Diaz har slagit ihop två klasser till en.'):L('Biancas klass på Scuola Armando Diaz är lika liten som Matildes var.')):'';
      // The lagoon: how often MOSE shut it, and Giulia's salt marshes.
      const grew=d.saltMarsh>at(run,2045).ind.saltMarsh+1,km=int(d.saltMarsh);
      const gates=d.lagoonClosed>.6?t(`Lagunen är stängd mot havet ${pct(d.lagoonClosed)} av årets timmar nu.`,`The lagoon is closed to the sea for ${pct(d.lagoonClosed)} of the year's hours now.`,`Ormai la laguna è chiusa al mare per ${il(pct(d.lagoonClosed))} delle ore dell'anno.`)
        :d.moseClosures>=300?t(`MOSE reser sig nästan varje dag nu, ${int(d.moseClosures)} gånger förra året.`,`MOSE rises almost every day now, ${int(d.moseClosures)} times last year.`,`Il MOSE ormai si alza quasi ogni giorno: ${int(d.moseClosures)} volte l'anno scorso.`)
        :t(`MOSE stängde ${int(d.moseClosures)} gånger förra säsongen.`,`MOSE closed ${int(d.moseClosures)} times last season.`,`La scorsa stagione il MOSE ha chiuso ${int(d.moseClosures)} volte.`);
      const lagoon=join(gates,
        grew?(giuliaWork(run)==='barene'
            ?t(`Giulia, ${g}, tar med skolklasser ut till barene hon har byggt; de är ${km} km² nu och växer för varje år.`,
              `Giulia, ${g}, takes school classes out to the barene she has built; they cover ${km} km² now and grow every year.`,
              `Giulia, ${g} anni, porta le scolaresche sulle barene che ha costruito: adesso sono ${km} km² e crescono ogni anno.`)
            :t(`Barene växer igen, ${km} km², och Giulia, ${g}, tar med skolklasser ut för att mäta dem.`,
              `The barene are growing again, ${km} km², and Giulia, ${g}, takes school classes out to measure them.`,
              `Le barene tornano a crescere, ${km} km², e Giulia, ${g} anni, ci porta le scolaresche a misurarle.`))
          :d.lagoonClosed>.15&&d.waters<.3?(d.lagoonClosed>.6?L('Vattnet står stilla, och i augusti luktar kanalerna.'):L('Lagunen står stilla bakom barriärerna allt oftare, och i augusti luktar kanalerna.'))
          :d.saltMarsh<1?L('De sista barene har sjunkit under ytan; lagunen har blivit ett grunt hav.')
          :d.saltMarsh<at(run,2045).ind.saltMarsh-.5?t(`Barene krymper: ${km} km² kvar.`,`The barene are shrinking: ${km} km² left.`,`Le barene si riducono: ne restano ${km} km².`)
          :t(`Barene håller stånd: ${km} km².`,`The barene are holding their own: ${km} km².`,`Le barene resistono: ${km} km².`));
      return join(gone,kids,home,campo,lagoon,hallNews(run,year),evText);
    }
    case 2066:{
      const c=age('chiara'),e=age('elia'),b=age('bianca'),nc=age('nicolo');
      // Paola and Marco: who died in the decade just gone, who is still here.
      const gone=['paola','marco'].filter(id=>!is(id)&&spans[id]>year-10).sort((p,q)=>spans[p]-spans[q]),[x,y]=gone.map(id=>MEMBER[id]);
      const chiaraAlone=is('chiara')&&!(I.bogemenskap>.6)&&!(d.friends>.78);
      const old=join(gone.length===2
          ?(spans[x.id]===spans[y.id]
            ?t(`${x.first} och ${y.first} dog båda ${spans[x.id]}.`,`${x.first} and ${y.first} both died in ${spans[x.id]}.`,`${x.first} e ${y.first} sono morti tutti e due nel ${spans[x.id]}.`)
            :t(`${x.first} dog ${spans[x.id]} och ${y.first} ${spans[y.id]}.`,`${x.first} died in ${spans[x.id]} and ${y.first} in ${spans[y.id]}.`,`${x.first} è ${x.female?'morta':'morto'} nel ${spans[x.id]} e ${y.first} nel ${spans[y.id]}.`))
          :gone.length?died(gone[0]):'',
        ...['paola','marco'].filter(is).map(id=>t(`${MEMBER[id].first} fyller ${age(id)}.`,`${MEMBER[id].first} turns ${age(id)}.`,`${MEMBER[id].first} compie ${age(id)} anni.`)),
        !is('chiara')?died('chiara'):I.bogemenskap>.6
          ?t(`Chiara, ${c}, äter middag i generationshusets kök vid campot varje kväll.`,`Chiara, ${c}, has dinner in the kitchen of the multi-generation house on the campo every evening.`,`Chiara, ${c} anni, cena ogni sera nella cucina comune della casa tra generazioni, in campo.`)
          :d.friends>.78
          ?t(`Chiara, ${c}, bor kvar på Calle Longa, och grannarna tittar in varje dag.`,`Chiara, ${c}, still lives on Calle Longa, and the neighbours drop in every day.`,`Chiara, ${c} anni, abita ancora in Calle Longa, e i vicini passano a trovarla ogni giorno.`)
          :d.aiCapacity>.3&&d.aiGovernance<.4
          ?t(`Chiara, ${c}, bor ensam på Calle Longa och har mest sin AI-assistent som sällskap.`,`Chiara, ${c}, lives alone on Calle Longa, with mostly her AI assistant for company.`,`Chiara, ${c} anni, vive da sola in Calle Longa e le fa compagnia soprattutto l'assistente IA.`)
          :t(`Chiara, ${c}, bor ensam på Calle Longa och har mest teven som sällskap.`,`Chiara, ${c}, lives alone on Calle Longa, with mostly the television for company.`,`Chiara, ${c} anni, vive da sola in Calle Longa e le fa compagnia soprattutto la televisione.`),
        // Alone at 83: the bridges, and the heat (Svalka i campi, care that looks in).
        chiaraAlone?(stepFree>.25?t(`Med rollatorn tar hon sig ändå till marknaden: ${pct(stepFree)} av broarna är fria från trappor nu.`,`With her rollator she still gets to the market: ${pct(stepFree)} of the bridges are step-free now.`,`Con il deambulatore arriva comunque al mercato: ${il(pct(stepFree))} dei ponti è ormai senza scalini.`)
          :t(`Över broarna kommer hon inte längre; ${pct(d.steppedBridges)} av dem har trappsteg.`,`She can no longer manage the bridges; ${pct(d.steppedBridges)} of them have steps.`,`I ponti non li fa più: ${il(pct(d.steppedBridges))} ha gradini.`)):'',
        chiaraAlone&&d.shade<.15&&I.forebyggande<.3?t(`Somrarna har ${int(d.hotDays)} dagar över 30 grader nu, och i juli sover hon i entrén på bottenvåningen, där stenen håller kylan.`,`Summers have ${int(d.hotDays)} days above 30 °C now, and in July she sleeps in the hall on the ground floor, where the stone keeps the cool.`,`Le estati hanno ormai ${int(d.hotDays)} giorni sopra i 30 gradi, e a luglio dorme nell'androne al pianterreno, dove la pietra tiene il fresco.`):'');
      const elia=I.anpassning>.6
        ?t(`Elia, ${e}, är stenhuggare och höjer kajerna i Castello sten för sten, så att MOSE kan vänta längre innan det reser sig.`,
          `Elia, ${e}, is a stonemason raising the quays of Castello stone by stone, so that MOSE can wait longer before it rises.`,
          `Elia, ${e} anni, fa lo scalpellino e rialza le fondamente di Castello pietra su pietra, perché il MOSE possa aspettare di più prima di alzarsi.`)
        :I.kollektivt>.6
        ?t(`Elia, ${e}, kör eldriven vaporetto på linje 1 längs Canal Grande.`,`Elia, ${e}, drives an electric vaporetto on line 1 along the Grand Canal.`,`Elia, ${e} anni, guida un vaporetto elettrico sulla linea 1 del Canal Grande.`)
        :I.ai>.6
        ?t(`Elia, ${e}, är tidvattenanalytiker och är med och bestämmer när MOSE ska resa sig.`,`Elia, ${e}, is a tide analyst and helps decide when MOSE should rise.`,`Elia, ${e} anni, è analista delle maree e aiuta a decidere quando alzare il MOSE.`)
        :t(`Elia, ${e}, är servitör vid Riva degli Schiavoni, som så många i hans ålder.`,`Elia, ${e}, waits tables on the Riva degli Schiavoni, like so many of his age.`,`Elia, ${e} anni, fa il cameriere sulla Riva degli Schiavoni, come tanti della sua età.`);
      const bianca=biancaStays(run)
        ?(matildeStays(run)
          ?t(`Bianca, ${b}, läser vid Ca' Foscari, som Giulia en gång, och tänker stanna i Venedig.`,`Bianca, ${b}, studies at Ca' Foscari, as Giulia once did, and means to stay in Venice.`,`Bianca, ${b} anni, studia a Ca' Foscari, come un tempo Giulia, e pensa di restare a Venezia.`)
          :t(`Bianca, ${b}, läser vid Ca' Foscari och har fått ett av stadens ${hundreds(d.studentBeds)} studentrum; till Mestre tänker hon inte flytta tillbaka.`,`Bianca, ${b}, studies at Ca' Foscari and has one of the city's ${hundreds(d.studentBeds)} student rooms; she has no plans to move back to Mestre.`,`Bianca, ${b} anni, studia a Ca' Foscari e ha uno dei ${hundreds(d.studentBeds)} posti letto per studenti della città: a Mestre non pensa di tornare.`))
        :t(`Bianca, ${b}, flyttar till Milano i höst. ”Här finns bara turister och gamla”, säger hon.`,`Bianca, ${b}, is moving to Milan this autumn. "There's nothing here but tourists and old people," she says.`,`Bianca, ${b} anni, quest'autunno si trasferisce a Milano. «Qui ci sono solo turisti e vecchi», dice.`);
      // Nicolò at 13: the lagoon (Levande lagun), the screen (AI without the people's say costs friends in the
      // model), or the gondola.
      const nicolo=I.hav>.6
        ?t(`Nicolò, ${nc}, följer med Giulia ut i lagunen på lördagarna och planterar sjögräs.`,`Nicolò, ${nc}, goes out into the lagoon with Giulia on Saturdays to plant seagrass.`,`Nicolò, ${nc} anni, il sabato va in laguna con Giulia a piantare fanerogame.`)
        :d.aiCapacity>.3&&d.aiGovernance<.4
        ?t(`Nicolò, ${nc}, pratar mer med sin AI-assistent än med kompisarna.`,`Nicolò, ${nc}, talks more with his AI assistant than with his friends.`,`Nicolò, ${nc} anni, parla più con il suo assistente IA che con gli amici.`)
        :t(`Nicolò, ${nc}, lär sig ro i morfar Marcos gamla gondol.`,`Nicolò, ${nc}, is learning to row in his grandfather Marco's old gondola.`,`Nicolò, ${nc} anni, impara a vogare sulla vecchia gondola del nonno Marco.`);
      return join(old,elia,bianca,nicolo,hallNews(run,year),evText);
    }
    case 2076:{
      const b=age('bianca'),nc=age('nicolo'),stayed=biancaStays(run),back=biancaBack(run),demo=I.demokrati>.6&&d.turnout>.6;
      const bianca=join(stayed?'':back
          ?t(`Bianca, ${b}, flyttade till Milano men har kommit hem igen.`,`Bianca, ${b}, moved to Milan but has come home again.`,`Bianca, ${b} anni, si era trasferita a Milano ma è tornata a casa.`)
          :t(`Bianca, ${b}, bor kvar i Milano och kommer hem till Redentore.`,`Bianca, ${b}, still lives in Milan and comes home for the Redentore.`,`Bianca, ${b} anni, vive ancora a Milano e torna a casa per il Redentore.`),
        !back?'':demo
          ?t(`${stayed?`Bianca, ${b},`:'Hon'} har lottats in i medborgarrådet, som möts i Stora rådssalen i Dogepalatset, där republikens råd satt i århundraden.`,
            `${stayed?`Bianca, ${b},`:'She'} has been chosen by lot for the citizens' assembly, which meets in the Hall of the Great Council in the Doge's Palace, where the Republic's councils sat for centuries.`,
            `${stayed?`Bianca, ${b} anni,`:'Lei'} è stata sorteggiata per l'assemblea dei cittadini, che si riunisce nella Sala del Maggior Consiglio di Palazzo Ducale, dove per secoli sedettero i consigli della Repubblica.`)
          :t(`${stayed?`Bianca, ${b},`:'Hon'} röstar i varje val, men bara ${pct(d.turnout)} av venetianerna gör det, och besluten om lagunen fattas i Rom.`,
            `${stayed?`Bianca, ${b},`:'She'} votes in every election, but only ${pct(d.turnout)} of Venetians do, and the decisions about the lagoon are made in Rome.`,
            `${stayed?`Bianca, ${b} anni,`:'Lei'} vota a ogni elezione, ma lo fa solo ${il(pct(d.turnout))} dei veneziani, e le decisioni sulla laguna si prendono a Roma.`));
      const builder=giuliaWork(run)==='barene';
      const nicolo=I.hav>.6&&d.saltMarsh>at(run,2065).ind.saltMarsh
        ?(builder
          ?t(`Nicolò, ${nc}, bygger saltängar i lagunen, som Giulia lärde honom.`,`Nicolò, ${nc}, builds salt marshes in the lagoon, as Giulia taught him.`,`Nicolò, ${nc} anni, costruisce barene in laguna, come gli ha insegnato Giulia.`)
          :t(`Nicolò, ${nc}, bygger saltängar i lagunen.`,`Nicolò, ${nc}, builds salt marshes in the lagoon.`,`Nicolò, ${nc} anni, costruisce barene in laguna.`))
        :I.regionalt>.6
        ?t(`Nicolò, ${nc}, odlar violetta kronärtskockor på Sant'Erasmo, Venedigs köksträdgård, och säljer dem på Rialtomarknaden.`,`Nicolò, ${nc}, grows violet artichokes on Sant'Erasmo, Venice's kitchen garden, and sells them at the Rialto market.`,`Nicolò, ${nc} anni, coltiva carciofi violetti a Sant'Erasmo, l'orto di Venezia, e li vende al mercato di Rialto.`)
        :I.kollektivt>.7
        ?t(`Nicolò, ${nc}, kör eldriven vaporetto ut till öarna.`,`Nicolò, ${nc}, drives an electric vaporetto out to the islands.`,`Nicolò, ${nc} anni, porta un vaporetto elettrico verso le isole.`)
        :t(`Nicolò, ${nc}, är servitör på en restaurang vid Rialto och delar ett rum med två kolleger.`,`Nicolò, ${nc}, waits tables at a restaurant by the Rialto and shares a room with two colleagues.`,`Nicolò, ${nc} anni, fa il cameriere in un ristorante a Rialto e divide una stanza con due colleghi.`);
      const night=join(L('På Redentore, tredje söndagen i juli, äter familjen middag i båten i bassängen framför San Marco och väntar på fyrverkeriet, som venetianerna alltid har gjort.'),
        d.boatElectric>.8?L('Runt dem ligger hundratals båtar tysta på vattnet; nästan alla går på el.'):L('Runt dem brummar motorerna från hundratals båtar.'));
      return join(lately('chiara'),bianca,nicolo,L('Elia har fått en dotter, Nina.'),night,hallNews(run,year),evText);
    }
    case 2086:{
      const m=age('matilde'),z=age('zeno'),km=int(d.saltMarsh);
      const zeno=join(t(`Matilde, ${m}, har fått ett barnbarn: Biancas son Zeno, ${z}.`,`Matilde, ${m}, has a grandchild: Bianca's son Zeno, ${z}.`,`Matilde, ${m} anni, è diventata nonna: Bianca ha un figlio, Zeno, di ${z} anni.`),
        biancaBack(run)?'':L('Han växer upp i Milano.'));
      const hot=join(t(`Somrarna har omkring ${int(d.hotDays)} dagar över 30 grader, mot ${CITY.hotDaysToday} när Matilde var barn.`,`Summers bring about ${int(d.hotDays)} days above 30 °C, against ${CITY.hotDaysToday} when Matilde was a child.`,`Le estati hanno circa ${int(d.hotDays)} giorni sopra i 30 gradi, contro i ${CITY.hotDaysToday} di quando Matilde era bambina.`),
        matildeStays(run)&&d.shade>.3?L('På campot står träden tätt nu, och vid de gamla brunnarna finns dricksvatten igen.'):'');
      const lagoon=d.saltMarsh>45&&d.waters>.6
        ?(giuliaWork(run)==='barene'?L('Matilde ror ut Zeno till barene som Giulia byggde, där flamingorna står i tusental.'):L('Matilde ror ut Zeno till barene, där flamingorna står i tusental.'))
        :d.saltMarsh<5?L('Barene som Giulia en gång räknade finns inte längre; där de låg är det öppet vatten, och fåglarna håller sig i fiskodlingarna.')
        :d.saltMarsh<at(run,2075).ind.saltMarsh-2?t(`Barene krymper år för år; ${km} km² är kvar.`,`The barene shrink year by year; ${km} km² are left.`,`Le barene si riducono anno dopo anno: ne restano ${km} km².`)
        :d.waters>.5
        ?t(`Barene håller stånd, ${km} km², och vattnet är klarare än när Matilde var barn.`,`The barene are holding their own, ${km} km², and the water is clearer than when Matilde was a child.`,`Le barene resistono, ${km} km², e l'acqua è più limpida di quando Matilde era bambina.`)
        :t(`Barene håller stånd, ${km} km², men lagunen är grumligare än Matilde minns den.`,`The barene are holding their own, ${km} km², but the lagoon is murkier than Matilde remembers it.`,`Le barene resistono, ${km} km², ma la laguna è più torbida di come Matilde la ricorda.`);
      // MOSE: shut for good (Lagunens portar at its radical level), rising every day, or often.
      const mose=d.lagoonClosed>.9?L('Inloppen har varit stängda för gott i många år, och lagunen har blivit en sjö bakom barriärerna.')
        :d.lagoonClosed>.5?t(`MOSE reser sig nästan varje dag nu, och lagunen är stängd ${pct(d.lagoonClosed)} av årets timmar – mer stängd än öppen.`,`MOSE rises almost every day now, and the lagoon is closed for ${pct(d.lagoonClosed)} of the year's hours – more closed than open.`,`Il MOSE ormai si alza quasi ogni giorno, e la laguna resta chiusa per ${il(pct(d.lagoonClosed))} delle ore dell'anno: più chiusa che aperta.`)
        :d.moseClosures>=300?t(`MOSE reser sig nästan varje dag nu; lagunen är stängd ${pct(d.lagoonClosed)} av årets timmar.`,`MOSE rises almost every day now; the lagoon is closed for ${pct(d.lagoonClosed)} of the year's hours.`,`Il MOSE ormai si alza quasi ogni giorno; la laguna resta chiusa per ${il(pct(d.lagoonClosed))} delle ore dell'anno.`)
        :d.moseClosures>120?t(`MOSE reste sig ${int(d.moseClosures)} gånger förra året.`,`MOSE rose ${int(d.moseClosures)} times last year.`,`L'anno scorso il MOSE si è alzato ${int(d.moseClosures)} volte.`):'';
      return join(zeno,hot,lagoon,mose,hallNews(run,year),evText);
    }
    case 2096:{
      const g=age('giulia'),ni=age('nina'),z=age('zeno'),km=int(d.saltMarsh);
      const giulia=!is('giulia')?join(died('giulia'),notebooks(run)):giuliaWork(run)==='barene'&&d.saltMarsh>60
        ?t(`Giulia fyller ${g}. Barene som hon började bygga som ung täcker nu ${km} km².`,`Giulia turns ${g}. The barene she began building as a young woman now cover ${km} km².`,`Giulia compie ${g} anni. Le barene che cominciò a costruire da giovane ora coprono ${km} km².`)
        :t(`Giulia fyller ${g}.`,`Giulia turns ${g}.`,`Giulia compie ${g} anni.`);
      const nina=I.hav>.6&&d.saltMarsh>40
        ?t(`Nina, ${ni}, har tagit över farmor Giulias mätningar ute på barene.`,`Nina, ${ni}, has taken over her grandmother Giulia's measurements out on the barene.`,`Nina, ${ni} anni, ha raccolto il testimone della nonna Giulia: le misure sulle barene ora le fa lei.`)
        :I.hav>.6
        ?t(`Nina, ${ni}, planterar sjögräs och binder faskiner med lagunens fiskare, för att rädda det som är kvar av barene.`,`Nina, ${ni}, plants seagrass and ties fascines with the lagoon's fishers, to save what is left of the barene.`,`Nina, ${ni} anni, pianta fanerogame e lega fascine con i pescatori della laguna, per salvare quel che resta delle barene.`)
        :I.ai>.6
        ?t(`Nina, ${ni}, utbildar sig till tidvattenanalytiker.`,`Nina, ${ni}, is training to be a tide analyst.`,`Nina, ${ni} anni, studia per diventare analista delle maree.`)
        :I.kunskap>.6
        ?t(`Nina, ${ni}, utbildar sig till restauratör i Arsenalens verkstäder.`,`Nina, ${ni}, is training as a restorer in the workshops of the Arsenale.`,`Nina, ${ni} anni, studia da restauratrice nei laboratori dell'Arsenale.`)
        :t(`Nina, ${ni}, jobbar på ett hotell vid Riva degli Schiavoni och sparar till en egen lägenhet.`,`Nina, ${ni}, works at a hotel on the Riva degli Schiavoni and is saving for a flat of her own.`,`Nina, ${ni} anni, lavora in un albergo sulla Riva degli Schiavoni e mette da parte i soldi per una casa sua.`);
      const zeno=biancaBack(run)
        ?t(`Zeno, ${z}, lär sig ro stående av mormor Matilde.`,`Zeno, ${z}, is learning to row standing up from his grandmother Matilde.`,`Zeno, ${z} anni, impara a vogare in piedi da nonna Matilde.`)
        :t(`Zeno, ${z}, har aldrig rott en gondol; från Milano kommer han bara till Redentore.`,`Zeno, ${z}, has never rowed a gondola; he only comes from Milan for the Redentore.`,`Zeno, ${z} anni, non ha mai vogato su una gondola: da Milano viene solo per il Redentore.`);
      const hall=hallNews(run,year)||(newLine(run,year)?'':L('Det senaste strecket i entrén vid campot är fortfarande det från 2019.'));
      return join(giulia,nina,zeno,hall,evText);
    }
    case 2106:{
      const m=age('matilde'),o=age('ottavia'),z=age('zeno');
      const ottavia=t(`Nicolò har fått dottern Ottavia, ${o}.`,`Nicolò has a daughter, Ottavia, ${o}.`,`Nicolò ha una figlia, Ottavia, di ${o} anni.`);
      const row=!is('matilde')?died('matilde'):!matildeStays(run)
        ?t(`Farmor Matilde, ${m}, berättar för henne om gondolerna, men i Mestre finns ingenstans att ro.`,`Her grandmother Matilde, ${m}, tells her about the gondolas, but in Mestre there is nowhere to row.`,`Nonna Matilde, ${m} anni, le racconta delle gondole, ma a Mestre non c'è dove vogare.`)
        :I.besok>.5
        ?t(`Farmor Matilde, ${m}, lär henne ro stående i traghetton vid Santa Sofia, där hon själv rodde venetianer över Canal Grande i fyrtio år.`,`Her grandmother Matilde, ${m}, is teaching her to row standing up in the traghetto at Santa Sofia, where she rowed Venetians across the Grand Canal for forty years.`,`Nonna Matilde, ${m} anni, le insegna a vogare in piedi sul traghetto di Santa Sofia, dove lei stessa ha portato i veneziani da una riva all'altra del Canal Grande per quarant'anni.`)
        :t(`Farmor Matilde, ${m}, lär henne ro stående i familjens gamla gondol.`,`Her grandmother Matilde, ${m}, is teaching her to row standing up in the family's old gondola.`,`Nonna Matilde, ${m} anni, le insegna a vogare in piedi sulla vecchia gondola di famiglia.`);
      const giulia=lately('giulia')?join(lately('giulia'),notebooks(run)):'';
      const zeno=biancaBack(run)
        ?t(`Zeno, ${z}, har tagit gondoljärlicens, den fjärde i släkten.`,`Zeno, ${z}, has his gondolier's licence, the fourth in the family.`,`Zeno, ${z} anni, ha preso la licenza da gondoliere, il quarto della famiglia.`)
        :t(`Zeno, ${z}, är ingenjör i Milano.`,`Zeno, ${z}, is an engineer in Milan.`,`Zeno, ${z} anni, fa l'ingegnere a Milano.`);
      return join(ottavia,row,giulia,zeno,hallNews(run,year),evText);
    }
    case 2116:{
      const o=age('ottavia'),m=age('matilde'),stays=ottaviaStays(run);
      const ottavia=stays&&!matildeStays(run)
        ?t(`Ottavia, ${o}, har fått ett studentrum vid campot och flyttar från Mestre in i den historiska staden, där farmor Matilde växte upp.`,
          `Ottavia, ${o}, has a student room on the campo and is moving from Mestre into the historic city, where her grandmother Matilde grew up.`,
          `Ottavia, ${o} anni, ha una stanza da studentessa in campo e da Mestre si trasferisce nella città storica, dove è cresciuta nonna Matilde.`)
        :stays
        ?t(`Ottavia, ${o}, sa det som unga venetianer alltid har sagt: ”Jag flyttar till fastlandet.” Hon stannade. Här finns arbete, och tåget till Rom tar ${rail(d.railMain)} när hon vill bort.`,
          `Ottavia, ${o}, said what young Venetians have always said: "I'm moving to the mainland." She stayed. There is work here, and the train to Rome takes ${rail(d.railMain)} when she wants to get away.`,
          `Ottavia, ${o} anni, ha detto quello che i giovani veneziani hanno sempre detto: «Vado in terraferma.» È rimasta. Qui il lavoro c'è, e quando vuole andarsene il treno per Roma ci mette ${rail(d.railMain)}.`)
        :t(`Ottavia, ${o}, flyttar till Milano i höst, som så många unga före henne. Hon lovar att komma hem till Salute.`,
          `Ottavia, ${o}, is moving to Milan this autumn, like so many young people before her. She promises to come home for the Salute.`,
          `Ottavia, ${o} anni, quest'autunno si trasferisce a Milano, come tanti giovani prima di lei. Promette di tornare per la Salute.`);
      const matilde=!is('matilde')?died('matilde'):join(t(`Matilde, ${m}, är äldst i släkten.`,`Matilde, ${m}, is the oldest in the family.`,`Matilde, ${m} anni, è la più anziana della famiglia.`),
        !matildeStays(run)?L('Hon bor kvar i Mestre, men varje söndag tar hon spårvagnen över bron till campot.')
          :I.bogemenskap>.6?L('Hon bor i generationshuset vid campot och äter i det gemensamma köket med grannar i alla åldrar.')
          :L('Hon bor kvar i huset vid campot, med Nicolò och Ottavia en trappa upp.'),
        matildeStays(run)&&stepFree>.25?t(`${pct(stepFree)} av broarna är fria från trappor nu, och med rollatorn tar hon sig fortfarande till Rialto.`,`${pct(stepFree)} of the bridges are step-free now, and with her rollator she still gets to the Rialto.`,`${il(pct(stepFree)).replace(/^./,ch=>ch.toUpperCase())} dei ponti è ormai senza scalini, e con il deambulatore arriva ancora a Rialto.`):'');
      const town=t(`Den historiska staden har ${hundreds(d.pop)} invånare, och en vanlig dag kommer ${dec(d.visitorsPerResident,1)} besökare per invånare.`,
        `The historic city has ${hundreds(d.pop)} inhabitants, and on an ordinary day there are ${dec(d.visitorsPerResident,1)} visitors for every inhabitant.`,
        `La città storica ha ${hundreds(d.pop)} abitanti, e in un giorno qualsiasi ci sono ${dec(d.visitorsPerResident,1)} visitatori per abitante.`);
      return join(ottavia,matilde,town,hallNews(run,year),evText);
    }
  }
  return '';
}
// 21 November 2126, the Festa della Salute: the family walks over the bridge to the Salute, as Venetians do every
// year, and comes home to the castradina.
export function familyEpilogue(run){
  const d=at(run,2126).ind,spans=lifespans(run),matilde=MEMBER.matilde,line=newLine(run,2127),stays=matildeStays(run);
  const bridge=d.visitorsPerResident<1.5?L('På bron känner nästan alla varandra.'):d.visitorsPerResident>3?L('På bron trängs besökare med kameror; venetianerna är få.'):'';
  // The century's closest call in the hall, if the water came near it.
  const near=worstFlood(run,2027,2127),close=!line&&near&&near.x>near.P&&HALL-near.x<.3?Math.max(5,Math.round((HALL-near.x)*20)*5):0;
  const hall=line
    ?t(`I entrén vid campot finns nu tre streck: 1966, 2019 och ${line}.`,`In the hall on the campo there are three lines now: 1966, 2019 and ${line}.`,`Nell'androne in campo ora le righe sono tre: 1966, 2019 e ${line}.`)
    :close?t(`I entrén vid campot finns fortfarande bara två streck, 1966 och 2019 – år ${near.year} stannade vattnet ${close} cm under tröskeln.`,`In the hall on the campo there are still only two lines, 1966 and 2019 – in ${near.year} the water stopped ${close} cm below the threshold.`,`Nell'androne in campo le righe sono ancora soltanto due, 1966 e 2019 – nel ${near.year} l'acqua si è fermata ${close} cm sotto la soglia.`)
    :L('I entrén vid campot finns fortfarande bara två streck: 1966 och 2019.');
  // Home after the bridge: Matilde's, while she lives; then Zeno's or Ottavia's if either lives in the historic city.
  const living=alive(matilde,2126,spans),inCity=living?stays:biancaBack(run)||ottaviaStays(run);
  const home=inCity?join(hall,L('Hemma puttrar castradinan på spisen.')):join(L('På vägen till spårvagnen stannar de vid huset där Nives bodde.'),hall,L('Sedan åker de hem till Mestre.'));
  const zeno=biancaBack(run)?'':L('Zeno har kommit från Milano för dagen.');
  if(living)return join(
    t(`Den 21 november 2126 går släkten Vianello över den tillfälliga bron till Salute, som venetianerna gör varje år. Matilde, ${2126-matilde.birth}, går mellan Zeno och Ottavia och tänder ett ljus för Nives. ”Året jag föddes stod vattnet i entrén, och varje år dog fler än det föddes. Ingen visste hur det skulle gå. Men en stad på vatten står bara kvar så länge någon bor i den.”`,
      `On 21 November 2126 the Vianello family walks over the temporary bridge to the Salute, as Venetians do every year. Matilde, ${2126-matilde.birth}, walks between Zeno and Ottavia and lights a candle for Nives. "The year I was born, the water stood in the hall, and every year more people died than were born. Nobody knew how things would turn out. But a city on the water only stands as long as someone lives in it."`,
      `Il 21 novembre 2126 la famiglia Vianello attraversa il ponte provvisorio per la Salute, come i veneziani fanno ogni anno. Matilde, ${2126-matilde.birth} anni, cammina tra Zeno e Ottavia e accende una candela per Nives. «L'anno in cui sono nata l'acqua è entrata nell'androne, e ogni anno morivano più persone di quante ne nascessero. Nessuno sapeva come sarebbe andata. Ma una città sull'acqua resta in piedi solo finché qualcuno ci abita.»`),
    zeno,bridge,home);
  return join(
    t(`Matilde hann bli ${spans.matilde-matilde.birth} år. Den 21 november 2126 går Zeno och Ottavia över den tillfälliga bron till Salute och tänder ett ljus för henne och ett för Nives, som var elva när vattnet kom 1966.`,
      `Matilde lived to ${spans.matilde-matilde.birth}. On 21 November 2126 Zeno and Ottavia walk over the temporary bridge to the Salute and light a candle for her, and one for Nives, who was eleven when the water came in 1966.`,
      `Matilde è arrivata a ${spans.matilde-matilde.birth} anni. Il 21 novembre 2126 Zeno e Ottavia attraversano il ponte provvisorio per la Salute e accendono una candela per lei e una per Nives, che aveva undici anni quando arrivò l'acqua del 1966.`),
    zeno,bridge,home);
}
// How the family is introduced in the Family tab.
export const FAMILY_INTRO={
  sv:'Släkten Vianello i Castello, vid Campo Santa Maria Formosa, fem generationer. De stannade när grannarna flyttade till fastlandet, och i entrén finns blyertsstrecken som visar var vattnet stod 1966 och 2019. Hur länge de lever, var de bor och om de stannar beror på staden du bygger.',
  en:'The Vianello family of Castello, by Campo Santa Maria Formosa, five generations. They stayed when the neighbours moved to the mainland, and in the hall there are pencil lines showing where the water stood in 1966 and 2019. How long they live, where they live and whether they stay depends on the city you build.',
  it:'La famiglia Vianello di Castello, in Campo Santa Maria Formosa, cinque generazioni. Sono rimasti quando i vicini se ne andavano in terraferma, e nell\'androne ci sono le righe a matita che segnano dove arrivò l\'acqua nel 1966 e nel 2019. Quanto vivono, dove abitano e se restano dipende dalla città che costruisci.',
};
export const FAMILY_TITLE={sv:'Släkten Vianello',en:'The Vianello family',it:'La famiglia Vianello'};
