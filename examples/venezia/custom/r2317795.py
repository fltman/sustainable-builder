"""Punta della Dogana – the Dogana da Mar (OSM relation 2317795; Giuseppe Benoni, 1677–82). This script
replaces the generated building. References in ../references/dogana/.

- The long triangular customs warehouse on the point between the Grand Canal and the Giudecca canal:
  rusticated walls of white Istrian stone with rows of arched windows, three great arched gates at the
  western end of the canal side, a brick parapet above the cornice, tiled roofs behind it.
- At the point, facing the Bacino: the rusticated Doric portico under a parapet of stone blocks and the
  square tower with masks under its cornice, crowned by two bronze Atlases carrying the golden globe
  with the figure of Fortune as a weathervane (Bernardo Falconi), ~26 m.
"""
import inspect
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(inspect.currentframe().f_code.co_filename), 'lib'))
import vkit  # noqa: E402
from vkit import BRICK, GLASS, GOLD, STONE, WHITE, Frame, Plane, arch_curve, figure, rot_box  # noqa: E402

RUST = 'M_Wall_Stone_limestone_Blank'      # rusticated Istrian stone
BRONZE = 'M_Roof_Metal_patina'
TILES = 'M_Roof_Tiles_red'
g = ctx.geo
fr = Frame(g, 0.0, 0.0, 0.0)
ring = vkit.ccw([tuple(p) for p in ctx.footprint['outer']])
TIP = (-44.5, -454.1)                      # the point, facing the Bacino
ZC, ZP = 9.4, 11.4                         # cornice, top of the parapet

n = len(ring)
for i in range(n):
    p, q = ring[i], ring[(i + 1) % n]
    L = math.dist(p, q)
    if L < 0.3:
        continue
    pl = Plane(fr, p[0], p[1], math.atan2(q[1] - p[1], q[0] - p[0]))
    near_tip = min(math.dist(p, TIP), math.dist(q, TIP)) < 12.0
    portico = max(math.dist(p, TIP), math.dist(q, TIP)) < 4.6           # the open portico at the point (drawn below)
    pl.quad(0.0, 7.4 if portico else -0.3, L, ZC, RUST, 0.0, uvscale=2.4)
    pl.block(-0.05, ZC, L + 0.05, ZC + 0.5, 0.0, 0.35, WHITE)
    if near_tip:                                                            # white parapet of stone blocks at the point
        pl.quad(0.0, ZC + 0.5, L, ZC + 1.1, WHITE, 0.0)
        for k in range(int(L / 1.2)):
            s = (k + 0.5) * L / int(L / 1.2)
            pl.block(s - 0.3, ZC + 1.1, s + 0.3, ZP, -0.15, 0.15, WHITE)
    else:
        pl.quad(0.0, ZC + 0.5, L, ZP, BRICK, 0.0, uvscale=2.0)
        pl.block(-0.05, ZP - 0.15, L + 0.05, ZP, 0.0, 0.12, WHITE)
    if L > 15.0 and not near_tip:                                           # rows of arched windows
        k = int((L - 4.0) / 6.0)
        for j in range(k):
            c = 2.0 + (j + 0.5) * (L - 4.0) / k
            frame = [(c - 0.95, 3.6), (c + 0.95, 3.6)] + arch_curve('round', c - 0.95, c + 0.95, 6.3, None, 6)[::-1]
            win = [(c - 0.7, 3.8), (c + 0.7, 3.8)] + arch_curve('round', c - 0.7, c + 0.7, 6.3, None, 6)[::-1]
            pl.poly(frame, WHITE, 0.03)
            pl.poly(win, GLASS, 0.06)
# the three great arched gates at the western end of the canal side
north = max(((ring[i], ring[(i + 1) % n]) for i in range(n)), key=lambda e: math.dist(*e) if e[0][1] > -452 and e[1][1] > -452 else 0)
p, q = north
L = math.dist(p, q)
pl = Plane(fr, p[0], p[1], math.atan2(q[1] - p[1], q[0] - p[0]))
west_end = 0.0 if p[0] < q[0] else L
for j in range(3):
    c = abs(west_end - (4.0 + j * 5.6))
    pl.poly([(c - 1.6, 0.0), (c + 1.6, 0.0)] + arch_curve('round', c - 1.6, c + 1.6, 4.6, None, 8)[::-1], WHITE, 0.07)
    pl.poly([(c - 1.25, 0.0), (c + 1.25, 0.0)] + arch_curve('round', c - 1.25, c + 1.25, 4.6, None, 8)[::-1], 'M_Roof_Metal_black', 0.1)
# the roof behind the parapets (tiles), the courtyard left out for simplicity
fr.face([(x, y, ZP - 0.4) for x, y in vkit.offset_ring(ring, -0.3)], TILES, uvscale=3.0)

# ------------------------------------------------------------------------------------------ the point: portico and tower
tf = Frame(g, -48.95, -454.8, math.radians(8.7))       # u out through the point (to the Bacino)
front = Plane(tf, 4.45, -4.1, math.pi / 2)            # the portico's face at the point (faces the Bacino), s from south to north
front.quad(0.0, 0.0, 8.2, 7.4, 'M_Wall_Stone_grey_Blank', -1.8)   # the shaded back wall of the loggia
for s in (0.0, 8.2):
    front.block(s - 0.7, 0.0, s + 0.7, 7.4, -1.8, 0.2, RUST)
for s in (2.1, 4.1, 6.1):                              # Doric columns
    u, w, _ = front.L(s, 0.0, -0.6)
    tf.cyl(u, w, 0.0, 0.55, 6.4, WHITE, seg=12, cap=False)
    rot_box(tf, u, w, 6.4, 1.35, 1.35, 0.5, 0.0, WHITE)
front.block(-0.8, 6.9, 9.0, 8.2, -1.8, 0.35, WHITE)    # entablature
T = 3.5
tf.box(-0.5, 0.0, ZP - 1.5, 2 * T, 2 * T, 18.6 - ZP + 1.5, RUST, uvscale=2.4)
for k in range(4):
    th = k * math.pi / 2
    pl = Plane(tf, -0.5 + T * math.cos(th) + T * math.sin(th), T * math.sin(th) - T * math.cos(th), th + math.pi / 2)
    pl.quad(T - 0.6, 13.2, T + 0.6, 15.6, GLASS, 0.03)
    for s in (0.8, 2.3, 4.7, 6.2):                    # the masks under the cornice
        pl.poly([(s - 0.2, 17.6), (s + 0.2, 17.6), (s + 0.25, 18.1), (s, 18.35), (s - 0.25, 18.1)], WHITE, 0.12)
tf.cornice([(-0.5 - T, -T), (-0.5 + T, -T), (-0.5 + T, T), (-0.5 - T, T)], 18.6, 0.8, 0.5, WHITE)
tf.box(-0.5, 0.0, 19.4, 4.4, 4.4, 0.6, WHITE)
tf.box(-0.5, 0.0, 20.0, 3.2, 3.2, 0.5, STONE)
for x in (-1.0, 1.0):                                  # two kneeling Atlases carrying the globe
    tf.revolve(-0.5, x, 20.5, [(0.0, 0.0), (0.42, 0.0), (0.38, 0.8), (0.3, 1.25), (0.18, 1.5), (0.0, 1.6)], BRONZE, 6, smooth=True, around=1, vlen=1.0)
    tf.face([(-0.5, x * 0.7, 21.6), (-0.5, x * 0.25, 22.2), (-0.35, x * 0.25, 22.2), (-0.35, x * 0.7, 21.6)], BRONZE)
tf.revolve(-0.5, 0.0, 21.2, [(0.0, 0.0), (0.7, 0.18), (1.12, 0.65), (1.3, 1.3), (1.12, 1.95), (0.7, 2.42), (0.0, 2.6)], GOLD, 16, smooth=True,
           around=2, vlen=2.0)
figure(tf, -0.5, 0.0, 23.75, 2.2, BRONZE, seg=6)       # Fortune on one foot, her sail turning with the wind
tf.face([(-0.45, 0.25, 24.6), (-0.45, 1.3, 24.9), (-0.45, 1.25, 26.3), (-0.45, 0.3, 26.0)], GOLD)
tf.face([(-0.45, 0.25, 24.6), (-0.45, 1.3, 24.9), (-0.45, 1.25, 26.3), (-0.45, 0.3, 26.0)][::-1], GOLD)
print(f'  [custom] Punta della Dogana: {vkit.tris(g)} triangles', flush=True)
