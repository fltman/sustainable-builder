"""w1093562872: surveyed
(Starter script from housekit_seed.py — generated look, not surveyed yet.)"""
import housekit

h = housekit.House(ctx, levels=3, wall='M_Wall_Plaster_green_Blank', trim='M_Wall_Plaster_white_Blank', shop=True)
h.facades(window=(1.1, 1.45), pitch=2.6, kind='sash', sign_mat='M_Wall_Plaster_white_Blank')
h.roof(shape='hipped', pitch=28, mat='M_Roof_Slate_dark')
h.chimney(0.35, 0.55)
