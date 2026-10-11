# Energi och resor – energy and travel in Rättvik (deep research)

Compiled: 2026-10-11. Data files: `energi-resor.json` (38 indicators) and `energi-resor.en.json` (English names, units and notes for every id).

Scope: electricity and heat in Rättviks kommun, wind power and the grid, final energy use, cars and commuting, trains and buses from Rättvik, the two Dalarna airports, and road 70 and tourist travel.

The Kolada key figures that another tool fetches (N45906, N45930, N45926, N45970, N45979, N45950, N45904, N45952, N07945, U00501, N07713, U07917, N07418, U60496, N07806, N02277/N02278, N85073/N85533) are **not** repeated here. Every record here either adds a breakdown Kolada lacks (hydropower, total electricity use, district heating volumes, flows to named municipalities) or covers a different subject.

## Method

- **Primary sources first.** In order of preference:
  - SCB and Energimyndigheten (Kommunal och regional energistatistik, KRE);
  - Trafikverket;
  - Region Dalarna;
  - Transportstyrelsen;
  - Trafikanalys;
  - the operators' own timetables;
  - Rättviks kommun;
  - the companies (Adven, wpd, Aneo, Ellevio).
  - News outlets (SVT Dalarna, Dalademokraten, Siljan News) were used for debates and for the Mora air route.
- **PDFs** were read in memory with `pypdf`. One PDF (the 2018 joint consultation response on Dalabanan) was auto-cached by the web-fetch tool; that cache file was deleted at once and the PDF re-read in memory.
- **Caches** are all in `/private/tmp/rattvik_energi`: KRE query results, text extracts and the national GTFS timetable zip (63 MB).
- **Timetable figures** (trains per day, fastest trips) were computed from Samtrafiken's national GTFS feed. The feed is *GTFS Sverige 2*, feed_version 2026-10-10, read from the Mobility Database mirror of the Trafiklab dataset. I cross-checked them against the Tåg i Bergslagen and Dalatrafik PDF timetables, which agree.
- **Road traffic** came from Trafikverket's NVDB layers `ADT_total` and `ADT_tungtrafik`. I queried them through the open NetInfo WMS (GetFeatureInfo) at seven points along road 70 through Rättvik. The points were taken from the city's `osm.json`, which was only read.
- **Search budget.** The session's shared web-search budget ran out about two thirds of the way through. Later work used direct fetches of known URLs and open data APIs (SCB, Kolada, Trafikanalys, Trafikverket WMS) only.
- **Size of the job.** About 45 web searches, 60 fetches and API calls, and two GTFS passes.

### Sources

**Energy statistics**

- **SCB/Energimyndigheten, KRE 2024.** Published 2026-03-06.
  - Electricity generation: https://www.statistikdatabasen.scb.se/pxweb/sv/ssd/START__EN__EN0203__EN0203A/ProdbrEl/
  - District heating production: https://www.statistikdatabasen.scb.se/pxweb/sv/ssd/START__EN__EN0203__EN0203A/ProdbrFj/
  - Final use: https://www.statistikdatabasen.scb.se/pxweb/sv/ssd/START__EN__EN0203__EN0203A/SlutAnvSektor/
  - Queried through the PxWeb API (`api.scb.se/OV0104/v1/doris/sv/ssd/EN/EN0203/EN0203A/...`) for Rättvik (2031), Dalarna (20) and Sweden, 2009–2024.
- **User guide KRE 2024.** Covers the 2024 break in the series for transport, public and services oil, the småhus wood model and the scope (no vehicle gas, no aviation fuel, no separate EV charging). https://www.scb.se/contentassets/37ec814f01fc4f2ca64ab621d13203ec/anvandarhandledning-2024-version-1.0.pdf (pp. 14–15, 19, 23).
- **Naturvårdsverket, Utsläpp i siffror.**
  - SMA Mineral AB Rättvik Kalkverk: https://utslappisiffror.naturvardsverket.se/en/Search/Plant-page/?pid=1838
  - SMA Mineral AB Boda kalkverk: https://utslappisiffror.naturvardsverket.se/en/Search/Plant-page/?pid=1772

**District heating**

- Adven, *Adven & Rättvik*: https://adven.com/se/fjarrvarme/rattvik/
- Rättviks kommun, *Fjärrvärme*: https://www.rattvik.se/bygga-bo-och-miljo/energi-uppvarmning-och-transporter/fjarrvarme.html
- Dala Energi press releases on Värmevärden Siljan AB (2019–2020):
  - https://dalaenergi.se/pressmeddelande/varmevarden-siljan-ab-tar-over-fjarrvarmeverksamheterna-i-leksand-och-rattvik/
  - https://dalaenergi.se/pressmeddelande/dala-energi-och-rattvik-energi-gar-samman-och-letar-nya-delagare-for-att-utveckla-varmeverksamheten-i-dalarna/
- Dalademokraten, 16 Oct 2019: https://www.dalademokraten.se/artikel/ny-delagare-till-leksands-och-rattviks-fjarrvarme-kommunalradet-ser-en-battre-kundkontakt-pa-sikt/

**Wind**

- **Rättviks kommun**
  - *Vindbruksplan*, an addition to the comprehensive plan adopted by KF 2011-02-03 (Hedbodberget, Rättviksvind, bygdepeng, priority areas): https://www.rattvik.se/download/18.6793631719a04f687a0dbf66/1762352452002/Vindbruksplan.pdf
  - https://www.rattvik.se/bygga-bo-och-miljo/oversiktsplan-och-detaljplaner/oversiktsplan/vindkraft-i-rattviks-kommun.html
  - https://www.rattvik.se/bygga-bo-och-miljo/energi-uppvarmning-och-transporter/vindkraft.html
- **OX2 (O2)**
  - Hedbodberget project page: https://www.ox2.com/projects/hedbodberget
  - 2010 press release (9 + 6 Vestas V90 of 2 MW, 30 MW, bygdepeng to Dalfors/Orebygden): https://www.ox2.com/files/cision/1116928.pdf
- **wpd**
  - Project page Broboberget & Lannaberget: https://www.wpd.se/vara-projekt/broboberget-lannaberget/
  - Press release 16 Oct 2023: https://www.wpd.se/wpd-tar-nasta-viktiga-steg-for-att-bygga-15-twh-fornybar-elproduktion-i-dalarna/ and https://www.wpd.de/en/?p=2798
- **SVT Dalarna**
  - *Dalarnas största vindkraftsetablering…* (Dec 2021): https://www.svt.se/nyheter/lokalt/dalarna/dalarnas-storsta-vindkraftsetablering-med-upp-till-115-vindkraftverk
  - *Vindkraftsparken i Rättvik överklagas* (Jan 2022): https://www.svt.se/nyheter/lokalt/dalarna/vindkraftsparken-i-rattvik-overklagas-boende-otrevlig-manniskosyn
- **Aneo, Gundåsmoren**: https://www.aneo.com/en/projects/gundasmoren-wind-farm
- **Centerpartiet Rättvik** (26 Jan 2022), against Gundåsmoren: https://www.centerpartiet.se/centerpartiet-lokalt/dalarna/rattvik/nyheter/nyhetsarkiv/2022-01-26-centerpartiet-sager-nej-till-en-vindkraftspark-pa-gundasmoren
- **Newsworthy** (22 Apr 2025, Energimyndigheten data: 15 turbines, 30 MW, 13 years without new ones): https://www.newsworthy.se/artikel/321005/%C3%A4nnu-ett-%C3%A5r-utan-ny-vind-kraft-i-r%C3%A4ttvik
- **Siljan News** (1 Mar 2026), hydrogen pre-study in Furudal: https://www.siljannews.se/rattvik/vindkraft-kan-skapa-nya-mojligheter-i-regionen/

**Grid**

- Ellevio, *Preliminär nätutvecklingsplan 2025–2034* (submitted to Ei 20 Dec 2024; Dalarna pp. 4, 20, 31): https://www.ellevio.se/globalassets/content/natutvecklingsplaner/ellevio_prel_natutvecklingsplan_2025-2034.pdf
- Rättviks kommun, *Elnät*: https://www.rattvik.se/bygga-bo-och-miljo/energi-uppvarmning-och-transporter/elnat.html
- Rättviks kommun, *Årsredovisning 2025*, pp. 19–20 (Sambygd AB takes over Dala Energi's electricity and fibre networks): https://ess-app.rattvik.se/api/download/918ef6a6-3f83-48da-b06c-68eb8b77e9ac/b96a9b6b-0142-43a4-931c-7f44d02749bf

**Municipal plans and goals**

- *Hållbart Rättvik*: https://www.rattvik.se/kommun-och-politik/hallbart-rattvik.html
- *Arbetet med en energi- och klimatplan* (adoption planned for spring 2027): https://www.rattvik.se/kommun-och-politik/hallbart-rattvik/arbetet-med-en-energi--och-klimatplan.html
- *Furudal – ett grönt industrikluster* (Sweco pre-study, 2025): https://www.rattvik.se/kommun-och-politik/hallbart-rattvik/furudal-ett-gront-industrikluster---en-forstudie.html
- *Lokala ambitioner för ett Hållbart Rättvik*, pp. 19 and 31. It includes "fossilfritt transportsystem till år 2030" and Rättviksvind as a model. https://www.rattvik.se/download/18.8ea9806168b501487c822b2/1549447131739/Lokala%20ambitioner.pdf

**Travel, cars and commuting**

- **SCB**
  - AM0210F/ArRegPend2 (residence × workplace, 2024): https://www.statistikdatabasen.scb.se/pxweb/sv/ssd/START__AM__AM0210__AM0210F/ArRegPend2/
  - TK1001A/PersBilarA (cars in use, cars per 1,000): https://www.statistikdatabasen.scb.se/pxweb/sv/ssd/START__TK__TK1001__TK1001A/PersBilarA/
- **Kolada**
  - N00572: https://api.kolada.se/v3/data/kpi/N00572/municipality/2031/year/2025
  - Also N00573, N00574, N60404 and N07937/N07944, all checked through `api.kolada.se/v3`.
  - The municipality groups (`/v3/municipality_groups`) were used to confirm that Rättvik is in SKR's *Landsbygdskommun med besöksnäring*.
- **Trafikanalys**
  - RVU API t1101: https://api.trafa.se/api/data?query=t1101|ar:2024|hfardsatt|anthresar&lang=sv
  - *Resvanor i Sverige 2024*: https://www.trafa.se/globalassets/statistik/resvanor/2025/resvanor-i-sverige-2024.pdf
  - The API has no municipality-group breakdown after 2015–16.
- **Region Dalarna**
  - *Kollektivtrafikplan 2026 med utblick 2027–2028* (KTN 2025/134; market share p. 11, lines p. 23–24, demand-responsive pilot with Leksand and Rättvik p. 21): https://www.regiondalarna.se/contentassets/c8cf0dc398bf4ee298ce2f3e4c8fa144/kollektivtrafikplan-2026-med-utblick-2027---2028.pdf
  - *Kollektivtrafikrapport 2024* (KTN 2023/210; market share series p. 7, travel-time ratios p. 10): https://inte.regiondalarna.se/contentassets/c8cf0dc398bf4ee298ce2f3e4c8fa144/kollektivtrafikrapport-2024.pdf
  - *Utvecklingsplan för regional persontågtrafik i Dalarna 2025 med utblick mot 2050* (KTN2024/56). It covers commuting flows (pdf p. 22), the travel-time table (p. 26), departures and TiB cancellations (pp. 31–34), Dalabanan (pp. 36–37) and the regional goals: 89 min, Mora–Stockholm under 3 h, hourly service (pp. 40–43). https://www.regiondalarna.se/contentassets/c8cf0dc398bf4ee298ce2f3e4c8fa144/utvecklingsplan-for-regional-persontagtrafik-i-dalarna-2025-med-utblick-mot-2050.pdf

**Timetables**

- **Tåg i Bergslagen**
  - Timetable page: https://www.tagibergslagen.se/tidtabeller/
  - Line 50 PDF (valid 9 Aug–12 Dec 2026): https://tagibergslagen.se/app/uploads/tag-i-bergslagen-tidtabell-50-20260809-20261212-tg.pdf
- **Dalatrafik**, line 350 Mora–Rättvik–Falun (valid 17 Aug–12 Dec 2026): https://www.iphone.fskab.se/DAL/Landsbygdstrafik/260817_261212/Landsbygdstrafik_350_260817_261212.pdf
- **Samtrafiken/Trafiklab**, GTFS Sverige 2
  - Dataset page: https://www.trafiklab.se/api/gtfs-datasets/gtfs-sverige-2/
  - File: https://files.mobilitydatabase.org/mdb-2661/latest.zip
  - Stop ids:
    - Rättvik station 740000158
    - Mora 740000302
    - Leksand 740000019
    - Borlänge C 740000160
    - Falun C 740000030
    - Stockholm C 740000001
  - Days checked:
    - Weekdays: 2026-10-13, 2026-10-14, 2026-10-16, 2026-11-11, 2026-11-18, 2026-12-02, 2026-12-16 and 2027-01-07/08.
    - Weekends and holidays: 2026-10-17/18, 2026-12-19, 2026-12-26 and 2027-01-02.

**Rail infrastructure**

- **Trafikverket**
  - *Dalabanan Uppsala–Mora: kortare restid och fler turer* (updated 2 Jul 2025; 100 → 93 min, ~2 bn SEK to 2030, the name "Siljansbanan"): https://www.trafikverket.se/vara-projekt/alla-strak/kortare-restid-och-fler-turer-pa-dalabanan/
  - *Dalabanan Uppsala norra–Avesta Krylbo, förbättrad kapacitet* (track renewal Sala–Avesta Krylbo 10 Aug–4 Oct 2026): https://www.trafikverket.se/vara-projekt/projekt-som-stracker-sig-over-flera-lan/dalabanan-uppsala-norraavesta-krylbo-forbattrad-kapacitet/
- **Joint consultation response, 2018.** By Region Uppsala, Region Västmanland, Region Dalarna and Dalabanans intressenter. It calls the 89-minute goal "Akilleshälen". https://www.regeringen.se/contentassets/c8e97e99cac449e99dcc2e5c6f707ebf/region-dalarna---dalabanan-gemensam-syn.pdf
- **Moderaterna press release, 28 Apr 2026** (party source, used only for context: Uppsala–Borlänge 100 → 93 min in national plan 2026–2037; county plan 1,679 MSEK): https://moderaterna.se/app/uploads/2026/04/Historisk-satsning-i-Dalarna-–-for-exportindustrin-pendlaren-och-glesbygden-.pdf

**Air**

- **Transportstyrelsen**
  - *Flygtrafikstatistik 2025* (table 1, p. 3; movements p. 7): https://www.transportstyrelsen.se/globalassets/global/publikationer-och-rapporter/luftfart/flygtrafikstatistik-2025.pdf
  - Full-year 2019 report (Mora 2,838, Borlänge 21,421; no scheduled Arlanda flights since February 2018): https://www.transportstyrelsen.se/link/97152e12f6dd4ad3b23dc83af2a1501c.aspx
- **SVT Dalarna**, 12 Mar 2026, *Flyglinjen mellan Mora och Arlanda kan läggas ned*: https://www.svt.se/nyheter/lokalt/dalarna/flyglinjen-mellan-mora-och-arlanda-kan-laggas-ned
- **Riksdagen**, interpellation 2025/26:389 (withdrawn): https://www.riksdagen.se/sv/dokument-och-lagar/dokument/interpellation/flygforbindelsen-mora-arlanda_hd10389/
- **Mora kommun**, consultation response 2023-04-12 (Mora and Borlänge airports, PSO, preparedness): https://www.regeringen.se/contentassets/25de047b4eeb4f80af12c2a19974fbd7/mora-kommun.pdf

**Road and tourism**

- **Trafikverket NetInfo WMS**, layers `ADT_total`, `ADT_tungtrafik` and `ADT_axelpar`. Example query at the south entrance: https://geo-netinfo.trafikverket.se/MapService/wms.axd/NetInfo_1_8?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetFeatureInfo&LAYERS=ADT_total&QUERY_LAYERS=ADT_total&STYLES=&CRS=EPSG:4326&BBOX=60.87389,15.10506,60.87549,15.10826&WIDTH=101&HEIGHT=101&I=50&J=50&INFO_FORMAT=text/plain&FEATURE_COUNT=5&FORMAT=image/png
- **Trafikverket**, *Effektsamband: trafikvariation och fordonsandelar* (2026; monthly index p. 5): https://bransch.trafikverket.se/contentassets/6172806b6959485d895374173243047f/2026/effektsamband-trafikvariation-och-fordonsandelar.pdf
- **Ramboll for Tillväxtverket**, *Transportsystemet för turism* (p. 5, car share 91–92% in Dalarna): https://orta.regionorebrolan.se/contentassets/36ec90f4d52a47148f6241391e73b2d7/transportsystemet-for-turism---kunskapssammanstallning-och-framatblick.pdf
- **SVT Dalarna on Classic Car Week**
  - *Kommunalrådet efter bilveckan: blir väldigt polariserat* (updated 23 Sep 2026): https://www.svt.se/nyheter/lokalt/dalarna/kommunalradet-efter-bilveckan-blir-valdigt-polariserat
  - *Fridays for future vill stoppa cruisingen* (30 Jul 2019): https://www.svt.se/nyheter/lokalt/dalarna/fridays-for-future-vill-stoppa-cruisingen-pa-classic-car-week
  - *Delade meningar om klimattänk* (31 Jul 2019): https://www.svt.se/nyheter/lokalt/dalarna/delade-meningar-om-klimattank-vid-classic-car-week

**History (narrative only, not records)**

- Svenska Wikipedia, *Falun–Rättvik–Mora Järnväg*: https://sv.wikipedia.org/wiki/Falun–Rättvik–Mora_Järnväg (Grycksbo–Rättvik closed 1 Dec 1965, track lifted 1966–67).
- Svenska Wikipedia, *Siljansbanan* (redirects to Dalabanan): https://sv.wikipedia.org/wiki/Siljansbanan (Insjön–Rättvik 1914, Rättvik–Mora 1891, Borlänge–Mora electrified 1978, Rättvik at km 224).

### Derived numbers

All are marked `estimate` or `medium`, with the arithmetic in `note_sv`.

- **Local generation vs. use, 2024.** 104,671 / 139,830 MWh = 74.9%.
- **District heating in apartment blocks, 2024.** 16,232 / 19,164 MWh = 84.7%.
- **Industry's share of final use, 2023.** 285,935 / 598,329 MWh = 47.8%.
- **Fossil-free share outside industry, 2023.**
  - Fossil liquid, solid and gas fuels in agriculture and forestry, the public sector, transport, services, detached houses, apartment blocks and holiday homes total 101,582 MWh.
  - All energy in those sectors totals 312,395 MWh.
  - 1 − 101,582 / 312,395 = 67.5%.
- **Renewable share of transport energy, 2023.** (22,277 + 473) / 118,140 = 19.3%.
- **National car share of trips, 2024.** 2,052,673 / 3,872,529 = 53.0%.
- **Timetable counts and travel times.**
  - These were computed from GTFS for an ordinary weekday (Wednesday 11 November 2026) and checked against the operators' PDFs.
  - Fastest connection via Borlänge: SJ's Borlänge–Stockholm trips with at least 6 minutes to change.
  - Falun by train: at least 5 minutes to change.
- **July traffic on road 70.** Trafikverket's July index applied separately to light and heavy vehicles of the NVDB ÅDT.

### Caveats

- **KRE breaks in 2024.** The 2024 KRE introduced a new model for oil deliveries to transport, the public sector and services. Rättvik's transport energy jumps from 118 GWh (2023) to 260 GWh (2024) for that reason alone. Dalarna rises too.
- **KRE transport is sales-based.** The transport sector covers fuel delivered to filling stations in the municipality, including fuel sold to tourists and heavy traffic on road 70. It is not residents' driving, and charging electricity for EVs is not shown as transport.
- **Wood in detached houses is modelled.** It is scaled from the 2010 survey, so local changes in wood use do not show up.
- **District heating volumes disagree.** Adven's website says about 31 GWh a year and about 380 customers. SCB's delivered heat for the municipality is 47.5 GWh (2024). The gap may come from how the producer reports by municipality, which KRE's guide warns about, or from an out-of-date company page. I did not resolve it.
- **Wind farm scope.** Broboberget/Lannaberget straddles the border with Ovanåker. The records use scope "Rättviks kommun" because it is the closest allowed value, and the notes say so.
- **ÅDT dates.** The NVDB ÅDT values carry a validity date (2025-01-01 for the southern link, 2023-01-01 north of the centre) rather than a stated measurement year. The uncertainty is ±7% and ±12%.
- **One-day timetable snapshot.** Counts can change during the year. TiB had about 15% of departures cancelled in summer 2024 because of staff shortages; Region Dalarna says service has been "robust" since October 2024.

## Main findings

1. **Rättvik makes about three quarters of its electricity, almost all of it from one wind farm.**
   - The 15 Vestas V90 turbines on Hedbodberget (30 MW, 2009–2011) gave 82.5 GWh of the 104.7 GWh generated in 2024. Hydropower gave 16.1 GWh and solar 6.0 GWh.
   - Use is about 140 GWh. Holiday homes alone take 15 GWh (11%).
   - No new turbine has been built for 13 years.
   - The permitted Broboberget/Lannaberget project (wpd, up to 115 turbines and 740 MW of grid capacity, about 1.5 TWh a year, first grid stage 2027) would produce more than ten times the municipality's whole electricity use. Part of it lies in Ovanåker.
   - Aneo's Gundåsmoren (up to 25 turbines) reaches consultation in 2026; Centerpartiet said no in 2022.
2. **Heat is almost fossil-free; industry and transport are not.**
   - District heating from the bio-fired plant by Stiernhööksgymnasiet produces 56 GWh, with 0.8% fossil oil, and covers 85% of energy use in apartment blocks.
   - Industry used 48% of all final energy in 2023. The fossil oil and solid fuel shown for 2024 point to the lime kilns: SMA Mineral's Rättvik lime works reported 119,818 t of fossil CO2 in 2024.
   - Outside industry, energy use is about two-thirds fossil-free. Transport is only 19% renewable.
3. **The car dominates, and use of public transport is falling.**
   - Rättvik has 679 cars per 1,000 inhabitants (Dalarna 598, Sweden 475); counting private owners only, 500.
   - Public transport's share of motorised trips in Dalarna fell from 12% (2019) to 9% (2024) and a provisional 7% (2025). The 2035 target is 20%.
   - Only 36.5% of Rättvik residents think public transport works well for everyday trips (Sweden 68.8%).
   - 36% of employed residents work outside the municipality, mainly in Leksand (524), Falun (383), Mora (356) and Borlänge (173).
4. **The railway serves Leksand and Mora well but Stockholm and Falun poorly.**
   - On weekdays, 17 trains run each way (15 TiB and 2 SJ): Mora in 23–25 min, Leksand in 14–16 min, Borlänge in 46–52 min.
   - Only two direct trains a day go to Stockholm; the fastest takes 3 h 21 min (3 h 15 min northbound).
   - Falun, the county seat with the county hospital, is 54 minutes away by bus but at least 83 minutes by train via Borlänge. The Falun–Rättvik railway closed in 1965.
   - Trafikverket's works will cut Uppsala–Borlänge from 100 to 93 minutes by about 2030–31. The region's goals (89 minutes, Mora–Stockholm under 3 h) are not funded.
5. **Air travel is marginal, and the state may drop its support.**
   - Mora–Siljan had 3,807 passengers in 2025 (2,838 in 2019).
   - The state pays 22 MSEK a year for Sveg–Mora–Arlanda, about SEK 2,425 per passenger. Trafikverket (March 2026) wants to end the public service obligation after October 2027, because the train gets from Mora to Stockholm in under four hours.
   - Dala Airport in Borlänge had 15,820 passengers (21,421 in 2019).
6. **Tourists come by car.**
   - About 91–92% of domestic tourist trips to Dalarna are by car.
   - Road 70 carries about 8,700 vehicles a day south of the centre and 9,300 to the north. A July day is estimated at about 11,800 (range 9,750–15,900), before the Classic Car Week peak.

## What I could not find

- **Modal split for Rättvik or Dalarna.**
  - No municipal or regional travel survey was found; Region Dalarna's own plans say data on travel habits are lacking.
  - Trafikanalys's open API has no breakdown by municipality group for recent years. The 2024 report has the rural-municipality comparison only as a chart.
  - Only the national car share (53%), the county market share (9%) and the perception survey are in the file.
- **Renewable share of the municipality's total final energy.** Industry's fuel split is confidential in KRE (2023), so only the share outside industry was calculated.
- **Summer counts on road 70 and traffic during Classic Car Week.** The NVDB has annual averages only, and no Trafikverket count or report on summer traffic through Rättvik was found. The July figure is an estimate. For Classic Car Week numbers (about 10,000 cars, guest nights, the population peak) see `kommun-plats-historia.json`, `turism-ekonomi.json` and `samhalle-halsa.json`.
- **Visitors' arrival mode for Siljan or Rättvik specifically.** Only the county-level 91–92% (Tillväxtverket/SCB via Ramboll) was found.
- **Solar parks and energy communities.**
  - No named solar park in Rättvik was found before the search budget ran out. Installed solar (about 7 MW) is in Kolada and in `kommun-plats-historia.json`.
  - The current status and membership of *Rättviksvind*, the citizens' share scheme in a municipal turbine on Hedbodberget (2010), were not found.
- **Status of Broboberget/Lannaberget in 2026.** No investment decision, turbine order or construction start was found; the wpd project page still says "under development".
- **Names of the hydropower plants.** KRE gives 10–21 GWh a year, but the plants were not identified.
- **Current routes at Dala Airport.**
- **The source of the district heating gap** (Adven's 31 GWh against SCB's 47.5 GWh).
- **Night trains.** None stop in Rättvik in the timetable data up to January 2027. The only other passenger rail nearby is Inlandsbanan's summer tourist train northwards from Mora (Mora–Gällivare), which does not serve Rättvik.

## Overlap with other topic files

These ids already exist in other files in this folder; they were left out here to avoid duplicates.

- **`kolada.json`**
  - Electricity: `elproduktion_lokal`, `elproduktion_vindkraft`, `elproduktion_sol`, `elproduktion_kraftvarme`, `elanvandning_per_inv`.
  - Heat and installed capacity: `fjarrvarme_fornybar_andel`, `solceller_installerad_effekt`, `vindkraft_installerad_effekt`.
  - Commuting and cars: `inpendling_antal`, `utpendling_antal`, `korstracka_personbil_per_inv`, `fossiloberoende_personbilar_andel`, `elbilar_andel`.
  - Infrastructure: `laddpunkter_publika_antal`, `kollektivtrafiknara_lage`, `cykelvag_per_inv`.
  - Emissions: `vaxthusgaser_*`.
  - Cross-check against `vaxthusgaser_industri_per_inv` (13.8 t/inhabitant, 2024): the lime works' 119,818 t is about 10.9 t per inhabitant (119,818 / 10,978). This is my own arithmetic, consistent with one plant dominating industrial emissions.
- **`kommun-plats-historia.json`**
  - Energy and climate goals: `fossilfritt_transportsystem_mal`, `vindkraft_antal_verk`, `vindkraft_effekt`, `ny_solel_ansluten`, `vindkraftsstod`, `hvo_andel_fordon`.
  - Finance: `dala_energi_reavinst`.
  - Classic Car Week and the railway: `ccw_bilar`, `jarnvag_oppnad`, `stationshus_byggt`.
- **`turism-ekonomi.json`** and **`samhalle-halsa.json`**: guest nights, Classic Car Week guest nights and crime share, and the summer population peak (3× the median on the Saturday of Classic Car Week).

## För berättelsen

**Platser**

- **Rättviks station och resecentrum vid Siljan.** Stationen ligger vid km 224 på Dalabanan. Sträckan Borlänge–Leksand–Rättvik–Mora kallas Siljansbanan och är enkelspårig hela vägen. Här stannar 17 tåg per riktning en vardag, men bara två av dem går direkt till Stockholm. Bussen till Falun (linje 350) går från samma plats en gång i timmen.
- **Riksvägen (rv 70)** går genom tätorten och delar sig i centrum i två enkelriktade körfält. Söder om centrum passerar ca 8 700 fordon per dygn; en julidag uppskattningsvis 11 800 (egen beräkning) och mer under Classic Car Week.
- **Värmeverket vid Stiernhööksgymnasiet**, längs vägen mot Dalhalla, byggdes 1983. Det har två biobränslepannor och en oljepanna i reserv. Det ägs av Adven Siljan AB: Adven 51 %, Dala Energi och kommunen 24,5 % vardera. Nätet når centrum, Boda och Vikarbyn.
- **Hedbodberget**, ca 3,5 mil nordost om Rättvik öster om Furudal, har femton vindkraftverk (Vestas V90, 2 MW) från 2009–2011. Bygdepengen går till utveckling i Dalfors och Orebygden. Kommunen köpte två av de första verken; det ena såldes som andelar till invånarna i föreningen **Rättviksvind**, det andra ger el till kommunen och dess bolag (vindbruksplanen 2011).
- **Broboberget och Lannaberget**, ca 5 mil nordost om Rättvik nära Håven på gränsen mot Ovanåker. Här finns tillstånd för upp till 115 verk på 230 meter. Längre in i kommunen ligger **Gundåsmoren**, ca 3 km öster om Sunnanhed och ungefär en mil från Furudal.
- **Furudal och Orebygden.** Sweco gjorde 2025 en förstudie om att göra vätgas av vind- och vattenkraft och vatten ur Oreälven. Hindret är att ingen här behöver vätgasen och att järnvägen Furudal–Bollnäs inte har underhållits sedan 2015 (Siljan News).
- **SMA Minerals kalkverk.** Rättvik kalkverk släppte ut ca 120 000 ton fossil koldioxid 2024, och Boda kalkverk ligger också i kommunen. Kalkbränning frigör koldioxid ur själva stenen, så det räcker inte att byta bränsle; utsläppen kan bara tas bort med avskiljning.
- **Mora–Siljan flygplats.** I dag flyger den upphandlade linjen Sveg–Mora–Arlanda härifrån, och den kan läggas ned 2027.

**Historia**

- **Järnvägen.**
  - Den kom först från Falun med Falun–Rättvik–Mora Järnväg, och Rättvik–Mora öppnade 1891.
  - Spåret från Borlänge via Insjön och Leksand nådde Rättvik 1914.
  - Linjen Grycksbo–Rättvik lades ned 1 december 1965 och revs 1966–67. Därför tar tåget till Falun i dag dubbelt så lång tid som bussen.
  - Borlänge–Mora elektrifierades 1978.
- **Vindkraften.**
  - Rättvik var tidigt ute: Hedbodberget 2009–2011, en vindbruksplan 2011 med sex områden (Broboberget prio 1, Lannaberget prio 2, Gundåsmoren prio 3) och medborgarandelar i Rättviksvind.
  - wpd sökte tillstånd 2014. Det vann laga kraft först 2022, efter överklaganden från Naturskyddsföreningen och Skydda skogen som gällde kungsörn, havsörn, nordfladdermus och västlig taiga.
- **Flyget.** Mora–Siljan har saknat egen linjetrafik till Stockholm-Arlanda sedan februari 2018, och 2019 hade flygplatsen bara 2 838 resenärer. Trafikplikt infördes 2023. Den kan försvinna 2027 eftersom tåget från Mora till Stockholm tar under fyra timmar.

**Lokala debatter**

- **Vindkraften i norr.**
  - Kommunchefen Ulf Israelsson sa till SVT 2022: "Om det inte skulle gått att ha vindkraft här, så går det ingenstans."
  - Boende i Håven svarade: "Det är en otrevlig människosyn att tycka att det inte gör något att människor som bor i dessa kringliggande områden ska berövas oersättliga värden."
  - Centerpartiet i Rättvik sa nej till Gundåsmoren 2022, då med RWE som bolag och verk på upp till 300 meter. Partiet anser att Rättvik genom Hedbodberget och de godkända parkerna "har tagit en stor del av ansvaret för Sveriges elförsörjning".
  - Samtidigt har kommunen i sina lokala ambitioner som mål att "fortsätta arbetet med utökning av vindkraftsparker".
- **Classic Car Week** (sista veckan i juli).
  - Handlarna dubblar omsättningen, men enligt kommunalrådet Ulrica Momqvist (C) "blir [det] väldigt polariserat" (SVT 2026). Klagomålen gäller buller dygnet runt, fylla och brott.
  - 2019 ville Fridays for Future stoppa cruisingen, eftersom "kommunen har ett mål att man ska ha ett fossilfritt transportsystem 2030". Arrangören Roland Pettersson svarade: "Vi har inte de områdena i Rättvik."
  - En utlovad hållbarhetsutredning från Destination Rättvik var inte klar hösten 2026.
- **Kollektivtrafiken krymper på landsbygden.**
  - Stråklinjen 102 Rättvik–Borlänge lades ned i juni 2025.
  - Region Dalarna prövar behovsstyrd trafik tillsammans med Leksand och Rättvik.
  - Bara drygt en tredjedel av invånarna tycker att kollektivtrafiken fungerar för vardagsresor.
- **Elnätet har bytt ägare.** Dala Energis el- och fibernät fördes 2025 till Sambygd AB. Nordion Energi, som ägs av en fond med främst europeiska pensionsbolag, har 51 %, och kommunen köpte ca 10 % för pengar från inlösen av Dala Energi-aktier (reavinst 311 mnkr).

**Beslut framför oss**

- **Kommunens energi- och klimatplan** tas fram nu. Den ska kunna antas våren 2027 och sikta mot klimatneutralitet i linje med Sveriges mål för 2045.
- **Broboberget/Lannaberget.** Investeringsbeslut och turbinval återstår; Ellevios första nätetapp är planerad till 2027.
- **Gundåsmoren.** Samråd 2026, och därefter kommunens tillstyrkan, det så kallade vetot.
- **Hedbodberget** närmar sig 2030-talet. Verken från 2009–2011 når då en ålder då de brukar bytas eller förnyas – egen bedömning, ingen källa.
- **Mora–Arlanda-flyget.** Trafikplikten efter oktober 2027 avgörs i Trafikverkets upphandling.
- **Dalabanan.** 93 minuter Uppsala–Borlänge blir klart omkring 2030–31. Målen om 89 minuter och under tre timmar Mora–Stockholm kräver pengar i nästa nationella plan.
- **SMA Minerals kalkverk** måste avskilja koldioxiden om utsläppen ska ner.
- **Laddinfrastruktur.** Kommunen tar fram riktlinjer för laddinfrastruktur.

**Siffror som berättar**

- 3 timmar och 21 minuter till Stockholm, med två direkttåg per dag.
- 54 minuter till Falun med buss, men minst 83 minuter med tåg, sedan spåret revs 1966.
- 679 bilar per 1 000 invånare, mot 475 i riket.
- 75 % av elen görs i kommunen. Planerad vindkraft kan ge tio gånger kommunens hela elbehov.
- Fritidshusen använder var nionde kilowattimme el i kommunen.
- Nästan hälften av all energi går till industrin, och ett enda kalkverk släpper ut ca 120 000 ton koldioxid per år.
- Fjärrvärmen är 99 % förnybar och värmer 85 % av energin i flerbostadshusen.
- Bara 19 % av transporternas energi är förnybar.
- Mora–Siljan hade 3 807 resenärer 2025, och staten betalar ca 2 400 kr per resenär på linjen Sveg–Mora–Arlanda.
- 91–92 % av turisterna i Dalarna kommer med bil.

## Suggestions for the 2126 model

**Baseline, 2024–2026 values from this file**

- **Electricity:** use 140 GWh/year; local generation 105 GWh (wind 83, hydro 16, solar 6).
- **District heating:** production 56 GWh, delivered 47.5 GWh, 99% renewable.
- **Final energy:** about 600 GWh, of which industry 48%.
- **Transport energy:** 118 GWh, 81% fossil.
- **Cars:** 679 per 1,000 inhabitants.
- **Public transport share:** 9% of motorised trips (county).
- **Rail:** Stockholm in 201 min with 2 direct trains a day; 17 trains each way per weekday.
- **Bus:** Falun in 54 min.
- **Road 70:** ÅDT 8,700.

**Levers with sourced sizes**

- **Wind.**
  - Broboberget/Lannaberget: up to 740 MW, about 1,500 GWh a year, from about 2027 onward if built.
  - Repowering Hedbodberget (30 MW today) in the 2030s.
  - Gundåsmoren: up to 25 turbines, about 8 m/s at 150 m.
- **Grid.** Large new loads such as hydrogen in Furudal or data centres depend on Ellevio/Svenska kraftnät expansions (Tandö, a new 400 kV line Bäsna–Repbäcken). Ellevio forecasts +57% consumption capacity in Dalarna by 2034.
- **Rail.**
  - 93 minutes Uppsala–Borlänge (about −7 min) by about 2031.
  - 89 minutes (about −4 more) and Mora–Stockholm in 3 h if the region wins funding. Since Rättvik–Mora is 23–25 minutes by train, a 3-hour Mora–Stockholm would mean roughly 2 h 35 min Rättvik–Stockholm (derived).
  - More direct SJ or regional trips beyond today's 2.
- **Air.** If the PSO ends in 2027, Mora–Siljan's scheduled traffic (about 4,000 passengers a year) may disappear.
- **Industry.** The lime works' process CO2 (about 120 kt a year) can only be cut with carbon capture or by closing the works; it outweighs everything else in the municipality's emissions.
- **Transport fuel.** The renewable share was 19% in 2023 and falls in 2024 with the lower blending mandate. Electrification shows up as electricity in households and services, not in KRE's transport sector.
