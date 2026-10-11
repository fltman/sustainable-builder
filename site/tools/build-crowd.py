# Kalmar 2126 crowd: procedural low-poly people, rigged and animated in Blender, baked to vertex
# animation textures (VAT) for instanced rendering in three.js (src/crowd.js).
#
#   /Applications/Blender.app/Contents/MacOS/Blender --background --factory-startup \
#       --python tools/build-crowd.py [-- variant ...]
#
# Writes public/models/crowd/<variant>.bin + crowd.json and saves the editable source to
# art/crowd.blend (one collection per variant: mesh with vertex groups and colour attributes,
# armature with the walk / idle / sit actions).
#
# Modelling: every body part is a loft of superellipse cross-sections along a joint chain (torso,
# limbs, shoes, hands) or a shrink-wrapped cap (hair), so colour borders run along clean edge loops
# and each part is its own smooth-shaded island. Clothes are separate shells over the body.
# Rigging: weights come from per-part rules (projection onto the bone chain with smooth blends at
# the joints, height bands for the torso, skirt hems shared between pelvis and thighs).
# Animation: poses are computed in Python - legs by analytic two-bone IK against a planted foot
# path (heel strike, roll over, toe off, swing), so feet do not slide and stride_m is exact - and
# keyed as dense quaternion keys on the armature. Baking evaluates the deformed mesh per frame.
#
# Blender is Z-up with characters facing -Y; the export is three.js Y-up facing +Z:
# three(x, y, z) = blender(x, z, -y). Metres. Feet on y = 0.
import bpy, bmesh, math, os, sys, json, time
import numpy as np
from mathutils import Vector, Matrix, Quaternion
from mathutils.bvhtree import BVHTree

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
OUT_DIR = os.path.join(ROOT, 'public', 'models', 'crowd')
BLEND = os.path.join(ROOT, 'art', 'crowd.blend')
ARGS = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
ONLY = [a for a in ARGS if not a.startswith('-')]

X, Y, Z = Vector((1, 0, 0)), Vector((0, 1, 0)), Vector((0, 0, 1))
QI = Quaternion()
ZERO = Vector()
rad = math.radians


def v(x, y, z): return Vector((x, y, z))
def lerp(a, b, t): return a + (b - a) * t
def clamp(x, a=0.0, b=1.0): return max(a, min(b, x))


def smooth(e0, e1, x):
    t = clamp((x - e0) / (e1 - e0)) if e1 != e0 else (1.0 if x >= e1 else 0.0)
    return t * t * (3 - 2 * t)


def sgnpow(x, p): return math.copysign(abs(x) ** p, x)
def hexc(h): return (((h >> 16) & 255) / 255.0, ((h >> 8) & 255) / 255.0, (h & 255) / 255.0)
def to_lin(c): return tuple((x / 12.92) if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c)
def to_srgb(c): return tuple((x * 12.92) if x <= 0.0031308 else 1.055 * x ** (1 / 2.4) - 0.055 for x in c)
def Rx(a): return Quaternion((1, 0, 0), a)
def Ry(a): return Quaternion((0, 1, 0), a)
def Rz(a): return Quaternion((0, 0, 1), a)
def mx(p, s): return Vector((p.x * s, p.y, p.z))


def basis_rot(a_dir, a_up, b_dir, b_up):
    """Rotation taking the frame (a_dir, a_up) onto (b_dir, b_up)."""
    a1 = a_dir.normalized(); a2 = (a_up - a1 * a_up.dot(a1)).normalized(); a3 = a1.cross(a2)
    b1 = b_dir.normalized(); b2 = (b_up - b1 * b_up.dot(b1)).normalized(); b3 = b1.cross(b2)
    A = Matrix((a1, a2, a3)).transposed(); B = Matrix((b1, b2, b3)).transposed()
    return (B @ A.transposed()).to_quaternion()


# ------------------------------------------------------------------------------------------------
# Geometry
# ------------------------------------------------------------------------------------------------
def axes(d, uh, wh):
    d = d.normalized()
    u = uh - d * uh.dot(d)
    if u.length < 1e-6: u = wh.cross(d)
    u.normalize()
    w = d.cross(u); w.normalize()
    if w.dot(wh) < 0: w = -w
    return d, u, w


def section(c, d, n, a, bf, bb, e=2.0, uh=X, wh=Y, off=0.0, zfun=None):
    """Superellipse ring around c, perpendicular to d. u ~ uh (half-width a); w ~ wh with extent bb
    on the +wh side and bf on the -wh side (for bodies: wh=+Y = back, so bf is the front)."""
    d, u, w = axes(d, uh, wh)
    pts = []
    for k in range(n):
        t = 2 * math.pi * k / n
        cs, sn = math.cos(t), math.sin(t)
        x = a * sgnpow(cs, 2 / e)
        yy = sgnpow(sn, 2 / e)
        y = (bb if yy > 0 else bf) * yy + off
        p = c + u * x + w * y
        if zfun: p = p + d * zfun(cs, sn)
        pts.append(p)
    return pts


def centroid(pts): return sum(pts, Vector()) / len(pts)


def loft(rings, cap0=None, cap1=None):
    n = len(rings[0]); verts = [p.copy() for r in rings for p in r]; faces = []
    for r in range(len(rings) - 1):
        o = r * n
        for i in range(n):
            j = (i + 1) % n
            faces.append((o + i, o + j, o + n + j, o + n + i))

    def cap(ri, pos):  # the start cap winds the other way so it agrees with the tube
        ci = len(verts); verts.append(pos.copy()); o = ri * n
        for i in range(n): faces.append((o + (i + 1) % n, o + i, ci) if ri == 0 else (o + i, o + (i + 1) % n, ci))
    if cap0 is not None: cap(0, centroid(rings[0]) if isinstance(cap0, str) else cap0)
    if cap1 is not None: cap(len(rings) - 1, centroid(rings[-1]) if isinstance(cap1, str) else cap1)
    return verts, faces


def orient(verts, faces, center=None):
    """Flip all faces if they point inwards on average (parts are convex-ish or tubes)."""
    if center is None: center = centroid(verts)
    score = 0.0
    for f in faces:
        p = [verts[i] for i in f]
        score += (p[1] - p[0]).cross(p[2] - p[0]).dot(centroid(p) - center)
    return [tuple(reversed(f)) for f in faces] if score < 0 else faces


def realize(verts, faces, mods=()):
    if not mods: return verts, faces
    me = bpy.data.meshes.new('tmp'); me.from_pydata([tuple(p) for p in verts], [], faces); me.update()
    ob = bpy.data.objects.new('tmp', me); bpy.context.scene.collection.objects.link(ob)
    for kind, params in mods:
        m = ob.modifiers.new(kind.lower(), kind)
        for k, val in params.items(): setattr(m, k, val)
    dg = bpy.context.evaluated_depsgraph_get(); ev = ob.evaluated_get(dg); me2 = ev.to_mesh()
    V = [x.co.copy() for x in me2.vertices]; F = [tuple(p.vertices) for p in me2.polygons]
    ev.to_mesh_clear(); bpy.data.objects.remove(ob, do_unlink=True); bpy.data.meshes.remove(me)
    return V, F


def ellipsoid(c, rx, ry, rz, nu=8, nv=4, rot=None):
    rings = []
    for j in range(1, nv):
        th = math.pi * j / nv
        ring = []
        for k in range(nu):
            ph = 2 * math.pi * k / nu
            p = Vector((math.sin(th) * math.cos(ph) * rx, math.sin(th) * math.sin(ph) * ry, -math.cos(th) * rz))
            ring.append(c + (rot @ p if rot else p))
        rings.append(ring)
    bot = c + (rot @ v(0, 0, -rz) if rot else v(0, 0, -rz)); top = c + (rot @ v(0, 0, rz) if rot else v(0, 0, rz))
    return loft(rings, bot, top)


def rod(p0, p1, r0, r1=None, n=6, caps=True, uh=X, wh=Y):
    d = p1 - p0; r1 = r0 if r1 is None else r1
    rings = [section(p0, d, n, r0, r0, r0, uh=uh, wh=wh), section(p1, d, n, r1, r1, r1, uh=uh, wh=wh)]
    return loft(rings, 'flat' if caps else None, 'flat' if caps else None)


def torus(c, axis, R, r, nu=16, nv=6, a0=0.0, a1=2 * math.pi, closed=True, rscale=(1, 1), flat=1.0):
    axis = axis.normalized()
    e1 = (Z if abs(axis.dot(Z)) < .9 else X).cross(axis).normalized(); e2 = axis.cross(e1)
    rings = []
    cnt = nu if closed else nu + 1
    for k in range(cnt):
        t = a0 + (a1 - a0) * k / nu
        radial = e1 * math.cos(t) + e2 * math.sin(t)
        cen = c + radial * R * rscale[0] if rscale[0] == rscale[1] else c + (e1 * math.cos(t) * R * rscale[0] + e2 * math.sin(t) * R * rscale[1])
        ring = []
        for j in range(nv):
            s = 2 * math.pi * j / nv
            ring.append(cen + radial * math.cos(s) * r + axis * math.sin(s) * r * flat)
        rings.append(ring)
    if closed: rings.append(rings[0])
    verts, faces = loft(rings, None if closed else 'flat', None if closed else 'flat')
    if closed:  # weld the duplicated seam ring
        n = nv; last = len(rings) - 1
        verts = verts[:last * n]
        faces = [tuple(i - last * n if i >= last * n else i for i in f) for f in faces]
    return verts, faces


def merge_geo(*geos):
    V = []; F = []
    for verts, faces in geos:
        o = len(V); V += verts; F += [tuple(i + o for i in f) for f in faces]
    return V, F


class Polyline:
    def __init__(s, pts):
        s.p = [x.copy() for x in pts]; s.cum = [0.0]
        for i in range(len(pts) - 1): s.cum.append(s.cum[-1] + (pts[i + 1] - pts[i]).length)
        s.total = s.cum[-1]

    def at(s, t):
        if t <= 0: d = (s.p[1] - s.p[0]).normalized(); return s.p[0] + d * t
        if t >= s.total: d = (s.p[-1] - s.p[-2]).normalized(); return s.p[-1] + d * (t - s.total)
        for i in range(len(s.p) - 1):
            if t <= s.cum[i + 1]:
                k = (t - s.cum[i]) / (s.cum[i + 1] - s.cum[i]); return s.p[i].lerp(s.p[i + 1], k)

    def tangent(s, t, h=0.03): return (s.at(t + h) - s.at(t - h)).normalized()

    def project(s, q):
        best = None
        for i in range(len(s.p) - 1):
            d = s.p[i + 1] - s.p[i]; L = d.length; d = d / L
            t = (q - s.p[i]).dot(d); tc = clamp(t, 0, L)
            dist = (q - (s.p[i] + d * tc)).length
            if (i == 0 and t < 0) or (i == len(s.p) - 2 and t > L): tc = t
            if best is None or dist < best[0] - 1e-9: best = (dist, s.cum[i] + tc)
        return best[1]


def tube(pl, stations, n=10, cap0=None, cap1=None, e=2.0, uh=X, wh=Y, infl=0.0):
    """Loft along a polyline: stations = [(s, a, bf, bb)] (s = arc length, may run past the ends);
    cap0/cap1: None (open), 'flat', or 'pole' (a pole a little past the end ring)."""
    rings = []
    for s, a, bf, bb in stations:
        rings.append(section(pl.at(s), pl.tangent(s), n, a + infl, bf + infl, bb + infl, e=e, uh=uh, wh=wh))

    def pole(i, sgn):
        s, a = stations[i][0], stations[i][1]
        return pl.at(s + sgn * min(a, 0.03) * 0.6)
    c0 = pole(0, -1) if cap0 == 'pole' else cap0
    c1 = pole(-1, 1) if cap1 == 'pole' else cap1
    return loft(rings, c0, c1)


def stations_scale(st, k): return [(s, a * k, bf * k, bb * k) for s, a, bf, bb in st]


# ------------------------------------------------------------------------------------------------
# Bodies (Blender coords, left side = +X, facing -Y)
# ------------------------------------------------------------------------------------------------
TORSO_M = [  # z, half-width, front, back, y-offset
    (0.800, 0.095, 0.070, 0.075, 0.010),
    (0.845, 0.150, 0.093, 0.105, 0.012),
    (0.915, 0.163, 0.096, 0.112, 0.012),
    (0.990, 0.155, 0.095, 0.098, 0.004),
    (1.060, 0.150, 0.097, 0.090, -0.003),
    (1.160, 0.160, 0.106, 0.090, -0.010),
    (1.260, 0.174, 0.115, 0.094, -0.014),
    (1.345, 0.184, 0.108, 0.097, -0.008),
    (1.400, 0.190, 0.094, 0.096, 0.000),
    (1.440, 0.163, 0.078, 0.085, 0.004),
    (1.467, 0.100, 0.062, 0.070, 0.006),
    (1.485, 0.055, 0.050, 0.055, 0.006),
]
TORSO_F = [
    (0.755, 0.092, 0.068, 0.075, 0.012),
    (0.800, 0.152, 0.090, 0.108, 0.014),
    (0.865, 0.170, 0.094, 0.120, 0.014),
    (0.935, 0.156, 0.088, 0.104, 0.008),
    (0.995, 0.133, 0.085, 0.086, 0.000),
    (1.080, 0.140, 0.097, 0.086, -0.006),
    (1.165, 0.152, 0.120, 0.088, -0.010),
    (1.235, 0.158, 0.103, 0.090, -0.008),
    (1.295, 0.168, 0.088, 0.090, 0.000),
    (1.330, 0.146, 0.072, 0.078, 0.004),
    (1.355, 0.090, 0.056, 0.064, 0.006),
    (1.374, 0.050, 0.044, 0.050, 0.006),
]
TORSO_C = [
    (0.525, 0.066, 0.052, 0.056, 0.008),
    (0.560, 0.110, 0.072, 0.080, 0.010),
    (0.615, 0.118, 0.076, 0.084, 0.010),
    (0.670, 0.116, 0.079, 0.078, 0.002),
    (0.735, 0.118, 0.083, 0.072, -0.004),
    (0.800, 0.124, 0.084, 0.072, -0.006),
    (0.862, 0.127, 0.079, 0.074, -0.004),
    (0.905, 0.134, 0.070, 0.074, 0.000),
    (0.932, 0.112, 0.058, 0.064, 0.004),
    (0.952, 0.070, 0.046, 0.050, 0.005),
    (0.964, 0.040, 0.038, 0.042, 0.005),
]
HEAD_PROF = [  # dz/h, a, front, back, y-offset/front (relative to the head's half sizes)
    (-0.93, 0.34, 0.42, 0.22, -0.34),
    (-0.80, 0.66, 0.62, 0.62, -0.13),
    (-0.50, 0.89, 0.90, 0.86, -0.035),
    (-0.10, 1.00, 1.00, 0.98, 0.0),
    (0.32, 0.99, 0.94, 1.00, 0.02),
    (0.66, 0.86, 0.76, 0.88, 0.04),
    (0.90, 0.50, 0.42, 0.52, 0.05),
]
ARM_M = [(-0.030, .034, .034, .034), (-0.010, .047, .047, .047), (0.04, .049, .048, .048),
         (0.16, .043, .042, .043), (0.285, .036, .034, .036),
         (0.37, .037, .039, .036), (0.47, .029, .034, .032), (0.545, .021, .028, .027)]
LEG_M = [(-0.05, .080, .085, .090), (0.05, .085, .087, .092), (0.22, .071, .070, .074),
         (0.425, .052, .050, .051), (0.55, .051, .046, .064), (0.70, .042, .039, .046), (0.84, .032, .031, .033)]
HAND_M = [(-0.01, .020, .027, .027), (0.04, .022, .038, .035), (0.095, .021, .043, .040), (0.135, .016, .037, .034), (0.158, .011, .026, .024)]
SHOE_M = [  # s from heel back towards the toe, half-width, below, above, centre height
    (0.000, .028, .022, .022, .046), (0.015, .039, .044, .044, .048), (0.060, .043, .046, .046, .049), (0.120, .046, .040, .034, .040),
    (0.180, .049, .033, .023, .033), (0.228, .046, .028, .017, .028), (0.252, .035, .022, .013, .024)]


def body_male():
    return dict(kind='male', H=1.78, torso=TORSO_M, head_c=v(0, -0.008, 1.654), head=(0.081, 0.104, 0.106, 0.126),
                neck_r=0.050, neck0=1.455, sh=v(0.180, 0.012, 1.405), elbow=v(0.206, 0.032, 1.122), wrist=v(0.214, -0.008, 0.861),
                arm=ARM_M, hand=HAND_M, hand_len=0.175, hip=v(0.088, 0.0, 0.925), knee=v(0.093, -0.012, 0.50), ankle=v(0.098, 0.018, 0.085),
                leg=LEG_M, shoe=SHOE_M, foot_len=0.265, heel_back=0.060, waist=1.06, chest=1.25, crotch=0.80, ball=0.135)


def scaled(B, kz, kw, kind=None):
    """Uniformly re-proportioned copy: heights by kz, widths and radii by kw."""
    C = dict(B)
    if kind: C['kind'] = kind
    C['H'] = B['H'] * kz
    C['torso'] = [(z * kz, a * kw, f * kw, b * kw, y * kw) for z, a, f, b, y in B['torso']]
    for k in ('head_c', 'sh', 'elbow', 'wrist', 'hip', 'knee', 'ankle'):
        p = B[k]; C[k] = v(p.x * kw, p.y * kw, p.z * kz)
    C['head'] = tuple(x * kz for x in B['head'])
    for k in ('neck0', 'waist', 'chest', 'crotch'): C[k] = B[k] * kz
    C['neck_r'] = B['neck_r'] * kw
    for k in ('arm', 'leg', 'hand'): C[k] = [(s * kz, a * kw, f * kw, b * kw) for s, a, f, b in B[k]]
    C['shoe'] = [(s * kz, a * kw, f * kz, b * kz, c * kz) for s, a, f, b, c in B['shoe']]
    for k in ('hand_len', 'foot_len', 'heel_back', 'ball'): C[k] = B[k] * kz
    return C


def body_female():
    B = dict(kind='female', H=1.68, torso=TORSO_F, head_c=v(0, -0.006, 1.561), head=(0.076, 0.099, 0.102, 0.119),
             neck_r=0.044, neck0=1.35, sh=v(0.158, 0.012, 1.300), elbow=v(0.180, 0.030, 1.038), wrist=v(0.188, -0.008, 0.795),
             arm=[(s * .93, a * .86, f * .86, b * .86) for s, a, f, b in ARM_M], hand=[(s * .92, a * .9, f * .9, b * .9) for s, a, f, b in HAND_M],
             hand_len=0.162, hip=v(0.086, 0.0, 0.865), knee=v(0.085, -0.010, 0.468), ankle=v(0.087, 0.016, 0.078),
             leg=[(s * .945, a * k, f * k, b * k) for (s, a, f, b), k in zip(LEG_M, (1, 1.01, .99, .97, .95, .93, .93, .93, .92, .92, .9, .88))],
             shoe=[(s * .9, a * .9, f * .92, b * .92, c * .92) for s, a, f, b, c in SHOE_M], foot_len=0.238, heel_back=0.054,
             waist=0.995, chest=1.165, crotch=0.755, ball=0.122)
    return B


def body_child():
    B = dict(kind='child', H=1.20, torso=TORSO_C, head_c=v(0, -0.006, 1.093), head=(0.073, 0.089, 0.093, 0.106),
             neck_r=0.036, neck0=0.945, sh=v(0.120, 0.010, 0.905), elbow=v(0.136, 0.024, 0.735), wrist=v(0.142, -0.006, 0.565),
             arm=[(s * .63, a * .72, f * .72, b * .72) for s, a, f, b in ARM_M], hand=[(s * .7, a * .72, f * .72, b * .72) for s, a, f, b in HAND_M],
             hand_len=0.122, hip=v(0.064, 0.0, 0.600), knee=v(0.066, -0.008, 0.335), ankle=v(0.068, 0.012, 0.060),
             leg=[(s * .645, a * .74, f * .74, b * .74) for s, a, f, b in LEG_M], shoe=[(s * .68, a * .76, f * .74, b * .74, c * .74) for s, a, f, b, c in SHOE_M],
             foot_len=0.18, heel_back=0.042, waist=0.70, chest=0.83, crotch=0.525, ball=0.09)
    return B


def body_elder():
    B = scaled(body_female(), 0.965, 1.0, 'elder')
    B['torso'] = [(z, a + (0.014 if .9 < z < 1.2 else 0.006), f + (0.01 if .9 < z < 1.12 else -0.004 if z > 1.12 else 0), b, y) for z, a, f, b, y in B['torso']]
    return B


def torso_at(table, z):
    if z <= table[0][0]: return table[0][1:]
    for i in range(len(table) - 1):
        z0, z1 = table[i][0], table[i + 1][0]
        if z <= z1:
            t = (z - z0) / (z1 - z0)
            return tuple(lerp(a, b, t) for a, b in zip(table[i][1:], table[i + 1][1:]))
    return table[-1][1:]


# ------------------------------------------------------------------------------------------------
# Rig
# ------------------------------------------------------------------------------------------------
class Pose:
    def __init__(s): s.q = {}; s.off = {}; s.sc = {}


class Rig:
    def __init__(s, bones):
        s.bones = {n: (h.copy(), t.copy(), p) for n, h, t, p in bones}
        s.order = [b[0] for b in bones]; s.M = {}
        s.deform = [n for n in s.order if n not in ('root',)]

    def fk(s, P):
        W, H = {}, {}
        for n in s.order:
            h, t, p = s.bones[n]
            q = P.q.get(n, QI); off = P.off.get(n, ZERO)
            if p is None: W[n] = q.copy(); H[n] = h + off
            else: W[n] = W[p] @ q; H[n] = H[p] + W[p] @ (h - s.bones[p][0] + off)
        return W, H

    def length(s, n): h, t, p = s.bones[n]; return (t - h).length


def skeleton(B, extra=()):
    hz, sh = B['hip'].z, B['sh']
    hc = B['head_c']; a, bf, bb, h = B['head']
    hand_dir = (B['wrist'] - B['elbow']).normalized()
    bones = [
        ('root', v(0, 0, 0), v(0, 0.2, 0), None),
        ('pelvis', v(0, 0, hz), v(0, 0, B['waist']), 'root'),
        ('spine', v(0, 0, B['waist']), v(0, 0, B['chest']), 'pelvis'),
        ('chest', v(0, 0, B['chest']), v(0, 0.005, B['neck0']), 'spine'),
        ('neck', v(0, 0.005, B['neck0']), v(0, hc.y + 0.01, hc.z - h * 0.45), 'chest'),
        ('head', v(0, hc.y + 0.01, hc.z - h * 0.45), v(0, hc.y + 0.01, hc.z + h), 'neck'),
    ]
    for s, S in ((1, 'L'), (-1, 'R')):
        bones += [
            (f'clav.{S}', v(0.02 * s, 0.0, sh.z + 0.01), mx(sh, s), 'chest'),
            (f'upperarm.{S}', mx(sh, s), mx(B['elbow'], s), f'clav.{S}'),
            (f'forearm.{S}', mx(B['elbow'], s), mx(B['wrist'], s), f'upperarm.{S}'),
            (f'hand.{S}', mx(B['wrist'], s), mx(B['wrist'] + hand_dir * B['hand_len'] * 0.85, s), f'forearm.{S}'),
            (f'thigh.{S}', mx(B['hip'], s), mx(B['knee'], s), 'pelvis'),
            (f'shin.{S}', mx(B['knee'], s), mx(B['ankle'], s), f'thigh.{S}'),
            (f'foot.{S}', mx(B['ankle'], s), mx(v(B['ankle'].x, B['ankle'].y - B['ball'], 0.02), s), f'shin.{S}'),
        ]
    return bones + list(extra)


def make_armature(rig, name, coll):
    arm = bpy.data.armatures.new(name + '_rig'); ob = bpy.data.objects.new(name + '_rig', arm); coll.objects.link(ob)
    bpy.context.view_layer.objects.active = ob
    for o in bpy.context.view_layer.objects: o.select_set(o == ob)
    bpy.ops.object.mode_set(mode='EDIT')
    for n in rig.order:
        h, t, p = rig.bones[n]
        eb = arm.edit_bones.new(n); eb.head = h; eb.tail = t; eb.roll = 0
        if p: eb.parent = arm.edit_bones[p]
        eb.use_deform = n != 'root'
    bpy.ops.object.mode_set(mode='OBJECT')
    for n in rig.order: rig.M[n] = arm.bones[n].matrix_local.to_3x3()
    arm.display_type = 'STICK'
    return ob


# ------------------------------------------------------------------------------------------------
# Weight rules: f(vertex) -> {bone: weight}
# ------------------------------------------------------------------------------------------------
def R_fixed(bone): return lambda p: {bone: 1.0}


def R_chain(points, bones, radii, top=None, bottom=None):
    pl = Polyline(points); bounds = []; zb = []
    if top: zb.append(top[0]); bounds.append((0.0, top[1]))
    zb.append(bones[0])
    for j in range(1, len(bones)): bounds.append((pl.cum[j], radii[j - 1])); zb.append(bones[j])
    if bottom: bounds.append((pl.total, bottom[1])); zb.append(bottom[0])

    def f(p):
        s = pl.project(p); w = {}; prev = 1.0
        for j, b in enumerate(zb):
            cur = smooth(bounds[j][0] - bounds[j][1], bounds[j][0] + bounds[j][1], s) if j < len(bounds) else 0.0
            wt = prev - cur; prev = cur
            if wt > 1e-4: w[b] = w.get(b, 0) + wt
        return w
    return f


def R_vertical(levels):
    """levels: [(z, radius, bone_above)] ascending, first entry (None, None, bone_below_all)."""
    def f(p):
        w = {}; prev = 1.0; bones = [lv[2] for lv in levels]
        for j, b in enumerate(bones):
            if j + 1 < len(levels):
                z, r, _ = levels[j + 1]; cur = smooth(z - r, z + r, p.z)
            else: cur = 0.0
            wt = prev - cur; prev = cur
            if wt > 1e-4: w[b] = w.get(b, 0) + wt
        return w
    return f


def mix_in(w, bone, k):
    if k <= 1e-4: return w
    w = {b: x * (1 - k) for b, x in w.items()}; w[bone] = w.get(bone, 0) + k
    return w


def R_torso(B, skirt=0.0, thigh_reach=0.30):
    hz, wz, cz, nz, shz = B['hip'].z, B['waist'], B['chest'], B['neck0'], B['sh'].z
    b1 = (hz + wz) / 2 + 0.03; b2 = (wz + cz) / 2 + 0.02
    vert = R_vertical([(None, None, 'pelvis'), (b1, 0.05, 'spine'), (b2, 0.06, 'chest'), (nz + 0.012, 0.02, 'neck')])

    def f(p):
        w = vert(p); ax = abs(p.x); S = 'L' if p.x > 0 else 'R'
        w = mix_in(w, 'clav.' + S, 0.55 * smooth(.07, .16, ax) * smooth(shz - .16, shz - .04, p.z))
        w = mix_in(w, 'upperarm.' + S, 0.35 * smooth(B['sh'].x - .045, B['sh'].x + .01, ax) * smooth(shz - .13, shz - .03, p.z))
        if skirt > 0:
            k = smooth(hz + 0.03, hz - thigh_reach, p.z) * skirt
            if k > 0:
                sl = smooth(-0.07, 0.07, p.x)
                w = {b: x * (1 - k) for b, x in w.items()}
                w['thigh.L'] = w.get('thigh.L', 0) + k * sl; w['thigh.R'] = w.get('thigh.R', 0) + k * (1 - sl)
        return w
    return f


def R_pelvis_block(B):
    hz = B['hip'].z

    def f(p):
        k = 0.85 * smooth(hz + 0.01, hz - 0.10, p.z)
        sl = smooth(-0.03, 0.03, p.x)
        return {'pelvis': 1 - k, 'thigh.L': k * sl, 'thigh.R': k * (1 - sl)}
    return f


def R_leg(B, s):
    S = 'L' if s > 0 else 'R'
    return R_chain([mx(B['hip'], s), mx(B['knee'], s), mx(B['ankle'], s)], [f'thigh.{S}', f'shin.{S}'], [0.05],
                   top=('pelvis', 0.06), bottom=(f'foot.{S}', 0.025))


def R_arm(B, s):
    S = 'L' if s > 0 else 'R'
    return R_chain([mx(B['sh'], s), mx(B['elbow'], s), mx(B['wrist'], s)], [f'upperarm.{S}', f'forearm.{S}'], [0.045],
                   top=(f'clav.{S}', 0.045), bottom=(f'hand.{S}', 0.02))


def R_hand(B, s):
    S = 'L' if s > 0 else 'R'
    d = (B['wrist'] - B['elbow']).normalized()
    return R_chain([mx(B['wrist'], s), mx(B['wrist'] + d * B['hand_len'], s)], [f'hand.{S}'], [], top=(f'forearm.{S}', 0.018))


def R_shoe(B, s):
    S = 'L' if s > 0 else 'R'; az = B['ankle'].z

    def f(p):
        k = 0.6 * smooth(az - 0.005, az + 0.04, p.z)
        return {f'foot.{S}': 1 - k, f'shin.{S}': k}
    return f


def R_neck(B):
    hc = B['head_c']; h = B['head'][3]
    return R_vertical([(None, None, 'chest'), (B['neck0'] + 0.005, 0.025, 'neck'), (hc.z - h * 0.55, 0.035, 'head')])


def R_hair_long(B):
    hc = B['head_c']; h = B['head'][3]

    def f(p):
        k = 0.45 * smooth(hc.z - 0.55 * h, hc.z - 1.25 * h, p.z)
        return {'head': 1 - k, 'neck': k * 0.7, 'chest': k * 0.3}
    return f


# ------------------------------------------------------------------------------------------------
# Figure: parts with colour, mask and weight rule
# ------------------------------------------------------------------------------------------------
TOP, SKIN, HAIR, BOTTOM, FIXED = (1, 0, 0, 0), (0, 1, 0, 0), (0, 0, 1, 0), (0, 0, 0, 1), (0, 0, 0, 0)


class Fig:
    def __init__(s): s.parts = []

    def add(s, name, geo, color=0xffffff, mask=FIXED, rule=None, mods=(), center=None):
        verts, faces = geo
        faces = orient(verts, faces, center)
        verts, faces = realize(verts, faces, mods)
        s.parts.append(dict(name=name, verts=verts, faces=faces, color=color, mask=mask, rule=rule))


def head_geo(B, n=14):
    c = B['head_c']; a, bf, bb, h = B['head']
    rings = [section(c + v(0, ky * bf, dz * h), Z, n, a * ka, bf * kf, bb * kb, e=2.0) for dz, ka, kf, kb, ky in HEAD_PROF]
    return loft(rings, c + v(0, -0.30 * bf, -h), c + v(0, 0.05 * bf, h))


def head_surface_y(B, x, dz):
    """Front surface y of the head at lateral x and relative height dz (approximate)."""
    c = B['head_c']; a, bf, bb, h = B['head']
    prof = HEAD_PROF
    for i in range(len(prof) - 1):
        if prof[i][0] <= dz / h <= prof[i + 1][0]:
            t = (dz / h - prof[i][0]) / (prof[i + 1][0] - prof[i][0])
            ka = lerp(prof[i][1], prof[i + 1][1], t); kf = lerp(prof[i][2], prof[i + 1][2], t); ky = lerp(prof[i][4], prof[i + 1][4], t)
            break
    else: ka, kf, ky = 1, 1, 0
    q = clamp(abs(x) / (a * ka), 0, 0.999)
    return c.y + ky * bf - bf * kf * (1 - q ** 2) ** 0.5


def add_face(fig, B, brows=True, glasses=False):
    c = B['head_c']; a, bf, bb, h = B['head']; k = a / 0.076
    for s in (1, -1):
        ex = 0.031 * k * s; ez = c.z + 0.004 * k
        fig.add('eye', ellipsoid(v(ex, head_surface_y(B, ex, 0.004 * k) + 0.0035, ez), 0.0105 * k, 0.0055 * k, 0.0085 * k, 6, 3), 0x231c19, FIXED, R_fixed('head'))
        if brows:
            bz = 0.029 * k; bx = 0.033 * k * s
            fig.add('brow', ellipsoid(v(bx, head_surface_y(B, bx, bz) + 0.002, c.z + bz), 0.017 * k, 0.0045 * k, 0.0042 * k, 5, 3, rot=Ry(-0.12 * s)), 0xffffff, HAIR, R_fixed('head'))
        fig.add('ear', ellipsoid(v(s * a * 0.97, c.y + 0.012, c.z - 0.012 * k), 0.010 * k, 0.019 * k, 0.029 * k, 6, 3), 0xffffff, SKIN, R_fixed('head'))
        if glasses:
            gy = head_surface_y(B, ex, 0) - 0.008
            fig.add('glasses', torus(v(ex, gy, ez), Y, 0.017 * k, 0.0026, 8, 3), 0x2b2522, FIXED, R_fixed('head'), center=v(ex, gy, ez))
    if glasses:
        gy = head_surface_y(B, 0, 0) - 0.006
        fig.add('glasses', rod(v(-0.014 * k, gy, c.z + 0.006), v(0.014 * k, gy, c.z + 0.006), 0.0025, n=4), 0x2b2522, FIXED, R_fixed('head'))
    nz = -0.028 * k
    fig.add('nose', ellipsoid(v(0, head_surface_y(B, 0, nz) - 0.0015 * k, c.z + nz), 0.0095 * k, 0.010 * k, 0.018 * k, 6, 3, rot=Rx(-0.3)), 0xffffff, SKIN, R_fixed('head'))


HAIRLINES = {  # azimuth (deg; 0 = left ear, 90 = back, 270 = forehead) -> hairline angle from the crown (deg)
    'short': [(0, 80), (25, 100), (60, 110), (90, 113), (120, 110), (155, 100), (180, 80), (205, 94), (235, 68), (270, 55), (305, 68), (335, 94)],
    'child': [(0, 84), (25, 102), (60, 111), (90, 114), (120, 111), (155, 102), (180, 84), (205, 96), (235, 70), (270, 60), (305, 70), (335, 96)],
    'bob': [(0, 121), (60, 125), (90, 127), (120, 125), (180, 121), (210, 114), (240, 84), (256, 58), (270, 54), (284, 58), (300, 84), (330, 114)],
    'back': [(0, 82), (25, 100), (90, 112), (155, 100), (180, 82), (205, 92), (235, 64), (270, 50), (305, 64), (335, 92)],
}


def hairline(table, az):
    d = math.degrees(az) % 360
    pts = table + [(table[0][0] + 360, table[0][1])]
    for (a0, t0), (a1, t1) in zip(pts, pts[1:]):
        if a0 <= d <= a1: return rad(lerp(t0, t1, smooth(a0, a1, d)))
    return rad(table[0][1])


def hair_cap(B, head, line, top=0.013, sides=0.005, flare=0.0, rows=4, cols=14, noise=0.0, thick=0.006, lift=0.0, quiff=0.0):
    """Hair shrink-wrapped over the head mesh: rays from the head centre find the scalp and the cap sits
    'top'...'sides' metres above it, down to the hairline table (see HAIRLINES)."""
    c = B['head_c'] + v(0, 0, lift); a, bf, bb, h = B['head']
    hv, hf = head
    bvh = BVHTree.FromPolygons([tuple(p) for p in hv], hf)

    def end(az): return hairline(HAIRLINES[line], az)

    def point(th, az):
        d = Vector((math.sin(th) * math.cos(az) * a, math.sin(th) * math.sin(az) * (bf if math.sin(az) < 0 else bb), math.cos(th) * h)).normalized()
        hit = bvh.ray_cast(c, d, 1.0)
        r = (hit[0] - c).length if hit[0] is not None else 0.1
        k = smooth(0.0, 1.6, th)
        off = lerp(top, sides, k) + flare * smooth(rad(80), rad(125), th)
        if quiff: off += quiff * max(0.0, -math.sin(az)) ** 2 * smooth(rad(10), rad(40), th) * (1 - smooth(rad(45), rad(60), th))
        if noise: off += noise * math.sin(az * 7 + th * 5) * math.sin(th * 3 + az * 3)
        return c + d * (r + off)
    rings = []
    for r in range(1, rows + 1):
        rings.append([point(end(2 * math.pi * k / cols) * (r / rows) ** 0.9, 2 * math.pi * k / cols) for k in range(cols)])
    verts, faces = loft(rings, None, None)
    # pole at the crown
    ci = len(verts); verts.append(point(0.0, 0.0))
    for k in range(cols): faces.append((k, (k + 1) % cols, ci))
    faces = orient(verts, faces, c)
    return realize(verts, faces, [('SOLIDIFY', dict(thickness=thick, offset=-1, use_even_offset=False))])


def add_head(fig, B, hair, hair_color=0xffffff, hair_mask=HAIR, glasses=False):
    hg = head_geo(B)
    fig.add('head', hg, 0xffffff, SKIN, R_fixed('head'))
    add_face(fig, B, glasses=glasses)
    c = B['head_c']; a, bf, bb, h = B['head']
    style = hair['style']
    if style == 'short':
        fig.add('hair', hair_cap(B, hg, hair.get('line', 'short'), top=hair.get('top', 0.012), sides=0.0045, noise=hair.get('noise', 0), quiff=hair.get('quiff', 0.01)), hair_color, hair_mask, R_fixed('head'))
    elif style == 'bob':
        fig.add('hair', hair_cap(B, hg, 'bob', top=0.016, sides=0.010, flare=0.02, rows=6, cols=15, quiff=0.006), hair_color, hair_mask, R_hair_long(B))
    elif style == 'ponytail':
        fig.add('hair', hair_cap(B, hg, 'back', top=0.010, sides=0.004), hair_color, hair_mask, R_fixed('head'))
        p0 = c + v(0, bb * 0.92, h * 0.28); pts = [p0 + v(0, -0.02, 0.01), p0 + v(0, 0.03, -0.02), p0 + v(0, 0.055, -0.09), p0 + v(0, 0.05, -0.19)]
        pl = Polyline(pts)
        st = [(0.0, .028, .028, .028), (0.04, .034, .034, .034), (0.10, .030, .030, .030), (0.17, .022, .022, .022), (pl.total, .012, .012, .012)]
        fig.add('ponytail', tube(pl, st, 8, 'pole', 'pole', wh=Z), hair_color, hair_mask, R_hair_long(B))
    elif style == 'bun':
        fig.add('hair', hair_cap(B, hg, 'back', top=0.009, sides=0.004), hair_color, hair_mask, R_fixed('head'))
        fig.add('bun', ellipsoid(c + v(0, bb * 0.95, h * 0.42), 0.042, 0.034, 0.036, 10, 5, rot=Rx(0.5)), hair_color, hair_mask, R_fixed('head'))
    neck_rings = []
    nz0, nz1 = B['neck0'] - 0.045, c.z - h * 0.45
    for t in (0.0, 0.35, 0.7, 1.0):
        z = lerp(nz0, nz1, t)
        neck_rings.append(section(v(0, lerp(0.006, c.y + 0.012, t), z), Z, 9, B['neck_r'], B['neck_r'] * 0.95, B['neck_r'] * 1.02))
    fig.add('neck', loft(neck_rings, None, None), 0xffffff, SKIN, R_neck(B))


def arm_pl(B, s): return Polyline([mx(B['sh'], s), mx(B['elbow'], s), mx(B['wrist'], s)])


def add_arms(fig, B, sleeve=None, sleeve_color=0xffffff, sleeve_mask=TOP, cuff=None, bare=True):
    """sleeve: arc length where the sleeve ends (None = bare arms). Long sleeves end at the wrist."""
    total = arm_pl(B, 1).total
    for s in (1, -1):
        pl = arm_pl(B, s)
        if sleeve is None or sleeve < total - 0.03:
            st = [x for x in B['arm'] if x[0] >= (sleeve - 0.05 if sleeve else -1)]
            fig.add('arm', tube(pl, st, 7, 'pole' if not sleeve else 'flat', None), 0xffffff, SKIN, R_arm(B, s))
        if sleeve is not None:
            infl = 0.011
            st = [(x[0], x[1] + infl, x[2] + infl, x[3] + infl) for x in B['arm'] if x[0] <= sleeve - 0.01]
            a_end = torso_like_arm(B['arm'], sleeve)
            st.append((sleeve, a_end[0] + infl + 0.006, a_end[1] + infl + 0.006, a_end[2] + infl + 0.006))
            st.append((sleeve - 0.004, a_end[0] + 0.004, a_end[1] + 0.004, a_end[2] + 0.004))
            fig.add('sleeve', tube(pl, st, 8, 'pole', None), sleeve_color, sleeve_mask, R_arm(B, s), center=pl.at(sleeve * 0.5))
        # hand
        d = (B['wrist'] - B['elbow']).normalized()
        hp = Polyline([mx(B['wrist'], s), mx(B['wrist'] + d * B['hand_len'], s)])
        k = B['hand_len'] / 0.175
        fig.add('hand', tube(hp, B['hand'], 7, 'flat', 'pole'), 0xffffff, SKIN, R_hand(B, s))
        tb = mx(B['wrist'] + d * 0.035 * k, s) + v(-0.006 * s, -0.022 * k, 0)
        tdir = (mx(d, s) * 0.55 + v(-0.25 * s, -0.75, 0)).normalized()
        fig.add('thumb', rod(tb, tb + tdir * 0.05 * k, 0.012 * k, 0.010 * k, n=4), 0xffffff, SKIN, R_hand(B, s))


def torso_like_arm(st, s):
    for i in range(len(st) - 1):
        if st[i][0] <= s <= st[i + 1][0]:
            t = (s - st[i][0]) / (st[i + 1][0] - st[i][0])
            return tuple(lerp(st[i][j], st[i + 1][j], t) for j in (1, 2, 3))
    return st[-1][1:]


def leg_pl(B, s): return Polyline([mx(B['hip'], s), mx(B['knee'], s), mx(B['ankle'], s)])


def add_legs(fig, B, trouser_end=None, color=0x2d3440, mask=BOTTOM, infl=0.012, bare_from=None, straight=0.0, skin_color=0xffffff, skin_mask=SKIN, hem=True, top_cut=True):
    """trouser_end: arc length where trousers end (None = no trousers); bare legs below bare_from."""
    total = leg_pl(B, 1).total
    for s in (1, -1):
        pl = leg_pl(B, s)
        if bare_from is not None:
            st = [x for x in B['leg'] if x[0] >= bare_from]
            fig.add('leg', tube(pl, st, 8, 'flat', 'flat'), skin_color, skin_mask, R_leg(B, s))
        if trouser_end is not None:
            st = []
            for x in B['leg']:
                if x[0] < -0.01 and top_cut: continue
                if x[0] > trouser_end - 0.01: break
                a, f, b = x[1] + infl, x[2] + infl, x[3] + infl
                if straight and x[0] > 0.3: a, f, b = max(a, straight), max(f, straight), max(b, straight)
                st.append((x[0], a, f, b))
            e = torso_like_arm(B['leg'], trouser_end)
            ea = max(e[0] + infl + 0.004, straight); ef = max(e[1] + infl + 0.004, straight); eb = max(e[2] + infl + 0.004, straight)
            st.append((trouser_end, ea, ef, eb))
            if hem: st.append((trouser_end - 0.004, ea - 0.008, ef - 0.008, eb - 0.008))
            fig.add('trouser', tube(pl, st, 9, 'flat', None), color, mask, R_leg(B, s), center=pl.at(trouser_end * 0.5))


def add_shoes(fig, B, color, sole=0x3a3532, sole_mask=FIXED, color_mask=FIXED):
    for s in (1, -1):
        ank = mx(B['ankle'], s)
        heel_y = ank.y + B['heel_back']
        pts = [v(ank.x, heel_y, 0), v(ank.x, heel_y - 0.3, 0)]
        pl = Polyline(pts)
        rings = []
        for sv, a, bl, ba, cz in B['shoe']:
            rings.append(section(pl.at(sv) + v(0.004 * s if sv > 0.1 else 0, 0, cz + 0.004), -Y, 8, a, bl - 0.004, ba, e=2.6, uh=X, wh=Z))
        last = B['shoe'][-1]
        fig.add('shoe', loft(rings, 'flat', pl.at(last[0] + 0.012) + v(0, 0, last[4] - 0.002)), color, color_mask, R_shoe(B, s))
        rings = []
        for sv, a, bl, ba, cz in [B['shoe'][i] for i in (1, 3, 5, 6)]:
            h = 0.0095 * (B['foot_len'] / 0.265)
            rings.append(section(pl.at(sv) + v(0.004 * s if sv > 0.1 else 0, 0, h), -Y, 6, a + 0.004, h, h, e=3.0, uh=X, wh=Z))
        fig.add('sole', loft(rings, 'flat', pl.at(last[0] + 0.016) + v(0, 0, 0.008)), sole, sole_mask, R_shoe(B, s))


def torso_rings(B, z_from, z_to, infl, n=16, e=2.3, below=(), top_zfun=None, lip=0.0):
    table = B['torso']
    zs = [z_from] + [z for z, *_ in table if z_from + 0.01 < z < z_to - 0.01] + [z_to]
    rings = []
    for x in below:  # (z, a, f, b, y) rings under the table (coat tails, skirts)
        rings.append(section(v(0, x[4], x[0]), Z, n, x[1], x[2], x[3], e=e))
    if lip and below:
        x = below[0]
        rings.insert(0, section(v(0, x[4], x[0] + 0.006), Z, n, x[1] - lip, x[2] - lip, x[3] - lip, e=e))
    for i, z in enumerate(zs):
        a, f, b, y = torso_at(table, z)
        rings.append(section(v(0, y, z), Z, n, a + infl, f + infl, b + infl, e=e, zfun=top_zfun if i == len(zs) - 1 else None))
    return rings


def add_buttons(fig, B, zs, color=0x2a2420, infl=0.014):
    for z in zs:
        a, f, b, y = torso_at(B['torso'], z)
        fig.add('button', ellipsoid(v(0.0, y - f - infl - 0.001, z), 0.008, 0.004, 0.008, 5, 2), color, FIXED, R_torso(B))


# ------------------------------------------------------------------------------------------------
# Variants
# ------------------------------------------------------------------------------------------------
def dress_coat(fig, B):
    """Man in a wool coat to mid-thigh, scarf, dark trousers, leather shoes."""
    hz = B['hip'].z
    below = [(0.585, 0.226, 0.160, 0.158, 0.0), (0.66, 0.222, 0.157, 0.153, 0.0), (0.76, 0.214, 0.152, 0.146, 0.004), (0.86, 0.206, 0.146, 0.138, 0.006),
             (0.95, 0.196, 0.130, 0.130, 0.006)]
    rings = torso_rings(B, 1.03, 1.47, 0.016, n=14, below=below, lip=0.012)
    fig.add('coat', loft(rings, 'flat', 'flat'), 0xffffff, TOP, R_torso(B, skirt=1.0, thigh_reach=0.16))
    col = [section(v(0, 0.006, z), Z, 14, a, f, b) for z, a, f, b in ((1.445, 0.090, 0.078, 0.084), (1.50, 0.074, 0.066, 0.071), (1.505, 0.064, 0.056, 0.061))]
    fig.add('collar', loft(col, None, None), 0xffffff, TOP, R_neck(B), center=v(0, 0, 1.47))
    add_buttons(fig, B, (0.98, 1.10, 1.22), infl=0.017)
    # scarf: a loop around the collar and one end hanging down the chest
    fig.add('scarf', torus(v(0, 0.004, 1.47), Z, 0.074, 0.024, 11, 4, rscale=(1.0, 1.0), flat=0.9), 0x8e3b36, FIXED, R_vertical([(None, None, 'chest'), (1.47, 0.03, 'neck')]))
    pts = [v(0.045, -0.088, 1.455), v(0.056, -0.128, 1.36), v(0.060, -0.140, 1.24)]
    fig.add('scarf', tube(Polyline(pts), [(0, .030, .010, .010), (0.10, .030, .009, .009), (0.215, .028, .008, .008), (0.222, .02, .006, .006)], 6, 'flat', 'flat', e=4, uh=X, wh=Y),
            0x8e3b36, FIXED, R_torso(B))
    add_arms(fig, B, sleeve=arm_pl(B, 1).total - 0.008, sleeve_color=0xffffff)
    add_legs(fig, B, trouser_end=0.835, color=0x2b3038, infl=0.010, straight=0.055)
    add_shoes(fig, B, 0x4a3326, sole=0x231c18)
    add_head(fig, B, dict(style='short', top=0.012, quiff=0.012))


def dress_tshirt(fig, B):
    """Man in a t-shirt, shorts and white trainers."""
    rings = torso_rings(B, 0.935, 1.468, 0.009, n=14, top_zfun=None)
    lip = section(v(0, 0.006, 0.94), Z, 14, *[x - 0.001 for x in torso_at(B['torso'], 0.94)[:3]])
    fig.add('shirt', loft([lip] + rings, None, 'flat'), 0xffffff, TOP, R_torso(B))
    # pelvis block of the shorts
    pr = torso_rings(B, B['crotch'], 1.0, 0.004, n=14)
    fig.add('shorts', loft(pr, 'flat', 'flat'), 0xc9b48f, BOTTOM, R_pelvis_block(B))
    add_arms(fig, B, sleeve=0.15)
    add_legs(fig, B, trouser_end=0.37, color=0xc9b48f, infl=0.018, bare_from=0.22)
    add_shoes(fig, B, 0xf1f0ec, sole=0xd8d6d0)
    add_head(fig, B, dict(style='short', top=0.016, quiff=0.016, noise=0.003))


def dress_dress(fig, B):
    """Woman in a knee-length dress with a belt, bare legs, flats, bob haircut."""
    skirt = [(0.455, 0.232, 0.170, 0.178, 0.012), (0.58, 0.218, 0.157, 0.166, 0.012), (0.72, 0.200, 0.140, 0.150, 0.013), (0.84, 0.182, 0.118, 0.132, 0.013),
             (0.93, 0.163, 0.100, 0.114, 0.008)]
    scoop = lambda cs, sn: -0.065 * max(0.0, -sn) ** 2.5
    rings = torso_rings(B, 0.99, 1.335, 0.007, n=16, below=skirt, top_zfun=scoop, lip=0.008)
    fig.add('dress', loft(rings, 'flat', None), 0xffffff, TOP, R_torso(B, skirt=0.9, thigh_reach=0.30), center=v(0, 0, 0.95))
    # skin of the upper chest, under the neckline
    up = [section(v(0, y, z), Z, 12, a - 0.002, f - 0.002, b - 0.002) for z, (a, f, b, y) in ((zz, torso_at(B['torso'], zz)) for zz in (1.22, 1.295, 1.345, 1.372))]
    fig.add('chest', loft(up, 'flat', 'flat'), 0xffffff, SKIN, R_torso(B))
    belt = [section(v(0, y, z), Z, 16, a + i, f + i, b + i) for z, i in ((0.981, 0.013), (1.013, 0.013), (1.016, 0.006)) for (a, f, b, y) in [torso_at(B['torso'], z)]]
    fig.add('belt', loft(belt, None, None), 0x3b2a22, FIXED, R_torso(B), center=v(0, 0, 1.0))
    add_arms(fig, B, sleeve=0.085)
    add_legs(fig, B, bare_from=0.0)
    add_shoes(fig, B, 0x2a2426, sole=0x1c1a1b)
    add_head(fig, B, dict(style='bob'))


def dress_jacket(fig, B):
    """Woman in a short jacket, jeans, trainers and a ponytail."""
    below = [(0.795, 0.188, 0.116, 0.134, 0.014), (0.87, 0.184, 0.112, 0.130, 0.012)]
    rings = torso_rings(B, 0.95, 1.36, 0.014, n=14, below=below, lip=0.01)
    fig.add('jacket', loft(rings, None, 'flat'), 0xffffff, TOP, R_torso(B, skirt=0.8, thigh_reach=0.16))
    col = [section(v(0, 0.006, z), Z, 14, a, f, b) for z, a, f, b in ((1.345, 0.078, 0.068, 0.072), (1.39, 0.062, 0.054, 0.060), (1.394, 0.054, 0.047, 0.052))]
    fig.add('collar', loft(col, None, None), 0xffffff, TOP, R_neck(B), center=v(0, 0, 1.37))
    pr = torso_rings(B, B['crotch'], 0.97, 0.008, n=16)
    fig.add('jeans', loft(pr, 'flat', 'flat'), 0x3c5372, BOTTOM, R_pelvis_block(B))
    add_arms(fig, B, sleeve=arm_pl(B, 1).total - 0.006)
    add_legs(fig, B, trouser_end=leg_pl(B, 1).total - 0.012, color=0x3c5372, infl=0.008)
    add_shoes(fig, B, 0xeeece6, sole=0xb9b4ab)
    add_head(fig, B, dict(style='ponytail'))


def dress_child(fig, B):
    """Child in a hoodie, jeans, bright trainers and a small backpack."""
    below = [(0.56, 0.138, 0.090, 0.098, 0.010), (0.62, 0.134, 0.088, 0.094, 0.008)]
    rings = torso_rings(B, 0.68, 0.955, 0.012, n=14, below=below, lip=0.01)
    fig.add('hoodie', loft(rings, None, 'flat'), 0xffffff, TOP, R_torso(B, skirt=0.8, thigh_reach=0.12))
    fig.add('hood', ellipsoid(v(0, 0.062, 0.93), 0.085, 0.045, 0.055, 12, 5, rot=Rx(-0.35)), 0xffffff, TOP, R_vertical([(None, None, 'chest'), (0.97, 0.03, 'neck')]))
    pr = torso_rings(B, B['crotch'], 0.70, 0.008, n=14)
    fig.add('jeans', loft(pr, 'flat', 'flat'), 0x405a80, BOTTOM, R_pelvis_block(B))
    add_arms(fig, B, sleeve=arm_pl(B, 1).total - 0.004)
    add_legs(fig, B, trouser_end=leg_pl(B, 1).total - 0.008, color=0x405a80, infl=0.009, straight=0.04)
    add_shoes(fig, B, 0xd8463a, sole=0xf2f0ea)
    # backpack: rounded box on the back with two straps
    rings = []
    for z, k in ((0.66, 0.80), (0.672, 0.97), (0.80, 1.0), (0.885, 0.97), (0.897, 0.80)):
        rings.append(section(v(0, 0.128, z), Z, 12, 0.095 * k, 0.040 * k, 0.050 * k, e=4.0))
    fig.add('backpack', loft(rings, 'flat', 'flat'), 0x2f4d6e, FIXED, R_vertical([(None, None, 'spine'), (0.80, 0.06, 'chest')]))
    for s in (1, -1):
        pts = [v(0.06 * s, 0.075, 0.90), v(0.075 * s, -0.01, 0.945), v(0.085 * s, -0.088, 0.88), v(0.09 * s, -0.093, 0.76), v(0.08 * s, 0.03, 0.68)]
        fig.add('strap', tube(Polyline(pts), [(0, .012, .004, .004), (Polyline(pts).total, .012, .004, .004)], 4, 'flat', 'flat', e=4), 0x2f4d6e, FIXED, R_torso(B))
    add_head(fig, B, dict(style='short', line='child', top=0.016, quiff=0.008, noise=0.005))


def dress_elder(fig, B):
    """Older woman: cardigan, mid-calf skirt, tights, glasses, grey bun and a cane."""
    rings = torso_rings(B, 0.90, 1.31, 0.014, n=14, below=[(0.755, 0.192, 0.122, 0.138, 0.012), (0.83, 0.186, 0.116, 0.132, 0.012)], lip=0.01)
    fig.add('cardigan', loft(rings, None, 'flat'), 0xffffff, TOP, R_torso(B, skirt=0.7, thigh_reach=0.16))
    add_buttons(fig, B, (0.86, 0.95, 1.04, 1.13), infl=0.015)
    up = [section(v(0, y, z), Z, 16, a - 0.002, f - 0.002, b - 0.002) for z, (a, f, b, y) in ((zz, torso_at(B['torso'], zz)) for zz in (1.22, 1.28, 1.32))]
    fig.add('blouse', loft(up, 'flat', 'flat'), 0xe9e4da, FIXED, R_torso(B))
    skirt = [(0.30, 0.192, 0.135, 0.145, 0.012), (0.48, 0.190, 0.130, 0.142, 0.012), (0.66, 0.182, 0.120, 0.134, 0.013), (0.80, 0.172, 0.108, 0.124, 0.012)]
    sr = torso_rings(B, 0.84, 0.92, 0.006, n=14, below=skirt, lip=0.01)
    fig.add('skirt', loft(sr, 'flat', 'flat'), 0x5b5550, BOTTOM, R_torso(B, skirt=0.62, thigh_reach=0.45))
    add_arms(fig, B, sleeve=arm_pl(B, 1).total - 0.01)
    add_legs(fig, B, bare_from=0.0, skin_color=0x4a4440, skin_mask=FIXED)
    add_shoes(fig, B, 0x3a2b22, sole=0x1e1814)
    add_head(fig, B, dict(style='bun'), hair_color=0xd0ccc4, hair_mask=(0, 0, 0.3, 0), glasses=True)
    # cane in the right hand: grip in the fist, shaft to the ground
    g = cane_grip(B)
    fig.add('cane', merge_geo(rod(g + v(0, 0, 0.02), v(g.x, g.y, 0.0), 0.0115, 0.010, n=6), rod(g + v(0, 0.035, 0.026), g + v(0, -0.07, 0.026), 0.011, n=6)),
            0x3b2618, FIXED, R_fixed('cane'))


def cane_grip(B):
    d = (B['wrist'] - B['elbow']).normalized()
    return mx(B['wrist'] + d * B['hand_len'] * 0.45, -1) + v(0.0, -0.01, 0)


def elder_bones(B):
    g = cane_grip(B)
    return [('cane', g, v(g.x, g.y, 0.0), 'hand.R')]


# ------------------------------------------------------------------------------------------------
# Cyclist: a rider on a city bike, one mesh, one armature
# ------------------------------------------------------------------------------------------------
BIKE = dict(Rw=0.35, FA=v(0, -0.56, 0.35), RA=v(0, 0.55, 0.35), BB=v(0, 0.11, 0.28), crank=0.17, gear=2.5,
            HT=v(0, -0.425, 0.86), HB=v(0, -0.465, 0.70), seat_dir=v(0, 0.34, 0.94).normalized(), seat_len=0.60,
            grip=v(0.275, -0.205, 1.005), frame=0x2f5547, ped_x=0.135)


def bike_saddle(): return BIKE['BB'] + BIKE['seat_dir'] * BIKE['seat_len']


def bike_bones():
    b = BIKE
    bones = [('bike', v(0, 0, 0), v(0, -0.3, 0), 'root'),
             ('wheel.F', b['FA'], b['FA'] + v(0, 0, 0.15), 'bike'),
             ('wheel.R', b['RA'], b['RA'] + v(0, 0, 0.15), 'bike'),
             ('crank', b['BB'], b['BB'] + v(0, 0.1, 0), 'bike')]
    for s, S in ((1, 'L'), (-1, 'R')):
        p = b['BB'] + v(s * b['ped_x'], s * b['crank'], 0)
        bones.append((f'pedal.{S}', p, p + v(0, -0.06, 0), 'crank'))
    return bones


def add_bike(fig):
    b = BIKE; FR = b['frame']; DARK = 0x1d1f21; SIL = 0xb8bcc0
    BB, FA, RA, HT, HB = b['BB'], b['FA'], b['RA'], b['HT'], b['HB']
    sad = bike_saddle()
    R = R_fixed('bike')
    tubes = [
        Polyline([HB + v(0, 0.01, 0.03), v(0, -0.34, 0.53), v(0, -0.15, 0.36), BB]),
        Polyline([HT + v(0, 0.005, -0.03), v(0, -0.30, 0.66), v(0, -0.06, 0.50), BB + b['seat_dir'] * 0.22]),
        Polyline([BB, sad - b['seat_dir'] * 0.03]),
    ]
    for pl in tubes:
        fig.add('frame', tube(pl, [(0, .018, .018, .018), (pl.total, .017, .017, .017)] if len(pl.p) == 2 else
                              [(0, .019, .019, .019)] + [(pl.cum[i], .019, .019, .019) for i in range(1, len(pl.p) - 1)] + [(pl.total, .018, .018, .018)], 6, 'flat', 'flat'), FR, FIXED, R)
    fig.add('frame', rod(HB - v(0, 0.01, 0.035), HT + v(0, 0.003, 0.03), 0.022, n=8), FR, FIXED, R)
    for s in (1, -1):
        fig.add('frame', rod(BB + v(0.02 * s, 0, 0), RA + v(0.055 * s, 0, 0), 0.011, 0.009, n=5), FR, FIXED, R)
        top = BB + b['seat_dir'] * 0.47
        fig.add('frame', rod(top + v(0.012 * s, 0.01, 0), RA + v(0.055 * s, 0, 0.01), 0.010, 0.008, n=5), FR, FIXED, R)
        fig.add('fork', rod(HB + v(0.03 * s, 0, 0), FA + v(0.05 * s, 0, 0), 0.012, 0.009, n=5), FR, FIXED, R)
        # rack side rails and struts
        fig.add('rack', rod(v(0.075 * s, 0.30, 0.77), v(0.075 * s, 0.86, 0.75), 0.006, n=4), DARK, FIXED, R)
        fig.add('rack', rod(v(0.075 * s, 0.84, 0.75), RA + v(0.06 * s, 0.02, 0.0), 0.006, n=4), DARK, FIXED, R)
    for y in (0.40, 0.62, 0.84):
        fig.add('rack', rod(v(-0.075, y, 0.765 - (y - 0.3) * 0.03), v(0.075, y, 0.765 - (y - 0.3) * 0.03), 0.006, n=4), DARK, FIXED, R)
    # stem and swept-back handlebar
    stem_top = v(0, -0.415, 0.985)
    fig.add('stem', rod(HT, stem_top, 0.014, n=6), SIL, FIXED, R)
    for s in (1, -1):
        g = mx(b['grip'], s)
        pts = [stem_top + v(0, 0.0, 0.0), stem_top + v(0.13 * s, 0.0, 0.0), v(0.235 * s, -0.33, 0.993), g + v(0, -0.07, 0)]
        fig.add('bar', tube(Polyline(pts), [(0, .011, .011, .011), (Polyline(pts).total, .011, .011, .011)], 6, 'flat', 'flat'), SIL, FIXED, R)
        fig.add('grip', rod(g + v(0, -0.075, 0), g + v(0.01 * s, 0.035, 0), 0.016, n=6), 0x3a2a20, FIXED, R)
    # saddle: wide at the back, narrow nose
    pl = Polyline([sad + v(0, -0.12, 0.03), sad + v(0, 0.11, 0.03)])
    st = [(0, .020, .012, .010), (0.05, .030, .016, .014), (0.13, .075, .022, .020), (0.20, .085, .022, .022), (0.23, .07, .016, .016)]
    fig.add('saddle', tube(pl, st, 10, 'pole', 'flat', uh=X, wh=Z), 0x4a3426, FIXED, R)
    # fenders
    for c, a0, a1 in ((FA, rad(-35), rad(205)), (RA, rad(-30), rad(215))):
        fig.add('fender', torus(c, X, b['Rw'] + 0.035, 0.03, 14, 4, a0, a1, closed=False, flat=0.25), FR, FIXED, R, center=c)
    # chain guard, front basket, lamps
    cg = Polyline([BB + v(-0.07, -0.06, 0.02), RA + v(-0.07, -0.05, 0.03)])
    fig.add('chainguard', tube(cg, [(0, .006, .07, .05), (cg.total, .006, .05, .04)], 6, 'flat', 'flat', e=4, uh=X, wh=Z), DARK, FIXED, R)
    rings = [section(v(0, -0.63, z), Z, 12, a, f, bb, e=5.0) for z, a, f, bb in ((0.80, 0.15, 0.115, 0.115), (0.815, 0.165, 0.13, 0.13), (0.98, 0.175, 0.14, 0.14), (0.985, 0.16, 0.125, 0.125), (0.94, 0.15, 0.115, 0.115))]
    fig.add('basket', loft(rings, 'flat', None), 0x9b7748, FIXED, R, center=v(0, -0.63, 0.88))
    fig.add('lamp', ellipsoid(HB + v(0, -0.06, 0.05), 0.028, 0.03, 0.028, 8, 4), 0xf3eedc, FIXED, R)
    fig.add('lamp', ellipsoid(v(0, 0.875, 0.75), 0.025, 0.012, 0.018, 6, 3), 0xc0302a, FIXED, R)
    # wheels: tyre, rim, spokes, hub (two-fold symmetric so 2.5 turns per crank turn loops)
    for S, c in (('F', FA), ('R', RA)):
        RW = R_fixed('wheel.' + S)
        fig.add('tyre', torus(c, X, b['Rw'] - 0.022, 0.022, 18, 4), 0x1a1a1b, FIXED, R, center=c)
        fig.add('rim', torus(c, X, b['Rw'] - 0.046, 0.008, 18, 3, flat=1.6), SIL, FIXED, R, center=c)
        fig.add('hub', rod(c + v(-0.04, 0, 0), c + v(0.04, 0, 0), 0.018, n=6, uh=Y, wh=Z), SIL, FIXED, R)
        for k in range(6):
            t = math.pi * k / 6
            d = v(0, math.cos(t), math.sin(t)) * (b['Rw'] - 0.05)
            fig.add('spoke', rod(c - d, c + d, 0.0035, n=3, caps=False, uh=Y if k % 3 else Z, wh=X), SIL, FIXED, RW)
    # cranks, chainring, pedals
    RC = R_fixed('crank')
    fig.add('chainring', rod(BB + v(-0.055, 0, 0), BB + v(-0.045, 0, 0), 0.095, n=14, uh=Y, wh=Z), 0x6d7175, FIXED, RC)
    for s, S in ((1, 'L'), (-1, 'R')):
        p = BB + v(s * b['ped_x'], s * b['crank'], 0)
        fig.add('crank', rod(BB + v(0.065 * s, 0, 0), p + v(-0.025 * s, 0, 0), 0.011, n=5, uh=Y, wh=Z), SIL, FIXED, RC)
        rings = [section(p + v(s * x, 0, 0), X, 8, 0.05, 0.012, 0.012, e=4, uh=Y, wh=Z) for x in (-0.03, 0.04)]
        fig.add('pedal', loft(rings, 'flat', 'flat'), 0x2a2a2c, FIXED, R_fixed(f'pedal.{S}'))


def dress_cyclist(fig, B):
    below = [(0.835, 0.196, 0.122, 0.134, 0.012), (0.92, 0.188, 0.116, 0.130, 0.010)]
    rings = torso_rings(B, 1.0, 1.465, 0.015, n=14, below=below, lip=0.01)
    fig.add('jacket', loft(rings, None, 'flat'), 0xffffff, TOP, R_torso(B, skirt=0.8, thigh_reach=0.16))
    col = [section(v(0, 0.006, z), Z, 14, a, f, b) for z, a, f, b in ((1.445, 0.086, 0.074, 0.080), (1.49, 0.07, 0.062, 0.068), (1.494, 0.062, 0.054, 0.06))]
    fig.add('collar', loft(col, None, None), 0xffffff, TOP, R_neck(B), center=v(0, 0, 1.47))
    pr = torso_rings(B, B['crotch'], 1.0, 0.008, n=16)
    fig.add('trousers', loft(pr, 'flat', 'flat'), 0x30343c, BOTTOM, R_pelvis_block(B))
    add_arms(fig, B, sleeve=arm_pl(B, 1).total - 0.008)
    add_legs(fig, B, trouser_end=0.83, color=0x30343c, infl=0.011)
    add_shoes(fig, B, 0x6b4a33, sole=0x2a201a)
    add_head(fig, B, dict(style='short', top=0.013, quiff=0.01))
    add_bike(fig)


# ------------------------------------------------------------------------------------------------
# Animation
# ------------------------------------------------------------------------------------------------
WALK = {
    'male': dict(stride=1.30, cycle=1.06, duty=.615, lift=.07, phs=16, pto=30, fwd_c=-.05, foot_x=.092, toe_out=6, drop=.02, pyaw=5, proll=3.5,
                 psway=.016, ptilt=3, lean=5.5, cyaw=8, arm=21, arm_fwd=3, arm_out=4, elbow=12, elbow_sw=16, nod=1.2, stoop=0),
    'female': dict(stride=1.18, cycle=0.98, duty=.615, lift=.065, phs=14, pto=30, fwd_c=-.045, foot_x=.062, toe_out=5, drop=.018, pyaw=7, proll=5,
                   psway=.02, ptilt=4, lean=4.5, cyaw=8, arm=17, arm_fwd=2, arm_out=6, elbow=14, elbow_sw=14, nod=1.0, stoop=0),
    'child': dict(stride=0.92, cycle=0.82, duty=.60, lift=.055, phs=14, pto=26, fwd_c=-.03, foot_x=.072, toe_out=6, drop=.016, pyaw=6, proll=4,
                  psway=.014, ptilt=4, lean=5, cyaw=8, arm=27, arm_fwd=4, arm_out=6, elbow=16, elbow_sw=18, nod=1.6, stoop=0),
    'elder': dict(stride=0.80, cycle=1.22, duty=.66, lift=.04, phs=7, pto=18, fwd_c=-.03, foot_x=.095, toe_out=10, drop=.04, pyaw=3, proll=3,
                  psway=.018, ptilt=8, lean=9, cyaw=5, arm=9, arm_fwd=4, arm_out=7, elbow=18, elbow_sw=8, nod=1.0, stoop=1),
}


def foot_path(B, st, ph):
    """Ankle (fwd, z) relative to the hip line on a treadmill, and foot pitch (toes up +).
    ph = 0 at heel strike of this foot."""
    S, beta = st['stride'], st['duty']
    ah = B['ankle'].z; hb = B['heel_back']; ball = B['ball']
    phs, pto = rad(st['phs']), rad(st['pto'])
    pf, pho = 0.1, 0.36 if beta > 0.62 else 0.33

    def rot(f, z, a): return (f * math.cos(a) - z * math.sin(a), f * math.sin(a) + z * math.cos(a))

    def stance(p):
        anchor = st['fwd_c'] + beta * S / 2 - S * p
        if p < pf:
            phi = phs * (1 - smooth(0, pf, p)); pv = (-hb, -ah)
        elif p < pho:
            return (anchor, ah), 0.0
        else:
            phi = -pto * ((p - pho) / (beta - pho)) ** 1.5; pv = (ball, -ah)
        r = rot(-pv[0], -pv[1], phi)
        return (anchor + pv[0] + r[0], r[1]), phi
    if ph < beta: return stance(ph)
    s = (ph - beta) / (1 - beta)
    (f0, z0), a0 = stance(beta); (f1, z1), a1 = stance(0.0)
    m = -S * (1 - beta) * 0.6
    h00, h10, h01, h11 = 2 * s ** 3 - 3 * s ** 2 + 1, s ** 3 - 2 * s ** 2 + s, -2 * s ** 3 + 3 * s ** 2, s ** 3 - s ** 2
    f = h00 * f0 + h10 * m + h01 * f1 + h11 * m
    z = lerp(z0, z1, smooth(0, 1, s)) + st['lift'] * math.sin(math.pi * s ** 0.85) * (1 - 0.2 * s)
    a = lerp(a0, a1, smooth(0.05, 0.8, s)) - rad(6) * math.sin(math.pi * clamp(s / 0.6))
    return (f, z), a


def leg_ik(R, P, S, ankle, pitch, yaw, pole_local=None, reach=0.9995, W=None, H=None):
    th, sh, ft = 'thigh.' + S, 'shin.' + S, 'foot.' + S
    if W is None: W, H = R.fk(P)
    par = R.bones[th][2]; Wp = W[par]; hip = H[th]
    h0, k0, _ = R.bones[th]; a0 = R.bones[sh][1]
    L1 = (k0 - h0).length; L2 = (a0 - k0).length
    D = ankle - hip; d = clamp(D.length, abs(L1 - L2) + 1e-4, (L1 + L2) * reach); Dn = D.normalized()
    s = 1 if S == 'L' else -1
    pole = Wp @ (pole_local if pole_local is not None else v(0.10 * s, -1, 0))
    pp = (pole - Dn * pole.dot(Dn)).normalized()
    a = (L1 * L1 + d * d - L2 * L2) / (2 * d); hh = math.sqrt(max(0.0, L1 * L1 - a * a))
    knee = hip + Dn * a + pp * hh; ank = hip + Dn * d
    Qt = basis_rot((k0 - h0), v(0, -1, 0), knee - hip, pp)
    P.q[th] = Wp.inverted() @ Qt
    Qs = basis_rot(a0 - k0, X, ank - knee, Qt @ X)
    P.q[sh] = Qt.inverted() @ Qs
    P.q[ft] = Qs.inverted() @ (Rz(yaw) @ Rx(-pitch))
    return ank


def arm_ik(R, P, S, wrist, pole, hand_dir=None, palm=None):
    ua, fa, hd = 'upperarm.' + S, 'forearm.' + S, 'hand.' + S
    W, H = R.fk(P)
    par = R.bones[ua][2]; Wp = W[par]; sh = H[ua]
    s0, e0, _ = R.bones[ua]; w0 = R.bones[fa][1]
    L1 = (e0 - s0).length; L2 = (w0 - e0).length
    D = wrist - sh; d = clamp(D.length, abs(L1 - L2) + 1e-4, (L1 + L2) * 0.999); Dn = D.normalized()
    pp = (pole - Dn * pole.dot(Dn)).normalized()
    a = (L1 * L1 + d * d - L2 * L2) / (2 * d); hh = math.sqrt(max(0.0, L1 * L1 - a * a))
    elbow = sh + Dn * a + pp * hh; wr = sh + Dn * d
    Qu = basis_rot(e0 - s0, Y, elbow - sh, pp)
    P.q[ua] = Wp.inverted() @ Qu
    Qf = basis_rot(w0 - e0, X, wr - elbow, Qu @ X)
    P.q[fa] = Qu.inverted() @ Qf
    if hand_dir is not None:
        h0, t0, _ = R.bones[hd]; s = 1 if S == 'L' else -1
        Qh = basis_rot(t0 - h0, v(-s, 0, 0), hand_dir, palm)
        P.q[hd] = Qf.inverted() @ Qh
    return wr


def upper_body(P, st, u, look=0.0, nod=0.0, extra_lean=0.0):
    """Spine counter-rotation, lean and a head that keeps looking ahead."""
    tw = 2 * math.pi * u
    pyaw = -rad(st['pyaw']) * math.cos(tw)
    cy = rad(st['cyaw']) * math.cos(tw - 0.15)
    k = cy - pyaw
    stoop = st.get('stoop', 0)
    lean = rad(st['lean']) + extra_lean
    P.q['spine'] = Rz(k * 0.45) @ Rx(lean * 0.5 + rad(7) * stoop - rad(st['ptilt']) * 0.5) @ Ry(rad(st['proll']) * 0.4 * math.sin(tw))
    P.q['chest'] = Rz(k * 0.55) @ Rx(lean * 0.5 + rad(11) * stoop)
    P.q['neck'] = Rz(-cy * 0.45) @ Rx(-rad(5) * stoop - lean * 0.3)
    P.q['head'] = Rz(-cy * 0.5 + look) @ Rx(-rad(st['ptilt']) * 0.5 - lean * 0.6 - rad(9) * stoop + nod + rad(st['nod']) * math.sin(2 * tw + 0.6))


def walk_poses(R, B, st, n, elder=False):
    beta = st['duty']; poses = []; zl = []; targets = []
    for f in range(n):
        u = f / n; tw = 2 * math.pi * u
        P = Pose()
        yaw = -rad(st['pyaw']) * math.cos(tw); roll = -rad(st['proll']) * math.sin(tw)
        P.q['pelvis'] = Rz(yaw) @ Ry(roll) @ Rx(rad(st['ptilt']))
        P.off['pelvis'] = v(st['psway'] * math.sin(tw), 0, -st['drop'])
        tg = {}
        for s, S, ph in ((1, 'L', u), (-1, 'R', (u + 0.5) % 1)):
            (fw, z), pitch = foot_path(B, st, ph)
            tg[S] = (v(s * st['foot_x'], -fw + B['ankle'].y * 0.3, z), pitch, s)
        W, H = R.fk(P)
        lim = 0.0
        for S, (a, pitch, s) in tg.items():
            hip = H['thigh.' + S]; L = (R.length('thigh.' + S) + R.length('shin.' + S)) * 0.994
            dxy2 = (a.x - hip.x) ** 2 + (a.y - hip.y) ** 2
            zmax = a.z + math.sqrt(max(0.0, L * L - dxy2))
            lim = min(lim, zmax - hip.z)
        zl.append(lim); poses.append(P); targets.append(tg)
    # pelvis height: as high as the legs allow, smoothed around the loop
    base = [min(0.0, x) for x in zl]
    sm = [0.25 * base[(i - 1) % n] + 0.5 * base[i] + 0.25 * base[(i + 1) % n] for i in range(n)]
    for i, P in enumerate(poses):
        P.off['pelvis'].z += min(sm[i], zl[i])
        u = i / n; tw = 2 * math.pi * u
        W, H = R.fk(P)
        for S, (a, pitch, s) in targets[i].items():
            leg_ik(R, P, S, a, pitch, rad(st['toe_out']) * s, W=W, H=H)
        upper_body(P, st, u)
        for s, S in ((1, 'L'), (-1, 'R')):
            sw = -rad(st['arm']) * math.cos(tw - 0.25) * s + rad(st['arm_fwd'])
            if elder and S == 'R': sw = rad(12) + 0.25 * sw
            P.q['clav.' + S] = Ry(-s * rad(1.5) * (1 + math.sin(2 * tw))) @ Rz(s * 0.3 * sw * 0.15)
            P.q['upperarm.' + S] = Rx(-sw) @ Ry(-s * rad(st['arm_out']))
            el = rad(st['elbow']) + rad(st['elbow_sw']) * max(0.0, sw / max(rad(st['arm']), 1e-3))
            if elder and S == 'R': el = rad(38)
            P.q['forearm.' + S] = Rx(-el) @ Rz(s * rad(8))
            P.q['hand.' + S] = Rx(-rad(6)) @ Rz(s * rad(5))
        if elder: cane_aim(R, P, B, st, u)
    return poses


def cane_aim(R, P, B, st, u):
    """The cane tip is planted with the left foot (opposite hand) and swings with the right leg."""
    W, H = R.fk(P)
    hd = 'hand.R'; Wh = W[hd]
    grip = H['cane']
    (fw, z), _ = foot_path(B, dict(st, lift=0.03), u)
    tip = v(-0.20, -(fw + 0.12), max(0.0, z - B['ankle'].z) * 0.6)
    d = tip - grip
    h0, t0, _ = R.bones['cane']; L = (t0 - h0).length
    Qc = basis_rot(t0 - h0, Y, d, Wh @ Y)
    P.q['cane'] = Wh.inverted() @ Qc
    P.sc['cane'] = clamp(d.length / L, 0.85, 1.12)


def idle_poses(R, B, st, n, elder=False):
    poses = []
    for f in range(n):
        u = f / n; tw = 2 * math.pi * u
        P = Pose()
        shift = math.sin(tw)
        P.q['pelvis'] = Rz(rad(2.5) * shift) @ Ry(-rad(2.8) * shift) @ Rx(rad(st['ptilt']) * (1.6 if elder else 0.6))
        P.off['pelvis'] = v(0.022 * shift, 0.004 * math.sin(2 * tw), 0.0)
        breath = math.sin(2 * tw)
        look = rad(30) * smooth(0.28, 0.40, u) * (1 - smooth(0.56, 0.68, u)) - rad(14) * smooth(0.78, 0.86, u) * (1 - smooth(0.92, 0.99, u))
        stoop = st.get('stoop', 0)
        P.q['spine'] = Ry(rad(1.8) * shift) @ Rx(rad(7) * stoop - rad(0.6) * breath)
        P.q['chest'] = Ry(rad(1.2) * shift) @ Rx(rad(11) * stoop - rad(0.9) * breath) @ Rz(look * 0.12)
        P.q['neck'] = Rz(look * 0.35) @ Rx(-rad(5) * stoop)
        P.q['head'] = Rz(look * 0.55) @ Rx(-rad(9) * stoop + rad(2.5) * math.sin(tw + 1.3) - rad(st['ptilt']) * 0.4) @ Ry(-rad(2) * shift)
        feet = {S: v(s * (0.098 if s > 0 else 0.108) * B['H'] / 1.78, (0.0 if s > 0 else 0.045) * B['H'] / 1.78 + 0.012, B['ankle'].z) for s, S in ((1, 'L'), (-1, 'R'))}
        W, H = R.fk(P); lim = 0.0
        for S, a in feet.items():
            hip = H['thigh.' + S]; L = (R.length('thigh.' + S) + R.length('shin.' + S)) * 0.997
            lim = min(lim, a.z + math.sqrt(max(0.0, L * L - (a.x - hip.x) ** 2 - (a.y - hip.y) ** 2)) - hip.z)
        P.off['pelvis'].z = lim - (0.035 if elder else 0.0)
        W, H = R.fk(P)
        for s, S in ((1, 'L'), (-1, 'R')):
            a = feet[S]
            leg_ik(R, P, S, a, 0.0, rad(9 if s > 0 else 14) * s, W=W, H=H)
            P.q['clav.' + S] = Ry(-s * rad(1.2) * (1 + breath))
            P.q['upperarm.' + S] = Rx(-rad(2.5) * math.sin(tw + s)) @ Ry(-s * rad(3 + 1.5 * shift * s))
            P.q['forearm.' + S] = Rx(-rad(10 + 3 * math.sin(tw * 2 + s))) @ Rz(s * rad(10))
            P.q['hand.' + S] = Rx(-rad(8)) @ Rz(s * rad(6))
        if elder:  # both hands rest on the cane, planted ahead and to the right
            W, H = R.fk(P)
            tip = v(-0.06, -0.26, 0.0); grip = tip + v(0.0, 0.0, 0.82 * B['H'] / 1.62)
            for s, S in ((1, 'L'), (-1, 'R')):
                tgt = grip + v(0.035 * s - 0.0, 0.03 if s > 0 else 0.0, 0.03 if s > 0 else -0.0)
                arm_ik(R, P, S, tgt + v(0, 0, 0.0), v(s * 0.7, 0.6, -0.4), hand_dir=v(-0.3 * s, -0.5, -0.8).normalized(), palm=v(0, 0, -1))
            W, H = R.fk(P); Wh = W['hand.R']
            h0, t0, _ = R.bones['cane']
            d = tip - H['cane']
            P.q['cane'] = Wh.inverted() @ basis_rot(t0 - h0, Y, d, Wh @ Y)
            P.sc['cane'] = clamp(d.length / (t0 - h0).length, 0.85, 1.15)
        poses.append(P)
    return poses


SEAT, TABLE = 0.46, 0.80


def sit_poses(R, B, st, n, elder=False):
    poses = []; child = B['kind'] == 'child'
    hipz = SEAT + (0.075 if child else 0.09)
    for f in range(n):
        u = f / n; tw = 2 * math.pi * u
        P = Pose()
        breath = math.sin(2 * tw)
        P.q['pelvis'] = Rx(-rad(10)) @ Ry(rad(1.0) * math.sin(tw))
        P.off['pelvis'] = v(0, 0.0, hipz - B['hip'].z)
        stoop = st.get('stoop', 0)
        talk = smooth(0.42, 0.5, u) * (1 - smooth(0.70, 0.78, u))
        look = rad(24) * talk - rad(18) * smooth(0.82, 0.88, u) * (1 - smooth(0.94, 1.0, u))
        P.q['spine'] = Rx(rad(13) + rad(4) * stoop - rad(0.6) * breath)
        P.q['chest'] = Rx(rad(6) + rad(8) * stoop - rad(0.9) * breath) @ Rz(look * 0.15)
        P.q['neck'] = Rz(look * 0.35) @ Rx(-rad(4) - rad(4) * stoop)
        nod = rad(5) * math.sin(tw * 6) * talk
        P.q['head'] = Rz(look * 0.5) @ Rx(-rad(4) + nod + rad(2) * math.sin(tw + 0.7))
        W, H = R.fk(P)
        k = B['H'] / 1.78
        for s, S in ((1, 'L'), (-1, 'R')):
            if child:
                swing = 0.05 * math.sin(tw * 2 + (0 if s > 0 else math.pi))
                a = v(s * 0.085, -0.30 - swing, 0.15 + 0.03 * math.sin(tw * 2 + (0 if s > 0 else math.pi)))
                leg_ik(R, P, S, a, -rad(25), rad(6) * s, v(0.1 * s, -1, 0.3), W=W, H=H)
            else:
                a = v(s * 0.125 * k, -0.43 * k + (0.03 if s > 0 else -0.01), B['ankle'].z)
                leg_ik(R, P, S, a, 0.0, rad(8) * s, v(0.12 * s, -1, 0.5), W=W, H=H)
        for s, S in ((1, 'L'), (-1, 'R')):
            P.q['clav.' + S] = Ry(-s * rad(1.0) * (1 + breath)) @ Rz(-s * rad(4))
        W, H = R.fk(P)
        hz = H['neck'].z
        if elder:
            tip = v(-0.02, -0.40, 0.0); grip = v(0.0, -0.21, 0.70)
            for s, S in ((1, 'L'), (-1, 'R')):
                arm_ik(R, P, S, grip + v(0.03 * s, 0.0, 0.035 if s > 0 else 0.0), v(s * 0.8, 0.4, -0.5), hand_dir=v(-0.5 * s, -0.6, -0.6).normalized(), palm=v(0, 0, -1))
            W, H = R.fk(P); Wh = W['hand.R']; h0, t0, _ = R.bones['cane']; d = tip - H['cane']
            P.q['cane'] = Wh.inverted() @ basis_rot(t0 - h0, Y, d, Wh @ Y); P.sc['cane'] = clamp(d.length / (t0 - h0).length, 0.8, 1.15)
            poses.append(P); continue
        for s, S in ((1, 'L'), (-1, 'R')):
            rest = v(s * 0.17 * k, -0.40 * k, TABLE + 0.035)
            if child: rest = v(s * 0.14, -0.33, TABLE + 0.035)
            tgt = rest.copy(); hdir = v(-0.35 * s, -0.9, -0.12).normalized(); palm = v(0.15 * s, 0, -1)
            if S == 'R':  # a cup to the mouth now and then
                k2 = smooth(0.12, 0.22, u) * (1 - smooth(0.30, 0.40, u))
                mouth = v(-0.045, H['neck'].y - 0.16, hz + 0.02)
                tgt = rest.lerp(mouth, k2); hdir = hdir.lerp(v(0.4, -0.1, 0.9).normalized(), k2).normalized(); palm = palm.lerp(v(1, 0, 0), k2)
            else:  # talking with the left hand
                g = smooth(0.50, 0.56, u) * (1 - smooth(0.66, 0.74, u))
                tgt = rest + v(-0.04, -0.03, 0.10 + 0.03 * math.sin(tw * 9)) * g
                hdir = hdir.lerp(v(-0.2, -0.6, 0.6).normalized(), g).normalized()
            arm_ik(R, P, S, tgt, v(s * 0.9, 0.5, -0.7), hand_dir=hdir, palm=palm)
        poses.append(P)
    return poses


# ---- cyclist animation --------------------------------------------------------------------------
def ride_poses(R, B, n):
    b = BIKE; sad = bike_saddle(); poses = []
    L = R.length('thigh.L') + R.length('shin.L')
    ah = B['ankle'].z
    # rider height on the saddle: the hip clears the lowest pedal with a slightly bent knee
    hip_y = sad.y - 0.035
    def ankle_at(th, s):
        th = th if s > 0 else th + math.pi
        pd = b['BB'] + v(s * (b['ped_x'] + 0.02), b['crank'] * math.cos(th), b['crank'] * math.sin(th))
        pitch = -rad(10) + rad(9) * math.sin(th)
        ball = v(0, -B['ball'], -ah)
        r = Rx(-pitch) @ ball
        return pd + v(0, 0, 0.018) - r, pitch
    best = 0
    for k in range(36):
        for s in (1, -1):
            a, _ = ankle_at(2 * math.pi * k / 36, s)
            hip = v(s * B['hip'].x, hip_y, 0)
            dxy = math.hypot(a.x - hip.x, a.y - hip.y)
            best = max(best, a.z + math.sqrt(max(0, (0.955 * L) ** 2 - dxy ** 2)))
    hip_z = min(best, sad.z + 0.10)
    for f in range(n):
        u = f / n; th = 2 * math.pi * u
        P = Pose()
        # spokes repeat every 30 deg, so the true 2.5 turns per crank turn alias to 7.5 deg per frame
        P.q['wheel.F'] = Rx(th * 0.5); P.q['wheel.R'] = Rx(th * 0.5)
        P.q['crank'] = Rx(th); P.q['pedal.L'] = Rx(-th); P.q['pedal.R'] = Rx(-th)
        P.q['pelvis'] = Rx(rad(16)) @ Ry(rad(1.6) * math.sin(th)) @ Rz(rad(1.5) * math.cos(th))
        P.off['pelvis'] = v(0, hip_y, hip_z - B['hip'].z)
        P.q['spine'] = Rx(rad(4)) @ Ry(-rad(1.0) * math.sin(th))
        P.q['chest'] = Rx(rad(2)) @ Rz(-rad(1.5) * math.cos(th))
        P.q['neck'] = Rx(-rad(6))
        P.q['head'] = Rx(-rad(10) + rad(1) * math.sin(2 * th)) @ Rz(rad(1.2) * math.cos(th))
        W, H = R.fk(P)
        for s, S in ((1, 'L'), (-1, 'R')):
            a, pitch = ankle_at(th, s)
            leg_ik(R, P, S, a, pitch, rad(2) * s, v(0.06 * s, -1, 0.15), W=W, H=H)
        for s, S in ((1, 'L'), (-1, 'R')):
            P.q['clav.' + S] = Rz(-s * rad(5))
            g = mx(b['grip'], s) + v(0, -0.02, 0.025)
            arm_ik(R, P, S, g, v(s * 0.8, 0.5, -0.6), hand_dir=v(0.15 * s, -0.55, -0.82).normalized(), palm=v(-0.4 * s, -0.2, -1))
        poses.append(P)
    return poses


def ride_idle_poses(R, B, n):
    """Waiting at a light: standing over the step-through frame, right foot on the raised pedal."""
    b = BIKE; poses = []
    th = -math.pi / 4
    for f in range(n):
        u = f / n; tw = 2 * math.pi * u
        P = Pose()
        P.q['crank'] = Rx(th); P.q['pedal.L'] = Rx(-th); P.q['pedal.R'] = Rx(-th)
        breath = math.sin(2 * tw)
        look = rad(35) * smooth(0.2, 0.32, u) * (1 - smooth(0.45, 0.57, u)) - rad(30) * smooth(0.62, 0.74, u) * (1 - smooth(0.82, 0.94, u))
        P.q['pelvis'] = Ry(rad(4)) @ Rx(rad(6)) @ Rz(-rad(3))
        P.off['pelvis'] = v(0.035, 0.05, -0.05)
        P.q['spine'] = Rx(rad(10) - rad(0.6) * breath) @ Ry(-rad(3))
        P.q['chest'] = Rx(rad(6) - rad(0.8) * breath) @ Rz(look * 0.15)
        P.q['neck'] = Rz(look * 0.35) @ Rx(-rad(6))
        P.q['head'] = Rz(look * 0.5) @ Rx(-rad(10) + rad(2) * math.sin(tw)) @ Ry(-rad(3))
        W, H = R.fk(P)
        leg_ik(R, P, 'L', v(0.215, 0.07, B['ankle'].z), 0.0, rad(10), W=W, H=H)
        pd = b['BB'] + v(-(b['ped_x'] + 0.02), b['crank'] * math.cos(th + math.pi), b['crank'] * math.sin(th + math.pi))
        ball = v(0, -B['ball'], -B['ankle'].z)
        leg_ik(R, P, 'R', pd + v(0, 0, 0.018) - ball, 0.0, -rad(4), v(-0.25, -1, 0.3), W=W, H=H)
        for s, S in ((1, 'L'), (-1, 'R')):
            P.q['clav.' + S] = Ry(-s * rad(1.0) * (1 + breath))
            g = mx(b['grip'], s) + v(0, -0.02, 0.025)
            arm_ik(R, P, S, g, v(s * 0.8, 0.5, -0.6), hand_dir=v(0.15 * s, -0.55, -0.82).normalized(), palm=v(-0.4 * s, -0.2, -1))
        poses.append(P)
    return poses


# ------------------------------------------------------------------------------------------------
# Assembly, keying, AO, baking, export
# ------------------------------------------------------------------------------------------------
def fib_hemisphere(n):
    dirs = []
    for i in range(n):
        z = 1 - (i + 0.5) / n; r = math.sqrt(max(0, 1 - z * z)); phi = i * 2.399963
        dirs.append(Vector((r * math.cos(phi), r * math.sin(phi), z)))
    return dirs


def vertex_ao(verts, faces, normals, dist=0.22, n=40, strength=0.85, occluders=None):
    bvh = BVHTree.FromPolygons([tuple(p) for p in verts], occluders if occluders is not None else faces)
    hemi = fib_hemisphere(n); out = []
    for p, nr in zip(verts, normals):
        t = (X if abs(nr.x) < 0.9 else Y).cross(nr).normalized(); b = nr.cross(t)
        o = p + nr * 0.0015; hit = 0.0
        for d in hemi:
            w = t * d.x + b * d.y + nr * d.z
            loc, _, _, dd = bvh.ray_cast(o, w, dist)
            if loc is not None: hit += 1.0 - 0.5 * (dd / dist)
        out.append(max(0.3, 1.0 - strength * hit / n))
    return out


MOVING = {'arm', 'sleeve', 'hand', 'thumb', 'cane'}  # parts that swing away from the body: no baked AO from them


def assemble(fig, rig, name, coll, arm_ob):
    V, F, C, M, Wt = [], [], [], [], []
    fig.occluders = []
    for part in fig.parts:
        o = len(V)
        V += part['verts']; F += [tuple(i + o for i in f) for f in part['faces']]
        if part['name'] not in MOVING: fig.occluders += [tuple(i + o for i in f) for f in part['faces']]
        c = hexc(part['color'])
        for p in part['verts']:
            w = part['rule'](p); tot = sum(w.values()) or 1.0
            C.append(c); M.append(part['mask']); Wt.append({b: x / tot for b, x in w.items() if x / tot > 1e-3})
    me = bpy.data.meshes.new(name); me.from_pydata([tuple(p) for p in V], [], F); me.update()
    me.shade_smooth()
    ob = bpy.data.objects.new(name, me); coll.objects.link(ob)
    for b in rig.deform: ob.vertex_groups.new(name=b)
    groups = {}
    for i, w in enumerate(Wt):
        for b, x in w.items(): groups.setdefault((b, round(x, 4)), []).append(i)
    for (b, x), idx in groups.items(): ob.vertex_groups[b].add(idx, x, 'REPLACE')
    mod = ob.modifiers.new('Armature', 'ARMATURE'); mod.object = arm_ob; mod.use_deform_preserve_volume = True
    ob.parent = arm_ob
    return ob, C, M


def key_clip(arm_ob, rig, name, poses):
    act = bpy.data.actions.new(name); act.use_fake_user = True
    arm_ob.animation_data.action = act
    prev = {}
    for f, P in enumerate(poses + [poses[0]]):
        for b in rig.order:
            pb = arm_ob.pose.bones[b]; pb.rotation_mode = 'QUATERNION'
            Mb = rig.M[b]; Mi = Mb.inverted()
            q = P.q.get(b, QI)
            ql = (Mi @ q.to_matrix() @ Mb).to_quaternion()
            if b in prev and prev[b].dot(ql) < 0: ql.negate()
            prev[b] = ql
            pb.rotation_quaternion = ql; pb.keyframe_insert('rotation_quaternion', frame=f, group=b)
            if b in P.off or b == 'pelvis':
                pb.location = Mi @ P.off.get(b, ZERO); pb.keyframe_insert('location', frame=f, group=b)
            if b in P.sc:
                pb.scale = (1, P.sc[b], 1); pb.keyframe_insert('scale', frame=f, group=b)
    return act


def bake_clip(arm_ob, mesh_ob, act, n):
    arm_ob.animation_data.action = act
    if arm_ob.animation_data.action_slot is None and len(act.slots): arm_ob.animation_data.action_slot = act.slots[0]
    sc = bpy.context.scene; Vn = len(mesh_ob.data.vertices)
    P = np.empty((n, Vn, 3), np.float32); N = np.empty((n, Vn, 3), np.float32)
    for f in range(n):
        sc.frame_set(f)
        dg = bpy.context.evaluated_depsgraph_get(); ev = mesh_ob.evaluated_get(dg); me = ev.to_mesh()
        co = np.empty(Vn * 3, np.float32); me.vertices.foreach_get('co', co)
        nr = np.empty(Vn * 3, np.float32); me.vertex_normals.foreach_get('vector', nr)
        ev.to_mesh_clear()
        P[f] = co.reshape(-1, 3); N[f] = nr.reshape(-1, 3)
    return P, N


def to_three(a):
    out = np.empty_like(a); out[..., 0] = a[..., 0]; out[..., 1] = a[..., 2]; out[..., 2] = -a[..., 1]; return out


def oct_encode(n):
    n = n / np.maximum(np.abs(n).sum(-1, keepdims=True), 1e-9)
    x = n[..., 0].copy(); y = n[..., 1].copy(); z = n[..., 2]
    neg = z < 0
    ox = np.where(neg, (1 - np.abs(y)) * np.sign(x + 1e-12), x)
    oy = np.where(neg, (1 - np.abs(x)) * np.sign(y + 1e-12), y)
    return np.stack([np.clip(np.round(ox * 127), -127, 127), np.clip(np.round(oy * 127), -127, 127)], -1).astype(np.int8)


VARIANTS = {
    'coat': dict(body=body_male, dress=dress_coat, style='male', sit=True),
    'tshirt': dict(body=lambda: scaled(body_male(), 0.99, 0.985), dress=dress_tshirt, style='male', sit=True),
    'dress': dict(body=body_female, dress=dress_dress, style='female', sit=True),
    'jacket': dict(body=lambda: scaled(body_female(), 1.015, 1.0), dress=dress_jacket, style='female', sit=True),
    'child': dict(body=body_child, dress=dress_child, style='child', sit=True),
    'elder': dict(body=body_elder, dress=dress_elder, style='elder', sit=True, bones=elder_bones),
    'cyclist': dict(body=body_male, dress=dress_cyclist, style='male', sit=False, cyclist=True),
}
CLIP = dict(walk_frames=24, idle_frames=28, idle_fps=5.0, sit_frames=28, sit_fps=5.0, ride_frames=24, ride_fps=24.0, wait_frames=24, wait_fps=6.0)


def build_variant(name, spec, scene_coll):
    t0 = time.time()
    B = spec['body']()
    extra = spec['bones'](B) if 'bones' in spec else []
    if spec.get('cyclist'): extra = bike_bones() + extra
    rig = Rig(skeleton(B, extra))
    coll = bpy.data.collections.new(name); scene_coll.children.link(coll)
    arm_ob = make_armature(rig, name, coll)
    if spec.get('cyclist'):  # the rider hangs off the bike
        bpy.context.view_layer.objects.active = arm_ob; bpy.ops.object.mode_set(mode='EDIT')
        arm_ob.data.edit_bones['pelvis'].parent = arm_ob.data.edit_bones['bike']
        bpy.ops.object.mode_set(mode='OBJECT')
        h, t, _ = rig.bones['pelvis']; rig.bones['pelvis'] = (h, t, 'bike')
        order = []
        def visit(n):
            if n in order: return
            p = rig.bones[n][2]
            if p: visit(p)
            order.append(n)
        for n in list(rig.order): visit(n)
        rig.order = order
        for n in rig.order: rig.M[n] = arm_ob.data.bones[n].matrix_local.to_3x3()
    fig = Fig(); spec['dress'](fig, B)
    mesh_ob, C, M = assemble(fig, rig, name, coll, arm_ob)
    arm_ob.animation_data_create()
    st = WALK[spec['style']]; elder = name == 'elder'
    clips = []
    if spec.get('cyclist'):
        clips.append(('walk', CLIP['ride_frames'], CLIP['ride_fps'], ride_poses(rig, B, CLIP['ride_frames']),
                      BIKE['gear'] * 2 * math.pi * BIKE['Rw']))
        clips.append(('idle', CLIP['wait_frames'], CLIP['wait_fps'], ride_idle_poses(rig, B, CLIP['wait_frames']), None))
    else:
        n = CLIP['walk_frames']
        clips.append(('walk', n, n / st['cycle'], walk_poses(rig, B, st, n, elder), st['stride']))
        clips.append(('idle', CLIP['idle_frames'], CLIP['idle_fps'], idle_poses(rig, B, st, CLIP['idle_frames'], elder), None))
        if spec.get('sit'): clips.append(('sit', CLIP['sit_frames'], CLIP['sit_fps'], sit_poses(rig, B, st, CLIP['sit_frames'], elder), None))
    me = mesh_ob.data; Vn = len(me.vertices)
    rest = np.empty(Vn * 3, np.float32); me.vertices.foreach_get('co', rest); rest = rest.reshape(-1, 3)
    rn = np.empty(Vn * 3, np.float32); me.vertex_normals.foreach_get('vector', rn); rn = rn.reshape(-1, 3)
    me.calc_loop_triangles()
    tris = np.empty(len(me.loop_triangles) * 3, np.int32); me.loop_triangles.foreach_get('vertices', tris)
    # baked ambient occlusion in the base colour (multiplies the instance tints too)
    ao = vertex_ao([Vector(p) for p in rest], [tuple(p.vertices) for p in me.polygons], [Vector(n) for n in rn], dist=0.16 if B['H'] > 1.3 else 0.12,
                   strength=0.7, occluders=fig.occluders)
    base = np.array([to_srgb(tuple(x * a for x in to_lin(c))) for c, a in zip(C, ao)], np.float32)
    col8 = np.concatenate([np.clip(np.round(base * 255), 0, 255), np.full((Vn, 1), 255)], 1).astype(np.uint8)
    msk8 = np.clip(np.round(np.array(M, np.float32) * 255), 0, 255).astype(np.uint8)
    ca = me.color_attributes.new('base', 'BYTE_COLOR', 'POINT'); ca.data.foreach_set('color_srgb', (col8 / 255.0).astype(np.float32).ravel())
    ma = me.color_attributes.new('mask', 'BYTE_COLOR', 'POINT'); ma.data.foreach_set('color_srgb', (msk8 / 255.0).astype(np.float32).ravel())
    me.color_attributes.active_color = ca
    frames_p, frames_n, meta, start = [], [], {}, 0
    for cname, n, fps, poses, stride in clips:
        act = key_clip(arm_ob, rig, f'{name}_{cname}', poses)
        P, N = bake_clip(arm_ob, mesh_ob, act, n)
        frames_p.append(P); frames_n.append(N)
        meta[cname] = dict(start=start, frames=n, fps=round(fps, 4), loop=True)
        if stride: meta[cname].update(stride_m=round(stride, 4), speed_mps=round(stride * fps / n, 4))
        start += n
    if 'sit' in meta: meta['sit'].update(seat_height=SEAT, table_height=TABLE)
    arm_ob.animation_data.action = bpy.data.actions[f'{name}_idle']
    FP = to_three(np.concatenate(frames_p)); FN = to_three(np.concatenate(frames_n))
    R3 = to_three(rest); N3 = to_three(rn)
    # file layout (little endian, 4-byte aligned sections)
    sections = [('position', R3.astype('<f4')), ('normal', N3.astype('<f4')), ('color', col8), ('mask', msk8),
                ('index', tris.astype('<u2') if Vn < 65536 else tris.astype('<u4')),
                ('framePositions', FP.astype('<f2')), ('frameNormals', oct_encode(FN))]
    blob = bytearray(); layout = {}
    for key, arr in sections:
        while len(blob) % 4: blob.append(0)
        b = arr.tobytes(); layout[key] = dict(byteOffset=len(blob), byteLength=len(b), type=str(arr.dtype).lstrip('<|'),
                                              itemSize=(arr.shape[-1] if arr.ndim > 1 else 1))
        blob += b
    with open(os.path.join(OUT_DIR, name + '.bin'), 'wb') as fh: fh.write(blob)
    entry = dict(name=name, file=name + '.bin', height=round(float(R3[:, 1].max()), 4), vertexCount=Vn, indexCount=int(len(tris)),
                 triangleCount=int(len(tris) // 3), frameCount=int(FP.shape[0]), clips=meta, layout=layout,
                 bounds=dict(min=[round(float(x), 4) for x in FP.reshape(-1, 3).min(0)], max=[round(float(x), 4) for x in FP.reshape(-1, 3).max(0)]))
    if spec.get('cyclist'): entry['bike'] = dict(wheel_radius=BIKE['Rw'], gear=BIKE['gear'], wheelbase=round(BIKE['RA'].y - BIKE['FA'].y, 3))
    if '-v' in ARGS:
        cnt = {}
        for part in fig.parts: cnt[part['name']] = cnt.get(part['name'], 0) + len(part['verts'])
        print('   parts:', ', '.join(f'{k}={x}' for k, x in sorted(cnt.items(), key=lambda kv: -kv[1])))
    print(f'  {name}: {Vn} verts, {len(tris) // 3} tris, {FP.shape[0]} frames, {len(blob) / 1024:.0f} KB, {time.time() - t0:.1f}s')
    return entry, mesh_ob, arm_ob


def main():
    t0 = time.time()
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene; sc.render.fps = 24
    os.makedirs(OUT_DIR, exist_ok=True); os.makedirs(os.path.dirname(BLEND), exist_ok=True)
    manifest_path = os.path.join(OUT_DIR, 'crowd.json')
    old = {}
    if ONLY and os.path.exists(manifest_path):
        with open(manifest_path) as fh: old = {e['name']: e for e in json.load(fh)['variants']}
    entries = []
    for i, (name, spec) in enumerate(VARIANTS.items()):
        if ONLY and name not in ONLY:
            if name in old: entries.append(old[name])
            continue
        e, mob, aob = build_variant(name, spec, sc.collection)
        aob.location.x = i * 0.9  # spread out in the .blend for viewing (baking is done)
        entries.append(e)
    manifest = dict(
        version=1, generator='tools/build-crowd.py', units='metres', up='+Y', forward='+Z',
        format=dict(
            position='rest pose, float32 xyz (three.js space)', normal='rest pose, float32 xyz', color='uint8 RGBA, sRGB base colour with baked AO (A=255)',
            mask='uint8 RGBA: R = top tint (instanceColor), G = skin (aSkin), B = hair (aHair), A = bottom (trousers/skirt) variety',
            index='uint16 (uint32 if vertexCount > 65535) triangle list',
            framePositions='float16 xyz per vertex, frame-major: frame f starts at f*vertexCount*3 halves',
            frameNormals='int8 x2 per vertex, octahedral-encoded unit normal (snorm /127), frame-major',
            clips='start = first frame row, frames = loop length, fps = playback rate at walkRate 1; stride_m = metres travelled per walk loop'),
        variants=entries)
    with open(manifest_path, 'w') as fh: json.dump(manifest, fh, indent=1)
    sc.frame_set(0)
    bpy.ops.wm.save_as_mainfile(filepath=BLEND, compress=True)
    total = sum(os.path.getsize(os.path.join(OUT_DIR, e['file'])) for e in entries)
    print(f'crowd: {len(entries)} variants, {total / 1024 / 1024:.2f} MB, {time.time() - t0:.1f}s -> {OUT_DIR}')


main()
