import { readFileSync, writeFileSync, mkdirSync, copyFileSync, linkSync, existsSync, unlinkSync, statSync } from 'node:fs';
import { resolve, join } from 'node:path';

// Reads the streamed Kvarnholmen city from the battle-car project (read-only) and links it into public/.
// Hard links cost no disk space on the same volume; another volume falls back to a copy.
const source = resolve(process.argv[2] || '/Volumes/work2/Projekt/kalmar-madmax-battlecars/public');
const out = resolve('public');
mkdirSync(join(out, 'tiles'), { recursive: true });
const index = JSON.parse(readFileSync(join(source, 'tiles/tiles.json'), 'utf8'));
let bytes = 0, linked = 0;
for (const file of [...index.tiles.map(t => `${t.id}.glb`), 'materials.glb', 'materials-mobile.glb']) {
  const from = join(source, 'tiles', file), to = join(out, 'tiles', file);
  if (existsSync(to)) unlinkSync(to);
  try { linkSync(from, to); linked++; } catch { copyFileSync(from, to); }
  bytes += statSync(from).size;
}
writeFileSync(join(out, 'tiles/tiles.json'), JSON.stringify(index));
copyFileSync(join(source, 'map.json'), join(out, 'map.json'));
console.log(`Imported ${index.tiles.length} city tiles (${(bytes / 1e6).toFixed(0)} MB, ${linked} hard-linked) and map.json from ${source}`);
