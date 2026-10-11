"""w1154733470: Street View May 2024: falu red two-storey apartment house, white external stair to an upper balcony gallery, small white cross gable, red tile roof, chimney
(Starter script from housekit_seed.py — compare with the photo and edit by hand.)"""
import housekit

h = housekit.House(ctx, levels=2, wall='M_Wall_Wood_falu_Blank', trim='M_Wall_Wood_white_Blank', shop=False)
h.facades(window=(1.1, 1.45), pitch=2.6, kind='sash')
h.roof(shape='gabled', pitch=34, mat='M_Roof_Tiles_red')
h.cross_gable(frac=0.5, width=4.5, pitch=48, roof_mat='M_Roof_Tiles_red', windows=2)
h.chimney(0.35, 0.55)
st = sorted(h.street or range(len(h.walls)), key=lambda i: -h.walls[i].L)[0]
L = h.walls[st].L
h.gallery(st, L * 0.3, L * 0.8, stair='left')
