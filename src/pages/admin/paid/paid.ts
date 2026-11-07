// Convert decimal hours to 'X hour(s) Y minute(s)'
function adm_paid_formatHoursDecimal(decimal) {
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
function adm_paid_formatDuration(mins) {
  const hours = Math.floor(mins / 60);
  const minutes = mins % 60;
  const parts = [];
  if (hours > 0) parts.push(hours + (hours === 1 ? ' hour' : ' hours'));
  if (minutes > 0) parts.push(minutes + (minutes === 1 ? ' minute' : ' minutes'));
  return parts.length ? parts.join(' and ') : '0 minutes';
}

// Escape HTML so statement text typed in a subscription cell renders safely.
function adm_paid_escapeHtmlText(str) {
  return String(str == null ? '' : str).replace(/[&<>"']/g, function(m) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
  });
}

// —— Subscriber (package) pricing ——
// A subscriber pays for a package up-front (e.g. 10 classes for 500) and the
// session form leaves the money cells empty, so those sessions used to add
// nothing to the teacher's salary. These helpers turn the package price into
// the value of the hours actually taken:
//   price ÷ package amount        = price per class
//   price per class × hours taken = value of the session
//   value × cut rate %            = the teacher's share
function adm_paid_round2(value) {
  return Math.round((Number(value) || 0) * 100) / 100;
}

// Pull the first number out of a cell that may be plain (700, '700') or
// annotated ('English"600"', 'still owes us 725').
function adm_paid_parseMoney(value) {
  if (typeof value === 'number') return isFinite(value) ? value : null;
  const match = String(value == null ? '' : value).match(/\d+(\.\d+)?/);
  return match ? Number(match[0]) : null;
}

// Package size: packageAmount when it is a real number, otherwise the total on
// the right of the usage counter (e.g. '3/8' -> 8). 'unlimited' packages have
// no size, so no per-class price can be derived from them.
function adm_paid_parsePackageAmount(sub) {
  if (!sub) return null;
  const direct = adm_paid_parseMoney(sub.packageAmount);
  if (direct && direct > 0) return direct;
  const usageTotal = String(sub.usage || '').split('/')[1];
  const fromUsage = adm_paid_parseMoney(usageTotal);
  return fromUsage && fromUsage > 0 ? fromUsage : null;
}

// The subscription that pays for a student's session: a subject-matching
// subscription first, then an "all subjects" one (no subject set).
function adm_paid_findSubscription(subscriptions, studentName, subject) {
  const name = String(studentName || '').trim().toLowerCase();
  if (!name || !Array.isArray(subscriptions)) return null;
  const mine = subscriptions.filter(sub => String(sub.studentFullName || '').trim().toLowerCase() === name);
  if (!mine.length) return null;
  const wanted = String(subject || '').trim().toLowerCase();
  const subjectMatch = wanted
    ? mine.find(sub => String(sub.subject || '').trim().toLowerCase() === wanted)
    : null;
  if (subjectMatch) return subjectMatch;
  const allSubjects = mine.filter(sub => !String(sub.subject || '').trim());
  const priced = allSubjects.find(sub =>
    adm_paid_parseMoney(sub.priceTag) !== null || adm_paid_parseMoney(sub.amount) !== null
  );
  return priced || allSubjects[0] || mine[0];
}

// Length of a session time window (e.g. "16:00 - 17:00 - 18:00") in minutes.
function adm_paid_windowMinutes(windowStr) {
  const times = String(windowStr || '').split('-').map(t => t.trim()).filter(Boolean);
  if (times.length < 2) return 0;
  const toMinutes = t => {
    const [h, m] = t.split(':');
    const hh = parseInt(h, 10);
    const mm = parseInt(m, 10);
    if (isNaN(hh) || isNaN(mm)) return null;
    return hh * 60 + mm;
  };
  const start = toMinutes(times[0]);
  const end = toMinutes(times[times.length - 1]);
  if (start === null || end === null) return 0;
  let mins = end - start;
  if (mins < 0) mins += 24 * 60; // overnight session
  return mins > 0 ? mins : 0;
}

// Hours this payment covers: the hours typed on the form, otherwise the length
// of the session's time window.
function adm_paid_sessionHours(payment, session) {
  const typed = Number(payment && payment.hours);
  if (isFinite(typed) && typed > 0) return typed;
  const mins = adm_paid_windowMinutes(session && session.timeWindow);
  return mins > 0 ? mins / 60 : 0;
}

// Price a subscriber's session should use. The live subscription wins, then the
// price the server linked onto the row (payments-sync stamps subscriptionPrice /
// subscriptionPackageAmount when the price is saved), so a session card picks
// the price up the moment it is filled in on the admin Subscription page — even
// for rows that were saved long before the price existed.
function adm_paid_subscriptionPrice(sub, payment) {
  const subPrice = sub
    ? adm_paid_parseMoney(sub.priceTag != null && String(sub.priceTag).trim() !== '' ? sub.priceTag : sub.amount)
    : null;
  if (subPrice && subPrice > 0) {
    return { price: subPrice, packageAmount: adm_paid_parsePackageAmount(sub) };
  }
  const linkedPrice = adm_paid_parseMoney(payment && payment.subscriptionPrice);
  if (linkedPrice && linkedPrice > 0) {
    const linkedPackage = adm_paid_parseMoney(payment && payment.subscriptionPackageAmount);
    return { price: linkedPrice, packageAmount: linkedPackage && linkedPackage > 0 ? linkedPackage : null };
  }
  return null;
}

// What one session is worth out of the student's package, or null when the
// package has no numeric price / size (e.g. an 'unlimited' plan) — those rows
// are flagged on the card instead of being silently counted as zero.
function adm_paid_subscriptionValue(payment, session, priceInfo) {
  if (!priceInfo || !priceInfo.price || !priceInfo.packageAmount) return null;
  const hours = adm_paid_sessionHours(payment, session);
  if (!hours) return null;
  const unitPrice = priceInfo.price / priceInfo.packageAmount;
  return {
    price: priceInfo.price,
    packageAmount: priceInfo.packageAmount,
    unitPrice,
    hours,
    value: adm_paid_round2(unitPrice * hours)
  };
}

// Money for one student row: the cash collected on the form plus the slice of
// their subscription package the session used. A row that already carries cash
// is left alone so a package is never counted twice. Salaries are taken on the
// billable total, so a subscriber's sessions finally pay their teacher.
function adm_paid_rowMoney(payment, session, subscriptions) {
  const paid = adm_paid_round2(payment && payment.amount);
  const sub = adm_paid_findSubscription(subscriptions, payment && payment.studentName, session && session.subject);
  const priceInfo = adm_paid_subscriptionPrice(sub, payment);
  const subValue = paid === 0 ? adm_paid_subscriptionValue(payment, session, priceInfo) : null;
  return {
    paid,
    sub,
    price: priceInfo,
    subValue,
    billable: adm_paid_round2(paid + (subValue ? subValue.value : 0))
  };
}

// STATEMENT / SUB. VALUE tooltip: the exact sum behind a subscriber's session.
function adm_paid_subValueBreakdown(v) {
  return `${v.price} ÷ ${v.packageAmount} = ${adm_paid_round2(v.unitPrice)} per class × ${v.hours}h taken = ${v.value}`;
}

// SUB. VALUE cell: the package money this row contributes, with its sum shown
// underneath; missing prices are flagged instead of quietly counting as zero.
function adm_paid_subValueCellHtml(row) {
  if (row.subValue) {
    const v = row.subValue;
    return `<span class="text-primary fw-semibold" title="${adm_paid_escapeHtmlText(adm_paid_subValueBreakdown(v))}">${v.value}</span>` +
      `<div class="text-muted" style="font-size:11px;">${adm_paid_escapeHtmlText(v.price + '/' + v.packageAmount)} × ${v.hours}h</div>`;
  }
  if (row.price) {
    return '<span class="text-warning" title="The subscription price is linked, but the package has no number of classes, so one session cannot be valued. Set the package amount on the Subscription page."><i class="bi bi-exclamation-triangle-fill"></i> set classes</span>';
  }
  if (row.sub) {
    return '<span class="text-warning" title="Subscriber, but their subscription still has no price. Fill it in on the Subscription page and it relinks here."><i class="bi bi-exclamation-triangle-fill"></i> no price</span>';
  }
  return '<span class="text-muted">-</span>';
}

// PRICE TAG cell. A subscriber's row is saved without a price of its own, so
// show the price linked from their subscription instead of 'unlimited' / 0.
// Updating the price on the Subscription page relinks it here.
function adm_paid_priceTagCellHtml(row, payment) {
  const stored = payment ? payment.priceTag : '';
  if (typeof stored === 'number' && isFinite(stored)) return String(stored);
  // A plain number typed as text still counts as this row's own price.
  const asText = String(stored == null ? '' : stored).trim();
  if (/^\d+(\.\d+)?$/.test(asText)) return asText;
  if (row.price) {
    return `<span title="Linked from this student's subscription on the Subscription page">${row.price.price}</span>` +
      `<div class="text-muted" style="font-size:11px;">from subscription</div>`;
  }
  return String(stored || 0);
}

// Statement text to mention on a paid row: prefers the snapshot stored on the
// payment, otherwise falls back to the live subscription's price cell.
function adm_paid_paymentStatement(s, sub) {
  if (s && s.subscriptionStatement) return String(s.subscriptionStatement);
  if (sub && typeof sub.priceTag === 'string') {
    const t = sub.priceTag.trim();
    if (t && !/^\d+(\.\d+)?$/.test(t) && t.toLowerCase() !== 'unlimited') return t;
  }
  return '';
}

// Build the NOTES cell: the payment note (if any) plus a highlighted line
// mentioning the subscription statement the admin typed in the price cell.
function adm_paid_paymentNoteHtml(s, sub) {
  const stmt = adm_paid_paymentStatement(s, sub);
  return `${s.note || (stmt ? '' : '-')}${stmt ? `<div class="text-warning fw-semibold mt-1" style="font-size:12px;"><i class="bi bi-megaphone-fill me-1"></i>${adm_paid_escapeHtmlText(stmt)}</div>` : ''}`;
}
// Paid Payments Page Logic
// Loads payments.json, filters for status: 'Paid', renders cards and tables

async function adm_paid_fetchJson(url) {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Could not load ${url} (${res.status})`);
  return await res.json();
}

function adm_paid_formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB') + ' ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

// Sort key for payment cards: newest submission on top. Prefers the matched
// attendance record's submittedAt (latest save of the session), then the first
// student payment's submittedAt, then the session date as a fallback.
function adm_paid_getSessionSortTime(session, sessions) {
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

function adm_paid_sessionKeyFromPayment(payment) {
  return [payment.createdBy, payment.date, payment.subject, payment.classroom, payment.timeWindow].join('|');
}

function isSessionCompleted(session) {
  return session.students.length > 0 && session.students.every(s => s.adminCompleted === true);
}

async function updateSessionCompleted(session, completed) {
  const requests = session.students.map(s =>
    fetch(`/api/payments/${encodeURIComponent(s.id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adminCompleted: completed })
    })
  );
  const responses = await Promise.all(requests);
  const failed = responses.find(r => !r.ok);
  if (failed) throw new Error('Failed to update completed status.');
}

// —— Teacher quick-summary helpers ——
// Teachers.json is fetched once and reused by every render path (search,
// filters, undo restores), so the summary panel never does duplicate loads.
let teachersCache = null;
async function getTeachers() {
  if (!teachersCache) teachersCache = await adm_paid_fetchJson('/database/teachers.json');
  return teachersCache;
}

// Group raw payments into session cards (same key as the Paid page).
function groupPaidSessions(payments) {
  const sessionMap: { [key: string]: any } = {};
  payments.forEach(p => {
    const key = adm_paid_sessionKeyFromPayment(p);
    if (!sessionMap[key]) sessionMap[key] = { ...p, students: [] };
    sessionMap[key].students.push(p);
  });
  return Object.values(sessionMap as { [key: string]: any });
}

// Case-insensitive first + last name match, identical rule to the cards.
function findTeacherByName(teachersData, name) {
  if (!name) return null;
  const parts = String(name).trim().split(/\s+/);
  const firstName = parts[0] || '';
  const lastName = parts.length > 1 ? parts.slice(1).join(' ') : '';
  return teachersData.find(t => {
    if (!t.firstName || !t.lastName) return false;
    return (
      t.firstName.trim().toLowerCase() === firstName.toLowerCase() &&
      t.lastName.trim().toLowerCase() === lastName.toLowerCase()
    );
  }) || null;
}

async function adm_paid_deleteSessionPayments(session) {
  const requests = session.students.map(s =>
    fetch(`/api/payments/${encodeURIComponent(s.id)}`, {
      method: 'DELETE'
    })
  );
  const responses = await Promise.all(requests);
  const failed = responses.find(r => !r.ok);
  if (failed) throw new Error('Failed to delete session card.');
}


let adm_paid_subscriptionData = [];
async function adm_paid_fetchSubscriptions() {
  try {
    const res = await fetch('/api/subscriptions');
    adm_paid_subscriptionData = await res.json();
  } catch {
    adm_paid_subscriptionData = [];
  }
}

async function adm_paid_renderPaidPayments(paids, summarySessions?: any) {
  const listDiv = document.getElementById('paidPaymentsList');
  if (!paids.length) {
    listDiv.innerHTML = '<div class="text-muted">No paid payments found.</div>';
    return;
  }
  // Group by session/teacher
  const sessionMap: { [key: string]: any } = {};
  paids.forEach(payment => {
    const key = adm_paid_sessionKeyFromPayment(payment);
    if (!sessionMap[key]) {
      sessionMap[key] = {
        ...payment,
        students: []
      };
    }
    sessionMap[key].students.push(payment);
  });
  // Fetch attendance data for patching
  const attendanceData = await adm_paid_fetchJson('/database/teacher-portal/teachers-attendance.json');
  // Fetch teachers data for cut rate (cached)
  const teachersData = await getTeachers();
  // Fetch subscriptions if not already loaded
  if (!adm_paid_subscriptionData || !Array.isArray(adm_paid_subscriptionData) || adm_paid_subscriptionData.length === 0) {
    await adm_paid_fetchSubscriptions();
  }
  const sessionList = Object.values(sessionMap as { [key: string]: any });
  // Newest paid submissions first, oldest at the bottom
  sessionList.sort((a, b) => adm_paid_getSessionSortTime(b, attendanceData) - adm_paid_getSessionSortTime(a, attendanceData));
  // Clear only when everything is ready, then append, so two concurrent
  // renders (e.g. double loadPaidPayments) can never double-append cards.

  // Newest paid sessions first, grouped into collapsible month sections
  // with a year divider — same dashboard layout as the Payments page.
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
    const sessionMinutes = adm_paid_windowMinutes(session.timeWindow);
    const durationStr = sessionMinutes > 0 ? adm_paid_formatDuration(sessionMinutes) : '';
    // Money for every row: cash collected plus the package value a subscriber's
    // session consumed, so their hours finally count towards the salary.
    const moneyRows = session.students.map(s => adm_paid_rowMoney(s, session, adm_paid_subscriptionData));
    const totalPaid = moneyRows.reduce((sum, r) => sum + r.paid, 0);
    const subscriptionTotal = adm_paid_round2(moneyRows.reduce((sum, r) => sum + (r.subValue ? r.subValue.value : 0), 0));
    const billableTotal = adm_paid_round2(totalPaid + subscriptionTotal);
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
    // The cut is taken on everything the session was worth: cash on the form
    // plus the package money the subscribers' hours used up.
    const teacherProfit = Math.round((billableTotal * cutRate) / 100);
    const completed = isSessionCompleted(session);
    const card = document.createElement('div');
    card.className = 'payment-card collapsed';
    const studentsCount = session.students ? session.students.length : 0;
    const timeText = session.timeWindow ? `${session.timeWindow}${durationStr ? ' · ' + durationStr : ''}` : '-';
    card.innerHTML = `
      <div class="payment-card-header d-flex align-items-start justify-content-between" style="min-height: 90px;">
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
            <span><i class="bi bi-send"></i> Submitted ${session.submittedAt ? adm_paid_formatDate(session.submittedAt) : adm_paid_formatDate(session.date)}</span>
          </div>
        </div>
        <div class="teacher-profit-summary text-end bg-light rounded border p-2 ms-3" style="min-width:200px; box-shadow:0 2px 8px rgba(0,0,0,0.04); flex-shrink: 0;">
          <strong>Total Paid by Students:</strong> <span class="text-primary">${totalPaid}</span><br>
          ${subscriptionTotal > 0 ? `<strong>Subscription Value:</strong> <span class="text-primary">${subscriptionTotal}</span><br>
          <strong>Billable Total:</strong> <span class="text-primary">${billableTotal}</span><br>` : ''}
          <strong>Teacher Cut Rate:</strong> <span class="text-info">${cutRate}%</span><br>
          <strong>Teacher Profit:</strong> <span class="text-success">${teacherProfit}</span><br>
          <strong>CEO Cut Rate:</strong> <span class="text-info">${100 - cutRate}%</span><br>
          <strong>CEO Profit:</strong> <span class="text-danger">${billableTotal - teacherProfit}</span>
          <div class="mt-2 paid-card-actions" style="display:block;">
            <div class="d-grid gap-1">
              <button type="button" class="btn btn-sm ${completed ? 'btn-success' : 'btn-outline-success'} js-toggle-completed">${completed ? 'Completed' : 'Mark Completed'}</button>
              <button type="button" class="btn btn-sm btn-outline-danger js-delete-session">Delete Card</button>
            </div>
          </div>
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
                <th>SUB. VALUE</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              ${session.students.map((s, rowIdx) => {
                const row = moneyRows[rowIdx];
                const sub = row.sub;
                return `
                <tr>
                  <td>
                    <span style="${(sub && s.status === 'Paid') ? 'color:#198754;font-weight:bold;' : ''};display:inline-block;min-width:70px;text-align:center;">
                      ${s.studentName || '-'}
                    </span>
                    <div style="font-size:12px;">
                      ${sub
                        ? `<span class='badge bg-success ms-1'><i class='bi bi-star-fill'></i> ${sub.usage || 'subscribed'}${sub.issueDate ? ' (issued: ' + String(sub.issueDate).slice(0, 10) + ')' : ''}</span>`
                        : (row.price ? `<span class='badge bg-success ms-1'><i class='bi bi-star-fill'></i> subscribed</span>` : '')}
                    </div>
                  </td>
                  <td>${typeof s.hours !== 'undefined' ? adm_paid_formatHoursDecimal(Number(s.hours)) : '-'}</td>
                  <td>${(s.cutRate !== undefined && s.cutRate !== null && s.cutRate !== '') ? s.cutRate + '%' : '-'}</td>
                  <td>${adm_paid_paymentNoteHtml(s, sub)}</td>
                  <td>${adm_paid_priceTagCellHtml(row, s)}</td>
                  <td>${s.amount || 0}</td>
                  <td>${adm_paid_subValueCellHtml(row)}</td>
                  <td>${s.status || '-'}</td>
                </tr>
              `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
    // Collapse/expand logic
    const header = card.querySelector('.payment-card-header');
    const details = card.querySelector('.payment-card-details-area');
    card.classList.add('collapsed');
    details.style.display = 'none';
    header.addEventListener('click', (e) => {
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
          // Store the individual student payments for undo (restore each one)
          const deletedPayments = session.students.map(s => JSON.parse(JSON.stringify(s)));

          // Capture the original position of this session in the payments list
          // BEFORE deleting, so the undo restores the card back where it was.
          const allPayments = await (await fetch('/database/teacher-portal/payments.json')).json();
          const firstPaymentIdx = allPayments.findIndex(p => String(p.id) === String(deletedPayments[0] && deletedPayments[0].id));

          await adm_paid_deleteSessionPayments(session);
          adm_paid_allPaids = adm_paid_allPaids.filter(p => adm_paid_sessionKeyFromPayment(p) !== adm_paid_sessionKeyFromPayment(session));

          // Create undo action for session deletion: re-create each student payment individually
          const undoAction = createCustomAction('paid-session', async () => {
            for (let i = 0; i < deletedPayments.length; i++) {
              const p = deletedPayments[i];
              await fetch('/api/payments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...p, _restoreIndex: firstPaymentIdx + i })
              });
            }
            // Reload the paid list from the server so the restored card is
            // rendered back at its original position (not from a stale cache).
            await adm_paid_loadPaidPayments();
          });
          pushAction(undoAction);
          
          await adm_paid_doSearch();
        } catch (err) {
          window.alert(err.message || 'Failed to delete card.');
        }
      });
    }

    const toggleCompletedBtn = card.querySelector('.js-toggle-completed');
    if (toggleCompletedBtn) {
      toggleCompletedBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const nextCompleted = !isSessionCompleted(session);
        try {
          await updateSessionCompleted(session, nextCompleted);
          adm_paid_allPaids = adm_paid_allPaids.map(p => {
            if (adm_paid_sessionKeyFromPayment(p) === adm_paid_sessionKeyFromPayment(session)) {
              return { ...p, adminCompleted: nextCompleted };
            }
            return p;
          });
          await adm_paid_doSearch();
        } catch (err) {
          window.alert(err.message || 'Failed to update completed state.');
        }
      });
    }
    return card;
  }
  // Month sections: newest on top, year dividers, remembered expand/collapse.
  // The session list is already sorted by getSessionSortTime, so keep that order.
  PaymentGroups.attachMonthSections(listDiv, sessionList, buildCard, { sort: false });

  // Teacher quick summary: totals + salary split for the filtered sessions.
  // Cards always render in normal month-grouped mode; the search/filters only
  // decide what the summary panel above shows (summarySessions).
  renderTeacherSummary(summarySessions || sessionList);
}


// —— Teacher quick summary panel ——
// Shown whenever a filter/search is active on the Paid page. One teacher in
// the results → a per-month salary breakdown (total paid, cut rate, teacher
// earnings, CEO profit). Several teachers → a per-teacher breakdown instead.
async function renderTeacherSummary(sessions) {
  const host = document.getElementById('paidTeacherSummary');
  if (!host) return;
  const filterType = document.getElementById('filterPaidType');
  const filterValue = document.getElementById('filterPaidValue');
  const searchInput = document.getElementById('searchPaidInput');
  const startMonthInput = document.getElementById('startMonthInput');
  const endMonthInput = document.getElementById('endMonthInput');    const searchText = searchInput ? searchInput.value.trim() : '';
    const filterActive =
      (filterType && filterType.value && filterValue && filterValue.value) ||
      searchText ||
      (startMonthInput && startMonthInput.value) ||
      (endMonthInput && endMonthInput.value);

  if (!filterActive || !sessions.length) {
    host.innerHTML = '';
    host.style.display = 'none';
    return;
  }

  try {
    const teachersData = await getTeachers();
    // Subscribers' package value counts towards these earnings, so make sure
    // the subscription list is loaded even on a fresh render.
    if (!adm_paid_subscriptionData || !Array.isArray(adm_paid_subscriptionData) || adm_paid_subscriptionData.length === 0) {
      await adm_paid_fetchSubscriptions();
    }
    const teacherNames = [...new Set(
      sessions.map(s => (s.createdBy || s.teacherName || '').trim()).filter(Boolean)
    )];
    const singleTeacher = teacherNames.length === 1 ? teacherNames[0] : null;
    const summaryTeacher = singleTeacher ? findTeacherByName(teachersData, singleTeacher) : null;
    const cutRate = summaryTeacher && summaryTeacher.cutRate !== undefined &&
      summaryTeacher.cutRate !== '' && summaryTeacher.cutRate !== null
      ? Number(summaryTeacher.cutRate) : null;

    // Per-month totals (single teacher) or per-teacher totals (multi).
    const buckets = new Map();
    const bucketKey = singleTeacher
      ? s => PaymentGroups.getSessionMonthKey(s)
      : s => (s.createdBy || s.teacherName || 'Unknown teacher').trim();
    sessions.forEach(s => {
      const key = bucketKey(s);
      if (buckets.has(key) === false) {
        buckets.set(key, {
          name: singleTeacher ? PaymentGroups.getSessionMonthLabel(s)
            : key,
          sortKey: singleTeacher ? key : key.toLowerCase(),
          sessions: 0, students: 0, totalPaid: 0,
          subscriptionValue: 0, billableTotal: 0,
          teacherProfit: 0, ceoProfit: 0, cutRates: new Set(), listed: false,
          cards: []
        });
      }
      const b = buckets.get(key);
      // Cash on the form plus the package slice each subscriber's hours used.
      const moneyRows = s.students.map(st => adm_paid_rowMoney(st, s, adm_paid_subscriptionData));
      const total = moneyRows.reduce((sum, r) => sum + r.paid, 0);
      const subTotal = adm_paid_round2(moneyRows.reduce((sum, r) => sum + (r.subValue ? r.subValue.value : 0), 0));
      const billable = adm_paid_round2(total + subTotal);
      const teacherForCard = findTeacherByName(teachersData, s.createdBy || s.teacherName);
      const rate = teacherForCard && teacherForCard.cutRate !== undefined &&
        teacherForCard.cutRate !== '' && teacherForCard.cutRate !== null
        ? Number(teacherForCard.cutRate) : null;
      const profit = rate === null ? 0 : Math.round((billable * rate) / 100);
      b.sessions += 1;
      b.students += s.students.length;
      b.totalPaid += total;
      b.subscriptionValue += subTotal;
      b.billableTotal += billable;
      b.teacherProfit += profit;
      b.ceoProfit += billable - profit;
      b.cards.push(s);
      if (rate !== null) { b.cutRates.add(rate); b.listed = true; }
    });
    // Keep each bucket's key so the per-row Mark Completed buttons can find
    // the cards of their own month (or teacher) later.
    const rows = [...buckets.entries()]
      .map(([key, b]) => { b.bucketKey = key; return b; })
      .sort((a, b) =>
        singleTeacher ? b.sortKey.localeCompare(a.sortKey) : b.totalPaid - a.totalPaid
      );

    const totals = rows.reduce((acc, b) => {
      acc.totalPaid += b.totalPaid;
      acc.subscriptionValue += b.subscriptionValue;
      acc.billableTotal += b.billableTotal;
      acc.teacherProfit += b.teacherProfit;
      acc.ceoProfit += b.ceoProfit;
      acc.sessions += b.sessions;
      acc.students += b.students;
      return acc;
    }, { totalPaid: 0, subscriptionValue: 0, billableTotal: 0, teacherProfit: 0, ceoProfit: 0, sessions: 0, students: 0 });

    const notFound = singleTeacher && !summaryTeacher;
    const noRate = singleTeacher && summaryTeacher && cutRate === null;
    const monthRange = [startMonthInput && startMonthInput.value, endMonthInput && endMonthInput.value]
      .filter(Boolean).join(' → ');
    const pending = sessions.filter(s => !isSessionCompleted(s));

    const rateCell = cutRate === null
      ? notFound
        ? '<span class="ts-badge ts-badge-warn" title="Teacher not found in the teachers list"><i class="bi bi-exclamation-triangle-fill"></i> not in list</span>'
        : '<span class="ts-badge ts-badge-warn" title="No cut rate set — the full amount counts as your profit"><i class="bi bi-exclamation-triangle-fill"></i> rate not set</span>'
      : fmtRate(cutRate);

    host.innerHTML =
      '<div class="ts-card">' +
        '<div class="ts-header">' +
          '<div class="ts-heading">' +
            '<div class="ts-title"><i class="bi bi-person-badge-fill"></i> ' +
              (singleTeacher
                ? '<span class="ts-teacher-name">' + adm_paid_escapeHtmlText(singleTeacher) + '</span> — Month Salary Summary'
                : 'Filtered Sessions Summary') +
            '</div>' +
            '<div class="ts-sub">' +
              totals.sessions + ' session form' + (totals.sessions === 1 ? '' : 's') +
              ' · ' + totals.students + ' student payment' + (totals.students === 1 ? '' : 's') +
              (totals.subscriptionValue ? ' · Subscription value ' + adm_paid_round2(totals.subscriptionValue) : '') +
              (searchText ? ' · Search: "' + adm_paid_escapeHtmlText(searchText) + '"' : '') +
              (monthRange ? ' · ' + adm_paid_escapeHtmlText(monthRange) : '') +
              (singleTeacher && summaryTeacher ? ' · Cut rate ' + rateCell + ' (from the Teachers page)' : '') +
            '</div>' +
          '</div>' +            '<button type="button" class="btn ' + (pending.length ? 'btn-success' : 'btn-outline-danger') +
            ' ts-bulk-btn" id="tsMarkAllCompleted">' +
            '<i class="bi bi-' + (pending.length ? 'check2-all' : 'arrow-counterclockwise') + ' me-1"></i>' +
            (pending.length
              ? 'Mark All Completed (' + pending.length + ')'
              : 'Unmark All Completed') +
          '</button>' +
        '</div>' +
        '<div class="table-responsive"><table class="table table-sm table-bordered align-middle mb-0 ts-table">' +
          '<thead><tr>' +
            '<th>' + (singleTeacher ? 'MONTH' : 'TEACHER') + '</th>' +
            '<th class="text-center">FORMS</th><th class="text-center">STUDENTS</th>' +
            '<th class="text-end">TOTAL PAID BY STUDENTS</th>' +
            '<th class="text-end">SUBSCRIPTION VALUE</th>' +
            '<th class="text-center">CUT RATE</th>' +
            '<th class="text-end">TEACHER EARNINGS</th>' +
            '<th class="text-end">CEO PROFIT (YOURS)</th>' +
            '<th class="text-center">ACTION</th>' +
          '</tr></thead>' +
          '<tbody>' + rows.map(function (b) {
            const rateTxt = b.cutRates.size === 0 ? '<span class="ts-badge ts-badge-warn">—</span>'
              : b.cutRates.size === 1 ? fmtRate([...b.cutRates][0])
              : '<span class="ts-badge ts-badge-mixed">mixed</span>';
            return '<tr>' +
              '<td class="ts-row-name">' + adm_paid_escapeHtmlText(b.name) + '</td>' +
              '<td class="text-center">' + b.sessions + '</td>' +
              '<td class="text-center">' + b.students + '</td>' +
              '<td class="text-end fw-semibold">' + b.totalPaid + '</td>' +
              '<td class="text-end">' + adm_paid_round2(b.subscriptionValue) + '</td>' +
              '<td class="text-center">' + rateTxt + '</td>' +
              '<td class="text-end text-success fw-semibold">' + b.teacherProfit + '</td>' +
              '<td class="text-end ts-ceo-cell">' + b.ceoProfit + '</td>' +
              '<td class="text-center ts-action-cell">' + rowCompleteButton(b) + '</td>' +
              '</tr>';
          }).join('') + '</tbody>' +
          '<tfoot><tr>' +
            '<td>Total</td><td class="text-center">' + totals.sessions + '</td>' +
            '<td class="text-center">' + totals.students + '</td>' +
            '<td class="text-end">' + totals.totalPaid + '</td>' +
            '<td class="text-end">' + adm_paid_round2(totals.subscriptionValue) + '</td><td></td>' +
            '<td class="text-end">' + totals.teacherProfit + '</td>' +
            '<td class="text-end ts-ceo-cell ts-ceo-total">' + totals.ceoProfit + '</td>' +
            '<td></td>' +
          '</tr></tfoot>' +
        '</table></div>' +
        '<div class="ts-footnote"><i class="bi bi-info-circle"></i> Subscribers pay up-front, so their sessions are valued as <strong>package price ÷ number of classes × hours taken</strong> and shown as SUBSCRIPTION VALUE. ' +
        'Teacher Earnings = (Total Paid + Subscription Value) × Cut Rate % (same session-by-session maths as each form). ' +
        'CEO Profit is what stays with you after paying the teacher. ' +
        'The <strong>Mark Completed</strong> button on each row records that that month\'s teacher share was paid — undo works too.</div>' +
      '</div>'+
      '';

    host.style.display = '';
    const bulkBtn = document.getElementById('tsMarkAllCompleted');
    if (bulkBtn) {
      bulkBtn.addEventListener('click', function () {
        markAllSessionsCompleted(sessions);
      });
    }
    // Per-row buttons: toggle completion for the cards of that one month (or,
    // when the rows are teachers, only the cards of that one teacher).
    host.querySelectorAll('.ts-row-complete').forEach(btn => {
      btn.addEventListener('click', function () {
        const bucket = rows.find(r => r.bucketKey === btn.getAttribute('data-bucket'));
        if (bucket) markAllSessionsCompleted(bucket.cards);
      });
    });
  } catch (err) {
    host.innerHTML = '<div class="ts-card text-danger">Could not build the teacher summary.</div>';
    host.style.display = '';
  }
}

function fmtRate(rate) {
  return '<span class="ts-badge ts-badge-ok">' + rate + '%</span>';
}

// Per-row action button next to CEO Profit. Visible pending cards → a green
// Mark Completed button; a fully completed row → a red Unmark button that
// clears the month when paid status changes.
function rowCompleteButton(bucket) {
  const pendingInBucket = bucket.cards.filter(s => !isSessionCompleted(s)).length;
  const done = !pendingInBucket;
  return '<button type="button" class="btn btn-sm ' + (done ? 'btn-outline-danger' : 'btn-outline-success') +
    ' ts-row-complete" data-bucket="' + adm_paid_escapeHtmlText(bucket.bucketKey) + '" title="' +
    (done
      ? 'Unmark every session form in this row — click Mark Completed again to re-record the month as paid'
      : 'Mark every session form in this row completed — records the teacher share as paid for this month') +
    '"><i class="bi bi-' + (done ? 'arrow-counterclockwise' : 'check2-all') + '"></i> ' +
    (done ? 'Unmark Completed' : 'Mark Completed (' + pendingInBucket + ')') + '</button>';
}

// Bulk toggle for a scope of cards (whole filter or one month row): if any
// pending cards exist, one click marks them all completed; clicking again
// unmarks them all. Either batch can be reversed with the header undo button.
async function markAllSessionsCompleted(scopeSessions) {
  if (!scopeSessions || !scopeSessions.length) return;
  const toComplete = scopeSessions.filter(s => !isSessionCompleted(s));
  // Any pending card → complete them all; a fully completed scope → unmark.
  const marking = toComplete.length > 0;
  const targets = marking ? toComplete : scopeSessions;
  const ok = window.confirm(
    marking
      ? 'Mark all ' + targets.length + ' session form(s) as completed?\n' +
        'The header undo button can revert this.'
      : 'Unmark all ' + targets.length + ' completed session form(s)?\n' +
        'The header undo button can revert this.'
  );
  if (!ok) return;
  const bulkBtn = document.getElementById('tsMarkAllCompleted');
  if (bulkBtn) { bulkBtn.disabled = true; bulkBtn.innerHTML = '<i class="bi bi-hourglass-split me-1"></i>Saving…'; }
  try {
    for (const s of targets) {
      await updateSessionCompleted(s, marking);
    }
    // Mirror the change into the local cache so cards re-render accordingly.
    const keys = new Set(targets.map(adm_paid_sessionKeyFromPayment));
    adm_paid_allPaids = adm_paid_allPaids.map(p =>
      keys.has(adm_paid_sessionKeyFromPayment(p)) ? { ...p, adminCompleted: marking } : p
    );
    if (window.pushAction) {
      const undoAction = window.createCustomAction('paid-session', async () => {
        for (const s of targets) {
          try { await updateSessionCompleted(s, !marking); } catch (e) { /* keep going */ }
        }
        await adm_paid_loadPaidPayments();
      });
      window.pushAction(undoAction);
    }
    await adm_paid_doSearch();
  } catch (err) {
    window.alert(err.message || 'Failed to update completed status.');
    if (bulkBtn) { bulkBtn.disabled = false; }
  }
}

let adm_paid_allPaids = [];
let adm_paid_lastSearch = '';
let currentFilterState = {
  filterType: '',
  filterValue: '',
  startMonth: '',
  endMonth: '',
  search: ''
};
let adm_paid_doSearch = async function() {
  const search = document.getElementById('searchPaidInput').value.trim().toLowerCase();
  adm_paid_lastSearch = search;
  if (!search) {
    await adm_paid_renderPaidPayments(adm_paid_allPaids);
    return;
  }
  // Filter sessions by teacher, subject, or student name
  const filtered = adm_paid_allPaids.filter(p => {
    if (
      (p.createdBy && p.createdBy.toLowerCase().includes(search)) ||
      (p.subject && p.subject.toLowerCase().includes(search)) ||
      (p.studentName && p.studentName.toLowerCase().includes(search))
    ) {
      return true;
    }
    return false;
  });
  await adm_paid_renderPaidPayments(filtered);
}
async function adm_paid_loadPaidPayments() {
  const payments = await adm_paid_fetchJson('/database/teacher-portal/payments.json');
  // Every student row belongs on exactly one page, so the Paid page collects
  // the paid rows themselves. A student who has paid shows up here even when
  // someone else on the same form still owes money — that row stays on the
  // Payments, Partial or Unpaid page instead of dragging the paid one with it.
  adm_paid_allPaids = payments.filter(p => String(p.status || '').trim().toLowerCase() === 'paid');
  await adm_paid_doSearch();
}
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchPaidInput');
  const filterType = document.getElementById('filterPaidType');
  const filterValue = document.getElementById('filterPaidValue');
  const filterSummary = document.getElementById('paidFilterSummary');
  const startMonthInput = document.getElementById('startMonthInput');
  const endMonthInput = document.getElementById('endMonthInput');

  // Load paid payments on page load — restoring the last filter only after a
  // refresh; a fresh navigation into this page shows the default no-filter view.
  const PAID_FILTER_KEY = 'paidPageFilterState';
  function isPageReload() {
    try {
      const entries: any = window.performance && window.performance.getEntriesByType('navigation');
      if (entries && entries[0] && entries[0].type) return entries[0].type === 'reload';
      const legacy = window.performance && window.performance.navigation;
      return legacy ? legacy.type === 1 : false;
    } catch (e) { return false; }
  }
  function loadSavedFilter() {
    try { return JSON.parse(localStorage.getItem(PAID_FILTER_KEY) || 'null'); }
    catch (e) { return null; }
  }
  async function initPaidPage() {
    // Refresh → bring back the saved teacher/month filter; any other entry
    // (sidebar navigation, back button, first visit) → clear and start clean.
    const saved = isPageReload() ? loadSavedFilter() : null;
    if (!saved) {
      try { localStorage.removeItem(PAID_FILTER_KEY); } catch (e) { /* ignore */ }
    }
    await adm_paid_loadPaidPayments();
    if (saved) {
      searchInput.value = saved.search || '';
      filterType.value = saved.filterType || '';
      if (filterType.value) {
        populateFilterValueOptions();
        filterValue.value = saved.filterValue || '';
      } else {
        filterValue.innerHTML = '';
        filterValue.style.display = 'none';
      }
      startMonthInput.value = saved.startMonth || '';
      endMonthInput.value = saved.endMonth || '';
    }
    await adm_paid_doSearch();
  }
  initPaidPage();

  // Late-bound so typing runs the patched doSearch (cards normal, summary filtered).
  searchInput.addEventListener('input', function () { adm_paid_doSearch(); });
  const applyBtn = document.getElementById('applyPaidFilterBtn');
  // Populate the second dropdown with the values of the selected filter type.
  // Used by the filter-type change handler and after restoring a saved filter.
  function populateFilterValueOptions() {
    // Group by session for filter values
    const sessionMap: { [key: string]: any } = {};
    adm_paid_allPaids.forEach(payment => {
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
  }
  filterType.addEventListener('change', async () => {
    filterValue.innerHTML = '';
    filterValue.style.display = 'none';
    filterSummary.textContent = '';
    applyBtn.style.display = 'none';
    if (!filterType.value) {
      adm_paid_doSearch();
      return;
    }
    populateFilterValueOptions();
  });
  // Only apply filter when Apply button is clicked
  applyBtn.addEventListener('click', function(e) {
    e.preventDefault();
    adm_paid_doSearch();
  });
  // Hide Apply button if filter is reset
  filterValue.addEventListener('change', () => {
    if (!filterValue.value) applyBtn.style.display = '';
  });
  // Patch doSearch to support filter and month range
  adm_paid_doSearch = async function() {
    const search = searchInput.value.trim().toLowerCase();
    let filtered = adm_paid_allPaids;
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
    currentFilterState = {
      filterType: filterType.value || '',
      filterValue: filterValue.value || '',
      startMonth,
      endMonth,
      search
    };
    // Persist the running filter so a refresh (F5) puts everything back.
    try { localStorage.setItem('paidPageFilterState', JSON.stringify(currentFilterState)); } catch (e) { /* private mode */ }
    // Show summary for filtered payments
    let totalPaid = filtered.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    let summary = '';
    if ((filterType.value && filterValue.value) || startMonth || endMonth) {
      // Subscriber rows hold no cash amount, so show the package value that the
      // filter also covers — the same figure the salary summary works from.
      const subscriptionValue = adm_paid_round2(groupPaidSessions(filtered).reduce((sum, ses) =>
        sum + ses.students.reduce((rowSum, st) => {
          const row = adm_paid_rowMoney(st, ses, adm_paid_subscriptionData);
          return rowSum + (row.subValue ? row.subValue.value : 0);
        }, 0), 0));
      summary = `Filtered Total Paid by Students: ${totalPaid}`;
      if (subscriptionValue > 0) summary += ` | Subscription Value: ${subscriptionValue}`;
      if (startMonth) summary += ` | From: ${startMonth}`;
      if (endMonth) summary += ` | To: ${endMonth}`;
    }
    filterSummary.textContent = summary;
    // Filter mode (dropdown teacher/subject/student) narrows the cards below
    // to that selection across the month tab range. A typed search alone
    // keeps the cards in normal mode and only drives the summary panel above.
    if (filterType.value && filterValue.value) {
      await adm_paid_renderPaidPayments(filtered, groupPaidSessions(filtered));
    } else {
      await adm_paid_renderPaidPayments(adm_paid_allPaids, groupPaidSessions(filtered));
    }
  };
});


// (TypeScript conversion shim: original global name kept available for
// co-loaded scripts and inline HTML handlers — same lookup as before)
if (typeof adm_paid_formatHoursDecimal !== 'undefined') { window.adm_paid_formatHoursDecimal = adm_paid_formatHoursDecimal; }
if (typeof adm_paid_formatDuration !== 'undefined') { window.adm_paid_formatDuration = adm_paid_formatDuration; }
if (typeof adm_paid_escapeHtmlText !== 'undefined') { window.adm_paid_escapeHtmlText = adm_paid_escapeHtmlText; }
if (typeof adm_paid_paymentStatement !== 'undefined') { window.paymentStatement = adm_paid_paymentStatement; }
if (typeof adm_paid_paymentNoteHtml !== 'undefined') { window.paymentNoteHtml = adm_paid_paymentNoteHtml; }
if (typeof adm_paid_fetchJson !== 'undefined') { window.fetchJson = adm_paid_fetchJson; }
if (typeof adm_paid_formatDate !== 'undefined') { window.formatDate = adm_paid_formatDate; }
if (typeof adm_paid_getSessionSortTime !== 'undefined') { window.getSessionSortTime = adm_paid_getSessionSortTime; }
if (typeof adm_paid_sessionKeyFromPayment !== 'undefined') { window.sessionKeyFromPayment = adm_paid_sessionKeyFromPayment; }
if (typeof adm_paid_deleteSessionPayments !== 'undefined') { window.deleteSessionPayments = adm_paid_deleteSessionPayments; }
if (typeof adm_paid_fetchSubscriptions !== 'undefined') { window.fetchSubscriptions = adm_paid_fetchSubscriptions; }
if (typeof adm_paid_renderPaidPayments !== 'undefined') { window.renderPaidPayments = adm_paid_renderPaidPayments; }
if (typeof adm_paid_doSearch !== 'undefined') { window.doSearch = adm_paid_doSearch; }
if (typeof adm_paid_loadPaidPayments !== 'undefined') { window.loadPaidPayments = adm_paid_loadPaidPayments; }


// (TypeScript conversion shim: original global name kept available for
// co-loaded scripts and inline HTML handlers — same lookup as before)
if (typeof adm_paid_paymentStatement !== 'undefined') { window.paymentStatement = adm_paid_paymentStatement; }
if (typeof adm_paid_paymentNoteHtml !== 'undefined') { window.paymentNoteHtml = adm_paid_paymentNoteHtml; }
if (typeof adm_paid_fetchJson !== 'undefined') { window.fetchJson = adm_paid_fetchJson; }
if (typeof adm_paid_formatDate !== 'undefined') { window.formatDate = adm_paid_formatDate; }
if (typeof adm_paid_getSessionSortTime !== 'undefined') { window.getSessionSortTime = adm_paid_getSessionSortTime; }
if (typeof adm_paid_sessionKeyFromPayment !== 'undefined') { window.sessionKeyFromPayment = adm_paid_sessionKeyFromPayment; }
if (typeof adm_paid_deleteSessionPayments !== 'undefined') { window.deleteSessionPayments = adm_paid_deleteSessionPayments; }
if (typeof adm_paid_fetchSubscriptions !== 'undefined') { window.fetchSubscriptions = adm_paid_fetchSubscriptions; }
if (typeof adm_paid_renderPaidPayments !== 'undefined') { window.renderPaidPayments = adm_paid_renderPaidPayments; }
if (typeof adm_paid_doSearch !== 'undefined') { window.doSearch = adm_paid_doSearch; }
if (typeof adm_paid_loadPaidPayments !== 'undefined') { window.loadPaidPayments = adm_paid_loadPaidPayments; }
