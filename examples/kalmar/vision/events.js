// Events that test the city. Each resolves against the state it meets: the same drought is a news item
// in a prepared Kalmar and a crisis in an unprepared one. Years are jittered ±2 per run.
// severity 0–1; apply() changes the state (welfare damage, trust, health shocks).
const band=(v,good,mid,bad)=>v<.3?good:v<.6?mid:bad;
// A storm flood: the water reaches this year's 100-year level plus how unusual this storm is (level).
// Below the protection nothing floods; above it, the share of Kvarnholmen and of the harbour districts
// under water follows their ground levels (model.js flooded()); 40 % of the weighted area is the worst case.
const surge=({flooded,s},w)=>w<=s.protection?0:Math.min(1,(.7*flooded(w)+.3*flooded(w,{harbour:true}))/.4);
// Ölandsleden at Tallhagen, the road to the bridge, lies at 2.3 m RH 2000: above that Öland is cut off.
const cutOff=(c,level)=>level>2.3&&!c.s.roadRaised?'Ölandsleden vid Tallhagen stod under vatten, och Öland var avskuret från fastlandet i ett dygn.':'';
export const EVENTS=[
  {id:'torka_2031',year:2031,icon:'☀',title:'Torkasommaren',
    resolve:({s,stress},r)=>{const hazard=.45+.3*stress+.2*r,sev=Math.max(0,hazard*(1-s.water));return {severity:sev,
      text:band(sev,s.water>.6?'Grundvattnet sjönk igen, men våtmarker, vattenplan och sparsamhet höll kranarna rinnande.':'Grundvattnet sjönk till rekordlåga nivåer, men det räckte – den här gången.','Bevattningsförbud i hela kommunen i sex veckor. Bönderna på Kalmarslätten förlorade en del av skörden.','Vattnet ransonerades. Skörden på slätten slog fel och tankbilar körde vatten till Öland och glesbygden.'),
      apply:st=>{st.damage+=.05*sev;st.eventMood-=.02*sev;st.visitShock=Math.max(st.visitShock,.05*(.5+.5*sev));}};}},
  {id:'leveranskris_2038',year:2038,icon:'⚓',title:'Leveranskrisen i Östersjön',
    resolve:({s,localEnergy,preparedness},r)=>{const sev=Math.max(0,(.7+.2*r)*(1-.5*preparedness-.3*s.foodRegional-.2*Math.min(1,localEnergy)));return {severity:sev,
      text:band(sev,preparedness>.55?'Sjöfarten stördes i flera veckor. Kalmar klarade sig på egna lager, egen el och mat från slätten – och grannarna fick hjälp.':'Sjöfarten stördes i flera veckor. Det blev ont om en del varor, men krisen gick över.','Hyllorna gapade tomma i två veckor och elpriset rusade. Frivilliga organiserade matutdelning.','Akut brist på mat och drivmedel. Kommunen öppnade krisberedskapslagren – de räckte inte långt.'),
      apply:st=>{st.damage+=.08*sev;st.eventMood+=sev<.3?.03:-.04*sev;}};}},
  {id:'varmebolja_2044',year:2044,icon:'🌡',title:'Värmeböljan',
    resolve:({s,nature,loneliness,stress},r)=>{const sev=Math.max(0,(.4+.4*stress+.2*r)*(1-.45*nature-.35*(1-s.lowParticipation)));return {severity:sev,
      text:band(sev,nature>.4&&s.lowParticipation<.3?'Tre veckor över 30 grader. Träden gav skugga, grannarna ringde på hos de äldre och ingen dog ensam.':'Tre veckor över 30 grader. Sjukvården klarade trycket.','Överdödlighet bland äldre – många bodde ensamma utan någon som kollade till dem.','Värmen tog hundratals liv i länet. Asfalten höll värmen och många äldre var isolerade.'),
      apply:st=>{st.lifeShock+=.6*sev;st.eventMood-=.03*sev;st.visitShock=Math.max(st.visitShock,.05*(.5+.5*sev));}};}},
  {id:'digitalt_haveri_2049',year:2049,icon:'⚡',title:'Det digitala haveriet',
    resolve:({s},r)=>{const sev=Math.max(0,(.55+.3*r)*(s.digitalDependence-.6*s.analogResilience));return {severity:sev,
      text:band(sev,s.analogResilience>.45?'Nät och betalsystem låg nere i fyra dagar. Kontanter, papperslistor och radio höll staden igång.':'Nät och betalsystem låg nere i ett dygn. Det mesta fungerade igen innan oron spred sig.','Fyra dagar utan betalningar, journaler och tidtabeller. Apoteken stängde.','Samhället stannade. Ingen kunde betala, vården arbetade i blindo och larmsamtal kom inte fram.'),
      apply:st=>{st.damage+=.06*sev;st.eventMood-=.05*sev;st.trust-=.04*sev;}};}},
  {id:'stormflod_2054',year:2054,icon:'🌊',title:'Stormfloden',
    resolve:(c,r)=>{const level=c.level100+-.05+.15*r,sev=surge(c,level);return {severity:sev,level,extra:cutOff(c,level),
      text:band(sev,c.s.protection>2.1?'Vattnet nådde krönet på skyddsvallen – men Kvarnholmen förblev torr.':'Högvatten i Kalmarsund. Ölandskajen och Skeppsbron spolades över, men stadskärnan klarade sig.','Källare och kajer översvämmades. Skeppsbron stängdes i en vecka.','Havet strömmade in över Kvarnholmen. Hundratals hus fick vattenskador och kulturarv förstördes.'),
      apply:st=>{st.damage+=.1*sev;st.eventMood-=.03*sev;st.heritage-=.08*sev;}};}},
  {id:'pandemi_2061',year:2061,icon:'🦠',title:'Pandemin',
    resolve:({s},r)=>{const sev=Math.max(0,(.5+.3*r)*(1-.35*s.aiCapacity*s.aiGovernance-.25*(1-s.lowParticipation)-.2*s.selfHealth));return {severity:sev,
      text:band(sev,s.lowParticipation<.28?'Tidig upptäckt och grannskapsnätverk gjorde att smittan bromsades snabbt. Ingen behövde vara ensam i karantän.':'Smittan bromsades efter några tuffa månader.','Två år av restriktioner. Ensamheten ökade och vården gick på knäna.','Vården kollapsade. Många dog och samhället blev mer splittrat.'),
      apply:st=>{st.lifeShock+=.5*sev;st.damage+=.05*sev;st.lowParticipation+=.03*sev;st.visitShock=Math.max(st.visitShock,.21*(.4+.6*sev));}};}},
  {id:'klimatflykt_2070',year:2070,icon:'🧭',title:'Människor på flykt till Norden',
    resolve:({s,W},r)=>{const sev=Math.max(0,(.3+.5*W.stress)*(1-.4*s.cohousing/.4-.3*s.trust-.2*s.welfare/1.3));return {severity:sev,good:sev<.3,
      text:band(sev,s.cohousing>.15?'Tusentals klimatflyktingar kom till Kalmar. Generationshus och kvarterskök tog emot – många blev odlare, lärare och omsorgsarbetare.':'Tusentals klimatflyktingar kom till Kalmar och de flesta fick snabbt både bostad och arbete.','Bostadsbristen blev akut och tonen hårdnade, men de flesta fann till slut en plats.','Trångboddhet och misstro. Staden delades i "vi" och "de".'),
      apply:st=>{st.pop*=1+.06*(1-sev*.3);st.trust+=sev<.3?.02:-.05*sev;}};}},
  {id:'ai_genombrott_2078',year:2078,icon:'✦',title:'AI-genombrottet',
    resolve:({s},r)=>{const gov=s.aiGovernance,cap=s.aiCapacity;const sev=Math.max(0,cap*(1-gov)-.1);return {severity:sev,good:gov>.5,
      text:gov>.6?'Nya AI-system kunde ta över mycket arbete. Medborgarrådet beslutade att vinsterna skulle bli tid – inte arbetslöshet.':gov>.4?'Automatiseringen tog många jobb. Kommunen hann med omställning, men inte för alla.':'Några få bolag ägde systemen. Arbeten försvann och klyftorna växte.',
      apply:st=>{st.gini+=.05*sev;st.welfare+=.05*(1-sev);st.trust-=.04*sev;}};}},
  {id:'stormflod_2086',year:2086,icon:'🌊',title:'Den stora stormfloden',
    resolve:(c,r)=>{const level=c.level100+.1+.2*r,sev=surge(c,level);return {severity:sev,level,extra:cutOff(c,level),
      text:band(sev,c.s.protection>2.1?'Rekordhögt vatten i Kalmarsund. Vallen och de flytande kvarteren klarade det – folk tittade på från krönet.':'Rekordhögt vatten i Kalmarsund. Kajerna och de lägsta gatorna stod under vatten ett dygn.','Vattnet bröt igenom på flera ställen. Delar av Kvarnholmen fick evakueras.','Kvarnholmen stod under vatten i tre dagar. Frågan om att överge delar av stadskärnan väcktes på allvar.'),
      apply:st=>{st.damage+=.14*sev;st.eventMood-=.05*sev;st.heritage-=.15*sev;}};}},
  {id:'megatorka_2097',year:2097,icon:'☀',title:'Den långa torkan',
    resolve:({s,stress},r)=>{const sev=Math.max(0,(.5+.35*stress+.15*r)*(1-s.water)*(1-.4*s.foodRegional));return {severity:sev,
      text:band(sev,s.water>.6?'Tre torra år i rad. Avsaltning med solel, magasinerat regnvatten och ett jordbruk med levande jordar höll ställningarna.':'Tre torra år i rad. Det var knappt, men vattnet räckte.','Vattenbrist varje sommar. Odlingarna fick prioriteras framför gräsmattor och pooler.','Brunnar sinade. Bönder gav upp och maten fick köpas dyrt utifrån.'),
      apply:st=>{st.damage+=.08*sev;st.eventMood-=.03*sev;st.visitShock=Math.max(st.visitShock,.05*(.5+.5*sev));}};}},
  {id:'energichock_2105',year:2105,icon:'⚡',title:'Energichocken i Europa',
    resolve:({localEnergy},r)=>{const sev=Math.max(0,(.6+.2*r)*(1-Math.min(1,localEnergy)));return {severity:sev,good:localEnergy>1.1,
      text:localEnergy>1.1?'När Europa saknade el exporterade Kalmarsund sin vindkraft. Intäkterna gick till invånarnas energikooperativ.':band(sev,'Elpriserna steg men Kalmars egna sol- och vindkraft dämpade smällen.','Dyr el i två vintrar. Många frös.','Elransonering. Industrin stängde och folk frös i sina hem.'),
      apply:st=>{st.welfare+=localEnergy>1.1?.04:0;st.damage+=.06*sev;}};}},
  {id:'hundraarsstorm_2117',year:2117,icon:'🌊',title:'Hundraårsstormen',
    resolve:(c,r)=>{const level=c.level100+.15*r,sev=surge(c,level);return {severity:sev,level,extra:cutOff(c,level),
      text:band(sev,c.s.protection>2.1?'Den värsta stormen på hundra år. Staden höll – och barnbarnen som byggt vallen fick tacktal på Stortorget.':'Den värsta stormen på hundra år. Kajerna spolades över, men vattnet stannade vid de lägsta kvarteren.','Stora skador på kajerna och de lägsta kvarteren.','Kvarnholmen översvämmades igen. Delar av 1600-talsstaden fick överges till havet.'),
      apply:st=>{st.damage+=.12*sev;st.eventMood-=.04*sev;st.heritage-=.2*sev;}};}},
];
