"""w1021070735: Street View (2024–2025): Mekonomen, Filarvägen 9: cream low building
(Hand-edited: shop sign added (Street View).)"""
import housekit

h = housekit.House(ctx, levels=1, wall='M_Wall_Plaster_ivory_Blank', trim='M_Wall_Plaster_white_Blank', shop=True, ground=5.0, plinth='M_Concrete')
h.facades(window=(1.4, 1.2), pitch=3.2, kind='modern', sign_mat='M_Wall_Plaster_white_Blank')
h.roof(shape='flat')
h.sign('MEKONOMEN', size=0.6, mat='M_Roof_Metal_black', board='M_Wall_Wood_yellow_Blank')
