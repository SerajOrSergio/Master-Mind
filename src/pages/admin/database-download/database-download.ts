// Database files to download
const databaseFiles = [
  'classes.json',
  'grades.json',
  'pricing.json',
  'receptionist-page-access.json',
  'settings.json',
  'student-absence-logs.json',
  'students.json',
  'subjects.json',
  'subscription-usage-log.json',
  'subscription.json',
  'teacher-absence-logs.json',
  'teachers-availability.json',
  'teachers.json',
  'topics.json',
  'teacher-portal/payments.json',
  'teacher-portal/session-draft.json',
  'teacher-portal/session-form.json',
  'teacher-portal/teachers-attendance.json',
  'site_access/admin.json',
  'site_access/coordinator.json',
  'site_access/receptionist.json',
  'site_access/teacher.json'
];

// Load JSZip library dynamically
function loadJSZip() {
  return new Promise((resolve, reject) => {
    if (typeof JSZip !== 'undefined') {
      resolve(JSZip);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
    script.onload = () => resolve(JSZip);
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// Check storage access and request permission if needed
async function checkStorageAccess() {
  try {
    // Check if File System Access API is supported
    if ('showSaveFilePicker' in window) {
      return true;
    }
    
    // Fallback: check if we can trigger downloads
    return true;
  } catch (error) {
    console.error('Storage access check failed:', error);
    return false;
  }
}

// Fetch a single database file
async function fetchDatabaseFile(filename) {
  try {
    const response = await fetch(`/database/${filename}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${filename}`);
    }
    const data = await response.text();
    return { filename, data, success: true };
  } catch (error) {
    console.error(`Error fetching ${filename}:`, error);
    return { filename, data: null, success: false, error: error.message };
  }
}

// Update file list with status
function updateFileStatus(filename, status, size = null) {
  const listItems = document.querySelectorAll('#database-files-list .list-group-item');
  listItems.forEach(item => {
    const textSpan = item.querySelector('span:first-child');
    const badge = item.querySelector('.badge');
    
    if (textSpan.textContent.includes(filename)) {
      if (status === 'loading') {
        badge.className = 'badge bg-secondary';
        badge.textContent = 'Loading...';
      } else if (status === 'success') {
        badge.className = 'badge bg-success';
        badge.textContent = size ? formatFileSize(size) : 'Ready';
      } else if (status === 'error') {
        badge.className = 'badge bg-danger';
        badge.textContent = 'Error';
      }
    }
  });
}

// Format file size
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// ===== Storage summary (total size of every database JSON file) =====
// Known byte sizes per file, gathered from HEAD checks and real downloads.
const knownFileSizes: { [key: string]: number } = {};
// Reference limit used for the progress bar. Upgraded to the real browser
// quota via navigator.storage.estimate() when available (secure context),
// otherwise this ~5 MB typical mobile-browser value is used.
const STORAGE_REFERENCE_BYTES = 5 * 1024 * 1024; // ~5 MB

function recordFileSize(filename, bytes) {
  if (!filename || typeof bytes !== 'number' || isNaN(bytes)) return;
  knownFileSizes[filename] = bytes;
  updateStorageSummary();
}

// True byte size of a fetched file (Blob.size counts UTF-8 bytes, whereas
// String.length counts UTF-16 code units and undercounts non-ASCII data).
function textByteLength(text) {
  if (typeof text !== 'string') return 0;
  try {
    return new Blob([text]).size;
  } catch (e) {
    return text.length;
  }
}

function getTotalStorageBytes() {
  return Object.values(knownFileSizes as { [key: string]: any }).reduce((sum, b) => sum + b, 0);
}

// Ask the browser for its real storage quota and show it in the summary
// panel. Falls back to the ~5 MB reference when the API is unavailable
// (e.g. non-secure context).
function loadStorageQuota() {
  const labelEl = document.getElementById('storage-limit-label');
  if (!labelEl) return;
  if (!navigator.storage || typeof navigator.storage.estimate !== 'function') {
    labelEl.textContent = formatFileSize(STORAGE_REFERENCE_BYTES);
    return;
  }
  navigator.storage.estimate()
    .then(est => {
      if (est && est.quota) {
        labelEl.textContent = formatFileSize(est.quota);
        const pct = Math.min(100, (getTotalStorageBytes() / est.quota) * 100);
        const barEl = document.getElementById('storage-progress-bar');
        if (barEl) {
          barEl.style.width = pct.toFixed(2) + '%';
          barEl.setAttribute('aria-valuenow', pct.toFixed(2));
        }
      } else {
        labelEl.textContent = formatFileSize(STORAGE_REFERENCE_BYTES);
      }
    })
    .catch(() => {
      labelEl.textContent = formatFileSize(STORAGE_REFERENCE_BYTES);
    });
}

// Group the recorded sizes by folder so the total visibly adds up: the root
// database/ files plus the teacher-portal/ and site_access/ subfolders.
function getFolderBreakdown() {
  const folders: { [key: string]: any } = {};
  Object.entries(knownFileSizes as { [key: string]: any }).forEach(([filename, bytes]) => {
    const folder = filename.indexOf('/') === -1 ? 'database/ (root)' : filename.slice(0, filename.lastIndexOf('/')) + '/';
    if (!folders[folder]) folders[folder] = { bytes: 0, count: 0 };
    folders[folder].bytes += bytes;
    folders[folder].count += 1;
  });
  return folders;
}

function renderFolderBreakdown() {
  const el = document.getElementById('storage-breakdown');
  if (!el) return;
  const folders = getFolderBreakdown();
  const total = getTotalStorageBytes();
  const rows = Object.entries(folders as { [key: string]: any })
    .sort((a, b) => b[1].bytes - a[1].bytes)
    .map(([folder, info]) => {
      const pct = total > 0 ? ((info.bytes / total) * 100).toFixed(1) : '0.0';
      return `<div class="breakdown-row">
        <span class="breakdown-folder">${folder}</span>
        <span class="breakdown-files">${info.count} file${info.count === 1 ? '' : 's'}</span>
        <span class="breakdown-size">${formatFileSize(info.bytes)} <span class="text-muted">(${pct}%)</span></span>
      </div>`;
    })
    .join('');
  el.innerHTML = rows;
}

function updateStorageSummary() {
  const total = getTotalStorageBytes();
  const count = Object.keys(knownFileSizes).length;
  const sizeEl = document.getElementById('total-storage-size');
  const countEl = document.getElementById('total-storage-count');
  const barEl = document.getElementById('storage-progress-bar');
  const usedEl = document.getElementById('storage-used-label');

  if (sizeEl) sizeEl.textContent = formatFileSize(total);
  if (countEl) countEl.textContent = count + (count === 1 ? ' file' : ' files');
  if (usedEl) usedEl.textContent = formatFileSize(total) + ' used';
  if (barEl) {
    const pct = Math.min(100, (total / STORAGE_REFERENCE_BYTES) * 100);
    barEl.style.width = pct.toFixed(2) + '%';
    barEl.setAttribute('aria-valuenow', pct.toFixed(2));
  }
  renderFolderBreakdown();
}

// Show status message
function showStatus(message, type = 'info') {
  const statusDiv = document.getElementById('status-message');
  const alertClass = type === 'success' ? 'alert-success' : 
                     type === 'error' ? 'alert-danger' : 
                     type === 'warning' ? 'alert-warning' : 'alert-info';
  statusDiv.innerHTML = `<div class="alert ${alertClass}" role="alert">${message}</div>`;
}

// Download all database files as ZIP
async function downloadDatabase() {
  const downloadBtn = document.getElementById('download-btn');
  const originalText = downloadBtn.innerHTML;
  
  try {
    // Check storage access
    showStatus('Checking storage access...', 'info');
    const hasAccess = await checkStorageAccess();
    
    if (!hasAccess) {
      showStatus('Storage access is not available in your browser. Please try a modern browser like Chrome or Edge.', 'error');
      return;
    }

    // Load JSZip
    showStatus('Preparing download...', 'info');
    const JSZip: any = await loadJSZip();
    const zip = new JSZip();

    // Fetch all files
    showStatus('Fetching database files...', 'info');
    downloadBtn.disabled = true;
    downloadBtn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Fetching Files...';

    let successCount = 0;
    let errorCount = 0;

    for (const file of databaseFiles) {
      updateFileStatus(file, 'loading');
      const result = await fetchDatabaseFile(file);
      
      if (result.success) {
        zip.file(result.filename, result.data);
        const realBytes = textByteLength(result.data);
        recordFileSize(result.filename, realBytes);
        updateFileStatus(result.filename, 'success', realBytes);
        successCount++;
      } else {
        updateFileStatus(result.filename, 'error');
        errorCount++;
      }
    }

    if (successCount === 0) {
      showStatus('Failed to fetch any database files. Please check your connection and try again.', 'error');
      downloadBtn.disabled = false;
      downloadBtn.innerHTML = originalText;
      return;
    }

    // Generate ZIP
    showStatus('Creating ZIP archive...', 'info');
    downloadBtn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Creating Archive...';

    const content = await zip.generateAsync({ type: 'blob' });
    
    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const zipFilename = `database-backup-${timestamp}.zip`;

    // Download the file
    showStatus('Downloading...', 'info');
    
    if ('showSaveFilePicker' in window) {
      // Use File System Access API if available
      try {
        const handle = await window.showSaveFilePicker({
          suggestedName: zipFilename,
          types: [{
            description: 'ZIP Archive',
            accept: { 'application/zip': ['.zip'] }
          }]
        });
        const writable = await handle.createWritable();
        await writable.write(content);
        await writable.close();
        showStatus(`Successfully downloaded ${successCount} files! ${errorCount > 0 ? `(${errorCount} files failed)` : ''}`, 'success');
      } catch (err) {
        if (err.name === 'AbortError') {
          showStatus('Download was cancelled by user.', 'warning');
        } else {
          // Fallback to traditional download
          downloadBlob(content, zipFilename);
          showStatus(`Successfully downloaded ${successCount} files! ${errorCount > 0 ? `(${errorCount} files failed)` : ''}`, 'success');
        }
      }
    } else {
      // Fallback to traditional download
      downloadBlob(content, zipFilename);
      showStatus(`Successfully downloaded ${successCount} files! ${errorCount > 0 ? `(${errorCount} files failed)` : ''}`, 'success');
    }

  } catch (error) {
    console.error('Download error:', error);
    showStatus(`An error occurred during download: ${error.message}`, 'error');
  } finally {
    downloadBtn.disabled = false;
    downloadBtn.innerHTML = originalText;
  }
}

// Traditional download fallback
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Initialize page
document.addEventListener('DOMContentLoaded', async () => {
  const downloadBtn = document.getElementById('download-btn');
  
  // Enable download button after a short delay
  setTimeout(() => {
    downloadBtn.disabled = false;
  }, 500);

  // Add click handler
  downloadBtn.addEventListener('click', downloadDatabase);

  // Pre-check file sizes
  for (const file of databaseFiles) {
    try {
      const response = await fetch(`/database/${file}`, { method: 'HEAD' });
      if (response.ok) {
        const size = response.headers.get('Content-Length');
        if (size) {
          recordFileSize(file, parseInt(size, 10));
          updateFileStatus(file, 'success', parseInt(size, 10));
        }
      }
    } catch (error) {
      // Keep as loading if HEAD request fails
    }
  }

  // Show the real browser storage quota in the summary panel.
  loadStorageQuota();
});
