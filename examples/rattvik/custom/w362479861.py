"""w362479861: photo 2019 (references/kommunalhus/front_sw_2019.jpg): pale-yellow rendered block beside the kommunalhus, hipped roof, white window surrounds
(Starter script from housekit_seed.py — compare with the photo and edit by hand.)"""
import housekit

h = housekit.House(ctx, levels=2, wall='M_Wall_Plaster_ivory_Blank', trim='M_Wall_Plaster_white_Blank', shop=False)
h.surrounds = True
h.facades(window=(1.2, 1.45), pitch=2.9, kind='modern')
h.roof(shape='hipped', pitch=30, mat='M_Roof_Tiles_brown')
