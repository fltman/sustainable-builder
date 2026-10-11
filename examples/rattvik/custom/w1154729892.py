"""w1154729892: Street View (2010–2024): Vasagatan 6: 60s/70s office-shop block, pale upper floor, red ground-floor panels + red-pillared walkway
(Starter script from housekit_seed.py — compare with the photo and edit by hand.)"""
import housekit

h = housekit.House(ctx, levels=2, wall='M_Wall_Concrete_light_Blank', trim='M_Wall_Plaster_white_Blank', shop=True)
h.facades(window=(1.2, 1.45), pitch=2.9, kind='modern', sign_mat='M_Wall_Plaster_white_Blank')
h.roof(shape='flat')
