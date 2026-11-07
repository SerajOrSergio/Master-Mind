// Teacher Absence Page Logic
// Loads teachers, subjects, and logs absences to teacher-abcense.logs

const admi_TEACHERS_PATH = '/database/teachers.json';
const admi_SUBJECTS_PATH = '/database/subjects.json';
const admi_ABSENCE_LOGS_PATH = '/api/teacher-absence-logs';

let adm_teac_teachers = [];
let adm_teac_subjects = [];
let adm_teac_absences = [];

const admi_DEFAULT_TIME_SLOTS = [
  '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '00:00', '01:00', '02:00'
];
let admi_timeWindowStart = null;
let admi_timeWindowEnd = null;
let admi_editingTimeSlot = null;
let admi_customStartMinutes = null; // e.g., 13:45

function admi_fetchJSON(path) {
  return fetch(path).then(r => r.json()).catch(() => []);
}

function admi_populateDropdown(selectId, options, labelKey, valueKey) {
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

function admi_renderTimeSlotsChips() {
  const container = document.getElementById('timeSlotsContainer');
  if (!container) return;
  container.innerHTML = '';
  let startIdx = admi_timeWindowStart ? admi_DEFAULT_TIME_SLOTS.indexOf(admi_timeWindowStart) : -1;
  let endIdx = admi_timeWindowEnd ? admi_DEFAULT_TIME_SLOTS.indexOf(admi_timeWindowEnd) : -1;
  if ((admi_timeWindowStart && startIdx === -1) || (admi_timeWindowEnd && endIdx === -1)) {
    admi_timeWindowStart = null;
    admi_timeWindowEnd = null;
    admi_customStartMinutes = null;
    startIdx = -1;
    endIdx = -1;
  }
  if (startIdx > endIdx && startIdx !== -1 && endIdx !== -1) [startIdx, endIdx] = [endIdx, startIdx];
  admi_DEFAULT_TIME_SLOTS.forEach((slot, idx) => {
    let isSelected = false;
    if (admi_timeWindowStart && admi_timeWindowEnd && startIdx !== -1 && endIdx !== -1) {
      isSelected = idx >= startIdx && idx <= endIdx;
    } else if (admi_timeWindowStart && idx === startIdx) {
      isSelected = true;
    }
    const isEditing = admi_editingTimeSlot === slot;
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
        else if (e.key === 'Escape') { admi_editingTimeSlot = null; admi_renderTimeSlotsChips(); }
      });
      input.addEventListener('blur', finishEdit);
      chipDiv.appendChild(input);
      setTimeout(() => input.focus(), 0);
      function finishEdit() {
        const newVal = input.value.trim();
        if (newVal && /^\d{2}:\d{2}$/.test(newVal)) {
          const idx = admi_DEFAULT_TIME_SLOTS.indexOf(slot);
          if (idx !== -1 && (!admi_DEFAULT_TIME_SLOTS.includes(newVal) || slot === newVal)) {
            admi_DEFAULT_TIME_SLOTS[idx] = newVal;
          } else if (idx !== -1 && admi_DEFAULT_TIME_SLOTS.includes(newVal) && slot !== newVal) {
            admi_editingTimeSlot = null;
            admi_renderTimeSlotsChips();
            return;
          }
          if (admi_timeWindowStart === slot) admi_timeWindowStart = newVal;
          if (admi_timeWindowEnd === slot) admi_timeWindowEnd = newVal;
          admi_editingTimeSlot = null;
          admi_renderTimeSlotsChips();
        } else {
          input.style.border = '2px solid #ef4444';
        }
      }
    } else {
      const textSpan = document.createElement('span');
      textSpan.textContent = slot;
      const editIcon = document.createElement('i');
      editIcon.className = 'bi bi-pencil-square edit-time-icon';
      editIcon.style.marginLeft = '6px';
      chipDiv.appendChild(textSpan);
      chipDiv.appendChild(editIcon);
      chipDiv.addEventListener('click', (e) => {
        if (e.target === editIcon) return;
        let startIdx = admi_timeWindowStart ? admi_DEFAULT_TIME_SLOTS.indexOf(admi_timeWindowStart) : -1;
        let endIdx = admi_timeWindowEnd ? admi_DEFAULT_TIME_SLOTS.indexOf(admi_timeWindowEnd) : -1;
        let clickedIdx = idx;
        let inSelectedRange = false;
        if (admi_timeWindowStart && admi_timeWindowEnd && startIdx !== -1 && endIdx !== -1 && clickedIdx >= startIdx && clickedIdx <= endIdx) {
          inSelectedRange = true;
        } else if (admi_timeWindowStart && !admi_timeWindowEnd && clickedIdx === startIdx) {
          inSelectedRange = true;
        }
        if (inSelectedRange) {
          admi_timeWindowStart = null;
          admi_timeWindowEnd = null;
          admi_customStartMinutes = null;
          admi_renderTimeSlotsChips();
          return;
        }
        if (!admi_timeWindowStart || (admi_timeWindowStart && admi_timeWindowEnd)) {
          admi_timeWindowStart = slot;
          admi_timeWindowEnd = null;
          admi_customStartMinutes = null;
          admi_renderTimeSlotsChips();
          showMinuteInput(slot, chipDiv);
        } else if (admi_timeWindowStart && !admi_timeWindowEnd) {
          const startIdx = admi_DEFAULT_TIME_SLOTS.indexOf(admi_timeWindowStart);
          const endIdx = idx;
          if (endIdx > startIdx) {
            admi_timeWindowEnd = slot;
            admi_renderTimeSlotsChips();
          }
        }
      });
      editIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        admi_editingTimeSlot = slot;
        admi_renderTimeSlotsChips();
      });
    }
    container.appendChild(chipDiv);
  });
  // Helper to show custom minute input
  function showMinuteInput(slot, chipDiv) {
    if (chipDiv.querySelector('.minute-input')) return;
    const minInput = document.createElement('input');
    minInput.type = 'text';
    minInput.placeholder = 'e.g. 13:45';
    minInput.className = 'minute-input';
    minInput.style.width = '70px';
    minInput.style.marginLeft = '8px';
    minInput.style.fontSize = '0.9em';
    minInput.style.border = '1px solid #2563eb';
    minInput.style.borderRadius = '8px';
    minInput.style.padding = '2px 6px';
    minInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = minInput.value.trim();
        if (/^\d{2}:\d{2}$/.test(val)) {
          admi_customStartMinutes = val;
          admi_renderTimeSlotsChips();
        } else {
          minInput.style.border = '1.5px solid #ef4444';
        }
      }
    });
    chipDiv.appendChild(minInput);
    setTimeout(() => minInput.focus(), 0);
  }
}

function admi_renderAbsenceLogs() {
  const tableDiv = document.getElementById('absenceLogsTable');
  if (!tableDiv) return;
  if (!adm_teac_absences.length) {
    tableDiv.innerHTML = '<div class="text-muted">No absences logged yet.</div>';
    return;
  }
  // table-responsive keeps the wide 6-column table inside a scrollable box on
  // small phones instead of forcing the page wider than the viewport (which
  // clipped the left edge of the page on iOS).
  let html = '<div class="table-responsive"><table class="table table-bordered table-sm mb-0"><thead><tr>' +
    '<th>Teacher</th><th>Subject</th><th>Date</th><th>Time</th><th>Reason</th><th>Action</th></tr></thead><tbody>';
  adm_teac_absences.forEach(a => {
    const teacher = adm_teac_teachers.find(t => t.id == a.teacherId);
    html += `<tr data-id="${a.id}"><td>${teacher ? (teacher.firstName + ' ' + teacher.lastName) : a.teacherId}</td><td>${a.subject}</td><td>${a.date}</td><td>${a.timeWindow}</td><td>${a.reason || ''}</td><td><button class="btn btn-danger btn-sm delete-log-btn">Delete</button></td></tr>`;
  });
  html += '</tbody></table></div>';
  tableDiv.innerHTML = html;
  // Add delete handlers
  tableDiv.querySelectorAll('.delete-log-btn').forEach(btn => {
    btn.addEventListener('click', async function() {
      const row = btn.closest('tr');
      const id = row.getAttribute('data-id');
      // Capture the log (and its position) first so it can be restored by the Undo button
      const idx = adm_teac_absences.findIndex(a => String(a.id) === String(id));
      const log = idx !== -1 ? adm_teac_absences[idx] : null;
      await fetch(admi_ABSENCE_LOGS_PATH + '/' + id, { method: 'DELETE' });
      if (log && window.pushAction && window.createDeleteAction) {
        // Undo re-adds the log via the /add endpoint, back at its original spot
        window.pushAction(window.createDeleteAction({ ...log, _restoreIndex: idx }, 'teacher-absence', admi_ABSENCE_LOGS_PATH + '/add', admi_loadAll));
      }
      admi_loadAll();
    });
  });
}

function admi_loadAll() {
  Promise.all([
    admi_fetchJSON(admi_TEACHERS_PATH),
    admi_fetchJSON(admi_SUBJECTS_PATH),
    admi_fetchJSON(admi_ABSENCE_LOGS_PATH)
  ]).then(([t, s, a]) => {
    adm_teac_teachers = t;
    adm_teac_subjects = s;
    adm_teac_absences = Array.isArray(a) ? a : [];
    admi_populateDropdown('teacherSelectorDropdown', adm_teac_teachers, 'name', 'id');
    admi_populateDropdown('subjectSelectorDropdown', adm_teac_subjects, 'name', 'name');
    admi_renderTimeSlotsChips();
    admi_renderAbsenceLogs();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  admi_loadAll();
  document.getElementById('teacherAbsenceForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const teacherId = document.getElementById('teacherSelectorDropdown').value;
    const subject = document.getElementById('subjectSelectorDropdown').value;
    const date = document.getElementById('absenceDate').value;
    const reason = document.getElementById('reasonInput').value;
    let timeWindow = '';
    if (admi_timeWindowStart && admi_timeWindowEnd) {
      const startIdx = admi_DEFAULT_TIME_SLOTS.indexOf(admi_timeWindowStart);
      const endIdx = admi_DEFAULT_TIME_SLOTS.indexOf(admi_timeWindowEnd);
      if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
        timeWindow = admi_DEFAULT_TIME_SLOTS.slice(startIdx, endIdx + 1).join(' - ');
      }
    } else if (admi_timeWindowStart) {
      timeWindow = admi_timeWindowStart;
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
    fetch(admi_ABSENCE_LOGS_PATH + '/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAbsence)
    }).then(() => {
      // Register an undo action so the added log can be rolled back
      if (window.pushAction && window.createAddAction) {
        window.pushAction(window.createAddAction(newAbsence, 'teacher-absence', '/api/teacher-absence-logs', admi_loadAll));
      }
      // Reload all logs after save
      admi_loadAll();
      this.reset();
      admi_timeWindowStart = null;
      admi_timeWindowEnd = null;
      admi_renderTimeSlotsChips();
    });
  });
});
