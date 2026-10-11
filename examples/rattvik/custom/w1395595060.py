"""w1395595060: Street View (2024–2025): Hällebergs väg 40: cream low building, red windows
(Starter script from housekit_seed.py — compare with the photo and edit by hand.)"""
import housekit

h = housekit.House(ctx, levels=1, wall='M_Wall_Plaster_ivory_Blank', trim='M_Wall_Plaster_white_Blank', shop=False, ground=3.5, frame='M_Wall_Wood_falu_Blank', plinth='M_Concrete')
h.facades(window=(1.4, 1.2), pitch=3.2, kind='modern')
h.roof(shape='gabled', pitch=26, mat='M_Roof_Metal_grey')
