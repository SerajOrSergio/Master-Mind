// Shared responsive layout helper — replaces the adjustMainContentMargin()
// script that used to be duplicated inline on many pages. Compiled by tsc to
// dist/assist/main-content.js and configured via a data attribute on its tag:
//
//   <script src="/assist/main-content.js" defer></script>              (260px)
//   <script src="/assist/main-content.js" defer data-margin="250px"></script>
//
// Behaviour: below 768px the main content spans the whole viewport; from 768px
// up it is indented by the fixed sidebar width (data-margin, default 260px).
// Page elements are found by #main-content id (most pages) or by the
// .main-content-container class (topics-style layouts, which also carry an
// explicit width in the original code — reproduced here).
function adjustMainContentMargin(): void {
  const inMain = document.getElementById('main-content');
  const container = inMain ?? document.querySelector('.main-content-container');
  if (!container) return;

  const tag = document.querySelector<HTMLScriptElement>(
    'script[src="/assist/main-content.js"]'
  );
  const margin = tag?.dataset.margin || '260px';

  const compact = window.innerWidth < 768;
  container.style.marginLeft = compact ? '0' : margin;
  container.style.maxWidth = compact ? '100vw' : `calc(100% - ${margin})`;
  // The class-based variant (topics layouts) also widths the container; the
  // id-based pages never set width, so keep their original behaviour exactly.
  if (!inMain) {
    container.style.width = compact ? '100%' : `calc(100% - ${margin})`;
  }
}

adjustMainContentMargin();
window.addEventListener('resize', adjustMainContentMargin);
