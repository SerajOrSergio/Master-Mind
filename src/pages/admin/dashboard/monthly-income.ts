// Admin Dashboard — Monthly Income Breakdown
// Shows, per calendar month, how much money actually came in and how much of
// it belongs to the teachers after their cut rates:
//
//   Teacher Income   = every student payment recorded inside the teacher's
//                      session cards (status 'Paid', same card grouping and
//                      round() calculation as the Paid page).
//   Teachers' Cut    = teacher income × each teacher's cutRate %, rounded per
//                      session card.
//   Your Profit      = Teacher Income − Teachers' Cut.
//
// Two extra money sources are tracked next to session income, without any
// teacher cut (they belong fully to the center):
//   • Subscriptions  — big package payments from subscription.json, placed in
//                      the month the package was issued. Students whose price
//                      tag could not be read as a number are listed but never
//                      added to the totals.
//   • Study Clicks   — paid entry recordings from database/study-clicks.json,
//                      placed in the month they were created.
//
// Plain script: defines window.MonthlyIncome and renders #monthly-income-body.
(function () {
  'use strict';

  const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  // Fallbacks if payments-grouping.js fails to load.
  const helpers = (window.PaymentGroups && window.PaymentGroups.getSessionMonthKey)
    ? window.PaymentGroups
    : (function () {
        function monthDate(x) {
          let d = x.date ? new Date(x.date) : null;
          if (!d || isNaN(d)) d = x.submittedAt || x.issueDate ? new Date(x.submittedAt || x.issueDate) : null;
          if (!d || isNaN(d)) return null;
          return d;
        }
        function getSessionMonthKey(session) {
          const d = monthDate(session);
          return d ? d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') : 'unknown';
        }
        function getSessionMonthLabel(session) {
          const d = monthDate(session);
          return d ? MONTH_NAMES[d.getMonth()] + ' ' + d.getFullYear() : 'Unknown date';
        }
        return { getSessionMonthKey: getSessionMonthKey, getSessionMonthLabel: getSessionMonthLabel };
      })();

  function escapeHtml(str) {
    return String(str == null ? '' : str).replace(/[&<>\"']/g, function (m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
    });
  }

  // Money is tracked as whole units across the app; trim floating point noise.
  function fmt(n) {
    const rounded = Math.round(n * 100) / 100;
    return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2);
  }

  // Same teacher matching rule as the admin Paid page (case-insensitive
  // first + last name match on the session's createdBy value).
  function findTeacher(teachers, name) {
    if (!name) return null;
    const parts = String(name).trim().split(/\s+/);
    const firstName = parts[0] || '';
    const lastName = parts.length > 1 ? parts.slice(1).join(' ') : '';
    return teachers.find(function (t) {
      if (!t.firstName || !t.lastName) return false;
      return (
        t.firstName.trim().toLowerCase() === firstName.toLowerCase() &&
        t.lastName.trim().toLowerCase() === lastName.toLowerCase()
      );
    }) || null;
  }

  // Only trust a written price tag when it is just a clean number
  // ('700', '600'). Comments like 'English"600"' or 'still owes us 725'
  // are kept as notes but never silently added to the money totals.
  function parsePriceTag(raw) {
    const s = String(raw == null ? '' : raw).trim().replace(/[",]/g, '');
    return /^\d+(\.\d+)?$/.test(s) ? Number(s) : null;
  }

  function toMonthKey(dateValue) {
    if (!dateValue) return 'unknown';
    const d = new Date(dateValue);
    if (isNaN(d)) return 'unknown';
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
  }

  function monthLabelFromKey(key) {
    const [y, m] = key.split('-').map(Number);
    return MONTH_NAMES[(m || 1) - 1] + ' ' + y;
  }

  // One shared bucket per month, fed by sessions, subscriptions and study clicks.
  function emptyMonth(): any {
    return {
      income: 0,          // paid session money (before teacher cuts)
      teacherCut: 0,      // teachers' share paid out of that income
      profit: 0,          // income − teacherCut
      students: 0,        // paid student payments in sessions
      teachers: new Map(),
      subs: [],           // subscription sales recorded this month
      subsValue: 0,       // only the price tags we could trust as numbers
      subsKnown: 0,       // how many of those were numeric
      clicks: [],         // study-click payments this month
      clicksValue: 0
    };
  }

  function buildMonthAggregates(data) {
    const payments = Array.isArray(data.payments) ? data.payments : [];
    const teachers = Array.isArray(data.teachers) ? data.teachers : [];
    const subs = Array.isArray(data.subscriptions) ? data.subscriptions : [];
    const clicks = Array.isArray(data.studyClicks) ? data.studyClicks : [];

    const paid = payments.filter(function (p) {
      return String(p.status || '').toLowerCase() === 'paid';
    });

    // Session cards first (same key as the Paid page), then per month.
    const sessionMap: { [key: string]: any } = {};
    paid.forEach(function (p) {
      const key = [p.createdBy, p.date, p.subject, p.classroom, p.timeWindow].join('|');
      if (!sessionMap[key]) sessionMap[key] = { ...p, students: [] };
      sessionMap[key].students.push(p);
    });

    const months = new Map();
    function monthFor(key) {
      if (!months.has(key)) {
        const fresh = emptyMonth();
        fresh.key = key;
        months.set(key, fresh);
      }
      return months.get(key);
    }

    Object.values(sessionMap as { [key: string]: any }).forEach(function (session) {
      const key = helpers.getSessionMonthKey(session);
      if (key === 'unknown') return;
      const month = monthFor(key);

      const totalIncome = session.students.reduce(function (s, st) { return s + (Number(st.amount) || 0); }, 0);
      const teacher = findTeacher(teachers, session.createdBy || session.teacherName);
      const cutRate = teacher && teacher.cutRate !== undefined &&
        teacher.cutRate !== '' && teacher.cutRate !== null
        ? Number(teacher.cutRate)
        : null; // null = cut rate not set (currently the full amount is your profit)
      const teacherProfit = cutRate === null ? 0 : Math.round((totalIncome * cutRate) / 100);

      month.income += totalIncome;
      month.teacherCut += teacherProfit;
      month.profit += totalIncome - teacherProfit;
      month.students += session.students.length;

      const teacherName = session.createdBy || session.teacherName || 'Unknown teacher';
      if (!month.teachers.has(teacherName)) {
        month.teachers.set(teacherName, {
          name: teacherName,
          cutRate: cutRate,
          matched: !!teacher,
          income: 0, teacherCut: 0, adminProfit: 0, students: 0
        });
      }
      const agg = month.teachers.get(teacherName);
      agg.income += totalIncome;
      agg.teacherCut += teacherProfit;
      agg.adminProfit += totalIncome - teacherProfit;
      agg.students += session.students.length;
    });

    // Subscription sales: grouped by the month the package was issued.
    subs.forEach(function (sub) {
      const key = toMonthKey((sub.issueDate || '').slice(0, 10) || sub.issueDate);
      if (key === 'unknown') return;
      const month = monthFor(key);
      const price = parsePriceTag(sub.priceTag);
      month.subs.push({
        student: sub.studentFullName || 'Unnamed student',
        priceRaw: sub.priceTag,
        price: price,
        type: sub.type || '',
        usage: sub.usage || '',
        issued: String(sub.issueDate || '').slice(0, 10)
      });
      if (price !== null) {
        month.subsValue += price;
        month.subsKnown += 1;
      }
    });

    // Study clicks: paid recordings, grouped by the month they were created.
    clicks.forEach(function (c) {
      const key = toMonthKey(c.dateCreated);
      if (key === 'unknown') return;
      const month = monthFor(key);
      const amount = Number(c.paidAmount) || 0;
      month.clicks.push({
        student: c.studentName || 'Unnamed student',
        amount: amount,
        created: String(c.dateCreated || '').slice(0, 10)
      });
      month.clicksValue += amount;
    });

    // Newest first: calendar month descending is enough for all sources.
    return [...months.values()].sort(function (a, b) {
      return b.key.localeCompare(a.key);
    }).map(function (m) {
      if (m.key !== 'unknown') m.label = monthLabelFromKey(m.key);
      return m;
    });
  }

  function cutRateBadge(cutRate, matched) {
    if (!matched) {
      return '<span class="mi-badge mi-badge-warn" title="This teacher was not found in the teachers list">' +
        '<i class="bi bi-exclamation-triangle-fill"></i> not in list</span>';
    }
    if (cutRate === null) {
      return '<span class="mi-badge mi-badge-warn" title="No cut rate set — the full amount currently counts as your profit">' +
        '<i class="bi bi-exclamation-triangle-fill"></i> rate not set</span>';
    }
    return '<span class="mi-badge mi-badge-ok">' + fmt(cutRate) + '%</span>';
  }

  function renderTeacherRows(month) {
    const rows = [...month.teachers.values()].sort(function (a, b) {
      return b.income - a.income;
    });
    if (!rows.length) {
      return '<tr><td colspan="6" class="text-muted text-center py-3">No paid sessions this month.</td></tr>';
    }
    return rows.map(function (t) {
      return '<tr>' +
        '<td class="mi-teacher-name">' + escapeHtml(t.name) + (t.matched ? '' : cutRateBadge(null, false)) + '</td>' +
        '<td class="text-center">' + cutRateBadge(t.cutRate, t.matched) + '</td>' +
        '<td class="text-center">' + t.students + '</td>' +
        '<td class="text-end mi-num">' + fmt(t.income) + '</td>' +
        '<td class="text-end mi-num mi-teacher-cut">-' + fmt(t.teacherCut) + '</td>' +
        '<td class="text-end mi-num mi-admin-profit">' + fmt(t.adminProfit) + '</td>' +
        '</tr>';
    }).join('');
  }

  function sortExtras(list, valueOf) {
    return list.slice().sort(function (a, b) {
      const av = valueOf(a), bv = valueOf(b);
      if (av === null && bv === null) return String(b.issued || b.created || '').localeCompare(String(a.issued || a.created || ''));
      if (av === null) return 1;   // unparseable prices sink to the bottom
      if (bv === null) return -1;
      return bv - av;              // big money first
    });
  }

  function renderExtrasTable(month) {
    const subs = sortExtras(month.subs, function (s) { return s.price; });
    const clicks = month.clicks.slice().sort(function (a, b) { return b.amount - a.amount; });
    const rows = [];

    subs.forEach(function (s) {
      rows.push('<tr>' +
        '<td><span class="mi-extra-source mi-extra-source-sub"><i class="bi bi-stars"></i> Package</span></td>' +
        '<td class="mi-teacher-name">' + escapeHtml(s.student) + '</td>' +
        '<td class="text-end mi-num' + (s.price === null ? ' mi-price-unclear' : '') + '">' +
          (s.price === null ? escapeHtml(s.priceRaw) : fmt(s.price)) +
        '</td>' +
        '<td>' + escapeHtml(s.type || '-') + '</td>' +
        '<td>' + escapeHtml(s.usage || '-') + '</td>' +
        '<td class="text-nowrap">' + escapeHtml(s.issued || '-') + '</td>' +
        '</tr>');
    });
    clicks.forEach(function (c) {
      rows.push('<tr>' +
        '<td><span class="mi-extra-source mi-extra-source-click"><i class="bi bi-mouse2"></i> Study click</span></td>' +
        '<td class="mi-teacher-name">' + escapeHtml(c.student) + '</td>' +
        '<td class="text-end mi-num">' + fmt(c.amount) + '</td>' +
        '<td>-</td><td>-</td>' +
        '<td class="text-nowrap">' + escapeHtml(c.created || '-') + '</td>' +
        '</tr>');
    });

    if (!rows.length) {
      return '<div class="text-muted text-center py-2"><i class="bi bi-inbox"></i> No package sales or study clicks recorded this month.</div>';
    }
    return '<div class="table-responsive"><table class="table table-sm table-hover align-middle mb-0 mi-teacher-table">' +
      '<thead><tr><th>SOURCE</th><th>STUDENT</th><th class="text-end">RECORDED PRICE</th>' +
      '<th>TYPE</th><th>USAGE</th><th>DATE</th></tr></thead>' +
      '<tbody>' + rows.join('') + '</tbody></table></div>' +
      (month.subs.some(function (s) { return s.price === null; })
        ? '<div class="mi-extras-note"><i class="bi bi-info-circle"></i> Prices that are written as text instead of a number are shown as typed and are not added to any total.</div>'
        : '');
  }

  function render(months) {
    const body = document.getElementById('monthly-income-body');
    if (!body) return;

    if (!months.length) {
      body.innerHTML = '<div class="text-muted text-center py-4">No paid payments recorded yet.</div>';
      return;
    }

    const totals = months.reduce(function (acc, m) {
      acc.income += m.income;
      acc.teacherCut += m.teacherCut;
      acc.profit += m.profit;
      acc.students += m.students;
      acc.subsValue += m.subsValue;
      acc.subsKnown += m.subsKnown;
      acc.clicksValue += m.clicksValue;
      return acc;
    }, { income: 0, teacherCut: 0, profit: 0, students: 0, subsValue: 0, subsKnown: 0, clicksValue: 0 });

    // Newest month starts expanded so current records are visible at once.
    const tableRows = months.map(function (month, idx) {
      // Start collapsed: the page opens clean and every month bends to a click.
      const expanded = false;
      const subsCell = (month.subsKnown ? fmt(month.subsValue) : '0') +
        '<span class="mi-mini-note">' + month.subs.length + ' sold</span>';
      const clicksCell = fmt(month.clicksValue) +
        '<span class="mi-mini-note">' + month.clicks.length + ' rec.</span>';
      return '<tr class="mi-month-row' + (expanded ? ' mi-expanded' : '') + '" data-month="' + escapeHtml(month.key) + '">' +
        '<td>' +
          '<span class="mi-chevron"><i class="bi bi-chevron-' + (expanded ? 'down' : 'right') + '"></i></span>' +
          '<span class="mi-month-name">' + escapeHtml(month.label || 'Unknown date') + '</span>' +
          (idx === 0 ? '<span class="mi-badge mi-badge-new">Newest</span>' : '') +
          '<span class="mi-mini-note">' + month.students + ' payments</span>' +
        '</td>' +
        '<td class="text-end mi-num">' + fmt(month.income) + '</td>' +
        '<td class="text-end mi-num">' + subsCell + '</td>' +
        '<td class="text-end mi-num">' + clicksCell + '</td>' +
        '<td class="text-end mi-num mi-teacher-cut">-' + fmt(month.teacherCut) + '</td>' +
        '<td class="text-end mi-num mi-admin-profit">' + fmt(month.profit) + '</td>' +
        '</tr>' +
        '<tr class="mi-detail-row' + (expanded ? '' : ' d-none') + '" data-detail="' + escapeHtml(month.key) + '">' +
          '<td colspan="6" class="mi-detail-cell">' +
            '<div class="mi-detail-block">' +
              '<div class="mi-detail-title"><i class="bi bi-person-badge"></i> Teacher income → cut → your profit</div>' +
              '<div class="table-responsive"><table class="table table-sm table-hover align-middle mb-0 mi-teacher-table">' +
                '<thead><tr>' +
                  '<th>TEACHER</th><th class="text-center">CUT RATE</th>' +
                  '<th class="text-center">STUDENT PAYMENTS</th>' +
                  '<th class="text-end">TEACHER INCOME</th>' +
                  '<th class="text-end">TEACHER\'S CUT (PAID OUT)</th>' +
                  '<th class="text-end">YOUR PROFIT</th>' +
                '</tr></thead>' +
                '<tbody>' + renderTeacherRows(month) + '</tbody>' +
              '</table></div>' +
            '</div>' +
            '<div class="mi-detail-block">' +
              '<div class="mi-detail-title"><i class="bi bi-stars"></i> Packages sold &amp; study clicks — no teacher cut taken</div>' +
              renderExtrasTable(month) +
            '</div>' +
          '</td>' +
        '</tr>';
    }).join('');

    body.innerHTML =
      '<div class="mi-legend">' +
        '<span><i class="bi bi-square-fill mi-legend-green"></i> Your profit — what stays with you after teacher cuts</span>' +
        '<span><i class="bi bi-square-fill mi-legend-red"></i> Teachers\' cut — the share owed to teachers</span>' +
        '<span><i class="bi bi-square-fill mi-legend-purple"></i> Teacher income — the full session money students paid</span>' +
        '<span class="mi-legend-click"><i class="bi bi-mouse2"></i> click a month to break it down</span>' +
      '</div>' +
      '<div class="table-responsive">' +
        '<table class="table table-hover align-middle mb-0 mi-month-table">' +
          '<thead><tr>' +
            '<th>MONTH</th>' +
            '<th class="text-end" title="All student payments inside paid session cards">SESSION INCOME</th>' +
            '<th class="text-end" title="Subscription packages issued this month (no teacher cut)">PACKAGES SOLD</th>' +
            '<th class="text-end" title="Study-click payments created this month (no teacher cut)">STUDY CLICKS</th>' +
            '<th class="text-end" title="Teachers’ share of the session income">TEACHERS\' CUT</th>' +
            '<th class="text-end" title="Session income + packages + study clicks − teachers’ cut = what you keep">YOUR PROFIT</th>' +
          '</tr></thead>' +
          '<tbody>' + tableRows + '</tbody>' +
          '<tfoot><tr>' +
            '<td>All months</td>' +
            '<td class="text-end mi-num">' + fmt(totals.income) + '</td>' +
            '<td class="text-end mi-num">' + (totals.subsKnown ? fmt(totals.subsValue) : '0') + '</td>' +
            '<td class="text-end mi-num">' + fmt(totals.clicksValue) + '</td>' +
            '<td class="text-end mi-num mi-teacher-cut">-' + fmt(totals.teacherCut) + '</td>' +
            '<td class="text-end mi-num mi-admin-profit mi-total-profit">' +
              fmt(totals.income + totals.subsValue + totals.clicksValue - totals.teacherCut) +
            '</td>' +
          '</tr></tfoot>' +
        '</table>' +
      '</div>' +
      '<div class="mi-footnote">' +
        '<i class="bi bi-info-circle"></i> Teachers\' cut is worked out session by session, exactly like the Paid page, ' +
        'using each teacher\'s <strong>cut rate</strong> from the Teachers page. Only sessions where every student is ' +
        '<em>Paid</em> are counted. Package sales and study clicks belong fully to the center — no teacher cut is taken on them.' +
      '</div>';

    // Expand/collapse: clicking a month row reveals the per-teacher breakdown
    // plus the package / study-click lists for that month.
    body.querySelectorAll('.mi-month-row').forEach(function (row) {
      row.addEventListener('click', function () {
        const key = row.getAttribute('data-month');
        const detail = body.querySelector('[data-detail="' + key + '"]');
        if (!detail) return;
        const show = detail.classList.toggle('d-none');
        row.classList.toggle('mi-expanded', !show);
        row.querySelector('.mi-chevron i').className =
          'bi bi-chevron-' + (show ? 'right' : 'down');
      });
    });
  }

  async function init() {
    const body = document.getElementById('monthly-income-body');
    if (!body) return;
    try {
      const [paymentsRes, teachersRes, subsRes, clicksRes] = await Promise.all([
        fetch('/database/teacher-portal/payments.json'),
        fetch('/database/teachers.json'),
        fetch('/database/subscription.json').catch(function () { return null; }),
        fetch('/database/study-clicks.json').catch(function () { return null; })
      ]);
      const data = {
        payments: await paymentsRes.json(),
        teachers: await teachersRes.json(),
        subscriptions: subsRes ? await subsRes.json().catch(function () { return []; }) : [],
        studyClicks: clicksRes ? await clicksRes.json().catch(function () { return []; }) : []
      };
      render(buildMonthAggregates(data));
      const updated = document.getElementById('monthly-income-updated');
      if (updated) {
        updated.innerHTML = '<i class="bi bi-arrow-repeat"></i> Live from payments · subscriptions · study clicks';
      }
    } catch (err) {
      body.innerHTML =
        '<div class="text-danger text-center py-4">Could not load monthly income data.</div>';
    }
  }

  window.MonthlyIncome = { recompute: init };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
