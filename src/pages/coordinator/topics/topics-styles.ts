// Auto-generated from topics.css — styles verbatim; the
// build (scripts/generate-pages.mjs) writes topics.css from this.
export const css = `
  body {
    background: #f8f9fa;
  }
  
  @media (min-width: 768px) {
    .coordinator-header.d-md-flex,
    main.container {
      margin-left: 260px;
      width: calc(100% - 260px);
      max-width: calc(100% - 260px);
    }
  }
  
  @media (max-width: 767.98px) {
    main.container {
      margin-left: 0 !important;
      width: 100% !important;
      max-width: 100% !important;
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
  }
  
  #topics-list-section {
    background: #fff;
    padding: 24px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.03);
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
    z-index: 9999;
    position: absolute;
    max-height: 300px;
    overflow-y: auto;
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
