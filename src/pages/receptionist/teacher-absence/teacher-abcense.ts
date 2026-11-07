// Teacher Absence Page Logic
// Loads teachers, subjects, and logs absences to teacher-abcense.logs

const rece_TEACHERS_PATH = '/database/teachers.json';
const rece_SUBJECTS_PATH = '/database/subjects.json';
const rece_ABSENCE_LOGS_PATH = '/api/teacher-absence-logs';

let rec_teac_teachers = [];
let rec_teac_subjects = [];
let rec_teac_absences = [];

const rece_DEFAULT_TIME_SLOTS = [
  '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '00:00', '01:00', '02:00'
];
let rece_timeWindowStart = null;
let rece_timeWindowEnd = null;
let rece_editingTimeSlot = null;
let rece_customStartMinutes = null; // e.g., 13:45

function rece_fetchJSON(path) {
  return fetch(path).then(r => r.json()).catch(() => []);
}

function rece_populateDropdown(selectId, options, labelKey, valueKey) {
  const select = document.getElementById(selectId);
  if (!select) return;
  // Save current value to preserve selection
  const prevValue = select.value;
  select.innerHTML = '<option value="">Select...</option>';
  options.forEach(opt => {
    const option = document.createElement('option');
    option.value = opt[valueKey];
    if (selectId === 'teacherSelectorDropdown') {
      option.textContent = (opt.firstName && opt.lastName) ? `${opt.firstName} ${opt.lastName}` : (opt.name || opt.firstName || '');
    } else {
      option.textContent = opt[labelKey];
    }
    select.appendChild(option);
  });
  // Restore previous value if possible
  if (prevValue) select.value = prevValue;
  // Re-initialize Choices.js for searchable dropdowns
  if (window.Choices) {
    if (select.choicesInstance) {
      select.choicesInstance.destroy();
    }
    select.choicesInstance = new Choices(select, { searchEnabled: true, itemSelectText: '', shouldSort: false });
  }
}

function rece_renderTimeSlotsChips() {
  const container = document.getElementById('timeSlotsContainer');
  if (!container) return;
  container.innerHTML = '';
  let startIdx = rece_timeWindowStart ? rece_DEFAULT_TIME_SLOTS.indexOf(rece_timeWindowStart) : -1;
  let endIdx = rece_timeWindowEnd ? rece_DEFAULT_TIME_SLOTS.indexOf(rece_timeWindowEnd) : -1;
  if ((rece_timeWindowStart && startIdx === -1) || (rece_timeWindowEnd && endIdx === -1)) {
    rece_timeWindowStart = null;
    rece_timeWindowEnd = null;
    rece_customStartMinutes = null;
    startIdx = -1;
    endIdx = -1;
  }
  if (startIdx > endIdx && startIdx !== -1 && endIdx !== -1) [startIdx, endIdx] = [endIdx, startIdx];
  rece_DEFAULT_TIME_SLOTS.forEach((slot, idx) => {
    let isSelected = false;
    if (rece_timeWindowStart && rece_timeWindowEnd && startIdx !== -1 && endIdx !== -1) {
      isSelected = idx >= startIdx && idx <= endIdx;
    } else if (rece_timeWindowStart && idx === startIdx) {
      isSelected = true;
    }
    const isEditing = rece_editingTimeSlot === slot;
    const chipDiv = document.createElement('span');
    chipDiv.className = `time-chip-editable${isSelected ? ' selected' : ''}`;
    chipDiv.style.marginRight = '8px';
    chipDiv.style.marginBottom = '8px';
    if (isEditing) {
      // Inline input for editing
      const input = document.createElement('input');
      input.type = 'text';
      input.value = slot;
      input.className = 'time-edit-input';
      input.style.width = '80px';
      input.style.textAlign = 'center';
      input.style.fontWeight = 'bold';
      input.style.border = '2px solid #2563eb';
      input.style.borderRadius = '16px';
      input.style.background = '#e0e7ff';
      input.style.outline = 'none';
      input.style.fontSize = '1.1em';
      input.style.padding = '2px 8px';
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') finishEdit();
        else if (e.key === 'Escape') { rece_editingTimeSlot = null; rece_renderTimeSlotsChips(); }
      });
      input.addEventListener('blur', finishEdit);
      chipDiv.appendChild(input);
      setTimeout(() => input.focus(), 0);
      function finishEdit() {
        const newVal = input.value.trim();
        // ...existing code...
      }
    } else {
      chipDiv.textContent = slot;
      chipDiv.onclick = () => {
        if (!rece_timeWindowStart) rece_timeWindowStart = slot;
        else if (!rece_timeWindowEnd) rece_timeWindowEnd = slot;
        else {
          rece_timeWindowStart = slot;
          rece_timeWindowEnd = null;
        }
        rece_editingTimeSlot = slot;
        rece_renderTimeSlotsChips();
      };
    }
    container.appendChild(chipDiv);
  });
}

function rece_renderAbsenceLogs() {
  const tableDiv = document.getElementById('absenceLogsTable');
  if (!tableDiv) return;
  if (!rec_teac_absences.length) {
    tableDiv.innerHTML = '<div class="text-muted">No absences logged yet.</div>';
    return;
  }
  // table-responsive keeps the wide 6-column table inside a scrollable box on
  // small phones instead of forcing the page wider than the viewport (which
  // clipped the left edge of the page on iOS).
  let html = '<div class="table-responsive"><table class="table table-bordered table-sm mb-0"><thead><tr>' +
    '<th>Teacher</th><th>Subject</th><th>Date</th><th>Time</th><th>Reason</th><th>Action</th></tr></thead><tbody>';
  rec_teac_absences.forEach(a => {
    const teacher = rec_teac_teachers.find(t => t.id == a.teacherId);
    html += `<tr data-id="${a.id}"><td>${teacher ? (teacher.firstName + ' ' + teacher.lastName) : a.teacherId}</td><td>${a.subject}</td><td>${a.date}</td><td>${a.timeWindow}</td><td>${a.reason || ''}</td><td class="table-actions"><div class="actions-stack"><button class="btn btn-sm action-btn action-delete delete-log-btn" title="Delete this absence log"><i class="bi bi-trash me-1"></i>Delete</button></div></td></tr>`;
  });
  html += '</tbody></table></div>';
  tableDiv.innerHTML = html;
  // Add delete handlers
  tableDiv.querySelectorAll('.delete-log-btn').forEach(btn => {
    btn.addEventListener('click', async function() {
      const row = btn.closest('tr');
      const id = row.getAttribute('data-id');
      // Capture the log (and its position) first so it can be restored by the Undo button
      const idx = rec_teac_absences.findIndex(a => String(a.id) === String(id));
      const log = idx !== -1 ? rec_teac_absences[idx] : null;
      await fetch(rece_ABSENCE_LOGS_PATH + '/' + id, { method: 'DELETE' });
      if (log && window.pushAction && window.createDeleteAction) {
        // Undo re-adds the log via the /add endpoint, back at its original spot
        window.pushAction(window.createDeleteAction({ ...log, _restoreIndex: idx }, 'teacher-absence', rece_ABSENCE_LOGS_PATH + '/add', rece_loadAll));
      }
      rece_loadAll();
    });
  });
}

function rece_loadAll() {
  Promise.all([
    rece_fetchJSON(rece_TEACHERS_PATH),
    rece_fetchJSON(rece_SUBJECTS_PATH),
    rece_fetchJSON(rece_ABSENCE_LOGS_PATH)
  ]).then(([t, s, a]) => {
    rec_teac_teachers = t;
    rec_teac_subjects = s;
    rec_teac_absences = Array.isArray(a) ? a : [];
    rece_populateDropdown('teacherSelectorDropdown', rec_teac_teachers, 'name', 'id');
    rece_populateDropdown('subjectSelectorDropdown', rec_teac_subjects, 'name', 'name');
    rece_renderTimeSlotsChips();
    rece_renderAbsenceLogs();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  rece_loadAll();
  document.getElementById('teacherAbsenceForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const teacherId = document.getElementById('teacherSelectorDropdown').value;
    const subject = document.getElementById('subjectSelectorDropdown').value;
    const date = document.getElementById('absenceDate').value;
    const reason = document.getElementById('reasonInput').value;
    let timeWindow = '';
    if (rece_timeWindowStart && rece_timeWindowEnd) {
      const startIdx = rece_DEFAULT_TIME_SLOTS.indexOf(rece_timeWindowStart);
      const endIdx = rece_DEFAULT_TIME_SLOTS.indexOf(rece_timeWindowEnd);
      if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
        timeWindow = rece_DEFAULT_TIME_SLOTS.slice(startIdx, endIdx + 1).join(' - ');
      }
    } else if (rece_timeWindowStart) {
      timeWindow = rece_timeWindowStart;
    }
    if (!teacherId || !subject || !date || !timeWindow) {
      alert('Please fill all required fields and select a time window.');
      return;
    }
    const newAbsence = {
      id: Date.now(),
      teacherId,
      subject,
      date,
      timeWindow,
      reason
    };
    // Save to backend API (append single log)
    fetch(rece_ABSENCE_LOGS_PATH + '/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAbsence)
    }).then(() => {
      // Register an undo action so the added log can be rolled back
      if (window.pushAction && window.createAddAction) {
        window.pushAction(window.createAddAction(newAbsence, 'teacher-absence', '/api/teacher-absence-logs', rece_loadAll));
      }
      // Reload all logs after save
      rece_loadAll();
      this.reset();
      rece_timeWindowStart = null;
      rece_timeWindowEnd = null;
      rece_renderTimeSlotsChips();
    });
  });
});
