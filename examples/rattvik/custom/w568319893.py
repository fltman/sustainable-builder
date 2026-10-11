"""w568319893: Street View (2010–2024): Torggatan 17: ochre 1920s corner block, decorated window surrounds, chamfered corner entrance
(Starter script from housekit_seed.py — compare with the photo and edit by hand.)"""
import housekit

h = housekit.House(ctx, levels=3, wall='M_Wall_Plaster_ochre_Blank', trim='M_Wall_Plaster_white_Blank', shop=True)
h.surrounds = True
h.facades(window=(1.2, 1.45), pitch=2.9, kind='modern', sign_mat='M_Wall_Plaster_white_Blank')
h.roof(shape='hipped', pitch=22, mat='M_Roof_Metal_black')
