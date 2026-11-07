// Auto-generated from paid.html — markup verbatim; the
// build (scripts/generate-pages.mjs) writes paid.html from this.
export const htmlFile = 'paid.html';
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
    <link rel="stylesheet" href="/bootstrap-5.0.2/dist/css/bootstrap.min.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" rel="stylesheet" media="print" onload="this.media='all'">
    <link rel="stylesheet" href="/src/components/receptionist/sidebar-menu/sidebar.css">
    <link rel="stylesheet" href="/src/pages/receptionist/payments/payments.css">
    <link rel="stylesheet" href="/src/pages/receptionist/paid/paid.css">
    <title>Paid Payments</title>
    <link rel="stylesheet" href="/src/components/receptionist/header/header.css">
  </head>
  <body>
    <div id="sidebar-container"></div>
    <div id="receptionist-header-container"></div>
    <div class="container-fluid px-0" id="main-content">
      <div class="payments-wrapper payments-page-admin">
        <div class="page-title"><i class="bi bi-cash-stack me-2"></i>Paid Payments</div>
        <div class="page-subtitle">Newest paid sessions on top, grouped by month. Click a session row to see its students.</div>
        <div class="mb-3">
          <div class="d-flex align-items-center gap-2">
            <input id="searchPaidInput" type="text" class="form-control" placeholder="Search by teacher, subject, or student name..." autocomplete="off">
            <select id="filterPaidType" class="form-select" style="max-width:180px;">
              <option value="">Filter by...</option>
              <option value="teacher">Teacher</option>
              <option value="subject">Subject</option>
              <option value="student">Student</option>
            </select>
            <select id="filterPaidValue" class="form-select" style="max-width:220px; display:none;"></select>
            <input id="startMonthInput" type="month" class="form-control" style="max-width:150px;" />
            <input id="endMonthInput" type="month" class="form-control" style="max-width:150px;" />
            <button id="applyPaidFilterBtn" class="btn btn-primary" style="display:none;">Apply</button>
          </div>
          <div id="paidFilterSummary" class="mt-2 text-end text-secondary small"></div>
        </div>
        <div id="paidPaymentsList"></div>
      </div>
    </div>
    <script src="/bootstrap-5.0.2/dist/js/bootstrap.bundle.min.js"></script>
    <script src="/src/components/receptionist/sidebar-menu/sidebar-loader.js"></script>
    <script src="/src/pages/admin/payments/payments-grouping.js"></script>
    <script src="paid.js"></script>
  
    <!-- Header Loader + Undo Button -->
    <script type="module" src="/assist/page-boot.js" data-header="/src/components/receptionist/header/header.html" data-container="receptionist-header-container" data-undo-module="/assist/undo-manager.js"></script>
    <script src="/assist/pwa-register.js" defer></script>
    <script src="/assist/use-hostname.js" defer></script>
  </body>
  </html>
`;
