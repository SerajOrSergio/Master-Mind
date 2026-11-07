// Admin Student Absence Logs - Card Design (like Teacher/Receptionist Portal)
// Supports the same filter card as the Paid page: live search, filter by
// teacher/subject/classroom/student with Apply, and a month range.
document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.getElementById('absenceLogsBody');
  const searchInput = document.getElementById('searchInput');
  const filterType = document.getElementById('filterAbsenceType');
  const filterValue = document.getElementById('filterAbsenceValue');
  const applyBtn = document.getElementById('applyAbsenceFilterBtn');
  const filterSummary = document.getElementById('absenceFilterSummary');
  const startMonthInput = document.getElementById('startMonthInput');
  const endMonthInput = document.getElementById('endMonthInput');

  let allLogs = [];

  function fetchAbsenceLogs() {
    fetch('/api/student-absence-logs')
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

  // Group raw rows into sessions (subject, classroom, date, timeWindow, teacher)
  function groupSessions(rows) {
    const grouped: any = {};
    rows.forEach(row => {
      const key = [row.subject, row.classroom, row.date, row.timeWindow, row.teacher].join('|');
      if (!grouped[key]) {
        grouped[key] = {
          subject: row.subject,
          classroom: row.classroom,
          date: row.date,
          timeWindow: row.timeWindow,
          students: [],
          teacher: row.teacher,
          hours: row.hours,
        };
      }
      if (row.subject && !grouped[key].subject) grouped[key].subject = row.subject;
      if (row.classroom && !grouped[key].classroom) grouped[key].classroom = row.classroom;
      if (row.date && !grouped[key].date) grouped[key].date = row.date;
      if (row.timeWindow && !grouped[key].timeWindow) grouped[key].timeWindow = row.timeWindow;
      if (row.teacher && !grouped[key].teacher) grouped[key].teacher = row.teacher;
      if (row.hours && !grouped[key].hours) grouped[key].hours = row.hours;
      grouped[key].students.push({ name: row.studentName, id: row.id });
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
    // Fetch the log first so it can be restored by the Undo button
    let log = null;
    let logIndex = -1;
    try {
      const logs = await (await fetch('/api/student-absence-logs')).json();
      logIndex = logs.findIndex(l => String(l.id) === String(id));
      log = logIndex !== -1 ? logs[logIndex] : null;
    } catch (e) { /* ignore */ }
    const res = await fetch(`/api/student-absence-logs/${id}`, { method: 'DELETE' });
    if (res.ok) {
      if (log && window.pushAction && window.createDeleteAction) {
        // _restoreIndex puts the log back at its original position
        window.pushAction(window.createDeleteAction({ ...log, _restoreIndex: logIndex }, 'student-absence-log', '/api/student-absence-logs', fetchAbsenceLogs));
      }
      fetchAbsenceLogs();
    } else {
      alert('Failed to delete absence log.');
    }
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
