// Auto-generated from sidebar.css — styles verbatim; the
// build (scripts/generate-pages.mjs) writes sidebar.css from this.
export const css = `
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
    /* The scrollbar thumb only appears while hovering the menu, so the desktop
       shows no permanent scroll "tab" (mobile never shows one). */
    scrollbar-color: transparent transparent;
  }
  .sidebar:hover {
    scrollbar-color: #dee2e6 #fff;
  }
  
  /* Custom scrollbar for Webkit browsers */
  .sidebar::-webkit-scrollbar {
    width: 8px;
  }
  .sidebar::-webkit-scrollbar-thumb {
    background: transparent;
    border-radius: 4px;
  }
  .sidebar::-webkit-scrollbar-track {
    background: transparent;
  }
  .sidebar:hover::-webkit-scrollbar-thumb {
    background: #dee2e6;
  }
  .sidebar:hover::-webkit-scrollbar-track {
    background: #fff;
  }
  /* Custom: Offcanvas sidebar as curtain on mobile */
  @media (max-width: 767.98px) {
    .offcanvas.offcanvas-start {
      width: 250px !important; /* Fixed width for sidebar */
      max-width: 80vw;
      background: transparent;
    }
    .offcanvas-backdrop.show {
      opacity: 0.1 !important; /* Make overlay almost transparent */
      background: #000 !important;
    }
  }
  
  .sidebar .nav-link {
    font-size: 1.1rem;
    padding: 0.75rem 1.25rem;
    border-radius: 0.5rem;
    color: #495057;
    background: none;
    transition: background 0.2s, color 0.2s;
    font-weight: 500;
  }
  
  .sidebar .nav-link.active,
  .sidebar .nav-link:focus,
  .sidebar .nav-link:hover {
    background: #0d6efd;
    color: #fff !important;
  }
  
  .sidebar .nav-link .bi {
    font-size: 1.3rem;
  }
  
  .sidebar .mt-auto {
    margin-top: auto !important;
  }
  
  .sidebar .border-top {
    border-top: 1px solid #e5e7eb !important;
  }
  
  /* Undo button for mobile header */
  .undo-btn {
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
  
  /* ================= DARK MODE — PROJECT1 THEME =================
     Mirrors the admin portal sidebar: a near-black warm rail with a
     purple gradient active state and Fraunces brand, so the receptionist
     portal looks exactly like the admin portal in the 2.0 theme.
     ============================================================ */
  body.dark-mode.gradient-glassmorphism .sidebar {
    background-color: #171310 !important;
    background-image: none;
    border-right: 1px solid rgba(255, 255, 255, 0.12);
    box-shadow: none;
    scrollbar-color: transparent transparent;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }
  body.dark-mode.gradient-glassmorphism .sidebar:hover {
    scrollbar-color: rgba(255, 255, 255, 0.25) #171310;
  }
  
  /* brand */
  body.dark-mode.gradient-glassmorphism .sidebar .d-flex.align-items-center.mb-4 {
    padding: 6px 4px 18px;
    margin-bottom: 10px !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  }
  
  body.dark-mode.gradient-glassmorphism .sidebar .d-flex.align-items-center.mb-4 img {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.08);
  }
  
  body.dark-mode.gradient-glassmorphism .sidebar .fs-4.fw-bold.text-primary {
    font-family: 'Fraunces', Georgia, 'Times New Roman', serif;
    font-size: 21px;
    font-weight: 700;
    letter-spacing: 0.06em;
    color: #FAF7F2 !important;
    text-shadow: none;
  }
  
  body.dark-mode.gradient-glassmorphism .sidebar .fs-4.fw-bold.text-primary::after {
    content: '— RECEPTIONIST PORTAL';
    display: block;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 9.5px;
    font-weight: 700;
    letter-spacing: 0.24em;
    color: #C447FF;
    margin-top: 2px;
  }
  
  /* nav items */
  body.dark-mode.gradient-glassmorphism .sidebar .nav-link {
    color: rgba(250, 247, 242, 0.62);
    background: none;
    border: 0;
    border-radius: 11px;
    padding: 11px 13px;
    font-size: 14.5px;
    font-weight: 550;
    box-shadow: none;
    transition: background 0.18s ease, color 0.18s ease;
  }
  
  body.dark-mode.gradient-glassmorphism .sidebar .nav-link:hover,
  body.dark-mode.gradient-glassmorphism .sidebar .nav-link:focus {
    background: rgba(255, 255, 255, 0.06);
    color: #FAF7F2;
    border: 0;
    box-shadow: none;
  }
  
  body.dark-mode.gradient-glassmorphism .sidebar .nav-link.active {
    background: linear-gradient(135deg, rgba(108, 77, 246, 0.32), rgba(196, 71, 255, 0.18));
    color: #FAF7F2;
    border: 0;
    font-weight: 650;
    box-shadow: none;
  }
  
  body.dark-mode.gradient-glassmorphism .sidebar .nav-link .bi {
    color: inherit;
    font-size: 1.15rem;
    opacity: 0.85;
  }
  
  body.dark-mode.gradient-glassmorphism .sidebar .nav-link:hover .bi,
  body.dark-mode.gradient-glassmorphism .sidebar .nav-link.active .bi {
    color: #FAF7F2;
    opacity: 1;
  }
  
  /* footer / logout */
  body.dark-mode.gradient-glassmorphism .sidebar .border-top {
    border-top: 1px solid rgba(255, 255, 255, 0.12) !important;
  }
  
  body.dark-mode.gradient-glassmorphism .sidebar .btn-outline-danger {
    background: transparent;
    border: 1px solid rgba(226, 62, 62, 0.4);
    color: #FF8F8F;
    border-radius: 11px;
    font-weight: 600;
    padding: 10px 13px;
    transition: background 0.18s ease, color 0.18s ease, border-color 0.18s ease;
  }
  
  body.dark-mode.gradient-glassmorphism .sidebar .btn-outline-danger:hover {
    background: rgba(226, 62, 62, 0.16);
    border-color: rgba(226, 62, 62, 0.6);
    color: #FFB3B3;
  }
  
  /* scrollbar */
  body.dark-mode.gradient-glassmorphism .sidebar::-webkit-scrollbar-thumb {
    background: transparent;
    border-radius: 8px;
  }
  body.dark-mode.gradient-glassmorphism .sidebar:hover::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.15);
  }
  body.dark-mode.gradient-glassmorphism .sidebar::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.25);
  }
  body.dark-mode.gradient-glassmorphism .sidebar::-webkit-scrollbar-track {
    background: transparent;
  }
  body.dark-mode.gradient-glassmorphism .sidebar:hover::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.2);
  }
  
  /* mobile offcanvas */
  body.dark-mode.gradient-glassmorphism .offcanvas.offcanvas-start {
    background-color: #171310 !important;
    border-right: 1px solid rgba(255, 255, 255, 0.12);
    box-shadow: 4px 0 20px rgba(0, 0, 0, 0.4);
  }
  
  body.dark-mode.gradient-glassmorphism .offcanvas .offcanvas-title {
    color: #FAF7F2;
    font-family: 'Fraunces', Georgia, serif;
    font-weight: 700;
    letter-spacing: 0.06em;
  }
  
  body.dark-mode.gradient-glassmorphism .offcanvas .btn-close {
    filter: invert(1) brightness(2);
  }
`;
export const cssFile = 'sidebar.css';
