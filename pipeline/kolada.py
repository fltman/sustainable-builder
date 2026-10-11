"""Kolada: the standard key figures for a Swedish municipality, as sourced research records.

    python3 pipeline/kolada.py <slug> [--kommun 2031]

Fetches every key figure in pipeline/research/kolada-catalogue.json (the ones the research behind
Kalmar 2126 took straight from Kolada: population and ages, emissions, energy, cars, health, trust,
schools, work, housing, waste …) for the place's municipality, the latest year Kolada has, with the
country's and the county's value for that year beside it, and writes them in the baseline schema to
cities/<slug>/vision/research/deep/kolada.json (+ kolada.en.json), where the research merge picks them
up. Kolada (RKA) is open and needs no key; one request at a time.
"""
from __future__ import annotations

import argparse
import json
import sys
import time
import urllib.parse
import urllib.request
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CATALOGUE = ROOT / 'pipeline' / 'research' / 'kolada-catalogue.json'
API = 'https://api.kolada.se/v3'
SWEDEN = '0000'                                    # Kolada's id for the whole country
HEADERS = {'Accept': 'application/json', 'User-Agent': 'sustainable-builder/0.1 (research; github.com/fltman)'}


def get(url: str, tries: int = 3):
    for i in range(tries):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=HEADERS), timeout=40) as r:
                return json.load(r)
        except Exception as e:  # noqa: BLE001 – retried, then reported
            if i == tries - 1:
                raise RuntimeError(f'Kolada did not answer: {url} ({e})') from e
            time.sleep(2 * (i + 1))


def municipality(place: dict, given: str | None) -> tuple[str, str]:
    """(Kolada id, title) of the place's municipality: given, or from the place's address."""
    if given:
        rows = get(f'{API}/municipality/{given}').get('values', [])
        return given, rows[0]['title'] if rows else given
    parts = [p.strip() for p in place.get('display_name', '').split(',')]
    kommun = next((p for p in parts if p.endswith(' kommun')), None)
    names = []
    if kommun:
        base = kommun[:-len(' kommun')]
        names += [base[:-1] if base.endswith('s') else base, base]
    names.append(place.get('name', ''))
    for name in [n for n in names if n]:
        rows = [r for r in get(f'{API}/municipality?title={urllib.parse.quote(name)}').get('values', []) if r.get('type') == 'K']
        exact = [r for r in rows if r['title'].lower() == name.lower()]
        if exact or len(rows) == 1:
            r = (exact or rows)[0]
            return r['id'], r['title']
    sys.exit(f'Could not find the municipality of {place.get("display_name")} in Kolada; give it with --kommun <id> '
             f'(https://api.kolada.se/v3/municipality?title=…).')


def genitive(name: str) -> str:
    return name if name.endswith(('s', 'x', 'z')) else name + 's'


def number(v: float, lang: str) -> str:
    """A figure as it is written: 48,5 / 0,314 / 12 300 in Swedish, 48.5 / 0.314 / 12,300 in English."""
    a = abs(v)
    s = f'{v:,.0f}' if a >= 100 else f'{v:.1f}' if a >= 1 else f'{v:.3f}'
    return s.replace(',', ' ').replace('.', ',') if lang == 'sv' else s


def measure(v: float, unit: str, lang: str) -> str:
    unit = unit.split(' (')[0]                      # (an explanation in the unit is said once, by the record)
    if unit.startswith(('index', 'kvot', 'ratio')):
        return number(v, lang)
    if unit.startswith('%'):
        return number(v, lang) + (' %' if lang == 'sv' else '%') + unit[1:]
    return f'{number(v, lang)} {unit}'


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__.split('\n\n')[0])
    ap.add_argument('slug')
    ap.add_argument('--kommun', help='Kolada municipality id (four digits), if the place name is ambiguous')
    a = ap.parse_args()
    city = ROOT / 'cities' / a.slug
    place = json.loads((city / 'place.json').read_text(encoding='utf-8'))
    mid, title = municipality(place, a.kommun)
    kommun = f'{genitive(title)} kommun' if not title.endswith('kommun') else title
    print(f'Kolada: {kommun} ({mid})')
    cat = json.loads(CATALOGUE.read_text(encoding='utf-8'))['kpis']
    county = '00' + mid[:2]                         # the county (region) the municipality lies in
    fill = lambda s: (s or '').replace('{kommun}', kommun).replace('{name}', title).replace('{municipality}', f'{title} Municipality')
    records, en, missing = [], {}, []
    for k in cat:
        ids = [mid, SWEDEN, county] if k.get('compare') else [mid]
        series = get(f'{API}/data/kpi/{k["kpi"]}/municipality/{",".join(ids)}').get('values', [])
        values = {}
        for p in series:
            v = next((x.get('value') for x in p.get('values', []) if x.get('gender') == k['gender']), None)
            if v is not None:
                values[(p['municipality'], p['period'])] = v
        time.sleep(.15)
        years = [y for (m, y) in values if m == mid]
        if not years:
            missing.append(k['id'])
            continue
        year = max(years)
        value = values[(mid, year)]
        # The country and the county the same year, where Kolada has them.
        land, lan = values.get((SWEDEN, year)), values.get((county, year))
        unit_en = k.get('unit_en') or k['unit']
        sv = [f'{w} {measure(v, k["unit"], "sv")}' for w, v in (('riket', land), ('länet', lan)) if v is not None]
        en_ = [f'{w} {measure(v, unit_en, "en")}' for w, v in (('Sweden', land), ('the county', lan)) if v is not None]
        cap = lambda t: t[:1].upper() + t[1:]
        compare_sv = f' {cap(", ".join(sv))} ({year}).' if sv else ''
        compare_en = f' {cap(", ".join(en_))} ({year}).' if en_ else ''
        records.append({
            'id': k['id'], 'sdg': k['sdg'], 'name_sv': fill(k['name_sv']), 'value': round(value, 3), 'unit': k['unit'],
            'year': year, 'scope': kommun, 'direction': k['direction'],
            'source': {'title': fill(k['title']) or f'Kolada {k["kpi"]}', 'publisher': 'RKA Kolada',
                       'url': f'{API}/data/kpi/{k["kpi"]}/municipality/{mid}/year/{year}'},
            'note_sv': (k.get('about_sv') or f'Koladas nyckeltal {k["kpi"]}.') + compare_sv,
            'confidence': 'high',
        })
        en[k['id']] = {'name': fill(k.get('name_en')) or k['id'], 'unit': unit_en,
                       'note': (k.get('about_en') or f'Kolada key figure {k["kpi"]}.') + compare_en}
    # Into the place's vision: its own (cities/<slug>/vision), or the bundled example's.
    vision = next((d for d in (city / 'vision', ROOT / 'examples' / a.slug / 'vision') if (d / 'config.js').exists()), city / 'vision')
    out = vision / 'research' / 'deep'
    out.mkdir(parents=True, exist_ok=True)
    doc = {'topic': 'kolada', 'compiled': date.today().isoformat(), 'kommun': {'id': mid, 'name': kommun}, 'indicators': records}
    (out / 'kolada.json').write_text(json.dumps(doc, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
    (out / 'kolada.en.json').write_text(json.dumps({'indicators': en}, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
    print(f'{len(records)} key figures written to {out / "kolada.json"}'
          + (f'; Kolada has no figure for {len(missing)}: {", ".join(missing)}' if missing else ''))


if __name__ == '__main__':
    main()
