// Auto-generated from index.html — markup verbatim; the
// build (scripts/generate-pages.mjs) writes index.html from this.
// Styles for this page live in the sibling *-styles.ts modules.
export const htmlFile = 'index.html';
export const pageHtml = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <meta name="apple-mobile-web-app-title" content="MasterMind">
    <meta name="theme-color" content="#6C4DF6">
    <link rel="manifest" href="/assist/manifest.json">
    <link rel="apple-touch-icon" href="/src/assets/Mastermind_logo.jpeg">
  
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <title>Student Absence Logs</title>
    <link rel="stylesheet" href="/bootstrap-5.0.2/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="/src/components/admin/sidebar-menu/sidebar.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" rel="stylesheet" media="print" onload="this.media='all'">
    <link rel="stylesheet" href="student-absence-logs.css">
    <link rel="stylesheet" href="/src/components/admin/header/header.css">
  </head>
  <body>
    <!-- Sidebar Container -->
    <div id="sidebar-container"></div>
    <div id="admin-header-container"></div>
    <!-- Main Content -->
    <div class="container mt-4 p-4 bg-white rounded shadow-sm" id="main-content">
      <div class="w-100">
        <div class="page-title mb-1" style="font-size:1.7rem;font-weight:700;letter-spacing:-0.3px;color:#0a2540;">Student Absence Logs</div>
        <p class="text-muted mb-3">Every session with absent students, grouped per class.</p>
  
        <!-- Filter Card (same as the Paid page) -->
        <div class="absence-filter-card mb-3">
          <div class="d-flex flex-wrap flex-md-nowrap align-items-center gap-2">
            <input id="searchInput" type="text" class="form-control" placeholder="Search student, subject, classroom, teacher, or date" autocomplete="off">
            <select id="filterAbsenceType" class="form-select" style="max-width: 180px;">
              <option value="">Filter by...</option>
              <option value="teacher">Teacher</option>
              <option value="subject">Subject</option>
              <option value="classroom">Classroom</option>
              <option value="student">Student</option>
            </select>
            <select id="filterAbsenceValue" class="form-select" style="max-width: 220px; display: none;"></select>
            <input id="startMonthInput" type="month" class="form-control" style="max-width: 150px;" placeholder="Start month">
            <input id="endMonthInput" type="month" class="form-control" style="max-width: 150px;" placeholder="End month">
            <button id="applyAbsenceFilterBtn" class="btn btn-primary" style="display: none;">Apply</button>
          </div>
          <div id="absenceFilterSummary" class="absence-filter-summary mt-2 text-end text-secondary"></div>
        </div>
  
        <div id="absenceLogsBody">
          <!-- Log cards rendered by JS -->
        </div>
      </div>
    </div>
    <script src="/bootstrap-5.0.2/dist/js/bootstrap.bundle.min.js"></script>
    <script src="/src/components/admin/sidebar-menu/sidebar-loader.js"></script>
    <script src="/src/components/admin/2.0-design/2.0design.js"></script>
    <script type="module" src="/assist/page-boot.js" data-header="/src/components/admin/header/header.html" data-container="admin-header-container" data-undo-module="/assist/undo-manager.js"></script>
    <script type="module" src="student-absence-logs.js"></script>
    <script src="/assist/pwa-register.js" defer></script>
    <script src="/assist/use-hostname.js" defer></script>
  </body>
  </html>
`;
