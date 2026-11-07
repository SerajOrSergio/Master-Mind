// teachers-availability.js
// Complete recoded version with fixed syntax, proper inline editing, and reliable functionality

// Import undo manager
import { pushAction, createDeleteAction, createEditAction, createAddAction } from '/assist/undo-manager.js';

// Global Choices instances
let teacherChoices, subjectChoices, gradeFromChoices, gradeToChoices;
let currentAvailabilities = []; // store loaded availabilities for day locking

document.addEventListener('DOMContentLoaded', () => {
  // Initialize form and load data
  loadTeachers();
  loadSubjects();
  loadGradesRange();
  loadAvailabilities();

  const form = document.getElementById('availabilityForm');
  if (form) form.addEventListener('submit', handleFormSubmit);

  // Teacher selection change -> lock already assigned days
  const teacherSelect = document.getElementById('teacherSelect');
  if (teacherSelect) {
    teacherSelect.addEventListener('change', () => handleTeacherDayLocks());
  }
});

// ---------- UTILITIES ----------
function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>]/g, (m) => {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  });
}

// ---------- DAY LOCKING (disable days already assigned to selected teacher) ----------
async function handleTeacherDayLocks() {
  const teacherId = document.getElementById('teacherSelect').value;
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

  // Find assigned days for this teacher from currentAvailabilities
  let assignedDays = [];
  if (teacherId && currentAvailabilities.length) {
    assignedDays = currentAvailabilities
      .filter(a => String(a.teacherId) === String(teacherId))
      .flatMap(a => Object.keys(a.weeklySchedule || {}));
  }

  days.forEach(day => {
    const checkbox = document.querySelector(`input[name='day_${day}']`);
    const timeOpen = document.querySelector(`input[name='hours_${day}']`);
    const timeClose = document.querySelector(`input[name='hours_${day}_close']`);
    const statusSelect = document.querySelector(`select[name='status_${day}']`);
    const isAssigned = assignedDays.includes(day);

    if (checkbox) {
      checkbox.disabled = isAssigned;
      if (isAssigned) checkbox.checked = false;
    }
    if (timeOpen) {
      timeOpen.disabled = isAssigned;
      if (isAssigned) timeOpen.value = '';
    }
    if (timeClose) {
      timeClose.disabled = isAssigned;
      if (isAssigned) timeClose.value = '';
    }
    if (statusSelect) {
      statusSelect.disabled = isAssigned;
      if (isAssigned) statusSelect.value = 'available';
    }
  });
}

// ---------- LOAD FUNCTIONS (API) ----------
async function loadTeachers() {
  try {
    const res = await fetch('/api/teachers');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const teachers = await res.json();
    const select = document.getElementById('teacherSelect');
    if (!select) return;

    if (!Array.isArray(teachers) || teachers.length === 0) {
      select.innerHTML = '<option value="">No teachers found</option>';
    } else {
      select.innerHTML = '<option value="">Select Teacher</option>' +
        teachers.map(t => `<option value="${t.id}">${escapeHtml(t.firstName)} ${escapeHtml(t.lastName)}</option>`).join('');
    }

    if (teacherChoices) teacherChoices.destroy();
    teacherChoices = new Choices(select, {
      searchEnabled: true,
      itemSelectText: '',
      shouldSort: false,
      placeholder: true,
      placeholderValue: 'Select Teacher'
    });
  } catch (err) {
    console.error('Error loading teachers:', err);
    alert('Could not load teachers.');
  }
}

async function loadSubjects() {
  try {
    const res = await fetch('/api/subjects');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const subjects = await res.json();
    const select = document.getElementById('subjectSelect');
    if (!select) return;

    select.innerHTML = subjects.map(s => `<option value="${escapeHtml(s.name)}">${escapeHtml(s.name)}</option>`).join('');

    if (subjectChoices) subjectChoices.destroy();
    subjectChoices = new Choices(select, {
      searchEnabled: true,
      itemSelectText: '',
      shouldSort: false,
      placeholder: true,
      placeholderValue: 'Select Subject',
      removeItemButton: true,
      maxItemCount: 10,
      duplicateItemsAllowed: false,
      delimiter: ',',
      addItems: true
    });
  } catch (err) {
    console.error('Error loading subjects:', err);
  }
}

async function loadGradesRange() {
  try {
    const res = await fetch('/api/grades');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const grades = await res.json();
    const fromSelect = document.getElementById('gradeFromSelect');
    const toSelect = document.getElementById('gradeToSelect');
    if (!fromSelect || !toSelect) return;

    if (!grades.length) {
      fromSelect.innerHTML = '<option value="">No grades found</option>';
      toSelect.innerHTML = '<option value="">No grades found</option>';
    } else {
      const options = grades.map(g => `<option value="${escapeHtml(g.name)}">${escapeHtml(g.name)}</option>`).join('');
      fromSelect.innerHTML = '<option value="">From Grade</option>' + options;
      toSelect.innerHTML = '<option value="">To Grade</option>' + options;
    }

    if (gradeFromChoices) gradeFromChoices.destroy();
    if (gradeToChoices) gradeToChoices.destroy();
    gradeFromChoices = new Choices(fromSelect, {
      searchEnabled: true,
      itemSelectText: '',
      placeholder: true,
      placeholderValue: 'From Grade'
    });
    gradeToChoices = new Choices(toSelect, {
      searchEnabled: true,
      itemSelectText: '',
      placeholder: true,
      placeholderValue: 'To Grade'
    });
  } catch (err) {
    console.error('Error loading grades:', err);
  }
}

async function loadAvailabilities() {
  try {
    const res = await fetch('/api/teachers-availability');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const availabilities = await res.json();
    currentAvailabilities = availabilities;
    renderAvailabilities(availabilities);
    // After loading, re-apply day locks for current teacher selection
    handleTeacherDayLocks();
  } catch (err) {
    console.error('Error loading availabilities:', err);
    const container = document.getElementById('availabilitiesContainer');
    if (container) container.innerHTML = '<div class="alert alert-danger">Failed to load availabilities.</div>';
  }
}

// ---------- RENDER AVAILABILITIES (with inline editing) ----------
function renderAvailabilities(availabilities) {
  const container = document.getElementById('availabilitiesContainer');
  if (!container) return;

  if (!availabilities.length) {
    container.innerHTML = '<div class="alert alert-info">No availabilities saved yet.</div>';
    return;
  }

  let html = '';
  // Group by teacher name for readability
  const grouped: { [key: string]: any } = {};
  availabilities.forEach(av => {
    const key = av.teacherName || `Teacher ID ${av.teacherId}`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(av);
  });

  for (const [teacherName, entries] of Object.entries(grouped as { [key: string]: any })) {
    html += `<h4 class="mt-4 mb-2">${escapeHtml(teacherName)}</h4>`;
    html += `<div class="table-responsive mb-4" style="overflow-x:auto;">`;
    html += `<table class="table table-bordered table-hover align-middle availabilitiesTable w-100">`;
    html += `<thead class="table-light"><tr>
      <th>Day</th>
      <th>Start Time</th>
      <th>Close Time</th>
      <th>Status</th>
      <th>Subject</th>
      <th>Grade From</th>
      <th>Grade To</th>
      <th>Note</th>
      <th style="width:80px;">Actions</th>
    </tr></thead><tbody>`;

    for (const av of entries) {
      const weekly = av.weeklySchedule || {};
      for (const [day, info] of Object.entries(weekly as { [key: string]: any })) {
        if (!info) continue;
        let start = '', close = '';
        if (info.hours && info.hours.includes('-')) {
          [start, close] = info.hours.split('-').map(s => s.trim());
        } else {
          start = info.hours || '';
        }
        const status = info.status || 'available';
        const statusBadge = status === 'available' ? 'success' : (status === 'busy' ? 'danger' : 'secondary');

        html += `<tr data-id="${av.id}" data-day="${day}">
          <td class="day-name"><strong>${escapeHtml(day.charAt(0).toUpperCase() + day.slice(1))}</strong></td>
          <td class="week-hours" data-id="${av.id}" data-day="${day}" data-field="hours">${escapeHtml(start)}</td>
          <td class="week-hours-close" data-id="${av.id}" data-day="${day}" data-field="hoursClose">${escapeHtml(close)}</td>
          <td class="week-status" data-id="${av.id}" data-day="${day}" data-field="status">
            <span class="badge bg-${statusBadge}">${escapeHtml(status)}</span>
          </td>
          <td class="editable" data-field="subject" data-id="${av.id}">${formatSubjects(av.subject)}</td>
          <td class="editable" data-field="gradeFrom" data-id="${av.id}">${escapeHtml(av.gradeFrom || '')}</td>
          <td class="editable" data-field="gradeTo" data-id="${av.id}">${escapeHtml(av.gradeTo || '')}</td>
          <td class="editable" data-field="note" data-id="${av.id}"><small class="text-muted">${escapeHtml(av.note || '')}</small></td>
          <td><button class="btn btn-sm btn-danger delete-avail" data-id="${av.id}" data-day="${day}">Delete</button></td>
        </tr>`;
      }
    }
    html += `</tbody></table></div>`;
  }

  container.innerHTML = html;

  // Attach inline editing for weekly schedule (hours, hoursClose, status)
  attachWeeklyInlineEditing();
  // Attach inline editing for main fields (subject, gradeFrom, gradeTo, note)
  attachMainInlineEditing();
  // Attach delete buttons
  document.querySelectorAll('.delete-avail').forEach(btn => {
    btn.removeEventListener('click', deleteHandler);
    btn.addEventListener('click', deleteHandler);
  });
}

function formatSubjects(subject) {
  if (!subject) return '';
  if (Array.isArray(subject)) {
    return subject.map(s => `<span class='badge bg-info text-dark me-1'>${escapeHtml(s)}</span>`).join('');
  }
  return `<span class='badge bg-info text-dark'>${escapeHtml(subject)}</span>`;
}

// ---------- WEEKLY SCHEDULE INLINE EDITING (hours, hoursClose, status) ----------
function attachWeeklyInlineEditing() {
  // Edit hours (start)
  document.querySelectorAll('.week-hours').forEach(cell => {
    cell.style.cursor = 'pointer';
    cell.removeEventListener('click', weeklyEditHandler);
    cell.addEventListener('click', weeklyEditHandler);
  });
  // Edit hours close
  document.querySelectorAll('.week-hours-close').forEach(cell => {
    cell.style.cursor = 'pointer';
    cell.removeEventListener('click', weeklyEditHandler);
    cell.addEventListener('click', weeklyEditHandler);
  });
  // Edit status
  document.querySelectorAll('.week-status').forEach(cell => {
    cell.style.cursor = 'pointer';
    cell.removeEventListener('click', weeklyStatusEditHandler);
    cell.addEventListener('click', weeklyStatusEditHandler);
  });
}

async function weeklyEditHandler(e) {
  const cell = e.currentTarget;
  if (cell.querySelector('input')) return;

  const id = cell.getAttribute('data-id');
  const day = cell.getAttribute('data-day');
  const field = cell.getAttribute('data-field'); // 'hours' or 'hoursClose'
  let current = cell.innerText.trim();

  const input = document.createElement('input');
  input.type = 'time';
  input.className = 'form-control form-control-sm';
  input.value = current;
  cell.innerHTML = '';
  cell.appendChild(input);
  input.focus();

  const save = async () => {
    const newValue = input.value;
    if (newValue === current) {
      cell.innerHTML = escapeHtml(current);
      attachWeeklyInlineEditing();
      return;
    }
    try {
      // Fetch full object
      const getRes = await fetch(`/api/teachers-availability/${id}`);
      if (!getRes.ok) throw new Error('Fetch failed');
      const avail = await getRes.json();
      const oldData = JSON.parse(JSON.stringify(avail));
      if (!avail.weeklySchedule[day]) avail.weeklySchedule[day] = { hours: '', status: 'available' };
      if (field === 'hours') {
        // Combine with existing close time if present
        const closeField = document.querySelector(`.week-hours-close[data-id="${id}"][data-day="${day}"]`);
        const closeVal = closeField ? closeField.innerText.trim() : '';
        avail.weeklySchedule[day].hours = closeVal ? `${newValue} - ${closeVal}` : newValue;
      } else if (field === 'hoursClose') {
        const startField = document.querySelector(`.week-hours[data-id="${id}"][data-day="${day}"]`);
        const startVal = startField ? startField.innerText.trim() : '';
        avail.weeklySchedule[day].hours = startVal ? `${startVal} - ${newValue}` : newValue;
      }
      const putRes = await fetch(`/api/teachers-availability/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(avail)
      });
      if (!putRes.ok) throw new Error('Update failed');
      // Register an undo action for the hour change
      const undoAction = createEditAction(
        oldData,
        JSON.parse(JSON.stringify(avail)),
        'teacher-availability',
        '/api/teachers-availability',
        async () => { await loadAvailabilities(); }
      );
      pushAction(undoAction);
      await loadAvailabilities();
    } catch (err) {
      console.error(err);
      alert('Could not save');
      cell.innerHTML = escapeHtml(current);
      attachWeeklyInlineEditing();
    }
  };

  input.addEventListener('blur', save);
  input.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
      ev.preventDefault();
      input.blur();
    } else if (ev.key === 'Escape') {
      cell.innerHTML = escapeHtml(current);
      attachWeeklyInlineEditing();
    }
  });
}

async function weeklyStatusEditHandler(e) {
  const cell = e.currentTarget;
  if (cell.querySelector('select')) return;

  const id = cell.getAttribute('data-id');
  const day = cell.getAttribute('data-day');
  const currentBadge = cell.querySelector('.badge');
  const currentStatus = currentBadge ? currentBadge.innerText.trim().toLowerCase() : 'available';

  const select = document.createElement('select');
  select.className = 'form-select form-select-sm';
  select.style.position = 'relative';
  select.style.zIndex = '10000';
  ['available', 'busy', 'unavailable'].forEach(opt => {
    const option = document.createElement('option');
    option.value = opt;
    option.textContent = opt.charAt(0).toUpperCase() + opt.slice(1);
    if (opt === currentStatus) option.selected = true;
    select.appendChild(option);
  });
  cell.innerHTML = '';
  cell.appendChild(select);
  select.focus();

  const save = async () => {
    const newStatus = select.value;
    if (newStatus === currentStatus) {
      restoreStatusCell(cell, currentStatus);
      return;
    }
    try {
      const getRes = await fetch(`/api/teachers-availability/${id}`);
      if (!getRes.ok) throw new Error('Fetch failed');
      const avail = await getRes.json();
      const oldData = JSON.parse(JSON.stringify(avail));
      if (!avail.weeklySchedule[day]) avail.weeklySchedule[day] = { hours: '', status: 'available' };
      avail.weeklySchedule[day].status = newStatus;
      const putRes = await fetch(`/api/teachers-availability/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(avail)
      });
      if (!putRes.ok) throw new Error('Update failed');
      // Register an undo action for the status change
      const undoAction = createEditAction(
        oldData,
        JSON.parse(JSON.stringify(avail)),
        'teacher-availability',
        '/api/teachers-availability',
        async () => { await loadAvailabilities(); }
      );
      pushAction(undoAction);
      await loadAvailabilities();
    } catch (err) {
      console.error(err);
      alert('Could not update status');
      restoreStatusCell(cell, currentStatus);
    }
  };

  select.addEventListener('blur', save);
  select.addEventListener('change', save);
  select.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') {
      restoreStatusCell(cell, currentStatus);
    }
  });
}

function restoreStatusCell(cell, status) {
  const badgeClass = status === 'available' ? 'success' : (status === 'busy' ? 'danger' : 'secondary');
  cell.innerHTML = `<span class="badge bg-${badgeClass}">${escapeHtml(status)}</span>`;
  attachWeeklyInlineEditing();
}

// ---------- MAIN FIELDS INLINE EDITING (subject, gradeFrom, gradeTo, note) ----------
function attachMainInlineEditing() {
  document.querySelectorAll('.availabilitiesTable .editable').forEach(cell => {
    cell.style.cursor = 'pointer';
    cell.removeEventListener('click', mainEditHandler);
    cell.addEventListener('click', mainEditHandler);
  });
}

async function mainEditHandler(e) {
  const cell = e.currentTarget;
  if (cell.querySelector('input, select')) return;

  const id = cell.getAttribute('data-id');
  const field = cell.getAttribute('data-field');
  let oldValue: any = '';
  if (field === 'subject') {
    const badges = cell.querySelectorAll('.badge');
    oldValue = Array.from<any>(badges).map(b => b.innerText.trim());
  } else if (field === 'note') {
    const small = cell.querySelector('small');
    oldValue = small ? small.innerText.trim() : cell.innerText.trim();
  } else {
    oldValue = cell.innerText.trim();
  }

  // Fetch current full object to get teacherId etc. (needed for subject updates later)
  const getRes = await fetch(`/api/teachers-availability/${id}`);
  if (!getRes.ok) {
    alert('Cannot edit right now');
    return;
  }
  const currentAvail = await getRes.json();

  let input;
  if (field === 'subject') {
    // Fetch subjects list
    const subjRes = await fetch('/api/subjects');
    const subjects = await subjRes.ok ? await subjRes.json() : [];
    input = document.createElement('select');
    input.multiple = true;
    input.className = 'form-select form-select-sm';
    input.style.position = 'relative';
    input.style.zIndex = '10000';
    subjects.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.name;
      opt.textContent = s.name;
      if (Array.isArray(oldValue) && oldValue.includes(s.name)) opt.selected = true;
      else if (!Array.isArray(oldValue) && oldValue === s.name) opt.selected = true;
      input.appendChild(opt);
    });
  } else if (field === 'gradeFrom' || field === 'gradeTo') {
    const gradesRes = await fetch('/api/grades');
    const grades = await gradesRes.ok ? await gradesRes.json() : [];
    input = document.createElement('select');
    input.className = 'form-select form-select-sm';
    input.style.position = 'relative';
    input.style.zIndex = '10000';
    input.innerHTML = '<option value="">Select</option>';
    grades.forEach(g => {
      const opt = document.createElement('option');
      opt.value = g.name;
      opt.textContent = g.name;
      if (g.name === oldValue) opt.selected = true;
      input.appendChild(opt);
    });
  } else if (field === 'note') {
    input = document.createElement('input');
    input.type = 'text';
    input.value = oldValue;
    input.className = 'form-control form-control-sm';
  } else {
    input = document.createElement('input');
    input.type = 'text';
    input.value = oldValue;
    input.className = 'form-control form-control-sm';
  }

  cell.innerHTML = '';
  cell.appendChild(input);
  input.focus();

  const save = async () => {
    let newValue;
    if (field === 'subject' && input.multiple) {
      newValue = Array.from<any>(input.selectedOptions).map(opt => opt.value);
    } else {
      newValue = input.value;
    }
    if (JSON.stringify(newValue) === JSON.stringify(oldValue)) {
      restoreMainCell(cell, field, oldValue);
      return;
    }
    try {
      const oldData = JSON.parse(JSON.stringify(currentAvail));
      currentAvail[field] = newValue;
      const putRes = await fetch(`/api/teachers-availability/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentAvail)
      });
      if (!putRes.ok) throw new Error('Update failed');
      // Register an undo action for the field change
      const undoAction = createEditAction(
        oldData,
        JSON.parse(JSON.stringify(currentAvail)),
        'teacher-availability',
        '/api/teachers-availability',
        async () => { await loadAvailabilities(); }
      );
      pushAction(undoAction);
      await loadAvailabilities();
    } catch (err) {
      console.error(err);
      alert('Could not save change');
      restoreMainCell(cell, field, oldValue);
    }
  };

  input.addEventListener('blur', save);
  input.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
      ev.preventDefault();
      input.blur();
    } else if (ev.key === 'Escape') {
      restoreMainCell(cell, field, oldValue);
    }
  });
}

function restoreMainCell(cell, field, oldValue) {
  if (field === 'subject') {
    const subjectsArray = Array.isArray(oldValue) ? oldValue : [oldValue];
    cell.innerHTML = subjectsArray.map(s => `<span class='badge bg-info text-dark me-1'>${escapeHtml(s)}</span>`).join('');
  } else if (field === 'note') {
    cell.innerHTML = `<small class="text-muted">${escapeHtml(oldValue)}</small>`;
  } else {
    cell.innerHTML = escapeHtml(oldValue);
  }
  attachMainInlineEditing();
}

// ---------- DELETE HANDLER ----------
async function deleteHandler(e) {
  const btn = e.currentTarget;
  const id = btn.getAttribute('data-id');
  const day = btn.getAttribute('data-day');
  if (!confirm('Are you sure you want to delete this day?')) return;
  try {
    // Fetch the record
    const getRes = await fetch(`/api/teachers-availability/${id}`);
    if (!getRes.ok) throw new Error('Fetch failed');
    const avail = await getRes.json();
    
    // Store old data for undo
    const oldData = JSON.parse(JSON.stringify(avail));
    
    if (avail.weeklySchedule && Object.keys(avail.weeklySchedule).length > 1) {
      // Remove only the selected day
      delete avail.weeklySchedule[day];
      const putRes = await fetch(`/api/teachers-availability/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(avail)
      });
      if (!putRes.ok) throw new Error('Update failed');
      
      // Create undo action for day deletion
      const undoAction = createEditAction(
        oldData,
        avail,
        'teacher-availability',
        `/api/teachers-availability/${id}`,
        async () => {
          await loadAvailabilities();
        }
      );
      pushAction(undoAction);
      
      await loadAvailabilities();
    } else {
      // Only one day, delete the whole record
      const delRes = await fetch(`/api/teachers-availability/${id}`, { method: 'DELETE' });
      if (!delRes.ok) throw new Error(`HTTP ${delRes.status}`);
      
      // Create undo action for full record deletion
      const undoAction = createDeleteAction(
        oldData,
        'teacher-availability',
        '/api/teachers-availability',
        async () => {
          await loadAvailabilities();
        }
      );
      pushAction(undoAction);
      
      await loadAvailabilities();
    }
  } catch (err) {
    console.error('Delete error:', err);
    alert('Failed to delete.');
  }
}

// ---------- FORM SUBMIT (CREATE NEW) ----------
async function handleFormSubmit(e) {
  e.preventDefault();

  const teacherSelect = document.getElementById('teacherSelect');
  const teacherId = teacherSelect.value;
  const teacherName = teacherSelect.selectedOptions[0]?.textContent || '';
  const subjectSelect = document.getElementById('subjectSelect');
    let selectedSubjects = Array.from<any>(subjectSelect.selectedOptions).map(opt => opt.value);
    if (!Array.isArray(selectedSubjects)) selectedSubjects = [selectedSubjects];
    if (selectedSubjects.length === 1 && typeof selectedSubjects[0] === 'string') selectedSubjects = [selectedSubjects[0]];
  const gradeFrom = document.getElementById('gradeFromSelect').value;
  const gradeTo = document.getElementById('gradeToSelect').value;
  const note = document.getElementById('noteInput').value;

  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const weeklySchedule: { [key: string]: any } = {};
  for (const day of days) {
    const checkbox = document.querySelector(`input[name='day_${day}']`);
    if (checkbox && checkbox.checked) {
      const hoursOpen = document.querySelector(`input[name='hours_${day}']`)?.value || '';
      const hoursClose = document.querySelector(`input[name='hours_${day}_close']`)?.value || '';
      const hours = hoursClose ? `${hoursOpen} - ${hoursClose}` : hoursOpen;
      const status = document.querySelector(`select[name='status_${day}']`)?.value || 'available';
      weeklySchedule[day] = { hours, status };
    }
  }

  const payload = {
    teacherId,
    teacherName,
    subject: selectedSubjects,
    gradeFrom,
    gradeTo,
    weeklySchedule,
    note
  };

  try {
    const res = await fetch('/api/teachers-availability', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    // Register an undo action so the new availability can be removed
    const created = await res.json().catch(() => null);
    if (created && created.id) {
      const undoAction = createAddAction(
        created,
        'teacher-availability',
        '/api/teachers-availability',
        async () => { await loadAvailabilities(); }
      );
      pushAction(undoAction);
    }
    e.target.reset();
    // Reset Choices selections
    if (teacherChoices) teacherChoices.setChoiceByValue('');
    if (subjectChoices) subjectChoices.removeActiveItems();
    if (gradeFromChoices) gradeFromChoices.setChoiceByValue('');
    if (gradeToChoices) gradeToChoices.setChoiceByValue('');
    await loadAvailabilities();
  } catch (err) {
    console.error('Create error:', err);
    alert('Failed to save availability.');
  }
}