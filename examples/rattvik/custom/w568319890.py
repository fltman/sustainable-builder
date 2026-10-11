"""Församlingshemmet, Torggatan 19 (Street View 2019): long dark-brown timber hall of two storeys on a
stone base, white windows, red-brown tile roof with dormers and two brick chimneys."""
import housekit

h = housekit.House(ctx, levels=2, wall='M_Wall_Wood_brown_Blank', trim='M_Wall_Wood_white_Blank',
                   plinth='M_StoneWall', shop=False)
h.facades(window=(1.2, 1.4), pitch=2.6, plinth_h=0.8)
h.roof(shape='gabled', pitch=42, mat='M_Roof_Tiles_brown')
h.dormers([0.2, 0.45, 0.7], side='street', mat='M_Wall_Wood_brown_Blank', roof_mat='M_Roof_Tiles_brown')
h.chimney(0.3, 0.6)
h.chimney(0.65, 0.4)
