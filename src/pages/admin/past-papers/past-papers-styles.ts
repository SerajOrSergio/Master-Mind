// Stylesheet for the admin Past Papers page. The rules themselves live in the
// shared theme (src/pages/past-papers/past-papers-theme.ts) so the admin and
// receptionist pages can never drift apart; the build writes this module's
// css out as past-papers.css next to the page.
import { css as sharedCss } from '../../past-papers/past-papers-theme.js';

export const css = sharedCss;
export const cssFile = 'past-papers.css';
