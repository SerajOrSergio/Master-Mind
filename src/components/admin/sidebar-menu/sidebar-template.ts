// Auto-generated from sidebar.html — markup verbatim; the
// build (scripts/generate-pages.mjs) writes sidebar.html from this.
export const htmlFile = 'sidebar.html';
export const pageHtml = `
  <!-- Sidebar for both desktop and mobile (offcanvas for mobile) -->
  <div class="offcanvas offcanvas-start d-md-none" tabindex="-1" id="sidebarOffcanvas" aria-labelledby="sidebarOffcanvasLabel">
    <div class="offcanvas-header">
      <h5 class="offcanvas-title" id="sidebarOffcanvasLabel">Admin</h5>
      <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body p-0">
      <nav class="sidebar d-flex flex-column p-3 bg-white h-100">
        <div class="d-flex align-items-center mb-4">
          <img src="/src/assets/Mastermind_logo.jpeg" alt="Logo" width="40" height="40" class="me-2">
          <span class="fs-4 fw-bold text-primary">Admin</span>
        </div>
        <ul class="nav nav-pills flex-column mb-auto gap-2 sidebar-links">
          <li class="nav-item">
            <a href="/src/pages/admin/dashboard" class="nav-link d-flex align-items-center" id="dashboard-link">
              <i class="bi bi-speedometer2 me-2 fs-5"></i> <span>Dashboard</span>
            </a>
          </li>
          <li>
            <a href="/src/pages/admin/teachers-availability" class="nav-link d-flex align-items-center" id="teachers-availability-link"><i class="bi bi-calendar-check me-2 fs-5"></i> <span>Teachers availability</span></a>
          </li>
          <li>
            <a href="/src/pages/admin/topics/index.html" class="nav-link d-flex align-items-center" id="topics-link"><i class="bi bi-journal-text me-2 fs-5"></i> <span>Topics</span></a>
          </li>
          <li>
            <a href="/src/pages/admin/teachers" class="nav-link d-flex align-items-center" id="teachers-link"><i class="bi bi-person-badge me-2 fs-5"></i> <span>Teachers</span></a>
          </li>
          <li>
            <a href="/src/pages/admin/study-clicks/index.html" class="nav-link d-flex align-items-center" id="study-clicks-link"><i class="bi bi-mouse2 me-2 fs-5"></i> <span>Study Clicks</span></a>
          </li>
          <li>
            <a href="/src/pages/admin/student-materials/index.html" class="nav-link d-flex align-items-center" id="student-materials-link"><i class="bi bi-folder2-open me-2 fs-5"></i> <span>Student materials</span></a>
          </li>
          <li>
            <a href="/src/pages/admin/past-papers/index.html" class="nav-link d-flex align-items-center" id="past-papers-link"><i class="bi bi-file-earmark-text me-2 fs-5"></i> <span>Past Papers</span></a>
          </li>
          <li>
            <a href="/src/pages/admin/subjects" class="nav-link d-flex align-items-center" id="subjects-link"><i class="bi bi-book me-2 fs-5"></i> <span>Subjects</span></a>
          </li>
          <li>
            <a href="/src/pages/admin/grades" class="nav-link d-flex align-items-center" id="grades-link"><i class="bi bi-bar-chart-steps me-2 fs-5"></i> <span>Grades</span></a>
          </li>
          <li>
            <a href="/src/pages/admin/students/index.html" class="nav-link d-flex align-items-center" id="students-link"><i class="bi bi-people me-2 fs-5"></i> <span>Students</span></a>
          </li>
          <li>
             <a href="/src/pages/admin/teachers-attendance/index.html" class="nav-link d-flex align-items-center" id="teachers-attendance-link"><i class="bi bi-calendar2-week me-2 fs-5"></i> <span>Teachers attendance</span></a>
          </li>
          <li>
            <a href="/src/pages/admin/session-form/index.html" class="nav-link d-flex align-items-center" id="session-form-link"><i class="bi bi-ui-checks-grid me-2 fs-5"></i> <span>Session form</span></a>
          </li>
          <li>
            <a href="/src/pages/admin/payments/index.html" class="nav-link d-flex align-items-center" id="payments-link"><i class="bi bi-credit-card me-2 fs-5"></i> <span>Payments</span></a>
          </li>
          <li>
            <a href="/src/pages/admin/partial/partial.html" class="nav-link d-flex align-items-center"><i class="bi bi-cash-coin me-2 fs-5"></i> <span>Partial</span></a>
          </li>
          <li>
            <a href="/src/pages/admin/unpaid/unpaid.html" class="nav-link d-flex align-items-center"><i class="bi bi-cash me-2 fs-5"></i> <span>Unpaid</span></a>
          </li>
          <li>
            <a href="/src/pages/admin/paid/paid.html" class="nav-link d-flex align-items-center"><i class="bi bi-cash-stack me-2 fs-5"></i> <span>Paid</span></a>
          </li>
          <li>
            <a href="/src/pages/admin/student-absence-logs/index.html" class="nav-link d-flex align-items-center"><i class="bi bi-journal-x me-2 fs-5"></i> <span>Student absence logs</span></a>
          </li>
          <li>
            <a href="/src/pages/admin/pricing/pricing.html" class="nav-link d-flex align-items-center"><i class="bi bi-currency-dollar me-2 fs-5"></i> <span>Pricing</span></a>
          </li>
          <li>
            <a href="/src/pages/admin/teacher-abcense/index.html" class="nav-link d-flex align-items-center"><i class="bi bi-journal-x me-2 fs-5"></i> <span>Teacher absence</span></a>
          </li>
          <li>
            <a href="/src/pages/admin/subscription/subscription.html" class="nav-link d-flex align-items-center"><i class="bi bi-box-arrow-in-right me-2 fs-5"></i> <span>Subscription</span></a>
          </li>
          <li>
            <a href="/src/pages/admin/create/create.html" class="nav-link d-flex align-items-center" id="create-link"><i class="bi bi-plus-circle me-2 fs-5"></i> <span>Create</span></a>
          </li>
          <li>
            <a href="/src/pages/admin/database-download/index.html" class="nav-link d-flex align-items-center" id="database-download-link"><i class="bi bi-database-down me-2 fs-5"></i> <span>Database Download</span></a>
          </li>
          <li>
            <a href="/src/pages/admin/settings/classrooms.html" class="nav-link d-flex align-items-center" id="settings-link"><i class="bi bi-gear me-2 fs-5"></i> <span>Settings</span></a>
          </li>
        </ul>
        <div class="mt-auto pt-4 border-top text-center">
          <!-- Logout Button (Mobile) -->
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
        <span class="fs-4 fw-bold text-primary">Admin</span>
      </div>
      <ul class="nav nav-pills flex-column mb-auto gap-2 sidebar-links">
        <li class="nav-item">
          <a href="/src/pages/admin/dashboard" class="nav-link d-flex align-items-center" id="dashboard-link">
            <i class="bi bi-speedometer2 me-2 fs-5"></i> <span>Dashboard</span>
          </a>
        </li>
        <li>
          <a href="/src/pages/admin/teachers-availability" class="nav-link d-flex align-items-center" id="teachers-availability-link"><i class="bi bi-calendar-check me-2 fs-5"></i> <span>Teachers availability</span></a>
        </li>
        <li>
          <a href="/src/pages/admin/topics" class="nav-link d-flex align-items-center" id="topics-link"><i class="bi bi-journal-text me-2 fs-5"></i> <span>Topics</span></a>
        </li>
        <li>
          <a href="/src/pages/admin/teachers" class="nav-link d-flex align-items-center" id="teachers-link"><i class="bi bi-person-badge me-2 fs-5"></i> <span>Teachers</span></a>
        </li>
        <li>
          <a href="/src/pages/admin/study-clicks/index.html" class="nav-link d-flex align-items-center" id="study-clicks-link"><i class="bi bi-mouse2 me-2 fs-5"></i> <span>Study Clicks</span></a>
        </li>
        <li>
          <a href="/src/pages/admin/student-materials/index.html" class="nav-link d-flex align-items-center" id="student-materials-link"><i class="bi bi-folder2-open me-2 fs-5"></i> <span>Student materials</span></a>
        </li>
        <li>
          <a href="/src/pages/admin/past-papers/index.html" class="nav-link d-flex align-items-center" id="past-papers-link"><i class="bi bi-file-earmark-text me-2 fs-5"></i> <span>Past Papers</span></a>
        </li>
        <li>
          <a href="/src/pages/admin/subjects" class="nav-link d-flex align-items-center" id="subjects-link"><i class="bi bi-book me-2 fs-5"></i> <span>Subjects</span></a>
        </li>
        <li>
          <a href="/src/pages/admin/grades" class="nav-link d-flex align-items-center" id="grades-link"><i class="bi bi-bar-chart-steps me-2 fs-5"></i> <span>Grades</span></a>
        </li>
        <li>
          <a href="/src/pages/admin/students/index.html" class="nav-link d-flex align-items-center" id="students-link"><i class="bi bi-people me-2 fs-5"></i> <span>Students</span></a>
        </li>
        <li>
          <a href="/src/pages/admin/teachers-attendance/index.html" class="nav-link d-flex align-items-center" id="teachers-attendance-link"><i class="bi bi-calendar2-week me-2 fs-5"></i> <span>Teachers attendance</span></a>
        </li>
        <li>
          <a href="/src/pages/admin/session-form/index.html" class="nav-link d-flex align-items-center" id="session-form-link"><i class="bi bi-ui-checks-grid me-2 fs-5"></i> <span>Session form</span></a>
        </li>
        <li>
          <a href="/src/pages/admin/payments/index.html" class="nav-link d-flex align-items-center" id="payments-link"><i class="bi bi-credit-card me-2 fs-5"></i> <span>Payments</span></a>
        </li>
        <li>
          <a href="/src/pages/admin/partial/partial.html" class="nav-link d-flex align-items-center"><i class="bi bi-cash-coin me-2 fs-5"></i> <span>Partial</span></a>
        </li>
        <li>
          <a href="/src/pages/admin/unpaid/unpaid.html" class="nav-link d-flex align-items-center"><i class="bi bi-cash me-2 fs-5"></i> <span>Unpaid</span></a>
        </li>
        <li>
          <a href="/src/pages/admin/paid/paid.html" class="nav-link d-flex align-items-center"><i class="bi bi-cash-stack me-2 fs-5"></i> <span>Paid</span></a>
        </li>
        <li>
          <a href="/src/pages/admin/student-absence-logs/index.html" class="nav-link d-flex align-items-center"><i class="bi bi-journal-x me-2 fs-5"></i> <span>Student absence logs</span></a>
        </li>
        <li>
          <a href="/src/pages/admin/pricing/pricing.html" class="nav-link d-flex align-items-center"><i class="bi bi-currency-dollar me-2 fs-5"></i> <span>Pricing</span></a>
        </li>
         <li>
           <a href="/src/pages/admin/teacher-abcense/index.html" class="nav-link d-flex align-items-center"><i class="bi bi-journal-x me-2 fs-5"></i> <span>Teacher absence</span></a>
         </li>
        <li>
          <a href="/src/pages/admin/subscription/subscription.html" class="nav-link d-flex align-items-center"><i class="bi bi-box-arrow-in-right me-2 fs-5"></i> <span>Subscription</span></a>
        </li>
        <li>
          <a href="/src/pages/admin/create/create.html" class="nav-link d-flex align-items-center" id="create-link"><i class="bi bi-plus-circle me-2 fs-5"></i> <span>Create</span></a>
        </li>
        <li>
          <a href="/src/pages/admin/database-download/index.html" class="nav-link d-flex align-items-center" id="database-download-link"><i class="bi bi-database-down me-2 fs-5"></i> <span>Database Download</span></a>
        </li>
        <li>
          <a href="/src/pages/admin/settings/classrooms.html" class="nav-link d-flex align-items-center" id="settings-link"><i class="bi bi-gear me-2 fs-5"></i> <span>Settings</span></a>
        </li>
      </ul>
      <div class="mt-auto pt-4 border-top text-center">
        <!-- Logout Button (Desktop) -->
        <button id="logout-btn" class="btn btn-outline-danger w-100">
          <i class="bi bi-box-arrow-right me-2"></i> Logout
        </button>
        <script src="/src/components/logout/logout.js"></script>
        <link rel="stylesheet" href="/src/components/logout/logout.css">
      </div>
    </nav>
  </div>
    </div>
  </div>
  <!-- End Admin Sidebar -->
  <script>
  // Close mobile sidebar when clicking outside the sidebar (on the overlay)
  document.addEventListener('DOMContentLoaded', function() {
    var sidebarOffcanvas = document.getElementById('sidebarOffcanvas');
    if (sidebarOffcanvas) {
      // Use event delegation to always close sidebar on overlay click
      function closeSidebarOnOverlay(e) {
        if (e.target.classList && e.target.classList.contains('offcanvas-backdrop')) {
          var offcanvas = bootstrap.Offcanvas.getOrCreateInstance(sidebarOffcanvas);
          offcanvas.hide();
        }
      }
      document.addEventListener('click', closeSidebarOnOverlay);
      document.addEventListener('touchstart', closeSidebarOnOverlay);
    }
  
    // Highlight the active sidebar link for both desktop and mobile
    function normalizePath(path) {
      if (!path) return '';
      // Remove trailing /index.html or /index, and trailing slash except for root
      path = path.replace(/\\/index(\\.html)?$/, '');
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
  });
  </script>
`;
