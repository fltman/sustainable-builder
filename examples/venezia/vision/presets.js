// Venice's visions for "Utforska" (the engine adds today's course first). The first is the research-based one;
// the others contrast with it. A schedule is a list of {from:year, set:{lever:level}} steps, each building on
// the previous. Laguna viva follows the research's order: homes for Venetians and a limit on short lets first –
// a city that has lost three in four of its people needs residents before anything else – with visitors in
// measure and the people's own say; the city raised and defended so that MOSE closes only when it must and the
// lagoon keeps breathing; the marshes rebuilt and the big ships out; boats and homes on electricity and lagoon
// heat; and, by mid-century, the city lifted with seawater as the sea passes what the gates were built for.
export const VISIONS=[
  {id:'lagunaviva',name:'Laguna viva',short:'Forskningens förslag för Venedig: börja med hem för venetianer och ett tak för turistlägenheterna – en stad som tömts på invånare behöver dem först – och besökare i lagom mängd. Höj och skydda staden så att MOSE bara stänger när det måste och lagunen får andas, bygg saltängarna, ta de stora fartygen ut ur lagunen, och låt båtarna och husen gå över till el och lagunvärme.',
    schedule:[
      {from:2026,set:{bogemenskap:2,korttid:2,besok:2,demokrati:2,forebyggande:2,anpassning:1,hav:2,hamn:1,kollektivt:2,effektivitet:1,sol:1,svalka:1,kunskap:2,regionalt:1,beredskap:1,mose:0}},
      {from:2036,set:{bogemenskap:3,korttid:3,besok:3,demokrati:3,anpassning:2,hamn:2,effektivitet:2,sol:2,svalka:2,regionalt:2,kunskap:3}},
      {from:2046,set:{hav:3,kollektivt:3,forebyggande:3,beredskap:2,anpassning:3}},
      {from:2056,set:{effektivitet:3,regionalt:3,svalka:3,beredskap:3}},
    ]},
  {id:'fortezza',name:'Fästningen',short:'Teknik och barriärer: lagunen regleras och stängs till sist för gott, hamnen flyttas ut i havet, båtar och hus går på el – men få hem åt venetianerna, saltängarna lämnas åt sitt öde, och en lagun som inte får andas blir en sjö.',
    schedule:[
      {from:2026,set:{mose:2,anpassning:1,hamn:2,besok:2,kollektivt:2,effektivitet:2,sol:2,beredskap:3,kunskap:2,korttid:1}},
      {from:2046,set:{mose:3,anpassning:2,kollektivt:3,effektivitet:3}},
    ]},
  {id:'serenissima',name:'Den nya Serenissima',short:'Gemenskap, hantverk och lagunens mat: hemmen åt invånarna, varje besök bokat, en lagun som lever och en röst åt varje sestiere – men inga stora tekniska lyft: staden höjs bara där det går, och husen värms som förr.',
    schedule:[{from:2026,set:{bogemenskap:3,korttid:3,besok:3,demokrati:3,regionalt:3,hav:3,svalka:2,forebyggande:2,kunskap:2,kollektivt:1,anpassning:1,beredskap:2,effektivitet:1,hamn:1}}]},
];
