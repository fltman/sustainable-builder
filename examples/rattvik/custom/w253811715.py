"""Karlsviks Herrgård: Street View (May 2024): Karlsviks herrgård: cream rendered manor, red tile hipped roof, columned veranda with balcony
(Starter script from housekit_seed.py — compare with the photo and edit by hand.)"""
import housekit

h = housekit.House(ctx, levels=2, wall='M_Wall_Plaster_ivory_Blank', trim='M_Wall_Plaster_white_Blank', shop=False)
h.facades(window=(1.1, 1.45), pitch=2.6, kind='sash')
h.roof(shape='hipped', pitch=30, mat='M_Roof_Tiles_red')
h.chimney(0.35, 0.55)
st = sorted(h.street, key=lambda i: -h.walls[i].L)
for i in st[:1]:
    n = max(1, int(h.walls[i].L // 8))
    for s in range(2, 2 + 1):
        for k in range(n):
            h.balcony(i, x=h.walls[i].L * (k + 0.5) / n, storey=s, width=2.6, depth=1.1, rail='M_Wall_Plaster_white_Blank', glass=False)
st = sorted(h.street, key=lambda i: -h.walls[i].L)
if st: h.veranda(st[0], h.walls[st[0]].L * 0.3, h.walls[st[0]].L * 0.7)
