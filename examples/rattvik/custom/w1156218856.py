"""w1156218856: Street View May 2024: red board entrance porch of the white block
(Starter script from housekit_seed.py — compare with the photo and edit by hand.)"""
import housekit

h = housekit.House(ctx, levels=1, wall='M_Wall_Wood_falu_Blank', trim='M_Wall_Wood_white_Blank', shop=False)
pw = max(h.street or range(len(h.walls)), key=lambda i: h.walls[i].L)
px = [h.walls[pw].L * 0.25, h.walls[pw].L * 0.75] if h.walls[pw].L > 14 else [h.walls[pw].L * 0.5]
skip = {pw: [(x - 1.1, x + 1.1) for x in px]}
h.facades(window=(1.2, 1.45), pitch=2.9, kind='modern', skip=skip, entrance=False)
h.roof(shape='gabled', pitch=26, mat='M_Roof_Metal_grey')
for x in px: h.porch(pw, x, roof_mat='M_Roof_Metal_grey')
