"""w1396065107: Street View May 2024: navy blue workshop with white trim, grey metal roof
(Starter script from housekit_seed.py — compare with the photo and edit by hand.)"""
import housekit

h = housekit.House(ctx, levels=1, wall='M_Wall_Metal_blue_Blank', trim='M_Wall_Plaster_white_Blank', shop=False, plinth='M_Concrete')
h.surrounds = True
h.facades(window=(1.4, 1.2), pitch=3.2, kind='modern')
h.roof(shape='gabled', pitch=26, mat='M_Roof_Metal_grey')
