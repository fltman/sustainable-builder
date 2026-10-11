"""w1154732381: Street View (2010–2024): Torggatan 6: beige rendered upper floor over a red brick ground floor, low hipped roof
(Starter script from housekit_seed.py — compare with the photo and edit by hand.)"""
import housekit

h = housekit.House(ctx, levels=2, wall='M_Wall_Plaster_beige_Blank', trim='M_Wall_Plaster_white_Blank', shop=False)
h.facades(window=(1.1, 1.45), pitch=2.6, kind='sash')
h.roof(shape='hipped', pitch=22, mat='M_Roof_Metal_grey')
h.chimney(0.35, 0.55)
