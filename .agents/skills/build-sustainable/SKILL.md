---
name: build-sustainable
description: Turn a real place (town, district or village) into a research-based vision site of its next hundred years, like Kalmar 2126 — OpenStreetMap + terrain → Blender city → web tiles, deep research into sourced facts (Kolada for Swedish municipalities), the model's starting values, places, visions, a family chronicle, a decade-by-decade journey, and optionally a film, a narrator and music. Use when the user names a place to build ("bygg Ystad 2126", "make Visby", "skapa en vision för min ort"), wants another place, or asks to continue or finish one. Not for refining individual houses (refine-city) or the research method itself (research-city).
---

# Build a sustainable place, a century ahead

Everything runs through `python3 sustainable.py` in the repository root. Read `AGENTS.md` once for the
layout and the engine's contract. Speak the user's language; keep them posted with one short line per
stage. The finished examples are `examples/kalmar/vision/` (a coastal city: sea level, a bridge, a
university) and `cities/rattvik/vision/` (an inland town by a regulated lake: summer guests, fäbodar, an
old population). Start from the one that is most like the new place.

## 0. First time on this machine

```sh
python3 sustainable.py doctor
```
Python, Node, Blender, the site's packages and a browser for `look`. Re-run until it says **Ready**.

## 1. Pin down the place

```sh
python3 sustainable.py new "<place>" --size medium      # small 600 m · medium 1000 m · large 1600 m · or metres
```
Show the user the hit (`display_name`) and the OpenStreetMap link. Several plausible hits: ask which,
then `--pick N`, or `--center lat,lon` for an exact centre (the square, the station). A small town
centre fits medium; a town on a shore large enough to show the water and both ends of the centre.

## 1b. Ask once, up front

Right after the place is pinned, ask everything that needs the user in one round (the question tool,
at most four questions per call, multiSelect where several answers fit). Then work through without
stopping, and note the answers at the top of `cities/<slug>/vision/README.md`.

1. **Languages.** Swedish and English (default), or the place's language and English.
2. **Terrain.** Swedish place without `LANTMATERIET_USER` in `.env`: Lantmäteriet's 1 m ground model
   (free; a Geotorget account and a free order – the user does both themselves) or Copernicus now
   (automatic, 30 m). Elsewhere Copernicus is used; only mention it.
3. **Media – each optional; the paid ones need a yes:**
   - **a film** (1½–2 minutes: the place today, the research-based vision growing year by year, the
     visions side by side, an end card), rendered from the site itself – free to render; narration and
     music below are what cost;
   - **a narrator** for the film and the journey (ElevenLabs, credits);
   - **a soundtrack** of its own (Suno, the user's credits) – otherwise the bundled one plays;
   - **a link-preview image** (imagegen, or a render from the site – free).
4. **Refinement of the buildings:** none; known landmarks from photos; Street View rounds for the
   centre; Street View rounds until the user says stop (the **refine-city** skill).

## 2. Build the city

```sh
python3 sustainable.py build <slug>        # 1–5 minutes; run it in the background and wait
python3 sustainable.py render <slug>       # look at the images: streets, roofs, water, landmarks
```
A sustainable place's unmapped land is grass and it has no edge wall. Wrong area (mostly fields, a
cut-off centre)? Adjust `new` and build again. Lantmäteriet terrain: see the refine-city skill's notes
and `AGENTS.md` (the user types passwords into `.env` themselves; never ask for them in chat).

## 3. Research – the starting point

Follow the **research-city** skill. In short:
```sh
python3 sustainable.py research <slug> kolada     # Swedish municipalities: ~70 key figures, sourced
```
then deep research in parallel (one agent per topic: climate and water, energy and travel, society and
health, nature/food/town plans, tourism and economy, the municipality's own plans, places and history),
each writing `cities/<slug>/vision/research/deep/<topic>.json` (+ `.en.json`, `-notes.md`) in the
baseline schema; `research/story.json` with challenges, assets and the municipality's vision; then
```sh
python3 sustainable.py research <slug> merge      # → research/baseline.json (+ .en.json)
```

## 4. The vision – the place's modules

**Place first** (`AGENTS.md`, *Place first*): the place's levers, measures, calculations and what may be seen
in 3D come from its own conditions and research – not from Kalmar's. Before writing texts, list from the
research what this place can decide, what matters and can be counted there, how each lever acts (sized by
local research where it exists, cited general research where not), and what can physically change in its
streets, roofs and water. An example's model is that example's: a new place writes its own.

`python3 sustainable.py vision <slug> init` starts `cities/<slug>/vision/` empty – the place's own records, no
levers, no visions, nothing from an example – and the site runs at once; then write each module from the
research (the contract for every file is in `AGENTS.md`):

| file | what | from |
|---|---|---|
| `config.js` | names (sv/en), latitude, the model's water level, camera, squares, station, protected landmarks, boats, credits | place.json, city.json (`water_z`, `terrain.lake`), map.json, the research |
| `levers.js` | the place's own levers (LEVER_DEFS: what it can decide, four levels each, cost and pace), its climate in three worlds, the research each lever leans on | the research: challenges, assets, local studies |
| `indicators.js` | the place's own measures (INDICATOR_DEFS), their names, notes and `base` records; KEY_FIGURES | the research |
| `model.js` | BASE (starting values, each with its record in FACTS) and the place's own model: init, step (each lever's effects, sized by the research), vision (only what can physically show there), SDG_PARTS, doughnut, EXPECT; FLOOD (`node site/tools/flood-map.mjs <slug>` prints the table and the street level) | research/baseline.json, research/evidence.json |
| `presets.js` | the research-based vision first, then two that contrast with it | the research |
| `places.js` | 12–20 real places in the model with now/future texts | research notes (coordinates through the pipeline's projection) |
| `people.js` | today's jobs, the levers' new jobs, what people say | the research |
| `family.js`, `decisions.js`, `vision-text.js`, `events.js`, `changes.js`, `ar.js` | the family over five generations, the journey's dilemmas per decade, the vision document, the events, the visible changes, the AR spots | the research and the model |
| `en.js` (+ `en/*.js`) | English for every Swedish string passed to `L()` | |

Calibrate and check:
- Today's course follows the official population projection; the research-based vision beats today's
  course clearly by 2126; EXPECT says what each lever does, and the tests hold the model to it.
- In the 2126 pictures, every change could physically happen in this place.
- `python3 sustainable.py research <slug> check` – the vision against its research, and Place first: own
  levers and model, visions and dilemmas only on its own levers, nothing borrowed from Kalmar.
- `python3 sustainable.py test <slug>` – the site's tests for the place (the journey, ranges, links …).
- The narrative modules are long; writing them in parallel with one agent each works well (Rättvik's
  were written that way) – each agent edits only its module and its `en/<module>.js`.

## 5. Look at it

```sh
python3 sustainable.py site <slug>          # http://localhost:5230 (run in the background)
python3 sustainable.py look <slug>          # pictures in cities/<slug>/renders/site/ and any errors
```
Look at the pictures: the ground, the roofs (no white or pastel surfaces), the water, the pins at the
right places, the future features where they belong (no boats on land, no timber blocks in the lake).
Then open it in a browser if you have one: start screen, a vision played through the century, the
journey, the family tab, a postcard, the English version.

## 6. Film (when the user said yes in 1b)

1. Write `cities/<slug>/vision/film.js` – start from Kalmar's: `SCENES` (camera paths over the model,
   the vision and years each shows, captions in both languages, the narration clip and when it starts,
   AR callouts, ambience), `END_CARD` (title, question, credits), `LINES` (the narration as subtitles)
   and `SPOKEN` (the narration as voiced: audio tags, numbers written out). Keep the end calm: the
   credits stay over black while the music plays out. The camera moves slowly; no cuts between
   close-ups. Check the camera positions with `look` before rendering.
2. Narration (paid – the user said yes): `python3 sustainable.py film-voices <slug>`.
3. Music (paid – the user said yes): the **suno-music** skill → `cities/<slug>/media/audio/music.mp3` (then `build <slug> --only pack`).
4. `python3 sustainable.py film <slug>` – renders both languages (about 10 minutes each), mixes, and
   writes the web copies, poster and subtitles to `cities/<slug>/pack/film/`. The site finds the film by
   itself (start screen and menu).

## 7. Publish

```sh
python3 sustainable.py publish <slug>       # site/dist/ – upload its contents to any web host
```
Tell the user what was built and what is still an assumption (the records marked `estimate`, the
model's antaganden), and offer the next rounds: refining buildings (refine-city), more research where
the notes list gaps, a film, a narrator.

## Rules

- Every number on the site has a source (research/baseline.json) or is marked as an assumption.
- Never commit or print API keys or passwords; they live in `.env`. The user types passwords themselves.
- Ask before paid generations (narration, music, images) and before accounts, orders or publishing.
- OpenStreetMap data is ODbL; Lantmäteriet's terrain CC BY 4.0: keep the attributions (the site shows them).
- Long commands (build, site, film) go to the background; poll their output.
