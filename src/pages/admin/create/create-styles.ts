// Auto-generated from create.css — styles verbatim; the
// build (scripts/generate-pages.mjs) writes create.css from this.
export const css = `
  /* MAIN LAYOUT */
  #main-content {
    margin-left: 260px;
    max-width: calc(100% - 260px);
    background: #fff;
    border-radius: 12px;
    padding: 2rem;
  }
  
  /* MOBILE — below 768px the sidebar becomes the off-canvas drawer, so the
     content can go full-width. Between 768px-991px the fixed 250px sidebar is
     still visible, so keep clearing it (same breakpoint as the other admin pages). */
  @media (max-width: 767.98px) {
    #main-content {
      margin-left: 0 !important;
      max-width: 100% !important;
      padding: 1rem !important;
    }
  }
  
  .list-group-item {
    border: 1px solid #dee2e6;
    margin-bottom: 8px;
    border-radius: 8px !important;
    transition: all 0.2s ease;
    cursor: move;
  }
  
  .list-group-item:hover {
    background-color: #f8f9fa;
  }
  
  .list-group-item.dragging {
    opacity: 0.5;
    background-color: #e9ecef;
    border: 2px dashed #0d6efd;
  }
  
  .drag-handle {
    cursor: grab;
    color: #6c757d;
    font-size: 1.25rem;
    padding: 4px;
    border-radius: 4px;
    transition: color 0.2s ease;
  }
  
  .drag-handle:hover {
    color: #0d6efd;
  }
  
  .drag-handle:active {
    cursor: grabbing;
  }
  
  .page-toggle {
    width: 50px;
    height: 26px;
  }
  
  .form-check-input:checked {
    background-color: #198754;
    border-color: #198754;
  }
  
  .page-icon {
    font-size: 1.25rem;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #e7f1ff;
    border-radius: 8px;
    color: #0d6efd;
  }
  
  /* CARDS */
  .card {
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  h2 {
    font-weight: 600;
  }
  
  #loadingState,
  #errorState {
    min-height: 200px;
  }
  
  #successMessage {
    animation: fadeIn 0.3s ease;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
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
  
  body.dark-mode.gradient-glassmorphism .card {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.05);
  }
  
  body.dark-mode.gradient-glassmorphism .card-header {
    background: linear-gradient(135deg, rgba(100, 100, 255, 0.2), rgba(150, 50, 255, 0.2));
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.95);
  }
  
  body.dark-mode.gradient-glassmorphism .card-body {
    color: rgba(255, 255, 255, 0.9);
  }
  
  body.dark-mode.gradient-glassmorphism .list-group-item {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.85);
  }
  
  body.dark-mode.gradient-glassmorphism .list-group-item:hover {
    background: rgba(255, 255, 255, 0.08);
  }
  
  body.dark-mode.gradient-glassmorphism .list-group-item.dragging {
    background: rgba(255, 255, 255, 0.12);
    border: 2px dashed rgba(150, 100, 255, 0.5);
  }
  
  body.dark-mode.gradient-glassmorphism .drag-handle {
    color: rgba(255, 255, 255, 0.6);
  }
  
  body.dark-mode.gradient-glassmorphism .drag-handle:hover {
    color: rgba(150, 100, 255, 0.8);
  }
  
  body.dark-mode.gradient-glassmorphism .page-icon {
    background: rgba(100, 100, 255, 0.15);
    color: rgba(200, 200, 255, 0.9);
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
  
  body.dark-mode.gradient-glassmorphism .btn-light {
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: rgba(255, 255, 255, 0.9);
  }
  
  body.dark-mode.gradient-glassmorphism .btn-light:hover {
    background: rgba(255, 255, 255, 0.12);
  }
  
  body.dark-mode.gradient-glassmorphism .alert {
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }
  
  body.dark-mode.gradient-glassmorphism .alert-danger {
    background: rgba(255, 80, 80, 0.15);
    border-color: rgba(255, 80, 80, 0.3);
    color: rgba(255, 200, 200, 0.95);
  }
  
  body.dark-mode.gradient-glassmorphism .alert-success {
    background: rgba(50, 200, 100, 0.15);
    border-color: rgba(50, 200, 100, 0.3);
    color: rgba(200, 255, 200, 0.95);
  }
`;
export const cssFile = 'create.css';
