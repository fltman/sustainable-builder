"""The 1950s red-brick corner block at Storgatan/Knihsgatan (Street View 2011–2024): shops below three
brick storeys, green balconies, light bay windows towards Knihsgatan and a black hipped roof."""
import housekit

h = housekit.House(ctx, levels=4, wall='M_Wall_Brick_red_Blank', trim='M_Wall_Plaster_white_Blank', shop=True)
h.facades(window=(1.2, 1.45), pitch=2.9, kind='modern', sign_mat='M_Wall_Plaster_white_Blank')
h.roof(shape='hipped', pitch=22, mat='M_Roof_Metal_black')
for i in sorted(h.street, key=lambda i: -h.walls[i].L)[:2]:
    L = h.walls[i].L
    for s in (2, 3, 4):
        for f in (0.3, 0.7):
            h.balcony(i, x=L * f, storey=s, width=2.4, depth=1.1, rail='M_Roof_Metal_green', slab='M_Concrete')
h.sign('Sörlins Bokhandel', size=0.45, mat='M_Wall_Plaster_white_Blank', board='M_Wall_Metal_blue_Blank')
