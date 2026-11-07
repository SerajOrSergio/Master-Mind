// Auto-generated from paid.css — styles verbatim; the
// build (scripts/generate-pages.mjs) writes paid.css from this.
export const css = `
  body {
    background: #f8fafc;
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
      padding: 4px;
    }
    .payment-card {
      padding: 12px 6px 8px 6px;
    }
    .page-title {
      font-size: 1.3rem;
    }
  }
`;
export const cssFile = 'paid.css';
