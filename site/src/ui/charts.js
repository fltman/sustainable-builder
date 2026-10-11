import { t } from '../i18n.js';
import { CITY, PLACE } from '../city-config.js';
// Small SVG charts, drawn by hand: sparklines for key figures, score rings for the goals, the
// Kalmar doughnut, and the century index behind the timeline. 2px lines, hairline axes, values
// in ink; the series colour only on marks.
const NS='http://www.w3.org/2000/svg';
export const svg=(tag,attrs={},parent=null)=>{const e=document.createElementNS(NS,tag);for(const k in attrs)e.setAttribute(k,attrs[k]);if(parent)parent.append(e);return e;};
export const el=(tag,cls='',text='')=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text)e.textContent=text;return e;};

let tip=null;
export function tooltip(x,y,lines){
  if(!tip){tip=el('div','tooltip');document.body.append(tip);}
  if(!lines){tip.style.display='none';return;}
  tip.replaceChildren();
  lines.forEach((l,i)=>{const line=el('div');if(i===0){const b=el('b','',l);line.append(b);}else line.textContent=l;tip.append(line);});
  tip.style.display='block';
  const w=tip.offsetWidth,h=tip.offsetHeight;
  tip.style.left=Math.min(innerWidth-w-8,Math.max(8,x+14))+'px';tip.style.top=Math.max(8,y-h-12)+'px';
}

// The uncertainty band (10th–90th percentile of the model ensemble) as a pale area: lo/hi per year.
function bandArea(parent,lo,hi,X,Y,color,opacity=.24){
  const up=[],down=[];for(let i=0;i<lo.length;i++){up.push(`${X(i).toFixed(1)},${Y(hi[i]).toFixed(1)}`);down.unshift(`${X(i).toFixed(1)},${Y(lo[i]).toFixed(1)}`);}
  return svg('polygon',{points:up.concat(down).join(' '),fill:color,'fill-opacity':opacity,stroke:'none'},parent);
}
const rangeText=(fmt,lo,hi)=>t(`Trolig spännvidd ${fmt(lo)} – ${fmt(hi)}`,`Likely range ${fmt(lo)} – ${fmt(hi)}`);

// values: number[] over years; index: the highlighted position; band: {lo,hi} or null.
export function sparkline(values,{width=150,height=34,index=0,color='#2f7d4f',fmt=v=>v,years=null,band=null}={}){
  const s=svg('svg',{width,height,viewBox:`0 0 ${width} ${height}`});
  const all=band?[...values,...band.lo,...band.hi]:values;
  const min=Math.min(...all),max=Math.max(...all),span=max-min||1,pad=4;
  const X=i=>pad+(width-2*pad)*i/(values.length-1),Y=v=>height-pad-(height-2*pad)*(v-min)/span;
  svg('line',{x1:pad,x2:width-pad,y1:height-pad+.5,y2:height-pad+.5,stroke:'rgba(19,32,26,.12)','stroke-width':1},s);
  if(band)bandArea(s,band.lo,band.hi,X,Y,color);
  const pts=values.map((v,i)=>`${X(i).toFixed(1)},${Y(v).toFixed(1)}`);
  svg('polyline',{points:pts.slice(0,index+1).join(' '),fill:'none',stroke:color,'stroke-width':2,'stroke-linejoin':'round','stroke-linecap':'round'},s);
  svg('polyline',{points:pts.slice(index).join(' '),fill:'none',stroke:'#b9bfbb','stroke-width':2,'stroke-linejoin':'round','stroke-linecap':'round','stroke-dasharray':'0'},s);
  svg('circle',{cx:X(index),cy:Y(values[index]),r:4,fill:color,stroke:'#fff','stroke-width':2},s);
  const hair=svg('line',{y1:0,y2:height,stroke:'rgba(19,32,26,.35)','stroke-width':1,visibility:'hidden'},s);
  const hit=svg('rect',{x:0,y:0,width,height,fill:'transparent'},s);
  hit.addEventListener('pointermove',e=>{
    const r=s.getBoundingClientRect(),i=Math.round(Math.max(0,Math.min(values.length-1,(e.clientX-r.left-pad)/(r.width-2*pad)*(values.length-1))));
    hair.setAttribute('x1',X(i));hair.setAttribute('x2',X(i));hair.setAttribute('visibility','visible');
    tooltip(e.clientX,e.clientY,[fmt(values[i]),years?String(years[i]):'',...(band&&band.hi[i]-band.lo[i]>Math.abs(values[i])*.005?[rangeText(fmt,band.lo[i],band.hi[i])]:[])]);
  });
  hit.addEventListener('pointerleave',()=>{hair.setAttribute('visibility','hidden');tooltip();});
  return s;
}

export function ring(score,color,size=44){
  const s=svg('svg',{width:size,height:size,viewBox:'0 0 44 44'}),r=18,c=2*Math.PI*r;
  svg('circle',{cx:22,cy:22,r,fill:'none',stroke:'rgba(19,32,26,.09)','stroke-width':5},s);
  svg('circle',{cx:22,cy:22,r,fill:'none',stroke:color,'stroke-width':5,'stroke-linecap':'round','stroke-dasharray':`${c*Math.max(.01,score/100)} ${c}`,transform:'rotate(-90 22 22)'},s);
  const t=svg('text',{x:22,y:26.5,'text-anchor':'middle','font-size':12,'font-weight':700,fill:'#13201a'},s);t.textContent=Math.round(score);
  return s;
}

// Raworth's doughnut: the green band is the safe and just space; red wedges grow inward for each
// social shortfall and outward for each ecological overshoot.
export function doughnutChart(d,dims,{size=330}={}){
  const s=svg('svg',{viewBox:'-212 -170 424 340',role:'img','aria-label':t(`${PLACE.name}-munken`,`The ${PLACE.name} doughnut`),style:`width:100%;max-width:${Math.round(size*1.25)}px;height:auto`});
  const inner=70,outer=112,band='#8fcca5',bandDark='#5aa678',bad='#d03b3b';
  const arc=(r0,r1,a0,a1)=>{const p=(r,a)=>`${(r*Math.sin(a)).toFixed(2)},${(-r*Math.cos(a)).toFixed(2)}`;const large=a1-a0>Math.PI?1:0;
    return `M${p(r0,a0)} L${p(r1,a0)} A${r1},${r1} 0 ${large} 1 ${p(r1,a1)} L${p(r0,a1)} A${r0},${r0} 0 ${large} 0 ${p(r0,a0)} Z`;};
  // Social shortfalls: from the inner edge inward.
  const nS=dims.social.length,gap=.012;
  dims.social.forEach(([id,name],i)=>{
    const a0=i/nS*Math.PI*2+gap,a1=(i+1)/nS*Math.PI*2-gap,v=Math.min(1,d.social[id]||0);
    svg('path',{d:arc(inner-60,inner-2,a0,a1),fill:'rgba(19,32,26,.04)'},s);
    if(v>.005){const p=svg('path',{d:arc(inner-2-56*v,inner-2,a0,a1),fill:bad,'fill-opacity':.25+.6*v},s);hover(p,name,t(`Brist: ${Math.round(v*100)} %`,`Shortfall: ${Math.round(v*100)}%`),t('Social grund','Social foundation'));}
    const hit=svg('path',{d:arc(inner-60,inner-2,a0,a1),fill:'transparent'},s);hover(hit,name,t(`Brist: ${Math.round(v*100)} %`,`Shortfall: ${Math.round(v*100)}%`),t('Social grund','Social foundation'));
  });
  svg('path',{d:arc(inner,outer,0,Math.PI*2-.0001),fill:band},s);
  svg('circle',{r:inner,fill:'none',stroke:bandDark,'stroke-width':1.5},s);
  svg('circle',{r:outer,fill:'none',stroke:bandDark,'stroke-width':1.5},s);
  const nE=dims.ecological.length;
  dims.ecological.forEach(([id,name],i)=>{
    const a0=i/nE*Math.PI*2+gap,a1=(i+1)/nE*Math.PI*2-gap,v=Math.min(1.6,d.ecological[id]||0);
    svg('path',{d:arc(outer+2,outer+48,a0,a1),fill:'rgba(19,32,26,.04)'},s);
    if(v>.005){const p=svg('path',{d:arc(outer+2,outer+2+30*v,a0,a1),fill:bad,'fill-opacity':.25+.45*Math.min(1,v)},s);hover(p,name,t(`Överskridande: ${Math.round(v*100)} %`,`Overshoot: ${Math.round(v*100)}%`),t('Ekologiskt tak','Ecological ceiling'));}
    const hit=svg('path',{d:arc(outer+2,outer+48,a0,a1),fill:'transparent'},s);hover(hit,name,t(`Överskridande: ${Math.round(v*100)} %`,`Overshoot: ${Math.round(v*100)}%`),t('Ekologiskt tak','Ecological ceiling'));
    const mid=(a0+a1)/2,lr=outer+52,label=svg('text',{x:(lr*Math.sin(mid)).toFixed(1),y:(-lr*Math.cos(mid)+3).toFixed(1),'text-anchor':Math.sin(mid)>.2?'start':Math.sin(mid)<-.2?'end':'middle','font-size':8.5,fill:'#46534c'},s);
    label.textContent=name.length>18?name.split(' ')[0]:name;
  });
  const c1=svg('text',{y:-4,'text-anchor':'middle','font-size':11,'font-weight':700,fill:'#13201a'},s);c1.textContent=t('Ett tryggt och','A safe and');
  const c2=svg('text',{y:10,'text-anchor':'middle','font-size':11,'font-weight':700,fill:'#13201a'},s);c2.textContent=t('rättvist utrymme','just space');
  return s;
}
function hover(node,name,value,kind){
  node.addEventListener('pointermove',e=>tooltip(e.clientX,e.clientY,[value,name,kind]));
  node.addEventListener('pointerleave',()=>tooltip());
}

// The century index (mean of the 17 goal scores) as an area behind the timeline track.
export function centuryChart(svgEl,years,values,{color='#2f7d4f',band=null}={}){
  svgEl.replaceChildren();
  const r=svgEl.getBoundingClientRect(),w=r.width||800,h=r.height||74,top=22,bottom=16;
  svgEl.setAttribute('viewBox',`0 0 ${w} ${h}`);
  const X=i=>w*i/(values.length-1),Y=v=>top+(h-top-bottom)*(1-v/100);
  for(const g of [0,50,100])svg('line',{x1:0,x2:w,y1:Y(g),y2:Y(g),stroke:'rgba(19,32,26,.08)','stroke-width':1},svgEl);
  const pts=values.map((v,i)=>`${X(i).toFixed(1)},${Y(v).toFixed(1)}`).join(' ');
  svg('polygon',{points:`0,${Y(0)} ${pts} ${w},${Y(0)}`,fill:color,'fill-opacity':band?.04:.1},svgEl);
  if(band)bandArea(svgEl,band.lo,band.hi,X,Y,color,.3);
  svg('polyline',{points:pts,fill:'none',stroke:color,'stroke-width':2,'stroke-linejoin':'round'},svgEl);
  const every=w<560?2:1;
  for(let d=0;d<=10;d+=every){
    const x=X(d*10*(values.length-1)/100);
    svg('line',{x1:x,x2:x,y1:h-bottom,y2:h-bottom+4,stroke:'rgba(19,32,26,.3)'},svgEl);
    const t=svg('text',{x:Math.min(w-14,Math.max(14,x)),y:h-2,'text-anchor':'middle','font-size':10.5,fill:'#7d8781'},svgEl);t.textContent=String(years[0]+d*10);
  }
  svg('line',{x1:0,x2:w,y1:h-bottom+.5,y2:h-bottom+.5,stroke:'rgba(19,32,26,.25)'},svgEl);
  return {X,Y,w,h};
}
