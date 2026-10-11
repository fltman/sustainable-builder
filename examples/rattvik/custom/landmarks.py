"""Rättvik's small landmarks that OSM has as points, not buildings (this file's id is no building id,
so nothing generated is replaced; each landmark becomes its own object in the tile it stands in).

- Rättvikshästen (tourism=artwork by the station): a big grey Rättvik-style Dala horse, black mane,
  red/white/black harness painting and "RÄTTVIK" on its side, about 3 m tall.
- Vasastenen (historic=memorial, 1893): a 4.5 m granite bauta with knotwork and a gilded crown on a
  mound of boulders, ringed by small standing stones, on the bluff above Siljan.
- Kyrkbåten Sörbyggarn (tourism=attraction): a long church boat under an open timber shelter with a
  board roof and crossed gable boards, by the shore.
Positions are the OSM nodes in local metres (see city.json); looks from photos (Visit Rättvik,
Rättviks kommun, DigitaltMuseum) checked in the browser.
"""
import random

rng = random.Random(4711)
PALE, BLACK, RED = 'M_Wall_Wood_pale_Blank', 'M_Roof_Metal_black', 'M_Wall_Wood_falu_Blank'
WHITE, GOLD, STONE = 'M_Wall_Plaster_white_Blank', 'M_Roof_Metal_gold', 'M_Wall_Stone_grey_Blank'
BOULDER, CONCRETE = 'M_StoneWall', 'M_Concrete'
TIMBER, BOARDS, HULL = 'M_Wall_Wood_brown_Blank', 'M_Wall_Wood_weathered_Blank', 'M_Wall_Wood_brown_Blank'


def emit(g, name):
    if not g:
        return
    vx = sum(v[0] for v in g.v) / len(g.v)
    vy = sum(v[1] for v in g.v) / len(g.v)
    ctx.objects.append(g.to_object(f'SM_Custom_{name}', ctx.collection, f'c{math.floor(vx / 60)}_{math.floor(vy / 60)}', ctx.lib,
                                   {'wb_building': name}))


class Side:
    """A vertical plane through (x, y) with heading a; s along it, z up, offset d along its normal."""
    def __init__(self, g, x, y, a, d):
        self.g, self.x, self.y, self.c, self.s_, self.d = g, x, y, math.cos(a), math.sin(a), d

    def P(self, s, z, dd=0.0):
        d = self.d + dd
        return (self.x + s * self.c - d * self.s_, self.y + s * self.s_ + d * self.c, z)

    def poly(self, pts, mat, dd=0.0, flip=False):
        q = [self.P(s, z, dd) for s, z in pts]
        if flip:
            q = q[::-1]
        self.g.face(q, mat, [(s / 1.5, z / 1.5) for s, z in (pts[::-1] if flip else pts)])


def ccw2(pts):
    a = sum(pts[i][0] * pts[(i + 1) % len(pts)][1] - pts[(i + 1) % len(pts)][0] * pts[i][1] for i in range(len(pts)))
    return pts if a > 0 else pts[::-1]


# ------------------------------------------------------------------------------------------ Rättvikshästen
def dala_horse(x, y, heading_deg, H=3.0):
    g = Geo()
    a = math.radians(90 - heading_deg)               # the horse faces this compass heading
    L, T = H * 1.0, H * 0.26                          # length and thickness
    prof = [(0.10, 0.00), (0.40, 0.00), (0.43, 0.17), (0.50, 0.23), (0.57, 0.17), (0.60, 0.00), (0.88, 0.00), (0.86, 0.30),
            (0.90, 0.46), (0.93, 0.63), (1.00, 0.71), (1.00, 0.80), (0.93, 0.86), (0.91, 0.95), (0.85, 0.89), (0.81, 0.96),
            (0.77, 0.85), (0.68, 0.67), (0.62, 0.59), (0.18, 0.59), (0.10, 0.57), (0.03, 0.51), (0.00, 0.37), (0.08, 0.41),
            (0.08, 0.22)]
    P2 = ccw2([((u - 0.5) * L, v * H + 0.3) for u, v in prof])
    sides = [Side(g, x, y, a, T / 2), Side(g, x, y, a, -T / 2)]
    sides[0].poly(P2, PALE, flip=True)            # +d side: reverse so the face points outwards
    sides[1].poly(P2, PALE, flip=False)
    for p, q in zip(P2, P2[1:] + P2[:1]):                                     # the sawn edge all round
        g.face([sides[1].P(*p), sides[1].P(*q), sides[0].P(*q), sides[0].P(*p)], PALE, uvscale=1.0)
    g.box((x, y, 0.15), (L * 1.05, T + 0.7, 0.3), CONCRETE, a, uvscale=1.0)  # low plinth
    S = lambda u, v: ((u - 0.5) * L, v * H + 0.3)
    for k, side in enumerate(sides):
        flip = k == 0
        dd = 0.02 if k == 0 else -0.02
        # black mane along the neck and the forelock
        side.poly([S(0.62, 0.59), S(0.68, 0.67), S(0.77, 0.85), S(0.81, 0.96), S(0.83, 0.86), S(0.74, 0.70), S(0.66, 0.60)], BLACK, dd, flip)
        side.poly([S(0.85, 0.89), S(0.91, 0.95), S(0.90, 0.86)], BLACK, dd, flip)
        side.poly([S(0.03, 0.51), S(0.00, 0.37), S(0.08, 0.41), S(0.09, 0.50)], BLACK, dd, flip)       # tail
        side.poly([S(0.91 + 0.022 * math.cos(t), 0.81 + 0.022 * math.sin(t)) for t in (2 * math.pi * i / 10 for i in range(10))], BLACK, dd, flip)  # eye
        side.poly([S(0.84, 0.66), S(0.87, 0.64), S(0.95, 0.83), S(0.92, 0.85)], RED, dd, flip)      # bridle
        # saddle cloth: white scalloped field with red flowers and black borders
        side.poly([S(0.30, 0.59), S(0.62, 0.59), S(0.60, 0.40), S(0.32, 0.40)], BLACK, dd, flip)
        side.poly([S(0.315, 0.575), S(0.605, 0.575), S(0.588, 0.415), S(0.332, 0.415)], WHITE, dd * 1.5, flip)
        for cu in (0.36, 0.46, 0.56):
            for r_, m_ in ((0.045, RED), (0.018, BLACK)):
                side.poly([S(cu + r_ * math.cos(t), 0.495 + r_ * 1.2 * math.sin(t)) for t in (2 * math.pi * i / 12 for i in range(12))], m_, dd * (2 if m_ == RED else 2.5), flip)
            side.poly([S(cu - 0.004, 0.43), S(cu + 0.004, 0.43), S(cu + 0.004, 0.455), S(cu - 0.004, 0.455)], BLACK, dd * 2, flip)
        side.poly([S(0.18, 0.59), S(0.30, 0.59), S(0.30, 0.565), S(0.18, 0.565)], RED, dd, flip)      # crupper strap
        side.poly([S(0.62, 0.59), S(0.66, 0.60), S(0.86, 0.36), S(0.82, 0.34)], RED, dd, flip)         # breast collar
    # "RÄTTVIK" lettered on the side (both sides), as in the photos
    import bpy
    cu = bpy.data.curves.new('wb_text', 'FONT')
    cu.body, cu.size, cu.align_x, cu.resolution_u = 'RÄTTVIK', H * 0.07, 'CENTER', 2
    for path in ('/System/Library/Fonts/Supplemental/Arial Bold.ttf', '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'):
        try:
            cu.font = bpy.data.fonts.load(path, check_existing=True)
            break
        except (RuntimeError, OSError):
            pass
    ob = bpy.data.objects.new('wb_text', cu)
    bpy.context.scene.collection.objects.link(ob)
    ev = ob.evaluated_get(bpy.context.evaluated_depsgraph_get())
    me = ev.to_mesh()
    cs, cz = S(0.46, 0.345)
    for k, side in enumerate(sides):
        sgn = -1 if k == 0 else 1                     # seen from the +d side, s runs to the left: mirror there
        for poly in me.polygons:
            pts = [(cs + sgn * me.vertices[i].co.x, cz + me.vertices[i].co.y) for i in poly.vertices]
            side.poly(pts, BLACK, -0.035 * sgn, flip=(k == 1))
    ev.to_mesh_clear()
    bpy.data.objects.remove(ob)
    bpy.data.curves.remove(cu)
    emit(g, 'Rattvikshasten')


# ------------------------------------------------------------------------------------------ Vasastenen
def vasastenen(x, y):
    g = Geo()
    best = min(ctx.data['shore'], key=lambda q: math.dist((x, y), ((q[0] + q[2]) / 2, (q[1] + q[3]) / 2)))
    af = math.atan2((best[1] + best[3]) / 2 - y, (best[0] + best[2]) / 2 - x)    # the broad face looks out over Siljan
    a = af - math.pi / 2
    for i in range(26):                                                        # mound of boulders
        r = rng.uniform(0.0, 3.4)
        t = rng.uniform(0, 2 * math.pi)
        s = rng.uniform(0.45, 0.85) * (1.2 - r / 4.5)
        g.blob((x + r * math.cos(t), y + r * math.sin(t), max(0.1, 0.9 - r * 0.22)), (s, s * 0.9, s * 0.7), STONE, 0.18, rng)
    base_z, top = 0.9, 5.4
    w0, w1, t0 = 1.7, 1.25, 0.8
    c, s = math.cos(a), math.sin(a)
    ring = []
    for z, w, tt, j in ((base_z - 0.4, w0, t0, 0.0), (base_z + 1.8, w0 * 0.97, t0 * 0.95, 0.05), (top - 0.8, w1, t0 * 0.85, 0.08)):
        ring.append([(x + u * c - v * s, y + u * s + v * c, z + rng.uniform(-j, j))
                     for u, v in ((-w / 2, -tt / 2), (w / 2, -tt / 2), (w / 2, tt / 2), (-w / 2, tt / 2))])
    apex = [(x + u * c - v * s, y + u * s + v * c, z) for u, v, z in ((-0.35, -0.3, top), (0.3, -0.25, top - 0.25), (0.3, 0.25, top - 0.25), (-0.35, 0.3, top))]
    ring.append(apex)
    for lo, hi in zip(ring, ring[1:]):
        for i in range(4):
            j = (i + 1) % 4
            g.face([lo[i], lo[j], hi[j], hi[i]], STONE, uvscale=1.2)
    g.face(apex[::-1], STONE, uvscale=1.2)
    front = Side(g, x, y, a, t0 / 2 + 0.02)                                     # knotwork band and gilded crown, lake side
    for k in range(7):
        z = base_z + 0.6 + k * 0.42
        front.poly([(-0.45, z), (0.45, z + 0.12), (0.45, z + 0.2), (-0.45, z + 0.08)], 'M_Wall_Stone_limestone_Blank', 0.0, flip=True)
    front.poly([(-0.28, 4.0), (0.28, 4.0), (0.32, 4.35), (0.16, 4.22), (0.0, 4.42), (-0.16, 4.22), (-0.32, 4.35)], GOLD, -0.01, flip=True)
    for i in range(10):                                                        # small stones in a ring
        t = 2 * math.pi * i / 10 + 0.15
        px, py = x + 7.0 * math.cos(t), y + 7.0 * math.sin(t)
        h = rng.uniform(0.9, 1.5)
        g.box((px, py, h / 2 - 0.1), (rng.uniform(0.45, 0.6), rng.uniform(0.3, 0.4), h), STONE, t + math.pi / 2, uvscale=1.0)
    emit(g, 'Vasastenen')


# ------------------------------------------------------------------------------------------ Kyrkbåten Sörbyggarn
def church_boat(x, y, axis_deg):
    g = Geo()
    a = math.radians(90 - axis_deg)
    c, s = math.cos(a), math.sin(a)
    P = lambda u, w, z: (x + u * c - w * s, y + u * s + w * c, z)
    L, W, EAVE, RISE = 24.0, 5.6, 2.3, 1.9
    for k in range(9):                                                         # posts with knee braces
        u = -L / 2 + k * L / 8
        for w in (-W / 2, W / 2):
            px, py, _ = P(u, w, 0)
            g.box((px, py, EAVE / 2), (0.2, 0.2, EAVE), TIMBER, a, uvscale=1.0)
    for w in (-W / 2, W / 2):                                                  # wall plates
        p, q = P(-L / 2 - 0.2, w, EAVE), P(L / 2 + 0.2, w, EAVE)
        g.box_between(p[:2], q[:2], 0.22, EAVE - 0.22, EAVE, TIMBER)
    o = 0.6
    e = [P(-L / 2 - o, -W / 2 - o, EAVE - 0.3), P(L / 2 + o, -W / 2 - o, EAVE - 0.3), P(L / 2 + o, W / 2 + o, EAVE - 0.3), P(-L / 2 - o, W / 2 + o, EAVE - 0.3)]
    r0, r1 = P(-L / 2 - o, 0, EAVE + RISE), P(L / 2 + o, 0, EAVE + RISE)
    for quad in ([e[0], e[1], r1, r0], [e[2], e[3], r0, r1]):                 # board roof (both faces)
        g.face(quad, BOARDS, [(0, 0), (L / 2.0, 0), (L / 2.0, 2.0), (0, 2.0)])
        g.face(quad[::-1], BOARDS, [(0, 2.0), (L / 2.0, 2.0), (L / 2.0, 0), (0, 0)])
    for sgn in (-1, 1):                                                        # crossed gable boards (vindskivor)
        u = sgn * (L / 2 + o)
        for w in (-1, 1):
            p, q = P(u, w * (W / 2 + o), EAVE - 0.3), P(u, -w * 0.9, EAVE + RISE + 0.75)
            g.face([(p[0], p[1], p[2]), (q[0], q[1], q[2]), (q[0], q[1], q[2] + 0.28), (p[0], p[1], p[2] + 0.28)], TIMBER, uvscale=1.0)
    # the boat: a long clinker hull on trestles, raised stem and stern
    BL, BW, D = 20.0, 2.3, 0.85
    secs = []
    n = 24
    for i in range(n + 1):
        t = -1 + 2 * i / n
        hw = BW / 2 * max(0.02, (1 - abs(t) ** 2.2)) ** 0.7
        sheer = 0.55 + D + 0.55 * abs(t) ** 3
        keel = 0.55 + 0.25 * abs(t) ** 4
        u = t * BL / 2
        secs.append([P(u, -hw, sheer), P(u, -hw * 0.92, keel + (sheer - keel) * 0.45), P(u, 0, keel),
                     P(u, hw * 0.92, keel + (sheer - keel) * 0.45), P(u, hw, sheer)])
    for A, B in zip(secs, secs[1:]):
        for j in range(4):
            g.face([A[j], B[j], B[j + 1], A[j + 1]], HULL, uvscale=0.6)
            g.face([A[j + 1], B[j + 1], B[j], A[j]], 'M_Wall_Wood_pine_Blank', uvscale=0.6)
    for k in range(1, 8):                                                      # thwarts
        u = -BL / 2 + k * BL / 8
        t = 2 * u / BL
        hw = BW / 2 * max(0.02, (1 - abs(t) ** 2.2)) ** 0.7
        px, py, _ = P(u, 0, 0)
        g.box((px, py, 0.55 + D - 0.15), (0.25, hw * 1.9, 0.06), 'M_Wall_Wood_pine_Blank', a, uvscale=1.0)
    for u in (-6.0, 0.0, 6.0):                                                 # trestles
        for w in (-0.8, 0.8):
            px, py, _ = P(u, w, 0)
            g.box((px, py, 0.33), (0.15, 0.15, 0.66), TIMBER, a, uvscale=1.0)
        p, q = P(u, -1.0, 0), P(u, 1.0, 0)
        g.box_between(p[:2], q[:2], 0.18, 0.55, 0.68, TIMBER)
    emit(g, 'Kyrkbaten_Sorbyggarn')


dala_horse(421.0, -145.0, heading_deg=340.0)        # side towards the square, head to the NNW (photo 2019)
vasastenen(-625.0, 369.0)
church_boat(499.0, -558.0, axis_deg=61.2)
