// Global Dark Mode Loader for Admin Pages
// This script loads and applies dark mode settings on page load

(function() {
  // Inject the shared Project1-style theme (idempotent). Its rules are
  // scoped to body.dark-mode.gradient-glassmorphism, so it is inert in
  // light mode and simply wins over each page's old glassmorphism block
  // because it is appended after the page stylesheets.
  function ensureProject1Theme() {
    if (document.getElementById('project1-theme-css')) return;
    const link = document.createElement('link');
    link.id = 'project1-theme-css';
    link.rel = 'stylesheet';
    link.href = '/src/components/admin/2.0-design/2.0design.css';
    document.head.appendChild(link);
  }

  // Load the Project1 brand fonts (Fraunces + Inter) only in dark mode.
  // Injected via a <link> instead of an @import so no stylesheet is ever
  // blocked on the Google Fonts request.
  function ensureProject1Fonts() {
    if (document.getElementById('project1-fonts-link')) return;
    const link = document.createElement('link');
    link.id = 'project1-fonts-link';
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400..700&family=Inter:wght@400;500;600;700&display=swap';
    document.head.appendChild(link);
  }

  function loadDarkMode() {
    ensureProject1Theme();
    fetch('/api/settings/dark-mode')
      .then(res => res.json())
      .then(data => {
        // Cache the setting so the page generator's boot snippet can paint the
        // correct theme immediately on the next navigation (no old-theme flash).
        try { localStorage.setItem('mm-dark-mode', data.darkMode ? '1' : '0'); } catch (e) {}
        if (data.darkMode) {
          document.body.classList.add('dark-mode');
          document.body.classList.add('gradient-glassmorphism');
          ensureProject1Fonts();
        } else {
          document.body.classList.remove('dark-mode');
          document.body.classList.remove('gradient-glassmorphism');
        }
      })
      .catch(() => {
        console.error('Failed to load dark mode setting');
      });
  }

  // Load dark mode when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadDarkMode);
  } else {
    loadDarkMode();
  }
})();