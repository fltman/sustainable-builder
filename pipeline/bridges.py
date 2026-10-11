"""Arched bridges (overrides.json defaults.bridges.style 'arch' – Venice's): the profile of a footbridge vaulted
over a canal – its level crown, its two flights of steps and the vault under them – shared by the 3D build
(blender/citylib.py arch_bridge) and the site's map (make_pack.py: the heights walkers climb on the steps)."""
import math


def profile(span, ground, wz):
    """span (prepare_city.py bridge_spans): 'a' and 'b', where the bridge's centre line leaves and meets the land,
    and 'w', its walkway. ground(x, y): the street's height there; wz: the water's surface. Heights are absolute.
    Returns None for a span too short to vault."""
    (ax, ay), (bx, by) = span['a'], span['b']
    L = math.dist((ax, ay), (bx, by))
    if L < 1.0:
        return None
    ux, uy = (bx - ax) / L, (by - ay) / L
    mx, my = (ax + bx) / 2, (ay + by) / 2
    xy = lambda s: (mx + ux * s, my + uy * s)
    hw = max(1.6, min(float(span['w']), 8.0)) / 2        # half the walkway
    # The crown: high enough for a boat under the vault, and at least half a metre above the streets.
    za, zb = ground(*xy(-L / 2 - 1.0)), ground(*xy(L / 2 + 1.0))
    zi = wz + min(6.0, max(1.9, 1.7 + 0.06 * L))         # the vault's crown, underneath
    # The deck's crown: room above the vault for the arch ring and a string course (less over the narrowest rii).
    zc = max(zi + min(0.7, 0.35 + 0.1 * L), max(za, zb) + 0.5)
    hl = min(1.5, max(0.5, L * 0.11))                    # half the level crown
    feet = []
    for side, zg in ((-1, za), (1, zb)):
        # The flight reaches at most 1.2 m onto the quay, steeper where the canal is narrow: steps of about 15 cm,
        # up to 20 cm where the treads would otherwise get shallower than 27 cm.
        run = min(L / 2 - hl + 1.2, max(L / 2 - hl + 0.3, (zc - zg) / 0.33))
        sf = side * (hl + run)
        zf = min(max(ground(*xy(sf)), ground(*xy(sf + side))), zc - 0.3)
        h = zc - zf
        feet.append((sf, zf, run, max(3, math.ceil(h / 0.2), min(round(h / 0.15), int(run / 0.27)))))
    return {'L': L, 'u': (ux, uy), 'mid': (mx, my), 'hw': hw, 'hl': hl, 'wz': wz, 'zi': zi, 'zc': zc, 'feet': feet}


def sampler(t, z=0.0):
    """The ground's height from city.json's terrain grid (bilinear, as blender/citylib.py Terrain), plus z."""
    if not t:
        return lambda x, y: z
    x0, y0, step, n, d = t['x0'], t['y0'], t['step'], t['n'], t['d']

    def at(x, y):
        fy = min(max((y - y0) / step, 0.0), n - 1.000001)
        fx = min(max((x - x0) / step, 0.0), n - 1.000001)
        j, i = int(fy), int(fx)
        ty, tx = fy - j, fx - i
        g = lambda jj, ii: d[jj * n + ii]
        return (g(j, i) * (1 - tx) + g(j, i + 1) * tx) * (1 - ty) + (g(j + 1, i) * (1 - tx) + g(j + 1, i + 1) * tx) * ty + z
    return at
