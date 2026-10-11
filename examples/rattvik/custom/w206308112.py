"""Rättviks kyrka on Kyrkudden, with its church stables (kyrkstallar) and churchyard buildings.

References: cities/rattvik/references/kyrka/ (openly licensed photos, NOTES.md with dimensions from
the national building register). Cross church with a single nave, axis on bearing 67° (tower to the
WSW, towards Siljan). Whitewashed render on a pink plinth, steep tarred-shingle roofs with all ridges
at 17 m (eaves 6 m), a hipped three-sided east end over the 1793 sacristy, transept gables with a round
window, relief cross and arched door, and the 1771–83 Adelcrantz tower: a 25 m white shaft with a
dentilled cornice, a set-back clock stage with four clocks and oval oculi, and a green copper bell cap
with ball, spire and gilded rooster (about 42 m in all).

Not in OSM, added here: the 87 log stables (two "Kyrkstad" areas), the 1867 winter burial chapel, the
log bone house and the churchyard lychgate.
"""
import random

R = [tuple(p) for p in ctx.footprint['outer']]
if len(R) != 18:
    raise RuntimeError('Rättviks kyrka: the OSM outline changed (expected 18 vertices) — update this script')
G = ctx.geo
rng = random.Random(206308112)

WHITE, IVORY, PINK = 'M_Wall_Plaster_white_Blank', 'M_Wall_Plaster_ivory_Blank', 'M_Wall_Plaster_rose_Blank'
SHINGLE, COPPER, GOLD = 'M_Roof_Slate_dark', 'M_Roof_Metal_patina', 'M_Roof_Metal_gold'
BLACK, RED, DOOR = 'M_Roof_Metal_black', 'M_Wall_Wood_falu_Blank', 'M_Wall_Wood_petrol_Blank'
GLASS, STONE, IRON = 'M_Window_Pane', 'M_Wall_Stone_grey_Blank', 'M_Fixture_Metal'
LOG, BOARDS, DRYSTONE = 'M_Wall_Wood_weathered_Blank', 'M_Wall_Wood_weathered_Blank', 'M_StoneWall'
GLASS_UV = [(0.2, 0.42), (0.8, 0.42), (0.8, 0.9), (0.2, 0.9)]
EAVE, RIDGE = 6.0, 17.0


# ------------------------------------------------------------------------------------------ helpers
class Frame:
    """u along `toward`, w to the left of u."""
    def __init__(self, origin, toward):
        self.o = origin
        self.a = math.atan2(toward[1] - origin[1], toward[0] - origin[0])
        self.c, self.s = math.cos(self.a), math.sin(self.a)

    def P(self, u, w, z=0.0):
        return (self.o[0] + u * self.c - w * self.s, self.o[1] + u * self.s + w * self.c, z)

    def uw(self, p):
        dx, dy = p[0] - self.o[0], p[1] - self.o[1]
        return dx * self.c + dy * self.s, -dx * self.s + dy * self.c


class Wall:
    """Vertical plane p→q; x along it, z up, d > 0 outwards (to the right of p→q)."""
    def __init__(self, p, q):
        self.p, self.L = p, math.dist(p[:2], q[:2])
        self.t = ((q[0] - p[0]) / self.L, (q[1] - p[1]) / self.L)
        self.n = (self.t[1], -self.t[0])
        self.ang = math.atan2(self.t[1], self.t[0])

    def at(self, x, z, d=0.0):
        return (self.p[0] + self.t[0] * x + self.n[0] * d, self.p[1] + self.t[1] * x + self.n[1] * d, z)

    def x_of(self, pt):
        return (pt[0] - self.p[0]) * self.t[0] + (pt[1] - self.p[1]) * self.t[1]

    def poly(self, pts, mat, d=0.0, uv=None, scale=3.0):
        """A flat shape on the wall from (x, z) points (counter-clockwise seen from outside)."""
        G.face([self.at(x, z, d) for x, z in pts], mat, uv or [(x / scale, z / scale) for x, z in pts])

    def rect(self, x0, x1, z0, z1, mat, d=0.0, uv=None, scale=3.0):
        if x1 - x0 > 1e-3 and z1 - z0 > 1e-3:
            self.poly([(x0, z0), (x1, z0), (x1, z1), (x0, z1)], mat, d, uv, scale)

    def ledge(self, x0, x1, z0, z1, mat, d1, d0=0.0):
        self.rect(x0, x1, z0, z1, mat, d1)
        G.face([self.at(x0, z1, d1), self.at(x1, z1, d1), self.at(x1, z1, d0), self.at(x0, z1, d0)], mat, uvscale=1.0)
        G.face([self.at(x0, z0, d0), self.at(x1, z0, d0), self.at(x1, z0, d1), self.at(x0, z0, d1)], mat, uvscale=1.0)

    def ring(self, outer, inner, mat, d):
        """Quads between two outlines with the same number of points (a frame around an opening)."""
        n = len(outer)
        for i in range(n):
            j = (i + 1) % n
            G.face([self.at(*outer[i], d), self.at(*outer[j], d), self.at(*inner[j], d), self.at(*inner[i], d)], mat, uvscale=1.0)


def arch(xc, z0, w, h, n=8):
    """Outline of a round-arched opening (counter-clockwise): width w, sill z0, crown z0 + h."""
    r = w / 2
    zs = z0 + h - r
    return [(xc - r, z0), (xc + r, z0)] + [(xc + r * math.cos(math.pi * i / n), zs + r * math.sin(math.pi * i / n)) for i in range(n + 1)]


def ellipse(xc, zc, rx, rz, n=16):
    return [(xc + rx * math.cos(2 * math.pi * i / n), zc + rz * math.sin(2 * math.pi * i / n)) for i in range(n)]


def fan(w, xc, zc, outline, mat, d):
    for a, b in zip(outline, outline[1:] + outline[:1]):
        w.poly([(xc, zc), a, b], mat, d)


def window(w, xc, z0, width, height, bars=WHITE, rows=3, surround=True):
    """Round-arched window drawn on the wall: white surround, dark glass, glazing bars, sill."""
    if surround:
        w.ring(arch(xc, z0 - 0.15, width + 0.44, height + 0.37), arch(xc, z0, width, height), WHITE, 0.07)
    w.poly(arch(xc, z0, width, height), GLASS, 0.03, uv=[(0.2 + 0.6 * (x - xc + width / 2) / width, 0.42 + 0.48 * (z - z0) / height)
                                                        for x, z in arch(xc, z0, width, height)])
    w.rect(xc - 0.035, xc + 0.035, z0, z0 + height - 0.1, bars, 0.05)
    for k in range(1, rows + 1):
        z = z0 + (height - width / 2) * k / (rows + 1)
        w.rect(xc - width / 2, xc + width / 2, z - 0.03, z + 0.03, bars, 0.05)
    w.ledge(xc - width / 2 - 0.2, xc + width / 2 + 0.2, z0 - 0.22, z0 - 0.12, WHITE, 0.12)


def disc(w, xc, zc, r, mat, d, n=16):
    w.poly(ellipse(xc, zc, r, r, n), mat, d)


def face_uv(pts, scale=2.0):
    """UVs in the plane of a polygon: u along its first edge, v up the slope."""
    a, b = pts[0], pts[1]
    t = [b[i] - a[i] for i in range(3)]
    tl = math.sqrt(sum(c * c for c in t)) or 1
    t = [c / tl for c in t]
    c2 = pts[-1]
    e = [c2[i] - a[i] for i in range(3)]
    n = [t[1] * e[2] - t[2] * e[1], t[2] * e[0] - t[0] * e[2], t[0] * e[1] - t[1] * e[0]]
    bb = [n[1] * t[2] - n[2] * t[1], n[2] * t[0] - n[0] * t[2], n[0] * t[1] - n[1] * t[0]]
    bl = math.sqrt(sum(c * c for c in bb)) or 1
    bb = [c / bl for c in bb]
    return [(sum(p[i] * t[i] for i in range(3)) / scale, sum(p[i] * bb[i] for i in range(3)) / scale) for p in pts]


def roof(pts, mat=SHINGLE, g=None):
    (g or G).face(pts, mat, face_uv(pts))


def revolve(cx, cy, prof, mat, seg=20, smooth=True):
    rings = [[(cx + r * math.cos(2 * math.pi * i / seg), cy + r * math.sin(2 * math.pi * i / seg), z) for i in range(seg)] for r, z in prof]
    for (ra, a), (rb, b) in zip(zip(prof, rings), zip(prof[1:], rings[1:])):
        for i in range(seg):
            j = (i + 1) % seg
            G.face([a[i], a[j], b[j], b[i]], mat, [(i / seg * 6, ra[1] / 1.5), ((i + 1) / seg * 6, ra[1] / 1.5),
                                                     ((i + 1) / seg * 6, rb[1] / 1.5), (i / seg * 6, rb[1] / 1.5)], smooth=smooth)


def inside(pt, ring):
    x, y, ok = pt[0], pt[1], False
    for (x1, y1), (x2, y2) in zip(ring, ring[1:] + ring[:1]):
        if (y1 > y) != (y2 > y) and x < (x2 - x1) * (y - y1) / (y2 - y1) + x1:
            ok = not ok
    return ok


def seg_dist(p, a, b):
    ax, ay, bx, by = a[0], a[1], b[0], b[1]
    L2 = (bx - ax) ** 2 + (by - ay) ** 2 or 1e-9
    t = max(0.0, min(1.0, ((p[0] - ax) * (bx - ax) + (p[1] - ay) * (by - ay)) / L2))
    return math.dist(p, (ax + t * (bx - ax), ay + t * (by - ay)))


# ------------------------------------------------------------------------------------------ frame and plan
O = (-719.61, 540.78)                      # footprint centroid
F = Frame(O, (O[0] + math.sin(math.radians(67)), O[1] + math.cos(math.radians(67))))
UW = [F.uw(p) for p in R]
W_S, W_N = UW[8][1], UW[2][1]              # nave walls (≈ -7.9 / 8.63)
WC = (W_S + W_N) / 2
K_NAVE = (RIDGE - EAVE) / ((W_N - W_S) / 2)
T_U0, T_U1 = UW[1][0], UW[0][0]            # transept (north arm) u-extent ≈ -9.37 .. 10.43
UC = (T_U0 + T_U1) / 2
K_TR = (RIDGE - EAVE) / ((T_U1 - T_U0) / 2)
TOWER_U0, TOWER_U1 = UW[5][0], UW[3][0] + 0.8   # deepened slightly towards the nave (photos: nearly square)
TOWER_W0, TOWER_W1 = UW[6][1], UW[5][1]
TU, TWC = (TOWER_U0 + TOWER_U1) / 2, (TOWER_W0 + TOWER_W1) / 2
SHAFT = 25.0

# The east end, made symmetric (the OSM outline is roughly traced here).
CH_S, CH_N = UW[12][1], UW[17][1]
E0, E1 = 22.5, 28.9
S0, S1, N1, N0 = (E0, CH_S), (E1, WC - 4.5), (E1, WC + 4.5), (E0, CH_N)

# ------------------------------------------------------------------------------------------ walls
body = []                                  # (wall, height)
for i in (0, 1, 2, 3, 7, 8, 9, 10, 11, 17):
    body.append((Wall(R[i], R[(i + 1) % 18]), EAVE))
chancel_s = Wall(R[12], F.P(*S0))
body += [(chancel_s, EAVE), (Wall(F.P(*S0), F.P(*S1)), EAVE), (Wall(F.P(*S1), F.P(*N1)), EAVE),
         (Wall(F.P(*N1), F.P(*N0)), EAVE), (Wall(F.P(*N0), R[17]), EAVE)]
tower = [Wall(R[4], R[5]), Wall(R[5], R[6]), Wall(R[6], R[7])]
for w, h in body + [(t, SHAFT) for t in tower]:
    w.rect(0, w.L, -0.3, h, WHITE, scale=7.0)
    w.ledge(0, w.L, -0.3, 0.9, PINK, 0.05)                            # pink spray-rendered plinth
for w, h in body:
    w.ledge(-0.15, w.L + 0.15, EAVE - 0.45, EAVE, WHITE, 0.24)        # plastered eaves cornice
# tower parts that were drawn into the nave (above the nave roof)
Wall(F.P(TOWER_U1, TOWER_W1), F.P(TOWER_U1, TOWER_W0)).rect(0, TOWER_W1 - TOWER_W0, EAVE, SHAFT, WHITE, scale=7.0)
Wall(F.P(UW[4][0], TOWER_W1), F.P(TOWER_U1, TOWER_W1)).rect(0, TOWER_U1 - UW[4][0], EAVE, SHAFT, WHITE, scale=7.0)
Wall(F.P(TOWER_U1, TOWER_W0), F.P(UW[7][0], TOWER_W0)).rect(0, TOWER_U1 - UW[7][0], EAVE, SHAFT, WHITE, scale=7.0)
G.face([F.P(TOWER_U0, TOWER_W0, SHAFT), F.P(TOWER_U1, TOWER_W0, SHAFT), F.P(TOWER_U1, TOWER_W1, SHAFT), F.P(TOWER_U0, TOWER_W1, SHAFT)],
       COPPER, uvscale=3.0)

# ------------------------------------------------------------------------------------------ roofs (all ridges at 17 m)
O_H = 0.45                                                            # eave overhang
ze = EAVE - O_H * K_NAVE
ws, wn = W_S - O_H, W_N + O_H
u0 = UW[7][0] - 0.2                                                    # west end, inside the tower
ur = E1 + O_H - (RIDGE - ze) / math.tan(math.radians(53))              # hip apex of the east end
es0, es1, en1, en0 = (E0, ws), (E1 + O_H, WC - 4.8), (E1 + O_H, WC + 4.8), (E0, wn)
roof([F.P(u0, ws, ze), F.P(E0, ws, ze), F.P(ur, WC, RIDGE), F.P(u0, WC, RIDGE)])
roof([F.P(E0, wn, ze), F.P(u0, wn, ze), F.P(u0, WC, RIDGE), F.P(ur, WC, RIDGE)])
for a, b in ((es0, es1), (es1, en1), (en1, en0)):
    roof([F.P(*a, ze), F.P(*b, ze), F.P(ur, WC, RIDGE)])
tze = EAVE - O_H * K_TR
tw0, tw1 = UW[10][1] - 0.35, UW[0][1] + 0.35
roof([F.P(T_U0 - O_H, tw1, tze), F.P(T_U0 - O_H, tw0, tze), F.P(UC, tw0, RIDGE), F.P(UC, tw1, RIDGE)])
roof([F.P(T_U1 + O_H, tw0, tze), F.P(T_U1 + O_H, tw1, tze), F.P(UC, tw1, RIDGE), F.P(UC, tw0, RIDGE)])
for a, b in (((u0, WC), (ur, WC)), ((UC, tw0), (UC, tw1))):                        # ridge boards
    p, q = F.P(*a), F.P(*b)
    G.box(((p[0] + q[0]) / 2, (p[1] + q[1]) / 2, RIDGE + 0.06), (math.dist(p[:2], q[:2]), 0.32, 0.16), BLACK,
          math.atan2(q[1] - p[1], q[0] - p[0]), uvscale=1.0)
# gable triangles: transepts, and the bits of the nave's west gable beside the tower
for gw, ua, ub in ((UW[0][1], UW[0][0], UW[1][0]), (UW[10][1], UW[10][0], UW[11][0])):
    w = Wall(F.P(ua, gw), F.P(ub, gw))
    xa = w.x_of(F.P(UC, gw))
    w.poly([(0, EAVE), (w.L, EAVE), (xa, RIDGE)], WHITE)
    for sgn in (-1, 1):                                                               # shingle bargeboard edge
        x_end = 0 if sgn < 0 else w.L
        w.poly([(x_end, EAVE - 0.05), (xa, RIDGE + 0.05), (xa, RIDGE - 0.3), (x_end - sgn * 0.4, EAVE - 0.05)], WHITE, 0.25)
for i, (wa, wb) in ((3, (UW[3][1], UW[4][1])), (7, (UW[7][1], UW[8][1]))):
    w = Wall(R[i], R[i + 1])
    za = RIDGE - abs(wa - WC) * K_NAVE
    zb = RIDGE - abs(wb - WC) * K_NAVE
    w.poly([(0, EAVE), (w.L, EAVE), (w.L, max(EAVE, zb)), (0, max(EAVE, za))], WHITE)
for u, w_ in ((-11.0, WC + 4.2), (13.0, WC - 4.4)):                                    # two small chimneys
    zr = RIDGE - abs(w_ - WC) * K_NAVE
    c = F.P(u, w_)
    G.box((c[0], c[1], zr + 0.4), (0.8, 0.6, 2.2), WHITE, F.a, uvscale=1.0)
    G.box((c[0], c[1], zr + 1.55), (0.95, 0.75, 0.12), BLACK, F.a, uvscale=1.0)

# ------------------------------------------------------------------------------------------ openings of the church body
def mid(w):
    return w.L / 2


window(Wall(R[2], R[3]), mid(Wall(R[2], R[3])), 1.7, 1.7, 3.5)          # nave west bay, north
window(Wall(R[8], R[9]), mid(Wall(R[8], R[9])), 1.7, 1.7, 3.5)          # nave west bay, south
for i in (1, 9, 11, 17):                                                 # transept side walls
    w = Wall(R[i], R[(i + 1) % 18])
    window(w, mid(w), 1.7, 1.8, 3.6)
for w in (chancel_s, Wall(F.P(*N0), R[17])):                            # chancel: two windows each
    for f in (0.22, 0.78):
        window(w, w.L * f, 1.7, 1.7, 3.5, rows=4)
    if w is chancel_s:                                                   # Prästporten (1671): stone portal
        xc = w.L * 0.5
        w.poly(arch(xc, 0.0, 1.4, 2.7), 'M_Wall_Wood_brown_Blank', 0.03)
        for dx in (-1.0, 1.0):
            c = w.at(xc + dx, 1.55, 0.12)
            G.box(c, (0.32, 0.24, 3.1), STONE, w.ang, uvscale=1.0)
        c = w.at(xc, 3.3, 0.16)
        G.box(c, (2.7, 0.32, 0.45), STONE, w.ang, uvscale=1.0)
        w.poly([(xc - 0.9, 3.53), (xc + 0.9, 3.53), (xc, 4.3)], STONE, 0.12)
east = Wall(F.P(*S1), F.P(*N1))
east.poly(arch(east.L / 2, 0.0, 1.3, 2.7), DOOR, 0.03)
east.ring(arch(east.L / 2, -0.1, 1.7, 3.0), arch(east.L / 2, 0.0, 1.3, 2.7), WHITE, 0.08)
for w in (Wall(F.P(*S0), F.P(*S1)), Wall(F.P(*N1), F.P(*N0))):
    window(w, mid(w), 1.7, 1.6, 3.3)
# transept gables: arched door, round window with red bars, relief cross, sundials, iron cross on the apex
for gw, ua, ub in ((UW[0][1], UW[0][0], UW[1][0]), (UW[10][1], UW[10][0], UW[11][0])):
    w = Wall(F.P(ua, gw), F.P(ub, gw))
    xc = w.x_of(F.P(UC, gw))
    w.ring(arch(xc, -0.05, 2.1, 3.4), arch(xc, 0.0, 1.6, 3.1), WHITE, 0.1)
    w.poly(arch(xc, 0.0, 1.6, 3.1), DOOR, 0.03)
    w.ring(ellipse(xc, 5.4, 1.25, 1.25), ellipse(xc, 5.4, 1.0, 1.0), WHITE, 0.08)
    w.poly(ellipse(xc, 5.4, 1.0, 1.0), GLASS, 0.03, uv=[(0.5 + 0.3 * math.cos(2 * math.pi * k / 16), 0.66 + 0.2 * math.sin(2 * math.pi * k / 16)) for k in range(16)])
    w.rect(xc - 0.04, xc + 0.04, 4.42, 6.38, RED, 0.06)
    w.rect(xc - 0.98, xc + 0.98, 5.36, 5.44, RED, 0.06)
    for (cx_, cz_, sx_, sz_) in ((xc, 10.4, 0.7, 4.4), (xc, 10.95, 2.6, 0.7)):     # relief cross (proud, so it casts shade)
        c_ = w.at(cx_, cz_, 0.13)
        G.box(c_, (sx_, 0.26, sz_), IVORY, w.ang, uvscale=1.0)
    for dx in (-2.6, 2.6):                                               # memorial tablets / sundials
        w.rect(xc + dx - 0.45, xc + dx + 0.45, 2.2, 3.1, STONE, 0.06)
    top = w.at(xc, RIDGE, 0.0)
    G.box((top[0], top[1], RIDGE + 0.9), (0.07, 0.07, 1.8), BLACK, w.ang, uvscale=1.0)
    G.box((top[0], top[1], RIDGE + 1.25), (0.8, 0.07, 0.07), BLACK, w.ang, uvscale=1.0)

# ------------------------------------------------------------------------------------------ the tower
west, north_t, south_t = Wall(R[5], R[6]), Wall(R[4], R[5]), Wall(R[6], R[7])
east_t = Wall(F.P(TOWER_U1, TOWER_W1), F.P(TOWER_U1, TOWER_W0))
xc = west.x_of(F.P(TOWER_U0, TWC))
west.ring(arch(xc, 0.0, 3.5, 5.6), arch(xc, 0.0, 2.9, 5.3), WHITE, 0.14)      # deep arched recess
west.poly(arch(xc, 0.0, 2.9, 5.3), IVORY, 0.02)
west.poly(arch(xc, 0.15, 1.8, 3.4), DOOR, 0.04)
west.rect(xc - 0.03, xc + 0.03, 0.15, 3.3, BLACK, 0.06)
lc = west.at(xc, 4.15, 0.35)
G.box(lc, (0.3, 0.3, 0.45), BLACK, west.ang, uvscale=1.0)
G.box((lc[0], lc[1], 3.95), (0.22, 0.22, 0.2), GOLD, west.ang, uvscale=1.0)
for k in range(3):                                                       # red sandstone steps
    s = west.at(xc, 0.0, 0.5 + 0.4 * (2 - k))
    G.box((s[0], s[1], 0.08 + 0.15 * k), (3.4 - 0.3 * k, 0.45 + 0.8 * (2 - k), 0.16), 'M_Wall_Stone_sandstone_Blank', west.ang, uvscale=1.0)
quat = [(xc + 1.25 * (0.74 + 0.26 * abs(math.cos(2 * t))) * math.cos(t), 10.6 + 1.25 * (0.74 + 0.26 * abs(math.cos(2 * t))) * math.sin(t))
        for t in (2 * math.pi * k / 32 for k in range(32))]
quat_out = [(xc + (x - xc) * 1.18, 10.6 + (z - 10.6) * 1.18) for x, z in quat]
west.ring(quat_out, quat, WHITE, 0.1)
fan(west, xc, 10.6, quat, GLASS, 0.03)
west.rect(xc - 0.04, xc + 0.04, 9.4, 11.8, RED, 0.06)
west.rect(xc - 1.2, xc + 1.2, 10.56, 10.64, RED, 0.06)
for dz in (-0.45, 0.45):
    west.rect(xc - 0.75, xc + 0.75, 10.6 + dz - 0.03, 10.6 + dz + 0.03, RED, 0.06)
window(west, xc, 14.2, 1.6, 3.2, bars=RED, rows=3)
for w in (west, north_t, south_t, east_t):                               # belfry openings with red louvre doors
    x = w.x_of(F.P(TU, TWC)) if w is not west else xc
    x = min(max(x, 1.5), w.L - 1.5)
    w.ring(arch(x, 19.6, 2.25, 3.9), arch(x, 19.8, 1.8, 3.5), WHITE, 0.1)
    w.poly(arch(x, 19.8, 1.8, 3.5), RED, 0.03)
    w.rect(x - 0.03, x + 0.03, 19.8, 22.4, BLACK, 0.05)
xn = north_t.x_of(F.P(TU, TWC))
window(north_t, xn, 1.6, 1.4, 2.8, bars=RED)
window(north_t, xn, 12.4, 1.4, 2.8, bars=RED)
xs = south_t.x_of(F.P(TU, TWC))
south_t.ring(arch(xs, -0.05, 2.0, 3.2), arch(xs, 0.0, 1.5, 2.95), WHITE, 0.1)
south_t.poly(arch(xs, 0.0, 1.5, 2.95), RED, 0.03)
window(south_t, xs, 12.4, 1.2, 2.4, bars=RED)
# main cornice with dentils and copper flashing
for w in (west, north_t, south_t, east_t):
    w.ledge(-0.45, w.L + 0.45, SHAFT - 0.75, SHAFT - 0.1, WHITE, 0.45)
    w.ledge(-0.55, w.L + 0.55, SHAFT - 0.1, SHAFT + 0.05, COPPER, 0.55)
    n = int(w.L / 0.5)
    for k in range(n + 1):
        c = w.at(w.L * k / n, SHAFT - 0.9, 0.12)
        G.box(c, (0.18, 0.24, 0.2), WHITE, w.ang, uvscale=1.0)
# clock stage
S = 0.88 * min(TOWER_W1 - TOWER_W0, TOWER_U1 - TOWER_U0)
Z0, Z1 = SHAFT + 0.05, SHAFT + 3.9
cs = [F.P(TU - S / 2, TWC - S / 2), F.P(TU + S / 2, TWC - S / 2), F.P(TU + S / 2, TWC + S / 2), F.P(TU - S / 2, TWC + S / 2)]
for a, b in zip(cs, cs[1:] + cs[:1]):
    w = Wall(a, b)
    w.rect(0, w.L, Z0, Z1, WHITE, scale=7.0)
    w.ledge(-0.3, w.L + 0.3, Z1 - 0.3, Z1, WHITE, 0.3)
    xm, zm = w.L / 2, Z0 + 1.95
    disc(w, xm, zm, 1.05, BLACK, 0.04)
    w.ring(ellipse(xm, zm, 1.17, 1.17), ellipse(xm, zm, 1.05, 1.05), GOLD, 0.05)
    w.rect(xm - 0.04, xm + 0.04, zm, zm + 0.8, GOLD, 0.07)               # minute hand
    w.poly([(xm, zm - 0.04), (xm + 0.55, zm + 0.2), (xm + 0.53, zm + 0.26), (xm - 0.02, zm + 0.04)], GOLD, 0.07)
    for dx in (-2.9, 2.9):                                               # oval oculi
        w.ring(ellipse(xm + dx, zm, 0.55, 0.78), ellipse(xm + dx, zm, 0.42, 0.65), WHITE, 0.06)
        w.poly(ellipse(xm + dx, zm, 0.42, 0.65), GLASS, 0.03, uv=[(0.5, 0.7)] * 16)
    w.poly([(xm - 1.9, Z1 - 0.3), (xm + 1.9, Z1 - 0.3), (xm, Z1 + 0.75)], WHITE, 0.32)   # pediment over the clock
G.face([(p[0], p[1], Z1) for p in cs], COPPER, uvscale=3.0)
# the copper bell cap ("huv", 1841), ball, spire and gilded rooster
tc = F.P(TU, TWC)
cap = [(S * 0.56, Z1), (S * 0.6, Z1 + 0.25), (S * 0.57, Z1 + 0.55), (S * 0.52, Z1 + 1.4), (S * 0.45, Z1 + 2.4), (S * 0.37, Z1 + 3.3),
       (S * 0.28, Z1 + 4.1), (S * 0.19, Z1 + 4.75), (S * 0.11, Z1 + 5.3), (S * 0.07, Z1 + 5.8), (S * 0.06, Z1 + 6.3)]
revolve(tc[0], tc[1], cap, COPPER, seg=24)
ball = [(0.06 * S, Z1 + 6.3), (0.45, Z1 + 6.45), (0.62, Z1 + 6.75), (0.62, Z1 + 7.05), (0.45, Z1 + 7.35), (0.12, Z1 + 7.5)]
revolve(tc[0], tc[1], ball, COPPER, seg=12)
G.cyl(tc[0], tc[1], Z1 + 7.5, 0.1, 4.6, BLACK, seg=6, r2=0.02)
G.box((tc[0], tc[1], Z1 + 9.6), (1.1, 0.07, 0.07), BLACK, F.a, uvscale=1.0)
G.box((tc[0], tc[1], Z1 + 11.4), (0.75, 0.06, 0.55), GOLD, F.a + 0.6, uvscale=1.0)          # weathervane rooster

# ------------------------------------------------------------------------------------------ churchyard buildings (not in OSM)
def hipped_house(cx, cy, a, L, W, eave, rise, wall_mat, roof_mat, g=None, walls=True):
    g = g or G
    c, s = math.cos(a), math.sin(a)
    P = lambda u, w, z=0.0: (cx + u * c - w * s, cy + u * s + w * c, z)
    pts = [P(-L / 2, -W / 2), P(L / 2, -W / 2), P(L / 2, W / 2), P(-L / 2, W / 2)]
    for p, q in zip(pts, pts[1:] + pts[:1]) if walls else ():
        g.face([(p[0], p[1], -0.3), (q[0], q[1], -0.3), (q[0], q[1], eave), (p[0], p[1], eave)], wall_mat, uvscale=3.0)
    o = 0.4
    hl, hw = L / 2 + o, W / 2 + o
    zr = eave + rise
    rl = max(0.0, L / 2 - W / 2)
    e = [P(-hl, -hw, eave - 0.25), P(hl, -hw, eave - 0.25), P(hl, hw, eave - 0.25), P(-hl, hw, eave - 0.25)]
    r0, r1 = P(-rl, 0, zr), P(rl, 0, zr)
    roof([e[0], e[1], r1, r0], roof_mat, g)
    roof([e[2], e[3], r0, r1], roof_mat, g)
    roof([e[1], e[2], r1], roof_mat, g)
    roof([e[3], e[0], r0], roof_mat, g)
    return P


# winter burial chapel (1867): white, three arched doors towards the church, hipped dark shingle roof
P = hipped_house(-766.0, 524.0, F.a, 12.0, 9.0, 4.0, 3.2, WHITE, SHINGLE)
front = Wall(P(6.0, -4.5), P(6.0, 4.5))
for x in (2.0, 4.5, 7.0):
    front.ring(arch(x, -0.05, 1.7, 3.0), arch(x, 0.0, 1.3, 2.8), WHITE, 0.1)
    front.poly(arch(x, 0.0, 1.3, 2.8), DOOR, 0.03)
front.ledge(0, 9.0, -0.3, 0.6, PINK, 0.05)
# log bone house with a pyramidal shingle roof
P = hipped_house(-773.0, 543.0, F.a, 6.0, 6.0, 2.6, 2.4, LOG, SHINGLE)
# lychgate: white arch with a small copper cap and gilded finial
lg = F.P(*F.uw((-760.0, 555.0)))
c, s = math.cos(F.a), math.sin(F.a)
for side in (-1, 1):
    px, py = lg[0] - s * side * 1.55, lg[1] + c * side * 1.55
    G.box((px, py, 1.6), (2.2, 0.7, 3.2), WHITE, F.a, uvscale=1.0)
G.box((lg[0], lg[1], 3.45), (2.4, 3.8, 0.5), WHITE, F.a, uvscale=1.0)
hipped_house(lg[0], lg[1], F.a, 2.6, 4.0, 3.7, 1.0, WHITE, COPPER, walls=False)
G.cyl(lg[0], lg[1], 4.7, 0.12, 0.5, GOLD, seg=6, r2=0.02)

# ------------------------------------------------------------------------------------------ kyrkstallar: 87 log stables in two groups
def stable(g, cx, cy, a, L, W, eave):
    """A grey log stable: dry-stone footing, horizontal logs with crossed corner ends, low board roof, plank door."""
    c, s = math.cos(a), math.sin(a)
    P = lambda u, w, z=0.0: (cx + u * c - w * s, cy + u * s + w * c, z)
    g.box((cx, cy, 0.15), (L + 0.3, W + 0.3, 0.6), DRYSTONE, a, uvscale=1.5)
    pts = [P(-L / 2, -W / 2), P(L / 2, -W / 2), P(L / 2, W / 2), P(-L / 2, W / 2)]
    for p, q in zip(pts, pts[1:] + pts[:1]):
        Ln = math.dist(p[:2], q[:2])
        g.face([(p[0], p[1], 0.4), (q[0], q[1], 0.4), (q[0], q[1], eave), (p[0], p[1], eave)], LOG,
               [(0.4 / 2.8, 0), (0.4 / 2.8, Ln / 1.2), (eave / 2.8, Ln / 1.2), (eave / 2.8, 0)])      # logs run horizontally
    for p in pts:                                                        # crossed log ends at the corners
        g.box((p[0], p[1], (0.4 + eave) / 2), (0.75, 0.75, eave - 0.4), LOG, a + math.pi / 4, uvscale=0.6, top=False)
    rise = W / 2 * math.tan(math.radians(rng.uniform(22, 30)))
    o = 0.35
    e = [P(-L / 2 - o, -W / 2 - o, eave - 0.1), P(L / 2 + o, -W / 2 - o, eave - 0.1), P(L / 2 + o, W / 2 + o, eave - 0.1), P(-L / 2 - o, W / 2 + o, eave - 0.1)]
    r0, r1 = P(-L / 2 - o, 0, eave + rise), P(L / 2 + o, 0, eave + rise)
    for quad in ([e[0], e[1], r1, r0], [e[2], e[3], r0, r1]):
        g.face(quad, BOARDS, [(0, 0), (L / 2.4, 0), (L / 2.4, W / 2.0), (0, W / 2.0)])                  # boards run down the slope
    for sgn in (-1, 1):                                                  # gable triangles
        g.face([P(sgn * L / 2, -sgn * W / 2, eave), P(sgn * L / 2, sgn * W / 2, eave), P(sgn * L / 2, 0, eave + rise)], LOG, uvscale=1.0)
    d = P(L / 2 + 0.03, 0.0)                                             # plank door in the gable facing +u
    g.face([(d[0] - s * 0.55, d[1] + c * 0.55, 0.45), (d[0] - s * -0.55, d[1] + c * -0.55, 0.45),
            (d[0] - s * -0.55, d[1] + c * -0.55, 2.0), (d[0] - s * 0.55, d[1] + c * 0.55, 2.0)][::-1], 'M_Wall_Wood_brown_Blank', uvscale=1.0)


def rect_corners(x, y, ang, L, W, m=0.0):
    hx, hy = math.cos(ang), math.sin(ang)
    return [(x + hx * dl - hy * dw, y + hy * dl + hx * dw) for dl, dw in
            ((-L / 2 - m, -W / 2 - m), (L / 2 + m, -W / 2 - m), (L / 2 + m, W / 2 + m), (-L / 2 - m, W / 2 + m))]


def overlap(a, b):
    """Separating-axis test for two convex quads."""
    for poly in (a, b):
        for p, q in zip(poly, poly[1:] + poly[:1]):
            nx, ny = q[1] - p[1], p[0] - q[0]
            pa = [x * nx + y * ny for x, y in a]
            pb = [x * nx + y * ny for x, y in b]
            if max(pa) < min(pb) or max(pb) < min(pa):
                return False
    return True


def stable_group(name, ring, lanes, target):
    """Irregular clusters of stables inside the area: gables face the long axis (the lanes), small gaps."""
    best = max(zip(ring, ring[1:] + ring[:1]), key=lambda e: math.dist(*e))
    axis = math.atan2(best[1][1] - best[0][1], best[1][0] - best[0][0])
    xs, ys = [p[0] for p in ring], [p[1] for p in ring]
    g, placed = Geo(), []
    for _ in range(4000):
        if len(placed) >= target:
            break
        x, y = rng.uniform(min(xs), max(xs)), rng.uniform(min(ys), max(ys))
        L = rng.uniform(4.4, 5.8) if rng.random() > 0.15 else rng.uniform(6.6, 7.4)
        W = rng.uniform(3.6, 4.6)
        ang = axis + rng.choice((0.0, math.pi / 2, math.pi, -math.pi / 2)) + math.radians(rng.uniform(-5, 5))
        box_ = rect_corners(x, y, ang, L, W, 0.45)
        if not all(inside(p, ring) for p in rect_corners(x, y, ang, L, W, 0.1)):
            continue
        if any(seg_dist((x, y), p, q) < max(L, W) / 2 + 1.4 for line in lanes for p, q in zip(line, line[1:])):
            continue
        if any(overlap(box_, other) for other in placed):
            continue
        placed.append(box_)
        stable(g, x, y, ang, L, W, rng.uniform(2.0, 2.5))
    if placed:
        vx = sum(v[0] for v in g.v) / len(g.v)
        vy = sum(v[1] for v in g.v) / len(g.v)
        ctx.objects.append(g.to_object(f'SM_Custom_{ctx.id}_{name}', ctx.collection, f'c{math.floor(vx / 60)}_{math.floor(vy / 60)}',
                                       ctx.lib, {'wb_building': ctx.id}))
    return len(placed)


roads = {r['id']: [tuple(p[:2]) for p in r['p']] for r in ctx.data.get('roads', []) if r['id'] in ('w206307013', 'w907553677')}
group1 = [(-780.7, 547.1), (-770.7, 551.8), (-777.2, 573.9), (-780.7, 602.1), (-778.1, 632.4), (-767.9, 661.4),
          (-775.7, 664.0), (-782.2, 654.1), (-796.7, 646.7), (-807.7, 627.2)]
group2 = [(-543.8, 745.2), (-536.8, 761.9), (-521.8, 771.3), (-467.1, 765.5), (-466.1, 760.7), (-526.9, 740.0)]
n1 = stable_group('Kyrkstallar_Siljan', group1, [roads.get('w206307013', [])], 42)
n2 = stable_group('Kyrkstallar_Stiftsgarden', group2, [roads.get('w907553677', [])], 32)
print(f'  [custom] Rättviks kyrka: {n1 + n2} church stables', flush=True)
