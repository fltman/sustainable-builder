"""Furutorp, west part (Arkitektkontoret, Inside.Outside; Street View 2010): same salmon-red render,
white surrounds, striped awnings and red tile hipped roof as the corner building."""
import housekit

h = housekit.House(ctx, levels=3, wall='M_Wall_Plaster_terracotta_Blank', trim='M_Wall_Plaster_white_Blank', shop=True)
h.facades(window=(1.2, 1.6), pitch=2.7, sign_mat='M_Wall_Plaster_white_Blank',
          awnings=['M_Wall_Plaster_white_Blank', 'M_Roof_Metal_red'], upper_awnings=True)
h.roof(shape='hipped', pitch=30, mat='M_Roof_Tiles_red')
h.dormers([0.5], side='street', roof_mat='M_Roof_Tiles_red', mat='M_Wall_Plaster_terracotta_Blank')
h.sign('INSIDE.OUTSIDE', size=0.45, mat='M_Roof_Metal_black', board='M_Wall_Plaster_white_Blank')
