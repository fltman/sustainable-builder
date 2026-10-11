"""w206306968:  hall
(Starter script from housekit_seed.py — generated look, not surveyed yet.)"""
import housekit

h = housekit.House(ctx, levels=2, wall='M_Wall_Plaster_white_Blank', trim='M_Wall_Plaster_grey_Blank', shop=True, plinth='M_Concrete')
h.facades(window=(1.4, 1.2), pitch=3.2, kind='modern', sign_mat='M_Wall_Plaster_white_Blank')
h.roof(shape='flat')
