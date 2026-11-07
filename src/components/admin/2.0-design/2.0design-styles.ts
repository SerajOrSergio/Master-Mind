// Auto-generated from 2.0design.css — styles verbatim; the
// build (scripts/generate-pages.mjs) writes 2.0design.css from this.
export const css = `
  /* ============================================================
     MASTERMIND — Admin · Project1 Theme (dark mode)
     When dark mode is ON the admin uses the professional theme of
     the Project1 e-commerce store: a cream canvas, white rounded
     panels/cards/tables and the purple accent (#6C4DF6).
  
     Every rule is scoped to body.dark-mode.gradient-glassmorphism
     so light mode is completely untouched. This file is injected
     after the page stylesheets (see 2.0design.js), so its
     equal-specificity rules win over each page's old glassmorphism
     dark-mode block.
     ============================================================ */
  
  /* ---------------- canvas ---------------- */
  body.dark-mode.gradient-glassmorphism {
    background: #F2EDE3;
    min-height: 100vh;
    color: #1C1814;
    color-scheme: light;
  }
  
  body.dark-mode.gradient-glassmorphism h1,
  body.dark-mode.gradient-glassmorphism h2,
  body.dark-mode.gradient-glassmorphism h3,
  body.dark-mode.gradient-glassmorphism h4,
  body.dark-mode.gradient-glassmorphism h5,
  body.dark-mode.gradient-glassmorphism .page-title {
    color: #1C1814;
    text-shadow: none;
  }
  
  body.dark-mode.gradient-glassmorphism .text-muted { color: #96907F !important; }
  
  /* ---------------- content containers ---------------- */
  body.dark-mode.gradient-glassmorphism #main-content {
    background: #FFFFFF !important;
    border: 1px solid #E8E0D3;
    border-radius: 18px;
    box-shadow: 0 2px 10px rgba(28, 24, 20, 0.06);
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }
  
  body.dark-mode.gradient-glassmorphism .main-content-container {
    background: transparent;
    border: 0;
    border-radius: 0;
    box-shadow: none;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    margin: 0 auto;
    padding-left: 20px;
    padding-right: 20px;
  }
  
  body.dark-mode.gradient-glassmorphism #topics-form-section,
  body.dark-mode.gradient-glassmorphism #topics-list-section {
    background: #FFFFFF;
    border: 1px solid #E8E0D3;
    border-radius: 18px;
    box-shadow: 0 2px 10px rgba(28, 24, 20, 0.06);
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }
  
  /* ---------------- Teachers page ----------------
     The teachers form (#teacherForm) and table container
     (#teachersTableContainer) each carry their own card background, border
     and shadow — and, on the admin page, an old glassmorphism box. Nested
     inside the single #main-content card they render as messy stacked boxes
     with dark halos around the edges. Flatten them so the teachers page
     matches the clean Teachers-Availability layout: one bordered card with
     flat form + table inside. */
  body.dark-mode.gradient-glassmorphism form#teacherForm,
  body.dark-mode.gradient-glassmorphism #teachersTableContainer {
    background: transparent;
    border: 0;
    border-radius: 0;
    box-shadow: none;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    padding: 0;
  }
  
  /* ---------------- cards ---------------- */
  body.dark-mode.gradient-glassmorphism .card {
    background: #FFFFFF;
    border: 1px solid #E8E0D3;
    border-radius: 18px;
    box-shadow: 0 2px 10px rgba(28, 24, 20, 0.06);
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }
  
  body.dark-mode.gradient-glassmorphism .card-header {
    background: #F2EDE3;
    border-bottom: 1px solid #E8E0D3;
    color: #1C1814;
    border-radius: 18px 18px 0 0 !important;
  }
  
  body.dark-mode.gradient-glassmorphism .card-body {
    color: #1C1814;
    background: #FFFFFF;
  }
  
  body.dark-mode.gradient-glassmorphism .card-title {
    color: #6B645A;
    font-weight: 650;
  }
  
  body.dark-mode.gradient-glassmorphism .card-text { color: #1C1814; }
  
  body.dark-mode.gradient-glassmorphism .card-topic { background: #FFFFFF; }
  
  /* ---------------- tables ---------------- */
  body.dark-mode.gradient-glassmorphism .table {
    --bs-table-bg: #FFFFFF;
    --bs-table-color: #1C1814;
    background: #FFFFFF;
    border: 1px solid #E8E0D3;
    color: #1C1814;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }
  
  body.dark-mode.gradient-glassmorphism .table thead th,
  body.dark-mode.gradient-glassmorphism .table th {
    background: #F2EDE3;
    border-bottom: 1px solid #E8E0D3;
    color: #6B645A;
    font-size: 11.5px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
  
  body.dark-mode.gradient-glassmorphism .table td {
    background: #FFFFFF;
    color: #1C1814;
    border-bottom: 1px solid #E8E0D3;
  }
  
  body.dark-mode.gradient-glassmorphism .table tbody tr {
    background: #FFFFFF;
    color: #1C1814;
    border-bottom: 1px solid #E8E0D3;
  }
  
  body.dark-mode.gradient-glassmorphism .table tbody tr:hover {
    background: rgba(108, 77, 246, 0.06);
  }
  
  body.dark-mode.gradient-glassmorphism .table-striped tbody tr:nth-of-type(odd) {
    background: #FBF9F4;
  }
  
  /* ---------------- forms ---------------- */
  body.dark-mode.gradient-glassmorphism .form-control,
  body.dark-mode.gradient-glassmorphism .form-select,
  body.dark-mode.gradient-glassmorphism .form-select-sm {
    background: #FFFFFF;
    border: 1.5px solid #D8CDBB;
    color: #1C1814;
    border-radius: 10px;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }
  
  body.dark-mode.gradient-glassmorphism .form-control:focus,
  body.dark-mode.gradient-glassmorphism .form-select:focus {
    background: #FFFFFF;
    border-color: #6C4DF6;
    color: #1C1814;
    box-shadow: 0 0 0 3px rgba(108, 77, 246, 0.12);
  }
  
  body.dark-mode.gradient-glassmorphism .form-control::placeholder { color: #96907F; }
  
  body.dark-mode.gradient-glassmorphism .form-label {
    color: #1C1814;
    font-weight: 600;
  }
  
  body.dark-mode.gradient-glassmorphism .form-check-input:checked {
    background-color: #6C4DF6;
    border-color: #6C4DF6;
  }
  
  body.dark-mode.gradient-glassmorphism .form-check-label { color: #1C1814; }
  
  body.dark-mode.gradient-glassmorphism .input-group-text {
    background: #F2EDE3;
    border-color: #D8CDBB;
    color: #6B645A;
  }
  
  /* date / time pickers */
  body.dark-mode.gradient-glassmorphism input[type="date"],
  body.dark-mode.gradient-glassmorphism input[type="time"] {
    background: #FFFFFF !important;
    border: 1.5px solid #D8CDBB !important;
    color: #1C1814 !important;
    color-scheme: light;
  }
  
  body.dark-mode.gradient-glassmorphism input[type="date"]::-webkit-datetime-edit,
  body.dark-mode.gradient-glassmorphism input[type="time"]::-webkit-datetime-edit {
    background: #FFFFFF;
    color: #1C1814;
  }
  
  /* ---------------- buttons ---------------- */
  body.dark-mode.gradient-glassmorphism .btn-primary {
    background: linear-gradient(135deg, #6C4DF6, #C447FF);
    border: 0;
    color: #FFFFFF;
    box-shadow: 0 14px 30px rgba(108, 77, 246, 0.32);
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    border-radius: 10px;
    font-weight: 650;
  }
  
  body.dark-mode.gradient-glassmorphism .btn-primary:hover {
    background: linear-gradient(135deg, #5737E8, #B435E8);
    box-shadow: 0 18px 36px rgba(108, 77, 246, 0.4);
  }
  
  body.dark-mode.gradient-glassmorphism .btn-success {
    background: #2E9E5B;
    border: 0;
    color: #FFFFFF;
    border-radius: 10px;
    font-weight: 650;
  }
  
  body.dark-mode.gradient-glassmorphism .btn-success:hover {
    background: #278A4F;
    box-shadow: 0 12px 26px rgba(46, 158, 91, 0.35);
  }
  
  body.dark-mode.gradient-glassmorphism .btn-danger {
    background: #E23E3E;
    border: 0;
    color: #FFFFFF;
    border-radius: 10px;
    font-weight: 650;
  }
  
  body.dark-mode.gradient-glassmorphism .btn-danger:hover {
    background: #C93232;
    box-shadow: 0 12px 26px rgba(226, 62, 62, 0.35);
  }
  
  body.dark-mode.gradient-glassmorphism .btn-info {
    background: #4F8FF7;
    border: 0;
    color: #FFFFFF;
    border-radius: 10px;
    font-weight: 650;
  }
  
  body.dark-mode.gradient-glassmorphism .btn-info:hover { background: #3D7BE0; }
  
  body.dark-mode.gradient-glassmorphism .btn-light {
    background: #FFFFFF;
    border: 1px solid #D8CDBB;
    color: #1C1814;
    border-radius: 10px;
  }
  
  body.dark-mode.gradient-glassmorphism .btn-light:hover { background: #F2EDE3; }
  
  body.dark-mode.gradient-glassmorphism .btn-outline-primary {
    color: #6C4DF6;
    border-color: #6C4DF6;
  }
  
  body.dark-mode.gradient-glassmorphism .btn-outline-primary:hover {
    background: #6C4DF6;
    color: #FFFFFF;
    border-color: #6C4DF6;
  }
  
  /* ---------------- pricing category tabs (Standard / KG - KG6) ---------------- */
  body.dark-mode.gradient-glassmorphism .tab-btn {
    background: #FFFFFF;
    border: 1.5px solid #D8CDBB;
    color: #6B645A;
    border-radius: 10px;
    font-weight: 600;
    padding: 10px 24px;
    transition: all 0.2s ease;
  }
  
  body.dark-mode.gradient-glassmorphism .tab-btn:hover {
    border-color: #6C4DF6;
    color: #6C4DF6;
  }
  
  body.dark-mode.gradient-glassmorphism .tab-btn.active {
    background: rgba(108, 77, 246, 0.1);
    border-color: #6C4DF6;
    color: #6C4DF6;
    font-weight: 700;
    box-shadow: none;
  }
  
  /* ---------------- alerts ---------------- */
  body.dark-mode.gradient-glassmorphism .alert {
    background: #FFFFFF;
    border: 1px solid #E8E0D3;
    color: #1C1814;
    border-radius: 12px;
  }
  
  body.dark-mode.gradient-glassmorphism .alert-info {
    background: rgba(79, 143, 247, 0.1);
    border-color: rgba(79, 143, 247, 0.3);
    color: #274E8A;
  }
  
  body.dark-mode.gradient-glassmorphism .alert-success {
    background: rgba(46, 158, 91, 0.1);
    border-color: rgba(46, 158, 91, 0.3);
    color: #1E6E3E;
  }
  
  body.dark-mode.gradient-glassmorphism .alert-danger {
    background: rgba(226, 62, 62, 0.08);
    border-color: rgba(226, 62, 62, 0.3);
    color: #A32626;
  }
  
  /* ---------------- text colours ---------------- */
  body.dark-mode.gradient-glassmorphism .text-primary { color: #6C4DF6 !important; }
  body.dark-mode.gradient-glassmorphism .text-success { color: #2E9E5B !important; }
  body.dark-mode.gradient-glassmorphism .text-warning { color: #E8A33D !important; }
  body.dark-mode.gradient-glassmorphism .text-info { color: #4F8FF7 !important; }
  body.dark-mode.gradient-glassmorphism .text-danger { color: #E23E3E !important; }
  
  /* ---------------- list groups ---------------- */
  body.dark-mode.gradient-glassmorphism .list-group-item {
    background: #FFFFFF;
    border-color: #E8E0D3;
    color: #1C1814;
  }
  
  body.dark-mode.gradient-glassmorphism .list-group-item:hover {
    background: #FBF9F4;
  }
  
  /* ---------------- pills (subjects / grades) ---------------- */
  body.dark-mode.gradient-glassmorphism .subject-pill,
  body.dark-mode.gradient-glassmorphism .grade-pill {
    background: #FFFFFF;
    border: 1.5px solid #D8CDBB;
    color: #6B645A;
  }
  
  body.dark-mode.gradient-glassmorphism .subject-pill.selected,
  body.dark-mode.gradient-glassmorphism .grade-pill.selected {
    background: rgba(108, 77, 246, 0.1);
    border-color: #6C4DF6;
    color: #6C4DF6;
  }
  
  body.dark-mode.gradient-glassmorphism .subjects-edit-container,
  body.dark-mode.gradient-glassmorphism .grades-edit-container {
    background: #FBF9F4;
    border-color: #E8E0D3;
  }
  
  /* ---------------- Choices.js dropdowns ---------------- */
  body.dark-mode.gradient-glassmorphism .choices__inner {
    background: #FFFFFF;
    border: 1.5px solid #D8CDBB;
    color: #1C1814;
    border-radius: 10px;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }
  
  body.dark-mode.gradient-glassmorphism .choices__list--dropdown {
    background: #FFFFFF;
    border: 1px solid #E8E0D3;
    color: #1C1814;
    border-radius: 12px;
    box-shadow: 0 14px 34px rgba(28, 24, 20, 0.14);
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }
  
  body.dark-mode.gradient-glassmorphism .choices__item--selectable { color: #1C1814; }
  
  body.dark-mode.gradient-glassmorphism .choices__item--selectable.is-highlighted {
    background: rgba(108, 77, 246, 0.1);
    color: #6C4DF6;
  }
  
  body.dark-mode.gradient-glassmorphism .choices__input {
    background-color: #FFFFFF !important;
    color: #1C1814 !important;
  }
  
  body.dark-mode.gradient-glassmorphism .choices__input::placeholder {
    color: #96907F !important;
  }
  
  /* ---------------- modal ---------------- */
  body.dark-mode.gradient-glassmorphism .modal-content {
    background: #FFFFFF;
    border: 1px solid #E8E0D3;
    border-radius: 18px;
    color: #1C1814;
  }
  
  body.dark-mode.gradient-glassmorphism .modal-header,
  body.dark-mode.gradient-glassmorphism .modal-footer {
    border-color: #E8E0D3;
  }
  
  body.dark-mode.gradient-glassmorphism .modal-title { color: #1C1814; }
  
  /* ---------------- misc ---------------- */
  body.dark-mode.gradient-glassmorphism .border,
  body.dark-mode.gradient-glassmorphism .border-top,
  body.dark-mode.gradient-glassmorphism .border-bottom,
  body.dark-mode.gradient-glassmorphism .border.rounded.bg-light {
    border-color: #E8E0D3 !important;
  }
  
  body.dark-mode.gradient-glassmorphism .bg-light { background-color: #F2EDE3 !important; }
  /* keep Bootstrap .bg-white surfaces white in dark mode, EXCEPT the admin
     sidebar (it carries .bg-white but must stay dark — see sidebar.css) */
  body.dark-mode.gradient-glassmorphism .bg-white:not(.sidebar) { background-color: #FFFFFF !important; }
  
  body.dark-mode.gradient-glassmorphism .badge.bg-primary { background-color: #6C4DF6 !important; }
  
  body.dark-mode.gradient-glassmorphism ::-webkit-scrollbar-track { background: #F2EDE3; }
  body.dark-mode.gradient-glassmorphism ::-webkit-scrollbar-thumb { background: #D8CDBB; }
  
  body.dark-mode.gradient-glassmorphism .bg-primary { background-color: #6C4DF6 !important; }
  
  /* ============================================================
     Payments · Partial · Paid · Unpaid — custom components
     (the old glassmorphism block styles these with translucent
     white + white text, which vanishes on the cream canvas)
     ============================================================ */
  body.dark-mode.gradient-glassmorphism .payments-wrapper {
    background: transparent;
    border: 0;
    box-shadow: none;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    margin: 32px auto;
  }
  
  body.dark-mode.gradient-glassmorphism .payment-card {
    background: #FFFFFF;
    border: 1px solid #E8E0D3;
    border-radius: 18px;
    box-shadow: 0 2px 10px rgba(28, 24, 20, 0.06);
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }
  
  body.dark-mode.gradient-glassmorphism .payments-filter-card {
    background: #FFFFFF;
    border: 1px solid #E8E0D3;
    border-radius: 16px;
    box-shadow: 0 2px 10px rgba(28, 24, 20, 0.06);
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }
  
  body.dark-mode.gradient-glassmorphism .payment-card-title {
    color: #1C1814;
    font-family: 'Fraunces', serif;
    font-weight: 650;
  }
  
  body.dark-mode.gradient-glassmorphism .payment-card-details {
    color: #6B645A;
  }
  
  body.dark-mode.gradient-glassmorphism .payment-card-table {
    background: #FFFFFF;
    border: 1px solid #E8E0D3;
    border-radius: 12px;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }
  
  body.dark-mode.gradient-glassmorphism .payment-card-table th {
    background: #F2EDE3;
    border-bottom: 1px solid #E8E0D3;
    color: #6B645A;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
  
  body.dark-mode.gradient-glassmorphism .payment-card-table td {
    color: #1C1814;
    border-bottom: 1px solid #E8E0D3;
  }
  
  body.dark-mode.gradient-glassmorphism .status-paid {
    background: #E7F4EB;
    color: #1E7A48;
  }
  
  body.dark-mode.gradient-glassmorphism .status-partial {
    background: #FDF1DC;
    color: #9A6700;
  }
  
  body.dark-mode.gradient-glassmorphism .status-unpaid {
    background: #FBE3E3;
    color: #C22A2A;
  }
  
  body.dark-mode.gradient-glassmorphism .edit-btn {
    background: #ECE7FD;
    color: #6C4DF6;
  }
  
  body.dark-mode.gradient-glassmorphism .delete-btn {
    background: #FBE3E3;
    color: #C22A2A;
  }
  
  body.dark-mode.gradient-glassmorphism .hide-btn {
    color: #6C4DF6;
  }
  
  body.dark-mode.gradient-glassmorphism .teacher-profit-summary {
    background: #FBF9F4 !important;
    border-color: #E8E0D3 !important;
    color: #1C1814;
    box-shadow: 0 2px 8px rgba(28, 24, 20, 0.06) !important;
  }
  
  body.dark-mode.gradient-glassmorphism .payment-card-table td.missing-cell { color: #C22A2A; }
  
  /* ============================================================
     Session Form · Teacher Absence — custom components
     ============================================================ */
  body.dark-mode.gradient-glassmorphism .session-form-wrapper {
    background: transparent;
  }
  
  body.dark-mode.gradient-glassmorphism .page-subtitle {
    color: #6B645A;
    border-left-color: #6C4DF6;
    text-shadow: none;
  }
  
  body.dark-mode.gradient-glassmorphism .choice-label { color: #6B645A; }
  
  body.dark-mode.gradient-glassmorphism .choice-chip,
  body.dark-mode.gradient-glassmorphism .classroom-tab,
  body.dark-mode.gradient-glassmorphism .time-chip-editable {
    background: #FFFFFF;
    border: 1.5px solid #D8CDBB;
    color: #6B645A;
  }
  
  body.dark-mode.gradient-glassmorphism .choice-chip:hover,
  body.dark-mode.gradient-glassmorphism .classroom-tab:hover,
  body.dark-mode.gradient-glassmorphism .time-chip-editable:hover {
    border-color: #6C4DF6;
    color: #6C4DF6;
  }
  
  body.dark-mode.gradient-glassmorphism .choice-chip-active,
  body.dark-mode.gradient-glassmorphism .classroom-tab-active,
  body.dark-mode.gradient-glassmorphism .time-chip-editable.selected {
    background: rgba(108, 77, 246, 0.1);
    border-color: #6C4DF6;
    color: #6C4DF6;
    font-weight: 600;
    box-shadow: none;
  }
  
  body.dark-mode.gradient-glassmorphism .classroom-color-dot { border-color: #6B645A; }
  
  body.dark-mode.gradient-glassmorphism .edit-time-icon { color: #6B645A; }
  body.dark-mode.gradient-glassmorphism .edit-time-icon:hover { color: #6C4DF6; }
  
  body.dark-mode.gradient-glassmorphism .student-session-row {
    background: #FFFFFF;
    border: 1px solid #E8E0D3;
    border-radius: 18px;
    box-shadow: 0 2px 10px rgba(28, 24, 20, 0.06);
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }
  
  body.dark-mode.gradient-glassmorphism .mode-btn {
    background: #F2EDE3;
    color: #1C1814;
    border-color: transparent;
  }
  
  body.dark-mode.gradient-glassmorphism .mode-btn-leaving {
    background: #FBE3E3;
    color: #C22A2A;
    border-color: transparent;
  }
  
  body.dark-mode.gradient-glassmorphism .mode-btn-draft {
    background: #E5F0FE;
    color: #1D5FA8;
    border-color: transparent;
  }
  
  body.dark-mode.gradient-glassmorphism .mode-btn-absent {
    background: #FBE3E3;
    color: #C22A2A;
    border-color: transparent;
  }
  
  body.dark-mode.gradient-glassmorphism .mode-btn-absent:hover {
    background: #F6D1D1;
    border-color: #C22A2A;
  }
  
  body.dark-mode.gradient-glassmorphism .small-chip {
    background: #FFFFFF;
    border: 1px solid #D8CDBB;
    color: #6B645A;
  }
  
  body.dark-mode.gradient-glassmorphism .small-chip.selected {
    background: #6C4DF6;
    border-color: #6C4DF6;
    color: #FFFFFF;
  }
  
  body.dark-mode.gradient-glassmorphism .quick-student-btn {
    background: #ECE7FD;
    color: #6C4DF6;
  }
  
  body.dark-mode.gradient-glassmorphism .quick-student-btn:hover { background: #E0D8FB; }
  
  body.dark-mode.gradient-glassmorphism .calendar-popup {
    background: #FFFFFF;
    border: 1px solid #E8E0D3;
    color: #1C1814;
    box-shadow: 0 12px 30px rgba(28, 24, 20, 0.12);
  }
  
  body.dark-mode.gradient-glassmorphism .calendar-cell-active {
    background: #6C4DF6;
    color: #FFFFFF;
  }
  
  body.dark-mode.gradient-glassmorphism #dateButton[type="date"] {
    background: #FFFFFF !important;
    border: 1.5px solid #D8CDBB !important;
    color: #1C1814 !important;
  }
  
  /* Session Form · student card — name row + subscription pill */
  body.dark-mode.gradient-glassmorphism .student-name-row {
    align-items: center;
  }
  
  body.dark-mode.gradient-glassmorphism .sub-badge-ok {
    background: #E7F4EB;
    color: #1E7A48;
  }
  
  body.dark-mode.gradient-glassmorphism .sub-badge-none {
    background: #FDF1DC;
    color: #9A6700;
  }
  
  /* Session Form · action buttons (Save to Draft / Remove) */
  body.dark-mode.gradient-glassmorphism .save-draft-btn {
    background: #ECE7FD;
    color: #6C4DF6;
    border: none;
  }
  
  body.dark-mode.gradient-glassmorphism .save-draft-btn:hover {
    background: #E0D8FB;
    box-shadow: 0 4px 12px rgba(108, 77, 246, 0.2);
  }
  
  body.dark-mode.gradient-glassmorphism .remove-student {
    background: #FBE3E3;
    color: #C22A2A;
    border: none;
  }
  
  body.dark-mode.gradient-glassmorphism .remove-student:hover {
    background: #C22A2A;
    color: #FFFFFF;
  }
  
  /* Session Form · Create New Student section — same card language as the
     student rows, with the soft purple pill button instead of the heavy
     gradient primary so it blends with the rest of the form. */
  body.dark-mode.gradient-glassmorphism #createStudentSection {
    background: #FFFFFF;
    border: 1px solid #E8E0D3;
    border-radius: 18px;
    box-shadow: 0 2px 10px rgba(28, 24, 20, 0.06);
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }
  
  body.dark-mode.gradient-glassmorphism #createStudentSection .create-student-heading {
    color: #1C1814;
  }
  
  body.dark-mode.gradient-glassmorphism #createStudentSection .create-student-heading i {
    color: #6C4DF6;
  }
  
  body.dark-mode.gradient-glassmorphism #createStudentSection .create-student-btn {
    background: #ECE7FD;
    color: #6C4DF6;
    border: none;
  }
  
  body.dark-mode.gradient-glassmorphism #createStudentSection .create-student-btn:hover {
    background: #E0D8FB;
    box-shadow: 0 4px 12px rgba(108, 77, 246, 0.2);
  }
  
  /* ============================================================
     Student Absence Logs — filter card + organized log cards
     ============================================================ */
  body.dark-mode.gradient-glassmorphism .absence-filter-card {
    background: #FFFFFF;
    border: 1px solid #E8E0D3;
    border-radius: 16px;
    box-shadow: 0 2px 10px rgba(28, 24, 20, 0.06);
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }
  
  body.dark-mode.gradient-glassmorphism .absence-log-card {
    background: #FFFFFF;
    border: 1px solid #E8E0D3;
    border-radius: 18px;
    box-shadow: 0 2px 10px rgba(28, 24, 20, 0.06);
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }
  
  body.dark-mode.gradient-glassmorphism .absence-subject-icon {
    background: rgba(108, 77, 246, 0.1);
    color: #6C4DF6;
  }
  
  body.dark-mode.gradient-glassmorphism .absence-subject-name { color: #1C1814; }
  
  body.dark-mode.gradient-glassmorphism .absence-count-pill {
    background: #FBE3E3;
    color: #C22A2A;
  }
  
  body.dark-mode.gradient-glassmorphism .absence-meta-item {
    background: #FBF9F4;
    border-color: #E8E0D3;
  }
  
  body.dark-mode.gradient-glassmorphism .absence-meta-label { color: #96907F; }
  
  body.dark-mode.gradient-glassmorphism .absence-meta-value { color: #1C1814; }
  
  body.dark-mode.gradient-glassmorphism .absence-duration { color: #6B645A; }
  
  body.dark-mode.gradient-glassmorphism .absence-students-heading { color: #1C1814; }
  
  body.dark-mode.gradient-glassmorphism .absence-student-row {
    background: #FFFFFF;
    border: 1px solid #E8E0D3;
  }
  
  body.dark-mode.gradient-glassmorphism .absence-student-row:hover {
    border-color: #6C4DF6;
    box-shadow: 0 2px 8px rgba(108, 77, 246, 0.12);
  }
  
  body.dark-mode.gradient-glassmorphism .absence-student-name { color: #1C1814; }
  
  /* ============================================================
     Create page — custom components
     ============================================================ */
  body.dark-mode.gradient-glassmorphism .page-icon {
    background: rgba(108, 77, 246, 0.1);
    color: #6C4DF6;
  }
  
  body.dark-mode.gradient-glassmorphism .drag-handle { color: #96907F; }
  body.dark-mode.gradient-glassmorphism .drag-handle:hover { color: #6C4DF6; }
  
  body.dark-mode.gradient-glassmorphism .list-group-item.dragging {
    background: rgba(108, 77, 246, 0.08);
    border: 2px dashed #6C4DF6;
    opacity: 0.6;
  }
  
  /* ============================================================
     Study Clicks · Student Materials — flatten like the teachers
     page so the form + table sit as one clean card on the cream
     canvas instead of stacked glassmorphism boxes
     ============================================================ */
  body.dark-mode.gradient-glassmorphism form#studyClicksForm,
  body.dark-mode.gradient-glassmorphism #studyClicksTableContainer,
  body.dark-mode.gradient-glassmorphism form#studentMaterialsForm,
  body.dark-mode.gradient-glassmorphism #materialsTableContainer {
    background: transparent;
    border: 0;
    border-radius: 0;
    box-shadow: none;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    padding: 0;
  }
  
  /* quick-add student pills → white bordered pills like subject/grade pills */
  body.dark-mode.gradient-glassmorphism .quick-students .student-pill {
    background: #FFFFFF;
    border: 1.5px solid #D8CDBB;
    color: #6B645A;
  }
  
  body.dark-mode.gradient-glassmorphism .quick-students .student-pill:hover {
    background: #FFFFFF;
    border-color: #6C4DF6;
    color: #6C4DF6;
    box-shadow: none;
  }
  
  /* student picker dropdown → white panel, purple hover */
  body.dark-mode.gradient-glassmorphism .student-picker-list {
    background: #FFFFFF;
    border: 1px solid #E8E0D3;
    border-radius: 12px;
    box-shadow: 0 14px 34px rgba(28, 24, 20, 0.14);
  }
  
  body.dark-mode.gradient-glassmorphism .student-picker-item {
    background: transparent;
    color: #1C1814;
  }
  
  body.dark-mode.gradient-glassmorphism .student-picker-item:hover {
    background: rgba(108, 77, 246, 0.08);
    color: #6C4DF6;
  }
  
  body.dark-mode.gradient-glassmorphism .student-picker-clear:hover {
    background: rgba(28, 24, 20, 0.06);
    color: #C22A2A;
  }
  
  /* material chips + files popup + add button → Project1 accents */
  body.dark-mode.gradient-glassmorphism .material-chip {
    background: rgba(108, 77, 246, 0.1);
    border: 1px solid rgba(108, 77, 246, 0.3);
    color: #6C4DF6;
  }
  
  body.dark-mode.gradient-glassmorphism .materials-edit-container {
    background: #FBF9F4;
    border: 1px solid #E8E0D3;
    box-shadow: 0 12px 30px rgba(28, 24, 20, 0.14);
  }
  
  body.dark-mode.gradient-glassmorphism .material-file-link {
    color: #6C4DF6;
  }
  
  body.dark-mode.gradient-glassmorphism .material-file-size { color: #96907F !important; }
  
  body.dark-mode.gradient-glassmorphism .action-add {
    background: #ECE7FD;
    border: 0;
    color: #6C4DF6;
  }
  
  body.dark-mode.gradient-glassmorphism .action-add:hover {
    background: #E0D8FB;
    box-shadow: 0 3px 10px rgba(108, 77, 246, 0.2);
  }
  
  /* ---------------- Student Materials · shelf view + toolbar ---------------- */
  body.dark-mode.gradient-glassmorphism .subject-chip {
    background: #FFFFFF;
    border: 1.5px solid #D8CDBB;
    color: #6B645A;
  }
  
  body.dark-mode.gradient-glassmorphism .view-toggle {
    background: #FFFFFF;
    border: 1px solid #E8E0D3;
  }
  
  body.dark-mode.gradient-glassmorphism .view-toggle .btn {
    color: #6B645A;
    background: transparent;
  }
  
  body.dark-mode.gradient-glassmorphism .view-toggle .btn + .btn { border-left: 1px solid #E8E0D3; }
  
  body.dark-mode.gradient-glassmorphism .view-toggle .btn.active {
    background: #6C4DF6;
    color: #FFFFFF;
  }
  
  body.dark-mode.gradient-glassmorphism .materials-search input {
    background: #FFFFFF;
    border: 1px solid #E8E0D3;
    color: #1C1814;
  }
  
  body.dark-mode.gradient-glassmorphism .materials-search input:focus {
    border-color: #6C4DF6;
    box-shadow: 0 0 0 3px rgba(108, 77, 246, 0.15);
  }
  
  body.dark-mode.gradient-glassmorphism .shelf-header {
    background: #FFFFFF;
    border: 1px solid #E8E0D3;
  }
  
  body.dark-mode.gradient-glassmorphism .shelf-header .bi-collection { color: #6C4DF6; }
  
  body.dark-mode.gradient-glassmorphism .shelf-name { color: #1C1814; }
  
  body.dark-mode.gradient-glassmorphism .shelf-count-pill {
    background: #6C4DF6;
    color: #FFFFFF;
  }
  
  body.dark-mode.gradient-glassmorphism .book-card {
    background: #FFFFFF;
    border: 1px solid #E8E0D3;
    border-left: 6px solid #6C4DF6;
    box-shadow: 0 2px 8px rgba(28, 24, 20, 0.05);
  }
  
  body.dark-mode.gradient-glassmorphism .book-card:hover {
    background: #FFFFFF;
    box-shadow: 0 10px 24px rgba(28, 24, 20, 0.12);
    transform: translateY(-3px);
  }
  
  body.dark-mode.gradient-glassmorphism .book-student { color: #1C1814; }
  
  body.dark-mode.gradient-glassmorphism .book-grade-badge {
    background: rgba(108, 77, 246, 0.1);
    color: #6C4DF6;
  }
  
  body.dark-mode.gradient-glassmorphism .book-delete-btn {
    background: #FBE3E3;
    border: 1px solid #E8A3A3;
    color: #C22A2A;
  }
  
  body.dark-mode.gradient-glassmorphism .book-delete-btn:hover { background: #F6CDCD; }
  
  body.dark-mode.gradient-glassmorphism .book-file-chip {
    background: rgba(108, 77, 246, 0.1);
    color: #6C4DF6;
  }
  
  body.dark-mode.gradient-glassmorphism .book-file-chip:hover {
    background: rgba(108, 77, 246, 0.18);
    color: #6C4DF6;
  }
`;
export const cssFile = '2.0design.css';
