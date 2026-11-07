// Register the MasterMind service worker for offline support and fast
// repeat navigation.
//
// Note: service workers only run on secure contexts (https:// or
// http://localhost). The iOS home-screen "app" experience (standalone, no
// Safari chrome) works regardless, via the apple-mobile-web-app-* meta tags.
//
// This file also drives the desktop "Install MasterMind" prompt. When the
// site is installable (secure context + manifest + service worker) the
// browser fires a `beforeinstallprompt` event. We intercept it, suppress the
// browser's own install UI, and show a branded popup instead that installs
// the app into its own window. The popup only appears on desktop-sized
// screens, once per browser session, and never once the app is installed.
(function () {
  // --- Service worker registration ---
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      // The service worker lives in /assist but must control the whole site, so
      // request scope '/' (allowed by the Service-Worker-Allowed header the
      // server sets for /assist/sw.js).
      navigator.serviceWorker.register('/assist/sw.js', { scope: '/' }).catch(function () {
        // SW unavailable (e.g. plain http over LAN) — app still works normally.
      });
    });
  }

  // --- Desktop "Install MasterMind" prompt ---
  var deferredPrompt = null;
  var overlay = null;
  var visible = false;

  function isStandalone() {
    return (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
      window.navigator.standalone === true;
  }

  function isDesktopSize() {
    return window.matchMedia && window.matchMedia('(min-width: 768px)').matches;
  }

  function alreadyInstalled() {
    try { return localStorage.getItem('mm-app-installed') === '1'; } catch (e) { return false; }
  }

  function alreadyAskedThisSession() {
    try { return sessionStorage.getItem('mm-app-asked') === '1'; } catch (e) { return false; }
  }

  function markAsked() {
    try { sessionStorage.setItem('mm-app-asked', '1'); } catch (e) {}
  }

  function markInstalled() {
    try { localStorage.setItem('mm-app-installed', '1'); } catch (e) {}
    try { sessionStorage.setItem('mm-app-asked', '1'); } catch (e) {}
  }

  function hideOverlay() {
    if (!overlay) return;
    visible = false;
    overlay.style.display = 'none';
  }

  function showOverlay() {
    if (!visible && overlay) {
      visible = true;
      overlay.style.display = 'flex';
    }
  }

  async function onInstallClick() {
    if (!deferredPrompt) {
      hideOverlay();
      return;
    }
    deferredPrompt.prompt();
    try {
      var choice = await deferredPrompt.userChoice;
      if (choice && choice.outcome === 'accepted') markInstalled();
      else markAsked();
    } catch (e) {
      markAsked();
    }
    deferredPrompt = null;
    hideOverlay();
  }

  function buildOverlay() {
    var el = document.createElement('div');
    el.id = 'mm-install-overlay';
    el.className = 'mm-install-overlay';
    el.innerHTML =
      '<div class="mm-install-card">' +
        '<button type="button" class="mm-install-close" aria-label="Close">&times;</button>' +
        '<img class="mm-install-icon" src="/src/assets/Mastermind_logo.jpeg" alt="MasterMind">' +
        '<div class="mm-install-title">Install MasterMind App</div>' +
        '<div class="mm-install-text">Open MasterMind in its own app window — no browser tabs or toolbar, with a faster, app-like experience.</div>' +
        '<div class="mm-install-actions">' +
          '<button type="button" class="mm-install-btn mm-install-btn-primary" id="mm-install-confirm">Install</button>' +
          '<button type="button" class="mm-install-btn mm-install-btn-ghost" id="mm-install-dismiss">Not now</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(el);

    var style = document.createElement('style');
    style.textContent =
      '.mm-install-overlay{' +
        'position:fixed;inset:0;z-index:2147483000;display:none;align-items:center;justify-content:center;' +
        'background:rgba(15,23,42,0.45);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);' +
        'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;' +
      '}' +
      '.mm-install-card{' +
        'position:relative;width:380px;max-width:calc(100vw - 48px);background:#fff;border-radius:18px;' +
        'padding:32px 28px 26px;box-shadow:0 24px 60px rgba(15,23,42,0.28);text-align:center;' +
        'animation:mm-install-pop .22s ease-out;' +
      '}' +
      '@keyframes mm-install-pop{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:scale(1)}}' +
      '.mm-install-close{' +
        'position:absolute;top:10px;right:14px;border:none;background:none;font-size:24px;line-height:1;' +
        'color:#94a3b8;cursor:pointer;padding:4px;' +
      '}' +
      '.mm-install-close:hover{color:#334155}' +
      '.mm-install-icon{width:72px;height:72px;border-radius:16px;margin:0 auto 14px;display:block;' +
        'box-shadow:0 6px 18px rgba(108,77,246,0.28);}' +
      '.mm-install-title{font-size:20px;font-weight:700;color:#0f172a;margin-bottom:8px;}' +
      '.mm-install-text{font-size:14px;line-height:1.55;color:#475569;margin-bottom:22px;}' +
      '.mm-install-actions{display:flex;gap:10px;justify-content:center;}' +
      '.mm-install-btn{border:none;border-radius:10px;padding:10px 22px;font-size:14px;font-weight:600;cursor:pointer;}' +
      '.mm-install-btn-primary{background:linear-gradient(135deg,#6C4DF6,#9b5cf6);color:#fff;' +
        'box-shadow:0 6px 16px rgba(108,77,246,0.35);}' +
      '.mm-install-btn-primary:hover{filter:brightness(1.07)}' +
      '.mm-install-btn-ghost{background:#f1f5f9;color:#334155;}' +
      '.mm-install-btn-ghost:hover{background:#e2e8f0}';
    document.head.appendChild(style);

    el.querySelector('.mm-install-close').addEventListener('click', function () {
      markAsked();
      hideOverlay();
    });
    el.querySelector('#mm-install-dismiss').addEventListener('click', function () {
      markAsked();
      hideOverlay();
    });
    el.querySelector('#mm-install-confirm').addEventListener('click', onInstallClick);
    // Clicking the dark backdrop counts as "not now".
    el.addEventListener('click', function (e) {
      if (e.target === el) {
        markAsked();
        hideOverlay();
      }
    });
    return el;
  }

  function maybeShowInstallPrompt() {
    if (alreadyInstalled() || alreadyAskedThisSession() || isStandalone() || !isDesktopSize() || !deferredPrompt) return;
    if (!overlay) overlay = buildOverlay();
    // Small delay so the page has visibly loaded before the popup appears.
    setTimeout(showOverlay, 1200);
  }

  window.addEventListener('beforeinstallprompt', function (e) {
    // Stop Chrome/Edge from showing their own install UI — we show our own.
    e.preventDefault();
    deferredPrompt = e;
    maybeShowInstallPrompt();
  });

  window.addEventListener('appinstalled', function () {
    markInstalled();
    hideOverlay();
  });
})();
