import { LANG, L, LOCALE, t, dec } from '../i18n.js';
import * as PLACE_INDICATORS from '@city/indicators.js';
const { INDICATORS:PLACE={}, KEY_FIGURES:PLACE_FIGURES }=PLACE_INDICATORS;
// The place's measures: their display metadata (INDICATOR_DEFS) and its names and notes for them (INDICATORS).
const GENERIC=PLACE_INDICATORS.INDICATOR_DEFS||{};
// Display metadata for the place's indicators. A place gives its own names and notes,
// `base` – the record in its research/baseline.json the 2026 value comes from (its source is shown in
// the interface) – and the measures only it has (@city/indicators.js). `assumption` marks indicators
// that are model constructs rather than measured statistics.
// Number formats follow the interface language (decimal comma and "42 %" in Swedish).
const pct=v=>LANG==='sv'?`${Math.round(v*100)} %`:`${Math.round(v*100)}%`,pct1=v=>`${dec(v*100,1)}${LANG==='sv'?' %':'%'}`;
const num=(d=0)=>v=>v.toLocaleString(LOCALE,{maximumFractionDigits:d,minimumFractionDigits:d});
export const INDICATORS={};
for(const k of new Set([...Object.keys(GENERIC),...Object.keys(PLACE)]))INDICATORS[k]={...GENERIC[k],...PLACE[k]};
// The key-figure board, in reading order: the place's own (KEY_FIGURES), else its first fifteen measures.
export const KEY_FIGURES=PLACE_FIGURES||Object.keys(INDICATORS).slice(0,15);

if(LANG!=='sv')for(const m of Object.values(INDICATORS)){m.name=L(m.name);m.unit=L(m.unit);if(m.note)m.note=L(m.note);}
