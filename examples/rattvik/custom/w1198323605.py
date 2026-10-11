"""w1198323605: Street View (2011–2025): Storgatan/Knihsgatan corner: beige render, shops
(Starter script from housekit_seed.py — compare with the photo and edit by hand.)"""
import housekit

h = housekit.House(ctx, levels=3, wall='M_Wall_Plaster_beige_Blank', trim='M_Wall_Plaster_white_Blank', shop=True)
h.facades(window=(1.1, 1.45), pitch=2.6, kind='sash', sign_mat='M_Wall_Plaster_white_Blank')
h.roof(shape='gabled', pitch=34, mat='M_Roof_Tiles_red')
h.chimney(0.35, 0.55)
