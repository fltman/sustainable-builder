"""w1154732368: Street View (2010–2024): long low beige rendered building, red corrugated roof, brown window frames
(Starter script from housekit_seed.py — compare with the photo and edit by hand.)"""
import housekit

h = housekit.House(ctx, levels=1, wall='M_Wall_Plaster_beige_Blank', trim='M_Wall_Plaster_white_Blank', shop=False, frame='M_Wall_Wood_brown_Blank')
h.facades(window=(1.1, 1.45), pitch=2.6, kind='sash')
h.roof(shape='gabled', pitch=26, mat='M_Roof_Metal_red')
h.chimney(0.35, 0.55)
