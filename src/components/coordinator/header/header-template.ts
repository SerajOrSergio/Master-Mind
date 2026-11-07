// Auto-generated from header.html — markup verbatim; the
// build (scripts/generate-pages.mjs) writes header.html from this.
export const htmlFile = 'header.html';
export const pageHtml = `
  <!-- Mobile Header -->
  <nav class="navbar navbar-light bg-white d-md-none shadow-sm sticky-top coordinator-header">
    <div class="container-fluid d-flex justify-content-between align-items-center">
      <div class="d-flex align-items-center">
        <button class="navbar-toggler me-2" id="burgerMenuBtn" type="button" data-bs-toggle="offcanvas" data-bs-target="#sidebarOffcanvas" aria-controls="sidebarOffcanvas" aria-label="Toggle sidebar">
          <span class="navbar-toggler-icon"></span>
        </button>
        <!-- Logo image removed (role is shown in the sidebar menu) -->
        <span class="navbar-brand mb-0 h1 text-primary fw-bold">
          Coordinator
        </span>
      </div>
      <button id="undo-btn" class="undo-btn btn btn-outline-secondary btn-sm">
        Undo
      </button>
    </div>
  </nav>
  <!-- Desktop Header -->
  <div class="coordinator-header d-none d-md-flex justify-content-between align-items-center px-3 py-2 bg-white shadow-sm">
    <div class="d-flex align-items-center">
      <!-- Logo image removed (role is shown in the sidebar menu) -->
      <span class="header-title fs-4 fw-bold text-primary">Coordinator</span>
    </div>
    <button id="undo-btn-desktop" class="undo-btn btn btn-outline-secondary btn-sm">
      Undo
    </button>
  </div>
`;
