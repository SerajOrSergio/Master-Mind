// Student Materials Page Logic (Admin)
// Auto-fills the student's info (grade pills from the grades database and the
// student's subjects) and manages their uploaded class material files.
// Two view modes: Table (inline editing) and Shelf (library-style browsing).

// Import undo manager
import { pushAction, createDeleteAction, createEditAction, createAddAction } from '/assist/undo-manager.js';

let allStudents = [];
let selectedGrade = '';
let selectedSubjects = []; // subjects picked manually on this page (not from the students database)
let pendingFiles = []; // File objects picked but not yet uploaded (sent on submit)
let viewMode = 'table';
let currentFilter = '';
let currentEntries = []; // last fetched entries, so view switching needs no refetch

// Escape text that is placed into the table HTML (file names are typed by
// users when they upload, so they must never be injected raw).
function ms_table_escape(value) {
  return String(value === undefined || value === null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

document.addEventListener('DOMContentLoaded', () => {
  // Load sidebar — sidebar-loader.js already injects it; this only fills the
  // container as a fallback when that script is not on the page.
  fetch('/src/components/admin/sidebar-menu/sidebar.html')
    .then(res => (res.ok ? res.text() : ''))
    .then(html => {
      const container = document.getElementById('sidebar-container') || document.getElementById('sidebar');
      if (html && container && !container.innerHTML.trim()) container.innerHTML = html;
    })
    .catch(() => {});

  // Load grade pills from the grades database (single-select)
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

  // Load subject pills from the subjects database — picked MANUALLY here
  // (multi-select) and saved with the material entry; nothing is pulled
  // from the student's record.
  fetch('/database/subjects.json')
    .then(res => res.json())
    .then(subjects => {
      subjects.sort((a, b) => (a.name || a).toLowerCase().localeCompare((b.name || b).toLowerCase()));
      const container = document.getElementById('subjectsContainer');
      container.innerHTML = '';
      subjects.forEach(subj => {
        const pill = document.createElement('div');
        pill.className = 'grade-pill'; // same pill look/behavior as the grade pills
        pill.textContent = subj.name || subj;
        pill.dataset.subject = subj.name || subj;
        pill.onclick = () => {
          pill.classList.toggle('selected');
          selectedSubjects = Array.from(
            document.querySelectorAll('#subjectsContainer .grade-pill.selected')
          ).map(p => p.dataset.subject);
        };
        container.appendChild(pill);
      });
    });

  // Load all students for the searchable student picker (alphabetical)
  fetch('/api/students')
    .then(res => res.json())
    .then(students => {
      allStudents = students;
      // Keep the picker list collapsed on page load — it opens when the
      // admin clicks or types in the search field instead.
    });

  // --- Student picker: type to search, click a name to select him/her ---
  const pickerInput = document.getElementById('studentSearch');
  const pickerList = document.getElementById('studentPickerList');
  const pickerClear = document.getElementById('studentPickerClear');

  function renderPickerList(filter) {
    const val = String(filter || '').trim().toLowerCase();
    pickerList.innerHTML = '';
    const sorted = allStudents
      .filter(s => s.studentName)
      .sort((a, b) => a.studentName.localeCompare(b.studentName));
    let shown = 0;
    sorted.forEach(s => {
      if (val && !s.studentName.toLowerCase().includes(val)) return;
      shown++;
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'student-picker-item';
      item.textContent = s.studentName;
      item.title = [s.phoneNumber, s.gradeLevel].filter(Boolean).join(' · ');
      item.onclick = () => selectStudent(s);
      pickerList.appendChild(item);
    });
    if (shown === 0) {
      const none = document.createElement('div');
      none.className = 'student-picker-empty text-muted small';
      none.textContent = 'No students match your search.';
      pickerList.appendChild(none);
    }
    pickerList.classList.remove('d-none');
  }

  function selectStudent(s) {
    document.getElementById('studentId').value = String(s.id);
    pickerInput.value = s.studentName;
    pickerInput.readOnly = true;
    pickerClear.classList.remove('d-none');
    // The moment a student is selected, post their saved info into the form
    document.getElementById('phoneNumber').value = s.phoneNumber || '';
    document.getElementById('curriculum').value = s.curriculum || '';
    // Grade: auto-select the matching pill from the grades database
    document.querySelectorAll('#gradesContainer .grade-pill').forEach(p => {
      p.classList.toggle('selected', p.dataset.grade === (s.gradeLevel || ''));
    });
    selectedGrade = s.gradeLevel || '';
    // Subjects: picked manually below — NOT auto-filled from the student's record
    pickerList.classList.add('d-none');
  }

  function clearStudentSelection() {
    document.getElementById('studentId').value = '';
    pickerInput.value = '';
    pickerInput.readOnly = false;
    pickerClear.classList.add('d-none');
    document.getElementById('phoneNumber').value = '';
    document.getElementById('curriculum').value = '';
    document.querySelectorAll('#gradesContainer .grade-pill').forEach(p => p.classList.remove('selected'));
    selectedGrade = '';
    pickerInput.focus();
    renderPickerList('');
  }

  // Typing (or focusing) reopens the search list
  pickerInput.addEventListener('input', function() { renderPickerList(this.value); });
  pickerInput.addEventListener('focus', function() { renderPickerList(pickerInput.value); });
  pickerInput.addEventListener('click', function() { renderPickerList(pickerInput.value); });
  pickerClear.addEventListener('click', clearStudentSelection);
  // Close the list when clicking anywhere outside the picker
  document.addEventListener('mousedown', function(e) {
    if (!pickerList.contains(e.target as Node) && e.target !== pickerInput) {
      pickerList.classList.add('d-none');
    }
  });

  // Queue picked files (multiple allowed), shown as removable chips
  document.getElementById('materialFiles').addEventListener('change', function() {
    for (const f of this.files) {
      if (!pendingFiles.some(p => p.name === f.name && p.size === f.size)) pendingFiles.push(f);
    }
    this.value = ''; // allow re-picking the same file later
    renderPendingFiles();
  });

  // Search bar: quick find across student, subject, grade, curriculum and files
  document.getElementById('materialsSearchInput').addEventListener('input', function() {
    currentFilter = this.value.trim().toLowerCase();
    renderCurrentView();
  });

  // View mode toggle (Table / Shelf)
  document.getElementById('viewTableBtn').addEventListener('click', () => setViewMode('table'));
  document.getElementById('viewShelfBtn').addEventListener('click', () => setViewMode('shelf'));

  function setViewMode(mode) {
    viewMode = mode;
    document.getElementById('viewTableBtn').classList.toggle('active', mode === 'table');
    document.getElementById('viewShelfBtn').classList.toggle('active', mode === 'shelf');
    renderCurrentView();
  }

  // Handle submit: create the entry (JSON), then upload the queued files
  document.getElementById('studentMaterialsForm').onsubmit = async function(e) {
    e.preventDefault();
    const studentId = document.getElementById('studentId').value;
    if (!studentId) { alert('Please select a student.'); return; }
    const entry = {
      studentId: Number(studentId),
      studentName: document.getElementById('studentSearch').value,
      phoneNumber: document.getElementById('phoneNumber').value.trim(),
      gradeLevel: selectedGrade,
      curriculum: document.getElementById('curriculum').value.trim(),
      subjects: selectedSubjects
    };
    const res = await fetch('/api/student-materials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry)
    });
    if (!res.ok) {
      let msg = 'Failed to add student material.';
      try {
        const err = await res.json();
        if (err && err.error) msg += '\n' + err.error;
        if (err && err.details) msg += '\n' + err.details;
      } catch {}
      alert(msg);
      return;
    }
    const created = await res.json().catch(() => null);
    // Register an undo action so the new entry can be removed
    if (created && created.id) {
      const undoAction = createAddAction(
        created,
        'student-material',
        '/api/student-materials',
        async () => { loadMaterials(); }
      );
      pushAction(undoAction);
    }
    // Upload the queued material files to the new entry, one by one
    for (const f of pendingFiles) {
      const fd = new FormData();
      fd.append('files', f, f.name);
      const upRes = await fetch(`/api/student-materials/${created.id}/files`, { method: 'POST', body: fd });
      if (!upRes.ok) alert(`Failed to upload file "${f.name}".`);
    }
    // Reset the form for the next entry
    pendingFiles = [];
    renderPendingFiles();
    this.reset();
    document.getElementById('studentId').value = '';
    const pickerInput = document.getElementById('studentSearch');
    pickerInput.value = '';
    pickerInput.readOnly = false;
    document.getElementById('studentPickerClear').classList.add('d-none');
    document.getElementById('phoneNumber').value = '';
    document.getElementById('curriculum').value = '';
    document.querySelectorAll('#gradesContainer .grade-pill').forEach(p => p.classList.remove('selected'));
    selectedGrade = '';
    document.querySelectorAll('#subjectsContainer .grade-pill').forEach(p => p.classList.remove('selected'));
    selectedSubjects = [];
    loadMaterials();
  };

  // Load student materials, then render whichever view is active
  async function loadMaterials() {
    const res = await fetch('/api/student-materials');
    currentEntries = await res.json();
    renderCurrentView();
  }

  function renderCurrentView() {
    if (viewMode === 'shelf') renderShelf();
    else renderTable();
  }

  // Quick find (case-insensitive) across every visible field + file names
  function matchesFilter(entry, filter) {
    if (!filter) return true;
    const hay = [
      entry.studentName,
      entry.phoneNumber,
      entry.gradeLevel,
      entry.curriculum,
      (entry.subjects || []).join(' '),
      ...(entry.materials || []).map(f => f.name)
    ].join(' ').toLowerCase();
    return hay.includes(filter);
  }

  // ============ TABLE VIEW (inline editing) ============
  function renderTable() {
    const entries = [...currentEntries].sort((a, b) => a.id - b.id);
    const table = document.createElement('table');
    table.className = 'table table-bordered';
    table.innerHTML = `<thead><tr><th>#</th><th>Student Name</th><th>Phone Number</th><th>Grade</th><th>Curriculum</th><th>Subjects</th><th>Material Files</th><th>Actions</th></tr></thead><tbody></tbody>`;
    entries.forEach((m, i) => {
      const tr = document.createElement('tr');
      const files = (m.materials || []);
      tr.innerHTML = `
        <td>${i+1}</td>
        <td class="editable" data-field="studentName" data-id="${m.id}">${m.studentName}</td>
        <td class="editable" data-field="phoneNumber" data-id="${m.id}">${m.phoneNumber}</td>
        <td class="editable" data-field="gradeLevel" data-id="${m.id}">${m.gradeLevel||''}</td>
        <td class="editable" data-field="curriculum" data-id="${m.id}">${m.curriculum||''}</td>
        <td>${(m.subjects||[]).map(function(subj){ return '<span class="ms-subject-chip">' + ms_table_escape(subj) + '</span>'; }).join('') || '<span class="text-muted">—</span>'}</td>
        <td class="editable materials-cell" data-field="materials" data-id="${m.id}" title="Click to add or remove material files">${files.length ? '<span class="ms-file-count">' + files.length + ' file' + (files.length === 1 ? '' : 's') + '</span>' + files.map(function(f){ return '<span class="ms-file-chip"><i class="bi bi-file-earmark-text"></i>' + ms_table_escape(f.name) + '</span>'; }).join('') : '<span class="text-muted">Click to add files</span>'}</td>
        <td class="table-actions">
          <div class="actions-stack">
            <button class="btn btn-sm action-btn action-delete" onclick="deleteStudentMaterial(${m.id})" title="Delete this entry">
              <i class="bi bi-trash me-1"></i>Delete
            </button>
          </div>
        </td>
      `;
      table.querySelector('tbody').appendChild(tr);
      // hide filtered-out rows in table view too
      tr.style.display = matchesFilter(m, currentFilter) ? '' : 'none';
    });
    document.getElementById('materialsTableContainer').innerHTML = '';
    document.getElementById('materialsTableContainer').appendChild(table);

    // Inline editing: text fields
    document.querySelectorAll('.editable:not(.materials-cell)').forEach(cell => {
      cell.addEventListener('click', async function(e) {
        if (this.querySelector('input') || this.querySelector('.grades-edit-container')) return; // already editing
        const oldValue = this.textContent;
        const field = this.dataset.field;
        const id = this.dataset.id;
        if (field === 'gradeLevel') {
          openGradeEditor(this, id);
          return;
        }
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
            // Capture the current (old) entry for undo before mutating
            const oldRes = await fetch(`/api/student-materials/${id}`);
            let oldEntry = null;
            if (oldRes.ok) oldEntry = await oldRes.json();
            const update: { [key: string]: any } = {};
            update[field] = newValue;
            const res = await fetch(`/api/student-materials/${id}`, {
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
                  'student-material',
                  '/api/student-materials',
                  async () => { loadMaterials(); }
                );
                pushAction(undoAction);
              }
              loadMaterials();
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
      });
    });

    // Materials cell: popup to add / remove / download files
    document.querySelectorAll('.materials-cell').forEach(cell => {
      cell.addEventListener('click', async function(e) {
        if (this.querySelector('.materials-edit-container')) return; // already open
        openMaterialsPopup(this, this.dataset.id);
      });
    });
  }

  // Grade cell editor: single-select pills from the grades database
  async function openGradeEditor(cell, id) {
    if (cell.dataset.editing === '1') return; // already editing
    cell.dataset.editing = '1';
    const grades = await getGrades();
    const oldValue = cell.textContent;
    const container = document.createElement('div');
    container.className = 'grades-edit-container';
    const gradesToRender = grades;
    gradesToRender.forEach(grade => {
      const pill = document.createElement('div');
      pill.className = 'grade-pill';
      pill.textContent = grade.name || grade;
      pill.dataset.grade = grade.name || grade;
      if ((grade.name || grade) === oldValue) pill.classList.add('selected');
      pill.onclick = async (ev) => {
        // Capture the current (old) entry for undo before mutating
        const oldRes = await fetch(`/api/student-materials/${id}`);
        let oldEntry = null;
        if (oldRes.ok) oldEntry = await oldRes.json();
        let newVal;
        if (pill.classList.contains('selected')) {
          pill.classList.remove('selected');
          newVal = '';
        } else {
          container.querySelectorAll('.grade-pill').forEach(p => p.classList.remove('selected'));
          pill.classList.add('selected');
          newVal = pill.dataset.grade;
        }
        const res = await fetch(`/api/student-materials/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ gradeLevel: newVal })
        });
        if (!res.ok) alert('Failed to update.');
        else {
          if (oldEntry) {
            const undoAction = createEditAction(
              oldEntry,
              { ...oldEntry, gradeLevel: newVal },
              'student-material',
              '/api/student-materials',
              async () => { loadMaterials(); }
            );
            pushAction(undoAction);
          }
          loadMaterials();
        }
      };
      container.appendChild(pill);
    });
    cell.textContent = '';
    cell.appendChild(container);
    const closePopup = (event) => {
      if (!container.contains(event.target) && event.target !== cell) {
        cell.textContent = oldValue;
        delete cell.dataset.editing;
        document.removeEventListener('mousedown', closePopup);
      }
    };
    setTimeout(() => { document.addEventListener('mousedown', closePopup); }, 0);
  }

  // ============ SHELF VIEW (library mode) ============
  function renderShelf() {
    const container = document.getElementById('materialsTableContainer');
    container.innerHTML = '';
    const entries = [...currentEntries].sort((a, b) => String(a.studentName).localeCompare(String(b.studentName)))
      .filter(m => matchesFilter(m, currentFilter));

    if (entries.length === 0) {
      container.innerHTML = `<div class="text-muted text-center py-4">${currentFilter ? 'No materials match your search.' : 'No materials yet — add one from the form above.'}</div>`;
      return;
    }

    // Group entries into shelves by subject (an entry with several subjects
    // appears on every shelf it belongs to; no subject → General shelf)
    const shelves = new Map();
    entries.forEach(m => {
      const subjects = (m.subjects && m.subjects.length) ? m.subjects : ['General'];
      subjects.forEach(subj => {
        if (!shelves.has(subj)) shelves.set(subj, []);
        shelves.get(subj).push(m);
      });
    });
    const shelfNames = [...shelves.keys()].sort((a, b) => {
      if (a === 'General') return 1;
      if (b === 'General') return -1;
      return a.localeCompare(b);
    });

    shelfNames.forEach(subj => {
      const section = document.createElement('div');
      section.className = 'shelf-section';
      const header = document.createElement('div');
      header.className = 'shelf-header';
      header.innerHTML = `<i class="bi bi-collection"></i><span class="shelf-name">${subj}</span><span class="shelf-count-pill">${shelves.get(subj).length}</span>`;
      const row = document.createElement('div');
      row.className = 'shelf-row';
      shelves.get(subj).forEach(m => row.appendChild(buildBookCard(m, subj)));
      section.appendChild(header);
      section.appendChild(row);
      container.appendChild(section);
    });
  }

  function buildBookCard(m, shelfSubject) {
    const pretty = (n) => n >= 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`;
    const card = document.createElement('div');
    card.className = 'book-card';

    // top row: grade badge + delete button
    const top = document.createElement('div');
    top.className = 'book-top';
    const badge = document.createElement('span');
    badge.className = 'book-grade-badge';
    badge.textContent = m.gradeLevel || 'No grade';
    badge.title = m.curriculum ? `Curriculum: ${m.curriculum}` : '';
    const del = document.createElement('button');
    del.type = 'button';
    del.className = 'btn btn-sm book-delete-btn';
    del.innerHTML = '<i class="bi bi-trash"></i>';
    del.title = 'Delete this entry';
    del.onclick = () => deleteStudentMaterial(m.id);
    top.appendChild(badge);
    top.appendChild(del);

    // student name + phone
    const name = document.createElement('div');
    name.className = 'book-student';
    name.textContent = m.studentName;
    const phone = document.createElement('div');
    phone.className = 'book-meta text-muted small';
    phone.innerHTML = m.phoneNumber ? `<i class="bi bi-telephone me-1"></i>${m.phoneNumber}` : '';

    // subjects on the book spine tags
    const subjects = document.createElement('div');
    subjects.className = 'book-subjects';
    (m.subjects || []).forEach(subj => {
      const chip = document.createElement('span');
      chip.className = 'subject-chip';
      chip.textContent = subj;
      subjects.appendChild(chip);
    });

    // material file chips (click = download, × = remove)
    const files = document.createElement('div');
    files.className = 'book-files';
    (m.materials || []).forEach((f, i) => {
      const chip = document.createElement('a');
      chip.className = 'book-file-chip';
      chip.href = `/api/student-materials/${m.id}/files/${i}/download`;
      chip.setAttribute('download', f.name);
      chip.title = `Download ${f.name} (${pretty(f.size)})`;
      chip.innerHTML = `<i class="bi bi-file-earmark-arrow-down me-1"></i><span>${f.name}</span>`;
      const rm = document.createElement('button');
      rm.type = 'button';
      rm.className = 'material-remove-btn';
      rm.innerHTML = '<i class="bi bi-x"></i>';
      rm.title = 'Remove this file';
      rm.onclick = async (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        if (!confirm(`Remove file "${f.name}"?`)) return;
        const delRes = await fetch(`/api/student-materials/${m.id}/files/${i}`, { method: 'DELETE' });
        if (!delRes.ok) alert('Failed to remove file.');
        loadMaterials();
      };
      chip.appendChild(rm);
      files.appendChild(chip);
    });

    // add files button (hidden input)
    const addRow = document.createElement('div');
    addRow.className = 'book-add-row';
    const addBtn = document.createElement('button');
    addBtn.type = 'button';
    addBtn.className = 'btn btn-sm action-btn action-add';
    addBtn.innerHTML = '<i class="bi bi-plus-lg me-1"></i>Add files';
    const pick = document.createElement('input');
    pick.type = 'file';
    pick.multiple = true;
    pick.style.display = 'none';
    pick.addEventListener('change', async function() {
      if (!this.files || this.files.length === 0) return;
      for (const f of this.files) {
        const fd = new FormData();
        fd.append('files', f, f.name);
        const upRes = await fetch(`/api/student-materials/${m.id}/files`, { method: 'POST', body: fd });
        if (!upRes.ok) alert(`Failed to upload file "${f.name}".`);
      }
      loadMaterials();
    });
    addBtn.onclick = () => pick.click();
    addRow.appendChild(addBtn);
    addRow.appendChild(pick);

    card.appendChild(top);
    card.appendChild(name);
    if (m.phoneNumber) card.appendChild(phone);
    if (m.curriculum) {
      const cur = document.createElement('div');
      cur.className = 'book-meta text-muted small';
      cur.innerHTML = `<i class="bi bi-journals me-1"></i>${m.curriculum}`;
      card.appendChild(cur);
    }
    if ((m.subjects || []).length) card.appendChild(subjects);
    card.appendChild(files);
    card.appendChild(addRow);
    return card;
  }

  window.deleteStudentMaterial = async function(id) {
    if (!confirm('Delete this student material entry (and its uploaded files)?')) return;

    // Fetch the entry (and its list position) before deleting so the undo
    // button can restore it in the same spot (best effort)
    let entry = null;
    let entryIdx = -1;
    try {
      const listRes = await fetch('/api/student-materials');
      if (listRes.ok) {
        const list = await listRes.json();
        entryIdx = list.findIndex(m => String(m.id) === String(id));
        if (entryIdx !== -1) entry = list[entryIdx];
      }
    } catch (err) {
      console.warn('Could not fetch student material for undo', err);
    }

    const res = await fetch('/api/student-materials/' + id, { method: 'DELETE' });
    if (res.ok) {
      if (entry) {
        // Create undo action for the deletion (_restoreIndex keeps the entry
        // at its original position, not the bottom of the list)
        const undoAction = createDeleteAction(
          { ...entry, _restoreIndex: entryIdx },
          'student-material',
          '/api/student-materials',
          async () => { loadMaterials(); }
        );
        pushAction(undoAction);
      }

      loadMaterials();
    } else {
      alert('Failed to delete student material.');
    }
  }

  // Materials cell popup (used by table view): add / remove / download files
  async function openMaterialsPopup(cell, id) {
    const res = await fetch(`/api/student-materials/${id}`);
    if (!res.ok) { alert('Failed to load entry.'); return; }
    const entry = await res.json();
    const materials = (entry.materials || []).map((m, i) => ({ ...m, index: i }));
    const pretty = (n) => n >= 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`;

    const container = document.createElement('div');
    container.className = 'materials-edit-container';
    const list = document.createElement('div');
    list.className = 'materials-file-list';
    if (materials.length === 0) {
      const none = document.createElement('div');
      none.className = 'text-muted small';
      none.textContent = 'No material files yet.';
      list.appendChild(none);
    }
    materials.forEach(m => {
      const row = document.createElement('div');
      row.className = 'material-file-row';
      const link = document.createElement('a');
      link.className = 'material-file-link';
      link.href = `/api/student-materials/${id}/files/${m.index}/download`;
      link.textContent = `${m.name}`;
      link.title = 'Open / download this file';
      link.setAttribute('download', m.name);
      const size = document.createElement('span');
      size.className = 'material-file-size text-muted';
      size.textContent = ` (${pretty(m.size)})`;
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'btn btn-sm material-remove-btn';
      remove.innerHTML = '<i class="bi bi-x"></i>';
      remove.title = 'Remove this file';
      remove.onclick = async () => {
        if (!confirm(`Remove file "${m.name}"?`)) return;
        const delRes = await fetch(`/api/student-materials/${id}/files/${m.index}`, { method: 'DELETE' });
        if (!delRes.ok) alert('Failed to remove file.');
        loadMaterials(); // re-renders and closes the popup
      };
      row.appendChild(link);
      row.appendChild(size);
      row.appendChild(remove);
      list.appendChild(row);
    });
    // Add-file control inside the popup
    const addRow = document.createElement('div');
    addRow.className = 'mt-2';
    const addBtn = document.createElement('button');
    addBtn.type = 'button';
    addBtn.className = 'btn btn-sm action-btn action-add';
    addBtn.innerHTML = '<i class="bi bi-plus-lg me-1"></i>Add files';
    const pick = document.createElement('input');
    pick.type = 'file';
    pick.multiple = true;
    pick.style.display = 'none';
    pick.addEventListener('change', async function() {
      if (!this.files || this.files.length === 0) return;
      for (const f of this.files) {
        const fd = new FormData();
        fd.append('files', f, f.name);
        const upRes = await fetch(`/api/student-materials/${id}/files`, { method: 'POST', body: fd });
        if (!upRes.ok) alert(`Failed to upload file "${f.name}".`);
      }
      loadMaterials(); // re-renders and closes the popup
    });
    addBtn.onclick = () => pick.click();
    addRow.appendChild(addBtn);
    addRow.appendChild(pick);
    container.appendChild(list);
    container.appendChild(addRow);

    cell.textContent = '';
    cell.appendChild(container);
    // Close popup if click outside
    const closePopup = (event) => {
      if (!container.contains(event.target) && event.target !== cell) {
        loadMaterials();
        document.removeEventListener('mousedown', closePopup);
      }
    };
    setTimeout(() => {
      document.addEventListener('mousedown', closePopup);
    }, 0);
  }

  loadMaterials();
});

// Grades for the table's grade-cell editor (fetched once, awaitable so the
// editor never renders an empty pill list because of a race).
let _gradesPromise = null;
function getGrades() {
  if (!_gradesPromise) {
    _gradesPromise = fetch('/database/grades.json').then(res => res.json()).catch(() => []);
  }
  return _gradesPromise;
}

// Render the queued (not yet uploaded) files as removable chips
function renderPendingFiles() {
  const container = document.getElementById('pendingMaterials');
  container.innerHTML = '';
  pendingFiles.forEach((f, i) => {
    const chip = document.createElement('span');
    chip.className = 'material-chip';
    const label = document.createElement('span');
    label.textContent = `${f.name} (${f.size >= 1024 * 1024 ? (f.size / 1024 / 1024).toFixed(1) + ' MB' : Math.max(1, Math.round(f.size / 1024)) + ' KB'})`;
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'btn btn-sm material-remove-btn';
    remove.innerHTML = '<i class="bi bi-x"></i>';
    remove.title = 'Remove this file';
    remove.onclick = () => {
      pendingFiles.splice(i, 1);
      renderPendingFiles();
    };
    chip.appendChild(label);
    chip.appendChild(remove);
    container.appendChild(chip);
  });
}
