"""w1154732378: Street View (2010–2024): terraced houses: pale grey boards
(Edited by hand: dark-brown upper storey over pale boards below (Street View 2024).)"""
import housekit

h = housekit.House(ctx, levels=2, wall='M_Wall_Wood_brown_Blank', lower='M_Wall_Wood_pale_Blank', trim='M_Wall_Wood_white_Blank', shop=False)
h.facades(window=(1.1, 1.45), pitch=2.6, kind='sash')
h.roof(shape='gabled', pitch=26, mat='M_Roof_Metal_black')
h.chimney(0.35, 0.55)
