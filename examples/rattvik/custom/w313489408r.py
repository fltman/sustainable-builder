"""w313489408r: Street View (2011–2025): Stiernhöökgatan 1: yellow rendered block, pale stair bays
(Starter script from housekit_seed.py — compare with the photo and edit by hand.)"""
import housekit

h = housekit.House(ctx, levels=3, wall='M_Wall_Plaster_yellow_Blank', trim='M_Wall_Plaster_white_Blank', shop=False)
h.facades(window=(1.2, 1.45), pitch=2.9, kind='modern')
h.roof(shape='hipped', pitch=22, mat='M_Roof_Metal_black')
