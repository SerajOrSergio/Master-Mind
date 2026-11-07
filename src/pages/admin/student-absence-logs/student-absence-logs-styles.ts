// Auto-generated from student-absence-logs.css — styles verbatim; the
// build (scripts/generate-pages.mjs) writes student-absence-logs.css from this.
export const css = `
  
  body { background: #f8fafc; }
  
  /* ========== Filter card (same as the Paid page) ========== */
  .absence-filter-card {
    background: #fff;
    border: 1px solid #eef2f8;
    border-radius: 1rem;
    padding: 1rem 1.15rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
    margin-bottom: 1.25rem;
  }
  .absence-filter-card .form-control,
  .absence-filter-card .form-select {
    border-radius: 0.6rem;
  }
  .absence-filter-card #searchInput {
    max-width: none;
    flex: 1 1 260px;
  }
  .absence-filter-summary {
    font-size: 0.82rem;
    min-height: 1.1rem;
  }
  
  /* ========== Absence log cards - organized header ========== */
  .absence-log-card {
    border-radius: 1rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    border: 1px solid #eef2f8;
    margin-bottom: 1.25rem;
    overflow: hidden;
  }
  .absence-log-card .card-body {
    padding: 1.35rem 1.4rem;
  }
  .absence-log-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0.9rem;
    margin-bottom: 1rem;
  }
  .absence-log-title {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    min-width: 0;
  }
  .absence-subject-icon {
    width: 42px;
    height: 42px;
    border-radius: 0.8rem;
    background: rgba(108, 77, 246, 0.1);
    color: #6c4df6;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 1.15rem;
    flex: none;
  }
  .absence-subject-name {
    font-size: 1.15rem;
    font-weight: 700;
    color: #0a2540;
    line-height: 1.25;
  }
  .absence-count-pill {
    flex: none;
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    background: #fbe3e3;
    color: #c22a2a;
    font-size: 0.78rem;
    font-weight: 650;
    border-radius: 2rem;
    padding: 0.35rem 0.9rem;
    white-space: nowrap;
  }
  /* meta grid: Classroom / Teacher / Date / Time */
  .absence-log-meta {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 0.6rem;
    margin-bottom: 0.9rem;
  }
  .absence-meta-item {
    background: #f8fafc;
    border: 1px solid #eef2f8;
    border-radius: 0.7rem;
    padding: 0.5rem 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    min-width: 0;
  }
  .absence-meta-label {
    font-size: 0.66rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: #96907f;
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
  }
  .absence-meta-label i {
    font-size: 0.72rem;
  }
  .absence-meta-value {
    font-size: 0.88rem;
    font-weight: 600;
    color: #1c1814;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .absence-duration {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.8rem;
    color: #6b645a;
    margin-bottom: 0.95rem;
  }
  .absence-students-heading {
    font-weight: 650;
    font-size: 0.88rem;
    color: #1e293b;
    margin-bottom: 0.65rem;
  }
  
  /* absent students grid */
  .absence-students-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 0.6rem;
    margin-top: 0.4rem;
  }
  .absence-student-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    background: #fff;
    border: 1px solid #e5e9f0;
    border-radius: 0.7rem;
    padding: 0.55rem 0.85rem;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
  }
  .absence-student-row:hover {
    border-color: #c9b8f8;
    box-shadow: 0 2px 8px rgba(108, 77, 246, 0.08);
  }
  .absence-student-name {
    font-weight: 600;
    color: #1e293b;
    display: inline-flex;
    align-items: center;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .absence-delete-btn {
    flex: none;
    font-size: 0.82rem;
    font-weight: 600;
    border-radius: 0.6rem;
    padding: 0.3rem 0.75rem;
    white-space: nowrap;
  }
  
  #main-content {
    width: 100%;
    margin: 0 0 0 260px;
    max-width: calc(100% - 260px);
    padding: 2.5rem 2.5vw 2.5rem 0.5vw;
    background: #f8fafc;
  }
  .card {
    border-radius: 1rem;
    box-shadow: 0 2px 8px #0001;
    border: none;
  }
  .card-body {
    padding: 2rem 1.5rem;
  }
  .table th, .table td { vertical-align: middle; }
  #searchInput { max-width: 420px; }
  @media (max-width: 767.98px) {
    .card {
      margin: 1rem 0;
      border-radius: 0.7rem;
    }
    .card-body {
      padding: 1.25rem 1rem;
    }
    #main-content {
      margin-left: 0;
      max-width: 100vw;
      padding: 1rem 0.75rem;
    }
    .absence-students-grid {
      grid-template-columns: 1fr;
    }
    .absence-meta {
      white-space: normal;
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
  
  body.dark-mode.gradient-glassmorphism .page-title {
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
  
  body.dark-mode.gradient-glassmorphism .card-body {
    color: rgba(255, 255, 255, 0.9);
  }
  
  /* Project1 dark theme: white log cards on the cream canvas with purple
     classroom badges and clean white student rows (the shared 2.0design.css
     already turns the .card white — these rules finish the custom bits). */
  body.dark-mode.gradient-glassmorphism .absence-log-card .fw-bold.fs-5 {
    color: #1C1814;
  }
  
  body.dark-mode.gradient-glassmorphism .absence-log-card .badge.bg-primary {
    background: #6C4DF6;
  }
  
  body.dark-mode.gradient-glassmorphism .absence-student-row {
    background: #FFFFFF;
    border: 1px solid #E8E0D3;
  }
  
  body.dark-mode.gradient-glassmorphism .absence-student-row:hover {
    border-color: #6C4DF6;
    box-shadow: 0 2px 8px rgba(108, 77, 246, 0.12);
  }
  
  body.dark-mode.gradient-glassmorphism .absence-student-name {
    color: #1C1814;
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
export const cssFile = 'student-absence-logs.css';
