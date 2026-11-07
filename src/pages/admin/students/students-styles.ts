// Auto-generated from students.css — styles verbatim; the
// build (scripts/generate-pages.mjs) writes students.css from this.
export const css = `
  @media (min-width: 992px) {
    .table-students th, .table-students td {
      white-space: normal !important;
      word-break: break-word;
    }
    .table-students td:nth-child(2), .table-students th:nth-child(2) { /* Name */
      max-width: 110px;
    }
    .table-students td:nth-child(3), .table-students th:nth-child(3) { /* Subjects */
      max-width: 90px;
    }
    .table-students td:nth-child(8), .table-students th:nth-child(8) { /* Notes */
      max-width: 80px;
    }
    .table-students td:nth-child(9), .table-students th:nth-child(9),
    .table-students td:nth-child(10), .table-students th:nth-child(10),
    .table-students td:nth-child(11), .table-students th:nth-child(11) {
      max-width: 80px;
    }
    .table-students td:last-child, .table-students th:last-child { /* Actions */
      max-width: 50px;
      text-align: center;
    }
    .table-responsive {
      overflow-x: auto;
      width: 100%;
    }
  }
  @media (max-width: 991.98px) {
    .table-students td:nth-child(2), .table-students th:nth-child(2) { /* Name column */
      max-width: 90px;
      white-space: normal !important;
      word-break: break-word;
    }
  }
  @media (max-width: 991.98px) {
    #main-content {
      margin-left: 0 !important;
      max-width: 100vw !important;
      padding-left: 0.75rem !important;
      padding-right: 0.75rem !important;
    }
    #sidebar-container {
      position: static !important;
      width: 100vw !important;
      min-width: 0 !important;
    }
  }
  /* Pills for subjects and grades */
  .pill-container {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }
  .subject-pill, .grade-pill {
    display: inline-block;
    padding: 0.35em 1em;
    border-radius: 999px;
    background: #f1f3f4;
    color: #333;
    font-weight: 500;
    cursor: pointer;
    border: 1px solid #d1d5db;
    transition: background 0.2s, color 0.2s, border 0.2s;
    user-select: none;
  }
  .subject-pill.selected, .grade-pill.selected {
    background: linear-gradient(90deg, #0d6efd 0%, #0dcaf0 100%);
    color: #fff;
    border: 1px solid #0d6efd;
  }
  .subject-pill:hover, .grade-pill:hover {
    background: #e3e9ff;
    color: #0d6efd;
  }
  
  /* Inline editing containers */
  .subjects-edit-container, .grades-edit-container {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    min-width: 180px;
    background: #f8f9fa;
    border-radius: 0.5rem;
    padding: 0.3rem 0.5rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    z-index: 10;
  }
  /* Students Page Styles */
  .table-students th, .table-students td {
    vertical-align: middle;
    font-size: 1rem;
  }
  #studentsTableContainer {
    margin-top: 1.5rem;
  }
  
  .table-students {
    background: #fff;
    border-radius: 0.7rem;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  }
  .table-students thead th {
    background: #f8fafc;
    font-weight: 600;
    color: #222;
    position: sticky;
    top: 0;
    z-index: 2;
  }
  
  /* Placeholder style for empty table cells */
  .table-students td.placeholder {
    color: #b0b0b0;
    font-style: italic;
    background: #f6f6fa !important;
    border-left: 4px solid #e0e0e0;
    position: relative;
    opacity: 0.7;
  }
  .table-students td.placeholder::before {
    content: '\\f07b'; /* FontAwesome fa-folder-open as a subtle icon, fallback to dash if not loaded */
    font-family: 'FontAwesome', 'Arial', sans-serif;
    font-size: 0.9em;
    margin-right: 0.4em;
    color: #d0d0d0;
    vertical-align: middle;
    display: inline-block;
  }
  .table-students tbody tr:hover {
    background: #f1f5ff;
  }
  .table-responsive {
    border-radius: 0.7rem;
    overflow-x: auto;
  }
  
  @media (max-width: 991.98px) {
    .table-students th, .table-students td {
      font-size: 0.85rem;
      padding: 0.35rem 0.2rem;
      white-space: normal !important;
      word-break: break-word;
      max-width: 120px;
    }
    .table-students th {
      min-width: 70px;
    }
    .table-responsive {
      border-radius: 0.3rem;
      overflow-x: auto;
    }
  }
  
  #addStudentBtn {
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    font-weight: 500;
  }
  
  .modal-content {
    border-radius: 1rem;
    box-shadow: 0 4px 32px rgba(0,0,0,0.12);
  }
  
  .modal-title {
    font-weight: 600;
    color: #0d6efd;
  }
  
  .form-label {
    font-weight: 500;
  }
  
  .btn-info {
    color: #fff;
    background: linear-gradient(90deg, #0dcaf0 0%, #0d6efd 100%);
    border: none;
  }
  .btn-info:hover {
    background: linear-gradient(90deg, #0d6efd 0%, #0dcaf0 100%);
  }
  
  .btn-danger {
    background: linear-gradient(90deg, #dc3545 0%, #fd7e14 100%);
    border: none;
  }
  .btn-danger:hover {
    background: linear-gradient(90deg, #fd7e14 0%, #dc3545 100%);
  }
  
  @media (max-width: 768px) {
    .modal-lg {
      max-width: 98vw;
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
  
  body.dark-mode.gradient-glassmorphism .text-muted {
    color: rgba(255, 255, 255, 0.5) !important;
  }
  
  body.dark-mode.gradient-glassmorphism .form-control {
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }
  
  body.dark-mode.gradient-glassmorphism .form-control:focus {
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(150, 100, 255, 0.5);
    color: rgba(255, 255, 255, 0.95);
    box-shadow: 0 0 15px rgba(150, 100, 255, 0.3);
  }
  
  body.dark-mode.gradient-glassmorphism .subject-pill,
  body.dark-mode.gradient-glassmorphism .grade-pill {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: rgba(255, 255, 255, 0.85);
  }
  
  body.dark-mode.gradient-glassmorphism .subject-pill.selected,
  body.dark-mode.gradient-glassmorphism .grade-pill.selected {
    background: linear-gradient(135deg, rgba(100, 100, 255, 0.4), rgba(150, 50, 255, 0.4));
    border-color: rgba(150, 100, 255, 0.5);
    color: #fff;
  }
  
  body.dark-mode.gradient-glassmorphism .subjects-edit-container,
  body.dark-mode.gradient-glassmorphism .grades-edit-container {
    background: rgba(30, 30, 50, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  }
  
  body.dark-mode.gradient-glassmorphism .table-students {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }
  
  body.dark-mode.gradient-glassmorphism .table-students thead th {
    background: linear-gradient(135deg, rgba(100, 100, 255, 0.15), rgba(150, 50, 255, 0.15));
    border-bottom: 1px solid rgba(255, 255, 255, 0.15);
    color: rgba(255, 255, 255, 0.95);
  }
  
  body.dark-mode.gradient-glassmorphism .table-students td {
    color: rgba(255, 255, 255, 0.85);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }
  
  body.dark-mode.gradient-glassmorphism .table-students tbody tr:hover {
    background: rgba(255, 255, 255, 0.08);
  }
  
  body.dark-mode.gradient-glassmorphism .btn-primary {
    background: linear-gradient(135deg, rgba(100, 100, 255, 0.4), rgba(150, 50, 255, 0.4));
    border: 1px solid rgba(150, 100, 255, 0.5);
    color: #fff;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }
  
  body.dark-mode.gradient-glassmorphism .btn-primary:hover {
    background: linear-gradient(135deg, rgba(100, 100, 255, 0.6), rgba(150, 50, 255, 0.6));
    box-shadow: 0 4px 20px rgba(150, 100, 255, 0.4);
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
`;
export const cssFile = 'students.css';
