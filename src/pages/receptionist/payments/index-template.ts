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
    <title>Payments | Receptionist Portal</title>
  
    <!-- Bootstrap + Icons -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" media="print" onload="this.media='all'">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" rel="stylesheet" media="print" onload="this.media='all'">
  
    <!-- Sidebar CSS -->
    <link rel="stylesheet" href="/src/components/receptionist/sidebar-menu/sidebar.css">
  
    <!-- Header CSS (IMPORTANT FIX) -->
    <link rel="stylesheet" href="/src/components/receptionist/header/header.css">
  
    <!-- Payments CSS -->
    <link rel="stylesheet" href="/src/pages/receptionist/payments/payments.css">
  </head>
  
  <body>
  
    <!-- Sidebar -->
    <div id="sidebar-container"></div>
  
    <!-- Header -->
    <div id="receptionist-header-container"></div>
  
    <!-- Main Content -->
    <div class="container-fluid px-3 px-md-4 mt-3" id="main-content">
      
      <div class="payments-wrapper payments-page-admin">
  
        <!-- Title -->
        <div class="page-title mb-1">Payments</div>
        <div class="page-subtitle mb-3 text-muted">
          New session forms waiting for a Price Tag and Amount. Set them here, then choose Paid, Partial or Unpaid — the row moves to that page.
        </div>
  
        <!-- Actions -->
        <div class="d-flex flex-column flex-md-row gap-2 mb-3">
          <button class="btn btn-primary" id="exportExcelBtn">
            <i class="bi bi-download me-1"></i> Export Excel Log
          </button>
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
  
        <!-- List -->
        <div id="paymentsList"></div>
  
      </div>
  
    </div>
  
    <!-- Scripts -->
    <script src="/src/components/receptionist/sidebar-menu/sidebar-loader.js"></script>
    <script src="/src/pages/admin/payments/payments-grouping.js"></script>
    <script type="module" src="/src/pages/receptionist/payments/payments.js"></script>
  
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"></script>
  
    <script type="module" src="/assist/page-boot.js" data-header="/src/components/receptionist/header/header.html" data-container="receptionist-header-container" data-undo-module="/assist/undo-manager.js" data-burger-module="/src/components/receptionist/header/header.js"></script>
  
    <script src="/assist/pwa-register.js" defer></script>
    <script src="/assist/use-hostname.js" defer></script>
  </body>
  </html>
`;
