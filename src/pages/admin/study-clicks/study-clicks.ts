// Study Clicks Page Logic (Admin)
// Loads sidebar, fetches grades, handles study click CRUD with inline editing

// Import undo manager
import { pushAction, createDeleteAction, createEditAction, createAddAction } from '/assist/undo-manager.js';

let allStudents = [];
let selectedGrade = '';


// Today's date as a yyyy-mm-dd value for the date input (local timezone)
function todayLocalISO() {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

// Format the stored ISO paid date so the table shows a readable date
function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return String(iso);
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

document.addEventListener('DOMContentLoaded', () => {
  // Load sidebar
  fetch('/src/components/admin/sidebar-menu/sidebar.html')
    .then(res => res.text())
    .then(html => {
      document.getElementById('sidebar').innerHTML = html;
    });

  // Load grades pills
  fetch('/database/grades.json')
    .then(res => res.json())
    .then(grades => {
      const container = document.getElementById('gradesContainer');
      container.innerHTML = '';
      grades.forEach(grade => {
        const pill = document.createElement('div');
        pill.className = 'grade-pill';
        pill.textContent = grade.name || grade;
        pill.dataset.grade = grade.name || grade;
        pill.onclick = () => {
          if (pill.classList.contains('selected')) {
            pill.classList.remove('selected');
            selectedGrade = '';
          } else {
            document.querySelectorAll('#gradesContainer .grade-pill').forEach(p => p.classList.remove('selected'));
            pill.classList.add('selected');
            selectedGrade = pill.dataset.grade;
          }
        };
        container.appendChild(pill);
      });
    });

  // Default the paid date to today (still editable by hand)
  document.getElementById('paidDate').value = todayLocalISO();

  // Load all students for the quick-add pill list (searchable, alphabetical)
  fetch('/api/students')
    .then(res => res.json())
    .then(students => {
      allStudents = students;
      renderQuickStudents('');
    });

  // Quick-add search filter
  document.getElementById('studentQuickSearch').addEventListener('input', function() {
    renderQuickStudents(this.value);
  });

  // Table search filter (filters the rendered study click rows)
  document.getElementById('studyClicksSearchInput').addEventListener('input', applyTableFilter);

  // Handle study click form submit
  document.getElementById('studyClicksForm').onsubmit = async function(e) {
    e.preventDefault();
    const studyClick = {
      studentName: document.getElementById('studentName').value.trim(),
      phoneNumber: document.getElementById('phoneNumber').value.trim(),
      gradeLevel: selectedGrade,
      paidAmount: document.getElementById('paidAmount').value.trim() === '' ? null : Number(document.getElementById('paidAmount').value.trim()),
      // Typed by hand on this form (students have no email on record)
      emailAddress: document.getElementById('emailAddress').value.trim(),
      // Manually entered paid date (falls back to today inside the API)
      dateCreated: document.getElementById('paidDate').value || todayLocalISO()
    };
    const res = await fetch('/api/study-clicks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studyClick)
    });
    if (res.ok) {
      // Register an undo action so the new entry can be removed
      const created = await res.json().catch(() => null);
      if (created && created.id) {
        const undoAction = createAddAction(
          created,
          'study-click',
          '/api/study-clicks',
          async () => { loadStudyClicks(); }
        );
        pushAction(undoAction);
      }
      this.reset();
      document.getElementById('paidDate').value = todayLocalISO();
      document.querySelectorAll('#gradesContainer .grade-pill.selected').forEach(p => p.classList.remove('selected'));
      selectedGrade = '';
      loadStudyClicks();
    } else {
      let msg = 'Failed to add study click.';
      try {
        const err = await res.json();
        if (err && err.error) msg += '\n' + err.error;
        if (err && err.details) msg += '\n' + err.details;
      } catch {}
      alert(msg);
    }
  };

  // Load study clicks table
  async function loadStudyClicks() {
    const res = await fetch('/api/study-clicks');
    const studyClicks = await res.json();
    const table = document.createElement('table');
    table.className = 'table table-bordered';
    table.innerHTML = `<thead><tr><th>#</th><th>Student Name</th><th>Phone Number</th><th>Email</th><th>Grade</th><th>Paid Amount</th><th>Date Created</th><th>Actions</th></tr></thead><tbody></tbody>`;
    studyClicks.forEach((c, i) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${i+1}</td>
                <td class="editable" data-field="studentName" data-id="${c.id}">${c.studentName}</td>
        <td class="editable" data-field="phoneNumber" data-id="${c.id}">${c.phoneNumber}</td>
        <td class="editable" data-field="emailAddress" data-id="${c.id}">${c.emailAddress || '<span class="text-muted">—</span>'}</td>
        <td class="editable" data-field="gradeLevel" data-id="${c.id}">${c.gradeLevel||''}</td>
        <td class="editable" data-field="paidAmount" data-id="${c.id}">${c.paidAmount !== undefined && c.paidAmount !== null ? c.paidAmount : ''}</td>
        <td class="editable" data-field="dateCreated" data-id="${c.id}">${formatDate(c.dateCreated)}</td>
        <td class="table-actions">
          <div class="actions-stack">
            <button class="btn btn-sm action-btn action-delete" onclick="deleteStudyClick(${c.id})" title="Delete this entry">
              <i class="bi bi-trash me-1"></i>Delete
            </button>
          </div>
        </td>
      `;
      table.querySelector('tbody').appendChild(tr);
    });
    document.getElementById('studyClicksTableContainer').innerHTML = '';
    document.getElementById('studyClicksTableContainer').appendChild(table);
    // Re-apply the current table search filter after every re-render
    applyTableFilter();

    // Inline editing logic
    document.querySelectorAll('.editable').forEach(cell => {
      cell.addEventListener('click', async function(e) {
        if (this.querySelector('input') || this.querySelector('.grades-edit-container')) return; // already editing
        const oldValue = this.textContent;
        const field = this.dataset.field;
        const id = this.dataset.id;
        if (field === 'gradeLevel') {
          // Fetch all grades
          const res = await fetch('/database/grades.json');
          const allGrades = await res.json();
          // Create container for grade pills
          const container = document.createElement('div');
          container.className = 'grades-edit-container';
          allGrades.forEach(grade => {
            const pill = document.createElement('div');
            pill.className = 'grade-pill';
            pill.textContent = grade.name || grade;
            pill.dataset.grade = grade.name || grade;
            if ((grade.name || grade) === oldValue) pill.classList.add('selected');
            pill.onclick = async (ev) => {
              // Capture the current (old) entry for undo before mutating
              const oldRes = await fetch(`/api/study-clicks/${id}`);
              let oldEntry = null;
              if (oldRes.ok) oldEntry = await oldRes.json();
              const pushEditUndo = (newVal) => {
                if (oldEntry) {
                  const undoAction = createEditAction(
                    oldEntry,
                    { ...oldEntry, gradeLevel: newVal },
                    'study-click',
                    '/api/study-clicks',
                    async () => { loadStudyClicks(); }
                  );
                  pushAction(undoAction);
                }
              };
              if (pill.classList.contains('selected')) {
                // Deselect — save an empty grade
                pill.classList.remove('selected');
                const update = { gradeLevel: '' };
                const updateRes = await fetch(`/api/study-clicks/${id}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(update)
                });
                if (!updateRes.ok) alert('Failed to update.');
                else {
                  pushEditUndo('');
                  loadStudyClicks();
                }
              } else {
                document.querySelectorAll('.grades-edit-container .grade-pill').forEach(p => p.classList.remove('selected'));
                pill.classList.add('selected');
                const update = { gradeLevel: pill.dataset.grade };
                const updateRes = await fetch(`/api/study-clicks/${id}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(update)
                });
                if (!updateRes.ok) alert('Failed to update.');
                else {
                  pushEditUndo(pill.dataset.grade);
                  loadStudyClicks();
                }
              }
            };
            container.appendChild(pill);
          });
          this.textContent = '';
          this.appendChild(container);
          // Close popup if click outside
          const closePopup = (event) => {
            if (!container.contains(event.target) && event.target !== cell) {
              cell.textContent = oldValue;
              document.removeEventListener('mousedown', closePopup);
            }
          };
          setTimeout(() => {
            document.addEventListener('mousedown', closePopup);
          }, 0);
        } else if (field === 'dateCreated') {
          // Date input for the manually entered paid date
          const input = document.createElement('input');
          input.type = 'date';
          const oldDe = new Date(oldValue);
          if (!isNaN(oldDe.getTime())) input.value = new Date(oldDe.getTime() - oldDe.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
          input.className = 'form-control';
          input.style.minWidth = '130px';
          this.textContent = '';
          this.appendChild(input);
          input.focus();
          input.addEventListener('blur', async function() {
            let newDate = input.value;
            if (!newDate) {
              // Keep the old date when cleared
              cell.textContent = oldValue;
              return;
            }
            // Snapshot the stored entry first so comparing works on the real ISO value
            const oldRes = await fetch(`/api/study-clicks/${id}`);
            let oldEntry = null;
            if (oldRes.ok) oldEntry = await oldRes.json();
            const iso = new Date(newDate).toISOString();
            const oldIso = oldEntry && oldEntry.dateCreated ? new Date(oldEntry.dateCreated).toISOString() : null;
            if (iso !== oldIso) {
              const update = { dateCreated: iso };
              const res = await fetch(`/api/study-clicks/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(update)
              });
              if (!res.ok) alert('Failed to update.');
              else {
                if (oldEntry) {
                  const undoAction = createEditAction(
                    oldEntry,
                    { ...oldEntry, dateCreated: iso },
                    'study-click',
                    '/api/study-clicks',
                    async () => { loadStudyClicks(); }
                  );
                  pushAction(undoAction);
                }
                loadStudyClicks();
              }
            } else {
              cell.textContent = oldValue;
            }
          });
          input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') input.blur();
            if (e.key === 'Escape') {
              cell.textContent = oldValue;
            }
          });
        } else if (field === 'paidAmount') {
          // Number input for paid amount
          const input = document.createElement('input');
          input.type = 'number';
          input.value = oldValue;
          input.className = 'form-control';
          input.style.minWidth = '80px';
          input.min = String(0);
          input.step = '0.01';
          this.textContent = '';
          this.appendChild(input);
          input.focus();
          input.addEventListener('blur', async function() {
            let newValue = input.value.trim();
            if (newValue === '') newValue = null;
            const newNumber = newValue === null ? null : Number(newValue);
            if (newNumber != (oldValue === '' ? null : Number(oldValue))) {
              // Capture the current (old) entry for undo before mutating
              const oldRes = await fetch(`/api/study-clicks/${id}`);
              let oldEntry = null;
              if (oldRes.ok) oldEntry = await oldRes.json();
              const update = { paidAmount: newNumber };
              const res = await fetch(`/api/study-clicks/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(update)
              });
              if (!res.ok) alert('Failed to update.');
              else {
                if (oldEntry) {
                  const undoAction = createEditAction(
                    oldEntry,
                    { ...oldEntry, paidAmount: newNumber },
                    'study-click',
                    '/api/study-clicks',
                    async () => { loadStudyClicks(); }
                  );
                  pushAction(undoAction);
                }
                loadStudyClicks();
              }
            } else {
              cell.textContent = oldValue;
            }
          });
          input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') input.blur();
            if (e.key === 'Escape') {
              cell.textContent = oldValue;
            }
          });
        } else {
          // Default: text input editing (student name, phone number)
          const input = document.createElement('input');
          input.type = 'text';
          input.value = oldValue;
          input.className = 'form-control';
          input.style.minWidth = '80px';
          this.textContent = '';
          this.appendChild(input);
          input.focus();
          input.addEventListener('blur', async function() {
            let newValue = input.value.trim();
            if (newValue !== oldValue) {
              // Capture the current (old) entry for undo before mutating
              const oldRes = await fetch(`/api/study-clicks/${id}`);
              let oldEntry = null;
              if (oldRes.ok) oldEntry = await oldRes.json();
              const update: { [key: string]: any } = {};
              update[field] = newValue;
              const res = await fetch(`/api/study-clicks/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(update)
              });
              if (!res.ok) alert('Failed to update.');
              else {
                if (oldEntry) {
                  const undoAction = createEditAction(
                    oldEntry,
                    { ...oldEntry, [field]: newValue },
                    'study-click',
                    '/api/study-clicks',
                    async () => { loadStudyClicks(); }
                  );
                  pushAction(undoAction);
                }
                loadStudyClicks();
              }
            } else {
              cell.textContent = oldValue;
            }
          });
          input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') input.blur();
            if (e.key === 'Escape') {
              cell.textContent = oldValue;
            }
          });
        }
      });
    });
  }

  window.deleteStudyClick = async function(id) {
    if (!confirm('Delete this study click entry?')) return;

    // Fetch the entry (and its list position) before deleting so the undo
    // button can restore it in the same spot (best effort: if this fails,
    // still allow the delete to proceed)
    let entry = null;
    let entryIdx = -1;
    try {
      const listRes = await fetch('/api/study-clicks');
      if (listRes.ok) {
        const list = await listRes.json();
        entryIdx = list.findIndex(c => String(c.id) === String(id));
        if (entryIdx !== -1) entry = list[entryIdx];
      }
    } catch (err) {
      console.warn('Could not fetch study click for undo', err);
    }

    const res = await fetch('/api/study-clicks/' + id, { method: 'DELETE' });
    if (res.ok) {
      if (entry) {
        // Create undo action for the deletion (_restoreIndex keeps the entry
        // at its original position, not the bottom of the list)
        const undoAction = createDeleteAction(
          { ...entry, _restoreIndex: entryIdx },
          'study-click',
          '/api/study-clicks',
          async () => { loadStudyClicks(); }
        );
        pushAction(undoAction);
      }

      loadStudyClicks();
    } else {
      alert('Failed to delete study click.');
    }
  }

  loadStudyClicks();
});

  // Render the searchable quick-add student pill list
function renderQuickStudents(filter) {
    const container = document.getElementById('studentsQuickContainer');
    container.innerHTML = '';
    const val = String(filter || '').trim().toLowerCase();
    const sorted = [...allStudents]
      .filter(s => s.studentName)
      .sort((a, b) => a.studentName.localeCompare(b.studentName));
    let shown = 0;
    sorted.forEach(s => {
      if (val && !s.studentName.toLowerCase().includes(val)) return;
      shown++;
      const pill = document.createElement('div');
      pill.className = 'student-pill';
      pill.textContent = s.studentName;
      pill.title = [s.phoneNumber, s.gradeLevel].filter(Boolean).join(' · ');
      pill.onclick = () => quickFillStudent(s);
      container.appendChild(pill);
    });
    if (shown === 0) {
      const empty = document.createElement('div');
      empty.className = 'text-muted small';
      empty.textContent = 'No students match your search.';
      container.appendChild(empty);
    }
  }

  // Clicking a student pill fills the form with their saved info
function quickFillStudent(s) {
    document.getElementById('studentName').value = s.studentName || '';
    document.getElementById('phoneNumber').value = s.phoneNumber || '';
    const grade = s.gradeLevel || '';
    document.querySelectorAll('#gradesContainer .grade-pill').forEach(p => {
      p.classList.toggle('selected', p.dataset.grade === grade);
    });
    selectedGrade = grade;
    // Email is typed by hand, so jump to the one thing left: how much they paid
    document.getElementById('paidAmount').focus();
  }

  // Show only the table rows matching the search (name or phone)
function applyTableFilter() {
    const val = document.getElementById('studyClicksSearchInput').value.trim().toLowerCase();
    document.querySelectorAll('#studyClicksTableContainer tbody tr').forEach(tr => {
      const text = tr.textContent.toLowerCase();
      tr.style.display = (!val || text.includes(val)) ? '' : 'none';
    });
  }
