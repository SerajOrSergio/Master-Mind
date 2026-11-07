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
  #studentAbsenceLogsTableBody .absence-log-card {
    border-radius: 1rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    border: 1px solid #eef2f8;
    margin-bottom: 1.25rem;
    overflow: hidden;
  }
  #studentAbsenceLogsTableBody .absence-log-card .card-body {
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
    max-width: none;
    margin: 0;
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
  #searchInput { max-width: 400px; }
  @media (max-width: 767.98px) {
    .card {
      margin: 1rem 0.2rem;
      border-radius: 0.7rem;
    }
    .card-body {
      padding: 1.2rem 0.5rem;
    }
    #main-content {
      padding: 1rem 0.2rem;
    }
  }
`;
export const cssFile = 'student-absence-logs.css';
