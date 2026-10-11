"""The horizon round a place: the real land out to ~10 km, its water, woods and homes, and the buildings
nearest the model – what the site draws beyond the 3D city (site/src/horizon.js).

    python3 sustainable.py horizon <slug> [--radius 10000] [--step 50] [--buildings 4000]

The horizon takes over where the 3D city's own ground ends (the play area, city.json `half`). Heights:
near the city the city's own ground (city.json `terrain`, from the terrain step) with the woods' canopy
on it; further out Copernicus GLO-30, a surface model that woods and towns already stand in. Lakes
above the main water keep their own level. Water, woods and homes: OpenStreetMap through Overpass
(ODbL). Writes to the pack: horizon.json and horizon-land.bin (signed distance to water ×2, Int16),
horizon-heights.bin (decimetres over the main water, Int16), horizon-landuse.bin (Uint8: 0 open,
1 woods, 2 homes, 3 a lake above the main water) and horizon-buildings.bin (Int16 ×7 per building, as
Kalmar's).
"""
from __future__ import annotations

import argparse
import json
import math
import time

import numpy as np
import shapely
from shapely.geometry import LineString, Polygon
from shapely.ops import linemerge, polygonize, unary_union

from common import EARTH, city_dir, load_place, say
from fetch_osm import overpass
from fetch_terrain import COPERNICUS_ATTRIBUTION, copernicus
from prepare_city import _bilinear, _blur

KIND = {'apartments': 1, 'residential': 1, 'dormitory': 1, 'hotel': 1, 'commercial': 2, 'industrial': 2, 'retail': 2, 'warehouse': 2,
        'school': 2, 'university': 2, 'hospital': 2, 'office': 2, 'public': 2, 'church': 2, 'sports_hall': 2, 'supermarket': 2,
        'garage': 3, 'garages': 3, 'shed': 3, 'carport': 3, 'greenhouse': 3, 'hut': 3, 'cabin': 3, 'roof': 3}
CANOPY = 14.0          # metres of woods over the ground where the heights are the city's bare ground


def smoothstep(a, b, x):
    t = np.clip((x - a) / (b - a), 0.0, 1.0)
    return t * t * (3 - 2 * t)


def label(mask):
    """The connected parts of a mask (4-neighbours): one id per part, -1 outside it."""
    big = mask.size
    cur = np.where(mask, np.arange(big).reshape(mask.shape), big)
    while True:
        p = np.pad(cur, 1, constant_values=big)
        nxt = np.where(mask, np.minimum.reduce([cur, p[:-2, 1:-1], p[2:, 1:-1], p[1:-1, :-2], p[1:-1, 2:]]), big)
        if (nxt == cur).all():
            return np.where(mask, cur, -1)
        cur = nxt


def main(argv=None):
    ap = argparse.ArgumentParser(prog='sustainable.py horizon')
    ap.add_argument('slug')
    ap.add_argument('--radius', type=float, default=10000)
    ap.add_argument('--step', type=float, default=50)
    ap.add_argument('--buildings', type=float, default=4000, help='radius for the distant buildings (m)')
    ap.add_argument('--refresh', action='store_true', help='ask OpenStreetMap again (the answers are kept in horizon-osm/)')
    args = ap.parse_args(argv)
    folder = city_dir(args.slug)
    place = load_place(args.slug)
    lat0, lon0 = place['center']
    kx = EARTH * math.cos(math.radians(lat0))
    to_xz = lambda lat, lon: ((lon - lon0) * kx, -(lat - lat0) * EARTH)          # the site's frame: x east, z south
    city = json.loads((folder / 'city.json').read_text())
    terrain = city.get('terrain') or {}
    lake = terrain.get('lake')
    # The 3D city's own ground: the play area (its streets, lawns and water plane; the terrain round it
    # is the horizon's).
    half = float(city['half'])
    model = {'x0': -half, 'x1': half, 'z0': -half, 'z1': half}
    R, S = args.radius, args.step
    n = int(2 * R / S) + 1
    xs = -R + np.arange(n) * S
    X, Z = np.meshgrid(xs, xs)                                                   # row = z (north → south)
    lat = lat0 - Z / EARTH
    lon = lon0 + X / kx
    say(f'Horizon for {place["name"]}: {2 * R / 1000:.0f} km square, {n}×{n} points of {S:.0f} m')

    # Heights (m over sea level); missing tiles are open sea.
    h, used = copernicus(lat, lon)
    h = np.where(np.isfinite(h), h, 0.0)
    level = lake if lake is not None else 0.0
    say(f'  heights {np.nanmin(h):.0f}–{np.nanmax(h):.0f} m ({len(used)} Copernicus tiles); main water at {level:.2f} m')

    # Water, woods and homes from OpenStreetMap. Overpass is often busy: each answer is kept in
    # horizon-osm/ (used again on the next run) and a failed question is asked again a little later.
    dlat, dlon = R / EARTH, R / kx
    bbox = f'{lat0 - dlat:.5f},{lon0 - dlon:.5f},{lat0 + dlat:.5f},{lon0 + dlon:.5f}'
    def ask(name, body, box, wait):
        f = folder / 'horizon-osm' / f'{name}-{box}.json'
        if f.exists() and not args.refresh:
            return json.loads(f.read_text())
        for attempt in range(3):
            if attempt:
                say(f'    asking again in {45 * attempt} s …')
                time.sleep(45 * attempt)
            els = overpass(body, box, wait=wait)
            if els is not None:
                f.parent.mkdir(exist_ok=True)
                f.write_text(json.dumps(els))
                return els
        return None
    def geoms(elements):
        out = []
        for el in elements or []:
            if el['type'] == 'way' and el.get('geometry') and len(el['geometry']) >= 4:
                pts = [to_xz(g['lat'], g['lon']) for g in el['geometry']]
                if pts[0] == pts[-1]:
                    poly = Polygon(pts)
                    if poly.is_valid or poly.buffer(0).is_valid:
                        out.append(poly if poly.is_valid else poly.buffer(0))
            elif el['type'] == 'relation':
                lines = {'outer': [], 'inner': []}
                for m in el.get('members', []):
                    if m.get('geometry') and m.get('role') in lines:
                        lines[m['role']].append(LineString([to_xz(g['lat'], g['lon']) for g in m['geometry']]))
                outer = list(polygonize(linemerge(lines['outer']))) if lines['outer'] else []
                inner = list(polygonize(linemerge(lines['inner']))) if lines['inner'] else []
                if outer:
                    g = unary_union(outer)
                    if inner:
                        g = g.difference(unary_union(inner))
                    out.append(g)
        return out
    say('  OpenStreetMap: water …')
    water_osm = ask('water', 'way["natural"="water"]; relation["natural"="water"]; way["waterway"="riverbank"]; relation["water"];', bbox, 180)
    water = geoms(water_osm)
    say('  OpenStreetMap: woods and homes …')
    woods = geoms(ask('woods', 'way["landuse"="forest"]; way["natural"="wood"]; relation["landuse"="forest"]; relation["natural"="wood"];', bbox, 180))
    homes = geoms(ask('homes', 'way["landuse"="residential"]; relation["landuse"="residential"];', bbox, 120))
    pts = shapely.points(X.ravel(), Z.ravel())
    def mask(polys):
        if not polys:
            return np.zeros(X.shape, bool)
        g = unary_union(polys)
        shapely.prepare(g)
        return shapely.contains(g, pts).reshape(X.shape)
    wet = mask(water) | (h <= 0.2)                                               # lakes and rivers, and the sea
    if water_osm is None:
        # Without OpenStreetMap's water: the surface model lies dead flat on lakes (Copernicus levels
        # its water bodies), so flat cells near the main water's level are taken for it.
        p = np.pad(h, 1, mode='edge')
        rough = np.max([np.abs(p[1 + a:p.shape[0] - 1 + a, 1 + b:p.shape[1] - 1 + b] - h) for a in (-1, 0, 1) for b in (-1, 0, 1)], axis=0)
        wet |= (np.abs(h - level) < 0.8) & (rough < 0.05)
        say(f'  no water from OpenStreetMap: {int(wet.sum() * S * S / 1e6)} km² taken from the heights (flat at the main water\'s level)')
    use = np.zeros(X.shape, np.uint8)
    use[mask(woods)] = 1
    use[mask(homes)] = 2
    use[wet] = 0
    # Lakes above the main water keep their own level (the surface model has them flat); the main water,
    # and whatever lies at its level, is the site's sea.
    lab = label(wet)
    raised = np.zeros(X.shape, bool)
    for k in np.unique(lab[wet]):
        cells = lab == k
        top = float(np.median(h[cells]))
        if top - level > 1.5:
            raised |= cells
            h[cells] = top
    use[raised] = 3
    # Near the city the ground is the city's own (bare ground, the terrain step's), so the horizon meets
    # the play area's edge at its height; the woods stand on it as a canopy, as they do in the surface
    # model further out, which it blends into before that terrain ends.
    if terrain.get('d'):
        nt, st = terrain['n'], terrain['step']
        fi, fj = (X - terrain['x0']) / st, (-Z - terrain['y0']) / st          # its rows run south → north
        inside = (fi >= 0) & (fi <= nt - 1) & (fj >= 0) & (fj <= nt - 1)
        ground = _bilinear(np.array(terrain['d'], float).reshape(nt, nt), fj, fi) - city.get('water_z', -1.2) + level
        beyond = np.maximum(np.maximum(np.abs(X), np.abs(Z)) - half, 0.0)      # metres out from the play area
        canopy = CANOPY * _blur((use == 1).astype(float), 0.8) * smoothstep(0, 60, beyond)
        w = np.where(inside, smoothstep(0, 200, np.minimum.reduce([fi, nt - 1 - fi, fj, nt - 1 - fj]) * st), 0.0)
        near = inside & ~raised
        h[near] = (w * (ground + canopy) + (1 - w) * h)[near]
        say(f'  the city\'s own ground out to {terrain["x0"] + (nt - 1) * st:.0f} m, blending into the surface model')

    # Signed distance to the shore (m): steps to the nearest water from land, to the nearest land from water.
    def steps(src):
        d = np.full(src.shape, 31, np.int16)
        d[src] = 0
        frontier = src.copy()
        for k in range(1, 31):
            g = frontier.copy()
            g[1:] |= frontier[:-1]; g[:-1] |= frontier[1:]; g[:, 1:] |= frontier[:, :-1]; g[:, :-1] |= frontier[:, 1:]
            d[g & (d == 31)] = k
            frontier = g
        return d
    dist = np.where(wet, -(steps(~wet) - .5) * S, (steps(wet) - .5) * S)
    field = np.clip(np.round(dist * 2), -32767, 32767).astype('<i2')
    heights = np.clip(np.round((h - level) * 10), -32767, 32767).astype('<i2')

    # Buildings beyond the model, nearest first, as oriented boxes.
    say('  OpenStreetMap: buildings …')
    bl = R if args.buildings >= R else args.buildings
    bbb = f'{lat0 - bl / EARTH:.5f},{lon0 - bl / kx:.5f},{lat0 + bl / EARTH:.5f},{lon0 + bl / kx:.5f}'
    blds = []
    for el in ask('buildings', 'way["building"];', bbb, 180) or []:
        g = el.get('geometry') or []
        if len(g) < 4:
            continue
        p = [to_xz(q['lat'], q['lon']) for q in g]
        cx, cz = sum(a for a, _ in p[:-1]) / (len(p) - 1), sum(b for _, b in p[:-1]) / (len(p) - 1)
        if model['x0'] < cx < model['x1'] and model['z0'] < cz < model['z1']:
            continue
        best, ang = 0, 0.0
        for i in range(1, len(p)):
            dx, dz = p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]
            if math.hypot(dx, dz) > best:
                best, ang = math.hypot(dx, dz), math.atan2(dz, dx)
        ux, uz = math.cos(ang), math.sin(ang)
        a = [(x - cx) * ux + (z - cz) * uz for x, z in p]
        b = [-(x - cx) * uz + (z - cz) * ux for x, z in p]
        w, d = max(a) - min(a), max(b) - min(b)
        if w * d < 18:
            continue
        ox = cx + ux * (max(a) + min(a)) / 2 - uz * (max(b) + min(b)) / 2
        oz = cz + uz * (max(a) + min(a)) / 2 + ux * (max(b) + min(b)) / 2
        t = el.get('tags', {})
        try:
            levels = float(t.get('building:levels', 'nan'))
        except ValueError:
            levels = float('nan')
        kind = KIND.get(t.get('building'), 2 if w * d > 900 else 0)
        if kind == 0 and w * d > 500:
            kind = 1
        hh = levels * 3 + (.6 if kind == 1 else 0) if math.isfinite(levels) else 12 if kind == 1 else (9 if w * d > 3000 else 7) if kind == 2 else 2.6 if kind == 3 else 6 if w * d > 160 else 4.8
        blds.append([round(ox * 2), round(oz * 2), min(32767, round(w * 4)), min(32767, round(d * 4)),
                     round(((ang % math.pi) + math.pi) % math.pi / (2 * math.pi) * 65536) - 32768, round(hh * 10), kind])
    pack = folder / 'pack'
    (pack / 'horizon-land.bin').write_bytes(field.tobytes())
    (pack / 'horizon-heights.bin').write_bytes(heights.tobytes())
    (pack / 'horizon-landuse.bin').write_bytes(use.tobytes())
    (pack / 'horizon-buildings.bin').write_bytes(np.array(blds, '<i2').tobytes() if blds else b'')
    grid = {'x0': float(xs[0]), 'z0': float(xs[0]), 'step': S, 'w': n, 'h': n}
    meta = {'source': '© OpenStreetMap contributors (ODbL), via the Overpass API; ' + COPERNICUS_ATTRIBUTION + '; pipeline/horizon.py',
            'land': {**grid, 'file': 'horizon-land.bin', 'encoding': 'Int16 little-endian, row by row from z0: signed distance to the shore in metres ×2, + on land'},
            'heights': {**grid, 'file': 'horizon-heights.bin', 'level': level, 'encoding': 'Int16: height over the main water in decimetres (a surface model)'},
            'landuse': {'file': 'horizon-landuse.bin', 'encoding': 'Uint8 on the land grid: 0 open land, 1 woods, 2 residential, 3 a lake above the main water'},
            'buildings': {'file': 'horizon-buildings.bin', 'count': len(blds), 'encoding': 'Int16 ×7 per building: x, z (½ m), width, depth (¼ m), heading (2π/65536 from −32768), wall height (dm), kind (0 house, 1 flats, 2 large, 3 small)'},
            'model': model}
    (pack / 'horizon.json').write_text(json.dumps(meta), encoding='utf-8')
    say(f'  {int(wet.sum() * S * S / 1e6)} km² water ({int(raised.sum() * S * S / 1e6)} km² in lakes above the main water), '
        f'{int((use == 1).sum() * S * S / 1e6)} km² woods, {len(blds)} buildings → pack/horizon*.bin')


if __name__ == '__main__':
    main()
