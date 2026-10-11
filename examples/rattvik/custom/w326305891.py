"""Torget 2, the travel centre by the station (Street View 2024): long one-storey building in cream boards
with white trim, red-framed glass doors, a carved board gable over the entrance, dark roof with dormers.
The long side faces the station square."""
import math
import housekit

walls = [(i, math.dist(p, q)) for i, (p, q) in enumerate(zip(ctx.footprint['outer'], ctx.footprint['outer'][1:] + ctx.footprint['outer'][:1]))]
square = (328.0, -119.0)                                    # the station square
ring = housekit.House(ctx, levels=1).ring                    # counter-clockwise, as the House uses it
long_sides = sorted(range(len(ring)), key=lambda i: -math.dist(ring[i], ring[(i + 1) % len(ring)]))[:2]
front = min(long_sides, key=lambda i: math.dist(((ring[i][0] + ring[(i + 1) % len(ring)][0]) / 2,
                                                  (ring[i][1] + ring[(i + 1) % len(ring)][1]) / 2), square))
h = housekit.House(ctx, levels=1, ground=3.6, wall='M_Wall_Wood_cream_Blank', trim='M_Wall_Wood_white_Blank',
                   frame='M_Roof_Metal_red', shop=True, street=[front])
h.facades(window=(1.4, 1.5), pitch=3.0, sign_mat='M_Wall_Wood_white_Blank')
h.roof(shape='gabled', pitch=30, mat='M_Roof_Slate_dark')
h.cross_gable(frac=0.42, width=6.0, height=0.8, pitch=35, roof_mat='M_Roof_Slate_dark', windows=0)
h.dormers([0.18, 0.75], side='both', mat='M_Wall_Wood_cream_Blank', roof_mat='M_Roof_Slate_dark')
h.sign('Resecentrum', size=0.5, mat='M_Roof_Metal_black', board='M_Wall_Wood_white_Blank')
