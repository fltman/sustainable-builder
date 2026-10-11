import { DECISIONS, JOURNEY_INTRO } from '@city/decisions.js';
import { t, L, dec, LANG } from '../i18n.js';
import { familyText, familyEpilogue, FAMILY_TITLE } from '@city/family.js';
import { CHALLENGES, ASSETS } from '../data/evidence.js';
import { INDICATORS } from '../data/indicators.js';
import { SDGS, DOUGHNUT } from '../data/sdg.js';
import { doughnutChart } from './charts.js';
import { run, PRESETS, START, END } from '../scenario.js';
import { CITY, PLACE } from '../city-config.js';

// "Resan": ten decades of choices. Each decade opens with the family's news and three dilemmas; the
// choices join the plan, the century is recomputed, and the next ten years play out in the city
// while events surface as they happen.
const ERAS=[t('Grundläggningen','The foundation'),t('Omställningen','The transition'),t('Andra generationen','The second generation'),t('Mitten av seklet','Mid-century'),t('Barnbarnens tid','The grandchildren\'s time'),t('Sjuttiotalet','The seventies'),t('Det långa åttiotalet','The long eighties'),t('Nittiotalet','The nineties'),t('Ett nytt sekel','A new century'),t('Hundra år senare','A hundred years later')];
const mean=a=>a.reduce((s,v)=>s+v,0)/a.length;
export function createJourney({S,modal,closeModal,resimulate,setYear,engine,evidenceList,el,setMode,onEvent=null,postcard=null,print=null}){
  const audio=engine.audio;
  let anim=null,toast=null,toastTime=0;
  function start(){
    setYear(START);
    setTimeout(()=>audio?.say(LANG==='en'?'vo-journey-en':'vo-journey'),600);
    modal((box,close)=>{
      box.append(el('div','small muted',t('RESAN · 2026','THE JOURNEY · 2026')),el('h1','',t(`${PLACE.name} idag`,`${PLACE.name} today`)));
      // The place's own words for the start of the journey (@city/decisions.js JOURNEY_INTRO).
      box.append(el('p','',JOURNEY_INTRO[LANG]||JOURNEY_INTRO.sv));
      const cols=el('div','cards');
      // Each challenge and strength is a heading that opens to its first sentence: open on a wide
      // screen, folded on a phone so the whole box fits.
      const wide=!matchMedia('(max-width:900px)').matches;
      const facts=(title,list)=>{const card=el('div','card');card.append(el('h3','',title));
        for(const c of list.slice(0,6)){const d=document.createElement('details');d.className='fact';d.open=wide;
          d.append(el('summary','',c.title_sv),el('p','small',c.text_sv.split('. ')[0]+'.'));card.append(d);}
        return card;};
      const c1=facts(t('Utmaningar','Challenges'),CHALLENGES),c2=facts(t('Styrkor att bygga på','Strengths to build on'),ASSETS);
      cols.append(c1,c2);box.append(cols);
      const fam=el('div','family');fam.append(el('h4','',FAMILY_TITLE[LANG]||FAMILY_TITLE.sv),el('p','',familyText(2026,S.run)));box.append(fam);
      const a=el('div','actions');const b=el('button','btn primary',t('Till de första vägvalen →','To the first choices →'));b.onclick=()=>{audio?.hush();close();decade(START);};a.append(b);box.append(a);
    },{cls:'decade',closable:false});
  }
  function decade(y){
    const list=DECISIONS[y]||[];const chosen={};
    setYear(y);
    modal((box,close)=>{
      const head=el('div','decade-head');head.append(el('span','y',`${y}–${Math.min(END,y+9)}`),el('h1','',ERAS[Math.floor((y-START)/10)]));box.append(head);
      if(y>START){const d=S.run.years[y-START];const A=Math.round(mean(d.sdg)),A0=Math.round(mean(S.run.years[0].sdg)),pop=INDICATORS.pop.fmt(d.ind.pop),car=INDICATORS.carShare.fmt(d.ind.carShare),food=INDICATORS.foodRegional.fmt(d.ind.foodRegional);
        const p=el('p','',t(`${PLACE.name}-index ${A} (2026: ${A0}) · ${pop} invånare · ${car} av resorna med bil · ${food} av maten från länet.`,`${PLACE.name} index ${A} (2026: ${A0}) · ${pop} inhabitants · ${car} of trips by car · ${food} of food from the county.`));box.append(p);}
      if(y>START){const fam=el('div','family');fam.append(el('h4','',FAMILY_TITLE[LANG]||FAMILY_TITLE.sv),el('p','',familyText(y,S.run)));box.append(fam);}
      const cards=el('div','cards');
      const go=el('button','btn primary',t(`Spola fram till ${Math.min(END,y+10)} →`,`Fast-forward to ${Math.min(END,y+10)} →`));
      const status=el('span','small muted','');status.style.marginRight='auto';status.setAttribute('role','status');
      const refresh=()=>{const n=Object.keys(chosen).length;status.textContent=n<list.length?t(`${n} av ${list.length} vägval gjorda – de du hoppar över behåller nuvarande kurs.`,`${n} of ${list.length} choices made – any you skip keep the current course.`):t('Alla vägval gjorda.','All choices made.');};
      for(const c of list){
        const card=el('div','card');card.setAttribute('role','group');card.setAttribute('aria-label',c.title);card.append(el('h3','',c.title),el('div','ctx',c.ctx));
        const opts=c.options.map(o=>{const b=el('button','option');b.setAttribute('aria-pressed','false');b.append(el('b','',o.label));if(o.text)b.append(el('span','',o.text));if(o.note)b.append(el('em','',o.note));
          b.onclick=()=>{chosen[c.id]=o;opts.forEach(x=>{x.classList.toggle('on',x===b);x.setAttribute('aria-pressed',String(x===b));});refresh();};card.append(b);return b;});
        if(c.ev?.length){const more=el('button','btn ghost small',t('Forskningen säger …','What the research says …'));more.style.alignSelf='flex-start';more.onclick=()=>{const box2=el('div','research-note');evidenceList(box2,c.ev);more.replaceWith(box2);};card.append(more);}
        cards.append(card);
      }
      box.append(cards);
      const a=el('div','actions');const skip=el('button','btn ghost',t('Avsluta resan','End the journey'));skip.onclick=()=>{close();finish();};
      go.onclick=()=>{close();apply(y,chosen);};refresh();a.append(status,skip,go);box.append(a);
    },{cls:'decade',closable:false});
  }
  function apply(y,chosen){
    const set={};for(const o of Object.values(chosen))Object.assign(set,o.set);
    S.schedule=S.schedule.filter(s=>s.from<y);S.schedule.push({from:y,set});
    resimulate();
    audio?.cue('decade');
    anim={from:y,to:Math.min(END,y+10),t:0,shown:new Set()};
  }
  function showToast(e){
    toast?.remove();
    toast=el('div','panel toast');const ic=el('div','ic',e.icon);const body=el('div');body.append(el('h4','',`${e.year} · ${e.title}`),el('p','',e.text));
    const x=el('button','icon-btn','×');x.title=t('Stäng','Close');x.setAttribute('aria-label',x.title);x.style.cssText='width:26px;height:26px';x.onclick=()=>{toast?.remove();toast=null;toastTime=0;};
    toast.append(ic,body,x);document.body.append(toast);toastTime=5.5;audio?.cue('event');onEvent?.(e);
  }
  function frame(dt){
    if(toast&&(toastTime-=dt)<=0){toast.remove();toast=null;}
    if(!anim)return;
    if(toast&&toastTime>2.5)return;   // hold the years while the news is read
    anim.t+=dt;
    const y=anim.from+Math.min(1,anim.t/11)*(anim.to-anim.from);
    setYear(y);
    for(const e of S.run.chronicle)if(e.year<=y&&e.year>=anim.from&&!anim.shown.has(e.id)){anim.shown.add(e.id);showToast(e);break;}
    if(anim.t>=11){const next=anim.to;anim=null;if(next>=END)finish();else decade(next);}
  }
  function finish(){
    setYear(END);
    const r=S.run,d=r.years[END-START],d0=r.years[0],I=d.I;
    const today=run(PRESETS[0].schedule,{world:S.world,events:S.events});
    modal((box,close)=>{
      box.append(el('div','small muted',t('RESAN · 2126','THE JOURNEY · 2126')),el('h1','',t(`Ditt ${PLACE.name} 2126`,`Your ${PLACE.name} 2126`)));
      {const A=Math.round(mean(d.sdg)),A0=Math.round(mean(d0.sdg)),AT=Math.round(mean(today.years[100].sdg));box.append(el('p','',t(`${PLACE.name}-index ${A} av 100 – jämfört med ${A0} år 2026 och ${AT} om staden bara hade följt dagens kurs.`,`${PLACE.name} index ${A} of 100 – compared with ${A0} in 2026 and ${AT} if the city had only followed the current course.`)));}
      const lines=[];
      lines.push(t(`${INDICATORS.foodRegional.fmt(d.ind.foodRegional)} av maten kommer från länet, och ${INDICATORS.cityVeg.fmt(d.ind.cityVeg)} av frukten och grönsakerna odlas i staden.`,`${INDICATORS.foodRegional.fmt(d.ind.foodRegional)} of the food comes from the county, and ${INDICATORS.cityVeg.fmt(d.ind.cityVeg)} of the fruit and vegetables are grown in the city.`));
      lines.push(`${t(`Bilen används för ${INDICATORS.carShare.fmt(d.ind.carShare)} av resorna.`,`The car is used for ${INDICATORS.carShare.fmt(d.ind.carShare)} of trips.`)} ${d.ind.depave>.4?t('De flesta av ${PLACE.centreGenitive} gator är trädgårdar.','Most of ${PLACE.centre}\'s streets are gardens.'):t('Gatorna ser ut ungefär som 2026.','The streets look much as they did in 2026.')}`);
      lines.push(I.analog>.6?t('Barndomen är skärmfri till tolv år, och allt viktigt – betalningar, journaler, larm – fungerar också utan nät.','Childhood is screen-free until twelve, and everything important – payments, medical records, alarms – also works without the network.'):I.analog>.3?t('Skolan är mobilfri och kontanter finns kvar som reserv.','School is phone-free and cash remains as a backup.'):t('Nästan allt är digitalt, också reserven.','Almost everything is digital, the backups too.'));
      lines.push(I.ai>.6?(d.ind.aiGovernance>.6?t('AI används i vård, energi och odling – öppet granskad och i invånarnas ägo.','AI is used in care, energy and farming – openly scrutinised and owned by the residents.'):t('AI sköter mycket av vården och förvaltningen, men få vet hur besluten fattas.','AI runs much of healthcare and administration, but few know how decisions are made.')):t('AI används sparsamt.','AI is used sparingly.'));
      {const lp=INDICATORS.lowParticipation.fmt(d.ind.lowParticipation),lp0=INDICATORS.lowParticipation.fmt(d0.ind.lowParticipation),co=INDICATORS.cohousing.fmt(d.ind.cohousing);lines.push(t(`${lp} har lågt socialt deltagande (2026: ${lp0}). ${co} bor i någon form av bogemenskap.`,`${lp} have low social participation (2026: ${lp0}). ${co} live in some form of co-housing.`));}
      {const le=INDICATORS.lifeExp.fmt(d.ind.lifeExp),sr=INDICATORS.seaRise.fmt(d.ind.seaRise).replace('+',''),fr=d.ind.floodRisk;lines.push(t(`Medellivslängden är ${le} år. Havet har stigit ${sr} och översvämningsrisken ${PLACE.onCentre} är ${fr<.2?'låg':fr<.5?'måttlig':'hög'}.`,`Life expectancy is ${le} years. The sea has risen ${sr} and the flood risk ${PLACE.onCentre} is ${fr<.2?'low':fr<.5?'moderate':'high'}.`));}
      const ul=el('ul');ul.style.cssText='line-height:1.55;color:var(--ink-2);padding-left:18px';for(const l of lines)ul.append(el('li','',l));box.append(ul);
      const fam=el('div','family');fam.append(el('h4','',FAMILY_TITLE[LANG]||FAMILY_TITLE.sv),el('p','',familyEpilogue(r)));box.append(fam);
      const row=el('div','cards');
      const c1=el('div','card');c1.append(el('h3','',t(`${PLACE.name}-munken 2126`,`The ${PLACE.name} doughnut 2126`)),doughnutChart(d.doughnut,DOUGHNUT,{size:300}));
      const c2=el('div','card');c2.append(el('h3','',t('Störst förändring','Biggest change')));
      const changes=SDGS.map((g,i)=>({g,dv:d.sdg[i]-d0.sdg[i],v:d.sdg[i]})).sort((a,b)=>b.dv-a.dv);
      for(const c of [...changes.slice(0,4),...changes.slice(-2)]){const p=el('p','small');p.style.margin='2px 0';const b=el('b','',t(`Mål ${c.g.n} ${c.g.name}: `,`Goal ${c.g.n} ${c.g.name}: `));p.append(b,document.createTextNode(`${Math.round(c.v)} (${c.dv>=0?'+':''}${Math.round(c.dv)})`));c2.append(p);}
      row.append(c1,c2);box.append(row);
      const a=el('div','actions');
      const again=el('button','btn',t('Börja om','Start again'));again.onclick=()=>{close();S.schedule=[{from:START,set:{}}];resimulate();start();};
      const explore=el('button','btn primary',t(`Utforska ditt ${PLACE.name} fritt`,`Explore your ${PLACE.name} freely`));explore.onclick=()=>{close();setMode('explore');resimulate();};
      const card=el('button','btn',t('Vykort från 2126','Postcard from 2126'));card.onclick=()=>postcard?.();
      const paper=el('button','btn',t('Skriv ut','Print'));paper.title=t(`Din vision för ${PLACE.name} 2126 på papper: bild, mål, vägval, nyckeltal och källor`,`Your vision for ${PLACE.name} 2126 on paper: picture, goals, choices, key figures and sources`);paper.onclick=()=>print?.();
      a.append(again,card,paper,explore);box.append(a);
    },{cls:'decade',closable:false});
  }
  return {start,decade,frame,finish,get animating(){return Boolean(anim);}};
}
