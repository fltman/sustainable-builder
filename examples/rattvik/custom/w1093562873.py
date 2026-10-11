"""Pale blue block by Knihsgatan (Street View 2010–2024): three-storey pale blue-grey render with a long
blue shop canopy, white window surrounds and a black hipped roof."""
import housekit

h = housekit.House(ctx, levels=3, wall='M_Wall_Plaster_blue_Blank', trim='M_Wall_Plaster_white_Blank', shop=True)
h.facades(window=(1.2, 1.55), pitch=2.7, sign_mat='M_Wall_Metal_blue_Blank', awnings=['M_Wall_Metal_blue_Blank'])
h.roof(shape='hipped', pitch=25, mat='M_Roof_Metal_black')
h.sign('Dala Guldsmide', size=0.45, mat='M_Wall_Plaster_white_Blank', board='M_Roof_Metal_black')
