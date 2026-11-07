// Auto-generated from subscription.html — markup verbatim; the
// build (scripts/generate-pages.mjs) writes subscription.html from this.
export const htmlFile = 'subscription.html';
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
      <title>Student Subscription</title>
      <link href="/bootstrap-5.0.2/dist/css/bootstrap.min.css" rel="stylesheet">
      <link href="/src/components/receptionist/sidebar-menu/sidebar.css" rel="stylesheet">
      <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" rel="stylesheet" media="print" onload="this.media='all'">
      <link href="https://cdn.jsdelivr.net/npm/choices.js/public/assets/styles/choices.min.css" rel="stylesheet" media="print" onload="this.media='all'">
      <link href="subscription.css?v=2" rel="stylesheet">
    <link rel="stylesheet" href="/src/components/receptionist/header/header.css">
  </head>
  <body>
      <!-- Sidebar Container -->
      <div id="sidebar-container"></div>
      <div id="receptionist-header-container"></div>
      <!-- Main Content -->
      <div class="container-fluid mt-4 px-2 px-md-4" id="main-content" style="margin-left:260px; max-width:calc(100% - 260px);">
        <h2 class="text-center mb-4">Student Subscription</h2>
        <form id="subscriptionForm" class="row g-3 mb-4">
          <div class="col-12 col-md-3">
            <label for="studentSelect" class="form-label">Student:</label>
            <select id="studentSelect" class="form-select" required>
              <option value="">Select Student</option>
            </select>
          </div>
          <div class="col-12 col-md-2">
            <label for="subjectSelect" class="form-label">Subject (blank = all subjects):</label>
            <select id="subjectSelect" class="form-select">
              <option value="">All subjects (any)</option>
            </select>
          </div>
          <div class="col-12 col-md-2">
            <label for="priceInput" class="form-label">Price Paid:</label>
            <input type="number" id="priceInput" class="form-control" required />
          </div>
          <div class="col-12 col-md-2">
            <label for="packageAmountInput" class="form-label">Package Amount:</label>
            <input type="number" id="packageAmountInput" class="form-control" required />
          </div>
          <div class="col-12 col-md-2">
            <label for="typeSelect" class="form-label">Type:</label>
            <select id="typeSelect" class="form-select">
              <option value="classes">Classes</option>
              <option value="hours">Hours</option>
            </select>
          </div>
          <div class="col-12 col-md-2">
            <label class="form-label">Issued Date:</label>
            <input type="text" class="form-control" value="" id="issuedInput" disabled />
          </div>
          <div class="col-12 d-flex justify-content-end">
            <button type="submit" class="btn btn-primary">Save Student Subscription</button>
          </div>
        </form>
        <h3 class="text-center">Subscriptions</h3>
        <div class="table-responsive">
          <table id="subscriptionsTable" class="table table-hover mt-3 align-middle">
            <thead class="table-light">
              <tr>
                <th>Student</th>
                <th>Subject</th>
                <th>Price</th>
                <th>Type</th>
                <th>Issued</th>
                <th>Usage</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="subscriptionsTableBody">
              <!-- Subscriptions will be populated here -->
            </tbody>
          </table>
        </div>
      </div>
      <script src="/bootstrap-5.0.2/dist/js/bootstrap.bundle.min.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/choices.js/public/assets/scripts/choices.min.js"></script>
      <script src="/src/components/receptionist/sidebar-menu/sidebar-loader.js"></script>
      <script src="/src/components/admin/2.0-design/2.0design.js"></script>
      <script type="module" src="/assist/page-boot.js" data-header="/src/components/receptionist/header/header.html" data-container="receptionist-header-container" data-undo-module="/assist/undo-manager.js"></script>
      <script src="subscription.js?v=2"></script>
      <script src="/assist/main-content.js" defer></script>
    <script src="/assist/pwa-register.js" defer></script>
    <script src="/assist/use-hostname.js" defer></script>
  </body>
  </html>
`;
