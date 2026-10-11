"""Fauna AB: Street View (2024–2025): Fauna (Riksvägen): long low brown timber store, red tile hipped roof, glass front
(Hand-edited: shop sign added (Street View).)"""
import housekit

h = housekit.House(ctx, levels=1, wall='M_Wall_Wood_brown_Blank', trim='M_Wall_Wood_white_Blank', shop=True, ground=4.5, plinth='M_Concrete')
h.facades(window=(1.4, 1.2), pitch=3.2, kind='modern', sign_mat='M_Wall_Wood_white_Blank')
h.roof(shape='hipped', pitch=30, mat='M_Roof_Tiles_red')
h.sign('fauna', size=0.9, mat='M_Wall_Plaster_white_Blank', board='M_Roof_Metal_red')
