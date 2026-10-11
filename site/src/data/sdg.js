import { LANG, L } from '../i18n.js';
import * as PLACE_MODEL from '@city/model.js';
// The 17 global goals (Swedish short names as used by Globala målen / Svenska FN-förbundet) with their
// official colours; each goal's measures (ind) are the place's own, from its SDG_PARTS (below).
export const SDGS=[
  {n:1,name:'Ingen fattigdom',color:'#E5243B',ind:[]},
  {n:2,name:'Ingen hunger',color:'#DDA63A',ind:[]},
  {n:3,name:'Hälsa och välbefinnande',color:'#4C9F38',ind:[]},
  {n:4,name:'God utbildning för alla',color:'#C5192D',ind:[]},
  {n:5,name:'Jämställdhet',color:'#FF3A21',ind:[]},
  {n:6,name:'Rent vatten och sanitet',color:'#26BDE2',ind:[]},
  {n:7,name:'Hållbar energi för alla',color:'#FCC30B',ind:[]},
  {n:8,name:'Anständiga arbetsvillkor och ekonomisk tillväxt',color:'#A21942',ind:[]},
  {n:9,name:'Hållbar industri, innovationer och infrastruktur',color:'#FD6925',ind:[]},
  {n:10,name:'Minskad ojämlikhet',color:'#DD1367',ind:[]},
  {n:11,name:'Hållbara städer och samhällen',color:'#FD9D24',ind:[]},
  {n:12,name:'Hållbar konsumtion och produktion',color:'#BF8B2E',ind:[]},
  {n:13,name:'Bekämpa klimatförändringarna',color:'#3F7E44',ind:[]},
  {n:14,name:'Hav och marina resurser',color:'#0A97D9',ind:[]},
  {n:15,name:'Ekosystem och biologisk mångfald',color:'#56C02B',ind:[]},
  {n:16,name:'Fredliga och inkluderande samhällen',color:'#00689D',ind:[]},
  {n:17,name:'Genomförande och globalt partnerskap',color:'#19486A',ind:[]},
];
export const DOUGHNUT={
  social:[['food','Mat'],['health','Hälsa'],['education','Utbildning'],['income','Inkomst & arbete'],['peace','Trygghet & rättvisa'],['voice','Politiskt inflytande'],['equity','Social jämlikhet'],['gender','Jämställdhet'],['housing','Bostäder'],['networks','Gemenskap & nätverk'],['energy','Energi'],['water','Vatten']],
  ecological:[['climate','Klimatförändringar'],['acidification','Havsförsurning'],['chemical','Kemiska föroreningar'],['nutrients','Kväve & fosfor'],['freshwater','Sötvattenuttag'],['land','Markomvandling'],['biodiversity','Förlust av biologisk mångfald'],['air','Luftföroreningar'],['ozone','Ozonnedbrytning']],
};

// Which of the place's own measures each goal is built from: its SDG_PARTS (@city/model.js), not a fixed list.
for(const g of SDGS){const own=(PLACE_MODEL.SDG_PARTS?.[g.n]||[]).filter(p=>Array.isArray(p)&&typeof p[0]==='string').map(p=>p[0]);g.ind=own;}
if(LANG!=='sv'){for(const g of SDGS)g.name=L(g.name);for(const k of ['social','ecological'])for(const d of DOUGHNUT[k])d[1]=L(d[1]);}
