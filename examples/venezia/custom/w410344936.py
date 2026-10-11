"""Procuratie Nuovissime – the Ala Napoleonica (OSM way 410344936 with its building:parts, hidden in
overrides.json; Giuseppe Maria Soli, 1807–14), closing the Piazza opposite the Basilica. Free-standing
(the outline itself is no generated building).

- The 63 m front on the Piazza repeats the Procuratie Nuove's lower two orders – the Doric arcade
  over the portico and the Ionic storey with arched windows and balustrades – and replaces the third
  storey with a tall attic carrying reliefs and a row of statues (Roman emperors and gods).
- The passage to the Museo Correr's staircase and the Calle de l'Ascension in the middle bay.
"""
import inspect
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(inspect.currentframe().f_code.co_filename), 'lib'))
import vkit  # noqa: E402
from vkit import GLASS, WHITE, Frame, Plane, arch_curve, arched_wall, balustrade, figure  # noqa: E402

MARBLE = 'M_Wall_Stone_limestone_Blank'
BACK = 'M_Wall_Plaster_ivory_Upper'
DARK = 'M_Wall_Stone_grey_Blank'
TILES = 'M_Roof_Tiles_red'
g = Geo()
A0, A1 = (-5.17, -179.68), (-26.34, -120.52)
L = math.dist(A0, A1)
fr = Frame(g, A0[0], A0[1], math.atan2(A1[1] - A0[1], A1[0] - A0[0]))   # u along the front (S -> N), w into the block (west)
Z1, Z2, Z3, Z4, ZA = 7.0, 8.6, 14.0, 15.2, 19.6
N = 17
bay = L / N
front = Plane(fr, 0.0, 0.0, 0.0)                       # faces the Piazza (east); s from the south end
ops = [(k * bay + 0.68, (k + 1) * bay - 0.68, 0.0, 4.8, 'round', None) for k in range(N)]
arched_wall(front, 0.0, L, 0.0, Z1, ops, WHITE, 0.9, WHITE, n=8)
G = 5.2
fr.face([front.L(0.0, 6.4, -0.9), front.L(L, 6.4, -0.9), front.L(L, 6.4, -G), front.L(0.0, 6.4, -G)][::-1], DARK)
front.quad(0.0, -0.3, L, 3.6, GLASS, -G)
front.quad(0.0, 3.6, L, 6.4, DARK, -G)
for k in range(N):
    c = (k + 0.5) * bay
    vkit.arch_band(front, c - bay / 2 + 0.68, c + bay / 2 - 0.68, 4.8, 'round', None, 0.28, WHITE, 0.0, 0.15, n=8)
for k in range(N + 1):
    u, w, _ = front.L(k * bay, 0.0, 0.3)
    fr.cyl(u, w, 0.3, 0.4, Z1 - 0.3, WHITE, seg=10, cap=False)
front.block(-0.1, Z1, L + 0.1, Z2, 0.0, 0.6, WHITE)
for k in range(2 * N):
    vkit.disc(front, (k + 0.5) * bay / 2, Z1 + 0.85, 0.26, MARBLE, 0.62, n=8)
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
front.block(-0.15, Z3, L + 0.15, Z4, 0.0, 0.45, WHITE)
# the attic: panels with reliefs between pilasters, cornice, statues over the pilasters
front.quad(0.0, Z4, L, ZA, WHITE, 0.0)
for k in range(N):
    c = (k + 0.5) * bay
    front.block(c - 1.3, 16.0, c + 1.3, 18.6, 0.0, 0.12, MARBLE)
for k in range(N + 1):
    front.block(k * bay - 0.3, Z4, k * bay + 0.3, ZA, 0.0, 0.25, WHITE)
front.block(-0.3, ZA, L + 0.3, ZA + 0.7, -0.1, 0.7, WHITE)
for k in range(1, N):
    u, w, _ = front.L(k * bay, 0.0, 0.3)
    figure(fr, u, w, ZA + 0.7, 2.2, WHITE, seg=5)
# the block behind
RING = [(-21.4, -185.76), (-41.28, -133.51), (-40.1, -133.06), (-43.97, -120.54), (-30.0, -115.69), (-26.34, -120.52), (-5.17, -179.68)]
mf = Frame(g, 0.0, 0.0, 0.0)
ring = vkit.ccw(RING)
for p, q in zip(ring, ring[1:] + ring[:1]):
    if {p, q} == {A0, A1}:
        continue
    Lw = math.dist(p, q)
    if Lw < 0.3:
        continue
    pl = Plane(mf, p[0], p[1], math.atan2(q[1] - p[1], q[0] - p[0]))
    nb = max(1, round(Lw / 3.2))
    mf.face([pl.L(0.0, -0.3), pl.L(Lw, -0.3), pl.L(Lw, ZA), pl.L(0.0, ZA)], BACK, [(0, -0.1), (nb, -0.1), (nb, 6.0), (0, 6.0)])
mf.face([(x, y, ZA) for x, y in ring], TILES, uvscale=3.0)
vkit.hip_roof(fr, -0.3, L + 0.3, -0.3, 14.5, ZA + 0.7, 3.2, TILES, hip=(True, True))
vkit.emit(ctx, g, 'w410344936_Ala_Napoleonica', samples=[A0, A1])
print(f'  [custom] Ala Napoleonica: {vkit.tris(g)} triangles', flush=True)
