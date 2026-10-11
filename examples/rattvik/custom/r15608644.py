"""r15608644: Street View (2010–2024): rust-red render, white trim, dormer in roof
(Starter script from housekit_seed.py — compare with the photo and edit by hand.)"""
import housekit

h = housekit.House(ctx, levels=2, wall='M_Wall_Plaster_terracotta_Blank', trim='M_Wall_Plaster_white_Blank', shop=True)
h.surrounds = True
h.facades(window=(1.1, 1.45), pitch=2.6, kind='sash', sign_mat='M_Wall_Plaster_white_Blank')
h.roof(shape='gabled', pitch=34, mat='M_Roof_Tiles_dark')
h.dormers([0.3, 0.7], side='street', mat='M_Wall_Plaster_terracotta_Blank', roof_mat='M_Roof_Tiles_dark')
h.chimney(0.35, 0.55)
