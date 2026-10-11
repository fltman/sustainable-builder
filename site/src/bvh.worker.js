import {BufferAttribute,BufferGeometry} from 'three';
import {MeshBVH} from 'three-mesh-bvh';
import {MeshoptSimplifier} from 'three/addons/libs/meshopt_simplifier.module.js';
import {simplifyLevels} from './lod.js';

// Receives copies of a tile mesh's positions and index, so the loaded geometry keeps its buffers.
self.onmessage=async({data:{id,position,index,options,lod}})=>{
  try{
    let levels=null;
    if(lod){await MeshoptSimplifier.ready;levels=simplifyLevels(MeshoptSimplifier,position,index,lod.scale,lod.levels);}
    // options===null: only the simplified levels are wanted (a distant tile that is never picked).
    if(!options){const transfer=[];for(const level of levels||[]){transfer.push(level.index.buffer);if(level.positions)transfer.push(level.positions.buffer);}self.postMessage({id,serialized:null,lods:levels},transfer);return;}
    const geometry=new BufferGeometry();
    geometry.setAttribute('position',new BufferAttribute(position,3));geometry.setIndex(new BufferAttribute(index,1));
    const serialized=MeshBVH.serialize(new MeshBVH(geometry,options),{cloneBuffers:false});
    const transfer=[...serialized.roots,serialized.index.buffer];
    for(const level of levels||[]){transfer.push(level.index.buffer);if(level.positions)transfer.push(level.positions.buffer);}
    self.postMessage({id,serialized,lods:levels},transfer);
  }catch(error){self.postMessage({id,error:error.message});}
};
