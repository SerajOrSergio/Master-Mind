// Undo Manager - Centralized undo functionality for admin pages
// This module provides a consistent way to handle undo operations across all admin pages

// Internal undo stack
const undoStack = [];

// Build a REST URL from a base endpoint + item id, avoiding a duplicated
// id when the caller already baked the id into the endpoint (e.g. '/api/topics/5').
function resolveUrl(base, id) {
  if (id === undefined || id === null || id === '') return base;
  const baseNorm = String(base).replace(/\/+$/, '');
  const idStr = String(id);
  if (baseNorm.endsWith('/' + idStr)) return baseNorm;
  return baseNorm + '/' + idStr;
}

// Internal undo stack management
export function pushUndoAction(action) {
  if (!action || typeof action.undo !== 'function') return;
  undoStack.push(action);
  updateUndoButton();
}

export function popUndoAction() {
  const action = undoStack.pop();
  updateUndoButton();
  return action;
}

export function hasUndo() {
  return undoStack.length > 0;
}

function updateUndoButton() {
  const btn = document.getElementById('undo-btn');
  const btnDesktop = document.getElementById('undo-btn-desktop');

  if (hasUndo()) {
    if (btn) {
      btn.classList.add('undo-visible');
      btn.disabled = false;
      btn.title = 'Undo last action';
    }
    if (btnDesktop) {
      btnDesktop.classList.add('undo-visible');
      btnDesktop.disabled = false;
      btnDesktop.title = 'Undo last action';
    }
  } else {
    if (btn) {
      btn.classList.remove('undo-visible');
      btn.disabled = true;
      btn.title = '';
    }
    if (btnDesktop) {
      btnDesktop.classList.remove('undo-visible');
      btnDesktop.disabled = true;
      btnDesktop.title = '';
    }
  }
}

// Create undo actions for different types of operations
export function createDeleteAction(item, itemType, apiEndpoint, restoreCallback) {
  return {
    type: 'delete',
    itemType: itemType,
    item: item,
    undo: async () => {
      try {
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item)
        });
        if (!response.ok) {
          console.error('Undo delete failed with status', response.status);
          alert('Failed to undo delete operation');
          return;
        }
        if (restoreCallback) {
          await restoreCallback();
        }
      } catch (error) {
        console.error('Undo delete failed:', error);
        alert('Failed to undo delete operation');
      }
    }
  };
}

export function createAddAction(item, itemType, apiEndpoint, deleteCallback) {
  return {
    type: 'add',
    itemType: itemType,
    item: item,
    undo: async () => {
      try {
        const deleteUrl = resolveUrl(apiEndpoint, item && item.id);

        const response = await fetch(deleteUrl, {
          method: 'DELETE'
        });
        if (!response.ok) {
          console.error('Undo add failed with status', response.status);
          alert('Failed to undo add operation');
          return;
        }
        if (deleteCallback) {
          await deleteCallback(item);
        }
      } catch (error) {
        console.error('Undo add failed:', error);
        alert('Failed to undo add operation');
      }
    }
  };
}

export function createEditAction(oldItem, newItem, itemType, apiEndpoint, restoreCallback) {
  return {
    type: 'edit',
    itemType: itemType,
    oldItem: oldItem,
    newItem: newItem,
    undo: async () => {
      try {
        const updateUrl = resolveUrl(apiEndpoint, oldItem && oldItem.id);

        const response = await fetch(updateUrl, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(oldItem)
        });
        if (!response.ok) {
          console.error('Undo edit failed with status', response.status);
          alert('Failed to undo edit operation');
          return;
        }
        if (restoreCallback) {
          await restoreCallback();
        }
      } catch (error) {
        console.error('Undo edit failed:', error);
        alert('Failed to undo edit operation');
      }
    }
  };
}

// Generic undo action for custom operations (snapshot restore, etc.)
export function createCustomAction(type, undoFn) {
  return {
    type: type || 'custom',
    undo: async () => {
      try {
        await undoFn();
      } catch (error) {
        console.error('Undo custom action failed:', error);
        alert('Failed to undo operation');
      }
    }
  };
}

// Push action to undo stack
export function pushAction(action) {
  pushUndoAction(action);
}

// Execute undo
export async function executeUndo() {
  if (!hasUndo()) return false;
  const action = popUndoAction();
  if (action && typeof action.undo === 'function') {
    await action.undo();
  }
  return true;
}

// Check if undo is available
export function canUndo() {
  return hasUndo();
}

// Setup undo button (to be called after header is loaded)
export function setupUndoButton() {
  const bind = (btnId) => {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    if (btn.dataset.undoBound === 'true') return;
    btn.dataset.undoBound = 'true';
    btn.addEventListener('click', async () => {
      await executeUndo();
    });
  };

  // Mobile undo button
  bind('undo-btn');

  // Desktop undo button
  bind('undo-btn-desktop');

  updateUndoButton();
}

// Global bridge so classic (non-module) page scripts can use the manager:
// e.g. paid.js calls pushAction(...) / createDeleteAction(...) directly.
(function exposeGlobals() {
  window.undoManager = {
    pushUndoAction,
    popUndoAction,
    hasUndo,
    executeUndo,
    setupUndoButton,
    pushAction,
    createDeleteAction,
    createAddAction,
    createEditAction,
    createCustomAction
  };
  window.pushUndoAction = pushUndoAction;
  window.popUndoAction = popUndoAction;
  window.hasUndo = hasUndo;
  window.executeUndo = executeUndo;
  window.setupUndoButton = setupUndoButton;
  window.pushAction = pushAction;
  window.createDeleteAction = createDeleteAction;
  window.createAddAction = createAddAction;
  window.createEditAction = createEditAction;
  window.createCustomAction = createCustomAction;
})();
