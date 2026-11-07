
// Use event delegation to handle dynamically injected logout buttons
document.addEventListener('click', function (e) {
  if (e.target.closest('#logout-btn') || e.target.closest('#logout-btn-mobile')) {
    // Try to save session draft to backend before logout
    const draftRaw = localStorage.getItem('sessionFormDraft');
    const teacherId = localStorage.getItem('teacherId');
    if (draftRaw && teacherId) {
      try {
        const draft = JSON.parse(draftRaw);
        // Save draft to backend
        fetch('/api/session-draft', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ teacherId, draft })
        })
        .finally(() => {
          localStorage.clear();
          sessionStorage.clear();
          window.location.href = '/login';
        });
        return;
      } catch (e) {
        // If error, just proceed to logout
      }
    }
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/login';
  }
});
