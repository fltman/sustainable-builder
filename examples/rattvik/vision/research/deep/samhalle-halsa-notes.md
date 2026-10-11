# Samhälle och hälsa – Rättvik 2126: metod, källor och berättelsematerial

Sammanställt 2026-10-11 för ämnet **samhalle-halsa**. Filen `samhalle-halsa.json` har 40 poster, och de engelska texterna finns i `samhalle-halsa.en.json`. Alla siffror nedan kommer från källor jag har läst. Egna beräkningar är markerade.

## Kort för modellen

| Behov | Värde | Post |
|---|---|---|
| Folkmängd i dag | 10 978 (31 dec 2025), 10 962 (aug 2026) | i `kolada.json` och SCB |
| Historik | 11 300 (1968), 10 805 (1970), 11 345 (1990), topp 11 418 (1992), 10 811 (2010), botten 10 748 (2014) | `befolkning_1970/1990/2010` |
| SCB:s framskrivning (2024) | 11 083 (2030), 11 107 (2040), 11 224 (2050), 11 580 (2070) | `befolkning_prognos_2030/2040/2070` |
| Kommunens prognos | 10 965 år 2034 | i `kommun-plats-historia.json` |
| Födda minus döda | −71 (2025); i snitt 79 födda och 159 döda per år 2015–2024 | `fodelseoverskott_2025` |
| Flyttnetto | +56 (2025); i snitt +101 per år 2015–2024; SCB antar drygt +100 per år | `flyttnetto_2025` |
| Andel 80+ | 11,3 % (2025), 14,0 % (2030), 14,5 % (2040), 16,4 % (2070) | `andel_80plus_prognos_2040` |
| Andel 65+ | 34,6 % (2025), 36,5 % (2040), 37,4 % (2070) | `andel_65plus_prognos_2040` |
| Fritidshus och sommar | 2 980 fritidshus (271 per 1 000 invånare); befolkningen tredubblas på lördagen under Classic Car Week | `fritidshus_antal`, `sommarbefolkning_topp_faktor` |
| Ensamhet, 16+ | 12,3 % ibland/ofta/alltid; 3,9 % ofta/alltid (riket 18,2 % respektive 5,5 %) | `ensamhet_besvar`, `ensamhet_ofta` |
| Ensamhet bland äldre med hemtjänst | 52,7 % (riket 51,0 %) | `ensamhet_hemtjanst_65plus` |
| Framtidstro, 16+ | 73,2 % (2024), 80,7 % (2021) | `positiv_syn_pa_framtiden` |
| Unga som tror att de flyttar | 63 % (Dalarna 56 %) | `unga_tror_flytta_fran_kommunen` |
| Barnfattigdom | 9,4 % (Dalarna 14,3 %, riket 12,9 %) | `barnfattigdom_andel` |
| Äldreomsorg | 116 personer 65+ i särskilt boende, 293 med hemtjänst (2025) | `sarskilt_boende_65plus_antal`, `hemtjanst_65plus_antal` |
| Primärvård (länet) | 1 775 listade per allmänläkare; 18 % hyrläkare | `listade_invanare_per_allmanlakare`, `hyrlakare_andel_vardcentral` |
| Valdeltagande, kommunval | 84,11 % både 2022 och 2026 | `valdeltagande_kommunval_2022` |
| Bostäder | 5 862; 27,1 % hyresrätt, 61,0 % äganderätt; 588 i allmännyttan; inget kollektivhus | `bostader_antal`, `andel_hyresratt`, `allmannyttan_lagenheter` |
| Föreningsliv | 93 föreningar i registret, varav 24 bystugeföreningar; 17,3 idrottsföreningar med LOK-stöd per 10 000 invånare (riket 9,6) | `foreningar_i_registret`, `idrottsforeningar_lok_per_10000` |
| Brott | 9 829 anmälda brott per 100 000 invånare (riket 13 581) | `anmalda_brott_per_100000` |

**Tolkning.** Kommunen behöver ungefär 100 inflyttade netto per år för att hålla folkmängden, eftersom det dör ungefär dubbelt så många som det föds. Åren 2022–2025 gav i stället 67, 16, 48 och 56, så folkmängden sjunker långsamt och ligger redan under SCB:s bana.

Den sociala hälsan hos vuxna är tydligt bättre än i Dalarna och riket: mindre ensamhet, mindre rädsla att gå ut och mindre kränkning. Samtidigt visar elevhälsosamtalen att gymnasieelever i år 1 mår sämre än länssnittet. Två av tre unga tror att de flyttar.

### Avgränsning mot de andra ämnesfilerna

Följande finns redan i `kommun-plats-historia.json` eller `kolada.json` och har inte lagts in en gång till:

- valdeltagandet 2026 och mandaten per parti
- kommunens prognos för 2034 och ökningen av 85–89-åringar
- tätortens folkmängd 2023
- antal grundskolor och elever per skola
- gymnasieexamen inom tre år (88 %)
- årsresultatet 2025 och kommunalskatten (kommunens del)
- Koladas standardnyckeltal: åldersandelar, hushåll, medellivslängd, självskattad hälsa, tillit, psykisk påfrestning, emotionellt stöd, barn i hushåll med låg ekonomisk standard, trångboddhet och bostadsmarknadsläge

Två mått på barnfattigdom kan se motsägelsefulla ut men mäter olika saker:

- Kolada N66077, `barn_lag_ekonomisk_standard`, är 15,0 % (2024). Det är ett relativt mått: under 60 % av medianinkomsten.
- Rädda Barnens reviderade mått är 9,4 % (2023). Det bygger på Konsumentverkets basbehov och försörjningsstöd.

## Metod

- **Maskinläsbart:**
  - SCB:s statistikdatabas via API v2. Tabeller: TAB638/BefolkningNy, TAB5557, TAB6471/BefolkManadCKM, TAB5169/BefforandrKvRLK, TAB6481/BefforandrKvRLKCKM, TAB698/BefProgOsiktRegN, TAB825/BO0104T08, TAB671, TAB824/BO0104T04, TAB2017/Kommunalskatter2000, TAB5357/LandarealTatortN och TAB631/BefLandInvKvmTO. Citerade länkar går till motsvarande sida i statistikdatabasen; alla svarar HTTP 200.
  - Kolada v3, med kommunkod 2031, länskod 0020 och riket 0000.
  - Valmyndighetens resultatdata: JSON bakom resultat.val.se, för kommunen, valdistrikten, länet och riket.
  - Folkhälsomyndighetens Folkhälsodata-API, som ger HLV på länsnivå.
  - Skolverkets API:er (skolenhetsregistret och planned-educations).
- **Region Dalarnas Power BI-rapporter.** Tre rapporter är länkade från [regionens folkhälsosida](https://www.regiondalarna.se/om-oss/hallbar-utveckling/social-hallbarhet/folkhalsa/):
  - Nationella folkhälsoenkäten Dalarna, publicerad 2024-11-20
  - Elevhälsorapport Dalarna, publicerad 2025-08-29 och uppdaterad 2025-10-17
  - Lupp Dalarna 2015–2024, publicerad 2025-04-16

  Värdena hämtades med Power BI:s publika fråge-API (`querydata`), alltså samma data som rapporterna visar.
  - Kommunresultaten från folkhälsoenkäten 2024 bygger på Dalarnas tilläggsurval: 15 598 svarande i länet (38,6 %), lika många enkäter per kommun och cirka 940 svarande i Rättvik.
  - Stjärnan i rapporten betyder signifikant skillnad mot riket.
  - Elevhälsorapporten bygger på hälsosamtal i kommunala skolor (förskoleklass, åk 4, åk 7 och år 1 på gymnasiet). Grupper under 15 personer redovisas inte.
- **PDF:er lästa i minnet med pypdf:**
  - Rättviks kommuns Årsredovisning 2025 och Mål och budget 2026–2028
  - Rädda Barnens Barnfattigdomsrapporten 2025. I den officiella pdf:en saknar kommunbilagan textlager, så jag läste den identiska texten i en kopia (dikko.nu) och kontrollerade mot Rädda Barnens Excel-bilaga.
  - Läkarförbundets rapport om vårdcentralernas läkarbemanning, 2025
  - Region Dalarnas Folkhälsorapport 2023, som bara har diagram utan läsbara kommunvärden
- **Webbsidor:**
  - rattvik.se (kommunfakta, ekonomi, grundskolor, föreningar), föreningsregistret friweb.rattvik.se och Rättviks Fastigheter AB
  - Kollektivhus NU (adressen kollektivhus.nu svarar inte, föreningen ligger nu på kollektivhus.se) och folkhogskola.nu
  - SCB:s analys av sommarbefolkning
  - Falu-Kuriren 5 oktober 2026, Siljan News 2021 och svenska Wikipedias lista över kommunstyren
- **Egna beräkningar** (markerade i posterna):
  - andelar 65+ och 80+ i SCB:s framskrivning, summerade över ettårsklasser
  - genomsnitt 2015–2024 för födda, döda och flytt
  - fritidshus per 1 000 invånare
  - summan av bostadsbeståndet och andelen hyresrätter
  - summan av föreningsregistrets kategorier
  - andelen förstaårselever på gymnasiet som mår bra, räknad ur svarsantal
  - antal LOK-föreningar, räknat ur Koladas värde per 10 000 invånare
- **Begränsningar.**
  - Sessionens gemensamma tak för webbsökningar (200) tog slut mot slutet, så vårdcentralen, styret efter valet och skoldebatten kunde inte följas upp med fler sökningar.
  - Ett WebFetch-anrop sparade automatiskt en pdf i sessionens tool-results-mapp. Filen raderades direkt.
  - Övriga pdf:er lästes i minnet. Textutdrag och JSON-svar ligger i `/private/tmp/rattvik-cache`.
  - Inga andra filer i projektet har ändrats.

## Källor

**SCB**
- Folkmängd 1968–2024: https://www.statistikdatabasen.scb.se/pxweb/sv/ssd/START__BE__BE0101__BE0101A/BefolkningNy/
- Folkmängd per månad 2025–2026: https://www.statistikdatabasen.scb.se/pxweb/sv/ssd/START__BE__BE0101__BE0101A/BefolkManadCKM/
- Befolkningsförändringar 2025–2026: https://www.statistikdatabasen.scb.se/pxweb/sv/ssd/START__BE__BE0101__BE0101G/BefforandrKvRLKCKM/
- Befolkningsförändringar 2000–2024: https://www.statistikdatabasen.scb.se/pxweb/sv/ssd/START__BE__BE0101__BE0101G/BefforandrKvRLK/
- Regional befolkningsframskrivning 2024–2070: https://www.statistikdatabasen.scb.se/pxweb/sv/ssd/START__BE__BE0401__BE0401A/BefProgOsiktRegN/
- Fritidshus: https://www.statistikdatabasen.scb.se/pxweb/sv/ssd/START__BO__BO0104__BO0104H/BO0104T08/
- Bostadsbestånd efter upplåtelseform: https://www.statistikdatabasen.scb.se/pxweb/sv/ssd/START__BO__BO0104__BO0104D/BO0104T04/
- Kommunala skattesatser: https://www.statistikdatabasen.scb.se/pxweb/sv/ssd/START__OE__OE0101/Kommunalskatter2000/
- Tätorter: https://www.statistikdatabasen.scb.se/pxweb/sv/ssd/START__MI__MI0810__MI0810A/LandarealTatortN/ och https://www.statistikdatabasen.scb.se/pxweb/sv/ssd/START__MI__MI0810__MI0810A/BefLandInvKvmTO/
- Musik, idrott och bilar drar folk i Sommarsverige (2024-07-02): https://www.scb.se/hitta-statistik/artiklar/2024/musik-idrott-och-bilar-drar-folk-i-sommarsverige/
- API: https://statistikdatabasen.scb.se/api/v2/tables/TAB698/data (motsvarande för övriga tabeller)

**Valmyndigheten**
- Kommunval 2026: https://resultat.val.se/val2026/KF/20/2031 (data: https://resultat.val.se/data/resultat/val2026/KF_20_2031_S.json, valdistrikt `KF_20_2031_<distriktskod>_S.json`, riksdag `RD_24_2031_S.json`, län `KF_20_S.json`, riket `KF_S.json`)
- Kommunval 2022: https://resultat.val.se/val2022/KF/20/2031

**Region Dalarna och Folkhälsomyndigheten**
- Nationella folkhälsoenkäten Dalarna: https://app.powerbi.com/view?r=eyJrIjoiZGQ3ODdmMzItOTNiZS00NTMzLTg1YzUtNmE4NDJhN2JmZGQ0IiwidCI6IjRhZTg5ZmEzLWFkYjktNGY5OS1iOGQ4LTQ0Mzc3ZDQ0ZWE4YSIsImMiOjh9
- Elevhälsorapport Dalarna: https://app.powerbi.com/view?r=eyJrIjoiM2FmZWRjMmMtMzU1MC00OTE5LWJhN2QtNjg3ZjAxOGMzYjNmIiwidCI6IjRhZTg5ZmEzLWFkYjktNGY5OS1iOGQ4LTQ0Mzc3ZDQ0ZWE4YSIsImMiOjh9
- Lupp Dalarna 2015–2024: https://app.powerbi.com/view?r=eyJrIjoiZjFhNzUxNjYtYjE3Yy00ZDgyLWE3MzctYzViZWE3OTQ3MTZiIiwidCI6IjRhZTg5ZmEzLWFkYjktNGY5OS1iOGQ4LTQ0Mzc3ZDQ0ZWE4YSIsImMiOjh9
- Folkhälsorapport Dalarna 2023: https://www.regiondalarna.se/contentassets/e1b75078ee8d4d3f9bd53b47f664c589/folkhalsorapport-dalarna-2023.pdf
- Folkhälsomyndigheten, HLV per län: https://fohm-app.folkhalsomyndigheten.se/Folkhalsodata/api/v1/sv/A_Folkhalsodata/B_HLV/eSocialarel/aSocialarel/hlv1socxreg.px och https://fohm-app.folkhalsomyndigheten.se/Folkhalsodata/api/v1/sv/A_Folkhalsodata/B_HLV/dPsykhals/hlv1psyxreg.px

**Kolada (RKA)**, mönstret https://api.kolada.se/v3/data/kpi/<KPI>/municipality/<2031|0020|0000>

| Område | Nyckeltal |
|---|---|
| Äldreomsorg | N23805, N23806, N23890, N21702, N21705, N20891, N20892, U01421, U21478, U23481, N01726, N21826, N23706 |
| Folkhälsa (HLV) | U01420, U01471, U01472, N01458, N01460, N01464, U01407, U01404, U01402 |
| Val | N05401, N05831, N05833 |
| Idrott | U09804, U09800 |
| Skola | N17819, N17800, N17805, N15504, N15428, N15419 |
| Brott och trygghet | N07540, N07403, N07633, N07611, N07600 |
| Index och områden | N00309, N00301, N33821 |

**Rättviks kommun och bolag**
- Årsredovisning 2025: https://ess-app.rattvik.se/api/download/918ef6a6-3f83-48da-b06c-68eb8b77e9ac/b96a9b6b-0142-43a4-931c-7f44d02749bf
- Mål och budget 2026–2028: https://ess-app.rattvik.se/api/download/9c6ec099-9e31-4b9a-b4fc-132d4c52195a/3312201d-a8aa-4fcc-b71e-0a6097d18696
- Dokumentarkivets API: https://ess-app.rattvik.se/api/folders/?tags=Arsredovisning
- Kommunfakta: https://www.rattvik.se/kommun-och-politik/kommunfakta.html
- Ekonomi och budget: https://www.rattvik.se/kommun-och-politik/kommunfakta/ekonomi-och-budget.html
- Grundskolor: https://www.rattvik.se/forskola-skola-och-utbildning/grundskola/grundskolor.html
- Föreningar och bidrag: https://www.rattvik.se/uppleva-och-gora/foreningar-och-bidrag.html
- Föreningsregister: https://friweb.rattvik.se/forening/
- Rättviks Fastigheter AB: https://www.rattviksfastigheter.se/om-oss.html, https://www.rattviksfastigheter.se/vara-bostadsomraden.html och https://www.rattviksfastigheter.se/om-oss/aktuella-projekt.html

**Övriga**
- Rädda Barnen, Barnfattigdomsrapporten 2025, sidan med rapporten: https://www.raddabarnen.se/stod-och-kunskap/barnfattigdom/barnfattigdomsrapporten/
- Rapporten (pdf, kommunbilaga s. 53–58): https://www.raddabarnen.se/globalassets/bilder/rad--kunskap/barnfattigdom/barnfattigdomsrapporten-2025.pdf
- Sammanfattning: https://www.raddabarnen.se/globalassets/bilder/rad--kunskap/barnfattigdom/sammanfattning_barnfattigdomsrapport-20252.pdf
- Excel-bilaga: https://www.raddabarnen.se/globalassets/dokument/medlem--volontar/medlem/barnfattigdom/barnfattigdomsstatistik--for-sveriges-lan-och-kommuner-2023.xlsx
- Textkopia av rapporten: https://dikko.nu/wp-content/uploads/2025/10/Barnfattigdomsrapport_2025_final_webb.pdf
- Sveriges läkarförbund, 1 100 invånare per läkare (2025): https://slf.se/app/uploads/2025/10/1-100-invanare-per-lakare-vardcentralers-lakarbemanning-1.pdf
- Skolverket: https://api.skolverket.se/skolenhetsregistret/v1/kommun/2031 och https://api.skolverket.se/planned-educations/v3/school-units/14292382/statistics/gy
- Kollektivhus NU: https://kollektivhus.se/kollektivhus-ovriga-sverige/ och https://kollektivhus.se/startargrupper-kollektivhus/
- Folkhögskolor: https://www.folkhogskola.nu/sok-skolor/
- Falu-Kuriren, ”SD om maktsamtalen med M: ’Vi är överens’” (5 okt 2026): https://www.falukuriren.se/rattvik/sd-om-maktsamtalen-med-m-vi-ar-overens
- Falu-Kurirens ledare ”Rättvikarna har sagt sitt”. Bara rubriken och adressen är sedda, och adressen lyder ”sparka-c-och-lat-s-och-m-ta-over”: https://www.falukuriren.se/opinion/ledare/rattvikarna-har-sagt-sitt-sparka-c-och-lat-s-och-m-ta-over
- Siljan News, ”Det är ju de små skolorna som får den största förändringen” (23 sep 2021): https://www.siljannews.se/rattvik/det-ar-ju-de-sma-skolorna-som-far-den-storsta-forandringen/
- Wikipedia, kommunstyren 2022–2026 (C+M+KD med 20 av 39 mandat): https://sv.wikipedia.org/wiki/Lista_%C3%B6ver_kommun-_och_regionstyren_i_Sverige_2022-2026
- Dalabygden, Kulturhuset 40 år (2023): https://dalabygden.se/2023/10/17/sa-ska-kulturens-hogborg-i-rattvik-fira-sitt-jubileum/

## Fynd per område

### 1. Befolkning

- **Ett halvsekel på samma nivå.**
  - Mellan 1970 och 2025 har folkmängden pendlat mellan 10 634 (1973) och 11 418 (1992).
  - Tätorten Rättvik har däremot vuxit från 3 918 (1970) till 5 369 (2023), och 80 % av invånarna bor i någon tätort (egen beräkning: 8 879 av 11 042).
  - Den senaste toppen, 11 103 år 2021, kom under pandemiåren, då inflyttningen var hög (+168 netto 2020 och +134 netto 2021); därefter har folkmängden minskat varje år.
- **Komponenter 2025.**
  - 72 födda och 143 döda.
  - Netto −30 mot resten av Dalarna och +57 mot resten av Sverige; invandringsöverskott +28.
  - Första halvåret 2026: 30 födda och 90 döda, flyttnetto +53.
  - Under 2015–2024 var flyttnettot i snitt +101 per år, med toppar 2016 (+203, flyktingmottagande) och 2020 (+168).
- **SCB:s framskrivning från 2024** är den enda officiella framskrivningen på kommunnivå.
  - Den börjar på 11 053 (2024) och slutar på 11 580 (2070).
  - Den antar i snitt 79 födda och 180 döda per år, och ett flyttnetto på drygt 100 per år.
  - Antalet 20–64-åringar ligger kring 5 250 fram till 2040.
  - Den demografiska försörjningskvoten (egen beräkning ur tabellen) stiger från 1,08 (2025) till 1,11 (2030–2040) och 1,20 (2060).
- **Kommunens egen prognos** (ÅR 2025 s. 56; MoB 2026 s. 33) är mer pessimistisk: 10 965 år 2034.
  - 85–89-åringarna ökar med 74 % (+287 personer) och 90+ med 53 % (+110).
  - Barn 6–12 år blir 61 färre.
  - Kommunen skriver att bara nio kommuner har högre försörjningskvot (1,09; riket 0,77).
- **Fritidshus och sommar.**
  - Antalet fritidshus har ökat från 2 520 (1998) till 2 980 (2025).
  - Det är 271 per 1 000 invånare, mot 164 i länet och 60 i riket (egen beräkning).
  - SCB:s mobildata för sommaren 2023 visar att folkmängden större delen av sommaren låg nära årsmedianen, men tredubblades på lördagen under Classic Car Week. Rättvik är alltså en kommun med toppdagar, inte en lång sommarsäsong som Borgholm.

### 2. Social hälsa bland vuxna

Värdena är från Region Dalarnas folkhälsoenkät 2024. Ordningen är Rättvik / Dalarna / riket.

| Indikator | Rättvik | Dalarna | Riket |
|---|---|---|---|
| Besväras av ensamhet ibland, ofta eller alltid | 12,3* | 17,2 | 18,2 |
| Besväras av ensamhet ofta eller alltid | 3,9* | 5,4 | 5,5 |
| Låg tillit till andra | 25,6* | 30,0 | 31,0 |
| Saknar emotionellt stöd | 10,6* | 14,4 | 13,4 |
| Allvarlig psykisk påfrestning | 8,1* | 11,0 | 11,0 |
| Positiv syn på framtiden (2021: 80,7*) | 73,2 | 71,3 | 72,0 |
| Rädd att gå ut ensam | 12,7* | 22,9 | 28,3 |
| Klarar inte en oväntad utgift | 19,7 | 21,4 | 20,3 |
| God eller mycket god hälsa | 63,3* | 64,7 | 68,2 |
| Sömnbesvär | 40,7 | 45,0 | 44,6 |

\* = signifikant skillnad mot riket.

- **Lågt socialt deltagande.**
  - 2014: Rättvik 26,5 %, Dalarna 25,4 %, riket 20,4 %.
  - 2021: Rättvik 61,1 %, Dalarna 53,7 %, riket 48,6 %. Mätningen gjordes under pandemin.
  - Folkhälsomyndighetens sammanslagna värde för Dalarna 2019–2022 är 35,3 % (riket 31,7 %). För 2024 redovisas måttet inte.
- **Kolada** (HLV 2021–2024 sammanslagna):
  - kränkande behandling 13,9 % (riket 18,8 %)
  - våld eller hot 4,4 % (riket 5,0 %)
  - riskabla alkoholvanor 12,1 % (riket 15,5 %)
  - röker dagligen 5,1 % (riket 5,6 %)
  - avstått tandvård av ekonomiska skäl 11,3 % (riket 10,5 %)
  - ekonomisk kris 14,5 % (riket 14,9 %)
- **Äldre.**
  - 45,2 % av invånarna 65+ bor ensamma (riket 45,1 %).
  - Bland personer 65+ med hemtjänst besväras 52,7 % av ensamhet; 8,7 % har svåra besvär.

### 3. Barn och unga

- **Elevhälsosamtal läsåret 2025/26**, Rättvik / Dalarna:

  | Grupp | Indikator | Rättvik | Dalarna |
  |---|---|---|---|
  | År 1 gymnasiet | Mår bra eller mycket bra | 66,7 | 75,4 |
  | År 1 gymnasiet | Nedstämd eller ledsen varje vecka | 42 | 30 |
  | Åk 7 | Mår bra eller mycket bra | 85 | 80 |
  | Åk 4 | Mår bra eller mycket bra | 91 | 90 |
  | Förskoleklass | Mår bra eller mycket bra | 94 | 91 |

  Gymnasieeleverna går på Stiernhööksgymnasiet, som även tar emot elever från andra kommuner. Ingen av 73 elever i åk 4 var ganska eller mycket orolig för familjens ekonomi.
- **Lupp 2024** (högstadiet och gymnasiet, 180 svarande):
  - 63 % tror att de flyttar (gymnasiet 78 %). Skälen är främst arbete (54 %) och studier (37 %).
  - Det bästa med att bo i kommunen är familj och släkt (53 %) och närheten till naturen (38 %).
  - 88 % är nöjda med livet.
  - 53 % är föreningsmedlemmar (högstadiet 62 %).
  - 22 % tycker att de kan föra fram sina åsikter till beslutsfattarna (Dalarna 16 %).
  - 36 % har förtroende för politiker, mot 45 % 2021.
- Kommunen följer Lupp-nyckeltal för ungas hälsa och framtid. För tjejer i gymnasiet sjönk värdet från 57 % till 53 % mellan 2021 och 2024, medan det steg för killar i högstadiet från 80 % till 85 % (ÅR 2025 s. 28).

### 4. Demokrati

- **Valdeltagande i kommunvalet:** 84,11 % både 2022 (7 813 av 9 289) och 2026 (7 780 av 9 250). Det är högre än i länet (83,33 %) och riket (82,34 %).
- **Mandat.** S gick från 11 till 13, C från 10 till 8, M från 7 till 8 och KD från 3 till 2; SD (7) och V (1) står still. C+M+KD, som styrde 2022–2026, har nu 18 av 39.
- **Personröster:** Ulrica Momqvist (C) 307, Bengt Stor (M) 286, Daniel Wenngren (S) 270 och Olov Inge Östlund (SD) 217.
- **Geografin i valdistrikten (2026):**

  | Valdistrikt | Största partier | Deltagande |
  |---|---|---|
  | Ore | SD 41,1 %, S 29,7 % | 76,3 % |
  | Rättvik C | S 35,7 % | |
  | Rättvik S | S 29,2 %, C 26,4 %, M 24,2 % | |
  | Vikarbyn | | 86,0 % |
  | Rättvik V | | 75,4 % |

  Siffrorna gäller utan uppsamlingsdistriktet.
- **Styret.** Den 5 oktober 2026 fanns inget avtal. SD säger sig vara överens med M om att samverka, vilket M förnekar, och S+M skulle ge 21 mandat (Falu-Kuriren). Se `kommun-plats-historia-notes.md` för fullmäktiges första möte den 22 oktober.

### 5. Välfärd och ekonomi

- **Barnfattigdom (Rädda Barnen, 2023).**
  - 161 av 1 714 barn, 9,4 %, plats 75 av 290 kommuner. Det tidigare måttet gav 5,7 %.
  - Rättvik har den sjätte lägsta andelen i länet; Leksand har 7,5 % och Borlänge 23,2 %.
- **Kommunens ekonomi.**
  - Utan engångsvinsten på 311 mnkr från Dala Energi blev resultatet 14,8 mnkr, eller 1,7 % av skatteintäkterna. Målet är 2 %.
  - Vinsten motsvarar ungefär 36 % av ett års skatteintäkter och statsbidrag (egen beräkning: 311 av 865 mnkr).
  - Den totala skattesatsen är 33,80 % (riket 32,38 %).
- **Äldreomsorg (Kolada).**
  - Färre bor i särskilt boende: 148 personer 2021 och 116 år 2025, vilket är 3,05 % av invånarna 65+ (riket 3,82 %).
  - Fler har hemtjänst: 250 personer 2022 och 293 år 2025.
  - Andelen 80+ med någon av insatserna föll från 33,5 % (2018) till 25,6 % (2025).
  - Kommunen ser över sin boendeplan och skriver att äldre i dag är friskare men får mer komplexa behov senare i livet (ÅR 2025 s. 52).
  - Hemtjänsten har gått från tre till två områden. Hösten 2025 startade öppna ”Trivselträffar” för seniorer, och fjärrtillsyn har införts (ÅR 2025 s. 53).
- **Primärvård.**
  - På länsnivå har varje allmänläkare 1 775 listade, och 18 % av allmänläkararbetet görs av hyrläkare (Läkarförbundet 2025).
  - För Rättviks vårdcentral finns inga egna siffror. Kommunens bolag Rättviks Vårdlokaler AB äger huset, som även rymmer äldreboendet Prästskogen (ÅR 2025 s. 9).
  - Köpet av huset och vårdbussen till norra byarna beskrivs i `kommun-plats-historia-notes.md`.

### 6. Utbildning

- **Grundskola.** Åtta kommunala grundskolor och inga fristående grundskolor. Inom bildningsområdet är den enda privata utföraren en fristående förskola (ÅR 2025 s. 7).
- **Stiernhööksgymnasiet** hade 447 elever hösten 2025. Riksgymnasiet för naturbruk dominerar med cirka 190 elever.
  - Lantbruksinriktningen hade 42 förstahandssökande till 24 platser.
  - Skoljordbruket köpte 2025 ett mejeri som ska installeras i Rättvik och installerade en optisk rensare för spannmål och baljväxter, vilket kommunen kopplar till livsmedelsberedskap (ÅR 2025 s. 18).
  - Av Rättviks egna gymnasieelever går 28 % i en annan kommuns skola, och fler väljer yrkesprogram på annat håll (ÅR 2025 s. 16).
- **Folkhögskola.** Det finns ingen ”Rättviks folkhögskola” bland Dalarnas folkhögskolor på folkhogskola.nu: Brunnsvik, Fornby (Borlänge och Falun), Leksand, Malung, Mora, Sjövik och Västanvik. De närmaste ligger i Leksand och Mora.
- **Högskolan Dalarna** (Falun och Borlänge): någon primärkälla för avstånd eller restid har jag inte hittat.

### 7. Boende

- **Bostadsbestånd 2025:**

  | | Antal |
  |---|---|
  | Totalt | 5 862 |
  | Småhus | 3 753 |
  | Flerbostadshus | 1 680 |
  | Övriga hus | 137 |
  | Specialbostäder | 292 |
  | Äganderätt | 3 574 (61,0 %) |
  | Hyresrätt | 1 590 (27,1 %) |
  | Bostadsrätt | 694 (11,8 %) |

  Beståndet har ökat med 270 bostäder sedan 2015, ungefär 27 per år.
- **Allmännyttan.**
  - Rättviks Fastigheter AB har 588 lägenheter och ca 36 000 m² bostadsyta. Kommunen blockhyr dessutom 185 lägenheter för äldreboende och LSS.
  - Lägenheterna finns i tre kategorier: vanliga, 55+ och trygghetsboende från 70 år.
  - Bostadskön har vuxit men publiceras inte.
  - Bolaget planerar 2 hus med 8 lägenheter om 82 m² i Boda, med inflyttning våren 2027.
- **Kommunens mål:**
  - fler bostäder i byarna
  - trygghetsboende och seniorboende där behov finns
  - en markanvisning för ett flerbostadshus med minst 8 lägenheter
  - tio småhustomter till mäklare under 2026 (MoB 2026 s. 22–23)

  Under 2025 lämnades 26 småhustomter till mäklare.
- **Bogemenskaper.** Kollektivhus NU har inget hus och ingen startargrupp i Rättvik. I Dalarna finns bara Tersen i Falun, en kooperativ hyresrätt för ”andra halvan av livet” med 44 lägenheter.

### 8. Civilsamhälle och trygghet

- **Föreningsregistret** har 93 föreningar.
  - 24 är bystuge- och bygdegårdsföreningar: Bingsjö, Blecket, Born, Dalfors, Gulleråsen, Gärdebyn, Håven, Lerdal, Nedre och Övre Gärdsjö, Nittsjö, Näset, Ovanmyra, Röjeråsen, Sjurberg, Stumsnäs, Sunnanhed, Tammeråsen, Utanåker, Vikarbyn, Västbjörka, Östanvik, Östbjörka och VRG.
  - Kulturföreningarna är bland annat Rättviks, Boda och Ore hembygdsföreningar, Boda spelmanslag, Boda vävstugu, Rättviks hemslöjdsförening, Rättviks kultursällskap och Rättviks unga arrangörer.
- **Idrott.** Det finns nästan dubbelt så många idrottsföreningar med LOK-stöd per invånare som i riket. Ändå är deltagandet lägre: 25,7 deltagartillfällen per invånare 7–20 år, mot 33,4 i riket.
- **Brott.**
  - 9 829 anmälda brott per 100 000 invånare 2025 (riket 13 581); 2024 var siffran 7 305. Orsaken till ökningen är inte undersökt.
  - Anmälda våldsbrott: 1 110 per 100 000 (riket 1 067).
  - NTU för Dalarna 2024: 16,8 % har utsatts för brott mot person (riket 20,0 %).
  - Räddningstjänsten hade omkring 400 larm 2025 (ÅR 2025 s. 18).

## Det jag inte hittade

- **Vem som styr 2026–2030.** Inget var klart den 5 oktober 2026, och fler sökningar var inte möjliga.
- **Kommunnivå för vissa HLV-mått.**
  - Lågt socialt deltagande 2024 redovisas inte.
  - Ensamhet har ingen tidsserie, eftersom den bara redovisas för 2024.
  - Det finns inget direkt mått på ”känsla av mening”; jag har använt *positiv syn på framtiden*.
- **Liv & hälsa ung** genomförs inte i Dalarna. I stället används Elevhälsorapporten och Lupp.
- **Rättviks vårdcentral:** listade patienter, läkartjänster och hyrläkarandel på enhetsnivå.
- **Antal platser i särskilt boende.** Det finns bara antal brukare (116) och de 185 blockhyrda lägenheterna, som även omfattar LSS.
- **Bostadsköns längd** hos Rättviks Fastigheter, och väntetider.
- **Absolut antal sommarboende eller fritidsboende.** Det finns bara SCB:s mobildatafaktor (×3 en dag).
- **Avstånd och restid till Högskolan Dalarna.** Det finns bara tredjepartssidor, som inte används.
- **Någon folkhögskola i Rättvik.** Ingen finns.
- **Rättviks spelmanslag** finns inte i kommunens föreningsregister, och jag har inte kunnat kontrollera det i någon annan källa.
- **Orsaken till ökningen av anmälda brott 2025.** Jag har inte gått igenom BRÅ:s statistik per brottstyp.

## För berättelsen

**Vardagsliv**

- Rättvik är en kommun där man åldras tillsammans: var tredje invånare är 65 eller äldre, och fram till 2034 ökar 85–89-åringarna med tre fjärdedelar enligt kommunens prognos.
- Ändå säger bara knappt 4 % att de ofta är ensamma, och nästan nio av tio har aldrig avstått från att gå ut ensamma av rädsla, mot ungefär sju av tio i riket.
- Hemtjänsten når allt fler (293 personer 2025), medan äldreboendet krymper (116). Hälften av dem som får hemtjänst besväras ändå av ensamhet. Kommunen har startat öppna träffar för seniorer, ”Trivselträffar”.
- Barnen mår bra i lågstadiet; ingen fjärdeklassare oroade sig för familjens ekonomi. Men i första året på gymnasiet säger bara två av tre att de mår bra, och fyra av tio är nedstämda varje vecka.

**Platser**

- Byarna lever genom sina bystugor. 24 bystuge- och bygdegårdsföreningar finns i kommunens register, från Bingsjö och Blecket till Östanvik och Västbjörka; det är tre gånger så många som kommunens grundskolor.
- Boda och Ore har egna hembygdsföreningar, och Boda har en egen spelmanslag och vävstuga.
- Sätra skola har ungefär tio elever, och Furudals skola har en hockeyprofil.
- Stiernhööksgymnasiet är i praktiken ett naturbruksgymnasium med eget skoljordbruk, och nu ett eget mejeri.

**Historia i siffror**

- Rättvik hade 11 300 invånare 1968 och 10 978 år 2025: samma storlek i nästan sextio år. Under tiden har tätorten vuxit med ungefär 1 450 invånare sedan 1970 (3 918 till 5 369 år 2023), medan resten av kommunen minskat med ungefär 1 200 (egen beräkning). En del av förändringen beror på att byar har räknats in i tätorter.
- Toppåret var 1992 (11 418).
- Sedan 2000 har det varje år dött fler än det fötts. Det är inflyttningen från andra delar av landet, och flyktingmottagandet 2016, som har hållit folkmängden uppe.

**Lokala debatter**

- **Vem ska styra?** Socialdemokraterna vann valet 2026 (från 11 till 13 mandat). C+M+KD, som styrde 2022–2026, har bara 18 av 39 mandat, men C och M skulle tillsammans med SD få majoritet (23 mandat), och S+M skulle få 21. En ledare i Falu-Kuriren ville enligt rubriken att C petas och att S och M tar över.
- **Byskolorna.** Sedan 2022 är Sätra och Ingels lågstadieskolor. Färre barn föds, och förskoleavdelningar stängs i centrum.
- **Unga som flyttar.** Två av tre ungdomar tror att de lämnar kommunen, främst för jobb och studier.
- **Bostäder.** Kön till de kommunala lägenheterna växer. Kommunen vill bygga i byarna och ordna trygghetsboende, men det byggs bara några tiotal bostäder per år.
- **Vården.** På Dalarnas vårdcentraler görs 18 % av allmänläkararbetet av hyrläkare (riket 11 %), och varje allmänläkare har 1 775 listade, mot riktvärdet 1 100.

**Beslut framför oss**

- Hur engångspengarna från Dala Energi (311 mnkr, drygt en tredjedel av ett års skatteintäkter) ska användas.
- En ny boendeplan för äldre.
- En ny kommuntäckande översiktsplan.
- Markanvisning för flerbostadshus.
- Nya hyreshus i Boda till 2027.
- Hur byskolorna ska klara färre barn.
- Hur kommunen ska få fler i arbetsför ålder. Försörjningskvoten är bland de högsta i Sverige.

**Siffror som berättar**

- 271 fritidshus per 1 000 invånare, över fyra gånger rikssnittet.
- Befolkningen tredubblas en lördag i juli (Classic Car Week).
- 84,11 % röstade både 2022 och 2026, exakt samma andel.
- 9,4 % av barnen lever i ekonomisk utsatthet, mot 23,2 % i Borlänge.
- 42 sökande till 24 platser på lantbruksinriktningen.
- 93 föreningar, varav 24 bystugor.
- 88 % av de unga är nöjda med livet, men 63 % tror att de flyttar.
