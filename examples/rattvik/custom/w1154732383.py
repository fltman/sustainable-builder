"""w1154732383: Street View (2010–2024): Ågatan 12: red brick villa, green metal hipped roof
(Starter script from housekit_seed.py — compare with the photo and edit by hand.)"""
import housekit

h = housekit.House(ctx, levels=2, wall='M_Wall_Brick_red_Blank', trim='M_Wall_Plaster_white_Blank', shop=False)
h.facades(window=(1.1, 1.45), pitch=2.6, kind='sash')
h.roof(shape='hipped', pitch=22, mat='M_Roof_Metal_green')
h.chimney(0.35, 0.55)
