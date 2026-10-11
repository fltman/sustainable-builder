# Kalmar 2126 vehicles: procedural low-poly vehicles modelled in Blender, exported as one GLB.
#
#   /Applications/Blender.app/Contents/MacOS/Blender --background --factory-startup \
#       --python tools/build-vehicles.py [-- name ...]
#
# Writes public/models/vehicles.glb (one node + mesh per vehicle) and art/vehicles.blend.
# Every mesh: metres, forward +Z, up +Y, centred on the origin, wheels (boats: the waterline) on
# y = 0. Attributes: POSITION, NORMAL, COLOR_0 (linear RGB, baked AO) and _TINT (1 on the paint that
# takes the per-instance colour, 0 elsewhere). No textures. src/vehicles3d.js loads it.
#
# Surfaces are built from lofted cross-sections (car and pod bodies, hulls) or bevelled boxes (bus,
# tram), with a material class per face; modifiers (bevel, subdivision, solidify) are applied and
# keep the classes, so colour borders stay crisp. Normals are split at 40 degrees.
import bpy, bmesh, math, os, sys, json, struct, time
import numpy as np
from mathutils import Vector, Matrix
from mathutils.bvhtree import BVHTree

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
OUT = os.path.join(ROOT, 'public', 'models', 'vehicles.glb')
BLEND = os.path.join(ROOT, 'art', 'vehicles.blend')
ARGS = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
ONLY = [a for a in ARGS if not a.startswith('-')]
X, Y, Z = Vector((1, 0, 0)), Vector((0, 1, 0)), Vector((0, 0, 1))
rad = math.radians


def v(x, y, z): return Vector((x, y, z))
def lerp(a, b, t): return a + (b - a) * t
def clamp(x, a=0.0, b=1.0): return max(a, min(b, x))
def smooth(e0, e1, x): t = clamp((x - e0) / (e1 - e0)); return t * t * (3 - 2 * t)
def sgnpow(x, p): return math.copysign(abs(x) ** p, x)
def hexc(h): return (((h >> 16) & 255) / 255.0, ((h >> 8) & 255) / 255.0, (h & 255) / 255.0)
def to_lin(c): return tuple((x / 12.92) if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c)


# Material classes: sRGB colour, tint flag
PAL = {
    'paint': (0xf1f1ef, 1), 'glass': (0x24333f, 0), 'trim': (0x25282b, 0), 'tyre': (0x151617, 0), 'rim': (0xb4b9be, 0),
    'rim_dark': (0x4a4e53, 0), 'light_f': (0xfff6e2, 0), 'light_r': (0xb4141c, 0), 'lightbar': (0x3fe0cf, 0), 'amber': (0xffb547, 0),
    'chrome': (0xc6cacf, 0), 'interior': (0x34373b, 0), 'seat': (0x3f5466, 0), 'deck': (0xa77b4f, 0), 'antifoul': (0x2a3c4e, 0),
    'white': (0xf3f3f0, 0), 'rubber': (0x2c2d2f, 0), 'foil': (0x3a3f45, 0), 'panto': (0x5c6166, 0), 'wood': (0x9b7748, 0),
    'grey': (0x9ea3a8, 0), 'saddle': (0x4a3426, 0), 'grip': (0x3a2a20, 0), 'roofpod': (0xd9dcdf, 0), 'solar': (0x1d2b3d, 0),
}
CLASSES = list(PAL)
CI = {k: i for i, k in enumerate(CLASSES)}


# ------------------------------------------------------------------------------------------------
# Geometry helpers (Blender coordinates: Z up, vehicles face -Y)
# ------------------------------------------------------------------------------------------------
class Geo:
    """Polygon soup with a material class per face."""
    def __init__(s, verts=None, faces=None, mats=None):
        s.v = list(verts or []); s.f = list(faces or []); s.m = list(mats or [])

    def add(s, other):
        o = len(s.v); s.v += other.v; s.f += [tuple(i + o for i in f) for f in other.f]; s.m += other.m
        return s


def axes(d, uh, wh):
    d = d.normalized(); u = uh - d * uh.dot(d)
    if u.length < 1e-6: u = wh.cross(d)
    u.normalize(); w = d.cross(u); w.normalize()
    if w.dot(wh) < 0: w = -w
    return d, u, w


def ring(c, d, n, a, b, e=2.0, uh=X, wh=Z, phase=0.0):
    d, u, w = axes(d, uh, wh)
    return [c + u * (a * sgnpow(math.cos(2 * math.pi * k / n + phase), 2 / e)) + w * (b * sgnpow(math.sin(2 * math.pi * k / n + phase), 2 / e)) for k in range(n)]


def centroid(p): return sum(p, Vector()) / len(p)


def loft(rings, cap0=None, cap1=None, mat='paint', closed=True):
    n = len(rings[0]); V = [p.copy() for r in rings for p in r]; F = []
    for r in range(len(rings) - 1):
        o = r * n
        for i in range(n if closed else n - 1):
            j = (i + 1) % n; F.append((o + i, o + j, o + n + j, o + n + i))

    def cap(ri, pos):  # the start cap winds the other way so it agrees with the tube
        ci = len(V); V.append(pos.copy()); o = ri * n
        for i in range(n): F.append((o + (i + 1) % n, o + i, ci) if ri == 0 else (o + i, o + (i + 1) % n, ci))
    if cap0 is not None: cap(0, centroid(rings[0]) if isinstance(cap0, str) else cap0)
    if cap1 is not None: cap(len(rings) - 1, centroid(rings[-1]) if isinstance(cap1, str) else cap1)
    return Geo(V, F, [mat] * len(F))


def orient(g, center=None):
    c = center if center is not None else centroid(g.v); score = 0.0
    for f in g.f:
        p = [g.v[i] for i in f]; score += (p[1] - p[0]).cross(p[2] - p[0]).dot(centroid(p) - c)
    if score < 0: g.f = [tuple(reversed(f)) for f in g.f]
    return g


def realize(g, mods=(), recalc=True):
    me = bpy.data.meshes.new('tmp'); me.from_pydata([tuple(p) for p in g.v], [], g.f); me.update()
    me.attributes.new('cls', 'INT', 'FACE').data.foreach_set('value', [CI[m] for m in g.m])
    if recalc:
        bm = bmesh.new(); bm.from_mesh(me); bmesh.ops.recalc_face_normals(bm, faces=bm.faces); bm.to_mesh(me); bm.free()
    def classes(m):
        a = m.attributes['cls']; vals = [0] * len(m.polygons); a.data.foreach_get('value', vals); return [CLASSES[x] for x in vals]
    if not mods:
        out = Geo([x.co.copy() for x in me.vertices], [tuple(p.vertices) for p in me.polygons], classes(me))
        bpy.data.meshes.remove(me); return out
    ob = bpy.data.objects.new('tmp', me); bpy.context.scene.collection.objects.link(ob)
    temps = []
    for kind, params in mods:
        m = ob.modifiers.new(kind.lower(), kind)
        for k, val in params.items():
            if isinstance(val, Geo):  # boolean operand given as geometry
                cm = bpy.data.meshes.new('cut'); cm.from_pydata([tuple(p) for p in val.v], [], val.f); cm.update()
                cm.attributes.new('cls', 'INT', 'FACE').data.foreach_set('value', [CI[x] for x in val.m])
                co = bpy.data.objects.new('cut', cm); bpy.context.scene.collection.objects.link(co); co.hide_render = True
                temps.append(co); val = co
            setattr(m, k, val)
    dg = bpy.context.evaluated_depsgraph_get(); ev = ob.evaluated_get(dg); me2 = ev.to_mesh()
    out = Geo([x.co.copy() for x in me2.vertices], [tuple(p.vertices) for p in me2.polygons], classes(me2))
    ev.to_mesh_clear(); bpy.data.objects.remove(ob, do_unlink=True); bpy.data.meshes.remove(me)
    for co in temps: cm = co.data; bpy.data.objects.remove(co, do_unlink=True); bpy.data.meshes.remove(cm)
    return out


def box(c, size, mat='paint', bevel=0.0, seg=2, sub=0):
    """Box centred at c; size = full extents. Optional rounded edges (bevel modifier)."""
    sx, sy, sz = (x / 2 for x in size)
    V = [c + v(x * sx, y * sy, z * sz) for x in (-1, 1) for y in (-1, 1) for z in (-1, 1)]
    F = [(0, 1, 3, 2), (4, 6, 7, 5), (0, 4, 5, 1), (2, 3, 7, 6), (0, 2, 6, 4), (1, 5, 7, 3)]
    g = orient(Geo(V, F, [mat] * 6), c)
    mods = []
    if bevel > 0: mods.append(('BEVEL', dict(width=min(bevel, min(size) * 0.49), segments=seg, limit_method='NONE', affect='EDGES')))
    if sub: mods.append(('SUBSURF', dict(levels=sub, render_levels=sub)))
    return realize(g, mods) if mods else g


def cyl(p0, p1, r, n=12, mat='paint', r1=None, caps=True, bevel=0.0, seg=1):
    d = p1 - p0; r1 = r if r1 is None else r1
    rings = [ring(p0, d, n, r, r, uh=X if abs(d.normalized().dot(X)) < .9 else Y), ring(p1, d, n, r1, r1, uh=X if abs(d.normalized().dot(X)) < .9 else Y)]
    g = orient(loft(rings, 'flat' if caps else None, 'flat' if caps else None, mat), (p0 + p1) / 2)
    if bevel: g = realize(g, [('BEVEL', dict(width=bevel, segments=seg, limit_method='ANGLE', angle_limit=rad(30)))])
    return g


def ellipsoid(c, rx, ry, rz, nu=10, nv=6, mat='paint'):
    rings = []
    for j in range(1, nv):
        th = math.pi * j / nv
        rings.append([c + v(math.sin(th) * math.cos(2 * math.pi * k / nu) * rx, math.sin(th) * math.sin(2 * math.pi * k / nu) * ry, -math.cos(th) * rz) for k in range(nu)])
    return orient(loft(rings, c - v(0, 0, rz), c + v(0, 0, rz), mat), c)


def torus(c, axis, R, r, nu=16, nv=6, a0=0.0, a1=2 * math.pi, closed=True, mat='tyre', flat=1.0):
    axis = axis.normalized(); e1 = (Z if abs(axis.dot(Z)) < .9 else X).cross(axis).normalized(); e2 = axis.cross(e1)
    rings = []
    for k in range(nu if closed else nu + 1):
        t = a0 + (a1 - a0) * k / nu; radial = e1 * math.cos(t) + e2 * math.sin(t); cen = c + radial * R
        rings.append([cen + radial * math.cos(2 * math.pi * j / nv) * r + axis * math.sin(2 * math.pi * j / nv) * r * flat for j in range(nv)])
    if closed:
        g = loft(rings + [rings[0]], None, None, mat)
        n = nv; last = len(rings)
        g.v = g.v[:last * n]; g.f = [tuple(i - last * n if i >= last * n else i for i in f) for f in g.f]
        return orient(g, c)
    return orient(loft(rings, 'flat', 'flat', mat), c)


def rod(p0, p1, r, n=6, mat='trim', r1=None): return cyl(p0, p1, r, n, mat, r1)


def tube(pts, r, n=6, mat='paint', caps=True):
    """Tube through a polyline (bike frames, rails)."""
    rings = []
    for i, p in enumerate(pts):
        d = (pts[min(i + 1, len(pts) - 1)] - pts[max(i - 1, 0)])
        rings.append(ring(p, d, n, r, r, uh=X if abs(d.normalized().dot(X)) < .9 else Y, wh=Z if abs(d.normalized().dot(Z)) < .9 else Y))
    return orient(loft(rings, 'flat' if caps else None, 'flat' if caps else None, mat), centroid(pts))


def mirror_x(g):
    m = Geo([v(-p.x, p.y, p.z) for p in g.v], [tuple(reversed(f)) for f in g.f], list(g.m)); return m


def both(g): return Geo().add(g).add(mirror_x(g))


def wheel(c, R, w, mat_rim='rim', hub=0.55, n=18, spokes=5, side=1):
    """Tyre with rounded shoulders, an inset rim face and a hub; axis along X."""
    g = Geo()
    prof = [(R * 0.62, -w / 2), (R * 0.93, -w / 2), (R, -w * 0.32), (R, w * 0.32), (R * 0.93, w / 2), (R * 0.62, w / 2)]
    rings = []
    for k in range(n):
        t = 2 * math.pi * k / n
        rings.append([c + v(x, 0, 0) + v(0, math.cos(t) * r, math.sin(t) * r) for r, x in prof])
    # loft around the axis
    m = len(prof)
    V = [p for r in rings for p in r]; F = []
    for k in range(n):
        a, b = k * m, ((k + 1) % n) * m
        for j in range(m - 1): F.append((a + j, b + j, b + j + 1, a + j + 1))
    tyre = Geo(V, F, ['tyre'] * len(F))
    g.add(orient(tyre, c) if False else tyre)
    # rim discs (both sides), slightly inset, with a hub cone
    for s in (-1, 1):
        x = s * (w / 2 - 0.012)
        rim = [c + v(x, math.cos(2 * math.pi * k / n) * R * 0.63, math.sin(2 * math.pi * k / n) * R * 0.63) for k in range(n)]
        g.add(orient(loft([rim], None, c + v(x + s * 0.02, 0, 0), mat_rim), c + v(x - s * 0.5, 0, 0)))
    g = realize(g, recalc=False)
    # fix tyre winding: outward from the axis
    return fix_out(g, c, X)


def fix_out(g, c, axis):
    """Orient each face outward from an axis line through c (for wheels and tubes built by hand)."""
    F = []
    for f in g.f:
        p = [g.v[i] for i in f]; n = (p[1] - p[0]).cross(p[2] - p[0]); cc = centroid(p)
        rel = cc - c; radial = rel - axis * rel.dot(axis)
        ref = radial if radial.length > 1e-4 else axis * (1 if rel.dot(axis) > 0 else -1)
        if abs(n.dot(axis)) > 0.7 * n.length: ref = axis * (1 if rel.dot(axis) > 0 else -1)
        F.append(f if n.dot(ref) >= 0 else tuple(reversed(f)))
    g.f = F; return g


# ------------------------------------------------------------------------------------------------
# Lofted car-like bodies
# ------------------------------------------------------------------------------------------------
def snap(g, origin, direction, offset=0.0):
    """First hit of a ray on g (e.g. a light against a smoothed body), pulled back by offset."""
    bvh = BVHTree.FromPolygons([tuple(p) for p in g.v], g.f)
    d = direction.normalized(); loc, nrm, _, _ = bvh.ray_cast(origin, d, 10.0)
    return (loc - d * offset) if loc is not None else origin


def strip(g, xs, y_from, z, direction, r=0.02, mat='light_f', inset=0.008):
    """A light strip that follows a curved surface: points snapped along xs, joined by a tube."""
    pts = [snap(g, v(x, y_from, z), direction, inset) for x in xs]
    return tube(pts, r, 6, mat)


def cage_body(stations, classify, n_sub=1, arches=(), arch_r=0.40, arch_w=2.4, crease_bottom=True):
    """Coarse cage loft (stations: [(y, zb, zs, zr, wb, wr)], rear +y to front -y) smoothed by a
    subdivision surface; wheel arches cut by boolean cylinders (their walls become the dark liners)."""
    rings = []; ys = []
    for y, zb, zs, zr, wb, wr in stations:
        left = [(-(wb - 0.10), zb), (-(wb - 0.01), zb + 0.07), (-wb, zb + 0.45 * (zs - zb)), (-(wb - 0.015), zs - 0.06), (-(wb - 0.045), zs),
                (-wr, zr - 0.09), (-(wr - 0.10), zr - 0.01), (-wr * 0.4, zr + 0.005), (0.0, zr + 0.008)]
        pts = left + [(-x, z) for x, z in reversed(left[:-1])] + [(0.0, zb - 0.005)]
        rings.append([v(x, y, z) for x, z in pts]); ys.append(y)
    n = len(rings[0]); V = [p for r in rings for p in r]; F = []; M = []
    nb = len(left)
    for r in range(len(rings) - 1):
        o = r * n
        for i in range(n):
            j = (i + 1) % n
            F.append((o + i, o + j, o + n + j, o + n + i))
            band = i if i < nb - 1 else (2 * (nb - 1) - 1 - i if i < 2 * (nb - 1) else -1)
            M.append(classify(ys[r], ys[r + 1], band))
    g = Geo(V, F, M)
    for ri in (0, len(rings) - 1):
        ci = len(g.v); g.v.append(centroid(rings[ri])); o = ri * n
        for i in range(n):
            g.f.append((o + (i + 1) % n, o + i, ci) if ri == 0 else (o + i, o + (i + 1) % n, ci)); g.m.append(classify(ys[ri], ys[ri], 'cap'))
    g = orient(g, v(0, 0, 0.8))
    mods = [('SUBSURF', dict(levels=n_sub, render_levels=n_sub))]
    if arches:
        cut = Geo()
        for ay, zc in arches: cut.add(cyl(v(-arch_w / 2, ay, zc), v(arch_w / 2, ay, zc), arch_r, 28, 'trim'))
        mods.append(('BOOLEAN', dict(operation='DIFFERENCE', solver='EXACT', object=cut, material_mode='INDEX')))
    return realize(g, mods)


def ebus():
    """Electric city bus, 12.0 x 2.55 x 3.05 m (3.30 with the roof pods); doors on the right (-X)."""
    out = Geo(); L = 12.0; W = 2.55; H = 3.0; fa, ra = -3.35, 2.65; R = 0.49
    body = box(v(0, 0, 0.32 + (H - 0.32) / 2), (W, L, H - 0.32), 'paint', bevel=0.16, seg=3)
    cut = Geo().add(cyl(v(-2, fa, R), v(2, fa, R), R + 0.07, 28, 'trim')).add(cyl(v(-2, ra, R), v(2, ra, R), R + 0.07, 28, 'trim'))
    body = realize(body, [('BOOLEAN', dict(operation='DIFFERENCE', solver='EXACT', object=cut, material_mode='INDEX'))])
    out.add(body)
    # glazing: a continuous dark band with pillars, windscreen, rear window
    out.add(both(box(v(W / 2 - 0.004, 0.25, 1.86), (0.03, L - 1.0, 1.30), 'glass', bevel=0.02)))
    for y in np.arange(-4.4, 5.6, 1.45):
        out.add(both(box(v(W / 2 + 0.008, y, 1.86), (0.02, 0.07, 1.30), 'trim')))
    out.add(box(v(0, -L / 2 + 0.01, 1.78), (W - 0.24, 0.06, 1.62), 'glass', bevel=0.05))
    out.add(box(v(0, -L / 2 - 0.005, 2.78), (1.9, 0.05, 0.22), 'amber', bevel=0.02))
    out.add(box(v(0, L / 2 - 0.01, 2.05), (W - 0.5, 0.06, 0.9), 'glass', bevel=0.04))
    # doors on the right side (three double doors)
    for y in (-5.0, -0.6, 3.9):
        out.add(box(v(-W / 2 - 0.006, y, 1.42), (0.03, 1.25, 2.12), 'glass', bevel=0.015))
        out.add(box(v(-W / 2 - 0.012, y, 1.42), (0.02, 0.05, 2.12), 'trim'))
    # bumpers, lights, wheels and arches, roof pods (batteries, HVAC)
    out.add(box(v(0, -L / 2 - 0.02, 0.48), (W - 0.1, 0.12, 0.30), 'trim', bevel=0.04))
    out.add(box(v(0, L / 2 + 0.02, 0.48), (W - 0.1, 0.12, 0.30), 'trim', bevel=0.04))
    for s in (1, -1):
        out.add(box(v(s * 0.95, -L / 2 - 0.03, 0.78), (0.40, 0.05, 0.10), 'light_f', bevel=0.02))
        out.add(box(v(s * 1.12, L / 2 + 0.02, 0.95), (0.16, 0.05, 0.50), 'light_r', bevel=0.03))
    for y in (fa, ra):
        for s in (1, -1): out.add(wheel(v(s * (W / 2 - 0.20), y, R), R, 0.30 if y == fa else 0.42, mat_rim='rim_dark'))
    out.add(box(v(0, 0.5, H + 0.12), (2.0, 5.4, 0.26), 'roofpod', bevel=0.10, seg=2))
    out.add(box(v(0, 4.4, H + 0.10), (1.8, 2.2, 0.22), 'roofpod', bevel=0.09, seg=2))
    out.add(box(v(0, -4.6, H + 0.06), (1.6, 1.2, 0.14), 'roofpod', bevel=0.06, seg=2))
    # cut-outs of the arches are faked by the dark wells; the body skirt sits above the wheels
    return out


def tram():
    """Five-module articulated low-floor tram, ~30 m, pantograph on the middle module."""
    out = Geo(); W = 2.65; H = 3.45; mods = [7.0, 4.6, 4.2, 4.6, 7.0]; gap = 0.5
    total = sum(mods) + gap * (len(mods) - 1); y = -total / 2
    for i, Lm in enumerate(mods):
        c = y + Lm / 2; cab = i in (0, len(mods) - 1); front = i == 0
        body = box(v(0, c, 0.30 + (H - 0.30) / 2), (W, Lm, H - 0.30), 'paint', bevel=0.20, seg=3)
        out.add(body)
        if cab:  # sloped nose with a big windscreen and the destination display
            e = -1 if front else 1; yn = c + e * Lm / 2
            nose = loft([ring(v(0, yn - e * 0.15, 1.75), Y, 16, W / 2 - 0.02, (H - 0.3) / 2 - 0.02, e=4.5), ring(v(0, yn + e * 0.45, 1.65), Y, 16, W / 2 - 0.25, (H - 0.3) / 2 - 0.30, e=3.5),
                         ring(v(0, yn + e * 0.62, 1.50), Y, 16, W / 2 - 0.55, (H - 0.3) / 2 - 0.70, e=3.0)], None, 'flat', 'paint')
            nose = orient(nose, v(0, yn - e * 0.3, 1.7))
            nm = []
            for f in nose.f:
                cz = centroid([nose.v[k] for k in f]).z
                nm.append('glass' if 1.25 < cz < 3.0 else 'paint')
            nose.m = nm
            out.add(realize(nose))
            out.add(box(v(0, yn + e * 0.06, 3.02), (1.6, 0.30, 0.20), 'amber', bevel=0.03))
            for s in (1, -1): out.add(box(v(s * 0.85, yn + e * 0.50, 0.92), (0.32, 0.12, 0.10), 'light_f' if front else 'light_r', bevel=0.03))
        # windows and doors (doors on both sides)
        win = Lm - (1.2 if cab else 0.5)
        out.add(both(box(v(W / 2 - 0.006, c - (0.35 if front else -0.35 if cab else 0), 2.05), (0.03, win, 1.25), 'glass', bevel=0.02)))
        dy = c + (0.9 if front else -0.9 if cab else 0)
        out.add(both(box(v(W / 2 + 0.004, dy, 1.45), (0.03, 1.30, 2.30), 'glass', bevel=0.02)))
        out.add(both(box(v(W / 2 + 0.012, dy, 1.45), (0.02, 0.05, 2.30), 'trim')))
        out.add(both(box(v(W / 2 - 0.06, c, 0.20), (0.14, Lm - 0.4, 0.26), 'trim')))  # skirts
        if Lm > 6 or i == 2:  # bogies
            for by in ((c,) if i == 2 else (c - e * 1.8 if cab else c,)):
                for s in (1, -1):
                    for wy in (by - 0.9, by + 0.9): out.add(wheel(v(s * 0.72, wy, 0.33), 0.33, 0.14, mat_rim='rim_dark'))
                out.add(box(v(0, by, 0.38), (1.6, 2.6, 0.36), 'trim'))
        out.add(box(v(0, c, H + 0.08), (1.7, Lm * 0.7, 0.18), 'roofpod', bevel=0.07, seg=2))
        y += Lm
        if i < len(mods) - 1:  # bellows between modules
            bel = [ring(v(0, y + gap * t - 0.15 + 0.3 * t, 1.80), Y, 16, W / 2 - 0.05 - 0.035 * math.sin(math.pi * t), (H - 0.42) / 2 - 0.035 * math.sin(math.pi * t), e=6) for t in (0, 0.25, 0.5, 0.75, 1.0)]
            out.add(realize(orient(loft(bel, None, None, 'rubber'), v(0, y + gap / 2, 1.85))))
            y += gap
    # pantograph on the middle module (lowered diamond)
    c = 0.0; top = H + 0.18
    out.add(box(v(0, c, top + 0.05), (0.9, 0.9, 0.10), 'panto'))
    pts = [v(0, c - 0.55, top + 0.10), v(0, c + 0.35, top + 0.62), v(0, c - 0.10, top + 0.95)]
    for s in (1, -1):
        out.add(tube([p + v(s * 0.30, 0, 0) for p in pts], 0.022, 5, 'panto'))
    out.add(cyl(v(-0.75, c - 0.10, top + 0.97), v(0.75, c - 0.10, top + 0.97), 0.03, 6, 'panto'))
    return out


# ------------------------------------------------------------------------------------------------
# Bikes
# ------------------------------------------------------------------------------------------------
def bike_geo(cargo=False):
    """City bike (step-through) or a long-john cargo bike with a front box. Frame = paint (tinted)."""
    out = Geo(); Rr = 0.35
    if cargo:
        FA, RA, BB, Rf = v(0, -0.88, 0.25), v(0, 0.95, 0.33), v(0, 0.50, 0.29), 0.25
        HT, HB = v(0, 0.02, 0.95), v(0, -0.02, 0.76)
        sad = BB + v(0, 0.30, 0.62); Rr = 0.33
    else:
        FA, RA, BB, Rf = v(0, -0.56, 0.35), v(0, 0.55, 0.35), v(0, 0.11, 0.28), 0.35
        HT, HB = v(0, -0.425, 0.86), v(0, -0.465, 0.70)
        sad = BB + v(0, 0.34, 0.94).normalized() * 0.60
    F = 'paint'
    if cargo:
        out.add(tube([HB, v(0, -0.15, 0.42), v(0, -0.55, 0.36), FA + v(0, 0.12, 0.05)], 0.024, 6, F))  # long-john boom
        out.add(tube([HB + v(0, 0.01, 0.0), v(0, 0.25, 0.42), BB], 0.024, 6, F))
        out.add(cyl(FA + v(0.04, 0.10, 0.08), FA + v(0.03, 0, 0), 0.012, 5, F)); out.add(cyl(FA + v(-0.04, 0.10, 0.08), FA + v(-0.03, 0, 0), 0.012, 5, F))
        # steering rod and fork of the small front wheel
        out.add(rod(HB + v(0, 0, -0.05), FA + v(0, 0.15, 0.25), 0.008, 4, 'grey'))
        for s in (1, -1): out.add(rod(FA + v(0, 0.12, 0.28), FA + v(s * 0.035, 0, 0), 0.012, 5, F))
        # cargo box (wood) with a bench
        bx = v(0, -0.40, 0.62)
        out.add(box(bx + v(0, 0, -0.17), (0.62, 0.70, 0.03), 'wood'))
        for s in (1, -1):
            out.add(box(bx + v(s * 0.30, 0, 0), (0.025, 0.70, 0.36), 'wood', bevel=0.006, seg=1))
            out.add(box(bx + v(0, s * 0.34, 0), (0.62, 0.025, 0.36), 'wood', bevel=0.006, seg=1))
        out.add(box(bx + v(0, 0.24, -0.02), (0.56, 0.16, 0.03), 'wood'))
    else:
        out.add(tube([HB + v(0, 0.01, 0.03), v(0, -0.34, 0.53), v(0, -0.15, 0.36), BB], 0.019, 6, F))
        out.add(tube([HT + v(0, 0.005, -0.03), v(0, -0.30, 0.66), v(0, -0.06, 0.50), BB + v(0, 0.34, 0.94).normalized() * 0.22], 0.018, 6, F))
        for s in (1, -1): out.add(rod(HB + v(0.03 * s, 0, 0), FA + v(0.05 * s, 0, 0), 0.012, 5, F, 0.009))
    out.add(rod(BB, sad - (sad - BB).normalized() * 0.03, 0.018, 6, F))
    out.add(rod(HB - v(0, 0.01, 0.035), HT + v(0, 0.003, 0.03), 0.022, 8, F))
    for s in (1, -1):
        out.add(rod(BB + v(0.02 * s, 0, 0), RA + v(0.055 * s, 0, 0), 0.011, 5, F, 0.009))
        out.add(rod(BB + (sad - BB) * 0.78 + v(0.012 * s, 0.01, 0), RA + v(0.055 * s, 0, 0.01), 0.010, 5, F, 0.008))
        out.add(rod(v(0.075 * s, RA.y - 0.25, RA.z + 0.42), v(0.075 * s, RA.y + 0.31, RA.z + 0.40), 0.006, 4, 'trim'))
        out.add(rod(v(0.075 * s, RA.y + 0.29, RA.z + 0.40), RA + v(0.06 * s, 0.02, 0), 0.006, 4, 'trim'))
    for k in range(3):
        yy = RA.y - 0.15 + k * 0.22
        out.add(rod(v(-0.075, yy, RA.z + 0.415), v(0.075, yy, RA.z + 0.415), 0.006, 4, 'trim'))
    stem = HT + v(0, 0.01, 0.125)
    out.add(rod(HT, stem, 0.014, 6, 'chrome'))
    for s in (1, -1):
        g = stem + v(0.275 * s, 0.22, 0.02)
        out.add(tube([stem, stem + v(0.13 * s, 0, 0), stem + v(0.235 * s, 0.085, 0.008), g + v(0, -0.07, 0)], 0.011, 6, 'chrome'))
        out.add(rod(g + v(0, -0.075, 0), g + v(0.01 * s, 0.035, 0), 0.016, 6, 'grip'))
    # saddle
    pl = [sad + v(0, -0.12, 0.03), sad + v(0, 0.11, 0.03)]
    rings = [ring(lerp(pl[0], pl[1], t), Y, 10, w, h, e=2.2) for t, w, h in ((0, .02, .012), (0.25, .03, .016), (0.6, .075, .022), (0.9, .085, .022), (1.0, .07, .016))]
    out.add(orient(loft(rings, 'flat', 'flat', 'saddle'), sad + v(0, 0, 0.03)))
    # fenders, chain guard, lamps
    for c, Rw, a0, a1 in ((FA, Rf, rad(-35), rad(205)), (RA, Rr, rad(-30), rad(215))):
        out.add(torus(c, X, Rw + 0.035, 0.03, 14, 4, a0, a1, closed=False, mat=F, flat=0.25))
    cg = [BB + v(-0.07, -0.06, 0.02), RA + v(-0.07, -0.05, 0.03)]
    out.add(orient(loft([ring(p, cg[1] - cg[0], 6, 0.006, 0.06, e=4, uh=X, wh=Z) for p in cg], 'flat', 'flat', 'trim'), (cg[0] + cg[1]) / 2))
    if not cargo:
        rings = [ring(v(0, -0.63, z), Z, 12, a, b, e=5.0, uh=X, wh=Y) for z, a, b in ((0.80, 0.15, 0.115), (0.815, 0.165, 0.13), (0.98, 0.175, 0.14), (0.985, 0.16, 0.125), (0.94, 0.15, 0.115))]
        out.add(orient(loft(rings, 'flat', None, 'wood'), v(0, -0.63, 0.88)))
    out.add(ellipsoid(HB + v(0, -0.06, 0.05), 0.028, 0.03, 0.028, 8, 4, 'light_f'))
    out.add(ellipsoid(v(0, RA.y + 0.33, RA.z + 0.40), 0.025, 0.012, 0.018, 6, 3, 'light_r'))
    # wheels: tyre, rim, spokes, hub; cranks, chainring and pedals
    for c, Rw in ((FA, Rf), (RA, Rr)):
        out.add(torus(c, X, Rw - 0.022, 0.022, 20, 5, mat='tyre'))
        out.add(torus(c, X, Rw - 0.046, 0.008, 20, 3, mat='chrome', flat=1.6))
        out.add(cyl(c + v(-0.04, 0, 0), c + v(0.04, 0, 0), 0.018, 6, 'chrome'))
        for k in range(8):
            t = math.pi * k / 8; d = v(0, math.cos(t), math.sin(t)) * (Rw - 0.05)
            out.add(rod(c - d, c + d, 0.0035, 3, 'chrome'))
    out.add(cyl(BB + v(-0.055, 0, 0), BB + v(-0.045, 0, 0), 0.095, 14, 'grey'))
    for s in (1, -1):
        p = BB + v(s * 0.135, s * 0.17 * 0.7, -0.17 * 0.7)
        out.add(rod(BB + v(0.065 * s, 0, 0), p + v(-0.025 * s, 0, 0), 0.011, 5, 'chrome'))
        out.add(box(p + v(s * 0.035, 0, 0), (0.07, 0.10, 0.022), 'trim'))
    return out


# ------------------------------------------------------------------------------------------------
# Boats (y = 0 is the waterline)
# ------------------------------------------------------------------------------------------------
def hull(L, B, D, draft, n=22, bow=0.40, transom=0.86, deadrise=0.20, sheer_rise=0.18, lift=0.0, boot=0.09):
    """Closed planing hull from the transom (+y) to the bow (-y); z = 0 is the waterline (+lift).
    Bands from the keel: antifouling bottom, a dark boot stripe, painted topsides, white gunwale, deck."""
    rings = []
    for k in range(n + 1):
        t = k / n; y = lerp(L / 2, -L / 2, t)
        f = math.sqrt(max(0.0, 1 - ((t - (1 - bow)) / bow) ** 2)) if t > 1 - bow else 1.0
        f = max(f, 0.035) * lerp(transom, 1.0, smooth(0.0, 0.3, t))
        hb = B / 2 * f
        zs = (D - draft) + sheer_rise * smooth(0.45, 1.0, t)
        zk = -draft * (1 - 0.85 * smooth(0.62, 1.0, t))
        zc = min(zk + deadrise * hb + 0.02, -0.03)
        half = [(0.0, zk), (0.5 * hb, zk + deadrise * hb * 0.5), (0.96 * hb, zc), (hb, 0.0), (hb * 1.005, boot), (hb * 1.01, (boot + zs) / 2),
                (hb * 1.0, zs), (hb * 0.9, zs + 0.02), (0.0, zs + 0.05)]
        pts = [half[0]] + [(-x, z) for x, z in half[1:-1]] + [half[-1]] + [(x, z) for x, z in reversed(half[1:-1])]
        rings.append([v(x, y, z + lift) for x, z in pts])
    nh = 9; m = len(rings[0]); V = [p for r in rings for p in r]; Fc = []; M = []
    side = ['antifoul', 'antifoul', 'antifoul', 'trim', 'paint', 'paint', 'white', 'deck']
    for r in range(n):
        o = r * m
        for i in range(m):
            j = (i + 1) % m
            Fc.append((o + i, o + j, o + m + j, o + m + i))
            M.append(side[i] if i < 8 else side[15 - i])
    g = Geo(V, Fc, M)
    for ri in (0, n):
        ci = len(g.v); g.v.append(centroid(rings[ri])); o = ri * m
        for i in range(m):
            g.f.append((o + (i + 1) % m, o + i, ci) if ri == 0 else (o + i, o + (i + 1) % m, ci)); g.m.append('paint' if ri == 0 else 'antifoul')
    return orient(g, v(0, 0, lift + (D - draft) / 2 - draft / 2))


def watertaxi():
    """8 m electric water taxi: white hull, teak deck, a canopy with solar cells on pillars, benches."""
    out = Geo(); L, B = 8.0, 2.5
    out.add(realize(hull(L, B, D=1.05, draft=0.40, bow=0.42, transom=0.88, deadrise=0.22, sheer_rise=0.14)))
    dz = 0.70  # deck height
    roof = box(v(0, 0.75, 2.30), (2.05, 3.5, 0.09), 'white', bevel=0.04, seg=2); out.add(roof)
    out.add(box(v(0, 0.75, 2.36), (1.6, 2.7, 0.03), 'solar'))
    for sx in (1, -1):
        for y in (-0.95, 2.4): out.add(rod(v(sx * 0.95, y, dz), v(sx * 0.95, y, 2.26), 0.032, 6, 'chrome'))
    ws = loft([[v(-1.0, -1.05, 1.0), v(1.0, -1.05, 1.0)], [v(-0.95, -0.98, 2.25), v(0.95, -0.98, 2.25)]], None, None, 'glass', closed=False)
    ws.f = ws.f + [tuple(reversed(f)) for f in ws.f]; ws.m = ws.m * 2; out.add(ws)
    out.add(box(v(0, -1.35, dz + 0.32), (2.0, 0.65, 0.64), 'white', bevel=0.10, seg=2))  # helm console
    out.add(box(v(0.45, -1.1, dz + 0.72), (0.34, 0.06, 0.22), 'trim', bevel=0.02, seg=1))
    for y in (0.05, 0.95, 1.85):
        out.add(box(v(0, y, dz + 0.22), (1.85, 0.46, 0.42), 'seat', bevel=0.06, seg=2))
        out.add(box(v(0, y + 0.21, dz + 0.55), (1.85, 0.08, 0.42), 'seat', bevel=0.03, seg=1))
    out.add(box(v(0, 3.1, dz + 0.12), (1.5, 0.7, 0.24), 'grey', bevel=0.05, seg=1))  # battery hatch
    out.add(ellipsoid(v(0, -3.75, dz + 0.22), 0.05, 0.05, 0.05, 6, 3, 'light_f'))
    return out


def hydrofoil():
    """~20 m electric passenger hydrofoil, foil-borne: the hull flies ~1 m above the water (y = 0)."""
    out = Geo(); L, B = 20.0, 4.4; lift = 1.0
    out.add(realize(hull(L, B, D=1.75, draft=0.55, bow=0.42, transom=0.92, deadrise=0.30, sheer_rise=0.22, lift=lift, boot=0.12)))
    top = lift + 1.22
    cab = []
    for y, w, h, e in ((7.9, 0.70, 0.60, 2.4), (7.3, 1.55, 1.55, 3.0), (6.2, 1.98, 2.25, 4.0), (4.0, 2.05, 2.45, 5.0), (-4.0, 2.05, 2.45, 5.0),
                       (-5.8, 1.95, 2.25, 4.2), (-6.9, 1.65, 1.55, 3.2), (-7.4, 1.10, 0.75, 2.4)):
        cab.append(ring(v(0, -y, top + h / 2), Y, 22, w, h / 2, e=e))
    cg = orient(loft(cab, 'flat', 'flat', 'paint'), v(0, 0, top + 1.0))
    ms = []
    for f in cg.f:
        c = centroid([cg.v[k] for k in f])
        if c.z > top + 2.2: ms.append('white')
        elif (top + 0.75 < c.z < top + 1.95 and -6.6 < c.y < 7.0) or (c.y < -6.5 and c.z > top + 0.45): ms.append('glass')
        else: ms.append('paint')
    cg.m = ms
    out.add(realize(cg))
    out.add(box(v(0, 0.5, top + 2.47), (2.8, 8.0, 0.05), 'solar'))
    for sx in (1, -1):  # forward struts and the T-foil
        out.add(box(v(sx * 1.55, -5.0, (lift + 0.2 - 1.6) / 2), (0.10, 0.50, lift + 0.2 + 1.6), 'foil', bevel=0.03, seg=1))
    out.add(box(v(0, -5.0, -1.62), (3.8, 0.60, 0.07), 'foil', bevel=0.025, seg=1))
    out.add(box(v(0, 7.6, (lift + 0.2 - 1.6) / 2), (0.12, 0.55, lift + 0.2 + 1.6), 'foil', bevel=0.03, seg=1))
    out.add(box(v(0, 7.6, -1.62), (2.4, 0.55, 0.07), 'foil', bevel=0.025, seg=1))
    out.add(ellipsoid(v(0, 7.75, -1.42), 0.17, 0.65, 0.17, 10, 6, 'foil'))
    out.add(ellipsoid(v(0, 8.42, -1.42), 0.04, 0.03, 0.30, 6, 3, 'grey'))
    out.add(ellipsoid(v(0, -9.75, lift + 1.35), 0.07, 0.07, 0.07, 6, 3, 'light_f'))
    for sx in (1, -1):  # side doors and a railing on the aft deck
        out.add(box(v(sx * 2.06, -4.8, top + 1.0), (0.03, 0.9, 1.7), 'trim', bevel=0.01, seg=1))
    return out


def car2026():
    """Ordinary small Swedish estate: 4.28 x 1.85 x 1.47 m, wheelbase 2.65, tall rear lamps."""
    R = 0.335; wy = 1.325
    st = [(2.14, .44, .76, .78, .70, .62), (2.11, .32, .90, 1.05, .88, .70), (2.02, .29, .93, 1.36, .915, .73), (1.95, .29, .935, 1.43, .92, .74),
          (1.62, .29, .94, 1.455, .925, .745), (1.45, .29, .94, 1.46, .925, .75), (0.28, .29, .94, 1.47, .925, .76), (0.12, .29, .94, 1.47, .925, .76),
          (-0.45, .29, .93, 1.44, .925, .75), (-0.85, .29, .92, 1.19, .925, .79), (-1.18, .29, .905, .98, .915, .83), (-1.62, .30, .855, .895, .905, .84),
          (-1.98, .33, .77, .80, .87, .80), (-2.10, .40, .67, .69, .80, .73), (-2.14, .46, .59, .60, .70, .64)]

    def cls(y0, y1, band):
        ym = (y0 + y1) / 2
        if band == 'cap': return 'trim'
        if band in (-1, 0): return 'trim'
        if band == 4:
            if -0.45 < ym < 1.95 and not (0.12 < ym < 0.28) and not (1.45 < ym < 1.62): return 'glass'
            if -1.18 < ym < 2.11: return 'trim'
        if band in (5, 6, 7) and -1.18 < ym < -0.45: return 'glass'
        if band in (5, 6, 7) and 1.95 < ym < 2.11: return 'glass'
        if band == 1 and (ym > 2.0 or ym < -1.98): return 'trim'
        return 'paint'
    body = cage_body(st, cls, 1, arches=[(wy, R), (-wy, R)], arch_r=0.395, arch_w=2.2)
    out = Geo().add(body)
    for y in (wy, -wy):
        for s in (1, -1): out.add(wheel(v(s * 0.78, y, R), R, 0.215))
    out.add(box(v(0, 0, 0.30), (1.4, 2.0, 0.10), 'trim'))
    for s in (1, -1):  # Thor's-hammer front lights, tall rear lamps, mirrors, roof rails - snapped onto the body
        p = snap(body, v(s * 0.56, -3, 0.78), Y, 0.010); out.add(box(p, (0.32, 0.03, 0.032), 'light_f', bevel=0.010))
        p = snap(body, v(s * 0.66, -3, 0.73), Y, 0.010); out.add(box(p, (0.032, 0.03, 0.10), 'light_f', bevel=0.010))
        p = snap(body, v(s * 0.74, 3, 1.04), -Y, 0.02); out.add(box(p, (0.10, 0.07, 0.40), 'light_r', bevel=0.03))
        p = snap(body, v(s * 2, -0.52, 1.0), v(-s, 0, 0), -0.04); out.add(ellipsoid(p, 0.06, 0.085, 0.05, 8, 4, 'trim'))
        a = snap(body, v(s * 0.62, 1.75, 3), -Z, -0.03); b = snap(body, v(s * 0.62, -0.30, 3), -Z, -0.03)
        out.add(rod(a, b, 0.016, 6, 'trim'))
        for y in (1.62, -0.28): q = snap(body, v(s * 0.62, y, 3), -Z, 0.0); out.add(rod(q, q + v(0, 0, 0.035), 0.012, 5, 'trim'))
    out.add(strip(body, [x * 0.12 for x in range(-5, 6)], 3, 0.92, -Y, 0.018, 'light_r', 0.01))
    p = snap(body, v(0, -3, 0.50), Y, 0.02); out.add(box(p, (0.95, 0.06, 0.14), 'trim', bevel=0.03))
    return out


def robotaxi():
    """Shared autonomous electric pod, 4.06 x 1.89 x 1.71 m: glass canopy, light bar, flush wheels."""
    half = [(2.03, .46, .64, .66, .60, .50), (2.00, .32, .78, 0.98, .84, .64), (1.92, .27, .86, 1.30, .915, .74), (1.72, .26, .90, 1.50, .94, .80),
            (1.36, .26, .91, 1.59, .945, .82), (0.70, .26, .915, 1.62, .945, .83), (0.0, .26, .915, 1.625, .945, .83)]
    st = half + [(-y, *r) for y, *r in reversed(half[:-1])]

    def cls(y0, y1, band):
        ym = abs((y0 + y1) / 2)
        if band == 'cap' or band in (-1, 0): return 'trim'
        if band == 3: return 'lightbar'
        if band == 4 and ym < 1.96: return 'glass'
        if band in (5, 6, 7) and 1.0 < ym < 1.96: return 'glass'
        if band in (6, 7) and ym <= 1.0: return 'white'
        return 'paint'
    body = cage_body(st, cls, 1, arches=[(1.36, 0.36), (-1.36, 0.36)], arch_r=0.415, arch_w=2.3)
    out = Geo().add(body)
    for y in (1.36, -1.36):
        for s in (1, -1): out.add(wheel(v(s * 0.80, y, 0.36), 0.36, 0.225, mat_rim='white'))
    out.add(box(v(0, 0, 0.27), (1.4, 1.8, 0.10), 'trim'))
    for s in (1, -1):
        out.add(strip(body, [x * 0.11 for x in range(-5, 6)], s * 3, 0.78, v(0, -s, 0), 0.022, 'light_r' if s > 0 else 'light_f', 0.012))
        p = snap(body, v(0, s * 0.55, 3), -Z, 0.02); out.add(ellipsoid(p, 0.13, 0.11, 0.05, 10, 3, 'trim'))
    return out


VEHICLES = {'car2026': car2026, 'robotaxi': robotaxi, 'ebus': ebus, 'tram': tram, 'cargobike': lambda: bike_geo(True), 'bike': bike_geo,
            'hydrofoil': hydrofoil, 'watertaxi': watertaxi}
WATER = {'hydrofoil', 'watertaxi'}


# ------------------------------------------------------------------------------------------------
# Export: split normals by angle, bake AO, write GLB
# ------------------------------------------------------------------------------------------------
def fib_hemisphere(n):
    out = []
    for i in range(n):
        z = 1 - (i + 0.5) / n; r = math.sqrt(max(0, 1 - z * z)); ph = i * 2.399963
        out.append(Vector((r * math.cos(ph), r * math.sin(ph), z)))
    return out


def finish(name, g, coll):
    """Make the Blender object (kept in the .blend) and return export arrays."""
    me = bpy.data.meshes.new(name); me.from_pydata([tuple(p) for p in g.v], [], g.f); me.update()
    me.polygons.foreach_set('material_index', [CI[m] for m in g.m])
    for k in CLASSES:
        mat = bpy.data.materials.get('veh_' + k) or bpy.data.materials.new('veh_' + k)
        mat.diffuse_color = (*to_lin(hexc(PAL[k][0])), 1); me.materials.append(mat)
    me.shade_smooth(); me.set_sharp_from_angle(angle=rad(40))
    ob = bpy.data.objects.new(name, me); coll.objects.link(ob)
    me.calc_loop_triangles()
    cn = me.corner_normals
    size = Vector([max(p[i] for p in g.v) - min(p[i] for p in g.v) for i in range(3)])
    keymap = {}; P = []; N = []; C = []; T = []; idx = []
    for tri in me.loop_triangles:
        cls = CLASSES[me.polygons[tri.polygon_index].material_index]
        for li, vi in zip(tri.loops, tri.vertices):
            n = cn[li].vector
            key = (vi, round(n.x, 3), round(n.y, 3), round(n.z, 3), cls)
            k = keymap.get(key)
            if k is None:
                k = len(P); keymap[key] = k
                P.append(me.vertices[vi].co.copy()); N.append(n.copy().normalized()); C.append(cls)
            idx.append(k)
    # baked AO (with a ground plane under land vehicles)
    verts = [tuple(p) for p in g.v]; faces = list(g.f)
    span = max(size.x, size.y) * 2
    if name not in WATER:
        o = len(verts); verts += [(-span, -span, 0), (span, -span, 0), (span, span, 0), (-span, span, 0)]; faces.append((o, o + 1, o + 2, o + 3))
    bvh = BVHTree.FromPolygons(verts, faces)
    dist = min(1.2, max(0.25, 0.12 * max(size)))
    hemi = fib_hemisphere(32); cols = []
    for p, n, cls in zip(P, N, C):
        t = (X if abs(n.x) < 0.9 else Y).cross(n).normalized(); b = n.cross(t)
        org = p + n * 0.003; hit = 0.0
        for d in hemi:
            loc, _, _, dd = bvh.ray_cast(org, t * d.x + b * d.y + n * d.z, dist)
            if loc is not None: hit += 1.0 - 0.6 * dd / dist
        ao = max(0.35, 1.0 - 0.75 * hit / len(hemi))
        base = to_lin(hexc(PAL[cls][0]))
        if cls == 'glass':  # sky reflected in glass that faces up, darker below
            k = clamp(n.z * 0.8 + 0.25); base = tuple(lerp(b, s, k * 0.55) for b, s in zip(base, to_lin(hexc(0x8fa9c0))))
            ao = max(ao, 0.75)
        cols.append(tuple(c * ao for c in base))
    pos = np.array([(p.x, p.z, -p.y) for p in P], np.float32)
    nrm = np.array([(n.x, n.z, -n.y) for n in N], np.float32)
    col = np.array(cols, np.float32); tint = np.array([float(PAL[c][1]) for c in C], np.float32)
    ind = np.array(idx, np.uint32)
    print(f'  {name}: {len(P)} verts, {len(ind) // 3} tris, {size.y:.2f} x {size.x:.2f} x {size.z:.2f} m')
    return dict(name=name, pos=pos, nrm=nrm, col=col, tint=tint, ind=ind)


def write_glb(items, path):
    bin_ = bytearray(); views = []; accessors = []; meshes = []; nodes = []

    def add(arr, target, comp, typ, minmax=False):
        while len(bin_) % 4: bin_.append(0)
        off = len(bin_); b = arr.tobytes(); bin_.extend(b)
        views.append(dict(buffer=0, byteOffset=off, byteLength=len(b), target=target))
        acc = dict(bufferView=len(views) - 1, componentType=comp, count=int(arr.shape[0]), type=typ)
        if minmax: acc['min'] = [float(x) for x in arr.min(0)]; acc['max'] = [float(x) for x in arr.max(0)]
        accessors.append(acc); return len(accessors) - 1
    for it in items:
        attrs = dict(POSITION=add(it['pos'], 34962, 5126, 'VEC3', True), NORMAL=add(it['nrm'], 34962, 5126, 'VEC3'),
                     COLOR_0=add(it['col'], 34962, 5126, 'VEC3'), _TINT=add(it['tint'], 34962, 5126, 'SCALAR'))
        small = it['pos'].shape[0] < 65536
        ind = add(it['ind'].astype(np.uint16 if small else np.uint32), 34963, 5123 if small else 5125, 'SCALAR')
        meshes.append(dict(name=it['name'], primitives=[dict(attributes=attrs, indices=ind, mode=4)]))
        nodes.append(dict(name=it['name'], mesh=len(meshes) - 1))
    while len(bin_) % 4: bin_.append(0)
    gltf = dict(asset=dict(version='2.0', generator='Kalmar 2126 tools/build-vehicles.py'), scene=0, scenes=[dict(nodes=list(range(len(nodes))))],
                nodes=nodes, meshes=meshes, accessors=accessors, bufferViews=views, buffers=[dict(byteLength=len(bin_))],
                extras=dict(units='metres', forward='+Z', up='+Y', ground='y=0 (wheels) / waterline (boats)', tint='_TINT: 1 = paint (instance colour)'))
    js = json.dumps(gltf, separators=(',', ':')).encode()
    while len(js) % 4: js += b' '
    total = 12 + 8 + len(js) + 8 + len(bin_)
    with open(path, 'wb') as fh:
        fh.write(struct.pack('<III', 0x46546C67, 2, total))
        fh.write(struct.pack('<II', len(js), 0x4E4F534A)); fh.write(js)
        fh.write(struct.pack('<II', len(bin_), 0x004E4942)); fh.write(bin_)


def main():
    t0 = time.time()
    bpy.ops.wm.read_factory_settings(use_empty=True)
    coll = bpy.context.scene.collection
    items = []; x = 0.0
    for name, fn in VEHICLES.items():
        if ONLY and name not in ONLY: continue
        g = fn()
        it = finish(name, g, coll); items.append(it)
        ob = bpy.data.objects[name]; ob.location.x = x; x += float(np.ptp(it['pos'][:, 0])) + 2.0
    os.makedirs(os.path.dirname(OUT), exist_ok=True); os.makedirs(os.path.dirname(BLEND), exist_ok=True)
    write_glb(items, OUT)
    bpy.ops.wm.save_as_mainfile(filepath=BLEND, compress=True)
    print(f'vehicles: {len(items)} meshes, {os.path.getsize(OUT) / 1024:.0f} KB, {time.time() - t0:.1f}s -> {OUT}')


main()
