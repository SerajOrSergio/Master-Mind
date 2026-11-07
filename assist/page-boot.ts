// Shared page boot — replaces the header <script> glue that used to be
// duplicated inline on nearly every page. Compiled by tsc to
// dist/assist/page-boot.js (an ES module) and configured ONLY through data
// attributes on its own script tag, so there is no runtime string coupling:
//
//   <script type="module" src="/assist/page-boot.js"
//           data-header="/src/components/admin/header/header.html"
//           data-container="admin-header-container"
//           data-undo-module="/assist/undo-manager.js"
//           data-burger-module="/src/components/admin/header/header.js"></script>
//
// data-header        (required) URL of the shared header HTML fragment.
// data-container     (required) element id that receives the header HTML.
// data-undo-module   Optional module exporting setupUndoButton(); the module is
//                    imported AFTER the header is injected so the bindings find
//                    the injected button. Ports that do not want undo simply
//                    omit the attribute (the undo manager is shared across all
//                    portals, so there is still exactly ONE undo stack).
// data-burger-module Optional module exporting setupBurgerMenu() (fallback
//                    burger binding when the Bootstrap bundle is unavailable).
//
// note: document.currentScript is null for ES modules, so the tag is looked up
// by its data attributes instead.
const tag = document.querySelector<HTMLScriptElement>(
  'script[type="module"][data-header][data-container]'
);

const headerUrl = tag?.dataset.header;
const containerId = tag?.dataset.container;
const undoModule = tag?.dataset.undoModule;
const burgerModule = tag?.dataset.burgerModule;

if (headerUrl && containerId) {
  fetch(headerUrl)
    .then(res => res.text())
    .then(html => {
      const container = document.getElementById(containerId);
      if (container) container.innerHTML = html;
    })
    .then(async () => {
      if (undoModule) {
        const mod = (await import(undoModule)) as {
          setupUndoButton?: () => void;
        };
        mod.setupUndoButton?.();
      }
      if (burgerModule) {
        const mod = (await import(burgerModule)) as {
          setupBurgerMenu?: () => void;
        };
        mod.setupBurgerMenu?.();
      }
    })
    .catch(err => console.warn('Header boot failed:', err));
}
