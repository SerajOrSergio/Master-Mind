// Convert decimal hours to 'X hour(s) Y minute(s)'
function rec_payments_formatHoursDecimal(decimal) {
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
function rec_payments_formatDuration(mins) {
  const hours = Math.floor(mins / 60);
  const minutes = mins % 60;
  const parts = [];
  if (hours > 0) parts.push(hours + (hours === 1 ? ' hour' : ' hours'));
  if (minutes > 0) parts.push(minutes + (minutes === 1 ? ' minute' : ' minutes'));
  return parts.length ? parts.join(' and ') : '0 minutes';
}

// Escape HTML so statement text typed in a subscription cell renders safely.
function rec_payments_escapeHtmlText(str) {
  return String(str == null ? '' : str).replace(/[&<>"']/g, function(m) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
  });
}

// When syncing a subscription price from a paid amount, keep any statement
// text the user typed in the price cell (e.g. 'English class "700"') and only
// swap in the LAST number (e.g. -> 'English class "800"').
function mergeStatementPrice(statement, newPrice) {
  const s = String(statement == null ? '' : statement).trim();
  if (!s || /^\d+(\.\d+)?$/.test(s)) return newPrice;
  const matches = s.match(/\d+(\.\d+)?/g);
  if (!matches || !matches.length) return `${s} ${newPrice}`;
  const last = matches[matches.length - 1];
  const idx = s.lastIndexOf(last);
  return s.slice(0, idx) + String(newPrice) + s.slice(idx + last.length);
}

// Statement text to mention on a payment row: prefers the snapshot stored on
// the payment when it was created, otherwise falls back to the live
// subscription's price cell (e.g. 'English class "700"' / 'still owes us 700').
function rec_payments_paymentStatement(s, sub) {
  if (s && s.subscriptionStatement) return String(s.subscriptionStatement);
  if (sub && typeof sub.priceTag === 'string') {
    const t = sub.priceTag.trim();
    if (t && !/^\d+(\.\d+)?$/.test(t) && t.toLowerCase() !== 'unlimited') return t;
  }
  return '';
}

// Build the NOTES cell: the payment note (if any) plus a highlighted line
// mentioning the subscription statement the admin typed in the price cell.
function rec_payments_paymentNoteHtml(s, sub) {
  const stmt = rec_payments_paymentStatement(s, sub);
  return `${s.note || (stmt ? '' : '-')}${stmt ? `<div class="text-warning fw-semibold mt-1" style="font-size:12px;"><i class="bi bi-megaphone-fill me-1"></i>${rec_payments_escapeHtmlText(stmt)}</div>` : ''}`;
}
// Payments Page Logic
// Loads session-form.json and payments.json, renders cards and tables


async function rec_payments_fetchJson(url) {
  // no-store: always read the live file, never a stale browser copy, so a
  // newly saved payment can never be missing from this page.
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Could not load ${url} (${res.status})`);
  return await res.json();
}

// New session-form rows waiting for the receptionist/admin to set a price.
// Rows that already have money or a settled status belong to the Paid, Partial
// or Unpaid page instead, so the Payments page stays the intake worklist.
function isNewPaymentRow(row) {
  if (!row) return false;
  const status = String(row.status || '').trim().toLowerCase();
  if (status === 'paid' || status === 'partial') return false;
  const priceTag = Number(row.priceTag) || 0;
  const amount = Number(row.amount) || 0;
  return priceTag <= 0 && amount <= 0;
}

// Fetch subscriptions once and cache
let rec_payments_subscriptionData = [];
async function rec_payments_fetchSubscriptions() {
  try {
    const res = await fetch('/api/subscriptions');
    rec_payments_subscriptionData = await res.json();
  } catch {
    rec_payments_subscriptionData = [];
  }
}

function rec_payments_formatDate(dateStr, withTime = false) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  let date = d.toLocaleDateString('en-GB');
  if (withTime) {
    date += ' ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  }
  return date;
}

// Sort key for payment cards: newest submission on top. Prefers the matched
// attendance record's submittedAt (latest save of the session), then the first
// student payment's submittedAt, then the session date as a fallback.
function rec_payments_getSessionSortTime(session, sessions) {
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

// Length of a session window in hours (first slot -> last slot, overnight safe).
function hoursFromTimeWindow(windowStr) {
  const times = String(windowStr || '').split('-').map(t => t.trim()).filter(Boolean);
  if (times.length < 2) return 0;
  const toMinutes = (t) => {
    const [h, m] = String(t).split(':');
    const hh = Number(h);
    const mm = Number(m);
    if (isNaN(hh) || isNaN(mm)) return null;
    return hh * 60 + mm;
  };
  const start = toMinutes(times[0]);
  const end = toMinutes(times[times.length - 1]);
  if (start === null || end === null) return 0;
  let mins = end - start;
  if (mins < 0) mins += 24 * 60;
  return mins > 0 ? mins / 60 : 0;
}

// Small dialog behind the "Subscribed" button: pick the plan type (classes or
// hours) and how many units the package holds. Resolves to null when cancelled.
function openSubscribeSetupDialog(defaultPrice): Promise<any> {
  return new Promise<any>((resolve: any) => {
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(28,24,20,.45);z-index:2000;display:flex;align-items:center;justify-content:center;padding:16px;';
    overlay.innerHTML = `
      <div style="background:#fff;border-radius:16px;max-width:430px;width:100%;padding:22px;box-shadow:0 20px 50px rgba(28,24,20,.25);text-align:left;">
        <div style="font-weight:800;font-size:1.05rem;color:#1C1814;">Set up subscription</div>
        <div style="color:#6b7280;font-size:.85rem;margin:2px 0 14px;">Pick the plan this student is buying. This session counts as the first use.</div>
        <label style="font-weight:600;font-size:.85rem;color:#374151;">Plan type</label>
        <select class="js-sub-type form-select form-select-sm mb-2">
          <option value="classes">Classes</option>
          <option value="hours">Hours</option>
        </select>
        <label style="font-weight:600;font-size:.85rem;color:#374151;">Package amount <span class="js-sub-pkg-label">(number of classes)</span></label>
        <input class="js-sub-pkg form-control form-control-sm mb-2" type="number" min="1" step="1" value="10" />
        <label style="font-weight:600;font-size:.85rem;color:#374151;">Price paid</label>
        <input class="js-sub-price form-control form-control-sm mb-2" type="number" min="0" step="1" value="${defaultPrice === 'unlimited' ? '' : (Number(defaultPrice) || '')}" />
        <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:12px;">
          <button type="button" class="js-sub-cancel btn btn-light btn-sm">Cancel</button>
          <button type="button" class="js-sub-save btn btn-primary btn-sm">Subscribe</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    const typeSel = overlay.querySelector('.js-sub-type') as HTMLSelectElement;
    const pkgLabel = overlay.querySelector('.js-sub-pkg-label');
    if (typeSel && pkgLabel) {
      typeSel.addEventListener('change', () => {
        pkgLabel.textContent = typeSel.value === 'hours' ? '(number of hours)' : '(number of classes)';
      });
    }
    const close = (value) => { overlay.remove(); resolve(value); };
    (overlay.querySelector('.js-sub-cancel') as HTMLElement).addEventListener('click', () => close(null));
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(null); });
    (overlay.querySelector('.js-sub-save') as HTMLElement).addEventListener('click', () => {
      const type = typeSel && typeSel.value === 'hours' ? 'hours' : 'classes';
      const pkgInput = overlay.querySelector('.js-sub-pkg') as HTMLInputElement;
      const priceInput = overlay.querySelector('.js-sub-price') as HTMLInputElement;
      const packageAmount = Math.max(1, Math.floor(Number(pkgInput && pkgInput.value) || 0));
      const priceRaw = Number(priceInput && priceInput.value);
      const price = priceRaw > 0 ? priceRaw : defaultPrice;
      close({ type, packageAmount, price });
    });
  });
}

function renderPayments(sessions, payments) {
  const listDiv = document.getElementById('paymentsList');
  listDiv.innerHTML = '';
  // Only render cards for payments
  // Group payments by session (date, teacher, subject, classroom, timeWindow)
  const sessionMap: { [key: string]: any } = {};
  payments.forEach(payment => {
    // Patch missing grade and schoolName for each payment from sessions (teachers-attendance.json)
    if (!payment.grade || !payment.schoolName) {
      const match = sessions.find(ses =>
        (ses.teacherName === payment.createdBy || ses.teacherName === payment.teacherName) &&
        ses.date === payment.date &&
        ses.subject === payment.subject &&
        ses.classroom === payment.classroom &&
        ses.timeWindow === payment.timeWindow
      );
      if (match) {
        if (!payment.grade) payment.grade = match.grade;
        if (!payment.schoolName) payment.schoolName = match.schoolName;
      }
    }
    const key = [payment.createdBy, payment.date, payment.subject, payment.classroom, payment.timeWindow].join('|');
    if (!sessionMap[key]) {
      sessionMap[key] = {
        ...payment,
        students: []
      };
    }
    sessionMap[key].students.push(payment);
  });
  // Only forms that still contain a brand-new row (no price tag and no amount)
  // stay on this page. Paid / Partial / Unpaid rows live on their own pages.
  const sessionList = Object.values(sessionMap as { [key: string]: any }).filter(session =>
    session.students.some(isNewPaymentRow)
  );
  if (sessionList.length === 0) {
    const filterType = document.getElementById('filterPaymentsType');
    const filterValue = document.getElementById('filterPaymentsValue');
    const startMonthInput = document.getElementById('startMonthInput');
    const endMonthInput = document.getElementById('endMonthInput');
    const filterActive = (filterType && filterType.value && filterValue && filterValue.value) ||
      (startMonthInput && startMonthInput.value) || (endMonthInput && endMonthInput.value);
    listDiv.innerHTML = filterActive
      ? '<div class="payments-empty-state"><i class="bi bi-funnel"></i><div>No new session forms match your filters.</div></div>'
      : '<div class="payments-empty-state"><i class="bi bi-check2-circle"></i><div>No new session forms waiting for a price. Everything is on the Paid, Partial or Unpaid page.</div></div>';
    return;
  }
  // Newest session submissions first, oldest at the bottom. The grouping
  // helper keeps that order and folds the cards into month sections.
  sessionList.sort((a, b) => rec_payments_getSessionSortTime(b, sessions) - rec_payments_getSessionSortTime(a, sessions));
  const searchInputEl = document.getElementById('searchInput');
  const filterTypeEl = document.getElementById('filterPaymentsType');
  const filterValueEl = document.getElementById('filterPaymentsValue');
  const startMonthEl = document.getElementById('startMonthInput');
  const endMonthEl = document.getElementById('endMonthInput');
  const filtersActive = (searchInputEl && searchInputEl.value.trim()) ||
    (filterTypeEl && filterTypeEl.value && filterValueEl && filterValueEl.value) ||
    (startMonthEl && startMonthEl.value) || (endMonthEl && endMonthEl.value);

  // Each card is built by this callback and placed by the grouping helper.
  function buildCard(session) {
    // Patch missing grade and schoolName from teachers-attendance.json (sessions)
    const matches = sessions.filter(ses =>
      (ses.teacherName === session.createdBy || ses.teacherName === session.teacherName) &&
      ses.date === session.date &&
      ses.subject === session.subject &&
      ses.classroom === session.classroom &&
      ses.timeWindow === session.timeWindow
    );
    if ((!session.grade || !session.schoolName) && matches.length > 0) {
      const match = matches[0];
      if (!session.grade) session.grade = match.grade;
      if (!session.schoolName) session.schoolName = match.schoolName;
    }
    // Patch each student's phone with latest from studentsDb if available
    // Phone number is now always patched by backend; no need to patch here.
    const card = document.createElement('div');
    card.dataset.sessionKey = [session.createdBy, session.date, session.subject, session.classroom, session.timeWindow].join('|');
    card.className = 'payment-card collapsed';
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
        durationStr = mins > 0 ? rec_payments_formatDuration(mins) : '';
      }
    }
    // Show date and time for Submitted field
    let submittedDate = '';
    if (session.submittedAt) {
      // If submittedAt is ISO string, use full date and time
      submittedDate = rec_payments_formatDate(session.submittedAt, true);
    } else if (session.date && session.timeWindow) {
      // Combine date and first time in timeWindow
      const firstTime = session.timeWindow.split('-')[0].trim();
      const dateTimeStr = session.date + 'T' + firstTime;
      submittedDate = rec_payments_formatDate(dateTimeStr, true);
    } else {
      submittedDate = rec_payments_formatDate(session.date);
    }
    // Only new rows are listed; the original index is carried along so the
    // status buttons still edit the right row of session.students.
    const allRows = (session.students || [])
      .map((s, idx) => ({ s, idx }))
      .filter(entry => isNewPaymentRow(entry.s));
    const studentsCount = allRows.length;
    const timeText = session.timeWindow ? `${session.timeWindow}${durationStr ? ' · ' + durationStr : ''}` : '-';
    card.innerHTML = `
      <div class="payment-card-header">
        <div class="payment-card-main">
          <span class="payment-card-chevron"><i class="bi bi-chevron-right"></i></span>
          <div class="payment-card-heading">
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
            <span><i class="bi bi-send"></i> Submitted ${submittedDate}</span>
          </div>
        </div>
        <div class="payment-card-header-actions">
          <span class="hide-btn">Show</span>
          <button class="delete-btn">Delete</button>
        </div>
      </div>
      <div class="payment-card-details-area" style="display:none;">
        <div class="table-responsive">
          <table class="table table-bordered table-hover align-middle mb-0">
            <thead class="table-light">
              <tr>
                <th>STUDENT</th>
                <th>PHONE</th>
                <th>SUBSCRIPTION USAGE</th>
                <th>HOURS TAKEN</th>
                <th>CUT RATE</th>
                <th>NOTES</th>
                <th>PRICE TAG</th>
                <th>AMOUNT</th>
                <th>PAID</th>
              </tr>
            </thead>
            <tbody>
              ${allRows.map(({ s, idx }) => {
                // Improved subscription match: by studentId first, then by normalized name
                let sub = null;
                if (s.studentId) {
                  sub = rec_payments_subscriptionData.find(sub => sub.studentId && String(sub.studentId) === String(s.studentId));
                }
                if (!sub && s.studentName) {
                  const normName = s.studentName.trim().toLowerCase();
                  sub = rec_payments_subscriptionData.find(sub => sub.studentFullName && sub.studentFullName.trim().toLowerCase() === normName);
                }
                // If student has a subscription, always treat as Paid
                let isPaid = s.status === 'Paid' || !!sub;
                let subInfo = '';
                let subDetails = '';
                let nameHtml = `<div>${s.studentName || '-'}</div>`;
                if (isPaid) {
                  // Green for paid by subscription or status
                  nameHtml = `<div style=\"color:#198754;font-weight:bold;\">${s.studentName || '-'}</div>`;
                }
                if (sub) {
                  subInfo = `<span class='badge bg-success ms-1'><i class=\"bi bi-star-fill\"></i> ${sub.usage}${sub.expirationDate ? ` (expires: ${sub.expirationDate})` : ''}</span>`;
                  subDetails = `
                    <div class=\"subscription-details-table-wrapper mt-2\" style=\"background:#f6fffa; border-radius:6px; padding:8px; border:1px solid #b6f0d3;\">
                      <div class=\"fw-bold mb-1\" style=\"color:#198754;\"><i class=\"bi bi-info-circle\"></i> Subscription Details</div>
                      <table class=\"table table-bordered table-sm mb-0\" style=\"background:#f6fffa;\">
                        <thead class=\"table-light\">
                          <tr>
                            <th>Type</th>
                            <th>Usage</th>
                            <th>Package</th>
                            <th>Expires</th>
                            <th>Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>${sub.type || '-'}</td>
                            <td>${sub.usage || '-'}</td>
                            <td>${typeof sub.packageAmount !== 'undefined' ? sub.packageAmount : '-'}</td>
                            <td>${sub.expirationDate || '-'}</td>
                            <td>${rec_payments_escapeHtmlText(sub.priceTag) || '-'}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  `;
                } else {
                  subInfo = '<span class=\"text-muted\">No subscription</span>';
                  subDetails = '';
                }
                return `
                <tr data-payment-id=\"${s.id}\" data-idx=\"${idx}\">
                  <td style=\"vertical-align:top;\">
                    ${nameHtml}
                    ${subDetails}
                  </td>
                  <td>${s.phone || '-'}</td>
                  <td>${subInfo}</td>
                  <td>${typeof s.hours !== 'undefined' ? rec_payments_formatHoursDecimal(Number(s.hours)) : '-'}</td>
                  <td>${(s.cutRate !== undefined && s.cutRate !== null && s.cutRate !== '') ? s.cutRate + '%' : '-'}</td>
                  <td>${rec_payments_paymentNoteHtml(s, sub)}</td>
                  <td><input type=\"number\" class=\"form-control form-control-sm price-tag-input\" value=\"${s.priceTag && s.priceTag !== 0 ? s.priceTag : ''}\" style=\"width:70px;\" /></td>
                  <td><input type=\"number\" class=\"form-control form-control-sm amount-input\" value=\"${s.amount && s.amount !== 0 ? s.amount : ''}\" style=\"width:70px;\" /></td>
                  <td>
                    <div class=\"payment-status-actions\">
                      <button type=\"button\" class=\"btn btn-outline-success btn-sm status-btn status-paid\">✓ Paid</button>
                      <button type=\"button\" class=\"btn btn-outline-warning btn-sm status-btn status-partial\" data-idx=\"${idx}\">/ Partial</button>
                      <button type=\"button\" class=\"btn btn-outline-danger btn-sm status-btn status-unpaid\">✗ Unpaid</button>
                      ${!sub ? '<button type=\"button\" class=\"btn btn-outline-primary btn-sm status-btn status-subscribed\">Subscribed</button>' : ''}
                    </div>
                  </td>
                </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
    // Toggle expand/collapse — the shared helper also remembers that this
    // session card was open, so a payment update does not snap it shut.
    PaymentGroups.attachCardToggle(card);
    // Delete button logic (delete all payments for this session)
    const deleteBtn = card.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      // Only the new, not-yet-priced rows shown on this page are deleted.
      // Paid / Partial / Unpaid rows belong to their own pages and stay there.
      const deletedPayments = allRows.map(entry => ({ ...entry.s }));

      // Capture the original position of this session in the payments list
      // BEFORE deleting, so the undo restores the card back where it was
      // (not at the bottom).
      const allPayments = await (await fetch('/database/teacher-portal/payments.json')).json();
      const firstPaymentIdx = allPayments.findIndex(p => String(p.id) === String(deletedPayments[0] && deletedPayments[0].id));

      for (const s of deletedPayments) {
        await fetch('/api/delete-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentId: s.id })
        });
      }

      // Register an undo action that recreates all deleted payments
      if (window.pushAction && window.createCustomAction) {
        window.pushAction(window.createCustomAction('delete', async () => {
          for (let i = 0; i < deletedPayments.length; i++) {
            const p = deletedPayments[i];
            await fetch('/api/payments', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ...p, _restoreIndex: firstPaymentIdx + i })
            });
          }
          await loadPayments();
        }));
      }
      card.remove();
    });
    // Attach partial button logic after rendering
    setTimeout(() => {
      const rows = card.querySelectorAll('tbody tr');
      rows.forEach(row => {
        // Row order is now the pending-only order, so read the saved original
        // index instead of the rendered position.
        const idx = Number(row.getAttribute('data-idx'));
        const paidBtn = row.querySelector('.status-btn.status-paid');
        const partialBtn = row.querySelector('.status-btn.status-partial');
        const unpaidBtn = row.querySelector('.status-btn.status-unpaid');
        // Live update priceTag and amount on blur
        const priceTagInput = row.querySelector('.price-tag-input');
        const amountInput = row.querySelector('.amount-input');
        // Always get paymentId from row attribute
        const paymentId = row.getAttribute('data-payment-id');
        // Snapshot the original payment record (pre-edit) for undo
        const originalPayment = session.students.find(s => String(s.id) === String(paymentId)) || { id: paymentId };
        if (priceTagInput) {
          priceTagInput.addEventListener('blur', async () => {
            const newPriceTag = priceTagInput.value ? Number(priceTagInput.value) : 0;
            const oldPriceTag = typeof originalPayment.priceTag !== 'undefined' ? originalPayment.priceTag : 0;
            await fetch(`/api/payments/${paymentId}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ priceTag: newPriceTag })
            });
            // Register an undo action for the price tag change
            if (window.pushAction && window.createEditAction) {
              window.pushAction(window.createEditAction(
                { ...originalPayment, priceTag: oldPriceTag },
                { ...originalPayment, priceTag: newPriceTag },
                'payment',
                '/api/payments',
                loadPayments
              ));
            }
          });
        }
        if (amountInput) {
          amountInput.addEventListener('blur', async () => {
            const newAmount = amountInput.value ? Number(amountInput.value) : 0;
            const oldAmount = typeof originalPayment.amount !== 'undefined' ? originalPayment.amount : 0;
            await fetch(`/api/payments/${paymentId}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ amount: newAmount })
            });
            // Register an undo action for the amount change
            if (window.pushAction && window.createEditAction) {
              window.pushAction(window.createEditAction(
                { ...originalPayment, amount: oldAmount },
                { ...originalPayment, amount: newAmount },
                'payment',
                '/api/payments',
                loadPayments
              ));
            }
          });
        }
        // Subscribed button logic
        const subscribedBtns = row.querySelectorAll('.status-btn.status-subscribed');
        subscribedBtns.forEach((subscribedBtn) => {
          subscribedBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            // Find the correct student by paymentId
            let student = undefined;
            if (paymentId) {
              student = session.students.find(s => String(s.id) === String(paymentId) || String(s.studentId) === String(paymentId));
            }
            // If student is still not found, fallback to DOM
            if (!student) {
              student = {
                studentName: row.querySelector('td') ? row.querySelector('td').innerText.trim() : '',
                id: paymentId
              };
            }
            const today = new Date();
            const issueDate = today.toISOString();
            // Always set unlimited for special subscription
            // Ensure studentId is always present and unique, safely
            let uniqueId = '';
            if (student && student.studentId) {
              uniqueId = student.studentId;
            } else if (student && typeof student.id !== 'undefined') {
              uniqueId = student.id;
            } else if (paymentId) {
              uniqueId = paymentId;
            } else if (student && student.studentName) {
              uniqueId = (student.studentName || '') + '_' + (session.date || '') + '_' + (session.subject || '') + '_' + (session.classroom || '');
            } else {
              uniqueId = 'unknown_' + Date.now();
            }
            // New subscriptions start at 1/unlimited and count up with every
            // session assigned to this student. If a Price Tag / Amount was
            // already entered for this student, use it as the subscription
            // price instead of 'unlimited'.
            const enteredPrice = priceTagInput ? Number(priceTagInput.value) : 0;
            const enteredAmount = amountInput ? Number(amountInput.value) : 0;
            // Use the amount actually paid (falling back to the price tag) as
            // the subscription price; only use 'unlimited' when neither is set.
            const subPrice = enteredAmount > 0 ? enteredAmount : (enteredPrice > 0 ? enteredPrice : 'unlimited');
            // Ask for the plan (classes or hours) and its package size before
            // subscribing. The current session is counted as the first use, so
            // usage starts at 1 class (or the session's hours) out of the total.
            const setup = await openSubscribeSetupDialog(subPrice);
            if (!setup) return;
            const packageAmount = setup.packageAmount;
            const rowStudent = session.students[idx] || student || {};
            const sessionHours = hoursFromTimeWindow(session.timeWindow)
              || (Number(rowStudent.hours) || 1);
            const firstUse = setup.type === 'hours' ? sessionHours : 1;
            const newUsage = `${Math.min(firstUse, packageAmount)}/${packageAmount}`;
            const newSub = {
              studentFullName: (student && student.studentName) ? student.studentName : '',
              studentId: uniqueId,
              priceTag: setup.price,
              packageAmount,
              type: setup.type,
              amount: setup.price,
              issueDate: issueDate,
              usage: newUsage,
              expirationDate: ''
            };
            try {
              const resp = await fetch('/api/subscriptions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newSub)
              });
              if (!resp.ok) {
                const errText = await resp.text();
                alert('Failed to add subscription. ' + errText);
                return;
              }
              // After subscribing, also mark payment as Paid (using the price
              // that was entered, if any, so the card reflects the real amount)
              if (paymentId) {
                await fetch(`/api/payments/${paymentId}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ priceTag: setup.price, amount: setup.price, status: 'Paid' })
                });
                // Mirror the price the subscription actually saved (the dialog
                // value can differ from what was typed in the row before).
                if (priceTagInput) priceTagInput.value = String(setup.price);
                if (amountInput) amountInput.value = String(setup.price);
              }
              // Register an undo action: remove the subscription and restore the payment
              if (window.pushAction && window.createCustomAction) {
                const subName = newSub.studentFullName;
                const oldPaymentSnapshot = { ...originalPayment };
                window.pushAction(window.createCustomAction('subscribe', async () => {
                  // Remove the subscription that was just created
                  await fetch('/api/subscriptions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ delete: true, studentFullName: subName })
                  });
                  // Restore the payment to its previous state
                  if (paymentId) {
                    await fetch(`/api/payments/${paymentId}`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        status: oldPaymentSnapshot.status || 'Pending',
                        priceTag: oldPaymentSnapshot.priceTag || 0,
                        amount: oldPaymentSnapshot.amount || 0
                      })
                    });
                  }
                  await rec_payments_fetchSubscriptions();
                  await loadPayments();
                }));
              }
              // Keep the row visible and highlight the student as subscribed
              // (green name + subscription badge) instead of removing the row,
              // so subscribed students stay trackable in the payments card.
              const studentName = (student && student.studentName) ? student.studentName : '';
              const nameCell = row.querySelector('td');
              if (nameCell) {
                nameCell.innerHTML = `
                  <div style="color:#198754;font-weight:bold;">${studentName}</div>
                  <div style="font-size:12px;">
                    <span class='badge bg-success ms-1'><i class='bi bi-star-fill'></i> ${newUsage}</span>
                  </div>
                `;
              }
              // Show the subscription badge in the SUBSCRIPTION USAGE column
              const usageCell = row.querySelectorAll('td')[2];
              if (usageCell) {
                usageCell.innerHTML = `<span class='badge bg-success ms-1'><i class='bi bi-star-fill'></i> ${newUsage}</span>`;
              }
              // Remove the Subscribed button now that the student is subscribed
              const subscribedBtn = row.querySelector('.status-btn.status-subscribed');
              if (subscribedBtn) subscribedBtn.remove();
              // If every student on this card is now Paid (this one just became
              // paid via subscription), move the whole card to the Paid page.
              alert('Student added to subscriptions and marked as Paid. You can now edit their package details in the subscriptions page.');
              await rec_payments_fetchSubscriptions();
              await loadPayments();
              // Optionally, re-render payments if you want to refresh the whole list:
              // renderPayments(sessions, payments);
            } catch (err) {
              alert('Error adding subscription: ' + err.message);
            }
          });
        });
        if (paidBtn) {
          paidBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const priceTagInput = row.querySelector('.price-tag-input');
            const amountInput = row.querySelector('.amount-input');
            // paymentId is now always from data attribute
            let newPriceTag = priceTagInput ? Number(priceTagInput.value) : 0;
            let newAmount = amountInput ? Number(amountInput.value) : 0;
            if (isNaN(newPriceTag)) newPriceTag = 0;
            if (isNaN(newAmount)) newAmount = 0;
            if (paymentId && newPriceTag > 0 && newAmount === newPriceTag) {
              try {
                const resp = await fetch(`/api/payments/${paymentId}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ priceTag: newPriceTag, amount: newAmount, status: 'Paid' })
                });
                if (!resp.ok) {
                  const errText = await resp.text();
                  alert('Failed to update payment status. ' + errText);
                  return;
                }
                // If this student has a subscription, sync its price with the
                // amount just paid so the subscription no longer shows
                // 'unlimited' — its price reflects what was actually charged.
                let subForStudent = null;
                if (originalPayment && originalPayment.studentName) {
                  subForStudent = rec_payments_subscriptionData.find(sub => sub.studentFullName && sub.studentFullName.trim().toLowerCase() === originalPayment.studentName.trim().toLowerCase());
                }
                if (!subForStudent && originalPayment && originalPayment.studentId) {
                  subForStudent = rec_payments_subscriptionData.find(sub => sub.studentId && String(sub.studentId) === String(originalPayment.studentId));
                }
                // Snapshot the subscription's previous state so Undo can restore it
                let oldSubSnapshot = null;
                if (subForStudent) {
                  oldSubSnapshot = { ...subForStudent };
                  // Keep any statement text the user typed in the subscription
                  // price cell (e.g. 'English class "700"') while updating the
                  // numeric price to what was actually paid.
                  const syncedPriceTag = mergeStatementPrice(subForStudent.priceTag, newPriceTag);
                  const subResp = await fetch('/api/subscriptions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...subForStudent, priceTag: syncedPriceTag, amount: newAmount })
                  });
                  if (!subResp.ok) {
                    console.warn('Failed to sync subscription price with paid amount.');
                  }
                  const subData = await subResp.json().catch(() => null);
                  if (subData && Array.isArray(subData.subscriptions)) {
                    rec_payments_subscriptionData = subData.subscriptions;
                  }
                }
                // Register an undo action for the Paid status change
                if (window.pushAction && window.createEditAction) {
                  window.pushAction(window.createEditAction(
                    { ...originalPayment, status: originalPayment.status || 'Pending' },
                    { ...originalPayment, status: 'Paid', priceTag: newPriceTag, amount: newAmount },
                    'payment',
                    '/api/payments',
                    async () => {
                      // Also revert the subscription price that was synced, so
                      // Undo leaves the subscription exactly as it was before.
                      if (oldSubSnapshot) {
                        await fetch('/api/subscriptions', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(oldSubSnapshot)
                        });
                      }
                      await loadPayments();
                    }
                  ));
                }
                // Refresh in place so the complete ledger remains visible and
                // the row now shows its Paid status.
                await loadPayments();
              } catch (err) {
                alert('Error updating payment: ' + err.message);
              }
            } else {
              alert('To mark as Paid, Amount must equal Price Tag and both must be > 0.');
            }
          });
        }
        if (partialBtn) {
          partialBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const priceTagInput = row.querySelector('.price-tag-input');
            const amountInput = row.querySelector('.amount-input');
            // paymentId is now always from data attribute
            let newPriceTag = priceTagInput ? Number(priceTagInput.value) : 0;
            let newAmount = amountInput ? Number(amountInput.value) : 0;
            if (isNaN(newPriceTag)) newPriceTag = 0;
            if (isNaN(newAmount)) newAmount = 0;
            // Only allow partial if amount > 0 and amount < priceTag
            if (paymentId && newPriceTag > 0 && newAmount > 0 && newAmount < newPriceTag) {
              try {
                const resp = await fetch(`/api/payments/${paymentId}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ priceTag: newPriceTag, amount: newAmount, status: 'Partial' })
                });
                if (!resp.ok) {
                  alert('Failed to update payment status.');
                  return;
                }
                // Refresh in place so every row stays visible on the complete
                // Payments ledger, including this newly partial one.
                await loadPayments();
              } catch (err) {
                alert('Error updating payment: ' + err.message);
              }
            } else {
              alert('To mark as Partial, Amount must be greater than 0 and less than Price Tag.');
            }
          });
        }
        if (unpaidBtn) {
          unpaidBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const priceTagInput = row.querySelector('.price-tag-input');
            const amountInput = row.querySelector('.amount-input');
            // paymentId is now always from data attribute
            const newPriceTag = priceTagInput ? Number(priceTagInput.value) : 0;
            // Treat empty, whitespace, or zero as 0
            let amountRaw = amountInput && typeof amountInput.value === 'string' ? amountInput.value.trim() : '';
            let newAmount = amountRaw === '' ? 0 : Number(amountRaw);
            if (isNaN(newAmount)) newAmount = 0;
            if (paymentId && newPriceTag > 0 && (amountRaw === '' || newAmount === 0)) {
              try {
                const resp = await fetch(`/api/payments/${paymentId}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ priceTag: newPriceTag, amount: 0, status: 'Unpaid' })
                });
                if (!resp.ok) {
                  const errText = await resp.text();
                  alert('Failed to update payment status. ' + errText);
                  return;
                }
                // Refresh in place without leaving the complete ledger.
                await loadPayments();
              } catch (err) {
                alert('Error updating payment: ' + err.message);
              }
            } else {
              alert('To mark as Unpaid, Price Tag must be > 0 and Amount must be empty or 0.');
            }
          });
        }
      });
    }, 0);
    return card;
  }
  // Month sections: newest on top, year dividers, remembered expand/collapse
  PaymentGroups.attachMonthSections(listDiv, sessionList, buildCard, {
    sort: false,
    forceOpenAll: !!filtersActive,
    // Count only the new, not-yet-priced rows this page is responsible for.
    groupMetaHtml: (monthSessions) => {
      const forms = monthSessions.length;
      const newStudents = monthSessions.reduce((total, s) =>
        total + (s.students || []).filter(isNewPaymentRow).length, 0);
      return '<span><i class="bi bi-journal-text"></i> ' + forms + ' form' + (forms === 1 ? '' : 's') + '</span>' +
        '<span><i class="bi bi-people"></i> ' + newStudents + ' student' + (newStudents === 1 ? '' : 's') + ' to price</span>';
    }
  });
}

async function loadPayments() {
  // Always sync payments with latest students.json before loading payments (optional, skip for local JSON)
  // await fetch('/api/payments/sync-students', { method: 'POST' });
  const sessions = await rec_payments_fetchJson('/database/teacher-portal/teachers-attendance.json');
  // Fetch payments directly from JSON for local/test
  const payments = await rec_payments_fetchJson('/database/teacher-portal/payments.json');
  const studentsDb = await rec_payments_fetchJson('/database/students.json');
  if (!Array.isArray(payments)) throw new Error('payments.json did not contain a list of payments.');
  window.studentsDb = studentsDb; // Fix: ensure studentsDb is globally available before renderPayments
  // Patch sessions' students and all payments with latest phone and discount from studentsDb
  sessions.forEach(session => {
    if (Array.isArray(session.students)) {
      session.students.forEach(stu => {
        let match = null;
        if (stu.name) {
          match = studentsDb.find(s => s.studentName && s.studentName.trim().toLowerCase() === stu.name.trim().toLowerCase());
        }
        if (!match && stu.studentName) {
          match = studentsDb.find(s => s.studentName && s.studentName.trim().toLowerCase() === stu.studentName.trim().toLowerCase());
        }
        if (!match && stu.studentId) {
          match = studentsDb.find(s => s.id === stu.studentId);
        }
        if (match) {
          stu.phone = match.phoneNumber || '';
          stu.discount = (typeof match.discount === 'number' || (typeof match.discount === 'string' && match.discount !== '')) ? match.discount : '';
        } else {
          stu.discount = '';
        }
      });
    }
  });
  // Patch all payment objects with latest discount from studentsDb
  payments.forEach(p => {
    let match = null;
    if (p.studentName) {
      match = studentsDb.find(s => s.studentName && s.studentName.trim().toLowerCase() === p.studentName.trim().toLowerCase());
    }
    if (!match && p.studentId) {
      match = studentsDb.find(s => s.id === p.studentId);
    }
    if (match) {
      p.discount = (typeof match.discount === 'number' || (typeof match.discount === 'string' && match.discount !== '')) ? match.discount : '';
    } else {
      p.discount = '';
    }
  });
  // Store the full datasets, then render through the filter (same pattern as
  // the Paid page so the search/filter/month controls all work together).
  // All payments are shown regardless of status (same as the admin portal), so
  // the receptionist sees every card the admin sees.
  allSessions = sessions;
  allPayments = payments;
  applyPaymentsFilters();
}

// ---- Payments page filter (same pattern as the Paid page) ----
let allSessions = [];
let allPayments = [];

function getFilteredPayments() {
  const searchInput = document.getElementById('searchInput');
  const filterType = document.getElementById('filterPaymentsType');
  const filterValue = document.getElementById('filterPaymentsValue');
  const startMonthInput = document.getElementById('startMonthInput');
  const endMonthInput = document.getElementById('endMonthInput');
  if (!searchInput || !filterType || !allPayments) return allPayments || [];

  const search = searchInput.value.trim().toLowerCase();
  const type = filterType.value;
  const value = filterValue ? filterValue.value : '';
  const startMonth = startMonthInput ? startMonthInput.value : '';
  const endMonth = endMonthInput ? endMonthInput.value : '';
  let rows = allPayments;

  if (type && value) {
    const selected = value.trim().toLowerCase();
    if (type === 'teacher') rows = rows.filter(p => p.createdBy && p.createdBy.trim().toLowerCase() === selected);
    else if (type === 'subject') rows = rows.filter(p => p.subject && p.subject.trim().toLowerCase() === selected);
    else if (type === 'student') rows = rows.filter(p => p.studentName && p.studentName.trim().toLowerCase() === selected);
  }

  if (startMonth || endMonth) {
    rows = rows.filter(p => {
      if (!p.date) return false;
      const d = PaymentGroups.parseDate(p.date);
      if (!d) return false;
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
    rows = rows.filter(p =>
      (p.createdBy && p.createdBy.toLowerCase().includes(search)) ||
      (p.subject && p.subject.toLowerCase().includes(search)) ||
      (p.studentName && p.studentName.toLowerCase().includes(search)) ||
      (p.phone && p.phone.toLowerCase().includes(search))
    );
  }
  return rows;
}

function applyPaymentsFilters() {
  const filtered = getFilteredPayments();
  const summary = document.getElementById('paymentsFilterSummary');
  if (summary) {
    const filterType = document.getElementById('filterPaymentsType');
    const filterValue = document.getElementById('filterPaymentsValue');
    const startMonthInput = document.getElementById('startMonthInput');
    const endMonthInput = document.getElementById('endMonthInput');
    const active = (filterType && filterType.value && filterValue && filterValue.value) ||
      (startMonthInput && startMonthInput.value) || (endMonthInput && endMonthInput.value);
    // Count only the new, not-yet-priced rows this page is responsible for.
    const newTotal = allPayments.filter(isNewPaymentRow).length;
    const newMatched = filtered.filter(isNewPaymentRow).length;
    summary.textContent = active
      ? `${newMatched} of ${newTotal} new session payment${newTotal === 1 ? '' : 's'} matched`
      : `${newTotal} new session payment${newTotal === 1 ? '' : 's'} waiting for a price`;
  }
  renderPayments(allSessions, filtered);
}


// SheetJS loader
function loadSheetJS(callback) {
  if (window.XLSX) return callback();
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
  script.onload = callback;
  document.head.appendChild(script);
}

let paymentsCache = [];
let sessionsCache = [];

function flattenPaymentsForExcel(sessions, payments) {
  // Returns a flat array of rows for Excel
  return payments.map(p => {
    // Patch missing grade and schoolName for each payment from sessions
    let grade = p.grade, schoolName = p.schoolName;
    if (!grade || !schoolName) {
      const match = sessions.find(ses =>
        (ses.teacherName === p.createdBy || ses.teacherName === p.teacherName) &&
        ses.date === p.date &&
        ses.subject === p.subject &&
        ses.classroom === p.classroom &&
        ses.timeWindow === p.timeWindow
      );
      if (match) {
        if (!grade) grade = match.grade;
        if (!schoolName) schoolName = match.schoolName;
      }
    }
    return {
      'Teacher': p.createdBy || p.teacherName || '-',
      'Subject': p.subject || '-',
      'Grade': grade || '-',
      'Classroom': p.classroom || '-',
      'School': schoolName || '-',
      'Date': p.date || '-',
      'Time': p.timeWindow || '-',
      'Student': p.studentName || '-',
      'Phone': p.phone || '-',
      'Hours Taken': typeof p.hours !== 'undefined' ? p.hours : '-',
      'Cut Rate': (p.cutRate !== undefined && p.cutRate !== null && p.cutRate !== '') ? p.cutRate + '%' : '-',
      'Notes': [p.note, p.subscriptionStatement ? `Subscription: ${p.subscriptionStatement}` : ''].filter(Boolean).join(' | ') || '-',
      'Price Tag': p.priceTag || 0,
      'Amount': p.amount || 0,
      'Status': p.status || '-',
    };
  });
}

function exportPaymentsToExcel() {
  loadSheetJS(() => {
    const rows = flattenPaymentsForExcel(sessionsCache, paymentsCache);
    const ws = XLSX.utils.json_to_sheet(rows);
    ws['!cols'] = [
      { wch: 16 }, // Teacher
      { wch: 12 }, // Subject
      { wch: 8 },  // Grade
      { wch: 10 }, // Classroom
      { wch: 16 }, // School
      { wch: 12 }, // Date
      { wch: 14 }, // Time
      { wch: 16 }, // Student
      { wch: 14 }, // Phone
      { wch: 12 }, // Hours
      { wch: 10 }, // Discount
      { wch: 30 }, // Notes
      { wch: 10 }, // Price Tag
      { wch: 10 }, // Amount
      { wch: 10 }, // Status
    ];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Payments');
    XLSX.writeFile(wb, 'PaymentsLog.xlsx');
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  await rec_payments_fetchSubscriptions();
  // Patch: cache sessions and payments for export
  const sessions = await rec_payments_fetchJson('/database/teacher-portal/teachers-attendance.json');
  const payments = await rec_payments_fetchJson('/database/teacher-portal/payments.json');
  sessionsCache = sessions;
  // Show all payments for export (same as the admin portal)
  paymentsCache = payments;
  loadPayments();

  // Payments filter card wiring (same pattern as the Paid page)
  const searchInput = document.getElementById('searchInput');
  const filterType = document.getElementById('filterPaymentsType');
  const filterValue = document.getElementById('filterPaymentsValue');
  const applyBtn = document.getElementById('applyPaymentsFilterBtn');
  const startMonthInput = document.getElementById('startMonthInput');
  const endMonthInput = document.getElementById('endMonthInput');

  if (searchInput) {
    searchInput.addEventListener('input', applyPaymentsFilters);
    searchInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') applyPaymentsFilters(); });
  }

  if (filterType) {
    filterType.addEventListener('change', () => {
      filterValue.innerHTML = '';
      filterValue.style.display = 'none';
      applyBtn.style.display = 'none';
      if (!filterType.value) {
        applyPaymentsFilters();
        return;
      }
      // Offer only values that exist among the new, not-yet-priced rows.
      const newPayments = allPayments.filter(isNewPaymentRow);
      let values = [];
      if (filterType.value === 'teacher') values = [...new Set(newPayments.map(p => p.createdBy).filter(Boolean))];
      else if (filterType.value === 'subject') values = [...new Set(newPayments.map(p => p.subject).filter(Boolean))];
      else if (filterType.value === 'student') values = [...new Set(newPayments.map(p => p.studentName).filter(Boolean))];
      filterValue.innerHTML = '<option value="">Select...</option>' + values.map(v => `<option value="${v}">${v}</option>`).join('');
      filterValue.style.display = '';
      applyBtn.style.display = '';
    });
  }

  if (applyBtn) {
    applyBtn.addEventListener('click', (e) => {
      e.preventDefault();
      applyPaymentsFilters();
    });
  }

  if (filterValue) {
    filterValue.addEventListener('change', () => {
      if (!filterValue.value) applyBtn.style.display = '';
    });
  }

  if (startMonthInput) startMonthInput.addEventListener('change', applyPaymentsFilters);
  if (endMonthInput) endMonthInput.addEventListener('change', applyPaymentsFilters);

  // Export button logic
  const btn = document.getElementById('exportExcelBtn');
  if (btn) {
    btn.addEventListener('click', () => {
      if (!paymentsCache.length) {
        alert('No payments to export.');
        return;
      }
      exportPaymentsToExcel();
    });
  }
});


// (TypeScript conversion shim: original global name kept available for
// co-loaded scripts and inline HTML handlers — same lookup as before)
if (typeof rec_payments_formatHoursDecimal !== 'undefined') { window.rec_payments_formatHoursDecimal = rec_payments_formatHoursDecimal; }
if (typeof rec_payments_formatDuration !== 'undefined') { window.rec_payments_formatDuration = rec_payments_formatDuration; }
if (typeof rec_payments_escapeHtmlText !== 'undefined') { window.rec_payments_escapeHtmlText = rec_payments_escapeHtmlText; }
if (typeof rec_payments_paymentStatement !== 'undefined') { window.paymentStatement = rec_payments_paymentStatement; }
if (typeof rec_payments_paymentNoteHtml !== 'undefined') { window.paymentNoteHtml = rec_payments_paymentNoteHtml; }
if (typeof rec_payments_fetchJson !== 'undefined') { window.fetchJson = rec_payments_fetchJson; }
if (typeof rec_payments_formatDate !== 'undefined') { window.formatDate = rec_payments_formatDate; }
if (typeof rec_payments_getSessionSortTime !== 'undefined') { window.getSessionSortTime = rec_payments_getSessionSortTime; }
if (typeof rec_payments_fetchSubscriptions !== 'undefined') { window.fetchSubscriptions = rec_payments_fetchSubscriptions; }


// (TypeScript conversion shim: original global name kept available for
// co-loaded scripts and inline HTML handlers — same lookup as before)
if (typeof rec_payments_paymentStatement !== 'undefined') { window.paymentStatement = rec_payments_paymentStatement; }
if (typeof rec_payments_paymentNoteHtml !== 'undefined') { window.paymentNoteHtml = rec_payments_paymentNoteHtml; }
if (typeof rec_payments_fetchJson !== 'undefined') { window.fetchJson = rec_payments_fetchJson; }
if (typeof rec_payments_formatDate !== 'undefined') { window.formatDate = rec_payments_formatDate; }
if (typeof rec_payments_getSessionSortTime !== 'undefined') { window.getSessionSortTime = rec_payments_getSessionSortTime; }
if (typeof rec_payments_fetchSubscriptions !== 'undefined') { window.fetchSubscriptions = rec_payments_fetchSubscriptions; }
