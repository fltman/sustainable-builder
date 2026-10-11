"""w1320068744: Street View May 2024: 1960s red brick one-storey villa, brown boards under big windows, dark tile roof, chimney, entrance steps
(Starter script from housekit_seed.py — compare with the photo and edit by hand.)"""
import housekit

h = housekit.House(ctx, levels=1, wall='M_Wall_Brick_red_Blank', trim='M_Wall_Plaster_white_Blank', shop=False)
h.facades(window=(1.2, 1.45), pitch=2.9, kind='modern')
h.roof(shape='gabled', pitch=34, mat='M_Roof_Tiles_dark')
h.chimney(0.35, 0.55)
