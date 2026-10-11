"""Turn cities/<slug>/osm.json into cities/<slug>/city.json: everything the Blender builder needs.

All geometry decisions are made here, in plain Python with Shapely, so they are testable without
Blender: land and water, disjoint ground layers (asphalt, sidewalks, paving, parks …) triangulated
per 60 m cell, building walls with facade UVs, roofs, city walls, trees, street furniture, the road
centrelines for the game's AI and a list of landmarks for Street View refinement.

Units are metres; x = east, y = north, z = up; origin = place centre (see common.Projection).
Optional per-city overrides from cities/<slug>/overrides.json are applied to buildings
(height, levels, roof, colours, style) — the Street View refinement step writes that file.

Terrain: with cities/<slug>/terrain.json (fetch_terrain.py) the ground heights round the city are
cleaned of buildings and trees and stored as a grid (`terrain`); ground layers, curbs, shores and
rails are cut finely enough to follow it, and every building gets a base height. The Blender builder
lifts everything onto it. Without that file (or with "defaults": {"terrain": false}) the city is flat.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import math
import random
import re
from collections import defaultdict

import numpy as np
from shapely.prepared import prep
import shapely
from shapely import affinity
from shapely.geometry import LineString, MultiPolygon, Point, Polygon, box
from shapely.geometry.polygon import orient
from shapely.ops import linemerge, polygonize, unary_union
from shapely.strtree import STRtree

from common import EARTH, ROOT, city_dir, load_place, projection_for, say, step_done, write_json

STYLE = json.loads((ROOT / 'pipeline/style.json').read_text())
CELL = 60.0
TSTEP = CELL / 8          # terrain grid and ground subdivision (7.5 m)
TERRAIN_MARGIN = 450.0    # terrain kept beyond the play area for the surroundings

CAR_WIDTH = {
    'motorway': 12, 'trunk': 11, 'primary': 10, 'secondary': 9, 'tertiary': 8, 'unclassified': 6, 'residential': 6.5,
    'living_street': 5.5, 'service': 4.2, 'pedestrian': 6, 'track': 3.5, 'busway': 7, 'road': 6, 'raceway': 8,
    'motorway_link': 7, 'trunk_link': 7, 'primary_link': 7, 'secondary_link': 7, 'tertiary_link': 6,
}
SOFT_WIDTH = {'footway': 2.4, 'path': 2.2, 'cycleway': 2.6, 'steps': 2.4, 'bridleway': 2.5, 'platform': 3.0}
SIDEWALK_CLASSES = {'trunk', 'primary', 'secondary', 'tertiary', 'residential', 'unclassified',
                    'primary_link', 'secondary_link', 'tertiary_link'}
COBBLE_SURFACES = {'sett', 'cobblestone', 'unhewn_cobblestone', 'cobblestone:flattened', 'paving_stones', 'bricks', 'stone'}
SOFT_SURFACES = {'gravel', 'fine_gravel', 'compacted', 'dirt', 'ground', 'earth', 'grass', 'sand', 'mud', 'unpaved', 'woodchips', 'pebblestone'}
HOUSE_KINDS = {'house', 'detached', 'semidetached_house', 'terrace', 'bungalow', 'cabin', 'farm', 'farm_auxiliary', 'villa',
               'barn', 'stable', 'hut', 'shed', 'cowshed', 'static_caravan', 'boathouse', 'chapel', 'church', 'cathedral', 'kiosk'}
SMALL_KINDS = {'garage', 'garages', 'shed', 'carport', 'hut', 'kiosk', 'toilets', 'service', 'transformer_tower', 'bunker', 'container'}
CHURCH_KINDS = {'church', 'cathedral', 'chapel', 'basilica'}
LANDMARK_TAGS = ('historic', 'tourism', 'heritage')
LANDMARK_KINDS = CHURCH_KINDS | {'castle', 'tower', 'townhall', 'train_station', 'museum', 'palace', 'fort', 'monastery', 'mosque', 'synagogue', 'temple', 'government', 'civic'}


# ------------------------------------------------------------------------------------------ helpers
def h01(*key) -> float:
    """Deterministic 0..1 from any key, so rebuilding gives identical cities."""
    return int(hashlib.sha1('|'.join(map(str, key)).encode()).hexdigest()[:8], 16) / 0xFFFFFFFF


def pick(weights: dict, key) -> str:
    total = sum(weights.values())
    r = h01(key) * total
    for k, w in weights.items():
        r -= w
        if r <= 0:
            return k
    return next(iter(weights))


def num(value, default=None):
    if value is None:
        return default
    m = re.match(r'\s*(-?\d+(?:[.,]\d+)?)\s*(m|ft|\')?', str(value))
    if not m:
        return default
    v = float(m.group(1).replace(',', '.'))
    return v * 0.3048 if m.group(2) in ('ft', "'") else v


def colour(value):
    if not value:
        return None
    value = str(value).strip().lower().replace(' ', '')
    if value in STYLE['named_colours']:
        return STYLE['named_colours'][value]
    m = re.fullmatch(r'#?([0-9a-f]{3}|[0-9a-f]{6})', value)
    if not m:
        return None
    hx = m.group(1)
    if len(hx) == 3:
        hx = ''.join(c * 2 for c in hx)
    return [int(hx[i:i + 2], 16) / 255 for i in (0, 2, 4)]


def nearest_key(rgb, options: dict) -> str:
    return min(options, key=lambda k: sum((a - b) ** 2 for a, b in zip(rgb, options[k])))


def polys(g):
    """Explode any geometry into valid Polygons."""
    if g is None or g.is_empty:
        return []
    if g.geom_type == 'Polygon':
        if not g.is_valid:
            g = g.buffer(0)
            return polys(g)
        return [g]
    if hasattr(g, 'geoms'):
        return [p for part in g.geoms for p in polys(part)]
    return []


def clean(g, min_area=0.5):
    return [p for p in polys(g) if p.area >= min_area]


def r2(v):
    return round(v, 2)


def r3(v):
    return round(v, 3)


# ------------------------------------------------------------------------------------------ mesh buffer
class Buf:
    """Triangle soup with UVs, written compactly to JSON: v=[x,y,z,…], uv=[u,v,…], t=[i,j,k,…]."""

    def __init__(self):
        self.v, self.uv, self.t = [], [], []

    def __bool__(self):
        return bool(self.t)

    def vert(self, p, uv):
        self.v.extend((r3(p[0]), r3(p[1]), r3(p[2])))
        self.uv.extend((r3(uv[0]), r3(uv[1])))
        return len(self.v) // 3 - 1

    def tri(self, a, b, c, ua, ub, uc):
        i = self.vert(a, ua)
        j = self.vert(b, ub)
        k = self.vert(c, uc)
        self.t.extend((i, j, k))

    def quad(self, a, b, c, d, ua, ub, uc, ud):
        """Counter-clockwise when seen from the front."""
        i, j, k, l = (self.vert(p, u) for p, u in ((a, ua), (b, ub), (c, uc), (d, ud)))
        self.t.extend((i, j, k, i, k, l))

    def planar(self, pts, uvscale=2.0):
        """Fan-triangulate a convex planar polygon with UVs in its own plane (u along first edge)."""
        if len(pts) < 3:
            return
        p0 = pts[0]
        e = [pts[1][i] - p0[i] for i in range(3)]
        el = math.sqrt(sum(c * c for c in e)) or 1
        e = [c / el for c in e]
        a = [pts[1][i] - p0[i] for i in range(3)]
        b = [pts[2][i] - p0[i] for i in range(3)]
        n = [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
        s = [n[1] * e[2] - n[2] * e[1], n[2] * e[0] - n[0] * e[2], n[0] * e[1] - n[1] * e[0]]
        sl = math.sqrt(sum(c * c for c in s)) or 1
        s = [c / sl for c in s]
        uv = [(sum((p[i] - p0[i]) * e[i] for i in range(3)) / uvscale, sum((p[i] - p0[i]) * s[i] for i in range(3)) / uvscale) for p in pts]
        for k in range(1, len(pts) - 1):
            self.tri(pts[0], pts[k], pts[k + 1], uv[0], uv[k], uv[k + 1])

    def polygon(self, poly, z, scale=4.0, down=False):
        """Constrained-Delaunay triangulation of a polygon with holes, facing up (or down)."""
        for p in polys(poly):
            if p.area < 0.05:
                continue
            try:
                tris = shapely.get_parts(shapely.constrained_delaunay_triangles(p))
            except Exception:
                try:
                    tris = shapely.get_parts(shapely.constrained_delaunay_triangles(p.simplify(0.02).buffer(0)))
                except Exception:
                    continue
            if not len(tris):
                continue
            co = shapely.get_coordinates(shapely.get_exterior_ring(tris)).reshape(-1, 4, 2)[:, :3]
            for (ax, ay), (bx, by), (cx, cy) in co:
                ccw = (bx - ax) * (cy - ay) - (by - ay) * (cx - ax) > 0
                pts = [(ax, ay), (bx, by), (cx, cy)]
                if ccw == down:
                    pts.reverse()
                self.tri(*((x, y, z) for x, y in pts), *((x / scale, y / scale) for x, y in pts))

    def dump(self):
        return {'v': self.v, 'uv': self.uv, 't': self.t}


# ------------------------------------------------------------------------------------------ OSM reading
class OSM:
    def __init__(self, data, proj):
        self.proj = proj
        self.ways, self.rels, self.nodes = [], [], []
        for el in data['elements']:
            t = el.get('type')
            if t == 'way' and el.get('geometry'):
                self.ways.append(el)
            elif t == 'relation' and el.get('members'):
                self.rels.append(el)
            elif t == 'node' and 'lat' in el:
                self.nodes.append(el)

    def pts(self, geometry):
        return [self.proj.xy(g['lat'], g['lon']) for g in geometry if g]

    def line(self, el):
        p = self.pts(el['geometry'])
        return LineString(p) if len(p) >= 2 else None

    def area(self, el):
        if el['type'] == 'way':
            p = self.pts(el['geometry'])
            if len(p) >= 4 and math.dist(p[0], p[-1]) < 0.01:
                g = Polygon(p)
                return g if g.is_valid else g.buffer(0)
            return None
        outer = [LineString(self.pts(m['geometry'])) for m in el['members'] if m.get('role') in ('outer', '') and m.get('geometry') and len(m['geometry']) > 1]
        inner = [LineString(self.pts(m['geometry'])) for m in el['members'] if m.get('role') == 'inner' and m.get('geometry') and len(m['geometry']) > 1]
        if not outer:
            return None
        g = unary_union(list(polygonize(unary_union(outer))))
        if inner:
            g = g.difference(unary_union(list(polygonize(unary_union(inner)))))
        return g.buffer(0) if not g.is_empty else None

    def areas(self, test):
        for el in self.ways + self.rels:
            tags = el.get('tags', {})
            if test(tags):
                g = self.area(el)
                if g is not None and not g.is_empty:
                    yield el, tags, g

    def lines(self, test):
        for el in self.ways:
            tags = el.get('tags', {})
            if test(tags):
                g = self.line(el)
                if g is not None:
                    yield el, tags, g

    def point(self, el):
        return self.proj.xy(el['lat'], el['lon'])


# ------------------------------------------------------------------------------------------ land & water
def build_water(osm: OSM, B: Polygon):
    # The sea: coastline ways have land on their left. Polygonize the box with the coast and
    # classify each face by which side of a coastline segment it lies on.
    coast = [g for el, t, g in osm.lines(lambda t: t.get('natural') == 'coastline')]
    sea = []
    if coast:
        clipped = [c.intersection(B) for c in coast if c.intersects(B)]
        lines = [g for c in clipped for g in (c.geoms if hasattr(c, 'geoms') else [c]) if g.geom_type == 'LineString']
        faces = list(polygonize(unary_union([B.boundary] + lines))) if lines else [B]
        segs = []
        for c in coast:
            cs = list(c.coords)
            segs += list(zip(cs, cs[1:]))
        tree = STRtree([LineString(s) for s in segs])
        for f in faces:
            rp = f.representative_point()
            idx = tree.nearest(rp)
            (ax, ay), (bx, by) = segs[idx]
            # Signed side of the nearest coastline segment: left (positive) is land.
            side = (bx - ax) * (rp.y - ay) - (by - ay) * (rp.x - ax)
            if side < 0:
                sea.append(f)
    lakes = []
    for el, t, g in osm.areas(lambda t: t.get('natural') in ('water', 'bay', 'strait') or 'water' in t or
                              t.get('waterway') in ('riverbank', 'dock', 'boatyard') or t.get('landuse') in ('reservoir', 'basin')):
        if t.get('tunnel') or t.get('covered') == 'yes' or t.get('natural') == 'wetland':
            continue
        lakes.append(g)
    rivers = []
    for el, t, g in osm.lines(lambda t: t.get('waterway') in ('river', 'canal', 'stream', 'ditch', 'drain')):
        if t.get('tunnel') in ('culvert', 'yes') or t.get('layer', '0').startswith('-'):
            continue
        w = num(t.get('width')) or {'river': 14, 'canal': 9, 'stream': 2.5, 'ditch': 1.4, 'drain': 1.2}[t['waterway']]
        rivers.append(g.buffer(w / 2, cap_style=2))
    water = unary_union(sea + lakes + rivers).intersection(B) if (sea or lakes or rivers) else Polygon()
    return water.buffer(0)


# ------------------------------------------------------------------------------------------ main
def main(argv=None):
    ap = argparse.ArgumentParser(prog='sustainable.py prepare')
    ap.add_argument('slug')
    args = ap.parse_args(argv)
    place = load_place(args.slug)
    folder = city_dir(args.slug)
    osm_path = folder / 'osm.json'
    if not osm_path.exists():
        raise SystemExit('osm.json is missing. Run: python3 sustainable.py fetch ' + args.slug)
    proj = projection_for(place)
    osm = OSM(json.loads(osm_path.read_text()), proj)
    overrides, defaults = {}, {}
    if (folder / 'overrides.json').exists():
        overrides = json.loads((folder / 'overrides.json').read_text()).get('buildings', {})
        defaults = json.loads((folder / 'overrides.json').read_text()).get('defaults', {})
    half = place['size_m'] / 2
    B = box(-half, -half, half, half)
    country = place.get('country_code', '')
    preset = next((p for p in STYLE['region_presets'].values() if country in p['countries']), STYLE['region_presets']['default'])
    # A place can tune its region's preset (overrides.json "defaults": {"preset": …}): the style weights, weighted
    # colours per wall and roof style (Venice: ochre, salmon, rose and Venetian red under terracotta) and the
    # largest footprint that still gets a pitched roof.
    preset = {**preset, **defaults.get('preset', {})}
    say(f'Preparing {place["name"]}: {place["size_m"]} m square, style preset for "{country or "?"}"')

    # ---------------------------------------------------------------- water and land
    water = build_water(osm, B)
    piers = []
    for el, t, g in osm.areas(lambda t: t.get('man_made') in ('pier', 'breakwater', 'quay')):
        piers.append(g)
    for el, t, g in osm.lines(lambda t: t.get('man_made') in ('pier', 'breakwater', 'quay')):
        if not g.is_closed:
            piers.append(g.buffer((num(t.get('width')) or 3.0) / 2, cap_style=2))
    pier = unary_union(piers).intersection(B) if piers else Polygon()
    land = B.difference(water).union(pier).buffer(0)
    say(f'  land {land.area / 1e4:.1f} ha, water {water.area / 1e4:.1f} ha')

    # ---------------------------------------------------------------- roads
    car, cobble, paving, soft, sidewalk_bands, passages, bridges = [], [], [], [], [], [], []
    bridge_lines = []  # (centre line, width, strip) of every mapped bridge, for the arched ones below
    roads_out = []
    road_overrides = json.loads((folder / 'overrides.json').read_text()).get('roads', {}) if (folder / 'overrides.json').exists() else {}
    for el, t, g in osm.lines(lambda t: 'highway' in t):
        rov = road_overrides.get(f'w{el["id"]}') or road_overrides.get(t.get('name', '\0')) or {}
        if rov:
            t = {**t, **{k: str(v) for k, v in rov.items() if k != 'note'}}
        if t.get('hide'):
            continue
        hw = t['highway']
        if t.get('area') == 'yes' or hw in ('proposed', 'construction', 'corridor', 'elevator', 'bus_stop', 'platform') and hw != 'platform':
            continue
        if t.get('tunnel') in ('yes', 'culvert') or (t.get('layer', '0').startswith('-') and t.get('tunnel')):
            continue
        if not g.intersects(B.buffer(20)):
            continue
        if hw in CAR_WIDTH:
            w = num(t.get('width')) or (num(t.get('lanes')) * 3.2 + 0.6 if num(t.get('lanes')) else None) or CAR_WIDTH[hw]
            if hw == 'service':
                w = {'parking_aisle': 5.0, 'driveway': 3.2, 'alley': 3.6}.get(t.get('service'), w)
            w = max(2.6, min(w, 22))
            strip = g.buffer(w / 2, cap_style=2, join_style=2)
            surf = t.get('surface', '')
            if hw == 'pedestrian':
                paving.append(strip)
            elif surf in COBBLE_SURFACES:
                cobble.append(strip)
            elif surf in SOFT_SURFACES or hw == 'track':
                soft.append(strip)
            else:
                car.append(strip)
            if t.get('tunnel') == 'building_passage' or t.get('covered') == 'yes':
                passages.append(g.buffer(w / 2 + 0.3, cap_style=2))
            if t.get('bridge') and t.get('bridge') != 'no':
                bridges.append(strip)
                bridge_lines.append((g, w, strip))
            # Sidewalks: tagged sides, or both sides of urban streets unless mapped separately.
            sw = t.get('sidewalk', t.get('sidewalk:both', ''))
            if hw in SIDEWALK_CLASSES and sw not in ('no', 'none', 'separate') and t.get('sidewalk:both') != 'separate':
                swidth = num(t.get('sidewalk:width')) or 1.9
                sides = {'left': [1], 'right': [-1]}.get(sw, [1, -1])
                for s in sides:
                    try:
                        sidewalk_bands.append(g.buffer(s * (w / 2 + swidth), single_sided=True, cap_style=2, join_style=2))
                    except Exception:
                        pass
            roads_out.append({'id': f'w{el["id"]}', 'name': t.get('name') or t.get('ref') or '', 'kind': hw, 'w': round(w, 1),
                              'surface': surf, 'p': [[r2(x), r2(y)] for x, y in g.coords]})
        elif hw in SOFT_WIDTH:
            w = max(1.4, min(num(t.get('width')) or SOFT_WIDTH[hw], 8))
            strip = g.buffer(w / 2, cap_style=2, join_style=2)
            surf = t.get('surface', '')
            if surf in SOFT_SURFACES or (hw in ('path', 'bridleway') and not surf):
                soft.append(strip)
            else:
                paving.append(strip)
            if t.get('bridge') and t.get('bridge') != 'no':
                bridges.append(strip)
                bridge_lines.append((g, w, strip))
            if t.get('tunnel') == 'building_passage' or t.get('covered') == 'yes':
                passages.append(g.buffer(w / 2 + 0.3, cap_style=2))
            roads_out.append({'id': f'w{el["id"]}', 'name': t.get('name') or '', 'kind': hw, 'w': round(w, 1),
                              'surface': surf, 'p': [[r2(x), r2(y)] for x, y in g.coords]})
    # Pedestrian areas, squares and mapped road areas.
    for el, t, g in osm.areas(lambda t: (t.get('highway') in ('pedestrian', 'footway', 'service', 'residential', 'unclassified') and t.get('area') == 'yes')
                              or t.get('place') == 'square' or 'area:highway' in t or t.get('amenity') == 'marketplace'):
        kind = t.get('area:highway') or t.get('highway') or 'pedestrian'
        if kind in ('residential', 'unclassified', 'service', 'secondary', 'primary', 'tertiary') and t.get('surface', '') not in COBBLE_SURFACES:
            car.append(g)
        else:
            paving.append(g)
    passage = unary_union(passages) if passages else Polygon()
    bridge = unary_union(bridges).intersection(water.buffer(0.5)) if bridges else Polygon()
    # Arched bridges (overrides.json "defaults": {"bridges": {"style": "arch"}} – Venice's stone bridges over its
    # canals): where a bridge's centre line crosses the water from quay to quay, a span that build_city.py vaults,
    # with steps up to a crown and parapets, high enough for a boat to pass under. The flat deck and its edges
    # give way there.
    bridge_spans = []
    if (defaults.get('bridges') or {}).get('style') == 'arch' and bridge_lines:
        joined = unary_union([g for g, _, _ in bridge_lines])
        merged = linemerge([joined] if joined.geom_type == 'LineString' else joined)   # a bridge mapped in pieces is one span
        arched, flat, flat_out, companions = [], defaultdict(int), [], []
        for line in getattr(merged, 'geoms', [merged]):
            widths = [w for g, w, _ in bridge_lines if g.intersects(line)]
            over = line.intersection(water)
            for seg in getattr(over, 'geoms', [over]):
                if not widths or seg.is_empty or seg.geom_type != 'LineString':
                    continue
                a, b = Point(seg.coords[0]), Point(seg.coords[-1])
                L = a.distance(b)
                if 1.5 <= L <= 45:
                    # A mapped bridge often stops a metre or two short of the quay: carry it on along its own line.
                    a, b = reach_land(a, b, land), reach_land(b, a, land)
                    L = a.distance(b) if a and b else L
                # From quay to quay across the canal (or obliquely over it), its middle well out on the water, and
                # straight – not a walkway along the water, nor a bridge that turns over the water (an L), nor one
                # leaving the play area. Anything else keeps its flat deck.
                why = ('size' if not 1.5 <= L <= 48 else 'not quay to quay' if not (a and b)
                       else 'edge' if not (B.contains(a) and B.contains(b))
                       else 'along the water' if land.distance(Point((a.x + b.x) / 2, (a.y + b.y) / 2)) < 0.15 * L
                       else 'turning over the water' if LineString([seg.coords[0], seg.coords[-1]]).hausdorff_distance(seg) > max(1.8, 0.18 * L) else None)
                if why:
                    flat[why] += 1
                    p, q = Point(seg.coords[0]), Point(seg.coords[-1])
                    flat_out.append({'why': why, 'a': [r2(p.x), r2(p.y)], 'b': [r2(q.x), r2(q.y)], 'land': [r2(land.distance(p)), r2(land.distance(q))],
                                     'bend': r2(LineString([p, q]).hausdorff_distance(seg))})
                    if why == 'not quay to quay' and p.distance(q) >= 1.5:   # perhaps the other walkway of an arched bridge
                        cut = LineString([p, q]).buffer(max(widths) / 2 + 0.6, cap_style=2)
                        companions.append({'a': (p.x, p.y), 'b': (q.x, q.y), 'w': max(widths),
                                           'cut': [cut] + [s.intersection(cut.buffer(1.0)) for _, _, s in bridge_lines if s.intersects(cut)]})
                    continue
                w = max(widths)
                bridge_spans.append({'a': [r2(a.x), r2(a.y)], 'b': [r2(b.x), r2(b.y)], 'w': round(w, 2)})
                # The flat deck gives way over the crossing and a metre around it, and nowhere else.
                ux, uy = (b.x - a.x) / L, (b.y - a.y) / L
                rect = LineString([(a.x - ux * 0.6, a.y - uy * 0.6), (b.x + ux * 0.6, b.y + uy * 0.6)]).buffer(w / 2 + 0.05, cap_style=2)
                near = rect.buffer(1.0)
                arched += [rect] + [s.intersection(near) for _, _, s in bridge_lines if s.intersects(near)]
        # A walkway that stops short of the quays right beside an arched bridge, parallel to it, is the same bridge
        # mapped as two ways: the arch widens to carry both, and that deck gives way too.
        for c in companions:
            cl = math.dist(c['a'], c['b'])
            cu, (cmx, cmy) = ((c['b'][0] - c['a'][0]) / cl, (c['b'][1] - c['a'][1]) / cl), ((c['a'][0] + c['b'][0]) / 2, (c['a'][1] + c['b'][1]) / 2)
            for s in bridge_spans:
                (ax, ay), (bx, by) = s['a'], s['b']
                L = math.dist((ax, ay), (bx, by))
                ux, uy = (bx - ax) / L, (by - ay) / L
                along, off = (cmx - ax) * ux + (cmy - ay) * uy, -(cmx - ax) * uy + (cmy - ay) * ux
                if abs(ux * cu[0] + uy * cu[1]) < 0.94 or not 0 <= along <= L or abs(off) > (s['w'] + c['w']) / 2 + 2.0:
                    continue
                lo, hi = min(-s['w'] / 2, off - c['w'] / 2), max(s['w'] / 2, off + c['w'] / 2)
                mid = (lo + hi) / 2
                s.update(a=[r2(ax - uy * mid), r2(ay + ux * mid)], b=[r2(bx - uy * mid), r2(by + ux * mid)], w=round(hi - lo, 2))
                arched += c['cut']
                flat['not quay to quay'] -= 1
                flat['beside an arch, widening it'] += 1
                break
        if arched:
            bridge = bridge.difference(unary_union(arched))
            bridge = unary_union([p for p in getattr(bridge, 'geoms', [bridge]) if p.area >= 3.0])   # no slivers of deck left
        bridge_spans = merge_spans(bridge_spans)
        say(f'  arched bridges: {len(bridge_spans)}' + (f' (pieces kept flat: {", ".join(f"{n} {k}" for k, n in flat.items())})' if flat else ''))
        (folder / 'bridges-flat.json').write_text(json.dumps(flat_out, indent=0))   # for review: what stayed flat, and why
    walkable_land = land.union(bridge)

    # ---------------------------------------------------------------- buildings
    raw = []
    for el, t, g in osm.areas(lambda t: ('building' in t and t['building'] not in ('no', 'roof', 'construction', 'proposed', 'demolished', 'collapsed'))
                              or ('building:part' in t and t['building:part'] not in ('no',))):
        for p in clean(g.intersection(B.buffer(-0.5)), 4.0):
            raw.append((el, t, p))
    parts = [(el, t, p) for el, t, p in raw if 'building:part' in t and 'building' not in t]
    outlines = [(el, t, p) for el, t, p in raw if 'building' in t]
    part_tree = STRtree([p for _, _, p in parts]) if parts else None
    volumes = []  # (id, tags, polygon, outline_tags)
    for el, t, p in outlines:
        oid = f'{el["type"][0]}{el["id"]}'
        if part_tree is not None:
            hits = [parts[i][2] for i in part_tree.query(p) if p.buffer(0.5).contains(parts[i][2].representative_point())]
            if hits:
                rest = p.difference(unary_union(hits).buffer(0.2))
                for q in clean(rest, 12.0):
                    if q.area > 0.2 * p.area:
                        volumes.append((oid + 'r', t, q, t))
                continue
        volumes.append((oid, t, p, t))
    for el, t, p in parts:
        volumes.append((f'{el["type"][0]}{el["id"]}', t, p, t))
    # Map footprints for 2D collision: full outlines (minus passages, floating parts excluded).
    footprints = []
    for el, t, p in outlines:
        if (num(t.get('min_height')) or 0) > 2.5:
            continue
        for q in clean(p.difference(passage), 3.0):
            footprints.append(q)
    FOOT = unary_union(footprints) if footprints else Polygon()

    # Heights first (needed for party-wall detection).
    storey, ground_storey = STYLE['storey_m'], STYLE['ground_storey_m']
    vol_info = []
    area_rules = []
    for rule in (json.loads((folder / 'overrides.json').read_text()).get('areas', []) if (folder / 'overrides.json').exists() else []):
        if rule.get('polygon'):
            shape = Polygon([proj.xy(lat, lon) for lat, lon in rule['polygon']])
        else:
            shape = Point(*proj.xy(*rule['center'])).buffer(rule.get('radius', 50))
        area_rules.append((shape, rule.get('buildings', {})))
    for vid, t, p, ot in volumes:
        ov = {}
        for shape, settings in area_rules:
            if shape.contains(p.representative_point()):
                ov.update(settings)
        # Area mixes ({"colour_mix": {"falu": 3, "yellow": 1}, …}) pick one value per building, deterministically.
        # "look_mix" picks "style/colour" pairs and "roof_look_mix" "roof_style/roof_colour" pairs.
        for key in [k for k in ov if k.endswith('_mix') and k != 'levels_mix']:
            value = pick(ov.pop(key), (vid, key))
            if key == 'look_mix':
                ov['style'], ov['colour'] = value.split('/')
            elif key == 'roof_look_mix':
                ov['roof_style'], ov['roof_colour'] = value.split('/')
            else:
                ov[key[:-4]] = value
        ov.update(overrides.get(vid) or overrides.get(vid.rstrip('r')) or {})
        if ov.get('hide'):
            continue
        t = {**t, **{k: v for k, v in ov.items() if isinstance(v, (str, int, float))}}
        kind = t.get('building') or t.get('building:part') or 'yes'
        if kind == 'yes' and t.get('amenity') == 'place_of_worship':
            kind = 'church'
        area = p.area
        levels = num(t.get('building:levels'))
        height = num(t.get('height'))
        min_h = num(t.get('min_height')) or (num(t.get('building:min_level')) or 0) * storey
        roof_h = num(t.get('roof:height')) or ((num(t.get('roof:levels')) or 0) * 2.6 or None)
        if levels is None and height is None:
            if kind in SMALL_KINDS:
                levels = 1
            elif kind in ('house', 'detached', 'semidetached_house', 'bungalow', 'cabin', 'villa', 'farm'):
                levels = 1 if area < 70 else 2
            elif kind in ('terrace',):
                levels = 2
            elif kind in ('apartments', 'residential', 'dormitory'):
                levels = 3 + int(h01(vid, 'lv') * 3) if area > 180 else 3
            elif kind in ('industrial', 'warehouse', 'manufacture', 'hangar', 'factory', 'sports_hall', 'supermarket', 'retail') and area > 400:
                height = 6.5 + h01(vid, 'ind') * 3
                levels = 1
            elif kind in CHURCH_KINDS:
                height = 11 + min(area / 120, 7)
                levels = 2
            elif kind in ('commercial', 'office', 'hotel', 'school', 'hospital', 'university', 'public', 'civic', 'government', 'college'):
                levels = 3 + int(h01(vid, 'lv') * 2)
            elif area < 35:
                levels = 1
            elif area < 120:
                levels = 2
            else:
                levels = 2 + int(h01(vid, 'lv') * 3)
            if ov.get('levels_mix') and area >= 60:                  # houses only, never sheds and garages
                levels = int(pick(ov['levels_mix'], (vid, 'levels_mix')))
            cap = ov.get('max_levels') or defaults.get('max_levels')
            if levels is not None and cap:
                levels = min(levels, int(cap))                       # small towns / villa areas: estimates stay low
        if levels is None:
            levels = max(1, round((height - (roof_h or 0)) / storey))
        levels = max(1, min(int(levels), 60))
        if height is None:
            wall_h = (ground_storey if levels > 1 else storey) + (levels - 1) * storey + (0.4 if levels > 1 else 0)
            if kind in SMALL_KINDS:
                wall_h = 2.7
        else:
            wall_h = height - (roof_h or 0) if t.get('roof:shape', 'flat') != 'flat' and roof_h else height
        wall_h = max(min_h + 2.2, min(wall_h, 250))
        vol_info.append({'id': vid, 'tags': t, 'poly': p, 'kind': kind, 'levels': levels, 'h': wall_h, 'min_h': min_h, 'roof_h': roof_h, 'ov': ov})
    vtree = STRtree([v['poly'] for v in vol_info]) if vol_info else None

    buildings = []
    for v in vol_info:
        buildings.append(make_building(v, vol_info, vtree, passage, preset, country))
    say(f'  {len(buildings)} building volumes ({len(parts)} mapped parts), {len(footprints)} footprints')

    # ---------------------------------------------------------------- ground layers (top priority first)
    surf = STYLE['surfaces']
    car_u = unary_union(car) if car else Polygon()
    cob_u = unary_union(cobble).difference(car_u) if cobble else Polygon()
    roadways = car_u.union(cob_u)
    sidewalk = (unary_union(sidewalk_bands).difference(roadways) if sidewalk_bands else Polygon())
    pav_u = (unary_union(paving).difference(roadways).difference(sidewalk) if paving else Polygon())
    hard = roadways.union(sidewalk).union(pav_u)
    soft_u = (unary_union(soft).difference(hard) if soft else Polygon())
    # Ground-covering areas.
    def area_union(test):
        gs = [g for _, _, g in osm.areas(test)]
        return unary_union(gs).intersection(B) if gs else Polygon()
    parking = area_union(lambda t: t.get('amenity') == 'parking' and t.get('parking') not in ('underground', 'multi-storey', 'rooftop'))
    rails = []
    for el, t, g in osm.lines(lambda t: t.get('railway') in ('rail', 'light_rail', 'narrow_gauge')):
        if t.get('tunnel') or (t.get('bridge') and not g.intersects(land)):
            continue
        rails.append(g)
    rail_bed = unary_union([r.buffer(1.7, cap_style=2) for r in rails]) if rails else Polygon()
    tram = [g for el, t, g in osm.lines(lambda t: t.get('railway') == 'tram' and not t.get('tunnel'))]
    platforms = area_union(lambda t: t.get('railway') == 'platform' or t.get('public_transport') == 'platform')
    sand = area_union(lambda t: t.get('natural') in ('beach', 'sand') or t.get('leisure') in ('playground',) or t.get('landuse') == 'sand')
    pitch = area_union(lambda t: t.get('leisure') in ('pitch', 'golf_course', 'track', 'stadium'))
    park = area_union(lambda t: t.get('leisure') in ('park', 'garden', 'common', 'recreation_ground', 'dog_park', 'nature_reserve'))
    grass = area_union(lambda t: t.get('landuse') in ('grass', 'village_green', 'meadow', 'flowerbed', 'recreation_ground', 'greenfield', 'allotments', 'orchard', 'plant_nursery', 'vineyard')
                       or t.get('natural') in ('grassland', 'heath', 'scrub', 'fell'))
    cemetery = area_union(lambda t: t.get('landuse') == 'cemetery' or t.get('amenity') == 'grave_yard')
    forest = area_union(lambda t: t.get('landuse') == 'forest' or t.get('natural') in ('wood', 'tree_group'))
    field = area_union(lambda t: t.get('landuse') in ('farmland', 'farmyard', 'meadow') and False or t.get('landuse') in ('farmland',))
    dirt = area_union(lambda t: t.get('landuse') in ('brownfield', 'construction', 'landfill', 'quarry', 'railway') or t.get('natural') in ('bare_rock', 'scree', 'mud'))
    # Yards: lawn round small houses (villas, terraces, cottages), so residential streets aren't bare dirt
    # – not in a stone city ("rest": "paving"), where small houses stand wall to wall round paved courts.
    stone = defaults.get('rest', 'grass') == 'paving'
    house_polys = [v['poly'] for v in vol_info
                   if v['kind'] in HOUSE_KINDS or (v['kind'] in ('yes', 'residential') and v['poly'].area < 220 and v['levels'] <= 2)]
    yards = unary_union([q.buffer(12.0) for q in house_polys]).intersection(B) if house_polys and not stone else Polygon()
    grass = grass.union(yards)
    # A pier deck beats footpaths mapped along it (their strips would otherwise sit at ground level over the water).
    layers = [('asphalt', car_u), ('cobble', cob_u), ('sidewalk', sidewalk), ('pier', pier), ('paving', pav_u.union(platforms)), ('path', soft_u),
              ('parking', parking), ('rail', rail_bed), ('sand', sand), ('pitch', pitch), ('park', park), ('grass', grass),
              ('cemetery', cemetery), ('forest', forest), ('field', field), ('dirt', dirt)]
    taken = FOOT.buffer(-0.05) if not FOOT.is_empty else Polygon()
    # Floating building parts and passage ceilings never cut the ground.
    out_layers = {}
    layer_geom = {}
    for name, g in layers:
        if g.is_empty:
            continue
        clip = walkable_land if name in ('asphalt', 'cobble', 'paving', 'path') else land
        g = g.intersection(clip).difference(taken)
        g = g.difference(unary_union(list(layer_geom.values()))) if layer_geom else g
        g = unary_union(clean(g, 0.3))
        if not g.is_empty:
            layer_geom[name] = g
    rest = land.difference(taken).difference(unary_union(list(layer_geom.values())) if layer_geom else Polygon())
    # Land the map says nothing about: grass in a sustainable place (bare ground only with
    # "defaults": {"rest": "ground"} in overrides.json, as the battle-car game had it; stone with
    # "rest": "paving", for a city of paved courts and alleys like Venice).
    if defaults.get('rest', 'grass') == 'ground':
        layer_geom['ground'] = unary_union(clean(rest, 0.3))
    elif stone:
        layer_geom['paving'] = unary_union([layer_geom.get('paving', Polygon()), *clean(rest, 0.3)])
        layer_geom['ground'] = Polygon()
    else:
        layer_geom['grass'] = unary_union([layer_geom.get('grass', Polygon()), *clean(rest, 0.3)])
        layer_geom['ground'] = Polygon()
    terrain = load_terrain(folder, proj, half, B, land, water, FOOT, layer_geom.get('forest', Polygon()), defaults)
    sub = TSTEP if terrain else None
    for name, g in layer_geom.items():
        out_layers[name] = triangulate_cells(g, surf[name]['z'], half, sub)
    stats_layers = {k: round(g.area) for k, g in layer_geom.items()}
    say('  ground layers: ' + ', '.join(f'{k} {v / 1e4:.2f} ha' for k, v in stats_layers.items() if v > 0))

    # Curbs: every edge of the raised sidewalk. Shore: land edges facing water (not the box edge).
    curbs = edges_of(layer_geom.get('sidewalk', Polygon()), B)
    shore = edges_of(land, B, exclude=pier)
    if terrain:                                   # short pieces, so kerbs and quays follow the ground
        curbs, shore = densify(curbs, TSTEP), densify(shore, TSTEP)
    bridge_edges = []
    if not bridge.is_empty:
        inner_water = water.buffer(-0.4)
        for seg in edges_of(bridge.intersection(B), B):
            mid = Point((seg[0] + seg[2]) / 2, (seg[1] + seg[3]) / 2)
            if inner_water.contains(mid):
                bridge_edges.append(seg)

    # ---------------------------------------------------------------- the edge of the world
    # The battle-car game walls the play area in with rusty shipping containers wherever land meets its
    # edge. A sustainable place has no such wall: only with "defaults": {"edge_containers": true} in
    # overrides.json.
    barriers = []
    edge_line = B.exterior if defaults.get('edge_containers') else None
    land_edge = land.boundary.intersection(edge_line.buffer(0.05)) if edge_line is not None and not land.is_empty else Polygon()
    on_edge = [g for g in (land_edge.geoms if hasattr(land_edge, 'geoms') else [land_edge]) if g.geom_type == 'LineString' and g.length > 0.5]
    on_edge = linemerge(on_edge) if on_edge else None
    lines = [] if on_edge is None or on_edge.is_empty else (list(on_edge.geoms) if hasattr(on_edge, 'geoms') else [on_edge])
    rngc = random.Random('containers')
    cont_cols = ['rust', 'blue', 'green', 'red', 'grey', 'rust', 'orange']
    for ln in lines:
        d = 2.0
        while d < ln.length - 2.0:
            a, b = ln.interpolate(max(0, d - 1)), ln.interpolate(min(ln.length, d + 1))
            ang = math.atan2(b.y - a.y, b.x - a.x)
            c = ln.interpolate(d)
            # Push the container 2 m inside the play area.
            ix, iy = -c.x, -c.y
            il = math.hypot(ix, iy) or 1
            cx, cy = c.x + ix / il * 2.0, c.y + iy / il * 2.0
            if not FOOT.buffer(1.0).contains(Point(cx, cy)) and land.contains(Point(cx, cy)):
                stack = 2 if rngc.random() < 0.3 else 1
                barriers.append({'x': r2(cx), 'y': r2(cy), 'a': r2(ang + rngc.uniform(-0.12, 0.12)), 'l': 6.06, 'w': 2.44, 'h': 2.59,
                                 'stack': stack, 'colour': rngc.choice(cont_cols), 'cell': cell_of(Point(cx, cy))})
            d += 6.3
    say(f'  {len(barriers)} edge containers')

    # ---------------------------------------------------------------- walls and barriers
    walls = []
    gates = roadways.union(pav_u).union(soft_u).buffer(0.3)
    for el, t, g in osm.lines(lambda t: t.get('barrier') in ('city_wall', 'wall', 'hedge', 'retaining_wall') or t.get('historic') in ('city_wall', 'citywalls')):
        kind = 'city_wall' if t.get('barrier') == 'city_wall' or t.get('historic') in ('city_wall', 'citywalls') else t['barrier']
        h = num(t.get('height')) or {'city_wall': 7.5, 'wall': 1.8, 'hedge': 1.4, 'retaining_wall': 1.0}[kind]
        w = num(t.get('width')) or {'city_wall': 2.2, 'wall': 0.4, 'hedge': 1.1, 'retaining_wall': 0.5}[kind]
        strip = g.buffer(w / 2, cap_style=2, join_style=2).intersection(land)
        strip = strip.difference(gates).difference(FOOT)
        for q in clean(strip, 0.6):
            m = Buf()
            wall_volume(m, q, h)
            walls.append({'kind': kind, 'h': r2(h), 'cell': cell_of(q.centroid), 'mesh': m.dump(), 'poly': ring_list(q.exterior)})

    # Garden hedges and white fences along the street side of house yards, with a gap for the driveway.
    hard_near = hard.buffer(2.6)
    foot_gap = FOOT.buffer(0.5)                      # once, not per house
    n_hedge = 0
    # A stone city (Venice: "rest": "paving") has no villa yards to fence.
    for v in ([] if defaults.get('rest', 'grass') == 'paving' else vol_info):
        q = v['poly']
        if not (v['kind'] in HOUSE_KINDS or (v['kind'] in ('yes', 'residential') and q.area < 220 and v['levels'] <= 2)):
            continue
        roll = h01(v['id'], 'yard')
        if roll > 0.8:
            continue
        kind = 'hedge' if roll < 0.55 else 'fence'
        yard = q.buffer(12.0).difference(hard).difference(foot_gap)
        inner = yard.buffer(-0.9, join_style=2)
        if inner.is_empty:
            continue
        line = inner.boundary.intersection(hard_near)
        if line.is_empty or line.length < 4:
            continue
        mid = line.interpolate(line.project(q.centroid))
        line = line.difference(mid.buffer(1.9))
        h, w = (1.2, 0.8) if kind == 'hedge' else (0.95, 0.14)
        strip = line.buffer(w / 2, cap_style=2, join_style=2).intersection(land).difference(gates).difference(FOOT)
        for piece in clean(strip, 0.4):
            m = Buf()
            wall_volume(m, piece, h)
            walls.append({'kind': kind, 'h': r2(h), 'cell': cell_of(piece.centroid), 'mesh': m.dump(), 'poly': ring_list(piece.exterior)})
            n_hedge += 1
    say(f'  {n_hedge} garden hedges and fences')
    garden_trees = []
    # Buffered once and prepared: testing thousands of points against them is then cheap. A stone city
    # (Venice) has no villa gardens to plant.
    foot_clear, hard_clear = prep(FOOT.buffer(2.0)), prep(hard.buffer(1.5))
    for v in ([] if stone else vol_info):
        q = v['poly']
        if not (v['kind'] in HOUSE_KINDS or (v['kind'] in ('yes', 'residential') and q.area < 220 and v['levels'] <= 2)):
            continue
        for k in range(2):
            if h01(v['id'], 'gt', k) > 0.55:
                continue
            ang = h01(v['id'], 'ga', k) * math.tau
            r = math.sqrt(q.area) / 2 + 3.5 + h01(v['id'], 'gr', k) * 4
            pt = Point(q.centroid.x + math.cos(ang) * r, q.centroid.y + math.sin(ang) * r)
            if land.contains(pt) and not foot_clear.contains(pt) and not hard_clear.contains(pt):
                garden_trees.append([r2(pt.x), r2(pt.y), round(0.6 + h01(v['id'], 'gs', k) * 0.45, 2),
                                     'conifer' if h01(v['id'], 'gk', k) < 0.3 else 'leaf'])

    # ---------------------------------------------------------------- trees
    rng = random.Random(f'{place["center"]}')
    clear = unary_union([hard.buffer(1.2), soft_u.buffer(0.8), FOOT.buffer(2.2), parking, rail_bed.buffer(1), water.buffer(1.5)])
    trees = []
    for el in osm.nodes:
        t = el.get('tags', {})
        if t.get('natural') == 'tree':
            x, y = osm.point(el)
            if B.contains(Point(x, y)) and land.contains(Point(x, y)):
                trees.append([r2(x), r2(y), round(rng.uniform(0.85, 1.2), 2), 'conifer' if t.get('leaf_type') == 'needleleaved' else 'leaf'])
    for el, t, g in osm.lines(lambda t: t.get('natural') == 'tree_row'):
        for d in range(0, int(g.length) + 1, 8):
            pt = g.interpolate(d)
            if B.contains(pt) and land.contains(pt) and not FOOT.contains(pt):
                trees.append([r2(pt.x), r2(pt.y), round(rng.uniform(0.8, 1.1), 2), 'leaf'])
    taken_t = unary_union([Point(x, y).buffer(4) for x, y, *_ in trees]) if trees else Polygon()
    nordic = preset is STYLE['region_presets']['nordic']
    for name, step, prob in (('forest', 7.0, 0.95), ('park', 13.0, 0.7), ('cemetery', 12.0, 0.6), ('grass', 18.0, 0.35), ('ground', 26.0, 0.12)):
        g = layer_geom.get(name)
        if g is None or g.is_empty:
            continue
        for x, y in scatter(g.difference(clear).difference(taken_t), step, rng):
            if rng.random() < prob:
                kind = 'conifer' if (name == 'forest' and nordic and rng.random() < 0.6) or (name == 'cemetery' and rng.random() < 0.25) else 'leaf'
                trees.append([r2(x), r2(y), round(rng.uniform(0.75, 1.25), 2), kind])
    say(f'  {len(trees)} trees')

    # ---------------------------------------------------------------- street furniture
    props = []
    sidewalk_g = layer_geom.get('sidewalk', Polygon())
    road_lines = [LineString(r['p']) for r in roads_out if r['kind'] in CAR_WIDTH and len(r['p']) > 1]
    road_tree = STRtree(road_lines) if road_lines else None

    def facing(x, y):
        """Angle from a point towards the nearest carriageway (lamp arms and benches face the road)."""
        if road_tree is None:
            return 0.0
        ln = road_lines[road_tree.nearest(Point(x, y))]
        q = ln.interpolate(ln.project(Point(x, y)))
        return r2(math.atan2(q.y - y, q.x - x))

    kinds = {'street_lamp': 'lamp', 'traffic_signals': 'signal', 'bus_stop': 'busstop', 'bench': 'bench', 'waste_basket': 'bin',
             'fountain': 'fountain', 'post_box': 'postbox', 'telephone': 'phone', 'bicycle_parking': 'bikerack'}
    for el in osm.nodes:
        t = el.get('tags', {})
        k = kinds.get(t.get('highway')) or kinds.get(t.get('amenity'))
        if not k:
            continue
        x, y = osm.point(el)
        pt = Point(x, y)
        if not B.contains(pt) or FOOT.contains(pt) or not walkable_land.contains(pt):
            continue
        if k in ('lamp', 'signal', 'busstop', 'postbox', 'phone', 'bin', 'bench') and car_u.buffer(-0.5).contains(pt):
            # Nodes on the carriageway centreline (signals, mapped bus stops): move them to the kerb.
            pt = nearest_edge_point(sidewalk_g, pt) or pt
        props.append({'k': k, 'x': r2(pt.x), 'y': r2(pt.y), 'a': facing(pt.x, pt.y)})
    mapped_lamps = unary_union([Point(p['x'], p['y']).buffer(18) for p in props if p['k'] == 'lamp']) if props else Polygon()
    # Generated lamps along sidewalks of streets that have none mapped.
    for r in roads_out:
        if r['kind'] not in SIDEWALK_CLASSES or len(r['p']) < 2:
            continue
        ln = LineString(r['p'])
        side = 1 if h01(r['id']) > 0.5 else -1
        for d in range(12, int(ln.length), 28):
            c = ln.interpolate(d)
            a, b = ln.interpolate(max(0, d - 1)), ln.interpolate(min(ln.length, d + 1))
            dx, dy = b.x - a.x, b.y - a.y
            L = math.hypot(dx, dy) or 1
            off = r['w'] / 2 + 0.55
            px, py = c.x - dy / L * off * side, c.y + dx / L * off * side
            pt = Point(px, py)
            if B.contains(pt) and sidewalk_g.buffer(0.05).contains(pt) and not mapped_lamps.contains(pt) and not FOOT.buffer(0.6).contains(pt):
                props.append({'k': 'lamp', 'x': r2(px), 'y': r2(py), 'a': r2(math.atan2(dy, dx) - math.pi / 2 * side), 'gen': 1})
    # Gravestones in cemeteries.
    cem = layer_geom.get('cemetery')
    if cem is not None and not cem.is_empty:
        for x, y in scatter(cem.buffer(-2).difference(clear), 3.2, rng):
            if rng.random() < 0.55:
                props.append({'k': 'grave', 'x': r2(x), 'y': r2(y), 'a': 0.0})
    say(f'  {len(props)} street props ({sum(1 for p in props if p["k"] == "lamp")} lamps)')

    # ---------------------------------------------------------------- landmarks, places, streets
    landmarks = []
    for v, b in zip(vol_info, buildings):
        t = v['tags']
        name = t.get('name') or t.get('name:en')
        important = v['kind'] in LANDMARK_KINDS or any(k in t for k in LANDMARK_TAGS) or t.get('amenity') in ('place_of_worship', 'townhall', 'theatre', 'library')
        if name and (important or v['poly'].area > 1500):
            c = v['poly'].centroid
            lat, lon = proj.latlon(c.x, c.y)
            landmarks.append({'id': v['id'], 'name': name, 'kind': v['kind'], 'x': r2(c.x), 'y': r2(c.y), 'lat': round(lat, 6), 'lon': round(lon, 6),
                              'h': r2(v['h']), 'area': round(v['poly'].area), 'tags': {k: t[k] for k in t if k in ('building', 'amenity', 'historic', 'tourism', 'wikipedia', 'wikidata', 'start_date', 'architect')}})
            b['landmark'] = True
            b['name'] = name
    for el, t, g in osm.areas(lambda t: t.get('name') and (t.get('place') == 'square' or t.get('leisure') == 'park' or t.get('historic') in ('castle', 'fort', 'city_wall'))):
        c = g.representative_point()
        if B.contains(c):
            lat, lon = proj.latlon(c.x, c.y)
            landmarks.append({'id': f'{el["type"][0]}{el["id"]}', 'name': t['name'], 'kind': t.get('place') or t.get('leisure') or t.get('historic'),
                              'x': r2(c.x), 'y': r2(c.y), 'lat': round(lat, 6), 'lon': round(lon, 6), 'area': round(g.area)})
    places = []
    for el in osm.nodes:
        t = el.get('tags', {})
        if t.get('place') and t.get('name'):
            x, y = osm.point(el)
            if B.buffer(-30).contains(Point(x, y)):
                places.append({'name': t['name'], 'kind': t['place'], 'x': r2(x), 'y': r2(y)})
    for el, t, g in osm.areas(lambda t: t.get('name') and (t.get('natural') in ('water', 'bay') or t.get('water') or t.get('waterway') == 'riverbank')):
        c = g.intersection(B).representative_point() if g.intersects(B) else None
        if c is not None and not c.is_empty and water.contains(c):
            places.append({'name': t['name'], 'kind': 'water', 'x': r2(c.x), 'y': r2(c.y)})
    lengths = defaultdict(float)
    for r in roads_out:
        if r['name'] and r['kind'] in CAR_WIDTH:
            lengths[r['name']] += LineString(r['p']).intersection(B).length
    streets = [n for n, _ in sorted(lengths.items(), key=lambda kv: -kv[1])][:40]

    # ---------------------------------------------------------------- terrain: building bases
    if terrain:
        for b in buildings:
            ring = b['footprint']['outer']
            d = terrain_at(terrain, [p[0] for p in ring], [p[1] for p in ring])
            lo, hi = float(min(d)), float(max(d))
            # A little above the lowest corner: the downhill side gets a visible foundation, the uphill
            # side sits a little in the slope (like a house with a souterrain).
            b['base'], b['base_min'] = r2(lo + 0.55 * (hi - lo)), r2(lo)
        rail_lines = [shapely.segmentize(g, TSTEP) for g in rails]
        tram_lines = [shapely.segmentize(g, TSTEP) for g in tram]
        say(f'  terrain: {terrain["low"]:.1f}–{terrain["high"]:.1f} m over the ground at the water'
            + (f', {len(terrain["water_bodies"])} raised water surfaces' if terrain['water_bodies'] else ''))
    else:
        rail_lines, tram_lines = rails, tram

    # ---------------------------------------------------------------- write
    out = {
        'version': 1, 'place': place, 'half': half, 'cell': CELL, 'water_z': STYLE['water_z'],
        'surfaces': out_layers, 'curbs': curbs, 'shore': shore, 'bridge_edges': bridge_edges,
        'bridge_spans': bridge_spans, 'bridge_style': defaults.get('bridges') or {},
        'buildings': buildings, 'walls': walls, 'trees': trees + garden_trees, 'props': props, 'barriers': barriers,
        'rails': [[[r2(x), r2(y)] for x, y in g.intersection(B).coords] for g in rail_lines if g.intersection(B).geom_type == 'LineString'],
        'trams': [[[r2(x), r2(y)] for x, y in g.intersection(B).coords] for g in tram_lines if g.intersection(B).geom_type == 'LineString'],
        'terrain': terrain_out(terrain), 'water_bodies': terrain['water_bodies'] if terrain else [],
        'outskirts': terrain['outskirts'] if terrain else {},
        'roads': [r for r in roads_out if LineString(r['p']).intersects(B)],
        # Canal and river centre lines, for boats that find their way (Venice's water taxis and gondolas).
        'waterways': [{'id': f'w{el["id"]}', 'name': t.get('name', ''), 'kind': t['waterway'], 'w': num(t.get('width')) or {'river': 14, 'canal': 9}.get(t['waterway'], 9),
                       'p': [[r2(x), r2(y)] for x, y in part.coords]}
                      for el, t, g in osm.lines(lambda t: t.get('waterway') in ('canal', 'river') and not t.get('tunnel'))
                      for part in (lambda c: c.geoms if hasattr(c, 'geoms') else [c])(g.intersection(B)) if part.geom_type == 'LineString' and part.length > 5],
        'footprints': [ring_list(q.exterior) for q in footprints] + [w['poly'] for w in walls if w['kind'] == 'city_wall'] + [container_ring(c) for c in barriers],
        'land': [{'outer': ring_list(p.exterior), 'holes': [ring_list(h) for h in p.interiors]} for p in clean(land, 20)],
        'areas': {k: [{'outer': ring_list(p.exterior), 'holes': [ring_list(h) for h in p.interiors]} for p in clean(g.simplify(0.8), 25)]
                  for k, g in layer_geom.items() if k in ('park', 'grass', 'cemetery', 'forest', 'pitch', 'asphalt', 'cobble', 'paving', 'path', 'sidewalk', 'parking')},
        'landmarks': sorted(landmarks, key=lambda l: -l.get('area', 0)), 'places': places, 'streets': streets,
        'stats': {'buildings': len(buildings), 'roads': len(roads_out), 'trees': len(trees), 'props': len(props), 'walls': len(walls),
                  'landmarks': len(landmarks), 'layers_m2': stats_layers, 'land_m2': round(land.area), 'water_m2': round(water.area)},
    }
    path = folder / 'city.json'
    write_json(path, out, compact=True)
    say(f'Saved cities/{args.slug}/city.json ({path.stat().st_size / 1e6:.1f} MB). Landmarks: ' +
        (', '.join(l['name'] for l in out['landmarks'][:8]) or 'none named'))
    step_done(args.slug, 'prepare', **out['stats'])


# ------------------------------------------------------------------------------------------ geometry
def ring_list(ring):
    return [[r2(x), r2(y)] for x, y in list(ring.coords)[:-1]]


def container_ring(c):
    ca, sa = math.cos(c['a']), math.sin(c['a'])
    hl, hw = c['l'] / 2, c['w'] / 2
    return [[r2(c['x'] + u * ca - w * sa), r2(c['y'] + u * sa + w * ca)] for u, w in ((-hl, -hw), (hl, -hw), (hl, hw), (-hl, hw))]


def cell_of(pt):
    return [math.floor(pt.x / CELL), math.floor(pt.y / CELL)]


def reach_land(p, q, land, beyond=6.0):
    """The point where the line from q through p reaches the land at or beyond p (at most `beyond` metres on),
    or None."""
    L = p.distance(q)
    ux, uy = (p.x - q.x) / L, (p.y - q.y) / L
    for k in range(int(beyond / 0.25) + 1):
        t = Point(p.x + ux * 0.25 * k, p.y + uy * 0.25 * k)
        if land.distance(t) <= 0.3:
            return t
    return None


def merge_spans(spans):
    """One bridge mapped as two ways is one span: two crossings in a line (the halves of a bridge, or two crossings
    over a sliver of land between them), or two side by side (a wide bridge mapped as two walkways)."""
    def geo(s):
        (ax, ay), (bx, by) = s['a'], s['b']
        L = math.dist((ax, ay), (bx, by))
        return (ax, ay), (bx, by), L, ((bx - ax) / L, (by - ay) / L), ((ax + bx) / 2, (ay + by) / 2)
    spans = list(spans)
    changed = True
    while changed:
        changed = False
        for i in range(len(spans)):
            for j in range(i + 1, len(spans)):
                (a1, b1, L1, u1, m1), (a2, b2, L2, u2, m2) = geo(spans[i]), geo(spans[j])
                cos, new = u1[0] * u2[0] + u1[1] * u2[1], None
                off = lambda p: abs(-(p[0] - a1[0]) * u1[1] + (p[1] - a1[1]) * u1[0])      # across span i's line
                at = lambda p: (p[0] - a1[0]) * u1[0] + (p[1] - a1[1]) * u1[1]              # along it
                if abs(cos) > 0.94 and off(a2) < 1.2 and off(b2) < 1.2 and \
                        min(at(a2), at(b2)) <= L1 + 0.6 and max(at(a2), at(b2)) >= -0.6:   # in a line, touching: their whole extent
                    lo, hi = min(0.0, at(a2), at(b2)), max(L1, at(a2), at(b2))
                    new = {'a': [r2(a1[0] + u1[0] * lo), r2(a1[1] + u1[1] * lo)], 'b': [r2(a1[0] + u1[0] * hi), r2(a1[1] + u1[1] * hi)],
                           'w': max(spans[i]['w'], spans[j]['w'])}
                elif abs(cos) > 0.98:                 # side by side: one wider span between them
                    vx, vy = m2[0] - m1[0], m2[1] - m1[1]
                    across = abs(-vx * u1[1] + vy * u1[0])
                    if abs(vx * u1[0] + vy * u1[1]) < (L1 + L2) / 4 and across < (spans[i]['w'] + spans[j]['w']) / 2 + 1.0:
                        mx, my, h = (m1[0] + m2[0]) / 2, (m1[1] + m2[1]) / 2, max(L1, L2) / 2
                        new = {'a': [r2(mx - u1[0] * h), r2(my - u1[1] * h)], 'b': [r2(mx + u1[0] * h), r2(my + u1[1] * h)],
                               'w': round(across + (spans[i]['w'] + spans[j]['w']) / 2, 2)}
                if new:
                    spans = [s for k, s in enumerate(spans) if k not in (i, j)] + [new]
                    changed = True
                    break
            if changed:
                break
    return spans


def triangulate_cells(g, z, half, sub=None):
    """Triangulate a ground layer per 60 m cell; with `sub` every cell is cut into sub×sub squares first
    (so the ground can follow the terrain). Whole squares become two triangles."""
    out = []
    n0, n1 = math.floor(-half / CELL), math.floor(half / CELL)
    k = int(round(CELL / sub)) if sub else 0
    shapely.prepare(g)
    for i in range(n0, n1 + 1):
        for j in range(n0, n1 + 1):
            c = box(i * CELL, j * CELL, (i + 1) * CELL, (j + 1) * CELL)
            if not c.intersects(g):
                continue
            part = g.intersection(c)
            m = Buf()
            if k:
                a = np.arange(k)
                xa = np.repeat(i * CELL + a * sub, k)
                ya = np.tile(j * CELL + a * sub, k)
                cells = shapely.box(xa, ya, xa + sub, ya + sub)
                for sq, piece in zip(cells, shapely.intersection(part, cells)):
                    if piece.is_empty or piece.area < 0.01:
                        continue
                    if abs(piece.area - sub * sub) < 1e-6 * sub * sub:
                        x0, y0, x1, y1 = sq.bounds
                        m.quad((x0, y0, z), (x1, y0, z), (x1, y1, z), (x0, y1, z),
                               (x0 / 4, y0 / 4), (x1 / 4, y0 / 4), (x1 / 4, y1 / 4), (x0 / 4, y1 / 4))
                    else:
                        m.polygon(piece, z)
            else:
                m.polygon(part, z)
            if m:
                out.append({'cell': [i, j], **m.dump()})
    return out


def densify(segs, step):
    """Split [x0,y0,x1,y1] segments into pieces no longer than `step`."""
    out = []
    for x0, y0, x1, y1 in segs:
        n = max(1, math.ceil(math.hypot(x1 - x0, y1 - y0) / step))
        for k in range(n):
            out.append([r2(x0 + (x1 - x0) * k / n), r2(y0 + (y1 - y0) * k / n), r2(x0 + (x1 - x0) * (k + 1) / n), r2(y0 + (y1 - y0) * (k + 1) / n)])
    return out


# ------------------------------------------------------------------------------------------ terrain
def _bilinear(a, fy, fx):
    fy = np.clip(fy, 0, a.shape[0] - 1.000001)
    fx = np.clip(fx, 0, a.shape[1] - 1.000001)
    y0, x0 = np.floor(fy).astype(int), np.floor(fx).astype(int)
    ty, tx = fy - y0, fx - x0
    return ((a[y0, x0] * (1 - tx) + a[y0, x0 + 1] * tx) * (1 - ty) + (a[y0 + 1, x0] * (1 - tx) + a[y0 + 1, x0 + 1] * tx) * ty)


def _fill(a, iters=500):
    """Fill NaN cells smoothly from their surroundings (nearest growth, then Laplace relaxation)."""
    hole = np.isnan(a)
    if not hole.any() or hole.all():
        return np.nan_to_num(a)
    b = a.copy()
    while np.isnan(b).any():
        p = np.pad(b, 1, constant_values=np.nan)
        nb = np.stack([p[:-2, 1:-1], p[2:, 1:-1], p[1:-1, :-2], p[1:-1, 2:]])
        cnt = (~np.isnan(nb)).sum(0)
        grow = np.isnan(b) & (cnt > 0)
        b[grow] = np.nansum(nb, 0)[grow] / cnt[grow]
    for _ in range(iters):
        p = np.pad(b, 1, mode='edge')
        b[hole] = ((p[:-2, 1:-1] + p[2:, 1:-1] + p[1:-1, :-2] + p[1:-1, 2:]) / 4)[hole]
    return b


def _window(a, r, fn):
    from numpy.lib.stride_tricks import sliding_window_view
    yy, xx = np.mgrid[-r:r + 1, -r:r + 1]
    disk = (yy * yy + xx * xx) <= r * r + 0.5
    w = sliding_window_view(np.pad(a, r, mode='edge'), (2 * r + 1, 2 * r + 1))
    return fn(w[..., disk], axis=-1)


def _blur(a, sigma):
    r = max(1, int(3 * sigma))
    k = np.exp(-0.5 * (np.arange(-r, r + 1) / sigma) ** 2)
    k /= k.sum()
    for axis in (0, 1):
        p = np.pad(a, [(r, r) if ax == axis else (0, 0) for ax in (0, 1)], mode='edge')
        a = sum(k[i] * (p[i:i + a.shape[0], :] if axis == 0 else p[:, i:i + a.shape[1]]) for i in range(2 * r + 1))
    return a


def load_terrain(folder, proj, half, B, land, water, foot, forest, defaults):
    """Ground heights on a TSTEP grid round the play area, in metres over the flat city's ground level
    (0 = 1.2 m above the main water, like the flat city). None when there is no terrain.json."""
    path = folder / 'terrain.json'
    if defaults.get('terrain') is False or not path.exists():
        return None
    src = json.loads(path.read_text())
    ext = half + TERRAIN_MARGIN
    n = int(round(2 * ext / TSTEP)) + 1
    xs = -ext + np.arange(n) * TSTEP
    X, Y = np.meshgrid(xs, xs)                                   # row = y (south → north), column = x
    if src.get('frame') == 'local':                              # a grid in the city's own plane
        Z = np.array(src['z'], dtype=float).reshape(src['n'], src['n'])
        dsm = _bilinear(Z, (Y - src['y0']) / src['step'], (X - src['x0']) / src['step'])
    else:                                                        # older files: a lat/lon grid
        Z = np.array(src['z'], dtype=float).reshape(src['rows'], src['cols'])
        lat = proj.lat0 + xs / EARTH
        lon = proj.lon0 + xs / proj.kx
        dsm = _bilinear(Z, ((src['lat0'] - lat) / src['dlat'])[:, None] + 0 * xs[None, :], ((lon - src['lon0']) / src['dlon'])[None, :] + 0 * xs[:, None])
    ground_model = src.get('kind') == 'dtm'                      # Lantmäteriet: already bare ground

    def inside(g):
        return shapely.contains_xy(g, X, Y) if g is not None and not g.is_empty else np.zeros(X.shape, bool)
    in_b = inside(B.buffer(0.1))
    wet = inside(water)
    lake = float(np.median(dsm[wet])) if wet.sum() > 20 else None
    if lake is not None:                                         # the same water beyond the play area
        wet |= ~in_b & (np.abs(dsm - lake) < 0.4)
    # The source is a surface model: cut out mapped buildings and forests and fill them from the open
    # ground round them; an opening (min, then max, over ~75 m) removes unmapped houses and garden
    # trees; a blur smooths the 30 m source grid.
    # A ground model (Lantmäteriet's laser-scanned DTM) only gets a light blur against 1 m noise.
    if ground_model:
        g = _blur(dsm, 0.6)
    else:
        g = dsm.copy()
        g[(inside(foot.buffer(4.0)) | inside(forest.buffer(4.0))) & ~wet] = np.nan
        g = _fill(g)
        g = _window(_window(g, 5, np.min), 5, np.max)
        g = _blur(g, 2.0)
    if lake is None:
        d = g - float(np.percentile(g[in_b], 1))
    else:
        d = g - lake + STYLE['water_z']
    d *= float(defaults.get('terrain_scale', 1.0))
    # Water: the main water stays at the flat city's level; a river or pond higher up gets its own
    # level from its banks (and a water surface of its own in the Blender builder).
    bank = d.copy()
    bank[wet] = np.nan
    bank = _fill(bank, 200)
    d = np.maximum(d, 0.0)
    d[wet] = 0.0
    T = {'x0': float(xs[0]), 'y0': float(xs[0]), 'step': TSTEP, 'n': n, 'd': d}
    bodies = []
    raised = np.zeros(d.shape, bool)
    for p in polys(water):
        pts = []
        for ring in [p.exterior, *p.interiors]:
            ln = ring.difference(B.exterior.buffer(0.5))
            for part in (ln.geoms if hasattr(ln, 'geoms') else [ln]):
                if part.length > 0:
                    pts += [part.interpolate(t) for t in np.arange(0, part.length, 4.0)]
        if not pts:
            continue
        T['d'] = np.maximum(bank, 0.0)
        level = float(np.percentile(terrain_at(T, [q.x for q in pts], [q.y for q in pts]), 10))
        T['d'] = d
        if level < 0.5:
            continue
        cells = inside(p)
        d[cells] = level
        raised |= cells
        near = inside(p.buffer(12.0)) & ~cells
        d[near] = np.maximum(d[near], level + 0.3)
        m = Buf()
        m.polygon(p, STYLE['water_z'] + level, 8.0)
        bodies.append({'z': r2(STYLE['water_z'] + level), 'mesh': m.dump()})
    T['water_bodies'] = bodies
    # The smoothing spreads higher ground over the shoreline; let the last 25 m slope down to the
    # flat city's quay height so beaches meet the main water at a normal kerb.
    reach = 25.0
    dist = np.where(wet & ~raised, 0.0, np.inf)
    for _ in range(int(reach / TSTEP) + 2):
        p = np.pad(dist, 1, constant_values=np.inf)
        dist = np.minimum(dist, np.minimum.reduce([p[:-2, 1:-1], p[2:, 1:-1], p[1:-1, :-2], p[1:-1, 2:]]) + TSTEP)
    d[~raised] *= np.clip(dist / reach, 0.0, 1.0)[~raised]
    # The surroundings: 15 m squares out to the edge of the terrain, so the horizon has hills instead of
    # open water. A 30 m model can't tell forest from field, so flat low land becomes field and the
    # slopes and heights forest (what most Nordic towns have round them). A sustainable place leaves
    # them out: its horizon (pipeline/horizon.py) takes over at the play area's edge, on these same
    # heights, with OpenStreetMap's woods, homes and buildings – "defaults": {"outskirts": true} keeps them.
    gy, gx = np.gradient(d, TSTEP)
    flat = _blur(np.hypot(gx, gy), 2.0) < 0.035
    step = 15.0
    fields, woods = Buf(), Buf()
    k = int(round(2 * ext / step)) if defaults.get('outskirts') else 0
    for a in range(k):
        for c in range(k):
            x0, y0 = -ext + a * step, -ext + c * step
            if max(abs(x0 + step / 2), abs(y0 + step / 2)) < half:
                continue
            j, i = int(round((y0 + step / 2 - xs[0]) / TSTEP)), int(round((x0 + step / 2 - xs[0]) / TSTEP))
            if wet[j, i]:
                continue
            m = fields if (flat[j, i] and d[j, i] < 20.0) else woods
            m.quad((x0, y0, 0.0), (x0 + step, y0, 0.0), (x0 + step, y0 + step, 0.0), (x0, y0 + step, 0.0),
                   (x0 / 6, y0 / 6), ((x0 + step) / 6, y0 / 6), ((x0 + step) / 6, (y0 + step) / 6), (x0 / 6, (y0 + step) / 6))
    T['outskirts'] = {'field': fields.dump(), 'forest': woods.dump()} if k else {}
    T['low'], T['high'] = float(d[in_b].min()), float(d[in_b].max())
    T['source'], T['attribution'], T['lake'] = src.get('source'), src.get('attribution'), lake
    return T


def terrain_at(T, x, y):
    """Bilinear terrain height at local points (arrays or lists)."""
    x, y = np.asarray(x, float), np.asarray(y, float)
    return _bilinear(T['d'], (y - T['y0']) / T['step'], (x - T['x0']) / T['step'])


def terrain_out(T):
    if not T:
        return None
    return {'x0': T['x0'], 'y0': T['y0'], 'step': T['step'], 'n': T['n'], 'lake': T['lake'],
            'source': T['source'], 'attribution': T['attribution'],
            'd': [round(float(v), 2) for v in T['d'].ravel()]}


def edges_of(g, B, exclude=None):
    """All boundary segments of a polygon set as [x0,y0,x1,y1], oriented so the polygon is on the left."""
    segs = []
    edge = B.boundary.buffer(0.05)
    for p in polys(g):
        p = orient(p, 1.0)
        for ring in [p.exterior, *p.interiors]:
            cs = list(ring.coords)
            for a, b in zip(cs, cs[1:]):
                if math.dist(a, b) < 0.05:
                    continue
                mid = Point((a[0] + b[0]) / 2, (a[1] + b[1]) / 2)
                if edge.contains(mid) or (exclude is not None and not exclude.is_empty and exclude.buffer(0.1).contains(mid)):
                    continue
                segs.append([r2(a[0]), r2(a[1]), r2(b[0]), r2(b[1])])
    return segs


def scatter(g, step, rng):
    if g.is_empty:
        return []
    x0, y0, x1, y1 = g.bounds
    pts = []
    for i in range(int((x1 - x0) / step) + 1):
        for j in range(int((y1 - y0) / step) + 1):
            x = x0 + (i + 0.5 + rng.uniform(-0.38, 0.38)) * step
            y = y0 + (j + 0.5 + rng.uniform(-0.38, 0.38)) * step
            pts.append((x, y))
    if not pts:
        return []
    mask = shapely.contains_xy(g, [p[0] for p in pts], [p[1] for p in pts])
    return [p for p, m in zip(pts, mask) if m]


def nearest_edge_point(g, pt):
    if g is None or g.is_empty:
        return None
    from shapely.ops import nearest_points
    q = nearest_points(g, pt)[0]
    return q if q.distance(pt) < 12 else None


def wall_volume(m: Buf, poly, h):
    """Prism for a free-standing wall or hedge."""
    poly = orient(poly.simplify(0.05), 1.0)
    for ring in [poly.exterior, *poly.interiors]:
        cs = list(ring.coords)
        for a, b in zip(cs, cs[1:]):
            L = math.dist(a, b)
            if L < 0.02:
                continue
            m.quad((a[0], a[1], -0.2), (b[0], b[1], -0.2), (b[0], b[1], h), (a[0], a[1], h), (0, -0.05), (L / 3, -0.05), (L / 3, h / 3), (0, h / 3))
    m.polygon(poly, h, 3.0)


# ------------------------------------------------------------------------------------------ buildings
def make_building(v, vol_info, vtree, passage, preset, country):
    t, p, vid, kind = v['tags'], v['poly'], v['id'], v['kind']
    p = orient(p.simplify(0.08, preserve_topology=True), 1.0)
    H, z0, levels = v['h'], v['min_h'], v['levels']
    area = p.area
    house = kind in HOUSE_KINDS or (kind == 'yes' and area < 160 and levels <= 2)

    # ---- appearance
    wall_rgb = colour(t.get('building:colour') or t.get('colour'))
    material = (t.get('building:material') or t.get('building:facade:material') or '').lower()
    style = {'brick': 'brick', 'wood': 'wood', 'timber_framing': 'wood', 'stone': 'stone', 'sandstone': 'stone', 'limestone': 'stone',
             'concrete': 'concrete', 'glass': 'glass', 'metal': 'metal', 'plaster': 'plaster', 'render': 'plaster', 'cement_block': 'concrete'}.get(material)
    if v['ov'].get('style') in STYLE['wall_styles']:
        style = v['ov']['style']
    if not style:
        if kind in ('industrial', 'warehouse', 'manufacture', 'hangar', 'factory', 'garages', 'garage', 'shed', 'carport') and (area > 300 or kind in ('garages', 'carport')):
            style = 'metal' if h01(vid, 'ind') < 0.6 else 'concrete'
        elif kind in ('office', 'commercial') and levels >= 5:
            style = 'glass' if h01(vid, 'glass') < 0.45 else 'concrete'
        elif kind in CHURCH_KINDS or kind in ('castle', 'fort', 'city_wall', 'tower'):
            style = 'stone' if h01(vid, 'st') < 0.5 else 'plaster'
        elif house:
            style = pick(preset['house'], (vid, 'style'))
        else:
            style = pick(preset['block'], (vid, 'style'))
        if levels >= 9 and style in ('wood',):
            style = 'concrete'
    palette = STYLE['wall_styles'][style]['colours']                     # random picks stay in this set
    if v['ov'].get('colour') in {**palette, **STYLE['wall_styles'][style].get('extra_colours', {})}:
        wall_col = v['ov']['colour']
    elif wall_rgb:
        wall_col = nearest_key(wall_rgb, palette)
    elif style == 'wood' and preset.get('wood_colours'):
        wall_col = pick(preset['wood_colours'], (vid, 'wc'))
    elif kind in CHURCH_KINDS and style == 'plaster':
        wall_col = 'white' if h01(vid, 'cw') < 0.6 else 'ivory'
    elif preset.get('colours', {}).get(style):
        wall_col = pick(preset['colours'][style], (vid, 'col'))
    else:
        wall_col = sorted(palette)[int(h01(vid, 'col') * len(palette))]

    shape = (t.get('roof:shape') or '').lower()
    shape = {'gabled': 'gabled', 'half-hipped': 'hipped', 'saltbox': 'gabled', 'gambrel': 'gabled', 'mansard': 'hipped', 'hipped': 'hipped',
             'side_hipped': 'hipped', 'pyramidal': 'pyramidal', 'dome': 'pyramidal', 'onion': 'pyramidal', 'cone': 'pyramidal',
             'round': 'gabled', 'skillion': 'flat', 'flat': 'flat', 'quadruple_saltbox': 'hipped', 'crosspitched': 'hipped'}.get(shape, '')
    if v['ov'].get('roof') in ('flat', 'gabled', 'hipped', 'pyramidal'):
        shape = v['ov']['roof']
    if not shape:
        pitched_ok = (house or (levels <= 5 and area < preset.get('pitched_area', 900) and kind not in ('industrial', 'warehouse', 'retail', 'supermarket', 'commercial', 'office')))
        if kind in SMALL_KINDS and kind not in ('kiosk',):
            shape = 'flat' if h01(vid, 'sh') < 0.6 else 'gabled'
        elif kind in CHURCH_KINDS:
            shape = 'gabled'
        elif pitched_ok and style not in ('glass', 'metal', 'concrete'):
            shape = 'gabled' if h01(vid, 'roof') < (0.7 if house else 0.5) else 'hipped'
        else:
            shape = 'flat'
    roof_rgb = colour(t.get('roof:colour'))
    roof_mat = (t.get('roof:material') or '').lower()
    if shape == 'flat':
        roof_style, roof_col = 'flat', 'tar' if h01(vid, 'fr') < 0.6 else 'gravel'
    else:
        roof_style = {'roof_tiles': 'tiles', 'tile': 'tiles', 'tiles': 'tiles', 'clay': 'tiles', 'metal': 'metal', 'copper': 'metal', 'tin': 'metal',
                      'slate': 'slate', 'eternit': 'slate', 'asbestos': 'slate', 'concrete': 'slate', 'tar_paper': 'slate'}.get(roof_mat) or pick(preset['roof'], (vid, 'rs'))
        if v['ov'].get('roof_style') in ('tiles', 'metal', 'slate'):
            roof_style = v['ov']['roof_style']
        rpal = STYLE['roof_styles'][roof_style]['colours']
        if v['ov'].get('roof_colour') in {**rpal, **STYLE['roof_styles'][roof_style].get('extra_colours', {})}:
            roof_col = v['ov']['roof_colour']
        elif roof_mat == 'copper':
            roof_col = 'copper'
        elif roof_rgb:
            roof_col = nearest_key(roof_rgb, rpal)
        elif preset.get('roof_colours', {}).get(roof_style):
            roof_col = pick(preset['roof_colours'][roof_style], (vid, 'rc'))
        else:
            roof_col = sorted(rpal)[int(h01(vid, 'rc') * len(rpal))]
    if kind in CHURCH_KINDS and roof_style == 'metal' and h01(vid, 'cu') < 0.5:
        roof_col = 'copper'

    bay = STYLE['wall_styles'][style]['bay']
    parts = {k: Buf() for k in ('upper', 'ground', 'blank', 'roof', 'flat')}

    # ---- the roof first: it decides how high the walls go and adds gable triangles
    pitch = 1.0 if kind in CHURCH_KINDS else (0.72 if house else 0.6)
    rects = []
    if shape != 'flat':
        rects = rect_cover(p)
        if not rects or sum(r['L'] * r['W'] for r in rects) < 0.68 * area:
            rects = []
            shape = 'flat'
            roof_style, roof_col = 'flat', 'tar'
    parapet = shape == 'flat' and area > 45 and H - z0 > 4.5 and kind not in SMALL_KINDS
    top = H + (0.6 if parapet else 0)

    # ---- walls
    others = [vol_info[i] for i in vtree.query(p.buffer(0.6))] if vtree is not None else []
    others = [o for o in others if o['id'] != vid]
    shop = (not house) and levels >= 2 and kind not in ('industrial', 'warehouse', 'church', 'cathedral', 'chapel', 'school', 'hospital')
    if 'shopfront' in v['ov']:
        shop = bool(v['ov']['shopfront'])
    g_h = min(STYLE['ground_storey_m'], max(2.8, (H - z0) / levels * 1.15), H - z0) if shop else 0
    passage_cut = p.intersection(passage) if (not passage.is_empty and p.intersects(passage) and z0 < 1) else None
    ph = min(4.2, H * 0.55)
    if passage_cut is not None and passage_cut.area > 2:
        base = p.difference(passage_cut)
        emit_walls(parts, base, z0, H, top, levels, g_h, bay, others, vid)
        for q in clean(passage_cut, 1.0):
            emit_walls(parts, orient(q, 1.0), ph, H, top, max(1, levels - 1), 0, bay, others + [{'poly': base, 'h': H, 'min_h': 0, 'id': '_'}], vid)
            parts['blank'].polygon(q, ph, bay, down=True)
    else:
        emit_walls(parts, p, z0, H, top, levels, g_h, bay, others, vid)
    if z0 > 0.5:
        parts['blank'].polygon(p, z0, bay, down=True)

    # ---- roofs
    if shape == 'flat':
        flat_roof(parts, p, H, parapet)
    else:
        covered = unary_union([r['poly'] for r in rects])
        for r in rects:
            pitched_roof(parts, r, H, shape, pitch, 6.5 if kind not in CHURCH_KINDS else 14, v['roof_h'])
        rest = p.difference(covered.buffer(0.05))
        for q in clean(rest, 0.5):
            parts['flat'].polygon(q, H - 0.02)

    # ---- chimneys: Venice's funnel-topped camini on its pitched roofs (preset "chimneys": "venetian")
    if preset.get('chimneys') == 'venetian' and rects and kind not in CHURCH_KINDS and kind not in SMALL_KINDS and area > 40:
        ring = list(p.exterior.coords)
        perim = p.exterior.length
        for k in range(min(4, 1 + int(area / 160))):
            pt = p.exterior.interpolate(perim * ((h01(vid, 'ch', k) + k * 0.37) % 1.0))
            c0 = p.centroid
            dx, dy = c0.x - pt.x, c0.y - pt.y
            d = math.hypot(dx, dy) or 1
            q = Point(pt.x + dx / d * 0.75, pt.y + dy / d * 0.75)
            if p.contains(q.buffer(0.45)):
                venetian_chimney(parts['blank'], q.x, q.y, H - 0.3, H + 1.6 + 1.1 * h01(vid, 'chh', k), h01(vid, 'chk', k))

    # ---- church tower
    if kind in CHURCH_KINDS and area > 150 and rects and not v['ov'].get('no_tower'):
        church_tower(parts, rects[0], H, vid)

    c = p.centroid
    return {'id': vid, 'kind': kind, 'name': t.get('name', ''), 'style': style,
            'footprint': {'outer': ring_list(p.exterior), 'holes': [ring_list(h) for h in p.interiors]}, 'colour': wall_col, 'roof_style': roof_style, 'roof_colour': roof_col,
            'h': r2(H), 'levels': levels, 'cell': cell_of(c), 'landmark': False,
            'parts': {k: b.dump() for k, b in parts.items() if b}}


def venetian_chimney(buf, x, y, z0, z1, kind):
    """A Venetian camino: a square plastered stack and, on top, a funnel that flares out (a fumaiolo) or a
    bell (a campana), capped flat."""
    def box(s0, s1, za, zb, flare=0.0):
        a0, a1 = s0, s1 + flare
        pts0 = [(x - a0, y - a0), (x + a0, y - a0), (x + a0, y + a0), (x - a0, y + a0)]
        pts1 = [(x - a1, y - a1), (x + a1, y - a1), (x + a1, y + a1), (x - a1, y + a1)]
        for i in range(4):
            j = (i + 1) % 4
            buf.quad((*pts0[i], za), (*pts0[j], za), (*pts1[j], zb), (*pts1[i], zb), (0, za / 3), (0.4, za / 3), (0.4, zb / 3), (0, zb / 3))
        return pts1
    s = 0.27
    box(s, s, z0, z1)
    if kind < 0.6:                                  # a fumaiolo: an upturned funnel
        top = box(s, s, z1, z1 + 0.65, 0.33)
        zt = z1 + 0.65
    else:                                           # a campana: a bell that bulges and closes
        box(s, s, z1, z1 + 0.3, 0.2)
        box(s + 0.2, s + 0.2, z1 + 0.3, z1 + 0.6, -0.12)
        top = [(x - s - 0.08, y - s - 0.08), (x + s + 0.08, y - s - 0.08), (x + s + 0.08, y + s + 0.08), (x - s - 0.08, y + s + 0.08)]
        zt = z1 + 0.6
    buf.quad(*[(a, b, zt) for a, b in top], (0, 0), (0.4, 0), (0.4, 0.4), (0, 0.4))


def emit_walls(parts, p, z0, H, top, levels, g_h, bay, others, vid):
    storey = STYLE['storey_m']
    upper_rows = levels - (1 if g_h else 0)
    rings = [r for q in polys(p) for r in (orient(q, 1.0).exterior, *orient(q, 1.0).interiors)]
    for ring in rings:
        cs = list(ring.coords)
        for a, b in zip(cs, cs[1:]):
            L = math.dist(a, b)
            if L < 0.05:
                continue
            dx, dy = (b[0] - a[0]) / L, (b[1] - a[1]) / L
            nx, ny = dy, -dx  # outward (right of a counter-clockwise exterior)
            mx, my = (a[0] + b[0]) / 2 + nx * 0.35, (a[1] + b[1]) / 2 + ny * 0.35
            probe = Point(mx, my)
            # Party walls: hidden up to the neighbour's height, blank above it.
            covered_to = z0
            for o in others:
                if o['min_h'] <= z0 + 0.5 and o['poly'].contains(probe):
                    covered_to = max(covered_to, o['h'])
            lo = max(z0, min(covered_to, top))
            if lo >= top - 0.05:
                continue
            A0, B0 = (a[0], a[1]), (b[0], b[1])
            bw = bay
            party = covered_to > z0 + 0.5
            if party or L < 1.6:
                wall_quad(parts['blank'], A0, B0, lo - (0.25 if lo <= z0 else 0), top, 0, L / bw, None, storey)
                continue
            n = max(1, round(L / bw))
            zb = z0 - 0.25 if z0 < 0.5 else z0
            if g_h:
                wall_quad(parts['ground'], A0, B0, zb, z0 + g_h, 0, n, (zb - z0) / g_h, 1.0)
                if upper_rows > 0:
                    wall_quad(parts['upper'], A0, B0, z0 + g_h, H, 0, n, 0.0, float(upper_rows))
            else:
                rows = levels
                wall_quad(parts['upper'], A0, B0, zb, H, 0, n, (zb - z0) / ((H - z0) / rows), float(rows))
            if top > H:
                wall_quad(parts['blank'], A0, B0, H, top, 0, L / bw, H / storey, top / storey)


def wall_quad(buf, a, b, z0, z1, u0, u1, v0, v1):
    if z1 - z0 < 0.02:
        return
    if v0 is None:  # blank walls: metre-scaled like the facade textures
        v0, v1 = z0 / STYLE['storey_m'], z1 / STYLE['storey_m']
    buf.quad((a[0], a[1], z0), (b[0], b[1], z0), (b[0], b[1], z1), (a[0], a[1], z1), (u0, v0), (u1, v0), (u1, v1), (u0, v1))


def flat_roof(parts, p, H, parapet):
    if not parapet:
        parts['flat'].polygon(p, H)
        return
    inset = p.buffer(-0.3, join_style=2)
    if inset.is_empty or inset.area < 0.4 * p.area:
        parts['flat'].polygon(p, H + 0.6)
        return
    parts['flat'].polygon(inset, H)
    parts['flat'].polygon(p.difference(inset), H + 0.6, 2.0)
    for q in polys(inset):
        q = orient(q, 1.0)
        for ring in [q.exterior, *q.interiors]:
            cs = list(ring.coords)
            for a, b in zip(cs, cs[1:]):
                if math.dist(a, b) < 0.05:
                    continue
                # Inner face of the parapet looks inwards: reversed winding.
                wall_quad(parts['blank'], (b[0], b[1]), (a[0], a[1]), H, H + 0.6, 0, math.dist(a, b) / 3.2, None, None)


def rect_cover(p):
    """Cover a footprint with up to six oriented rectangles (main body, wings), each gets a pitched roof."""
    ring = list(p.exterior.coords)
    e = max(zip(ring, ring[1:]), key=lambda ab: math.dist(*ab))
    ang = math.atan2(e[1][1] - e[0][1], e[1][0] - e[0][0])
    c = p.centroid
    q = affinity.rotate(affinity.translate(p, -c.x, -c.y), -ang, origin=(0, 0), use_radians=True)
    q = q.simplify(0.25)

    def cluster(vals, tol=0.7):
        vals = sorted(vals)
        out = [vals[0]]
        for v in vals[1:]:
            if v - out[-1] > tol:
                out.append(v)
            else:
                out[-1] = (out[-1] + v) / 2
        return out

    coords = [xy for r in [q.exterior, *q.interiors] for xy in r.coords]
    xs, ys = cluster([x for x, _ in coords]), cluster([y for _, y in coords])
    xs[0], xs[-1] = min(x for x, _ in coords), max(x for x, _ in coords)
    ys[0], ys[-1] = min(y for _, y in coords), max(y for _, y in coords)
    rects = []
    if len(xs) > 16 or len(ys) > 16 or len(xs) < 2 or len(ys) < 2:
        mrr = q.minimum_rotated_rectangle
        if q.area / max(mrr.area, 1e-6) > 0.82:
            rects.append(mrr)
    else:
        nx, ny = len(xs) - 1, len(ys) - 1
        inside = [[q.intersection(box(xs[i], ys[j], xs[i + 1], ys[j + 1])).area >= 0.72 * (xs[i + 1] - xs[i]) * (ys[j + 1] - ys[j]) for j in range(ny)] for i in range(nx)]
        for _ in range(6):
            best, best_a = None, 0
            for i0 in range(nx):
                for i1 in range(i0, nx):
                    for j0 in range(ny):
                        ok_j = j0
                        for j1 in range(j0, ny):
                            if all(inside[i][j1] for i in range(i0, i1 + 1)):
                                a = (xs[i1 + 1] - xs[i0]) * (ys[j1 + 1] - ys[j0])
                                if a > best_a:
                                    best, best_a = (i0, i1, j0, j1), a
                            else:
                                break
            if best is None or best_a < 14:
                break
            i0, i1, j0, j1 = best
            if min(xs[i1 + 1] - xs[i0], ys[j1 + 1] - ys[j0]) >= 2.6:
                rects.append(box(xs[i0], ys[j0], xs[i1 + 1], ys[j1 + 1]))
            for i in range(i0, i1 + 1):
                for j in range(j0, j1 + 1):
                    inside[i][j] = False
    out = []
    for r in rects:
        r = r.intersection(q.envelope)
        wr = affinity.translate(affinity.rotate(r, ang, origin=(0, 0), use_radians=True), c.x, c.y)
        rc = list(orient(wr, 1.0).exterior.coords)[:4]
        e0, e1 = math.dist(rc[0], rc[1]), math.dist(rc[1], rc[2])
        if e0 >= e1:
            axis = math.atan2(rc[1][1] - rc[0][1], rc[1][0] - rc[0][0])
            L, W = e0, e1
        else:
            axis = math.atan2(rc[2][1] - rc[1][1], rc[2][0] - rc[1][0])
            L, W = e1, e0
        cc = wr.centroid
        out.append({'cx': cc.x, 'cy': cc.y, 'a': axis, 'L': L, 'W': W, 'poly': wr})
    return out


def pitched_roof(parts, r, H, shape, pitch, max_rise, roof_h):
    cx, cy, a, L, W = r['cx'], r['cy'], r['a'], r['L'], r['W']
    ca, sa = math.cos(a), math.sin(a)
    rise = roof_h or min(W / 2 * pitch, max_rise)
    o = 0.35
    drop = o * rise / (W / 2)

    def P(u, w, z):
        return (cx + u * ca - w * sa, cy + u * sa + w * ca, z)

    eave = H - drop
    hl, hw = L / 2, W / 2
    roof, gable = parts['roof'], parts['blank']
    if shape == 'pyramidal' or (shape == 'hipped' and L - W < 0.4):
        apex = P(0, 0, H + rise)
        corners = [P(-hl - o, -hw - o, eave), P(hl + o, -hw - o, eave), P(hl + o, hw + o, eave), P(-hl - o, hw + o, eave)]
        for i in range(4):
            roof.planar([corners[i], corners[(i + 1) % 4], apex])
    elif shape == 'hipped':
        r0, r1 = P(-hl + hw, 0, H + rise), P(hl - hw, 0, H + rise)
        c0, c1, c2, c3 = P(-hl - o, -hw - o, eave), P(hl + o, -hw - o, eave), P(hl + o, hw + o, eave), P(-hl - o, hw + o, eave)
        roof.planar([c0, c1, r1, r0])
        roof.planar([c2, c3, r0, r1])
        roof.planar([c1, c2, r1])
        roof.planar([c3, c0, r0])
    else:  # gabled
        og = 0.3
        e0, e1, e2, e3 = P(-hl - og, -hw - o, eave), P(hl + og, -hw - o, eave), P(hl + og, hw + o, eave), P(-hl - og, hw + o, eave)
        r0, r1 = P(-hl - og, 0, H + rise), P(hl + og, 0, H + rise)
        roof.planar([e0, e1, r1, r0])
        roof.planar([e2, e3, r0, r1])
        # Gable triangles in the wall plane, wall material.
        for sgn in (-1, 1):
            b0, b1, ap = P(sgn * hl, -sgn * hw, H), P(sgn * hl, sgn * hw, H), P(sgn * hl, 0, H + rise)
            gable.planar([b0, b1, ap], STYLE['storey_m'])
        # Thin fascia under the overhang so the roof reads as solid from the street.
        for sgn in (-1, 1):
            f0, f1 = P(-hl - og, sgn * (hw + o), eave), P(hl + og, sgn * (hw + o), eave)
            f2, f3 = P(hl + og, sgn * (hw + o), eave - 0.18), P(-hl - og, sgn * (hw + o), eave - 0.18)
            roof.planar([f3, f2, f1, f0] if sgn < 0 else [f0, f1, f2, f3])


def church_tower(parts, r, H, vid):
    cx, cy, a, L, W = r['cx'], r['cy'], r['a'], r['L'], r['W']
    ca, sa = math.cos(a), math.sin(a)
    # Put the tower at the western end of the nave (or the southern end of a north-south church).
    end = -1 if abs(ca) >= abs(sa) and ca > 0 or abs(ca) < abs(sa) and sa > 0 else 1
    side = max(4.5, min(W * 0.6, 9.5))
    u = end * (L / 2 - side / 2 + 0.6)
    tx, ty = cx + u * ca, cy + u * sa
    th = H * 1.9 + 4 + h01(vid, 'tw') * 6
    sq = affinity.rotate(box(tx - side / 2, ty - side / 2, tx + side / 2, ty + side / 2), a, origin=(tx, ty), use_radians=True)
    sq = orient(sq, 1.0)
    cs = list(sq.exterior.coords)
    for p0, p1 in zip(cs, cs[1:]):
        L0 = math.dist(p0, p1)
        nx, ny = (p1[1] - p0[1]) / L0 * 0.02, -(p1[0] - p0[0]) / L0 * 0.02
        wall_quad(parts['blank'], p0, p1, 0, th, 0, L0 / 3.4, None, None)
        # A belfry opening band near the top.
        wall_quad(parts['upper'], (p0[0] + nx, p0[1] + ny), (p1[0] + nx, p1[1] + ny), th - 3.4, th - 0.4, 0, 1, 0, 1)
    parts['flat'].polygon(sq, th)
    apex = (tx, ty, th + side * 2.4)
    corners = [(x, y, th) for x, y in cs[:4]]
    for i in range(4):
        parts['roof'].planar([corners[i], corners[(i + 1) % 4], apex])


if __name__ == '__main__':
    main()
