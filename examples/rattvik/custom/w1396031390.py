"""w1396031390: Street View May 2024: low brown timber building on Prästskogsgatan with dark board doors and an open front on posts
(Starter script from housekit_seed.py — compare with the photo and edit by hand.)"""
import housekit

h = housekit.House(ctx, levels=1, wall='M_Wall_Wood_brown_Blank', trim='M_Wall_Wood_white_Blank', shop=False, ground=3.0)
h.facades(window=(1.1, 1.45), pitch=2.6, kind='sash')
h.roof(shape='gabled', pitch=26, mat='M_Roof_Metal_grey')
h.chimney(0.35, 0.55)
