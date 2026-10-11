# Venezia 2126 – a place outside Sweden

The third place built with sustainable-builder and the first outside Sweden: the historic city of Venice
(the six sestieri and the Giudecca), 47 625 residents at the end of 2025 against 174 808 in 1951, more
tourist beds than residents, and a sea that MOSE already holds back some fifty times a year. The site
speaks Italian and English (`langs: ['it', 'en']`).

- `place.json`, `overrides.json`, `custom/` – the city model: 1.8 km round Rialto and San Marco. The
  terrain is Regione del Veneto's 5 m LiDAR model, read from ARPAV's WMS and calibrated to the Comune's
  table of walkway heights above the tide gauge's zero (`defaults.terrain_datum`, `terrain_hypsometry`).
  Paved ground instead of lawns (`defaults.rest`), a Venetian palette, the `venetian` facade style
  (arched windows in Istrian stone, green shutters, rising damp) and funnel chimneys (`defaults.preset`).
  `custom/` models the landmarks: San Marco, the Campanile and Loggetta, the Doge's Palace, the
  Procuratie, the Libreria and Zecca, the Torre dell'Orologio, the Piazzetta's columns, the Bridge of
  Sighs, the Salute, the Dogana, San Giorgio Maggiore, and the Rialto and Accademia bridges (shared
  drawing code in `custom/lib/vkit.py`; the bridge scripts also clear the generated deck under the arch).
- `vision/` – every module of the site, written in Swedish with English and Italian dictionaries
  (`en/`, `it/`), and the research behind it: 413 sourced records in `research/`, from seven
  deep-research topics. The film (`film.js`) runs 98 s in Italian and English.
- `media/audio/` – the film's narration (Italian: ElevenLabs' "Marco – Deep, Rich and Reflective";
  English: the author's voice) and the soundtrack, `music.mp3` ("Venezia 2126 – Barcarola", Suno v6:
  melodic dub techno with a barcarolle melody and baroque harpsichord).

Build it and look at it:

```sh
python3 sustainable.py example venezia      # the city model and its horizon → cities/venezia/
python3 sustainable.py site venezia         # the site reads its vision from here
```

What is Venice's own: its model (`vision/model.js`, `levers.js`, `indicators.js`) – 17 levers acting on
Venice's measures: homes for Venetians and the short lets, visitors in measure and what they pay (the tourist
tax and the access fee), the port, the boats on electricity, the living lagoon, heat in the campi, solar only
where the heritage allows it; MOSE (`FLOOD.barrier` – the gates close at 110 cm, rise later as the city raises
its quays, close ever more often as the sea rises, and less often and for shorter times with sharper
forecasts), the salt marshes, boats instead of cars (water bus and water taxi lines, gondola and taxi rides on
the canals – `CITY.boats`, `CITY.ride`), and the Vianello family on Campo Santa Maria Formosa.

The landmark work's photographs (openly licensed, from Wikimedia Commons) are not in the repository: the
builder keeps them in `cities/venezia/references/` with their authors and licences.
