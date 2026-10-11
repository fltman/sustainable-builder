"""w907559160: Street View May 2024: turn-of-the-century villa on Dalagatan: pale pinkish-beige render, steep dark hipped roof with gables and dormers, chimneys
(Starter script from housekit_seed.py — compare with the photo and edit by hand.)"""
import housekit

h = housekit.House(ctx, levels=3, wall='M_Wall_Plaster_beige_Blank', trim='M_Wall_Plaster_white_Blank', shop=False)
h.facades(window=(1.1, 1.45), pitch=2.6, kind='sash')
h.roof(shape='hipped', pitch=45, mat='M_Roof_Tiles_dark')
h.dormers([0.3, 0.7], side='street', mat='M_Wall_Plaster_beige_Blank', roof_mat='M_Roof_Tiles_dark')
h.chimney(0.35, 0.55)
