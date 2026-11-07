// student-absence-logs.js - Teacher Portal Student Absence Logs
// Supports the same filter card as the Paid page: live search, filter by
// teacher/subject/classroom/student with Apply, and a month range.

document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.getElementById('studentAbsenceLogsTableBody');
  const searchInput = document.getElementById('searchInput');
  const filterType = document.getElementById('filterAbsenceType');
  const filterValue = document.getElementById('filterAbsenceValue');
  const applyBtn = document.getElementById('applyAbsenceFilterBtn');
  const filterSummary = document.getElementById('absenceFilterSummary');
  const startMonthInput = document.getElementById('startMonthInput');
  const endMonthInput = document.getElementById('endMonthInput');

  let allLogs = [];

  // Deleted-log cache so the Undo button can restore a log at its original
  // spot (id -> { record }). The true index in the absence-logs file is
  // resolved at delete time because the page list is teacher-filtered.
  const absenceLogRecords: { [key: string]: any } = {};

  function fetchAbsenceLogs() {
    const teacherId = localStorage.getItem('teacherId') || '';
    const teacherName = localStorage.getItem('teacherName') ||
      [localStorage.getItem('teacherFirstName'), localStorage.getItem('teacherLastName')]
        .filter(Boolean)
        .join(' ');

    const params = new URLSearchParams({ mine: '1' });
    if (teacherId) params.set('teacherId', teacherId);
    if (teacherName) params.set('teacherName', teacherName);

    fetch(`/api/student-absence-logs?${params.toString()}`) // Only fetch logs for the logged-in teacher
      .then(res => res.json())
      .then(data => {
        allLogs = data;
        applyFilters();
      });
  }

  // Filter raw rows using the current filter card state (same logic as paid.js)
  function getFilteredLogs() {
    const search = searchInput.value.trim().toLowerCase();
    const type = filterType.value;
    const value = filterValue.value;
    const startMonth = startMonthInput.value;
    const endMonth = endMonthInput.value;
    let rows = allLogs;

    if (type && value) {
      const selected = value.trim().toLowerCase();
      if (type === 'teacher') rows = rows.filter(r => r.teacher && r.teacher.trim().toLowerCase() === selected);
      else if (type === 'subject') rows = rows.filter(r => r.subject && r.subject.trim().toLowerCase() === selected);
      else if (type === 'classroom') rows = rows.filter(r => r.classroom && r.classroom.trim().toLowerCase() === selected);
      else if (type === 'student') rows = rows.filter(r => r.studentName && r.studentName.trim().toLowerCase() === selected);
    }

    if (startMonth || endMonth) {
      rows = rows.filter(r => {
        if (!r.date) return false;
        const d = new Date(r.date);
        if (isNaN(d)) return false;
        if (startMonth) {
          const [sy, sm] = startMonth.split('-').map(Number);
          if (d < new Date(sy, sm - 1, 1)) return false;
        }
        if (endMonth) {
          const [ey, em] = endMonth.split('-').map(Number);
          if (d > new Date(ey, em, 0, 23, 59, 59, 999)) return false;
        }
        return true;
      });
    }

    if (search) {
      rows = rows.filter(r =>
        (r.studentName && r.studentName.toLowerCase().includes(search)) ||
        (r.subject && r.subject.toLowerCase().includes(search)) ||
        (r.classroom && r.classroom.toLowerCase().includes(search)) ||
        (r.teacher && r.teacher.toLowerCase().includes(search)) ||
        (r.date && r.date.toLowerCase().includes(search))
      );
    }

    return rows;
  }

  function applyFilters() {
    const filtered = getFilteredLogs();
    const active = (filterType.value && filterValue.value) || startMonthInput.value || endMonthInput.value;
    filterSummary.textContent = active
      ? `${filtered.length} of ${allLogs.length} absence log${allLogs.length === 1 ? '' : 's'} matched`
      : '';
    renderTable(filtered);
  }

  // Group raw rows into sessions (subject, classroom, date, timeWindow)
  function groupSessions(rows) {
    const grouped: any = {};
    rows.forEach(row => {
      const key = [row.subject, row.classroom, row.date, row.timeWindow].join('|');
      if (!grouped[key]) grouped[key] = { ...row, students: [] };
      grouped[key].students.push({ name: row.studentName, id: row.id });
      absenceLogRecords[String(row.id)] = { record: { ...row } };
    });
    return Object.values(grouped as { [key: string]: any });
  }

  function renderTable(data) {
    tableBody.innerHTML = '';
    if (!data.length) {
      tableBody.innerHTML = '<div class="text-muted text-center py-4">No absence logs found.</div>';
      return;
    }

    groupSessions(data).forEach(session => {
      // Calculate duration from timeWindow (support multiple intervals)
      let durationText = '';
      if (session.timeWindow) {
        const times = session.timeWindow.split('-').map(t => t.trim()).filter(t => /^\d{2}:\d{2}$/.test(t));
        let totalMins = 0;
        for (let i = 0; i < times.length - 1; i++) {
          const [sh, sm] = times[i].split(':').map(Number);
          const [eh, em] = times[i + 1].split(':').map(Number);
          let startMins = sh * 60 + sm;
          let endMins = eh * 60 + em;
          let diff = endMins - startMins;
          if (diff < 0) diff += 24 * 60;
          totalMins += diff;
        }
        if (totalMins > 0) {
          const hours = Math.floor(totalMins / 60);
          const mins = totalMins % 60;
          durationText = `This session is ${hours > 0 ? hours + ' hour' + (hours > 1 ? 's' : '') : ''}${hours > 0 && mins > 0 ? ' and ' : ''}${mins > 0 ? mins + ' min' : ''}.`;
        }
      } else if (session.hours) {
        durationText = `This session is ${session.hours} hour${session.hours > 1 ? 's' : ''}.`;
      }

      const studentCount = session.students.length;
      const card = document.createElement('div');
      card.className = 'card absence-log-card mb-4';
      card.innerHTML = `
        <div class="card-body">
          <div class="absence-log-top">
            <div class="absence-log-title">
              <div class="absence-subject-icon"><i class="bi bi-book"></i></div>
              <div class="absence-subject-name">${session.subject || 'Session'}</div>
            </div>
            <span class="absence-count-pill"><i class="bi bi-person-x"></i> ${studentCount} absent</span>
          </div>
          <div class="absence-log-meta">
            <div class="absence-meta-item">
              <span class="absence-meta-label"><i class="bi bi-door-open"></i> Classroom</span>
              <span class="absence-meta-value">${session.classroom || '—'}</span>
            </div>
            <div class="absence-meta-item">
              <span class="absence-meta-label"><i class="bi bi-person-badge"></i> Teacher</span>
              <span class="absence-meta-value">${session.teacher || '—'}</span>
            </div>
            <div class="absence-meta-item">
              <span class="absence-meta-label"><i class="bi bi-calendar-event"></i> Date</span>
              <span class="absence-meta-value">${session.date || '—'}</span>
            </div>
            <div class="absence-meta-item">
              <span class="absence-meta-label"><i class="bi bi-clock"></i> Time</span>
              <span class="absence-meta-value">${session.timeWindow || '—'}</span>
            </div>
          </div>
          ${durationText ? `<div class="absence-duration"><i class="bi bi-hourglass-split me-1"></i>${durationText}</div>` : ''}
          <div class="absence-students-heading"><i class="bi bi-person-x me-1"></i>Absent Students (${studentCount})</div>
          <div class="absence-students-grid">
            ${session.students.map(s => `
              <div class="absence-student-row">
                <span class="absence-student-name"><i class="bi bi-person-x me-1"></i>${s.name}</span>
                <button class="btn btn-danger btn-sm absence-delete-btn" onclick="deleteAbsenceLog('${s.id}')"><i class="bi bi-trash me-1"></i>Delete</button>
              </div>
            `).join('')}
          </div>
        </div>
      `;
      tableBody.appendChild(card);
    });
  }

  window.deleteAbsenceLog = async function(id) {
    const entry = absenceLogRecords[String(id)];
    // Resolve the record's true position in the full absence-logs file so the
    // Undo button can put it back exactly where it was (the page list is
    // teacher-filtered, so its own index is not the file index).
    let restoreIndex = -1;
    try {
      const allLogs = await (await fetch('/api/student-absence-logs')).json();
      restoreIndex = allLogs.findIndex(r => String(r.id) === String(id));
    } catch (err) { /* keep -1 (falls back to append) */ }

    fetch(`/api/student-absence-logs/${id}`, { method: 'DELETE' })
      .then(async res => {
        if (res.ok) {
          // Register an undo action so the deleted log can be restored
          if (window.pushAction && window.createCustomAction && entry) {
            const undoAction = window.createCustomAction('delete', async () => {
              await fetch('/api/student-absence-logs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...entry.record, _restoreIndex: restoreIndex })
              });
              fetchAbsenceLogs();
            });
            window.pushAction(undoAction);
          }
          fetchAbsenceLogs();
        } else {
          alert('Failed to delete absence log.');
        }
      });
  };

  // ---- Filter card wiring (same pattern as the Paid page) ----
  searchInput.addEventListener('input', applyFilters);
  searchInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') applyFilters(); });

  filterType.addEventListener('change', () => {
    filterValue.innerHTML = '';
    filterValue.style.display = 'none';
    applyBtn.style.display = 'none';
    if (!filterType.value) {
      applyFilters();
      return;
    }
    // Build filter value options from the current sessions
    const sessions = groupSessions(allLogs);
    let values = [];
    if (filterType.value === 'teacher') values = [...new Set(sessions.map(s => s.teacher).filter(Boolean))];
    else if (filterType.value === 'subject') values = [...new Set(sessions.map(s => s.subject).filter(Boolean))];
    else if (filterType.value === 'classroom') values = [...new Set(sessions.map(s => s.classroom).filter(Boolean))];
    else if (filterType.value === 'student') values = [...new Set(allLogs.map(r => r.studentName).filter(Boolean))];
    filterValue.innerHTML = '<option value="">Select...</option>' + values.map(v => `<option value="${v}">${v}</option>`).join('');
    filterValue.style.display = '';
    applyBtn.style.display = '';
  });

  applyBtn.addEventListener('click', (e) => {
    e.preventDefault();
    applyFilters();
  });

  filterValue.addEventListener('change', () => {
    if (!filterValue.value) applyBtn.style.display = '';
  });

  startMonthInput.addEventListener('change', applyFilters);
  endMonthInput.addEventListener('change', applyFilters);

  fetchAbsenceLogs();
});
