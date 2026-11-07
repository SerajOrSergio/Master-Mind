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
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes, viewport-fit=cover">
    <title>Teacher Absence | Receptionist</title>
    <link href="/bootstrap-5.0.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="/src/components/receptionist/sidebar-menu/sidebar.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" rel="stylesheet" media="print" onload="this.media='all'">
    <link rel="stylesheet" href="/src/pages/admin/session-form/session-form.css">
    <link rel="stylesheet" href="/src/components/receptionist/action-buttons/action-buttons.css">
    <link href="https://cdn.jsdelivr.net/npm/choices.js/public/assets/styles/choices.min.css" rel="stylesheet" media="print" onload="this.media='all'">
    <script src="/bootstrap-5.0.2/dist/js/bootstrap.min.js"></script>
    <link rel="stylesheet" href="/src/components/receptionist/header/header.css">
  </head>
  <body>
    <!-- Sidebar Container -->
    <div id="sidebar-container"></div>
    <div id="receptionist-header-container"></div>
    <script src="/src/components/receptionist/sidebar-menu/sidebar-loader.js"></script>
    <script type="module" src="/assist/page-boot.js" data-header="/src/components/receptionist/header/header.html" data-container="receptionist-header-container" data-undo-module="/assist/undo-manager.js" data-burger-module="/src/components/receptionist/header/header.js"></script>
    <!-- Main Content -->
    <div class="container mt-5" id="main-content" style="margin-left:250px; max-width:calc(100% - 250px);">
      <div class="session-form-wrapper">
        <div class="session-card">
          <div class="page-title">Log Teacher Absence</div>
          <div class="page-subtitle">Receptionist can log a teacher's absence for any date, time, and subject.</div>
          <form id="teacherAbsenceForm">
            <div class="row g-3">
              <div class="col-12 col-md-4">
                <label class="form-label fw-semibold">Teacher</label>
                <select id="teacherSelectorDropdown" class="form-select" required>
                  <option value="">Select...</option>
                </select>
              </div>
              <div class="col-12 col-md-4">
                <label class="form-label fw-semibold">Subject</label>
                <select id="subjectSelectorDropdown" class="form-select" required>
                  <option value="">Select...</option>
                </select>
              </div>
              <div class="col-12 col-md-4">
                <label class="form-label fw-semibold">Date</label>
                <input type="date" class="form-control" id="absenceDate" placeholder="mm/dd/yyyy" required />
              </div>
            </div>
            <div class="row mt-3">
              <div class="col-12">
                <span class="choice-label">Time Window:</span>
                <div class="choice-wrap" id="timeSlotsContainer"></div>
              </div>
            </div>
            <div class="row mt-3">
              <div class="col-12">
                <label class="form-label">Reason (optional)</label>
                <input type="text" class="form-control" id="reasonInput" placeholder="Reason for absence (optional)" />
              </div>
            </div>
            <div class="row mt-3">
              <div class="col-12 d-grid d-md-block">
                <button type="submit" class="btn btn-primary w-100 w-md-auto">Log Absence</button>
              </div>
            </div>
          </form>
          <div class="mt-4">
            <h5>Absence Logs</h5>
            <div id="absenceLogsTable"></div>
          </div>
        </div>
      </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/choices.js/public/assets/scripts/choices.min.js"></script>
    <script src="./teacher-abcense.js"></script>
    <script src="/assist/pwa-register.js" defer></script>
    <script src="/assist/use-hostname.js" defer></script>
  </body>
  </body>
  <style>
  /* Responsive styles for Teacher Absence page (mobile-friendly, Bootstrap 5 look) */
  #main-content {
    background: #f5f6fa !important;
    min-height: 100vh;
    transition: margin-left 0.2s;
  }
  .session-form-wrapper {
    width: 100%;
    max-width: none;
    margin: 0;
    padding: 2.5rem 2.5vw 2.5rem 0.5vw;
    background: #f8fafc;
  }
  .session-card {
    background: transparent;
    border-radius: 0;
    box-shadow: none;
    padding: 0;
    border: none;
  }
  .page-title {
    font-size: 1.9rem;
    font-weight: 700;
    letter-spacing: -0.3px;
    color: #0a2540;
    margin-bottom: 0.3rem;
  }
  .page-subtitle {
    font-size: 1rem;
    color: #5c6f87;
    margin-bottom: 1.8rem;
    border-left: 3px solid #3b82f6;
    padding-left: 0.9rem;
  }
  .choice-label {
    font-weight: 600;
    color: #1e293b;
    margin-right: 1rem;
    margin-bottom: 0.5rem;
    display: inline-block;
  }
  #timeSlotsContainer {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    overflow-x: auto;
    overflow-y: visible;
    white-space: nowrap;
    width: 100%;
    gap: 8px;
    padding-bottom: 8px;
    scrollbar-width: thin;
    scrollbar-color: #cbd5e1 #f1f5f9;
  }
  #timeSlotsContainer::-webkit-scrollbar {
    height: 8px;
  }
  #timeSlotsContainer::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 8px;
  }
  #timeSlotsContainer::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 8px;
  }
  @media (max-width: 768px) {
    #main-content {
      margin-left: 0 !important;
      max-width: 100vw !important;
      padding: 0.5rem !important;
    }
    .session-form-wrapper {
      padding: 0.75rem;
    }
    .session-card {
      padding: 1.2rem;
    }
  }
  </style>
  </html>
`;
