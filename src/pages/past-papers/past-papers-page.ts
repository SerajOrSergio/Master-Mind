// Past Papers page logic — ONE implementation for both portals.
// The admin and receptionist pages only supply their own HTML template,
// stylesheet and sidebar URL; everything below (student picker, file uploads,
// table with inline editing, undo) is identical for both.
import { pushAction, createDeleteAction, createEditAction, createAddAction } from '/assist/undo-manager.js';

const API = '/api/past-papers';

export interface PastPapersPageOptions {
  sidebarUrl: string;
}

interface PastPaperFile {
  name: string;
  storedName: string;
  size: number;
  addedAt?: string;
}

interface PastPaperEntry {
  id: number;
  studentId?: number | null;
  studentName?: string;
  phoneNumber?: string;
  emailAddress?: string;
  curriculum?: string;
  gradeLevel?: string;
  price?: number | null;
  amountDue?: number | null;
  paidAmount?: number | null;
  files?: PastPaperFile[];
}

let allStudents: any[] = [];
let selectedGrade = '';
let pendingFiles: File[] = [];
let currentFilter = '';
let currentEntries: PastPaperEntry[] = [];
let gradesCache: any[] | null = null;

function numOrNull(value: string | number | null | undefined): number | null {
  const raw = String(value === undefined || value === null ? '' : value).trim();
  if (raw === '') return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

function money(value: number | null | undefined): string {
  if (value === null || value === undefined) return '';
  return String(value);
}

function prettySize(n: number): string {
  if (!n && n !== 0) return '';
  return n >= 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`;
}

function escapeHtml(value: any): string {
  return String(value === undefined || value === null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function setupPastPapersPage(options: PastPapersPageOptions): void {
  const input = (id: string) => document.getElementById(id) as HTMLInputElement | null;
  const setValue = (id: string, value: string) => {
    const el = input(id);
    if (el) el.value = value;
  };

  // ---------- Sidebar ----------
  fetch(options.sidebarUrl)
    .then(res => (res.ok ? res.text() : ''))
    .then(html => {
      if (!html) return;
      const el = document.getElementById('sidebar-container') || document.getElementById('sidebar');
      if (el && !el.innerHTML.trim()) el.innerHTML = html;
    })
    .catch(() => {});

  // ---------- Grade pills ----------
  async function getGrades(): Promise<any[]> {
    if (gradesCache) return gradesCache;
    try {
      gradesCache = await (await fetch('/database/grades.json')).json();
    } catch {
      gradesCache = [];
    }
    return gradesCache as any[];
  }

  getGrades().then(grades => {
    const container = document.getElementById('gradesContainer');
    if (!container) return;
    container.innerHTML = '';
    grades.forEach((grade: any) => {
      const name = typeof grade === 'string' ? grade : (grade && grade.name) || '';
      if (!name) return;
      const pill = document.createElement('div');
      pill.className = 'grade-pill';
      pill.textContent = name;
      pill.dataset.grade = name;
      pill.onclick = () => {
        if (pill.classList.contains('selected')) {
          pill.classList.remove('selected');
          selectedGrade = '';
          return;
        }
        container.querySelectorAll('.grade-pill').forEach((p: any) => p.classList.remove('selected'));
        pill.classList.add('selected');
        selectedGrade = name;
      };
      container.appendChild(pill);
    });
  });

  // ---------- Students + searchable picker ----------
  fetch('/api/students')
    .then(res => res.json())
    .then(students => { allStudents = Array.isArray(students) ? students : []; })
    .catch(() => {});

  const pickerInput = input('studentSearch');
  const pickerList = document.getElementById('studentPickerList');
  const pickerClear = document.getElementById('studentPickerClear');

  function renderPickerList(filter: string) {
    if (!pickerList) return;
    const val = String(filter || '').trim().toLowerCase();
    pickerList.innerHTML = '';
    const sorted = allStudents
      .filter(s => s && s.studentName)
      .sort((a, b) => String(a.studentName).localeCompare(String(b.studentName)));
    let shown = 0;
    sorted.forEach(s => {
      if (val && !String(s.studentName).toLowerCase().includes(val)) return;
      shown++;
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'student-picker-item';
      item.textContent = s.studentName;
      item.title = [s.phoneNumber, s.gradeLevel].filter(Boolean).join(' · ');
      item.onclick = () => selectStudent(s);
      pickerList.appendChild(item);
    });
    if (shown === 0) {
      const none = document.createElement('div');
      none.className = 'student-picker-empty text-muted small';
      none.textContent = 'No students match your search.';
      pickerList.appendChild(none);
    }
    pickerList.classList.remove('d-none');
  }

  function selectStudent(s: any) {
    setValue('studentId', String(s.id));
    if (pickerInput) {
      pickerInput.value = s.studentName || '';
      pickerInput.readOnly = true;
    }
    pickerClear?.classList.remove('d-none');
    // Auto-fill what the students database already knows
    setValue('phoneNumber', s.phoneNumber || '');
    setValue('emailAddress', s.email || '');
    setValue('curriculum', s.curriculum || '');
    selectedGrade = s.gradeLevel || '';
    document.querySelectorAll('#gradesContainer .grade-pill').forEach((p: any) => {
      p.classList.toggle('selected', p.dataset.grade === selectedGrade);
    });
    pickerList?.classList.add('d-none');
    // Money is typed by hand — go straight to the price
    input('price')?.focus();
  }

  function clearStudentSelection() {
    setValue('studentId', '');
    if (pickerInput) {
      pickerInput.value = '';
      pickerInput.readOnly = false;
      pickerInput.focus();
    }
    pickerClear?.classList.add('d-none');
    setValue('phoneNumber', '');
    setValue('emailAddress', '');
    setValue('curriculum', '');
    selectedGrade = '';
    document.querySelectorAll('#gradesContainer .grade-pill').forEach(p => p.classList.remove('selected'));
  }

  if (pickerInput) {
    pickerInput.addEventListener('input', () => renderPickerList(pickerInput.value));
    pickerInput.addEventListener('focus', () => renderPickerList(pickerInput.value));
    pickerInput.addEventListener('click', () => renderPickerList(pickerInput.value));
  }
  pickerClear?.addEventListener('click', clearStudentSelection);
  document.addEventListener('mousedown', e => {
    if (!pickerList || !pickerInput) return;
    if (!pickerList.contains(e.target as Node) && e.target !== pickerInput) pickerList.classList.add('d-none');
  });

  // ---------- Queued files (picked, not uploaded yet) ----------
  function renderPendingFiles() {
    const container = document.getElementById('pendingFiles');
    if (!container) return;
    container.innerHTML = '';
    pendingFiles.forEach((f, i) => {
      const chip = document.createElement('span');
      chip.className = 'paper-chip';
      const label = document.createElement('span');
      label.textContent = `${f.name} (${prettySize(f.size)})`;
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'paper-chip-remove';
      remove.innerHTML = '&times;';
      remove.title = 'Remove this file';
      remove.onclick = () => {
        pendingFiles.splice(i, 1);
        renderPendingFiles();
      };
      chip.appendChild(label);
      chip.appendChild(remove);
      container.appendChild(chip);
    });
  }

  const fileInput = input('paperFiles');
  fileInput?.addEventListener('change', function () {
    if (!this.files) return;
    for (const f of Array.from(this.files)) {
      if (!pendingFiles.some(p => p.name === f.name && p.size === f.size)) pendingFiles.push(f);
    }
    this.value = '';
    renderPendingFiles();
  });

  // ---------- Create entry ----------
  const form = document.getElementById('pastPapersForm') as HTMLFormElement | null;
  form?.addEventListener('submit', async e => {
    e.preventDefault();
    const studentId = input('studentId')?.value || '';
    if (!studentId) {
      alert('Please select a student.');
      return;
    }
    const entry = {
      studentId: Number(studentId),
      studentName: (pickerInput?.value || '').trim(),
      phoneNumber: (input('phoneNumber')?.value || '').trim(),
      emailAddress: (input('emailAddress')?.value || '').trim(),
      curriculum: (input('curriculum')?.value || '').trim(),
      gradeLevel: selectedGrade,
      price: numOrNull(input('price')?.value),
      amountDue: numOrNull(input('amountDue')?.value),
      paidAmount: numOrNull(input('paidAmount')?.value)
    };
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry)
    });
    if (!res.ok) {
      let msg = 'Failed to add past paper.';
      try {
        const err = await res.json();
        if (err && err.error) msg += '\n' + err.error;
        if (err && err.details) msg += '\n' + err.details;
      } catch { /* not JSON */ }
      alert(msg);
      return;
    }
    const created = await res.json().catch(() => null);
    if (created && created.id) {
      pushAction(createAddAction(created, 'past-paper', API, async () => { loadEntries(); }));
    }
    // Upload the queued paper files to the new entry, one by one
    if (created && created.id) {
      for (const f of pendingFiles) {
        const fd = new FormData();
        fd.append('files', f, f.name);
        const upRes = await fetch(`${API}/${created.id}/files`, { method: 'POST', body: fd });
        if (!upRes.ok) alert(`Failed to upload file "${f.name}".`);
      }
    }
    // Reset the form for the next entry
    pendingFiles = [];
    renderPendingFiles();
    form.reset();
    setValue('studentId', '');
    if (pickerInput) {
      pickerInput.value = '';
      pickerInput.readOnly = false;
    }
    pickerClear?.classList.add('d-none');
    setValue('phoneNumber', '');
    setValue('curriculum', '');
    selectedGrade = '';
    document.querySelectorAll('#gradesContainer .grade-pill').forEach(p => p.classList.remove('selected'));
    loadEntries();
  });

  // ---------- Table ----------
  async function loadEntries() {
    const res = await fetch(API);
    const data = res.ok ? await res.json() : [];
    currentEntries = Array.isArray(data) ? data : [];
    renderTable();
  }

  function matchesFilter(entry: PastPaperEntry, filter: string): boolean {
    if (!filter) return true;
    const hay = [
      entry.studentName,
      entry.phoneNumber,
      entry.emailAddress,
      entry.curriculum,
      entry.gradeLevel,
      money(entry.price),
      money(entry.amountDue),
      money(entry.paidAmount),
      ...(entry.files || []).map(f => f.name)
    ].join(' ').toLowerCase();
    return hay.includes(filter);
  }

  function renderTable() {
    const container = document.getElementById('pastPapersTableContainer');
    if (!container) return;
    container.innerHTML = '';
    const entries = [...currentEntries]
      .sort((a, b) => a.id - b.id)
      .filter(m => matchesFilter(m, currentFilter));
    if (entries.length === 0) {
      container.innerHTML = `<div class="pp-empty">
        <i class="bi bi-inbox"></i>
        <p>${currentFilter ? 'No past papers match your search.' : 'No past papers yet — add one from the form above.'}</p>
      </div>`;
      return;
    }
    const table = document.createElement('table');
    table.className = 'table table-bordered align-middle';
    table.innerHTML = `<thead><tr>
      <th>#</th><th>Student Name</th><th>Phone Number</th><th>Email</th><th>Curriculum</th><th>Grade</th>
      <th class="pp-num">Price</th><th class="pp-num">Amount Due</th><th class="pp-num">Paid</th><th>Past Paper Files</th><th>Actions</th>
    </tr></thead><tbody></tbody>`;
    entries.forEach((m, i) => {
      const tr = document.createElement('tr');
      const files = m.files || [];
      const fileNames = files.map(f => f.name).join(', ');
      const fileCell = files.length
        ? `<span class="pp-file-badge"><i class="bi bi-paperclip"></i>${files.length} file${files.length === 1 ? '' : 's'}</span>`
        : '<span class="pp-file-empty"><i class="bi bi-plus-lg"></i>Add files</span>';
      const moneyCell = (value: number | null | undefined) =>
        money(value) || '<span class="pp-none">—</span>';
      tr.innerHTML = `
        <td>${i + 1}</td>
        <td class="editable pp-student" data-field="studentName" data-id="${m.id}" data-value="${escapeHtml(m.studentName)}">${escapeHtml(m.studentName)}</td>
        <td class="editable" data-field="phoneNumber" data-id="${m.id}" data-value="${escapeHtml(m.phoneNumber)}">${escapeHtml(m.phoneNumber) || '<span class="pp-none">—</span>'}</td>
        <td class="editable" data-field="emailAddress" data-id="${m.id}" data-value="${escapeHtml(m.emailAddress)}">${escapeHtml(m.emailAddress) || '<span class="pp-none">—</span>'}</td>
        <td class="editable" data-field="curriculum" data-id="${m.id}" data-value="${escapeHtml(m.curriculum)}">${escapeHtml(m.curriculum)}</td>
        <td class="editable" data-field="gradeLevel" data-id="${m.id}">${escapeHtml(m.gradeLevel) || '<span class="pp-none">—</span>'}</td>
        <td class="editable money" data-field="price" data-id="${m.id}" data-value="${money(m.price)}">${moneyCell(m.price)}</td>
        <td class="editable money" data-field="amountDue" data-id="${m.id}" data-value="${money(m.amountDue)}">${moneyCell(m.amountDue)}</td>
        <td class="editable money" data-field="paidAmount" data-id="${m.id}" data-value="${money(m.paidAmount)}">${moneyCell(m.paidAmount)}</td>
        <td class="editable" data-field="files" data-id="${m.id}" title="${files.length ? escapeHtml(fileNames) : 'Click to add past paper files'}">${fileCell}</td>
        <td class="table-actions">
          <button type="button" class="btn btn-sm action-btn action-delete pp-delete-btn" data-id="${m.id}" title="Delete this entry">
            <i class="bi bi-trash me-1"></i>Delete
          </button>
        </td>
      `;
      table.querySelector('tbody').appendChild(tr);
    });
    container.appendChild(table);

    table.querySelectorAll('.editable').forEach((cell: any) => {
      cell.addEventListener('click', () => {
        if (cell.dataset.editing === '1') return;
        const field = cell.dataset.field;
        const id = cell.dataset.id;
        if (field === 'files') { openFilesPopup(cell, id); return; }
        if (field === 'gradeLevel') { openGradeEditor(cell, id); return; }
        openFieldEditor(cell, id, field);
      });
    });
    table.querySelectorAll('.pp-delete-btn').forEach((btn: any) => {
      btn.addEventListener('click', () => deleteEntry(btn.dataset.id));
    });
  }

  // Text / number inline editor
  async function openFieldEditor(cell: HTMLElement, id: string, field: string) {
    cell.dataset.editing = '1';
    const isMoney = field === 'price' || field === 'amountDue' || field === 'paidAmount';
    const oldValue = (cell.dataset.value ?? cell.textContent).trim();
    const editor = document.createElement('input');
    editor.className = 'form-control';
    editor.style.minWidth = isMoney ? '80px' : '110px';
    if (isMoney) {
      editor.type = 'number';
      editor.min = '0';
      editor.step = '0.01';
    } else {
      editor.type = 'text';
    }
    editor.value = oldValue;
    cell.textContent = '';
    cell.appendChild(editor);
    editor.focus();
    let finished = false;
    const finish = async (save: boolean) => {
      if (finished) return;
      finished = true;
      delete cell.dataset.editing;
      const raw = editor.value.trim();
      if (!save || raw === oldValue) {
        loadEntries();
        return;
      }
      const value: any = isMoney ? numOrNull(raw) : raw;
      const oldRes = await fetch(`${API}/${id}`);
      const oldEntry = oldRes.ok ? await oldRes.json() : null;
      const res = await fetch(`${API}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value })
      });
      if (!res.ok) {
        alert('Failed to update.');
        loadEntries();
        return;
      }
      if (oldEntry) {
        pushAction(createEditAction(oldEntry, { ...oldEntry, [field]: value }, 'past-paper', API, async () => { loadEntries(); }));
      }
      loadEntries();
    };
    editor.addEventListener('blur', () => { finish(true); });
    editor.addEventListener('keydown', ev => {
      if (ev.key === 'Enter') editor.blur();
      if (ev.key === 'Escape') finish(false);
    });
  }

  // Grade cell editor (single-select pills)
  async function openGradeEditor(cell: HTMLElement, id: string) {
    cell.dataset.editing = '1';
    const grades = await getGrades();
    const oldValue = (cell.dataset.value ?? cell.textContent).trim();
    const container = document.createElement('div');
    container.className = 'grades-edit-container';
    let closed = false;
    const close = () => {
      if (closed) return;
      closed = true;
      delete cell.dataset.editing;
      loadEntries();
    };
    grades.forEach((grade: any) => {
      const name = typeof grade === 'string' ? grade : (grade && grade.name) || '';
      if (!name) return;
      const pill = document.createElement('div');
      pill.className = 'grade-pill';
      pill.textContent = name;
      pill.dataset.grade = name;
      if (name === oldValue) pill.classList.add('selected');
      pill.onclick = async () => {
        const newVal = pill.classList.contains('selected') ? '' : name;
        const oldRes = await fetch(`${API}/${id}`);
        const oldEntry = oldRes.ok ? await oldRes.json() : null;
        const res = await fetch(`${API}/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ gradeLevel: newVal })
        });
        if (!res.ok) {
          alert('Failed to update.');
          close();
          return;
        }
        if (oldEntry) {
          pushAction(createEditAction(oldEntry, { ...oldEntry, gradeLevel: newVal }, 'past-paper', API, async () => { loadEntries(); }));
        }
        close();
      };
      container.appendChild(pill);
    });
    cell.textContent = '';
    cell.appendChild(container);
    const closeOnOutside = (event: MouseEvent) => {
      if (!container.contains(event.target as Node) && event.target !== cell) {
        document.removeEventListener('mousedown', closeOnOutside);
        close();
      }
    };
    setTimeout(() => document.addEventListener('mousedown', closeOnOutside), 0);
  }

  // Files popup: download / remove existing papers, add new ones
  async function openFilesPopup(cell: HTMLElement, id: string) {
    cell.dataset.editing = '1';
    const res = await fetch(`${API}/${id}`);
    if (!res.ok) {
      alert('Failed to load entry.');
      delete cell.dataset.editing;
      return;
    }
    const entry: PastPaperEntry = await res.json();
    const files = entry.files || [];
    const container = document.createElement('div');
    container.className = 'files-edit-container';
    let closed = false;
    const close = () => {
      if (closed) return;
      closed = true;
      delete cell.dataset.editing;
      loadEntries();
    };

    if (!files.length) {
      const none = document.createElement('div');
      none.className = 'text-muted small';
      none.textContent = 'No past paper files yet.';
      container.appendChild(none);
    }
    files.forEach((f, index) => {
      const row = document.createElement('div');
      row.className = 'paper-file-row';
      const link = document.createElement('a');
      link.className = 'paper-file-link';
      link.href = `${API}/${id}/files/${index}/download`;
      link.textContent = f.name;
      link.title = 'Open / download this file';
      link.setAttribute('download', f.name);
      const size = document.createElement('span');
      size.className = 'paper-file-size text-muted';
      size.textContent = `(${prettySize(f.size)})`;
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'paper-file-remove';
      remove.innerHTML = '&times;';
      remove.title = 'Remove this file';
      remove.onclick = async () => {
        if (!confirm(`Remove file "${f.name}"?`)) return;
        const delRes = await fetch(`${API}/${id}/files/${index}`, { method: 'DELETE' });
        if (!delRes.ok) {
          alert('Failed to remove file.');
          close();
          return;
        }
        close();
      };
      row.appendChild(link);
      row.appendChild(size);
      row.appendChild(remove);
      container.appendChild(row);
    });

    const addRow = document.createElement('div');
    addRow.className = 'mt-2';
    const addBtn = document.createElement('button');
    addBtn.type = 'button';
    addBtn.className = 'btn btn-sm action-btn action-add';
    addBtn.innerHTML = '<i class="bi bi-plus-lg me-1"></i>Add files';
    const pick = document.createElement('input');
    pick.type = 'file';
    pick.multiple = true;
    pick.style.display = 'none';
    pick.addEventListener('change', async function () {
      if (!this.files || this.files.length === 0) return;
      for (const f of Array.from(this.files)) {
        const fd = new FormData();
        fd.append('files', f, f.name);
        const upRes = await fetch(`${API}/${id}/files`, { method: 'POST', body: fd });
        if (!upRes.ok) alert(`Failed to upload file "${f.name}".`);
      }
      close();
    });
    addBtn.onclick = () => pick.click();
    addRow.appendChild(addBtn);
    addRow.appendChild(pick);
    container.appendChild(addRow);

    cell.textContent = '';
    cell.appendChild(container);
    const closeOnOutside = (event: MouseEvent) => {
      if (!container.contains(event.target as Node) && event.target !== cell) {
        document.removeEventListener('mousedown', closeOnOutside);
        close();
      }
    };
    setTimeout(() => document.addEventListener('mousedown', closeOnOutside), 0);
  }

  // Delete an entry (with undo)
  async function deleteEntry(id: string) {
    if (!confirm('Delete this past paper entry (and its uploaded files)?')) return;
    let entry: PastPaperEntry | null = null;
    let entryIdx = -1;
    try {
      const listRes = await fetch(API);
      if (listRes.ok) {
        const list = await listRes.json();
        entryIdx = list.findIndex((p: PastPaperEntry) => String(p.id) === String(id));
        if (entryIdx !== -1) entry = list[entryIdx];
      }
    } catch { /* best effort */ }
    const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      alert('Failed to delete past paper.');
      return;
    }
    if (entry) {
      pushAction(createDeleteAction({ ...entry, _restoreIndex: entryIdx }, 'past-paper', API, async () => { loadEntries(); }));
    }
    loadEntries();
  }

  // ---------- Search ----------
  const searchInput = input('pastPapersSearchInput');
  searchInput?.addEventListener('input', function () {
    currentFilter = this.value.trim().toLowerCase();
    renderTable();
  });

  loadEntries();
}
