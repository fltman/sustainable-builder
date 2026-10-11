# Rättvik 2126 – a place made with this repository

The first place built with sustainable-builder rather than taken from Kalmar 2126: a town of 11 000 by
Lake Siljan in Dalarna – a third of them over 65, and nearly 60 percent more people in summer.

- `place.json`, `overrides.json`, `custom/` – the city model: the place, the refinements of its houses
  (refine-city, from street-level photographs) and the hand-modelled landmarks: Långbryggan, Vasastenen,
  the Dala horse by the station and the church boat.
- `vision/` – every module of the site (see AGENTS.md) and the research behind it: 410 sourced records
  in `research/` – Kolada's key figures, the Sweden-wide ones, and six deep-research topics with their
  notes – and the film's scenes and narration (`film.js`).

Build it and look at it:

```sh
python3 sustainable.py example rattvik      # the city model and its horizon → cities/rattvik/
python3 sustainable.py site rattvik         # the site reads its vision from here
```

What is Rättvik's own: Siljan as a regulated lake (`FLOOD.kind: 'lake'`, its 100-year level and the
street level from the terrain), the summer people (`LOCAL.step`), the train to Stockholm, the summer
farms, Classic Car Week, the lime works' emissions, and the Halvars family's five generations.
