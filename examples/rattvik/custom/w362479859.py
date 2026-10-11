"""Rättviks kommunalhus (court house and town hall, 1951–52, Artur von Schmalensee): references/kommunalhus/.

35.4 × 15.7 m, two storeys on a grey stone plinth, pale yellow render with white window surrounds and
pilaster strips, 11 window bays on the long sides. The entrance in the middle of the WSW front with a
small iron balcony above it. A broken (two-pitch) hipped roof of near-black slate, eaves 8.3 m, with a
round clock at the eaves over the entrance and, on the ridge, an open lantern with a tall black spire
and a weathervane (about 26 m). The middle five bays of the ENE back project slightly.
"""
R = [tuple(p) for p in ctx.footprint['outer']]
if len(R) != 4:
    raise RuntimeError('Rättviks kommunalhus: the OSM outline changed (expected 4 vertices) — update this script')
G = ctx.geo
WALL, TRIM, PLINTH = 'M_Wall_Plaster_ivory_Blank', 'M_Wall_Plaster_white_Blank', 'M_Wall_Stone_grey_Blank'
SLATE, BLACK, GOLD, GLASS = 'M_Roof_Slate_dark', 'M_Roof_Metal_black', 'M_Roof_Metal_gold', 'M_Window_Pane'
DOOR, STEEL = 'M_Wall_Wood_brown_Blank', 'M_Fixture_Metal'
EAVE = 8.3


class Wall:
    def __init__(self, p, q):
        self.p, self.L = p, math.dist(p[:2], q[:2])
        self.t = ((q[0] - p[0]) / self.L, (q[1] - p[1]) / self.L)
        self.n = (self.t[1], -self.t[0])
        self.ang = math.atan2(self.t[1], self.t[0])

    def at(self, x, z, d=0.0):
        return (self.p[0] + self.t[0] * x + self.n[0] * d, self.p[1] + self.t[1] * x + self.n[1] * d, z)

    def poly(self, pts, mat, d=0.0, scale=4.0, uv=None):
        G.face([self.at(x, z, d) for x, z in pts], mat, uv or [(x / scale, z / scale) for x, z in pts])

    def rect(self, x0, x1, z0, z1, mat, d=0.0, scale=4.0, uv=None):
        if x1 - x0 > 1e-3 and z1 - z0 > 1e-3:
            self.poly([(x0, z0), (x1, z0), (x1, z1), (x0, z1)], mat, d, scale, uv)

    def ledge(self, x0, x1, z0, z1, mat, d1):
        self.rect(x0, x1, z0, z1, mat, d1)
        G.face([self.at(x0, z1, d1), self.at(x1, z1, d1), self.at(x1, z1, 0), self.at(x0, z1, 0)], mat, uvscale=1.0)
        G.face([self.at(x0, z0, 0), self.at(x1, z0, 0), self.at(x1, z0, d1), self.at(x0, z0, d1)], mat, uvscale=1.0)


def window(w, xc, z0, width=1.15, height=1.9):
    w.rect(xc - width / 2 - 0.16, xc + width / 2 + 0.16, z0 - 0.16, z0 + height + 0.16, TRIM, 0.04)
    w.rect(xc - width / 2, xc + width / 2, z0, z0 + height, GLASS, 0.06, uv=[(0.2, 0.42), (0.8, 0.42), (0.8, 0.9), (0.2, 0.9)])
    w.rect(xc - 0.03, xc + 0.03, z0, z0 + height, TRIM, 0.08)
    for f in (0.36, 0.68):
        w.rect(xc - width / 2, xc + width / 2, z0 + height * f - 0.025, z0 + height * f + 0.025, TRIM, 0.08)
    w.ledge(xc - width / 2 - 0.2, xc + width / 2 + 0.2, z0 - 0.26, z0 - 0.16, TRIM, 0.12)


def facade(w, bays, door_bay=None, pilasters=()):
    w.rect(0, w.L, -0.3, EAVE, WALL)
    w.ledge(0, w.L, -0.3, 0.75, PLINTH, 0.08)
    w.ledge(-0.15, w.L + 0.15, EAVE - 0.5, EAVE - 0.15, TRIM, 0.3)               # eaves cornice
    for x in (0.0, w.L) + tuple(pilasters):                                       # pilaster strips
        w.rect(max(0, x - 0.3), min(w.L, x + 0.3), 0.75, EAVE - 0.5, WALL, 0.07)
    step = w.L / bays
    for k in range(bays):
        x = step * (k + 0.5)
        window(w, x, 4.85)
        if k == door_bay:
            w.rect(x - 0.95, x + 0.95, 0.0, 3.1, PLINTH, 0.06)                   # stone surround
            w.rect(x - 0.7, x + 0.7, 0.0, 2.8, DOOR, 0.09)
            w.rect(x - 0.025, x + 0.025, 0.0, 2.8, BLACK, 0.11)
            b0, b1, b2, b3 = w.at(x - 1.3, 4.6, 0.0), w.at(x + 1.3, 4.6, 0.0), w.at(x + 1.3, 4.6, 0.9), w.at(x - 1.3, 4.6, 0.9)
            G.face([b0, b1, b2, b3][::-1], PLINTH, uvscale=1.0)
            for a_, b_ in ((b1, b2), (b2, b3), (b3, b0)):
                G.face([(a_[0], a_[1], 4.6), (b_[0], b_[1], 4.6), (b_[0], b_[1], 5.55), (a_[0], a_[1], 5.55)], BLACK, uvscale=0.3)
                G.face([(a_[0], a_[1], 5.55), (b_[0], b_[1], 5.55), (b_[0], b_[1], 4.6), (a_[0], a_[1], 4.6)], BLACK, uvscale=0.3)
            for k2 in range(3):
                s = w.at(x, 0.0, 0.4 + 0.35 * (2 - k2))
                G.box((s[0], s[1], -0.05 + 0.15 * k2), (3.0 - 0.3 * k2, 0.4 + 0.7 * (2 - k2), 0.16), PLINTH, w.ang, uvscale=1.0)
        else:
            window(w, x, 1.35)


front, south, back, north = Wall(R[1], R[2]), Wall(R[2], R[3]), Wall(R[3], R[0]), Wall(R[0], R[1])
facade(front, 11, door_bay=5, pilasters=(front.L * 3 / 11, front.L * 8 / 11))
facade(back, 11, pilasters=(back.L * 3 / 11, back.L * 8 / 11))
facade(south, 4)
facade(north, 4)
# the middle five bays of the back project 0.6 m
x0, x1 = back.L * 3 / 11, back.L * 8 / 11
p0, p1 = back.at(x0, 0, 0.0), back.at(x1, 0, 0.0)
proj = [back.at(x0, 0, 0.6), back.at(x1, 0, 0.6)]
for a_, b_ in ((p0, proj[0]), (proj[0], proj[1]), (proj[1], p1)):
    w = Wall(a_, b_)
    w.rect(0, w.L, -0.3, EAVE - 0.15, WALL)
    w.ledge(0, w.L, -0.3, 0.75, PLINTH, 0.08)
pw = Wall(proj[0], proj[1])
for k in range(5):
    x = pw.L * (k + 0.5) / 5
    window(pw, x, 1.35)
    window(pw, x, 4.85)
G.face([(p[0], p[1], EAVE - 0.15) for p in (p0, p1, proj[1], proj[0])][::-1], SLATE, uvscale=2.0)

# broken hipped roof: steep lower slope to a break line, flatter upper slope to the ridge
cx = sum(p[0] for p in R) / 4
cy = sum(p[1] for p in R) / 4
ax, ay = front.t                         # long axis
bx, by = -front.n[0], -front.n[1]        # across, towards the back
L, W = front.L, south.L
P = lambda u, v, z: (cx + ax * u + bx * v, cy + ay * u + by * v, z)
o, inset, zb, ridge = 0.45, 2.3, EAVE + 3.0, 14.5
low = [P(-L / 2 - o, -W / 2 - o, EAVE - 0.3), P(L / 2 + o, -W / 2 - o, EAVE - 0.3), P(L / 2 + o, W / 2 + o, EAVE - 0.3), P(-L / 2 - o, W / 2 + o, EAVE - 0.3)]
brk = [P(-L / 2 + inset, -W / 2 + inset, zb), P(L / 2 - inset, -W / 2 + inset, zb), P(L / 2 - inset, W / 2 - inset, zb), P(-L / 2 + inset, W / 2 - inset, zb)]
for i in range(4):
    j = (i + 1) % 4
    G.face([low[i], low[j], brk[j], brk[i]], SLATE, uvscale=2.0)
hw = W / 2 - inset
r0, r1 = P(-L / 2 + inset + hw, 0, ridge), P(L / 2 - inset - hw, 0, ridge)
G.face([brk[0], brk[1], r1, r0], SLATE, uvscale=2.0)
G.face([brk[2], brk[3], r0, r1], SLATE, uvscale=2.0)
G.face([brk[1], brk[2], r1], SLATE, uvscale=2.0)
G.face([brk[3], brk[0], r0], SLATE, uvscale=2.0)
for p, q in zip(low, low[1:] + low[:1]):
    G.face([p, q, (q[0], q[1], q[2] - 0.25), (p[0], p[1], p[2] - 0.25)][::-1], TRIM, uvscale=1.0)
# round clock at the eaves above the entrance
xc = front.L / 2
cc = front.at(xc, EAVE + 0.9, 0.2)
G.box((cc[0], cc[1], EAVE + 0.9), (2.4, 1.2, 2.2), SLATE, front.ang, uvscale=1.0)
dial = [front.at(xc + 1.0 * math.cos(2 * math.pi * k / 16), EAVE + 0.9 + 1.0 * math.sin(2 * math.pi * k / 16), 0.82) for k in range(16)]
G.face(dial, TRIM, uvscale=1.0)
ring_ = [front.at(xc + 1.1 * math.cos(2 * math.pi * k / 16), EAVE + 0.9 + 1.1 * math.sin(2 * math.pi * k / 16), 0.83) for k in range(16)]
for k in range(16):
    G.face([ring_[k], ring_[(k + 1) % 16], dial[(k + 1) % 16], dial[k]], BLACK, uvscale=1.0)
for (dx, dz, wdt) in ((0.0, 0.35, 0.06), (0.25, 0.0, 0.06)):
    a_ = front.at(xc, EAVE + 0.9, 0.86)
    G.box((a_[0] + front.t[0] * dx / 2, a_[1] + front.t[1] * dx / 2, EAVE + 0.9 + dz / 2), (max(wdt, dx), 0.03, max(wdt, dz)), BLACK, front.ang, uvscale=1.0)
# lantern turret and spire on the ridge
tx, ty, _ = P(0, 0, 0)
G.box((tx, ty, ridge + 0.6), (2.0, 2.0, 1.6), SLATE, front.ang, uvscale=1.0)
G.box((tx, ty, ridge + 1.45), (2.3, 2.3, 0.15), BLACK, front.ang, uvscale=1.0)
for k in range(8):                                                            # open lantern: eight posts
    a = 2 * math.pi * k / 8
    G.box((tx + 0.85 * math.cos(a), ty + 0.85 * math.sin(a), ridge + 2.75), (0.16, 0.16, 2.5), BLACK, a, uvscale=1.0)
G.cyl(tx, ty, ridge + 1.5, 0.35, 2.5, 'M_Roof_Metal_grey', seg=8)             # the bell inside
G.cyl(tx, ty, ridge + 4.0, 1.15, 0.25, BLACK, seg=8)
G.cyl(tx, ty, ridge + 4.25, 1.0, 7.0, BLACK, seg=8, r2=0.05)                  # spire to about 25.7 m
G.cyl(tx, ty, ridge + 11.2, 0.04, 1.4, GOLD, seg=4)
G.box((tx, ty, ridge + 12.3), (0.7, 0.04, 0.35), GOLD, front.ang + 0.5, uvscale=1.0)
G.box((tx, ty, ridge + 11.9), (0.5, 0.04, 0.05), GOLD, front.ang, uvscale=1.0)
