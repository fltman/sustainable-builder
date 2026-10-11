// Rättvik's visions for "Utforska" (the engine adds today's course first). The first is the
// research-based one; the others contrast with it. A schedule is a list of {from:year, set:{lever:level}}
// steps, each building on the previous.
export const VISIONS=[
  {id:'siljansbygden',name:'Siljansbygden',short:'Forskningens förslag för Rättvik: börja med gemenskap, beredskap, hälsa och demokrati – en åldrande bygd behöver varandra – ta hand om fäbodarna och Siljan, bygg sedan om gatorna och energin.',
    schedule:[
      {from:2026,set:{demokrati:2,bogemenskap:2,analog:2,beredskap:2,forebyggande:2,regionalt:2,kost:2,stadsodling:1,kollektivt:1,sol:2,hav:1,bilfritt:1,arbetstid:1,anpassning:1,effektivitet:1,ai:1,kunskap:1}},
      {from:2036,set:{bilfritt:2,hav:2,regionalt:3,anpassning:2,forebyggande:3,demokrati:3,kunskap:2}},
      {from:2046,set:{vind:2,ai:2,arbetstid:2,kollektivt:2,effektivitet:2,forbindelser:2}},
      {from:2056,set:{stadsodling:2,bogemenskap:3,hav:3}},
      {from:2066,set:{sol:3,anpassning:3,bilfritt:3}},
      {from:2076,set:{beredskap:3,kost:3,kollektivt:3}},
    ]},
  {id:'teknikorten',name:'Teknikorten',short:'Allt på AI, automation och energi – en vindkraftsbygd med självkörande skyttlar – men lite om gemenskap, demokrati och analoga reserver.',
    schedule:[{from:2026,set:{ai:3,sol:3,vind:3,kollektivt:3,effektivitet:2,anpassning:2,stadsodling:1,beredskap:1,kunskap:2,forbindelser:3}}]},
  {id:'fabodbyn',name:'Den nya fäbodbyn',short:'Gemenskap, fäbodar och tid för varandra – men ingen AI och ingen storskalig energi.',
    schedule:[{from:2026,set:{analog:3,arbetstid:3,bogemenskap:3,stadsodling:2,regionalt:3,kost:3,demokrati:2,beredskap:2,bilfritt:2,kunskap:2,forbindelser:1}}]},
];
