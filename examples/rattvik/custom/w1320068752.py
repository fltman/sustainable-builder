"""w1320068752: Street View May 2024: red brick one-storey villa with a brown timber garage, brown tile roof, chimney
(Starter script from housekit_seed.py — compare with the photo and edit by hand.)"""
import housekit

h = housekit.House(ctx, levels=1, wall='M_Wall_Brick_red_Blank', trim='M_Wall_Plaster_white_Blank', shop=False)
st = max(h.street or range(len(h.walls)), key=lambda i: h.walls[i].L)
L = h.walls[st].L
n = max(1, int(L // 3.4)) if L < 30 else max(1, int(L // 3.2))
xs = [max(1.6, L - 2.2)]
skip = {st: [(x - 1.4, x + 1.4) for x in xs]}
h.facades(window=(1.1, 1.45), pitch=2.6, kind='sash', skip=skip, door_at=0.3)
for x in xs: h.garage(st, x, mat='M_Wall_Wood_white_Blank')
h.roof(shape='gabled', pitch=34, mat='M_Roof_Tiles_brown')
h.chimney(0.35, 0.55)
