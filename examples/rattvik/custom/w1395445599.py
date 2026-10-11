"""w1395445599: Street View May 2024: RÄTTVIKS ANTIK: one-storey falu red shop with a low grey metal roof and the sign along the eave
(Hand-edited: shop sign added (Street View).)"""
import housekit

h = housekit.House(ctx, levels=1, wall='M_Wall_Wood_falu_Blank', trim='M_Wall_Wood_white_Blank', shop=False)
h.facades(window=(1.1, 1.45), pitch=2.6, kind='sash')
h.roof(shape='gabled', pitch=26, mat='M_Roof_Metal_grey')
h.chimney(0.35, 0.55)
h.sign('RÄTTVIKS ANTIK', size=0.45, z=h.eave - 0.8, mat='M_Roof_Metal_black', board='M_Wall_Wood_white_Blank')
