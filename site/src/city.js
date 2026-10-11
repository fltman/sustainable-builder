import * as THREE from 'three';
import { compactGeometry } from './lod.js';
import { CITY } from './city-config.js';
const ALIAS=CITY.materialAlias||{};

// Streams the Kvarnholmen model (tiles from kalmar-kvarnholmen via the battle-car project) around the
// point the camera looks at. A Sims-style camera sees much more of the city than a car does, so the
// load radius grows with zoom; beyond it, footprint massing (massing.js) keeps the skyline continuous.
// Materials come once from materials.glb and are handed to `adoptMaterial` (future.js adds the
// 2026→2126 transformation there). Meshes are drawn through city-batches; the hidden originals carry
// BVHs for picking and roof sampling.
export async function createCity(scene,loader,renderer,{lite=false,adoptMaterial=()=>{},buildBVH=null,batches=null,onTile=()=>{},onUnload=()=>{},dropMesh=()=>false}={}) {
  const index=await fetch('city/tiles/tiles.json').then(r=>{if(!r.ok)throw new Error('Stadsmodellen saknas: bygg orten med python3 sustainable.py build <ort>.');return r.json();});
  const materials=new Map();
  // A material's colour is its tint (glTF extras): in the source each tint multiplies one of a small
  // kit of textures chosen by the material's kind (…_Tile red tile, …_Sheet and …_Roof grey metal,
  // …_Stone stone, …_Door brown paint). The library holds 1 500 of the 2 135 materials the source's
  // tiles.json counts; ~550 more come only with the tiles, as a name and a tint – drawn as flat pastel or white
  // roofs, walls, frames and bark. Such a material borrows the textures of the library's most common
  // material of its kind (or of a kind its name contains: WhiteFrame → Frame) under its own tint; the
  // two with neither texture nor tint get the colour their names say.
  const kindOf=name=>name.replace(/^M_/,'').split('_').slice(1).join('_');
  const kinds=new Map();let kindNames=[];
  const PAINT={Copper:'#6f9886',PaintGreen:'#3d6b4a'};
  const tint=mat=>{
    if(!mat.map){
      const k=kindOf(mat.name),like=kinds.get(k)||kinds.get(kindNames.find(x=>x.length>3&&k.includes(x)));
      if(like){for(const slot of ['map','normalMap','roughnessMap','metalnessMap'])mat[slot]=like[slot];mat.normalScale.copy(like.normalScale);}
    }
    if(mat.userData.tint){mat.color.setRGB(...mat.userData.tint);if(CITY.tintMask)mat.userData.tintMask=true;}
    else if(!mat.map){const k=Object.keys(PAINT).find(k=>mat.name.endsWith(`_${k}`));if(k)mat.color.set(PAINT[k]);}
  };
  const lib=await loader.loadAsync(`city/tiles/materials${lite?'-mobile':''}.glb`);
  lib.scene.traverse(o=>{
    if(!o.isMesh)return;
    for(const mat of [o.material].flat()){
      if(materials.has(mat.name))continue;
      tint(mat);
      if(mat.map)mat.map.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
      if(!ALIAS[mat.name])adoptMaterial(mat);
      materials.set(mat.name,mat);
    }
    o.geometry.dispose();
  });
  {
    const count=new Map();
    for(const m of materials.values()){
      const k=kindOf(m.name);if(!k||!m.map)continue;
      const byMap=count.get(k)||count.set(k,new Map()).get(k),e=byMap.get(m.map)||{n:0,m};e.n++;byMap.set(m.map,e);
    }
    for(const [k,byMap] of count)kinds.set(k,[...byMap.values()].sort((a,b)=>b.n-a.n)[0].m);
    kindNames=[...kinds.keys()].sort((a,b)=>b.length-a.length);
  }
  // A place can draw one surface as another (CITY.materialAlias: a generated town's bare "ground" as
  // grass): the material takes the other's textures and colour, and the future shader treats it as that.
  for(const [name,as] of Object.entries(ALIAS)){
    const m=materials.get(name),like=materials.get(as);if(!m)continue;
    if(like){for(const slot of ['map','normalMap','roughnessMap','metalnessMap'])m[slot]=like[slot];m.color.copy(like.color);if(like.normalScale)m.normalScale.copy(like.normalScale);m.roughness=like.roughness;m.userData.tint=like.userData.tint;m.userData.tintMask=like.userData.tintMask;m.needsUpdate=true;}
    m.userData.futureName=as;adoptMaterial(m);
  }
  const pickables=[];let revision=0;
  const tiles=index.tiles.map(t=>({...t,state:'idle',root:null,meshes:[],retryAt:0,box:new THREE.Box3(new THREE.Vector3(...t.min),new THREE.Vector3(...t.max))}));
  const base=tiles.find(t=>t.id==='base');
  const distance=(t,p)=>t.id==='base'?0:Math.hypot(Math.max(t.min[0]-p.x,0,p.x-t.max[0]),Math.max(t.min[2]-p.z,0,p.z-t.max[2]));
  let disposed=false;
  // far: a distant tile is simplified to ~20 % of its triangles, casts no shadow and is not picked.
  async function load(t,far=false){
    if(t.state==='loaded')return;
    if(t.promise)return t.promise;
    t.state='loading';
    t.promise=(async()=>{
      try{
        const gltf=await loader.loadAsync(`city/tiles/${t.id}.glb`);
        if(disposed)return;
        t.root=gltf.scene;t.meshes=[];
        const dropped=[];
        t.root.traverse(o=>{if(o.isMesh&&dropMesh(o))dropped.push(o);});
        for(const o of dropped){o.removeFromParent();o.geometry.dispose();}
        t.root.traverse(o=>{
          if(!o.isMesh)return;
          const own=[o.material].flat();
          const adopted=own.map(m=>materials.get(m.name)||(tint(m),adoptMaterial(m),m));
          for(const m of own)if(materials.has(m.name)&&materials.get(m.name)!==m)m.dispose();
          o.material=Array.isArray(o.material)?adopted:adopted[0];
          if(!o.geometry.attributes.normal)o.geometry.computeVertexNormals();
          o.castShadow=t.id!=='base';o.receiveShadow=true;
          o.matrixAutoUpdate=o.matrixWorldAutoUpdate=false;
          o.userData.tile=t.id;
          t.meshes.push(o);
        });
        t.far=far&&Boolean(buildBVH)&&t.id!=='base';
        if(t.far){
          const levels=await Promise.all(t.meshes.map(mesh=>Array.isArray(mesh.material)||!mesh.geometry.index?null:buildBVH(mesh.geometry,null,{scale:worldScale(mesh),levels:[{ratio:.2,error:.025}]})));
          t.meshes.forEach((mesh,i)=>{const level=levels[i]?.[0];if(!level)return;const old=mesh.geometry;mesh.geometry=compactGeometry(old,level.index);old.dispose();mesh.castShadow=false;});
        }
        else if(buildBVH)await Promise.all(t.meshes.map(mesh=>buildBVH(mesh.geometry,{targetLeafSize:12})));
        else for(const mesh of t.meshes)mesh.geometry.computeBoundsTree({targetLeafSize:12});
        if(disposed)return;
        scene.add(t.root);t.root.updateMatrixWorld(true);
        for(const mesh of t.meshes){const g=mesh.geometry;if(g.boundsTree)g.boundingBox=g.boundsTree.getBoundingBox(g.boundingBox||new THREE.Box3());else g.computeBoundingBox();mesh.userData.bounds=g.boundingBox.clone().applyMatrix4(mesh.matrixWorld);}
        if(!t.far)pickables.push(...t.meshes);t.state='loaded';revision++;
        if(batches)for(const mesh of t.meshes)batches.add(mesh);
        onTile(t);
      }catch(error){t.state='idle';t.retryAt=performance.now()+10000;throw error;}
      finally{t.promise=null;}
    })();
    return t.promise;
  }
  function unload(t){
    if(t.state!=='loaded'||t.id==='base')return;
    onUnload(t);
    scene.remove(t.root);if(batches)for(const mesh of t.meshes)batches.remove(mesh);
    const set=new Set(t.meshes);
    for(let i=pickables.length-1;i>=0;i--)if(set.has(pickables[i]))pickables.splice(i,1);
    for(const mesh of t.meshes){mesh.geometry.disposeBoundsTree?.();mesh.geometry.dispose();}
    t.meshes=[];t.root=null;t.state='idle';t.far=false;revision++;
  }
  function worldScale(mesh){mesh.updateWorldMatrix(true,false);const s=new THREE.Vector3();mesh.matrixWorld.decompose(new THREE.Vector3(),new THREE.Quaternion(),s);return s.toArray();}
  let focus={x:0,z:0},radius=220,near=170;
  const unloadMargin=90,upgradeMargin=25;
  const wanted=(t,p)=>distance(t,p)<near;
  async function ensure(p,r=radius,nr=near,onProgress=()=>{}){
    focus=p;radius=r;near=nr;
    if(base)await load(base);
    const needed=tiles.filter(t=>t.id!=='base'&&distance(t,p)<r).sort((a,b)=>distance(a,p)-distance(b,p));
    let i=0,done=0;
    await Promise.all(Array.from({length:4},async()=>{
      while(i<needed.length){const tile=needed[i++];await load(tile,!wanted(tile,p)).catch(e=>console.warn('Ruta',tile.id,e.message));onProgress(++done/needed.length);}
    }));
    batches?.flush();
  }
  let timer=0;
  // p: the streaming centre (between the camera and its target); r: the radius for this zoom; nr: full detail.
  function update(dt,p,r,nr=near){
    batches?.flush(4);
    focus=p;radius=r;near=nr;if((timer-=dt)>0)return;timer=.25;
    for(const t of tiles){
      const d=distance(t,p);
      if(d>radius+unloadMargin)unload(t);
      // A simplified tile the view comes close to is reloaded at full detail.
      else if(t.state==='loaded'&&t.far&&d<near-upgradeMargin&&!t.promise)unload(t);
    }
    const queue=tiles.filter(t=>t.state==='idle'&&t.retryAt<performance.now()&&distance(t,p)<radius)
      .sort((a,b)=>distance(a,p)-distance(b,p));
    const active=tiles.filter(t=>t.state==='loading').length;
    for(const t of queue.slice(0,Math.max(0,4-active)))load(t,!wanted(t,p)).catch(e=>console.warn('Ruta',t.id,e.message));
  }
  const ray=new THREE.Raycaster();ray.firstHitOnly=true;
  const origin=new THREE.Vector3(),down=new THREE.Vector3(0,-1,0),reachable=[];
  function reach(minX,maxX,minZ,maxZ,list=pickables){
    reachable.length=0;
    for(const o of list){const b=o.userData.bounds;if(!b||b.max.x>=minX&&b.min.x<=maxX&&b.max.z>=minZ&&b.min.z<=maxZ)reachable.push(o);}
    return reachable;
  }
  // Highest upward-facing surface under (x,z): a roof where a building's tile is loaded, else the ground.
  function topAt(x,z,from=80){
    origin.set(x,from,z);ray.set(origin,down);ray.far=from+10;
    const hits=ray.intersectObjects(reach(x,x,z,z),false);
    return hits.find(h=>h.face&&h.face.normal.clone().transformDirection(h.object.matrixWorld).y>.3)||null;
  }
  // The ground layer alone (base tile: streets, squares, lawns, quays), stable while tiles stream.
  function groundAt(x,z){
    if(!base||base.state!=='loaded')return 0;
    origin.set(x,40,z);ray.set(origin,down);ray.far=60;
    const hit=ray.intersectObjects(reach(x,x,z,z,base.meshes),false).find(h=>h.face?.normal.y>.3&&!/Water/.test(h.object.material?.name||''));
    return hit?hit.point.y:0;
  }
  function pick(raycaster){
    const r=raycaster.ray,end=r.origin.clone().addScaledVector(r.direction,raycaster.far===Infinity?3000:raycaster.far);
    raycaster.firstHitOnly=true;
    return raycaster.intersectObjects(reach(Math.min(r.origin.x,end.x),Math.max(r.origin.x,end.x),Math.min(r.origin.z,end.z),Math.max(r.origin.z,end.z)),false)[0]||null;
  }
  function loaded(x,z){return tiles.some(t=>t.id!=='base'&&t.state==='loaded'&&x>=t.min[0]&&x<=t.max[0]&&z>=t.min[2]&&z<=t.max[2]);}
  return {ensure,update,topAt,groundAt,pick,loaded,tiles,materials,pickables,
    dispose(){disposed=true;},
    stats:()=>({loaded:tiles.filter(t=>t.state==='loaded').length,far:tiles.filter(t=>t.state==='loaded'&&t.far).length,loading:tiles.filter(t=>t.state==='loading').length,tris:tiles.filter(t=>t.state==='loaded').reduce((n,t)=>n+t.tris,0)}),
    get revision(){return revision;},get radius(){return radius;}};
}
