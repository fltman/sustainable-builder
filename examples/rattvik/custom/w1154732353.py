"""Storgatan 2 (Street View 2024): white rendered 1950s block, three storeys, red balconies, the corner
shop below and a black hipped roof."""
import housekit

h = housekit.House(ctx, levels=3, wall='M_Wall_Plaster_white_Blank', trim='M_Wall_Plaster_grey_Blank', shop=True)
h.facades(window=(1.2, 1.45), pitch=2.9, kind='modern', sign_mat='M_Roof_Metal_black')
h.roof(shape='hipped', pitch=22, mat='M_Roof_Metal_black')
for i in sorted(h.street, key=lambda i: -h.walls[i].L)[:1]:
    for s in (2, 3):
        h.balcony(i, x=h.walls[i].L * 0.5, storey=s, width=2.8, depth=1.1, rail='M_Roof_Metal_red')
