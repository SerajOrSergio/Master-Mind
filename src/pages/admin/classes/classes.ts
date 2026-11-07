// Classes Page JS: Handles UI and API for reservations
// The classroom list, teacher list and saved reservations are loaded from the
// server APIs so the page always matches the data managed elsewhere.

let classrooms = [];
let selectedClassroom = null;
let selectedTimeWindow = null;

const TIME_WINDOWS = [
  '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
  '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM', '11:00 PM', '12:00 AM'
];

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load ${url}`);
  return res.json();
}

// Minimal HTML escaping for values rendered into the reservations table
function esc(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ---------- Classroom quick-select tabs (loaded from /api/classes) ----------
// classes.json holds the class definitions (entries with classroom_name) plus
// any reservations saved on top, so we pick out just the definitions here.
async function loadClassrooms() {
  try {
    const entries = await fetchJSON('/api/classes');
    classrooms = (Array.isArray(entries) ? entries : []).filter(c => c && c.classroom_name);
  } catch (err) {
    classrooms = [];
  }
  renderClassroomTabs();
}

function renderClassroomTabs() {
  const container = document.getElementById('classroomContainer');
  if (!container) return;
  if (!classrooms.length) {
    container.innerHTML = '<span class="text-muted">No classrooms configured. Add them in Settings → Manage Classrooms.</span>';
    return;
  }
  container.innerHTML = classrooms.map(c => `
    <span class="choice-chip${selectedClassroom === c.classroom_name ? ' choice-chip-active' : ''}" data-room="${esc(c.classroom_name)}">
      <span class="classroom-color-dot" style="background:${esc(c.color)};border-color:${esc(c.color)}"></span>
      ${esc(c.classroom_name)}
    </span>
  `).join('');
  container.querySelectorAll('.choice-chip').forEach(el => {
    el.addEventListener('click', () => {
      selectedClassroom = el.getAttribute('data-room');
      renderClassroomTabs();
    });
  });
}

// ---------- Teacher select (loaded from /api/teachers) ----------
async function loadTeachers() {
  const select = document.getElementById('teacherName');
  if (!select) return;
  let teachers = [];
  try {
    teachers = await fetchJSON('/api/teachers');
  } catch (err) {
    teachers = [];
  }
  select.innerHTML = '<option value="">Select...</option>' + teachers.map(t => {
    const fullName = `${esc(t.firstName)} ${esc(t.lastName)}`;
    return `<option value="${fullName}">${fullName}</option>`;
  }).join('');
}

// ---------- Time window pills ----------
function renderTimeSlots() {
  const container = document.getElementById('timeSlotsContainer');
  const hidden = document.getElementById('timeWindow');
  if (!container || !hidden) return;
  container.innerHTML = TIME_WINDOWS.map(t =>
    `<button type="button" class="pill-btn${selectedTimeWindow === t ? ' selected' : ''}" data-time="${t}">${t}</button>`
  ).join(' ');
  container.querySelectorAll('.pill-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedTimeWindow = btn.getAttribute('data-time');
      hidden.value = selectedTimeWindow;
      renderTimeSlots();
    });
  });
}

// ---------- Saved reservations list ----------
async function loadReservations() {
  const list = document.getElementById('reservationsList');
  if (!list) return;
  try {
    const entries = await fetchJSON('/api/classes');
    // Class definitions have classroom_name; real reservations do not.
    const reservations = (Array.isArray(entries) ? entries : []).filter(r => r && !r.classroom_name);
    renderReservations(reservations);
  } catch (err) {
    list.innerHTML = '<div class="alert alert-danger mb-0">Failed to load reservations.</div>';
  }
}

function renderReservations(reservations) {
  const list = document.getElementById('reservationsList');
  if (!list) return;
  if (!Array.isArray(reservations) || reservations.length === 0) {
    list.innerHTML = '<p class="text-muted mb-0">No reservations yet.</p>';
    return;
  }
  const rows = reservations.map((r, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${esc(r.teacher)}</td>
      <td>${esc(r.classroom)}</td>
      <td>${esc(r.classType)}</td>
      <td>${esc(r.timeWindow)}</td>
    </tr>
  `).join('');
  list.innerHTML = `
    <div class="table-responsive">
      <table class="table table-bordered align-middle mb-0">
        <thead>
          <tr><th>#</th><th>Teacher</th><th>Classroom</th><th>Type</th><th>Time</th></tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

// ---------- Submit a reservation ----------
async function handleReservation() {
  const status = document.getElementById('reserve-status');
  const teacher = document.getElementById('teacherName').value;
  const classTypeEl = document.querySelector('input[name="classType"]:checked');
  const classType = classTypeEl ? classTypeEl.value : '';
  const timeWindow = document.getElementById('timeWindow').value;

  if (!selectedClassroom || !teacher || !classType || !timeWindow) {
    if (status) status.innerHTML = '<span class="text-danger">Please fill all fields and select a classroom.</span>';
    return;
  }

  const reservation = { classroom: selectedClassroom, teacher, subject: '', classType, timeWindow };
  try {
    const res = await fetch('/api/classes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reservation)
    });
    if (res.ok) {
      if (status) status.innerHTML = '<span class="text-success">Reservation saved successfully!</span>';
      document.getElementById('reserve-form').reset();
      selectedClassroom = null;
      selectedTimeWindow = null;
      renderClassroomTabs();
      renderTimeSlots();
      loadReservations();
    } else {
      if (status) status.innerHTML = '<span class="text-danger">Reservation failed. Please try again.</span>';
    }
  } catch (err) {
    if (status) status.innerHTML = '<span class="text-danger">Reservation failed. Is the server running?</span>';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderTimeSlots();
  loadClassrooms();
  loadTeachers();
  loadReservations();

  const form = document.getElementById('reserve-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      handleReservation();
    });
  }
});
