"""w1429391826: surveyed
(Starter script from housekit_seed.py — generated look, not surveyed yet.)"""
import housekit

h = housekit.House(ctx, levels=2, wall='M_Wall_Wood_brown_Blank', trim='M_Wall_Wood_white_Blank', shop=False)
h.facades(window=(1.1, 1.45), pitch=2.6, kind='sash')
h.roof(shape='hipped', pitch=30, mat='M_Roof_Tiles_dark')
h.chimney(0.35, 0.55)
