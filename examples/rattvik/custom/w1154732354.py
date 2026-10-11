"""Storgatan 1 (Street View 2024): two-storey timber house, beige boards above a yellow shop storey with
white trim, a red metal gabled roof."""
import housekit

h = housekit.House(ctx, levels=2, wall='M_Wall_Wood_cream_Blank', trim='M_Wall_Wood_white_Blank', shop=True)
h.facades(window=(1.2, 1.5), pitch=2.6, sign_mat='M_Wall_Wood_yellow_Blank')
h.roof(shape='gabled', pitch=32, mat='M_Roof_Metal_red')
h.chimney(0.5, 0.4)
