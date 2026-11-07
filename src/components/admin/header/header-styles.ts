// Auto-generated from header.css — styles verbatim; the
// build (scripts/generate-pages.mjs) writes header.css from this.
export const css = `
  .admin-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 1rem;
    background: #fff;
    border-bottom: 1px solid #eee;
    min-height: 56px;
  }
  .header-left {
    display: flex;
    align-items: center;
  }
  .header-logo {
    width: 32px;
    height: 32px;
    margin-right: 0.5rem;
  }
  .header-title {
    font-weight: bold;
    font-size: 1.2rem;
    color: #3b3bff;
  }
  .header-right {
    display: flex;
    align-items: center;
  }
  /* Undo button — shared design: the button uses Bootstrap's
     \`btn btn-outline-secondary\` classes plus the sidebar.css \`.undo-btn\` rules
     (the same look as the teachers / availability / grades / subjects pages).
     It is always visible and is simply disabled (faded) until an undoable
     action is registered by assist/undo-manager.js. No visual overrides are defined
     here so every portal page renders the identical button. */
  .burger-menu {
    background: none;
    border: none;
    padding: 0.3rem 0.7rem 0.3rem 0.1rem;
    margin-right: 0.5rem;
    display: inline-flex;
    align-items: center;
    cursor: pointer;
  }
  .burger-icon {
    display: inline-block;
    width: 24px;
    height: 2px;
    background: #333;
    position: relative;
  }
  .burger-icon::before,
  .burger-icon::after {
    content: '';
    display: block;
    width: 24px;
    height: 2px;
    background: #333;
    position: absolute;
    left: 0;
  }
  .burger-icon::before {
    top: -7px;
  }
  .burger-icon::after {
    top: 7px;
  }
  @media (min-width: 768px) {
    .burger-menu {
      display: none !important;
    }
  }
  
  /* ================= DARK MODE — PROJECT1 THEME =================
     White header bar over the cream canvas, purple title (mirrors the
     Project1 admin topbar).
     ============================================================ */
  body.dark-mode.gradient-glassmorphism .admin-header {
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
  
  body.dark-mode.gradient-glassmorphism .header-title {
    font-family: 'Fraunces', Georgia, 'Times New Roman', serif;
    font-weight: 700;
    letter-spacing: 0.02em;
    color: #6C4DF6 !important;
    text-shadow: none;
  }
  
  body.dark-mode.gradient-glassmorphism .navbar-brand.text-primary {
    color: #6C4DF6 !important;
    text-shadow: none;
  }
  
  /* In dark mode the undo button intentionally keeps the same shared
     outline-secondary look as the reference pages — no overrides needed. */
  
  body.dark-mode.gradient-glassmorphism .burger-icon,
  body.dark-mode.gradient-glassmorphism .burger-icon::before,
  body.dark-mode.gradient-glassmorphism .burger-icon::after {
    background: #1C1814;
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
