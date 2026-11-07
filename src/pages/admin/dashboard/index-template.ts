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
    <title>Admin Dashboard</title>
    <link href="/bootstrap-5.0.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="/src/components/admin/sidebar-menu/sidebar.css" rel="stylesheet">
    <link href="/src/pages/admin/dashboard/dashboard.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" rel="stylesheet" media="print" onload="this.media='all'">
    <link rel="stylesheet" href="/src/components/admin/header/header.css">
    <style>
      /* Hide Undo button only on dashboard */
      #admin-header-container #undo-btn,
      #admin-header-container #undo-btn-desktop {
        display: none !important;
      }
    </style>
  </head>
  <body>
    <div id="sidebar-container"></div>
    <!-- Admin Header (shared for mobile/desktop) -->
    <div id="admin-header-container"></div>
    <main class="dashboard-content" style="margin-left:260px;">
      <div class="container-fluid">
        <div class="row justify-content-center">
          <div class="col-12">
            <div class="d-flex flex-wrap justify-content-center align-items-center gap-4" style="min-height: 40vh;">
              <!-- Students Card -->
              <div class="card shadow-sm border-0 text-center" style="width: 250px;">
                <div class="card-body">
                  <i class="bi bi-people-fill display-4 text-primary mb-2"></i>
                  <h5 class="card-title">Total Students</h5>
                  <p class="card-text fs-2" id="students-count">--</p>
                </div>
              </div>
              <!-- Teachers Card -->
              <div class="card shadow-sm border-0 text-center" style="width: 250px;">
                <div class="card-body">
                  <i class="bi bi-person-badge-fill display-4 text-success mb-2"></i>
                  <h5 class="card-title">Total Teachers</h5>
                  <p class="card-text fs-2" id="teachers-count">--</p>
                </div>
              </div>
              <!-- Revenue Card -->
              <div class="card shadow-sm border-0 text-center" style="width: 250px;">
                <div class="card-body">
                  <i class="bi bi-graph-up-arrow display-4 text-warning mb-2"></i>
                  <h5 class="card-title">Revenue</h5>
                  <p class="card-text fs-2" id="revenue-amount">--</p>
                </div>
              </div>
              <!-- Placeholder Card 2 -->
              <div class="card shadow-sm border-0 text-center" style="width: 250px;">
                <div class="card-body">
                  <i class="bi bi-cash-coin display-4 text-info mb-2"></i>
                  <h5 class="card-title">Unpaid Students</h5>
                  <p class="card-text fs-2" id="unpaid-students-count">--</p>
                </div>
              </div>
            </div>
  
            <!-- Monthly Income Breakdown (after teacher cut rates) -->
            <section class="monthly-income-card mt-3" id="monthly-income-section">
              <div class="monthly-income-header">
                <div>
                  <h5 class="monthly-income-title">
                    <i class="bi bi-cash-stack"></i> Monthly Income Breakdown
                  </h5>
                  <p class="monthly-income-subtitle mb-0">
                    How much the center actually earned each month, after paying every teacher's cut rate.
                  </p>
                </div>
                <span class="monthly-income-updated" id="monthly-income-updated"></span>
              </div>
              <div class="monthly-income-body" id="monthly-income-body">
                <div class="text-muted text-center py-4">Loading monthly income…</div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
    <script src="/bootstrap-5.0.2/dist/js/bootstrap.bundle.min.js"></script>
    <script src="/src/pages/admin/payments/payments-grouping.js"></script>
    <script src="/src/pages/admin/dashboard/monthly-income.js"></script>
    <script src="/src/components/admin/sidebar-menu/sidebar-loader.js"></script>
    <script src="/src/components/admin/2.0-design/2.0design.js"></script>
    <script type="module" src="/assist/page-boot.js" data-header="/src/components/admin/header/header.html" data-container="admin-header-container"></script>
    <script type="module" src="/src/pages/admin/dashboard/dashboard-boot.js"></script>
    <script src="/assist/pwa-register.js" defer></script>
    <script src="/assist/use-hostname.js" defer></script>
  </body>
  </html>
`;
