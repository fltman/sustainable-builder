"""w1396078637: Street View May 2024: falu red office with a red entrance canopy on posts
(Hand-edited from the Street View frame: entrance canopy on red posts.)"""
import housekit

h = housekit.House(ctx, levels=1, wall='M_Wall_Wood_falu_Blank', trim='M_Wall_Wood_white_Blank', shop=False)
h.facades(window=(1.2, 1.45), pitch=2.9, kind='modern')
h.roof(shape='gabled', pitch=26, mat='M_Roof_Metal_grey')
st = max(h.street or range(len(h.walls)), key=lambda i: h.walls[i].L)
L = h.walls[st].L
h.veranda(st, L * 0.35, L * 0.75, depth=3.0, height=2.9, post='M_Wall_Wood_falu_Blank', roof_mat='M_Roof_Metal_red', balcony=False)
