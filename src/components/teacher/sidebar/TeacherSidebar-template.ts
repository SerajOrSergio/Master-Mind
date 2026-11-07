// Auto-generated from TeacherSidebar.html — markup verbatim; the
// build (scripts/generate-pages.mjs) writes TeacherSidebar.html from this.
export const htmlFile = 'TeacherSidebar.html';
export const pageHtml = `
  
  <!-- Mobile navbar removed: now handled by teacher header -->
  <!-- Sidebar for both desktop and mobile (offcanvas for mobile) -->
  <div class="offcanvas offcanvas-start d-md-none" tabindex="-1" id="sidebarOffcanvasTeacher" aria-labelledby="sidebarOffcanvasTeacherLabel">
    <div class="offcanvas-header">
      <h5 class="offcanvas-title" id="sidebarOffcanvasTeacherLabel">Teacher</h5>
      <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body p-0">
      <nav class="sidebar d-flex flex-column p-3 bg-white h-100">
        <div class="d-flex align-items-center mb-4">
          <img src="/src/assets/Mastermind_logo.jpeg" alt="Logo" width="40" height="40" class="me-2">
          <span class="fs-4 fw-bold text-primary">
            <i class="bi bi-person-badge me-2"></i>Teacher
          </span>
        </div>
        <ul class="nav nav-pills flex-column mb-auto sidebar-links">
          <li class="nav-item mb-2">
            <a href="/src/pages/teacher/session-form/SessionForm.html" class="nav-link d-flex align-items-center" id="session-form-link">
              <i class="bi bi-ui-checks-grid me-2 fs-5"></i> <span>Session Form</span>
            </a>
          </li>
          <li class="nav-item mb-2">
            <a href="/src/pages/teacher/session-draft/SessionDraft.html" class="nav-link d-flex align-items-center" id="session-draft-link">
              <i class="bi bi-journal-text me-2 fs-5"></i> <span>Session Draft</span>
            </a>
          </li>
          <li class="nav-item mb-2">
            <a href="/src/pages/teacher/session-logs/index.html" class="nav-link d-flex align-items-center" id="session-logs-link">
              <i class="bi bi-clock-history me-2 fs-5"></i> <span>Session Logs</span>
            </a>
          </li>
          <li class="nav-item mb-2">
            <a href="/src/pages/teacher/student-absence-logs/index.html" class="nav-link d-flex align-items-center" id="student-absence-logs-link">
              <i class="bi bi-person-x me-2 fs-5"></i> <span>Student Absence Logs</span>
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
  <!-- Sidebar for desktop -->
  <div class="d-none d-md-block">
    <nav class="sidebar d-flex flex-column p-3 bg-white shadow-sm">
      <div class="d-flex align-items-center mb-4">
        <img src="/src/assets/Mastermind_logo.jpeg" alt="Logo" width="40" height="40" class="me-2">
        <span class="fs-4 fw-bold text-primary">
          <i class="bi bi-person-badge me-2"></i>Teacher
        </span>
      </div>
      <ul class="nav nav-pills flex-column mb-auto sidebar-links">
        <li class="nav-item mb-2">
          <a href="/src/pages/teacher/session-form/SessionForm.html" class="nav-link d-flex align-items-center" id="session-form-link">
            <i class="bi bi-ui-checks-grid me-2 fs-5"></i> <span>Session Form</span>
          </a>
        </li>
        <li class="nav-item mb-2">
          <a href="/src/pages/teacher/session-draft/SessionDraft.html" class="nav-link d-flex align-items-center" id="session-draft-link">
            <i class="bi bi-journal-text me-2 fs-5"></i> <span>Session Draft</span>
          </a>
        </li>
        <li class="nav-item mb-2">
          <a href="/src/pages/teacher/session-logs/index.html" class="nav-link d-flex align-items-center" id="session-logs-link">
            <i class="bi bi-clock-history me-2 fs-5"></i> <span>Session Logs</span>
          </a>
        </li>
        <li class="nav-item mb-2">
          <a href="/src/pages/teacher/student-absence-logs/index.html" class="nav-link d-flex align-items-center" id="student-absence-logs-link">
            <i class="bi bi-person-x me-2 fs-5"></i> <span>Student Absence Logs</span>
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
