"""Sibylla: Street View (May 2024): Sibylla (Riksvägen 27): low dark-brown fast-food building
(Hand-edited: shop sign added (Street View).)"""
import housekit

h = housekit.House(ctx, levels=1, wall='M_Wall_Wood_brown_Blank', trim='M_Wall_Wood_white_Blank', shop=True, ground=4.5, plinth='M_Concrete')
h.facades(window=(1.4, 1.2), pitch=3.2, kind='modern', sign_mat='M_Wall_Wood_white_Blank')
h.roof(shape='flat')
h.sign('Sibylla', size=0.7, mat='M_Wall_Plaster_white_Blank', board='M_Roof_Metal_red')
