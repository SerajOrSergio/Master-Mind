// Auto-generated from sidebar.html — markup verbatim; the
// build (scripts/generate-pages.mjs) writes sidebar.html from this.
export const htmlFile = 'sidebar.html';
export const pageHtml = `
  <!-- ================= MOBILE SIDEBAR ================= -->
  <div class="offcanvas offcanvas-start d-md-none" tabindex="-1" id="sidebarOffcanvas">
    <div class="offcanvas-header">
      <h5 class="offcanvas-title">Receptionist</h5>
      <button type="button" class="btn-close" data-bs-dismiss="offcanvas"></button>
    </div>
  
    <div class="offcanvas-body p-0">
      <nav class="sidebar d-flex flex-column p-3 bg-white h-100">
  
        <!-- Logo -->
        <div class="d-flex align-items-center mb-4">
          <img src="/src/assets/Mastermind_logo.jpeg" width="40" height="40" class="me-2">
          <span class="fs-4 fw-bold text-primary">
            <i class="bi bi-person-lines-fill me-2"></i>Receptionist
          </span>
        </div>
  
        <!-- Links -->
        <ul class="nav nav-pills flex-column mb-auto sidebar-links">
          <!-- Pages will be dynamically loaded here from database -->
        </ul>
  
        <!-- Logout -->
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
  
      <!-- Logo -->
      <div class="d-flex align-items-center mb-4">
        <img src="/src/assets/Mastermind_logo.jpeg" width="40" height="40" class="me-2">
        <span class="fs-4 fw-bold text-primary">
          <i class="bi bi-person-lines-fill me-2"></i>Receptionist
        </span>
      </div>
  
      <!-- Links -->
      <ul class="nav nav-pills flex-column mb-auto sidebar-links">
        <!-- Pages will be dynamically loaded here from database -->
      </ul>
  
      <!-- Logout -->
      <div class="mt-auto pt-4 border-top text-center">
        <button id="logout-btn" class="btn btn-outline-danger w-100 mt-2">
          <i class="bi bi-box-arrow-right me-2"></i> Logout
        </button>
      </div>
  
    </nav>
  </div>
`;
