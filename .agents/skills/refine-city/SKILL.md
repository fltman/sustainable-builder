---
name: refine-city
description: Improvement rounds for a generated city — correct individual houses, a whole street, a district or the whole town (heights, storeys, roof shapes, colours, materials, shopfronts, road surfaces) from Google Street View survey rounds, satellite views, photos found online and the user's own photos, and hand-model landmarks in Blender. Use when the user says a building/street looks wrong, asks to "förbättra/förfina Storgatan", "make the cathedral look right", "run a refinement pass", or wants more realism in a built city.
---

# Refine a city from Street View

The generator guesses where OpenStreetMap is silent (storeys, colours, roofs). A refinement round
replaces guesses with observations, the way the kalmar-kvarnholmen project improved its town pass by
pass. Three levels, cheapest first:

1. **Overrides** — corrected facts per building/area/street in `cities/<slug>/overrides.json`.
2. **Area rules** — one setting for every building inside a polygon or radius.
3. **Custom models** — a Blender script per landmark in `cities/<slug>/custom/<building id>.py`.

## Two kinds of work

- **Known buildings and places** (church, station, town hall, a landmark the user names): find photos
  online and model them by hand as custom scripts. See *Landmarks from photos* below.
- **The many ordinary houses**: Street View survey rounds with `sustainable.py survey`, facts into
  overrides.json, housekit starter scripts with `sustainable.py seed`, then hand edits. See *Survey
  rounds* below.

## Survey rounds (many houses at once)

```sh
python3 sustainable.py survey <slug> plan --out /tmp/<slug>-sv     # or --street "Storgatan" / --near "Torget"
# open each printed Street View link, screenshot it, save as /tmp/<slug>-sv/<index>.jpg
python3 sustainable.py survey <slug> compare /tmp/<slug>-sv         # sheets/*.jpg: frame above model, ids labelled
```
- `plan` covers every house that has no observation yet: no overrides entry, or a script still marked
  "not surveyed yet". Viewpoints are chosen so each sees as many such houses as possible, nearest the
  centre first.
- Keep the frames outside the repository; Street View imagery is a reference only.
- `compare` renders the model from the same eye (2.5 m over the terrain, 90°, pitch 8°) with an ID pass.
  On each sheet the plan's targets are yellow, and `labels.json` maps the short labels to ids.
- Write one overrides entry per house you can see clearly. Use `style`, `colour`, `roof`,
  `roof_style`/`roof_colour` and `building:levels`, plus a `note` in plain words: "falu red two-storey
  timber house, white external stair to an upper gallery, red tile roof, chimney". The seeder reads
  the note: balconies, galleries, porches, verandas, dormers, cross gables, garages, signs and more.
- When most houses in a district share a look, also set its area mixes.
- Then:
  ```sh
  python3 sustainable.py seed <slug> --ids w1,w2,… --force   # housekit starter scripts from the notes
  python3 sustainable.py rebuild <slug>
  python3 sustainable.py survey <slug> compare /tmp/<slug>-sv   # again: compare after the change
  ```
- Hand-edit the scripts where the photo shows more than the note says (signs, shop names, two-tone
  walls, stair towers). Replace the "Starter script…" docstring line when you do, so later seeding
  keeps your edit.
- Repeat rounds (the next `plan` skips what is done) until the user is happy or says stop.

## Landmarks from photos

Ask the user whether to search for pictures online. Where to look:
- Wikimedia Commons (`https://commons.wikimedia.org/w/index.php?search=<landmark>`).
- For Swedish places: DigitaltMuseum, Kringla, the municipality, and the church or railway history
  pages.
- The user's own photos in `cities/<slug>/references/`.

How to use them:
- Keep openly licensed pictures in `cities/<slug>/references/<landmark>/`, with author, licence and
  URL in `references/SOURCES.md`.
- Pictures that may only be looked at (no open licence) are used to measure from and are not stored.
- Collect facts in `references/<landmark>/NOTES.md`: architect, year, materials, number of bays and
  storeys, tower heights, roof shape.
- Then write `custom/<id>.py` (see *Custom models for landmarks*).
- Compare renders from the photo's viewpoints, and adjust over two or three iterations.

## A round, step by step (a street or a single building)

1. **Scope** with the user: one street, a square and its surroundings, or a single landmark. Keep a
   round to ~5–25 buildings.
2. **List what the generator made:**
   ```sh
   python3 sustainable.py buildings <slug> --street "Strandgatan" --json
   python3 sustainable.py buildings <slug> --near "Stora torget" --radius 80 --json
   ```
   Each row: id, name, kind, levels, height, wall style/colour, roof, a Street View link aimed at the
   facade (`view.streetview`) and a Blender camera spec (`view.render`).
3. **Look at reality.** With a browser tool open each Street View link and take a screenshot; for
   roof shapes use the satellite view `https://www.google.com/maps/@<lat>,<lon>,60m/data=!3m1!1e3`.
   Count storeys, note wall colour/material, roof shape and colour, shopfronts, towers, gables.
   Street View is a visual reference only: do **not** save Google imagery into the repository.
   **Photos and other pictures:** look in `cities/<slug>/references/` for the user's own photos,
   drawings or postcards (ask what each shows if the file name doesn't say). Openly licensed photos can
   be found on Wikimedia Commons (`https://commons.wikimedia.org/w/index.php?search=<landmark>`); if you
   download one, keep it in `references/` with its licence and author in `references/SOURCES.md`.
   Ask the user for local knowledge when something is unclear — it often beats any picture.
4. **Write overrides** (merge into the existing file, keep earlier entries):
   ```json
   {
     "buildings": {
       "w564108911": {"building:levels": 3, "height": 11.5, "roof:shape": "gabled", "roof:colour": "#7a3b2e",
                      "style": "stone", "colour": "limestone", "note": "Street View 2026-10: stepped gable, limestone"},
       "w455294740": {"building:colour": "#e3c58f", "building:material": "plaster", "roof:shape": "hipped"},
       "w455294757": {"hide": true, "note": "demolished"}
     },
     "areas": [
       {"center": [57.6405, 18.2930], "radius": 60, "buildings": {"roof:shape": "gabled", "style": "plaster"}},
       {"polygon": [[57.64, 18.29], [57.641, 18.29], [57.641, 18.292]], "buildings": {"building:levels": 2}}
     ],
     "roads": {"Strandgatan": {"surface": "sett", "width": 7}, "w123456": {"sidewalk": "no"}}
   }
   ```
   Building keys: any OSM tag (`building:levels`, `height`, `min_height`, `roof:shape` = flat|gabled|hipped|pyramidal,
   `roof:height`, `roof:colour`, `roof:material`, `building:colour`, `building:material`), plus
   `style` (plaster, brick, wood, stone, concrete, glass, metal), `colour` (a palette name from
   `pipeline/style.json` for that style, `colours` or `extra_colours`), `roof` (flat|gabled|hipped|pyramidal),
   `roof_style` (tiles|metal|slate) with `roof_colour` (a palette name), `shopfront` (true/false: shop
   windows on the ground floor), `hide`, `no_tower`, and free-text `note`. Specific building entries win
   over area rules. A top-level `"defaults": {"max_levels": 3}` caps the *estimated* storeys of buildings
   OSM says nothing about (small towns); `"defaults": {"terrain": false}` builds the city flat and
   `"defaults": {"terrain_scale": 1.5}` exaggerates the hills (1 = real).
   Area rules can mix instead of fixing one look, so a villa district gets a believable spread:
   `"look_mix": {"brick/red": 3, "wood/white": 3, "wood/falu": 2}` (style/colour pairs),
   `"roof_look_mix": {"tiles/dark": 4, "tiles/red": 3}`, `"roof_mix": {"gabled": 3, "hipped": 1}`, any
   `"<key>_mix"`, plus `"max_levels"` and `"levels_mix": {"1": 3, "2": 2}` (houses ≥ 60 m² only, never
   sheds). Picks are deterministic per building. Sample 3–5 Street View frames per district to set them.
   Matching a Street View frame to building ids: render the model from the same spot and heading
   (`street:x,y,heading`, `WB_EYE=2.5 WB_PITCH=8 WB_LENS=18` for a 90° view) and compare side by side.
   Road keys: `surface` (asphalt, sett, paving_stones, gravel …), `width`, `sidewalk` (both|left|right|no), `hide`.
5. **Rebuild and compare:**
   ```sh
   python3 sustainable.py rebuild <slug>                       # ~1 min, keeps OSM data and media
   python3 sustainable.py render <slug> --street "Strandgatan" # street-level views → cities/<slug>/renders/
   ```
   Put each render next to its Street View screenshot and adjust. Two or three iterations are normal.
   Street cameras stand on the terrain (eye height over the ground). A building sits on its `base`
   (a little above its lowest corner) with a concrete foundation down the slope; custom scripts draw
   from z = 0 as before and are lifted as one piece.
6. **Log the round** in `cities/<slug>/refinements.md`: date, scope, what changed and why (Street View
   date/heading, which photo in `references/`, user knowledge). This is the project's memory for later rounds.

## Custom models for landmarks

When overrides are not enough (a cathedral with two towers, a castle, a stepped gable), write
`cities/<slug>/custom/<id>.py`. It replaces the generated building with that id at the next rebuild.
Start from `docs/custom-building-example.py`. The script gets `ctx`:
- `ctx.footprint` — `{'outer': [[x, y], …], 'holes': […]}` in metres (x east, y north), `ctx.b` — the generated record
- `ctx.geo` — draw with `.prism(ring, z0, z1, mat)`, `.box((x, y, z), (w, d, h), mat, angle)`,
  `.wall(a, b, z0, z1, mat)`, `.cyl(x, y, z, r, h, mat, seg, r2)`, `.polygon(ring, z, mat)`, `.quad(pts, mat)`
- materials: roles `'upper'`, `'ground'`, `'blank'`, `'roof'`, `'flat'` (the building's own colours) or
  any library name, e.g. `'M_Roof_Metal_copper'`, `'M_StoneWall'`, `'M_Wall_Stone_limestone_Blank'`

Facade textures repeat per window bay (≈3.2 m) and storey (3 m), so draw walls with `ctx.geo.wall`
using `uvscale` ≈ 3 to keep windows the right size. Keep custom models under ~20 000 triangles; the
site streams them like any tile. Rebuild and render as above.

## Done

Summarise the round for the user (buildings changed, before/after renders in `cities/<slug>/renders/`),
then `python3 sustainable.py play <slug>` if they want to drive it.

## Ordinary houses: housekit

For the many plain town houses, don't write geometry by hand: `pipeline/blender/housekit.py` turns a
short description into a detailed house on the OSM footprint (real window openings with reveals, glass,
frames and sills, corner boards, plinth, cornice, party walls left blank, street-side shopfronts with a
sign band and striped awnings, gabled/hipped/mansard/flat roofs per rectangle of an L- or T-plan with
fascias and gutters, dormers, a frontkvist/cross gable, chimneys, balconies, verandas, sign text).
```python
# cities/<slug>/custom/<building id>.py
import housekit
h = housekit.House(ctx, levels=2, wall='M_Wall_Wood_petrol_Blank', trim='M_Wall_Wood_white_Blank', shop=True)
h.facades(window=(1.3, 1.5), pitch=2.6, sign_mat='M_Wall_Metal_blue_Blank', awnings=['M_Roof_Metal_red', 'M_Wall_Wood_white_Blank'])
h.roof(shape='gabled', pitch=24, mat='M_Roof_Metal_black')          # 'hipped', 'mansard', 'flat'; ridge='short' turns it
h.cross_gable(frac=0.22, width=5.0, pitch=52)                        # on the street side
h.dormers([0.3, 0.7], side='street'); h.chimney(0.12, 0.45)
h.balcony(wall_index, x=4.0, storey=2, glass=True); h.sign('Conditori', size=0.6, mat='M_Roof_Metal_red')
h.gallery(wall_index, 4.0, 12.0, stair='left')                       # loftgång with an outside stair
h.porch(wall_index, x=6.0, roof_mat='M_Roof_Tiles_red')               # gabled entrance porch (facades(skip=…))
```
Starter scripts for many houses at once come from the overrides notes:
`python3 sustainable.py seed <slug> --ids w1,w2 --force` (`--unsurveyed` also seeds every other house from
its generated look, marked "not surveyed yet"). `--force` only replaces untouched starter scripts. When
you edit a script by hand, replace the "Starter script…" line in its docstring, and the seeder will
keep it.
Street sides are found from the city's roads; pass `street=[wall_index]` when the guess is wrong (a
building beside a square). Check each house from the street in front of it, compare with the Street
View frame, adjust, repeat.
