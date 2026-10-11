"""Långbryggan, Rättvik's 628 m pier into Siljan (photos in ../references/langbryggan/, OSM ways 24815883,
124758357, 68882304, islet 68882302). The generator already lays the plank deck (pier surface, z 0.25).
This adds what makes it Långbryggan:
- grey timber railings both sides (posts every 2 m, three rails so cars stay on the deck),
- pile bents under the deck down to the water, a fascia board along each edge,
- tall poles every 24 m on the north side carrying sagging festoon-light cables,
- the shore entrance: two white lattice towers with lanterns and a wrought-iron arch,
- Holmen, the little wooded islet half-way out, with the boardwalk round it,
- the T-shaped landing at the end with railings, a red-and-white lattice beacon, bollards and benches.
"""
import random

rng = random.Random(24815883)
WOOD, DARK, WHITE = 'M_Wall_Wood_weathered_Blank', 'M_Wall_Wood_brown_Blank', 'M_Wall_Plaster_white_Blank'
IRON, BLACK, RED, GREEN = 'M_Fixture_Metal', 'M_Roof_Metal_black', 'M_Wall_Wood_falu_Blank', 'M_Roof_Metal_green'
GOLD = 'M_Roof_Metal_gold'
DECK = 0.25
WATER = ctx.data.get('water_z', -1.2)

# The pier area is a thin closed polygon: its long edges are the two sides of the deck.
A0, A1 = (201.4, -184.2), (-269.9, -483.5)        # south side, shore → islet
B0, B1 = (200.1, -182.0), (-271.5, -481.1)        # north side
ISLET_PATH = [(-271.5, -481.1), (-274.9, -477.8), (-282.4, -473.4), (-290.0, -472.2), (-295.7, -474.8), (-295.6, -482.2),
              (-285.1, -499.1), (-282.8, -503.9), (-279.8, -506.9), (-276.2, -507.0), (-272.5, -505.9), (-268.9, -500.7),
              (-267.2, -494.6), (-267.4, -487.7), (-269.9, -483.5)]
LANDING = [(-326.3, -523.2), (-322.5, -529.1), (-321.3, -531.0), (-316.2, -531.0), (-316.1, -531.6), (-312.7, -531.5), (-309.3, -529.1),
           (-312.8, -523.5), (-283.4, -505.9), (-286.0, -502.1), (-315.9, -520.1), (-324.1, -508.5), (-330.0, -512.2), (-332.4, -513.6)]
ISLET = [(-276.2, -509.9), (-270.2, -506.3), (-265.2, -495.2), (-266.3, -488.1), (-268.8, -481.9), (-273.5, -477.0), (-280.0, -472.2),
         (-290.3, -470.1), (-299.4, -474.3), (-300.3, -482.7), (-297.6, -484.3), (-296.6, -492.3), (-294.1, -495.2), (-289.6, -500.7),
         (-286.0, -502.1), (-283.4, -505.9), (-283.1, -510.2)]


def emit(g, name):
    """One object per 60 m cell, so the long pier streams and LODs like the rest of the city."""
    for (i, j), sub in g.split_cells(60).items():
        ctx.objects.append(sub.to_object(f'SM_Custom_Langbryggan_{name}_{i}_{j}', ctx.collection, f'c{i}_{j}', ctx.lib,
                                         {'wb_building': 'langbryggan'}))


def railing(g, p, q, z0=DECK, post_step=2.0, h=1.1, start_post=True):
    L = math.dist(p, q)
    if L < 0.3:
        return
    ang = math.atan2(q[1] - p[1], q[0] - p[0])
    n = max(1, round(L / post_step))
    for k in range(0 if start_post else 1, n + 1):
        x, y = p[0] + (q[0] - p[0]) * k / n, p[1] + (q[1] - p[1]) * k / n
        g.box((x, y, z0 + h / 2), (0.11, 0.11, h), WOOD, ang, uvscale=0.6)
    for zr, th, dz in ((0.45, 0.05, 0.12), (0.82, 0.05, 0.16), (h - 0.03, 0.09, 0.07)):
        g.box_between(p, q, th, z0 + zr - dz / 2, z0 + zr + dz / 2, WOOD)
    for k in range(n):                                                    # diagonal braces between the rails
        a = (p[0] + (q[0] - p[0]) * k / n, p[1] + (q[1] - p[1]) * k / n)
        b = (p[0] + (q[0] - p[0]) * (k + 1) / n, p[1] + (q[1] - p[1]) * (k + 1) / n)
        if k % 2 == 0:
            s, t = (a, z0 + 0.5), (b, z0 + 0.8)
        else:
            s, t = (b, z0 + 0.5), (a, z0 + 0.8)
        mx, my = (s[0][0] + t[0][0]) / 2, (s[0][1] + t[0][1]) / 2
        g.face([(s[0][0], s[0][1], s[1]), (t[0][0], t[0][1], t[1]), (t[0][0], t[0][1], t[1] + 0.07), (s[0][0], s[0][1], s[1] + 0.07)], WOOD, uvscale=0.6)


def ring_railing(g, ring, gaps=()):
    for i, (p, q) in enumerate(zip(ring, ring[1:] + ring[:1])):
        if i not in gaps:
            railing(g, p, q)


# ------------------------------------------------------------------------------------------ the long deck
deck = Geo()
railing(deck, (A0[0] - 1.0 * 0.84, A0[1] - 1.0 * 0.54), A1)          # start just clear of the entrance arch
railing(deck, (B0[0] - 1.0 * 0.84, B0[1] - 1.0 * 0.54), B1)
L = math.dist(A0, A1)
ux, uy = (A1[0] - A0[0]) / L, (A1[1] - A0[1]) / L
nx, ny = B0[0] - A0[0], B0[1] - A0[1]
W = math.hypot(nx, ny)
nx, ny = nx / W, ny / W
for side, base in ((-1, A0), (1, B0)):                                # fascia boards along both edges
    p, q = base, (base[0] + ux * L, base[1] + uy * L)
    off = (nx * side * 0.06, ny * side * 0.06)
    deck.box_between((p[0] + off[0], p[1] + off[1]), (q[0] + off[0], q[1] + off[1]), 0.06, DECK - 0.35, DECK + 0.02, DARK)
for k in range(int(L / 4.0) + 1):                                     # pile bents every 4 m
    s = k * 4.0 + 2.0
    if s > L - 1:
        break
    cx, cy = A0[0] + ux * s + nx * W / 2, A0[1] + uy * s + ny * W / 2
    for side in (-1, 1):
        px, py = cx + nx * side * (W / 2 + 0.05), cy + ny * side * (W / 2 + 0.05)
        deck.cyl(px, py, WATER - 1.0, 0.13, DECK - 0.3 - WATER + 1.0, DARK, seg=6, cap=False)
    a, b = (cx - nx * (W / 2 + 0.2), cy - ny * (W / 2 + 0.2)), (cx + nx * (W / 2 + 0.2), cy + ny * (W / 2 + 0.2))
    deck.box_between(a, b, 0.18, DECK - 0.5, DECK - 0.3, DARK)
# festoon-light poles on the north side and the sagging cables between them
poles = []
s = 6.0
while s < L - 4:
    px, py = B0[0] + ux * s + nx * 0.35, B0[1] + uy * s + ny * 0.35
    deck.box((px, py, DECK + 2.9), (0.16, 0.16, 5.8), DARK, math.atan2(uy, ux), uvscale=0.6)
    poles.append((px, py))
    s += 24.0
for (x0, y0), (x1, y1) in zip(poles, poles[1:]):
    prev = None
    for k in range(13):
        t = k / 12
        x, y = x0 + (x1 - x0) * t, y0 + (y1 - y0) * t
        z = DECK + 5.6 - 1.1 * 4 * t * (1 - t)
        if prev:
            deck.face([(prev[0], prev[1], prev[2]), (x, y, z), (x, y, z - 0.035), (prev[0], prev[1], prev[2] - 0.035)], BLACK, uvscale=1.0)
        if 0 < k < 12 and k % 2 == 0:
            deck.box((x, y, z - 0.12), (0.12, 0.12, 0.16), GOLD, 0.0, uvscale=0.5)
        prev = (x, y, z)
emit(deck, 'Deck')

# ------------------------------------------------------------------------------------------ the shore entrance arch
arch = Geo()
ang = math.atan2(ny, nx)
cx, cy = A0[0] + nx * W / 2 + ux * 0.3, A0[1] + ny * W / 2 + uy * 0.3
half = W / 2 + 0.75
for side in (-1, 1):
    tx, ty = cx + nx * side * half, cy + ny * side * half
    for dx in (-0.3, 0.3):                                            # lattice tower: four white corner posts
        for dy in (-0.3, 0.3):
            arch.box((tx + nx * dx - ux * dy, ty + ny * dx - uy * dy, 1.6), (0.07, 0.07, 3.2), WHITE, ang, uvscale=0.5)
    for k in range(7):                                                # crossed lattice on all four sides
        z0, z1 = 0.2 + k * 0.42, 0.2 + (k + 1) * 0.42
        for (ax, ay), (bx, by) in (((-0.3, -0.3), (0.3, -0.3)), ((0.3, -0.3), (0.3, 0.3)), ((0.3, 0.3), (-0.3, 0.3)), ((-0.3, 0.3), (-0.3, -0.3))):
            p = (tx + nx * ax - ux * ay, ty + ny * ax - uy * ay)
            q = (tx + nx * bx - ux * by, ty + ny * bx - uy * by)
            za, zb = (z0, z1) if k % 2 == 0 else (z1, z0)
            arch.face([(p[0], p[1], za), (q[0], q[1], zb), (q[0], q[1], zb + 0.06), (p[0], p[1], za + 0.06)], WHITE, uvscale=0.5)
    arch.box((tx, ty, 3.25), (0.85, 0.85, 0.12), GREEN, ang, uvscale=0.5)
    arch.box((tx, ty, 3.55), (0.28, 0.28, 0.42), GOLD, ang, uvscale=0.5)            # lantern
    arch.cyl(tx, ty, 3.9, 0.28, 0.25, GREEN, seg=4, r2=0.02)
prev = None
for k in range(17):                                                   # wrought-iron arch with a raised crown
    t = -1 + 2 * k / 16
    off = t * half
    z = 3.1 + 0.9 * (1 - t * t) ** 0.5 + 0.6 * max(0.0, 1 - abs(t) * 3.2)
    x, y = cx + nx * off, cy + ny * off
    if prev:
        arch.face([(prev[0], prev[1], prev[2]), (x, y, z), (x, y, z + 0.12), (prev[0], prev[1], prev[2] + 0.12)], BLACK, uvscale=0.5)
        arch.face([(prev[0], prev[1], prev[2] + 0.12), (x, y, z + 0.12), (x, y, z), (prev[0], prev[1], prev[2])], BLACK, uvscale=0.5)
    prev = (x, y, z)
emit(arch, 'Entrance')

# ------------------------------------------------------------------------------------------ Holmen and the end landing
end = Geo()
ring_railing(end, ISLET_PATH, gaps=(14,))                             # boardwalk round the islet (open towards the pier)
ring_railing(end, LANDING, gaps=(8, 9))                               # the T landing (open towards the islet)
tree_g = Geo()
cxi = sum(p[0] for p in ISLET) / len(ISLET)
cyi = sum(p[1] for p in ISLET) / len(ISLET)
for i in range(9):                                                    # birches and pines on Holmen
    r, t = rng.uniform(0, 8.5), rng.uniform(0, 2 * math.pi)
    citylib.tree(tree_g, cxi + r * math.cos(t), cyi + r * math.sin(t), rng.uniform(0.9, 1.3), rng.choice(('leaf', 'leaf', 'conifer')), rng)
emit(tree_g, 'Holmen_trees')
bx, by = -330.0, -514.5                                               # red/white lattice beacon at the far end
for k in range(8):
    z0 = DECK + k * 0.9
    end.box((bx, by, z0 + 0.45), (0.5, 0.5, 0.9), RED if k % 2 == 0 else WHITE, 0.6, uvscale=0.5, top=False)
end.box((bx, by, DECK + 7.3), (0.7, 0.7, 0.1), BLACK, 0.6, uvscale=0.5)
end.box((bx, by, DECK + 7.6), (0.35, 0.35, 0.5), GOLD, 0.6, uvscale=0.5)
for p in LANDING[::2]:                                                # mooring bollards
    end.cyl(p[0], p[1], DECK, 0.14, 0.55, DARK, seg=8)
emit(end, 'Landing')
furn, fixed = Geo(), Geo()
for (x, y, a) in ((-318.0, -523.0, 0.55), (-300.0, -514.0, 0.55), (-287.0, -480.0, 2.1)):
    citylib.prop(furn, fixed, {'k': 'bench', 'x': x, 'y': y, 'a': a})
if furn:
    ctx.objects.append(furn.to_object('SM_Custom_Langbryggan_Furniture', ctx.collection, f'c{math.floor(-305 / 60)}_{math.floor(-510 / 60)}',
                                      ctx.lib, {'wb_building': 'langbryggan'}))
