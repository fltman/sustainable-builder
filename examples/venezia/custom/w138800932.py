"""Basilica di San Marco (OSM way 138800932; its building:parts are hidden in overrides.json, so this
script draws the whole church). References in ../references/san-marco/ (NOTES.md: sources and sizes).

- Plan from OSM: Greek cross on an axis 15.5° north of east, the five dome centres from the mapped
  dome parts (W, C, E 18–19 m apart along the nave, N and S 20 m off the axis), the narthex wrapping
  the west arm, the Zen chapel and the Treasury on the south side.
- West front (Visentini's measured elevation, 1726, and photos): lower register with five deep portal
  niches (the central one wider and taller) between piers dressed with two tiers of columns, carved
  archivolts, dark doors under gold mosaic lunettes; the terrace (Loggia dei Cavalli) with its
  balustrade and the four gilded horses over the central portal; the upper register set back with four
  gold mosaic lunettes and the great central window; ogee "accolade" crownings with leafy crockets and
  statues, St Mark with gilded angels on the central one over a blue field of gold stars with the
  winged lion; open pinnacle tabernacles between the arches.
- North front (Piazzetta dei Leoncini) and the Zen chapel's south front in the same two registers;
  the Treasury and the Pilastri Acritani towards the Piazzetta.
- Five lead-grey ribbed domes (stilted outer shells on brick drums with 16 arched windows, onion
  lanterns, ball and cross), the central one largest and highest (cross at ~44 m), lead barrel roofs
  on the arms with brick lunette ends.
"""
import inspect
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(inspect.currentframe().f_code.co_filename), 'lib'))
import vkit  # noqa: E402
from vkit import (BLUE, BRICK, GLASS, GOLD, LEAD, MARBLE, ROSE, STONE, WHITE, Frame, Plane, arch_curve,  # noqa: E402
                  arched_wall, balustrade, crockets, figure, rot_box, winged_figure)

g = Geo()
fr = Frame(g, 187.8, -48.8, math.radians(15.5))   # u east along the nave, w north; origin under the central dome
H, PI = math.pi / 2, math.pi
TER = 13.0          # terrace (top of the lower register)
UP = 21.0           # top of the upper register walls and of the flat roofs round the arms
COLS = (STONE, ROSE, STONE, 'M_Wall_Stone_sandstone_Blank')
DOMEMAT = 'M_Wall_Metal_grey_Blank'


def area_ok(pts):
    return pts[::-1] if vkit._area(pts) < 0 else pts


# ------------------------------------------------------------------------------------------ helpers
def crowning(pl, a, b, zs, tip, d, central=False):
    """The ogee crowning over an upper arch from a to b springing at zs: a marble screen between the
    archivolt and an ogee rising to `tip`, crockets along its edge and a statue on top."""
    half = (b - a) / 2
    c = (a + b) / 2
    m = 12
    inner = arch_curve('round', a - 0.45, b + 0.45, zs, None, m)
    outer = arch_curve('ogee', a - 0.75, b + 0.75, zs, tip - zs, m)
    if central:
        field = arch_curve('ogee', a - 0.15, b + 0.15, zs, tip - zs - 1.1, m)
        for k in range(m):
            pl.poly(area_ok([inner[k], inner[k + 1], field[k + 1], field[k]]), BLUE, d)
            pl.poly(area_ok([field[k], field[k + 1], outer[k + 1], outer[k]]), WHITE, d + 0.04)
    else:
        for k in range(m):
            pl.poly(area_ok([inner[k], inner[k + 1], outer[k + 1], outer[k]]), WHITE, d)
    for k in range(m):                                               # back of the free-standing screen
        pl.poly(area_ok([inner[k], inner[k + 1], outer[k + 1], outer[k]]), WHITE, d - 0.45, flip=True)
    for (s0, z0), (s1, z1) in zip(outer, outer[1:]):
        pl.fr.face_toward([pl.L(s0, z0, d), pl.L(s1, z1, d), pl.L(s1, z1, d - 0.45), pl.L(s0, z0, d - 0.45)], WHITE,
                          vkit._toward(pl, (s0 + s1) / 2 - c, (z0 + z1) / 2 - zs))
    crockets(pl, outer, WHITE, d - 0.1, size=0.42)
    vkit.arch_band(pl, a, b, zs, 'round', None, 0.45, WHITE, d - 0.3, d + 0.12, n=m)
    if central:
        lion = [(-1.5, 0.0), (1.4, 0.0), (1.6, 0.5), (1.1, 0.9), (1.5, 1.6), (0.6, 1.25), (0.2, 1.8), (-0.4, 1.1),
                (-1.2, 1.0), (-1.7, 0.4)]
        pl.poly([(c + x, zs + half + 0.5 + y) for x, y in lion], GOLD, d + 0.08)
        for x, y in ((-4.0, 0.3), (4.0, 0.3), (-3.1, 1.6), (3.1, 1.6), (-2.2, 2.6), (2.2, 2.6), (-1.0, 3.3), (1.0, 3.3),
                     (-4.6, -0.9), (4.6, -0.9)):
            s0, z0 = c + x, zs + half - 1.0 + y
            pl.poly([(s0, z0 - 0.22), (s0 + 0.22, z0), (s0, z0 + 0.22), (s0 - 0.22, z0)], GOLD, d + 0.06)
        for k in (2, 4):
            for side in (-1, 1):
                s0, z0 = outer[k] if side < 0 else outer[m - k]
                u, w, _ = pl.L(s0, z0 - 0.3, d + 0.15)
                winged_figure(pl.fr, u, w, z0 - 0.3, 1.5, GOLD, pl.ang - H)
    u, w, _ = pl.L(c, tip, d - 0.2)
    rot_box(pl.fr, u, w, tip - 0.3, 0.6, 0.6, 0.6, pl.ang, WHITE)
    if central:
        figure(pl.fr, u, w, tip + 0.3, 2.7, WHITE, seg=6)
        pl.fr.cyl(u, w, tip + 2.95, 0.42, 0.05, GOLD, seg=10, smooth=False)
    else:
        figure(pl.fr, u, w, tip + 0.3, 2.0, WHITE)


def turret(pl, s, z0, d, top, big=False):
    """A pinnacle tabernacle: a square shaft, an open aedicule with a statue, a pointed spire."""
    u, w, _ = pl.L(s, 0.0, d)
    side = 1.6 if big else 1.15
    a = pl.ang
    zt = top - (5.0 if big else 4.2)                   # spire base
    za = zt - (3.0 if big else 2.5)                    # aedicule floor
    rot_box(pl.fr, u, w, z0, side, side, za - z0, a, WHITE)
    rot_box(pl.fr, u, w, za - 0.1, side + 0.3, side + 0.3, 0.3, a, WHITE)
    c, si = math.cos(a), math.sin(a)
    r = side / 2 - 0.08
    for dx, dy in ((-r, -r), (r, -r), (r, r), (-r, r)):
        rot_box(pl.fr, u + dx * c - dy * si, w + dx * si + dy * c, za + 0.2, 0.16, 0.16, zt - za - 0.2, a, WHITE)
    figure(pl.fr, u, w, za + 0.2, (zt - za) * 0.75, WHITE, seg=5)
    rot_box(pl.fr, u, w, zt - 0.25, side + 0.35, side + 0.35, 0.3, a, WHITE)
    pl.fr.revolve(u, w, zt + 0.05, [((side + 0.2) / 2 / math.cos(math.pi / 6), 0.0), (0.0, top - zt - 0.6)], WHITE, 6, smooth=False,
                  a0=a + math.pi / 6, around=6, vlen=2.0)
    pl.fr.cyl(u, w, top - 0.65, 0.05, 0.4, GOLD, seg=4, cap=False, smooth=False)
    pl.fr.revolve(u, w, top - 0.3, [(0.0, 0.0), (0.2, 0.15), (0.0, 0.3)], GOLD, 6, smooth=True, around=1, vlen=1.0)


def columns(pl, s0, s1, z0, z1, d, count, r=0.19):
    """A row of marble columns with bases and capitals in front of a pier."""
    for k in range(count):
        s = s0 + (k + 0.5) * (s1 - s0) / count
        u, w, _ = pl.L(s, 0.0, d)
        rot_box(pl.fr, u, w, z0, 0.48, 0.48, 0.28, pl.ang, WHITE)
        pl.fr.cyl(u, w, z0 + 0.28, r, z1 - z0 - 0.7, COLS[k % len(COLS)], seg=6, cap=False, smooth=True, uvscale=1.0)
        rot_box(pl.fr, u, w, z1 - 0.42, 0.5, 0.5, 0.42, pl.ang, WHITE)


def window(pl, s, z0, wd, ht, d, mat=GLASS, frame=WHITE):
    """A round-headed window with a marble surround."""
    def shape(e):
        return [(s - wd / 2 - e, z0 - e), (s + wd / 2 + e, z0 - e)] + \
               [(s + (wd / 2 + e) * math.cos(math.pi * i / 6), z0 + ht - wd / 2 + (wd / 2 + e) * math.sin(math.pi * i / 6)) for i in range(7)]
    pl.poly(shape(0.15), frame, d + 0.03)
    pl.poly(shape(0.0), mat, d + 0.06)


DOOR = 'M_Wall_Wood_brown_Blank'                       # bronze doors
MOSAIC = (BLUE, 'M_Wall_Plaster_red_Blank', WHITE, ROSE, BLUE, 'M_Wall_Plaster_green_Blank')


def mosaic(pl, a, b, z0, zs, d, rows=1):
    """Figures on a gold mosaic lunette (a to b, from z0 up to the arch springing zs): robed
    silhouettes in blue, red and white that make the gold read as a picture."""
    half = (b - a) / 2
    c = (a + b) / 2
    nfig = max(3, int((b - a) / 1.1))
    for k in range(nfig):
        s = a + (k + 0.5) * (b - a) / nfig
        top = zs + math.sqrt(max(0.0, half * half - (s - c) ** 2)) - 0.35
        h = min(1.9 if rows == 1 else 1.5, top - z0 - 0.25)
        if h < 0.6:
            continue
        wd = (b - a) / nfig * 0.55
        zb = z0 + 0.15
        pl.poly([(s - wd / 2, zb), (s + wd / 2, zb), (s + wd / 2 * 0.8, zb + h * 0.8), (s, zb + h), (s - wd / 2 * 0.8, zb + h * 0.8)],
                MOSAIC[(k + int(a)) % len(MOSAIC)], d)
        pl.poly([(s - wd * 0.18, zb + h + 0.05), (s + wd * 0.18, zb + h + 0.05), (s + wd * 0.18, zb + h + 0.42), (s - wd * 0.18, zb + h + 0.42)],
                ROSE, d)


def door(pl, a, b, z1, d, wmax=2.8):
    wd = min(wmax, 0.46 * (b - a))
    c = (a + b) / 2
    pl.block(c - wd / 2 - 0.25, 0.0, c + wd / 2 + 0.25, z1 + 0.25, d, d + 0.05, WHITE)
    pl.quad(c - wd / 2, 0.0, c + wd / 2, z1, DOOR, d + 0.07)


def front(pl, s0, s1, bays, top, depth, back, z_spring, n=10):
    """A lower-register arcade: blind or open arches between piers with columns, archivolts."""
    arched_wall(pl, s0, s1, 0.0, top, [(a, b, 0.0, z_spring, 'round', None) for a, b in bays], WHITE, depth, MARBLE, back=back, n=n)
    for a, b in bays:
        vkit.arch_band(pl, a, b, z_spring, 'round', None, 0.4, WHITE, 0.0, 0.2, n=n)
        door(pl, a, b, back[0] - 0.4, -depth + 0.02)
        if back[2] == GOLD:
            mosaic(pl, a, b, back[0], z_spring, -depth + 0.06)
    edges = [s0] + [x for ab in bays for x in ab] + [s1]
    for p0, p1 in zip(edges[::2], edges[1::2]):
        if p1 - p0 > 0.5:
            cnt = max(1, round((p1 - p0) / 0.75))
            columns(pl, p0, p1, 0.0, 4.4, 0.28, cnt)
            columns(pl, p0, p1, 4.55, z_spring, 0.28, cnt, r=0.16)


def terrace(pl, s0, s1, depth, z=TER):
    """Terrace floor behind a lower register, the cornice under its edge and the balustrade."""
    pl.fr.face([pl.L(s0, z, 0.0), pl.L(s1, z, 0.0), pl.L(s1, z, -depth), pl.L(s0, z, -depth)][::-1], STONE)
    pl.block(s0, z - 0.6, s1, z, 0.0, 0.32, WHITE)
    a_, b_ = pl.L(s0, 0.0, -0.18), pl.L(s1, 0.0, -0.18)
    balustrade(pl.fr, a_[:2], b_[:2], z, 1.05, 0.44, WHITE, posts=4.0)


def dome(u, w, R, z_drum, drum_h, top_lantern=6.2, big=False):
    """A San Marco dome: square lead base, brick drum with 16 arched windows, stilted ribbed lead shell,
    onion lantern with ball and cross."""
    rd = R + 0.25
    side = 2 * R + 1.6
    ring0 = [(u - side / 2, w - side / 2), (u + side / 2, w - side / 2), (u + side / 2, w + side / 2), (u - side / 2, w + side / 2)]
    s2 = 2 * rd + 0.3
    ring1 = [(u - s2 / 2, w - s2 / 2), (u + s2 / 2, w - s2 / 2), (u + s2 / 2, w + s2 / 2), (u - s2 / 2, w + s2 / 2)]
    fr.frustum(ring0, ring1, z_drum - 1.6, z_drum + 0.05, LEAD, top=True, uvscale=4.0)
    fr.revolve(u, w, z_drum, [(rd, 0.0), (rd, drum_h), (rd + 0.28, drum_h + 0.35)], BRICK, 32, smooth=False,
               around=round(math.tau * rd / 2.0), vlen=2.0)
    for i in range(16):
        t = math.tau * (i + 0.5) / 16
        c, s = math.cos(t), math.sin(t)
        ww, z0, z1 = 0.62, z_drum + 0.6, z_drum + drum_h - 0.45
        pts = [(-ww / 2, z0), (ww / 2, z0), (ww / 2, z1 - 0.3), (ww * 0.3, z1 - 0.06), (-ww * 0.3, z1 - 0.06), (-ww / 2, z1 - 0.3)]
        rr = rd + 0.03
        fr.face([(u + rr * c - x * s, w + rr * s + x * c, z) for x, z in pts], GLASS)
    zs = z_drum + drum_h + 0.35
    Hs = 1.24 * R
    prof = [(R * 0.98, 0.0), (R * 1.03, 0.12 * Hs), (R * 1.035, 0.27 * Hs), (R * 0.99, 0.43 * Hs), (R * 0.9, 0.59 * Hs),
            (R * 0.76, 0.74 * Hs), (R * 0.58, 0.86 * Hs), (R * 0.38, 0.95 * Hs), (R * 0.16, 0.995 * Hs), (R * 0.1, Hs)]
    ribs = 36 if big else 32
    # weathered lead sheets: the light seamed metal reads as the silvery ribbed shells in the photos
    fr.revolve(u, w, zs, prof, DOMEMAT, ribs, smooth=True, around=2, vlen=math.tau * R / 2 * 0.9)
    zt = zs + Hs
    # lantern: little drum with openings, onion, ball, cross
    lr = 0.85 if big else 0.75
    fr.revolve(u, w, zt - 0.05, [(lr, 0.0), (lr, 1.25), (lr + 0.18, 1.35), (lr + 0.18, 1.5)], LEAD, 8, smooth=False, around=2, vlen=1.5)
    for i in range(8):
        t = math.tau * (i + 0.5) / 8
        c, s = math.cos(t), math.sin(t)
        fr.face([(u + (lr + 0.02) * c - x * s, w + (lr + 0.02) * s + x * c, z) for x, z in
                 ((-0.16, zt + 0.2), (0.16, zt + 0.2), (0.16, zt + 0.95), (0.0, zt + 1.08), (-0.16, zt + 0.95))], GLASS)
    zo = zt + 1.45
    oh = top_lantern - 3.2
    onion = [(lr + 0.15, 0.0), (lr + 0.42, 0.22 * oh), (lr + 0.48, 0.42 * oh), (lr + 0.3, 0.66 * oh), (0.32, 0.86 * oh), (0.12, oh)]
    fr.revolve(u, w, zo, onion, DOMEMAT, 16, smooth=True, around=1, vlen=3.0)
    fr.revolve(u, w, zo + oh, [(0.0, 0.0), (0.24, 0.12), (0.26, 0.3), (0.12, 0.5), (0.0, 0.55)], GOLD, 8, smooth=True, around=1, vlen=1.0)
    zc = zo + oh + 0.5
    rot_box(fr, u, w, zc, 0.09, 0.09, 2.1, 0.0, GOLD)
    rot_box(fr, u, w, zc + 1.25, 1.0, 0.08, 0.09, 0.0, GOLD)
    rot_box(fr, u, w, zc + 1.25, 0.08, 1.0, 0.09, 0.0, GOLD)


# ------------------------------------------------------------------------------------------ masses
LOWER = [(-42.9, -23.6), (-23.7, -23.6), (-23.7, -31.8), (-17.8, -31.8), (-17.8, -31.1), (14.2, -31.1), (14.2, -14.8),
         (29.8, -14.8), (29.8, -5.6), (32.0, -1.0), (32.0, 2.4), (43.2, 3.0), (43.3, 12.2), (39.8, 12.1), (39.8, 14.0),
         (35.3, 14.1), (35.3, 16.3), (12.7, 16.0), (12.5, 25.8), (15.3, 25.9), (15.0, 32.4), (6.9, 32.6), (6.9, 35.0),
         (4.1, 35.0), (4.1, 32.5), (-5.0, 32.4), (-5.6, 34.8), (-7.9, 34.7), (-7.8, 32.3), (-13.2, 32.3), (-13.2, 25.3),
         (-42.9, 25.3)]


def drawn_elsewhere(p, q):
    """Edges of LOWER covered by the arcaded fronts (west, north) and the Zen chapel's south front."""
    west = abs(p[0] + 42.9) < 0.01 and abs(q[0] + 42.9) < 0.01
    north = abs(p[1] - 25.3) < 0.01 and abs(q[1] - 25.3) < 0.01 and p[0] < -13
    zen = abs(p[1] + 23.6) < 0.01 and abs(q[1] + 23.6) < 0.01
    return west or north or zen


n = len(LOWER)
for i in range(n):
    p, q = LOWER[i], LOWER[(i + 1) % n]
    if drawn_elsewhere(p, q):
        continue
    fr.face([(p[0], p[1], -0.3), (q[0], q[1], -0.3), (q[0], q[1], TER), (p[0], p[1], TER)], MARBLE, uvscale=3.2)
    L = math.dist(p, q)
    if L > 0.5:
        pl = Plane(fr, p[0], p[1], math.atan2(q[1] - p[1], q[0] - p[0]))
        pl.block(0.0, TER - 0.55, L, TER, -0.01, 0.3, WHITE)
        pl.block(0.0, 5.8, L, 6.2, -0.01, 0.15, WHITE)
fr.face([(x, y, TER) for x, y in vkit.ccw(LOWER)], LEAD, uvscale=4.0)

UPPER = [(-42.9, -22.6), (-23.7, -22.6), (-23.7, -27.5), (13.6, -27.5), (13.6, -14.8), (29.8, -14.8), (29.8, 16.0),
         (12.6, 16.0), (12.6, 27.5), (-13.2, 27.5), (-13.2, 23.8), (-42.9, 23.8)]
n = len(UPPER)
for i in range(n):
    p, q = UPPER[i], UPPER[(i + 1) % n]
    if (abs(p[0] + 42.9) < 0.01 and abs(q[0] + 42.9) < 0.01) or (abs(p[1] - 23.8) < 0.01 and abs(q[1] - 23.8) < 0.01) \
            or (abs(p[1] + 22.6) < 0.01 and abs(q[1] + 22.6) < 0.01):
        continue
    mat = MARBLE
    fr.face([(p[0], p[1], TER), (q[0], q[1], TER), (q[0], q[1], UP), (p[0], p[1], UP)], mat, uvscale=2.0 if mat == BRICK else 3.2)
fr.face([(x, y, UP) for x, y in vkit.ccw(UPPER)], LEAD, uvscale=4.0)

# ------------------------------------------------------------------------------------------ west front, lower register
W = Plane(fr, -45.9, 26.6, -H)                        # s = 26.6 - w; faces the Piazza
DEP = 3.0                                              # depth of the portal niches
side_portals = [(5.15, 11.35), (12.95, 19.15), (33.55, 39.75), (41.35, 47.55)]
C0, C1 = 21.55, 31.15
ZS_SIDE, ZS_C = 7.4, 8.4
arched_wall(W, 0.0, 20.35, 0.0, TER, [(1.1, 3.6, 0.0, 5.6, 'round', None)] + [(a, b, 0.0, ZS_SIDE, 'round', None) for a, b in side_portals[:2]],
            WHITE, DEP, MARBLE, back=(4.8, MARBLE, GOLD), n=10)
arched_wall(W, 20.35, 32.35, 0.0, 14.6, [(C0, C1, 0.0, ZS_C, 'round', None)], WHITE, DEP, MARBLE, back=(5.8, MARBLE, GOLD), n=12)
arched_wall(W, 32.35, 50.2, 0.0, TER, [(a, b, 0.0, ZS_SIDE, 'round', None) for a, b in side_portals[2:]], WHITE, DEP, MARBLE,
            back=(4.8, MARBLE, GOLD), n=10)
for a, b in side_portals:
    door(W, a, b, 4.4, -DEP + 0.02)
    mosaic(W, a, b, 4.8, ZS_SIDE, -DEP + 0.06)
door(W, C0, C1, 5.3, -DEP + 0.02, wmax=3.6)
mosaic(W, C0, C1, 5.8, ZS_C, -DEP + 0.06)
W.quad(1.1, 0.0, 3.6, 5.6, STONE, -DEP + 0.05)                      # the narrow north bay: a blind niche
for s in (20.35, 32.35):                                             # sides of the raised central bay
    fr.face_toward([W.L(s, TER, 0.0), W.L(s, TER, -DEP), W.L(s, 14.6, -DEP), W.L(s, 14.6, 0.0)], WHITE,
                   vkit._toward(W, -1.0 if s < 26 else 1.0, 0.0))
fr.face_toward([W.L(50.2, -0.3, 0.0), W.L(50.2, -0.3, -DEP), W.L(50.2, TER, -DEP), W.L(50.2, TER, 0.0)], WHITE, vkit._toward(W, 1.0, 0.0))
for a, b in side_portals:
    vkit.arch_band(W, a, b, ZS_SIDE, 'round', None, 0.45, WHITE, 0.0, 0.22, n=10)
for k in range(3):
    vkit.arch_band(W, C0 - 0.42 * k, C1 + 0.42 * k, ZS_C, 'round', None, 0.42, MARBLE if k == 1 else WHITE, 0.0, 0.18 + 0.07 * k, n=12)
for s0, s1, wide in ((0.0, 1.1, False), (3.6, 5.15, False), (11.35, 12.95, False), (19.15, C0, True), (C1, 33.55, True),
                     (39.75, 41.35, False), (47.55, 50.2, False)):
    cnt = max(1, round((s1 - s0) / 0.65))
    columns(W, s0, s1, 0.0, 4.6, 0.3, cnt)
    columns(W, s0, s1, 4.75, ZS_C if wide else ZS_SIDE, 0.3, cnt, r=0.16)
for a, b in side_portals + [(C0, C1)]:                               # columns lining the niches
    zs = ZS_C if b - a > 8 else ZS_SIDE
    for s, sg in ((a, 1), (b, -1)):
        for k, dd in enumerate((-0.7, -1.9)):
            u, w, _ = W.L(s + sg * 0.3, 0.0, dd)
            fr.cyl(u, w, 0.0, 0.17, zs - 0.4, COLS[k + 1], seg=6, cap=False, uvscale=1.0)
            rot_box(fr, u, w, zs - 0.45, 0.42, 0.42, 0.45, W.ang, WHITE)
terrace(W, 0.0, 20.35, DEP)
terrace(W, 32.35, 50.2, DEP)
fr.face([W.L(20.35, 14.6, 0.0), W.L(32.35, 14.6, 0.0), W.L(32.35, 14.6, -DEP), W.L(20.35, 14.6, -DEP)][::-1], STONE)
for s0, s1 in ((20.35, 22.4), (30.3, 32.35)):
    a_, b_ = W.L(s0, 0.0, -0.18), W.L(s1, 0.0, -0.18)
    balustrade(fr, a_[:2], b_[:2], 14.6, 1.0, 0.38, WHITE)

# the four gilded horses over the central portal
for k, s in enumerate((23.2, 25.3, 27.4, 29.5)):
    u, w, _ = W.L(s, 0.0, -0.9)
    rot_box(fr, u, w, 14.6, 1.25, 0.75, 0.5, W.ang, STONE)
    hx, hy, _ = fr.P(u, w)
    hf = Frame(g, hx, hy, fr.a + PI + (0.28 if k < 2 else -0.28), 15.1)   # facing the Piazza, each pair turned to the other
    hf.box(0.0, 0.0, 1.05, 1.9, 0.62, 0.72, GOLD)
    hf.face([(0.72, -0.21, 1.55), (0.72, 0.21, 1.55), (1.15, 0.17, 2.4), (1.15, -0.17, 2.4)], GOLD)
    hf.face([(0.98, -0.24, 1.25), (0.98, 0.24, 1.25), (1.32, 0.19, 2.3), (1.32, -0.19, 2.3)][::-1], GOLD)
    hf.box(1.42, 0.0, 2.05, 0.78, 0.3, 0.32, GOLD)
    for lu, lw, lift in ((0.72, -0.2, 0.38), (0.72, 0.2, 0.0), (-0.72, -0.2, 0.0), (-0.72, 0.2, 0.0)):
        hf.box(lu + lift * 0.4, lw, lift, 0.14, 0.14, 1.12 - lift, GOLD)
    hf.box(-1.05, 0.0, 0.8, 0.2, 0.12, 0.6, GOLD)

# ------------------------------------------------------------------------------------------ west front, upper register
WU = Plane(fr, -42.9, 26.6, -H)
UPS = [(4.5, 10.9), (12.9, 19.5), (33.2, 39.8), (41.8, 48.2)]
UC0, UC1 = 21.15, 31.55
ZU, ZUC = 16.3, 15.9
arched_wall(WU, 2.8, 20.3, TER, UP, [(a, b, ZU, ZU, 'round', None) for a, b in UPS[:2]], WHITE, 0.6, MARBLE, back=GOLD, n=12)
arched_wall(WU, 20.3, 32.4, TER, UP + 0.5, [(UC0, UC1, 14.6, ZUC, 'round', None)], WHITE, 0.9, MARBLE, back=GLASS, n=14)
arched_wall(WU, 32.4, 49.2, TER, UP, [(a, b, ZU, ZU, 'round', None) for a, b in UPS[2:]], WHITE, 0.6, MARBLE, back=GOLD, n=12)
for a, b in UPS:
    mosaic(WU, a, b, ZU, ZU, -0.57, rows=2)
for s in (20.3, 32.4):
    fr.face_toward([WU.L(s, UP, 0.0), WU.L(s, UP, -1.0), WU.L(s, UP + 0.5, -1.0), WU.L(s, UP + 0.5, 0.0)], MARBLE,
                   vkit._toward(WU, -1.0 if s < 26 else 1.0, 0.0))
for k in range(1, 6):                                                 # mullions of the great window
    s = UC0 + k * (UC1 - UC0) / 6
    top = ZUC + math.sqrt(max(0.0, 5.2 ** 2 - (s - (UC0 + UC1) / 2) ** 2))
    WU.block(s - 0.07, 14.6, s + 0.07, top, -0.85, -0.7, WHITE)
for z in (16.9, 19.2):
    hw = math.sqrt(max(0.0, 5.2 ** 2 - max(0.0, z - ZUC) ** 2))
    WU.block((UC0 + UC1) / 2 - hw, z - 0.07, (UC0 + UC1) / 2 + hw, z + 0.07, -0.85, -0.7, WHITE)
for a, b in UPS:                                                      # small windows under the lunettes
    window(WU, (a + b) / 2, 14.0, 0.8, 1.6, 0.0)
for a, b in UPS:
    crowning(WU, a, b, ZU, 23.9, 0.06)
crowning(WU, UC0, UC1, ZUC, 25.9, 0.06, central=True)
for s in (11.9, 20.32, 32.38, 40.8):
    turret(WU, s, TER, 0.55, 27.0)
turret(WU, 1.7, TER, 1.55, 28.4, big=True)
turret(WU, 48.9, TER, 1.55, 28.4, big=True)

# ------------------------------------------------------------------------------------------ north front (Piazzetta dei Leoncini)
N = Plane(fr, -13.2, 26.6, PI)                         # s = -13.2 - u; faces north
NB = [(2.1, 8.8), (10.5, 15.2), (16.6, 21.7), (23.3, 29.5)]
front(N, 0.0, 32.7, NB, TER, 1.3, (4.4, STONE, MARBLE), 6.6)
fr.face_toward([N.L(0.0, -0.3, 0.0), N.L(0.0, -0.3, -1.3), N.L(0.0, TER, -1.3), N.L(0.0, TER, 0.0)], WHITE, vkit._toward(N, -1.0, 0.0))
terrace(N, 0.0, 32.7, 2.8)
NU = Plane(fr, -13.2, 23.8, PI)
NUB = [(2.4, 8.5), (10.4, 15.3), (16.5, 21.8), (23.4, 29.4)]
arched_wall(NU, 0.0, 29.7, TER, UP, [(a, b, 16.0, 16.0, 'round', None) for a, b in NUB], WHITE, 0.5, MARBLE, back=MARBLE, n=10)
for a, b in NUB:
    window(NU, (a + b) / 2, 16.4, 1.1, 2.3, -0.5)
    window(NU, (a + b) / 2, 14.0, 0.7, 1.4, 0.0)
    crowning(NU, a, b, 16.0, 23.0, 0.06)
for s in (9.45, 15.9, 22.6):
    turret(NU, s, TER, 0.5, 26.0)
turret(NU, 0.9, TER, 1.4, 27.0)

# ------------------------------------------------------------------------------------------ south: Zen chapel front, Treasury, pilasters
S = Plane(fr, -45.9, -23.6, 0.0)                       # s = u + 45.9; faces the Piazzetta (south)
front(S, 0.0, 22.2, [(3.4, 9.8), (12.3, 18.7)], TER, 1.0, (4.6, STONE, GOLD), 7.0)
terrace(S, 0.0, 22.2, 1.0)
SU = Plane(fr, -42.9, -22.6, 0.0)
SUB = [(1.8, 8.0), (10.6, 16.8)]
arched_wall(SU, 0.0, 19.2, TER, UP, [(a, b, 16.0, 16.0, 'round', None) for a, b in SUB], WHITE, 0.5, MARBLE, back=GOLD, n=10)
for a, b in SUB:
    mosaic(SU, a, b, 16.0, 16.0, -0.47, rows=2)
for a, b in SUB:
    window(SU, (a + b) / 2, 14.0, 0.7, 1.4, 0.0)
    crowning(SU, a, b, 16.0, 23.0, 0.06)
turret(SU, 9.3, TER, 0.5, 26.0)
turret(SU, 18.6, TER, 0.5, 26.0)
fr.face_toward([SU.L(19.2, TER, 0.0), SU.L(19.2, TER, 1.0), SU.L(19.2, UP, 1.0), SU.L(19.2, UP, 0.0)], MARBLE, (1.0, 0.0, 0.0))
# Treasury wall: marble panels with a blind arcade and a crenellated top
T = Plane(fr, -23.7, -31.8, 0.0)
for k in range(9):
    s0 = 1.0 + k * 4.2
    T.block(s0, 1.5, s0 + 3.2, 9.5, 0.0, 0.12, WHITE)
    T.poly(arch_curve('round', s0 + 0.5, s0 + 2.7, 7.2, None, 6)[::-1] + [(s0 + 0.5, 2.0), (s0 + 2.7, 2.0)][::-1], STONE, 0.14)
for k in range(30):
    T.block(0.4 + k * 1.25, TER, 0.4 + k * 1.25 + 0.6, TER + 0.9, -0.3, 0.1, WHITE)
for x, y in ((163.5, -87.1), (168.1, -86.0)):                         # Pilastri Acritani
    u, w = fr.uw(x, y)
    rot_box(fr, u, w, 0.0, 1.15, 1.15, 5.4, 0.0, WHITE)
    rot_box(fr, u, w, 5.4, 1.45, 1.45, 0.55, 0.0, WHITE)

# ------------------------------------------------------------------------------------------ arms: barrel roofs, brick lunettes
def barrel(u0, u1, w0, w1, along_u, z0=UP, z1=22.6, crown=25.6, ends=()):
    """An arm of the cross: brick walls from z0 to z1 and a segmental lead barrel up to `crown`,
    with brick lunette ends (three windows) where listed in `ends` ('a' = start, 'b' = end)."""
    if along_u:
        L0, L1, A0, A1 = u0, u1, w0, w1
    else:
        L0, L1, A0, A1 = w0, w1, u0, u1
    span = A1 - A0
    m = 8
    rise = crown - z1
    R = (span * span / 4 + rise * rise) / (2 * rise)
    prof = []
    for k in range(m + 1):
        x = A0 + span * k / m
        dx = x - (A0 + A1) / 2
        prof.append((x, z1 + math.sqrt(max(0.0, R * R - dx * dx)) - (R - rise)))

    def P(l, a, z):
        return (l, a, z) if along_u else (a, l, z)
    for x, z in ((A0, None), (A1, None)):
        q = [P(L0, x, z0), P(L1, x, z0), P(L1, x, z1), P(L0, x, z1)]
        fr.face_toward(q, BRICK, (0.0, x - (A0 + A1) / 2, 0.0) if along_u else (x - (A0 + A1) / 2, 0.0, 0.0), uvscale=2.0)
    for (x0, z0_), (x1, z1_) in zip(prof, prof[1:]):
        q = [P(L0, x0, z0_), P(L0, x1, z1_), P(L1, x1, z1_), P(L1, x0, z0_)]
        fr.face_toward(q, LEAD, (0.0, 0.0, 1.0), uvscale=4.0)
    for e in ends:
        l = L0 if e == 'a' else L1
        out = -1.0 if e == 'a' else 1.0
        pts = [P(l, A0, z0), P(l, A1, z0)] + [P(l, x, z) for x, z in reversed(prof)]
        fr.face_toward(pts, BRICK, (out, 0.0, 0.0) if along_u else (0.0, out, 0.0), uvscale=2.0)
        for k, off in enumerate((-3.4, 0.0, 3.4)):
            c = (A0 + A1) / 2 + off
            zt = (z1 + 1.6) if k != 1 else (z1 + 2.2)
            wpts = [(c - 0.55, z0 + 1.2), (c + 0.55, z0 + 1.2)] + [(c + 0.55 * math.cos(math.pi * i / 4), zt + 0.55 * math.sin(math.pi * i / 4)) for i in range(5)]
            fr.face_toward([P(l + out * 0.04, x, z) for x, z in wpts], GLASS, (out, 0.0, 0.0) if along_u else (0.0, out, 0.0))


barrel(-33.0, 29.8, -7.3, 7.3, True, ends=('b',))
barrel(-7.3, 7.3, -27.5, 27.5, False, ends=('a', 'b'))

# ------------------------------------------------------------------------------------------ the five domes
dome(-18.7, 0.0, 6.9, 24.6, 2.8)                 # west (Pentecost)
dome(18.0, 0.0, 6.7, 24.6, 2.8)                  # east (Emmanuel, over the presbytery)
dome(-0.2, 20.1, 6.2, 24.4, 2.6)                 # north (St John)
dome(0.5, -20.0, 6.2, 24.4, 2.6)                 # south (St Leonard)
dome(0.0, 0.0, 7.1, 25.2, 3.0, top_lantern=6.8, big=True)   # centre (Ascension)

vkit.emit(ctx, g, 'w138800932_San_Marco', samples=[fr.P(u, w)[:2] for u, w in ((-45.0, 25.0), (-45.0, -23.0), (0.0, 0.0))])
print(f'  [custom] Basilica di San Marco: {vkit.tris(g)} triangles', flush=True)
