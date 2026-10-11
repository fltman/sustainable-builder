// Venice's visions for "Utforska" (the engine adds today's course first). The first is the research-based
// one; the others contrast with it. A schedule is a list of {from:year, set:{lever:level}} steps, each
// building on the previous.
export const VISIONS=[
  {id:'lagunaviva',name:'Laguna viva',short:'Forskningens förslag för Venedig: börja med bostäder för venetianer, gemenskap och demokrati – en stad som tömts på invånare behöver dem först – ge lagunen tillbaka sina saltängar, lär staden att leva med vattnet, och låt båtarna och husen gå över till el och lagunvärme.',
    schedule:[
      {from:2026,set:{bogemenskap:2,besok:2,demokrati:2,forebyggande:2,analog:1,beredskap:1,hav:2,anpassning:1,kollektivt:1,regionalt:1,kost:1,sol:1,effektivitet:1,kunskap:2,forbindelser:1,arbetstid:1,ai:1}},
      {from:2036,set:{bogemenskap:3,besok:3,anpassning:2,kollektivt:2,regionalt:2,stadsodling:1,bilfritt:1,effektivitet:2,demokrati:3}},
      {from:2046,set:{hav:3,sol:2,vind:2,forbindelser:2,kunskap:3,beredskap:2,ai:2}},
      {from:2056,set:{anpassning:3,kollektivt:3,stadsodling:2,bilfritt:2,kost:2}},
      {from:2066,set:{regionalt:3,effektivitet:3,arbetstid:2,forebyggande:3}},
      {from:2076,set:{sol:3,beredskap:3,kost:3,bilfritt:3}},
    ]},
  {id:'fortezza',name:'Fästningen',short:'Teknik och barriärer: en höjd och helt stängd lagun, AI som styr flödena av besökare och båtar, havsvind och vätgas – men få bostäder för venetianer, och en lagun som slutar andas.',
    schedule:[{from:2026,set:{ai:3,besok:2,anpassning:3,vind:3,sol:2,kollektivt:3,effektivitet:2,forbindelser:3,kunskap:2,beredskap:2}}]},
  {id:'serenissima',name:'Den nya Serenissima',short:'Gemenskap, hantverk och lagunens mat: bostäder åt invånarna, tid för varandra och en lagun som lever – men ingen AI och inga stora tekniska lyft.',
    schedule:[{from:2026,set:{bogemenskap:3,besok:3,analog:3,arbetstid:3,regionalt:3,kost:3,stadsodling:2,hav:3,demokrati:3,kunskap:2,forbindelser:1,bilfritt:2,beredskap:2}}]},
];
