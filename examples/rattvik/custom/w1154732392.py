"""w1154732392: Street View (2010–2024): modern cream apartment block, same estate as 67
(Starter script from housekit_seed.py — compare with the photo and edit by hand.)"""
import housekit

h = housekit.House(ctx, levels=3, wall='M_Wall_Plaster_ivory_Blank', trim='M_Wall_Plaster_white_Blank', shop=False)
h.facades(window=(1.2, 1.45), pitch=2.9, kind='modern')
h.roof(shape='hipped', pitch=22, mat='M_Roof_Metal_grey')
