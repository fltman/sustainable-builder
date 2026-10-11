# Samhälle: everyday life, housing, work, preparedness, technology (deep research notes)

Compiled 2026-10-08. Companion to `samhalle.json`, which holds 32 indicators. Each indicator records the exact URL where its number was read. The work focuses on closing gaps from `kalmar-baseline-notes.md` and on anchoring these model assumptions: `workHours`, `cohousing`, `foodStockDays`, `analogResilience`, `aiCapacity`, `aiGovernance`, `welfare` and `wellbeing`.

## Method

### Machine-readable sources
- **Kolada v3:** every Kolada value was read from the API URL cited, using codes 0880, 0008 and 0000.
- **SCB PxWeb API**, read with POST queries to `api.scb.se`. The cited URLs are the matching statistikdatabasen pages, and every one of them returns HTTP 200. Tables used:
  - BO0406Tab01 (rents by kommun)
  - AKU tables NAKUOkMedArbtidAr, NAKUFaktMedArbtidAr and NAKUSysselOkArbtidAr
  - HE0111 HushallT26 (households by size)

### Reports and PDFs
Reports and PDFs were read as text by piping them through `pdftotext` to stdout, without saving them to disk. Each figure was checked in context. Documents read:
- Kalmarhem's 2024 annual report
- Länsstyrelsen's Regional bostadsmarknadsanalys 2026
- Linnéuniversitetet's Årsredovisning 2025
- SOM-institutet's *Svenska trender 1986–2025*
- Kalmar i fickformat 2023
- Akavia's AI survey report
- The Kalmar kommun motion file on AI (tjänsteskrivelse and KF protocol)
- The Region Kalmar län board protocol of 2025-02-06
- Dir. 2022:33
- Internetstiftelsen 2025
- Marie Cederschiöld högskola's report on volunteering

### Web pages
SEI's Konsumtionskompassen per-kommun page, kalmar.se preparedness pages, Kollektivhus NU member lists, the EU Commission's AI Act pages and SCB's AI statistics release.

### Searches and own calculations
About 27 web searches were used, slightly over the budget of 25; after that only known URLs were fetched. Own calculations are shown below and marked `estimate`.

## Findings

### 1. Housing
- **Housing shortage.** In Boverket's bostadsmarknadsenkät (via Kolada U30446 and U30460), Kalmar reports *underskott* for the kommun as a whole in 2024, 2025 and 2026. In 2026 it also reports underskott for young people (19–25), but balance for students.
  - Länsstyrelsen's 2026 analysis names Kalmar as one of 4 shortage kommuner, with Torsås, Mörbylånga and Borgholm. Five kommuner in the län report a surplus.
  - Länsstyrelsen also says Kalmar finds vacant homes too expensive for young people.
- **Rents.** SCB's 2026 median rent for Kalmar is 1,496 kr/m² per year (±77). That is level with the national 1,483 kr and well above the län's 1,274 kr. Rent rose about 10% from 2024 (1,352 kr).
- **Kalmarhem.** At 31 Dec 2024 Kalmarhem had 5,218 homes, of which 928 were student homes. Its letting rate was 99%, and annual turnover was 20% in ordinary homes and 63% in student homes. Kalmarhem publishes no queue length and no average waiting time:
  - You earn one queue point per day.
  - The points needed are shown only per advertised flat.
  - Third-party sites such as boio.se also say there is no official waiting time.
- **People living alone.** SCB counts 16,046 one-person households in 2025, which is 44.7% of households (national 42.0%).
  - Own calculation: 16,046 / 73,068 inhabitants = 22.0% of residents live alone (national 2,103,186 / 10,605,529 = 19.8%).
  - Kolada's "ensamstående hushåll" (51.2%) also counts single parents, so it was not used.
- **Kollektivhus and bogemenskaper.** Kollektivhus NU's member lists (Stockholm, Göteborg, Skåne, "övriga Sverige" and start-up groups) contain no house or start-up group anywhere in Kalmar län. The nearest are in Växjö: Slånbäret with 34 flats, and Sämjan.
  - A Bovieran (a senior housing concept with a shared winter garden) reportedly exists in Kalmar, but its size could not be verified because bovieran.se refused the connection.
  - No byggemenskap allocation by Kalmar kommun was found.
  - A secondary source (boio.se, citing Kollektivhus NU 2026) gives about 50 kollektivhus and just under 3,000 flats in all of Sweden. That is about 0.06% of the country's roughly 5.0 million households. This figure is not used as an indicator.

### 2. Work
- **Working hours (SCB AKU 2025, whole country).**
  - Agreed (överenskommen) average: 37.3 h/week for ages 15–74 and 38.1 h for ages 20–64. Men 38.2 h, women 36.2 h.
  - Actual hours worked: 29.7 h for 15–74 (30.6 h for 20–64). This is averaged over all weeks, so holidays, sickness and parental leave are included.
- **Part-time.** Own calculation: people with agreed hours of 1–34 h per week are (277.8 + 601.9 thousand) / 5,263.0 thousand = 16.7% of employed. Women 21.6%, men 12.3%. Excluding the roughly 254,000 people with no agreed hours gives 17.6%.
- **Public opinion.** In the 2025 SOM survey, 55% think a six-hour working day is a good proposal and 23% a bad one.
- **Jobs in Kalmar kommun.** There are 39,331 jobs located in the kommun (2024) and 36,588 employed residents, which implies net in-commuting of about 2,700. 30.9% of jobs are in the kommun/region sector (women 45.6%, men 16.3%) and 7.4% in the state.
- **Largest employers.**
  - Kalmar kommun's "Kalmar i fickformat 2023" lists the largest employers in 2022 without staff numbers or a clear ranking: Kalmar kommun, Region Kalmar, Linnéuniversitetet, Kalmarsunds gymnasieförbund, KLS Ugglarps, Sitel Sweden, Försäkringskassan, Bergkvarabuss, Webhelp Sweden and Nordic Nest. Försäkringskassan is printed twice in the layout.
  - Ekonomifakta (2025) gives the largest private employer as KLS Ugglarps AB with 575 employees, and Kalmar kommun with 5,978 employees. Ekonomifakta does not name its original source.
  - Kolada N00071 gives 5,702 permanent monthly-paid kommun employees in 2025. This counts persons, unlike the baseline's 5,426 full-time equivalents (2022).
- **Companies.** Kolada N45700 gives 50.95 "företagsförekomster" per 1,000 inhabitants in 2023. Own calculation: 50.95 × 72,304 / 1000 ≈ 3,684 firms with at least one workplace in the kommun. This is not the number of all registered companies at Bolagsverket.
- **Linnéuniversitetet.** The 2025 annual report gives 9,410 campus and 6,030 distance full-time students for the whole university, with no split between Kalmar and Växjö. The baseline's 2021 Kalmar figure (about 6,000) therefore could not be updated. SFS gives both campus cities a "green" student-housing rating.

### 3. Young people
- **Liv & hälsa ung** is still published only through Region Kalmar län's Power BI report "Elevhälsa i Kalmar län". The May 2026 slides from Region Kalmar's "Tillsammans för barnets bästa" show charts from it, such as 96/94/84/83% "mår bra", but without readable group labels, so they were not used.
- **Skolbarns hälsovanor** (Folkhälsomyndigheten) is a national sample with no regional breakdown.
- **Substitute.** Skolinspektionens skolenkät, via Kolada N15643, shows that 83.6% of Kalmar pupils in year 8 feel safe in school in 2026 (girls 80%, boys 89%). The figure was 78.1% in 2024–25, when it was 70% for girls.

### 4. Trust and participation
- **Interpersonal trust (SOM 2025, national).** 57% high trust (7–10 on a 0–10 scale), 31% medium, 12% low. This scale is not comparable with the yes/no question in HLV that the model uses (Kalmar 66.1% "trust").
- **Volunteering.** 52% of people aged 16–84 did voluntary work in 2024 (Marie Cederschiöld högskola). The share has been 48–53% every year since 1992.
- **Association membership (SOM 2025).** Trade union 40%, sports or outdoor club 34%, cultural association 14%, pensioners' association 13%, environmental organisation 7%.
- **Associations in Kalmar.** Kalmar i fickformat 2023 lists 366 föreningar, of which 108 have children's and youth activities and 62 are cultural associations. These are probably the associations registered with the kommun.
- **Wellbeing anchors.**
  - Tillväxtverket's "individuellt välbefinnande" index (Kolada N00366) is 57.7 out of 100 for Kalmar in 2025. Kolada's value for the whole country is 55.2.
  - In HLV (U01473), 83.2% have good mental wellbeing (national 84.9%), down from 86.2% in the previous measurement.
  - In SOM 2025, 92% are very or fairly satisfied with life.

### 5. Preparedness
- **National food preparedness.**
  - The planning goal set by the Totalförsvaret 2021–2025 bill, as quoted in Dir. 2022:33, is that food supply must be secured "under minst tre månader" of a security crisis with limited logistics flows (about 90 days).
  - The Riksdag adopted the law on emergency stocks in the food chain on 2026-05-26 (SFS 2026:837), and it entered into force on 2026-07-01. The government decides which goods are stored and in what quantities.
  - The first state grain stocks were procured from 2025-10-15 for the four northernmost counties, for storage in spring 2026. The 2026 budget gives 575 mnkr, already in the baseline.
  - **No official figure exists for "days of food" in the food chain or for Kalmar.** No volumes or months of coverage have been published.
- **Kalmar kommun.**
  - About 20 planned "särskilda samlingsplatser", meaning crisis meeting points with warmth, information, charging, water, toilets and first aid.
  - Shelters (skyddsrum) for about 55,000 people, about 75% of the population (own calculation: 55,000 / 73,068).
  - A nödvattenplan (emergency water plan), published on kalmar.se in January 2025.
  - The kommun asks residents to cope for at least one week without help from society.
  - The 2026 budget includes 73 tkr from the state for "Civilt försvar lagerhållning kommuner" (stockpiling by kommuner for civil defence).
  - On 6 Feb 2024 an IT attack hit the whole kommun group, and the kommun was in staff mode (stabsläge) for 13 days. Source: Kalmarhem annual report 2024.
- **Cash.** The baseline value stands: 5% paid cash at their last purchase in 2025 (10% in 2023, 40% fifteen years earlier). Riksbanken's 2026 payments report gives no percentage for households keeping cash for emergencies.
- **Digital exclusion (Internetstiftelsen 2025).**
  - 3% of people aged 16+ do not use the internet, almost all of them pensioners.
  - 95% use an e-ID, and in practice almost everyone uses mobile BankID.
  - Almost one in four have given up booking a doctor's appointment because the healthcare e-services felt too hard to use.

### 6. AI in welfare
- **Kalmar kommun.** The 2024-08-21 tjänsteskrivelse to motion KS 2024/0101 states:
  - The kommun has no formal strategic plan for AI.
  - The digitalisation and IT steering group adopted an AI guideline in November 2023, revised yearly.
  - Several potential uses of AI were identified in 2024, and some are ongoing feasibility initiatives. None are named.
  - A new digitalisation strategy that "includes AI" is being written; its status is unknown.
  - On 2024-09-30 the kommunfullmäktige declared the motion answered by 34 votes to 27. The motion asked for an AI strategic plan and ethical guidelines; M entered a reservation.
- **Region Kalmar län.** The regional board adopted a "Riktlinje för hantering av AI" on 2025-02-06 (§ 11, RS 2025/73); SD entered a reservation. Named activities: an "AI Boot Camp" for staff of the Region and Linnéuniversitetet, the "Studio e-hälsa" lecture series on AI in care, and a recruited professor of health informatics. No named clinical AI deployment was verified.
- **National picture.**
  - No SKR survey on AI use was found. SKR runs a joint municipal AI initiative (Handslaget) with about 40 kommuner and about 40 nominated AI initiatives.
  - The best available survey is Akavia's (Sept–Nov 2025, 170 of 290 kommuner answered):
    - No kommun says AI pervades the whole organisation.
    - 25% use AI to some extent in all parts, 40% in some parts, and 34% only among individual staff.
    - Just under one in four kommuner have an AI strategy; among kommuner with 50,000+ inhabitants it is four in ten.
    - Close to half have guidelines.
    - 7% have trained all staff.
  - SCB: 37% of people aged 16+ used generative AI in 2025, up from 25% in 2024.
- **EU AI Act.**
  - In force since 2024-08-01.
  - Prohibitions and AI literacy have applied since 2025-02-02, and rules for general-purpose AI since August 2025.
  - General application started 2026-08-02, including the transparency rules.
  - The AI Omnibus (in force 2026-07-27) moved the high-risk obligations to 2027-12-02 for Annex III systems and 2028-08-02 for Annex I systems. Annex III includes access to essential public services and benefits, which is where municipal use is most exposed.

### 7. Consumption-based emissions
SEI's Konsumtionskompassen 2.1 (updated March 2026) publishes household consumption-based emissions per kommun and per DeSO area:
- Kalmar 5,235 kg CO₂e per inhabitant in 2022 (376,996 t in total), against Kalmar län 5,421 kg and Sweden 5,638 kg.
- The trend for 2019–2023 is −0.4% a year.
- These figures cover household consumption only, about 62% of the total. They include long-haul flights and the high-altitude effect.

Klimatkollen uses the same SEI data, but through an API that needs authentication, so it was not used. Own estimate of total consumption-based emissions for Kalmar: 7.6 t (Naturvårdsverket, Sweden 2023) × 5,235 / 5,638 = 7.06 ≈ 7.1 t per person. With SEI's own totals (household + public 0.85 t + investment 2.59 t) it would be about 8.7 t.

## Caveats
- **AKU** has no kommun breakdown, so working hours and part-time are national figures.
- **Kollektivhus NU's lists** cover member houses only. Informal shared living (for example LSS group homes, student corridors and Bovieran) is not counted.
- **Ekonomifakta** does not state its original source. The 2022 employer list from Kalmar i fickformat has no numbers and an unclear order.
- **The volunteering report** was read from a copy hosted by Borås stad. The DiVA link found on mchs.se pointed to another report.
- **Kolada HLV values** for the kommun are pooled over four years. Skolenkät values repeat between some years, which suggests carry-forward.
- **The Akavia survey** comes from a trade union, has a 59% response rate and is not SKR's.
- **SEI's figures** use a different method from SCB and Naturvårdsverket, so the scaled 7.1 t is only indicative.
- **The ~90-day figure** is the national planning target, not a measured stock.

## Still missing
- Kalmarhem queue length and average waiting time for a first contract. Neither is published; it would need a direct request to Kalmarhem.
- Bovieran Kalmar's number of flats, and any byggemenskap or bogemenskap initiatives in Kalmar kommun.
- A ranked list of the largest employers in Kalmar kommun with staff numbers. SCB's company register or Region Kalmar län's statistics service could provide one.
- Linnéuniversitetet full-time students at campus Kalmar for 2024–2025.
- Liv & hälsa ung key results in any non-Power-BI form.
- Days of food actually stocked, nationally or in Kalmar (retail, municipal kitchens, state stocks), and Kalmar kommun's own food preparedness for its meal service.
- Kalmar kommun's 2023 AI guideline itself and the status of its new digitalisation strategy; named AI projects in Kalmar kommun and Region Kalmar län.
- Riksbanken's share of households that keep cash at home for preparedness.
- The national share of people living in kollektivhus from a primary source.

## Model implications

| Model key | Today | Suggested 2026 base | Basis |
|---|---|---|---|
| `workHours` | 38 | **37** (37.3); alternatively keep 38 as the 20–64 value (38.1) | SCB AKU agreed hours 2025. Do not use the actual hours (29.7), which include all absence. `wellbeing` then gets (40 − 37.3)/10 = 0.27 instead of 0.20. |
| `cohousing` | 0.01 | **0.002** (range 0–0.005) | No kollektivhus or bogemenskap in Kalmar län according to Kollektivhus NU. Nationally about 0.06% of households (secondary source). The constant `.01` in `s.cohousing=lag(…,.01+.42*I.bogemenskap,6)` should change with it. |
| `foodStockDays` | 7 | Keep **7** as the household norm, or about **5** as a conservative value. Keep 90 as the ceiling. | MCF and Kalmar kommun recommend one week, but only 43% of households meet it. State stocks are only starting in 2026 (law in force 2026-07-01). The national target of at least 3 months matches the model's `foodStockDays/90` scale. No measured days figure exists. |
| `analogResilience` | 0.2 | **0.15** (judgement) | Cash at last purchase has fallen from 40% to 5% in 15 years. 95% depend on an e-ID (mobile BankID). Kalmar spent 13 days in staff mode after the 2024 IT attack. On the positive side: about 20 crisis meeting points and shelters for about 75% of residents. |
| `aiCapacity` | 0.12 | **0.12–0.15** | Nationally 0% of kommuner use AI pervasively, 25% in all parts to some extent and 40% in some parts. Kalmar (2024): only guidelines and feasibility work. 37% of the population use generative AI. |
| `aiGovernance` | 0.25 | **0.25–0.30** | Kalmar has only an administrative AI guideline (2023) and no political strategy; KF declined to order one in 2024. Region Kalmar has had a board-adopted guideline since 2025. The EU AI Act now applies, with high-risk rules from 2027-12-02, which could be modelled as a small external step-up in 2027–28. |
| `welfare` | 1 (index) | Keep **1** | The dependency ratio of 0.764 (national 0.770) can calibrate `dependency`, which currently only tracks the 65+ share. The 39,331 local jobs and 30.9% public-sector share are context. |
| `wellbeing` | computed (≈ 0.6) | Calibrate to about **0.58** | Tillväxtverket's wellbeing index is 57.7/100 (national 55.2). HLV good mental wellbeing is 83.2%. SOM life satisfaction is 92%. |
| `ghgCons` | 7.6 (Sweden) | **7.1** (estimate) or keep 7.6 | SEI shows Kalmar households at 0.93 of the national level (5.24 vs 5.64 t). The SEI household figure (5.2 t) can be shown as a sourced local value. |
| `trust` | 0.661 (HLV) | Keep | SOM's 57% high trust (national, 0–10 scale) is context only. |
| `participation` | 0.3 | Keep (not in scope) | Context: 52% volunteer, 34% belong to a sports club and 366 associations are registered in Kalmar. |
