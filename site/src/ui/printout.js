import { el, doughnutChart } from './charts.js';
import { LEVERS, THEMES, LEVELS } from '../data/levers.js';
import { SDGS, DOUGHNUT } from '../data/sdg.js';
import { INDICATORS, KEY_FIGURES } from '../data/indicators.js';
import { BASELINE } from '../data/evidence.js';
import { visionSections } from '@city/vision-text.js';
import { t, LANG, LOCALE } from '../i18n.js';
import { CITY, PLACE } from '../city-config.js';

// "Min vision för Kalmar": the plan on paper (A4) to take to a meeting or a lesson – the city in the
// year shown, Kalmar index, the goals and the doughnut, the choices, the key figures against 2026 with
// their sources, the vision in words and what happened on the way. It is built in #print, which the
// print style sheet shows instead of the app (style.css), and handed to the browser's print dialog.
const mean=a=>a.reduce((s,v)=>s+v,0)/a.length;
export function buildPrintout({run,year,plan,world,url,image,lead}){
  document.getElementById('print')?.remove();
  const root=el('div');root.id='print';root.setAttribute('aria-hidden','true');
  const y=Math.floor(year),d=run.years[y-run.years[0].year],d0=run.years[0],start=d0.year;
  const date=new Date().toLocaleDateString(LOCALE,{year:'numeric',month:'long',day:'numeric'});

  // Page 1: the city, the index, the goals and the doughnut.
  const head=el('header','p-head');
  head.append(el('div','p-kicker',`${CITY.title}`),el('h1','',t(`Min vision för ${PLACE.name} ${y}`,`My vision for ${PLACE.name} ${y}`,`La mia visione per ${PLACE.name} ${y}`)),el('p','p-sub',`${plan} · ${world} · ${t('utskriven','printed','stampato in data')} ${date}`));
  root.append(head);
  if(image){const fig=el('figure','p-figure');const img=el('img');img.src=image;img.alt='';fig.append(img,el('figcaption','',lead?`${t(`${PLACE.centre} år ${y}`,`${PLACE.centre} in ${y}`,`${PLACE.centre} nel ${y}`)}. ${lead}`:t(`${PLACE.centre} år ${y}.`,`${PLACE.centre} in ${y}.`,`${PLACE.centre} nel ${y}.`)));root.append(fig);}
  const A=Math.round(mean(d.sdg)),A0=Math.round(mean(d0.sdg));
  const row=el('section','p-row p-avoid');
  const goals=el('div','p-goals');
  const idx=el('div','p-index');idx.append(el('b','',String(A)),el('span','',t(`${PLACE.name}-index ${y}, medel av de 17 globala målen där 100 är målbilden för ett hållbart ${PLACE.name}. 2026: ${A0}.`,`${PLACE.name} index ${y}: the mean of the 17 global goals, where 100 is the target for a sustainable ${PLACE.name}. 2026: ${A0}.`,`Indice ${PLACE.name} ${y}: la media dei 17 obiettivi globali, dove 100 è il traguardo per una ${PLACE.name} sostenibile. 2026: ${A0}.`)));
  goals.append(idx);
  const gt=el('table','p-table p-sdg');const gh=el('tr');gh.append(el('th','',t('Mål','Goal','Obiettivo')),el('th','num','2026'),el('th','num',String(y)));gt.append(gh);
  SDGS.forEach((g,i)=>{const tr=el('tr');const name=el('td');const sw=el('i');sw.style.background=g.color;name.append(sw,document.createTextNode(`${g.n} ${g.name}`));
    const dv=Math.round(d.sdg[i])-Math.round(d0.sdg[i]);tr.append(name,el('td','num',String(Math.round(d0.sdg[i]))),el('td','num',`${Math.round(d.sdg[i])}${dv?` (${dv>0?'+':'−'}${Math.abs(dv)})`:''}`));gt.append(tr);});
  goals.append(gt);
  const donut=el('div','p-donut');donut.append(el('h3','',t(`${PLACE.name}-munken ${y}`,`The ${PLACE.name} doughnut ${y}`,`La ciambella di ${PLACE.name} ${y}`)),doughnutChart(d.doughnut,DOUGHNUT,{size:260}),
    el('p','p-small',t('Den gröna ringen är det trygga och rättvisa utrymmet (Kate Raworth). Röda kilar inåt är brister i den sociala grunden, utåt överskridna ekologiska gränser.','The green ring is the safe and just space (Kate Raworth). Red wedges inward are shortfalls in the social foundation, outward overshoots of ecological limits.',"L'anello verde è lo spazio sicuro e giusto (Kate Raworth). I cunei rossi verso l'interno sono carenze nelle fondamenta sociali, quelli verso l'esterno limiti ecologici superati.")));
  row.append(goals,donut);root.append(row);

  // The choices, by theme; and when they change over the century.
  const choices=el('section','p-section p-break');choices.append(el('h2','',t('Vägvalen','The choices','Le scelte')));
  const policy=d.policy;
  const ct=el('table','p-table p-choices');
  for(const th of THEMES){
    const list=LEVERS.filter(l=>l.theme===th.id);if(!list.length)continue;
    const tr=el('tr','p-theme');const td=el('td');td.colSpan=3;const sw=el('i');sw.style.background=th.color;td.append(sw,document.createTextNode(th.name));tr.append(td);ct.append(tr);
    for(const l of list){const lv=policy[l.id]||0;const r=el('tr',lv?'':'p-dim');r.append(el('td','',l.name),el('td','p-level',LEVELS[lv]),el('td','',l.levels[lv]));ct.append(r);}
  }
  choices.append(ct);
  // Changes of course after 2026 (the journey's decades, a vision's later steps).
  const later=[];let prev=run.years[0].policy;
  for(const yr of run.years){if(yr.year>y)break;const ch=LEVERS.filter(l=>(yr.policy[l.id]||0)!==(prev[l.id]||0));if(yr.year>start&&ch.length)later.push(`${yr.year}: ${ch.map(l=>`${l.name} – ${LEVELS[yr.policy[l.id]||0].toLowerCase()}`).join(', ')}`);prev=yr.policy;}
  if(later.length){choices.append(el('h3','',t('Beslut längs vägen','Decisions along the way','Decisioni lungo il percorso')));const ul=el('ul','p-list');for(const x of later)ul.append(el('li','',x));choices.append(ul);}
  root.append(choices);

  // Key figures against 2026, with where the 2026 value comes from.
  const figs=el('section','p-section');figs.append(el('h2','',t('Nyckeltal','Key figures','Indicatori chiave')));
  const ft=el('table','p-table p-figs');const fh=el('tr');fh.append(el('th','',t('Nyckeltal','Figure','Indicatore')),el('th','num','2026'),el('th','num',String(y)),el('th','',t('Källa för 2026','Source for 2026','Fonte per il 2026')));ft.append(fh);
  for(const k of KEY_FIGURES){const m=INDICATORS[k];if(!m)continue;const src=m.base&&BASELINE[m.base];
    const tr=el('tr','p-avoid');const name=el('td');name.append(el('b','',m.name),el('span','p-unit',` ${m.unit}`));
    tr.append(name,el('td','num',m.fmt(d0.ind[k])),el('td','num',m.fmt(d.ind[k])),el('td','p-src',m.assumption?t('Modellbegrepp eller antagande','Model concept or assumption','Concetto del modello o ipotesi')+(src?` · ${src.source.publisher}`:''):src?`${src.source.publisher} (${src.year})`:''));ft.append(tr);}
  figs.append(ft);root.append(figs);

  // The vision in words, and the events on the way.
  const words=el('section','p-section p-break');words.append(el('h2','',t(`${PLACE.name} ${y} i ord`,`${PLACE.name} ${y} in words`,`${PLACE.name} ${y} in parole`)));
  for(const sec of visionSections(run,y)){const b=el('div','p-avoid p-vision');b.append(el('h3','',sec.title),el('p','',sec.text));words.append(b);}
  root.append(words);
  const events=run.chronicle.filter(e=>e.year<=y);
  if(events.length){const ev=el('section','p-section');ev.append(el('h2','',t('På vägen','On the way','Lungo il cammino')));
    for(const e of events){const b=el('div','p-avoid p-event');b.append(el('b','',`${e.year} · ${e.title}`),el('p','',e.text));ev.append(b);}
    root.append(ev);}

  // The main sources in a sentence (CITY.printSources: a few, in each language), else the place's whole list.
  const SOURCES=CITY.printSources||CITY.sources||{};
  const foot=el('footer','p-foot');
  foot.append(el('p','',t(`${PLACE.name} 2126 är ett tankeverktyg, inte en prognos. Utgångsläget är ${Object.keys(BASELINE).length} belagda uppgifter om ${PLACE.name} från bland andra ${SOURCES.sv}; effekterna bygger på forskning med källor. Planen: `,`${PLACE.name} 2126 is a thinking tool, not a forecast. The starting point is ${Object.keys(BASELINE).length} sourced figures on ${PLACE.name} from ${SOURCES.en} and others; the effects rest on cited research. The plan: `,`${PLACE.name} 2126 è uno strumento per pensare, non una previsione. Il punto di partenza sono ${Object.keys(BASELINE).length} dati documentati su ${PLACE.name}, da fonti come ${SOURCES.it??SOURCES.en}; gli effetti poggiano su ricerche con fonti. Il piano: `)),el('p','p-url',url));
  root.append(foot);
  document.body.append(root);
  return root;
}
// Print it: the image must be decoded before the dialog opens, and the printout goes once printed.
export async function printout(opts){
  const root=buildPrintout(opts);
  await Promise.all([...root.querySelectorAll('img')].map(i=>i.decode().catch(()=>{})));
  addEventListener('afterprint',()=>root.remove(),{once:true});
  window.print();
}
