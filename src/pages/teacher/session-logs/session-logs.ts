// session-logs.js - Teacher Portal Session Logs

document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.getElementById('sessionLogsTableBody');
  const searchInput = document.getElementById('searchInput');
  // Enable search bar filtering as user types or presses Enter
  searchInput.addEventListener('input', fetchSessionLogs);
  searchInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') fetchSessionLogs(); });

  // Deleted-record cache so the Undo button can restore a session log back at
  // its original spot (id -> { record, index in the full attendance list }).
  const sessionLogRecords: { [key: string]: any } = {};

  function fetchSessionLogs() {
    const teacherId = localStorage.getItem('teacherId') || '';
    const teacherName = localStorage.getItem('teacherName') ||
      [localStorage.getItem('teacherFirstName'), localStorage.getItem('teacherLastName')]
        .filter(Boolean)
        .join(' ');

    const params = new URLSearchParams({ mine: '1' });
    if (teacherId) params.set('teacherId', teacherId);
    if (teacherName) params.set('teacherName', teacherName);

    fetch(`/api/teachers-attendance?${params.toString()}`) // Only fetch logs for the logged-in teacher
      .then(res => res.json())
      .then(data => renderTable(data));
  }

  function renderTable(data) {
    const search = searchInput.value.toLowerCase();
    tableBody.innerHTML = '';
    data.filter(row => {
      // Search by subject, classroom, date, or any student name
      return (
        row.subject?.toLowerCase().includes(search) ||
        row.classroom?.toLowerCase().includes(search) ||
        row.date?.toLowerCase().includes(search) ||
        (row.students && row.students.some(s => s.name?.toLowerCase().includes(search)))
      );
    }).forEach(row => {
      // Keep the full record + its index in the (filtered) list for undo.
      // The true index in the attendance file is resolved at delete time.
      sessionLogRecords[String(row.id)] = { record: row };

      const tr = document.createElement('tr');
      // Calculate duration from timeWindow (handles multiple intervals)
      let durationText = '';
      if (row.timeWindow) {
        // Split by dash and trim
        const times = row.timeWindow.split('-').map(t => t.trim()).filter(Boolean);
        let totalMins = 0;
        for (let i = 0; i < times.length - 1; i++) {
          const [sh, sm] = times[i].split(':').map(Number);
          const [eh, em] = times[i + 1].split(':').map(Number);
          let startMins = sh * 60 + sm;
          let endMins = eh * 60 + em;
          let diff = endMins - startMins;
          if (diff < 0) diff += 24 * 60; // overnight
          totalMins += diff;
        }
        if (totalMins > 0) {
          const hours = Math.floor(totalMins / 60);
          const mins = totalMins % 60;
          let parts = [];
          if (hours > 0) parts.push(hours + ' hour' + (hours !== 1 ? 's' : ''));
          if (mins > 0) parts.push(mins + ' min' + (mins !== 1 ? 's' : ''));
          durationText = `This session is ${parts.join(' and ')}.`;
        }
      }
      const students = (row.students && row.students.length)
        ? row.students.map(s => `<span class='badge bg-secondary me-1 mb-1'>${s.name}</span>`).join(' ')
        : '<span class="text-muted">None</span>';
      tr.innerHTML = `
        <td>${row.subject || ''}</td>
        <td>${row.classroom || ''}</td>
        <td>${row.date || ''} <br><small>${row.timeWindow || ''}${durationText ? '<br>' + durationText : ''}</small></td>
        <td>${students}</td>
        <td>${row.type || ''}</td>
        <td><button class="btn btn-danger btn-sm" onclick="deleteSessionLog('${row.id}')"><i class='bi bi-trash'></i> Delete</button></td>
        <!-- Undo support: the record is kept in sessionLogRecords -->
      `;
      tableBody.appendChild(tr);
    });
  }

  window.deleteSessionLog = async function(id) {
    const entry = sessionLogRecords[String(id)];
    // Resolve the record's true position in the full attendance file so the
    // Undo button can put it back exactly where it was (the page list is
    // teacher-filtered, so its own index is not the file index).
    let restoreIndex = -1;
    try {
      const allRecords = await (await fetch('/api/teachers-attendance')).json();
      restoreIndex = allRecords.findIndex(r => String(r.id) === String(id));
    } catch (err) { /* keep -1 (falls back to append) */ }

    fetch(`/api/teachers-attendance/${id}`, { method: 'DELETE' })
      .then(async res => {
        if (res.ok) {
          // Register an undo action so the deleted log can be restored
          if (window.pushAction && window.createCustomAction && entry) {
            const undoAction = window.createCustomAction('delete', async () => {
              await fetch('/api/teachers-attendance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...entry.record, _restoreIndex: restoreIndex })
              });
              fetchSessionLogs();
            });
            window.pushAction(undoAction);
          }
          fetchSessionLogs();
        } else {
          alert('Failed to delete session log.');
        }
      });
  };

  searchInput.addEventListener('input', fetchSessionLogs);
  fetchSessionLogs();
});
