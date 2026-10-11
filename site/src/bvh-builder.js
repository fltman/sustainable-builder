import {MeshBVH} from 'three-mesh-bvh';

// Builds collision BVHs for streamed city tiles in workers; on the main thread each tile froze a
// frame for 50-120 ms on a fast laptop. Returns null where workers are unavailable (tests).
// Reads (interleaved, quantised) positions straight from the buffer; getX() per component was a
// visible share of each tile's main-thread time.
export function copyPositions(attribute){
  const count=attribute.count,out=new Float32Array(count*3);
  const data=attribute.isInterleavedBufferAttribute?attribute.data.array:attribute.array,stride=attribute.isInterleavedBufferAttribute?attribute.data.stride:3,offset=attribute.offset||0;
  const scale=!attribute.normalized?1:data instanceof Int16Array?1/32767:data instanceof Uint16Array?1/65535:data instanceof Int8Array?1/127:data instanceof Uint8Array?1/255:null;
  if(scale===null){for(let i=0;i<count;i++){out[i*3]=attribute.getX(i);out[i*3+1]=attribute.getY(i);out[i*3+2]=attribute.getZ(i);}return out;}
  const signed=attribute.normalized&&(data instanceof Int16Array||data instanceof Int8Array);
  for(let i=0,s=offset,d=0;i<count;i++,s+=stride){
    for(let c=0;c<3;c++){const v=data[s+c]*scale;out[d++]=signed&&v<-1?-1:v;}
  }
  return out;
}
export function createBVHBuilder(size=Math.min(3,Math.max(1,(navigator.hardwareConcurrency||2)-1))){
  if(typeof Worker==='undefined')return null;
  const idle=[],waiting=[],jobs=new Map();let next=0,broken=false;
  for(let i=0;i<size;i++){
    const worker=new Worker(new URL('./bvh.worker.js',import.meta.url),{type:'module'});
    worker.onmessage=({data})=>{const job=jobs.get(data.id);jobs.delete(data.id);release(worker);if(!job)return;data.error?job.reject(new Error(data.error)):job.resolve(data);};
    worker.onerror=event=>{event.preventDefault();broken=true;for(const [id,job] of jobs){jobs.delete(id);job.reject(new Error('BVH worker failed'));}};
    idle.push(worker);
  }
  const release=worker=>{const resume=waiting.shift();resume?resume(worker):idle.push(worker);};
  const acquire=()=>idle.length?Promise.resolve(idle.pop()):new Promise(resolve=>waiting.push(resolve));
  // lod: {scale:[x,y,z],levels:[{ratio,error,compact}]} also returns simplified distant versions.
  return async function build(geometry,options,lod=null){
    if(broken||!geometry.index){if(options)geometry.computeBoundsTree(options);return null;}
    const source=geometry.attributes.position,position=copyPositions(source);
    const index=geometry.index.array.slice(),worker=await acquire(),id=next++;
    try{
      const {serialized,lods}=await new Promise((resolve,reject)=>{jobs.set(id,{resolve,reject});worker.postMessage({id,position,index,options,lod},[position.buffer,index.buffer]);});
      if(!serialized)return lods;
      // The BVH reorders triangles, so the geometry takes the worker's index before its first upload.
      geometry.index.array=serialized.index;geometry.index.needsUpdate=true;
      geometry.boundsTree=MeshBVH.deserialize(serialized,geometry,{setIndex:false});
      return lods;
    }catch{if(options)geometry.computeBoundsTree(options);return null;}
  };
}
