// Build step: walks dist/ for the compiled *-template.js and *-styles.js
// modules produced from the TypeScript sources and writes the browser-facing
// .html / .css artifacts byte-identically to what manual files served before.
// Also validates (same folder + same name minus suffix) so nothing is silently
// skipped.
import fs from 'fs';
import path from 'path';
import url from 'url';

const ROOT = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');

const walk = (dir: string): string[] =>
  fs.existsSync(dir)
    ? fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
        e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]
      )
    : [];

interface PageModule {
  css?: string;
  cssFile?: string;
  pageHtml?: string;
  htmlFile?: string;
}

let htmlCount = 0;
let cssCount = 0;
const Broken: Array<[string, string]> = [];

const modules = walk(DIST).filter((f) => /-(template|styles)\.js$/.test(f));

for (const modPath of modules) {
  const importPath = 'file://' + modPath.replace(/\\/g, '/');
  let mod: PageModule;
  try {
    mod = (await import(importPath)) as PageModule;
  } catch (err) {
    Broken.push([path.relative(DIST, modPath), 'IMPORT FAILED: ' + (err as Error).message]);
    continue;
  }

  if (typeof mod.css === 'string' && typeof mod.cssFile === 'string') {
    fs.writeFileSync(path.join(path.dirname(modPath), mod.cssFile), mod.css);
    cssCount++;
    continue;
  }

  if (typeof mod.pageHtml === 'string' && typeof mod.htmlFile === 'string') {
    fs.writeFileSync(path.join(path.dirname(modPath), mod.htmlFile), mod.pageHtml);
    htmlCount++;
    continue;
  }

  Broken.push([path.relative(DIST, modPath), 'MISSING pageHtml/htmlFile or css/cssFile']);
}

console.log(`generate-pages: wrote ${htmlCount} .html + ${cssCount} .css artifacts into dist/`);
if (Broken.length) {
  console.error('BROKEN/SKIPPED modules:');
  for (const [f, why] of Broken) console.error(`  ${f}: ${why}`);
  process.exit(1);
}
