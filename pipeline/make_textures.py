"""Procedural, seamless PBR textures for generated cities (no downloads, no API keys).

Writes cache/textures/T_<Name>_{BaseColor,Normal,Roughness}.png and textures.json.
Facade textures cover exactly one window bay × one storey, so windows always line up with the
UVs that prepare_city.py writes. Wall and roof textures are neutral and get tinted per building:
the BaseColor alpha channel is a tint mask (255 = wall, tinted; 0 = frames/glass/sills, kept).
Ground textures carry their own colour and cover 4 × 4 m.

Inspired by the kalmar-kvarnholmen material generators (make_town_materials.py and friends).
"""
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path

import numpy as np
from PIL import Image

from common import ROOT, say

OUT = ROOT / 'cache/textures'
VERSION = 3
STYLE = json.loads((ROOT / 'pipeline/style.json').read_text())


# ------------------------------------------------------------------------------------------ noise
class Gen:
    def __init__(self, n, seed):
        self.n = n
        self.rng = np.random.default_rng(seed)
        k = np.fft.fftfreq(n)
        self.k2 = k[None, :] ** 2 + k[:, None] ** 2

    def noise(self, sigma):
        """Periodic (seamless) gaussian-filtered noise with unit variance; sigma in pixels."""
        f = np.fft.fft2(self.rng.normal(size=(self.n, self.n)))
        a = np.real(np.fft.ifft2(f * np.exp(-self.k2 * (2 * np.pi * sigma) ** 2 / 2)))
        return a / (a.std() + 1e-8)

    def grid(self):
        y, x = np.mgrid[0:self.n, 0:self.n] / self.n
        return x, 1 - y  # u to the right, v upwards (image row 0 is the top)


def save(name, rgb, height, rough, mask=None, strength=1.0):
    """rgb in sRGB 0..1 (H,W,3); height in metres; rough 0..1; mask 0..1 or None."""
    n = rgb.shape[0]
    rgb = np.clip(rgb, 0, 1)
    base = (rgb * 255 + 0.5).astype(np.uint8)
    if mask is not None:
        a = (np.clip(mask, 0, 1) * 255 + 0.5).astype(np.uint8)
        Image.fromarray(np.dstack([base, a]), 'RGBA').save(OUT / f'T_{name}_BaseColor.png', optimize=True)
    else:
        Image.fromarray(base, 'RGB').save(OUT / f'T_{name}_BaseColor.png', optimize=True)
    px = strength * n / 4.0  # height metres → slope over a ~4 m texture
    dx = (np.roll(height, -1, 1) - np.roll(height, 1, 1)) * px
    dy = (np.roll(height, -1, 0) - np.roll(height, 1, 0)) * px
    nrm = np.dstack([-dx, dy, np.ones_like(dx)])
    nrm /= np.linalg.norm(nrm, axis=2, keepdims=True)
    Image.fromarray(((nrm * 0.5 + 0.5) * 255 + 0.5).astype(np.uint8), 'RGB').save(OUT / f'T_{name}_Normal.png', optimize=True)
    Image.fromarray((np.clip(rough, 0, 1) * 255 + 0.5).astype(np.uint8), 'L').save(OUT / f'T_{name}_Roughness.png', optimize=True)
    return {'mean': [round(float(c), 4) for c in rgb.reshape(-1, 3).mean(0)], 'size': n}


def rect(x, y, x0, x1, y0, y1):
    return (x >= x0) & (x < x1) & (y >= y0) & (y < y1)


def tone(g, base, amount=0.05, sigma=40):
    v = g.noise(sigma) * amount + g.noise(1.2) * amount * 0.4
    return np.clip(np.array(base)[None, None, :] * (1 + v[:, :, None]), 0, 1)


# ------------------------------------------------------------------------------------------ walls
def wall_pattern(style, g, bay, storey):
    """Neutral wall albedo/height/roughness for one bay × one storey."""
    x, y = g.grid()
    n = g.n
    if style == 'plaster':
        rgb = tone(g, (0.86, 0.85, 0.82), 0.035, 30)
        h = g.noise(1.0) * 0.0006 + g.noise(6) * 0.0008
        rough = 0.85 + g.noise(10) * 0.03
        band = rect(x, y, 0, 1, 0.0, 0.035)
        rgb[band] *= 0.93
        h = h - band * 0.004
    elif style == 'brick':
        cols, rows = 13, 40
        r = np.floor(y * rows).astype(int)
        u = x * cols + (r % 2) * 0.5
        c = np.floor(u).astype(int)
        fu, fv = u - np.floor(u), y * rows - r
        mortar = (fu < 0.06) | (fv < 0.14)
        rng = np.random.default_rng(7)
        var = rng.uniform(-0.1, 0.1, (rows + 1, cols + 2))[r % rows, c % cols]
        rgb = np.ones((n, n, 3)) * (0.80 + var)[:, :, None] * np.array([1.0, 0.97, 0.94])
        rgb = rgb * (1 + g.noise(1.0)[:, :, None] * 0.04)
        rgb[mortar] = [0.92, 0.91, 0.88]
        h = np.where(mortar, -0.006, 0.0) + g.noise(1.0) * 0.0006
        rough = np.where(mortar, 0.95, 0.82)
    elif style == 'wood':
        boards = round(bay / 0.2)
        u = x * boards
        fu = u - np.floor(u)
        groove = (fu < 0.05) | (fu > 0.95)
        batten = (fu > 0.42) & (fu < 0.58)
        grain = g.noise(0.8) * 0.02 + np.sin(y * 60 + g.noise(20) * 2) * 0.01
        rgb = np.ones((n, n, 3)) * (0.88 + grain)[:, :, None]
        rgb[groove] *= 0.7
        h = np.where(groove, -0.006, 0.0) + np.where(batten, 0.012, 0.0) + grain * 0.0004
        rough = 0.78 + g.noise(5) * 0.03
    elif style == 'stone':
        cols, rows = 6, 9
        r = np.floor(y * rows).astype(int)
        u = x * cols + (r % 2) * 0.5
        c = np.floor(u).astype(int)
        fu, fv = u - np.floor(u), y * rows - r
        joint = (fu < 0.025) | (fv < 0.04)
        rng = np.random.default_rng(11)
        var = rng.uniform(-0.07, 0.07, (rows + 1, cols + 2))[r % rows, c % cols]
        rgb = tone(g, (0.84, 0.82, 0.78), 0.04, 6) * (1 + var)[:, :, None]
        rgb[joint] *= 0.82
        h = np.where(joint, -0.008, 0.0) + g.noise(2) * 0.0015
        rough = 0.88 + g.noise(3) * 0.03
    elif style == 'concrete':
        rgb = tone(g, (0.82, 0.81, 0.79), 0.05, 12)
        joint = rect(x, y, 0, 0.012, 0, 1) | rect(x, y, 0.988, 1, 0, 1) | rect(x, y, 0, 1, 0, 0.01)
        rgb[joint] *= 0.75
        h = g.noise(1.2) * 0.0008 - joint * 0.006
        rough = 0.9 + g.noise(4) * 0.03
    elif style == 'metal':
        ribs = round(bay / 0.15)
        u = x * ribs
        prof = np.abs(np.sin(np.pi * u))
        rgb = np.ones((n, n, 3)) * (0.82 + prof * 0.06)[:, :, None] * (1 + g.noise(20)[:, :, None] * 0.03)
        h = prof * 0.02
        rough = 0.55 + g.noise(8) * 0.04
    else:  # glass curtain wall frame colour
        rgb = tone(g, (0.80, 0.80, 0.80), 0.02, 20)
        h = g.noise(2) * 0.0003
        rough = 0.45 + 0 * h
    return rgb, h, np.clip(rough, 0, 1)


def window(g, rgb, h, rough, mask, bay, storey, x0m, x1m, y0m, y1m, frame=(0.92, 0.92, 0.9), muntins=True, sill=True, surround=0.0):
    """Draw one window (metres within the bay/storey) into the arrays. Untinted parts get mask 0."""
    x, y = g.grid()
    X, Y = x * bay, y * storey
    if surround:
        s = rect(X, Y, x0m - surround, x1m + surround, y0m - surround * 0.6, y1m + surround)
        rgb[s] = np.array(frame) * 0.97
        mask[s] = 0
        h[s] += 0.01
    outer = rect(X, Y, x0m, x1m, y0m, y1m)
    rgb[outer] = frame
    mask[outer] = 0
    rough[outer] = 0.5
    h[outer] = -0.03
    f = 0.07
    glass = rect(X, Y, x0m + f, x1m - f, y0m + f, y1m - f)
    gy = (Y - y0m) / max(y1m - y0m, 1e-3)
    refl = 0.06 + 0.10 * np.clip(gy, 0, 1) ** 2 + g.noise(30) * 0.012
    gcol = np.dstack([refl * 0.85, refl * 1.0, refl * 1.15])
    rgb[glass] = gcol[glass]
    rough[glass] = 0.08
    h[glass] = -0.09
    if muntins:
        xm = (x0m + x1m) / 2
        bars = rect(X, Y, xm - 0.03, xm + 0.03, y0m, y1m) | rect(X, Y, x0m, x1m, y0m + (y1m - y0m) * 0.68 - 0.03, y0m + (y1m - y0m) * 0.68 + 0.03)
        rgb[bars] = frame
        h[bars] = -0.04
        rough[bars] = 0.5
    if sill:
        s = rect(X, Y, x0m - 0.08, x1m + 0.08, y0m - 0.07, y0m)
        rgb[s] = (0.78, 0.77, 0.74)
        mask[s] = 0
        h[s] = 0.035
        rough[s] = 0.7


def facade(style, kind, g):
    spec = STYLE['wall_styles'][style]
    bay = spec['bay']
    storey = STYLE['ground_storey_m'] if kind == 'Ground' else STYLE['storey_m']
    rgb, h, rough = wall_pattern(style, g, bay, storey)
    mask = np.ones(h.shape)
    x, y = g.grid()
    X, Y = x * bay, y * storey
    cx = bay / 2
    if kind == 'Blank':
        return rgb, h, rough, mask
    if style == 'glass':
        # Curtain wall: mullions at the bay edges, a spandrel band at floor level, glass in between.
        glass = rect(X, Y, 0.06, bay - 0.06, 0.85 if kind == 'Upper' else 0.1, storey - 0.06)
        gy = Y / storey
        refl = 0.10 + 0.16 * gy + g.noise(50) * 0.02
        gcol = np.dstack([refl * 0.8, refl * 0.95, refl * 1.1])
        rgb[glass] = gcol[glass]
        mask[glass] = 0
        rough[glass] = 0.05
        h[glass] = -0.03
        return rgb, h, rough, mask
    if style == 'metal':
        band = (0.62, 0.8) if kind == 'Upper' else None
        if band:
            window(g, rgb, h, rough, mask, bay, storey, 0.1, bay - 0.1, band[0] * storey, band[1] * storey, frame=(0.35, 0.37, 0.38), muntins=False, sill=False)
        else:
            door = rect(X, Y, cx - 0.5, cx + 0.5, 0, 2.1)
            rgb[door] *= 0.75
            h[door] -= 0.02
        return rgb, h, rough, mask
    if kind == 'Ground':
        if style == 'wood':
            window(g, rgb, h, rough, mask, bay, storey, cx - 0.55, cx + 0.55, 0.95, 2.3)
            return rgb, h, rough, mask
        # Shop front: a wide display window with a dark sign band above it.
        window(g, rgb, h, rough, mask, bay, storey, 0.22, bay - 0.22, 0.45, 2.85, frame=(0.2, 0.21, 0.22), muntins=False, sill=False)
        sign = rect(X, Y, 0.05, bay - 0.05, 3.0, 3.35)
        rgb[sign] = (0.16, 0.16, 0.15)
        mask[sign] = 0
        h[sign] = 0.02
        rough[sign] = 0.6
        plinth = rect(X, Y, 0, bay, 0, 0.42)
        rgb[plinth] *= 0.72
        mask[plinth] = 0
        return rgb, h, rough, mask
    # Upper floors
    ww, wh, sill = {'wood': (1.0, 1.3, 0.95), 'brick': (1.15, 1.6, 0.85), 'stone': (1.1, 1.75, 0.8), 'concrete': (1.4, 1.45, 0.9)}.get(style, (1.12, 1.65, 0.85))
    surround = 0.11 if style in ('plaster', 'wood') else 0.0
    frame = (0.93, 0.93, 0.9) if style != 'concrete' else (0.3, 0.31, 0.32)
    window(g, rgb, h, rough, mask, bay, storey, cx - ww / 2, cx + ww / 2, sill, sill + wh, frame=frame, surround=surround)
    if style == 'brick':
        lint = rect(X, Y, cx - ww / 2 - 0.08, cx + ww / 2 + 0.08, sill + wh, sill + wh + 0.16)
        rgb[lint] *= 0.86
        h[lint] += 0.006
    return rgb, h, rough, mask


# ------------------------------------------------------------------------------------------ roofs
def roof(kind, g):
    x, y = g.grid()  # 2 × 2 m: u along the eave, v up the slope
    n = g.n
    if kind == 'tiles':
        rows, cols = 7, 10
        u, v = x * cols, y * rows
        fv = v - np.floor(v)
        roll = np.cos((u - np.floor(u)) * 2 * np.pi)
        lap = np.exp(-((1 - fv) / 0.06) ** 2)
        rng = np.random.default_rng(3)
        var = rng.uniform(-0.08, 0.08, (rows + 1, cols + 1))[np.floor(v).astype(int) % rows, np.floor(u).astype(int) % cols]
        rgb = np.ones((n, n, 3)) * (0.82 + var - lap * 0.18 + roll[:, :] * 0.03)[:, :, None]
        h = roll * 0.012 + fv * 0.01 - lap * 0.01
        rough = 0.75 + g.noise(4) * 0.03
    elif kind == 'metal':
        u = x * 4
        fu = u - np.floor(u)
        seam = np.exp(-((fu - 0.5) / 0.03) ** 2)
        rgb = np.ones((n, n, 3)) * (0.84 + seam * 0.06 + g.noise(40) * 0.025)[:, :, None]
        h = seam * 0.025
        rough = 0.45 + g.noise(12) * 0.05
    elif kind == 'slate':
        rows, cols = 9, 7
        r = np.floor(y * rows).astype(int)
        u = x * cols + (r % 2) * 0.5
        fu, fv = u - np.floor(u), y * rows - r
        edge = (fu < 0.03) | (fv > 0.94)
        rng = np.random.default_rng(5)
        var = rng.uniform(-0.06, 0.06, (rows + 1, cols + 2))[r % rows, np.floor(u).astype(int) % cols]
        rgb = np.ones((n, n, 3)) * (0.8 + var + g.noise(1) * 0.02)[:, :, None]
        rgb[edge] *= 0.7
        h = fv * 0.006 - edge * 0.006
        rough = 0.7 + g.noise(3) * 0.04
    else:  # flat: bitumen with gravel speckles
        speck = g.noise(0.7)
        rgb = np.ones((n, n, 3)) * (0.82 + speck * 0.05 + g.noise(30) * 0.04)[:, :, None]
        h = speck * 0.002
        rough = 0.92 + 0 * h
    return rgb, h, np.clip(rough, 0, 1)


# ------------------------------------------------------------------------------------------ ground (4 × 4 m, coloured)
def coloured(rgb, col):
    return np.clip(rgb * np.array(col)[None, None, :] / max(np.mean(col), 1e-3) * np.mean(col), 0, 1)


def ground(name, col, g):
    x, y = g.grid()
    n = g.n
    rng = np.random.default_rng(abs(hash(name)) % 2 ** 31)
    base = np.array(col)
    if name in ('asphalt', 'parking'):
        grain = g.noise(0.8)
        rgb = base[None, None, :] * (1 + (grain * 0.08 + g.noise(60) * 0.06)[:, :, None])
        crack = np.abs(g.noise(25)) < 0.015
        rgb[crack] *= 0.6
        h = grain * 0.0008 - crack * 0.004
        rough = 0.88 + grain * 0.02
        if name == 'parking':
            line = rect(x, y, 0.0, 0.025, 0, 1)
            rgb[line] = (0.8, 0.78, 0.7)
    elif name in ('cobble', 'paving', 'sidewalk', 'quay', 'curb'):
        cols, rows, gap = {'cobble': (34, 40, 0.12), 'paving': (8, 8, 0.03), 'sidewalk': (12, 12, 0.025), 'quay': (5, 10, 0.03), 'curb': (8, 2, 0.02)}[name]
        r = np.floor(y * rows).astype(int)
        u = x * cols + (r % 2) * (0.5 if name in ('cobble', 'quay', 'curb') else 0)
        fu, fv = u - np.floor(u), y * rows - r
        joint = (fu < gap) | (fu > 1 - gap) | (fv < gap) | (fv > 1 - gap)
        var = rng.uniform(-0.12, 0.12, (rows + 1, cols + 2))[r % rows, np.floor(u).astype(int) % (cols + 2)]
        rgb = base[None, None, :] * (1 + var + g.noise(1.0) * 0.04)[:, :, None]
        rgb[joint] *= 0.62
        dome = np.minimum(np.minimum(fu, 1 - fu), np.minimum(fv, 1 - fv))
        h = np.where(joint, -0.01, np.minimum(dome * (0.05 if name == 'cobble' else 0.01), 0.008)) + g.noise(1) * 0.0005
        rough = np.where(joint, 0.95, 0.8)
    elif name in ('path', 'rail', 'dirt', 'ground', 'sand'):
        pebble = g.noise(1.5 if name != 'rail' else 3)
        rgb = base[None, None, :] * (1 + (pebble * (0.12 if name != 'sand' else 0.04) + g.noise(50) * 0.08)[:, :, None])
        h = pebble * (0.004 if name in ('path', 'rail') else 0.002)
        rough = 0.95 + 0 * h
        if name == 'ground':
            patches = g.noise(45) > 0.7
            rgb[patches] = rgb[patches] * 0.55 + np.array([0.33, 0.38, 0.22]) * 0.45
    elif name == 'pier':
        u = x * 20
        fu = u - np.floor(u)
        joint = fu < 0.06
        var = rng.uniform(-0.1, 0.1, 21)[np.floor(u).astype(int) % 21]
        rgb = base[None, None, :] * (1 + var + g.noise(0.8) * 0.03 + np.sin(y * 90 + g.noise(15)) * 0.03)[:, :, None]
        rgb[joint] *= 0.4
        h = joint * -0.01
        rough = 0.85 + 0 * h
    elif name == 'water':
        w = g.noise(6) * 0.6 + g.noise(2) * 0.4
        rgb = base[None, None, :] * (1 + w * 0.05)[:, :, None]
        h = w * 0.01
        rough = 0.06 + 0 * h
    else:  # grass-like: park, grass, cemetery, pitch, forest, field
        blades = g.noise(0.6)
        clumps = g.noise(25)
        rgb = base[None, None, :] * (1 + (blades * 0.12 + clumps * 0.1)[:, :, None])
        if name == 'forest':
            litter = g.noise(1.5) > 0.6
            rgb[litter] = rgb[litter] * 0.5 + np.array([0.36, 0.27, 0.17]) * 0.5
        if name == 'pitch':
            stripes = (np.floor(x * 2) % 2) == 1
            rgb[stripes] *= 1.08
        if name == 'field':
            # Summer ley and crops: drill rows a few decimetres apart, slightly wavering, and the paler
            # swathes and darker wheel tracks a season of mowing leaves.
            rows = np.sin((y * 40 + g.noise(40) * 0.25) * 2 * np.pi) * 0.5 + 0.5
            rgb *= (0.92 + 0.12 * rows)[:, :, None]
            swathe = g.noise(70) > 0.45
            rgb[swathe] = rgb[swathe] * 0.82 + np.array([0.66, 0.64, 0.38]) * 0.18
            track = np.abs(((x * 2 + g.noise(60) * 0.02) % 1) - 0.5) < 0.012
            rgb[track] *= 0.86
        h = blades * 0.002
        rough = 0.95 + 0 * h
    return np.clip(rgb, 0, 1), h, np.clip(rough, 0, 1)


def misc(name, g):
    x, y = g.grid()
    if name == 'Bark':
        rgb = tone(g, (0.32, 0.26, 0.20), 0.15, 2)
        h = g.noise(1.5) * 0.004
        return rgb, h, 0.95 + 0 * h, None
    if name in ('Leaf', 'Conifer'):
        col = (0.26, 0.38, 0.17) if name == 'Leaf' else (0.16, 0.27, 0.15)
        blobs = g.noise(2.5)
        rgb = np.array(col)[None, None, :] * (1 + (blobs * 0.22 + g.noise(0.7) * 0.1)[:, :, None])
        return np.clip(rgb, 0, 1), blobs * 0.01, 0.9 + 0 * blobs, None
    if name == 'Hedge':
        blobs = g.noise(1.5)
        rgb = np.array((0.2, 0.31, 0.14))[None, None, :] * (1 + (blobs * 0.2)[:, :, None])
        return np.clip(rgb, 0, 1), blobs * 0.01, 0.92 + 0 * blobs, None
    if name == 'StoneWall':
        rgb, h, rough = wall_pattern('stone', g, 3.4, 3.0)
        return rgb * np.array([0.88, 0.86, 0.8]), h * 2, rough, None
    if name == 'PoleMetal':
        rgb = tone(g, (0.16, 0.18, 0.18), 0.05, 10)
        return rgb, g.noise(3) * 0.0005, 0.45 + 0 * x, None
    if name == 'LampGlass':
        rgb = tone(g, (0.98, 0.9, 0.7), 0.01, 10)
        return rgb, 0 * x, 0.2 + 0 * x, None
    if name == 'BenchWood':
        u = y * 12
        fu = u - np.floor(u)
        rgb = tone(g, (0.45, 0.32, 0.2), 0.08, 1.5)
        rgb[fu < 0.08] *= 0.5
        return rgb, (fu < 0.08) * -0.004, 0.75 + 0 * x, None
    if name == 'Concrete':
        rgb, h, rough = wall_pattern('concrete', g, 3.0, 3.0)
        return rgb * 0.85, h, rough, None
    if name == 'RailSteel':
        rgb = tone(g, (0.36, 0.3, 0.26), 0.1, 2)
        return rgb, 0 * x, 0.5 + 0 * x, None
    if name == 'Grave':
        rgb = tone(g, (0.52, 0.52, 0.5), 0.08, 3)
        return rgb, g.noise(1) * 0.002, 0.85 + 0 * x, None
    raise KeyError(name)


# ------------------------------------------------------------------------------------------ main
def fingerprint():
    return hashlib.sha1((json.dumps(STYLE, sort_keys=True) + str(VERSION) + Path(__file__).read_text()).encode()).hexdigest()[:12]


def main(argv=None):
    ap = argparse.ArgumentParser(prog='sustainable.py textures')
    ap.add_argument('--force', action='store_true')
    args = ap.parse_args(argv)
    OUT.mkdir(parents=True, exist_ok=True)
    manifest_path = OUT / 'textures.json'
    fp = fingerprint()
    if manifest_path.exists() and not args.force and json.loads(manifest_path.read_text()).get('fingerprint') == fp:
        say('Textures are up to date (cache/textures).')
        return
    say('Generating procedural textures (one time, ~1 minute) …')
    manifest = {'fingerprint': fp, 'textures': {}}
    for style in STYLE['wall_styles']:
        for kind in ('Upper', 'Ground', 'Blank'):
            g = Gen(512, abs(hash((style, kind))) % 2 ** 31)
            rgb, h, rough, mask = facade(style, kind, g)
            name = f'Wall{style.title()}{kind}'
            manifest['textures'][name] = {**save(name, rgb, h, rough, mask, 1.0), 'tinted': True, 'kind': 'wall'}
    for kind in STYLE['roof_styles']:
        g = Gen(512, abs(hash(('roof', kind))) % 2 ** 31)
        rgb, h, rough = roof(kind, g)
        name = f'Roof{kind.title()}'
        manifest['textures'][name] = {**save(name, rgb, h, rough, np.ones(h.shape), 0.5), 'tinted': True, 'kind': 'roof'}
    for name, spec in STYLE['surfaces'].items():
        if name.startswith('_'):
            continue
        g = Gen(1024, abs(hash(('ground', name))) % 2 ** 31)
        rgb, h, rough = ground(name, spec['colour'], g)
        tname = f'Ground{name.title()}'
        manifest['textures'][tname] = {**save(tname, rgb, h, rough, None, 1.0), 'tinted': False, 'kind': 'ground'}
    for name, col in (('water', (0.12, 0.2, 0.22)), ('quay', (0.55, 0.53, 0.5)), ('curb', (0.62, 0.61, 0.58))):
        g = Gen(512, abs(hash(('extra', name))) % 2 ** 31)
        rgb, h, rough = ground(name, col, g)
        tname = name.title()
        manifest['textures'][tname] = {**save(tname, rgb, h, rough, None, 1.0), 'tinted': False, 'kind': 'misc'}
    for name in ('Bark', 'Leaf', 'Conifer', 'Hedge', 'StoneWall', 'PoleMetal', 'LampGlass', 'BenchWood', 'Concrete', 'RailSteel', 'Grave'):
        g = Gen(256, abs(hash(('misc', name))) % 2 ** 31)
        rgb, h, rough, mask = misc(name, g)
        manifest['textures'][name] = {**save(name, rgb, h, rough, mask, 1.0), 'tinted': False, 'kind': 'misc'}
    manifest_path.write_text(json.dumps(manifest, indent=1))
    say(f'Wrote {len(manifest["textures"])} texture sets to cache/textures/')


if __name__ == '__main__':
    main()
