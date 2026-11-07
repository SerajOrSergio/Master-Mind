// Setup burger menu button to toggle sidebar/offcanvas.
//
// Bootstrap 5 (5.0.2 included) registers a DELEGATED document-level click
// handler for `[data-bs-toggle="offcanvas"]`, so a dynamically-injected burger
// button opens the offcanvas automatically — no manual wiring needed.
// Binding our own click handler on top of that would DOUBLE-TOGGLE the panel
// (our show() plus Bootstrap's own toggle()), which made the burger appear
// dead on some pages. We therefore only take over manually when the Bootstrap
// bundle is unavailable (and the header may not be injected yet, so retry).
export function setupBurgerMenu() {
  if (typeof bootstrap !== 'undefined' && bootstrap.Offcanvas) return;

  const bind = () => {
    const burger = document.getElementById('burgerMenuBtn');
    if (!burger || burger.dataset.burgerBound === 'true') return false;
    burger.dataset.burgerBound = 'true';
    burger.addEventListener('click', () => {
      const offcanvas = document.querySelector('.offcanvas');
      const sidebar = document.querySelector('.sidebar');
      if (offcanvas) {
        const show = !offcanvas.classList.contains('show');
        offcanvas.classList.toggle('show', show);
        offcanvas.setAttribute('aria-hidden', show ? 'false' : 'true');
      }
      if (sidebar) sidebar.classList.toggle('sidebar-open');
    });
    return true;
  };

  if (!bind()) {
    // The header (with the burger button) may not be injected yet — watch the
    // DOM and bind as soon as it appears (safeguard for non-Bootstrap pages).
    const observer = new MutationObserver(() => {
      if (bind()) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(() => observer.disconnect(), 5000);
  }
}

// Undo functionality is centralized in the shared undo-manager (same one used
// by the admin and receptionist portals) so every portal uses a single undo
// stack and button implementation.
export {
  pushUndoAction,
  popUndoAction,
  hasUndo,
  canUndo,
  pushAction,
  executeUndo,
  setupUndoButton,
  createDeleteAction,
  createAddAction,
  createEditAction,
  createCustomAction
} from '../../../../assist/undo-manager.js';
