"""w1320068725: Street View May 2024: white one-storey timber villa, red tile roof, awnings
(Starter script from housekit_seed.py — compare with the photo and edit by hand.)"""
import housekit

h = housekit.House(ctx, levels=1, wall='M_Wall_Wood_white_Blank', trim='M_Wall_Wood_white_Blank', shop=False)
h.facades(window=(1.1, 1.45), pitch=2.6, kind='sash', awnings=['M_Roof_Metal_red'], upper_awnings=True)
h.roof(shape='gabled', pitch=34, mat='M_Roof_Tiles_red')
h.chimney(0.35, 0.55)
