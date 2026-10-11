"""w1154732362: Street View (2010–2024): Ågatan 1: 60s pale brick block, mustard panels under the windows, basement windows
(Starter script from housekit_seed.py — compare with the photo and edit by hand.)"""
import housekit

h = housekit.House(ctx, levels=3, wall='M_Wall_Brick_yellow_Blank', trim='M_Wall_Plaster_white_Blank', shop=False)
h.facades(window=(1.2, 1.45), pitch=2.9, kind='modern', panels='M_Wall_Wood_ochre_Blank')
h.roof(shape='flat')
