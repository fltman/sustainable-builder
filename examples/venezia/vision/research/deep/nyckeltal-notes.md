# Nyckeltal – Venezia 2126: metod, källor och luckor

Sammanställt 2026-10-11 för ämnet **nyckeltal**. Filen `nyckeltal.json` har 70 poster och de engelska texterna finns i `nyckeltal.en.json`. Ämnet gör för Venedig det som Kolada gör för en svensk kommun. Det är samma sorts standardiserade nyckeltal, och varje not slutar med Italiens och Venetos värde för samma år.

Alla siffror är lästa i källorna nedan. Egna beräkningar har `confidence: "estimate"` och uträkningen står i noten. De gäller andelar, kvoter, belopp per invånare, omräkningar och summeringar. Posterna fördelar sig så här:

- **Säkerhet:** 48 `high`, 20 `estimate` och 2 `medium`.
- **Geografi:**
  - 51 poster gäller Comune di Venezia.
  - 3 gäller centro storico.
  - 14 gäller provinsen (Città metropolitana di Venezia).
  - 2 gäller Veneto.
- **Hållbarhetsmål:** SDG 1, 3–16. SDG 2 och 17 saknas. Mat och jordbruk ligger hos ämnet lagun-natur-mat.

## Kort för modellen

| Behov | Värde | Post |
|---|---|---|
| Folkmängd | 249 385 (1 jan 2026, prov.), 256 083 (2021); centro storico 47 625 (2025), 55 589 (2015) | `nt_folkmangd`, `nt_folkmangd_centro_storico` |
| Förändring | −0,04 % senaste året, −2,62 % på fem år | `nt_befolkningsforandring_1ar/_5ar` |
| Ålder | 0–19: 15,0 %; 65+: 28,5 %; 80+: 10,3 % (2025); medianålder 50,0; medelålder centro storico 51,4 | `nt_andel_*`, `nt_medianalder`, `nt_medelalder_centro_storico` |
| Födda/döda/flyttnetto | 5,68 / 13,4 / +4,5 per 1 000 (2024) | `nt_fodda_per_1000`, `nt_doda_per_1000`, `nt_flyttnetto_per_1000` |
| Turism | 51,8 gästnätter per invånare och 367 turistbäddar per 1 000 invånare (2025) | `nt_gastnatter_per_invanare`, `nt_baddar_per_1000` |
| Klimat | 16,7 t CO2e/inv (2023), varav 11,3 t från el- och energiproduktion (kol i Fusina) | `nt_vaxthusgaser_*` |
| Resor | 460 bilar/1 000 inv; 9 950 platskm och 707,5 resor per invånare i kollektivtrafiken (44 % av platskilometerna på vatten) | `nt_bilar_per_1000`, `nt_kollektivtrafik_*`, `nt_vattenburen_kollektivtrafik` |
| Vatten och avfall | 301 l/inv/dygn levererat, 41,7 % förluster (2022); 694,8 kg avfall/inv, 63,7 % utsorterat (2024) | `nt_vatten_per_inv`, `nt_vattenforluster`, `nt_avfall_per_inv`, `nt_utsortering_andel` |
| Risk | 24,7 % av invånarna i områden med medelhög översvämningsrisk (P2) | `nt_oversvamningsrisk_befolkning` |
| Boende | 17,3 % av bostäderna utan folkbokförda (2021); 2 405 euro/m² i kommunen, 4 332 i centro storico (2025) | `nt_tomma_bostader`, `nt_bostadspris*` |
| Ekonomi | Beskattningsbar inkomst 27 108 euro per skattebetalare (2024); sysselsättning 69,1 % (kommunen, folkräkningen 2024) | `nt_beskattningsbar_inkomst`, `nt_sysselsattningsgrad_*` |
| Demokrati | Valdeltagande 55,90 % (kommunval 2026), 66,29 % (parlamentsval 2022), 47,04 % (EU-val 2024); 33,3 % kvinnor i fullmäktige | `nt_valdeltagande_*`, `nt_kvinnor_kommunfullmaktige` |

## Metod

1. **Nivåer.** Kommunen i första hand, sedan centro storico där kommunen publicerar det. Därefter provinsen (Città metropolitana di Venezia, NUTS 3 ITH35) och Veneto där ingen kommunsiffra finns. Hälsa, arbetskraftsundersökningen, BES-indikatorerna och BNP finns från provinsnivå och uppåt. Fattigdomsrisk och tidiga skolavhopp finns bara för regionen.
2. **Jämförelser.** Jämförelserna i noterna kommer från samma källa och samma år som posten. Där det inte går står det i noten varifrån de kommer:
   - Eurostats regiondata.
   - Summering av alla kommuner i samma fil (MEF, folkräkningen, valarkivet).
   - Formen är alltid "Italien X, Veneto Y (år)."; saknas ett värde står det i stället varför.
3. **Provinshuvudorter.** ISTAT:s miljöstatistik för städer (Dati ambientali nelle città) finns bara för de 109 provinshuvudorterna. Där är "Italien" summan av dem, och den nordöstra regionen (ITD) anges som komplement. För Veneto anges spannet bland de sex andra provinshuvudorterna (Verona, Vicenza, Belluno, Treviso, Padova, Rovigo), eftersom databasen saknar ett regionalt aggregat. Undantaget är BES-filen, som har provinshuvudorterna i Veneto som aggregat för grönytor och kollektivtrafik.
4. **Luftkvalitet.** ISTAT redovisar värdet för stadens sämsta mätstation. Ett riksvärde för det måttet finns inte, och då står det så i noten. EU:s och WHO:s gränsvärden anges i stället.
5. **Nämnaren.** Per capita-mått räknas på de folkbokförda, som i all officiell statistik. I Venedig blåser turismen upp avfall, vatten, kollektivtrafikresor och anmälda brott per invånare. Noterna säger det där det spelar roll.
6. **ISTAT:s API spärrades.** ISTAT:s SDMX-tjänst (esploradati.istat.it) blockerade min IP-adress kl. 08.37, efter ungefär 65 anrop med minst 16 sekunders mellanrum. ISTAT:s anvisningar för API:t anger högst 5 anrop per minut och att adresser som överskrider gränsen spärras i upp till ett par dygn. Därför kunde några Veneto-jämförelser från ISTAT inte hämtas (se luckorna). De ersattes där det gick med Eurostat, som publicerar ISTAT:s regiondata, och med BES dei territori-filen.
7. **PDF-filer** lästes i minnet med pypdf och sparades aldrig. Hjälpfiler låg bara under /private/tmp. Inga inloggningar eller konton användes.

## Källor och hur man hämtar siffrorna igen nästa år

### 1. ISTAT – SDMX-tjänsten (esploradati.istat.it)

**Hämtning.** Bas-URL är `https://esploradati.istat.it/SDMXWS/rest/data/<dataflow>/<nyckel>?startPeriod=ÅÅÅÅ`. Skicka huvudet `Accept: application/vnd.sdmx.data+csv;version=1.0.0` för att få CSV. Håll högst 2 anrop i minuten. Hämta dataflödets struktur med `.../rest/datastructure/IT1/<DSD>/latest?references=none` innan du bygger nyckeln, för misslyckade anrop räknas också.

**Områdeskoder.** ISTAT använder de gamla NUTS-koderna:

| Område | Kod |
|---|---|
| Comune di Venezia | `027042` |
| Provinsen | `ITD35` (inte ITH35) |
| Veneto | `ITD3` (inte ITH3) |
| Italien | `IT` |
| Nordöstra Italien | `ITD` |
| Övriga provinshuvudorter i Veneto | `023091` Verona, `024116` Vicenza, `025006` Belluno, `026086` Treviso, `028060` Padova, `029041` Rovigo |

| Poster | Dataflöde och nyckel |
|---|---|
| `nt_folkmangd`, `nt_befolkningsforandring_*` | `22_289/A.027042+IT+ITD3.JAN.9.TOTAL.99?startPeriod=2021`. Nästa års provisoriska siffror kommer i mars–april. |
| `nt_andel_0_19/65_plus/80_plus`, `nt_forsorjningskvot` | `22_289_DF_DCIS_POPRES1_9/A.027042.JAN.9..99?startPeriod=2025`. Ettårsklasser för Venetos kommuner; summera själv. Italien och Veneto i ettårsklasser finns i `22_289_DF_DCIS_POPRES1_1`. |
| `nt_flyttnetto_per_1000`, `nt_hushall_antal` | `22_315/A.027042..9?startPeriod=2020` (bilancio). Koderna är LBIRTH, DEATH, NTGROW_REGOF, INTNETMIGR_REGOF, INTERTNMIG_REGOF, TOTAL_BAL, NUMPRHO_CP, HOUSMEMB_CP och POPCOM_CP. 2025 är provisoriskt. |
| `nt_sysselsattningsgrad_15_64` | `150_915/A.ITD35+ITD3+IT.EMP_R.9.Y15-64.99.TOTAL?startPeriod=2023` |
| `nt_arbetsloshet_15_74` | `151_914/A.ITD35+ITD3+IT.UNEM_R.9.Y15-74.99.TOTAL.TOTAL?startPeriod=2023` |
| `nt_sysselsattningsgrad_kommun`, `nt_arbetsloshet_kommun` | `DF_DCSS_ISTR_LAV_PEN_2_TV_3/A.027042+IT+ITD3..T......` (permanenta folkräkningen, ålder × CUR_ACT_STAT). Sysselsatta = kod 1, total = 99, arbetskraft = 22, arbetssökande = 12. Summera åldersklasserna Y15-24, Y25-49 och Y50-64. Kön kodas `T` i folkräkningens dataflöden. |
| `nt_tomma_bostader` | `DF_DCSS_ABITAZIONI_TV_1/A.027042+IT.......` (NUM_DW_AV, NUM_OCC_DW_AV, NUM_UNOCC_DW_AV; 2019, 2021 och 2023). Veneto 2021 är hämtat ur Eurostat `cens_21dwob_r3`. |
| `nt_forskoleplatser_0_2` | `47_850_DF_DCIS_SERVSOCEDU1_6/A.027042+IT.P_100CH_Y0_2.ALL.ALL.?startPeriod=2021`. Huvudmannen anges som 1 = offentlig, 2 = privat och 9 = totalt. TIME_PERIOD 2023 motsvarar verksamhetsåret 2023/24, som ISTAT publicerade i februari 2026. |
| `nt_anmalda_brott_per_100000` | Kommunen: `73_67_DF_DCCV_DELITTIPS_8/A.027042.CRIMET.TOT..?startPeriod=2021` (storstäder). Italien och provinser: `73_67_DF_DCCV_DELITTIPS_9/A.IT+ITD3+ITD35.CRIMET.TOT..?startPeriod=2021`. |
| Miljö i städerna, `609_1_DF_DCCV_URBANENV_<n>` | Nyckel `A.<områden>.<DATA_TYPE>`. Delflödena listas i nästa tabell. |

| Delflöde | Datatyper (poster) |
|---|---|
| 1 vatten | W_SUPPL, W_FEDMUN, W_TOTLOS: vattenräkningen, senast 2022 (`nt_vatten_per_inv`, `nt_vattenforluster`) |
| 4 luft | MAXDPM10, HIGDPM10, HIGMEANNO2, HIGMEANPM2 (`nt_pm10_*`, `nt_no2_arsmedel`). Aggregatet IT i detta delflöde är inget medelvärde och ska inte användas. |
| 7 el | CELECT100, CELECTGWH (`nt_elanvandning_per_inv`) |
| 8 sol | TPPHKLW1000, NETEKWH1000 (`nt_solceller_kw_per_1000`) |
| 11 hållbar mobilitet | BILANESKM, BILANES100KM (`nt_cykelvag_per_inv`) |
| 12 fordon | CPASCAR1000, FULECAR1000, HYBCAR1000 (`nt_bilar_per_1000`, `nt_elbilar_andel`) |
| 13 kollektivtrafik | TOFTKM, TOFTKMMIL, ODELWSEATKM, SEATKMWATMIL, TOTDEPC, LOCTP (`nt_kollektivtrafik_*`, `nt_vattenburen_kollektivtrafik`) |
| 18 grönytor, täthet | DPROPINC, TDGREARPINC (`nt_skyddad_natur_andel`) |
| 19 grönytor, tillgång | AVURSQM, AVUSURSQM (`nt_gronyta_per_inv`) |

Hushållens elförbrukning per invånare i provinshuvudorterna finns i rapporten [Trasformazioni e innovazioni nei consumi elettrici delle città capoluogo – Anno 2024](https://www.istat.it/wp-content/uploads/2026/07/Trasformazioni-e-innovazioni-nei-consumi-elettrici-delle-citta-capoluogo_Anno-2024.pdf), juli 2026. Där syns den bara i ett diagram. Rapporten anger att Venedig har den högsta totala förbrukningen bland storstäderna, 51,3 toe/100 inv. Datatypen för hushållen ska finnas i IstatData men var inte hämtbar efter spärren.

### 2. ISTAT – BES dei territori, utgåvan 2025

- [Bes_dei_territori_edizione_2025.zip](https://www.istat.it/wp-content/uploads/2025/06/Bes_dei_territori_edizione_2025.zip), länkad från [BES dei territori – edizione 2025](https://www.istat.it/notizia/bes-dei-territori-edizione-2025/).
- Zip-filen innehåller `Indicatori_per_provincia_sesso_ed.2025.xlsx` med en rad per indikator, kön och område och kolumnerna V2004–V2024. Den innehåller också `Metadati_IT_ed.2025.xlsx` med definitioner och källor.
- Filtrera på TERRITORIO = Venezia, Veneto eller Italia och SESSO = Totale, Maschi eller Femmine.
- Indikatorkoderna som används:

| Kod | Post |
|---|---|
| 01SAL001 | `nt_medellivslangd_*` |
| 01SAL020 | `nt_undvikbar_dodlighet` |
| 02IST003P-N22 | `nt_hogskoleutbildade_25_39` |
| 02IST006-N22 | `nt_neet_15_29` |
| 04BEC001P | `nt_disponibel_inkomst_per_inv` |
| 07SIC005P och 07SIC004P | `nt_fickstolder_per_100000` |
| 10AMB016 | `nt_fornybar_el_andel` (Terna) |
| 12SER002P | `nt_specialistlakare_per_10000` |
| 12SER003P-N25 | `nt_sjukhussangar_per_10000` |
| 12SER020 | `nt_bredband_ftth` (Agcom) |
| 10AMB003, 10AMB014, 10AMB008, 12SER008, 12SER002 | jämförelsevärden i andra noter |

- En ny utgåva brukar komma i slutet av året. Filnamnet byter årtal.

### 3. Eurostat

**Hämtning.** API:t är `https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/<tabell>?<filter>&lang=EN` och svarar i JSON-stat. Venedigs kod i stadsstatistiken (Urban Audit) är `IT011C`. NUTS-koderna är Italien `IT`, Veneto `ITH3` och provinsen `ITH35`.

| Tabell | Filter | Poster |
|---|---|---|
| `urb_cpopstr` | `indic_ur=DE1073V` | `nt_medianalder` |
| `urb_cfermor` | `indic_ur=SA2007I, SA2007V, SA2029I, SA2019V` | födda och döda |
| `urb_ctour` | `indic_ur=CR2011I, CR2001V, CR2011V, CR2010I, CR2009V` | turism |
| `urb_ceduc` | `indic_ur=TE2025V, TE2028V, TE2031V` | `nt_hogskoleutbildade_25_64` |
| `urb_ctran` | `indic_ur=TT1057I` | Kontroll av bilinnehavet: 443,85 per 1 000 år 2024 |
| `demo_r_pjanind2` | | Andelar 0–19, 65+, 80+, kvoter och medianålder för Italien och Veneto |
| `demo_r_gind3` | `indic_de=JAN, GBIRTHRT, GDEATHRT, CNMIGRATRT` | |
| `demo_r_d3dens` | | Täthet |
| `edat_lfse_04` | `age=Y25-64` | |
| `edat_lfse_16` | | |
| `edat_lfse_22` | `age=Y15-29` | |
| `ilc_peps11n` | | |
| `nama_10r_3gdp` | `unit=EUR_HAB, PPS_EU27_2020_HAB` | |
| `tour_occ_nin2` | `nace_r2=I551-I553, c_resid=TOTAL, unit=NR` | |
| `tour_cap_nuts2` | `accomunit=BEDPL` | |
| `tran_r_vehst` | `vehicle=CAR` | Antal och per tusen invånare |
| `tran_r_elvehst` | `CAR, PC` | |
| `cens_21dwob_r3` | `building=TOTAL` | |
| `env_air_gge` och `sdg_13_10` | Italien: CRF1A1, CRF1A2, CRF1A3, CRF1A3B, CRF2 och TOTX4_MEMO | |

### 4. ISPRA

- **Avfall** (`nt_avfall_per_inv`, `nt_utsortering_andel`). Källan är Catasto rifiuti:
  - [kommunsidan](https://www.catasto-rifiuti.isprambiente.it/index.php?pg=detComune&aa=2024&regidb=05&nomereg=Veneto&providb=027&nomeprov=Venezia&regid=05027042&nomecom=Venezia&cerca=cerca&&p=1)
  - CSV för kommunen: `get/getDettaglioComuneOracleVer1.csv.php?pg=comune&aa=2024&regid=05027042`
  - CSV för regionerna: `get/getRaccoltaRegione.csv.php?pg=regione&aa=2024&regid=`
  - CSV för landet: `get/getRaccoltaNazionale.csv.php?pg=nazione&aa=2024`

  Byt `aa=` mot det nya året. Data för 2025 väntas i december 2026; sidan uppdaterades senast 22 juli 2026.
- **Markexploatering** (`nt_markanvandning_*`). Excelfilen heter [consumo_di_suolo_estratto_dati_2025_anni_2006_2024.xlsx](https://www.isprambiente.gov.it/it/attivita/suolo-e-territorio/suolo/il-consumo-di-suolo/consumo_di_suolo_estratto_dati_2025_anni_2006_2024.xlsx) och har flikarna Comuni, Province och Regioni. Den länkas från sidan "I dati sul consumo di suolo". Nästa rapport kommer i oktober och filnamnet byter årtal.
- **Översvämningsrisk och kommunens yta** (`nt_oversvamningsrisk_befolkning`, `nt_befolkningstathet`). Källan är IdroGEO:s JSON-API:
  - `https://idrogeo.isprambiente.it/api/pir/comuni/27042`
  - `https://idrogeo.isprambiente.it/api/pir/regioni/5`
  - `https://idrogeo.isprambiente.it/api/pir/italia`

  Fälten är `pop_idr_p2`, `popidp2_p`, `popidp1_p` och `ar_kmq`. Befolkningen är folkräkningen 2021. API:t anger inte vilket år faromosaiken gäller.

### 5. ARPAV och Regione del Veneto – INEMAR Veneto 2023

Inventeringen gavs ut i januari 2026. Två öppna CSV-filer används:

- totalerna per kommun i [inemarveneto2023_totalicomunali.csv](https://www.arpa.veneto.it/dati-ambientali/open-data/file-e-allegati/emissioni-2023/inemarveneto2023_totalicomunali.csv/@@download/file), med CO2 i kt och CH4 och N2O i ton;
- detaljerna per makrosektor, aktivitet och bränsle i [inemarveneto2023_emiss_comunali.csv](https://www.arpa.veneto.it/dati-ambientali/open-data/file-e-allegati/emissioni-2023/inemarveneto2023_emiss_comunali.csv/@@download/file).

CO2e räknades med GWP100 enligt IPCC AR5 (CH4 28, N2O 265). F-gaser ingår inte, och skogens upptag ingår i makrosektor 11 (Venetos värde är −1 702 kt). Utsläppen delades med ISTAT:s medelfolkmängd 2023 (250 602 i kommunen och 4 850 885 i Veneto). Inventeringen görs vartannat år, så nästa utgåva gäller troligen 2025. Den hittas via ARPAV:s sida [Inventario emissioni](https://www.arpa.veneto.it/temi-ambientali/aria/inventario-emissioni).

### 6. MEF, Dipartimento delle Finanze

- Inkomstdeklarationer per kommun finns i [Redditi_e_principali_variabili_IRPEF_su_base_comunale_CSV_2024.zip](https://www1.finanze.gov.it/finanze/analisi_stat/public/v_4_0_0/contenuti/Redditi_e_principali_variabili_IRPEF_su_base_comunale_CSV_2024.zip). Filen avser inkomståret 2024 och länkas från [Open data comunali IRPEF](https://www.finanze.gov.it/it/statistiche-fiscali/open-data-comunale-principali-variabili-irpef/).
- Medelvärdet är "Reddito imponibile – Ammontare" delat med "Reddito imponibile – Frequenza".
- Italien och Veneto är summerade över alla kommuner i filen.
- Inkomståret N publiceras våren år N+2. Samma serie finns i ISTAT:s databas som `30_1008_DF_MEF_REDDITIIRPEF_COM_1`, men där bara till och med 2023.

### 7. Inrikesministeriet

**Valdeltagande** (`nt_valdeltagande_*`). Källan är Eligendos [historiska arkiv](https://elezionistorico.interno.gov.it/). URL:erna byggs upp nivå för nivå: område, region, provins, kommun. Venedig har kommunkoden `870420` (i parlamentsvalet `110870420`) och provinsen koden `87` i ministeriets numrering.

| Val | URL-parametrar |
|---|---|
| Kommunvalet 2026 | `tpel=G&dtel=24/05/2026`. Exakt URL i posten; 2020 får man genom att byta till `dtel=20/09/2020`. |
| Deputeradekammaren 2022 | `tpel=C&dtel=25/09/2022`. Kommunen ligger i valkrets Veneto 1, enmanskrets U01. Veneto = Veneto 1 (1 015 657 röstande av 1 480 472) + Veneto 2 (1 600 342 av 2 247 540) = 70,17 %. |
| Europaparlamentet 2024 | `tpel=E&dtel=09/06/2024`. Arkivet har riket, Nordöstra valkretsen, Veneto, provinsen och kommunen. |

Livesidan elezioni.interno.gov.it och dess API (eleapi) svarade inte på anrop utanför webbläsaren, och arkivet räcker.

**Kvinnor i fullmäktige.** Källan är DAIT:s register över lokala förtroendevalda, [Amministratori locali e regionali in carica](https://dait.interno.gov.it/elezioni/open-data/amministratori-locali-e-regionali-in-carica), uppdaterat 24 augusti 2026:
- `https://dait.interno.gov.it/documenti/provincia_di_venezia.csv` för Venedig;
- `https://dait.interno.gov.it/documenti/ammcom.csv` för hela Italien.

Räkna rader där `descrizione_carica` börjar med "Consigliere", efter `sesso`. ISTAT:s BES ger ett närliggande mått för provinsen: kvinnor bland alla förtroendevalda i kommunerna, 36,1 % år 2024.

### 8. Agenzia delle Entrate – OMI

- Källan är [Statistiche regionali Veneto 2026](https://www.agenziaentrate.gov.it/portale/documents/20143/10101383/SR2026_VENETO.pdf/b9d7b4cb-c99d-7191-ca20-902b5540bbc9?t=1780658612084) med 2025 års data.
- Tabell 8 har noteringar för provinshuvudorterna och övriga provinsen. Tabell 14 har makroområdena i kommunen, och tabell 12 antalet nya hyreskontrakt (6 994 år 2025, IML 11,6 %).
- Rapporten läses i minnet. Den årliga utgåvan kommer i juni och länkas från OMI:s sida [Statistiche regionali](https://www.agenziaentrate.gov.it/portale/schede/fabbricatiterreni/omi/pubblicazioni/statistiche-regionali).
- Den nationella rapporten Rapporto Immobiliare 2026 ger hyror per region men inte för Venedig. Ordinarie långa kontrakt kostade i snitt 81,5 euro/m² per år i Italien och 75,2 i Veneto.

### 9. Comune di Venezia

- Uppgifterna för centro storico (`nt_folkmangd_centro_storico`, `nt_medelalder_centro_storico`) kommer från kommunens statistik ur folkbokföringen. Den bifogades ett svar i kommunfullmäktige: [895_variazioni_2015-2025etamedia.pdf](https://consiglio2020.comune.venezia.it/allegati/atti_ispettivi/risposte_1/895_variazioni_2015-2025etamedia.pdf).
- Tabellen anger år men inte datum. Ämnet kommun-plats-historia anger samma tal som 31 december 2025.
- www.comune.venezia.it skyddas av Incapsula och svarar inte på skriptade anrop. På dati.venezia.it fanns vid kontrollen främst äldre befolkningsfiler.
- Nästa år: leta efter kommunens "Popolazione residente per zona e municipalità" eller ett nytt svar i fullmäktige.

## Luckor

- **Veneto i ISTAT-poster.** På grund av API-spärren saknas Venetos värde för anmälda brott (`nt_anmalda_brott_per_100000`) och förskoleplatser per 100 barn (`nt_forskoleplatser_0_2`). Hushållens antal och storlek saknas också (`nt_hushall_antal`). Hämta med koderna ovan (ITD3) när spärren släppt.
- **Övrigt som föll bort med spärren:**
  - folkräkningens BES-frågor för storstäder: livstillfredsställelse, trygghet att gå ute i mörker, vänner och grannar att räkna med (`DF_DCSS_BEST_PPC_2/4/6_GC`); de hade motsvarat Koladas mått på tillit och trygghet;
  - utbildningsnivå per kommun ur folkräkningen (`DF_DCSS_ISTR_LAV_PEN_2_TV_1`);
  - upplåtelseform (`DF_DCSS_HUDW_1_COM`);
  - trångboddhet (`DF_DCSS_HUDW_4_PROV`);
  - ISTAT:s officiella yta för kommunen (SITUAS).

  Ytan 418,4 km² kommer i stället från ISPRA.
- **Hushållens elförbrukning.** Den finns bara i diagram för Venedig. Posten `nt_elanvandning_per_inv` gäller all förbrukning från distributionsnätet.
- **Hyresnivå i Venedig.** OMI:s hyresnoteringar per zon finns i databasen BDQ men inte som tabell för kommunen. Hyresannonsportaler är inga primärkällor och användes inte.
- **Medellivslängd, NEET, hälso- och sjukvård, BNP, disponibel inkomst och bredband** finns bara för provinsen. **Fattigdomsrisk och tidiga skolavhopp** finns bara för Veneto. Kommunens arbetsmarknad finns bara i folkräkningen.
- **Jämförelser som saknas helt:** luftkvalitet (inget riksvärde för måttet sämsta station) och kommunvalets deltagande (valen hålls inte samtidigt). Bostadspriset har inget nationellt OMI-medel.
- **Klimat.** Kommunens egen inventering i klimatplanen (PAESC) användes inte. Den hör till ämnet kommun-plats-historia. INEMAR saknar F-gaser och räknar territoriellt, inte konsumtion.
- **Fritidshus och korttidsuthyrning** i centro storico finns inte här, och inte heller åldersfördelning per stadsdel. Tomma bostäder (folkräkningen) är närmaste mått.
- **SDG 2 och 17** saknas i ämnet.

## Tolkning och avvikelser mot andra ämnesfiler

- **Gästnätter per invånare.** Den här filen anger 51,8 (Eurostats stadsstatistik, nätter delat med folkmängden 1 januari 2025). Ämnet turism-ekonomi anger 51,4 för samma år, troligen med en annan källa eller nämnare. Båda är rimliga och skillnaden är under 1 %.
- **Folkmängd.** ISTAT (249 385 den 1 januari 2026) är lägre än kommunens folkbokföring (251 294–251 295 den 31 december 2025), eftersom ISTAT justerar mot folkräkningen. Använd ISTAT för jämförelser med Italien och Veneto, och kommunens tal för centro storico och stadsdelarna.
- **Två mått på sysselsättning.** Provinsens 70,2 % (arbetskraftsundersökningen 2025) och kommunens 69,1 % (folkräkningen 2024) mäter inte på samma sätt. Det första är ett urval, det andra register kompletterade med urval. Arbetslösheten är 4,6 % mot 5,2 % av samma skäl.
- **Röstlängder.** Kommunvalets röstlängd (201 713) innehåller italienare bosatta utomlands. Parlamentsvalets (187 202) gör det inte. Deltagandet i kommunvalet ser därför lägre ut än det är bland dem som bor i Venedig.
- **Andelen skyddad natur** är 62,4 % av kommunens yta, eftersom ISTAT:s stadsdata tar med lagunen. BES-måttet för provinsen (23,7 %) räknar bara landyta.

## För berättelsen

- **Turismen och invånarna.** Venedig har 51,8 gästnätter per invånare, mer än tre gånger Venetos 15,3, och 367 turistbäddar per 1 000 invånare, mer än dubbelt så många som i Veneto. Det syns i allt som delas med de folkbokförda:
  - 707,5 kollektivtrafikresor per invånare, fyra gånger provinshuvudorternas snitt;
  - 695 kg avfall per invånare;
  - fickstölder anmäls 3,4 gånger oftare än i landet.
- **Vattnet.** 44 % av stadens kollektivtrafik går på vattnet, och staden står för 98 % av all vattenburen kollektivtrafik i Italiens provinshuvudorter. Det är också Venedigs största sårbarhet. En fjärdedel av invånarna (64 592) bor där en översvämning med återkomsttid 100–200 år kan nå, mot drygt en tiondel i Veneto och Italien.
- **Klimatet.** Kommunens 16,7 ton CO2e per invånare är nästan tre gånger Venetos snitt. Två tredjedelar kommer från el- och energiproduktion vid Fusina och Porto Marghera, med 1 649 kt CO2 från kol år 2023. Vägtrafiken per invånare är däremot lägre än i landet, 1,1 mot 1,7 ton, och Venedig har 460 bilar per 1 000 invånare mot 701 i Italien.
- **Det historiska centrumet.** På tio år har centro storico gått från 55 589 till 47 625 invånare (−14 %). Där dog 8 810 och föddes 2 797, medelåldern är 51,4 år och bostäderna kostar 4 332 euro/m² (San Marco 5 388). En av sex bostäder i kommunen saknar folkbokförda boende.
- **Mark.** Exploateringen ökade med 64 ha 2023–2024, den största ettårsökningen sedan 2015, medan 62 % av kommunens yta är skyddad natur, främst lagunen.
- **Valdeltagande.** Valdeltagandet sjönk från 62,23 % till 55,90 % mellan kommunvalen 2020 och 2026.
