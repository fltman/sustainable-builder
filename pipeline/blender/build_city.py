"""Build an editable Blender city from cities/<slug>/city.json.

    Blender -b --factory-startup --python pipeline/blender/build_city.py -- <slug>

Writes cities/<slug>/city.blend. All geometry comes ready-made from prepare_city.py; this script
creates materials from cache/textures, assembles meshes, adds trees, street furniture, rails,
curbs, quay walls and the container wall at the edge of the map, and places review cameras.

Custom hand-modelled buildings: cities/<slug>/custom/<building id>.py replaces the generated
building with that id (see pipeline/blender/citylib.py and the refine-city skill).

Object custom properties used by export_tiles.py:
  wb_tile = 'base' (always loaded: ground, water, curbs) or 'c<i>_<j>' (streamed 60 m tiles).
"""
import json
import math
import random
import sys
import time
from pathlib import Path

import bpy
import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parent))
import citylib  # noqa: E402
from citylib import Geo, lin  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
args = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
SLUG = args[0]
CITY = ROOT / 'cities' / SLUG
DATA = json.loads((CITY / 'city.json').read_text())
STYLE = json.loads((ROOT / 'pipeline/style.json').read_text())
TEX = ROOT / 'cache/textures'
t0 = time.time()


def log(*a):
    print('[build]', *a, f'({time.time() - t0:.0f}s)', flush=True)


# ------------------------------------------------------------------------------------------ scene
bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
scene.unit_settings.system = 'METRIC'
cols = {}


def coll(name):
    if name not in cols:
        c = bpy.data.collections.new(name)
        scene.collection.children.link(c)
        cols[name] = c
    return cols[name]


citylib.TEXTURES = TEX
M = citylib.MaterialLibrary(STYLE)

# ------------------------------------------------------------------------------------------ mesh assembly
def assemble(name, chunks, collection, tile, props=None):
    """chunks: list of (mesh dict {v, uv, t}, material name). Returns the object or None."""
    verts, uvs, faces, mat_idx, mats = [], [], [], [], []
    for d, mat in chunks:
        if not d or not d.get('t'):
            continue
        off = len(verts) // 3
        verts.extend(d['v'])
        uvs.extend(d['uv'])
        if mat not in mats:
            mats.append(mat)
        mi = mats.index(mat)
        t = d['t']
        faces.extend(t if off == 0 else [i + off for i in t])
        mat_idx.extend([mi] * (len(t) // 3))
    if not faces:
        return None
    me = bpy.data.meshes.new(name)
    v = np.array(verts, dtype=np.float32).reshape(-1, 3)
    f = np.array(faces, dtype=np.int32).reshape(-1, 3)
    me.vertices.add(len(v))
    me.vertices.foreach_set('co', v.ravel())
    me.loops.add(len(f) * 3)
    me.loops.foreach_set('vertex_index', f.ravel())
    me.polygons.add(len(f))
    me.polygons.foreach_set('loop_start', np.arange(0, len(f) * 3, 3, dtype=np.int32))
    me.polygons.foreach_set('loop_total', np.full(len(f), 3, dtype=np.int32))
    me.polygons.foreach_set('material_index', np.array(mat_idx, dtype=np.int32))
    uv = np.array(uvs, dtype=np.float32).reshape(-1, 2)
    layer = me.uv_layers.new(name='UVMap')
    layer.data.foreach_set('uv', uv[f.ravel()].ravel())
    me.update(calc_edges=True)
    me.validate(clean_customdata=False)
    for m in mats:
        me.materials.append(M.get(m))
    obj = bpy.data.objects.new(name, me)
    collection.objects.link(obj)
    obj['wb_tile'] = tile
    for k, val in (props or {}).items():
        obj[k] = val
    return obj


def tile_of(cell):
    return f'c{cell[0]}_{cell[1]}'


# ------------------------------------------------------------------------------------------ ground
G = coll('Ground')
for layer, chunks in DATA['surfaces'].items():
    assemble(f'SM_Ground_{layer.title()}', [(c, f'M_Ground_{layer.title()}') for c in chunks], G, 'base', {'wb_layer': layer})
log('ground layers', len(DATA['surfaces']))

geo = Geo()
side_z = STYLE['surfaces']['sidewalk']['z']
for x0, y0, x1, y1 in DATA['curbs']:
    # Segments keep their polygon on the left, so every face below looks right: kerbs at the road, quays at the water.
    geo.wall((x0, y0), (x1, y1), -0.02, side_z, 'M_Curb', uvscale=1.0)
wz = DATA['water_z']
for x0, y0, x1, y1 in DATA['shore']:
    geo.wall((x0, y0), (x1, y1), wz - 1.2, 0.0, 'M_Quay', uvscale=2.0)
# Flat bridges: a parapet and a fascia down towards the water – in a place of arched bridges (Venice) the arches'
# brick and stone and a shallower fascia, so the few bridges left flat (an L over the water, a pontoon) match them.
FLAT = DATA.get('bridge_style') or {}
flat_body, flat_cap, fascia = ((FLAT.get('body', 'M_Wall_Brick_red_Blank'), FLAT.get('cap', 'M_Fixture_Stone'), -0.45)
                               if FLAT.get('style') == 'arch' else ('M_Concrete', 'M_Concrete', -0.9))
for x0, y0, x1, y1 in DATA['bridge_edges']:
    L = math.hypot(x1 - x0, y1 - y0)
    if L < 0.1:
        continue
    nx, ny = (y1 - y0) / L, -(x1 - x0) / L  # outward, towards the water
    p, q = (x0 - nx * 0.15, y0 - ny * 0.15), (x1 - nx * 0.15, y1 - ny * 0.15)
    if flat_cap == flat_body:
        geo.box_between(p, q, 0.3, 0.02, 1.05, flat_body)
    else:
        geo.box_between(p, q, 0.3, 0.02, 0.95, flat_body)
        geo.box_between(p, q, 0.34, 0.95, 1.05, flat_cap)
    geo.wall((x0, y0), (x1, y1), fascia, 0.02, flat_body)
h = DATA['half'] + 400
geo.quad([(-h, -h, wz), (h, -h, wz), (h, h, wz), (-h, h, wz)], 'M_Water', uvscale=8.0)
geo.to_object('SM_Ground_Edges_Water', G, 'base', M)
# Rivers and ponds above the main water (terrain) have their own flat surface.
for i, wb in enumerate(DATA.get('water_bodies', [])):
    assemble(f'SM_Water_Raised_{i}', [(wb['mesh'], 'M_Water')], G, 'base', {'wb_keep_z': 1})
# The surroundings beyond the play area: fields and forest on the terrain.
for kind, mesh in DATA.get('outskirts', {}).items():
    assemble(f'SM_Ground_Outskirts_{kind.title()}', [(mesh, f'M_Ground_{kind.title()}')], G, 'base', {'wb_layer': f'outskirts_{kind}'})
log('curbs, quays, bridges and water')

# ------------------------------------------------------------------------------------------ buildings
B = coll('Buildings')
LM = coll('Landmarks')
custom_dir = CITY / 'custom'
custom = {p.stem: p for p in custom_dir.glob('*.py')} if custom_dir.exists() else {}
role_mat = {
    'upper': lambda b: f'M_Wall_{b["style"].title()}_{b["colour"]}_Upper',
    'ground': lambda b: f'M_Wall_{b["style"].title()}_{b["colour"]}_Ground',
    'blank': lambda b: f'M_Wall_{b["style"].title()}_{b["colour"]}_Blank',
    'roof': lambda b: f'M_Roof_{b["roof_style"].title()}_{b["roof_colour"]}',
    'flat': lambda b: f'M_Roof_Flat_{b["roof_colour"] if b["roof_style"] == "flat" else "tar"}',
}
n_custom, failed = 0, set()


def build_generated(b):
    name = f'SM_Building_{b["id"]}'
    if b.get('landmark') and b.get('name'):
        name = f'SM_Landmark_{b["id"]}_{citylib.safe(b["name"])}'
    assemble(name, [(b['parts'].get(r), fn(b)) for r, fn in role_mat.items()], LM if b.get('landmark') else B, tile_of(b['cell']),
             {'wb_building': b['id'], 'wb_kind': b['kind'], 'wb_style': f'{b["style"]}/{b["colour"]}', 'wb_roof': f'{b["roof_style"]}/{b["roof_colour"]}',
              'wb_height': b['h'], 'wb_levels': b['levels']})


by_id = {b['id']: b for b in DATA['buildings']}
for b in DATA['buildings']:
    if b['id'] not in custom:
        build_generated(b)
for bid, script in sorted(custom.items()):
    b = by_id.get(bid)
    ctx = citylib.CustomContext(bid, b, M, coll('Custom buildings'), tile_of(b['cell']) if b else None, DATA)
    try:
        code = compile(script.read_text(), str(script), 'exec')
        exec(code, {'ctx': ctx, 'Geo': Geo, 'math': math, 'citylib': citylib, '__name__': 'custom'})
        ctx.finish()
        n_custom += 1
    except Exception as e:                                   # one broken script must not stop the city
        import traceback
        tb = traceback.extract_tb(e.__traceback__)
        where = next((f'{fr.filename.split("/")[-1]}:{fr.lineno}' for fr in reversed(tb)), '?')
        print(f'  [custom] FAILED {bid}: {type(e).__name__}: {e} ({where}) — using the generated building', flush=True)
        for o in ctx.objects:
            if o and o.name in bpy.data.objects:
                bpy.data.objects.remove(o)
        failed.add(bid)
        if b:
            build_generated(b)
log('buildings', len(DATA['buildings']), 'custom', n_custom, 'failed', len(failed))

# ------------------------------------------------------------------------------------------ walls
W = coll('Walls')
wall_mat = {'city_wall': 'M_StoneWall', 'wall': 'M_StoneWall', 'hedge': 'M_Hedge', 'retaining_wall': 'M_Concrete', 'fence': 'M_Wall_Wood_white_Blank'}
by_cell = {}
for w in DATA['walls']:
    by_cell.setdefault((w['kind'], tuple(w['cell'])), []).append((w['mesh'], wall_mat[w['kind']]))
for (kind, cell), chunks in by_cell.items():
    assemble(f'SM_Wall_{kind.title().replace("_", "")}_{cell[0]}_{cell[1]}', chunks, W, tile_of(cell))

# ------------------------------------------------------------------------------------------ trees
T = coll('Trees')
cells = {}
for x, y, s, kind in DATA['trees']:
    cells.setdefault((math.floor(x / 60), math.floor(y / 60)), []).append((x, y, s, kind))
for cell, trees in cells.items():
    g = Geo()
    for i, (x, y, s, kind) in enumerate(trees):
        rng = random.Random(f'{x},{y}')
        citylib.tree(g, x, y, s, kind, rng)
    g.to_object(f'SM_Trees_{cell[0]}_{cell[1]}', T, tile_of(cell), M)
log('trees', len(DATA['trees']))

# ------------------------------------------------------------------------------------------ street furniture
F = coll('Street furniture')
cells = {}
for p in DATA['props']:
    cells.setdefault((math.floor(p['x'] / 60), math.floor(p['y'] / 60)), []).append(p)
for cell, props in cells.items():
    furn, fixed = Geo(), Geo()
    for p in props:
        citylib.prop(furn, fixed, p)
    furn.to_object(f'SM_Street_Furniture_{cell[0]}_{cell[1]}', F, tile_of(cell), M)
    fixed.to_object(f'SM_Street_Fixtures_{cell[0]}_{cell[1]}', F, tile_of(cell), M)
log('props', len(DATA['props']))

# ------------------------------------------------------------------------------------------ rails
R = coll('Rails')
g = Geo()
for line in DATA['rails']:
    citylib.track(g, line, sleepers=True)
for line in DATA.get('trams', []):
    citylib.track(g, line, sleepers=False, z=0.03)
if g:
    for cell, sub in g.split_cells(60).items():
        sub.to_object(f'SM_Rails_{cell[0]}_{cell[1]}', R, tile_of(cell), M)

# ------------------------------------------------------------------------------------------ edge containers
E = coll('Edge of the world')
cells = {}
for c in DATA.get('barriers', []):
    cells.setdefault(tuple(c['cell']), []).append(c)
for cell, cs in cells.items():
    g = Geo()
    for c in cs:
        citylib.container(g, c)
    g.to_object(f'SM_Edge_Containers_{cell[0]}_{cell[1]}', E, tile_of(cell), M)
log('edge containers', len(DATA.get('barriers', [])))

# ------------------------------------------------------------------------------------------ terrain
# Everything above was built on flat ground; lift it onto the terrain. Buildings move as one piece by
# their base height and get a foundation where the ground falls away; walls are cut every 7.5 m first.
TERRAIN = citylib.Terrain(DATA.get('terrain'))
if TERRAIN:
    for o in list(W.objects):
        citylib.subdivide_xy(o, DATA['terrain']['step'])
    founded = set()
    for o in list(bpy.data.objects):
        if o.type != 'MESH' or o.get('wb_keep_z'):
            continue
        bid = o.get('wb_building')
        b = by_id.get(bid) if bid else None
        if b and bid not in founded:
            citylib.foundation(o, b, M)
            founded.add(bid)
        citylib.lift(o, TERRAIN, b, keep_below=wz + 0.05 if o.name == 'SM_Ground_Edges_Water' else None)
    t = DATA['terrain']
    # Kept as a text block for the render scripts (scene properties would be exported into every tile).
    txt = bpy.data.texts.new('wb_terrain.json')
    txt.write(json.dumps({'x0': t['x0'], 'y0': t['y0'], 'step': t['step'], 'n': t['n'], 'd': t['d']}))
    log('terrain', f'{min(t["d"]):.1f}–{max(t["d"]):.1f} m, {len(founded)} buildings on their base')

# ------------------------------------------------------------------------------------------ arched bridges
# Bridges vaulted over the canals where the place asks for them (overrides.json defaults.bridges: Venice), built
# after the lift at their own absolute heights: from the street at either end up over a boat's head.
SPANS = DATA.get('bridge_spans') or []
if SPANS:
    bs = DATA.get('bridge_style') or {}
    mats = (bs.get('body', 'M_Wall_Brick_red_Blank'), bs.get('trim', 'M_Fixture_Stone'), bs.get('steps', 'M_Ground_Paving'),
            bs.get('cap', 'M_Fixture_Stone'), bs.get('rail', 'M_Furniture_Metal'))
    sys.path.append(str(Path(__file__).resolve().parents[1]))
    import bridges  # noqa: E402 – pipeline/bridges.py: the profile the site's map shares (make_pack.py)
    ground = bridges.sampler(DATA.get('terrain'), STYLE['surfaces'].get('paving', {}).get('z', 0.03))
    geo = Geo()
    for sp in SPANS:
        pr = bridges.profile(sp, ground, wz)
        rng = random.Random(f'bridge {sp["a"]} {sp["b"]}')
        if pr:
            citylib.arch_bridge(geo, pr, mats, railing=rng.random() < bs.get('railings', 0.35))
    geo.to_object('SM_Bridges_Arched', G, 'base', M)
    log('arched bridges', len(SPANS))

# ------------------------------------------------------------------------------------------ light, world, cameras
world = bpy.data.worlds.new('Dusk')
world.use_nodes = True
bg = world.node_tree.nodes.get('Background')
bg.inputs['Color'].default_value = (0.42, 0.3, 0.2, 1)
bg.inputs['Strength'].default_value = 0.8
scene.world = world
sun = bpy.data.objects.new('Sun', bpy.data.lights.new('Sun', 'SUN'))
sun.data.energy = 3.5
sun.data.color = (1.0, 0.78, 0.55)
sun.rotation_euler = (math.radians(68), 0, math.radians(235))
scene.collection.objects.link(sun)
citylib.review_cameras(scene, DATA, TERRAIN)
scene.render.resolution_x, scene.render.resolution_y = 1920, 1080

out = CITY / 'city.blend'
bpy.ops.wm.save_as_mainfile(filepath=str(out), compress=True)
bpy.ops.file.make_paths_relative()
bpy.ops.wm.save_mainfile(compress=True)
tris = sum(len(o.data.polygons) for o in bpy.data.objects if o.type == 'MESH')
log(f'saved {out.relative_to(ROOT)}: {len(bpy.data.objects)} objects, {tris:,} triangles, {len(bpy.data.materials)} materials')
print('BUILD_CITY_OK', flush=True)
