"""Furutorp, the corner of Storgatan and Ågatan (Street View 2010–2024): three-storey salmon-red rendered
block with white window surrounds, striped awnings over the shops, red tile hipped roof with dormers."""
import housekit

h = housekit.House(ctx, levels=3, wall='M_Wall_Plaster_terracotta_Blank', trim='M_Wall_Plaster_white_Blank', shop=True)
h.facades(window=(1.2, 1.6), pitch=2.7, sign_mat='M_Wall_Plaster_white_Blank',
          awnings=['M_Wall_Plaster_white_Blank', 'M_Roof_Metal_red'], upper_awnings=True)
h.roof(shape='hipped', pitch=30, mat='M_Roof_Tiles_red')
h.dormers([0.3, 0.7], side='street', roof_mat='M_Roof_Tiles_red', mat='M_Wall_Plaster_terracotta_Blank')
h.chimney(0.5, 0.5)
h.sign('Furutorp', size=0.55, mat='M_Roof_Metal_black', board='M_Wall_Plaster_white_Blank')
