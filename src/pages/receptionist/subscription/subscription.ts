// Subscription Page Logic
// This script assumes the page is served in a way that allows fetch from /database/*.json

document.addEventListener('DOMContentLoaded', function() {
  // Get DOM elements
  const studentSelect = document.getElementById('studentSelect');
  const subjectSelect = document.getElementById('subjectSelect') as HTMLSelectElement;
  const priceInput = document.getElementById('priceInput');
  const packageAmountInput = document.getElementById('packageAmountInput');
  const typeSelect = document.getElementById('typeSelect');
  // No expirationInput, use issued date
  const subscriptionForm = document.getElementById('subscriptionForm');
  const subscriptionsTableBody = document.getElementById('subscriptionsTableBody');

  let students = [];
  let subjects = [];
  let subscriptions = [];

  // Set studentsUrl to API endpoint for correct dropdown population
  const studentsUrl = '/api/students';
  const subjectsUrl = '/api/subjects';
  const subscriptionsUrl = '/database/subscription.json';

  // Load students and initialize Choices.js for searchable dropdown
  function loadStudentsDropdown() {
    const select = document.getElementById('studentSelect') as HTMLSelectElement;
    // Destroy Choices instance if exists
    if (select.choicesInstance) {
      select.choicesInstance.destroy();
      select.choicesInstance = null;
    }
    // Remove all options except the first (placeholder)
    while (select.options.length > 1) select.remove(1);
    fetch(studentsUrl)
      .then(res => res.json())
      .then(data => {
        students = data;
        students.filter(s => s.studentName && s.studentName.trim()).forEach(s => {
          const opt = document.createElement('option');
          opt.value = s.id;
          opt.textContent = s.studentName;
          select.appendChild(opt);
        });
        // Initialize Choices.js for searchable dropdown
        if (window.Choices) {
          select.choicesInstance = new Choices(select, {
            searchEnabled: true,
            itemSelectText: '',
            shouldSort: false,
            removeItemButton: false,
            allowHTML: false,
            placeholder: true,
            placeholderValue: 'Select Student'
          });
        }
      });
  }

  // Load subjects for the subject dropdown (form + inline editing)
  function loadSubjects() {
    fetch(subjectsUrl)
      .then(res => res.json())
      .then(data => {
        subjects = Array.isArray(data) ? data : [];
        // Form dropdown
        if (subjectSelect) {
          while (subjectSelect.options.length > 1) subjectSelect.remove(1);
          subjects.forEach(subj => {
            const opt = document.createElement('option');
            opt.value = subj.name;
            opt.textContent = subj.name;
            subjectSelect.appendChild(opt);
          });
        }
      });
  }

  // Build an <select> element listing every subject, keeping any existing
  // value (even one no longer in subjects.json) selectable. includeNone adds
  // a blank option used when clearing a subject.
  function buildSubjectDropdownSelect(currentValue, includeNone) {
    const select = document.createElement('select');
    select.className = 'form-select form-select-sm';
    if (includeNone) {
      const none = document.createElement('option');
      none.value = '';
      none.textContent = '— None —';
      select.appendChild(none);
    }
    const names = subjects.map(s => s.name).filter(Boolean);
    if (currentValue && !names.some(n => n.toLowerCase() === String(currentValue).toLowerCase())) {
      names.unshift(currentValue);
    }
    names.forEach(name => {
      const opt = document.createElement('option');
      opt.value = name;
      opt.textContent = name;
      if (currentValue && name.toLowerCase() === String(currentValue).toLowerCase()) opt.selected = true;
      select.appendChild(opt);
    });
    return select;
  }

  // Call on load
  loadStudentsDropdown();
  loadSubjects();

  function saveSubscription(subToUpdate, onDone?: any, cell?: any, fallbackText?: any) {
    fetch('/api/subscriptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subToUpdate)
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.success) {
          subscriptions = data.subscriptions;
          renderSubscriptions();
          if (onDone) onDone();
        } else {
          alert('Failed to update subscription.');
          if (cell && fallbackText !== undefined) cell.textContent = fallbackText;
          else loadSubscriptions();
        }
      })
      .catch(() => {
        alert('Failed to update subscription.');
        if (cell && fallbackText !== undefined) cell.textContent = fallbackText;
        else loadSubscriptions();
      });
  }

  function renderSubscriptions() {
    subscriptionsTableBody.innerHTML = '';
    // Group each student's subscriptions together (keeping their original
    // array index for editing/deleting), so a newly added subject shows up
    // directly under that student instead of at the far bottom of the table.
    const orderedSubs = subscriptions
      .map((sub, idx) => ({ sub, idx }))
      .sort((a, b) => {
        const byName = String(a.sub.studentFullName || '').localeCompare(String(b.sub.studentFullName || ''));
        return byName !== 0 ? byName : a.idx - b.idx;
      });
    orderedSubs.forEach(({ sub, idx }) => {
      const issueDate = sub.issueDate || sub.expirationDate || '';
      const subject = sub.subject || '';
      // Price shows 'unlimited' until a subject + price is assigned; clicking
      // it then opens the subject/price editor so it stops being unlimited.
      const priceCellContent = sub.priceTag === 'unlimited'
        ? '<span class="price-unlimited text-muted fst-italic">unlimited — click to set subject &amp; price</span>'
        : sub.priceTag;
      const tr = document.createElement('tr');
      tr.className = getUsageClass(sub);
      tr.innerHTML = `
        <td class="editable" data-field="studentFullName">${sub.studentFullName}</td>
        <td class="editable-subject-cell">${subject || '<span class="text-muted fst-italic">All subjects</span>'}</td>
        <td class="editable-price-cell">${priceCellContent}</td>
        <td class="editable-type-cell" data-field="type">${sub.type}</td>
        <td class="editable-issued-cell" data-field="issueDate">${issueDate ? issueDate.slice(0, 10) : ''}</td>
        <td class="editable" data-field="usage">${sub.usage}</td>
        <td>
          ${isUsageMaxed(sub) ? '<span class="badge bg-danger d-block mb-1"><i class="bi bi-exclamation-triangle-fill"></i> Usage complete — Reset or extend</span>' : ''}
          <button class="btn btn-success btn-sm add-subject-btn" data-idx="${idx}" title="Add another subject + price for this student"><i class="bi bi-plus-lg"></i> Add Subject</button>
          <button class="btn btn-danger btn-sm delete-sub-btn" data-idx="${idx}"><i class="bi bi-trash"></i> Delete</button>
          <button class="btn btn-warning btn-sm reset-sub-btn" data-idx="${idx}"><i class="bi bi-arrow-counterclockwise"></i> Reset</button>
        </td>
      `;
      attachEditableListeners(tr, idx);
      subscriptionsTableBody.appendChild(tr);
    });

    // Attach event listeners for delete and reset
    subscriptionsTableBody.querySelectorAll('.delete-sub-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const idx = Number(this.getAttribute('data-idx'));
        const sub = subscriptions[idx];
        // Only this row (this subject subscription) is removed — the student's
        // other subject subscriptions stay untouched.
        const removedSub = { ...sub };
        const removedIdx = idx;
        subscriptions = subscriptions.filter(s => String(s.id) !== String(sub.id));
        renderSubscriptions();
        // Update backend to remove this record
        fetch('/api/subscriptions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ delete: true, id: sub.id, studentFullName: sub.studentFullName, subject: sub.subject })
        })
          .then(res => res.json())
          .then(data => {
          // Register an undo action so the deleted subscription can be restored
          if (window.pushAction && data && data.success) {
            const undoAction = window.createCustomAction('delete', async () => {
              await fetch('/api/subscriptions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...removedSub, _restoreIndex: removedIdx })
              });
              loadSubscriptions();
            });
            window.pushAction(undoAction);
          }
        });
      });
    });
    subscriptionsTableBody.querySelectorAll('.add-subject-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        openAddSubjectEditor(Number(this.getAttribute('data-idx')));
      });
    });
    subscriptionsTableBody.querySelectorAll('.reset-sub-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const idx = Number(this.getAttribute('data-idx'));
        const sub = subscriptions[idx];
        const oldUsage = sub.usage;
        // Set usage to 0/packageAmount and update UI immediately
        sub.usage = `0/${sub.packageAmount}`;
        // Only update UI color and usage, do not reload all
        renderSubscriptions();
        // Update backend
        saveSubscription(sub, () => {
          // Register an undo action so the previous usage can be restored
          if (window.pushAction) {
            const undoAction = window.createCustomAction('edit', async () => {
              await fetch('/api/subscriptions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...sub, usage: oldUsage })
              });
              loadSubscriptions();
            });
            window.pushAction(undoAction);
          }
        });
      });
    });
  }

  // Add Subject: opens an inline editor row right beneath the student's row so
  // another subject + price subscription can be added for the SAME student
  // without leaving the table. Subjects the student already has are filtered
  // out of the dropdown so a second row is always a genuinely new subject.
  function openAddSubjectEditor(idx) {
    const parent = subscriptions[idx];
    // Only one editor row at a time
    const existingEditor = subscriptionsTableBody.querySelector('.add-subject-editor-row');
    if (existingEditor) existingEditor.remove();
    const usedSubjects = new Set(
      subscriptions
        .filter(s => s.studentFullName === parent.studentFullName)
        .map(s => String(s.subject || '').trim().toLowerCase())
    );
    let availableSubjects = subjects.filter(sj => !usedSubjects.has(String(sj.name || '').trim().toLowerCase()));
    // If every subject is already assigned, show all so the editor still opens
    if (availableSubjects.length === 0) availableSubjects = subjects;
    const editorRow = document.createElement('tr');
    editorRow.className = 'add-subject-editor-row';
    const editorTd = document.createElement('td');
    editorTd.colSpan = 7;
    const wrap = document.createElement('div');
    wrap.className = 'd-flex flex-wrap align-items-end gap-2 py-1 add-subject-editor';
    const mkField = (label, el) => {
      const div = document.createElement('div');
      div.className = 'add-subject-field';
      const lbl = document.createElement('label');
      lbl.className = 'form-label mb-0';
      lbl.textContent = label;
      div.appendChild(lbl);
      div.appendChild(el);
      return div;
    };
    const subjectEdit = document.createElement('select');
    subjectEdit.className = 'form-select form-select-sm';
    // Blank subject = the plan covers every subject (no subject restriction).
    const anySubjectOpt = document.createElement('option');
    anySubjectOpt.value = '';
    anySubjectOpt.textContent = 'All subjects (any)';
    subjectEdit.appendChild(anySubjectOpt);
    availableSubjects.forEach(sj => {
      const opt = document.createElement('option');
      opt.value = sj.name;
      opt.textContent = sj.name;
      subjectEdit.appendChild(opt);
    });
    const priceEdit = document.createElement('input');
    priceEdit.type = 'number';
    priceEdit.className = 'form-control form-control-sm';
    priceEdit.placeholder = 'Price paid';
    priceEdit.min = '0';
    const packageEdit = document.createElement('input');
    packageEdit.type = 'number';
    packageEdit.className = 'form-control form-control-sm';
    packageEdit.placeholder = 'blank = unlimited';
    packageEdit.min = '0';
    const typeEdit = document.createElement('select');
    typeEdit.className = 'form-select form-select-sm';
    [['classes', 'Classes'], ['hours', 'Hours']].forEach(([val, label]) => {
      const opt = document.createElement('option');
      opt.value = val;
      opt.textContent = label;
      typeEdit.appendChild(opt);
    });
    const saveBtn = document.createElement('button');
    saveBtn.type = 'button';
    saveBtn.className = 'btn btn-success btn-sm';
    saveBtn.innerHTML = '<i class="bi bi-check-lg"></i> Add';
    const cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.className = 'btn btn-secondary btn-sm';
    cancelBtn.innerHTML = '<i class="bi bi-x-lg"></i> Cancel';
    wrap.appendChild(mkField('Subject:', subjectEdit));
    wrap.appendChild(mkField('Price Paid:', priceEdit));
    wrap.appendChild(mkField('Package Amount:', packageEdit));
    wrap.appendChild(mkField('Type:', typeEdit));
    wrap.appendChild(saveBtn);
    wrap.appendChild(cancelBtn);
    editorTd.appendChild(wrap);
    editorRow.appendChild(editorTd);
    // Drop the editor right under the last row that belongs to this student,
    // so the extra subject stays inside that student's block.
    const studentRows = Array.from(subscriptionsTableBody.querySelectorAll('tr')).filter(row => {
      const firstCell = row.querySelector('td');
      return firstCell && firstCell.textContent.trim() === String(parent.studentFullName || '').trim();
    });
    const anchorRow = studentRows[studentRows.length - 1] || subscriptionsTableBody.children[idx] || null;
    if (anchorRow) anchorRow.insertAdjacentElement('afterend', editorRow);
    else subscriptionsTableBody.appendChild(editorRow);
    priceEdit.focus();
    const finish = () => editorRow.remove();
    cancelBtn.addEventListener('click', finish);
    saveBtn.addEventListener('click', () => {
      const subject = subjectEdit.value;
      const price = parseFloat(priceEdit.value);
      if (isNaN(price) || price <= 0) {
        alert('Please enter the price paid.');
        priceEdit.focus();
        return;
      }
      const packageAmount = packageEdit.value.trim();
      const parsedPackage = parseInt(packageAmount, 10);
      const hasPackage = !isNaN(parsedPackage) && parsedPackage > 0;
      const newSub = {
        id: Date.now(),
        studentFullName: parent.studentFullName,
        studentId: parent.studentId,
        subject,
        priceTag: price,
        type: hasPackage ? typeEdit.value : 'unlimited',
        issueDate: new Date().toISOString().slice(0, 10),
        usage: hasPackage ? `0/${parsedPackage}` : 'unlimited',
        packageAmount: hasPackage ? parsedPackage : 'unlimited',
        amount: price
      };
      saveSubscription(newSub, () => {
        // Register an undo action so the newly added subject can be removed
        if (window.pushAction) {
          window.pushAction(window.createCustomAction('add', async () => {
            await fetch('/api/subscriptions', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ delete: true, id: newSub.id, studentFullName: newSub.studentFullName, subject: newSub.subject })
            });
            loadSubscriptions();
          }));
        }
      });
    });
  }

  // Inline editing — same smooth pattern as the teachers/students pages: click
  // a cell to swap in a form-control input, Enter or blur saves, Escape cancels.
  // Type opens a dropdown, Issued opens a date picker, Subject opens a subject
  // dropdown, Price opens text (or subject+price editors when 'unlimited').
  function attachEditableListeners(tr, idx) {
    // Text fields (Student / Usage)
    tr.querySelectorAll('.editable').forEach(cell => {
      cell.addEventListener('click', function() {
        if (this.querySelector('input')) return; // already editing
        const field = this.dataset.field;
        const oldValue = this.textContent.trim();
        const input = document.createElement('input');
        input.type = 'text';
        input.value = oldValue;
        input.className = 'form-control form-control-sm';
        input.style.minWidth = '80px';
        this.textContent = '';
        this.appendChild(input);
        input.focus();
        input.select();

        let cancelled = false;
        const save = () => {
          if (cancelled) {
            this.textContent = oldValue;
            return;
          }
          const newValue = input.value.trim();
          if (!newValue || newValue === oldValue) {
            this.textContent = oldValue;
            return;
          }
          const subToUpdate = { ...subscriptions[idx] };
          if (field === 'usage') {
            let usageValue = newValue;
            // Typing just a number changes the package total while keeping the
            // current usage count (e.g. "2/unlimited" -> type 8 -> "2/8").
            if (/^\d+(\.\d+)?$/.test(newValue)) {
              const oldParts = String(subscriptions[idx].usage || '').split('/');
              const oldUsed = parseFloat(oldParts[0]);
              const used = isNaN(oldUsed) ? 0 : oldUsed;
              const total = parseInt(newValue, 10);
              if (!isNaN(total) && total > 0) {
                usageValue = `${used}/${total}`;
                subToUpdate.packageAmount = total;
              }
            }
            if (!/^(\d+(\.\d+)?\/(\d+(\.\d+)?|unlimited)|unlimited)$/i.test(usageValue)) {
              alert('Usage must be in format like 2/8, 3/unlimited, or unlimited');
              this.textContent = oldValue;
              return;
            }
            subToUpdate.usage = usageValue;
          } else {
            subToUpdate[field] = newValue;
          }
          // When renaming the student, tell the server the original name so the
          // existing record is updated instead of creating a duplicate.
          if (field === 'studentFullName') {
            subToUpdate.originalStudentFullName = subscriptions[idx].studentFullName;
          }
          saveSubscription(subToUpdate, null, this, oldValue);
        };

        input.addEventListener('blur', save);
        input.addEventListener('keydown', function(e) {
          if (e.key === 'Enter') input.blur();
          if (e.key === 'Escape') {
            cancelled = true;
            this.textContent = oldValue;
          }
        });
      });
    });

    // Subject: click to swap in a subject dropdown. Choosing a subject from
    // subjects.json assigns it to this subscription; '— None —' clears it.
    const subjectCell = tr.querySelector('.editable-subject-cell');
    subjectCell.addEventListener('click', function() {
      if (subjectCell.querySelector('select')) return; // already editing
      const currentValue = subscriptions[idx].subject || '';
      const select = buildSubjectDropdownSelect(currentValue, true);
      subjectCell.textContent = '';
      subjectCell.appendChild(select);
      select.focus();
      select.addEventListener('change', function() {
        const newValue = select.value;
        if (newValue === currentValue) {
          subjectCell.textContent = currentValue || '—';
          return;
        }
        const subToUpdate = { ...subscriptions[idx], subject: newValue };
        saveSubscription(subToUpdate);
      });
      select.addEventListener('blur', function() {
        // Only revert if the student did not open the list to change it — a
        // change event already saved and re-rendered the row.
        if (subjectCell.contains(select)) {
          subjectCell.textContent = currentValue || '—';
        }
      });
    });

    // Price: click to edit. When the price is still 'unlimited', the editor
    // asks for BOTH the subject and the price so the subscription stops being
    // unlimited; otherwise it is a plain price input.
    const priceCell = tr.querySelector('.editable-price-cell');
    priceCell.addEventListener('click', function() {
      if (priceCell.querySelector('input')) return; // already editing
      const sub = subscriptions[idx];
      if (String(sub.priceTag) === 'unlimited') {
        // Subject + price mini-editor inside the cell
        const wrap = document.createElement('div');
        wrap.className = 'd-flex flex-column gap-1 price-editor';
        const subjectEdit = buildSubjectDropdownSelect(sub.subject || '', true);
        subjectEdit.className = 'form-select form-select-sm my-0';
        const priceEdit = document.createElement('input');
        priceEdit.type = 'number';
        priceEdit.className = 'form-control form-control-sm';
        priceEdit.placeholder = 'Price paid';
        priceEdit.min = '0';
        const saveBtn = document.createElement('button');
        saveBtn.type = 'button';
        saveBtn.className = 'btn btn-success btn-sm';
        saveBtn.innerHTML = '<i class="bi bi-check-lg"></i> Save';
        wrap.appendChild(subjectEdit);
        wrap.appendChild(priceEdit);
        wrap.appendChild(saveBtn);
        priceCell.textContent = '';
        priceCell.appendChild(wrap);
        priceEdit.focus();
        let done = false;
        const finish = () => {
          if (done) return;
          done = true;
          priceCell.innerHTML = (sub.priceTag === 'unlimited')
            ? '<span class="price-unlimited text-muted fst-italic">unlimited — click to set subject &amp; price</span>'
            : sub.priceTag;
        };
        saveBtn.addEventListener('click', () => {
          const priceValue = parseFloat(priceEdit.value);
          const subjectValue = subjectEdit.value;
          if (isNaN(priceValue) || priceValue <= 0) {
            alert('Please enter the price paid.');
            priceEdit.focus();
            return;
          }
          const subToUpdate = { ...sub, subject: subjectValue, priceTag: priceValue };
          if (subToUpdate.amount === 'unlimited' || subToUpdate.amount === undefined) subToUpdate.amount = priceValue;
          done = true;
          saveSubscription(subToUpdate);
        });
        priceEdit.addEventListener('keydown', function(e) {
          if (e.key === 'Enter') saveBtn.click();
          if (e.key === 'Escape') finish();
        });
        subjectEdit.addEventListener('blur', function() { /* selection is captured on save */ });
      } else {
        const oldValue = String(sub.priceTag);
        const input = document.createElement('input');
        input.type = 'number';
        input.value = oldValue;
        input.className = 'form-control form-control-sm';
        input.style.minWidth = '80px';
        priceCell.textContent = '';
        priceCell.appendChild(input);
        input.focus();
        input.select();
        let cancelled = false;
        const save = () => {
          if (cancelled) {
            priceCell.textContent = oldValue;
            return;
          }
          const newValue = parseFloat(input.value);
          if (isNaN(newValue) || newValue === Number(oldValue)) {
            priceCell.textContent = oldValue;
            return;
          }
          const subToUpdate = { ...subscriptions[idx], priceTag: newValue };
          saveSubscription(subToUpdate);
        };
        input.addEventListener('blur', save);
        input.addEventListener('keydown', function(e) {
          if (e.key === 'Enter') input.blur();
          if (e.key === 'Escape') {
            cancelled = true;
            input.blur();
          }
        });
      }
    });

    // Type: click to swap in a dropdown (keeps 'unlimited' + classes/hours)
    const typeCell = tr.querySelector('.editable-type-cell');
    typeCell.addEventListener('click', function(e) {
      if (typeCell.querySelector('select')) return; // Already editing
      const currentValue = typeCell.textContent.trim();
      const options = ['unlimited', 'classes', 'hours'];
      if (currentValue && !options.includes(currentValue)) options.unshift(currentValue);
      const select = document.createElement('select');
      select.className = 'form-select form-select-sm';
      options.forEach(optVal => {
        const opt = document.createElement('option');
        opt.value = optVal;
        opt.textContent = optVal.charAt(0).toUpperCase() + optVal.slice(1);
        if (optVal === currentValue) opt.selected = true;
        select.appendChild(opt);
      });
      typeCell.textContent = '';
      typeCell.appendChild(select);
      select.focus();
      select.addEventListener('change', function() {
        const newValue = select.value;
        const subToUpdate = { ...subscriptions[idx] };
        subToUpdate.type = newValue;
        saveSubscription(subToUpdate);
      });
      select.addEventListener('blur', function() {
        // If not changed, revert
        if (!select.value || select.value === currentValue) {
          typeCell.textContent = currentValue;
        }
      });
    });

    // Issued date: click to swap in a date input
    const issuedCell = tr.querySelector('.editable-issued-cell');
    issuedCell.addEventListener('click', function(e) {
      if (issuedCell.querySelector('input[type="date"]')) return; // Already editing
      const currentValue = issuedCell.textContent.trim();
      const input = document.createElement('input');
      input.type = 'date';
      input.className = 'form-control form-control-sm';
      input.placeholder = 'mm/dd/yyyy';
      input.required = true;
      input.value = currentValue;
      issuedCell.textContent = '';
      issuedCell.appendChild(input);
      input.focus();
      input.addEventListener('change', function() {
        const newValue = input.value;
        if (newValue && newValue !== currentValue) {
          const subToUpdate = { ...subscriptions[idx] };
          subToUpdate.issueDate = newValue;
          saveSubscription(subToUpdate);
        }
      });
      input.addEventListener('blur', function() {
        issuedCell.textContent = input.value || currentValue;
      });
    });
  }

  // A fixed plan (X/Y) is maxed out once used reaches the total. Unlimited
  // plans (X/unlimited) never run out on their own.
  function isUsageMaxed(sub) {
    const [usedStr, totalStr] = String(sub.usage || '').split('/');
    // Hours plans can hold part hours (e.g. 4.5/10), so read decimals too.
    const used = parseFloat(usedStr);
    const total = parseFloat(totalStr);
    return !isNaN(used) && !isNaN(total) && total > 0 && used >= total;
  }

  function getUsageClass(sub) {
    const [usedStr, totalStr] = String(sub.usage || '').split('/');
    const used = parseFloat(usedStr);
    // Unlimited plans never expire
    if (String(totalStr).toLowerCase() === 'unlimited') {
      return used > 0 ? 'inuse' : 'new';
    }
    const total = parseFloat(totalStr);
    if (!isNaN(used) && !isNaN(total) && used >= total) return 'expired';
    if (used > 0) return 'inuse';
    return 'new';
  }

  subscriptionForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const studentId = studentSelect.value;
    const subject = subjectSelect ? subjectSelect.value : '';
    const price = priceInput.value;
    const packageAmount = packageAmountInput.value;
    const type = typeSelect.value;
    // A blank subject means "all subjects": the plan is not tied to one
    // subject, so it covers every session this student takes. Only the
    // student, price and package amount are required.
    if (!studentId || !price || !packageAmount) return;
    const studentObj = students.find(s => String(s.id) === String(studentId));
    const issuedDate = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const newSub = {
      id: Date.now(),
      studentFullName: studentObj ? studentObj.studentName : '',
      subject,
      priceTag: Number(price),
      type,
      issueDate: issuedDate,
      usage: `0/${packageAmount}`,
      packageAmount: Number(packageAmount)
    };
    // Capture any previous subscription for this student + subject so undo can
    // restore it when this submission merged into an existing record.
    const prevSub = subscriptions.find(s =>
      s.studentFullName === newSub.studentFullName &&
      String(s.subject || '').toLowerCase() === subject.toLowerCase()
    );
    // Save to backend
    fetch('/api/subscriptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSub)
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.success) {
          subscriptions = data.subscriptions;
          renderSubscriptions();
          subscriptionForm.reset();
          studentSelect.value = '';
          // Register an undo action so the new subscription can be removed
          if (window.pushAction) {
            const undoAction = window.createCustomAction('add', async () => {
              await fetch('/api/subscriptions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ delete: true, id: newSub.id, studentFullName: newSub.studentFullName, subject: newSub.subject })
              });
              // When this submission merged into an existing record, restore
              // that record with its previous values.
              if (prevSub) {
                await fetch('/api/subscriptions', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(prevSub)
                });
              }
              loadSubscriptions();
            });
            window.pushAction(undoAction);
          }
        } else {
          alert('Failed to save subscription.');
        }
      })
      .catch(() => {
        alert('Failed to save subscription.');
      });
  });

  // Load subscriptions from file (simulate initial load)
  function loadSubscriptions() {
    fetch(subscriptionsUrl)
      .then(res => res.json())
      .then(data => {
        subscriptions = data;
        renderSubscriptions();
      });
  }

  // Initial load
  loadSubscriptions();
});
