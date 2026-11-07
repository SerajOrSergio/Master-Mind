// Auto-generated from create.html — markup verbatim; the
// build (scripts/generate-pages.mjs) writes create.html from this.
export const htmlFile = 'create.html';
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
    <title>Manage Receptionist Access</title>
  
    <!-- CSS -->
    <link href="/bootstrap-5.0.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="/src/components/admin/sidebar-menu/sidebar.css" rel="stylesheet">
    <link href="/src/pages/admin/create/create.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" rel="stylesheet" media="print" onload="this.media='all'">
    <style>
      /* Hide the undo button on this page */
      #admin-header-container #undo-btn,
      #admin-header-container #undo-btn-desktop {
        display: none !important;
      }
    </style>
    <link rel="stylesheet" href="/src/components/admin/header/header.css">
  </head>
  
  <body>
  
    <!-- Sidebar -->
    <div id="sidebar-container"></div>
  
    <!-- Header -->
    <div id="admin-header-container"></div>
  
    <!-- MAIN CONTENT -->
    <div class="container-fluid mt-4 px-2 px-md-4" id="main-content">
  
      <h2 class="mb-4">Manage Receptionist Page Access</h2>
      <p class="text-muted mb-4">Select which pages should be visible in the receptionist's sidebar. Drag and drop to reorder pages.</p>
  
      <!-- Loading State -->
      <div id="loadingState" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-2">Loading page access configuration...</p>
      </div>
  
      <!-- Pages List -->
      <div id="pagesContainer" class="d-none">
        <div class="card">
          <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
            <span><i class="bi bi-shield-lock me-2"></i>Receptionist Pages</span>
            <button id="saveAllBtn" class="btn btn-light btn-sm">
              <i class="bi bi-save me-1"></i>Save Changes
            </button>
          </div>
          <div class="card-body">
            <div id="pagesList" class="list-group">
              <!-- Pages will be dynamically loaded here -->
            </div>
          </div>
        </div>
      </div>
  
      <!-- Error State -->
      <div id="errorState" class="d-none">
        <div class="alert alert-danger" role="alert">
          <i class="bi bi-exclamation-triangle me-2"></i>
          <span id="errorMessage">Failed to load page access configuration.</span>
        </div>
        <button id="retryBtn" class="btn btn-outline-primary">
          <i class="bi bi-arrow-clockwise me-1"></i>Retry
        </button>
      </div>
  
      <!-- Success Message -->
      <div id="successMessage" class="alert alert-success d-none mt-3" role="alert">
        <i class="bi bi-check-circle me-2"></i>
        Page access configuration saved successfully!
      </div>
  
    </div>
  
    <!-- JS -->
    <script src="/bootstrap-5.0.2/dist/js/bootstrap.bundle.min.js"></script>
    <script src="/src/components/admin/sidebar-menu/sidebar-loader.js"></script>
    <script src="/src/components/admin/2.0-design/2.0design.js"></script>
  
    <!-- Header Loader -->
    <script type="module" src="/assist/page-boot.js" data-header="/src/components/admin/header/header.html" data-container="admin-header-container" data-undo-module="/assist/undo-manager.js"></script>
  
    <script src="create.js"></script>
  
    <script src="/assist/pwa-register.js" defer></script>
    <script src="/assist/use-hostname.js" defer></script>
  </body>
  </html>
`;
