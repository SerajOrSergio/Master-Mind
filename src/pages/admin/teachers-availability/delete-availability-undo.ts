// Teacher Availability undo patch — replaces the second half of the previously
// inline module in teachers-availability/index.html. Compiled by tsc to
// delete-availability-undo.js. The header fetch/undo setup part of that block
// is handled by the shared /assist/page-boot.js module instead.

import { pushAction, createDeleteAction } from '/assist/undo-manager.js';

// Patch global deleteAvailability to support undo
(window as unknown as {
  deleteAvailability: (id: string | number) => Promise<void>;
}).deleteAvailability = async function (id: string | number): Promise<void> {
  // Fetch the current row data before deleting
  const res = await fetch(`/api/teachers-availability/${id}`);
  if (!res.ok) {
    alert('Failed to fetch availability for undo.');
    return;
  }
  const oldData = await res.json();
  // Create undo action
  const undoAction = createDeleteAction(
    oldData,
    'availability',
    '/api/teachers-availability',
    async () => {
      if (typeof loadAvailabilities === 'function') loadAvailabilities();
    }
  );
  pushAction(undoAction);
  // Proceed with delete
  await fetch(`/api/teachers-availability/${id}`, { method: 'DELETE' });
  if (typeof loadAvailabilities === 'function') loadAvailabilities();
};

declare function loadAvailabilities(): Promise<void>;
