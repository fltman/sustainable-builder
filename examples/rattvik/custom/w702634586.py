"""w702634586: Street View (2011–2025): HSB-gatan 3: ochre rendered block with shops and awnings
(Starter script from housekit_seed.py — compare with the photo and edit by hand.)"""
import housekit

h = housekit.House(ctx, levels=3, wall='M_Wall_Plaster_ochre_Blank', trim='M_Wall_Plaster_white_Blank', shop=True)
h.facades(window=(1.2, 1.45), pitch=2.9, kind='modern', awnings=['M_Wall_Plaster_white_Blank'], sign_mat='M_Wall_Plaster_white_Blank')
h.roof(shape='hipped', pitch=22, mat='M_Roof_Metal_black')
