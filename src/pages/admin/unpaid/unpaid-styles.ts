// Auto-generated from unpaid.css — styles verbatim; the
// build (scripts/generate-pages.mjs) writes unpaid.css from this.
export const css = `
  /* Unpaid page uses the same style as payments page for consistency */
  @import url('/src/pages/admin/payments/payments.css');
  
  /* Mobile-specific fixes for unpaid page */
  @media (max-width: 600px) {
    .payment-card-header {
      flex-direction: column !important;
      align-items: flex-start !important;
    }
    .payment-card-header > div:first-child {
      width: 100% !important;
    }
    .payment-card-header > div:last-child {
      width: 100% !important;
      margin-left: 0 !important;
    }
  }
`;
export const cssFile = 'unpaid.css';
