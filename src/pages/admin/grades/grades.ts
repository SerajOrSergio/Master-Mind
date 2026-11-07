
// Import undo manager
import { pushAction, createDeleteAction, createAddAction } from '/assist/undo-manager.js';

let grades = [];

const gradesTableBody = document.getElementById("gradesTableBody");
const searchInput = document.getElementById("searchInput");
const newGradeInput = document.getElementById("newGradeInput");
const addGradeBtn = document.getElementById("addGradeBtn");
const alertPlaceholder = document.getElementById("alert-placeholder");


async function renderGradesTable() {
  const search = searchInput.value.toLowerCase();
  const filtered = grades.filter(g => g.name.toLowerCase().includes(search));
    gradesTableBody.innerHTML = filtered.length === 0
      ? `<tr><td colspan='3' class='text-center text-muted'>No grades found.</td></tr>`
      : filtered.map(g => `
        <tr>
          <td>${g.id}</td>
          <td>${g.name}</td>
          <td>
            <button class="btn btn-danger btn-sm" onclick="deleteGrade(${g.id})">Delete</button>
          </td>
        </tr>
      `).join("");
}


window.deleteGrade = async function(id) {
  // Find the grade before deleting for undo
  const grade = grades.find(g => g.id === id);
  try {
    await fetch(`/api/grades/${id}`, { method: 'DELETE' });
    showAlert("Grade deleted.", "danger");
    
    // Create undo action for grade deletion
    const undoAction = createDeleteAction(
      grade,
      'grade',
      '/api/grades',
      async () => {
        await loadGrades();
      }
    );
    pushAction(undoAction);
    
    await loadGrades();
  } catch (err) {
    showAlert("Failed to delete grade.", "danger");
  }
};


addGradeBtn.addEventListener("click", async () => {
  const name = newGradeInput.value.trim();
  if (!name) return;
  try {
    const res = await fetch('/api/grades', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    const data = await res.json();
    if (!res.ok) {
      showAlert("Failed to add grade: " + (data.error || 'Unknown error'), "danger");
      return;
    }
    newGradeInput.value = "";
    showAlert("Grade added!", "success");
    
    // Create undo action for grade addition
    const undoAction = createAddAction(
      data,
      'grade',
      '/api/grades',
      async (item) => {
        showAlert("Undo: Grade removed.", "warning");
        await loadGrades();
      }
    );
    pushAction(undoAction);
    
    await loadGrades();
  } catch (err) {
    showAlert("Failed to add grade: " + err.message, "danger");
  }
});


async function loadGrades() {
  try {
    const res = await fetch('/api/grades');
    grades = await res.json();
    renderGradesTable();
  } catch (err) {
    grades = [];
    renderGradesTable();
  }
}


function showAlert(message, type) {
  alertPlaceholder.innerHTML = `<div id="grade-alert" class="alert alert-${type} alert-dismissible fade show" role="alert">
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  </div>`;
  // Auto-close after 3 seconds
  setTimeout(() => {
    const alert = document.getElementById('grade-alert');
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


// Initial load
loadGrades();
