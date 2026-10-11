# Sustainable Builder — guide for coding agents (Codex, Claude Code, …)

This repository turns any real place into a research-based vision site of its next hundred years, like
[Kalmar 2126](https://bjarby.com/kalmar-2126/): OpenStreetMap and terrain → an editable Blender city →
streamed web tiles, deep research into sourced facts → a system-dynamics model of the place 2026–2126, its
visions, a family chronicle, a decade-by-decade journey, events, and optionally a film. Users mostly say
*"bygg Ystad"* or *"make a vision for Visby"*; you run the tools, write the place's modules from the
research, judge the results and keep them informed. Answer in the user's language.

## Which skill when

| The user wants … | Skill (`.agents/skills/`, also `.claude/skills/`) |
|---|---|
| a vision site for a place / another place / to continue one | `build-sustainable` |
| research or better sources for a place | `research-city` |
| a street, area or building to look more like reality | `refine-city` |
| a narrator for the film and the journey, sound effects | `elevenlabs` |
| a soundtrack | `suno-music` |
| a link-preview image or poster art | `imagegen` |

## Commands (`python3 sustainable.py …`, stdlib only)

`doctor` · `make "<place>"` (new + build + horizon + Kolada + a first vision) · `new "<place>" [--size …] [--pick N] [--center lat,lon]`
· `build <slug> [--from STEP | --only a,b] [--refresh]` (steps `fetch terrain prepare textures blender export tiles pack splash`)
· `rebuild <slug>` · `horizon <slug> [--refresh]` (the land, lakes, woods and buildings round the play area out to 10 km; OSM answers kept in horizon-osm/) · `research <slug> kolada|merge|check` · `vision <slug> init` · `site <slug>` (dev server :5230, in the background)
· `look <slug>` (pictures of the running site + errors) · `test [slug]` · `film-voices <slug>` · `film <slug>` · `publish <slug>`
· `list` · `status <slug>` · `buildings` · `render` · `survey` · `seed` (refinement, see refine-city) · `selftest`

## Layout

```
sustainable.py          CLI; runs the pipeline in .venv, Blender headless and Node
pipeline/               the city pipeline (from wasteland-builder): place, fetch_osm, fetch_terrain, prepare_city,
                        make_textures, blender/*, web/tiles.mjs, make_pack · horizon.py (the surroundings) · kolada.py (Kolada key figures) ·
                        film_voices.py (ElevenLabs narration) · research/ (kolada-catalogue.json, national-se.json)
site/                   the engine – Kalmar 2126's, place-independent (Vite + three.js): src/ (model, 3D, interface),
                        research/vision-research.json (general evidence), tools/ (look, check-place, init-vision,
                        merge-research, flood-map, film, film-web, smoke), test/ (incl. the Kalmar golden test)
examples/kalmar/vision/ the reference place: every module, research and film (its pack is not in git)
cities/<slug>/          a place (git-ignored): place.json, osm.json, terrain.json, city.json, city.blend, pack/ (tiles,
                        map.json, film/, audio/, terrain/flood.*) – and vision/, the place's own modules (below)
```

## The place's modules (`cities/<slug>/vision/`) – the engine's contract

The engine imports them as `@city/<file>` (site/city.config.mjs picks the place: `CITY=<slug>` or
`site/.city`); they import the engine as `@engine/…`. Kalmar's are complete; Rättvik's show a small inland
town by a regulated lake. `python3 sustainable.py vision <slug> init` writes a first set that runs.

| file | exports | notes |
|---|---|---|
| `config.js` | `CITY` | names in sv/en (name, genitive, kommun, centre, onCentre, model, modelOf, rise, waters), title, url, meta, lat/lon, `water {y, level, kind}`, camera, planRect, heritage, squares, station, floodWall, harbour, floatingQuarter, mussels, turbines, boats, hide, tintMask, materialAlias, credits, film, sources, hotDaysToday |
| `model.js` | `BASE, FACTS, BASE_UNCERTAIN, PARAMS, FLOOD, WATER, WATERS, SPREAD, LOCAL, SDG_PARTS` | starting values (FACTS: the research record of each), parameters over the engine's defaults, the place's own model parts (LOCAL: init, beforePop, pop, step, vision) |
| `levers.js` | `LEVER_TEXT, WORLD_CLIMATE, LEVER_EVIDENCE` | the levers in the place's words; its climate per world (stress, hotDays, seaRise2126, seaPow); research per lever (`base:<id>` for the place's records) |
| `indicators.js` | `INDICATORS, KEY_FIGURES` | names, notes, `base` records over the engine's; the place's own indicators with full metadata |
| `presets.js` | `VISIONS` | the research-based vision first, then contrasting ones |
| `places.js` | `PLACES` | id, name, x, z, kind, now, future, lever, work/care/school/library |
| `people.js` | `jobsToday, jobsFuture, thoughts` | the Sims layer |
| `family.js` | `FAMILY, lifespans, alive, familyText, familyEpilogue, FAMILY_INTRO, FAMILY_TITLE` | five generations |
| `decisions.js` | `DECISIONS, JOURNEY_INTRO` | 3–4 dilemmas per decade 2026–2116 |
| `vision-text.js` | `visionSections(run, year)` | the vision document |
| `events.js` | `EVENTS` | resolve(ctx, r) against the state |
| `changes.js` | `CHANGES, moved, ranked, changeSpec` | what changes visibly, and where |
| `ar.js` | `AR_SPOTS, arSpec` | AR callouts at places |
| `film.js` (optional) | `SCENES, END_CARD, LINES, SPOKEN, VOICE` | the film |
| `en.js` | `EN` | English for every Swedish string passed to `L()` |
| `research/` | baseline.json (+ .en), story.json, evidence.json, deep/ | the starting point and its sources |

Edit the place's **sources** – `vision/`, `overrides.json`, `custom/*.py` – never generated files
(`city.json`, `pack/`, `build/`, `city.blend`; `research/baseline.json` is written by `research merge`).

## Conventions and facts

- Coordinates: metres in the place's own plane, centred on place.json's centre. The pipeline uses x east,
  y north; the site three.js x east, y up, z south (a map point [x, -y]). Projection: 111 320 m per degree
  of latitude, × cos(lat0) for longitude (pipeline/common.py).
- Heights: the model's ground y = 0 stands for the main water's level + 1.2 m (Kalmar: 1.5 m RH 2000); the
  water surface is at y = `water.y`. Real heights (m RH 2000) are in terrain.json and the flood map
  (`node site/tools/flood-map.mjs <slug>` prints the flood table and the level where streets flood).
- Materials: generated packs name them `M_Wall_…`, `M_Roof_…`, `M_Ground_<surface>`, `M_Water`,
  `M_Window_Pane`, `M_Leaf`…; the future shader and the land scan sort them by these names; facades take
  their tint through the texture's alpha (`tintMask`). Unmapped land is grass (`"defaults": {"rest": "ground"}`
  in overrides.json brings back the game's bare ground; `"edge_containers": true` its container wall).
- The model's numbers for Kalmar are frozen by `site/test/golden/kalmar-model.json`: an engine change that
  alters Kalmar's century fails the tests – unless that is the point (then regenerate the golden file and
  say so).
- The camera never moves on its own; show change by marking what is in view.
- Secrets only in `.env` (git-ignored); never print or commit keys or passwords. Ask before paid
  generations (narration, music, images) and before any action on accounts, orders or servers. Never put
  the user's e-mail address in request headers.
- Data: OSM (ODbL), Lantmäteriet (CC BY 4.0) / Copernicus, Kolada (open), SMHI, VISS, SCB – keep the
  attributions; the site shows them.

## Verify your work

- `python3 sustainable.py test kalmar` (the golden test: Kalmar's numbers unchanged) and `test <slug>`.
- `python3 sustainable.py research <slug> check` – every starting value and indicator has its record.
- `python3 sustainable.py site <slug>` + `look <slug>` – look at the pictures, fix what is off.

## Origin

The city pipeline is [wasteland-builder](https://github.com/fltman/wasteland-builder)'s (the git remote
`wasteland` – merge its pipeline improvements from there); the site is the engine of Kalmar 2126
(sustainable-kalmar), both by Anders Bjarby.
