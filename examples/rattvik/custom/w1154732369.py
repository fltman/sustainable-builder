"""w1154732369: Street View (2010–2024): Torggatan 5: white rendered block with red stair-hall bay
(Hand-edited: red stair-hall bay added.)"""
import housekit

h = housekit.House(ctx, levels=3, wall='M_Wall_Plaster_white_Blank', trim='M_Wall_Plaster_grey_Blank', shop=False, plinth='M_Concrete')
h.facades(window=(1.4, 1.2), pitch=3.2, kind='modern')
h.roof(shape='hipped', pitch=22, mat='M_Roof_Metal_black')
# hand edit: the red stair-hall bay in the middle of the street side (Street View 2024)
st = max(h.street or range(len(h.walls)), key=lambda i: h.walls[i].L)
h.stair_bay(st, h.walls[st].L * 0.5, width=3.2, depth=0.6, mat='M_Wall_Plaster_red_Blank')
