"""w1156218854: Street View May 2024: white rendered three-storey block, red stair-hall strip up the gable, red board entrance porch
(Hand-edited: red stair-hall strip up the gable.)"""
import housekit

h = housekit.House(ctx, levels=3, wall='M_Wall_Plaster_white_Blank', trim='M_Wall_Plaster_grey_Blank', shop=False, plinth='M_Concrete')
pw = max(h.street or range(len(h.walls)), key=lambda i: h.walls[i].L)
px = [h.walls[pw].L * 0.25, h.walls[pw].L * 0.75] if h.walls[pw].L > 14 else [h.walls[pw].L * 0.5]
skip = {pw: [(x - 1.1, x + 1.1) for x in px]}
h.facades(window=(1.4, 1.2), pitch=3.2, kind='modern', skip=skip, entrance=False)
h.roof(shape='gabled', pitch=26, mat='M_Roof_Metal_black')
for x in px: h.porch(pw, x, roof_mat='M_Roof_Metal_black')
# hand edit: the red stair-hall strip on the gable towards the street (Street View 2024)
ends = sorted((i for i in range(len(h.walls)) if 5 < h.walls[i].L < 16 and i not in h.party), key=lambda i: (i not in h.street, h.walls[i].L))
if ends:
    h.stair_bay(ends[0], h.walls[ends[0]].L * 0.5, width=1.6, depth=0.3, mat='M_Wall_Plaster_red_Blank')
