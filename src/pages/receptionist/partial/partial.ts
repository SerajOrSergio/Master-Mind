// Partial Payments Page Logic
// Loads payments.json, filters for status: 'Partial', renders cards and tables

async function rec_part_rece_fetchJson(url) {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Could not load ${url} (${res.status})`);
  return await res.json();
}

function rec_part_rece_formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB') + ' ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

// Format a duration (in minutes) as full words, e.g. 90 -> "1 hour and 30 minutes"
function rece_formatDuration(mins) {
  const hours = Math.floor(mins / 60);
  const minutes = mins % 60;
  const parts = [];
  if (hours > 0) parts.push(hours + (hours === 1 ? ' hour' : ' hours'));
  if (minutes > 0) parts.push(minutes + (minutes === 1 ? ' minute' : ' minutes'));
  return parts.length ? parts.join(' and ') : '0 minutes';
}


async function rece_renderPartialPayments(partials) {
  const listDiv = document.getElementById('partialPaymentsList');
  if (!partials.length) {
    listDiv.innerHTML = '<div class="text-muted">No partial payments found.</div>';
    return;
  }
  // Group by session/teacher
  const sessionMap: { [key: string]: any } = {};
  partials.forEach(payment => {
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
  const attendanceData = await rec_part_rece_fetchJson('/database/teacher-portal/teachers-attendance.json');

  // Newest partial sessions first, grouped into collapsible month sections
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
        durationStr = mins > 0 ? rece_formatDuration(mins) : '';
      }
    }
    const card = document.createElement('div');
    card.className = 'payment-card collapsed';
    const studentsCount = session.students ? session.students.length : 0;
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
            <span><i class="bi bi-calendar3"></i> ${PaymentGroups.formatDateShort(session.date)}</span>
            <span><i class="bi bi-clock"></i> ${timeText}</span>
            <span><i class="bi bi-people"></i> ${studentsCount} student${studentsCount === 1 ? '' : 's'}</span>
          </div>
        </div>
        <div class="payment-card-header-actions">
          <span class="hide-btn">Show</span>
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
                <th>MISSING</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              ${session.students.map((s, idx) => {
                const priceTag = Number(s.priceTag) || 0;
                const amount = Number(s.amount) || 0;
                const missing = priceTag > 0 ? Math.max(priceTag - amount, 0) : '';
                return `
                  <tr data-payment-id="${s.id}">
                    <td><span class="status-btn status-partial" style="display:inline-block;min-width:70px;text-align:center;">${s.studentName || '-'}</span></td>
                    <td>${typeof s.hours !== 'undefined' ? s.hours : '-'}</td>
                    <td>${(s.cutRate !== undefined && s.cutRate !== null && s.cutRate !== '') ? s.cutRate + '%' : '-'}</td>
                    <td>${s.note || '-'}</td>
                    <td><input type="number" class="form-control form-control-sm price-tag-input" value="${priceTag}" min="0" style="width:90px;"></td>
                    <td><input type="number" class="form-control form-control-sm amount-input" value="${amount}" min="0" style="width:90px;"></td>
                    <td class="missing-cell">${missing}</td>
                    <td>
                      <button class="btn btn-success btn-sm mark-completed-btn" data-idx="${idx}">Mark Completed</button>
                      <button class="btn btn-warning btn-sm mark-partial-btn" data-idx="${idx}">Partial</button>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
    // Add Mark Completed button logic
    setTimeout(() => {
      const rows = card.querySelectorAll('tbody tr');
      rows.forEach((row, idx) => {
        const btn = row.querySelector('.mark-completed-btn');
        const partialBtn = row.querySelector('.mark-partial-btn');
        const priceTagInput = row.querySelector('.price-tag-input');
        const amountInput = row.querySelector('.amount-input');
        const missingCell = row.querySelector('.missing-cell');

        // Update missing value live
        function updateMissing() {
          const priceTag = Number(priceTagInput.value) || 0;
          const amount = Number(amountInput.value) || 0;
          missingCell.textContent = priceTag > 0 ? String(Math.max(priceTag - amount, 0)) : '';
        }
        priceTagInput.addEventListener('input', updateMissing);
        amountInput.addEventListener('input', updateMissing);

        if (btn) {
          btn.addEventListener('click', async (e) => {
            e.preventDefault();
            const payment = session.students[idx];
            const paymentId = payment.id;
            const priceTag = Number(priceTagInput.value) || 0;
            const amount = Number(amountInput.value) || 0;
            if (priceTag !== amount) {
              alert('Cannot mark as paid: Price Tag and Amount must be equal.');
              return;
            }
            // Update payment status and values in backend
            try {
              const resp = await fetch(`/api/payments/${paymentId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'Paid', priceTag, amount })
              });
              if (!resp.ok) {
                alert('Failed to update payment status.');
                return;
              }
              row.remove();
              window.location.href = '/src/pages/receptionist/paid/paid.html';
            } catch (err) {
              alert('Error updating payment: ' + err.message);
            }
          });
        }
        if (partialBtn) {
          partialBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            const payment = session.students[idx];
            const paymentId = payment.id;
            const priceTag = Number(priceTagInput.value) || 0;
            const amount = Number(amountInput.value) || 0;
            if (priceTag === amount) {
              alert('Price Tag and Amount are equal. Please use the Paid button instead.');
              return;
            }
            const oldPayment = { ...payment };
            // Update payment status and values in backend
            try {
              const resp = await fetch(`/api/payments/${paymentId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'Partial', priceTag, amount })
              });
              if (!resp.ok) {
                alert('Failed to update payment status.');
                return;
              }
              // Register an undo action for the status change
              if (window.pushAction && window.createEditAction) {
                window.pushAction(window.createEditAction(
                  oldPayment,
                  { ...oldPayment, status: 'Partial', priceTag, amount },
                  'payment',
                  '/api/payments',
                  rece_loadPartialPayments
                ));
              }
              row.remove();
              alert('Marked as Partial.');
            } catch (err) {
              alert('Error updating payment: ' + err.message);
            }
          });
        }
      });
    }, 0);
    // Collapse/expand: header click or the Show/Hide button
    PaymentGroups.attachCardToggle(card);
    return card;
  }
  // Month sections: newest on top, year dividers, remembered expand/collapse
  PaymentGroups.attachMonthSections(listDiv, Object.values(sessionMap as { [key: string]: any }), buildCard);
}


async function rece_loadPartialPayments() {
  const payments = await rec_part_rece_fetchJson('/database/teacher-portal/payments.json');
  const partials = payments.filter(p => String(p.status || '').trim().toLowerCase() === 'partial');
  await rece_renderPartialPayments(partials);
}

document.addEventListener('DOMContentLoaded', () => {
  rece_loadPartialPayments();
});
