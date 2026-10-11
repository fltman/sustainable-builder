# Klimat och vatten – Rättvik 2126: metod, källor och berättelsematerial

Sammanställt 2026-10-11 för ämnet **klimat-vatten**: 41 poster i `klimat-vatten.json`, med engelska texter i `klimat-vatten.en.json`.

## Kort för modellen

| Behov | Värde | Post |
|---|---|---|
| Uppvärmning 2071–2100 jämfört med 1971–2000 (länet) | +1,8 / +3,0 / +4,9 °C (RCP2.6 / RCP4.5 / RCP8.5) | `temp_okning_2071_2100_*` |
| Högsommardygn i dag vid Siljan | 16,4 per år (Leksand 1991–2020) | `hogsommardygn_1991_2020_lokal` |
| Högsommardygn 2071–2100 vid Siljan | ca 25 (RCP4.5) och ca 39 (RCP8.5), uppskattning | `hogsommardygn_2071_2100_*_lokal` |
| Siljans 100-årsnivå i dag | ca +163,3 m RH 1900 ≈ +163,7 m RH 2000, uppskattning | `siljan_100arsniva_idag` |
| Nivå där gator börjar översvämmas | ca +164,0 m RH 2000 ≈ +163,6 m RH 1900, uppskattning | `lagsta_strandgata_niva` |
| 100-årsnivå 2071–2100 | ca +163,6 m RH 1900 ≈ +164,0 m RH 2000 (RCP8.5); +163,55 m (RCP4.5) | `siljan_100arsniva_2071_2100_rcp85` |
| Omräkning RH 1900 → RH 2000 vid Siljan | lägg till ca 0,4 m | `hojdskillnad_rh2000_rh1900` |

Viktigt om osäkerheten: MSB:s äldre klimatanpassade flöde för 2098 (490 m³/s vid Gråda) ger en *lägre* 100-årsnivå, ca +162,76 m RH 1900. SMHI:s nyare beräkningar (2015 och 2021) ger i stället något högre högflöden. För åren efter 2100 har ingen källa hittats. Modellen kan hålla nivån från 2071–2100 konstant fram till 2126, eller fortsätta trenden, men det är i så fall ett eget antagande.

## Metod

- **Klimatscenarier.** Värdena hämtades direkt ur JSON-filerna bakom SMHI:s Klimatscenariotjänsten (dataversion 1.0, 2021-11-17). Det är RCP2.6, RCP4.5 och RCP8.5, perioden 2071–2100 jämfört med 1971–2000, som länsmedel för Dalarnas län. Hydrologiska värden gäller SMHI:s delområde 123, *Siljan – Nedre Österdalälven*, som innehåller Rättvik. Fälten är `refGclim` (observationsbaserad referens), `refCordex` (modellernas referens), `absPeriodMean` och `change`. URL-mönster: `https://www.smhi.se/pd/klimatsystem/climate_scenario/met/<index>[Anom]/<rcp>/textdata/dalarnas_lan_<säsong>_<period>.json` och `.../hyd/<index>Anom_<regulated|unregulated>/<rcp>/textdata/123_ANN_<period>.json`. Nederbörden anges i mm/månad, och jag har räknat om ändringen till procent (ändring delad med modellreferensen).
- **Lokala högsommardygn.** Jag räknade dygn med maxtemperatur över 25,0 °C i SMHI:s öppna data för station Leksand (105450, vid Siljans utlopp) och Mora A (104580). Bara år med minst 330 observationer ingår. Den lokala framtiden har skalats additivt: Leksands medel 1971–2000 plus länets beräknade ändring.
- **Siljans vattennivå.** Siffrorna kommer från SMHI:s *Fakta om Siljan* och från SMHI:s dygnsserie för Byrviksbanken (station 1906, 1967–2026, RH 1900). Ur serien har jag räknat ut årshögsta nivåer och hur ofta dämningsgränsen +161,78 m överskreds.
- **100-årsnivå.** MSB:s 100-årsflöde vid Gråda kraftverk (612 m³/s i dagens klimat, karteringen 2013, rev. 2021) har lagts in i vattendomens avbördningstabell för Siljan (Länsstyrelsen Dalarna, Gråda–Siljan 2025, bilaga 1). Den ger +163,30 m. Kontroll mot SMHI:s data: högsta flödet efter regleringen, 572 m³/s, motsvarar enligt tabellen ca +163,13 m, och SMHI:s högsta nivå är 163,04 m. Tabellen och SMHI:s observationer stämmer alltså inom ungefär 0,1 m. Före regleringen gav 757 m³/s nivån 163,9 m, och tabellen ger 760 m³/s vid samma nivå. För framtiden har SMHI:s procentuella ändring av 50-årsflödet med nuvarande reglering lagts på 100-årsflödet: +9,9 % (RCP4.5) och +13,2 % (RCP8.5). Det är en förenkling.
- **Höjdsystem.** SMHI och vattendomen anger Siljannivåer i RH 1900, medan Lantmäteriets höjdmodell använder RH 2000. Lantmäteriets ruta 675_50 laserskannades 2020-11-06. I modellen ligger Siljans yta vid Rättvik på +162,18 m RH 2000, och SMHI:s dygnsvärde samma dag var 161,78 m RH 1900. Skillnaden är alltså ca +0,40 m. Osäkerheten är ca ±0,15 m: vattenytan i höjdmodellen är utjämnad, mätpunkten ligger 17 km bort och vinden påverkar nivån något.
- **Marknivåer och exponering.** Projektets egen `terrain.json` är Lantmäteriets markhöjdmodell (DTM) i 4 m-rutnät, ca 2,9 × 2,9 km kring centrum. Den har samplats längs gator, byggnader och campingens yta i projektets `osm.json` (OpenStreetMap). Byggnader räknas efter sitt lägsta hörn.
- **Isperioden.** Den är beräknad ur SMHI:s öppna isdata för Siljan Storsiljan SO Sollerön (station 70222): isläggning (parameter 5) och islossning (parameter 6). Vintern 2019/20 saknas i serien.
- **Övrigt.** Alla PDF:er lästes i minnet (pypdf). Mellanresultat och textextrakt lades i /private/tmp. Inga andra filer i projektet har ändrats.

## Källor som använts

**SMHI**
- Klimatscenariotjänsten: https://www.smhi.se/klimat/framtidens-klimat/klimatscenariotjansten (JSON enligt mönstren ovan, till exempel https://www.smhi.se/pd/klimatsystem/climate_scenario/met/su/rcp85/textdata/dalarnas_lan_ANN_2071_2100.json)
- Årsserie för högsommardygn i länet (observerat 1961–2018): https://www.smhi.se/pd/klimatsystem/climate_scenario/met/su/rcp45/graphs/su_rcp45_ANN_yr_1951_2100_dalarnas_lan.json
- Framtidsklimat i Dalarnas län – enligt RCP-scenarier (Klimatologi nr 16, 2015): https://www.smhi.se/download/18.18f5a56618fc9f08e832c51b/1717804158612/Klimatologi_16%20Framtidsklimat%20i%20Dalarnas%20l%C3%A4n%20-%20enligt%20RCP-scenarier.pdf
- Fakta om Siljan: https://www.smhi.se/kunskapsbanken/hydrologi/de-stora-sjoarna/fakta-om-siljan
- Vattenstånd Byrviksbanken: https://opendata-download-hydroobs.smhi.se/api/version/1.0/parameter/3/station/1906/period/corrected-archive/data.csv
- Isläggning och islossning, Storsiljan: https://opendata-download-hydroobs.smhi.se/api/version/1.0/parameter/5/station/70222/period/corrected-archive/data.csv och https://opendata-download-hydroobs.smhi.se/api/version/1.0/parameter/6/station/70222/period/corrected-archive/data.csv. Rättviken (1871–2011): https://opendata-download-hydroobs.smhi.se/api/version/1.0/parameter/6/station/70223/period/corrected-archive/data.csv
- Maxtemperatur Leksand: https://opendata-download-metobs.smhi.se/api/version/1.0/parameter/20/station/105450/period/corrected-archive/data.csv. Mora A: https://opendata-download-metobs.smhi.se/api/version/1.0/parameter/20/station/104580/period/corrected-archive/data.csv
- Vattenstånd i sjöar, december 2022 (tabell): https://www.smhi.se/download/18.18f5a56618fc9f08e8314234/1717763758170/vattenstand_tabell_2022_12.pdf
- 1985 – höstflöde med dammras i Noppikoski: https://www.smhi.se/kunskapsbanken/hydrologi/historiska-oversvamningar/1985---hostflode-i-dalarna-och-halsingland-med-dammras-i-noppikoski
- 2023 – översvämningar efter ovädret Hans: https://www.smhi.se/kunskapsbanken/hydrologi/historiska-oversvamningar/2023---oversvamningar-efter-ovadret-hans
- Mycket vatten i sviterna av regnet (2023-08-15): https://www.smhi.se/nyheter/nyheter/2023-08-15-mycket-vatten-i-sviterna-av-regnet
- November 2014 – mycket högt vattenstånd i Siljan och Storsjön: https://www.smhi.se/klimat/klimatet-da-och-nu/manadens-vader-och-vatten-i-sverige/manadens-vader-och-vatten-i-sverige/2014-12-05-november-2014---mycket-hogt-vattenstand-i-siljan-och-storsjon
- Is på sjöar vintern 2019–2020: https://www.smhi.se/klimat/klimatet-da-och-nu/arets-vatten/vattenaret/2020-11-04-is-pa-sjoar-vintern-2019-2020
- Skyfallsstatistik och klimatfaktorer: https://www.smhi.se/klimat/framtidens-klimat/skyfallsstatistik-regional-statistik-for-extrema-korttidsregn
- Yttrande om Gärdsjö vattentäkt (mål M 955-23): https://www.smhi.se/om-smhi/regeringsuppdrag-och-remissvar/remissvar/remisser/2023-04-28-yttrande-over-kungorelse---ansokan-om-tillstand-till-uttag-av-grundvatten-i-gardsjo-vattentakt-m.m.-for-dricksvattenforsorjning-i-rattvik-kommun

**Länsstyrelsen i Dalarnas län**
- Gråda–Siljan, nulägesbeskrivning för NAP (2025): https://www.lansstyrelsen.se/download/18.57c2d35a1969f8a67de2cc10/1746791796734/Gr%C3%A5da-Siljan.pdf
- Enån, nulägesbeskrivning för NAP (2025): https://www.lansstyrelsen.se/download/18.57c2d35a1969f8a67de2cb2a/1746791248818/En%C3%A5n.pdf
- Översvämning Dalarna augusti 2023 (rapport 2024:05): https://www.lansstyrelsen.se/download/18.8cd5a1b19362fb4fc22181/1732536813580/%C3%96versv%C3%A4mning%20Dalarna%20augusti%202023.pdf
- Riskvägledning översvämning, ras och skred (2017): https://www.lansstyrelsen.se/download/18.8cd5a1b19362fb4fc2234f/1732537072019/Riskv%C3%A4gledning%20%C3%B6versv%C3%A4mning,%20ras%20och%20skred.pdf
- Dalarna svämmar över – översvämningar 1916–2010 (2012:05): https://catalog.lansstyrelsen.se/store/26/resource/2012_05
- Regional vattenförsörjningsplan (2023): https://www.lansstyrelsen.se/download/18.8cd5a1b19362fb4fc221ab/1732536836913/Regional%20vattenf%C3%B6rs%C3%B6rjningsplan,%20Dalarnas%20l%C3%A4n.pdf
- Snö i framtida klimat, med bilaga (SMHI på uppdrag av länsstyrelserna): https://www.lansstyrelsen.se/download/18.8cd5a1b19362fb4fc22cce/1732538237202/Sn%C3%B6%20i%20framtida%20klimat.pdf (gav inga ortsvärden för Siljan)

**MSB (nu Myndigheten för civilt försvar)**
- Översvämningskartering utmed Dalälven (2013, rev. 2021): https://lastkaj.msb.se/Karteringar/oversvamning-vattendrag/dalalven-falun-malung-vansbro.pdf

**VISS och HaV**
- VISS Siljan WA71688194: https://viss.lansstyrelsen.se/Waters.aspx?waterMSCD=WA71688194 (PDF: `&generatePDF=true`)
- VISS Enån WA39945967: https://viss.lansstyrelsen.se/Waters.aspx?waterMSCD=WA39945967
- HaV badvatten, Siljansbadet: https://gw.havochvatten.se/external-public/bathing-waters/v2/bathing-waters/SE0622031000002963/results och https://gw.havochvatten.se/external-public/bathing-waters/v2/bathing-waters/SE0622031000002963/profiles. Alla badplatser: https://gw.havochvatten.se/external-public/bathing-waters/v2/bathing-waters

**Lantmäteriet och OpenStreetMap**
- Markhöjdmodell, STAC: https://api.lantmateriet.se/stac-hojd/v1/search?collections=dtm-cog&bbox=15.094,60.878,15.125,60.894
- Ursprung och mätdatum för ruta 675_50: https://dl1.lantmateriet.se/hojd/pub/grid/mhm/67_5/m675_50_ursprung.json
- OpenStreetMap-data i projektets `cities/rattvik/osm.json` (© OpenStreetMap contributors, ODbL)

**Kommuner och VA-huvudman**
- Rättvik, dricksvatten: https://www.rattvik.se/bygga-bo-och-miljo/vatten-och-avlopp/dricksvatten-och-vattenprov.html
- Rättvik, vatten och avlopp samt VA-plan: https://www.rattvik.se/bygga-bo-och-miljo/vatten-och-avlopp.html och https://www.rattvik.se/bygga-bo-och-miljo/vatten-och-avlopp/va-plan.html
- Rättvik, Översiktsplan 2030 del 2: https://www.rattvik.se/download/18.6e7a1da16b8abf1f9b851bf/1562077782379/Del2_Planeringsinriktningar.pdf
- Rättvik, planeringsstrategi med bilaga (Länsstyrelsens yttrande 2022): https://www.rattvik.se/download/18.1c49b2381900c49dbaab38a2/1719217050494/Bilaga%20till%20Planeringsstrategin%20-%20Underlag%20inf%C3%B6r%20planeringsstrategi%20R%C3%A4ttvik.pdf
- Rättvik, pågående detaljplanering: https://www.rattvik.se/bygga-bo-och-miljo/oversiktsplan-och-detaljplaner/pagaende-detaljplanering.html
- Rättvik, Vattentjänstplan (KF 2024-09-26 § 58) med skyfallsbedömning av VA-anläggningarna: https://ess-app.rattvik.se/api/download/82d29d1b-ecae-4896-ab1d-de1569234132/1d0db0b5-fac6-4563-8b79-e8f29152afb3. Länken hittades i grannämnets fil `kommun-plats-historia.json`.
- Dala Vatten och Avfall, vattenkvalitet i Rättviks kommun: https://www.dalavattenavfall.se/vatten--avlopp/dricksvatten/vattenkvalitet-rattviks-kommun.html. Hårdhet per vattenverk: https://www.dalavattenavfall.se/vatten--avlopp/dricksvatten.html. Bevattningsrestriktioner: https://www.dalavattenavfall.se/vatten--avlopp/vatten-vid-storningar-och-kris/bevattningsrestriktioner.html
- Rättvik Vatten och Avfall AB, årsredovisning 2025: https://www.dalavattenavfall.se/download/18.36a19ed41a0f0a477c8a120/1790855284044/%C3%85rsredovisning%20RVAB%202025.pdf
- Leksand, planbeskrivning Åkerö brofäste (lägsta grundläggningsnivå +165): https://leksand.se/download/18.58e0ed1f18bfae8ae2b2cca7/1701435149338/Planbeskrivning%20%C3%85ker%C3%B6%20brof%C3%A4ste.pdf. Plankarta Limsjöänget (+165 i RH 2000): https://www.leksand.se/download/18.58e0ed1f18bfae8ae2b2ccac/1701435280582/Plankarta%20Limsj%C3%B6%C3%A4nget.pdf

## Det här hittades inte

- **Officiell 100-årsnivå och BHF för Siljan i RH 2000.** Dalälvens Vattenregleringsföretags kartering (2012) och MSB:s (2013) finns bara som GIS-skikt i Länsstyrelsens RUM och i MSB:s översvämningsportal. Därför har nivån uppskattats via flöde och avbördningstabell.
- **Länsstyrelsens rekommenderade lägsta grundläggningsnivå vid Siljan i Rättvik.** Riskvägledningen (2017) anger bara vilken kartering som ska användas. Leksands +165 m används som jämförelse.
- **Rättviks dricksvattenproduktion.** Faktisk produktion i m³/dygn, kapacitetsmarginal ett torrt år, reservvattentäkt för tätorten, historiska bevattningsförbud och effekter av torkan 2018/2022 hittades inte. Webbsökningarna tog slut innan nyhetsarkiven (DT, Dalademokraten, SVT Dalarna) hann gås igenom. Det enda som finns om kapaciteten är vattentjänstplanens bedömning att befintliga uttagstillstånd räcker för de planerade utbyggnadsområdena. Länsstyrelsen skriver att reservkapaciteten i länet inte är heltäckande. Vattenanvändning per person och grundvattenstatus hämtas ur Kolada av ett annat verktyg.
- **Rättviks VA-översikt och VA-policy.** De är inte länkade på rattvik.se. Vattentjänstplanen (2024) hittades, och en ny version står i kommunens kö.
- **Skyfallskartering för hela Rättvik tätort.** Den finns inte. Vattentjänstplanen 2024 innehåller en kartering i Scalgo, men bara för VA-anläggningarna och utan ledningsnätet. Länsstyrelsens lågpunktskartering från 2015 är inte publicerad.
- **SSP-scenarier (CMIP6) per län.** SMHI:s tjänst bygger fortfarande på RCP.
- **Ortsvärden för dagar med snötäcke vid Rättvik.** Det finns bara läns- och delområdesvärden. SMHI 2015 ger till exempel ca 130 dagar → 40–80 dagar i Runns avrinningsområde.
- **Cyanobakteriehistorik före 2023.** Grundvattennivåer användes inte heller: SGU:s rör Rättvik_1–3 har bara data från 2020.
- **Islossning i själva Rättviken.** SMHI:s observationer där upphörde 2011.

## För berättelsen

**Platser**
- Rättviks kommunhus, Vasagatan 1. Dala Vatten och Avfall AB, Tallskogsvägen 1 i Leksand, driver VA åt det kommunägda Rättvik Vatten och Avfall AB.
- Siljansbadet sträcker sig 1,2 km utmed Rättviken, från Helsingland i söder till Kyrkudden i norr, med Långbryggan i mitten. Campingen norr om stranden drivs i privat regi. Enligt HaV är Orsa Grönklitt AB/Siljansbadet ansvarig verksamhetsutövare för badplatsen. Badet är EU-bad, med i snitt mer än 200 badande per dag.
- Gärdsjö vattenverk och Gärdsjöfältet ligger där en isälv för ca 9 400 år sedan forsade från Oresjön genom Ockrandalen. Rättviks vatten filtreras genom ett 80 meter djupt sandlager, och kommunen kallar det ”naturligt filtrerat mineralvatten utan kolsyra”.
- Enån meandrar genom Rättvik. Enåkvarn, en gammal kvarndamm 0,9 km från mynningen, håller uppe nivån genom samhället och har en fiskväg sedan 2008. Nedströms dammen ligger ån i nivå med Siljan, och där finns de lägsta husen och gatorna: Badhusgatan och Knihsgatan-området.
- Byrviksbanken vid Siljansnäs är SMHI:s mätpunkt för Siljan. Gråda kraftverk, 2 mil nedströms Leksand, reglerar sjön och kan dödnätsstarta och köra i ö-drift vid en kris.
- Lerdal (Slalomvägen, Östlunds väg), Gärdebyn, Söderås, Utby och Lilla industriområdet drabbades hårdast av skyfallet 2023.

**Historia**
- 1849 börjar SMHI:s isserie för Storsiljan.
- 1860 nådde Siljan sitt högsta kända vattenstånd, ca 165,0 m (RH 1900), mer än tre meter över dagens regleringsgräns.
- 1916 kom århundradets vårflod. Det kom rapporter om utrymda bostäder och förstörda broar i bland annat Rättvik.
- Regleringen började 1925–26 med Marielundsdammen. 1950–51 byggdes Gråda kraftverk, och sträckan Leksand–Gråda sprängdes och muddrades. Dagens vattendom är från 1964.
- 1955–1970 byggdes kraftverken i Österdalälven ut. Siljansöringen stängdes då ute från mer än 95 % av sina lekplatser. Ålen har helt försvunnit, och mellan ca 1930 och 1950 sattes 3–9 miljoner sikyngel ut i Siljan varje år.
- I september 1985 steg Siljan en meter på en vecka till 163,04 m, rekordet sedan regleringen. Dammen i Noppikoski brast. I Rättvik skadades en kyrkogård och ett sågverk, och Vinterå kraftverk i Enån förstördes helt.
- Höga vattenstånd följde i juni 1995 (162,73), november 2000 (162,90) och november 2014 (162,11). Sommaren 2018 hade Leksand 46 högsommardygn.
- 6–8 augusti 2023 kom ovädret Hans. Skyfallen skadade ca 150 villor, ca 2,5 mil väg förstördes och banvallen vid Tällberg spolades bort. Siljan steg till 162,62 m. Skadeståndskraven mot det kommunala VA-bolaget är fortfarande inte avgjorda, och bolaget har en avsättning på 2,8 mkr.

**Debatter och beslut framåt**
- **Prövning av Siljans reglering.** Gråda kraftverk och Siljans reglering ska få moderna miljövillkor enligt NAP. Prövningsgruppen är 53_9; VISS anger omprövning 2025, och den nya indelningen av vattenförekomster används från 2026. Prövningen kan ändra hur sjön fylls på våren, eftersom den sena uppfyllnaden kan påverka lek i Natura 2000-områdena Lindänget och Limsjön. Fiskvägar ställs mot vattenkraften, och Siljan ska nå god ekologisk status till 2033.
- **Planering i Rättvik.** En ny översiktsplan med fördjupning för Rättvik tätort och Vikarbyn står i kommunens kö, liksom en ny vattentjänstplan (nuvarande antogs 2024). Länsstyrelsen har rekommenderat kommunen att ta fram en skyfallskarta för hela samhället, och vattentjänstplanen kräver kommungemensamma mål och prioriterade åtgärder för skyfall. En detaljplan för Haga- och Börjes väg (gator, natur och dagvatten) är under arbete, liksom en komplettering av Lilla industriområdet, som översvämmades 2023.
- **Taxa och investeringar.** VA-taxan höjdes 2025: brukningsavgiften med 20 %. Bolaget investerade 82 mkr 2025, och dess långfristiga skulder växte från 195 mkr (2021) till 468 mkr (2025). Smarta vattenmätare ska vara installerade till 2029, och överföringsledningen Furudal–Kärvsåsen ska vara klar i december 2026.
- **Öppen fråga.** Blir Siljans framtida högvatten högre (SMHI 2015 och 2021) eller lägre (MSB 2013)? Ska Rättvik, som Leksand, kräva +165 m för ny bebyggelse vid sjön?

**Siffror som berättar**
- **Isen.** Siljan låg istäckt i 129 dagar per vinter 1871–1900 men i 74 dagar 2016–2026. Vintern 2024/25 låg isen bara i 35 dagar, och islossningen har flyttats från omkring 7 maj till 9 april.
- **2018.** Dalarna hade 32 högsommardygn, ungefär lika många som ett medelår 2071–2100 med höga utsläpp.
- **Regleringsgränsen.** Siljan har gått över sin regleringsgräns två år av tre sedan 1967.
- **Campingen.** Knappt hälften av Siljanbadets Camping ligger under den uppskattade 100-årsnivån. Torget och stationen ligger ca 2 m högre.
- **Leksands gräns.** Leksands lägsta grundläggningsnivå +165 m ligger ungefär i höjd med 1860 års rekordnivå (ca 165,0 m RH 1900, ca 165,4 m RH 2000).
- **Brunnar.** Nära 40 % av Rättviksborna har egen brunn, dubbelt så stor andel som i länet.
- **Ledningsnätet.** Det allmänna VA-nätet består av ca 60 mil ledningar, till stor del byggda 1955–1979. 3 731 anläggningar var anslutna i maj 2024. Dricksvattnet kommer från sex vattentäkter, och fem reningsverk tar emot avloppet. Dagvattnet renas inte. Vattentjänstplanen prioriterar utbyggnad av VA i Stumsnäs västra och östra by.
- **Vatten till backen.** Slalombacken får ta upp till 4 500 m³ vatten per dygn ur Enån för snötillverkning, lika mycket som dricksvattentillståndet för hela Gärdsjö vattentäkt.
- **Badvattnet.** Siljan är näringsfattig: ingen algblomning i 26 badprov 2023–2026, och badvattnet höll 12–22 °C.

**Att tänka på**
- SMHI:s faktasida om Siljan nämner Siljan som dricksvattentäkt för Tällberg. Tällberg ligger i Leksands kommun.
- Alla Siljannivåer från SMHI anges i RH 1900. Marknivåer från Lantmäteriet och detaljplaner anges i RH 2000.
