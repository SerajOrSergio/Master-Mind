// Shared month-grouping helpers for the admin/receptionist payment pages
// (Payments, Paid, Partial, Unpaid). Plain script — defines window.PaymentGroups
// so every page (module or classic script) can use it.
//
// Renders one collapsible section per month (newest first) with a year divider
// between different calendar years, so recent forms stay on top and older
// months fold away. Expand/collapse choices are remembered per browser.
(function () {
  const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  // Stored dates are a mix of ISO ('2026-05-02'), English ('03 May 2026')
  // and French ('03 Mai 2026') — the browser's Date parser rejects the French
  // spelling, which used to drop those rows out of their real month. Parse all
  // the shapes we store, using local calendar dates so no row shifts a day.
  const MONTH_LOOKUP = {
    january: 0, jan: 0, janvier: 0,
    february: 1, feb: 1, fevrier: 1, fev: 1,
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

  function normaliseMonthName(value) {
    return String(value || '').trim().toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  function parseDateValue(value) {
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
      const month = MONTH_LOOKUP[normaliseMonthName(dayMonthYear[2])];
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

  // Which date decides a form's month: the session date on the card itself,
  // falling back to the submission timestamp for cards whose date string is
  // missing or in a format the browser cannot parse.
  function getSessionMonthDate(session) {
    let d = parseDateValue(session.date);
    if (!d) d = parseDateValue(session.submittedAt);
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
    const d = parseDateValue(dateStr);
    if (!d) return dateStr;
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  // Newest-first sort fallback when a page has no sort of its own
  function getSortTime(session) {
    const submitted = parseDateValue(session.submittedAt);
    if (submitted) return submitted.getTime();
    const d = parseDateValue(session.date);
    return d ? d.getTime() : 0;
  }

  // Shared with the admin Payments page so a month folded away on one
  // page stays folded on the others.
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

  // Cards are re-rendered after every payment update (the row moves to its
  // Paid/Partial/Unpaid page). Remember which session cards were open so the
  // card someone is working in does not snap shut when they save a status.
  const expandedCards = new Set();

  // attachMonthSections(listDiv, sessionList, buildCard, options)
  //   sessionList : array of session-like objects ({date, students, ...}) — order free
  //   buildCard   : (session) => HTMLElement (the .payment-card element for one form)
  //   options     : { sort: false } to keep a separately computed sort,
  //                 { forceOpenAll: true } while a search/filter is active,
  //                 { groupMetaHtml: (sessions) => html } for custom section counts
  //   Returns the number of month sections rendered.
  function attachMonthSections(listDiv, sessionList, buildCard, options) {
    options = options || {};
    const forceOpenAll = !!options.forceOpenAll;
    const sessions = sessionList.slice();
    if (options.sort !== false) {
      sessions.sort((a, b) => getSortTime(b) - getSortTime(a));
    }

    const monthMap = new Map();
    sessions.forEach(session => {
      const key = getSessionMonthKey(session);
      if (!monthMap.has(key)) monthMap.set(key, []);
      monthMap.get(key).push(session);
    });
    const groups = [...monthMap.entries()].sort((a, b) => b[0].localeCompare(a[0]));

    const groupState = loadGroupExpandedState();
    listDiv.innerHTML = '';
    let sectionCount = 0;

    // Bucket the consecutive month sections by calendar year so every year
    // renders as its own collapsible section (the old divider look, now
    // clickable). Years older than the newest one start collapsed, so when a
    // new year begins the previous year folds away until someone expands it.
    const yearBuckets = [];
    let bucketYear = null;
    groups.forEach(([monthKey, monthSessions], groupIdx) => {
      const year = monthKey === 'unknown' ? '' : monthKey.slice(0, 4);
      if (year !== bucketYear) {
        bucketYear = year;
        yearBuckets.push({ year: year, groups: [] });
      }
      yearBuckets[yearBuckets.length - 1].groups.push({
        monthKey: monthKey,
        monthSessions: monthSessions,
        groupIdx: groupIdx
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
        yearSection.innerHTML =
          '<header class="payments-year-header" title="Click to expand or collapse this year">' +
          '<span class="payments-year-chevron"><i class="bi bi-chevron-down"></i></span>' +
          '<span class="payments-year-name">Year ' + bucket.year + '</span>' +
          '<span class="payments-year-line"></span>' +
          '</header>' +
          '<div class="payments-year-body"></div>';
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
      const monthLabel = getSessionMonthLabel(monthSessions[0]);
      const pendingStudents = monthSessions.reduce((n, s) => n + ((s.students && s.students.length) || 0), 0);
      const metaHtml = options.groupMetaHtml
        ? options.groupMetaHtml(monthSessions)
        : '<span><i class="bi bi-journal-text"></i> ' + monthSessions.length +
          ' form' + (monthSessions.length === 1 ? '' : 's') + '</span>' +
          '<span><i class="bi bi-people"></i> ' + pendingStudents +
          ' student' + (pendingStudents === 1 ? '' : 's') + '</span>';
      // Months start collapsed so the page opens as a clean overview of every
      // month; once someone opens a month it stays open across re-renders and
      // page loads, and an active search/filter opens every section.
      const defaultOpen = forceOpenAll || groupState[monthKey] === true;

      const section = document.createElement('section');
      section.className = 'payments-group' + (defaultOpen ? '' : ' collapsed');
      section.dataset.month = monthKey;
      section.innerHTML =
        '<header class="payments-group-header" title="Click to expand or collapse this month">' +
        '<div class="payments-group-title">' +
        '<span class="payments-group-chevron"><i class="bi bi-chevron-down"></i></span>' +
        '<span class="payments-group-name">' + monthLabel + '</span>' +
        (groupIdx === 0 && !forceOpenAll ? '<span class="payments-group-badge">Newest</span>' : '') +
        '</div>' +
        '<div class="payments-group-meta">' + metaHtml + '</div>' +
        '</header>' +
        '<div class="payments-group-body"></div>';
      const headerEl = section.querySelector('.payments-group-header');
      const body = section.querySelector('.payments-group-body');
      headerEl.addEventListener('click', () => {
        const open = section.classList.toggle('collapsed') ? false : true;
        groupState[monthKey] = open;
        saveGroupExpandedState(groupState);
      });

      monthSessions.forEach(session => {
        body.appendChild(buildCard(session));
      });

      monthHost.appendChild(section);
      sectionCount++;
      });
    });
    return sectionCount;
  }

  // Shared card toggle: header click and the Show/Hide button both flip the
  // card between collapsed (compact row) and expanded (student table visible).
  function attachCardToggle(card) {
    const header = card.querySelector('.payment-card-header');
    const details = card.querySelector('.payment-card-details-area');
    const hideBtn = card.querySelector('.hide-btn');
    const cardKey = card.dataset.sessionKey || '';
    let expanded = cardKey ? expandedCards.has(cardKey) : false;
    function setState(expand) {
      expanded = expand;
      card.classList.toggle('collapsed', !expand);
      if (details) details.style.display = expand ? '' : 'none';
      if (hideBtn) hideBtn.textContent = expand ? 'Hide' : 'Show';
      if (cardKey) {
        if (expand) expandedCards.add(cardKey);
        else expandedCards.delete(cardKey);
      }
    }
    setState(expanded);
    if (header) {
      header.addEventListener('click', e => {
        if (e.target.closest('.delete-btn')) return;
        setState(!expanded);
      });
    }
    if (hideBtn) {
      hideBtn.addEventListener('click', e => {
        e.stopPropagation();
        setState(!expanded);
      });
    }
    return setState;
  }

  window.PaymentGroups = {
    attachMonthSections: attachMonthSections,
    attachCardToggle: attachCardToggle,
    parseDate: parseDateValue,
    getSessionMonthKey: getSessionMonthKey,
    getSessionMonthLabel: getSessionMonthLabel,
    getSessionMonthDate: getSessionMonthDate,
    formatDateShort: formatDateShort,
    getSortTime: getSortTime
  };
})();
