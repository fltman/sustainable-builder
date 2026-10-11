"""Santa Maria della Salute (OSM way 138801509, Longhena 1631–87; its building:parts and the generated
remainder are hidden in overrides.json, so this script draws the whole church). References in
../references/salute/ (NOTES.md: sources and sizes).

- Plan from OSM: the octagon (15.3 m sides, 18.5 m to the face centres) facing the Grand Canal, the
  presbytery behind it with its semicircular side apses and the second dome, the two bell towers at
  its back corners, the choir beyond.
- The main front: a triumphal arch with four giant columns on high pedestals, the great arched door,
  niches with statues, the pediment with a roundel and statues; the six chapel fronts on the other
  faces, each with a lower order, a thermal window and a pediment with statues; all white Istrian stone.
- The broad flights of steps down to the campo and the canal.
- Above the octagon's cornice and balustrade: the ring of sixteen great scroll volutes ("orecchioni")
  on eight buttresses with statues, the drum with sixteen arched windows and a balustrade, the lead
  dome (ribbed, 25 m across, ~45 m high), the lantern with its obelisks, little dome and the Virgin
  (~57 m, OSM).
- Behind: the presbytery's drum and smaller lead dome with lantern and statue, the two white bell
  towers with arched belfries and lead onion tops.
"""
import inspect
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(inspect.currentframe().f_code.co_filename), 'lib'))
import vkit  # noqa: E402
from vkit import (GLASS, GOLD, LEAD, STONE, WHITE, Frame, Plane, arch_curve, arched_wall, balustrade, figure,  # noqa: E402
                  rot_box)

H, PI = math.pi / 2, math.pi
MARBLE = 'M_Wall_Stone_limestone_Blank'
DOOR = 'M_Wall_Wood_brown_Blank'
BRONZE = 'M_Roof_Metal_patina'
DOMEMAT = 'M_Wall_Metal_grey_Blank'        # weathered lead sheets: light, ribbed

g = Geo()
fr = Frame(g, -217.27, -480.86, math.radians(2.0))     # u east, w north (the front faces the canal)
P0 = 1.6                                                # the church's floor: the platform over the campo
RI = 18.45                                              # octagon: distance to the face centres
RC = RI / math.cos(math.pi / 8)
SIDE = 2 * RI * math.tan(math.pi / 8)
CORN, ENT = 14.8, 17.4                                  # main order: capitals, top of the entablature


def face_plane(k, r=RI):
    """The octagon face k (0 = east, 2 = north/front, 4 = west, 6 = south), front facing out, s = 0..side."""
    th = k * math.pi / 4
    rc = r / math.cos(math.pi / 8)
    a0 = th - math.pi / 8
    return Plane(fr, rc * math.cos(a0), rc * math.sin(a0), th + H)


def octagon(r):
    rc = r / math.cos(math.pi / 8)
    return [(rc * math.cos(math.pi / 8 + k * math.pi / 4), rc * math.sin(math.pi / 8 + k * math.pi / 4)) for k in range(8)]


def statue_on(pl, s, z, d, h=2.1):
    u, w, _ = pl.L(s, 0.0, d)
    rot_box(fr, u, w, z, 0.6, 0.6, 0.45, pl.ang, WHITE)
    figure(fr, u, w, z + 0.45, h, WHITE, seg=5)


# ------------------------------------------------------------------------------------------ platform and steps
RP = 23.0                                               # the platform's octagon
fr.prism(octagon(RP), -0.4, P0, STONE, top=True)
for k in (1, 2, 3):
    pl = face_plane(k, RP)
    L = 2 * RP * math.tan(math.pi / 8)
    for i in range(10):
        z = P0 - (i + 1) * P0 / 10
        d0, d1 = i * 0.45, (i + 1) * 0.45
        pl.block(-d1 * 0.4142, z - 0.3, L + d1 * 0.4142, z + P0 / 10, d0, d1, STONE if i % 2 else MARBLE)

# ------------------------------------------------------------------------------------------ octagon walls, chapels, front
for k in range(8):
    pl = face_plane(k)
    pl.quad(-0.05, P0, SIDE + 0.05, CORN, WHITE, 0.0)
    pl.block(-0.3, CORN, SIDE + 0.3, ENT, -0.2, 0.55, WHITE)                    # entablature round the octagon
    for s in (0.6, SIDE - 0.6):                                                 # corner pilasters
        pl.block(s - 0.6, P0, s + 0.6, CORN, 0.0, 0.35, WHITE)
    if k in (2, 6):
        continue
    # a chapel front: lower order with niches, door, thermal window, pediment with statues
    c = SIDE / 2
    a, b, D = c - 5.3, c + 5.3, 3.6
    pl.block(a, P0, b, 13.6, -0.1, D, WHITE)
    cf = pl.sub(0.0, D)
    for s in (a + 0.55, a + 2.6, b - 2.6, b - 0.55):
        cf.block(s - 0.45, P0, s + 0.45, 9.0, 0.0, 0.3, WHITE)
        rot_box(fr, *cf.L(s, 0.0, 0.2)[:2], 8.4, 1.0, 1.0, 0.6, cf.ang, WHITE)
    cf.block(a - 0.2, 9.0, b + 0.2, 9.9, -0.05, 0.45, WHITE)                    # cornice of the lower order
    door = arch_curve('round', c - 1.4, c + 1.4, 5.0, None, 8)
    cf.poly([(c - 1.4, P0), (c + 1.4, P0)] + door[::-1], DOOR, 0.04)
    for s in (a + 1.58, b - 1.58):                                              # niches with statues
        nich = arch_curve('round', s - 0.55, s + 0.55, 6.0, None, 6)
        cf.poly([(s - 0.55, 3.4), (s + 0.55, 3.4)] + nich[::-1], STONE, 0.03)
        figure(fr, *cf.L(s, 0.0, 0.25)[:2], 3.5, 2.4, WHITE, seg=5)
    therm = arch_curve('round', c - 3.3, c + 3.3, 10.1, None, 10)              # the thermal window
    cf.poly([(c - 3.3, 10.1), (c + 3.3, 10.1)] + therm[::-1], GLASS, 0.04)
    vkit.arch_band(cf, c - 3.3, c + 3.3, 10.1, 'round', None, 0.35, WHITE, 0.0, 0.2, n=10)
    for s in (c - 1.1, c + 1.1):
        top = 10.1 + math.sqrt(max(0.0, 3.3 ** 2 - (s - c) ** 2))
        cf.block(s - 0.1, 10.1, s + 0.1, top, 0.04, 0.12, WHITE)
    cf.block(a - 0.3, 13.6, b + 0.3, 14.1, -0.1, 0.4, WHITE)
    cf.slab([(a - 0.3, 14.1), (b + 0.3, 14.1), (c, 16.7)], WHITE, -0.1, 0.35)    # pediment
    vkit.disc(cf, c, 15.0, 0.5, STONE, 0.38, n=10)
    roof_l, roof_r = pl.L(a - 0.3, 14.1, D + 0.2), pl.L(b + 0.3, 14.1, D + 0.2)
    ridge0, ridge1 = pl.L(c, 16.7, D + 0.2), pl.L(c, 16.7, -0.5)
    fr.face([roof_l, ridge0, ridge1, pl.L(a - 0.3, 14.1, -0.5)][::-1], LEAD)
    fr.face([roof_r, pl.L(b + 0.3, 14.1, -0.5), ridge1, ridge0][::-1], LEAD)
    for s, z in ((a, 14.1), (b, 14.1), (c, 16.6)):
        statue_on(cf, s, z, 0.1, 2.0)

# the main front (north face): the triumphal arch
pl = face_plane(2)
c = SIDE / 2
F = 4.6
pl.block(-1.7, P0, SIDE + 1.7, ENT, -0.2, F, WHITE)
mf = pl.sub(0.0, F)
for s in (c - 7.9, c - 4.1, c + 4.1, c + 7.9):                                 # pedestals and giant columns
    mf.block(s - 1.0, P0, s + 1.0, 5.2, 0.0, 1.0, WHITE)
    u, w, _ = mf.L(s, 0.0, 0.45)
    fr.cyl(u, w, 5.2, 0.78, CORN - 5.2 - 0.9, WHITE, seg=12, cap=False)
    rot_box(fr, u, w, CORN - 0.9, 1.9, 1.9, 0.9, mf.ang, WHITE)                  # capital
door = arch_curve('round', c - 2.7, c + 2.7, 10.4, None, 12)
mf.poly([(c - 2.7, P0), (c + 2.7, P0)] + door[::-1], GLASS, 0.05)
mf.quad(c - 2.4, P0, c + 2.4, 9.6, 'M_Roof_Metal_black', 0.08)                   # the dark bronze doors under the lunette
vkit.arch_band(mf, c - 2.7, c + 2.7, 10.4, 'round', None, 0.55, WHITE, 0.0, 0.3, n=12)
for s in (c - 6.0, c + 6.0):                                                    # two tiers of niches with statues
    for z0 in (5.6, 10.2):
        nich = arch_curve('round', s - 0.65, s + 0.65, z0 + 2.4, None, 6)
        mf.poly([(s - 0.65, z0), (s + 0.65, z0)] + nich[::-1], STONE, 0.04)
        figure(fr, *mf.L(s, 0.0, 0.3)[:2], z0 + 0.1, 2.4, WHITE, seg=5)
for x in (-1, 1):                                                               # figures in the spandrels
    mf.poly([(c + x * 3.0, 13.0), (c + x * 3.9, 13.0), (c + x * 3.6, 14.2), (c + x * 3.0, 14.4)][::x], WHITE, 0.25)
mf.block(-1.9, CORN, SIDE + 1.9, ENT, -0.2, 0.5, WHITE)
mf.slab([(c - 5.0, ENT), (c + 5.0, ENT), (c, ENT + 2.8)], WHITE, -0.2, 0.4)    # the pediment
vkit.disc(mf, c, ENT + 1.0, 0.6, STONE, 0.43, n=10)
for s, z in ((c, ENT + 2.7), (c - 5.0, ENT), (c + 5.0, ENT), (c - 7.9, ENT), (c + 7.9, ENT)):
    statue_on(mf, s, z, 0.2, 2.4)
fr.face([pl.L(-1.7, ENT, 0.0), pl.L(SIDE + 1.7, ENT, 0.0), pl.L(SIDE + 1.7, ENT, F), pl.L(-1.7, ENT, F)][::-1], LEAD)

# ------------------------------------------------------------------------------------------ cornice balustrade, ring roof, attic
oc = octagon(RI - 0.3)
for i in range(8):
    if i == 2:
        continue
    p, q = oc[i - 1], oc[i]                     # face i runs from vertex i-1 to vertex i
    balustrade(fr, p, q, ENT, 1.05, 0.55, WHITE, posts=SIDE / 3)
RA = 13.2                                                                        # the attic octagon
outer, inner = octagon(RI - 0.4), octagon(RA)
fr.frustum(outer, inner, ENT, 20.2, LEAD, top=False, uvscale=4.0)
fr.prism(octagon(RA), ENT, 23.2, WHITE, top=False)
fr.cornice(octagon(RA), 22.6, 0.6, 0.35, WHITE)

# the eight buttresses with sixteen scroll volutes ("orecchioni") and their statues
for k in range(8):
    th = math.pi / 8 + k * math.pi / 4
    c_, s_ = math.cos(th), math.sin(th)
    rad = Plane(fr, 12.4 * c_ - 0.7 * s_, 12.4 * s_ + 0.7 * c_, th)              # radial plane, s outwards from the drum
    prof = [(0.0, 20.0), (6.4, 17.2), (6.9, 18.9), (6.3, 21.6), (4.3, 22.9), (2.8, 24.5), (1.8, 26.4), (0.9, 27.4), (0.0, 27.4)]
    rad.slab(prof[::-1] if vkit._area(prof) < 0 else prof, WHITE, -0.2, 1.6, back=True)
    for side, dd in ((1, 1.62), (-1, -0.22)):                                    # the spiral "ears" on both faces
        for j, (rr, mat) in enumerate(((2.75, WHITE), (2.15, STONE), (1.55, WHITE), (0.95, STONE), (0.4, WHITE))):
            pts = [(4.4 + rr * math.cos(math.tau * i / 16), 20.4 + rr * math.sin(math.tau * i / 16)) for i in range(16)]
            rad.poly(pts if side > 0 else pts[::-1], mat, dd + side * 0.05 * (j + 1))
    u, w, _ = rad.L(1.2, 0.0, 0.7)
    rot_box(fr, u, w, 27.4, 0.8, 0.8, 0.5, th, WHITE)
    figure(fr, u, w, 27.9, 2.4, WHITE, seg=5)

# ------------------------------------------------------------------------------------------ drum, dome, lantern
RD = 12.5
fr.revolve(0.0, 0.0, 23.0, [(RD, 0.0), (RD, 6.6)], WHITE, 16, smooth=False, a0=math.pi / 16, around=16, vlen=3.0)
for i in range(16):
    t = math.tau * i / 16
    pl = Plane(fr, RD * math.cos(t - math.pi / 16), RD * math.sin(t - math.pi / 16), t + H)
    Ls = 2 * RD * math.sin(math.pi / 16)
    m = Ls / 2
    win = arch_curve('round', m - 0.85, m + 0.85, 27.2, None, 6)
    pl.poly([(m - 1.15, 24.2), (m + 1.15, 24.2)] + arch_curve('round', m - 1.15, m + 1.15, 27.2, None, 6)[::-1], WHITE, 0.04)
    pl.poly([(m - 0.85, 24.5), (m + 0.85, 24.5)] + win[::-1], GLASS, 0.07)
    pl.block(-0.32, 23.0, 0.32, 29.6, 0.0, 0.3, WHITE)                          # pilasters between the windows
fr.cornice([(RD * math.cos(math.tau * i / 16 + math.pi / 16), RD * math.sin(math.tau * i / 16 + math.pi / 16)) for i in range(16)][::1],
           29.6, 0.8, 0.45, WHITE)
ring = [(12.7 * math.cos(math.tau * i / 16), 12.7 * math.sin(math.tau * i / 16)) for i in range(16)]
for p, q in zip(ring, ring[1:] + ring[:1]):
    balustrade(fr, p, q, 30.4, 1.0, 0.62, WHITE)
fr.revolve(0.0, 0.0, 30.4, [(12.6, 0.0), (12.0, 0.05)], LEAD, 48, smooth=False, around=12, vlen=4.0)
DOME = [(12.0, 0.0), (12.0, 1.2), (11.75, 3.2), (11.15, 5.4), (10.1, 7.6), (8.6, 9.6), (6.6, 11.4), (4.5, 12.6), (3.3, 13.2)]
fr.revolve(0.0, 0.0, 30.45, DOME, DOMEMAT, 48, smooth=True, around=2, vlen=16.0)
for i in range(16):                                                              # small dormer oculi on the dome
    t = math.tau * (i + 0.5) / 16
    for r_, z_ in ((11.55, 34.0),):
        u, w = r_ * math.cos(t), r_ * math.sin(t)
        fr.revolve(u, w, z_, [(0.0, 0.0), (0.32, 0.0), (0.32, 0.7), (0.0, 0.9)], WHITE, 5, smooth=False, around=1, vlen=1.0)
# lantern
ZL0 = 43.6
fr.revolve(0.0, 0.0, ZL0, [(3.6, 0.0), (3.6, 0.6), (3.0, 0.7)], WHITE, 16, smooth=False, around=4, vlen=2.0)
fr.revolve(0.0, 0.0, ZL0 + 0.7, [(2.7, 0.0), (2.7, 4.6)], GLASS, 8, smooth=False, a0=math.pi / 8, around=4, vlen=2.0)
for i in range(8):                                                               # its columns and the obelisks round it
    t = math.tau * i / 8
    fr.cyl(3.0 * math.cos(t), 3.0 * math.sin(t), ZL0 + 0.7, 0.22, 4.4, WHITE, seg=6, cap=False)
    u, w = 3.45 * math.cos(t + math.pi / 8), 3.45 * math.sin(t + math.pi / 8)
    fr.revolve(u, w, ZL0 + 0.7, [(0.22, 0.0), (0.0, 2.6)], WHITE, 4, smooth=False, around=1, vlen=2.0)
fr.revolve(0.0, 0.0, ZL0 + 5.1, [(3.25, 0.0), (3.35, 0.45), (2.9, 0.6), (2.9, 1.2), (2.5, 2.2), (1.6, 3.0), (0.55, 3.4), (0.0, 3.45)], LEAD, 16,
           smooth=True, around=4, vlen=2.0)
fr.cyl(0.0, 0.0, ZL0 + 8.5, 0.4, 0.7, WHITE, seg=8)
figure(fr, 0.0, 0.0, ZL0 + 9.2, 3.0, BRONZE, seg=6)                             # the Virgin as "Capitana da Mar"
fr.cyl(0.0, 0.0, ZL0 + 12.0, 0.45, 0.05, GOLD, seg=8, smooth=False)

# ------------------------------------------------------------------------------------------ presbytery, second dome, bell towers, choir
PU, PW = 0.6, -25.6                                                              # the presbytery's centre
fr.prism([(PU - 9.8, -18.0), (PU + 9.8, -18.0), (PU + 9.8, -33.0), (PU - 9.8, -33.0)], P0 - 1.6, 18.4, WHITE, top=False)
fr.face([(PU - 9.8, -18.0, 18.4), (PU + 9.8, -18.0, 18.4), (PU + 9.8, -33.0, 18.4), (PU - 9.8, -33.0, 18.4)][::-1], LEAD)
for sx in (-1, 1):                                                               # the side apses with half-dome roofs
    cu = PU + sx * 9.8
    seg = 10
    half = [(cu + sx * 6.85 * math.sin(math.pi * i / seg), PW + 6.85 * math.cos(math.pi * i / seg)) for i in range(seg + 1)]
    for p, q in zip(half, half[1:]):
        fr.face_toward([(p[0], p[1], 0.0), (q[0], q[1], 0.0), (q[0], q[1], 15.0), (p[0], p[1], 15.0)], WHITE,
                       ((p[0] + q[0]) / 2 - cu, (p[1] + q[1]) / 2 - PW, 0.0))
    for i in range(seg):
        a0, a1 = math.pi * i / seg, math.pi * (i + 1) / seg
        for j in range(3):
            e0, e1 = math.pi / 2 * j / 3, math.pi / 2 * (j + 1) / 3
            pts = [(cu + sx * 6.85 * math.cos(e) * math.sin(a), PW + 6.85 * math.cos(e) * math.cos(a), 15.0 + 4.0 * math.sin(e)) for a, e in
                   ((a0, e0), (a1, e0), (a1, e1), (a0, e1))]
            fr.face_toward(pts, LEAD, (sx * math.sin((a0 + a1) / 2), math.cos((a0 + a1) / 2), 0.6))
fr.revolve(PU, PW, 18.4, [(7.2, 0.0), (7.2, 9.0), (7.6, 9.2), (7.6, 9.8)], WHITE, 24, smooth=False, around=8, vlen=3.0)   # second drum
for i in range(8):
    t = math.tau * (i + 0.5) / 8
    c_, s_ = math.cos(t), math.sin(t)
    pts = [(-0.7, 21.0), (0.7, 21.0)] + [(0.7 * math.cos(math.pi * j / 6), 24.4 + 0.7 * math.sin(math.pi * j / 6)) for j in range(7)]
    fr.face([(PU + 7.23 * c_ - x * s_, PW + 7.23 * s_ + x * c_, z) for x, z in pts], GLASS)
DOME2 = [(7.0, 0.0), (7.0, 0.8), (6.75, 2.6), (6.1, 4.6), (5.0, 6.4), (3.4, 7.8), (1.7, 8.6), (1.4, 8.7)]
fr.revolve(PU, PW, 28.2, DOME2, DOMEMAT, 32, smooth=True, around=1, vlen=12.0)
fr.revolve(PU, PW, 36.85, [(1.6, 0.0), (1.6, 2.6), (1.85, 2.8), (1.4, 3.6), (0.5, 4.4), (0.0, 4.5)], WHITE, 10, smooth=False, around=2, vlen=2.0)
figure(fr, PU, PW, 41.3, 2.3, WHITE, seg=6)
for tu, tw in ((PU - 10.8, -35.0), (PU + 10.8, -35.0)):                          # the bell towers
    S2 = 2.3
    fr.box(tu, tw, 0.0, 2 * S2, 2 * S2, 33.0, WHITE)
    for k in range(4):
        th = k * H
        pl = Plane(fr, tu + S2 * math.cos(th - math.pi / 4) * math.sqrt(2), tw + S2 * math.sin(th - math.pi / 4) * math.sqrt(2), th + H)
        for s0 in (0.0, 2 * S2 - 0.55):
            pl.block(s0, P0, s0 + 0.55, 33.0, 0.0, 0.18, WHITE)
        for z in (12.0, 20.0, 27.0):
            pl.quad(S2 - 0.35, z, S2 + 0.35, z + 1.4, GLASS, 0.03)
        pl.block(-0.15, 32.5, 2 * S2 + 0.15, 33.2, -0.1, 0.25, WHITE)
        arched_wall(pl, 0.0, 2 * S2, 33.2, 37.4, [(0.55, 2.1, 33.6, 35.6, 'round', None), (2.5, 4.05, 33.6, 35.6, 'round', None)],
                    WHITE, 0.6, WHITE, back=GLASS, n=6)
    fr.box(tu, tw, 37.4, 2 * S2 + 0.5, 2 * S2 + 0.5, 0.5, WHITE)
    fr.revolve(tu, tw, 37.9, [(1.9, 0.0), (1.9, 0.7), (2.2, 1.1), (2.0, 2.0), (1.3, 2.9), (0.5, 3.4), (0.35, 3.6)], LEAD, 12, smooth=True, around=3,
               vlen=1.5)
    fr.cyl(tu, tw, 41.5, 0.35, 0.9, WHITE, seg=6)
    rot_box(fr, tu, tw, 42.4, 0.08, 0.08, 1.6, 0.0, GOLD)
    rot_box(fr, tu, tw, 43.4, 0.7, 0.08, 0.08, 0.0, GOLD)
CHOIR = [(-12.5, -33.0), (12.0, -33.0), (12.0, -46.5), (-12.5, -46.5)]
fr.prism(CHOIR, 0.0, 15.0, WHITE, top=False)
vkit.hip_roof(fr, -12.8, 12.3, -46.8, -33.0, 15.0, 3.2, LEAD, hip=(True, True))

vkit.emit(ctx, g, 'w138801509_Salute', samples=[fr.P(u, w)[:2] for u, w in ((0.0, 27.0), (-19.0, 12.0), (19.0, 12.0))])
print(f'  [custom] Santa Maria della Salute: {vkit.tris(g)} triangles', flush=True)
