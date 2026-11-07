// Stylesheet shared by the admin and receptionist Past Papers pages.
// Both portals load the same rules, and the layout is built on the 2.0
// "Project1" design language: cream canvas, white rounded cards, soft
// borders, uppercase micro-labels and the purple #6C4DF6 accent. Dark
// mode is handled by /src/components/admin/2.0-design/2.0design.css,
// which both pages now load.
// Each portal has its own *-styles.ts wrapper that re-exports this string, so
// the build writes past-papers.css into BOTH portal folders.
// This file is deliberately NOT named *-styles.ts so the generator never
// tries to treat it as a page stylesheet of its own.
export const css = `
  /* ============================================================
     Past Papers — shared 2.0 design system
     ============================================================ */
  #main-content {
    --pp-ink: #1C1814;
    --pp-body: #4A443B;
    --pp-muted: #6B645A;
    --pp-soft: #96907F;
    --pp-line: #E8E0D3;
    --pp-line-soft: #F1EAE0;
    --pp-field: #D8CDBB;
    --pp-cream: #F2EDE3;
    --pp-paper: #FFFFFF;
    --pp-tint: #FBF9F4;
    --pp-purple: #6C4DF6;
    --pp-purple-soft: #ECE7FD;
    --pp-red: #C22A2A;
    color: var(--pp-ink);
    padding-bottom: 2.5rem;
  }

  /* ---------------- page heading ---------------- */
  .pp-page-head {
    display: flex;
    align-items: flex-start;
    gap: 0.9rem;
    margin: 0.25rem 0 1.5rem;
  }
  .pp-page-icon {
    flex: 0 0 auto;
    width: 46px;
    height: 46px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 14px;
    background: rgba(108, 77, 246, 0.1);
    color: var(--pp-purple);
    font-size: 1.35rem;
  }
  .pp-page-title {
    margin: 0 0 0.3rem;
    font-size: 1.7rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--pp-ink);
  }
  .pp-page-subtitle {
    margin: 0;
    max-width: 72ch;
    color: var(--pp-muted);
    font-size: 0.92rem;
    line-height: 1.5;
  }

  /* ---------------- form card ---------------- */
  form#pastPapersForm {
    background: var(--pp-paper);
    border: 1px solid var(--pp-line);
    border-radius: 20px;
    box-shadow: 0 2px 10px rgba(28, 24, 20, 0.06);
    margin-bottom: 2rem;
    position: relative;
    z-index: 20;
  }
  .pp-form-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid var(--pp-line-soft);
  }
  .pp-form-title {
    margin: 0;
    font-size: 1.05rem;
    font-weight: 700;
    letter-spacing: -0.01em;
    color: var(--pp-ink);
  }
  .pp-form-subtitle {
    margin: 0.2rem 0 0;
    color: var(--pp-soft);
    font-size: 0.82rem;
  }
  .pp-required-pill {
    flex: 0 0 auto;
    padding: 0.35rem 0.7rem;
    border: 1px solid var(--pp-line);
    border-radius: 999px;
    background: var(--pp-tint);
    color: var(--pp-muted);
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    white-space: nowrap;
  }
  .pp-required-pill span { color: var(--pp-red); }

  .pp-form-body { padding: 0.25rem 1.5rem 0; }
  .pp-group {
    padding: 1.35rem 0 1.5rem;
    border-bottom: 1px dashed var(--pp-line-soft);
  }
  .pp-group-last { border-bottom: 0; }
  .pp-group-head {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    margin-bottom: 1rem;
  }
  .pp-step {
    flex: 0 0 auto;
    width: 26px;
    height: 26px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: rgba(108, 77, 246, 0.1);
    color: var(--pp-purple);
    font-size: 0.78rem;
    font-weight: 700;
  }
  .pp-group-title {
    margin: 0;
    color: var(--pp-muted);
    font-size: 0.74rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }
  .pp-req { color: var(--pp-red); }

  /* ---------------- fields ---------------- */
  form#pastPapersForm .form-label {
    margin-bottom: 0.4rem;
    color: var(--pp-muted);
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.07em;
    text-transform: uppercase;
  }
  #main-content .form-control {
    background: var(--pp-paper);
    border: 1.5px solid var(--pp-field);
    border-radius: 10px;
    padding: 0.6rem 0.8rem;
    color: var(--pp-ink);
    font-size: 0.92rem;
    box-shadow: none;
  }
  #main-content .form-control:focus {
    background: var(--pp-paper);
    border-color: var(--pp-purple);
    color: var(--pp-ink);
    box-shadow: 0 0 0 3px rgba(108, 77, 246, 0.12);
  }
  #main-content .form-control::placeholder { color: #A8A192; }
  #main-content .form-control[readonly] {
    background: var(--pp-tint);
    border-color: var(--pp-line);
    color: var(--pp-muted);
  }
  .pp-help {
    margin-top: 0.4rem;
    color: var(--pp-soft);
    font-size: 0.74rem;
    line-height: 1.4;
  }
  .pp-file-input { padding: 0.42rem 0.45rem; }
  .pp-file-input::file-selector-button {
    margin-right: 0.7rem;
    padding: 0.35rem 0.8rem;
    border: 0;
    border-radius: 8px;
    background: var(--pp-purple-soft);
    color: var(--pp-purple);
    font-size: 0.8rem;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.15s ease;
  }
  .pp-file-input::file-selector-button:hover { background: #E0D8FB; }

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
    background: var(--pp-paper);
    border: 1px solid var(--pp-line);
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
    color: var(--pp-ink);
    font-size: 0.9rem;
    font-weight: 600;
    text-align: left;
    cursor: pointer;
  }
  .student-picker-item:hover {
    background: rgba(108, 77, 246, 0.08);
    color: var(--pp-purple);
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
    color: var(--pp-soft);
    font-size: 1.05rem;
    line-height: 1;
    cursor: pointer;
  }
  .student-picker-clear:hover {
    background: rgba(28, 24, 20, 0.06);
    color: var(--pp-red);
  }

  /* ---------------- grade pills ---------------- */
  .pill-container { display: flex; flex-wrap: wrap; gap: 0.45rem; }
  .grade-pill {
    display: inline-flex;
    align-items: center;
    padding: 0.4rem 0.95rem;
    border: 1.5px solid var(--pp-field);
    border-radius: 999px;
    background: var(--pp-paper);
    color: var(--pp-muted);
    font-size: 0.82rem;
    font-weight: 600;
    cursor: pointer;
    user-select: none;
    transition: border-color 0.15s ease, color 0.15s ease, background 0.15s ease;
  }
  .grade-pill:hover {
    border-color: var(--pp-purple);
    color: var(--pp-purple);
    background: var(--pp-paper);
  }
  .grade-pill.selected {
    border-color: var(--pp-purple);
    background: rgba(108, 77, 246, 0.1);
    color: var(--pp-purple);
    font-weight: 700;
    box-shadow: none;
  }

  /* ---------------- queued file chips ---------------- */
  #pendingFiles { display: flex; flex-wrap: wrap; gap: 0.5rem; }
  #pendingFiles:not(:empty) { margin-top: 0.9rem; }
  .paper-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    max-width: 100%;
    padding: 0.35rem 0.45rem 0.35rem 0.85rem;
    border: 1px solid rgba(108, 77, 246, 0.3);
    border-radius: 999px;
    background: rgba(108, 77, 246, 0.08);
    color: var(--pp-purple);
    font-size: 0.8rem;
    font-weight: 600;
  }
  .paper-chip > span:first-child {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 240px;
  }
  .paper-chip-remove {
    padding: 0.05rem 0.35rem;
    border: 0;
    border-radius: 50%;
    background: transparent;
    color: var(--pp-red);
    font-weight: 700;
    line-height: 1;
    cursor: pointer;
  }
  .paper-chip-remove:hover { background: rgba(226, 62, 62, 0.15); }

  /* ---------------- form footer ---------------- */
  .pp-form-foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0.9rem;
    padding: 1.1rem 1.5rem;
    border-top: 1px solid var(--pp-line-soft);
    border-radius: 0 0 20px 20px;
    background: var(--pp-tint);
  }
  .pp-foot-note {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    color: var(--pp-soft);
    font-size: 0.78rem;
  }
  .pp-submit {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    padding: 0.6rem 1.35rem;
    border: 0;
    border-radius: 10px;
    background: linear-gradient(135deg, #6C4DF6, #C447FF);
    color: #FFFFFF;
    font-size: 0.88rem;
    font-weight: 700;
    box-shadow: 0 10px 22px rgba(108, 77, 246, 0.28);
    transition: background 0.15s ease, box-shadow 0.15s ease, transform 0.12s ease;
  }
  .pp-submit:hover {
    background: linear-gradient(135deg, #5737E8, #B435E8);
    color: #FFFFFF;
    box-shadow: 0 14px 26px rgba(108, 77, 246, 0.34);
  }
  .pp-submit:active { transform: scale(0.98); }

  /* ---------------- list heading + search ---------------- */
  .pp-list-head {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 1rem;
    margin: 1.9rem 0 0.9rem;
  }
  .pp-list-title {
    margin: 0;
    font-size: 1.12rem;
    font-weight: 700;
    letter-spacing: -0.01em;
    color: var(--pp-ink);
  }
  .pp-list-subtitle {
    margin: 0.2rem 0 0;
    color: var(--pp-soft);
    font-size: 0.8rem;
  }
  .pp-search {
    position: relative;
    margin-bottom: 1rem;
  }
  .pp-search > i {
    position: absolute;
    top: 50%;
    left: 1rem;
    transform: translateY(-50%);
    color: var(--pp-soft);
    font-size: 0.95rem;
    pointer-events: none;
  }
  .pp-search .form-control {
    padding-left: 2.5rem;
    border-radius: 12px;
    background: var(--pp-paper);
    box-shadow: 0 2px 8px rgba(28, 24, 20, 0.04);
  }

  /* ---------------- table card ---------------- */
  #pastPapersTableContainer {
    background: var(--pp-paper);
    border: 1px solid var(--pp-line);
    border-radius: 18px;
    box-shadow: 0 2px 10px rgba(28, 24, 20, 0.06);
    padding: 0.4rem;
  }
  #pastPapersTableContainer .table {
    --bs-table-bg: transparent;
    --bs-table-color: var(--pp-ink);
    --bs-table-border-color: var(--pp-line-soft);
    margin: 0;
    border: 0;
    color: var(--pp-ink);
  }
  #pastPapersTableContainer .table > :not(caption) > * > * {
    border-width: 0 0 1px 0;
    border-color: var(--pp-line-soft);
    box-shadow: none;
  }
  #pastPapersTableContainer .table thead th {
    padding: 0.85rem 1rem;
    background: var(--pp-cream);
    border-bottom: 1px solid var(--pp-line) !important;
    color: var(--pp-muted);
    font-size: 11.5px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    white-space: nowrap;
    vertical-align: middle;
  }
  #pastPapersTableContainer .table thead th:first-child { border-top-left-radius: 13px; }
  #pastPapersTableContainer .table thead th:last-child { border-top-right-radius: 13px; }
  #pastPapersTableContainer .table tbody td {
    padding: 0.8rem 1rem;
    border-bottom: 1px solid var(--pp-line-soft) !important;
    color: var(--pp-body);
    font-size: 0.88rem;
    vertical-align: middle;
  }
  #pastPapersTableContainer .table tbody tr:last-child td { border-bottom: 0 !important; }
  #pastPapersTableContainer .table tbody tr:hover > td { background: rgba(108, 77, 246, 0.04); }
  #pastPapersTableContainer .table tbody td:first-child {
    color: var(--pp-soft);
    font-variant-numeric: tabular-nums;
  }
  #pastPapersTableContainer .table th.pp-num { text-align: right; }
  #pastPapersTableContainer .pp-student { font-weight: 650; color: var(--pp-ink); }
  #pastPapersTableContainer .pp-none { color: var(--pp-soft); }

  /* cells that open an editor */
  .editable {
    cursor: pointer;
    transition: background 0.15s ease;
  }
  .editable:hover { background: rgba(108, 77, 246, 0.07) !important; }
  .money { white-space: nowrap; text-align: right; font-variant-numeric: tabular-nums; }
  .editable .form-control { min-width: 90px; padding: 0.35rem 0.55rem; font-size: 0.85rem; }
  .table-actions { min-width: 118px; }

  /* file badge inside the table */
  .pp-file-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.25rem 0.6rem;
    border: 1px solid rgba(108, 77, 246, 0.3);
    border-radius: 999px;
    background: rgba(108, 77, 246, 0.08);
    color: var(--pp-purple);
    font-size: 0.76rem;
    font-weight: 700;
    white-space: nowrap;
  }
  .pp-file-empty {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    color: var(--pp-soft);
    font-size: 0.8rem;
    white-space: nowrap;
  }

  /* empty state */
  .pp-empty {
    padding: 3rem 1rem;
    text-align: center;
    color: var(--pp-soft);
  }
  .pp-empty i {
    display: block;
    margin-bottom: 0.6rem;
    color: var(--pp-field);
    font-size: 2rem;
  }
  .pp-empty p { margin: 0; font-size: 0.9rem; }

  /* ---------------- action buttons ---------------- */
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
    background: var(--pp-purple-soft);
    border: 1px solid transparent;
    color: var(--pp-purple);
  }
  .action-add:hover { background: #E0D8FB; color: var(--pp-purple); }

  /* ---------------- inline popups (grade / files) ---------------- */
  .grades-edit-container,
  .files-edit-container {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    z-index: 30;
    padding: 0.75rem;
    background: var(--pp-paper);
    border: 1px solid var(--pp-line);
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
  .files-edit-container { min-width: 280px; max-width: 360px; }
  .editable[data-field="gradeLevel"],
  .editable[data-field="files"] { position: relative; }
  /* The files column sits near the right edge — open its panel leftwards so
     it stays inside the table instead of overflowing the page. */
  .editable[data-field="files"] .files-edit-container { left: auto; right: 0; }

  .paper-file-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.3rem 0;
  }
  .paper-file-row + .paper-file-row { border-top: 1px solid var(--pp-line-soft); }
  .paper-file-link {
    flex: 1;
    overflow: hidden;
    color: var(--pp-purple);
    font-size: 0.85rem;
    font-weight: 600;
    text-decoration: none;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .paper-file-link:hover { text-decoration: underline; }
  .paper-file-size { font-size: 0.72rem; white-space: nowrap; }
  .paper-file-remove {
    padding: 0.05rem 0.35rem;
    border: 0;
    border-radius: 50%;
    background: transparent;
    color: var(--pp-red);
    font-weight: 700;
    line-height: 1;
    cursor: pointer;
  }
  .paper-file-remove:hover { background: rgba(226, 62, 62, 0.15); }

  /* ---------------- responsive ---------------- */
  @media (max-width: 767.98px) {
    #main-content {
      margin-left: 0 !important;
      max-width: 100vw !important;
      padding: 0.75rem 0.85rem 2rem !important;
    }
    .pp-page-title { font-size: 1.45rem; }
    .pp-page-icon { width: 40px; height: 40px; font-size: 1.15rem; border-radius: 12px; }
    .pp-form-head { padding: 1rem 1.1rem; }
    .pp-form-body { padding: 0 1.1rem; }
    .pp-group { padding: 1.1rem 0 1.25rem; }
    .pp-form-foot { padding: 1rem 1.1rem; }
    .pp-submit { width: 100%; justify-content: center; }
    .pp-foot-note { order: 2; }
    #pastPapersTableContainer { padding: 0.25rem; }
  }
`;
