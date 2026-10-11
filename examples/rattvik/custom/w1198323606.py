"""Storgatan 17, the flower shop (Street View 2011): two-storey yellow timber house with white trim, a
central cross gable with a decorated gable, a glazed shop front and a grey metal roof."""
import housekit

h = housekit.House(ctx, levels=2, wall='M_Wall_Wood_yellow_Blank', trim='M_Wall_Wood_white_Blank', shop=True)
h.facades(window=(1.2, 1.5), pitch=2.5, sign_mat='M_Wall_Wood_white_Blank', awnings=['M_Wall_Wood_white_Blank'])
h.roof(shape='gabled', pitch=30, mat='M_Roof_Metal_grey')
h.cross_gable(frac=0.5, width=5.5, pitch=48, roof_mat='M_Roof_Metal_grey', windows=2)
h.chimney(0.2, 0.5)
h.chimney(0.8, 0.5)
