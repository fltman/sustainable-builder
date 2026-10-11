"""w1228801581: Street View (2010–2024): Ågatan 6: modern 5-storey point block, cream render + copper-brown panels
(Hand-edited: copper-brown stair tower.)"""
import housekit

h = housekit.House(ctx, levels=5, wall='M_Wall_Plaster_ivory_Blank', trim='M_Wall_Plaster_white_Blank', shop=False)
h.facades(window=(1.2, 1.45), pitch=2.9, kind='modern', panels='M_Wall_Wood_brown_Blank')
h.roof(shape='flat')
# hand edit: the copper-brown stair tower on the street side (Street View 2024)
st = max(h.street or range(len(h.walls)), key=lambda i: h.walls[i].L)
h.stair_bay(st, h.walls[st].L * 0.3, width=4.0, depth=0.4, mat='M_Wall_Wood_brown_Blank', glazed=False)
