/* ============================================================
   globals.d.ts — ambient declarations for the TS conversion
   ------------------------------------------------------------
   Bridges, without touching any runtime behavior:
   - CDN globals loaded by <script> tags (Bootstrap bundle,
     Choices, JSZip, XLSX, Chart.js)
   - cross-script globals classic scripts rely on
     (window.PaymentGroups, undo-manager's window helpers)
   - a pragmatic HTMLElement bridge, because the legacy code
     calls element.value / element.reset() etc. on plain
     HTMLElement (returned by getElementById) — the merged
     index signature types those as `any` the same way the
     original JS did.
   All of this is erasable typing only: tsc output stays
   equivalent to what the pages always shipped.

   NOTE: this is a GLOBAL ambient script (no import/export),
   so every `declare` item below is globally visible to the
   whole program, and interface blocks merge directly into
   the global scope.
   ============================================================ */

// --- CDN-loaded libraries (declared any: their real typings live in their bundles) ---
declare const bootstrap: any; // from bootstrap.bundle.min.js
declare const Choices: any;   // https://cdn.jsdelivr.net/npm/choices.js
declare const JSZip: any;     // JSZip used by database-download
declare const XLSX: any;      // SheetJS used by admin excel export
declare const Chart: any;     // Chart.js (dashboard charts)

// --- cross-script globals (defined by payments-grouping.js as window.PaymentGroups) ---
declare const PaymentGroups: any;

// --- undo-manager window-bridge helpers (assist/undo-manager.ts assigns these to window) ---
declare function pushAction(action: unknown): void;
declare function createDeleteAction(...args: unknown[]): unknown;
declare function createEditAction(...args: unknown[]): unknown;
declare function createAddAction(...args: unknown[]): unknown;
declare function createCustomAction(...args: unknown[]): unknown;
declare function deleteStudentMaterial(...args: unknown[]): void;

// --- legacy latent globals referenced by a few legacy code paths ---
declare const dateButton: any;
declare const msgDivTop: any;
declare const monthLabel: any;
declare const pendingStudents: any;

// isNaN overload: the legacy code passes Date (and other objects) to isNaN;
// JS happily coerces to number, so an `any` overload keeps type-checking out
// of the way without changing semantics.
declare function isNaN(value: any): boolean;

// HTMLElement bridge: legacy pages assume any property can be set/read on
// elements grabbed with getElementById (value, reset, custom storage keys…).
interface HTMLElement {
  value: any;
  checked: any;
  [key: string]: any;
}

// Element/EventTarget bridge: querySelector / event targets are typed Element
// or EventTarget, but the legacy code freely uses .value, .dataset, .style,
// .innerText, .disabled, .checked, .onclick, .dataTransfer, .closest() …
// An index signature types those as `any`, exactly like the original JS.
interface Element {
  [key: string]: any;
}

interface EventTarget {
  [key: string]: any;
}

interface GlobalEventHandlers {
  [key: string]: any;
}

// window bridge: classic scripts share these via undo-manager and logout handlers
interface Window {
  PaymentGroups: any;
  undoManager: any;
  pushUndoAction: any;
  popUndoAction: any;
  hasUndo: any;
  executeUndo: any;
  setupUndoButton: any;
  pushAction: (a: unknown) => void;
  createDeleteAction: (...a: unknown[]) => unknown;
  createAddAction: (...a: unknown[]) => unknown;
  createEditAction: (...a: unknown[]) => unknown;
  createCustomAction: (...a: unknown[]) => unknown;
  skipWaiting: () => Promise<void>;
  clients: any;
  deleteAbsenceLog: any;
  deleteSessionLog: any;
  deleteStudentMaterial: any;
  [key: string]: any;
}

// iOS "Add to Home Screen" detection used by use-hostname.ts / pwa-register.ts
interface Navigator {
  standalone: boolean;
}

// service-worker + PWA event bridge (install events, fetch interception)
interface Event {
  waitUntil: (p: Promise<any> | any) => void;
  respondWith: (r: Promise<Response> | Response | any) => void;
  request: Request;
  // drag-and-drop bridge (legacy handlers read dataTransfer on plain-Event-typed params)
  dataTransfer: any;
}
