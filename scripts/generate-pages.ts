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

// --- Theme boot -----------------------------------------------------------
// Portal pages use the shared 2.0 theme. Its stylesheet used to be injected
// by JavaScript after the page had already painted, so the old glass theme
// showed for a moment on every navigation (very visible on slow machines).
// Writing the stylesheet into <head> and applying the cached theme class
// immediately after <body> means the right theme is there from the first
// paint; the runtime loader still fetches the live setting and refreshes the
// cache for the next navigation.
const THEME_LINK =
  '<link id="project1-theme-css" rel="stylesheet" href="/src/components/admin/2.0-design/2.0design.css">';
const THEME_BOOT =
  '<script>try{if(localStorage.getItem("mm-dark-mode")==="1"){document.body.classList.add("dark-mode","gradient-glassmorphism");}}catch(e){}</script>';

function usesProjectTheme(modPath: string, html: string): boolean {
  if (modPath.includes('/pages/login/')) return false;
  return html.includes('2.0design.js') ||
    html.includes('/src/components/admin/sidebar-menu/sidebar-loader.js') ||
    html.includes('/src/components/receptionist/sidebar-menu/sidebar-loader.js') ||
    html.includes('/src/components/teacher/sidebar/sidebar-loader.js');
}

function preparePageHtml(html: string, modPath: string): string {
  if (!usesProjectTheme(modPath, html)) return html;
  if (!/<body[\s>]/i.test(html)) return html; // header/fragment modules
  let out = html;
  if (out.includes('</head>') && !out.includes('2.0-design/2.0design.css')) {
    out = out.replace('</head>', `  ${THEME_LINK}\n</head>`);
  }
  out = out.replace(/<body\b[^>]*>/i, (tag) => `${tag}\n  ${THEME_BOOT}`);
  return out;
}

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
    fs.writeFileSync(path.join(path.dirname(modPath), mod.htmlFile), preparePageHtml(mod.pageHtml, modPath));
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
