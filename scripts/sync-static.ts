// Copies everything the compiled TS output needs to mirror the original
// project layout inside dist/: HTML/CSS/assets from src, Bootstrap, the JSON
// database, the PWA manifest and the HTTPS certs. The compiled server runs
// from dist/, so all of its __dirname-relative paths keep working unchanged.
// (HTML/CSS artifacts themselves are (re)generated from the TypeScript
// *-template.ts / *-styles.ts modules by generate-pages.ts, run right after
// the TypeScript compile.)
import fs from 'fs';
import path from 'path';
import url from 'url';

const ROOT = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');

const copy = (src: string, dest: string, filter?: (s: string) => boolean) => {
  if (!fs.existsSync(src)) return;
  fs.cpSync(src, dest, { recursive: true, filter });
};

// Clean slate
fs.rmSync(DIST, { recursive: true, force: true });

// Static assets that are served verbatim (NOTE: the database folder is NOT
// copied — the server reads/writes the LIVE database/ folder in the project
// root via Server/paths.ts, so runtime changes survive every rebuild).
copy(path.join(ROOT, 'bootstrap-5.0.2'), path.join(DIST, 'bootstrap-5.0.2'));
copy(path.join(ROOT, 'src'), path.join(DIST, 'src'), (s) => !/\.(js|jsx|ts|tsx)$/.test(s));
copy(
  path.join(ROOT, 'assist'),
  path.join(DIST, 'assist'),
  (s) => !s.endsWith('.js') && !s.endsWith('.ts') && !s.endsWith('.mts') && !s.endsWith('.cts')
);
copy(path.join(ROOT, 'Server', 'certs'), path.join(DIST, 'Server', 'certs'));

// The compiled client modules (src/, assist/) are ES modules while the server
// (dist/Server) is CommonJS — mark the two ESM folders so Node skips its
// "typeless package" reparse overhead/warning when importing them.
const modulePackage = JSON.stringify({ type: 'module' });
for (const dir of ['src', 'assist']) {
  const dirAbs = path.join(DIST, dir);
  if (fs.existsSync(dirAbs)) fs.writeFileSync(path.join(dirAbs, 'package.json'), modulePackage);
}

console.log('Static assets synced into dist/');
