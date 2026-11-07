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
    <title>Receptionist - Students</title>
    <link href="/bootstrap-5.0.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="/src/components/receptionist/sidebar-menu/sidebar.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" rel="stylesheet" media="print" onload="this.media='all'">
    <link href="students.css" rel="stylesheet">
    <link rel="stylesheet" href="/src/components/receptionist/header/header.css">
  </head>
  <body>
    <!-- Sidebar Container -->
    <div id="sidebar-container"></div>
    <div id="receptionist-header-container"></div>
    <!-- Main Content -->
    <div class="container mt-5" id="main-content" style="margin-left:250px; max-width:calc(100vw - 270px);">
      <h2>Students</h2>
      <p class="text-muted">Add and manage student accounts for your system.</p>
      <form id="studentForm" class="mb-4">
        <div class="row g-2 mb-2">
          <div class="col-12 col-md-2 mb-2 mb-md-0"><input type="text" name="studentName" class="form-control" placeholder="Student Name" required></div>
          <div class="col-12 col-md-2 mb-2 mb-md-0"><input type="text" name="schoolName" class="form-control" placeholder="School Name"></div>
          <div class="col-12 col-md-2 mb-2 mb-md-0"><input type="text" name="curriculum" class="form-control" placeholder="Curriculum"></div>
          <!-- Attendance field removed -->
          <div class="col-12 col-md-2 mb-2 mb-md-0"><input type="text" name="email" class="form-control" placeholder="Email"></div>
          <div class="col-12 col-md-2 mb-2 mb-md-0"><input type="text" name="phoneNumber" class="form-control" placeholder="Phone Number"></div>
          <div class="col-12 col-md-2 mb-2 mb-md-0"><input type="text" name="parentName" class="form-control" placeholder="Parent Name"></div>
          <div class="col-12 col-md-2"><input type="text" name="parentPhone" class="form-control" placeholder="Parent Phone"></div>
          <div class="col-12 col-md-10"><input type="text" name="notes" class="form-control" placeholder="Notes (optional)"></div>
        </div>
        <div class="row g-2 mb-2">
          <div class="col-12 d-flex align-items-center flex-wrap">
            <label class="me-2 mb-0">Subjects:</label>
            <div id="subjectsContainer" class="subjects-container flex-wrap"></div>
          </div>
          <div class="col-12 d-flex align-items-center flex-wrap mt-2">
            <label class="me-2 mb-0">Grade Level:</label>
            <div id="gradesContainer" class="pill-container flex-wrap"></div>
            <label class="ms-4 me-2 mb-0">Discount (%):</label>
            <input type="number" name="discount" class="form-control d-inline-block" style="width:100px;" min="0" max="100" placeholder="0-100">
          </div>
        </div>
        <button type="submit" class="btn btn-primary w-100 w-md-auto">Save Student</button>
      </form>
      <div class="mb-3">
        <input type="text" id="studentSearchInput" class="form-control" placeholder="Search students by name...">
      </div>
      <div class="table-responsive">
        <div id="studentsTableContainer"></div>
      </div>
    </div>
    <script src="/bootstrap-5.0.2/dist/js/bootstrap.bundle.min.js"></script>
    <script src="/src/components/receptionist/sidebar-menu/sidebar-loader.js"></script>
    <script type="module" src="students.js"></script>
  
    <!-- Header Loader + Undo Button -->
    <script type="module" src="/assist/page-boot.js" data-header="/src/components/receptionist/header/header.html" data-container="receptionist-header-container" data-undo-module="/assist/undo-manager.js"></script>
    <script src="/assist/pwa-register.js" defer></script>
    <script src="/assist/use-hostname.js" defer></script>
  </body>
  </html>
`;
