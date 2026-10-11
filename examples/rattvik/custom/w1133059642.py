"""Stiernhööksgymnasiet, Masvägen 15 — hand-modelled from photos (see ../refinements.md).

Two crossing wings on the OSM outline:
  wing B (NW–SE, by the railway): two salmon-brick storeys and a pale board-and-batten top storey,
    brown tiled roof with a gable to the north-west and a hip to the south-east, three teal stair
    towers with their own gables on the railway side, a spiral fire stair and a black wall trellis
    on the north-west gable, a steel stair to the first floor at the south-east end.
  wing A (SW–NE, along Masvägen): brick + board storey; the north-west half has a pitched roof with
    two chimneys, the south-east half a flat roof ending in a glazed atrium with a pitched glass roof
    in the inner corner; teal gable end and a teal stair tower towards Masvägen.
  the entrance block in the corner: one brick storey with a mint-green roof and fascia, the
    "Stiernhööks gymnasiet" sign, and a mint canopy over the glass doors.
Windows are real openings (reveals, glass, pine sashes, sills, white trim on the boards).
"""
import random

import bpy

R = [tuple(p) for p in ctx.footprint['outer']]
if len(R) != 20:
    raise RuntimeError('Stiernhööksgymnasiet: the OSM outline changed (expected 20 vertices) — update this script')
G = ctx.geo

BRICK, PANEL, TEAL = 'M_Wall_Brick_salmon_Blank', 'M_Wall_Wood_pale_Blank', 'M_Wall_Wood_teal_Blank'
WHITE, PINE, CLOTH = 'M_Wall_Wood_white_Blank', 'M_Wall_Wood_pine_Blank', 'M_Wall_Plaster_white_Blank'
GLASS, ROOF, FLAT = 'M_Window_Pane', 'M_Roof_Tiles_brown', 'M_Roof_Flat_gravel'
SKYGLASS = 'M_Wall_Glass_blue_Blank'                                  # big panes that mirror the sky
MINT, STEEL, PLINTH = 'M_Roof_Metal_mint', 'M_Fixture_Metal', 'M_Concrete'
DARK, GREEN = 'M_Roof_Metal_black', 'M_Roof_Metal_signgreen'
GLASS_UV = [(0.2, 0.42), (0.8, 0.42), (0.8, 0.9), (0.2, 0.9)]       # inside the dark pane (u .03–.97, v .28–.98)
rng = random.Random(1133059642)


def glass_uv():
    """A slightly different patch of the pane for every window, so reflections vary."""
    du, dv = rng.uniform(-0.12, 0.12), rng.uniform(-0.05, 0.05)
    return [(u + du, v + dv) for u, v in GLASS_UV]
BAY = {BRICK: 3.2, PANEL: 3.6, TEAL: 3.6, WHITE: 3.6, PINE: 3.6, PLINTH: 3.0, MINT: 4.0}


# ------------------------------------------------------------------------------------------ helpers
class Frame:
    """Local axes: u from origin towards `toward`, w to the left of u, z up."""
    def __init__(self, origin, toward):
        self.o = origin
        self.a = math.atan2(toward[1] - origin[1], toward[0] - origin[0])
        self.c, self.s = math.cos(self.a), math.sin(self.a)

    def P(self, u, w, z=0.0):
        return (self.o[0] + u * self.c - w * self.s, self.o[1] + u * self.s + w * self.c, z)

    def uw(self, p):
        dx, dy = p[0] - self.o[0], p[1] - self.o[1]
        return dx * self.c + dy * self.s, -dx * self.s + dy * self.c


class Wall:
    """A vertical plane from p to q; x runs along it, d > 0 is outwards (to the right of p→q)."""
    def __init__(self, p, q):
        self.p, self.L = p, math.dist(p, q)
        self.t = ((q[0] - p[0]) / self.L, (q[1] - p[1]) / self.L)
        self.n = (self.t[1], -self.t[0])
        self.ang = math.atan2(self.t[1], self.t[0])

    def at(self, x, z, d=0.0):
        return (self.p[0] + self.t[0] * x + self.n[0] * d, self.p[1] + self.t[1] * x + self.n[1] * d, z)

    def x_of(self, pt):
        return (pt[0] - self.p[0]) * self.t[0] + (pt[1] - self.p[1]) * self.t[1]

    def rect(self, x0, x1, z0, z1, mat, d=0.0, uv=None):
        if x1 - x0 < 1e-3 or z1 - z0 < 1e-3:
            return
        bay = BAY.get(mat, 1.0)
        G.face([self.at(x0, z0, d), self.at(x1, z0, d), self.at(x1, z1, d), self.at(x0, z1, d)], mat,
               uv or [(x0 / bay, z0 / 3), (x1 / bay, z0 / 3), (x1 / bay, z1 / 3), (x0 / bay, z1 / 3)])

    def ledge(self, x0, x1, z0, z1, mat, d0, d1, ends=False):
        """A proud strip: front face at d1, top (and optionally end) faces back to d0."""
        self.rect(x0, x1, z0, z1, mat, d1)
        G.face([self.at(x0, z1, d1), self.at(x1, z1, d1), self.at(x1, z1, d0), self.at(x0, z1, d0)], mat, uvscale=1.0)
        if ends:
            G.face([self.at(x0, z0, d0), self.at(x0, z0, d1), self.at(x0, z1, d1), self.at(x0, z1, d0)], mat, uvscale=1.0)
            G.face([self.at(x1, z0, d1), self.at(x1, z0, d0), self.at(x1, z1, d0), self.at(x1, z1, d1)], mat, uvscale=1.0)

    def band(self, x0, x1, z0, z1, mat, holes):
        cols = {}
        for a, b, za, zb, _ in holes:                 # openings stacked in one column share x0..x1
            cols.setdefault((a, b), []).append((za, zb))
        cur = x0
        for a, b in sorted(cols):
            self.rect(cur, a, z0, z1, mat)
            zc = z0
            for za, zb in sorted(cols[(a, b)]):
                self.rect(a, b, zc, za, mat)
                zc = zb
            self.rect(a, b, zc, z1, mat)
            cur = b
        self.rect(cur, x1, z0, z1, mat)

    def window(self, x0, x1, z0, z1, kind):
        """An opening with reveals, glass and pine sashes; kind b (brick), p (boards), door, stair."""
        depth = 0.16 if kind == 'b' else 0.12
        rv = BRICK if kind == 'b' else WHITE
        d = -depth
        G.face([self.at(x0, z0, 0), self.at(x0, z0, d), self.at(x0, z1, d), self.at(x0, z1, 0)], rv, uvscale=1.0)
        G.face([self.at(x1, z0, 0), self.at(x1, z1, 0), self.at(x1, z1, d), self.at(x1, z0, d)], rv, uvscale=1.0)
        G.face([self.at(x0, z0, 0), self.at(x1, z0, 0), self.at(x1, z0, d), self.at(x0, z0, d)], rv, uvscale=1.0)
        G.face([self.at(x0, z1, 0), self.at(x0, z1, d), self.at(x1, z1, d), self.at(x1, z1, 0)], rv, uvscale=1.0)
        self.rect(x0, x1, z0, z1, GLASS, d, glass_uv())
        f, fd = 0.075, d + 0.025
        self.rect(x0, x1, z0, z0 + f, PINE, fd)
        self.rect(x0, x1, z1 - f, z1, PINE, fd)
        self.rect(x0, x0 + f, z0 + f, z1 - f, PINE, fd)
        self.rect(x1 - f, x1, z0 + f, z1 - f, PINE, fd)
        xm = (x0 + x1) / 2
        if kind in ('b', 'p', 'door') and x1 - x0 > 0.9:
            self.rect(xm - 0.035, xm + 0.035, z0 + f, z1 - f, PINE, fd)
        rails = {'b': [0.72], 'p': [0.7], 'door': [0.78], 'stair': [0.2, 0.4, 0.6, 0.8]}[kind]
        for r in rails:
            zr = z0 + (z1 - z0) * r
            self.rect(x0 + f, x1 - f, zr - 0.035, zr + 0.035, PINE, fd)
        if kind != 'door':
            sill = STEEL if kind == 'b' else WHITE
            self.ledge(x0 - 0.05, x1 + 0.05, z0 - 0.05, z0, sill, 0, 0.07, ends=True)
        if kind in ('p', 'stair'):
            tw, td = 0.11, 0.03
            self.rect(x0 - tw, x0, z0 - 0.05, z1 + tw, WHITE, td)
            self.rect(x1, x1 + tw, z0 - 0.05, z1 + tw, WHITE, td)
            self.rect(x0, x1, z1, z1 + tw, WHITE, td)

    def applied_window(self, x0, x1, z0, z1):
        """A window drawn on a surface that has no opening (gable triangles)."""
        self.rect(x0 - 0.11, x1 + 0.11, z0 - 0.11, z1 + 0.11, WHITE, 0.02)
        self.rect(x0, x1, z0, z1, GLASS, 0.035, glass_uv())
        self.rect(x0, x1, z0, z0 + 0.07, PINE, 0.05)
        self.rect(x0, x1, z1 - 0.07, z1, PINE, 0.05)
        self.rect(x0, x0 + 0.07, z0, z1, PINE, 0.05)
        self.rect(x1 - 0.07, x1, z0, z1, PINE, 0.05)

    def awning(self, x0, x1, zh):
        top0, top1 = self.at(x0 - 0.08, zh + 0.12, 0.02), self.at(x1 + 0.08, zh + 0.12, 0.02)
        low0, low1 = self.at(x0 - 0.08, zh - 0.42, 0.72), self.at(x1 + 0.08, zh - 0.42, 0.72)
        G.face([low0, low1, top1, top0], CLOTH, uvscale=1.0)
        G.face([self.at(x0 - 0.08, zh - 0.42, 0.02), low0, top0], CLOTH, uvscale=1.0)
        G.face([low1, self.at(x1 + 0.08, zh - 0.42, 0.02), top1], CLOTH, uvscale=1.0)
        self.rect(x0 - 0.08, x1 + 0.08, zh - 0.52, zh - 0.42, CLOTH, 0.72)


def slots(a, b, pitch, width, edge):
    room = b - a - 2 * edge
    if room < width:
        return []
    n = int((room - width) // pitch) + 1
    start = a + (b - a - ((n - 1) * pitch + width)) / 2
    return [(start + i * pitch, start + i * pitch + width) for i in range(n)]


def subtract(spans, cuts):
    out = list(spans)
    for c0, c1 in cuts:
        nxt = []
        for a, b in out:
            if c1 <= a or c0 >= b:
                nxt.append((a, b))
                continue
            if c0 > a:
                nxt.append((a, c0))
            if c1 < b:
                nxt.append((c1, b))
        out = nxt
    return out


def facade(w, x0, x1, bands, skip=(), doors=(), pitch=3.0, edge=0.9, plinth=True, corners=True):
    """bands: [(z0, z1, material, (sill, head, width, kind) or None, awnings)]; doors: (x0, x1, z0, z1, kind)."""
    if plinth:
        w.rect(x0, x1, -0.3, 0.3, PLINTH, 0.02)
    free = subtract([(x0, x1)], [(a - 0.3, b + 0.3) for a, b in skip])
    for z0, z1, mat, win, awn in bands:
        holes = [h for h in doors if z0 <= h[2] < z1]
        if win:
            sill, head, width, kind = win
            for a, b in free:
                for p, q in slots(a, b, pitch, width, edge):
                    if all(q < h[0] - 0.4 or p > h[1] + 0.4 for h in holes):
                        holes.append((p, q, sill, head, kind))
        w.band(x0, x1, z0, z1, mat, holes)
        for h in holes:
            w.window(*h)
            if awn and h[4] in ('b', 'p'):
                w.awning(h[0], h[1], h[3])
        if mat in (PANEL, TEAL) and corners:
            w.rect(x0, x0 + 0.14, z0, z1, WHITE, 0.03)
            w.rect(x1 - 0.14, x1, z0, z1, WHITE, 0.03)
    for (z0, z1, mat, win, awn), nxt in zip(bands, bands[1:]):
        if nxt[2] in (PANEL, TEAL) and mat == BRICK:
            w.ledge(x0, x1, z1 - 0.02, z1 + 0.07, WHITE, 0, 0.045)


def wing_roof(F, u0, u1, w0, w1, ze, rise, end0='gable', end1='gable', o0=0.5, o1=0.5, oe=0.5,
              gable0=PANEL, gable1=PANEL, cap=True):
    """Pitched roof over u0..u1 × w0..w1 (ridge along u); ends 'gable', 'hip' or 'none' (abutting)."""
    hw, wm = (w1 - w0) / 2, (w0 + w1) / 2
    k, top = rise / hw, ze + rise
    sl = math.sqrt(1 + k * k)
    Z = lambda w: ze + k * (hw - abs(w - wm))
    ext = {'gable': oe, 'hip': o0, 'none': 0.0}
    ue0, ue1 = u0 - ext[end0], u1 + ext[end1]
    ur0 = u0 + hw if end0 == 'hip' else ue0
    ur1 = u1 - hw if end1 == 'hip' else ue1
    wa, wb = w0 - o0, w1 + o1
    za, zb = Z(wa), Z(wb)
    G.face([F.P(ue0, wa, za), F.P(ue1, wa, za), F.P(ur1, wm, top), F.P(ur0, wm, top)], ROOF,
           [(ue0 / 2, 0), (ue1 / 2, 0), (ur1 / 2, (wm - wa) * sl / 2), (ur0 / 2, (wm - wa) * sl / 2)])
    G.face([F.P(ue1, wb, zb), F.P(ue0, wb, zb), F.P(ur0, wm, top), F.P(ur1, wm, top)], ROOF,
           [(ue1 / 2, 0), (ue0 / 2, 0), (ur0 / 2, (wb - wm) * sl / 2), (ur1 / 2, (wb - wm) * sl / 2)])
    if end1 == 'hip':
        G.face([F.P(ue1, wa, za), F.P(ue1, wb, zb), F.P(ur1, wm, top)], ROOF, [(wa / 2, 0), (wb / 2, 0), (wm / 2, (ue1 - ur1) * sl / 2)])
    if end0 == 'hip':
        G.face([F.P(ue0, wb, zb), F.P(ue0, wa, za), F.P(ur0, wm, top)], ROOF, [(wb / 2, 0), (wa / 2, 0), (wm / 2, (ur0 - ue0) * sl / 2)])
    for u, mat, sgn in ((u0, gable0, -1), (u1, gable1, 1)):
        if (end0 if sgn < 0 else end1) != 'gable':
            continue
        pts = [F.P(u, w1, ze), F.P(u, w0, ze), F.P(u, wm, top)] if sgn < 0 else [F.P(u, w0, ze), F.P(u, w1, ze), F.P(u, wm, top)]
        G.face(pts, mat, [(p_w / 3.6, z / 3) for p_w, z in ((w1, ze), (w0, ze), (wm, top))] if sgn < 0
               else [(p_w / 3.6, z / 3) for p_w, z in ((w0, ze), (w1, ze), (wm, top))])
        ue = ue0 if sgn < 0 else ue1
        for wx, zx in ((wa, za), (wb, zb)):            # bargeboards
            G.face([F.P(ue, wx, zx - 0.24), F.P(ue, wm, top - 0.24), F.P(ue, wm, top + 0.03), F.P(ue, wx, zx + 0.03)], WHITE, uvscale=1.0)
    # eaves: fascia, soffit and gutter along both sides (and round a hip)
    runs = []
    if o0 > 0:
        runs.append(((ue0, wa), (ue1, wa), (ue0, w0), (ue1, w0), za))
    if o1 > 0:
        runs.append(((ue1, wb), (ue0, wb), (ue1, w1), (ue0, w1), zb))
    if end1 == 'hip':
        runs.append(((ue1, wb), (ue1, wa), (u1, wb), (u1, wa), za))
    if end0 == 'hip':
        runs.append(((ue0, wa), (ue0, wb), (u0, wa), (u0, wb), za))
    for (pa, pb, ia, ib, ze_) in runs:
        A, B = F.P(*pa, ze_ - 0.22), F.P(*pb, ze_ - 0.22)
        G.face([A, B, F.P(*pb, ze_ + 0.04), F.P(*pa, ze_ + 0.04)], WHITE, uvscale=1.0)
        G.face([F.P(*ia, ze_ - 0.22), F.P(*ib, ze_ - 0.22), B, A], WHITE, uvscale=1.0)
        ax, ay = (A[0] + B[0]) / 2, (A[1] + B[1]) / 2
        L = math.dist(A[:2], B[:2])
        ang = math.atan2(B[1] - A[1], B[0] - A[0])
        nx, ny = math.sin(ang), -math.cos(ang)       # outwards for these runs (they go clockwise)
        G.box((ax + nx * 0.08, ay + ny * 0.08, ze_ - 0.14), (L, 0.15, 0.13), STEEL, ang, uvscale=1.0)
    if cap and ur1 - ur0 > 0.1:
        mid = F.P((ur0 + ur1) / 2, wm, top + 0.05)
        G.box(mid, (ur1 - ur0, 0.32, 0.14), ROOF, F.a, uvscale=1.0)
    return Z


def chimney(F, u, w, z0, z1, sx=1.4, sy=0.9):
    c = F.P(u, w)
    G.box((c[0], c[1], (z0 + z1) / 2), (sx, sy, z1 - z0), BRICK, F.a, uvscale=3.0)
    G.box((c[0], c[1], z1 + 0.06), (sx + 0.2, sy + 0.2, 0.12), STEEL, F.a, uvscale=1.0)
    G.box((c[0], c[1], z1 + 0.32), (sx * 0.5, sy * 0.5, 0.4), DARK, F.a, uvscale=1.0)


def downpipe(w, x, ztop, gutter=0.58):
    G.cyl(*w.at(x, 0.15, 0.13), 0.055, ztop - 0.15, STEEL, seg=6, cap=False)
    a, b = w.at(x, 0, 0.13), w.at(x, 0, gutter)
    G.box_between(a[:2], b[:2], 0.1, ztop - 0.1, ztop, STEEL)


def stair_tower(F, uc, wall_w, depth, ze, rise, width=5.0, door=False, back=5.5):
    """A teal stair tower projecting from the wall line w=wall_w of frame F (outwards = +w)."""
    h = width / 2
    front = wall_w + depth
    fw = Wall(F.P(uc + h, front), F.P(uc - h, front))
    sides = [Wall(F.P(uc + h, wall_w), F.P(uc + h, front)), Wall(F.P(uc - h, front), F.P(uc - h, wall_w))]
    zs = 3.4 if door else 1.2
    holes = [(h - 0.8, h + 0.8, zs, ze - 0.8, 'stair')] + ([(h - 0.8, h + 0.8, 0.3, 2.6, 'door')] if door else [])
    facade(fw, 0, width, [(0.3, ze, TEAL, None, False)], doors=holes)
    for s in sides:
        facade(s, 0, depth, [(0.3, ze, TEAL, None, False)])
    TF = Frame(F.P(uc, 0), F.P(uc, 1))                 # u' along F's +w, w' along F's -u
    wing_roof(TF, wall_w - back, front, -h, h, ze, rise, end0='none', end1='gable', o0=0.35, o1=0.35, oe=0.35,
              gable1=PANEL)
    TW = Wall(F.P(uc + h, front), F.P(uc - h, front))
    TW.applied_window(h - 0.45, h + 0.45, ze + 0.35, ze + rise * 0.62)


def text_on_wall(w, body, xc, z, size, mat, font_paths, d=0.035, extrude=0.012):
    cu = bpy.data.curves.new('wb_sign', 'FONT')
    cu.body, cu.size, cu.resolution_u, cu.extrude = body, size, 2, extrude
    cu.align_x = 'CENTER'
    for path in font_paths:
        try:
            cu.font = bpy.data.fonts.load(path, check_existing=True)
            break
        except (RuntimeError, OSError):
            continue
    ob = bpy.data.objects.new('wb_sign', cu)
    bpy.context.scene.collection.objects.link(ob)
    ev = ob.evaluated_get(bpy.context.evaluated_depsgraph_get())
    me = ev.to_mesh()
    for poly in me.polygons:
        pts = [me.vertices[i].co for i in poly.vertices]
        G.face([w.at(xc + p.x, z + p.y, d + extrude + p.z) for p in pts], mat, uvscale=0.5)
    ev.to_mesh_clear()
    bpy.data.objects.remove(ob)
    bpy.data.curves.remove(cu)


# ------------------------------------------------------------------------------------------ frames
A = Frame(R[17], R[10])          # wing A: u towards NE along Masvägen side, +w = NW (bump side)
B = Frame(R[9], R[2])            # wing B: u towards SE along the railway, +w = NE (railway side)
uA = {i: A.uw(R[i]) for i in range(20)}
uB = {i: B.uw(R[i]) for i in range(20)}
A_W = -uA[0][1]                  # wing A full width (≈19.8)
A_JUNCTION = uA[10][0]           # where wing A meets wing B's south-west wall (≈58.4)
A_SPLIT = -12.0                  # pitched north-west half / flat south-east half of wing A
A_ATRIUM = 40.0                  # glazed atrium from here to the junction
B_LEN, B_W = uB[5][0], uB[5][1]  # ≈66.9 × 19.9
B_NOTCH_U = uB[6][0]             # ≈16.1: north-west part of the railway side is set back to w≈17
B_SE_U, B_SE_W = uB[2][0], uB[3][1]

ZB, ZA, ZE = 10.0, 7.0, 4.45     # eaves of wing B, wing A, entrance block
WIN_B = [(0.3, 3.55, BRICK, (1.15, 2.85, 1.3, 'b')), (3.55, 6.8, BRICK, (4.4, 6.1, 1.3, 'b')),
         (6.8, ZB, PANEL, (7.6, 9.1, 1.2, 'p'))]
WIN_A = [(0.3, 3.8, BRICK, (1.15, 2.95, 1.3, 'b')), (3.8, ZA, PANEL, (4.55, 6.15, 1.2, 'p'))]


def bands(spec, awn_rows=(), top=None):
    out = [(z0, z1, mat, win, i in awn_rows) for i, (z0, z1, mat, win) in enumerate(spec)]
    if top:
        z0, z1, _, win, awn = out[-1]
        out[-1] = (z0, z1, top, win, awn)
    return out


def edge(i):
    return Wall(R[i], R[(i + 1) % 20])


# ------------------------------------------------------------------------------------------ wing B
nw_gable = edge(8)
spiral_x = nw_gable.x_of(B.P(0, 14.6))
gx = nw_gable.x_of(B.P(0, 7.0))                    # black climbing trellis
facade(nw_gable, 0, nw_gable.L, bands(WIN_B), skip=[(gx - 0.5, gx + 0.5)],
       doors=[(spiral_x - 0.5, spiral_x + 0.5, 3.6, 5.75, 'door')])
facade(edge(9), 0, edge(9).L, bands(WIN_B, awn_rows=(1,)))
se_side = edge(1)
stair_door = se_side.L - 3.2
facade(se_side, 0, se_side.L, bands(WIN_B), doors=[(stair_door - 0.5, stair_door + 0.5, 3.6, 5.75, 'door')])
facade(edge(2), 0, edge(2).L, bands(WIN_B))
facade(edge(3), 0, edge(3).L, bands(WIN_B), edge=0.6)
facade(edge(4), 0, edge(4).L, bands(WIN_B, top=TEAL))
rail = edge(5)
towers = [18.5, 42.0, 53.5]
facade(rail, 0, rail.L, bands(WIN_B), skip=[(rail.x_of(B.P(u + 2.5, B_W)), rail.x_of(B.P(u - 2.5, B_W))) for u in towers])
facade(edge(6), 0, edge(6).L, bands(WIN_B), edge=0.5)
facade(edge(7), 0, edge(7).L, bands(WIN_B))
junction = Wall(R[10], R[1])                       # wing B's wall above wing A's roofs
junction.rect(0, junction.L, ZA - 0.1, ZB, PANEL)

ZB_roof = wing_roof(B, 0, B_LEN, 0, B_W, ZB, 4.4, end0='gable', end1='hip')
# soffits where the walls step in under the roof (north-west part of the railway side, south-east corner)
G.face([B.P(-0.5, uB[8][1], ZB - 0.45), B.P(-0.5, B_W, ZB - 0.45), B.P(B_NOTCH_U, B_W, ZB - 0.45), B.P(B_NOTCH_U, uB[8][1], ZB - 0.45)], WHITE, uvscale=1.0)
Wall(B.P(0, B_W), B.P(0, uB[8][1])).rect(0, B_W - uB[8][1], ZB - 0.45, ZB, PANEL)
G.face([B.P(B_SE_U, 0, ZB - 0.45), B.P(B_SE_U, B_SE_W, ZB - 0.45), B.P(B_LEN, B_SE_W, ZB - 0.45), B.P(B_LEN, 0, ZB - 0.45)], WHITE, uvscale=1.0)
Wall(B.P(0, B_W), B.P(0, 0)).applied_window(B_W / 2 - 0.5, B_W / 2 + 0.5, ZB + 0.6, ZB + 1.9)
chimney(B, 29.0, B_W / 2 + 0.6, ZB + 3.0, ZB + 5.7, 1.9, 1.15)
for u in towers:
    stair_tower(B, u, B_W, 1.6, ZB, 2.1, door=u > 40)
for wl, xs in ((rail, (1.0, 20.0, 37.0, rail.L - 1.0)), (edge(7), (0.6,)), (edge(9), (1.0,)), (se_side, (se_side.L - 0.8,)),
               (edge(4), (0.8, edge(4).L - 0.8))):
    for x in xs:
        downpipe(wl, x, ZB - 0.35)

# spiral fire stair and trellis on the north-west gable
sc = B.P(-1.55, 14.6)
G.cyl(sc[0], sc[1], 0.0, 0.07, 4.7, STEEL, seg=8)
G.cyl(sc[0], sc[1], 0.0, 1.3, 0.95, STEEL, seg=14, cap=False)          # base guard (keeps cars off the treads)
rail_pts = []
for i in range(14):
    th = B.a + (i - 13) * math.radians(27)            # the last tread points at the landing
    z = 0.25 + i * 0.25
    G.box((sc[0] + math.cos(th) * 0.68, sc[1] + math.sin(th) * 0.68, z), (1.15, 0.3, 0.05), STEEL, th, uvscale=1.0)
    p = (sc[0] + math.cos(th) * 1.24, sc[1] + math.sin(th) * 1.24)
    G.box((p[0], p[1], z + 0.47), (0.035, 0.035, 0.95), STEEL, th, uvscale=1.0)
    rail_pts.append((p, z + 0.95))
for (p, z), (q, z2) in zip(rail_pts, rail_pts[1:]):
    G.face([(p[0], p[1], z - 0.05), (q[0], q[1], z2 - 0.05), (q[0], q[1], z2), (p[0], p[1], z)], STEEL, uvscale=1.0)
land = B.P(-0.7, 14.6)
G.box((land[0], land[1], 3.55), (1.4, 1.5, 0.08), STEEL, B.a, uvscale=1.0)
for dx in (-0.4, 0.4):
    G.box_between(nw_gable.at(gx + dx, 0, 0.12)[:2], nw_gable.at(gx + dx, 0, 0.2)[:2], 0.06, 0.6, 6.4, DARK)
for j in range(15):
    z = 0.9 + j * 0.38
    G.box_between(nw_gable.at(gx - 0.4, 0, 0.16)[:2], nw_gable.at(gx + 0.4, 0, 0.16)[:2], 0.04, z, z + 0.04, DARK)

# steel stair up the south-west side to the first-floor door at the south-east end
x_top, x_bot, wid = stair_door - 0.7, stair_door - 7.2, 1.15
steps = 13
for s in range(steps):
    x = x_bot + (x_top - x_bot) * (s + 0.5) / steps
    z = 3.55 * (s + 1) / steps
    a, b = se_side.at(x, 0, 0.1), se_side.at(x, 0, 0.1 + wid)
    G.box(((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, z - 0.025), ((x_top - x_bot) / steps + 0.04, wid, 0.05), STEEL, se_side.ang, uvscale=1.0)
x_knee = x_bot + (x_top - x_bot) * 1.0 / 3.55
for d in (0.1, 0.1 + wid):
    # low mesh skirt (keeps cars off the treads), a stringer along the treads and the handrail
    G.face([se_side.at(x_bot, 0, d), se_side.at(x_top, 0, d), se_side.at(x_top, 1.0, d), se_side.at(x_knee, 1.0, d)], STEEL, uvscale=1.0)
    G.face([se_side.at(x_bot, -0.1, d), se_side.at(x_top, 3.25, d), se_side.at(x_top, 3.55, d), se_side.at(x_bot, 0.2, d)], STEEL, uvscale=1.0)
    G.face([se_side.at(x_bot, 0.95, d), se_side.at(x_top, 4.5, d), se_side.at(x_top, 4.56, d), se_side.at(x_bot, 1.01, d)], STEEL, uvscale=1.0)
    for j_ in range(1, 8):
        xp = x_bot + (x_top - x_bot) * j_ / 8
        zp = 3.55 * j_ / 8
        G.box_between(se_side.at(xp, 0, d - 0.02)[:2], se_side.at(xp, 0, d + 0.02)[:2], 0.035, zp, zp + 0.98, STEEL)
G.face([se_side.at(x_bot, 0, 0.1), se_side.at(x_bot, 0, 0.1 + wid), se_side.at(x_bot, 1.0, 0.1 + wid), se_side.at(x_bot, 1.0, 0.1)], STEEL, uvscale=1.0)
la, lb = se_side.at(x_top + 0.95, 0, 0.1), se_side.at(x_top + 0.95, 0, 0.1 + wid + 0.2)
G.box(((la[0] + lb[0]) / 2, (la[1] + lb[1]) / 2, 3.53), (1.9, wid + 0.2, 0.08), STEEL, se_side.ang, uvscale=1.0)
se_side.rect(x_top, x_top + 1.9, 3.6, 4.55, STEEL, wid + 0.3)

# ------------------------------------------------------------------------------------------ wing A
nw_face = edge(16)
facade(nw_face, 0, nw_face.L, bands(WIN_A, awn_rows=(1,)))
end = edge(17)
split_x = end.x_of(A.P(0, A_SPLIT))
facade(end, 0, split_x, bands(WIN_A, top=TEAL))
facade(end, split_x, end.L, bands(WIN_A), corners=False)
facade(edge(18), 0, edge(18).L, bands(WIN_A), edge=0.6)
facade(edge(19), 0, edge(19).L, bands(WIN_A), edge=0.5)
se_face = edge(0)
atrium_x = se_face.x_of(A.P(A_ATRIUM, -A_W))
facade(se_face, 0, atrium_x, bands(WIN_A))
entry = edge(10)
facade(entry, 0, entry.L, bands(WIN_A), doors=[(0.2, entry.L - 0.2, 0.3, 2.7, 'door')])
above = Wall(R[11], R[16])                          # wing A above the entrance block
tower_x = (above.x_of(A.P(30.6, 0)), above.x_of(A.P(25.4, 0)))
facade(above, 0, above.L, [(ZE, ZA, PANEL, (4.85, 6.25, 1.2, 'p'), False)], skip=[tower_x], plinth=False)
for x in (1.0, nw_face.L - 0.8):
    downpipe(nw_face, x, ZA - 0.35)
downpipe(se_face, 1.0, ZA - 0.2)

ZA_roof = wing_roof(A, 0, A_JUNCTION + 0.15, A_SPLIT, 0, ZA, 3.0, end0='gable', end1='none', o0=0.0, o1=0.5,
                    gable0=PANEL)
Wall(A.P(0, 0), A.P(0, A_SPLIT)).applied_window(-A_SPLIT / 2 - 0.45, -A_SPLIT / 2 + 0.45, ZA + 0.5, ZA + 1.7)
chimney(A, 24.0, -5.2, ZA + 1.8, ZA + 4.2, 1.2, 0.8)
chimney(A, 47.0, -5.2, ZA + 1.8, ZA + 4.2, 1.2, 0.8)
stair_tower(A, 28.0, 0.0, 1.75, ZA, 1.7, width=5.2)

# flat south-east half with a white parapet
flat = [A.P(0, A_SPLIT, ZA), A.P(0, uA[18][1], ZA), A.P(uA[19][0], uA[18][1], ZA), A.P(uA[19][0], -A_W, ZA),
        A.P(A_ATRIUM, -A_W, ZA), A.P(A_ATRIUM, A_SPLIT, ZA)]
G.face(flat, FLAT, uvscale=4.0)
for wl, x0, x1 in ((se_face, 0, atrium_x), (edge(18), 0, edge(18).L), (edge(19), 0, edge(19).L), (end, split_x, end.L)):
    wl.ledge(x0, x1, ZA - 0.15, ZA + 0.3, WHITE, 0, 0.05)

# glazed atrium in the inner corner
ax0, ax1 = atrium_x, se_face.L
se_face.rect(ax0, ax1, -0.3, 0.3, PLINTH, 0.02)
se_face.rect(ax0, ax1, 0.3, 3.75, GLASS, -0.08, GLASS_UV)                # ground floor: the dark interior shows
se_face.rect(ax0, ax1, 3.75, ZA, SKYGLASS, -0.08)
n_m = max(2, round((ax1 - ax0) / 1.8))
for m in range(n_m + 1):
    x = ax0 + (ax1 - ax0) * m / n_m
    c = se_face.at(x, 0, 0.0)
    G.box((c[0], c[1], ZA / 2 + 0.15), (0.12, 0.2, ZA - 0.3), PINE, se_face.ang, uvscale=1.0)
for z, mat in ((0.3, PINE), (3.75, MINT), (ZA - 0.05, WHITE)):
    a, b = se_face.at(ax0, 0, 0), se_face.at(ax1, 0, 0)
    G.box(((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, z), (ax1 - ax0, 0.24, 0.14), mat, se_face.ang, uvscale=1.0)
ridge_w, ridge_z = (A_SPLIT - A_W) / 2, ZA + 1.5
for wa_, wb_ in ((-A_W - 0.3, ridge_w), (A_SPLIT, ridge_w)):
    za_ = ZA - 0.05 if wa_ < -A_W else ZA
    G.face([A.P(A_ATRIUM, wa_, za_), A.P(A_JUNCTION, wa_, za_), A.P(A_JUNCTION, wb_, ridge_z), A.P(A_ATRIUM, wb_, ridge_z)], SKYGLASS, uvscale=3.0)
    n_r = round((A_JUNCTION - A_ATRIUM) / 1.8)
    for m in range(n_r + 1):
        u = A_ATRIUM + (A_JUNCTION - A_ATRIUM) * m / n_r
        p, q = A.P(u, wa_, za_ + 0.06), A.P(u, wb_, ridge_z + 0.06)
        G.face([(p[0], p[1], p[2]), (q[0], q[1], q[2]), (q[0], q[1], q[2] + 0.1), (p[0], p[1], p[2] + 0.1)], MINT, uvscale=1.0)
rc = A.P((A_ATRIUM + A_JUNCTION) / 2, ridge_w, ridge_z + 0.08)
G.box(rc, (A_JUNCTION - A_ATRIUM, 0.25, 0.16), MINT, A.a, uvscale=1.0)
G.face([A.P(A_ATRIUM, A_SPLIT, ZA), A.P(A_ATRIUM, -A_W, ZA), A.P(A_ATRIUM, ridge_w, ridge_z)], SKYGLASS, uvscale=3.0)

# ------------------------------------------------------------------------------------------ entrance block
for i in (11, 12, 13, 14, 15):
    w = edge(i)
    win = None if i in (12, 15) else (1.0, 2.7, 1.6, 'b')
    facade(w, 0, w.L, [(0.3, ZE - 0.5, BRICK, win, False)], pitch=3.2, edge=0.7)
    w.ledge(0, w.L, ZE - 0.5, ZE + 0.08, MINT, 0, 0.06)
roof_ring = citylib.ccw([R[i] for i in range(11, 17)])
G.face([(x, y, ZE) for x, y in roof_ring], MINT, uvscale=4.0)

sign = edge(12)
fonts = ['/System/Library/Fonts/Supplemental/Arial Bold.ttf', '/Library/Fonts/Arial Bold.ttf',
         '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', '<builtin>']
text_on_wall(sign, 'Stiernhööks', sign.L / 2 - 0.35, 2.5, 1.15, DARK, fonts)
text_on_wall(sign, 'gymnasiet', sign.L / 2 + 0.55, 1.72, 0.9, GREEN, fonts)
vine_x = sign.L / 2 - 0.35 + 2.45                                # the little vine after the name
for k_ in range(6):
    t_ = k_ / 5
    x_, z_ = vine_x + 0.9 * t_, 3.05 + 0.35 * math.sin(t_ * 3.0)
    r_ = 0.16 - 0.08 * t_
    G.face([sign.at(x_ - r_, z_, 0.05), sign.at(x_, z_ - r_ * 0.55, 0.05), sign.at(x_ + r_, z_, 0.05), sign.at(x_, z_ + r_ * 0.55, 0.05)],
           GREEN if k_ % 2 else DARK, uvscale=0.5)

# canopy over the glass doors, from the entrance block to wing B
mouth = Wall(R[9], R[12])                            # outwards = away from the notch
nx, ny = mouth.n
ext9, ext12 = (R[9][0] + nx * 1.6, R[9][1] + ny * 1.6), (R[12][0] + nx * 1.6, R[12][1] + ny * 1.6)
canopy = citylib.ccw([R[9], R[10], R[11], R[12], ext12, ext9])
G.face([(x, y, 3.45) for x, y in canopy], MINT, uvscale=4.0)
G.face([(x, y, 3.25) for x, y in reversed(canopy)], WHITE, uvscale=4.0)
for p, q in zip(canopy, canopy[1:] + canopy[:1]):
    G.face([(p[0], p[1], 3.25), (q[0], q[1], 3.25), (q[0], q[1], 3.47), (p[0], p[1], 3.47)], MINT, uvscale=1.0)
for p, inset in ((ext9, 0.35), (ext12, 0.35)):
    c = (p[0] - nx * inset, p[1] - ny * inset)
    G.box((c[0], c[1], 1.62), (0.14, 0.14, 3.25), STEEL, mouth.ang, uvscale=1.0)

# ------------------------------------------------------------------------------------------ roof details
for w_, u0_, u1_ in ((0.7, 1.0, B_LEN - B_W / 2 - 0.5), (B_W - 0.7, 1.0, B_LEN - B_W / 2 - 0.5)):
    a_, b_ = B.P(u0_, w_, ZB_roof(w_) + 0.13), B.P(u1_, w_, ZB_roof(w_) + 0.13)
    G.box(((a_[0] + b_[0]) / 2, (a_[1] + b_[1]) / 2, a_[2]), (u1_ - u0_, 0.05, 0.05), STEEL, B.a, uvscale=1.0)   # snow guards
a_, b_ = A.P(0.5, -0.7, ZA_roof(-0.7) + 0.13), A.P(A_JUNCTION - 1, -0.7, ZA_roof(-0.7) + 0.13)
G.box(((a_[0] + b_[0]) / 2, (a_[1] + b_[1]) / 2, a_[2]), (A_JUNCTION - 1.5, 0.05, 0.05), STEEL, A.a, uvscale=1.0)
for u_ in (34.6, 35.4):                                                     # roof ladder up to the big chimney
    p_, q_ = B.P(u_, 0.4, ZB_roof(0.4) + 0.12), B.P(u_, B_W / 2 - 0.4, ZB_roof(B_W / 2 - 0.4) + 0.12)
    G.face([p_, q_, (q_[0], q_[1], q_[2] + 0.07), (p_[0], p_[1], p_[2] + 0.07)], STEEL, uvscale=1.0)
for j_ in range(12):
    w_ = 0.6 + j_ * (B_W / 2 - 1.2) / 11
    c_ = B.P(35.0, w_, ZB_roof(w_) + 0.17)
    G.box(c_, (0.8, 0.04, 0.04), STEEL, B.a, uvscale=1.0)

# ------------------------------------------------------------------------------------------ ground: brick paving
def paving(ring):
    G.face([(x, y, 0.045) for x, y in citylib.ccw(ring)], BRICK, uvscale=1.6)


paving([R[9], R[10], R[11], R[12], (R[12][0] + nx * 7, R[12][1] + ny * 7), (R[9][0] + nx * 7, R[9][1] + ny * 7)])
paving([A.P(A_ATRIUM - 2, -A_W)[:2], R[1], A.P(A_JUNCTION, -A_W - 13)[:2], A.P(A_ATRIUM - 2, -A_W - 13)[:2]])

# ------------------------------------------------------------------------------------------ breakable things (props)
furn, fixed = Geo(), Geo()
for (u_, w_, a_) in ((44.0, 9.0, A.a - math.pi / 2), (48.5, 9.0, A.a - math.pi / 2)):        # benches by the sign
    x_, y_, _ = A.P(u_, w_ + 9.0)
    citylib.prop(furn, fixed, {'k': 'bench', 'x': x_, 'y': y_, 'a': a_})
for (u_, w_) in ((45.0, -27.5), (51.0, -27.5)):                                             # benches in the courtyard
    x_, y_, _ = A.P(u_, w_)
    citylib.prop(furn, fixed, {'k': 'bench', 'x': x_, 'y': y_, 'a': A.a + math.pi / 2})
for u_ in (8.0, 11.0):                                                                       # bike racks along Masvägen side
    x_, y_, _ = A.P(u_, 2.6)
    citylib.prop(furn, fixed, {'k': 'bikerack', 'x': x_, 'y': y_, 'a': A.a + math.pi / 2})
x_, y_, _ = A.P(42.0, -25.0)
citylib.prop(furn, fixed, {'k': 'bin', 'x': x_, 'y': y_})
fx, fy, _ = A.P(47.5, -31.0)                                                                 # flagpole in front of the atrium
furn.cyl(fx, fy, -0.05, 0.22, 0.5, 'M_Furniture_Metal', 8)
furn.cyl(fx, fy, 0.4, 0.07, 9.6, 'M_Furniture_Metal', 8, 0.045)
furn.cyl(fx, fy, 10.0, 0.09, 0.14, 'M_Furniture_Metal', 8, 0.02)
obj = furn.to_object(f'SM_Custom_{ctx.id}_Furniture', ctx.collection, ctx.tile or 'c0_0', ctx.lib, {'wb_building': ctx.id})
if obj:
    ctx.objects.append(obj)
