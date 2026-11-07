// Auto-generated from index.html — markup verbatim; the
// build (scripts/generate-pages.mjs) writes index.html from this.
// Styles for this page live in the sibling *-styles.ts module.
// The ids here are the contract with student-materials.ts: the page logic
// queries them directly, so renaming any of them breaks the page.
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
    <title>Student Materials | Admin</title>
    <link href="/bootstrap-5.0.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="/src/components/admin/sidebar-menu/sidebar.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" rel="stylesheet" media="print" onload="this.media='all'">
    <link rel="stylesheet" href="student-materials.css">
    <link rel="stylesheet" href="/src/components/admin/header/header.css">
  </head>
  <body>
    <!-- Sidebar Container -->
    <div id="sidebar-container"></div>
    <div id="admin-header-container"></div>

    <!-- Main Content -->
    <div class="container mt-5" id="main-content" style="margin-left:260px; max-width:calc(100% - 260px);">
      <div class="ms-header row">
        <div class="col-12">
          <h2>Student Materials</h2>
          <div id="viewSwitcher" class="view-toggle mt-2">
            <button type="button" class="btn view-toggle-btn active ms-view-btn" id="viewTableBtn" data-view="table">Table View</button>
            <button type="button" class="btn view-toggle-btn ms-view-btn" id="viewShelfBtn" data-view="shelf">Shelf View</button>
          </div>
        </div>
      </div>

      <!-- Filter row -->
      <div class="ms-filter-row row mt-3">
        <div class="col-12 ms-filter-vm">
          <input
            id="materialsSearchInput"
            type="text"
            class="form-control"
            placeholder="Filter materials by student name, phone, grade, subject, or file name..."
            style="width:100%"
          />
        </div>
      </div>

      <!-- Add entry form -->
      <form id="studentMaterialsForm" class="ms-add-form ms-vm mt-3">
        <div class="row mb-3">
          <div class="col-12">
            <h3 class="h5 mb-0">New student material entry</h3>
          </div>
        </div>

        <div class="row align-items-end mb-2">
          <div class="col-lg-6 col-md-12 mb-2 mb-lg-0">
            <label class="form-label" for="studentSearch">Student * (click into the box to search by name)</label>
            <div class="student-picker">
              <input
                type="text"
                id="studentSearch"
                class="form-control"
                placeholder="Start typing a student's name..."
                aria-label="Search student by name"
                autocomplete="off"
                aria-autocomplete="list"
                aria-expanded="false"
                aria-controls="studentPickerList"
              />
              <button class="student-picker-clear d-none" type="button" id="studentPickerClear" title="Clear student selection">
                <span aria-hidden="true">&times;</span>
              </button>
              <div id="studentPickerList" class="student-picker-list d-none"></div>
            </div>
            <input type="hidden" id="studentId" />
          </div>
          <div class="col-lg-6 col-md-12">
            <label class="form-label" for="phoneNumber">Phone <small class="text-muted fw-normal">(auto-filled from students DB)</small></label>
            <input type="text" id="phoneNumber" class="form-control" placeholder="(will be filled by the student picker)" readonly />
          </div>
        </div>

        <div class="row align-items-end mb-2">
          <div class="col-lg-6 col-md-12 mb-2 mb-lg-0">
            <label class="form-label" for="curriculum">Curriculum <small class="text-muted fw-normal">(auto-filled from students DB)</small></label>
            <input type="text" id="curriculum" class="form-control" placeholder="(will be filled by the student picker)" readonly />
          </div>
          <div class="col-lg-6 col-md-12">
            <label class="form-label">Grade * (from grades database G1–G12)</label>
            <div class="form-text" style="font-size:0.85rem">Click a grade pill to select it — click again to deselect.</div>
            <div id="gradesContainer" class="ms-grade-pills form-inline d-flex flex-wrap gap-1 mb-1"></div>
          </div>
        </div>

        <div class="row mb-2">
          <div class="col-12">
            <label class="form-label">Subjects <small class="text-muted fw-normal">(picked manually — not from the student's record)</small></label>
            <div class="form-text" style="font-size:0.85rem">Picked manually below — not taken from the student's record.</div>
            <div id="subjectsContainer" class="ms-subject-pills form-inline d-flex flex-wrap gap-1 mb-1"></div>
          </div>
        </div>

        <div class="row mb-2">
          <div class="col-12">
            <label class="form-label" for="materialFiles">Material Files * <small class="text-muted fw-normal">(class PDFs, worksheets, resources — pick as many as you need)</small></label>
            <input type="file" id="materialFiles" class="form-control" multiple />
            <div class="form-text text-muted small mt-1">Accepted: PDF, DOCX, XLSX, PPTX, images (JPG/PNG). Max 50 MB per file.</div>
          </div>
        </div>

        <div id="pendingMaterials"></div>

        <div class="row mt-3">
          <div class="col-12">
            <button type="submit" id="msAddSubmit" class="btn btn-primary">Submit</button>
          </div>
        </div>
      </form>

      <div id="materialsTableContainer" class="ms-vm mt-3"></div>
    </div>

    <script src="/bootstrap-5.0.2/dist/js/bootstrap.bundle.min.js"></script>
    <script src="/src/components/admin/sidebar-menu/sidebar-loader.js"></script>
    <script src="/src/components/admin/2.0-design/2.0design.js"></script>
    <script type="module" src="/assist/page-boot.js" data-header="/src/components/admin/header/header.html" data-container="admin-header-container" data-undo-module="/assist/undo-manager.js"></script>
    <script type="module" src="student-materials.js"></script>
    <script src="/assist/pwa-register.js" defer></script>
    <script src="/assist/use-hostname.js" defer></script>
  </body>
  </html>
`;
