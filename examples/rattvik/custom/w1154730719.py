"""w1154730719: Street View (2011–2025): big retail hall on Annikasgatan
(Starter script from housekit_seed.py — compare with the photo and edit by hand.)"""
import housekit

h = housekit.House(ctx, levels=1, wall='M_Wall_Plaster_beige_Blank', trim='M_Wall_Plaster_white_Blank', shop=True, ground=5.5, plinth='M_Concrete')
h.facades(window=(1.4, 1.2), pitch=3.2, kind='modern', sign_mat='M_Wall_Plaster_white_Blank')
h.roof(shape='flat')
