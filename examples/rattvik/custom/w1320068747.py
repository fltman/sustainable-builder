"""w1320068747: Street View May 2024: white one-storey villa, black roof, glazed veranda, brick chimney
(Starter script from housekit_seed.py — compare with the photo and edit by hand.)"""
import housekit

h = housekit.House(ctx, levels=1, wall='M_Wall_Wood_white_Blank', trim='M_Wall_Wood_white_Blank', shop=False)
h.facades(window=(1.1, 1.45), pitch=2.6, kind='sash')
h.roof(shape='gabled', pitch=34, mat='M_Roof_Tiles_dark')
h.chimney(0.35, 0.55)
st = sorted(h.street, key=lambda i: -h.walls[i].L)
if st: h.veranda(st[0], h.walls[st[0]].L * 0.3, h.walls[st[0]].L * 0.7)
