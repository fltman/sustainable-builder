"""w1156560702: Street View May 2024: falu red two-storey apartment house, white trim, brown tile roof, white outside stair
(Starter script from housekit_seed.py — compare with the photo and edit by hand.)"""
import housekit

h = housekit.House(ctx, levels=2, wall='M_Wall_Wood_falu_Blank', trim='M_Wall_Wood_white_Blank', shop=False)
h.facades(window=(1.1, 1.45), pitch=2.6, kind='sash')
h.roof(shape='gabled', pitch=34, mat='M_Roof_Tiles_brown')
h.chimney(0.35, 0.55)
