import path from 'path';
import { readJson, writeJson } from './json-store';
import { dbDir } from './paths';

/* ============================================================
   payments-sync — keep payment rows in step with the master data
   ------------------------------------------------------------
   A payment row is a SNAPSHOT: when a session is saved, the row
   copies the student's name, phone, discount, grade and school at
   that moment. The Payments / Partial / Unpaid / Paid pages read
   payments.json straight from disk, so without this helper every
   later correction to a student's record (new discount, fixed name
   or phone number) kept showing the values from creation day.

   applyStudentDataToPayments() overlays the CURRENT student record
   onto each payment by studentId.
   applyTeacherCutRatesToPayments() stamps each payment with the
   CURRENT cut rate of the teacher who ran the session (createdBy),
   so those pages can show a CUT RATE column that follows the
   teacher page instead of the student's discount.

   applySubscriptionPricesToPayments() copies a subscriber's CURRENT
   package price and class count onto their session rows, so a price that
   is filled in later still shows on that student's session cards.

   applyPaymentStatuses() keeps the payments on exactly one page: the
   Paid / Partial / Unpaid pages each read payments.json and filter by
   the stored status, so the status has to obey one rule for everyone
   (see derivePaymentStatus below). A row keeps the bucket the office
   assigned to it. Rows that were never assigned ('Pending') stay on the
   Payments intake page: typing a price tag or an amount must never move
   a row to Partial/Unpaid on its own.

   All three are pure (no I/O) so they can be tested directly;
   syncPaymentsWithStudents() applies them to the files and writes
   only when something actually changed.
   ============================================================ */

const PAYMENTS_PATH = path.join(dbDir(), 'teacher-portal/payments.json');
const STUDENTS_PATH = path.join(dbDir(), 'students.json');
const TEACHERS_PATH = path.join(dbDir(), 'teachers.json');
const SUBSCRIPTIONS_PATH = path.join(dbDir(), 'subscription.json');

function asText(value) {
  return value === undefined || value === null ? '' : String(value);
}

function same(a, b) {
  return asText(a) === asText(b);
}

function normalizeName(value) {
  return asText(value).trim().replace(/\s+/g, ' ').toLowerCase();
}

function teacherKey(teacher) {
  return normalizeName(`${asText(teacher && teacher.firstName)} ${asText(teacher && teacher.lastName)}`);
}

// Overlay students.json onto the payment rows. Returns how many rows changed.
export function applyStudentDataToPayments(payments, students) {
  const byId = new Map();
  (students || []).forEach(s => {
    if (s && s.id !== undefined && s.id !== null) byId.set(String(s.id), s);
  });

  let changed = 0;
  (payments || []).forEach(p => {
    if (!p || p.studentId === undefined || p.studentId === null) return;
    const stu = byId.get(String(p.studentId));
    if (!stu) return; // deleted student: keep the historical snapshot

    // Current values from the student record. A blank value on the student
    // record still wins for name/discount/grade (that IS the current truth),
    // but a blank phone never wipes a stored one.
    const current = {
      studentName: asText(stu.studentName) || asText(p.studentName),
      phone: asText(stu.phoneNumber) || asText(p.phone),
      discount: stu.discount === undefined || stu.discount === null || stu.discount === '' ? '' : stu.discount,
      grade: asText(stu.gradeLevel) || asText(p.grade),
      schoolName: asText(stu.schoolName) || asText(p.schoolName)
    };

    let rowChanged = false;
    Object.keys(current).forEach(key => {
      if (!same(p[key], current[key])) {
        p[key] = current[key];
        rowChanged = true;
      }
    });
    if (rowChanged) changed++;
  });
  return changed;
}

// Stamp each payment with the cut rate of the teacher named in createdBy.
// Returns how many rows changed.
export function applyTeacherCutRatesToPayments(payments, teachers) {
  const byName = new Map();
  (teachers || []).forEach(t => {
    const key = teacherKey(t);
    if (key) byName.set(key, t);
  });

  let changed = 0;
  (payments || []).forEach(p => {
    if (!p) return;
    const teacher = byName.get(normalizeName(p.createdBy));
    if (!teacher) return; // unknown teacher: leave whatever is stored
    const rawRate = teacher.cutRate;
    const rate = rawRate === undefined || rawRate === null || String(rawRate).trim() === '' || isNaN(Number(rawRate))
      ? ''
      : Number(rawRate);
    if (!same(p.cutRate, rate)) {
      p.cutRate = rate;
      changed++;
    }
  });
  return changed;
}

// Lookup index for "this student has a subscription" — matched by student id
// first, then by normalized full name (subscription.json stores both).
export function subscriptionIndex(subscriptions) {
  const ids = new Set();
  const names = new Set();
  (subscriptions || []).forEach(sub => {
    if (!sub) return;
    if (sub.studentId !== undefined && sub.studentId !== null && String(sub.studentId) !== '') {
      ids.add(String(sub.studentId));
    }
    const name = normalizeName(sub.studentFullName);
    if (name) names.add(name);
  });
  return { ids, names };
}

export function isSubscribedPayment(payment, index) {
  if (!payment || !index) return false;
  if (payment.studentId !== undefined && payment.studentId !== null && index.ids.has(String(payment.studentId))) {
    return true;
  }
  return index.names.has(normalizeName(payment.studentName));
}

// The single rule every payment page buckets by:
//   Paid / Partial / Unpaid — the bucket the office assigned by clicking a
//             status button (or by subscribing the student). It is never
//             re-derived from the numbers, so typing a price tag or an amount
//             cannot pull a row out of the Payments page behind the user's back.
//   Pending — never assigned yet; the row is still in the Payments intake list.
//   A row whose student holds a subscription counts as Paid (already settled
//   when the package was bought).
export function derivePaymentStatus(payment, index) {
  if (!payment) return 'Pending';
  const status = asText(payment.status).trim().toLowerCase();
  if (status === 'paid') return 'Paid';
  if (isSubscribedPayment(payment, index)) return 'Paid';
  // Nothing priced and nothing collected: this row was never assigned by
  // hand (an old sync may have written Partial/Unpaid from the numbers alone).
  // Send it back to the Payments intake page where it can be priced.
  if (!(Number(payment.priceTag) > 0) && !(Number(payment.amount) > 0)) return 'Pending';
  if (status === 'partial') return 'Partial';
  if (status === 'unpaid') return 'Unpaid';
  return 'Pending';
}

// —— Subscription price link ——
// A subscriber's session rows are saved with no price of their own (the
// package was paid up-front), so a row created before the price was typed in
// stayed priceless forever. This overlay copies the CURRENT package price and
// class count from subscription.json onto those rows — matched by student id,
// then by name + subject — so filling the price on the Subscription page
// immediately relinks it to every session card of that student. The value of a
// single session is still worked out by the payment pages from the hours
// actually taken (price ÷ classes × hours).
function moneyFromCell(value) {
  if (typeof value === 'number') return isFinite(value) ? value : null;
  const match = asText(value).match(/\d+(\.\d+)?/);
  return match ? Number(match[0]) : null;
}

// Package size: the stored packageAmount, otherwise the total of the usage
// counter ('3/8' -> 8). 'unlimited' packages have no size.
function packageSizeOf(sub) {
  const direct = moneyFromCell(sub && sub.packageAmount);
  if (direct && direct > 0) return direct;
  const fromUsage = moneyFromCell(asText(sub && sub.usage).split('/')[1]);
  return fromUsage && fromUsage > 0 ? fromUsage : null;
}

// Price + class count of one subscription, or null when it has no price yet.
function subscriptionPriceOf(sub) {
  if (!sub) return null;
  const raw = sub.priceTag !== undefined && sub.priceTag !== null && asText(sub.priceTag).trim() !== ''
    ? sub.priceTag
    : sub.amount;
  const price = moneyFromCell(raw);
  if (price === null || price <= 0) return null;
  return { price, packageAmount: packageSizeOf(sub) };
}

// Copy each subscriber's package price onto their payment rows. Returns how
// many rows changed.
export function applySubscriptionPricesToPayments(payments, subscriptions) {
  const byId = new Map();
  const byName = new Map();
  (subscriptions || []).forEach(sub => {
    if (!sub) return;
    if (sub.studentId !== undefined && sub.studentId !== null && String(sub.studentId) !== '') {
      byId.set(String(sub.studentId), sub);
    }
    const name = normalizeName(sub.studentFullName);
    if (!name) return;
    if (!byName.has(name)) byName.set(name, []);
    byName.get(name).push(sub);
  });

  // Same pick as the Paid page: subject-matching subscription first, then an
  // "all subjects" one, then whatever the student has.
  const priceFor = (payment) => {
    const candidates = [];
    if (payment.studentId !== undefined && payment.studentId !== null && byId.has(String(payment.studentId))) {
      candidates.push(byId.get(String(payment.studentId)));
    }
    const named = byName.get(normalizeName(payment.studentName));
    if (named) named.forEach(s => { if (candidates.indexOf(s) === -1) candidates.push(s); });
    if (!candidates.length) return null;
    const subject = normalizeName(payment.subject);
    if (subject) {
      const subjectMatch = candidates.find(s => normalizeName(s.subject) === subject);
      const priced = subscriptionPriceOf(subjectMatch);
      if (priced) return priced;
    }
    const allSubjects = candidates.filter(s => !normalizeName(s.subject));
    for (let i = 0; i < allSubjects.length; i++) {
      const priced = subscriptionPriceOf(allSubjects[i]);
      if (priced) return priced;
    }
    return subscriptionPriceOf(candidates[0]);
  };

  let changed = 0;
  (payments || []).forEach(p => {
    if (!p) return;
    const link = priceFor(p);
    const nextPrice = link ? link.price : '';
    const nextPackage = link && link.packageAmount ? link.packageAmount : '';
    let rowChanged = false;
    if (nextPrice === '') {
      // No price on the subscription (removed or not filled in yet): drop the
      // stale link so an old price never keeps showing on the card.
      if (p.subscriptionPrice !== undefined) { delete p.subscriptionPrice; rowChanged = true; }
    } else if (!same(p.subscriptionPrice, nextPrice)) {
      p.subscriptionPrice = nextPrice;
      rowChanged = true;
    }
    if (nextPackage === '') {
      if (p.subscriptionPackageAmount !== undefined) { delete p.subscriptionPackageAmount; rowChanged = true; }
    } else if (!same(p.subscriptionPackageAmount, nextPackage)) {
      p.subscriptionPackageAmount = nextPackage;
      rowChanged = true;
    }
    if (rowChanged) changed++;
  });
  return changed;
}

// Rewrite every row's status from the numbers it holds. Returns how many
// rows changed.
export function applyPaymentStatuses(payments, subscriptions) {
  const index = subscriptionIndex(subscriptions);
  let changed = 0;
  (payments || []).forEach(p => {
    if (!p) return;
    const derived = derivePaymentStatus(p, index);
    if (!same(p.status, derived)) {
      p.status = derived;
      changed++;
    }
  });
  return changed;
}

// Read the files, apply the overlays and write payments.json if anything moved.
export function syncPaymentsWithStudents() {
  try {
    const payments = readJson(PAYMENTS_PATH, []);
    const students = readJson(STUDENTS_PATH, []);
    const teachers = readJson(TEACHERS_PATH, []);
    const subscriptions = readJson(SUBSCRIPTIONS_PATH, []);
    if (!Array.isArray(payments) || payments.length === 0) return 0;
    const studentChanges = applyStudentDataToPayments(payments, Array.isArray(students) ? students : []);
    const rateChanges = applyTeacherCutRatesToPayments(payments, Array.isArray(teachers) ? teachers : []);
    const statusChanges = applyPaymentStatuses(payments, Array.isArray(subscriptions) ? subscriptions : []);
    // Filling in a subscription price relinks it to that student's sessions, so
    // their cards show the price and the teacher cut without a re-save.
    const priceChanges = applySubscriptionPricesToPayments(payments, Array.isArray(subscriptions) ? subscriptions : []);
    const changed = studentChanges + rateChanges + statusChanges + priceChanges;
    if (changed > 0) {
      writeJson(PAYMENTS_PATH, payments);
      console.log(`[payments-sync] refreshed ${studentChanges} student row(s), ${rateChanges} cut rate(s), ${statusChanges} payment status(es) and ${priceChanges} subscription price link(s).`);
    }
    return changed;
  } catch (err) {
    // Creating/updating a student must never fail because of this.
    console.error('[payments-sync] could not sync payments:', err && err.message);
    return 0;
  }
}
