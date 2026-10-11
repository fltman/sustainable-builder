"""Generates the 2126 surface textures with the gemini-imagegen skill (OpenRouter, key from the
environment), then makes each one tileable. Existing outputs are reused.
python3 tools/generate-textures.py"""
import subprocess, sys, os
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
RAW=ROOT/'art/textures/raw'; RAW.mkdir(parents=True,exist_ok=True)
SCRIPT=Path.home()/'.claude/skills/gemini-imagegen/scripts/generate_image.py'
STYLE=(' Seamless tileable texture, orthographic view from directly above, flat even overcast daylight, no cast shadows,'
       ' no perspective, no horizon, no borders or frames, no text, natural irregular variation across the whole image,'
       ' photorealistic, high detail, Scandinavian summer.')
PROMPTS={
 'sedum':'A sedum green roof: dense low carpet of mixed sedum species in fresh green, olive, bronze-red and yellow-green, with tiny yellow and pink star flowers and a few moss patches.',
 'meadow':'A wildflower meadow green roof: fine grasses, clover, ox-eye daisies, cornflowers, red campion and yellow buttercups mixed through green and straw-coloured grass.',
 'kitchen':'A rooftop vegetable garden: rows of wooden raised beds full of kale, lettuce, chard, beans and herbs, separated by narrow pale gravel paths, some beds with straw mulch.',
 'terrace':'A rooftop terrace: weathered grey-brown wooden decking boards with scattered terracotta pots, herb planters and small shrubs in containers.',
 'pavers':'Permeable street paving: grey and warm beige granite setts of irregular sizes with grass and moss growing in wide joints, a few clover leaves.',
 'verge':'A lush urban planting bed: perennials, ornamental grasses, lavender, herbs, strawberries and young fruit bushes growing in dark bark mulch.',
 'allotment':'Vegetable allotment plots: dark brown soil rows with young potatoes, onions, carrots and lettuce, straw mulch and narrow grass paths between plots.',
 'solar':'One single black monocrystalline solar panel filling the entire image edge to edge: a 6 by 10 grid of dark blue-black cells with thin silver busbar lines and faint sky reflection, no frame, no background.',
}
def run(name):
    out=RAW/f'{name}.png'
    if out.exists(): return f'{name}: reused'
    prompt=PROMPTS[name]+('' if name=='solar' else STYLE)
    r=subprocess.run([sys.executable,str(SCRIPT),'-p',prompt,'-o',str(out),'-m','google/gemini-3-pro-image'],capture_output=True,text=True)
    return f'{name}: {"ok" if out.exists() else "FAILED "+(r.stderr or r.stdout)[-300:]}'
with ThreadPoolExecutor(max_workers=4) as ex:
    for line in ex.map(run,PROMPTS): print(line,flush=True)
