"""Find a place with OpenStreetMap Nominatim and write cities/<slug>/place.json.

    python3 sustainable.py new "Visby"                    # first hit, 1 km square
    python3 sustainable.py new "Visby" --size large       # 1.6 km square
    python3 sustainable.py new "Lund" --pick 2            # second search hit
    python3 sustainable.py new "Ystad" --center 55.4295,13.8204 --size 800
"""
from __future__ import annotations

import argparse
import math
import urllib.parse

from common import CITIES, EARTH, http_json, say, slugify, write_json

SIZES = {'small': 600, 'medium': 1000, 'large': 1600}


def search(query: str, limit=5):
    url = 'https://nominatim.openstreetmap.org/search?' + urllib.parse.urlencode(
        {'q': query, 'format': 'jsonv2', 'limit': limit, 'addressdetails': 1})
    return http_json(url, timeout=30)


def best(hits):
    """The hit to build around: the first, unless it is a boundary and a town, village or district follows.
    A municipality's point is often far from its town ("Trosa" finds Trosa kommun first, with its point in the
    woods south of the town)."""
    kind = lambda h: h.get('category', h.get('class'))
    if hits and kind(hits[0]) == 'boundary':
        return next((i for i, h in enumerate(hits, 1) if kind(h) == 'place'), 1)
    return 1


def bbox_around(lat, lon, size_m):
    half = size_m / 2
    dlat = half / EARTH
    dlon = half / (EARTH * math.cos(math.radians(lat)))
    return [round(lat - dlat, 6), round(lon - dlon, 6), round(lat + dlat, 6), round(lon + dlon, 6)]


def main(argv=None):
    ap = argparse.ArgumentParser(prog='sustainable.py new')
    ap.add_argument('query', help='Town, district, square or address, e.g. "Visby" or "Möllevångstorget, Malmö"')
    ap.add_argument('--size', default='medium', help='small (600 m), medium (1000 m), large (1600 m) or metres')
    ap.add_argument('--pick', type=int, help='Use search hit number N (default: the first, a town before a municipality)')
    ap.add_argument('--center', help='Override the centre as "lat,lon"')
    ap.add_argument('--slug', help='Folder name under cities/')
    ap.add_argument('--name', help='Display name used in the game title')
    args = ap.parse_args(argv)

    size = SIZES.get(args.size) or int(float(args.size))
    if not 200 <= size <= 3000:
        raise SystemExit('Size must be between 200 and 3000 metres; large areas take long to build and stream.')

    hits = search(args.query)
    if not hits and not args.center:
        raise SystemExit(f'Nominatim found nothing for "{args.query}". Try adding the country or region.')
    pick = args.pick or best(hits)
    if hits:
        say('Search hits:')
        for i, h in enumerate(hits, 1):
            mark = '->' if i == pick else '  '
            say(f' {mark} {i}. {h["display_name"]}  [{h.get("category", h.get("class"))}/{h.get("type")}]')
    hit = hits[min(pick, len(hits)) - 1] if hits else {}
    if args.center:
        lat, lon = (float(v) for v in args.center.split(','))
    else:
        lat, lon = float(hit['lat']), float(hit['lon'])
    addr = hit.get('address', {})
    name = args.name or hit.get('name') or args.query.split(',')[0].strip()
    slug = args.slug or slugify(name)
    place = {
        'name': name,
        'query': args.query,
        'display_name': hit.get('display_name', name),
        'country_code': addr.get('country_code', ''),
        'region': addr.get('state') or addr.get('county') or '',
        'center': [round(lat, 7), round(lon, 7)],
        'size_m': size,
        'bbox': bbox_around(lat, lon, size),  # south, west, north, east
        'osm': {'type': hit.get('osm_type'), 'id': hit.get('osm_id')},
        'attribution': 'Map data © OpenStreetMap contributors (ODbL)',
    }
    out = CITIES / slug
    write_json(out / 'place.json', place)
    say(f'\nPlace: {place["display_name"]}')
    say(f'Centre {lat:.5f}, {lon:.5f}; area {size} × {size} m')
    say(f'Map:   https://www.openstreetmap.org/?mlat={lat:.5f}&mlon={lon:.5f}#map=16/{lat:.5f}/{lon:.5f}')
    say(f'Saved: cities/{slug}/place.json')
    say(f'\nNext:  python3 sustainable.py build {slug}')
    return slug


if __name__ == '__main__':
    main()
