"""w1396042203: Street View (2024–2025): Reparatörvägen 5: cream low office block
(Starter script from housekit_seed.py — compare with the photo and edit by hand.)"""
import housekit

h = housekit.House(ctx, levels=1, wall='M_Wall_Plaster_ivory_Blank', trim='M_Wall_Plaster_white_Blank', shop=False, ground=4.5, plinth='M_Concrete')
h.facades(window=(1.4, 1.2), pitch=3.2, kind='modern')
h.roof(shape='flat')
