"""w568319891: Street View (2010–2024): long yellow rendered house, orange-red tiles with dormers
(Starter script from housekit_seed.py — compare with the photo and edit by hand.)"""
import housekit

h = housekit.House(ctx, levels=2, wall='M_Wall_Plaster_yellow_Blank', trim='M_Wall_Plaster_white_Blank', shop=False)
h.facades(window=(1.1, 1.45), pitch=2.6, kind='sash')
h.roof(shape='gabled', pitch=34, mat='M_Roof_Tiles_red')
h.dormers([0.3, 0.7], side='street', mat='M_Wall_Plaster_yellow_Blank', roof_mat='M_Roof_Tiles_red')
h.chimney(0.35, 0.55)
