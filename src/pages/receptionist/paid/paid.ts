// Convert decimal hours to 'X hour(s) Y minute(s)'
function rec_paid_formatHoursDecimal(decimal) {
  if (typeof decimal !== 'number' || isNaN(decimal)) return '-';
  const hours = Math.floor(decimal);
  const minutes = Math.round((decimal - hours) * 60);
  let str = '';
  if (hours > 0) str += hours + ' hour' + (hours > 1 ? 's' : '');
  if (minutes > 0) str += (str ? ' ' : '') + minutes + ' minute' + (minutes > 1 ? 's' : '');
  if (!str) str = '0 minutes';
  return str;
}

// Format a duration (in minutes) as full words, e.g. 90 -> "1 hour and 30 minutes"
function rec_paid_formatDuration(mins) {
  const hours = Math.floor(mins / 60);
  const minutes = mins % 60;
  const parts = [];
  if (hours > 0) parts.push(hours + (hours === 1 ? ' hour' : ' hours'));
  if (minutes > 0) parts.push(minutes + (minutes === 1 ? ' minute' : ' minutes'));
  return parts.length ? parts.join(' and ') : '0 minutes';
}

// Escape HTML so statement text typed in a subscription cell renders safely.
function rec_paid_escapeHtmlText(str) {
  return String(str == null ? '' : str).replace(/[&<>"']/g, function(m) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
  });
}

// Statement text to mention on a paid row: prefers the snapshot stored on the
// payment, otherwise falls back to the live subscription's price cell.
function rec_paid_paymentStatement(s, sub) {
  if (s && s.subscriptionStatement) return String(s.subscriptionStatement);
  if (sub && typeof sub.priceTag === 'string') {
    const t = sub.priceTag.trim();
    if (t && !/^\d+(\.\d+)?$/.test(t) && t.toLowerCase() !== 'unlimited') return t;
  }
  return '';
}

// Build the NOTES cell: the payment note (if any) plus a highlighted line
// mentioning the subscription statement the admin typed in the price cell.
function rec_paid_paymentNoteHtml(s, sub) {
  const stmt = rec_paid_paymentStatement(s, sub);
  return `${s.note || (stmt ? '' : '-')}${stmt ? `<div class="text-warning fw-semibold mt-1" style="font-size:12px;"><i class="bi bi-megaphone-fill me-1"></i>${rec_paid_escapeHtmlText(stmt)}</div>` : ''}`;
}
// Paid Payments Page Logic
// Loads payments.json, filters for status: 'Paid', renders cards and tables

async function rec_paid_fetchJson(url) {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Could not load ${url} (${res.status})`);
  return await res.json();
}

function rec_paid_formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB') + ' ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

// Sort key for payment cards: newest submission on top. Prefers the matched
// attendance record's submittedAt (latest save of the session), then the first
// student payment's submittedAt, then the session date as a fallback.
function rec_paid_getSessionSortTime(session, sessions) {
  if (sessions) {
    const match = sessions.find(ses =>
      (ses.teacherName === session.createdBy || ses.teacherName === session.teacherName) &&
      ses.date === session.date &&
      ses.subject === session.subject &&
      ses.classroom === session.classroom &&
      ses.timeWindow === session.timeWindow
    );
    if (match && match.submittedAt) return new Date(match.submittedAt).getTime();
  }
  const firstPay = session.students && session.students[0];
  if (firstPay && firstPay.submittedAt) return new Date(firstPay.submittedAt).getTime();
  if (session.date) {
    const d = new Date(session.date);
    if (!isNaN(d)) return d.getTime();
  }
  return 0;
}

function rec_paid_sessionKeyFromPayment(payment) {
  return [payment.createdBy, payment.date, payment.subject, payment.classroom, payment.timeWindow].join('|');
}

async function rec_paid_deleteSessionPayments(session) {
  const requests = session.students.map(s =>
    fetch(`/api/payments/${encodeURIComponent(s.id)}`, {
      method: 'DELETE'
    })
  );
  const responses = await Promise.all(requests);
  const failed = responses.find(r => !r.ok);
  if (failed) throw new Error('Failed to delete session card.');
}


let rec_paid_subscriptionData = [];
async function rec_paid_fetchSubscriptions() {
  try {
    const res = await fetch('/api/subscriptions');
    rec_paid_subscriptionData = await res.json();
  } catch {
    rec_paid_subscriptionData = [];
  }
}

async function rec_paid_renderPaidPayments(paids) {
  const listDiv = document.getElementById('paidPaymentsList');
  if (!paids.length) {
    listDiv.innerHTML = '<div class="text-muted">No paid payments found.</div>';
    return;
  }
  // Group by session/teacher
  const sessionMap: { [key: string]: any } = {};
  paids.forEach(payment => {
    const key = [payment.createdBy, payment.date, payment.subject, payment.classroom, payment.timeWindow].join('|');
    if (!sessionMap[key]) {
      sessionMap[key] = {
        ...payment,
        students: []
      };
    }
    sessionMap[key].students.push(payment);
  });
  // Fetch attendance data for patching
  const attendanceData = await rec_paid_fetchJson('/database/teacher-portal/teachers-attendance.json');
  // Fetch teachers data for cut rate
  const teachersData = await rec_paid_fetchJson('/database/teachers.json');
  // Fetch subscriptions if not already loaded
  if (!rec_paid_subscriptionData || !Array.isArray(rec_paid_subscriptionData) || rec_paid_subscriptionData.length === 0) {
    await rec_paid_fetchSubscriptions();
  }
  const sessionList = Object.values(sessionMap as { [key: string]: any });
  // Newest paid submissions first, oldest at the bottom
  sessionList.sort((a, b) => rec_paid_getSessionSortTime(b, attendanceData) - rec_paid_getSessionSortTime(a, attendanceData));
  // Clear only when everything is ready, then append, so two concurrent
  // renders (e.g. double loadPaidPayments) can never double-append cards.
  // Then grouped into collapsible month sections with a year divider —
  // same dashboard layout as the Payments page.
  function buildCard(session) {
    // Patch grade and schoolName if missing
    const match = attendanceData.find(a =>
      (a.teacherName === session.createdBy || a.teacherName === session.teacherName) &&
      a.date === session.date &&
      a.subject === session.subject &&
      a.classroom === session.classroom &&
      a.timeWindow === session.timeWindow
    );
    if (match) {
      if (!session.grade) session.grade = match.grade;
      if (!session.schoolName) session.schoolName = match.schoolName;
    }
    // Calculate duration string
    let durationStr = '';
    if (session.timeWindow) {
      const times = session.timeWindow.split(' - ').map(t => t.trim()).filter(Boolean);
      if (times.length >= 2) {
        const toMinutes = t => {
          const [h, m] = t.split(':');
          return parseInt(h, 10) * 60 + parseInt(m, 10);
        };
        const start = toMinutes(times[0]);
        const end = toMinutes(times[times.length - 1]);
        let mins = end - start;
        if (mins < 0) mins += 24 * 60;
        durationStr = mins > 0 ? rec_paid_formatDuration(mins) : '';
      }
    }
    // Calculate total paid and teacher profit
    const totalPaid = session.students.reduce((sum, s) => sum + (Number(s.amount) || 0), 0);
    // Find teacher by first and last name (case-insensitive)
    let teacher = null;
    if (session.createdBy) {
      const nameParts = session.createdBy.trim().split(/\s+/);
      const firstName = nameParts[0] || '';
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
      teacher = teachersData.find(t => {
        if (!t.firstName || !t.lastName) return false;
        return (
          t.firstName.trim().toLowerCase() === firstName.toLowerCase() &&
          t.lastName.trim().toLowerCase() === lastName.toLowerCase()
        );
      });
    }
    const cutRate = teacher && teacher.cutRate ? Number(teacher.cutRate) : 0;
    const teacherProfit = Math.round((totalPaid * cutRate) / 100);
    const card = document.createElement('div');
    card.className = 'payment-card collapsed';
    const studentsCount = session.students ? session.students.length : 0;
    const timeText = session.timeWindow ? `${session.timeWindow}${durationStr ? ' · ' + durationStr : ''}` : '-';
    card.innerHTML = `
      <div class="payment-card-header position-relative d-flex align-items-start" style="min-height: 90px;">
        <div class="payment-card-main" style="min-width:0;">
          <span class="payment-card-chevron"><i class="bi bi-chevron-right"></i></span>
          <div class="payment-card-heading" style="min-width:190px;">
            <div class="payment-card-title">${session.createdBy || session.teacherName || 'Teacher'}</div>
            <div class="payment-card-chips">
              <span class="chip chip-subject">${session.subject || 'No subject'}</span>
              ${session.grade ? `<span class="chip">Grade ${session.grade}</span>` : ''}
              ${session.classroom ? `<span class="chip">${session.classroom}</span>` : ''}
              ${session.schoolName ? `<span class="chip">${session.schoolName}</span>` : ''}
            </div>
          </div>
          <div class="payment-card-meta">
            <span><i class="bi bi-calendar3"></i> ${session.date || '-'}</span>
            <span><i class="bi bi-clock"></i> ${timeText}</span>
            <span><i class="bi bi-people"></i> ${studentsCount} student${studentsCount === 1 ? '' : 's'}</span>
            <span><i class="bi bi-send"></i> Submitted ${session.submittedAt ? rec_paid_formatDate(session.submittedAt) : rec_paid_formatDate(session.date)}</span>
          </div>
        </div>
        <div class="payment-card-header-actions">
          <button type="button" class="btn btn-sm btn-outline-danger js-delete-session">Delete Card</button>
        </div>
      </div>
      <div class="payment-card-details-area" style="display:none;">
        <div class="table-responsive">
          <table class="table table-bordered table-hover align-middle mb-0 payment-card-table">
            <thead class="table-light">
              <tr>
                <th>STUDENT</th>
                <th>HOURS TAKEN</th>
                <th>CUT RATE</th>
                <th>NOTES</th>
                <th>PRICE TAG</th>
                <th>AMOUNT</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              ${session.students.map(s => `
                <tr data-payment-id="${s.id || ''}">
                  <td>
                    <span style="${(rec_paid_subscriptionData && rec_paid_subscriptionData.find(sub => sub.studentFullName && sub.studentFullName.trim().toLowerCase() === (s.studentName||'').trim().toLowerCase()) && s.status === 'Paid') ? 'color:#198754;font-weight:bold;' : ''};display:inline-block;min-width:70px;text-align:center;">
                      ${s.studentName || '-'}
                    </span>
                    <div style="font-size:12px;">
                      ${(function(){
                        const sub = rec_paid_subscriptionData && rec_paid_subscriptionData.find(sub => sub.studentFullName && sub.studentFullName.trim().toLowerCase() === (s.studentName||'').trim().toLowerCase());
                        return sub ? `<span class='badge bg-success ms-1'><i class='bi bi-star-fill'></i> ${sub.usage} (issued: ${sub.issueDate})</span>` : '';
                      })()}
                    </div>
                  </td>
                  <td>${typeof s.hours !== 'undefined' ? rec_paid_formatHoursDecimal(Number(s.hours)) : '-'}</td>
                  <td>${(s.cutRate !== undefined && s.cutRate !== null && s.cutRate !== '') ? s.cutRate + '%' : '-'}</td>
                  <td>${rec_paid_paymentNoteHtml(s, rec_paid_subscriptionData && rec_paid_subscriptionData.find(sub => sub.studentFullName && sub.studentFullName.trim().toLowerCase() === (s.studentName || '').trim().toLowerCase()))}</td>
                  <td class="cell-priceTag">${s.priceTag || 0}</td>
                  <td class="cell-amount">${s.amount || 0}</td>
                  <td>${s.status || '-'}</td>
                  <td>
                    <button class="btn btn-sm btn-outline-primary btn-edit-payment" title="Edit amount & price tag"><i class="bi bi-pencil"></i></button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
    listDiv.appendChild(card);
    // Collapse/expand logic
    const header = card.querySelector('.payment-card-header');
    const details = card.querySelector('.payment-card-details-area');
    card.classList.add('collapsed');
    details.style.display = 'none';
    header.addEventListener('click', (e) => {
      // Don't collapse if clicking inside an edit row
      if (e.target.closest('button') || e.target.closest('input')) return;
      card.classList.toggle('collapsed');
      if (card.classList.contains('collapsed')) {
        details.style.display = 'none';
      } else {
        details.style.display = '';
      }
    });

    const deleteBtn = card.querySelector('.js-delete-session');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const teacherName = session.createdBy || session.teacherName || 'this teacher';
        const ok = window.confirm(`Delete this paid card for ${teacherName} on ${session.date || 'selected date'}? This removes all students in this card.`);
        if (!ok) return;
        try {
          // Register an undo action so the deleted card can be restored
          const deletedPayments = session.students.map(s => ({ ...s }));

          // Capture the original position of this session in the payments list
          // BEFORE deleting, so the undo restores the card back where it was.
          const allPayments = await (await fetch('/database/teacher-portal/payments.json')).json();
          const firstPaymentIdx = allPayments.findIndex(p => String(p.id) === String(deletedPayments[0] && deletedPayments[0].id));

          await rec_paid_deleteSessionPayments(session);

          if (deletedPayments.length && window.pushAction && window.createCustomAction) {
            window.pushAction(window.createCustomAction('paid-session', async () => {
              try {
                for (let i = 0; i < deletedPayments.length; i++) {
                  const p = deletedPayments[i];
                  await fetch('/api/payments', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...p, _restoreIndex: firstPaymentIdx + i })
                  });
                }
              } catch (e) { console.error('Undo paid card failed:', e); }
              // Reload the paid list from the server so the restored card is
              // rendered back at its original position (not from a stale cache).
              await rec_paid_loadPaidPayments();
            }));
          }
          rec_paid_allPaids = rec_paid_allPaids.filter(p => rec_paid_sessionKeyFromPayment(p) !== rec_paid_sessionKeyFromPayment(session));
          await rec_paid_doSearch();
        } catch (err) {
          window.alert(err.message || 'Failed to delete card.');
        }
      });
    }

    // Edit button logic for each row
    function attachEditHandler(editBtn) {
      editBtn.addEventListener('click', async function onEditClick(e) {
        e.stopPropagation();
        const row = editBtn.closest('tr');
        const priceTagCell = row.querySelector('.cell-priceTag');
        const amountCell = row.querySelector('.cell-amount');
        const actionsCell = editBtn.closest('td');

        const origPriceTag = priceTagCell.textContent.trim();
        const origAmount = amountCell.textContent.trim();

        priceTagCell.innerHTML = `<input type="number" class="form-control form-control-sm" value="${origPriceTag}" style="min-width:80px;">`;
        amountCell.innerHTML = `<input type="number" class="form-control form-control-sm" value="${origAmount}" style="min-width:80px;">`;

        actionsCell.innerHTML = `
          <button class="btn btn-sm btn-success btn-save-payment me-1" title="Save"><i class="bi bi-check-lg"></i></button>
          <button class="btn btn-sm btn-secondary btn-cancel-payment" title="Cancel"><i class="bi bi-x-lg"></i></button>
        `;

        function restoreRow(priceTagVal, amountVal) {
          priceTagCell.textContent = priceTagVal;
          amountCell.textContent = amountVal;
          actionsCell.innerHTML = `<button class="btn btn-sm btn-outline-primary btn-edit-payment" title="Edit amount &amp; price tag"><i class="bi bi-pencil"></i></button>`;
          attachEditHandler(actionsCell.querySelector('.btn-edit-payment'));
        }

        // Save handler
        actionsCell.querySelector('.btn-save-payment').addEventListener('click', async (ev) => {
          ev.stopPropagation();
          const paymentId = row.dataset.paymentId;
          const newPriceTag = priceTagCell.querySelector('input').value;
          const newAmount = amountCell.querySelector('input').value;

          if (!paymentId) {
            alert('Cannot save: payment ID is missing.');
            return;
          }

          try {
            const paymentObj = session.students.find(s => String(s.id) === String(paymentId));
            const oldPayment = paymentObj ? { ...paymentObj } : null;
            const res = await fetch(`/api/payments/${paymentId}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ priceTag: Number(newPriceTag), amount: Number(newAmount) })
            });
            if (!res.ok) throw new Error('Server error');
            // Register an undo action for the amount/priceTag edit
            if (oldPayment && window.pushAction && window.createEditAction) {
              window.pushAction(window.createEditAction(
                oldPayment,
                { ...oldPayment, priceTag: Number(newPriceTag), amount: Number(newAmount) },
                'payment',
                '/api/payments',
                rec_paid_doSearch
              ));
            }
            restoreRow(newPriceTag, newAmount);
            // Refresh rec_paid_allPaids in background (only fully-paid cards belong here)
            await rec_paid_loadPaidPayments();
          } catch (err) {
            alert('Failed to save changes. Please try again.');
          }
        });

        // Cancel handler
        actionsCell.querySelector('.btn-cancel-payment').addEventListener('click', (ev) => {
          ev.stopPropagation();
          restoreRow(origPriceTag, origAmount);
        });
      });
    }

    card.querySelectorAll('.btn-edit-payment').forEach(btn => attachEditHandler(btn));
    return card;
  }
  // Month sections: newest on top, year dividers, remembered expand/collapse.
  // The session list is already sorted by getSessionSortTime, so keep that order.
  PaymentGroups.attachMonthSections(listDiv, sessionList, buildCard, { sort: false });
}


let rec_paid_allPaids = [];
let rec_paid_lastSearch = '';
let rec_paid_doSearch = async function() {
  const search = document.getElementById('searchPaidInput').value.trim().toLowerCase();
  rec_paid_lastSearch = search;
  if (!search) {
    await rec_paid_renderPaidPayments(rec_paid_allPaids);
    return;
  }
  // Filter sessions by teacher, subject, or student name
  const filtered = rec_paid_allPaids.filter(p => {
    if (
      (p.createdBy && p.createdBy.toLowerCase().includes(search)) ||
      (p.subject && p.subject.toLowerCase().includes(search)) ||
      (p.studentName && p.studentName.toLowerCase().includes(search))
    ) {
      return true;
    }
    return false;
  });
  await rec_paid_renderPaidPayments(filtered);
}
async function rec_paid_loadPaidPayments() {
  const payments = await rec_paid_fetchJson('/database/teacher-portal/payments.json');
  // Every student row belongs on exactly one page, so the Paid page collects
  // the paid rows themselves. A student who has paid shows up here even when
  // someone else on the same form still owes money — that row stays on the
  // Payments, Partial or Unpaid page instead of dragging the paid one with it.
  rec_paid_allPaids = payments.filter(p => String(p.status || '').trim().toLowerCase() === 'paid');
  await rec_paid_doSearch();
}
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchPaidInput');
  const filterType = document.getElementById('filterPaidType');
  const filterValue = document.getElementById('filterPaidValue');
  const filterSummary = document.getElementById('paidFilterSummary');
  const startMonthInput = document.getElementById('startMonthInput');
  const endMonthInput = document.getElementById('endMonthInput');

  // Load paid payments on page load
  rec_paid_loadPaidPayments();

  searchInput.addEventListener('input', rec_paid_doSearch);
  const applyBtn = document.getElementById('applyPaidFilterBtn');
  filterType.addEventListener('change', async () => {
    filterValue.innerHTML = '';
    filterValue.style.display = 'none';
    filterSummary.textContent = '';
    applyBtn.style.display = 'none';
    if (!filterType.value) {
      rec_paid_doSearch();
      return;
    }
    // Group by session for filter values
    const sessionMap: { [key: string]: any } = {};
    rec_paid_allPaids.forEach(payment => {
      const key = [payment.createdBy, payment.date, payment.subject, payment.classroom, payment.timeWindow].join('|');
      if (!sessionMap[key]) {
        sessionMap[key] = {
          ...payment,
          students: []
        };
      }
      sessionMap[key].students.push(payment);
    });
    const sessions = Object.values(sessionMap as { [key: string]: any });
    let values = [];
    if (filterType.value === 'teacher') {
      values = [...new Set(sessions.map(s => s.createdBy).filter(Boolean))];
    } else if (filterType.value === 'subject') {
      values = [...new Set(sessions.map(s => s.subject).filter(Boolean))];
    } else if (filterType.value === 'student') {
      // Collect all students from all sessions
      values = [...new Set(sessions.flatMap(s => s.students.map(stu => stu.studentName)).filter(Boolean))];
    }
    filterValue.innerHTML = '<option value="">Select...</option>' + values.map(v => `<option value="${v}">${v}</option>`).join('');
    filterValue.style.display = '';
    applyBtn.style.display = '';
  });
  // Only apply filter when Apply button is clicked
  applyBtn.addEventListener('click', function(e) {
    e.preventDefault();
    rec_paid_doSearch();
  });
  // Hide Apply button if filter is reset
  filterValue.addEventListener('change', () => {
    if (!filterValue.value) applyBtn.style.display = '';
  });
  // Patch doSearch to support filter and month range
  rec_paid_doSearch = async function() {
    const search = searchInput.value.trim().toLowerCase();
    let filtered = rec_paid_allPaids;
    // Apply dropdown filter at payment (raw) level
    if (filterType.value && filterValue.value) {
      const selected = filterValue.value.trim().toLowerCase();
      if (filterType.value === 'teacher') {
        filtered = filtered.filter(p => p.createdBy && p.createdBy.trim().toLowerCase() === selected);
      } else if (filterType.value === 'subject') {
        filtered = filtered.filter(p => p.subject && p.subject.trim().toLowerCase() === selected);
      } else if (filterType.value === 'student') {
        filtered = filtered.filter(p => p.studentName && p.studentName.trim().toLowerCase() === selected);
      }
    }
    // Apply month range filter
    const startMonth = startMonthInput.value;
    const endMonth = endMonthInput.value;
    if (startMonth || endMonth) {
      filtered = filtered.filter(p => {
        if (!p.date) return false;
        // Dates are stored as ISO, English or French strings; the shared
        // helper understands all three so no month filter drops valid rows.
        const payDate = PaymentGroups.parseDate(p.date);
        if (!payDate) return false;
        let afterStart = true, beforeEnd = true;
        if (startMonth) {
          const [sy, sm] = startMonth.split('-').map(Number);
          const startDate = new Date(sy, sm - 1, 1);
          afterStart = payDate >= startDate;
        }
        if (endMonth) {
          const [ey, em] = endMonth.split('-').map(Number);
          // End of month: set to last day of month
          const endDate = new Date(ey, em, 0, 23, 59, 59, 999);
          beforeEnd = payDate <= endDate;
        }
        return afterStart && beforeEnd;
      });
    }
    // Apply search filter at payment (raw) level
    if (search) {
      filtered = filtered.filter(p =>
        (p.createdBy && p.createdBy.toLowerCase().includes(search)) ||
        (p.subject && p.subject.toLowerCase().includes(search)) ||
        (p.studentName && p.studentName.toLowerCase().includes(search))
      );
    }
    // Show summary for filtered payments
    let totalPaid = filtered.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    let summary = '';
    if ((filterType.value && filterValue.value) || startMonth || endMonth) {
      summary = `Filtered Total Paid by Students: ${totalPaid}`;
      if (startMonth) summary += ` | From: ${startMonth}`;
      if (endMonth) summary += ` | To: ${endMonth}`;
    }
    filterSummary.textContent = summary;
    await rec_paid_renderPaidPayments(filtered);
  };
});


// (TypeScript conversion shim: original global name kept available for
// co-loaded scripts and inline HTML handlers — same lookup as before)
if (typeof rec_paid_formatHoursDecimal !== 'undefined') { window.rec_paid_formatHoursDecimal = rec_paid_formatHoursDecimal; }
if (typeof rec_paid_formatDuration !== 'undefined') { window.rec_paid_formatDuration = rec_paid_formatDuration; }
if (typeof rec_paid_escapeHtmlText !== 'undefined') { window.rec_paid_escapeHtmlText = rec_paid_escapeHtmlText; }
if (typeof rec_paid_paymentStatement !== 'undefined') { window.paymentStatement = rec_paid_paymentStatement; }
if (typeof rec_paid_paymentNoteHtml !== 'undefined') { window.paymentNoteHtml = rec_paid_paymentNoteHtml; }
if (typeof rec_paid_fetchJson !== 'undefined') { window.fetchJson = rec_paid_fetchJson; }
if (typeof rec_paid_formatDate !== 'undefined') { window.formatDate = rec_paid_formatDate; }
if (typeof rec_paid_getSessionSortTime !== 'undefined') { window.getSessionSortTime = rec_paid_getSessionSortTime; }
if (typeof rec_paid_sessionKeyFromPayment !== 'undefined') { window.sessionKeyFromPayment = rec_paid_sessionKeyFromPayment; }
if (typeof rec_paid_deleteSessionPayments !== 'undefined') { window.deleteSessionPayments = rec_paid_deleteSessionPayments; }
if (typeof rec_paid_fetchSubscriptions !== 'undefined') { window.fetchSubscriptions = rec_paid_fetchSubscriptions; }
if (typeof rec_paid_renderPaidPayments !== 'undefined') { window.renderPaidPayments = rec_paid_renderPaidPayments; }
if (typeof rec_paid_doSearch !== 'undefined') { window.doSearch = rec_paid_doSearch; }
if (typeof rec_paid_loadPaidPayments !== 'undefined') { window.loadPaidPayments = rec_paid_loadPaidPayments; }


// (TypeScript conversion shim: original global name kept available for
// co-loaded scripts and inline HTML handlers — same lookup as before)
if (typeof rec_paid_paymentStatement !== 'undefined') { window.paymentStatement = rec_paid_paymentStatement; }
if (typeof rec_paid_paymentNoteHtml !== 'undefined') { window.paymentNoteHtml = rec_paid_paymentNoteHtml; }
if (typeof rec_paid_fetchJson !== 'undefined') { window.fetchJson = rec_paid_fetchJson; }
if (typeof rec_paid_formatDate !== 'undefined') { window.formatDate = rec_paid_formatDate; }
if (typeof rec_paid_getSessionSortTime !== 'undefined') { window.getSessionSortTime = rec_paid_getSessionSortTime; }
if (typeof rec_paid_sessionKeyFromPayment !== 'undefined') { window.sessionKeyFromPayment = rec_paid_sessionKeyFromPayment; }
if (typeof rec_paid_deleteSessionPayments !== 'undefined') { window.deleteSessionPayments = rec_paid_deleteSessionPayments; }
if (typeof rec_paid_fetchSubscriptions !== 'undefined') { window.fetchSubscriptions = rec_paid_fetchSubscriptions; }
if (typeof rec_paid_renderPaidPayments !== 'undefined') { window.renderPaidPayments = rec_paid_renderPaidPayments; }
if (typeof rec_paid_doSearch !== 'undefined') { window.doSearch = rec_paid_doSearch; }
if (typeof rec_paid_loadPaidPayments !== 'undefined') { window.loadPaidPayments = rec_paid_loadPaidPayments; }
