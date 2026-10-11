"""w1396095094: Street View May 2024: falu red 1½-storey storehouse, gable to the street with a single window, steep dark roof
(Hand-edited: a storehouse — windows only in the gables, no chimney.)"""
import housekit

h = housekit.House(ctx, levels=1, wall='M_Wall_Wood_falu_Blank', trim='M_Wall_Wood_white_Blank', shop=False)
h.facades(window=(1.0, 1.0), pitch=2.6, kind='sash', skip={i: [(0, 99)] for i in range(len(h.walls)) if h.walls[i].L > 9})
h.roof(shape='gabled', pitch=45, mat='M_Roof_Tiles_dark')
