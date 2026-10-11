"""w326305896: Street View (2010–2024): Centralgatan: ochre board-clad 40s/50s apartment block; red-painted window frames and door surround, roof dormers, brick chimneys (Street View 2011/2024)
(Starter script from housekit_seed.py — compare with the photo and edit by hand.)"""
import housekit

h = housekit.House(ctx, levels=3, wall='M_Wall_Wood_ochre_Blank', trim='M_Wall_Wood_white_Blank', shop=False, frame='M_Wall_Wood_falu_Blank')
h.facades(window=(1.2, 1.45), pitch=2.9, kind='modern')
h.roof(shape='gabled', pitch=26, mat='M_Roof_Metal_black')
h.dormers([0.3, 0.7], side='street', mat='M_Wall_Wood_ochre_Blank', roof_mat='M_Roof_Metal_black')
h.chimney(0.35, 0.55)
