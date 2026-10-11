# Kalmarsund – the sea, drinking water and nature (deep research notes)

Compiled 2026-10-08. Companion to `kalmarsund.json`, which holds 23 indicators. One of them updates a baseline id (`kalmar_ravatten_konstgjord_infiltration`). The rest are new.

## Method

### VISS (status per water body)
- VISS (viss.lansstyrelsen.se) was searched for coastal water bodies whose "Kommuner" field includes Kalmar (0880). Searches used water-body names and local place names.
- Each water body was read from its "Senaste bedömning" page. The status content on those pages is loaded by JavaScript, so it was read from the page's own PDF export (`Waters.aspx?waterMSCD=…&generatePDF=true`).
- The figures quoted are the statuses, quality factors, deadlines (tidsfrister) and pressures (påverkanskällor) as they appear there.

### Coastal monitoring
- Source: Kustvattenkommittén's summary report for 2023, the latest one listed on kalmarlanskustvatten.org.
- The report covers station and water-body nutrient classes (Nklass), chlorophyll, Secchi depth, eelgrass, benthic fauna and coastal fish.

### Baltic-wide sources
- HELCOM: HOLAS 3 publication page, the State of the Baltic Sea page, and the Cyanobacterial Bloom Index indicator page. The indicator values were checked against the page HTML.
- ICES advice database, SLU, and the government fact memo (faktapromemoria) 2025/26:FPM23.
- SMHI's cyanobacteria report for 2023 (Oceanografi 134) and SMHI's news item from 2026-09-01.

### Drinking water
- Kalmar Vatten's own pages, including the water-situation log dated 2026-04-23 to 2026-09-17.
- Länsstyrelsen's "Vattenläget i Kalmar län", updated 2026-09-24.
- Regional vattenförsörjningsplan 2024–2030.

### Nature
- Kolada v3: N85050, N85052, N85054–57, N85084, N00638.
- SCB PxWeb MI0802/Areal2025 (POST query) for the kommun's area.
- The Stensö reserve decision, from Naturvårdsverket's document service.
- Kalmar kommun's Naturmarkspolicy (VMN 2022-11-17) and Miljöbokslut 2024.

### Files and search budget
- Three report PDFs were too large for WebFetch. They were read locally from the scratchpad (not the project) with pdftotext: Miljöbokslut 2024, the regional water-supply plan, and Marina inventeringar 2019.
- No datasets were downloaded.
- About 17 web searches were used.

## Findings

### 1. VISS: coastal water bodies touching Kalmar kommun

| Water body (MS_CD) | Type | Area km² | Ecological status | Phytoplankton/chl | Nutrients | Light | Deadline |
|---|---|---|---|---|---|---|---|
| S n Kalmarsund (WA75592769) | 8 inner | 81.5 | Måttlig | Måttlig | Otillfr. (tot-P summer: Dålig) | – | 2039 |
| Ö s Kalmarsunds kustvatten (WA32437375) | 9 outer | 165.3 | Måttlig | Måttlig | Otillfr. | – | 2039 |
| N v s Kalmarsunds kustvatten (WA61554367) | 9 | 118.5 | Måttlig | Måttlig | Otillfr. | – | 2039 |
| S Kalmarsunds utsjövatten (WA24322694) | 9 | 679.7 | Måttlig | Måttlig | Otillfr. | Måttlig | 2039 |
| M n Kalmarsunds utsjövatten (WA96811672) | 9 | 327.8 | Måttlig | Måttlig | Otillfr. | Måttlig | 2039 |
| Bockskärs skärgård (WA66736802) | 8 | 47.4 | Måttlig | Måttlig | Otillfr. | – | 2039 |
| Pataholmsviken (WA77978725) | 8 | 19.6 | Måttlig | Måttlig | Otillfr. | – | 2039 |
| Hossmoviken (WA54241773) | 8 | 5.8 | **Otillfredsställande** | Otillfr. | Otillfr. | – | 2039 |
| Västra sjön (WA27917257) | 8 | 7.7 | **Otillfredsställande** | Otillfr. | Otillfr. (tot-P summer & DIN winter: Dålig) | Otillfr. | 2039 |

All nine water bodies share these features:
- **Chemical status:** "Uppnår ej god". The cause is mercury and PBDE in fish, which have a nationwide "mindre stränga krav" exemption. TBT in sediment in S n Kalmarsund has a 2027 deadline.
- **Not classified in VISS:** bottenfauna (BQI), macroalgae/angiosperms (eelgrass), and oxygen.
- **Exemptions:** "tidsfrist 2039, naturliga förhållanden" for phytoplankton and nutrients from agriculture and surrounding sea water. Pressures from small sewers, treatment plants and urban runoff have a 2027 deadline.
- **Significant pressures, S n Kalmarsund example:** agriculture, transport/infrastructure, enskilda avlopp, atmospheric deposition, "andra relevanta" (the surrounding sea).

VISS lists concrete measures in this catchment, mostly small. Examples:
- Buffer zones removing 3–45 kg P per year.
- A 2 ha wetland at Surrebäcken: −890 kg N and −39 kg P per year.
- 10 small-sewer upgrades in S n Kalmarsund, 2022–2027.

The search may not have found every water body. Kolada N85089 counts only water bodies "in" the kommun, and its 0 % agrees with this table.

### 2. Coastal monitoring 2021–2023 (Kustvattenkommittén)

**Nutrients**
- No station and no water body has good nutrient status. This has held for the eighth assessment in a row: 14 of 21 stations are otillfredsställande and 5 are måttlig.
- At the Kalmar stations, Nklass is K15-MV 0.34, K3-V 0.28 and K11-MV 0.30. The mean is 0.31, against a good boundary of 0.6.
- The worst problem is phosphorus in summer, together with high winter DIN.

**Chlorophyll and Secchi depth**
- Chlorophyll is better than nutrients: 9 of 21 stations are good or high, because nitrogen limits growth while phosphorus is high. K11-MV fell from high to good.
- Secchi depth: 5 stations good, 6 måttlig, 9 otillfredsställande.

**Point sources in 2023**
- Kalmar ARV discharged 87,300 kg N and 1,580 kg P, from 6.24 Mm³ of wastewater.
- For comparison, river transport in 2021 was 390 t N and 4.2 t P from Ljungbyån, and 890 t N and 14 t P from Emån.

**Eelgrass (Linnéuniversitetet)**
- In 2023, maximum depth in Kalmarsund was 6.0–6.6 m at Beijershamn, Stora Rör and Köpingsvik. The trend has been decreasing over 2007–2023, most clearly at Köpingsvik.
- In the 2006/07 baseline survey, eelgrass reached at least 8.3 m.
- At Stora Rör, both cover and shoot density have declined significantly. Borstnate (*Stuckenia pectinata*) has covered more than eelgrass in 2021–2023.
- 2018's heatwave, with water at 24 °C or more for about a month, halved cover at some sites.
- The report still judges depth extent as "minst God".

**Benthic fauna**
- Over the long term, BQI has declined significantly at the stations sampled since 1995, and it tends to fall south of Kalmar. Baltic clam weight has almost halved in 20 years.
- In 2022–2023, more than half of the 21 län sea areas sampled had good benthic status.

**Coastal fish**
- Stickleback made up 92 % of the län's shore catch in 2021–2022. Stickleback density in Kalmarsund has risen more than tenfold in 30–40 years.
- The perch/cyprinid ratio is 0.1 in Södra Kalmarsund, which means no perch. Comparison areas in Blekinge range from 0.4 to 3.8.
- Perch and pike recruitment areas along the east coast have shrunk by 40–65 %.

### 3. Baltic-wide context

These figures cannot carry a JSON scope (the allowed scopes are kommun, län and Sverige). Suggested text for the `ostersjon` challenge is given at the end of this section.

**HELCOM HOLAS 3 (2016–2021)**
- "93.8% of its surface area, including both open sea and coastal waters, assessed as below good environmental status for eutrophication … None of the open sea basins achieved good status." This replaces HOLAS II's ">96 %/97 %".
  Source: https://helcom.fi/publications/holas3_eut/ (BSEP 192).
- There were "No clear signs of recovery during 2016–2021".
- Normalized inputs between 1997–2003 and 2020 fell by 12 % for nitrogen and 28 % for phosphorus. Maximum allowable inputs are still exceeded in the Baltic Proper.
  Source: https://stateofthebalticsea.helcom.fi/findings/pressures/pollution/eutrophication/

**HELCOM Cyanobacterial Bloom Index (2016–2021)**
- Good status was not reached in any of the 13 open-sea basins.
- Values for the basins off Kalmarsund (threshold / estimate / EQRS):

  | Basin | Threshold | Estimate | EQRS |
  |---|---|---|---|
  | Western Gotland Basin | 0.85 | 0.41 | 0.29 |
  | Eastern Gotland Basin | 0.89 | 0.44 | 0.29 |
  | Bornholm Basin | 0.83 | 0.61 | 0.46 |

- Trends from 1990 to 2021 are deteriorating in most basins. Bornholm Basin and Eastern Gotland Basin show no significant trend.
  Source: https://indicators.helcom.fi/indicator/cyanobacterial-blooms/

**SMHI cyanobacteria**
- 2023 was, like 2021 and 2022, "något över medel" for both extent and FCA index. The bloom was concentrated in the northern Baltic Proper.
- 2026 had a strong bloom: first observed on 9 June north of Gotland, with heavy surface accumulations in late June. SMHI published no numbers.
- Yearly km² and day counts exist only as figures and in the SE.SR open dataset (see "Still missing").

**Cod**
- ICES advised zero catch of eastern Baltic cod (SD 24–32) for 2025 (https://asd.ices.dk/viewAdvice/3618).
- Zero quota has been advised since 2020, and the stock is "below biologically safe limits" (SLU 2024).
- For 2026 the Commission proposes a continued ban on directed fishing of eastern and western cod, with only bycatch TACs that it proposes to cut sharply.
- The government memo cites ICES that eutrophication-driven oxygen deficiency, parasites and "predation från ökade sälbestånd" now outweigh the effect of fishing, so "en snabb återhämtning … kan inte förväntas" (2025/26:FPM23).
- No cormorant source was found, so cormorants are left out.

Suggested challenge text: "Enligt HELCOM:s senaste bedömning (HOLAS 3, 2016–2021) har 93,8 % av Östersjöns yta inte god status med avseende på övergödning, och ingen utsjöbassäng når god status för cyanobakterieblomning (index 0,29 av 1 i Gotlandsbassängerna)."

### 4. Drinking water (Kalmar Vatten)

**Source and production**
- The raw water is Nybroåsen, an esker. About half is natural groundwater and half is artificial infiltration of pre-treated river water, which is backed by "ett större ytvattenmagasin" (a lake used as storage).
- The baseline's 80/20 split, from the regional plan's 2021 survey, is therefore updated to about 50 %.
- Annual mean production for all waterworks is about 16,000 m³ per day.
- Per inhabitant this gives about 219–238 l per day (own calculation). That is total production, not household use. The household figure for the län is about 150 l (SCB/Kolada, 2020).
- Kalmar also supplies 97 % of Torsås kommun's water (regional plan, table 6.1).

**Restrictions and 2026**
- There have been no restrictions on municipal water since summer 2016. Kalmar got through 2026 without a bevattningsförbud.
- The 17 September 2026 update says groundwater levels are "fortsatt mycket låga" and the surface reservoirs are low for the season.

**Län situation, 24 September 2026**
- Bevattningsförbud are in force in Mönsterås, Nybro and Vimmerby.
- Large aquifers are "ovanligt låga i så gott som hela länet", that is "mycket under normala" compared with 1961–2025.
- Every river station is below MLQ. SMHI has issued low-flow warnings, including for Ljungbyån and Hagbyån.
- Even in a wet scenario, levels in large aquifers would reach "normala" only in about 180 days.

**Planning**
- Kalmar Vatten's målbild is "vattenförsörjning i ett 100-årsperspektiv" and "Flera och oberoende råvattenkällor".
- On commission from the kommunfullmäktige, Kalmar Vatten is investigating:
  - a stadsnära desalination plant;
  - recycled water as raw water, with a planned pilot of about two years, subject to external funding.
- No decision has been taken.

**Kalmarsundsverket**
- The new treatment plant goes into operation stepwise in 2026 and is to be complete in 2027.
- It should cut N and P discharges by at least 35 %. At 2023 levels that is about 30 t N and 0.55 t P per year.
- Up to 80 % of its water can be reused.
- Since 2024, treated wastewater has replaced 1.5 million litres a year of drinking water for park irrigation, which is 20 % of that use.

### 5. Nature

**Protected nature, Kolada 2025**

| Measure | Kalmar kommun | Kalmar län | Sverige |
|---|---|---|---|
| Total protected (N85054) | 2.18 % | 3.6 % | 12.1 % |
| Land (N85055) | 0.99 % | – | – |
| Sea (N85056) | 6.04 % | 4.06 % | 10.1 % |
| Inland water (N85057) | 7.11 % | – | – |
| Mean distance to protected nature (N85084) | 2.6 km | 2.4 km | 2.0 km |

The kommun total has been essentially flat since 2022.

**New reserves**
- **Stensö naturreservat**, the kommun's first municipal reserve, was decided by KF on 2025-12-15. It covers 355 ha: 86 ha of land and 269 ha of water, including eelgrass meadows and bladderwrack belts.
- With Stensö, the total protected share rises to about 2.47 % (own calculation).
- A reserve at Revsudden (Skäggenäs) is planned for 2026.

**Red-listed species**
- Kalmar kommun's Naturmarkspolicy states about 700 red-listed species in the kommun in 2021, on the 2020 red list. This is the only kommun-level figure found; Artdatabanken publishes no ready-made kommun table.
  - 1 RE
  - 6 CR
  - about 60 EN
  - 180 VU
  - about 450 NT
- That gives about 246 threatened species. About 70 species are covered by action programmes (ÅGP).

**Programme goals**
- No current "naturvårdsprogram" was found. What exists instead is the **Naturmarkspolicy**, proposed to KF by Vatten- och miljönämnden on 2022-11-17. Its goals apply to the about 1,700 ha of forest and 700 ha of farmland that the kommun owns:
  - avoid clear-cutting;
  - increase deciduous trees and dead wood;
  - restore wetlands;
  - fight invasive species;
  - natural areas within 300 m of homes and schools;
  - school forests within 1,000 m.
- A "Handlingsplan för god vattenstatus" was adopted by KF in 2021 and runs to 2027. Its content was not retrieved.

**Measures reported in Miljöbokslut 2024**
- An 8 ha wetland at Smedby on the Törnebybäcken.
- The Kalmar Dämme barrier opened for fish.
- Five km of watercourses restored.
- 171 t of sediment dredged from Malmfjärden, removing an estimated 93 kg N and 43 kg P.

### 6. Mussels

Kalmar-specific results are thin. The broader evidence is already in vision-research (food_e26–e45).
- Kalmar kommun's local BSAP (Minnhagen 2018, as cited in the ECOPELAG/KSLA slides) sets a target of **3,000 t mussels per year**. The slides say this would replace 75 % of the feed factory's imported raw material.
- The baseline harvest yield for Kalmar was **0.55 kg per m of rope per year**, against 0.6 for Östergötland. ECOPELAG's improved rigs reached up to 2.3 kg/m in the Stockholm archipelago.
- Mussel content measured in ECOPELAG was 6.4–11.4 g N per kg and 0.56–1.01 g P per kg.
- On that basis, 3,000 t would hold about 19–34 t N and 1.7–3.0 t P (own estimate). That is roughly Kalmar ARV's yearly P discharge but only a third of its N. Salinity in Kalmarsund may give lower contents.
- A 2008 SLU thesis estimated a marginal cost of 64–336 SEK per kg N for the southern Baltic Proper, based on trial farms in Kalmarsund run by Mönsterås kommun.

## Caveats
- **Undated VISS classifications.** VISS "Senaste bedömning" is cycle 3. The page gives no explicit classification date, so `year` 2026 means "as published in VISS on 2026-10-08".
- **Unclassified quality factors.** Benthic fauna and eelgrass are not classified in VISS for these water bodies. Their status comes from recipientkontrollen, which uses a different spatial frame: the eelgrass stations lie on Öland's Kalmarsund coast.
- **Production and infiltration figures.** The 16,000 m³ per day is undated, and the 50 % infiltration share is described as "ungefär". Production includes deliveries to Torsås, non-household use and leakage.
- **Assumed reserve status.** The Stensö estimate assumes the reserve decision has gained legal force and does not overlap existing protection.
- **Comparability of red-list counts.** The ~700 red-listed species reflect inventory effort and are not comparable to national shares.

## Still missing
- **Yearly cyanobacteria statistics as numbers.** SMHI publishes them only as figures. The underlying dataset is SMHI open data SE.SR "Ytansamling av alger" (https://www.smhi.se/data/sok-oppna-data-i-utforskaren/se-sr-ytansamling-av-alger): daily rasters from 2002, several GB. It was not downloaded.
- **HOLAS 3 integrated eutrophication EQRS per basin and for Swedish coastal units.** These are in the thematic assessment PDF (BSEP 192, >10 MB): https://helcom.fi/wp-content/uploads/2023/06/HELCOM-Thematic-assessment-of-eutrophication-2016-2021.pdf
- **ICES eastern Baltic cod numbers.** The 2025 advice for 2026, with SSB against Blim, was not verified. Only the 2024 advice (zero catch in 2025) and the Commission's 2026 proposal were.
- **Fishing in Kalmar län.** Licence holders, landings or employment were not found. "Svenska yrkesfiskare 2024" (HaV/GU, gupea.ub.gu.se/…/2024_svenskayrkesfiskare_03_2025.pdf) has a per-län appendix, but the server refused access.
- **Mussel farm results in Kalmarsund.** No verified figures per hectare or cost. A Baltic Blue Growth farm at Kalmarsund (about 1 ha, about 50 t, about 500 kg N and 50 kg P) appears only in a search snippet; the page now returns 404.
- **Eelgrass.** No area in hectares and no restoration projects in Kalmar.
- **Kalmar Vatten.** Not found:
  - maximum capacity and the permitted abstraction in the vattendom;
  - reserve water source;
  - date and report of the desalination study;
  - official litres per person (Svenskt Vatten's VASS requires login).
- **Groundwater data.** No SGU station series for Nybroåsen. The "Aktuella grundvattennivåer" page has no dated text.
- **Artdatabanken 2025 red list for the kommun.** This would need an Artportalen query.
- **Content of Kalmar's Handlingsplan för god vattenstatus (2021–2027).** Not retrieved.

## Model implications

Today's model (src/model.js, BASE) has `baltic` 0.12, `water` 0.5 and `biodiversity` 0.4. `bloom` is set to 0.75 in BASE but is computed as 0.95 − 1.05 × baltic, which gives 0.82 in 2026. `stress` is 0 in 2026. The proposals below are built only from the measured figures above. Every step is shown, and all are `estimate`.

### baltic ("Kalmarsunds hälsa", 1 = good status): proposed 0.31 (range 0.20–0.45)

Status ladder: dålig = 0, otillfredsställande = 1/3, måttlig = 2/3, god (or hög) = 1. The index is the mean of three equally weighted parts:

| Part | Value | Basis |
|---|---|---|
| (a) Share of the 9 Kalmar coastal water bodies at good ecological status | 0.00 | VISS |
| (b) Ladder value of the failing factor, nutrients | 0.33 | Otillfredsställande in all 9 |
| (c) Mean ecological-status ladder | 0.59 | (7 × 2/3 + 2 × 1/3) / 9 |

- Result: (0 + 0.33 + 0.59) / 3 = **0.31**.
- Cross-check: the Kalmar stations' nutrient Nklass divided by the good boundary is 0.31 / 0.6 = 0.51. This is the upper end of the range.
- Good in 2126: **1.0**, meaning all nine water bodies at good ecological status with nutrients at least good (Nklass ≥ 0.6). The legal deadline is 2039.
- The model's autonomous improvement term (+0.10 over 60 years) is optimistic against HELCOM's "no clear signs of recovery 2016–2021". The 22-year lag fits the evidence of recovery over decades.

### bloom (0–1, higher = worse): proposed 0.71 (range 0.54–0.71)

- Calculation: bloom = 1 − HELCOM CyaBI EQRS for the basins next to Kalmarsund. Western and Eastern Gotland Basins have EQRS 0.29, giving **0.71**. Including Bornholm Basin (0.46), the mean is 0.65.
- Good in 2126: **≤ 0.40**, i.e. EQRS ≥ 0.6, the boundary for good status on HELCOM's scaled EQR.
- If baltic is raised to 0.31, the current formula gives 0.95 − 1.05 × 0.31 = 0.62. Two ways to recalibrate:
  - **Option 1:** `bloom = clamp(0.91 − 0.65·baltic + 0.2·stress)`. This gives 0.71 in 2026 and 0.26 at baltic = 1, leaving some natural blooms.
  - **Option 2:** keep the slope and use an intercept of 1.04.

### water ("Vattensäkerhet", 0–1): proposed start value 0.55; structural, normal-weather value 0.73

The index is the mean of four parts:

| Part | Value | Basis |
|---|---|---|
| (a) Groundwater bodies with good chemical and quantitative status | 0.78 | Kolada N85053, 2022 |
| (b) Independent raw-water systems, against a target of ≥ 2 | 0.50 | One system today: Nybroåsen with infiltration, against Kalmar Vatten's target "flera och oberoende råvattenkällor" |
| (c) Summers 2016–2026 without restrictions | 0.90 | 10 of 11 (2016 had restrictions) |
| (d) Current level of large aquifers | 0.00 | SGU class "mycket under normala", Länsstyrelsen 2026-09-24 |

- Including (d): (0.78 + 0.5 + 0.9 + 0.0) / 4 = **0.55**.
- Without (d): (0.78 + 0.5 + 0.9) / 3 = **0.73**.
- Recommendation: start `s.water` at 0.55, because 2026 is a drought year, and let `B.water` be about 0.70, since stress is handled separately.
- Good in 2126: **≥ 0.85**, which needs:
  - at least two independent sources (desalination or potable reuse added) → (b) = 1;
  - all groundwater bodies at good status;
  - no restrictions in at least 9 of 10 summers despite SMHI's 30–50 low-soil-moisture days per year.

### biodiversity (0–1): proposed 0.35 (range 0.30–0.45)

The index is the mean of four measured parts:

| Part | Value | Basis |
|---|---|---|
| (a) Protected share of total area against a 30 % target (30×30) | 0.07 | 2.18 / 30 |
| (b) Eelgrass maximum depth against the 2006/07 survey | 0.76 | 6.3 / 8.3 m |
| (c) Non-stickleback share of the shore fish catch | 0.08 | 1 − 0.92 |
| (d) Share of län sea areas with good benthic status, 2022–23 | about 0.50 | "mer än hälften" |

- Result: **0.35**. With Stensö, (a) becomes 2.47 / 30 = 0.08 and the index rises to 0.36.
- Good in 2126: **≥ 0.8**, which needs:
  - at least 30 % protected → (a) = 1;
  - eelgrass back to ≥ 8 m → (b) ≈ 1;
  - stickleback ≤ 20 % of the catch, i.e. predatory fish restored → (c) = 0.8;
  - at least 90 % of benthic areas at good status.

### Other suggested model levers and anchors
- **Kalmarsundsverket** gives −35 % N/P from the kommun's largest point source by 2027. It can be modelled as a small exogenous step in `baltic`; about +0.02 is a judgement, not a calculation. The step is small because diffuse agricultural load and open-sea exchange dominate.
- **Mussel lever.** The kommun's BSAP target of 3,000 t per year would remove about 1.7–3 t P per year. That is comparable to Kalmar ARV's P discharge (1.58 t) but small next to Ljungbyån alone (4.2 t). Use it as a modest `baltic` effect, not a fix.
- **Water-security levers with documented local plans:**
  - desalination study;
  - potable-reuse pilot;
  - park irrigation with recycled water, now 20 % of that use;
  - Kalmarsundsverket's 80 % reuse capacity.
- **Effects of the proposed values on the model's 2026 starting values:**
  - SDG 14 (`avg(norm(baltic,0,.8), norm(bloom,1,0))`) rises from about 0.17 to about 0.34.
  - The doughnut "nutrients" overshoot (`1 − baltic·1.4`) falls from 0.83 to 0.57.
  - If the team wants the start to read as "Kalmarsund is in poor shape", they can use the strict variant: (a) and (b) only, giving baltic = 0.17.
