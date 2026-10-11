# Stad – mark, grönska, mat i staden och kulturarv (deep research)

Compiled 2026-10-08. Companion to `stad.json` (20 indicators). Scope: Kalmar tätort and Kvarnholmen (the 1600s town), with the kommun's plans and food in and near the city.

## Method

**Primary statistics through machine-readable APIs** (each `source.url` opens the table or API call):
- **SCB PxWeb:**
  - MI0805: green space and sealed land per tätort, 2010/2015/2020.
  - MI0803: land with koloniområden per kommun.
- **Jordbruksverket PxWeb:**
  - JO0104B2: arable land use per kommun.
  - JO0102L02 and JO0102R01: horticulture per län.
- **Kolada v3:**
  - U07514: organic food in the kommun's own operations.
  - U60494: organic food in the region's operations.

**Kommun, region and state documents.** Each PDF was read as text and the cited passage checked:
- Kalmar kommun:
  - Miljöbokslut 2023 and 2024.
  - Verksamhetsplan med budget 2024.
  - ÖP chapters "Klimatanpassning" and "Efterföljande processer".
  - ÖP samrådsredogörelse (2022).
  - Klimatanpassningsplan (updated 2025).
  - Samhällsbyggnadsnämndens svar on the 3-30-300 motion (2023).
  - Servicenämnden on odlingslotter (2019, 2021).
- Ekologigruppen's ecosystem-services mapping (2023).
- RAÄ's riksintresse texts for H48 Kalmar (2015 and 2016 versions) and RAÄ's 2015 press release on the revision.
- Länsstyrelsen:
  - Meddelande 2019:08, "Kulturarv och klimatförändringar".
  - Regional bostadsmarknadsanalys 2025.
- Region Kalmar län: Nulägesbild 2025 and Oxford Research's evaluation and outlook (omvärldsanalys) for the regional food strategy.
- SFV Kulturvärden 1/2025.

**Own measurement for Kvarnholmen (greenShare).** No published permeable or sealed share exists for Kvarnholmen, so I sampled Naturvårdsverket's Nationella marktäckedata 2023 (basskikt v2.x, 10 m raster). No raster was downloaded; only per-point JSON answers were read:
1. **Area boundary.** I used OpenStreetMap's boundary for the stadsdel Kvarnholmen (relation 6422397, fetched via Nominatim). It is a 25-vertex polygon covering lat 56.6594–56.6676 and lon 16.3570–16.3736.
2. **Sample grid.** I laid a regular 20 m grid over the polygon, keeping points that fall inside it (ray-casting test). This gave 1 533 points.
3. **Reading the class.** For each point I made one WMS GetFeatureInfo request against `https://geodata.naturvardsverket.se/geoserver/wms`, layer `lc-nmd:LC.LandCoverRaster.Bas.2023.v2.x`, INFO_FORMAT application/json. The response's `Klass` field gives the land-cover class.
4. **Counts** (n = 1 533):

   | Class | Points |
   |---|---|
   | 51 Byggnad | 396 |
   | 53 Väg/järnväg | 338 |
   | 52 Anlagd mark, ej byggnad eller väg | 272 |
   | 62 Hav | 298 |
   | Forest classes 111–117 | 120 |
   | Open vegetated classes (4 2xx) | 97 |
   | 411 Öppen fastmark utan vegetation | 12 |

5. **Shares of land (1 235 points):**

   | Measure | Calculation | Share |
   |---|---|---|
   | Sealed | 1 006 / 1 235 | 81.5 % |
   | Vegetated | 217 / 1 235 | 17.6 % |
   | – of which tree-covered | 120 / 1 235 | 9.7 % |
   | Bare | 12 / 1 235 | 1.0 % |
   | Permeable (vegetated + bare) | 229 / 1 235 | 18.5 % |

   The binomial standard error is √(0.185·0.815/1235) = 0.011, so the 95 % interval is 16.4–20.7 %.

The full NMD2023 basskikt would be needed for a full-pixel count. It is `NMD2023_basskikt_v2_1.zip`, 2.5 GB, at https://geodata.naturvardsverket.se/nedladdning/marktacke/NMD2023/Basskikt_v2_x/. It was not downloaded.

**Search budget:** 25 web searches. All other lookups were direct fetches.

## Findings

### 1. Sealed and permeable land
- **Kalmar tätort, 2020 (SCB):**
  - Land area 2 060 ha.
  - Sealed: 832 ha, **40.4 %**. Of this, buildings 271 ha, roads and rail 230 ha, other sealed 331 ha.
  - Green space: 1 204 ha, **58.4 %** (open land 619 ha, forest 585 ha).
  - Sealed land grew from 781 ha in 2010 to 832 ha in 2020, in step with the larger tätort. The share was nearly flat: 39.9 % in 2010, 40.4 % in 2020.
- **Kvarnholmen, NMD 2023 (own sampling):** about **81–82 % sealed and 18.5 % permeable**. The city core is twice as sealed as the tätort.
  - Only about 10 % of Kvarnholmen's land is tree-covered. The green is concentrated on the western vallar and bastions and on the north-eastern edge (see the ASCII map below).
  - Buildings take up 32 % of the land, so even if every street, square and car park were opened up, the maximum permeable share would be about 68 %.
- **Ekologigruppen's ecosystem-services mapping (2023, done for the grönplan)** names the central belt "från Harbygärde till Kvarnholmen" as the area where "den stora andelen hårdgjorda ytor" gives negative effects. It recommends reducing sealed surfaces, increasing permeable surfaces and planting large trees. The report is 91 MB; I read it as text, and it gives maps but no district percentages.
- **Klimatanpassningsplanen** says the town's sealed surfaces make it extra vulnerable to skyfall and heat islands.
- **The new Grönplan** (adopted by KF on 2026-04-27) is published only as an ArcGIS Experience. No PDF with quantitative targets was found.

ASCII map of Kvarnholmen. S = sealed, T = tree-covered, g = open vegetation, o = bare, ~ = sea. North is up; one character is 20 m.
```
                                 ~S~~~~~~~~~~~~~
                              ~~~~SS~~~~~~~~~~~~
                           ~~~~~~SSS~~~~~~~~~~~~~
                         ~~~~~TTSSSSS~~~~~~~o~~~~
                   ~~~~~~~~~TSSSTSSSSg~~~~ggg~~~~
                ~~~~~~~~~gSSSSSTToTSSTgggTgggo~~~
             ~~~ST~~~~gTSgSSSSSTTTSgSSTggTTggo~~~~
          ~~~~~~~S~ggSSSSTSSSSoTSSSggSTgSSSTgoS~~~
        ~~~~~~~~~SSSTSSSSTTSSSSSSgggSSSSSSSSgoS~~~
       ~~~~gTggSSSSSSSSSSSTSSSTSSggSSSSSSggSTgg~~~~
      ~SSSSSSSSSSSSSSSSSTSSSSSSSSSSSSSSSgSSSSgg~~~
      ~SSSSSSSSSSSSSSTTSTSSSgTSSSSSgSTSSSSSTgTg~~~
     ~~SSSSSSSSSSSSSSSSSSSSSTSSSSSSSgSSSSSgTgSSg~
     ~gSSSSSSSSSSSSSSSSSSTSSSSSSSSSSSSSgSSTSSSSg~
    ~~TTSSSSSSSgSSSSSSSSSSSSSSSSSSSSTTTSSSSSS~~~~
    ~TTTSSSSSSSSSSSSSSSSSSSSSTSSSSSSSTSSSSSSSS~~
    ~~TSSSSSSSSSSSSSSSSSSSSSSSSSSTSSTSSSSSSSSg~~
     ~TSSSgSSSSSSSSSSSSSSSSSSSSSTSSSSSSSSSSSSS~~
     ~gTTSSSSSSSSSSSSSSSSSSSSSSSSSSSSSTSSSSSSSS
     ~~TTgSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS~
      ~~TgSSSSSSSSSSSSSSSSSSSSSSSSSSgSSSSSSSS~
      ~~TgSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS~
      ~~SgSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS~
      ~~TTSSSSSSSSSSSSSSSSSSggSSSSSSSS~SSSS~~
     ~~~TSSSTSSSSSSSSSSSSgSSgSSSSTSSS~~SSSS~
     ~TTTSSTgSSSSSSSSSSSSggSSSSSTTSS~~~~SS~~
    ~~TTTSSSoTSSSSSSSSSSgSSSSSSgTSS~~~~~SS~
    ~~TTTSSSTSSSSSSSSSSSSSSTSSgTSTS~~S~~~~~
   SSTTSSTTSSSSSSSSSSSSSSSSSSggSSSSSSS~~~~
   ~SSSTTTTTSSSSSSSSSSSSSSTTSTSgSgTSSSS~~
 S~SSSSTTTTTSSSSSSSSSSSSSSSSSSTSSSSSSSS~~
SSSSSSTSSSSSTSSSSSSSSSoSSSSgSSSSSSSSSSS~
SSSSSSSSSSSSSgSTSSSSSSSTSSSSSSSSSSSS~~~
~TSSSSSSSSSSSSSggSSSTSSSSSSSSSSTS~~~~
~TgSSSSSSSSSTSTgTgSSSSSSSSSSSSS~~S~~
~~gSSSSoSSSSSSSoogTSSSSSSSSSS~~~~~
~~~gSSSSSSSSSSSSSSSSSSSSSSSSS~~~~
~~~gTSSSSSSSSSSSSSSSSSSSSSSSS~~
~~~~ggSSSSSSSSSSSSSSSSSSSSSS~~
~~~~ggTSSSSSSSSSS  ~~SSSSSS~
~~~~~ggTSSSSSSSS      ~~~~
~~~~~gggSSSS S~
~~~~~~gTSSS
~~~~~~gg
 ~~
```

### 2. Tree canopy
- **i-Tree measurement, spring 2022** (LONA-funded; preliminary result reported to Samhällsbyggnadsnämnden on 2023-01-26):
  - Kalmar tätort has **21.7 %** canopy cover.
  - Of 32 delområden, 10 are above 30 %, 14 below 20 % and 5 below 10 %.
- Miljöbokslut 2024 rounds this to "ca 22 %". The 2024 action plan for 3-30-300 prioritises Malmen, Bremerlyckan and Sandås. Kalmar's first micro-forest (450 plants) was planted in 2024.
- Per the same 2023 reply, SCB's statistics show that 99 % of the tätort's population has a green area within 300 m.

### 3. Kvarnholmen heritage
- **Riksintresse H48 Kalmar** (RAÄ, revised 2015–16).
  - *Motivering:* "Renässansstad med slottsmiljö och befästningssystem samt tillhörande vattenområden … från medeltid och fram till 1600-talet."
  - *Uttryck:*
    - the renaissance castle and its visual link to Kvarnholmen and Grimskär;
    - Gamla staden;
    - remains of vallar, bastions and gates;
    - the 1600s block and plot pattern;
    - straight streets and sightlines;
    - the canals and the green areas on the old fortification grounds;
    - stone houses from the 1600s and 1700s;
    - the low, even silhouette with the Domkyrkan;
    - the timber houses on Östra Malmen.
  - The 2015–16 revision narrowed the area to the 1600s environments. Ängö, parts of Malmen, Kalmarsundsparken and Stensö now fall outside.
- **Protected buildings:** "På Kvarnholmen finns **35 byggnader** som är skyddade som byggnadsminnen" (RAÄ underlag, adopted 2016).
- **Kalmar slott** is a statligt byggnadsminne (SFV) with about **190 000 visitors** a year (SFV 2025).
- **Climate risk (Länsstyrelsen 2019:08).** The scenario is RCP8.5 to 2100: mean sea level +1 m plus a 1.5 m high-water event, 2.5 m above today's mean level. In Kalmar län the following are touched:

  | Heritage type | Share | Count |
  |---|---|---|
  | Byggnadsminnen | 35.3 % | 48 of 136 |
  | q-märkta byggnader | 24.9 % | 622 of 2 497 |
  | Riksintressen | 41.6 % | 32 of 77 |
  | Fornlämningar | 14.4 % | – |

  In Kalmar, "slottet, residenset och klapphuset" lie in the risk zone. The report says the castle has probably never seen water 2.5 m above today's mean level, but this "lär kunna inträffa före år 2100".
- **What the kommun says about adapting:**
  - *ÖP, Klimatanpassning chapter:* the long-term goal is that "Människors hälsa, natur, kulturarv och ekonomiska intressen ska skyddas". It lists four strategies – **anpassa, skydda (vallar och murar), attackera (utfyllnad) och flytta**. New buildings must cope with +2.8 m RH2000. Detailed cost estimates are still missing.
  - *Klimatanpassningsplan:* the riksintressen threatened by rising seas include the "kulturmiljö på och runt Kvarnholmen samt Kalmar slott". "Vissa kajer har redan idag dokumenterat dålig hållfasthet." Action L: "Säkra upp kajer så att inte värdefulla kulturbyggnader skadas exempelvis slottets vallar", and build knowledge of how heritage buildings are affected.
  - *Practice:* 140 m of Ölandskajen was renovated in 2024 "för att klara 100 år till". Länsstyrelsen decided on 2025-09-12 that the quay renovation on Kvarnholmen 2:11 and 2:25 has no significant environmental impact.
- **Kulturmiljöprogram:** the ÖP lists it as "pågående", so none has been adopted. In the ÖP consultation, Kalmar läns museum noted "brister i kunskapsunderlaget vad gäller kulturmiljö".

### 4. Kommun plans
- **Översiktsplan för 2035 med utblick mot 2050:** adopted by KF on 2023-06-19, in force (laga kraft) from 2025-05-30.
  - Per Verksamhetsplan 2024, the ÖP "tar höjd för cirka **82 000 invånare år 2035**". That is about +1.2 % a year from 73 068 in 2025, against +0.5 % in 2025.
  - The adopted ÖP gives no housing numbers per area: the granskning version removed them, leaving priorities to a new bostadsförsörjningsprogram.
- **Housing target (Verksamhetsplan 2024):** at least **500 completed homes a year** as a five-year average, plus 50 villatomter a year.
  - Actual completions in 2025 were about 70 (0.96 per 1 000 inhabitants).
  - Boverket's build-need estimate for FA-region Kalmar, 2024–2033, is 2–2.99 homes per 1 000 inhabitants a year (Länsstyrelsen BMA 2025). This is not a kommun figure, so it is kept out of the JSON.
- **Projects:**
  - *Snurrom / friluftsstaden:* about 1 100 homes done; 8 400 people (VP: about 8 500) can live and work there at full build-out. Planprogram autumn 2023; a structure and quality programme for etapp 4–5 followed on 2024-05-23.
  - *Södra staden etapp 1 (Rinkabyholm):* plan in force 2017-06-27, buildings of 2–6 storeys, centre with sports hall, library and F–9 school. Street and pipe works have been delayed.
  - *Tegelviken 2:4:* 60–70 flats, plan in force 2020-07-21, built by Riksbyggen.
  - *Ölandskajen / Ölandshamnen:* quay renovated in 2024, a park project October 2026–May 2027, and a hotel planned on Kvarnholmen 2:1.
  - *Linnéstaden and Kalmar C:* no verified housing numbers found.
- **Grönplan:** adopted 2026-04-27, replacing the grönstrukturplan. VP 2024 states the ambition of 3-30-300 "där så är möjligt".

### 5. Food in and near the city
- **Allotments and community growing:**
  - SCB: **24 ha** of koloniområden in the kommun in 2020 (59 ha in the län).
  - The kommun rents out **about 250 odlingslotter** on 6 sites (50–250 m² each, 9.68 kr/m² in 2026). There were 317 lots on 9 sites in 2019; the Stallgärdsgatan site was closed that year after problems with illegal building and littering.
  - Koloniträdgårdar are run by associations; no count was verified.
- **Commercial horticulture:**
  - Only **74 ha** of the kommun's 20 129 ha of arable land had trädgårdsväxter in 2025, down from 208 ha in 2020.
  - Kalmar län had 474 ha of horticulture and 28 378 m² of greenhouses in 2023, down from 676 ha and 42 725 m² in 2020. That is 3.5 % of national horticultural area and 1.0 % of greenhouse area, against 2.3 % of the population.
  - Region Kalmar län's Nulägesbild 2025 confirms that the share of arable land used for horticulture is low. It reports 521 ha of trädgårdsväxter in 2024, which comes from SCB arable-use data and differs from Jordbruksverket's horticulture survey.
  - No commercial urban, vertical or greenhouse farm in Kalmar could be verified.
- **Public meals:**
  - Kolada U07514: **24.0 % organic** in 2025, falling from 28.0 % in 2022. The kommun's own target is 30 %.
  - Miljöbokslut 2023: **42.2 % from "närområdet"** in 2023 (40 % in 2021, 45.9 % in 2022), against a target of ≥ 45 %; 82 % organic or Swedish, against a target of 85 %.
  - Miljöbokslut 2024: 53 % Swedish, 25 % organic, 1.6 kg CO2e per kg, about 12 000 portions a day.
  - Region Kalmar län's own kitchens: 48.5 % organic (2025).
- **Regional strategy and self-sufficiency:**
  - No study of Kalmar län's food self-sufficiency was found.
  - Oxford Research's evaluation of the 2016–2025 strategy notes that the "ökad självförsörjningsgrad" work "hade inte påbörjats år 2022".
  - The new strategy *Växande värde 2027–2036* returned 404, so its targets could not be checked.
  - VP 2024 commits the kommun to "ökad livsmedelsproduktion och högre självförsörjningsgrad … genom god dialog med de gröna näringarna".
  - Production capacity is lopsided. Using the SWOT shares from the baseline: chicken 20 %, milk and eggs 12 %, beef 10 % of national output from 2.3 % of the population. That is roughly 8.7×, 5.2× and 4.3× the population share (own calculation). Fruit and vegetables are the bottleneck.

## Own calculation: cityVeg (illustrative, confidence "estimate")
1. **Demand:** Jordbruksverket 2023 gives 62.2 kg fresh and frozen vegetables plus 54.7 kg fresh and frozen fruit and berries = 116.9 kg per person. For Kalmar kommun: 73 068 × 116.9 kg = **8 540 t a year**.
2. **Urban growing area:** 24 ha koloniområden (SCB 2020), plus up to 6.25 ha of municipal lots (250 × 250 m²). How far the two overlap is unknown.
3. **Assumptions (not sourced):**
   - 30–60 % of the area is actually cultivated with food; the rest is huts, paths, lawns and flowers.
   - Yield is 1–4 kg/m². The upper end is just below Jordbruksverket's 2023 commercial field yields: vitkål 42.8, rödbeta 42.1, morot 62.1 t/ha, i.e. 4.2–6.2 kg/m².
4. **Result:**

   | Case | Area | Cultivated | Yield | Harvest | Share of demand |
   |---|---|---|---|---|---|
   | Low | 24 ha | 30 % | 1 kg/m² | 72 t | **0.8 %** |
   | Mid | 24 ha | 45 % | 2 kg/m² | 216 t | **2.5 %** |
   | High | 30 ha | 60 % | 4 kg/m² | 726 t | **8.5 %** |

   Private villa gardens and balconies are not included; no data exist for them.

## Caveats
- The NMD sampling is a 25 % sample of the 10 m pixels inside an OSM district boundary that includes the harbour (Barlastholmen) and some quay areas.
  - NMD rasterises buildings and roads from Lantmäteriet and NVDB. Small courtyard gardens, street trees and green roofs fall below the resolution, so permeable surface is probably slightly underestimated.
  - The classification error has not been quantified here; NMD's own validation reports are linked on the download page.
- SCB's sealed-land figures count bare rock and gravel as sealed. The latest SCB year is 2020.
- The i-Tree canopy figure is preliminary (2022). Miljöbokslut 2024 still quotes "ca 22 %".
- "Närområdet" in the kommun's food reporting is undefined in the source. The 42 % covers only public meals, and 2024–2025 values were not reported.
- The Kalmar slott visitor figure is "senaste årsstatistiken" in a 2025 issue; the year 2024 is inferred.
- Länsstyrelsen's heritage-risk percentages are county-wide desk GIS analyses ("teoretisk skrivbordsanalys"), not a Kvarnholmen-specific inventory.
- Large PDFs (the ecosystem-services report, the climate-adaptation plan, the riksintresse documents) were fetched only long enough to extract text, then deleted. No datasets were stored.

## Still missing
- An official permeable or sealed share for Kvarnholmen. Also the grönplan's quantitative targets (published only as ArcGIS Experience) and the final i-Tree report with canopy per delområde (Kvarnholmen's own figure).
- **Heritage registers:**
  - Number of q-märkta buildings on Kvarnholmen.
  - Domkyrkan's protection status checked on a primary page; it is assumed to be kyrkligt kulturminne, but this was not verified.
  - An adopted kulturmiljöprogram (still under way).
- **Flood risk to buildings:** which Kvarnholmen buildings lie below +2.5 m RH2000. The Länsstyrelsen 2019 report shows this only as a map (Figure 32).
- **Planning numbers:**
  - ÖP population or housing targets for 2050.
  - The new bostadsförsörjningsprogram.
  - Housing numbers for Ölandshamnen, Linnéstaden and Kalmar C.
- **Food strategy:** the text and targets of *Växande värde 2027–2036*, any study of Kalmar län's food self-sufficiency, and the definition of "närområdet" in the kommun's food reporting.
- **Urban growing data:** allotment yields, how much is grown in private gardens, the number of koloniträdgårdsföreningar and lots, and any commercial urban or greenhouse farm in Kalmar.

## Model implications
| Model key | Today | Suggested | Basis |
|---|---|---|---|
| `greenShare` ("Grön mark i stadskärnan") | 0.12 (assumption) | **0.18** (range 0.16–0.21) | NMD 2023 sampling of Kvarnholmen: 18.5 % permeable (17.6 % vegetated). For comparison, the whole tätort is 0.59 (SCB 2020). The model's ceiling of 0.7 fits Kvarnholmen's physical limit of about 0.68, since buildings cover 32 % of the land. If the key is meant to be tätort-wide, use 0.58. |
| `canopy` | 0.22 | **0.22** (keep; 21.7 % measured) | i-Tree 2022, tätort. Kvarnholmen alone is about 0.10 (NMD tree classes). If the 3D scene shows the core, 0.10 is the honest local value. |
| `heritage` | 1.0 (index) | **1.0 at 2026** (definition), but recalibrate the damage terms | Anchor the index to 35 byggnadsminnen on Kvarnholmen, Kalmar slott and riksintresse H48. Let an unprotected 2.5 m event (mean +1 m plus 1.5 m surge) remove **up to about 0.35** of the index, matching Länsstyrelsen's share of the county's byggnadsminnen in the risk zone. The current wall penalty (−0.12 × anpassning) remains an assumption. It has some support in the riksintresse values: visual contact between the slott and Kvarnholmen, the low silhouette, canals and vallar would all suffer from high walls. The kommun's own measures so far are quay reinforcement rather than walls. |
| `cityVeg` | ≈ 0.0175 (0.01 + 0.25 × 0.03) | **0.02** (estimate, range 0.008–0.085) | Own calculation above: 24 ha koloniområden and about 250 municipal lots against 8 540 t a year of fruit and vegetable demand. The current formula is already consistent. |
| `foodRegional` | 0.20 (assumption) | **keep 0.20**, range 0.10–0.30; still `assumption: true` | No published self-sufficiency figure exists. Public kitchens buy 42 % from "närområdet" but serve only about 5.5 % of all meals (12 000 portions ÷ 73 068 × 3 meals), so they add about 0.023. Household sourcing is unknown. The county exports animal products (4–9× its population share), while fruit and vegetables are scarce (74 ha in the kommun, falling). Consider tying the model's upward potential (clamp 0.9) to horticulture expansion. |

Related signals for other modules:
- **Population:** the ÖP plans for 82 000 inhabitants in 2035 (≈ +1.2 % a year), against +0.5 % in 2025.
- **Housing:** the target is 500 completions a year, against about 70 in 2025.
- **Organic public food:** 24 % and falling, a useful indicator for any "kost" or "regionalt" lever.
