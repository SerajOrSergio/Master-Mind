// Format a duration (in minutes) as full words, e.g. 90 -> "1 hour and 30 minutes"
function rec_teac_formatDuration(mins) {
  const hours = Math.floor(mins / 60);
  const minutes = mins % 60;
  const parts = [];
  if (hours > 0) parts.push(hours + (hours === 1 ? ' hour' : ' hours'));
  if (minutes > 0) parts.push(minutes + (minutes === 1 ? ' minute' : ' minutes'));
  return parts.length ? parts.join(' and ') : '0 minutes';
}

document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.getElementById('attendanceTableBody');
  const searchInput = document.getElementById('searchInput');
  const filterType = document.getElementById('filterAttType');
  const filterValue = document.getElementById('filterAttValue');
  const applyBtn = document.getElementById('applyAttFilterBtn');
  const filterSummary = document.getElementById('attFilterSummary');
  const startMonthInput = document.getElementById('startMonthInput');
  const endMonthInput = document.getElementById('endMonthInput');

  let allAttendance = [];

  function fetchAttendance() {
    fetch('/api/teachers-attendance')
      .then(res => res.json())
      .then(data => {
        allAttendance = data;
        applyFilters();
      });
  }

  function renderTable(data) {
    tableBody.innerHTML = '';
    if (!data.length) {
      tableBody.innerHTML = '<tr><td colspan="6" class="text-center text-muted py-4">No attendance records found.</td></tr>';
      return;
    }
    data.forEach(row => {
      let durationStr = '';
      if (row.timeWindow) {
        const times = row.timeWindow.split(' - ').map(t => t.trim()).filter(Boolean);
        if (times.length >= 2) {
          const toMinutes = t => {
            const [h, m] = t.split(':');
            return parseInt(h, 10) * 60 + parseInt(m, 10);
          };
          const start = toMinutes(times[0]);
          const end = toMinutes(times[times.length - 1]);
          let mins = end - start;
          if (mins < 0) mins += 24 * 60;
          if (mins > 0) {
            durationStr = ` <span style="color:#1976d2">(<b>${rec_teac_formatDuration(mins)}</b>)</span>`;
          }
        }
      }

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${row.teacherName || ''}</td>
        <td>${row.subject || ''}</td>
        <td>${row.classroom || ''}</td>
        <td>${row.date || ''} <br><small>${row.timeWindow || ''}${durationStr}</small></td>
        <td>${row.type || ''}</td>
        <td class="table-actions">
          <div class="actions-stack">
            <button class="btn btn-sm action-btn action-delete" onclick="deleteAttendance('${row.id}')" title="Delete this attendance record">
              <i class="bi bi-trash me-1"></i>Delete
            </button>
          </div>
        </td>
      `;
      tableBody.appendChild(tr);
    });
  }

  function applyFilters() {
    const filtered = allAttendance.filter(row => {
      // Dropdown filter (teacher / subject / classroom / type / student)
      if (filterType.value && filterValue.value) {
        const selected = filterValue.value.trim().toLowerCase();
        const t = filterType.value;
        if (t === 'teacher' && !(row.teacherName && row.teacherName.trim().toLowerCase() === selected)) return false;
        if (t === 'subject' && !(row.subject && row.subject.trim().toLowerCase() === selected)) return false;
        if (t === 'classroom' && !(row.classroom && row.classroom.trim().toLowerCase() === selected)) return false;
        if (t === 'type' && !(row.type && row.type.trim().toLowerCase() === selected)) return false;
        if (t === 'student' && !(row.students && row.students.some(s => s.name && s.name.trim().toLowerCase() === selected))) return false;
      }
      // Month range filter (row.date is expected to be YYYY-MM-DD)
      const startMonth = startMonthInput.value;
      const endMonth = endMonthInput.value;
      if (startMonth || endMonth) {
        if (!row.date) return false;
        const d = new Date(row.date);
        if (isNaN(d)) return false;
        if (startMonth) {
          const [sy, sm] = startMonth.split('-').map(Number);
          if (d < new Date(sy, sm - 1, 1)) return false;
        }
        if (endMonth) {
          const [ey, em] = endMonth.split('-').map(Number);
          // End of month: last day of the month, end of day
          if (d > new Date(ey, em, 0, 23, 59, 59, 999)) return false;
        }
      }
      // Search by teacher, subject, classroom, date, type, or any student name
      const search = searchInput.value.trim().toLowerCase();
      if (search) {
        const hit =
          (row.teacherName && row.teacherName.toLowerCase().includes(search)) ||
          (row.subject && row.subject.toLowerCase().includes(search)) ||
          (row.classroom && row.classroom.toLowerCase().includes(search)) ||
          (row.date && row.date.toLowerCase().includes(search)) ||
          (row.type && row.type.toLowerCase().includes(search)) ||
          (row.students && row.students.some(s => s.name && s.name.toLowerCase().includes(search)));
        if (!hit) return false;
      }
      return true;
    });

    renderTable(filtered);

    const startMonth = startMonthInput.value;
    const endMonth = endMonthInput.value;
    const hasFilters = (filterType.value && filterValue.value) || startMonth || endMonth || searchInput.value.trim();
    let summary = '';
    if (hasFilters) {
      summary = `Showing ${filtered.length} of ${allAttendance.length} sessions`;
      if (startMonth) summary += ` | From: ${startMonth}`;
      if (endMonth) summary += ` | To: ${endMonth}`;
    }
    filterSummary.textContent = summary;
  }

  // Populate the value dropdown when a filter type is chosen
  filterType.addEventListener('change', () => {
    filterValue.innerHTML = '';
    filterValue.style.display = 'none';
    applyBtn.style.display = 'none';
    filterSummary.textContent = '';
    if (!filterType.value) {
      applyFilters();
      return;
    }
    let values = [];
    if (filterType.value === 'teacher') {
      values = [...new Set(allAttendance.map(r => r.teacherName).filter(Boolean))];
    } else if (filterType.value === 'subject') {
      values = [...new Set(allAttendance.map(r => r.subject).filter(Boolean))];
    } else if (filterType.value === 'classroom') {
      values = [...new Set(allAttendance.map(r => r.classroom).filter(Boolean))];
    } else if (filterType.value === 'type') {
      values = [...new Set(allAttendance.map(r => r.type).filter(Boolean))];
    } else if (filterType.value === 'student') {
      values = [...new Set(allAttendance.flatMap(r => (r.students || []).map(s => s.name)).filter(Boolean))];
    }
    filterValue.innerHTML = '<option value="">Select...</option>' + values.map(v => `<option value="${v}">${v}</option>`).join('');
    filterValue.style.display = '';
    applyBtn.style.display = '';
  });

  // Keep the Apply button visible while a value is selected
  filterValue.addEventListener('change', () => {
    if (!filterValue.value) applyBtn.style.display = '';
  });

  // Only apply the dropdown/month filter when Apply is clicked (like the Paid page)
  applyBtn.addEventListener('click', (e) => {
    e.preventDefault();
    applyFilters();
  });

  searchInput.addEventListener('input', applyFilters);

  window.deleteAttendance = async function(id) {
    // Fetch the record first so it can be restored by the Undo button
    let record = null;
    let recordIndex = -1;
    try {
      const all = await (await fetch('/api/teachers-attendance')).json();
      recordIndex = all.findIndex(r => String(r.id) === String(id));
      record = recordIndex !== -1 ? all[recordIndex] : null;
    } catch (e) { /* ignore */ }
    const res = await fetch(`/api/teachers-attendance/${id}`, { method: 'DELETE' });
    if (res.ok) {
      if (record && window.pushAction && window.createDeleteAction) {
        // _restoreIndex puts the record back at its original position
        window.pushAction(window.createDeleteAction({ ...record, _restoreIndex: recordIndex }, 'teachers-attendance', '/api/teachers-attendance', fetchAttendance));
      }
      fetchAttendance();
    }
  };

  fetchAttendance();
});