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
    <title>Session Logs</title>
    <link rel="stylesheet" href="/bootstrap-5.0.2/dist/css/bootstrap.min.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" rel="stylesheet" media="print" onload="this.media='all'">
    <link rel="stylesheet" href="/src/components/teacher/sidebar/TeacherSidebar.css">
    <link rel="stylesheet" href="session-logs.css">
    <link rel="stylesheet" href="/src/components/teacher/header/header.css">
  </head>
  <body class="bg-light">
    <!-- Teacher Header -->
    <div id="teacher-header-container"></div>
    <!-- Sidebar -->
    <div id="sidebar-container"></div>
    <!-- Main Content -->
    <div class="container-fluid px-0" id="main-content">
      <div class="d-flex justify-content-center align-items-start w-100" style="min-height: 100vh;">
        <div class="card shadow-sm mt-4 w-100" style="max-width: 1100px;">
          <div class="card-body">
            <div class="page-title mb-2" style="font-size:1.7rem;font-weight:700;letter-spacing:-0.3px;color:#0a2540;">Session Logs</div>
            <input id="searchInput" class="form-control mb-3" type="text" placeholder="Search subject, classroom, date or student">
            <div class="table-responsive">
              <table class="table table-bordered table-hover">
                <thead class="table-light">
                  <tr>
                    <th>SUBJECT</th>
                    <th>CLASSROOM</th>
                    <th>DATE/TIME</th>
                    <th>STUDENTS</th>
                    <th>TYPE</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody id="sessionLogsTableBody">
                  <!-- Data will be injected here -->
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <script src="/bootstrap-5.0.2/dist/js/bootstrap.bundle.min.js"></script>
    <script src="/src/components/teacher/sidebar/sidebar-loader.js"></script>
    <script src="session-logs.js"></script>
    <script src="/src/components/teacher/header/header-loader.js"></script>
    <script src="/assist/main-content.js" defer></script>
    <script src="/assist/pwa-register.js" defer></script>
    <script src="/assist/use-hostname.js" defer></script>
  </body>
  </html>
`;
