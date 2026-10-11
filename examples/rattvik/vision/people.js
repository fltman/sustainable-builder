// The people of Rättvik in the Sims layer (site/src/residents.js): what they work with today – care and
// schools, building, shops, the forest, the farms, the lime works and the visitors (research/deep/
// turism-ekonomi: employment by sector) – the jobs Rättvik's own levers bring (levers.js), what they think
// aloud where they are, what they think of the town's own changes as they pass them, and when they retire.
// Swedish; English in en/core.js.
export const jobsToday=['undersköterska','lärare','hemtjänstpersonal','säljare','snickare','sjuksköterska','busschaufför','skogsarbetare','kock','lantbrukare','kalkverksarbetare','frisör','elektriker','campingvärd'];
// [lever, job]: a job comes into the mix as its lever is implemented (residents.js jobFor).
export const jobsFuture=[
  ['regionalt','fäbodbrukare'],['regionalt','mejerist i bygdens mejeri'],
  ['hav','sjövårdare vid Siljan'],
  ['skog','naturbevakare i reservaten'],['skog','herde vid fäboden'],
  ['vind','tekniker i vindparken'],['vind','processtekniker vid kalkverkets koldioxidinfångning'],
  ['sol','energitekniker i byns energigemenskap'],
  ['effektivitet','reparatör i Lokstallarna'],
  ['bilfritt','trädgårdsmästare på Storgatan'],
  ['kollektivt','båtbussförare på Siljan'],['kollektivt','samordnare för byskyttlarna'],
  ['forbindelser','tågvärd på Siljansbanan'],
  ['turism','guide i Siljan Geopark'],['turism','värd på fäbodturerna'],
  ['bogemenskap','värd i Generationshuset'],
  ['demokrati','samordnare för medborgarrådet'],
  ['forebyggande','sköterska i byns hälsostuga'],
  ['ai','AI-granskare'],
  ['analog','bibliotekarie i Det analoga huset'],
  ['kunskap','lärare på lärcentret vid stationen'],
  ['beredskap','beredskapssamordnare'],
  ['anpassning','vattenvårdare längs Siljan'],
];
// What people think where they are – true whatever the plan; what depends on the plan is in situational().
export const thoughts={
  sleep:['Zzz…'],
  home:['Lugn kväll hemma.','Middag med familjen.','Det är skönt att vara hemma.'],
  screen:['Scrollar lite för länge igen…','Bara ett avsnitt till.','Hm, var det redan så sent?'],
  work:['Mycket på jobbet idag.','Vi har ett bra gäng på jobbet.','Fika klockan tre, som vanligt.'],
  school:['Matte, sen slöjd!','Utedag vid Siljan idag.','Vi läser en riktig bok i svenskan.'],
  garden:['Potatisen ska upp innan helgen.','Grannen visade hur man beskär äppelträd.','Rabarbern har aldrig vuxit så bra.','Odlingen är bästa terapin.'],
  meal:['Långbordet ikväll – alla tar med något.','Kolbullar och lingon, som på fäboden!','Det smakar bättre när man äter tillsammans.'],
  market:['Färsk getost från fäboden!','Byter tunnbröd mot honung.','Lingon och hjortron från skogen!'],
  park:['Fåglarna är tillbaka.','Det luktar björk.','En promenad gör susen.'],
  quay:['Siljan glittrar idag.','Doppar tårna i Siljan.','Siljan är spegelblank idag.'],
  library:['Mobilen ligger kvar i hallen.','Lånade en bok om fäbodarna.','Spelmanslaget repar ikväll.'],
  care:['Morfar lär mig spela fiol.','Vi bakar tunnbröd med de äldre på torsdagar.','Generationshuset är som en stor familj.'],
};

// When people retire: Sweden's target age for the pension (riktålder) is 67 from 2026 – the guarantee pension
// from 67 and the income pension from 64 at the earliest (Pensionsmyndigheten); employees may keep working
// to 69 (LAS). The target age then follows life expectancy; the engine takes one age.
export const retireAge=67;

// What people think of Rättvik's own changes as they pass them (residents.js asks; null: their usual thoughts),
// from the levers' implementation (ctx.I) and what the 3D town shows (vision). The last that applies wins.
export function situational(p,id,year,{ctx,vision,hash}){
  const I=ctx.I||{},age=p.family?year-p.birth:p.age0,pick=(list,seed)=>list[Math.floor(hash(seed)*list.length)];
  let t=null;
  // Siljan: the summer boat buses from Långbryggan, the trout, the colour of the water.
  if(id==='quay'&&(vision.waterClarity??.88)>=.88&&hash(p.id*1.1+year)<.2)t='Vattnet är lika klart som när jag var liten.';
  if(id==='quay'&&(vision.waterClarity??.88)<.84&&hash(p.id*3.1+year)<.3)t='Vattnet är brunare än när jag var liten.';
  if(id==='quay'&&(vision.boatLines??0)>=.25&&hash(p.id+year*.31)<.35)t=pick(['Sommarbåten till Leksand går om en kvart.','Vi tar båten till Sollerön på lördag.','Båtbussen lägger till vid Långbryggan.'],p.id*1.7+year);
  if(id==='quay'&&(I.hav??0)>.6&&hash(p.id*2.3+year)<.3)t='Jag såg öring vid Enåns mynning!';
  // The streets: gardens where the asphalt was, the traffic on road 70, the shuttles, Classic Car Week.
  if(p.walking&&(vision.cars??1)>.85&&hash(p.id+year)<.2)t='Mycket trafik på riksvägen idag.';
  if(p.walking&&(vision.depave??0)>.35&&hash(p.id+year*1.3)<.25)t=pick(['Svårt att tro att det var asfalt här en gång.','Smultronen i rabatten på Storgatan är mogna!','Björkarna längs Storgatan är tillbaka.'],p.id*1.1+year);
  if(p.walking&&(vision.pods??0)>.25&&hash(p.id*1.9+year)<.25)t='Skytteln till Boda går om fem minuter.';
  if(p.walking&&(I.bilfritt??0)>.6&&hash(p.id*4.1+year)<.15)t='Skönt att bilveckans cruising har flyttat ut till travbanan.';
  // The square and the meals: the fäbodar's food, visitors outside the summer, the generation houses.
  if(id==='market'&&(I.regionalt??0)>.6&&hash(p.id*5+year)<.3)t='Messmöret kommer direkt från fäboden – brukaren står här själv.';
  if(id==='market'&&(I.turism??0)>.6&&hash(p.id*5.7+year)<.25)t='Turisterna kommer på hösten också nu.';
  if(id==='meal'&&(I.bogemenskap??0)>.6&&hash(p.id*6.7+year)<.3)t='Grannarna i generationshuset lagar middag ihop ikväll.';
  if(id==='garden'&&(I.regionalt??0)>.8&&hash(p.id*7.1+year)<.3)t='Matrådet vill att vi odlar mer potatis i år.';
  // The forest and drier summers.
  if(id==='park'&&(I.skog??0)>.6&&hash(p.id*4.7+year)<.3)t='Ingen kalhuggning i skogen närmast samhället längre.';
  if(id==='park'&&(vision.dry??0)>.45&&hash(p.id*5.3+year)<.35)t='Gräset är brunt – bevattningsförbud igen.';
  // Work, AI and the analogue.
  if(id==='work'&&(I.ai??0)>.6&&hash(p.id+year*.7)<.3)t=(I.demokrati??0)>.5||(I.analog??0)>.5?'AI:n föreslog, men det är vi som bestämmer.':'Jag förstår inte längre hur systemet fattar sina beslut.';
  if(id==='home'&&(I.analog??0)>.6&&hash(p.id*2+year)<.3)t='Telefonen ligger i lådan. Ikväll spelar vi fiol.';
  // Home: the wind the villages own, newcomers who stayed, the old and who comes to see them.
  if(id==='home'&&(I.vind??0)>.6&&age>=20&&hash(p.id*6.1+year)<.2)t='Utdelningen från byns vindkraftsandelar kom idag.';
  if(id==='home'&&age>=25&&age<60&&hash(p.id*8.3+year)<.08)t='Vi flyttade hit för naturen – och stannade.';
  if(id==='home'&&age>=75&&(I.ai??0)>.6&&(I.analog??0)<.4&&hash(p.id*7.9+year)<.3)t='Det är mest kameran som tittar till mig nu.';
  if(id==='home'&&age>=75&&(I.forebyggande??0)>.6&&hash(p.id*7.3+year)<.3)t='Sköterskan från hälsostugan tittade in idag.';
  if(id==='care'&&(I.bilfritt??0)>.6&&hash(p.id*3.7+year)<.3)t='Mormor berättade om när bilarna fyllde Storgatan.';
  // The young: whether they can study further here or think they will move away.
  if(id==='school'&&age>=13&&hash(p.id*9.1+year)<.3){
    if((I.kunskap??0)>.3)t='Jag kan plugga vidare här, på lärcentret vid stationen.';
    else if((I.kunskap??0)<.12&&(I.bogemenskap??0)<.3)t='Efter gymnasiet flyttar jag nog härifrån.';
  }
  return t;
}
