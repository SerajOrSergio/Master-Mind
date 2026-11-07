// Students Page JS

let studentsData = [];
let editingStudentId = null;
let selectedSubjects = [];
let rece_selectedGrade = '';

document.addEventListener('DOMContentLoaded', () => {

  // Load subjects pills
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
        pill.onclick = () => {
          pill.classList.toggle('selected');
          updateSelectedSubjects();
        };
        container.appendChild(pill);
      });
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
            rece_selectedGrade = '';
          } else {
            document.querySelectorAll('.grade-pill').forEach(p => p.classList.remove('selected'));
            pill.classList.add('selected');
            rece_selectedGrade = pill.dataset.grade;
          }
        };
        container.appendChild(pill);
      });
    });


  // Fetch and render students
  fetchStudents();

  // Search bar filtering
  const searchInput = document.getElementById('studentSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      const val = this.value.trim().toLowerCase();
      const filtered = studentsData.filter(s => s.studentName && s.studentName.toLowerCase().includes(val));
      renderStudentsTable(filtered);
    });
  }

  // Form submit
  document.getElementById('studentForm').addEventListener('submit', handleStudentFormSubmit);
});

function updateSelectedSubjects() {
  selectedSubjects = Array.from(document.querySelectorAll('.subject-pill.selected')).map(p => p.dataset.subject);
}

function fetchStudents() {
  fetch('/api/students')
    .then(res => res.json())
    .then(students => {
      studentsData = students;
      renderStudentsTable(students);
    });
}

function renderStudentsTable(students) {
  const container = document.getElementById('studentsTableContainer');
  // Column definitions for placeholder mapping
  const columns = [
    { key: 'studentName', label: 'Name' },
    { key: 'subjects', label: 'Subjects' },
    { key: 'schoolName', label: 'School' },
    { key: 'curriculum', label: 'Curriculum' },
    { key: 'gradeLevel', label: 'Grade' },
    { key: 'discount', label: 'Discount (%)' },
    { key: 'notes', label: 'Notes' },
    { key: 'phoneNumber', label: 'Phone' },
    { key: 'parentName', label: 'Parent Name' },
    { key: 'parentPhone', label: 'Parent Phone' }
  ];
  let html = `<div class="table-responsive">
    <table class="table table-bordered table-hover table-striped align-middle table-students">
      <thead class="table-light">
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Subjects</th>
          <th>School</th>
          <th>Curriculum</th>
          <th>Grade</th>
          <th>Discount (%)</th>
          <th>Notes</th>
          <th>Phone</th>
          <th>Parent Name</th>
          <th>Parent Phone</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>`;
  if (students.length === 0) {
    html += `<tr><td colspan="12" class="text-center text-muted">No students found.</td></tr>`;
  } else {
    students.forEach((s, i) => {
      html += `<tr>`;
      html += `<td>${i + 1}</td>`;
      columns.forEach(col => {
        let value = '';
        if (col.key === 'subjects') {
          value = (s.subjects || []).join(', ');
        } else if (col.key === 'discount') {
          value = typeof s.discount === 'number' ? s.discount : '';
        } else {
          value = s[col.key] || '';
        }
        // Show placeholder if empty
        if (value === '' || (Array.isArray(value) && value.length === 0)) {
          html += `<td class="editable placeholder" data-field="${col.key}" data-id="${s.id}">${col.label}</td>`;
        } else {
          html += `<td class="editable" data-field="${col.key}" data-id="${s.id}">${value}</td>`;
        }
      });
      html += `<td><button class="btn btn-sm btn-danger" onclick="deleteStudent(${s.id})"><i class='bi bi-trash'></i></button></td>`;
      html += `</tr>`;
    });
  }
  html += '</tbody></table></div>';
  container.innerHTML = html;
  addInlineEditing();
}

function addInlineEditing() {
  document.querySelectorAll('.editable').forEach(cell => {
    cell.addEventListener('click', async function(e) {
      if (this.querySelector('input') || this.querySelector('.subjects-edit-container') || this.querySelector('.grades-edit-container')) return;
      const oldValue = this.textContent;
      const field = this.dataset.field;
      const id = this.dataset.id;
      if (field === 'subjects') {
        // Fetch all subjects
        const res = await fetch('/database/subjects.json');
        let allSubjects = await res.json();
        // Sort alphabetically by name or value
        allSubjects.sort((a, b) => {
          const nameA = (a.name || a).toLowerCase();
          const nameB = (b.name || b).toLowerCase();
          return nameA.localeCompare(nameB);
        });
        const currentSubjects = oldValue.split(',').map(s => s.trim()).filter(Boolean);
        // Create container for subject pills
        const container = document.createElement('div');
        container.className = 'subjects-edit-container';
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
            const update = { subjects: selected };
            const updateRes = await fetch(`/api/students/${id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(update)
            });
            if (!updateRes.ok) alert('Failed to update.');
            else {
              // Register an undo action for the subjects change
              if (window.pushAction && window.createEditAction) {
                window.pushAction(window.createEditAction(
                  { id, subjects: currentSubjects },
                  { id, subjects: selected },
                  'student',
                  '/api/students',
                  fetchStudents
                ));
              }
              fetchStudents();
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
      } else if (field === 'gradeLevel') {
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
            if (pill.classList.contains('selected')) {
              pill.classList.remove('selected');
              // Save empty gradeLevel (deselect)
              const update = { gradeLevel: '' };
              const updateRes = await fetch(`/api/students/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(update)
              });
              if (!updateRes.ok) alert('Failed to update.');
              else {
                // Register an undo action for the grade change (deselect)
                if (window.pushAction && window.createEditAction) {
                  window.pushAction(window.createEditAction(
                    { id, gradeLevel: oldValue },
                    { id, gradeLevel: '' },
                    'student',
                    '/api/students',
                    fetchStudents
                  ));
                }
                fetchStudents();
              }
            } else {
              document.querySelectorAll('.grades-edit-container .grade-pill').forEach(p => p.classList.remove('selected'));
              pill.classList.add('selected');
              // Save immediately on selection change
              const update = { gradeLevel: pill.dataset.grade };
              const updateRes = await fetch(`/api/students/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(update)
              });
              if (!updateRes.ok) alert('Failed to update.');
              else {
                // Register an undo action for the grade change
                if (window.pushAction && window.createEditAction) {
                  window.pushAction(window.createEditAction(
                    { id, gradeLevel: oldValue },
                    { id, gradeLevel: pill.dataset.grade },
                    'student',
                    '/api/students',
                    fetchStudents
                  ));
                }
                fetchStudents();
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
      } else if (field === 'discount') {
        // Inline editing for discount: number input, 0-100, allow empty to remove
        const input = document.createElement('input');
        input.type = 'number';
        input.value = oldValue;
        input.className = 'form-control';
        input.style.minWidth = '80px';
        input.min = String(0);
        input.max = String(100);
        input.placeholder = '0-100 or empty';
        this.textContent = '';
        this.appendChild(input);
        input.focus();
        input.addEventListener('blur', async function() {
          let newValue = input.value.trim();
          let update;
          if (newValue === '') {
            update = { discount: null };
          } else {
            let numValue = Number(newValue);
            if (isNaN(numValue) || numValue < 0 || numValue > 100) {
              alert('Discount must be a number between 0 and 100, or empty.');
              cell.textContent = oldValue;
              return;
            }
            update = { discount: numValue };
          }
          const res = await fetch(`/api/students/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(update)
          });
          if (!res.ok) alert('Failed to update.');
          else {
            // Register an undo action for the discount edit
            if (window.pushAction && window.createEditAction) {
              window.pushAction(window.createEditAction(
                { id, discount: oldValue === '' ? null : Number(oldValue) },
                { id, discount: update.discount },
                'student',
                '/api/students',
                fetchStudents
              ));
            }
            fetch('/api/students')
              .then(res => res.json())
              .then(students => {
                studentsData = students;
                const searchInput = document.getElementById('studentSearchInput');
                if (searchInput) {
                  const val = searchInput.value.trim().toLowerCase();
                  const filtered = studentsData.filter(s => s.studentName && s.studentName.toLowerCase().includes(val));
                  renderStudentsTable(filtered);
                } else {
                  renderStudentsTable(studentsData);
                }
              });
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
            const update: { [key: string]: any } = {};
            update[field] = newValue;
            const res = await fetch(`/api/students/${id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(update)
            });
            if (!res.ok) alert('Failed to update.');
            else {
              // Register an undo action for the inline edit
              if (window.pushAction && window.createEditAction) {
                window.pushAction(window.createEditAction(
                  { id, [field]: oldValue },
                  { id, [field]: newValue },
                  'student',
                  '/api/students',
                  fetchStudents
                ));
              }
              // If phoneNumber was updated, also update absence logs
              if (field === 'phoneNumber') {
                // Find student name for this id
                const student = studentsData.find(s => String(s.id) === String(id));
                if (student && student.studentName) {
                  await fetch('/api/student-absence-logs/update-phone', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ studentName: student.studentName, phone: newValue })
                  });
                }
              }
              // After update, preserve search filter
              fetch('/api/students')
                .then(res => res.json())
                .then(students => {
                  studentsData = students;
                  const searchInput = document.getElementById('studentSearchInput');
                  if (searchInput) {
                    const val = searchInput.value.trim().toLowerCase();
                    const filtered = studentsData.filter(s => s.studentName && s.studentName.toLowerCase().includes(val));
                    renderStudentsTable(filtered);
                  } else {
                    renderStudentsTable(studentsData);
                  }
                });
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

// Delete student
window.deleteStudent = async function(id) {
  // Fetch the student first so it can be restored by the Undo button
  let student = null;
  try {
    const list = await (await fetch('/api/students')).json();
    student = list.find(s => String(s.id) === String(id)) || null;
  } catch (e) { /* ignore */ }
  const res = await fetch(`/api/students/${id}`, { method: 'DELETE' });
  if (res.ok && student && window.pushAction && window.createDeleteAction) {
    window.pushAction(window.createDeleteAction(student, 'student', '/api/students', fetchStudents));
  }
  // After delete, preserve search filter
  const searchInput = document.getElementById('studentSearchInput');
  if (searchInput) {
    const val = searchInput.value.trim().toLowerCase();
    // Remove from studentsData
    studentsData = studentsData.filter(s => s.id !== id);
    const filtered = studentsData.filter(s => s.studentName && s.studentName.toLowerCase().includes(val));
    renderStudentsTable(filtered);
  } else {
    fetchStudents();
  }
}

// Handle form submit
function handleStudentFormSubmit(e) {
  e.preventDefault();
  const form = e.target;
  updateSelectedSubjects();
  const data = {
    studentName: form.studentName.value.trim(),
    subjects: selectedSubjects,
    schoolName: form.schoolName.value.trim(),
    curriculum: form.curriculum.value.trim(),
    gradeLevel: rece_selectedGrade,
    // attendance removed
    notes: form.notes.value.trim(),
    phoneNumber: form.phoneNumber.value.trim(),
    parentName: form.parentName.value.trim(),
    parentPhone: form.parentPhone.value.trim(),
    discount: form.discount && form.discount.value !== '' ? Number(form.discount.value) : undefined
  };
  let url = '/api/students';
  let method = 'POST';
  if (editingStudentId) {
    url += `/${editingStudentId}`;
    method = 'PUT';
  }
  fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
    .then(async res => {
      const result = await res.json();
      if (!res.ok) {
        let msg = result.error || 'Failed to save student.';
        if (result.details) msg += '\nDetails: ' + result.details;
        if (result.stack) msg += '\nStack: ' + result.stack;
        alert(msg);
        throw new Error(msg);
      }
      // Success
      // Register an undo action so an added student can be removed
      if (method === 'POST' && result && result.id && window.pushAction && window.createAddAction) {
        window.pushAction(window.createAddAction(result, 'student', '/api/students', fetchStudents));
      }
      form.reset();
      document.querySelectorAll('.subject-pill.selected').forEach(p => p.classList.remove('selected'));
      document.querySelectorAll('.grade-pill.selected').forEach(p => p.classList.remove('selected'));
      selectedSubjects = [];
      rece_selectedGrade = '';
      editingStudentId = null;
      fetchStudents();
    })
    .catch(err => {
      // Error already alerted
      console.error('Student save error:', err);
    });
}
