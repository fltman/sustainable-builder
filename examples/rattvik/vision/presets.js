// Rättvik's visions for "Utforska" (the engine adds today's course first), on Rättvik's own levers. The first is
// the research-based one: what holds an ageing bygd together first – homes for every age, care close by, the
// villages' voice and the schools – then the fäbodar, Siljan and the forest, then the centre, the journeys and
// the energy, at a pace a kommun with a thin budget and too few of working age can carry: a step every seven
// years, so that the strain stays near the limit but not over it (model.js capacity()). Radical only where
// Rättvik's research points hardest (homes, care, the villages' voice, the fäbodar, Siljan, the visitors, the
// schools and room for the water); welfare technology stays at the steady level, as the evidence on what it
// saves is thin (rattvik_e5). The others contrast with it. A schedule is a list of {from:year,
// set:{lever:level}} steps, each building on the previous.
// Today's course in Rättvik's model: SCB's projection and the national trends – electric cars, fossil-free
// power – and the emissions trading that brings capture to the lime works by mid-century (model.js).
export const TODAY={short:'Inga nya vägval. Nationella trender rullar på – elbilar, fossilfri el och utsläppshandeln som till sist når kalkverket – men inget mer.'};
export const VISIONS=[
  {id:'siljansbygden',name:'Siljansbygden',short:'Forskningens förslag för Rättvik: börja med det som håller ihop en åldrande bygd – bostäder för alla åldrar, omsorg nära, byarnas röst och skolan – ta hand om fäbodarna, Siljan och skogen, och bygg sedan om centrum, resorna och energin.',
    schedule:[
      {from:2026,set:{bogemenskap:2,forebyggande:2,demokrati:2,kunskap:1,regionalt:1,hav:1,skog:1,beredskap:1,analog:1,anpassning:1,kollektivt:1,turism:1,bilfritt:1,sol:1,effektivitet:1,vind:1,forbindelser:1,ai:1}},
      {from:2033,set:{regionalt:2,kunskap:2,hav:2,beredskap:2,analog:2}},
      {from:2040,set:{anpassning:2,bilfritt:2,turism:2,forbindelser:2,vind:2}},
      {from:2047,set:{bogemenskap:3,kollektivt:2}},
      {from:2054,set:{demokrati:3,forebyggande:3,skog:2}},
      {from:2061,set:{regionalt:3,hav:3,sol:2}},
      {from:2068,set:{turism:3,kunskap:3,effektivitet:2}},
      {from:2075,set:{anpassning:3}},
    ]},
  {id:'teknikorten',name:'Teknikorten',short:'Allt på vindkraft, automation och snabba förbindelser – en energibygd med självkörande skyttlar till byarna – men lite om fäbodarna, naturen, gemenskapen och byarnas röst.',
    schedule:[{from:2026,set:{vind:3,sol:3,ai:3,kollektivt:3,forbindelser:3,effektivitet:2,turism:2,anpassning:2,kunskap:2,beredskap:1,bilfritt:1}}]},
  {id:'fabodbyn',name:'Den nya fäbodbyn',short:'Fäbodarna, skogen och Siljan, och tid och plats för varandra – men ingen ny vindkraft, ingen AI och få nya förbindelser.',
    schedule:[{from:2026,set:{regionalt:3,skog:3,hav:3,analog:3,bogemenskap:3,demokrati:2,forebyggande:2,beredskap:2,kunskap:2,turism:1,bilfritt:1,sol:1,anpassning:1}}]},
];
