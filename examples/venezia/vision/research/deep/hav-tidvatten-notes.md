# Hav och tidvatten – Venezia 2126: metod, källor och berättelsematerial

Sammanställt 2026-10-11 för ämnet **hav-tidvatten** (havet, tidvattnet, högvattnet, MOSE och klimatet): 62 poster i `hav-tidvatten.json`, med engelska texter i `hav-tidvatten.en.json`. Alla id börjar med `mare_` eller `mose_`.

## Kort för modellen

Alla tidvattennivåer anges i cm över **ZMPS** (zero mareografico di Punta della Salute), medelhavsnivån 1885–1909 med centralåret 1897.

| Behov | Värde | Post |
|---|---|---|
| Höjdsystem | ZMPS; den nationella nollan IGM 1942 (Genova) = ZMPS + 23,56 cm, så 100 cm ZMPS = 76,44 cm IGM | `mare_zmps_till_igm42` |
| Medelvattenstånd i dag | 35,3 cm ZMPS (medel 2020–2025); rekord 41,1 cm år 2024; 1890-talet 0,1 cm | `mare_medelhavsniva_2020_2025` |
| Trend | 2,6 mm/år 1872–2024, 4,8 mm/år 1993–2024; ungefär hälften är sättning | `mare_havsnivatrend_*` |
| Andel av den offentliga gångytan under vatten | 80 cm → 0,1 % · 90 → 2 · 100 → 5 · 110 → 12 · 120 → 28 · 130 → 46 · 140 → 59 · 150 → 70 · 160 → 77 · 170 → 82 · 180 → 85 · 190 → 88 · 200 → 91 % | `mare_oversvammad_andel_080` … `_200` |
| Trösklar i modellens ruta | marken vid Markuskyrkans ingång 63 cm; Piazza San Marco 80 cm; Rialto 105 cm; MOSE 110 cm (reses vid prognos ≥ 101 cm); gångbroarna farbara till 120 cm | `mare_lagsta_punkt_basilikan`, `mare_san_marco_troskel`, `mare_rialto_troskel`, `mose_stangningsgrans` |
| Gångytans medianhöjd | ca 133 cm ZMPS (uppskattning) | `mare_median_gangyta` |
| Kajer och gator ska höjas till | minst 110 cm (förr: "mot 120 cm") | `mare_rialhojning_malniva` |
| Högvatten per år (1966–2021) | ≥ 80 cm 70; ≥ 110 cm 5,2; ≥ 140 cm en gång per 2,5 år | `mare_hogvatten_80_per_ar`, `mare_hogvatten_140_aterkomsttid` |
| Högvatten ≥ 110 cm per årtionde | 1900-talet 2 … 2010-talet 95 | `mare_hogvatten_110_2010_2019` |
| Rekord | 194 cm (4 nov 1966), 187 cm (12 nov 2019) | `mare_rekord_1966`, `mare_rekord_2019` |
| 100-årsnivå i dag | ca 210 cm ZMPS (uppskattning, 200–216) | `mare_hogvatten_100ar_idag` |
| MOSE | 78 luckor, 4 barriärer; 49 stängningar säsongen 2025/26; byggt för 60 cm högre hav och 3–5 stängningar per år | `mose_*` |
| Medelvattenstånd 2100 | RCP2.6 ca 70, RCP8.5 ca 104 cm ZMPS (Zanchettin); AR6 SSP2-4.5 ca 98, SSP5-8.5 ca 115 cm ZMPS (uppskattning) | `mare_rslr_2100_*`, `mare_medelhavsniva_2100_*` |
| Medelvattenstånd 2126 | SSP2-4.5 ca 121, SSP5-8.5 ca 152 cm ZMPS (uppskattning) | `mare_medelhavsniva_2126_*` |
| 100-årsnivå 2100 | ca 2,6 m (RCP4.5) och 3,3 m ZMPS (RCP8.5), uppskattning | `mare_hogvatten_100ar_okning_2100_rcp85` |
| Uppvärmning 2071–2100 mot 1976–2005 | +1,0 / +2,0 / +3,8 °C (RCP2.6 / 4.5 / 8.5) | `mare_temp_okning_*` |
| Tropiska nätter (Tmin > 20 °C) | i dag 66,9 per år (Cavanis 2001–2025); +40 (RCP4.5) och +72 (RCP8.5) till 2071–2100 | `mare_tropiska_natter_*` |
| Dagar över 30 °C | i dag 21,7 per år; +23 (RCP4.5) och +55 (RCP8.5) | `mare_hetdagar_30_*` |
| Sommarnederbörd 2071–2100 | −24 % (RCP8.5), −2 % (RCP4.5) | `mare_sommarnederbord_rcp85` |
| Dricksvatten | 34 brunnar i fem fält på fastlandet; 301 l per invånare och dygn och 41,7 % förluster finns i `nt_vatten_per_inv` och `nt_vattenforluster` (nyckeltal) | `mare_dricksvatten_brunnar` |

**Så kan modellen använda tabellerna.** Med medelvattenståndet M (cm ZMPS) och ett tidvatten T över medelnivån blir vattenytan M + T; andelen översvämmad gångyta läses ur tabellen. Nivåerna för 2100 och 2126 är egna uppskattningar (globalt AR6-medel + 1 mm/år sättning + ISPRA:s medelnivå 1995–2014 = 28,5 cm ZMPS). Två saker gör dem osäkra åt var sitt håll: norra Adriatiska havet kan stiga ca 10 % mindre än det globala medlet, medan sättningen i delar av lagunen är 2–4 mm/år. För åren efter 2100 finns bara AR6:s globala intervall för 2150 (0,66–1,33 m för SSP2-4.5 och 0,98–1,88 m för SSP5-8.5) och Anzidei m.fl. (2025); 2126 är interpolerat. Om medelnivån når ca 121 cm (SSP2-4.5, 2126) ligger ca 30 % av gångytan under medelhavet, och vid 152 cm (SSP5-8.5) ca 70 %. Det är bortom vad tillfälliga stängningar kan hantera: redan 50 cm högre hav än i dag ger enligt Umgiesser (2020) en stängning om dygnet.

## Metod

- **Comune di Venezias Centro Maree.** Comunes webbsidor ligger bakom en botspärr (Incapsula), så sidornas text lästes ur Internet Archives kopior. Kopiorna valdes ur arkivets index före de senaste spärrsidorna; ögonblicksbildernas datum står under Källor. Statiska filer på samma server (PDF, diagram och CSV) gick att hämta direkt. Diagrammen över högvatten per årtionde och per år har talen utskrivna på staplarna och lästes av som bild. Talen per årtionde för tidvatten ≥ 140 cm är min egen räkning ur Comunes lista över alla sådana tidvatten sedan 1872.
- **Översvämningstabellen.** Comunes officiella tabell (sidan uppdaterad 2020-10-02) har två delar: en sammanfattning i hela procent och en detaljtabell med decimaler. Detaljtabellens ytkolumn (m²) stämmer med 2009 års altimetri, medan procenten är uppdaterade, så ytor och procent är inte konsistenta. Posterna använder sammanfattningen och nämner detaljvärdet. Värdet för 80 cm (0,1 %) kommer ur 2009 års skrift *Venezia altimetria*.
- **Medelvattenstånd.** Uppgifterna kommer ur ISPRA:s indikator ICLMM och dess tabell (xlsx, uppdaterad december 2025). Sedan 2020 räknar ISPRA in plattformen Acqua Altas dygnsmedel de dagar MOSE är stängt; utan dem blir värdena 0,1–0,6 cm lägre. Baslinjerna 1986–2005 (23,3 cm) och 1995–2014 (28,5 cm) är egna medelvärden ur tabellen.
- **Projektioner.** Zanchettin m.fl. 2021 (NHESS) ger relativa värden för Venedig i AR5:s RCP-scenarier. För AR6 hittades inga lokala värden (se luckor). Uppskattningarna bygger därför på AR6:s globala intervall i SPM B.5.3 och medianerna i TS Box TS.4, plus 1 mm/år sättning, samma antagande som Zanchettin. För 2126 har värdena interpolerats linjärt mellan 2100 och 2150. 100-årsnivån i dag är en egen anpassning av en exponentiell svans till Comunes frekvenser 1966–2021, justerad med ca 10 cm för dagens högre medelnivå. Ändringen till 2100 kommer ur Lionello m.fl. 2021 (Vousdoukas m.fl. 2018).
- **MOSE.** Stängningarna per säsong och år har lästs ur Autorità per la Lagunas tabell "Sintesi del passato" och listan för 2025/26 på sidan Operatività M.O.S.E. Comunes egna listor (max_dighe_mare_mose_chiuso20xx.pdf) räknar något annorlunda. Uppgifterna om kostnader kommer från Corte dei conti och MIT. Kostnaden per stängning finns bara i nyheter, och det står i posten.
- **Klimat.** ARPAV:s plattform CLINE (clima.arpa.veneto.it) har ett öppet API (`/api/v2/coverages/forecast-time-series/…`). Det har frågats i punkten 12,3375 E, 45,4350 N, modellens centrum. Värdena är ensemblemedel av fem EURO-CORDEX-modeller (ca 12 km). Ändringarna 2021–2050 och 2071–2100 mot 1976–2005 hämtades direkt. Årsmedeltemperaturens ändring räknades ur årsserierna (2071–2099, eftersom 2100 saknas) och stämmer med medlet av ARPAV:s säsongsanomalier. Dagens värden är egna medelvärden av ARPAV:s årsvärden för stationen Venezia – Istituto Cavanis (arpa_v-252), som API:et returnerar som närmaste station (2001–2025). Lokala framtidsvärden har räknats additivt: stationens medel 2001–2025 + modellens ändring från 2001–2025 till 2071–2100.
- **Dricksvatten.** Uppgifterna kommer från Veritas spårbarhetsrapport (data 2023), broschyr och webbsidor. Vattenförbrukningen kommer från ISTAT:s tabeller till världsvattendagen 2024 (Tavola 5–6, år 2022), men den finns redan som `nt_vatten_per_inv` och `nt_vattenforluster` i nyckeltalen och upprepas därför inte som egen post.
- **Övrigt.** Alla PDF:er lästes i minnet (pypdf). Diagram, xlsx och mellanresultat lades i /private/tmp. Inga andra filer i förrådet har ändrats. Andra ämnen har överlappande poster om MOSE (`com_mose_*`, `lag_mose_*`), och värdena stämmer med dessa.
- **Sökbudgeten tog slut halvvägs.** Den delade webbsökningen tog slut efter halva arbetet. Klimat, vatten och de flesta MOSE-uppgifterna hämtades därefter direkt från kända primärkällor (ARPAV:s API, Veritas, ISTAT, Autorità per la Laguna, MIT, Corte dei conti, IPCC). Några luckor nedan beror på det.

## Källor som använts

**Comune di Venezia – Centro Previsioni e Segnalazioni Maree.** Sidornas datum i Internet Archive anges inom parentes.
- Le percentuali di allagamento (2026-09-02): https://www.comune.venezia.it/it/content/le-percentuali-allagamento
- Riferimenti altimetrici (2025-06-17): https://www.comune.venezia.it/it/content/riferimenti-altimetrici
- Variazioni del livello medio del mare (2025-11-19): https://www.comune.venezia.it/it/content/variazioni-livello-medio-mare. Venezia–Trieste (2025-05-13): https://www.comune.venezia.it/it/content/variazioni-livello-medio-mare-venezia-e-trieste. Minime e massime (2025-09-07): https://www.comune.venezia.it/it/content/variazioni-livello-medio-annuo-delle-minime-e-delle-massime
- La subsidenza e l'eustatismo (2026-02-02): https://www.comune.venezia.it/it/content/la-subsidenza-e-leustatismo
- Distribuzione decennale delle alte maree (2025-09-06): https://www.comune.venezia.it/it/content/distribuzione-decennale-delle-alte-maree-110-cm. Diagram: https://www.comune.venezia.it/sites/comune.venezia.it/files/immagini/centro_maree/grafici_statistici/dist_decennale_ve2022.jpg, …/dist_decennale_ve_120_2022.jpg och …/dist_decennale_ve_cnr2022.jpg
- Distribuzione annuale alte e basse maree (2026-04-17): https://www.comune.venezia.it/it/content/distribuzione-annuale-delle-alte-maree-110-cm. Diagram: …/grafici_statistici/dist_annua_ve_cnr110_2022.jpg, …/grafico_m110_2025%20.png, …/grafico_estr_mm2025.png och …/grafico_m50_2025.png. Lågvatten under −60 cm 1981–2020 (CSV): https://www.comune.venezia.it/sites/comune.venezia.it/files/documenti/centro_maree/archivioDati/Minimi_di_marea_minori-60cm_archivio_Centro_Previsioni_e_Segnalazioni_Maree.csv
- Valori caratteristici della marea, med listan över alla tidvatten ≥ 140 cm sedan 1872 (2026-09-02): https://www.comune.venezia.it/it/content/valori-caratteristici-marea-venezia-il-periodo-1872-2015
- Durata e frequenza media della marea 1966–2021 (2025-06-24): https://www.comune.venezia.it/it/content/durata-media-delle-maree2. Diagram: …/grafici_statistici/frequenza_media.png och …/permanenza_della_marea_1966-2021.PNG
- Permanenza della marea 1966–2018 (2019-11-15): https://www.comune.venezia.it/it/content/permanenza-marea-periodo-1966-2015
- Stagionalità della marea (2025-06-24): https://www.comune.venezia.it/it/content/stagionalit-marea
- Le acque alte eccezionali (2026-10-06): https://www.comune.venezia.it/it/content/le-acque-alte-eccezionali. Le basse maree eccezionali (2026-10-06): https://www.comune.venezia.it/it/content/le-basse-maree-eccezionali
- La marea (2026-09-02): https://www.comune.venezia.it/it/content/la-marea. Il contributo meteorologico (2025-07-18): https://www.comune.venezia.it/it/content/il-contributo-meteorologico. Le sesse (2025-08-25): https://www.comune.venezia.it/it/content/le-sesse
- Un po' di storia (2025-11-05): https://www.comune.venezia.it/it/content/un-po-storia
- FAQ (2019-11-08): https://www.comune.venezia.it/it/content/acqua-alta-venezia-domande-frequenti-faq. Interpretare la previsione di marea (2026-06-20): https://www.comune.venezia.it/it/content/interpretare-la-previsione-di-marea. Venezia e l'acqua alta (2025-11-19): https://www.comune.venezia.it/it/content/venezia-e-lacqua-alta. Sirene allertamento (2026-06-20): https://www.comune.venezia.it/it/content/sirene-allertamento-acqua-alta
- Quote altimetriche del suolo cittadino (2025-11-19): https://www.comune.venezia.it/it/content/quote-altimetriche-venezia
- Massimi significativi mare e laguna dal funzionamento MOSE (2025-10-08): https://www.comune.venezia.it/it/content/massimi-significativi-registrati-mare-e-laguna. Tabeller: https://www.comune.venezia.it/sites/comune.venezia.it/files/documenti/centro_maree/archivioDati/archivio_storico/dati_livello/max_dighe_mare_mose_chiuso2020.pdf (samt …2021, …2022, …2023 och …2024.pdf)
- Alta e bassa marea eccezionale, Protezione civile (2025-06-18): https://www.comune.venezia.it/it/content/alta-e-bassa-marea-eccezionale. Commissario delegato (2025-06-13): https://www.comune.venezia.it/it/content/commissario-delegato-emergenza-acqua-alta
- *Venezia altimetria*, aggiornamento 2009 (CPSM och Insula spa): https://www.comune.venezia.it/sites/comune.venezia.it/files/documenti/centro_maree/bibliografia/Venezia%20altimetria.pdf
- *Novembre 2019, un mese di maree eccezionali* (ISPRA, CPSM och CNR-ISMAR): https://www.comune.venezia.it/sites/comune.venezia.it/files/documenti/centro_maree/bibliografia/Novembre_2019_un_mese_di_maree_eccezionali-Dinamica_e_anomalia_dell%27evento_del_12novembre.pdf
- Mozione 182 (2021-02-18), Messa in sicurezza di Piazza San Marco: https://consiglio2020.comune.venezia.it/pdf/atti_indirizzo/1/71_mozione_182.pdf

**ISPRA**
- Crescita del livello medio del mare a Venezia (ICLMM): https://indicatoriambientali.isprambiente.it/it/node/5086 (engelska: https://indicatoriambientali.isprambiente.it/en/node/5086). Tabell 1872–2025: https://indicatoriambientali.isprambiente.it/sites/default/files/indicatori_ambientali/2026-09-21/Tabella%201%20Livello%20medio%20mare%20Venezia.xlsx

**Staten och MOSE**
- MIT, Sistema Mose – edilizia statale: https://mit.gov.it/node/4052
- MIT, den 100:e resningen (12 mars 2025): https://mit.gov.it/node/20399
- MIT, skyddet av Markuskyrkan (3 maj 2019): https://mit.gov.it/node/10415
- Autorità per la Laguna di Venezia – Nuovo Magistrato alle Acque. Operatività M.O.S.E.: https://www.autoritalaguna.it/operativita-m-o-s-e/. M.O.S.E.: https://www.autoritalaguna.it/m-o-s-e/. Rianalisi degli eventi di marea gennaio–febbraio 2026: https://www.autoritalaguna.it/rianalisi-degli-eventi-di-marea-tra-gennaio-e-febbraio-2026/. Piena operatività (D.M. 17/2026): https://www.autoritalaguna.it/lautorita-per-la-laguna-di-venezia-nuovo-magistrato-alle-acque-e-pienamente-operativa/
- Corte dei conti, Deliberazione 92/2024/G (med Del. 35/2023/G om MOSE): https://www.corteconti.it/Download?id=a122f2f4-7a9d-4197-8697-d78fb7c74b65

**Forskning**
- Zanchettin m.fl. 2021, *Sea-level rise in Venice: historic and future trends*, NHESS 21: https://nhess.copernicus.org/articles/21/2643/2021/
- Lionello m.fl. 2021, *Extreme floods of Venice*, NHESS 21: https://nhess.copernicus.org/articles/21/2705/2021/
- Umgiesser 2020, *The impact of operating the mobile barriers in Venice (MOSE) under climate change*, J. Nature Conservation 54 (sammanfattning via Semantic Scholar): https://doi.org/10.1016/j.jnc.2019.125783
- Canu m.fl. 2026, *Cumulative impact of climate change and adaptation measures on Venice and its lagoon*, Scientific Reports: https://www.nature.com/articles/s41598-026-73719-w
- Tognin m.fl. 2021, *Marsh resilience to sea-level rise reduced by storm-surge barriers in the Venice Lagoon*, Nature Geoscience: https://www.nature.com/articles/s41561-021-00853-7
- Ferrarin m.fl. 2024, *Sea level and temperature extremes in a regulated Lagoon of Venice*, Frontiers in Climate (sammanfattning): https://doi.org/10.3389/fclim.2023.1330388
- Faranda m.fl. 2023, *Attributing Venice Acqua Alta events…*, npj Climate and Atmospheric Science: https://www.nature.com/articles/s41612-023-00513-0
- Alberti m.fl. 2023, *Dynamical diagnostic of extreme events in Venice lagoon…*, Scientific Reports (sammanfattning): https://doi.org/10.1038/s41598-023-36816-8
- Cibic m.fl. 2025, *Effects of the mobile gates (MOSE) closure on the ecosystem functioning…*, Frontiers in Marine Science (sammanfattning): https://doi.org/10.3389/fmars.2025.1675001
- Anzidei m.fl. 2025, *Multi-Temporal Relative Sea Level Rise Scenarios up to 2150 for the Venice Lagoon*, Remote Sensing 17(5):820. Endast sammanfattningen har lästs, via DOAJ: https://doi.org/10.3390/rs17050820
- Comerlati m.fl. 2004, *Saving Venice by seawater*, JGR Earth Surface (sammanfattning via Crossref): https://doi.org/10.1029/2004JF000119
- IPCC AR6 WGI. SPM: https://www.ipcc.ch/report/ar6/wg1/downloads/report/IPCC_AR6_WGI_SPM.pdf. Technical Summary: https://www.ipcc.ch/report/ar6/wg1/downloads/report/IPCC_AR6_WGI_TS.pdf
- PSMSL. Venezia Punta della Salute, station 168: https://psmsl.org/data/obtaining/stations/168.php. Venezia S. Stefano, station 39: https://psmsl.org/data/obtaining/stations/39.php

**Klimat – ARPAV**
- CLINE, Piattaforma Clima Nord-Est: https://clima.arpa.veneto.it/. API-mönster: `https://clima.arpa.veneto.it/api/v2/coverages/forecast-time-series/<coverage>?coords=POINT(12.3375%2045.4350)&datetime=..%2F..&include_coverage_data=true&coverage_data_smoothing=NO_SMOOTHING` (lägg till `&include_observation_data=true` för stationsdata). Konfiguration: https://clima.arpa.veneto.it/api/v2/coverages/configuration-parameters?offset=0&limit=100. Regionalt "barometro climatico": https://clima.arpa.veneto.it/api/v2/coverages/time-series/climate-barometer?data_smoothing=MOVING_AVERAGE_11_YEARS&include_uncertainty=true

**Vatten**
- Veritas, Il ciclo urbano dell'acqua – Tracciabilità della risorsa idrica (data 2023): https://www.gruppoveritas.it/sites/default/files/allegati/tracciabilita_risorsa_idrica_report_dati_2023_rev02.pdf
- Veritas, broschyren Acqua Veritas (2021): https://www.gruppoveritas.it/sites/default/files/pubblicazioni/brochure_acqua_vers_19-10-2021.pdf. Presentation med data 2024: https://www.gruppoveritas.it/sites/default/files/allegati/Presentazione%202025_Il%20ciclo%20urbano%20dell%27acqua_rev01%20%28ridotta%29.pdf
- Veritas, Servizio idrico integrato och museet för akvedukten: https://www.gruppoveritas.it/cosa-facciamo/servizio-idrico-integrato. Visita museo, med citatet från Sanudo: https://www.gruppoveritas.it/educazione-ambientale/proposte-educative/visita-museo-acquedotto-venezia
- ISTAT, Le statistiche dell'Istat sull'acqua 2020–2023: https://www.istat.it/comunicato-stampa/le-statistiche-dellistat-sullacqua-anni-2020-2023/. Tavole: https://www.istat.it/wp-content/uploads/2024/03/Istat-GMA2024-Tavole.xlsx

**Nyheter (endast där primärkälla saknas)**
- Il Post, 11 februari 2026: https://www.ilpost.it/2026/02/11/mose-venezia-molto-attivo/ (aktiveringsprognos 101 cm, ca 200 000 euro per resning, över 6,7 miljarder euro, timmar över 100 cm 2024–2026)
- Pagella Politica, 29 november 2022: https://pagellapolitica.it/articoli/costo-mose-venezia (6,2 miljarder euro, 272 000 och 211 000 euro per resning, 63 miljoner per år)
- La Nuova Venezia, 6 april 2026: https://www.nuovavenezia.it/cronaca/mose-costi-energia-crisi-aumenti-gestione-venezia-rxp3873y (energi 4,5 miljoner euro 2025, 31 personer per resning)
- Pilkington Italia, pressmeddelande november 2022 om glasbarriären: https://www.pilkington.com/-/media/pilkington/site-content/italy/news/pdf-pressrelease/2022-11_barriere-in-vetro-pilkington-a-protezione-della-basilica-di-san-marco.pdf

## Det här hittades inte

- **IPCC AR6-värden för mareografen i Venedig.** NASA:s Sea Level Projection Tool (sealevel.nasa.gov/ipcc-ar6-sea-level-projection-tool) svarar 404 i oktober 2026. AR6:s lokala data på Zenodo är ett 9 GB stort arkiv. Därför bygger AR6-posterna på globala intervall plus sättning (uppskattningar). Anzidei m.fl. (2025) har AR6-baserade värden för 2050, 2100 och 2150 per delområde, men MDPI spärrar hämtning, så bara sammanfattningen har lästs.
- **Sambandet mellan ZMPS och EGM2008.** Projektets terräng (Copernicus GLO-30) är en ytmodell i EGM2008 med hustak inräknade; den ger varken gångytans höjd eller ZMPS. Gatuhöjder finns per punkt i Comunes och Insulas portal smu.insula.it (altimetrimodul, 1 cm upplösning), men inte som öppen nedladdning.
- **En officiell 100-årsnivå för Venedig.** Ingen myndighetsuppgift hittades (Distretto Alpi Orientalis riskplan för översvämningar söktes inte), så `mare_hogvatten_100ar_idag` är en egen uppskattning.
- **MOSE:s officiella kostnad per stängning, effekterna på hamnen och planer på ny gräns.** Kostnaden per stängning finns bara i nyheter, och antal försenade fartyg eller kostnader för hamnen hittades inte. Om planerna på en ändrad gräns handlar Il Gazzettinos artikel "Mose, nuove regole e difese alternative per ridurre le alzate" (2026), men den spärrade hämtning. Slussen vid Malamocco är 370 × 48 m (MIT).
- **Glasbarriärens kostnad och exakta skyddsnivå.** Endast motionen (110 cm) och tillverkarens pressmeddelande har lästs.
- **Insulaprogrammens omfattning.** Hur många meter kaj och hur många kvadratmeter gata Insula har höjt hittades inte; staten anger 100 km kajer och stränder för hela lagunen.
- **Comunes klimatanpassningsplan (PAESC) och CMCC:s stadsrapport för Venedig.** De söktes inte, eftersom sökbudgeten var slut. Klimatvärdena kommer i stället direkt från ARPAV.
- **Längre stationsserier.** Stationen Cavanis har data från 2001. Serier från Venezia Tessera (Aeronautica Militare) och en observerad värmeböljestatistik hämtades inte.
- **Skadorna 2019 enligt den statliga kommissarien.** Kommissariens webbplats (commissariodelegato.venezia.it) ligger bakom samma botspärr, och den officiella summan hittades inte. Posten använder den vetenskapliga översiktens "över 460 miljoner euro".
- **Säsongen 2026/27.** Inga stängningar var listade 11 oktober 2026.

## För berättelsen

**Platser (inom modellens ruta om inget annat sägs)**
- **Punta della Salute.** Spetsen vid Salute-kyrkan, där Canal Grande möter Giudeccakanalen. Här står mareograferna som all tidvattenmätning i Venedig utgår från: en på Canal Grande-sidan sedan 1906 och en på Giudecca-sidan sedan 1923. Den 12 november 2019 visade de 187 respektive 189 cm. PSMSL anger 45,4333 N, 12,3333 E, avrundat till en bågminut.
- **Piazza San Marco och Markuskyrkan.** Stadens lägsta plats: 63 cm framför kyrkans ingång och på sina ställen ca 70 cm på piazzan. Vattnet syns redan över 80–82 cm, och vid 140 cm står det upp till 60 cm djupt. Kyrkans narthex med mosaikgolv från 1100-talet översvämmades över 200 gånger om året. I april 2019 fick de gamla avloppen ventiler och pumpar, och 19 november 2022 invigdes en glas- och stålbarriär med sex vattentäta passager.
- **Markustornet (campanile).** Där satt sirenen som från början av 1970-talet varnade för högvatten. I dag sitter högtalare i klocktornen runt staden, och de ger en ton för 110 cm, två för 120, tre för 130 och fyra för 140 cm.
- **Rialto.** Vattnet når bryggorna vid 105 cm. I Palazzo dei X Savi (San Polo 19) vid Rialto sitter Autorità per la Laguna – Nuovo Magistrato alle Acque, den myndighet som sedan 2026 sköter MOSE. Comunes säte är Ca' Farsetti (San Marco 4136). Vid Palazzo Cavalli registrerades lufttrycket 987,5 hPa den 12 november 2019.
- **Riva degli Schiavoni och San Zaccaria.** Den 12 november 2019 hörde Veritas arbetare ett dån före vindbyn på ca 110 km/h. Gångbroarna flög, kiosken vid vaporettobryggan slets loss, och tullens bod på Riva dei Sette Martiri sköts inåt land.
- **Istituto Cavanis i Dorsoduro.** ARPAV:s väderstation (45,4300 N, 12,3281 E). Här uppmättes 95 tropiska nätter 2022 och 52 dagar över 30 °C 2024.
- **Campo Santo Stefano, Palazzo Loredan.** Istituto Veneto satte upp stadens första mareograf här 1871; serien räknas från 1872.
- **Giudecca.** Ingår i Comunes översvämningstabell. Giudeccakanalen och Bacino San Marco är farbara även vid de lägsta lågvattnen.
- **Utanför rutan, i horisonten.** Barriärerna vid Lido-inloppet, 21 luckor vid San Nicolò och 20 vid Treporti, några km österut; Malamocco (19 luckor och en sluss på 370 × 48 m) och Chioggia (18 luckor) längre söderut. Plattformen Acqua Alta (CNR) står ca 8 sjömil ut, och dess värden visar vad staden hade fått utan MOSE. Tronchetto, där en ny pump- och lagringscentral för dricksvattnet byggs. Veritas akveduktmuseum vid Piazzale Roma. Järnvägsstationen, som översvämmas först vid 135 cm.

**Historia**
- **1501.** Tiomannarådet inrättar Magistrato alle Acque. Fransmännen avskaffar ämbetet 1808, österrikarna återinför det, Italien avskaffar det 1866 och det återuppstår 1907 tillsammans med Ufficio Idrografico.
- **Före 1874.** Venedig får sitt dricksvatten ur regnvattencisterner, eftersom marken är lera och inte ger grundvatten. Från 1400-talet fraktas vatten ur Brenta, och från 1600-talet ur kanalen Seriola i båtar ("burchi"). Ca 600 brunnar med sina "vere da pozzo" finns kvar. "Venexia è in aqua et non ha aqua" (Marino Sanudo).
- **1867.** Ett tidvatten på 153 cm noteras, enligt Giordani Soika.
- **1871–72.** Den första mareografen sätts upp i Campo Santo Stefano.
- **18 januari 1882.** Lägsta uppmätta tidvatten, −124 cm.
- **1884.** Den 23 juni invigs akvedukten, byggd av Société générale des eaux, med en fontän på Piazza San Marco.
- **1888 och 1906.** Mareografer sätts upp vid Arsenalen och vid Punta della Salute.
- **1885–1909.** Mätperioden som ZMPS räknas fram ur (centralår 1897).
- **1923.** Mareografen flyttas till Giudecca-sidan.
- **1930–1970.** Pumpning av grundvatten i Porto Marghera sänker marken med ca 12 cm bara 1950–1970, och i Mestre sjunker den 17 mm om året 1968–69.
- **4 november 1966.** Rekordet 194 cm. Vattnet står över 110 cm i 22 timmar och lidona bryts igenom på flera ställen; skadorna beräknas till 400 miljoner euro. Därefter kommer speciallagen 171/1973, som förklarar räddningen av Venedig vara av "överordnat nationellt intresse", och 1984 lag 798 med regeringens "Comitatone".
- **22 december 1979.** 166 cm. Efter den översvämningen inrättar Comune Centro Previsioni e Segnalazioni Maree.
- **1992–1997.** Lag 139/1992 knyter skyddet mot högvatten till stadens underhåll. Ett programavtal sluts 1993, Progetto integrato rii läggs fram 1994 och Insula spa bildas 1997 för att muddra kanaler och höja gator mot +120 cm.
- **2003.** MOSE-bygget börjar.
- **1 december 2008.** 156 cm. Trycket föll 13 hPa på 9 timmar och sirocco blåste 25–40 knop.
- **18 februari 2008.** −83 cm vid 1045 hPa, det högsta lufttrycket på 70 år.
- **2010.** Medelvattenståndet når 40,5 cm, ett rekord fram till 2024 (41,1 cm).
- **29 oktober 2018.** Stormen Vaia ger 156 och 148 cm samma dag. Hade stormfloden sammanfallit med högvattnet hade det blivit ca 220 cm.
- **12 november 2019.** 187 cm i en liten cyklon över Adriatiska havet, och nästan 90 % av staden står under vatten. Under året passeras 140 cm fem gånger, och i november står vattnet över 110 cm i ca 50 timmar. Borgmästaren utses till regeringens särskilda kommissarie.
- **10 juli 2020.** Den första fullständiga provresningen.
- **3 oktober 2020.** MOSE stänger skarpt för första gången.
- **22 november 2022.** Havet når 173 cm ute vid plattformen, medan staden stannar på 66 cm.
- **19 november 2022.** Glasbarriären runt Markuskyrkan invigs.
- **12 mars 2025.** MOSE reser sig för hundrade gången.
- **Säsongen 2025/26.** 49 stängningar, varav 30 mellan 28 januari och 20 februari 2026. Enligt Il Post låg tidvattnet över 100 cm i ca 41 timmar mellan 28 januari och 6 februari, mot drygt fyra timmar samma period 2025.
- **12 februari 2026.** Autorità per la Laguna – Nuovo Magistrato alle Acque förklaras fullt operativ (D.M. 17/2026).

**Debatter och beslut framåt**
- **Var ska gränsen ligga?** MOSE stänger för att hindra 110 cm i staden. Barriärerna reses redan vid en prognos på 101 cm, och under provåret 2020 gällde 130 cm. Mellan 80 och 110 cm är Piazza San Marco och Markuskyrkan oskyddade. Varje stängning bromsar fartygen till Porto Marghera, och Autorità har gjort en ny analys av vintern 2026 "för att förbättra hanteringen". Alberti m.fl. (2023) visar att MOSE dämpar extremerna bäst om barriärerna reses flera timmar före toppen.
- **Kostnaden.** Bygget har fått 6,7 miljarder euro i anslag. Driften kostar enligt nyheter ca 200 000 euro per stängning och 4,5 miljoner euro i energi om året, och underhållet blir dyrare än planerat. Corte dei conti kallar MOSE "extremt energikrävande" ("energivora") och har rekommenderat en solcellsanläggning; avtalet föreskriver provresningar ungefär var 45:e dag när inget högvatten kommer, för att hålla luckorna i skick.
- **Insula San Marco.** Provveditorato vill göra hela området runt piazzan och kyrkan tätt upp till 110 cm. Arbetet har dragit ut på tiden, och glasbarriären var tänkt som en tillfällig lösning.
- **Lagunen eller staden?** Varje stängning stoppar vattenutbytet med havet. Umgiesser (2020) visar att 50 cm högre hav ger en stängning om dygnet och att 75 cm gör lagunen mer stängd än öppen. Enligt Canu m.fl. (2026) blir det 248 stängda dagar om året under RCP8.5, med längre omsättningstid och varmare vatten. Försök med inhägnader i lagunen visar att stängt, stilla vatten ändrar plankton, näringsämnen och bottenliv redan inom 28–48 timmar (Cibic m.fl. 2025). Saltängarna får över 70 % av sitt slam under stormfloder, alltså just då barriärerna stänger (Tognin m.fl. 2021).
- **Efter MOSE.** Barriärerna är byggda för 60 cm högre hav. Med AR6:s globala värden och 1 mm/år sättning nås det efter 2100 med låga utsläpp men redan före 2100 med höga (egen uppskattning). Det som har diskuterats efteråt är att stänga lagunen permanent eller oftare, att höja kajer och gator ytterligare, och att lyfta hela staden genom att pumpa havsvatten ner i ett lager 600–800 m under lagunen. Med 12 brunnar skulle det kunna höja Venedig 11–40 cm på tio år (Comerlati m.fl. 2004). Lionello m.fl. (2021) efterlyser flexibla anpassningsvägar för hela spannet av scenarier.
- **Sättningen.** Den naturliga sättningen är ca 1 mm/år, men lokalt mäts mer, upp till 70 mm/år vid MOSE-byggena. Prognoser för mänskligt orsakad sättning saknas, men historien visar att den kan bidra kraftigt (Zanchettin m.fl. 2021).
- **Dricksvattnet.** Nya ledningar på lagunbottnen och en ny central vid Tronchetto byggs, och 41,7 % av vattnet som matas in i Comunes nät går förlorat (ISTAT 2022).

**Siffror som berättar**
- Två högvatten på minst 110 cm under hela 1900-talets första årtionde, och 95 under 2010-talet.
- Havet står 35 cm högre mot Venedigs stenar än 1897, och 2024 var medelvattenståndet 41 cm.
- MOSE räknades med 3–5 stängningar om året; säsongen 2025/26 stängde det 49 gånger, varav 30 gånger på tre veckor.
- 2019 nådde tidvattnet 140 cm fem gånger. Under 150 år hade det aldrig hänt mer än två gånger på ett år.
- Den 22 november 2022 stod havet 173 cm utanför lagunen, medan Venedig fick 66 cm.
- Markuskyrkans förhall stod under vatten mer än 200 gånger om året.
- Halva gångytan ligger lägre än ca 133 cm. Med 121 cm medelvattenstånd år 2126 (mellanscenariot) ligger var tredje kvadratmeter gata under medelhavet, och med 152 cm (höga utsläpp) sju av tio.
- Lågvattnen försvinner: under −60 cm hände det bara fem gånger 2009–2020, mot 23 gånger bara 1992.
- Vid Cavanis var 95 nätter av 365 tropiska 2022. Under RCP8.5 blir det ca 125 nätter om året vid seklets slut.
- 2024 hade Venedig 52 dagar över 30 °C, och modellerna ger ca 69 per år 2071–2100 under RCP8.5.
- 301 liter vatten per invånare och dygn levereras i Comune di Venezia, nästan dubbelt så mycket som hushållen själva använder (156 liter); turisterna dricker också. Vattnet pumpas upp ur upp till 500 m djupa brunnar på fastlandet. Staden står i vatten men har inget eget, som Sanudo skrev på 1500-talet.

**Att tänka på**
- Alla tidvattennivåer gäller ZMPS (1897) vid Punta della Salute. Nyheter och vissa forskare använder ibland "över medelhavet" i samma betydelse; IGM 1942 ligger 23,56 cm högre.
- Översvämningstabellen avser offentlig gångyta i centro storico och på Giudecca, inte bottenvåningar eller öarna. Äldre tabeller (Frassetto på 1970-talet och 2009 års altimetri) skiljer sig med några procentenheter.
- Sedan oktober 2020 skyddas stadens mätserie av MOSE. Comune och ISPRA ersätter därför stängningsdagarna med värden från plattformen Acqua Alta för att serien ska gå att jämföra med tidigare år.
- Comunes Centro Maree och Autorità per la Laguna räknar stängningar olika: Comune räknar mättillfällen, Autorità stängningar.
- Klimatmodellernas ruta (ca 12 km) är svalare om natten än staden. Stationen Cavanis har nästan dubbelt så många tropiska nätter som rutan. Använd ändringarna, inte rutans absoluta värden, för staden.
- Zanchettins värden gäller referensperioden 1986–2005 och RCP-scenarierna; AR6 använder 1995–2014 och SSP-scenarier. Skillnaden i medelnivå mellan perioderna är 5,2 cm (ISPRA).
