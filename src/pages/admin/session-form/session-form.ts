/**
 * Session Form - Full replication of TSX component logic
 * Implements: EditableTimeChips, student cards, draft/absent/leaving modes, date picker, etc.
 */

(function() {
  // ---------- CONSTANTS & MOCK DATA (matching TSX) ----------
  let classroomOptions = [];
  // GRADE_OPTIONS removed; will fetch from backend
  let gradeOptions = [];
  // SUBJECT_OPTIONS removed; will fetch from backend
  let subjectOptions = [];
  let teacherOptions = [];
  let studentOptions = [];
  const TUTORING_TYPES = ['Private', 'Group'];
  // Strictly match requested time window order and values
  const DEFAULT_TIME_SLOTS = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '00:00', '01:00', '02:00'
  ];

  // Removed mock available students. Only backend data will be used.

  // Global state (mirrors TSX props)
  let sessionState: any = {
    teacherId: null,
    teacherDisplayName: '',
    editableTeacherName: false,   // false => show Create New Student section
    teacherName: '',
    sessionDate: new Date().toISOString().slice(0, 10),
    sessionSchoolName: '',
    sessionGradeLevel: '',
    sessionTimeSlots: [],   // no selected time slots
    sessionSubject: '',
    sessionHours: 2.0,
    tutoringType: '',
    classroom: '',
    studentList: [],                       // names of added students
    studentHoursDrafts: {},                // name -> hours (number)
    studentGradeDrafts: {},                // name -> 'Excellent'/'Fair'/'Poor'
    studentParticipationDrafts: {},        // name -> 'Active'/'Moderate'/'Passive'
    studentAbsenceDraftFlags: {},          // name -> boolean (absent mode)
    studentDraftCarryFlags: {},            // name -> boolean (draft mode)
    subscriptionProgressByStudent: {},     // will be filled with { [studentName]: 'usage/amount (expires: date)' }
    sessionAbsenceNoteDraft: '',
    // UI status
    sessionNewStudentName: '',
    sessionNewStudentPhone: '',
    sessionNewStudentError: '',
    sessionNewStudentStatus: '',
  };

// Load subscriptions from database and map to students
let adm_sess_subscriptionData = [];
// Students can hold several subscriptions — one per subject. This picks the one
// matching the session's chosen subject (case-insensitive). Subscriptions with
// no subject (legacy/one-off rows from the payments page) act as fallbacks.
function adm_sess_findSubjectSubscription(studentName, sessionSubject) {
  const nameNorm = String(studentName || '').trim().toLowerCase();
  const subjNorm = String(sessionSubject || '').trim().toLowerCase();
  const matches = adm_sess_subscriptionData.filter(s => String(s.studentFullName || '').trim().toLowerCase() === nameNorm);
  if (!matches.length) return null;
  if (subjNorm) {
    const exact = matches.find(s => String(s.subject || '').trim().toLowerCase() === subjNorm);
    if (exact) return exact;
  }
  return matches.find(s => !String(s.subject || '').trim()) || null;
}
// Show each student's usage progress for the SUBJECT the session currently
// uses, so the badge always reflects the subscription that will be consumed.
function adm_sess_refreshSubscriptionProgress() {
  sessionState.subscriptionProgressByStudent = {};
  sessionState.studentList.forEach(name => {
    const sub = adm_sess_findSubjectSubscription(name, sessionState.sessionSubject);
    if (sub) {
      const subjLabel = sub.subject ? `${sub.subject}: ` : '';
      sessionState.subscriptionProgressByStudent[name] = `${subjLabel}${sub.usage} (expires: ${sub.expirationDate})`;
    } else {
      sessionState.subscriptionProgressByStudent[name] = 'No subscription';
    }
  });
}
function adm_sess_loadSubscriptionsAndMapToStudents() {
  fetch('/api/subscriptions')
    .then(res => res.json())
    .then(data => {
      adm_sess_subscriptionData = Array.isArray(data) ? data : [];
      // Map usage/expiration for each student in sessionState.studentList
      adm_sess_refreshSubscriptionProgress();
      renderStudentListCards();
    });
}

  // Editable time slots master list (all possible slots)
  let allTimeSlots = [...DEFAULT_TIME_SLOTS];

  // Helper functions
  function timeToMinutes(t) { let [h, m] = t.split(':'); return (parseInt(h) || 0) * 60 + (parseInt(m) || 0); }
  function minutesToHHMM(min) { let h = Math.floor(min / 60), m = min % 60; return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`; }
  function sortAndDeduplicate(slots) { return [...new Set(slots)].sort((a, b) => timeToMinutes(a) - timeToMinutes(b)); }

  function getClassroomDisplay(room) { return room === 'Classroom 5' ? 'Private Room' : room; }

  function getClassroomColor(room) {
    const found = classroomOptions.find(c => c.classroom_name === room);
    return found ? found.color : '#cbd5e1';
  }

  // ---------- RENDER FUNCTIONS (full UI refresh) ----------
  function renderAll() {
    renderTeacherDropdown();
    renderGradeChips();
    renderTimeSlotsChips();
    renderSubjectChips();
    renderClassroomChips();
    renderTypeChips();
    renderQuickStudents();
    renderStudentListCards();
  }

  // Fetch classrooms from backend
  function fetchClassroomsAndRender() {
    fetch('/api/classrooms')
      .then(res => res.json())
      .then(data => {
        classroomOptions = Array.isArray(data) ? data : [];
        renderClassroomChips();
      })
      .catch(() => {
        classroomOptions = [];
        renderClassroomChips();
      });
  }
  // Fetch subjects from backend
  function fetchSubjectsAndRender() {
    fetch('/api/subjects')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          subjectOptions = data;
        } else {
          subjectOptions = [];
        }
        renderSubjectChips();
      })
      .catch(() => {
        subjectOptions = [];
        renderSubjectChips();
      });
  }

  // Fetch teachers from backend
  function fetchTeachersAndRender() {
    fetch('/api/teachers')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          teacherOptions = data;
        } else {
          teacherOptions = [];
        }
        renderTeacherDropdown();
      })
      .catch(() => {
        teacherOptions = [];
        renderTeacherDropdown();
      });
  }

  // Fetch students from backend
  function fetchStudentsAndRender() {
    fetch('/api/students')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          studentOptions = data;
        } else {
          studentOptions = [];
        }
        renderQuickStudents();
      })
      .catch(() => {
        studentOptions = [];
        renderQuickStudents();
      });
  }

  // Fetch grades from backend
  function fetchGradesAndRender() {
    fetch('/api/grades')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          gradeOptions = data;
        } else {
          gradeOptions = [];
        }
        renderGradeChips();
      })
      .catch(() => {
        gradeOptions = [];
        renderGradeChips();
      });
  }

  function renderGradeChips() {
    const container = document.getElementById('gradeChipsContainer');
    if (!container) return;
    if (!Array.isArray(gradeOptions) || gradeOptions.length === 0) {
      container.innerHTML = '<span class="text-muted">No grades available</span>';
      return;
    }
    container.innerHTML = gradeOptions.map(g => {
      const gradeName = g.name || g;
      return `<span class="choice-chip ${sessionState.sessionGradeLevel === gradeName ? 'choice-chip-active' : ''}" data-grade="${gradeName}">${gradeName}</span>`;
    }).join('');
    container.querySelectorAll('.choice-chip').forEach(el => {
      el.addEventListener('click', () => {
        sessionState.sessionGradeLevel = el.getAttribute('data-grade');
        renderGradeChips();
      });
    });
  }

  // Track which slot is being edited
  let editingTimeSlot = null;
  // Track time window selection
  let timeWindowStart = null;
  let timeWindowEnd = null;
  let customStartMinutes = null; // e.g., 13:45

  function renderTimeSlotsChips() {
    const container = document.getElementById('timeSlotsContainer');
    if (!container) return;
    container.innerHTML = '';

    // Helper to get minutes from HH:MM
    function getMinutes(t) {
      const [h, m] = t.split(':');
      return parseInt(h, 10) * 60 + parseInt(m, 10);
    }

    // Figure out selection range
    let startIdx = timeWindowStart ? allTimeSlots.indexOf(timeWindowStart) : -1;
    let endIdx = timeWindowEnd ? allTimeSlots.indexOf(timeWindowEnd) : -1;
    // Defensive: reset if indices are invalid
    if ((timeWindowStart && startIdx === -1) || (timeWindowEnd && endIdx === -1)) {
      timeWindowStart = null;
      timeWindowEnd = null;
      customStartMinutes = null;
      startIdx = -1;
      endIdx = -1;
    }
    if (startIdx > endIdx && startIdx !== -1 && endIdx !== -1) [startIdx, endIdx] = [endIdx, startIdx];

    // --- PATCH: Update sessionState.sessionTimeSlots when a valid window is selected ---
    if (timeWindowStart && timeWindowEnd && startIdx !== -1 && endIdx !== -1) {
      sessionState.sessionTimeSlots = allTimeSlots.slice(startIdx, endIdx + 1);
    } else if (timeWindowStart && startIdx !== -1 && (!timeWindowEnd || endIdx === -1)) {
      sessionState.sessionTimeSlots = [timeWindowStart];
    } else {
      sessionState.sessionTimeSlots = [];
    }

    allTimeSlots.forEach((slot, idx) => {
      let isSelected = false;
        // Always highlight the full range between start and end, regardless of order
        if (timeWindowStart && timeWindowEnd && startIdx !== -1 && endIdx !== -1) {
          if (startIdx <= endIdx) {
            isSelected = idx >= startIdx && idx <= endIdx;
          } else {
            isSelected = idx >= endIdx && idx <= startIdx;
          }
        } else if (timeWindowStart && idx === startIdx) {
          isSelected = true;
      }
      const isEditing = editingTimeSlot === slot;
      const chipDiv = document.createElement('span');
      chipDiv.className = `time-chip-editable ${isSelected ? 'selected' : ''}`;
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
          if (e.key === 'Enter') {
            finishEdit();
          } else if (e.key === 'Escape') {
            editingTimeSlot = null;
            renderTimeSlotsChips();
          }
        });
        input.addEventListener('blur', finishEdit);
        chipDiv.appendChild(input);
        setTimeout(() => input.focus(), 0);

        function finishEdit() {
          const newVal = input.value.trim();
          if (newVal && /^\d{2}:\d{2}$/.test(newVal)) {
            const idx = allTimeSlots.indexOf(slot);
            // Prevent duplicate times (except for the current slot)
            if (idx !== -1 && (!allTimeSlots.includes(newVal) || slot === newVal)) {
              allTimeSlots[idx] = newVal;
            } else if (idx !== -1 && allTimeSlots.includes(newVal) && slot !== newVal) {
              // If duplicate and not just a label update, ignore
              editingTimeSlot = null;
              renderAll();
              return;
            }
            // If this slot was selected as start or end, update selection to new value
            if (timeWindowStart === slot) timeWindowStart = newVal;
            if (timeWindowEnd === slot) timeWindowEnd = newVal;
            editingTimeSlot = null;
            renderAll();
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

        // Selection logic
        chipDiv.addEventListener('click', (e) => {
          if (e.target === editIcon) return;
          // If clicking a selected chip (in the current range), cancel selection
          let startIdx = timeWindowStart ? allTimeSlots.indexOf(timeWindowStart) : -1;
          let endIdx = timeWindowEnd ? allTimeSlots.indexOf(timeWindowEnd) : -1;
          let clickedIdx = idx;
          let inSelectedRange = false;
          if (timeWindowStart && timeWindowEnd && startIdx !== -1 && endIdx !== -1 && clickedIdx >= startIdx && clickedIdx <= endIdx) {
            inSelectedRange = true;
          } else if (timeWindowStart && !timeWindowEnd && clickedIdx === startIdx) {
            inSelectedRange = true;
          }
          if (inSelectedRange) {
            // Cancel selection
            timeWindowStart = null;
            timeWindowEnd = null;
            customStartMinutes = null;
            renderAll();
            return;
          }
          if (!timeWindowStart || (timeWindowStart && timeWindowEnd)) {
            // Start new selection
            timeWindowStart = slot;
            timeWindowEnd = null;
            customStartMinutes = null;
            renderAll();
            showMinuteInput(slot, chipDiv);
          } else if (timeWindowStart && !timeWindowEnd) {
            // Only allow clockwise (end after start)
            const startIdx = allTimeSlots.indexOf(timeWindowStart);
            const endIdx = idx;
            if (endIdx > startIdx) {
              timeWindowEnd = slot;
              renderAll();
            }
          }
        });

        // Inline edit logic
        editIcon.addEventListener('click', (e) => {
          e.stopPropagation();
          editingTimeSlot = slot;
          renderAll();
        });
      }
      container.appendChild(chipDiv);
    });

    // Show duration next to label as a message
    const label = Array.from(document.querySelectorAll('.choice-label')).find(l => l.textContent.trim().startsWith('Time Window'));
    let durationDiv = document.getElementById('timeWindowDuration');
    if (!durationDiv) {
      durationDiv = document.createElement('span');
      durationDiv.id = 'timeWindowDuration';
      durationDiv.style.marginLeft = '16px';
      durationDiv.style.fontWeight = 'bold';
      durationDiv.style.color = '#2563eb';
    }
    let durationText = '';
    if (timeWindowStart && timeWindowEnd) {
      let startMin = getMinutes(timeWindowStart);
      let endMin = getMinutes(timeWindowEnd);
      if (customStartMinutes) {
        const [h, m] = customStartMinutes.split(':');
        startMin = parseInt(h, 10) * 60 + parseInt(m, 10);
      }
      let diff = endMin - startMin;
      if (diff < 0) diff += 24 * 60; // Handle overnight sessions
      if (diff > 0) {
        const hours = Math.floor(diff / 60);
        const mins = diff % 60;
        durationText = `This session is ${hours > 0 ? hours + ' hour' + (hours > 1 ? 's' : '') : ''}${hours > 0 && mins > 0 ? ' and ' : ''}${mins > 0 ? mins + ' min' : ''}.`;
      }
    }
    durationDiv.textContent = durationText;
    // Insert after label
    if (label && label.nextSibling !== durationDiv) {
      label.parentNode.insertBefore(durationDiv, label.nextSibling);
    }

    // Helper to show custom minute input
    function showMinuteInput(slot, chipDiv) {
      // Only show for start slot
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
            customStartMinutes = val;
            renderTimeSlotsChips();
          } else {
            minInput.style.border = '1.5px solid #ef4444';
          }
        }
      });
      chipDiv.appendChild(minInput);
      setTimeout(() => minInput.focus(), 0);
    }
  }

  function renderSubjectChips() {
    const container = document.getElementById('subjectChipsContainer');
    if (!container) return;
    if (!Array.isArray(subjectOptions) || subjectOptions.length === 0) {
      container.innerHTML = '<span class="text-muted">No subjects available</span>';
      return;
    }
    const sorted = [...subjectOptions].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    container.innerHTML = sorted.map(s => {
      const subjName = s.name || s;
      return `<span class="choice-chip ${sessionState.sessionSubject === subjName ? 'choice-chip-active' : ''}" data-subj="${subjName}">${subjName}</span>`;
    }).join('');
    container.querySelectorAll('.choice-chip').forEach(el => {
      el.addEventListener('click', () => {
        sessionState.sessionSubject = el.getAttribute('data-subj');
        renderSubjectChips();
        renderQuickStudents();
        // The chosen subject decides which subscription's usage applies, so
        // refresh the usage badges on the student cards.
        if (adm_sess_subscriptionData.length > 0) adm_sess_refreshSubscriptionProgress();
        renderStudentListCards();
      });
    });
  }

  // Render teacher selector as a dropdown
  function renderTeacherDropdown() {
    const select = document.getElementById('teacherSelectorDropdown');
    if (!select) return;
    // Clear existing options except the first
    select.innerHTML = '<option value="">Select...</option>';
    teacherOptions.forEach(t => {
      const teacherName = `${t.firstName} ${t.lastName}`;
      const option = document.createElement('option');
      option.value = t.id;
      option.textContent = teacherName;
      if (sessionState.teacherId === t.id) option.selected = true;
      select.appendChild(option);
    });
    select.onchange = function() {
      const id = parseInt(this.value);
      const teacher = teacherOptions.find(t => t.id === id);
      sessionState.teacherId = id;
      sessionState.teacherDisplayName = teacher ? `${teacher.firstName} ${teacher.lastName}` : '';
      sessionState.teacherName = sessionState.teacherDisplayName;
    };
  }

  function renderClassroomChips() {
    const container = document.getElementById('classroomContainer');
    if (!container) return;
    if (!Array.isArray(classroomOptions) || classroomOptions.length === 0) {
      container.innerHTML = '<span class="text-muted">No classrooms available</span>';
      return;
    }
    container.innerHTML = classroomOptions.map(c => {
      const color = c.color || '#cbd5e1';
      const isActive = sessionState.classroom === c.classroom_name;
      return `<div class="classroom-tab ${isActive ? 'classroom-tab-active' : ''}" data-room="${c.classroom_name}">
                <span class="classroom-color-dot" style="background:${color}; border-color:${color}"></span>
                <span>${c.classroom_name}</span>
              </div>`;
    }).join('');
    container.querySelectorAll('.classroom-tab').forEach(el => {
      el.addEventListener('click', () => {
        sessionState.classroom = el.getAttribute('data-room');
        renderClassroomChips();
      });
    });
  }

  function renderTypeChips() {
    const container = document.getElementById('typeContainer');
    if (!container) return;
    container.innerHTML = TUTORING_TYPES.map(t => `<span class="choice-chip ${sessionState.tutoringType === t ? 'choice-chip-active' : ''}" data-type="${t}">${t}</span>`).join('');
    container.querySelectorAll('.choice-chip').forEach(el => {
      el.addEventListener('click', () => {
        sessionState.tutoringType = el.getAttribute('data-type');
        renderTypeChips();
      });
    });
  }

  function renderQuickStudents(filteredList?: any) {
    const container = document.getElementById('quickStudentsList');
    if (!container) return;
    const msgDiv = document.getElementById('quickStudentMsg');
    if (!Array.isArray(studentOptions) || studentOptions.length === 0) {
      container.innerHTML = '<span class="text-muted">No students available</span>';
      return;
    }
    // Use filtered list if provided, else all students
    const list = Array.isArray(filteredList) ? filteredList : studentOptions;
    // Sort alphabetically by studentName (case-insensitive)
    const sorted = [...list].sort((a, b) => (a.studentName || '').localeCompare(b.studentName || '', undefined, { sensitivity: 'base' }));
    container.innerHTML = sorted.map(s => `<button type="button" class="quick-student-btn" data-name="${s.studentName}">${s.studentName}</button>`).join('');
    container.querySelectorAll('.quick-student-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const name = btn.getAttribute('data-name');
        const msgDivTop = document.getElementById('quickStudentMsgTop');
        if (!sessionState.studentList.includes(name)) {
          sessionState.studentList.push(name);
          // Calculate session duration in minutes based on selected time window (like teacher)
          let startMin = 0, endMin = 0;
          if (Array.isArray(sessionState.sessionTimeSlots) && sessionState.sessionTimeSlots.length > 0) {
            // Use first and last slot as window
            const getMinutes = t => { let [h, m] = t.split(":"); return (parseInt(h) || 0) * 60 + (parseInt(m) || 0); };
            startMin = getMinutes(sessionState.sessionTimeSlots[0]);
            endMin = getMinutes(sessionState.sessionTimeSlots[sessionState.sessionTimeSlots.length - 1]);
            if (endMin <= startMin) endMin += 24 * 60; // overnight
          }
          let durationMinutes = endMin > startMin ? (endMin - startMin) : Math.round(sessionState.sessionHours * 60);
          let durationHours = durationMinutes / 60;
          sessionState.studentHoursDrafts[name] = parseFloat(durationHours.toFixed(2));
          sessionState.studentMinutesDrafts = sessionState.studentMinutesDrafts || {};
          sessionState.studentMinutesDrafts[name] = durationMinutes;
          if (!sessionState.studentGradeDrafts[name]) sessionState.studentGradeDrafts[name] = 'Fair';
          if (!sessionState.studentParticipationDrafts[name]) sessionState.studentParticipationDrafts[name] = 'Moderate';
          sessionState.studentAbsenceDraftFlags[name] = false;
          sessionState.studentDraftCarryFlags[name] = false;
          renderStudentListCards();
          if (msgDiv) {
            msgDiv.innerHTML = `<span class="success-text">${name} added to session!</span>`;
            setTimeout(() => { msgDiv.innerHTML = ''; }, 2000);
          }
          if (msgDivTop) {
            msgDivTop.innerHTML = `<span class="success-text">${name} added to session!</span>`;
            setTimeout(() => { msgDivTop.innerHTML = ''; }, 2000);
          }
        } else {
          if (msgDiv) {
            msgDiv.innerHTML = `<span class="error-text">${name} already added to session</span>`;
            setTimeout(() => { msgDiv.innerHTML = ''; }, 2000);
          }
          if (msgDivTop) {
            msgDivTop.innerHTML = `<span class="error-text">${name} already added to session</span>`;
            setTimeout(() => { msgDivTop.innerHTML = ''; }, 2000);
          }
        }
      });
    });
  }

  // Search functionality for quick add students
  window.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('quickStudentSearchInput');
    const searchBtn = document.getElementById('quickStudentSearchBtn');
    if (searchInput && searchBtn) {
      const doSearch = () => {
        const val = searchInput.value.trim().toLowerCase();
        if (val === '') {
          renderQuickStudents();
        } else {
          const filtered = studentOptions.filter(s => s.studentName && s.studentName.toLowerCase().includes(val));
          renderQuickStudents(filtered);
        }
      };
      searchBtn.addEventListener('click', doSearch);
      searchInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') doSearch(); });
      searchInput.addEventListener('input', doSearch);
    }
  });

  function renderStudentListCards() {
    // Always refresh subscription info for each student — matched to the
    // session's subject so each subject subscription shows its own counter.
    if (adm_sess_subscriptionData.length > 0) {
      adm_sess_refreshSubscriptionProgress();
    }
    const container = document.getElementById('studentsListContainer');
    if (!container) return;
    if (sessionState.studentList.length === 0) {
      container.innerHTML = '<div class="text-muted p-3 bg-light rounded">No students added yet.</div>';
      return;
    }
    container.innerHTML = '';
    sessionState.studentList.forEach(name => {
      const hours = sessionState.studentHoursDrafts[name] ?? 1;
      const grade = sessionState.studentGradeDrafts[name] ?? 'Fair';
      const participation = sessionState.studentParticipationDrafts[name] ?? 'Moderate';
      const isAbsent = !!sessionState.studentAbsenceDraftFlags[name];
      const isDraft = !!sessionState.studentDraftCarryFlags[name];
      let mode = 'leaving';
      if (isAbsent) mode = 'absent';
      else if (isDraft) mode = 'draft';

      const rowDiv = document.createElement('div');
      rowDiv.className = 'student-session-row';
      rowDiv.innerHTML = `
        <div class="student-info-area">
          <div class="student-name-row">
            <div class="fw-bold fs-6">${escapeHtml(name)}</div>
            ${subscriptionBadgeFor(name)}
          </div>
          ${subscriptionNoticeFor(name)}
          <div class="mt-2">
            <div class="fw-semibold mb-1">Hours:</div>
            <div class="student-hours-chip" id="hours-chip-${name.replace(/\s/g, '')}"></div>
          </div>
          <div class="mt-2">
            <div class="fw-semibold">Grade:</div>
            <div class="choice-wrap mt-1" id="grade-row-${name.replace(/\s/g, '')}"></div>
          </div>
          <div class="mt-2">
            <div class="fw-semibold">Participation:</div>
            <div class="choice-wrap mt-1" id="part-row-${name.replace(/\s/g, '')}"></div>
          </div>
          <div class="mt-2">
            <textarea class="form-control student-note-input" id="student-note-${name.replace(/\s/g, '')}" rows="1" placeholder="Note (optional)">${sessionState.studentNoteDrafts && sessionState.studentNoteDrafts[name] ? sessionState.studentNoteDrafts[name] : ''}</textarea>
          </div>
        </div>
        <div class="student-actions-area">
          <button class="mode-btn mode-btn-absent ${mode === 'absent' ? 'mode-btn-active' : ''}" data-mode="absent"><i class="bi bi-person-x"></i> Absent</button>
          <button class="save-draft-btn" data-student="${escapeHtml(name)}"><i class="bi bi-bookmark-star"></i> Save to Draft</button>
          <button class="remove-student" title="Remove from session" aria-label="Remove ${escapeHtml(name)} from session"><i class="bi bi-x-lg"></i></button>
        </div>
      `;
            // Save note on blur
            const noteInput = rowDiv.querySelector(`#student-note-${name.replace(/\s/g, '')}`);
            if (noteInput) {
              noteInput.addEventListener('blur', () => {
                if (!sessionState.studentNoteDrafts) sessionState.studentNoteDrafts = {};
                sessionState.studentNoteDrafts[name] = noteInput.value;
              });
            }

            // Attach Save to Draft handler for this student
            const saveDraftBtn = rowDiv.querySelector('.save-draft-btn');
            if (saveDraftBtn) {
              saveDraftBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const studentName = name;
                // Validate required fields before saving draft
                let missing = [];
                if (!sessionState.teacherDisplayName) missing.push('Teacher');
                if (!sessionState.sessionSchoolName) missing.push('School Name');
                if (!sessionState.sessionGradeLevel) missing.push('Grade');
                if (!sessionState.sessionTimeSlots || sessionState.sessionTimeSlots.length < 2) missing.push('Time Window (select open and close)');
                if (!sessionState.sessionSubject) missing.push('Subject');
                if (!sessionState.classroom) missing.push('Classroom');
                if (!sessionState.tutoringType) missing.push('Type');
                if (missing.length > 0) {
                  const msgDivTop = document.getElementById('quickStudentMsgTop');
                  if (msgDivTop) {
                    msgDivTop.innerHTML = `<div class="alert alert-danger">Please fill in: <b>${missing.join(', ')}</b> before saving draft.</div>`;
                    setTimeout(() => { msgDivTop.innerHTML = ''; }, 4000);
                  }
                  return;
                }
                // Save the current session state as a draft for ONLY the selected student
                const draft = {
                  teacherName: sessionState.teacherDisplayName,
                  date: sessionState.sessionDate,
                  schoolName: sessionState.sessionSchoolName,
                  grade: sessionState.sessionGradeLevel,
                  timeSlots: sessionState.sessionTimeSlots,
                  subject: sessionState.sessionSubject,
                  classroom: sessionState.classroom,
                  tutoringType: sessionState.tutoringType,
                  students: [studentName],
                  hours: { [studentName]: sessionState.studentHoursDrafts[studentName] },
                  grades: { [studentName]: sessionState.studentGradeDrafts[studentName] },
                  participation: { [studentName]: sessionState.studentParticipationDrafts[studentName] },
                  absentFlags: { [studentName]: sessionState.studentAbsenceDraftFlags[studentName] },
                  draftFlags: { [studentName]: sessionState.studentDraftCarryFlags[studentName] },
                  note: sessionState.studentNoteDrafts && sessionState.studentNoteDrafts[studentName] ? sessionState.studentNoteDrafts[studentName] : '',
                  lastUpdate: new Date().toISOString(),
                };
                // Save to array of drafts in localStorage (optional, for offline)
                let drafts = JSON.parse(localStorage.getItem('sessionFormStudentDrafts') || '[]');
                drafts.push(draft);
                localStorage.setItem('sessionFormStudentDrafts', JSON.stringify(drafts));

                // Also save to backend JSON file
                let teacherId = sessionState.teacherId || localStorage.getItem('teacherId') || '';
                if ((!teacherId || teacherId === 'null') && Array.isArray(teacherOptions)) {
                  const t = teacherOptions.find(t => `${t.firstName} ${t.lastName}` === sessionState.teacherDisplayName);
                  if (t) teacherId = t.id;
                }
                // Show feedback above the Save Attendance button
                const attendanceMsgDiv = document.getElementById('attendanceStatusMsg');
                if (attendanceMsgDiv) {
                  attendanceMsgDiv.innerHTML = `<span class="alert alert-success py-2 px-3 mb-2">Draft for <b>${escapeHtml(studentName)}</b> saved ✓ and student removed from session.</span>`;
                  setTimeout(() => { attendanceMsgDiv.innerHTML = ''; }, 2000);
                }

                if (teacherId) {
                  fetch('/api/session-draft', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ teacherId, draft })
                  })
                  .then(res => res.json())
                  .then(data => {
                    // Register an undo action that restores the student to the session
                    if (window.pushAction && window.createCustomAction && data && data.success) {
                      window.pushAction(window.createCustomAction('add', async () => {
                        if (!sessionState.studentList.includes(studentName)) {
                          sessionState.studentList.push(studentName);
                          sessionState.studentHoursDrafts[studentName] = draft.hours[studentName];
                          sessionState.studentGradeDrafts[studentName] = draft.grades[studentName];
                          sessionState.studentParticipationDrafts[studentName] = draft.participation[studentName];
                          sessionState.studentAbsenceDraftFlags[studentName] = draft.absentFlags[studentName] || false;
                          sessionState.studentDraftCarryFlags[studentName] = draft.draftFlags[studentName] || false;
                          if (draft.note) {
                            if (!sessionState.studentNoteDrafts) sessionState.studentNoteDrafts = {};
                            sessionState.studentNoteDrafts[studentName] = draft.note;
                          }
                          renderStudentListCards();
                        }
                      }));
                    }
                  })
                  .catch(() => {
                    const msgDivTop = document.getElementById('quickStudentMsgTop');
                    if (msgDivTop) {
                      msgDivTop.innerHTML = `<span class="alert alert-warning py-2 px-3 mb-2">Draft for <b>${escapeHtml(studentName)}</b> saved locally, but failed to save to server.</span>`;
                      setTimeout(() => { msgDivTop.innerHTML = ''; }, 2000);
                    }
                  });
                } else {
                  const msgDivTop = document.getElementById('quickStudentMsgTop');
                  if (msgDivTop) {
                    msgDivTop.innerHTML = `<span class="alert alert-danger py-2 px-3 mb-2">Could not determine teacher ID. Draft saved locally only.</span>`;
                    setTimeout(() => { msgDivTop.innerHTML = ''; }, 2000);
                  }
                }

                // Remove student from session list and re-render (close the card)
                sessionState.studentList = sessionState.studentList.filter(n => n !== studentName);
                delete sessionState.studentHoursDrafts[studentName];
                delete sessionState.studentGradeDrafts[studentName];
                delete sessionState.studentParticipationDrafts[studentName];
                delete sessionState.studentAbsenceDraftFlags[studentName];
                delete sessionState.studentDraftCarryFlags[studentName];
                if (sessionState.studentNoteDrafts) delete sessionState.studentNoteDrafts[studentName];
                renderStudentListCards();
              });
            }
      // ...existing code...
          // Attach Save Attendance button handler after rendering
          const saveBtn = document.getElementById('saveAttendanceTopBtn');
          const statusMsg = document.getElementById('attendanceStatusMsg');
          if (saveBtn) {
            // Remove previous handler if any
            saveBtn.onclick = null;
            let saveInProgress = false;
            saveBtn.disabled = false;
            saveBtn.addEventListener('click', async () => {
              if (saveInProgress) return;
              // Validate required fields
              let missing = [];
              if (!sessionState.teacherId) missing.push('Teacher');
              if (!sessionState.sessionSchoolName) missing.push('School Name');
              if (!sessionState.sessionGradeLevel) missing.push('Grade');
              if (!sessionState.sessionTimeSlots || sessionState.sessionTimeSlots.length < 2) missing.push('Time Window (select open and close)');
              if (!sessionState.sessionSubject) missing.push('Subject');
              if (!sessionState.classroom) missing.push('Classroom');
              if (!sessionState.tutoringType) missing.push('Type');
              if (sessionState.studentList.length === 0) missing.push('At least one student');
              if (missing.length > 0) {
                statusMsg.innerHTML = `<div class="alert alert-danger">Please fill in: <b>${missing.join(', ')}</b></div>`;
                setTimeout(() => { statusMsg.innerHTML = ''; }, 4000);
                return;
              }
              saveInProgress = true;
              saveBtn.disabled = true;
              statusMsg.innerHTML = '';
              // Gather all session and student data
              const students = sessionState.studentList.map(name => {
                // Try to get phone from studentOptions
                const found = (Array.isArray(studentOptions) ? studentOptions : []).find(s => s.studentName === name);
                // Check if student has a subscription for THIS session's subject
                const subscription = adm_sess_findSubjectSubscription(name, sessionState.sessionSubject);
                // Subscribed students already paid via their subscription — carry
                // the subscription price/amount over so they never need to be
                // re-entered on each new session form.
                const subPrice = subscription
                  ? (extractSubPrice(subscription.priceTag) || extractSubPrice(subscription.amount))
                  : 0;
                const subPaid = subscription
                  ? (extractSubPrice(subscription.amount) || extractSubPrice(subscription.priceTag))
                  : subPrice;
                return {
                  name,
                  phone: found ? found.phoneNumber : '',
                  hours: sessionState.studentHoursDrafts[name] ?? 1,
                  grade: sessionState.studentGradeDrafts[name] ?? 'Fair',
                  participation: sessionState.studentParticipationDrafts[name] ?? 'Moderate',
                  absent: !!sessionState.studentAbsenceDraftFlags[name],
                  note: sessionState.studentNoteDrafts && sessionState.studentNoteDrafts[name] ? sessionState.studentNoteDrafts[name] : '',
                  discount: '',
                  priceTag: subscription ? subPrice : 0,
                  amount: subscription ? subPaid : 0,
                  method: 'Cash',
                  status: subscription ? 'Paid' : 'Pending'
                };
              });
              // Compose session data
              const sessionData = {
                teacherName: sessionState.teacherDisplayName,
                date: sessionState.sessionDate,
                submittedAt: new Date().toISOString(),
                schoolName: sessionState.sessionSchoolName,
                grade: sessionState.sessionGradeLevel,
                timeWindow: sessionState.sessionTimeSlots.join(' - '),
                subject: sessionState.sessionSubject,
                classroom: sessionState.classroom,
                type: sessionState.tutoringType,
                students
              };
              // Check whether this exact session already exists so Undo never
              // deletes a pre-existing session (only newly-created ones)
              let sessionExistedBefore = false;
              try {
                const existingSessions = await (await fetch('/database/teacher-portal/session-form.json')).json();
                sessionExistedBefore = Array.isArray(existingSessions) && existingSessions.some(sess =>
                  sess.teacherName === sessionData.teacherName &&
                  sess.date === sessionData.date &&
                  sess.subject === sessionData.subject &&
                  sess.classroom === sessionData.classroom &&
                  sess.type === sessionData.type &&
                  sess.grade === sessionData.grade &&
                  sess.schoolName === sessionData.schoolName &&
                  sess.timeWindow === sessionData.timeWindow
                );
              } catch (e) { /* treat as new session */ }
              fetch('/api/save-session-attendance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(sessionData)
              })
                .then(res => res.json())
                .then(data => {
                  statusMsg.innerHTML = '<div class="alert alert-success">Attendance saved successfully!</div>';
                  setTimeout(() => { statusMsg.innerHTML = ''; }, 2000);
                  // Register an undo action that deletes a newly-created session
                  if (!sessionExistedBefore && data && data.sessionId && window.pushAction && window.createCustomAction) {
                    const sessionId = data.sessionId;
                    window.pushAction(window.createCustomAction('session', async () => {
                      try {
                        await fetch('/api/delete-session', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ sessionId })
                        });
                      } catch (e) { console.error('Undo session save failed:', e); }
                      adm_sess_loadSubscriptionsAndMapToStudents();
                    }));
                  }
                  // Refresh subscription usage in UI
                  adm_sess_loadSubscriptionsAndMapToStudents();
                })
                .catch(() => {
                  statusMsg.innerHTML = '<div class="alert alert-danger">Failed to save attendance.</div>';
                  setTimeout(() => { statusMsg.innerHTML = ''; }, 2000);
                  // Re-enable button on failure
                  saveInProgress = false;
                  saveBtn.disabled = false;
                });
            });
          }
      container.appendChild(rowDiv);

      // Hours chips (01:00, 02:00, 03:00) + editable
      const hoursChipDiv = rowDiv.querySelector(`#hours-chip-${name.replace(/\s/g, '')}`);
      const hourOptions = ['01:00', '02:00', '03:00'];
      const currentHour = sessionState.studentHoursDrafts[name] ?? 1;
      // Always show chips by default, only show input if editing
      if (sessionState._editingHourFor === name) {
        // Show editable input for the selected hour
        const currentVal = minutesToHHMM(Math.round((currentHour || 1) * 60));
        const input = document.createElement('input');
        input.type = 'text';
        input.value = currentVal;
        input.className = 'student-hour-edit-input';
        input.style.width = '60px';
        input.style.textAlign = 'center';
        input.style.fontWeight = 'bold';
        input.style.border = '2px solid #2563eb';
        input.style.borderRadius = '16px';
        input.style.background = '#e0e7ff';
        input.style.outline = 'none';
        input.style.fontSize = '1em';
        input.style.padding = '2px 8px';
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') finishEdit();
          else if (e.key === 'Escape') cancelEdit();
        });
        input.addEventListener('blur', finishEdit);
        hoursChipDiv.appendChild(input);
        setTimeout(() => input.focus(), 0);
        function finishEdit() {
          const val = input.value.trim();
          let hourVal = null;
          if (/^\d{1,2}:\d{2}$/.test(val)) {
            const [h, m] = val.split(':');
            hourVal = parseInt(h, 10) + parseInt(m, 10) / 60;
          } else if (/^\d+(\.\d+)?$/.test(val)) {
            hourVal = parseFloat(val);
          }
          if (!isNaN(hourVal) && hourVal > 0) {
            sessionState.studentHoursDrafts[name] = hourVal;
            delete sessionState._editingHourFor;
            renderStudentListCards();
          } else {
            input.style.border = '2px solid #ef4444';
          }
        }
        function cancelEdit() {
          delete sessionState._editingHourFor;
          renderStudentListCards();
        }
      } else {
        // Always show a single chip with the current value in HH:MM, click to edit
        const span = document.createElement('span');
        span.className = 'small-chip selected';
        span.textContent = minutesToHHMM(Math.round((currentHour || 1) * 60));
        span.addEventListener('click', () => {
          sessionState._editingHourFor = name;
          renderStudentListCards();
        });
        hoursChipDiv.appendChild(span);
      }

      // Grade buttons
      const gradeContainer = rowDiv.querySelector(`#grade-row-${name.replace(/\s/g, '')}`);
      ['Excellent', 'Fair', 'Poor'].forEach(g => {
        const btn = document.createElement('span');
        btn.className = `choice-chip ${grade === g ? 'choice-chip-active' : ''}`;
        btn.textContent = g;
        btn.addEventListener('click', () => {
          sessionState.studentGradeDrafts[name] = g;
          renderStudentListCards();
        });
        gradeContainer.appendChild(btn);
      });

      // Participation buttons (fix: always update state and highlight)
      const partContainer = rowDiv.querySelector(`#part-row-${name.replace(/\s/g, '')}`);
      ['Active', 'Moderate', 'Passive'].forEach(p => {
        const btn = document.createElement('span');
        btn.className = `choice-chip ${participation === p ? 'choice-chip-active' : ''}`;
        btn.textContent = p;
        btn.addEventListener('click', () => {
          sessionState.studentParticipationDrafts[name] = p;
          renderStudentListCards();
        });
        partContainer.appendChild(btn);
      });

      // Mode buttons
      const modeBtns = rowDiv.querySelectorAll('.mode-btn');
      modeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const selectedMode = btn.getAttribute('data-mode');
          sessionState.studentAbsenceDraftFlags[name] = (selectedMode === 'absent');
          sessionState.studentDraftCarryFlags[name] = (selectedMode === 'draft');
          // If marking as absent, POST to absence logs API
          if (selectedMode === 'absent') {
            // Compose absence log entry with all required info
            const found = (Array.isArray(studentOptions) ? studentOptions : []).find(s => s.studentName === name);
            const absenceData = {
              studentName: name,
              phone: found ? found.phoneNumber : '',
              date: sessionState.sessionDate,
              subject: sessionState.sessionSubject,
              teacher: sessionState.teacherDisplayName,
              school: sessionState.sessionSchoolName,
              grade: sessionState.sessionGradeLevel,
              classroom: sessionState.classroom,
              timeWindow: Array.isArray(sessionState.sessionTimeSlots) && sessionState.sessionTimeSlots.length > 0 ? sessionState.sessionTimeSlots.join(' - ') : '',
              hours: sessionState.studentHoursDrafts[name] ?? '',
              note: sessionState.studentNoteDrafts && sessionState.studentNoteDrafts[name] ? sessionState.studentNoteDrafts[name] : ''
            };
            fetch('/api/student-absence-logs', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(absenceData)
            })
            .then(res => res.json())
            .then(log => {
              // Register an undo action so the absence log can be removed
              if (log && log.id && window.pushAction && window.createAddAction) {
                window.pushAction(window.createAddAction(log, 'student-absence-log', '/api/student-absence-logs', null));
              }
              // Remove student from session list
              sessionState.studentList = sessionState.studentList.filter(n => n !== name);
              delete sessionState.studentHoursDrafts[name];
              delete sessionState.studentGradeDrafts[name];
              delete sessionState.studentParticipationDrafts[name];
              delete sessionState.studentAbsenceDraftFlags[name];
              delete sessionState.studentDraftCarryFlags[name];
              if (sessionState.studentNoteDrafts) delete sessionState.studentNoteDrafts[name];

              // If any info is missing, try to fetch latest from students DB and update absence log
              if (!absenceData.phone || !absenceData.school || !absenceData.grade || !absenceData.classroom) {
                fetch('/api/students')
                  .then(res => res.json())
                  .then(students => {
                    const student = students.find(s => s.studentName === name);
                    if (student) {
                      fetch('/api/student-absence-logs/update-student', {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          studentName: name,
                          phone: student.phoneNumber,
                          school: student.schoolName,
                          grade: student.gradeLevel,
                          classroom: student.classroom
                        })
                      });
                    }
                  });
              }

              // Show notification above search bar
              let absentMsgArea = document.getElementById('absentStudentMsgArea');
              if (absentMsgArea) {
                absentMsgArea.innerHTML = `<div class=\"alert alert-success py-2 px-3 mb-2\">Student <b>${name}</b> added to absence logs.</div>`;
                setTimeout(() => { absentMsgArea.innerHTML = ''; }, 2500);
              }
              renderStudentListCards();
            })
            .catch(() => {
              // Optionally show an error message here
            });
          }
          renderStudentListCards();
        });
      });

      // Remove button
      // Remove button (always attach fresh handler)
      setTimeout(() => {
        const removeBtn = rowDiv.querySelector('.remove-student');
        if (removeBtn) {
          removeBtn.onclick = null;
          removeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            sessionState.studentList = sessionState.studentList.filter(n => n !== name);
            delete sessionState.studentHoursDrafts[name];
            delete sessionState.studentGradeDrafts[name];
            delete sessionState.studentParticipationDrafts[name];
            delete sessionState.studentAbsenceDraftFlags[name];
            delete sessionState.studentDraftCarryFlags[name];
            if (sessionState.studentNoteDrafts) delete sessionState.studentNoteDrafts[name];
            renderStudentListCards();
          });
        }
      }, 0);
    });
  }

  // Helper to escape HTML
  function escapeHtml(str) {
    return str.replace(/[&<>]/g, function(m) {
      if (m === '&') return '&amp;';
      if (m === '<') return '&lt;';
      if (m === '>') return '&gt;';
      return m;
    });
  }

  // Helper: find the subscription record for a student — matched to the
  // session's chosen subject, so a student subscribed in English shows their
  // real usage (or 'No subscription') when the session is for Math.
  function subscriptionFor(name) {
    return adm_sess_findSubjectSubscription(name, sessionState.sessionSubject);
  }

  // Extract the numeric price from a subscription price cell that may combine
  // text with a number (e.g. 'English class "700"' -> 700, 'still owes us 700'
  // -> 700). Uses the LAST number so statements like 'was 800 now 700' resolve
  // to the current price. Falls back to 0 when no number is present.
  function extractSubPrice(v) {
    if (typeof v === 'number' && !isNaN(v) && v > 0) return v;
    if (typeof v !== 'string') return 0;
    const n = Number(v);
    if (!isNaN(n) && n > 0) return n;
    const matches = v.replace(/,/g, '').match(/\d+(\.\d+)?/g);
    if (!matches || !matches.length) return 0;
    const last = Number(matches[matches.length - 1]);
    return (!isNaN(last) && last > 0) ? last : 0;
  }

  // Helper: parse a usage string like '5/6' or '2/unlimited' -> { used, total, isUnlimited }
  function parseSubscriptionUsage(usage) {
    if (usage === undefined || usage === null || usage === '') return null;
    const parts = String(usage).split('/');
    const totalStr = parts.length > 1 ? parts[1] : '';
    const isUnlimited = String(totalStr).toLowerCase() === 'unlimited' || String(usage).toLowerCase() === 'unlimited';
    let used = parseInt(parts[0], 10);
    if (isNaN(used) && isUnlimited) used = 0;
    if (isNaN(used)) return null;
    const total = isUnlimited ? Infinity : parseInt(totalStr, 10);
    if (isNaN(total)) return null;
    return { used, total, isUnlimited };
  }

  // True when this next session completes the subscription (e.g. usage is 5/6)
  function isLastSubscriptionSession(sub) {
    const p = sub ? parseSubscriptionUsage(sub.usage) : null;
    return !!p && !p.isUnlimited && p.total > 0 && p.used === p.total - 1;
  }

  // True when the subscription is already fully used (e.g. 6/6) — usage won't be counted
  function isSubscriptionComplete(sub) {
    const p = sub ? parseSubscriptionUsage(sub.usage) : null;
    return !!p && !p.isUnlimited && p.total > 0 && p.used >= p.total;
  }

  // Helper: subscription pill shown next to the student name (Project1 2.0 style)
  function subscriptionBadgeFor(name) {
    const sub = subscriptionFor(name);
    if (!sub) {
      return `<span class="sub-badge sub-badge-none"><i class="bi bi-exclamation-circle"></i>No subscription</span>`;
    }
    if (isLastSubscriptionSession(sub)) {
      return `<span class="sub-badge sub-badge-warn"><i class="bi bi-exclamation-triangle-fill"></i>${escapeHtml(sub.usage)} — LAST session before reset</span>`;
    }
    if (isSubscriptionComplete(sub)) {
      return `<span class="sub-badge sub-badge-done"><i class="bi bi-x-octagon-fill"></i>${escapeHtml(sub.usage)} — subscription complete</span>`;
    }
    const info = sessionState.subscriptionProgressByStudent[name] || `${sub.usage} (expires: ${sub.expirationDate})`;
    return `<span class="sub-badge sub-badge-ok"><i class="bi bi-check-circle-fill"></i>${escapeHtml(info)}</span>`;
  }

  // Helper: banner shown on the student card when this session completes the subscription
  function subscriptionNoticeFor(name) {
    const sub = subscriptionFor(name);
    if (!sub) return '';
    if (isLastSubscriptionSession(sub)) {
      return `<div class="sub-last-notice"><i class="bi bi-exclamation-triangle-fill"></i><span>This is <b>${escapeHtml(name)}</b>'s <b>last session</b> before the subscription ends (<b>${escapeHtml(sub.usage)}</b>) — remember to reset or extend it after saving.</span></div>`;
    }
    if (isSubscriptionComplete(sub)) {
      return `<div class="sub-done-notice"><i class="bi bi-x-octagon-fill"></i><span>Subscription already complete (<b>${escapeHtml(sub.usage)}</b>) — usage will <b>not</b> be counted for this session.</span></div>`;
    }
    return '';
  }

  // ---------- INIT: Fetch all dynamic data on load ----------
  window.addEventListener('DOMContentLoaded', () => {
    adm_sess_loadSubscriptionsAndMapToStudents();
    // Deselect everything and clear school name input on load
    sessionState.sessionGradeLevel = '';
    sessionState.sessionTimeSlots = [];
    sessionState.classroom = '';
    sessionState.tutoringType = '';
    sessionState.sessionSchoolName = '';
    const schoolNameInput = document.getElementById('schoolNameInput');
    if (schoolNameInput) schoolNameInput.value = '';

    // Fetch all dynamic data, then render all sections
    Promise.all([
      new Promise(res => { fetchGradesAndRender(); setTimeout(res, 100); }),
      new Promise(res => { fetchSubjectsAndRender(); setTimeout(res, 100); }),
      new Promise(res => { fetchTeachersAndRender(); setTimeout(res, 100); }),
      new Promise(res => { fetchStudentsAndRender(); setTimeout(res, 100); }),
      new Promise(res => { fetchClassroomsAndRender(); setTimeout(res, 100); })
    ]).then(() => {
      renderTypeChips();
      renderAll();
    });
  });
  // ---------- DATE PICKER (exactly as TSX) ----------

  // Modern date picker setup
  window.addEventListener('DOMContentLoaded', () => {
    // Replace the old date input with a styled button and hidden input
    const dateInput = document.getElementById('dateButton');
    if (dateInput) {
      // Hide the original input visually
      dateInput.type = 'date';
      dateInput.style.background = '#f8fafc';
      dateInput.style.border = '1.5px solid #cbd5e1';
      dateInput.style.borderRadius = '8px';
      dateInput.style.padding = '8px 16px';
      dateInput.style.fontSize = '1.1em';
      dateInput.style.width = '100%';
      dateInput.style.maxWidth = '260px';
      dateInput.style.boxShadow = '0 1px 2px rgba(0,0,0,0.03)';
      // Remove any min attribute to allow past dates
      dateInput.removeAttribute('min');
      dateInput.value = sessionState.sessionDate;
      dateInput.addEventListener('change', (e) => {
        sessionState.sessionDate = dateInput.value;
      });
    }
  });

  // ---------- EVENT HANDLERS ----------
  document.getElementById('schoolNameInput').addEventListener('input', (e) => sessionState.sessionSchoolName = e.target.value);
  document.getElementById('studentDraftInput').addEventListener('input', () => {});
  document.getElementById('addStudentTypedBtn').addEventListener('click', () => {
    const name = document.getElementById('studentDraftInput').value.trim();
    if (name && !sessionState.studentList.includes(name)) {
      sessionState.studentList.push(name);
      if (!sessionState.studentHoursDrafts[name]) sessionState.studentHoursDrafts[name] = 1;
      if (!sessionState.studentGradeDrafts[name]) sessionState.studentGradeDrafts[name] = 'Fair';
      if (!sessionState.studentParticipationDrafts[name]) sessionState.studentParticipationDrafts[name] = 'Moderate';
      sessionState.studentAbsenceDraftFlags[name] = false;
      sessionState.studentDraftCarryFlags[name] = false;
      document.getElementById('studentDraftInput').value = '';
      renderStudentListCards();
    } else if (name) alert('Student already added');
    else alert('Please enter a student name');
  });

  // Create new student (only name, update quick list immediately)
  document.getElementById('createStudentBtn').addEventListener('click', () => {
    const newName = document.getElementById('newStudentName').value.trim();
    const msgDiv = document.getElementById('newStudentMsg');
    const schoolName = document.getElementById('schoolNameInput') ? document.getElementById('schoolNameInput').value.trim() : '';
    const curriculum = document.getElementById('curriculumInput') ? document.getElementById('curriculumInput').value.trim() : '';
    const gradeLevel = document.getElementById('gradeLevelInput') ? document.getElementById('gradeLevelInput').value.trim() : '';
    const subjects = document.getElementById('subjectsInput') ? document.getElementById('subjectsInput').value.trim() : '';
    const attendance = document.getElementById('attendanceInput') ? document.getElementById('attendanceInput').value.trim() : '';
    const notes = document.getElementById('notesInput') ? document.getElementById('notesInput').value.trim() : '';
    const phoneNumber = document.getElementById('phoneNumberInput') ? document.getElementById('phoneNumberInput').value.trim() : '';
    const parentName = document.getElementById('parentNameInput') ? document.getElementById('parentNameInput').value.trim() : '';
    const parentPhone = document.getElementById('parentPhoneInput') ? document.getElementById('parentPhoneInput').value.trim() : '';

    if (!newName) {
      msgDiv.innerHTML = '<span class="error-text">Please enter a name</span>';
      return;
    }
    // Check for duplicate in studentOptions
    if (studentOptions.some(s => s.studentName === newName)) {
      msgDiv.innerHTML = '<span class="error-text">Student already exists</span>';
      return;
    }
    // Post to backend with all fields
    fetch('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentName: newName,
        schoolName,
        curriculum,
        gradeLevel,
        subjects,
        attendance,
        notes,
        phoneNumber,
        parentName,
        parentPhone
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.studentName) {
          // Add to studentOptions and re-render quick list
          studentOptions.push(data);
          // Register an undo action so the new student can be removed
          if (window.pushAction && window.createAddAction) {
            window.pushAction(window.createAddAction(data, 'student', '/api/students', () => fetchStudentsAndRender()));
          }
          renderQuickStudents();
          msgDiv.innerHTML = '<span class="success-text">Student created successfully!</span>';
          document.getElementById('newStudentName').value = '';
          setTimeout(() => msgDiv.innerHTML = '', 2000);
        } else {
          msgDiv.innerHTML = '<span class="error-text">Failed to create student</span>';
        }
      })
      .catch(() => {
        msgDiv.innerHTML = '<span class="error-text">Failed to create student</span>';
      });
  });

  // Save draft to localStorage
  document.getElementById('saveDraftBtn').addEventListener('click', () => {
    const draft = {
      teacherName: sessionState.teacherDisplayName,
      date: sessionState.sessionDate,
      schoolName: sessionState.sessionSchoolName,
      grade: sessionState.sessionGradeLevel,
      timeSlots: sessionState.sessionTimeSlots,
      subject: sessionState.sessionSubject,
      classroom: sessionState.classroom,
      tutoringType: sessionState.tutoringType,
      students: sessionState.studentList,
      hours: sessionState.studentHoursDrafts,
      grades: sessionState.studentGradeDrafts,
      participation: sessionState.studentParticipationDrafts,
      absentFlags: sessionState.studentAbsenceDraftFlags,
      draftFlags: sessionState.studentDraftCarryFlags,
      absenceNote: document.getElementById('absenceNote').value
    };
    localStorage.setItem('sessionFormDraft', JSON.stringify(draft));
    const statusDiv = document.getElementById('formStatusMsg');
    statusDiv.innerHTML = '<div class="alert alert-success">Draft saved locally ✓</div>';
    setTimeout(() => statusDiv.innerHTML = '', 2000);
  });

  // Open drafts (show alert with restore option)
  document.getElementById('openDraftsBtn').addEventListener('click', () => {
    const raw = localStorage.getItem('sessionFormDraft');
    if (!raw) {
      alert('No saved draft found.');
      return;
    }
    if (confirm('Restore last saved draft? Current data will be replaced.')) {
      try {
        const draft = JSON.parse(raw);
        sessionState.sessionDate = draft.date || sessionState.sessionDate;
        sessionState.sessionSchoolName = draft.schoolName || sessionState.sessionSchoolName;
        sessionState.sessionGradeLevel = draft.grade || sessionState.sessionGradeLevel;
        sessionState.sessionTimeSlots = draft.timeSlots || sessionState.sessionTimeSlots;
        sessionState.sessionSubject = draft.subject || sessionState.sessionSubject;
        sessionState.classroom = draft.classroom || sessionState.classroom;
        sessionState.tutoringType = draft.tutoringType || sessionState.tutoringType;
        sessionState.studentList = draft.students || [];
        sessionState.studentHoursDrafts = draft.hours || {};
        sessionState.studentGradeDrafts = draft.grades || {};
        sessionState.studentParticipationDrafts = draft.participation || {};
        sessionState.studentAbsenceDraftFlags = draft.absentFlags || {};
        sessionState.studentDraftCarryFlags = draft.draftFlags || {};
        document.getElementById('absenceNote').value = draft.absenceNote || '';
        dateButton.innerText = sessionState.sessionDate;
        renderAll();
        alert('Draft restored');
      } catch (e) { alert('Error restoring draft'); }
    }
  });

  // Submit attendance (simulate API)
  document.getElementById('submitAttendanceBtn').addEventListener('click', () => {
    if (sessionState.studentList.length === 0) {
      alert('Please add at least one student.');
      return;
    }
    console.log('Attendance submitted:', sessionState);
    alert(`Attendance saved for ${sessionState.studentList.length} students. (Demo)`);
  });

  // Mark Absence (collect absent students + note)
  document.getElementById('markAbsenceBtn').addEventListener('click', () => {
    const absentStudents = sessionState.studentList.filter(name => sessionState.studentAbsenceDraftFlags[name]);
    const note = document.getElementById('absenceNote').value;
    if (absentStudents.length === 0) {
      alert('No students marked as Absent. Use the "Absent" mode on student cards first.');
      return;
    }
    // Gather session info for each absent student and POST to absence logs
    const promises = absentStudents.map(name => {
      const found = (Array.isArray(studentOptions) ? studentOptions : []).find(s => s.studentName === name);
      const log = {
        name,
        phone: found ? found.phoneNumber : '',
        subject: sessionState.sessionSubject,
        date: sessionState.sessionDate,
        sessionHour: sessionState.sessionTimeSlots.join(' - '),
        hours: sessionState.studentHoursDrafts[name] ?? 1,
        teacherName: sessionState.teacherDisplayName,
        note: note || ''
      };
      return fetch('/api/student-absence-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(log)
      });
    });
    Promise.all(promises)
      .then(() => {
        alert(`Marked absence for: ${absentStudents.join(', ')}\nNote: ${note || 'No reason'}`);
      })
      .catch(() => {
        alert('Failed to log absences.');
      });
  });

  // Initialize UI
  dateButton.innerText = sessionState.sessionDate;
  renderAll();
  // (TypeScript conversion shim: original global name kept available for
  // co-loaded scripts and inline HTML handlers — same lookup as before)
  if (typeof adm_sess_findSubjectSubscription !== 'undefined') { window.findSubjectSubscription = adm_sess_findSubjectSubscription; }
  if (typeof adm_sess_loadSubscriptionsAndMapToStudents !== 'undefined') { window.loadSubscriptionsAndMapToStudents = adm_sess_loadSubscriptionsAndMapToStudents; }
})();
