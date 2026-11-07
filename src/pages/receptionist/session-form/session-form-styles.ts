// Auto-generated from session-form.css — styles verbatim; the
// build (scripts/generate-pages.mjs) writes session-form.css from this.
export const css = `
  /* Hide session form action buttons but keep DOM for JS logic */
  #saveDraftBtn, #openDraftsBtn, #submitAttendanceBtn, #markAbsenceBtn {
    display: none !important;
  }
  /* Hide the bottom add student input/button but keep in DOM for JS logic */
  #studentDraftInput, #addStudentTypedBtn {
    display: none !important;
  }
  /* ========== Session Form Specific Styles ========== */
  
  
  .session-form-wrapper {
    width: 100%;
    max-width: none;
    margin: 0;
    padding: 2.5rem 2.5vw 2.5rem 0.5vw;
    background: #f8fafc;
  }
  
  
  .session-card {
    background: transparent;
    border-radius: 0;
    box-shadow: none;
    padding: 0;
    border: none;
  }
  
  .page-title {
    font-size: 1.9rem;
    font-weight: 700;
    letter-spacing: -0.3px;
    color: #0a2540;
    margin-bottom: 0.3rem;
  }
  
  .page-subtitle {
    font-size: 1rem;
    color: #5c6f87;
    margin-bottom: 1.8rem;
    border-left: 3px solid #3b82f6;
    padding-left: 0.9rem;
  }
  
  
  .form-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 1.4rem;
  }
  
  .form-grid .input-field {
    flex: 1 1 260px;
  }
  
  .choice-label {
    font-weight: 600;
    color: #1e293b;
    margin-right: 1rem;
    margin-bottom: 0.5rem;
    display: inline-block;
  }
  
  
  .choice-row {
    margin-bottom: 1.5rem;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: 0.75rem;
  }
  
  /* Make time window row scrollable if too wide */
  #timeSlotsContainer {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    overflow-x: auto;
    overflow-y: visible;
    white-space: nowrap;
    width: 100%;
    gap: 8px;
    padding-bottom: 8px;
    scrollbar-width: thin;
    scrollbar-color: #cbd5e1 #f1f5f9;
  }
   #timeSlotsContainer::-webkit-scrollbar {
    height: 8px;
  }
  #timeSlotsContainer::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 8px;
  }
  #timeSlotsContainer::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 8px;
  }
  
  .choice-wrap {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
    align-items: center;
  }
  
  .choice-chip {
    background: #f8fafc;
    border: 1.5px solid #e2e8f0;
    border-radius: 2rem;
    padding: 0.45rem 1.2rem;
    font-size: 0.9rem;
    font-weight: 500;
    color: #1e293b;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .choice-chip-active {
    background: #e0e7ff;
    border-color: #3b82f6;
    color: #1e40af;
  }
  
  .classroom-tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 0.8rem;
  }
  
  .classroom-tab {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 2rem;
    padding: 0.4rem 1.1rem 0.4rem 0.8rem;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .classroom-tab-active {
    background: #f1f5f9;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px #dbeafe;
  }
  
  .classroom-color-dot {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #cbd5e1;
    border: 1px solid #94a3b8;
  }
  
  /* Time chip editable */
  .time-chip-editable {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #f1f5f9;
    border: 1px solid #cbd5e1;
    border-radius: 2rem;
    padding: 0.35rem 1rem 0.35rem 1.2rem;
    font-size: 0.85rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .time-chip-editable.selected {
    background: #d9e6ff;
    border-color: #3b82f6;
    color: #1e3a8a;
  }
  
  .edit-time-icon {
    font-size: 0.8rem;
    color: #6c757d;
    cursor: pointer;
    padding: 0 2px;
  }
  
  .edit-time-icon:hover {
    color: #0d6efd;
  }
  
  /* Student card row */
  
  .student-session-row {
    background: #fff;
    border-radius: 1.25rem;
    border: 1px solid #eef2f8;
    padding: 1.2rem 1.5rem;
    margin-bottom: 1rem;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    box-shadow: 0 1px 3px rgba(0,0,0,0.02);
  }
  
  .student-info-area {
    flex: 3;
    min-width: 220px;
  }
  
  /* Student name row + subscription pill (Project1 2.0 style) */
  .student-name-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.6rem;
  }
  
  .sub-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.3rem 0.8rem;
    border-radius: 2rem;
    font-size: 0.72rem;
    font-weight: 650;
    letter-spacing: 0.01em;
  }
  
  .sub-badge-ok {
    background: #e7f4eb;
    color: #1e7a48;
  }
  
  .sub-badge-none {
    background: #fdf1dc;
    color: #9a6700;
  }
  
  .sub-badge-warn {
    background: #fff3d6;
    color: #92400e;
    border: 1px solid #f0c36d;
  }
  
  .sub-badge-done {
    background: #fbe3e3;
    color: #c22a2a;
    border: 1px solid #f0b4b4;
  }
  
  /* Banner on a student card when the next session completes the subscription */
  .sub-last-notice,
  .sub-done-notice {
    display: flex;
    align-items: flex-start;
    gap: 0.45rem;
    margin-top: 0.6rem;
    padding: 0.45rem 0.8rem;
    border-radius: 0.6rem;
    font-size: 0.78rem;
    font-weight: 500;
    line-height: 1.4;
  }
  
  .sub-last-notice {
    background: #fff7e6;
    border: 1px solid #f0c36d;
    color: #7c5a03;
  }
  
  .sub-done-notice {
    background: #fbe3e3;
    border: 1px solid #f0b4b4;
    color: #a02020;
  }
  
  .sub-last-notice i,
  .sub-done-notice i {
    margin-top: 2px;
    flex-shrink: 0;
  }
  
  /* Action buttons: tidy row of soft pills */
  .student-actions-area {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-end;
    gap: 0.55rem;
  }
  
  .mode-btn,
  .save-draft-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    border-radius: 2rem;
    padding: 0.45rem 1.1rem;
    font-size: 0.8rem;
    font-weight: 600;
    border: 1.5px solid transparent;
    cursor: pointer;
    line-height: 1.2;
    transition: all 0.2s ease;
  }
  
  .mode-btn {
    background: #f2ede3;
    color: #6b645a;
  }
  
  .mode-btn:hover {
    border-color: #6c4df6;
    color: #6c4df6;
  }
  
  .mode-btn-leaving {
    background: #fbe3e3;
    color: #c22a2a;
  }
  
  .mode-btn-draft {
    background: #e5f0fe;
    color: #1d5fa8;
  }
  
  .mode-btn-absent {
    background: #fbe3e3;
    color: #c22a2a;
  }
  
  .mode-btn-absent:hover {
    background: #f6d1d1;
    border-color: #c22a2a;
  }
  
  .mode-btn-active {
    box-shadow: 0 0 0 2px currentColor;
    font-weight: 700;
  }
  
  .save-draft-btn {
    background: #ece7fd;
    color: #6c4df6;
    border: none;
  }
  
  .save-draft-btn:hover {
    background: #e0d8fb;
    box-shadow: 0 4px 12px rgba(108, 77, 246, 0.18);
  }
  
  .remove-student {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: #fbe3e3;
    color: #c22a2a;
    border: none;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .remove-student:hover {
    background: #c22a2a;
    color: #fff;
    transform: scale(1.05);
  }
  
  .student-hours-chip {
    display: inline-flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    margin: 0.5rem 0;
  }
  
  .small-chip {
    background: #f1f5f9;
    border-radius: 1.5rem;
    padding: 0.2rem 0.8rem;
    font-size: 0.75rem;
    font-weight: 500;
    cursor: pointer;
    border: 1px solid #cbd5e1;
  }
  
  .small-chip.selected {
    background: #2563eb;
    color: white;
    border-color: #2563eb;
  }
  
  .quick-student-btn {
    background: #eef2ff;
    border-radius: 2rem;
    padding: 0.3rem 1rem;
    font-size: 0.85rem;
    font-weight: 500;
    margin-right: 0.5rem;
    margin-bottom: 0.5rem;
    cursor: pointer;
    border: none;
  }
  
  .quick-student-btn:hover {
    background: #d9e6ff;
  }
  
  /* ========== Create New Student section (blends with the form cards) ========== */
  #createStudentSection.create-student-section {
    background: #fff;
    border: 1px solid #eef2f8;
    border-radius: 1.25rem;
    padding: 1.15rem 1.4rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
  }
  
  #createStudentSection .create-student-heading {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.95rem;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 0.85rem;
  }
  
  #createStudentSection .create-student-heading i {
    color: #6c4df6;
    font-size: 1.05rem;
    line-height: 1;
  }
  
  #createStudentSection .create-student-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    background: #ece7fd;
    color: #6c4df6;
    border: none;
    border-radius: 2rem;
    padding: 0.4rem 1.1rem;
    font-size: 0.85rem;
    font-weight: 600;
    line-height: 1.5;
    min-height: calc(1.5rem + 0.75rem + 2px);
    transition: all 0.2s ease;
  }
  
  #createStudentSection .create-student-btn:hover {
    background: #e0d8fb;
    color: #6c4df6;
    box-shadow: 0 4px 12px rgba(108, 77, 246, 0.18);
  }
  
  #createStudentSection .create-student-btn:active {
    transform: scale(0.98);
  }
  
  /* Calendar popup */
  .calendar-popup {
    position: absolute;
    background: white;
    border-radius: 1rem;
    box-shadow: 0 12px 30px rgba(0,0,0,0.15);
    padding: 1rem;
    z-index: 1000;
    width: 280px;
    border: 1px solid #e2e8f0;
    margin-top: 0.5rem;
  }
  
  .relative {
    position: relative;
  }
  
  .calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;
  }
  
  .calendar-cell {
    text-align: center;
    padding: 6px 0;
    border-radius: 30px;
    cursor: pointer;
  }
  
  .calendar-cell-active {
    background: #3b82f6;
    color: white;
  }
  
  .error-text {
    color: #dc2626;
    font-size: 0.8rem;
    margin-top: 0.3rem;
  }
  
  .success-text {
    color: #16a34a;
    font-size: 0.8rem;
  }
  
  .btn-save-attendance {
    background: #2563eb;
    border-radius: 2rem;
    padding: 0.5rem 1.8rem;
    font-weight: 600;
  }
  
  /* Session form date input modern style */
  #dateButton[type="date"] {
    background: #fff;
    border: 1.5px solid #cbd5e1;
    border-radius: 8px;
    padding: 8px 16px;
    font-size: 1.1em;
    width: 100%;
    max-width: 260px;
    box-shadow: 0 1px 2px rgba(0,0,0,0.03);
    color: #222;
  }
  #dateButton[type="date"]::placeholder {
    color: #b0b0b0;
    font-size: 1em;
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
  /* Show calendar icon for date input (browser default) */
  
  /* Responsive */
  @media (max-width: 700px) {
    .session-card {
      padding: 1.2rem;
    }
    .student-session-row {
      flex-direction: column;
    }
    .student-actions-area {
      justify-content: flex-start;
      width: 100%;
    }
  }
  
  /* Sidebar integration */
  #main-content {
    background: #f5f6fa !important;
    min-height: 100vh;
    transition: margin-left 0.2s;
  }
  
  @media (min-width: 768px) {
    #main-content {
      margin-left: 250px !important;
      max-width: calc(100% - 250px) !important;
    }
  }
`;
export const cssFile = 'session-form.css';
