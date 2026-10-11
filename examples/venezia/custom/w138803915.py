"""Palazzo Ducale (OSM way 138803915; its building:parts are hidden in overrides.json, so this script
draws the whole palace). References in ../references/palazzo-ducale/ (NOTES.md: sources and sizes).

- Plan from OSM: the Molo wing (71.5 m front, 26.5 m deep over the Sala del Maggior Consiglio), the
  Piazzetta wing (77 m front, 18 m deep), the east wing along the Rio di Palazzo continuing north past
  the Basilica to the Canonica, the courtyard (35 x 50 m) between them; the Porta della Carta and the
  Arco Foscari block towards the Basilica; the Scala dei Giganti.
- The two Gothic fronts (measured on a frontal photo of the lagoon side, Didier Descouens):
  ground-floor portico of white Istrian stone, 17 pointed arches on the lagoon side and 18 on the
  Piazzetta, on stout columns with big capitals; the loggia above with twice as many ogee arches on
  slender columns, a balustrade and a band of pierced quatrefoils; the upper wall in pink with a white
  lozenge lattice, tall pointed windows (two tracery windows on the lagoon side), quatrefoil oculi, the
  1404 balcony on the lagoon and the 1536 balcony on the Piazzetta, each under its tabernacle with
  Justice on top; the white cornice with Venetian merlons and spikes, corner pinnacles; lead hipped roofs.
- The courtyard: round-arched portico and pointed-arched loggia, brick upper walls on the west and
  south sides, Rizzo's white Renaissance front on the east, two bronze well-heads, the Scala dei
  Giganti with Mars and Neptune, the Arco Foscari's pinnacles.
- The Rio di Palazzo front: white Renaissance storeys of windows.
"""
import inspect
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(inspect.currentframe().f_code.co_filename), 'lib'))
import vkit  # noqa: E402
from vkit import (BRICK, GLASS, GOLD, LEAD, ROSE, STONE, WHITE, Frame, Plane, arch_curve, arched_wall, balustrade,  # noqa: E402
                  figure, quatrefoil, rot_box)

H, PI = math.pi / 2, math.pi
MARBLE = 'M_Wall_Stone_limestone_Blank'
UPPER_WIN = 'M_Wall_Stone_limestone_Upper'
DARK = 'M_Wall_Stone_grey_Blank'
BRONZE = 'M_Roof_Metal_patina'

g = Geo()
fr = Frame(g, 196.54, -166.8, math.radians(15.7))   # origin: the corner on the Molo and the Piazzetta; u east, w north
LM, LP = 73.6, 77.3                                  # Molo front, Piazzetta front
DM, DP = 26.5, 18.0                                  # depth of the Molo and the Piazzetta wing
ZP, ZL, ZU, ZC = 6.6, 13.6, 25.4, 25.9              # loggia floor, loggia top, cornice, cornice top
DEPTH = 4.5                                          # portico and loggia depth
CP = 1.7                                             # corner piers


# ------------------------------------------------------------------------------------------ the Gothic fronts
def gothic_front(pl, L, n, balcony, windows, oculi, tracery=(), corner0=True, corner1=True):
    """One of the two great fronts in plane pl (s along it, front facing out): portico, loggia, the pink
    upper wall with its lozenges, windows, oculi, balcony tabernacle, cornice and merlons."""
    bay = (L - 2 * CP) / n
    cols = [CP + k * bay for k in range(n + 1)]
    # --- ground floor portico
    ops = [(c0 + 0.5, c1 - 0.5, 0.0, 3.75, 'pointed', 2.05) for c0, c1 in zip(cols, cols[1:])]
    arched_wall(pl, 0.0, L, 0.0, ZP, ops, WHITE, 0.85, WHITE, pier_z0=3.75, n=8, jambs=False)
    for c in cols:
        u, w, _ = pl.L(c, 0.0, -0.42)
        fr.cyl(u, w, -0.2, 0.43, 3.25, WHITE, seg=10, cap=False)
        fr.frustum(sq(u, w, 0.45, pl.ang), sq(u, w, 0.62, pl.ang), 3.05, 3.75, WHITE)
    for a, b, zb, zs, kind, rise in ops:                                  # moulding round the arches
        vkit.arch_band(pl, a, b, zs, 'pointed', rise, 0.22, WHITE, 0.0, 0.1, n=8)
    pl.block(0.0, 0.0, CP - 0.1, ZP, -0.85, 0.05, WHITE) if corner0 else None
    pl.block(L - CP + 0.1, 0.0, L, ZP, -0.85, 0.05, WHITE) if corner1 else None
    fr.face([pl.L(0.0, 6.05, -0.85), pl.L(L, 6.05, -0.85), pl.L(L, 6.05, -DEPTH), pl.L(0.0, 6.05, -DEPTH)], DARK)   # portico ceiling
    pl.quad(0.0, -0.2, L, 6.05, MARBLE, -DEPTH)                                        # its back wall
    for s_, sg in ((0.0, -1.0), (L, 1.0)):                                              # end walls of portico and loggia
        fr.face_toward([pl.L(s_, -0.2, -0.85), pl.L(s_, -0.2, -DEPTH), pl.L(s_, ZL, -DEPTH), pl.L(s_, ZL, -0.85)], WHITE,
                       vkit._toward(pl, sg, 0.0))
    for k, (c0, c1) in enumerate(zip(cols, cols[1:])):
        if k % 2 == 0:
            pl.quad((c0 + c1) / 2 - 0.8, 0.0, (c0 + c1) / 2 + 0.8, 3.4, GLASS, -DEPTH + 0.03)
    # --- loggia
    pl.block(0.0, ZP - 0.25, L, ZP + 0.05, -0.2, 0.15, WHITE)                          # stringcourse
    lcols = [CP + k * bay / 2 for k in range(2 * n + 1)]
    lops = [(c0 + 0.24, c1 - 0.24, ZP, 9.75, 'ogee', 1.3) for c0, c1 in zip(lcols, lcols[1:])]
    arched_wall(pl, 0.0, L, ZP, ZL, lops, WHITE, 0.45, WHITE, pier_z0=9.75, n=6, jambs=False)
    for c in lcols:
        u, w, _ = pl.L(c, 0.0, -0.22)
        fr.cyl(u, w, ZP, 0.21, 2.8, WHITE, seg=6, cap=False)
        rot_box(fr, u, w, 9.35, 0.5, 0.5, 0.4, pl.ang, WHITE)
    for c in lcols[1:-1]:                                                               # pierced quatrefoils
        quatrefoil(pl, c, 12.15, 0.66, GLASS, 0.03, n=16)
    a_, b_ = pl.L(0.3, 0.0, -0.3), pl.L(L - 0.3, 0.0, -0.3)
    balustrade(fr, a_[:2], b_[:2], ZP, 1.05, 0.42, WHITE)
    fr.face([pl.L(0.0, ZP, -0.45), pl.L(L, ZP, -0.45), pl.L(L, ZP, -DEPTH), pl.L(0.0, ZP, -DEPTH)][::-1], STONE)    # loggia floor
    fr.face([pl.L(0.0, 13.25, -0.45), pl.L(L, 13.25, -0.45), pl.L(L, 13.25, -DEPTH), pl.L(0.0, 13.25, -DEPTH)], DARK)
    pl.quad(0.0, ZP, L, 13.25, DARK, -DEPTH)
    for k in range(0, 2 * n, 2):
        c = (lcols[k] + lcols[k + 1]) / 2
        pl.quad(c - 0.55, ZP + 0.2, c + 0.55, ZP + 2.6, GLASS, -DEPTH + 0.03)
    pl.block(0.0, 13.05, L, ZL + 0.1, 0.0, 0.14, WHITE)                                # dentil band
    # --- the pink upper wall with its white lozenge lattice
    pl.quad(0.0, ZL, L, ZU, ROSE, 0.0, uvscale=2.5)
    vkit.lattice(pl, 0.0, L, ZL + 0.1, ZU - 0.05, 0.02, 1.25, 0.22, MARBLE)
    for s in windows:
        window(pl, s, 16.0, 3.4, 5.2)
    for s in tracery:
        tracery_window(pl, s, 15.5, 4.4, 5.3)
    for s in oculi:
        vkit.disc(pl, s, 23.0, 0.85, WHITE, 0.04, n=12)
        quatrefoil(pl, s, 23.0, 0.64, GLASS, 0.06, n=16)
    tabernacle(pl, balcony)
    # --- cornice, merlons, corner pinnacles
    pl.block(-0.15, ZU, L + 0.15, ZC, -0.4, 0.35, WHITE)
    m = int(L / 2.05)
    for k in range(m):
        s = (k + 0.5) * L / m
        pl.poly([(s + x, ZC + y) for x, y in MERLON], WHITE, 0.15)
        pl.poly([(s + x, ZC + y) for x, y in MERLON][::-1], WHITE, -0.05)
        if k:
            s2 = k * L / m
            pl.poly([(s2 - 0.09, ZC), (s2 + 0.09, ZC), (s2, ZC + 1.35)], WHITE, 0.15)
    for s, on in ((0.0, corner0), (L, corner1)):
        if on:
            u, w, _ = pl.L(s, 0.0, 0.0)
            fr.cyl(u, w, ZL, 0.2, ZU - ZL, WHITE, seg=6, cap=False)             # twisted corner column
            rot_box(fr, u, w, ZC, 0.9, 0.9, 1.2, pl.ang, WHITE)
            fr.revolve(u, w, ZC + 1.2, [(0.55, 0.0), (0.0, 2.6)], WHITE, 6, smooth=False, around=2, vlen=2.0)
            figure(fr, *pl.L(s, 0.0, 0.35)[:2], 3.9, 2.0, WHITE, seg=5)              # corner sculpture groups
            figure(fr, *pl.L(s + (0.6 if s == 0 else -0.6), 0.0, 0.35)[:2], 3.9, 1.9, WHITE, seg=5)
            vkit.winged_figure(fr, *pl.L(s, 0.0, 0.4)[:2], 9.9, 2.1, WHITE, pl.ang - H)


MERLON = [(-0.42, 0.0), (0.42, 0.0), (0.42, 0.5), (0.24, 0.72), (0.32, 0.92), (0.0, 1.6), (-0.32, 0.92), (-0.24, 0.72), (-0.42, 0.5)]


def sq(u, w, h, a):
    c, s = math.cos(a), math.sin(a)
    return [(u + x * c - y * s, w + x * s + y * c) for x, y in ((-h, -h), (h, -h), (h, h), (-h, h))]


def window(pl, s, z0, wd, ht):
    """A tall pointed window in a white stone frame, dark glass with mullion and transoms."""
    arch = arch_curve('pointed', s - wd / 2, s + wd / 2, z0 + ht - wd * 0.8, wd * 0.8, 8)
    frame = arch_curve('pointed', s - wd / 2 - 0.32, s + wd / 2 + 0.32, z0 + ht - wd * 0.8, wd * 0.8 + 0.5, 8)
    pl.poly([(s - wd / 2 - 0.32, z0 - 0.35), (s + wd / 2 + 0.32, z0 - 0.35)] + frame[::-1], WHITE, 0.05)
    pl.poly([(s - wd / 2, z0), (s + wd / 2, z0)] + arch[::-1], GLASS, 0.08)
    pl.block(s - 0.06, z0, s + 0.06, z0 + ht - 0.3, 0.08, 0.12, WHITE)
    for z in (z0 + ht * 0.33, z0 + ht * 0.62):
        pl.block(s - wd / 2, z - 0.05, s + wd / 2, z + 0.05, 0.08, 0.12, WHITE)


def tracery_window(pl, s, z0, wd, ht):
    """A two-light Gothic window with a quatrefoil in its head (the lagoon front's east windows)."""
    frame = arch_curve('pointed', s - wd / 2 - 0.3, s + wd / 2 + 0.3, z0 + ht - wd * 0.6, wd * 0.6 + 0.4, 8)
    pl.poly([(s - wd / 2 - 0.3, z0 - 0.3), (s + wd / 2 + 0.3, z0 - 0.3)] + frame[::-1], WHITE, 0.05)
    for c in (s - wd / 4, s + wd / 4):
        a = arch_curve('pointed', c - wd / 4 + 0.12, c + wd / 4 - 0.12, z0 + ht - 2.2, 1.1, 6)
        pl.poly([(c - wd / 4 + 0.12, z0), (c + wd / 4 - 0.12, z0)] + a[::-1], GLASS, 0.08)
    quatrefoil(pl, s, z0 + ht - 0.75, 0.6, GLASS, 0.08, n=12)


def tabernacle(pl, c):
    """The balcony window under its Gothic tabernacle, crowned by Justice."""
    pl.block(c - 2.5, ZL - 0.2, c + 2.5, ZL + 0.6, 0.0, 1.3, WHITE)                  # balcony slab
    a_, b_ = pl.L(c - 2.35, 0.0, 1.15), pl.L(c + 2.35, 0.0, 1.15)
    balustrade(fr, a_[:2], b_[:2], ZL + 0.6, 1.0, 0.4, WHITE)
    for sx in (-1, 1):
        a_, b_ = pl.L(c + sx * 2.35, 0.0, 1.15), pl.L(c + sx * 2.35, 0.0, 0.1)
        balustrade(fr, a_[:2], b_[:2], ZL + 0.6, 1.0, 0.4, WHITE)
    window(pl, c, ZL + 0.7, 2.5, 5.6)
    for sx in (-1, 1):                                                               # side pilasters and pinnacles
        u, w, _ = pl.L(c + sx * 2.85, 0.0, 0.35)
        rot_box(fr, u, w, ZL, 0.7, 0.7, 12.6, pl.ang, WHITE)
        fr.revolve(u, w, ZL + 12.6, [(0.5, 0.0), (0.0, 2.8)], WHITE, 6, smooth=False, around=2, vlen=2.0)
    pl.block(c - 2.5, ZL + 7.0, c + 2.5, ZL + 8.0, 0.05, 0.35, WHITE)
    vkit.disc(pl, c, ZL + 9.3, 1.0, WHITE, 0.3, n=12)                               # relief roundel
    vkit.disc(pl, c, ZL + 9.3, 0.7, MARBLE, 0.33, n=12)
    gable = arch_curve('ogee', c - 2.5, c + 2.5, ZL + 10.6, 4.2, 10)
    pl.slab([(c - 2.5, ZL + 10.2), (c + 2.5, ZL + 10.2)] + gable[::-1], WHITE, 0.0, 0.3)
    vkit.crockets(pl, gable, WHITE, 0.15, size=0.32)
    u, w, _ = pl.L(c, 0.0, 0.15)
    figure(fr, u, w, ZL + 14.8, 2.4, WHITE, seg=6)
    rot_box(fr, u, w, ZL + 16.2, 0.06, 0.06, 1.1, pl.ang, GOLD)                    # her sword


# The lagoon (Molo) front: s = u from the Piazzetta corner, facing south.
molo = Plane(fr, 0.0, 0.0, 0.0)
gothic_front(molo, LM, 17, balcony=34.2, windows=(6.6, 16.0, 25.9, 42.7), tracery=(53.3, 65.1),
             oculi=(4.0, 12.8, 21.9, 29.6, 38.7, 46.4, 59.2, 70.0))
# The Piazzetta front: s from the Porta della Carta end southwards, facing west.
piaz = Plane(fr, 0.0, LP, -H)
gothic_front(piaz, LP, 18, balcony=38.6, windows=(9.5, 19.5, 29.0, 48.5, 58.0, 67.5), oculi=(14.5, 24.2, 33.6, 43.6, 53.2, 62.8, 72.3),
             corner1=False)

# ------------------------------------------------------------------------------------------ masses and roofs
# The wings' walls behind the arcades (portico/loggia back walls are drawn above), and the courtyard.
COURT = [(18.0, 26.5), (53.0, 26.5), (53.0, 76.4), (38.3, 76.4), (38.3, 76.2), (18.2, 76.2)]


def court_front(pl, L, n, upper, round_arches=True):
    """A courtyard front: round-arched portico, pointed loggia, upper wall (brick or white)."""
    bay = L / n
    ops = [(k * bay + 0.45, (k + 1) * bay - 0.45, 0.0, 3.9, 'round' if round_arches else 'pointed', None if round_arches else 2.0)
           for k in range(n)]
    arched_wall(pl, 0.0, L, 0.0, ZP, ops, WHITE, 3.5, MARBLE, back=(3.2, GLASS, DARK), pier_z0=0.0, n=4)
    lops = [(k * bay / 2 + 0.3, (k + 1) * bay / 2 - 0.3, ZP + 1.0, 9.6, 'pointed', 1.5) for k in range(2 * n)]
    arched_wall(pl, 0.0, L, ZP, ZL, lops, WHITE, 0.4, WHITE, back=GLASS, n=4)
    pl.block(0.0, ZP - 0.2, L, ZP + 0.05, -0.1, 0.12, WHITE)
    if upper == 'brick':
        pl.quad(0.0, ZL, L, ZU, BRICK, 0.0, uvscale=2.0)
        for k in range(n):
            c = (k + 0.5) * bay
            wd = 1.6
            a = arch_curve('pointed', c - wd / 2, c + wd / 2, 19.5, 1.2, 6)
            pl.poly([(c - wd / 2 - 0.25, 16.3), (c + wd / 2 + 0.25, 16.3)] + arch_curve('pointed', c - wd / 2 - 0.25, c + wd / 2 + 0.25, 19.5, 1.5, 6)[::-1], WHITE, 0.03)
            pl.poly([(c - wd / 2, 16.5), (c + wd / 2, 16.5)] + a[::-1], GLASS, 0.05)
            pl.quad(c - 0.55, 22.3, c + 0.55, 23.9, GLASS, 0.05)
    else:
        win_wall(pl, 0.0, L, ZL, ZU, n * 2, 2)
    pl.block(0.0, ZU, L, ZC, -0.3, 0.3, WHITE)


def win_wall(pl, s0, s1, z0, z1, bays, storeys):
    """A white Renaissance wall with windows: the library's 'Upper' stone texture, one window per bay and storey."""
    nb, ns = bays, storeys
    pts = [(s0, z0), (s1, z0), (s1, z1), (s0, z1)]
    q = [pl.L(s, z, 0.0) for s, z in pts]
    uv = [(0.0, 0.0), (nb, 0.0), (nb, ns), (0.0, ns)]
    fr.face(q, UPPER_WIN, uv)


# west wing inner face (courtyard side), facing east
court_front(Plane(fr, 18.0, 26.5, H), 49.9, 12, 'brick')
# south wing inner face, facing north
court_front(Plane(fr, 53.0, 26.5, PI), 35.0, 8, 'brick')
# east wing inner face (Rizzo's front), facing west
court_front(Plane(fr, 53.0, 76.4, -H), 49.9, 12, 'white')
# courtyard floor edge and well-heads
for u, w in ((29.0, 50.0), (43.0, 50.0)):
    fr.revolve(u, w, 0.0, [(0.0, 0.0), (1.05, 0.0), (1.05, 0.25), (0.95, 0.3), (1.0, 1.0), (1.15, 1.1), (1.15, 1.25), (0.0, 1.25)], BRONZE, 12, smooth=False)

# Outer masses: Molo wing behind its loggia (w 4.5 .. 26.5), Piazzetta wing (u 4.5 .. 18), east wing.
# Only the faces that can be seen are drawn: tops are covered by the roofs.
RIO = [(73.6, 0.0), (73.6, 20.65), (75.4, 20.65), (75.65, 44.1), (76.4, 64.1), (76.85, 76.4)]
for p, q in zip(RIO, RIO[1:]):                                        # the Rio di Palazzo front (east)
    L = math.dist(p, q)
    pl = Plane(fr, p[0], p[1], math.atan2(q[1] - p[1], q[0] - p[0]))
    win_wall(pl, 0.0, L, -0.2, ZU, max(1, round(L / 3.6)), 6)
    pl.block(0.0, ZU, L, ZC, -0.3, 0.3, WHITE)
# roofs (lead, hipped), eaves at the cornice top
vkit.hip_roof(fr, -0.3, LM + 0.3, -0.3, DM, ZC, 4.6, LEAD, hip=(True, True))
vkit.hip_roof(fr, -0.3, DP, DM, LP + 0.3, ZC, 3.4, LEAD, hip=(False, True))
vkit.hip_roof(fr, 53.0, 76.2, DM, 76.4, ZC, 3.9, LEAD, hip=(False, False))
# the north part along the Rio, beyond the courtyard: a simpler white block to the Canonica bridge
NORTH = [(53.0, 76.4), (76.85, 76.4), (78.1, 102.1), (79.0, 119.4), (79.7, 137.1), (79.7, 142.2), (63.2, 136.6), (63.2, 120.0),
         (68.5, 110.2), (53.3, 110.3), (53.2, 85.0)]
n_ = len(NORTH)
for i in range(n_):
    p, q = NORTH[i], NORTH[(i + 1) % n_]
    L = math.dist(p, q)
    if L < 0.5:
        continue
    pl = Plane(fr, p[0], p[1], math.atan2(q[1] - p[1], q[0] - p[0]))
    win_wall(pl, 0.0, L, 0.0, 22.0, max(1, round(L / 3.6)), 5)
    pl.block(0.0, 22.0, L, 22.5, -0.2, 0.25, WHITE)
fr.face([(x, y, 22.5) for x, y in vkit.ccw(NORTH)], LEAD)
vkit.hip_roof(fr, 53.5, 77.8, 76.6, 108.0, 22.5, 3.2, LEAD, hip=(True, True))

# ------------------------------------------------------------------------------------------ Porta della Carta, Arco Foscari, Scala dei Giganti
# the block between the palace and the Basilica (u 5.6..38.3, w 76.2..84.9)
pc = Plane(fr, 5.6, 84.9, -H)                                         # its west face: the Porta della Carta, s = 84.9 - w
door = arch_curve('pointed', 2.2, 5.3, 7.0, 2.2, 8)
pc.poly([(2.2, 0.0), (5.3, 0.0)] + door[::-1], 'M_Wall_Wood_brown_Blank', 0.04)
win = arch_curve('pointed', 2.0, 5.5, 12.5, 2.6, 8)
pc.poly([(2.0, 9.6), (5.5, 9.6)] + win[::-1], GLASS, 0.04)
pc.block(3.63, 9.6, 3.87, 14.0, 0.04, 0.12, WHITE)
gable = arch_curve('ogee', 0.6, 6.9, 17.0, 4.6, 10)
pc.slab([(0.6, 17.0), (6.9, 17.0)] + gable[::-1], WHITE, -0.3, 0.2)
vkit.crockets(pc, gable, WHITE, 0.0, size=0.35)
for s in (0.35, 7.15):
    u, w, _ = pc.L(s, 0.0, 0.35)
    rot_box(fr, u, w, 0.0, 0.7, 0.7, 17.5, pc.ang, WHITE)
    fr.revolve(u, w, 17.5, [(0.5, 0.0), (0.0, 3.2)], WHITE, 6, smooth=False, around=2, vlen=2.0)
    for z in (4.0, 8.5, 13.0):
        figure(fr, *pc.L(s, 0.0, 0.85)[:2], z, 1.5, WHITE, seg=5)
u, w, _ = pc.L(3.75, 0.0, 0.1)
figure(fr, u, w, 21.6, 2.2, WHITE, seg=6)
pc.poly([(2.6, 7.6), (4.9, 7.6), (4.9, 9.2), (2.6, 9.2)], GOLD, 0.06)                     # the doge kneeling before the lion
fr.prism([(5.6, 76.2), (18.2, 76.2), (18.2, 84.9), (5.6, 84.9)], 0.0, 17.0, WHITE, top=False)
fr.face([(5.6, 76.2, 17.0), (18.2, 76.2, 17.0), (18.2, 84.9, 17.0), (5.6, 84.9, 17.0)], LEAD)
fr.prism([(18.2, 76.2), (38.3, 76.2), (38.3, 84.9), (18.2, 84.9)], 0.0, 14.0, WHITE, top=False)
fr.face([(18.2, 76.2, 14.0), (38.3, 76.2, 14.0), (38.3, 84.9, 14.0), (18.2, 84.9, 14.0)], LEAD)
af = Plane(fr, 18.2, 76.2, 0.0)                                       # the Arco Foscari, facing the courtyard
arch = arch_curve('pointed', 6.5, 13.6, 6.0, 4.0, 10)
af.poly([(6.5, 0.0), (13.6, 0.0)] + arch[::-1], DARK, 0.03)
vkit.arch_band(af, 6.5, 13.6, 6.0, 'pointed', 4.0, 0.4, WHITE, 0.0, 0.3, n=10)
for k in range(7):
    s = 1.0 + k * 3.0
    u, w, _ = af.L(s, 0.0, 0.3)
    rot_box(fr, u, w, 14.0, 0.6, 0.6, 2.2, af.ang, WHITE)
    fr.revolve(u, w, 16.2, [(0.42, 0.0), (0.0, 2.4)], WHITE, 6, smooth=False, around=2, vlen=2.0)
    figure(fr, u, w, 18.6, 1.5, WHITE, seg=5)
# Scala dei Giganti: steps rising east to the loggia, Mars and Neptune at the top
for k in range(14):
    u0 = 41.1 + k * (9.3 / 14)
    fr.box(u0 + 0.33, 81.3, 0.0, 0.66, 4.4, (k + 1) * ZP / 14, WHITE if k % 2 else MARBLE, top=True)
for w_ in (79.4, 83.2):
    fr.box(50.0, w_, ZP, 0.9, 0.9, 0.8, WHITE)
    figure(fr, 50.0, w_, ZP + 0.8, 3.6, WHITE, seg=6)

vkit.emit(ctx, g, 'w138803915_Palazzo_Ducale', samples=[fr.P(u, w)[:2] for u, w in ((0.0, 0.0), (LM, 0.0), (0.0, LP), (40.0, 40.0))])
print(f'  [custom] Palazzo Ducale: {vkit.tris(g)} triangles', flush=True)
