// Kalmar: its names, where things are in the 3D model (metres, x east, z south, Stortorget near the
// origin) and what the site says about itself. The engine reads this as CITY (site/src/city-config.js).
export const CITY={
  slug:'kalmar',
  // Names, in Swedish and English. `centre` is the part of the place the 3D model shows.
  sv:{name:'Kalmar',genitive:'Kalmars',kommun:'Kalmar kommun',kommunGenitive:'Kalmar kommuns',region:'Kalmar län',country:'Sverige',
    centre:'Kvarnholmen',onCentre:'på Kvarnholmen',centreGenitive:'Kvarnholmens',tagline:'Ett sekel framåt – en hållbar vision',waters:'Kalmarsund',
    model:'Kvarnholmen i Kalmar',modelOf:'den riktiga 3D-modellen av Kvarnholmen',rise:'havet står {m} m högre år 2126'},
  en:{name:'Kalmar',genitive:"Kalmar's",kommun:'Kalmar Municipality',kommunGenitive:"Kalmar Municipality's",region:'Kalmar County',country:'Sweden',
    centre:'Kvarnholmen',onCentre:'on Kvarnholmen',centreGenitive:"Kvarnholmen's",tagline:'A century ahead – a sustainable vision',waters:'Kalmarsund',
    model:'Kvarnholmen in Kalmar',modelOf:'the real 3D model of Kvarnholmen',rise:'the sea is {m} m higher by 2126'},
  title:'KALMAR 2126',
  // The page head and its link preview (Messenger, Slack, LinkedIn …), both languages in one.
  meta:{pageTitle:'Kalmar 2126',
    description:'En forskningsförankrad, Sims-lik framtidsvision för ett hållbart Kalmar om hundra år. A research-based, Sims-like vision of a sustainable Kalmar a hundred years from now.',
    ogTitle:'Kalmar 2126 – ett sekel framåt',
    ogDescription:"Välj Kalmars väg de kommande hundra åren och se staden växa fram – en forskningsförankrad vision med källor för varje siffra. Choose Kalmar's path for the next hundred years and watch the city change.",
    ogImageAlt:'Kalmar år 2126 i kvällsljus: gröna tak, solceller och Domkyrkan vid Stortorget.'},
  url:'https://bjarby.com/kalmar-2126/',
  // Days above 25 °C a year today (SMHI; the worlds give 2071–2100 in levers.js).
  hotDaysToday:15,
  // The sun: the place's latitude.
  lat:56.66,lon:16.36,
  // The model's water surface (y, metres) and the real level it stands for (m RH 2000): Kvarnholmen's
  // harbour at 0.14 m, so a real height h is drawn at y = h − 1.5.
  water:{y:-1.36,level:.14,kind:'sea'},
  // The first view, its home (the ⌂ button) and how far the camera may roam.
  camera:{position:[-180,230,330],target:[-40,0,-10],home:{distance:520,polar:.82,azimuth:-.45},bounds:{minX:-1650,maxX:900,minZ:-700,maxZ:900},maxDistance:1400},
  // The ground scan's area (landuse.js) and the planning map's rectangle (planning.js paints streets,
  // roofs and land into it).
  scan:{minX:-1000,maxX:480,minZ:-360,maxZ:420},
  planRect:{minX:-1700,minZ:-360,maxX:520,maxZ:620},
  // Landmarks whose roofs and facades are protected (the castle, the cathedral and the town hall square).
  heritage:[{x:-865,z:300,r:120},{x:10,z:-40,r:28},{x:15,z:15,r:12}],
  // Squares that get market stalls and long tables (Stortorget, with the cathedral kept clear, and Larmtorget).
  squares:[{x:20,z:-5,r:30,keepClear:{x:10,z:-42,r:26}},{x:-310,z:-60,r:22}],
  // The station: the vertical farm takes the big lot nearest to it.
  station:{x:-405,z:72},
  // Flood wall along the core's shore (the planning map's land polygon), when adaptation builds it.
  floodWall:true,
  // Water life: mussel lines in the sound, the floating quarter in the north harbour basin, offshore
  // wind further out, wing-sail ships through the sound, ferries to Färjestaden and boat-bus loops.
  mussels:{x:620,z:-420,lines:14,perRow:7,dx:34,dz:420,step:9,buoys:26},
  harbour:{minX:-420,maxX:420,minZ:-480,maxZ:-250},
  floatingQuarter:{minX:-380,maxX:380,minZ:-520,maxZ:-230},
  turbines:{x:1900,z:-1700,cols:6,rows:5,dx:620,dz:700,stagger:310},
  boats:{
    ships:[{x:900,z0:-4200,z1:4200,speed:6.5,phase:0},{x:1350,z0:4200,z1:-4200,speed:7,phase:.45},{x:1800,z0:-4200,z1:4200,speed:6,phase:.8}],
    ferries:{a:{x:470,z:-140},b:{x:5600,z:-900}},
    loops:[
      [[460,-300],[300,-420],[60,-380],[-200,-330],[-380,-300],[-200,-280],[60,-300],[300,-330]],
      [[480,-120],[620,60],[560,260],[460,380],[620,260],[680,40]],
      [[470,-140],[900,-260],[1500,-420],[2400,-600],[1500,-380],[900,-200]],
      [[-40,-330],[120,-450],[400,-520],[700,-430],[400,-470],[120,-400]],
    ],
  },
  // Street names the ride's destination list leaves out.
  rideSkip:/^(Kvarnholmen|Gamla stan|Kom snart igen)$/,
  // The places that are always pinned on the map, whatever the plan.
  alwaysPinned:['stortorget','radhuset','biblioteket','stationen'],
  // What the site credits: About (about) and the postcard (short).
  credits:{
    about:{sv:'3D-modellen av Kvarnholmen kommer från projektet kalmar-kvarnholmen. Kartdata © OpenStreetMap contributors (ODbL). Markhöjder för översvämningarna © Lantmäteriet (CC BY 4.0).',
      en:'The 3D model of Kvarnholmen comes from the kalmar-kvarnholmen project. Map data © OpenStreetMap contributors (ODbL). Ground heights for the floods © Lantmäteriet (CC BY 4.0).'},
    short:{sv:'Kartdata © OpenStreetMap-bidragsgivare · 3D-modell: kalmar-kvarnholmen',en:'Map data © OpenStreetMap contributors · 3D model: kalmar-kvarnholmen'},
  },
  // The film in the pack (film/…) and its length; none: no film button.
  film:{sv:'film/kalmar-2126',en:'film/kalmar-2126-en',poster:'film/poster.jpg',length:{sv:'1½ minut',en:'1½ minutes'}},
  // Who the starting point comes from, for About.
  printSources:{sv:'SCB, Kolada, SMHI och Kalmar Vatten',en:'Statistics Sweden, Kolada, SMHI, Kalmar Vatten',it:"l'istituto statistico svedese (SCB), Kolada, SMHI e Kalmar Vatten"},
  sources:{sv:'SCB, Kolada, Folkhälsomyndigheten, SMHI, SGU, VISS, MCF, Trafikverket, Tillväxtverket, Linnéuniversitetet, Kalmar Vatten, Länsstyrelsen och Lantmäteriet',
    en:'Statistics Sweden, Kolada, the Public Health Agency, SMHI, the Geological Survey (SGU), VISS, the Swedish Civil Defence Agency (MCF), the Transport Administration, the Agency for Economic and Regional Growth, Linnaeus University, Kalmar Vatten, the County Administrative Board and Lantmäteriet'},
};
