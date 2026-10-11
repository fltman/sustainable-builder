"""Write the game's city pack: cities/<slug>/pack/{map.json, config.json} (tiles/ comes from tiles.mjs).

config.json holds everything place-specific the game shows or needs: names and texts (from
cities/<slug>/theme.json when present), spawn point, map labels, districts, squares, supply
targets, ambient fires, world bounds, splash image, voices and music.

Game coordinates are three.js: x east, z south (= -north), metres from the place centre.
"""
from __future__ import annotations

import argparse
import json
import math
import shutil

from shapely.geometry import LineString, Point, Polygon, box
from shapely.strtree import STRtree

from common import ROOT, city_dir, load_place, projection_for, say, step_done, write_json

DRIVABLE = {'trunk', 'primary', 'secondary', 'tertiary', 'unclassified', 'residential', 'living_street', 'pedestrian', 'service',
            'primary_link', 'secondary_link', 'tertiary_link', 'road', 'busway'}
MAIN = {'trunk', 'primary', 'secondary', 'tertiary', 'unclassified', 'residential'}

DEFAULT_TEXT = {
    'eyebrow': 'THE STREETS ARE YOURS. KEEP THEM.',
    'tagline': 'Same streets. New rules.',
    'intro': 'Take an armored machine into the streets of {Name}.<br>Hunt the raiders. Scavenge the wrecks. Make it home.',
    'win_eyebrow': '{NAME} IS YOURS',
    'start_roam': 'DRIVE {NAME}',
    'explore': 'EXPLORE {NAME}',
    'loading': 'Loading {Name}…',
    'ready': '{Name} is ready',
    'map_title': '{NAME} / TACTICAL MAP',
    'description': 'Armored cars. Real {Name} streets. An open-world browser combat game.',
}


def tz(p):
    """Local (x east, y north) → game (x, z)."""
    return [round(p[0], 1), round(-p[1], 1)]


def dms(v, pos, neg):
    d = abs(v)
    return f'{int(d)}°{int(round((d - int(d)) * 60)):02d}′ {pos if v >= 0 else neg}'


def room_code(name):
    """The arena relay keeps only A–Z, 0–9 and '-': RÄTTVIK → RATTVIK, not RTTVIK. At most 11 characters,
    because the game puts a hidden 5-character map prefix in front (arena-client.js)."""
    import re
    import unicodedata
    ascii_ = unicodedata.normalize('NFKD', name).encode('ascii', 'ignore').decode().upper()
    return re.sub(r'[^A-Z0-9-]', '', ascii_)[:11] or 'WASTELAND'


def game_terrain(t, half):
    """The terrain for the game: heights in decimetres every 15 m over the play area (game x = east,
    z = south: row k is z0 + k*step, column i is x0 + i*step). The game only uses it to find the ground
    before the tiles have loaded; the meshes themselves carry the exact shape."""
    if not t:
        return None
    import numpy as np
    d = np.asarray(t['d'], float).reshape(t['n'], t['n'])
    step, ext = 15.0, half + 30.0
    xs = np.arange(-ext, ext + step / 2, step)
    zs = xs.copy()
    X, Zg = np.meshgrid(xs, zs)
    fy = np.clip((-Zg - t['y0']) / t['step'], 0, t['n'] - 1.000001)
    fx = np.clip((X - t['x0']) / t['step'], 0, t['n'] - 1.000001)
    j, i = np.floor(fy).astype(int), np.floor(fx).astype(int)
    ty, tx = fy - j, fx - i
    v = (d[j, i] * (1 - tx) + d[j, i + 1] * tx) * (1 - ty) + (d[j + 1, i] * (1 - tx) + d[j + 1, i + 1] * tx) * ty
    return {'x0': float(xs[0]), 'z0': float(zs[0]), 'step': step, 'n': len(xs), 'dm': [int(round(h * 10)) for h in v.ravel()]}


def copy_media(media, pack):
    """Theme assets live in cities/<slug>/media/ (the source); the pack gets fresh copies.
    splash.(jpg|png|webp) wins over the Blender-rendered splash-default.jpg; voice-*.mp3 and
    music/*.mp3 (+ music/music.json) go to pack/audio/, and so does media/audio/ (the site's narration
    vo-*.mp3 and soundtrack music.mp3)."""
    for old in list(pack.glob('splash.*')):
        old.unlink()
    audio = pack / 'audio'
    if audio.exists():
        shutil.rmtree(audio)
    if not media.exists():
        return
    splash = next((p for p in (media / 'splash.jpg', media / 'splash.webp', media / 'splash.png', media / 'splash-default.jpg') if p.exists()), None)
    if splash:
        shutil.copy2(splash, pack / ('splash' + splash.suffix))
    voices = sorted(media.glob('voice-*.mp3'))
    music = media / 'music'
    tracks = sorted(music.glob('*.mp3')) if music.exists() else []
    # The site's own audio: the narration (vo-*.mp3) and the soundtrack (music.mp3) in media/audio/.
    site_audio = sorted((media / 'audio').glob('*.mp3')) + sorted((media / 'audio').glob('*.json')) if (media / 'audio').exists() else []
    if voices or tracks or site_audio:
        audio.mkdir()
    for f in site_audio:
        shutil.copy2(f, audio / f.name)
    for v in voices:
        shutil.copy2(v, audio / v.name)
    if tracks:
        meta = json.loads((music / 'music.json').read_text()) if (music / 'music.json').exists() else {'tracks': []}
        known = {t['file']: t for t in meta.get('tracks', [])}
        listed = [{**known.get(t.name, {}), 'file': t.name, 'title': known.get(t.name, {}).get('title') or t.stem.replace('-', ' ').title()} for t in tracks]
        for t in tracks:
            shutil.copy2(t, audio / t.name)
        write_json(audio / 'music.json', {'tracks': listed})


def main(argv=None):
    ap = argparse.ArgumentParser(prog='sustainable.py pack')
    ap.add_argument('slug')
    args = ap.parse_args(argv)
    folder = city_dir(args.slug)
    place = load_place(args.slug)
    city = json.loads((folder / 'city.json').read_text())
    theme = json.loads((folder / 'theme.json').read_text()) if (folder / 'theme.json').exists() else {}
    pack = folder / 'pack'
    pack.mkdir(exist_ok=True)
    half = city['half']

    # ---------------------------------------------------------------- map.json
    def ring(r):
        return [tz(p) for p in r]
    areas = [{'k': 'land', 'p': [ring(l['outer'])] + [ring(h) for h in l['holes']]} for l in city['land']]
    for k, kind in (('park', 'green'), ('grass', 'green'), ('cemetery', 'green'), ('forest', 'green'), ('pitch', 'green'),
                    ('asphalt', 'road'), ('cobble', 'road'), ('parking', 'road'), ('paving', 'path'), ('path', 'path')):
        for a in city['areas'].get(k, []):
            areas.append({'k': kind, 'p': [ring(a['outer'])] + [ring(h) for h in a['holes']]})
    # Clip streets to the play area so the AI never routes beyond the container wall.
    inner = box(-half + 4, -half + 4, half - 4, half - 4)
    roads = []
    for r in city['roads']:
        g = LineString(r['p']).intersection(inner)
        for part in (g.geoms if hasattr(g, 'geoms') else [g]):
            if part.geom_type == 'LineString' and part.length > 1:
                roads.append({'id': r['id'], 'name': r['name'], 'kind': r['kind'], 'w': r['w'], 'p': [tz(p) for p in part.coords]})
    attribution = place['attribution']
    terrain = city.get('terrain')
    if terrain and terrain.get('attribution'):
        attribution += ' · ' + terrain['attribution']
    waterways = []
    for r in city.get('waterways', []):
        g = LineString(r['p']).intersection(inner)
        for part in (g.geoms if hasattr(g, 'geoms') else [g]):
            if part.geom_type == 'LineString' and part.length > 5:
                waterways.append({'id': r['id'], 'name': r['name'], 'kind': r['kind'], 'w': r['w'], 'p': [tz(p) for p in part.coords]})
    # Arched bridges as they stand in 3D (pipeline/bridges.py): the site lifts walkers onto their steps.
    arched = []
    if city.get('bridge_spans'):
        from bridges import profile, sampler
        street = json.loads((ROOT / 'pipeline/style.json').read_text())['surfaces'].get('paving', {}).get('z', 0.03)
        ground = sampler(terrain, street)
        for sp in city['bridge_spans']:
            pr = profile(sp, ground, city['water_z'])
            if pr:
                (ax, ay), (bx, by) = sp['a'], sp['b']
                arched.append({'a': [round(ax, 2), round(-ay, 2)], 'b': [round(bx, 2), round(-by, 2)], 'hw': round(pr['hw'], 2),
                               'hl': round(pr['hl'], 2), 'zc': round(pr['zc'], 3),
                               'feet': [[round(sf, 3), round(zf, 3), round(run, 3), n] for sf, zf, run, n in pr['feet']]})
    game_map = {'roads': roads, 'waterways': waterways, 'buildings': [ring(f) for f in city['footprints'] if len(f) >= 3], 'land': [], 'areas': areas,
                'attribution': attribution, 'bounds': [-half, -half, half, half], 'terrain': game_terrain(terrain, half),
                **({'bridges': arched} if arched else {})}
    write_json(pack / 'map.json', game_map, compact=True)

    # ---------------------------------------------------------------- spawn: a wide named street near the centre
    foot = [Polygon(f) for f in city['footprints'] if len(f) >= 3]
    ftree = STRtree(foot) if foot else None
    land = [Polygon(l['outer'], l['holes']) for l in city['land']]

    def clear(pt, r):
        if ftree is not None and any(foot[i].distance(pt) < r for i in ftree.query(pt.buffer(r))):
            return False
        return any(l.contains(pt) for l in land)

    best = None
    for r in city['roads']:
        if r['kind'] not in DRIVABLE or r['w'] < 5 or len(r['p']) < 2:
            continue
        ln = LineString(r['p'])
        d = ln.project(Point(0, 0))
        for off in (0, 15, -15, 30, -30, 60, -60):
            dd = min(max(d + off, 3), ln.length - 3)
            if dd <= 0:
                continue
            pt = ln.interpolate(dd)
            dist = pt.distance(Point(0, 0))
            score = dist - (40 if r['name'] else 0) - (30 if r['kind'] in MAIN else 0) - r['w'] * 2
            if (best is None or score < best[0]) and clear(pt, r['w'] / 2 + 0.5):
                a, b = ln.interpolate(max(0, dd - 2)), ln.interpolate(min(ln.length, dd + 2))
                best = (score, pt, b.x - a.x, b.y - a.y, r)
    if best:
        _, pt, dx, dy, road = best
        spawn = {'x': round(pt.x, 2), 'z': round(-pt.y, 2), 'heading': round(math.atan2(-dx, dy), 4), 'street': road['name']}
    else:
        spawn = {'x': 0.0, 'z': 0.0, 'heading': 0.0, 'street': ''}
    sx, sy = spawn['x'], -spawn['z']

    # ---------------------------------------------------------------- labels, districts, squares, supplies, fires
    labels, seen = [], []
    # theme.json "map_labels" come first: a landmark/place name, or {"name", "lat", "lon"} for any spot.
    proj = projection_for(place)
    named = {n['name'].upper(): n for n in city.get('landmarks', []) + city.get('places', [])}
    for entry in theme.get('map_labels', []):
        e = {'name': entry} if isinstance(entry, str) else entry
        if 'lat' in e:
            x, y = proj.xy(e['lat'], e['lon'])
        elif e['name'].upper() in named:
            x, y = named[e['name'].upper()]['x'], named[e['name'].upper()]['y']
        else:
            say(f'  map_labels: no landmark or place called "{e["name"]}" (give lat/lon)')
            continue
        labels.append([e.get('label', e['name']).upper(), *tz((x, y))])
        seen.append((x, y))
    for p in sorted(city.get('places', []), key=lambda p: {'suburb': 0, 'quarter': 1, 'neighbourhood': 2, 'water': 3}.get(p['kind'], 4)):
        if any(math.dist((p['x'], p['y']), s) < 90 for s in seen) or p['name'].upper() in [l[0] for l in labels]:
            continue
        labels.append([p['name'].upper(), *tz((p['x'], p['y']))])
        seen.append((p['x'], p['y']))
    for lm in city.get('landmarks', []):
        if len(labels) >= 12:
            break
        if lm['kind'] in ('square', 'park', 'church', 'cathedral', 'castle', 'train_station', 'townhall', 'fort', 'city_wall', 'museum', 'ruins'):
            if any(math.dist((lm['x'], lm['y']), s) < 90 for s in seen) or lm['name'].upper() in [l[0] for l in labels]:
                continue
            labels.append([lm['name'].upper(), *tz((lm['x'], lm['y']))])
            seen.append((lm['x'], lm['y']))
    districts = [{'name': p['name'].upper(), 'x': tz((p['x'], p['y']))[0], 'z': tz((p['x'], p['y']))[1]}
                 for p in city.get('places', []) if p['kind'] in ('suburb', 'quarter', 'neighbourhood', 'locality', 'island', 'islet', 'village', 'hamlet')]
    squares = [{'name': lm['name'].upper(), 'x': tz((lm['x'], lm['y']))[0], 'z': tz((lm['x'], lm['y']))[1], 'r': round(max(12, min(60, math.sqrt(lm.get('area', 600) / math.pi))), 1)}
               for lm in city.get('landmarks', []) if lm['kind'] == 'square']
    crates, picked = [], [(sx, sy)]
    for lm in sorted(city.get('landmarks', []), key=lambda l: -l.get('area', 0)):
        p = (lm['x'], lm['y'])
        if all(math.dist(p, q) > 110 for q in picked) and abs(p[0]) < half - 20 and abs(p[1]) < half - 20:
            crates.append(tz(p))
            picked.append(p)
        if len(crates) >= 5:
            break
    for ang in (0.6, 2.2, 3.8, 5.2, 1.4):  # fill up with points around the spawn
        if len(crates) >= 5:
            break
        crates.append(tz((sx + math.cos(ang) * 160, sy + math.sin(ang) * 160)))
    fires = [tz((sx + math.cos(a) * d, sy + math.sin(a) * d)) for a, d in ((0.9, 45), (2.8, 80), (4.6, 110))]

    # ---------------------------------------------------------------- texts and media
    copy_media(folder / 'media', pack)
    name = theme.get('name') or place['name']
    fill = lambda s: s.replace('{Name}', name).replace('{NAME}', name.upper())
    text = {k: fill(theme.get('text', {}).get(k, v)) for k, v in DEFAULT_TEXT.items()}
    country = place['display_name'].split(',')[-1].strip().upper() if place.get('display_name') else ''
    lat, lon = place['center']
    splash = next((f'city/{p.name}' for p in (pack / 'splash.jpg', pack / 'splash.webp', pack / 'splash.png') if p.exists()), None)
    audio = pack / 'audio'
    voices = sorted(p.stem[6:] for p in audio.glob('voice-*.mp3')) if audio.exists() else []
    config = {
        'version': 1, 'slug': args.slug, 'name': name,
        'title': {'top': theme.get('title_top', name.upper()), 'bottom': theme.get('title_bottom', 'WASTELAND')},
        'page_title': theme.get('page_title', f'{name} Wasteland · Battlecars'),
        'wordmark': theme.get('wordmark', f'{name[:1].upper()} / W'),
        'coordinates': f'{name.upper()}{", " + country if country and country != name.upper() else ""} <i></i> {dms(lat, "N", "S")} / {dms(lon, "E", "W")}',
        'text': text, 'room': room_code(theme.get('room') or args.slug),
        'spawn': spawn, 'bounds': {'minX': -half - 30, 'maxX': half + 30, 'minZ': -half - 30, 'maxZ': half + 30},
        'labels': labels[:12], 'districts': districts, 'squares': squares, 'crates': crates, 'fires': fires,
        'splash': splash, 'voices': voices, 'music': 'city/audio/music.json' if (audio / 'music.json').exists() else None,
        'attribution': attribution, 'center': place['center'],
    }
    write_json(pack / 'config.json', config)
    say(f'Pack: map.json ({len(roads)} roads, {len(game_map["buildings"])} footprints), config.json '
        f'(spawn on {spawn["street"] or "a street"}, {len(labels)} labels, {len(crates)} supply points, splash: {"yes" if splash else "no"}, voices: {len(voices)})')
    step_done(args.slug, 'pack', spawn=spawn)


if __name__ == '__main__':
    main()
