"""w326305892: Street View (2011–2025): Prästskogsgatan 4: ochre board-clad block, red trim
(Starter script from housekit_seed.py — compare with the photo and edit by hand.)"""
import housekit

h = housekit.House(ctx, levels=3, wall='M_Wall_Wood_ochre_Blank', trim='M_Wall_Wood_white_Blank', shop=False, frame='M_Wall_Wood_falu_Blank')
h.facades(window=(1.2, 1.45), pitch=2.9, kind='modern')
h.roof(shape='gabled', pitch=26, mat='M_Roof_Metal_black')
