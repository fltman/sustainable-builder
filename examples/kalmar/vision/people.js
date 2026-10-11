// The people of Kalmar in the Sims layer (site/src/residents.js): what they work with today, the jobs
// the levers bring, and what they think aloud where they are. Swedish; English in en.js.
export const jobsToday=['undersköterska','lärare','säljare','IT-konsult','snickare','sjuksköterska','busschaufför','ekonom','kock','lagerarbetare','forskare vid Linnéuniversitetet','frisör','elektriker','socionom'];
export const jobsFuture=[['stadsodling','stadsodlare'],['regionalt','andelsbonde på Kalmarslätten'],['hav','musselodlare i Kalmarsund'],['sol','energitekniker i kvarterets energigemenskap'],['vind','tekniker på vindparken'],
  ['effektivitet','reparatör på återbruket'],['bogemenskap','kvartersvärd i Generationshuset'],['demokrati','samordnare för medborgarrådet'],['ai','AI-granskare'],['beredskap','beredskapssamordnare'],
  ['kollektivt','spårvagnsförare'],['forebyggande','hälsocoach på Hälsotorget'],['analog','bibliotekarie i Det analoga huset'],['anpassning','vallvakt och sundsingenjör']];
export const thoughts={
  sleep:['Zzz…'],
  home:['Lugn kväll hemma.','Middag med familjen.','Det är skönt att vara hemma.'],
  screen:['Scrollar lite för länge igen…','Bara ett avsnitt till.','Hm, var det redan så sent?'],
  work:['Mycket på jobbet idag.','Skönt med kortare arbetsdag.','Vi har ett bra gäng på jobbet.'],
  school:['Matte, sen slöjd!','Utedag med klassen idag.','Vi läser en riktig bok i svenskan.'],
  garden:['Bönorna har aldrig vuxit så bra.','Grannen visade hur man beskär äppelträd.','Potatisen ska upp innan helgen.','Odlingen är bästa terapin.'],
  meal:['Långbordet ikväll – alla tar med något.','Nässelsoppa från gatuodlingen!','Det smakar bättre när man äter tillsammans.'],
  market:['Färska jordgubbar från Kalmarslätten!','Byter bröd mot honung.','Torget lever igen.'],
  park:['Fåglarna är tillbaka.','Det luktar lind.','En promenad gör susen.'],
  quay:['Havet glittrar idag.','Doppar tårna i Kalmarsund.','Vattnet är klarare än när jag var liten.'],
  library:['Mobilen ligger kvar i hallen.','Lånade en bok om fågelsång.','Schackklubben träffas ikväll.'],
  care:['Mormor berättade om när bilarna fyllde Storgatan.','Vi bakar med de äldre på torsdagar.','Generationshuset är som en stor familj.'],
};

// What the 19–22-year-olds do: study – or, once the shorter working week comes with a year of civic service
// (Kalmar's arbetstid at its radical level), that year.
export const youth=I=>(I.arbetstid||0)>.8?'gör sitt år av medborgartjänst':null;

// What people think of Kalmar's own changes as they pass them (residents.js asks; null: their usual thoughts).
export function situational(p,id,year,{ctx,vision,hash}){
  let t=null;   // the last that applies wins, as in the residents' own thoughts
  if(id==='quay'&&(ctx.bloom??0)>.4)t='Algblomning igen… ingen badar idag.';
  if(p.walking&&(vision.cars??1)>.6&&hash(p.id+year)<.3)t='Bilarna på gatan bullrar så.';
  if(p.walking&&(vision.depave??0)>.6&&hash(p.id+year*1.3)<.25)t=['Körsbären på Storgatan är mogna!','Det doftar lind hela vägen hem.','Svårt att tro att det var asfalt här en gång.'][Math.floor(hash(p.id*1.1+year)*3)];
  if(id==='work'&&(ctx.I?.ai??0)>.6&&hash(p.id+year*.7)<.3)t=(ctx.I?.demokrati??0)>.5?'AI:n föreslog, men det är vi som bestämmer.':'Jag förstår inte längre hur systemet fattar sina beslut.';
  if(id==='home'&&(ctx.I?.analog??0)>.6&&hash(p.id*2+year)<.3)t='Telefonen ligger i lådan. Vi spelar kort ikväll.';
  if(id==='quay'&&(vision.wind??0)>.4&&hash(p.id*3+year)<.3)t='Vindsnurrorna ute i sundet snurrar fint idag – det är våra.';
  return t;
}
