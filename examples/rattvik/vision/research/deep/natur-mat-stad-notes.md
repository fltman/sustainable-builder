# Natur, mat och stad – Rättvik (deep research)

Compiled 2026-10-11. Companion to `natur-mat-stad.json` (40 indicators) and `natur-mat-stad.en.json`. Scope: Rättviks kommun (2031) and Rättvik tätort, with Dalarna for context. The topic covers land and food, fäbodar, forest, nature, the town's plans, heritage and the circular economy.

Kolada's standard key figures (N00403, N85054/N85056, N85084, N02993, N02937, U07801, U07414, U07514) were deliberately left out, because another tool fetches them.

The sibling file `kommun-plats-historia.json` already has records for several facts in this topic. To avoid double records, this file keeps them only in notes:

- Långbryggan's length, building year and named planks.
- Siljansringen's age and diameter.
- The Utsikten house plots, the target of 30 new homes per year and the Lerdalsberget reserve.
- The church stables, Vasastenen and Vidablick.

This file's records are the Siljan Geopark geosites, the reserve and Natura 2000 counts, and the Långbryggan quay repair cost.

## Method

### Machine-readable statistics

Each `source.url` in the JSON opens the table or the API query. All values were read through the PxWeb or REST APIs.

- **Jordbruksverket PxWeb** (`https://statistik.sjv.se/PXWeb/api/v1/sv/Jordbruksverkets%20statistikdatabas/`):
  - JO0104B2: arable land by crop, kommun, 1981–2025.
    https://statistik.sjv.se/PXWeb/pxweb/sv/Jordbruksverkets%20statistikdatabas/Jordbruksverkets%20statistikdatabas__Arealer__1%20Riket%20l%C3%A4n%20kommun/JO0104B2.px/
  - JO0104B7: pasture by kind, including **fäbodbete**, kommun, 2003–2025.
    https://statistik.sjv.se/PXWeb/pxweb/sv/Jordbruksverkets%20statistikdatabas/Jordbruksverkets%20statistikdatabas__Arealer__1%20Riket%20l%C3%A4n%20kommun/JO0104B7.px/
  - JO0104B6: pasture and number of businesses, by county.
    https://statistik.sjv.se/PXWeb/pxweb/sv/Jordbruksverkets%20statistikdatabas/Jordbruksverkets%20statistikdatabas__Arealer__1%20Riket%20l%C3%A4n%20kommun/JO0104B6.px/
  - JO0106F31: farms by size group, kommun.
    https://statistik.sjv.se/PXWeb/pxweb/sv/Jordbruksverkets%20statistikdatabas/Jordbruksverkets%20statistikdatabas__Jordbruksforetag__Jordbruksforetag%20och%20jordbruksforetagare/JO0106F31.px/
  - JO0103F05: animals and businesses with animals, kommun, 1981–2023.
    https://statistik.sjv.se/PXWeb/pxweb/sv/Jordbruksverkets%20statistikdatabas/Jordbruksverkets%20statistikdatabas__Lantbrukets%20djur__Lantbruksdjur%20i%20juni/JO0103F05.px/
- **SCB PxWeb** (`https://api.scb.se/OV0104/v1/doris/sv/ssd/START/MI/`):
  - MI0803 MarkanvN: land use 2010/2015/2020.
    https://www.statistikdatabasen.scb.se/pxweb/sv/ssd/START__MI__MI0803__MI0803A/MarkanvN/
  - MI0805 tätort tables for Rättvik (tätort code 2031TC106):
    - GYMarkTypToN: https://www.statistikdatabasen.scb.se/pxweb/sv/ssd/START__MI__MI0805__MI0805A/GYMarkTypToN/
    - GYHgMarkToN: https://www.statistikdatabasen.scb.se/pxweb/sv/ssd/START__MI__MI0805__MI0805A/GYHgMarkToN/
    - GYMaTackeToN: https://www.statistikdatabasen.scb.se/pxweb/sv/ssd/START__MI__MI0805__MI0805A/GYMaTackeToN/
    - GYMaTackeAllmToN: https://www.statistikdatabasen.scb.se/pxweb/sv/ssd/START__MI__MI0805__MI0805A/GYMaTackeAllmToN/
    - GrOmrBefToN: https://www.statistikdatabasen.scb.se/pxweb/sv/ssd/START__MI__MI0805__MI0805B/GrOmrBefToN/
    - GrOmrAntToN: https://www.statistikdatabasen.scb.se/pxweb/sv/ssd/START__MI__MI0805__MI0805D/GrOmrAntToN/
  - Kalmar comparison (40.4 % sealed), GYHgMarkTo37: https://www.statistikdatabasen.scb.se/pxweb/sv/ssd/START__MI__MI0805__MI0805A/GYHgMarkTo37/
- **Skogsstyrelsen PxWeb** (`https://pxweb.skogsstyrelsen.se/api/v1/sv/Skogsstyrelsens%20statistikdatabas/`; it needs a browser User-Agent):
  - PX11: private owners by place of residence.
    https://pxweb.skogsstyrelsen.se/pxweb/sv/Skogsstyrelsens%20statistikdatabas/Skogsstyrelsens%20statistikdatabas__Fastighets-%20och%20agarstruktur/PX11.px/
  - PX12: declared area, holdings and owners per kommun.
    https://pxweb.skogsstyrelsen.se/pxweb/sv/Skogsstyrelsens%20statistikdatabas/Skogsstyrelsens%20statistikdatabas__Fastighets-%20och%20agarstruktur/PX12.px/
  - Table 12: felling notifications per kommun.
    https://pxweb.skogsstyrelsen.se/pxweb/sv/Skogsstyrelsens%20statistikdatabas/Skogsstyrelsens%20statistikdatabas__Avverkningsanmalan/12_per_kommun.px/
  - 04_JO1402_Kommun: biotope protection areas and nature conservation agreements per kommun. Rättvik has 55 biotope protection areas (209 ha) and 38 nature conservation agreements (401 ha), accumulated 1993–2025; these are not used as records, to avoid overlap with Kolada's protected-nature KPIs.
    https://pxweb.skogsstyrelsen.se/pxweb/sv/Skogsstyrelsens%20statistikdatabas/Skogsstyrelsens%20statistikdatabas__Skogsstyrelsens%20formella%20skydd%20och%20ersattningar/04_JO1402_Kommun.px/
- **Naturvårdsverket**:
  - Naturvårdsregistret REST v3, all protected areas in force in kommun 2031: https://geodata.naturvardsverket.se/naturvardsregistret/rest/v3/omrade/nolinks?kommun=2031&beslutsstatus=G%C3%A4llande&limit=500
  - Per-area records, e.g. Lerdalsberget: https://geodata.naturvardsverket.se/naturvardsregistret/rest/v3/omrade/2201166/G%C3%A4llande
  - N2000 REST v3: https://geodata.naturvardsverket.se/n2000/rest/v3/omrade/nolinks?kommun=2031&limit=500
- **Havs- och vattenmyndigheten, bathing waters API**:
  - All bathing waters: https://gw.havochvatten.se/external-public/bathing-waters/v2/bathing-waters (Rättvik has 12).
  - Siljansbadet: https://gw.havochvatten.se/external-public/bathing-waters/v2/bathing-waters/SE0622031000002963
- **SBDI / Biodiversity Atlas Sweden (biocache)**, used for the red-list count:
  - Occurrence facet query: https://records.biodiversitydata.se/ws/occurrences/search?q=*:*&fq=species_list_uid:dr204&fq=cl10040:%22R%C3%A4ttvik%22&fq=year:%5B2000%20TO%20*%5D&pageSize=0&facets=species&flimit=-1
  - List metadata for "The Swedish Red List 2020" (dr204): https://lists.biodiversitydata.se/ws/speciesList/dr204
  - Spot checks: LC species such as tall, koltrast and vanlig padda are absent from dr204, while NT species such as tretåig hackspett and ullticka are present.

### Documents read as text in memory

PDFs were read in memory with pypdf. Page numbers are PDF pages unless stated.

- **Länsstyrelsen Dalarna, rapport 2025:05 "Livsmedelskedjan i Dalarnas län – lägesbeskrivning 2023"**:
  - PDF: https://www.lansstyrelsen.se/download/18.75dc539919618cb34bb3502d/1744876622642/Livsmedelskedjan%20i%20Dalarna%20l%C3%A4gesbeskrivning%202023.pdf
  - Publication page: https://www.lansstyrelsen.se/dalarna/om-oss/vara-tjanster/publikationer/2025/livsmedelskedjan-i-dalarnas-lan.html
  - Pages used: p. 8 (38 % by weight, 29 % by energy, 9 500 jobs), p. 34 (239 000 t consumed vs 90 000 t produced), p. 37 and p. 41 (0.19/0.20/0.38 ha per person), and p. 88–89 (the Rättvik section: 2 343 ha, 11 042 inhabitants, 440 jobs, the food businesses, and self-sufficiency of 50 % for beef, 70 % for lamb, 100 % for milk and one fifth for grain).
- **Länsstyrelsen Dalarna, rapport 2008:12 "Fäboddrift ur ett brukarperspektiv"**: https://catalog.lansstyrelsen.se/store/26/resource/2008_12
  - Pages used: p. 7, 15–16 and 34–35. They give the counts of fäbodar with animals (52 in 1994, 79 in 1998, 87 in 2007 and 93 in 2008), "85 fäbodställen, 100 brukare" in 2008, "ett tjugotal" traditional fäbodar, and the predator survey per kommun.
- **RAÄ, "Kartläggning av biologiskt kulturarv i fäbodmiljöer i Dalarna 2012"**: https://www.raa.se/app/uploads/2014/12/Kartla%CC%88ggning-av-biologiskt-kulturarv-i-fa%CC%88bodmiljo%CC%88er-i-Dalarna-2012.pdf (the URL needs NFD-encoded å/ä/ö).
  - Pages used: p. 8 (69 fäbodar in operation in 1998, 28 with unbroken operation) and p. 25 (Karl-Tövåsen: 14 nöt, 1 get, 4 får and 4 hästar, continuity "1663 Återuppt.").
- **RAÄ, "Riksintressen för kulturmiljövården – Dalarnas län (W)"** (updated 2023-01-12): https://www.raa.se/app/uploads/2023/09/Dalarna-W_riksintressen.doc.pdf
  - Pages used: p. 28–32. They list the 18 areas in Rättviks kommun with their motivations.
- **SGU-rapport 2010:21, Svedlund & Lundqvist, "Fynd av bergarter bildade vid meteoritnedslaget i Siljansområdet"**: https://resource.sgu.se/dokument/publikation/sgurapport/sgurapport201021rapport/s1021-rapport.pdf
  - Pages used: p. 4–5, for the age of 377 Ma, the crater estimates of 52/65/75 km, the 4 km meteorite and the ~65 km ring.
- **Rättviks kommun, Översiktsplan för Rättviks kommun 2030** (adopted by KF 2019-05-23):
  - Del 1: https://www.rattvik.se/download/18.6e7a1da16b8abf1f9b851be/1562077782234/Del1_Utmaningar_och_strategiska_fragor.pdf
    - p. 8: the population "kan delar av året växa till det tredubbla".
    - p. 20–21: the vision "Rättvik, där tradition möter framtid", adopted autumn 2017, and the strategic issues.
  - Del 2: https://www.rattvik.se/download/18.6e7a1da16b8abf1f9b851bf/1562077782379/Del2_Planeringsinriktningar.pdf
    - p. 15–16: housing, "drygt 250 småhus", 5–10 villas a year.
    - p. 26: Centrumgruppen.
    - p. 38–39: riksintressen.
    - p. 41: ten byggnadsminnen in 2019.
    - p. 50: strandskydd and the three utökat strandskydd sites.
    - p. 33: the new road Vidablick–Hantverksbyn.
    - p. 46: värdetrakter.
    - p. 52: the grönstrukturplan.
    - p. 59: farmland, "knappt tre procent".
  - Del 3 (implementation; consulted, not cited): https://www.rattvik.se/download/18.6e7a1da16b8abf1f9b851c0/1562077782884/Del3_Genomforande_och_konsekvensbeskrivning.pdf
  - Del 4 LIS: https://www.rattvik.se/download/18.6e7a1da16b8abf1f9b851c1/1562077783009/Del4_Landsbygdsutveckling_i_strandnara_lagen_LIS.pdf
    - p. 5: 24 studied areas, 20 designated.
    - LIS area texts, including "Siljan, Båthamnen".
- **Rättviks kommun, Planeringsstrategi** (KF 2024-06-13): https://rattvik.se/download/18.1c49b2381900c49dbaab38a1/1719217050392/Planeringsstrategi_Antagandehandling.pdf
  - It judges the ÖP still current and lists the missing documents: energiplan, dagvattenstrategi, grönstrukturplan, revised bostadsförsörjningsprogram and LIS.
  - Other content: the FÖP Rättvik–Vikarbyn, kulturmiljöpolicy 2023-09-28, gång- och cykelplan 2020-05-28 and 97 % broadband.
- **Rättviks kommun, "Kulturmiljöprogram för Rättviks kommun"** (antagandehandling 2026-02-10, adopted by KS 2026-03-17; 311 pages, prepared with WSP): https://ess-app.rattvik.se/api/download/237c45d1-ab3c-4bd4-a726-f84aade032da/ea9b630c-fcbd-4d51-8f16-e0c049ede008
  - Pages used: p. 18 (the list of byggnadsminnen), p. 26–32 (riksintressen), p. 55 ("Rättviks tätort – från tallhed till samhälle": station and tingsplats as the early core, municipalsamhälle in 1910), p. 98 (Vidablick: built 1897, inaugurated 1898, Hedsåsberget 252 m above Siljan), p. 144 (Sjurberg: the hotels Siljansborg and Persborg are gone and cabin villages from the 1960s–70s stand on their sites) and p. 278 (87 kyrkstallar, one of them tree-ring dated to 1492).
- **Rättviks kommunfullmäktige, protokoll 2026-05-07**: https://ess-app.rattvik.se/api/download/da14b8b6-429e-42c4-87b7-ffa49bcb17e6/b7a3faf2-941a-4a0b-8b06-84e1a4282bbe
  - § 22, Lerdalsbergets naturreservat: about 12 ha, the kommun's third reserve; trees 200–300 years old; land cost about 1.9 Mkr, half paid by Naturvårdsverket, about 340 tkr by the kommun's nature fund foundation and about 650 tkr by Naturskyddsföreningen i Rättvik.
  - § 23, Klockargården: exploateringsavtal for up to seven house plots at Kaplaskogen by Sjurbergsvägen, with Svenska kyrkan as developer and a vite of 5 Mkr.
- **Rättviks kommunfullmäktige, protokoll 2026-06-11**: https://ess-app.rattvik.se/api/download/584f7f70-e57e-4acf-b4dc-94484f8ef750/b7a3faf2-941a-4a0b-8b06-84e1a4282bbe
  - § 37, Detaljplan för Utsikten (Lerdal 10:49): adopted; about 47 house plots south of the slalom slope, which may be merged into small apartment buildings; a stormwater pond sized for a 100-year rain plus a 30 % climate factor; the building right cut by 20 %; 18 consultation and 19 review submissions.
  - § 36: purchase and development agreement.
- **Västerås stift, "Kulturhistorisk karakteristik Rättviks kyrka"** (2006): https://svenskakyrkan.se/default.aspx?id=2755959
  - Pages used: p. 1 (92 kyrkstallar, the oldest dated 1475), p. 7–8 (building history) and p. 10 (kyrkstallar protected under KML).
- **Länsstyrelsen Dalarna, "Läget på bostadsmarknaden i Dalarnas län 2026"**: https://www.lansstyrelsen.se/download/18.3802389e19eafc8ca304e168/1781608530783/L%C3%A4get%20p%C3%A5%20bostadsmarknaden%20i%20Dalarnas%20l%C3%A4n%202026.pdf
  - Pages used: p. 32 (2 980 fritidshus in Rättvik in 2025, 2 782 in 2015) and p. 26 (mean age 49.8, the highest in Dalarna).
- **Länsstyrelsen Dalarna, byggnadsminne descriptions** (2023):
  - Hvilan: https://www.lansstyrelsen.se/download/18.50660e2018c3de6815f1d444/1773818173317/R%C3%A4ttvik%20Hvilans%20socitetspaviljong.pdf
  - Solgården: https://www.lansstyrelsen.se/download/18.2899965518c8af810323f21e/1773818173921/R%C3%A4ttvik%20Solg%C3%A5rden.pdf
  - Tånggården: https://www.lansstyrelsen.se/download/18.2899965518c8af810323f21f/1773818174199/R%C3%A4ttvik%20T%C3%A5ngg%C3%A5rden.pdf
  - Danielsgården: https://www.lansstyrelsen.se/download/18.2e63c2ef18a8d31f0f13e64b/1773818173206/R%C3%A4ttvik%20Danielsg%C3%A5rden.pdf
  - Matsgården: https://www.lansstyrelsen.se/download/18.50660e2018c3de6815f1d445/1773818173617/R%C3%A4ttvik%20Matsg%C3%A5rden.pdf
- Hyresgästföreningen Siljansbygden, Bostadspolitiskt program 2022 (consulted, no figures used): https://www.hyresgastforeningen.se/globalassets/bilder/regionernas-bilder/region-mitt/pdf/rattvik-bopol.pdf

### Web pages

- **Rättviks kommun**:
  - Planning:
    - Pågående detaljplanering (prioritisation decided 2026-04-15 § 30; page updated 2026-07-14): https://www.rattvik.se/bygga-bo-och-miljo/oversiktsplan-och-detaljplaner/pagaende-detaljplanering.html
    - Detaljplaner på samråd/granskning (none open on 2026-09-22): https://www.rattvik.se/bygga-bo-och-miljo/oversiktsplan-och-detaljplaner/detaljplaner-pa-samrad-granskning-eller-infor-antagande.html
    - Översiktsplan: https://www.rattvik.se/bygga-bo-och-miljo/oversiktsplan-och-detaljplaner/oversiktsplan.html and https://www.rattvik.se/bygga-bo-och-miljo/oversiktsplan-och-detaljplaner/oversiktsplan/oversiktsplan-for-rattviks-kommun-2030.html
    - Kulturmiljö (18 riksintressen, 55 kommunala intressen, kulturmiljöprogram adopted by KS 2026-03-17): https://www.rattvik.se/bygga-bo-och-miljo/bygga-nytt-andra-eller-riva/kulturmiljo.html
    - Strandskydd: https://www.rattvik.se/bygga-bo-och-miljo/bygga-nytt-andra-eller-riva/strandskydd.html
    - Avfall och återvinning (Kretsloppsplan adopted 2024-02-22; Ta Till Vara): https://www.rattvik.se/bygga-bo-och-miljo/avfall-och-atervinning.html
    - Bostäder och boendemiljö: https://www.rattvik.se/bygga-bo-och-miljo/bostader-och-boendemiljo.html
    - Lediga tomter: https://www.rattvik.se/bygga-bo-och-miljo/bostader-och-boendemiljo/lediga-tomter.html
  - Sights:
    - Långbryggan: https://www.rattvik.se/uppleva-och-gora/sevardheter/langbryggan.html
    - Vasastenen: https://www.rattvik.se/uppleva-och-gora/sevardheter/vasastenen.html
    - Rättviks kyrka (87 stallar per the kommun, oldest from the 1470s): https://www.rattvik.se/uppleva-och-gora/sevardheter/rattviks-kyrka.html
    - Persborgs brygga: https://www.rattvik.se/uppleva-och-gora/sevardheter/persborgs-brygga.html
    - Lokstallarna: https://www.rattvik.se/uppleva-och-gora/sevardheter/lokstallarna.html
  - Culture and nature:
    - Kulturarv (UNESCO fäbodkultur, 7 hembygdsgårdar, Blånnesladu 1294, Lisskog/Karl-Töfåsen, Ärteråsen): https://www.rattvik.se/uppleva-och-gora/kultur/kulturarv.html
    - Siljan Geopark (12 geosites in Rättvik): https://www.rattvik.se/uppleva-och-gora/rattvik-outdoor/siljan-geopark.html
    - Värdefull natur (lists 27 reserves, outdated): https://www.rattvik.se/uppleva-och-gora/turism-att-besoka-rattvik/vardefull-natur.html
  - News:
    - Lokstallarna återinvigda 2025-06-04: https://www.rattvik.se/nyheter/nyheter/2025-06-04-lokstallarna-i-rattvik-har-aterinvigts---nytt-liv-i-historisk-byggnad.html
    - VIA-huset and Ta Till Vara-butiken 2025-10-29: https://www.rattvik.se/nyheter/nyheter/2025-10-29-invigning-av-via-huset-och-ta-till-vara-butiken---en-satsning-pa-hallbarhet-samverkan-och-framtidstro.html
    - Rullis 2026-10-09: https://www.rattvik.se/nyheter/nyheter/2026-10-09-atervinningsbilen-rullis-kommer-till-rattviks-kommun-tisdag-13-oktober.html
- **Länsstyrelsen Dalarna**:
  - Byggnadsminnen (12 in Rättvik): https://www.lansstyrelsen.se/dalarna/samhalle/kulturmiljo/byggnadsminnen.html
  - Siljan Geopark: https://www.lansstyrelsen.se/dalarna/besoksmal/siljan-geopark.html
  - Fäbodkulturen – ett immateriellt kulturarv: https://www.lansstyrelsen.se/dalarna/besoksmal/fabodkulturen---ett-immateriellt-kulturarv.html
  - Fäbodveckan: https://www.lansstyrelsen.se/dalarna/natur-och-landsbygd/information-till-verksamma-pa-landsbygden/fabodveckan.html
  - News 2025-06-27, Fäbodveckan: https://www.lansstyrelsen.se/dalarna/om-oss/nyheter-och-press/aktuella-nyheter/nyheter---dalarna/2025-06-27-under-fabodveckan-visar-gammal-kunskap-vagen-framat.html
  - News 2026-06-17, lokal mat (+30 % sales, 44 shops): https://www.lansstyrelsen.se/dalarna/om-oss/nyheter-och-press/aktuella-nyheter/nyheter---dalarna/2026-06-17-okad-efterfragan-pa-lokal-mat-fran-dalarna.html
- **Dala Vatten och Avfall**:
  - Kretsloppsplan 2023–2030 targets: https://www.dalavattenavfall.se/avfall-och-atervinning/avfallsplan-foreskrifter-och-kretsloppsplan.html
  - Drafsån ÅVC: https://www.dalavattenavfall.se/avfall-och-atervinning/atervinningscentraler/drafsan-avc-rattvik.html
- **Regeringen**, fäbodbruk inscribed by UNESCO 2024-12-03 (press release 2024-12-04): https://regeringen.se/pressmeddelanden/2024/12/fabodbruk--en-del-av-mansklighetens-immateriella-kulturarv/
- **Visit Dalarna** (Mynewsdesk), Siljan Geopark status extended (2025-11-27): https://visit-dalarna-ab.mynewsdesk.com/pressreleases/siljan-geopark-tar-naesta-steg-nationell-status-saekrad-i-ytterligare-fem-aar-3418603
- **SVT**:
  - Självförsörjningsgraden i Dalarna minskar (2023-04-03; 42 % in the 2022 report): https://www.svt.se/nyheter/lokalt/dalarna/sjalvforsorjningsgraden-i-dalarna-minskar-sa-vill-lansstyrelsen-vanda-trenden
  - Siljans Chark, vite 800 000 kr (2024-07-26): https://www.svt.se/nyheter/lokalt/dalarna/siljans-chark-kan-fa-betala-800-000-kronor-i-vite-grisar-vaknar-fortfarande-under-slakt
- **Siljan News**:
  - Persborg (2026-05-25): https://www.siljannews.se/rattvik/studenter-gav-inspiration-till-nytt-bostadsomrade-vid-persborg/
  - Ugglan, 28 hyresrätter (2025-05-28): https://www.siljannews.se/samhallsutveckling/det-kryllar-inte-av-hyresratter-i-rattvik-vi-tror-stenhart-pa-den-marknaden/
  - Kajen på Långbryggan (2020-04-06): https://www.siljannews.se/rattvik/nu-repareras-kajen-pa-langbryggan/
  - Piren uppsliten (2020-01-06): https://www.siljannews.se/rattvik/piren-pa-langbryggan-ar-i-uppslitet-tillstand/
  - Lokstallarna 7.5 Mkr (2025-02-03): https://www.siljannews.se/rattvik/mat-och-hantverk-nar-lokstallarna-slar-upp-portarna/
  - Lokstallarna (2020-08-28): https://www.siljannews.se/rattvik/vad-hander-med-lokstallarna/
  - Badramp Helsingland (2021-04-16): https://www.siljannews.se/rattvik/det-det-ar-ju-en-mansklig-rattighet-att-kunna-bada/
  - Solar Egg (2019-06-06): https://www.siljannews.se/rattvik/det-har-ar-en-idealisk-plats-for-bastubad-i-ett-guldagg/
- **Dala-Demokraten**:
  - Långbryggan quay (2020-05-31): https://www.dalademokraten.se/artikel/langbryggan-blev-ett-storre-jobb-an-vantat-hela-kajen-var-trasig-och-det-var-bara-att-borja-om
  - Brand och reparation (2016-03-25): https://www.dalademokraten.se/artikel/efterlangtad-reparation-pa-rattvikarnas-egen-brygga
  - Sjöbodsprojektet i Rättvik (story page, 2018–2023): https://www.dalademokraten.se/story/b05dfaab-a889-4f98-95ab-a278bdf507c2
  - Vidablick (2018-07-14): https://www.dalademokraten.se/rattvik/vandrares-vila-lade-grunden-for-utsiktstorn/
  - Karl-Tövåsen (2025-07-23): https://www.dalademokraten.se/2025-07-23/tin-och-det-nya-kulturarvet-det-som-hander-har-ar-det-viktiga/
- **Svenska Träskyddsföreningen**, Långbryggan nominated for Träskyddspriset 2022 (client: Rättviks kommun; NTR-certified pine): https://traskydd.com/2022/08/langbryggan-i-rattvik-rattviks-kommun/
- **First Camp**, Siljansbadet camping: https://en.firstcamp.se/destinations/siljansbadet-rattvik
- **Vidablick**:
  - Dalarnas museum/DigitaltMuseum (inaugurated 12 June 1898): https://digitaltmuseum.se/0210114186352/flygfoto-utsiktstornet-vidablick-rattvik-1947-1949-den-12-juni-1898-invigdes
  - sv.wikipedia (28 m, Hedsåsberget 352 m a.s.l.; secondary source): https://sv.wikipedia.org/wiki/Vidablick
- **OpenStreetMap** (the project's own `cities/rattvik/osm.json`, © OpenStreetMap contributors, ODbL), for the coordinates in "För berättelsen".

### Own calculations

| Record | Arithmetic |
|---|---|
| vall_andel_akermark | 1 910 / 2 368 = 80.7 %. With green fodder: (1 910 + 135) / 2 368 = 86.4 %. In 1981: 1 480 / 2 666 = 55.5 %. |
| spannmal_hektar (note) | 1981 cereals: korn 756 + havre 152 + blandsäd 21 + råg 6 + höstvete 6 = 941 ha (vårvete suppressed, so "minst"). 2025: 229 / 2 368 = 9.7 %. |
| fabodbete_hektar (note) | 608 / 971 = 62.6 %; 608 / 5 224 = 11.6 %; 608 / 15 703 = 3.9 %. |
| jordbruksforetag_antal (note) | Size groups above 2 ha. 1981: 79 + 62 + 34 + 17 + 13 + 3 + 2 = 210. 2025: 21 + 34 + 21 + 9 + 7 + 7 + 4 = 103. |
| notkreatur_antal | 2023: 437 + 255 + 591 + 410 = 1 693. 1981: 909 + 10 + 494 + 562 = 1 975. 2010: 456 + 239 + 602 + 562 = 1 859. 2020: 451 + 276 + 488 + 398 = 1 613. |
| livsmedelsforadlare_antal | 1 + 1 + 5 + 2 + 1 + 3 = 13 businesses. |
| skogsmark / jordbruksmark / bebyggd andel | 172 707 / 193 047 = 89.5 %; 3 260 / 193 047 = 1.7 %; 4 462 / 193 047 = 2.3 %. Water: 21 942 / (193 047 + 21 942) = 10.2 %. |
| skog_privatpersoner_andel | 51 / 157 (thousand ha) = 32.5 %. Both inputs are rounded, so the true range is about 32–33 %. |
| foryngringsavverkning (note) | 2021–25: (1 509 + 1 291 + 1 181 + 1 630 + 1 416) / 5 = 1 405 ha/yr. 2010–14: (2 606 + 2 199 + 1 507 + 1 936 + 1 902) / 5 = 2 030 ha/yr. 1 405 / 157 660 = 0.9 %/yr. |
| gronyta / hardgjord / skog tätort | 854 / 1 242 = 68.8 %; 272 / 1 242 = 21.9 %; 364 / 1 242 = 29.3 %; 499 / 1 242 = 40.2 % publicly accessible. |
| naturreservat (note) | Sum of `areaHa` over the 29 Naturreservat = 3 724.0 ha (land 3 610.6 ha). Ten have an original decision date from 2015 onwards. |
| natura2000 (note) | Sum of `areaHa` = 2 599.4 ha; without Voxnan = 1 687.9 ha. |
| rodlistade_arter | Number of distinct `species` facet values, excluding "Not supplied". 2000–2026: 556; all years: 729; 2010–2026: 511; all of Dalarna, all years: about 1 680. |

### Process notes

- The session's shared web-search budget ran out midway. After that, only direct fetches of known URLs and site navigation were used, so a few leads were left open (see the gaps section).
- All PDFs were read in memory. Two PDFs were auto-saved by the fetch tool to its tool-result folder, and one was briefly written to `/private/tmp` by curl; all three were deleted at once. No PDF or image remains on disk.

## Findings in brief

1. **Food and land.**
   - Arable land is 2 368 ha, 81 % of it ley; cereals fell from at least 941 ha (1981) to 229 ha. There are 971 ha of pasture, of which 608 ha is fäbod forest grazing.
   - There are 112 farms. 437 dairy cows are kept on only five farms, yet milk covers local consumption; beef covers 50 % and lamb 70 %.
   - Dalarna is 38 % self-sufficient by weight and 29 % by energy (Sweden 75 % by weight).
   - The food chain employs about 440 people in Rättvik. There are 13 processors, the largest being Nya Siljans Chark's slaughterhouse (25 staff) and Rättviks glass (11).
2. **Fäbodar.**
   - Dalarna has 84 businesses with fäbodbete (2025) and Sweden 205. In 2008 the County Administrative Board counted 85 active fäbodställen in Dalarna, of which only about twenty were traditional.
   - In Rättvik, Karl-Tövåsen (Vikarbyn) and Lisskog have the longest unbroken use; Ärteråsen (Näset/Furudal) is the showpiece.
   - The products are butter, cheese and messmör.
   - Fäbodbruk was inscribed on UNESCO's intangible heritage list on 3 December 2024.
3. **Land use and forest.**
   - Forest is 89.5 % of the land, farmland 1.7 % and built-up land 2.3 %.
   - Private individuals own about a third of the productive forest. There are 2 291 such owners, of whom 679 live outside Dalarna.
   - About 1 400 ha a year is notified for clear-felling, against 2 030 ha a year in 2010–14.
4. **Nature.**
   - There are 29 nature reserves (3 724 ha), the newest being Lerdalsberget (May 2026), and 15 Natura 2000 sites.
   - 556 red-listed species have been recorded since 2000 (own calculation).
   - The Siljan Ring impact is 377 Ma old. The geopark has had national status since 2019, renewed in November 2025, and the kommun lists 12 geosites in Rättvik, among them Långbryggan, Vidablick, Enån, Amtjärnsbrottet, Styggforsen and Dalhalla.
   - The tätort is 69 % green and 22 % sealed, and 84 % of residents live within 200 m of a green area.
   - Siljansbadet is a 1.2 km EU bathing water with "Bra" quality in 2025 and "Utmärkt" in 2023–24.
5. **The town's plans.**
   - The ÖP was adopted in 2019; the 2024 planning strategy judges it current. The FÖP Rättvik–Vikarbyn is queued.
   - Seven detaljplaner are active, four of them for housing (Klockargården, Utsikten, Persborg and Siljansborg).
   - Utsikten, with about 47 plots, was adopted by the municipal council on 2026-06-11, and Klockargården, with up to 7 plots, got its development agreement on 2026-05-07.
   - There were 250 zoned plots for detached houses in 2019; about 100 homes are planned at Persborg, and 28 rental flats at Ugglan (Sakofall Fastigheter) were due for move-in in summer 2026.
   - There are 20 LIS areas, five on Siljan.
   - No adopted centre plan exists. Planned or ongoing items are "Vackert Rättvik 2.0" (queued), a never-started plan for the area between the railway and riksväg 70, and Lokstallarna (7.5 Mkr, reopened in 2025).
6. **Heritage.** There are 12 byggnadsminnen, 18 riksintressen (five of them fäbod environments) and 55 municipal heritage areas, and a kulturmiljöprogram was adopted in 2026. Kyrkudden has 87 church stables, one of them tree-ring dated to 1492 according to the kulturmiljöprogram; the stift's 2006 assessment gave 92 stables and 1475. Vasastenen dates from 1893.
7. **Circular economy.**
   - The Kretsloppsplan 2023–2030 (Rättvik 2024-02-22) aims for 25 % less waste and 50 % less incineration by 2030.
   - There are two recycling centres (Drafsån with 24/7 "Anytime", and Furudal), plus the Rullis mobile collection.
   - The Ta Till Vara reuse shop opened at Riksvägen 23 in October 2025, fed by a staffed reuse container at Drafsån.

## Not found or uncertain (gaps)

- **Active fäbodar per kommun.** No current count for Rättviks kommun was found; Jordbruksverket publishes fäbod businesses only per county. In the 2008 survey, 8 fäbodbrukare in Rättvik answered. No production volumes for fäbod dairy products exist.
- **Official red-listed species count per kommun.** None was found, so the count was computed from SBDI (Rödlistan 2020). Rödlistan 2025 is not yet in SBDI, and survey effort biases the count.
- **Tree canopy cover for Rättvik tätort.** None exists. SCB's "skog" within green space is used as a proxy, which probably underestimates canopy.
- **Långbryggan costs.** No cost for the 1992 rebuild was found, and no current renovation budget. The only figure is about 0.5 Mkr for the outer quay in 2020.
- **Bostadsförsörjningsprogram.** The 2020 programme was not found online, and Siljansborg has no published home numbers. Utsikten (about 47 plots) and Klockargården (up to 7) were confirmed in the council minutes.
- **Centre plan.** No centrumplan or gestaltningsprogram exists, and the content of "Vackert Rättvik 2.0" is unknown.
- **Sjöbodsprojektet.** Its status after January 2023 is unknown; the DT/DD articles are paywalled.
- **Camping and Vidablick.** No information was found on who owns the land under Siljansbadets Camping, on the terms with First Camp, or on when First Camp took over. The owner and operator of Vidablick were not verified, and its tower height (28 m) comes only from Wikipedia.
- **Siljan Geopark and UNESCO.** No evidence of a UNESCO Global Geopark application was found; the November 2025 press release mentions only the national status.
- **Large forest owners.** Company and state ownership per kommun was not found; Skogsstyrelsen publishes owner class only per county.
- **Strandskydd.** No area statistics were found, and it was not checked whether Länsstyrelsen has revised the utökat strandskydd since 2019.
- **Gärdebygården.** It is listed in the brief as a hembygdsgård, but no source confirms that. Rättvik's hembygdsgård is **Gammelgården** (Sjurbergsvägen 3), and booking sites list Gärdebygården as accommodation (unverified). The kommun says there are seven hembygdsgårdar in total.
- **Church-stable counts.** The stift's 2006 inventory gives 92 stables and 1475; the kulturmiljöprogram (2026) and the kommun's web page give 87, and the programme dates the oldest to 1492. The 2026 figures are used.
- **Kommun site out of date.** The kommun web page "Värdefull natur" lists 27 reserves; the 29 in Naturvårdsregistret are authoritative.

## För berättelsen

### Platser (koordinater från OpenStreetMap, WGS84)

- **Långbryggan**:
  - Bryggans mitt ligger vid 60.8832, 15.1098 och ytterkajen, där M/S Gustaf Wasa lägger till, vid 60.8812, 15.1038.
  - Bryggan utgår från Siljansbadet vid Långbryggevägen.
- **Siljansbadet**:
  - Badet ligger vid 60.8873, 15.1087 och EU-badets provpunkt vid 60.8855, 15.1108.
  - Stranden är 1,2 km lång och går från Helsingland i söder till Kyrkudden i norr.
  - Tallarna är rester av den tallhed som en gång täckte centrala Rättvik.
  - Badsäsongen 2026 var 21 juni–15 augusti.
- **Siljansbadets Camping** (First Camp): Långbryggevägen 4 (60.8880, 15.1085). Restaurang Sjövillan ligger på Långbryggevägen 20.
- **Helsinglands badplats**: en udde som bara nås till fots (60.8825, 15.1161). Medborgarförslaget om en badramp 2021 beviljades på 15 minuter (75 000 kr).
- **Rättviks station och resecentrum**: 60.8850, 15.1158. Lokstallarna ligger intill stationen, och vid resecentrum hyr kommunen ut pendlarparkeringar.
- **Torget och Storgatan**:
  - Torget ligger vid 60.8854, 15.1172 och Storgatan, en gångfartsgata, vid 60.8830, 15.1195.
  - Hemslöjdsstugan med Dräktkammaren ligger vid torget, och kommunhuset på Vasagatan 1.
- **Kyrkudden**:
  - Rättviks kyrka ligger vid 60.8909, 15.0965, Vasastenen vid 60.8893, 15.0983 och Stiftsgården på Kyrkvägen 2.
  - Kyrkbåtarna lägger till nedanför kyrkan.
- **Gammelgården** (hembygdsgård och museum): Sjurbergsvägen 3 (60.8947, 15.0933).
- **Sjurberg**: Solgården, Tånggården och Persborg (brygga och planerat bostadsområde) ligger nordväst om Kyrkudden.
- **Enån**:
  - Ån rinner söder om centrum (ca 60.8823, 15.1239) och bildar en naturreservatsravin som är 20 m djup och 250 m bred.
  - Ravinen ligger i ett isälvsdelta som är omkring 9 000 år gammalt.
  - Hvilans paviljong ligger i Lerdal (gatan Hvilan, ca 60.8808, 15.1229).
- **Lerdalshöjden** (hotell och slalombacke): 60.8782, 15.1260. Intill ligger det nya Lerdalsbergets naturreservat på bergets högsta topp, som nås via leden Tre Toppar.
  - Reservatet beslutades av kommunfullmäktige 7 maj 2026 och har tallar på 200–300 år.
  - Marken kostade cirka 1,9 Mkr. Naturvårdsverket betalade hälften, och resten kom från kommunens naturvårdsfond och Naturskyddsföreningen i Rättvik.
  - Söder om slalombacken ligger Utsikten, med cirka 47 nya småhustomter enligt planen som antogs 11 juni 2026.
- **VIA-huset och Ta Till Vara**: Riksvägen 23, nära resecentrum.
- **Drafsåns ÅVC**: vid motocrossbanan.
- **Glistjärn** (Natura 2000, kommunens främsta fågelsjö): ca 60.934, 15.099, nära kalkbruket i Kullsberg/Glistjärna.
- **Vidablick**: på Hedsåsberget söder om tätorten, med utsikt över Siljan och Långbryggan.

### Historia

- **Kyrkudden (riksintresse W 89)**:
  - Kyrkan har anor från 1200-talet; den första gråstenskyrkan uppfördes sannolikt under senare delen av seklet. Brädor i taket är dendrodaterade till 1360-talet.
  - Tornet byggdes 1771–1783 efter Carl Fredrik Adelcrantz ritningar, och dagens exteriör är från 1793.
  - Tornet har Dalarnas äldsta klocktrio, från 1593, 1622 och 1628.
  - Udden har en tiondebod från 1758 och 87 timrade, omålade kyrkstallar. Ett av dem är dendrodaterat till 1492 enligt kulturmiljöprogrammet 2026; stiftets karakteristik 2006 angav 92 stallar, det äldsta från 1475.
  - Vasastenen restes 1893 till minne av Gustav Vasas tal till dalkarlarna på kyrkvallen 1520. Tolv mindre stenar står runt den som i en domarring.
- **Från tallhed till samhälle**:
  - Rättviks samhälle växte fram kring sekelskiftet nedanför Lerdals by vid Enåns delta och tallheden.
  - Järnvägsstationen och tingsplatsen var den tidiga kärnan, och 1910 blev Rättvik municipalsamhälle (kulturmiljöprogrammet 2026).
- **Turismen**: När järnvägen nådde Rättvik 1890 växte Sjurberg fram med ett 20-tal dalaromantiska villor och två hotell. Emma Sparre byggde Solgården 1897, där Selma Lagerlöf och Anders Zorn var gäster, och Tånggården (påbörjad 1895) blev arkitekten I. G. Clasons sommarhem 1908. Turisthotellen Siljansborg och Persborg är rivna, och på deras tomter står stugbyar från 1960- och 1970-talen. Kommunens pågående bostadsplaner bär namnen Persborg och Siljansborg.
  - **Kuranstalten Hvilan** fanns i Lerdal 1848–1858. Paviljongen från 1840-talet är byggnadsminne sedan 1988.
- **Långbryggan**:
  - Bryggan byggdes 1895 för ångaren S/S Rättvik och förföll på 1980-talet. Föreningen Rättviks Långbrygga bildades 1989.
  - Den nyinvigdes 6 juni 1992, och 2 938 plankor bär köparnas namn.
  - En brand i december 2015 förstörde vindskyddet längst ut, och en storm i januari 2020 slet upp kajen.
  - 2019 stod Bigert & Bergströms guldägg Solar Egg, en bastu, på bryggan.
- **Vidablick** byggdes 1897 på Hedsåsberget, 252 m över Siljan, efter ritningar av den 17-årige byggmästaren Olof Klockars. Det invigdes 12 juni 1898 av landshövding Holmquist (Dalarnas museum; kulturmiljöprogrammet). I början av 1900-talet drevs stället som "Rättviks höjdsanatorium Vidablick".
- **Lokstallarna**:
  - Lokstallet byggdes omkring 1890 och var senare vandrarhem. Kommunen tog över 2006.
  - Det återinvigdes 4 juni 2025 med utställningen "Aquanauts – Expeditionen till Siljansringen" av Pompe Hedengren.
- **Blånnesladan i Övre Gärdsjö** är från 1294 och är en av landets äldsta timmerbyggnader. Gärdsjö har riksintresse för sitt ladrike.
- **Siljansringen**:
  - Meteoriten slog ned för 377 miljoner år sedan. Den var 4 km stor och ringen är ca 65 km i diameter; kommunen kallar det "västra Europas största krater".
  - Silurhavets sjöliljor syns i Amtjärnsbrottet, och Styggforsen faller ca 30 m.
  - Vindförbergs udde har länets största insjögravfält, 45 stensättningar från äldre järnålder.
- **Fäbodarna**:
  - Kommunen nämner Lisskog och Karl-Töfåsen som de fäbodar som brukats längst utan uppehåll. Riksantikvarieämbetets inventering 2012 anger för Karl-Tövåsen (Kall-Tövåsen, Vikarbyns fäbod) kontinuitet från 1663, men med återupptagen drift.
  - Tin Gumuns driver Karl-Tövåsen sedan 2006 och kokar bland annat messmör.
  - Ärteråsen har tio eldhus från tidigt 1700-tal och fäbodristningar, och är framröstad som ett av Dalarnas sju underverk.
  - Dansbodarna har ristningar i träd från 1700- och 1800-talen. På Tövåsmyren finns torvlador.
  - Fäbodbruket kom med på UNESCO:s lista 3 december 2024.
  - Antalet fäbodar med djur i Dalarna steg från 52 år 1994 till 93 år 2008; 2025 fanns 84 företag med fäbodbete.
- **Kulturbygden**: Skiftesreformen genomfördes aldrig fullt ut runt Siljan. Därför finns de täta byarna med kringbyggda gårdar kvar, till exempel i Söderås, där riksintresset omfattar åtta byar. Ett talesätt lyder: "Om tre Rättvikare träffas, spelar fyra fiol."

### Lokala debatter

- **Sjöbodsprojektet och Sjöstaden (2018–2023)**:
  - Förslaget gällde 34 campingstugor i dräktfärger längs Siljan mellan reningsverket och båthamnen.
  - Länsstyrelsen invände att "syftet med planen är inte trovärdigt" (strandskyddet). En tredje version av masterplanen kom i maj 2022, och en ny geoteknisk utredning krävdes i oktober 2022.
  - Platsen är LIS-området "Båthamnen", 600 m längs stranden och 350 m från reningsverket. Där finns översvämningsrisk vid 100-årsflöde och möjliga markföroreningar från Lerdalssågens tryckimpregnering.
- **Bostadsbristen**:
  - ÖP 2019 beskriver brist på lägenheter i flerbostadshus. Sakofall Fastigheter bygger Ugglan vid Prästskogsvallen med 28 hyresrätter, planerade att vara inflyttningsklara sommaren 2026, och upp till tre etapper.
  - Persborg planeras som en ekoby för generationsboende.
  - Mark- och planenheten har fler uppdrag än den hinner med, så översiktsplanen och fördjupningen för Rättvik–Vikarbyn ligger i kö.
- **Matberedskap**:
  - Dalarna är självförsörjande till 38 % räknat i vikt och 29 % räknat i energi. Projektet "Lokal mat från Dalarna" (2025–2028) har 44 anslutna butiker; försäljningen av de utvalda varorna har ökat med ca 30 % i de tio butiker som lämnat jämförbara data.
  - En tredjedel av länets bönder är 60 år eller äldre.
- **Djurvälfärd på slakteriet**: Länsstyrelsen satte 2024 ett vite på 800 000 kr mot Siljans Chark, sedan grisar vaknat under avblodningen (SVT 2024-07-26).
- **Rovdjur och fäbodar**: År 2008 hade 2 av 8 svarande fäbodbrukare i Rättvik haft rovdjursangrepp (Länsstyrelsen 2008:12). DT har publicerat rubriken "Fäbodbrukare kräver: Staten måste ta ansvar för vargen"; artikeln är inte läst.
- **Stranden**: Erosionsskador vid Långbryggan prioriterades 2021 före badrampen vid Helsingland.

### Beslut framåt

- **Ny översiktsplan**: Den ska vara digital och innehålla en fördjupning för Rättvik tätort och Vikarbyn (vilande enligt prioriteringen 2026-04-15).
  - Planen ska enligt planeringsstrategin följas av en grönstrukturplan, en dagvattenstrategi, en risk- och sårbarhetsanalys och en energiplan, som saknas och är lagkrav.
  - LIS-planen och bostadsförsörjningsprogrammet ska revideras, och vindbruksplanen från 2011 väntar på Länsstyrelsens regionala underlag.
- **Detaljplaner**:
  - Antagen: Utsikten (Lerdal 10:49) i kommunfullmäktige 11 juni 2026.
  - Under arbete: Persborg (cirka 100 bostäder), Siljansborg och Klockargården (upp till 7 tomter, Svenska kyrkan), samt Haga- och Börjes väg med dagvatten och natur.
  - I kö: Vikarbyn 113:4, Hedslund IP, Björken och Lilla industriområdet.
- **Ej påbörjade**: gestaltningsprogram för offentliga rum, områdesbestämmelser, en utvecklingsplan för området mellan järnvägen och riksväg 70, och Vackert Rättvik 2.0.
- **Trafik i ÖP**: ny väg Vidablick–Hantverksbyn, en åtgärdsvalsstudie för väg 301 och en trafikplats vid riksvägarna 70/69.
- **Siljan Geopark**: Den nationella statusen gäller till omkring 2030. Mora kommun är värdorganisation från 2025, och en UNESCO-ansökan är inte belagd.
- **Kretsloppsplanen**: avfallet ska minska med 25 % och förbränningen med 50 % till 2030.
- **Kulturmiljöprogrammet** (KS 2026-03-17) ska kompletteras.

### Siffror som berättar

- **Markanvändning**: 89,5 % av landet är skog, 1,7 % jordbruksmark och 2,3 % bebyggt. Vatten utgör 10 % av ytan.
- **Fäbodbete**: Det motsvarar 63 % av all betesmark i Rättvik, och kommunen har 4 % av Sveriges fäbodbete.
- **Mjölk**: Mjölkkorna har minskat från 909 till 437 (1981–2023), och gårdarna med mjölkkor från tolv till fem (2010–2023). Ändå täcker mjölken hela kommunens förbrukning.
- **Spannmål**: Odlingen har krympt från minst 941 ha till 229 ha (1981–2025); kornet ensamt från 756 till 136 ha.
- **Skogsägare**: 2 291 privatpersoner äger skog, och 679 av dem bor utanför Dalarna. Medianinnehavet är 11 ha.
- **Skyddad natur**: 29 naturreservat, 15 Natura 2000-områden och 556 rödlistade arter med fynd sedan 2000. Mest rapporterad är ärenprisnätfjärilen, med 2 672 fynd.
- **Tätorten**: 68,8 % är grönyta och 21,9 % hårdgjord, mot 40 % i Kalmar. 84 % av invånarna bor inom 200 m från ett grönområde.
- **Kulturmiljö**: Kommunen har 18 riksintressen, 55 kommunala kulturmiljöer, 12 byggnadsminnen och 7 hembygdsgårdar.
- **Befolkning**: Det finns 2 980 fritidshus (2025), och befolkningen kan tredubblas under delar av året.
- **Mat**: Dalarnas produktion motsvarar 890 kcal per person och dag, mot en konsumtion på 3 000 kcal och kriskostens 2 450 kcal. I Rättvik arbetar 440 personer i livsmedelskedjan, och där finns 47 restauranger.
