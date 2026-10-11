// Rättvik: its names, where things are in the 3D model (metres, x east, z south, the centre of
// place.json at the origin: 60.886 N, 15.1098 E) and what the site says about itself. The engine reads
// this as CITY (site/src/city-config.js); the Kalmar example (examples/kalmar/vision/config.js) has the
// same fields.
export const CITY={
  slug:'rattvik',
  // Names, in Swedish and English. `centre` is the part of the place the 3D model shows.
  sv:{name:'Rättvik',genitive:'Rättviks',kommun:'Rättviks kommun',kommunGenitive:'Rättviks kommuns',region:'Dalarnas län',country:'Sverige',
    centre:'Rättviks centrum',onCentre:'i Rättviks centrum',centreGenitive:'Rättviks centrums',tagline:'Ett sekel framåt vid Siljan – en hållbar vision',waters:'Siljan',
    model:'Rättvik vid Siljan',modelOf:'en 3D-modell av Rättvik byggd ur OpenStreetMap och Lantmäteriets höjddata',rise:'Siljans hundraårsnivå står {m} m högre år 2126'},
  en:{name:'Rättvik',genitive:"Rättvik's",kommun:'Rättvik Municipality',kommunGenitive:"Rättvik Municipality's",region:'Dalarna County',country:'Sweden',
    centre:'central Rättvik',onCentre:'in central Rättvik',centreGenitive:"central Rättvik's",tagline:'A century ahead by Lake Siljan – a sustainable vision',waters:'Lake Siljan',
    model:'Rättvik by Lake Siljan',modelOf:'a 3D model of Rättvik built from OpenStreetMap and Lantmäteriet\'s elevation data',rise:'Lake Siljan\'s 100-year level is {m} m higher by 2126'},
  title:'RÄTTVIK 2126',
  url:'https://bjarby.com/rattvik-2126/',
  meta:{pageTitle:'Rättvik 2126',
    description:'En forskningsförankrad, Sims-lik framtidsvision för ett hållbart Rättvik om hundra år. A research-based, Sims-like vision of a sustainable Rättvik a hundred years from now.',
    ogTitle:'Rättvik 2126 – ett sekel framåt vid Siljan',
    ogDescription:"Välj Rättviks väg de kommande hundra åren och se orten vid Siljan växa fram – en forskningsförankrad vision med källor för varje siffra. Choose Rättvik's path for the next hundred years and watch the town by Lake Siljan change.",
    ogImageAlt:'Rättvik år 2126: gröna tak, solceller och Siljan.'},
  // Days above 25 °C a year today: SMHI's Leksand station by Siljan, 1991–2020 (research/deep/klimat-vatten).
  hotDaysToday:16,
  // The sun: the place's latitude.
  lat:60.886,lon:15.1098,
  // The model's water surface (y) and the real level it stands for: Siljan in Lantmäteriet's elevation
  // model, 162.18 m RH 2000 (the pipeline's terrain.lake – the regulation limit, 161.78 m RH 1900).
  water:{y:-1.2,level:162.18,kind:'lake'},
  // The first view (from the south-east, over the centre towards Siljan and Kyrkudden), its home and how
  // far the camera may roam.
  camera:{position:[655,560,440],target:[150,0,-50],home:{distance:900,polar:.9,azimuth:.8},bounds:{minX:-850,maxX:850,minZ:-850,maxZ:850},maxDistance:1900},
  // The planning map's rectangle (planning.js paints streets, roofs and land into it).
  planRect:{minX:-880,minZ:-880,maxX:880,maxZ:880},
  // Protected roofs and facades: the church on Kyrkudden and its 87 church stables (riksintresse W89),
  // Vasastenen and the Hvilan pavilion (byggnadsminne).
  heritage:[{x:-720,z:-541,r:40},{x:-791,z:-614,r:75},{x:-625,z:-370,r:10},{x:649,z:559,r:10}],
  // Squares that get market stalls and long tables: the square by the station, and Lokstallarna's yard.
  squares:[{x:405,z:71,r:26},{x:8,z:-265,r:18}],
  // The station: the vertical farm takes the big lot nearest to it.
  station:{x:329,z:118},
  // No flood wall round the centre: Siljan floods slowly, and adaptation here means room for the water.
  floodWall:false,
  // Floating gardens and homes in Rättviken, by Långbryggan.
  harbour:{minX:-420,maxX:-80,minZ:150,maxZ:500},
  floatingQuarter:{minX:-500,maxX:-100,minZ:200,maxZ:650},
  // Boats on Siljan: electric boat buses round Rättviken and out from Långbryggan towards Leksand.
  boats:{
    ferries:{a:{x:-80,z:470},b:{x:-3000,z:3500}},
    loops:[
      [[-100,420],[-350,300],[-550,100],[-650,-150],[-450,-250],[-250,-150],[-150,150]],
      [[-60,480],[-300,700],[-700,800],[-800,500],[-500,450]],
    ],
  },
  // The pack's meshes the site leaves out: the battle-car game's edge containers (gone after a rebuild).
  hide:/^M_Container/,
  // Generated facades take their tint through the texture's alpha (window frames keep their colour).
  tintMask:true,
  // The pack's bare unmapped ground (the battle-car game's dust) is drawn as grass, as a rebuild makes it.
  materialAlias:{M_Ground_Ground:'M_Ground_Grass'},
  // Street names the ride's destination list leaves out.
  rideSkip:/^$/,
  // The places that are always pinned on the map, whatever the plan.
  alwaysPinned:['kyrkan','stationen','torget','langbryggan','kommunalhuset'],
  // What the site credits: About (about) and the postcard (short).
  credits:{
    about:{sv:'Stadsmodellen är byggd med sustainable-builder ur OpenStreetMap (kartdata © OpenStreetMap contributors, ODbL) och Lantmäteriets markhöjdmodell (CC BY 4.0); husen är förbättrade från Street View, foton och ritningar.',
      en:'The town model is built with sustainable-builder from OpenStreetMap (map data © OpenStreetMap contributors, ODbL) and Lantmäteriet\'s ground elevation model (CC BY 4.0); the houses are refined from Street View, photos and drawings.'},
    short:{sv:'Kartdata © OpenStreetMap-bidragsgivare · Höjddata © Lantmäteriet',en:'Map data © OpenStreetMap contributors · Elevation © Lantmäteriet'},
  },
  // No film yet (the film tools make one: film/…).
  film:null,
  // Who the starting point comes from, for About.
  printSources:{sv:'SCB, Kolada, SMHI och Rättviks kommun',en:'Statistics Sweden, Kolada, SMHI, Rättvik Municipality',it:"l'istituto statistico svedese (SCB), Kolada, SMHI e il Comune di Rättvik"},
  sources:{sv:'SCB, Kolada, SMHI, Folkhälsomyndigheten, Region Dalarna, Länsstyrelsen Dalarna, Jordbruksverket, Trafikverket, Valmyndigheten, Rättviks kommun och Lantmäteriet',
    en:'Statistics Sweden, Kolada, SMHI, the Public Health Agency, Region Dalarna, the County Administrative Board of Dalarna, the Board of Agriculture, the Transport Administration, the Election Authority, Rättvik Municipality and Lantmäteriet'},
};
