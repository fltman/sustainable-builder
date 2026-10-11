import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Vehicles modelled in Blender (tools/build-vehicles.py -> public/models/vehicles.glb): one mesh per
// vehicle, metres, forward +Z, wheels (or the waterline) on y = 0, centred on the origin, vertex
// colours only. The glTF carries a custom `_TINT` attribute: 1 on the paint, 0 elsewhere.
// The returned geometries match the kit format (src/kit.js kitMaterial): position, normal, color
// (linear RGB), tint (instanceColor applies where tint = 1) and sway (zeros).
//
// Names: car2026, robotaxi, ebus, tram, cargobike, bike, hydrofoil, watertaxi.
// geometry.userData: {length, width, height} in metres (from the bounding box).

/**
 * @param {GLTFLoader} [loader]  an existing loader (e.g. one with a DRACO/KTX2 setup); default: new
 * @param {string} [url='models/vehicles.glb']
 * @returns {Promise<Object<string, THREE.BufferGeometry>>}
 */
export async function loadVehicles(loader = null, url = 'models/vehicles.glb') {
  const gltf = await (loader || new GLTFLoader()).loadAsync(url);
  gltf.scene.updateMatrixWorld(true);
  const out = {};
  gltf.scene.traverse(o => {
    if (!o.isMesh) return;
    const g = o.geometry.clone();
    g.applyMatrix4(o.matrixWorld);
    const n = g.attributes.position.count;
    const t = g.getAttribute('_tint');
    if (t) { g.deleteAttribute('_tint'); g.setAttribute('tint', t); } else g.setAttribute('tint', new THREE.BufferAttribute(new Float32Array(n), 1));
    g.setAttribute('sway', new THREE.BufferAttribute(new Float32Array(n), 1));
    if (!g.getAttribute('color')) g.setAttribute('color', new THREE.BufferAttribute(new Float32Array(n * 3).fill(1), 3));
    g.computeBoundingBox(); g.computeBoundingSphere();
    const s = g.boundingBox.getSize(new THREE.Vector3());
    g.userData = { length: s.z, width: s.x, height: s.y };
    out[o.name] = g;
  });
  return out;
}
