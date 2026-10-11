"""w1320068773: Street View May 2024: yellow 1½-storey house, red tile roof
(Starter script from housekit_seed.py — compare with the photo and edit by hand.)"""
import housekit

h = housekit.House(ctx, levels=1, wall='M_Wall_Plaster_yellow_Blank', trim='M_Wall_Plaster_white_Blank', shop=False)
h.facades(window=(1.1, 1.45), pitch=2.6, kind='sash')
h.roof(shape='gabled', pitch=45, mat='M_Roof_Tiles_red')
h.chimney(0.35, 0.55)
