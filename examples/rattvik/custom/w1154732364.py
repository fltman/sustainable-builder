"""The modern chapel on Ågatan (Street View 2024): sandy-brown brick, one storey with an asymmetric
roof — a long slope rising from a low eave to a tall front with three tall arched windows of
different heights — and a lower wing. Hand-modelled."""
import housekit

h = housekit.House(ctx, levels=1, ground=4.0, wall='M_Wall_Brick_tan_Blank', trim='M_Wall_Plaster_white_Blank', shop=False)
h.facades(window=(0.9, 1.6), pitch=2.6, kind='modern', entrance=True)
h.roof(shape='gabled', pitch=38, mat='M_Roof_Metal_grey', ridge='long', max_rise=4.5)
# the tall front: three arched windows rising towards the high side, in the gable facing the street
st = max(h.street or range(len(h.walls)), key=lambda i: h.walls[i].L)
w = h.walls[st]
for k, (dx, ht) in enumerate(((-1.6, 2.6), (0.0, 3.4), (1.6, 4.2))):
    xc = w.L / 2 + dx
    shape = housekit.arch(xc, 1.0, 0.9, ht)
    w.poly(shape, housekit.GLASS, 0.06, uv=[(0.3 + 0.4 * (x - xc + 0.45) / 0.9, 0.5) for x, z in shape])
