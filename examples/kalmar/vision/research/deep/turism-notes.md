# Turism – tourism in Kalmar and on Öland (deep research)

Compiled 2026-10-09. Companion to `turism.json` (33 indicators) and `turism.en.json`. Scope:
- **Kalmar kommun:** city tourism, events and the Kalmarsund coast.
- **Öland:** Borgholm and Mörbylånga. These records use scope "Kalmar län" with "(Öland)" in the name.
- **Kalmar län:** county figures for the visitor economy.

Existing records were not changed:
- `kalmar_slott_besokare`: about 190 000. No newer official figure was found.
- `gasthamn_batplatser`: 150.
- `olandsbron_fordon_per_dygn_sommar`: 25 000/day against 15 000.

## Method

### Where the numbers come from

**Accommodation statistics.**
- **Tillväxtverket**, PM *Inkvarteringsstatistiken 2025*: final 2025 figures per county, the camping share, the foreign share and accommodation revenue. Tillväxtverket took over the statistics from SCB from reference year 2025. SCB's own database (NV1701) stops in 2021 and covers counties only.
- **Region Kalmar län**, *Kalmar läns turismstatistik 2025*: two ArcGIS StoryMaps, (1) Inkvarteringsstatistik and (2) Turismekonomi. Tillväxtverket's portal is a DivePort/Power BI application and cannot be queried here. Instead I read the text of the StoryMaps and queried their **ArcGIS feature layers** over REST:
  - `KOM_GN`, `KOM_LI` and `KOM_belaggningsgrad`.
  - `Turismstatistik/FeatureServer/59, 61, 64, 0, 75`.

  These give, per kommun:
  - guest nights 2025;
  - accommodation revenue 2024–2025;
  - occupancy 2025;
  - inbound tourism consumption 2024–2025 (Tillväxtverket's regional tourism accounts);
  - tourism production 2022: value added, FTEs and total value added, plus tourism value added 2023;
  - Eurostat's short-term-rental (STR) nights per county, 2018–2024.

  Every `source.url` for these records is a REST query that returns the cited value.
- **Kolada v3:**
  - N45850, guest nights per inhabitant (source: Tillväxtverket), 2015–2025, multiplied by N01951 (population) to get the trend. The product reproduces Region Kalmar län's absolute 2023–2025 values exactly.
  - N07911, second homes per 1 000 inhabitants.
  - U07801, waste.

**Population, water and travel.**
- **SCB**, Kort analys "Snart väntas sommarens stora folkförflyttning" (2023), with its xlsx table by kommun: night-time population (03–05) from Telia Crowd Insights, calibrated to the population register. It compares Midsummer and July 2022 with October–November 2022.
- **Havs- och vattenmyndigheten (HaV)**, bathing-water API v2 (`gw.havochvatten.se/external-public/bathing-waters/v2`). I downloaded the list, profile and sample results for all 57 bathing waters in the three kommuner: 986 samples, 2022–2026.
- **Borgholm Energi:** water volumes as quoted by SVT (2024), and a Borgholm Energi presentation (Hushållningssällskapet, Feb 2026) giving annual production.
- **Ramboll for Tillväxtverket** and Myndighetsgruppen för turism (published by Region Örebro län): car share of domestic tourist trips by county.

**Economy and attractions.**
- **Visita**, *Dimensioneringsunderlag Kalmar län* (March 2026), using SCB turnover statistics: units, employees, turnover and tax revenue.
- **Sveriges Museer**, *Museibesöken 2025*.
- **Destination Kalmar** press releases on Ironman (2025, 2026 and 2027 editions).
- **Cruise Industry News** (2019), since Kalmar Hamn publishes no cruise statistics.

**Strategies, plans and surveys.**
- **Region Kalmar län:**
  - *Invånarnas syn på turism 2023* (Indikator survey, n = 1 864).
  - *Utfall marknadsaktiviteter 2024*.
- **Kalmar kommun:**
  - *Destinationsstrategi* (2024).
  - *Klimatanpassningsplan* (updated 2025).
  - *Utvecklingsplan Kalmar slott 2020–2029*.

**Climate risk.**
- **Länsstyrelsen Kalmar län:**
  - Meddelande 2021:04, *Klimatförändringar och världsarv*: a GIS table of exposure to sea-level rise.
  - The regional water-supply plan 2024–2030.
  - The world heritage page.
- **Riksantikvarieämbetet:** world heritage area, "drygt 56 000 hektar". UNESCO's own page blocks automated access.

**Research.**
- **JRC131508** (Matei et al. 2023), *Regional impact of climate change on European tourism demand*. The JRC repository rejects scripted requests, so the PDF was read through a fetch tool.
- **Granéli et al.**, Linnaeus ECO-TECH '12: Öland's tourism losses during algal blooms.
- **Brunklaus et al. 2015** (Chalmers): the climate footprint of tourists in West Sweden.

PDFs and spreadsheets were read in memory with pypdf or a zip/XML parser. Nothing was saved in the project apart from the three output files.

### Derived numbers (all shown in `note_sv`; headline values that are derived are marked `estimate`)

**Trend.** Guest nights for 2019–2024 = Kolada N45850 × population on 31 Dec.

**Value-added shares.** Tourism value added divided by total value added, both in current prices for 2022 (layer 61).
- Kalmar kommun: 607 / 29 340 = **2.07 %**.
- Borgholm: 334 / 2 935 = **11.4 %**.
- Mörbylånga: 4.5 %.
- County: 2 118 / 92 273 = 2.3 %.

**Öland summer factor.** (52 160 + 27 610) / (10 880 + 15 970) = **2.97**, which is +52 900 people on an average July night in 2022.

**Water per extra person on Öland.**
- Extra water: Borgholm's July use (260 000 m³) minus January (110 000 m³) = 150 000 m³, or 4 839 m³/day over 31 days.
- Extra people: SCB's July surplus, 52 160 − 10 880 = 41 280.
- Result: **≈117 l per extra person per day**.

**County seasonal split, 2025.** Derived from the StoryMap's percentages and absolute increases.

| Months | Guest nights | Share |
|---|---|---|
| June–August | ≈2.38 M | 72 % |
| April | ≈133 000 | |
| May | ≈290 000 | |
| September | ≈187 000 | |
| April + May + September | | 18.5 % |
| The other six months | ≈316 000 | 9.5 % |

**Emissions.** 39 kg CO2e per guest night × guest nights. This is a West Sweden factor applied to Kalmar.

**Bathing-water counts.** Counted directly from HaV's API.

## Main findings

### 1. Volume and trend (commercial accommodation: hotels, cabins, hostels, camping and mediated private rentals)

| Guest nights | 2019 | 2020 | 2023 | 2024 | 2025 | 2019→2025 | per inhabitant 2025 |
|---|---|---|---|---|---|---|---|
| Kalmar kommun | 418 023 | 343 499 | 428 410 | 445 963 | **452 248** | +8.2 % (+1.3 %/yr) | 6.2 (Sweden 6.7) |
| Borgholm | 1 016 297 | 860 695 | 1 082 062 | 1 115 271 | **1 079 809** | +6.2 % | 101.6 |
| Mörbylånga | 369 521 | 302 209 | 347 617 | 362 536 | **363 848** | −1.5 % | 22.3 |
| Öland (sum) | 1 385 818 | 1 162 904 | 1 429 679 | 1 477 807 | **1 443 657** | +4.2 % (+0.7 %/yr) | ≈54 |
| Kalmar län | 2 822 492 | 2 220 223 | 3 229 506 | 3 340 127 | **3 307 583** | +17.2 % (+2.7 %/yr) | 13.5 |

**Rankings.**
- Kalmar län has the fifth most guest nights in Sweden.
- Borgholm is the county's largest tourism municipality.
- Öland holds 43.6 % of the county's guest nights.
- Kalmar kommun is a mid-sized city destination with fewer guest nights per inhabitant than Sweden as a whole.

**Data issue.** Kolada's 2022 value for Kalmar (44.4 per inhabitant, i.e. 3.2 million) is an obvious error and was not used.

**Reported changes in 2025 disagree.**
- Tillväxtverket's final figures show the county at −1.0 %.
- Region Kalmar län's StoryMap says "about 3.4 million, +1.8 %".
- I used Tillväxtverket's figures.

### 2. Seasonality and structure

**Peak season.**
- **72 %** of the county's guest nights fall in June–August (2025), against 75 % in 2024, 73 % in 2023 and **43 % nationally**.
- About **70 %** of accommodation revenue (≈SEK 804 million) is also earned in summer.
- The shoulder season is growing fast. Compared with 2024:
  - April 2025: +60 %.
  - May: +16 %.
  - September: +23 %.
- The county strategy aims for a "year-round destination" by 2030.

**Accommodation types.**
- **Camping** accounts for **60 %** of the county's guest nights, the highest share in Sweden.
- Hotels earn just over half of accommodation revenue and camping about 32 %.
- Revenue per guest night is about SEK 584 in Kalmar but SEK 258 in Borgholm. That gap is the difference between city hotels and campsites on Öland.

**Occupancy.**
- Kalmar kommun's 55.8 % is the county's highest. Borgholm has 42 % and Mörbylånga 39 %.
- Kalmar's destination strategy names a shortage of hotel, conference and arena capacity as a weakness.

**Foreign guests.**
- They make up **≈20 %** of the county's guest nights (80.2 % are Swedish), about 640 000 nights.
- Germany is the largest market. The USA grew fastest (+19 %).
- Nationally, the foreign share is 26 %.

**Short-term rentals** (Eurostat, experimental).
- **425 481 nights** in the county in 2024, up from 115 604 in 2018 (+268 %).
- That is ≈13 % on top of the commercial guest nights.

**Second homes.**
- Borgholm has **863 per 1 000 inhabitants** (≈9 200 homes) and Mörbylånga 255 (≈4 150), so Öland has ≈13 300 second homes.
- Kalmar has 31 per 1 000 and Sweden 60.
- About 10 % of the county's second homes are foreign-owned; 2 268 belong to Germans, the most of any county.

### 3. Economy

**Inbound tourism consumption, 2025** (Tillväxtverket's regional tourism accounts, current prices).

| Area | Consumption | Per inhabitant | Per commercial guest night |
|---|---|---|---|
| County | ≈**SEK 11 billion** (sum of kommuner 11 102 M; 2024: 10 600 M) | | ≈SEK 3 357 |
| Kalmar kommun | SEK 2 748 M | SEK 37 609 | ≈SEK 6 076 |
| Borgholm | SEK 2 463 M | SEK 231 790 | |
| Mörbylånga | SEK 1 105 M | | |
| Öland | SEK 3 568 M | | ≈SEK 2 472 |

How the spending splits:
- County mix: retail 32 %, accommodation 30 %, second homes 14 %, culture 3 %.
- In Kalmar the largest product group is retail; on Öland it is accommodation. Kalmar therefore has more day-visitor and shopping spending per overnight guest.

**Value added and jobs** (tourism production, 2022).

| Area | Share of value added | Tourism FTEs |
|---|---|---|
| Kalmar kommun | **2.1 %** | 1 005 |
| Borgholm | **11.4 %** | 275 |
| Mörbylånga | 4.5 % | 193 |
| County | 2.3 % | 2 676 |

- Kalmar's FTEs equal ≈2.6 % of jobs located in the kommun, and ≈0.4 FTE per SEK million of consumption.
- Borgholm is the only kommun where tourism is a structural pillar.
- Tourism value added in 2023: Kalmar SEK 609 million, Borgholm SEK 442 million.

**Industry figures (Visita/SCB, 2024).**
- 694 accommodation and restaurant units with **4 584 employees** and SEK 3 893 million in domestic turnover.
- Tax revenue from the visitor economy: SEK 885 million in 2023.
- The industry expects 1 661 hires over the next three years.
- Region Kalmar län counts 1 305 visitor-economy firms with 1 340 workplaces.

### 4. Attractions and events

**Attractions.**
- **Kalmar slott:** ≈190 000 visitors a year (existing record).
  - Revenue-generating visitors rose from 91 833 (2008) to 150 000 (2018).
  - The 2020–2029 plan targets more than 190 000 revenue-generating visitors, more than 130 000 paying visitors and more than 40 % foreign visitors by 2029.
- **Kalmar läns museum:** **91 929** visits in 2025 (86 978 in 2024).
- **Kalmar konstmuseum:** 26 650.
- **Ölands museum Himmelsberga:** 29 171.
- No official visitor numbers were found for Kalmar domkyrka, Solliden, Borgholm castle ruin or Eketorp.

**Ironman Kalmar.**
- More than 3 000 athletes have registered for 2027; it sold out in one hour.
- In 2025 there were 2 850 athletes, half of them international.
- Each athlete stays 4 nights on average with 4 companions, which gives ≈60 000 person-nights. That equals 13 % of Kalmar's annual commercial guest nights, packed into one week in August.
- Destination Kalmar estimates the tourism turnover at **SEK ≈80 million** (Event Impact Calculator), ≈3 % of the kommun's annual tourism consumption.

**Öland's Skördefest (harvest festival).**
- The organiser expected ≈**220 000** visitors in 2018, with more than 900 activities.
- It is held on the last weekend of September, so it is a key shoulder-season event.

**Cruise ships and guest harbour.**
- Cruise calls are negligible: 2 calls and ≈700 guests in 2019, 1 call in 2018.
- Guest-harbour use (guest nights per season) is not published. The harbour has 150 berths.

### 5. How visitors travel

- **91–92 %** of domestic tourist trips to Kalmar län are by car. This is the joint highest share in Sweden, with Jönköping and Dalarna; Stockholm is at 43 %.
- The car's share of domestic tourism nationally rose by 14 percentage points during the pandemic years.
- Öland is reached by the Öland Bridge, its only fixed link: about 25 000 vehicles/day in summer against 15 000 otherwise (+67 %).
- Kalmar's destination strategy notes that many visitors come by car or coach and that the climate footprint is large. The kommun's mode-share goal is 60/40: walking, cycling and public transport against car.

### 6. Pressures on Öland in summer

**Population** (SCB mobile data, average night in July 2022).

| Kommun | October–November | July 2022 | Change |
|---|---|---|---|
| Borgholm | 10 880 | 52 160 | **×4.8** (+379 %) |
| Mörbylånga | 15 970 | 27 610 | +73 % |
| Öland | 26 850 | 79 770 | **×2.97**, ≈+52 900 |
| Kalmar kommun | | | +0.8 % |

- Media quote 250 000 people in Borgholm in summer. This is not supported by the mobile data and probably counts all visitors over the season.

**Plausibility check** (estimate). Assumptions: the county's 72 % summer share, July taking ≈40–45 % of summer nights, and nearly all second homes in use in July with 2.5–3 people each.
- Commercial guests: ≈13 000–15 000 per July night.
- Second-home users: ≈33 000–40 000.
- Together this gives ≈50 000, close to SCB's +52 900.
- So second homes, not hotels and campsites, carry most of Öland's summer population.

**Water.**
- Borgholm uses ≈**260 000 m³** in July against 110 000 m³ in January (**×2.4**).
- That is ≈117 l per extra person per day, or ≈**6 200 m³/day extra for all of Öland** (estimate).
- Borgholm Energi produces ≈1.8 million m³ a year.
- In the 2016 water crisis an emergency mainland pipeline delivering 1 000 m³/day was built in three months.
- Two desalination plants supply ≈3 % of the county's municipal raw water (existing record `avsaltat_vatten_andel_lan`).
- Länsstyrelsen runs water-saving campaigns aimed at tourists ("Kamelen Törsten", "Vattensmart").

**Traffic.**
- The Öland Bridge carries +10 000 vehicles/day in summer.
- 47 % of county residents agree that tourism increases traffic problems.
- Even so, 85 % agree tourism improves the economy and 80 % are positive about its growth. Only 9 % say tourists affect their daily life negatively, and 40 % think more tourism harms natural areas.

**Waste.** No monthly tonnage was found for Öland. Avfall Sverige's waste per adjusted inhabitant is 617 kg in Borgholm against 378 kg in Kalmar and Mörbylånga (2025), even though the population is already adjusted for second homes and guest nights.

### 7. Climate risks and opportunities

**Bathing water today.** There are 57 bathing waters in the three kommuner: Kalmar 26, Borgholm 17 and Mörbylånga 14.
- **EU classification 2025:** 23 of the 27 EU bathing waters are excellent. Two are good and two sufficient, all in Borgholm. One (Böda Riviera) was classed poor in 2024.
- **Cyanobacteria risk:** **22 of 31 Öland bathing waters** have cyanobacteria risk flagged in their HaV profile; **none of Kalmar's 26** do.
- **Blooms in samples:** only **11 of 986** samples in 2022–2026 recorded a bloom, 10 of them on Öland.
- **Sampling gap:** samples are taken 3–4 times per season and the official season ends on 15 August. So the data say little about late-summer blooms, which SMHI and HELCOM describe as the main Kalmarsund problem (see `kalmarsund-notes.md`).
- **Water temperature:** in samples it averaged 16.7–18.3 °C per season, with a maximum of 26 °C (2022).

**Cost of blooms.**
- The bloom summer of 2005 cost Öland's tourism industry **€17–23 million**: ≈SEK 160–215 million at that year's ≈9.3 SEK/EUR.
- That is roughly **4–9 % of Öland's 2025 tourism consumption**, depending on price adjustment (estimate).
- The next summer, a real-time algae warning service turned this into a gain of €17 million. Information is a policy lever, not only nutrient cuts.

**Warming: JRC 2023.**
- Across Europe, bed nights rise 0.57 % per 1 % better climate comfort (TCI), and **1.2 % in coastal regions**.
- Income elasticity is 0.32.
- **SE21 (Småland med öarna, which includes Kalmar län) gains more than +5 % in summer and early autumn at 3–4 °C** global warming.
- The EU as a whole gains only 1.58 % at 4 °C. July demand falls 5.7 % across Europe while April rises 8.9 %.
- Kalmar's climate-adaptation plan makes the same qualitative point: summer tourism may grow because southern Europe overheats, and the season may lengthen.

**The 2018 heat and drought summer** (observation only, not causal).
- Guest nights per inhabitant fell 3.0 % in the county (Borgholm −4.5 %, Kalmar −6.5 %) while Sweden rose 2.6 %.
- So the simple "warmer is better" comfort effect can be outweighed in extreme years by drought, bans, blooms or heat.

**Sea-level rise.** Exposure in the world heritage site:
- The Södra Ölands odlingslandskap site covers just over 56 000 ha, of which 28 000 ha are grazed alvar and shore meadows.
- **900 ha** are hit at +1 m and **3 000 ha** at +2.5 m; 13 000 ha lie in areas that can flood during heavy high flows.
- Of the site's 18 harbours and boathouse sites, 7 are hit at +1 m and all 18 at +2.5 m.
- Of 3 705 ancient monuments, 21 are hit at +1 m and 175 at +2.5 m.

In Kalmar:
- The guest harbour is "strongly affected" at more than about +0.7 m mean sea level (existing record `hamn_klarar_permanent_hojning`).
- New buildings must cope with flooding up to +2.8 m RH2000 (existing record `planeringsniva_ny_bebyggelse`, Länsstyrelsen's guideline).
- No inventory of **campsites or beaches** in the flood or erosion zone was found.

**Heat.** Existing records give Kalmar 14.8 high-summer days (above 25 °C) a year in 1997–2025. Projections for 2126 are 38 days (SSP2-4.5) and 75 days (SSP5-8.5). The model's worlds use 27, 35 and 57 days. Kalmar's plan expects outdoor events to need shade and drinking water, and bathing water to worsen in heatwaves.

### 8. Emissions

West Sweden's life-cycle study gives **39 kg CO2e per guest night**: 54 % from travel to and from the destination and 23 % from accommodation.

Scaled up (estimate):

| Area | Total (t CO2e/yr) | Of which travel (t) |
|---|---|---|
| Kalmar kommun | ≈17 600 | ≈9 500 |
| Öland | ≈56 000 | |
| County | ≈129 000 | |

For comparison, Kalmar kommun's territorial transport emissions were 102 209 t in 2024. With 91–92 % of trips by car, travel is the lever.

## Caveats

- **Commercial accommodation only.** Day visitors, second-home stays and staying with friends are not counted. Short-term-rental nights are experimental and may overlap with mediated private rentals (SoL).
- **Visitor numbers on Öland.** There is no official annual visitor count for Öland. The 2.97 factor is a July average from mobile data in one year (2022).
- **Tourism accounts at kommun level** are modelled by Tillväxtverket (consumption is distributed to kommuner by model), and the years do not line up: production 2022–2023, consumption 2024–2025.
- **Seasonality for Kalmar kommun** is not published here. The 72 % summer share is a county figure; Kalmar's high occupancy (56 %) suggests a flatter profile.
- **Kalmar slott's 190 000** is "the latest annual statistics" in a 2025 SFV publication. It is unclear whether it counts all visitors or revenue-generating visitors.
- **JRC regional values** for SE21 are given only as ">+5 %" in text and figures; the country table (Table 7) is an image.
- **Journalism and trade press.** Skördefest (SVT 2018), Borgholm's water figures (SVT 2024) and the cruise calls (trade press 2019) come from media rather than primary data and are marked medium or estimate.

## Related records in other topic files (overlap to dedupe)

`dricksvatten.json` was compiled in parallel and covers Öland's summer water load from the water-supply side. I have not re-verified its values. Overlaps:
- **Same SCB mobile data:** `befolkning_borgholm_juli_okning` (379 %) and my `sommarbefolkning_borgholm_juli` (52 160 people).
- **Same SVT/Borgholm Energi source:** `borgholm_vattenuttag_juli_jamfort_januari` (about 2×, with 2010 daily values 3 890 → 9 208 m³/day) and my `vatten_borgholm_juli` (260 000 m³ in July).
- **Useful there for the capacity side of the model:**
  - Mörbylånga peak 5 500 against 3 500 m³/day (+57 %).
  - Desalination capacity: Sandvik 3 000 m³/day, Mörbylånga 4 000 m³/day.
  - Mainland pipeline 1 000 m³/day.
  - Borgholm irrigation ban: 122 days a year.

If the model keeps one set, use my records for visitor and population volumes and the `dricksvatten` records for supply capacity.

## Open questions

1. **Kalmar kommun detail:** monthly guest nights and foreign share. These are in Tillväxtverket's portal (DivePort/Power BI) but not reachable via API.
2. **Visitor counts** for Kalmar domkyrka, Solliden, Borgholm castle ruin, Eketorp, Ölands djurpark, Naturum and Långe Jan; and Skördefest after 2018.
3. **Guest-harbour nights** for Kalmar and the Öland harbours, and **cruise calls after 2019** (Kalmar Hamn).
4. **Öland's peak-day load:** population on the busiest days and monthly waste tonnage (Kretslopp Sydost). Water ratios and desalination capacity are partly answered in `dricksvatten.json`.
5. **Bloom days per beach:** SMHI's satellite surface-accumulation dataset (SE.SR) could give these for Kalmarsund and Öland's west coast. HaV's 3–4 samples per season cannot.
6. **Coastal exposure of campsites and beaches:** a GIS overlay of campsites and EU bathing waters on MCF's hazard maps and SGI's erosion data.
7. **Travel mode on Öland specifically:** train and bus share to Kalmar C, bus use over the bridge, and how sensitive demand is to car restrictions. No local elasticity was found.
8. **Basis of the "250 000 in summer" claim** for Borgholm.
9. **Year-round effects:** whether a green, car-free Kvarnholmen and waterfront would change city-break demand. No Swedish evidence was found, so any effect is an assumption.

## Implications for the 2126 model

The model has no tourism module today: BASE has no tourism keys. Below is a minimal, data-grounded design. Weights come from the sources above, and `antagande` marks pure assumptions.

### Proposed state and baseline (2026 ≈ 2025 values)

| Key | 2026 value | Source / record |
|---|---|---|
| `guestNightsKalmar` | 452 248 per year | `gastnatter_kalmar_kommun` |
| `guestNightsOland` | 1 443 657 per year | `gastnatter_borgholm` + `gastnatter_morbylanga` |
| `summerShare` (county) | 0.72; shoulder (Apr, May, Sep) 0.185; rest 0.095 | `gastnatter_sommarandel_lan` + derived split |
| `foreignShare` | 0.20 | `gastnatter_utlandsk_andel_lan` |
| `touristCarShare` | 0.915 | `bilandel_turistresor_lan` |
| `olandPeakFactor` (July / Oct–Nov) | 2.97 (+52 900 people) | `oland_befolkning_juli_faktor` |
| `secondHomesOland` | ≈13 300 | `fritidshus_per_1000_borgholm` |
| `tourismSpend` | Kalmar SEK 2 748 M; Öland SEK 3 568 M | `turismkonsumtion_*` |
| `tourismValueAddedShare` | Kalmar 0.021; Borgholm 0.114 | `turism_foradlingsvarde_*` |

### A guest-night index the model can compute each year

`GN_k(t) = GN_k(2026) · T(t) · [ Σ_s w_s · C_s(t) ] · B_k(t) · H(t) · L_k(t) · A_k(t)`

Here k is Kalmar or Öland and s is the season: summer, shoulder or off-season. The parameters are grounded as follows.

| Factor | Formula | Parameters and grounding | Confidence |
|---|---|---|---|
| **w_s**, seasonal weights | fixed, or shifted by a "season extension" lever | County 2025: 0.72 / 0.185 / 0.095. For Kalmar, use the same weights until Tillväxtverket's monthly data are fetched (an upper bound on its seasonality). The 2024→2025 shift was −3 percentage points in one year. | medium |
| **T**, demand trend | `(GDP_t/GDP_2026)^0.32`, capped by bed capacity | JRC income elasticity 0.32. Observed growth 2019–2025: Kalmar +1.3 %/yr, Öland +0.7 %/yr, county +2.7 %/yr. Do not compound these for 100 years. Cap growth by capacity: summer nights ≤ 0.9 × summer bed capacity (antagande). | medium |
| **C_s**, climate comfort | `1 + c_s·(GWL_t − 1.4)` | c_summer = 0.03, c_shoulder = 0.035, c_off = 0.01 per °C of global warming. c_summer is fitted so that SE21 summer is +5–8 % at 3–4 °C (JRC ">+5 %"); c_shoulder reproduces JRC's EU-wide April +8.9 % at 4 °C; c_off is an antagande. Use `GWL_t = 1.4 + (GWL_2100 − 1.4)·W.shape(t)`, with GWL_2100 = 1.8 / 2.7 / 4.4 °C for ssp126 / ssp245 / ssp585 (IPCC AR6 best estimates). | estimate |
| **B_k**, water quality / blooms | `1 − p_k·max(0, bloom − 0.71)/0.29 + u_k·max(0, 0.71 − bloom)/0.45` | p_Öland = 0.075 (2005 losses ≈ 4–9 % of today's Öland tourism consumption); p_Kalmar = 0.035 (antagande: half, because city tourism and camping matter less there); upside u = 0.03 (antagande). Uses the model's `bloom` (0.71 in 2026). Halve p when a real-time bloom-warning lever is active (the 2006 "Miss Algae" reversal). | estimate |
| **H**, extreme heat or drought year | `1 − 0.05·sev` in years of `torka_*`, `varmebolja_*` or `megatorka_*` events | 2018 analog: county −3.0 % while Sweden +2.6 %, i.e. ≈−5.6 percentage points relative. Severity `sev` comes from the event resolver. | estimate |
| **L_k**, landscape and coast | Öland: `1 − 0.5·lostMeadowShare`; Kalmar: `1 − 0.05·max(0, seaRise − 0.7)/0.3` | Meadow share lost is 3.2 % at +1 m and 10.7 % at +2.5 m (Länsstyrelsen 2021:04); elasticity 0.5 (antagande). The guest harbour is strongly affected above +0.7 m. Couple Öland's L to the agriculture module, since the world heritage depends on grazing. | estimate |
| **A_k**, access | `1 − 0.915·r·(1 − s)` | 91.5 % arrive by car. r is the extra cost or friction of car travel from a policy (0–1); s is the substitutability by train, bus or bike packages (0–1). No local elasticity exists (antagande). A train/bus lever raises s and lowers emissions without reducing demand. | estimate |

Calibration checks the index should reproduce:
- **2020:** −21 % in the county, an exogenous shock. A pandemic-type event would need its own term.
- **2005 bloom:** an Öland loss of ≈4–9 % with bloom at its worst (B ≈ 0.925).
- **2018:** −3 % against the national trend.

### Pressures the model can derive from the index

| Pressure | Formula | Notes |
|---|---|---|
| **Öland peak population (July)** | `26 850 + 15 000·(GN_Öland,summer(t)/GN_Öland,summer(2026)) + 38 000·(secondHomes(t)/13 300)` | Splits the +52 900 surplus into ≈15 000 commercial guests and ≈38 000 second-home users (estimate). |
| **Öland peak water demand** | +0.117 m³ per extra person per day | ≈6 200 m³/day extra in July today. Compare with supply capacity (desalination 3 000 + 4 000 m³/day and the 1 000 m³/day mainland pipeline, per `dricksvatten.json`) and the existing `water` state. With supply short (drought event × peak), apply restrictions, which then feed back to H. |
| **Öland Bridge summer traffic** | `15 000 + 10 000·(summer visitor index)·(touristCarShare/0.915)` | Today 25 000/day. 47 % of residents already see tourism-related traffic problems, so use it as a social-tolerance signal. |
| **Tourism emissions** | `GN·39 kg·[0.54·f_travel(t) + 0.46·f_local(t)]` | f_travel falls with `evShare`, national decarbonisation and the train/bus share. Today ≈17 600 t/yr for Kalmar and ≈56 000 t for Öland. Keep these outside territorial emissions; they belong in the consumption-based view. |
| **Economy** | `spend = GN·SEK 6 076` (Kalmar) or `·SEK 2 472` (Öland), 2025 prices; `jobs ≈ 0.4 FTE per SEK million` (Kalmar) | Value-added share: Kalmar 2.1 %, Borgholm 11.4 %. A ±10 % change in Öland guest nights moves Borgholm's GDP by ≈±1 %; in Kalmar the same change moves it by only ≈±0.2 %. |
| **Peak-event load** | Ironman: ≈60 000 person-nights and ≈SEK 80 M in one August week | Kalmar's adaptation plan already asks for shade, water and spreading events through the year. Hot-day counts of 35–57 by 2126 raise heat risk for August endurance events. |

### Levers worth adding, with expected sizes

**Season extension** (events, shoulder-season marketing, Skördefest-type festivals).
- Move w_summer from 0.72 towards 0.62 (the regional target is "year-round 2030").
- Each 1 percentage point moved out of summer cuts summer nights by ≈1.4 % at the same annual total.
- Öland's peak water and bridge traffic fall roughly in proportion to its commercial share (≈30 % of the July surplus).

**Clean Kalmarsund and beaches** (links to `baltic`/`bloom`).
- Raises B and protects the 23/27 "excellent" status.
- Adding a real-time bloom warning halves the bloom penalty p.

**Train, bus and bike to destinations.**
- Bringing the tourist car share from 0.915 down to 0.7 cuts bridge summer traffic by ≈2 300 vehicles/day (estimate).
- It cuts travel emissions by up to ≈20 % (more with electrification), without reducing GN if s is high.

**A green, car-free centre and waterfront for Kalmar.**
- The effect on demand is unknown (antagande: a small positive effect on city breaks of at most +2 %).
- Present it as a liveability lever with a tourism side benefit, not as a demand driver.

**Water security for Öland** (desalination, interconnection, reuse).
- Prevents a drought year from turning into supply failure, which would be far worse than the −5 % heat or drought penalty.
- Size it against ≈6 200 m³/day extra peak demand plus growth.

**Protecting the world heritage and its grazing** (links to agriculture).
- Keeps L_Öland at 1.
- Without coastal retreat space, +1 m and +2.5 m sea-level rise remove 3 % and 11 % of the grazed meadows.

**Narrative hooks** (all sourced):
- Under warming, Kalmar and Öland are on the winning side of Europe's tourism map.
- But the island already quadruples (Borgholm) or triples (Öland) its night-time population every July, mostly through second homes, while drinking twice the water and filling the bridge.
- One bad bloom summer has historically cost Öland's tourism several per cent of its annual consumption.
