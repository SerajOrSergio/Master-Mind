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
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" rel="stylesheet" media="print" onload="this.media='all'">
    <link rel="stylesheet" href="/src/components/teacher/sidebar/TeacherSidebar.css">
    <link rel="stylesheet" href="/src/components/teacher/header/header.css">
    <link rel="stylesheet" href="student-absence-logs.css">
  </head>
  <body class="bg-light">
    <!-- Sidebar -->
    <div id="sidebar-container"></div>
    <!-- Teacher Header -->
    <div id="teacher-header-container"></div>
    <!-- Main Content -->
    <div class="container-fluid px-0" id="main-content">
      <div class="d-flex justify-content-center align-items-start w-100" style="min-height: 100vh;">
        <div class="card shadow-sm mt-4 w-100" style="max-width: 900px;">
          <div class="card-body">
            <div class="page-title mb-2" style="font-size:1.7rem;font-weight:700;letter-spacing:-0.3px;color:#0a2540;">Student Absence Logs</div>
  
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
  
            <div id="studentAbsenceLogsTableBody">
              <!-- Log cards rendered by JS -->
            </div>
          </div>
        </div>
      </div>
    </div>
    <script src="/bootstrap-5.0.2/dist/js/bootstrap.bundle.min.js"></script>
    <script src="/src/components/teacher/sidebar/sidebar-loader.js"></script>
    <script src="/src/components/teacher/header/header-loader.js"></script>
    <script src="student-absence-logs.js"></script>
    <script src="/assist/main-content.js" defer></script>
    <script src="/assist/pwa-register.js" defer></script>
    <script src="/assist/use-hostname.js" defer></script>
  </body>
  </html>
`;
