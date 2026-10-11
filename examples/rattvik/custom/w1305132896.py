"""w1305132896: Street View (2010–2024): Torggatan 20: sage-green rendered block, white window surrounds
(Starter script from housekit_seed.py — compare with the photo and edit by hand.)"""
import housekit

h = housekit.House(ctx, levels=3, wall='M_Wall_Plaster_green_Blank', trim='M_Wall_Plaster_white_Blank', shop=False)
h.surrounds = True
h.facades(window=(1.2, 1.45), pitch=2.9, kind='modern')
h.roof(shape='gabled', pitch=26, mat='M_Roof_Metal_black')
