# Kalmar 2126 – forskningsunderlag: anteckningar och bibliografi

Sammanställt 2026-10-08. Hör ihop med `vision-research.json` i samma mapp.

## Hur underlaget är byggt

- Varje tema i JSON-filen har `evidence` (påståenden med siffror som kan användas som modellparametrar), `levers` (politiska val för spelaren, med avvägningar) samt kopplingar till de 17 globala målen (`sdg`) och till donutens dimensioner (`doughnut`).
- Varje evidenspost har ett id (t.ex. `food_e3`). Spakarnas `effects_sv` hänvisar till dessa id:n, så att modellens effektstorlekar går att spåra tillbaka till en källa.
- Alla siffror kommer från källor som söktes fram och kontrollerades när underlaget sammanställdes, med webbsökning, direkt hämtning av källsidan eller uppslag i DOI- och statistik-API:er (Crossref, Europe PMC, SCB, Jordbruksverket, Eurostat). Alla 63 DOI:er i JSON-filen är kontrollerade mot Crossref, där titel och år stämmer. Där bara en sekundärkälla (t.ex. ett abstract, en pressrelease eller en myndighetssammanfattning) gick att läsa står det i `context_sv`, och konfidensen är då sänkt.
- **Konfidensnivåer:**
  - `high`: metaanalys, systematisk översikt eller officiell statistik.
  - `medium`: en enskild, solid studie eller en myndighetsrapport.
  - `low`: grå litteratur, enstaka fall eller källor med en tydlig agenda.
  - `assumption`: ett uttryckligt modellantagande. Påståendet börjar då med "Antagande:" och resonemanget står i `context_sv`.
- Perioden 2070–2126 ligger bortom alla officiella prognoser. Värden för den perioden är därför antaganden eller extrapoleringar och ska behandlas som scenarioparametrar, inte som prognoser.

## Omfattning

| Tema | Evidensposter | varav antaganden | Spakar |
|---|---|---|---|
| Mat & odling (`food`) | 46 | 3 | 4 |
| Energi (`energy`) | 20 | 2 | 4 |
| Mobilitet & stadsform (`mobility`) | 19 | 1 | 4 |
| Gemenskap & samarbete (`community`) | 26 | 1 | 4 |
| Hälsa (`health`) | 18 | 2 | 4 |
| Avdigitalisering & digital motståndskraft (`digital_resilience`) | 17 | 1 | 4 |
| Acceleration med teknik & AI (`tech_ai`) | 21 | 1 | 4 |
| Beredskap & motståndskraft (`resilience`) | 23 | 2 | 4 |
| Biologisk mångfald & Östersjön (`biodiversity_baltic`) | 20 | 2 | 4 |
| Långsiktig styrning & vision (`governance`) | 23 | 0 | 4 |
| Demografi 2026–2126 (`demography`) | 18 | 1 | 4 |

Totalt 251 evidensposter, 44 spakar och 10 citat.

## Donutens dimensioner (Raworth 2017)

Sociala grunden (12): mat, hälsa, utbildning, inkomst & arbete, fred & rättvisa, politiskt inflytande, social jämlikhet, jämställdhet, bostad, sociala nätverk, energi, vatten.
Ekologiska taket (9): klimatförändringar, havsförsurning, kemiska föroreningar, kväve- och fosforbelastning, sötvattenuttag, markomvandling, förlust av biologisk mångfald, luftföroreningar, uttunning av ozonskiktet.

Källa: Raworth, K. (2017). *Doughnut Economics: Seven Ways to Think Like a 21st-Century Economist*. Random House Business. Listan är kontrollerad mot https://en.wikipedia.org/wiki/Doughnut_(economic_model). Syftesbeskrivningen finns hos DEAL: https://doughnuteconomics.org/about-doughnut-economics

Observera: donutens ekologiska dimensioner följer planetgränserna i Rockström m.fl. 2009 och Steffen m.fl. 2015. De motsvarar inte exakt namnen i Richardson m.fl. 2023, där till exempel "novel entities" används i stället för "chemical pollution" och "biosphere integrity" i stället för "biodiversity loss". Spelet bör ange vilken namngivning som används.

---


## Tema 1: Mat & odling (`food`)

Sammanställt 2026-10-08. Siffror verifierade via WebSearch/WebFetch, Crossref/Europe PMC/Semantic Scholar (DOI-uppslag av sammanfattningar) och direkta API-uttag ur Jordbruksverkets och SCB:s statistikdatabaser.

### Källförteckning

#### Kost och markbehov
- Peters, C.J., Picardy, J., Darrouzet-Nardi, A.F., Wilkins, J.L., Griffin, T.S., Fick, G.W. (2016). Carrying capacity of U.S. agricultural land: Ten diet scenarios. Elementa: Science of the Anthropocene. https://doi.org/10.12952/journal.elementa.000116
- Poore, J., Nemecek, T. (2018). Reducing food's environmental impacts through producers and consumers. Science. https://doi.org/10.1126/science.aaq0216
- Röös, E., Patel, M., Spångberg, J., Carlsson, G., Rydhmer, L. (2016). Limiting livestock production to pasture and by-products in a search for sustainable diets. Food Policy. https://doi.org/10.1016/j.foodpol.2015.10.008
- Karlsson, J.O., Röös, E. (2019). Resource-efficient use of land and animals—Environmental impacts of food systems based on organic cropping and avoided food-feed competition. Land Use Policy. https://doi.org/10.1016/j.landusepol.2019.03.035
- Moberg, E., Karlsson Potter, H., Wood, A., Hansson, P.-A., Röös, E. (2020). Benchmarking the Swedish Diet Relative to Global and National Environmental Targets—Identification of Indicator Limitations and Data Gaps. Sustainability. https://doi.org/10.3390/su12041407
- Rockström, J., Thilsted, S.H., Willett, W.C. m.fl. (2025). The EAT-Lancet Commission on healthy, sustainable, and just food systems. The Lancet. https://doi.org/10.1016/S0140-6736(25)01201-2 – Summary Report 2025 (EAT): https://eatforum.org/wp-content/uploads/2026/04/EL_Summary-Report_2025_v1.pdf
- Willett, W., Rockström, J., Loken, B. m.fl. (2019). Food in the Anthropocene: the EAT-Lancet Commission on healthy diets from sustainable food systems. The Lancet. https://doi.org/10.1016/S0140-6736(18)31788-4 (endast metadata verifierad; 2019 års siffror används inte)
- Elinder, L.S., Eustachio Colombo, P., Patterson, E., Parlesak, A., Lindroos, A.K. (2020). Successful Implementation of Climate-Friendly, Nutritious, and Acceptable School Meals in Practice: The OPTIMAT™ Intervention Study. Sustainability. https://doi.org/10.3390/su12208475

#### Svensk och regional statistik
- Jordbruksverket (2025/2026). Åkermarkens användning … efter län och gröda, 1981–2025 (JO0104B1). https://statistik.sjv.se/PXWeb/api/v1/sv/Jordbruksverkets%20statistikdatabas/Arealer/1%20Riket%20l%C3%A4n%20kommun/JO0104B1.px
- Jordbruksverket (2026). Åkermarkens användning efter kommun och gröda, 1981–2025 (JO0104B2). https://statistik.sjv.se/PXWeb/api/v1/sv/Jordbruksverkets%20statistikdatabas/Arealer/1%20Riket%20l%C3%A4n%20kommun/JO0104B2.px
- Jordbruksverket (2026). Totalkonsumtion av vara, 1960–2025 (JO1301K2). https://statistik.sjv.se/PXWeb/api/v1/sv/Jordbruksverkets%20statistikdatabas/Konsumtion%20av%20livsmedel/JO1301K2.px
- Jordbruksverket (2026). Köksväxter i växthus efter län och gröda, 1971–2025 (JO0102R02). https://statistik.sjv.se/PXWeb/api/v1/sv/Jordbruksverkets%20statistikdatabas/Tradgardsodling/Odling/Atbara%20vaxter/JO0102R02.px
- Jordbruksverket (2026). Vattenbruk: produktion efter metod och inriktning, 2020–2025 (JO1201V02). https://statistik.sjv.se/PXWeb/api/v1/sv/Jordbruksverkets%20statistikdatabas/Vattenbruk/JO1201V02.px
- SCB (2026). Folkmängden efter region … År 2025 (BefolkningCKM): Riket 10 605 529, Kalmar län 245 477, Kalmar kommun 73 068. https://api.scb.se/OV0104/v1/doris/sv/ssd/BE/BE0101/BE0101A/BefolkningCKM
- Region Kalmar län (2025). Livsmedelssektorn i Kalmar län – Nulägesbild. https://utveckling.regionkalmar.se/globalassets/utvecklingsomraden/naringsliv-och-innovation/livsmedelsstrategin/nulagesbild-av-livsmedelssektorn-i-kalmar-lan-2025.pdf
- Jordbruksverket (webbsida, hämtad 2026-10-08). Livsmedelsstrategi för Sverige. https://jordbruksverket.se/mat-och-drycker/livsmedelsstrategi-for-sverige
- LRF (webbsida, hämtad 2026-10-08). Beredskap. https://www.lrf.se/politik-och-paverkan/beredskap/
- Livsmedelsverket (2026, granskad 2026-05-05). Beredskapslagring. https://www.livsmedelsverket.se/beredskap/livsmedelsberedskap--vad-ar-det/beredskapslagring/
- Livsmedelsverket (2026). Livsmedelslager för offentliga kök. https://www.livsmedelsverket.se/beredskap/livsmedelsberedskap-for-offentliga-aktorer/krisberedskap-for-offentliga-kok/livsmedelslager-for-offentliga-kok/

#### Stadsodling och lokal självförsörjning
- Payen, F.T., Evans, D.L., Falagán, N., Hardman, C.A., Kourmpetli, S., Liu, L., Marshall, R., Mead, B.R., Davies, J.A.C. (2022). How Much Food Can We Grow in Urban Areas? Food Production and Crop Yields of Urban Agriculture: A Meta-Analysis. Earth's Future. https://doi.org/10.1029/2022EF002748
- McDougall, R., Kristiansen, P., Rader, R. (2019). Small-scale urban agriculture results in high yields but requires judicious management of inputs to achieve sustainability. PNAS. https://doi.org/10.1073/pnas.1809707115
- Nicholls, E., Ely, A., Birkin, L., Basu, P., Goulson, D. (2020). The contribution of small-scale food production in urban areas to the sustainable development goals: a review and case study. Sustainability Science. https://doi.org/10.1007/s11625-020-00792-z
- Edmondson, J.L., Childs, D.Z., Dobson, M.C., Gaston, K.J., Warren, P.H., Leake, J.R. (2020). Feeding a city – Leicester as a case study of the importance of allotments for horticultural production in the UK. Science of The Total Environment. https://doi.org/10.1016/j.scitotenv.2019.135930
- Grafius, D.R., Edmondson, J.L., Norton, B.A., Clark, R., Mears, M., Leake, J.R., Corstanje, R., Harris, J.A., Warren, P.H. (2020). Estimating food production in an urban landscape. Scientific Reports. https://doi.org/10.1038/s41598-020-62126-4
- Kriewald, S., Pradhan, P., Costa, L., García Cantú Ros, A., Kropp, J.P. (2019). Hungry cities: how local food self-sufficiency relates to climate change, diets, and urbanisation. Environmental Research Letters. https://doi.org/10.1088/1748-9326/ab2d56
- Zasada, I., Schmutz, U., Wascher, D., Kneafsey, M., Corsi, S., Mazzocchi, C. m.fl. (2017). Food beyond the city – Analysing foodsheds and self-sufficiency for different food system scenarios in European metropolitan regions. City, Culture and Society. https://doi.org/10.1016/j.ccs.2017.06.002 (bakgrund, inga siffror använda)
- Schreiber, K., Hickey, G., Metson, G., Robinson, B.E., MacDonald, G. (2020/2021; online 2020). Quantifying the foodshed: a systematic review of urban food flow and local food self-sufficiency research. Environmental Research Letters. https://doi.org/10.1088/1748-9326/abad59 (bakgrund: 42 studier, svårt att jämföra metoder)
- Weidner, T., Yang, A., Hamm, M.W. (2021). Energy optimisation of plant factories and greenhouses for different climatic conditions. Energy Conversion and Management. https://doi.org/10.1016/j.enconman.2021.114336 – siffrorna 15,6–20,1 kWh/kg hämtade via: Cai, W., Bu, K., Zha, L., Zhang, J., Lai, D., Bao, H. (2024). Energy Consumption of Plant Factory with Artificial Light: Challenges and Opportunities. arXiv:2405.09643. https://arxiv.org/abs/2405.09643
- Weidner, T., Yang, A., Forster, F., Hamm, M.W. (2022). Regional conditions shape the food–energy–land nexus of low-carbon indoor farming. Nature Food. https://ora.ox.ac.uk/objects/uuid:65310fb3-8a8d-4227-b2ef-0cfc2fffe179
- Graamans, L., Baeza, E., van den Dobbelsteen, A., Tsafaras, I., Stanghellini, C. (2018). Plant factories versus greenhouses: Comparison of resource use efficiency. Agricultural Systems. https://doi.org/10.1016/j.agsy.2017.11.003 (endast metadata verifierad; siffror ej tillgängliga)
- Love, D.C., Fry, J.P., Li, X., Hill, E.S., Genello, L., Semmens, K., Thompson, R.E. (2015). Commercial aquaponics production and profitability: Findings from an international survey. Aquaculture. https://doi.org/10.1016/j.aquaculture.2014.09.023 (bakgrund, ej använd som evidens)
- Björklund, J., Eksvärd, K., Schaffer, C. (2018). Exploring the potential of edible forest gardens: experiences from a participatory action research project in Sweden. Agroforestry Systems. https://doi.org/10.1007/s10457-018-0208-8

#### Regenerativt jordbruk och markkol
- LaCanne, C.E., Lundgren, J.G. (2018). Regenerative agriculture: merging farming and natural resource conservation profitably. PeerJ. https://doi.org/10.7717/peerj.4428
- Seufert, V., Ramankutty, N., Foley, J.A. (2012). Comparing the yields of organic and conventional agriculture. Nature. https://doi.org/10.1038/nature11069
- Pittelkow, C.M. m.fl. (2015). Productivity limits and potentials of the principles of conservation agriculture. Nature. https://doi.org/10.1038/nature13809 (kvalitativt)
- Poeplau, C., Don, A. (2015). Carbon sequestration in agricultural soils via cultivation of cover crops – A meta-analysis. Agriculture, Ecosystems & Environment. https://doi.org/10.1016/j.agee.2014.10.024
- Moinet, G.Y.K., Hijbeek, R., van Vuuren, D.P., Giller, K.E. (2023). Carbon for soils, not soils for carbon. Global Change Biology. https://doi.org/10.1111/gcb.16570

#### Musslor i Östersjön
- Petersen, J.K., Hasler, B., Timmermann, K., Nielsen, P., Tørring, D.B., Larsen, M.M., Holmer, M. (2014). Mussels as a tool for mitigation of nutrients in the marine environment. Marine Pollution Bulletin. https://doi.org/10.1016/j.marpolbul.2014.03.006
- Buer, A.-L., Maar, M., Nepf, M., Ritzenhofen, L., Dahlke, S., Friedland, R. m.fl. (2020). Potential and Feasibility of Mytilus spp. Farming Along a Salinity Gradient. Frontiers in Marine Science. https://doi.org/10.3389/fmars.2020.00371
- Kotta, J., Futter, M., Kaasik, A., Liversage, K., Rätsep, M., Barboza, F.R., Bergström, L., Bergström, P. m.fl. (2020). Cleaning up seas using blue growth initiatives: Mussel farming for eutrophication control in the Baltic Sea. Science of The Total Environment. https://doi.org/10.1016/j.scitotenv.2019.136144
- Lindahl, O., Hart, R., Hernroth, B., Kollberg, S., Loo, L.-O., Olrog, L. m.fl. (2005). Improving Marine Water Quality by Mussel Farming: A Profitable Solution for Swedish Society. Ambio. https://doi.org/10.1579/0044-7447-34.2.131 (endast metadata; västkusten)

### Osäkerheter / att dubbelkolla

1. **Sveriges självförsörjningsgrad (~50 %)** kommer från LRF:s formulering "ungefär varannan tugga" (intresseorganisation, confidence low). *Delvis löst vid sammanställningen:* Jordbruksverket (2024) beräknar uttryckligen ingen totalsiffra. Myndigheten redovisar i stället 'försörjningsförmåga' per produktgrupp, t.ex. spannmål 105 %, tomat 19 % (food_e46), och betonar beroendet av importerade insatsvaror. En kaloribaserad officiell siffra finns alltså inte. SLU-/LRF-beräkningar med andra metoder ger andra tal.
2. **Poore & Nemecek 76 % / 3,1 miljarder ha** verifierades via pressmaterial och sekundära sammanfattningar, inte artikeltexten (sammanfattningen nämner inte siffran). Medium.
3. **Edmondson (Leicester) och Nicholls (Brighton)** – siffrorna (1,5 % av stadsytan → 3 % av befolkningen; ~1 kg/m²/säsong) hämtade ur söksammanfattningar/pressmaterial; artiklarnas fulltext var inte tillgänglig.
4. **Vertikalodlingens energi (15,6–20,1 kWh/kg sallat)** är sekundärt citerad via Cai m.fl. 2024 (arXiv-preprint, ej referentgranskad) som återger Weidner m.fl. 2021. Graamans m.fl. 2018 (Sverige, Nederländerna, Förenade Arabemiraten) kunde inte läsas (betalvägg).
5. **Payen m.fl. 2022** – endast sammanfattningen tillgänglig; medianskördar per odlingssystem (tak, kolonilott, växthus, vertikal) finns i artikeln men kunde inte hämtas. Bör hämtas för finare parametrar per odlingstyp.
6. **Takodling och akvaponik:** *Löst vid sammanställningen.* Orsini m.fl. 2014 (Bologna, >12 000 t/år ≈ 77 % av grönsaksbehovet) är verifierat via sammanfattningar, inte via abstractet (food_e40). Sanyé-Mengual m.fl. 2015 är läst i postprint och ger tomat 13–14, aubergine 8,2 och sallat 1–1,3 kg/m² (food_e41). Barbosa m.fl. 2015 (hydroponik 41 kg/m²/år, 82 gånger mer energi; food_e42) och Pantanella m.fl. 2012 (akvaponik ≈ hydroponik, 2,7–5,7 kg/m² per omgång; food_e43) är tillagda. Alla gäller sydligare klimat än Kalmar.
7. **Skogsträdgårdar**: inga tillförlitliga skördesiffror för nordiskt klimat; Björklund m.fl. 2018 påpekar stora kunskapsluckor.
8. **Musslor och tång i Kalmarsund:** *Delvis löst vid sammanställningen.* Kalmar kommun ledde 2022–2023 en förstudie om livsmedelsklassade musslor med provtagning bl.a. på Hagby musselodling (food_e45). Baltic Blue Growth hade enligt sökträffar två odlingar i Kalmarsund, men projektsidorna gav 404 och inga siffror används. För tång visar Kotta m.fl. 2022 att sockertång kräver >23 psu, medan grönslick och blåstång är möjliga i södra och östra Östersjön (food_e44). Inga skördesiffror per hektar för Kalmarsund finns. Antagandet 25–150 kg N/ha/år (food_e38) bygger fortfarande på tyska Östersjödata och bör ersättas med svenska ostkustdata när sådana finns. Kalmarsunds salthalt anges inte numeriskt.
9. **EAT-Lancet 2019** (14 g rött kött, ~2 500 kcal, ~11 miljoner dödsfall) kunde inte verifieras – endast 2025 års version (15 g, ~2 400 kcal, ~15 miljoner dödsfall, 27 % av global dödlighet) används.
10. **Svensk köttkonsumtion** är totalkonsumtion "vara med ben" (slaktvikt). Omräkningsfaktor till ätbar vikt verifierades inte; jämförelsen med EAT-Lancets 15 g/dag är därför ungefärlig.
11. **Röös-seminariets "0,21 ha per person"** (SLU, självförsörjningsscenario för 13,5 miljoner människor) syntes i ett sökresultat men källan (PDF) gick inte att öppna; används inte som evidens.
12. **Kalmar län betesmark (73 832 ha)** är SCB-data för 2020 via Region Kalmar, inte 2025.
13. **LaCanne & Lundgren 2018** är en enskild, delvis omdebatterad studie (gårdsdefinierade metoder, få gårdar); används bara för att visa avvägningen skörd vs lönsamhet.

#### Modellantaganden (confidence = assumption)
- **food_e36**: Dagens svenska kost ≈ 0,45 ha åkermarksekvivalenter/person (0,35–0,6); planetär hälsokost med djur på bete/restflöden ≈ 0,2 ha (0,15–0,3). Härlett från Sveriges åkerareal per capita (0,24 ha) och ~50 % självförsörjning, samt Peters m.fl. 2016 och Poore & Nemecek 2018. Grov härledning – kalibrera mot SLU.
- **food_e37**: Frilandsodling i stad 2 kg/m²/år (1–6); växthus 35–50 kg/m²/år; stadsodling kan täcka högst 10–25 % av grönsaksbehovet men <2 % av kaloribehovet. Räkneexempel med Kalmar kommuns behov (~4 800 ton köksväxter/år).
- **food_e38**: Musselodling i Kalmarsund ≈ 50 kg N/ha/år (25–150) till 1 000–4 000 €/kg N vid foderförsäljning.
- Egna beräkningar (ej antaganden men härledda): åkermark per invånare (riket 0,24 ha, Kalmar län 0,48 ha, Kalmar kommun 0,28 ha), växthusskördar (tomat 36,5, gurka 50,1 kg/m²), rött kött 53,3 kg/person/år, fånggrödeexemplet (~3 200 ton C/år på 10 000 ha).

---


## Tema 2–3: Energi (`energy`) och Mobilitet & stadsform (`mobility`)

### Bibliografi – Energi

- European Commission JRC (2024). PVGIS 5.3 – PVcalc API, Kalmar (lat 56.66, lon 16.36), 1 kWp, 14 % förluster, 27° söder / 15° öst. European Commission JRC. https://re.jrc.ec.europa.eu/api/v5_3/PVcalc?lat=56.66&lon=16.36&peakpower=1&loss=14&angle=27&aspect=0&outputformat=json
- European Commission JRC (2022). PVGIS 5.2 – PVcalc API, Kalmar, horisontell respektive optimal lutning (SARAH2). https://re.jrc.ec.europa.eu/api/v5_2/PVcalc?lat=56.66&lon=16.36&peakpower=1&loss=14&outputformat=json
- Energimyndigheten (2026). Allt färre installerar solceller – rättelse. https://www.energimyndigheten.se/nyhetsarkiv/2026/allt-farre-installerar-solceller---rattelse/
- Energimyndigheten (2025). Över 40 000 solcellsanläggningar installerades under 2024. https://www.energimyndigheten.se/nyhetsarkiv/2025/over-40000-solcellsanlaggningar-installerades-under-2024/
- Energimyndigheten (2025). Svensk sammanfattning – National Survey Report of PV Power Applications in Sweden 2024. https://www.energimyndigheten.se/4aa868/globalassets/forskning--innovation/solenergi/svensk-sammanfattning---national-survey-report-of-pv-power-applications-in-sweden-2024.pdf
- RWE Renewables Sweden (2023). 10 years of safe and reliable offshore generation: Swedish offshore wind farm Kårehamn supplies 34,000 homes annually. RWE. https://se.rwe.com/en/press/2023-11-30-a-decade-of-offshore-wind-power
- Regeringskansliet (2024). Havsbaserad vindkraft – en viktig del av en robust elproduktion (presentationsbilder, pressträff 4 november 2024). https://regeringen.se/globalassets/regeringen/dokument/klimat--och-naringslivsdepartementet/dokument/presentationsbilder-fran-presstraff-den-4-november-2024-om-havsbaserad-vindkraft-.pdf
- Regeringen (2024). Avslag på 13 havsbaserade vindkraftparker i Östersjön (pressmeddelande). https://regeringen.se/pressmeddelanden/2024/11/avslag-pa-13-havsbaserade-vindkraftparker-i-ostersjon/
- SVT Nyheter (2024). Regeringen säger nej till 13 havsbaserade vindkraftsparker. https://www.svt.se/nyheter/inrikes/regeringen-sager-nej-till-13-havsbaserade-vindkraftsparker
- SVT Nyheter Öst (2022, uppd. 2023). Försvarsmakten säger nej till vindkraft mellan Öland och Gotland. https://www.svt.se/nyheter/lokalt/ost/forsvarsmakten-sager-nej-till-vindkraft-mellan-oland-och-gotland
- IRENA (2025). Renewable Power Generation Costs in 2024 (+ Executive summary PDF). https://www.irena.org/Publications/2025/Jun/Renewable-Power-Generation-Costs-in-2024 ; https://www.irena.org/-/media/Files/IRENA/Agency/Publication/2025/Jul/IRENA_TEC_RPGC_in_2024_Summary_2025.pdf
- BloombergNEF (2024). Lithium-Ion Battery Pack Prices See Largest Drop Since 2017, Falling to $115 per Kilowatt-Hour. https://about.bnef.com/insights/clean-transport/lithium-ion-battery-pack-prices-see-largest-drop-since-2017-falling-to-115-per-kilowatt-hour-bloombergnef/
- IEA (2022). The Future of Heat Pumps – Executive summary. https://www.iea.org/reports/the-future-of-heat-pumps/executive-summary
- Bäumer, A. (2025). Heat pumps: phases of transition differ strongly among countries in Europe. Heinrich-Böll-Stiftung EU. https://eu.boell.org/en/2025/11/19/heat-pumps-phases-transition-differ-strongly-among-countries-europe (sekundär, nämns i kontext)
- Kalmar Energi (2022). Nytt miljötillstånd Moskogen 2022 – Samrådsunderlag. https://kalmarenergi.se/app/uploads/2022/09/Nytt-miljotillstand-Moskogen-2022_Samradsunderlag.pdf
- Länsstyrelsen i Kalmar län / Region Kalmar län (2025). Fossilbränslefri region 2030 – Handlingsprogram 2026–2028. https://utveckling.regionkalmar.se/globalassets/utvecklingsomraden/miljo-och-klimat/en-fossilbranslefri-region/fossilbranslefri-region-2030-handlingsprogram-2026-2028.pdf
- Energigas Sverige / Energimyndigheten (2025). Produktion av biogas och rötrester och dess användning år 2024. https://energigas.se/Media/mvwmqi3h/biogasstatistik-rapport_2024.pdf
- Svenska kraftnät (2024). Svenska kraftnät skruvar upp elförbrukningen i nya analyser (om Långsiktig marknadsanalys 2024). https://via.tt.se/pressmeddelande/3410239/svenska-kraftnat-skruvar-upp-elforbrukningen-i-nya-analyser
- CINEA / EU Sustainable Energy Week (2024). EU Energy Communities legislation 2.0: an upwards trend. https://sustainable-energy-week.ec.europa.eu/news/eu-energy-communities-legislation-20-upwards-trend-2024-03-14_en
- SVT Nyheter Småland (2023). Beskedet: Bostadsbolag i Kalmar får rätt att bygga eget elnät. https://www.svt.se/nyheter/lokalt/smaland/beskedet-bostadsbolag-i-kalmar-far-ratt-att-bygga-eget-elnat--0whdtr
- Energiföretagen Sverige (2025). Energiföretagen Sveriges position om energigemenskaper och energidelning (2025-09-09). https://www.energiforetagen.se/4a6968/globalassets/dokument/positioner/energiforetagen-sveriges-position-om-energidelning-energigemenskaper-och-ikn-250909.pdf

### Bibliografi – Mobilitet & stadsform

- Kalmar kommun m.fl. (2023). Klimatkontrakt 2030 – Kalmar kommun (januari 2023). Viable Cities. https://playground.viablecities.se/wp-content/uploads/2023/11/Viable_Cities_Klimatkontrakt_Kalmar_januari_2023.pdf
- Trafikanalys (2026). Resvanor i Sverige 2025 (RVU Sverige). https://www.trafa.se/transportmonster/RVU-Sverige/
- Kelly P, Kahlmeier S, Götschi T, Orsini N, Richards J, Roberts N, Scarborough P, Foster C (2014). Systematic review and meta-analysis of reduction in all-cause mortality from walking and cycling and shape of dose response relationship. International Journal of Behavioral Nutrition and Physical Activity 11:132. https://doi.org/10.1186/s12966-014-0132-x
- Celis-Morales CA, Lyall DM, Welsh P, m.fl. (2017). Association between active commuting and incident cardiovascular disease, cancer, and mortality: prospective cohort study. BMJ 357:j1456. https://doi.org/10.1136/bmj.j1456
- Mueller N, Rojas-Rueda D, Khreis H, m.fl. (2020). Changing the urban design of cities for health: The superblock model. Environment International 134:105132. https://doi.org/10.1016/j.envint.2019.105132
- Concello de Pontevedra; Dirección General de Tráfico (2022). La seguridad vial integrada en un enfoque global de la ciudad – Pontevedra (Catálogo de experiencias urbanas en movilidad segura y sostenible, NIPO 128-22-050-6). DGT. https://www.dgt.es/.galleries/downloads/conoce_la_dgt/que-hacemos/estrategias-y-planes/Experiencias-urbanas/pdf/84000-Pontevedra.pdf
- European Commission, DG MOVE (2020-05-18). Kruševac, Karditsa, Brussels and Pontevedra win European Sustainable Mobility Awards. https://transport.ec.europa.eu/news-events/news/krusevac-karditsa-brussels-and-pontevedra-win-european-sustainable-mobility-awards-2020-05-18_en
- Oslo kommune (åtkomst 2026). Bilfritt byliv. https://www.oslo.kommune.no/bilfritt-byliv/
- Stad Gent, Mobiliteitsbedrijf i.s.m. Transport & Mobility Leuven (2019). Evaluatie Circulatieplan Gent – Tweede periode april–november 2018. Stad Gent. https://stad.gent/sites/default/files/onepager/cta/Evaluatierapport%20Circulatieplan%20Gent%202019%20finaal.pdf
- Cairns S, Atkins S, Goodwin P (2002). Disappearing traffic? The story so far. Proceedings of the ICE – Municipal Engineer 151(1):13–22. https://doi.org/10.1680/muen.2002.151.1.13
- Aldred R, Goodman A (2020). Low Traffic Neighbourhoods, Car Use, and Active Travel: Evidence from the People and Places Survey of Outer London Active Travel Interventions. Findings. https://doi.org/10.32866/001c.17128
- Transport for London (2018). Walking and cycling: the economic benefits. https://content.tfl.gov.uk/walking-cycling-economic-benefits-summary-pack.pdf
- Moreno C, Allam Z, Chabaud D, Gall C, Pratlong F (2021). Introducing the “15-Minute City”: Sustainability, Resilience and Place Identity in Future Post-Pandemic Cities. Smart Cities 4(1):93–111. https://doi.org/10.3390/smartcities4010006
- Climate-ADAPT (2017). Urban storm water management in Augustenborg, Malmö. EEA/European Commission. https://climate-adapt.eea.europa.eu/en/metadata/case-studies/urban-storm-water-management-in-augustenborg-malmo
- Climate-ADAPT (2016). The economics of managing heavy rains and stormwater in Copenhagen – The Cloudburst Management Plan. https://climate-adapt.eea.europa.eu/en/metadata/case-studies/the-economics-of-managing-heavy-rains-and-stormwater-in-copenhagen-2013-the-cloudburst-management-plan

### Osäkerheter / att dubbelkolla

**Metod:** Sessionens gemensamma webbsökningskvot tog slut halvvägs. Resterande verifiering gjordes genom direkta hämtningar av kända primära URL:er (myndighetssidor, PDF:er) och DOI-uppslag i Europe PMC/OpenAlex. Några önskade delar kunde därför inte beläggas (se nedan).

Energi:
- **PVGIS (energy_e1, e2):** modellberäkning från satellitdata, inte uppmätt produktion. 27°-värdet (1 010 kWh/kWp) använder SARAH3 (v5.3); 42°- och 0°-värdena använder SARAH2 (v5.2). Små skillnader mellan databaserna. Degradering 0,3–0,5 %/år är ett **antagande** och har inte verifierats.
- **Antagande energy_e19:** Kalmars elanvändning ≈ 390 GWh är härledd ("1/3 av Kalmars elbehov" = 130 GWh). Geografisk avgränsning är oklar. Bör ersättas med SCB:s kommunala och regionala energibalans.
- **Antagande energy_e20:** 5 m²/kWp är härlett från modulverkningsgrad ~20–22 %, inte från en källa.
- **energy_e3:** Energimyndighetens text om 2025 ("ökning med 15 procent i installerad effekt") tolkas som att den totala effekten ökade 15 % (4 800 → 5 541 MW = +15,4 %). Det stämmer med siffrorna.
- **energy_e6 Kårehamn:** produktionen (194 GWh) är RWE:s egen uppgift. Kapacitetsfaktorn ~46 % är min beräkning.
- **energy_e7/e8:** SVT är källa till TWh-siffrorna för enskilda parker (Aurora 24 TWh, Erik Segersäll 19,5 TWh, Kultje 11 TWh). Den sammanlagda siffran "ca 30 GW / 140 TWh" för alla 13 parker fanns i en söksammanfattning men kunde inte bekräftas i primärkälla och har därför **inte** tagits med.
- **energy_e9:** Fallet "−90 % sol-LCOE 2010–2023" kommer från IRENA:s rapport för 2023 och är bekräftat bara via sekundära nyhetskällor (pv-tech, pv-magazine). Siffrorna för 2024 är bekräftade i IRENA:s sammanfattnings-PDF.
- **energy_e12:** Andelen värmepumpar varierar mellan källor: IEA anger att över 40 % av byggnaderna har värmepump, Böll/EHPA ca 50 per 100 hushåll, och en söksammanfattning ca 60 % av småhusen (overifierad). Energimyndighetens officiella småhusstatistik har inte hämtats. SCOP 3–4 är ett antagande inom IEA:s intervall 3–5.
- **Energigemenskaper:** Energimyndighetens rapport ER 2024:20 ("Energigemenskaper – förutsättningar och förslag på främjandeinsats") kunde inte öppnas (404/blockerad). Därför saknas uppgifter om antalet energigemenskaper i Sverige och om myndighetens förslag. RED II (art. 22) och elmarknadsdirektivet (art. 16) nämns utifrån EU-kommissionens text; artikelnumren har inte kontrollerats mot EUR-Lex i den här sessionen.
- **Ej verifierat, därför ej med:**
  - Utgrunden (Kalmarsund, tidig havsvind cirka år 2000).
  - Biogaspotentialen 10 TWh enligt SOU 2019:63 (sågs bara i en söksammanfattning).
  - Lazard LCOE+ 2025/2026 (sidan kräver nedladdning av PDF).
  - Simris/E.ON som exempel på ö-drift.
  - Kalmar kommuns egen vindkraftsplan och dess siffror.
- **Moskogen:** fjärrvärme- och elsiffrorna gäller 2017–2021. Anläggningen ansökte 2022 om att öka effekten från 100 till 115 MW. Nuvarande status är inte kontrollerad.

Mobilitet:
- **mobility_e1–e3:** Färdmedelsfördelningen (bil ~60 %) och andelen korta bilresor (44 %) kommer från kommunens klimatkontrakt (2023). Det framgår inte om andelarna gäller antal resor eller personkilometer, och källan till underlaget (troligen kommunens resvaneundersökning) anges inte. Kontrollera mot Kalmar kommuns RVU och mobilitetsstrategi.
- **mobility_e4:** Andelarna har jag räknat fram ur antalet resor. Cykelns andel anges inte på sidan, och ca 15 % ska **inte** användas – det var en felaktig slutsats i ett mellanled.
- **mobility_e8 och mobility_e18, Pontevedra:** Tidigare byggde posten på Wikipedia. Vid sammanställningen ersattes den med kommunens uppgifter i spanska DGT:s katalog: −92/−77/−53 % motortrafik, 66 % gångresor, svårt skadade 129 → 4. Till det kom EU-kommissionens prismotivering: noll trafikdöda 2011–2018 och 80 % av barnen 6–12 år går själva till skolan. Båda är kommunens egna, inte oberoende utvärderade data (medium). Siffran om 67 % lägre CO2 och påståenden om befolkningstillväxt har inte verifierats i primärkälla och används inte.
- **mobility_e9 Oslo:** De 760 parkeringsplatserna kommer från kommunens sida. Effekter på handel och fotgängarflöden (rapporterna "Byregnskap") har inte granskats.
- **mobility_e10 och mobility_e19, Gent:** Löst vid sammanställningen med stadens utvärderingsrapport från 2019 (194 s., text extraherad ur pdf). Där står −17 % bilar in och ut ur innerstaden, +50–60 % cyklister och färdmedelsfördelningen 2015 → 2018 (cykel 30 → 35 %, kollektivtrafik 9 → 14 %, bil som förare 40 → 33 %). Om handeln: 30 % säger att de handlar mer sällan i centrum, men nyetableringarna i handel och horeca ökade med 20 %. Siffror om luftkvalitet (NO2) finns i rapportens bilaga B.10 men har inte förts in. Ofta citerade siffror som '+25 % cyklister första året' och '−12 % rusningstrafik' kommer från tidigare kommunikation och har inte använts.
- **mobility_e11:** Den ofta citerade "medianminskningen ~11 % av trafiken" i Cairns m.fl. finns inte i abstractet och har därför inte tagits med som siffra.
- **mobility_e13:** TfL-sammanställningen är sekundär och gäller städer med hög cykelandel. Flera siffror i PDF:en finns bara i bilder och kunde inte läsas.
- **mobility_e14:** 15-minutersstaden är ett koncept. Kritiken (gentrifiering, svag effektevidens, passar dåligt på landsbygd) är min sammanfattning och inte belagd med en specifik källa i denna sammanställning.
- **mobility_e15 Augustenborg:** Climate-ADAPT-sidan anger också sociala effekter (arbetslöshet 30 % → 6 %, valdeltagande 54 % → 79 %). De har **inte** tagits med, eftersom de inte kan tillskrivas dagvattenåtgärderna och verkar osäkra. Villarreal m.fl. (2004, Ecological Engineering) och Berndtsson (2010, gröna tak) hittades men deras abstract gick inte att läsa (403), så inga siffror därifrån används.
- **Antagande mobility_e17:** Att upp till 50 % av bilresorna under 5 km kan flyttas är ett modellantagande, härlett ur kommunens eget mål och fallexempel.
- **Saknas:** Naturvårdsverkets siffror för transportsektorns utsläpp (sidorna gav 404), vetenskapliga utvärderingar av svenska elcykelpremier, och Kalmars placering i cykelstadsrankningar. Lägg till dem om möjligt när sökkvoten är återställd.

---


## Tema 4–5: Gemenskap & samarbete (`community`) och Hälsa (`health`)

### Bibliografi – Gemenskap & samarbete

- Holt-Lunstad, J., Smith, T. B., Layton, J. B. (2010). Social Relationships and Mortality Risk: A Meta-analytic Review. PLoS Medicine. https://doi.org/10.1371/journal.pmed.1000316
- Holt-Lunstad, J., Smith, T. B., Baker, M., Harris, T., Stephenson, D. (2015). Loneliness and Social Isolation as Risk Factors for Mortality: A Meta-Analytic Review. Perspectives on Psychological Science 10:227–237. https://doi.org/10.1177/1745691614568352
- World Health Organization (2025). Social connection linked to improved health and reduced risk of early death (nyhetsmeddelande om WHO Commission on Social Connection-rapporten, 30 juni 2025). WHO. https://www.who.int/news/item/30-06-2025-social-connection-linked-to-improved-heath-and-reduced-risk-of-early-death
- Statistiska centralbyrån (2024). Hundratusentals personer saknar en nära vän (pressmeddelande 22 april 2024, ULF 2023). SCB. https://www.scb.se/pressmeddelande/hundratusentals-personer-saknar-en-nara-van/
- Folkhälsomyndigheten (2024). Ensamhet – förekomst, konsekvenser och åtgärder. En kartläggning (art.nr 24065). Folkhälsomyndigheten. https://www.folkhalsomyndigheten.se/contentassets/09eac2b8b63e4d79a9e1f79dcbc71409/ensamhet-forekomst-konsekvenser-atgarder.pdf
- Klinenberg, E. (2002). Heat Wave: A Social Autopsy of Disaster in Chicago. University of Chicago Press. https://press.uchicago.edu/Misc/Chicago/443213in.html
- Klinenberg, E. (2018). Palaces for the People: How Social Infrastructure Can Help Fight Inequality, Polarization, and the Decline of Civic Life. Crown. (Endast verifierad via Wikipedia-artikeln om Klinenberg; används bara som begreppsreferens.)
- Branas, C. C., South, E., Kondo, M. C., Hohl, B. C., Bourgois, P., Wiebe, D. J., MacDonald, J. M. (2018). Citywide cluster randomized trial to restore blighted vacant land and its effects on violence, crime, and fear. PNAS. https://doi.org/10.1073/pnas.1718503115
- Carrere, J., Reyes, A., Oliveras, L., Fernández, A., Peralta, A., Novoa, A. M., Pérez, K., Borrell, C. (2020). The effects of cohousing model on people's health and wellbeing: a scoping review. Public Health Reviews 41:22. https://doi.org/10.1186/s40985-020-00138-1
- TU Wien future.lab (2023). CO-HOPE Meeting in Stockholm (om Färdknäppen). TU Wien. https://futurelab.tuwien.ac.at/plattform/news/co-hope-meeting-in-stockholm
- Cook, M. (2025). Dutch nursing home offers free rent to college students in exchange for their time and companionship. Good Good Good. https://www.goodgoodgood.co/articles/dutch-nursing-home-free-housing-college-students
- Cox, M., Arnold, G., Villamayor Tomás, S. (2010). A Review of Design Principles for Community-based Natural Resource Management. Ecology and Society 15(4):38. https://www.ecologyandsociety.org/vol15/iss4/art38/
- Ostrom, E. (1990). Governing the Commons: The Evolution of Institutions for Collective Action. Cambridge University Press. (Refereras via Cox m.fl. 2010.)
- Council of Europe (2016). Ireland – Public debate concerning abortion and the repeal of the eighth amendment to the constitution. https://www.coe.int/web/bioethics/-/ireland-public-debate-concerning-abortion-and-the-repeal-of-the-eighth-amendment-to-the-constitution
- The Citizens' Assembly (u.å.). 2016–2018 Citizens' Assembly. https://citizensassembly.ie/previous-assemblies/2016-2018-citizens-assembly/
- Giraudet, L.-G. m.fl. (2022). "Co-construction" in Deliberative Democracy: Lessons from the French Citizens' Convention for Climate. Humanities and Social Sciences Communications. https://hal.archives-ouvertes.fr/hal-03119539
- Capone, G. (2018). It's time to let citizens tackle the wickedest public problems. Apolitical. https://apolitical.co/en/articles/citizens-tackle-public-problems
- OECD (2020). Innovative Citizen Participation and New Democratic Institutions: Catching the Deliberative Wave. OECD Publishing. https://doi.org/10.1787/339306da-en
- Gonçalves, S. (2014). The Effects of Participatory Budgeting on Municipal Expenditures and Infant Mortality in Brazil. World Development 53:94–110. https://doi.org/10.1016/j.worlddev.2013.01.009
- Touchton, M., Wampler, B. (2014). Improving Social Well-Being Through New Democratic Institutions. Comparative Political Studies 47(10):1442–1469. https://scholarworks.boisestate.edu/polsci_facpubs/146/
- Banque des Territoires (2019). La Mairie de Paris débloque 100 millions d'euros par an pour son budget participatif. https://www.banquedesterritoires.fr/la-mairie-de-paris-debloque-100-millions-deuros-par-pour-son-budget-participatif
- Lewis, K., Stronge, W., Kellam, J., Kikuchi, L., Schor, J., Fan, W., Kelly, O., Gu, G., Frayne, D., Burchell, B. m.fl. (2023). The Results Are In: The UK's Four-Day Week Pilot. Autonomy. https://autonomy.work/portfolio/uk4dwpilotresults/
- Alda & Autonomy (2021). Going Public: Iceland's Journey to a Shorter Working Week. https://en.alda.is/2021/07/04/going-public-icelands-journey-to-a-shorter-working-week/
- Greenfield, R. (2017). How the Six-Hour Workday Actually Saves Money. Bloomberg. https://www.bloomberg.com/news/articles/2017-04-17/how-the-six-hour-workday-actually-saves-money (läst via återpublicering i New Equipment Digest, 18 april 2017)
- SVT Nyheter Väst (2015). Färre sjukskrivningar med 6-timmarsdag. https://www.svt.se/nyheter/lokalt/vast/farre-sjukskrivningar-med-6-timmarsdag
- Timebanking UK (2017). Evaluation and Impact of the London Time Bank Network. https://timebanking.org/wp-content/uploads/2020/05/7.-Evaluation-and-Impact-of-the-London-Time-Bank-Network-2017.pdf
- Naughton-Doe, R., Cameron, A., Carpenter, J. (2021). Timebanking and the co-production of preventive social care with adults; what can we learn from the challenges of implementing person-to-person timebanks in England? Health and Social Care in the Community 29(5):1285–1295. https://eprints.whiterose.ac.uk/165739/

### Bibliografi – Hälsa

- White, M. P., Alcock, I., Grellier, J., Wheeler, B. W., Hartig, T., Warber, S. L., Bone, A., Depledge, M. H., Fleming, L. E. (2019). Spending at least 120 minutes a week in nature is associated with good health and wellbeing. Scientific Reports. https://doi.org/10.1038/s41598-019-44097-3
- Engemann, K., Pedersen, C. B., Arge, L., Tsirogiannis, C., Mortensen, P. B., Svenning, J.-C. (2019). Residential green space in childhood is associated with lower risk of psychiatric disorders from adolescence into adulthood. PNAS. https://doi.org/10.1073/pnas.1807504116
- Twohig-Bennett, C., Jones, A. (2018). The health benefits of the great outdoors: A systematic review and meta-analysis of greenspace exposure and health outcomes. Environmental Research. https://doi.org/10.1016/j.envres.2018.06.030
- WHO Regional Office for Europe (2016). Urban green spaces and health. A review of evidence. https://www.who.int/europe/publications/i/item/WHO-EURO-2016-3352-43111-60341
- South, E. C., Hohl, B. C., Kondo, M. C., MacDonald, J. M., Branas, C. C. (2018). Effect of Greening Vacant Land on Mental Health of Community-Dwelling Adults: A Cluster Randomized Trial. JAMA Network Open. https://doi.org/10.1001/jamanetworkopen.2018.0298
- Bull, F. C., Al-Ansari, S. S., Biddle, S. m.fl. (2020). World Health Organization 2020 guidelines on physical activity and sedentary behaviour. British Journal of Sports Medicine. https://doi.org/10.1136/bjsports-2020-102955
- Lee, I.-M., Shiroma, E. J., Lobelo, F., Puska, P., Blair, S. N., Katzmarzyk, P. T. (2012). Effect of physical inactivity on major non-communicable diseases worldwide: an analysis of burden of disease and life expectancy. The Lancet 380(9838):219–229. https://doi.org/10.1016/S0140-6736(12)61031-9
- Folkhälsomyndigheten (2023). Skolbarns hälsovanor i Sverige 2021/2022 – Nationella resultat (art.nr 22228). https://www.folkhalsomyndigheten.se/statistik-och-data/kommenterad-statistik/skolbarns-halsovanor/skolbarns-halsovanor-2021-2022/
- Celis-Morales, C. A., Lyall, D. M., Welsh, P. m.fl. (2017). Association between active commuting and incident cardiovascular disease, cancer, and mortality: prospective cohort study. BMJ. https://doi.org/10.1136/bmj.j1456
- Masters, R., Anwar, E., Collins, B., Cookson, R., Capewell, S. (2017). Return on investment of public health interventions: a systematic review. Journal of Epidemiology and Community Health. https://doi.org/10.1136/jech-2016-208141
- Statistiska centralbyrån (2026). Återstående medellivslängd efter region, kön, tabellinnehåll och årsintervall (tabell BE0101I/Medellivsl, hämtad via SCB:s API 2026-10-08). https://www.statistikdatabasen.scb.se/pxweb/sv/ssd/START__BE__BE0101__BE0101I/Medellivsl/
- Statistiska centralbyrån (2025). Folkmängden efter region, civilstånd, ålder, kön, tabellinnehåll och år (tabell BE0101A/BefolkningNy, år 2024, hämtad via SCB:s API 2026-10-08). https://www.statistikdatabasen.scb.se/pxweb/sv/ssd/START__BE__BE0101__BE0101A/BefolkningNy/
- Svenskt Demenscentrum (2025, uppdaterad 18 aug 2025). Demens i siffror (bygger på Karolinska Institutet: Demenssjukdomarnas samhällskostnader i Sverige 2023). https://www.demenscentrum.se/Fakta-om-demens/Demens-i-siffror/
- Folkhälsomyndigheten (2026). Folkhälsan i Sverige (inkl. årsrapport 2025; sidan uppdaterad 31 mars 2026). https://www.folkhalsomyndigheten.se/statistik-och-data/kommenterad-statistik/folkhalsan-i-sverige/

### Osäkerheter / att dubbelkolla

**Söklimit:** Sessionens gemensamma webbsökningsbudget tog slut halvvägs. Resterande uppgifter verifierades genom direkta hämtningar av kända sidor, DOI-uppslag i Europe PMC/Crossref och SCB:s API – men några planerade källor kunde inte letas fram (se nedan).

Gemenskap:
- **Klinenberg, siffran 40 mot 4 döda per 100 000** (North Lawndale mot Little Village): bara bekräftad via sekundära sammanfattningar av boken (sökresultat), inte i boken själv. Wikipedia anger 739 värmerelaterade dödsfall och 692 överdödsfall (annan tidsperiod/metod).
- **Palaces for the People (2018):** inga siffror används; boken bekräftad bara via Wikipedia.
- **Färdknäppen:** "ca 50 boende i åldern 45–90 år" och startåret 1993 kommer från sökresultatsammanfattningar (TU Wien/De Gruyter); TU Wien-sidan bekräftade 43 lägenheter, 37–75 m² och ca 400 m² gemensam yta. Nyhetens årtal (2023) bygger på bildkrediter.
- **Humanitas Deventer:** bara pressuppgifter. "6 studenter och 160 äldre" kommer från äldre nyhetsartiklar; ingen effektutvärdering hittad.
- **Frankrikes klimatkonvent:** att 146 av 149 förslag "accepterades" och att bara ~10 % (15 förslag) genomfördes oförändrade (Reporterre) bekräftades bara via sökresultat. Reporterres sida gav 403 och info.gouv.fr gav 403. Giraudet m.fl.: själva PDF:en gav "Access denied". Slutsatserna är hämtade från abstract och sammanfattningar.
- **Gdańsk:** gråmaterial (opinionsartikel i Apolitical). "Nära 40 miljoner USD" och "mindre översvämning 2017 tack vare rådet" är författarens uppgifter.
- **Gonçalves:** effektstorlekarna (1–3 färre spädbarnsdödsfall per 1 000, ca 10–20 %; +1,2 procentenheter i budgetandel) kommer från arbetsrapporten från 2009 (LSE), inte från den publicerade World Development-versionen 2014, som jag inte kunde öppna. Riktningen stämmer med abstractet till den publicerade versionen.
- **UK:s fyradagarsvecka:** "−65 % sjukdagar" fanns i sökresultat, men inte i den sammanfattning av Autonomys sida som jag hämtade. Försöket saknar kontrollgrupp och företagen anmälde sig själva.
- **Island:** rapporten är skriven av förespråkande organisationer, och upphovspersonerna (Haraldsson & Kellam) är inte verifierade. Därför anges "Alda & Autonomy".
- **Svartedalen:** källorna skiljer sig. Bloomberg/BBC 2017 anger 12 Mkr, 17 extra anställda och 68 undersköterskor. SVT 2015 anger 8 Mkr/år, 14 nyanställda samt 64 heltids- och 16 deltidsanställda. Någon officiell slutrapport (Agenda HR / Göteborgs stad) hittades inte. Uppgiften "10 % mindre sjukfrånvaro, 50 % friskare" i sökresultaten är inte verifierad och används inte.
- **London Time Bank:** utvärderingen gjordes av branschorganisationen själv med HACT-värdering (ett SROI-liknande mått). Cambridge-utvärderingen (CCHPR) gick inte att nå (DNS-fel).
- **OECD-DOI:n 10.1787/339306da-en** är kontrollerad i Crossref och har rätt titel.
- **SCB:s pressmeddelande:** titeln är tagen från URL:en, "Hundratusentals personer saknar en nära vän".

Hälsa:
- **Engemann 2019:** "upp till 55 %" gäller den mest påverkade diagnosgruppen. Siffran ska inte användas som generell effekt.
- **White 2019:** tvärsnittsdata från England. I JSON anges confidence "medium", trots att studien är stor och ofta citerad.
- **Vuxnas fysiska aktivitet i Sverige** (andel som når 150 min/vecka): hittades inte på grund av söklimiten och Folkhälsomyndighetens omgjorda webbplats (gamla URL:er ger 404). Bör kompletteras från Folkhälsodata / Nationella folkhälsoenkäten.
- **Skolbarns hälsovanor 2025/26:** resultaten publiceras 2026–2027 och var inte tillgängliga. Siffrorna gäller 2021/22.
- **Naturrecept och social förskrivning:** jag hittade ingen verifierad effektstudie (DOI-uppslaget för en meta-analys om naturrecept i Lancet Planetary Health misslyckades). Påståendet att evidensen är begränsad bygger på detta och bör dubbelkollas.
- **Demens:** siffrorna kommer från Svenskt Demenscentrum, som sammanfattar KI:s rapport från 2023. Själva rapporten är inte öppnad.
- **Region Kalmar läns egen folkhälsostatistik** (Hälsa på lika villkor per län/kommun) hittades inte. Därför antas Kalmar ligga nära rikssnittet för självskattad hälsa, ensamhet och fysisk aktivitet. Dessa antaganden är markerade i context_sv.
- **Andelen 65+ och 80+** är egen beräkning från SCB:s API (summering per ettårsklass, år 2024).
- **Kalmar kommuns andel bostäder inom 300 m från grönyta ≥ 0,5 ha** är inte känd och behöver räknas fram i GIS.

Antaganden (confidence = "assumption"):
- community_e26: ett kommunalt program kan sänka andelen med ensamhetsbesvär med 2–5 procentenheter på 10–20 år.
- health_e17: +0,5–1 procentenhet god hälsa per 10 procentenheter fler som når 120 minuter natur i veckan. Härlett från White, med effekten halverad.
- health_e18: lokal prevention ger 2–4 kr per satsad krona, med 5–10 års fördröjning. Härlett från Masters, nedjusterat.
- I spakarnas effects_sv finns ytterligare grova antaganden, markerade som "antagande":
  - medborgarråd med mandat ger +5–15 % på indexet för politisk röst per decennium;
  - arbetstidsförkortning ger 15–25 % högre personalkostnad i bemanningsstyrda verksamheter (härlett från Svartedalen: 17 extra anställda på 68);
  - ungas psykiska hälsa: en sänkning med "några procentenheter".

---


## Tema 6–7: Avdigitalisering & digital motståndskraft (`digital_resilience`) och Acceleration med teknik & AI (`tech_ai`)

### Bibliografi – digital_resilience

- Regeringskansliet (Utbildningsdepartementet) (2024). Regeringen gör stora satsningar på läsning och böcker i skolan. Regeringen.se. https://regeringen.se/artiklar/2024/10/regeringen-gor-stora-satsningar-pa-lasning-och-bocker-i-skolan/
- Regeringskansliet (2023). Regeringen gör det möjligt för skolor att söka bidrag för fler läroböcker (pressmeddelande 2023-03-02). https://www.regeringen.se/pressmeddelanden/2023/03/regeringen-gor-det-mojligt-for-skolor-att-soka-bidrag-for-fler-larobocker/
- Associated Press / VOA Learning English (2023-09-26). Sweden Brings Books, Handwriting Back to School. https://learningenglish.voanews.com/a/sweden-brings-books-handwriting-back-to-school/7277000.html
- OECD (2023). PISA 2022 Results (Volume I and II) – Country Notes: Sweden. OECD Publishing. https://www.oecd.org/en/publications/pisa-2022-results-volume-i-and-ii-country-notes_ed6fbcc5-en/sweden_de351d24-en.html (siffror verifierade via The Local 2023-12-05: https://www.thelocal.se/20231205/swedish-students-maths-and-reading-scores-plunge-in-pisa-world-rankings)
- Regeringskansliet / Folkhälsomyndigheten (2024-09-02). Rekommendationer om digital medieanvändning för barn och unga. https://regeringen.se/pressmeddelanden/2024/09/rekommendationer-om-digital-medieanvandning-for-barn-och-unga/
- Regeringen (2026). Prop. 2025/26:193 Bättre förutsättningar för trygghet och studiero i skolan. https://data.riksdagen.se/dokument/HD03193.html
- Sveriges riksdag, Utbildningsutskottet (2026). Bättre förutsättningar för trygghet och studiero i skolan (bet. 2025/26:UbU22, beslut 2026-05-21). https://www.riksdagen.se/sv/dokument-och-lagar/dokument/betankande/battre-forutsattningar-for-trygghet-och-studiero-i_hd01ubu22/html/
- Beland, L.-P. & Murphy, R. (2016). Ill communication: technology, distraction & student performance. Labour Economics (LSE Research Online). https://eprints.lse.ac.uk/62574
- Goodyear, V., Randhawa, A., Adab, P., Al-Janabi, H., et al., Pallan, M. (2025). School phone policies and their association with mental wellbeing, phone use, and social media use (SMART Schools): a cross-sectional observational study. The Lancet Regional Health – Europe. https://doi.org/10.1016/j.lanepe.2025.101211
- Abrahamsson, S. (2024). Smartphone Bans, Student Outcomes and Mental Health. NHH Discussion Paper 1/2024. https://swopec.hhs.se/nhheco/abs/nhheco2024_001.htm
- UNESCO GEM Report team (2025, uppdaterad 2025-09-23). To ban or not to ban? Monitoring countries' regulations on smartphone use in school. World Education Blog. https://world-education-blog.org/2025/01/23/to-ban-or-not-to-ban-monitoring-countries-regulations-on-smartphone-use-in-school/
- Utbildningsstyrelsen (Finland) (2025). Riksdagen behandlar begränsning av användning av mobiltelefoner i den grundläggande utbildningen. https://www.oph.fi/sv/nyheter/2025/riksdagen-behandlar-begransning-av-anvandning-av-mobiltelefoner-i-den-grundlaggande
- Sveriges riksbank (2025). Betalningsrapport 2025 – Kontantanvändningen fortsätter att minska. https://www.riksbank.se/sv/betalningar--kontanter/sa-betalar-svenskarna/betalningsrapport-2025/trender-pa-betalningsmarknaden/svensk-betalningsmarknad-ar-nastan-helt-digital/kontantanvandningen-fortsatter-att-minska/
- Sveriges riksbank (2026). Offlinebetalningar. https://www.riksbank.se/sv/betalningar--kontanter/betalningsberedskap/offlinebetalningar/ ; pressmeddelande 2026-07-01 "Offlinebetalningar med kort – nu utökas möjligheterna": https://www.riksbank.se/sv/press-och-publicerat/nyheter-och-pressmeddelanden/pressmeddelanden/2026/offlinebetalningar-med-kort---nu-utokas-mojligheterna/
- Sveriges riksdag, Finansutskottet (2026). Åtgärder för att stärka kontanternas funktionssätt (bet. 2025/26:FiU39, prop. 2025/26:199). https://www.riksdagen.se/sv/dokument-och-lagar/dokument/betankande/atgarder-for-att-starka-kontanternas-funktionssatt_hd01fiu39/html/
- MSB (nu Myndigheten för civilt försvar, MCF) (2024). Om krisen eller kriget kommer (publ.nr MSB2398). https://www.mcf.se/sv/publikationer/om-krisen-eller-kriget-kommer/ (PDF: https://rib.msb.se/filer/pdf/30828.pdf)
- Internetstiftelsen (2025). Svenskarna och internet 2025 – Sammanfattning. https://svenskarnaochinternet.se/app/uploads/2025/09/svenskarna-och-internet-2025-sammanfattning.pdf
- SVT Nyheter (2018). 1,1 miljoner i digitalt utanförskap. https://www.svt.se/nyheter/inrikes/1-1-miljoner-i-digitalt-utanforskap

### Bibliografi – tech_ai

- Hernström, V. et al.; Lång, K. (2025). Screening performance and characteristics of breast cancer detected in the Mammography Screening with Artificial Intelligence trial (MASAI): a randomised, controlled, parallel-group, non-inferiority, single-blinded, screening accuracy study. The Lancet Digital Health. https://doi.org/10.1016/S2589-7500(24)00267-X
- Gommers, J. et al.; Lång, K. (2026). Interval cancer, sensitivity, and specificity comparing AI-supported mammography screening with standard double reading without AI in the MASAI study […]. The Lancet. https://doi.org/10.1016/S0140-6736(25)02464-X (Lunds universitets nyhet 2026-01-30: https://www.lunduniversity.lu.se/article/ai-support-breast-cancer-screening-fewer-missed-cancer-cases)
- Lång, K. et al. (2023). Artificial intelligence-supported screen reading versus standard double reading in the Mammography Screening with Artificial Intelligence trial (MASAI): a clinical safety analysis […]. The Lancet Oncology 24(8):936–944. https://doi.org/10.1016/S1470-2045(23)00298-X (bakgrund, ej egen evidenspost)
- Budzyń, K., Romańczyk, M., Kitala, D., Kołodziej, P., Bugajski, M., et al. (2025). Endoscopist deskilling after exposure to artificial intelligence in colonoscopy: a multicenter observational study. The Lancet Gastroenterology & Hepatology 10(10):896–903. https://doi.org/10.1016/S2468-1253(25)00133-5
- International Energy Agency (2025). Energy and AI – Executive summary. IEA. https://www.iea.org/reports/energy-and-ai/executive-summary
- Vahdat, A. & Dean, J. (2025). Measuring the environmental impact of AI inference. Google Cloud Blog. https://cloud.google.com/blog/products/infrastructure/measuring-the-environmental-impact-of-ai-inference
- Nearing, G., Cohen, D., Dube, V., et al., Matias, Y. (2024). Global prediction of extreme floods in ungauged watersheds. Nature 627:559–563. https://doi.org/10.1038/s41586-024-07145-1
- World Meteorological Organization (2025). Early Warnings for All. https://wmo.int/activities/early-warnings-all
- Tessler, M. H., Bakker, M. A., Jarrett, D., et al., Summerfield, C. (2024). AI can help humans find common ground in democratic deliberation. Science 386(6719):eadq2852. https://doi.org/10.1126/science.adq2852
- AI-kommissionen (2025). AI-kommissionens Färdplan för Sverige (SOU 2025:12). Statens offentliga utredningar. https://data.riksdagen.se/fil/6A183AC7-F7E6-4E1B-A168-F24914B02129
- Europeiska kommissionen (2026). AI Act. Shaping Europe's digital future. https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai
- Georgieva, K. (2024). AI Will Transform the Global Economy. Let's Make Sure It Benefits Humanity. IMF Blog. https://www.imf.org/en/Blogs/Articles/2024/01/14/ai-will-transform-the-global-economy-lets-make-sure-it-benefits-humanity (bygger på Cazzaniga, M. et al. (2024). Gen-AI: Artificial Intelligence and the Future of Work. IMF Staff Discussion Note SDN/2024/001.)
- Nederländska staten (2026). Algoritmeregister van de Nederlandse overheid – Gemeente Amsterdam. https://algoritmes.overheid.nl/nl/organisatie/gemeente-amsterdam
- Balafoutis, A., Beck, B., Fountas, S., et al., Eory, V. (2017). Precision Agriculture Technologies Positively Contributing to GHG Emissions Mitigation, Farm Productivity and Economics. Sustainability 9(8):1339. https://doi.org/10.3390/su9081339
- Internetstiftelsen (2025). Svenskarna och internet 2025 – Sammanfattning (AI-kapitlet). https://svenskarnaochinternet.se/app/uploads/2025/09/svenskarna-och-internet-2025-sammanfattning.pdf

### Osäkerheter / att dubbelkolla

- **KI-citatet (digital_resilience_e2):** KI:s eget remissvar (ki.se/media/260512/download) kräver inloggning; ordalydelsen ("There's clear scientific evidence that digital tools impair rather than enhance student learning") är verifierad via AP/VOA, inte i originaltexten. Det svenska originalet bör hämtas manuellt om citatet ska användas ordagrant. Uttalandet är också kritiserat i forskningen.
- **PISA-siffror:** OECD:s landsrapport gick inte att hämta automatiskt (403); 482/−21 och 487/−19 är verifierade via The Local och en sökresultatsammanfattning av OECD-texten.
- **FoHM:s skärmtidsgränser:** Regeringens pressmeddelande innehöll inte siffrorna; åldersgränserna verifierades via Sveriges Radio (sökresultat) och sammanställningar (Generation Pep). FoHM:s egen sida bör länkas i slutprodukten. Åldersindelningen anges som 0–2, 2–5, 6–12, 13–18 år.
- **Förskolans digitala verktyg:** Uppgiften att kravet på digitala verktyg i förskolans läroplan tagits bort kunde **inte** verifieras (webbsökningsbudgeten tog slut) och finns därför inte med som evidens.
- **Kontantlagen (digital_resilience_e12):** Beloppsgränsen 0,1 prisbasbelopp och 25 mynt kommer från en sammanfattning av betänkandet; omräkningen till ca 5 900 kr (2026) gjordes av sammanfattningsverktyget och bör kontrolleras mot fastställt prisbasbelopp 2026.
- **Riksbankens 1 000 kr per vuxen:** Verifierad på Riksbankens sida om offlinebetalningar; MCF:s broschyr säger i stället "kontanter i olika valörer för minst en vecka" – två olika rekommendationer som båda gäller.
- **Antal hushåll som fick broschyren 2024** (ca 5 miljoner, november 2024) är bara verifierat via sökresultat, därför inte angivet som siffra.
- **Digitalt utanförskap:** 3 % (2025, icke-användare) och 1,1 miljoner (2018, bred definition) bygger på olika definitioner – därför antagande 2–11 % (digital_resilience_e17). "Nästan en fjärdedel" har avrundats till 25 % (e15).
- **Abrahamsson 2024:** Exakta effektstorlekar (t.ex. betyg i SD, antal vårdbesök) kunde inte verifieras från fulltexten (NHH-servern otillgänglig); bara abstraktets kvalitativa slutsatser används. Arbetsrapport, inte slutligt publicerad.
- **Beland & Murphy:** Effekten anges ibland som "6,4 % av en standardavvikelse" och ibland felaktigt som "6,4 % högre provresultat". LSE-abstraktet säger ~0,07 SD.
- **MASAI:** Antal deltagare anges som 105 915 (randomiserade, Lancet 2026) respektive 105 934 (Lancet Digital Health 2025) i olika källor; vi skriver "drygt 105 900". Författarnas förnamn och fullständiga titeln på Lancet 2026-artikeln (efter "MASAI study") är inte kontrollerade i originalet.
- **AI-omnibusen:** Datumen (förslag 19 nov 2025, politisk överenskommelse 7 maj 2026, i kraft 27 juli 2026, högrisk 2 dec 2027 / 2 aug 2028, nionde förbudet dec 2026) kommer från kommissionens webbsida i oktober 2026 via sammanfattningsverktyg; bör kontrolleras mot EUT-publiceringen.
- **AI-kommissionen:** Riksdagens databas daterar SOU 2025:12 till 2025-02-04; kommissionen presenterade färdplanen redan hösten 2024 (ej verifierat datum). Kostnad 16 712 mkr/10 år och 11 507 mkr/5 år är lästa direkt ur PDF:en.
- **Digg/McKinsey 140 mdkr/år:** SOU:n anger både "fem procent" och "cirka 6 procent" av offentliga utgifter på olika ställen – därför range 5–6 %.
- **Googles energisiffra per fråga** är egenrapporterad och inte oberoende granskad (confidence: low).
- **Precisionsjordbruk (tech_ai_e20):** Ingen kvantitativ minskningssiffra kunde verifieras (MDPI blockerade hämtning, abstraktet saknar siffror). Antagandet −5 till −20 % insatsmedel i context_sv är **ett modellantagande** som måste kalibreras.
- **IMF-siffrorna** (40 %/60 %) är från IMF-bloggen; själva Staff Discussion Note gick inte att öppna (HTTP 429).
- **Helsingfors AI-register** och **vTaiwan/Pol.is** kunde inte verifieras (webbsökningsbudgeten slut) och används inte som evidens.
- **SKR:s enkät om AI i kommuner** hittades inte; i stället används AI-kommissionens kvalitativa konstaterande att små kommuner ofta inte börjat använda AI.
- **Danmark/Norge:** Danska skolmobilbeslut verifierades inte. Norge representeras bara av Abrahamsson-studien; Finland av Utbildningsstyrelsens nyhet (lagen beskrivs där som väntad från 1 aug 2025 – slutligt antagande inte kontrollerat).

#### Modellantaganden (confidence: assumption)
1. **digital_resilience_e17:** 5 % (spann 2–11 %) av Kalmars vuxna behöver fullvärdig analog kanal 2026, sjunkande till ~2 % 2050 men aldrig noll.
2. **tech_ai_e21:** Realiserad AI-effektivisering i kommunen 1,5 % (0,5–3 %) av verksamhetskostnaderna över 10–20 år = teoretiskt tak 5–6 % × realiseringsgrad 20–50 %.
3. I hävstångstexterna (effects_sv) finns dessutom mindre, uttryckligen markerade antaganden: −20–50 % av gruppen som avstår tjänster vid analog rätt; +1–3 % administrativ kostnad för analog kanal; +1–2 procentenheter/år hushåll med kontantbuffert vid kampanj; +5–10 procentenheter barn inom skärmtidsgränser per decennium; ~50 % negativ påverkan bland AI-exponerade jobb; −5 till −20 % insatsmedel med precisionsjordbruk.

---


## Tema 8–9: Beredskap & motståndskraft (`resilience`) och Biologisk mångfald & Östersjön (`biodiversity_baltic`)

### Bibliografi – Beredskap & motståndskraft

- Myndigheten för civilt försvar (2026). Hemberedskap. MCF. https://www.mcf.se/hemberedskap
- Kinda kommun / Myndigheten för civilt försvar (2026). Information om hemberedskap (baserad på broschyren Om krisen eller kriget kommer). mcf.se. https://www.mcf.se/contentassets/e6286bea71bb4d0f93d0df5aa280e2a9/hemberedskap---ao-allmant.pdf
- Regeringskansliet (2024). En broschyr för allvarstid – ny upplaga av Om krisen eller kriget kommer. Regeringen.se. https://regeringen.se/pressmeddelanden/2024/10/en-broschyr-for-allvarstid--ny-upplaga-av-om-krisen-eller-kriget-kommer/
- MSB/MCF (2025). MSB blir Myndigheten för civilt försvar och får ett heraldiskt vapen (pressmeddelande). https://mcf.mynewsdesk.com/pressreleases/msb-blir-myndigheten-foer-civilt-foersvar-och-faar-ett-heraldiskt-vapen-3400100.pdf
- Östhammars kommun (2024). Vanliga frågor om nödvatten (återger Livsmedelsverkets nödvattennivåer och Svenskt Vattens 140 l/person/dygn). https://www.osthammar.se/globalassets/dokument/planer/nodvattenplan/faq_nodvatten.pdf
- Livsmedelsverket (2017). Guide för planering av nödvattenförsörjning, utgåva 1. https://www.livsmedelsverket.se/globalassets/publikationsdatabas/handbocker-verktyg/guide_for_planering_av_nodvatten.pdf
- Regeringen, Justitiedepartementet (2020). Anvisningar för det civila försvaret för försvarsbeslutsperioden 2021–2025 (regeringsbeslut 2020-12-17). https://www.regeringen.se/contentassets/fd483edcff0d4f9cb2176309100e5eb5/anvisningar-for-det-civila-forsvaret-for-forsvarsbeslutsperioden-20212025.pdf
- Regeringskansliet (2025). Ett steg närmare beredskapslager för spannmål. https://regeringen.se/pressmeddelanden/2025/09/ett-steg-narmare-beredskapslager-for-spannmal/
- NATO (2024). Sweden officially joins NATO. https://www.nato.int/cps/en/natohq/news_223446.htm
- Euronews (2024). Undersea power cable linking Finland and Estonia suffers damage in latest Baltic Sea incident. https://www.euronews.com/my-europe/2024/12/26/undersea-power-cable-linking-finland-and-estonia-suffers-damage-in-latest-baltic-sea-incid
- Länsstyrelsen i Kalmar län (2026). Vattenläget i Kalmar län (uppdaterad 2026-09-24). https://www.lansstyrelsen.se/kalmar/miljo-och-vatten/vatten--och-avloppsforsorjning/vattenlaget-i-kalmar-lan.html
- SMHI (u.å.). 2016 – långsiktigt underskott och låga nivåer. SMHI Kunskapsbanken. https://www.smhi.se/kunskapsbanken/hydrologi/historiska-torrperioder/2016---langsiktigt-underskott-och-laga-nivaer
- Nilsson, V., Pile, T. (2026). Vatten i nöd och kris (presentation). Borgholm Energi / Hushållningssällskapet. https://hushallningssallskapet.se/wp-content/uploads/2026/02/foredrag-borgholm-energi.pdf
- Kalmar kommun & Kalmar Vatten AB (2016). Vatten och avlopp – Tematiskt tillägg till översiktsplanen (antagen 25 jan 2016). https://www.kalmar.se/download/18.406d0a5d186e2b4f943304/1678960845677/10.%20Vatten%20och%20avlopp.pdf
- Kalmar kommun / Kalmar Vatten AB (odaterad, publicerad 2026). Vattentjänstplan – samrådshandling. https://www.eurobalt.org/wp-content/uploads/2026/07/Kalmar_Water-recycling-strategy_Water-supply-plan_SE.pdf
- SVT Nyheter Småland (2017). Avsaltning ska säkra Borgholms vatten i sommar. https://www.svt.se/nyheter/lokalt/smaland/avsaltning-ska-sakra-borgholms-vatten-i-sommar
- SVT Nyheter Öst (2025). Trots vattenbrist – avsaltningsverket på Gotland går inte på full effekt. https://www.svt.se/nyheter/lokalt/ost/trots-vattenbrist-avsaltningsverket-pa-gotland-gar-inte-pa-full-effekt
- Schunke, A. J., Hernandez Herrera, G. A., Padhye, L., Berry, T.-A. (2020). Energy Recovery in SWRO Desalination: Current Status and New Possibilities. Frontiers in Sustainable Cities. https://doi.org/10.3389/frsc.2020.00009
- Kim, J., Park, K., Yang, D. R., Hong, S. (2019). A comprehensive review of energy consumption of seawater reverse osmosis desalination plants. Applied Energy 254:113652. https://doi.org/10.1016/j.apenergy.2019.113652
- Jones, E. m.fl. (2019). The state of desalination and brine production: A global outlook. Science of the Total Environment 657:1343–1356. https://collections.unu.edu/view/UNU:6695
- Sweco (Schmidt, J., Nordlöf, B.) (2022). Översvämningsutredning – Detaljplan för Dörby 5:11 m.fl. (för Kalmar kommun; data SMHI 2018, 2022). https://kalmar.se/download/18.45f6eaa218ad70e70093057/1695901551242/oversvamningsutredning-samrad-dorby.pdf
- Kalmar kommun (2023). Klimatanpassning (Översiktsplan, avsnitt 8 – ställningstaganden). https://kalmar.se/download/18.2409eec0185c384aa95330/1674130063363/8.%20Klimatanpassning%20(utan%20datum).pdf
- SVT Nyheter Småland (2018). Stigande vattennivåer drabbar Kalmar län hårt. https://www.svt.se/nyheter/lokalt/smaland/stigande-vattennivaer-drabbar-kalmar-lan-hart
- SMHI (2022). Introduktion till stigande havsnivåer (sammanfattar IPCC AR6). https://www.smhi.se/klimat/framtidens-klimat/stigande-havsnivaer/introduktion-till-stigande-havsnivaer
- Regeringen (2023). Kommittédirektiv: Kommuners och regioners grundläggande ansvar inför och under fredstida kriser och höjd beredskap. https://data.riksdagen.se/dokument/HBB151
- Länsstyrelsen Blekinge län (2025). Energiförsörjning i länet (Styrel). https://www.lansstyrelsen.se/blekinge/samhalle/sakerhet-och-beredskap/energiforsorjning-i-lanet.html

### Bibliografi – Biologisk mångfald & Östersjön

- Rockström, J., Steffen, W., Noone, K. m.fl. (2009). Planetary Boundaries: Exploring the Safe Operating Space for Humanity. Ecology and Society 14(2):32 (kortversion: A safe operating space for humanity, Nature 461:472–475). https://www.ecologyandsociety.org/vol14/iss2/art32/
- Richardson, K., Steffen, W., Lucht, W. m.fl. (2023). Earth beyond six of nine planetary boundaries. Science Advances 9(37). https://doi.org/10.1126/sciadv.adh2458
- Stockholm Resilience Centre (u.å.). Planetary boundaries. https://www.stockholmresilience.org/research/planetary-boundaries.html
- Potsdam Institute for Climate Impact Research (2025). Planetary Health Check 2025. https://www.planetaryhealthcheck.org/
- HELCOM (2021). Baltic Sea Action Plan – 2021 update. https://helcom.fi/wp-content/uploads/2021/10/Baltic-Sea-Action-Plan-2021-update.pdf
- Carstensen, J., Andersen, J. H., Gustafsson, B. G., Conley, D. J. (2014). Deoxygenation of the Baltic Sea during the last century. PNAS 111(15). https://doi.org/10.1073/pnas.1323156111
- Eklöf, J. S., Sundblad, G., Erlandsson, M., Donadi, S., Hansen, J. P., Eriksson, B. K., Bergström, U. (2020). A spatial regime shift from predator to prey dominance in a large coastal ecosystem. Communications Biology 3. https://doi.org/10.1038/s42003-020-01180-0
- FishSec (2019). EU Commission steps in to protect Baltic cod. https://fishsec.org/2019/08/14/eu-commission-steps-in-to-protect-baltic-cod
- SLU Artdatabanken (2026). Rödlistade arter i Sverige 2025 (SLU Artdatabanken rapporterar 37). Dataset: https://researchdata.se/en/catalogue/dataset/2026-63 ; rapport: https://pub.epsilon.slu.se/id/document/20463128
- Land, M., Granéli, W., Grimvall, A., Hoffmann, C. C., Mitsch, W. J., Tonderski, K. S., Verhoeven, J. T. A. (2016). How effective are created or restored freshwater wetlands for nitrogen and phosphorus removal? A systematic review. Environmental Evidence 5:9. https://doi.org/10.1186/s13750-016-0060-0
- Valkama, E., Lemola, R., Känkänen, H., Turtola, E. (2015). Meta-analysis of the effects of undersown catch crops on nitrogen leaching loss and grain yields in the Nordic countries. Agriculture, Ecosystems & Environment 203:93–101. https://doi.org/10.1016/j.agee.2015.01.023 (siffror från EGU 2016-abstract: https://meetingorganizer.copernicus.org/EGU2016/EGU2016-1934.pdf)
- Naturvårdsverket m.fl. (2025). Myllrande våtmarker – Sveriges miljömål. https://www.sverigesmiljomal.se/miljomalen/myllrande-vatmarker/
- Naturskyddsföreningen (2013). Det behövs mer vatten i landskapet. https://haabo.naturskyddsforeningen.se/wp-content/uploads/sites/58/2013/09/Det-behövs-mer-vatten-i-landskapet.pdf
- Europeiska kommissionen (2024). Nature Restoration Regulation (EU 2024/1991). https://environment.ec.europa.eu/topics/nature-and-biodiversity/nature-restoration-regulation_en
- Wikipedia (2025). Agricultural Landscape of Southern Öland. https://en.wikipedia.org/wiki/Agricultural_Landscape_of_Southern_%C3%96land
- Widman, A., Robertson, P., Gustafsson, R. (2026). Inte en enda droppe ska gå till spillo. Länsstyrelsen i Kalmar län. https://www.lansstyrelsen.se/kalmar/om-oss/nyheter-och-press/nyheter---kalmar/2026-07-08-inte-en-enda-droppe-ska-ga-till-spillo.html

### Osäkerheter / att dubbelkolla

**Sökbegränsning:** Sessionens gemensamma WebSearch-kvot tog slut två gånger under arbetet. Flera påståenden verifierades därför genom direkt hämtning av kända primärkällor (PDF:er hämtade och textextraherade lokalt, Crossref/Europe PMC för abstract) i stället för bredare sökningar. Några önskade delar kunde inte verifieras alls (se nedan).

#### Ej verifierat / utelämnat
- **Antal åtgärder i BSAP 2021:** *Löst vid sammanställningen.* HELCOM:s pressmeddelande och intervju (20 okt 2021) anger 'about 200 concrete actions' (biodiversity_baltic_e20). Talet 199 förekommer i sekundära sammanfattningar men har inte bekräftats i primärkälla, och en egen räkning av åtgärdskoder gav ~171 plus horisontella åtgärder. JSON anger därför 'ca 200'.
- **HOLAS 3 (2023) siffror för 2016–2021:** sidan gick inte att läsa; vi använder i stället BSAP 2021:s siffra (>96 % ej god status, bedömning 2011–2016). En nyare HOLAS 3-siffra bör ersätta denna.
- **SMHI:s årliga syreundersökning (km² syrefria bottnar):** ej hämtad (sökkvot slut). Använder i stället Carstensen m.fl. 2014 (tiodubbling av hypoxi). Det ofta citerade "från ca 5 000 till >60 000 km²" verifierades inte.
- **Andel hushåll med 7 dygns hemberedskap:** *Löst vid sammanställningen.* Livsmedelsverkets undersökning Hemberedskap 2025 (Origo Group, n = 8 108, oktober 2025) visar att 61 % har mat för minst en vecka men bara 36 % har dryck för en vecka (resilience_e23). Startvärdet i resilience_e22 är därför sänkt från 50 % till 35 % (intervall 25–50 %).
- **Trygghetspunkter:** begreppet används i levern men inga källor eller siffror om antal/kostnad har verifierats.
- **Desalination brackvatten (kWh/m³):** antagandet 1,5–2,5 kWh/m³ (resilience_e15) bygger på principen att energibehovet ökar med salthalten (Kim m.fl. 2019) men Östersjöns salthalt (vanligen angiven till ca 7 ‰ i Egentliga Östersjön) verifierades inte i denna session. Ersätt med uppmätt värde från Borgholm Energi/Region Gotland.
- **Livsmedelsverkets nödvattennivåer:** verifierade endast via kommunal återgivning (Östhammar, även Oskarshamn anger 3–5 l). Livsmedelsverkets guide 2017 innehåller inte siffrorna i textuttaget.
- **3 l/person/dygn:** från ett kommunanpassat material (Kinda kommun) publicerat på mcf.se; MCF:s huvudsida om hemberedskap anger "minst en vecka" men liter-siffran syntes inte i textuttaget.
- **Grain stockpile-lag 1 juli 2026:** sökträff antydde att nya lagar om beredskapslager föreslås träda i kraft 1 juli 2026 – ej verifierat, därför utelämnat.
- **Baltic Sentry (NATO, jan 2025):** endast verifierat via nyhetsbyråmaterial (AP-syndikering); shape.nato.int gav 403. Nämns i context men inte som huvudsiffra.
- **Våtmarksförlust 80–90 % i södra Sverige:** endast sekundära källor (miljöorganisationer, studentuppsatser) – confidence "low".
- **Stora Alvaret / världsarv:** UNESCO:s sida gav 403; uppgifter från Wikipedia (medium).
- **Torskfiskets stängning:** källan är FishSec (NGO) som återger EU-förordning 2019/1248; "−92 % fångstmöjligheter 2020" sågs bara i sökresultat och utelämnades.
- **Richardson m.fl. 2023 titel:** artikelsidan gav 403; titeln "Earth beyond six of nine planetary boundaries" och innehållet (6 av 9) bekräftades via Stockholm Resilience Centres sammanfattning, men titeln är återgiven ur minnet/sekundärt – dubbelkolla.
- **Kalmar-dokumentens årtal:** Översiktsplanens klimatanpassningsavsnitt är odaterat (filen laddades upp jan 2023; ÖP antogs juni 2023) – årtal satt till 2023. Vattentjänstplanen är en odaterad samrådshandling som publicerats via EuroBalt 2026 – årtal satt till 2026.
- **Kalmar VA-data (75 m³/person/år, 6 Mm³/år, reservkapacitet 3 400 m³/dygn):** från 2016 – bör uppdateras med Kalmar Vattens aktuella statistik.
- **Kalmars värsta scenario "1,1 m + 1,5 m temporärt":** citerat ordagrant ur ÖP men "1,5 m temporär höjning" ovanpå 1,1 m verkar högt jämfört med Swecos/SMHI:s 100-årshögvatten (ca 1,2 m över medelvattenytan). Tolka som kommunens försiktiga planeringsantagande.
- **Rekonstruktionsperiod för Carstensen (ca 1900–2012):** "senaste 115 åren" från abstract; exakta årtal ej kontrollerade.

#### Uttalade modellantaganden (confidence = "assumption")
1. resilience_e15 – Avsaltning av Kalmarsunds brackvatten 1,5–2,5 kWh/m³.
2. resilience_e22 – Startandel hushåll med 7 dygns beredskap (mat och vatten) är 35 % (25–50 %), kalibrerat mot resilience_e23. En kampanj ger +10–15 procentenheter per decennium.
3. biodiversity_baltic_e18 – Jordbruksvåtmark i Kalmar avskiljer 200 kg N och 5 kg P per ha och år (spann 50–930).
4. biodiversity_baltic_e19 – Fördröjning 20–40 år (30) innan minskad näringstillförsel syns i Kalmarsunds status.

#### Egna härledda tal (ej direkt i källan)
- Borgholm: ca 28 000 kr investering per m³/dygn kapacitet (85 Mkr / 3 000 m³/dygn).
- Kalmar: 75 m³/person/år ≈ 205 l/person/dygn; knappt 6 Mm³/år ≈ 16 400 m³/dygn; reservkapacitet ≈ 1/5 av normal produktion ≈ 45–50 l/person/dygn.
- Avsaltning 3 000 m³/dygn × 1,5–4 kWh/m³ ≈ 5–12 MWh/dygn.

---


## Tema 10–11: Långsiktig styrning & vision (`governance`), Demografi 2026–2126 (`demography`) och citat

Sammanställt 2026-10-08. Webbsökbudgeten för sessionen tog slut under arbetet; därefter verifierades källor genom direkt hämtning av kända URL:er (WebFetch/curl) och officiella data-API:er (SCB PxWeb, Eurostat, Crossref).

### Bibliografi – governance

- Future Generations Commissioner for Wales (2015). Well-being of Future Generations (Wales) Act 2015 – översiktssida. https://www.futuregenerations.wales/about-us/future-generations-act/
- legislation.gov.uk (2015). Well-being of Future Generations (Wales) Act 2015, section 5. https://www.legislation.gov.uk/anaw/2015/2/section/5
- legislation.gov.uk (2024). The Well-being of Future Generations (Wales) Act 2015 (Public Bodies) (Amendment) Regulations 2024 (SI 2024/775). https://www.legislation.gov.uk/wsi/2024/775/made
- Fisher, L. (2021). Societal change in Wales. ACCA AB Magazine. https://abmagazine.accaglobal.com/global/articles/2021/jun/public/societal-change-in-wales.html
- Future Generations Commissioner for Wales (2019). Future Generations Commissioner for Wales welcomes 'brave decision' by First Minister on the M4 Relief Road (pressmeddelande 5 juni 2019). https://oldsite.futuregenerations.wales/news/future-generations-commissioner-for-wales-welcomes-brave-decision-by-first-minister-on-the-m4-relief-road/
- Audit Wales / Auditor General for Wales (2025). No time to lose: Lessons from our work under the Well-being of Future Generations Act (nyhet 29 april 2025). https://audit.wales/news/ten-years-well-being-future-generations-act-has-increased-prominence-not-driving-system-wide
- Koskimaa, V. & Raunio, T. (2020). Encouraging a longer time horizon: the Committee for the Future in the Finnish Eduskunta. Journal of Legislative Studies. https://doi.org/10.1080/13572334.2020.1738670
- Aceituno O., P. (2025). Parliamentary Committees for the Future (blogg, 9 juli 2025). United Nations University – Centre for Policy Research. https://unu.edu/cpr/blog-post/parliamentary-committees-future-legislative-movement-overcome-political-myopia
- Haudenosaunee Confederacy (2021). Values. https://www.haudenosauneeconfederacy.com/values/
- O'Neill, D. W., Fanning, A. L., Lamb, W. F. & Steinberger, J. K. (2018). A good life for all within planetary boundaries. Nature Sustainability 1: 88–95. https://doi.org/10.1038/s41893-018-0021-4
- Fanning, A. L., O'Neill, D. W., Hickel, J. & Roux, N. (2022). The social shortfall and ecological overshoot of nations. Nature Sustainability 5: 26–36. https://doi.org/10.1038/s41893-021-00799-z
- DutchNews.nl (2020). Less waste, more recycling top Amsterdam's circular city plans. https://www.dutchnews.nl/2020/04/less-waste-more-recycling-top-amsterdams-circular-city-plans/
- Tomelilla kommun (2024). Doughnut economics. https://tomelilla.se/byggaboochmiljo/miljoochhallbarhet/hallbarutveckling/munkmodellen/doughnuteconomics.9218.html
- Sykes, A. (2025). 'It feels cool to be a cog in change': how doughnut economics is reshaping a Swedish town. The Guardian (återpublicerad av DEAL). https://doughnuteconomics.org/stories/it-feels-cool-to-be-a-cog-in-change
- RISE (2023–). The Doughnut Model in Municipal Sustainability Work (Kalix, Tomelilla, Vadstena). https://www.ri.se/en/what-we-do/projects/the-doughnut-model-in-municipal-sustainability-work
- Raworth, K. (u.å.). What on Earth is the Doughnut?… https://www.kateraworth.com/doughnut/
- Stockholm Resilience Centre (2016). The SDGs wedding cake. https://www.stockholmresilience.org/research/research-news/2016-06-14-the-sdgs-wedding-cake.html
- Akenji, L., Bengtsson, M., Lettenmeier, M., Toivio, V. m.fl. (2021). 1.5-Degree Lifestyles: Towards A Fair Consumption Space for All. Hot or Cool Institute. https://hotorcool.org/hc-projects/1-5-degree-lifestyles (även https://research.aalto.fi/en/publications/15degree-lifestyles-towards-a-fair-consumption-space-for-all/)
- Naturvårdsverket (2025). Konsumtionsbaserade växthusgasutsläpp per person och år. https://www.naturvardsverket.se/data-och-statistik/konsumtion/vaxthusgaser-konsumtionsbaserade-utslapp-per-person/
- Axelsson, K., Walke, P. R., Cheng Wei-Yu, A., Broekhoff, D., Shu, M. & André, K. (2026). Sveriges konsumtionsbaserade utsläpp i siffror – Förstå hushållens påverkan på klimatet med hjälp av Konsumtionskompassen. SEI brief. https://www.sei.org/wp-content/uploads/2026/05/konsumtionskompassen-siffror-sei2026-013.pdf
- Naturvårdsverket (2024). Sveriges klimatmål och klimatpolitiska ramverk. https://www.naturvardsverket.se/amnesomraden/klimatomstallningen/sveriges-klimatarbete/sveriges-klimatmal-och-klimatpolitiska-ramverk/
- Klimatpolitiska rådet (2026). Klimatpolitiska rådets rapport 2026: Klimatmålen kan fortfarande nås – men kraftfulla beslut brådskar (pressmeddelande 23 mars 2026). https://www.klimatpolitiskaradet.se/pressrummet/klimatpolitiska-radets-rapport-2026-klimatmalen-kan-fortfarande-nas-men-kraftfulla-beslut-bradskar/
- Viable Cities m.fl. (2023). Klimatkontrakt 2030 – Kalmar kommun. https://www.viablecities.se/wp-content/uploads/2024/01/Klimatkontrakt_Kalmar_2023.pdf
- Kalmar kommun (2023, uppd. 2025). Ett gott liv inom planetens gränser – är det ens möjligt? https://kalmar.se/kommun-och-politik/hallbarhet-och-manskliga-rattigheter/ett-gronare-kalmar/klimatneutrala-kalmar-2030/vad-kravs-for-att-kalmar-ska-bli-klimatneutralt/ett-gott-liv-inom-planetens-granser---ar-det-ens-mojligt.html
- Kalmar kommun (2023, uppd. 2025). Så räknar du koldioxidbudget. https://kalmar.se/kommun-och-politik/hallbarhet-och-manskliga-rattigheter/ett-gronare-kalmar/klimatneutrala-kalmar-2030/vad-kravs-for-att-kalmar-ska-bli-klimatneutralt/sa-raknar-du-koldioxidbudget.html
- Kalmar kommun (2024). Vision 2035 – Tillsammans gör vi ett Kalmar för alla ännu bättre och blir Sveriges bästa kommun att leva i. https://kalmar.se/kommun-och-politik/vision-2035---tillsammans-gor-vi-ett-kalmar-for-alla-annu-battre-och-blir-sveriges-basta-kommun-att-leva-i.html
- Kalmar kommun (2025). Kommunfullmäktiges beslut att anta översiktsplanen har fått laga kraft (nyhet 5 juni 2025). https://kalmar.se/arkiv/nyhetsarkiv/nyheter/2025-06-05-kommunfullmaktiges-beslut-att-anta-oversiktsplanen-har-fatt-laga-kraft.html
- Kalmar kommun (u.å.). Styrmodell för Kalmar kommun – Årshjul, planering och uppföljning. https://kalmar.se/kommun-och-politik/styrmodell-for-kalmar-kommun/arshjul-planering-och-uppfoljning.html
- Boverket (2024). Planeringsstrategi – en del av den kontinuerliga översiktsplaneringen. PBL Kunskapsbanken. https://www.boverket.se/sv/PBL-kunskapsbanken/oversiktsplan/planeringsstrategi/
- Statskontoret (2020). Agenda 2030 i myndigheter, kommuner och regioner. Slutrapport (2020:15). https://www.statskontoret.se/publicerat/publikationer/publikationer-2020/agenda-2030-i-myndigheter-kommuner-och-regioner.-slutrapport/
- Riksrevisionen (2025). Statens arbete med Agenda 2030 (RiR 2025:22); behandlad i finansutskottets betänkande. https://www.riksdagen.se/sv/dokument-och-lagar/dokument/betankande/riksrevisionens-rapport-om-statens-arbete-med_hd01fiu19/html/
- Hellström, M., Jonsson, R., Lundmark, L., Mattisson, O., Ramberg, U. & Kastberg Weichselberger, G. (2024). Kommunala kapaciteter och strategier för en hållbar kommunal framtid – fyra positioner med olika handlingsalternativ framåt. Kommuninvest forskningsrapport. https://kommuninvest.se/download/18.b9989d1194d84ba40a18d48/1740576025436/Kommunala-kapaciteter-och-strategier.pdf
- Framtidskommissionen (2013). Svenska framtidsutmaningar – Slutrapport från regeringens Framtidskommission (Ds 2013:19). Regeringskansliet. https://regeringen.se/contentassets/c709bf195f8a48278ec51d02cdbc82cf/framtidskommissionens-slutrapport-svenska-framtidsutmaningar
- Riksdagen (u.å.). Funktionen som framtidsminister (svar på skriftlig fråga). https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svar-pa-skriftlig-fraga/funktionen-som-framtidsminister_h21238/

### Bibliografi – demography

- SCB (2026). Sveriges framtida befolkning 2026–2070. Demografiska rapporter 2026:3 (publ. 2026-04-16). https://www.scb.se/hitta-statistik/statistik-efter-amne/befolkning-och-levnadsforhallanden/befolkningens-sammansattning-och-utveckling/befolkningsframskrivningar/produktrelaterat/rapporter/sveriges-framtida-befolkning-2026-2070/
- SCB (2026). Statistiknyhet: Sveriges framtida befolkning 2026–2070 – Antalet födda fortsätter att minska. https://www.scb.se/hitta-statistik/statistik-efter-amne/befolkning-och-levnadsforhallanden/befolkningens-sammansattning-och-utveckling/befolkningsframskrivningar/pong/statistiknyhet/sveriges-framtida-befolkning-2026-2070/
- SCB (2026). Statistikdatabasen BE0401A: BefPrognosOversiktN, BefolkprognRevNb (2026–2120) och BefProgRegFakN (regional, 2024–2070). https://api.scb.se/OV0104/v1/doris/sv/ssd/BE/BE0401/BE0401A/
- SCB (2025). Statistikdatabasen BE0101A: BefolkningNy (1968–2024). https://api.scb.se/OV0104/v1/doris/sv/ssd/BE/BE0101/BE0101A/BefolkningNy
- SCB (2026). Statistikdatabasen HE0111A: HushallT22 – hushåll efter hushållstyp (2012–2025). https://api.scb.se/OV0104/v1/doris/sv/ssd/HE/HE0111/HE0111A/HushallT22
- SCB (2026). Befolkningsstatistik första halvåret 2026 (folkmängd 30 juni 2026: 10 610 500). https://www.scb.se/hitta-statistik/statistik-efter-amne/befolkning-och-levnadsforhallanden/befolkningens-sammansattning-och-utveckling/befolkningsstatistik/pong/statistiknyhet/befolkningsstatistik-forsta-halvaret-2026/
- Eurostat (2023, data uppd. 2026). EUROPOP2023: proj_23np och proj_23ndbi. https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/proj_23np?geo=SE&sex=T&age=TOTAL&projection=BSL
- Eurostat (2026). Estimated average age of young persons leaving the parental household (yth_demo_030); Average household size (ilc_lvph01). https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/yth_demo_030?geo=SE&sex=T
- Hilbrand, S., Coall, D. A., Gerstorf, D. & Hertwig, R. (2017). Caregiving within and beyond the family is associated with lower mortality for the caregiver: A prospective study. Evolution and Human Behavior 38: 397–403. https://doi.org/10.1016/j.evolhumbehav.2016.11.010
- Holt-Lunstad, J., Smith, T. B. & Layton, J. B. (2010). Social Relationships and Mortality Risk: A Meta-analytic Review. PLoS Medicine 7(7): e1000316. https://doi.org/10.1371/journal.pmed.1000316
- World Health Organization (2007). Global age-friendly cities: a guide. https://www.who.int/publications/i/item/9789241547307

### Bibliografi – citat (utöver ovan)

- World Commission on Environment and Development (1987). Our Common Future, kap. 2 Towards Sustainable Development. http://www.un-documents.net/ocf-02.htm
- Rockström, J. m.fl. (2009). Planetary Boundaries: Exploring the Safe Operating Space for Humanity. Ecology and Society 14(2): 32. https://www.ecologyandsociety.org/vol14/iss2/art32/
- MSB (2024). Om krisen eller kriget kommer (publ.nr MSB2398, november 2024). https://rib.msb.se/filer/pdf/30828.pdf (länkad från https://www.mcf.se/sv/publikationer/om-krisen-eller-kriget-kommer/)

### Osäkerheter / att dubbelkolla

#### Governance
- **Antal offentliga organ i Wales**: 44 (ursprungligen, enligt ACCA och walesiska hälsoregioner); 8 tillkom 30 juni 2024. Totalsumman efter 2024 är inte verifierad (sannolikt ca 52, men ange inte utan kontroll).
- **M4-beslutet**: att ombudets påverkan var avgörande är en tolkning (ACCA-artikeln skriver "a major factor"). Det officiella beslutet motiverades främst med kostnad och miljöpåverkan.
- **Finlands framtidsutskott**: inrättandet 1993 är verifierat i Koskimaa & Raunio; "17 ledamöter" och "permanent 2000" kommer från sökresultat (Eduskunta, EPTA) och UNU-bloggen – Eduskuntas egen sida gav 404 vid direkt hämtning.
- **Sjunde generationen**: citat och princip från konfederationens webbplats. Många ord-för-ord-"citat" ur Great Law of Peace som sprids på nätet är osäkra; använd bara konfederationens egen formulering.
- **SDG-bröllopstårtan**: vilka globala mål som ligger i respektive lager framgår bara av illustrationen, inte av texten vi kunde läsa. Lagerindelningen har därför inte skrivits in som fakta.
- **Munkmodellens 12 + 9 dimensioner**: kateraworth.com och doughnuteconomics.org listar dem inte i text (bara i bilden). Dimensionslistan i huvudfilen bör bygga på Raworth (2017), eventuellt via Lancet Planetary Health 2017 (sidan gav 403).
- **Hot or Cool 1,5-gradersliv**: grå litteratur från tankesmedja. Målen 2,5/1,4/0,7 t är verifierade på projektsidan; det globala snittet 4,6 t kommer från ett sökresultat (issuelab/Hot or Cool). Sverige ingick inte bland rapportens fallstudieländer så vitt vi kunde se – dra inga Sverige-specifika slutsatser ur rapporten.
- **Naturvårdsverket 7,6 t**: sidan gav 404 vid direkt hämtning 2026-10-08 (troligen ombyggd webbplats); siffrorna (80 Mt, 7,6 t/person, 64 % utomlands, −27 % sedan 2008, riktlinje ≤1 t till 2050) verifierades via sökmotorns utdrag. SEI:s brief från maj 2026 hänvisar till Naturvårdsverket (2025) för offentlig konsumtion och investeringar, vilket stöder att statistiken finns.
- **Två siffror för konsumtionsutsläpp**: 7,6 t (Naturvårdsverket) jämfört med 8,3 t (SEI Konsumtionskompassen) – skillnaden beror på metod. Använd intervallet 7,6–8,3.
- **Klimatpolitiska rådet 2025**: uppgiften att utsläppen ökade 2024 (transporter +18 %) kommer från sökutdrag (SVT, GU), inte från originalrapporten. Bedömningen 2026 ("otillräcklig", "utrymmet … är uttömt") är verifierad i rådets pressmeddelande.
- **Kalmars 7,9 → 3,6 t/person**: kommunens egen uppgift utan angivet basår eller metod; troligen territoriella utsläpp.
- **Kalmars koldioxidbudget**: modell från Klimatsekretariatet/Uppsala universitet enligt kommunens sida; själva rapporten (pdf) har inte lästs.
- **Påståendet att kommuner saknar långsiktiga visioner** stöds bara delvis. Statskontoret 2020:15 och RiR 2025:22 handlar om Agenda 2030; Kommuninvest 2024 är kvalitativt (11 kommuner). Lagstadgade horisonter (budget 3 år, planeringsstrategi varje mandatperiod) och Kalmars egna dokument (vision 2035, ÖP-utblick 2050) visar korta horisonter men bevisar inte avsaknad av vision. Vi hittade ingen representativ enkät om kommunala visioners tidshorisont – det vore ett bra kompletterande underlag (t.ex. en egen genomgång av de 290 kommunernas visionsdokument). Formuleringen "vi har inte hittat någon svensk kommun med en formellt antagen hundraårsvision" bygger på en begränsad sökning.
- **Inga permanenta svenska framtidsinstitutioner**: vår slutsats från genomgången, inte en källa som säger det uttryckligen.
- Statskontorets enkätsvarsfrekvens (267 av 290 kommuner, 93 %) syntes i ett sökutdrag men kunde inte knytas säkert till rapporten 2020:15 – den används därför inte.

#### Demografi
- **SCB:s databas till 2120**: tabellerna BefPrognosOversiktN och BefolkprognRevNb sträcker sig till 2120. Själva rapporten redovisar bara till 2070. Värden efter 2070 är mekaniska förlängningar med oförändrade antaganden (SCB kallar framskrivningen en beräkning, inte en prognos). Därför har de konfidensen "medium".
- **Äldreförsörjningskvoter och andel 80+ efter 2070** är egna beräkningar från SCB:s ålderstabeller (hämtade 2026-10-08). Andelen 80+ år 2026 blir 6,8 % enligt framskrivningstabellen, medan observerat värde 2024 var 6,1 % och rapporten anger "drygt 6 %" för 2025. Den snabba ökningen beror på att 1940-talisterna fyller 80; kontrollera vid behov.
- **Kalmars regionala framskrivning**: tabellen BefProgRegFakN (2024–2070) är SCB:s regionala framskrivning från 2024. Den kan avvika från en eventuell egen kommunprognos från Kalmar kommun eller Region Kalmar län, som inte har kontrollerats.
- **"Övriga hushåll" som mått på flergenerationsboende**: SCB:s kategori omfattar fler hushållstyper än flergenerationshushåll (t.ex. kompisboenden och vuxna syskon). Siffran (5,6 % i Kalmar, 8,1 % i riket) är därför en övre gräns. SCB:s exakta definition har inte lästs i tabellens fotnot.
- **Eurostats ålder för att flytta hemifrån**: tidsseriebrott för Sverige 2021 (17,5 → 22,0). 2025 års värde (23,1) är högre än 2022–2024 (21,6–21,9) – möjligen brus eller ny metod.
- **UN WPP 2024** för Sverige 2100 hämtades inte (API kräver token, och sökbudgeten var slut). Eurostat EUROPOP2023 används i stället som internationell jämförelse.
- **Hilbrand m.fl. 2017**: bara titel och metadata verifierades (Crossref); effektstorleken (ofta återgiven som ca en tredjedel lägre dödlighet) kunde inte verifieras – den har därför inte tagits med.
- **WHO:s åtta domäner** för åldersvänliga städer verifierades inte i text.

#### Antaganden (explicita)
- demography_e18: Kalmar 2126 ≈ 96 000 invånare (84 000–110 000) och 13–14 % 80+; härlett från SCB:s regionala bana och rikets förlängning (+0,25 %/år 2070–2126).
- Spakarnas effektstorlekar: framtidsombudets effekt (villkorad på budgetkoppling), munkporträttets "+10–20 % genomförandegrad", +0,1–0,3 procentenheters extra befolkningstillväxt, 10–15 % flergenerationshushåll till 2060 och +0,05–0,1 barn per kvinna som övre gräns för lokal familjepolitik är alla modellantaganden utan direkt empiriskt stöd.
- Kostnaden för ett kommunalt framtidsombud (2–4 tjänster) är ett antagande.
- Sju generationer ≈ 150–200 år är en egen omräkning (25–30 år per generation).

#### Citat
- Alla engelska citat är kontrollerade ord för ord mot källsidan (WebFetch/curl) och har fått svenska översättningar, markerade "(översättning)" och med fältet "original". Raworths citat använder typografisk apostrof (Humanity’s) som på källsidan, och Cromptons har "people’s".
- un-documents.net hade ett utgånget TLS-certifikat vid kontrollen. Texten hämtades ändå och stämmer med den välkända Brundtland-definitionen; byt gärna till en FN-URL.
- MSB-citatet är svenskt original från broschyren (publ.nr MSB2398, nov 2024), rad för rad i pdf:en. Observera att formuleringen skiljer sig något från den som ofta citeras ("Om Sverige blir angripet av ett annat land…") – den verifierade lyder "Om Sverige blir angripet kommer vi aldrig att ge upp. Alla uppgifter om att motståndet ska upphöra är falska." MSB heter sedan 2026 Myndigheten för civilt försvar (MCF).
- Kalmar Vision 2035-citatet är svenskt original från kalmar.se.
- Inte medtaget: ett citat ur Karolinska institutets remissvar om digitalisering i skolan (2023) kunde inte verifieras ord för ord utan sökning. Inte heller något Ostrom-citat. Ett användbart svenskt alternativ som är verifierat: "Att ifrågasätta det befintliga, det vi upplever som självklart, är emellertid inte enkelt och kräver inte minst politiskt mod" (Natkom-forskarna Almqvist m.fl. 2017, citerade i Kommuninvests rapport 2024, s. 5; namnet stavas olika i källan).

---


## Kompletteringar och kontroller vid sammanställningen

Webbsökkvoten tog slut under arbetet. Delarna kontrollerades därefter genom direkt hämtning av källsidor, DOI-uppslag (Crossref, Europe PMC, Semantic Scholar) och myndigheternas statistik-API:er (SCB, Jordbruksverket, Eurostat). Vid sammanställningen fylldes de viktigaste luckorna med nya, kontrollerade källor. Dessutom stickprovskontrollerades några av de mest uppseendeväckande uppgifterna:

- **MSB-citatet** "Om Sverige blir angripet kommer vi aldrig att ge upp. Alla uppgifter om att motståndet ska upphöra är falska." är kontrollerat ordagrant mot broschyrens pdf (rib.msb.se/filer/pdf/30828.pdf).
- **EU:s AI-förordning och AI-omnibusen** är kontrollerade mot kommissionens sida: förslag 19 nov 2025, politisk överenskommelse 7 maj 2026, i kraft 27 juli 2026. Högriskkrav för bl.a. utbildning och kritisk infrastruktur gäller från 2 dec 2027, produktintegrerade system från 2 aug 2028.
- **Karolinska Institutets remissvar** (28 april 2023; Thorell, Klingberg, Herlitz, Olsson, Ådén) kräver inloggning på ki.se. Det är verifierat via sekundärkällor (AP/VOA, sökträffar på innehållet), och den svenska originalformuleringen är inte kontrollerad ordagrant.

### Nya källor (tillagda vid sammanställningen)

- Barbosa, G.L., Gadelha, F.D.A., Kublik, N., Proctor, A., Reichelm, L., Weissinger, E., Wohlleb, G.M., Halden, R.U. (2015). Comparison of Land, Water, and Energy Requirements of Lettuce Grown Using Hydroponic vs. Conventional Agricultural Methods. International Journal of Environmental Research and Public Health 12(6): 6879–6891. https://doi.org/10.3390/ijerph120606879
- Concello de Pontevedra; Dirección General de Tráfico (2022). La seguridad vial integrada en un enfoque global de la ciudad – Pontevedra. DGT. https://www.dgt.es/.galleries/downloads/conoce_la_dgt/que-hacemos/estrategias-y-planes/Experiencias-urbanas/pdf/84000-Pontevedra.pdf
- European Commission, DG MOVE (2020). Kruševac, Karditsa, Brussels and Pontevedra win European Sustainable Mobility Awards. https://transport.ec.europa.eu/news-events/news/krusevac-karditsa-brussels-and-pontevedra-win-european-sustainable-mobility-awards-2020-05-18_en
- European Commission (2026). Regulatory framework for AI (AI Act, AI Omnibus). https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai
- HELCOM (2021). HELCOM adopts the updated Baltic Sea Action Plan, charting a way forward for a healthy Baltic Sea. https://helcom.fi/helcom-adopts-the-updated-baltic-sea-action-plan-charting-a-way-forward-for-a-healthy-baltic-sea/
- HELCOM (2021). Interview with Rüdiger Strempel, Executive Secretary of HELCOM, on the updated Baltic Sea Action Plan. https://helcom.fi/interview-with-rudiger-strempel-executive-secretary-of-helcom-on-the-updated-baltic-sea-action-plan/
- Jordbruksverket (2024-06-12). Hur stor andel av svensk matkonsumtion skulle kunna täckas av livsmedel producerade i Sverige? (På tal om jordbruk och fiske). https://jordbruksverket.se/download/18.224634c81900509cce84f98/1718192143943/Pa-tal-om-jordbruk-och-fiske-juni-2024-tga.pdf
- Kotta, J., Raudsepp, U., Szava-Kovats, R., Aps, R., Armoškaitė, A., Bārda, I., Bergström, P., Futter, M. m.fl. (2022). Assessing the potential for sea-based macroalgae cultivation and its application for nutrient removal in the Baltic Sea. Science of The Total Environment 839: 156230. https://doi.org/10.1016/j.scitotenv.2022.156230
- Livsmedelsverket; Origo Group (2026). Hemberedskap 2025. Livsmedelsverket. https://www.livsmedelsverket.se/4904e7/globalassets/publikationsdatabas/rapporter/2026/2026---origo-hemberedskap-2025.pdf
- Melkersson, K. (Sweco) för Kalmar kommun (2023). Slutrapport: Förstudie för att öppna upp för produktion av blåmusslor till livsmedel i sydöstra Sverige. Kalmar kommun. https://www.kalmar.se/download/18.16ca774a18d2a76a60d6b7a/1706013650629/Slutrapport.pdf
- MSB (2024). Om krisen eller kriget kommer (MSB2398). https://rib.msb.se/filer/pdf/30828.pdf
- Orsini, F., Gasperi, D., Marchetti, L., Piovene, C., Draghetti, S., Ramazzotti, S., Bazzocchi, G., Gianquinto, G. (2014). Exploring the production capacity of rooftop gardens (RTGs) in urban agriculture: the potential impact on food and nutrition security, biodiversity and other ecosystem services in the city of Bologna. Food Security 6: 781–792. https://doi.org/10.1007/s12571-014-0389-6
- Pantanella, E., Cardarelli, M., Colla, G., Rea, E., Marcucci, A. (2012). Aquaponics vs. hydroponics: production and quality of lettuce crop. Acta Horticulturae 927: 887–893. https://doi.org/10.17660/ActaHortic.2012.927.109
- Raworth, K. (2017). Doughnut Economics: Seven Ways to Think Like a 21st-Century Economist. Random House Business. Dimensionslistan är kontrollerad mot https://en.wikipedia.org/wiki/Doughnut_(economic_model), syftet mot https://doughnuteconomics.org/about-doughnut-economics
- Sanyé-Mengual, E., Orsini, F., Oliver-Solà, J., Rieradevall, J., Montero, J.I., Gianquinto, G. (2015). Techniques and crops for efficient rooftop gardens in Bologna, Italy. Agronomy for Sustainable Development 35(4): 1477–1488. https://doi.org/10.1007/s13593-015-0331-0
- Stad Gent, Mobiliteitsbedrijf i.s.m. Transport & Mobility Leuven (2019). Evaluatie Circulatieplan Gent – Tweede periode april–november 2018. https://stad.gent/sites/default/files/onepager/cta/Evaluatierapport%20Circulatieplan%20Gent%202019%20finaal.pdf

## Övergripande osäkerheter för spelmodellen

1. **Tidshorisonten.** Officiella prognoser slutar 2070 (SCB-rapporten) respektive 2120 (SCB:s databas) och för klimat vid 2100–2120 (SMHI, IPCC). Allt efter det är scenarioantaganden. Spelet bör visa osäkerheten som växande band, inte som punktvärden.
2. **Överförbarhet.** Många effektstorlekar kommer från storstäder (Barcelona, London, Paris, Köpenhamn) eller andra klimat (Bologna, Sydney, Arizona). För Kalmar, med ca 73 000 invånare och betydligt kortare odlingssäsong än Medelhavsområdet, bör de skalas ned. Det är markerat i respektive `context_sv`.
3. **Observationsdata och orsakssamband.** Hälsoeffekter av natur, grönska, cykling och sociala relationer bygger mest på observationsstudier, så orsakssambandet är osäkert. Modellen bör använda de lägre skattningarna eller dämpa effekterna, vilket är gjort i antagandeposterna health_e17 och community_e26.
4. **Påståendet att svenska kommuner saknar långsiktiga visioner** har bara delvis stöd. Kalmar har en vision till 2035 och en översiktsplan med utblick mot 2050. Statskontoret och Kommuninvests forskningsrapport visar svag strategisk kapacitet och få genomgripande förändringar inom Agenda 2030-arbetet. Det finns ingen representativ kartläggning av hur långa visionshorisonterna i svenska kommuner är. Formulera därför påståendet som "visioner sträcker sig sällan längre än 10–25 år och saknar institutionellt skydd för framtida generationer", inte som "kommuner saknar visioner".
5. **Snabbt föränderliga regelverk (läget 2026-10-08):** mobilinsamling i skolan (i kraft 1 aug 2026), krav på kontantmottagning och offline-betalning (1 juli 2026), AI-förordningens omnibus (27 juli 2026), MSB → MCF (1 jan 2026) och regeringens avslag på havsvind i Östersjön (nov 2024). De bör kontrolleras igen före varje publicering.
6. **Donutens dimensioner.** I JSON används Raworths namn från 2017. De ekologiska dimensionerna har en annan namngivning än Richardson m.fl. 2023 och Planetary Health Check, se biodiversity_baltic_e2–e3.
