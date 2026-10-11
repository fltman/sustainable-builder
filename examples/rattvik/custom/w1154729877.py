"""w1154729877: Street View (2010–2024): white chapel/meeting hall, tall round-arched windows (church-like)
(Starter script from housekit_seed.py — compare with the photo and edit by hand.)"""
import housekit

h = housekit.House(ctx, levels=2, wall='M_Wall_Plaster_white_Blank', trim='M_Wall_Plaster_grey_Blank', shop=False, plinth='M_Concrete')
h.facades(window=(1.4, 1.2), pitch=3.2, kind='arched')
h.roof(shape='gabled', pitch=26, mat='M_Roof_Metal_black')
