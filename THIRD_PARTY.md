# Third-party data and bundled assets

| What | Where | Source | License / terms |
|---|---|---|---|
| Map data and everything derived from it (cities, packs, the site's map) | `cities/` (not in git) | © OpenStreetMap contributors | ODbL 1.0 – attribute "© OpenStreetMap contributors", share-alike for derived databases |
| Terrain | `cities/*/terrain.json`, packs | Lantmäteriet Markhöjdmodell / Copernicus GLO-30 | CC BY 4.0 / Copernicus licence – keep the attribution (the site shows it) |
| Place search, map download | at runtime | Nominatim, OSM API, Overpass | [Nominatim policy](https://operations.osmfoundation.org/policies/nominatim/), OSM API policy, Overpass fair use |
| Key figures | `cities/*/vision/research/deep/kolada.json` | Kolada (RKA) and its original sources (SCB, the Public Health Agency …) | open data – cite the source (each record does) |
| Research records | `examples/*/vision/research/`, `cities/*/vision/research/`, `pipeline/research/` | the sources each record names | facts with citations; quotes stay short |
| General research evidence | `site/research/vision-research.json` | the research behind Kalmar 2126 (sources per item) | as above |
| Ambient sounds and effects (`site/public/audio/amb-*`, `sfx-*`) | site | generated with ElevenLabs for Kalmar 2126 | ElevenLabs terms of the generating account; **author to confirm before publishing** |
| Default soundtrack (`site/public/audio/music.mp3`) | site | generated with Suno for Kalmar 2126 | Suno terms of the generating account – **author to confirm** |
| People and vehicles (`site/public/models/`) | site | modelled in Blender for Kalmar 2126 | **author to confirm** (suggested: CC BY 4.0) |
| Surface textures (`site/public/textures/`) | site | made for Kalmar 2126 | **author to confirm** |
| Procedural city textures (`cache/textures`) | generated locally | `pipeline/make_textures.py` | same as the code (MIT) |
| npm and Python dependencies | `site/package.json`, `pipeline/web/package.json`, `requirements.txt` | their authors | their own licenses (MIT, Apache-2.0, BSD …) |

Google Street View is used only as a visual reference during refinement rounds; no Google imagery is
stored in this repository or in generated places.
