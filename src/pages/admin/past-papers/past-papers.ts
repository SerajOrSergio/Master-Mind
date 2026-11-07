// Past Papers Page (Admin)
// The whole page implementation is shared with the receptionist portal, so
// both stay identical: see /src/pages/past-papers/past-papers-page.ts.
import { setupPastPapersPage } from '../../past-papers/past-papers-page.js';

document.addEventListener('DOMContentLoaded', () => {
  setupPastPapersPage({ sidebarUrl: '/src/components/admin/sidebar-menu/sidebar.html' });
});
