// Auto-generated from classrooms.html — markup verbatim; the
// build (scripts/generate-pages.mjs) writes classrooms.html from this.
export const htmlFile = 'classrooms.html';
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
    <title>Classroom Settings</title>
  
    <!-- CSS -->
    <link href="/bootstrap-5.0.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="/src/components/admin/sidebar-menu/sidebar.css" rel="stylesheet">
    <link href="/src/pages/admin/settings/classrooms.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" rel="stylesheet" media="print" onload="this.media='all'">
    <link rel="stylesheet" href="/src/components/admin/header/header.css">
  </head>
  
  <body>
  
    <!-- Sidebar -->
    <div id="sidebar-container"></div>
  
    <!-- Header -->
    <div id="admin-header-container"></div>
  
    <!-- MAIN CONTENT -->
    <div class="container-fluid mt-4 px-2 px-md-4" id="main-content">
  
      <!-- ===== THEME SECTION (2.0 White Mode — creamy professional design) ===== -->
      <div class="card mb-4" id="dark-mode-section">
        <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <span>Theme &amp; Design</span>
          <i class="bi bi-palette"></i>
        </div>
        <div class="card-body">
          <div class="form-check form-switch ps-0">
            <div class="d-flex align-items-center gap-3">
              <input class="form-check-input m-0" type="checkbox" id="darkModeToggle" style="width: 3em; height: 1.5em;">
              <label class="form-check-label mb-0" for="darkModeToggle">
                <strong>Enable 2.0 White Mode — Creamy Professional Design</strong>
              </label>
            </div>
          </div>
          <p class="text-muted mt-2 mb-0">Turns on the creamy 2.0 design — white panels on a warm cream canvas with purple accents — across the Admin, Receptionist and Teacher portals. (This is a light theme, not a dark mode.)</p>
          <div id="darkModeMsg" class="mt-2"></div>
        </div>
      </div>
  
      <!-- ===== CLASSROOM SECTION ===== -->
      <h2 class="mb-3">Manage Classrooms</h2>
  
      <form id="addClassroomForm" class="row g-3 mb-4">
        <div class="col-md-6">
          <input type="text" class="form-control" id="classroomName" placeholder="Classroom Name" required>
        </div>
  
        <div class="col-md-4">
          <input type="color" class="form-control form-control-color" id="classroomColor" value="#ffffff">
        </div>
  
        <div class="col-md-2">
          <button class="btn btn-primary w-100">Add</button>
        </div>
      </form>
  
      <div id="classroomsList" class="mb-5"></div>
  
      <!-- ===== RECEPTIONIST ===== -->
      <div class="card mb-5">
        <div class="card-header bg-secondary text-white">
          Update Receptionist Credentials
        </div>
  
        <div class="card-body">
          <form id="receptionistForm" class="row g-3">
  
            <div class="col-md-4">
              <label class="form-label">Receptionist ID</label>
              <input type="number" class="form-control" id="receptionistId" required>
            </div>
  
            <div class="col-md-4">
              <label class="form-label">Username</label>
              <input type="text" class="form-control" id="receptionistUsername" required>
            </div>
  
            <div class="col-md-4">
              <label class="form-label">Password</label>
              <input type="password" class="form-control" id="receptionistPassword" required>
            </div>
  
            <div class="col-12">
              <button class="btn btn-success w-100">Save</button>
            </div>
  
          </form>
  
          <div id="receptionistMsg" class="mt-2"></div>
        </div>
      </div>
  
      <!-- ===== ADMIN ===== -->
      <div class="card mb-4" id="admin-credentials-section">
        <div class="card-header bg-primary text-white">
          Update Admin Credentials
        </div>
  
        <div class="card-body">
          <form id="adminCredentialsForm" class="row g-3">
  
            <div class="col-12">
              <p class="text-muted mb-0">Update the admin username below. Enter a new password only when you want to change it.</p>
            </div>
  
            <div class="col-md-4">
              <label class="form-label">Admin Username</label>
              <input type="text" class="form-control" id="adminUsername" required>
            </div>
  
            <div class="col-md-4">
              <label class="form-label">New Admin Password</label>
              <input type="password" class="form-control" id="adminPassword" placeholder="Leave blank to keep current password" minlength="1">
            </div>
  
            <div class="col-md-4">
              <label class="form-label">Confirm New Password</label>
              <input type="password" class="form-control" id="adminPasswordConfirm" placeholder="Repeat new password" minlength="1">
            </div>
  
            <div class="col-md-4 d-flex align-items-end">
              <button class="btn btn-success w-100">Save</button>
            </div>
  
          </form>
  
          <div id="adminCredentialsMsg" class="mt-2"></div>
        </div>
      </div>
  
    </div>
  
    <!-- JS -->
    <script src="/bootstrap-5.0.2/dist/js/bootstrap.bundle.min.js"></script>
    <script src="/src/components/admin/sidebar-menu/sidebar-loader.js"></script>
    <script src="/src/components/admin/2.0-design/2.0design.js"></script>
  
    <!-- Header Loader -->
    <script type="module" src="/assist/page-boot.js" data-header="/src/components/admin/header/header.html" data-container="admin-header-container" data-undo-module="/assist/undo-manager.js"></script>
  
    <script src="classrooms.js"></script>
  
    <script src="/assist/pwa-register.js" defer></script>
    <script src="/assist/use-hostname.js" defer></script>
  </body>
  </html>
`;
