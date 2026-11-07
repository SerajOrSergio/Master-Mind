// Auto-generated from student-materials.css — styles verbatim; the
// build (scripts/generate-pages.mjs) writes student-materials.css from this.
export const css = `
  /* ============================================================
     Student Materials — 2.0 (Project1) design
     Shared by the admin and receptionist portals. Dark mode is
     owned by /src/components/admin/2.0-design/2.0design.css, so
     this file only defines the base look and never overrides it
     with glassmorphism colours.
     ============================================================ */
  #main-content {
    --sm-ink: #1C1814;
    --sm-body: #4A443B;
    --sm-muted: #6B645A;
    --sm-soft: #96907F;
    --sm-line: #E8E0D3;
    --sm-line-soft: #F1EAE0;
    --sm-field: #D8CDBB;
    --sm-cream: #F2EDE3;
    --sm-paper: #FFFFFF;
    --sm-tint: #FBF9F4;
    --sm-purple: #6C4DF6;
    --sm-purple-soft: #ECE7FD;
    --sm-red: #C22A2A;
    padding-bottom: 2.5rem;
  }
  #main-content h2 {
    margin-bottom: 0.35rem;
    color: var(--sm-ink);
    font-weight: 700;
    letter-spacing: -0.02em;
  }
  .ms-header { margin-bottom: 0.25rem; }

  /* ---------------- view switcher (Table / Shelf) ---------------- */
  #viewSwitcher.view-toggle {
    display: inline-flex;
    gap: 3px;
    padding: 4px;
    border: 1px solid var(--sm-line);
    border-radius: 14px;
    background: var(--sm-cream);
    box-shadow: none;
    overflow: visible;
  }
  #viewSwitcher .btn {
    border: 0;
    border-radius: 10px;
    padding: 0.45rem 1.2rem;
    background: transparent;
    color: var(--sm-muted);
    font-size: 0.85rem;
    font-weight: 600;
    line-height: 1.3;
    transition: background 0.15s ease, color 0.15s ease, box-shadow 0.15s ease;
  }
  #viewSwitcher .btn:hover {
    background: rgba(108, 77, 246, 0.1);
    color: var(--sm-purple);
  }
  #viewSwitcher .btn.active {
    background: linear-gradient(135deg, #6C4DF6, #C447FF);
    color: #FFFFFF;
    font-weight: 700;
    box-shadow: 0 6px 14px rgba(108, 77, 246, 0.28);
  }

  /* ---------------- add-entry form ---------------- */
  form#studentMaterialsForm {
    background: var(--sm-paper);
    border: 1px solid var(--sm-line);
    border-radius: 18px;
    padding: 1.5rem;
    box-shadow: 0 2px 10px rgba(28, 24, 20, 0.06);
    margin-bottom: 1.75rem;
  }
  form#studentMaterialsForm h3 {
    margin-bottom: 1.1rem !important;
    color: var(--sm-ink);
    font-size: 1.02rem;
    font-weight: 700;
    letter-spacing: -0.01em;
  }
  form#studentMaterialsForm .form-label {
    margin-bottom: 0.35rem;
    color: var(--sm-muted);
    font-weight: 600;
  }
  form#studentMaterialsForm .form-text { color: var(--sm-soft); }

  #main-content .form-control {
    background: var(--sm-paper);
    border: 1.5px solid var(--sm-field);
    border-radius: 10px;
    padding: 0.55rem 0.8rem;
    color: var(--sm-ink);
    font-size: 0.92rem;
    box-shadow: none;
  }
  #main-content .form-control:focus {
    background: var(--sm-paper);
    border-color: var(--sm-purple);
    color: var(--sm-ink);
    box-shadow: 0 0 0 3px rgba(108, 77, 246, 0.12);
  }
  #main-content .form-control::placeholder { color: #A8A192; }
  #main-content .form-control[readonly] {
    background: var(--sm-tint);
    border-color: var(--sm-line);
    color: var(--sm-muted);
  }
  #materialFiles.form-control { padding: 0.42rem 0.45rem; }
  #materialFiles.form-control::file-selector-button {
    margin-right: 0.7rem;
    padding: 0.35rem 0.8rem;
    border: 0;
    border-radius: 8px;
    background: var(--sm-purple-soft);
    color: var(--sm-purple);
    font-size: 0.8rem;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.15s ease;
  }
  #materialFiles.form-control::file-selector-button:hover { background: #E0D8FB; }
  form#studentMaterialsForm .btn-primary {
    padding: 0.6rem 1.35rem;
    border: 0;
    border-radius: 10px;
    background: linear-gradient(135deg, #6C4DF6, #C447FF);
    color: #FFFFFF;
    font-size: 0.88rem;
    font-weight: 700;
    box-shadow: 0 10px 22px rgba(108, 77, 246, 0.28);
    transition: background 0.15s ease, box-shadow 0.15s ease;
  }
  form#studentMaterialsForm .btn-primary:hover {
    background: linear-gradient(135deg, #5737E8, #B435E8);
    box-shadow: 0 14px 26px rgba(108, 77, 246, 0.34);
  }

  /* ---------------- student picker ---------------- */
  .student-picker { position: relative; }
  .student-picker-list {
    position: absolute;
    top: calc(100% + 6px);
    left: 0;
    right: 0;
    z-index: 1050;
    max-height: 264px;
    overflow-y: auto;
    padding: 0.35rem;
    background: var(--sm-paper);
    border: 1px solid var(--sm-line);
    border-radius: 12px;
    box-shadow: 0 18px 40px rgba(28, 24, 20, 0.16);
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .student-picker-item {
    display: block;
    width: 100%;
    padding: 0.5rem 0.75rem;
    border: 0;
    border-radius: 8px;
    background: transparent;
    color: var(--sm-ink);
    font-size: 0.9rem;
    font-weight: 600;
    text-align: left;
    cursor: pointer;
  }
  .student-picker-item:hover {
    background: rgba(108, 77, 246, 0.08);
    color: var(--sm-purple);
  }
  .student-picker-empty { padding: 0.5rem 0.75rem; }
  .student-picker-clear {
    position: absolute;
    top: 50%;
    right: 0.55rem;
    transform: translateY(-50%);
    z-index: 1051;
    padding: 0.1rem 0.4rem;
    border: 0;
    border-radius: 50%;
    background: transparent;
    color: var(--sm-soft);
    font-size: 1.05rem;
    line-height: 1;
    cursor: pointer;
  }
  .student-picker-clear:hover {
    background: rgba(28, 24, 20, 0.06);
    color: var(--sm-red);
  }

  /* ---------------- queued file chips ---------------- */
  #pendingMaterials { display: flex; flex-wrap: wrap; gap: 0.5rem; }
  #pendingMaterials:not(:empty) { margin-top: 0.9rem; }
  .material-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    max-width: 100%;
    padding: 0.35rem 0.45rem 0.35rem 0.85rem;
    border: 1px solid rgba(108, 77, 246, 0.3);
    border-radius: 999px;
    background: rgba(108, 77, 246, 0.08);
    color: var(--sm-purple);
    font-size: 0.8rem;
    font-weight: 600;
  }
  .material-chip > span:first-child {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 240px;
  }
  .material-remove-btn {
    padding: 0.05rem 0.35rem;
    border: 0;
    border-radius: 50%;
    background: transparent;
    color: var(--sm-red);
    font-weight: 700;
    line-height: 1;
    cursor: pointer;
  }
  .material-remove-btn:hover { background: rgba(226, 62, 62, 0.15); }

  /* ---------------- grade + subject pills ---------------- */
  .grades-row,
  .subjects-row {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  .grades-row > label,
  .subjects-row > label { font-weight: 600; }
  .grades-container,
  .pill-container,
  .ms-grade-pills,
  .ms-subject-pills { display: flex; flex-wrap: wrap; gap: 0.45rem; }
  .grade-pill {
    display: inline-flex;
    align-items: center;
    padding: 0.4rem 0.95rem;
    border: 1.5px solid var(--sm-field);
    border-radius: 999px;
    background: var(--sm-paper);
    color: var(--sm-muted);
    font-size: 0.82rem;
    font-weight: 600;
    cursor: pointer;
    user-select: none;
    transition: border-color 0.15s ease, color 0.15s ease, background 0.15s ease;
  }
  .grade-pill:hover {
    border-color: var(--sm-purple);
    color: var(--sm-purple);
    background: var(--sm-paper);
  }
  .grade-pill.selected {
    border-color: var(--sm-purple);
    background: rgba(108, 77, 246, 0.1);
    color: var(--sm-purple);
    font-weight: 700;
    box-shadow: none;
  }
  .subject-chip {
    display: inline-flex;
    align-items: center;
    padding: 0.3rem 0.8rem;
    border: 1.5px solid var(--sm-field);
    border-radius: 999px;
    background: var(--sm-paper);
    color: var(--sm-muted);
    font-size: 0.8rem;
    font-weight: 600;
  }

  /* ---------------- table card ---------------- */
  #materialsTableContainer {
    background: var(--sm-paper);
    border: 1px solid var(--sm-line);
    border-radius: 18px;
    box-shadow: 0 2px 10px rgba(28, 24, 20, 0.06);
    padding: 0.4rem;
  }
  #materialsTableContainer .table {
    --bs-table-bg: transparent;
    --bs-table-color: var(--sm-ink);
    margin: 0;
    border: 0;
    color: var(--sm-ink);
  }
  #materialsTableContainer .table > :not(caption) > * > * {
    border-width: 0 0 1px 0;
    border-color: var(--sm-line-soft);
    box-shadow: none;
  }
  .table thead th {
    padding: 0.85rem 1rem;
    background: var(--sm-cream);
    border-bottom: 1px solid var(--sm-line) !important;
    color: var(--sm-muted);
    font-size: 11.5px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    white-space: nowrap;
    vertical-align: middle;
  }
  .table thead th:first-child { border-top-left-radius: 13px; }
  .table thead th:last-child { border-top-right-radius: 13px; }
  .table tbody td {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--sm-line-soft) !important;
    color: var(--sm-body);
    font-size: 0.88rem;
    vertical-align: middle;
  }
  .table tbody tr:last-child td { border-bottom: 0 !important; }
  .table tbody tr:hover > td { background: rgba(108, 77, 246, 0.04); }
  #materialsTableContainer td[data-field="studentName"] {
    color: var(--sm-ink);
    font-weight: 650;
  }
  #materialsTableContainer td[data-field="gradeLevel"] {
    color: var(--sm-purple);
    font-weight: 650;
  }
  .editable { cursor: pointer; transition: background 0.15s ease; }
  .editable:hover { background: rgba(108, 77, 246, 0.07) !important; }
  .materials-cell { max-width: 340px; }
  .materials-cell .text-muted { font-style: italic; }

  /* small chips used inside the table */
  .ms-subject-chip {
    display: inline-flex;
    align-items: center;
    padding: 0.2rem 0.6rem;
    margin: 0 0.25rem 0.25rem 0;
    border: 1px solid rgba(108, 77, 246, 0.25);
    border-radius: 999px;
    background: rgba(108, 77, 246, 0.08);
    color: var(--sm-purple);
    font-size: 0.75rem;
    font-weight: 600;
  }
  .ms-file-count {
    display: inline-flex;
    align-items: center;
    padding: 0.15rem 0.6rem;
    margin-right: 0.35rem;
    border-radius: 999px;
    background: var(--sm-purple);
    color: #FFFFFF;
    font-size: 0.7rem;
    font-weight: 700;
  }
  .ms-file-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    max-width: 220px;
    padding: 0.2rem 0.6rem;
    margin: 0 0.25rem 0.25rem 0;
    border: 1px solid rgba(108, 77, 246, 0.25);
    border-radius: 8px;
    background: rgba(108, 77, 246, 0.06);
    color: var(--sm-purple);
    font-size: 0.75rem;
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .ms-file-chip .bi { color: var(--sm-purple); }

  /* ---------------- actions ---------------- */
  .table-actions { min-width: 130px; }
  .actions-stack { display: flex; flex-direction: column; gap: 6px; }
  .action-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 0.4rem 0.9rem;
    border-radius: 9px;
    font-size: 0.8rem;
    font-weight: 700;
    white-space: nowrap;
    box-shadow: none;
    transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease, transform 0.12s ease;
  }
  .action-btn:active { transform: scale(0.97); }
  .action-delete {
    background: #FBE3E3;
    border: 1px solid #E8A3A3;
    color: #C22A2A;
  }
  .action-delete:hover {
    background: #F6CDCD;
    border-color: #D97A7A;
    color: #A11E1E;
  }
  .action-add {
    background: var(--sm-purple-soft);
    border: 1px solid transparent;
    color: var(--sm-purple);
  }
  .action-add:hover { background: #E0D8FB; color: var(--sm-purple); }

  /* ---------------- inline popups ---------------- */
  .grades-edit-container,
  .materials-edit-container {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    z-index: 30;
    padding: 0.75rem;
    background: var(--sm-paper);
    border: 1px solid var(--sm-line);
    border-radius: 14px;
    box-shadow: 0 18px 40px rgba(28, 24, 20, 0.16);
  }
  .grades-edit-container {
    min-width: 210px;
    max-width: 340px;
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem;
  }
  .materials-edit-container { min-width: 280px; max-width: 360px; }
  .editable[data-field="gradeLevel"],
  .editable[data-field="materials"] { position: relative; }
  .editable[data-field="materials"] .materials-edit-container { left: auto; right: 0; }
  .materials-file-list {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    max-height: 240px;
    overflow-y: auto;
  }
  .material-file-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.3rem 0;
  }
  .material-file-row + .material-file-row { border-top: 1px solid var(--sm-line-soft); }
  .material-file-link {
    flex: 1;
    overflow: hidden;
    color: var(--sm-purple);
    font-size: 0.85rem;
    font-weight: 600;
    text-decoration: none;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .material-file-link:hover { text-decoration: underline; }
  .material-file-size { font-size: 0.72rem; white-space: nowrap; }

  /* ---------------- shelf view ---------------- */
  .shelf-section { margin-bottom: 2rem; }
  .shelf-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.9rem;
    padding: 0.6rem 1rem;
    border: 1px solid var(--sm-line);
    border-radius: 12px;
    background: var(--sm-tint);
  }
  .shelf-header .bi-collection { color: var(--sm-purple); font-size: 1.05rem; }
  .shelf-name {
    color: var(--sm-ink);
    font-size: 1rem;
    font-weight: 700;
  }
  .shelf-count-pill {
    margin-left: auto;
    padding: 0.15rem 0.7rem;
    border-radius: 999px;
    background: var(--sm-purple);
    color: #FFFFFF;
    font-size: 0.75rem;
    font-weight: 700;
  }
  .shelf-row {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }
  .book-card {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 240px;
    padding: 0.9rem 1rem;
    background: var(--sm-paper);
    border: 1px solid var(--sm-line);
    border-left: 5px solid var(--sm-purple);
    border-radius: 16px;
    box-shadow: 0 2px 8px rgba(28, 24, 20, 0.05);
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }
  .book-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 24px rgba(28, 24, 20, 0.12);
  }
  .book-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 0.5rem;
  }
  .book-grade-badge {
    display: inline-block;
    max-width: 170px;
    padding: 0.2rem 0.7rem;
    border-radius: 999px;
    background: rgba(108, 77, 246, 0.1);
    color: var(--sm-purple);
    font-size: 0.75rem;
    font-weight: 700;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .book-delete-btn {
    padding: 0.2rem 0.45rem;
    border: 1px solid #E8A3A3;
    border-radius: 8px;
    background: #FBE3E3;
    color: #C22A2A;
    line-height: 1;
  }
  .book-delete-btn:hover { background: #F6CDCD; }
  .book-student {
    color: var(--sm-ink);
    font-size: 1rem;
    font-weight: 700;
  }
  .book-meta { font-size: 0.8rem; }
  .book-subjects { display: flex; flex-wrap: wrap; gap: 0.35rem; }
  .book-files { display: flex; flex-direction: column; gap: 0.35rem; }
  .book-file-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    max-width: 100%;
    padding: 0.3rem 0.5rem 0.3rem 0.7rem;
    border-radius: 999px;
    background: rgba(108, 77, 246, 0.08);
    color: var(--sm-purple);
    font-size: 0.8rem;
    font-weight: 600;
    text-decoration: none;
  }
  .book-file-chip:hover {
    background: rgba(108, 77, 246, 0.16);
    color: var(--sm-purple);
  }
  .book-file-chip > span {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .book-add-row { margin-top: auto; }

  /* ---------------- responsive ---------------- */
  @media (max-width: 768px) {
    #subjectsContainer {
      display: flex !important;
      flex-wrap: wrap;
      gap: 6px;
    }
    #subjectsContainer .grade-pill { display: inline-block !important; }
    #main-content {
      margin-left: 0 !important;
      max-width: 100vw !important;
      padding: 0.75rem 0.85rem 2rem !important;
    }
    form#studentMaterialsForm { padding: 1.1rem; }
    #materialsTableContainer { padding: 0.25rem; }
    #viewSwitcher .btn { flex: 1; padding: 0.45rem 0.8rem; }
    .book-card { width: 100%; }
  }
`;
export const cssFile = 'student-materials.css';
