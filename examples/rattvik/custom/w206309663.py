"""w206309663:  hall
(Starter script from housekit_seed.py — generated look, not surveyed yet.)"""
import housekit

h = housekit.House(ctx, levels=2, wall='M_Wall_Wood_falu_Blank', trim='M_Wall_Wood_white_Blank', shop=False, plinth='M_Concrete')
h.facades(window=(1.4, 1.2), pitch=3.2, kind='modern')
h.roof(shape='gabled', pitch=34, mat='M_Roof_Tiles_red')
