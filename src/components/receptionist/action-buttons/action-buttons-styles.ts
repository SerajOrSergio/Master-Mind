// Auto-generated from action-buttons.css — styles verbatim; the
// build (scripts/generate-pages.mjs) writes action-buttons.css from this.
export const css = `
  /* ================= ACTION BUTTONS =================
     Shared design for table action buttons across the receptionist portal.
     Same look as the admin portal's teachers page: clean stacked buttons
     (no ugly text wrap) with soft-tinted color variants and icons. */
  .table-actions {
    min-width: 150px;
  }
  .actions-stack {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .action-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.82rem;
    padding: 0.32rem 0.9rem;
    width: 100%;
    transition: transform 0.12s ease, box-shadow 0.15s ease, filter 0.15s ease;
  }
  .action-btn:active {
    transform: scale(0.97);
  }
  .action-reset {
    background: #FDF1DC;
    border: 1px solid #E8A33D;
    color: #8A5A00;
  }
  .action-reset:hover {
    background: #FBE3B8;
    border-color: #D98F1F;
    color: #6E4700;
    box-shadow: 0 3px 10px rgba(232, 163, 61, 0.25);
  }
  .action-success {
    background: #DDF3E4;
    border: 1px solid #7BC896;
    color: #1E7A3C;
  }
  .action-success:hover {
    background: #C9EBD6;
    border-color: #5FB47E;
    color: #155E2E;
    box-shadow: 0 3px 10px rgba(46, 160, 84, 0.22);
  }
  .action-delete {
    background: #FBE3E3;
    border: 1px solid #E8A3A3;
    color: #C22A2A;
  }
  .action-delete:hover {
    background: #F6CDCD;
    border-color: #D97A7A;
    color: #A11E1E;
    box-shadow: 0 3px 10px rgba(226, 62, 62, 0.22);
  }
`;
export const cssFile = 'action-buttons.css';
