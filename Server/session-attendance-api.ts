import express from 'express';
import fs from 'fs';
import path from 'path';
import { readJson as readJsonSafe, writeJson as writeJsonSafe } from './json-store';
import { dbDir } from './paths';
import { syncPaymentsWithStudents, derivePaymentStatus, subscriptionIndex } from './payments-sync';

const router = express.Router();

// PUT /api/payments/:id -- update a payment field live
router.put('/api/payments/:id', (req, res) => {
  const paymentId = req.params.id;
  let payments = readJson(PAYMENTS_PATH);
  const idx = payments.findIndex(p => String(p.id) === String(paymentId));
  if (idx === -1) {
    return res.status(404).json({ error: 'Payment not found' });
  }
  // Only update provided fields
  Object.keys(req.body).forEach(key => {
    if (key !== 'id') payments[idx][key] = req.body[key];
  });
  writeJson(PAYMENTS_PATH, payments);
  res.json(payments[idx]);
});

// POST /api/update-payment
// NOTE: this router is mounted at '/api' in server.js, so route paths here must
// NOT repeat the '/api' prefix (e.g. '/update-payment' serves at '/api/update-payment').
router.post('/update-payment', (req, res) => {
  const { paymentId, priceTag, amount, status } = req.body;
  console.log('[UPDATE PAYMENT] Called with:', req.body);
  if (!paymentId) {
    console.log('[UPDATE PAYMENT] Missing paymentId');
    return res.status(400).json({ error: 'Missing paymentId' });
  }
  let payments = readJson(PAYMENTS_PATH);
  const idx = payments.findIndex(p => p.id === paymentId);
  if (idx === -1) {
    console.log('[UPDATE PAYMENT] Payment not found:', paymentId);
    return res.status(404).json({ error: 'Payment not found' });
  }
  if (typeof priceTag !== 'undefined') payments[idx].priceTag = priceTag;
  if (typeof amount !== 'undefined') payments[idx].amount = amount;
  // Keep the row on exactly one page: amount === price tag (or a subscription)
  // means Paid, a smaller amount means Partial, nothing collected means Unpaid.
  if (typeof status !== 'undefined') payments[idx].status = status;
  else {
    // Derive status from priceTag and amount when status is not explicitly set.
    // This ensures that when priceTag > 0 && amount > 0 && amount >= priceTag,
    // the status becomes 'Paid' (fixes the issue where setting priceTag === amount
    // and clicking Paid results in Unpaid).
    payments[idx].status = derivePaymentStatus(
      payments[idx],
      subscriptionIndex(readJsonSafe(path.join(dbDir(), 'subscription.json'), []))
    );
  }
  // Ensure the derived status is consistent: if amount >= priceTag > 0, force Paid.
  const derivedStatus = derivePaymentStatus(
    payments[idx],
    subscriptionIndex(readJsonSafe(path.join(dbDir(), 'subscription.json'), []))
  );
  if (!same(payments[idx].status, derivedStatus)) {
    payments[idx].status = derivedStatus;
  }
  writeJson(PAYMENTS_PATH, payments);
  console.log('[UPDATE PAYMENT] Updated payment:', payments[idx]);
  res.json({ success: true });
});

const SESSION_FORM_PATH = path.join(dbDir(), 'teacher-portal/session-form.json');
const PAYMENTS_PATH = path.join(dbDir(), 'teacher-portal/payments.json');
const ATTENDANCE_PATH = path.join(dbDir(), 'teacher-portal/teachers-attendance.json');

// DELETE payment by payment id (must be after router is defined)
router.post('/api/delete-payment', (req, res) => {
  const { paymentId } = req.body;
  console.log('[DELETE PAYMENT] paymentId:', paymentId);
  if (!paymentId) return res.status(400).json({ error: 'Missing paymentId' });
  let payments = readJson(PAYMENTS_PATH);
  console.log('[DELETE PAYMENT] payments before:', payments.map(p => p.id));
  const initialLength = payments.length;
  payments = payments.filter(p => p.id !== paymentId);
  if (payments.length === initialLength) {
    console.log('[DELETE PAYMENT] Payment not found');
    return res.status(404).json({ error: 'Payment not found' });
  }
  writeJson(PAYMENTS_PATH, payments);
  console.log('[DELETE PAYMENT] payments after:', payments.map(p => p.id));
  res.json({ success: true });
});

// POST /api/delete-session
// (router is mounted at '/api' — see note above)
router.post('/delete-session', (req, res) => {
  const { sessionId } = req.body;
  console.log('[DELETE SESSION] sessionId:', sessionId);
  if (!sessionId) return res.status(400).json({ error: 'Missing sessionId' });
  // Remove session from session-form.json
  let sessions = readJson(SESSION_FORM_PATH);
  const sessionToDelete = sessions.find(sess => sess.id === sessionId);
  sessions = sessions.filter(sess => sess.id !== sessionId);
  writeJson(SESSION_FORM_PATH, sessions);
  // Remove related payments for THIS session only.
  // Payments are stamped with sessionId on creation, so we can delete precisely.
  // Legacy payments without sessionId fall back to a per-student key match so
  // we never remove another session's cards.
  if (sessionToDelete) {
    const sessionStudentNames = new Set((sessionToDelete.students || []).map(st => st.name));
    let payments = readJson(PAYMENTS_PATH);
    payments = payments.filter(p => {
      // 1) New-style: payment is explicitly linked to this session.
      if (p.sessionId === sessionToDelete.id) return false;
      // 2) Legacy payment with no sessionId: only delete if EVERY key field
      //    matches AND the student was actually in this session.
      if (!p.sessionId) {
        const keyMatches =
          p.createdBy === sessionToDelete.teacherName &&
          p.date === sessionToDelete.date &&
          p.subject === sessionToDelete.subject &&
          p.classroom === sessionToDelete.classroom &&
          p.timeWindow === sessionToDelete.timeWindow;
        const studentInSession = sessionStudentNames.has(p.studentName);
        if (keyMatches && studentInSession) return false;
      }
      return true;
    });
    writeJson(PAYMENTS_PATH, payments);
  }
  // Remove from teachers-attendance.json by id
  let attendance = readJson(ATTENDANCE_PATH);
  console.log('[DELETE SESSION] attendance before:', attendance.map(a => a.id));
  const initialLength = attendance.length;
  attendance = attendance.filter(a => a.id !== sessionId);
  if (attendance.length !== initialLength) {
    writeJson(ATTENDANCE_PATH, attendance);
    console.log('[DELETE SESSION] attendance after:', attendance.map(a => a.id));
  } else {
    console.log('[DELETE SESSION] No attendance record deleted.');
  }
  res.json({ success: true });
});

// Helper to generate unique IDs
function generateId(prefix) {
  return prefix + '_' + Math.random().toString(36).substr(2, 8);
}

// Helper to read JSON file — self-healing: a corrupt file is quarantined and
// [] is returned instead of an exception, and writes are atomic.
function readJson(filePath) {
  return readJsonSafe(filePath, []);
}

// Helper to write JSON file
function writeJson(filePath, data) {
  writeJsonSafe(filePath, data);
}

// Compare two values as text (used to spot a status that needs rewriting).
function same(a, b) {
  return (a === undefined || a === null ? '' : String(a)) === (b === undefined || b === null ? '' : String(b));
}

// Convert a value to a positive number (handles numeric strings, ignores
// 'unlimited' strings and empty values used by subscriptions).
function toNumeric(v) {
  const n = Number(v);
  return (!isNaN(n) && n > 0) ? n : 0;
}

// Extract a positive number from a value that may combine text with a price
// (e.g. 'English class "700"' -> 700, 'still owes us 700' -> 700, '700' -> 700).
// Uses the LAST number found so statements like 'was 800 now 700' resolve to
// the current price. Returns 0 when no number is present (e.g. 'unlimited').
function extractPrice(v) {
  if (typeof v === 'number' && !isNaN(v) && v > 0) return v;
  if (typeof v !== 'string') return 0;
  const n = Number(v);
  if (!isNaN(n) && n > 0) return n;
  const matches = v.replace(/,/g, '').match(/\d+(\.\d+)?/g);
  if (!matches || !matches.length) return 0;
  const last = Number(matches[matches.length - 1]);
  return (!isNaN(last) && last > 0) ? last : 0;
}

// When a subscription price cell contains extra text (e.g. 'English class 700'
// or 'still owes us 700'), return that text so payments can mention it.
// Pure numbers, empty values, and the system 'unlimited' sentinel return ''
// (no statement).
function priceStatement(v) {
  if (typeof v !== 'string') return '';
  const t = v.trim();
  if (!t) return '';
  if (/^\d+(\.\d+)?$/.test(t)) return '';
  if (t.toLowerCase() === 'unlimited') return '';
  return t;
}

// POST /api/save-session-attendance
router.post('/save-session-attendance', (req, res) => {

  const {
    teacherName,
    date,
    schoolName,
    grade,
    timeWindow,
    subject,
    classroom,
    type,
    students // array of { name, hours, grade, participation, absent, note, phone, discount, priceTag, amount }
  } = req.body;

  // Load all students for phone lookup
  const allStudents = readJson(path.join(dbDir(), 'students.json'));
  // Load subscriptions for usage tracking
  const subscriptionPath = path.join(dbDir(), 'subscription.json');
  let subscriptions = [];
  if (fs.existsSync(subscriptionPath)) {
      subscriptions = readJsonSafe(subscriptionPath, []);
  }

  // Students can hold SEVERAL subscriptions — one per subject. Functions
  // below pick the subscription that matches the session's subject
  // (case-insensitive). A subscription with no subject (legacy/one-off rows
  // created by the payments page) act as catch-all fallbacks, so old records
  // keep counting like before.
  function findSubscriptionIdx(list, studentName, sessionSubject) {
    const nameNorm = String(studentName || '').trim().toLowerCase();
    const subjNorm = String(sessionSubject || '').trim().toLowerCase();
    const matches = [];
    list.forEach((s, i) => {
      if (String(s.studentFullName || '').trim().toLowerCase() === nameNorm) matches.push(i);
    });
    if (!matches.length) return -1;
    if (subjNorm) {
      const exact = matches.find(i => String(list[i].subject || '').trim().toLowerCase() === subjNorm);
      if (exact !== undefined) return exact;
    }
    const legacy = matches.find(i => !String(list[i].subject || '').trim());
    if (legacy !== undefined) return legacy;
    // A student holding a SINGLE plan counts that plan for every subject: the
    // subject on a subscription only routes between several plans. Without
    // this an English-only plan never counted an Arabic/Biology session and
    // the usage silently stayed at 0 after the form was saved.
    if (matches.length === 1) return matches[0];
    return -1;
  }

  // Save to session-form.json (deduplicate by teacher/date/subject/classroom/type/grade)
  const sessions = readJson(SESSION_FORM_PATH);
  // Find existing session
  const matchIdx = sessions.findIndex(sess =>
    sess.teacherName === teacherName &&
    sess.date === date &&
    sess.subject === subject &&
    sess.classroom === classroom &&
    sess.type === type &&
    sess.grade === grade &&
    sess.schoolName === schoolName &&
    sess.timeWindow === timeWindow
  );
  // Prepare new students array
  const newStudents = students.map(s => {
    const found = allStudents.find(stu => stu.studentName === s.name);
    // Keep session-form.json consistent with payments: subscribed students
    // get their subscription price/amount so both stores show the same figure.
    // The row that matches THIS session's subject is used, so a student with
    // separate English and Math subscriptions gets the right price here.
    const matchedSubIdx = findSubscriptionIdx(subscriptions, s.name, subject);
    const sub = matchedSubIdx !== -1 ? subscriptions[matchedSubIdx] : null;
    const priceTag = sub ? (extractPrice(sub.priceTag) || extractPrice(sub.amount) || toNumeric(s.priceTag)) : (toNumeric(s.priceTag) || 0);
    const amount = sub ? (extractPrice(sub.amount) || extractPrice(sub.priceTag) || toNumeric(s.amount)) : (toNumeric(s.amount) || 0);
    return {
      name: s.name,
      studentId: found ? found.id : null,
      phone: s.phone || (found ? found.phoneNumber : ''),
      hours: s.hours,
      grade: s.grade,
      participation: s.participation,
      absent: !!s.absent,
      note: s.note || '',
      discount: s.discount || '',
      priceTag,
      amount
    };
  });
  let sessionId;
  let sessionObj;
  const nowIso = new Date().toISOString();
  if (matchIdx !== -1) {
    // Update existing students or append new ones
    const existing = sessions[matchIdx];
    const existingNames = new Set(existing.students.map(s => s.name));
    newStudents.forEach(ns => {
      const idx = existing.students.findIndex(s => s.name === ns.name);
      if (idx !== -1) {
        // Update all fields for this student
        existing.students[idx] = { ...existing.students[idx], ...ns };
      } else {
        existing.students.push(ns);
      }
    });
    existing.submittedAt = nowIso;
    sessionId = existing.id;
    sessionObj = existing;
  } else {
    // New session
    sessionId = generateId('session');
    sessionObj = {
      id: sessionId,
      teacherName,
      date,
      schoolName,
      grade,
      timeWindow,
      subject,
      classroom,
      type,
      students: newStudents,
      submittedAt: nowIso
    };
    sessions.push(sessionObj);
  }
  writeJson(SESSION_FORM_PATH, sessions);

  // --- Sync to teachers-attendance.json ---
  const ATTENDANCE_PATH = path.join(dbDir(), 'teacher-portal/teachers-attendance.json');
  let attendance = readJson(ATTENDANCE_PATH);
  const attIdx = attendance.findIndex(a => a.id === sessionId);
  if (attIdx !== -1) {
    attendance[attIdx] = { ...sessionObj };
  } else {
    attendance.push({ ...sessionObj });
  }
  writeJson(ATTENDANCE_PATH, attendance);

  // Save to payments.json (append payment for each student only if not already present for this session/date)
  const payments = readJson(PAYMENTS_PATH);
  let subscriptionsChanged = false;
  // Build a Set of unique present student names
  const uniquePresentStudents = new Set(students.filter(s => !s.absent).map(s => s.name));

  // Process payments for all students as before
  students.forEach(s => {
    if (!s.absent) {
      const found = allStudents.find(stu => stu.studentName === s.name);
      const studentId = found ? found.id : generateId('stu');
      // Prefer session discount, else student record, else blank
      const discount = (typeof s.discount !== 'undefined' && s.discount !== '')
        ? s.discount
        : (found && typeof found.discount !== 'undefined' && found.discount !== '')
          ? found.discount
          : '';
      // Check if student has an active subscription
      const subscription = subscriptions.find(sub => sub.studentFullName === s.name);
      const hasSubscription = !!subscription;
      // Subscribed students have already paid through their subscription, so
      // carry the subscription's price/amount onto the payment automatically
      // (admin/receptionist never need to re-enter amount & price tag).
      const subPriceTag = hasSubscription ? (extractPrice(subscription.priceTag) || extractPrice(subscription.amount)) : (toNumeric(s.priceTag) || 0);
      const subAmount = hasSubscription ? (extractPrice(subscription.amount) || extractPrice(subscription.priceTag)) : (toNumeric(s.amount) || 0);
      // Statement text typed in the subscription price cell (e.g. 'English
      // class 700' or 'still owes us 700') — carried onto the payment so the
      // payments page can mention the subscription update.
      const subStatement = hasSubscription ? (priceStatement(subscription.priceTag) || priceStatement(subscription.amount)) : '';
      // Find existing payment for this student/session
      const paymentIdx = payments.findIndex(p =>
        p.studentId === studentId &&
        p.date === date &&
        p.createdBy === teacherName &&
        p.subject === subject &&
        p.classroom === classroom &&
        p.timeWindow === timeWindow
      );
      if (paymentIdx === -1) {
        payments.push({
          id: generateId('pay'),
          sessionId,
          studentId,
          studentName: s.name,
          phone: s.phone || (found ? found.phoneNumber : ''),
          hours: s.hours || 0,
          amount: subAmount,
          discount,
          priceTag: subPriceTag,
          method: s.method || 'Cash',
          date: date,
          submittedAt: new Date().toISOString(),
          status: hasSubscription ? 'Paid' : (s.status || 'Pending'),
          note: s.note || `Session payment for ${date}`,
          subscriptionStatement: subStatement,
          createdBy: teacherName || 'system',
          subject,
          classroom,
          timeWindow,
          grade,
          schoolName
        });
      } else {
        // Make sure the existing payment is linked to this session too, so
        // deleting/undoing this session can never touch another session's card.
        if (!payments[paymentIdx].sessionId) payments[paymentIdx].sessionId = sessionId;
        // Update hours and other fields if needed
        payments[paymentIdx].hours = s.hours || 0;
        payments[paymentIdx].discount = discount;
        // The session form has no price fields: it always sends 0/0 for a
        // non-subscribed student. Never let a re-save wipe a price tag or an
        // amount that the office already entered on the Payments page.
        if (hasSubscription) {
          payments[paymentIdx].priceTag = subPriceTag;
          payments[paymentIdx].amount = subAmount;
        } else {
          if (!(Number(payments[paymentIdx].priceTag) > 0)) payments[paymentIdx].priceTag = subPriceTag;
          if (!(Number(payments[paymentIdx].amount) > 0)) payments[paymentIdx].amount = subAmount;
        }
        payments[paymentIdx].note = s.note || payments[paymentIdx].note;
        // Set unconditionally so a reverted cell (back to a plain number)
        // clears the old statement instead of leaving stale text behind.
        payments[paymentIdx].subscriptionStatement = subStatement;
        payments[paymentIdx].grade = grade;
        payments[paymentIdx].schoolName = schoolName;
        if (hasSubscription) {
          payments[paymentIdx].status = 'Paid';
        }
      }
    }
  });

  // Persist payments immediately after building them — BEFORE any usage-tracking
  // work — so an error in the usage block can never leave a saved session
  // without its payment records.
  writeJson(PAYMENTS_PATH, payments);
  // Stamp the freshly saved rows with each student's current record and the
  // teacher's current cut rate, so the payment pages match master data.
  syncPaymentsWithStudents();
  console.log('[SAVE ATTENDANCE] Payments after save:', payments.map(p => ({id: p.id, studentId: p.studentId, studentName: p.studentName, date: p.date, status: p.status})));

  // Usage tracking is best-effort: a problem here must never break the save.
  try {
    // Only increment usage for present students who have a subscription
    const usageLogPath = path.join(dbDir(), 'subscription-usage-log.json');
    let usageLog = [];
    if (fs.existsSync(usageLogPath)) {
      try {
        usageLog = JSON.parse(fs.readFileSync(usageLogPath, 'utf8'));
      } catch (e) {
        usageLog = [];
      }
    }
    let usageLogChanged = false;
    // Only present students who have a subscription FOR THIS SESSION'S SUBJECT
    // get their usage incremented — each subject subscription has its own
    // separate counter, so an English session never consumes Math classes.
    // `subject` is the session's subject from the request body.
    // How much one student consumes from their plan. A classes plan costs 1 per
    // session; an hours plan costs the length of the session, so a 2-hour time
    // window takes 2 hours off the package (10 hours -> 8 hours used).
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
      if (mins < 0) mins += 24 * 60; // overnight session
      return mins > 0 ? mins / 60 : 0;
    }
    function isHoursPlan(sub) {
      return /^(hours?|per\s*hours?)$/i.test(String((sub && sub.type) || '').trim());
    }
    function consumedHours(student, windowStr) {
      const windowHours = hoursFromTimeWindow(windowStr);
      const typed = Number(student && student.hours);
      const typedValid = Number.isFinite(typed) && typed > 0;
      // The form's Hours chip starts at 1, so only a real change from that
      // default overrides the session length; otherwise the time window rules.
      if (typedValid && Math.abs(typed - 1) > 0.0001) return typed;
      if (windowHours > 0) return windowHours;
      return typedValid ? typed : 1;
    }
    function formatUsageNumber(value) {
      return String(Math.round(value * 100) / 100);
    }
    const presentSubscriptionChanges = [];
    students.forEach(s => {
      if (s.absent) return;
      const subIdx = findSubscriptionIdx(subscriptions, s.name, subject);
      if (subIdx !== -1) presentSubscriptionChanges.push({ name: s.name, subIdx, consumed: consumedHours(s, timeWindow) });
    });
    presentSubscriptionChanges.forEach(({ name: studentName, subIdx, consumed }) => {
      if (typeof subscriptions[subIdx].usage === 'string') {
        // Compose a unique key for this session+student+subject so the same
        // student counting against two different subscriptions never collides.
        // Re-saving a session saved BEFORE subjects were added to keys must
        // not double count, so the legacy key is honored as well.
        const usageKey = `${sessionId}__${studentName}__${subscriptions[subIdx].subject || ''}`;
        const legacyKey = `${sessionId}__${studentName}`;
        if (!usageLog.includes(usageKey) && !usageLog.includes(legacyKey)) {
          const usageStr = subscriptions[subIdx].usage;
          const parts = usageStr.split('/');
          const totalStr = parts.length > 1 ? parts[1] : '';
          // 'unlimited' plans count every session (1/unlimited, 2/unlimited, ...);
          // fixed plans (X/Y) stop incrementing once the cap is reached.
          const isUnlimited = String(totalStr).toLowerCase() === 'unlimited' ||
            String(usageStr).toLowerCase() === 'unlimited';
          let used = parseFloat(parts[0]);
          if (isNaN(used) && isUnlimited) used = 0; // legacy bare 'unlimited' starts counting
          const total = isUnlimited ? Infinity : parseFloat(totalStr);
          // Classes plans take 1 off per session; hours plans take the length
          // of this session (a 2-hour window uses 2 of the 10 package hours).
          const step = isHoursPlan(subscriptions[subIdx]) ? (Number(consumed) || 1) : 1;
          if (!isNaN(used) && (total === Infinity || (!isNaN(total) && used < total))) {
            const next = total === Infinity ? used + step : Math.min(used + step, total);
            subscriptions[subIdx].usage = isUnlimited
              ? `${formatUsageNumber(next)}/unlimited`
              : `${formatUsageNumber(next)}/${formatUsageNumber(total)}`;
            subscriptionsChanged = true;
          }
          // Mark this session as counted for this student even when the plan is at
          // its cap, so extending the limit later doesn't retroactively count it.
          usageLog.push(usageKey);
          usageLogChanged = true;
        }
      }
    });
    if (usageLogChanged) {
      writeJsonSafe(usageLogPath, usageLog);
    }
  } catch (usageErr) {
    console.error('[SAVE ATTENDANCE] Usage increment failed (session and payments already saved):', usageErr);
  }
  if (subscriptionsChanged) {
    writeJsonSafe(subscriptionPath, subscriptions);
  }

  // wasNew tells the client whether this save created a brand-new session
  // (so Undo knows it can safely delete it without destroying pre-existing data).
  res.json({ success: true, sessionId, wasNew: matchIdx === -1 });
});

export default router;
