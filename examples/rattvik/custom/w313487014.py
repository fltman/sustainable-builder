"""Circle K: Street View (2011–2025): Circle K: grey metal box, red car-wash end
(Hand-edited: shop sign added (Street View).)"""
import housekit

h = housekit.House(ctx, levels=1, wall='M_Wall_Metal_grey_Blank', trim='M_Wall_Plaster_white_Blank', shop=False, ground=5.0, plinth='M_Concrete')
h.facades(window=(1.4, 1.2), pitch=3.2, kind='modern')
h.roof(shape='flat')
h.sign('CIRCLE K', size=0.8, mat='M_Wall_Plaster_white_Blank', board='M_Roof_Metal_red')
