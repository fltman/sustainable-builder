"""w1168453966: garden shed or garage
(Starter script from housekit_seed.py — generated look, not surveyed yet.)"""
import housekit

h = housekit.House(ctx, levels=1, wall='M_Wall_Wood_white_Blank', trim='M_Wall_Wood_white_Blank', shop=False, plinth='M_Concrete')
st = max(h.street or range(len(h.walls)), key=lambda i: h.walls[i].L)
L = h.walls[st].L
n = max(1, int(L // 3.4)) if L < 30 else max(1, int(L // 3.2))
xs = [L * (k + 0.5) / n for k in range(n)] if False else [L * 0.5]
skip = {st: [(x - 1.4, x + 1.4) for x in xs]}
h.facades(window=(1.4, 1.2), pitch=3.2, kind='modern', skip=skip, entrance=False)
for x in xs: h.garage(st, x, mat='M_Wall_Wood_white_Blank')
h.roof(shape='hipped', pitch=30, mat='M_Roof_Tiles_dark')
