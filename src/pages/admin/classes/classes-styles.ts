// Auto-generated from classes.css — styles verbatim; the
// build (scripts/generate-pages.mjs) writes classes.css from this.
export const css = `
  /* Modern pill styles for classroom, type, and time window */
  .pill-btn {
    display: inline-block;
    border-radius: 2rem;
    border: 1.5px solid #d1d5db;
    background: #f8fafc;
    color: #333;
    font-weight: 500;
    padding: 0.5rem 1.2rem;
    margin: 0.25rem 0.5rem 0.25rem 0;
    cursor: pointer;
    transition: background 0.2s, color 0.2s, border 0.2s;
  }
  .pill-btn.selected, .pill-btn:active {
    background: #2563eb;
    color: #fff;
    border-color: #2563eb;
  }
  .pill-btn.classroom-1 { border-color: #e11d48; color: #e11d48; }
  .pill-btn.classroom-1.selected { background: #e11d48; color: #fff; }
  .pill-btn.classroom-2 { border-color: #2563eb; color: #2563eb; }
  .pill-btn.classroom-2.selected { background: #2563eb; color: #fff; }
  .pill-btn.classroom-3 { border-color: #22c55e; color: #22c55e; }
  .pill-btn.classroom-3.selected { background: #22c55e; color: #fff; }
  .pill-btn.classroom-4 { border-color: #f59e42; color: #f59e42; }
  .pill-btn.classroom-4.selected { background: #f59e42; color: #fff; }
  .pill-btn.private { border-color: #6b7280; color: #6b7280; }
  .pill-btn.private.selected { background: #6b7280; color: #fff; }
  .pill-btn.online { border-color: #6366f1; color: #6366f1; }
  .pill-btn.online.selected { background: #6366f1; color: #fff; }
  .pill-btn.athome { border-color: #64748b; color: #64748b; }
  .pill-btn.athome.selected { background: #64748b; color: #fff; }
  
  .card {
    border-radius: 1.25rem;
    box-shadow: 0 2px 16px rgba(0,0,0,0.07);
    background: #fff;
  }
  .card-body {
    padding: 2rem 2rem 1.5rem 2rem;
  }
  .border-bottom {
    border-bottom: 1.5px solid #e5e7eb !important;
  }
  .fw-bold { font-weight: 700 !important; }
  .mb-2 { margin-bottom: 0.75rem !important; }
  .mb-3 { margin-bottom: 1.25rem !important; }
  .my-3 { margin-top: 1.25rem !important; margin-bottom: 1.25rem !important; }
  .w-100 { width: 100% !important; }
  .mb-1 { margin-bottom: 0.5rem !important; }
  .mt-2 { margin-top: 0.75rem !important; }
  .small { font-size: 0.95rem; }
  .text-secondary { color: #6b7280 !important; }
  .text-success { color: #22c55e !important; }
  .text-danger { color: #e11d48 !important; }
  .btn-primary {
    background: #2563eb;
    border-color: #2563eb;
    font-weight: 600;
    border-radius: 0.5rem;
    font-size: 1.1rem;
    padding: 0.7rem 0;
  }
  .btn-primary:hover { background: #1d4ed8; border-color: #1d4ed8; }
  /* Responsive classes content for all devices */
  @media (max-width: 767.98px) {
    main[style] {
      margin-left: 0 !important;
    }
  }
  
  .classes-content {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .classes-card {
    border-radius: 1rem;
    box-shadow: 0 2px 16px rgba(0,0,0,0.04);
    background: #fff;
    padding: 2rem 1rem;
  }
  
  /* Classes Page Styles */
  .classes-page {
    padding: 2rem;
    font-family: Arial, sans-serif;
  }
  #classroom-selection {
    margin-bottom: 1rem;
  }
  #teacher-search, #subject-search {
    margin-bottom: 1rem;
  }
  #class-type, #time-window {
    margin-bottom: 1rem;
  }
  #reserve-btn {
    background: #007bff;
    color: #fff;
    border: none;
    padding: 0.75rem 2rem;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
  }
  #reserve-btn:hover {
    background: #0056b3;
  }
  /* Classroom circle button styles */
  .classroom-circle-btn {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
    font-weight: 600;
    transition: border 0.2s, box-shadow 0.2s;
    margin-right: 0.5rem;
    margin-bottom: 0.5rem;
    position: relative;
  }
  .classroom-circle-btn.active, .classroom-circle-btn:focus {
    border: 2.5px solid #007bff !important;
    box-shadow: 0 0 0 0.15rem #007bff33;
  }
  .classroom-circle-btn .d-md-inline {
    font-size: 0.9rem;
    font-weight: 400;
    margin-left: 0.5rem;
  }
  
  /* ================= DARK MODE - GRADIENT GLASSMORPHISM ================= */
  body.dark-mode.gradient-glassmorphism {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%);
    min-height: 100vh;
    color: rgba(255, 255, 255, 0.9);
  }
  
  body.dark-mode.gradient-glassmorphism .card {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.05);
  }
  
  body.dark-mode.gradient-glassmorphism .card-body {
    color: rgba(255, 255, 255, 0.9);
  }
  
  body.dark-mode.gradient-glassmorphism .mb-2,
  body.dark-mode.gradient-glassmorphism .mb-3,
  body.dark-mode.gradient-glassmorphism .my-3 {
    color: rgba(255, 255, 255, 0.9);
  }
  
  body.dark-mode.gradient-glassmorphism .fw-bold {
    color: rgba(255, 255, 255, 0.95);
    text-shadow: 0 0 15px rgba(150, 100, 255, 0.3);
  }
  
  body.dark-mode.gradient-glassmorphism .text-secondary {
    color: rgba(255, 255, 255, 0.5) !important;
  }
  
  body.dark-mode.gradient-glassmorphism .pill-btn {
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: rgba(255, 255, 255, 0.85);
  }
  
  body.dark-mode.gradient-glassmorphism .pill-btn.selected,
  body.dark-mode.gradient-glassmorphism .pill-btn:active {
    background: linear-gradient(135deg, rgba(100, 100, 255, 0.4), rgba(150, 50, 255, 0.4));
    border-color: rgba(150, 100, 255, 0.5);
    color: #fff;
  }
  
  body.dark-mode.gradient-glassmorphism .form-control,
  body.dark-mode.gradient-glassmorphism .form-select {
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }
  
  body.dark-mode.gradient-glassmorphism .form-control:focus,
  body.dark-mode.gradient-glassmorphism .form-select:focus {
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
  
  body.dark-mode.gradient-glassmorphism .classes-card {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.05);
  }
  
  body.dark-mode.gradient-glassmorphism .classroom-circle-btn {
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: rgba(255, 255, 255, 0.85);
  }
  
  body.dark-mode.gradient-glassmorphism .classroom-circle-btn.active,
  body.dark-mode.gradient-glassmorphism .classroom-circle-btn:focus {
    border: 2.5px solid rgba(150, 100, 255, 0.7) !important;
    box-shadow: 0 0 0 0.15rem rgba(150, 100, 255, 0.3);
  }
  
  body.dark-mode.gradient-glassmorphism .form-label {
    color: rgba(255, 255, 255, 0.85);
  }
`;
export const cssFile = 'classes.css';
