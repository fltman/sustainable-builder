# Samhälle och hälsa – Venezia 2126: metod, källor och berättelsematerial

Sammanställt 2026-10-11 för ämnet **samhalle-halsa**. Filen `samhalle-halsa.json` har 56 poster och de engelska texterna finns i `samhalle-halsa.en.json`. Alla siffror kommer från källor jag har läst. Egna beräkningar är markerade med confidence `estimate` och räknesättet står i posten. Sekundärkällor (OCIO, Inside Airbnb, rapporten 9mq) används bara där kommunen, ISTAT eller andra myndigheter inte publicerar uppgiften, och har confidence `medium`.

"Centro storico" är kommunens zon med samma namn: de sex sestieri med Giudecca och Sacca Fisola, utan Lido och de andra öarna. Den består av kvarter 1 (S.Marco-Castello-Sant'Elena-Cannaregio) och kvarter 2 (Dorsoduro-S.Polo-S.Croce-Giudecca-Sacca Fisola).

## Kort för modellen

| Behov | Värde | Post |
|---|---|---|
| Folkmängd i centrum i dag | 47 625 (31 dec 2025), 47 201 (31 aug 2026) | `soc_pop_cs_2025`, `soc_pop_cs_2026_aug` |
| Historik, centrum | 174 808 (1951), 121 309 (1966), 108 426 (1971), 93 598 (1981), 76 644 (1991), 65 695 (2001), 58 991 (2011), 49 665 (2022, första året under 50 000) | `soc_pop_cs_1951` … `soc_pop_cs_2022_below_50000` |
| Hela kommunen | 251 294 (2025, finns som `com_folkmangd_kommun`); topp 367 832 (1968) | `soc_pop_comune_peak_1968` |
| Flöden i centrum 2025 | 209 födda, 689 döda; flyttnetto −65 mot andra kommuner och utlandet, −319 mot resten av kommunen; totalt −864 (−1,8 %) | `soc_births_cs_2025`, `soc_deaths_cs_2025`, `soc_migration_external_cs_2025`, `soc_moves_within_comune_cs_2025` |
| Flöden i kommunen 2025 | födda minus döda −1 958; flyttnetto +1 451 | `soc_natural_balance_comune_2025` |
| Flöden i centrum 2015–2025 (elva år) | födelseunderskott −6 013 (254 födda och 801 döda per år); flyttnetto −3 819 mot resten av kommunen och +1 163 mot andra kommuner och utlandet | `soc_natural_balance_cs_2015_2025`, `soc_moves_within_comune_cs_2015_2025`, `soc_migration_external_cs_2015_2025` |
| Ålder, centrum | 0–14 år 8,5 %, 65+ 33,1 %, 80+ 12,2 %; medelålder 51,4 (2015: 49,3), median ≈ 55,3 (egen beräkning) | `soc_share_0_14_cs_2025`, `soc_share_65plus_cs_2025`, `soc_share_80plus_cs_2025`; medelåldern finns som `nt_medelalder_centro_storico` |
| Hushåll, centrum | 26 499 hushåll, 1,80 personer per hushåll, 55,9 % ensamhushåll | `soc_households_cs_2025`, `soc_one_person_households_cs_2025` |
| Ursprung, centrum | 4 620 utländska medborgare (9,7 %); 63,7 % födda i Venedig | `soc_foreign_residents_cs_2025`, `soc_born_in_venice_cs_2025` |
| ISTAT:s framskrivning för kommunen (bas 2025) | 245 422 (2030), 237 171 (2040), 228 172 (2050); 65+ 34,2 % år 2040 | `soc_projection_comune_2050`, `soc_projection_share_65plus_comune_2040` |
| Trendlinje för centrum (egen) | 44 082 (2030), 37 766 (2040), 32 356 (2050) om −1,53 % per år fortsätter | `soc_trend_pop_cs_2050` |
| Veneto till 2080 | 4 084 694 invånare; 65+ 35,8 %; livslängd män 87,4, kvinnor 90,0 | `soc_projection_veneto_2080` |
| Livslängd (provinsen 2025) | män 82,2, kvinnor 86,4 (Italien 81,7 och 85,7) | `soc_life_expectancy_men_province`, `soc_life_expectancy_women_province` |
| Social hälsa (kommunen 2024) | nöjda med livet 52,6 % (Italien 55,2 %); vänner att räkna med 69,5 % (74,4 %); trygga i mörker 50,4 % (61,7 %) | `soc_life_satisfaction_comune`, `soc_friends_to_count_on_comune`, `soc_feel_safe_dark_comune` |
| Bostäder utan folkbokförda | centrum 37,4 % av 42 431 (2023); kommunen 17,8 % | `soc_dwellings_unoccupied_cs_2023`, `soc_dwellings_unoccupied_comune_2023` |
| Modellens ruta (1,8 km) | 21 266 invånare, 20 503 bostäder, 44,7 % utan folkbokförda (2023) | `soc_model_area_residents_2023`, `soc_model_area_dwellings_unoccupied_2023` |
| Turism i bostäderna | 50 207 turistbäddar mot 46 964 invånare (1,07 per invånare, sep 2026); korsningen ("il sorpasso") i oktober 2024; 6 145 turistlägenheter; 5 151 hela bostäder på Airbnb | `soc_tourist_beds_cs_2026`, `soc_tourist_beds_per_resident_cs_2026`, `soc_tourist_rental_units_cs_2026`, `soc_airbnb_entire_homes_cs_2026` |
| Bostadspriser | 4 332 €/m² i Centro storico e Giudecca, 5 388 i San Marco, 1 660 på fastlandet (OMI 2025); 6 994 nya hyresavtal i kommunen | `nt_bostadspris_centro_storico` (nyckeltal.json), `soc_new_leases_comune_2025` |
| Offentliga bostäder | kommunen 5 348 (1 143 ej uthyrda); ATER 5 163 (33,5 % tomma); 15,1 % av hushållen i den insulära staden; 2 251 i kön | `soc_public_housing_comune_empty_2025`, `soc_public_housing_ater_empty_share_2025`, `soc_public_housing_share_insular_2025`, `soc_erp_applicants_2025` |
| Studenter | 23 851 inskrivna (Ca' Foscari och IUAV, 2025/26); 1 000 ESU-bäddar | `soc_university_students_2025`, `soc_student_beds_esu` |
| Skolbarn i centrum | 2 570 elever i primaria och secondaria di I grado (2024/25), −28,8 % sedan 2015/16 | `soc_pupils_cs_primary_middle` |
| Valdeltagande | kommunalvalet maj 2026: 55,9 % (centrum 53,97 %) – i `kommun-plats-historia.json`; Europaparlamentsvalet 2024 i provinsen 48,9 % | `soc_turnout_european_2024_province` |
| Brott | 9 091,8 anmälda brott per 100 000 invånare (kommunen 2024; Italien 4 069,6); 806,5 fickstölder per 100 000 (provinsen 2023; Italien 236,8) | `nt_anmalda_brott_per_100000`, `nt_fickstolder_per_100000` (nyckeltal.json) |
| Fattigdom | AROPE 14,6 % i Veneto (Italien 22,6 %) | `nt_fattigdom_social_utestangning` (nyckeltal.json) |
| Föreningsliv | 55,3 ideella organisationer per 10 000 invånare (provinsen; Italien 61,0) | `soc_nonprofits_province` |
| Vård | SS. Giovanni e Paolo, ≈ 310 vårdplatser | `soc_hospital_beds_ss_giovanni_paolo` |
| Övrigt ur BES dei territori (provinsen) | undvikbar dödlighet 15,5 per 10 000 (Italien 17,6); unga akademiker flyttar netto ut, −11,3 per 1 000 och år (Italien −6,2) | `soc_avoidable_mortality_province`, `soc_graduate_migration_province` |

**Tolkning.** Centrum har förlorat i snitt omkring 800 invånare om året sedan 2015, och 864 år 2025. Sju tiondelar av minskningen 2015–2025 beror på att det dör tre gånger så många som det föds (−6 013). Resten är flyttningar till fastlandet och öarna (−3 819), som delvis vägs upp av att fler flyttar in från andra kommuner och utlandet än som flyttar ut (+1 163). Att stoppa utflyttningen räcker alltså inte; centrum behöver inflyttning av unga och barnfamiljer. Kommunen som helhet krymper långsamt (−507 år 2025), eftersom inflyttningen till Mestre och fastlandet nästan väger upp underskottet. Det finns ingen officiell framskrivning för centrum. Trendlinjen ger omkring 32 000 invånare år 2050. ISTAT:s framskrivning för hela kommunen ger 228 000.

Bostäderna finns kvar, men de används av andra än de folkbokförda. I centrum saknar 37 % av bostäderna folkbokförda boende, och i modellens ruta 45 %. Senast sedan oktober 2024 finns det fler turistbäddar än invånare i den historiska staden; enligt pressen redan sedan september 2023. Hela tillväxten i bäddar sedan 2023 har skett i turistlägenheter, inte i hotell.

### Avgränsning mot de andra ämnesfilerna

Följande finns redan i `kommun-plats-historia.json` och har inte lagts in igen:

- valdeltagandet 2026 i kommunen (`com_valdeltagande_2026`, 55,9 %) och i centrum (`com_valdeltagande_centro_storico_2026`, 53,97 %), valdeltagandet 2020 (`com_valdeltagande_2020`, 62,2 %), borgmästarvalet och mandaten
- folkmängden i estuario och terraferma 2025, centrums index (27,2) och folkmängden 1931
- gränsen på 120 dagar för korttidsuthyrning (`com_korttidsuthyrning_grans`) och inträdesavgiften

Tre värden finns i båda filerna med samma källa och samma tal: 174 808 (1951), 121 309 (1966) och 47 625 (2025). Jag har behållit dem så att centrums serie är komplett i en fil.

I `nyckeltal.json` finns redan, och har därför strukits här:

- medelåldern i centrum (`nt_medelalder_centro_storico`, 51,4)
- bostadspriset i centrum (`nt_bostadspris_centro_storico`, 4 332 €/m²)
- fickstölderna (`nt_fickstolder_per_100000`, 806,5)
- AROPE i Veneto (`nt_fattigdom_social_utestangning`, 14,6 %)
- totalt antal anmälda brott (`nt_anmalda_brott_per_100000`, 9 091,8 per 100 000, kommunen 2024)
- livslängden 2024 (`nt_medellivslangd_man` och `nt_medellivslangd_kvinnor`, 81,9 och 86,2); posterna här gäller ISTAT:s preliminära skattning för 2025

`turism-ekonomi.json` räknar turistbäddarna på ett annat sätt än OCIO:

- Kommunens turistårsbok ger 70 241 bäddar 2025 i centro storico med öarna (`tur_baddar_cs`), varav 42 011 i 9 560 korttidsuthyrda bostäder som varit öppna någon gång under året. OCIO:s räknare ger 50 207 bäddar och 6 145 lägenheter i september 2026 i den historiska staden, som ett ögonblicksregister.
- Korsningen mellan bäddar och invånare dateras där till september 2023 enligt pressen (`tur_baddar_fler_an_invanare_ar`), här till oktober 2024 enligt OCIO:s egen genomgång 2026. Båda bygger på OCIO:s räknare men med olika invånartal och reviderade bäddsiffror.
- I båda fallen är bäddarna fler än invånarna.

`com_studenter` (28 000, 2022) räknar sannolikt även konstakademin och konservatoriet. `soc_university_students_2025` (23 851) avser bara de två universiteten enligt MUR.

## Metod

- **Comune di Venezia, statistikkontoret.** Webbplatsen ligger bakom ett bot-skydd (Incapsula), så curl och WebFetch blockerades. Jag läste kommunens sidor på två sätt:
  - zonserien 1871–2025 via Wayback Machines kopia av filen
  - övriga tabeller via användarens Chrome (tillägget Claude in Chrome), där ODS-filerna hämtades och tolkades i minnet i sidan
  - Tabeller som använts:
    - A01_T01 (zoner 1871–2025)
    - B01_T01 (befolkning och rörelser 2025)
    - B04_T03 (åldersklasser per kvarter 2025)
    - B04_T12 (särskilda åldersklasser 2000–2025)
    - ST_QUARTIERI 1981–2025 och ST_Quartiere 1–2 (indikatorer per kvarter)
    - B05 (hushåll och ensamhushåll 2000–2025)
    - B06 (utländska medborgare 2000–2025)
    - A01_T02 (födda i Venedig 2010–2025)
    - månadstabellen för augusti 2026
    - ISTAT:s äldre försöksframskrivning 2022–2041 som kommunen publicerat (TAB_02, TAB_03)
    - kommunens svar på fråga 895 i fullmäktige (befolkningsförändring per kvarter 2015–2025 och medelålder 2015–2025, pdf läst i minnet)
  - Kommunens valsajt (elezioni.comune.venezia.it) och föreningsregistret lästes också i Chrome.
- **ISTAT.**
  - IstatData:s SDMX-API: kommunala framskrivningar 2025–2050 (165_1245), livslängdstabeller (26_295) och BesT-skattningar för storkommuner (DF_DCSS_BEST_PPC_1–6_GC)
  - demo.istat.it: regionala framskrivningar med bas 2025
  - BES dei territori 2025 (xlsx)
  - folkräkningen 2023 per sektion (Venezia_2023_sezioni.xlsx)
  - sektionsgränserna 2021 för Veneto (shapefile) med ortstabell
  - **Modellens ruta:** sektionernas tyngdpunkter beräknades i UTM 32N och testades mot rutans hörn (45,426915–45,443085 N, 12,325979–12,349021 E). 647 av 693 sektioner i rutan har data.
  - **Centrum i folkräkningen:** orterna Venezia och Giudecca (ISTAT:s ortskoder 2704210012 och 2704210022).
- **Eurostat** (API): demo_r_pjanind3 och demo_r_gind3 (provinsen ITH35, Veneto ITH3, Italien), ilc_peps11n och ilc_li41.
- **Agenzia delle Entrate, OMI:** Statistiche regionali Veneto 2026 (pdf, läst i minnet).
- **MIM, öppna skoldata:** skolregister och elever per skola för statliga och fristående skolor, 2015/16 och 2024/25. Skolor i centrum valdes på adressens sestiere-namn och postnummer, utan kvällskurser, vuxenutbildning, internat och skolan i kvinnofängelset på Giudecca.
- **MUR Ustat:** inskrivna per universitet 2000/01–2025/26 (csv).
- **Inside Airbnb:** listings.csv för Venedig, ögonblicksbild 16 september 2026. Sestieri enligt fältet `neighbourhood`, modellens ruta enligt koordinaterna.
- **OCIO** (Osservatorio CIvicO sulla casa e la residenza): rapporter från 2022–2026 om befolkning, folkräkning, turistuthyrning, offentliga bostäder, köer, studentboende och val. Rapporten "9mq" lästes som pdf i minnet från OCIO:s länk.
- **ULSS 3 Serenissima:** sjukhussidan, läst i Chrome.
- **Egna beräkningar** (markerade):
  - åldersandelar och medianålder ur femårsklasser
  - andelar ensamhushåll och utländska medborgare
  - summor över kvarteren för år före 2025
  - trendlinjen för centrum
  - folkräkningsdata per ort och för modellens ruta
  - BesT-andelar ur antal per svarsalternativ
  - Airbnb-sammanställningar
  - elevsummor
  - bäddar per 100 studenter
- **Begränsningar.**
  - Sessionens gemensamma tak för webbsökningar tog slut halvvägs. Därefter hämtades bara kända adresser direkt.
  - ISTAT:s server esploradati.istat.it slutade svara från omkring kl. 08.35 och svarade inte igen före avslut. Tabellerna över ensamboende efter ålder och ideella organisationers volontärer kunde därför inte hämtas. Totalt antal anmälda brott finns i `nyckeltal.json`.
  - Till sist jämförde jag mina poster med de andra ämnesfilerna i mappen och strök dubbletter mot `nyckeltal.json`.
  - OMI:s hyresnivåer kräver att man skickar ett sökformulär, vilket jag inte gjorde.
  - immobiliare.it blockerade åtkomst och används inte.
- Inga pdf:er sparades. Textutdrag och datafiler (ods, xlsx, csv, zip) ligger under `/private/tmp/claude-502/…/scratchpad/venezia-sh/`.
- Inga andra filer i projektet har ändrats.

## Källor

**Comune di Venezia**
- Popolazione residente (serie storiche): https://www.comune.venezia.it/it/content/serie-storiche
- Zonserien 1871–2025: https://www.comune.venezia.it/sites/comune.venezia.it/files/page/files/A01_T01_ST_Pop_zone_1871_2025.ods
- Movimento demografico 2025: https://www.comune.venezia.it/it/content/movimento-demografico. Tabell: https://www.comune.venezia.it/sites/comune.venezia.it/files/page/files/B01_T01_movimento%20e%20calcolo_2025.ods
- Classi di età 2025: https://www.comune.venezia.it/it/content/classi-det-anno-2025. Tabell: https://www.comune.venezia.it/sites/comune.venezia.it/files/page/files/B04_T03_MF_2025_classi.ods
- Serie storica dei quartieri con indicatori: https://www.comune.venezia.it/it/content/quartieri. Filer: ST_QUARTIERI 1981-2025, ST_Quartiere 1 och 2 agg.2025
- Famiglie: https://www.comune.venezia.it/it/content/famiglie
- Popolazione residente straniera: https://www.comune.venezia.it/it/content/stranieri
- Movimenti demografici mensili: https://www.comune.venezia.it/it/content/mensili (08_AGOSTO 2026.ods)
- Previsioni demografiche comunali 2022–2041: https://www.comune.venezia.it/it/content/previsioni-demografiche-comunali-2020-2030
- Valresultat 2026: https://elezioni.comune.venezia.it/ (affluenze.php, risultati per zona)
- Svar på fråga 895 i fullmäktige, befolkningsförändring och medelålder 2015–2025: https://consiglio2020.comune.venezia.it/allegati/atti_ispettivi/risposte_1/895_variazioni_2015-2025etamedia.pdf
- Albo delle associazioni: https://www.comune.venezia.it/it/content/pubblicazioni-albo-associazioni

**ISTAT**
- Kommunala framskrivningar 2025–2050: https://esploradati.istat.it/SDMXWS/rest/data/IT1,165_1245_DF_DCIS_PREVCOM_2,1.0/A.027042... (även PREVCOM_1 och PREVCOM_4). Appen: https://demo.istat.it/app/?i=PPC&l=it
- Regionala framskrivningar bas 2025: https://demo.istat.it/app/?i=PPR&l=it. Data: https://demo.istat.it/data/previsioni/Indicatori-Regioni.zip
- Livslängdstabeller: https://esploradati.istat.it/SDMXWS/rest/data/IT1,26_295_DF_DCIS_MORTALITA1_1,1.0/A.ITD35.LIFEXP..?startPeriod=2022 (även ITD3 och IT)
- BES dei territori 2025: https://www.istat.it/notizia/bes-dei-territori-edizione-2025/. Data: https://www.istat.it/wp-content/uploads/2025/06/Bes_dei_territori_edizione_2025.zip
- BesT, småområdesskattningar för storkommuner: https://esploradati.istat.it/SDMXWS/rest/data/IT1,DF_DCSS_BEST_PPC_2_GC,1.0/all/ALL/ (samt PPC_1, PPC_3, PPC_4, PPC_5 och PPC_6)
- Folkräkningen per sektion 2023: https://www.istat.it/notizia/dati-per-sezioni-di-censimento/. Data: https://esploradati.istat.it/databrowser/DWL/PERMPOP/SUBCOM/Comuni_2023.zip
- Sektionsgränser 2021, Veneto: https://www.istat.it/storage/cartografia/basi_territoriali/2021/R05_21.zip

**Eurostat**
- AROPE: https://ec.europa.eu/eurostat/databrowser/view/ilc_peps11n/default/table?lang=en
- Fattigdomsrisk: ilc_li41
- Befolkningsstruktur: demo_r_pjanind3
- Demografisk balans: demo_r_gind3
- API: https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/<dataset>

**Övriga myndigheter**
- Agenzia delle Entrate, OMI, Statistiche regionali Veneto 2026: https://www.agenziaentrate.gov.it/portale/documents/20143/10101383/SR2026_VENETO.pdf/b9d7b4cb-c99d-7191-ca20-902b5540bbc9?t=1780658612084
- MIM, öppna skoldata: https://dati.istruzione.it/opendata/opendata/catalogo/elements1/?area=Studenti och ?area=Scuole. Filer: SCUANAGRAFESTAT/PAR och ALUCORSOETASTA/PAR för 2015/16 och 2024/25
- MUR Ustat, inskrivna per universitet: https://dati-ustat.mur.gov.it/dataset/iscritti
- ULSS 3 Serenissima, Ospedale di Venezia: https://www.aulss3.veneto.it/ospedali/ospedale-di-venezia
- ULSS 3, guide till akutmottagningen i Venedig (pdf): https://www.aulss3.veneto.it/myportal/AU12VE/api/content/download?id=63e5f628afc2fb0088cd18db

**Sekundära källor**
- OCIO:
  - "A mente fredda" sullo spopolamento di Venezia (23 nov 2022): https://ocio-venezia.it/report/a-mente-fredda-sullo-spopolamento-di-venezia
  - Venezia Insulare: quasi 4 case su 10 senza residenti (14 apr 2025): https://ocio-venezia.it/report/istat-vuoti-censimento2021
  - ISTAT – Censimento 2023 (10 maj 2026): https://ocio-venezia.it/report/istat-censimento-della-popolazione-e-delle-abitazioni-2023
  - Locazioni Brevi Turistiche nella città storica: uno sguardo al contatore (19 sep 2026): https://ocio-venezia.it/report/aggiornamento-lbt
  - Il caos locazioni turistiche brevi è una scelta politica (30 sep 2025): https://ocio-venezia.it/report/il-caos-ltb-e-una-scelta-politica
  - Regali di Natale e CIN CIR (13 jan 2025): https://ocio-venezia.it/report/cin-cir
  - Finalmente una stretta sugli affitti brevi? (8 okt 2024): https://ocio-venezia.it/report/finalmente-una-stretta-sugli-affitti-brevi
  - Un primo quadro aggiornato sul patrimonio residenziale comunale (14 jul 2025): https://ocio-venezia.it/report/un-primo-quadro-aggiornato-sul-patrimonio-residenziale-comunale-dati-2025
  - ATER Venezia – aggiornamento 2025 (2 apr 2026): https://ocio-venezia.it/report/ater-venezia-il-fallimento-delle-politiche-di-gestione-del-patrimonio-abitativo-pubblico
  - Quando i numeri non spiegano niente (4 okt 2026): https://ocio-venezia.it/report/qando-i-numeri-non-spiegano-niente
  - Analisi del progetto di legge regionale n. 106 (17 sep 2026): https://ocio-venezia.it/report/considerazioni-sul-progetto-di-legge-regionale-sul-social-housing
  - Un Ocio sulle elezioni comunali a Venezia (5 mar 2026): https://ocio-venezia.it/report/un-ocio-sulle-elezioni-comunali-a-venezia
  - 9mq sull'abitare universitario (27 mar 2024): https://ocio-venezia.it/report/report-9mq-sull-abitare-universitario-a-venezia-a-a-2022-2023. Rapporten: https://drive.google.com/file/d/1QPrWWFuXSP_ztJ6OFtNCkFE8dLZ1Pfkx/view
- Inside Airbnb, Venedig: https://insideairbnb.com/get-the-data/. Data: https://data.insideairbnb.com/italy/veneto/venice/2026-09-16/visualisations/listings.csv
- Venessia.com (webbräknaren och "49.999"): https://www.venessia.com/
- We Are Here Venice, Report popolazione di Venezia (2019; används bara för att förklara skillnaden 1980/1981): https://www.weareherevenice.org/wp-content/uploads/2017/08/Report-Popolazione-di-Venezia-Ottobre-2019.pdf

## Fynd per område

### 1. Befolkning

Folkbokförda den 31 december enligt kommunens zonserie (A01_T01):

| År | Centro storico | Estuario (öarna) | Terraferma | Hela kommunen |
|---|---|---|---|---|
| 1871 | 128 787 | 19 457 | 16 356 | 164 600 |
| 1951 | 174 808 | 44 037 | 96 966 | 315 811 |
| 1966 | 121 309 | 51 125 | 193 314 | 365 748 |
| 1968 (kommunens topp) | 116 270 | 51 117 | 200 445 | 367 832 |
| 1971 | 108 426 | 48 747 | 205 829 | 363 002 |
| 1981 | 93 598 | 49 203 | 206 707 | 349 508 |
| 1991 | 76 644 | 47 057 | 190 136 | 313 837 |
| 2001 | 65 695 | 32 183 | 176 290 | 274 168 |
| 2011 | 58 991 | 29 693 | 181 905 | 270 589 |
| 2021 | 50 434 | 26 795 | 177 621 | 254 850 |
| 2022 | 49 665 | 26 530 | 176 979 | 253 174 |
| 2025 | 47 625 | 25 538 | 178 131 | 251 294 |

- **Brott i serien.** Estuario sjunker 1999 eftersom Cavallino-Treporti blev egen kommun. Från 1981 ingår personer utan fast bostad i kommunens total. 1871–1936 och 1951 är folkräkningstal.
- **Förväxlade år.** Flera sekundärkällor anger 95 222 för 1981 och 66 386 för 2001. Det är värdena för 31 december 1980 och 2000.
- **Månadsvis 2026.**
  - Centrum 47 201 och kommunen 251 682 den 31 augusti.
  - I augusti föddes 14 och dog 59 i centrum.
  - OCIO räknar 46 964 för september 2026, med en annan avgränsning av "città storica".
  - Venessia.com:s webbräknare visade 47 652 den 11 oktober 2026, utan angivet datum.
- **Under 50 000.** Den 31 december 2021 var siffran 50 434 och den 31 december 2022 49 665. Månadsfilerna för 2022 hittades inte på kommunens webbplats, så månaden kan inte fastställas ur primärkällan.
- **Flöden 2025 (B01_T01):**

  | | Centrum | Estuario | Terraferma | Kommunen |
  |---|---|---|---|---|
  | Födda | 209 | 91 | 1 116 | 1 416 |
  | Döda | 689 | 401 | 2 284 | 3 374 |
  | Inflyttade från andra kommuner och utlandet | 1 031 | 253 | 6 348 | 7 632 |
  | Utflyttade dit | 1 096 | 408 | 4 677 | 6 181 |
  | Flyttningar in inom kommunen | 600 | 281 | 3 420 | 4 301 |
  | Flyttningar ut inom kommunen | 919 | 225 | 3 157 | 4 301 |

  Kvarterstabellerna visar vart flyttningarna inom kommunen går. Från centrum flyttade 432 till fastlandet och 196 till öarna, medan 197 kom från fastlandet och 112 från öarna.
- **Utvecklingen i centrum** (summa av kvarter 1 och 2):

  | År | Födda | Döda | Hushåll | Ensamhushåll |
  |---|---|---|---|---|
  | 1991 | 455 | 1 252 | 35 242 | 14 448 |
  | 2001 | 505 | 1 037 | 32 424 | 14 465 |
  | 2011 | 421 | 899 | 31 221 | 15 154 |
  | 2021 | 236 | 837 | 27 359 | 14 696 |
  | 2025 | 209 | 689 | 26 499 | 14 801 |

  Antalet ensamhushåll är i stort sett oförändrat i 35 år. Det är familjerna som har försvunnit.
- **Ålder 2025.**
  - **Centrum:** 0–14 år 4 034, 65+ 15 785, 80+ 5 814 och 90+ 1 136.
  - Det finns 391 personer 65+ per 100 barn, mot 280 i kommunen.
  - Kommunens egen kvarterstabell anger 0–14 = 10,22 % och 65+ = 28,59 % för hela kommunen 2025. Talen tycks vara delade med 2023 års folkmängd (252 340), så andelarna här är räknade om ur antalen: 10,26 % och 28,71 %.
- **Medelålder** (kommunens svar på fråga 895 i fullmäktige):

  | År | Centrum | Öarna | Fastlandet | Kommunen |
  |---|---|---|---|---|
  | 2015 | 49,3 | 49,6 | 46,7 | 47,6 |
  | 2025 | 51,4 | 52,3 | 47,5 | 48,7 |

  Burano–Mazzorbo–Torcello har den äldsta befolkningen (54,1 år) och Marghera den yngsta (45,3).
- **Förändringen 2015–2025 per zon** (samma källa; flödena avser elva år och summerar till förändringen från slutet av 2014):

  | Zon | Födda | Döda | Flyttnetto mot andra kommuner och utlandet | Flyttnetto inom kommunen |
  |---|---|---|---|---|
  | Centrum | 2 797 | 8 810 | +1 163 | −3 819 |
  | Öarna | 1 369 | 4 764 | −529 | +716 |
  | Fastlandet | 13 229 | 25 045 | +8 022 | +3 103 |

  Fastlandet växer genom inflyttning från andra kommuner och utlandet, centrum krymper främst genom att det dör fler än det föds.
- **Ursprung.**
  - 30 342 av centrumets invånare (63,7 %) är födda i Venedig, mot 69,3 % år 2010.
  - Utländska medborgare: 4 620 i centrum och 43 255 i kommunen. De flesta bor i Mestre och Marghera.
- **Framskrivningar.**
  - **ISTAT:s nya kommunala framskrivning** (bas 1 jan 2025, mediant scenario): 249 490 → 228 172 år 2050. Flyttnettot är +933 till +1 336 per år, födelseunderskottet omkring 1 900–2 000.
  - **Den äldre försöksframskrivningen** (bas 2022) gav 235 713 år 2041.
  - **Veneto:** 4,85 miljoner (2025) → 4,69 (2050) → 4,08 (2080).
  - För centrum finns ingen framskrivning. Trendlinjen i `soc_trend_pop_cs_2050` är en egen beräkning.

### 2. Åldrande, hälsa och vård

- **Livslängd i provinsen 2025** (ISTAT, preliminär skattning):

  | | Provinsen | Veneto | Italien |
  |---|---|---|---|
  | Män | 82,2 | 82,5 | 81,7 |
  | Kvinnor | 86,4 | 86,5 | 85,7 |
  | Båda könen | 84,2 | 84,4 | 83,7 |

  Återstående livslängd vid 65 år i provinsen: 20,2 (män) och 23,4 (kvinnor). BES-filen 2025 har 2024 års preliminära värden: 81,9 och 86,2.
- **BES dei territori 2025** (provinsen / Veneto / Italien):

  | Indikator | Provinsen | Veneto | Italien |
  |---|---|---|---|
  | Undvikbar dödlighet 0–74, per 10 000 (2022) | 15,5 | 15,2 | 17,6 |
  | Dödlighet i demens och nervsjukdomar 65+, per 10 000 (2022) | 41,6 | 38,6 | 35,3 |
  | Vårdplatser per 10 000 (2022) | 31,8 | 32,3 | 33,3 |
  | Specialistläkare per 10 000 (2023) | 25,3 | 29,6 | 34,1 |
  | Vårdplatser i högspecialiserad vård per 10 000 (2022) | 2,7 | 4,0 | 3,2 |
  | Pensionärer med pension under 500 € i månaden (2023) | 6,3 % | 6,1 % | 8,9 % |

  BES dei territori har inga mått på självskattad hälsa, ensamhet, tillit eller fysisk aktivitet per provins.
- **ISTAT BesT för kommunen 2024** (andelar av invånare 14+; egna beräkningar ur antalen):

  | Indikator | Venedig | Italien |
  |---|---|---|
  | Ger livet 8–10 av 10 | 52,6 % | 55,2 % |
  | Medelbetyg för livet | 7,29 | 7,42 |
  | Har släktingar att räkna med | 83,7 % | 87,0 % |
  | Har vänner att räkna med | 69,5 % | 74,4 % |
  | Har inga vänner att räkna med | 18,3 % | 15,0 % |
  | Kan räkna med grannar | 67,6 % | 70,9 % |
  | Trygga i mörker | 50,4 % | 61,7 % |
  | Otrygga i mörker | 36,4 % | 27,6 % |
  | Hushåll som upplever stor eller ganska stor brottsrisk | 35,3 % | 23,3 % |

  Venedig ligger under riket på alla de sociala måtten.
- **Sjukhuset.**
  - Ospedale Civile SS. Giovanni e Paolo ligger i Castello och har omkring 310 vårdplatser och 42 enheter (ULSS 3).
  - Akutmottagningen har 6 platser för korttidsobservation (ULSS 3:s guide).
  - Patienter kommer till akuten själva eller med 118:s ambulansbåtar. Antalet båtar och utryckningstiderna har jag inte hittat i någon primärkälla.

### 3. Boende

- **Folkräkningen 31 dec 2023** (ISTAT, summerad per ort och kommundel; egna beräkningar):

  | Område | Bostäder | Bebodda av folkbokförda | Utan folkbokförda | Andel utan |
  |---|---|---|---|---|
  | Orten Venezia (centrum utan Giudecca) | 38 644 | 23 717 | 14 927 | 38,6 % |
  | Giudecca | 3 787 | 2 835 | 952 | 25,1 % |
  | Kommundel 1 (Venezia-Murano-Burano) | 46 969 | 29 971 | 16 998 | 36,2 % |
  | Kommundel 2 (Lido-Pellestrina) | 12 673 | 9 520 | 3 153 | 24,9 % |
  | Fastlandets kommundelar (var för sig) | | | | 7,0–7,5 % |
  | Hela kommunen | 149 294 | 122 756 | 26 538 | 17,8 % |
  | Modellens ruta | 20 503 | 11 343 | 9 160 | 44,7 % |

  - OCIO jämför 2011 med 2021: den insulära staden gick från 21 % till 36 %, Lido från 10 % till 25 % och hela kommunen från 11 % till 17 %.
  - 2021 låg Venedigs centrum över de historiska centrumen i Milano (30 %), Florens (28 %) och Rom (Municipio I, 26 %).
- **Folkräkningarnas långa linje** (OCIO, vattenstaden med Giudecca):

  | År | Bostäder bebodda av ägaren | Hyrda bostäder | Tomma |
  |---|---|---|---|
  | 1971 | ≈ 10 000 | ≈ 23 000 | ≈ 1 000 |
  | 2001 | knappt 18 000 | 10 000–11 000 | > 5 000 |
  | 2011 | 17 500 | 8 909 | > 8 000 |

  1971 fanns omkring 35 000 bostäder. Hyresbeståndet har alltså krympt med drygt 14 000 bostäder på 40 år.
- **Turistbäddar (OCIO:s räknare, data från kommunens portal GeoIDS):**

  | | April 2023 | September 2026 |
  |---|---|---|
  | Invånare | 52 760 | 46 964 |
  | Turistbäddar | 44 484 | 50 207 |
  | Bäddar i hotell, B&B m.m. | 25 468 | 25 447 |
  | Bäddar i turistlägenheter | 19 016 | 24 760 |
  | Turistlägenheter | 5 040 | 6 145 |

  - Korsningen kom i oktober 2024: 48 469 bäddar mot 48 451 invånare.
  - OCIO:s text daterar hotellbäddarna till "2019", men summan 25 468 + 19 016 = 44 484 motsvarar april 2023.
  - Den 30 september 2025 räknade OCIO 6 273 turistlägenheter med 24 765 bäddar.
  - Hotellbäddarna i vattenstaden ökade från 18 384 (2017, året för beslutet att stoppa nya hotell) till 20 037 (2023), enligt OCIO med data från Venetos statistikkontor.
- **Inside Airbnb (16 sep 2026):**
  - Kommunen: 8 844 annonser, varav 6 826 hela bostäder. 71 % av annonserna tillhör värdar med flera annonser.
  - Annonser per sestiere: Castello 1 596, Cannaregio 1 572, San Marco 969, Dorsoduro 641, San Polo 627, Santa Croce 608 och Giudecca 169.
  - Modellens ruta: 3 786 annonser, varav 3 187 hela bostäder.
  - 92 % av alla annonser i kommunen har ett registreringsnummer i fältet `license`.
  - OCIO citerade Inside Airbnb i september 2022 med 6 182 hela lägenheter (avgränsningen är oklar).
- **Priser och hyror.**
  - **OMI 2025, Centro storico e Giudecca:** 4 332 €/m². Per zon:

    | Zon | €/m² |
    |---|---|
    | San Marco | 5 388 |
    | San Polo | 4 850 |
    | Dorsoduro Est | 4 713 |
    | Castello Ovest | 4 513 |
    | Cannaregio Nord | 4 088 |
    | Cannaregio Sud | 4 050 |
    | Santa Croce | 4 017 |
    | Giudecca | 4 000 |
    | Dorsoduro Ovest | 3 913 |
    | Castello Est | 3 838 |
    | Sant'Elena | 3 675 |

  - 803 bostäder såldes i centrum 2025 och 3 968 i hela kommunen.
  - Nya hyresavtal i kommunen: 6 994. Hyresnivåer per m² hittade jag inte i någon publicerad tabell.
  - I studentenkäten 9mq betalade de flesta 50–100 € i månaden för el, vatten och gemensamma kostnader utöver hyran.
- **Offentliga bostäder.**
  - **Kommunen** äger 5 348 bostäder enligt sin lista 2025; OCIO anger 5 408 i mars 2026. Av dem var 1 143 inte uthyrda (21 %, i centrum 16 %).
  - 3 110 bostäder är "icke-ERP" och hyrs sedan 2018 ut som social housing när de blir lediga.
  - 480 hyresgäster betalade ingen hyra första kvartalet 2025. Medelhyran var 195 € i månaden.
  - **ATER** äger 5 163 bostäder i kommunen, 3 443 är uthyrda och 33,5 % står tomma. Av 676 bostäder med reglerad hyra är 342 tomma.
  - I hela Città metropolitana stod 2 555 ATER-bostäder tomma 2024 (26 %).
  - ATER utlyste 40 bostäder med reglerad hyra i juni 2025 och fick omkring 700 ansökningar. I april 2026 var den slutliga listan ännu inte publicerad.
  - **Insulära staden 2025:** 4 527 offentligt ägda bostäder är uthyrda, 15,1 % av de bebodda bostäderna.
- **Kön till allmännyttan 2025:** 2 251 sökande, varav 517 med ISEE under 6 000 €. Omkring 1 200 sökte social housing.
- **Studenter.**
  - Ca' Foscari hade 18 900 inskrivna och IUAV 4 951 (2025/26). IUAV har krympt från 8 915 (2000/01), Ca' Foscari har vuxit från 16 257.
  - ESU erbjöd 1 000 bäddar 2023/24.
  - I enkäten 9mq (1 071 giltiga svar 2023):
    - 67 % av dem som hyr ett rum bor trångt.
    - 36 % bor i en bostad i dåligt eller förfallet skick, och hälften har fukt eller mögel.
    - 23 % kan betala hyran själva, och av dem lägger 90 % mer än 30 % av inkomsten på boendet.
    - 32 % vill stanna i Venedig efter studierna, och 69 % av dem väntar sig svårigheter att hitta bostad.

### 4. Gemenskap, skola och välfärd

- **Valet 24–25 maj 2026** (kommunens valsajt):

  | Område | Valdeltagande |
  |---|---|
  | Hela kommunen | 55,90 % (112 767 av 201 713) |
  | Centro storico | 53,97 % (24 599 av 45 578) |
  | Öarna | 53,54 % |
  | Fastlandet | 56,98 % |

  - Simone Venturini vann med 51,02 % mot Andrea Martellas 39,20 %. I centrum fick Martella 51,40 % och Venturini 34,83 %.
  - Röstlängden i centrum (45 578) är nästan lika lång som folkmängden. En trolig förklaring (egen bedömning) är att italienska medborgare som bor utomlands (AIRE) står kvar i röstlängden. Det sänker den uppmätta andelen.
- **Skolor i centrum** (MIM, 2015/16 → 2024/25):
  - 11 statliga primärskolor:
    - Foscarini 246 → 155
    - Renier Michiel 204 → 118
    - Diaz 241 → 132
    - Canal 194 → 95
    - San Girolamo 171 → 149
    - Gallina 187 → 124
    - Duca d'Aosta (Giudecca) 129 → 83
    - Diedo 125 → 66
    - Zambelli 106 → 121
    - Manzoni 101 → 87
    - Gozzi 85 → 79
  - 4 statliga mellanskolor:
    - Dante Alighieri 532 → 274
    - Morosini 311 → 404
    - Jagher/Sansovino 338 → 172
    - Foscarini 215 → 156
  - Fristående primärskolor 357 → 276.
- **Föreningsliv.** Kommunens föreningsregister har registreringsnummer upp till 3 629 (15 september 2026) och sex områden, från solidaritet till sport. Antalet aktiva föreningar framgår inte. I provinsen finns 55,3 ideella organisationer per 10 000 invånare.
- **Brott (BES 2023, per 100 000 invånare):**

  | Brott | Provinsen | Veneto | Italien |
  |---|---|---|---|
  | Fickstöld | 806,5 | 237,4 | 236,8 |
  | Inbrott i bostad | 347,9 | 327,6 | 250,3 |
  | Rån | 52,9 | 34,3 | 47,6 |
  | Mord | 0,4 | 0,5 | 0,6 |

- **Fattigdom (Eurostat 2025):** AROPE 14,6 % i Veneto och 22,6 % i Italien; fattigdomsrisk 12,4 % respektive 18,6 %.
- **Unga akademiker.** Provinsen tappar 11,3 unga akademiker per 1 000 och år (2023).

## Det jag inte hittade

- **Ensamboende 65+ och hemtjänst.** Varken kommunen eller ISTAT publicerar dem per zon. ISTAT:s tabell över folkräkningens hushållsställning efter ålder för storkommuner (DF_DCSS_POPHH_PHH_1_GC) gick inte att hämta, eftersom servern slutade svara. Hemtjänst (SAD/ADI) per kommun eller ULSS har jag inte hittat.
- **Självskattad hälsa, ensamhet och fysisk aktivitet.** Det finns ingen provins- eller kommunnivå i BES dei territori. PASSI-data för ULSS 3 hittade jag inte på någon känd adress, och sökbudgeten var slut.
- **Ambulansbåtar.** Antal båtar, larm och tider för 118 i den insulära staden saknas.
- **Totalt antal anmälda brott per 100 000.** Jag kunde inte hämta det själv, eftersom ISTAT:s server inte svarade. Kommunens värde finns i `nyckeltal.json` (9 091,8 år 2024).
- **Barnfattigdom per region eller provins.** Den publiceras inte. Bara AROPE för Veneto finns.
- **Volontärer.** Antal per provins enligt ISTAT:s icke-vinstdrivande census kunde inte hämtas.
- **Hyror per m² (OMI) för centrum.** De kräver ett sökformulär. Canone concordato-avtalet hämtades inte.
- **Exakt månad då centrum föll under 50 000.** Månadsfilerna för 2022 är borttagna.
- **Framskrivningar.** Det finns ingen för centrum och ingen för provinsen. ISTAT gör regionala framskrivningar till 2080 och kommunala till 2050.
- **Antal aktiva föreningar** i kommunens register.
- **Medianålder.** Den publiceras inte för centrum, så den är beräknad ur femårsklasser (55,3 år). Medelåldern publiceras: 51,4 år (kommunens svar på fråga 895). Samma klassmittsmetod ger 51,9, alltså ett halvår för högt.

## För berättelsen

**Vardagsliv**

- I centrum är var tredje invånare 65 eller äldre och var åttonde 80 eller äldre. 1 136 personer har fyllt 90.
- 209 barn föddes i centrum 2025, färre än hälften så många som 1991 (455). På ett år dör tre gånger så många som det föds.
- Över hälften av hushållen består av en person. Antalet ensamhushåll har inte ändrats sedan 1991 (omkring 14 800), men familjerna har försvunnit runt dem: hushållen har minskat från 35 242 till 26 499.
- Venetianerna litar mindre på sin omgivning än italienare i allmänhet:
  - en av fem har ingen vän att räkna med
  - var tredje känner sig otrygg på kvällen
  - drygt en tredjedel av hushållen upplever stor eller ganska stor brottsrisk i sitt område
  - Det är fickstölderna som sticker ut: provinsen har 806 anmälningar per 100 000 invånare, mer än tre gånger rikssnittet.
- Studenterna är stadens yngsta invånare men sällan folkbokförda. Omkring 24 000 läser vid universiteten, och två av tre som hyr ett rum bor trångt. Bara var fjärde klarar hyran själv.

**Platser**

- **Ospedale Civile SS. Giovanni e Paolo** i Castello är det enda sjukhuset på öarna i ULSS 3:s lista. Det ligger i den forna Scuola Grande di San Marco och har omkring 310 vårdplatser och en akutmottagning dit patienterna kommer med ambulansbåt.
- **Skolorna:**
  - Primärskolan Diedo i Cannaregio har halverats till 66 elever på nio år.
  - Duca d'Aosta på Giudecca har 83 elever.
  - Mellanskolan Dante Alighieri vid San Marco har gått från 532 till 274 elever.
  - Convitto Nazionale Marco Foscarini i Cannaregio har både primärskola, mellanskola och liceo.
- **San Marco** har 3,75 turistbäddar per invånare och det högsta bostadspriset (5 388 €/m²).
- **Bäddarnas fördelning:**
  - I San Polo finns 70 % av turistbäddarna i lägenheter.
  - Giudecca har kvar flest invånare per bädd (0,43 bäddar per invånare).
  - Bara här står var fjärde bostad utan folkbokförda, mot nästan fyra av tio i resten av centrum.
- **Libreria Marco Polo:** OCIO:s räknare över turistbäddar och invånare står i bokhandelns fönster sedan april 2023.
- **Venessia.com:** nätverket (sedan maj 2000) visar en egen befolkningsräknare på sin webbplats och sprider talet "49.999" på flaggor.
- **Campo di Marte på Giudecca:** här blev ATER klart med 19 nya bostäder 2025, bolagets enda nya bostäder i kommunen det året.

**Historia i siffror**

- 1951 bodde 174 808 människor i den historiska staden, 2025 47 625, alltså 27 % av 1951 års nivå.
- Den största ettårsminskningen kom 1960–61 (−8 252). Mellan 1951 och 1966 minskade folkmängden med i snitt 3 567 per år, samtidigt som Mestre och fastlandet fördubblades.
- **Varför folk flyttade:**
  - CENSIS frågade 1973 dem som flyttat 1964–68. 60,2 % flyttade för att få en sundare och modernare bostad; bara 48,1 % hade haft egna sanitära utrymmen, 25,5 % värme och 35,1 % bodde i bottenvåningar som regelbundet svämmade över.
  - Osservatorio Casa frågade 1992–96: 61,8 % hade flyttat på grund av bostaden.
  - COSES frågade 2009: 60,3 % nämnde höga hyror och priser, och 81 % av dem som ville flytta tillbaka skulle göra det om bostäderna var överkomliga.
- Hyreslagen om "equo canone" (1978) och vågen av vräkningar som följde: 1991–95 utfärdade domstolen i Venedig 1 416 vräkningsdomar och 852 verkställdes. I den insulära staden verkställdes 60 % av domarna, i Mestre 15 % (OCIO, efter Osservatorio Casa 1996).
- Hyresbeståndet i vattenstaden föll från omkring 23 000 bostäder (1971) till 8 909 (2011).
- 1970 pendlade 21 700 personer in till Venedig för att arbeta, medan 4 000–5 000 pendlade ut (CENSIS, enligt OCIO). 2021 uppskattade regionens projekt "Venezia capitale mondiale della sostenibilità" pendlingen in till 55 000 arbetande och studerande per dag.
- 2015–2025 föddes 2 797 barn i centrum och 8 810 människor dog där: sju tiondelar av minskningen är födelseunderskott, inte utflyttning.
- 31 december 2022 var första årsskiftet under 50 000 (49 665).
- Oktober 2024: turistbäddarna gick om invånarna, med 48 469 mot 48 451.

**Lokala debatter**

- **Turistuthyrningen.**
  - "Emendamento Pellicani" (art. 37-bis i lagdekret 50/2022) gav Venedig som första stad i Italien rätt att begränsa korttidsuthyrning i den historiska staden.
  - Kommunens egen förordning kallades efter hand "regolamento Godot" och övergavs enligt OCIO hösten 2025, 1 174 dagar efter lagändringen.
  - Kvar finns två artiklar i byggnadsordningen: art. 42 mot sammanslagna lägenheter och art. 63 om avloppsbrunnar. OCIO menar att båda kringgås.
  - Sedan 1 januari 2025 krävs ett nationellt id (CIN), och Venetos regionala kod (CIR) har krävts sedan 2019. OCIO räknade i januari 2025 70 turistlägenheter inom 150 m från rådhuset Ca' Farsetti; 18,5 % saknade både CIN och CIR.
- **De tomma offentliga bostäderna.**
  - Omkring tusen kommunala och ATER-bostäder i lagunen står tomma i väntan på renovering.
  - ATER renoverar 34 om året medan 150 om året lämnas tillbaka.
  - Kommunen pausade tilldelningen av allmännyttiga bostäder efter författningsdomstolens dom 2024.
- **Social housing eller allmännytta.**
  - Sedan 2018 hyr kommunen ut lediga "icke-ERP"-bostäder till medelinkomsttagare. OCIO menar att det tar bostäder från de fattigaste.
  - I ATER:s bestånd är medelhyran omkring 435 € i social housing mot 165 € i ERP.
  - I september 2026 påstod kommunens bostadschef att 30 % av invånarna i den historiska staden bor i offentligt ägda bostäder. OCIO räknar till 15 %.
- **Hur många bor egentligen här?** Kommunen, OCIO och Venessia.com räknar på olika sätt. Debatten om folkbokförda kontra de som faktiskt bor (studenter, pendlare, andrahandsboende) återkommer varje gång en ny gräns passeras.
- **Valet 2026.** Fastlandet valde center-högerns Simone Venturini, medan centrum röstade på Andrea Martella (51,4 %). Valdeltagandet föll från 62,2 % (2020, enligt kommun-plats-historia) till 55,9 %.

**Beslut framför oss**

- **Regionens lagförslag nr 106 (30 juli 2026) om social housing.** Det ger kommunen en "samlad förvaltning" av ATER:s social housing i den insulära staden i minst 30 år, och kan föra över fler ERP-bostäder utan tak.
- **Ett nytt kommunalt bostadsobservatorium.** OCIO föreslår ett som också räknar tomma bostäder (Osservatorio Casa lades ned 2012).
- **En förordning om korttidsuthyrning enligt art. 37-bis**, eller ett moratorium. Ingen finns i dag.
- **Renovering av omkring 2 900 tomma offentliga bostäder** (1 143 kommunala och omkring 1 720 ATER). Finansieringen kan komma ur Speciallagen, PNRR, regionens bostadsplan på 50 miljoner euro och den nationella "Piano Casa Italia".
- **Studentbostäder.** Hur många ska byggas inom projektet "Venezia Città Campus"? 200 tomma ATER-bostäder är redan upplåtna till IUAV.
- **Skolnätet i centrum** när barnkullarna fortsätter att krympa.
- **Vården för en befolkning där var åttonde är över 80**: hemtjänst, sjukhuset och ambulansbåtar.

**Siffror som berättar**

- 174 808 → 47 625: tre av fyra invånare har försvunnit sedan 1951.
- 1,07 turistbäddar per invånare sedan oktober 2024; 3,75 i San Marco.
- 44,7 % av bostäderna i modellens ruta saknar folkbokförda boende.
- 209 födda och 689 döda i centrum 2025.
- 55,9 % ensamhushåll, och 14 800 ensamhushåll, lika många som 1991.
- 63,7 % av centrumets invånare är födda i Venedig.
- 4 332 €/m² i centrum, 1 660 på fastlandet.
- 33,5 % av ATER:s bostäder står tomma.
- 2 251 sökande i bostadskön, och utbudet räcker till drygt var tionde.
- 806 fickstölder per 100 000 invånare, mer än tre gånger rikssnittet.
- 52,6 % är mycket nöjda med livet, mot 55,2 % i Italien.
