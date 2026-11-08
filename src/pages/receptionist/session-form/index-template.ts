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
    <title>Session Form | Receptionist Portal</title>
  
    <!-- Bootstrap + Icons -->
    <link href="/bootstrap-5.0.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" rel="stylesheet" media="print" onload="this.media='all'">
  
    <!-- Choices -->
    <link href="https://cdn.jsdelivr.net/npm/choices.js/public/assets/styles/choices.min.css" rel="stylesheet" media="print" onload="this.media='all'">
  
    <!-- Sidebar + Custom -->
    <link rel="stylesheet" href="/src/components/receptionist/sidebar-menu/sidebar.css">
    <link rel="stylesheet" href="/src/pages/receptionist/session-form/session-form.css">
  
    <style>
      /* FIX: responsive content spacing */
      #main-content {
        margin-left: 250px;
      }
  
      @media (max-width: 768px) {
        #main-content {
          margin-left: 0;
        }
      }
    </style>
    <link rel="stylesheet" href="/src/components/receptionist/header/header.css">
  </head>
  
  <body>
  
  <!-- Sidebar + Header -->
  <div id="sidebar-container"></div>
  <div id="receptionist-header-container"></div>
  
  <!-- MAIN -->
  <div class="container-fluid px-0" id="main-content">
    <div class="session-form-wrapper">
      <div class="session-card">
        <div class="page-title">Session Form</div>
        <div class="page-subtitle">Quickly add and manage student attendance</div>
  
        <!-- Teacher row (dynamic selector) -->
        <div class="form-grid">
          <div class="input-field">
            <label class="form-label fw-semibold">Teacher</label>
            <select id="teacherSelectorDropdown" class="form-select">
              <option value="">Select...</option>
            </select>
          </div>
          <div class="input-field relative" id="datePickerContainer">
            <label class="form-label fw-semibold">Date</label>
            <input type="date" class="form-control" id="dateButton" placeholder="dd/mm/yyyy" autocomplete="off" required />
          </div>
        </div>
  
        <!-- School Name -->
        <div class="mb-3">
          <label class="form-label fw-semibold">School Name</label>
          <input type="text" class="form-control" id="schoolNameInput" placeholder="School name" value="Lincoln High School">
        </div>
  
        <!-- Grade Chips -->
        <div class="choice-row">
          <span class="choice-label">Grade:</span>
          <div class="choice-wrap" id="gradeChipsContainer"></div>
        </div>
  
        <!-- Time Window (EditableTimeChips replica) -->
        <div class="choice-row">
          <span class="choice-label">Time Window:</span>
          <div class="choice-wrap" id="timeSlotsContainer"></div>
        </div>
  
        <!-- Subject Chips -->
        <div class="choice-row">
          <span class="choice-label">Subject:</span>
          <div class="choice-wrap" id="subjectChipsContainer"></div>
        </div>
  
        <!-- Classroom Chips (with colors) -->
        <div class="choice-row">
          <span class="choice-label">Classroom:</span>
          <div class="classroom-tabs" id="classroomContainer"></div>
        </div>
  
        <!-- Tutoring Type -->
        <div class="choice-row">
          <span class="choice-label">Type:</span>
          <div class="choice-wrap" id="typeContainer"></div>
        </div>
  
        <!-- Create New Student Section -->
        <div class="mb-4 create-student-section" id="createStudentSection">
          <div class="create-student-heading"><i class="bi bi-person-plus"></i> Create New Student</div>
          <div class="row g-2 align-items-center">
            <div class="col-md-9"><input type="text" class="form-control" id="newStudentName" placeholder="Full Name"></div>
            <div class="col-md-3"><button class="btn create-student-btn w-100" id="createStudentBtn"><i class="bi bi-plus-lg"></i> Create Student</button></div>
          </div>
          <div id="newStudentMsg" class="mt-2 small"></div>
        </div>
  
        <!-- Add Student by Typing + Quick List -->
        <div class="d-flex flex-wrap gap-2 align-items-end mb-3">
          <div class="flex-grow-1">
            <input type="text" class="form-control" id="studentDraftInput" placeholder="Student Name">
          </div>
          <button class="btn btn-outline-primary" id="addStudentTypedBtn">Add Student</button>
        </div>
  
        <div class="choice-row" style="flex-direction: column; align-items: flex-start; gap: 0.5rem;">
          <div id="quickStudentMsgTop" class="mt-2 small"></div>
          <div style="display: flex; gap: 0.5rem; align-items: center; width: 100%;">
            <input type="text" class="form-control" id="quickStudentSearchInput" placeholder="Search student name..." style="max-width: 300px;">
            <button class="btn btn-outline-primary" id="quickStudentSearchBtn">Search</button>
          </div>
          <span class="choice-label" id="quickLabel">All Students (quick add):</span>
          <div class="choice-wrap" id="quickStudentsList"></div>
          <div id="quickStudentMsg" class="mt-2 small"></div>
        </div>
  
        <!-- Save Attendance Button (moved above student cards, now left-aligned) -->
        <div id="attendanceStatusMsg" class="mb-2"></div>
        <div class="d-flex justify-content-start mb-3">
          <button class="btn btn-success" id="saveAttendanceTopBtn">Save Attendance</button>
        </div>
  
        <!-- Selected Students List (cards) -->
        <div id="studentsListContainer" class="mt-3"></div>
        <div id="formStatusMsg" class="mt-3"></div>
      </div>
    </div>
  
        <!-- Selected Students -->
        <div id="studentsListContainer" class="mb-3"></div>
  
        <!-- Actions -->
        <div class="d-flex flex-wrap gap-2">
          <button id="saveDraftBtn" class="btn btn-secondary">Save Draft</button>
          <button id="openDraftsBtn" class="btn btn-info">Open Drafts</button>
          <button id="submitAttendanceBtn" class="btn btn-primary">Submit</button>
          <button id="markAbsenceBtn" class="btn btn-warning">Mark Absence</button>
        </div>
  
        <!-- Messages -->
        <div id="formStatusMsg" class="mt-3"></div>
  
      </div>
    </div>
  </div>
  
  <!-- Scripts -->
  <script src="/bootstrap-5.0.2/dist/js/bootstrap.bundle.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/choices.js/public/assets/scripts/choices.min.js"></script>
  
  <script src="/src/components/receptionist/sidebar-menu/sidebar-loader.js"></script>
  <script type="module" src="/src/pages/receptionist/session-form/session-form.js"></script>
  
  <!-- Header Loader -->
  <script type="module" src="/assist/page-boot.js" data-header="/src/components/receptionist/header/header.html" data-container="receptionist-header-container" data-undo-module="/assist/undo-manager.js"></script>
  
    <script src="/assist/pwa-register.js" defer></script>
    <script src="/assist/use-hostname.js" defer></script>
  </body>
  </html>
`;
