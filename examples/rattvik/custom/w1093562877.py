"""Storgatan 9 (Street View 2024): light beige rendered two-storey shop building, blue awnings over the
shop windows, red-brown tile hipped roof."""
import housekit

h = housekit.House(ctx, levels=2, wall='M_Wall_Plaster_beige_Blank', trim='M_Wall_Plaster_white_Blank', shop=True)
h.facades(window=(1.2, 1.55), pitch=2.8, sign_mat='M_Wall_Plaster_white_Blank', awnings=['M_Wall_Metal_blue_Blank'])
h.roof(shape='hipped', pitch=28, mat='M_Roof_Tiles_red')
h.chimney(0.35, 0.5)
