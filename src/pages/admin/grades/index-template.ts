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
      <title>Grades Admin</title>
      <link href="/bootstrap-5.0.2/dist/css/bootstrap.min.css" rel="stylesheet">
      <link href="/src/components/admin/sidebar-menu/sidebar.css" rel="stylesheet">
      <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" rel="stylesheet" media="print" onload="this.media='all'">
      <link href="grades.css" rel="stylesheet">
    <link rel="stylesheet" href="/src/components/admin/header/header.css">
  </head>
  <body>
      <!-- Sidebar Container -->
      <div id="sidebar-container"></div>
      <!-- Admin Header (shared for mobile/desktop) -->
      <div id="admin-header-container"></div>
      <!-- Main Content -->
      <div class="container mt-5" id="main-content" style="margin-left:260px; max-width:calc(100% - 260px);">
        <h2>Grades</h2>
        <p class="text-muted">Add and manage custom grade options used in Session Form.</p>
        <div id="alert-placeholder"></div>
        <div class="input-group mb-3">
            <input type="text" id="newGradeInput" class="form-control" placeholder="New Grade (e.g. High School)">
            <button class="btn btn-primary" id="addGradeBtn">Add Grade</button>
        </div>
        <input type="text" id="searchInput" class="form-control mb-3" placeholder="Search grade">
        <table class="table table-hover">
            <thead>
                <tr>
                    <th style="width: 60px;">ID</th>
                    <th>Grade</th>
                    <th style="width: 120px;">Actions</th>
                </tr>
            </thead>
            <tbody id="gradesTableBody">
                <!-- Grades will be rendered here -->
            </tbody>
        </table>
    </div>
      <script src="/bootstrap-5.0.2/dist/js/bootstrap.bundle.min.js"></script>
      <script src="/src/components/admin/sidebar-menu/sidebar-loader.js"></script>
      <script src="/src/components/admin/2.0-design/2.0design.js"></script>
              <script type="module" src="/assist/page-boot.js" data-header="/src/components/admin/header/header.html" data-container="admin-header-container" data-undo-module="/assist/undo-manager.js"></script>
      <script type="module" src="grades.js"></script>
      <script src="/assist/main-content.js" defer></script>
    <script src="/assist/pwa-register.js" defer></script>
    <script src="/assist/use-hostname.js" defer></script>
  </body>
  </html>
`;
