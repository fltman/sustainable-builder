"""Blender helpers for wasteland-builder: materials, a tiny mesh builder, trees, street furniture,
rails, containers, cameras — and the API for hand-modelled buildings (cities/<slug>/custom/<id>.py).

A custom building script is executed with these globals:
    ctx      CustomContext: ctx.b (the generated building record or None), ctx.footprint (list of rings),
             ctx.geo (a Geo to draw into), ctx.mat(role or name), ctx.data (the whole city.json)
    Geo, math, citylib
Draw with ctx.geo.box(...), .wall(...), .quad(...), .cyl(...), .prism(...), .polygon(...), and the
object is created when the script ends. Use material roles 'upper', 'ground', 'blank', 'roof', 'flat'
(the building's own colours) or any library name like 'M_Roof_Metal_copper', 'M_StoneWall'.
"""
import math
import re
import unicodedata
from pathlib import Path

import bpy
import numpy as np

TEXTURES = None  # set by build_city.py

CONTAINER_COLOURS = {'rust': (0.55, 0.30, 0.18), 'blue': (0.22, 0.33, 0.48), 'green': (0.25, 0.40, 0.28), 'red': (0.60, 0.20, 0.16),
                     'grey': (0.52, 0.53, 0.52), 'orange': (0.78, 0.42, 0.16)}


def lin(c):
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def safe(name):
    name = unicodedata.normalize('NFKD', name).encode('ascii', 'ignore').decode()
    return re.sub(r'[^A-Za-z0-9]+', '_', name).strip('_')[:40] or 'x'


# ------------------------------------------------------------------------------------------ materials
class MaterialLibrary:
    """Creates materials on demand from their names (see build_city.py role_mat)."""

    FIXED = {
        # name: (texture, roughness override, metallic, emission)
        'M_Water': ('Water', None, 0.0, None), 'M_Quay': ('Quay', None, 0.0, None), 'M_Curb': ('Curb', None, 0.0, None),
        'M_Concrete': ('Concrete', None, 0.0, None), 'M_StoneWall': ('StoneWall', None, 0.0, None), 'M_Hedge': ('Hedge', None, 0.0, None),
        'M_Bark_Wood': ('Bark', None, 0.0, None), 'M_Leaf': ('Leaf', None, 0.0, None), 'M_Conifer': ('Conifer', None, 0.0, None),
        'M_Furniture_Metal': ('PoleMetal', None, 0.6, None), 'M_Furniture_Wood': ('BenchWood', None, 0.0, None),
        'M_Furniture_LampGlass': ('LampGlass', None, 0.0, (1.0, 0.82, 0.55, 4.0)),
        'M_Fixture_Metal': ('PoleMetal', None, 0.5, None), 'M_Fixture_Stone': ('Grave', None, 0.0, None),
        'M_RailSteel_Metal': ('RailSteel', None, 0.7, None), 'M_Rail_Sleeper_Concrete': ('Concrete', None, 0.0, None),
    }

    def __init__(self, style):
        self.style = style
        self.cache = {}

    def get(self, name):
        if name in self.cache:
            return self.cache[name]
        m = self._make(name)
        self.cache[name] = m
        return m

    def _make(self, name):
        parts = name.split('_')
        tint = None
        if name.startswith('M_Ground_'):
            tex = 'Ground' + parts[2]
            return material(name, tex)
        if name.startswith('M_Wall_'):
            style, colour, role = parts[2].lower(), parts[3], parts[4]
            ws = self.style['wall_styles'][style]
            rgb = ws['colours'].get(colour) or ws['extra_colours'][colour]
            return material(name, f'Wall{style.title()}{role}', tint=rgb, ref=0.86)
        if name.startswith('M_Roof_'):
            style, colour = parts[2].lower(), parts[3]
            rs = self.style['roof_styles'][style]
            rgb = rs['colours'].get(colour) or rs['extra_colours'][colour]
            return material(name, f'Roof{style.title()}', tint=rgb, ref=0.82, metallic=0.35 if style == 'metal' else 0.0)
        if name == 'M_Window_Pane':
            # Window panes of hand-made buildings: a uniform texture tinted dark (a patterned texture greys out in the
            # distance mipmaps). The name avoids "glass" (the game makes glass shiny, mirroring the pale haze) but
            # keeps "window" so hits still sound like glass.
            return material(name, 'WallGlassBlank', tint=(0.2, 0.23, 0.27), ref=0.8)
        if name.startswith('M_Container_'):
            rgb = CONTAINER_COLOURS.get(parts[2], (0.5, 0.5, 0.5))
            return material(name + '_Metal', 'WallMetalBlank', tint=rgb, ref=0.86, metallic=0.3)
        tex, rough, metal, emission = self.FIXED[name]
        return material(name, tex, metallic=metal, emission=emission)


def material(name, tex, tint=None, ref=0.85, metallic=0.0, emission=None):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    bsdf = nt.nodes.get('Principled BSDF')
    bsdf.inputs['Metallic'].default_value = metallic
    base = image_node(nt, tex, 'BaseColor', -700, 300)
    if tint:
        t = [round(lin(c) / lin(ref), 4) for c in tint]
        m['tint'] = t  # exported as glTF extras.tint; the game multiplies masked texels by it
        mix = nt.nodes.new('ShaderNodeMix')
        mix.data_type = 'RGBA'
        mix.blend_type = 'MULTIPLY'
        mix.location = (-300, 300)
        sock = {s.identifier: s for s in mix.inputs}
        nt.links.new(base.outputs['Alpha'], sock['Factor_Float'])
        nt.links.new(base.outputs['Color'], sock['A_Color'])
        sock['B_Color'].default_value = (*t, 1)
        out = {s.identifier: s for s in mix.outputs}['Result_Color']
        nt.links.new(out, bsdf.inputs['Base Color'])
        m.diffuse_color = (*tint, 1)
    else:
        nt.links.new(base.outputs['Color'], bsdf.inputs['Base Color'])
    rough = image_node(nt, tex, 'Roughness', -700, 0, data=True)
    nt.links.new(rough.outputs['Color'], bsdf.inputs['Roughness'])
    nrm = image_node(nt, tex, 'Normal', -700, -300, data=True)
    nm = nt.nodes.new('ShaderNodeNormalMap')
    nm.location = (-300, -300)
    nt.links.new(nrm.outputs['Color'], nm.inputs['Color'])
    nt.links.new(nm.outputs['Normal'], bsdf.inputs['Normal'])
    if emission:
        bsdf.inputs['Emission Color'].default_value = (*emission[:3], 1)
        bsdf.inputs['Emission Strength'].default_value = emission[3]
    return m


def image_node(nt, tex, suffix, x, y, data=False):
    path = TEXTURES / f'T_{tex}_{suffix}.png'
    img = bpy.data.images.get(path.name) or bpy.data.images.load(str(path), check_existing=True)
    if data:
        img.colorspace_settings.name = 'Non-Color'
    n = nt.nodes.new('ShaderNodeTexImage')
    n.image = img
    n.location = (x, y)
    return n


# ------------------------------------------------------------------------------------------ mesh builder
_ICO = None


def icosphere():
    global _ICO
    if _ICO is None:
        t = (1 + 5 ** 0.5) / 2
        v = [(-1, t, 0), (1, t, 0), (-1, -t, 0), (1, -t, 0), (0, -1, t), (0, 1, t), (0, -1, -t), (0, 1, -t), (t, 0, -1), (t, 0, 1), (-t, 0, -1), (-t, 0, 1)]
        f = [(0, 11, 5), (0, 5, 1), (0, 1, 7), (0, 7, 10), (0, 10, 11), (1, 5, 9), (5, 11, 4), (11, 10, 2), (10, 7, 6), (7, 1, 8),
             (3, 9, 4), (3, 4, 2), (3, 2, 6), (3, 6, 8), (3, 8, 9), (4, 9, 5), (2, 4, 11), (6, 2, 10), (8, 6, 7), (9, 8, 1)]
        v = [np.array(p) / np.linalg.norm(p) for p in v]
        cache = {}

        def mid(a, b):
            key = (min(a, b), max(a, b))
            if key not in cache:
                m = (v[a] + v[b]) / 2
                v.append(m / np.linalg.norm(m))
                cache[key] = len(v) - 1
            return cache[key]
        nf = []
        for a, b, c in f:
            ab, bc, ca = mid(a, b), mid(b, c), mid(c, a)
            nf += [(a, ab, ca), (b, bc, ab), (c, ca, bc), (ab, bc, ca)]
        _ICO = ([tuple(p) for p in v], nf)
    return _ICO


class Geo:
    """Polygon soup with per-face materials and box-projected or planar UVs."""

    def __init__(self):
        self.v, self.f, self.uv, self.m, self.s = [], [], [], [], []

    def __bool__(self):
        return bool(self.f)

    def face(self, pts, mat, uvs=None, uvscale=4.0, smooth=False):
        if uvs is None:
            uvs = planar_uv(pts, uvscale)
        off = len(self.v)
        self.v.extend(pts)
        self.f.append(tuple(range(off, off + len(pts))))
        self.uv.append(uvs)
        self.m.append(mat)
        self.s.append(smooth)

    def quad(self, pts, mat, uvscale=4.0):
        self.face(pts, mat, uvscale=uvscale)

    def wall(self, a, b, z0, z1, mat, reverse=False, uvscale=4.0):
        """Vertical quad from a to b; it faces to the right of a→b (to the left with reverse)."""
        pts = [(a[0], a[1], z0), (b[0], b[1], z0), (b[0], b[1], z1), (a[0], a[1], z1)]
        if reverse:
            pts.reverse()
        L = math.dist(a, b)
        uvs = [(0, z0 / uvscale), (L / uvscale, z0 / uvscale), (L / uvscale, z1 / uvscale), (0, z1 / uvscale)]
        if reverse:
            uvs.reverse()
        self.face(pts, mat, uvs)

    def box(self, center, size, mat, angle=0.0, uvscale=2.0, top=True, bottom=False):
        x, y, z = center
        a, b, c = size[0] / 2, size[1] / 2, size[2] / 2
        co, si = math.cos(angle), math.sin(angle)
        P = [(x + u * co - w * si, y + u * si + w * co, z + h) for u, w, h in
             ((-a, -b, -c), (a, -b, -c), (a, b, -c), (-a, b, -c), (-a, -b, c), (a, -b, c), (a, b, c), (-a, b, c))]
        faces = [(0, 1, 5, 4), (1, 2, 6, 5), (2, 3, 7, 6), (3, 0, 4, 7)]
        if top:
            faces.append((4, 5, 6, 7))
        if bottom:
            faces.append((3, 2, 1, 0))
        for f in faces:
            self.face([P[i] for i in f], mat, uvscale=uvscale)

    def box_between(self, p, q, width, z0, z1, mat, uvscale=2.0):
        L = math.dist(p, q)
        if L < 0.01:
            return
        ang = math.atan2(q[1] - p[1], q[0] - p[0])
        self.box(((p[0] + q[0]) / 2, (p[1] + q[1]) / 2, (z0 + z1) / 2), (L, width, z1 - z0), mat, ang, uvscale)

    def cyl(self, x, y, z, r, h, mat, seg=8, r2=None, cap=True, uvscale=2.0):
        r2 = r if r2 is None else r2
        ring0 = [(x + r * math.cos(2 * math.pi * i / seg), y + r * math.sin(2 * math.pi * i / seg), z) for i in range(seg)]
        ring1 = [(x + r2 * math.cos(2 * math.pi * i / seg), y + r2 * math.sin(2 * math.pi * i / seg), z + h) for i in range(seg)]
        circ = 2 * math.pi * max(r, r2)
        for i in range(seg):
            j = (i + 1) % seg
            if r2 > 0.001:
                uvs = [(i / seg * circ / uvscale, z / uvscale), ((i + 1) / seg * circ / uvscale, z / uvscale),
                       ((i + 1) / seg * circ / uvscale, (z + h) / uvscale), (i / seg * circ / uvscale, (z + h) / uvscale)]
                self.face([ring0[i], ring0[j], ring1[j], ring1[i]], mat, uvs)
            else:
                self.face([ring0[i], ring0[j], ring1[0]], mat, uvscale=uvscale)
        if cap and r2 > 0.001:
            self.face(ring1, mat, uvscale=uvscale)

    def prism(self, ring, z0, z1, mat, uvscale=3.0, top=True):
        """Extrude a counter-clockwise ring of (x, y)."""
        n = len(ring)
        for i in range(n):
            self.wall(ring[i], ring[(i + 1) % n], z0, z1, mat, uvscale=uvscale)
        if top:
            self.face([(x, y, z1) for x, y in ring], mat, uvscale=uvscale)

    def polygon(self, ring, z, mat, uvscale=4.0):
        self.face([(x, y, z) for x, y in ring], mat, uvscale=uvscale)

    def blob(self, c, r, mat, jitter=0.0, rng=None):
        verts, faces = icosphere()
        P = []
        for vx, vy, vz in verts:
            k = 1 + (rng.uniform(-jitter, jitter) if rng else 0)
            P.append((c[0] + vx * r[0] * k, c[1] + vy * r[1] * k, c[2] + vz * r[2] * k))
        for f in faces:
            self.face([P[i] for i in f], mat, uvscale=1.5, smooth=True)

    def split_cells(self, size):
        out = {}
        for f, uv, m, sm in zip(self.f, self.uv, self.m, self.s):
            pts = [self.v[i] for i in f]
            cx, cy = sum(p[0] for p in pts) / len(pts), sum(p[1] for p in pts) / len(pts)
            key = (math.floor(cx / size), math.floor(cy / size))
            out.setdefault(key, Geo()).face(pts, m, uv, smooth=sm)
        return out

    def to_object(self, name, collection, tile, lib, props=None):
        if not self.f:
            return None
        mats = list(dict.fromkeys(self.m))
        me = bpy.data.meshes.new(name)
        verts, faces = self.v, self.f
        if any(self.s):
            # Share vertices of smooth faces (tree crowns) so they shade round.
            index, verts, faces = {}, [], []
            for f, sm in zip(self.f, self.s):
                row = []
                for i in f:
                    key = (round(self.v[i][0], 4), round(self.v[i][1], 4), round(self.v[i][2], 4)) if sm else ('u', i)
                    if key not in index:
                        index[key] = len(verts)
                        verts.append(self.v[i])
                    row.append(index[key])
                faces.append(tuple(row))
        me.from_pydata(verts, [], faces)
        me.polygons.foreach_set('material_index', [mats.index(m) for m in self.m])
        me.polygons.foreach_set('use_smooth', self.s)
        layer = me.uv_layers.new(name='UVMap')
        layer.data.foreach_set('uv', [c for uvs in self.uv for p in uvs for c in p])
        me.update()
        for m in mats:
            me.materials.append(lib.get(m))
        obj = bpy.data.objects.new(name, me)
        collection.objects.link(obj)
        obj['wb_tile'] = tile
        for k, v in (props or {}).items():
            obj[k] = v
        return obj


def planar_uv(pts, scale):
    a = np.array(pts[1]) - np.array(pts[0])
    b = np.array(pts[-1]) - np.array(pts[0])
    n = np.cross(a, b)
    ax = int(np.argmax(np.abs(n))) if np.linalg.norm(n) > 1e-9 else 2
    keep = [i for i in range(3) if i != ax]
    return [(p[keep[0]] / scale, p[keep[1]] / scale) for p in pts]


# ------------------------------------------------------------------------------------------ vegetation
def tree(g, x, y, s, kind, rng):
    h = rng.uniform(8.5, 12.5) * s
    if kind == 'conifer':
        g.cyl(x, y, -0.1, 0.22 * s, 2.2 * s, 'M_Bark_Wood', 6, 0.16 * s, cap=False)
        base = 1.4 * s
        for i, (rr, hh) in enumerate(((2.6, 0.45), (2.0, 0.4), (1.3, 0.35))):
            z = base + h * (0.0, 0.28, 0.52)[i]
            g.cyl(x, y, z, rr * s * rng.uniform(0.9, 1.1), h * hh, 'M_Conifer', 7, 0.0, cap=False)
        return
    trunk = h * 0.42
    g.cyl(x, y, -0.1, 0.2 * s, trunk + 0.1, 'M_Bark_Wood', 6, 0.14 * s, cap=False)
    r = rng.uniform(2.6, 3.6) * s
    cz = trunk + (h - trunk) * 0.48
    g.blob((x, y, cz), (r, r, (h - trunk) * 0.5), 'M_Leaf', 0.12, rng)
    for k in range(2):
        a = rng.uniform(0, math.tau)
        d = rng.uniform(0.35, 0.6) * r
        rr = r * rng.uniform(0.45, 0.6)
        g.blob((x + math.cos(a) * d, y + math.sin(a) * d, cz + rng.uniform(-0.1, 0.4) * (h - trunk) * 0.5), (rr, rr, rr * 0.8), 'M_Leaf', 0.12, rng)


# ------------------------------------------------------------------------------------------ street furniture
def prop(furn, fixed, p):
    """Breakable things go into furn (the game splits 'Furniture' meshes into physical props); static ones into fixed."""
    x, y, a, k = p['x'], p['y'], p.get('a', 0.0), p['k']
    ca, sa = math.cos(a), math.sin(a)
    if k == 'lamp':
        furn.cyl(x, y, -0.05, 0.16, 0.6, 'M_Furniture_Metal', 8)
        furn.cyl(x, y, 0.5, 0.085, 5.2, 'M_Furniture_Metal', 8, 0.06)
        ax, ay = x + ca * 0.75, y + sa * 0.75
        furn.box((ax, ay, 5.62), (1.5, 0.08, 0.08), 'M_Furniture_Metal', a)
        hx, hy = x + ca * 1.45, y + sa * 1.45
        furn.box((hx, hy, 5.55), (0.62, 0.3, 0.16), 'M_Furniture_Metal', a, bottom=False)
        furn.box((hx, hy, 5.455), (0.52, 0.22, 0.03), 'M_Furniture_LampGlass', a, bottom=True)
    elif k == 'bench':
        # a points towards the road; the seat runs along the kerb with the backrest away from the road.
        seat = a + math.pi / 2
        for off in (-0.16, 0.0, 0.16):
            furn.box((x + ca * off, y + sa * off, 0.45), (1.8, 0.13, 0.05), 'M_Furniture_Wood', seat)
        furn.box((x - ca * 0.26, y - sa * 0.26, 0.75), (1.8, 0.05, 0.35), 'M_Furniture_Wood', seat)
        for off in (-0.75, 0.75):
            furn.box((x - sa * off, y + ca * off, 0.21), (0.06, 0.5, 0.44), 'M_Furniture_Metal', seat)
    elif k == 'bin':
        furn.cyl(x, y, 0.0, 0.26, 0.95, 'M_Furniture_Metal', 10)
    elif k == 'signal':
        furn.cyl(x, y, -0.05, 0.075, 3.4, 'M_Furniture_Metal', 8)
        furn.box((x, y, 3.0), (0.32, 0.3, 0.95), 'M_Furniture_Metal', a)
        furn.box((x + ca * 0.16, y + sa * 0.16, 3.15), (0.02, 0.18, 0.18), 'M_Furniture_LampGlass', a)
    elif k == 'busstop':
        furn.cyl(x, y, -0.05, 0.05, 2.9, 'M_Furniture_Metal', 6)
        furn.box((x, y, 2.75), (0.05, 0.5, 0.5), 'M_Furniture_Metal', a)
    elif k == 'postbox':
        furn.box((x, y, 0.5), (0.08, 0.08, 1.0), 'M_Furniture_Metal', a)
        furn.box((x, y, 1.2), (0.42, 0.32, 0.5), 'M_Furniture_Metal', a)
    elif k == 'phone':
        furn.box((x, y, 1.15), (0.9, 0.9, 2.3), 'M_Furniture_Metal', a)
    elif k == 'bikerack':
        for off in (-0.9, -0.3, 0.3, 0.9):
            furn.box((x - sa * off, y + ca * off, 0.4), (0.7, 0.05, 0.8), 'M_Furniture_Metal', a)
    elif k == 'fountain':
        fixed.cyl(x, y, 0.0, 2.3, 0.55, 'M_Fixture_Stone', 16)
        fixed.cyl(x, y, 0.55, 0.35, 1.6, 'M_Fixture_Stone', 10, 0.25)
        fixed.cyl(x, y, 2.1, 0.9, 0.25, 'M_Fixture_Stone', 12)
    elif k == 'grave':
        fixed.box((x, y, 0.38), (0.6, 0.14, 0.8), 'M_Fixture_Stone', a)


def track(g, line, sleepers=True, z=0.05):
    gauge = 0.7175
    for (x0, y0), (x1, y1) in zip(line, line[1:]):
        L = math.hypot(x1 - x0, y1 - y0)
        if L < 0.05:
            continue
        nx, ny = -(y1 - y0) / L, (x1 - x0) / L
        top = z + (0.32 if sleepers else 0.0)
        for s in (-1, 1):
            g.box_between((x0 + nx * gauge * s, y0 + ny * gauge * s), (x1 + nx * gauge * s, y1 + ny * gauge * s), 0.075,
                          top - (0.15 if sleepers else 0.02), top, 'M_RailSteel_Metal')
        if sleepers:
            n = int(L / 0.65)
            ang = math.atan2(y1 - y0, x1 - x0)
            for i in range(n):
                t = (i + 0.5) / max(n, 1)
                g.box((x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, z + 0.09), (0.25, 2.6, 0.16), 'M_Rail_Sleeper_Concrete', ang)


def container(g, c):
    name = f'M_Container_{c["colour"]}'
    for level in range(c.get('stack', 1)):
        jitter = (0.06 if level else 0.0) * (1 if hash((c['x'], c['y'])) % 2 else -1)
        g.box((c['x'], c['y'], c['h'] / 2 + level * c['h']), (c['l'], c['w'], c['h']), name, c['a'] + jitter, uvscale=3.0)


# ------------------------------------------------------------------------------------------ cameras
def review_cameras(scene, data, terrain=None):
    half = data['half']
    lift = (lambda x, y: float(terrain.at(x, y))) if terrain else (lambda x, y: 0.0)
    coll = bpy.data.collections.new('Review cameras')
    scene.collection.children.link(coll)

    def cam(name, loc, target, lens=24):
        c = bpy.data.objects.new(name, bpy.data.cameras.new(name))
        c.data.lens = lens
        c.data.clip_end = 5000
        c.location = loc
        d = np.array(target) - np.array(loc)
        c.rotation_euler = (math.atan2(math.hypot(d[0], d[1]), -d[2]), 0, math.atan2(d[1], d[0]) - math.pi / 2)
        coll.objects.link(c)
        return c
    main = cam('01_Overview', (0, -half * 1.15, half * 0.75), (0, 0, 0), 28)
    scene.camera = main
    cam('02_Overview_North', (0, half * 1.15, half * 0.75), (0, 0, 0), 28)
    for i, lm in enumerate(data.get('landmarks', [])[:4]):
        z = lift(lm['x'], lm['y'])
        cam(f'{i + 3:02d}_{safe(lm["name"])}', (lm['x'] - 45, lm['y'] - 60, 35 + z), (lm['x'], lm['y'], 8 + z), 30)


# ------------------------------------------------------------------------------------------ custom buildings
class CustomContext:
    def __init__(self, bid, b, lib, collection, tile, data):
        self.id, self.b, self.lib, self.collection, self.tile, self.data = bid, b, lib, collection, tile, data
        self.geo = Geo()
        self.footprint = b.get('footprint') if b else None
        self.objects = []

    def mat(self, role_or_name):
        b = self.b or {'style': 'plaster', 'colour': 'ivory', 'roof_style': 'tiles', 'roof_colour': 'red'}
        roles = {'upper': f'M_Wall_{b["style"].title()}_{b["colour"]}_Upper', 'ground': f'M_Wall_{b["style"].title()}_{b["colour"]}_Ground',
                 'blank': f'M_Wall_{b["style"].title()}_{b["colour"]}_Blank', 'roof': f'M_Roof_{b["roof_style"].title()}_{b["roof_colour"]}',
                 'flat': 'M_Roof_Flat_tar'}
        return roles.get(role_or_name, role_or_name)

    def finish(self):
        if self.geo:
            name = f'SM_Custom_{self.id}' + (f'_{safe(self.b["name"])}' if self.b and self.b.get('name') else '')
            # Map role names to real materials before building the object.
            self.geo.m = [self.mat(m) for m in self.geo.m]
            tile = self.tile or 'c0_0'
            if not self.tile and self.geo.v:
                cx = sum(v[0] for v in self.geo.v) / len(self.geo.v)
                cy = sum(v[1] for v in self.geo.v) / len(self.geo.v)
                tile = f'c{math.floor(cx / 60)}_{math.floor(cy / 60)}'
            self.objects.append(self.geo.to_object(name, self.collection, tile, self.lib, {'wb_building': self.id, 'wb_custom': 1}))


# ------------------------------------------------------------------------------------------ helpers for custom buildings
def frame(ring):
    """Oriented frame of a footprint along its longest edge: (cx, cy, angle, length, width)."""
    pts = [tuple(p) for p in ring]
    e = max(zip(pts, pts[1:] + pts[:1]), key=lambda ab: math.dist(*ab))
    a = math.atan2(e[1][1] - e[0][1], e[1][0] - e[0][0])
    ca, sa = math.cos(a), math.sin(a)
    us = [p[0] * ca + p[1] * sa for p in pts]
    ws = [-p[0] * sa + p[1] * ca for p in pts]
    u0, u1, w0, w1 = min(us), max(us), min(ws), max(ws)
    uc, wc = (u0 + u1) / 2, (w0 + w1) / 2
    return uc * ca - wc * sa, uc * sa + wc * ca, a, u1 - u0, w1 - w0


def local(cx, cy, a, u, w):
    """Point u metres along and w metres across a frame (see frame())."""
    return cx + u * math.cos(a) - w * math.sin(a), cy + u * math.sin(a) + w * math.cos(a)


def square(x, y, side, a=0.0):
    h = side / 2
    return [local(x, y, a, u, w) for u, w in ((-h, -h), (h, -h), (h, h), (-h, h))]


def ccw(ring):
    area = sum(ring[i][0] * ring[(i + 1) % len(ring)][1] - ring[(i + 1) % len(ring)][0] * ring[i][1] for i in range(len(ring)))
    return list(ring) if area > 0 else list(reversed(ring))


def facade(geo, ring, z0, z1, mat, bay=3.2, storey=3.0):
    """Walls around a ring with whole window bays per wall and one texture row per storey."""
    ring = ccw(ring)
    for p, q in zip(ring, ring[1:] + ring[:1]):
        L = math.dist(p, q)
        if L < 0.05:
            continue
        n = max(1, round(L / bay))
        pts = [(p[0], p[1], z0), (q[0], q[1], z0), (q[0], q[1], z1), (p[0], p[1], z1)]
        geo.face(pts, mat, [(0, z0 / storey), (n, z0 / storey), (n, z1 / storey), (0, z1 / storey)])


def gable_roof(geo, cx, cy, a, L, W, H, rise, mat='roof', gable='blank', overhang=0.4):
    """Pitched roof along the frame's long axis with gable triangles at both ends."""
    P = lambda u, w, z: (*local(cx, cy, a, u, w), z)
    hl, hw, o = L / 2, W / 2, overhang
    drop = o * rise / hw
    e0, e1, e2, e3 = P(-hl - o, -hw - o, H - drop), P(hl + o, -hw - o, H - drop), P(hl + o, hw + o, H - drop), P(-hl - o, hw + o, H - drop)
    r0, r1 = P(-hl - o, 0, H + rise), P(hl + o, 0, H + rise)
    geo.face([e0, e1, r1, r0], mat, uvscale=2.0)
    geo.face([e2, e3, r0, r1], mat, uvscale=2.0)
    for s in (-1, 1):
        geo.face([P(s * hl, -s * hw, H), P(s * hl, s * hw, H), P(s * hl, 0, H + rise)], gable, uvscale=3.0)


def spire(geo, x, y, side, z, height, a=0.0, mat='M_Roof_Metal_copper'):
    base = [(px, py, z) for px, py in square(x, y, side, a)]
    apex = (x, y, z + height)
    for i in range(4):
        geo.face([base[i], base[(i + 1) % 4], apex], mat, uvscale=2.0)


# ------------------------------------------------------------------------------------------ terrain
class Terrain:
    """The ground heights from city.json ('terrain': a square grid of metres over the flat city's ground).
    Without terrain every height is 0 and the city stays flat."""

    def __init__(self, t):
        self.t = t
        if t:
            self.x0, self.y0, self.step, self.n = t['x0'], t['y0'], t['step'], t['n']
            self.d = np.asarray(t['d'], np.float64).reshape(self.n, self.n)

    def __bool__(self):
        return bool(self.t)

    def at(self, x, y):
        x, y = np.asarray(x, np.float64), np.asarray(y, np.float64)
        if not self.t:
            return np.zeros(np.broadcast(x, y).shape)
        fy = np.clip((y - self.y0) / self.step, 0, self.n - 1.000001)
        fx = np.clip((x - self.x0) / self.step, 0, self.n - 1.000001)
        j, i = np.floor(fy).astype(int), np.floor(fx).astype(int)
        ty, tx = fy - j, fx - i
        d = self.d
        return (d[j, i] * (1 - tx) + d[j, i + 1] * tx) * (1 - ty) + (d[j + 1, i] * (1 - tx) + d[j + 1, i + 1] * tx) * ty

    @classmethod
    def of_scene(cls, scene=None):
        """The terrain stored in a built city.blend (the text block 'wb_terrain.json')."""
        import json
        txt = bpy.data.texts.get('wb_terrain.json')
        return cls(json.loads(txt.as_string()) if txt else None)


def subdivide_xy(obj, step):
    """Cut a mesh along x and y grid lines `step` apart (long walls and hedges, so they can follow the ground)."""
    import bmesh
    me = obj.data
    if not len(me.vertices):
        return
    co = np.empty(len(me.vertices) * 3, np.float32)
    me.vertices.foreach_get('co', co)
    co = co.reshape(-1, 3)
    bm = bmesh.new()
    bm.from_mesh(me)
    for axis, no in ((0, (1, 0, 0)), (1, (0, 1, 0))):
        lo, hi = float(co[:, axis].min()), float(co[:, axis].max())
        for k in range(math.floor(lo / step) + 1, math.ceil(hi / step)):
            p = [0.0, 0.0, 0.0]
            p[axis] = k * step
            bmesh.ops.bisect_plane(bm, geom=bm.verts[:] + bm.edges[:] + bm.faces[:], plane_co=p, plane_no=no)
    bm.to_mesh(me)
    bm.free()
    me.update()


def foundation(obj, b, lib):
    """A concrete foundation under a building on a slope: from its walls down to the lowest ground corner."""
    import bmesh
    drop = b.get('base', 0.0) - b.get('base_min', 0.0)
    me = obj.data
    if drop < 0.05 or not len(me.vertices) or not b.get('footprint'):
        return
    co = np.empty(len(me.vertices) * 3, np.float32)
    me.vertices.foreach_get('co', co)
    if co.reshape(-1, 3)[:, 2].min() > 0.5:                  # a floating part (building:part with min_height)
        return
    names = [m.name for m in me.materials]
    if 'M_Concrete' not in names:
        me.materials.append(lib.get('M_Concrete'))
        names.append('M_Concrete')
    mi = names.index('M_Concrete')
    ring = ccw([tuple(p) for p in b['footprint']['outer']])
    z0, z1 = -drop - 0.35, -0.1
    bm = bmesh.new()
    bm.from_mesh(me)
    uv = bm.loops.layers.uv.active or bm.loops.layers.uv.new('UVMap')
    u = 0.0
    for (ax, ay), (bx, by) in zip(ring, ring[1:] + ring[:1]):
        L = math.hypot(bx - ax, by - ay)
        if L < 0.02:
            continue
        vs = [bm.verts.new(p) for p in ((ax, ay, z0), (bx, by, z0), (bx, by, z1), (ax, ay, z1))]
        f = bm.faces.new(vs)
        f.material_index = mi
        for loop, (uu, vv) in zip(f.loops, ((u, z0), (u + L, z0), (u + L, z1), (u, z1))):
            loop[uv].uv = (uu / 2.0, vv / 2.0)
        u += L
    bm.to_mesh(me)
    bm.free()
    me.update()


def lift(obj, terrain, b=None, keep_below=None):
    """Move a mesh onto the terrain. Buildings (b with a 'base') move as one piece by their base height
    (everything within 4 m of the footprint); everything else follows the ground vertex by vertex.
    Vertices below `keep_below` (the water surface, quay foundations) stay where they are."""
    me = obj.data
    if not len(me.vertices):
        return
    co = np.empty(len(me.vertices) * 3, np.float32)
    me.vertices.foreach_get('co', co)
    co = co.reshape(-1, 3).astype(np.float64)
    M = np.array(obj.matrix_world)
    w = co @ M[:3, :3].T + M[:3, 3]
    dz = terrain.at(w[:, 0], w[:, 1])
    if b is not None and b.get('base') is not None and b.get('footprint'):
        ring = np.array(b['footprint']['outer'], np.float64)
        lo, hi = ring.min(0) - 4.0, ring.max(0) + 4.0
        near = (w[:, 0] >= lo[0]) & (w[:, 0] <= hi[0]) & (w[:, 1] >= lo[1]) & (w[:, 1] <= hi[1])
        dz = np.where(near, b['base'], dz)
    if keep_below is not None:
        dz = np.where(w[:, 2] < keep_below, 0.0, dz)
    w[:, 2] += dz
    local = (w - M[:3, 3]) @ np.linalg.inv(M[:3, :3]).T
    me.vertices.foreach_set('co', local.astype(np.float32).ravel())
    me.update()


# ------------------------------------------------------------------------------------------ arched bridges
def arch_bridge(g, pr, mats, railing=False):
    """A stone footbridge vaulted over a canal, as in Venice, from its profile (pipeline/bridges.py profile: the
    level crown, two flights of steps and the vault, at absolute heights – the object is not lifted onto the
    terrain): a brick arch from quay to quay, high enough for a boat to pass under, steps up to the crown and
    parapets with a stone cap (or iron railings). mats: body (the brick), trim (the white stone of the arch
    ring, the risers and the string course), steps (the treads, in the street's paving, so the site reads them
    as ground), cap (the parapet's top and its end posts, which the site does not) and rail."""
    L, (ux, uy), (mx, my) = pr['L'], pr['u'], pr['mid']
    nx, ny = -uy, ux                                     # (u, n, z) is right-handed: n is to the left
    hw, hl, zi, zc, wz = pr['hw'], pr['hl'], pr['zi'], pr['zc'], pr['wz']
    feet = [(sf, zf, run) for sf, zf, run, _ in pr['feet']]
    pt = 0.3                                             # the parapet's thickness
    D = hw + pt                                          # the outer faces
    xy = lambda s, d: (mx + ux * s + nx * d, my + uy * s + ny * d)
    sA, sB = feet[0][0], feet[1][0]

    def deck(s):                                         # the line through the steps' noses
        if abs(s) <= hl:
            return zc
        sf, zf, run = feet[0] if s < 0 else feet[1]
        return zf + (zc - zf) * (abs(sf) - abs(s)) / run

    # The vault: a segment of a circle springing just above the water at the quays – or, where the canal is too
    # narrow for a segment that high, a round arch on the quays as jambs. Its ring of white stone is concentric.
    f = zi - (wz + 0.15)
    r = (L * L / 4 + f * f) / (2 * f) if f <= L / 2 else L / 2
    vault = lambda s, out=0.0: zi - r + math.sqrt(max(0.0, (r + out) ** 2 - s * s))
    body, trim, steps, cap, rail = mats

    def put(pts, toward, mat, uv='sz', scale=2.0):
        """A face from (s, d, z) points, turned to face `toward` (an (s, d, z) direction)."""
        n = [0.0, 0.0, 0.0]
        for i, p in enumerate(pts):                      # Newell's normal, robust for any planar polygon
            q = pts[(i + 1) % len(pts)]
            n[0] += (p[1] - q[1]) * (p[2] + q[2])
            n[1] += (p[2] - q[2]) * (p[0] + q[0])
            n[2] += (p[0] - q[0]) * (p[1] + q[1])
        if math.sqrt(sum(c * c for c in n)) < 1e-6:
            return
        if n[0] * toward[0] + n[1] * toward[1] + n[2] * toward[2] < 0:
            pts = pts[::-1]
        k = {'sz': (0, 2), 'dz': (1, 2), 'sd': (0, 1)}[uv]
        g.face([(*xy(s, d), z) for s, d, z in pts], mat, [(p[k[0]] / scale, p[k[1]] / scale) for p in pts])

    def bar(s0, s1, d, z0, z1, t, mat):                  # a thin rail or post along s (z0 → z1)
        c = [(-t, -t), (t, -t), (t, t), (-t, t)]
        for i in range(4):
            (d0, e0), (d1, e1) = c[i], c[(i + 1) % 4]
            put([(s0, d + d0, z0 + e0), (s1, d + d0, z1 + e0), (s1, d + d1, z1 + e1), (s0, d + d1, z0 + e1)],
                (0.0, d0 + d1, e0 + e1), mat)

    top_h = 0.15 if railing else 0.95                    # a low curb under a railing, else the parapet
    flights = [(sA, -hl), (-hl, hl), (hl, sB)]
    marks = sorted({sA, sB, -hl, hl, *(-L / 2 + L * i / 14 for i in range(15))})
    marks = [s for s in marks if sA <= s <= sB]
    over_water = lambda s0, s1: -L / 2 - 1e-6 <= s0 and s1 <= L / 2 + 1e-6
    for d in (D, -D):
        out = (0.0, d, 0.0)
        # The outer face, in flush bands from the bottom up (nothing laid over anything, so nothing flickers): the
        # arch ring of white stone over the water – concentric with the vault, thinner where the steps come close –
        # or brick from below the street over the quays; brick; the string course of white stone; the parapet.
        for s0, s1 in zip(marks, marks[1:]):
            wet = over_water(s0, s1)

            def bands(s):
                lo = vault(s) if wet else (feet[0][1] if s < 0 else feet[1][1]) - 0.5
                ring = max(lo, min(vault(s, 0.3), deck(s) - 0.3)) if wet else lo
                return [lo, ring, deck(s) - 0.22, deck(s) - 0.06, deck(s) + top_h]
            b0, b1 = bands(s0), bands(s1)
            for k, mat in enumerate((trim, body, trim, body)):
                put([(s0, d, b0[k]), (s1, d, b1[k]), (s1, d, max(b1[k], b1[k + 1])), (s0, d, max(b0[k], b0[k + 1]))], out, mat)
        # The parapet's inner face and its cap.
        inner = math.copysign(hw, d)
        for s0, s1 in flights:
            put([(s0, inner, deck(s0) - 0.25), (s1, inner, deck(s1) - 0.25), (s1, inner, deck(s1) + top_h), (s0, inner, deck(s0) + top_h)],
                (0.0, -d, 0.0), body)
            put([(s0, inner, deck(s0) + top_h), (s1, inner, deck(s1) + top_h), (s1, d, deck(s1) + top_h), (s0, d, deck(s0) + top_h)],
                (0.0, 0.0, 1.0), cap, 'sd')
        # Stone posts where the parapets (or railings) end, at the foot of each flight.
        for sf, zf, _ in feet:
            a, b, z = sf, sf - math.copysign(0.36, sf), zf + max(top_h + 0.22, 1.05)
            c0, c1 = inner - math.copysign(0.04, d), d + math.copysign(0.04, d)
            put([(a, c0, z), (b, c0, z), (b, c1, z), (a, c1, z)], (0.0, 0.0, 1.0), cap, 'sd')
            for p, q, tw in (((a, c0), (a, c1), (math.copysign(1, sf), 0, 0)), ((b, c0), (b, c1), (-math.copysign(1, sf), 0, 0)),
                             ((a, c1), (b, c1), (0, d, 0)), ((a, c0), (b, c0), (0, -d, 0))):
                put([(p[0], p[1], zf - 0.1), (q[0], q[1], zf - 0.1), (q[0], q[1], z), (p[0], p[1], z)], tw, cap)
        if railing:                                      # iron: a handrail, a middle rail and posts
            m = math.copysign(hw + pt / 2, d)
            for s0, s1 in flights:
                bar(s0, s1, m, deck(s0) + 1.0, deck(s1) + 1.0, 0.025, rail)
                bar(s0, s1, m, deck(s0) + 0.55, deck(s1) + 0.55, 0.015, rail)
            k = max(2, int((sB - sA) / 1.1))
            for i in range(k + 1):
                s = sA + 0.4 + (sB - sA - 0.8) * i / k
                post = [(s - 0.02, m - 0.02), (s + 0.02, m - 0.02), (s + 0.02, m + 0.02), (s - 0.02, m + 0.02)]
                for j in range(4):
                    p, q = post[j], post[(j + 1) % 4]
                    put([(p[0], p[1], deck(s) + top_h), (q[0], q[1], deck(s) + top_h), (q[0], q[1], deck(s) + 1.0), (p[0], p[1], deck(s) + 1.0)],
                        ((p[0] + q[0]) / 2 - s, (p[1] + q[1]) / 2 - m, 0.0), rail)
    # The vault's underside, from quay to quay.
    wet = [s for s in marks if -L / 2 - 1e-6 <= s <= L / 2 + 1e-6]
    for s0, s1 in zip(wet, wet[1:]):
        put([(s0, D, vault(s0)), (s1, D, vault(s1)), (s1, -D, vault(s1)), (s0, -D, vault(s0))], (0.0, 0.0, -1.0), body, 'sd')
    # The steps: white stone risers and treads in the street's paving, up each flight to the level crown.
    for sf, zf, run, n in pr['feet']:
        side = math.copysign(1.0, sf)
        rise, tread = (zc - zf) / n, run / n
        for k in range(n):
            s_out, s_in = sf - side * k * tread, sf - side * (k + 1) * tread
            z0, z1 = zf + k * rise, zf + (k + 1) * rise
            put([(s_out, -hw, z0), (s_out, hw, z0), (s_out, hw, z1), (s_out, -hw, z1)], (side, 0.0, 0.0), trim, 'dz')
            put([(s_out, -hw, z1), (s_in, -hw, z1), (s_in, hw, z1), (s_out, hw, z1)], (0.0, 0.0, 1.0), steps, 'sd')
    put([(-hl, -hw, zc), (hl, -hw, zc), (hl, hw, zc), (-hl, hw, zc)], (0.0, 0.0, 1.0), steps, 'sd')
