# Energi och resor – energy, emissions and getting about in Venice (deep research)

Compiled: 2026-10-11. Data files: `energi-resor.json` (56 indicators) and `energi-resor.en.json` (English names, units and notes for every id). All ids carry the prefix `en_` so that they cannot collide with other topics in the merge (a later topic silently replaces an earlier record with the same id).

## Kort för modellen

| Vad | Värde | År | id | Säkerhet |
|---|---|---|---|---|
| Elanvändning, distributionsnätet (hela kommunen) | 1 491 GWh | 2024 | `en_elanvandning_distributionsnat` | estimate |
| El per invånare (högst av Italiens storstäder) | ≈ 5 970 kWh | 2024 | `en_el_per_invanare` | estimate |
| Hushållsel per invånare | ≈ 1 160 kWh | 2024 | `en_el_hushall_per_invanare` | estimate |
| Naturgas per invånare | ≈ 720 m³ | 2024 | `en_naturgas_per_invanare` | estimate |
| Elens andel av el + gas | 46,5 % | 2024 | `en_el_andel_av_el_och_gas` | high |
| Solceller: effekt / produktion | 59,0 MW / 43,6 GWh | 2024 | `en_solceller_effekt`, `en_solel_produktion` | high |
| Solel i förhållande till elanvändningen | 2,9 % | 2024 | `en_solel_andel_av_elanvandning` | estimate |
| Naturgasens andel av bostädernas energi | 83,5 % | 2005 | `en_bostader_naturgas_andel` | estimate |
| CO2 i kommunens basinventering | 1 494 744 t (5,54 t/inv) | 2005 | `en_co2_basinventering_2005` | high |
| CO2 i uppföljningsinventeringen | 1 004 129 t (3,83 t/inv) | 2016 | `en_co2_uppfoljning_2016` | estimate |
| CO2 per invånare: bostäder / tjänster / transporter | 1,38 / 1,68 / 0,68 t | 2016 | `en_co2_per_inv_bostader`, `en_co2_per_inv_tjanster`, `en_co2_per_inv_transporter` | estimate |
| Klimatplanens mål | −72 % mot 2005 till 2030, neutralitet 2050 | 2026 | `en_paesc_mal_2030` | high |
| All CO2 inom kommunens gränser (INEMAR) | 4 032 kt | 2023 | `en_co2_alla_kallor_inemar` | high |
| varav kolkraft i Fusina | 1 649 kt | 2023 | `en_co2_kolkraft_fusina` | high |
| Båtars + fartygs andel av NOx / PM10 | 46,7 % / 39,1 % | 2023 | `en_nox_andel_batar_fartyg`, `en_pm10_andel_batar_fartyg` | estimate |
| NOx från lagunens motorbåtar | 898 t | 2023 | `en_nox_lagunbatar` | high |
| Bioraffinaderiet i Porto Marghera | 400 000 t/år (→ 600 000) | 2026 | `en_bioraffinaderi_kapacitet` | high |
| Landström, finansiering | 89,8 miljoner euro | 2025 | `en_landstrom_investering` | high |
| Går till fots in i staden från bro- och tågändpunkten | 64,5 % (båt 33 %) | 2019 | `en_till_fots_in_i_staden` | medium |
| Personer in via Tronchetto–P.le Roma–Santa Lucia | 100 000 per vardag | 2019 | `en_ankomster_knutpunkt_per_dag` | medium |
| Broar i modellens kvadrat / andel med trappor | 244 / 95,1 % | 2026 | `en_broar_modellomrade`, `en_broar_med_trappor_andel` | estimate |
| Yta en rullstolsburen når med vaporetto | ≈ 70 % (utan båt 2 %) | 2007 | `en_tillganglig_yta_med_vaporetto` | medium |
| Kollektivtrafikresor (alla slag, hela kommunen) | 176,8 miljoner (707,5 per inv.) | 2024 | `en_kollektivtrafik_resor` | high |
| Vattenburen andel av kollektivtrafikens utbud | 44,2 % av platskilometrarna | 2024 | `en_vattenburen_kollektivtrafik_andel` | high |
| ACTV: båtlinjer / turer per vardag | 25 / 1 422 (linje 1: 177) | 2024/2026 | `en_actv_linjer_vatten`, `en_actv_turer_per_vardag` | high / estimate |
| ACTV:s båtflotta / hybridvaporetton | 148 / 1 | 2023/2025 | `en_actv_flotta_vatten`, `en_actv_hybridfartyg` | high / medium |
| Vattentaxi / gondoler (licenser) | 251 / 440 | 2024/2020 | `en_vattentaxi_licenser`, `en_gondol_licenser` | high |
| Båtpassager vid Punta della Salute | ≈ 4 000 per dag | 2001 | `en_batpassager_punta_salute` | medium |
| Tågavgångar från Santa Lucia | ≈ 273 per vardag (263–283) | 2026 | `en_tag_avgangar_santa_lucia` | estimate |
| Snabbaste tåg till Milano / Rom | 147 / 236 min | 2026 | `en_tag_restid_milano`, `en_tag_restid_roma` | medium |
| Flygpassagerare Marco Polo | 11 850 336 | 2025 | `en_flygplats_passagerare` | high |
| Kryssningspassagerare (2019: 1 611 341) | 584 284 | 2025 | `en_kryssning_passagerare` | high |
| Betalande dagsbesökare per avgiftsdag | 13 046 | 2025 | `en_dagsbesokare_avgift` | high |
| Personbilar per 1 000 invånare (Italien 701) | 460 | 2024 | `en_bilar_per_1000_inv` | high |
| Lätta fordon över Ponte della Libertà | > 30 000 per dag | 2019 | `en_ponte_liberta_bilar` | medium |
| NO2 vid Rio Novo (båttrafik), årsmedel | 34 µg/m³ (2018: 51) | 2025 | `en_no2_rio_novo` | high |
| NO2 vid Sacca Fisola (bakgrund), årsmedel | 30 µg/m³ | 2024 | `en_no2_sacca_fisola` | high |
| Dygn med PM10 > 50 µg/m³, Sacca Fisola | 21 (gräns 35) | 2025 | `en_pm10_dygn_sacca_fisola` | high |
| PM10 vid Rio Novo, årsmedel | 24 µg/m³ | 2025 | `en_pm10_rio_novo` | high |

EU:s gränsvärden från 2030 (direktiv (EU) 2024/2881, bilaga I): NO2 20 µg/m³ som årsmedel, PM10 20 µg/m³ som årsmedel och 45 µg/m³ som dygnsmedel högst 18 gånger per år, PM2,5 10 µg/m³.

## Scope

Energy use and generation in the Comune di Venezia, the climate plans and emission inventories, Porto Marghera's energy industry and the port's shore power, travel inside the historic city (walking, bridges, water buses, taxis, gondolas, wave damage and speed control), getting to Venice (bridge, trains, airport, cruise ships, commuters, day visitors, cars), and air quality at the ARPAV stations. The Comune di Venezia covers the historic city, the lagoon islands, the Lido and the mainland (Mestre, Marghera); most statistics exist only for the whole municipality, and the notes say so wherever the historic city cannot be separated.

## Method

- **Primary sources first.** ISTAT (energy time series, Ambiente urbano 2024, vehicle indicators, population), the Comune di Venezia (PAES 2012, PAESC press deck 2026, PUMS, tourism yearbook, access-fee report, gondola regulation, council records), the JRC Covenant of Mayors dataset, ARPAV and Regione del Veneto (INEMAR 2023, air-quality reports), AVM/ACTV (Carta della Mobilità 2024, GTFS open data), RFI (official station timetable), Assaeroporti, the port authority AdSP MAS (statistics and decrees), ACI, Eni, the transport ministry (MIT) and the environment ministry's assessment register (MASE). News (Il Post, Gente Veneta) only where primary sources were lacking; the notes say so.
- **PDFs were read in memory** with `pypdf` (fetched with a User-Agent naming the project, never saved). Three PDFs were auto-cached by the web-fetch tool (the PAESC deck, a Euromobility report and a ShippingItaly article); each cache file was deleted at once and the PDF re-read in memory.
- **Scratch files** are in `/private/tmp/venezia_energi/`: text extracts, and the non-PDF downloads (ISTAT xlsx/zip, JRC GlobalCoM.xlsx, INEMAR CSVs, the ACTV GTFS zip, ACI's Autoritratto 2025 open-data archive, ISTAT population files, the Mobility Database catalogue).
- **The Comune's web pages** (comune.venezia.it/it/content/…) sit behind a bot challenge and could not be read; its PDFs under `www.comune.venezia.it/sites/…` could. The PAESC page was read through the Internet Archive (snapshot 2025-10-10), and the 2025 access-fee report, which has left the Comune's server, through its archived copy (2025-08-02).
- **Timetable figures** were computed from RFI's official programmed timetable for Venezia S. Lucia (valid 14 June–12 December 2026; departures and arrivals boards, station id 2796). Each train's running-day notes («non circola nei giorni festivi e sabato», «circola dal … al …», etc.) were evaluated for Wednesday 14 October 2026; reading only the first note gives the upper count, requiring all notes to allow the day gives the lower count. Fastest trips are the smallest departure-to-arrival difference among trains running that day.
- **Water bus figures** were computed from ACTV's own navigation GTFS feed (actv_nav.zip, feed 5 October 2026–4 October 2027), found through the Mobility Database catalogue: trips active on Wednesday 14 October 2026 per route.
- **Emission shares** were aggregated from INEMAR Veneto 2023's municipal file (all activity and fuel rows for ISTAT code 27042), and the municipal totals were checked against the separate totals file (CO2 4 031.8 kt, NOx 6 226.3 t, PM10 396.7 t – identical).
- **Bridges in the model square** were counted in the city's own OpenStreetMap extract (`cities/venezia/osm.json`, only read): `man_made=bridge` outlines with their centroid inside the model bbox, and for each the bridge paths inside it (`highway=steps` = steps; `ramp`, `ramp:wheelchair` or `wheelchair=yes` = ramp/wheelchair tag).
- **The 2016 inventory** was taken from the JRC dataset (Table 2, GCoM_ID IT0014), where Venice's 2005 baseline matches the PAES exactly; the 2016 sector values were summed.
- **Search budget.** About 45 web searches were made before the session's shared search budget ran out; after that only direct fetches of known URLs and open data were used (no search engines via other routes). A few searches were therefore not made (current heritage rules for solar panels, district heating in the historic city, Terna's provincial consumption).

### Sources

**Energy statistics**
- ISTAT, *Trasformazioni e innovazioni nei consumi elettrici delle città capoluogo – Anno 2024* (July 2026): report https://www.istat.it/wp-content/uploads/2026/07/Trasformazioni-e-innovazioni-nei-consumi-elettrici-delle-citta-capoluogo_Anno-2024.pdf (Venice "primeggia con 51,3 tep per 100 ab."; glossary: 1 GWh = 86 tep, 1 000 m³ gas = 0.819 tep) and time series https://www.istat.it/wp-content/uploads/2026/07/ENERGIA_serie_storiche-1.xlsx (tables 1.1–7.3: electricity total/domestic/non-domestic, gas, PV, charging points; note (a): only users connected to distribution grids). Press page: https://www.istat.it/comunicato-stampa/trasformazioni-e-innovazioni-nei-consumi-elettrici-delle-citta-capoluogo-anno-2024/
- ISTAT, *Ambiente urbano – Anno 2024* (9 September 2026): https://www.istat.it/?p=134822, tables https://www.istat.it/wp-content/uploads/2026/09/TAVOLE_AMBURB_2024.zip (MOBILITA_URBANA_2024.xlsx tables 2.1–2.2, 3.2, 4.2, 6.2, 8.1–8.2, 9.1–9.2, 10.1, 11.1, 12.1–12.2, 20.1–20.2, 21.2; ARIA_2024.xlsx prospetto 2.1, tables 1.1 and 2.1).
- ISTAT, *Dotazioni energetiche delle famiglie – Anno 2024* (October 2025), heating systems by area: https://www.istat.it/wp-content/uploads/2025/10/Report_Dotazioni-energetiche-delle-famiglie_Anno-2024.pdf
- Regione del Veneto, *Il Nuovo Piano Energetico Regionale Veneto 2030 – Report di monitoraggio* (November 2025): https://elezioni2020.regione.veneto.it/documents/10749/13645901/2025+Monitoraggio+nPER.pdf/461f03ca-b8ee-4ee0-a55e-36bf4f8aa245 (Veneto: renewable capacity 4 708 MW in 2023; solar 276.86 ktep in 2024 ≈ 3 220 GWh; electricity use 2023 by Terna: industry 14 596, services 8 086, households 5 424, agriculture 766 GWh; 23 586 electric cars in 2024).

**Climate plans and inventories**
- Comune di Venezia, *PAES – Piano d'Azione per l'Energia Sostenibile* (2012), IBE 2005 pp. 76–82: https://www.comune.venezia.it/sites/comune.venezia.it/files/documenti/Ambiente/PAES_WEB-compressed.pdf
- Comune di Venezia, council decision 29/2020 (joining the Covenant for Climate and Energy, −40 % by 2030; the PAES monitoring, Giunta decision 266/2018, attested −20 % in 2016): https://www.comune.venezia.it/sites/comune.venezia.it/files/documenti/Ambiente/DC_2020_29%20Adesione%20Patto%20dei%20Sindaci%20Clima%20Energia%20con%20all.pdf.pdf
- Comune di Venezia, *PAESC* press conference 19 January 2026 (−72 % by 2030, 33 mitigation and 46 adaptation actions, monitoring every 2 years, inventory every 4): https://dam.comune.venezia.it/api/resource/f7c1e9bb-4880-4974-b551-385bab4ca132
- Comune di Venezia, PAESC web page, archived 2025-10-10 (base year 2005, C40 Deadline 2020 target −68.9 %, drafted by ETRA/TERRARIA from SOGESCA and CORILA work): http://web.archive.org/web/20251010215140/https://www.comune.venezia.it/it/content/piano-clima-citt-venezia
- Consiglio comunale, V commission minutes on proposal 2025/1070 (PAESC), 22 Jan and 3 Feb 2026: https://consiglio2020.comune.venezia.it/pdf/atti_assemblee/resoconti_1/resoconto_sintetico_1945.pdf, https://consiglio2020.comune.venezia.it/pdf/atti_assemblee/resoconti_1/resoconto_sintetico_1951.pdf (also 1946 and 1950).
- European Commission JRC, *A dataset of GHG emissions for 6,200 cities in Europe and the Southern Mediterranean countries* (metadata https://data.jrc.ec.europa.eu/dataset/57a615eb-cfbc-435a-a8c5-553bd40f76c9; file https://jeodpp.jrc.ec.europa.eu/ftp/public/JRC-OpenData/CoM/GlobalCOM/LATEST/GlobalCoM.xlsx). Venice: adhesion 2011, BEI 2005 (269 780 inhabitants), MEI 2016 (261 905), EDGAR 5.48 t/inhabitant 2005, heating degree days 2 181.
- ARPAV and Regione del Veneto, *INEMAR Veneto 2023* (edition January 2026): page https://www.arpa.veneto.it/temi-ambientali/aria/inventario-emissioni/risultati-e-mappe-inemar-veneto-2023; files https://www.arpa.veneto.it/dati-ambientali/open-data/file-e-allegati/emissioni-2023/inemarveneto2023_emiss_comunali.csv/@@download/file and https://www.arpa.veneto.it/dati-ambientali/open-data/file-e-allegati/emissioni-2023/inemarveneto2023_totalicomunali.csv/@@download/file

**Porto Marghera, Fusina and the port**
- Eni, *Bioraffineria di Venezia*: https://www.eni.com/it-IT/attivita/italia-venezia-bioraffineria.html
- Eni, news May 2026, *oltre 900 milioni per la transizione energetica di Porto Marghera* (8 MW electrolyser with Magis, steam reforming 2 × 15 000 Nm³/h, Versalis plastic recycling 20 000 t/yr, 6.2 MW PV, >760 Eni staff + ~1 100 contractors): https://www.eni.com/it-IT/media/news/2026/05/eni-900-milioni-transizione-energetica-porto-marghera.html
- MASE environmental assessment register, Enel project ID_VIP 5147 *Sostituzione delle unità a carbone esistenti con nuova unità a gas presso la centrale "Andrea Palladio" di Fusina*: site requalification plan (demolition of coal units FS1–FS2, 165 + 170 MW; ~12 MW PV and BESS) https://va.mite.gov.it/File/Documento/488392; Enel's integrations https://va.mite.gov.it/File/Documento/488374; the commission's request (FS5 already out of service) https://va.mite.gov.it/File/Documento/476583
- AdSP MAS, decrees on cold ironing: 2024.0000138 (4 MW MV supply Santa Marta–San Basilio, 2 MW Riva Sette Martiri) https://trasparenza.port.venice.it/wp-content/uploads/2024/04/2024.0000138_decretazione.pdf; 2025.0000396 (projects, Marittima contract 6 June 2024, €18.28 m) https://trasparenza.port.venice.it/wp-content/uploads/2025/07/2025.0000396_decretazione.pdf; also 2023.0000214 and 2024.0000371 (same funding lines).
- AdSP MAS, traffic statistics 2024 (cruise 547 587, coal and lignite −43 %) https://www.port.venice.it/statistiche/dati-statistici-sui-traffici-del-2024/ and 2025 (cruise 584 284; 26 Mt cargo; 532 762 TEU) https://www.port.venice.it/statistiche/dati-statistici-sui-traffici-2025/ with https://www.port.venice.it/wp-content/uploads/2026/01/PORT-OF-VENICE-4-2025.pdf
- MIT, *Venezia: Giovannini, stop a grandi navi* (13 July 2021; from 1 August 2021 no large ships through Bacino di San Marco, Canale di San Marco and Canale della Giudecca; €157 m for temporary berths in Marghera): https://www.mit.gov.it/index.php/node/16174

**Travel in the historic city**
- Comune di Venezia, *PUMS – VAS Documento preliminare, 2.1 Relazione descrittiva* (2019 surveys; access to the historic city §4.7; Ponte della Libertà flows; commuting from the 2011 census; "centro storico totalmente pedonale"): https://www.comune.venezia.it/sites/comune.venezia.it/files/immagini/PUMS/2.1_%20Relazione%20Descrittiva.pdf
- AVM / Comune di Venezia, *Carta della Mobilità 2024* (fleet 31/12/2023, 25 lines, investment table 2024–2029, PNRR buses): https://www.comune.venezia.it/sites/comune.venezia.it/files/documenti/Partecipate/Carta%20della%20Mobilita_2024.pdf
- ACTV open data, navigation GTFS: https://actv.avmspa.it/sites/default/files/attachments/opendata/navigazione/actv_nav.zip (found via the Mobility Database catalogue, https://storage.googleapis.com/storage/v1/b/mdb-csv/o/sources.csv?alt=media, source 1063).
- FPT Industrial press release 17 June 2025 on MotoBattello 3's hybrid retrofit: https://www.fptindustrial.com/-/media/FPT/PDF-Press-Release/2025/ACTV-MotoBattello-3/20250617_FPT_MOTOBATTELLO-3_IT.pdf?rev=-1
- Gente Veneta, 3 May 2024 (news; vaporetto ages, 53 new units planned 2022–2032, €330 m): https://www.genteveneta.it/?p=27845
- Comune di Venezia, *Regolamento comunale per il servizio pubblico di gondola* (2020): https://www.comune.venezia.it/sites/comune.venezia.it/files/documenti/Qualita/Regol_Gondola_modificato_2020-def.pdf; *Arte del Gondoliere* course notice (2018, 60 substitutes): https://dam.comune.venezia.it/api/resource/4c5c3d0c-288e-485d-9db7-b21ef5250b71
- Il Post, 2 August 2025, *Solo a Venezia poteva esserci un «barcavelox»* (news): https://www.ilpost.it/2025/08/02/barcavelox-venezia/
- Magistrato alle Acque (Polizia lagunare), *Il volume di traffico acqueo sulla laguna*, Insula Quaderni n. 12: https://www.insula.it/images/pdf/resource/quadernipdf/Q12-25.pdf
- Council records on wave damage (moto ondoso): motion 536 (7 Dec 2023; COSES 2006, Testo unico 274/2015, 2019 ordinances for Rio Novo, 17 commission sessions 2022–23) https://consiglio2020.comune.venezia.it/pdf/atti_indirizzo/1/481_mozione_536.pdf; question 1052 (15 Oct 2024; "Stati Generali" 14 Nov 2023, motion 581 of 18 Apr 2024 on Si.Sa.) https://consiglio2020.comune.venezia.it/pdf/atti_ispettivi/1/1085_interrogazione_1052.pdf; question 553 (2022) https://consiglio2020.comune.venezia.it/pdf/atti_ispettivi/1/502_interrogazione_553.pdf
- Comune ordinance of 13 May 2014 on the Grand Canal's critical stretches (ARGOS density monitoring, COSES study of 15 June 2006): https://www.comune.venezia.it/sites/comune.venezia.it/files/immagini/MobilitaAcquea/334_Canalgrande-azione3%20-trattecriticit%C3%A0.pdf
- Council answer 849 (Feb 2024) on stairlifts and the PEBA (decision 68 of 22/07/2020): https://consiglio2020.comune.venezia.it/pdf/atti_ispettivi/risposte_1/849_risposta_interrogazione_905.pdf
- Council answer 730 (Oct 2023) on Veritas waste boats (compactor boats, Stage V engines, hybrid versions, full-electric prototype planned; 5 boats emptying ~330 bins): https://consiglio2020.comune.venezia.it/pdf/atti_ispettivi/risposte_1/730_risposta_interrogazione_812.pdf
- Tatano, Revellini, Mazzanti, *Venezia accessibile*, TECHNE 19/2020: https://oaj.fupress.net/index.php/techne/article/download/7784/8150/13850
- Comune di Venezia, *Venezia a ruota libera* (Progetto Lettura Agevolata; pdf created March 2007): https://www.comune.venezia.it/sites/comune.venezia.it/files/page/files/venezia_a_ruota_libera.pdf
- OpenStreetMap contributors (ODbL), via `cities/venezia/osm.json`.

**Getting to Venice**
- RFI, station page (23 tracks, step-free platforms) https://www.rfi.it/it/stazioni/venezia-s-lucia.html; departures https://prm.rfi.it/qo_prm/QO_Partenze_SiPMR.aspx?Id=2796&dalle=00.00&alle=23.59; arrivals https://prm.rfi.it/qo_prm/QO_Arrivi_SiPMR.aspx?Id=2796&dalle=00.00&alle=23.59
- Assaeroporti, traffic January–December 2025: https://assaeroporti.com/statistiche/?selectedYear=2025&month=12
- Comune di Venezia, *Annuario del Turismo, dati 2023* (port passengers 2019–2023, airport 2019–2023, Piazzale Roma garages): https://www.comune.venezia.it/sites/comune.venezia.it/files/documenti/Turismo/Annuario_del_Turismo_dati_2023.pdf
- Comune di Venezia, *Contributo di accesso – sperimentazione 2025: i numeri (provvisori)*, archived: https://web.archive.org/web/20250802151606/https://live.comune.venezia.it/sites/live.comune.venezia.it/files/articoli/allegati/CDA_report2025.pdf
- ISTAT, *Statistica Today – Indicatori del parco veicolare, Anno 2024* (February 2026): https://www.istat.it/wp-content/uploads/2026/02/Statistica-Today_Indicatori-del-parco-veicolare_Anno-2024.pdf
- ACI, *Autoritratto 2025* open data (fleet at 31 December 2025, by municipality): https://aci.gov.it/app/uploads/2026/06/Autoritratto-2025-OD.rar
- ISTAT, resident population 1 January 2026 (estimate) and 2025: https://demo.istat.it/data/posas/POSAS_2026_it_Comuni.zip, https://demo.istat.it/data/posas/POSAS_2025_it_Comuni.zip (Venezia 249 385 / 249 490; Veneto 4 857 460; Italy 58 942 828).

**Air quality**
- ARPAV, *Aria a Venezia Rio Novo: il report 2025* (17 April 2026): https://www.arpa.veneto.it/arpav/comunicati-stampa/archivio-comunicati/comunicati-2026/aria-a-venezia-rio-novo-il-report-2025
- ARPAV, *La qualità dell'aria in breve – anno 2025*: https://www.arpa.veneto.it/api/arpavinforma/pubblicazioni/la-qualita-dellaria-in-breve-anno-2025/@@download/file
- ARPAV and Comune di Venezia, *Qualità dell'aria – Anno 2023* (station history 2003–2023): https://www.comune.venezia.it/sites/comune.venezia.it/files/documenti/Rapporto%202023%20qualita%20Aria%20Comune%20Venezia.pdf
- ARPAV, press release on the 2024 report for Venice (5 June 2025): https://www.arpa.veneto.it/arpav/comunicati-stampa/archivio-comunicati/comunicati-2025/laria-a-venezia-il-rapporto-annuale
- Directive (EU) 2024/2881, Annex I: https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=OJ:L_202402881

Consulted but not used for records: Euromobility, *50 città 2025* (motorisation charts; the ACI and ISTAT figures were used instead).

### Derived numbers

All are marked `estimate` (or `medium` for timetable travel times), with the arithmetic in `note_sv`.

- **ISTAT toe → GWh, kWh, m³.** 128 207.9 toe / 86 = 1 490.8 GWh (domestic 24 872.4 / 86 = 289.2; other 103 335.5 / 86 = 1 201.6). Per inhabitant 51.306 / 100 / 86 × 10⁶ = 5 966 kWh; domestic 9.953 → 1 157 kWh. Gas 147 307.7 toe / 0.819 = 179.9 million m³; 58.949 / 100 / 0.819 × 1 000 = 720 m³ per inhabitant. 2005: 275 372.7 / 86 = 3 202 GWh; gas 86.125 → 1 052 m³.
- **Solar share.** 43.605 / 1 490.8 = 2.9 %.
- **Residential energy mix 2005.** 1 794 931 / 2 148 488 = 83.5 % gas; 313 187 (14.6 %) electricity; 27 060 (1.3 %) heating oil; 13 310 (0.6 %) LPG.
- **2016 inventory.** 11 675.9 + 12 635.4 + 213 348.9 + 227 006.9 + 266 174.7 + 94 377.3 + 177 871.5 + 1 038.1 = 1 004 128.6 t; 1 004 129 / 1 494 744 − 1 = −32.8 %; / 261 905 = 3.83 t. Sector per inhabitant: 360 552 / 261 905 = 1.38; 440 356 / 261 905 = 1.68; 178 910 / 261 905 = 0.68 (2005: 1.94, 1.90, 1.57 with 269 780 inhabitants).
- **INEMAR shares.** NOx 897.8 / 6 226.3 = 14.4 % (inland waterways) and 2 009.4 / 6 226.3 = 32.3 % (maritime) → 46.7 %; PM10 101.2 / 396.7 = 25.5 % and 54.0 / 396.7 = 13.6 % → 39.1 %; residential combustion 122.4 / 396.7 = 30.9 % (almost all wood stoves and fireplaces); energy and refineries 2 813.2 / 4 031.8 = 69.8 % of CO2; remainder 1 218.6 kt / 249 490 = 4.9 t; Veneto 23 317.6 kt / 4 857 460 = 4.8 t. Venice's share of Veneto's inland-waterway NOx 897.8 / 1 243.1 = 72 %, PM10 101.2 / 138.2 = 73 %.
- **Cars per 1 000 (ACI 2025).** 111 640 / 249 385 × 1 000 = 448; Veneto 3 335 141 / 4 857 460 = 687; Italy 41 795 962 / 58 942 828 = 709. (ISTAT's published 2024 value, 460, is the record; the 2025 calculation uses a different count date and population and is only in the note.)
- **Bridges.** 232 / 244 = 95.1 %.
- **Cruise.** 584 284 / 1 611 341 = 36 %.
- **Water seat-km.** 1 088 / 1 106.0 = 98 % of all capitals' waterborne public transport.
- **Public transport trend.** 176.8 / 218.9 − 1 = −19 %.
- **Timetables.** Trains on 14 Oct 2026: departures 263 (all notes) – 283 (first note), mean 273; arrivals 267–289; high-speed (train numbers 8000–9999) 49 departures. Milano Centrale: 06.48–09.15 = 147 min (22 trains); Roma Termini: 07.26–11.22 = 236 min (25 trains); Firenze S.M.N. 133 min; Bologna Centrale AV 93 min.
- **Garage.** 264 382 / 365 ≈ 724 entries a day.

### Caveats

- **ISTAT electricity excludes transmission-grid users.** The 1.5 TWh is what distribution-grid customers use; Porto Marghera's largest plants are probably outside it. The fall from ~3.2 TWh (2005) may reflect both industrial decline and customers moving between grids; not resolved.
- **Per-inhabitant energy is probably inflated by visitors.** Hotels, shops and offices serving ~12 million air passengers, cruise and day visitors are divided by ~250 000 residents.
- **Two inventories, two scopes.** The PAES/Covenant inventory (1.49 Mt in 2005, 1.00 Mt in 2016) excludes ETS plants; INEMAR (4.03 Mt in 2023) counts everything emitted in the municipality, including power sold to the national grid. The two must not be compared directly.
- **The 2016 transport figure** (−58 % against 2005) is probably partly methodological: 2005 used all fuel sold in the municipality including motorway stations; the 2016 method was not documented in the sources read.
- **PAESC status.** The plan was examined by council committees in January–February 2026; final council approval and the updated emission inventory were not seen (the Comune's pages could not be read).
- **INEMAR navigation.** The "vie di navigazione interne" item is labelled "imbarcazioni private" (private/motor boats, diesel and petrol); whether ACTV's vessels are included there or elsewhere is not stated in the file.
- **The PUMS walking share** describes how people continue from the arrival node into the city on an ordinary weekday in 2019, not the modal split of all trips within the historic city.
- **OSM bridge counts** depend on volunteer mapping; some `man_made=bridge` outlines may be private bridges or parts of the same crossing.
- **The accessibility figures (2 % / 70 %)** come from an undated municipal guide (early PEBA period, pdf 2007).
- **Timetable counts** are one weekday's snapshot and depend on how running-day notes are read (range given).
- **Station-level air data**: ISTAT 2024 values come from ARPAV; 2025 values only for Rio Novo (press release) and PM10 exceedance days (brief report). NO2 2025 for Sacca Fisola was not yet seen.

## Main findings

1. **Venice runs on gas and grid power, and solar is still small.** Distribution-grid customers used ~1 491 GWh in 2024 (≈ 5 970 kWh per resident, the highest of Italy's 14 metropolitan cities, probably partly because hotels and shops are counted against residents) and ~180 million m³ of gas (≈ 720 m³ per resident, against ≈ 440 in Italy's provincial capitals). In 2005 gas covered 83.5 % of homes' energy. Electricity is 46.5 % of electricity + gas. PV has doubled since 2021 to 59 MW and 43.6 GWh, still only ~3 % of grid electricity; no source separates the historic city.
2. **The municipal climate account and the real smokestacks are different things.** The Covenant inventory fell from 1.49 Mt (5.54 t/inhabitant, 2005) to 1.00 Mt (3.83 t, 2016), and the new PAESC aims at −72 % by 2030 and neutrality by 2050. But INEMAR counts 4.03 Mt CO2 emitted in the municipality in 2023, 70 % from Porto Marghera's power plants and refineries – Enel's coal boilers at Fusina alone 1.65 Mt, more than the whole Covenant inventory. Enel has applied to replace coal with gas; Eni's refinery became the world's first full biorefinery in 2014 and is growing from 400 000 to 600 000 t/year.
3. **In the water city, boats are the exhaust pipe.** Lagoon motorboats and ships produced 46.7 % of the municipality's NOx and 39.1 % of its PM10 in 2023 (Veneto: 6.5 % and 1.4 %). At Rio Novo, the canal station opened in 2017, NO2 was 51 µg/m³ in 2018–19, fell to 31–32 in the lockdown years and was 34 in 2025 – legal today, but 70 % above the EU's 2030 limit of 20. 2025 was the best PM10 year in two decades: Sacca Fisola 21 days over 50 µg/m³.
4. **Walking and water buses carry the city.** Of ~100 000 people arriving daily at Piazzale Roma–Tronchetto–Santa Lucia, 65 % walk on and 35 % take a boat. Public transport carries 707.5 trips per resident (Italy's highest; 176.8 million in 2024, 19 % below 2019); 44 % of the supply is on water – 98 % of all waterborne public transport in Italy's provincial capitals. ACTV's 148 vessels run 1 422 trips on a weekday, 177 on line 1 alone; one vaporetto has been retrofitted as a hybrid (−28 % emissions), with 18 new hybrid vaporetti and 7 hybrid lagoon boats planned to 2029. Bridges are the barrier: 95 % of the 244 bridges in the model square have steps; by water bus a wheelchair user can reach ~70 % of the city, on foot 2 %.
5. **Getting there: a bridge, a station, an airport and a reduced port.** Over 30 000 light vehicles, 1 800 buses and 370 trains cross the Ponte della Libertà daily (2019); ~273 trains leave Santa Lucia each weekday (Milan 2 h 27 min, Rome 3 h 56 min). Marco Polo handled 11.85 million passengers in 2025. Cruise passengers fell from 1.61 million (2019) to 584 284 (2025) after large ships were banned from San Marco and the Giudecca Canal in August 2021. The access fee counted 13 046 paying day visitors per fee day in 2025.
6. **Few cars.** 460 cars per 1 000 residents (2024) – the lowest of any Italian provincial capital (Italy 701) – and the historic city itself is car-free.

## What I could not find

- **The PAESC document itself and its updated inventory** (after 2016): only the press deck and the archived web page could be read; the Comune's site blocks automated readers.
- **Energy for the historic city alone**, Terna's provincial consumption (including transmission-grid industry), and GSE's renewable share of Veneto's gross final consumption.
- **How homes in the historic city are heated** (gas boilers vs heat pumps vs other) and whether any district heating serves it; the PAES mentions only small Veritas networks on the mainland (e.g. Gazzera–Mattuglie, the Veritas CDO biomass plant).
- **Heritage rules for rooftop solar in the Città antica**: not found before the search budget ran out; the share of the 59 MW located in the historic city is unknown.
- **Water-bus passengers separately** (ACTV navigation) and fuel use or CO2 of the ACTV fleet; only the whole-municipality total (ISTAT) and the 2005 public-transport CO2 (42 792 t) were found. The status of the 2027–2029 hybrid deliveries in 2026 was not checked.
- **Registered private motorboats** in the municipality (Il Post cites ~100 000 boats in the lagoon today versus 12 500 motorboats a day fifty years ago; not used as a record).
- **Goods delivered by boat** and **waste collected by boat** in figures (only qualitative information on Veritas' compactor boats).
- **Current boat counts on the Grand Canal** (the ARGOS camera system exists but no published counts were found; only the 2001 survey).
- **Official speed limits per canal** (only the 5–20 km/h range from Il Post; the municipal ordinance texts were not read).
- **A travel survey for the historic city**, recent commuting data (only the 2011 census via the PUMS), and arrivals split by train, car, bus and tram.
- **The end date of coal at Fusina** and the current state of Enel's gas conversion.
- **Concentration shares** of ship and boat emissions at the Venice stations (INEMAR gives emission shares, not contributions to measured air quality); the Venice Blue Flag voluntary fuel agreement for cruise ships (documents removed from the Comune's site).

## Overlap with other topic files

All ids here carry the `en_` prefix, so none collides with another topic; where two topics hold the same quantity, the merge keeps both and the vision should pick one.

- **`kommun-plats-historia.json`** (present when this was finished) already holds the PAESC targets (`com_paesc_minskning_2030` 72 %, `com_paesc_atagande_2030` 55 %, `com_klimatneutral_ar` 2050, `com_paesc_anpassningsatgarder` 46), which overlap `en_paesc_mal_2030`; mine adds the 2005 base year, the −40 % Covenant minimum and the C40 −68.9 % pathway. It also has the access-fee totals (`com_cda_betalningar_2024/2025`, `com_cda_intakt_2025`, `com_cda_hotellgaster_per_dag`, 60 fee days in 2026), while `en_dagsbesokare_avgift` is the average per fee day. Related records there that this file does not repeat: the 25 000 GT limit for ships in the San Marco basin and Giudecca Canal (`com_kryssningsfartyg_grans`), the goal that all boats on the Grand Canal be hybrid by 2032 (`com_canal_grande_hybridbatar_2032`), the road bridge's opening in 1933 (`com_ponte_littorio`), Porto Marghera's 35 000 workers around 1960, and the population of the historic city (47 625 at the end of 2025), useful for per-resident figures in the centre.
- Likely overlaps with `turism-ekonomi` (cruise and airport passengers, gondolas) and `klimat-vatten` (air quality, Punta della Salute) are possible but were not checked; those files did not exist yet.

## För berättelsen

**Platser**

- **Canal Grande vid Rialto** (bryggan Rialto 45,4374 N 12,3354 E). Linje 1 gör 177 turer en vanlig vardag och linje 2 172, och här möts vaporetton, vattentaxi, gondoler och transportbåtar. Efter dödsolyckan nära Rialtobron 2013 skärptes reglerna för Canal Grande; sedan 2025 mäter sensorer båtarnas fart.
- **Punta della Salute / Punta della Dogana** (45,4310 N 12,3371 E), Canal Grandes mynning mot Bacino di San Marco. 2001 räknades omkring 4 000 båtpassager per dag här, främst taxibåtar, och antalet hade fördubblats på tre år. Här står också tidvattenmätaren Osservatorio Maree.
- **Bacino di San Marco och Giudeccakanalen.** Hit kom kryssningsfartygen fram till sommaren 2021; sedan 1 augusti 2021 är passagen stängd för stora fartyg. 2019 kom 1,6 miljoner kryssningspassagerare, 2025 584 284.
- **Riva dei Sette Martiri** (strax öster om modellens kvadrat) och **Santa Marta–San Basilio** (väster om den): här ska fartyg kunna stänga av motorerna och ta landström, 2 respektive 4 MW, i ett projekt på 32,2 miljoner euro tillsammans med Marittima.
- **Rio Novo**, genvägen från Piazzale Roma mot Canal Grande, strax väster om modellens kvadrat. ARPAV mäter här sedan 2017 luften vid en av de mest trafikerade kanalerna; 2019 införde kommunen särskilda regler mot avgaser och buller från båttrafiken i Rio Novo och Rio di Ca' Foscari.
- **Sacca Fisola på Giudecca** – vattenstadens bakgrundsstation för luften; 21 dygn med för höga partikelhalter 2025, mot 54 år 2023.
- **Santa Lucia, Piazzale Roma och Tronchetto** – stadens port mot fastlandet, väster om modellen. Omkring 100 000 personer kommer hit en vanlig vardag; två av tre går vidare till fots. Omkring 273 tåg avgår per vardag, och kommunens parkeringshus tar emot 264 382 bilar om året.
- **Ponte della Libertà** – vägbron till fastlandet, med över 30 000 bilar, 1 800 bussar, spårvagnar och 370 tåg per dag; planen kallar den en sårbar navelsträng.
- **Porto Marghera och Fusina** på fastlandet: kolkraftverket Andrea Palladio (1,65 miljoner ton CO2 2023), Enis bioraffinaderi och en vätgasanläggning på 8 MW under byggnad.
- **Marco Polo i Tessera** – 11,85 miljoner flygpassagerare 2025, i samma kommun.
- **Ponte dell'Accademia** (45,4315 N 12,3288 E) och stadens alla trappbroar: 232 av 244 broar i modellens kvadrat har trappsteg. Ponte dei Lavraneri på Giudecca byggdes om med ramper 2004, och Ponte Papadopoli fick flyttbara ramper 2014.

**Historia**

- **Basåret 2005**: kommunen släppte ut 1,49 miljoner ton CO2 utanför de stora industrierna, 28 % från trafiken. Planen från 2012 siktade på −20 % till 2020; uppföljningen 2016 visade att målet nåtts, och 2020 anslöt staden till det nya borgmästaravtalet.
- **2001–2006: båttrafiken växer.** Räkningarna 2001 visade att taxibåtarna dominerade vid Punta della Salute. En studie för kommunen (COSES, 2006) slog fast att vattentrafiken borde minska med minst 15 %.
- **1933**: vägbron över lagunen, i dag Ponte della Libertà, öppnade (se `com_ponte_littorio`); trafikplanen kallar den i dag en sårbar navelsträng mellan fastlandet och Venedig.
- **2014**: Enis raffinaderi i Porto Marghera blev världens första helt omställda bioraffinaderi.
- **2017–2020**: luftstationen vid Rio Novo öppnade; 2018 och 2019 låg kvävedioxiden på 51 µg/m³, över gränsen. Under pandemin föll den till 32, när båtarna och turisterna försvann – kryssningspassagerarna var 5 237 år 2020.
- **2021**: staten stängde Bacino di San Marco och Giudeccakanalen för stora kryssningsfartyg från 1 augusti.
- **2024–2025**: inträdesavgiften för dagsbesökare prövades 29 dagar 2024 och 54 dagar 2025. Fem nya vaporetton sattes i trafik i maj 2024, de första sedan 2010, och den första hybridombyggda vaporetton provkördes 2025.
- **Vaporettona är gamla**: 38 av 62 byggdes 1974–1988.

**Lokala debatter**

- **Moto ondoso – svallvågorna.** Fullmäktiges utskott för vattentrafiken ägnade 17 möten 2022–2023 åt svallvågorna, borgmästaren kallade till «Stati Generali» i november 2023, och 2025 började fartkamerorna Si.Sa. dela ut böter (minst 138 euro). Under provet stod taxibåtarna för hälften av överträdelserna, enligt Il Post.
- **Kryssningsfartygen.** Förbudet 2021 gällde passagen förbi San Marco och genom Giudeccakanalen, inte fartygen i sig; kryssningstrafiken växer igen (+6,7 % 2025), samtidigt som fartygen i hamnen – alla slag – står för en tredjedel av kommunens kväveoxider.
- **Vems klimatkonto?** Kommunens klimatinventering enligt borgmästaravtalet räknar inte kraftverken och raffinaderierna, som 2023 släppte ut mer än dubbelt så mycket CO2 som allt annat i kommunen tillsammans. Planen räknar däremot med en «hydrogen valley» i Porto Marghera.
- **Turismen och inträdet.** 2025 betalade i snitt 13 046 dagsbesökare per avgiftsdag; försöket fortsätter 2026.
- **Broarna och rullstolen.** Trapphissar och hissar på broarna är enligt tillgänglighetsplanen från 2020 olämpliga i den fuktiga och salta luften och monteras ned; i stället prövas ramper och «gradino agevolato», långa sluttande trappsteg.
- **Solpaneler på gamla tak** – en fråga mellan klimat och kulturarv; ingen gällande regel för den historiska staden hittades i denna genomgång.

**Beslut framför oss**

- **Klimatplanen (PAESC)**: antagande och uppföljning vartannat år, ny utsläppsinventering vart fjärde.
- **Fusina**: när kolet upphör och om gasblocket byggs; Enel planerar solceller och batterier på den friställda marken.
- **Landström**: arbetena vid Marittima (kontrakt juni 2024), Santa Marta–San Basilio, Riva dei Sette Martiri, Fusina och Canale Nord.
- **ACTV:s flotta**: 18 nya hybridvaporetton, 7 hybriddrivna lagunbåtar och fyra ombyggnader fram till 2029; en experimentell elbåt (E1) finns redan i flottan.
- **Bussarna på fastlandet**: el- och vätgasbussar med PNRR-pengar (90 bränslecellsbussar planerade till 2026).
- **Bioraffinaderiet**: utbyggnad till 600 000 ton om året, även flygbränsle.
- **EU:s luftgränser 2030**: för att klara 20 µg/m³ måste kvävedioxiden vid Rio Novo minska med drygt 40 % från 2025 års nivå.
- **Fartkontrollen på kanalerna** och inträdesavgiften för dagsbesökare.

**Siffror som berättar**

- Två av tre går in i staden till fots; resten tar båten.
- 95 % av broarna i modellens kvadrat har trappor. Med vaporetto når en rullstolsburen 70 % av staden, utan båt 2 %.
- 707 kollektivtrafikresor per invånare och år – mest i Italien.
- 460 bilar per 1 000 invånare, lägst av Italiens provinshuvudstäder (Italien 701).
- Båtar och fartyg står för nästan hälften av kväveoxiderna och två femtedelar av partiklarna i kommunen.
- Kvävedioxiden vid Rio Novo: 51 µg/m³ 2019, 34 år 2025 – och EU:s gräns 2030 är 20.
- Kolpannorna i Fusina släppte 2023 ut 1,65 miljoner ton CO2, mer än hela stadens klimatinventering 2016 (1,00 miljoner ton).
- Solel motsvarar knappt 3 % av elen.
- 2 timmar 27 minuter till Milano och 3 timmar 56 minuter till Rom med tåg.
- 1,6 miljoner kryssningspassagerare 2019, 0,58 miljoner 2025.
- 251 vattentaxi och 440 gondoler.

## Suggestions for the 2126 model

**Baseline (sourced values)**
- Electricity 1 491 GWh/yr (distribution grid, 2024); gas 180 million m³; PV 59 MW / 43.6 GWh (2.9 %).
- CO2: Covenant scope 1.00 Mt (2016; 3.83 t/inhabitant) against 1.49 Mt in 2005; all sources 4.03 Mt (2023), of which coal 1.65 Mt.
- Boats and ships: 46.7 % of NOx, 39.1 % of PM10; lagoon boats 898 t NOx.
- Travel: 65 % walk into the city, 35 % by boat; 707.5 public transport trips per resident; 1 422 boat trips per weekday; 460 cars per 1 000.
- Air: NO2 Rio Novo 34 µg/m³ (2025), Sacca Fisola 30 (2024); PM10 days 21 (Sacca Fisola, 2025).
- Access: 273 trains a day, Milan 147 min, Rome 236 min, 11.85 million air passengers, 584 284 cruise passengers.

**Levers with sourced sizes**
- **Climate plan**: −72 % by 2030 against 2005 (from 1.49 Mt to ≈ 0.42 Mt in the Covenant scope; own calculation), neutrality 2050.
- **Coal exit at Fusina**: up to −1.65 Mt CO2, −703 t NOx, −445 t SO2 a year in the municipality (INEMAR 2023), partly offset if a gas unit is built.
- **Hybrid and electric boats**: a hybrid retrofit cuts a vaporetto's NOx by 26 % and PM by 31 % (bench tests); lagoon boats emit 898 t NOx and 101 t PM10 a year, so a fully electric lagoon fleet addresses 14 % of the municipality's NOx and 25 % of its PM10.
- **Shore power**: €89.8 million, 6 MW at the historic-city quays plus Marittima, Fusina and Canale Nord; ships in port emit 2 009 t NOx (32 % of the municipality).
- **Solar**: today ~3 % of grid electricity; heritage rules decide how much the historic city's roofs can add (unknown).
- **Cruise policy**: 2019's 1.6 million passengers versus 0.58 million in 2025 brackets the range.
- **Accessibility**: each bridge rebuilt with ramps (Lavraneri 2004) or removable ramps (Papadopoli 2014) reduces the 95 % share of stepped bridges in the model square.
