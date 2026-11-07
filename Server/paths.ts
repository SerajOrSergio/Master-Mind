// Central resolver for the project's LIVE database folder.
// The compiled server runs from dist/Server — but a rebuild (npm run build)
// deletes dist/ and re-creates it, so anything saved into dist/database
// would be silently erased on every rebuild. All APIs therefore read and
// write the database in the PROJECT ROOT (next to package.json), which never
// gets touched by the build.
import fs from 'fs';
import path from 'path';

let cachedRoot: string | null = null;

export function projectRoot(): string {
  if (cachedRoot) return cachedRoot;
  let dir = __dirname;
  for (let i = 0; i < 10; i++) {
    if (fs.existsSync(path.join(dir, 'package.json'))) {
      cachedRoot = dir;
      return dir;
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  cachedRoot = path.resolve(__dirname, '../..'); // fallback: dist/Server -> project root
  return cachedRoot;
}

export function dbDir(): string {
  return path.join(projectRoot(), 'database');
}
