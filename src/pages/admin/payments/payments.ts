// Convert decimal hours to 'X hour(s) Y minute(s)'
function adm_payments_formatHoursDecimal(decimal) {
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
function adm_payments_formatDuration(mins) {
  const hours = Math.floor(mins / 60);
  const minutes = mins % 60;
  const parts = [];
  if (hours > 0) parts.push(hours + (hours === 1 ? ' hour' : ' hours'));
  if (minutes > 0) parts.push(minutes + (minutes === 1 ? ' minute' : ' minutes'));
  return parts.length ? parts.join(' and ') : '0 minutes';
}

// Escape HTML so statement text typed in a subscription cell renders safely.
function adm_payments_escapeHtmlText(str) {
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
function paymentStatement(s, sub) {
  if (s && s.subscriptionStatement) return String(s.subscriptionStatement);
  if (sub && typeof sub.priceTag === 'string') {
    const t = sub.priceTag.trim();
    if (t && !/^\d+(\.\d+)?$/.test(t) && t.toLowerCase() !== 'unlimited') return t;
  }
  return '';
}

// Build the NOTES cell: the payment note (if any) plus a highlighted line
// mentioning the subscription statement the admin typed in the price cell.
function paymentNoteHtml(s, sub) {
  const stmt = paymentStatement(s, sub);
  return `${s.note || (stmt ? '' : '-')}${stmt ? `<div class="text-warning fw-semibold mt-1" style="font-size:12px;"><i class="bi bi-megaphone-fill me-1"></i>${adm_payments_escapeHtmlText(stmt)}</div>` : ''}`;
}
// Payments Page Logic
// Loads session-form.json and payments.json, renders cards and tables

// Import undo manager
import { pushAction, createDeleteAction, createEditAction } from '/assist/undo-manager.js';


async function fetchJson(url) {
  // no-store: always read the live file, never a stale browser copy, so a
  // newly saved payment can never be missing from this page.
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Could not load ${url} (${res.status})`);
  return await res.json();
}

// New session-form rows waiting for the office to set a price.
// Only an explicit status assignment moves a row off this page: a row stays in
// the intake worklist until someone clicks Paid / Partial / Unpaid (or
// subscribes the student). Typing a price tag or amount alone must never make
// the other students on the form disappear.
function isNewPaymentRow(row) {
  if (!row) return false;
  const status = String(row.status || '').trim().toLowerCase();
  return status === '' || status === 'pending';
}

// Fetch subscriptions once and cache
let subscriptionData = [];
async function fetchSubscriptions() {
  try {
    const res = await fetch('/api/subscriptions');
    subscriptionData = await res.json();
  } catch {
    subscriptionData = [];
  }
}

// Stored dates mix ISO, English and French spellings (e.g. '03 Mai 2026').
// Parse them all as local calendar dates so no payment falls out of its month.
const adm_payments_monthLookup: { [key: string]: number } = {
  january: 0, jan: 0, janvier: 0,
  february: 1, feb: 1, fevrier: 1,
  march: 2, mar: 2, mars: 2,
  april: 3, apr: 3, avril: 3,
  may: 4, mai: 4,
  june: 5, jun: 5, juin: 5,
  july: 6, jul: 6, juillet: 6,
  august: 7, aug: 7, aout: 7,
  september: 8, sep: 8, septembre: 8,
  october: 9, oct: 9, octobre: 9,
  november: 10, nov: 10, novembre: 10,
  december: 11, dec: 11, decembre: 11
};

function parsePaymentDate(value) {
  if (!value) return null;
  if (value instanceof Date) return isNaN(value.getTime()) ? null : value;
  const text = String(value).trim();
  if (!text) return null;
  const iso = text.match(/^(\d{4})-(\d{1,2})-(\d{1,2})(?:[T\s](.*))?$/);
  if (iso) {
    if (iso[4]) {
      const withTime = new Date(text);
      return isNaN(withTime.getTime()) ? null : withTime;
    }
    const local = new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]));
    return isNaN(local.getTime()) ? null : local;
  }
  const dayMonthYear = text.match(/^(\d{1,2})[\s/.-]+([A-Za-z\u00C0-\u00FF]+)[\s/.,-]+(\d{4})$/);
  if (dayMonthYear) {
    const key = String(dayMonthYear[2]).trim().toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const month = adm_payments_monthLookup[key];
    if (month !== undefined) {
      const local = new Date(Number(dayMonthYear[3]), month, Number(dayMonthYear[1]));
      return isNaN(local.getTime()) ? null : local;
    }
  }
  const numeric = text.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/);
  if (numeric) {
    const local = new Date(Number(numeric[3]), Number(numeric[2]) - 1, Number(numeric[1]));
    return isNaN(local.getTime()) ? null : local;
  }
  const fallback = new Date(text);
  return isNaN(fallback.getTime()) ? null : fallback;
}

function formatDate(dateStr, withTime = false) {
  if (!dateStr) return '';
  const d = parsePaymentDate(dateStr);
  if (!d) return String(dateStr);
  let date = d.toLocaleDateString('en-GB');
  if (withTime) {
    date += ' ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  }
  return date;
}

// Sort key for payment cards: newest submission on top. Prefers the matched
// attendance record's submittedAt (latest save of the session), then the first
// student payment's submittedAt, then the session date as a fallback.
function getSessionSortTime(session, sessions) {
  if (sessions) {
    const match = sessions.find(ses =>
      (ses.teacherName === session.createdBy || ses.teacherName === session.teacherName) &&
      ses.date === session.date &&
      ses.subject === session.subject &&
      ses.classroom === session.classroom &&
      ses.timeWindow === session.timeWindow
    );
    if (match && match.submittedAt) {
      const t = parsePaymentDate(match.submittedAt);
      if (t) return t.getTime();
    }
  }
  const firstPay = session.students && session.students[0];
  if (firstPay && firstPay.submittedAt) {
    const t = parsePaymentDate(firstPay.submittedAt);
    if (t) return t.getTime();
  }
  if (session.date) {
    const d = parsePaymentDate(session.date);
    if (d) return d.getTime();
  }
  return 0;
}

// Month helpers: forms are grouped into month sections (newest first) so
// payment cards from last year live in their own section instead of being
// mixed up with the ones created this week.
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

// Which date decides a form's month: the session date on the card itself,
// falling back to the submission timestamp for cards without a proper date.
function getSessionMonthDate(session) {
  let d = parsePaymentDate(session.date);
  if (!d) d = parsePaymentDate(session.submittedAt);
  return d || null;
}

function getSessionMonthKey(session) {
  const d = getSessionMonthDate(session);
  return d ? d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') : 'unknown';
}

function getSessionMonthLabel(session) {
  const d = getSessionMonthDate(session);
  return d ? MONTH_NAMES[d.getMonth()] + ' ' + d.getFullYear() : 'Unknown date';
}

function formatDateShort(dateStr) {
  if (!dateStr) return '-';
  const d = parsePaymentDate(dateStr);
  if (!d) return dateStr;
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

// Remember which month sections the admin collapsed/expanded between page
// loads, like a real dashboard would. Defaults: only the newest month open.
const GROUP_STATE_KEY = 'paymentsAdminGroupsExpanded';
function loadGroupExpandedState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(GROUP_STATE_KEY));
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (e) {
    return {};
  }
}
function saveGroupExpandedState(state) {
  try { localStorage.setItem(GROUP_STATE_KEY, JSON.stringify(state)); } catch (e) { /* private mode etc. */ }
}

// Cards are rebuilt after every payment update (the priced row moves to its
// Paid/Partial/Unpaid page). Remember which session cards were open so saving
// a status never snaps the card shut while someone is working in it.
const adm_payments_expandedCards = new Set<string>();

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
        <input class="js-sub-price form-control form-control-sm mb-3" type="number" min="0" step="1" value="${defaultPrice === 'unlimited' ? '' : (Number(defaultPrice) || '')}" />
        <div style="display:flex;justify-content:flex-end;gap:8px;">
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
  // Only forms that still contain a row the office has not assigned yet stay
  // on this page. Paid / Partial / Unpaid rows live on their own pages.
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
  // Newest session submissions first, oldest at the bottom, then group into
  // month sections (newest month on top, previous years in their own
  // sections) so the page reads like a proper admin dashboard.
  sessionList.sort((a, b) => getSessionSortTime(b, sessions) - getSessionSortTime(a, sessions));
  const monthMap = new Map();
  sessionList.forEach(session => {
    const key = getSessionMonthKey(session);
    if (!monthMap.has(key)) monthMap.set(key, []);
    monthMap.get(key).push(session);
  });
  const groups = [...monthMap.entries()].sort((a, b) => b[0].localeCompare(a[0]));

  // When a search/filter is active, open every section so matches are always
  // visible; otherwise fall back to the saved expand/collapse choices.
  const searchInputEl = document.getElementById('searchInput');
  const filterTypeEl = document.getElementById('filterPaymentsType');
  const filterValueEl = document.getElementById('filterPaymentsValue');
  const startMonthEl = document.getElementById('startMonthInput');
  const endMonthEl = document.getElementById('endMonthInput');
  const filtersActive = (searchInputEl && searchInputEl.value.trim()) ||
    (filterTypeEl && filterTypeEl.value && filterValueEl && filterValueEl.value) ||
    (startMonthEl && startMonthEl.value) || (endMonthEl && endMonthEl.value);

  const groupState = loadGroupExpandedState();
  listDiv.innerHTML = '';

  // Bucket the consecutive month sections by calendar year so every year is
  // its own collapsible section (the old divider look, now clickable). Years
  // older than the newest one start collapsed, so when a new year begins the
  // previous year folds away until someone expands it.
  const yearBuckets = [];
  let bucketYear = null;
  groups.forEach(([monthKey, monthSessions], groupIdx) => {
    const bucketYr = monthKey === 'unknown' ? '' : monthKey.slice(0, 4);
    if (bucketYr !== bucketYear) {
      bucketYear = bucketYr;
      yearBuckets.push({ year: bucketYr, groups: [] });
    }
    yearBuckets[yearBuckets.length - 1].groups.push({
      monthKey,
      monthSessions,
      groupIdx
    });
  });

  yearBuckets.forEach((bucket, yearIdx) => {
    let monthHost = listDiv;
    if (bucket.year) {
      // Years start expanded, and a manual collapse is remembered.
      const yearOpen = groupState[bucket.year] !== false;
      const yearSection = document.createElement('section');
      yearSection.className = 'payments-year-section' + (yearOpen ? '' : ' collapsed');
      yearSection.dataset.year = bucket.year;
      yearSection.innerHTML = `
        <header class="payments-year-header" title="Click to expand or collapse this year">
          <span class="payments-year-chevron"><i class="bi bi-chevron-down"></i></span>
          <span class="payments-year-name">Year ${bucket.year}</span>
          <span class="payments-year-line"></span>
        </header>
        <div class="payments-year-body"></div>
      `;
      yearSection.querySelector('.payments-year-header').addEventListener('click', () => {
        const open = yearSection.classList.toggle('collapsed') ? false : true;
        groupState[bucket.year] = open;
        saveGroupExpandedState(groupState);
      });
      listDiv.appendChild(yearSection);
      monthHost = yearSection.querySelector('.payments-year-body');
    }

    bucket.groups.forEach((monthGroup) => {
    const monthKey = monthGroup.monthKey;
    const monthSessions = monthGroup.monthSessions;
    const groupIdx = monthGroup.groupIdx;

    // Label for the month bar ("November 2026") and how many students on this
    // month's forms still owe money. Both are used in the header template below.
    const monthLabel = monthKey === 'unknown'
      ? 'Unknown date'
      : (() => {
        const [labelYear, labelMonth] = String(monthKey).split('-').map(Number);
        const labelDate = new Date(labelYear, (labelMonth || 1) - 1, 1);
        return isNaN(labelDate.getTime())
          ? String(monthKey)
          : labelDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });
      })();
    const newStudents = monthSessions.reduce((total, monthSession) => {
      const students = Array.isArray(monthSession.students) ? monthSession.students : [];
      return total + students.filter(isNewPaymentRow).length;
    }, 0);

    // Months start collapsed so the page opens as a clean overview; once a
    // month is opened it stays open across re-renders and page loads, and an
    // active search/filter opens every section.
    const defaultOpen = !!filtersActive || groupState[monthKey] === true;

    const section = document.createElement('section');
    section.className = 'payments-group' + (defaultOpen ? '' : ' collapsed');
    section.dataset.month = monthKey;
    section.innerHTML = `
      <header class="payments-group-header" title="Click to expand or collapse this month">
        <div class="payments-group-title">
          <span class="payments-group-chevron"><i class="bi bi-chevron-down"></i></span>
          <span class="payments-group-name">${monthLabel}</span>
          ${groupIdx === 0 && !filtersActive ? '<span class="payments-group-badge">Newest</span>' : ''}
        </div>
        <div class="payments-group-meta">
          <span><i class="bi bi-journal-text"></i> ${monthSessions.length} form${monthSessions.length === 1 ? '' : 's'}</span>
          <span><i class="bi bi-people"></i> ${newStudents} student${newStudents === 1 ? '' : 's'} to price</span>
        </div>
      </header>
      <div class="payments-group-body"></div>
    `;
    const headerEl = section.querySelector('.payments-group-header');
    const body = section.querySelector('.payments-group-body');
    headerEl.addEventListener('click', () => {
      const open = section.classList.toggle('collapsed') ? false : true;
      groupState[monthKey] = open;
      saveGroupExpandedState(groupState);
    });

    monthSessions.forEach(session => {
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
    const sessionKey = [session.createdBy, session.date, session.subject, session.classroom, session.timeWindow].join('|');
    card.dataset.sessionKey = sessionKey;
    const startExpanded = adm_payments_expandedCards.has(sessionKey);
    card.className = 'payment-card' + (startExpanded ? '' : ' collapsed');
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
        durationStr = mins > 0 ? adm_payments_formatDuration(mins) : '';
      }
    }
    // Show date and time for Submitted field
    let submittedDate = '';
    if (session.submittedAt) {
      // If submittedAt is ISO string, use full date and time
      submittedDate = formatDate(session.submittedAt, true);
    } else if (session.date && session.timeWindow) {
      // Combine date and first time in timeWindow
      const firstTime = session.timeWindow.split('-')[0].trim();
      const dateTimeStr = session.date + 'T' + firstTime;
      submittedDate = formatDate(dateTimeStr, true);
    } else {
      submittedDate = formatDate(session.date);
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
            <span><i class="bi bi-calendar3"></i> ${formatDateShort(session.date)}</span>
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
                // Robust subscription match: by name (trim/case), fallback to studentId
                let sub = null;
                if (s.studentName) {
                  sub = subscriptionData.find(sub => sub.studentFullName && sub.studentFullName.trim().toLowerCase() === s.studentName.trim().toLowerCase());
                }
                if (!sub && s.studentId) {
                  sub = subscriptionData.find(sub => sub.studentId && String(sub.studentId) === String(s.studentId));
                }
                let subInfo = '';
                let subDetails = '';
                let nameHtml = `<div>${s.studentName || '-'}</div>`;
                if (sub && s.status === 'Paid') {
                  // Green for paid by subscription
                  nameHtml = `<div style="color:#198754;font-weight:bold;">${s.studentName || '-'}</div>`;
                }
                if (sub) {
                  subInfo = `<span class='badge bg-success ms-1'><i class="bi bi-star-fill"></i> ${sub.usage}${sub.expirationDate ? ` (expires: ${sub.expirationDate})` : ''}</span>`;
                  subDetails = `
                    <div class="subscription-details-table-wrapper mt-2" style="background:#f6fffa; border-radius:6px; padding:8px; border:1px solid #b6f0d3;">
                      <div class="fw-bold mb-1" style="color:#198754;"><i class="bi bi-info-circle"></i> Subscription Details</div>
                      <table class="table table-bordered table-sm mb-0" style="background:#f6fffa;">
                        <thead class="table-light">
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
                            <td>${adm_payments_escapeHtmlText(sub.priceTag) || '-'}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  `;
                } else {
                  subInfo = '<span class="text-muted">No subscription</span>';
                  subDetails = '';
                }
                return `
                <tr data-payment-id="${s.id}" data-idx="${idx}">
                  <td style="vertical-align:top;">
                    ${nameHtml}
                    ${subDetails}
                  </td>
                  <td>${s.phone || '-'}</td>
                  <td>${subInfo}</td>
                  <td>${typeof s.hours !== 'undefined' ? adm_payments_formatHoursDecimal(Number(s.hours)) : '-'}</td>
                  <td>${(s.cutRate !== undefined && s.cutRate !== null && s.cutRate !== '') ? s.cutRate + '%' : '-'}</td>
                  <td>${paymentNoteHtml(s, sub)}</td>
                  <td><input type="number" class="form-control form-control-sm price-tag-input" value="${s.priceTag && s.priceTag !== 0 ? s.priceTag : ''}" style="width:70px;" /></td>
                  <td><input type="number" class="form-control form-control-sm amount-input" value="${s.amount && s.amount !== 0 ? s.amount : ''}" style="width:70px;" /></td>
                  <td>
                    <div class="payment-status-actions">
                      <button type="button" class="btn btn-outline-success btn-sm status-btn status-paid">✓ Paid</button>
                      <button type="button" class="btn btn-outline-warning btn-sm status-btn status-partial" data-idx="${idx}">/ Partial</button>
                      <button type="button" class="btn btn-outline-danger btn-sm status-btn status-unpaid">✗ Unpaid</button>
                      ${!sub ? '<button type="button" class="btn btn-outline-primary btn-sm status-btn status-subscribed">Subscribed</button>' : ''}
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
    // Toggle expand/collapse (reuse logic)
    const header = card.querySelector('.payment-card-header');
    const details = card.querySelector('.payment-card-details-area');
    const hideBtn = card.querySelector('.hide-btn');
    let expanded = startExpanded;
    function setState(expand) {
      expanded = expand;
      if (expand) {
        card.classList.remove('collapsed');
        details.style.display = '';
        hideBtn.textContent = 'Hide';
        adm_payments_expandedCards.add(sessionKey);
      } else {
        card.classList.add('collapsed');
        details.style.display = 'none';
        hideBtn.textContent = 'Show';
        adm_payments_expandedCards.delete(sessionKey);
      }
    }
    setState(startExpanded);
    header.addEventListener('click', e => {
      if (e.target.classList.contains('delete-btn')) return;
      setState(!expanded);
    });
    hideBtn.addEventListener('click', e => {
      e.stopPropagation();
      setState(!expanded);
    });
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

      // Create undo action that recreates each deleted payment at its original spot
      const undoAction = window.createCustomAction('delete', async () => {
        for (let i = 0; i < deletedPayments.length; i++) {
          const p = deletedPayments[i];
          await fetch('/api/payments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...p, _restoreIndex: firstPaymentIdx + i })
          });
        }
        // Re-render in place instead of reloading the page: a reload wipes
        // the in-memory undo stack, so clicking Undo again would have nothing
        // left to restore. loadPayments() refreshes the list from the server.
        await loadPayments();
      });
      pushAction(undoAction);
      
      card.remove();
    });
    // Attach partial button logic after rendering
    setTimeout(() => {
      // Only the outer table's rows — the subscription-details table nested
      // inside a cell would add extra <tr>s and break the row index mapping.
      const rows = card.querySelectorAll('.payment-card-details-area > .table-responsive > table > tbody > tr');
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
        const paymentId = session.students[idx].id;
        if (priceTagInput) {
          priceTagInput.addEventListener('blur', async () => {
            const newPriceTag = priceTagInput.value ? Number(priceTagInput.value) : 0;
            const oldPriceTag = session.students[idx].priceTag || 0;
            
            if (newPriceTag !== oldPriceTag) {
              // Create undo action for priceTag change
              const undoAction = createEditAction(
                { ...session.students[idx], priceTag: oldPriceTag },
                { ...session.students[idx], priceTag: newPriceTag },
                'payment',
                `/api/payments/${paymentId}`,
                async () => {
                  await loadPayments();
                }
              );
              pushAction(undoAction);
            }
            
            await fetch(`/api/payments/${paymentId}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ priceTag: newPriceTag })
            });
          });
        }
        if (amountInput) {
          amountInput.addEventListener('blur', async () => {
            const newAmount = amountInput.value ? Number(amountInput.value) : 0;
            const oldAmount = session.students[idx].amount || 0;
            
            if (newAmount !== oldAmount) {
              // Create undo action for amount change
              const undoAction = createEditAction(
                { ...session.students[idx], amount: oldAmount },
                { ...session.students[idx], amount: newAmount },
                'payment',
                `/api/payments/${paymentId}`,
                async () => {
                  await loadPayments();
                }
              );
              pushAction(undoAction);
            }
            
            await fetch(`/api/payments/${paymentId}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ amount: newAmount })
            });
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
                const oldPaymentSnapshot = { ...session.students[idx] };
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
                  await fetchSubscriptions();
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
              const paidStudent = session.students.find(s => String(s.id) === String(paymentId));
              if (paidStudent) paidStudent.status = 'Paid';
              alert('Student added to subscriptions and marked as Paid. You can now edit their package details in the subscriptions page.');
              await fetchSubscriptions();
              await loadPayments();
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
            const paymentId = session.students[idx].id;
            let newPriceTag = priceTagInput ? Number(priceTagInput.value) : 0;
            let newAmount = amountInput ? Number(amountInput.value) : 0;
            if (isNaN(newPriceTag)) newPriceTag = 0;
            if (isNaN(newAmount)) newAmount = 0;
            const oldStatus = session.students[idx].status || 'Unpaid';
            
            if (newPriceTag > 0 && newAmount === newPriceTag) {
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
                const paymentRecord = session.students[idx];
                let subForStudent = null;
                if (paymentRecord && paymentRecord.studentName) {
                  subForStudent = subscriptionData.find(sub => sub.studentFullName && sub.studentFullName.trim().toLowerCase() === paymentRecord.studentName.trim().toLowerCase());
                }
                if (!subForStudent && paymentRecord && paymentRecord.studentId) {
                  subForStudent = subscriptionData.find(sub => sub.studentId && String(sub.studentId) === String(paymentRecord.studentId));
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
                    subscriptionData = subData.subscriptions;
                  }
                  // Refresh the subscription price shown in this row's
                  // subscription details table (if visible).
                  const subPriceCell = row.querySelector('.subscription-details-table-wrapper tbody tr td:last-child');
                  if (subPriceCell) subPriceCell.textContent = syncedPriceTag;
                }
                
                // Create undo action for status change
                const undoAction = createEditAction(
                  { ...session.students[idx], status: oldStatus },
                  { ...session.students[idx], priceTag: newPriceTag, amount: newAmount, status: 'Paid' },
                  'payment',
                  `/api/payments/${paymentId}`,
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
                    await fetchSubscriptions();
                    await loadPayments();
                  }
                );
                pushAction(undoAction);
                
                // Keep the complete ledger visible: refresh the page data so
                // the row now shows its new Paid status in place.
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
            const paymentId = session.students[idx].id;
            let newPriceTag = priceTagInput ? Number(priceTagInput.value) : 0;
            let newAmount = amountInput ? Number(amountInput.value) : 0;
            if (isNaN(newPriceTag)) newPriceTag = 0;
            if (isNaN(newAmount)) newAmount = 0;
            const oldStatus = session.students[idx].status || 'Unpaid';
            
            // Only allow partial if amount > 0 and amount < priceTag
            if (newPriceTag > 0 && newAmount > 0 && newAmount < newPriceTag) {
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
                
                // Create undo action for status change
                const undoAction = createEditAction(
                  { ...session.students[idx], status: oldStatus },
                  { ...session.students[idx], priceTag: newPriceTag, amount: newAmount, status: 'Partial' },
                  'payment',
                  `/api/payments/${paymentId}`,
                  async () => {
                    await loadPayments();
                  }
                );
                pushAction(undoAction);
                // Refresh in place so every row (including this newly partial
                // one) stays visible on the complete Payments ledger.
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
            const paymentId = session.students[idx].id;
            const newPriceTag = priceTagInput ? Number(priceTagInput.value) : 0;
            // Treat empty, whitespace, or zero as 0
            let amountRaw = amountInput && typeof amountInput.value === 'string' ? amountInput.value.trim() : '';
            let newAmount = amountRaw === '' ? 0 : Number(amountRaw);
            if (isNaN(newAmount)) newAmount = 0;
            const oldStatus = session.students[idx].status || 'Unpaid';
            const oldAmount = session.students[idx].amount || 0;
            
            console.log('Unpaid button:', { paymentId, newPriceTag, newAmount, amountRaw });
            if (newPriceTag > 0 && (amountRaw === '' || newAmount === 0)) {
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
                
                // Create undo action for status change
                const undoAction = createEditAction(
                  { ...session.students[idx], status: oldStatus, amount: oldAmount },
                  { ...session.students[idx], priceTag: newPriceTag, amount: 0, status: 'Unpaid' },
                  'payment',
                  `/api/payments/${paymentId}`,
                  async () => {
                    await loadPayments();
                  }
                );
                pushAction(undoAction);
                
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
    body.appendChild(card);
    });

    monthHost.appendChild(section);
  });
  });
}

async function loadPayments() {
  // Always sync payments with latest students.json before loading payments (optional, skip for local JSON)
  // await fetch('/api/payments/sync-students', { method: 'POST' });
  const sessions = await fetchJson('/database/teacher-portal/teachers-attendance.json');
  // Fetch payments directly from JSON for local/test
  const payments = await fetchJson('/database/teacher-portal/payments.json');
  const studentsDb = await fetchJson('/database/students.json');
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
      const d = parsePaymentDate(p.date);
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
  await fetchSubscriptions();
  // Patch: cache sessions and payments for export
  const sessions = await fetchJson('/database/teacher-portal/teachers-attendance.json');
  const payments = await fetchJson('/database/teacher-portal/payments.json');
  sessionsCache = sessions;
  // Show all payments for export
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
