// Dynamically load the coordinator sidebar into the #sidebar-container
fetch('/src/components/coordinator/sidebar-menu/sidebar.html')
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

    // Preserve the page scroll position when the mobile offcanvas sidebar is
    // opened or closed. Bootstrap 5.0.2 locks body scroll (overflow:hidden)
    // while an offcanvas is shown, which on iOS Safari resets the page to the
    // top. We save the offset before it opens and restore it afterwards so
    // the user stays exactly where they scrolled.
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

    // Attach logout event
    const logoutBtn = document.getElementById('logout-btn') || document.getElementById('logout-btn-mobile');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        localStorage.clear();
        window.location.href = '/login';
      });
    }

    // Load logout button CSS for pill style
    var style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = '/src/components/logout/logout.css';
    document.head.appendChild(style);
  });
