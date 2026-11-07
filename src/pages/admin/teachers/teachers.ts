// Teachers Page Logic
// Loads sidebar, fetches subjects, handles teacher CRUD

// Import undo manager
import { pushAction, createDeleteAction, createEditAction, createAddAction } from '/assist/undo-manager.js';

document.addEventListener('DOMContentLoaded', () => {
  // Load sidebar
  fetch('/src/components/admin/sidebar-menu/sidebar.html')
    .then(res => res.text())
    .then(html => {
      document.getElementById('sidebar').innerHTML = html;
    });

  // Fetch subjects for selection
  fetch('/database/subjects.json')
    .then(res => res.json())
    .then(subjects => {
      // Sort alphabetically by name or value
      subjects.sort((a, b) => {
        const nameA = (a.name || a).toLowerCase();
        const nameB = (b.name || b).toLowerCase();
        return nameA.localeCompare(nameB);
      });
      const container = document.getElementById('subjectsContainer');
      container.innerHTML = '';
      subjects.forEach(subj => {
        const pill = document.createElement('div');
        pill.className = 'subject-pill';
        pill.textContent = subj.name || subj;
        pill.dataset.subject = subj.name || subj;
        pill.onclick = () => pill.classList.toggle('selected');
        container.appendChild(pill);
      });
    });

  // Handle teacher form submit
  document.getElementById('teacherForm').onsubmit = async function(e) {
    e.preventDefault();
    const selectedSubjects = Array.from(document.querySelectorAll('.subject-pill.selected')).map(p => p.dataset.subject);
    const cutRateValue = document.getElementById('cutRate').value.trim();
    const teacher: any = {
      firstName: document.getElementById('firstName').value.trim(),
      lastName: document.getElementById('lastName').value.trim(),
      phoneNumber: document.getElementById('phoneNumber').value.trim(),
      email: document.getElementById('email').value.trim(),
      salary: document.getElementById('salary').value.trim(),
      notes: document.getElementById('notes').value.trim(),
      password: '12345', // Always set default password
      subjects: selectedSubjects
    };
    if (cutRateValue !== "") teacher.cutRate = cutRateValue;
    const res = await fetch('/api/teachers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(teacher)
    });
    if (res.ok) {
      // Register an undo action so the new teacher can be removed
      const created = await res.json().catch(() => null);
      if (created && created.id) {
        const undoAction = createAddAction(
          created,
          'teacher',
          '/api/teachers',
          async () => {
            loadTeachers();
          }
        );
        pushAction(undoAction);
      }
      this.reset();
      document.querySelectorAll('.subject-pill.selected').forEach(p => p.classList.remove('selected'));
      loadTeachers();
    } else {
      let msg = 'Failed to add teacher.';
      try {
        const err = await res.json();
        if (err && err.error) msg += '\n' + err.error;
        if (err && err.details) msg += '\n' + err.details;
      } catch {}
      alert(msg);
    }
  };

  // Load teachers table
  async function loadTeachers() {
    const res = await fetch('/api/teachers');
    const teachers = await res.json();
    const table = document.createElement('table');
    table.className = 'table table-bordered';
    table.innerHTML = `<thead><tr><th>#</th><th>First Name</th><th>Last Name</th><th>Phone</th><th>Email</th><th>Salary</th><th>Subjects</th><th>Notes</th><th>Actions</th></tr></thead><tbody></tbody>`;
    table.innerHTML = `<thead><tr><th>#</th><th>First Name</th><th>Last Name</th><th>Phone</th><th>Email</th><th>Salary</th><th>Cut Rate %</th><th>Subjects</th><th>Notes</th><th>Actions</th></tr></thead><tbody></tbody>`;
    teachers.forEach((t, i) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${i+1}</td>
        <td class="editable" data-field="firstName" data-id="${t.id}">${t.firstName}</td>
        <td class="editable" data-field="lastName" data-id="${t.id}">${t.lastName}</td>
        <td class="editable" data-field="phoneNumber" data-id="${t.id}">${t.phoneNumber}</td>
        <td class="editable" data-field="email" data-id="${t.id}">${t.email}</td>
        <td class="editable" data-field="salary" data-id="${t.id}">${t.salary}</td>
        <td class="editable" data-field="cutRate" data-id="${t.id}">${t.cutRate !== undefined ? t.cutRate : ''}</td>
        <td class="editable" data-field="subjects" data-id="${t.id}">${(t.subjects||[]).join(', ')}</td>
        <td class="editable" data-field="notes" data-id="${t.id}">${t.notes||''}</td>
        <td class="table-actions">
          <div class="actions-stack">
            <button class="btn btn-sm action-btn action-reset" onclick="resetPassword(${t.id})" title="Reset this teacher's password">
              <i class="bi bi-key me-1"></i>Reset Password
            </button>
            <button class="btn btn-sm action-btn action-delete" onclick="deleteTeacher(${t.id})" title="Delete this teacher">
              <i class="bi bi-trash me-1"></i>Delete
            </button>
          </div>
        </td>
      `;
      table.querySelector('tbody').appendChild(tr);
    });
    document.getElementById('teachersTableContainer').innerHTML = '';
    document.getElementById('teachersTableContainer').appendChild(table);

    // Inline editing logic
    document.querySelectorAll('.editable').forEach(cell => {
      cell.addEventListener('click', async function(e) {
        if (this.querySelector('input') || this.querySelector('.subjects-edit-container')) return; // already editing
        const oldValue = this.textContent;
        const field = this.dataset.field;
        const id = this.dataset.id;
        if (field === 'subjects') {
          // Fetch all subjects
          const res = await fetch('/database/subjects.json');
          const allSubjects = await res.json();
          const currentSubjects = oldValue.split(',').map(s => s.trim()).filter(Boolean);
          // Create container for subject pills
          const container = document.createElement('div');
          container.className = 'subjects-edit-container';
          // Sort alphabetically by name or value
          allSubjects.sort((a, b) => {
            const nameA = (a.name || a).toLowerCase();
            const nameB = (b.name || b).toLowerCase();
            return nameA.localeCompare(nameB);
          });
          allSubjects.forEach(subj => {
            const pill = document.createElement('div');
            pill.className = 'subject-pill';
            pill.textContent = subj.name || subj;
            pill.dataset.subject = subj.name || subj;
            if (currentSubjects.includes(subj.name || subj)) pill.classList.add('selected');
            pill.onclick = async (ev) => {
              pill.classList.toggle('selected');
              // Save immediately on selection change
              const selected = Array.from(container.querySelectorAll('.subject-pill.selected')).map(p => p.dataset.subject);
              // Capture the current (old) teacher for undo before mutating
              const oldRes = await fetch(`/api/teachers/${id}`);
              let oldTeacher = null;
              if (oldRes.ok) oldTeacher = await oldRes.json();
              const update = { subjects: selected };
              const updateRes = await fetch(`/api/teachers/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(update)
              });
              if (!updateRes.ok) alert('Failed to update.');
              else {
                if (oldTeacher) {
                  const undoAction = createEditAction(
                    oldTeacher,
                    { ...oldTeacher, subjects: selected },
                    'teacher',
                    '/api/teachers',
                    async () => {
                      loadTeachers();
                    }
                  );
                  pushAction(undoAction);
                }
                loadTeachers();
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
        } else if (field === 'cutRate') {
          // Number input for cutRate
          const input = document.createElement('input');
          input.type = 'number';
          input.value = oldValue;
          input.className = 'form-control';
          input.style.minWidth = '80px';
          input.min = String(0);
          input.max = String(100);
          input.step = '0.01';
          this.textContent = '';
          this.appendChild(input);
          input.focus();
          input.addEventListener('blur', async function() {
            let newValue = input.value.trim();
            if (newValue === '') newValue = undefined;
            if (newValue != oldValue) {
              // Capture the current (old) teacher for undo before mutating
              const oldRes = await fetch(`/api/teachers/${id}`);
              let oldTeacher = null;
              if (oldRes.ok) oldTeacher = await oldRes.json();
              const newCutRate = newValue === undefined ? null : Number(newValue);
              const update: { [key: string]: any } = {};
              update[field] = newCutRate;
              const res = await fetch(`/api/teachers/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(update)
              });
              if (!res.ok) alert('Failed to update.');
              else {
                if (oldTeacher) {
                  const undoAction = createEditAction(
                    oldTeacher,
                    { ...oldTeacher, cutRate: newCutRate },
                    'teacher',
                    '/api/teachers',
                    async () => {
                      loadTeachers();
                    }
                  );
                  pushAction(undoAction);
                }
                loadTeachers();
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
          // Default: text input editing
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
              // Capture the current (old) teacher for undo before mutating
              const oldRes = await fetch(`/api/teachers/${id}`);
              let oldTeacher = null;
              if (oldRes.ok) oldTeacher = await oldRes.json();
              const update: { [key: string]: any } = {};
              update[field] = newValue;
              const res = await fetch(`/api/teachers/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(update)
              });
              if (!res.ok) alert('Failed to update.');
              else {
                if (oldTeacher) {
                  const undoAction = createEditAction(
                    oldTeacher,
                    { ...oldTeacher, [field]: newValue },
                    'teacher',
                    '/api/teachers',
                    async () => {
                      loadTeachers();
                    }
                  );
                  pushAction(undoAction);
                }
                loadTeachers();
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
  window.deleteTeacher = async function(id) {
    if (!confirm('Delete this teacher?')) return;
    
    // Fetch the teacher (and its list position) before deleting so the undo
    // button can restore it in the same spot (best effort: if this fails,
    // still allow the delete to proceed)
    let teacher = null;
    let teacherIdx = -1;
    try {
      const listRes = await fetch('/api/teachers');
      if (listRes.ok) {
        const list = await listRes.json();
        teacherIdx = list.findIndex(t => String(t.id) === String(id));
        if (teacherIdx !== -1) teacher = list[teacherIdx];
      }
    } catch (err) {
      console.warn('Could not fetch teacher for undo', err);
    }
    if (!teacher) {
      try {
        const getRes = await fetch('/api/teachers/' + id);
        if (getRes.ok) teacher = await getRes.json();
      } catch (err) {
        console.warn('Could not fetch teacher for undo', err);
      }
    }
    
    const res = await fetch('/api/teachers/' + id, { method: 'DELETE' });
    if (res.ok) {
      if (teacher) {
        // Create undo action for teacher deletion (_restoreIndex keeps the
        // teacher at its original position, not the bottom of the list)
        const undoAction = createDeleteAction(
          { ...teacher, _restoreIndex: teacherIdx },
          'teacher',
          '/api/teachers',
          async () => {
            loadTeachers();
          }
        );
        pushAction(undoAction);
      }
      
      loadTeachers();
    } else {
      alert('Failed to delete teacher.');
    }
  }
  window.resetPassword = async function(id) {
    if (!confirm('Reset password for this teacher?')) return;
    const res = await fetch(`/api/teachers/${id}/reset-password`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    });
    if (res.ok) alert('Password reset to 12345.');
    else alert('Failed to reset password.');
  }
  loadTeachers();
});
