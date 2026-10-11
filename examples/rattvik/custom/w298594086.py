"""Storgatan 5, the café (Street View 2010–2024): white timber house of one and a half storeys with a
steep red tile roof, a cross gable towards Storgatan and café windows."""
import housekit

h = housekit.House(ctx, levels=1, ground=3.4, wall='M_Wall_Wood_white_Blank', trim='M_Wall_Wood_white_Blank',
                   frame='M_Wall_Wood_brown_Blank', shop=True)
h.facades(window=(1.1, 1.4), pitch=2.4, sign_mat='M_Wall_Wood_brown_Blank', awnings=['M_Roof_Metal_red', 'M_Wall_Wood_white_Blank'])
h.roof(shape='gabled', pitch=45, mat='M_Roof_Tiles_red')
h.cross_gable(frac=0.5, width=4.2, height=1.8, pitch=50, roof_mat='M_Roof_Tiles_red', windows=2)
h.chimney(0.25, 0.6)
