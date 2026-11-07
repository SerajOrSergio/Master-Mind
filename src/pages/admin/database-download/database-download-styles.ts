// Auto-generated from database-download.css — styles verbatim; the
// build (scripts/generate-pages.mjs) writes database-download.css from this.
export const css = `
  .database-download-content {
    background: #f8f9fa;
    min-height: 100vh;
  }
  
  .card {
    border-radius: 10px;
  }
  
  .card-header {
    border-radius: 10px 10px 0 0 !important;
    padding: 1rem 1.5rem;
  }
  
  .list-group-item {
    border-left: none;
    border-right: none;
    gap: 0.75rem;
    min-width: 0;
  }
  
  .list-group-item:first-child {
    border-top: none;
  }
  
  .list-group-item:last-child {
    border-bottom: none;
  }
  
  /* File names truncate with an ellipsis instead of wrapping underneath the
     size badge — this fixes the overlap seen on narrow screens. */
  .list-group-item .file-name {
    flex: 1 1 auto;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-flex;
    align-items: center;
  }
  
  .list-group-item .file-size {
    flex: 0 0 auto;
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
  }
  
  /* ================= STORAGE SUMMARY PANEL ================= */
  .storage-summary {
    border-radius: 12px;
    background: linear-gradient(135deg, #f5f3ff 0%, #eef2ff 100%);
    border: 1px solid #e2e0ff !important;
  }
  
  .storage-summary .display-6 {
    font-size: 1.9rem;
    line-height: 1.15;
    color: #5b3df5;
  }
  
  .storage-summary .progress {
    background: rgba(91, 61, 245, 0.12);
    border-radius: 99px;
  }
  
  .storage-summary .progress-bar {
    background: linear-gradient(90deg, #6c4df6, #8b5cf6);
    border-radius: 99px;
    transition: width 0.4s ease;
  }
  
  /* ================= STORAGE BREAKDOWN ================= */
  #storage-breakdown {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }
  
  .breakdown-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    font-size: 0.85rem;
    color: #4b5563;
  }
  
  .breakdown-row .breakdown-folder {
    font-weight: 600;
    flex: 1 1 auto;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .breakdown-row .breakdown-files {
    flex: 0 0 auto;
    color: #6b7280;
    font-size: 0.78rem;
  }
  
  .breakdown-row .breakdown-size {
    flex: 0 0 auto;
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
    font-weight: 500;
  }
  
  body.dark-mode.gradient-glassmorphism .breakdown-row {
    color: rgba(255, 255, 255, 0.8);
  }
  
  body.dark-mode.gradient-glassmorphism .breakdown-row .breakdown-files {
    color: rgba(255, 255, 255, 0.5);
  }
  
  #download-btn {
    transition: all 0.3s ease;
  }
  
  #download-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  #download-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  #status-message {
    min-height: 20px;
  }
  
  .alert {
    border-radius: 8px;
  }
  
  @media (max-width: 768px) {
    .database-download-content {
      margin-left: 0 !important;
    }
  }
  
  /* ================= DARK MODE - GRADIENT GLASSMORPHISM ================= */
  body.dark-mode.gradient-glassmorphism {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%);
    min-height: 100vh;
    color: rgba(255, 255, 255, 0.9);
  }
  
  body.dark-mode.gradient-glassmorphism .database-download-content {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    padding: 2rem;
    margin: 1rem;
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
  
  body.dark-mode.gradient-glassmorphism .storage-summary {
    background: linear-gradient(135deg, rgba(108, 77, 246, 0.18), rgba(139, 92, 246, 0.08));
    border: 1px solid rgba(150, 100, 255, 0.35) !important;
  }
  
  body.dark-mode.gradient-glassmorphism .storage-summary .display-6 {
    color: #c9b8ff;
  }
  
  body.dark-mode.gradient-glassmorphism .storage-summary .progress {
    background: rgba(255, 255, 255, 0.12);
  }
  
  body.dark-mode.gradient-glassmorphism .text-muted {
    color: rgba(255, 255, 255, 0.5) !important;
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
`;
export const cssFile = 'database-download.css';
