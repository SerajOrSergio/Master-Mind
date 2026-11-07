// Dynamically load the teacher sidebar into the #sidebar-container
fetch('/src/components/teacher/sidebar/TeacherSidebar.html')
  .then(res => res.text())
  .then(html => {
    document.getElementById('sidebar-container').innerHTML = html;
    // Highlight the active sidebar link based on current URL
    function normalizePath(path) {
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
        if (normalizedHref === currentPath) {
          link.classList.add('active');
        }
      });
    }
    setActiveSidebarLink();
    // Scroll the active link into view so the menu shows the current page
    // without manual scrolling (desktop sidebar + mobile offcanvas menu).
    // Only moves when the active link is out of view. Re-runs on window load
    // and resize in case the sidebar was still hidden when the page painted.
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
    scrollActiveLinkIntoView();
    window.addEventListener('load', scrollActiveLinkIntoView);
    window.addEventListener('resize', scrollActiveLinkIntoView);

    // Preserve the page scroll position when the mobile offcanvas sidebar is
    // opened or closed. Bootstrap 5.0.2 locks body scroll (overflow:hidden)
    // while an offcanvas is shown, which on iOS Safari resets the page to the
    // top. We save the offset before it opens and restore it afterwards so
    // the user stays exactly where they scrolled.
    (function preserveOffcanvasScroll() {
      const offcanvas = document.getElementById('sidebarOffcanvasTeacher');
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

    // Apply the shared Project1-style theme when the theme switch is ON (same as admin)
    tea_sidebarloader_loadDarkMode();
  });

// Apply the shared Project1-style theme when the dark mode switch is ON.
// Delegates to the shared admin dark-mode loader so all three portals use a
// single source of truth (fetches /api/settings/dark-mode, applies the body
// classes and injects 2.0design.css + the brand fonts).
function tea_sidebarloader_loadDarkMode() {
  if (!document.getElementById('shared-dark-mode-loader')) {
    const s = document.createElement('script');
    s.id = 'shared-dark-mode-loader';
    s.src = '/src/components/admin/2.0-design/2.0design.js';
    document.body.appendChild(s);
  }
}
