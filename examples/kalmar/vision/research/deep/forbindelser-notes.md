# Förbindelser – Kalmar's links to Öland and the rest of Sweden

Compiled: 2026-10-09. Data files: `research/deep/forbindelser.json` (34 indicators) and `forbindelser.en.json`.
Scope: Ölandsbron, regional rail at Kalmar C, Kalmar Öland Airport, and boats and buses to Öland.
Existing records left unchanged: `olandsbron_fordon_per_dygn` (15,000/day outside summer), `olandsbron_fordon_per_dygn_sommar` (25,000/day in summer) and `cykelfarja_dessi_passagerare` (42,625 a season). No newer official values were found for them.

## Method and sources

All PDFs were read in memory with `pypdf`. Nothing was saved to the project.

### Ölandsbron

- **Trafikverket**
  - The page *Broarbeten i Kalmar län* (updated 25 Aug 2026) covers the 2026 expansion-joint work and the 2027–2030 concrete work.
  - Press release *Rödljus och bommar på Ölandsbron* (8 May 2018) gives the wind thresholds.
  - Reports and decision documents (SEB, ÅVS) on bransch.trafikverket.se and DiVA (see Rail).
- **Transportstyrelsen**
  - Appeal decision of 2010-06-21 on the walking and cycling ban. It gives the deck width, lane layout, speed limits and the 2009 annual average daily traffic (ÅDT).
- **Riksdagen**
  - Questions 2022/23:131 and 2025/26:523 on a replacement ferry and on towing, with the government's answers of 13 Dec 2022 and 24 Feb 2026.
  - Answers of 7 Sep 2018 on a new link to Öland and on preparedness.
  - Motion 2025/26:3712, *En andra fast förbindelse till Öland*.
- **Press**
  - Dagens PS (26 Sep 2026): the NCC contract, 688.7 MSEK.
  - Vi Bilägare (30 Sep 2022): Trafikverket's bridge manager on the 2075 horizon, the 36 m clearance and 36,000 vehicles on peak days.
  - SVT on the bicycle ferry (Sep and Nov 2025) and on the 2018 tunnel idea.
- **Mörbylånga kommun**
  - Consultation responses to the 2018–2029 and 2022–2033 national plans (regeringen.se).

### Sea level at the bridge approaches (derived)

- **Road geometry.** Road 137 (Ölandsleden) from OpenStreetMap via Nominatim:
  - west side from the bridgehead (56.68275 N, 16.37506 E) for 1.66 km;
  - east side (Möllstorp, 56.66659 N, 16.46918 E) for 1.5 km.
- **Hazard maps.** Sampled every 25 m against MCF's hazard maps (`hotkartor_2026`):
  - layer 93 (+3.4 m, 100-year level in 2150 under SSP5-8.5);
  - layer 92 (+2.7 m, 100-year level in 2150 under SSP2-4.5);
  - ground level = water level − depth.
- **Coastal flood layers.** Every 100 m against MCF's `kustoversvamning` layers (0.1–5.0 m), by binary search for the lowest flooding level.
- **Cross-check.** The two methods agree at the low point: hazard maps 2.31 m, coastal layers 2.4 m.
- **Excluded points.** 210–420 m west of the bridgehead, the road crosses water on a separate short bridge between Svinö and the mainland. The ground model shows 0.06 m there, so these points are not counted.
- **Scenario values.** The 2126 values are from this project's `oversvamning` notes: 100-year level 1.89 m under SSP2-4.5 and 2.18 m under SSP5-8.5.

### Rail

- **Trafikverket**
  - *Kartläggning Kust till kustbanan* v1.1 and the ÅVS report *Kust till kustbanan, Borås–Kalmar/Karlskrona* (Dec 2020). These cover Kalmar C, train movements, travel-time targets and costs of passing loops.
  - SEB JSYR2601 *Kalmar C, spår och plattformar* (approved 2025-03-17).
  - Report *Stångådalsbanans och Tjustbanans funktion för regional utveckling* (2024-03-28, publication 2023:190). It includes the T24 timetable and ridership.
  - Report *Delelektrifiering* (2024-04-08).
  - Line fact pages for Stångådalsbanan and Kust till kust-banan.
- **National plan.** Government decision of 2026-04-24 adopting the national plan 2026–2037, with annexes.
- **Timetable.** Öresundståg timetable PDF Kalmar–Copenhagen, valid 14 Dec 2025–12 Dec 2026. I parsed it in code to count weekday departures and running times.
- **Region Kalmar län**
  - *Trafikförsörjningsprogram 2025–2033*.
  - Position paper on the 2026–2037 plan.
  - *Handlingsprogram transportinfrastruktur 2024–2029*.
- **New trains.** Press release from Länstrafiken Kronoberg and Transitio on the new Krösatåg (10 Mar 2025).

### Commuting

- **SCB.** Register table AM0210F/ArRegPend2 (place of residence × place of work, 2024), queried through the API. Öland = Mörbylånga + Borgholm.
- **Kolada.** v3 API, N02279 (out-commuting share).

### Airport

- **Transportstyrelsen.** *Flygtrafikstatistik* for full-year 2025, Q2 2026 and the development during 2019.
- **The airport.**
  - Website (destinations and sustainability pages).
  - Consultation response of 6 May 2025 on regionally procured air services.
- **SVT** (29 Sep 2021). The airport's electric-aviation and fossil-free targets.
- **Nationella emissionsdatabasen.** Public API: Kalmar kommun, sub-sectors 4.10 (domestic aviation), 4.11 (rail) and 9.1 (international aviation below 1,000 m), CO2.

### Cost benchmarks for new links (implications only, not records)

- Ramboll: Storstrøm Bridge (Dronning Margrethe II-broen) budget.
- Femern A/S: Fehmarnbelt tunnel budget.

### Budget

About 40 web searches plus direct fetches and API calls.

## Main findings

### 1. Ölandsbron

**Basic facts**
- Opened 30 Sep 1972.
- 6,072 m long, 155 concrete spans.
- Maximum height 41.69 m; navigation clearance 36 m under the high span at the Kalmar end.
- Built for 130 MSEK.
- Width between the edge beams is only 12.8 m:
  - four lanes since 1996;
  - 0.2 m shoulders;
  - no footpath, cycle lane or central barrier;
  - variable speed limit of 50–90 km/h.

**Traffic**
- ÅDT was 16,914 vehicles in 2009 (Transportstyrelsen).
- Trafikverket now gives about 15,000 a day outside summer and 25,000 in summer.
- Up to 36,000 a day during the harvest festival (skördefesten).
- A 2025 motion gives nearly 7 million vehicles a year (about 19,000 a day).
- No official heavy-vehicle share or bus count was found.

**Condition and repairs**
- Damage to the piers from the brackish water was found in the 1980s.
- The piers were strengthened in the 1990s ("world's largest bridge repair").
- Repairs had cost more than 1 billion SEK by 2012 (Vi Bilägare).
- 2018–2019: new waterproofing on the high span and concrete repairs.
- 2025: pilot repairs of 13 spans from scaffolding under the deck.
- Aug 2026–Mar 2027: replacement of expansion-joint parts, with one lane closed in each direction.
- Jan 2027–Jun 2030: NCC repairs the concrete cover of the main and cross beams in the remaining **135 spans for 688.7 MSEK**. The runner-up bid was 787.5 MSEK.

**Service life**
- Trafikverket's bridge manager in 2022: the bridge "shall last until at least 2075". The intention is a total life of at least 100 years.
- Trafikverket's 2026 page calls the work "Ölandsbrons livslängd förlängs 2026–2030" (the bridge's life is extended).
- No official remaining-life figure beyond 2075 was found.

**Replacement or second link**
- No Trafikverket study of a replacement, second bridge or tunnel exists.
- A new link was not included in the 2018–2029 plan (government answer 2018).
- It is absent from the 2026–2037 plan; a grep of the decision finds no "Öland".
- Mörbylånga kommun (2022) asked Trafikverket to start preparing a new bridge.
- A Mörbylånga politician proposed an immersed tunnel in 2018.
- Motion 2025/26:3712 asks the government to investigate a second fixed link "long before" 2075.

**Wind**
- At 27 m/s, wind-sensitive vehicles are advised not to cross.
- At 32 m/s ("hurricane"), the bridge is closed.
- Since 14 May 2018, Trafikverket closes the bridge with red lights and barriers, turning traffic back at Svinö and Färjestaden.
- Closures are "isolated occasions". No count of closure days per year is published.

**Cycling**
- Walking and cycling have been banned since the county board's decision of 17 Dec 2009, upheld on appeal on 21 Jun 2010.
- Alternatives:
  - a bike on the regional bus, space permitting;
  - the seasonal bicycle ferry Dessi, Kalmar–Färjestaden. In 2025 it carried 42,625 passengers and about 13,000 bikes a season.
- Trafikverket stopped its 1.4 MSEK a year in support.
- Kalmar and Mörbylånga procured a 2026 service themselves.

**Sea level at the approaches (derived)**
- **Öland side (Möllstorp).** Safe: road 137 is above 3.4 m for at least 450 m and above 5 m for 1.5 km.
- **Mainland side.** The weak spot is Ölandsleden in Tallhagen, 1.0–1.4 km west of the bridgehead on Svinö.
  - Lowest ground level **2.3 m RH 2000** (range 2.28–2.4).
  - About 440 m lie below 3.4 m and about 170 m below 2.7 m.
  - It is dry at today's 100-year level (1.29 m).
  - It is dry at the model's 2126 100-year levels (1.89 m SSP2-4.5; 2.18 m SSP5-8.5), but with only 0.1–0.4 m to spare.
  - It is under 0.4 m of water at the 2150 SSP2-4.5 hazard level (2.7 m).
  - It is under about 1.1 m at 3.4 m.
- **Rail.** Kalmar C and its rail yard are also low:
  - Stationsgatan is about 2.2 m (`oversvamning` notes).
  - At 2.18 m, about 89% of the harbour and rail-yard area floods in the project's own analysis.

**Preparedness**
- Ölandsbron is the only fixed link. There is no permanent car ferry.
- An MP states that reclassifying and moving Trafikverket's Blekinge road ferry would take up to two weeks.
- The government (2022, 2026) refers to Trafikverket's continuity plans for the bridge without confirming a lead time.
- Contracted towing on the bridge may take 120 minutes to arrive. Two accidents in winter 2025/26 caused long queues.
- The Öland municipalities plan for loss of the bridge (minister, 24 Feb 2026).
- Grankullavik harbour was raised in 2018 as a possible emergency port.
- A recent analogue: Strömsundsbron (E45) was closed after damage on 30 Sep 2026. Trafikverket announced an emergency pontoon ferry on 2 Oct and was working to put it into service on 6 Oct (Trafikverket press releases on via.tt.se).

**Dependence**
- 3,767 Öland residents have their workplace in Kalmar kommun (SCB 2024).
- About 6,860 people commute across the strait in either direction.
- 52.4% of employed Mörbylånga residents work in another municipality, the highest share in the county.
- Mobile data (Telia 2021, in the county's transport supply programme) show Öland–mainland as the largest flow between municipalities in the county.

### 2. Rail at Kalmar C

**Station**
- A terminus with three platform tracks for trains up to 250 m.
- About 70 train movements a day (about 35 departures), counted around 2020.
- A single track with three level crossings leads to Kalmar södra. The barriers are down up to 20 min an hour at peak.
- Trafikverket's forecast for 2045: 80 trains a day and **1.4 million trips a year** into Kalmar C.
- Today's passenger numbers at Kalmar C were not found.
- Kalmar C is part of 45% of trips on Stångådalsbanan (Nov 2021 count).

**Lines and services**

| Line | Electrified | Service 2024–26 | Fastest time from Kalmar C |
|---|---|---|---|
| Kust till kust-banan (to Emmaboda–Växjö–Alvesta, Göteborg 39 mil) | Yes, single track | Öresundståg: 13 weekday departures 06–21 to Malmö/Copenhagen; Krösatåg Kalmar–Emmaboda–Karlskrona/Växjö; SJ via Alvesta (connections; few direct trains to Göteborg) | Växjö 67 min; Alvesta 80 min; Malmö C 3 h 03; København H 3 h 44; Kastrup 3 h 28 |
| Stångådalsbanan (to Linköping, 235 km) | **No**; single track, line speed 70–110 km/h | 7 through return trips (T24), about 23 passenger trains a day on the line | Linköping 3 h 05 |
| Kalmar–Emmaboda–Karlskrona (Kust till kust + Blekinge kustbana) | Yes | Krösatåg | About 75 min in 2018 (RSS); target 60 min |
| Stockholm | – | No direct trains (the last via Linköping ended after 2003) | About 4 h 30 via Alvesta (estimate, range 4 h 25–4 h 50) |

**Night trains**
- None serve Kalmar.

**Stångådalsbanan ridership and condition**
- Just under 340,000 trips in 2018, about 230,000 in 2020 and about 180,000 in 2021.
- Ridership has been flat since 2000.
- Decided state measures for 2022–2033: just over 2.2 billion SEK, half of it routine maintenance.
- A new radio-block signalling system costs about 800 MSEK.
- Berga triangle plus a passing loop at Kåremo would save just under 10 min.
- Trafikverket sketched savings of up to 20 min but has no ready measures.
- No electrification is proposed (2024).
- The 2016 ÅVS option "Järnväg light 160" (3,006 MSEK at 2013 prices) gave 150–154 min Kalmar–Linköping.
- Collisions with fallen trees are increasing: 37 in 2018–2022 and 30 in 2023 alone. This is a climate and robustness issue.

**New trains**
- 28 new CAF Krösatåg: 20 electric (200 km/h) and 8 bimodal electric/biodiesel (140 km/h).
- They enter service from 2026–2027. The bimodal trains make Stångådalsbanan fossil-free without a wire.
- Today the line still runs on diesel with 20% biofuel blend (TFP 2025–2033).

**National plan 2026–2037** (decided 24 Apr 2026; 1,171 billion SEK)
- *Kalmar C, spår och plattformar* (261 MSEK at 2023 prices) is in the plan only under "planning", with no construction start in years 1–6.
- Alvesta triangle and Hässleholm–Lund (two new tracks) are also in the plan.
- Emmaboda station, Alvesta–Växjö double track and E22 Gladhammar–Verkebäck were dropped (SVT).
- Ostlänken is cut back so that Stångådalsbanan keeps its present connection in Linköping.
- The county plan frame for Kalmar län is 1,375 MSEK.

**Regional targets**
- Public transport share of motorised trips: 17% in the county by 2028 (12% in 2022; 21% in Kalmar kommun).
- RSS travel-time targets for 2040:
  - Kalmar–Växjö from 60 to 45 min;
  - Kalmar–Karlskrona from 75 to 60 min.

### 3. Kalmar Öland Airport

**Ownership**
- 50% Kalmar kommun and 50% Region Kalmar län.
- Ds 2023:3 proposed bringing Kalmar into a state-run basic airport network. Kalmar kommun supported negotiations on a state takeover. I did not verify the 2026 status.

**Passengers**
- **232,122 in 2019** (243,296 in 2018).
- **88,216 in 2025**, which is 38% of 2019.
- 6,915 take-offs and landings in 2025.
- Q2 2026 was 13% below Q2 2025.

**Routes**
- SAS to Stockholm Arlanda (daily; no Bromma route since Jan 2025).
- Charter with Ving, TUI and Sunclass: Gran Canaria in winter, Mallorca and Rhodes in summer.

**Fossil-free and electric aviation**
- In 2021 the airport said electric flights to Stockholm would start "within five years" with a 19-seat Swedish aircraft, and that all scheduled traffic would be fossil-free by 2030.
- At the time it blended 34% biofuel.
- Neither happened by 2026.
- The airport's own operations are fossil-free. It "plans infrastructure for commercial electric aviation", possibly solar-charged; Törneby solar park is on airport land.

**Emissions**
- Domestic aviation CO2 allocated to Kalmar kommun was 516 t in 2024 (1,636 t in 1990).
- This is only the take-off and landing share near the airport, not whole flights.

**Policy**
- Trafikverket has proposed a "four-hour rule" for regionally procured flights: no subsidy where the train takes under 4 h. The airport opposes it.
- Kalmar–Stockholm by train is just over 4.5 h today.

### 4. Boats and buses to Öland

- **Buses.**
  - KLT regional lines 101–107 and 112 cross the bridge (oland.se, *Travel by train, bus or taxi*).
  - Bikes can be carried for a fee, space permitting.
  - Service is greatly increased in summer (TFP).
  - No line ridership is published.
- **Ferries.**
  - Car ferries Kalmar–Färjestaden ended when the bridge opened in 1972.
  - Since about 2010 the only scheduled boat has been the seasonal catamaran Dessi (Ressel Rederi; 118 passengers, 50 bikes; existing record).
  - The 2026 service was direct-procured by Kalmar and Mörbylånga. The requirement is 40,000 passengers and 13,000 bikes a season.
  - No plans for an electric passenger boat were found. Trafikverket says the small boat does not solve Öland's preparedness problem.

## Open questions

- **Ölandsbron traffic.** Official current ÅDT and heavy-vehicle and bus shares. Trafikverket's flow map at vtf.trafikverket.se is JavaScript only and returned 404, and Trafikverket counts only every fourth year.
- **Wind closures.** The actual number of wind-closure and restriction days per year. A proxy from SMHI station data is possible but would not match the bridge's own gauge at 40 m.
- **Svinö crossing.** The deck level of the short road bridge between Svinö and the mainland, about 300 m west of the bridgehead.
- **Kalmar C passengers.** Today's boardings at Kalmar C. The figure in Trafikverket's station map is an image without values.
- **Official travel times.** SJ times for Kalmar–Stockholm and Kalmar–Göteborg (direct SJ regional is about 5 h 12 by third-party data, not verified).
- **National plan stage.** Whether Hässleholm–Lund and the Alvesta triangle have construction starts in the 2026–2037 plan. The annex table extracts poorly.
- **Airport ownership.** Whether the state takeover proposal of Ds 2023:3 led anywhere.
- **Electric aviation.** Any dated e-aviation or charging project at Kalmar.
- **Contract source.** The 688.7 MSEK figure comes from press (Dagens PS citing Trafikverket via Byggindustrin), not a Trafikverket document.
- **Remaining life.** Trafikverket has published no remaining-life assessment of the bridge's concrete after the 2027–2030 work.

## Implications for the 2126 model

### 1. When the bridge must be renewed

**What to model.** The 1972 bridge cannot plausibly reach 2126; it would be 154 years old. Treat it as:
- maintained to about **2075** (Trafikverket's stated horizon; at least 100-year design life);
- possibly stretched to the 2080s with another repair round, about 0.7–1.0 billion SEK. That is similar to the 2027–2030 contract and the 1990s pier repairs; history shows a major round every 20–30 years (1990s, 2018–19, 2027–30).

**Timeline.** Swedish mega-projects take 15–25 years from option study (ÅVS) to opening. A sensible default:
- ÅVS in the **2040s**;
- planning in the 2050s;
- construction in the **2060s**;
- new link open about **2070**;
- old bridge closed and removed by 2080.

**Scale.** Nothing is in the 2026–2037 plan. A replacement would cost roughly 7–11 times Kalmar län's whole 2026–2037 county plan (1,375 MSEK), so it must be a named national project.

### 2. Realistic options and order-of-magnitude costs (2025 prices)

| Option | What it gives | Cost benchmark | Rough cost for Kalmarsund (about 6.1 km) |
|---|---|---|---|
| Renovate and keep (base) | 4 car lanes, no bike, wind limits, about 2075 life | 688.7 MSEK for 2027–30; repairs over 1 billion SEK by 2012 | about 1 billion SEK per 25-year cycle, until about 2075–2085 |
| New multimodal bridge (2 road lanes + tram or BRT + wind-shielded cycle and footpath, 36 m navigation span kept) | Removes the cycling ban, carries tram, redundancy if the old bridge is kept for a while | Storstrøm Bridge (DK, Vejdirektoratet; Ramboll project page): 3.8 km, 27 m wide, double-track 200 km/h rail + 2-lane road + cycle path, **4.7 billion DKK**, about 1.8 billion SEK/km at 1.45 SEK/DKK | **about 10–15 billion SEK** |
| Immersed tunnel (2 road lanes + tram) | No wind closures, no navigation limit; cycling hard | Fehmarnbelt: 18 km, 4-lane motorway + double-track rail, **52.6 billion DKK (2015 prices)**, about 3.7–4.3 billion SEK/km | **about 15–30 billion SEK** (smaller cross-section than Fehmarnbelt) |
| Second link elsewhere or a ferry backup | Redundancy only | Standby ro-ro vessel and ferry berths | Small (tens to hundreds of MSEK), but lead time must fall from about 14 days to 1–3 days |

**Recommended storyline.** A new **multimodal bridge built 2060–2070 next to the old one**, with:
- a two-track tram;
- a 4 m wind-shielded cycle and footpath;
- two road lanes.

The old bridge is used as a bus, cycle and emergency deck until its concrete is exhausted, around 2080.

### 3. Approaches and sea level

- **Land-side design.** Ölandsleden in Tallhagen (lowest point 2.3 m, about 440 m below 3.4 m) should be raised to **at least 3.0–3.5 m RH 2000** when the link is rebuilt. That is MCF's 2150 hazard levels of 2.7 m (SSP2-4.5) and 3.4 m (SSP5-8.5) plus freeboard.
- **Risk to 2126.** In the model's 2126 worlds the road is dry in a 100-year event, but with 0.4 m (SSP2-4.5) and 0.1 m (SSP5-8.5) margin. Waves and the upper end of the SSP5-8.5 range (2.5 m in 2100) can cut the island's only land route at Tallhagen.
- **Model mechanic.** Close the link for 1–3 days when the sea level exceeds 2.3 m, and leave it open after raising.
- **New abutments.** Design them at 2150 SSP5-8.5 levels, at least +3.4 m plus waves. The Öland side (Möllstorp, above 5 m) needs no action.
- **Kalmar C** (about 2.2 m; rail yard about 89% flooded at 2.18 m) is the more exposed rail asset. The planned rebuild (261 MSEK, still only "planning") should include raising or flood protection. Alternatively, move the station inland, west of today's site; Kalmar kommun has studied this (Trafikverket ÅVS 2020).

### 4. Train travel times achievable by 2050

| Relation | Today | 2050, realistic | What it takes |
|---|---|---|---|
| Kalmar–Växjö | 67 min | **45–50 min** | RSS 2040 target; long passing loops or double track Kalmar–Emmaboda–Växjö, 200–250 km/h (Region's vision), express stopping pattern |
| Kalmar–Copenhagen | 3 h 44 | **3 h 15–3 h 25** | The above plus Hässleholm–Lund four tracks (in plan) |
| Kalmar–Malmö | 3 h 03 | **2 h 35–2 h 45** | Same |
| Kalmar–Linköping | 3 h 05 | **2 h 30–2 h 50** | Berga triangle + Kåremo (−10 min); "Järnväg light 160" package (3 billion SEK at 2013 prices → 150–154 min); bimodal or battery trains instead of a wire |
| Kalmar–Stockholm | about 4 h 30 (change) | **3 h 30–4 h, direct** | Kalmar–Växjö upgrade, Alvesta triangle (in plan, planning) for direct Kalmar–Stockholm trains without a change, and Ostlänken Järna–Linköping (under construction) on the Södra stambanan path |

**The 4-hour line matters.** Once Kalmar–Stockholm is under 4 h, the proposed four-hour rule stops subsidised flights and rail takes most of the Stockholm market. Model this as happening in the **2040s** if the three projects are delivered, otherwise after 2060.

**Kalmar C capacity.** It must grow from 3 to 5 platform tracks; the planned project gives about 80 trains a day and 1.4 million trips a year by 2045. A 2126 Kalmar with a tram network and more regional trains likely needs a **through or relocated station**.

**Electrification.** Assume Kust till kust stays electric. Stångådalsbanan runs bimodal or battery trains until at least the 2040s, with partial wiring only if traffic grows. Night trains to Kalmar are not in any plan; a Kalmar–Stockholm sleeper via the Alvesta triangle is an optional 2126 feature.

### 5. The airport's likely future

**Trend.** Passengers fell from 232,000 (2019) to 88,000 (2025), and Q2 2026 was −13%. There is one scheduled route.

**Scenarios to 2050:**
1. **Decline and closure of scheduled service.** About 0–30,000 passengers once rail is under 4 h (the most likely path).
2. **Regional electric or hybrid aviation.** 19–30 seats to Arlanda, Copenhagen and Visby; about 50,000–100,000 passengers.
3. **Status quo with sustainable fuel.** About 90,000 passengers.

**2126.** The airfield is mostly repurposed: solar (Törneby already on site), an emergency, defence and general-aviation strip, and perhaps electric short-haul. Keep the 516 t CO2 local figure as the floor of aviation emissions. Whole-flight emissions are several times larger and should come from passenger-km, not from this local figure.

### 6. Tram or BRT over the bridge

**Near term (2030s): BRT on the existing deck**
- Reallocate one lane per direction to buses on Ölandsbron and Ölandsleden. The 12.8 m deck can take 2 general + 2 bus lanes.
- Run a 10–12 km trunk line Kalmar C–Färjestaden in about 20–25 min every 7–10 min, with Öland lines feeding at Färjestaden.
- A bus lane at 20–30 articulated buses an hour carries 2,000–3,000 people per hour per direction, about one car lane's worth of people at today's occupancy.
- This only works with demand management in summer (25,000–36,000 vehicles a day): park-and-ride at Färjestaden and Kalmar, and parking pricing.
- It fits the county's BRT concept and the 17%-by-2028 share target.

**Long term (with the new bridge, about 2070): tram**
- A Kalmar C–Färjestaden tram, about 10 km and about 20 min, as an extension of a Kalmar city tram.
- About 6,860 commuters and 15,000–25,000 vehicles a day cross today. A 30–40% public transport share across the strait means about 6,000–10,000 trips a day.
- The old bridge's load capacity and remaining life make tram tracks on it unrealistic.

**Cycling**
- A wind-shielded path on the new bridge ends the 2009 ban. Kalmar–Färjestaden is about 10 km, 25–30 min by e-bike.
- Model 5–10% of cross-strait commuters (about 350–700 a day) plus summer tourism; today the ferry carries about 13,000 bikes a season.
- Close the path on wind-restriction days (from 27 m/s, rare).

**Boats**
- Keep a year-round electric passenger ferry Kalmar–Färjestaden (6 km, about 25 min, 100–150 passengers) as both commuter link and preparedness asset.
- A contracted ro-ro standby with 24–72 h activation would replace the current lead time of up to two weeks.

### 7. Preparedness (SDG 11.5)

- Treat "bridge out" as a scenario event. Base it on events seen to date: accidents, wind, sea level at Tallhagen and sabotage.
  - **Short closures** (hours): accidents and wind, 1–3 a year.
  - **Rare long closures** (weeks): the Strömsund 2026 analogue.
- In the model, a long closure:
  - cuts 4,784 Öland-resident commuters off from their mainland jobs (3,767 of them in Kalmar);
  - cuts 2,077 mainland residents off from jobs on Öland;
  - cuts off food flows (Guldfågeln, about 600 employees).
- A **second fixed link or a tunnel** in the 2070s removes this vulnerability. Until then, ferry berths and a standby vessel are the cheap mitigation.
