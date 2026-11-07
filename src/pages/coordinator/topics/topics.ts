// coordinator/topics.js

document.addEventListener('DOMContentLoaded', async () => {
  await renderForm();
  await renderTopicsList();
});

async function fetchData(url) {
  const res = await fetch(url);
  return res.json();
}

async function renderForm() {
  const teachers = await fetchData('/api/teachers');
  const students = await fetchData('/api/students');
  const subjects = await fetchData('/api/subjects');
  const formSection = document.getElementById('topics-form-section');
  formSection.innerHTML = `
    <form id="topicAssignForm" class="row g-3 align-items-end">
      <div class="col-md-3">
        <label class="form-label">Teacher</label>
        <select class="form-select" id="teacher-select" name="teacher" required>
          <option value="">Select...</option>
          ${teachers.map(t => `<option value="${t.firstName} ${t.lastName}">${t.firstName} ${t.lastName}</option>`).join('')}
        </select>
      </div>
      <div class="col-md-3">
        <label class="form-label">Student</label>
        <select class="form-select" id="student-select" name="student" required>
          <option value="">Select...</option>
          ${students.map(s => `<option value="${s.studentName}">${s.studentName}</option>`).join('')}
        </select>
      </div>
      <div class="col-md-2">
        <label class="form-label">Subject</label>
        <select class="form-select" id="subject-select" name="subject" required>
          <option value="">Select...</option>
          ${subjects.map(s => `<option value="${s.name}">${s.name}</option>`).join('')}
        </select>
      </div>
      <div class="col-md-2">
        <label class="form-label">Chapter</label>
        <input type="text" class="form-control" name="chapter" required>
      </div>
      <div class="col-md-2">
        <label class="form-label">Notes</label>
        <input type="text" class="form-control" name="notes">
      </div>
      <div class="col-md-2">
        <label class="form-label">Date</label>
        <input type="date" class="form-control" name="date" placeholder="mm/dd/yyyy" required>
      </div>
      <div class="col-md-2">
        <label class="form-label">Time</label>
        <input type="time" class="form-control" name="time" placeholder="--:-- --" required>
      </div>
      <div class="col-md-2">
        <button type="submit" class="btn btn-primary">Assign</button>
      </div>
    </form>
    <div id="topicAssignMsg" class="mt-2"></div>
  `;

  // Initialize Choices.js for searchable dropdowns with clearable option
  if (window.Choices) {
    const choicesOptions = {
      searchEnabled: true,
      itemSelectText: '',
      shouldSort: false,
      removeItemButton: true,
      allowHTML: false,
      placeholder: true,
      placeholderValue: 'Select...',
      position: 'bottom'
    };
    new Choices('#teacher-select', choicesOptions);
    new Choices('#student-select', choicesOptions);
    new Choices('#subject-select', choicesOptions);
  }
  document.getElementById('topicAssignForm').onsubmit = async (e) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = Object.fromEntries(new FormData(form));
    data.status = 'Pending';
    const res = await fetch('/api/topics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (res.ok) {
      document.getElementById('topicAssignMsg').innerHTML = '<span class="text-success">Topic assigned.</span>';
      form.reset();
      await renderTopicsList();
    } else {
      document.getElementById('topicAssignMsg').innerHTML = '<span class="text-danger">Failed to assign topic.</span>';
    }
  };
}

async function renderTopicsList() {
  const topics = await fetchData('/api/topics');
  // Fetch teachers and students for phone numbers
  const teachers = await fetchData('/api/teachers');
  const students = await fetchData('/api/students');
  const getTeacherPhone = (name) => {
    const [first, ...rest] = name.split(' ');
    const last = rest.join(' ');
    const t = teachers.find(t => t.firstName === first && t.lastName === last);
    return t ? t.phoneNumber : '';
  };
  const getStudentPhone = (name) => {
    const s = students.find(s => s.studentName === name);
    return s ? s.phoneNumber : '';
  };
  const listSection = document.getElementById('topics-list-section');
  if (!topics.length) {
    listSection.innerHTML = '<div>No topics assigned yet.</div>';
    return;
  }
  let html = '<h5>Progress by student and subject</h5>';
  html += '<div class="table-responsive"><table class="table table-bordered"><thead><tr>' +
    '<th>#</th><th>Teacher</th><th>Student</th><th>Subject</th><th>Chapter</th><th>Notes</th><th>Date</th><th>Time</th><th>Status</th><th>Actions</th>' +
    '</tr></thead><tbody>';
  topics.forEach((topic, idx) => {
    const teacherPhone = getTeacherPhone(topic.teacher);
    const studentPhone = getStudentPhone(topic.student);
    html += `<tr data-id="${topic.id}">
      <td>${idx + 1}</td>
      <td class="editable" data-field="teacher">${topic.teacher}<br><span class="text-muted small">${teacherPhone}</span></td>
      <td class="editable" data-field="student">${topic.student}<br><span class="text-muted small">${studentPhone}</span></td>
      <td class="editable" data-field="subject">${topic.subject}</td>
      <td class="editable" data-field="chapter">${topic.chapter}</td>
      <td class="editable" data-field="notes">${topic.notes || ''}</td>
      <td class="editable" data-field="date">${topic.date}</td>
      <td class="editable" data-field="time">${topic.time}</td>
      <td class="editable" data-field="status">${topic.status}</td>
      <td>
        <button class="btn btn-${topic.status === 'Done' ? 'warning' : 'success'} btn-sm" onclick="markDone(${topic.id})">${topic.status === 'Done' ? 'Undo' : 'Done'}</button>
        <button class="btn btn-danger btn-sm" onclick="deleteTopic(${topic.id})">Delete</button>
      </td>
    </tr>`;
  });
  html += '</tbody></table></div>';
  listSection.innerHTML = html;

  // Inline editing logic
  listSection.querySelectorAll('.editable').forEach(cell => {
    cell.addEventListener('mouseenter', function() {
      this.classList.add('table-warning');
    });
    cell.addEventListener('mouseleave', function() {
      this.classList.remove('table-warning');
    });
    cell.addEventListener('click', async function(e) {
      if (cell.querySelector('input,select')) return;
      const tr = cell.closest('tr');
      const id = tr.getAttribute('data-id');
      const field = cell.getAttribute('data-field');
      let value = cell.innerText.split('\n')[0].trim();
      let input;
      if (field === 'teacher') {
        const teachers = await fetchData('/api/teachers');
        input = document.createElement('select');
        input.className = 'form-select form-select-sm';
        teachers.forEach(t => {
          const opt = document.createElement('option');
          opt.value = t.firstName + ' ' + t.lastName;
          opt.textContent = t.firstName + ' ' + t.lastName;
          if (opt.value === value) opt.selected = true;
          input.appendChild(opt);
        });
      } else if (field === 'student') {
        const students = await fetchData('/api/students');
        input = document.createElement('select');
        input.className = 'form-select form-select-sm';
        students.forEach(s => {
          const opt = document.createElement('option');
          opt.value = s.studentName;
          opt.textContent = s.studentName;
          if (opt.value === value) opt.selected = true;
          input.appendChild(opt);
        });
      } else if (field === 'subject') {
        const subjects = await fetchData('/api/subjects');
        input = document.createElement('select');
        input.className = 'form-select form-select-sm';
        subjects.forEach(s => {
          const opt = document.createElement('option');
          opt.value = s.name;
          opt.textContent = s.name;
          if (opt.value === value) opt.selected = true;
          input.appendChild(opt);
        });
      } else if (field === 'date') {
        input = document.createElement('input');
        input.type = 'date';
        input.value = value;
        input.placeholder = 'mm/dd/yyyy';
        input.required = true;
        input.className = 'form-control form-control-sm';
      } else if (field === 'time') {
        input = document.createElement('input');
        input.type = 'time';
        input.value = value;
        input.placeholder = '--:-- --';
        input.required = true;
        input.className = 'form-control form-control-sm';
      } else if (field === 'status') {
        input = document.createElement('select');
        input.className = 'form-select form-select-sm';
        ['Pending', 'Done'].forEach(status => {
          const opt = document.createElement('option');
          opt.value = status;
          opt.textContent = status;
          if (status === value) opt.selected = true;
          input.appendChild(opt);
        });
      } else {
        input = document.createElement('input');
        input.type = 'text';
        input.value = value;
        input.className = 'form-control form-control-sm';
      }
      cell.innerHTML = '';
      cell.appendChild(input);
      input.focus();
      const saveEdit = async () => {
        const newValue = input.value;
        const res = await fetch(`/api/topics/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ [field]: newValue })
        });
        if (res.ok) {
          await renderTopicsList();
        } else {
          cell.innerHTML = value;
          alert('Failed to update');
        }
      };
      input.addEventListener('blur', saveEdit);
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          input.blur();
        }
      });
    });
  });
}

window.markDone = async function(id) {
  const res = await fetch(`/api/topics/${id}/toggle-status`, { method: 'POST' });
  if (res.ok) {
    await renderTopicsList();
  } else {
    alert('Failed to update status');
  }
};

window.deleteTopic = async function(id) {
  if (!confirm('Delete this topic?')) return;
  const res = await fetch(`/api/topics/${id}`, { method: 'DELETE' });
  if (res.ok) {
    await renderTopicsList();
  } else {
    alert('Failed to delete');
  }
};
