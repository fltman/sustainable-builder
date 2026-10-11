"""Download the OpenStreetMap features for a city's bounding box through the Overpass API.

Writes cities/<slug>/osm.json (raw Overpass JSON, ODbL). Re-running reuses the file unless --force.
"""
from __future__ import annotations

import argparse
import json
import math

from common import EARTH, city_dir, http_json, load_place, say, step_done

MIRRORS = [
    'https://overpass-api.de/api/interpreter',
    'https://overpass.private.coffee/api/interpreter',
    'https://overpass.kumi.systems/api/interpreter',
]

# Several small queries instead of one big one: public Overpass servers time out (HTTP 504) on
# heavy combined requests. Giant relations (seas, bays, straits) are skipped: the sea comes from
# the coastline ways. Each query falls back to the next mirror on its own.
QUERIES = {
    'buildings': 'way["building"]; relation["building"]; way["building:part"]; relation["building:part"];',
    'streets': 'way["highway"]; way["area:highway"]; way["railway"~"^(rail|tram|light_rail|narrow_gauge|platform)$"]; '
               'way["barrier"~"^(city_wall|wall|hedge|retaining_wall)$"]; way["historic"~"^(city_wall|citywalls|castle|ruins|fort)$"]; '
               'way["man_made"~"^(pier|breakwater|bridge|quay)$"];',
    'areas': 'way["landuse"]; way["leisure"]; way["natural"]; way["amenity"~"^(parking|grave_yard|marketplace)$"]; '
             'way["place"="square"]; way["waterway"]; way["water"];',
    'relations': 'relation["type"="multipolygon"]["landuse"]; relation["type"="multipolygon"]["leisure"]; '
                 'relation["type"="multipolygon"]["natural"]["natural"!~"^(bay|strait|sea|peninsula|cape|isthmus|coastline)$"]; '
                 'relation["type"="multipolygon"]["water"]; relation["type"="multipolygon"]["waterway"="riverbank"]; '
                 'relation["type"="multipolygon"]["amenity"="parking"]; relation["type"="multipolygon"]["place"="square"]; '
                 'relation["type"="multipolygon"]["man_made"~"^(pier|breakwater|bridge)$"];',
    'points': 'node["natural"="tree"]; node["highway"~"^(street_lamp|traffic_signals|bus_stop)$"]; '
              'node["amenity"~"^(bench|fountain|waste_basket|bicycle_parking|telephone|post_box)$"]; '
              'node["name"]["amenity"]; node["name"]["tourism"]; node["name"]["historic"]; '
              'node["place"~"^(suburb|quarter|neighbourhood|square|locality|island|islet|village|hamlet)$"];',
}
TEMPLATE = '[out:json][timeout:{timeout}]{bbox};\n({body});\nout body geom qt;'


def overpass(body, bbox, wait=100):
    """Run one Overpass query on the first mirror that answers; None when all fail."""
    query = TEMPLATE.format(timeout=wait - 10, bbox=f'[bbox:{bbox}]' if bbox else '', body=body)
    for url in MIRRORS:
        try:
            data = http_json(url, {'data': query}, timeout=wait, attempts=1)
            if data.get('remark') and ('error' in data['remark'].lower() or 'timed out' in data['remark'].lower()):
                raise RuntimeError(data['remark'])
            return data['elements']
        except Exception as exc:
            say(f'    {url.split("/")[2]}: {str(exc)[:80]}')
    return None


def osm_api_elements(bbox, depth=0):
    """Fallback: the main OSM API's /map call (complete ways; relations as far as their members are
    inside the box), converted to Overpass-style elements with geometry. Splits the box when the
    API refuses (more than 50 000 nodes)."""
    s, w, n, e = (float(v) for v in bbox.split(','))
    url = f'https://api.openstreetmap.org/api/0.6/map.json?bbox={w:.6f},{s:.6f},{e:.6f},{n:.6f}'
    try:
        raw = http_json(url, timeout=180, attempts=2)['elements']
    except Exception as exc:
        if depth >= 3:
            raise SystemExit(f'The OpenStreetMap API failed too: {exc}. Try again later or choose a smaller --size.')
        say(f'    splitting the area ({exc})')
        mlat, mlon = (s + n) / 2, (w + e) / 2
        out, seen = [], {}
        for q in ((s, w, mlat, mlon), (s, mlon, mlat, e), (mlat, w, n, mlon), (mlat, mlon, n, e)):
            for el in osm_api_elements(','.join(f'{v:.6f}' for v in q), depth + 1):
                key = (el['type'], el['id'])
                if key in seen and el['type'] == 'relation':
                    # Fill in member geometry the other quarter had.
                    old = seen[key]
                    for a, b in zip(old['members'], el['members']):
                        if not a.get('geometry') and b.get('geometry'):
                            a['geometry'] = b['geometry']
                elif key not in seen:
                    seen[key] = el
                    out.append(el)
        return out
    say(f'    {len(raw)} raw elements from api.openstreetmap.org')
    nodes = {el['id']: el for el in raw if el['type'] == 'node'}
    ways = {el['id']: el for el in raw if el['type'] == 'way'}
    geom = lambda refs: [{'lat': nodes[r]['lat'], 'lon': nodes[r]['lon']} for r in refs if r in nodes]
    out = []
    for el in raw:
        if el['type'] == 'node' and el.get('tags'):
            out.append({'type': 'node', 'id': el['id'], 'lat': el['lat'], 'lon': el['lon'], 'tags': el['tags']})
        elif el['type'] == 'way' and el.get('tags'):
            out.append({'type': 'way', 'id': el['id'], 'tags': el['tags'], 'geometry': geom(el['nodes'])})
        elif el['type'] == 'relation' and el.get('tags'):
            members = []
            for m in el['members']:
                mm = {'type': m['type'], 'ref': m['ref'], 'role': m.get('role', '')}
                if m['type'] == 'way' and m['ref'] in ways:
                    mm['geometry'] = geom(ways[m['ref']]['nodes'])
                members.append(mm)
            out.append({'type': 'relation', 'id': el['id'], 'tags': el['tags'], 'members': members})
    return out


def main(argv=None):
    ap = argparse.ArgumentParser(prog='sustainable.py fetch')
    ap.add_argument('slug')
    ap.add_argument('--force', action='store_true')
    args = ap.parse_args(argv)
    place = load_place(args.slug)
    out = city_dir(args.slug) / 'osm.json'
    if out.exists() and not args.force:
        say(f'OSM data already downloaded ({out.stat().st_size / 1e6:.1f} MB). Use --force to refresh.')
        return
    s, w, n, e = place['bbox']
    # Fetch a margin around the play area so outlines crossing the edge stay whole.
    pad = 80
    dlat = pad / EARTH
    dlon = pad / (EARTH * math.cos(math.radians((s + n) / 2)))
    bbox = f'{s - dlat:.6f},{w - dlon:.6f},{n + dlat:.6f},{e + dlon:.6f}'
    # 1) The OSM API's map call: fast and complete for ways. 2) Overpass completes multipolygons that
    # reach outside the box. If the API is unavailable, Overpass does everything.
    try:
        say('  downloading from api.openstreetmap.org …')
        elements = osm_api_elements(bbox)
        remark = 'OpenStreetMap API 0.6 map'
        incomplete = [el['id'] for el in elements if el['type'] == 'relation' and el['tags'].get('type') == 'multipolygon'
                      and any(m['type'] == 'way' and not m.get('geometry') for m in el['members'])]
        if incomplete:
            say(f'  completing {len(incomplete)} large areas through Overpass …')
            fixed = overpass(f'relation(id:{",".join(map(str, incomplete[:400]))});', bbox=None, wait=40)
            if fixed:
                by_id = {el['id']: el for el in fixed if el['type'] == 'relation'}
                elements = [by_id.get(el['id'], el) if el['type'] == 'relation' else el for el in elements]
            else:
                say('  (Overpass busy — large areas that reach outside the map may be missing; rerun later with --refresh)')
    except SystemExit:
        say('  The OSM API failed — using Overpass instead.')
        elements, seen, remark = [], set(), 'Overpass API'
        for part, body in QUERIES.items():
            data = overpass(body, bbox)
            if data is None:
                raise SystemExit(f'Could not download {part}: all Overpass servers are busy. Try again in a few minutes.')
            for el in data:
                if (el['type'], el['id']) not in seen:
                    seen.add((el['type'], el['id']))
                    elements.append(el)
    data = {'version': 0.6, 'generator': f'wasteland-builder ({remark})', 'osm3s': {'timestamp_osm_base': remark,
            'copyright': 'The data included in this document is from www.openstreetmap.org. The data is made available under ODbL.'},
            'elements': elements}
    out.write_text(json.dumps(data, ensure_ascii=False))
    counts = {}
    for el in data['elements']:
        t = el.get('tags', {})
        key = next((k for k in ('building', 'building:part', 'highway', 'railway', 'waterway', 'landuse', 'leisure', 'natural', 'barrier') if k in t), 'other')
        counts[key] = counts.get(key, 0) + 1
    say(f'Saved {len(data["elements"])} features ({out.stat().st_size / 1e6:.1f} MB): ' +
        ', '.join(f'{v} {k}' for k, v in sorted(counts.items(), key=lambda kv: -kv[1])))
    step_done(args.slug, 'fetch', elements=len(data['elements']), counts=counts)


if __name__ == '__main__':
    main()
