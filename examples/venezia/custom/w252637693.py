"""Campanile di San Marco (OSM way 252637693, 98.6 m; its building:parts are hidden in overrides.json)
and the Loggetta del Sansovino at its foot (way 252637694). References in ../references/campanile/.

- Shaft: 12 m square of brick, 50 m, each face with corner pilasters and three slim pilaster strips
  framing four recessed panels, a column of small stair windows; on a low stone plinth.
- White Istrian-stone band (50–55 m): four round arches with shell niches per face over the pilasters,
  frieze and projecting cornice.
- Belfry (55–64.6 m): an open loggia, four arches per face on columns between wide corner piers, lion
  masks over the arches, a heavy entablature; the bells' dark chamber inside.
- Balustrade round the attic; attic (65–74.6 m) of brick in white frames with the reliefs: the winged
  lion of St Mark (north and south), Venice as Justice between lions (east and west).
- Pyramid spire (74.6–94.6 m) of green copper with white marble hips; the golden archangel Gabriel
  on a small pedestal, to 98.6 m.
- Loggetta (1537–49): three arches between paired columns on pedestals, bronze statues in the niches,
  an attic with reliefs and a balustrade, polychrome marble (red Verona, white Istrian, green); the
  terrace in front with its balustrade, steps and bronze gate.
Heights from OSM's mapped parts (shaft 50, belfry 55.3–66.7, attic cornice 73.8–74.6) and a frontal
photo of the west face (Aciarium, 2023).
"""
import inspect
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(inspect.currentframe().f_code.co_filename), 'lib'))
import vkit  # noqa: E402
from vkit import (BRICK, COPPER, GLASS, GOLD, ROSE, STONE, WHITE, Frame, Plane, arch_curve, arched_wall, balustrade,  # noqa: E402
                  figure, rot_box, winged_figure)

H, PI = math.pi / 2, math.pi
MARBLE = 'M_Wall_Stone_limestone_Blank'
GREEN = 'M_Wall_Stone_grey_Blank'
BRONZE = 'M_Roof_Metal_patina'
RED = 'M_Wall_Plaster_red_Blank'
BRICK_T = 'M_Wall_Brick_red_Blank'

g = Geo()
fr = Frame(g, 120.785, -107.245, math.atan2(4.02, 11.35))   # u faces ENE (the Basilica), w faces NNW
S = 6.0                                                    # half side of the shaft


def faces(half):
    """The four faces as planes (front facing out), with their outward direction name."""
    return [(Plane(fr, half, -half, H), 'E'), (Plane(fr, half, half, PI), 'N'), (Plane(fr, -half, half, -H), 'W'),
            (Plane(fr, -half, -half, 0.0), 'S')]


# ------------------------------------------------------------------------------------------ plinth and shaft
fr.box(0.0, 0.0, -0.3, 2 * S + 0.9, 2 * S + 0.9, 1.1, STONE)
fr.box(0.0, 0.0, 0.8, 2 * S + 0.3, 2 * S + 0.3, 0.6, WHITE)
for pl, name in faces(S):
    L = 2 * S
    pw = (L - 2.5 - 3 * 0.55) / 4
    pil = [(-0.22, 1.25)] + [(1.25 + pw * k + 0.55 * (k - 1), 1.25 + pw * k + 0.55 * k) for k in (1, 2, 3)] + [(L - 1.25, L + 0.22)]
    edges = [x for ab in pil for x in ab]
    for k, (a, b) in enumerate(pil):                         # pilasters: proud of the panels by 0.18 m
        pl.block(a, 1.4, b, 50.0, -0.01, 0.18 if 0 < k < 4 else 0.22, BRICK_T, uvscale=2.0)
    for a, b in zip(edges[1::2], edges[2::2]):               # recessed panels between them
        pl.quad(a, 1.4, b, 50.0, BRICK_T, 0.0, uvscale=2.0)
    # the stair windows in the first panel
    a, b = edges[1], edges[2]
    c = (a + b) / 2 if name in ('W', 'E') else (a + b) / 2 + 0.3
    for k in range(8):
        z = 6.0 + k * 5.0
        pts = [(c - 0.22, z), (c + 0.22, z), (c + 0.22, z + 0.85), (c, z + 1.05), (c - 0.22, z + 0.85)]
        pl.poly([(x, y) for x, y in pts], WHITE, 0.03)
        pl.poly([(c + (x - c) * 0.7, z + (y - z) * 0.85 + 0.05) for x, y in pts], GLASS, 0.06)

# ------------------------------------------------------------------------------------------ white band with shell arches (50–55.3)
for pl, name in faces(S):
    L = 2 * S
    ops = []
    for k in range(4):
        a = 1.25 + k * 2.55 + 0.05
        ops.append((a, a + 1.95, 50.6, 51.4, 'round', None))
    arched_wall(pl, -0.24, L + 0.24, 50.0, 54.2, ops, WHITE, 0.25, WHITE, back=WHITE, n=8, d=0.24)
    for a, b, zb, zs, kind, rise in ops:                     # shell fans in the niches
        c = (a + b) / 2
        for j in range(5):
            t0, t1 = PI * j / 5, PI * (j + 1) / 5
            pl.poly([(c, zs + 0.05), (c - 0.85 * math.cos(t0), zs + 0.85 * math.sin(t0)), (c - 0.85 * math.cos(t1), zs + 0.85 * math.sin(t1))],
                    MARBLE if j % 2 else WHITE, 0.09)
        vkit.arch_band(pl, a, b, zs, 'round', None, 0.18, WHITE, 0.24, 0.36, n=8)
ring = [(-S - 0.1, -S - 0.1), (S + 0.1, -S - 0.1), (S + 0.1, S + 0.1), (-S - 0.1, S + 0.1)]
fr.cornice([(x * 1.0, y * 1.0) for x, y in ring], 54.2, 1.1, 0.55, WHITE)

# ------------------------------------------------------------------------------------------ belfry (55.3–64.6)
BEL = S + 0.25
fr.box(0.0, 0.0, 55.3, 2 * BEL, 2 * BEL, 0.35, WHITE)
fr.box(0.0, 0.0, 55.65, 2 * S - 3.4, 2 * S - 3.4, 6.6, GLASS)        # the dark bell chamber
for k in range(3):                                                    # bells
    fr.revolve(-2.0 + 2.0 * k, 0.0, 58.4, [(0.0, 0.0), (0.75, 0.0), (0.55, 0.5), (0.42, 1.3), (0.2, 1.5), (0.0, 1.55)], 'M_Roof_Metal_patina', 10)
for pl, name in faces(BEL):
    L = 2 * BEL
    cw = 1.95                                                         # corner piers
    span = (L - 2 * cw) / 4
    ops = [(cw + k * span + 0.2, cw + (k + 1) * span - 0.2, 56.6, 59.9, 'round', None) for k in range(4)]
    arched_wall(pl, 0.0, L, 55.65, 62.3, ops, WHITE, 0.9, WHITE, back=None, n=8)
    for a, b, zb, zs, kind, rise in ops:
        vkit.arch_band(pl, a, b, zs, 'round', None, 0.2, WHITE, 0.0, 0.12, n=8)
    for k in range(5):                                                # columns (the middle one green marble)
        s = cw + k * span
        u, w, _ = pl.L(s, 0.0, -0.45)
        fr.cyl(u, w, 56.0, 0.2, 3.7, GREEN if k == 2 else WHITE, seg=8, cap=False)
        rot_box(fr, u, w, 59.6, 0.55, 0.55, 0.32, pl.ang, WHITE)
        rot_box(fr, u, w, 55.65, 0.5, 0.5, 0.35, pl.ang, WHITE)
        if 0 < k < 4:                                                 # lion masks over the arches
            pl.poly([(s - 0.3, 60.75), (s + 0.3, 60.75), (s + 0.32, 61.2), (s, 61.45), (s - 0.32, 61.2)], WHITE, 0.08)
    pl.block(0.0, 56.0, L, 56.7, 0.0, 0.08, WHITE)                    # sill band with the railing line
    pl.block(cw, 56.7, L - cw, 57.6, -0.5, -0.45, 'M_Roof_Metal_black')   # iron grilles (low)
ring = [(-BEL, -BEL), (BEL, -BEL), (BEL, BEL), (-BEL, BEL)]
fr.prism(ring, 62.3, 63.4, WHITE, top=False)
fr.cornice(ring, 63.4, 1.2, 0.6, WHITE)

# ------------------------------------------------------------------------------------------ balustrade and attic (64.6–74.6)
A = 5.05
fr.box(0.0, 0.0, 64.6, 2 * BEL, 2 * BEL, 0.05, STONE)
r = BEL - 0.25
for p, q in (((-r, -r), (r, -r)), ((r, -r), (r, r)), ((r, r), (-r, r)), ((-r, r), (-r, -r))):
    balustrade(fr, p, q, 64.6, 1.15, 0.5, WHITE, posts=2.9)
fr.box(0.0, 0.0, 64.6, 2 * A, 2 * A, 9.2, WHITE)
for pl, name in faces(A):
    L = 2 * A
    pl.quad(0.55, 65.3, L - 0.55, 72.6, BRICK_T, 0.06, uvscale=2.0)  # brick field in its white frame
    c = A
    if name in ('N', 'S'):                                            # winged lion of St Mark
        lion = [(-2.0, 0.0), (1.8, 0.0), (2.2, 0.8), (1.6, 1.3), (2.1, 2.3), (1.0, 1.9), (0.4, 3.0), (-0.3, 1.8), (-1.6, 1.6),
                (-2.3, 0.7)]
        pl.poly([(c + x, 67.3 + y) for x, y in lion], WHITE, 0.12)
        pl.block(c - 2.4, 66.6, c + 2.4, 67.3, 0.06, 0.2, WHITE)
    else:                                                             # Venice as Justice, seated between two lions
        pl.block(c - 0.75, 66.4, c + 0.75, 69.6, 0.06, 0.4, WHITE)
        pl.poly([(c - 0.35, 69.6), (c + 0.35, 69.6), (c + 0.3, 70.3), (c, 70.55), (c - 0.3, 70.3)], WHITE, 0.3)
        pl.block(c + 0.55, 69.6, c + 0.65, 71.2, 0.1, 0.3, GOLD)    # her sword
        for sx in (-1, 1):
            pl.poly([(c + sx * 0.9, 66.4), (c + sx * 2.1, 66.4), (c + sx * 2.1, 67.3), (c + sx * 1.6, 68.0), (c + sx * 1.05, 67.6)][::sx], WHITE, 0.1)
ring = [(-A, -A), (A, -A), (A, A), (-A, A)]
fr.cornice(ring, 73.8, 0.8, 0.45, WHITE)

# ------------------------------------------------------------------------------------------ spire and angel
B = 4.75                                              # half side of the spire's base
TOP = 94.6
corners = [(-B, -B), (B, -B), (B, B), (-B, B)]
apex = (0.0, 0.0, TOP)
BW = 1.05                                             # white marble bands along the hips
for i in range(4):                                    # each face: green copper field framed by white hips
    p0, p1 = corners[i], corners[(i + 1) % 4]
    ex, ey = (p1[0] - p0[0]) / (2 * B), (p1[1] - p0[1]) / (2 * B)
    a0 = (p0[0] + ex * BW, p0[1] + ey * BW, 74.6)
    a1 = (p1[0] - ex * BW, p1[1] - ey * BW, 74.6)
    mx, my = (p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2
    t = 0.8
    tip = (mx * (1 - t), my * (1 - t), 74.6 + (TOP - 74.6) * t)
    P0, P1 = (p0[0], p0[1], 74.6), (p1[0], p1[1], 74.6)
    fr.face([a0, a1, tip], COPPER, uvscale=3.0)
    fr.face([P0, a0, tip, apex], WHITE, uvscale=2.0)
    fr.face([a1, P1, apex, tip], WHITE, uvscale=2.0)
    for q0, q1 in ((P0, a0), (a1, P1)):               # a pink stripe down the middle of each band
        m0 = ((q0[0] + q1[0]) / 2, (q0[1] + q1[1]) / 2, 74.6)
        fr.face([(m0[0] - ex * 0.12, m0[1] - ey * 0.12, 74.6), (m0[0] + ex * 0.12, m0[1] + ey * 0.12, 74.6), (0.0, 0.0, TOP - 0.3)], ROSE)
fr.box(0.0, 0.0, TOP - 0.4, 1.1, 1.1, 0.9, WHITE)
fr.cyl(0.0, 0.0, TOP + 0.5, 0.45, 0.35, GOLD, seg=8)
winged_figure(fr, 0.0, 0.0, TOP + 0.85, 3.1, GOLD, a=0.0)
emit_samples = [fr.P(x, y)[:2] for x, y in ((-S, -S), (S, -S), (S, S), (-S, S))]
vkit.emit(ctx, g, 'w252637693_Campanile', samples=emit_samples)
print(f'  [custom] Campanile: {vkit.tris(g)} triangles', flush=True)

# ------------------------------------------------------------------------------------------ Loggetta del Sansovino
g2 = Geo()
lf = Frame(g2, 120.785, -107.245, fr.a)              # same axes as the tower; the Loggetta faces +u
L0, L1 = -7.55, 7.55                                  # along the tower's east face (w)
F = S + 5.5                                           # its front, 5.5 m out from the tower
lf.prism([(S, L0), (F, L0), (F, L1), (S, L1)], -0.3, 0.8, STONE)
lf.prism([(F, L0 - 0.4), (F + 4.4, L0 - 0.4), (F + 4.4, L1 + 0.4), (F, L1 + 0.4)], -0.3, 0.8, STONE)   # terrace
for k in range(5):                                                                                    # steps in the middle
    lf.box(F + 4.4 + 0.2 + 0.3 * k, 0.0, -0.3, 0.6, 3.2, 1.1 - 0.16 * (k + 1), STONE)
fp = Plane(lf, F, L1, -H)                             # its front: s = L1 - w, faces the Basilica
LW = L1 - L0
fp.block(0.0, 0.8, LW, 9.2, -5.5, 0.0, WHITE, uvscale=2.0)                 # body
bays = [(LW / 2 - 1.25 + (k - 1) * 4.4, LW / 2 + 1.25 + (k - 1) * 4.4) for k in range(3)]
for a, b in bays:                                                           # arches with dark loggia behind
    pl_pts = [(a, 0.8), (b, 0.8)] + arch_curve('round', a, b, 4.6, None, 8)[::-1]
    fp.poly(pl_pts, GLASS, 0.02)
    vkit.arch_band(fp, a, b, 4.6, 'round', None, 0.25, WHITE, 0.0, 0.18, n=8)
    fp.block(a + 0.5, 0.8, b - 0.5, 2.1, 0.02, 0.1, 'M_Roof_Metal_black')   # bronze gates
for k in range(4):                                                          # paired columns on pedestals, statues between
    s = 0.95 + k * 4.4 + (0.0 if k == 0 else 0.0)
    for dx in (-0.55, 0.55):
        u, w, _ = fp.L(s + dx, 0.0, 0.45)
        rot_box(lf, u, w, 0.8, 0.62, 0.62, 1.4, lf.a, ROSE)
        lf.cyl(u, w, 2.2, 0.2, 3.3, ROSE if k % 2 else GREEN, seg=8, cap=False)
        rot_box(lf, u, w, 5.5, 0.55, 0.55, 0.35, lf.a, WHITE)
    fp.block(s - 0.32, 2.4, s + 0.32, 5.0, -0.2, 0.02, GREEN)                # niche
    u, w, _ = fp.L(s, 0.0, 0.18)
    figure(lf, u, w, 2.45, 1.9, BRONZE, seg=6)
fp.block(-0.1, 5.85, LW + 0.1, 6.75, 0.0, 0.55, WHITE)                      # entablature
fp.block(0.2, 6.75, LW - 0.2, 8.6, 0.0, 0.3, ROSE)                          # attic with three reliefs
for a, b in bays:
    fp.block(a - 0.2, 7.0, b + 0.2, 8.35, 0.3, 0.38, WHITE)
fp.block(-0.1, 8.6, LW + 0.1, 8.95, 0.0, 0.45, WHITE)
balustrade(lf, fp.L(0.2, 0.0, 0.2)[:2], fp.L(LW - 0.2, 0.0, 0.2)[:2], 8.95, 0.95, 0.42, WHITE, posts=3.8)
# terrace front: balustrade with the bronze gate in the middle
balustrade(lf, (F + 4.3, L0 - 0.3), (F + 4.3, -1.7), 0.8, 1.0, 0.42, ROSE, posts=3.0)
balustrade(lf, (F + 4.3, 1.7), (F + 4.3, L1 + 0.3), 0.8, 1.0, 0.42, ROSE, posts=3.0)
lf.box(F + 4.3, 0.0, 0.8, 0.12, 3.4, 1.0, BRONZE, top=False)
vkit.emit(ctx, g2, 'w252637694_Loggetta', samples=[lf.P(F, 0.0)[:2], lf.P(F + 4.0, L0)[:2]])
print(f'  [custom] Loggetta: {vkit.tris(g2)} triangles', flush=True)
