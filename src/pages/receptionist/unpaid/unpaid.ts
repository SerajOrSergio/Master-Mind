// Unpaid Payments Page Logic (receptionist)
// Loads payments.json, filters for status: 'Unpaid', renders month-grouped cards

async function rec_unpa_rece_fetchJson(url) {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Could not load ${url} (${res.status})`);
  return await res.json();
}

function rec_unpa_rece_formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB') + ' ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

function rece_renderUnpaidPayments(unpaids) {
  const listDiv = document.getElementById('unpaidPaymentsList');
  if (!unpaids.length) {
    listDiv.innerHTML = '<div class="text-muted">No unpaid payments found.</div>';
    return;
  }
  // Group by session/teacher
  const sessionMap: { [key: string]: any } = {};
  unpaids.forEach(payment => {
    const key = [payment.createdBy, payment.date, payment.subject, payment.classroom, payment.timeWindow].join('|');
    if (!sessionMap[key]) {
      sessionMap[key] = {
        ...payment,
        students: []
      };
    }
    sessionMap[key].students.push(payment);
  });

  // Newest unpaid sessions first, then grouped into collapsible month
  // sections with a year divider — same dashboard layout as the Payments page.
  function buildCard(session) {
    const card = document.createElement('div');
    card.className = 'payment-card collapsed';
    const studentsCount = session.students ? session.students.length : 0;
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
            <span><i class="bi bi-clock"></i> ${session.timeWindow || '-'}</span>
            <span><i class="bi bi-people"></i> ${studentsCount} student${studentsCount === 1 ? '' : 's'}</span>
          </div>
        </div>
        <div class="payment-card-header-actions">
          <span class="hide-btn">Show</span>
        </div>
      </div>
      <div class="payment-card-details-area" style="display:none;">
        <table class="payment-card-table">
          <thead>
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
                  <td><span class="status-btn status-unpaid" style="display:inline-block;min-width:70px;text-align:center;">${s.studentName || '-'}</span></td>
                  <td>${typeof s.hours !== 'undefined' ? s.hours : '-'}</td>
                  <td>${(s.cutRate !== undefined && s.cutRate !== null && s.cutRate !== '') ? s.cutRate + '%' : '-'}</td>
                  <td>${s.note || '-'}</td>
                  <td><input type="number" class="form-control form-control-sm price-tag-input" value="${priceTag || ''}" min="0" step="1" style="width:90px;"></td>
                  <td><input type="number" class="form-control form-control-sm amount-input" value="${amount || ''}" min="0" step="1" style="width:90px;"></td>
                  <td class="missing-cell">${missing}</td>
                  <td>
                    <button class="btn btn-success btn-sm mark-complete-btn" data-idx="${idx}">Mark Complete</button>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
    // Let the receptionist fill in the price tag and the amount collected,
    // then move the row straight to the Paid page.
    setTimeout(() => {
      const rows = card.querySelectorAll('tbody tr');
      rows.forEach((row, idx) => {
        const btn = row.querySelector('.mark-complete-btn');
        const priceTagInput = row.querySelector('.price-tag-input');
        const amountInput = row.querySelector('.amount-input');
        const missingCell = row.querySelector('.missing-cell');

        function updateMissing() {
          const priceTag = Number(priceTagInput.value) || 0;
          const amount = Number(amountInput.value) || 0;
          missingCell.textContent = priceTag > 0 ? String(Math.max(priceTag - amount, 0)) : '';
        }
        if (priceTagInput && amountInput) {
          priceTagInput.addEventListener('input', updateMissing);
          amountInput.addEventListener('input', updateMissing);
        }

        if (btn) {
          btn.addEventListener('click', async (e) => {
            e.preventDefault();
            const payment = session.students[idx];
            const paymentId = payment.id;
            const priceTag = Number(priceTagInput ? priceTagInput.value : 0) || 0;
            const amountRaw = amountInput && typeof amountInput.value === 'string' ? amountInput.value.trim() : '';
            const amount = amountRaw === '' ? 0 : (Number(amountRaw) || 0);

            if (priceTag <= 0) {
              alert('Please enter a Price Tag greater than 0.');
              return;
            }
            if (amount <= 0) {
              alert('Please enter the Amount paid.');
              return;
            }
            if (amount < priceTag) {
              alert('Amount must be at least the Price Tag to mark this student as Paid.');
              return;
            }

            const oldPayment = { ...payment };
            try {
              const resp = await fetch(`/api/payments/${paymentId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'Paid', priceTag, amount })
              });
              if (!resp.ok) {
                alert('Failed to mark this payment as Paid.');
                return;
              }
              if (window.pushAction && window.createEditAction) {
                window.pushAction(window.createEditAction(
                  oldPayment,
                  { ...oldPayment, status: 'Paid', priceTag, amount },
                  'payment',
                  '/api/payments',
                  rece_loadUnpaidPayments
                ));
              }
              await rece_loadUnpaidPayments();
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

async function rece_loadUnpaidPayments() {
  const payments = await rec_unpa_rece_fetchJson('/database/teacher-portal/payments.json');
  // A row only belongs on Unpaid once a price tag (or some money) has been set.
  // Brand-new session rows with neither belong on the Payments intake page.
  const unpaids = payments.filter(p => {
    if (String(p.status || '').trim().toLowerCase() !== 'unpaid') return false;
    return (Number(p.priceTag) || 0) > 0 || (Number(p.amount) || 0) > 0;
  });
  rece_renderUnpaidPayments(unpaids);
}

window.addEventListener('DOMContentLoaded', rece_loadUnpaidPayments);
