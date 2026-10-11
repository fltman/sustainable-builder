"""Storgatan 15–17, the galleria (Street View 2011): a postmodern three-storey block in peach render
with white trim, shops along Storgatan (Lerdalia, Young People …), white-railed balconies on the upper
floors and a tall central gable with a big arched glazed window in green frames that rises above the
eaves. Hand-edited housekit script."""
import housekit

h = housekit.House(ctx, levels=3, wall='M_Wall_Plaster_salmon_Blank', trim='M_Wall_Plaster_white_Blank', shop=True)
h.surrounds = True
h.facades(window=(1.2, 1.5), pitch=2.8, sign_mat='M_Wall_Plaster_white_Blank',
          awnings=['M_Roof_Metal_green'])
h.roof(shape='gabled', pitch=22, mat='M_Roof_Metal_grey')
st = max(h.street, key=lambda i: h.walls[i].L)
L = h.walls[st].L
wall, ze, zt, rz = h.cross_gable(frac=0.62, width=5.6, height=2.6, pitch=40, roof_mat='M_Roof_Metal_grey', windows=0)
# the big arched window through the gable, green frames
xc = wall.L / 2
shape = housekit.arch(xc, h.ground + 0.4, 3.0, zt - h.ground + 1.2)
wall.poly(shape, housekit.GLASS, 0.06, uv=[(0.2 + 0.6 * (x - xc + 1.5) / 3.0, 0.5) for x, z in shape])
for dx in (-0.75, 0.0, 0.75):
    wall.rect(xc + dx - 0.05, xc + dx + 0.05, h.ground + 0.4, zt + 0.9, 'M_Roof_Metal_green', 0.08)
for zz in (h.ground + 1.6, h.ground + 3.6, h.ground + 5.4):
    wall.rect(xc - 1.5, xc + 1.5, zz - 0.05, zz + 0.05, 'M_Roof_Metal_green', 0.08)
for f in (0.18, 0.38, 0.85):
    for s in (2, 3):
        h.balcony(st, x=L * f, storey=s, width=2.6, depth=1.1, rail='M_Wall_Plaster_white_Blank')
