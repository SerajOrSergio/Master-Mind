// Auto-generated from classrooms.css — styles verbatim; the
// build (scripts/generate-pages.mjs) writes classrooms.css from this.
export const css = `
  /* MAIN LAYOUT */
  #main-content {
    margin-left: 260px;
    max-width: calc(100% - 260px);
    background: #fff;
    border-radius: 12px;
    padding: 2rem;
  }
  
  /* MOBILE */
  @media (max-width: 991px) {
    #main-content {
      margin-left: 0;
      max-width: 100%;
      padding: 1rem;
    }
  }
  
  /* TABLE */
  #classroomsTable .grab-handle {
    cursor: grab;
    font-weight: bold;
  }
  
  #classroomsTable .grab-handle:active {
    cursor: grabbing;
  }
  
  #classroomsTable tr[draggable="true"] {
    cursor: grab;
  }
  
  #classroomsTable tr[draggable="true"]:active {
    cursor: grabbing;
  }
  
  #classroomsTable tr:hover {
    background: #f3f6fd;
  }
  
  /* Drag and drop reorder feedback */
  #classroomsTable tr.dragging {
    opacity: 0.45;
    background: rgba(108, 77, 246, 0.08) !important;
  }
  
  #classroomsTable tr.drag-over {
    background: rgba(108, 77, 246, 0.06) !important;
  }
  
  #classroomsTable tr.drag-over td:first-child {
    box-shadow: inset 3px 0 0 0 #6C4DF6;
  }
  
  
  /* CARDS */
  .card {
    border-radius: 12px;
  }
  
  h2 {
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
    color: rgba(255, 255, 255, 0.9);
  }
  
  body.dark-mode.gradient-glassmorphism h2 {
    color: rgba(255, 255, 255, 0.95);
    text-shadow: 0 0 20px rgba(150, 100, 255, 0.3);
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
  
  body.dark-mode.gradient-glassmorphism .form-control,
  body.dark-mode.gradient-glassmorphism .form-control-color {
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }
  
  body.dark-mode.gradient-glassmorphism .form-control:focus,
  body.dark-mode.gradient-glassmorphism .form-control-color:focus {
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(150, 100, 255, 0.5);
    color: rgba(255, 255, 255, 0.95);
    box-shadow: 0 0 15px rgba(150, 100, 255, 0.3);
  }
  
  body.dark-mode.gradient-glassmorphism .form-label {
    color: rgba(255, 255, 255, 0.85);
  }
  
  body.dark-mode.gradient-glassmorphism .btn-primary {
    background: linear-gradient(135deg, rgba(100, 100, 255, 0.4), rgba(150, 50, 255, 0.4));
    border: 1px solid rgba(150, 100, 255, 0.5);
    color: #fff;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    transition: all 0.3s ease;
  }
  
  body.dark-mode.gradient-glassmorphism .btn-primary:hover {
    background: linear-gradient(135deg, rgba(100, 100, 255, 0.6), rgba(150, 50, 255, 0.6));
    border-color: rgba(200, 150, 255, 0.7);
    box-shadow: 0 4px 20px rgba(150, 100, 255, 0.4);
    transform: translateY(-2px);
  }
  
  body.dark-mode.gradient-glassmorphism .btn-success {
    background: linear-gradient(135deg, rgba(50, 200, 100, 0.4), rgba(30, 150, 80, 0.4));
    border: 1px solid rgba(50, 200, 100, 0.5);
    color: #fff;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }
  
  body.dark-mode.gradient-glassmorphism .btn-success:hover {
    background: linear-gradient(135deg, rgba(50, 200, 100, 0.6), rgba(30, 150, 80, 0.6));
    box-shadow: 0 4px 20px rgba(50, 200, 100, 0.4);
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
  
  body.dark-mode.gradient-glassmorphism .table {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }
  
  body.dark-mode.gradient-glassmorphism .table thead th {
    background: linear-gradient(135deg, rgba(100, 100, 255, 0.15), rgba(150, 50, 255, 0.15));
    border-bottom: 1px solid rgba(255, 255, 255, 0.15);
    color: rgba(255, 255, 255, 0.95);
  }
  
  body.dark-mode.gradient-glassmorphism .table tbody tr {
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    color: rgba(255, 255, 255, 0.85);
  }
  
  body.dark-mode.gradient-glassmorphism .table tbody tr:hover {
    background: rgba(255, 255, 255, 0.08);
  }
  
  body.dark-mode.gradient-glassmorphism .text-muted {
    color: rgba(255, 255, 255, 0.5) !important;
  }
  
  body.dark-mode.gradient-glassmorphism .alert {
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }
  
  body.dark-mode.gradient-glassmorphism .alert-info {
    background: rgba(100, 150, 255, 0.15);
    border-color: rgba(100, 150, 255, 0.3);
    color: rgba(200, 220, 255, 0.95);
  }
  
  body.dark-mode.gradient-glassmorphism .alert-success {
    background: rgba(50, 200, 100, 0.15);
    border-color: rgba(50, 200, 100, 0.3);
    color: rgba(200, 255, 200, 0.95);
  }
  
  body.dark-mode.gradient-glassmorphism .alert-danger {
    background: rgba(255, 80, 80, 0.15);
    border-color: rgba(255, 80, 80, 0.3);
    color: rgba(255, 200, 200, 0.95);
  }
  
  body.dark-mode.gradient-glassmorphism .form-check-input {
    background-color: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.3);
  }
  
  body.dark-mode.gradient-glassmorphism .form-check-input:checked {
    background-color: rgba(150, 100, 255, 0.8);
    border-color: rgba(150, 100, 255, 0.8);
  }
  
  body.dark-mode.gradient-glassmorphism .form-check-label {
    color: rgba(255, 255, 255, 0.9);
  }
`;
export const cssFile = 'classrooms.css';
