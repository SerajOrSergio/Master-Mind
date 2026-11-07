// Auto-generated from dashboard.css — styles verbatim; the
// build (scripts/generate-pages.mjs) writes dashboard.css from this.
export const css = `
  /* Responsive dashboard content for all devices */
  @media (max-width: 767.98px) {
    main[style] {
      margin-left: 0 !important;
    }
  }
  
  body {
    background: #f8f9fa;
  }
  
  .dashboard-content {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    padding: 2rem 2rem 1rem 2rem;
    margin: 1rem;
  }
  
  .card {
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.02);
  }
  
  .card-body {
    color: #495057;
  }
  
  .card-title {
    color: #6c757d;
    font-weight: 600;
  }
  
  .display-4 {
    color: #495057;
  }
  
  /* Responsive adjustment for main content */
  @media (max-width: 767.98px) {
    .dashboard-content {
      margin-left: 0 !important;
      margin-right: 0 !important;
      border-radius: 0;
    }
  }
  
  /* ================= DARK MODE — PROJECT1 THEME =================
     Mirrors the Project1 store admin dashboard: cream canvas with
     white stat cards, tinted icon squares and Fraunces numerals.
     ============================================================ */
  body.dark-mode.gradient-glassmorphism {
    background: #F2EDE3;
    min-height: 100vh;
    color: #1C1814;
  }
  
  body.dark-mode.gradient-glassmorphism .dashboard-content {
    background: transparent;
    border: 0;
    border-radius: 0;
    box-shadow: none;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    margin: 0;
    padding: 2rem;
  }
  
  /* stat cards — white rounded panels with a tinted icon square */
  body.dark-mode.gradient-glassmorphism .card {
    background: #FFFFFF;
    border: 1px solid #E8E0D3;
    border-radius: 18px;
    box-shadow: 0 2px 10px rgba(28, 24, 20, 0.06);
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    overflow: hidden;
    /* grow/shrink gracefully instead of overflowing the numbers */
    width: auto !important;
    flex: 1 1 240px;
    min-width: 220px;
    max-width: 340px;
    transition: transform 0.2s cubic-bezier(0.22, 0.61, 0.36, 1), box-shadow 0.2s cubic-bezier(0.22, 0.61, 0.36, 1);
  }
  
  body.dark-mode.gradient-glassmorphism .card:hover {
    transform: translateY(-3px);
    box-shadow: 0 14px 34px rgba(28, 24, 20, 0.12);
  }
  
  body.dark-mode.gradient-glassmorphism .card-body {
    color: #1C1814;
    display: flex;
    align-items: center;
    gap: 16px;
    text-align: left;
    padding: 20px;
    min-width: 0;
  }
  
  /* icon square (like Project1's .stat-ico) */
  body.dark-mode.gradient-glassmorphism .card .display-4 {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 58px;
    height: 58px;
    flex: none;
    border-radius: 16px;
    font-size: 26px;
    line-height: 1;
    margin: 0;
  }
  
  body.dark-mode.gradient-glassmorphism .card .display-4.text-primary {
    background: rgba(108, 77, 246, 0.1);
    color: #6C4DF6;
  }
  
  body.dark-mode.gradient-glassmorphism .card .display-4.text-success {
    background: rgba(46, 158, 91, 0.12);
    color: #2E9E5B;
  }
  
  body.dark-mode.gradient-glassmorphism .card .display-4.text-warning {
    background: rgba(232, 163, 61, 0.14);
    color: #E8A33D;
  }
  
  body.dark-mode.gradient-glassmorphism .card .display-4.text-info {
    background: rgba(79, 143, 247, 0.12);
    color: #4F8FF7;
  }
  
  body.dark-mode.gradient-glassmorphism .card-title {
    color: #96907F;
    font-size: 12.5px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin: 0;
    flex: 1 1 auto;
    min-width: 0;
  }
  
  body.dark-mode.gradient-glassmorphism .card-text.fs-2 {
    font-family: 'Fraunces', Georgia, 'Times New Roman', serif;
    font-size: 30px !important;
    font-weight: 700;
    line-height: 1.15;
    color: #1C1814;
    margin: 2px 0 0;
    /* never let the number clip or wrap — the label flexes instead, and the
       card grows/shrinks; overflow:hidden on the card is the final guard */
    flex: 0 0 auto;
    white-space: nowrap;
  }
  
  body.dark-mode.gradient-glassmorphism .text-primary { color: #6C4DF6 !important; }
  body.dark-mode.gradient-glassmorphism .text-success { color: #2E9E5B !important; }
  body.dark-mode.gradient-glassmorphism .text-warning { color: #E8A33D !important; }
  body.dark-mode.gradient-glassmorphism .text-info { color: #4F8FF7 !important; }
  
  
  /* ================= MONTHLY INCOME BREAKDOWN =================
     A collapsible table under the stat cards: one row per month (newest
     first), expanding to a per-teacher breakdown with cut-rate maths.
     ============================================================ */
  .monthly-income-card {
    background: #fff;
    border: 1px solid #e9ecef;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
    padding: 1.25rem 1.5rem;
  }
  
  .monthly-income-header {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding-bottom: 0.9rem;
    border-bottom: 1px solid #e9ecef;
  }
  
  .monthly-income-title {
    margin: 0;
    font-weight: 700;
    color: #495057;
    font-size: 1.05rem;
  }
  
  .monthly-income-title i {
    color: #E8A33D;
    margin-right: 6px;
  }
  
  .monthly-income-subtitle {
    color: #6c757d;
    font-size: 13px;
    margin-top: 4px;
  }
  
  .monthly-income-updated {
    color: #6c757d;
    font-size: 12px;
    white-space: nowrap;
  }
  
  /* the two-tier table */
  .mi-month-table {
    font-size: 14px;
  }
  
  .mi-month-table thead th {
    color: #6c757d;
    font-size: 11.5px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    border-bottom: 1px solid #e9ecef;
    padding: 12px 10px 8px;
    white-space: nowrap;
  }
  
  .mi-month-row {
    cursor: pointer;
    transition: background 0.15s ease;
  }
  
  .mi-month-row:hover {
    background: #f8f9fa;
  }
  
  .mi-month-row.mi-expanded {
    background: #f6f3ff;
  }
  
  .mi-month-name {
    font-weight: 700;
    color: #495057;
  }
  
  .mi-chevron {
    display: inline-block;
    width: 18px;
    margin-right: 8px;
    color: #6C4DF6;
  }
  
  .mi-num {
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }
  
  .mi-teacher-cut {
    color: #dc3545;
  }
  
  .mi-admin-profit {
    color: #198754;
  }
  
  .mi-total-profit {
    font-size: 16px;
  }
  
  /* month totals footer */
  .mi-month-table tfoot td {
    font-weight: 700;
    color: #495057;
    border-top: 2px solid #e9ecef;
    padding-top: 12px;
  }
  
  /* badges */
  .mi-badge {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 700;
    line-height: 1.5;
    margin-left: 8px;
    white-space: nowrap;
  }
  
  .mi-badge-new {
    background: #6C4DF6;
    color: #fff;
  }
  
  .mi-badge-ok {
    background: rgba(108, 77, 246, 0.1);
    color: #6C4DF6;
    margin-left: 0;
  }
  
  .mi-badge-warn {
    background: rgba(232, 163, 61, 0.16);
    color: #B97B1E;
    margin-left: 4px;
  }
  
  /* per-teacher detail table inside an expanded month */
  .mi-detail-row > .mi-detail-cell {
    background: #fafbfc;
    padding: 10px 12px 14px 34px;
    border-left: 3px solid #6C4DF6;
  }
  
  .mi-detail-row .mi-teacher-table {
    font-size: 13.5px;
    background: #fff;
    border-radius: 8px;
    overflow: hidden;
  }
  
  .mi-teacher-table thead th {
    color: #6c757d;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    background: #f8f9fa;
    white-space: nowrap;
  }
  
  .mi-teacher-name {
    font-weight: 600;
    color: #495057;
  }
  
  .mi-teacher-cut:not(.mi-num) {
    color: #dc3545;
  }
  
  .mi-footnote {
    margin-top: 10px;
    color: #6c757d;
    font-size: 12px;
  }
  
  .mi-footnote i {
    margin-right: 4px;
  }
  
  /* Mobile: keep the header readable, let the table scroll sideways */
  @media (max-width: 767.98px) {
    .monthly-income-card {
      padding: 1rem;
    }
  
    .monthly-income-header {
      flex-direction: column;
      align-items: flex-start;
    }
  
    .mi-detail-row > .mi-detail-cell {
      padding-left: 12px;
    }
  }
  
  /* ============ MONTHLY INCOME — Project1 cream theme ============ */
  body.dark-mode.gradient-glassmorphism .monthly-income-card {
    background: #FFFFFF;
    border: 1px solid #E8E0D3;
    border-radius: 18px;
    box-shadow: 0 2px 10px rgba(28, 24, 20, 0.06);
  }
  
  body.dark-mode.gradient-glassmorphism .monthly-income-header {
    border-bottom: 1px solid #E8E0D3;
  }
  
  body.dark-mode.gradient-glassmorphism .monthly-income-title,
  body.dark-mode.gradient-glassmorphism .mi-month-name,
  body.dark-mode.gradient-glassmorphism .mi-teacher-name,
  body.dark-mode.gradient-glassmorphism .mi-month-table tfoot td {
    color: #1C1814;
  }
  
  body.dark-mode.gradient-glassmorphism .monthly-income-subtitle,
  body.dark-mode.gradient-glassmorphism .monthly-income-updated,
  body.dark-mode.gradient-glassmorphism .mi-footnote {
    color: #96907F;
  }
  
  body.dark-mode.gradient-glassmorphism .monthly-income-title {
    font-family: 'Fraunces', Georgia, serif;
  }
  
  body.dark-mode.gradient-glassmorphism .mi-month-table thead th,
  body.dark-mode.gradient-glassmorphism .mi-teacher-table thead th {
    color: #96907F;
  }
  
  body.dark-mode.gradient-glassmorphism .mi-month-table thead th {
    border-bottom: 1px solid #E8E0D3;
  }
  
  body.dark-mode.gradient-glassmorphism .mi-month-row:hover {
    background: #FAF7F0;
  }
  
  body.dark-mode.gradient-glassmorphism .mi-month-row.mi-expanded {
    background: #F4F0FC;
  }
  
  body.dark-mode.gradient-glassmorphism .mi-month-table tfoot td {
    border-top: 2px solid #E8E0D3;
  }
  
  body.dark-mode.gradient-glassmorphism .mi-num,
  body.dark-mode.gradient-glassmorphism .mi-month-table tfoot td.mi-num,
  body.dark-mode.gradient-glassmorphism .mi-admin-profit,
  body.dark-mode.gradient-glassmorphism .mi-total-profit {
    font-family: 'Fraunces', Georgia, serif;
  }
  
  body.dark-mode.gradient-glassmorphism .mi-detail-row {
    background: #FFFFFF;
  }
  
  body.dark-mode.gradient-glassmorphism .mi-detail-row > .mi-detail-cell {
    background: #FAF7F0;
    border-left-color: #6C4DF6;
  }
  
  body.dark-mode.gradient-glassmorphism .mi-teacher-table {
    background: #FFFFFF;
    border: 1px solid #E8E0D3;
  }
  
  body.dark-mode.gradient-glassmorphism .mi-teacher-table thead th {
    background: #FAF7F0;
  }
  
  /* ============ MONTHLY INCOME — v2 refinements ============ */
  
  /* legend above the table: green = you, red = teachers, purple = full income */
  .mi-legend {
    display: flex;
    flex-wrap: wrap;
    gap: 6px 22px;
    align-items: center;
    font-size: 12px;
    color: #6c757d;
    padding: 0 10px 10px;
  }
  
  .mi-legend i {
    font-size: 9px;
    vertical-align: middle;
    margin-right: 5px;
  }
  
  .mi-legend-green { color: #198754; }
  .mi-legend-red { color: #dc3545; }
  .mi-legend-purple { color: #6C4DF6; }
  
  .mi-legend-click {
    margin-left: auto;
    color: #adb5bd;
    font-style: italic;
  }
  
  /* small secondary counters under the money figures */
  .mi-mini-note {
    display: block;
    font-weight: 400;
    font-size: 10.5px;
    color: #adb5bd;
    line-height: 1.2;
    white-space: nowrap;
  }
  
  td .mi-mini-note { margin-top: 1px; }
  
  /* month cell subtitle */
  .mi-month-row .mi-mini-note {
    display: inline-block;
    margin-left: 8px;
  }
  
  /* detail blocks inside an expanded month */
  .mi-detail-block + .mi-detail-block {
    margin-top: 14px;
  }
  
  .mi-detail-title {
    font-weight: 700;
    font-size: 12.5px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: #6c757d;
    margin: 2px 0 8px;
  }
  
  .mi-detail-title i {
    color: #6C4DF6;
    margin-right: 5px;
  }
  
  /* source chips in the packages / study-clicks table */
  .mi-extra-source {
    display: inline-flex;
    align-items: center;
    padding: 3px 10px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 700;
    white-space: nowrap;
  }
  
  .mi-extra-source i { margin-right: 5px; }
  
  .mi-extra-source-sub {
    background: rgba(232, 163, 61, 0.16);
    color: #B97B1E;
  }
  
  .mi-extra-source-click {
    background: rgba(108, 77, 246, 0.1);
    color: #6C4DF6;
  }
  
  /* price tags we could not read as a number */
  .mi-price-unclear {
    font-weight: 400 !important;
    color: #6c757d !important;
    font-style: italic;
  }
  
  .mi-extras-note {
    margin-top: 8px;
    font-size: 11.5px;
    color: #adb5bd;
  }
  
  body.dark-mode.gradient-glassmorphism .mi-legend {
    color: #96907F;
  }
  
  body.dark-mode.gradient-glassmorphism .mi-legend-click,
  body.dark-mode.gradient-glassmorphism .mi-mini-note,
  body.dark-mode.gradient-glassmorphism .mi-price-unclear,
  body.dark-mode.gradient-glassmorphism .mi-extras-note {
    color: #96907F;
  }
  
  body.dark-mode.gradient-glassmorphism .mi-detail-title {
    color: #96907F;
  }
  
  body.dark-mode.gradient-glassmorphism .mi-extra-source-sub {
    background: rgba(232, 163, 61, 0.18);
    color: #B97B1E;
  }
  
  body.dark-mode.gradient-glassmorphism .mi-extra-source-click {
    background: rgba(108, 77, 246, 0.12);
    color: #6C4DF6;
  }
`;
export const cssFile = 'dashboard.css';
