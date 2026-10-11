"""Konditoriet, Storgatan 15 (Street View 2011–2024): two-storey petrol-blue timber house with white trim,
a pointed cross gable over the shop with its window, a glazed first-floor balcony, shop windows under a
blue sign band with the red "Conditori" lettering, a low dark metal roof and two chimneys."""
import housekit

h = housekit.House(ctx, levels=2, wall='M_Wall_Wood_petrol_Blank', trim='M_Wall_Wood_white_Blank', shop=True)
h.facades(window=(1.3, 1.5), pitch=2.6, sign_mat='M_Wall_Metal_blue_Blank')
h.roof(shape='gabled', pitch=24, mat='M_Roof_Metal_black')
h.cross_gable(frac=0.22, width=5.0, pitch=52, roof_mat='M_Roof_Metal_black', windows=1)
h.chimney(0.12, 0.45)
h.chimney(0.72, 0.55)
st = max(h.street, key=lambda i: h.walls[i].L)
h.balcony(st, x=h.walls[st].L * 0.42, storey=2, width=4.6, depth=1.4, glass=True)
h.sign('Conditori', wall=st, x=h.walls[st].L * 0.22, size=0.6, mat='M_Roof_Metal_red')
