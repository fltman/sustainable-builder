"""Hotell Rättvik: Street View (2011–2025): Hotell Rättvik: red brick, set-back attic storey
(Hand-edited: shop sign added (Street View).)"""
import housekit

h = housekit.House(ctx, levels=3, wall='M_Wall_Brick_red_Blank', trim='M_Wall_Plaster_white_Blank', shop=False)
h.facades(window=(1.1, 1.45), pitch=2.6, kind='sash')
h.roof(shape='hipped', pitch=22, mat='M_Roof_Metal_black')
h.chimney(0.35, 0.55)
h.sign('HOTELL RÄTTVIK', size=0.6, mat='M_Wall_Plaster_white_Blank', z=h.eave - 1.2)
