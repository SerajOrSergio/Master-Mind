// Dynamically load the teacher header into the page
window.addEventListener('DOMContentLoaded', function () {
  const headerContainer = document.getElementById('teacher-header-container');
  if (headerContainer) {
    fetch('/src/components/teacher/header/header.html')
      .then(res => res.text())
      .then(html => {
        headerContainer.innerHTML = html;
        // Wire up the Undo button using the same undo manager shared by the
        // admin and receptionist portals (it also exposes window.pushAction /
        // window.createCustomAction for the page scripts).
        return import('/assist/undo-manager.js');
      })
      .then(mod => {
        if (mod && mod.setupUndoButton) mod.setupUndoButton();
      })
      .catch(err => console.warn('Undo manager failed to load:', err));
  }
});
