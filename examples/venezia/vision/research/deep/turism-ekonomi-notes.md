# Turism och ekonomi – forskningsanteckningar (Venezia 2126)

Ämne: `turism-ekonomi` · sammanställt 2026-10-11 · 58 poster i `turism-ekonomi.json` (engelska i `turism-ekonomi.en.json`). Alla id börjar med `tur_`.

## Kort för modellen

| Vad | Värde | År | Post |
|---|---|---|---|
| Gästnätter, hela kommunen | 12 925 741 (2019: 12 948 519; 2020: 3 557 036) | 2025 | `tur_presenze_comune_2025`, `_2019`, `_2020` |
| Gästnätter, historiska staden med öarna | 9 376 638 (2019: 8 817 623; 2020: 2 534 368) | 2025 | `tur_presenze_cs_2025`, `_2019`, `_2020` |
| Ankomster, historiska staden | 3 980 264 | 2025 | `tur_ankomster_cs_2025` |
| Utländsk andel av gästnätterna (cs) | 88,9 % | 2025 | `tur_utlandska_andel_presenze_cs` |
| Genomsnittlig vistelse (cs) | 2,36 nätter | 2025 | `tur_medelvistelse_cs` |
| Korttidsuthyrningens andel av ankomsterna (cs) | 31,5 % (2019: 19,4 %) | 2025 | `tur_korttidsuthyrning_andel_ankomster_cs` |
| Turistbäddar (cs) | 70 241, varav 42 011 i korttidsuthyrning | 2025 | `tur_baddar_cs` |
| Turistbäddar per invånare (cs) | 1,29 (1,47 mot sestieri + Giudecca) | 2025 | `tur_baddar_per_invanare_cs` |
| År då bäddarna passerade invånarna | 2023 (OCIO) | 2023 | `tur_baddar_fler_an_invanare_ar` |
| Övernattande gäster per natt (cs) | 25 689 i snitt, cirka 31 500 i oktober | 2025 | `tur_gaster_per_natt_cs` |
| Gästnätter per invånare (kommunen) | 51,4 (cs: 172) | 2025 | `tur_presenze_per_invanare` |
| Hotellbeläggning (brutto) | 56,4 % (2019: 66,0 %) | 2025 | `tur_belaggning_hotell` |
| Största månaden (cs) | oktober 975 072 gästnätter, januari 436 267 | 2025 | `tur_toppmanad_presenze_cs` |
| Dagsbesökare per dag (mobildata) | 61 461 (plus 32 339 övernattande) | 2022 | `tur_dagsbesokare_per_dag_2022` |
| Största dagen | 143 246 besökare (30 okt 2022) ≈ 3 per invånare | 2022 | `tur_besokare_toppdag_2022` |
| Dagsbesökare per år (bedömning) | cirka 22 miljoner (1988: 5 miljoner) | c. 2019 | `tur_dagsbesokare_per_ar` |
| Bärkraft enligt modellstudie | 52 111 besökare per dag | 2020 | `tur_barkraft_per_dag` |
| Inträdesavgift: betalningar | 485 062 (29 dagar) → 723 497 (54) → 679 553 (60) | 2024–2026 | `tur_cda_betalningar_2024`, `_2025`, `_2026` |
| Inträdesavgift: betalande per dag | 16 676 → 13 046/13 398 → 11 326 | 2024–2026 | `tur_cda_snitt_per_dag_2026` |
| Dagar med ≥ 20 000 betalande | 4 → 3 → 1 | 2024–2026 | `tur_cda_dagar_over_20000` |
| Intäkt inträdesavgift | 5,44 mn € (2024: 2,43) | 2025 | `tur_cda_intakter_2025` |
| Turistskatt (imposta di soggiorno) | 38,7 mn € | 2025 | `tur_imposta_soggiorno_2025` |
| Kommunens löpande intäkter | 871,8 mn € | 2025 | `tur_kommunens_lopande_intakter` |
| Turistskatt + inträdesavgift, andel | 5,1 % | 2025 | `tur_turistskatter_andel_intakter` |
| Kasinots spelintäkter | 117,7 mn € brutto, 20,1 mn netto | 2025 | `tur_kasino_spelintakter` |
| Kryssningspassagerare | 1 611 341 → 572 471 | 2019 → 2025 | `tur_kryssning_2019`, `tur_kryssning_2025` |
| Konstbiennalen | 702 741 besökare | 2024 | `tur_biennale_konst_2024` |
| Dogepalatset / San Marco-komplexet | 1 355 689 / 2 387 995 | 2025 | `tur_dogepalatset_besokare`, `tur_san_marco_basilika_besokare` |
| Accademia / Guggenheim | 309 202 (2024) / 342 890 | 2024–2025 | `tur_accademia_besokare`, `tur_guggenheim_besokare` |
| Sysselsatta i företagen | 113 676 | 2022 | `tur_sysselsatta_foretag` |
| Hotell och restaurang: andel jobb / förädlingsvärde | 18,1 % / 13,0 % (Italien 8,9 % / 4,0 %) | 2022 | `tur_sysselsatta_hotell_restaurang_andel`, `tur_hotell_restaurang_andel_foradlingsvarde` |
| Handel / tillverkning: andel jobb | 16,3 % / 8,7 % | 2022 | `tur_sysselsatta_handel_andel`, `tur_sysselsatta_tillverkning_andel` |
| Beskattningsbar inkomst per skattebetalare | 27 108 € (Veneto 25 885, Italien 24 893) | 2024 | `tur_inkomst_per_skattebetalare` |
| Arbetslöshet / ungdomsarbetslöshet (provinsen) | 4,6 % / 24,7 % | 2025 | `tur_arbetsloshet_provins`, `tur_ungdomsarbetsloshet_provins` |
| Gods i hamnen | 25,3 miljoner ton, 532 778 TEU | 2025 | `tur_hamn_gods` |
| Porto Marghera, sysselsatta | 32 980 (1965) → 11 826 (2018) | 1965, 2018 | `tur_marghera_sysselsatta_1965`, `_2018` |
| Studenter | Ca' Foscari 18 900 + Iuav 4 951 | 2025/26 | `tur_studenter_cafoscari`, `tur_studenter_iuav` |
| Murano | 64 ugnar (2024); 928 sysselsatta (2025) mot 3 142 (1971) | 2024–2025 | `tur_murano_ugnar`, `tur_murano_sysselsatta`, `tur_murano_sysselsatta_1971` |
| Gondoljärer | 433 auktoriserade | 2026 | `tur_gondoljarer_auktoriserade` |
| Butiker | souvenirer 10,4 % av detaljhandeln (2021); vardagsbutiker 720 → 276 (1976–2007); 1,6 presentbutiker per matbutik i modellområdet (OSM) | 2007–2026 | `tur_souvenirbutiker_andel`, `tur_vardagsbutiker_2007`, `tur_osm_presentbutiker_per_matbutik` |

**Viktigt om avgränsningar.** Turiststatistikens ”centro storico” (Città storica) omfattar de mindre öarna (Murano, Burano, Torcello m.fl.); Lido-området omfattar Pellestrina. Det motsvarar municipaliteten Venezia-Murano-Burano (54 480 invånare 2025), inte det snävare ”centro storico” i befolkningsstatistiken (sestieri och Giudecca, 47 625). Inträdesavgiften gäller bara Città antica, inte öarna.

## Metod

- **Turiststatistiken** kommer från kommunens egna årsböcker, som bygger på regionens statistikkontor (ISTAT-standarden C/59 och CTT/4): *Annuario del turismo dati 2025* (publicerad 7 oktober 2026, 179 s.), *Yearbook of Tourism data 2024* (engelska, 187 s.) för 2019 och för hamn- och flygtabeller, och *Annuario del Turismo dati 2020* för pandemiåret i centro storico. Alla PDF:er lästes i minnet med pypdf (hämtade med curl och projektets User-Agent); inga filer sparades. Bäddarna avser boenden som varit öppna minst en dag under året; ”locazioni turistiche” omfattar även uthyrning över 30 dagar och en bostad kan räknas flera gånger om den registrerats om.
- **Befolkningen** för kvoterna kommer från kommunens tabell över befolkning per kvarter och municipalitet 2015–2025 (bilaga till svar på en fullmäktigefråga) och från revisorernas rapport om bokslutet 2025 (251 294 invånare 31 december 2025). Befolkning är egentligen ett annat ämne (se `com_folkmangd_*` i `kommun-plats-historia.json`); här används siffrorna bara i nämnare.
- **Inträdesavgiften**: kommunens preliminära rapport för 2025 (originalfilen på live.comune.venezia.it ger nu 404; läst ur Internet Archives kopia från 2 augusti 2025), som också jämför med 2024; kommunens pressmeddelanden 4 augusti 2025 och 26 juli 2026; den slutliga sammanställningen för 2026 hittade jag bara som VeneziaToday:s återgivning av kommunens siffror (därför `medium`). Intäkterna är tagna ur bokslutet 2025.
- **Kommunens ekonomi**: bokslutet 2025 (fullmäktigebeslut nr 42, 23 april 2026) – presentationsdokumentet med tabeller över skatteintäkter, kasinot och TARI, verksamhetsberättelsen och revisorernas rapport; budgetpresentationen för 2025–2027 (”Il modello Venezia”).
- **Jobb och förädlingsvärde**: ISTAT:s *Frame SBS territoriale* 2022, tabellerna per huvudort (tav. 22–38), som ger sysselsatta, löner och förädlingsvärde per ATECO-sektion för kommunen. Zip- och xlsx-filerna lästes i minnet med Pythons zipfile/XML utan att sparas. Italiens och Venetos andelar är summerade ur provinstabellerna (tav. 5 och 7–21), därav `estimate`. Ramen täcker företagen, inte offentlig förvaltning, jordbruk och finans.
- **Inkomster**: MEF:s kommunfil över IRPEF för inkomståret 2024 (CSV i zip, läst i minnet); medelvärdena är egna kvoter (summa beskattningsbar inkomst / antal med beskattningsbar inkomst), också för Veneto och Italien.
- **Arbetslöshet**: ISTAT:s SDMX-API (dataflödet 151_914_DF_DCCV_TAXDISOCCU1_8; Venedigs provins har koden ITD35, Veneto ITD3).
- **Hamnen**: hamnmyndighetens (AdSP) bokslut 2025, presidentens berättelse; kryssningsserien ur kommunens årsböcker (källa AdSP/VTP).
- **Porto Marghera**: kommunens kartläggning per 31 december 2018 (juli 2019). Serien 1925–2018 finns bara som diagram; värdena lästes av ur diagrammets dataetiketter i PDF-visaren (Chrome), utan att filen sparades.
- **Universiteten**: universitetsministeriets statistikkontor (USTAT, CSV ”iscritti per ateneo”); Iuavs personal ur dess ANVUR-indikatorer.
- **Studier** (bara där primärkällor saknas): Bertocchi, Camatti, Giove och van der Borg (2020) om bärkraft och dagsbesökare; Baldin, Bertocchi och Camatti (Tourism Economics 2025) om mobildata, via il Resto del Carlino eftersom artikeln är låst; Catalanotti (2023) om butiker; Insula Quaderni om Murano.
- **Modellområdet**: egna räkningar i projektets OSM-uttag (`cities/venezia/osm.json`) för butiker, hotell och restauranger inom bboxen S 45,426915 / W 12,325979 / N 45,443085 / E 12,349021, samt koordinater för platserna nedan (byggnadernas mittpunkt).
- **Praktiskt**: kommunens webbplats låg först bakom Impervas bot-skydd med en CAPTCHA, som jag inte löste; PDF:erna under /sites/… gick ändå att hämta direkt, och senare öppnades HTML-sidorna i Chrome utan kontroll. Sessionens gemensamma webbsökningskvot tog slut halvvägs; resten hittades via kända primärsidor (kommunens egen sökning i webbläsaren, ISTAT-, MEF- och USTAT-gränssnitten). Egna beräkningar är markerade `estimate` med räkningen i anteckningen.

## Tidsserier och jämförelser som inte fått egna poster

**Gästnätter och ankomster, hela kommunen** (Annuario 2025 tab. 1–2):

| År | Ankomster | Gästnätter | Nätter/ankomst |
|---|---|---|---|
| 1949 | 457 498 | 1 389 831 | |
| 1960 | 1 000 912 | 2 411 309 | |
| 1980 | 1 970 761 | 4 047 724 | |
| 2000 | 2 748 614 | 5 909 236 | |
| 2015 | 4 495 857 | 10 182 829 | 2,26 |
| 2019 | 5 523 283 | 12 948 519 | 2,34 |
| 2020 | 1 337 626 | 3 557 036 | 2,66 |
| 2021 | 2 120 894 | 5 727 887 | 2,70 |
| 2022 | 4 646 360 | 10 946 464 | 2,36 |
| 2023 | 5 664 611 | 12 628 079 | 2,23 |
| 2024 | 5 876 797 | 13 290 973 | 2,26 |
| 2025 | 5 858 665 | 12 925 741 | 2,21 |

**Historiska staden med öarna** (tusental; Annuario 2025 tab. 14–16, Yearbook 2024 tab. 1.15–1.17): ankomster 3 515 (2019), 923 (2020), 1 513 (2021), 3 202 (2022), 3 817 (2023), 3 910 (2024), 3 980 (2025); gästnätter 8 818, 2 534, 4 142, 7 978, 9 092, 9 433, 9 377. Lido hade 345 062 gästnätter och fastlandet 3 204 041 år 2025.

**Månader i centro storico 2025** (gästnätter): jan 436 267 · feb 539 416 · mar 685 082 · apr 898 877 · maj 929 846 · jun 913 128 · jul 942 427 · aug 927 937 · sep 901 451 · okt 975 072 · nov 616 680 · dec 610 455.

**Bäddar i centro storico** (Annuario 2025 tab. 56, Yearbook 2024 tab. 5.10): 2019: 19 972 hotell + 39 401 övriga = 59 373 · 2021: 53 578 · 2022: 56 734 · 2023: 60 638 · 2024: 65 534 · 2025: 20 896 + 49 345 = 70 241. Hela kommunen 91 556 (466 hotell, 10 387 övriga boenden, varav 9 596 korttidsuthyrda bostäder med 42 181 bäddar).

**Flyg, kollektivtrafik och biljetter** (överlapp med energi-resor): Marco Polo 11 850 336 passagerare och Treviso 3 200 130 år 2025; ACTV/AVM sålde 8 196 863 turistbiljetter 2024, varav 1 474 503 dygnsbiljetter (−16 % mot 2019); Venezia Unica-portalen sålde för 25,1 miljoner euro 2024.

**Kultur 2025**: Fondazione Musei Civici 2 393 315 besökare; kampanilen 567 419; Venedigpaviljongen på arkitekturbiennalen 102 211; Le stanze del vetro (Fondazione Cini, San Giorgio) 68 459 (2024); M9 i Mestre cirka 62 000 (2024).

**Inträdesavgiften, detaljer**: 2025 betalades 65 % via cda.ve.it och 22,5 % i Velas biljettkontor; lördagar 14 997 i snitt mot fredagar 12 267 och söndagar 12 237. Undantagna 2025 i snitt per dag: hotellgäster 36 639, arbetande 4 463, utboende fastighetsägare 3 119, hyresgäster 1 054, släktingar 1 404, inbjudna 1 645. Kommunen budgeterade 700 000 euro för 2024 och 7 miljoner för 2025 (enligt en fullmäktigefråga). Juridisk grund: budgetlagen 145/2018 art. 1 c. 1129, ”senza vettore” genom DL 228/2021, kommunens reglemente (fullmäktigebeslut nr 51, 12 september 2023).

**Inkomster (MEF, beskattningsbar inkomst per deklarant med sådan inkomst)**: Venedig 23 482 (2019), 25 998 (2023), 27 108 (2024); Veneto 21 888 / 24 902 / 25 885; Italien 20 991 / 23 949 / 24 893. Andra huvudorter 2024: Milano 40 237, Treviso 31 717, Padova 31 270, Roma 31 223, Firenze 30 016, Verona 28 660. Pensionsinkomsten per pensionär i Venedig 25 298 mot 22 171 i Veneto (egna kvoter).

**Arbetslöshet 15–74 år, Città metropolitana di Venezia (ISTAT)**: 6,5 % (2018), 6,0 (2019), 6,2 (2020), 6,0 (2021), 4,2 (2022), 4,4 (2023), 3,9 (2024), 4,6 (2025).

**Sysselsatta i företagen i kommunen 2022 per ATECO-sektion** (ISTAT tav. 24–38): hotell och restaurang 20 617 · handel 18 518 · transport 14 296 · företagstjänster (N) 13 340 · konsulter och fria yrken (M) 10 131 · tillverkning (B–C) 9 876 · bygg 7 004 · IT och media 4 415 · vård (privat) 4 192 · kultur och nöje 2 917 · avfall och vatten 2 686 · övriga tjänster 2 247 · fastigheter 2 126 · energi 803 · utbildning (privat) 508.

**Porto Marghera** (kommunens serie): sysselsatta 3 440 (1925), 5 100 (1930), 10 120 (1935), 17 300 (1940), 15 700 (1945), 22 500 (1950), 25 300 (1955), 30 200 (1960), 32 980 (1965), 31 000 (1970), 30 680 (1975), 29 000 (1980), 23 000 (1985), 18 814 (1990), 12 958 (1998), 12 727 (2000), 12 404 (2005), 13 198 (2010), 10 060 (2014), 11 826 (2018). Företag: 33 (1925), 229 (1965), 303 (1990), 728 (2010), 915 (2018).

**Studenter (USTAT)**: Ca' Foscari 21 121 (2019/20) → 18 900 (2025/26); Iuav 3 935 → 4 951.

## Överlapp med andra ämnesfiler

- `energi-resor.json` (skriven samtidigt): `en_kryssning_passagerare` (584 284 år 2025 enligt AdSP:s trafikstatistik) mot min `tur_kryssning_2025` (572 471 enligt kommunens årsbok, samma ursprungskälla men annan avgränsning; AdSP:s bokslut anger 617 454 kryssningsrörelser) – båda har 2019 = 1 611 341. `en_gondol_licenser` (440 licenser enligt reglementet 2020) kompletterar min `tur_gondoljarer_auktoriserade` (433 aktiva enligt EFE). `en_dagsbesokare_avgift` (13 046 betalande per dag 2025) hör ihop med mina `tur_cda_*`. `en_flygplats_passagerare`, `en_ankomster_knutpunkt_per_dag` (cirka 100 000 personer en vanlig vardag via Piazzale Roma–Tronchetto–Santa Lucia) och `en_bioraffinaderi_kapacitet` (Enis bioraffinaderi i Porto Marghera sedan 2014) har jag inte gjort egna poster av.
- `kommun-plats-historia.json`: `com_cda_betalningar_2024` och `com_cda_betalningar_2025` har samma värden som mina `tur_cda_betalningar_2024/2025`, och `com_cda_dagar_2026` (60) finns där – jag har därför ingen egen post för antalet dagar 2026. `com_cda_intakt_2025` (5 421 425 € enligt kommunens sammanställning) skiljer sig från min `tur_cda_intakter_2025` (5,44 miljoner enligt bokslutet). `com_studenter` (cirka 28 000 enligt VSF, odaterat) är större än USTAT:s 23 851, som bara räknar examensprogram. `com_porto_marghera_anstallda` (cirka 35 000 i början av 1960-talet enligt regionen) avviker från kommunens serie (30 200 år 1960, toppen 32 980 år 1965); skillnaden beror troligen på avgränsning och källa. `com_kryssningsfartyg_grans` (25 000 GT, DL 103/2021) och `com_korttidsuthyrning_grans` (120 dagar) är regler som mina poster bygger på.
- Vid sammanslagning räcker en post av varje dubblett.

## Källor

**Comune di Venezia – turism**
- Annuario del turismo dati 2025: https://www.comune.venezia.it/sites/comune.venezia.it/files/documenti/Turismo/Annuario_2025.pdf
- Yearbook of Tourism data 2024: https://www.comune.venezia.it/sites/comune.venezia.it/files/documenti/Turismo/Annuario_2024_ENG.pdf
- Annuario del Turismo dati 2020: https://www.comune.venezia.it/sites/comune.venezia.it/files/immagini/Turismo/Annuario%20Turismo%20dati%202020_03_30_web.pdf
- Tourist Report – Daily estimate of visitors (kalendersida 2020): https://www.comune.venezia.it/en/content/tourist-report-daily-estimate-visitors-venice

**Comune di Venezia – inträdesavgiften**
- Presskonferens 24 oktober 2024 (kalender 2025, regler, CISET:s första slutsatser): https://cda.ve.it/data/files/ConferenzaStampa24Ottobre2024.pdf
- Primi risultati 2025 (provvisori), Internet Archive-kopia: https://web.archive.org/web/20250802151606/https://live.comune.venezia.it/sites/live.comune.venezia.it/files/articoli/allegati/CDA_report2025.pdf
- Contributo di accesso: i numeri del 2025 (4 augusti 2025): https://live.comune.venezia.it/it/2025/08/contributo-di-accesso-i-numeri-del-2025
- Contributo di accesso: terminata la sperimentazione 2026 (26 juli 2026): https://live.comune.venezia.it/it/2026/07/contributo-di-accesso-oggi-si-e-chiusa-la-sperimentazione-2026
- VeneziaToday, Contributo d'accesso, i dati 2026: https://www.veneziatoday.it/attualita/contributo-d-accesso-i-dati-2026-11-mila-paganti-al-giorno-il-46-ha-prenotato.html
- Fullmäktigefråga nr 902 (budget 700 000 € 2024, 7 mn € 2025): https://consiglio2020.comune.venezia.it/pdf/atti_ispettivi/1/912_interrogazione_902.pdf

**Comune di Venezia – ekonomi, befolkning, handel**
- Rendiconto di gestione 2025 (sida med alla bilagor): https://www.comune.venezia.it/it/content/rendiconto-gestione-2025
- Documento di presentazione del Rendiconto 2025: https://www.comune.venezia.it/sites/comune.venezia.it/files/documenti/Bilancio/documento%20presentazione%20Rendiconto%202025.pdf
- Relazione sulla gestione 2025: https://www.comune.venezia.it/sites/comune.venezia.it/files/documenti/Bilancio/DC_2026_42_022_4881_relazione%202025.pdf
- Revisorernas rapport om bokslutet 2025: https://www.comune.venezia.it/sites/comune.venezia.it/files/documenti/Bilancio/DC_2026_42_017_4876_2026_03_05_Relazione_rendiconto_2025%20-signed_signed_2.pdf
- Bilancio di previsione 2025–2027 – Il ”modello” Venezia: https://dam.comune.venezia.it/api/resource/e8466f6c-c192-4e7a-bdc8-f708c9048fa7
- Befolkning per kvarter 2015–2025: https://consiglio2020.comune.venezia.it/allegati/atti_ispettivi/risposte_1/895_variazioni_2015-2025etamedia.pdf (frågan: https://consiglio2020.comune.venezia.it/pdf/atti_ispettivi/1/1399_interrogazione_1337.pdf)
- Porto Marghera, Indagine conoscitiva al 31.12.2018: https://www.comune.venezia.it/sites/comune.venezia.it/files/documenti/progetti_strategici/report_2019_31072019_DW.pdf
- Tolkning av fullmäktigebeslut nr 26/2022 om handeln i centrum: https://www.comune.venezia.it/sites/comune.venezia.it/files/page/files/PG2023-241131_Disp_interpretat_DCC26-22.pdf
- Kontroller av korttidsuthyrning (23 augusti 2026): https://live.comune.venezia.it/it/2026/08/venezia-e-murano-controlli-tappeto-sulle-locazioni-turistiche-sanzioni-oltre-6000-euro

**ISTAT, MEF, MUR**
- Frame SBS territoriale 2022 (sida och tabeller): https://www.istat.it/tavole-di-dati/risultati-economici-delle-imprese-e-delle-multinazionali-a-livello-territoriale-anno-2022 · https://www.istat.it/wp-content/uploads/2024/12/Tavole-1.zip
- Arbetslöshet per provins (SDMX): https://esploradati.istat.it/SDMXWS/rest/data/IT1,151_914_DF_DCCV_TAXDISOCCU1_8,1.0/A.ITD35+ITD3+IT.UNEM_R.9.Y15-74.99.TOTAL.TOTAL/?startPeriod=2018&endPeriod=2025 (unga: samma med Y15-24)
- MEF, IRPEF per kommun, inkomståret 2024: https://www1.finanze.gov.it/finanze/analisi_stat/public/v_4_0_0/contenuti/Redditi_e_principali_variabili_IRPEF_su_base_comunale_CSV_2024.zip (även filerna för 2019 och 2023)
- USTAT, iscritti per ateneo: https://dati-ustat.mur.gov.it/dataset/3dd9ca7f-9cc9-4a1a-915c-e569b181dbd5/resource/32d26e28-a0b5-45f3-9152-6072164f3e63/download/02_iscrittixateneo.csv
- Iuav, ANVUR-indikatorer 2025: https://www.iuav.it/sites/default/files/2025-12/Ateneo_indicatori_ANVUR_04.10.2025.pdf

**Hamnen**
- AdSP Mare Adriatico Settentrionale, Rendiconto generale 2025, Relazione del Presidente: https://trasparenza.port.venice.it/wp-content/uploads/2026/04/260429-DEL-006-RENDICONTO-GENERALE-2025_ALLEGATO_PARTE-II-RELAZIONE-PRESIDENTE.pdf

**Studier**
- Bertocchi, Camatti, Giove, van der Borg (2020), Sustainability 12(2) 512: https://www.mdpi.com/2071-1050/12/2/512
- Baldin, Bertocchi, Camatti (2025), Crowding-in and (temporary) crowding-out in Venice, Tourism Economics 31(5) 984–1005, doi 10.1177/13548166241233773 (låst; referat: https://ideas.repec.org/a/sae/toueco/v31y2025i5p984-1005.html; siffrorna via il Resto del Carlino: https://www.ilrestodelcarlino.it/venezia/economia/fuga-residenti-eventi-turismo-mm7xlphe)
- Catalanotti (2023), European Spatial Research and Policy 30(1): https://czasopisma.uni.lodz.pl/esrap/article/download/13455/21509/50345
- Insula Quaderni n. 19, Murano isola del vetro: https://www.insula.it/images/pdf/resource/quadernipdf/Q19-04.pdf

**Nyheter och övrigt**
- Open, bäddarna passerar invånarna (11 september 2023): https://www.open.online/2023/09/11/venezia-turisti-posti-letto-unesco/
- Il Post, ny räknare för turistbäddar (18 april 2023): https://www.ilpost.it/2023/04/18/venezia-contatore-posti-letto-turisti/
- ANSA via Espansione TV (18 december 2023): https://www.espansionetv.it/2023/12/18/venezia-i-posti-letto-dei-turisti-sorpassano-i-residenti
- LaPresse, OCIO-protest (16 juni 2025): https://www.lapresse.it/cronaca/2025/06/16/venezia-protesta-degli-attivisti-di-ocio-contro-il-turismo-di-massa/
- Il Post, slutet på försöket 2024: https://www.ilpost.it/2024/07/15/venezia-fine-sperimentazione-contributo-di-accesso/
- Il Post, turistskatten i kommunerna (20 januari 2025): https://www.ilpost.it/2025/01/20/la-tassa-di-soggiorno-piace-molto-ai-comuni/
- Il Post, borgmästaren vill ha 30–50 euro (19 juni 2026): https://www.ilpost.it/2026/06/19/venezia-contributo-ingresso-ticket-simone-venturini-sindaco-50-euro/
- Forbes Italia, Muranos glasdistrikt (26 februari 2024): https://forbes.it/2024/02/26/murano-viaggio-scoperta-distretto-veneziano-vetro/
- Teleborsa, Banca Ifis om Muranoglas (9 september 2026): https://www.teleborsa.it/News/2026/09/09/banca-ifis-il-vetro-di-murano-genera-288-milioni-di-euro-e-guarda-all-export-129.html
- Última Hora (EFE), nya gondoljärer (oktober 2026): https://www.ultimahora.com/venecia-en-la-busqueda-de-nuevos-gondoleros
- La Capital (EFE), kvinnliga gondoljärer: https://www.lacapitalmdp.com/venecia-tendra-cuatro-gondoleras-12-anos-despues-de-la-primera/
- bluewin (dpa), gondoltaxor 2024: https://www.bluewin.ch/en/news/venice-is-looking-for-new-gondoliers-for-canal-trips-2341728.html
- Apollo Magazine, gondolvarven (2021): https://apollo-magazine.com/?p=960397
- Dream of Italy, The Last Gondola Makers of Venice: https://dreamofitaly.com/The-Last-Gondola-Makers-of-Venice
- Finestre sull'Arte, Fondaco dei Tedeschi stänger: https://www.finestresullarte.info/attualita/venezia-chiude-fondaco-tedeschi
- Europe for Visitors (sekundär, användes bara för att hitta 2024 års årsbok): https://europeforvisitors.com/venice/articles/venice-tourism-statistics.htm
- OpenStreetMap, modellområdet: https://www.openstreetmap.org/?minlon=12.325979&minlat=45.426915&maxlon=12.349021&maxlat=45.443085

## Vad jag inte hittade

- **Karnevalens besökare.** Ingen officiell räkning finns i årsböckerna eller i kommunens pressmeddelanden som jag hann läsa; Smart Control Room publicerar inga öppna dagsdata. Mobildatastudien (Baldin m.fl.) analyserar karnevalen men siffran per dag finns bara i den låsta artikeln.
- **Officiell räkning av dagsbesökare per år.** Bara bedömningar (22 miljoner per år; 53 000 per dag 2019) och mobildatastudien för 2022. Inträdesavgiftens data täcker bara betalande på avgiftsdagar.
- **Kommunens största arbetsgivare med antal anställda.** Ingen sammanställd lista hittades. Kända storheter: kommunen själv (personalkostnad 114,7 miljoner euro 2025; 2 582 anställda gick minst en utbildning 2025 – det verkliga antalet anställda framgår inte), sjukvården ULSS 3 Serenissima, transportbolaget AVM/ACTV, Ca' Foscari, Iuav (172 lärare och 241 i administration), kasinot, flygplatsbolaget och industrin i Porto Marghera. Fondaco dei Tedeschis lyxvaruhus vid Rialto stängde 2025 med 226 anställda. Den offentliga sektorns andel av jobben saknas eftersom ISTAT:s företagsram utesluter den.
- **Turismens andel av den lokala ekonomin enligt en turistekonomisk studie** (satellitkonto) för kommunen. Jag använder ISTAT:s företagsdata (hotell och restaurang 18 % av jobben, 13 % av förädlingsvärdet), som underskattar turismens totala vikt.
- **Butiksdata efter 2021** och statistik över nedlagda vardagsbutiker 2021–2026; Confcommercios rapporter redovisar inte Venedig separat.
- **CNR-ISMAR:s personal i Venedig.** Institutet har sitt huvudkontor i Arsenale, Tesa 104, strax öster om modellområdet, men jag hittade inget antal anställda.
- **Antal squeri och nybyggda gondoler per år.** Bara journalistiska uppgifter: Squero di San Trovaso och Squero Tramontin bygger fortfarande gondoler, San Trovaso omkring en per år (2021).
- **Porto Marghera efter 2018.** Kommunens kartläggning verkar inte ha uppdaterats.
- **Slutlig utvärdering av inträdesavgiften** (CISET) och kommunens eget slutliga pressmeddelande för 2026.
- **Italiens och Venetos befolkning** för kvoter per invånare: ISTAT:s API svarade inte under sessionen, så jämförelserna görs med budgetlagens 20-gångersgräns i stället.

## För berättelsen

### Platser i modellområdet (koordinater ur projektets OSM-uttag)
- **Piazza San Marco**: Dogepalatset (45,4343 N, 12,3403 E) med 1,36 miljoner besökare 2025, basilikan (45,4345, 12,3397) med 2,39 miljoner i komplexet, kampanilen (45,4341, 12,3390), Biblioteca Marciana (45,4334, 12,3392), Procuratie och Caffè Florian (45,4336, 12,3383). Polisen förstärkte 2026 kontrollerna på torget mot stora grupper.
- **Rialto**: bron (45,4380, 12,3359) och fiskmarknaden Mercato di Rialto (45,4396, 12,3346); Fondaco dei Tedeschi (45,4381, 12,3363), där lyxvaruhuset med 226 anställda stängde 2025.
- **Accademia–Salute–Dogana**: Gallerie dell'Accademia (45,4314, 12,3281), Peggy Guggenheim Collection (45,4308, 12,3315), Santa Maria della Salute (45,4305, 12,3347) och Punta della Dogana (45,4310, 12,3371) – museistråket på Dorsoduro.
- **San Giorgio Maggiore** (45,4294, 12,3434) med Fondazione Cini och glasutställningen Le stanze del vetro.
- **Ca' Vendramin Calergi – Casinò di Venezia** (45,4428, 12,3300) vid Canal Grande i norra kanten: 117,7 miljoner euro i spelintäkter 2025, 20 miljoner netto till kommunen.
- **Ca' Foscari** (45,4345, 12,3265) i västra kanten och Iuavs Ca' Tron (45,4417, 12,3298) vid Canal Grande i norr; universitetens övriga byggnader ligger mest utanför modellområdet.
- **Teatro La Fenice** (45,4337, 12,3339) och **Harry's Bar** (45,4324, 12,3373).
- **Squero di San Trovaso** (45,4303, 12,3258), gondolvarvet med rötter i 1600-talet, precis vid modellens västra kant. Traghetto-gondoler korsar Canal Grande vid Dogana (45,4319, 12,3369), San Tomà (45,4354, 12,3289), Riva del Vin (45,4369, 12,3341) och Santa Sofia (45,4402, 12,3344).
- Utanför men nära: Arsenale (västra delen i östra kanten, CNR-ISMAR i Tesa 104) och Biennalens Giardini i öster; kryssningsterminalen Marittima i väster; Murano i norr; Porto Marghera på fastlandet.

### Historia
- **Turismens kurva**: 457 498 ankomster och 1,39 miljoner gästnätter 1949; en miljon ankomster 1960; fem miljoner gästnätter 1995; tio miljoner 2015; rekordet 13,29 miljoner 2024. Pandemiåret 2020 föll det tillbaka till 1978 års nivå.
- **Bärkraft och dagsbesökare**: redan 1988 räknade forskare fram att staden tålde omkring 10 miljoner besökare om året; dagsbesökarna var då cirka 5 miljoner, i dag bedöms de vara nära 22 miljoner. 2002–2005 provades ett frivilligt bokningssystem, Venice Card (180 000 kort). 2014 lade kommunen 7 000 euro på kampanjen ”Detourism”.
- **Murano**: 1291 beslöt Stora rådet att alla glasugnar skulle flyttas från Venedig till Murano för brandfarans skull. Barovier & Toso räknar sin historia från 1295. På 1950-talet arbetade omkring 4 000 i glasindustrin, 3 142 år 1971 och 928 år 2025 – men omsättningen har ökat med 72 % sedan 2015.
- **Porto Marghera**: industriområdet på fastlandet växte från 3 440 sysselsatta 1925 till 32 980 år 1965 och föll till 11 826 år 2018; delarna heter fortfarande Raffinerie och Petrolchimico, men Enis raffinaderi är i dag ett bioraffinaderi (energi-resor).
- **Butikerna**: 1976–2007 föll antalet livsmedels- och andra vardagsbutiker i den historiska staden från 720 till 276, medan butikerna för turister ökade från 303 till 997.
- **Bäddar och invånare**: 2008 fanns omkring 12 000 turistbäddar och drygt 60 000 invånare i den historiska staden; 2023 gick bäddarna förbi invånarna enligt OCIO:s räknare.
- **Gondolerna**: på 1500-talet fanns omkring 10 000 gondoler; i dag 433 auktoriserade gondoljärer. Giorgia Boscolo blev 2009 första kvinnliga gondoljär.
- **Kryssningarna**: 1,6 miljoner passagerare 2019 med fartyg genom Bacino di San Marco; förbudet 2021; 0,57 miljoner 2025.

### Lokala debatter
- **Inträdesavgiften.** Kommunen ser den som ett verktyg för kunskap och styrning, ”inte ett numerus clausus”: färre toppdagar (4 → 1 dagar över 20 000 betalande) och nära hälften förhandsbokar. Kritikerna menar att den mest drar in pengar och saknar tak för antalet besökare; 2024 kostade uppbyggnaden mer än avgiften gav, och 2026 gick 1,77 miljoner euro netto till lägre avfallsavgift. Kommunalrådet för budgeten, Michele Zuin, har sagt att skillnaden mellan 5 och 10 euro är för liten för att styra (Il Post).
- **Bäddar mot bostäder.** OCIO och Venessia.com håller räknare i skyltfönster; OCIO protesterade i juni 2025 mot nya turistbäddar och påpekade att nästan 17 000 bäddar tillkommit sedan hotellstoppet i centrum 2017. Kommunens egen statistik visar att korttidsuthyrningen ökat från 19 % till 31,5 % av ankomsterna sedan 2019. Kommunen och finanspolisen kontrollerade 2026 korttidsuthyrning i centrum (12 av 14 boenden felaktiga, över 26 000 euro i böter) och på Murano (11 av 14).
- **Butikerna och ”paccottiglia”.** Fullmäktige beslöt i april 2022 (beslut nr 26) att under tre år stoppa nya livsmedelsbutiker (utom grönsaker, fisk, kött, bagerier m.m.), automatbutiker och bankomater i stråken med tät gångtrafik och i hela sestiere San Marco, och bara tillåta exempelvis bokhandlar, gallerier, design och konsthantverk.
- **Turismens ekonomi.** Hotell och restaurang ger 18 % av företagsjobben, dubbelt så stor andel som i Italien, men lönerna är 21 500 euro mot 29 000 i snitt; ungdomsarbetslösheten i provinsen är 24,7 %. Inkomsterna per skattebetalare är ändå högre än i Veneto – men löntagarnas löner lägre.
- **Muranoglaset**: energipriserna och billiga kopior (80 % av ”Muranoglaset” i Venedigs butiker är inte från Murano enligt Promovetro).

### Beslut framför oss
- **Inträdesavgiften 2027**: ska försöket bli permanent, och ska avgiften höjas? Borgmästaren Simone Venturini (centerhögern, vald i första omgången i maj 2026 med 51 %) vill ta 30–50 euro vissa dagar, vilket kräver att staten ändrar den lagstadgade gränsen. CISET:s utvärdering väntas.
- **Korttidsuthyrningen**: kommunens förslag om ett register med krav för den som hyr ut mer än 120 dagar per år (se `com_korttidsuthyrning_grans`) och om hotellstoppet från 2017 ska skärpas.
- **Handelsreglerna** från 2022 löpte på tre år; om de förlängs framgår inte av det jag läst.
- **Turistpengarnas användning**: 38,7 miljoner i turistskatt och 5,4 miljoner i inträdesavgift 2025 – hur mycket ska gå till lägre avgifter för invånarna, bostäder och service?
- **Kryssningarna och hamnen**: var kryssningsfartygen ska lägga till efter förbudet, och hur hamnen och Porto Marghera ska utvecklas när oljan och industrin minskar och containertrafiken växer.
- **Universitetsstaden**: kan nära 24 000 studenter bli en motvikt till turismen, om de får bo i staden?

### Siffror som berättar
- **Fler sängar än invånare**: 70 241 turistbäddar mot 54 480 invånare i den historiska staden med öarna – 1,29 bäddar per invånare. 2008 var det 12 000 bäddar mot 60 000 invånare.
- **Varje natt** sover i snitt 25 700 turister i den historiska staden, i oktober 31 500 – och på dagen kom 2022 i snitt 61 000 dagsbesökare.
- **Den största dagen** 2022 (30 oktober) fanns 143 246 besökare i staden, ungefär tre per invånare.
- **Var tredje** gäst bor nu i en korttidsuthyrd bostad (31,5 %), mot var femte 2019.
- **22 miljoner dagsbesökare** om året, mot 5 miljoner 1988; studien från 2020 räknar med att staden tål 52 000 besökare per dag.
- **1,6 presentbutiker per matbutik** i modellområdet enligt OpenStreetMap, och 374 restauranger mot 19 stormarknader.
- **Inträdesavgiften**: 2 maj 2026 betalade 25 471 dagsbesökare – årets enda dag över 20 000, mot fyra dagar 2024.
- **Turistskatten** ger 38,7 miljoner euro, 11 % av kommunens skatteintäkter utom kasinot; tillsammans med inträdesavgiften 5 % av de löpande intäkterna. Kasinot drar in 118 miljoner men bara 20 miljoner stannar hos kommunen.
- **Kryssningarna** minskade med 64 % efter förbudet 2021.
- **Porto Marghera** hade nästan tre gånger så många jobb 1965 (32 980) som 2018 (11 826).
- **Murano** har mindre än en tredjedel så många glasarbetare som 1971 (928 mot 3 142), men omsättningen har ökat med 72 % på tio år.
- **433 gondoljärer** – och på 1500-talet 10 000 gondoler.
- **Två universitet** med 23 851 studenter, motsvarande halva invånarantalet i centro storico.
