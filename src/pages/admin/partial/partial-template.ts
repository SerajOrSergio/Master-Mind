// Auto-generated from partial.html — markup verbatim; the
// build (scripts/generate-pages.mjs) writes partial.html from this.
export const htmlFile = 'partial.html';
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
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" rel="stylesheet" media="print" onload="this.media='all'">
    <title>Partial Payments</title>
    <link rel="stylesheet" href="/bootstrap-5.0.2/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="/src/pages/admin/payments/payments.css">
    <link rel="stylesheet" href="/src/components/admin/sidebar-menu/sidebar.css">
    <link rel="stylesheet" href="/src/components/admin/header/header.css">
  </head>
  <body>
    <div id="sidebar-container"></div>
    <div id="admin-header-container"></div>
    <div class="container-fluid px-0" id="main-content">
      <div class="payments-wrapper payments-page-admin">
        <div class="page-title"><i class="bi bi-cash-coin me-2"></i>Partial Payments</div>
        <div class="page-subtitle">Newest partial payments on top, grouped by month. Click a form row to see its students.</div>
        <div id="partialPaymentsList"></div>
      </div>
    </div>
    <script src="/src/components/admin/sidebar-menu/sidebar-loader.js"></script>
    <script src="/src/components/admin/2.0-design/2.0design.js"></script>
    <script type="module" src="/assist/page-boot.js" data-header="/src/components/admin/header/header.html" data-container="admin-header-container" data-undo-module="/assist/undo-manager.js"></script>
    <script src="/src/pages/admin/payments/payments-grouping.js"></script>
    <script src="partial.js"></script>
    <!-- Bootstrap 5 JS for offcanvas menu toggle -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"></script>
    <script src="/assist/pwa-register.js" defer></script>
    <script src="/assist/use-hostname.js" defer></script>
  </body>
  </html>
`;
