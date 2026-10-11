"""Sankt Olofs gravkapell: Sankt Olofs gravkapell (1967): white render, single storey, two dark grey hipped roofs (references/kyrka/NOTES.md, aerials)
(Starter script from housekit_seed.py — compare with the photo and edit by hand.)"""
import housekit

h = housekit.House(ctx, levels=1, wall='M_Wall_Plaster_white_Blank', trim='M_Wall_Plaster_grey_Blank', shop=False, ground=3.0)
h.facades(window=(1.1, 1.45), pitch=2.6, kind='sash')
h.roof(shape='hipped', pitch=28, mat='M_Roof_Slate_dark')
h.chimney(0.35, 0.55)
