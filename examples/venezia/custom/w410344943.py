"""Torre dell'Orologio (OSM way 410344943 with its building:parts, hidden in overrides.json; Mauro Codussi,
1496–99, wings raised by Massari in 1755). References in ../references/orologio/.

- The tower (6 m wide, 24 m, OSM) over the archway to the Mercerie: the great clock with its blue
  dial, gold stars and zodiac ring; the Madonna in her gold niche on a semicircular balcony between the
  blue panels of the hour and minute; the winged lion of St Mark on blue with gold stars; the roof
  terrace with its balustrade, the bell and the two bronze Moors who strike the hours.
- The two lateral wings (18 m): ground-floor arcade with shops, three storeys of paired windows with
  red-brown shutters, the balcony balustrade at the fourth storey and the roof balustrade; white
  Istrian stone.
Frontal photos (Zairon; Lucarelli) for the proportions.
"""
import inspect
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(inspect.currentframe().f_code.co_filename), 'lib'))
import vkit  # noqa: E402
from vkit import BLUE, GLASS, GOLD, STONE, WHITE, Frame, Plane, arch_curve, arched_wall, balustrade, figure, rot_box  # noqa: E402

H = math.pi / 2
SHUTTER = 'M_Wall_Plaster_red_Blank'
BRONZE = 'M_Roof_Metal_patina'
g = Geo()
fr = Frame(g, 114.65, -32.52, math.radians(31.65))       # u along the front (to the Basilica), w into the building; front faces the Piazza
T = 3.05                                                # half width of the tower
L0, L1 = -11.83, 10.67                                  # ends of the front
D = 7.5                                                 # depth of the wings
F = Plane(fr, L0, 0.0, 0.0)                             # the front: s = u - L0, faces the Piazza


def s(u):
    return u - L0


# ------------------------------------------------------------------------------------------ the wings
for a, b in ((L0, -T), (T, L1)):
    fr.prism([(a, 0.0), (b, 0.0), (b, D), (a, D)], 4.6, 18.4, WHITE, top=True, top_mat=STONE, bottom=True)
    fr.prism([(a, 2.6), (b, 2.6), (b, D), (a, D)], -0.3, 4.6, STONE, top=False)       # the shops behind the arcade
    n = 3
    bay = (b - a) / n
    ops = [(s(a) + k * bay + 0.35, s(a) + (k + 1) * bay - 0.35, 0.0, 3.0, 'round', None) for k in range(n)]
    arched_wall(F, s(a), s(b), 0.0, 4.6, ops, WHITE, 2.6, STONE, back=(3.0, GLASS, STONE), n=6, d=0.02)
    for k in range(n + 1):
        u, w, _ = F.L(s(a) + k * bay, 0.0, -0.35)
        fr.cyl(u, w, 0.0, 0.24, 3.4, WHITE, seg=8, cap=False)
    F.block(s(a), 4.5, s(b), 5.0, 0.0, 0.25, WHITE)
    for z0, z1, arched in ((5.8, 8.2, False), (9.6, 12.4, True), (15.4, 17.4, False)):        # paired windows, red shutters
        for k in range(2):
            c = s(a) + (b - a) * (k + 0.5) / 2
            for x in (-0.65, 0.65):
                lo, hi = c + x - 0.42, c + x + 0.42
                pts = [(lo, z0), (hi, z0)] + (arch_curve('round', lo, hi, z1 - 0.42, None, 4)[::-1] if arched else [(hi, z1), (lo, z1)])
                F.poly([(p[0], p[1]) for p in pts], SHUTTER, 0.04)
            F.block(c - 1.25, z0 - 0.25, c + 1.25, z0, 0.0, 0.2, WHITE)
    for z in (5.1, 13.0):                                                       # cornices
        F.block(s(a), z, s(b), z + 0.35, 0.0, 0.3, WHITE)
    F.block(s(a), 14.4, s(b), 14.8, 0.0, 0.9, WHITE)                            # the balcony at the fourth storey
    a_, b_ = F.L(s(a) + 0.2, 0.0, 0.75), F.L(s(b) - 0.2, 0.0, 0.75)
    balustrade(fr, a_[:2], b_[:2], 14.8, 1.0, 0.4, WHITE)
    a_, b_ = F.L(s(a), 0.0, -0.2), F.L(s(b), 0.0, -0.2)
    balustrade(fr, a_[:2], b_[:2], 18.4, 1.0, 0.45, WHITE, posts=2.5)
    for k in range(3):                                                          # pilasters between the bays
        pu = a + (b - a) * k / 2
        F.block(s(pu) - 0.25, 5.0, s(pu) + 0.25, 18.4, 0.0, 0.15, WHITE)

# ------------------------------------------------------------------------------------------ the tower
fr.prism([(-T, 0.0), (T, 0.0), (T, 8.4), (-T, 8.4)], -0.3, 22.7, WHITE, top=True, top_mat=STONE)
arch = arch_curve('round', s(-1.95), s(1.95), 5.25, None, 10)                # the archway to the Mercerie
F.poly([(s(-1.95), 0.0), (s(1.95), 0.0)] + arch[::-1], GLASS, 0.03)
vkit.arch_band(F, s(-1.95), s(1.95), 5.25, 'round', None, 0.4, WHITE, 0.0, 0.25, n=10)
for x in (-T + 0.3, T - 0.3):                                                # corner pilasters
    F.block(s(x) - 0.3, 0.0, s(x) + 0.3, 22.7, 0.0, 0.3, WHITE)
for z in (8.0, 14.3, 18.6, 22.2):                                            # cornices between the levels
    F.block(s(-T) - 0.2, z, s(T) + 0.2, z + 0.45, 0.0, 0.45, WHITE)
# the clock: zodiac ring, blue dial with stars, the sun hand
c, zc = s(0.0), 11.15
vkit.disc(F, c, zc, 2.45, WHITE, 0.32, n=24)
vkit.disc(F, c, zc, 2.15, GOLD, 0.34, n=24)
vkit.disc(F, c, zc, 1.85, BLUE, 0.36, n=24)
vkit.disc(F, c, zc, 1.05, 'M_Wall_Metal_blue_Blank', 0.37, n=16)
for i in range(12):                                                          # the zodiac signs, roman hours (gold on blue)
    t = math.tau * i / 12
    vkit.disc(F, c + 1.45 * math.cos(t), zc + 1.45 * math.sin(t), 0.2, GOLD, 0.38, n=6)
F.poly([(c - 0.06, zc), (c + 0.06, zc), (c + 0.04, zc + 1.7), (c - 0.04, zc + 1.7)], GOLD, 0.4)
F.poly([(c - 0.05, zc + 1.35), (c + 0.05, zc + 1.35), (c + 0.25, zc + 1.55), (c, zc + 1.8), (c - 0.25, zc + 1.55)], GOLD, 0.41)
for x, z in ((-2.3, 13.3), (2.3, 13.3), (-2.3, 9.0), (2.3, 9.0)):           # the small roundels round the clock
    vkit.disc(F, c + x, z, 0.32, GLASS, 0.32, n=8)
# the Madonna level: blue and gold ground, gold niche, hour and minute panels, semicircular balcony
F.quad(s(-2.4), 14.8, s(2.4), 18.5, BLUE, 0.32)
for i in range(18):
    x, z = -2.1 + (i % 6) * 0.84, 15.2 + (i // 6) * 1.15
    vkit.disc(F, c + x, z, 0.09, GOLD, 0.33, n=4)
F.quad(c - 0.75, 15.0, c + 0.75, 17.7, GOLD, 0.36)
F.poly([(c - 0.75, 17.7), (c + 0.75, 17.7)] + arch_curve('round', c - 0.75, c + 0.75, 17.7, None, 6)[::-1][1:-1], GOLD, 0.36)
u, w, _ = F.L(c, 0.0, 0.5)
figure(fr, u, w, 15.2, 1.9, GOLD, seg=6)
for x in (-1.6, 1.6):
    F.quad(c + x - 0.55, 15.6, c + x + 0.55, 16.6, 'M_Wall_Metal_blue_Blank', 0.38)
    F.quad(c + x - 0.25, 15.85, c + x + 0.25, 16.35, WHITE, 0.4)
half = [(math.cos(math.pi * i / 8), math.sin(math.pi * i / 8)) for i in range(9)]
bal = [F.L(c + 1.6 * hx, 14.7, 0.32 + 0.9 * hy) for hx, hy in half]          # the semicircular balcony
fr.face([bal[0], *bal[1:], ][::-1], WHITE)
for p, q in zip(bal, bal[1:]):
    fr.face([(p[0], p[1], 14.25), (q[0], q[1], 14.25), (q[0], q[1], 15.25), (p[0], p[1], 15.25)][::-1], WHITE)
# the lion of St Mark on blue with gold stars
F.quad(s(-2.5), 19.1, s(2.5), 22.1, BLUE, 0.32)
for i in range(24):
    x, z = -2.25 + (i % 8) * 0.64, 19.4 + (i // 8) * 1.0
    if abs(x) > 1.6 or z > 21.3:
        vkit.disc(F, c + x, z, 0.09, GOLD, 0.33, n=4)
lion = [(-1.6, 0.0), (1.4, 0.0), (1.6, 0.45), (1.1, 0.8), (1.5, 1.5), (0.6, 1.15), (0.3, 1.85), (-0.3, 1.0), (-1.2, 0.95), (-1.7, 0.4)]
F.poly([(c + x, 19.55 + y) for x, y in lion], WHITE, 0.36)
F.poly([(c + 0.2 + x * 0.5, 20.2 + y * 0.6) for x, y in ((0, 0), (1.6, 0.4), (1.9, 1.9), (0.4, 1.1))], GOLD, 0.38)   # the wing
# roof terrace: balustrade, bell on its frame, the two Moors
for p, q in (((-T, 0.15), (T, 0.15)), ((T, 0.15), (T, 8.2)), ((T, 8.2), (-T, 8.2)), ((-T, 8.2), (-T, 0.15))):
    balustrade(fr, p, q, 22.7, 0.9, 0.45, WHITE, posts=3.0)
for x in (-0.9, 0.9):
    rot_box(fr, x, 4.2, 22.7, 0.15, 0.15, 2.4, 0.0, BRONZE)
rot_box(fr, 0.0, 4.2, 25.0, 2.0, 0.15, 0.15, 0.0, BRONZE)
fr.revolve(0.0, 4.2, 24.0, [(0.0, 0.0), (0.75, 0.0), (0.62, 0.35), (0.45, 1.0), (0.2, 1.2), (0.0, 1.25)], BRONZE, 12)
fr.revolve(0.0, 4.2, 25.15, [(0.0, 0.0), (0.12, 0.0), (0.12, 0.5), (0.25, 0.6), (0.0, 0.85)], GOLD, 6)
for x, a in ((-2.0, 0.0), (2.0, math.pi)):
    figure(fr, x, 4.2, 22.7, 2.6, BRONZE, seg=6)
    rot_box(fr, x * 0.7, 4.2, 24.2, 1.3, 0.08, 0.08, 0.0, BRONZE)
vkit.emit(ctx, g, 'w410344943_Torre_dell_Orologio', samples=[fr.P(0.0, 0.5)[:2]])
print(f"  [custom] Torre dell'Orologio: {vkit.tris(g)} triangles", flush=True)
