// Auto-generated from header.css — styles verbatim; the
// build (scripts/generate-pages.mjs) writes header.css from this.
export const css = `
  /* Teacher Header Styles - inspired by receptionist header */
  .teacher-header {
    z-index: 1050;
  }
  
  /* Desktop: the fixed 250px sidebar sits on the left, so keep the header inside
     the content area (aligned with #main-content's 250px offset). This prevents
     the header from covering the sidebar's brand area (the old full-width header
     painted over the sidebar because of its z-index). */
  @media (min-width: 768px) {
    .teacher-header.d-none.d-md-flex {
      margin-left: 250px;
      width: calc(100% - 250px);
      border-bottom: 1px solid #eee;
    }
  }
  .header-logo {
    border-radius: 8px;
    background: #f8f9fa;
  }
  .header-title {
    letter-spacing: -0.5px;
  }
  .undo-btn {
    min-width: 64px;
    /* Same look as the admin/receptionist portals: always visible, simply
       faded (disabled) until an undoable action is registered. */
    background: #f5f5f5;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 0.3rem 1rem;
    font-size: 1rem;
    color: #333;
    cursor: pointer;
    transition: background 0.2s;
  }
  .undo-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .undo-btn:hover:not(:disabled) {
    background: #e0e0e0;
  }
  @media (max-width: 767.98px) {
    .teacher-header {
      padding-left: 0.5rem;
      padding-right: 0.5rem;
    }
  }
  
  /* ================= DARK MODE — PROJECT1 THEME =================
     White header bar over the cream canvas with a purple title,
     mirroring the admin portal topbar in the 2.0 theme.
     ============================================================ */
  body.dark-mode.gradient-glassmorphism .teacher-header {
    background: #FFFFFF;
    border-bottom: 1px solid #E8E0D3;
    box-shadow: 0 2px 10px rgba(28, 24, 20, 0.06);
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }
  
  body.dark-mode.gradient-glassmorphism .navbar-light.bg-white {
    background: #FFFFFF !important;
    border-bottom: 1px solid #E8E0D3;
    box-shadow: 0 2px 10px rgba(28, 24, 20, 0.06);
  }
  
  body.dark-mode.gradient-glassmorphism .header-title,
  body.dark-mode.gradient-glassmorphism .navbar-brand.text-primary {
    font-family: 'Fraunces', Georgia, 'Times New Roman', serif;
    font-weight: 700;
    letter-spacing: 0.02em;
    color: #6C4DF6 !important;
    text-shadow: none;
  }
  
  body.dark-mode.gradient-glassmorphism .undo-btn {
    background: #F2EDE3;
    border: 1px solid #D8CDBB;
    color: #1C1814;
    border-radius: 10px;
    font-weight: 600;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }
  
  body.dark-mode.gradient-glassmorphism .undo-btn:hover:not(:disabled) {
    background: #E8E0D3;
    border-color: #96907F;
  }
  
  body.dark-mode.gradient-glassmorphism .navbar-toggler-icon {
    filter: none;
  }
  
  /* ================= IOS HOME-SCREEN (PWA) SUPPORT =================
     When added to the iOS home screen the app runs in standalone mode and the
     status bar can overlap the top of the page. Pad the sticky header so
     content clears the notch / status bar (env() resolves to 0 elsewhere). */
  .admin-header,
  .receptionist-header,
  .coordinator-header,
  .teacher-header {
    padding-top: max(0.5rem, env(safe-area-inset-top, 0px));
  }
`;
export const cssFile = 'header.css';
