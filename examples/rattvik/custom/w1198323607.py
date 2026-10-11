"""Storgatan 21, corner of Vasagatan (Street View 2024): sand-coloured functionalist corner house, two
storeys, the Expert shop below, a rounded corner balcony and a black hipped roof."""
import housekit

h = housekit.House(ctx, levels=2, wall='M_Wall_Plaster_beige_Blank', trim='M_Wall_Plaster_white_Blank', shop=True)
h.facades(window=(1.3, 1.4), pitch=2.8, kind='modern', sign_mat='M_Roof_Metal_black')
h.roof(shape='hipped', pitch=22, mat='M_Roof_Metal_black')
for i in sorted(h.street, key=lambda i: -h.walls[i].L)[:1]:
    h.balcony(i, x=h.walls[i].L - 2.0, storey=2, width=3.4, depth=1.2, rail='M_Wall_Plaster_white_Blank')
h.sign('EXPERT', size=0.6, mat='M_Wall_Plaster_white_Blank', board='M_Roof_Metal_red')
