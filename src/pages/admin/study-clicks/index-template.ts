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
    <title>Study Clicks | Admin</title>
    <link href="/bootstrap-5.0.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="/src/components/admin/sidebar-menu/sidebar.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" rel="stylesheet" media="print" onload="this.media='all'">
    <link rel="stylesheet" href="study-clicks.css">
    <link rel="stylesheet" href="/src/components/admin/header/header.css">
  </head>
  <body>
    <!-- Sidebar Container -->
    <div id="sidebar-container"></div>
    <div id="admin-header-container"></div>
    <!-- Main Content -->
    <div class="container mt-5" id="main-content" style="margin-left:260px; max-width:calc(100% - 260px);">
      <h2>Study Clicks</h2>
      <p class="text-muted">Assign study clicks to students — track the student, their grade, their email and the paid amount.</p>
      <form id="studyClicksForm" class="mb-4">
        <div class="row g-2 mb-2">
          <div class="col-12 col-md-3"><input type="text" id="studentName" class="form-control" placeholder="Student Name" required></div>
          <div class="col-12 col-md-3"><input type="text" id="phoneNumber" class="form-control" placeholder="Phone Number" required></div>
          <div class="col-12 col-md-3"><input type="email" id="emailAddress" class="form-control" placeholder="Email" autocomplete="email" inputmode="email"></div>
          <div class="col-12 col-md-3"><input type="number" id="paidAmount" class="form-control" placeholder="Paid Amount" min="0" step="0.01" required></div>
        </div>
        <div class="row g-2 mb-2">
          <div class="col-12 col-md-3"><input type="date" id="paidDate" class="form-control" title="Date the student paid"></div>
          <div class="col-12 col-md-9 d-flex align-items-center flex-wrap">
            <label class="me-2 mb-0">Grade Level:</label>
            <div id="gradesContainer" class="pill-container flex-wrap"></div>
          </div>
        </div>
        <div class="row g-2 mb-2">
          <div class="col-12">
            <label class="mb-1 d-block fw-semibold">All Students (quick add):</label>
            <input type="text" id="studentQuickSearch" class="form-control mb-2" placeholder="Search students by name...">
            <div id="studentsQuickContainer" class="pill-container quick-students flex-wrap"></div>
            <div class="text-muted small mt-2">A picked student fills the name, phone and grade — type the email by hand.</div>
          </div>
        </div>
        <button type="submit" class="btn btn-primary w-100 w-md-auto">Add Study Click</button>
      </form>
      <div class="mb-3">
        <input type="text" id="studyClicksSearchInput" class="form-control" placeholder="Search study clicks by name, phone or email...">
      </div>
      <div class="table-responsive">
        <div id="studyClicksTableContainer"></div>
      </div>
    </div>
    <script src="/bootstrap-5.0.2/dist/js/bootstrap.bundle.min.js"></script>
    <script src="/src/components/admin/sidebar-menu/sidebar-loader.js"></script>
    <script src="/src/components/admin/2.0-design/2.0design.js"></script>
    <script type="module" src="/assist/page-boot.js" data-header="/src/components/admin/header/header.html" data-container="admin-header-container" data-undo-module="/assist/undo-manager.js"></script>
    <script type="module" src="study-clicks.js"></script>
    <script src="/assist/pwa-register.js" defer></script>
    <script src="/assist/use-hostname.js" defer></script>
  </body>
  </html>
`;
