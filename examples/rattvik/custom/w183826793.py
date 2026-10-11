"""Rättviks station (1929): references/station/NOTES.md (photos 1929–2019, Street View May 2024).

Symmetric main block along the tracks (bearing 147°), pale render, dark tiled roofs at about 33° with
all ridges parallel to the tracks:
  NW wing 7.6 m (1½ storeys) · central block 12.5 m (2 storeys, eaves 8.7, ridge 13.5, raised parapet
  gables at both ends, the square turret chimney with an open crown, ball and rooster on the NW
  parapet, about 18.5 m) · SE wing 7.2 m (1½ storeys).
A half-round bow window on the street side of the NW wing, the entrance with canopy and café sign on
the street side of the central block, "RÄTTVIK" and a small iron balcony on the track face, one small
arched dormer per central roof slope. The long one-storey annex to the NNW is the 1929 platform
canopy, now enclosed (arched windows and doors, its own platform roof on posts towards the tracks).
"""
import bpy

R = [tuple(p) for p in ctx.footprint['outer']]
if len(R) != 8:
    raise RuntimeError('Rättviks station: the OSM outline changed (expected 8 vertices) — update this script')
G = ctx.geo
WALL, TRIM, ROOF = 'M_Wall_Plaster_ivory_Blank', 'M_Wall_Plaster_white_Blank', 'M_Roof_Slate_dark'
GLASS, FRAME, DOOR = 'M_Window_Pane', 'M_Wall_Wood_green_Blank', 'M_Wall_Wood_brown_Blank'
STEEL, BLACK, GREEN, GOLD, GREY = 'M_Fixture_Metal', 'M_Roof_Metal_black', 'M_Roof_Metal_green', 'M_Roof_Metal_gold', 'M_Wall_Plaster_grey_Blank'
PLINTH = 'M_Concrete'
K = math.tan(math.radians(33))


class Frame:
    """u along the track side (R1 → R4, NNW → SSE), w towards the street, z up."""
    def __init__(self, p, q):
        L = math.dist(p, q)
        self.o, self.t = p, ((q[0] - p[0]) / L, (q[1] - p[1]) / L)
        self.l = (-self.t[1], self.t[0])

    def P(self, u, w, z=0.0):
        return (self.o[0] + self.t[0] * u + self.l[0] * w, self.o[1] + self.t[1] * u + self.l[1] * w, z)

    def uw(self, p):
        dx, dy = p[0] - self.o[0], p[1] - self.o[1]
        return dx * self.t[0] + dy * self.t[1], dx * self.l[0] + dy * self.l[1]


class Wall:
    def __init__(self, p, q):
        self.p, self.L = p, math.dist(p[:2], q[:2])
        self.t = ((q[0] - p[0]) / self.L, (q[1] - p[1]) / self.L)
        self.n = (self.t[1], -self.t[0])
        self.ang = math.atan2(self.t[1], self.t[0])

    def at(self, x, z, d=0.0):
        return (self.p[0] + self.t[0] * x + self.n[0] * d, self.p[1] + self.t[1] * x + self.n[1] * d, z)

    def poly(self, pts, mat, d=0.0, scale=4.0, uv=None):
        G.face([self.at(x, z, d) for x, z in pts], mat, uv or [(x / scale, z / scale) for x, z in pts])

    def rect(self, x0, x1, z0, z1, mat, d=0.0, scale=4.0, uv=None):
        if x1 - x0 > 1e-3 and z1 - z0 > 1e-3:
            self.poly([(x0, z0), (x1, z0), (x1, z1), (x0, z1)], mat, d, scale, uv)

    def ledge(self, x0, x1, z0, z1, mat, d1):
        self.rect(x0, x1, z0, z1, mat, d1)
        G.face([self.at(x0, z1, d1), self.at(x1, z1, d1), self.at(x1, z1, 0), self.at(x0, z1, 0)], mat, uvscale=1.0)
        G.face([self.at(x0, z0, 0), self.at(x1, z0, 0), self.at(x1, z0, d1), self.at(x0, z0, d1)], mat, uvscale=1.0)


def arch(xc, z0, w, h, n=8):
    r = w / 2
    zs = z0 + h - r
    return [(xc - r, z0), (xc + r, z0)] + [(xc + r * math.cos(math.pi * i / n), zs + r * math.sin(math.pi * i / n)) for i in range(n + 1)]


def window(w, xc, z0, width, height, arched=False, cols=2, rows=3):
    shape = arch(xc, z0, width, height) if arched else [(xc - width / 2, z0), (xc + width / 2, z0), (xc + width / 2, z0 + height), (xc - width / 2, z0 + height)]
    out = arch(xc, z0 - 0.12, width + 0.3, height + 0.27) if arched else [(xc - width / 2 - 0.15, z0 - 0.12), (xc + width / 2 + 0.15, z0 - 0.12),
                                                                           (xc + width / 2 + 0.15, z0 + height + 0.15), (xc - width / 2 - 0.15, z0 + height + 0.15)]
    w.poly(out, TRIM, 0.04)
    w.poly(shape, GLASS, 0.07, uv=[(0.2 + 0.6 * (x - xc + width / 2) / width, 0.42 + 0.48 * (z - z0) / height) for x, z in shape])
    top = z0 + height - (width / 2 if arched else 0)
    for k in range(1, cols):
        x = xc - width / 2 + width * k / cols
        w.rect(x - 0.03, x + 0.03, z0, z0 + height - 0.05, FRAME, 0.09)
    for k in range(1, rows):
        z = z0 + (top - z0) * k / rows
        w.rect(xc - width / 2, xc + width / 2, z - 0.03, z + 0.03, FRAME, 0.09)
    w.ledge(xc - width / 2 - 0.15, xc + width / 2 + 0.15, z0 - 0.2, z0 - 0.1, GREY, 0.14)


def gabled_part(u0, u1, w0, w1, eave, gables=(True, True), o=0.45, parapet=0.0):
    """A block with a gabled roof along u; gable triangles at the u0 / u1 ends (optionally raised as parapets)."""
    W = w1 - w0
    rise = W / 2 * K
    wm = (w0 + w1) / 2
    walls = [Wall(F.P(u0, w0), F.P(u1, w0)), Wall(F.P(u1, w0), F.P(u1, w1)), Wall(F.P(u1, w1), F.P(u0, w1)), Wall(F.P(u0, w1), F.P(u0, w0))]
    for w in walls:
        w.rect(0, w.L, -0.3, eave, WALL)
        w.ledge(0, w.L, -0.3, 0.6, PLINTH, 0.05)
    for w in (walls[0], walls[2]):
        w.ledge(-0.1, w.L + 0.1, eave - 0.45, eave - 0.15, TRIM, 0.22)
    drop = o * K
    eu0, eu1 = u0 - (o if not parapet else 0.0), u1 + (o if not parapet else 0.0)
    for (wa, wb) in ((w0 - o, wm), (w1 + o, wm)):
        pts = [F.P(eu0, wa, eave - drop), F.P(eu1, wa, eave - drop), F.P(eu1, wb, eave + rise), F.P(eu0, wb, eave + rise)]
        if wa > wm:
            pts = [F.P(eu1, wa, eave - drop), F.P(eu0, wa, eave - drop), F.P(eu0, wb, eave + rise), F.P(eu1, wb, eave + rise)]
        G.face(pts, ROOF, uvscale=2.0)
    for end, u in ((0, u0), (1, u1)):
        w = walls[3] if end == 0 else walls[1]
        if gables[end]:
            top = rise + parapet
            w.poly([(0, eave), (w.L, eave), (w.L, eave + parapet), (w.L / 2, eave + top), (0, eave + parapet)], WALL)
            if parapet:
                for a, b in (((0, eave + parapet), (w.L / 2, eave + top)), ((w.L / 2, eave + top), (w.L, eave + parapet))):
                    pa, pb = w.at(a[0], a[1], 0.12), w.at(b[0], b[1], 0.12)
                    G.face([pa, pb, (pb[0], pb[1], pb[2] + 0.22), (pa[0], pa[1], pa[2] + 0.22)], TRIM, uvscale=1.0)
    return walls, rise


# ------------------------------------------------------------------------------------------ plan
F = Frame(R[1], R[4])
U5, W5 = F.uw(R[5])
u_main0, u_main1 = F.uw(R[6])[0], F.uw(R[4])[0]
WM = W5                                                         # main block depth (≈15 m)
u_c0, u_c1 = u_main0 + 7.6, u_main1 - 7.2                        # central block
nw, rise_w = gabled_part(u_main0, u_c0, 0, WM, 5.6, gables=(True, False))
cb, rise_c = gabled_part(u_c0, u_c1, 0, WM, 8.7, gables=(True, True), parapet=0.5)
se, _ = gabled_part(u_c1, u_main1, 0, WM, 5.6, gables=(False, True))

# windows: ground floor everywhere, upper floor on the central block, attic windows in the gables
for walls, upper in ((nw, False), (cb, True), (se, False)):
    for i in (0, 2):
        w = walls[i]
        n = max(1, round((w.L - 1.0) / 2.6))
        for k in range(n):
            x = 0.5 + (w.L - 1.0) * (k + 0.5) / n
            if walls is cb and i == 2 and abs(x - w.L / 2) < 1.6:
                continue                                                 # the entrance
            if walls is nw and i == 2:
                continue                                                 # the bow window
            window(w, x, 1.1, 1.25, 2.1, cols=2, rows=3)
            if upper:
                window(w, x, 5.2, 1.25, 1.9, cols=2, rows=3)
for w, xs in ((nw[3], (-2.4, 0.0, 2.4)), (se[1], (-1.6, 1.6))):        # attic windows in the outer gables
    for dx in xs:
        window(w, w.L / 2 + dx, 6.6, 0.8, 1.2, arched=True, cols=1, rows=2)
for w in (se[1],):
    for dx in (-3.0, 0.0, 3.0):
        window(w, w.L / 2 + dx, 1.1, 1.25, 2.1)

# entrance, canopy and café sign on the street side of the central block
east = cb[2]
xe = east.L / 2
east.poly(arch(xe, 0.0, 2.2, 3.2), DOOR, 0.05)
east.rect(xe - 0.03, xe + 0.03, 0.0, 2.7, FRAME, 0.07)
east.rect(xe - 2.4, xe + 2.4, 3.55, 4.25, GREEN, 0.06)
c = [east.at(xe - 2.4, 3.3, 0.0), east.at(xe + 2.4, 3.3, 0.0), east.at(xe + 2.4, 3.3, 1.7), east.at(xe - 2.4, 3.3, 1.7)]
G.face(c[::-1], GREY, uvscale=1.0)
G.face([(p[0], p[1], 3.1) for p in c], TRIM, uvscale=1.0)
for a_, b_ in ((c[1], c[2]), (c[2], c[3]), (c[3], c[0])):
    G.face([(a_[0], a_[1], 3.1), (b_[0], b_[1], 3.1), (b_[0], b_[1], 3.3), (a_[0], a_[1], 3.3)], TRIM, uvscale=1.0)
for x in (xe - 2.2, xe + 2.2):
    p = east.at(x, 0, 1.55)
    G.box((p[0], p[1], 1.55), (0.1, 0.1, 3.1), STEEL, east.ang, uvscale=1.0)
for k in range(3):
    p = east.at(xe, 0, 0.35 + 0.35 * (2 - k))
    G.box((p[0], p[1], 0.08 + 0.15 * k), (3.6, 0.4 + 0.7 * (2 - k), 0.16), PLINTH, east.ang, uvscale=1.0)

# "RÄTTVIK" and an iron balcony on the track face of the central block
track = cb[0]
cu = bpy.data.curves.new('wb_text', 'FONT')
cu.body, cu.size, cu.align_x, cu.resolution_u = 'RÄTTVIK', 0.75, 'CENTER', 2
for path in ('/System/Library/Fonts/Supplemental/Arial Bold.ttf', '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'):
    try:
        cu.font = bpy.data.fonts.load(path, check_existing=True)
        break
    except (RuntimeError, OSError):
        pass
ob = bpy.data.objects.new('wb_text', cu)
bpy.context.scene.collection.objects.link(ob)
ev = ob.evaluated_get(bpy.context.evaluated_depsgraph_get())
me = ev.to_mesh()
for poly in me.polygons:
    pts = [(track.L / 2 + me.vertices[i].co.x, 4.15 + me.vertices[i].co.y) for i in poly.vertices]
    track.poly(pts, BLACK, 0.08, scale=0.5)
ev.to_mesh_clear()
bpy.data.objects.remove(ob)
bpy.data.curves.remove(cu)
bx = track.L / 2
b0, b1 = track.at(bx - 1.4, 5.0, 0.0), track.at(bx + 1.4, 5.0, 0.0)
b2, b3 = track.at(bx + 1.4, 5.0, 0.9), track.at(bx - 1.4, 5.0, 0.9)
G.face([b0, b1, b2, b3][::-1], STEEL, uvscale=1.0)
for a_, b_ in ((b1, b2), (b2, b3), (b3, b0)):
    G.face([(a_[0], a_[1], 5.0), (b_[0], b_[1], 5.0), (b_[0], b_[1], 6.0), (a_[0], a_[1], 6.0)], BLACK, uvscale=0.3)
    G.face([(a_[0], a_[1], 6.0), (b_[0], b_[1], 6.0), (b_[0], b_[1], 5.0), (a_[0], a_[1], 5.0)], BLACK, uvscale=0.3)

# small arched dormers, one on each central roof slope
for side in (1, -1):
    wd = WM / 2 - side * 2.6
    zb = 8.7 + (WM / 2 - abs(wd - WM / 2)) * K
    cxd, cyd, _ = F.P((u_c0 + u_c1) / 2, wd)
    G.box((cxd, cyd, zb + 0.55), (1.4, 1.6, 1.1), WALL, math.atan2(F.t[1], F.t[0]), uvscale=1.0)
    d = Wall(F.P((u_c0 + u_c1) / 2 + 0.7, wd - side * 0.8), F.P((u_c0 + u_c1) / 2 - 0.7, wd - side * 0.8)) if side > 0 else \
        Wall(F.P((u_c0 + u_c1) / 2 - 0.7, wd - side * 0.8), F.P((u_c0 + u_c1) / 2 + 0.7, wd - side * 0.8))
    d.poly(arch(0.7, zb + 0.15, 0.7, 0.85), GLASS, 0.02, uv=[(0.5, 0.6)] * 11)
    G.box((cxd, cyd, zb + 1.15), (1.6, 1.8, 0.12), ROOF, math.atan2(F.t[1], F.t[0]), uvscale=1.0)

# the square turret chimney on the NW parapet: open crown, ball, rooster (top ≈ 18.5 m)
tx, ty, _ = F.P(u_c0, WM / 2)
ztop = 8.7 + rise_c + 0.5
G.box((tx, ty, ztop + 1.0), (1.4, 1.4, 2.0), WALL, math.atan2(F.t[1], F.t[0]), uvscale=1.0)
G.box((tx, ty, ztop + 2.05), (1.7, 1.7, 0.15), TRIM, math.atan2(F.t[1], F.t[0]), uvscale=1.0)
for dx in (-0.6, 0.6):
    for dy in (-0.6, 0.6):
        px, py, _ = F.P(u_c0 + dx, WM / 2 + dy)
        G.box((px, py, ztop + 2.6), (0.18, 0.18, 1.0), WALL, math.atan2(F.t[1], F.t[0]), uvscale=1.0)
G.box((tx, ty, ztop + 3.15), (1.7, 1.7, 0.15), TRIM, math.atan2(F.t[1], F.t[0]), uvscale=1.0)
G.cyl(tx, ty, ztop + 3.2, 0.7, 0.6, ROOF, seg=8, r2=0.1)
G.cyl(tx, ty, ztop + 3.95, 0.18, 0.3, GOLD, seg=8, r2=0.18)
G.cyl(tx, ty, ztop + 4.25, 0.03, 1.0, BLACK, seg=4)
G.box((tx, ty, ztop + 5.0), (0.6, 0.04, 0.45), GOLD, math.atan2(F.t[1], F.t[0]) + 0.5, uvscale=1.0)

# half-round bow window on the street side of the NW wing
bwall = nw[2]
cxb, cyb, _ = bwall.at(bwall.L / 2, 0)
rad = 3.0
base = math.atan2(bwall.n[1], bwall.n[0])
seg = 10
pts = [(cxb + rad * math.cos(base + math.pi / 2 - math.pi * i / seg), cyb + rad * math.sin(base + math.pi / 2 - math.pi * i / seg)) for i in range(seg + 1)]
pts = pts[::-1]
HB = 4.4
for p, q in zip(pts, pts[1:]):
    w = Wall(p, q)
    w.rect(0, w.L, -0.3, HB, WALL)
    w.ledge(0, w.L, -0.3, 0.6, PLINTH, 0.04)
    w.poly([(0.15, 0.75), (w.L - 0.15, 0.75), (w.L - 0.15, HB - 0.65), (0.15, HB - 0.65)], GLASS, 0.03,
           uv=[(0.2, 0.42), (0.8, 0.42), (0.8, 0.9), (0.2, 0.9)])
    w.rect(0.15, w.L - 0.15, 2.85, 2.92, FRAME, 0.05)
    w.ledge(-0.05, w.L + 0.05, HB - 0.35, HB, TRIM, 0.25)
G.face([(x, y, HB) for x, y in pts], GREY, uvscale=2.0)

# the enclosed platform-canopy annex (one storey, hipped roof) and its own platform roof towards the tracks
annex = [R[0], R[1], F.P(u_main0, 0)[:2], R[7]]
aw = [Wall(annex[i], annex[(i + 1) % 4]) for i in range(4)]
for i, w in enumerate(aw):
    if i == 2:
        continue
    w.rect(0, w.L, -0.3, 4.2, WALL)
    w.ledge(0, w.L, -0.3, 0.6, PLINTH, 0.05)
    w.ledge(-0.05, w.L + 0.05, 3.85, 4.1, TRIM, 0.16)
    if w.L > 10:
        n = max(1, round((w.L - 1.5) / 3.2))
        for k in range(n):
            x = 0.75 + (w.L - 1.5) * (k + 0.5) / n
            if k % 3 == 1:
                w.poly(arch(x, 0.0, 1.5, 3.0), DOOR, 0.05)
                w.rect(x - 0.03, x + 0.03, 0.0, 2.3, FRAME, 0.07)
            else:
                window(w, x, 0.9, 1.5, 2.3, arched=True, cols=2, rows=3)
a, b, c_, d = annex
L1, W1 = math.dist(a, b), math.dist(b, c_)
o = 0.45
ua = ((c_[0] - b[0]) / W1, (c_[1] - b[1]) / W1)          # along the annex (towards the main block)
va = ((a[0] - b[0]) / L1, (a[1] - b[1]) / L1)             # across (towards the street)
Pa = lambda s, t, z: (b[0] + ua[0] * s + va[0] * t, b[1] + ua[1] * s + va[1] * t, z)
ze, rise = 4.05, L1 / 2 * K * 0.8
e = [Pa(-o, -o, ze), Pa(W1, -o, ze), Pa(W1, L1 + o, ze), Pa(-o, L1 + o, ze)]
r0, r1 = Pa(L1 / 2 - o, L1 / 2, ze + rise), Pa(W1, L1 / 2, ze + rise)
for pts_ in ([e[0], e[1], r1, r0], [e[2], e[3], r0, r1], [e[3], e[0], r0]):
    G.face(pts_, ROOF, uvscale=2.0)
pw = aw[1]
G.face([pw.at(0.5, 3.6, 0.0), pw.at(pw.L - 0.2, 3.6, 0.0), pw.at(pw.L - 0.2, 3.25, 3.4), pw.at(0.5, 3.25, 3.4)][::-1], 'M_Roof_Metal_red', uvscale=2.0)
G.face([pw.at(0.5, 3.15, 0.0), pw.at(pw.L - 0.2, 3.15, 0.0), pw.at(pw.L - 0.2, 3.1, 3.4), pw.at(0.5, 3.1, 3.4)], TRIM, uvscale=2.0)
for k in range(int((pw.L - 1.0) / 4.0) + 1):
    p = pw.at(1.0 + k * 4.0, 0, 3.1)
    G.box((p[0], p[1], 1.6), (0.14, 0.14, 3.2), 'M_Roof_Metal_red', pw.ang, uvscale=1.0)
