// Auto-generated from index.html — markup verbatim; the
// build (scripts/generate-pages.mjs) writes index.html from this.
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
    <title>Database Download</title>
    <link href="/bootstrap-5.0.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="/src/components/admin/sidebar-menu/sidebar.css" rel="stylesheet">
    <link href="/src/pages/admin/database-download/database-download.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" rel="stylesheet" media="print" onload="this.media='all'">
    <style>
      /* No undo actions exist on this read-only page — hide the undo button */
      #admin-header-container #undo-btn,
      #admin-header-container #undo-btn-desktop {
        display: none !important;
      }
    </style>
    <link rel="stylesheet" href="/src/components/admin/header/header.css">
  </head>
  <body>
    <div id="sidebar-container"></div>
    <div id="admin-header-container"></div>
  
    <main class="database-download-content" style="margin-left: 260px;">
      <div class="container-fluid mt-4">
        <div class="row justify-content-center">
          <div class="col-12 col-md-8">
            <div class="card shadow-sm border-0">
              <div class="card-header bg-primary text-white">
                <h4 class="mb-0">
                  <i class="bi bi-database-down me-2"></i>
                  Download Database
                </h4>
              </div>
              <div class="card-body">
                <p class="text-muted mb-4">
                  Download all database files to your device. This will create a ZIP archive containing all JSON files from the database folder.
                </p>
  
                <div class="storage-summary card mb-3 shadow-sm border-0" role="status" aria-live="polite">
                  <div class="card-body py-3">
                    <div class="d-flex align-items-center justify-content-between flex-wrap gap-2">
                      <div>
                        <h6 class="mb-1 fw-bold"><i class="bi bi-hdd-stack me-2 text-primary"></i>Total Database Storage</h6>
                        <span class="text-muted small">Combined size of every JSON file in the database folder.</span>
                      </div>
                      <div class="text-end">
                        <div class="display-6 fw-bold text-primary" id="total-storage-size">Calculating…</div>
                        <span class="text-muted small" id="total-storage-count">0 files</span>
                      </div>
                    </div>
                    <div class="progress mt-3" style="height: 8px;">
                      <div class="progress-bar bg-primary" id="storage-progress-bar" style="width: 0%" role="progressbar" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                    <div class="d-flex justify-content-between small text-muted mt-1">
                      <span id="storage-used-label">0 KB used</span>
                      <span><i class="bi bi-info-circle me-1"></i>Browser storage limit: <span id="storage-limit-label">~5 MB</span></span>
                    </div>
                    <div id="storage-breakdown" class="mt-3 pt-3 border-top" aria-label="Storage breakdown by folder"></div>
                  </div>
                </div>
  
                <div class="alert alert-info" role="alert">
                  <i class="bi bi-info-circle me-2"></i>
                  <strong>Note:</strong> Your browser will request storage access permission before downloading the files.
                </div>
  
                <div id="file-list" class="mb-4">
                  <h6 class="mb-3">Files to be included:</h6>
                  <ul class="list-group" id="database-files-list">
                    <li class="list-group-item d-flex justify-content-between align-items-center gap-2">
                      <span class="file-name"><i class="bi bi-file-earmark-json me-2"></i>classes.json</span>
                      <span class="badge bg-secondary file-size">Loading...</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center gap-2">
                      <span class="file-name"><i class="bi bi-file-earmark-json me-2"></i>grades.json</span>
                      <span class="badge bg-secondary file-size">Loading...</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center gap-2">
                      <span class="file-name"><i class="bi bi-file-earmark-json me-2"></i>pricing.json</span>
                      <span class="badge bg-secondary file-size">Loading...</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center gap-2">
                      <span class="file-name"><i class="bi bi-file-earmark-json me-2"></i>receptionist-page-access.json</span>
                      <span class="badge bg-secondary file-size">Loading...</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center gap-2">
                      <span class="file-name"><i class="bi bi-file-earmark-json me-2"></i>settings.json</span>
                      <span class="badge bg-secondary file-size">Loading...</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center gap-2">
                      <span class="file-name"><i class="bi bi-file-earmark-json me-2"></i>student-absence-logs.json</span>
                      <span class="badge bg-secondary file-size">Loading...</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center gap-2">
                      <span class="file-name"><i class="bi bi-file-earmark-json me-2"></i>students.json</span>
                      <span class="badge bg-secondary file-size">Loading...</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center gap-2">
                      <span class="file-name"><i class="bi bi-file-earmark-json me-2"></i>subjects.json</span>
                      <span class="badge bg-secondary file-size">Loading...</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center gap-2">
                      <span class="file-name"><i class="bi bi-file-earmark-json me-2"></i>subscription-usage-log.json</span>
                      <span class="badge bg-secondary file-size">Loading...</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center gap-2">
                      <span class="file-name"><i class="bi bi-file-earmark-json me-2"></i>subscription.json</span>
                      <span class="badge bg-secondary file-size">Loading...</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center gap-2">
                      <span class="file-name"><i class="bi bi-file-earmark-json me-2"></i>teacher-absence-logs.json</span>
                      <span class="badge bg-secondary file-size">Loading...</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center gap-2">
                      <span class="file-name"><i class="bi bi-file-earmark-json me-2"></i>teachers-availability.json</span>
                      <span class="badge bg-secondary file-size">Loading...</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center gap-2">
                      <span class="file-name"><i class="bi bi-file-earmark-json me-2"></i>teachers.json</span>
                      <span class="badge bg-secondary file-size">Loading...</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center gap-2">
                      <span class="file-name"><i class="bi bi-file-earmark-json me-2"></i>topics.json</span>
                      <span class="badge bg-secondary file-size">Loading...</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center gap-2">
                      <span class="file-name"><i class="bi bi-folder me-2"></i>teacher-portal/payments.json</span>
                      <span class="badge bg-secondary file-size">Loading...</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center gap-2">
                      <span class="file-name"><i class="bi bi-folder me-2"></i>teacher-portal/session-draft.json</span>
                      <span class="badge bg-secondary file-size">Loading...</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center gap-2">
                      <span class="file-name"><i class="bi bi-folder me-2"></i>teacher-portal/session-form.json</span>
                      <span class="badge bg-secondary file-size">Loading...</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center gap-2">
                      <span class="file-name"><i class="bi bi-folder me-2"></i>teacher-portal/teachers-attendance.json</span>
                      <span class="badge bg-secondary file-size">Loading...</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center gap-2">
                      <span class="file-name"><i class="bi bi-folder me-2"></i>site_access/admin.json</span>
                      <span class="badge bg-secondary file-size">Loading...</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center gap-2">
                      <span class="file-name"><i class="bi bi-folder me-2"></i>site_access/coordinator.json</span>
                      <span class="badge bg-secondary file-size">Loading...</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center gap-2">
                      <span class="file-name"><i class="bi bi-folder me-2"></i>site_access/receptionist.json</span>
                      <span class="badge bg-secondary file-size">Loading...</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center gap-2">
                      <span class="file-name"><i class="bi bi-folder me-2"></i>site_access/teacher.json</span>
                      <span class="badge bg-secondary file-size">Loading...</span>
                    </li>
                  </ul>
                </div>
  
                <div class="d-grid gap-2">
                  <button id="download-btn" class="btn btn-primary btn-lg" disabled>
                    <i class="bi bi-download me-2"></i>
                    Download All Database Files
                  </button>
                </div>
  
                <div id="status-message" class="mt-3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  
    <script src="/bootstrap-5.0.2/dist/js/bootstrap.bundle.min.js"></script>
    <script src="/src/components/admin/sidebar-menu/sidebar-loader.js"></script>
    <script src="/src/components/admin/2.0-design/2.0design.js"></script>
    <script type="module" src="/assist/page-boot.js" data-header="/src/components/admin/header/header.html" data-container="admin-header-container" data-undo-module="/assist/undo-manager.js"></script>
    <script type="module" src="database-download.js"></script>
    <script src="/assist/pwa-register.js" defer></script>
    <script src="/assist/use-hostname.js" defer></script>
  </body>
  </html>
`;
