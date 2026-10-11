---
name: elevenlabs
description: The narrator for a place's vision site with ElevenLabs – the film's narration and the journey's opening line, in Swedish and English; choosing or describing a narrator voice; and ambient sounds or effects. Use when the user wants a narrator, a different voice, new narration after the film's text changes, or new ambience.
---

# ElevenLabs: the narrator and sounds

Needs `ELEVENLABS_API_KEY` in `.env` (https://elevenlabs.io/app/settings/api-keys). Generation costs
credits: tell the user what will be generated (number of lines, roughly how many characters) and get a
yes before the first paid call. Without a key the film plays with music and ambience only.

## The film's narration

The lines live in `cities/<slug>/vision/film.js`:
- `SPOKEN.sv` / `SPOKEN.en` – each clip as voiced: audio tags in brackets steer delivery (`[warm, calm]`,
  `[thoughtful]`, `[pause]`), numbers and years written out ("tjugoett tjugosex"), local names spelled as
  they should sound;
- `LINES` – the same clips as written, for the subtitles;
- `VOICE` – `{id, model}` (default: Kalmar 2126's narrator, `eleven_v3`).

```sh
python3 sustainable.py film-voices <slug>                      # every new or changed line, both languages
python3 sustainable.py film-voices <slug> --only vo-film-1 --force
```
Files land in `cities/<slug>/media/audio/vo-*.mp3` (`-en` for English), with a log of each line's hash so
unchanged lines are never paid for twice. The journey plays `vo-journey(-en).mp3` from the same folder
when it exists. Writing tips: one idea per clip, 4–10 seconds spoken, plain words; listen to every clip
and regenerate the ones that stumble over a name.

## Choosing a voice

- Keep the default narrator, or set `VOICE.id` in film.js (or `ELEVENLABS_VOICE_ID` in `.env`).
- To find voices: `.venv/bin/python -c "from elevenlabs import ElevenLabs;import os;c=ElevenLabs(api_key=os.environ['ELEVENLABS_API_KEY']);[print(v.voice_id,v.name,(v.labels or {})) for v in c.voices.search(page_size=30).voices]"`
  (load `.env` into the environment first, e.g. `set -a; . ./.env; set +a`).
- To describe a new voice for ElevenLabs Voice Design, write a 300-character description: tone,
  pitch, pace, texture, emotion, accent, special qualities – e.g. *"Warm, calm Swedish voice, middle-aged,
  unhurried and close, like a radio documentary narrator; clear diction, a little smile in it…"* Count the
  characters; exactly 300 reads best in their UI.

## Longer dialogue

`scripts/generate_dialogue.py` takes a JSON array of `{"text", "voice_id"}` items (several voices
allowed), splits it into ≤2000-character chunks, caches each chunk by content hash and joins the
result (ffmpeg or pydub): `.venv/bin/python .agents/skills/elevenlabs/scripts/generate_dialogue.py -i lines.json -o out.mp3 --model eleven_v3`.

## Ambience and effects

The site's ambience (`site/public/audio/amb-*.mp3`: birds, sea, market, night, traffic, wind) and effects
(`sfx-*.mp3`) are shared by every place. A place that needs its own (a lake rather than a sea, church
bells) can put the same file name in `cities/<slug>/media/audio/` (copied into the pack) – the place's file wins. Generate with
`scripts/sound_effects.py` (edit its prompts first).
Prompt advice and API parameters (duration 0.5–30 s, `loop` for seamless loops, `prompt_influence`):
`references/sound-effects.md`. Keep effects dry, isolated, "no music, no voices".
