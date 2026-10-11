"""Basilica di San Giorgio Maggiore (OSM way 138804537 with its building:parts, hidden in overrides.json;
Andrea Palladio, 1566–1610) and its campanile (rebuilt 1791). References in ../references/san-giorgio/.

- Plan from OSM: the nave with aisles and side chapels (49 x 35 m), the transept with semicircular
  apses at both ends, the dome over the crossing, the presbytery and the monks' choir ending in an apse;
  the campanile north of the choir.
- Palladio's white Istrian-stone front facing the Bacino and San Marco: the tall temple front of four
  giant columns on pedestals with niches and statues, entablature and pediment (27 m, OSM) crowned by
  statues, interlocked with the lower temple front of the aisles and its two half-pediments (14–20 m).
- The body in brick with thermal windows, lead roofs; the lead dome on a brick drum with windows, its
  lantern; two little bell turrets with onion caps over the choir.
- The campanile: brick shaft (9 m square, 41 m), white belfry with arched openings and a balustrade,
  the octagonal drum, the green copper cone (to 71 m) and the bronze angel (~75 m).
"""
import inspect
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(inspect.currentframe().f_code.co_filename), 'lib'))
import vkit  # noqa: E402
from vkit import (BRICK, COPPER, GLASS, GOLD, LEAD, STONE, WHITE, Frame, Plane, arch_curve, arched_wall, balustrade,  # noqa: E402
                  figure, rot_box)

H, PI = math.pi / 2, math.pi
MARBLE = 'M_Wall_Stone_limestone_Blank'
BRONZE = 'M_Roof_Metal_patina'
DOOR = 'M_Wall_Wood_brown_Blank'
g = Geo()
fr = Frame(g, 414.3, -610.6, math.atan2(-0.331, 0.943))     # u from the facade into the church (ESE), w to its left
W0 = -0.6                                                  # the church's axis


def thermal(pl, c, zs, r, d=0.04):
    """A thermal (semicircular, three-light) window with a white frame."""
    pl.poly([(c - r - 0.3, zs - 0.3), (c + r + 0.3, zs - 0.3)] + arch_curve('round', c - r - 0.3, c + r + 0.3, zs - 0.3, r + 0.3, 8)[::-1], WHITE, d)
    pl.poly([(c - r, zs), (c + r, zs)] + arch_curve('round', c - r, c + r, zs, None, 8)[::-1], GLASS, d + 0.03)
    for x in (-r / 3, r / 3):
        pl.block(c + x - 0.08, zs, c + x + 0.08, zs + math.sqrt(max(0.0, r * r - x * x)), d + 0.03, d + 0.1, WHITE)


def walls(ring, z0, z1, mat, top=None):
    fr.prism(ring, z0, z1, mat, top=top is not None, top_mat=top)


# ------------------------------------------------------------------------------------------ the body (brick)
AISLE = [(0.0, -17.5), (49.4, -17.5), (49.4, 17.4), (0.0, 17.4)]
walls(AISLE, -0.3, 14.0, BRICK)
vkit.hip_roof(fr, 0.0, 49.4, -17.5, 17.4, 14.0, 4.5, LEAD, hip=(False, True))
fr.prism([(0.3, -8.4 + W0), (52.0, -8.4 + W0), (52.0, 8.4 + W0), (0.3, 8.4 + W0)], 14.0, 22.0, BRICK, top=False)       # nave clerestory
vkit.hip_roof(fr, 0.3, 52.0, -8.4 + W0, 8.4 + W0, 22.0, 4.2, LEAD, hip=(False, False))
fr.prism([(25.3, -18.2 + W0), (41.6, -18.2 + W0), (41.6, 18.2 + W0), (25.3, 18.2 + W0)], 14.0, 22.0, BRICK, top=False)   # transept
vkit.hip_roof(fr, 25.3, 41.6, -18.2 + W0, 18.2 + W0, 22.0, 4.2, LEAD, hip=(False, False))
for side in (-1, 1):                                                                           # transept apses
    cw = W0 + side * 18.2
    half = [(33.45 + 7.3 * math.cos(math.pi * i / 10), cw + side * 7.3 * math.sin(math.pi * i / 10)) for i in range(11)]
    for p, q in zip(half, half[1:]):
        fr.face_toward([(p[0], p[1], -0.3), (q[0], q[1], -0.3), (q[0], q[1], 20.0), (p[0], p[1], 20.0)], BRICK,
                       ((p[0] + q[0]) / 2 - 33.45, (p[1] + q[1]) / 2 - cw, 0.0), uvscale=2.0)
    for i in range(10):
        a0, a1 = math.pi * i / 10, math.pi * (i + 1) / 10
        for j in range(2):
            e0, e1 = math.pi / 2 * j / 2, math.pi / 2 * (j + 1) / 2
            q = [(33.45 + 7.3 * math.cos(e) * math.cos(a), cw + side * 7.3 * math.cos(e) * math.sin(a), 20.0 + 5.0 * math.sin(e)) for a, e in
                 ((a0, e0), (a1, e0), (a1, e1), (a0, e1))]
            fr.face_toward(q, LEAD, (math.cos((a0 + a1) / 2), side * math.sin((a0 + a1) / 2), 0.6))
# presbytery and choir with the end apse
fr.prism([(49.4, -9.9 + 0.2), (79.3, -9.9 + 0.2), (79.3, 8.3), (49.4, 8.3)], -0.3, 23.0, BRICK, top=False)
vkit.hip_roof(fr, 49.4, 79.3, -9.7, 8.3, 23.0, 4.0, LEAD, hip=(False, False))
half = [(79.3 + 7.3 * math.sin(math.pi * i / 10), W0 + 7.3 * math.cos(math.pi * i / 10)) for i in range(11)]
for p, q in zip(half, half[1:]):
    fr.face_toward([(p[0], p[1], -0.3), (q[0], q[1], -0.3), (q[0], q[1], 20.0), (p[0], p[1], 20.0)], BRICK, ((p[0] + q[0]) / 2 - 79.3, 0.0, 0.0))
for i in range(10):
    a0, a1 = math.pi * i / 10, math.pi * (i + 1) / 10
    for j in range(2):
        e0, e1 = math.pi / 2 * j / 2, math.pi / 2 * (j + 1) / 2
        q = [(79.3 + 7.3 * math.cos(e) * math.sin(a), W0 + 7.3 * math.cos(e) * math.cos(a), 20.0 + 5.0 * math.sin(e)) for a, e in
             ((a0, e0), (a1, e0), (a1, e1), (a0, e1))]
        fr.face_toward(q, LEAD, (math.sin((a0 + a1) / 2), math.cos((a0 + a1) / 2), 0.6))
for blk in ([(59.4, 11.4), (72.0, 11.4), (72.0, 31.0), (59.4, 31.0)], [(48.9, -26.0), (64.3, -26.0), (64.3, -9.7), (48.9, -9.7)]):
    walls(blk, -0.3, 16.0, BRICK)
    us, ws = [p[0] for p in blk], [p[1] for p in blk]
    vkit.hip_roof(fr, min(us), max(us), min(ws), max(ws), 16.0, 2.2, 'M_Roof_Tiles_red')
# thermal windows in the clerestory and the aisles (north and south flanks)
for side in (-1, 1):
    pl = Plane(fr, 49.4, side * 17.4 + (0.0 if side > 0 else -0.1), PI) if side > 0 else Plane(fr, 0.0, -17.5, 0.0)
    for k in range(3):
        c = 5.0 + k * 7.5 if side < 0 else 49.4 - (5.0 + k * 7.5)
        thermal(pl, c, 9.0, 2.2)
    pl2 = Plane(fr, 52.0, 8.4 + W0, PI) if side > 0 else Plane(fr, 0.3, -8.4 + W0, 0.0)
    for k in range(3):
        c = 6.0 + k * 7.0 if side < 0 else 51.7 - (6.0 + k * 7.0)
        thermal(pl2, c, 17.6, 2.6)

# ------------------------------------------------------------------------------------------ dome, lantern, bell turrets
DU, DW = 33.3, -0.8
fr.box(DU, DW, 22.0, 17.0, 17.0, 2.6, BRICK)
fr.revolve(DU, DW, 24.6, [(8.0, 0.0), (8.0, 5.4), (8.35, 5.6), (8.35, 6.0)], BRICK, 32, smooth=False, around=12, vlen=2.0)
for i in range(8):
    t = math.tau * (i + 0.5) / 8
    c_, s_ = math.cos(t), math.sin(t)
    pts = [(-0.8, 25.6), (0.8, 25.6)] + [(0.8 * math.cos(math.pi * j / 6), 28.4 + 0.8 * math.sin(math.pi * j / 6)) for j in range(7)]
    fr.face([(DU + 8.03 * c_ - x * s_, DW + 8.03 * s_ + x * c_, z) for x, z in pts], GLASS)
DOME = [(7.9, 0.0), (7.9, 0.6), (7.6, 2.4), (6.9, 4.2), (5.7, 5.9), (4.1, 7.2), (2.2, 8.0), (1.6, 8.15)]
fr.revolve(DU, DW, 30.6, DOME, 'M_Wall_Metal_grey_Blank', 36, smooth=True, around=1, vlen=11.0)   # ribbed lead
fr.revolve(DU, DW, 38.7, [(1.75, 0.0), (1.75, 3.0), (2.0, 3.2), (1.6, 3.5), (1.1, 4.4), (0.3, 5.0), (0.0, 5.1)], LEAD, 10, smooth=False,
           around=2, vlen=2.0)
for i in range(6):
    t = math.tau * i / 6
    fr.face([(DU + 1.78 * math.cos(t) - x * math.sin(t), DW + 1.78 * math.sin(t) + x * math.cos(t), z) for x, z in
             ((-0.3, 39.2), (0.3, 39.2), (0.3, 41.0), (0.0, 41.3), (-0.3, 41.0))], GLASS)
rot_box(fr, DU, DW, 43.7, 0.08, 0.08, 1.8, 0.0, GOLD)
rot_box(fr, DU, DW, 44.9, 0.8, 0.08, 0.08, 0.0, GOLD)
for tw in (6.3, -7.9):                                                                   # the two bell turrets
    tu = 63.1
    fr.box(tu, tw, 22.0, 3.2, 3.2, 8.0, BRICK)
    for k in range(4):
        th = k * H
        pl = Plane(fr, tu + 1.6 * math.cos(th) + 1.6 * math.sin(th), tw + 1.6 * math.sin(th) - 1.6 * math.cos(th), th + H)
        pl.poly([(0.9, 27.5), (2.3, 27.5)] + arch_curve('round', 0.9, 2.3, 29.0, None, 6)[::-1], GLASS, 0.03)
        pl.block(-0.1, 29.9, 3.3, 30.2, -0.1, 0.15, WHITE)
    fr.revolve(tu, tw, 30.2, [(1.4, 0.0), (1.55, 0.6), (1.25, 1.5), (0.6, 2.3), (0.25, 2.8), (0.0, 2.85)], LEAD, 10, smooth=True, around=2, vlen=1.5)
    rot_box(fr, tu, tw, 33.0, 0.07, 0.07, 1.2, 0.0, GOLD)

# ------------------------------------------------------------------------------------------ Palladio's facade
F = Plane(fr, 0.0, 17.4, -H)                     # s = 17.4 - w, facing the Bacino
C = 17.4 - W0                                    # its centre (s)
F.quad(0.0, -0.3, 34.9, 14.0, WHITE, 0.02)
F.block(-0.2, 12.7, 35.1, 14.0, 0.0, 0.45, WHITE)                                    # cornice of the lower order
for s in (C - 9.25, C - 8.15, C + 8.15, C + 9.25, 0.6, 34.3):                       # pilasters of the lower order
    F.block(s - 0.45, 0.6, s + 0.45, 12.7, 0.0, 0.3, WHITE)
for s0, s1, up in ((-0.2, C - 9.6, 1), (C + 9.6, 35.1, -1)):                         # the half-pediments
    tri = [(s0, 14.0), (s1, 14.0), (s1, 19.6)] if up > 0 else [(s0, 14.0), (s1, 14.0), (s0, 19.6)]
    F.slab(tri, WHITE, -0.2, 0.4)
    statue_s = s0 + 0.6 if up > 0 else s1 - 0.6
    u, w, _ = F.L(statue_s, 0.0, 0.1)
    figure(fr, u, w, 14.0, 2.1, WHITE, seg=5)
F.quad(C - 9.6, 14.0, C + 9.6, 22.0, WHITE, 0.02)                                     # the giant order's upper wall
for s in (C - 6.9, C - 2.9, C + 2.9, C + 6.9):                                       # pedestals and giant columns
    F.block(s - 0.95, 0.6, s + 0.95, 4.0, 0.0, 1.0, WHITE)
    u, w, _ = F.L(s, 0.0, 0.5)
    fr.cyl(u, w, 4.0, 0.72, 15.2, WHITE, seg=12, cap=False)
    rot_box(fr, u, w, 19.2, 1.8, 1.8, 0.9, F.ang, WHITE)
F.block(C - 9.8, 20.1, C + 9.8, 22.0, -0.1, 1.15, WHITE)                             # entablature
F.slab([(C - 9.8, 22.0), (C + 9.8, 22.0), (C, 27.0)], WHITE, -0.1, 1.0)              # pediment
vkit.disc(F, C, 23.6, 0.7, MARBLE, 1.03, n=10)
for s, z, h in ((C, 26.9, 2.6), (C - 9.4, 22.0, 2.2), (C + 9.4, 22.0, 2.2)):
    u, w, _ = F.L(s, 0.0, 0.5)
    rot_box(fr, u, w, z, 0.7, 0.7, 0.4, F.ang, WHITE)
    figure(fr, u, w, z + 0.4, h, WHITE, seg=6)
door = arch_curve('round', C - 1.5, C + 1.5, 6.6, None, 8)
F.poly([(C - 1.5, 0.6), (C + 1.5, 0.6)] + door[::-1], DOOR, 0.05)
F.block(C - 2.1, 8.1, C + 2.1, 8.6, 0.0, 0.3, WHITE)
F.slab([(C - 2.2, 8.6), (C + 2.2, 8.6), (C, 9.9)], WHITE, 0.0, 0.3)
for s in (C - 4.9, C + 4.9):                                                         # niches with statues (two tiers)
    for z0 in (4.6, 11.2):
        F.poly([(s - 0.7, z0), (s + 0.7, z0)] + arch_curve('round', s - 0.7, s + 0.7, z0 + 2.6, None, 6)[::-1], STONE, 0.04)
        u, w, _ = F.L(s, 0.0, 0.3)
        figure(fr, u, w, z0 + 0.1, 2.5, WHITE, seg=5)
for s in (4.6, 30.3):                                                                # the side bays' niches (doges' tombs)
    F.poly([(s - 1.2, 4.8), (s + 1.2, 4.8)] + arch_curve('round', s - 1.2, s + 1.2, 9.0, None, 6)[::-1], STONE, 0.04)
    F.block(s - 1.0, 4.8, s + 1.0, 6.4, 0.04, 0.6, MARBLE)
for k in range(5):                                                                   # steps to the campo
    F.block(C - 10.5 + k * 0.1, -0.3, C + 10.5 - k * 0.1, 0.6 - k * 0.15, 0.0, 1.0 + k * 0.45, STONE)
vkit.emit(ctx, g, 'w138804537_San_Giorgio', samples=[fr.P(u, w)[:2] for u, w in ((-1.0, -15.0), (-1.0, 15.0), (30.0, 0.0))])
print(f'  [custom] San Giorgio Maggiore: {vkit.tris(g)} triangles', flush=True)

# ------------------------------------------------------------------------------------------ the campanile
g2 = Geo()
cf = Frame(g2, *fr.P(75.5, 22.4)[:2], fr.a)
S = 4.4
cf.box(0.0, 0.0, -0.3, 2 * S, 2 * S, 41.3, BRICK, uvscale=2.0)
for k in range(4):
    th = k * H
    pl = Plane(cf, S * math.cos(th) + S * math.sin(th), S * math.sin(th) - S * math.cos(th), th + H)
    for s0 in (0.0, 2 * S - 0.7):
        pl.block(s0, 0.0, s0 + 0.7, 41.0, 0.0, 0.15, BRICK)                              # corner pilasters
    pl.block(-0.1, 0.0, 2 * S + 0.1, 1.2, 0.0, 0.25, WHITE)
    for z in (9.0, 18.0, 27.0, 35.0):
        pl.poly([(S - 0.3, z), (S + 0.3, z), (S + 0.3, z + 1.2), (S, z + 1.45), (S - 0.3, z + 1.2)], GLASS, 0.03)
    pl.block(-0.15, 40.6, 2 * S + 0.15, 41.3, -0.1, 0.3, WHITE)
    # belfry: white, three arched openings per side between pilasters
    arched_wall(pl, 0.0, 2 * S, 41.3, 50.2, [(1.0 + j * 2.4, 2.6 + j * 2.4, 43.6, 47.6, 'round', None) for j in range(3)], WHITE, 0.7, WHITE,
                back=GLASS, n=6)
    for j in range(4):
        u, w, _ = pl.L(0.6 + j * 2.4 + 0.2, 0.0, 0.2)
        rot_box(cf, u, w, 43.6, 0.35, 0.35, 4.0, th, WHITE)
cf.cornice([(-S, -S), (S, -S), (S, S), (-S, S)], 50.2, 0.8, 0.4, WHITE)
for p, q in (((-S, -S), (S, -S)), ((S, -S), (S, S)), ((S, S), (-S, S)), ((-S, S), (-S, -S))):
    balustrade(cf, p, q, 51.0, 0.95, 0.5, WHITE, posts=4.4)
for sx, sy in ((-1, -1), (1, -1), (1, 1), (-1, 1)):                                       # corner pinnacles
    cf.revolve(sx * (S - 0.3), sy * (S - 0.3), 51.0, [(0.3, 0.0), (0.3, 0.8), (0.0, 1.8)], WHITE, 6, smooth=False, around=1, vlen=1.0)
cf.revolve(0.0, 0.0, 51.0, [(3.3, 0.0), (3.3, 5.3), (3.6, 5.5), (3.6, 6.0)], BRICK, 8, smooth=False, a0=math.pi / 8, around=8, vlen=2.0)
for i in range(8):
    t = math.tau * i / 8
    cf.face([(3.32 * math.cos(t) - x * math.sin(t), 3.32 * math.sin(t) + x * math.cos(t), z) for x, z in
             ((-0.45, 52.4), (0.45, 52.4), (0.45, 54.6), (0.0, 55.0), (-0.45, 54.6))], WHITE)
cf.revolve(0.0, 0.0, 57.0, [(3.4, 0.0), (2.6, 2.0), (1.4, 7.0), (0.6, 11.5), (0.15, 13.9), (0.0, 14.0)], COPPER, 16, smooth=True, around=4, vlen=3.0)
cf.cyl(0.0, 0.0, 70.8, 0.3, 0.5, GOLD, seg=6)
vkit.winged_figure(cf, 0.0, 0.0, 71.3, 3.4, BRONZE, a=-H)
vkit.emit(ctx, g2, 'w138804537_San_Giorgio_campanile', samples=[cf.P(0.0, 0.0)[:2]])
print(f'  [custom] San Giorgio campanile: {vkit.tris(g2)} triangles', flush=True)
