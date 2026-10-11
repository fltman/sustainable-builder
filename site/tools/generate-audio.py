"""Ambience and sound effects (ElevenLabs sound effects v2) and narration (the user's ElevenLabs
dialogue skill, eleven_v4) for Kalmar 2126. Credentials stay on this machine and are never printed;
existing outputs are reused.
python3 tools/generate-audio.py            # everything missing
KALMAR_AUDIO_ONLY=sfx|voice python3 ...    # one kind only
"""
import os, sys, json, importlib.util
from pathlib import Path
from dotenv import dotenv_values

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'public/audio';OUT.mkdir(parents=True,exist_ok=True)
ART=ROOT/'art/audio';ART.mkdir(parents=True,exist_ok=True)
SCRIPT=Path('/Users/andersbj/Projekt/hooklinecoder/.claude/skills/elevenlabs-skill/scripts/generate_dialogue.py')
if not os.environ.get('ELEVENLABS_API_KEY'):
    for path in [Path('/Users/andersbj/Projekt/aipresenter/.env'),Path('/Users/andersbj/Projekt/hooklinecoder/.env')]:
        if path.exists():
            key=dotenv_values(path).get('ELEVENLABS_API_KEY')
            if key:os.environ['ELEVENLABS_API_KEY']=key;break
if not os.environ.get('ELEVENLABS_API_KEY'):sys.exit('ElevenLabs key is not configured locally.')
ONLY=os.getenv('KALMAR_AUDIO_ONLY','')
# The user's own narration voice («pod - Anders Bjarby ok»); override with KALMAR_VOICE_ID.
VOICE=os.getenv('KALMAR_VOICE_ID','B7OAdN7qiPFwZhhjfkxq')

EFFECTS={
 'amb-birds':('Swedish summer town park birdsong: blackbirds, chaffinches, great tits and swallows, some close and some distant, gentle rustle of linden leaves, calm and bright, seamless loop, no voices, no music.',22,True),
 'amb-sea':('Gentle Baltic Sea waves lapping against an old granite harbour quay, soft splashes and small water slaps, light sea breeze, calm summer afternoon, seamless loop, no music, no voices.',22,True),
 'amb-market':('Lively outdoor food market on a town square in Sweden: murmur of many people talking and laughing at a distance, plates and cutlery at long wooden tables, footsteps on cobblestones, children playing far away, seamless loop, no music.',22,True),
 'amb-night':('Warm Nordic summer night in a town garden: crickets and grasshoppers, a few distant soft voices and laughter, gentle breeze in trees, very calm, seamless loop, no music.',22,True),
 'amb-traffic':('Small town street traffic: cars passing at low speed, distant engines, tyres on wet asphalt, a bus pulling away, no horns, seamless loop, no music.',22,True),
 'amb-wind':('Soft wind high above a coastal town, airy and calm with gentle gusts, a few distant seagulls, seamless loop, no music, no voices.',22,True),
 'sfx-bell':('A single strike of a large old church bell in a stone tower, rich bronze tone with long resonant decay, heard outdoors from a town square.',7,False),
 'sfx-bikebell':('A single friendly double ring of a classic bicycle bell, close, outdoors.',1.2,False),
 'sfx-gulls':('Three or four seagull calls overhead near a harbour, outdoors, light wind.',4,False),
 'sfx-decade':('A warm, hopeful short transition swell: soft airy chime and a gentle rising whoosh, like time passing, clean and modern, no voices.',2.5,False),
 'sfx-event':('A short soft notification tone: two gentle wooden marimba notes, calm and clear, clean, no reverb tail.',1,False),
}
# Narration: the journey intro (its own words, so it is not mistaken for the film) and the film
# voice-over, written for the ear.
LINES={
 'vo-journey':'[warm, calm] Välkommen till Resan. Kalmar har planer fram till tjugohundrafemtio – men ingen har skrivit ner hur vi vill leva här om hundra år. Det får du göra nu, årtionde för årtionde, tillsammans med släkten Ek. [pause] Läs vad staden brottas med och vad den kan bygga på – och gör sedan dina första vägval.',
 'vo-film-1':'[warm, calm] Det här är Kalmar i dag. Sjuttiotre tusen invånare, bilar på varannan gata – och ett hav som blir grönt varje sommar.',
 'vo-film-2':'[thoughtful] Men hur vill vi egentligen leva här om hundra år? Tillsammans med våra barn, barnbarn och grannar?',
 'vo-film-3':'[warm] Kalmar tjugoett tjugosex försöker svara – med forskningen och kommunens egen statistik, år för år. Taken börjar odla och ge el. Gatorna blir trädgårdar. Havet får tillbaka sin färg.',
 'vo-film-4':'[warm] Där det var parkering växer det mat. Och på Stortorget äter grannar tillsammans igen.',
 'vo-film-3b':'[warm] Kalmar tjugoett tjugosex räknar fram ett svar, år för år – ur forskningen och kommunens egen statistik. Varje vägval syns i staden.',
 'vo-film-4b':'[warm, quietly amazed] Där parkeringarna låg växer nya kvarter i trä. Vid stationen odlar ett torn mat året runt, och Kvarnholmens gator har blivit trädgårdar.',
 'vo-film-5b':'[calm, wonder] Havet steg – så vi lärde oss att bo på det. Båtarna går tyst på el, fartygen seglar igen, och vattnet i Kalmarsund är klart.',
 'vo-film-5':'[calm, sincere] Det är ingen prognos. Det är ett sätt att tänka – och att välja. [pause] Vilket Kalmar vill du bygga?',
 # English: the journey intro and the film (tools/film.mjs FILM_LANG=en), same voice, numbers written out.
 'vo-journey-en':'[warm, calm] Welcome to the Journey. Kalmar has plans up to twenty fifty – but nobody has written down how we want to live here in a hundred years. That is up to you now, decade by decade, together with the Ek family. [pause] Read what the town is up against and what it can build on – then make your first choices.',
 'vo-film-1-en':'[warm, calm] This is Kalmar today. Seventy-three thousand people, cars on every other street – and a sea that turns green every summer.',
 'vo-film-2-en':'[thoughtful] But how do we really want to live here in a hundred years? Together with our children, grandchildren and neighbours?',
 'vo-film-3b-en':'[warm] Kalmar twenty-one twenty-six works out an answer, year by year – from the research and the municipality\'s own statistics. Every choice shows in the city.',
 'vo-film-4b-en':'[warm, quietly amazed] Where the car parks were, new timber blocks are growing. By the station a tower grows food all year round, and the streets of Kvarnholmen have become gardens.',
 'vo-film-5b-en':'[calm, wonder] The sea rose – so we learned to live on it. The boats run quietly on electricity, the ships sail again, and the water in Kalmar Sound is clear.',
 'vo-film-5-en':'[calm, sincere] It is not a forecast. It is a way of thinking – and of choosing. [pause] Which Kalmar do you want to build?',
}
from elevenlabs import ElevenLabs
client=ElevenLabs(api_key=os.environ['ELEVENLABS_API_KEY'])
if ONLY in ('','sfx'):
    for name,(prompt,duration,loop) in EFFECTS.items():
        path=OUT/f'{name}.mp3'
        if path.exists():continue
        print('Sound effect:',name,flush=True)
        data=client.text_to_sound_effects.convert(text=prompt,duration_seconds=duration,prompt_influence=.45,model_id='eleven_text_to_sound_v2',loop=loop)
        path.write_bytes(b''.join(data))
if ONLY in ('','voice'):
    spec=importlib.util.spec_from_file_location('elevenlabs_dialogue_skill',SCRIPT)
    skill=importlib.util.module_from_spec(spec);spec.loader.exec_module(skill)
    for name,text in LINES.items():
        output=OUT/f'{name}.mp3'
        if output.exists():continue
        print('Narration:',name,flush=True)
        inp=ART/f'{name}.json';inp.write_text(json.dumps([{'text':text,'voice_id':VOICE}],ensure_ascii=False,indent=2))
        sys.argv=[str(SCRIPT),'--input',str(inp),'--output',str(output),'--model','eleven_v4']
        skill.main()
(OUT/'generation.json').write_text(json.dumps({'sfx_model':'eleven_text_to_sound_v2','voice_model':'eleven_v4','voice_skill':str(SCRIPT),'voice_id':VOICE,
  'effects':{k:v[0] for k,v in EFFECTS.items()},'lines':LINES},ensure_ascii=False,indent=2))
print('KALMAR_AUDIO_COMPLETE')
