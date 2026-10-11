"""w1396065109: open carport on Gjutarvägen. Street View May 2024: a long flat roof of solar panels on
slim white posts, with a red board screen wall along the street side. Hand-modelled."""
import math
import citylib

g = ctx.geo
ring = citylib.ccw([tuple(p) for p in ctx.footprint['outer']])
cx, cy, a, L, W = citylib.frame(ring)
z = 3.0
c, s = math.cos(a), math.sin(a)


def P(u, w):
    return cx + u * c - w * s, cy + u * s + w * c


g.prism(ring, z, z + 0.25, 'M_Wall_Plaster_white_Blank')                # roof edge
g.polygon(ring, z + 0.27, 'M_Window_Pane')                             # solar panels on top
g.polygon(ring[::-1], z, 'M_Wall_Plaster_white_Blank')                # soffit
n = max(2, round(L / 4.0) + 1)
for k in range(n):
    u = -L / 2 + 0.3 + (L - 0.6) * k / (n - 1)
    for w in (-W / 2 + 0.3, W / 2 - 0.3):
        x, y = P(u, w)
        g.box((x, y, z / 2), (0.16, 0.16, z), 'M_Wall_Plaster_white_Blank', a, uvscale=1.0)
# the red board screen along the long side nearest the street
roads = [r for r in ctx.data.get('roads', []) if r.get('name') == 'Gjutarvägen']
side = -1
if roads:
    pts = [p for r in roads for p in r['p']]
    near = min(pts, key=lambda p: math.dist(p, (cx, cy)))
    side = 1 if (-(near[0] - cx) * s + (near[1] - cy) * c) > 0 else -1
w = side * (W / 2 - 0.3)
x, y = P(0, w)
g.box((x, y, 0.75), (L - 0.6, 0.08, 1.3), 'M_Wall_Wood_falu_Blank', a, uvscale=1.0)
