"""w206306954r: Street View May 2024: petrol station shop, white one-storey with a glazed front and red signs
(Starter script from housekit_seed.py — compare with the photo and edit by hand.)"""
import housekit

h = housekit.House(ctx, levels=1, wall='M_Wall_Plaster_white_Blank', trim='M_Wall_Plaster_grey_Blank', shop=True)
h.facades(window=(1.1, 1.45), pitch=2.6, kind='sash', sign_mat='M_Wall_Plaster_white_Blank')
h.roof(shape='flat')
