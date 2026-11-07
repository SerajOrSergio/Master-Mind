// Auto-generated from payments.css — styles verbatim; the
// build (scripts/generate-pages.mjs) writes payments.css from this.
export const css = `
  /* Shared redesign styles live in the admin payments stylesheet, scoped under
     .payments-page-admin so the receptionist pages pick up the same layout. */
  @import url('/src/pages/admin/payments/payments.css');
  
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
      flex-direction: row;
      justify-content: space-between;
      align-items: flex-start;
    }
  }
  body {
    background: #f8fafc;
  }
  
  /* Keep content clear of the fixed 250px receptionist sidebar on desktop */
  @media (min-width: 768px) {
    #receptionist-header-container,
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
`;
export const cssFile = 'payments.css';
