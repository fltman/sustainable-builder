"""Voice a place's film narration with ElevenLabs (text to dialogue).

    python3 sustainable.py film-voices <slug> [--lang sv,en] [--only vo-film-1] [--force]

Reads the voiced lines from cities/<slug>/vision/film.js (SPOKEN.sv / SPOKEN.en, with audio tags and
numbers written out; VOICE = {id, model} picks the narrator) and writes cities/<slug>/media/audio/<id>.mp3
and <id>-en.mp3 (the source; the pack step copies them into pack/audio/, and so does this script), with a
log of each line's text hash so unchanged lines are never paid for twice.
Needs ELEVENLABS_API_KEY (.env). Generation costs credits: the agent asks before running it.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import shutil
import subprocess

from common import ROOT, say, write_json

FALLBACK_MODELS = ['eleven_v3', 'eleven_multilingual_v2']
DEFAULT_VOICE = 'B7OAdN7qiPFwZhhjfkxq'   # Kalmar 2126's narrator


def film_of(slug: str) -> tuple[dict, dict, object]:
    """SPOKEN and VOICE from the place's film.js (an ES module, read through Node), and the pack folder."""
    for base in (ROOT / 'cities', ROOT / 'examples'):
        film = base / slug / 'vision' / 'film.js'
        if film.exists():
            break
    else:
        raise SystemExit(f'No film yet: write cities/{slug}/vision/film.js (the build-sustainable skill, "Film").')
    node = shutil.which('node') or 'node'
    js = f"const m=await import({json.dumps(film.as_uri())});console.log(JSON.stringify({{spoken:m.SPOKEN||{{}},voice:m.VOICE||{{}}}}))"
    out = subprocess.run([node, '--input-type=module', '-e', js], capture_output=True, text=True, check=True).stdout
    data = json.loads(out)
    return data['spoken'], data['voice'], ROOT / 'cities' / slug


def main(argv=None):
    ap = argparse.ArgumentParser(prog='sustainable.py film-voices')
    ap.add_argument('slug')
    ap.add_argument('--lang', default='sv,en')
    ap.add_argument('--only')
    ap.add_argument('--force', action='store_true')
    args = ap.parse_args(argv)
    spoken, voice, city = film_of(args.slug)
    voice_id = os.environ.get('ELEVENLABS_VOICE_ID') or voice.get('id') or DEFAULT_VOICE
    model = voice.get('model', 'eleven_v3')
    audio_dir = city / 'media' / 'audio'
    audio_dir.mkdir(parents=True, exist_ok=True)
    pack_audio = city / 'pack' / 'audio'
    pack_audio.mkdir(parents=True, exist_ok=True)
    log_path = audio_dir / 'film-voices.json'
    log = json.loads(log_path.read_text()) if log_path.exists() else {}
    if 'ELEVENLABS_API_KEY' not in os.environ:
        raise SystemExit('ELEVENLABS_API_KEY is not set (.env). The film works without narration, or record your own audio/<id>.mp3.')
    from elevenlabs import ElevenLabs
    client = ElevenLabs(api_key=os.environ['ELEVENLABS_API_KEY'])
    for lang in args.lang.split(','):
        for name, text in (spoken.get(lang) or {}).items():
            if args.only and name not in args.only.split(','):
                continue
            file = f'{name}{"-en" if lang == "en" else ""}'
            key = hashlib.sha256(f'{voice_id}|{model}|{text}'.encode()).hexdigest()[:16]
            out = audio_dir / f'{file}.mp3'
            if out.exists() and log.get(file, {}).get('hash') == key and not args.force:
                say(f'  ✓ {file} (unchanged)')
                continue
            audio, last, used = None, None, model
            for m in [model] + [x for x in FALLBACK_MODELS if x != model]:
                try:
                    audio = b''.join(client.text_to_dialogue.convert(inputs=[{'text': text, 'voice_id': voice_id}], model_id=m))
                    used = m
                    break
                except Exception as exc:  # unknown model or plan limits: try the next one
                    last = exc
            if not audio:
                raise SystemExit(f'ElevenLabs failed for "{file}": {last}')
            out.write_bytes(audio)
            shutil.copy2(out, pack_audio / out.name)
            log[file] = {'hash': key, 'model': used, 'voice_id': voice_id, 'text': text}
            say(f'  ♪ {file}: {len(audio) // 1024} KB ({used})')
    write_json(log_path, log)
    say(f'Narration ready in {audio_dir} (and the pack).')


if __name__ == '__main__':
    main()
