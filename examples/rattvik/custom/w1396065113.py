"""w1396065113: Street View May 2024: dark-stained two-storey timber building with a red tile roof and an open timber shed in front
(Starter script from housekit_seed.py — compare with the photo and edit by hand.)"""
import housekit

h = housekit.House(ctx, levels=2, wall='M_Wall_Wood_brown_Blank', trim='M_Wall_Wood_white_Blank', shop=False, plinth='M_Concrete')
h.facades(window=(1.4, 1.2), pitch=3.2, kind='modern')
h.roof(shape='gabled', pitch=34, mat='M_Roof_Tiles_red')
