"""w206306966: Street View May 2024: Surt sushi: white one-storey board building, dark hipped tile roof, double doors and the green-and-red sign
(Hand-edited: shop sign added (Street View).)"""
import housekit

h = housekit.House(ctx, levels=1, wall='M_Wall_Wood_white_Blank', trim='M_Wall_Wood_white_Blank', shop=False)
h.facades(window=(1.1, 1.45), pitch=2.6, kind='sash')
h.roof(shape='hipped', pitch=30, mat='M_Roof_Tiles_dark')
h.chimney(0.35, 0.55)
h.sign('Surt sushi', size=0.6, z=2.4, mat='M_Roof_Metal_signgreen', board='M_Roof_Metal_black')
