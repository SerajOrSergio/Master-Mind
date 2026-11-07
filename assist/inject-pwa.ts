import fs from 'fs';
import path from 'path';
/* One-shot script: add iOS/PWA meta tags, viewport-fit, service-worker
   registration, the IPv4 -> mastermind.local hostname redirect and missing
   portal header.css links to every HTML page. */

const files = [];
(function walk(dir) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.html')) files.push(p);
  }
})(path.join(__dirname, '..', 'src'));

const HEADER_CSS = {
  'admin-header-container': '/src/components/admin/header/header.css',
  'receptionist-header-container': '/src/components/receptionist/header/header.css',
  'coordinator-header-container': '/src/components/coordinator/header/header.css',
  'teacher-header-container': '/src/components/teacher/header/header.css'
};

const PWA_META = `  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="default">
  <meta name="apple-mobile-web-app-title" content="MasterMind">
  <meta name="theme-color" content="#6C4DF6">
  <link rel="manifest" href="/assist/manifest.json">
  <link rel="apple-touch-icon" href="/src/assets/Mastermind_logo.jpeg">
`;

const SW_SCRIPT = '  <script src="/assist/pwa-register.js" defer></script>\n';

// IPv4 -> mastermind.local redirect so anything added to the Home Screen
// saves the NAME (which follows the PC to any Wi-Fi), never a raw IP.
const USE_HOSTNAME_SCRIPT = '  <script src="/assist/use-hostname.js" defer></script>\n';

let changed = 0;
for (const f of files) {
  const orig = fs.readFileSync(f, 'utf8');
  let s = orig;

  // 0. Hostname redirect — every page, idempotent (runs even on pages that
  //    already received the PWA block below).
  if (!s.includes('/assist/use-hostname.js')) {
    s = s.replace(/<\/body>/, USE_HOSTNAME_SCRIPT + '</body>');
  }

  if (s.includes('apple-mobile-web-app-capable')) {
    if (s !== orig) {
      fs.writeFileSync(f, s);
      changed++;
    }
    continue; // PWA block already done
  }

  // 1. viewport-fit=cover (keep existing viewport content)
  s = s.replace(
    /(<meta name="viewport" content=")([^"]*)(">)/,
    (m, pre, v, post) => (v.includes('viewport-fit') ? m : pre + v + ', viewport-fit=cover' + post)
  );

  // 2. PWA meta block right after <head ...>
  s = s.replace(/<head[^>]*>/, (m) => m + '\n' + PWA_META);

  // 3. Service worker registration before </body>
  s = s.replace(/<\/body>/, SW_SCRIPT + '</body>');

  // 4. Portal header.css link if the page has a header container but does not
  //    link its portal's header.css yet (insert last so it wins the cascade).
  for (const [marker, css] of Object.entries(HEADER_CSS)) {
    if (s.includes(marker) && !s.includes(css)) {
      s = s.replace(/<\/head>/, '  <link rel="stylesheet" href="' + css + '">\n</head>');
      break;
    }
  }

  if (s !== orig) {
    fs.writeFileSync(f, s);
    changed++;
  }
}
console.log('Injected into', changed, 'files (total', files.length + ')');
