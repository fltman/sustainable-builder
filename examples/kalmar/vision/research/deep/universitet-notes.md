# Universitet: Linnaeus University in Kalmar and the city's future (deep research notes)

Compiled 2026-10-09. Companion to `universitet.json`, which holds 27 indicators (English in `universitet.en.json`). Each indicator records the exact URL where its number can be checked. The baseline already holds `helarsstudenter_kalmar` (about 6,000 full-time equivalents, 2021) and `eftergymnasial_utbildning_25_64` (49.5%). Neither id was reused: no source published after 2021 gives an official Kalmar figure that would justify replacing the 6,000 (see "Discrepancies" below).

## Method

### Documents read
PDFs were fetched into memory and piped through `pdftotext` on stdin. Only the extracted text was kept, in the session scratchpad; no PDF was saved to the project. Every figure was checked in context.
- **Linnaeus University (LNU):**
  - Årsredovisning 2025 and 2024: key-figure tables, education, collaboration and finance chapters.
  - *Lokalförsörjningsplan 2025–2027* (dnr 2024/354), the premises plan with leases, floor areas and vacancy by campus.
  - *Mål 2026–2030*, the goals adopted by the board on 2025-06-09.
- **Kalmar Municipality:**
  - *Universitetsstaden Kalmar – vad har hänt 2010–2021?* (2022), covering agreements, student facts and a retention study.
  - *Överenskommelse om strategiskt partnerskap 2026–2028*, the partnership agreement between LNU, Linnékåren, Kalmar and Växjö.
- **Region Kalmar County:**
  - Minutes of the regional development committee, 2024-03-20.
  - Minutes of the research, development and eHealth committee, 2025-04-01 and 2026-02-10.
  - The analysis *Var tar studenterna från LNU vägen?* (STATIV 2017), hosted by Region Kronoberg.
- **Others:**
  - UKÄ: *Lärosätenas årsredovisningar 2025* (2026-03-26).
  - Kalmarhem: *Årsredovisning och hållbarhetsrapport 2024*.
  - Sveafastigheter's press release on the sale of the west-campus property (2016-11-15).

### Web pages
- **lnu.se:**
  - The facts page (2025 numbers).
  - The Universitetskajen campus page.
  - The Kalmar Maritime Academy pages (Swedish and English).
  - Research pages for LMO, EEMiS and the K-station.
  - A 2019 news item on the move into Magna, Radix and Vita.
  - The vice-chancellor's blog post "Ett lärosäte som gör skillnad".
  - The EUniWell Citizen Science Talks page.
- **kalmar.se:** the Universitetskajen and Linnéuniversitetet pages.
- **Financing and property:** NIB press releases (2018, 2020) and Akademiska Hus's 2012 sale release.
- **Trade press:** Arkitekten.se (2016) and Byggnyheter (2020).
- **News:**
  - Barometern (2015-05-21).
  - SVT Småland (2026-03-12).
  - Universitetsläraren (2026-09-21).
  - Publikt (2026-10-06).
- **Shipping:** Kongsberg Maritime's 2026 feature on Kalmar Maritime Academy's eco-driving studies, and a Maritime Executive item on Kongsberg's 2024 simulation conference in Kalmar.

### Statistics
SCB PxWeb API, using POST queries to `api.scb.se`:
- **BefProgRegFakN:** regional projection 2024–2070, for Kalmar kommun (0880) and Kalmar län (08).
- **BefolkprognRevNb:** national projection 2026–2120.

The 19–24 and 25–34 age groups were summed from single-year ages, for both sexes and all origins. The cited statistikdatabasen URLs return HTTP 200.

### Searches and own calculations
22 web searches were used, plus about 45 direct fetches of known URLs. Own calculations are shown in the notes and records. Values that rest on an assumption are marked `estimate`.

## Main findings

### 1. Size

**Linnaeus University as a whole** (LNU annual report 2025, key-figure table):

| Measure | Values |
|---|---|
| Full-time equivalent students (hst) | 16,383 (2020), 16,180 (2021), 15,640 (2022), 15,642 (2023), 15,128 (2024), **15,440 (2025)**, i.e. −5.8% since 2020 |
| Distance share of hst | 39% in 2025, down from 41% in 2024 |
| People, 2025 | 40,259 registered students; 2,145 employees (average); 1,801 full-time equivalents; 139 professors (FTE); 150 professors (headcount) |
| Doctoral students with activity | 288 in 2025 (315 in 2021); new admissions 34 in 2025 (55 in 2023); 51 doctoral degrees in 2025 |
| Degrees awarded, 2025 | 2,341 first-cycle, 905 second-cycle and 474 teacher degrees, about 3,720 in total |
| Revenue, 2025 | SEK 2,435 million, of which SEK 1,670 million education and SEK 765 million research (31%, 45% of it external); costs SEK 2,504 million |

**Kalmar's share is about 37% (range 36–40%).** No source publishes an official split by campus. Three independent measures agree:
- lnu.se says about 16,000 of 44,000 registered students "belong to" Kalmar and 28,000 to Växjö, i.e. 36%. The page is undated; the 44,000 total fits 2021–2022.
- Kalmar Municipality's "about 6,000 hst in Kalmar" (2021) is 37% of that year's 16,180.
- Universitetskajen accounts for 48,800 of LNU's 131,300 leased m² (37%, 2023).

In 2015 LNU itself said about 40% of its activity was in Kalmar (Barometern). Derived from the 37% share:
- **Registered students linked to Kalmar in 2025:** about 14,500 (36% of 40,259).
- **Staff in Kalmar:** about 800 (range 700–900), roughly 2% of the 39,331 jobs located in the municipality. A 2019 LNU news item already counted about 400 staff in Magna, Radix and Vita alone, before the School of Business and Economics, the library and the administration moved in.
- **Students physically on campus:** the 6,000 hst includes distance study. If Kalmar's distance share matches LNU's 39%, about 3,700 hst study on site (range 3,000–4,500).

**Other students in Kalmar:**
- **Medical students:** Linköping University's programme has about 120 places (six clinical semesters, about 20 per semester) based at the county hospital. In 2021 there were 117 such students. Of the first 14 graduates (2021), 9 stayed to work for Region Kalmar County.
- **Kalmar Maritime Academy** (founded 1 October 1842; 200 years in 2042) has about 700 programme students, with almost as many again in single courses. About 10% are women. LNU has graduated 925 master mariners and marine engineers since 2010, about 60 a year.

### 2. Campus: Universitetskajen

**Location and timeline**
- Six connected buildings in the former harbour area Ölandshamnen, next to Kalmar Central Station and the guest harbour. Students and staff can walk between all six buildings indoors. There are 56 lecture rooms; the largest, Aula Sienna in Culmen, seats 250.
- Planning began around 2008. The location was decided in November 2015, the government approved the 20-year west lease in October 2015, and ground was broken in January 2016 with the Prime Minister present.
- Magna, Radix and Vita opened in 2019. The School of Business and Economics was the last faculty to move in (SVT). The campus was complete in 2020 and inaugurated on 27 August 2021.
- Arkitekten.se called it the largest state building project in Kalmar since the Öland Bridge.

**Who is where.** All faculties in Kalmar, the university library and infocentre (Stella), and the administration and main lecture halls (Culmen) are on the campus. Vita houses health and life sciences, including the clinical training centre for nursing.

**Size**
- LNU leases 48,800 m² there: Intea/Eldaren 6 has 27,000 m² and P&E/Eldaren 1 has 21,800 m² (premises plan, 2023-12-31). The total project including garages was planned at 65,000–67,000 m² (Arkitekten.se 2016).
- Byggnyheter (2020) gives about 22,000 m² for the west part and 43,000 m² for the three new east buildings including the garage.

**Leases**
- West part (Forma, Magna, Radix): 20-year lease with Kalmar Eldaren AB (P&E) until 2038.
- East part (Vita, Culmen, Stella): two 10-year leases with Intea Eldaren AB, expiring in **2028 and 2030**.
- The premises plan says LNU judges its Kalmar premises to have "låg nyttjandegrad och till hög kostnad" (low utilisation at high cost). Vacancy is 2% in Kalmar against 0.5% in Växjö.
- The campus produced 140,000 kWh of solar power in 2023 and was designed for seawater cooling. Both parts were to be LEED-certified, with Gold targeted for the east part (NIB, Sveafastigheter).

**Cost**
- NIB lent Intea SEK 500 million in 2018 for the first eastern phase (including Vita) and SEK 310 million in 2020 for Stella and Culmen (12,000 m²).
- The trade press reports Skanska contracts worth about SEK 1 billion plus a SEK 500 million order (roughly SEK 1.5 billion). That figure could not be verified, because the source pages were gone or had certificate errors.
- LNU's premises cost SEK 2,528 per m² in 2025 across the whole university.

**The old sites**
- Before the move, LNU in Kalmar was spread over "more than 15 addresses" (kalmar.se, lnu.se).
- Akademiska Hus owned about 28,000 m² in Kalmar, mainly let to LNU. In 2012 it sold just over 16,000 m² (nine buildings on southern Malmen and Rostad, including the then university library) to LW Fastigheter i Kalmar AB.
- In May 2013 it sold the remaining harbour property (about 12,000 m² lettable) to Sveafastigheter. That property was redeveloped into the west part (lease about 23,000 m²) and sold in 2016 to Länsförsäkringar Kalmar län, the IngaBritt och Arne Lundbergs forskningsstiftelse, P&E Persson AB and a pension foundation.
- What the older Malmen and Rostad buildings are used for today was not verified.
- No involvement by Vasallen was found. Vasallen converted military sites, and none of LNU's Kalmar premises appear to have been one.

### 3. Research that matters for Kalmar's future

- **The Baltic Sea and Kalmar Strait**
  - EEMiS (about 60 people) is a Linnaeus University Centre of excellence studying food webs from microbes to fish and birds. Its long-term sites are:
    - **LMO**, 11 km off Kårehamn on Öland: more than 437 samplings since 2011, about every second week.
    - **K-station**, opposite Kalmar Castle: weekly since March 2018.
    - A warming bay.
    - Acoustic monitoring.
  - EEMiS is part of the government's EcoChange programme and advises the Swedish Institute for the Marine Environment.
  - In 2024 the LMO lead, Jarone Pinhassi, became LNU's first Wallenberg Scholar (SEK 20 million over five years).
  - The Linnaeus Knowledge Environment Water is part of EEMiS.
  - Projects with the city:
    - Algoland: algae grown with Kalmar Energi at Moskogen, and mussel farming and feed.
    - LIFE SURE: a sediment-recovery project led by Kalmar Municipality.
- **Fossil-free shipping**
  - Kalmar Maritime Academy researches working life and risk, the environmental impact of shipping and marine spatial planning, and energy efficiency. It has used Kongsberg bridge and engine-room simulators for over 40 years.
  - Its simulator-based eco-driving courses report:
    - Up to 13% lower fuel use on small Stockholm archipelago passenger ferries.
    - More than 400 Swedish Transport Administration road-ferry crew trained since 2015: 1.5 litres less per crossing and a claimed 11,000 t CO₂ a year.
    - More than 700 officers trained in total.
  - The source is Kongsberg's account of an LNU report, which was not reviewed here.
  - In 2024 Kongsberg's global simulation user conference was held at LNU in Kalmar.
- **Health, AI and data**
  - Samverkan e-hälsa is a ten-year LNU–Region Kalmar County initiative for 2022–2032. In 2025–2026 it added:
    - A professor of health informatics (from 1 January 2026).
    - A graduate school with seven doctoral students.
    - A master's programme in eHealth with 360 applicants for autumn 2025.
    - AI Boot Camp and Studio e-hälsa for staff and politicians.
    - A Data Factory.
  - Region Kalmar County runs eHealth Arena with LNU and Kalmar Science Park.
  - A web-search snippet, apparently from an LNU job advertisement, mentions SEK 400 million over ten years for the eHealth effort. The page itself could not be retrieved, and no official document confirming the figure was found.
- **Law and justice.** Kalmar is building a legal-science environment (details under section 4).
- **Energy.** Most of LNU's energy engineering and bioenergy is in Växjö. Kalmar has operating and maintenance engineering at the Maritime Academy, plus the algae and Kalmar Energi work.

### 4. The university and the city

**Agreements**
- Kalmar Municipality hired Sweden's first "university strategist" in 2013.
- Since 2017 there has been a strategic partnership between LNU, Linnékåren, Kalmar and Växjö. The current agreement runs 2026-01-01 to 2028-12-31 and has three goal areas: attractiveness, research and knowledge development, and skills supply and working life. It carries no money; larger projects need separate agreements.
- In 2018 the municipality agreed to give SEK 1.5 million a year for ten years for research, development and growth.
- In December 2021 Kalmar and LNU signed a legal-science deal worth at least SEK 300 million over ten years (municipality SEK 100 million, LNU at least SEK 200 million), aiming for a law degree with first admission no later than 2027.
  - The bachelor's programme in legal science started in 2024 with 60 students. In 2025 it had 587 applicants for 70 places.
  - Degree-awarding powers at master's and doctoral level were granted in 2025.
  - The application to award the professional law degree (juristexamen) was submitted in September 2025.
- The municipal group's research funding was a record SEK 2.7 million in 2019.

**Retention of graduates**
- Of the 8,800 graduates of 2015–2017, **37.7%** lived in Kalmar or Kronoberg County three years later. That was 78.6% of locally recruited graduates but only 16.6% of nationally recruited ones. Nationally recruited stayers made up 11% of all graduates.
- In STATIV 2017, 26% of LNU's 2011–2017 graduates lived in Kalmar County and 27% in Kronoberg County. 36% of those born outside the region stayed, against 83% of those born in it.
- LNU says 70% of higher-educated people established in Kalmar and Växjö hold an LNU degree. The vice-chancellor says 80% of regional applicants stay in the regional labour market, against 20% of those from elsewhere.

**Housing and student life**
- Kalmarhem has a student-housing guarantee: newly admitted students who register as residents are offered a home within two months.
  - It offered 574 guarantees and signed 386 contracts in 2021, and signed 428 contracts in 2024.
  - It had 928 student homes at the end of 2024, down from 984 the year before.
  - Demand for student housing has been falling for several years, and annual turnover is 63%.
- SFS has rated Kalmar "green" for student housing since 2020, and named it Student City of the Year 2023.
- In 2021 Drivhuset met 2,929 students and alumni, and 18 businesses were started.

**Economic footprint**
- No economic-impact study of LNU in Kalmar was found.
- LNU's gross spending in Kalmar is estimated at about SEK 930 million a year (36–40% of SEK 2,504 million). 68% of it is staff and 12% premises.

### 5. Outlook

**Finances**
- LNU ran deficits of −SEK 95 million (2024) and −SEK 69 million (2025). Agency capital fell from SEK 383 million (2023) to SEK 221 million (2025).
- The government's funding ceiling for education is being lowered for 2025–2027. Yet LNU delivered 104% of its ceiling in 2025 (UKÄ), i.e. unpaid over-production.

**Cuts**
- SVT (March 2026): for the first time LNU must cut student numbers, possibly by about 1,000. It must save SEK 47 million to 2027, and its course and programme offer is to shrink by 15% by 2030, mainly distance learning.
- In June 2026 the board set savings of about SEK 120 million for 2027–2029, including SEK 50 million in support functions. Staffing had already been cut by 30 FTE in 2025, and an administrative hiring freeze runs from 18 May 2026 to 30 June 2027.
- Unions say the changes affect both Kalmar and Växjö "evenly"; layoffs are possible.
- A new vice-chancellor took office on 1 October 2026.

**Risk of activity moving to Växjö**
- No decision or proposal to move activity was found.
- But the conditions for a consolidation debate exist: the lease expiries in 2028 and 2030, LNU's own judgment that Kalmar premises are under-used and costly, the savings requirement, and centralisation of support functions.
- Växjö's large strategic partnership (The Bridge with IKEA and Södra, about 75 projects) has no Kalmar equivalent of the same scale. Kalmar's anchors are law (with the municipality), eHealth (with the region), the Baltic Sea (EEMiS) and the Maritime Academy.

**LNU's strategy (Mål 2026–2030)**
- Research is to grow to the same size as education (today 31% of revenue), and external funding is to reach 50% of research funding.
- At least 16% of publications are to be highly cited.
- 500 international (mainly master's) students and 300 outgoing students.
- Campuses are to be "inspiring environments for collaboration".
- The 2025 education strategy aims for fewer but larger programmes built on the strongest research.

**Demography (SCB projections)**
- Sweden's 19–24 cohort grows from 740,827 (2026) to a peak of 779,316 (2035), then falls to 667,595 (2050), i.e. −14% from the peak. It recovers to 765,679 by 2070.
- Kalmar kommun: 5,851 (2025) → 6,688 (2035) → 5,730 (2050) → 6,560 (2070).
- Kalmar län: 14,535 → 15,798 → 13,247 → 15,027.
- Kalmar kommun's 19–24 share is 8.0% (2025) against 7.0% nationally and 5.9% in the county. Its 25–34 share is 13.6% against 12.5% and 10.9%. This is the university-town bulge.

## Discrepancies and caveats

- **Kalmar full-time equivalents.** Kalmar Municipality (2022 brochure) says about 6,000. Region Kalmar County's committee minutes of 2024-03-20, summarising an LNU communicator, say about 8,000. The 8,000 would mean 51% of LNU, which contradicts the other measures (36–40%). It probably includes something else, such as distance students registered on Kalmar-based courses or contract education. The 6,000 is kept as the best figure, with 6,000–8,000 as the outer band.
- **"Students in Kalmar" mixes three things:** registered heads (about 14,500–16,000), full-time equivalents attached to Kalmar (about 6,000) and people physically studying in the city (about 3,700 FTE). The model should use the last for city life and housing, and the first for the university's reach.
- **Retention figures** cover Kalmar *and* Kronoberg counties. The three-year cohort measure (37.7%) is better than the 2017 stock measure (53%), which includes recent graduates who had not yet moved.
- The eco-driving CO₂ figure (11,000 t a year) seems large next to 1.5 litres per crossing; it was not verified.
- **Scope for whole-university records:** these (`lnu_*_totalt`, `lnu_forskningsintakter`, `lnu_resultat_mnkr`, `lnu_sparkrav_mnkr`) use scope `Kalmar län` because the schema has no level for the two-county Linnaeus region. Their names say "hela Linnéuniversitetet".

## Open questions

1. An official split of hst, staff, doctoral students and research money between Kalmar and Växjö. It exists in Ladok and Primula and could be requested from LNU's analysis unit.
2. Graduate retention after 2020 and for Kalmar kommun specifically. LNU's 2023 report *Studentrekrytering, etableringsmönster och kompetensförsörjning* is cited but unpublished.
3. Whether UKÄ approves the juristexamen application (submitted September 2025), and the planned intake of the law programme.
4. What happens at the Intea lease expiries (2028, 2030), and how the SEK 120 million savings fall between campuses.
5. The current use and owners of the old campus buildings on Malmen and Rostad.
6. The size of the eHealth commitment (the unverified SEK 400 million figure in a search snippet).
7. No economic-impact study, no formal LNU–Kalmar living lab and no Kalmar Strait citizen-science programme were found. LNU runs an EUniWell Citizen Science Talks lecture series but no local monitoring scheme.
8. How many students are registered as residents (folkbokförda) in Kalmar. Linnékåren's "Ny i Kalmar" campaign suggests many are not.

## Implications for the 2126 model

The model has no university lever today. Population grows by `0.58%·V.growth·e^(−t/30) + 0.6%·(attract − 0.67)`, and the `education` indicator is upper-secondary completion. The suggestions below are **assumptions derived from the numbers above**, not findings.

### 1. Population and age structure

**Static footprint.** About 3,700 campus FTE (3,000–4,500 people studying on site, plus about 120 medical students) and about 800 staff come to roughly 4,500–5,500 people, or **6–8% of Kalmar's 73,068 inhabitants**.

**Age bulge.** Compared with the county, Kalmar kommun has about 1,540 extra 19–24-year-olds ((8.0 − 5.9)% × 73,219) and about 1,980 extra 25–34-year-olds. Compared with Sweden the surplus is about 730 and about 800.

A rule of thumb: the university holds up **2,000–3,500 residents aged 19–34 (3–5% of the population)** and keeps the share aged 65+ about 1 percentage point lower than it would otherwise be.

**Flow.** Graduates leave Kalmar at about 1,380 a year (37% of about 3,720 LNU degrees). Of these:
- About 520 a year are still in the two counties three years later (37.7%).
- An estimated 200–260 a year live in Kalmar kommun.
- About 29% of stayers are in-migrants (11/37.7), and some of the locally recruited stayers would otherwise have left.

The growth attributable to the university is therefore about **100–200 people a year, or +0.14–0.27% population growth a year**. By comparison, the whole municipality grew by 364 people in 2025.

**Suggested model terms**
- Add `g_univ = 0.002 × (U − 1) + 0.0004 × L_univ` to annual growth.
  - `U` is Kalmar's university size relative to 2025, with an uncertainty range of 0.7–1.3.
  - `L_univ` is a new 0–3 policy lever for retention.
- A consolidation event (`U` falling to 0.7) should also remove a one-off **1.5–2.5% of the population over about 8 years** as students and staff leave. Full closure would remove 6–8%.
- If `U < 1`, add +0.5 to +1 percentage point to `share65` by 2050.

### 2. Student numbers to 2050 (FTE attached to Kalmar; base about 6,000)

| Scenario | 2050 FTE | Index vs 2025 | On-site FTE |
|---|---|---|---|
| Low: consolidation | 4,000–4,500 | 0.7 | about 2,800 |
| Central | 5,500–6,500 | 1.0 | about 3,700 |
| High: knowledge city by the strait | 7,000–8,000 | 1.3 | 4,500–5,000 |

- **Low.** The 2028/2030 leases are not renewed for all functions, some programmes are merged into Växjö, distance teaching is cut, and the national 19–24 cohort falls 10% (2026–2050).
- **Central.** The demographic dip and funding-ceiling cuts (−6% around 2027) are offset by law (a bachelor's of about 200 FTE at steady state, plus a 4.5-year law programme worth about 300–450 FTE if approved) and by eHealth.
- **High.** The law degree is approved and research grows to equal teaching, as in LNU's 2030 goal. Lifelong-learning and international master's students increase, and Kalmar's share of LNU rises to about 42%.

Beyond 2050, SCB has the cohort recovering by 2070 (+15% from 2050). Let the uncertainty band widen to ±40% by 2100. Suggested event years:
- 2027: law degree decision.
- 2028 and 2030: east-campus leases.
- 2032: end of the eHealth agreement.
- 2035: the 19–24 peak.
- 2038: west-campus lease.
- 2042: 200 years of the Maritime Academy.

### 3. Higher-education attainment (new indicator `higherEd`)

**Baseline:** `eftergymnasial_utbildning_25_64` = 49.5% (2025); Sweden 48.5%, county 39.7%. Benchmarks for 20–64 in 2020: Umeå 55.1%, Linköping 53.8%, Växjö 46.9%, Kalmar 44.4%.

**Suggested paths to 2050:**
- Central: +0.3 percentage points a year, to about 57%.
- High (with `L_univ` = 3): about 61%.
- Consolidation: about 53%.

Saturate near 65% by 2100.

### 4. Kalmar Strait restoration

**The knowledge infrastructure:**
- EEMiS has about 60 people.
- LMO samples about 29 times a year since 2011.
- The K-station samples about 50 times a year in the strait itself.
- Kalmarsundsverket's −35% N/P from 2027 is already in the model.

**Suggested coupling.** A "Kalmar Strait living lab" (`L_univ` ≥ 2) multiplies the effect of `I.hav` on `baltic` by **1.1–1.2**, i.e. the 0.38 coefficient becomes about 0.42–0.46. It also shortens the response lag from 22 to about 18 years, through targeted measures, monitoring and adaptive management. This is an assumption, not a measured effect.

A measurable target already in the baseline is eelgrass depth (`algras_djuputbredning_kalmarsund`, 6.3 m in 2023). A plausible strong-policy path is 7.5–8 m by 2060, but that too is an assumption.

**Citizen science.** A Kalmar Strait monitoring programme run with EEMiS could cover water clarity, eelgrass, bladder wrack and coastal fish, with 10–20 school classes and 300–1,000 volunteers a year. Suggested effects: −0.5 to −1 percentage point on `lowParticipation`, and earlier detection in the `bloom` narrative.

### 5. Fossil-free shipping

The Maritime Academy supplies about 60 master mariners and marine engineers a year and runs simulator training proven to cut fuel use (up to 13%). Two suggestions:
- If the city chooses a maritime test-bed partnership (for example electric or hydrofoil boat buses in the strait, with crews certified on the academy's simulators), shift the `boatElectric` S-curve midpoint **3–5 years earlier**. That would give `2048 − 14·I.kollektivt − 4·L_univ/3`.
- Cut fuel use of the remaining fossil vessels by **5–10% from 2030** through eco-driving training (half to three quarters of the 13% upper bound).

### 6. City policy choices that strengthen the role (inputs for a decision card around 2030)

1. **Graduate housing.** Student demand is falling: Kalmarhem went from 984 to 928 student homes, with 63% turnover. Convert 100–150 student units into 2–3-year "first job" flats for new graduates. Target three-year retention of 42–45% instead of 37.7%, which is 4–7 percentage points or about **55–100 more graduates a year** staying in the region.
2. **Kalmar Strait and climate-neutral Kalmar living lab.** Fund it at SEK 3–5 million a year jointly with Region Kalmar County, the same order as today's commitments (SEK 1.5 million a year for research plus an average SEK 10 million a year for law). Aim for external matching of 1:1 to 1:3; EEMiS already attracts Formas, EU and Wallenberg money.
3. **Secure the campus before 2028/2030.** The city, region or Kalmar Science Park could rent part of LNU's under-used space in Kalmar (2% of 48,800 m² is about 1,000 m² vacant) for eHealth Arena, the living lab or municipal innovation teams. That lowers LNU's costs in Kalmar and ties the east campus to the city. In the model, this choice keeps `U` ≥ 1.
4. **Anchor programmes.** Support the law degree approval and the 2032 renewal of the eHealth collaboration; each is worth several hundred FTE and specialised jobs in Kalmar.
5. **Registration and welcome.** Expand "Ny i Kalmar" so that students register as residents. This raises the official population and municipal income without changing who lives in the city; how large the effect is remains an open question.

**Suggested lever and uncertainty**
- A decision card titled "Kunskapsstaden vid sundet" (the knowledge city by the strait), with three options:
  - Living lab, graduate housing and maritime test bed: `L_univ` = 3.
  - Housing guarantee only: `L_univ` = 1.
  - "The university is the state's business": `L_univ` = 0, and the probability of a consolidation event at the 2028–2030 lease expiries rises from about 0.15 to about 0.35.
- Add `univ:[0.7, 1.3]` to `SPREAD`.
