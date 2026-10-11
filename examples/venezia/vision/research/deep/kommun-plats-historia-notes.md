# Venezia 2126 – kommunen, platserna och historien

Forskningsanteckningar för ämnet **kommun-plats-historia**, sammanställda 2026-10-11. Siffrorna finns som 55 poster i
`kommun-plats-historia.json` (engelska i `kommun-plats-historia.en.json`); alla id börjar med `com_` så att inget annat ämne
i mappen kan ersätta dem vid sammanslagningen. Allt nedan bygger på källor som jag har läst; egna beräkningar och egna
slutsatser är markerade.

## Kort för modellen

| Behov | Värde | Post |
|---|---|---|
| Invånare i den historiska staden (centro storico) | 47 625 (31 dec 2025); 174 808 år 1951; 163 559 år 1931 | `com_folkmangd_centro_storico`, `…_1951`, `…_1931` |
| Index centro storico (1951 = 100) | 27,2 – drygt en fjärdedel kvar | `com_centro_storico_index` |
| Hela kommunen / lagunöarna / fastlandet | 251 294 / 25 538 / 178 131 (2025); toppen 367 832 år 1968 | `com_folkmangd_kommun`, `com_folkmangd_estuario`, `com_folkmangd_terraferma` |
| Vem styr | Simone Venturini (centerhöger), vald i första omgången 24–25 maj 2026 med 51,02 %; majoriteten har 22 av 36 mandat | `com_borgmastarval_venturini`, `com_kf_mandat_majoritet` |
| Valdeltagande | 55,90 % (2026), 62,2 % (2020, egen beräkning); centro storico 53,97 % | `com_valdeltagande_2026`, `com_valdeltagande_2020` |
| Den historiska staden röstade annorlunda | Martella 51,40 % mot Venturini 34,83 % i centro storico | `com_centro_storico_martella` |
| Kommunens klimatmål | −72 % CO₂ till 2030 (PAESC 2026; åtagande −55 % sedan 2021), klimatneutral 2050; 46 anpassningsåtgärder | `com_paesc_minskning_2030`, `com_klimatneutral_ar` |
| Båtarna på Canal Grande | alla med hybridmotor senast 2032 (mål) | `com_canal_grande_hybridbatar_2032` |
| MOSE | reses vid prognos > 110 cm; 20 stängningar säsongen 2020/21 → 49 säsongen 2025/26 (13 under kalenderåret 2020); med +50 cm hav i snitt en gång om dagen (modell) | `com_mose_grans`, `com_mose_stangningar_*` |
| Översvämmad andel av staden | 12 % vid 110 cm, 59 % vid 140 cm, nästan 90 % den 4 nov 1966 (194 cm) | `com_oversvamning_110cm`, `com_oversvamning_140cm`, `com_acqua_granda_1966` |
| Lokala skydd | 100 km kajer höjda; 16 km² saltängar återskapade | `com_kajer_hojda`, `com_barene_aterskapade` |
| Inträdesavgift för dagsbesökare | 2024: 29 dagar, 485 062 betalningar; 2025: 54 dagar, 723 497 betalningar, 5,42 M€; 2026: 60 dagar, 5/10 € | `com_cda_*` |
| Korttidsuthyrning | gräns 120 dagar/år utan särskilda krav (försök till 31 dec 2026) | `com_korttidsuthyrning_grans` |
| Kryssningsfartyg | förbud över 25 000 GT i San Marco-bassängen och Giudeccakanalen sedan 1 aug 2021 | `com_kryssningsfartyg_grans` |
| Platser i modellen | 22 platser + 5 vaporettohållplatser, JSON-blocken `places` och `stops` nedan | – |

Viktigt om säkerheten: valresultatet för hela kommunen är Inrikesministeriets slutliga öppna data (Eligendo); siffrorna per
zon (centro storico) är kommunens preliminära ("ufficiosi") resultat. Det nya styrets program (Linee programmatiche
2026–2031) är ännu inte antaget – fullmäktige röstar 15 oktober 2026 – och jag har inte kunnat läsa själva texten.

## Metod

- **Kommunens webbplatser** (`www.comune.venezia.it`, `live.comune.venezia.it`, `elezioni.comune.venezia.it`) svarar med
  en Incapsula-spärr på automatiska anrop. Sidor och filer har därför lästs i Internet Archives kopior (Wayback Machine)
  med angiven ögonblicksbild, men posterna anger den ursprungliga kommunala adressen. Använda kopior: befolkningsserien
  `A01_T01_ST_Pop_zone_1871_2025.ods` (2026-08-05), sidan *Popolazione residente* (2026-10-01), valsidorna (2026-07-10/11),
  PAESC-nyheten (2026-01-20), turistavgiften 2025 (2026-09-16) och 2026 (2026-08-09), Venturinis tal 16 juni (2026-06-19)
  och Panorama-samtalet 9 juli (2026-07-09), civilskyddets tidvattensida (2025-06-18) och förslaget till regler för
  korttidsuthyrning (2025-01-17). Kalkylbladet (ODS) lästes med ett eget litet skript; inga pdf:er sparades.
- **Fullmäktiges egen webbplats** (`consiglio.comune.venezia.it`, `consiglio2020.comune.venezia.it`) och kommunens
  dokumentarkiv (`dam.comune.venezia.it`, PAESC-presentationen) gick att läsa direkt.
- **Valet**: Inrikesministeriets öppna data (Eligendo-arkivet, `comunali-20260524.zip` daterad 7 sep 2026, och
  `comunali-20200920.zip`) lästes rad för rad för Venezia; mandat och "C"-markering (vald som borgmästarkandidat) kommer
  därifrån. Kommunens valsida gav procentsatser, blanka/ogiltiga röster och resultat per zon.
- **Pdf:er** (PAESC-presentationen, storstadsregionens DUP 2026–2028, PAGES-presentationen, ISPRA/CPSM/CNR:s rapport om
  november 2019, kammarens dossier om DL 103/2021, utskottsprotokoll) lästes i minnet med pypdf och sparades aldrig.
  Mellanresultat låg under `/private/tmp`.
- **Platser**: projektets egen OSM-fil (`cities/venezia/osm.json`, hämtad 2026-10-11) söktes efter namn och taggar; varje
  plats kontrollerades sedan mot Nominatim med två uppslag på OSM-id (`/lookup`, totalt 41 id) och tre namnsökningar
  begränsade till modellens ruta, med en User-Agent som bara namnger projektet och minst en sekund mellan frågorna.
  Koordinaterna är Nominatims mittpunkt för objektet, avrundad till sex decimaler. Rialtobrons relation (2289364) finns
  inte i Nominatims index; där anges medelpunkten av relationens delar i projektets OSM-fil.
- **Wikipedia** (italienska och engelska, hämtad som wikitext) användes för fakta om byggnader, högtider och vissa
  årtal, och alltid med angiven artikel. Primärkällor gick först: kommunen, fullmäktige, Città metropolitana, Regione
  del Veneto, Autorità per la Laguna di Venezia, ISPRA, CNR, kammaren och Eligendo.
- Sessionens gemensamma kvot för webbsökningar tog slut halvvägs. Därefter hämtades bara sidor vars adresser jag redan
  kände till; några planerade kontroller blev därför ogjorda (se *Luckor*).

---

## 1. Kommunen – struktur och befolkning

**Comune di Venezia** är 415,9 km², varav 257,73 km² inre vatten, alltså lagunen (kommunens uppgift *Superfici
amministrative* enligt [Wikipedia](https://it.wikipedia.org/wiki/Venezia)). Kommunens statistik och valadministration delar
in den i tre zoner: **centro storico** (den historiska staden), **estuario** (lagunöarna: Lido, Pellestrina, Murano, Burano
m.fl.) och **terraferma** (fastlandet med Mestre och Marghera). Politiskt finns sex **municipalità** med egna valda råd och
ordförande: Venezia-Murano-Burano, Lido-Pellestrina, Favaro Veneto, Mestre-Carpenedo, Chirignago-Zelarino och Marghera
([kommunens valsida](https://elezioni.comune.venezia.it/)); de ersatte 2005 tretton tidigare kvarter (fullmäktigebeslut
37/2005, [Wikipedia](https://it.wikipedia.org/wiki/Municipalit%C3%A0_di_Venezia)). Den historiska staden består av sex
**sestieri** – Cannaregio, Castello, Dorsoduro (med Giudecca), San Marco (med ön San Giorgio Maggiore), San Polo och Santa
Croce ([Wikipedia](https://it.wikipedia.org/wiki/Sestiere_(Venezia))) – och är enligt hållbarhetsstiftelsen VSF bara
omkring 5 km² ([VSF](https://vsf.foundation/fondazione/)). Hela 3D-modellen ligger i municipalità Venezia-Murano-Burano, i
sestieri San Marco, Castello, Cannaregio, San Polo, Santa Croce och Dorsoduro.

Kommunen ingår i **Città metropolitana di Venezia**: 44 kommuner, "oltre 833.000 abitanti", 2 473 km² och 346 invånare per
km² ([DUP 2026–2028](https://www.cittametropolitana.ve.it/sites/default/files/unita/AllegatiDUP26-28/D.U.P.%202026%20-%202028.pdf),
s. 80). Venedigs borgmästare är enligt lag 56/2014 ("legge Delrio") också storstadsregionens borgmästare.

### Befolkningen 1871–2025

Kommunens egen serie ([A01_T01, Ufficio Statistica](https://www.comune.venezia.it/sites/comune.venezia.it/files/page/files/A01_T01_ST_Pop_zone_1871_2025.ods);
1871–1936 folkräkningar, därefter folkbokföringen 31 december; från 1999 utan Cavallino-Treporti):

| År | Centro storico | Estuario | Terraferma | Hela kommunen |
|---|---|---|---|---|
| 1921 | 159 262 | 26 769 | 37 419 | 223 450 |
| 1931 | 163 559 | 32 826 | 53 937 | 250 322 |
| 1951 | **174 808** | 44 037 | 96 966 | 315 811 |
| 1961 | 137 150 | 49 702 | 161 035 | 347 887 |
| 1966 | 121 309 | 51 125 | 193 314 | 365 748 |
| 1968 | 116 270 | 51 117 | 200 445 | **367 832** |
| 1975 | 104 206 | 49 670 | **210 674** | 364 550 |
| 1981 | 93 598 | 49 203 | 206 707 | 349 508 |
| 1991 | 76 644 | 47 057 | 190 136 | 313 837 |
| 2001 | 65 695 | 32 183 | 176 290 | 274 168 |
| 2011 | 58 991 | 29 693 | 181 905 | 270 589 |
| 2021 | 50 434 | 26 795 | 177 621 | 254 850 |
| 2022 | 49 665 | 26 530 | 176 979 | 253 174 |
| 2024 | 48 489 | 25 947 | 177 365 | 251 801 |
| 2025 | **47 625** | 25 538 | 178 131 | **251 294** |

Det som serien berättar (egna beräkningar ur tabellen):
- Den historiska staden förlorade **66 382 invånare på tjugo år** (1951–1971: 174 808 → 108 426), samtidigt som fastlandet
  växte med 108 863 (96 966 → 205 829). Utflyttningen från centrum till Mestre och Marghera är 1900-talets stora
  familjehistoria.
- Fastlandet nådde sin topp 1975, minskade till omkring 176 000 runt år 2000 och har sedan legat på 175 000–182 000;
  de senaste två åren växer det svagt.
- Centrum föll under 50 000 vid årsskiftet 2022 och fortsätter minska med 500–900 per år (−864 under 2025).
- Kommunens index (1951 = 100) är 27,2 för centrum, 58,0 för lagunöarna och 183,7 för fastlandet.

Kommunen redovisar 251 294 invånare per 31 december 2025 ([Popolazione residente](https://www.comune.venezia.it/it/content/serie-storiche),
uppdaterad 6 mars 2026). En egen befolkningsprognos för centro storico har jag inte hittat (se *Luckor*).

---

## 2. Stadens vision och mål

### Det nya styret: "Casa, mobilità e lavoro"

Simone Venturini (född 1987, enligt valmyndighetens data) kom in i fullmäktige 2010 som 22-årig gruppledare och var sedan
assessore i Luigi Brugnaros styre, som satt i elva år (2015–2026). I sitt första tal som borgmästare 16 juni 2026
([kommunen](https://live.comune.venezia.it/it/2026/06/venturini-al-primo-consiglio-comunale-da-sindaco-servire-venezia-e-lonore-piu-grande-il))
sade han att valprogrammet är kompassen och att ordning i ekonomin är "en pelare" ("Il più grande atto di responsabilità
verso le nuove generazioni è lasciare un Comune più solido, meno indebitato"). Han tar själv hand om **hamnens framtid**,
vill "ripensare le aree che oggi non hanno più una vocazione portuale o industriale", och nämner kanalernas
farbarhet och nya produktiva investeringar för att stärka medelklassen i både den vattenburna staden och på fastlandet.

Den 9 juli 2026 ([kommunen, "Panorama on the Road"](https://live.comune.venezia.it/it/2026/07/panorama-road-venezia-venturini-casa-mobilita-e-lavoro-rafforzare-il-ceto-medio-e-attrarre))
sammanfattade han sin vision som **tre pelare: bostad, mobilitet och arbete**:
- Venedig ska åter locka kvalificerade jobb; det före detta sjukhuset Ospedale al Mare på Lido ska bli ett tekniskt och
  biomedicinskt forskningscentrum med "hundratals" specialister.
- Planen att rusta upp **tomma kommunala lägenheter** och ge dem framför allt till **unga par** genom social housing ska fortsätta.
- Bättre förbindelser mellan den vattenburna staden, Mestre, Marghera och omlandet; en ny station i Mestre.
- "Svarta hål" ska få nytt liv: Des Bains på Lido, de gamla gasklockorna (ex Gasometri), ex Italgas och Sant'Elena.
- En internationell rådgivande grupp för Venedigs framtid ska bildas under hösten 2026.
- En strukturell, stabil finansiering av **speciallagen för Venedig** (kajer, kanaler, palats och brandvattennät kostar mer här).
- Kritik mot avregleringarna ("lenzuolate di Bersani") som gjort centrum till "grandi take away a cielo aperto";
  kommunen har redan ett reglemente mot lågkvalitativ handel.
- Utgångsläget: "un Comune sano e … una Città metropolitana a debito zero".

**Linee programmatiche di mandato 2026–2031 och DUP 2027–2029** (proposition PD 2026.1074) har godkänts av giuntan och
behandlades av fullmäktiges samlade utskott 6 oktober 2026, som numrerar områdena till och med "Area 11"
([kallelse](https://consiglio.comune.venezia.it/atti-assemblee/1/atto/57); utskottets
[sammanfattning](https://consiglio.comune.venezia.it/pdf/atti_assemblee/resoconti_1/resoconto_sintetico_57.pdf) säger bara
att behandlingen fortsätter). Enligt [Notizie Plus](https://notizieplus.it/linee-di-mandato-venezia-2026-2031-via-libera-della-giunta-ecco-gli-undici-obiettivi/)
är de elva områdena: ekonomisk utveckling, konkurrenskraft och arbete; säkerhet; bostäder; territorium och
stadsplanering; socialt; idrott; mobilitet och transporter; turism; kultur; miljö; kommunens organisation. Fullmäktige är
kallat att rösta **torsdag 15 oktober 2026** i Ca' Collalto, Mestre ([kallelse](https://consiglio.comune.venezia.it/atti-assemblee/2/atto/70)).
Texten i sig har jag inte hittat.

### Klimat: PAESC (januari 2026)

Giuntan antog kommunens **Piano d'Azione per l'Energia Sostenibile e il Clima** veckan före 19 januari 2026
([nyhet](https://live.comune.venezia.it/it/2026/01/energia-clima-e-mobilita-presentato-il-paesc-piano-di-azione-lenergia-sostenibile-e-il);
[presentation](https://dam.comune.venezia.it/api/resource/f7c1e9bb-4880-4974-b551-385bab4ca132)):
- Vägen dit: borgmästaravtalet undertecknat 2011; PAES med −20 % till 2020 (kommunen anger att målet är nått);
  anslutning till borgmästaravtalet för klimat och energi 2020 (fullmäktigebeslut 29/2020); sedan 2021 åtagandet
  **−55 % CO₂ till 2030 och klimatneutralitet 2050**.
- **33 åtgärder för utsläppsminskning** som ska ge **−72 % till 2030** jämfört med basinventeringen (miniminivå i
  borgmästaravtalet −40 %; C40:s "Deadline 2020"-bana −68,9 %). Exempel med beräknad effekt: fler träd och grönytor
  (−40 000 t CO₂), cykelvägar (−35 592 t), byte från bil till kollektivtrafik (−4 500 t), bilpool (−3 700 t),
  energieffektivisering av kommunens byggnader (−1 764 t), solceller (−568 t), en vätgasdal i Porto Marghera.
- **46 anpassningsåtgärder** utifrån en riskanalys med tolv faror (värmeböljor, köldvågor, bränder, torka, havets kemi,
  åska, vindar, **tidvatten och havsnivåhöjning**, skyfall, översvämningar från vattendrag, stormfloder, kusterosion).
- Kommunen lyfter fram 41 000 nya träd, 100 000 träd i Bosco dello Sport (2026), omkring 200 km cykelväg, 90 nya
  vätgasdrivna fordon till juni 2026 och målet att **alla båtar på Canal Grande ska ha hybridmotorer senast 2032**.
  PM10-utsläppen har enligt kommunen minskat 90 % 2017–2025 (presentationens diagram gäller ACTV:s fordon).
- PAESC hänvisar till FN:s mål, UNESCO:s världsarvscentrums rekommendationer och C40-nätverket.

### Fondazione Venezia Capitale Mondiale della Sostenibilità (VSF)

Uppdraget nämner 2021 som startår. Enligt stiftelsen själv bildades den **14 mars 2022** under regeringens beskydd
([Chi siamo](https://vsf.foundation/fondazione/chi-siamo/)); något beslut eller initiativ från 2021 har jag inte kunnat
belägga med en källa. Fakta från stiftelsens webbplats:
- **Syfte**: ett "nuovo modello integrato (ambientale, economico, sociale) di sviluppo sostenibile territoriale" som kan
  bli förebild för andra städer, och att samordna parter som annars inte skulle samarbeta.
- **Parter**: grundare är Regione Veneto, kommunen, Ca' Foscari, IUAV, Konstakademien, konservatoriet Benedetto Marcello,
  Fondazione Giorgio Cini, Confindustria Veneto, Snam, Eni, Enel, Generali och BCG (de som sitter i styrelsen utan
  asterisk på [Governance](https://vsf.foundation/fondazione/governance/)); medgrundare och deltagare är bl.a.
  Fondazione di Venezia, handelskammaren, Enfinity, TIM, Edison, hamnmyndigheten, Ferrovie dello Stato, Microsoft, Poste
  Italiane, Compagnia di San Paolo, Umana och Venice International University ([Attività](https://vsf.foundation/attivita/)),
  och på sidan [Soci](https://vsf.foundation/soci/) finns även logotyper för bl.a. Fincantieri, CDP och UniCredit.
- **Ledning**: ordförande Renato Brunetta (utsedd av premiärministern, även ordförande för CNEL); vice ordförande
  regionpresidenten **Alberto Stefani** och borgmästaren **Simone Venturini**; generaldirektör Alessandro Costa (Snam)
  ([Governance](https://vsf.foundation/fondazione/governance/)).
- **Nio områden** ([Attività](https://vsf.foundation/attivita/)): 1 vätgas (H2 Valley i Porto Marghera), 2 energiomställning
  och miljö (inklusive skydd av lagunens ekosystem), 3 Venezia città campus, 4 **residenzialità** – "contrastandone il
  progressivo spopolamento" och "proteggere l'offerta residenziale dagli effetti della domanda turistica sugli affitti (di
  breve durata)" (kommunen samordnar), 5 hållbar turism och styrning av besöksflöden, 6 innovation, 7 social inkludering,
  8 laglighet och ordning i centrum, 9 innovativ kulturproduktion.
- **Vad den gjort** ([Progetti](https://vsf.foundation/attivita/progetti/)): en kartläggning av kompetens och efterfrågan på
  vätgas i Veneto (2023), Start Venice UP, en rapport om rymdindustrin, protokoll för hållbara obligationer, en
  enkätbaserad rapport "Scenario di sostenibilità urbana integrata per Venezia e il suo territorio" (Quaderno 2, juli 2025)
  och Biennale della Sostenibilità 2023 och 2025. Den arbetar genom att "accompagnare e promuovere" partnernas egna
  projekt; jag hittade inga egna mätbara mål.
- Stiftelsens bild av utmaningarna: miljömässig sårbarhet, bevarandet av kulturarvet, hantverkets nedgång, **"declino
  residenziale del centro storico ed eccessiva pressione turistica"** och **industri- och jobbkrisen i Marghera**.
  Tillgångarna: ett "laboratorio vivente" i liten skala, global synlighet, unik skönhet och skörhet, och en plattform för
  forskning med "circa 28.000 studenti" ([Fondazione](https://vsf.foundation/fondazione/)).

### Città metropolitana: strategisk plan och Agenda 2030

- **Piano strategico metropolitano 2019–21** (antagen 21 december 2018) har tre strategier – identitet, utveckling och
  **resiliens** – och 13 programlinjer ([DUP 2026–2028](https://www.cittametropolitana.ve.it/sites/default/files/unita/AllegatiDUP26-28/D.U.P.%202026%20-%202028.pdf), s. 18–19).
  Sedan 2024 är strategin sammanfattad i fyra mål: "che cresce per tutti", "verde e sostenibile", "educativa, culturale e
  sportiva" och "efficace", kopplade till de globala målen.
- **Agenda för hållbar utveckling**: projektet PAGES ("Dal Piano strategico all'Agenda per lo sviluppo sostenibile della
  Città metropolitana di Venezia", med miljöministeriet, 24 månader, avslutat;
  [projektsida](https://www.cittametropolitana.ve.it/trasparenza/i-progetti-in-corso/pages-dal-piano-strategico-allagenda-lo-sviluppo-sostenibile-della))
  skulle bygga agendan på den strategiska planen. DUP 2026–2028 skriver att "l'Agenda urbana della Città metropolitana di
  Venezia per lo sviluppo sostenibile dovrà essere riempita di contenuti concreti" (energi, cirkulär ekonomi, markanvändning,
  skog, klimatanpassning, kusterosion, luft och vatten, biologisk mångfald, hållbar mobilitet) och att man **sedan 2024**
  tar fram mål och indikatorer för de 17 globala målen (s. 22, 28). Ett antaget agendadokument med egna mål har jag inte hittat.
- **Klimatmål**: "ridurre entro il 2030 le emissioni di gas a effetto serra del 40% rispetto al 1990" (s. 27).
- Om lagunen säger samma DUP att stora fartygs inträde i lagunen är "indispensabile all'economia della Città e del
  territorio", att kanalerna, även Vittorio Emanuele, ska muddras efter ett "protocollo fanghi", och att man med UNESCO har nått
  "un allineamento di prospettive" (s. 27).

### Fullmäktiges egen behovslista (juli 2026)

Den 23 juli 2026 antog fullmäktige ett ordine del giorno om **stabil och flerårig refinansiering av speciallagen**
([ODG nr 1](https://consiglio.comune.venezia.it/atti-derivati/1/atto/1); 31 närvarande, 19 röstande, antaget), som
upprepar enhälliga beslut från 16 november 2020, 28 november 2024 och 12 februari 2026. Listan är stadens egen bild av vad
som behövs: kajer, fondamente, broar och gångstråk; muddring av kanalerna och **kamp mot svallvågor (moto ondoso)**;
vatten- och avloppsnät; **brandvattennätet** i centrum och på öarna; offentliga och privata byggnader; tillgänglighet;
monument; **stöd till boende och motåtgärder mot avfolkningen** (familjer, unga, arbetande); handel och hantverk "compatibili
con la città"; ersättning för **merkostnaderna för ö-läget**; öarna; lagunens ekosystem; och **anpassning till
havsnivåhöjningen**.

---

## 3. Politik: valet 24–25 maj 2026 och vem som styr

Kommunalvalet hölls **söndag–måndag 24–25 maj 2026** (andra omgång hade varit 7–8 juni). Venturini fick över hälften av
rösterna redan i första omgången. Säkerheten är hög: Inrikesministeriets öppna data (Eligendo, fil daterad 7 september 2026) stämmer med
kommunens resultat.

**Borgmästarvalet** ([kommunen](https://elezioni.comune.venezia.it/); [Eligendo](https://elezionistorico.interno.gov.it/daithome/documenti/opendata/comunali/comunali-20260524.zip)):

| Kandidat | Koalition | Röster | Andel |
|---|---|---|---|
| **Simone Venturini** | egen lista, Fratelli d'Italia, Lega, Forza Italia, UDC, Partito dei Veneti | 56 344 | **51,02 %** |
| Andrea Martella | PD, AVS, M5S, Terra e Acqua 2026, Venezia è tua, Venezia Riformista (Avanti-PSI, +Europa, Italia Viva, Radicali), Rifondazione | 43 294 | 39,20 % |
| Michele Boldrin | Venezia Ora! | 3 795 | 3,43 % |
| Giovanni Martini | Tutta la città insieme!, ABC Ambiente Bene Comune | 2 332 | 2,11 % |
| Claudio Vernier | Città Vive | 1 963 | 1,77 % |
| Roberto Agirmo | Szumski Resistere Veneto | 1 434 | 1,29 % |
| Luigi Corò | Futuro per Venezia Mestre | 813 | 0,73 % |
| Pierangelo Del Zotto | Prima il Veneto | 441 | 0,39 % |

201 713 röstberättigade, 112 767 röstande (**55,90 %**), 865 blanka och 1 433 ogiltiga röster. 2020 röstade 62,2 %
(egen beräkning ur [Eligendo 2020](https://elezionistorico.interno.gov.it/daithome/documenti/opendata/comunali/comunali-20200920.zip)),
och Luigi Brugnaro vann då i första omgången med 66 750 röster.

**Listor och mandat** (36 platser + borgmästaren):

| Lista | Andel | Mandat |
|---|---|---|
| Simone Venturini Sindaco | 30,10 % | 14 |
| Partito Democratico | 24,84 % | 9 (+ Martella som kandidat) |
| Fratelli d'Italia | 12,89 % | 5 |
| Alleanza Verdi e Sinistra | 5,18 % | 1 |
| Lega – Liga Veneta | 4,72 % | 2 |
| Venezia Ora! | 3,26 % | 0 (+ Boldrin som kandidat) |
| Terra e Acqua 2026 | 2,70 % | 1 |
| Movimento 5 Stelle | 2,61 % | 1 |
| Forza Italia | 2,49 % | 1 |
| övriga 11 listor | under 2 % var | 0 |

Majoriteten har **22 mandat**, oppositionen **14** – samma fördelning som 2020 (Brugnaros lista 14, Lega 5, FdI 2, FI 1).
I oktober 2026 är fullmäktigegrupperna: Simone Venturini Sindaco 14, PD 10 (med Martella), Fratelli d'Italia 5, Misto 2,
AVS 1, Forza Italia 1, M5S 1, Terra e Acqua 2026 1 och Venezia Ora! 1; Lega har ingen egen grupp
([Consiglieri comunali](https://consiglio.comune.venezia.it/strutture/1/strutture/4)). Fullmäktiges ordförande är **Matteo
Senno**. Fullmäktige sammanträder i Ca' Loredan (Venedig) och Ca' Collalto (Mestre).

**Den historiska staden röstade tvärtom** (kommunens preliminära siffror,
[resultat](https://elezioni.comune.venezia.it/risultati/amministrative-sindaco-2026/567/A/20201),
[deltagande](https://elezioni.comune.venezia.it/affluenze.php?at=A&an=20201)): Martella 51,40 % (12 417), Venturini 34,83 %
(8 414), Vernier 4,53 %, Martini 3,74 %, Boldrin 3,41 %; PD största lista med 28,31 %, Terra e Acqua 7,14 %, Città Vive
4,68 %. Deltagandet var 53,97 % (24 599 av 45 578). Venturini vann alltså på röster från fastlandet och öarna – en
spänning som sajten kan visa utan att värdera.

**Regionpresident** är Alberto Stefani (VSF:s [governance](https://vsf.foundation/fondazione/governance/) kallar honom
"Presidente della Giunta Regionale del Veneto"); när han valdes och för vilket parti har jag inte kontrollerat i en källa.
Nästa kommunval är 2031, då mandatperioden 2026–2031 löper ut.

**Förra styret**: Luigi Brugnaro vann 2015 andra omgången mot Felice Casson med 54 405 mot 47 838 röster och
omvaldes 2020 i första omgången ([Eligendo 2015](https://elezionistorico.interno.gov.it/daithome/documenti/opendata/comunali/comunali-20150531.zip);
[Eligendo 2020](https://elezionistorico.interno.gov.it/daithome/documenti/opendata/comunali/comunali-20200920.zip)).

---

## 4. Utmaningar och tillgångar som staden själv nämner

Ur fullmäktiges ODG juli 2026, PAESC, VSF och borgmästarens tal (källor ovan):

**Utmaningar**
- **Avfolkningen av centrum**: 47 625 invånare 2025 mot 174 808 år 1951; fullmäktige kräver "sostegno alla residenza e
  contrasto allo spopolamento".
- **Turisttrycket**: kommunen prövar sedan 2024 en inträdesavgift med "obiettivi di regolazione dei flussi turistici"; 36 639
  övernattande gäster och 13 046 betalande dagsbesökare per avgiftsdag 2025 ([kommunen](https://live.comune.venezia.it/it/2025/08/contributo-di-accesso-i-numeri-del-2025)).
- **Bostäderna**: korttidsuthyrning konkurrerar med boende (VSF:s område "residenzialità"); kommunen har lagstöd att
  reglera (art. 37-bis DL 50/2022) men regleringen är ännu ett försök.
- **Högvattnet och havsnivån**: MOSE stängdes 49 gånger säsongen 2025/26; 110 cm sätter 12 % av staden under vatten.
- **Kostnaden för ö-läget**: kajer, kanaler, brandvattennät och underhåll kostar mer – därav kravet på speciallagen.
- **Jobben och medelklassen**: Venturini vill locka kvalificerade jobb; VSF talar om hantverkets nedgång och krisen i Marghera.
- **Svallvågor och båttrafik** (moto ondoso) och förorenad mark i Porto Marghera (nationellt saneringsområde).

**Tillgångar**
- Världsarvet och den globala synligheten (VSF: "visibilità e risonanza a livello mondiale").
- Universiteten: omkring 28 000 studenter och planer på en "Venezia città campus".
- MOSE och ett halvsekel av lagunarbete sedan speciallagen 1973: 100 km höjda kajer, 16 km² återskapade saltängar, 56 km stärkta stränder ([Autorità per la Laguna](https://www.autoritalaguna.it/m-o-s-e/)).
- Kommunens ekonomi enligt borgmästaren: "un Comune sano"; inträdesavgiften gav 5,4 miljoner euro 2025.
- Porto Marghera som yta för omställning (vätgas, bioraffinaderi enligt PAESC) och de övergivna områdena som Venturini
  vill fylla med nya funktioner.

---

## För berättelsen

### Platser i 3D-modellen

Modellens ruta är 45,426915–45,443085 N och 12,325979–12,349021 E (1,8 km kring 45,4350 N, 12,3375 E). Alla 22 platser och
de fem hållplatserna ligger inne i rutan. **Squero di San Trovaso** ligger bara 3 m innanför västra kanten och Frari 19 m;
**Ca' d'Oro** (45,440880 N) och sjukhuset (45,440358 N) ligger i rutans norra del.

| # | Plats | Lat | Lon | OSM | Nu | Varför för de kommande hundra åren | Källa |
|---|---|---|---|---|---|---|---|
| 1 | Piazza San Marco | 45.434257 | 12.338672 | way 172349507 | Stadens stora torg framför basilikan; ett av de lägst liggande områdena, som MOSE skyddade första gången 3 okt 2020 | Här syns först om MOSE-gränsen och höjda kajer räcker | [Wikipedia: MOSE](https://en.wikipedia.org/wiki/MOSE) |
| 2 | Basilica di San Marco | 45.434548 | 12.339822 | way 138800932 | Markuskyrkan; fasaden mot torget är från 1200-talet | Kulturarvet som måste skyddas när havet stiger | [Wikipedia](https://it.wikipedia.org/wiki/Basilica_di_San_Marco) |
| 3 | Campanile di San Marco | 45.434036 | 12.339044 | way 252637693 | 98,6 m, stadens högsta byggnad; rasade 1902, återuppbyggd till 1912 | Devisen "com'era, dov'era" styr fortfarande hur staden bygger upp | [Wikipedia](https://it.wikipedia.org/wiki/Campanile_di_San_Marco) |
| 4 | Palazzo Ducale | 45.434211 | 12.340592 | way 138803915 | Dogepalatset, i dag museum (1 405 439 besökare enligt kommunens turistårsbok 2017, via Wikipedia) | Republikens maktcentrum – i dag en av turistströmmens magneter | [Wikipedia](https://it.wikipedia.org/wiki/Palazzo_Ducale_(Venezia)) |
| 5 | Riva degli Schiavoni | 45.433887 | 12.343875 | relation 7932799 | 850 m lång kaj i Castello; 12 nov 2019 slet stormen loss tidningskiosken vid San Zaccaria | Stadens fasad mot lagunen och första linjen mot stormfloder; kryssningsfartygen passerade här till 2021 | [ISPRA/CPSM/CNR](https://www.isprambiente.gov.it/files2020/notizie/ispra_cpsm_cnr_novembre_2019_maree_eccezionali.pdf), [Wikipedia](https://it.wikipedia.org/wiki/Riva_degli_Schiavoni) |
| 6 | Ca' Farsetti och Ca' Loredan | 45.436224 | 12.334034 | way 312111362 (Ca' Loredan relation 4182629) | Rådhuset; Ca' Farsetti köptes av kommunen 1826 och blev municipio 1827 | Här fattas besluten om avgift, bostäder och speciallag | [Wikipedia](https://it.wikipedia.org/wiki/Ca%27_Farsetti), [fullmäktige](https://consiglio.comune.venezia.it/) |
| 7 | Ponte di Rialto | 45.438056 | 12.335929 | relation 2289364 (Nominatim: way 527586724, 45.438069, 12.335655) | Stenbro över Canal Grande, byggd 1588–1591 efter Antonio da Pontes ritning | Stadens mest belastade gångstråk – symbol för både handel och trängsel | [Wikipedia](https://it.wikipedia.org/wiki/Ponte_di_Rialto) |
| 8 | Mercato di Rialto och Pescheria | 45.439637 | 12.334522 | way 233887039 (fiskhallens tak way 138801085) | Stadens marknad sedan 1097, med fiskhallen vid Canal Grande | Lagunens och fastlandets mat för dem som bor här – en mätare på om centrum är en stad för invånare | [Wikipedia: Rialto](https://en.wikipedia.org/wiki/Rialto) |
| 9 | Fondaco dei Tedeschi | 45.438254 | 12.336686 | way 138803475 | De tyska köpmännens handelshus, återuppbyggt 1505–1508 efter en brand; senast varuhus (DFS) | Stora hus byter funktion – lager, handel, turism – och kan byta igen | [Wikipedia](https://it.wikipedia.org/wiki/Fondaco_dei_Tedeschi) |
| 10 | Teatro La Fenice | 45.433710 | 12.333857 | node 251501878 (byggnad way 813451645) | Operahus från 1792; anlagd brand 29 jan 1996, återinvigt december 2003 | Brandskyddet i den täta staden – fullmäktige kräver pengar till brandvattennätet | [Wikipedia](https://it.wikipedia.org/wiki/Gran_Teatro_La_Fenice) |
| 11 | Ponte dell'Accademia | 45.431684 | 12.328950 | way 556239027 | Byggd 1933 som provisorisk träbro (E. Miozzi), ombyggd 1984–86 med stålstomme; 48 m spann | Ett provisorium som blev permanent – som många lösningar i lagunen | [Wikipedia](https://it.wikipedia.org/wiki/Ponte_dell%27Accademia) |
| 12 | Gallerie dell'Accademia | 45.431366 | 12.328092 | node 895805118 | Statligt konstmuseum öppnat 1817; 265 893 besökare 2023 | Kultur som drar besökare som stannar, inte bara dagsturister | [Wikipedia](https://it.wikipedia.org/wiki/Gallerie_dell%27Accademia) |
| 13 | Santa Maria della Salute | 45.430573 | 12.334732 | way 138801509 | Votivkyrka efter pesten 1630; varje 21 november en tillfällig träbro över Canal Grande från Santa Maria del Giglio | Familjetradition som binder generationerna i krönikan | [Wikipedia](https://it.wikipedia.org/wiki/Festa_della_Madonna_della_Salute) |
| 14 | Punta della Dogana | 45.430740 | 12.336287 | relation 2317795 | Tullhuset Dogana da Mar (1600-tal) där Canal Grande möter Giudeccakanalen; konstcentrum sedan 2009 | Udden är utsatt för vågor och stormflod; hamnens funktion har ersatts av kultur | [Wikipedia](https://it.wikipedia.org/wiki/Punta_della_Dogana) |
| 15 | Mareografen vid Punta della Salute | 45.431085 | 12.336381 | way 1479988518 (Giudecca-sidan way 1479988516, 45.430688, 12.336667) | Två tidvattenstationer som är referens för hela nätet; nollan ZMPS = medelnivån 1885–1909 | Här mäts varje centimeter som avgör MOSE:s framtid | [ISPRA/CPSM/CNR](https://www.isprambiente.gov.it/files2020/notizie/ispra_cpsm_cnr_novembre_2019_maree_eccezionali.pdf) |
| 16 | San Giorgio Maggiore | 45.429389 | 12.343279 | way 138804537 | Palladios kyrka (1566–1610) på ön mitt emot San Marco; ön är säte för Fondazione Giorgio Cini (1951) | Cini är en av grundarna av VSF; ön ser hela bassängen | [Wikipedia](https://it.wikipedia.org/wiki/Basilica_di_San_Giorgio_Maggiore), [Cini](https://it.wikipedia.org/wiki/Fondazione_Giorgio_Cini) |
| 17 | Ca' d'Oro | 45.440880 | 12.333852 | way 162227289 | Gotiskt palats, statligt museum (Galleria Franchetti) sedan 1927 | Palats med bottenvåning mot kanalen – det som måste anpassas när vattnet stiger | [Wikipedia](https://it.wikipedia.org/wiki/Ca%27_d%27Oro) |
| 18 | Santa Maria Gloriosa dei Frari | 45.436872 | 12.326225 | way 138841819 | Franciskanerkyrka med två verk av Tizian; Tizian, Canova och Monteverdi är begravda här | Minnen och konst i en stad som krymper | [Wikipedia](https://it.wikipedia.org/wiki/Basilica_di_Santa_Maria_Gloriosa_dei_Frari) |
| 19 | Ospedale SS. Giovanni e Paolo | 45.440358 | 12.343472 | way 170235724 (basilikan way 153483298) | Stadens sjukhus, delvis i Scuola Grande di San Marco vid Campo Santi Giovanni e Paolo | Vård på plats är en förutsättning för att äldre och barnfamiljer ska bo kvar | [Wikipedia](https://en.wikipedia.org/wiki/Scuola_Grande_di_San_Marco) |
| 20 | Squero di San Trovaso | 45.430338 | 12.326022 | way 138841864 | Ett av mycket få gondolvarv som fortfarande arbetar; från 1600-talet | Hantverket och båtbyggandet – framtidens eldrivna båtar behöver också varv | [Wikipedia](https://it.wikipedia.org/wiki/Squero_di_San_Trovaso) |
| 21 | Campo Santa Maria Formosa | 45.437284 | 12.341268 | way 171012558 | Ett av stadens största campi, i Castello; nio gränder och elva broar utgår härifrån | Ett bostadstorg där grannar möts – här märks det om familjerna stannar | [Wikipedia](https://it.wikipedia.org/wiki/Campo_Santa_Maria_Formosa) |
| 22 | Scuola Armando Diaz | 45.435541 | 12.343309 | node 4437784460 | Kommunal skola (förskola och lågstadium) vid Fondamenta de l'Osmarin, Castello – enligt OSM:s taggar | Öppna skolor är det tydligaste tecknet på att familjer bor kvar | OSM (ingen annan källa hittad) |

#### places

```json
[
  {"id": "piazza_san_marco", "name": "Piazza San Marco", "lat": 45.434257, "lon": 12.338672, "osm": "way/172349507",
   "sv": "Stadens stora torg framför basilikan och ett av de lägst liggande områdena; MOSE skyddade det första gången 3 oktober 2020. Här syns först om skyddet mot högvatten räcker.",
   "en": "The city's great square in front of the basilica and one of its lowest areas; MOSE first protected it on 3 October 2020. This is where it first shows whether flood defences are enough."},
  {"id": "basilica_san_marco", "name": "Basilica di San Marco", "lat": 45.434548, "lon": 12.339822, "osm": "way/138800932",
   "sv": "Markuskyrkan med en fasad från 1200-talet. Kulturarvet som måste skyddas när havet stiger.",
   "en": "St Mark's Basilica, with a façade from the 13th century. The heritage that must be protected as the sea rises."},
  {"id": "campanile_san_marco", "name": "Campanile di San Marco", "lat": 45.434036, "lon": 12.339044, "osm": "way/252637693",
   "sv": "Klocktornet, 98,6 m och stadens högsta byggnad; det rasade 1902 och byggdes upp igen ”com'era, dov'era” till 1912.",
   "en": "The bell tower, 98.6 m and the city's tallest building; it collapsed in 1902 and was rebuilt 'as it was, where it was' by 1912."},
  {"id": "palazzo_ducale", "name": "Palazzo Ducale", "lat": 45.434211, "lon": 12.340592, "osm": "way/138803915",
   "sv": "Dogepalatset, republikens maktcentrum och i dag museum med omkring 1,4 miljoner besökare om året (2017).",
   "en": "The Doge's Palace, seat of the Republic's power and today a museum with about 1.4 million visitors a year (2017)."},
  {"id": "riva_degli_schiavoni", "name": "Riva degli Schiavoni", "lat": 45.433887, "lon": 12.343875, "osm": "relation/7932799",
   "sv": "850 m lång kaj mot San Marco-bassängen där stormen 12 november 2019 slet loss tidningskiosken vid San Zaccaria; kryssningsfartygen passerade här till 2021.",
   "en": "An 850 m quay on the San Marco basin where the storm of 12 November 2019 tore loose the news kiosk at San Zaccaria; cruise ships passed here until 2021."},
  {"id": "ca_farsetti", "name": "Ca' Farsetti och Ca' Loredan (rådhuset)", "lat": 45.436224, "lon": 12.334034, "osm": "way/312111362",
   "sv": "Kommunens rådhus sedan 1820-talet; fullmäktige sammanträder i Ca' Loredan intill. Här beslutas om inträdesavgift, bostäder och speciallagen.",
   "en": "The town hall since the 1820s; the council meets next door in Ca' Loredan. This is where the access fee, housing and the Special Law are decided."},
  {"id": "ponte_di_rialto", "name": "Ponte di Rialto", "lat": 45.438056, "lon": 12.335929, "osm": "relation/2289364",
   "sv": "Stenbron över Canal Grande, byggd 1588–1591; stadens mest belastade gångstråk och symbol för både handel och trängsel.",
   "en": "The stone bridge over the Grand Canal, built 1588–1591; the city's busiest walkway and a symbol of both trade and crowding."},
  {"id": "mercato_di_rialto", "name": "Mercato di Rialto och Pescheria", "lat": 45.439637, "lon": 12.334522, "osm": "way/233887039",
   "sv": "Stadens marknad sedan 1097 med fiskhallen vid Canal Grande – mat från lagunen för dem som bor här.",
   "en": "The city's market since 1097 with the fish hall on the Grand Canal – lagoon food for the people who live here."},
  {"id": "fondaco_dei_tedeschi", "name": "Fondaco dei Tedeschi", "lat": 45.438254, "lon": 12.336686, "osm": "way/138803475",
   "sv": "De tyska köpmännens handelshus, återuppbyggt 1505–1508; senast varuhus. Ett exempel på hur stora hus byter funktion.",
   "en": "The German merchants' trading house, rebuilt 1505–1508 and most recently a department store. An example of how large buildings change use."},
  {"id": "teatro_la_fenice", "name": "Teatro La Fenice", "lat": 45.433710, "lon": 12.333857, "osm": "node/251501878",
   "sv": "Operahuset från 1792 som brann ned genom mordbrand 29 januari 1996 och återinvigdes i december 2003.",
   "en": "The opera house of 1792, destroyed by arson on 29 January 1996 and reopened in December 2003."},
  {"id": "ponte_dell_accademia", "name": "Ponte dell'Accademia", "lat": 45.431684, "lon": 12.328950, "osm": "way/556239027",
   "sv": "Byggd 1933 som provisorisk träbro och ombyggd 1984–1986 med stålstomme – ett provisorium som blev permanent.",
   "en": "Built in 1933 as a temporary wooden bridge and rebuilt in 1984–1986 on a steel frame – a stopgap that became permanent."},
  {"id": "gallerie_dell_accademia", "name": "Gallerie dell'Accademia", "lat": 45.431366, "lon": 12.328092, "osm": "node/895805118",
   "sv": "Statligt konstmuseum sedan 1817 med den främsta samlingen venetiansk målarkonst; 265 893 besökare 2023.",
   "en": "A state art museum since 1817 with the finest collection of Venetian painting; 265,893 visitors in 2023."},
  {"id": "santa_maria_della_salute", "name": "Santa Maria della Salute", "lat": 45.430573, "lon": 12.334732, "osm": "way/138801509",
   "sv": "Votivkyrkan efter pesten 1630; varje 21 november går venetianarna hit över en tillfällig träbro över Canal Grande.",
   "en": "The votive church after the plague of 1630; every 21 November Venetians walk here over a temporary wooden bridge across the Grand Canal."},
  {"id": "punta_della_dogana", "name": "Punta della Dogana", "lat": 45.430740, "lon": 12.336287, "osm": "relation/2317795",
   "sv": "Tullhuset från 1600-talet på udden mellan Canal Grande och Giudeccakanalen, konstcentrum sedan 2009 och utsatt för vågor och stormflod.",
   "en": "The 17th-century customs house on the point between the Grand Canal and the Giudecca canal, an art centre since 2009 and exposed to waves and storm surges."},
  {"id": "mareografo_punta_salute", "name": "Mareografen vid Punta della Salute", "lat": 45.431085, "lon": 12.336381, "osm": "way/1479988518",
   "sv": "Tidvattenstationen vars nollpunkt (medelnivån 1885–1909) alla Venedigs nivåer räknas från; här mäts varje centimeter som avgör MOSE:s framtid.",
   "en": "The tide gauge whose datum (the 1885–1909 mean) all Venetian levels are measured from; every centimetre that decides MOSE's future is recorded here."},
  {"id": "san_giorgio_maggiore", "name": "San Giorgio Maggiore", "lat": 45.429389, "lon": 12.343279, "osm": "way/138804537",
   "sv": "Palladios kyrka på ön mitt emot San Marco, där Fondazione Giorgio Cini har sitt säte sedan 1951.",
   "en": "Palladio's church on the island facing San Marco, home of the Fondazione Giorgio Cini since 1951."},
  {"id": "ca_doro", "name": "Ca' d'Oro", "lat": 45.440880, "lon": 12.333852, "osm": "way/162227289",
   "sv": "Gotiskt palats vid Canal Grande och statligt museum sedan 1927 – ett av palatsen vars bottenvåning möter vattnet.",
   "en": "A Gothic palace on the Grand Canal and a state museum since 1927 – one of the palaces whose ground floor meets the water."},
  {"id": "frari", "name": "Santa Maria Gloriosa dei Frari", "lat": 45.436872, "lon": 12.326225, "osm": "way/138841819",
   "sv": "Franciskanerkyrkan med Tizians målningar, där Tizian, Canova och Monteverdi ligger begravda.",
   "en": "The Franciscan church with Titian's paintings, where Titian, Canova and Monteverdi are buried."},
  {"id": "ospedale_zanipolo", "name": "Ospedale SS. Giovanni e Paolo", "lat": 45.440358, "lon": 12.343472, "osm": "way/170235724",
   "sv": "Den historiska stadens sjukhus vid Campo Santi Giovanni e Paolo; vård på plats avgör om äldre och barnfamiljer kan bo kvar.",
   "en": "The historic city's hospital by Campo Santi Giovanni e Paolo; care close by decides whether the old and young families can stay."},
  {"id": "squero_san_trovaso", "name": "Squero di San Trovaso", "lat": 45.430338, "lon": 12.326022, "osm": "way/138841864",
   "sv": "Ett av de sista gondolvarven, från 1600-talet; hantverket som också framtidens båtar behöver.",
   "en": "One of the last gondola boatyards, from the 17th century; the craft that future boats will need too."},
  {"id": "campo_santa_maria_formosa", "name": "Campo Santa Maria Formosa", "lat": 45.437284, "lon": 12.341268, "osm": "way/171012558",
   "sv": "Ett av de största campi, i Castello, med kyrka, palats och två brunnar – ett torg för grannar, där det märks om familjerna stannar.",
   "en": "One of the largest campi, in Castello, with a church, palaces and two wells – a square for neighbours, where it shows whether families stay."},
  {"id": "scuola_armando_diaz", "name": "Scuola Armando Diaz", "lat": 45.435541, "lon": 12.343309, "osm": "node/4437784460",
   "sv": "Kommunal skola för de minsta barnen i Castello (enligt OSM); öppna skolor är det tydligaste tecknet på att familjer bor kvar.",
   "en": "A municipal school for young children in Castello (per OSM); open schools are the clearest sign that families stay."}
]
```

#### stops

Vaporettohållplatserna (ACTV) ligger utanför de 22 platserna men behövs för berättelsen om båttrafiken och målet om
hybridmotorer på Canal Grande 2032. Läget är kontrollerat på samma sätt.

```json
[
  {"id": "fermata_san_marco_vallaresso", "name": "San Marco Vallaresso (A)", "lat": 45.432151, "lon": 12.337514, "osm": "node/4212293017",
   "sv": "Vaporettohållplatsen vid Calle Vallaresso, några steg väster om Piazza San Marco.",
   "en": "The vaporetto stop by Calle Vallaresso, a few steps west of Piazza San Marco."},
  {"id": "fermata_san_zaccaria", "name": "San Zaccaria (Danieli) F", "lat": 45.433282, "lon": 12.341925, "osm": "node/3586376620",
   "sv": "Hållplatsen på Riva degli Schiavoni, där stormen 12 november 2019 slet loss tidningskiosken framför bryggan.",
   "en": "The stop on the Riva degli Schiavoni, where the storm of 12 November 2019 tore loose the news kiosk in front of the pier."},
  {"id": "fermata_rialto", "name": "Rialto (C)", "lat": 45.437441, "lon": 12.335391, "osm": "node/2961006745",
   "sv": "Hållplatsen vid Rialtobron på Canal Grande.",
   "en": "The stop by the Rialto bridge on the Grand Canal."},
  {"id": "fermata_accademia", "name": "Accademia (A)", "lat": 45.431740, "lon": 12.328529, "osm": "node/695741733",
   "sv": "Hållplatsen vid Accademiabron och museet.",
   "en": "The stop by the Accademia bridge and museum."},
  {"id": "fermata_salute", "name": "Salute", "lat": 45.431179, "lon": 12.334374, "osm": "node/1859365812",
   "sv": "Hållplatsen vid Santa Maria della Salute, nära udden Punta della Dogana.",
   "en": "The stop by Santa Maria della Salute, close to the Punta della Dogana."}
]
```

Fler fakta per plats:
- **Piazza San Marco och MOSE**: konsortiet och kommunen höjer kajer och gångytor för att skydda mot medelhöga tidvatten
  *under* 110 cm, den nivå där barriärerna reses ([Wikipedia: MOSE](https://en.wikipedia.org/wiki/MOSE)). Vid 110 cm är 12 %
  av staden under vatten ([ISPRA](https://www.isprambiente.gov.it/it/archivio/notizie-e-novita-normative/notizie-ispra/2020/11/12-novembre-2019-2013-un-anno-dall2019acqua-alta-eccezionale-a-venezia)).
- **Riva degli Schiavoni och Zattere 12 november 2019**: personal från miljöbolaget Veritas vid San Zaccaria hörde ett "boato"
  före vindbyn; gångbryggorna för högvatten flög, tidningskiosken vid hållplatsen slets loss, en taxibåt kilades in i en
  gränd bredvid hotell Danieli, ACTV:s båtar slog mot varandra, Via Garibaldi blev en flod och en kiosk på Zattere kastades
  omkring 20 m ut i Giudeccakanalen ([ISPRA/CPSM/CNR, s. 9](https://www.isprambiente.gov.it/files2020/notizie/ispra_cpsm_cnr_novembre_2019_maree_eccezionali.pdf)).
- **Campanile och Fenice**: när La Fenice skulle byggas upp efter branden 1996 valde man devisen "com'era, dov'era", som
  togs från återuppbyggnaden av klocktornet efter raset 1902 ([Wikipedia](https://it.wikipedia.org/wiki/Gran_Teatro_La_Fenice)).
- **Accademiabron**: den provisoriska träbron byggdes på 37 dagar och öppnades 15 februari 1933; den var då Europas största
  bågbro i trä ([Wikipedia](https://it.wikipedia.org/wiki/Ponte_dell%27Accademia)).
- **Mareografen**: vid Punta della Salute står två stationer, på Canal Grande- och Giudecca-sidan, och de visade 187 resp.
  189 cm den 12 november 2019. Tillsammans har kommunens och ISPRA:s nät 42 stationer
  ([ISPRA/CPSM/CNR, s. 4 och 7](https://www.isprambiente.gov.it/files2020/notizie/ispra_cpsm_cnr_novembre_2019_maree_eccezionali.pdf)).
- **Ca' Farsetti**: palatset var en tid hotellet "Gran Bretagna" innan kommunen köpte det 1826
  ([Wikipedia](https://it.wikipedia.org/wiki/Ca%27_Farsetti)).

### Historia för en släktkrönika (1926–2126)

Det här är vad en venetiansk familj kan ha upplevt och berättat vidare under fem generationer. Platserna i kursiv finns i
3D-modellen; befolkningstalen är kommunens ([A01_T01](https://www.comune.venezia.it/sites/comune.venezia.it/files/page/files/A01_T01_ST_Pop_zone_1871_2025.ods)).

**Första generationen: det trånga centrum och den nya industrin (1917–1945)**
- I början av 1900-talet bodde de flesta i centrum "stipata in case sovraffollate e in condizioni igieniche carenti"
  (Cesco Chinello, *Storia operaia di Porto Marghera*, Treccani, citerad av [Wikipedia: Marghera](https://it.wikipedia.org/wiki/Marghera)).
- **1917** bestämmer staten att bygga en industrihamn på fastlandet vid Marghera; Società Porto Industriale grundas
  (Regionen anger 1920) och bygger kanaler, hamn och järnväg. Den första kemiska fabriken startar 1923; på 1930-talet kommer
  aluminium, zink och konstgödsel, och 1935 har Marghera Italiens kraftigaste värmekraftverk
  ([Regione del Veneto](https://sistemavenezia.regione.veneto.it/content/la-storia); [Wikipedia](https://en.wikipedia.org/wiki/Marghera)).
- **1926** slås Mestre, Chirignago, Zelarino och Favaro ihop med Venedig. Samma år grundas arkitekthögskolan IUAV
  ([Wikipedia](https://it.wikipedia.org/wiki/Venezia)). 1931 bor 163 559 i centrum och 53 937 på fastlandet.
- **25 april 1933** öppnar vägbron över lagunen (då *Ponte Littorio*, från 1946 Ponte della Libertà), 3 850 m bredvid
  järnvägsbron från 1846 ([Wikipedia](https://it.wikipedia.org/wiki/Ponte_della_Libert%C3%A0)). Samma år byggs den
  provisoriska *Accademiabron*.
- Årets högtider är desamma i alla generationer: **Redentore** tredje söndagen i juli, med en bro av båtar över
  Giudeccakanalen från Zattere och fyrverkeri över bassängen ([Wikipedia](https://it.wikipedia.org/wiki/Festa_del_Redentore));
  tusentals venetianare äter middag i sina båtar medan de väntar ([Wikipedia (en)](https://en.wikipedia.org/wiki/Festa_del_Redentore)).
  Och **Festa della Salute** 21 november, med en tillfällig träbro från Santa Maria del Giglio till *Salute*; dagen är
  fortfarande ledig i Venedig och man äter *castradina*, en soppa på saltat och rökt fårkött med savojkål
  ([Wikipedia](https://it.wikipedia.org/wiki/Festa_della_Madonna_della_Salute); [castradina](https://it.wikipedia.org/wiki/Castradina)).
  *Sarde in saor* – sardiner i lök och vinäger – var fiskarnas sätt att hålla maten i båten
  ([Wikipedia](https://it.wikipedia.org/wiki/Sarde_in_saor)). *Rialtomarknaden* har varit stadens marknad sedan 1097
  ([Wikipedia](https://en.wikipedia.org/wiki/Rialto)).

**Andra generationen: utflyttningen och översvämningen (1945–1973)**
- **1951** når centrum sin högsta befolkning, 174 808. Sedan börjar uttåget: 1966 bor 121 309 kvar, 1971 108 426.
- Industrin växer. Kanalen Malamocco–Marghera grävs för att fartygen ska slippa passera staden. I början av 1960-talet har
  Porto Marghera omkring **200 företag och 35 000 anställda**, och **Mestre har vuxit från 20 000 till 90 000 invånare**
  sedan 1920; Marghera från 5 000 till 25 000 ([Regionen](https://sistemavenezia.regione.veneto.it/content/la-storia)).
  En familj som flyttar från en fuktig bottenvåning i Castello till en ny lägenhet i Mestre och pendlar till fabriken är
  1900-talets typiska venetianska historia (en sammanfattning utifrån siffrorna, inte ett citat).
- **4 november 1966**: tidvattnet når **194 cm** vid *Punta della Salute*, den högsta nivån sedan 1872, och nästan 90 % av
  staden står under vatten ([ISPRA/CPSM/CNR](https://www.isprambiente.gov.it/files2020/notizie/ispra_cpsm_cnr_novembre_2019_maree_eccezionali.pdf)).
  **1973** kom speciallagen 171: att rädda Venedig är "un problema
  di preminente interesse nazionale" ([Autorità per la Laguna](https://www.autoritalaguna.it/m-o-s-e/)).

**Tredje generationen: avindustrialiseringen och turisternas stad (1973–2003)**
- Godstrafiken i Porto Marghera når 24 miljoner ton 1974; från början av 1980-talet stagnerar industrin och jobben försvinner
  ([Regionen](https://sistemavenezia.regione.veneto.it/content/la-storia)). Området blir 1998 ett nationellt saneringsområde
  (lag 426/1998, [Wikipedia](https://it.wikipedia.org/wiki/Porto_Marghera)).
- Centrum krymper till 93 598 (1981), 76 644 (1991) och 65 695 (2001).
- **1984** antas den andra lagen för Venedig (lag 798/1984) med "Comitatone" under premiärministern; i början av 1990-talet
  kommer en allmän plan med lagunskydd, lokala skydd och MOSE ([Autorità per la Laguna](https://www.autoritalaguna.it/m-o-s-e/)).
- **1987** blir "Venedig och dess lagun" världsarv. **15 juli 1989** ger Pink Floyd konsert under Redentore inför omkring
  200 000 åskådare på kajerna och i båtar i San Marco-bassängen ([Wikipedia](https://en.wikipedia.org/wiki/Festa_del_Redentore)).
- **29 januari 1996** brinner *La Fenice*; den återinvigs i december 2003.
- **14 maj 2003** börjar bygget av MOSE.

**Fjärde generationen: barriärerna, skandalen och den tomma staden (2003–2026)**
- **2005** får kommunen sina sex municipalità. Centrum har 58 991 invånare 2011.
- **4 juni 2014** grips 35 personer, bland dem borgmästaren Giorgio Orsoni, för mutor kring MOSE
  ([Wikipedia](https://it.wikipedia.org/wiki/MOSE)). 2015 väljs Luigi Brugnaro till borgmästare i andra omgången.
- **12 november 2019**: 187 cm (189 cm på Giudecca-sidan) och vindbyar över 100 km/h; under en vecka passeras 140 cm fyra
  gånger. 28 tidvatten över 110 cm det året ([ISPRA](https://www.isprambiente.gov.it/it/archivio/notizie-e-novita-normative/notizie-ispra/2020/11/12-novembre-2019-2013-un-anno-dall2019acqua-alta-eccezionale-a-venezia)).
- **2020**: pandemin. Inträdesavgiften, planerad sedan 2019, skjuts upp ([Wikipedia (en)](https://en.wikipedia.org/wiki/Venice));
  Redentores fyrverkeri ställs in ([Wikipedia](https://it.wikipedia.org/wiki/Festa_del_Redentore)).
  **3 oktober 2020** reses MOSE skarpt för första gången och Piazza San Marco hålls torr.
- **1 augusti 2021**: stora kryssningsfartyg förbjuds i San Marco-bassängen och Giudeccakanalen (DL 103/2021).
- **14 mars 2022** bildas hållbarhetsstiftelsen VSF. Samma år faller centrum under 50 000 invånare (49 665).
- **2024** prövas inträdesavgiften för första gången (29 dagar), **2025** i 54 dagar och **2026** i 60.
- **2025/26** stängs MOSE 49 gånger, fler än någon tidigare säsong.
- **Januari 2026** antas klimatplanen PAESC; **24–25 maj 2026** väljs Simone Venturini; speciallagens pengar och det nya
  programmet är hösten 2026 de stora frågorna i fullmäktige.

**Femte generationen (2026–2126)** – det som sajten skildrar som vägval, se nästa avsnitt.

Vardagslivet, som material för krönikan:
- **Var familjerna bodde**: i trånga hus i centrum fram till 1950-talet; sedan Mestre och Marghera (fastlandet hade 210 674
  invånare 1975). I dag bor sju av tio av kommunens invånare på fastlandet (178 131 av 251 294, egen beräkning: 71 %).
- **Arbetet**: hamnen och Porto Marghera (kemi, metall, glas i skivor, varv och raffinaderi enligt Regionen), hantverk
  och båtbygge (*squero*), och i dag främst besöksnäringen; VSF beskriver hantverket som på tillbakagång.
- **Barnen och skolan**: skolor finns kvar i Castello och San Polo (t.ex. *Scuola Armando Diaz*, OSM). Elever som pendlar in
  till skolor i den historiska staden undantas från inträdesavgiften 2026, vilket visar att många kommer utifrån
  ([kommunen](https://live.comune.venezia.it/it/2026/03/domani-apre-il-portale-il-contributo-di-accesso-2026-confermata-quota-da-5-10-euro)).
- **Maten**: fisk och grönsaker från Rialto, sarde in saor, castradina till Salute, middagen i båten på Redentore (källor ovan).
- **Högvattnet**: sirener vid prognos på 110 cm, gångbryggor och skott (*paratie*) framför dörrarna – kommunens råd till
  invånarna är att följa prognoserna och sätta upp skotten i tid ([civilskyddet](https://www.comune.venezia.it/it/content/alta-e-bassa-marea-eccezionale);
  sirenerna enligt [ISPRA/CPSM/CNR, s. 6](https://www.isprambiente.gov.it/files2020/notizie/ispra_cpsm_cnr_novembre_2019_maree_eccezionali.pdf)).

### Beslut framför oss (Resan)

Tio beslut som staden står inför, med läget och de vägval som diskuteras. Där vägvalen är mina egna sammanfattningar
står det.

**1. MOSE och vad som kommer efter**
- *Läget*: barriärerna reses vid prognos över 110 cm. Antalet stängningar har ökat från 20 säsongen 2020/21 till 49 säsongen 2025/26
  ([Autorità per la Laguna](https://www.autoritalaguna.it/operativita-m-o-s-e/)). Sedan 2024–25 ansvarar Autorità per la
  Laguna di Venezia (inrättad genom DL 104/2020, ordförande Roberto Rossetto sedan mars 2024) för drift och underhåll; dess
  vetenskapliga råd leds av Andrea Rinaldo ([stato di costituzione](https://www.autoritalaguna.it/servizi/stato-di-costituzione-dellente/)).
  Med 50 cm högre hav måste barriärerna i snitt stängas en gång om dagen, med 75 cm är lagunen oftare stängd än öppen, och
  delvisa stängningar skyddar inte staden ([Umgiesser 2020, CNR](https://explore.cnr.it/resource/item/347477)).
- *Vägval* (min sammanfattning): behålla 110 cm och stänga allt oftare (hamnen och lagunens vattenutbyte betalar); höja
  kajer och golv så att gränsen kan ligga högre; på sikt söka en mer permanent avgränsning av lagunen mot havet.

**2. Bostäder och korttidsuthyrning**
- *Läget*: art. 37-bis i DL 50/2022 ger Venedig rätt att begränsa korttidsuthyrning. Kommunens förslag (giuntan 24 oktober
  2024) är frivilligt: den som hyr ut mer än 120 dagar per år går med i ett register med krav (mottagning på plats,
  jour dygnet runt), på försök till 31 december 2026 ([ANSA](https://www.ansa.it/sito/notizie/cronaca/2024/10/24/venezia-prima-in-italia-regolamenta-le-locazioni-turistiche_2b1cec39-56d1-42ae-9e8b-60637c5ed238.html);
  [förslaget](https://www.comune.venezia.it/sites/comune.venezia.it/files/page/files/Allegato_2_Regolamento_locazioni_turistiche_FD.pdf)).
  Förslaget och en tillfällig "moratoria" behandlades i utskott 25 november 2025
  ([protokoll](https://consiglio2020.comune.venezia.it/pdf/atti_assemblee/verbali_1/verbale_1857.pdf)); något slutligt beslut har
  jag inte hittat. Venturini vill rusta upp tomma kommunala lägenheter för unga par.
- *Vägval*: förlänga det frivilliga "avtalet" efter 2026; införa en fast gräns på 120 dagar; kvoter per sestiere; bygga
  och köpa bostäder för dem som arbetar i staden (min sammanfattning utifrån debatten och VSF:s område "residenzialità").

**3. Inträdesavgiften och ett tak för besökare**
- *Läget*: 29 dagar 2024 (485 062 betalningar), 54 dagar 2025 (723 497, 5,42 M€), 60 dagar 2026; fortfarande ett försök
  "in vista di un'eventuale applicazione a regime". Pengarna har gått till lägre avfallsavgift för invånarna
  ([2025](https://live.comune.venezia.it/it/2025/08/contributo-di-accesso-i-numeri-del-2025),
  [2026](https://live.comune.venezia.it/it/2026/03/domani-apre-il-portale-il-contributo-di-accesso-2026-confermata-quota-da-5-10-euro)).
- *Vägval*: göra avgiften permanent; fler dagar eller hela året; högre pris de mest trängda dagarna; bokningstak
  (antalet besökare per dag) – det sista är inte kommunens förslag utan en vanlig ståndpunkt i debatten (min sammanfattning).

**4. Hamnen: inne i lagunen eller utanför?**
- *Läget*: DL 103/2021 förbjöd stora fartyg i San Marco-bassängen och Giudeccakanalen från 1 augusti 2021 och gjorde
  hamnmyndighetens ordförande till kommissarie för alternativa kajplatser ([kammaren](https://documenti.camera.it/Leg18/Dossier/Pdf/QR0185.Pdf)).
  Storstadsregionen kallar de stora fartygens inträde i lagunen "indispensabile" och vill muddra kanalen Vittorio Emanuele
  ([DUP, s. 27](https://www.cittametropolitana.ve.it/sites/default/files/unita/AllegatiDUP26-28/D.U.P.%202026%20-%202028.pdf)).
  Venturini sköter hamnfrågan själv och vill omvandla områden som inte längre behövs för hamn och industri.
- *Vägval*: kryssningsfartyg till Marghera via kanalerna; en terminal utanför lagunen; bara mindre fartyg; ingen
  kryssningstrafik alls.

**5. Båttrafiken, svallvågorna och elen**
- *Läget*: målet är att alla båtar på Canal Grande ska ha hybridmotorer senast 2032; ACTV:s utsläpp har minskat kraftigt
  ([PAESC](https://dam.comune.venezia.it/api/resource/f7c1e9bb-4880-4974-b551-385bab4ca132)); fullmäktige kräver pengar mot
  "moto ondoso" ([ODG](https://consiglio.comune.venezia.it/atti-derivati/1/atto/1)).
- *Vägval*: elektriska vaporetti och laddning vid hållplatserna; hastighetsgränser och kontroll; färre transport- och
  taxibåtar genom samlastning (min sammanfattning).

**6. Saltängarna och lagunens form**
- *Läget*: 16 km² barene återskapade, 39 km skyddade, 12 småöar återställda ([Autorità per la Laguna](https://www.autoritalaguna.it/m-o-s-e/)).
  Muddermassor behöver ett "protocollo fanghi" för att få användas ([DUP](https://www.cittametropolitana.ve.it/sites/default/files/unita/AllegatiDUP26-28/D.U.P.%202026%20-%202028.pdf)).
- *Vägval*: använda muddermassorna till nya saltängar som dämpar vågor och binder kol; djupare kanaler för fartygen, som
  ökar erosionen; låta lagunen bli mer av ett hav (min sammanfattning).

**7. Höja kajer, gångstråk och bottenvåningar**
- *Läget*: 100 km kajer och lagunstränder har höjts; fullmäktige sätter kajer, fondamente, broar och gångstråk först på
  listan över behov ([Autorità](https://www.autoritalaguna.it/m-o-s-e/); [ODG](https://consiglio.comune.venezia.it/atti-derivati/1/atto/1)).
- *Vägval*: höja fler gångytor och kajer så att MOSE behöver stängas mer sällan; göra bottenvåningarna tåliga mot vatten
  eller överge dem som bostäder; betala med speciallagen eller med inträdesavgiften (min sammanfattning).

**8. Att behålla unga och barnfamiljer**
- *Läget*: centrum har 47 625 invånare och minskar med 500–900 per år. Venturini satsar på jobb för medelklassen,
  forskning (Ospedale al Mare) och bostäder för unga par; VSF vill göra staden till ett universitetscampus.
- *Vägval*: studentbostäder eller familjebostäder; distansarbetare och forskare som nya invånare; skolor och sjukvård
  som hålls kvar i centrum även när barnen blir färre (min sammanfattning).

**9. Porto Margheras omvandling**
- *Läget*: avindustrialiserat och förorenat (nationellt saneringsområde sedan 1998); PAESC och VSF satsar på en vätgasdal,
  bioraffinaderi och grön industri; borgmästaren vill att Venedig ska locka investeringar och lediga områden ska få nya
  funktioner ([PAESC](https://dam.comune.venezia.it/api/resource/f7c1e9bb-4880-4974-b551-385bab4ca132); [VSF](https://vsf.foundation/attivita/)).
- *Vägval*: vätgas och biobränsle; logistik och hamn; stadsförnyelse med bostäder och parker på sanerad mark.

**10. Vem betalar? Speciallagen**
- *Läget*: fullmäktige har sedan 2020 fyra gånger (de tre första enhälligt) begärt en stabil och flerårig
  finansiering; i juli 2026 bad man giuntan ta fram en fullständig lista över behov och kostnader
  ([ODG](https://consiglio.comune.venezia.it/atti-derivati/1/atto/1)).
- *Vägval*: statliga pengar varje år; egna intäkter (inträdesavgift, turistskatt); en särskild status för Venedig med
  egna befogenheter, som fullmäktige begärde i februari 2026.

### Siffror som berättar

- **174 808 → 47 625**: centrum har 27 % av sina invånare från 1951 kvar.
- **194 cm** 1966 och **187 cm** 2019 – och **20 → 49** MOSE-stängningar per säsong (2020/21 → 2025/26).
- **59 %** av staden under vatten vid 140 cm, **12 %** redan vid 110 cm.
- **36 639** övernattande gäster och **13 046** betalande dagsbesökare per avgiftsdag 2025 – mot 47 625 invånare.
- **35 000** jobb i Porto Marghera i början av 1960-talet; Mestre växte från 20 000 till 90 000 på fyrtio år.
- **51,40 %** för vänstern i centrum, **51,02 %** för högern i hela kommunen.
- **2032**: alla båtar på Canal Grande hybrida. **2050**: klimatneutral kommun.

---

## Uppgifter som går isär

| Fråga | Källa A | Källa B |
|---|---|---|
| Högvattnet 12 nov 2019 | 187 cm, Punta della Salute Canal Grande-sidan (kommunen, ISPRA/CPSM/CNR) | 189 cm, Giudecca-sidan (ISPRA:s nyhet) – två mätare |
| Speciallagens datum | 16 april 1973 (fullmäktiges ODG) | 13 april 1973 (Autorità per la Lagunas sida) |
| VSF:s start | 2021 (uppdraget) | bildad 14 mars 2022 (stiftelsen) |
| MOSE-gränsen | 110 cm (Autorità per la Laguna, 2026) | 130 cm "as of 2023" (engelska Wikipedia, via engineering.com) – sannolikt en tidigare driftsregel |
| La Fenice återöppnas | invigningsvecka 14–21 dec 2003 (it.wikipedia) | "re-opened in November 2004" (en.wikipedia; troligen första operan) |
| Porto Margheras start | 1917, statens beslut och studiebolag 1 feb 1917 (Wikipedia) | Società Porto Industriale "costituita nel 1920" (Regionen) |
| Anställda i Marghera vid toppen | cirka 35 000 i början av 1960-talet (Regionen) | 35 724 år 1971 (it.wikipedia) |
| Turnout 2020 | 62,2 % (egen beräkning ur Eligendo) | 62,23 % (Wikipedia, 6,33 punkter mer än 2026) – stämmer |
| Inträdesavgiften 2026 | över 650 000 vouchers, över 5 M€ (preliminärt, Clean Cities) | slutliga siffror från kommunen ej lästa |

## Luckor

- **Programmet 2026–2031**: texten till Linee programmatiche och DUP 2027–2029 har jag inte kunnat läsa; fullmäktige röstar
  15 oktober 2026. Kontrollera efter beslutet och uppdatera `com_linee_mandato_omraden`.
- **Korttidsuthyrningen**: jag hittade inget slutligt fullmäktigebeslut om reglerna för uthyrning över 120 dagar; försöket
  löper ut 31 december 2026.
- **Agenda metropolitana per lo sviluppo sostenibile**: inget antaget dokument med egna mål hittades; DUP säger att det ska
  "fyllas med innehåll". PSM för 2026–2028 är ännu inte uppdaterad.
- **Befolkningsprognos** för centro storico och kommunen (kommunens eller ISTAT:s) hittades inte; kommunens statistiksidor är
  spärrade för automatiska anrop och sökkvoten tog slut.
- **Municipalità-valen 2026** (ordförande och råd i Venezia-Murano-Burano m.fl.) har jag inte läst.
- **Saltängarnas historiska yta** (hur mycket barene som förlorats sedan 1900-talets början) – ingen primärkälla hittad.
- **Sysselsättningen i Porto Marghera i dag** – Regionens enkät är en död länk.
- **UNESCO:s beslut 2021 och 2023** (sidan whc.unesco.org svarade 403); bara inskrivningen 1987 och varningen 2014 (Wikipedia) är med.
- **Kryssningstrafiken** före och efter 2021 och idétävlingen om en hamn utanför lagunen kontrollerades inte (sökkvoten).
- **Skolan**: Scuola Armando Diaz beskrivs bara utifrån OSM:s taggar.
- **Fondaco dei Tedeschi**: om varuhuset (DFS) fortfarande är öppet 2026 är inte kontrollerat.
- **2020, den tomma staden**: inga siffror för besökare under nedstängningen; ämnet turism-ekonomi kan ha dem.

## Alla källor

**Comune di Venezia**
- Popolazione residente (serie storiche): https://www.comune.venezia.it/it/content/serie-storiche (Wayback 2026-10-01)
- Serie storica pop. residente per zone 1871–2025 (ODS): https://www.comune.venezia.it/sites/comune.venezia.it/files/page/files/A01_T01_ST_Pop_zone_1871_2025.ods (Wayback 2026-08-05)
- Elezioni amministrative 2026, hela kommunen: https://elezioni.comune.venezia.it/ (Wayback 2026-07-11)
- Centro storico, resultat: https://elezioni.comune.venezia.it/risultati/amministrative-sindaco-2026/567/A/20201 (Wayback 2026-07-10)
- Centro storico, deltagande: https://elezioni.comune.venezia.it/affluenze.php?at=A&an=20201 (Wayback 2026-07-10)
- Venturinis första tal 16 juni 2026: https://live.comune.venezia.it/it/2026/06/venturini-al-primo-consiglio-comunale-da-sindaco-servire-venezia-e-lonore-piu-grande-il
- "Panorama on the Road" 9 juli 2026: https://live.comune.venezia.it/it/2026/07/panorama-road-venezia-venturini-casa-mobilita-e-lavoro-rafforzare-il-ceto-medio-e-attrarre
- PAESC, nyhet 19 jan 2026: https://live.comune.venezia.it/it/2026/01/energia-clima-e-mobilita-presentato-il-paesc-piano-di-azione-lenergia-sostenibile-e-il
- PAESC, presentation (pdf): https://dam.comune.venezia.it/api/resource/f7c1e9bb-4880-4974-b551-385bab4ca132
- Contributo di accesso, siffrorna 2025: https://live.comune.venezia.it/it/2025/08/contributo-di-accesso-i-numeri-del-2025
- Contributo di accesso 2026: https://live.comune.venezia.it/it/2026/03/domani-apre-il-portale-il-contributo-di-accesso-2026-confermata-quota-da-5-10-euro ; portal https://cda.ve.it
- Regolamento locazioni turistiche (Allegato 2): https://www.comune.venezia.it/sites/comune.venezia.it/files/page/files/Allegato_2_Regolamento_locazioni_turistiche_FD.pdf (Wayback 2025-01-17)
- Alta e bassa marea eccezionale (civilskyddet): https://www.comune.venezia.it/it/content/alta-e-bassa-marea-eccezionale (Wayback 2025-06-18)

**Consiglio comunale di Venezia**
- Consiglieri comunali (grupper): https://consiglio.comune.venezia.it/strutture/1/strutture/4
- Kallelse 15 okt 2026 (PD 2026.1074): https://consiglio.comune.venezia.it/atti-assemblee/2/atto/70
- Utskott 6 okt 2026: https://consiglio.comune.venezia.it/atti-assemblee/1/atto/57 ; sammanfattning https://consiglio.comune.venezia.it/pdf/atti_assemblee/resoconti_1/resoconto_sintetico_57.pdf
- ODG nr 1, 23 juli 2026 (speciallagen): https://consiglio.comune.venezia.it/atti-derivati/1/atto/1
- Utskottsprotokoll 25 nov 2025 (korttidsuthyrning): https://consiglio2020.comune.venezia.it/pdf/atti_assemblee/verbali_1/verbale_1857.pdf

**Ministero dell'Interno (Eligendo)**
- Comunali 24/05/2026, öppna data: https://elezionistorico.interno.gov.it/daithome/documenti/opendata/comunali/comunali-20260524.zip
- Comunali 20/09/2020, öppna data: https://elezionistorico.interno.gov.it/daithome/documenti/opendata/comunali/comunali-20200920.zip
- Comunali 31/05/2015 (filen innehåller även andra omgången), öppna data: https://elezionistorico.interno.gov.it/daithome/documenti/opendata/comunali/comunali-20150531.zip

**Città metropolitana di Venezia**
- DUP 2026–2028: https://www.cittametropolitana.ve.it/sites/default/files/unita/AllegatiDUP26-28/D.U.P.%202026%20-%202028.pdf
- Projektet PAGES: https://www.cittametropolitana.ve.it/trasparenza/i-progetti-in-corso/pages-dal-piano-strategico-allagenda-lo-sviluppo-sostenibile-della ; presentation https://www.cittametropolitana.ve.it/sites/default/files/Progetto%20PAGES%20180620.pdf

**Regione del Veneto**
- Sistema Venezia – Porto Marghera, La storia: https://sistemavenezia.regione.veneto.it/content/la-storia

**Fondazione Venezia Capitale Mondiale della Sostenibilità (VSF)**
- https://vsf.foundation/fondazione/chi-siamo/ ; https://vsf.foundation/fondazione/ ; https://vsf.foundation/attivita/ ; https://vsf.foundation/attivita/progetti/ ; https://vsf.foundation/fondazione/governance/ ; https://vsf.foundation/soci/
- Quaderno 2 (juli 2025), länkad men inte läst: https://vsf.foundation/wp-content/uploads/2025/07/Quaderno2_VSF_Luglio2025.pdf

**Autorità per la Laguna di Venezia**
- Operatività M.O.S.E.: https://www.autoritalaguna.it/operativita-m-o-s-e/
- M.O.S.E. (lagunprogrammets resultat): https://www.autoritalaguna.it/m-o-s-e/
- Istituzione dell'Ente: https://www.autoritalaguna.it/servizi/istituzione-dellente-e-riferimenti-normativi/ ; Stato di costituzione: https://www.autoritalaguna.it/servizi/stato-di-costituzione-dellente/

**ISPRA, CNR, parlamentet**
- ISPRA, 12 novembre 2019 – un anno dall'acqua alta: https://www.isprambiente.gov.it/it/archivio/notizie-e-novita-normative/notizie-ispra/2020/11/12-novembre-2019-2013-un-anno-dall2019acqua-alta-eccezionale-a-venezia
- ISPRA/CPSM/CNR, Novembre 2019: un mese di maree eccezionali: https://www.isprambiente.gov.it/files2020/notizie/ispra_cpsm_cnr_novembre_2019_maree_eccezionali.pdf
- Umgiesser 2020 (CNR-post): https://explore.cnr.it/resource/item/347477
- Camera dei deputati, DL 103/2021: https://documenti.camera.it/Leg18/Dossier/Pdf/QR0185.Pdf

**Nyheter (där primärkällor saknas)**
- ANSA 24 okt 2024, korttidsuthyrning: https://www.ansa.it/sito/notizie/cronaca/2024/10/24/venezia-prima-in-italia-regolamenta-le-locazioni-turistiche_2b1cec39-56d1-42ae-9e8b-60637c5ed238.html
- Notizie Plus, linee di mandato: https://notizieplus.it/linee-di-mandato-venezia-2026-2031-via-libera-della-giunta-ecco-gli-undici-obiettivi/
- Clean Cities, inträdesavgiften 2026: https://italy.cleancitiescampaign.org/pums-updates/venezia-chiusa-la-sperimentazione-2026-del-contributo-di-accesso/

**Wikipedia**
- it: Venezia, Sestiere (Venezia), Municipalità di Venezia, Laguna di Venezia, Marghera, Porto Marghera, Ponte della Libertà, MOSE, Gran Teatro La Fenice, Campanile di San Marco, Basilica di San Marco, Palazzo Ducale (Venezia), Ponte di Rialto, Ponte dell'Accademia, Fondaco dei Tedeschi, Punta della Dogana, Ca' d'Oro, Basilica di Santa Maria Gloriosa dei Frari, Squero di San Trovaso, Gallerie dell'Accademia, Basilica di San Giorgio Maggiore, Fondazione Giorgio Cini, Ca' Farsetti, Riva degli Schiavoni, Campo Santa Maria Formosa, Festa del Redentore, Festa della Madonna della Salute, Castradina, Sarde in saor (https://it.wikipedia.org/wiki/<titel>)
- en: MOSE, Venice, Venetian Lagoon, Marghera, Rialto, Fondaco dei Tedeschi, La Fenice, Scuola Grande di San Marco, Festa del Redentore (https://en.wikipedia.org/wiki/<title>)

**OpenStreetMap**
- Projektets `cities/venezia/osm.json` (© OpenStreetMap contributors, ODbL) och Nominatim: https://nominatim.openstreetmap.org/lookup
