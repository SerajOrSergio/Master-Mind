// Auto-generated from subscription.css — styles verbatim; the
// build (scripts/generate-pages.mjs) writes subscription.css from this.
export const css = `
  body {
    font-family: Arial, sans-serif;
    background: #f8f9fa;
    margin: 0;
    padding: 0;
  }
  .subscription-container {
    background: #fff;
    max-width: 700px;
    margin: 40px auto;
    padding: 32px 24px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  }
  h2, h3 {
    text-align: center;
  }
  .form-group {
    margin-bottom: 18px;
    display: flex;
    flex-direction: column;
  }
  label {
    margin-bottom: 6px;
    font-weight: 500;
  }
  input, select {
    padding: 8px 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
  }
  /* Exclude the shared header controls (burger .navbar-toggler, .undo-btn) and
     Bootstrap .btn buttons so they keep the uniform design used across the
     whole portal — the same look as pricing / teachers pages. */
  button:not(.undo-btn):not(.navbar-toggler):not(.btn) {
    background: #007bff;
    color: #fff;
    border: none;
    cursor: pointer;
    margin-top: 10px;
    transition: background 0.2s;
  }
  button:not(.undo-btn):not(.navbar-toggler):not(.btn):hover {
    background: #0056b3;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 24px;
  }
  th, td {
    padding: 10px;
    border: 1px solid #e0e0e0;
    text-align: center;
  }
  tr.expired {
    background: #ffcccc;
  }
  tr.inuse {
    background: #fff3cd;
  }
  tr.new {
    background: #d4edda;
  }
  
  /* ================= INLINE EDITABLE CELLS =================
     Same smooth pattern as the teachers/students pages: cells stay plain until
     clicked, then a form-control input is swapped in (Enter/blur saves,
     Escape cancels). No dashed outlines or permanent edit affordances. */
  .editable,
  .editable-type-cell,
  .editable-issued-cell {
    cursor: pointer;
    position: relative;
    transition: background 0.15s ease;
  }
  .editable .form-control,
  .editable-issued-cell .form-control,
  .editable-type-cell .form-select {
    min-width: 80px;
  }
  .editable:empty::before {
    content: 'Click to edit';
    color: #aaa;
    font-style: italic;
  }
  
  /* ================= DARK MODE - GRADIENT GLASSMORPHISM ================= */
  body.dark-mode.gradient-glassmorphism {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%);
    min-height: 100vh;
    color: rgba(255, 255, 255, 0.9);
  }
  
  body.dark-mode.gradient-glassmorphism .subscription-container {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    padding: 2rem;
    margin: 1rem;
  }
  
  body.dark-mode.gradient-glassmorphism h2,
  body.dark-mode.gradient-glassmorphism h3 {
    color: rgba(255, 255, 255, 0.95);
    text-shadow: 0 0 20px rgba(150, 100, 255, 0.3);
  }
  
  body.dark-mode.gradient-glassmorphism label {
    color: rgba(255, 255, 255, 0.85);
  }
  
  body.dark-mode.gradient-glassmorphism input,
  body.dark-mode.gradient-glassmorphism select {
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }
  
  body.dark-mode.gradient-glassmorphism input:focus,
  body.dark-mode.gradient-glassmorphism select:focus {
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(150, 100, 255, 0.5);
    color: rgba(255, 255, 255, 0.95);
    box-shadow: 0 0 15px rgba(150, 100, 255, 0.3);
  }
  
  /* No generic dark-mode button overrides here: action buttons (Save / Delete /
     Reset) use their Bootstrap classes + the shared 2.0design.css theme,
     matching the receptionist portal's subscription page design exactly. The
     header controls (burger .navbar-toggler, undo .undo-btn) are unaffected
     either way. */
  
  body.dark-mode.gradient-glassmorphism .table {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }
  
  body.dark-mode.gradient-glassmorphism th {
    background: linear-gradient(135deg, rgba(100, 100, 255, 0.15), rgba(150, 50, 255, 0.15));
    border-bottom: 1px solid rgba(255, 255, 255, 0.15);
    color: rgba(255, 255, 255, 0.95);
  }
  
  body.dark-mode.gradient-glassmorphism td {
    color: rgba(255, 255, 255, 0.85);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  body.dark-mode.gradient-glassmorphism tr.expired {
    background: rgba(255, 80, 80, 0.15);
  }
  
  body.dark-mode.gradient-glassmorphism tr.inuse {
    background: rgba(255, 200, 50, 0.15);
  }
  
  body.dark-mode.gradient-glassmorphism tr.new {
    background: rgba(50, 200, 100, 0.15);
  }
  
  body.dark-mode.gradient-glassmorphism .btn-danger {
    background: #E23E3E;
    border: 1px solid transparent;
    color: #fff;
  }
  
  body.dark-mode.gradient-glassmorphism .btn-danger:hover {
    background: #C93030;
    color: #fff;
  }
  
  /* iOS Safari ignores placeholder text on native date/time inputs, leaving
     the field blank on mobile. Render the placeholder text ourselves here —
     scoped to iOS (WebKit-only -webkit-touch-callout + touch-only media) so
     Chromium (desktop/Android) keeps its built-in placeholder text. */
  @supports (-webkit-touch-callout: none) {
    @media (hover: none) and (pointer: coarse) {
      /* Keep date/time fields the same size as regular inputs: absolutely
         position the fake placeholder so it overlays the box instead of
         stretching it taller. */
      input[type="date"],
      input[type="time"] {
        position: relative;
      }
      input[type="date"]:before,
      input[type="time"]:before {
        content: attr(placeholder);
        color: #6c757d;
        position: absolute;
        left: 0.75rem;
        top: 50%;
        transform: translateY(-50%);
        white-space: nowrap;
        pointer-events: none;
      }
      /* Hide the fake placeholder once a value is picked: required date/time
         fields are :invalid while empty and :valid once filled. */
      input[type="date"]:valid:before,
      input[type="time"]:valid:before {
        content: "";
      }
    }
  }
  
  /* ================= ADD SUBJECT EDITOR ROW =================
     Inline editor that opens under a student row to add another
     subject + price subscription for that student. */
  tr.add-subject-editor-row td {
    background: #f1f5ff;
    border-left: 3px solid #6C4DF6;
    text-align: left;
  }
  .add-subject-field .form-label {
    font-size: 12px;
    color: #555;
  }
  body.dark-mode.gradient-glassmorphism tr.add-subject-editor-row td {
    background: rgba(150, 100, 255, 0.1);
    border-left: 3px solid #9632ff;
  }
  body.dark-mode.gradient-glassmorphism .add-subject-field .form-label {
    color: rgba(255, 255, 255, 0.75);
  }
`;
export const cssFile = 'subscription.css';
