"""ICA, Vasagatan 2 (Street View 2024): a long low supermarket in red brick under a shallow dark-red
metal roof, a glass entrance with the red ICA sign above it, posters and shop windows along the street.
Hand-edited."""
import housekit

h = housekit.House(ctx, levels=1, ground=5.2, wall='M_Wall_Brick_red_Blank', trim='M_Wall_Plaster_white_Blank',
                   frame='M_Roof_Metal_red', shop=True)
h.facades(window=(1.4, 1.2), pitch=3.4, kind='modern', shop_bays=4.2, sign_mat='M_Roof_Metal_red', entrance=False)
h.roof(shape='gabled', pitch=10, mat='M_Roof_Metal_red', overhang=0.8)
st = max(h.street, key=lambda i: h.walls[i].L)
h.sign('ICA', wall=st, x=h.walls[st].L * 0.5, size=1.0, mat='M_Wall_Plaster_white_Blank', z=h.ground - 0.8)
