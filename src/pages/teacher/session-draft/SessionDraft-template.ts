// Auto-generated from SessionDraft.html — markup verbatim; the
// build (scripts/generate-pages.mjs) writes SessionDraft.html from this.
export const htmlFile = 'SessionDraft.html';
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
    <title>Teacher Session Draft</title>
  
    <link href="/bootstrap-5.0.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" rel="stylesheet" media="print" onload="this.media='all'">
  
    <link rel="stylesheet" href="/src/components/teacher/sidebar/TeacherSidebar.css">
    <link rel="stylesheet" href="/src/pages/teacher/session-form/session-form.css">
    <link rel="stylesheet" href="/src/pages/teacher/session-draft/session-draft.css">
    <link rel="stylesheet" href="/src/components/teacher/header/header.css">
  </head>
  
  <body>
  
  <!-- Header -->
  <div id="teacher-header-container"></div>
  
  <div class="container-fluid">
    <div class="row flex-column flex-md-row">
  
      <!-- Sidebar -->
      <div class="col-12 col-md-3 mb-3 mb-md-0" id="sidebar-container"></div>
  
      <!-- Main Content -->
      <div class="col-12 col-md-9" id="main-content">
        <div class="session-form-wrapper px-2 px-md-4 py-3">
          <div class="session-card">
  
            <div class="page-title h3">Session Drafts</div>
            <div class="page-subtitle mb-3">
              Open a saved draft and continue adding remaining students.
            </div>
  
            <div id="draftsContainer"></div>
            <div id="draftStatusMsg" class="mt-2"></div>
  
          </div>
        </div>
      </div>
  
    </div>
  </div>
  
  <!-- Scripts -->
  <script src="/bootstrap-5.0.2/dist/js/bootstrap.bundle.min.js"></script>
  <script src="/src/components/teacher/sidebar/sidebar-loader.js"></script>
  <script src="/src/components/teacher/header/header-loader.js"></script>
  
    <script src="/assist/main-content.js" defer data-margin="250px"></script>
    <script type="module" src="SessionDraft.js"></script>
  
    <script src="/assist/pwa-register.js" defer></script>
    <script src="/assist/use-hostname.js" defer></script>
  </body>
  </html>
`;
