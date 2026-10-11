"""w1156218857: Street View (2011–2025): Knihsgatan 18: falu-red timber block, white balconies, dormers, shop on the corner
(Starter script from housekit_seed.py — compare with the photo and edit by hand.)"""
import housekit

h = housekit.House(ctx, levels=2, wall='M_Wall_Wood_falu_Blank', trim='M_Wall_Wood_white_Blank', shop=True)
h.facades(window=(1.2, 1.45), pitch=2.9, kind='modern', sign_mat='M_Wall_Wood_white_Blank')
h.roof(shape='gabled', pitch=34, mat='M_Roof_Tiles_red')
h.dormers([0.3, 0.7], side='street', mat='M_Wall_Wood_falu_Blank', roof_mat='M_Roof_Tiles_red')
st = sorted(h.street, key=lambda i: -h.walls[i].L)
for i in st[:1]:
    n = max(1, int(h.walls[i].L // 8))
    for s in range(2, 2 + 1):
        for k in range(n):
            h.balcony(i, x=h.walls[i].L * (k + 0.5) / n, storey=s, width=2.6, depth=1.1, rail='M_Wall_Wood_white_Blank', glass=False)
