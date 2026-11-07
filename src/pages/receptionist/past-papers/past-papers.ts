// Past Papers Page (Receptionist)
// The whole page implementation is shared with the admin portal, so both stay
// identical: see /src/pages/past-papers/past-papers-page.ts.
import { setupPastPapersPage } from '../../past-papers/past-papers-page.js';

document.addEventListener('DOMContentLoaded', () => {
  setupPastPapersPage({ sidebarUrl: '/src/components/receptionist/sidebar-menu/sidebar.html' });
});
