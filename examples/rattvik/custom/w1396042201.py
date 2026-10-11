"""w1396042201: Street View May 2024: yellow corrugated hall wall beside the SPEGELS hall
(Starter script from housekit_seed.py — compare with the photo and edit by hand.)"""
import housekit

h = housekit.House(ctx, levels=1, wall='M_Wall_Wood_ochre_Blank', trim='M_Wall_Wood_white_Blank', shop=False, plinth='M_Concrete')
h.facades(window=(1.4, 1.2), pitch=3.2, kind='modern')
h.roof(shape='flat')
