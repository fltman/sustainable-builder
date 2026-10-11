import * as THREE from 'three';

// Instanced people animated by vertex animation textures (VAT), baked in Blender by
// tools/build-crowd.py into public/models/crowd/<variant>.bin + crowd.json.
//
// Each variant is one BufferGeometry (rest pose `position`, `normal`, base `color` with baked AO, a
// `mask` attribute and an index) plus two textures: per-frame positions (RGBA16F) and normals
// (RGBA8), one texel per vertex and frame, laid out in 1024-wide rows (texel = frame * vertexCount +
// gl_VertexID) so any vertex count fits WebGL2's minimum texture size. The vertex shader picks a clip per instance,
// fetches the two neighbouring frames with gl_VertexID and blends them, so every instance walks,
// idles or sits on its own phase at the cost of four texel fetches.
//
// Per-instance inputs (InstancedBufferAttributes on the geometry, same names as the old kit people):
//   aWalk  vec2  x = phase/seed (radians-like; any float, also seeds the trouser variety)
//                y = 0 idle, 1 walk (0.5..1.5 = walk with the cadence scaled by y), 2 sit
//   aSkin  vec3  linear RGB skin tone           (mask.g)
//   aHair  vec3  linear RGB hair colour         (mask.b)
//   instanceColor       clothing-top tint       (mask.r)
// mask.a marks trousers / skirts: optionally varied per instance among neutral tones.
// Time comes from a shared uniform object {value: seconds}.

const HALF_ONE = 0x3c00;
const SRGB = new Float32Array(256).map((_, i) => { const c = i / 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); });

const VAT_HEAD = /* glsl */`
attribute vec4 mask;
attribute vec2 aWalk;
attribute vec3 aHair;
attribute vec3 aSkin;
uniform highp sampler2D crowdPos;
uniform highp sampler2D crowdNrm;
uniform vec4 crowdClipWalk;
uniform vec4 crowdClipIdle;
uniform vec4 crowdClipSit;
uniform float crowdTime;
uniform float crowdWalkRate;
uniform float crowdBottomVariety;
uniform int crowdVertexCount;
ivec2 crowdTexel( float frame ) {
	int i = int( frame ) * crowdVertexCount + gl_VertexID;
	return ivec2( i & 1023, i >> 10 );
}
vec3 crowdVat( out vec3 crowdNormal ) {
	float crowdMode = aWalk.y;
	vec4 clip = crowdMode > 1.5 ? crowdClipSit : ( crowdMode > 0.5 ? crowdClipWalk : crowdClipIdle );
	float rate = ( crowdMode > 0.5 && crowdMode <= 1.5 ) ? crowdWalkRate * crowdMode : 1.0;
	float f = mod( crowdTime * clip.z * rate + fract( aWalk.x * 0.15915494 ) * clip.y, clip.y );
	float f0 = floor( f );
	float f1 = f0 + 1.0 >= clip.y ? 0.0 : f0 + 1.0;
	float k = f - f0;
	ivec2 t0 = crowdTexel( clip.x + f0 );
	ivec2 t1 = crowdTexel( clip.x + f1 );
	crowdNormal = normalize( mix( texelFetch( crowdNrm, t0, 0 ).xyz, texelFetch( crowdNrm, t1, 0 ).xyz, k ) * 2.0 - 1.0 );
	return mix( texelFetch( crowdPos, t0, 0 ).xyz, texelFetch( crowdPos, t1, 0 ).xyz, k );
}
vec3 crowdBottom( float seed ) {
	float h = fract( sin( seed * 12.9898 + 4.1 ) * 43758.5453 );
	return h < 0.3 ? vec3( 1.0 ) : h < 0.45 ? vec3( 0.62, 0.68, 1.05 ) : h < 0.6 ? vec3( 1.45, 1.25, 0.92 )
		: h < 0.75 ? vec3( 0.62 ) : h < 0.88 ? vec3( 1.0, 1.15, 1.5 ) : vec3( 0.95, 1.05, 0.78 );
}
`;

const COLOR_VERTEX = /* glsl */`
#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR
	vColor.rgb *= color.rgb;
#endif
	vec3 crowdTop = vec3( 1.0 );
#ifdef USE_INSTANCING_COLOR
	crowdTop = instanceColor.rgb;
#endif
	vColor.rgb *= mix( vec3( 1.0 ), crowdTop, mask.r ) * mix( vec3( 1.0 ), aSkin, mask.g ) * mix( vec3( 1.0 ), aHair, mask.b )
		* mix( vec3( 1.0 ), crowdBottom( aWalk.x ), mask.a * crowdBottomVariety );
`;

function patchVertex(src, lit) {
  src = VAT_HEAD + src;
  if (lit) {
    src = src.replace('#include <color_vertex>', COLOR_VERTEX)
      .replace('#include <beginnormal_vertex>', /* glsl */`
	vec3 crowdN;
	vec3 crowdP = crowdVat( crowdN );
	vec3 objectNormal = crowdN;
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`)
      .replace('#include <begin_vertex>', 'vec3 transformed = crowdP;');
  } else {
    src = src.replace('#include <begin_vertex>', 'vec3 crowdN; vec3 transformed = crowdVat( crowdN );');
  }
  return src;
}

function clipVec(c, fallback) {
  c = c || fallback;
  return new THREE.Vector4(c.start, c.frames, c.fps, 0);
}

function buildVariant(entry, buf) {
  const L = entry.layout, V = entry.vertexCount, F = entry.frameCount;
  const view = (key, Type) => new Type(buf, L[key].byteOffset, L[key].byteLength / Type.BYTES_PER_ELEMENT);
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(view('position', Float32Array), 3));
  g.setAttribute('normal', new THREE.BufferAttribute(view('normal', Float32Array), 3));
  const c8 = view('color', Uint8Array), col = new Float32Array(V * 3);
  for (let i = 0; i < V; i++) { col[i * 3] = SRGB[c8[i * 4]]; col[i * 3 + 1] = SRGB[c8[i * 4 + 1]]; col[i * 3 + 2] = SRGB[c8[i * 4 + 2]]; }
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  g.setAttribute('mask', new THREE.BufferAttribute(view('mask', Uint8Array), 4, true));
  g.setIndex(new THREE.BufferAttribute(L.index.type === 'uint32' ? view('index', Uint32Array) : view('index', Uint16Array), 1));
  // Bounds over every baked frame, so culling and shadow cameras see the animated extents.
  g.boundingBox = new THREE.Box3(new THREE.Vector3(...entry.bounds.min), new THREE.Vector3(...entry.bounds.max));
  g.boundingSphere = g.boundingBox.getBoundingSphere(new THREE.Sphere());
  // VAT textures: 1024 texels per row, texel index = frame * V + vertex.
  const fp = view('framePositions', Uint16Array), fn = view('frameNormals', Int8Array), n = V * F, rows = Math.ceil(n / 1024);
  const pos = new Uint16Array(1024 * rows * 4), nrm = new Uint8Array(1024 * rows * 4);
  for (let i = 0; i < n; i++) {
    pos[i * 4] = fp[i * 3]; pos[i * 4 + 1] = fp[i * 3 + 1]; pos[i * 4 + 2] = fp[i * 3 + 2]; pos[i * 4 + 3] = HALF_ONE;
    let x = fn[i * 2] / 127, y = fn[i * 2 + 1] / 127;
    const z = 1 - Math.abs(x) - Math.abs(y);
    if (z < 0) { const ox = x; x = (1 - Math.abs(y)) * Math.sign(ox || 1); y = (1 - Math.abs(ox)) * Math.sign(y || 1); }
    const len = Math.hypot(x, y, z) || 1;
    nrm[i * 4] = (x / len * 0.5 + 0.5) * 255 + 0.5; nrm[i * 4 + 1] = (y / len * 0.5 + 0.5) * 255 + 0.5; nrm[i * 4 + 2] = (z / len * 0.5 + 0.5) * 255 + 0.5; nrm[i * 4 + 3] = 255;
  }
  const tex = (data, type) => {
    const t = new THREE.DataTexture(data, 1024, rows, THREE.RGBAFormat, type);
    t.minFilter = t.magFilter = THREE.NearestFilter; t.generateMipmaps = false; t.needsUpdate = true; return t;
  };
  const clips = entry.clips;
  return {
    name: entry.name, height: entry.height, geometry: g, clips, entry,
    // Walking speed (m/s) at walkRate 1; cadence for another speed: walkRate = speed / walkSpeed.
    walkSpeed: clips.walk.speed_mps ?? clips.walk.stride_m * clips.walk.fps / clips.walk.frames,
    seatHeight: clips.sit?.seat_height ?? null,
    vat: { pos: tex(pos, THREE.HalfFloatType), nrm: tex(nrm, THREE.UnsignedByteType), vertexCount: V,
      walk: clipVec(clips.walk), idle: clipVec(clips.idle), sit: clipVec(clips.sit, clips.idle) },
  };
}

/**
 * Load the baked crowd.
 * @param {object} o
 * @param {string} [o.basePath='models/crowd/']  folder holding crowd.json and the .bin files
 * @param {{value:number}} [o.time]  shared time uniform (seconds) for the default materials
 * @param {string[]} [o.variants]  subset of variant names to load (default: all)
 * @param {object} [o.material]  default options passed to makeMaterial for each variant's `material`
 * @returns {Promise<{variants:Array<{name,height,geometry,material,clips,walkSpeed,seatHeight}>, byName:object,
 *   time:{value:number}, manifest:object, makeMaterial:Function, makeMesh:Function, makeBatch:Function, walkRateFor:Function}>}
 */
export async function loadCrowd({ basePath = 'models/crowd/', time = null, variants = null, material = {} } = {}) {
  const base = basePath.endsWith('/') ? basePath : basePath + '/';
  const res = await fetch(base + 'crowd.json');
  if (!res.ok) throw new Error(`crowd: ${base}crowd.json ${res.status}`);
  const manifest = await res.json();
  const entries = manifest.variants.filter(e => !variants || variants.includes(e.name));
  const timeU = time || { value: 0 };
  const list = await Promise.all(entries.map(async e => {
    const r = await fetch(base + e.file);
    if (!r.ok) throw new Error(`crowd: ${base}${e.file} ${r.status}`);
    return buildVariant(e, await r.arrayBuffer());
  }));
  const byName = Object.fromEntries(list.map(v => [v.name, v]));
  const resolve = v => (typeof v === 'string' ? byName[v] : v);

  /**
   * A MeshStandardMaterial that plays the VAT of one variant. Its userData holds the matching
   * depthMaterial / distanceMaterial (assign them to the mesh's customDepthMaterial /
   * customDistanceMaterial so shadows animate too) and the uniforms.
   * @param {object} o
   * @param {string|object} o.variant  variant name or object
   * @param {{value:number}} [o.time]  shared seconds uniform (default: the crowd's)
   * @param {number} [o.walkRate=1]  cadence multiplier for walking instances
   * @param {number} [o.bottomVariety=1]  0..1, how much trousers/skirts vary per instance
   * Remaining options go to MeshStandardMaterial (roughness, metalness, ...).
   */
  function makeMaterial({ variant, time: t = timeU, walkRate = 1, bottomVariety = 1, ...std } = {}) {
    const v = resolve(variant);
    if (!v) throw new Error('crowd: unknown variant ' + variant);
    const uniforms = {
      crowdPos: { value: v.vat.pos }, crowdNrm: { value: v.vat.nrm },
      crowdClipWalk: { value: v.vat.walk }, crowdClipIdle: { value: v.vat.idle }, crowdClipSit: { value: v.vat.sit },
      crowdTime: t, crowdWalkRate: { value: walkRate }, crowdBottomVariety: { value: bottomVariety }, crowdVertexCount: { value: v.vat.vertexCount },
    };
    const m = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.82, metalness: 0, ...std });
    m.onBeforeCompile = sh => { Object.assign(sh.uniforms, uniforms); sh.vertexShader = patchVertex(sh.vertexShader, true); };
    m.customProgramCacheKey = () => 'crowd-vat-1';
    const depth = new THREE.MeshDepthMaterial();
    depth.onBeforeCompile = sh => { Object.assign(sh.uniforms, uniforms); sh.vertexShader = patchVertex(sh.vertexShader, false); };
    depth.customProgramCacheKey = () => 'crowd-vat-depth-1';
    const distance = new THREE.MeshDistanceMaterial();
    distance.onBeforeCompile = sh => { Object.assign(sh.uniforms, uniforms); sh.vertexShader = patchVertex(sh.vertexShader, false); };
    distance.customProgramCacheKey = () => 'crowd-vat-distance-1';
    m.userData = { crowd: uniforms, depthMaterial: depth, distanceMaterial: distance, variant: v.name };
    return m;
  }

  /**
   * An InstancedMesh ready to fill: its own geometry (sharing the variant's buffers) with aWalk, aHair
   * and aSkin instanced attributes, an instanceColor, the custom depth/distance materials and shadows.
   */
  function makeMesh(variant, count, { material = null, castShadow = true, receiveShadow = true } = {}) {
    const v = resolve(variant);
    const mat = material || v.material;
    const g = new THREE.BufferGeometry();
    for (const [k, a] of Object.entries(v.geometry.attributes)) g.setAttribute(k, a);
    g.setIndex(v.geometry.index); g.boundingBox = v.geometry.boundingBox.clone(); g.boundingSphere = v.geometry.boundingSphere.clone();
    g.setAttribute('aWalk', new THREE.InstancedBufferAttribute(new Float32Array(count * 2), 2));
    const hair = new Float32Array(count * 3), skin = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) { hair.set([0.06, 0.035, 0.02], i * 3); skin.set([0.72, 0.47, 0.34], i * 3); }
    g.setAttribute('aHair', new THREE.InstancedBufferAttribute(hair, 3));
    g.setAttribute('aSkin', new THREE.InstancedBufferAttribute(skin, 3));
    const mesh = new THREE.InstancedMesh(g, mat, count);
    mesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(count * 3).fill(1), 3);
    mesh.customDepthMaterial = mat.userData.depthMaterial; mesh.customDistanceMaterial = mat.userData.distanceMaterial;
    mesh.castShadow = castShadow; mesh.receiveShadow = receiveShadow; mesh.name = 'crowd ' + v.name;
    return mesh;
  }

  /**
   * Per-variant InstancedMeshes in one Group, refilled every frame (or whenever people move):
   *   batch.begin(); batch.add('coat', matrix, {mode: 1, phase: id * 1.7, top: 0xd9534f, hair, skin}); ...; batch.end();
   * matrix: THREE.Matrix4 (origin on the ground between the feet, facing +Z; for sitting: under the hips).
   * top/hair/skin: hex number, THREE.Color, or linear [r, g, b]. mode: 0 idle, 1 walk (0.5..1.5 scales cadence), 2 sit.
   */
  function makeBatch({ capacity = 1000, names = null, castShadow = true, receiveShadow = true, material = null } = {}) {
    const group = new THREE.Group(); group.name = 'crowd';
    const slots = new Map(), c = new THREE.Color();
    for (const v of list) {
      if (names && !names.includes(v.name)) continue;
      const cap = typeof capacity === 'object' ? (capacity[v.name] ?? 0) : capacity;
      if (!cap) continue;
      const mesh = makeMesh(v, cap, { castShadow, receiveShadow, material: material ? makeMaterial({ variant: v, ...material }) : null });
      mesh.count = 0; mesh.frustumCulled = false; group.add(mesh);
      const a = mesh.geometry.attributes;
      slots.set(v.name, { mesh, n: 0, cap, walk: a.aWalk, hair: a.aHair, skin: a.aSkin });
    }
    const rgb = (x, arr, i) => {
      if (x == null) return;
      if (Array.isArray(x)) arr.setXYZ(i, x[0], x[1], x[2]);
      else { c.set(x); arr.setXYZ(i, c.r, c.g, c.b); }
    };
    return {
      group, slots,
      begin() { for (const s of slots.values()) s.n = 0; },
      add(variant, matrix, { mode = 1, phase = 0, top = null, hair = null, skin = null } = {}) {
        const s = slots.get(typeof variant === 'string' ? variant : variant.name);
        if (!s || s.n >= s.cap) return -1;
        const i = s.n++;
        s.mesh.setMatrixAt(i, matrix); s.walk.setXY(i, phase, mode);
        if (top != null) { if (Array.isArray(top)) c.setRGB(top[0], top[1], top[2]); else c.set(top); s.mesh.setColorAt(i, c); }
        rgb(hair, s.hair, i); rgb(skin, s.skin, i);
        return i;
      },
      end() {
        for (const s of slots.values()) {
          s.mesh.count = s.n; s.mesh.instanceMatrix.needsUpdate = true; s.mesh.instanceColor.needsUpdate = true;
          s.walk.needsUpdate = true; s.hair.needsUpdate = true; s.skin.needsUpdate = true;
        }
      },
      count() { let n = 0; for (const s of slots.values()) n += s.n; return n; },
    };
  }

  for (const v of list) v.material = makeMaterial({ variant: v, ...material });
  return {
    variants: list, byName, time: timeU, manifest, makeMaterial, makeMesh, makeBatch,
    /** aWalk.y / walkRate needed for feet to match a ground speed in m/s. */
    walkRateFor: (variant, speed) => speed / resolve(variant).walkSpeed,
  };
}
