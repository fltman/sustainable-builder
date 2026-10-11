"""Ponte di Rialto (OSM building=bridge way 1287188470 and its building:parts – shops, portico and roofs –
hidden in overrides.json; Antonio da Ponte, 1588–91). References in ../references/rialto/.

- One segmental stone arch over the Grand Canal: 28.8 m span, 7.3 m rise from the water, the arch
  ring and spandrels of white Istrian stone with a cornice, on abutments resting on both banks.
- 48 m long and 22.7 m wide (OSM outline), three stepped walkways: the central street between two
  rows of six shops each, and the two outer walkways along the balustrades.
- The shops: arcaded fronts on the central street, two round arches on each outer wall, lead roofs
  that step down with the bridge from the centre (OSM: 11, 9 and 7 m).
- The central portico at the crown: open arches on all four sides, a pediment towards each side of
  the canal (the bridge's famous silhouette), lead gabled roof (~15 m).
"""
import inspect
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(inspect.currentframe().f_code.co_filename), 'lib'))
import vkit  # noqa: E402
from vkit import GLASS, LEAD, STONE, WHITE, Frame, Plane, arch_curve, arched_wall, rot_box  # noqa: E402

H, PI = math.pi / 2, math.pi
MARBLE = 'M_Wall_Stone_limestone_Blank'
g = Geo()
fr = Frame(g, -122.6, 339.8, math.atan2(-0.637, 0.769))   # u along the bridge (to the San Marco side), w across
HALF, W2 = 23.85, 11.35                                     # half length, half width
WZ = ctx.data.get('water_z', -1.2)
CROWN = 7.2                                                 # walkway at the crown
PORT = 3.6                                                  # half length of the central portico
CS, CO = 3.45, 8.35                                         # central street half width, shops' outer walls


def deck(u):
    """The walkway's height along the bridge: flat under the portico, curving down to the banks."""
    t = max(0.0, (abs(u) - PORT) / (HALF - PORT))
    return 0.3 + (CROWN - 0.3) * (1 - t ** 1.7)


def stepped(u0, u1, n):
    """Step edges between u0 and u1 (outwards from the centre) with their heights."""
    return [(u0 + (u1 - u0) * k / n, deck(u0 + (u1 - u0) * (k + 0.5) / n)) for k in range(n)] + [(u1, None)]


# ------------------------------------------------------------------------------------------ arch, spandrels, abutments
AC, SPAN = 0.45, 28.8
A0, A1 = AC - SPAN / 2, AC + SPAN / 2
RISE = CROWN - 1.2 - WZ
arch = arch_curve('round', A0, A1, WZ, RISE, 18)            # a segmental arch: semi-ellipse with the rise
for (ua, za), (ub, zb) in zip(arch, arch[1:]):                # the intrados (underside of the barrel)
    fr.face([(ua, W2, za), (ub, W2, zb), (ub, -W2, zb), (ua, -W2, za)], WHITE, uvscale=2.0)


def bottom(u):
    """The underside of the bridge's side walls: the arch where it spans, below the bank elsewhere."""
    if u <= A0 or u >= A1:
        return WZ - 0.6
    x = (u - AC) / (SPAN / 2)
    return WZ + RISE * math.sqrt(max(0.0, 1 - x * x))

for side in (-1, 1):
    pl = Plane(fr, -HALF, side * W2, 0.0) if side < 0 else Plane(fr, HALF, side * W2, PI)
    # spandrel wall: from the water and the arch up to the walkway (plus the cornice line)
    pts_top = [(-HALF + (2 * HALF) * k / 40, deck(-HALF + (2 * HALF) * k / 40) - 0.15) for k in range(41)]
    for (ua, za), (ub, zb) in zip(pts_top, pts_top[1:]):
        q = [(ua, bottom(ua)), (ub, bottom(ub)), (ub, zb), (ua, za)]
        s = (lambda u: u + HALF) if side < 0 else (lambda u: HALF - u)
        poly = [(s(u), z) for u, z in q]
        pl.poly(poly if vkit._area(poly) > 0 else poly[::-1], WHITE, 0.0, uvscale=2.5)
    # the arch ring standing slightly proud, with a keystone; the cornice under the balustrade
    for (ua, za), (ub, zb) in zip(arch, arch[1:]):
        s0 = (ua + HALF) if side < 0 else (HALF - ua)
        s1 = (ub + HALF) if side < 0 else (HALF - ub)
        pl.poly([(s0, za), (s1, zb), (s1, zb + 1.15), (s0, za + 1.15)] if s1 > s0 else [(s1, zb), (s0, za), (s0, za + 1.15), (s1, zb + 1.15)],
                MARBLE, 0.12)
    for (ua, za), (ub, zb) in zip(pts_top, pts_top[1:]):
        s0 = (ua + HALF) if side < 0 else (HALF - ua)
        s1 = (ub + HALF) if side < 0 else (HALF - ub)
        a, b = min(s0, s1), max(s0, s1)
        za_, zb_ = (za, zb) if s0 < s1 else (zb, za)
        pl.poly([(a, za_ - 0.45), (b, zb_ - 0.45), (b, zb_ + 0.12), (a, za_ + 0.12)], WHITE, 0.22)
# ends of the bridge: the abutment faces down to the bank
for su in (-1, 1):
    u = su * HALF
    fr.face_toward([(u, -W2, -0.6), (u, W2, -0.6), (u, W2, deck(u)), (u, -W2, deck(u))], WHITE, (su, 0.0, 0.0))

# ------------------------------------------------------------------------------------------ walkways (steps)
for side in (-1, 1):
    for (w0, w1) in ((-W2, -CO), (-CS, CS), (CO, W2)):
        edges = stepped(side * PORT, side * HALF, 22)
        for (ua, za), (ub, _) in zip(edges, edges[1:]):
            fr.face([(ua, w0, za), (ub, w0, za), (ub, w1, za), (ua, w1, za)][::(1 if side > 0 else -1)], STONE)
            zl = deck(ub + side * (HALF - PORT) / 44)
            fr.face_toward([(ub, w0, zl), (ub, w1, zl), (ub, w1, za), (ub, w0, za)], STONE, (side, 0.0, 0.0))
fr.face([(-PORT, -W2, CROWN), (PORT, -W2, CROWN), (PORT, W2, CROWN), (-PORT, W2, CROWN)], STONE)

# ------------------------------------------------------------------------------------------ outer balustrades (sloping)
for wside in (-1, 1):
    w = wside * (W2 - 0.2)
    us = [-HALF + 0.3 + (2 * HALF - 0.6) * k / 60 for k in range(61)]
    for ua, ub in zip(us, us[1:]):
        za, zb = deck(ua), deck(ub)
        for z0, z1 in ((0.0, 0.16), (0.9, 1.05)):
            fr.face_toward([(ua, w, za + z0), (ub, w, zb + z0), (ub, w, zb + z1), (ua, w, za + z1)], WHITE, (0.0, wside, 0.0))
            fr.face_toward([(ua, w - wside * 0.25, za + z0), (ub, w - wside * 0.25, zb + z0), (ub, w - wside * 0.25, zb + z1),
                            (ua, w - wside * 0.25, za + z1)], WHITE, (0.0, -wside, 0.0))
        fr.face([(ua, w, za + 1.05), (ub, w, zb + 1.05), (ub, w - wside * 0.25, zb + 1.05), (ua, w - wside * 0.25, za + 1.05)][::wside], WHITE)
        for k in range(2):
            u = ua + (ub - ua) * (k + 0.5) / 2
            z = deck(u)
            fr.face([(u - 0.06, w - wside * 0.12, z + 0.16), (u + 0.06, w - wside * 0.12, z + 0.16), (u + 0.09, w - wside * 0.12, z + 0.45),
                     (u + 0.05, w - wside * 0.12, z + 0.9), (u - 0.05, w - wside * 0.12, z + 0.9), (u - 0.09, w - wside * 0.12, z + 0.45)], WHITE)

# ------------------------------------------------------------------------------------------ the two rows of shops
SH = 4.3                                                     # shop height over the walkway (eaves)
for wside in (-1, 1):
    wi, wo = wside * CS, wside * CO
    for uside in (-1, 1):
        for k in range(3):
            u0 = uside * (PORT + k * (HALF - PORT) / 3)
            u1 = uside * (PORT + (k + 1) * (HALF - PORT) / 3)
            if u1 < u0:
                u0, u1 = u1, u0
            zf0, zf1 = deck(u0), deck(u1)
            zr0, zr1 = zf0 + SH, zf1 + SH
            # outer wall (towards the side walkway) with two arched openings, inner wall with three arcades
            for w, n_ar, mat in ((wo, 2, WHITE), (wi, 3, WHITE)):
                out = (0.0, wside if abs(w) == CO else -wside, 0.0)
                zl = min(zf0, zf1)
                fr.face_toward([(u0, w, zl - 0.5), (u1, w, zl - 0.5), (u1, w, zr1), (u0, w, zr0)], mat, out)
                L = u1 - u0
                for j in range(n_ar):
                    c = u0 + (j + 0.5) * L / n_ar
                    zfl = deck(c)
                    hw = min(1.2, L / n_ar * 0.32)
                    a = arch_curve('round', c - hw, c + hw, zfl + 2.3, None, 6)
                    off = 0.03 * (1 if out[1] > 0 else -1)
                    pts = [(c - hw, zfl + 0.05), (c + hw, zfl + 0.05)] + a[::-1]
                    fr.face_toward([(u, w + off, z) for u, z in pts], GLASS, out)
                    band = [(c - hw - 0.25, zfl + 0.05), (c + hw + 0.25, zfl + 0.05)] + arch_curve('round', c - hw - 0.25, c + hw + 0.25, zfl + 2.3, None, 6)[::-1]
                    fr.face_toward([(u, w + off * 0.5, z) for u, z in band], MARBLE, out)
            # end walls (towards the bridge's ends) and the lead roof sloping down with the bridge
            ue = u1 if uside > 0 else u0
            fr.face_toward([(ue, wi, deck(ue) - 0.3), (ue, wo, deck(ue) - 0.3), (ue, wo, deck(ue) + SH), (ue, wi, deck(ue) + SH)], WHITE,
                           (uside, 0.0, 0.0))
            fr.face([(u0, wi, zr0 + 0.05), (u1, wi, zr1 + 0.05), (u1, wo, zr1 - 0.25), (u0, wo, zr0 - 0.25)][::(-1 if wside < 0 else 1)], LEAD)
# ------------------------------------------------------------------------------------------ the central portico
ZP0, ZP1 = CROWN, CROWN + 6.0
for wside in (-1, 1):                                          # the canal fronts with their big arch and pediment
    pl = Plane(fr, PORT if wside > 0 else -PORT, wside * W2, PI if wside > 0 else 0.0)
    arched_wall(pl, -0.3, 2 * PORT + 0.3, ZP0, ZP1, [(PORT - 2.0, PORT + 2.0, ZP0, ZP0 + 2.8, 'round', None)], WHITE, 0.9, WHITE, n=10)
    vkit.arch_band(pl, PORT - 2.0, PORT + 2.0, ZP0 + 2.8, 'round', None, 0.35, MARBLE, 0.0, 0.18, n=10)
    pl.block(-0.5, ZP1, 2 * PORT + 0.5, ZP1 + 0.5, -0.2, 0.35, WHITE)
    pl.slab([(-0.5, ZP1 + 0.5), (2 * PORT + 0.5, ZP1 + 0.5), (PORT, ZP1 + 2.6)], WHITE, -0.2, 0.3)
    vkit.disc(pl, PORT, ZP1 + 1.3, 0.38, STONE, 0.33, n=8)
    for s in (0.4, 2 * PORT - 0.4):                            # pilasters at the corners
        pl.block(s - 0.4, ZP0, s + 0.4, ZP1, 0.0, 0.25, WHITE)
for uside in (-1, 1):                                          # the fronts along the bridge: three arches
    pl = Plane(fr, uside * PORT, -uside * W2, uside * H) if uside > 0 else Plane(fr, -PORT, W2, -H)
    ops = [(0.4, W2 - CO - 0.3, ZP0, ZP0 + 1.7, 'round', None), (W2 - CS + 0.4, W2 + CS - 0.4, ZP0, ZP0 + 2.6, 'round', None),
           (W2 + CO + 0.3, 2 * W2 - 0.4, ZP0, ZP0 + 1.7, 'round', None)]
    arched_wall(pl, 0.0, 2 * W2, ZP0, ZP1, ops, WHITE, 0.6, WHITE, n=8)
vkit.hip_roof(fr, -PORT - 0.4, PORT + 0.4, -W2 - 0.3, W2 + 0.3, ZP1 + 0.5, 2.1, LEAD, hip=(False, False))

# The generator lays the bridge's footways as a flat deck across the canal at quay height; under the arch
# it would show as a stone band at the waterline. Take it away between the banks (the abutments cover the rest).
BANK_S, BANK_N = -15.45, 17.22


def under_bridge(x, y):
    u, w = fr.uw(x, y)
    return BANK_S + 0.8 < u < BANK_N - 0.8 and abs(w) < W2 + 1.5


gone = vkit.clear_ground(under_bridge)
vkit.emit(ctx, g, 'w1287188470_Ponte_di_Rialto', z0=0.0)
print(f'  [custom] Ponte di Rialto: removed {gone} faces of the flat generated deck', flush=True)
print(f'  [custom] Ponte di Rialto: {vkit.tris(g)} triangles', flush=True)
