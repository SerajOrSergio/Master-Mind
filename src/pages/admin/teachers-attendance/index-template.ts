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
    <title>Teachers Attendance</title>
    <link rel="stylesheet" href="/bootstrap-5.0.2/dist/css/bootstrap.min.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" rel="stylesheet" media="print" onload="this.media='all'">
    <link rel="stylesheet" href="/src/components/admin/sidebar-menu/sidebar.css">
    <link rel="stylesheet" href="teachers-attendance.css">
    <link rel="stylesheet" href="/src/components/admin/header/header.css">
  </head>
  <body class="bg-light">
    <!-- Sidebar -->
    <div id="sidebar-container"></div>
    <div id="admin-header-container"></div>
    <!-- Main Content -->
    <div class="container mt-4" style="margin-left: 260px; max-width: calc(100% - 260px);">
      <h2>Teachers Attendance</h2>
      <div class="mb-3">
        <div class="d-flex flex-wrap align-items-center gap-2 attendance-toolbar">
          <input id="searchInput" type="text" class="form-control flex-grow-1" placeholder="Search teacher, subject, classroom, date or student" autocomplete="off">
          <select id="filterAttType" class="form-select" style="max-width:180px;">
            <option value="">Filter by...</option>
            <option value="teacher">Teacher</option>
            <option value="subject">Subject</option>
            <option value="classroom">Classroom</option>
            <option value="type">Type</option>
            <option value="student">Student</option>
          </select>
          <select id="filterAttValue" class="form-select" style="max-width:220px; display:none;"></select>
          <input id="startMonthInput" type="month" class="form-control" style="max-width:150px;" placeholder="Start month">
          <input id="endMonthInput" type="month" class="form-control" style="max-width:150px;" placeholder="End month">
          <button id="applyAttFilterBtn" class="btn btn-primary" style="display:none;">Apply</button>
        </div>
        <div id="attFilterSummary" class="mt-2 text-end text-secondary small"></div>
      </div>
      <div class="table-responsive">
        <table class="table table-bordered table-hover">
          <thead class="table-light">
            <tr>
              <th>TEACHER</th>
              <th>SUBJECT</th>
              <th>CLASSROOM</th>
              <th>DATE/TIME</th>
              <th>TYPE</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody id="attendanceTableBody">
            <!-- Data will be injected here -->
          </tbody>
        </table>
      </div>
    </div>
    <script src="/bootstrap-5.0.2/dist/js/bootstrap.bundle.min.js"></script>
    <script src="/src/components/admin/sidebar-menu/sidebar-loader.js"></script>
    <script src="/src/components/admin/2.0-design/2.0design.js"></script>
    <script type="module" src="/assist/page-boot.js" data-header="/src/components/admin/header/header.html" data-container="admin-header-container" data-undo-module="/assist/undo-manager.js"></script>
    <script type="module" src="teachers-attendance.js"></script>
    <script src="/assist/pwa-register.js" defer></script>
    <script src="/assist/use-hostname.js" defer></script>
  </body>
  </html>
`;
