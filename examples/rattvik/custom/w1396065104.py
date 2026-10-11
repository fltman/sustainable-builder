"""w1396065104: Street View (2024–2025): Hällebergs väg 42: white hall, red window frames
(Starter script from housekit_seed.py — compare with the photo and edit by hand.)"""
import housekit

h = housekit.House(ctx, levels=1, wall='M_Wall_Plaster_white_Blank', trim='M_Wall_Plaster_grey_Blank', shop=False, ground=4.0, frame='M_Wall_Wood_falu_Blank', plinth='M_Concrete')
h.facades(window=(1.4, 1.2), pitch=3.2, kind='modern')
h.roof(shape='gabled', pitch=26, mat='M_Roof_Metal_grey')
