// Login page features — replaces the previously inline <script> blocks in
// index.html: the password visibility toggle and the iOS home-screen tip.
// Compiled by tsc to login-features.js and loaded from the login folder.

// -------- Password visibility toggle --------
(function setupPasswordToggle(): void {
  const toggle = document.getElementById('passwordToggle');
  const input = document.getElementById('password') as HTMLInputElement | null;
  if (toggle && input) {
    toggle.addEventListener('click', function () {
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      toggle.innerHTML = show
        ? '<i class="bi bi-eye-slash"></i>'
        : '<i class="bi bi-eye"></i>';
    });
  }
})();

// -------- iOS home-screen tip --------
// Add the app from mastermind.local (never an IP), so the icon saves the NAME
// and follows this PC to any Wi-Fi.
(function setupHomeScreenTip(): void {
  const isIOS =
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  if (!isIOS) return;
  if ((navigator as { standalone?: boolean }).standalone) return; // already added to Home Screen
  try {
    if (localStorage.getItem('mm-hs-tip-dismissed')) return;
  } catch (e) {
    /* storage unavailable — still show the tip */
  }

  const tip = document.getElementById('hsTip');
  const title = document.getElementById('hsTipTitle');
  const text = document.getElementById('hsTipText');
  const action = document.getElementById('hsTipAction');
  const close = document.getElementById('hsTipClose');
  if (!tip || !title || !text || !action || !close) return;

  const isIp = /^(\d{1,3}\.){3}\d{1,3}$/.test(location.hostname);
  const port = location.port ? ':' + location.port : '';
  const nameUrl =
    location.protocol + '//mastermind.local' + port +
    location.pathname + location.search + location.hash;

  const dismiss = (): void => {
    try {
      localStorage.setItem('mm-hs-tip-dismissed', '1');
    } catch (e) {
      /* ignore */
    }
    tip.hidden = true;
  };

  if (isIp) {
    title.textContent = 'Add the app from the right link';
    text.textContent =
      'You opened the site by its IP address. Icons added from an IP break when the Wi-Fi changes — open mastermind.local and add it from there instead.';
    action.textContent = 'Open mastermind.local';
    action.addEventListener('click', function () {
      window.location.href = nameUrl;
    });
  } else {
    title.textContent = 'Works on any Wi-Fi';
    text.textContent =
      'Tap Share → Add to Home Screen. The icon saves mastermind.local, which re-resolves to this PC on every network — no re-adding when you switch Wi-Fi.';
    action.textContent = 'Got it';
    action.addEventListener('click', dismiss);
  }

  close.addEventListener('click', dismiss);
  tip.hidden = false;
})();
