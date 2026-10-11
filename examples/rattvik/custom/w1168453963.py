"""w1168453963: Street View May 2024: white two-storey timber house, pale green metal roof, cross gable, glazed balcony, chimney
(Starter script from housekit_seed.py — compare with the photo and edit by hand.)"""
import housekit

h = housekit.House(ctx, levels=2, wall='M_Wall_Wood_white_Blank', trim='M_Wall_Wood_white_Blank', shop=False)
h.facades(window=(1.1, 1.45), pitch=2.6, kind='sash')
h.roof(shape='gabled', pitch=26, mat='M_Roof_Metal_mint')
h.cross_gable(frac=0.5, width=4.5, pitch=48, roof_mat='M_Roof_Metal_mint', windows=2)
h.chimney(0.35, 0.55)
st = sorted(h.street, key=lambda i: -h.walls[i].L)
for i in st[:1]:
    n = max(1, int(h.walls[i].L // 8))
    for s in range(2, 2 + 1):
        for k in range(n):
            h.balcony(i, x=h.walls[i].L * (k + 0.5) / n, storey=s, width=2.6, depth=1.1, rail='M_Wall_Wood_white_Blank', glass=True)
