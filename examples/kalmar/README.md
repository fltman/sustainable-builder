# Kalmar 2126 – the reference place

`vision/` is every module of Kalmar 2126 and its research: the place the engine in `site/` was taken
from. The golden test (`site/test/golden/kalmar-model.json`, run with `CITY=kalmar npm test` in
`site/`) checks that the engine still gives Kalmar 2126's model exactly: every vision in all three
climate worlds, the uncertainty bands and the events.

The 3D city is Kalmar 2126's own, not this pipeline's: it comes from the Kalmar game's map. To see
the example in the browser, put Kalmar 2126's city files (its `public/` folder: `tiles/`, `map.json`,
`addresses.json`, `horizon*`, `terrain/`, `audio/`, `film/`, `art/`, `og.jpg`) in `cities/kalmar/pack/`,
then `python3 sustainable.py site kalmar`.

A place made with this repository is built with `python3 sustainable.py make "<place>"`; Rättvik
(`examples/rattvik`) is one, and can be built from its example with `python3 sustainable.py example rattvik`.
