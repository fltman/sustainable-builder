"""w1093562878: Street View (2010–2024): low pub/pizzeria + Coop wing, brown boards, glazed front
(Starter script from housekit_seed.py — compare with the photo and edit by hand.)"""
import housekit

h = housekit.House(ctx, levels=1, wall='M_Wall_Wood_brown_Blank', trim='M_Wall_Wood_white_Blank', shop=True)
h.facades(window=(1.1, 1.45), pitch=2.6, kind='sash', sign_mat='M_Wall_Wood_white_Blank')
h.roof(shape='gabled', pitch=26, mat='M_Roof_Metal_black')
h.chimney(0.35, 0.55)
