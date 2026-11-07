// Auto-generated from index.html — markup verbatim; the
// build (scripts/generate-pages.mjs) writes index.html from this.
// Styles for this page live in the sibling *-styles.ts module.
export const htmlFile = 'index.html';
export const pageHtml = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-title" content="MasterMind">
    <meta name="theme-color" content="#6C4DF6">
    <link rel="manifest" href="/assist/manifest.json">
    <link rel="apple-touch-icon" href="/src/assets/Mastermind_logo.jpeg">
    <title>Past Papers | Receptionist</title>
    <link href="/bootstrap-5.0.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="/src/components/receptionist/sidebar-menu/sidebar.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" rel="stylesheet" media="print" onload="this.media='all'">
    <link rel="stylesheet" href="/src/components/receptionist/action-buttons/action-buttons.css">
    <link rel="stylesheet" href="past-papers.css?v=4">
    <link rel="stylesheet" href="/src/components/receptionist/header/header.css">
  </head>
  <body>
    <!-- Sidebar Container -->
    <div id="sidebar-container"></div>
    <div id="receptionist-header-container"></div>
    <!-- Main Content -->
    <div class="container mt-5" id="main-content" style="margin-left:250px; max-width:calc(100vw - 270px);">

      <div class="pp-page-head">
        <span class="pp-page-icon"><i class="bi bi-file-earmark-text"></i></span>
        <div>
          <h2 class="pp-page-title">Past Papers</h2>
          <p class="pp-page-subtitle">Upload students' past papers — track the student, curriculum, grade, contact details and the price, amount due and paid.</p>
        </div>
      </div>

      <form id="pastPapersForm" class="pp-form mb-4">
        <div class="pp-form-head">
          <div>
            <h3 class="pp-form-title">New past paper entry</h3>
            <p class="pp-form-subtitle">Pick a student first — their phone, curriculum and grade fill in automatically.</p>
          </div>
          <span class="pp-required-pill"><span>*</span> Student required</span>
        </div>

        <div class="pp-form-body">
          <section class="pp-group">
            <div class="pp-group-head">
              <span class="pp-step">1</span>
              <h4 class="pp-group-title">Student details</h4>
            </div>
            <div class="row g-3">
              <div class="col-12 col-lg-6">
                <label class="form-label" for="studentSearch">Student <span class="pp-req">*</span></label>
                <div class="student-picker">
                  <input type="text" id="studentSearch" class="form-control" placeholder="Start typing a student's name..." autocomplete="off" aria-autocomplete="list" aria-controls="studentPickerList">
                  <button type="button" id="studentPickerClear" class="student-picker-clear d-none" title="Clear student selection">&times;</button>
                  <div id="studentPickerList" class="student-picker-list d-none"></div>
                </div>
                <input type="hidden" id="studentId">
                <div class="pp-help">Click into the box to browse every student.</div>
              </div>
              <div class="col-12 col-md-6 col-lg-3">
                <label class="form-label" for="phoneNumber">Phone number</label>
                <input type="text" id="phoneNumber" class="form-control" placeholder="Auto-filled from students DB" readonly>
              </div>
              <div class="col-12 col-md-6 col-lg-3">
                <label class="form-label" for="emailAddress">Email</label>
                <input type="email" id="emailAddress" class="form-control" placeholder="name@example.com" autocomplete="email" inputmode="email">
              </div>
            </div>
          </section>

          <section class="pp-group">
            <div class="pp-group-head">
              <span class="pp-step">2</span>
              <h4 class="pp-group-title">Curriculum &amp; grade</h4>
            </div>
            <div class="row g-3">
              <div class="col-12 col-lg-4">
                <label class="form-label" for="curriculum">Curriculum</label>
                <input type="text" id="curriculum" class="form-control" placeholder="Auto-filled from students DB" readonly>
              </div>
              <div class="col-12 col-lg-8">
                <label class="form-label d-block">Grade level</label>
                <div id="gradesContainer" class="pill-container"></div>
                <div class="pp-help">Tap a grade to select it — tap it again to clear.</div>
              </div>
            </div>
          </section>

          <section class="pp-group pp-group-last">
            <div class="pp-group-head">
              <span class="pp-step">3</span>
              <h4 class="pp-group-title">Pricing &amp; files</h4>
            </div>
            <div class="row g-3">
              <div class="col-6 col-md-4 col-xl-2">
                <label class="form-label" for="price">Price</label>
                <input type="number" id="price" class="form-control" placeholder="0.00" min="0" step="0.01">
              </div>
              <div class="col-6 col-md-4 col-xl-2">
                <label class="form-label" for="amountDue">Amount due</label>
                <input type="number" id="amountDue" class="form-control" placeholder="0.00" min="0" step="0.01">
              </div>
              <div class="col-6 col-md-4 col-xl-2">
                <label class="form-label" for="paidAmount">Paid</label>
                <input type="number" id="paidAmount" class="form-control" placeholder="0.00" min="0" step="0.01">
              </div>
              <div class="col-12 col-xl-6">
                <label class="form-label" for="paperFiles">Past paper files</label>
                <input type="file" id="paperFiles" class="form-control pp-file-input" multiple>
                <div class="pp-help">PDF, images or documents — max 50 MB each.</div>
              </div>
            </div>
            <div id="pendingFiles" class="pending-files"></div>
          </section>
        </div>

        <div class="pp-form-foot">
          <span class="pp-foot-note"><i class="bi bi-cloud-arrow-up"></i> Files upload right after the entry is saved.</span>
          <button type="submit" class="btn btn-primary pp-submit"><i class="bi bi-plus-lg"></i> Add past paper</button>
        </div>
      </form>

      <div class="pp-list-head">
        <div>
          <h3 class="pp-list-title">All past papers</h3>
          <p class="pp-list-subtitle">Click any cell in the table to edit it in place.</p>
        </div>
      </div>

      <div class="pp-search">
        <i class="bi bi-search"></i>
        <input type="text" id="pastPapersSearchInput" class="form-control" placeholder="Search by student, phone, email, curriculum, grade or file name...">
      </div>

      <div class="table-responsive">
        <div id="pastPapersTableContainer"></div>
      </div>
    </div>

    <script src="/bootstrap-5.0.2/dist/js/bootstrap.bundle.min.js"></script>
    <script src="/src/components/receptionist/sidebar-menu/sidebar-loader.js"></script>
    <script src="/src/components/admin/2.0-design/2.0design.js"></script>
    <script type="module" src="/assist/page-boot.js" data-header="/src/components/receptionist/header/header.html" data-container="receptionist-header-container" data-undo-module="/assist/undo-manager.js"></script>
    <script type="module" src="past-papers.js?v=4"></script>
    <script src="/assist/pwa-register.js" defer></script>
    <script src="/assist/use-hostname.js" defer></script>
  </body>
  </html>
`;
