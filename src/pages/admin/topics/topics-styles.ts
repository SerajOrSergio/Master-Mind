// Auto-generated from topics.css — styles verbatim; the
// build (scripts/generate-pages.mjs) writes topics.css from this.
export const css = `
  body {
    background: #f8f9fa;
  }
  
  @media (min-width: 768px) {
  
    /* The admin header stays full-width (same as every other portal page) so
       the undo button sits in the identical position across the app. The
       fixed sidebar (250px, z-index 1040) simply overlays it on the left. */
  
    .main-content-container {
      margin-left: 260px;
      width: calc(100% - 260px);
      max-width: calc(100% - 260px);
  
      padding-left: 20px;
      padding-right: 20px;
  
      box-sizing: border-box;
    }
  
  }
  
  @media (max-width: 767.98px) {
  
    .main-content-container {
      margin-left: 0 !important;
      width: 100% !important;
      max-width: 100% !important;
  
      padding-left: 15px;
      padding-right: 15px;
    }
  
  }
  
  .table th {
    background: #f1f5f9;
    font-weight: 600;
  }
  
  #topics-form-section {
    background: #f8f9fa;
    padding: 24px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.03);
    position: relative;
    /* Must be higher than #topics-list-section (z-index 10) so open Choices.js
       dropdowns are not covered by the list panel rendered below the form. */
    z-index: 20;
  }
  
  #topics-list-section {
    background: #fff;
    padding: 24px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.03);
    position: relative;
    z-index: 10;
  }
  
  .card-topic {
    margin-bottom: 16px;
  }
  
  /* Choices.js dropdown styling */
  .choices__inner {
    background: #fff;
    border: 1px solid #ced4da;
    color: #212529;
    min-height: 38px;
  }
  
  .choices__list--dropdown {
    background: #fff;
    border: 1px solid #ced4da;
    color: #212529;
    z-index: 999999;
    position: absolute;
    max-height: 300px;
    overflow-y: auto;
    margin-top: 4px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  .choices__item--selectable {
    color: #212529;
    padding: 8px 12px;
  }
  
  .choices__item--selectable.is-highlighted {
    background: #0d6efd;
    color: #fff;
  }
  
  /* Dark mode for Choices.js dropdowns */
  body.dark-mode.gradient-glassmorphism .choices__inner {
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: rgba(255, 255, 255, 0.9);
  }
  
  body.dark-mode.gradient-glassmorphism .choices__list--dropdown {
    background: rgba(30, 30, 50, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    z-index: 999999;
    margin-top: 4px;
  }
  
  body.dark-mode.gradient-glassmorphism .choices__item--selectable {
    color: rgba(255, 255, 255, 0.9);
  }
  
  body.dark-mode.gradient-glassmorphism .choices__item--selectable.is-highlighted {
    background: rgba(100, 100, 255, 0.4);
    color: #fff;
  }
  
  /* Inline editing dropdowns */
  .form-select-sm {
    background: #fff;
    border: 1px solid #ced4da;
    color: #212529;
  }
  
  body.dark-mode.gradient-glassmorphism .form-select-sm {
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: rgba(255, 255, 255, 0.9);
  }
  
  /* ================= DARK MODE - GRADIENT GLASSMORPHISM ================= */
  body.dark-mode.gradient-glassmorphism {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%);
    min-height: 100vh;
    color: rgba(255, 255, 255, 0.9);
  }
  
  body.dark-mode.gradient-glassmorphism .main-content-container {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    padding: 2rem;
    margin: 1rem;
  }
  
  body.dark-mode.gradient-glassmorphism h1 {
    color: rgba(255, 255, 255, 0.95);
    text-shadow: 0 0 20px rgba(150, 100, 255, 0.3);
  }
  
  body.dark-mode.gradient-glassmorphism #topics-form-section {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.05);
  }
  
  body.dark-mode.gradient-glassmorphism #topics-list-section {
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
  
  /* Date and time picker z-index fixes */
  input[type="date"],
  input[type="time"] {
    position: relative;
    z-index: 1;
  }
  
  /* Date picker dropdown styles */
  input[type="date"]::-webkit-calendar-picker-indicator,
  input[type="time"]::-webkit-calendar-picker-indicator {
    cursor: pointer;
    z-index: 2;
  }
  
  /* Light mode date picker fixes */
  input[type="date"]::-webkit-datetime-edit,
  input[type="time"]::-webkit-datetime-edit {
    background: #fff;
    color: #212529;
  }
  
  /* Dark mode date picker fixes */
  body.dark-mode.gradient-glassmorphism input[type="date"]::-webkit-datetime-edit,
  body.dark-mode.gradient-glassmorphism input[type="time"]::-webkit-datetime-edit {
    background: rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 0.9);
  }
  
  /* iOS Safari ignores placeholder text on native date/time inputs, leaving
     the field blank on mobile. Render the placeholder text ourselves here —
     scoped to iOS (WebKit-only -webkit-touch-callout + touch-only media) so
     Chromium (desktop/Android) keeps its built-in mm/dd/yyyy / --:-- -- text. */
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
`;
export const cssFile = 'topics.css';
