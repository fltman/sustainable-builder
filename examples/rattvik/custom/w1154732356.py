"""w1154732356: Street View (2010–2024): same building as Storgatan 1
(Starter script from housekit_seed.py — compare with the photo and edit by hand.)"""
import housekit

h = housekit.House(ctx, levels=2, wall='M_Wall_Wood_cream_Blank', trim='M_Wall_Wood_white_Blank', shop=True)
h.facades(window=(1.1, 1.45), pitch=2.6, kind='sash', sign_mat='M_Wall_Wood_white_Blank')
h.roof(shape='gabled', pitch=26, mat='M_Roof_Metal_red')
h.chimney(0.35, 0.55)
