# Översvämning – Kvarnholmen: ground levels, extreme sea levels and flood planning

Compiled: 2026-10-08. Data file: `research/deep/oversvamning.json` (17 indicators).
All heights are in **RH 2000**, Sweden's national height system. SMHI, MCF and Lantmäteriet all use it, and 0 m RH 2000 is close to today's mean sea level in Kalmar, which is about +0.12 to +0.17 m.

## Method

### 1. Ground levels on Kvarnholmen

Kalmar kommun's plan documents give only rough levels: "+2 m" on average, and 1.6–2 m for the harbour and station plan area. I found no public table of quay or street levels. I therefore derived ground levels from two public, no-login map services from the Myndigheten för civilt försvar (MCF, formerly MSB). Both are built on Lantmäteriet's national elevation model.

**a) Hazard-map water depths (hotkartor).**
- Sources:
  - `hotkartor_2026` (third flood-directive cycle): layers 92 (+2.7 m) and 93 (+3.4 m).
  - `hotkartor` (2018): layer 168 (+2.46 m).
- These are rasters of water depth at a fixed water level.
- Method: ground = water level − depth, read point by point with ArcGIS `identify`.
- Example: Ölandskajen is 3.4 − 1.89 = 1.51 m. [identify URL](https://gis-tjanster.mcf.se/arcgis/rest/services/Oversvamningskarteringar/hotkartor_2026/MapServer/identify?geometry=16.361737,56.660365&geometryType=esriGeometryPoint&sr=4326&layers=all:93&tolerance=0&mapExtent=16.35,56.65,16.38,56.67&imageDisplay=800,600,96&returnGeometry=false&f=json)
- The three maps agree within 0.04 m at most points and within 0.12 m at worst. The 2018 maps use an older elevation model.
- Points above 3.4 m return NoData.

**b) Coastal flood layers (kustöversvämning).**
- Source: `kustoversvamning` (https://gis-tjanster.mcf.se/arcgis/rest/services/Oversvamningskarteringar/kustoversvamning/MapServer).
- 50 polygon layers show "översvämmad mark vid nivå (RH2000)" from 0.1 m to 5.0 m in 0.1 m steps.
- For each named point I binary-searched the lowest layer that covers it. That level is when the point is reached by sea water flowing over land.
- It is usually equal to the ground level. It is higher when a low pocket sits behind a higher rim. For example, Skeppsbrogatan south has ground at 1.63 m but floods over land only at 2.0 m. In reality water can come up earlier through storm drains that are blocked by high sea levels.

**c) Hypsometry: share of land under each water level.**
- I rendered each `kustoversvamning` layer as a transparent PNG for a 1.9 × 1.9 km box around Kvarnholmen, in memory only, nothing saved. Pixels are 2 m.
- Land is defined as pixels not flooded at 0.1 m. I took the connected land region containing Stortorget.
- I split it with a straight line south of Stationsgatan and Ölandskajen into:
  - **Kvarnholmen proper:** 45.2 ha.
  - **Harbour:** Barlastholmen, Tjärhovet and the rail yard, 51.0 ha. These are joined to Kvarnholmen by filled land in the elevation model.
- I then counted the flooded share at each decimetre.
- Cross-check: the 2026 and 2018 hazard maps, rendered the same way and classified by legend colour, give the same shares within ±2 percentage points:

| Water level | Coastal layers | Hazard maps |
|---|---|---|
| 1.3 m | 1.3 % | 0.9 % |
| 1.85 m | ~7 % | 5.8 % |
| 2.46 m | ~40 % | 38.8 % |
| 2.7 m | 48.9 % | 48.2 % |
| 3.4 m | 64.5 % | 63.9 % |

**d) Point coordinates.**
- From OpenStreetMap Nominatim and Overpass. Each point is usually the middle of a street segment, so a street's lowest end can be lower than the table shows.
- Two archaeology sites were converted from RT90 to WGS84 with Lantmäteriet's published projection parameters.

### 2. Sea levels

- **Extreme levels** come from SMHI rapport 2025-09, *Högvattenhändelser i Kalmar idag och i framtiden*. SMHI wrote it for MSB, and it is the basis of MCF's 2026 hazard maps.
- **Mean sea level projections** come from SMHI's open CSV files: 17–83 percentiles (2022) and the new 5–95 percentiles (October 2025).
- **Observations:**
  - The SMHI open-data API, parameter 6 (hourly), streamed and summarised in memory:
    - Kalmar 2 (Sjöfartsverket, id 35105, in the harbour, since 2009-04-23).
    - Oskarshamn, Kungsholmsfort and Ölands norra udde.
  - SMHI's *Medelvattenstånd 2024* table.

### 3. Plans

I read these documents in full:
- Kalmar kommun's Klimatanpassningsplan, updated 2025.
- The climate adaptation chapter of the översiktsplan.
- The Kvarnholmen 2:6 dagvattenutredning (stormwater study) and samrådsredogörelse (consultation report).
- Länsstyrelsen's Riskhanteringsplan för Kalmar tätort 2022–2027, with its MKB (environmental assessment) and table of goals and actions.
- SMHI's remissvar (consultation response) of 2015 and SMHI's 2014 county report.

### 4. Elevation data

I checked Lantmäteriet's STAC catalogue and tile metadata. I sent only HEAD requests to the data file and downloaded no data.

## Findings

### 1. Ground elevation of Kvarnholmen (m RH 2000)

"Mark" is ground level from the hazard-map depths. "Wet from" is the coastal-layer level at which the point first floods over land. Points are sorted by ground level.

| Place | lat, lon | Mark | Wet from |
|---|---|---|---|
| **Ölandskajen** (gästhamnen quay) | 56.66037, 16.36174 | **1.51** | 1.6 |
| Skeppsbrogatan at Skeppsbron (south end) | 56.66169, 16.36597 | 1.63 | 2.0 |
| Kaggensgatan, south end | 56.66162, 16.36456 | 1.76 | 2.0 |
| Södra Vallgatan | 56.66202, 16.36459 | 1.88 | 2.0 |
| Elevatorkajen | 56.66376, 16.37111 | 1.93 | 2.0 |
| Östra Sjögatan, north end | 56.66610, 16.36468 | 1.93 | 2.1 |
| Stationsgatan (east of Kalmar C) | 56.66155, 16.36125 | 1.97 | 2.0 |
| Proviantgatan at Skeppsbrogatan (motorhome lot) | 56.66307, 16.37034 | 2.09 | 2.0 |
| Kalmar C, Stationsgatan | 56.66154, 16.36002 | 2.20 (2018: 2.08) | 2.2 |
| Fiskaregatan | 56.66477, 16.36295 | 2.20 | 2.2 |
| Larmgatan, south | 56.66134, 16.36288 | 2.27 | 2.3 |
| Skeppsbron | 56.66181, 16.36755 | 2.39 | 2.3 |
| Kaggensgatan, north | 56.66514, 16.36120 | 2.42 | 2.4 |
| Larmgatan, north | 56.66465, 16.35973 | 2.42 | 2.5 |
| Skeppsbrogatan, north (at the läns museum) | 56.66432, 16.37146 | 2.49 | 2.5 |
| Norra Långgatan, west | 56.66399, 16.36274 | 2.57 | 2.6 |
| Västra Vallgatan, north | 56.66378, 16.36026 | 2.74 | 2.8 |
| Lilla Torget | 56.66291, 16.36688 | 3.22 | 3.3 |
| Ölandsgatan | 56.66300, 16.36685 | 3.22 | 3.3 |
| Kalmar läns museum (Skeppsbrogatan 51) | 56.66433, 16.37053 | 3.22 | 3.3 |
| Kv. Åldermannen (Norra Långgatan) | 56.66411, 16.36353 | 3.21 | 3.3 |
| Södra Långgatan, south | 56.66275, 16.36348 | 3.36 | 3.4 |
| Norra Långgatan, east | 56.66541, 16.36764 | 3.36 | 3.4 |
| Proviantgatan at Storgatan | 56.66477, 16.36835 | >3.4 | 3.8 |
| **Stortorget** | 56.66429, 16.36561 | >3.4 | 3.9 |
| Kalmar domkyrka | 56.66452, 16.36540 | >3.4 | 3.9 |
| Storgatan, west | 56.66342, 16.36328 | >3.4 | 3.9 |
| Södra Långgatan, north | 56.66409, 16.36811 | >3.4 | 3.9 |
| **Larmtorget** | 56.66279, 16.36104 | >3.4 | 4.0 |
| Västra Vallgatan at Kalmar teater | 56.66250, 16.36085 | >3.4 | 4.0 |
| Unionsmonumentet (Västerport) | 56.66209, 16.36035 | >3.4 | 4.0 |
| Östra Vallgatan | 56.66567, 16.37137 | >3.4 | 4.0 |
| Bastion Dryaden | 56.66238, 16.35718 | – | 4.0 |
| Storgatan, east | 56.66503, 16.36884 | >3.4 | 4.4 |
| Gamla vattentornet (on a bastion) | 56.66368, 16.35990 | – | >5.0 |

**Outside Kvarnholmen:**

| Place | lat, lon | Mark | Wet from |
|---|---|---|---|
| Barlastholmen | 56.65915, 16.36549 | 2.43 | 2.1 |
| Tjärhovet (low pocket) | 56.65786, 16.37340 | 1.10 | 2.0 |
| Kalmar slott | – | – | >5.0 |

Notes on the place names:
- "Fiskaretorget", "Södra Kanalen" and "Norra Kanalen" do not exist on Kvarnholmen in OpenStreetMap. Kalmar's squares are Stortorget, Larmtorget and Lilla Torget.
- The quays are Ölandskajen (gästhamnen and Ölandshamnen), Skeppsbron and Skeppsbrogatan, and Elevatorkajen.
- Södra Kanalgatan and Norra Kanalgatan are on Malmen.

**Hypsometry of Kvarnholmen proper (45.2 ha).** Share of land flooded over land at each sea level, with no defences.

| m RH2000 | 1.0 | 1.2 | 1.3 | 1.5 | 1.7 | 1.8 | 1.9 | 2.0 | 2.1 | 2.2 | 2.3 | 2.5 | 2.7 | 2.8 | 3.0 | 3.4 | 3.7 | 4.0 | 4.2 | 4.7 | 5.0 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Kvarnholmen | 0.7 % | 1.1 | 1.3 | 2.2 | 3.6 | 5.3 | 8.7 | 16.7 | 22.3 | 29.6 | 33.8 | 41.6 | 48.9 | 52.1 | 57.0 | 64.5 | 74.5 | 86.9 | 93.3 | 98.0 | 98.0 |
| Harbour (51 ha) | 1.2 % | 1.8 | 4.8 | 7.7 | 11.6 | 17.2 | 32.4 | 67.5 | 79.6 | 91.0 | 95.4 | 98.8 | 100 | | | | | | | | |

Kvarnholmen percentiles:

| Percentile | Level |
|---|---|
| 5 % | 1.8 m |
| 10 % | 1.9 m |
| 25 % | 2.1 m |
| **Median** | **2.7 m** |
| 75 % | 3.7 m |
| 90 % | 4.1 m |
| Above 5.0 m | 2 % of the area: the 1600s ramparts and bastions |

The highest natural ground is the ridge along Storgatan and Stortorget, at 3.9–4.4 m.

**Why the island looks like this.** Kalmar läns museum's survey of kv. Åldermannen says that "stora delar av staden är bebyggd på utfylld mark och den ursprungliga strandlinjen gick utmed Norra Långgatan. Den ås av morän som gick längs med Storgatan har med tiden schaktats bort". In short, much of the town is built on fill, the original shoreline ran along Norra Långgatan, and the moraine ridge along Storgatan was later dug away.

The result is a bowl-less island:
- a low rim of quays and filled land at 1.5–2.0 m;
- streets that rise towards the Storgatan ridge;
- ramparts on the west and north-west above 4–5 m.

**Validation against published values:**
- **Länsstyrelsen** (samrådsredogörelse, Kvarnholmen 2:6, 2021): "Planområdets marknivå är 1,6–2 meter över havet" for the harbour and station area. Derived values: 50 % of the harbour area lies below 1.95 m, and Stationsgatan is at 1.97–2.2 m. Consistent.
- **Dagvattenutredning** for Kvarnholmen 2:6 and others (2021):
  - It says the Kvarnholmen sub-area (Larmgatan, Södra Långgatan, Västra Vallgatan, Stationsgatan) has "marken … i genomsnitt på +2 m.ö.h." The derived values are 1.97–2.74 m on these streets near the station, with higher parts further north.
  - Its SCALGO model says that already at +1.85 m parts of the properties are surrounded by water, and at +2.00 m nearly the whole study area is affected. Derived values for the harbour area: 17 % at 1.8 m and 68 % at 2.0 m. Consistent.
- **Kalmar läns museum** reports give rough site heights in RH70 / RT90, which conflict with the derived values. I give them little weight:

| Site | Museum report | Derived |
|---|---|---|
| Åldermannen | "ca 5 möh" | 3.2 m |
| Bagaren 20 | "~3 möh" | >3.4 m (wet from 4.5 m) |

### 2. Extreme sea levels in Kalmar

**Return levels in today's climate** (SMHI 2025-09, Table 1, 90 % credibility interval):

| Return period | Above mean sea level | m RH 2000 |
|---|---|---|
| 50 years | 109 cm | **1.23** (1.17–1.29) |
| 100 years | 115 cm | **1.29** (1.22–1.36) |
| 500 years | 125 cm | **1.39** (1.31–1.48) |

These are relative to the 1995–2014 mean, 14 cm RH 2000. SMHI used a Bayesian hierarchical model with 44 stations, because Kalmar has no long record. SMHI notes that Kalmar is "betydligt mycket mer utsatt vid nordliga eller sydliga stormar" (much more exposed to northerly or southerly storms). Öland damps other directions. Wave effects are not included.

**Future 100-year levels, including land uplift** (cm RH 2000, 90 % interval):

| Scenario | 2100 | 2150 |
|---|---|---|
| SSP2-4.5 | 176 (138–215) | 202 (134–271) |
| SSP3-7.0 | 185 (137–234) | 222 (134–309) |
| SSP5-8.5 | 197 (144–250) | 241 (142–339) |

The 500-year levels are 10 cm higher. MCF's 2026 hazard maps for Kalmar use the **upper bounds**, rounded:
- 1.3 m for the 50-year level today;
- 2.7 m for the 100-year level in 2150 under SSP2-4.5;
- 3.4 m for the 100-year level in 2150 under SSP5-8.5;
- 2.8 and 3.5 m for the 500-year levels.

The layer names in the `hotkartor_2026` service show this.

**Mean sea level** (cm RH 2000): median, then the 17–83 % range, then the 5–95 % range.

| Scenario | 2100 | 2150 |
|---|---|---|
| SSP1-2.6 | 47 | 58 |
| SSP2-4.5 | 61 (44–84; 35–104) | 87 (55–131; 40–165) |
| SSP5-8.5 | 82 (58–113; 45–140) | 126 (80–187; 57–236) |
| SSP5-8.5 low-likelihood | 91 | 189 (80–488; 57–559) |

- The projections are net of land uplift: total 0.195 cm/yr, of which 0.066 is elastic.
- The rise relative to 1995–2014 by 2150 is 73 cm under SSP2-4.5 and 112 cm under SSP5-8.5.
- The model's end year, 2126, interpolated from the 2120 and 2130 medians, gives these mean levels and 100-year levels (+1.15 m):

| Scenario | Mean level 2126 | 100-year level 2126 |
|---|---|---|
| SSP1-2.6 | ≈ 0.52 m | 1.67 m |
| SSP2-4.5 | ≈ 0.74 m | **1.89 m** |
| SSP5-8.5 | ≈ 1.03 m | **2.18 m** |

**Observed records:**

*Kalmar 2 (Sjöfartsverket):*
- Highest since 2009: 92 cm above mean sea level in January 2012 (SMHI 2025-09).
- In the hourly RH 2000 series, which is uncontrolled before 2019-07-01, the peak is 109.6 cm on 2012-01-14 00 UTC.
- Highest quality-controlled hourly value: 104.1 cm on 2019-01-02 07 UTC (storm Alfrida).
- 2017-01-04: 102.9 cm (uncontrolled). The kommun's plan has a photo of high water at Elevatorkajen in January 2017.
- Annual maxima 2010–2025 average **0.86 m RH 2000**, range 0.67–1.10 m. This is my own calculation from the hourly API data.

*Neighbouring stations, cm above mean sea level (SMHI 2025-09):*
- Oskarshamn: 115 (4 January 2017).
- Kungsholmsfort: 133 (January 1914). That is 147 cm RH 2000 in the hourly file and "+1,46 m" in the dagvattenutredning.
- Ölands norra udde: 136 (January 1914).

*Mean sea level now:*
- SMHI computes Kalmar's 2024 mean at **12.4 cm RH 2000**, with apparent land uplift of only 0.06 cm/yr at the station.
- The 2016–2026 hourly mean is 16.8 cm (own calculation).
- So the 1995–2014 reference of 14 cm is still a good estimate of today's mean, within ±3 cm.

**Older values, kept for traceability:**
- SMHI 2014, *Havsnivåer i Kalmar län*, today's 100-year levels:
  - Kungsholmsfort 124 cm RH2000 (107–138);
  - Oskarshamn 101;
  - Ölands norra udde 136.
- The 2014 report put the 2100 levels for the county at 220–230 cm, with +98 cm global rise.
- MSB hazard maps 2018, end of century under RCP8.5:
  - 100-year level 1.85 m;
  - 200-year level 1.90 m;
  - BHN (beräknad högsta nivå, highest computed level) 2.46 m.
- Länsstyrelsen's riskhanteringsplan: BHN **today** is 1.60 m RH 2000, and BHN 2120 is 2.78 m. The 2120 value gives the 2.8 m rule for new buildings.

### 3. What the kommun and Länsstyrelsen plan

**Rule for new buildings.** The kommun's översiktsplan says new buildings, infill and utility networks must withstand "naturligt översvämmande vatten upp till nivån +2,8 meter över nollplanet (RH2000)". The dagvattenutredning says: "Nu anpassas nya hus och gator i Kalmar till ett vattenstånd av +2,8 m.ö.h. Marginalen kan komma att ökas framöver". In short, new buildings and streets are now designed for +2.8 m, and the margin may be raised.

**Existing buildings.**
- Länsstyrelsen says flood risk up to BHN, today 1.60 m, should already be considered for existing homes and essential services.
- The riskhanteringsplan 2022–2027 contains only knowledge, information and planning actions. Examples:
  - identify buildings, rescue routes, cultural assets and pumping stations;
  - E1.1: a socio-economic damage analysis at BHN 2100, due 2024;
  - E1.2: a cost-benefit analysis of physical measures, due 2026.
- **Länsstyrelsen made no cost-benefit analysis**, and no physical defence is decided.
- At the 2100 100-year level, the plan says about 30 workplaces with about 150 employees are affected. At BHN, more than 480 workplaces with about 2,700 employees are affected.

**Physical options discussed, none decided or costed:**
- The kommun's plan lists "Förstärkta kajer, upphöjd och förstärkt infrastruktur samt invallning av extra utsatta områden": strengthened quays, raised infrastructure and embankments around the most exposed areas.
- The dagvattenutredning says high sea levels are hard to adapt to without "en vall eller slussluckor anläggs ute i Kalmarsund" (an embankment or sluice gates in the sound). It also mentions:
  - "slussar/portar och vallar mot havet i kombination med pumpning" (locks or gates and embankments, plus pumping);
  - possibly closing off part of the harbour basin;
  - a small embankment by raising Sylvanderparken;
  - sandbags at the Ölandshamnen runoff path.
- It warns that raising ground at the quay edge worsens cloudburst drainage. It also says freedom to change ground levels is "starkt begränsad" (strongly limited) because of archaeology and cultural-heritage restrictions.

**Harbour and railway station.**
- Kalmar hamn in its current form copes with about **70 cm permanent rise**, but may need strengthening against temporary high water.
- Gästhamnen is "kraftigt" affected if mean sea level rises more than about 0.7 m above today.
- The kommun is investigating moving and climate-proofing the railway station.
- Some quays already have documented poor bearing capacity.

**Riksintresse for cultural heritage.**
- The riskhanteringsplan names threats to:
  - the 1600s ramparts on Kvarnholmen (saltwater damage);
  - the unexcavated medieval cultural layers, which are protected as ancient remains;
  - the stone burgher houses and listed buildings.
- Goal K2 is that values of riksintresse for kulturmiljövården shall not be damaged by flooding, to be met by 2027.
- The kommun's plan action L is "Säkra upp kajer så att inte värdefulla kulturbyggnader skadas exempelvis slottets vallar" (secure the quays so valuable cultural buildings are not damaged, for example the castle ramparts).
- Walls or raised quays along the 1600s quay line would therefore conflict with the same riksintresse they protect. That is the trade-off the model's `heritage` term represents.

**Unknown.** The klimatanpassningsplan plans an "inriktningsbeslut" (policy decision) on how high sea levels are to be handled, including cost-benefit analysis. I could not find it published.

### 4. Open elevation data for a 1 m grid

**Lantmäteriet Markhöjdmodell** (STAC collection `dtm-cog`):
- 1 m grid, GeoTIFF/COG, float32, deflate, 512 px tiles.
- Coordinate system EPSG:5845 (SWEREF99 TM + RH 2000).
- Licence **CC BY 4.0**: the catalogue says "avgiftsfria och tillgängliga för användning under Creative Commons licens CC BY 4.0". It is a high-value dataset (HVD).

**Tile covering Kvarnholmen:** `m628_58` (E 580000–590000, N 6280000–6290000).
- Size: 249,474,133 bytes, about 250 MB.
- Data: https://dl1.lantmateriet.se/hojd/data/grid/mhm/62_5/m628_58.tif
- Breaklines: `m628_58_brytgeometri.gpkg`, 0.48 MB.
- Metadata:
  - Height uncertainty 0.1 m, horizontal 0.3 m.
  - Airborne laser scanning, survey dates 2012-03-13 to 2026-04-11.
  - Data modified 2026-09-08.
- The southern tip of Tjärhovet may need tile `m627_58`.

**Access:**
- The STAC search, the `*_info.json` and the thumbnail are public.
- The data file returns HTTP 401 (Basic auth). Lantmäteriet's guide says the product must first be ordered via Geotorget, and private users log in with their Geotorget credentials. **So the data is open, but it cannot be downloaded without an account.**
- A Kvarnholmen crop of about 1.3 × 1.0 km at 1 m is about 1.3 M cells, about 5 MB as float32.

**No-account alternative (used here).** MCF's coastal layers (0.1 m steps, 0.1–5.0 m) and hazard-map depth rasters can be queried and rendered without login. Together they give an effectively 0.1 m-quantised elevation map for everything below 5 m.
- REST/WMS: https://gis-tjanster.mcf.se/arcgis/services/Oversvamningskarteringar/kustoversvamning/MapServer/WmsServer
- The MCF download page offers the coastal layers only for all of Sweden. The file size is not stated.

## Caveats

- **Bathtub model.** Both MCF products are static water levels with no waves, no wind set-up inside the harbour and no time limit. Short peaks (SMHI: high water in Kalmarsund is "relativt kortvariga", fairly short-lived) may not fill low areas fully.
- **Backflow through drains comes first.** The dagvattenutredning notes that pipe outlets are at about +0.3 m, so the storm-water network is backed up during high sea levels. Low streets such as Skeppsbrogatan south (1.63 m) can flood through gullies before the sea overtops the quay rim (2.0 m).
- **Point values.** These are single points on street centrelines. Kerbs, doorsteps and floor levels are unknown. Indoor flooding usually starts 0.1–0.3 m above street level, but that is general knowledge, not a Kalmar figure.
- **Generalisation.** The coastal layers are generalised: islands under 5,000 m² are removed. The elevation model's resolution and vintage for these layers are not stated. The hazard-map rivers use the 2 × 2 m national model. 2026 and 2018 products differ by up to 0.12 m.
- **Stationary storms.** SMHI's return levels assume storm statistics do not change, which SMHI states is established practice but a simplification.
- **The Kvarnholmen outline is my own cut** of the connected land region. The quay and harbour strip south of Stationsgatan is counted as harbour.

## Still missing

- **Quay crests and walls.** Measured crest levels and condition of the individual quays: the kommun's quay inventory exists but is not public.
- **Floor and threshold levels** of buildings on Kvarnholmen.
- **Defence plans:** any decided or costed defence plan (wall, gates or harbour barrier), Länsstyrelsen's cost-benefit analysis due 2026, and the kommun's "inriktningsbeslut" on high sea levels. None was found.
- **Historical floods** on Kvarnholmen with levels, such as 1872, 1904 and 1914. Only neighbouring-station records were found.
- **Exact crest heights** of the ramparts and highest point. Above 5 m they cannot be read from MCF layers. The 1 m Lantmäteriet model needs an account.
- **Wave run-up** and seiche amplitude in Kalmar harbour.

## Model implications

The current model (`src/model.js` ≈ l.114–119) uses `protection = 1.9` against `seaRise + surge100` with `surge100 = 1.75`, an assumption. The findings replace both numbers and give a measurable flood extent.

**1. Use absolute water level in m RH 2000.**
- `level100 = 1.29 + seaRise`.
- Today's 100-year level is 1.29 m (SMHI 2025, 90 % 1.22–1.36). That is 1.15 m above mean sea level plus the 1995–2014 mean of 0.14 m.
- The 1.75 m surge overstates the extreme by about 0.45 m, because surge plus mean level today is 1.29.
- `seaRise` can stay as defined. Today's observed mean (0.12–0.17 m) equals SMHI's reference within ±3 cm.
- Check against SMHI for 2100: SSP2-4.5 gives 1.29 + 0.47 = 1.76 m, matching SMHI's 176 cm. SSP5-8.5 gives 1.29 + 0.68 = 1.97 m, matching 197 cm.
- Worlds in 2126:

| World | `seaRise2126` | 100-year level 2126 | SMHI interpolation |
|---|---|---|---|
| ssp126 | 0.35 | 1.64 m | 1.67 m |
| ssp245 | 0.62 | 1.91 m | 1.89 m |
| ssp585 | 0.89 | 2.18 m | 2.18 m |

**2. Change the protection baseline from 1.9 to 1.8 m RH 2000**, the level where streets begin to flood (estimate):
- At 1.8 m, 5 % of Kvarnholmen is flooded.
- Already below it: Ölandskajen 1.51, Skeppsbrogatan south 1.63, Kaggensgatan south 1.76.
- At 2.0 m: 17 %, including Stationsgatan, Södra Vallgatan, Elevatorkajen and Östra Sjögatan.
- Today's margin is 1.8 − 1.29 = **+0.51 m**. With the existing sigmoid (scale 0.18), floodRisk is ≈ 0.06 today.
- In 2126 the margin and risk become:

| World | Margin 2126 | floodRisk |
|---|---|---|
| SSP1-2.6 | +0.16 | 0.29 |
| SSP2-4.5 | −0.11 | 0.65 |
| SSP5-8.5 | −0.38 | 0.89 |

A stricter definition, "the first quay gets wet", would be 1.5 m.

**3. Lever `anpassning`: `protection = 1.8 + 1.6·I.anpassning`**, maximum 3.4 m, instead of 1.9 + 1.4. Suggested steps:
- **⅓ → 2.3 m:** local measures at the five low points, such as demountable barriers, sandbag plans and raised quay sections, plus backflow valves on storm outlets.
- **⅔ → 2.8 m:** raised quays and gates. This equals the kommun's planning level for new buildings and BHN 2120.
- **3/3 → 3.4 m:** a harbour barrier with gates and pumps, sized for MCF's highest 2150 hazard level (SSP5-8.5, 100 years, upper bound).

Keep the heritage penalty. Sources say walls on the 1600s quays conflict with the riksintresse (RHP goal K2).

**4. For the 3D view, use hypsometry instead of only a sigmoid.**
- Flooded share of Kvarnholmen at water level W, with no defences, from the coastal layers:
  `[[1.2,.011],[1.3,.013],[1.4,.018],[1.5,.022],[1.6,.028],[1.7,.036],[1.8,.053],[1.9,.087],[2.0,.167],[2.1,.223],[2.2,.296],[2.3,.338],[2.4,.383],[2.5,.416],[2.6,.451],[2.7,.489],[2.8,.521],[2.9,.550],[3.0,.570],[3.2,.596],[3.4,.645],[3.6,.710],[3.8,.777],[4.0,.869],[4.2,.933],[4.5,.949],[4.7,.980],[5.0,.980]]`
- Harbour area (Barlastholmen, Tjärhovet, rail yard):
  `[[1.3,.048],[1.5,.077],[1.7,.116],[1.8,.172],[1.9,.324],[2.0,.675],[2.1,.796],[2.2,.910],[2.3,.954],[2.4,.986],[2.6,1]]`
- Rule: if W ≤ protection the share is 0; otherwise the share follows the table at W (overtopping).
- 100-year event by scenario:

| Scenario | 100-year level | Kvarnholmen flooded | Harbour flooded |
|---|---|---|---|
| Today | 1.29 m | ≈ 1 % | – |
| 2100 SSP2-4.5 | 1.76 m | ≈ 5 % | 15 % |
| 2126 SSP2-4.5 | 1.89 m | ≈ 8 % | – |
| 2126 SSP5-8.5 | 2.18 m | ≈ 28 % | 89 % |
| 2150 SSP5-8.5 | 2.41 m | ≈ 39 % | – |
| 2150 SSP5-8.5, upper bound | 3.39 m | ≈ 64 % | – |

**5. Street order in the 3D view: what floods first.** Use the "wet from" level from the table above. The order by rising water level is:
1. Ölandskajen (1.5–1.6 m).
2. Skeppsbrogatan south, by gully backflow (1.6 m).
3. Kaggensgatan south (1.8 m).
4. Södra Vallgatan, Elevatorkajen, Östra Sjögatan north and Stationsgatan (1.9–2.0 m).
5. Kalmar C and Fiskaregatan (2.2 m).
6. Larmgatan and Skeppsbron (2.3 m).
7. Kaggensgatan north and Skeppsbrogatan north (2.4–2.5 m).
8. Norra Långgatan west (2.6 m).
9. Lilla Torget and Ölandsgatan (3.2–3.3 m).
10. Stortorget and Domkyrkan (3.9 m).
11. Larmtorget (4.0 m).
12. Storgatan east (4.4 m).
13. Ramparts above 5 m.

**When each threshold is reached.** First year the 100-year level reaches each threshold, using SMHI medians:

| Threshold | 100-year level | SSP2-4.5 | SSP5-8.5 |
|---|---|---|---|
| Ölandskajen | 1.5 m | ≈ 2052 | ≈ 2050 |
| First streets | 1.8 m | ≈ 2112 | ≈ 2085 |
| Stationsgatan, 17 % of island | 2.0 m | ≈ 2146 | ≈ 2106 |

**6. Other thresholds for model events:**
- **Typical yearly storm.** The average annual maximum is 0.86 m RH 2000. It reaches Ölandskajen (1.5 m) when seaRise ≈ 0.65 m and the first streets when seaRise ≈ 0.95 m. That is "every winter" nuisance flooding late in the century under SSP5-8.5.
- **Replay of storm Alfrida** (1.04 m in 2019) at 2126 SSP2-4.5: about 1.64 m, so Ölandskajen and Skeppsbrogatan south are under water.
- **Harbour and gästhamn** need rebuilding when the mean level rises more than 0.7 m above today, that is mean ≈ 0.85 m RH 2000. This happens around 2105 under SSP5-8.5 and around 2145 under SSP2-4.5 (medians).
- **Existing buildings stress test:** BHN today is 1.60 m RH 2000.


## Validering mot Lantmäteriets markhöjdmodell (2026-10-08)
Efter genomgången hämtades Lantmäteriets Markhöjdmodell (1 m, RH 2000, CC BY 4.0; rutorna 627_58 skannad 2022 och 628_58 skannad 2019) med `tools/fetch-dem.mjs` och samplades på modellens 2 m-rutnät. Höjdmodellen ligger rätt mot modellens kustlinje (bästa förskjutning under 2 m).

| | Härlett ur MCF:s kartor | Lantmäteriet |
|---|---|---|
| Larmtorget | 4,0 | 4,00 |
| Stortorget | ca 3,9 | 3,77 |
| Kalmar C | 2,20 | 2,34 |
| Kalmar slott | > 5,0 | 4,84 (holmen) |
| Kvarnholmen, median | 2,7 | 2,68 |
| Kvarnholmen, 25:e percentilen | 2,1 | 2,07 |

Andel av Kvarnholmen (landpolygonen, 49,6 ha) som havet når vid en viss nivå, beräknat med en *priority flood* från öppet vatten (en svacka bakom en kaj blir blöt först när kajen spolas över), `tools/flood-map.mjs`; inom parentes tabellen ovan: 1,5 m 4 % (2 %), 1,8 m 9 % (5 %), 2,0 m 19 % (17 %), 2,2 m 32 % (30 %), 2,5 m 44 % (42 %), 3,0 m 58 % (57 %). Skillnaden i de lägsta nivåerna beror på att polygonen tar med kajkanterna. Modellens tabell behålls; höjdmodellen styr var vattnet ritas i 3D.
