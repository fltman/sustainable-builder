"""w690113213: Street View (2024–2025): Riksvägen: brown-red brick 2-storey with big shop windows (Rättviks måleri)
(Hand-edited: shop sign added (Street View).)"""
import housekit

h = housekit.House(ctx, levels=2, wall='M_Wall_Brick_red_Blank', trim='M_Wall_Plaster_white_Blank', shop=True)
h.facades(window=(1.1, 1.45), pitch=2.6, kind='sash', sign_mat='M_Wall_Plaster_white_Blank')
h.roof(shape='gabled', pitch=26, mat='M_Roof_Metal_black')
h.chimney(0.35, 0.55)
h.sign('RÄTTVIKS MÅLERI', size=0.45, mat='M_Roof_Metal_red', board='M_Wall_Plaster_white_Blank')
