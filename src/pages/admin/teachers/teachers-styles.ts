// Auto-generated from teachers.css — styles verbatim; the
// build (scripts/generate-pages.mjs) writes teachers.css from this.
export const css = `
  /* Teachers Page Styles */
  .admin-container { display: flex; }
  #sidebar { width: 220px; min-height: 100vh; background: #f8f9fa; }
  .main-content { flex: 1; padding: 2rem; }
  form#teacherForm { background: #fff; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 8px #0001; margin-bottom: 2rem; }
  .subjects-container { display: flex; flex-wrap: wrap; gap: 0.5rem; }
  .subject-pill { padding: 0.5rem 1rem; border-radius: 20px; background: #e9ecef; cursor: pointer; user-select: none; transition: background 0.2s; }
  .subject-pill.selected { background: #007bff; color: #fff; }
  #teachersTableContainer { background: #fff; padding: 1rem; border-radius: 8px; box-shadow: 0 2px 8px #0001; }
  
  /* ACTIONS column — clean stacked buttons (no ugly text wrap) */
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
  
  /* Match grades table header background */
  .table th {
    background: #f1f5f9;
    font-weight: 600;
  }
  
  /* Popup for editing subjects in table */
  .subjects-edit-container {
  	position: absolute;
  	z-index: 10;
  	background: #fff;
  	border: 1px solid #dee2e6;
  	border-radius: 8px;
  	box-shadow: 0 2px 12px #0002;
  	padding: 0.75rem 1rem;
  	min-width: 220px;
  	display: flex;
  	flex-wrap: wrap;
  	gap: 0.5rem;
  }
  .editable[data-field="subjects"] { position: relative; }
  
  @media (max-width: 768px) {
    #main-content {
      margin-left: 0 !important;
      max-width: 100vw !important;
      padding: 0.5rem !important;
    }
    form#teacherForm {
      padding: 0.75rem;
    }
    #teachersTableContainer {
      padding: 0.5rem;
    }
    .subjects-container {
      gap: 0.25rem;
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
  
  body.dark-mode.gradient-glassmorphism form#teacherForm {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.05);
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
  
  body.dark-mode.gradient-glassmorphism .subject-pill {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: rgba(255, 255, 255, 0.85);
  }
  
  body.dark-mode.gradient-glassmorphism .subject-pill.selected {
    background: linear-gradient(135deg, rgba(100, 100, 255, 0.4), rgba(150, 50, 255, 0.4));
    border-color: rgba(150, 100, 255, 0.5);
    color: #fff;
  }
  
  body.dark-mode.gradient-glassmorphism #teachersTableContainer {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.05);
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
  
  body.dark-mode.gradient-glassmorphism .subjects-edit-container {
    background: rgba(30, 30, 50, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  }
`;
export const cssFile = 'teachers.css';
