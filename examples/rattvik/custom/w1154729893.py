"""Vasagatan 3 (Street View 2024): white two-storey timber house with its gable to the street, small shop
windows on the ground floor, white trim and a black metal roof."""
import housekit

h = housekit.House(ctx, levels=2, wall='M_Wall_Wood_white_Blank', trim='M_Wall_Wood_white_Blank',
                   frame='M_Wall_Wood_grey_Blank', shop=True)
h.facades(window=(1.1, 1.45), pitch=2.4, sign_mat='M_Wall_Wood_white_Blank')
h.roof(shape='gabled', pitch=40, mat='M_Roof_Metal_black', ridge='short')
h.chimney(0.5, 0.5)
