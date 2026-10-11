# cities/

One folder per place (git-ignored – large and rebuildable, apart from the place's own writing):

| file | made by | edit? |
|---|---|---|
| `place.json` | `sustainable.py new` | yes: centre, size |
| `osm.json`, `terrain.json` | `fetch`, `terrain` (OSM ODbL; Lantmäteriet CC BY 4.0 / Copernicus) | no |
| `city.json`, `city.blend`, `build/` | `prepare`, `blender`, `export` | no – regenerated |
| `pack/` | `tiles`, `pack`, `horizon`, `film` – what the site loads (tiles, map.json, addresses, terrain/flood.*, horizon*, film/, audio/) | no – regenerated |
| `horizon-osm/` | `horizon` – OpenStreetMap's water, woods, homes and buildings round the place (re-used; `--refresh` asks again) | no |
| `media/audio/` | `film-voices`, you – the narration (vo-*.mp3) and the soundtrack (music.mp3) | **yes** (copied into the pack) |
| `overrides.json`, `custom/<id>.py`, `references/`, `refinements.md` | refine-city | **yes** |
| `vision/` | the place's modules and research (AGENTS.md) – `vision init`, then written by you and the agent | **yes** |
| `renders/` | `render`, `look` | review images |

To share a place without the big files, share `place.json`, `overrides.json`, `custom/`, `vision/` and
`media/` (the narration and soundtrack in media/audio/); anyone can rebuild the rest with
`python3 sustainable.py build <slug>`.
