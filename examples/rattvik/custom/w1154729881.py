"""w1154729881:  hall
(Starter script from housekit_seed.py — generated look, not surveyed yet.)"""
import housekit

h = housekit.House(ctx, levels=1, wall='M_Wall_Metal_blue_Blank', trim='M_Wall_Plaster_white_Blank', shop=False, plinth='M_Concrete')
h.facades(window=(1.4, 1.2), pitch=3.2, kind='modern')
h.roof(shape='hipped', pitch=30, mat='M_Roof_Tiles_dark')
