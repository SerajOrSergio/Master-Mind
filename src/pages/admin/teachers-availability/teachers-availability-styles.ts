// Auto-generated from teachers-availability.css — styles verbatim; the
// build (scripts/generate-pages.mjs) writes teachers-availability.css from this.
export const css = `
  /* --- Fix mobile table horizontal scroll for teacher availability admin page --- */
  .table-responsive {
    overflow-x: auto !important;
    -webkit-overflow-scrolling: touch;
    width: 100%;
  }
  
  .availabilitiesTable {
    min-width: 900px;
    width: max-content;
  }
  
  @media (max-width: 767.98px) {
    .table-responsive {
      margin-bottom: 1rem;
      border-radius: 0.5rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    }
    .availabilitiesTable {
      min-width: 700px;
      width: max-content;
    }
  }
  /* Show mobile labels only on xs screens */
  .mobile-label {
    font-size: 0.95rem;
    color: #495057;
    margin-bottom: 0.1rem;
  }
  @media (min-width: 576px) {
    .mobile-label {
      display: none !important;
    }
  }
  /* Ensure date/time inputs are always visible and styled */
  input[type="date"], input[type="time"] {
    background: #f8f9fa !important;
    color: #212529 !important;
    border: 1px solid #ced4da !important;
    min-height: 38px;
  }
  input[type="date"]::placeholder, input[type="time"]::placeholder {
    color: #6c757d;
    opacity: 1;
  }
  @media (max-width: 767.98px) {
    input[type="date"], input[type="time"] {
      width: 100% !important;
      min-width: 0;
      font-size: 1rem;
    }
  }
  /* Style date/time placeholders for native pickers */
  input[type="date"]:empty:before {
    content: attr(placeholder);
    color: #6c757d;
  }
  input[type="time"]:empty:before {
    content: attr(placeholder);
    color: #6c757d;
  }
  /* Style period and time side by side */
  #dateInput, #timeInput, #periodSelect {
    display: block;
    width: 100%;
    margin: 0;
    border-radius: 0.375rem;
  }
  #timeInput, #periodSelect {
    margin-right: 0;
  }
  /* teachers-availability.css */
  body {
    background: #f8f9fa;
  }
  
  #main-content {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    padding: 2rem 2rem 1rem 2rem;
  }
  
  .table {
    background: #fff;
  }
  
  .table thead th {
    background: #f1f5f9;
    font-weight: 600;
  }
  
  #availabilitiesContainer .card {
    margin-bottom: 1rem;
    position: relative;
    z-index: 1;
  }
  #availabilitiesContainer .card .card-body {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    position: relative;
    z-index: 1;
  }
  #availabilitiesContainer .card .info {
    flex: 1 1 60%;
    min-width: 200px;
  }
  #availabilitiesContainer .card .actions {
    flex: 0 0 auto;
    display: flex;
    gap: 0.5rem;
  }
  
  /* Responsive margin for main content */
  @media (min-width: 768px) {
    #main-content {
      margin-left: 260px;
      max-width: calc(100% - 260px);
    }
  }
  
  @media (max-width: 767.98px) {
    #main-content {
      margin-left: 0 !important;
      max-width: 100vw !important;
      padding: 1rem 0.5rem;
    }
    #availabilitiesContainer .card .card-body {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }
    #availabilitiesContainer .card .actions {
      width: 100%;
      justify-content: flex-end;
    }
  }
  
  /* ================= DARK MODE - GRADIENT GLASSMORPHISM ================= */
  body.dark-mode.gradient-glassmorphism {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%);
    min-height: 100vh;
    color: rgba(255, 255, 255, 0.9);
  }
  
  body.dark-mode.gradient-glassmorphism #main-content {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    padding: 2rem;
    /* no margin here: the old \`margin: 1rem\` shorthand wiped the base
       sidebar offset, pushing content under the fixed 250px sidebar */
  }
  
  body.dark-mode.gradient-glassmorphism h2 {
    color: rgba(255, 255, 255, 0.95);
    text-shadow: 0 0 20px rgba(150, 100, 255, 0.3);
  }
  
  body.dark-mode.gradient-glassmorphism .form-control,
  body.dark-mode.gradient-glassmorphism .form-select {
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }
  
  body.dark-mode.gradient-glassmorphism .table,
  body.dark-mode.gradient-glassmorphism .availabilitiesTable {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }
  
  body.dark-mode.gradient-glassmorphism .form-control:focus,
  body.dark-mode.gradient-glassmorphism .form-select:focus {
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(150, 100, 255, 0.5);
    color: rgba(255, 255, 255, 0.95);
    box-shadow: 0 0 15px rgba(150, 100, 255, 0.3);
  }
  
  body.dark-mode.gradient-glassmorphism .form-label {
    color: rgba(255, 255, 255, 0.85);
  }
  
  body.dark-mode.gradient-glassmorphism .table thead th {
    background: linear-gradient(135deg, rgba(100, 100, 255, 0.15), rgba(150, 50, 255, 0.15));
    border-bottom: 1px solid rgba(255, 255, 255, 0.15);
    color: rgba(255, 255, 255, 0.95);
  }
  
  body.dark-mode.gradient-glassmorphism .table tbody tr {
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    color: rgba(255, 255, 255, 0.85);
    background: rgba(255, 255, 255, 0.02);
  }
  
  body.dark-mode.gradient-glassmorphism .table tbody tr:hover {
    background: rgba(255, 255, 255, 0.08);
  }
  
  body.dark-mode.gradient-glassmorphism .table td {
    background: transparent;
    color: rgba(255, 255, 255, 0.85);
  }
  
  body.dark-mode.gradient-glassmorphism .btn-success {
    background: linear-gradient(135deg, rgba(50, 200, 100, 0.4), rgba(30, 150, 80, 0.4));
    border: 1px solid rgba(50, 200, 100, 0.5);
    color: #fff;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }
  
  body.dark-mode.gradient-glassmorphism .btn-success:hover {
    background: linear-gradient(135deg, rgba(50, 200, 100, 0.6), rgba(30, 150, 80, 0.6));
    box-shadow: 0 4px 20px rgba(50, 200, 100, 0.4);
  }
  
  body.dark-mode.gradient-glassmorphism .btn-danger {
    background: linear-gradient(135deg, rgba(255, 80, 80, 0.4), rgba(200, 50, 50, 0.4));
    border: 1px solid rgba(255, 80, 80, 0.5);
    color: #fff;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }
  
  body.dark-mode.gradient-glassmorphism .btn-danger:hover {
    background: linear-gradient(135deg, rgba(255, 80, 80, 0.6), rgba(200, 50, 50, 0.6));
    box-shadow: 0 4px 20px rgba(255, 80, 80, 0.4);
  }
  
  body.dark-mode.gradient-glassmorphism .card {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.05);
  }
  
  body.dark-mode.gradient-glassmorphism .card-body {
    color: rgba(255, 255, 255, 0.9);
  }
  
  /* Inline editing dropdowns */
  .form-select-sm {
    background: #fff;
    border: 1px solid #ced4da;
    color: #212529;
  }
  
  body.dark-mode.gradient-glassmorphism .form-select-sm {
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: rgba(255, 255, 255, 0.9);
  }
  
  body.dark-mode.gradient-glassmorphism input[type="date"],
  body.dark-mode.gradient-glassmorphism input[type="time"] {
    background: rgba(255, 255, 255, 0.08) !important;
    border: 1px solid rgba(255, 255, 255, 0.15) !important;
    color: rgba(255, 255, 255, 0.9) !important;
  }
  
  /* Choices.js dropdown styling */
  .choices__inner {
    background: #fff;
    border: 1px solid #ced4da;
    color: #212529;
    min-height: 38px;
  }
  
  .choices__list--dropdown {
    background: #fff;
    border: 1px solid #ced4da;
    color: #212529;
    z-index: 999999;
    position: absolute;
    max-height: 300px;
    overflow-y: auto;
    margin-top: 4px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  .choices__item--selectable {
    color: #212529;
    padding: 8px 12px;
  }
  
  .choices__item--selectable.is-highlighted {
    background: #0d6efd;
    color: #fff;
  }
  
  /* Dark mode for Choices.js dropdowns */
  body.dark-mode.gradient-glassmorphism .choices__inner {
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: rgba(255, 255, 255, 0.9);
  }
  
  body.dark-mode.gradient-glassmorphism .choices__list--dropdown {
    background: rgba(30, 30, 50, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    z-index: 999999;
  }
  
  body.dark-mode.gradient-glassmorphism .choices__item--selectable {
    color: rgba(255, 255, 255, 0.9);
  }
  
  body.dark-mode.gradient-glassmorphism .choices__item--selectable.is-highlighted {
    background: rgba(100, 100, 255, 0.4);
    color: #fff;
  }
  
  /* Ensure subject select uses same styling as teacher select */
  #subjectSelect .choices__inner,
  #teacherSelect .choices__inner {
    background: #fff;
    border: 1px solid #ced4da;
    color: #212529;
    min-height: 38px;
  }
  
  body.dark-mode.gradient-glassmorphism #subjectSelect .choices__inner,
  body.dark-mode.gradient-glassmorphism #teacherSelect .choices__inner {
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: rgba(255, 255, 255, 0.9);
  }
  
  /* The Choices.js search/filter input (rendered inline inside .choices__inner
     for multi-select fields like Select Subject) has its own default
     background that was not themed, causing it to stay white in dark mode
     while the single-select Select Teacher field (which hides its input)
     looked correctly themed. Style it to match the surrounding control. */
  .choices__input {
    background-color: #fff;
    color: #212529;
  }
  
  .choices__input::placeholder {
    color: #6c757d;
    opacity: 1;
  }
  
  body.dark-mode.gradient-glassmorphism .choices__input {
    background-color: rgba(255, 255, 255, 0.08) !important;
    color: rgba(255, 255, 255, 0.9) !important;
  }
  
  body.dark-mode.gradient-glassmorphism .choices__input::placeholder {
    color: rgba(255, 255, 255, 0.6) !important;
    opacity: 1;
  }
`;
export const cssFile = 'teachers-availability.css';
