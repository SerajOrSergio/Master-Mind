// Auto-generated from payments.css — styles verbatim; the
// build (scripts/generate-pages.mjs) writes payments.css from this.
export const css = `
  @media (max-width: 600px) {
    .container-fluid#main-content,
    #main-content {
      padding-left: 0 !important;
      padding-right: 0 !important;
      margin: 0 !important;
      width: 100vw !important;
      max-width: 100vw !important;
    }
    .payments-wrapper {
      max-width: 100vw !important;
      margin: 0 !important;
      padding: 12px 12px 0 12px !important;
    }
    .payment-card {
      padding: 12px 12px 10px 12px !important;
      border-radius: 12px !important;
      margin-bottom: 16px !important;
      box-shadow: 0 1px 4px rgba(0,0,0,0.04);
    }
    .payment-card-header {
      flex-direction: row !important;
      justify-content: space-between !important;
      align-items: flex-start !important;
      margin-bottom: 8px !important;
    }
    .payment-card-title {
      font-size: 1rem !important;
    }
    .payment-card-details {
      font-size: 0.95rem !important;
    }
    .page-title {
      font-size: 1.1rem !important;
      margin-bottom: 0.25rem !important;
    }
    .page-subtitle {
      font-size: 0.98rem !important;
      margin-bottom: 0.5rem !important;
    }
    .payment-card-table {
      font-size: 0.95rem !important;
      min-width: 520px !important;
      width: 100% !important;
      display: block !important;
      overflow-x: auto !important;
      border-radius: 0 0 8px 8px;
    }
    .payment-card-table th, .payment-card-table td {
      padding: 6px 6px !important;
      font-size: 0.95em !important;
      white-space: nowrap;
    }
    .payment-card-details-area {
      overflow-x: auto !important;
      width: 100%;
    }
  }
  /* Export Excel button mobile improvements */
  @media (max-width: 600px) {
    #exportExcelBtn.w-100 {
      font-size: 0.98rem;
      padding-top: 0.5rem;
      padding-bottom: 0.5rem;
      margin-bottom: 8px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    }
  }
  /* --- Paid toolbar mobile layout --- */
  @media (max-width: 600px) {
    .paid-toolbar {
      flex-direction: row !important;
      align-items: stretch !important;
      gap: 8px !important;
    }
    .paid-toolbar > button {
      flex: 0 0 auto;
      width: auto;
      min-width: 44px;
      margin-bottom: 0 !important;
    }
    .paid-searchbar {
      flex: 1 1 0%;
      min-width: 0;
    }
    .paid-searchbar input,
    .paid-searchbar select {
      min-width: 0;
      width: 100%;
      max-width: 100%;
    }
  }
  @media (max-width: 600px) {
    .teacher-profit-summary {
      position: static !important;
      width: 100% !important;
      margin-top: 12px !important;
      min-width: unset !important;
      box-shadow: none !important;
      text-align: left !important;
    }
    .payment-card-header {
      flex-direction: column !important;
      align-items: flex-start !important;
    }
    .payment-card-header > div:first-child {
      width: 100% !important;
    }
    .payment-card-header > .payment-card-header-actions {
      width: 100% !important;
      margin-left: 0 !important;
    }
    .payment-card-header > div.ms-3 {
      margin-left: 0 !important;
    }
  }
  body {
    background: #f8fafc;
  }
  
  /* =====================================================================
     Admin Payments page — dashboard / WordPress-admin style redesign.
     Every rule here is scoped under .payments-page-admin so the shared
     classes used by the Paid / Partial / Unpaid pages stay untouched.
     ===================================================================== */
  
  /* Top toolbar: title on the left, export button on the right */
  .payments-page-admin .payments-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 16px;
    flex-wrap: wrap;
    margin-bottom: 20px;
  }
  .payments-page-admin .page-title {
    font-size: 1.55rem;
    letter-spacing: -0.02em;
    margin-bottom: 2px;
  }
  .payments-page-admin .page-subtitle {
    color: #64748b;
    margin-bottom: 0;
    font-size: 0.95rem;
  }
  .payments-page-admin #exportExcelBtn {
    border-radius: 8px;
    font-size: 0.92rem;
    font-weight: 500;
  }
  
  /* Year divider between sections from different calendar years */
  .payments-page-admin .payments-year-divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 26px 2px 10px;
  }
  .payments-page-admin .payments-year-divider > span:first-child {
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #94a3b8;
  }
  .payments-page-admin .payments-year-line {
    flex: 1;
    height: 1px;
    background: #e2e8f0;
  }
  
  /* Collapsible year section: the year label is its own clickable header and
     each year older than the newest one starts folded away, so past-year data
     stays out of the way once a new year begins. */
  .payments-page-admin .payments-year-section {
    margin: 26px 2px 0;
  }
  .payments-page-admin .payments-year-section:last-child {
    margin-bottom: 4px;
  }
  .payments-page-admin .payments-year-header {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    cursor: pointer;
    margin-bottom: 10px;
  }
  .payments-page-admin .payments-year-chevron {
    display: inline-flex;
    color: #94a3b8;
    font-size: 0.8rem;
    transition: transform 0.15s ease;
  }
  .payments-page-admin .payments-year-section.collapsed .payments-year-chevron {
    transform: rotate(-90deg);
  }
  .payments-page-admin .payments-year-name {
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #94a3b8;
  }
  .payments-page-admin .payments-year-header:hover .payments-year-name {
    color: #64748b;
  }.payments-page-admin .payments-year-section.collapsed .payments-year-body {
    display: none;
  }
  
  /* Month section (one collapsible card per month, like WP admin list views) */
  .payments-page-admin .payments-group {
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    margin-bottom: 14px;
    overflow: hidden;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
  }
  .payments-page-admin .payments-group-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    width: 100%;
    background: #f8fafc;
    border: none;
    padding: 11px 16px;
    cursor: pointer;
    transition: background 0.12s ease;
  }
  .payments-page-admin .payments-group-header:hover {
    background: #f1f5f9;
  }
  .payments-page-admin .payments-group-title {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 600;
    font-size: 0.98rem;
    color: #0f172a;
  }
  .payments-page-admin .payments-group-chevron {
    display: inline-flex;
    color: #94a3b8;
    transition: transform 0.15s ease;
  }
  .payments-page-admin .payments-group.collapsed .payments-group-chevron {
    transform: rotate(-90deg);
  }
  .payments-page-admin .payments-group-badge {
    font-size: 0.68rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    background: #e0f2fe;
    color: #0369a1;
    border-radius: 999px;
    padding: 2px 9px;
  }
  .payments-page-admin .payments-group-meta {
    display: flex;
    align-items: center;
    gap: 16px;
    color: #64748b;
    font-size: 0.84rem;
    flex-wrap: wrap;
    justify-content: flex-end;
  }
  .payments-page-admin .payments-group-meta i {
    margin-right: 4px;
    color: #94a3b8;
  }
  .payments-page-admin .payments-group.collapsed .payments-group-body {
    display: none;
  }
  
  /* Payment cards sit as clean rows inside their month section */
  .payments-page-admin .payment-card {
    background: transparent;
    border: none;
    border-bottom: 1px solid #eef2f7;
    border-radius: 0;
    box-shadow: none;
    margin-bottom: 0;
    padding: 12px 10px;
  }
  .payments-page-admin .payment-card:last-child {
    border-bottom: none;
  }
  .payments-page-admin .payment-card-header {
    display: flex;
    gap: 14px;
    align-items: center;
    cursor: pointer;
  }
  .payments-page-admin .payment-card-main {
    display: flex;
    align-items: center;
    gap: 14px;
    min-width: 0;
    flex: 1;
    flex-wrap: wrap;
  }
  .payments-page-admin .payment-card-chevron {
    display: inline-flex;
    color: #94a3b8;
    font-size: 0.8rem;
    transition: transform 0.15s ease;
  }
  .payments-page-admin .payment-card:not(.collapsed) .payment-card-chevron {
    transform: rotate(90deg);
  }
  .payments-page-admin .payment-card-heading {
    min-width: 210px;
    flex: 0 1 auto;
  }
  .payments-page-admin .payment-card-title {
    font-weight: 600;
    font-size: 1rem;
  }
  .payments-page-admin .payment-card-chips {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    margin-top: 3px;
  }
  .payments-page-admin .chip {
    font-size: 0.74rem;
    background: #f1f5f9;
    border: 1px solid #e2e8f0;
    color: #475569;
    border-radius: 999px;
    padding: 1px 9px;
    white-space: nowrap;
  }
  .payments-page-admin .chip-subject {
    background: #eef2ff;
    border-color: #e0e7ff;
    color: #4338ca;
  }
  .payments-page-admin .payment-card-meta {
    display: flex;
    align-items: center;
    gap: 14px;
    flex-wrap: wrap;
    color: #64748b;
    font-size: 0.83rem;
    margin-left: auto;
  }
  .payments-page-admin .payment-card-meta i {
    margin-right: 4px;
    color: #94a3b8;
  }
  .payments-page-admin .payment-card-details-area {
    border-top: 1px dashed #e2e8f0;
    margin-top: 10px;
    padding-top: 10px;
  }
  
  /* Expanded student table: cleaner, dashboard-like */
  .payments-page-admin .payment-card-details-area table {
    border-radius: 8px;
  }
  .payments-page-admin .payment-card-details-area th {
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  
  /* Empty state (no pending payments / no filter matches) */
  .payments-page-admin .payments-empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 48px 16px;
    background: #fff;
    border: 1px dashed #e2e8f0;
    border-radius: 12px;
    color: #94a3b8;
    font-size: 1rem;
  }
  .payments-page-admin .payments-empty-state i {
    font-size: 1.6rem;
  }
  
  /* Mobile: stack the card row neatly */
  @media (max-width: 600px) {
    .payments-page-admin .payment-card-header {
      flex-wrap: wrap;
    }
    .payments-page-admin .payment-card-meta {
      margin-left: 0;
      width: 100%;
    }
    .payments-page-admin .payment-card-header-actions {
      margin-left: auto;
    }
    .payments-page-admin .payments-group-meta {
      justify-content: flex-start;
    }
  }
  
  /* =====================================================================
     IMPORTANT: this site's "2.0 / Project1" admin theme keeps the
     dark-mode body classes (body.dark-mode.gradient-glassmorphism) but
     renders a LIGHT interface (color-scheme: light, #1C1814 ink). The
     old dark rules further down this file assume a dark background and
     would paint the new elements white-on-white, so these overrides
     re-assert the light values with higher specificity while those body
     classes are present. They become inert the moment dark mode is off.
     ===================================================================== */
  body.dark-mode.gradient-glassmorphism .payments-page-admin .payments-wrapper {
    background: transparent;
    border: none;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    box-shadow: none;
  }
  body.dark-mode.gradient-glassmorphism .payments-page-admin .payments-group {
    background: #fff;
    border: 1px solid #e2e8f0;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }
  body.dark-mode.gradient-glassmorphism .payments-page-admin .payments-group-header {
    background: #f8fafc;
  }
  body.dark-mode.gradient-glassmorphism .payments-page-admin .payments-group-header:hover {
    background: #f1f5f9;
  }
  body.dark-mode.gradient-glassmorphism .payments-page-admin .payments-group-title,
  body.dark-mode.gradient-glassmorphism .payments-page-admin .payments-group-name,
  body.dark-mode.gradient-glassmorphism .payments-page-admin .payment-card-title {
    color: #0f172a;
  }
  body.dark-mode.gradient-glassmorphism .payments-page-admin .payments-group-meta,
  body.dark-mode.gradient-glassmorphism .payments-page-admin .payment-card-meta {
    color: #64748b;
  }
  body.dark-mode.gradient-glassmorphism .payments-page-admin .payments-group-meta i,
  body.dark-mode.gradient-glassmorphism .payments-page-admin .payment-card-meta i,
  body.dark-mode.gradient-glassmorphism .payments-page-admin .payments-group-chevron,
  body.dark-mode.gradient-glassmorphism .payments-page-admin .payment-card-chevron {
    color: #94a3b8;
  }
  body.dark-mode.gradient-glassmorphism .payments-page-admin .chip {
    background: #f1f5f9;
    border-color: #e2e8f0;
    color: #475569;
  }
  body.dark-mode.gradient-glassmorphism .payments-page-admin .chip-subject {
    background: #eef2ff;
    border-color: #e0e7ff;
    color: #4338ca;
  }
  body.dark-mode.gradient-glassmorphism .payments-page-admin .payment-card {
    background: transparent;
    border: none;
    border-bottom: 1px solid #eef2f7;
    border-radius: 0;
    box-shadow: none;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    margin-bottom: 0;
    padding: 12px 10px;
  }
  body.dark-mode.gradient-glassmorphism .payments-page-admin .payment-card:last-child {
    border-bottom: none;
  }
  body.dark-mode.gradient-glassmorphism .payments-page-admin .payment-card-details-area {
    border-top: 1px dashed #e2e8f0;
  }
  body.dark-mode.gradient-glassmorphism .payments-page-admin .payments-empty-state {
    background: #fff;
    border: 1px dashed #e2e8f0;
    color: #94a3b8;
  }
  body.dark-mode.gradient-glassmorphism .payments-page-admin .payments-year-chevron,
  body.dark-mode.gradient-glassmorphism .payments-page-admin .payments-year-name,
  body.dark-mode.gradient-glassmorphism .payments-page-admin .payments-year-header:hover .payments-year-name {
    color: #94a3b8;
  }
  body.dark-mode.gradient-glassmorphism .payments-page-admin .payments-year-line {
    background: #e2e8f0;
  }
  
  /* Keep content clear of the fixed 250px admin sidebar on desktop */
  @media (min-width: 768px) {
    #admin-header-container,
    #main-content {
      margin-left: 250px;
      width: calc(100% - 250px);
    }
  }
  
  .payments-wrapper {
    max-width: 1200px;
    margin: 32px auto;
    padding: 16px;
  }
  .page-title {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }
  .page-subtitle {
    color: #64748b;
    margin-bottom: 1.5rem;
  }
  #searchInput {
    max-width: 500px;
  }
  /* Payments filter card (same filter as the Paid page, wrapped in a card) */
  .payments-filter-card {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 1rem 1.15rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
  }
  .payments-filter-card .form-control,
  .payments-filter-card .form-select {
    border-radius: 0.6rem;
  }
  .payments-filter-card #searchInput {
    max-width: none;
    flex: 1 1 260px;
  }
  .payment-card {
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    margin-bottom: 24px;
    padding: 20px 24px 12px 24px;
    border: 1px solid #e5e7eb;
  }
  .payment-card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 12px;
    cursor: pointer;
    gap: 16px;
  }
  /* Keep the Show/Hide and Delete buttons side by side at the top right on
     every screen size. Without this, a narrow flex container squeezes the
     buttons wrapper and stacks Delete underneath Show. This must target ONLY
     the buttons wrapper (.payment-card-header-actions): matching every last
     child would flatten the paid card's profit summary and the unpaid/partial
     cards' teacher details into a single horizontal line. */
  .payment-card-header > div:first-child {
    min-width: 0;
  }
  .payment-card-header > .payment-card-header-actions {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-shrink: 0;
    white-space: nowrap;
    max-width: 100%;
    overflow: hidden;
  }
  .payment-card.collapsed .payment-card-details-area {
    display: none !important;
  }
  .payment-card-title {
    font-weight: bold;
    font-size: 1.1rem;
  }
  .payment-card-details {
    color: #334155;
    font-size: 0.97rem;
    margin-bottom: 8px;
  }
  .payment-card-actions {
    display: flex;
    gap: 8px;
  }
  /* Keep the student table scrollable inside the card at any width (the
     mobile-only rule below only helped below 600px, letting the 8-column
     table push the whole page sideways at 768-900px). */
  .payment-card-details-area {
    overflow-x: auto;
    width: 100%;
  }
  .payment-card-table {
    width: 100%;
    margin-top: 12px;
    border-collapse: separate;
    border-spacing: 0;
  }
  .payment-card-table th, .payment-card-table td {
    padding: 8px 10px;
    border-bottom: 1px solid #e5e7eb;
    text-align: left;
  }
  .payment-card-table th {
    color: #334155;
    font-weight: 600;
    background: #f1f5f9;
  }
  .payment-card-table tr:last-child td {
    border-bottom: none;
  }
  .status-btn {
    border-radius: 6px;
    padding: 4px 12px;
    font-size: 0.97em;
    border: none;
    margin-right: 4px;
  }
  .payment-status-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .payment-status-actions .status-btn {
    margin-right: 0;
  }
  .status-paid {
    background: #e0f2fe;
    color: #2563eb;
  }
  .status-partial {
    background: #fef9c3;
    color: #b45309;
  }
  .status-unpaid {
    background: #fee2e2;
    color: #dc2626;
  }
  .edit-btn, .delete-btn {
    border-radius: 6px;
    padding: 4px 14px;
    font-size: 0.97em;
    border: none;
    margin-left: 8px;
  }
  .edit-btn {
    background: #e0e7ff;
    color: #2563eb;
  }
  .delete-btn {
    background: #fee2e2;
    color: #dc2626;
  }
  .hide-btn {
    background: none;
    color: #2563eb;
    border: none;
    font-weight: 500;
    margin-left: 12px;
    cursor: pointer;
  }
  @media (max-width: 900px) {
    .payments-wrapper {
      padding: 12px 12px 0 12px;
    }
    .payment-card {
      padding: 12px 12px 10px 12px;
    }
    .page-title {
      font-size: 1.3rem;
    }
  }
  @media (max-width: 600px) {
    .payment-status-actions {
      flex-direction: column;
      align-items: stretch;
      min-width: 110px;
    }
    .payment-status-actions .status-btn {
      width: 100%;
      min-height: 38px;
    }
  }
  
  /* ================= DARK MODE - GRADIENT GLASSMORPHISM ================= */
  body.dark-mode.gradient-glassmorphism {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%);
    min-height: 100vh;
    color: rgba(255, 255, 255, 0.9);
  }
  
  body.dark-mode.gradient-glassmorphism .payments-wrapper {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    padding: 2rem;
    margin: 1rem;
  }
  
  body.dark-mode.gradient-glassmorphism .page-title {
    color: rgba(255, 255, 255, 0.95);
    text-shadow: 0 0 20px rgba(150, 100, 255, 0.3);
  }
  
  body.dark-mode.gradient-glassmorphism .page-subtitle {
    color: rgba(255, 255, 255, 0.6);
  }
  
  body.dark-mode.gradient-glassmorphism .payment-card {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.05);
  }
  
  body.dark-mode.gradient-glassmorphism .payment-card-title {
    color: rgba(255, 255, 255, 0.95);
  }
  
  body.dark-mode.gradient-glassmorphism .payment-card-details {
    color: rgba(255, 255, 255, 0.7);
  }
  
  body.dark-mode.gradient-glassmorphism .payment-card-table {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }
  
  body.dark-mode.gradient-glassmorphism .payment-card-table th {
    background: linear-gradient(135deg, rgba(100, 100, 255, 0.15), rgba(150, 50, 255, 0.15));
    border-bottom: 1px solid rgba(255, 255, 255, 0.15);
    color: rgba(255, 255, 255, 0.95);
  }
  
  body.dark-mode.gradient-glassmorphism .payment-card-table td {
    color: rgba(255, 255, 255, 0.85);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
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
  
  /* ========== TEACHER QUICK SUMMARY (admin Paid page) ==========
     Appears above the cards when a filter/search is active on the Paid page:
     one teacher → per-month salary rows; several teachers → per-teacher rows.
     ============================================================ */
  .paid-teacher-summary {
    margin: 0 0 14px;
  }
  
  .ts-card {
    background: #fff;
    border: 1px solid #e9ecef;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
    padding: 1rem 1.25rem;
  }
  
  .ts-header {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 10px;
  }
  
  .ts-title {
    font-weight: 700;
    color: #495057;
    font-size: 1rem;
  }
  
  .ts-title i {
    color: #6C4DF6;
    margin-right: 6px;
  }
  
  .ts-teacher-name {
    color: #6C4DF6;
  }
  
  .ts-sub {
    color: #6c757d;
    font-size: 12.5px;
    margin-top: 3px;
  }
  
  .ts-bulk-btn {
    white-space: nowrap;
  }
  
  .ts-table {
    font-size: 13.5px;
  }
  
  .ts-table thead th {
    color: #6c757d;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    background: #f8f9fa;
    white-space: nowrap;
  }
  
  .ts-row-name {
    font-weight: 700;
    color: #495057;
    white-space: nowrap;
  }
  
  .ts-ceo-cell {
    color: #dc3545;
    font-weight: 700;
  }
  
  .ts-ceo-total {
    font-size: 15px;
  }
  
  .ts-badge {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 700;
    white-space: nowrap;
  }
  
  .ts-badge-ok {
    background: rgba(108, 77, 246, 0.1);
    color: #6C4DF6;
  }
  
  .ts-badge-warn {
    background: rgba(232, 163, 61, 0.16);
    color: #B97B1E;
  }
  
  .ts-badge-mixed {
    background: #f8f9fa;
    color: #6c757d;
    border: 1px solid #e9ecef;
  }
  
  .ts-footnote {
    margin-top: 8px;
    color: #6c757d;
    font-size: 12px;
  }
  
  .ts-footnote i {
    margin-right: 4px;
  }
  
  /* per-row Mark Completed button next to CEO Profit */
  .ts-action-cell {
    white-space: nowrap;
  }
  
  .ts-action-cell .ts-row-complete {
    white-space: nowrap;
  }
  
  .ts-badge-done {
    background: rgba(46, 158, 91, 0.14);
    color: #2E9E5B;
  }
  
  body.dark-mode.gradient-glassmorphism .ts-badge-done {
    background: rgba(46, 158, 91, 0.18);
    color: #2E9E5B;
  }
  
  /* Mobile: let the header wrap and the table scroll sideways */
  @media (max-width: 767.98px) {
    .ts-card {
      padding: 1rem;
    }
  
    .ts-header {
      flex-direction: column;
      align-items: stretch;
    }
  
    .ts-bulk-btn {
      width: 100%;
    }
  }
  
  /* ---- Teacher quick summary — Project1 cream theme ---- */
  body.dark-mode.gradient-glassmorphism .ts-card {
    background: #FFFFFF;
    border: 1px solid #E8E0D3;
    border-radius: 18px;
    box-shadow: 0 2px 10px rgba(28, 24, 20, 0.06);
  }
  
  body.dark-mode.gradient-glassmorphism .ts-title,
  body.dark-mode.gradient-glassmorphism .ts-row-name {
    color: #1C1814;
  }
  
  body.dark-mode.gradient-glassmorphism .ts-sub,
  body.dark-mode.gradient-glassmorphism .ts-footnote,
  body.dark-mode.gradient-glassmorphism .ts-badge-mixed {
    color: #96907F;
  }
  
  body.dark-mode.gradient-glassmorphism .ts-table thead th {
    background: #FAF7F0;
    color: #96907F;
  }
  
  body.dark-mode.gradient-glassmorphism .ts-ceo-cell {
    color: #B97B1E;
  }
`;
export const cssFile = 'payments.css';
