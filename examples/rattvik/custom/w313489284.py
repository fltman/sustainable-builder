"""Rättviksskolans Sporthall: Street View (2011–2024): Rättviksskolans sporthall: red brick, low, flat roof
(Starter script from housekit_seed.py — compare with the photo and edit by hand.)"""
import housekit

h = housekit.House(ctx, levels=2, wall='M_Wall_Brick_red_Blank', trim='M_Wall_Plaster_white_Blank', shop=False, plinth='M_Concrete')
h.facades(window=(1.4, 1.2), pitch=3.2, kind='modern')
h.roof(shape='flat')
