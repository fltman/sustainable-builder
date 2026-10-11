"""w1154729861: Street View May 2024: pale yellow three-storey apartment block with white balconies
(Starter script from housekit_seed.py — compare with the photo and edit by hand.)"""
import housekit

h = housekit.House(ctx, levels=3, wall='M_Wall_Plaster_yellow_Blank', trim='M_Wall_Plaster_white_Blank', shop=False)
h.facades(window=(1.2, 1.45), pitch=2.9, kind='modern')
h.roof(shape='gabled', pitch=26, mat='M_Roof_Metal_black')
st = sorted(h.street, key=lambda i: -h.walls[i].L)
for i in st[:1]:
    n = max(1, int(h.walls[i].L // 8))
    for s in range(2, 3 + 1):
        for k in range(n):
            h.balcony(i, x=h.walls[i].L * (k + 0.5) / n, storey=s, width=2.6, depth=1.1, rail='M_Wall_Plaster_white_Blank', glass=False)
