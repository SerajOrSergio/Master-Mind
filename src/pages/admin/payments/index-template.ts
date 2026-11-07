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
    <title>Payments | Admin Portal</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" media="print" onload="this.media='all'">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" rel="stylesheet" media="print" onload="this.media='all'">
    <link rel="stylesheet" href="/src/pages/admin/payments/payments.css">
    <link rel="stylesheet" href="/src/components/admin/sidebar-menu/sidebar.css">
    <link rel="stylesheet" href="/src/components/admin/header/header.css">
  </head>
  <body>
    <div id="sidebar-container"></div>
    <!-- Admin Header (shared for mobile/desktop) -->
    <div id="admin-header-container"></div>
    <div class="container-fluid px-0" id="main-content">
      <div class="payments-wrapper payments-page-admin">
        <div class="payments-toolbar">
          <div>
            <div class="page-title">Payments</div>
            <div class="page-subtitle">New session forms waiting for a Price Tag and Amount. Set them here, then choose Paid, Partial or Unpaid — the row moves to that page.</div>
          </div>
          <button class="btn btn-primary" id="exportExcelBtn"><i class="bi bi-download me-1"></i>Export Excel Log</button>
        </div>
  
        <!-- Filter Card (same as the Paid page) -->
        <div class="payments-filter-card mb-3">
          <div class="d-flex flex-wrap flex-md-nowrap align-items-center gap-2">
            <input id="searchInput" type="text" class="form-control" placeholder="Search teacher, subject, student, or phone number" autocomplete="off">
            <select id="filterPaymentsType" class="form-select" style="max-width: 180px;">
              <option value="">Filter by...</option>
              <option value="teacher">Teacher</option>
              <option value="subject">Subject</option>
              <option value="student">Student</option>
            </select>
            <select id="filterPaymentsValue" class="form-select" style="max-width: 220px; display: none;"></select>
            <input id="startMonthInput" type="month" class="form-control" style="max-width: 150px;" placeholder="Start month">
            <input id="endMonthInput" type="month" class="form-control" style="max-width: 150px;" placeholder="End month">
            <button id="applyPaymentsFilterBtn" class="btn btn-primary" style="display: none;">Apply</button>
          </div>
          <div id="paymentsFilterSummary" class="mt-2 text-end text-secondary small"></div>
        </div>
  
        <div id="paymentsList"></div>
      </div>
    </div>
    <!-- Sidebar Loader (dynamic) -->
    <script src="/src/components/admin/sidebar-menu/sidebar-loader.js"></script>
    <script src="/src/components/admin/2.0-design/2.0design.js"></script>
    <script type="module" src="/assist/page-boot.js" data-header="/src/components/admin/header/header.html" data-container="admin-header-container" data-undo-module="/assist/undo-manager.js" data-burger-module="/src/components/admin/header/header.js"></script>
    <script type="module" src="/src/pages/admin/payments/payments.js"></script>
    <!-- Bootstrap 5 JS for offcanvas menu toggle -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"></script>
    <script src="/assist/pwa-register.js" defer></script>
    <script src="/assist/use-hostname.js" defer></script>
  </body>
  </html>
`;
