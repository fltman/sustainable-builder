"""Render the model from Street View viewpoints for `sustainable.py survey <slug> compare DIR`.

    Blender -b cities/<slug>/city.blend --python pipeline/blender/render_survey.py -- DIR/views.json DIR/render

For every view (x, y, compass heading) it renders the normal view <name>.png and an ID pass
<name>_ids.png in which every building has its own flat colour (DIR/render/idmap.json maps the colours
to ids). Camera: 2.5 m over the terrain, 8° down, 18 mm lens (90° like the Street View links).
"""
import json
import math
import os
import sys
import zlib
from pathlib import Path

import bpy

sys.path.insert(0, str(Path(__file__).resolve().parent))
import citylib  # noqa: E402

args = sys.argv[sys.argv.index('--') + 1:]
views, out = json.load(open(args[0])), args[1]
os.makedirs(out, exist_ok=True)
scene = bpy.context.scene
ground = citylib.Terrain.of_scene(scene)
cams = []
for v in views:
    c = bpy.data.objects.new(v['name'], bpy.data.cameras.new(v['name']))
    c.data.lens, c.data.clip_end, c.data.sensor_fit = 18, 3000, 'HORIZONTAL'
    c.location = (v['x'], v['y'], 2.5 + float(ground.at(v['x'], v['y'])))
    c.rotation_euler = (math.radians(98), 0, -math.radians(v['heading']))
    scene.collection.objects.link(c)
    cams.append(c)

# Normal views (Eevee, falling back to Workbench).
scene.render.resolution_x, scene.render.resolution_y, scene.render.resolution_percentage = 1330, 726, 100
for engine in ('BLENDER_EEVEE', 'BLENDER_EEVEE_NEXT', 'BLENDER_WORKBENCH'):
    try:
        scene.render.engine = engine
        break
    except TypeError:
        continue
try:
    scene.eevee.taa_render_samples = 16
except AttributeError:
    pass
scene.view_settings.view_transform = 'AgX'
scene.render.image_settings.file_format = 'PNG'
for c in cams:
    scene.camera = c
    scene.render.filepath = os.path.join(out, c.name)
    bpy.ops.render.render(write_still=True)
    print('RENDERED', c.name, flush=True)

# ID pass: flat object colours, no colour management, no anti-aliasing (exact colours per building).
scene.render.engine = 'BLENDER_WORKBENCH'
scene.render.resolution_x, scene.render.resolution_y = 665, 363
sh = scene.display.shading
sh.light, sh.color_type = 'FLAT', 'OBJECT'
sh.show_shadows = sh.show_cavity = sh.show_object_outline = False
scene.view_settings.view_transform = 'Raw'
scene.render.dither_intensity = 0
scene.display.render_aa = 'OFF'
if scene.world:
    scene.world.color = (0, 0, 0)
idmap = {}
for o in bpy.data.objects:
    if o.type != 'MESH':
        continue
    bid = o.get('wb_building')
    if bid and 'Furniture' not in o.name:
        h = zlib.crc32(str(bid).encode())
        rgb = (40 + h % 200, 40 + (h >> 8) % 200, 40 + (h >> 16) % 200)
        idmap['%d,%d,%d' % rgb] = bid
        o.color = (rgb[0] / 255, rgb[1] / 255, rgb[2] / 255, 1)
    else:
        o.color = (0, 0, 0, 1)
json.dump(idmap, open(os.path.join(out, 'idmap.json'), 'w'))
for c in cams:
    scene.camera = c
    scene.render.filepath = os.path.join(out, c.name + '_ids')
    bpy.ops.render.render(write_still=True)
print('SURVEY_RENDER_OK', len(cams), flush=True)
