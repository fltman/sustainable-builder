# Kalmar baseline – notes, gaps and caveats

Compiled 2026-10-08. Companion to `kalmar-baseline.json`: 96 indicators, 12 challenges, 12 assets and 12 vision/programme entries, with 125 unique source URLs.

## Method
- **Kolada v3 API** (`api.kolada.se/v3`) supplied about half of the indicators: municipality 0880 = Kalmar kommun, 0008 = Kalmar län, 0000 = Sverige. Each `source.url` is the exact API call that returns the quoted value. The original agency is named in `publisher`, for example SCB, Nationella emissionsdatabasen or Folkhälsomyndigheten.
- **Other machine-readable sources:**
  - SCB Statistikdatabasen: cars per 1000 inhabitants, green space.
  - Jordbruksverket PxWeb: farmland, number of farms.
  - SMHI open data: sea-level CSV, STRÅNG solar radiation model.
  - Valmyndigheten result JSON: 2026 and 2022 elections.
- **Reports and web pages:** these were opened and the cited passages checked. Sources include SMHI Klimatologi 26, the Regional vattenförsörjningsplan, Kalmar kommun's Miljöbokslut 2024 and Klimatanpassningsplan, the Viable Cities klimatkontrakt, Region Kalmar län's SWOT analysis and Trafikförsörjningsprogram, Naturvårdsverket, Riksbanken, MCF, Livsmedelsverket and Rädda Barnen.
- **Projections:** for SMHI sea-level and temperature indicators, `year` is the publication year and the target year (2100 or 2126) is in `name_sv`. Everywhere else, `year` is the data year.
- **Scope:** every `scope` value is one of the three allowed values. The HELCOM figure for the whole Baltic was therefore moved into the challenge text, not kept as an indicator.

## Caveats
- **Health survey data (HLV) at kommun level** are pooled multi-year values. For example, "2024" means 2021–2024. These indicators are marked `medium`.
- **Waste (Avfall Sverige via Kolada):** municipal waste fell from 493 to 378 kg per inhabitant between two years, and recycling rose from 33 % to 43 %. Changes this large in one step suggest a change in method or reporting, so treat these as `medium`.
- **NTU perceived unsafety (31 %)** is based on small samples at kommun level and has wide uncertainty.
- **Household water use** is a Kalmar län figure. SCB measures it every 5 years, so the latest measurement (probably 2020) is carried forward. No verified Kalmar Vatten litres-per-person-per-day figure was found.
- **Rädda Barnen child-poverty figure (10.5 %):** taken from a copy of the 2025 report hosted on dikko.nu. The national 12.9 % was checked against Rädda Barnen's own summary.
- **Heritage claims** (Kalmar slott, Kvarnholmen, Ölandsbron, Stora alvaret) partly rely on Swedish Wikipedia. The world heritage claim comes from Riksantikvarieämbetet.
- **Estimates and own calculations:**
  - Sea-level rise to 2126 is interpolated from SMHI's 2120 and 2130 values (`estimate`).
  - Green space of 216 m² per inhabitant is 906 ha divided by tätort population.
  - The solar radiation value is a 10-year mean computed from the STRÅNG model.
  - Solar W per inhabitant, the 45 % cut in emissions since 1990, and local power production covering about 60 % of electricity use are all own calculations.
- **Car share of trips (60 %)** is Kalmar kommun's own figure from Miljöbokslut 2024. No municipal travel survey (RVU) with walking and cycling shares could be verified.
- **Mixed vintages:** some programme facts come from 2015–2023 documents, such as the RCP-based SMHI county report and MSB's 2018 flood levels. They have not been updated to newer SSP-based county analyses.

## Gaps – not found or not verifiable
The shared web-search quota (200 searches per session) ran out partway through, so the last checks were done by fetching known URLs directly.
- **Kalmarhem housing queue:** no figures for queue length or waiting time. Only the stock (about 5,250 homes) is included.
- **Kollektivhus, bogemenskap or byggemenskap in Kalmar:** no verified examples.
- **Employers:** no ranked list of the largest employers. Only the kommun's own staff count (2022) is included.
- **Business counts:** no verified total number of registered companies in Kalmar kommun. New firms per 1000 inhabitants is used instead.
- **Liv & hälsa ung** (youth survey, Region Kalmar län): only published as Power BI dashboards. Youth mental health is covered instead by Socialstyrelsen's 0–19 psychiatric-care measure and by Region Kalmar län's knowledge report.
- **Kalmar Energi fuel mix:** no percentage breakdown. The figure used is the Kolada/Energimyndigheten renewable share of district heating, 99.4 %.
- **Fishing and aquaculture landings for Kalmar län:** not found. Only the 2019 EU Baltic cod fishing stop and qualitative regional statements are available.
- **Wind and sugar:**
  - Yttre Stengrund: not verified.
  - Status of the planned "Nya Utgrunden" offshore park: not verified.
  - Sugar beet share: not verified.
- **Overall food self-sufficiency:** Jordbruksverket deliberately publishes no single total figure, so per-product figures are used. The often-quoted "about 50 %" is not used.
- **Flood and heat details:**
  - SMHI's current 100-year water level for Kalmar: not found.
  - Exact ground elevation of Kvarnholmen: not found.
  - Projected number of days above 25 °C for Kalmar: not found.
- **Baltic Sea:**
  - Cyanobacteria bloom statistics by year: not compiled.
  - HELCOM HOLAS 3 share of the Baltic area that is eutrophied: not verified. The often-quoted 97 % comes from the older HOLAS II.
- **Not available at kommun level:**
  - Consumption-based emissions: only the national figure, 7.6 t per person, is available.
  - Interpersonal trust: covered by HLV at kommun level, but no national SOM figure.
- **Vision 2035:** the adoption date and decision body were not stated on the kommun's page.
- **Rankings:** Aktuell Hållbarhet's environmental ranking, or any other ranking, for Kalmar was not verified.
- **Linnéuniversitetet students:** the campus Kalmar figure (about 6,000 full-time students) is from 2021. The 2025 figures cover the whole university.

## Notable findings
- **Emissions:** territorial emissions fell 52 % from 1990 to 2023, then rose 14 % in 2024 (per inhabitant from 2.64 to 2.99 t), leaving them 45 % below 1990. The rise came when Sweden lowered the biofuel blending requirement (reduktionsplikt). The kommun's klimatkontrakt target is −85 % by 2030.
- **Coastal water:** 0 % of coastal water bodies in the kommun and in the län have good ecological status. None of the 21 coastal monitoring stations has had good nutrient status for 8 years.
- **Social participation:** low social participation in Kalmar län doubled, from 18 % to 37.9 %, between 2017–2020 and 2019–2022.
- **Groundwater:** in September 2026, groundwater was unusually low in both small and large aquifers across almost the whole län.
- **Housing:** completions in 2025 were only 0.96 per 1000 inhabitants, against 3.1 nationally.
- **Sea level:** under the high scenario, SMHI's projection reaches about 0.9 m by 2126 (median). The planning level for new buildings is +2.8 m RH2000.
- **2026 election:** results are already final. Turnout in Kalmar's kommunval was 84.59 %, against 84.27 % in 2022. L lost its seats.

## Fördjupning 2026-10-08 (research/deep/)
Sex riktade genomgångar har fyllt flera av luckorna ovan och ersatt modellantaganden med mätta eller härledda värden. Varje del har en egen anteckningsfil med metod, förbehåll och vad som fortfarande saknas; `tools/merge-research.mjs` för in posterna här (fältet `topic` anger delen).
- **Översvämning** (`oversvamning-notes.md`): markhöjder på Kvarnholmen, extremvattenstånd och SMHI:s havsnivåer per scenario.
- **Klimat** (`klimat-notes.md`): SMHI:s länsscenarier (RCP2.6/4.5/8.5 som stand-in för SSP; SMHI har ännu inte publicerat SSP-baserade länsdata utom för havsnivån). Ersätter de äldre värmebölje- och markfuktighetsposterna; temperaturökningen RCP8.5 är nu 4,6 °C (2071–2100).
- **Kalmarsund** (`kalmarsund-notes.md`): VISS-status för de nio kustvattenförekomsterna, HELCOM HOLAS 3 (93,8 % av Östersjön under god status för övergödning), dricksvatten, natur. Konstgjord infiltration är ca 50 % av råvattnet enligt Kalmar Vatten (inte 80 %).
- **Resor och energi** (`resor-energi-notes.md`): ingen modern RVU finns; kollektivtrafikens 21 % gäller motoriserade resor (ca 14 % av alla resor). Kalmar Energis fjärrvärme 2025: 77 % förnybart, 22 % återvunnet, 0,35 % fossilt. Lokal el 2024: 60,4 % av användningen.
- **Samhälle** (`samhalle-notes.md`): arbetstid, boende, beredskap, AI-styrning, konsumtionsutsläpp (SEI). Kalmarhems kö och lagrade matdagar finns fortfarande inte publicerade.
- **Stad** (`stad-notes.md`): Kvarnholmen är 81,5 % hårdgjord (egen beräkning ur NMD 2023), 35 byggnadsminnen, ÖP:s mål 82 000 invånare 2035.
