# Resor och energi (resor-energi): notes

Compiled 2026-10-08. Companion to `resor-energi.json`, which holds 44 indicators. Where a record updates a baseline record it reuses the baseline id: `bilandel_resor`, `elbilar_andel`, `solceller_installerad_effekt` and `vindkraft_installerad_effekt`. Model keys appear in `replaces`.

## Method
- **Kolada v3 API.** Kolada was used for the following:
  - Kalmar kommun (0880): commuting, car mileage, electric cars, charging points, transport emissions, and electricity production by type.
  - Kalmar län (0008) and Sverige (0000): figures for comparison.
  - Each `source.url` is the exact API call that returns the value.
- **PDF reports.** Each report was read in memory with pypdf and nothing was saved to disk. The cited passages were checked:
  - Miljöbokslut 2024 (pages 35, 39, 40, 41 and 43)
  - Kollektivtrafikbarometern's analysis of short car trips in Kalmar kommun
  - KLT's presentation of market share for the first tertial of 2023
  - Trafikförsörjningsprogrammet 2025–2033
  - Trafikanalys "Resvanor i Sverige 2024"
  - Cykelfrämjandet's Kommunvelometern 2023
  - Transportstyrelsen's Båtlivsundersökningen 2025
  - OX2's press release on Aurora
- **Web pages.** The following pages were read:
  - kalmar.se pages on mobility, buses, boats and cycling
  - Trafikverket's page on E22 through Kalmar, which gives the Ölandsbron traffic figures
  - Kalmar Energi's pages on Moskogen and Draken, its environmental values, Kalmarsund Vind and its solar parks
  - kalmar.com's guest harbour page
  - SVT's articles on the bicycle ferry Dessi
  - regeringen.se on offshore wind
- **Kalmar Energi's fuel mix.** The fuel mix sits in an Infogram chart embedded on the environmental values page. The numbers were read from the chart's data (`e.infogram.com/168b3fc3-…`, titled "Miljövärden 2025", last changed 2026-02-13).
- **Search budget.** I used about 26 web searches. Everything else came from fetching known URLs directly.

## Main findings

### Travel behaviour
- **No modern travel survey (RVU) exists for Kalmar kommun.** The most recent regional survey is Trafikverket's RVU Sydöstra Sverige from 2012 (report 2012:237), according to the Trafikförsörjningsprogrammet. Since then the region has relied on Kollektivtrafikbarometern, the national survey and mobile-phone data.
- **The kommun's figure for 2024:** about 40 % of trips are made by walking, cycling or public transport, so about 60 % are by car. This comes from the kommun's FAQ page and Miljöbokslut 2024. The target for 2035 is 60/40 the other way round.
- **Independent support for the 60 % car share.** Kollektivtrafikbarometern took a boosted sample in Kalmar from September 2022 to February 2023 (residents aged 15–85, about 220 interviews a month). It found:
  - car share of all trips: 64 % for men and 54 % for women
  - 67 % of residents who travelled used a car that day
  - 36 % of car trips were shorter than 5 km
- **Public transport's share of motorised trips:**
  - 17 % in 2022–2023 pooled (KLT; 12 % for the län)
  - 21 % in 2022 (Trafikförsörjningsprogrammet)
- **Public transport volumes and fares:**
  - about 4.5 million public transport trips a year within the kommun
  - more than 30,000 monthly cards sold in 2024
  - a 30-day adult card cost 529 kr in 2026, halved to 264.50 kr from 1 July to 31 December 2026
- **Commuting (SCB via Kolada, 2024):**
  - 10,092 people commute in, which is 25.7 % of those who work in Kalmar kommun
  - 7,349 people commute out, which is 20.1 % of employed residents
- **Car mileage:** 648 mil per inhabitant in 2024. The län has 701 and Sverige 625.
- **Cycling:**
  - Kommunvelometern 2023 placed Kalmar 9th of 54 kommuner with 68.5 of 90 points, up from 40.5 in 2015. Kalmar has no current cycling plan.
  - The kommun invested 264 kr per inhabitant in new cycling infrastructure in 2022.
  - There is no public bike-sharing scheme. There are rental shops, Kalmarhem's bike pool and a cargo-bike library (105 users since 2023).
- **Car sharing:** Delbilspoolen has about 20 electric cars and had more than 4,000 bookings in 2024.
- **Ölandsbron (Trafikverket):** about 15,000 vehicles a day for most of the year and about 25,000 a day in the summer months. Trafikverket now measures only every fourth year.

### Boats
- **Only one scheduled boat route.** The bicycle and passenger ferry Dessi runs Kalmar (Tullhamnen)–Färjestaden.
  - The vessel is a 2006 catamaran owned by Ressel Rederi, taking 118 passengers and 50 bicycles.
  - It carried 42,625 passengers from May to August 2025.
  - Trafikverket withdrew its subsidy of 1.4 million kr a year. In 2026 the ferry runs only from 15 June to 16 August, funded by Kalmar and Mörbylånga.
  - No source says the vessel is electric.
- **No public archipelago traffic in Kalmar.** KLT's archipelago traffic serves only Västervik and Oskarshamn.
- **Guest harbour:** about 150 guest berths (135 in Ölandshamnen and 15 at Slottsfjärden), with shore power of 10–32 A sold per day. No figures for guest nights were found.
- **Leisure boats (Båtlivsundersökningen 2025, Sverige):** 4 % of open motorboats and 2 % of cabin motorboats have an electric motor. 17 % still have a carburettor two-stroke engine, which has been banned from sale since 2007.

### Energy
- **Kalmar Energi's district heating fuel mix (Miljövärden 2025):**

  | Category | Share |
  |---|---|
  | Renewable (forest chips, bark, wood-industry by-products) | 77.22 % |
  | Recovered energy (återvunnen energi) | 22.43 % |
  | Fossil | 0.35 % |

  Emissions are 4.471 g CO2e/kWh from combustion plus 6.56 g CO2e/kWh from fuel production and transport. The primary energy factor is 0.078. This closes the baseline gap on fuel mix.
- **Moskogen and Draken (Kalmar Energi):**
  - Moskogen is a combined heat and power plant built in 2009: 31 MW electricity, a 90 MW boiler, and a nominal 130 GWh of electricity and 360 GWh of heat a year.
  - Draken produces about 60 GWh of heat a year and serves as the summer and peak-load plant.
  - Miljöbokslut 2024 says Kalmar Energi was preparing an application for a feasibility study of bio-CCUS at Moskogen.
- **Electricity produced in the kommun in 2024 (Kolada):**

  | Source | MWh | Share |
  |---|---|---|
  | Wind | 190,864 | 59 % |
  | Combined heat and power (Moskogen) | 92,891 | 29 % |
  | Solar | 38,815 | 12 % |
  | Total | 322,570 | 100 % |

  Use was 7.3405 MWh/inv × 72,704 inv = 533,684 MWh, so local production covered **60.4 %** of use.
- **Kalmar län** produced 13.37 TWh against about 3.25 TWh of use, roughly 4.1 times its own consumption. This is mainly nuclear power at OKG.
- **Wind yield:**
  - Kalmar kommun: 2.36 GWh per MW in 2024 (capacity factor about 27 %) and 2.46 GWh per MW in 2023 (28 %).
  - Kårehamn offshore: 194 GWh / 48 MW = 4.0 GWh per MW, using the baseline's Aneo figures.
- **Solar capacity** was 47.42 MW in 2025. Annual growth has slowed sharply: +15.6 MW (2023), +6.2 MW (2024), +2.4 MW (2025). Yield is about 0.93 GWh per MW.
- **Energy communities:**
  - Kalmarsund Vind II: more than 200 members, holding shares in Rockneby vindpark (5 × 1.5 MW).
  - Törneby solpark: member-owned, 20,000 m², roughly 2.25–3 GWh a year.
  - Nöbble solpark: about 0.6 GWh a year.
  - Johansfors (in Emmaboda kommun).
- **Offshore wind near Kalmar:**
  - **Utgrunden I** (7 turbines, 10.5 MW) was dismantled in 2018.
  - **Nya Utgrunden** (MarCon Windpower, southern Kalmarsund, Mörbylånga kommun) is listed as *planned, 340 MW*. That figure comes from second-hand databases. Consultation took place in December 2021, and no permit was found.
  - **Aurora** (OX2/Ingka) was planned more than 30 km east of Öland, producing up to 24 TWh a year. The government rejected it on 4 November 2024, together with 12 other Baltic Sea projects, on defence grounds. In July 2026 the government approved two parks (southern Bothnian Sea and northern Skagerrak) and rejected eleven. The news coverage I read (TV4/TT) names none near Kalmar.

### Transport emissions and electric cars
- **Transport emissions (Kolada N85533):**

  | Year | Total (t CO2e) | Per inhabitant (t) |
  |---|---|---|
  | 2010 | 128,350 | 2.04 |
  | 2020 | 92,024 | – |
  | 2023 | 81,570 | 1.13 |
  | 2024 | 102,209 | 1.41 |

  Emissions rose 25 % in 2024 after the biofuel blending requirement (reduktionsplikt) was lowered. According to the kommun, cars account for 70 % of transport emissions.
- **Electric cars:** 6.10 % of the car fleet in 2025 (no 2026 data yet), rising by about 0.9 percentage points a year. Fossil-independent cars make up 23.2 % of the fleet. There were 514 public charging points (about 7.0 per 1,000 inhabitants, against 5.7 nationally).

## Caveats
- **The 60 % car share** is the kommun's own figure with no method stated. The Kollektivtrafikbarometern sample is a winter half-year (Sept–Feb), which understates cycling, and it is not a full travel survey.
- **The 17 % and 21 % public transport shares** are of *motorised* trips, not all trips. The two differ because of sampling and period.
- **The national travel-survey shares** (car 52.6 %, public transport 18.2 %, walking 12.8 %, cycling 12.3 %) are my own calculations. They divide the number of trips by mode by "nästan 3,9 miljarder" (almost 3.9 billion) main trips. They are marked `estimate`.
- **Recovered energy (22.43 %)** follows the heat market committee's (Värmemarknadskommittén) reporting rules. The page does not break it down further. Flue-gas condensation and the sewage heat pump are likely parts, but this was not verified. It is unclear whether "Miljövärden 2025" refers to the 2025 production year; the chart was updated in February 2026.
- **The Törneby solpark page contradicts itself:** it gives both about 3,000 MWh and 2,250 MWh. The record therefore carries a range.
- **Nya Utgrunden (340 MW) and Utgrunden I** come from secondary databases and trade press (thewindpower.net, TGS 4C). These sites are not primary sources, so the records are marked `medium`.
- **Dessi passenger numbers** are as reported by SVT. The ferry operator did not publish them.

## Still missing
- **A modern travel survey for Kalmar kommun with separate walking and cycling shares.** Two leads were not accessed:
  - RVU Sydöstra Sverige 2012 (Trafikverket report 2012:237)
  - the "Hållbara Resval Kalmar" survey; hareka.kalmar.se refused connections
- **Results of the kommun's annual cycle and traffic counts.** Trafikia AB counted in autumn 2026 (cycling in weeks 39–40), but the results are not yet published.
- **An official annual average daily traffic (ÅDT) figure for Ölandsbron** from Trafikverket's traffic-flow map at vtf.trafikverket.se. The map is JavaScript only.
- **Boats in Kalmarsund:**
  - number of guest nights in Kalmar's guest harbour
  - the propulsion and fuel of Dessi
  - shore power for commercial ships at Kalmar hamn
  - charging points for electric leisure boats
  - leisure-boat statistics at kommun or Kalmarsund level
- **Grid capacity limits in SE4 and Kalmar:** no quantified source was found. Kalmar Energi's pages describe only manual load shedding (manuell förbrukningsfrånkoppling).
- **Yttre Stengrund:** the claim that it was dismantled in 2015 (5 turbines, 10 MW) comes from search leads only and was not verified. The state support of 70 million kr for Utgrunden II was also not verified.
- **Kommunvelometern 2024–2026:** I could not establish whether Kalmar took part.
- **2026 figures for electric cars, solar and wind:** Kolada had not yet published them.
- **Share of electric buses in Kalmar's city bus traffic:** not found. Only the län-wide renewable share of 87.6 % (U60496, in the baseline) is available.

## Model implications

| Model key | Today | Suggested 2026 value | Basis |
|---|---|---|---|
| `carShare` | 0.60 | **0.60** (keep) | The kommun says 60 % in 2024. Kollektivtrafikbarometern 2022/23 gives men 64 % and women 54 %, a mean of about 59 %. Change the note to "medium, inte RVU". |
| `transitShare` (BASE) | 0.21 | **0.14** (range 0.12–0.16) | 0.21 is public transport's share of *motorised* trips. Converted to all trips: 0.60 × p/(1−p), where p = 0.17 gives 0.123, p = 0.19 gives 0.141 and p = 0.21 gives 0.160. |
| `activeShare` (derived) | 0.19 | **0.26** (walking about 0.13, cycling about 0.13) | 1 − 0.60 − 0.14 = 0.26, split by the national ratio of walking to cycling (499:480). |
| `boatElectric` | 0.03 | **0.02–0.03**, keep `assumption:true` | Dessi, the only scheduled route, is not reported as electric. Nationally 4 % of open motorboats and 2 % of cabin motorboats have an electric motor. Measured by traffic or energy the share is well under 4 %. No measurement exists for Kalmarsund. Suggest 0.02 with the range 0–0.04 in the note. |
| `localEnergy` | elProd/elUse ≈ 0.60 | **0.604** (2024) | Verified: 322,570 / 533,684 MWh. |
| `elLocalOther` (BASE) | 50,740 MWh | **92,891 MWh** (combined heat and power, 2024; 119,795 in 2023; nominal 130,000) | The model currently compensates for an overestimated wind yield. See the next row. |
| Wind yield (`s.windMW*2.8`) | 2.8 GWh/MW onshore | **2.4 GWh/MW** onshore; **4.0** offshore | Measured 2.36 (2024) and 2.46 (2023). Kårehamn gives 194/48 = 4.0, so the model's offshore 3.4 is conservative. |
| Solar yield (`s.solarMW*.95`) | 0.95 GWh/MW | **0.93** | 38,815 MWh / mean capacity of 41.9 MW (2024). |
| `solarMW` | 47.4 | **47.4** (verified, 2025) | Trend: about +7.5 MW a year averaged over 2020–2025, but only +2.4 MW in 2025. The model's +1.6 MW a year is at the low end. Suggest +2.5 to 5 MW a year. |
| `windMW` | 81 | **81** (verified) | The scale for the offshore lever (+1,250 MW): Nya Utgrunden is planned at about 340 MW, and Aurora (up to 24 TWh a year) was rejected for defence reasons. Offshore wind in the Baltic economic zone is currently blocked. |
| `evShare` | 0.061 | **0.061** (2025) | About +0.9 percentage points a year from 2023 to 2025. |
| `ghg.transport` | 1.41 | **1.41** (verified) | The 2024 jump of +25 % came from national fuel policy, not local behaviour. 2023 (1.13) shows what full blending achieves. |

With these changes the energy calibration becomes 47.4×0.93 + 81×2.4 + 92.9 = 44.1 + 194.4 + 92.9 = 331 GWh, against 322.6 GWh measured. The model then reaches the right total for the right reasons, instead of overestimating wind and underestimating combined heat and power.

**Rough cross-check of `transitShare`:**
- The national survey gives about 3.9 billion trips a year among about 10 million residents, roughly 390 trips per person per year.
- Kalmar residents then make about 72,700 × 390 ≈ 28 million trips a year.
- Public transport accounts for about 4.5 million trips a year, which is about 16 %. This figure also includes trips by non-residents.
- That fits the 12–16 % range. Confidence: estimate.
