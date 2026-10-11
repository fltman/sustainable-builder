"""Download the ground heights for a city → cities/<slug>/terrain.json.

    python3 pipeline/fetch_terrain.py <slug> [--force]

Two sources, both read straight from cloud-optimised GeoTIFFs with HTTP range requests (only the
internal blocks that cover the city and a margin round it), decoded here (deflate + predictor), so no
GDAL is needed:

- Lantmäteriet Markhöjdmodell (Sweden, 1 m ground model from laser scanning, CC BY 4.0). Used when
  .env has LANTMATERIET_USER and LANTMATERIET_PASSWORD (a free Geotorget account with access to
  "Markhöjdmodell Nedladdning") or LANTMATERIET_CONSUMER_KEY/_SECRET (OAuth2). It is a terrain model
  already: no buildings or trees to clean away.
- Copernicus DEM GLO-30 (worldwide, 30 m surface model, on AWS without an account). The fallback,
  and the filler where Lantmäteriet has no data (open sea, across a border). prepare_city.py removes
  buildings and tree tops from it with the OpenStreetMap footprints and forests.

The result is a grid of heights in metres in the city's own local plane (x east, y north). Re-running
reuses the file unless --force. Without network the step only warns: the city is then built flat.
"""
from __future__ import annotations

import argparse
import base64
import json
import math
import os
import struct
import urllib.error
import urllib.parse
import urllib.request
import zlib

import numpy as np

from common import EARTH, USER_AGENT, city_dir, load_place, projection_for, say, step_done, write_json

MARGIN_M = 600          # the surroundings beyond the play area (hills on the horizon)
COPERNICUS = 'https://copernicus-dem-30m.s3.amazonaws.com'
COPERNICUS_ATTRIBUTION = ('Terrain: Copernicus DEM GLO-30 © DLR e.V. 2010-2014 and © Airbus Defence and Space GmbH 2014-2018, '
                          'provided under COPERNICUS by the European Union and ESA')
LM_STAC = 'https://api.lantmateriet.se/stac-hojd/v1'
LM_TOKEN = 'https://apimanager.lantmateriet.se/oauth2/token'
LM_ATTRIBUTION = 'Höjddata: Markhöjdmodell © Lantmäteriet (CC BY 4.0)'
LM_STEP = 4.0           # metres between stored heights when the source is Lantmäteriet's 1 m model


# ------------------------------------------------------------------------------------------ HTTP
def get(url: str, headers=None, start=None, length=None) -> bytes:
    h = {'User-Agent': USER_AGENT, **(headers or {})}
    if start is not None:
        h['Range'] = f'bytes={start}-{start + length - 1}'
    with urllib.request.urlopen(urllib.request.Request(url, headers=h), timeout=120) as res:
        return res.read()


# ------------------------------------------------------------------------------------------ GeoTIFF
class Cog:
    """A cloud-optimised GeoTIFF read over HTTP: its full image and overviews, tile layout and
    geo-referencing. Classic TIFF and BigTIFF, float32, deflate, predictor 1 or 3."""

    def __init__(self, url: str, headers=None):
        self.url, self.headers = url, headers or {}
        self.head = get(url, self.headers, 0, 1 << 16)
        e = '<' if self.head[:2] == b'II' else '>'
        self.e = e
        big = struct.unpack(e + 'H', self.head[2:4])[0] == 43
        off = struct.unpack(e + ('Q' if big else 'I'), self.head[(8 if big else 4):(16 if big else 8)])[0]
        self.levels = []
        geo = None
        while off:
            tags, off = self._ifd(off, big)
            if tags.get(254, (0,))[0] & 4:          # transparency mask, not an image
                continue
            if geo is None:
                geo = tags
            if tags.get(258, (32,))[0] != 32 or tags.get(339, (3,))[0] != 3:
                raise ValueError('expected 32-bit float samples')
            self.levels.append({'w': tags[256][0], 'h': tags[257][0], 'tw': tags[322][0], 'th': tags[323][0],
                                'offsets': tags[324], 'counts': tags[325], 'compression': tags.get(259, (1,))[0],
                                'predictor': tags.get(317, (1,))[0]})
        sx, sy = geo[33550][:2]
        _, _, _, x0, y0, _ = geo[33922]
        keys = geo.get(34735, ())
        point = any(keys[k] == 1025 and keys[k + 3] == 2 for k in range(4, len(keys), 4))
        self.sx, self.sy = sx, sy                       # pixel size of the full image
        # Centre of pixel (0, 0) of the full image, in the file's own coordinates.
        self.x0, self.y0 = (x0, y0) if point else (x0 + sx / 2, y0 - sy / 2)

    def _bytes(self, off, n):
        if off + n <= len(self.head):
            return self.head[off:off + n]
        return get(self.url, self.headers, off, n)

    def _ifd(self, off, big):
        e = self.e
        if big:
            n = struct.unpack(e + 'Q', self._bytes(off, 8))[0]
            raw = self._bytes(off + 8, n * 20 + 8)
            entry, size_fmt, inline = 20, 'Q', 8
        else:
            n = struct.unpack(e + 'H', self._bytes(off, 2))[0]
            raw = self._bytes(off + 2, n * 12 + 4)
            entry, size_fmt, inline = 12, 'I', 4
        types = {1: 'B', 3: 'H', 4: 'I', 11: 'f', 12: 'd', 16: 'Q', 17: 'q'}
        tags = {}
        for i in range(n):
            p = i * entry
            tag, typ = struct.unpack(e + 'HH', raw[p:p + 4])
            cnt, val = struct.unpack(e + size_fmt * 2, raw[p + 4:p + entry])
            fmt = types.get(typ)
            if not fmt:
                continue
            size = struct.calcsize(fmt) * cnt
            data = raw[p + 4 + struct.calcsize(size_fmt):p + 4 + struct.calcsize(size_fmt) + size] if size <= inline else self._bytes(val, size)
            tags[tag] = struct.unpack(e + fmt * cnt, data)
        nxt = struct.unpack(e + size_fmt, raw[n * entry:n * entry + struct.calcsize(size_fmt)])[0]
        return tags, nxt

    def _block(self, lv, bi, bj):
        L = self.levels[lv]
        k = bj * math.ceil(L['w'] / L['tw']) + bi
        if not L['counts'][k]:
            return np.full((L['th'], L['tw']), np.nan, np.float32)
        raw = get(self.url, self.headers, L['offsets'][k], L['counts'][k])
        data = zlib.decompress(raw) if L['compression'] in (8, 32946) else raw
        th, tw = L['th'], L['tw']
        if L['predictor'] == 3:
            # Floating-point predictor: per row, byte differences over 4 byte planes, most significant first.
            a = np.frombuffer(data, np.uint8).reshape(th, 4 * tw)
            a = np.cumsum(a, axis=1, dtype=np.uint8)
            return a.reshape(th, 4, tw).transpose(0, 2, 1).copy().view('>f4').reshape(th, tw).astype(np.float32)
        if L['predictor'] != 1:
            raise ValueError(f'unsupported TIFF predictor {L["predictor"]}')
        return np.frombuffer(data, self.e + 'f4').reshape(th, tw).astype(np.float32)

    def level_for(self, pixel):
        """The coarsest level whose pixels are no larger than `pixel` (in the file's units)."""
        best = 0
        for i, L in enumerate(self.levels):
            if self.sx * self.levels[0]['w'] / L['w'] <= pixel * 1.01:
                best = i
        return best

    def sample(self, lv, X, Y):
        """Bilinear heights at file coordinates X (east), Y (north); NaN outside the image or on no-data."""
        L = self.levels[lv]
        f = self.levels[0]['w'] / L['w']
        sx, sy = self.sx * f, self.sy * f
        cx, cy = self.x0 - self.sx / 2 + sx / 2, self.y0 + self.sy / 2 - sy / 2   # centre of this level's pixel (0, 0)
        fc, fr = (X - cx) / sx, (cy - Y) / sy
        # Out to the image's real edge (half a pixel beyond the outer pixel centres), so neighbouring
        # tiles meet without a gap.
        ok = (fc >= -0.5) & (fr >= -0.5) & (fc <= L['w'] - 0.5) & (fr <= L['h'] - 0.5)
        fc, fr = np.clip(fc, 0, L['w'] - 1), np.clip(fr, 0, L['h'] - 1)
        out = np.full(X.shape, np.nan, np.float32)
        if not ok.any():
            return out
        c0, c1 = int(np.floor(fc[ok].min())), min(L['w'] - 1, int(np.floor(fc[ok].max())) + 1)
        r0, r1 = int(np.floor(fr[ok].min())), min(L['h'] - 1, int(np.floor(fr[ok].max())) + 1)
        win = np.full((r1 - r0 + 1, c1 - c0 + 1), np.nan, np.float32)
        for bj in range(r0 // L['th'], r1 // L['th'] + 1):
            for bi in range(c0 // L['tw'], c1 // L['tw'] + 1):
                b = self._block(lv, bi, bj)
                y0, x0 = bj * L['th'], bi * L['tw']
                ya, yb = max(r0, y0), min(r1, y0 + L['th'] - 1)
                xa, xb = max(c0, x0), min(c1, x0 + L['tw'] - 1)
                win[ya - r0:yb - r0 + 1, xa - c0:xb - c0 + 1] = b[ya - y0:yb - y0 + 1, xa - x0:xb - x0 + 1]
        win[win < -1000] = np.nan                                            # no-data (-9999, -32767)
        fr, fc = fr[ok] - r0, fc[ok] - c0
        i0 = np.clip(np.floor(fc).astype(int), 0, max(0, win.shape[1] - 2))
        j0 = np.clip(np.floor(fr).astype(int), 0, max(0, win.shape[0] - 2))
        i1, j1 = np.minimum(i0 + 1, win.shape[1] - 1), np.minimum(j0 + 1, win.shape[0] - 1)
        tx, ty = np.clip(fc - i0, 0, 1), np.clip(fr - j0, 0, 1)
        out[ok] = (win[j0, i0] * (1 - tx) + win[j0, i1] * tx) * (1 - ty) + (win[j1, i0] * (1 - tx) + win[j1, i1] * tx) * ty
        return out


# ------------------------------------------------------------------------------------------ SWEREF 99 TM
def sweref99tm(lat, lon):
    """WGS84/SWEREF 99 latitude, longitude (degrees) → SWEREF 99 TM (northing, easting) in metres
    (Lantmäteriet's Gauss–Krüger formulas, GRS 80, central meridian 15° E, scale 0.9996, false easting 500 km)."""
    a, f = 6378137.0, 1 / 298.257222101
    e2 = f * (2 - f)
    n = f / (2 - f)
    ar = a / (1 + n) * (1 + n * n / 4 + n ** 4 / 64)
    A = e2
    B = (5 * e2 ** 2 - e2 ** 3) / 6
    C = (104 * e2 ** 3 - 45 * e2 ** 4) / 120
    D = 1237 * e2 ** 4 / 1260
    b1 = n / 2 - 2 * n ** 2 / 3 + 5 * n ** 3 / 16 + 41 * n ** 4 / 180
    b2 = 13 * n ** 2 / 48 - 3 * n ** 3 / 5 + 557 * n ** 4 / 1440
    b3 = 61 * n ** 3 / 240 - 103 * n ** 4 / 140
    b4 = 49561 * n ** 4 / 161280
    phi, lam = np.radians(lat), np.radians(lon)
    s = np.sin(phi)
    phis = phi - s * np.cos(phi) * (A + B * s ** 2 + C * s ** 4 + D * s ** 6)
    dl = lam - np.radians(15.0)
    xi = np.arctan(np.tan(phis) / np.cos(dl))
    eta = np.arctanh(np.cos(phis) * np.sin(dl))
    k = 0.9996 * ar
    north = k * (xi + b1 * np.sin(2 * xi) * np.cosh(2 * eta) + b2 * np.sin(4 * xi) * np.cosh(4 * eta)
                 + b3 * np.sin(6 * xi) * np.cosh(6 * eta) + b4 * np.sin(8 * xi) * np.cosh(8 * eta))
    east = k * (eta + b1 * np.cos(2 * xi) * np.sinh(2 * eta) + b2 * np.cos(4 * xi) * np.sinh(4 * eta)
                + b3 * np.cos(6 * xi) * np.sinh(6 * eta) + b4 * np.cos(8 * xi) * np.sinh(8 * eta)) + 500000.0
    return north, east


# ------------------------------------------------------------------------------------------ sources
def copernicus(lat, lon):
    """Copernicus GLO-30 heights at arrays of lat/lon (NaN where there is no tile)."""
    out = np.full(lat.shape, np.nan, np.float32)
    used = []
    for lat_i in range(math.floor(lat.min()), math.floor(lat.max()) + 1):
        for lon_i in range(math.floor(lon.min()), math.floor(lon.max()) + 1):
            ns = f'{"N" if lat_i >= 0 else "S"}{abs(lat_i):02d}'
            ew = f'{"E" if lon_i >= 0 else "W"}{abs(lon_i):03d}'
            name = f'Copernicus_DSM_COG_10_{ns}_00_{ew}_00_DEM'
            sel = (lat >= lat_i) & (lat < lat_i + 1) & (lon >= lon_i) & (lon < lon_i + 1)
            if not sel.any():
                continue
            try:
                cog = Cog(f'{COPERNICUS}/{name}/{name}.tif')
            except urllib.error.HTTPError as exc:
                if exc.code in (403, 404):          # no tile: open sea
                    out[sel] = 0.0
                    used.append(f'{name} (sea)')
                    continue
                raise
            out[sel] = cog.sample(0, lon[sel], lat[sel])
            used.append(name)
    return out, used


def lantmateriet_auth():
    """The Authorization header for Lantmäteriet's downloads from .env, or None."""
    user, pw = os.environ.get('LANTMATERIET_USER'), os.environ.get('LANTMATERIET_PASSWORD')
    if user and pw:
        return 'Basic ' + base64.b64encode(f'{user}:{pw}'.encode()).decode()
    key, secret = os.environ.get('LANTMATERIET_CONSUMER_KEY'), os.environ.get('LANTMATERIET_CONSUMER_SECRET')
    if key and secret:
        req = urllib.request.Request(LM_TOKEN, data=b'grant_type=client_credentials',
                                     headers={'User-Agent': USER_AGENT, 'Content-Type': 'application/x-www-form-urlencoded',
                                              'Authorization': 'Basic ' + base64.b64encode(f'{key}:{secret}'.encode()).decode()})
        with urllib.request.urlopen(req, timeout=60) as res:
            return 'Bearer ' + json.loads(res.read())['access_token']
    return None


def lantmateriet(lat, lon, auth, pixel):
    """Markhöjdmodell heights at arrays of lat/lon from the STAC items that cover them (NaN elsewhere)."""
    north, east = sweref99tm(lat, lon)
    bbox = f'{lon.min():.6f},{lat.min():.6f},{lon.max():.6f},{lat.max():.6f}'
    url = f'{LM_STAC}/search?' + urllib.parse.urlencode({'collections': 'dtm-cog', 'bbox': bbox, 'limit': 100})
    items = []
    while url:
        page = json.loads(get(url))
        items += page.get('features', [])
        url = next((l['href'] for l in page.get('links', []) if l.get('rel') == 'next'), None)
    out = np.full(lat.shape, np.nan, np.float32)
    used = []
    for it in items:
        href = it['assets']['data']['href']
        cog = Cog(href, {'Authorization': auth})
        z = cog.sample(cog.level_for(pixel), east, north)
        fill = np.isnan(out) & ~np.isnan(z)
        out[fill] = z[fill]
        used.append(it['id'])
    return out, used


def fetch(place: dict) -> dict:
    proj = projection_for(place)
    ext = place['size_m'] / 2 + MARGIN_M
    auth = None
    if place.get('country_code', '').lower() == 'se':
        try:
            auth = lantmateriet_auth()
        except Exception as exc:
            say(f'  ! Lantmäteriet login failed ({exc}); using Copernicus')
    if place.get('country_code', '').lower() == 'se' and not auth:
        say('  Tip: a free Geotorget account gives Swedish places a 1 m ground model (see .env.example)')
    step = LM_STEP if auth else 30.0
    n = int(math.ceil(2 * ext / step)) + 1
    xs = -ext + np.arange(n) * step
    X, Y = np.meshgrid(xs, xs)                       # row = y (south → north), column = x (west → east)
    lat, lon = proj.lat0 + Y / EARTH, proj.lon0 + X / proj.kx
    z = np.full(X.shape, np.nan, np.float32)
    sources, attribution, kind = [], [], 'dsm'
    if auth:
        try:
            z, used = lantmateriet(lat, lon, auth, step / 2)
            if used:
                sources += [f'Lantmäteriet {u}' for u in used]
                attribution.append(LM_ATTRIBUTION)
                kind = 'dtm'
        except urllib.error.HTTPError as exc:
            hint = ' (no access: order "Markhöjdmodell Nedladdning" on Geotorget)' if exc.code in (401, 403) else ''
            say(f'  ! Lantmäteriet: HTTP {exc.code}{hint}; using Copernicus')
    if np.isnan(z).any():
        holes = np.isnan(z)
        cz, used = copernicus(lat[holes], lon[holes])
        z[holes] = cz
        sources += used
        attribution.append(COPERNICUS_ATTRIBUTION)
        if kind == 'dtm' and holes.mean() > 0.05:
            say(f'  Lantmäteriet covers {100 * (1 - holes.mean()):.0f} %; Copernicus fills the rest')
    z[(z < -500) | (z > 9000)] = np.nan
    if np.isnan(z).all():
        raise RuntimeError('no elevation data for this place')
    z = np.where(np.isnan(z), np.nanmin(z), z)
    return {'source': 'Lantmäteriet Markhöjdmodell (DTM)' if kind == 'dtm' else 'Copernicus DEM GLO-30 (DSM)', 'kind': kind,
            'attribution': ' · '.join(attribution), 'tiles': sources, 'frame': 'local',
            'x0': float(xs[0]), 'y0': float(xs[0]), 'step': step, 'n': n, 'z': [round(float(v), 2) for v in z.ravel()]}


def main(argv=None):
    ap = argparse.ArgumentParser(prog='fetch_terrain.py')
    ap.add_argument('slug')
    ap.add_argument('--force', action='store_true')
    args = ap.parse_args(argv)
    folder = city_dir(args.slug)
    out = folder / 'terrain.json'
    if out.exists() and not args.force:
        say('  terrain.json is already there (use --refresh to download again)')
        step_done(args.slug, 'terrain', cached=True)
        return
    try:
        data = fetch(load_place(args.slug))
    except Exception as exc:  # offline or the source is unreachable: build the city flat
        say(f'  ! no terrain ({exc}); the city will be flat. Try again later with: python3 sustainable.py build {args.slug} --only terrain')
        return
    write_json(out, data, compact=True)
    z = data['z']
    say(f'  {data["n"]}×{data["n"]} heights every {data["step"]:g} m ({data["source"]}): {min(z):.0f}–{max(z):.0f} m above sea level')
    step_done(args.slug, 'terrain', source=data['source'], low=min(z), high=max(z))


if __name__ == '__main__':
    main()
