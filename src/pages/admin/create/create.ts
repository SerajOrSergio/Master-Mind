// create.js - Manage Receptionist Page Access

let pageAccessConfig = null;

// Load page access configuration on page load
document.addEventListener('DOMContentLoaded', function() {
  loadPageAccessConfig();
  
  // Event listeners
  document.getElementById('saveAllBtn').addEventListener('click', savePageAccessConfig);
  document.getElementById('retryBtn').addEventListener('click', loadPageAccessConfig);
});

// Load page access configuration from API
async function loadPageAccessConfig() {
  showLoading();
  
  try {
    const response = await fetch('/api/receptionist-page-access');
    
    if (!response.ok) {
      throw new Error('Failed to load page access configuration');
    }
    
    pageAccessConfig = await response.json();
    renderPagesList(pageAccessConfig.pages);
    showPagesContainer();
    
  } catch (error) {
    console.error('Error loading page access config:', error);
    showError('Failed to load page access configuration. Please try again.');
  }
}

// Render the list of pages with toggle switches and drag-and-drop
function renderPagesList(pages) {
  const pagesList = document.getElementById('pagesList');
  pagesList.innerHTML = '';
  
  if (!pages || pages.length === 0) {
    pagesList.innerHTML = '<p class="text-muted text-center py-3">No pages configured.</p>';
    return;
  }
  
  // Sort pages by order
  const sortedPages = [...pages].sort((a, b) => (a.order || 0) - (b.order || 0));
  
  sortedPages.forEach((page, index) => {
    const pageItem = document.createElement('div');
    pageItem.className = 'list-group-item d-flex align-items-center justify-content-between draggable-item';
    pageItem.setAttribute('draggable', 'true');
    pageItem.setAttribute('data-page-id', page.id);
    pageItem.setAttribute('data-order', page.order || index + 1);
    pageItem.innerHTML = `
      <div class="d-flex align-items-center flex-grow-1">
        <div class="drag-handle me-3">
          <i class="bi bi-grip-vertical"></i>
        </div>
        <div class="page-icon me-3">
          <i class="bi ${page.icon}"></i>
        </div>
        <div>
          <h6 class="mb-0">${page.name}</h6>
        </div>
      </div>
      <div class="form-check form-switch">
        <input 
          class="form-check-input page-toggle" 
          type="checkbox" 
          id="page-${page.id}"
          data-page-id="${page.id}"
          ${page.enabled ? 'checked' : ''}
        >
        <label class="form-check-label visually-hidden" for="page-${page.id}">
          ${page.enabled ? 'Enabled' : 'Disabled'}
        </label>
      </div>
    `;
    
    pagesList.appendChild(pageItem);
  });
  
  // Add event listeners to toggle switches
  document.querySelectorAll('.page-toggle').forEach(toggle => {
    toggle.addEventListener('change', function() {
      const pageId = this.getAttribute('data-page-id');
      const label = this.nextElementSibling;
      label.textContent = this.checked ? 'Enabled' : 'Disabled';
    });
  });
  
  // Add drag-and-drop event listeners
  setupDragAndDrop();
}

// Setup drag-and-drop functionality
function setupDragAndDrop() {
  const draggables = document.querySelectorAll('.draggable-item');
  const container = document.getElementById('pagesList');
  
  draggables.forEach(draggable => {
    draggable.addEventListener('dragstart', () => {
      draggable.classList.add('dragging');
    });
    
    draggable.addEventListener('dragend', () => {
      draggable.classList.remove('dragging');
      updatePageOrder();
    });
  });
  
  container.addEventListener('dragover', e => {
    e.preventDefault();
    const afterElement = getDragAfterElement(container, e.clientY);
    const draggable = document.querySelector('.dragging');
    if (afterElement == null) {
      container.appendChild(draggable);
    } else {
      container.insertBefore(draggable, afterElement);
    }
  });
}

// Get the element after the cursor position
function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll('.draggable-item:not(.dragging)')];
  
  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Update page order based on DOM order
function updatePageOrder() {
  const pageItems = document.querySelectorAll('.draggable-item');
  pageItems.forEach((item, index) => {
    const pageId = item.getAttribute('data-page-id');
    const page = pageAccessConfig.pages.find(p => p.id === pageId);
    if (page) {
      page.order = index + 1;
    }
  });
}

// Save page access configuration to API
async function savePageAccessConfig() {
  if (!pageAccessConfig || !pageAccessConfig.pages) {
    showError('No configuration to save.');
    return;
  }
  
  // Snapshot the previous configuration so Undo can restore it
  const oldPages = JSON.parse(JSON.stringify(pageAccessConfig.pages || []));

  // Update the enabled state based on current toggle states
  const toggles = document.querySelectorAll('.page-toggle');
  toggles.forEach(toggle => {
    const pageId = toggle.getAttribute('data-page-id');
    const page = pageAccessConfig.pages.find(p => p.id === pageId);
    if (page) {
      page.enabled = toggle.checked;
    }
  });
  
  try {
    const response = await fetch('/api/receptionist-page-access', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ pages: pageAccessConfig.pages })
    });
    
    if (!response.ok) {
      throw new Error('Failed to save page access configuration');
    }
    
    const result = await response.json();
    showSuccessMessage();
    
    // Update local config with server response
    if (result.pages) {
      pageAccessConfig.pages = result.pages;
    }

    // Register an undo action that restores the previous configuration
    if (window.pushAction && window.createCustomAction) {
      window.pushAction(window.createCustomAction('page-access', async () => {
        try {
          await fetch('/api/receptionist-page-access', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pages: oldPages })
          });
        } catch (e) {
          console.error('Undo page access config failed:', e);
        }
        await loadPageAccessConfig();
      }));
    }
    
  } catch (error) {
    console.error('Error saving page access config:', error);
    showError('Failed to save page access configuration. Please try again.');
  }
}

// UI State Management
function showLoading() {
  document.getElementById('loadingState').classList.remove('d-none');
  document.getElementById('pagesContainer').classList.add('d-none');
  document.getElementById('errorState').classList.add('d-none');
  hideSuccessMessage();
}

function showPagesContainer() {
  document.getElementById('loadingState').classList.add('d-none');
  document.getElementById('pagesContainer').classList.remove('d-none');
  document.getElementById('errorState').classList.add('d-none');
}

function showError(message) {
  document.getElementById('loadingState').classList.add('d-none');
  document.getElementById('pagesContainer').classList.add('d-none');
  document.getElementById('errorState').classList.remove('d-none');
  document.getElementById('errorMessage').textContent = message;
  hideSuccessMessage();
}

function showSuccessMessage() {
  const successMsg = document.getElementById('successMessage');
  successMsg.classList.remove('d-none');
  
  // Hide after 3 seconds
  setTimeout(() => {
    hideSuccessMessage();
  }, 3000);
}

function hideSuccessMessage() {
  document.getElementById('successMessage').classList.add('d-none');
}
