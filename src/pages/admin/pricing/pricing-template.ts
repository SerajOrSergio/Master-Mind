// Auto-generated from pricing.html — markup verbatim; the
// build (scripts/generate-pages.mjs) writes pricing.html from this.
// Styles for this page live in the sibling *-styles.ts modules.
export const htmlFile = 'pricing.html';
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
    <title>Admin Pricing</title>
    <link href="/bootstrap-5.0.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="/src/components/admin/sidebar-menu/sidebar.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" rel="stylesheet" media="print" onload="this.media='all'">
    <link rel="stylesheet" href="pricing.css">
    <link rel="stylesheet" href="/src/components/admin/header/header.css">
  </head>
  <body>
    <!-- Sidebar Container -->
    <div id="sidebar-container"></div>
    <div id="admin-header-container"></div>
    <!-- Main Content -->
    <div class="container-fluid px-0" id="main-content">
      <div class="row justify-content-center mt-4 mx-0">
        <div class="col-12 col-md-11 col-lg-10 col-xl-9 px-1 px-md-2">
          <div class="card shadow-sm mb-4 w-100">
            <div class="card-body">
              <h2 class="mb-4">Pricing</h2>
              <div class="tabs mb-3 d-flex flex-wrap flex-md-nowrap gap-2">
                <button class="tab-btn active btn btn-outline-primary flex-fill flex-md-grow-0" data-category="Standard">Standard</button>
                <button class="tab-btn btn btn-outline-primary flex-fill flex-md-grow-0" data-category="KG - KG6">KG - KG6</button>
              </div>
              <form id="add-pricing-form" class="row g-2 mb-4" autocomplete="off">
                <div class="col-12 col-md-3">
                  <label for="typeInput" class="form-label mb-1">Type</label>
                  <input type="text" class="form-control" id="typeInput" placeholder="Type" required>
                </div>
                <div class="col-12 col-md-4">
                  <label for="descInput" class="form-label mb-1">Description</label>
                  <input type="text" class="form-control" id="descInput" placeholder="Description" required>
                </div>
                <div class="col-6 col-md-2">
                  <label for="currencyInput" class="form-label mb-1">Currency</label>
                  <select class="form-select" id="currencyInput" required>
                    <option value="LYD">LYD</option>
                    <option value="$">$</option>
                    <option value="€">€</option>
                    <option value="ل.د">ل.د</option>
                  </select>
                </div>
                <div class="col-6 col-md-2">
                  <label for="priceInput" class="form-label mb-1">Price</label>
                  <input type="number" class="form-control" id="priceInput" placeholder="Price" min="0" required>
                </div>
                <div class="col-12 col-md-1 d-flex align-items-end">
                  <button type="submit" class="btn btn-success w-100">Add</button>
                </div>
              </form>
              <div id="pricing-table"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <style>
      @media (min-width: 768px) {
        #main-content {
          margin-left: 260px;
          max-width: calc(100% - 260px);
        }
      }
      @media (max-width: 767.98px) {
        #main-content {
          margin-left: 0;
          max-width: 100vw;
        }
      }
    </style>
    <script src="/bootstrap-5.0.2/dist/js/bootstrap.bundle.min.js"></script>
    <script src="/src/components/admin/sidebar-menu/sidebar-loader.js"></script>
    <script src="/src/components/admin/2.0-design/2.0design.js"></script>
    <script type="module" src="/assist/page-boot.js" data-header="/src/components/admin/header/header.html" data-container="admin-header-container" data-undo-module="/assist/undo-manager.js"></script>
    <script src="pricing.js"></script>
    <script src="/assist/pwa-register.js" defer></script>
    <script src="/assist/use-hostname.js" defer></script>
  </body>
  </html>
`;
