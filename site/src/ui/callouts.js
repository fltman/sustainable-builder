// AR callouts: an explanation pinned to a place in the city. A pulsing dot marks the spot, a leader
// line draws out, a glass panel unfolds, and its number counts up. Time is supplied by the caller
// (update(now)), so the film can step it frame by frame and the game can run it in real time.
// Each callout: {id, at:{x,y,z}, side:'left'|'right', lift, kicker, title, value, from, fmt, unit,
//                note, spark:[numbers], spot:index, color}
const NS='http://www.w3.org/2000/svg';
const ease=t=>t<=0?0:t>=1?1:1-Math.pow(1-t,3);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export function createCallouts(project,{root=document.body}={}){
  const layer=document.createElement('div');layer.className='ar-layer';root.append(layer);
  const svg=document.createElementNS(NS,'svg');svg.setAttribute('class','ar-lines');layer.append(svg);
  const items=new Map();
  function build(c){
    const g=document.createElementNS(NS,'g');
    const ring=document.createElementNS(NS,'circle');ring.setAttribute('class','ar-ring');
    const dot=document.createElementNS(NS,'circle');dot.setAttribute('class','ar-dot');dot.setAttribute('r','4');
    const line=document.createElementNS(NS,'polyline');line.setAttribute('class','ar-line');
    g.append(ring,line,dot);svg.append(g);
    const panel=document.createElement('div');panel.className='ar-panel';
    panel.innerHTML='<i class="ar-corner tl"></i><i class="ar-corner br"></i><div class="ar-kicker"></div><div class="ar-title"></div><div class="ar-value"><b></b><span></span></div><div class="ar-from"></div><svg class="ar-spark" viewBox="0 0 120 26"><polyline/></svg><div class="ar-note"></div>';
    layer.append(panel);
    const q=s=>panel.querySelector(s);
    return {g,ring,dot,line,panel,kicker:q('.ar-kicker'),title:q('.ar-title'),num:q('.ar-value b'),unit:q('.ar-value span'),from:q('.ar-from'),spark:q('.ar-spark'),sparkLine:q('.ar-spark polyline'),note:q('.ar-note')};
  }
  function fill(it){
    const c=it.c,e=it.e;
    e.kicker.textContent=c.kicker||'';e.title.textContent=c.title||'';e.unit.textContent=c.unit||'';e.note.textContent=c.note||'';
    e.from.textContent=c.fromText||'';e.from.style.display=c.fromText?'block':'none';
    if(c.spark?.length>1){
      const min=Math.min(...c.spark),max=Math.max(...c.spark),sp=max-min||1;
      e.sparkLine.setAttribute('points',c.spark.map((v,i)=>`${(i/(c.spark.length-1)*118+1).toFixed(1)},${(24-(v-min)/sp*22).toFixed(1)}`).join(' '));
      e.spark.style.display='block';
    }else e.spark.style.display='none';
    it.panelW=null;it.panelH=null;
  }
  // list replaces what is shown; callouts with the same id keep their state (no re-animation).
  function show(list,now){
    const keep=new Set(list.map(c=>c.id));
    for(const [id,it] of items)if(!keep.has(id)&&it.hideAt==null)it.hideAt=now;
    for(const c of list){
      let it=items.get(c.id);
      if(!it||it.hideAt!=null){if(it)remove(it);it={c,e:build(c),start:now+(c.delay||0),hideAt:null};items.set(c.id,it);}
      else it.c=c;
      fill(it);
    }
  }
  function remove(it){it.e.g.remove();it.e.panel.remove();items.delete(it.c.id);}
  function clear(now){for(const it of items.values())if(it.hideAt==null)it.hideAt=now;}
  // area: the free screen rectangle {left,right,top,bottom}; panels stay inside it.
  function update(now,area=null){
    const W=innerWidth,H=innerHeight,A=area||{left:8,right:W-8,top:70,bottom:H-120};
    svg.setAttribute('viewBox',`0 0 ${W} ${H}`);
    // Pass 1: where each visible callout wants its panel.
    const lay=[];
    for(const it of [...items.values()]){
      const {c,e}=it;
      const t=now-it.start,out=it.hideAt==null?0:clamp((now-it.hideAt)/.45,0,1);
      if(out>=1){remove(it);continue;}
      const p=project(c.at.x,c.at.y,c.at.z);
      // A spot behind the interface (under a panel, the timeline) is not pointed at.
      const hidden=area&&p&&(p.x<A.left||p.x>A.right||p.y<A.top||p.y>A.bottom);
      if(!p||t<0||hidden){e.g.style.display='none';e.panel.style.display='none';continue;}
      e.g.style.display='';e.panel.style.display='';
      // Panels open towards the nearer screen edge unless a side is given.
      const pw=it.panelW??(it.panelW=e.panel.offsetWidth||230),ph=it.panelH??(it.panelH=e.panel.offsetHeight||150);
      // Open towards the side with more free room.
      const side=c.side==='left'?-1:c.side==='right'?1:(A.right-p.x>=p.x-A.left?1:-1);
      const run=c.run??70,lift=c.lift??110;
      let py=clamp(p.y-lift,A.top+14,A.bottom-ph);
      const px=p.x+side*(run+30),left=clamp(side>0?px:px-pw,A.left,A.right-pw);
      lay.push({it,p,t,out,side,pw,ph,run,left,py});
    }
    // Pass 2: push overlapping panels apart (top to bottom).
    lay.sort((a,b)=>a.py-b.py);
    for(let i=0;i<lay.length;i++)for(let j=0;j<i;j++){
      const a=lay[j],b=lay[i];
      if(b.left<a.left+a.pw+10&&a.left<b.left+b.pw+10&&b.py<a.py+a.ph+10)b.py=a.py+a.ph+10;
    }
    // Pass 3: draw.
    for(const L of lay){
      const {it,p,t,out,side,pw,run,left,py}=L,{c,e}=it,k=1-ease(out);
      const ex=p.x+side*run,px=side>0?left:left+pw;
      const draw=ease(clamp((t-.15)/.5,0,1))*k;
      const len=Math.hypot(ex-p.x,py-p.y)+Math.abs(px-ex);
      e.line.setAttribute('points',`${p.x},${p.y} ${ex},${py} ${px},${py}`);
      e.line.style.strokeDasharray=`${len}`;e.line.style.strokeDashoffset=`${len*(1-draw)}`;
      const pulse=(t%1.6)/1.6,appear=ease(clamp(t/.2,0,1));
      e.dot.setAttribute('cx',p.x);e.dot.setAttribute('cy',p.y);e.dot.style.opacity=String(appear*k);
      e.ring.setAttribute('cx',p.x);e.ring.setAttribute('cy',p.y);e.ring.setAttribute('r',String(5+pulse*16));e.ring.style.opacity=String((1-pulse)*.8*k*appear);
      if(c.color){e.line.style.stroke=c.color;e.dot.style.fill=c.color;e.ring.style.stroke=c.color;}
      const open=ease(clamp((t-.55)/.45,0,1))*k;
      e.panel.style.left=`${left}px`;e.panel.style.top=`${py-14}px`;
      e.panel.style.transformOrigin=side>0?'left top':'right top';
      // Opening unfolds sideways; closing only fades (a collapsing blurred panel leaves a ghost strip).
      const unfold=ease(clamp((t-.55)/.45,0,1));
      e.panel.style.transform=`scaleX(${.05+.95*unfold})`;e.panel.style.opacity=String(Math.min(1,unfold*1.4)*k*k);
      const cnt=ease(clamp((t-.75)/1.1,0,1));
      if(typeof c.value==='number'){
        const from=typeof c.from==='number'?c.from:0,v=from+(c.value-from)*cnt;
        e.num.textContent=c.fmt?c.fmt(v):String(Math.round(v));
      }else e.num.textContent=c.value??'';
      e.panel.classList.toggle('ar-lit',open>.98);
    }
  }
  return {show,clear,update,layer,get size(){return items.size;}};
}
