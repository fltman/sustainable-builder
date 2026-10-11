"""w1168454022: Street View May 2024: white 1½-storey house, red tile roof, cross gable
(Starter script from housekit_seed.py — compare with the photo and edit by hand.)"""
import housekit

h = housekit.House(ctx, levels=1, wall='M_Wall_Wood_white_Blank', trim='M_Wall_Wood_white_Blank', shop=False)
h.facades(window=(1.1, 1.45), pitch=2.6, kind='sash')
h.roof(shape='gabled', pitch=45, mat='M_Roof_Tiles_red')
h.cross_gable(frac=0.5, width=4.5, pitch=48, roof_mat='M_Roof_Tiles_red', windows=2)
h.chimney(0.35, 0.55)
