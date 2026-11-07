// Auto-generated from sidebar.html — markup verbatim; the
// build (scripts/generate-pages.mjs) writes sidebar.html from this.
export const htmlFile = 'sidebar.html';
export const pageHtml = `
  <!-- ================= MOBILE SIDEBAR ================= -->
  <div class="offcanvas offcanvas-start d-md-none" tabindex="-1" id="sidebarOffcanvas">
    <div class="offcanvas-header">
      <h5 class="offcanvas-title">Coordinator</h5>
      <button type="button" class="btn-close" data-bs-dismiss="offcanvas"></button>
    </div>
    <div class="offcanvas-body p-0">
      <nav class="sidebar d-flex flex-column p-3 bg-white h-100">
        <div class="d-flex align-items-center mb-4">
          <img src="/src/assets/Mastermind_logo.jpeg" width="40" height="40" class="me-2">
          <span class="fs-4 fw-bold text-primary">
            <i class="bi bi-person-lines-fill me-2"></i>Coordinator
          </span>
        </div>
        <ul class="nav nav-pills flex-column mb-auto sidebar-links">
          <li class="nav-item mb-2">
            <a href="/src/pages/coordinator/teachers-availability/index.html" class="nav-link d-flex align-items-center">
              <i class="bi bi-calendar-check me-2 fs-5"></i> Teachers Availability
            </a>
          </li>
          <li class="nav-item mb-2">
            <a href="/src/pages/coordinator/topics/index.html" class="nav-link d-flex align-items-center">
              <i class="bi bi-book me-2 fs-5"></i> Topics
            </a>
          </li>
        </ul>
        <div class="mt-auto pt-4 border-top text-center">
          <button id="logout-btn-mobile" class="btn btn-outline-danger w-100">
            <i class="bi bi-box-arrow-right me-2"></i> Logout
          </button>
        </div>
      </nav>
    </div>
  </div>
  <!-- ================= DESKTOP SIDEBAR ================= -->
  <div class="d-none d-md-block">
    <nav class="sidebar d-flex flex-column p-3 bg-white shadow-sm vh-100">
      <div class="d-flex align-items-center mb-4">
        <img src="/src/assets/Mastermind_logo.jpeg" width="40" height="40" class="me-2">
        <span class="fs-4 fw-bold text-primary">
          <i class="bi bi-person-lines-fill me-2"></i>Coordinator
        </span>
      </div>
      <ul class="nav nav-pills flex-column mb-auto sidebar-links">
        <li class="nav-item mb-2">
          <a href="/src/pages/coordinator/teachers-availability/index.html" class="nav-link d-flex align-items-center">
            <i class="bi bi-calendar-check me-2 fs-5"></i> Teachers Availability
          </a>
        </li>
        <li class="nav-item mb-2">
          <a href="/src/pages/coordinator/topics/index.html" class="nav-link d-flex align-items-center">
            <i class="bi bi-book me-2 fs-5"></i> Topics
          </a>
        </li>
      </ul>
      <div class="mt-auto pt-4 border-top text-center">
        <button id="logout-btn" class="btn btn-outline-danger w-100 mt-2">
          <i class="bi bi-box-arrow-right me-2"></i> Logout
        </button>
      </div>
    </nav>
  </div>
`;
