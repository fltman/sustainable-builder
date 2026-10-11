"""Biblioteca Marciana – the Libreria Sansoviniana (OSM way 206333242; Jacopo Sansovino 1537–53, finished
by Scamozzi 1588) – and the Zecca, the Mint, on the Molo (its building:parts hidden in overrides.json).
References in ../references/marciana/.

- The Libreria along the Piazzetta, facing the Doge's Palace: 21 bays (83 m, OSM), two storeys of white
  Istrian stone – a Doric ground-floor arcade with half-columns and lion keystones, the Doric frieze;
  above, the Ionic storey with arched windows between little columns, a balustrade in each bay; the
  deep frieze with oval windows between putti and garlands; the cornice and the roof balustrade with a
  statue over every column, obelisks at the corners; three bays on the short ends; lead hipped roof.
- The Zecca on the Molo: nine bays and three heavily rusticated storeys – arcade, Doric windows under
  heavy lintels, Ionic windows with pediments – lead roof with its small lantern.
- The inner block between them (reading rooms round a skylit hall) in plain white stone with windows.
"""
import inspect
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(inspect.currentframe().f_code.co_filename), 'lib'))
import vkit  # noqa: E402
from vkit import GLASS, LEAD, STONE, WHITE, Frame, Plane, arch_curve, arched_wall, balustrade, figure, rot_box  # noqa: E402

MARBLE = 'M_Wall_Stone_limestone_Blank'
WINWALL = 'M_Wall_Stone_limestone_Upper'
DARK = 'M_Wall_Stone_grey_Blank'
g = Geo()
P0 = (131.21, -120.08)
LEN = 83.13
fr = Frame(g, P0[0], P0[1], math.atan2(-0.9308, 0.3656))   # u along the Piazzetta front (N -> S), w out to the Piazzetta
DEPTH = 12.07
Z1, Z2, Z3, Z4, Z5 = 7.0, 8.6, 14.0, 16.3, 16.9           # Doric entablature, upper floor, Ionic frieze, cornice, roof balustrade


def libreria_front(pl, L, n, corner_obelisks=True):
    """The Libreria's two storeys over L metres of plane pl with n bays."""
    bay = L / n
    ops = [(k * bay + 0.72, (k + 1) * bay - 0.72, 0.0, 5.0, 'round', None) for k in range(n)]
    arched_wall(pl, 0.0, L, 0.0, Z1, ops, WHITE, 0.9, WHITE, n=8)
    G = 4.6                                                                  # the portico behind the arches
    fr.face([pl.L(0.0, 6.5, -0.9), pl.L(L, 6.5, -0.9), pl.L(L, 6.5, -G), pl.L(0.0, 6.5, -G)][::-1], DARK)
    pl.quad(0.0, -0.3, L, 3.6, GLASS, -G)
    pl.quad(0.0, 3.6, L, 6.5, DARK, -G)
    for k in range(n):                                                       # shop fronts in each bay
        c = (k + 0.5) * bay
        pl.block(c - 1.4, 3.6, c + 1.4, 3.85, -G, -G + 0.1, WHITE)
    for s_, sg in ((0.0, -1.0), (L, 1.0)):
        fr.face_toward([pl.L(s_, -0.3, -0.9), pl.L(s_, -0.3, -G), pl.L(s_, 6.5, -G), pl.L(s_, 6.5, -0.9)], WHITE, vkit._toward(pl, -sg, 0.0))
    for a, b, *_ in ops:
        vkit.arch_band(pl, a, b, 5.0, 'round', None, 0.3, WHITE, 0.0, 0.16, n=8)
        c = (a + b) / 2
        pl.poly([(c - 0.32, 6.0), (c + 0.32, 6.0), (c + 0.24, 6.75), (c - 0.24, 6.75)], WHITE, 0.3)      # lion keystone
    for k in range(n + 1):                                                   # Doric half-columns
        u, w, _ = pl.L(k * bay, 0.0, 0.32)
        fr.cyl(u, w, 0.3, 0.42, Z1 - 0.3, WHITE, seg=10, cap=False)
    pl.block(-0.1, Z1, L + 0.1, Z2, 0.0, 0.62, WHITE)                       # Doric entablature
    for k in range(2 * n):                                                   # metopes with discs
        vkit.disc(pl, (k + 0.5) * bay / 2, Z1 + 0.85, 0.27, MARBLE, 0.64, n=8)
    # upper storey: arched windows between little columns, balconies, half-columns at the piers
    pl.quad(0.0, Z2, L, Z3, WHITE, 0.0)
    for k in range(n):
        c = (k + 0.5) * bay
        win = [(c - 0.95, 9.7), (c + 0.95, 9.7)] + arch_curve('round', c - 0.95, c + 0.95, 12.6, None, 8)[::-1]
        pl.poly(win, GLASS, 0.03)
        vkit.arch_band(pl, c - 0.95, c + 0.95, 12.6, 'round', None, 0.25, WHITE, 0.0, 0.14, n=8)
        for x in (-1.2, 1.2):
            u, w, _ = pl.L(c + x, 0.0, 0.18)
            fr.cyl(u, w, 9.7, 0.14, 2.9, WHITE, seg=6, cap=False)
        a_, b_ = pl.L(c - 1.6, 0.0, 0.5), pl.L(c + 1.6, 0.0, 0.5)
        balustrade(fr, a_[:2], b_[:2], Z2 + 0.05, 1.0, 0.36, WHITE)
        for x in (-1.0, 1.0):                                                # reclining figures in the spandrels
            pl.poly([(c + x * 1.15, 13.0), (c + x * 1.85, 13.0), (c + x * 1.85, 13.85), (c + x * 1.3, 13.55)][::(1 if x > 0 else -1)], MARBLE, 0.1)
    for k in range(n + 1):                                                   # Ionic half-columns
        u, w, _ = pl.L(k * bay, 0.0, 0.3)
        fr.cyl(u, w, Z2, 0.36, Z3 - Z2, WHITE, seg=10, cap=False)
        rot_box(fr, u, w, Z3 - 0.35, 0.9, 0.9, 0.35, pl.ang, WHITE)
        pl.block(k * bay - 0.45, Z2, k * bay + 0.45, Z2 + 1.05, 0.0, 0.62, WHITE)   # pedestals in the balustrade line
    pl.block(-0.15, Z3, L + 0.15, Z4, 0.0, 0.5, WHITE)                      # the deep frieze
    for k in range(n):
        c = (k + 0.5) * bay
        pl.poly([(c + 0.62 * math.cos(t), 15.15 + 0.3 * math.sin(t)) for t in (math.tau * i / 10 for i in range(10))], GLASS, 0.52)
        for x in (-1.0, 1.0):                                                # garlands and putti
            pl.poly([(c + x * 0.95, 14.6), (c + x * 1.75, 14.6), (c + x * 1.75, 15.6), (c + x * 1.35, 15.85), (c + x * 0.95, 15.6)][::(1 if x > 0 else -1)],
                    MARBLE, 0.55)
    pl.block(-0.35, Z4, L + 0.35, Z5, -0.1, 0.85, WHITE)                    # cornice
    a_, b_ = pl.L(0.0, 0.0, 0.25), pl.L(L, 0.0, 0.25)
    balustrade(fr, a_[:2], b_[:2], Z5, 1.1, 0.42, WHITE, posts=bay)
    for k in range(n + 1):                                                   # statues over the columns
        if corner_obelisks and k in (0, n):
            u, w, _ = pl.L(k * bay, 0.0, 0.25)
            rot_box(fr, u, w, Z5, 1.0, 1.0, 1.1, pl.ang, WHITE)
            fr.revolve(u, w, Z5 + 1.1, [(0.5, 0.0), (0.12, 3.6), (0.0, 3.8)], WHITE, 4, smooth=False, a0=pl.ang + math.pi / 4, around=1, vlen=2.0)
            continue
        u, w, _ = pl.L(k * bay, 0.0, 0.25)
        figure(fr, u, w, Z5 + 1.15, 2.1, WHITE, seg=5)


# ------------------------------------------------------------------------------------------ the Libreria
back = [(LEN, -DEPTH, -0.3), (0.0, -DEPTH, -0.3), (0.0, -DEPTH, Z5), (LEN, -DEPTH, Z5)]       # the plain back wall (west)
fr.face(back, WINWALL, [(0, -0.1), (round(LEN / 3.96), -0.1), (round(LEN / 3.96), 5.7), (0, 5.7)])
front = Plane(fr, LEN, 0.0, math.pi)                                         # facing the Piazzetta, s from the Molo end
libreria_front(front, LEN, 21)
libreria_front(Plane(fr, 0.0, 0.0, -math.pi / 2), DEPTH, 3)                  # north end (towards the Campanile)
libreria_front(Plane(fr, LEN, -DEPTH, math.pi / 2), DEPTH, 3)                # south end (on the Molo)
vkit.hip_roof(fr, 0.4, LEN - 0.4, -DEPTH + 0.4, -0.4, Z5, 3.4, LEAD, hip=(True, True))

# ------------------------------------------------------------------------------------------ the inner block and the annex
MID = [(129.52, -154.47), (140.74, -182.34), (117.28, -191.0), (108.61, -162.89)]
mf = Frame(g, 0.0, 0.0, 0.0)
mid = vkit.ccw(MID)
for p, q in zip(mid, mid[1:] + mid[:1]):
    L = math.dist(p, q)
    pl = Plane(mf, p[0], p[1], math.atan2(q[1] - p[1], q[0] - p[0]))
    nb = max(1, round(L / 3.4))
    mf.face([pl.L(0.0, -0.3), pl.L(L, -0.3), pl.L(L, 13.0), pl.L(0.0, 13.0)], WINWALL, [(0, -0.1), (nb, -0.1), (nb, 4.0), (0, 4.0)])
    pl.block(0.0, 13.0, L, 13.5, 0.0, 0.3, WHITE)
mf.face([(x, y, 13.5) for x, y in mid], LEAD)
sky = Frame(g, *(((127.05 + 135.43 + 123.09 + 114.7) / 4, (-161.48 - 184.17 - 188.75 - 166.08) / 4)), math.atan2(-184.17 + 161.48, 135.43 - 127.05))
vkit.hip_roof(sky, -12.0, 12.0, -6.6, 6.6, 13.5, 3.0, 'M_Roof_Metal_grey', hip=(True, True))
ANNEX = [(123.94, -213.43), (124.77, -213.08), (125.66, -215.52), (116.27, -219.04), (115.04, -215.89), (113.48, -211.78), (122.48, -208.67)]
mf.prism(vkit.ccw(ANNEX), -0.3, 6.0, WHITE, top=True, top_mat=STONE)

# ------------------------------------------------------------------------------------------ the Zecca
ZEC = [(117.06, -191.08), (123.94, -213.43), (149.49, -203.11), (140.99, -182.26)]
zf = Frame(g, 123.94, -213.43, math.atan2(10.32, 25.55))                    # u along the Molo front (W -> E)
ZL, ZT = 27.56, 19.0
zr = vkit.ccw(ZEC)
for p, q in zip(zr, zr[1:] + zr[:1]):                                       # side and back walls (the Molo front is drawn below)
    if {p, q} == {(123.94, -213.43), (149.49, -203.11)}:
        continue
    L = math.dist(p, q)
    pl = Plane(mf, p[0], p[1], math.atan2(q[1] - p[1], q[0] - p[0]))
    nbw = max(1, round(L / 3.1))
    mf.face([pl.L(0.0, -0.3), pl.L(L, -0.3), pl.L(L, ZT), pl.L(0.0, ZT)], WINWALL, [(0, -0.1), (nbw, -0.1), (nbw, 6.3), (0, 6.3)])
zp = Plane(zf, 0.0, 0.0, 0.0)                                               # the Molo front (faces south)
nb = 9
bay = ZL / nb
ops = [(k * bay + 0.6, (k + 1) * bay - 0.6, 0.0, 3.4, 'round', None) for k in range(nb)]
arched_wall(zp, 0.0, ZL, 0.0, 6.2, ops, WHITE, 0.6, WHITE, back=GLASS, n=6)
for z in (0.9, 1.8, 2.7, 3.6, 4.5, 5.4):                                   # rustication bands
    zp.block(0.0, z - 0.05, ZL, z + 0.05, 0.0, 0.08, STONE)
zp.block(-0.1, 6.2, ZL + 0.1, 6.9, 0.0, 0.45, WHITE)
zp.quad(0.0, 6.9, ZL, 12.4, WHITE, 0.0)
zp.quad(0.0, 13.0, ZL, ZT, WHITE, 0.0)
zp.block(-0.1, 12.4, ZL + 0.1, 13.0, 0.0, 0.4, WHITE)
for k in range(nb + 1):                                                     # banded columns
    s = k * bay
    zp.block(s - 0.38, 6.9, s + 0.38, 12.4, 0.0, 0.42, WHITE)
    for z in (7.6, 8.7, 9.8, 10.9):
        zp.block(s - 0.48, z, s + 0.48, z + 0.45, 0.0, 0.5, WHITE)
    zp.block(s - 0.3, 13.0, s + 0.3, 17.9, 0.0, 0.3, WHITE)
for k in range(nb):
    c = (k + 0.5) * bay
    zp.block(c - 0.95, 7.6, c + 0.95, 10.6, 0.0, 0.15, WHITE)               # heavy window frames
    zp.quad(c - 0.65, 7.85, c + 0.65, 10.2, GLASS, 0.17)
    zp.block(c - 1.05, 10.6, c + 1.05, 11.25, 0.0, 0.3, WHITE)             # lintel
    zp.quad(c - 0.6, 13.6, c + 0.6, 16.0, GLASS, 0.05)
    zp.block(c - 0.85, 13.4, c + 0.85, 13.6, 0.0, 0.2, WHITE)
    zp.slab([(c - 0.95, 16.2), (c + 0.95, 16.2), (c, 16.85)], WHITE, 0.0, 0.25)
zp.block(-0.3, 17.9, ZL + 0.3, ZT + 0.2, -0.1, 0.7, WHITE)                 # top cornice
zc = [(117.06, -191.08), (123.94, -213.43), (149.49, -203.11), (140.99, -182.26)]
cx, cy = sum(p[0] for p in zc) / 4, sum(p[1] for p in zc) / 4
cf = Frame(g, cx, cy, zf.a)
vkit.hip_roof(cf, -13.5, 13.5, -11.2, 11.2, ZT + 0.2, 4.6, LEAD, hip=(True, True))
cf.revolve(0.0, 0.0, ZT + 4.2, [(1.1, 0.0), (1.1, 1.6), (1.25, 1.75), (0.9, 2.4), (0.0, 2.9)], WHITE, 10, smooth=False, around=2, vlen=1.5)
vkit.emit(ctx, g, 'w206333242_Biblioteca_Marciana', samples=[(131.21, -120.08), (161.6, -197.46), (123.94, -213.43)])
print(f'  [custom] Biblioteca Marciana and Zecca: {vkit.tris(g)} triangles', flush=True)
