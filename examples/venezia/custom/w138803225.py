"""Ponte dei Sospiri (OSM way 138803225, man_made=bridge; Antonio Contin, ~1600–03). Free-standing: the
bridge is no generated building. References: ../references/palazzo-ducale/ (it shows from the Molo).

The enclosed bridge of white Istrian stone over the Rio di Palazzo between the Doge's Palace and the
Prigioni Nuove, 9.5 m long and 4.2 m wide (OSM): a segmental arch underneath, rusticated faces with
the two small barred windows the prisoners sighed through, a cornice and the curved top with volutes
at both ends and the doge's arms in the middle; the lead roof follows the curve.
"""
import inspect
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(inspect.currentframe().f_code.co_filename), 'lib'))
import vkit  # noqa: E402
from vkit import GLASS, LEAD, STONE, WHITE, Frame, Plane, arch_curve  # noqa: E402

MARBLE = 'M_Wall_Stone_limestone_Blank'
g = Geo()
fr = Frame(g, 262.54, -104.68, math.atan2(2.38, 9.17))    # u across the rio (palace -> prison), w along it
HL, HW = 4.9, 2.1
Z0, ZS, ZC, ZT, ZTOP = 1.6, 3.4, 4.6, 9.0, 10.3           # springing walls, arch springing, crown, cornice, top of the curve
under = arch_curve('round', -HL, HL, ZS, ZC - ZS, 12)
top = [(-HL - 0.3 + (2 * HL + 0.6) * k / 12, ZT + (ZTOP - ZT) * math.sin(math.pi * k / 12)) for k in range(13)]
for side in (-1, 1):
    pl = Plane(fr, -HL - 0.3, side * HW, 0.0) if side < 0 else Plane(fr, HL + 0.3, side * HW, math.pi)
    def S(u):
        return u + HL + 0.3 if side < 0 else HL + 0.3 - u
    # the face: from the arch up to the curved top
    for (ua, za), (ub, zb) in zip(top, top[1:]):
        def bot(u):
            if abs(u) >= HL:
                return Z0
            x = u / HL
            return ZS + (ZC - ZS) * math.sqrt(max(0.0, 1 - x * x))
        q = [(S(ua), bot(ua)), (S(ub), bot(ub)), (S(ub), zb), (S(ua), za)]
        pl.poly(q if vkit._area(q) > 0 else q[::-1], WHITE, 0.0, uvscale=1.5)
    for x in (-1.6, 1.6):                                                    # the two barred windows
        a, b = S(x - 0.55), S(x + 0.55)
        a, b = min(a, b), max(a, b)
        pl.block(a - 0.25, 5.4, b + 0.25, 7.3, 0.0, 0.12, MARBLE)
        pl.quad(a, 5.65, b, 7.05, GLASS, 0.14)
        for j in range(4):
            xx = a + (b - a) * (j + 0.5) / 4
            pl.block(xx - 0.035, 5.65, xx + 0.035, 7.05, 0.14, 0.2, STONE)
        for zz in (6.1, 6.6):
            pl.block(a, zz - 0.035, b, zz + 0.035, 0.14, 0.2, STONE)
    lo, hi = S(-HL - 0.3), S(HL + 0.3)
    lo, hi = min(lo, hi), max(lo, hi)
    pl.block(lo, ZT - 0.6, hi, ZT, 0.0, 0.3, WHITE)                          # cornice
    for (ua, za), (ub, zb) in zip(top, top[1:]):                             # the curved coping
        a, b = S(ua), S(ub)
        q = [(a, za), (b, zb), (b, zb + 0.35), (a, za + 0.35)]
        pl.poly(q if vkit._area(q) > 0 else q[::-1], WHITE, 0.25)
    for x in (-HL + 0.4, HL - 0.4):                                          # volutes at the ends
        vkit.disc(pl, S(x), ZT + 0.55, 0.55, WHITE, 0.3, n=10)
        vkit.disc(pl, S(x), ZT + 0.55, 0.3, STONE, 0.33, n=8)
    vkit.disc(pl, S(0.0), ZTOP - 0.55, 0.5, WHITE, 0.32, n=10)               # the doge's arms
    pl.poly([(S(-0.3), ZTOP - 0.95), (S(0.3), ZTOP - 0.95), (S(0.3), ZTOP - 0.45), (S(0.0), ZTOP - 0.2), (S(-0.3), ZTOP - 0.45)]
            if side < 0 else [(S(0.3), ZTOP - 0.95), (S(-0.3), ZTOP - 0.95), (S(-0.3), ZTOP - 0.45), (S(0.0), ZTOP - 0.2), (S(0.3), ZTOP - 0.45)],
            MARBLE, 0.36)
for (ua, za), (ub, zb) in zip(under, under[1:]):                             # the underside of the arch
    fr.face([(ua, HW, za), (ub, HW, zb), (ub, -HW, zb), (ua, -HW, za)], WHITE, uvscale=1.5)
for (ua, za), (ub, zb) in zip(top, top[1:]):                                 # the lead roof over the curve
    fr.face([(ua, -HW - 0.3, za + 0.35), (ub, -HW - 0.3, zb + 0.35), (ub, HW + 0.3, zb + 0.35), (ua, HW + 0.3, za + 0.35)], LEAD)
vkit.emit(ctx, g, 'w138803225_Ponte_dei_Sospiri', z0=0.0)
print(f'  [custom] Ponte dei Sospiri: {vkit.tris(g)} triangles', flush=True)
