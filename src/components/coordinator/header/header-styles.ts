// Auto-generated from header.css — styles verbatim; the
// build (scripts/generate-pages.mjs) writes header.css from this.
export const css = `
  .coordinator-header {
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
  .undo-btn {
    background: #f5f5f5;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 0.3rem 1rem;
    font-size: 1rem;
    color: #333;
    cursor: pointer;
    opacity: 0;
    pointer-events: none;
    transform: translateY(0) scale(0.95);
    transition: opacity 0.3s, transform 0.3s, background 0.2s;
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
