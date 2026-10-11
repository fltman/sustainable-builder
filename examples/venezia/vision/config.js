// Venice: its names, where things are in the 3D model (metres, x east, z south, the centre of place.json
// at the origin: 45.435 N, 12.3375 E, between Rialto and San Marco) and what the site says about itself.
// The engine reads this as CITY (site/src/city-config.js); the Kalmar and Rättvik examples have the same fields.
export const CITY={
  slug:'venezia',
  // Names, in Swedish and English. `centre` is the part of the city the 3D model shows: the historic city
  // round the Grand Canal's bend, from the Accademia to the Riva degli Schiavoni.
  sv:{name:'Venedig',intro:'Hur vill vi leva i Venedig om hundra år – tillsammans med våra barn, barnbarn och grannar? Vem bor kvar i husen, hur många besökare bär staden, hur lever vi med vattnet som stiger och med MOSE – och vad blir kvar av lagunen?',crises:'högvatten, värmeböljor, pandemi …',genitive:'Venedigs',kommun:'Venedigs kommun',kommunGenitive:'Venedigs kommuns',region:'Veneto',country:'Italien',
    centre:'Venedigs historiska centrum',onCentre:'i Venedigs historiska centrum',centreGenitive:'det historiska Venedigs',tagline:'Ett sekel framåt i lagunen – en hållbar vision',waters:'lagunen',
    model:'Venedig i lagunen',modelOf:'en 3D-modell av Venedig byggd ur OpenStreetMap och Regione Venetos laserskannade höjddata',rise:'havet står {m} m högre år 2126'},
  en:{name:'Venice',intro:'How do we want to live in Venice in a hundred years – with our children, grandchildren and neighbours? Who will still live in its homes, how many visitors can the city carry, how do we live with the rising water and MOSE – and what is left of the lagoon?',crises:'acqua alta, heatwaves, pandemics …',genitive:"Venice's",kommun:'the City of Venice',kommunGenitive:"the City of Venice's",region:'Veneto',country:'Italy',
    centre:'historic Venice',onCentre:'in historic Venice',centreGenitive:"historic Venice's",tagline:'A century ahead in the lagoon – a sustainable vision',waters:'the lagoon',
    model:'Venice in its lagoon',modelOf:"a 3D model of Venice built from OpenStreetMap and the Veneto Region's laser-scanned elevation data",rise:'the sea stands {m} m higher by 2126'},
  it:{name:'Venezia',intro:"Come vogliamo vivere a Venezia fra cent'anni – insieme ai nostri figli, ai nipoti e ai vicini? Chi abiterà ancora le case, quanti visitatori può reggere la città, come conviviamo con l'acqua che sale e con il MOSE – e che cosa resta della laguna?",crises:'acqua alta, ondate di calore, pandemie …',genitive:'di Venezia',kommun:'il Comune di Venezia',kommunGenitive:'del Comune di Venezia',region:'Veneto',country:'Italia',
    centre:'Venezia storica',onCentre:'nella Venezia storica',centreGenitive:'della Venezia storica',tagline:'Un secolo avanti nella laguna – una visione sostenibile',waters:'la laguna',
    model:'Venezia nella sua laguna',modelOf:'un modello 3D di Venezia costruito da OpenStreetMap e dai dati altimetrici laser della Regione del Veneto',rise:'il mare è {m} m più alto nel 2126'},
  // The site's languages, its own first (the first screen offers each).
  langs:['it','en'],
  title:'VENEZIA 2126',
  url:'https://bjarby.com/venezia-2126/',
  meta:{pageTitle:'Venezia 2126',
    description:"Una visione fondata sulla ricerca per una Venezia sostenibile fra cent'anni. A research-based vision of a sustainable Venice a hundred years from now.",
    ogTitle:'Venezia 2126 – un secolo avanti nella laguna',
    ogDescription:"Scegli la strada di Venezia per i prossimi cent'anni e guarda cambiare la città nella sua laguna – una visione fondata sulla ricerca, con una fonte per ogni numero. Choose Venice's path for the next hundred years and watch the city in its lagoon change.",
    ogImageAlt:'Venezia nel 2126: il Canal Grande, Rialto e la laguna.'},
  // Days above 30 °C a year today: 21.7 at Venice, 2001–2025 (research/deep/hav-tidvatten); the site counts
  // days above 30 °C here, not 25.
  hotDaysToday:22,hotThreshold:30,
  // The sun: the place's latitude.
  lat:45.435,lon:12.3375,
  // The model's water surface (y) and the real level it stands for: the lagoon's mean level, +0.353 m (2020–2025) on
  // Venice's own tide-gauge zero (ZMPS, Punta della Salute 1897), which every Venetian tide is given in.
  water:{y:-1.2,level:.35,kind:'sea'},
  // The first view (from the south-east over the Bacino: San Marco, the Grand Canal and Rialto), its home and
  // how far the camera may roam.
  camera:{position:[760,520,820],target:[0,0,0],home:{distance:1000,polar:.95,azimuth:.75},bounds:{minX:-900,maxX:900,minZ:-900,maxZ:900},maxDistance:2100},
  // The planning map's rectangle (planning.js paints streets, roofs and land into it).
  planRect:{minX:-930,minZ:-930,maxX:930,maxZ:930},
  // The whole city is a World Heritage site; these roofs and facades the vision never touches: the Basilica,
  // the Doge's Palace and the Campanile, the Salute, San Giorgio, the Rialto bridge, Ca' d'Oro, La Fenice and the Accademia.
  heritage:[{x:181,z:50,r:45},{x:225,z:105,r:45},{x:121,z:107,r:10},{x:-217,z:490,r:45},{x:450,z:650,r:75},{x:-125,z:-338,r:22},{x:-281,z:-640,r:16},{x:-306,z:158,r:32},{x:-735,z:405,r:32}],
  // Squares that get market stalls and long tables: Campo San Polo, Campo Santa Maria Formosa, Campo Santo
  // Stefano and the Rialto market.
  squares:[{x:-590,z:-290,r:30},{x:300,z:-240,r:24},{x:-555,z:210,r:26},{x:-240,z:-520,r:18}],
  // No car parks to build on and no station inside the model: no tower and no new blocks on parking lots.
  station:null,
  // No wall round the city: MOSE closes the lagoon's three inlets instead (model.js FLOOD.barrier).
  floodWall:false,
  harbour:null,floatingQuarter:null,
  // No cars in the historic city and no bicycles either (the city's police regulations forbid riding them).
  traffic:{car:0,bike:0,pod:0},
  // On foot, by gondola or by water taxi along the canals: no bicycles and no cars in the alleys.
  ride:{modes:['walk','gondola','boat']},
  // Boats from today: water buses on the Grand Canal, in the Giudecca canal and the Bacino, taxis and
  // working boats, and gondolas in the side canals (routes: OpenStreetMap's canal centre lines). The taxi and
  // transport lines follow the model's motor-boat traffic (vision.boats: 1 today, fewer with shared freight and
  // taxis and fewer day-trippers – model.js).
  boats:{
    lines:[
      {kind: "vaporetto", name: "Canal Grande, linjerna 1 och 2", pts: [[-1000, -763], [-840, -819], [-789, -824], [-658, -815], [-567, -789], [-457, -734], [-314, -621], [-167, -525], [-127, -472], [-113, -441], [-102, -394], [-108, -360], [-163, -293], [-216, -246], [-340, -175], [-530, -99], [-574, -87], [-681, -39], [-751, -1], [-801, 42], [-810, 74], [-767, 286], [-702, 350], [-631, 391], [-565, 413], [-529, 418], [-389, 417], [-34, 380], [65, 381], [247, 398]], n: 5, speed: 2.6, lane: 7},
      {kind: "watertaxi", name: "Canal Grande, vattentaxi och transportbåtar", pts: [[-1000, -763], [-840, -819], [-789, -824], [-658, -815], [-567, -789], [-457, -734], [-314, -621], [-167, -525], [-127, -472], [-113, -441], [-102, -394], [-108, -360], [-163, -293], [-216, -246], [-340, -175], [-530, -99], [-574, -87], [-681, -39], [-751, -1], [-801, 42], [-810, 74], [-767, 286], [-702, 350], [-631, 391], [-565, 413], [-529, 418], [-389, 417], [-34, 380], [65, 381], [247, 398]], n: 9, speed: 3.6, lane: 3, color: 7225638, vision: 'boats'},
      {kind: "gondola", name: "Canal Grande vid Rialto", pts: [[-127, -472], [-113, -441], [-102, -394], [-108, -360], [-163, -293], [-216, -246], [-340, -175], [-530, -99], [-574, -87], [-681, -39], [-751, -1], [-801, 42]], n: 3, speed: 1.1, lane: 10},
      {kind: "vaporetto", name: "Giudeccakanalen", pts: [[-1000, 710], [-690, 827], [-460, 887], [-325, 867], [-213, 814], [-92, 743], [-40, 704], [76, 569], [247, 398]], n: 3, speed: 3.4, lane: 25},
      {kind: "vaporetto", name: "Bacino San Marco", pts: [[247, 398], [345, 345], [511, 305], [639, 300], [815, 354], [1000, 471]], n: 2, speed: 3.2, lane: 20},
      {kind: "watertaxi", name: "Bacino San Marco, taxi", pts: [[247, 398], [345, 345], [511, 305], [639, 300], [815, 354], [1000, 471]], n: 4, speed: 4.2, lane: 8, color: 7225638, vision: 'boats'},
      {kind: "gondola", name: "Rio del Palazzo", pts: [[324, 356], [222, -68], [200, -97]], n: 2, speed: 1.1, lane: 0.8},
      {kind: "gondola", name: "Rio de San Trovaso", pts: [[-1000, 658], [-930, 597], [-885, 524], [-867, 489], [-846, 417], [-800, 303], [-784, 294], [-761, 292]], n: 1, speed: 1.1, lane: 0.8},
      {kind: "gondola", name: "Rio San Luca", pts: [[-173, 170], [-192, 160], [-211, 91], [-236, 52], [-270, 14], [-303, -64], [-360, -118], [-383, -157]], n: 2, speed: 1.1, lane: 0.8},
      {kind: "gondola", name: "Rio dei Greci", pts: [[537, -85], [543, 56], [538, 304]], n: 1, speed: 1.1, lane: 0.8},
      {kind: "gondola", name: "Rio San Barnaba", pts: [[-1000, 201], [-792, 172]], n: 1, speed: 1.1, lane: 0.8},
      {kind: "gondola", name: "Rio della Salute", pts: [[-92, 743], [-216, 609], [-238, 543], [-268, 404]], n: 1, speed: 1.1, lane: 0.8},
      {kind: "gondola", name: "Rio de San Vio", pts: [[-565, 413], [-578, 456], [-627, 547], [-688, 692], [-690, 827]], n: 1, speed: 1.1, lane: 0.8},
      {kind: "gondola", name: "Rio de Ca' Foscari", pts: [[-1000, -15], [-925, 22], [-899, 27], [-828, 27], [-801, 42]], n: 1, speed: 1.1, lane: 0.8},
      {kind: "gondola", name: "Rio San Cassian", pts: [[-558, -363], [-490, -457], [-409, -587], [-357, -653]], n: 1, speed: 1.1, lane: 0.8},
      {kind: "gondola", name: "Rio de la Pergola o de Ca' Pesaro", pts: [[-442, -723], [-514, -631], [-593, -543], [-638, -480]], n: 1, speed: 1.1, lane: 0.8},
      {kind: "gondola", name: "Rio de la Fornasa", pts: [[-325, 867], [-365, 687], [-389, 417]], n: 1, speed: 1.1, lane: 0.8},
      {kind: "gondola", name: "Rio dei Santi Apostoli", pts: [[120, -772], [100, -667], [58, -597], [-49, -562], [-116, -568], [-167, -525]], n: 2, speed: 1.1, lane: 0.8},
      {kind: "gondola", name: "Rio dei Mendicanti", pts: [[415, -793], [339, -644], [253, -429], [247, -392]], n: 1, speed: 1.1, lane: 0.8},
      {kind: "gondola", name: "Rio de le Do Torre o de S. Maria Mater Domini", pts: [[-412, -700], [-455, -653], [-574, -441], [-600, -415], [-625, -406], [-652, -387], [-695, -343], [-710, -321]], n: 1, speed: 1.1, lane: 0.8},
      {kind: "gondola", name: "Rio de San Zan Degolà", pts: [[-779, -441], [-819, -496], [-826, -539], [-798, -679], [-789, -754], [-789, -824]], n: 1, speed: 1.1, lane: 0.8}
    ],
  },
  // The pack's meshes the site leaves out (none in a pipeline place).
  hide:/^M_Container/,
  tintMask:true,
  materialAlias:{M_Ground_Ground:'M_Ground_Paving'},
  rideSkip:/^$/,
  alwaysPinned:['piazza','mercato'],
  credits:{
    about:{sv:'Stadsmodellen är byggd med sustainable-builder ur OpenStreetMap (kartdata © OpenStreetMap contributors, ODbL), Regione del Venetos laserskannade terrängmodell (CC BY 3.0, via ARPAV) och Copernicus höjdmodell; marknivåerna är kalibrerade mot Venedigs kommuns höjdkarta (Venezia altimetria, 2009).',
      en:"The city model is built with sustainable-builder from OpenStreetMap (map data © OpenStreetMap contributors, ODbL), the Veneto Region's laser-scanned terrain model (CC BY 3.0, via ARPAV) and the Copernicus elevation model; the ground levels are calibrated on the City of Venice's height map (Venezia altimetria, 2009)."},
    short:{sv:'Kartdata © OpenStreetMap-bidragsgivare · Höjddata © Regione del Veneto, Copernicus',en:'Map data © OpenStreetMap contributors · Elevation © Regione del Veneto, Copernicus'},
  },
  film:null,
  // Who the starting point comes from, for About – set from the research.
  printSources:{sv:'ISTAT, Venedigs kommun, ARPAV och ISPRA',en:'ISTAT, the City of Venice, ARPAV, ISPRA',it:'ISTAT, Comune di Venezia, ARPAV e ISPRA'},
  sources:{sv:'ISTAT, Venedigs kommun, Regione del Veneto, ARPAV, ISPRA, CNR-ISMAR och Eurostat',en:'ISTAT, the City of Venice, the Veneto Region, ARPAV, ISPRA, CNR-ISMAR and Eurostat',it:'ISTAT, Comune di Venezia, Regione del Veneto, ARPAV, ISPRA, CNR-ISMAR ed Eurostat'},
};
