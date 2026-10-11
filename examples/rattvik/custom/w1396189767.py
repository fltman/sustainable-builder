"""w1396189767: Street View May 2024: dark brown 1½-storey villa, black tile roof, dormer, white trim
(Starter script from housekit_seed.py — compare with the photo and edit by hand.)"""
import housekit

h = housekit.House(ctx, levels=1, wall='M_Wall_Wood_brown_Blank', trim='M_Wall_Wood_white_Blank', shop=False)
h.facades(window=(1.1, 1.45), pitch=2.6, kind='sash')
h.roof(shape='gabled', pitch=45, mat='M_Roof_Tiles_dark')
h.dormers([0.3, 0.7], side='street', mat='M_Wall_Wood_brown_Blank', roof_mat='M_Roof_Tiles_dark')
h.chimney(0.35, 0.55)
