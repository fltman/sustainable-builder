"""List generated buildings for a refinement round, with Street View and OpenStreetMap links.

    python3 sustainable.py buildings visby --street "Strandgatan"
    python3 sustainable.py buildings visby --near "Stora torget" --radius 80
    python3 sustainable.py buildings visby --near 57.6405,18.2930 --json
    python3 sustainable.py buildings visby --id w123456

Each row shows what the generator guessed (levels, height, wall style/colour, roof). Compare with
Street View, then write corrections to cities/<slug>/overrides.json and run `rebuild`.
With --views it prints Blender street-camera specs along the street for `render`.
"""
from __future__ import annotations

import argparse
import json
import math

from shapely.geometry import LineString, Point, Polygon
from shapely.ops import nearest_points, unary_union

from common import city_dir, load_place, projection_for


def bearing(dx, dy):
    """Compass bearing (0 = north, clockwise) of a local vector (x east, y north)."""
    return round(math.degrees(math.atan2(dx, dy)) % 360, 1)


def main(argv=None):
    ap = argparse.ArgumentParser(prog='sustainable.py buildings')
    ap.add_argument('slug')
    ap.add_argument('--street')
    ap.add_argument('--near')
    ap.add_argument('--radius', type=float, default=70)
    ap.add_argument('--id')
    ap.add_argument('--name')
    ap.add_argument('--limit', type=int, default=40)
    ap.add_argument('--json', action='store_true')
    ap.add_argument('--views', action='store_true')
    args = ap.parse_args(argv)
    folder = city_dir(args.slug)
    place = load_place(args.slug)
    proj = projection_for(place)
    city = json.loads((folder / 'city.json').read_text())
    overrides = json.loads((folder / 'overrides.json').read_text()).get('buildings', {}) if (folder / 'overrides.json').exists() else {}
    custom = {p.stem for p in (folder / 'custom').glob('*.py')} if (folder / 'custom').exists() else set()

    roads = [r for r in city['roads'] if r['kind'] not in ('footway', 'path', 'steps', 'cycleway')]
    focus = None
    if args.street:
        sel = [LineString(r['p']) for r in city['roads'] if r['name'].lower() == args.street.lower()] or \
              [LineString(r['p']) for r in city['roads'] if args.street.lower() in r['name'].lower()]
        if not sel:
            names = sorted({r['name'] for r in city['roads'] if r['name']})
            raise SystemExit(f'No street called "{args.street}". Some names: {", ".join(names[:30])}')
        focus = unary_union(sel)
        area = focus.buffer(max(16, args.radius / 3))
    elif args.near:
        try:
            lat, lon = (float(v) for v in args.near.split(','))
            x, y = proj.xy(lat, lon)
        except ValueError:
            lm = next((l for l in city['landmarks'] if args.near.lower() in l['name'].lower()), None)
            if not lm:
                raise SystemExit(f'"{args.near}" is neither "lat,lon" nor a landmark. Landmarks: {", ".join(l["name"] for l in city["landmarks"][:25])}')
            x, y = lm['x'], lm['y']
        area = Point(x, y).buffer(args.radius)
    else:
        area = None

    road_lines = [LineString(r['p']) for r in (roads if focus is None else [])] or ([focus] if focus is not None else [])
    road_union = unary_union(road_lines) if road_lines else None
    rows = []
    for b in city['buildings']:
        if args.id and b['id'] != args.id:
            continue
        if args.name and args.name.lower() not in (b.get('name') or '').lower():
            continue
        fp = Polygon(b['footprint']['outer'])
        if area is not None and not area.intersects(fp):
            continue
        c = fp.centroid
        lat, lon = proj.latlon(c.x, c.y)
        view = None
        if road_union is not None:
            q = nearest_points(road_union, fp)[0]
            # Step back from the facade so the whole building fits the frame (Street View stays on the road).
            dx, dy = c.x - q.x, c.y - q.y
            dl = math.hypot(dx, dy) or 1
            back = max(0.0, min(40.0, b['h'] * 1.4) - fp.exterior.distance(q))
            cam = (q.x - dx / dl * back, q.y - dy / dl * back)
            vlat, vlon = proj.latlon(q.x, q.y)
            h = bearing(dx, dy)
            view = {'lat': round(vlat, 6), 'lon': round(vlon, 6), 'heading': h,
                    'streetview': f'https://www.google.com/maps/@?api=1&map_action=pano&viewpoint={vlat:.6f},{vlon:.6f}&heading={h:.0f}&pitch=8&fov=80',
                    'render': f'street:{cam[0]:.1f},{cam[1]:.1f},{h:.0f}'}
        osm_type = {'w': 'way', 'r': 'relation'}.get(b['id'][0], 'way')
        rows.append({'id': b['id'], 'name': b.get('name', ''), 'kind': b['kind'], 'levels': b['levels'], 'height_m': b['h'],
                     'style': b['style'], 'colour': b['colour'], 'roof': b['roof_style'] + '/' + b['roof_colour'],
                     'lat': round(lat, 6), 'lon': round(lon, 6), 'area_m2': round(fp.area),
                     'osm': f'https://www.openstreetmap.org/{osm_type}/{b["id"][1:].rstrip("r")}',
                     'override': overrides.get(b['id']), 'custom': b['id'] in custom, 'view': view,
                     '_d': (focus.distance(fp) if focus is not None else (c.distance(area.centroid) if area is not None else 0))})
    rows.sort(key=lambda r: (r['_d'], -r['area_m2']))
    rows = rows[:args.limit]
    if args.views:
        # Up to six evenly spread street cameras for `render --street`.
        step = max(1, len(rows) // 6)
        print(' '.join(r['view']['render'] for r in rows[::step][:6] if r['view']))
        return
    for r in rows:
        r.pop('_d')
    if args.json:
        print(json.dumps(rows, ensure_ascii=False, indent=1))
        return
    if not rows:
        print('No buildings matched.')
        return
    print(f'{len(rows)} buildings (overrides: cities/{args.slug}/overrides.json, custom models: cities/{args.slug}/custom/<id>.py)\n')
    for r in rows:
        flag = ' [custom]' if r['custom'] else (' [override]' if r['override'] else '')
        print(f'{r["id"]:>12}  {r["name"][:28]:28} {r["kind"][:12]:12} {r["levels"]:>2} fl {r["height_m"]:>5.1f} m  '
              f'{r["style"]}/{r["colour"]:10} roof {r["roof"]:16}{flag}')
        if r['view']:
            print(f'{"":14}Street View: {r["view"]["streetview"]}')
    print('\nTip: --json gives everything (OSM links, render camera specs) for the refine-city skill.')


if __name__ == '__main__':
    main()
