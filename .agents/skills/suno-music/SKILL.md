---
name: suno-music
description: A soundtrack for a place's vision site and film with Suno – write Suno-ready style prompts (exactly 300 characters) and tagged lyrics or instrumental structures, the user generates in the Suno web app, and the chosen track becomes the place's music. Use when the user wants music of the place's own for the site or the film.
---

# Suno music for a city

The site and the film play `cities/<slug>/media/audio/music.mp3` (then `build <slug> --only pack`) when present, otherwise the bundled
soundtrack (Sandstorm Pursuit, Iron Tide, Dusk Convoy). Suno has no public API key flow here: songs are
made in the official web app with the **user's own Suno account**.

## 1. Write the song package

For each track give exactly two sections.

**Style description** — exactly 300 characters including spaces, one English paragraph, no line
breaks: genre and subgenre, mood, tempo (BPM), instruments, vocal style. For the site:
instrumental, 120–140 BPM, starts at full energy (no long intro), loopable ending. Count the
characters and adjust adjectives until it is exactly 300. `theme.json` → `music` has a starting point.

Example (300 characters):
```
Instrumental desert-industrial chase music, 132 BPM. Distorted bass, detuned guitar riffs, hammered oil-drum percussion, metallic hits, gritty analog pulses and dark brass. Dusty, tense, relentless. Kick and bass from beat one; no intro, no vocals. Driving combat groove, sparse breaks, loopable end.
```

**Tagged lyrics** — structure tags `[Intro] [Verse] [Pre-Chorus] [Chorus] [Bridge] [Outro]
[Instrumental Break] [Drop]`, vocal tags `[Male Vocal] [Female Vocal] [Whispered] [Spoken Word]
[Harmony] [Ad-lib]`. For instrumentals use only structure tags with `[Instrumental Break]` and leave
Suno's lyrics box empty. A vocal anthem about the town can name its streets and landmarks
(`theme.json` → `facts`) — keep it playful, no real people.

Offer two or three contrasting tracks (e.g. a chase track, a heavier boss-wave track, a dusk cruise).
Save the packages in `cities/<slug>/media/music/prompts.md`.

## 2. Generate on suno.com

- With a browser tool: open https://suno.com/create in the user's browser. The user must already be
  signed in — never enter credentials. Use *Custom* mode, paste the style into *Style of Music*,
  lyrics (or nothing + Instrumental on) and a title. **Ask the user before clicking Create** (it uses
  their credits) and before downloading files.
- Without a browser tool: give the user the packages to paste themselves.
- Suno makes two variations per request; let the user pick. Download as MP3.

## 3. Add to the place

```sh
python3 sustainable.py music <slug> --add ~/Downloads/<file>.mp3 --title "Visby — Ring Wall Run" \
    --source https://suno.com/song/<id> --generator "Suno"
python3 sustainable.py music <slug>            # list
python3 sustainable.py music <slug> --clear    # back to the default soundtrack
```
Any MP3 the user has rights to works the same way.

## Rights

Suno's terms decide who may use the music: on paid plans the user owns the songs; on the free plan
songs are for non-commercial use and Suno keeps ownership. Tell the user before they publish the site
publicly, and keep the `--source` link for attribution.
