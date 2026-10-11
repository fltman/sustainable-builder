# Rättvik 2126 – a place made with this repository

The first place built with sustainable-builder rather than taken from Kalmar 2126: a town of 11 000 by
Lake Siljan in Dalarna – a third of them over 65, and nearly 60 percent more people in summer.

- `place.json`, `overrides.json`, `custom/` – the city model: the place, the refinements of its houses
  (refine-city, from street-level photographs) and the hand-modelled landmarks: Långbryggan, Vasastenen,
  the Dala horse by the station and the church boat.
- `vision/` – every module of the site (see AGENTS.md) and the research behind it: 410 sourced records
  in `research/` – Kolada's key figures, the Sweden-wide ones, and six deep-research topics with their
  notes – and the film's scenes and narration (`film.js`).
- `media/audio/` – the film's narration (ElevenLabs, the author's voice; `film-voices.json` logs each line)
  and the soundtrack, `music.mp3` ("Rättvik 2126 – Midsommarnatt", Suno v6: melodic deep house with a
  Dalecarlian fiddle hook); `sustainable.py example` copies them into cities/rattvik/media/.

Build it and look at it:

```sh
python3 sustainable.py example rattvik      # the city model and its horizon → cities/rattvik/
python3 sustainable.py site rattvik         # the site reads its vision from here
```

What is Rättvik's own: its model (`vision/model.js`, `levers.js`, `indicators.js`) – 18 levers acting on
Rättvik's measures: the summer farms, Siljan's trout, the forest and its mires, wind in the north owned by the
villages (whose power lets the lime works capture its CO₂ long before emissions trading forces it), visitors all
year, summer boat lines between the villages; Siljan as a regulated lake (`FLOOD.kind: 'lake'`, its 100-year
level and the street level from the terrain), the summer people, the train to Stockholm, Classic Car Week, and the
Halvars family's five generations.
