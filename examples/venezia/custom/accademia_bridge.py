"""Ponte dell'Accademia (OSM way 556239027, man_made=bridge; Eugenio Miozzi 1933, rebuilt 1985–86 on a
steel frame). Free-standing: the bridge is no generated building. References in ../references/accademia/.

- One flat segmental arch of 48 m over the Grand Canal (banks 51.4 m apart along the axis): two side
  trusses of dark-stained timber – a curved lower chord springing from stone abutments just above the
  water, the deck as the upper chord, and a lattice of posts and crossed diagonals between them;
  cross-bracing underneath.
- The deck (5.4 m wide, OSM) rises in long shallow steps to the crown ~8 m above the water, timber
  railings on posts, lamps at the crown and the ends; the long ramp of steps down into Campo San Vidal
  on the north; on the south a landing and two side stairs down to Campo della Carità.
The flat generated deck across the canal is removed under the arch (see vkit.clear_ground).
"""
import inspect
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(inspect.currentframe().f_code.co_filename), 'lib'))
import vkit  # noqa: E402
from vkit import STONE, WHITE, Frame, rot_box  # noqa: E402

WOOD = 'M_Wall_Wood_brown_Blank'
DECK = 'M_Ground_Pier'
IRON = 'M_Fixture_Metal'
GLOW = 'M_Furniture_LampGlass'
g = Geo()
fr = Frame(g, -680.795, -392.31, math.radians(60.915))   # u from the Dorsoduro bank to San Vidal, w to the left (west)
WZ = ctx.data.get('water_z', -1.2)
BS, BN = 0.6, 52.0                     # the banks along the axis
UC = (BS + BN) / 2                     # crown
A0, A1 = UC - 24.0, UC + 24.0          # springings of the arch (48 m)
HW = 2.7                               # half width of the deck
ZCROWN, ZBANK = 6.8, 3.6               # deck heights (ground 0 = quay, water at -1.2)
END_N, END_S = 68.2, -4.6              # where the stairs meet the ground (north) and the south landing


def deck(u):
    if u >= BN:
        return ZBANK + (0.3 - ZBANK) * min(1.0, (u - BN) / (END_N - BN))
    if u <= BS:
        return ZBANK - (ZBANK - 2.4) * min(1.0, (BS - u) / (BS - END_S))
    x = (u - UC) / (UC - BS)
    return ZCROWN - (ZCROWN - ZBANK) * x * x


def rib(u):
    """The lower chord: a segmental arch from the springings (just above the water) to under the crown."""
    x = (u - UC) / (A1 - UC)
    return WZ + 0.6 + (ZCROWN - 1.5 - WZ - 0.6) * (1 - x * x)


# ------------------------------------------------------------------------------------------ the deck (stepped) and railings
STEP = 0.9
us = [END_S + k * STEP for k in range(int((END_N - END_S) / STEP) + 1)] + [END_N]
for ua, ub in zip(us, us[1:]):
    z = deck((ua + ub) / 2)
    fr.face([(ua, -HW, z), (ub, -HW, z), (ub, HW, z), (ua, HW, z)], DECK, uvscale=2.0)
    zn = deck(ub + STEP / 2) if ub < END_N else 0.0
    if abs(zn - z) > 1e-3:
        fr.face_toward([(ub, -HW, min(z, zn)), (ub, HW, min(z, zn)), (ub, HW, max(z, zn)), (ub, -HW, max(z, zn))], WOOD,
                       (1.0 if zn < z else -1.0, 0.0, 0.0))
    for side in (-1, 1):                                       # the deck's edge beam (fascia)
        fr.face_toward([(ua, side * HW, z - 0.55), (ub, side * HW, z - 0.55), (ub, side * HW, z), (ua, side * HW, z)], WOOD, (0.0, side, 0.0))
fr.face([(END_S, -HW, deck(END_S) - 0.5), (END_S, HW, deck(END_S) - 0.5), (END_S, HW, deck(END_S)), (END_S, -HW, deck(END_S))], WOOD)
for side in (-1, 1):                                           # railings: posts every 1.8 m, top rail, two lower rails
    w = side * (HW - 0.08)
    rail = [END_S + k * 1.8 for k in range(int((END_N - 1.0 - END_S) / 1.8) + 1)]
    for u in rail:
        rot_box(fr, u, w, deck(u), 0.14, 0.14, 1.15, 0.0, WOOD)
    for ua, ub in zip(rail, rail[1:]):
        for z0, z1 in ((1.0, 1.2), (0.55, 0.62), (0.18, 0.25)):
            za, zb = deck(ua) + z0, deck(ub) + z0
            fr.face_toward([(ua, w, za), (ub, w, zb), (ub, w, zb + (z1 - z0)), (ua, w, za + (z1 - z0))], WOOD, (0.0, side, 0.0))
            fr.face_toward([(ua, w - side * 0.1, za), (ub, w - side * 0.1, zb), (ub, w - side * 0.1, zb + (z1 - z0)), (ua, w - side * 0.1, za + (z1 - z0))],
                           WOOD, (0.0, -side, 0.0))
        fr.face([(ua, w - side * 0.1, deck(ua) + 1.2), (ub, w - side * 0.1, deck(ub) + 1.2), (ub, w, deck(ub) + 1.2), (ua, w, deck(ua) + 1.2)][::side],
                WOOD)

# ------------------------------------------------------------------------------------------ the two side trusses
N = 24
for side in (-1, 1):
    w = side * (HW - 0.25)
    pts = [A0 + (A1 - A0) * k / N for k in range(N + 1)]
    for ua, ub in zip(pts, pts[1:]):                           # the arch rib (lower chord), 0.9 m deep, both faces
        for ww, fac in ((w + side * 0.2, side), (w - side * 0.2, -side)):
            fr.face_toward([(ua, ww, rib(ua)), (ub, ww, rib(ub)), (ub, ww, rib(ub) + 0.9), (ua, ww, rib(ua) + 0.9)], WOOD, (0.0, fac, 0.0))
        fr.face([(ua, w - 0.2, rib(ua)), (ub, w - 0.2, rib(ub)), (ub, w + 0.2, rib(ub)), (ua, w + 0.2, rib(ua))][::-side], WOOD)
        fr.face([(ua, w - 0.2, rib(ua) + 0.9), (ub, w - 0.2, rib(ub) + 0.9), (ub, w + 0.2, rib(ub) + 0.9), (ua, w + 0.2, rib(ua) + 0.9)][::side], WOOD)
    for k in range(1, N):                                      # posts and crossed diagonals between the rib and the deck
        u = pts[k]
        z0, z1 = rib(u) + 0.9, deck(u) - 0.55
        if z1 - z0 < 0.2:
            continue
        rot_box(fr, u, w, z0, 0.18, 0.3, z1 - z0, 0.0, WOOD)
        if k < N - 1:
            un = pts[k + 1]
            za, zb = rib(un) + 0.9, deck(un) - 0.55
            if zb - za > 0.2:
                for (p0, q0), (p1, q1) in (((u, z0), (un, zb)), ((u, z1), (un, za))):
                    L = math.hypot(p1 - p0, q1 - q0)
                    nx, nz = -(q1 - q0) / L * 0.09, (p1 - p0) / L * 0.09
                    for ww, fac in ((w + side * 0.1, side), (w - side * 0.1, -side)):
                        fr.face_toward([(p0 - nx, ww, q0 - nz), (p1 - nx, ww, q1 - nz), (p1 + nx, ww, q1 + nz), (p0 + nx, ww, q0 + nz)], WOOD,
                                       (0.0, fac, 0.0))
for k in range(2, N - 1, 2):                                   # cross-bracing under the deck
    u = A0 + (A1 - A0) * k / N
    z = rib(u) + 0.5
    rot_box(fr, u, 0.0, z, 0.2, 2 * HW - 0.5, 0.25, 0.0, IRON)

# ------------------------------------------------------------------------------------------ abutments, landing, side stairs, lamps
for u0, u1 in ((BS - 1.4, A0 + 0.6), (A1 - 0.6, BN + 1.4)):
    fr.box((u0 + u1) / 2, 0.0, WZ - 0.6, u1 - u0, 2 * HW + 0.8, deck((u0 + u1) / 2) - 0.6 - WZ + 0.6, STONE, uvscale=2.0)
for side, (uu, wend) in ((1, (-5.8, 12.6)), (-1, (-11.8, -11.4))):      # the two stairs down to Campo della Carità
    n = 14
    z0 = deck(END_S)
    for k in range(n):
        t0, t1 = k / n, (k + 1) / n
        z = z0 * (1 - (k + 0.5) / n)
        if side > 0:
            q = [(END_S - 1.6, side * (HW + t0 * (wend - HW)), z), (END_S + 0.9, side * (HW + t0 * (wend - HW)), z),
                 (END_S + 0.9, side * (HW + t1 * (wend - HW)), z), (END_S - 1.6, side * (HW + t1 * (wend - HW)), z)]
        else:
            q = [(END_S + 0.9 + t0 * (uu - END_S), -HW - t0 * (abs(wend) - HW), z), (END_S - 1.9 + t0 * (uu - END_S), -HW - t0 * (abs(wend) - HW), z),
                 (END_S - 1.9 + t1 * (uu - END_S), -HW - t1 * (abs(wend) - HW), z), (END_S + 0.9 + t1 * (uu - END_S), -HW - t1 * (abs(wend) - HW), z)]
        fr.face_toward(q, DECK, (0.0, 0.0, 1.0))
        fr.face_toward([(a, b, 0.0) for a, b, _ in q[:2]] + [(a, b, z) for a, b, _ in q[1::-1]], WOOD, (0.0, -side, 0.0) if side > 0 else (0.0, 1.0, 0.0))
for u in (END_S + 0.5, UC, END_N - 1.2):                       # lamp posts
    for side in ((-1, 1) if u == UC else (1,)):
        x = side * (HW - 0.1)
        fr.cyl(u, x, deck(u), 0.07, 3.6, IRON, seg=6, cap=False)
        fr.box(u, x, deck(u) + 3.6, 0.42, 0.42, 0.55, GLOW)
        fr.revolve(u, x, deck(u) + 4.15, [(0.3, 0.0), (0.0, 0.3)], IRON, 4, smooth=False, around=1, vlen=1.0)


def under_bridge(x, y):
    u, w = fr.uw(x, y)
    return BS + 1.2 < u < BN - 1.2 and abs(w) < HW + 1.5


gone = vkit.clear_ground(under_bridge)
vkit.emit(ctx, g, 'Ponte_dell_Accademia', z0=0.0)
print(f"  [custom] Ponte dell'Accademia: {vkit.tris(g)} triangles, removed {gone} faces of the flat generated deck", flush=True)
