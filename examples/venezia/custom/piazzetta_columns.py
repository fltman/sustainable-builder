"""The two granite columns of the Piazzetta (OSM ways 430963095 Colonna di San Marco and 431003750
Colonna di San Teodoro with their building:parts, hidden in overrides.json). Free-standing: this file
name is no building id. References: ../references/palazzo-ducale/ and ../references/marciana/ (both show them).

- Monolithic granite shafts (grey for St Mark, warm grey-pink for St Theodore), ~1.5 m thick, ~12 m tall,
  on stepped octagonal bases with carved panels, white Veneto-Byzantine capitals and imposts (~15 m);
- on St Mark's: the bronze winged lion with its paws on the open book, facing east along the Molo;
- on St Theodore's: the marble saint with spear and shield standing on the crocodile.
Positions and heights from OSM (shaft 14 m, capital 14–15 m).
"""
import inspect
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(inspect.currentframe().f_code.co_filename), 'lib'))
import vkit  # noqa: E402
from vkit import GRANITE, PATINA, STONE, WHITE, Frame, figure, rot_box  # noqa: E402

PINK = 'M_Wall_Plaster_beige_Blank'         # St Theodore's shaft: Egyptian granite weathered to a warm grey-pink (rose read as red)
A = math.radians(15.7)                    # the Molo's direction; both face the lagoon (south)


def column(g, x, y, shaft_mat):
    fr = Frame(g, x, y, A)
    for k, (r, h) in enumerate(((2.9, 0.45), (2.45, 0.45), (2.0, 0.5))):     # three octagonal steps
        z = sum(hh for _, hh in ((2.9, 0.45), (2.45, 0.45), (2.0, 0.5))[:k])
        fr.revolve(0.0, 0.0, z - (0.3 if k == 0 else 0.0), [(r, 0.0), (r, h + (0.3 if k == 0 else 0.0)), (0.0, h + (0.3 if k == 0 else 0.0))],
                   STONE if k < 2 else WHITE, 8, smooth=False, a0=math.pi / 8, around=8, vlen=1.0)
    fr.revolve(0.0, 0.0, 1.4, [(1.15, 0.0), (1.15, 0.9), (0.95, 1.05)], WHITE, 8, smooth=False, a0=math.pi / 8, around=4, vlen=1.0)
    fr.revolve(0.0, 0.0, 2.45, [(0.82, 0.0), (0.76, 6.0), (0.7, 11.6)], shaft_mat, 14, smooth=True, around=2, vlen=3.0)
    fr.revolve(0.0, 0.0, 13.95, [(0.72, 0.0), (0.82, 0.3), (1.15, 0.95), (1.2, 1.05)], WHITE, 12, smooth=False, around=2, vlen=1.0)
    rot_box(fr, 0.0, 0.0, 15.0, 2.3, 2.3, 0.45, 0.0, WHITE)
    return fr


g = Geo()
# --- St Mark's: grey granite, the bronze winged lion facing east along the Molo
fm = column(g, 188.0, -183.7, GRANITE)
lf = fm.sub(0.0, 0.0, 0.0, 15.45)                 # the lion's frame: u forwards (east, along the Molo)
lf.box(0.0, 0.0, 0.0, 2.6, 1.2, 0.25, PATINA)
lf.box(0.0, 0.0, 0.95, 2.5, 0.85, 0.85, PATINA)                       # body
lf.box(0.95, 0.0, 1.55, 0.9, 1.05, 0.95, PATINA)                      # mane and chest
lf.box(1.5, 0.0, 1.75, 0.55, 0.6, 0.5, PATINA)                        # head and muzzle
for lu, lw in ((0.95, -0.3), (0.95, 0.3), (-0.95, -0.3), (-0.95, 0.3)):
    lf.box(lu, lw, 0.2, 0.22, 0.22, 0.8, PATINA)
lf.box(1.3, 0.0, 0.25, 0.6, 0.8, 0.12, WHITE)                         # the open book under its paw
lf.face([(-1.25, -0.08, 1.6), (-1.25, 0.08, 1.6), (-1.75, 0.08, 2.15), (-1.75, -0.08, 2.15)], PATINA)   # tail
for side in (-1, 1):                                                  # wings raised behind the shoulders
    q = [(0.6, side * 0.4, 1.7), (-0.6, side * 0.42, 1.7), (-1.3, side * 0.7, 2.9), (-0.2, side * 0.65, 3.3), (0.5, side * 0.5, 2.6)]
    lf.face(q, PATINA)
    lf.face(q[::-1], PATINA)
# --- St Theodore's: reddish granite, the saint on the crocodile
ft = column(g, 168.3, -191.0, PINK)
tf = ft.sub(0.0, 0.0, -math.pi / 2, 15.45)
tf.box(0.0, 0.0, 0.0, 1.7, 1.2, 0.3, WHITE)
tf.revolve(0.0, 0.0, 0.3, [(0.0, 0.0), (0.45, 0.0), (0.4, 0.3), (0.0, 0.35)], STONE, 6, smooth=False, around=1, vlen=1.0)
tf.box(0.15, 0.0, 0.3, 1.9, 0.5, 0.3, STONE)                          # the crocodile
tf.box(1.15, 0.0, 0.32, 0.6, 0.3, 0.18, STONE)
figure(tf, 0.0, 0.0, 0.6, 2.5, WHITE, seg=6)
rot_box(tf, 0.15, -0.45, 0.6, 0.07, 0.07, 3.3, 0.0, 'M_Fixture_Metal')   # spear
tf.face([(0.32, 0.35, 1.2), (0.32, 0.75, 1.2), (0.32, 0.75, 2.0), (0.32, 0.35, 2.0)], WHITE)              # shield
tf.face([(0.32, 0.35, 1.2), (0.32, 0.75, 1.2), (0.32, 0.75, 2.0), (0.32, 0.35, 2.0)][::-1], WHITE)
vkit.emit(ctx, g, 'Piazzetta_columns', samples=[(188.0, -183.7), (168.3, -191.0)])
print(f'  [custom] Piazzetta columns: {vkit.tris(g)} triangles', flush=True)
