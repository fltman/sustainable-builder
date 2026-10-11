"""w1320068736: Street View May 2024: cream brick and white board one-storey villa, red tile roof, glazed veranda, chimney
(Starter script from housekit_seed.py — compare with the photo and edit by hand.)"""
import housekit

h = housekit.House(ctx, levels=1, wall='M_Wall_Brick_yellow_Blank', trim='M_Wall_Plaster_white_Blank', shop=False)
h.facades(window=(1.1, 1.45), pitch=2.6, kind='sash')
h.roof(shape='gabled', pitch=34, mat='M_Roof_Tiles_red')
h.chimney(0.35, 0.55)
st = sorted(h.street, key=lambda i: -h.walls[i].L)
if st: h.veranda(st[0], h.walls[st[0]].L * 0.3, h.walls[st[0]].L * 0.7)
