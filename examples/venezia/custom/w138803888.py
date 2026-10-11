"""Procuratie Nuove (OSM way 138803888 with its 13 building:parts, hidden in overrides.json; Vincenzo
Scamozzi from 1582, finished by Baldassare Longhena 1640), the south side of the Piazza. Free-standing
(the outline itself is no generated building).

- The 128 m front on the Piazza continues Sansovino's Libreria and adds a third storey: the Doric
  arcade with half-columns over the portico and its shops, the Doric frieze; the Ionic storey with
  arched windows between little columns and balustrades; the Corinthian storey with windows under
  alternating triangular and segmental pediments; the cornice; white Istrian stone. 34 bays (OSM: the
  mapped columns stand ≈3.75 m apart).
- Behind: the courtyard wings of the OSM outline (simplified) in plaster with windows, tiled roofs.
References: ../references/marciana/ (the same orders on the Libreria).
"""
import inspect
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(inspect.currentframe().f_code.co_filename), 'lib'))
import vkit  # noqa: E402
from vkit import GLASS, STONE, WHITE, Frame, Plane, arch_curve, arched_wall, balustrade  # noqa: E402

MARBLE = 'M_Wall_Stone_limestone_Blank'
BACK = 'M_Wall_Plaster_ivory_Upper'
DARK = 'M_Wall_Stone_grey_Blank'
TILES = 'M_Roof_Tiles_red'
g = Geo()
N0, N1 = (0.62, -171.28), (119.86, -124.21)
L = math.dist(N0, N1)
fr = Frame(g, N0[0], N0[1], math.atan2(N1[1] - N0[1], N1[0] - N0[0]))   # u along the front (W -> E), w out to the Piazza
Z1, Z2, Z3, Z4, ZC = 7.0, 8.6, 14.0, 15.2, 21.0
N = 34
bay = L / N

front = Plane(fr, L, 0.0, math.pi)                     # faces the Piazza; s from the east end (the Libreria)
ops = [(k * bay + 0.68, (k + 1) * bay - 0.68, 0.0, 4.8, 'round', None) for k in range(N)]
arched_wall(front, 0.0, L, 0.0, Z1, ops, WHITE, 0.9, WHITE, n=8)
G = 5.2
fr.face([front.L(0.0, 6.4, -0.9), front.L(L, 6.4, -0.9), front.L(L, 6.4, -G), front.L(0.0, 6.4, -G)][::-1], DARK)
front.quad(0.0, -0.3, L, 3.6, GLASS, -G)
front.quad(0.0, 3.6, L, 6.4, DARK, -G)
for s_, sg in ((0.0, -1.0), (L, 1.0)):
    fr.face_toward([front.L(s_, -0.3, -0.9), front.L(s_, -0.3, -G), front.L(s_, 6.4, -G), front.L(s_, 6.4, -0.9)], WHITE, vkit._toward(front, -sg, 0.0))
for k in range(N):
    c = (k + 0.5) * bay
    front.block(c - 1.4, 3.6, c + 1.4, 3.85, -G, -G + 0.1, WHITE)
    vkit.arch_band(front, c - bay / 2 + 0.68, c + bay / 2 - 0.68, 4.8, 'round', None, 0.28, WHITE, 0.0, 0.15, n=8)
for k in range(N + 1):                                 # Doric half-columns
    u, w, _ = front.L(k * bay, 0.0, 0.3)
    fr.cyl(u, w, 0.3, 0.4, Z1 - 0.3, WHITE, seg=10, cap=False)
front.block(-0.1, Z1, L + 0.1, Z2, 0.0, 0.6, WHITE)                    # Doric entablature
for k in range(2 * N):
    vkit.disc(front, (k + 0.5) * bay / 2, Z1 + 0.85, 0.26, MARBLE, 0.62, n=8)
# Ionic storey
front.quad(0.0, Z2, L, Z3, WHITE, 0.0)
for k in range(N):
    c = (k + 0.5) * bay
    front.poly([(c - 0.9, 9.7), (c + 0.9, 9.7)] + arch_curve('round', c - 0.9, c + 0.9, 12.5, None, 8)[::-1], GLASS, 0.03)
    vkit.arch_band(front, c - 0.9, c + 0.9, 12.5, 'round', None, 0.24, WHITE, 0.0, 0.14, n=8)
    a_, b_ = front.L(c - 1.5, 0.0, 0.45), front.L(c + 1.5, 0.0, 0.45)
    balustrade(fr, a_[:2], b_[:2], Z2 + 0.05, 1.0, 0.36, WHITE)
for k in range(N + 1):
    u, w, _ = front.L(k * bay, 0.0, 0.28)
    fr.cyl(u, w, Z2, 0.34, Z3 - Z2, WHITE, seg=10, cap=False)
front.block(-0.15, Z3, L + 0.15, Z4, 0.0, 0.45, WHITE)                  # Ionic entablature
# Corinthian storey: windows under alternating pediments
front.quad(0.0, Z4, L, 20.2, WHITE, 0.0)
for k in range(N):
    c = (k + 0.5) * bay
    front.quad(c - 0.7, 16.0, c + 0.7, 18.5, GLASS, 0.03)
    front.block(c - 0.95, 15.8, c + 0.95, 16.0, 0.0, 0.2, WHITE)
    if k % 2:
        front.slab([(c - 1.05, 18.6), (c + 1.05, 18.6), (c, 19.35)], WHITE, 0.0, 0.25)
    else:
        front.slab([(c - 1.05, 18.6), (c + 1.05, 18.6)] + [(c + 1.05 * math.cos(math.pi * i / 6), 18.6 + 0.55 * math.sin(math.pi * i / 6)) for i in range(1, 6)],
                   WHITE, 0.0, 0.25)
for k in range(N + 1):
    front.block(k * bay - 0.3, Z4, k * bay + 0.3, 20.2, 0.0, 0.22, WHITE)   # Corinthian pilasters
front.block(-0.3, 20.2, L + 0.3, ZC, -0.1, 0.8, WHITE)                  # cornice

# ------------------------------------------------------------------------------------------ the block behind
RING = [(-5.17, -179.68), (-6.75, -173.46), (0.62, -171.28), (119.86, -124.21), (126.0, -139.76), (-6.37, -191.38), (-2.84, -201.01),
        (9.83, -196.18), (6.29, -186.52), (14.21, -183.44), (17.85, -193.1), (27.4, -189.46), (23.82, -179.69), (31.74, -176.6),
        (35.34, -186.42), (45.19, -182.63), (41.52, -172.82), (48.94, -169.91), (52.67, -179.75), (62.68, -175.87), (59.0, -166.02),
        (66.52, -163.06), (70.19, -173.04), (80.23, -169.16), (76.45, -159.13), (84.37, -156.05), (88.22, -166.1), (104.95, -159.58),
        (101.17, -149.54), (112.13, -145.25), (115.99, -155.29), (130.0, -149.94), (131.47, -153.69), (103.83, -164.8), (107.4, -174.26),
        (-11.87, -212.74), (-21.4, -185.76)]
mf = Frame(g, 0.0, 0.0, 0.0)
ring = vkit.ccw(RING)
for p, q in zip(ring, ring[1:] + ring[:1]):
    if {p, q} == {N0, N1}:
        continue
    Lw = math.dist(p, q)
    if Lw < 0.3:
        continue
    pl = Plane(mf, p[0], p[1], math.atan2(q[1] - p[1], q[0] - p[0]))
    nb = max(1, round(Lw / 3.2))
    mf.face([pl.L(0.0, -0.3), pl.L(Lw, -0.3), pl.L(Lw, ZC - 2.0), pl.L(0.0, ZC - 2.0)], BACK, [(0, -0.1), (nb, -0.1), (nb, 6.3), (0, 6.3)])
mf.face([(x, y, ZC - 2.05) for x, y in ring], TILES, uvscale=3.0)
fr.prism([(-0.2, -0.2), (L + 0.2, -0.2), (L + 0.2, -16.0), (-0.2, -16.0)], ZC - 2.0, ZC, WHITE, top=False)
vkit.hip_roof(fr, -0.3, L + 0.3, -16.2, 0.3, ZC, 3.8, TILES, hip=(True, True))
vkit.emit(ctx, g, 'w138803888_Procuratie_Nuove', samples=[N0, N1, ((N0[0] + N1[0]) / 2, (N0[1] + N1[1]) / 2)])
print(f'  [custom] Procuratie Nuove: {vkit.tris(g)} triangles', flush=True)
