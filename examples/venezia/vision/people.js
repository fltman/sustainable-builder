// The people of historic Venice in the Sims layer (site/src/residents.js): what they work with today, the
// jobs Venice's levers bring (levers.js), what they think aloud where they are, and what they think of the
// city's own changes as they pass them. Swedish; English in en/people.js, Italian in it/people.js. Today's jobs
// follow the city's own mix (research/deep/turism-ekonomi: hotels and restaurants 18 % of the jobs, trade 16 %)
// and its crafts (433 gondoliers, Murano's glassmakers, the squeri).
export const jobsToday=['servitör','hotellreceptionist','kock','butiksbiträde','gondoljär','vaporettoförare','sjuksköterska','lärare','glasblåsare','museivakt','båtbyggare','städare','universitetsforskare','sopåkare med båt'];
// The levers' new jobs (a job joins the pool as its lever is implemented).
export const jobsFuture=[['bogemenskap','värd i ett generationshus'],['korttid','inspektör för turistuthyrningen'],['demokrati','samordnare för medborgarrådet'],
  ['besok','värd för bokade besök'],['hamn','elektriker för landström vid kajerna'],['kollektivt','förare av elvaporetto'],['hav','saltängsbyggare i lagunen'],
  ['hav','faskinbyggare vid saltängarna'],['regionalt','grönsaksodlare på Sant\'Erasmo'],['regionalt','fiskhandlare vid Rialto'],['effektivitet','installatör av lagunvärme'],
  ['sol','tekniker i energigemenskapen'],['forebyggande','undersköterska i hemtjänsten med båt'],['svalka','trädgårdsmästare i klosterträdgårdarna'],['ai','tidvattenanalytiker'],
  ['kunskap','lagunforskare'],['kunskap','båtbyggare i squeron'],['kunskap','restauratör i Arsenalen'],['anpassning','stenhuggare som höjer kajerna'],
  ['mose','slussvakt vid Malamocco'],['beredskap','beredskapssamordnare']];
// Italy's pension age (67; the engine's default too, said here for the place).
export const retireAge=67;
export const thoughts={
  sleep:['Zzz…'],
  home:['Lugn kväll hemma.','Middag med familjen.','Skönt att höra kanalen utanför fönstret.'],
  screen:['Scrollar lite för länge igen…','Bara ett avsnitt till.','Hm, var det redan så sent?'],
  work:['Mycket på jobbet idag.','Vi har ett bra gäng på jobbet.','Turisterna frågade efter vägen till Rialto tre gånger idag.'],
  school:['Matte, sen roddträning!','Vi mäter tidvattnet med klassen idag.','Vi läser en riktig bok i italienskan.'],
  garden:['Fikonen i klosterträdgården mognar.','Grannen visade hur man beskär citronträdet.','Odlingen är bästa terapin.'],
  meal:['Långbordet på campot ikväll – alla tar med något.','Sarde in saor som nonna gjorde.','Det smakar bättre när man äter tillsammans.'],
  market:['Kronärtskockor från Sant\'Erasmo!','Vongole från lagunen idag.','Fiskhandlaren känner mig vid namn.'],
  park:['Måsarna skriker över Giardini.','Skönt med skugga under träden.','En promenad gör susen.'],
  quay:['Lagunen glittrar idag.','Hör man gondolerna?','Tidvattnet är på väg ut.'],
  library:['Läser om acqua granda 1966.','Lånade en bok om Serenissima.','Kören repar ikväll.'],
  care:['Nonna berättade om acqua granda 1966.','Vi bakar baicoli med de äldre på torsdagar.','Generationshuset är som en stor familj.'],
};

// What people think of Venice's own changes as they pass them (residents.js asks; null: their usual thoughts). They
// read what the 3D city shows (vision: the lagoon's level and colour, the raised quays, the residents and their
// ages, the stalls, the dry lawns) and how far the levers have come (ctx.I). The last that applies wins.
export function situational(p,id,year,{ctx,vision,hash}){
  const I=ctx.I||{},h=k=>hash(p.id*k+year);
  let t=null;
  // The lagoon's colour (vision.bloom; waterClarity 0.45 in 2026) and its level against the steps (vision.seaRise:
  // its mean seen from the city, over today's).
  if(id==='quay'&&(vision.waterClarity??.45)>.65&&h(2.3)<.35)t='Vattnet i lagunen är klarare än när jag var liten.';
  if(id==='quay'&&(vision.waterClarity??.45)<.3&&h(2.9)<.35)t='Lagunen är grumlig idag.';
  if(id==='quay'&&(vision.bloom??0)>.4&&h(1.7)<.5)t='Grönt, stillastående vatten igen… det luktar från kanalerna.';
  if(id==='quay'&&(vision.seaRise??0)>.3&&h(3.1)<.3)t='Vattnet står högt mot trappstegen idag.';
  // The raised quays and fondamenta (vision.wall: the metres gained over 0.80 m).
  if(p.walking&&(vision.wall??0)>.25&&h(4.3)<.12)t='Nya trösklar igen – hela kajen har höjts.';
  // The residents in the calli (vision.people against 2026, their share 65+ vision.old) and the visitors (besok).
  if(p.walking&&(vision.people??1)<.7&&h(5.9)<.25)t='Bara resväskor i gränden… var bor alla?';
  if(p.walking&&(vision.people??1)>1.2&&(vision.old??.33)<.32&&h(6.1)<.25)t='Barnen leker på campot igen!';
  if(p.walking&&(I.besok??0)<.05&&(vision.people??1)<.9&&h(7.1)<.15)t='Trängsel på Rialtobron igen…';
  if(p.walking&&(I.besok??0)>.7&&h(7.3)<.2)t='Lätt att komma över Rialtobron idag.';
  // The tourist apartments returned to residents (korttid).
  if(id==='home'&&(I.korttid??0)>.7&&h(8.9)<.3)t='Grannarna mittemot bor här igen – inga nya resväskor varje morgon.';
  // Quiet electric boats (kollektivt).
  if(id==='quay'&&(I.kollektivt??0)>.7&&h(9.7)<.3)t='Så tyst kanalen har blivit.';
  // The stalls at the Rialto (vision.market: 0.15 in 2026, about 17 fish stalls at 0.4, about four at 0.08).
  if(id==='market'&&(vision.market??0)>.4&&h(10.3)<.4)t='Fisk från vallarna och kronärtskockor från Sant\'Erasmo – Rialto lever!';
  if(id==='market'&&(vision.market??0)<.08&&h(10.7)<.4)t='Ännu ett stånd har stängt vid Rialto.';
  // The long tables: the multi-generation houses' kitchens (bogemenskap) and the sestiere's assembly (demokrati).
  if(id==='meal'&&(I.bogemenskap??0)>.6&&h(11.3)<.3)t='Generationshusets kök dukar upp på campot.';
  if(id==='meal'&&(I.demokrati??0)>.6&&h(11.9)<.3)t='Medborgarrådet sitter vid samma långbord ikväll.';
  // The lagoon closed for good (mose at its radical level).
  if(id==='quay'&&(I.mose??0)>.95&&h(12.7)<.3)t='Luckorna står uppe jämt nu – lagunen har blivit en sjö.';
  // Data and AI for the lagoon, with or without the people's say.
  if(id==='work'&&(I.ai??0)>.6&&h(13.1)<.3)t=(I.demokrati??0)>.5?'AI:n förutsåg tidvattnet, men det är vi som bestämmer.':'Jag förstår inte längre hur systemet fattar sina beslut.';
  // Hot summers (vision.dry: the lawns in a warmer world) and shade on the campi (svalka).
  if(p.walking&&(vision.dry??0)>.15&&h(14.9)<.2)t=(I.svalka??0)>.6?'Skönt med skuggan på campot i värmen.':'För varmt för att gå ut mitt på dagen.';
  return t;
}
