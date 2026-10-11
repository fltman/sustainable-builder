"""Storgatan 15b (Street View 2011–2024): dusty-red rendered two-storey shop building with a long
blue-and-white striped awning over the café windows and a low dark roof."""
import housekit

h = housekit.House(ctx, levels=2, wall='M_Wall_Plaster_red_Blank', trim='M_Wall_Plaster_white_Blank', shop=True)
h.facades(window=(1.2, 1.5), pitch=2.7, sign_mat='M_Wall_Plaster_white_Blank',
          awnings=['M_Wall_Metal_blue_Blank', 'M_Wall_Plaster_white_Blank'])
h.roof(shape='gabled', pitch=18, mat='M_Roof_Metal_black')
h.chimney(0.5, 0.5)
