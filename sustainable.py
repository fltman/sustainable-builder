#!/usr/bin/env python3
"""Sustainable Builder — turn any place into a research-based vision of its next hundred years.

    python3 sustainable.py doctor                    check and install everything (run once)
    python3 sustainable.py make "Ystad"              find the place, build its city, fetch Kolada, start a vision
    python3 sustainable.py new "Ystad" [--size …]    find the place, write cities/<slug>/place.json
    python3 sustainable.py build ystad               OSM → Blender city → web tiles → pack
    python3 sustainable.py horizon ystad             the land and water round the model out to ~10 km
    python3 sustainable.py research ystad kolada     the municipality's key figures from Kolada (Sweden)
    python3 sustainable.py research ystad merge      deep research (vision/research/deep/*.json) → baseline.json
    python3 sustainable.py research ystad check      the vision's numbers against its research
    python3 sustainable.py vision ystad init         a first vision (cities/<slug>/vision/) to write on
    python3 sustainable.py site ystad                the site at http://localhost:5230
    python3 sustainable.py look ystad                pictures of the running site, and its errors
    python3 sustainable.py test [ystad]              the site's tests (the Kalmar example by default)
    python3 sustainable.py list | status <slug>
    python3 sustainable.py buildings <slug> --street "Strandgatan"   list houses to refine (Street View links)
    python3 sustainable.py rebuild <slug>            rebuild after overrides.json / custom/*.py changes
    python3 sustainable.py survey <slug> plan        Street View viewpoints for houses not checked yet (then: compare DIR)
    python3 sustainable.py seed <slug> --ids …       housekit starter scripts from the overrides notes
    python3 sustainable.py render <slug> [...]       review images from Blender
    python3 sustainable.py film-voices <slug>        the film's narration (ElevenLabs, costs credits)
    python3 sustainable.py film <slug>               the film: render, mix, web copies (needs vision/film.js)
    python3 sustainable.py publish <slug>            static website in site/dist/
    python3 sustainable.py selftest                  offline pipeline tests + site tests

Only the Python standard library is needed to run this file; heavier work runs in .venv, Blender and Node.
The city pipeline is wasteland-builder's (github.com/fltman/wasteland-builder); the site is Kalmar 2126's
engine (bjarby.com/kalmar-2126), made place-independent.
"""
from __future__ import annotations

import argparse
import json
import os
import platform
import re
import shutil
import subprocess
import sys
import time
import webbrowser
from pathlib import Path

ROOT = Path(__file__).resolve().parent
PIPE = ROOT / 'pipeline'
CITIES = ROOT / 'cities'
SITE = ROOT / 'site'
VENV = ROOT / '.venv'
WIN = platform.system() == 'Windows'
VPY = VENV / ('Scripts/python.exe' if WIN else 'bin/python')
STEPS = ['fetch', 'terrain', 'prepare', 'textures', 'blender', 'export', 'tiles', 'pack', 'splash']
MIN_BLENDER = (4, 2)

B, D, G, Y, R, X = ('\033[1m', '\033[2m', '\033[32m', '\033[33m', '\033[31m', '\033[0m') if sys.stdout.isatty() and not WIN else ('',) * 6


def say(msg=''):
    print(msg, flush=True)


def head(msg):
    say(f'\n{B}▸ {msg}{X}')


def die(msg, hint=None):
    say(f'{R}✗ {msg}{X}')
    if hint:
        say(f'  {hint}')
    sys.exit(1)


def load_env():
    """Read KEY=value lines from .env (API keys stay local; never printed)."""
    path = ROOT / '.env'
    if path.exists():
        for line in path.read_text().splitlines():
            m = re.match(r'\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$', line)
            if m and not line.lstrip().startswith('#') and m.group(1) not in os.environ:
                os.environ[m.group(1)] = m.group(2).strip().strip('"\'')


def run(cmd, cwd=ROOT, env=None, quiet_filter=None):
    cmd = [str(c) for c in cmd]
    if quiet_filter is None:
        r = subprocess.run(cmd, cwd=cwd, env={**os.environ, **(env or {})})
        if r.returncode:
            die(f'Command failed ({r.returncode}): {" ".join(cmd[:4])} …')
        return
    # Blender is chatty: show only our own progress lines, keep the full log for errors.
    p = subprocess.Popen(cmd, cwd=cwd, env={**os.environ, **(env or {})}, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, errors='replace')
    log = []
    for line in p.stdout:
        log.append(line)
        if quiet_filter(line):
            print('  ' + line.rstrip(), flush=True)
    if p.wait():
        tail = ''.join(log[-40:])
        die(f'Command failed: {" ".join(cmd[:4])} …', 'Last output:\n' + tail)


def py(script, *args):
    if not VPY.exists():
        die('The Python environment is missing.', 'Run: python3 sustainable.py doctor')
    run([VPY, PIPE / script, *args], cwd=PIPE)


# ------------------------------------------------------------------------------------------ tools
def find_blender():
    cands = [os.environ.get('BLENDER')]
    if platform.system() == 'Darwin':
        cands += ['/Applications/Blender.app/Contents/MacOS/Blender', str(Path.home() / 'Applications/Blender.app/Contents/MacOS/Blender')]
    elif WIN:
        for base in (os.environ.get('ProgramFiles', r'C:\Program Files'), os.environ.get('LOCALAPPDATA', '')):
            cands += sorted((Path(base) / 'Blender Foundation').glob('Blender*/blender.exe'), reverse=True) if base else []
    cands += [shutil.which('blender'), '/snap/bin/blender', '/usr/bin/blender']
    for c in cands:
        if c and Path(c).exists():
            return str(c)
    return None


def blender_version(exe):
    try:
        out = subprocess.run([exe, '--version'], capture_output=True, text=True, timeout=120).stdout
        m = re.search(r'Blender (\d+)\.(\d+)', out)
        return (int(m.group(1)), int(m.group(2))) if m else None
    except Exception:
        return None


def blender(*args):
    exe = find_blender()
    if not exe:
        die('Blender was not found.', 'Install Blender 4.2 or newer from https://www.blender.org/download/ (or set BLENDER=/path/to/blender).')
    run([exe, *args], quiet_filter=lambda l: 'Not freed' not in l and (l.startswith(('[build]', 'EXPORT_TILES_OK', 'BUILD_CITY_OK', 'SPLASH_OK', 'RENDERED', 'Error', 'Traceback')) or 'Error:' in l))


def node_ok():
    n = shutil.which('node')
    if not n:
        return None
    try:
        v = subprocess.run([n, '--version'], capture_output=True, text=True).stdout.strip().lstrip('v')
        return tuple(int(x) for x in v.split('.')[:2])
    except Exception:
        return None


def npm(*args, cwd):
    exe = shutil.which('npm') or die('npm was not found.', 'Install Node.js 20 or newer from https://nodejs.org/')
    run([exe, *args], cwd=cwd)


# ------------------------------------------------------------------------------------------ doctor
def cmd_doctor(a):
    ok = True
    head('Python')
    if sys.version_info < (3, 10):
        die(f'Python {platform.python_version()} is too old.', 'Install Python 3.10 or newer from https://www.python.org/downloads/')
    say(f'  {G}✓{X} Python {platform.python_version()}')
    if not VPY.exists():
        say('  creating .venv …')
        run([sys.executable, '-m', 'venv', VENV])
    stamp = VENV / '.requirements'
    req = (ROOT / 'requirements.txt').read_text()
    if not stamp.exists() or stamp.read_text() != req:
        say('  installing Python packages (shapely, numpy, pillow, elevenlabs …)')
        run([VPY, '-m', 'pip', 'install', '-q', '--disable-pip-version-check', '-r', ROOT / 'requirements.txt'])
        stamp.write_text(req)
    say(f'  {G}✓{X} .venv with geometry packages')

    head('Node.js')
    v = node_ok()
    if not v or v < (20, 0):
        ok = False
        say(f'  {R}✗{X} Node.js 20+ is needed (found {".".join(map(str, v)) if v else "none"}). Install from https://nodejs.org/')
    else:
        say(f'  {G}✓{X} Node {".".join(map(str, v))}')
        for folder in (SITE, PIPE / 'web'):
            if not (folder / 'node_modules').exists():
                say(f'  installing packages in {folder.relative_to(ROOT)} …')
                npm('ci' if (folder / 'package-lock.json').exists() else 'install', '--no-audit', '--no-fund', cwd=folder)
        say(f'  {G}✓{X} site and tile tools installed')
        if not list(Path.home().glob('Library/Caches/ms-playwright/chromium-*')) and not list(Path.home().glob('.cache/ms-playwright/chromium-*')):
            say('  installing a browser for looking at the site (Playwright Chromium) …')
            run([shutil.which('npx') or 'npx', 'playwright', 'install', 'chromium'], cwd=SITE)
        say(f'  {G}✓{X} browser for `look`')

    head('Blender')
    exe = find_blender()
    ver = blender_version(exe) if exe else None
    if not exe or not ver:
        ok = False
        say(f'  {R}✗{X} Blender not found. Install 4.2 or newer: https://www.blender.org/download/  (or set BLENDER=/path/to/blender)')
    elif ver < MIN_BLENDER:
        ok = False
        say(f'  {R}✗{X} Blender {ver[0]}.{ver[1]} is too old; 4.2 or newer is needed.')
    else:
        say(f'  {G}✓{X} Blender {ver[0]}.{ver[1]} ({exe})')

    head('Textures')
    if VPY.exists():
        py('make_textures.py')

    head('Skills for Claude Code and Codex')
    link = ROOT / '.claude/skills'
    if link.is_symlink() or (link.exists() and (link / 'build-sustainable/SKILL.md').exists()):
        say(f'  {G}✓{X} .agents/skills (Codex) and .claude/skills (Claude Code)')
    else:
        try:
            link.parent.mkdir(exist_ok=True)
            if link.exists():
                shutil.rmtree(link)
            link.symlink_to(Path('..') / '.agents' / 'skills', target_is_directory=True)
        except OSError:
            shutil.copytree(ROOT / '.agents/skills', link)
        say(f'  {G}✓{X} linked .claude/skills → .agents/skills')

    head('Optional services (.env)')
    load_env()
    for key, use in (('ELEVENLABS_API_KEY', 'a narrator and sounds for the site and its film'),
                     ('OPENAI_API_KEY', 'link-preview and poster art from the imagegen script (Codex can draw without a key)'),
                     ('OPENROUTER_API_KEY', 'alternative art via Gemini (Claude Code)'),
                     ('LANTMATERIET_USER', 'Swedish cities: 1 m terrain from Lantmäteriet (free Geotorget account)')):
        say(f'  {G + "✓" + X if os.environ.get(key) else D + "–" + X} {key:20} {use}')
    say(f'  {D}–{X} Suno: no key; the agent uses suno.com in your browser (or use any mp3 as the soundtrack)')

    free = shutil.disk_usage(ROOT).free / 1e9
    say(f'\n  Disk: {free:.0f} GB free (a city needs ~0.3–1 GB while building)')
    if ok:
        say(f'\n{G}{B}Ready.{X} Try:  python3 sustainable.py make "Ystad"')
    else:
        say(f'\n{Y}Fix the items marked ✗ and run doctor again.{X}')
        sys.exit(1)


# ------------------------------------------------------------------------------------------ cities
def slug_of(name):
    if name and (CITIES / name / 'place.json').exists():
        return name
    if name:
        from_name = re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')
        if (CITIES / from_name / 'place.json').exists():
            return from_name
    known = sorted(p.parent.name for p in CITIES.glob('*/place.json'))
    if not name and len(known) == 1:
        return known[0]
    die(f'Unknown city "{name or ""}".', f'Known: {", ".join(known) or "none yet"}. Create one with: python3 sustainable.py new "<place>"')


def status(slug):
    p = CITIES / slug / 'status.json'
    return json.loads(p.read_text()) if p.exists() else {}


def mark(slug, step, **info):
    path = CITIES / slug / 'status.json'
    st = json.loads(path.read_text()) if path.exists() else {}
    st[step] = {**st.get(step, {}), 'done': time.strftime('%Y-%m-%d %H:%M:%S'), **info}
    path.write_text(json.dumps(st, indent=2, ensure_ascii=False))


def cmd_new(a):
    args = [a.query, '--size', str(a.size), '--pick', str(a.pick)]
    if a.center:
        args += ['--center', a.center]
    if a.slug:
        args += ['--slug', a.slug]
    if a.name:
        args += ['--name', a.name]
    py('place.py', *args)


def cmd_build(a):
    slug = slug_of(a.slug)
    folder = CITIES / slug
    steps = STEPS
    if a.only:
        steps = [s.strip() for s in a.only.split(',')]
    elif a.start:
        steps = STEPS[STEPS.index(a.start):]
    t0 = time.time()
    for step in steps:
        t = time.time()
        head(f'{step}')
        if step == 'fetch':
            py('fetch_osm.py', slug, *(['--force'] if a.refresh else []))
        elif step == 'terrain':
            load_env()                       # LANTMATERIET_* for Sweden's 1 m ground model
            py('fetch_terrain.py', slug, *(['--force'] if a.refresh else []))
        elif step == 'prepare':
            py('prepare_city.py', slug)
        elif step == 'textures':
            py('make_textures.py')
        elif step == 'blender':
            blender('-b', '--factory-startup', '--python-exit-code', '1', '--python', PIPE / 'blender/build_city.py', '--', slug)
        elif step == 'export':
            raw = folder / 'build/raw'
            shutil.rmtree(raw, ignore_errors=True)
            blender('-b', folder / 'city.blend', '--python-exit-code', '1', '--python', PIPE / 'blender/export_tiles.py', '--', raw)
        elif step == 'tiles':
            run([shutil.which('node') or 'node', PIPE / 'web/tiles.mjs', folder / 'build/raw', folder / 'pack/tiles'])
        elif step == 'pack':
            py('make_pack.py', slug)
            # The site's extras in the pack: street addresses, and the flood map where there is water.
            node = shutil.which('node') or 'node'
            if (folder / 'osm.json').exists():
                run([node, SITE / 'tools/addresses.mjs', slug], cwd=SITE)
            city_json = folder / 'city.json'
            if (folder / 'terrain.json').exists() and city_json.exists() and (json.loads(city_json.read_text()).get('terrain') or {}).get('lake') is not None:
                run([node, SITE / 'tools/flood-map.mjs', slug], cwd=SITE)
        elif step == 'splash':
            media = folder / 'media'
            if any((media / f'splash.{e}').exists() for e in ('jpg', 'png', 'webp')) and not a.force_splash:
                say('  custom splash in media/ — keeping it (render the default anyway with --force-splash)')
            else:
                blender('-b', folder / 'city.blend', '--python-exit-code', '1', '--python', PIPE / 'blender/render_splash.py', '--', slug)
            py('make_pack.py', slug)
        else:
            die(f'Unknown step {step}', f'Steps: {", ".join(STEPS)}')
        mark(slug, step, seconds=round(time.time() - t))
        say(f'  {D}{time.time() - t:.0f} s{X}')
    say(f'\n{G}{B}Done in {time.time() - t0:.0f} s.{X}  Next:  python3 sustainable.py research {slug} kolada   ·   python3 sustainable.py site {slug}')


def cmd_rebuild(a):
    a.start, a.only, a.refresh = 'prepare', None, False
    cmd_build(a)


def cmd_list(a):
    rows = []
    for p in sorted(CITIES.glob('*/place.json')):
        place = json.loads(p.read_text())
        st = status(p.parent.name)
        done = [s for s in STEPS if s in st]
        rows.append((p.parent.name, place['display_name'][:60], f'{place["size_m"]} m', 'ready' if 'pack' in st else (done[-1] if done else 'new')))
    if not rows:
        say('No cities yet. Try: python3 sustainable.py make "Visby"')
    for r in rows:
        say(f'  {B}{r[0]:16}{X} {r[2]:>7}  {r[3]:8}  {D}{r[1]}{X}')
    cur = SITE / '.city'
    if cur.exists():
        say(f'\n  the site shows: {cur.read_text().strip()}')


def cmd_status(a):
    slug = slug_of(a.slug)
    st = status(slug)
    place = json.loads((CITIES / slug / 'place.json').read_text())
    say(f'{B}{place["name"]}{X}  {place["display_name"]}  ({place["size_m"]} m)')
    for s in STEPS[:-1]:
        info = st.get(s)
        say(f'  {G + "✓" + X if info else D + "·" + X} {s:9} {D}{info.get("done", "") if info else ""}{X}')
    city = CITIES / slug
    vision = vision_of(slug) or city / 'vision'
    for label, path in (('overrides.json', city / 'overrides.json'), ('custom buildings', city / 'custom'),
                        ('vision/config.js – names, places in the model', vision / 'config.js'), ('vision/model.js – starting values', vision / 'model.js'),
                        ('research: Kolada', vision / 'research/deep/kolada.json'), ('research: merged baseline', vision / 'research/baseline.json'),
                        ('the Journey (decisions.js)', vision / 'decisions.js'), ('the family (family.js)', vision / 'family.js'),
                        ('own soundtrack', city / 'pack/audio/music.mp3'), ('film', city / 'pack/film')):
        say(f'  {G + "✓" + X if path.exists() else D + "–" + X} {label}')


def cmd_buildings(a):
    slug = slug_of(a.slug)
    args = [slug]
    for k in ('street', 'near', 'radius', 'id', 'name', 'limit'):
        v = getattr(a, k)
        if v is not None:
            args += [f'--{k}', str(v)]
    if a.json:
        args.append('--json')
    py('buildings.py', *args)


def cmd_render(a):
    slug = slug_of(a.slug)
    out = CITIES / slug / 'renders'
    specs = list(a.views)
    if a.street or a.near:
        r = subprocess.run([VPY, PIPE / 'buildings.py', slug, '--views', *(['--street', a.street] if a.street else ['--near', a.near])],
                           cwd=PIPE, capture_output=True, text=True)
        if r.returncode:
            die(r.stderr.strip() or r.stdout.strip())
        specs += r.stdout.split()
    blender('-b', CITIES / slug / 'city.blend', '--python-exit-code', '1', '--python', PIPE / 'blender/render_views.py', '--', out, *specs)
    say(f'Images in {out.relative_to(ROOT)}/')


def cmd_survey(a):
    slug = slug_of(a.slug)
    if a.action == 'plan':
        args = [slug, 'plan', '--max', str(a.max)]
        for k in ('street', 'near', 'out'):
            if getattr(a, k):
                args += [f'--{k}', getattr(a, k)]
        if a.unsurveyed:
            args.append('--unsurveyed')
        py('survey.py', *args)
        return
    d = Path(a.dir).resolve() if a.dir else CITIES / slug / 'survey'
    py('survey.py', slug, 'views', d)
    blender('-b', CITIES / slug / 'city.blend', '--python-exit-code', '1', '--python', PIPE / 'blender/render_survey.py', '--',
            d / 'views.json', d / 'render')
    py('survey.py', slug, 'sheets', d)


def cmd_seed(a):
    slug = slug_of(a.slug)
    args = [slug] + (['--ids', a.ids] if a.ids else []) + (['--force'] if a.force else []) + (['--unsurveyed'] if a.unsurveyed else [])
    py('housekit_seed.py', *args)


# ------------------------------------------------------------------------------------------ the site
def vision_of(slug):
    for base in (CITIES, ROOT / 'examples'):
        if (base / slug / 'vision/config.js').exists():
            return base / slug / 'vision'
    return None


def link_site(slug):
    """Point the site at a place: site/.city names it (the site serves its pack, cities/<slug>/pack, as /city)."""
    pack = CITIES / slug / 'pack'
    if not (pack / 'tiles/tiles.json').exists():
        die(f'{slug} has no city model yet.', f'Run: python3 sustainable.py build {slug}')
    if not vision_of(slug):
        die(f'{slug} has no vision yet (cities/{slug}/vision/config.js).',
            f'Start one with: python3 sustainable.py vision {slug} init   (the build-sustainable skill writes the rest)')
    (SITE / '.city').write_text(slug)


def cmd_site(a):
    slug = slug_of(a.slug)
    link_site(slug)
    if not (SITE / 'node_modules').exists():
        die('The site\'s packages are missing.', 'Run: python3 sustainable.py doctor')
    url = f'http://localhost:{a.port}/'
    say(f'{G}{B}The site shows {slug}.{X}  Open {url}  (Ctrl+C stops the server)')
    if a.no_serve:
        return
    if a.open:
        webbrowser.open(url)
    run([shutil.which('npx') or 'npx', 'vite', '--host', '0.0.0.0', '--port', str(a.port), '--strictPort'], cwd=SITE, env={'CITY': slug})


def cmd_look(a):
    slug = slug_of(a.slug)
    args = ['--url', f'http://127.0.0.1:{a.port}/', '--out', str(CITIES / slug / 'renders/site')]
    if a.years:
        args += ['--years', a.years]
    if a.plans:
        args += ['--plans', a.plans]
    run([shutil.which('node') or 'node', SITE / 'tools/look.mjs', *args], cwd=SITE, env={'CITY': slug})


def cmd_research(a):
    slug = slug_of(a.slug)
    if a.action == 'kolada':
        run([sys.executable, PIPE / 'kolada.py', slug, *(['--kommun', a.kommun] if a.kommun else [])])
    elif a.action == 'merge':
        run([shutil.which('node') or 'node', SITE / 'tools/merge-research.mjs', slug])
    elif a.action == 'check':
        run([shutil.which('node') or 'node', '--import', './test/register.mjs', 'tools/check-place.mjs'], cwd=SITE, env={'CITY': slug})


def cmd_vision(a):
    slug = slug_of(a.slug)
    run([shutil.which('node') or 'node', SITE / 'tools/init-vision.mjs', slug, *(['--force'] if a.force else [])])


def cmd_test(a):
    slug = a.slug or 'kalmar'
    run([shutil.which('npm') or 'npm', 'test'], cwd=SITE, env={'CITY': slug})


def cmd_make(a):
    """new + build + Kolada + a first vision – the one-command start (the build-sustainable skill does the rest)."""
    cmd_new(a)
    known = sorted(CITIES.glob('*/place.json'), key=lambda p: p.stat().st_mtime)
    slug = a.slug or known[-1].parent.name
    cmd_build(argparse.Namespace(slug=slug, only=None, start=None, refresh=False, force_splash=False))
    cmd_horizon(argparse.Namespace(slug=slug, radius=10000, step=50))
    place = json.loads((CITIES / slug / 'place.json').read_text())
    if place.get('country_code') == 'se':
        cmd_research(argparse.Namespace(slug=slug, action='kolada', kommun=None))
    if not vision_of(slug):
        cmd_vision(argparse.Namespace(slug=slug, force=False))
    say(f'\n{G}{B}{slug}: the city model and a first vision are ready.{X}  Next: research (the research-city skill), then  python3 sustainable.py site {slug}')


def cmd_publish(a):
    slug = slug_of(a.slug)
    link_site(slug)
    run([shutil.which('npx') or 'npx', 'vite', 'build'], cwd=SITE, env={'CITY': slug})   # copies the pack into dist/city
    size = sum(f.stat().st_size for f in (SITE / 'dist').rglob('*') if f.is_file()) / 1e6
    say(f'{G}{B}Website ready:{X} site/dist/ ({size:.0f} MB). Upload its contents to any web host.')


def cmd_selftest(a):
    head('Pipeline (offline, synthetic OSM data)')
    run([VPY, '-m', 'unittest', 'discover', '-s', ROOT / 'tests'])
    head('Site (the Kalmar example: the model must reproduce Kalmar 2126)')
    run([shutil.which('npm') or 'npm', 'test'], cwd=SITE, env={'CITY': 'kalmar'})
    say(f'{G}{B}All tests passed.{X}')


def cmd_horizon(a):
    """The land, water, woods and buildings round the model out to ~10 km (pipeline/horizon.py)."""
    slug = slug_of(a.slug)
    py('horizon.py', slug, '--radius', str(a.radius), '--step', str(a.step), *(['--refresh'] if getattr(a, 'refresh', False) else []))


def cmd_example(a):
    """A bundled example (examples/<slug>: place.json, overrides.json, custom/ and vision/): builds its city
    model and horizon in cities/<slug>/; the site then reads its vision from the example."""
    src = ROOT / 'examples' / a.slug
    if not (src / 'place.json').exists():
        die(f'No example to build: examples/{a.slug}/place.json',
            'Kalmar\'s pack is Kalmar 2126\'s own (see examples/kalmar/README.md); the others: ' +
            ', '.join(p.parent.name for p in sorted((ROOT / 'examples').glob('*/place.json'))))
    dst = CITIES / a.slug
    dst.mkdir(parents=True, exist_ok=True)
    for name in ('place.json', 'overrides.json'):
        if (src / name).exists() and not (dst / name).exists():
            shutil.copy2(src / name, dst / name)
    if (src / 'custom').exists() and not (dst / 'custom').exists():
        shutil.copytree(src / 'custom', dst / 'custom')
    cmd_build(argparse.Namespace(slug=a.slug, only=None, start=None, refresh=False, force_splash=False))
    cmd_horizon(argparse.Namespace(slug=a.slug, radius=10000, step=50))
    say(f'\n{G}{B}{a.slug}: built from the example.{X}  Next:  python3 sustainable.py site {a.slug}')


def cmd_film_voices(a):
    slug = slug_of(a.slug)
    load_env()
    py('film_voices.py', slug, '--lang', a.lang, *(['--only', a.only] if a.only else []), *(['--force'] if a.force else []))


def cmd_film(a):
    """The place's film (cities/<slug>/vision/film.js): render both languages, mix, and make the web copies."""
    slug = slug_of(a.slug)
    vision = vision_of(slug)
    if not vision or not (vision / 'film.js').exists():
        die(f'{slug} has no film.js yet.', 'Write cities/<slug>/vision/film.js (scenes, end card, narration) – see the build-sustainable skill, "Film".')
    link_site(slug)
    if not shutil.which('ffmpeg'):
        die('ffmpeg is needed for the film.', 'Install it (macOS: brew install ffmpeg; Linux: apt install ffmpeg).')
    import urllib.request
    env = {**os.environ, 'CITY': slug, 'FILM_PORT': str(a.port)}
    server = subprocess.Popen([shutil.which('npx') or 'npx', 'vite', '--config', 'vite.film.config.js', '--port', str(a.port), '--strictPort'],
                              cwd=SITE, env=env, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    try:
        for _ in range(120):
            try:
                urllib.request.urlopen(f'http://127.0.0.1:{a.port}/', timeout=2)
                break
            except Exception:
                time.sleep(.5)
        for lang in a.lang.split(','):
            head(f'film ({lang})')
            run([shutil.which('node') or 'node', 'tools/film.mjs'], cwd=SITE, env={**env, 'FILM_LANG': lang})
            run([shutil.which('node') or 'node', 'tools/film-web.mjs'], cwd=SITE, env={**env, 'FILM_LANG': lang})
    finally:
        server.terminate()
    say(f'{G}{B}Film ready{X} in cities/{slug}/pack/film/ – the site shows it on the start screen and in the menu.')


def main():
    ap = argparse.ArgumentParser(prog='sustainable.py', description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest='cmd', required=True)
    sub.add_parser('doctor', help='check and install everything').set_defaults(fn=cmd_doctor)
    for name, fn, hlp in (('new', cmd_new, 'find a place and create cities/<slug>/'), ('make', cmd_make, 'new + build + Kolada + a first vision')):
        p = sub.add_parser(name, help=hlp)
        p.add_argument('query')
        p.add_argument('--size', default='medium', help='small (600 m), medium (1000 m), large (1600 m) or metres')
        p.add_argument('--pick', type=int, default=1)
        p.add_argument('--center')
        p.add_argument('--slug')
        p.add_argument('--name')
        p.set_defaults(fn=fn)
    p = sub.add_parser('build', help='run the city pipeline (OSM → Blender → tiles → pack)')
    p.add_argument('slug', nargs='?')
    p.add_argument('--from', dest='start', choices=STEPS)
    p.add_argument('--only', help='comma separated steps: ' + ','.join(STEPS))
    p.add_argument('--refresh', action='store_true', help='download OSM data and terrain again')
    p.add_argument('--force-splash', action='store_true')
    p.set_defaults(fn=cmd_build)
    p = sub.add_parser('rebuild', help='prepare → … → pack (after overrides or custom buildings)')
    p.add_argument('slug', nargs='?')
    p.add_argument('--force-splash', action='store_true')
    p.set_defaults(fn=cmd_rebuild)
    p = sub.add_parser('research', help='kolada: the municipality\'s key figures · merge: deep research → baseline · check: the vision against its research')
    p.add_argument('slug', nargs='?')
    p.add_argument('action', choices=['kolada', 'merge', 'check'])
    p.add_argument('--kommun', help='Kolada municipality id, if the name is ambiguous')
    p.set_defaults(fn=cmd_research)
    p = sub.add_parser('vision', help='init: a first vision for the place (cities/<slug>/vision/) from its research and map')
    p.add_argument('slug', nargs='?')
    p.add_argument('action', choices=['init'])
    p.add_argument('--force', action='store_true')
    p.set_defaults(fn=cmd_vision)
    p = sub.add_parser('site', help='show a place on the site (dev server)')
    p.add_argument('slug', nargs='?')
    p.add_argument('--port', type=int, default=5230)
    p.add_argument('--open', action='store_true', help='open the browser')
    p.add_argument('--no-serve', action='store_true', help='only point the site at the place')
    p.set_defaults(fn=cmd_site)
    p = sub.add_parser('look', help='pictures of the running site and any errors (cities/<slug>/renders/site/)')
    p.add_argument('slug', nargs='?')
    p.add_argument('--port', type=int, default=5230)
    p.add_argument('--years', help='e.g. 2026,2076,2126')
    p.add_argument('--plans', help='e.g. dagens,vision')
    p.set_defaults(fn=cmd_look)
    p = sub.add_parser('test', help="the site's tests for a place (default: the Kalmar example)")
    p.add_argument('slug', nargs='?')
    p.set_defaults(fn=cmd_test)
    sub.add_parser('list').set_defaults(fn=cmd_list)
    sub.add_parser('selftest', help='offline pipeline tests + site tests').set_defaults(fn=cmd_selftest)
    p = sub.add_parser('status')
    p.add_argument('slug', nargs='?')
    p.set_defaults(fn=cmd_status)
    p = sub.add_parser('buildings', help='list buildings for refinement')
    p.add_argument('slug', nargs='?')
    p.add_argument('--street')
    p.add_argument('--near', help='"lat,lon" or a landmark name')
    p.add_argument('--radius', type=float)
    p.add_argument('--id')
    p.add_argument('--name')
    p.add_argument('--limit', type=int)
    p.add_argument('--json', action='store_true')
    p.set_defaults(fn=cmd_buildings)
    p = sub.add_parser('render', help='review images from Blender (cities/<slug>/renders/)')
    p.add_argument('slug', nargs='?')
    p.add_argument('views', nargs='*', help='camera names or street:x,y,heading')
    p.add_argument('--street')
    p.add_argument('--near')
    p.set_defaults(fn=cmd_render)
    p = sub.add_parser('survey', help='Street View rounds: plan viewpoints, then compare frames with the model')
    p.add_argument('slug', nargs='?')
    p.add_argument('action', choices=['plan', 'compare'])
    p.add_argument('dir', nargs='?', help='compare: the folder with plan.json and the frames (default cities/<slug>/survey)')
    p.add_argument('--street')
    p.add_argument('--near', help='"lat,lon" or a landmark name')
    p.add_argument('--unsurveyed', action='store_true')
    p.add_argument('--max', type=int, default=40)
    p.add_argument('--out', help='plan: where plan.json goes (keep Street View frames outside the repository)')
    p.set_defaults(fn=cmd_survey)
    p = sub.add_parser('seed', help='housekit starter scripts (custom/<id>.py) from overrides.json notes')
    p.add_argument('slug', nargs='?')
    p.add_argument('--ids', help='comma separated building ids')
    p.add_argument('--force', action='store_true', help='replace untouched starter scripts (hand-edited ones are kept)')
    p.add_argument('--unsurveyed', action='store_true', help='also every other house, from its generated look')
    p.set_defaults(fn=cmd_seed)
    p = sub.add_parser('horizon', help='the land, water, woods and buildings round the model out to ~10 km')
    p.add_argument('slug', nargs='?')
    p.add_argument('--radius', type=float, default=10000)
    p.add_argument('--step', type=float, default=50)
    p.add_argument('--refresh', action='store_true', help='ask OpenStreetMap again (its answers are kept in horizon-osm/)')
    p.set_defaults(fn=cmd_horizon)
    p = sub.add_parser('example', help='build a bundled example place (examples/<slug>) – its city model and horizon')
    p.add_argument('slug')
    p.set_defaults(fn=cmd_example)
    p = sub.add_parser('film', help="render the place's film (vision/film.js) in both languages, with narration and music")
    p.add_argument('slug', nargs='?')
    p.add_argument('--lang', default='sv,en')
    p.add_argument('--port', type=int, default=5231)
    p.set_defaults(fn=cmd_film)
    p = sub.add_parser('film-voices', help="voice the film's narration with ElevenLabs (costs credits)")
    p.add_argument('slug', nargs='?')
    p.add_argument('--lang', default='sv,en')
    p.add_argument('--only')
    p.add_argument('--force', action='store_true')
    p.set_defaults(fn=cmd_film_voices)
    p = sub.add_parser('publish', help='build the static website (site/dist/)')
    p.add_argument('slug', nargs='?')
    p.set_defaults(fn=cmd_publish)
    a = ap.parse_args()
    load_env()
    a.fn(a)


if __name__ == '__main__':
    main()
