// Dynamically load the sidebar into the #sidebar-container
// Persist sidebar scroll position across navigation
const adm_sidebarloader_sidebarContainer = document.getElementById('sidebar-container');
const SIDEBAR_SCROLL_KEY = 'adminSidebarScrollTop';
fetch('/src/components/admin/sidebar-menu/sidebar.html')
  .then(res => res.text())
  .then(html => {
    adm_sidebarloader_sidebarContainer.innerHTML = html;
    // Restore scroll position after the sidebar loads and keep the active link
    // in view. Applied to BOTH the desktop sidebar and the mobile offcanvas
    // menu, so on any page the menu already shows the item you are on (e.g.
    // Settings) without having to scroll it again.
    setTimeout(() => {
      document.querySelectorAll('.sidebar').forEach(function(sidebar) {
        // Restore from localStorage if available
        const savedScroll = localStorage.getItem(SIDEBAR_SCROLL_KEY);
        if (savedScroll !== null) {
          sidebar.scrollTop = parseInt(savedScroll, 10);
        }
        // Save scroll position on scroll
        sidebar.addEventListener('scroll', function() {
          localStorage.setItem(SIDEBAR_SCROLL_KEY, String(sidebar.scrollTop));
        });
        // Save scroll position on link click (before navigation)
        sidebar.querySelectorAll('.nav-link').forEach(function(link) {
          link.addEventListener('click', function() {
            localStorage.setItem(SIDEBAR_SCROLL_KEY, String(sidebar.scrollTop));
          });
        });
      });
      // Scroll the active link into view last, so the menu lands on the page
      // you navigated to (desktop sidebar + mobile offcanvas menu alike).
      scrollActiveLinkIntoView();
    }, 0);

    // Highlight the active sidebar link based on current URL
    function normalizePath(path) {
      // Remove trailing slash except for root, and remove index.html
      if (!path) return '';
      path = path.replace(/\/index\.html$/, '/');
      if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1);
      return path;
    }

    function setActiveSidebarLink() {
      var currentPath = normalizePath(window.location.pathname);
      document.querySelectorAll('.sidebar-links .nav-link').forEach(function(link) {
        link.classList.remove('active');
        var href = link.getAttribute('href');
        if (!href || href === '#') return;
        var normalizedHref = normalizePath(href);
        // Mark as active if normalized href matches normalized current path
        if (normalizedHref === currentPath) {
          link.classList.add('active');
        }
      });
    }
    setActiveSidebarLink();

    // Scroll whichever sidebar contains the active link so the menu shows the
    // page you are on (Settings, Subscription, etc.) without manual scrolling.
    // Only moves when the active link is out of view, so manual scrolling is
    // never overridden. Re-runs on window load and resize in case the sidebar
    // was still hidden when the page first painted.
    function scrollActiveLinkIntoView() {
      document.querySelectorAll('.sidebar').forEach(function(sidebar) {
        if (sidebar.scrollHeight <= sidebar.clientHeight) return; // no overflow
        const active = sidebar.querySelector('.sidebar-links .nav-link.active');
        if (!active) return;
        const top = active.offsetTop;
        const bottom = top + active.offsetHeight;
        if (top < sidebar.scrollTop || bottom > sidebar.scrollTop + sidebar.clientHeight) {
          sidebar.scrollTop = Math.max(0, top - 12);
        }
      });
    }
    window.addEventListener('load', scrollActiveLinkIntoView);
    window.addEventListener('resize', scrollActiveLinkIntoView);

    // Preserve the page scroll position when the mobile offcanvas sidebar is
    // opened or closed. Bootstrap 5.0.2 locks body scroll (overflow:hidden)
    // while an offcanvas is shown, which on iOS Safari resets the page to the
    // top. We save the offset before it opens and restore it afterwards so
    // the user stays exactly where they scrolled (pricing page, etc.).
    (function preserveOffcanvasScroll() {
      const offcanvas = document.getElementById('sidebarOffcanvas');
      if (!offcanvas) return;
      let savedScrollY = 0;
      const getY = () => window.pageYOffset || document.documentElement.scrollTop || 0;
      offcanvas.addEventListener('show.bs.offcanvas', () => {
        savedScrollY = getY();
      });
      offcanvas.addEventListener('shown.bs.offcanvas', () => {
        // Some browsers (iOS Safari) jump to top on focus / overflow change.
        window.scrollTo(0, savedScrollY);
      });
      offcanvas.addEventListener('hidden.bs.offcanvas', () => {
        // Restore once the close transition finishes.
        window.scrollTo(0, savedScrollY);
      });
    })();

    // Ensure logout.js is loaded after sidebar is injected
    var script = document.createElement('script');
    script.src = '/src/components/logout/logout.js';
    document.body.appendChild(script);
    // Also ensure the logout button CSS is loaded
    var style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = '/src/components/logout/logout.css';
    document.head.appendChild(style);

    import('/src/components/admin/header/header.js').then(mod => {
      if (mod && typeof mod.setupUndoButton === 'function') {
        mod.setupUndoButton();
      }
      if (mod && typeof mod.setupBurgerMenu === 'function') {
        mod.setupBurgerMenu();
      }
    });

    // Load dark mode settings
    adm_sidebarloader_loadDarkMode();
  });

function adm_sidebarloader_loadDarkMode() {
  // Inject the shared Project1-style theme (idempotent) so it loads even
  // on pages that do not include 2.0design.js.
  if (!document.getElementById('project1-theme-css')) {
    const link = document.createElement('link');
    link.id = 'project1-theme-css';
    link.rel = 'stylesheet';
    link.href = '/src/components/admin/2.0-design/2.0design.css';
    document.head.appendChild(link);
  }

  fetch('/api/settings/dark-mode')
    .then(res => res.json())
    .then(data => {
      // Cache the setting so the page generator's boot snippet can paint the
      // correct theme immediately on the next navigation (no old-theme flash).
      try { localStorage.setItem('mm-dark-mode', data.darkMode ? '1' : '0'); } catch (e) {}
      if (data.darkMode) {
        document.body.classList.add('dark-mode');
        document.body.classList.add('gradient-glassmorphism');
        // Load the Project1 brand fonts (Fraunces + Inter) only in dark mode,
        // via <link> so no stylesheet is blocked on the Google Fonts request.
        if (!document.getElementById('project1-fonts-link')) {
          const fonts = document.createElement('link');
          fonts.id = 'project1-fonts-link';
          fonts.rel = 'stylesheet';
          fonts.href = 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400..700&family=Inter:wght@400;500;600;700&display=swap';
          document.head.appendChild(fonts);
        }
      } else {
        document.body.classList.remove('dark-mode');
        document.body.classList.remove('gradient-glassmorphism');
      }
    })
    .catch(() => {
      console.error('Failed to load dark mode setting');
    });
}
