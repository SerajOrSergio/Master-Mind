// Auto-generated from subjects.css — styles verbatim; the
// build (scripts/generate-pages.mjs) writes subjects.css from this.
export const css = `
  /* Subjects Admin Page Styles */
  
  body {
    background: #f8f9fa;
  }
  
  #main-content {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    padding: 2rem 2rem 1rem 2rem;
  }
  
  .table th, .table td {
    vertical-align: middle;
  }
  
  #alert-placeholder {
    margin-bottom: 1rem;
  }
  
  /* Match grades table header background */
  .table th {
    background: #f1f5f9;
    font-weight: 600;
  }
  
  /* ================= DARK MODE - GRADIENT GLASSMORPHISM ================= */
  body.dark-mode.gradient-glassmorphism {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%);
    min-height: 100vh;
    color: rgba(255, 255, 255, 0.9);
  }
  
  body.dark-mode.gradient-glassmorphism #main-content {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    padding: 2rem;
    /* no margin here: the old \`margin: 1rem\` shorthand wiped the base
       sidebar offset, pushing content under the fixed 250px sidebar */
  }
  
  body.dark-mode.gradient-glassmorphism h2 {
    color: rgba(255, 255, 255, 0.95);
    text-shadow: 0 0 20px rgba(150, 100, 255, 0.3);
  }
  
  body.dark-mode.gradient-glassmorphism .text-muted {
    color: rgba(255, 255, 255, 0.5) !important;
  }
  
  body.dark-mode.gradient-glassmorphism .form-control {
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }
  
  body.dark-mode.gradient-glassmorphism .form-control:focus {
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(150, 100, 255, 0.5);
    color: rgba(255, 255, 255, 0.95);
    box-shadow: 0 0 15px rgba(150, 100, 255, 0.3);
  }
  
  body.dark-mode.gradient-glassmorphism .table {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }
  
  body.dark-mode.gradient-glassmorphism .table th {
    background: linear-gradient(135deg, rgba(100, 100, 255, 0.15), rgba(150, 50, 255, 0.15));
    border-bottom: 1px solid rgba(255, 255, 255, 0.15);
    color: rgba(255, 255, 255, 0.95);
  }
  
  body.dark-mode.gradient-glassmorphism .table td {
    color: rgba(255, 255, 255, 0.85);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }
  
  body.dark-mode.gradient-glassmorphism .table tbody tr:hover {
    background: rgba(255, 255, 255, 0.08);
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
  
  body.dark-mode.gradient-glassmorphism .btn-danger {
    background: linear-gradient(135deg, rgba(255, 80, 80, 0.4), rgba(200, 50, 50, 0.4));
    border: 1px solid rgba(255, 80, 80, 0.5);
    color: #fff;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }
  
  body.dark-mode.gradient-glassmorphism .btn-danger:hover {
    background: linear-gradient(135deg, rgba(255, 80, 80, 0.6), rgba(200, 50, 50, 0.6));
    box-shadow: 0 4px 20px rgba(255, 80, 80, 0.4);
  }
`;
export const cssFile = 'subjects.css';
