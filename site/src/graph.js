// Street graph from the OpenStreetMap ways in map.json: nodes at way vertices (merged within 2.5 m),
// edges along the ways. Cars use car streets; people use everything; A* finds walking routes.
export function createGraph(roads,{merge=2.5}={}){
  const nodes=[],grid=new Map(),CELL=8;
  function nodeAt(x,z){
    const gx=Math.floor(x/CELL),gz=Math.floor(z/CELL);
    for(let a=gx-1;a<=gx+1;a++)for(let b=gz-1;b<=gz+1;b++)for(const id of grid.get(a+','+b)||[]){const n=nodes[id];if(Math.hypot(n.x-x,n.z-z)<merge)return id;}
    const id=nodes.length;nodes.push({id,x,z,edges:[]});const k=gx+','+gz;if(!grid.has(k))grid.set(k,[]);grid.get(k).push(id);return id;
  }
  const edges=[];
  for(const road of roads){
    let last=null;
    for(const [x,z] of road.p){
      const id=nodeAt(x,z);
      if(last!==null&&last!==id){
        const a=nodes[last],b=nodes[id],len=Math.hypot(b.x-a.x,b.z-a.z);
        const e={id:edges.length,a:last,b:id,len,w:road.w,car:road.car,kind:road.kind,name:road.name,order:road.order};
        edges.push(e);a.edges.push(e);b.edges.push(e);
      }
      last=id;
    }
  }
  // OSM ways from the island and mainland extracts often meet mid-segment (T-junctions) or end a
  // metre short of each other. Split edges where another way's vertex lies on them, then join
  // dangling ends to the nearest node within reach.
  const ECELL=16,egrid=new Map();
  const addEdgeToGrid=e=>{const A=nodes[e.a],B=nodes[e.b];for(let x=Math.floor(Math.min(A.x,B.x)/ECELL);x<=Math.floor(Math.max(A.x,B.x)/ECELL);x++)for(let z=Math.floor(Math.min(A.z,B.z)/ECELL);z<=Math.floor(Math.max(A.z,B.z)/ECELL);z++){const k=x+','+z;if(!egrid.has(k))egrid.set(k,[]);egrid.get(k).push(e);}};
  edges.forEach(addEdgeToGrid);
  const link=(a,b,road)=>{const A=nodes[a],B=nodes[b],len=Math.hypot(B.x-A.x,B.z-A.z);if(a===b||A.edges.some(e=>e.a===b||e.b===b))return null;const e={id:edges.length,a,b,len,w:road.w,car:road.car,kind:road.kind,name:road.name,order:road.order};edges.push(e);A.edges.push(e);B.edges.push(e);addEdgeToGrid(e);return e;};
  for(const n of [...nodes]){
    const near=new Set();for(let x=Math.floor(n.x/ECELL)-1;x<=Math.floor(n.x/ECELL)+1;x++)for(let z=Math.floor(n.z/ECELL)-1;z<=Math.floor(n.z/ECELL)+1;z++)for(const e of egrid.get(x+','+z)||[])near.add(e);
    let best=null;
    for(const e of near){
      if(e.dead||e.a===n.id||e.b===n.id)continue;
      const A=nodes[e.a],B=nodes[e.b],dx=B.x-A.x,dz=B.z-A.z,L=dx*dx+dz*dz;if(!L)continue;
      const t=((n.x-A.x)*dx+(n.z-A.z)*dz)/L;if(t<=.02||t>=.98)continue;
      const px=A.x+dx*t,pz=A.z+dz*t,d=Math.hypot(px-n.x,pz-n.z);
      if(d<3&&(!best||d<best.d))best={e,t,px,pz,d};
    }
    if(!best)continue;
    // Split the edge at the projection and tie this node in.
    const e=best.e;e.dead=true;
    for(const k of [e.a,e.b])nodes[k].edges=nodes[k].edges.filter(x=>x!==e);
    const mid=nodes.length;nodes.push({id:mid,x:best.px,z:best.pz,edges:[]});
    const road={w:e.w,car:e.car,kind:e.kind,name:e.name,order:e.order};
    link(e.a,mid,road);link(mid,e.b,road);link(mid,n.id,n.edges[0]||road);
  }
  for(const n of nodes){
    if(n.edges.length!==1)continue;
    let best=null;for(const m of nodes){if(m===n||!m.edges.length)continue;const d=Math.hypot(m.x-n.x,m.z-n.z);if(d<6&&!n.edges.some(e=>e.a===m.id||e.b===m.id)&&(!best||d<best.d))best={m,d};}
    if(best)link(n.id,best.m.id,n.edges[0]);
  }
  for(let i=edges.length-1;i>=0;i--)if(edges[i].dead)edges.splice(i,1);
  edges.forEach((e,i)=>e.id=i);
  const other=(e,id)=>e.a===id?e.b:e.a;
  function nearest(x,z,filter=null){
    let best=-1,d=Infinity;
    const gx=Math.floor(x/CELL),gz=Math.floor(z/CELL);
    for(let r=1;r<40&&best<0;r+=3)
      for(let a=gx-r;a<=gx+r;a++)for(let b=gz-r;b<=gz+r;b++)for(const id of grid.get(a+','+b)||[]){
        const n=nodes[id];if(!n.edges.length||(filter&&!n.edges.some(filter)))continue;
        const q=(n.x-x)**2+(n.z-z)**2;if(q<d){d=q;best=id;}
      }
    return best;
  }
  // Binary-heap A*.
  function path(from,to,filter=null){
    if(from<0||to<0)return null;if(from===to)return [from];
    const g=new Map([[from,0]]),prev=new Map(),open=[[0,from]],closed=new Set(),T=nodes[to];
    const push=(f,id)=>{open.push([f,id]);let i=open.length-1;while(i>0){const p=(i-1)>>1;if(open[p][0]<=open[i][0])break;[open[p],open[i]]=[open[i],open[p]];i=p;}};
    const pop=()=>{const top=open[0],end=open.pop();if(open.length){open[0]=end;let i=0;for(;;){const l=i*2+1,r=l+1;let m=i;if(l<open.length&&open[l][0]<open[m][0])m=l;if(r<open.length&&open[r][0]<open[m][0])m=r;if(m===i)break;[open[m],open[i]]=[open[i],open[m]];i=m;}}return top;};
    let guard=0;
    while(open.length&&guard++<20000){
      const [,id]=pop();if(closed.has(id))continue;closed.add(id);
      if(id===to){const out=[to];while(prev.has(out[0]))out.unshift(prev.get(out[0]));return out;}
      for(const e of nodes[id].edges){
        if(filter&&!filter(e))continue;
        const n=other(e,id);if(closed.has(n))continue;
        const cost=g.get(id)+e.len;if(cost>=(g.get(n)??Infinity))continue;
        g.set(n,cost);prev.set(n,id);push(cost+Math.hypot(nodes[n].x-T.x,nodes[n].z-T.z),n);
      }
    }
    return null;
  }
  return {nodes,edges,other,nearest,path};
}
