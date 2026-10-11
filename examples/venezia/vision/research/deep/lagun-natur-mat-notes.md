# Lagun, natur, mat och stad – Venezia 2126: metod, källor och berättelsematerial

Sammanställt 2026-10-11 för ämnet **lagun-natur-mat**: 56 poster i `lagun-natur-mat.json`, med engelska texter i `lagun-natur-mat.en.json`. Omfattning: Venedigs lagun (ca 550 km²), Comune di Venezia och centro storico, där modellens kvadrat på 1,8 × 1,8 km ligger (centrum 45,4350 N, 12,3375 E). Veneto och Italien används som jämförelse där samma mått finns för samma år.

## Kort för modellen

| Behov | Värde | Post |
|---|---|---|
| Saltängar (barene) i dag | ca 40 km² (2017, uppskattning); 32–47 km² beroende på metod och år | `lag_barene_idag`, `lag_barene_2002_batymetri` |
| Saltängar för hundra år sedan | 158 km² (1912); 104 km² (1930) | `lag_barene_1912` |
| Förlusttakt | ca 0,5 km² (50 ha) per år 2003–2017; 1,1 km² per år i snitt sedan 1912 | `lag_barene_forlust_per_ar` |
| Återuppbyggnad med muddrat sediment | 1 481 ha till dec 2011 (ca 50–60 ha/år); 16 km² enligt Autorità per la Laguna i dag | `lag_aterskapade_barene` |
| Sedimentbalans | nettoförlust 0,8 miljoner m³/år (1970–2002), varav 0,5 ut i havet; floderna ger bara 0,03 miljoner m³/år | `lag_sediment_nettoforlust`, `lag_sediment_till_havet`, `lag_flodsediment` |
| Djup | medeldjup 1,2 m (kommunen 2019: 1,5 m); vanligaste djupet −0,62 → −0,88 m 1927–2002 | `lag_medeldjup`, `lag_modaldjup_2002` |
| Lagunens delar | 550 km²; av 539 km² lagunyta är 368 km² öppet vatten, 142 km² tidvattenytor, 29 km² öar; därtill 90 km² invallade fiskodlingar | `lag_laguna_yta`, `lag_oppet_vatten` |
| MOSE och lagunen | stängd 3 % av året (2020) → 7–11 % år 2050; minst 25 % mindre sediment på saltängarna | `lag_mose_stangd_tid_2050`, `lag_mose_marsksediment` |
| Vattnets status (EU:s ramdirektiv) | 0 av 11 god ekologisk status, 0 av 14 god kemisk status (PFOS) – klassning 2020–2025 | `lag_wfd_ekologisk_status`, `lag_wfd_kemisk_status` |
| Sjögräs | ca 10 km² återetablerat i norra lagunen 2014–2018; dvärgbandtång 684 → 100 ha 1990–2002 | `lag_sjogras_seresto`, `lag_zostera_noltei` |
| Skyddad natur | fågelskyddsområde 55 158 ha; 62,4 % av kommunens yta | `lag_natura2000_zps`, `lag_skyddad_natur_andel_kommun` |
| Fåglar | 195 672 övervintrande vattenfåglar (medel 2003–07); ca 24 000 flamingor 2025 | `lag_overvintrande_vattenfaglar`, `lag_flamingor` |
| Musslor | 2 159 t odlat 2019 (+661 t vilt) mot ca 40 000 t 1998–99; 1 404 ha; ca 14 miljoner € | `lag_vongole_*` |
| Fiskodlingar (valli) | 9 284 ha i 28 valli | `lag_valli_da_pesca` |
| Fiskhandel | grossistmarknaden 7 000 t (−2,5 %/år sedan 2000); Rialto 7 fiskstånd (ett trettiotal på 1980-talet) | `lag_grossistmarknad_fisk`, `lag_rialto_fiskstand` |
| Grönska | 48,6 m²/inv. (tillgänglig 33,8); 2,9 % av kommunens yta; 28 träd per 100 inv. | `lag_gronyta_*`, `lag_trad_per_100_invanare` |
| Hårdgjord mark | 17,19 % av kommunens yta; +64 ha 2023–2024 | `lag_hardgjord_mark_andel`, `lag_hardgjord_okning` |
| Avfall | 695 kg/inv., 63,7 % sorterat (Veneto 525 kg och 78,2 %, Italien 508 kg och 67,7 %) | `lag_avfall_per_invanare`, `lag_sorteringsgrad` |
| Avlopp | septiktankar (0,4 m³/person) och gamla tunnlar till kanalerna; ingen andel ansluten till centralt reningsverk hittad | `lag_septiktank_krav`, `lag_avlopp_anpassningar` |
| Kulturarv | 83 % av bostadshusen i centro storico byggda före 1919; 2 742 skyddade byggnader; solpaneler förbjudna på hus före 1945; gator kan höjas högst ca 15–20 cm | `lag_byggnader_fore_1919`, `lag_kulturminnesmarkta_byggnader`, `lag_solceller_byggar_grans`, `lag_hojning_max_cm` |

Viktigt om osäkerheten:

- **Saltängsytan är inte ett mått utan flera.** D'Alpaos serie (via kommunen) ger 158 km² 1912 och ca 40 km² 2017, Sarretta m.fl. (batymetri) 68 km² 1927 och 32 km² 2002, Cecconi ca 35 km² (2011). Världsarvsplanen 2012 talar om 20 % av bassängen kring 1900 och drygt 8 % i dag. Modellen bör räkna med ett intervall på 32–47 km² i dag, och en förlust på ca 0,5 km² per år när inget byggs.
- **Återuppbyggnadstakten efter 2011 är oklar.** 1 481 ha (barene och velme, dec 2011) och 16 km² (barene, Autorità per la Laguna, utan datum, läst 2026) är inte säkert jämförbara. Om de är det har takten fallit från ca 60 ha per år till under 10 ha per år ((1 600 − 1 481) / ca 14 år ≈ 8,5 ha/år, egen beräkning).
- **MOSE-effekterna är modellresultat.** Stängningstiden för 2050 och sedimentminskningen bygger på modeller och tre års mätningar.

Ingen källa sträcker sig bortom 2050. Om modellen fortsätter trenderna till 2126 är det ett eget antagande.

## Metod

### Maskinläsbar statistik

- **ISPRA, Catasto Rifiuti**: kommunens tabell 2010–2024 (HTML) och regionens och landets värden ur sidornas diagramdata. Senaste uppdatering 22 juli 2026.
  - Kommunens tabell: https://www.catasto-rifiuti.isprambiente.it/index.php?pg=detComune&aa=2024&regidb=05&nomereg=Veneto&providb=027&nomeprov=Venezia&regid=05027042&nomecom=Venezia&cerca=cerca&&p=1
  - Regionerna 2024: https://www.catasto-rifiuti.isprambiente.it/index.php?pg=regione&aa=2024&regid=Nord
  - Hela landet 2024: https://www.catasto-rifiuti.isprambiente.it/index.php?pg=nazione&aa=2024
- **ISTAT, Ambiente urbano – Anno 2024** (Dati ambientali nelle città, publicerad september 2026). Zip-filen med tabeller lästes med en egen xlsx-läsare (zipfile + XML) i /private/tmp:
  - Pressmeddelande: https://www.istat.it/comunicato-stampa/ambiente-urbano-anno-2024/
  - Tabeller: https://www.istat.it/wp-content/uploads/2026/09/TAVOLE_AMBURB_2024.zip
  - Verde urbano, tavole 2.1, 5.1, 10.1, 11.1–11.2, 12.1, 13.1, 14.1–14.2, 16.1–16.2 och 18.1–18.2.
  - Rifiuti urbani, tavola 6.1 (insamlingssätt).
  - Eco management, tavola 4.1 (gröna upphandlingar; kommunen köpte ingen måltidsservice 2024).
  - Rapporten för 2023, där Venedig lyfts fram för tillgänglig grönska: https://www.istat.it/wp-content/uploads/2025/07/Ambiente-urbano_Anno-2023.pdf
- **ISTAT, folk- och bostadsräkningen 2011**, variabler per räkneområde (sezioni), lokalitet och stadsdel (aree subcomunali): https://www.istat.it/storage/cartografia/variabili-censuarie/dati-cpa_2011.zip
  - Byggnadsvariablerna E3 (bostadshus), E5 (murverk), E8–E16 (byggår) och E28–E31 (skick) summerades.
  - Centro storico = stadsdelarna (CODASC) 1 *San Marco–Castello–Sant'Elena–Cannaregio* och 2 *Dorsoduro–San Polo–Santa Croce–Giudecca–Sacca Fisola*, 57 449 invånare 2011.
  - Lokaliteten *Venezia* (10012) ensam har 51 298 invånare och 7 901 bostadshus, varav 85,3 % från före 1919.
- **ISPRA, Consumo di suolo – estratto dati 2025** (2006–2024, per kommun, provins och region): https://www.isprambiente.gov.it/it/attivita/suolo-e-territorio/suolo/il-consumo-di-suolo/consumo_di_suolo_estratto_dati_2025_anni_2006_2024.xlsx
- **EEA, Natura 2000** (dataset version 2024, REST-fråga mot discomap). Ytorna är GIS-ytor: https://bio.discomap.eea.europa.eu/arcgis/rest/services/ProtectedSites/Natura2000Sites/MapServer/2/query?where=SITECODE+IN+(%27IT3250046%27,%27IT3250030%27,%27IT3250031%27)&outFields=SITECODE,SITENAME,SITETYPE,Area_ha&returnGeometry=false&f=json
- **OpenStreetMap**:
  - Projektets egen `cities/venezia/osm.json`, med polygonytor för leisure=park/garden och landuse=grass inom modellens bbox och antalet natural=tree.
  - Overpass API för koordinater till platser utanför kvadraten (Sant'Erasmo, Venissa, Mercato Ittico, Lio Piccolo, Valle Averto).

### Dokument lästa i minnet (PDF)

Alla PDF:er lästes med pypdf direkt från nätet och sparades aldrig.

**Lagunens form, sediment och restaurering**
- Comune di Venezia, *The Lagoon of Venice – an example of resilience… but for how long?* (C. Ferrari, 2019): https://www.comune.venezia.it/sites/comune.venezia.it/files/documenti/Ambiente/CDC_laguna%20resiliente_Ferrari.pdf
- Cecconi 2011, text om lagunen och skyddsarbetena (på kommunens webbplats): https://www.comune.venezia.it/sites/comune.venezia.it/files/immagini/Ambiente/2011_2_Cecconi.pdf
- *Venezia e la sua Laguna – Piano di Gestione 2012–2018* (Comune di Venezia; arkiverad hos MASE): https://va.mite.gov.it/File/Documento/122611
- SedNet, fallbeskrivning Venedigs lagun: https://sednet.org/download/Case-Venice-lagoon.pdf
- SedNet, Cecconi: *constructed salt marshes*: https://sednet.org/download/Presentation3-Cecconi.pdf

**Sjögräs och vattenstatus**
- ISPRA, *Il trapianto di fanerogame acquatiche… LIFE SeResto* (Quaderni Ricerca Marina 12/2018): https://www.isprambiente.gov.it/files2019/pubblicazioni/quaderni/Quad_RM_12_18_Fanerogame_acquatiche_SERESTO.pdf
- MASE, Sfriso, LIFE SeResto-presentation (2015). Naturtypen 1150* täcker ca 3 660 ha av ZSC IT3250031, och fiskare och jägare deltog i planteringen: https://mase.gov.it/sites/default/files/archivio/allegati/life/workshop_life_20102015_sfriso.pdf
- CNR-ISMAR, *Biodiversità vegetale in Laguna di Venezia* (2025), lästes som bakgrund utan ytsiffror: https://www.ismar.cnr.it/web-content/wp-content/uploads/2025/11/completo-ITA_Biodiversita_vegetale-in-Laguna-di-Venezia_150x210mm.pdf
- Regione del Veneto, DDR n. 16396 del 27/07/2026 (BUR 109 del 11/08/2026): https://burv-be.regione.veneto.it/api/PublicAtti/588372/pdfPreview
  - Allegato A, klassning 2020–2025: https://burv-be.regione.veneto.it/api/PublicAtti/588372/DownloadAttachmentAtto/ALLEGATO%20A.PDF

**Fiske och mat**
- Veneto Agricoltura / Regione del Veneto, *Relazione analisi socio-economica della pesca* (Allegato H – R08, 2021, data för 2019): https://www.regione.veneto.it/documents/6757143/12209810/Allegato_H_R08_Relazione+analisi+socio+-+economica+della+pesca_rev01.pdf/54c847d4-895c-42a5-8219-184b60b7da06
- Osservatorio Socio Economico della Pesca, *Report… distretto nord adriatico – 2016*: https://agricoltura.regione.emilia-romagna.it/pesca/pubblicazioni/osservatorio/report-2016/@@download/file/Report%20sulla%20pesca%20e%20l'acquacoltura%20nel%20distretto%20nord%20adriatico%20-%202016.pdf
- ISPRA, *Dalla pesca all'allevamento della vongola filippina in Laguna di Venezia: il preingrasso* (Quaderni Ricerca Marina 2/2011): https://www.isprambiente.gov.it/contentfiles/00010200/10207-quad-ric-marina2-2011.pdf
- Veritas, *Mercato all'ingrosso di prodotti ittici di Venezia – nota informativa 2022*: https://www.gruppoveritas.it/sites/default/files/documenti/sportello-fai-da-te/relazione_complessiva_anno_2022.pdf
- Comune di Venezia, Mozione n. 555 om Rialtomarknaden (24 jan 2024): https://consiglio2020.comune.venezia.it/pdf/atti_indirizzo/1/502_mozione_555.pdf
- Regione del Veneto, DGR 1274/2025 Allegato B (stöd efter blåkrabban och musseldöden 2024): lästes men gav inga siffror för lagunen. https://elezioni2020.regione.veneto.it/documents/6757143/11213018/Dgr_1274_25_AllegatoB.pdf/a974efe5-f88a-4f40-98c7-2f49fd949d34

**Staden: avfall, avlopp och höjningar**
- Comune di Venezia, svar på interpellation 812 om sophämtningen (12 okt 2023): https://consiglio2020.comune.venezia.it/pdf/atti_ispettivi/risposte_1/730_risposta_interrogazione_812.pdf
- Insula, *Il sistema di smaltimento delle acque reflue* (Quaderni 19, 2004): https://www.insula.it/images/pdf/resource/quadernipdf/Q19-14.pdf
- Insula, *Rialto* (Quaderni 7, 2002): https://www.insula.it/images/pdf/resource/quadernipdf/Q07-09.pdf
- Insula, Quaderni 5 (rialzi), som gav bakgrund: https://www.insula.it/images/pdf/resource/quadernipdf/Q05-05.pdf och https://www.insula.it/images/pdf/resource/quadernipdf/Q05-02.pdf

**Kulturarv**
- Comune di Venezia, *Pannelli fotovoltaici / solari – abaco DL 17/2022 art. 9*: https://www.comune.venezia.it/sites/comune.venezia.it/files/page/files/Abaco_pannelli_DL_17_2022_%20art%209.pdf
- R. Codello, Ateneo Veneto 2013: https://ateneoveneto.org/wp-content/uploads/2023/06/Ateneo-Veneto-CC-III-serie-12_I-2013-estratto-Codello.pdf
- UNESCO, *WHC/21/44.COM/7B.Add* (utkast 44 COM 7B.50, kopia hos wuzonline.de): https://www.wuzonline.de/wp-content/uploads/2021/06/Unesco-Bericht-Venice.pdf

**Fåglar** (nordadriatisk bakgrund)
- Scarton m.fl., Riv. ital. Orn. 82, 2013: https://sisn.pagepress.org/rio/article/download/119/113/290

### Webbsidor

**Forskning**
- Sarretta m.fl. 2010 (abstract, JRC): https://publications.jrc.ec.europa.eu/repository/handle/JRC53192
- Zaggia m.fl. 2017, PLOS ONE: https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0187210
- Tognin m.fl., EGU22-303: https://meetingorganizer.copernicus.org/EGU22/EGU22-303.html
- Ferrarin m.fl. 2024, Frontiers in Climate 5: https://www.frontiersin.org/journals/climate/articles/10.3389/fclim.2023.1330388/full
- Scarton & Bon 2009, Avocetta 33(1): https://riviste.unimi.it/index.php/avocetta/article/view/32455
- Vianello m.fl. 2013 (abstract): https://vbn.aau.dk/da/publications/microplastic-particles-in-sediments-of-lagoon-of-venice-italy-fir

**Myndigheter och kommun**
- MIT, MOSE:s hundrade höjning: https://mit.gov.it/node/20399
- Autorità per la Laguna di Venezia, *M.O.S.E.* (resultat av statens program): https://www.autoritalaguna.it/m-o-s-e/
- MASE, SIN Venezia–Porto Marghera: https://bonifichesiticontaminati.mite.gov.it/sin-1/

**UNESCO:s beslut**
- 44 COM 7B.50: https://whc.unesco.org/en/decisions/7767
- 45 COM 7B.189: https://whc.unesco.org/en/decisions/8110
- 47 COM 7B.113: https://whc.unesco.org/en/decisions/8837
- 48 COM 7B.40: https://whc.unesco.org/en/decisions/9123
- 48 COM 8B.45 (buffertzonen): https://whc.unesco.org/en/decisions/9199
- 43 COM 8B.46: https://whc.unesco.org/en/decisions/7409

**Föreningar och fackpress**
- Slow Food, Carciofo violetto di Sant'Erasmo: https://www.fondazioneslowfood.com/it/presidi-slow-food/carciofo-violetto-di-santerasmo/
- Venice Gardens Foundation, Giardini Reali: https://www.venicegardensfoundation.org/en/royal-gardens-of-venice
- Drinks International 2014 (Venissa): https://drinksint.com/news/fullstory.php/aid/4654/.html
- Wine Economist 2014 (Venissa): https://wineeconomist.com/2014/10/28/venissa/amp/

**Nyheter** (bara där primärkälla saknas)
- AP/PBS 31 maj 2026 (flamingor, saltängar): https://pbs.org/newshour/world/recovering-wetlands-fuel-growth-of-flamingo-population-in-venice
- Il Nordest 8 dec 2024 (LIFE VIMINE och det nya avtalet): https://www.ilnordest.it/dossier/cambiamento-climatico/barene-habitat-naturali-in-pericolo-un-nuovo-protocollo-per-la-salvaguardia-della-laguna-di-venezia-bnqwfogr
- Avvenire 20 nov 2024 (församlingarna): https://www.avvenire.it/chiesa/chiesa-italiana/nel-centro-storico-di-venezia-la-rivoluzione-delle-parrocchie-da-19-a-6_82951
- Gulf News 31 juli 2023 (rubrik: UNESCO föreslår att Venedig förs upp på listan över hotade världsarv; bara rubriken sedd): https://gulfnews.com/world/europe/unesco-recommends-adding-venice-to-list-of-world-heritage-sites-in-danger-1.1690881809746
- Finestre sull'Arte, intervju med patriarken (2023): https://www.finestresullarte.info/interviste/intervista-francesco-moraglia-patriarca-venezia-ticket-numero-chiuso-musealizzare-citta

### Egna beräkningar

| Post | Beräkning |
|---|---|
| lag_oppet_vatten (not) | 368 / 539 = 68,3 % |
| lag_barene_forlust_per_ar | (47 − 40) / 14 = 0,50 km²/år; (158 − 40) / 105 = 1,12; Sarretta (68 − 32) / 75 = 0,48 |
| lag_flodsediment (not) | 0,03 / 0,8 = 3,75 %; 0,03 / 0,5 = 6 % |
| lag_aterskapade_barene (not) | 1 481 ha / ca 25 år ≈ 59 ha/år; Cecconi (11 + 2) km² / 25 år = 52 ha/år. Efter 2011, om måtten är jämförbara: (1 600 − 1 481) / 14 ≈ 8,5 ha/år |
| lag_natura2000_zsc | 26 363,74 + 20 344,23 = 46 707,97 ha |
| lag_vongole_koncessioner_ha (not) | 14,04 / 550 km² = 2,55 % |
| lag_vongole_varde | 2 159 000 kg × 6,50 €/kg = 14 033 500 € ≈ 14,0 miljoner € |
| lag_valli_da_pesca | 5 781 + 3 503 = 9 284 ha; vatten 3 906 + 2 860 = 6 766 ha |
| lag_hardgjord_okning (not) | 185,90 + 67,63 + 14,79 + 42,18 + 5,83 + 30,75 − 2,65 + 21,26 + 35,56 + 20,40 + 64,21 = 485,86 ha nettoökning 2006–2024 |
| lag_byggnader_fore_1919 | 6 960 / 8 375 = 83,1 %. Före 1946: (6 960 + 544) / 8 375 = 89,6 %. Murverk: 8 210 / 8 375 = 98,0 %. Kommunen 9 322 / 34 994 = 26,6 %; Veneto 123 442 / 1 057 276 = 11,7 %; Italien 1 832 504 / 12 187 698 = 15,0 % |
| lag_byggnader_daligt_skick | (2 151 + 88) / 8 375 = 26,7 %. Italien (1 847 767 + 204 041) / 12 187 698 = 16,8 %; Veneto (120 686 + 12 571) / 1 057 276 = 12,6 %; kommunen (4 316 + 278) / 34 994 = 13,1 % |
| lag_unesco_bevarandebeslut | Räkning av 7B-besluten 2014, 2016, 2017, 2019, 2021, 2023, 2025 och 2026 = 8 |
| lag_gronyta_andel, lag_trad_per_100_invanare (noter) | OSM-polygoner med tyngdpunkt i bbox (shoelace-yta i lokal meterprojektion): parker 3,84 ha (9 st), trädgårdar 1,35 ha (26), gräs 0,88 ha, Giardini Reali 4 632 m²; 470 träd som noder. Bbox 321,7 ha, varav land 193,9 ha enligt projektets prepare-logg |
| Siffror som berättar | 694,76 / 507,90 = 1,37 (37 % mer avfall per invånare än Italiens snitt) |

### Processanteckningar

- **Sökningar.** Sökbudgeten, som delas av alla agenter i sessionen, tog slut halvvägs. Därefter användes bara direkta hämtningar av kända adresser, API:er och navigering på webbplatserna.
- **Spärrade webbplatser.**
  - Spärrade för automatisk hämtning: whc.unesco.org:s list- och dokumentsidor (men inte beslutssidorna), iris.unive.it, thesis.unipd.it, unesco.it och comune.venezia.it:s HTML-sidor (Incapsula). Kommunens PDF:er gick att läsa.
  - venissa.it svarade inte. ISTAT:s SDMX-tjänst (esploradati) gick inte att nå, och Overpass var överbelastat för ytberäkningar.
- **PDF:er och nedladdade filer.**
  - Hämtverktyget sparade automatiskt två PDF:er (Avocetta, Riv. ital. Orn.) i sin resultatmapp; båda raderades direkt. Ingen PDF finns kvar på disk.
  - Zip- och xlsx-filer från ISTAT och ISPRA ligger bara i /private/tmp. Inget annat i projektet har ändrats.
- **Överlapp med syskonfilerna.**
  - `kommun-plats-historia.json` har MOSE:s stängningar per år och säsong från Autorità per la Laguna (156 till maj 2026, `com_mose_stangningar_*`). Därför finns här ingen egen post för MOSE-höjningarna; ministeriets räkning (100 till 12 mars 2025) står i noten till `lag_mose_stangd_tid_2050`.
  - Samma fil har `com_barene_aterskapade` (16 km², Autorità per la Laguna) och `com_unesco_varldsarv` (1987, Wikipedia). Här finns `lag_aterskapade_barene` (1 481 ha 2011, med sedimentvolym och takt) och `lag_unesco_inskrivet` med världsarvsplanen som primärkälla.

## Fynd i korthet

1. **Lagunen blir ett grunt hav.**
   - Saltängarna har krympt från 158 km² (1912) till ca 40 km² (2017). Modaldjupet sjönk från −0,62 till −0,88 m 1927–2002, och de grunda bottnarna växte från 88 till 206 km².
   - Nettoförlusten av sediment ökade från 0,3 till 0,8 miljoner m³ per år, och 0,5 miljoner m³ per år går ut i havet. Floderna ger bara 30 000 m³.
   - Orsaker: sättningar, kanalmuddring, mekaniskt musselfiske och fartygssvall. Längs Malamocco–Marghera-kanalen drar sig stranden tillbaka 3–4 m per år.
2. **Restaureringen.**
   - 1 481 ha saltängar och slikbankar byggdes med 22,4 miljoner m³ muddrat sediment till 2011; Autorità per la Laguna anger i dag 16 km², 39 km skyddade kanter och 12 småöar.
   - LIFE VIMINE skyddade 95 ha (2,5 %) med faskiner 2013–2017. LIFE SeResto återetablerade ca 10 km² sjögräs i norra lagunen.
3. **MOSE mot saltängarna.**
   - Över 70 % av saltängarnas sedimentation sker under stormfloder; med barriären i drift minskar den med minst 25 %.
   - Stängningstiden kan växa från 3 % av året (2020) till 7–11 % år 2050, och vattenutbytet i december kan minska med 40 %.
4. **Vattnet.** Ingen av 11 vattenförekomster har god ekologisk status och ingen av 14 god kemisk status (PFOS överallt, PAH på sina håll). Förra cykelns problem var kvicksilver och PBDE i biota.
5. **Natur och fåglar.**
   - Fågelskyddsområdet täcker 55 158 ha, och 62 % av kommunens yta är skyddad natur.
   - 195 672 vattenfåglar övervintrade i snitt 2003–2007, 80 % i fiskodlingarna. Flamingorna nådde ca 24 000 vintern 2025 (AP).
6. **Fiske och mat.**
   - Musselskörden föll från ca 40 000 t (1998–99) till 2 159 t odlat 2019 (+661 t vilt), på 1 404 ha med 547 odlare, värt ca 14 miljoner euro.
   - 28 fiskodlingar (valli) på 9 284 ha. Grossistmarknaden sålde knappt 7 000 t 2022 och minskar med 2,5 % om året.
   - Rialtomarknaden har 7 fiskstånd mot ett trettiotal på 1980-talet.
   - Kronärtskockan från Sant'Erasmo har 14 odlare i Slow Food-presidiet, och vingården Venissa på Mazzorbo är knappt en hektar.
7. **Staden.**
   - Grönytan är 48,6 m² per invånare och 2,9 % av ytan, och kommunen har 28 inventerade träd per 100 invånare. Den tillgängliga grönytan är 33,8 m²; ISTAT lyfte 2023 fram Venedig som bäst bland storstäderna.
   - 17,2 % av kommunens yta är hårdgjord.
   - Avfallet är 695 kg per invånare och 63,7 % sorteras; i centro storico hämtas det vid dörren med kärror och båtar.
   - Avloppet går via septiktankar och gatoli till kanalerna. SIN Porto Marghera omfattar 1 618 ha.
8. **Kulturarvet.**
   - 83 % av bostadshusen i centro storico byggdes före 1919, 98 % i murverk, och 27 % är i medelmåttigt eller dåligt skick.
   - 2 742 byggnader är skyddade. Solpaneler är förbjudna på hus från före 1945, och gator och kajer kan i praktiken höjas högst 15–20 cm.
   - UNESCO har fattat åtta bevarandebeslut sedan 2014; listning som hotat föreslogs 2021 och 2023 men antogs inte, och buffertzonen godkändes inte 2026.

## Luckor och osäkerheter

- **Saltängarnas yta i dag.** Ingen ny officiell kartering hittades. Talet 40 km² är en uppskattning för 2017, och måtten skiljer sig med metod (se ovan). Nyare batymetrier efter 2002 (Provveditorato) hittades inte, inte heller nyare sedimentbalanser.
- **Andelar land/vatten.** Den ofta citerade fördelningen ca 8 % land, 12 % kanaler och 80 % grund, velme och barene kunde inte beläggas i en primärkälla (källan var en spärrad avhandling). Därför används världsarvsplanens indelning: 368/142/29 km² plus 90 km² valli.
- **Sjögräs i hela lagunen.** Uppgiften om ca 56 km² 2003 (Sfriso & Facca, Hydrobiologia 577, 2007) sågs bara i ett sökresultat. Artikeln är låst och iris.unive.it spärrat, så siffran är inte använd.
- **Fartygssvall i staden.** Det finns inga kvantitativa data om skador på kajmurar; det enda mätvärdet gäller industrikanalen.
- **Vattnets kemi.** Klassningen 2020–2025 vilar på ofullständiga kemidata (övervakningen låg nere efter 2019); kvicksilver i biota mättes inte.
- **Fåglar.** Ingen publicerad totalräkning för lagunen efter 2007 hittades. Flamingosiffran kommer från AP.
- **Musslor och fiske.**
  - Inga produktionsdata efter 2019, och blåkrabbans påverkan i just Venedigs lagun (2023–2024) är inte kvantifierad.
  - Antalet fiskebåtar hittades inte, och Rialtosiffrorna kommer ur en politisk motion.
- **Öarnas jordbruk.** Areal och antal jordbruksföretag på Sant'Erasmo, Vignole och Mazzorbo hittades inte (ISTAT:s jordbruksräkning 2020 per kommun gick inte att nå). Ekologisk mat och skolmåltider hittades inte heller; ISTAT:s tabell visar att kommunen inte upphandlade måltidsservice 2024.
- **Grönska i centro storico.** Det finns ingen officiell siffra. OSM-uppskattningen i modellkvadraten (ca 6 ha karterad grönska) underskattar privata trädgårdar och klostergårdar.
- **Avfall i centro storico.** Kommunens svar 2023 anger produktionen 2022 till ”circa 48,65 tonnellate”, uppenbart fel enhet (troligen tusental ton), och den används inte.
- **Avlopp.** Andelen hus i centro storico med septiktank, med eget reningsverk eller utan rening hittades inte. Insulas siffror är från 2004, och Veritas uppgifter för de senaste åren hittades inte.
- **Kulturarv.**
  - Antalet kyrkor och palats saknas i primärkälla; patriarken talar enligt sökresultat om ”ett hundratal kyrkor” i staden, men citatet kunde inte bekräftas. Antalet skyddade byggnader är från 2013.
  - Världsarvets yta (ofta 70 176 ha) kunde inte beläggas eftersom UNESCO:s områdessida är spärrad.
- **Regler.** Solcellsregeln är kommunens översikt från 2022. Om byggnadsreglementet ändrats efter de nationella reglerna för lämpliga områden (2024–2026) har inte kontrollerats.
- **Byggnadsålder.** Den bygger på 2011 års census; nyare data per stadsdel hittades inte.

## För berättelsen

### Platser (koordinater från OpenStreetMap, WGS84)

Inom modellens kvadrat (projektets `osm.json`):

- **Pescherian, Rialtos fiskmarknad** (Mercato del Pesce al Minuto): 45.43965, 12.33376.
  - Byggnaden är från 1907, ritad av Domenico Rupolo.
  - Ett trettiotal fiskstånd på 1980-talet, sju 2024. Byggnaden ovanför beskrivs i motionen som tom sedan 2008, med en terrass mot Ca' d'Oro.
- **Rialtomarknaden (Erberia)**: 45.43959, 12.33456; Rialtobron 45.43807, 12.33559. Grönsaksstånden har gått från 90 till under 13; enligt motionen finns fortfarande en grönsakshandlare från Sant'Erasmo.
- **Ca' d'Oro**: 45.44090, 12.33397, mitt emot Pescherian över Canal Grande.
- **Giardini Reali**: 45.43303, 12.33810 (0,46 ha i OSM). Trädgården vid Piazza San Marco restaurerades av Venice Gardens Foundation och öppnades igen i december 2019, efter ett arbete för drygt sex miljoner euro med stöd av Generali.
- **Punta della Salute, tidvattenmätaren** (Osservatorio Maree, Canale della Giudecca): 45.43069, 12.33666. Nollpunkten för alla höjder i staden; Rialto skyddas till +100 cm över den. Punta della Dogana 45.43086, 12.33643 och Santa Maria della Salute 45.43054, 12.33473.
- **Bacino San Marco**: 45.43110, 12.34726. Sedan 1 augusti 2021 är fartyg över 25 000 bruttoton förbjudna här och i Giudeccakanalen (UNESCO 44 COM 7B.50).
- **San Giorgio Maggiore** (ön): 45.42842, 12.34433; basilikan 45.42936, 12.34340, klostret 45.42912, 12.34292.
- **Gallerie dell'Accademia**: 45.43137, 12.32809. Giardino Malipiero, trädgården vid Palazzo Malipiero: 45.43308, 12.32822.
- **Giardino dell'Ordine di Malta**: 45.43644, 12.34673 (0,33 ha gräs i OSM).
- **Giardini della Biennale** ligger strax öster om kvadraten; vaporettohållplatsen är vid 45.42903, 12.35594.

Utanför kvadraten (Overpass, OSM):

- **Sant'Erasmo**: 45.45897, 12.40825. ”Venedigs köksträdgård” sedan 1500-talet och hem för den violetta kronärtskockan.
- **Venissa, vigna murata** (Mazzorbo): 45.48831, 12.41247. Dorona-druvan, första årgång 2010. Burano: 45.48534, 12.41726.
- **Lio Piccolo**: 45.49024, 12.48966, en av presidiets odlingsplatser i norra lagunen.
- **Mercato Ittico, grossistmarknaden** (Tronchetto): 45.44085, 12.31069. Sedan 1951 på Tronchetto (Veritas), och kommunen planerar en ny byggnad på Isola Nova del Tronchetto.
- **Oasi WWF Valle Averto**: 45.35333, 12.15269. En fiskodling på 500 ha, varav 200 ha sköts av WWF som oas sedan 1988 (världsarvsplanen).
- Malamocco–Marghera-kanalen (stranden drar sig tillbaka 3–4 m per år) och Palude Maggiore i norra lagunen (otillfredsställande ekologisk status) har inte fått koordinater.

### Historia

- **Floderna och lagunens form.**
  - Kommunens historiska karta (1988) visar åtta floder som rann ut i lagunen på 1300-talet; i dag ger tillrinningsområdet bara 30 000 m³ sediment om året.
  - Murazzi, stenvallarna mot havet, byggdes 1740, och vågbrytarna vid inloppen 1800–1900.
  - Industrihamnen i Porto Marghera kom under 1900-talet. Sedan 1850 har lagunen förlorat över 15 000 ha genom invallning, deponier och fiskodlingar (världsarvsplanen).
- **Acqua granda.** Den 4 november 1966 steg vattnet till 194 cm över medelnivån 1895 (Cecconi). Den blev upptakten till speciallagen 171/1973, som gjorde Venedigs räddning till en fråga av ”överordnat nationellt intresse”, och lagen 798/1984 som skapade ”Comitatone” (Autorità per la Laguna).
- **Avloppen.**
  - Sedan hygienreglementet 1933 ska husen ha septiktank före utsläppet i kanalerna. Tunnlarna (gatoli) var på 2000-talet i snitt till hälften igensatta.
  - På 1990-talet tvingade speciallagarna hotell, barer och restauranger att rena sitt avlopp, vilket gav ca 1 800 anpassningar och 85 små reningsverk till 2004.
- **Musselboomen.**
  - 1983 släpptes 200 000 ungdjur av den filippinska musslan ut i södra lagunen. Skörden växte från 1 300 t 1990 till 40 000 t 1998–1999.
  - Det mekaniska fisket rev upp bottnarna och anges som huvudorsak till erosionen 1970–2002; världsarvsplanen räknar olagligt musselfiske som en av lagunens ”makronödlägen”.
  - 2019 skördades 2 159 t i ordnade koncessioner.
- **Restaureringen.**
  - Från slutet av 1980-talet byggde staten saltängar av muddrat sediment: 1 481 ha till 2011.
  - LIFE VIMINE 2013–2017 lät lokalbor skydda saltängskanterna med faskiner, och LIFE SeResto 2014–2018 planterade sjögräs med fiskare och jägare.
- **Världsarvet.**
  - Upptaget 1987 enligt alla sex kulturkriterierna.
  - 2021 föreslog Världsarvscentret listan över hotade världsarv. Inför sessionen beslutade Italien att från 1 augusti 2021 förbjuda fartyg över 25 000 bruttoton i San Marco-bassängen, och kommittén antog ett beslut utan listning.
  - 2023 upprepades förslaget. Kommittén i Riyadh antog ett ändrat beslut som noterade inträdesavgiften för dagsbesökare som ett försök.
  - 2025 och 2026 varnade kommittén för att villkoren för listning kan bli uppfyllda.
- **MOSE.** Barriären har använts sedan oktober 2020, och den hundrade höjningen kom 12 mars 2025 (ministeriet: över 2,6 miljarder euro i undvikna skador).
- **Befolkningen.** Enligt motionen 2024 har centro storico gått från 175 000 invånare för sjuttio år sedan till 49 000. Patriarkatet slog 2025 ihop 19 församlingar till 6.

### Lokala debatter

- **MOSE eller saltängarna.** Forskare i Padova (Tognin, D'Alpaos, Carniello) visar att stormfloderna bär det mesta av saltängarnas sediment, och att varje stängning tar en del av det. Fler stängningar när havet stiger (3 % → 11 % av året 2050) gör lagunen mer instängd. UNESCO (2021, 2023, 2026) kräver att MOSE:s drift anpassas till lagunens ekologi.
- **Hotat världsarv?** Världsarvscentrets utkast 2021 och 2023 ville föra upp Venedig på listan över hotade världsarv på grund av massturism, utflyttning, bristande styrning och klimatet. Kommittén valde ändrade beslut. Kraven gäller en plan för hållbar turism, en bärkraftsstudie, en höjdpolicy (skyline), konsekvensbedömningar och en buffertzon, som underkändes igen i Busan 2026.
- **Fartygen.** Stora kryssningsfartyg är bannlysta från San Marco-bassängen sedan 2021. UNESCO vill att de leds till hamnar utanför lagunen och att en ny hamnplan och nya terminaler föregås av en strategisk miljöbedömning (48 COM 7B.40).
- **Rialto tömms.** Fiskstånd, grönsaksstånd och slaktare försvinner med invånarna. En motion i fullmäktige 2024 kräver en plan för att återuppliva marknaden och den tomma Pescherian.
- **Sopor och båtar.** Hämtningen sker för hand med kärror till båtar. En interpellation 2023 klagade på att stora kärror och båtar skadar marmor och kajmurar, och turistsäsongen kräver timvis tömning av papperskorgar. Avfallet per invånare är 37 % över Italiens snitt eftersom besökarnas sopor räknas på de bofasta.
- **Ett avlopp från medeltiden.** Septiktankar och gatoli till kanalerna i stället för reningsverk. Lagunens vattenförekomster har ingen god kemisk status, och PFOS finns överallt.
- **Solpaneler eller tegeltak.** Solpaneler är förbjudna på alla hus från före 1945 i den historiska staden och tillåts annars bara på plana tak, aldrig på coppi. Det krockar med energiomställningen i en stad där 90 % av husen är från före 1946.
- **Höja staden.** Gator och kajer kan i praktiken höjas högst 15–20 cm innan trösklar och bottenvåningar tar skada. UNESCO bad 2023 om underlag för planerna att höja hela San Marco-insulan innan några beslut fattas.

### Beslut framåt

- **UNESCO** (rapport senast 1 februari 2027 till kommitténs 49:e session):
  - förvaltningsplanen 2024–2030 och kartläggningen av världsarvets värden;
  - en bindande höjdpolicy för alla lagunkommuner och obligatoriska konsekvensbedömningar;
  - en ny buffertzon, gärna med 2019 års gränser;
  - en bärkraftsstudie och en plan för hållbar turism;
  - en strategisk miljöbedömning för hamnen.
- **Lagunens förvaltning.**
  - Autorità per la Laguna, som UNESCO 2026 noterar har inrättats, ska driva MOSE och lagunens morfologi.
  - Nya riktlinjer för hantering av muddrat sediment var under publicering 2021 (UNESCO:s rapport). De avgör hur mycket som kan läggas på nya saltängar.
- **Vattenförvaltningen.** Klassningen 2020–2025 blir underlag för förvaltningsplanen för distriktet Alpi Orientali 2027; PFAS och pesticider står nu i fokus.
- **Saltängarna.** Ett nytt avtal skulle ta upp faskinarbetet från LIFE VIMINE våren 2025 (Il Nordest). Hur mycket ny saltäng som byggs per år avgör om förlusten på ca 50 ha per år vänds.
- **Fisket och maten.** En ny grossistmarknad på Isola Nova del Tronchetto, en plan för Rialtomarknaden (motion 2024) och framtiden för musselodlingen efter 2019 års 2 159 t.

### Siffror som berättar

- **Saltängarna.** 158 km² 1912, ca 40 km² 2017; 1 481 ha återbyggda till 2011, ungefär lika mycket per år som det som försvinner.
- **Sedimentet.** Floderna ger 30 000 m³ per år, havet tar 500 000 m³ och lagunen förlorar netto 800 000 m³.
- **Stranden vid industrikanalen.** Den flyttar sig 3–4 meter per år.
- **Musslorna.** 40 000 ton 1999, 2 159 ton 2019.
- **Rialto.** Ett trettiotal fiskstånd blev 7, 90 grönsaksstånd blev färre än 13 och 27 slaktare blev 2.
- **Fåglarna.** 195 672 övervintrande vattenfåglar, fyra av fem i fiskodlingarna, och ca 24 000 flamingor.
- **Vattnet.** 0 av 14 vattenförekomster har god kemisk status.
- **Husen.** 83 % byggdes före 1919, 98 % har bärande murverk och var fjärde är i medelmåttigt eller dåligt skick.
- **MOSE.** Stängd 3 % av året 2020, upp till 11 % år 2050.
- **Avfallet.** 695 kg per invånare, 37 % mer än Italiens snitt.
- **Kyrkan.** 19 församlingar blev 6.
- **Skyddet.** 2 742 skyddade byggnader i Italiens till ytan minsta Soprintendenza.
