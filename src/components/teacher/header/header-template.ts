// Auto-generated from header.html — markup verbatim; the
// build (scripts/generate-pages.mjs) writes header.html from this.
export const htmlFile = 'header.html';
export const pageHtml = `
  <!-- Mobile Header -->
  <nav class="navbar navbar-light bg-white d-md-none shadow-sm sticky-top teacher-header">
    <div class="container-fluid d-flex justify-content-between align-items-center">
      <div class="d-flex align-items-center">
        <button class="navbar-toggler me-2" type="button" data-bs-toggle="offcanvas" data-bs-target="#sidebarOffcanvasTeacher" aria-controls="sidebarOffcanvasTeacher" aria-label="Toggle sidebar">
          <span class="navbar-toggler-icon"></span>
        </button>
        <!-- Logo image removed (role is shown in the sidebar menu) -->
      </div>
      <!-- Undo (mobile) -->
      <button id="undo-btn" class="undo-btn btn btn-outline-secondary btn-sm">
        Undo
      </button>
    </div>
  </nav>
  <!-- Desktop Header -->
  <div class="teacher-header d-none d-md-flex justify-content-between align-items-center px-3 py-2 bg-white shadow-sm">
    <div class="d-flex align-items-center">
      <!-- Logo image removed (role is shown in the sidebar menu) -->
    </div>
    <!-- Undo (desktop) -->
    <button id="undo-btn-desktop" class="undo-btn btn btn-outline-secondary btn-sm">
      Undo
    </button>
  </div>
`;
