# Dricksvatten – drinking water for Kalmar and Öland (deep research notes)

Compiled 2026-10-09. Companion to `dricksvatten.json` (34 indicators) and `dricksvatten.en.json`.

- **Updated baseline ids (deliberately):**
  - `dricksvattenproduktion_kalmar`: 16,000 → **14,900 m³/day** (2025, from Kalmar Vatten's own production figure).
  - `dricksvatten_per_invanare_kalmar`: 230 → **221 l per connected person per day** (2025; 204 per resident).
- **Left unchanged** (no better data found): `kalmar_ravatten_konstgjord_infiltration` (50 %), `somrar_utan_vattenrestriktioner_kalmar` (10), `atervunnet_vatten_bevattning_andel` (20 %), `avsaltat_vatten_andel_lan` (3 %), `grundvatten_god_status` (77.8 %), `medborgare_nojda_dricksvattenarbete`.
  - The WaterMan document gives 1,500 of 9,000 m³ of park irrigation as recycled water, i.e. 17 %. That is close to the 20 % in Miljöbokslut 2024, so the existing record stands.

## Method and sources

All PDFs were read in memory with Python/pypdf. Only extracted text, never the PDFs, was cached in the session scratchpad. About 20 web searches were used, plus direct fetches and API calls.

### Kalmar Vatten AB
- **Web pages:**
  - Produktion av dricksvatten, Vattensituationen (log to 17 Sep 2026), Långsiktig vattenförsörjning, Återvunnet vatten, Vattenskyddsområden, Spara på vattnet.
  - Verksamheten i siffror (2025): https://www.kalmarvatten.se/om-kalmar-vatten-ab/ekonomi-och-statistik/verksamheten-i-siffror.html
- **Annual reports:**
  - 2025: https://www.kalmarvatten.se/download/18.7c1d3d6019e02430f08fdfe/1778491389668/%C3%85rsredovisning%202025_tillg%C3%A4nglig.pdf
  - 2024: https://www.kalmarvatten.se/download/18.12edb3819c47e6dc29301c1/1771933373902/%C3%85rsredovisning%20Bokslut%202024_tillg%C3%A4nglig.pdf
  - They give the margin, billed volumes, the billing ratio, leaks, investments and project status.
- **Plan för översyn av vattenskyddsområden** (KF matter, 2020), which lists water sources and reserve wells with capacities: https://kalmar.se/download/18.23a628f51748ec60af034d7/1602763115406/04-plan-oversyn-vattenskyddsomraden.PDF

### Kalmar kommun and WaterMan (Interreg BSR)
- **WaterMan: Underlag till strategisk inriktning för återanvändning av vatten i Kalmar kommun** (2026). It summarises the unpublished *Vattenförsörjningsplan Kalmar kommun* (version 2025-04-11) and Norconsult's 2025 *Tillägg*: https://www.eurobalt.org/wp-content/uploads/2026/06/Kalmar_Water-recycling-strategy_SE.pdf
- **Region Kalmar pre-study** on recycled water for Länssjukhuset (2025-10-30): https://www.eurobalt.org/wp-content/uploads/2026/04/Kalmar_Dual-pipe-System_SE.pdf
- **Vattentjänstplan** (consultation version) and its review statement (2025).
- **Översiktsplan 2023**, chapter Teknisk försörjning: "Nybroåsen och Hagbyån ska värnas".

### Länsstyrelsen Kalmar län
- **Regional vattenförsörjningsplan 2024–2030** (rapport 2023:13): https://catalog.lansstyrelsen.se/store/36/resource/151
- **The 2013 plan**, whose Bilaga A gives the Kalmar overview, seasonal abstraction and reserve capacity: https://catalog.lansstyrelsen.se/store/36/resource/2013__2
- **"Vattenläget i Kalmar län"**, updated 2026-09-24.

### SGU
- **Report RM 118, "Grundvattentillgångar i Nybroåsen"** (2004): https://resource.sgu.se/dokument/publikation/rm/rm118rapport/rm118-rapport.pdf
- **Observed groundwater levels, OGC API** (CC0), queried with a CQL filter on `platsbeteckning`. Example:
  https://api.sgu.se/oppnadata/grundvattennivaer-observerade/ogc/features/v1/collections/nivaer/items?f=text%2Fcsv&limit=10000&filter-lang=cql-text&filter=platsbeteckning%3D%276_26%27
  - Stations used: 6_23, 6_24, 6_26 (Nybroåsen in Kalmar), 6_25 (Nybro), 7_7 and 7_9 (Böda, Öland), 5_1 (Emmaboda, moraine).
  - The Nybroåsen stations are linked in the station table to VISS groundwater bodies:
    - WA33557156, "Nybroåsen vid Vassmolösa" (6_23, 6_24);
    - WA71017665, "Nybroåsen vid Råsbäck södra" (6_26).
  - Their coordinates are withheld.
- **Groundwater climate indicators (SGU-HYPE, 4 × 4 km areas), OGC API**, the data behind SGU RR 2025:01:
  https://api.sgu.se/oppnadata/klimatindikatorer-sgu-hype-omraden/ogc/features/v1/collections/klimatindikatorer-rcp/items?f=text%2Fcsv&filter=omrade_id=106068&limit=1000
  - Areas located by bbox query on the `omraden` collection:
    - 106068 Hagby (Kalmar's main wellfields);
    - 105069 Vassmolösa;
    - 108070 Kalmar town;
    - 114077 Köpingsvik (Solberga, Borgholm's main source);
    - 109067 Mörbylånga;
    - 119087 Böda.
  - The indicators are means of 17 simulations (RCP2.6/4.5/8.5, CMIP5) relative to 1971–2000.

### SMHI
- **Klimatscenariotjänsten, MLQ for Hagbyån** (area id 172, found by probing ids next to Ljungbyån = 171): https://www.smhi.se/pd/klimatsystem/climate_scenario/hyd/wdisyearminAnom_unregulated/rcp85/graphs/wdisyearminAnom_unregulated_rcp85_ANN_172.json

### Öland
- **Borgholm Energi:**
  - the Sandvik page: https://borgholmenergi.se/privat/vatten-och-avlopp/dricksvatten/olands-goda-dricksvatten/fran-havet-till-dricksglaset/
  - the bevattningsförbud page;
  - the talk "Vatten i nöd och kris" (Hushållningssällskapet, Feb 2026): https://hushallningssallskapet.se/wp-content/uploads/2026/02/foredrag-borgholm-energi.pdf
- **Borgholms kommun, Vattentjänstplan 2025–2040** (2026 version).
- **Mörbylånga kommun:**
  - Vattentjänstplan 2025–2037 (consultation version);
  - the 2019 presentation "Mörbylånga Vattenverk – Dricksvatten från bräckt vatten och industriellt processvatten".
- **Vattenmyndigheterna, "Nyttan med bättre vatten"**: cost of the 2016 crisis.
- **SVT**, used only for the Sandvik cost (2017) and Borgholm's monthly volumes (2024). These are flagged where used.

### Statistics
- **SCB "Kort analys"** on summer population from mobile network data:
  - 2023 article, kommun table 2022: https://www.scb.se/contentassets/0a2bcdf10d5d4d44a597d3656257ffa8/kort_analys_kommuntabell.xlsx
  - 2024 article, maximum population against the annual median, 2023.
- **Kolada N85053** (groundwater status) for 0840, 0885, 0880 and 0008.
- **Svenskt Vatten, VASS Drift 2024 result report (R2025-04)**, for national losses and use.

## Main findings

### 1. Where Kalmar's water comes from

**One raw-water system: the Nybroåsen esker**
- About half is natural groundwater. The rest is groundwater formed by **artificial infiltration** of pre-treated water from the **river Hagbyån**.
- **Infiltration and storage:**
  - Hagbyån water is pre-treated at the Yxneberga infiltration plant ("Stenkällan" in the 2013 plan) and infiltrated in basins in Hagbymassivet.
  - Residence time is 2–4 months (2013 plan).
  - In summer Kalmar Vatten tops up the river from a **lake reservoir**. Hultebräan lies within Hagbyån's protection area, and the regional plan groups "Hagbyån + Hultebräan" as one resource.
- **Wellfields:**
  - Bottorp–Stenkällan (Hagbymassivet), the main source;
  - Vassmolösa–Ölvingstorp;
  - Råsbäck, protected since 2018.
- **Treatment and distribution:** water is treated at **Skälby vattenverk**. The Berga water tower and waterworks date from 1972.
- **Infiltration share:**
  - The regional plan's 2021 survey said 80 % infiltration / 20 % groundwater.
  - Kalmar Vatten now says "about half each".
  - Infiltration has been used in Hagbymassivet since the late 1950s.
- **Nybroåsen's capacity (SGU 2004):**
  - **Natural recharge in Hagbymassivet is only 40–45 l/s (1.3–1.4 million m³/yr).**
  - Thanks to infiltration, abstraction there was about 140 l/s (4.4 million m³/yr).
  - SGU judged it could rise to 300 l/s with more basins.
  - SGU called Fröstorp and Råsbäck (each above about 25 l/s) the key future additions.
- **New permit:** Kalmar Vatten is now seeking a new vattendom for **Hockland and Fröstorp**, expected to take about 5 years.

**Vulnerabilities**
- "I dagsläget finns inget reservvatten som kan ersätta Hagbyån som råvattenkälla" (2013 plan).
- Some wells show pesticide traces and are used less.
- Some wells have reached the end of their life (AR 2025).
- Hagbyån water is humic and browning.
- The E22 road passes through protection zones.

**Reserve water**
- Nine small wellfields with a combined 43 l/s (≈ 3,700 m³/day, about 25 % of mean production). The 2013 plan gave about 3,400 m³/day.
- In 2020 it was unclear whether they would be kept.
- In a crisis, Yxneberga could produce 10,000 m³/day of non-potable water (2013).

**Regional limits (regional plan 2024, rough "theoretical maximum abstraction")**

| Resource | Million m³/yr |
|---|---|
| Nybroåsen (Nybro + Kalmar) | 5.0 |
| Hagbyån + Hultebräan | 1.2 |
| Ljungbyån + Orranäsasjön | 1.8 |

Kalmar alone produced 5.44 million m³ in 2025, and Nybro also draws on the esker. The resource is close to fully used in dry years.

### 2. Production, use, losses and margin (Kalmar Vatten)

| | 2023 | 2024 | 2025 |
|---|---|---|---|
| Produced (m³) | ≈ 6.0 M (derived) | ≈ 5.37 M (derived) | **5,437,000** (≈ 14,900 m³/day) |
| Sold / billed (m³) | 5,038,773 | 4,779,952 | 4,947,670 |
| Billing ratio | 84 % | 89 % | ≈ 91 % (own calc.) |
| **Drinking-water margin** | – | **39 %** | **19 %** |
| Registered leaks | 47 | 63 | 44 |
| Digital meters | – | 82 % | 90.8 % |

**Margin**
- Kalmar Vatten defines the "dricksvattenmarginal" as the ratio of available raw water to society's need.
- It fell from 39 % to 19 % in the dry year 2025. Infiltrated areas held up, but wells elsewhere lost capacity.
- The basis (annual volume or peak day) is not stated.

**Per person**
- 221 l of production per connected person per day (67,380 connected; 204 l per resident).
- Households use about 162 l per person per day (3.9 of 5.56 million m³, 66,000 connected; own calculation).
- Comparisons:
  - Svenskt Vatten: 135 l nationally (2024).
  - Kalmar Vatten: 140 l nationally.
  - SCB 2020: 150 l in the county.
- Sector split (WaterMan): households 70 %, industry 20 %, public sector 10 %. The municipal organisation itself uses about 180,000 m³, a quarter of it for irrigation.

**Losses**
- Non-billed water fell from 16 % (2023) to 11 % (2024) and about 9 % (2025). That is about 0.5 million m³/yr saved, or about 9 % of production, by leak work, service-pipe replacement and new meters.
- The national figures are 22 % non-revenue water and 17 % losses (VASS 2024).
- **Kalmar is already good. Little more is to be gained from leakage.**
- Pipe renewal rate: 119 years on average over 2021–2025, against a target of 100–150 years.

**Seasonality**
- The only Kalmar figure found is July production about 3,900 m³/day above January (2010). That is ≈ 25 % of the annual mean.
- No peak-day figure, installed waterworks capacity or vattendom limit is public.

**Price and money**
- The variable price rises from 28 to 32 SEK/m³ in 2026, with tariffs up 15 %.
- Investments planned for 2026–2032 total **3.1 billion SEK**, of which 834 million SEK in 2026. That is about 46,000 SEK per connected person.
- The plan is dominated by Kalmarsundsverket and pipe renewal. The drinking-water projects:
  - Yxneberga infiltration plant rebuild for more capacity;
  - new raw-water main Bottorp–Kalmar (2027);
  - redundant pumping line at Skälby;
  - Bottorp waterworks "has reached its capacity ceiling" (AR 2024);
  - reserve power, with a study of 3 months of full operation without grid power;
  - the new Hockland/Fröstorp permit.

**Future demand**
- The (unpublished) Vattenförsörjningsplan 2025 forecasts household use rising from 3.9 to **5.4 million m³/yr by 2050**. This implies about 100,000 connected people (own calculation).
- Its conclusion is that "vattentillgången i kommunen inte är tillräckligt stor för att säkerställa framtida behov".
- Its thought experiment: cutting use 15 % to 120 l per person per day would need 4.5 instead of 5.4 million m³.
- For comparison, the ÖP planning level is 82,000 residents by 2035.

### 3. Droughts 2016–2018 and 2025–2026

**Kalmar**
- Kalmar Vatten: "inte haft några restriktioner för användning av det kommunala vattnet sedan sommaren 2016". Measures since then have increased the groundwater available. The details of the 2016 restrictions were not found.
- In 2016 Öland received mainland water by truck and through a new pipeline from Kalmar.
- In 2026 Kalmar got through without a ban. Natural levels were "mycket låga", but the infiltration and the lake reservoir carried supply.

**Regional plan**
- **2016:** record-low groundwater on northern Öland in November 2016, after 2–3 winters without recharge.
  - Borgholm Energi helped Mörbylånga with about 50,000 m³ (Borgholm Energi talk).
  - Öland then received water from the mainland by truck and by a pipeline built in three months (1,000 m³/day), which is still in use.
  - In Mörbylånga, tankers carried 1,000 m³/day through spring, summer and autumn, at a cost of **11 million SEK** (Vattenmyndigheterna).
- **2018:** summer 3.5–4 °C warmer than 1961–1990, with 50–75 % of normal rainfall.
  - Surface-water municipalities came close to acute shortage, but no emergency transports were needed.
  - The plan warns that 2018's weather after 2017's low groundwater would have been much worse.
- **2022:** very low flows (Emån at 2016/2018 levels). Supply worked "tack vare den uppbyggda redundansen".
- **What was done in the county after 2016:**
  - two desalination plants on Öland;
  - leak reduction;
  - new or investigated wellfields;
  - more monitoring;
  - transfer pipelines;
  - water kiosks;
  - irrigation bans;
  - water-saving campaigns ("Kamelen Törsten" 2016, "Vattensmart" 2023);
  - regular regional coordination meetings.
- **Grants:**
  - the state dricksvattenstöd: 19.6 million SEK to 50 projects in the county, 2019–2022;
  - LONA wetland grants: 46 million SEK, 2018–2022;
  - LOVA: 10–15 million SEK a year.
- **Private wells:** new wells drilled in the county doubled in 2016. 18 % of the county's population (36,500) has private water.

**County status on 2026-09-24 (Länsstyrelsen)**
- Bans in Mönsterås, Nybro and Vimmerby.
- Large aquifers "mycket under normala" in most of the county compared with 1961–2025. Only a wet scenario brings normal levels within about 180 days.
- All river stations below MLQ, with SMHI low-flow warnings for Hagbyån and Ljungbyån, among others.

### 4. SGU groundwater levels: how often below normal (own analysis of SGU station data)

**Definitions**
- A **"drought year"** has at least 3 months whose monthly mean level is below the 10th percentile of the same calendar month in 1961–1990.
- **"Below normal"** means below the 25th percentile. By construction it occurs in 25 % of months in 1961–1990.

| Station (aquifer) | Drought years 1961–1990 | 1991–2015 | **2016–2026** | Months below normal 2016–25 |
|---|---|---|---|---|
| 6_24 Nybroåsen vid Vassmolösa (natural) | 6/29 | 1/25 | **3/11** (2016, 2025, 2026) | 25 % |
| 6_26 Nybroåsen vid Råsbäck södra | 6/29 | 1/25 | **3/11** (same years) | 17 % |
| 6_23 Nybroåsen vid Vassmolösa (infiltration-influenced) | 4/29 | 2/25 | **0/11** | 2 % |
| 6_25 Nybro (northern esker) | 4/27 | 5/25 | 2/10 | 35 % |
| 7_7 Böda, northern Öland | 3/23 (from 1968) | 12/23 | **7/11** | 70 % |
| 7_9 Böda, northern Öland | 3/23 | 9/23 | 6/11 | 85 % |
| 5_1 Emmaboda (moraine, small aquifer; proxy for private wells) | 4/28 | 2/25 | **11/11** | 62 % |

**Reading the table**
- **Nybroåsen's natural parts** had groundwater droughts in about 1 year in 5 in the 1960s–70s, almost none in 1991–2015, and 3 of the last 11 years.
  - 2025–2026 is the longest run: 6_24 has been below the 10th percentile for 14+ consecutive months since May 2025.
  - 6_26 in Jan 2026 was 0.11 m above its 1964 record.
- **The infiltrated part has had no drought year since 2016.** This is the clearest evidence that infiltration is what keeps Kalmar supplied.
- **Öland and small aquifers** are now below normal most of the time. Böda had its lowest levels since 1968 in October 2016.

### 5. Climate projections for groundwater and the infiltration river

**SGU-HYPE potential recharge, change relative to 1971–2000** (RCP used as a proxy for SSP; mean of 17 runs)

| Area | Mean recharge, SSP2-4.5 2041–70 / 2071–2100 | SSP5-8.5 2041–70 / 2071–2100 | Dry year (P25), SSP2-4.5 | Dry year, SSP5-8.5 | Longest groundwater drought, SSP2-4.5 | SSP5-8.5 |
|---|---|---|---|---|---|---|
| Hagby (Kalmar wellfields), ref 149 mm | −7.1 / −4.6 % | −9.6 / **−22.6 %** | −8.1 / −10.2 % | −19.9 / **−35.4 %** | +15.8 / +14.9 d | +22.0 / **+31.8 d** (ref 187 d) |
| Vassmolösa | −6.2 / −3.8 | −8.3 / −20.0 | −7.4 / −9.5 | −16.8 / −29.7 | +16.0 / +12.9 | +19.2 / +30.9 |
| Kalmar town | −8.7 / −5.1 | −10.8 / −25.3 | −9.8 / −11.1 | −22.1 / −38.9 | +15.5 / +16.1 | +21.6 / +31.4 |
| Köpingsvik (Solberga, Öland) | −11.5 / −7.3 | −13.1 / **−26.9** | −15.7 / −13.9 | −21.8 / −40.7 | +22.7 / +17.3 | +23.9 / +34.1 |
| Mörbylånga | −7.7 / −4.3 | −9.8 / −22.1 | −8.5 / −9.7 | −17.4 / −34.3 | +19.0 / +15.4 | +21.9 / +32.3 |
| Böda (northern Öland) | −12.0 / −12.8 | −18.1 / −34.0 | −21.2 / −27.2 | −34.0 / −54.0 | +20.9 / +19.9 | +28.0 / +41.3 |

- **Spring recharge falls most:** −16 to −32 % across areas.
- **Model historical change, 1961–1990 → 1991–2020:** already −5 % at Hagby, −8 % in Kalmar town and −11 % at Köpingsvik.
- **Large aquifers.** The filling degree of large aquifers barely changes at Hagby (0 to −6 points). This is the esker's buffer. At Böda it drops −18 to −38 points.
- **Robustness** (share of runs showing an increase):
  - mean recharge: 5–41 %, so the decrease is likely but not certain;
  - longest drought: 82–100 %, so the lengthening is robust.

**Hagbyån low flow (SMHI MLQ, 17 HYPE runs)**

| Scenario | 2041–2070 | 2071–2100 |
|---|---|---|
| RCP2.6 | −3.9 % | −5.3 % |
| RCP4.5 | −9.9 % | −6.7 % |
| RCP8.5 | −11.1 % | **−20.2 %** (all runs negative, −36 to −8 %) |

The regional plan cites SMHI that MLQ in the county falls "up to or over 15 %" per +1 °C. The Delförvaltningsplan gives the rivers of Kalmar län and Öland an endurance of only 0–3 months in a winter-drought scenario.

**How often a "2016–2018-type" year occurs (own estimate)**
- **Method:**
  - Annual recharge is treated as normal, with the mean and 25th percentile taken from SGU.
  - The threshold is today's 1-in-10 recharge year.

| Area | SSP2-4.5 2041–70 / 2071–2100 | SSP5-8.5 2041–70 / 2071–2100 |
|---|---|---|
| Hagby | 9 % / 11 % | 15 % / **21 %** |
| Kalmar town | 8 / 9 % | 13 / 17 % |
| Köpingsvik | 12 / 12 % | 14 / 19 % |
| Böda | 16 / 18 % | 19 / 24 % |

- The model-based change is modest under SSP2-4.5 but about **×2 under SSP5-8.5 by the 2080s**.
- The observed 2016–2026 frequency at Nybroåsen (27 %) already exceeds these figures. Droughts that matter for supply build up over several dry winters (2014–2016, 2025–2026), which a single-year recharge threshold underestimates.

### 6. Öland

**Population and demand**
- **Population present (SCB mobile data):**
  - Borgholm: July 2022 **+379 %** against Oct–Nov (10,880 → 52,160). Peak day 2023: 4.5 × the annual median.
  - Mörbylånga: +73 % (15,970 → 27,610).
  - Öland together: × 3.0.
  - Kalmar kommun: +1 %.
- **Borgholm demand:**
  - Abstraction doubles from January to July (VTP 2025–2040), and several waterworks hit maximum capacity.
  - 2010: 3,890 → 9,208 m³/day (× 2.4).
  - 2024 (SVT): 110,000 → 260,000 m³/month.
  - Production is about 1.8–2.0 million m³/yr in six waterworks. About 70 % of 11,000 residents are connected; 4,000 people have private wells.
- **Mörbylånga demand:**
  - 3,500 m³/day in low season, **5,500** in high season (2019).
  - About 1.4 million m³ delivered in 2023 to almost 70 % of 15,700 residents.
  - Expected to exceed 2 million m³/yr by 2037 on trend.

**Desalination**

| Plant | Raw water | Capacity | Opened | Cost |
|---|---|---|---|---|
| **Sandvik** (Borgholm Energi) | Baltic water from 28 m depth via a 700 m intake; reverse osmosis; 6,000 m³ seawater a day, half returned as brine | **3,000 m³/day** | June 2017 (decision May–June 2016) | 85 million SEK + 28 million SEK pipelines (SVT 2017; no official figure found) |
| **Mörbylånga** | Brackish beach wells (up to 5,800 m³/day raw water) plus up to 1,500 m³/day process water from Guldfågeln; plant losses above 30 %; "first in Sweden" with potable reuse | **4,000 m³/day** | July 2019 | **130 million SEK** (Vattenmyndigheterna; forecast 110) |

- Together: **7,000 m³/day ≈ 2.5 million m³/yr**, rain-independent. The cost is about 28,000–33,000 SEK per m³/day of capacity (own calculation).
- **Energy use is not published in any official source found.**
- Sandvik supplies about 3,000 households. Borgholm Energi says the plant lets groundwater wellfields recover after dry summers. Its 2019 conference abstract says it extended production resources "in case of a similar situation to 8–9 years".

**Pipeline from the mainland**
- **1,000 m³/day**, built in three months in 2016. Mörbylånga's cost was about 7.3 million SEK including a booster station.
- It can run both ways and on to Borgholm.
- Kalmar Vatten sold water to the Öland municipalities for 0.35 million SEK in 2025, which is small volumes.

**Restrictions**
- **Borgholm has a standing summer irrigation ban every year, 1 May–30 August (122 days).** It is justified both by low rainfall and by network capacity.
- Mörbylånga avoids bans "i det längsta".

**Status and reuse**
- All Öland groundwater bodies have poor quantitative status (Mörbylånga VTP). Kolada N85053 gives 0 % good status in Mörbylånga and 22 % in Borgholm, against 78 % in Kalmar and 97 % in Sweden.
- Borgholm Energi has supplied treated wastewater for farm irrigation since the 1980s. This returns up to 3,000 kg N and 600 kg P a year to fields.

### 7. Reuse and rainwater

**Kalmarsundsverket**
- Fully in operation in 2027, after a delay of at least 6 months caused by the Serneke bankruptcy.
- Planned to deliver up to **12,000 m³/day** of recycled water at class A (EU 2020/741), 50–80 % of inflow (5.17 million m³ in 2025). That equals about 80 % of mean drinking-water production.
- **First uses:**
  - a water kiosk;
  - internal process water (≈ 200 m³/day);
  - possibly Länssjukhuset's toilet flushing, vehicle wash and green areas: 250–300 m³/day; Region Kalmar's pre-study estimates about 10 million SEK capex and 0.15 million SEK a year in operation.

**Irrigation demand for technical water**
- 113,000–172,500 m³/yr (golf club, football pitches, parks, allotments).
- A separate network is judged too costly, so kiosks and point solutions are preferred.

**Park irrigation pilot (WaterMan)**
- Replaces 1,500 m³/yr of drinking water; capacity is 864 m³/day.
- Production cost is about 150 SEK/m³ at today's tiny volume, or about 15 SEK/m³ after 90 % grants, against about 34 SEK/m³ for drinking water.
- Agreement with Kalmar Vatten to 2033-12-31.

**Potable reuse**
- Kalmar Vatten was commissioned by KF to study a city-near desalination plant. Its December 2024 conclusion: **recycling is the stronger alternative**.
- **Next stage, "Systemanalys 4":**
  - a pilot/demonstration plant for recycled water (about 2 years, subject to grant funding);
  - a site study for desalination;
  - a cost study for pumping recycled water to Nybroåsen.
- No decision has been taken.

**Rainwater**
- Only qualitative material was found: Kalmar Vatten's tips (rain barrels) and WaterMan ideas (greenhouse irrigation from roofs, stormwater ponds).
- The Västervik example of a 50 % stormwater-fee reduction is quoted as inspiration.
- No Kalmar volumes exist.

**Legal barriers (WaterMan)**
- LAV does not allow differentiated or incentive tariffs.
- "Tekniskt vatten" has no definition.
- Laboratories cannot run the EU 2020/741 validation tests.

## Caveats
- **Margin definition.** It is not stated whether it is annual or peak-based. The derived "available raw water" below assumes an annual basis.
- **2023 and 2024 production** were derived from sold volume and billing ratio. "Sold" may exclude bulk sales to Torsås and Öland, so non-billed shares are upper bounds.
- **The WaterMan total of 5.56 million m³/yr** (70/20/10 split) does not match 2025's sold 4.95 million m³. The year and definition are unclear, so the per-household figure (162 l) is approximate.
- **SGU stations.**
  - Coordinates of the Nybroåsen stations are withheld, so their distance to pumping wells is unknown.
  - The Böda stations are marked "opåverkad", but Borgholm reports a falling trend at nearby Löttorp from over-abstraction.
  - The 2026 data run to 9 September (Kalmar) and 8 October (Öland).
- **Climate data.**
  - SGU and SMHI climate data are CMIP5 RCP runs. RCP4.5 ≈ SSP2-4.5 and RCP8.5 ≈ SSP5-8.5, as in `klimat-notes.md`.
  - Small-aquifer recharge is used as a proxy for the esker's recharge. For Hagby, large-aquifer filling changes much less.
- **Drought-probability estimate.** It assumes normality. Recharge is skewed and bounded at 0, so tails are approximate.
- **Old sources.** The 2013 plan (seasonality, 2010 data) and SGU 2004 (recharge) are old. They are the only quantitative sources found for these items.

## Open questions
- Kalmar's peak-day demand, installed capacity of Skälby/Bottorp/Yxneberga, and the permitted abstraction in the vattendomar.
- The volume of the lake reservoir (Hultebräan?) and how many dry months it covers. Kalmar Vatten never names the lake.
- The regional plan gives a "theoretical max" for Hagbyån + Hultebräan of only 1.2 million m³/yr. Yet infiltration supplies about half of 5.4 million m³. The basis of the plan's estimate is unclear.
- The full Vattenförsörjningsplan Kalmar kommun (2025), Norconsult's Tillägg (2025) and the Systemanalys reports (desalination siting, potable-reuse cost). None is public.
- Energy use (kWh/m³), operating cost and brine handling for Sandvik and Mörbylånga. Real summer output against nominal capacity.
- What exactly was restricted in Kalmar in 2016, and for how long.
- Whether Kalmar Vatten will keep the reserve wells (status review planned for 2024 was not found).
- SSP-based (CMIP6) hydrology from SMHI or SGU. Not yet published.

## Implications for the 2126 model

The present model has `s.water = lag(B.water + .3·beredskap + .1·anpassning + .07·hav + .05·effektivitet − .28·stress, 4)`, with `waterNow` 0.55 and `B.water` 0.7. The water index lacks demand growth and does not separate supply from demand. Below are quantified building blocks. All derived numbers are **estimates**.

### A. A simple water balance for Kalmar (suggested state variables)

**Demand**
- D(2026) = **5.44 million m³/yr** (14,900 m³/day).
- D(t) = 5.44 × (connected population / 67,380) × (l per person per day / 221).
- The Vattenförsörjningsplan path gives **D(2050) ≈ 7.1–7.5 million m³/yr**:
  - 7.1 if only households grow;
  - 7.5 if all sectors grow by the same 38 %.

**Available raw water today** (from the margin, assuming an annual basis)

| Year type | Million m³/yr | m³/day | Margin |
|---|---|---|---|
| Normal (2024) | ≈ 7.5 | ≈ 20,500 | 39 % |
| Dry (2025) | ≈ 6.5 | ≈ 17,700 | 19 % |

- July demand is about +25 % on the mean, so ≈ 18,600 m³/day at 2025 levels.
- **In a dry summer the daily margin is already about zero.** That is why the lake reservoir and infiltration matter.

**Climate on supply** (½ natural recharge + ½ infiltration river)

| Scenario | Mean year 2050 | Mean year 2085 | Dry year 2050 | Dry year 2085 |
|---|---|---|---|---|
| SSP2-4.5 | −8.5 % | −6 % | −9 % | −8.5 % |
| SSP5-8.5 | −10 % | −21 % | −15.5 % | **−28 %** |

- **The model's −0.28·stress at stress = 1 matches the SSP5-8.5 dry-year supply loss (−28 % by 2071–2100) almost exactly.** Keep the coefficient but apply it to supply A, not directly to the index.
- For 2126 under SSP5-8.5, extrapolating gives roughly −25 % (mean year) and −33 % (dry year). This is my extrapolation, not published.

**Margin with today's sources only**

| Case | Margin |
|---|---|
| 2050, SSP2-4.5, normal year | −4 to −9 % |
| 2050, SSP2-4.5, dry year | −17 to −22 % |
| 2085, SSP5-8.5, normal year | −17 to −22 % |
| 2085, SSP5-8.5, dry year | −34 to −38 % |

- With linear growth, the **dry-year margin reaches zero around 2034–2037**, and the normal-year margin around 2044–2048 (SSP2-4.5).
- **Demand growth (+30–38 %) erodes the margin about three times faster than climate up to 2050. After 2070 under SSP5-8.5, climate dominates.**

**Suggested index (calibrates to today's `waterNow`)**
- `water = 0.5·clamp((margin_dry + 0.10)/0.50) + 0.25·independence + 0.25·restrictionFreeShare`.
- Today: 0.5·0.58 + 0.25·0 (one source; a second independent source = 1) + 0.25·0.9 ≈ **0.52**, close to the current 0.55.
- **Good in 2126:** dry-year margin ≥ 20 %, two or more independent sources, and no restrictions in at least 9 of 10 summers.

### B. What each option buys and costs (per year unless stated)

| Option | Volume | Independent of rain? | Cost / lead time (source or estimate) |
|---|---|---|---|
| Cut use 15 % (to 120 l per person per day for households) | −0.8 to −0.9 million m³ by 2050 (VFP) | – (demand) | Low capex. Needs smart meters (91 % digital already) and tariff reform; LAV now blocks incentive tariffs. 5–15 years. |
| Leakage from 9 % to about 7 % | −0.1 million m³ | – | Part of the 119-year renewal programme. Small gain left. |
| New Nybroåsen wellfields (Hockland/Fröstorp, Råsbäck) | +0.8 million m³ per field (SGU: ≥ 25 l/s natural recharge each) | **No.** Same aquifer, −5 to −35 % recharge under climate. | Permit about 5 years (AR 2025). Cost not published. Realistic by about 2032. |
| More infiltration (Yxneberga rebuild) | Raises the dry-year buffer; capped by Hagbyån (MLQ −7 to −20 %) and the lake | No | In the 2026–2032 plan. Better used as storage than as new yield. |
| Non-potable reuse from Kalmarsundsverket | 0.29–0.36 million m³ (irrigation 0.11–0.17, hospital 0.09–0.11, internal 0.07). Irrigation alone ≈ 1,200 m³/day off the July peak (≈ 6 %). | Yes | Kiosks and point solutions. Hospital link about 10 million SEK capex, i.e. about 7–9 SEK/m³ with annuity (own estimate). From 2027. |
| **Potable reuse** (indirect via Nybroåsen or direct) | Up to **4.4 million m³** (12,000 m³/day), about 80 % of today's demand | **Yes** (second source) | Cost unknown; 2-year pilot awaiting funding. Kalmar Vatten found it stronger than city desalination (Dec 2024). Realistic online about 2035–2040. |
| City-near desalination (illustration: 5,000 m³/day) | +1.8 million m³ | **Yes** | Capex about 140–165 million SEK at the Öland benchmarks of 28,000–33,000 SEK per m³/day (2017–19 prices, estimate). Energy not published. **Assumption:** 1–2 kWh/m³ for Baltic brackish RO (3–4 for ocean water) gives 1.8–3.7 GWh/yr, about 2–4 MWp of solar at about 950 kWh/kWp (assumed). Öland built a plant in about 1 year. |
| Regional pipeline | Öland link 1,000 m³/day (≈ 7 % of Kalmar's mean), built in 3 months for about 7 million SEK | Only if the far end has a rain-independent source | Kalmar is the regional **supplier** (Torsås 97 %, Öland). No plan was found for a larger inter-municipal source (e.g. Ljungbyån, theoretically 1.8 million m³/yr, or Nybro's Gårdsryd field). |
| Landscape water retention (wetlands, ditch blocking) | Not quantified for Kalmar | Partly | County LONA wetlands: 46 million SEK in 2018–22. Treat as a small (judgement: +2–5 %) recharge bonus. |

**Mapping to the levers**
- `beredskap` level 2 ("Avsaltning med solel …") → add +5,000 m³/day (1.8 million m³/yr) of rain-independent supply, independence = 1, capex about 150 million SEK plus about 3 MWp of solar.
- `beredskap` level 3 → +12,000 m³/day of potable reuse or desalination (4.4 million m³/yr).
- `effektivitet` → −15 % per capita and −2 points of losses.
- **To keep a 20 % dry-year margin in 2050 (SSP2-4.5), Kalmar needs about +2.6 million m³/yr** = 7.1–7.5 × 1.2 − 5.9, i.e. 2.6–3.1. Two examples:
  - 0.9 (efficiency) + 1.6 (two new wellfields) + 0.3 (non-potable reuse);
  - 0.9 + 1.8 (5,000 m³/day desalination or reuse).
- **For 2126 under SSP5-8.5,** about 4–5 million m³/yr is needed beyond today's sources. That is a full-scale second source (12,000 m³/day potable reuse) plus efficiency.

### C. Drought events (frequency for the event system)

**Observed groundwater drought years at Nybroåsen's natural levels**

| Period | Share of years |
|---|---|
| Long-run, 1957–2026 | **14 %** (10 of 70) |
| 1961–1990 | 21 % |
| 1991–2015 | 4 % |
| 2016–2026 | 27 % |

**Suggested event probability per year**
- p = 0.15 × scenario multiplier from the SGU-based estimate. Multipliers:

| Scenario | 2050 | 2085 | 2126 |
|---|---|---|---|
| SSP1-2.6 | about 1.0 | about 1.0 | about 1.0 |
| SSP2-4.5 | 0.9 | 1.1 | about 1.1 |
| SSP5-8.5 | 1.5 | 2.1 | about 2.5 (extrapolated) |

- That gives **SSP2-4.5 ≈ 0.14–0.17/yr** and **SSP5-8.5 ≈ 0.23 (2050), 0.32 (2085), about 0.37 (2126)**.
- **Two dry years in a row** (2014–16, 2025–26) are what empty the esker. Under SSP5-8.5 by the 2080s this rises from about 2 % a year to about 10 % a year (p²).
- **Event effect:**
  - available supply falls to the dry-year value (−19 points of margin today, plus the scenario's dry-year loss);
  - if margin_dry < 0, impose a garden-watering ban;
  - if it is below about −15 %, add emergency measures (tankers, pipeline at 1,000 m³/day, reserve wells at 3,700 m³/day).
- **Öland (Böda):**
  - observed 37 % of years (22 of 59), 64 % in 2016–2026;
  - multipliers 1.6–1.8 (SSP2-4.5) and 1.9–2.4 (SSP5-8.5);
  - **groundwater drought becomes the normal state on northern Öland well before 2100.**

### D. Öland (if represented)
- July demand is about 14,700 m³/day (Borgholm about 9,200 [2010], Mörbylånga 5,500 [2019]).
- **Rain-independent supply is 7,000 m³/day, about 48 % of the July peak.** The pipeline adds 1,000 m³/day. About 7,700 m³/day in July still depends on groundwater.
- In a 2085 SSP5-8.5 dry year (−41 % at Köpingsvik, −54 % at Böda), the groundwater part falls by about 3,200–4,200 m³/day.
- **Öland needs roughly +3,000–4,000 m³/day more desalination or reuse by the 2080s**, about 85–130 million SEK at today's benchmarks. More if summer visitors keep rising (population present × 3 in July).
- The standing 122-day irrigation ban in Borgholm is already the norm. Use it as the baseline, not as an event.

### E. Smaller anchors
- **Kalmar Vatten investment** is 3.1 billion SEK over 2026–2032 (about 46,000 SEK per connected person). The 2026 tariff is +15 %, and the variable price is 32 SEK/m³. Svenskt Vatten (2017, cited in WaterMan) says tariffs must about double within 20 years. Use this to cost the `water` levers.
- **Infiltration is the proven adaptation.** The infiltrated station has had no drought year since 2016 while the natural ones had three. Model infiltration capacity (Yxneberga plus the lake reservoir) as the main buffer, and Hagbyån MLQ (−7 to −20 %) as its climate sensitivity.
- **Citizen trust stays high** (87.8 % in 2025) even though the margin fell to 19 % that year. Restrictions, not the margin, are what people notice.
