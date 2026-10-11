"""Street View survey rounds: plan viewpoints that see many unchecked houses, then match the frames you
captured to building ids.

    python3 sustainable.py survey <slug> plan [--unsurveyed | --street NAME | --near NAME|lat,lon] [--max 40] [--out DIR]
    python3 sustainable.py survey <slug> compare DIR

plan
    Picks viewpoints on the streets (greedy: each one sees as many not-yet-checked houses as possible,
    nearest the centre first) and writes DIR/plan.json (default cities/<slug>/survey/). It prints one
    Street View link per viewpoint (eye at the car, 90° field of view, pitch 8°). Open each one,
    screenshot it and save it as DIR/<index>.jpg. Street View is a reference only: keep the frames
    outside the repository (cities/ is git-ignored).
compare
    Renders the model from every viewpoint that has a frame: a normal view and a flat-colour ID pass,
    from the same eye height, heading and lens, standing on the terrain. It writes DIR/sheets/*.jpg:
    frame above model, every building labelled with the last digits of its id; targets of the plan
    are yellow. DIR/labels.json maps the labels to full ids.
    Then write what you see to overrides.json (style, colour, roof, levels, a `note`), run
    `python3 sustainable.py seed <slug> --ids …`, edit the scripts by hand and `rebuild`.
"""
from __future__ import annotations

import argparse
import json
import math
import sys
from pathlib import Path

import numpy as np
from shapely.geometry import LineString, Point, Polygon

from common import city_dir, load_place, projection_for, say

DRIVABLE = ('residential', 'tertiary', 'secondary', 'primary', 'trunk', 'unclassified', 'living_street', 'service', 'pedestrian')
STARTER_UNSURVEYED = 'not surveyed yet'


def targets(folder, city, args):
    overrides = json.loads((folder / 'overrides.json').read_text()).get('buildings', {}) if (folder / 'overrides.json').exists() else {}
    scripts = {p.stem: p.read_text() for p in (folder / 'custom').glob('*.py')} if (folder / 'custom').exists() else {}
    known = lambda bid: bid in overrides or bid.rstrip('r') in overrides
    out = {}
    focus = None
    if args.street:
        lines = [LineString(r['p']) for r in city['roads'] if args.street.lower() in (r['name'] or '').lower() and len(r['p']) > 1]
        if not lines:
            raise SystemExit(f'No street called "{args.street}".')
        focus = lines
    elif args.near:
        try:
            lat, lon = (float(v) for v in args.near.split(','))
            x, y = projection_for(load_place(folder.name)).xy(lat, lon)
        except ValueError:
            hit = next((l for l in city['landmarks'] + city.get('places', []) if args.near.lower() in l['name'].lower()), None)
            if not hit:
                raise SystemExit(f'Nothing called "{args.near}" (try lat,lon).')
            x, y = hit['x'], hit['y']
        focus = [Point(x, y).buffer(args.radius)]
    for b in city['buildings']:
        P = Polygon(b['footprint']['outer'])
        if P.area < args.min_area:
            continue
        if focus is not None:
            if not any(f.distance(P) < 30 for f in focus):
                continue
            if args.unsurveyed and known(b['id']):
                continue
        elif STARTER_UNSURVEYED not in scripts.get(b['id'], '') and (known(b['id']) or (b['id'] in scripts and 'Starter script' not in scripts[b['id']])):
            continue                                  # everything that has no observation yet
        out[b['id']] = P
    return out


def plan(args):
    folder = city_dir(args.slug)
    city = json.loads((folder / 'city.json').read_text())
    proj = projection_for(load_place(args.slug))
    want = targets(folder, city, args)
    if not want:
        say('Nothing left to survey here.')
        return
    roads = [LineString([p[:2] for p in r['p']]) for r in city['roads'] if r['kind'] in DRIVABLE and len(r['p']) > 1]
    views = []
    for ln in roads:
        d = 3.0
        while d < ln.length:
            pt, a, b = ln.interpolate(d), ln.interpolate(max(0, d - 3)), ln.interpolate(min(ln.length, d + 3))
            along = math.degrees(math.atan2(b.x - a.x, b.y - a.y)) % 360
            for side in (-90, 90, -45, 45, -135, 135):
                h = (along + side) % 360
                seen = []
                for bid, P in want.items():
                    dist = P.distance(pt)
                    if 2 < dist < 30:
                        br = math.degrees(math.atan2(P.centroid.x - pt.x, P.centroid.y - pt.y)) % 360
                        if abs(((br - h + 180) % 360) - 180) < 35:
                            seen.append((bid, dist))
                if seen:
                    views.append({'x': round(pt.x, 2), 'y': round(pt.y, 2), 'heading': round(h), 'seen': [s for s, _ in seen],
                                  'near': min(dd for _, dd in seen)})
            d += 10.0
    need, chosen = set(want), []
    while need and len(chosen) < args.max:
        best = max(views, key=lambda v: (len(set(v['seen']) & need), -v['near']), default=None)
        if not best or not set(best['seen']) & need:
            break
        got = sorted(set(best['seen']) & need)
        chosen.append({**best, 'new': got})
        need -= set(got)
    chosen.sort(key=lambda v: math.hypot(v['x'], v['y']))
    for i, v in enumerate(chosen):
        lat, lon = proj.latlon(v['x'], v['y'])
        v.update({'k': i, 'lat': round(lat, 6), 'lon': round(lon, 6),
                  'url': f'https://www.google.com/maps/@?api=1&map_action=pano&viewpoint={lat:.6f},{lon:.6f}&heading={v["heading"]}&pitch=8&fov=90'})
    out = Path(args.out) if args.out else folder / 'survey'
    out.mkdir(parents=True, exist_ok=True)
    (out / 'plan.json').write_text(json.dumps(chosen, indent=1))
    covered = sum(len(v['new']) for v in chosen)
    say(f'{len(chosen)} viewpoints see {covered} of {len(want)} houses to check → {out / "plan.json"}')
    say(f'Save each frame as {out}/<index>.jpg, then: python3 sustainable.py survey {args.slug} compare {out}')
    for v in chosen:
        say(f'{v["k"]:3d}  {len(v["new"]):2d} houses  {v["url"]}')


def views(args):
    """DIR/views.json: the planned viewpoints that have a frame (input for render_survey.py)."""
    d = Path(args.dir)
    plan = json.loads((d / 'plan.json').read_text())
    have = [v for v in plan if (d / f'{v["k"]}.jpg').exists() or (d / f'{v["k"]}.png').exists()]
    if not have:
        raise SystemExit(f'No frames in {d} yet (save them as <index>.jpg).')
    (d / 'views.json').write_text(json.dumps([{'name': f'v{v["k"]:03d}', 'x': v['x'], 'y': v['y'], 'heading': v['heading'],
                                                'k': v['k'], 'seen': v['new']} for v in have]))
    say(f'{len(have)} frames to compare')


def sheets(args):
    from PIL import Image, ImageDraw, ImageFont
    d = Path(args.dir)
    vs = json.loads((d / 'views.json').read_text())
    idmap = json.loads((d / 'render/idmap.json').read_text())
    try:
        font = ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial Bold.ttf', 13)
    except OSError:
        font = ImageFont.load_default()
    W, H = 665, 363
    short, comps = {}, []
    for v in vs:
        im = np.array(Image.open(d / f'render/{v["name"]}_ids.png').convert('RGB')).astype(np.int32)
        key = (im[:, :, 0] << 16) | (im[:, :, 1] << 8) | im[:, :, 2]
        labels = []
        for k, n in zip(*np.unique(key, return_counts=True)):
            bid = idmap.get(f'{(k >> 16) & 255},{(k >> 8) & 255},{k & 255}')
            if n < 250 or not bid:
                continue
            ys, xs = np.nonzero(key == k)
            t = bid[1:].rstrip('r')[-5:] if bid[0] in 'wr' else bid[:6]
            short[t] = bid
            labels.append((int(np.median(xs)), int(np.median(ys)), ('*' if bid in v['seen'] else '') + t))
        frame = next(p for p in (d / f'{v["k"]}.jpg', d / f'{v["k"]}.png') if p.exists())
        sv = Image.open(frame).convert('RGB').resize((W, H))
        ours = Image.open(d / f'render/{v["name"]}.png').convert('RGB').resize((W, H))
        comp = Image.new('RGB', (W, 2 * H + 4), 'black')
        comp.paste(sv, (0, 0))
        comp.paste(ours, (0, H + 4))
        dr = ImageDraw.Draw(comp)
        dr.rectangle([0, 0, 44, 18], fill='white')
        dr.text((3, 2), str(v['k']), fill='black', font=font)
        for x, y, t in labels:
            for oy in (0, H + 4):
                tw = dr.textlength(t, font=font)
                dr.rectangle([x - tw / 2 - 3, y + oy - 8, x + tw / 2 + 3, y + oy + 8], fill=(255, 255, 0) if t[0] == '*' else (255, 190, 110))
                dr.text((x - tw / 2, y + oy - 7), t, fill='black', font=font)
        comps.append(comp)
    (d / 'sheets').mkdir(exist_ok=True)
    for n in range(0, len(comps), 2):
        out = Image.new('RGB', (2 * W + 6, 2 * H + 4), 'white')
        out.paste(comps[n], (0, 0))
        if n + 1 < len(comps):
            out.paste(comps[n + 1], (W + 6, 0))
        out.save(d / f'sheets/{n // 2:02d}.jpg', quality=82)
    (d / 'labels.json').write_text(json.dumps(short, indent=1))
    say(f'{len(comps)} comparisons in {d / "sheets"}/ (labels → ids in {d / "labels.json"})')


def main(argv=None):
    ap = argparse.ArgumentParser(prog='sustainable.py survey')
    ap.add_argument('slug')
    sub = ap.add_subparsers(dest='action', required=True)
    p = sub.add_parser('plan')
    p.add_argument('--street')
    p.add_argument('--near')
    p.add_argument('--radius', type=float, default=120)
    p.add_argument('--unsurveyed', action='store_true', help='with --street/--near: only houses without observations')
    p.add_argument('--max', type=int, default=40)
    p.add_argument('--min-area', type=float, default=50)
    p.add_argument('--out')
    for name in ('views', 'sheets'):
        sub.add_parser(name).add_argument('dir')
    args = ap.parse_args(argv)
    {'plan': plan, 'views': views, 'sheets': sheets}[args.action](args)


if __name__ == '__main__':
    sys.exit(main())
