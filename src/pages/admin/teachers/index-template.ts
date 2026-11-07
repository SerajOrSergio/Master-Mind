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
    <title>Teachers | Admin</title>
    <link href="/bootstrap-5.0.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="/src/components/admin/sidebar-menu/sidebar.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" rel="stylesheet" media="print" onload="this.media='all'">
    <link rel="stylesheet" href="teachers.css">
    <link rel="stylesheet" href="/src/components/admin/header/header.css">
  </head>
  <body>
    <!-- Sidebar Container -->
    <div id="sidebar-container"></div>
    <div id="admin-header-container"></div>
    <!-- Main Content -->
    <div class="container mt-5" id="main-content" style="margin-left:260px; max-width:calc(100% - 260px);">
      <h2>Teachers</h2>
      <p class="text-muted">Add and manage teacher accounts for your system.</p>
      <form id="teacherForm" class="mb-4">
        <div class="row g-2 mb-2">
          <div class="col-12 col-md-2 mb-2 mb-md-0"><input type="text" id="firstName" class="form-control" placeholder="First Name" required></div>
          <div class="col-12 col-md-2 mb-2 mb-md-0"><input type="text" id="lastName" class="form-control" placeholder="Last Name" required></div>
          <div class="col-12 col-md-2 mb-2 mb-md-0"><input type="text" id="phoneNumber" class="form-control" placeholder="Phone Number" required></div>
          <div class="col-12 col-md-3 mb-2 mb-md-0"><input type="email" id="email" class="form-control" placeholder="Email" required></div>
          <div class="col-12 col-md-1 mb-2 mb-md-0"><input type="number" id="salary" class="form-control" placeholder="Salary" required></div>
          <div class="col-12 col-md-2 mb-2 mb-md-0"><input type="number" id="cutRate" class="form-control" placeholder="Cut Rate % (optional)" min="0" max="100" step="0.01"></div>
          <div class="col-12 col-md-2"><input type="text" id="notes" class="form-control" placeholder="Notes (optional)"></div>
        </div>
        <div class="row g-2 mb-2">
          <div class="col-12 d-flex align-items-center flex-wrap">
            <label class="me-2 mb-0">Subjects:</label>
            <div id="subjectsContainer" class="subjects-container flex-wrap"></div>
          </div>
        </div>
        <button type="submit" class="btn btn-primary w-100 w-md-auto">Create Teacher Account</button>
      </form>
      <div class="table-responsive">
        <div id="teachersTableContainer"></div>
      </div>
    </div>
    <script src="/bootstrap-5.0.2/dist/js/bootstrap.bundle.min.js"></script>
    <script src="/src/components/admin/sidebar-menu/sidebar-loader.js"></script>
    <script src="/src/components/admin/2.0-design/2.0design.js"></script>
    <script type="module" src="/assist/page-boot.js" data-header="/src/components/admin/header/header.html" data-container="admin-header-container" data-undo-module="/assist/undo-manager.js"></script>
    <script type="module" src="teachers.js"></script>
    <script src="/assist/pwa-register.js" defer></script>
    <script src="/assist/use-hostname.js" defer></script>
  </body>
  </html>
`;
