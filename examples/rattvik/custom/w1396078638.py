"""w1396078638: Street View (2024–2025): Hällebergs väg 39: long falu-red timber office, dormers
(Starter script from housekit_seed.py — compare with the photo and edit by hand.)"""
import housekit

h = housekit.House(ctx, levels=2, wall='M_Wall_Wood_falu_Blank', trim='M_Wall_Wood_white_Blank', shop=False)
h.facades(window=(1.2, 1.45), pitch=2.9, kind='modern')
h.roof(shape='gabled', pitch=34, mat='M_Roof_Tiles_red')
h.dormers([0.3, 0.7], side='street', mat='M_Wall_Wood_falu_Blank', roof_mat='M_Roof_Tiles_red')
