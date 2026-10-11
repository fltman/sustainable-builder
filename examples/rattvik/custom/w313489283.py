"""w313489283: Street View 2024 (Centralgatan, Backavägen, Prästskogsgatan): Rättviksskolan, red-brick 2-storey school blocks with flat roofs among pines
(Starter script from housekit_seed.py — compare with the photo and edit by hand.)"""
import housekit

h = housekit.House(ctx, levels=2, wall='M_Wall_Brick_red_Blank', trim='M_Wall_Plaster_white_Blank', shop=False)
h.facades(window=(1.2, 1.45), pitch=2.9, kind='modern')
h.roof(shape='flat')
