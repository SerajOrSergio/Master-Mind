// Auto-generated from sidebar.css — styles verbatim; the
// build (scripts/generate-pages.mjs) writes sidebar.css from this.
export const css = `
  /* Copied from receptionist sidebar for coordinator */
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 250px;
    z-index: 1040;
    border-right: 1px solid #e5e7eb;
    background: #fff;
    box-shadow: 2px 0 8px rgba(0,0,0,0.03);
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: #dee2e6 #fff;
  }
  .sidebar::-webkit-scrollbar { width: 8px; }
  .sidebar::-webkit-scrollbar-thumb { background: #dee2e6; border-radius: 4px; }
  .sidebar::-webkit-scrollbar-track { background: #fff; }
  @media (max-width: 767.98px) {
    .offcanvas.offcanvas-start { width: 250px !important; max-width: 80vw; background: transparent; }
    .offcanvas-backdrop.show { opacity: 0.1 !important; background: #000 !important; }
  }
  .sidebar .nav-link { font-size: 1.1rem; padding: 0.75rem 1.25rem; border-radius: 0.5rem; color: #495057; background: none; transition: background 0.2s, color 0.2s; font-weight: 500; }
  .sidebar .nav-link.active, .sidebar .nav-link:focus, .sidebar .nav-link:hover { background: #0d6efd; color: #fff !important; }
  .sidebar .nav-link .bi { font-size: 1.3rem; }
  .sidebar .mt-auto { margin-top: auto !important; }
  .sidebar .border-top { border-top: 1px solid #e5e7eb !important; }
  .undo-btn { background: #f5f5f5; border: 1px solid #ccc; border-radius: 4px; padding: 0.3rem 1rem; font-size: 1rem; color: #333; cursor: pointer; transition: background 0.2s; }
`;
export const cssFile = 'sidebar.css';
