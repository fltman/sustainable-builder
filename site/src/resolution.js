// Scales the render resolution down when most frames miss a 60 Hz deadline and probes back up
// after a calm spell. A few long frames (city tiles streaming in) never trigger it.
export function createResolutionGovernor({min=.6,window=2,slowFrame=.021}={}){
  let scale=1,time=0,frames=0,slow=0,hold=3,calm=0,patience=6;
  const round=v=>Math.round(v*100)/100;
  return {
    get scale(){return scale;},
    update(dt){
      if(hold>0){hold-=dt;return false;}
      time+=dt;frames++;if(dt>slowFrame)slow++;
      if(time<window)return false;
      const share=slow/frames;time=frames=slow=0;
      if(share>.5&&scale>min){scale=Math.max(min,round(scale-.15));hold=2;calm=0;return true;}
      if(share<.05&&scale<1){
        calm+=window;
        // Each probe that has to be undone doubles the wait before the next one.
        if(calm>=patience){scale=Math.min(1,round(scale+.1));calm=0;patience=Math.min(60,patience*2);hold=2;return true;}
      }else calm=0;
      return false;
    }
  };
}
