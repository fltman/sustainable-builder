---
name: research-city
description: Research a place's starting point for its sustainable-vision site – Kolada's key figures for a Swedish municipality, then parallel deep research per topic into sourced records (value, unit, year, scope, source URL, confidence) with English and notes, the municipality's own goals, challenges and assets, places with coordinates, local history and the decisions ahead; then merge and check. Use when building a new place (build-sustainable step 3), when the user asks to update or deepen the research, or when a number on the site needs a better source.
---

# Research a place

The site claims nothing it cannot source. Every starting value in the model is a record in
`cities/<slug>/vision/research/baseline.json`, every record has a URL that shows the figure, and what
could not be found is said to be an assumption. Kalmar's research (examples/kalmar/vision/research/)
and Rättvik's (cities/rattvik/vision/research/) are the models to follow.

## 1. Kolada (Swedish municipalities)

```sh
python3 sustainable.py research <slug> kolada [--kommun 2031]
```
~70 key figures (population and ages, emissions by sector, electricity, solar and wind, cars, health,
trust, safety, schools, work, housing, waste, water) from `pipeline/research/kolada-catalogue.json`, the
latest year Kolada has, as `research/deep/kolada.json` with English. Each record's note says what the
figure measures and gives the country's and the county's value for the same year ("Riket 48,5 %, länet
38,0 % (2025)") – the catalogue holds definitions only, never one place's numbers or comments, so keep it
that way when you add a figure. Outside Sweden: the national statistics office and Eurostat play this
part – write the same records by hand or with an agent.

## 2. Deep research, in parallel

One agent per topic (general-purpose, with web search), each writing three files in
`cities/<slug>/vision/research/deep/`: `<topic>.json` (records), `<topic>.en.json` (English for each),
`<topic>-notes.md` (method, every source, gaps, and "För berättelsen": places, history, debates and
decisions, numbers that tell a story). Topics that worked for Rättvik (seven agents, 40 min each):

| topic | what the model and the texts need |
|---|---|
| klimat-vatten | the county's warming by scenario (SMHI), hot days today and 2071–2100, the sea or lake: mean and 100-year levels in the height system, the level where streets flood, its future change; drinking water: source, capacity, dry-year margin, restrictions; the water body's status (VISS) and blooms |
| energi-resor | electricity production by source and use, district heating, industry's share; travel: car share of trips, public transport, cars per 1 000, commuting; the fastest train to the capital and what is planned; airports; tourist travel |
| samhalle-halsa | the population projection (the municipality's or SCB's), ageing, migration; the regional health survey (participation, loneliness, trust, distress); turnout and the council; child poverty; schools; housing and cohousing; associations; safety |
| natur-mat-stad | farmland, farms, livestock, local food, self-sufficiency; forest and nature reserves, red-listed species, green and sealed land in the town; the comprehensive plan, centre plans, housing areas; heritage (listed buildings, national interests) |
| turism-ekonomi | guest nights by year and season, second homes and the summer population, events and attractions; jobs by sector, largest employers, the municipality's finances |
| kommun-plats-historia | the municipality's vision and goals, Agenda 2030 work, climate targets, who governs after the latest election, the challenges and assets it names itself; 15–20 places in the 3D model with coordinates checked against OpenStreetMap; history for a five-generation family chronicle; 6–10 decisions ahead (for the journey) |

Give each agent: the place and municipality code, the topic's list above, the schema (below), the
output paths, and these rules – only numbers seen in a source; own calculations marked `estimate` with
the arithmetic in the note; primary sources first (SCB, SMHI, Kolada, the county administrative board,
the region, the municipality's own documents, the transport administration, VISS); PDFs read in memory,
never saved; the Kolada figures already fetched are not repeated; nothing else in the repository edited.
Never put the user's e-mail address or other personal details in request headers (a User-Agent that
names the project is enough).

### The record schema
```json
{"id": "gastnatter", "sdg": [8, 12], "name_sv": "Gästnätter på kommersiella boenden i Rättviks kommun",
 "value": 226773, "unit": "gästnätter", "year": 2025, "scope": "Rättviks kommun",
 "direction": "context", "source": {"title": "…", "publisher": "…", "url": "https://…"},
 "note_sv": "1–3 meningar: vad siffran är, hur den räknats, förbehåll.", "confidence": "high"}
```
`direction`: context | lower_better | higher_better. `confidence`: high | medium | estimate. ids: ASCII
snake_case, no place name unless needed. English: `{"indicators": {"<id>": {"name", "unit", "note"}}}`.

## 3. The story file

`research/story.json` – the municipality's own vision (`kommun_vision`), 5–7 `challenges` and 5–7
`assets` (each {id, title_sv, text_sv, sdg, sources:[{title,url}]}; the journey shows their first
sentence), `kommun` (name and a paragraph about it), and `en` with the English. Written from the notes.

## 4. Merge and check

```sh
python3 sustainable.py research <slug> merge      # deep/*.json + story.json → research/baseline.json (+ .en.json)
python3 sustainable.py research <slug> check      # the model's FACTS and the indicators' records exist
```
A record that breaks the schema is left out and named. The Kalmar example's baseline is hand-merged and
is never overwritten (the merge refuses).

## 5. From records to the model

Every BASE value in `vision/model.js` names its record in FACTS; values the research could not find are
written as assumptions in the indicator's note (indicators.js) – the site shows the source or the
assumption next to every number. Calibrate PARAMS.growth on the official projection, the climate
`stress` on the county's warming relative to Kalmar's (see Rättvik's levers.js), and the flood module on
the terrain (`node site/tools/flood-map.mjs <slug>`).

## Updating later

Kolada publishes new figures every year: run `research <slug> kolada` again and `merge`; the deep topics
are re-run one at a time when a source changes (a new projection, a new comprehensive plan, an election).
