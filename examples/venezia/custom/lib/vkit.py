"""vkit – the Venice landmark kit: shared drawing helpers for the hand-modelled landmarks in
cities/venezia/custom/ (Basilica di San Marco, Campanile, Palazzo Ducale, Salute, Rialto, San Giorgio …).

A landmark script loads it with

    import inspect, os, sys
    sys.path.insert(0, os.path.join(os.path.dirname(inspect.currentframe().f_code.co_filename), 'lib'))
    import vkit

The file sits in custom/lib/, so the city builder does not run it as a building of its own.

Frame: local coordinates (u, w, z) – u along a building's main axis, w to its left, z up from the
building's base – mapped onto the city's metres (x east, y north). Faces are listed counter-clockwise
seen from outside. Plane: a vertical wall plane inside a frame with (s, z) coordinates as seen from its
front, and d out of the wall towards the viewer. Textures are mapped in each face's own plane, so a
wall at any angle keeps its stone courses and bricks the right size.
"""
import math

from citylib import Geo, Terrain

TAU = 2 * math.pi

# Library materials (colours in pipeline/style.json).
WHITE = 'M_Wall_Plaster_white_Blank'       # Istrian stone and white marble: smooth, bright
MARBLE = 'M_Wall_Stone_limestone_Blank'    # marble/stone ashlar, warm white
STONE = 'M_Wall_Stone_grey_Blank'          # grey stone: plinths, darker marbles
LEAD = 'M_Roof_Metal_grey'                 # lead sheet roofs (domes use the lighter seamed 'M_Wall_Metal_grey_Blank')
GOLD = 'M_Roof_Metal_gold'                 # gilding, gold mosaic grounds
COPPER = 'M_Roof_Metal_copper'             # verdigris copper
PATINA = 'M_Roof_Metal_patina'             # dark bronze
BRICK = 'M_Wall_Brick_red_Blank'
BRICK_OLD = 'M_Wall_Brick_salmon_Blank'
ROSE = 'M_Wall_Plaster_rose_Blank'
GLASS = 'M_Window_Pane'                    # dark panes and deep openings
BLACK = 'M_Roof_Metal_black'
BLUE = 'M_Wall_Metal_blue_Blank'
GRANITE = 'M_Fixture_Stone'
TILES = 'M_Roof_Tiles_red'


# ------------------------------------------------------------------------------------------ geometry helpers
def newell(pts):
    nx = ny = nz = 0.0
    n = len(pts)
    for i in range(n):
        x0, y0, z0 = pts[i]
        x1, y1, z1 = pts[(i + 1) % n]
        nx += (y0 - y1) * (z0 + z1)
        ny += (z0 - z1) * (x0 + x1)
        nz += (x0 - x1) * (y0 + y1)
    return nx, ny, nz


def plane_uv(pts, scale):
    """UVs in the face's own plane: walls run along their length and up, roofs use plan coordinates."""
    nx, ny, nz = newell(pts)
    ln = math.sqrt(nx * nx + ny * ny + nz * nz) or 1.0
    nx, ny, nz = nx / ln, ny / ln, nz / ln
    if abs(nz) > 0.75:
        return [(x / scale, y / scale) for x, y, _ in pts]
    tx, ty = -ny, nx
    tl = math.hypot(tx, ty) or 1.0
    tx, ty = tx / tl, ty / tl
    bx, by, bz = -nz * ty, nz * tx, nx * ty - ny * tx
    return [((x * tx + y * ty) / scale, (x * bx + y * by + z * bz) / scale) for x, y, z in pts]


def ccw(ring):
    a = sum(ring[i][0] * ring[(i + 1) % len(ring)][1] - ring[(i + 1) % len(ring)][0] * ring[i][1] for i in range(len(ring)))
    return list(ring) if a > 0 else list(reversed(ring))


def bez(p0, p1, p2, p3, t):
    m = 1 - t
    return (m ** 3 * p0[0] + 3 * m * m * t * p1[0] + 3 * m * t * t * p2[0] + t ** 3 * p3[0],
            m ** 3 * p0[1] + 3 * m * m * t * p1[1] + 3 * m * t * t * p2[1] + t ** 3 * p3[1])


def arch_curve(kind, s0, s1, zs, rise=None, n=8):
    """Points of an arch from its left springing (s0, zs) over the top to (s1, zs).
    kind: 'round' (semicircle, or a semi-ellipse with rise), 'pointed' (two arcs; rise > half span),
    'ogee' (an S-curved 'accolade' rising to a point), 'flat'."""
    half = (s1 - s0) / 2
    c = (s0 + s1) / 2
    if kind == 'flat':
        return [(s0, zs), (s1, zs)]
    if kind == 'round':
        h = half if rise is None else rise
        return [(c - half * math.cos(math.pi * i / n), zs + h * math.sin(math.pi * i / n)) for i in range(n + 1)]
    m = max(2, n // 2)
    if kind == 'pointed':
        h = rise or half * 1.4
        R = (half * half + h * h) / (2 * half)
        t0, t1 = math.pi, math.atan2(h, half - R)
        left = [(s0 + R + R * math.cos(t0 + (t1 - t0) * i / m), zs + R * math.sin(t0 + (t1 - t0) * i / m)) for i in range(m + 1)]
    elif kind == 'ogee':
        h = rise or half * 1.6
        left = [bez((s0, zs), (s0, zs + 0.55 * h), (c, zs + 0.38 * h), (c, zs + h), i / m) for i in range(m + 1)]
    else:
        raise ValueError(kind)
    return left + [(2 * c - s, z) for s, z in reversed(left[:-1])]


# ------------------------------------------------------------------------------------------ frames
class Frame:
    """Local (u, w, z) coordinates on a Geo: origin (cx, cy, z0), u along angle a (radians from east)."""

    def __init__(self, g, cx, cy, a=0.0, z0=0.0):
        self.g, self.cx, self.cy, self.a, self.z0 = g, cx, cy, a, z0
        self.c, self.s = math.cos(a), math.sin(a)

    def P(self, u, w, z=0.0):
        return (self.cx + u * self.c - w * self.s, self.cy + u * self.s + w * self.c, z + self.z0)

    def uw(self, x, y):
        dx, dy = x - self.cx, y - self.cy
        return (dx * self.c + dy * self.s, -dx * self.s + dy * self.c)

    def sub(self, u, w, a=0.0, z=0.0, g=None):
        x, y, zz = self.P(u, w, z)
        return Frame(g or self.g, x, y, self.a + a, zz)

    def face(self, pts, mat, uvs=None, uvscale=3.0, smooth=False):
        q = [self.P(*p) for p in pts]
        self.g.face(q, mat, uvs if uvs is not None else plane_uv(q, uvscale), smooth=smooth)

    def face_toward(self, pts, mat, toward, uvscale=3.0):
        """A face turned so that its normal points along `toward` (a local (u, w, z) vector)."""
        q = [self.P(*p) for p in pts]
        nx, ny, nz = newell(q)
        tu, tw, tz = toward
        tx, ty = tu * self.c - tw * self.s, tu * self.s + tw * self.c
        if nx * tx + ny * ty + nz * tz < 0:
            q = q[::-1]
        self.g.face(q, mat, plane_uv(q, uvscale))

    # -------------------------------------------------------------------- solids
    def prism(self, ring, z0, z1, mat, top=True, bottom=False, uvscale=3.0, top_mat=None):
        ring = ccw(ring)
        n = len(ring)
        for i in range(n):
            p, q = ring[i], ring[(i + 1) % n]
            self.face([(p[0], p[1], z0), (q[0], q[1], z0), (q[0], q[1], z1), (p[0], p[1], z1)], mat, uvscale=uvscale)
        if top:
            self.face([(x, y, z1) for x, y in ring], top_mat or mat, uvscale=uvscale)
        if bottom:
            self.face([(x, y, z0) for x, y in reversed(ring)], mat, uvscale=uvscale)

    def box(self, u, w, z, du, dw, dz, mat, top=True, bottom=False, uvscale=2.0, top_mat=None):
        hu, hw = du / 2, dw / 2
        self.prism([(u - hu, w - hw), (u + hu, w - hw), (u + hu, w + hw), (u - hu, w + hw)], z, z + dz, mat, top, bottom, uvscale, top_mat)

    def frustum(self, ring0, ring1, z0, z1, mat, top=True, uvscale=3.0):
        """Faces between two rings of the same length (ring1 at z1 above ring0 at z0) – tapering blocks, cornices."""
        r0, r1 = ccw(ring0), ccw(ring1)
        n = len(r0)
        for i in range(n):
            j = (i + 1) % n
            self.face([(r0[i][0], r0[i][1], z0), (r0[j][0], r0[j][1], z0), (r1[j][0], r1[j][1], z1), (r1[i][0], r1[i][1], z1)], mat, uvscale=uvscale)
        if top:
            self.face([(x, y, z1) for x, y in r1], mat, uvscale=uvscale)

    def cornice(self, ring, z, h, out, mat, uvscale=2.0):
        """A projecting moulding round a ring: a sloped underside out to `out` metres, a vertical face and a top."""
        rr = ccw(ring)
        big = offset_ring(rr, out)
        self.frustum(rr, big, z, z + h * 0.45, mat, top=False, uvscale=uvscale)
        self.frustum(big, big, z + h * 0.45, z + h, mat, top=False, uvscale=uvscale)
        n = len(rr)
        for i in range(n):
            j = (i + 1) % n
            self.face([(big[i][0], big[i][1], z + h), (big[j][0], big[j][1], z + h), (rr[j][0], rr[j][1], z + h), (rr[i][0], rr[i][1], z + h)], mat, uvscale=uvscale)

    def revolve(self, u, w, z, prof, mat, seg=24, smooth=True, around=None, vlen=3.0, a0=0.0, cap=False):
        """Surface of revolution about the vertical through (u, w): prof lists (r, h) from the bottom up,
        walking the silhouette outside (so faces point out). The texture wraps `around` times round and
        repeats every `vlen` metres along the profile."""
        rings = [[(u + r * math.cos(a0 + TAU * i / seg), w + r * math.sin(a0 + TAU * i / seg), z + h) for i in range(seg)] for r, h in prof]
        rmax = max(r for r, _ in prof)
        around = around or max(1, round(TAU * rmax / 3.0))
        L = [0.0]
        for (r0, h0), (r1, h1) in zip(prof, prof[1:]):
            L.append(L[-1] + math.hypot(r1 - r0, h1 - h0))
        for k in range(len(prof) - 1):
            r0, r1 = prof[k][0], prof[k + 1][0]
            v0, v1 = L[k] / vlen, L[k + 1] / vlen
            for i in range(seg):
                j = (i + 1) % seg
                u0, u1 = around * i / seg, around * (i + 1) / seg
                a, b, c, d = rings[k][i], rings[k][j], rings[k + 1][j], rings[k + 1][i]
                if r1 < 1e-4:
                    self.face([a, b, d], mat, [(u0, v0), (u1, v0), ((u0 + u1) / 2, v1)], smooth=smooth)
                elif r0 < 1e-4:
                    self.face([a, c, d], mat, [((u0 + u1) / 2, v0), (u1, v1), (u0, v1)], smooth=smooth)
                else:
                    self.face([a, b, c, d], mat, [(u0, v0), (u1, v0), (u1, v1), (u0, v1)], smooth=smooth)
        if cap and prof[-1][0] > 1e-4:
            self.face(rings[-1], mat, smooth=False)

    def cyl(self, u, w, z, r, h, mat, seg=12, r2=None, cap=True, smooth=True, uvscale=2.0):
        r2 = r if r2 is None else r2
        self.revolve(u, w, z, [(r, 0.0), (r2, h)] + ([(0.0, h)] if cap and r2 > 1e-4 else []), mat, seg, smooth,
                     around=max(1, round(TAU * max(r, r2) / uvscale)), vlen=uvscale)

    def pyramid(self, u, w, z, side, h, mat, sides=4, a=None, uvscale=2.0):
        """A pyramid (or cone with many sides) whose base edges line up with the frame."""
        a = math.pi / sides if a is None else a
        r = side / 2 / math.cos(math.pi / sides)
        self.revolve(u, w, z, [(r, 0.0), (0.0, h)], mat, sides, smooth=False, a0=a, around=sides, vlen=uvscale)


def offset_ring(ring, d):
    """A ring (ccw) pushed out by d (inwards for d < 0), corner by corner."""
    n = len(ring)
    out = []
    for i in range(n):
        p0, p1, p2 = ring[i - 1], ring[i], ring[(i + 1) % n]
        e1 = (p1[0] - p0[0], p1[1] - p0[1])
        e2 = (p2[0] - p1[0], p2[1] - p1[1])
        l1, l2 = math.hypot(*e1) or 1.0, math.hypot(*e2) or 1.0
        n1 = (e1[1] / l1, -e1[0] / l1)
        n2 = (e2[1] / l2, -e2[0] / l2)
        bx, by = n1[0] + n2[0], n1[1] + n2[1]
        bl = math.hypot(bx, by) or 1.0
        bx, by = bx / bl, by / bl
        k = d / max(0.3, bx * n1[0] + by * n1[1])
        out.append((p1[0] + bx * k, p1[1] + by * k))
    return out


class Plane:
    """A vertical plane in a frame starting at (u, w) and running along angle `ang` (radians in the frame);
    s runs along it, z up, d out of the plane towards its front (the right-hand side of the running
    direction). Polygons in (s, z) listed counter-clockwise face the front."""

    def __init__(self, fr, u, w, ang):
        self.fr, self.u, self.w, self.ang = fr, u, w, ang
        self.tc, self.ts = math.cos(ang), math.sin(ang)

    def L(self, s, z, d=0.0):
        return (self.u + s * self.tc + d * self.ts, self.w + s * self.ts - d * self.tc, z)

    def normal(self, sign=1.0):
        return (self.ts * sign, -self.tc * sign, 0.0)

    def poly(self, pts, mat, d=0.0, uvscale=3.0, flip=False):
        q = [self.L(s, z, d) for s, z in pts]
        uvs = [(s / uvscale, z / uvscale) for s, z in pts]
        if flip:
            q, uvs = q[::-1], uvs[::-1]
        self.fr.face(q, mat, uvs)

    def quad(self, s0, z0, s1, z1, mat, d=0.0, uvscale=3.0):
        if s1 - s0 > 1e-4 and z1 - z0 > 1e-4:
            self.poly([(s0, z0), (s1, z0), (s1, z1), (s0, z1)], mat, d, uvscale)

    def slab(self, pts, mat, d0, d1, uvscale=3.0, side_mat=None, back=False):
        """A flat shape extruded from d0 (back) to d1 (front): front face, edges, optional back."""
        self.poly(pts, mat, d1, uvscale)
        if back:
            self.poly(pts[::-1], mat, d0, uvscale)
        n = len(pts)
        for i in range(n):
            (s0, z0), (s1, z1) = pts[i], pts[(i + 1) % n]
            if math.hypot(s1 - s0, z1 - z0) < 1e-4:
                continue
            self.fr.face([self.L(s0, z0, d1), self.L(s0, z0, d0), self.L(s1, z1, d0), self.L(s1, z1, d1)], side_mat or mat, uvscale=uvscale)

    def block(self, s0, z0, s1, z1, d0, d1, mat, uvscale=2.0, back=False):
        self.slab([(s0, z0), (s1, z0), (s1, z1), (s0, z1)], mat, d0, d1, uvscale, back=back)

    def sub(self, s, d=0.0, ang=0.0):
        u, w, _ = self.L(s, 0.0, d)
        return Plane(self.fr, u, w, self.ang + ang)


# ------------------------------------------------------------------------------------------ walls with arches
def arched_wall(pl, s0, s1, z0, z1, openings, mat, depth=0.0, reveal_mat=None, back=None, pier_z0=None,
                n=8, uvscale=3.0, d=0.0, jambs=True):
    """A wall in plane `pl` from s0 to s1 and z0 to z1 with arched openings.

    openings: (a, b, zb, zs, kind, rise) left to right – an opening from s=a to s=b, sill at zb, arch
    springing at zs (see arch_curve for kind/rise).
    depth > 0 draws reveals (jambs, sill, soffit) that deep into the wall.
    back: None (open), a material, or (z_split, mat_below, mat_above) – a panel at the back of each
    opening, e.g. a dark door under a gold mosaic lunette.
    pier_z0: the piers between openings start here (columns drawn separately below)."""
    pz0 = z0 if pier_z0 is None else pier_z0
    edge = s0
    rev = reveal_mat or mat
    for (a, b, zb, zs, kind, rise) in openings:
        pl.quad(edge, pz0, a, z1, mat, d, uvscale)
        if zb > z0 + 1e-3:
            pl.quad(a, z0, b, zb, mat, d, uvscale)
        arch = arch_curve(kind, a, b, zs, rise, n)
        for (sa, za), (sb, zb2) in zip(arch, arch[1:]):
            pl.poly([(sa, za), (sb, zb2), (sb, z1), (sa, z1)], mat, d, uvscale)
        if depth > 0:
            mid = ((a + b) / 2, (zb + zs) / 2)
            for s in (a, b) if zs - zb > 1e-3 and jambs else ():
                q = [pl.L(s, zb, d), pl.L(s, zb, d - depth), pl.L(s, zs, d - depth), pl.L(s, zs, d)]
                pl.fr.face_toward(q, rev, _toward(pl, (mid[0] - s), 0.0), uvscale)
            if zb > z0 + 1e-3:
                q = [pl.L(a, zb, d), pl.L(b, zb, d), pl.L(b, zb, d - depth), pl.L(a, zb, d - depth)]
                pl.fr.face_toward(q, rev, (0.0, 0.0, 1.0), uvscale)
            cz = zs
            for (sa, za), (sb, zb2) in zip(arch, arch[1:]):
                q = [pl.L(sa, za, d), pl.L(sb, zb2, d), pl.L(sb, zb2, d - depth), pl.L(sa, za, d - depth)]
                ms, mz = (sa + sb) / 2, (za + zb2) / 2
                pl.fr.face_toward(q, rev, _toward(pl, (a + b) / 2 - ms, cz - mz), uvscale)
        if back is not None:
            dd = d - max(depth, 0.02)
            if isinstance(back, tuple):
                zsplit, lo, hi = back
                pl.quad(a, zb, b, zsplit, lo, dd, uvscale)
                if zsplit < zs:
                    pl.quad(a, zsplit, b, zs, hi, dd, uvscale)
                    pl.poly([(a, zs), (b, zs)] + arch[-2:0:-1], hi, dd, uvscale)
                else:
                    pl.poly([(a, zsplit), (b, zsplit)] + [p for p in arch[::-1] if p[1] > zsplit + 1e-3], hi, dd, uvscale)
            else:
                pts = ([(a, zb), (b, zb)] if zs - zb > 1e-3 else []) + arch[::-1]
                pl.poly(pts, back, dd, uvscale)
        edge = b
    pl.quad(edge, pz0, s1, z1, mat, d, uvscale)


def _toward(pl, ds, dz):
    """A local direction: ds along the plane, dz up."""
    return (ds * pl.tc, ds * pl.ts, dz)


def arch_band(pl, a, b, zs, kind, rise, width, mat, d0, d1, n=8):
    """An archivolt: a moulded band of `width` following an arch from a to b (springing zs), from d0 to d1."""
    inner = arch_curve(kind, a, b, zs, rise, n)
    half = (b - a) / 2
    scale_r = (half + width) / half if half > 0 else 1.0
    outer = arch_curve(kind, a - width, b + width, zs, None if rise is None else rise + width * (rise / half if kind != 'round' else 1.0), n)
    for (p0, p1), (q0, q1) in zip(zip(inner, inner[1:]), zip(outer, outer[1:])):
        pts = [p0, p1, q1, q0]
        pl.poly(pts[::-1] if _area(pts) < 0 else pts, mat, d1)
    # outer edge
    for q0, q1 in zip(outer, outer[1:]):
        pl.fr.face_toward([pl.L(q0[0], q0[1], d0), pl.L(q1[0], q1[1], d0), pl.L(q1[0], q1[1], d1), pl.L(q0[0], q0[1], d1)], mat,
                          _toward(pl, (q0[0] + q1[0]) / 2 - (a + b) / 2, (q0[1] + q1[1]) / 2 - zs))
    return outer


def _area(pts):
    return sum(pts[i][0] * pts[(i + 1) % len(pts)][1] - pts[(i + 1) % len(pts)][0] * pts[i][1] for i in range(len(pts))) / 2


# ------------------------------------------------------------------------------------------ details
def balustrade(fr, p, q, z, h=1.05, step=0.36, mat=WHITE, posts=None, rail=0.16, width=0.26):
    """A stone balustrade from p to q ((u, w) in the frame): plinth, balusters (flat silhouettes, seen
    from both sides), handrail and square posts every `posts` metres."""
    L = math.dist(p, q)
    if L < 0.2:
        return
    a = math.atan2(q[1] - p[1], q[0] - p[0])
    pl = Plane(fr, p[0], p[1], a)
    hw = width / 2
    pl.block(0.0, z, L, z + 0.16, -hw, hw, mat, back=True)
    pl.block(0.0, z + h - rail, L, z + h, -hw - 0.03, hw + 0.03, mat, back=True)
    fr.face([pl.L(0, z + h, -hw - 0.03), pl.L(L, z + h, -hw - 0.03), pl.L(L, z + h, hw + 0.03), pl.L(0, z + h, hw + 0.03)][::-1], mat)
    nb = max(1, int(L / step))
    z0, z2 = z + 0.16, z + h - rail
    zm = z0 + (z2 - z0) * 0.38
    for k in range(nb):
        s = (k + 0.5) * L / nb
        sil = [(s - 0.05, z0), (s + 0.05, z0), (s + 0.09, zm), (s + 0.045, z2), (s - 0.045, z2), (s - 0.09, zm)]
        pl.poly(sil, mat, 0.0)
    if posts:
        npost = max(1, round(L / posts))
        for k in range(npost + 1):
            u, w, _ = pl.L(k * L / npost, 0.0)
            rot_box(fr, u, w, z, 0.34, 0.34, h + 0.05, a, mat)


def rot_box(fr, u, w, z, du, dw, dz, a, mat, top=True):
    c, s = math.cos(a), math.sin(a)
    ring = [(u + x * c - y * s, w + x * s + y * c) for x, y in ((-du / 2, -dw / 2), (du / 2, -dw / 2), (du / 2, dw / 2), (-du / 2, dw / 2))]
    fr.prism(ring, z, z + dz, mat, top=top)


def figure(fr, u, w, z, h, mat, seg=5, plinth=None):
    """A standing statue (a draped figure) of height h on an optional square plinth."""
    if plinth:
        fr.box(u, w, z, plinth, plinth, h * 0.18, mat)
        z += h * 0.18
    prof = [(0.0, 0.0), (0.15 * h, 0.0), (0.12 * h, 0.55 * h), (0.15 * h, 0.71 * h), (0.07 * h, 0.79 * h),
            (0.085 * h, 0.87 * h), (0.0, h)]
    fr.revolve(u, w, z, prof, mat, seg, smooth=True, around=1, vlen=h)


def winged_figure(fr, u, w, z, h, mat, a=0.0):
    """An angel facing angle a (in the frame): a figure with two raised wings (flat blades)."""
    figure(fr, u, w, z, h, mat, seg=6)
    fx, fy = math.cos(a), math.sin(a)
    rx, ry = fy, -fx
    for side in (-1, 1):
        def P(r, b, zz):
            return (u + side * r * rx - b * fx, w + side * r * ry - b * fy, z + zz)
        fr.face([P(0.05 * h, 0.08 * h, 0.55 * h), P(0.3 * h, 0.16 * h, 0.62 * h), P(0.38 * h, 0.22 * h, 1.08 * h), P(0.1 * h, 0.12 * h, 0.9 * h)], mat)


def crockets(pl, pts, mat, d, size=0.35, every=1):
    """Leafy knobs (crockets) along a curve of (s, z) points in plane pl, sticking out on its left side
    (outwards for an arch listed left to right over the top)."""
    for i in range(1, len(pts) - 1, every):
        s, z = pts[i]
        ts, tz = pts[i + 1][0] - pts[i - 1][0], pts[i + 1][1] - pts[i - 1][1]
        tl = math.hypot(ts, tz) or 1.0
        ts, tz = ts / tl, tz / tl
        ns, nz = -tz, ts
        a = pl.L(s - ts * size * 0.45, z - tz * size * 0.45, d)
        b = pl.L(s + ts * size * 0.45, z + tz * size * 0.45, d)
        tip = pl.L(s + ns * size + ts * size * 0.3, z + nz * size + tz * size * 0.3, d + size * 0.25)
        mid = pl.L(s, z, d + size * 0.45)
        pl.fr.face([a, b, tip], mat)
        pl.fr.face([a, tip, mid], mat)
        pl.fr.face([b, mid, tip], mat)


def clip_rect(poly, s0, s1, z0, z1):
    """Clip a convex polygon of (s, z) points to the rectangle [s0, s1] x [z0, z1] (Sutherland-Hodgman)."""
    def clip(pts, inside, cut):
        out = []
        for i in range(len(pts)):
            p, q = pts[i - 1], pts[i]
            if inside(q):
                if not inside(p):
                    out.append(cut(p, q))
                out.append(q)
            elif inside(p):
                out.append(cut(p, q))
        return out

    def at_s(v):
        return lambda p, q: (v, p[1] + (q[1] - p[1]) * (v - p[0]) / ((q[0] - p[0]) or 1e-9))

    def at_z(v):
        return lambda p, q: (p[0] + (q[0] - p[0]) * (v - p[1]) / ((q[1] - p[1]) or 1e-9), v)
    pts = list(poly)
    for inside, cut in ((lambda p: p[0] >= s0, at_s(s0)), (lambda p: p[0] <= s1, at_s(s1)),
                        (lambda p: p[1] >= z0, at_z(z0)), (lambda p: p[1] <= z1, at_z(z1))):
        if not pts:
            break
        pts = clip(pts, inside, cut)
    return pts


def lattice(pl, s0, s1, z0, z1, d, period, width, mat):
    """A diamond lattice of thin strips at 45 degrees over a wall rectangle (the Doge's Palace's lozenges)."""
    h = z1 - z0
    k0 = int(math.floor((s0 - h) / period)) - 1
    k1 = int(math.ceil(s1 / period)) + 1
    for k in range(k0, k1 + 1):
        x = k * period
        for sgn in (1, -1):
            # a strip from (x, z0) rising at 45 degrees (sgn=1) or falling (sgn=-1)
            if sgn > 0:
                poly = [(x - width / 2, z0), (x + width / 2, z0), (x + width / 2 + h, z1), (x - width / 2 + h, z1)]
            else:
                poly = [(x - width / 2 + h, z0), (x + width / 2 + h, z0), (x + width / 2, z1), (x - width / 2, z1)]
            q = clip_rect(poly, s0, s1, z0, z1)
            if len(q) >= 3 and abs(_area(q)) > 1e-4:
                pl.poly(q if _area(q) > 0 else q[::-1], mat, d)


def quatrefoil(pl, s, z, r, mat, d, n=16, rot=0.0):
    """A four-lobed opening (quatrefoil) centred at (s, z)."""
    pts = []
    for i in range(n):
        t = math.tau * i / n + rot
        rr = r * (0.58 + 0.42 * abs(math.cos(2 * t - 2 * rot)))
        pts.append((s + rr * math.cos(t), z + rr * math.sin(t)))
    pl.poly(pts, mat, d)


def disc(pl, s, z, r, mat, d, n=12):
    pl.poly([(s + r * math.cos(math.tau * i / n), z + r * math.sin(math.tau * i / n)) for i in range(n)], mat, d)


def hip_roof(fr, u0, u1, w0, w1, z, rise, mat, hip=(True, True), uvscale=4.0):
    """A hipped roof over the rectangle u0..u1 x w0..w1 from eaves at z, ridge `rise` higher along the
    longer side. hip=(start, end): False leaves that end as a gable (where another roof joins)."""
    along_u = (u1 - u0) >= (w1 - w0)
    if along_u:
        half = (w1 - w0) / 2
        a0 = u0 + (half if hip[0] else 0.0)
        a1 = u1 - (half if hip[1] else 0.0)
        wm = (w0 + w1) / 2
        r0, r1 = (a0, wm, z + rise), (a1, wm, z + rise)
        c = [(u0, w0, z), (u1, w0, z), (u1, w1, z), (u0, w1, z)]
        fr.face([c[0], c[1], r1, r0], mat, uvscale=uvscale)
        fr.face([c[2], c[3], r0, r1], mat, uvscale=uvscale)
        fr.face([c[1], c[2], r1], mat, uvscale=uvscale)
        fr.face([c[3], c[0], r0], mat, uvscale=uvscale)
    else:
        half = (u1 - u0) / 2
        a0 = w0 + (half if hip[0] else 0.0)
        a1 = w1 - (half if hip[1] else 0.0)
        um = (u0 + u1) / 2
        r0, r1 = (um, a0, z + rise), (um, a1, z + rise)
        c = [(u0, w0, z), (u1, w0, z), (u1, w1, z), (u0, w1, z)]
        fr.face([c[1], c[2], r1, r0], mat, uvscale=uvscale)
        fr.face([c[3], c[0], r0, r1], mat, uvscale=uvscale)
        fr.face([c[0], c[1], r0], mat, uvscale=uvscale)
        fr.face([c[2], c[3], r1], mat, uvscale=uvscale)


def clear_ground(test, prefix='SM_Ground'):
    """Delete faces of the generated ground meshes (flat bridge decks, their concrete edges) whose centre
    (x, y) passes test(x, y) – used under hand-modelled bridges, whose arches would otherwise show the
    generator's flat deck across the canal. Runs while the city is built, before the terrain lift."""
    import bmesh
    import bpy
    gone = 0
    for o in list(bpy.data.objects):
        if o.type != 'MESH' or not o.name.startswith(prefix):
            continue
        me = o.data
        bm = bmesh.new()
        bm.from_mesh(me)
        dead = [f for f in bm.faces if test(*f.calc_center_median()[:2])]
        if dead:
            bmesh.ops.delete(bm, geom=dead, context='FACES')
            bm.to_mesh(me)
            me.update()
            gone += len(dead)
        bm.free()
    return gone


def emit(ctx, g, name, z0=None, at=None, samples=None, tile=None):
    """Make g an object of the city, lifted onto the ground as one piece (the builder leaves it alone).
    z0: base height; otherwise the lowest terrain under `samples` ((x, y) points) or under `at`/the centre."""
    if not g:
        return None
    vx = sum(v[0] for v in g.v) / len(g.v)
    vy = sum(v[1] for v in g.v) / len(g.v)
    if z0 is None:
        T = Terrain(ctx.data.get('terrain'))
        pts = samples or [at or (vx, vy)]
        z0 = min(float(T.at(x, y)) for x, y in pts) if T else 0.0
    if abs(z0) > 1e-4:
        g.v = [(x, y, z + z0) for x, y, z in g.v]
    tile = tile or f'c{math.floor(vx / 60)}_{math.floor(vy / 60)}'
    obj = g.to_object(f'SM_Custom_{name}', ctx.collection, tile, ctx.lib, {'wb_building': name, 'wb_custom': 1, 'wb_keep_z': 1})
    ctx.objects.append(obj)
    return obj


def tris(g):
    return sum(len(f) - 2 for f in g.f)
