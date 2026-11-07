
// Import undo manager
import { pushAction, createDeleteAction, createAddAction } from '/assist/undo-manager.js';

let subjects = [];

const subjectsTableBody = document.getElementById("subjectsTableBody");
const searchInput = document.getElementById("searchInput");
const newSubjectInput = document.getElementById("newSubjectInput");
const addSubjectBtn = document.getElementById("addSubjectBtn");
const alertPlaceholder = document.getElementById("alert-placeholder");

async function renderSubjectsTable() {
  const search = searchInput.value.toLowerCase();
  const filtered = subjects.filter(s => s.name.toLowerCase().includes(search));
  subjectsTableBody.innerHTML = filtered.length === 0
    ? `<tr><td colspan='3' class='text-center text-muted'>No subjects found.</td></tr>`
    : filtered.map(s => `
      <tr>
        <td>${s.id}</td>
        <td>${s.name}</td>
        <td>
          <button class="btn btn-danger btn-sm" onclick="deleteSubject(${s.id})">Delete</button>
        </td>
      </tr>
    `).join("");
}

window.deleteSubject = async function(id) {
  // Find the subject before deleting for undo
  const subj = subjects.find(s => s.id === id);
  try {
    await fetch(`/api/subjects/${id}`, { method: 'DELETE' });
    showAlert("Subject deleted.", "danger");
    
    // Create undo action for subject deletion
    const undoAction = createDeleteAction(
      subj,
      'subject',
      '/api/subjects',
      async () => {
        showAlert("Undo: Subject restored.", "success");
        await loadSubjects();
      }
    );
    pushAction(undoAction);
    
    await loadSubjects();
  } catch (err) {
    showAlert("Failed to delete subject.", "danger");
  }
};

addSubjectBtn.addEventListener("click", async () => {
  const name = newSubjectInput.value.trim();
  if (!name) return;
  try {
    const res = await fetch('/api/subjects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    const data = await res.json();
    if (!res.ok) {
      showAlert("Failed to add subject: " + (data.error || 'Unknown error'), "danger");
      return;
    }
    showAlert("Subject added!", "success");
    
    // Create undo action for subject addition
    const undoAction = createAddAction(
      data,
      'subject',
      '/api/subjects',
      async (item) => {
        showAlert("Undo: Subject removed.", "warning");
        await loadSubjects();
      }
    );
    pushAction(undoAction);
    
    newSubjectInput.value = "";
    await loadSubjects();
  } catch (err) {
    showAlert("Failed to add subject.", "danger");
  }
});

searchInput.addEventListener("input", renderSubjectsTable);

function showAlert(message, type) {
  alertPlaceholder.innerHTML = `<div id="subject-alert" class="alert alert-${type} alert-dismissible fade show" role="alert">
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>`;
  // Auto-close after 3 seconds
  setTimeout(() => {
    const alert = document.getElementById('subject-alert');
    if (alert) {
      // Bootstrap 5 close
      if (window.bootstrap && bootstrap.Alert) {
        const bsAlert = bootstrap.Alert.getOrCreateInstance(alert);
        bsAlert.close();
      } else {
        alert.classList.remove('show');
        alert.classList.add('fade');
        setTimeout(() => {
          if (alert.parentNode) alert.parentNode.removeChild(alert);
        }, 150);
      }
    }
  }, 3000);
}

async function loadSubjects() {
  try {
    const res = await fetch('/api/subjects');
    subjects = await res.json();
    renderSubjectsTable();
  } catch (err) {
    showAlert("Failed to load subjects.", "danger");
  }
}

window.addEventListener('DOMContentLoaded', loadSubjects);
