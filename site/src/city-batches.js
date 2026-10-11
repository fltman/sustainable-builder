import * as THREE from 'three';

// Draws the streamed city through one BatchedMesh per material template. The 1500 library materials
// differ mostly by tint, so ~600 nearby meshes collapse into ~100 batches; the tint becomes a
// per-instance colour. With WEBGL_multi_draw each batch is one draw call per pass (colour, shadow,
// occlusion normals) while every instance keeps its own frustum culling. The original meshes stay in
// the scene, hidden, for raycasts, collisions and collision audio; they are never uploaded to the GPU.
const textureKey=t=>t?t.uuid:'';
export function templateKey(material){
  const m=material;
  if(!m?.isMeshStandardMaterial||m.transparent||m.vertexColors||m.wireframe||m.userData.battleDamage)return null;
  return [m.type,m.side,m.flatShading,m.alphaTest,m.depthWrite,m.fog,m.toneMapped,textureKey(m.map),textureKey(m.normalMap),m.normalMapType,m.normalScale.x,m.normalScale.y,
    textureKey(m.roughnessMap),textureKey(m.metalnessMap),textureKey(m.aoMap),m.aoMapIntensity,textureKey(m.emissiveMap),m.emissive.getHexString(),m.emissiveIntensity,
    textureKey(m.bumpMap),textureKey(m.alphaMap),textureKey(m.lightMap),textureKey(m.envMap),m.roughness,m.metalness,m.envMapIntensity,
    Object.hasOwn(m,'onBeforeCompile')?m.onBeforeCompile.toString():'',m.customProgramCacheKey()].join('|');
}
const formatKey=g=>Object.keys(g.attributes).sort().map(name=>{const a=g.attributes[name];return `${name}:${a.array.constructor.name}${a.itemSize}${a.normalized?'n':''}`;}).join(',')+(g.index?'|i':'');

// Interleaved quantised attributes are copied element by element; packing them first lets the batch
// use TypedArray.set, so a streamed tile does not stall the frame.
function packAttribute(a){
  if(!a.isInterleavedBufferAttribute)return a;
  const {data,itemSize,offset,count}=a,source=data.array,stride=data.stride,out=new source.constructor(count*itemSize);
  for(let i=0,s=offset,d=0;i<count;i++,s+=stride)for(let c=0;c<itemSize;c++)out[d++]=source[s+c];
  return new THREE.BufferAttribute(out,itemSize,a.normalized);
}

// headroom: spare room a new batch gets, and how much it grows when full (phones keep both tight).
export function createCityBatches(scene,{releaseAttributes=['normal','uv'],compactAbove=32768,quietBeforeCompact=2000,headroom=1.5,growth=2}={}){
  const batches=new Map(),entries=new Map(),queue=[];let lastInsert=-Infinity;
  function batchFor(mesh,key){
    let batch=batches.get(key);if(batch)return batch;
    // Size a new batch for everything already queued for it, so the first tiles do not regrow it repeatedly.
    let vertices=0,indices=0;
    for(const entry of [{mesh},...queue.filter(e=>e.key===key)]){vertices+=entry.mesh.geometry.attributes.position.count;indices+=entry.mesh.geometry.index.count;}
    const maxVertices=Math.ceil(vertices*headroom)+1024,maxIndices=Math.ceil(indices*headroom)+3072;
    const source=mesh.material,material=source.clone();
    material.color.set(1,1,1);material.name=`Batched ${source.name}`;
    // clone() does not carry the weathering shader hook.
    if(Object.hasOwn(source,'onBeforeCompile'))material.onBeforeCompile=source.onBeforeCompile;
    // Shader variants that share one hook function differ only by their cache key.
    if(Object.hasOwn(source,'customProgramCacheKey'))material.customProgramCacheKey=source.customProgramCacheKey;
    const object=new THREE.BatchedMesh(64,maxVertices,maxIndices,material);
    object.name=material.name;object.castShadow=mesh.castShadow;object.receiveShadow=mesh.receiveShadow;
    // The batch spans the whole streamed city; each instance is culled on its own.
    // Sorting would also re-sort and re-upload every batch's draw order in all three passes; the depth test
    // handles opaque city geometry.
    object.frustumCulled=false;object.perObjectFrustumCulled=true;object.sortObjects=false;
    scene.add(object);
    batch={object,material,slots:[],vertices:0,indices:0,maxVertices,maxIndices,maxInstances:64,instances:0};
    batches.set(key,batch);return batch;
  }
  function reserve(batch,vertices,indices){
    // Reuse a freed slot of similar size; its leftover space is zero-filled on every write.
    let best=null;
    for(const slot of batch.slots)if(!slot.used&&slot.vertices>=vertices&&slot.indices>=indices&&slot.vertices<=vertices*1.3+64&&(!best||slot.vertices<best.vertices))best=slot;
    if(best)return best;
    if(batch.vertices+vertices>batch.maxVertices||batch.indices+indices>batch.maxIndices){
      for(const slot of batch.slots)if(!slot.used)batch.object.deleteGeometry(slot.id);
      batch.slots=batch.slots.filter(slot=>slot.used);batch.object.optimize();
      batch.vertices=batch.slots.reduce((n,s)=>n+s.vertices,0);batch.indices=batch.slots.reduce((n,s)=>n+s.indices,0);
      if(batch.vertices+vertices>batch.maxVertices||batch.indices+indices>batch.maxIndices){
        batch.maxVertices=Math.max(Math.ceil(batch.maxVertices*growth),batch.vertices+vertices);
        batch.maxIndices=Math.max(Math.ceil(batch.maxIndices*growth),batch.indices+indices);
        batch.object.setGeometrySize(batch.maxVertices,batch.maxIndices);
      }
    }
    return {id:null,vertices,indices,used:false};
  }
  function insert(entry){
    const {mesh,key}=entry,geometry=mesh.geometry,batch=batchFor(mesh,key);
    const packed=new THREE.BufferGeometry();
    for(const name in geometry.attributes)packed.setAttribute(name,packAttribute(geometry.attributes[name]));
    packed.setIndex(geometry.index);
    if(!geometry.boundingSphere)geometry.computeBoundingSphere();
    packed.boundingBox=geometry.boundingBox;packed.boundingSphere=geometry.boundingSphere;
    const vertices=geometry.attributes.position.count,indices=geometry.index.count,slot=reserve(batch,vertices,indices);
    if(slot.id===null){slot.id=batch.object.addGeometry(packed,vertices,indices);batch.slots.push(slot);batch.vertices+=vertices;batch.indices+=indices;}
    else batch.object.setGeometryAt(slot.id,packed);
    slot.used=true;
    if(batch.instances>=batch.maxInstances){batch.maxInstances*=2;batch.object.setInstanceCount(batch.maxInstances);}
    const instance=batch.object.addInstance(slot.id);batch.instances++;
    mesh.updateWorldMatrix(true,false);
    batch.object.setMatrixAt(instance,mesh.matrixWorld).setColorAt(instance,mesh.material.color);
    if(entry.detached)batch.object.setVisibleAt(instance,false);
    Object.assign(entry,{batch,slot,instance});
    // The hidden original only serves raycasts, which need positions and the index alone.
    if(!entry.detached)for(const name of releaseAttributes)if(name!=='position'&&geometry.attributes[name]){(entry.released||={})[name]=true;geometry.deleteAttribute(name);}
  }
  // Rebuild what was released so a detached mesh can render on its own again.
  function restore(entry){
    if(!entry.released||!entry.batch)return;
    // optimize() and regrowing move ranges, so read the slot's current position in the batch.
    const geometry=entry.mesh.geometry,source=entry.batch.object.geometry,{vertexStart}=entry.batch.object.getGeometryRangeAt(entry.slot.id),count=geometry.attributes.position.count;
    for(const name in entry.released){
      const a=source.attributes[name];
      geometry.setAttribute(name,new THREE.BufferAttribute(a.array.slice(vertexStart*a.itemSize,(vertexStart+count)*a.itemSize),a.itemSize,a.normalized));
    }
    entry.released=null;
  }
  // Tiles unload as the car moves on. Once most of a batch is unused, compact it and shrink its
  // buffers; an empty batch is removed altogether.
  const usedVertices=batch=>batch.slots.reduce((n,s)=>n+(s.used?s.vertices:0),0);
  function compact(batch,key){
    if(!batch.slots.some(slot=>slot.used)){
      scene.remove(batch.object);batch.object.dispose();batch.material.dispose();batches.delete(key);return;
    }
    for(const slot of batch.slots)if(!slot.used)batch.object.deleteGeometry(slot.id);
    batch.slots=batch.slots.filter(slot=>slot.used);batch.object.optimize();
    batch.vertices=batch.slots.reduce((n,s)=>n+s.vertices,0);batch.indices=batch.slots.reduce((n,s)=>n+s.indices,0);
    const keep=Math.min(1.25,headroom),maxVertices=Math.ceil(batch.vertices*keep)+1024,maxIndices=Math.ceil(batch.indices*keep)+3072;
    if(maxVertices<batch.maxVertices){batch.object.setGeometrySize(maxVertices,maxIndices);Object.assign(batch,{maxVertices,maxIndices});}
  }
  function detach(mesh){
    const entry=entries.get(mesh);if(!entry||entry.detached)return;
    entry.detached=true;restore(entry);
    if(entry.batch)entry.batch.object.setVisibleAt(entry.instance,false);
    mesh.visible=true;
  }
  function attach(mesh){
    const entry=entries.get(mesh);if(!entry||!entry.detached)return;
    entry.detached=false;mesh.visible=false;
    if(entry.batch)entry.batch.object.setVisibleAt(entry.instance,true);
  }
  return {
    // Returns false for meshes that must stay individual (transparent, multi-material, moving props).
    add(mesh){
      if(entries.has(mesh)||Array.isArray(mesh.material)||mesh.userData.streetProp||!mesh.geometry.index)return false;
      const template=templateKey(mesh.material);if(template===null)return false;
      const entry={mesh,key:`${template}|${formatKey(mesh.geometry)}|${mesh.castShadow}|${mesh.receiveShadow}`,batch:null,detached:false};
      entries.set(mesh,entry);queue.push(entry);mesh.visible=false;lastInsert=performance.now();
      mesh.userData.unbatch=()=>detach(mesh);mesh.userData.rebatch=()=>attach(mesh);
      return true;
    },
    remove(mesh){
      const entry=entries.get(mesh);if(!entry)return;
      entries.delete(mesh);const queued=queue.indexOf(entry);if(queued>=0)queue.splice(queued,1);
      if(entry.batch){entry.batch.object.deleteInstance(entry.instance);entry.batch.instances--;entry.slot.used=false;}
      delete mesh.userData.unbatch;delete mesh.userData.rebatch;
    },
    // Copies queued meshes into their batches until the time budget is spent.
    flush(budget=Infinity){
      const start=performance.now();
      if(queue.length)lastInsert=start;
      while(queue.length&&performance.now()-start<budget)insert(queue.shift());
      // Once streaming has been quiet for two seconds, reclaim one mostly empty batch per call.
      if(!queue.length&&start-lastInsert>quietBeforeCompact)for(const [key,batch] of batches)if(batch.maxVertices-usedVertices(batch)>Math.max(batch.maxVertices*.5,compactAbove)){compact(batch,key);break;}
      return queue.length;
    },
    get pending(){return queue.length;},
    stats:()=>{const list=[...batches.values()];return {batches:list.length,instances:list.reduce((n,b)=>n+b.instances,0),pending:queue.length,
      usedVertices:list.reduce((n,b)=>n+usedVertices(b),0),capacityVertices:list.reduce((n,b)=>n+b.maxVertices,0)};},
    batches
  };
}
