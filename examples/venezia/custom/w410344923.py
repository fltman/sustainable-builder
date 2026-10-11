"""Procuratie Vecchie (OSM way 410344923 with its 33 building:parts, hidden in overrides.json; Mauro
Codussi and Bartolomeo Bon, 1512–38), the north side of the Piazza. Free-standing (the outline itself is
no generated building).

- The 155 m front on the Piazza: the ground-floor arcade of 50 round arches on columns with the shops
  behind it, two storeys of 100 arched windows each between little columns, the cornice and the
  crown of white decorative merlons with ball finials; white Istrian stone, cream walls.
- Behind: the rest of the block (OSM outline, simplified) in plastered walls with windows, tiled roofs.
Photos: ../references/orologio/ (the Procuratie Vecchie flank the clock tower).
"""
import inspect
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(inspect.currentframe().f_code.co_filename), 'lib'))
import vkit  # noqa: E402
from vkit import GLASS, STONE, WHITE, Frame, Plane, arch_curve, arched_wall  # noqa: E402

CREAM = 'M_Wall_Plaster_ivory_Blank'
BACK = 'M_Wall_Plaster_ivory_Upper'
DARK = 'M_Wall_Stone_grey_Blank'
TILES = 'M_Roof_Tiles_red'
g = Geo()
F1, F0 = (-27.36, -119.91), (104.49, -38.57)
L = math.dist(F0, F1)
fr = Frame(g, F1[0], F1[1], math.atan2(F0[1] - F1[1], F0[0] - F1[0]))   # u along the front (W -> E), w into the block
Z1, Z2, Z3, ZC = 6.6, 11.4, 16.2, 16.8
N = 50

# ------------------------------------------------------------------------------------------ the front
front = Plane(fr, 0.0, 0.0, 0.0)                       # faces the Piazza
bay = L / N
ops = [(k * bay + 0.38, (k + 1) * bay - 0.38, 0.0, 4.4, 'round', None) for k in range(N)]
arched_wall(front, 0.0, L, 0.0, Z1, ops, WHITE, 0.5, WHITE, n=6)
G = 5.0
fr.face([front.L(0.0, 5.8, -0.5), front.L(L, 5.8, -0.5), front.L(L, 5.8, -G), front.L(0.0, 5.8, -G)][::-1], DARK)   # portico ceiling
front.quad(0.0, -0.3, L, 3.4, GLASS, -G)                                                                            # shop windows
front.quad(0.0, 3.4, L, 5.8, CREAM, -G)
for k in range(N + 1):                                 # columns between the arches
    u, w, _ = front.L(k * bay, 0.0, -0.25)
    fr.cyl(u, w, 0.0, 0.26, 4.4, WHITE, seg=8, cap=False)
for k in range(N):
    c = (k + 0.5) * bay
    front.block(c - 1.2, 3.4, c + 1.2, 3.6, -G, -G + 0.1, WHITE)
for s_, sg in ((0.0, -1.0), (L, 1.0)):
    fr.face_toward([front.L(s_, -0.3, -0.5), front.L(s_, -0.3, -G), front.L(s_, 5.8, -G), front.L(s_, 5.8, -0.5)], WHITE, vkit._toward(front, -sg, 0.0))
front.block(-0.1, Z1 - 0.35, L + 0.1, Z1, 0.0, 0.3, WHITE)
# two storeys of arched windows (two per bay) between little columns
for z0, z1 in ((Z1, Z2), (Z2, Z3)):
    front.quad(0.0, z0, L, z1, CREAM, 0.0)
    for k in range(2 * N):
        c = (k + 0.5) * bay / 2
        front.poly([(c - 0.48, z0 + 1.0), (c + 0.48, z0 + 1.0)] + arch_curve('round', c - 0.48, c + 0.48, z1 - 1.25, None, 5)[::-1], GLASS, 0.03)
        front.poly([(c - 0.62, z0 + 0.85), (c + 0.62, z0 + 0.85)] + arch_curve('round', c - 0.62, c + 0.62, z1 - 1.25, None, 5)[::-1], WHITE, 0.02)
    for k in range(2 * N + 1):
        front.block(k * bay / 2 - 0.12, z0 + 0.6, k * bay / 2 + 0.12, z1 - 0.6, 0.0, 0.16, WHITE)
    front.block(-0.1, z0, L + 0.1, z0 + 0.6, 0.0, 0.2, WHITE)          # sill band
    front.block(-0.1, z1 - 0.45, L + 0.1, z1, 0.0, 0.25, WHITE)        # cornice band
front.block(-0.2, Z3, L + 0.2, ZC, -0.2, 0.55, WHITE)
for k in range(2 * N):                                 # the crown of merlons with ball finials
    c = (k + 0.5) * bay / 2
    front.slab([(c - 0.32, ZC), (c + 0.32, ZC), (c + 0.32, ZC + 0.55), (c + 0.12, ZC + 0.75), (c, ZC + 1.05), (c - 0.12, ZC + 0.75),
                (c - 0.32, ZC + 0.55)], WHITE, 0.05, 0.3)
    u, w, _ = front.L(c, 0.0, 0.18)
    fr.revolve(u, w, ZC + 1.05, [(0.0, 0.0), (0.15, 0.1), (0.15, 0.25), (0.0, 0.35)], WHITE, 5, smooth=True, around=1, vlen=1.0)

# ------------------------------------------------------------------------------------------ the block behind
RING = [(104.49, -38.57), (-27.36, -119.91), (-30.0, -115.69), (-43.97, -120.54), (-47.9, -106.97), (-8.16, -78.08), (32.69, -53.79),
        (60.72, -33.32), (85.69, -17.41), (86.92, -19.37), (99.03, -11.92), (108.39, -26.45), (100.13, -31.47)]
mf = Frame(g, 0.0, 0.0, 0.0)
ring = vkit.ccw(RING)
for p, q in zip(ring, ring[1:] + ring[:1]):
    if {p, q} == {F0, F1}:
        continue
    Lw = math.dist(p, q)
    if Lw < 0.3:
        continue
    pl = Plane(mf, p[0], p[1], math.atan2(q[1] - p[1], q[0] - p[0]))
    nb = max(1, round(Lw / 3.2))
    mf.face([pl.L(0.0, -0.3), pl.L(Lw, -0.3), pl.L(Lw, ZC), pl.L(0.0, ZC)], BACK, [(0, -0.1), (nb, -0.1), (nb, ZC / 3.0), (0, ZC / 3.0)])
mf.face([(x, y, ZC - 0.05) for x, y in ring], TILES, uvscale=3.0)
vkit.hip_roof(fr, -0.3, L + 0.3, -0.3, 14.0, ZC, 3.6, TILES, hip=(True, True))
vkit.emit(ctx, g, 'w410344923_Procuratie_Vecchie', samples=[F0, F1, ((F0[0] + F1[0]) / 2, (F0[1] + F1[1]) / 2)])
print(f'  [custom] Procuratie Vecchie: {vkit.tris(g)} triangles', flush=True)
