"""w690113653: petrol station canopy on Riksvägen (building=roof). Street View Jun 2025 (heading 235): a flat
canopy over the pumps on slim white columns, white soffit, deep red fascia band with a white top edge, pump
islands underneath. The shop beside it is w206306954r."""
import math
import citylib

g = ctx.geo
ring = citylib.ccw([tuple(p) for p in ctx.footprint['outer']])
cx, cy, a, L, W = citylib.frame(ring)
z0, z1 = 4.9, 5.7

g.prism(ring, z0, z1, 'M_Roof_Metal_red')                              # fascia band + top
g.prism(ring, z1 - 0.12, z1, 'M_Wall_Plaster_white_Blank', top=False)  # white top edge
g.polygon(ring[::-1], z0, 'M_Wall_Plaster_white_Blank')               # soffit


def P(u, w):
    c, s = math.cos(a), math.sin(a)
    return cx + u * c - w * s, cy + u * s + w * c


for w in (-W * 0.22, W * 0.22):                                        # two pump islands along the long axis
    x, y = P(0, w)
    g.box((x, y, 0.1), (L * 0.55, 1.1, 0.2), 'M_Concrete', a, uvscale=1.0)
    for u in (-L * 0.2, L * 0.2):
        x, y = P(u, w)
        g.cyl(x, y, 0.2, 0.17, z0 - 0.2, 'M_Wall_Plaster_white_Blank', seg=10)
        x, y = P(u * 0.4, w)
        g.box((x, y, 1.1), (0.55, 0.9, 1.8), 'M_Wall_Plaster_white_Blank', a, uvscale=1.0)
        g.box((x, y, 1.75), (0.57, 0.92, 0.35), 'M_Roof_Metal_red', a, uvscale=1.0)
