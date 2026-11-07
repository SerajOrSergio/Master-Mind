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
  
  /* Action buttons (Reset/Delete) styled by
     /src/components/receptionist/action-buttons/action-buttons.css
     — same design as the admin portal teachers page. */
  
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
`;
export const cssFile = 'teachers.css';
