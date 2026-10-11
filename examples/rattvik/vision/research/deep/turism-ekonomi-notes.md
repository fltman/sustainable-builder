# Turism och ekonomi – forskningsanteckningar (Rättvik 2126)

Ämne: `turism-ekonomi` · sammanställt 2026-10-11 · 40 poster i `turism-ekonomi.json` (engelska i `turism-ekonomi.en.json`).

## Metod

- **Gästnätter, kapacitet och logiintäkter per kommun** kommer direkt från Tillväxtverkets statistikportal (DivePort-applikation; Tillväxtverket producerar inkvarteringsstatistiken själv sedan referensåret 2025, tidigare SCB). Portalen har inget öppet API och kräver att man väljer *Nivå = Kommun* och *Kommun = Rättvik* samt start- och slutmånad. Jag läste siffrorna i webbläsaren (Claude in Chrome) som de visas i portalens rutor, utan att ladda ner Excel-filer. Årssummorna stämmer på gästnatten med Koladas N45850 (gästnätter per invånare) × folkmängd, vilket fungerade som kontroll.
- **Siljanssumman** fick jag genom att välja kommunerna en i taget (Rättvik → +Leksand → +Mora → +Orsa); varje kommuns värde är differensen mellan två visade summor.
- **Turismräkenskaper per kommun** (konsumtion, årsarbetskrafter, förädlingsvärde) är Tillväxtverkets experimentella statistik i samma portal. Jag kontrollerade 889 mnkr (2025), 915 mnkr (2019, fasta priser), 186 årsarbetskrafter och andelen 6,4 % (2023, inkl. produktskatter) direkt i portalen.
- **SCB**: fritidshus (TAB825, TAB671), skattesatser (TAB2017) och BRP (NR0105ENS2010T06A) via SCB:s API; tabellerna till tre SCB-analyser (mobilnätsdata 2022 och 2023, fritidshusägande 2025) lästes som Excel i minnet utan att sparas.
- **Kolada (API v3)**: gästnätter och ankomster per invånare (N45850, N45851), fritidshus per 1 000 invånare (N07911), fritidshuspris (N07910) och sysselsatta per bransch (N02203–N02241, SCB BAS). De automatiskt hämtade nyckeltalen (N02280, N02797, N00906, N00999, N02201, N00071, N45700, N02277/78) används inte som poster; N02201 (4 324 sysselsatta) används bara i en egen beräkning.
- **PDF:er** (årsredovisning, budget, KS-kallelse, SMHI, Chalmers, Svenskt Näringsliv, Företagarna, Tillväxtverket, Classic Car Weeks verksamhetsberättelser) lästes i minnet med pypdf; inga PDF:er eller bilder sparades.
- Tre delutredningar (evenemang, klimat och turismekonomi, jobb och kommunekonomi) gjordes parallellt; alla siffror som blivit poster har jag själv kontrollerat mot källan.
- Egna beräkningar är markerade med *Egen beräkning* i `publisher` eller förklarade i `note_sv`.

## Tidsserier och jämförelser som inte fått egna poster

**Kommersiella gästnätter, Rättvik** (Tillväxtverkets portal): 2018: 261 001 (härlett) · 2019: 281 099 · 2020: 203 421 · 2022: 263 802 (härlett) · 2023: 232 173 · 2024: 225 327 · 2025: 226 773 · jan–aug 2026: 215 980 (+10,9 % mot jan–aug 2025; utländska +18,4 %).

| Period | Gästnätter | Kommentar |
|---|---|---|
| Juni–aug 2019 | 178 305 | 63,4 % av året |
| Juni–aug 2025 | 149 979 | 66,1 % av året; +0,7 % mot 2024 |
| Juli 2025 | 80 487 | 74 % camping, 13 % utländska |
| Augusti 2025 | 38 085 | camping 24 448, hotell 8 029 |
| Dec 2024–mars 2025 | 26 164 | −9,7 % mot vintern innan |

**Gästnätter per invånare (Kolada N45850)**

| År | Rättvik | Leksand | Mora | Orsa | Dalarna | Riket |
|---|---|---|---|---|---|---|
| 2016 | 28,1 | 22,9 | 13,0 | 27,7 | 12,4 | 5,7 |
| 2019 | 25,7 | 22,7 | 15,9 | 26,7 | 13,7 | 6,1 |
| 2020 | 18,4 | 16,1 | 11,0 | 22,7 | 9,7 | 3,8 |
| 2025 | 20,7 | 21,8 | 16,4 | 19,6 | 18,0 | 6,7 |

**Siljanskommunerna 2025** (portal): Rättvik 226 773, Leksand ≈ 352 400, Mora ≈ 335 500, Orsa ≈ 135 100; summa 1 049 756 (2019: 1 151 570). Utländsk andel 15,4 %; största marknader Norge, Tyskland, Nederländerna, Danmark.

**Fritidshus (SCB TAB825, 1 januari)**: Rättvik 2 520 (1998) → 2 902 (2019) → 2 980 (2025). Leksand 4 157, Mora 5 003, Orsa 1 830, Dalarna 46 945, riket 633 861 (2025). Utlandsägda fritidshus i Dalarna 2025 (TAB671, länsnivå): Danmark 125, Norge 312, Tyskland 402, övriga 293. Fritidshuspris (Kolada N07910): Rättvik 19 617 kr/m² 2025 mot riket 29 242.

**SCB:s mobilnätsdata 2022** (tiotal personer: okt–nov / juli / midsommar): Rättvik 1 114 / 1 763 / 2 031 · Leksand 1 612 / 2 398 / 3 539 · Orsa 693 / 935 / 1 255 · Mora 2 067 / 2 513 / 2 966. **Maxdag 2023** i förhållande till årets median: Åsele 6,2, Borgholm 4,5, Sölvesborg 4,3, Sotenäs 3,1, Rättvik 3,0 (29 juli kl. 20), Leksand 2,4 (midsommarafton), Orsa 1,8, Mora 1,3.

**Sysselsatta efter arbetsställe, andel 2024 (SCB BAS via Kolada)**: vård och omsorg 21,2 % · byggverksamhet 11,1 % · utbildning 10,9 % · handel 10,1 % · tillverkning 9,8 % · hotell och restaurang 6,9 % · företagstjänster 7,0 % · kulturella och personliga tjänster 6,6 % · jord- och skogsbruk 5,5 % · offentlig förvaltning 3,6 % · transport 3,1 % · kommun- och regionsektorn sammanlagt 34,5 % (riket 23,3 %).

**Turismräkenskaper Rättvik**: konsumtion 2023: 860 mnkr, 2025: 889 mnkr (utgående turism 387, nettoexport 502); 2019: 915 mnkr i 2025 års priser (utgående 311, nettoexport 604). Turismens förädlingsvärde 2023: 182 mnkr (+14,5 %), varav inkvartering 44,9 %, detaljhandel 22,0 %, restaurang 18,6 %. Andel av BRP inkl. skatter: 8 % (2019), cirka 5,5 % (2020), 6,4 % (2023).

**Dalarna, Visit Dalarnas TEM-modell**: omsättning 7,6 mdkr (2019), 11,1 (2023), 12,0 (2024), 12,6 (2025); årsverken 6 099 (2019), 7 878 (2024), 7 795 (2025); skatteintäkter till kommunerna 942 mnkr och till regionen 494 mnkr (2025; 705 och 369 mnkr 2019); övernattningar i egna fritidshus 4,6 miljoner (2019), 7,1 (2023), 7,3 (2024) och 7,6 miljoner (2025) av totalt 17,4 miljoner turistiska övernattningar 2025. Tillväxtverket: Dalarna 5 150 916 kommersiella gästnätter 2025, 18 per invånare, logiintäkter 2 005 mnkr, 20 % utländska.

**Företagsklimat (Svenskt Näringsliv)**: Rättviks placering 219 (2001), 240 (2009), 31 (2018), 50 (2024), 72 (2025), 65 (2026). Dalarna 2026: Vansbro 35, Orsa 53, Smedjebacken 61, Malung-Sälen 63, Rättvik 65, Leksand 76, Mora 153, Älvdalen 240.

**BRP per invånare 2024 (SCB)**: Rättvik 338 tkr, Leksand 424, Mora 492, Orsa 282, riket 606. BRP per sysselsatt: Rättvik 834 tkr, riket 1 184. Rättvik 2019: 257 tkr per invånare.

## Överlapp med andra ämnesfiler

Jag har medvetet inte gjort egna poster av sådant som redan finns i `kommun-plats-historia.json`, `samhalle-halsa.json` eller `kolada.json`: skattesatsen (kommunen 21,81 % i `kommunalskatt`, totalt 33,80 % i `skattesats_total_2026`; rikssnittet 32,38 %, regionskatten höjdes med 35 öre 2025), årets resultat 326 mnkr och resultatet utan reavinst 1,7 % (`resultat_2025`, `resultat_2025_exkl_reavinst`; utan reavinst 14,8 mnkr), Classic Car Weeks 10 000 bilar och startår 1992 (`ccw_bilar`, `ccw_startar`), Långbryggan, Dalhallas invigning 1995 och Musik vid Siljans start 1969, samt kommunens anställda (1 056 tillsvidareanställda enligt årsredovisningen, 1 060 enligt Kolada N00071).

Två poster här har samma värde som poster i `samhalle-halsa.json`, som skrevs samtidigt: `fritidshus` = `fritidshus_antal` (2 980) och `befolkning_max_faktor` = `sommarbefolkning_topp_faktor` (3,0). Jag behåller dem eftersom fritidshus och sommarbefolkning är kärnan i det här ämnet; vid sammanslagning räcker en av varje. Närliggande poster i andra filer: `bilandel_turistresor` (bilens andel av inhemska turistresor till Dalarna, 91,5 %) och `rv70_adt_juli` (cirka 11 800 fordon per dygn på riksväg 70 en julidag) i `energi-resor.json`; `camping_andel_under_100arsniva` (45 % av Siljanbadets campings yta ligger under Siljans 100-årsnivå) och `vegetationsperiod_2071_2100_rcp45` i `klimat-vatten.json`. Campingen vid stranden ligger alltså på Rättviks lägsta bebyggda mark, samtidigt som camping står för tre av fyra gästnätter i juli.

**Obs:** `naringslivsranking` i `kommun-plats-historia.json` (plats 72) är 2025 års ranking. Svenskt Näringslivs ranking för 2026, publicerad 28 april 2026, ger plats 65 (posten `foretagsklimat_ranking` här).

## Källor

**Tillväxtverket**
- Statistikportalen, Inkvartering och Turismräkenskaper: https://tillvaxtdata.tillvaxtverket.se/statistikportal
  - Gästnätter, överblick: https://tillvaxtdata.tillvaxtverket.se/statistikportal#page=72b01aa0-1d4a-425c-8684-dbce0319b39e
  - Logiintäkter: https://tillvaxtdata.tillvaxtverket.se/statistikportal#page=7804d816-ead0-4160-bdf6-d14ad49d669c
  - Beläggning, bäddar: https://tillvaxtdata.tillvaxtverket.se/statistikportal#page=ca139d0f-82c5-41aa-b7fb-b9213ca6653a
  - Turismräkenskaper, konsumtion: https://tillvaxtdata.tillvaxtverket.se/statistikportal#page=d4ed96a5-165a-428e-a630-64beb42b5fa3
  - Turismräkenskaper, sysselsättning: https://tillvaxtdata.tillvaxtverket.se/statistikportal#page=20ddbfcf-ffb0-4f54-bd13-c923559accc6
  - Turismräkenskaper, förädlingsvärde: https://tillvaxtdata.tillvaxtverket.se/statistikportal#page=a516ca12-7318-43bf-a25e-138052fa8127
- Inkvartering 2025 (s. 7–8, 10, 13): https://tillvaxtverket.se/download/18.7cc6aa6319e368565ec2786e/1779173282252/Inkvartering_2025.pdf
- Turismräkenskaper på läns- och kommunnivå 2025 (s. 6, 17): https://tillvaxtverket.se/download/18.765cee1a19e8cb76dc0c4f23/1780992533356/turismrakenskaper-lans-kommunniva-2025.pdf
- Turismräkenskaper 2025 (s. 3, 10): https://tillvaxtverket.se/download/18.61bf24f419e6366026b5200d/1780039662080/turismrakenskaper-2025.pdf
- Vinterturismen fortsätter att växa (maj 2025): https://tillvaextverket.mynewsdesk.com/pressreleases/vinterturismen-fortsaetter-att-vaexa-visar-ny-statistik-fraan-tillvaextverket-3388916

**SCB**
- Kommunala skattesatser (TAB2017): https://statistikdatabasen.scb.se/api/v2/tables/TAB2017/data?lang=sv&valueCodes%5BRegion%5D=2031&valueCodes%5BTid%5D=2026&valueCodes%5BContentsCode%5D=*&outputFormat=csv
- Fritidshus ägda av fysiska personer eller dödsbon (TAB825): https://statistikdatabasen.scb.se/api/v2/tables/TAB825/data?lang=sv&valueCodes%5BRegion%5D=2031&valueCodes%5BTid%5D=*&valueCodes%5BContentsCode%5D=BO0104AI&outputFormat=csv
- Svensk- och utlandsägda fritidshus per län (TAB671): https://statistikdatabasen.scb.se/api/v2/tables/TAB671/metadata?lang=sv
- BRP per kommun (NR0105ENS2010T06A): https://www.statistikdatabasen.scb.se/pxweb/sv/ssd/START__NR__NR0105__NR0105A/NR0105ENS2010T06A/
- Kort analys "Borta bra men nära bäst för fritidshuset" (2026): https://www.scb.se/hitta-statistik/artiklar/2026/fritidshus-vart-finns-de/ med tabell https://www.scb.se/contentassets/f9fbddfa6dbd40feb71d98c6fd4fd4a3/fritidshus-och-agarspridning-per-kommun-2025.xlsx
- Kort analys "Snart väntas sommarens stora folkförflyttning" (2023): https://www.scb.se/hitta-statistik/artiklar/2023/snart-vantas-sommarens-stora-folkforflyttning/ med tabell https://www.scb.se/contentassets/0a2bcdf10d5d4d44a597d3656257ffa8/kort_analys_kommuntabell.xlsx
- Kort analys "Musik, idrott och bilar drar folk i Sommarsverige" (2024): https://www.scb.se/hitta-statistik/artiklar/2024/musik-idrott-och-bilar-drar-folk-i-sommarsverige/ med tabell https://www.scb.se/contentassets/9d3bc0fe405844a4bd456f057622e940/maxbefolkning-i-relation-till-median-for-aret-per-kommun-2023.xlsx

**Kolada (API v3)** – mönster `https://api.kolada.se/v3/data/kpi/<KPI>/municipality/2031/year/<år>`: N45850, N45851, N07910, N07911, N01951, N00900, N00901, N00902, N03102, N03007, U07453, N02203, N02205, N02210, N02214, N02218, N02220, N02222, N02226, N02228, N02231, N02235, N02237, N02239, N02241.

**Rättviks kommun**
- Årsredovisning 2025 (s. 5, 9, 15, 17, 19–20, 38–40, 45, 50, 69): https://ess-app.rattvik.se/api/download/918ef6a6-3f83-48da-b06c-68eb8b77e9ac/b96a9b6b-0142-43a4-931c-7f44d02749bf.pdf
- Mål och budget 2026–2028 (s. 7, 23, 41, 43): https://ess-app.rattvik.se/api/download/9c6ec099-9e31-4b9a-b4fc-132d4c52195a/3312201d-a8aa-4fcc-b71e-0a6097d18696.pdf
- Kallelse kommunstyrelsen 2026-09-22 (lägesbild brott och otrygghet s. 9 och 112, Åkeriområdet s. 207–208): https://ess-app.rattvik.se/api/download/ad0c2f78-52d7-4d13-928c-a812ba2c5dee/c927daad-27ae-4ee0-9c25-30025fceadca.pdf
- Evenemang: https://www.rattvik.se/uppleva-och-gora/evenemang.html
- Vandringsleder (Siljansleden 34 mil): https://www.rattvik.se/uppleva-och-gora/rattvik-outdoor/vandringsleder.html
- Långbryggan: https://www.rattvik.se/uppleva-och-gora/sevardheter/langbryggan.html
- Siljan Geopark i Rättvik: https://www.rattvik.se/uppleva-och-gora/rattvik-outdoor/siljan-geopark.html
- Dalatravet: https://www.rattvik.se/uppleva-och-gora/evenemang/dalatravet.html
- Turism i Rättvik: https://www.rattvik.se/uppleva-och-gora/turism-att-besoka-rattvik.html
- Jobb och företagande: https://www.rattvik.se/jobb-och-foretagande.html
- Remissvar om turismstrategi 2018: https://www.regeringen.se/contentassets/7235ba0cf25d47f8ac212f9d590e2afc/rattviks-kommun.pdf

**Visit Dalarna**
- TEM 2025 (16 september 2026): https://www.mynewsdesk.com/se/visit-dalarna-ab/pressreleases/dalarnas-besoeksnaering-paa-ny-rekordnivaa-omsaettningen-naadde-126-miljarder-kronor-3467239
- Vintern 2025/26: https://www.mynewsdesk.com/se/visit-dalarna-ab/pressreleases/dalarna-staerker-sin-position-som-vinterdestination-danskar-paa-ny-rekordnivaa-3453156
- Sommaren 2026: https://www.mynewsdesk.com/se/visit-dalarna-ab/pressreleases/stark-sommar-foer-dalarnas-besoeksnaering-positiv-juli-lyfte-utvecklingen-3469793
- Sommaren 2024: https://www.mynewsdesk.com/se/visit-dalarna-ab/pressreleases/utlaendska-gaester-staar-foer-oekat-antal-gaestnaetter-i-dalarna-3346851
- Nytt format och halverad kommunal finansiering: https://www.mynewsdesk.com/se/visit-dalarna-ab/pressreleases/nu-aer-det-klart-visit-dalarna-faar-nytt-format-med-ett-spetsigare-uppdrag-3403955
- Siljan Geopark, förnyad status: https://www.mynewsdesk.com/se/visit-dalarna-ab/pressreleases/siljan-geopark-tar-naesta-steg-nationell-status-saekrad-i-ytterligare-fem-aar-3418603
- Strategi 2030: https://www.besoksnaringdalarna.se/strategi2030-full-pdf
- SVT om rekordåret 2024: https://www.svt.se/nyheter/lokalt/dalarna/fler-turister-an-nagonsin-valjer-dalarna-danskarna-okar-mest

**Evenemang och arrangörer**
- Classic Car Week: https://www.classiccarweek.se/ · verksamhetsberättelser 2022–2025, t.ex. https://www.classiccarweek.com/wp-content/uploads/2014/12/Verksamhetsber%C3%A4ttelse-2025.pdf
- Riksdagsmotion 2018/19:1298: https://www.riksdagen.se/sv/dokument-och-lagar/dokument/motion/underlatta-arrangemang-med-historiska-fordon_H6021298/
- Polisen om CCW 2026: https://polisen.se/aktuellt/nyheter/bergslagen/2026/juli/tillsammans-for-ett-tryggt-och-valkomnande-classic-car-week/
- Dalhalla: https://www.mynewsdesk.com/se/dalhalla/pressreleases/dalhalla-avslutar-saesongen-med-hoegsta-publiksnittet-naagonsin-3466242 · https://www.dalhalla.se/historia/ · https://www.dalhalla.se/om-dalhalla/ · https://www.dalhalla.se/hallbarhet/
- Rättviks marknad, historik: https://rattviksmarknad.nu/historik/
- Folkmusikens hus (Stämmoveckan, Ethno): https://folkmusikenshus.se/folkmhus/om-oss/ · https://folkmusikenshus.se/ethno/

**Nyheter (SVT Dalarna)**
- Polisen om brottsligheten under CCW 2026: https://www.svt.se/nyheter/lokalt/dalarna/polisen-om-brottsligheten-i-under-classic-car-week-ren-misar
- Rekordmånga böter för hög musik: https://www.svt.se/nyheter/lokalt/dalarna/rekordmanga-boter-for-danande-musik-polisen-vara-verktyg-racker-inte-till
- Kommunalrådet efter bilveckan: https://www.svt.se/nyheter/lokalt/dalarna/kommunalradet-efter-bilveckan-blir-valdigt-polariserat
- Kommunen granskar bilveckan inför 2027: https://www.svt.se/nyheter/lokalt/dalarna/efter-kritiken-rattviks-kommun-granskar-bilveckan-vill-ha-forandringar-till-2027
- Handlaren i Vikarbyn: https://www.svt.se/nyheter/lokalt/dalarna/handlaren-i-vikarbyn-vi-dubblar-omsattningen-den-har-veckan
- Spontancruising 2020: https://www.svt.se/nyheter/lokalt/dalarna/kommunalradet-vill-ha-skarpt-lag-mot-hoga-ljudvolymer
- Fridays for Future 2019: https://www.svt.se/nyheter/lokalt/dalarna/fridays-for-future-vill-stoppa-cruisingen-pa-classic-car-week
- Vidablick: https://www.svt.se/nyheter/lokalt/dalarna/musikfestival-och-hotell-har-ar-ideerna-som-kan-ge-vidablick-i-rattvik-nytt-liv
- Bingsjöstämman: https://www.svt.se/kultur/nu-startar-sveriges-storsta-spelmansstamma-bingsjostamman-i-dalarna
- Varsel 60 tjänster: https://www.svt.se/nyheter/lokalt/dalarna/rattviks-kommun-varslar-60-tjanster-det-ar-olyckligt
- Dala Energi och Ellevio: https://www.svt.se/nyheter/lokalt/dalarna/beskedet-miljardaffar-stoppad-ellevio-koper-inte-dala-energi

**Näringsliv och ekonomi**
- Svenskt Näringsliv, kommunrapport 2026: https://www.foretagsklimat.se/rapporter/kommun/rattvik.pdf · https://www.foretagsklimat.se/rattvik
- Ekonomifakta, regional jämförelse: https://www.ekonomifakta.se/regional-jamforelse/rattvik/
- Företagarna, Företagarfakta 2026: https://www.foretagarna.se/contentassets/3b9addad54214736951acde61b75bd68/rattvik.pdf
- Sambygd AB, ägarstruktur: https://mb.cision.com/Public/4197/4265780/a7042af8518c93b3.pdf
- Kolada, kommungrupp "Landsbygdskommun med besöksnäring": https://api.kolada.se/v3/municipality_groups?title=bes%C3%B6ksn%C3%A4ring
- Nittsjö Keramik: https://visitdalarna.se/en/do/shopping/nittsjo-keramik

**Klimat**
- SMHI, Framtidsklimat i Dalarnas län, Klimatologi nr 16 (s. 5, 18, 28, 32, 70, 72): https://www.smhi.se/download/18.18f5a56618fc9f08e832c51b/1717804158612/Klimatologi_16%20Framtidsklimat%20i%20Dalarnas%20l%C3%A4n%20-%20enligt%20RCP-scenarier.pdf
- SMHI, klimatindikator sjöis: https://www.smhi.se/klimat/klimatet-da-och-nu/klimatindikatorer/sjois
- SMHI, Snö i framtida klimat: https://www.lansstyrelsen.se/download/18.8cd5a1b19362fb4fc22cce/1732538237202/Sn%C3%B6%20i%20framtida%20klimat.pdf
- Länsstyrelsen Dalarna, Regional plan för klimatanpassning (2021): https://www.lansstyrelsen.se/download/18.8cd5a1b19362fb4fc22229/1732536934855/Regional%20plan%20f%C3%B6r%20klimatanpassning%20i%20Dalarna.pdf
- Chalmers, Metodrapport Klimatsmart semester v4.0 (tabell 1–5, s. 8, 18, 20): https://research.chalmers.se/publication/541526/file/541526_Fulltext.pdf

## Vad jag inte hittade

- **Antal besökare på Classic Car Week.** Ingen räkning finns, varken hos arrangören, polisen eller kommunen; man talar om "tiotusentals". Det finns ingen turistekonomisk analys av veckan och inga uppgifter om kommunens kostnader. Kommunen utreder om en bredare analys går att göra.
- **Turistekonomisk analys (TEM) för Rättvik eller Siljan.** Den finns bara för Dalarna. Tillväxtverkets experimentella kommunräkenskaper används i stället.
- **Rättviks egna största arbetsgivare med antal anställda.** SCB:s listor kräver en betaltjänst. Bara den största privata (Rättvik Event AB) och kommunen själv finns; Region Dalarnas personal i Rättvik saknas.
- **Campingplatser (tomter) och antal anläggningar** per kommun. Portalens kapacitetsmått gäller bäddar och rum; stugbyar, vandrarhem och förmedlade stugor är sekretesskyddade på kommunnivå.
- **Månadsvärden för alla månader.** Jag har juli, augusti, juni–augusti och december–mars; övriga månader går att läsa i portalens diagram men inte som tal utan nedladdning.
- **Studier om algblomning i Siljan** och dess effekt på turismen hittades inte. Snöprojektioner finns för Runn vid Falun och Särnsjön, inte för Siljansbygden; SMHI:s bilaga med Mora är inte publicerad.
- **Tillväxtverkets eller Naturvårdsverkets nationella siffra för turismens utsläpp per gästnatt.** Chalmers siffra för hotellnatt används i stället.
- **Hur besökarna reser till just Rättvik** (bil, tåg, buss) och hur långt de har rest; bilens andel av inhemska turistresor till Dalarna (91,5 %) finns i `energi-resor.json`.
- **Besökarantal för midsommar** (bara SCB:s mobildata: +82 % närvarande 2022), **Rättviksdansen eller internationell folkdansfestival** (inga aktuella spår, troligen nedlagd), **Bingsjöstämman** ("tusentals") och **Vidablick**.
- **Numeriska mål** i Dalarnas och Sveriges turismstrategier saknas; kommunen har ingen publicerad besöksnärings- eller näringslivsstrategi med siffermål.

## För berättelsen

### Platser och attraktioner
- **Dalhalla** är ett nedlagt kalkbrott, Draggängarna, där man bröt kalk i ett femtiotal år fram till 1990. Margareta Dellefors och kommunens kulturchef Åsa Nyman hittade platsen 1991. Första konserten var den 23 juli 1994 och den officiella invigningen 1995. Brottet mäter 400 × 175 × 55 meter och tar 4 800–6 000 besökare. Publikrekordet är 6 156 personer (KISS, 2023) och årsrekordet 129 000 besökare (2023). Kommunen äger 11 % av Dalhalla Förvaltning AB och 10 % av Rättvik Arena AB; arenan drivs av Rättvik Event AB. Dalhallas kalk finns där för att en meteorit slog ner för cirka 360–380 miljoner år sedan och skapade Siljansringen; källorna anger olika ålder.
- **Långbryggan** är 628 meter lång och byggdes 1895 för ångbåten S/S Rättvik. Den renoverades och invigdes på nytt 1992, delvis finansierad med 2 938 sålda namnplankor.
- **Vidablick**, utsiktstornet från 1898, ägs av en konkursförvaltare sedan ägarbolaget gick i konkurs 2024 och är till salu. En lokal kampanj har samlat nästan 1 200 idéer, från musikfestival till hotell. Kommunen har inga planer på att köpa.
- **Investeringar i besöksmål 2026:** budgeten lägger 8 mnkr på rodelbanan, 7 mnkr på Toppstugan inklusive VA, 2 mnkr på toaletter vid stranden och 0,5 mnkr på Långbryggan (Mål och budget 2026–2028, s. 43).
- **Lokstallarna** från 1890 har rustats och invigdes 2025. Kommunen hyr utställningen Aquanauts i två år från sommaren 2026, och turistinformationen finns nu där (Långbryggevägen 5) och hos Visit Dalarnas InfoPoints.
- **Siljan Geopark** blev Sveriges första nationella geopark 2018/2019. SGU förlängde statusen i november 2025 för fem år, och Mora tar över som värdkommun 2026. Tolv geosites ligger i Rättviks kommun, bland dem Dalhalla, Långbryggan, Vidablick, Styggforsen och Fjäckan.
- **Siljansleden** är 34 mil lång och går runt Siljan för vandring och cykel.
- **Dalatravet**: travtävlingar kördes på Siljans is mellan Långbryggan och kyrkan fram till 1955, då den nuvarande banan invigdes den 13 mars.
- **Visit Dalarna** har sitt huvudkontor i Rättvik. År 2025 halverade länets 15 kommuner sin finansiering till 14,5 mnkr och gav bolaget ett smalare uppdrag med marknadsföring och försäljning.

### Evenemang och historia
- **Classic Car Week** har hållits vecka 31 sedan 1992 (inställd pandemiåret 2020). Arrangören talar om 10 000 bilar på en vecka, och folkparken Rättviksparken är en samlingspunkt med café och barnaktiviteter. Veteranmarknaden omsatte 824 300 kr i avgifter och entréer 2025. Enligt SCB:s mobildata var befolkningen tre gånger den normala på lördagen 2023, sommarens högsta värde.
- **Rättviks marknad** började med ett beslut på kommunalstämman den 18 oktober 1891 om månatliga torgdagar. Redan 1893 klagade kommunalnämndens ordförande på kasperteatrar, skjutbanor och oordning, och marknaden kortades till två gånger om året, i maj och oktober. Det är en historisk parallell till dagens debatt om bilveckan. I dag har den drygt 1 000 stånd och 100 000–120 000 besökare per tillfälle.
- **Musik vid Siljan** startade 1969 och lades ned 2019. Efterföljaren Stämmoveckan i början av juli drivs av Folkmusikens hus och Dalarnas Spelmansförbund. Bingsjöstämman har hållits första onsdagen i juli sedan 1969, i en by med omkring 50 invånare, och SVT kallar den landets största spelmansstämma. Ethno, en internationell folkmusikträff för unga, har funnits sedan 1990.
- **Klimatsignal från isen:** bilveckans vinterdag på Siljans is blev inte av 2022 och 2023, eftersom arrangören tyckte att Siljans isläge blev alltmer osäkert. Den flyttade till Oresjön 2024 och 2025, båda gångerna med mycket vatten på isen. SMHI:s klimatindikator visar att isperioden i vattendistriktet där Siljan ligger har blivit ungefär två veckor kortare jämfört med 1961–1990.

### Lokala debatter
- **Bilveckan delar Rättvik.**
  - Polisen kallade 2026 års vecka "ren misär". Enligt polisen anmäls en femtedel av kommunens brott under ett år den veckan, och 245 personer fick böter för hög musik, mot 89 året innan.
  - Handlaren i Vikarbyn dubblar sin omsättning samma vecka.
  - Kommunstyrelsens ordförande Ulrica Momqvist (C) beskriver frågan som polariserad. Kommunen ska tala med arrangörerna av Classic Car Week och Classic Kalaset och vill ha förändringar till 2027.
  - Arrangören klagar själv på besökare som bara kommer för att köra, spela hög musik och skräpa ner.
  - Redan pandemiåret 2020, när veckan var inställd, kom spontancruisingen ändå, och kommunalrådet ville ha skarpare lag mot hög musik från bilar.
  - Fridays for Future krävde 2019 att cruisingen skalades ned med hänvisning till kommunens mål om fossilfria transporter 2030.
- **Kommunens ekonomi.**
  - Socialförvaltningen varslade cirka 60 tjänster i äldreomsorg och LSS 2025 för att spara 25 mnkr.
  - Utan reavinsten från Dala Energi blev resultatet 2025 bara 14,8 mnkr, under målet 2 %.
  - Pengarna från Dala Energi gick till att köpa cirka 10 % av el- och fibernätsbolaget Sambygd AB, där Nordion Energi äger 51 %. Rättvik, Leksand och Gagnef sa nej till Ellevios bud på Dala Energi 2024.
  - Ett förslag från Finansdepartementet om kostnadsutjämningen kan kosta kommunen 8,5 mnkr i intäkter från utjämningssystemet.
- **Besöksnäringen är kommunens största privata näring**, enligt kommunen själv. Den största privata arbetsgivaren är Dalhallas driftbolag, med upp till 400 personer på lönelistan per säsong. Kommunen räknas till SKR:s kommungrupp "Landsbygdskommun med besöksnäring" tillsammans med bland andra Leksand, Mora, Orsa, Älvdalen, Malung-Sälen och Åre.

### Beslut framför oss
- Budgeten och skattesatsen för 2027 och planen för 2027–2029 ska beslutas av den nya fullmäktigeförsamlingen efter valet den 13 september 2026. Budgeten för 2026–2028 planerar resultat på 18, 20,6 och 21,2 mnkr.
- Bilveckan 2027: kommunens granskning, samtal med arrangörerna och en eventuell bredare konsekvensanalys.
- Vidablicks framtid och om någon köper anläggningen ur konkursboet.
- Kommunen planerar att sälja industritomter i Åkeriområdet vid länsväg 301 och dra ut VA dit.
- En ny näringslivsenhet byggs upp, och ett lokalt attraktionsråd med kommun, civilsamhälle och näringsliv har börjat. Kommunen har lämnat över arbetet med Furudal 2.0 till en annan aktör, efter en förstudie om grön industri.
- Klimatanpassning av turismen. Länsstyrelsens regionala plan (med stöd i Klimat- och sårbarhetsutredningen, SOU 2007:60) bedömer att sommarturismen troligen gynnas av ett varmare klimat medan vinterturismen drabbas hårdare. Planen kallar konstsnö energikrävande och pekar på helårsaktiviteter som vandring, cykel och kanot.

### Siffror som berättar
- **En tredjedel av året på en månad:** juli 2025 hade 80 487 gästnätter, 35 % av årets totalt 226 773; tre av fyra av julis gästnätter var på camping.
- **Lördagen då Rättvik tredubblas:** 29 juli 2023 klockan 20 fanns cirka tre gånger så många människor i kommunen som en vanlig dag.
- **Sommarstaden:** i juli 2022 var cirka 6 500 fler personer i Rättvik än i november, +58 %.
- **Fritidshusen:** 2 980 fritidshus, 27 per 100 invånare (riket 6). Drygt fyra av fem ägs av personer som inte bor i kommunen, och ägarna kommer från 160 kommuner.
- **Besökarna spenderar** cirka 81 000 kr per invånare och år, 1,7 gånger rikssnittet, men det ger bara 186 årsarbetskrafter. Logiintäkterna är 80 mnkr av de 889 mnkr som besökarna spenderar.
- **Tappet sedan 2019:** Rättvik har 19 % färre kommersiella gästnätter än 2019, medan Siljanskommunerna tillsammans har 9 % färre. Utanför sommaren är tappet 25 %.
- **Campingen tar över:** campingens andel av gästnätterna steg från 38 % (2019) till 53 % (2025).
- **Snön:** nära Falun minskar dagarna med bra skidföre från cirka 90 till under 40 per år till slutet av seklet med måttliga utsläpp; vegetationsperioden runt Siljan kan bli 7 månader i stället för 5.
- **Resan väger tyngst:** 100 mil med fossilbil ger 76 kg CO2e per person, en veckas hotellboende 26 kg och samma resa med tåg 7 kg.
- **Företagarkommunen:** 16 % av de sysselsatta är företagare (plats 29 av 290), och småföretagen har 46 % av jobben.
