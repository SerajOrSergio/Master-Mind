// Dynamically load the sidebar into the #sidebar-container
// Preserve sidebar scroll position
const rec_sidebarloader_sidebarContainer = document.getElementById('sidebar-container');
let lastSidebarScroll = 0;
if (rec_sidebarloader_sidebarContainer) {
  const prevSidebar = rec_sidebarloader_sidebarContainer.querySelector('.sidebar');
  if (prevSidebar) {
    lastSidebarScroll = prevSidebar.scrollTop;
  }
}

// Fetch page access configuration first, then load sidebar
fetch('/api/receptionist-page-access')
  .then(res => {
    if (!res.ok) {
      console.warn('Failed to load page access config, using default sidebar');
      return null;
    }
    return res.json();
  })
  .then(pageAccessConfig => {
    // Load the sidebar HTML
    return fetch('../../../components/receptionist/sidebar-menu/sidebar.html')
      .then(res => res.text())
      .then(html => ({ html, pageAccessConfig }));
  })
  .then(({ html, pageAccessConfig }) => {
    rec_sidebarloader_sidebarContainer.innerHTML = html;
    
    // If page access config is available, build sidebar links
    if (pageAccessConfig && pageAccessConfig.pages) {
      buildSidebarLinks(pageAccessConfig.pages);
    }
    
    // Restore scroll position after sidebar loads (desktop + mobile menus)
    setTimeout(() => {
      document.querySelectorAll('.sidebar').forEach(function(sidebar) {
        sidebar.scrollTop = lastSidebarScroll;
      });
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
    
    // Call setActiveSidebarLink after links are built, then scroll the active
    // link into view so the menu shows the current page (desktop + mobile)
    // without manual scrolling.
    setTimeout(() => {
      setActiveSidebarLink();
      scrollActiveLinkIntoView();
    }, 50);

    // Scroll whichever sidebar contains the active link so the menu shows the
    // page you are on without manual scrolling. Only moves when the active
    // link is out of view. Re-runs on window load and resize in case the
    // sidebar was still hidden when the page first painted.
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

    import('/src/components/receptionist/header/header.js').then(mod => {
      if (mod && typeof mod.setupUndoButton === 'function') {
        mod.setupUndoButton();
      }
      if (mod && typeof mod.setupBurgerMenu === 'function') {
        mod.setupBurgerMenu();
      }
    });

    // Apply the shared Project1-style theme when dark mode is ON (same as admin)
    rec_sidebarloader_loadDarkMode();
  })
  .catch(err => {
    console.error('Error loading sidebar:', err);
    // Fallback: load sidebar without filtering
    fetch('../../../components/receptionist/sidebar-menu/sidebar.html')
      .then(res => res.text())
      .then(html => {
        rec_sidebarloader_sidebarContainer.innerHTML = html;
        rec_sidebarloader_loadDarkMode();
      });
  });

// Apply the shared Project1-style theme when the dark mode switch is ON.
// Delegates to the shared admin dark-mode loader so all three portals use a
// single source of truth (fetches /api/settings/dark-mode, applies the body
// classes and injects 2.0design.css + the brand fonts).
function rec_sidebarloader_loadDarkMode() {
  if (!document.getElementById('shared-dark-mode-loader')) {
    const s = document.createElement('script');
    s.id = 'shared-dark-mode-loader';
    s.src = '/src/components/admin/2.0-design/2.0design.js';
    document.body.appendChild(s);
  }
}

// Build sidebar links dynamically from page access configuration
function buildSidebarLinks(pages) {
  const enabledPages = pages.filter(page => page.enabled);
  // Sort pages by order field
  const sortedPages = enabledPages.sort((a, b) => (a.order || 0) - (b.order || 0));
  const sidebarLinksContainers = document.querySelectorAll('.sidebar-links');
  
  sidebarLinksContainers.forEach(container => {
    container.innerHTML = ''; // Clear existing links
    
    sortedPages.forEach(page => {
      const li = document.createElement('li');
      li.className = 'nav-item mb-2';
      
      const a = document.createElement('a');
      a.href = page.path;
      a.className = 'nav-link d-flex align-items-center';
      a.innerHTML = `<i class="bi ${page.icon} me-2 fs-5"></i> ${page.name}`;
      
      li.appendChild(a);
      container.appendChild(li);
    });
  });
}
