"""w1154729885: Street View (2011–2025): grey corrugated store with a red tile roof
(Starter script from housekit_seed.py — compare with the photo and edit by hand.)"""
import housekit

h = housekit.House(ctx, levels=1, wall='M_Wall_Metal_grey_Blank', trim='M_Wall_Plaster_white_Blank', shop=False, ground=4.0, plinth='M_Concrete')
h.facades(window=(1.4, 1.2), pitch=3.2, kind='modern')
h.roof(shape='gabled', pitch=34, mat='M_Roof_Tiles_red')
