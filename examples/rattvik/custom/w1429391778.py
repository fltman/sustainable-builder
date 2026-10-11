"""w1429391778: Street View Jun 2023: falu red upper storey over a red brick ground floor, black roof, glazed veranda
(Hand-edited: red brick ground floor under the falu red boards.)"""
import housekit

h = housekit.House(ctx, levels=2, lower='M_Wall_Brick_red_Blank', wall='M_Wall_Wood_falu_Blank', trim='M_Wall_Wood_white_Blank', shop=False)
h.facades(window=(1.1, 1.45), pitch=2.6, kind='sash')
h.roof(shape='gabled', pitch=26, mat='M_Roof_Metal_black')
h.chimney(0.35, 0.55)
st = sorted(h.street, key=lambda i: -h.walls[i].L)
if st: h.veranda(st[0], h.walls[st[0]].L * 0.3, h.walls[st[0]].L * 0.7)
