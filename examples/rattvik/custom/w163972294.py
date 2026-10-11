"""Tågstallarna — Rättvik's old locomotive roundhouse (railway=roundhouse), Långbryggevägen 5.

Street View May 2024: a curved fan of stalls in unrendered red brick on a concrete footing, a row of
large segmental-arched iron windows with small panes on the curved outer wall, brick pilasters between
the stall bays, a corbelled brick eaves band, and a low black roof falling outwards from the inner
(turntable) side, which has tall plank doors to every stall. A fire ladder up one end.
The OSM outline: the long curved outer wall runs v6 → v11 (round the north-west), the inner side
v0 → v5 faces the turntable to the south-east.
"""
R = [tuple(p) for p in ctx.footprint['outer']]
if len(R) != 12:
    raise RuntimeError('Tågstallarna: the OSM outline changed (expected 12 vertices) — update this script')
G = ctx.geo
BRICK, DARK, ROOF = 'M_Wall_Brick_red_Blank', 'M_Wall_Brick_dark_Blank', 'M_Roof_Metal_black'
GLASS, IRON, DOOR, FOOT = 'M_Window_Pane', 'M_Fixture_Metal', 'M_Wall_Wood_brown_Blank', 'M_Concrete'
H_OUT, H_IN = 5.4, 7.6           # eaves on the outer curve, top of the inner wall


class Wall:
    def __init__(self, p, q):
        self.p, self.L = p, math.dist(p[:2], q[:2])
        self.t = ((q[0] - p[0]) / self.L, (q[1] - p[1]) / self.L)
        self.n = (self.t[1], -self.t[0])
        self.ang = math.atan2(self.t[1], self.t[0])

    def at(self, x, z, d=0.0):
        return (self.p[0] + self.t[0] * x + self.n[0] * d, self.p[1] + self.t[1] * x + self.n[1] * d, z)

    def poly(self, pts, mat, d=0.0, scale=3.2, uv=None):
        G.face([self.at(x, z, d) for x, z in pts], mat, uv or [(x / scale, z / scale) for x, z in pts])

    def rect(self, x0, x1, z0, z1, mat, d=0.0, scale=3.2, uv=None):
        if x1 - x0 > 1e-3 and z1 - z0 > 1e-3:
            self.poly([(x0, z0), (x1, z0), (x1, z1), (x0, z1)], mat, d, scale, uv)

    def ledge(self, x0, x1, z0, z1, mat, d1):
        self.rect(x0, x1, z0, z1, mat, d1)
        G.face([self.at(x0, z1, d1), self.at(x1, z1, d1), self.at(x1, z1, 0), self.at(x0, z1, 0)], mat, uvscale=1.0)


def seg_arch(xc, z0, w, h, rise=0.45, n=8):
    """Segmental arch outline (counter-clockwise from the outside)."""
    r = (w * w / 4 + rise * rise) / (2 * rise)
    zc = z0 + h - r
    a = math.asin((w / 2) / r)
    top = [(xc + r * math.sin(a - 2 * a * i / n), zc + r * math.cos(a - 2 * a * i / n)) for i in range(n + 1)]
    return [(xc - w / 2, z0), (xc + w / 2, z0)] + top


cx = sum(p[0] for p in R) / 12
cy = sum(p[1] for p in R) / 12
outer = list(range(5, 12)) + [0]                 # v5 … v11, v0: the curved back and the two ends
inner = [0, 1, 2, 3, 4, 5]                        # v0 … v5: the turntable side

# walls: height follows the roof, low at the outer curve, high along the turntable side
for i in range(12):
    p, q = R[i], R[(i + 1) % 12]
    w = Wall(p, q)
    is_inner = i in (0, 1, 2, 3, 4)
    z = H_IN if is_inner else H_OUT
    if i in (5, 11):                              # the two straight ends slope from inner to outer
        za, zb = (H_IN, H_OUT) if i == 5 else (H_OUT, H_IN)
        w.poly([(0, -0.3), (w.L, -0.3), (w.L, zb), (0, za)], BRICK)
    else:
        w.rect(0, w.L, -0.3, z, BRICK)
    w.ledge(0, w.L, -0.3, 0.45, FOOT, 0.06)
    if is_inner:
        n = max(1, round(w.L / 4.6))
        for k in range(n):
            xc = w.L * (k + 0.5) / n
            w.poly(seg_arch(xc, 0.0, 3.6, 5.4, 0.5), DOOR, 0.04)
            w.rect(xc - 0.03, xc + 0.03, 0.0, 5.0, DARK, 0.06)
            w.poly(seg_arch(xc, 4.9, 3.9, 0.9, 0.5), DARK, 0.05)
    elif i not in (5, 11):
        n = max(1, round(w.L / 3.4))
        for k in range(n):
            xc = w.L * (k + 0.5) / n
            outline = seg_arch(xc, 1.7, 2.4, 2.4, 0.3)
            w.poly(seg_arch(xc, 1.6, 2.8, 2.7, 0.35), DARK, 0.03)                              # brick arch surround
            w.poly(outline, GLASS, 0.05, uv=[(0.2 + 0.6 * (x - xc + 1.2) / 2.4, 0.42 + 0.48 * (zz - 1.7) / 2.4) for x, zz in outline])
            for f in (0.25, 0.5, 0.75):                                                        # iron glazing bars
                w.rect(xc - 1.2 + 2.4 * f - 0.025, xc - 1.2 + 2.4 * f + 0.025, 1.7, 4.0, IRON, 0.07)
            for zz in (2.3, 3.0, 3.7):
                w.rect(xc - 1.2, xc + 1.2, zz - 0.025, zz + 0.025, IRON, 0.07)
            w.ledge(xc - 1.25, xc + 1.25, 1.45, 1.6, FOOT, 0.12)
        for k in range(n + 1):                                                                 # pilasters
            x = w.L * k / n
            w.rect(max(0, x - 0.25), min(w.L, x + 0.25), 0.45, z - 0.5, BRICK, 0.12)
    # corbelled eaves band
    w.ledge(-0.05, w.L + 0.05, (z if i not in (5, 11) else min(H_IN, H_OUT)) - 0.6, (z if i not in (5, 11) else min(H_IN, H_OUT)) - 0.35, DARK, 0.14)

# the roof: one plane per stall, falling from the inner wall to the outer curve, with a small overhang
pair = [(4, 6), (3, 7), (2, 8), (1, 9), (0, 10)]   # inner vertex ↔ outer vertex across each bay
ring_in = [R[5], R[4], R[3], R[2], R[1], R[0]]
ring_out = [R[6], R[7], R[8], R[9], R[10], R[11]]
def out(p, d):
    vx, vy = p[0] - cx, p[1] - cy
    L = math.hypot(vx, vy) or 1
    return (p[0] + vx / L * d, p[1] + vy / L * d)
for (a, b), (c, d) in zip(zip(ring_in, ring_in[1:]), zip(ring_out, ring_out[1:])):
    pa, pb = (a[0], a[1], H_IN + 0.15), (b[0], b[1], H_IN + 0.15)
    oc, od = out(c, 0.5), out(d, 0.5)
    G.face([pa, pb, (od[0], od[1], H_OUT - 0.25), (oc[0], oc[1], H_OUT - 0.25)][::-1], ROOF, uvscale=2.0)
q = out(ring_out[1], -5.0)                       # one brick chimney, as in the photo
G.box((q[0], q[1], H_IN), (0.7, 0.7, 2.2), BRICK, 0.0, uvscale=1.0)
G.box((q[0], q[1], H_IN + 1.15), (0.85, 0.85, 0.12), FOOT, 0.0, uvscale=1.0)
# fire ladder up the north-east end
w = Wall(R[5], R[6])
for side in (-0.3, 0.3):
    a_ = w.at(w.L * 0.35 + side, 0.0, 0.25)
    G.box((a_[0], a_[1], 3.6), (0.05, 0.05, 7.0), IRON, w.ang, uvscale=1.0)
for k in range(14):
    a_ = w.at(w.L * 0.35, 0.4 + k * 0.5, 0.25)
    G.box(a_, (0.6, 0.04, 0.04), IRON, w.ang, uvscale=1.0)
