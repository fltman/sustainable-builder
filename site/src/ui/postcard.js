// A postcard from the year shown: the city as it looks right now, its year, what has changed since
// 2026 and the plan it comes from, drawn on one canvas so it can be saved or shared as a single image.
// Landscape 1600 px wide from a wide screen, portrait 1080 × 1350 from a phone. The style follows the
// link preview (tools/og-image.mjs): white type on a dark-green shade.
const FONT='system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",sans-serif';
const font=(px,weight=400)=>`${weight} ${Math.round(px)}px ${FONT}`;
// Spaced capitals drawn letter by letter (canvas letter-spacing is not everywhere yet).
function spaced(g,text,x,y,spacing){for(const ch of text){g.fillText(ch,x,y);x+=g.measureText(ch).width+spacing;}return x;}
function wrap(g,text,width){
  const words=text.split(' '),lines=[];let line='';
  for(const w of words){const next=line?line+' '+w:w;if(g.measureText(next).width>width&&line){lines.push(line);line=w;}else line=next;}
  if(line)lines.push(line);return lines;
}
// shot: a canvas with the rendered city. card: {year, era, plan, world, lead, lines[], url, credit}
export function drawPostcard(shot,card){
  const land=shot.width>=shot.height*1.05;
  const W=land?1600:1080,H=land?Math.round(Math.min(1000,1600*shot.height/shot.width)):1350,u=Math.min(W,H)/1000;
  const c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d');
  // The city, cropped to fill the card.
  const k=Math.max(W/shot.width,H/shot.height),sw=W/k,sh=H/k;
  g.drawImage(shot,(shot.width-sw)/2,(shot.height-sh)/2,sw,sh,0,0,W,H);
  // Shades under the type: down from the top, up from the bottom.
  let gr=g.createLinearGradient(0,0,0,H*.32);gr.addColorStop(0,'rgba(8,22,30,.66)');gr.addColorStop(1,'rgba(8,22,30,0)');g.fillStyle=gr;g.fillRect(0,0,W,H*.32);
  const pad=56*u,textW=W-pad*2-(land?300*u:0);
  g.font=font(30*u,600);const lead=wrap(g,card.lead,textW);
  g.font=font(25*u);const more=card.lines.flatMap(l=>wrap(g,l,textW));
  // On a tall card the source line goes under the text, so the text block sits higher.
  const foot=land?0:80*u,block=150*u+lead.length*40*u+more.length*35*u+40*u+foot;
  gr=g.createLinearGradient(0,H-block-140*u,0,H);gr.addColorStop(0,'rgba(8,22,20,0)');gr.addColorStop(.42,'rgba(8,22,20,.62)');gr.addColorStop(1,'rgba(8,22,20,.88)');
  g.fillStyle=gr;g.fillRect(0,H-block-140*u,W,block+140*u);
  g.fillStyle='#fff';g.textBaseline='alphabetic';g.shadowColor='rgba(0,0,0,.35)';g.shadowBlur=14*u;
  // Top: the title and the plan.
  g.font=font(44*u,800);spaced(g,'KALMAR 2126',pad,pad+38*u,6*u);
  g.font=font(24*u,500);g.fillStyle='rgba(255,255,255,.9)';g.fillText(`${card.plan} · ${card.world}`,pad,pad+80*u);
  // Bottom: the year, then what has changed, then the figures and the news of the year.
  let y=H-block+110*u;
  g.fillStyle='#fff';g.font=font(132*u,800);g.fillText(String(card.year),pad-4*u,y);
  const yw=g.measureText(String(card.year)).width;
  g.font=font(26*u,500);g.fillStyle='rgba(255,255,255,.82)';g.fillText(card.era,pad+yw+22*u,y-12*u);
  y+=58*u;g.fillStyle='#fff';g.font=font(30*u,600);
  for(const l of lead){g.fillText(l,pad,y);y+=40*u;}
  g.font=font(25*u);g.fillStyle='rgba(255,255,255,.88)';
  for(const l of more){g.fillText(l,pad,y);y+=35*u;}
  // Where it comes from, bottom right on a wide card, under the text on a tall one.
  g.shadowBlur=8*u;g.textAlign=land?'right':'left';
  const fx=land?W-pad:pad,fy=land?H-pad-28*u:H-62*u;
  g.font=font(24*u,700);g.fillStyle='#fff';g.fillText(card.url,fx,fy);
  g.font=font(16*u);g.fillStyle='rgba(255,255,255,.72)';g.fillText(card.credit,fx,fy+26*u);
  return c;
}
