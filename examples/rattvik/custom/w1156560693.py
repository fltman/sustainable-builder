"""w1156560693: Street View May 2024: pale yellow two-storey timber house with a white garage wing
(Starter script from housekit_seed.py — compare with the photo and edit by hand.)"""
import housekit

h = housekit.House(ctx, levels=2, wall='M_Wall_Wood_cream_Blank', trim='M_Wall_Wood_white_Blank', shop=False, plinth='M_Concrete')
st = max(h.street or range(len(h.walls)), key=lambda i: h.walls[i].L)
L = h.walls[st].L
n = max(1, int(L // 3.4)) if L < 30 else max(1, int(L // 3.2))
xs = [L * (k + 0.5) / n for k in range(n)] if False else [L * 0.5]
skip = {st: [(x - 1.4, x + 1.4) for x in xs]}
h.facades(window=(1.4, 1.2), pitch=3.2, kind='modern', skip=skip, entrance=False)
for x in xs: h.garage(st, x, mat='M_Wall_Wood_white_Blank')
h.roof(shape='gabled', pitch=34, mat='M_Roof_Tiles_red')
