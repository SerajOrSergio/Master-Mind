// Auto-generated from unpaid.html — markup verbatim; the
// build (scripts/generate-pages.mjs) writes unpaid.html from this.
export const htmlFile = 'unpaid.html';
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
    <title>Unpaid Payments | Receptionist Portal</title>
  
    <!-- Bootstrap CSS + Icons -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" media="print" onload="this.media='all'">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" rel="stylesheet" media="print" onload="this.media='all'">
  
    <!-- Sidebar CSS -->
    <link rel="stylesheet" href="/src/components/receptionist/sidebar-menu/sidebar.css">
  
    <!-- Header CSS -->
    <link rel="stylesheet" href="/src/components/receptionist/header/header.css">
  
    <!-- Page CSS: Use admin payments style for full consistency -->
    <link rel="stylesheet" href="/src/pages/admin/payments/payments.css">
    <link rel="stylesheet" href="/src/pages/receptionist/unpaid/unpaid.css">
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
        <div class="page-title mb-1">
          <i class="bi bi-cash me-2"></i> Unpaid Payments
        </div>
  
        <div class="page-subtitle mb-3 text-muted">
          Newest unpaid forms on top, grouped by month. Click a form row to see its students.
        </div>
  
        <!-- Export Excel Button -->
        <div class="mb-3">
          <button id="exportExcelBtn" class="btn btn-success"><i class="bi bi-file-earmark-excel me-1"></i>Export Excel Log</button>
        </div>
        <!-- Search Input -->
        <div class="d-flex flex-column flex-md-row gap-2 mb-3">
          <input 
            type="text" 
            class="form-control" 
            id="searchInput" 
            placeholder="Search student, teacher, subject, or phone number"
          >
        </div>
  
        <!-- Unpaid Payments List -->
        <div id="unpaidPaymentsList" class="table-responsive"></div>
  
      </div>
  
    </div>
  
    <!-- Scripts -->
  
    <!-- Sidebar -->
    <script src="/src/components/receptionist/sidebar-menu/sidebar-loader.js"></script>
  
  
    <!-- Bootstrap JS Bundle -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"></script>
  
    <!-- Header Loader + Undo Button -->
    <script type="module" src="/assist/page-boot.js" data-header="/src/components/receptionist/header/header.html" data-container="receptionist-header-container" data-undo-module="/assist/undo-manager.js" data-burger-module="/src/components/receptionist/header/header.js"></script>
  
    <!-- Page JS (must be last for DOM access) -->
    <script src="/src/pages/admin/payments/payments-grouping.js"></script>
    <script src="/src/pages/receptionist/unpaid/unpaid.js"></script>
  
    <script src="/assist/pwa-register.js" defer></script>
    <script src="/assist/use-hostname.js" defer></script>
  </body>
  </html>
`;
