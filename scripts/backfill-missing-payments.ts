// One-time recovery: rebuild payment rows that exist as session forms but were
// never written to payments.json. Some older/imported sessions (including all
// of July and August 2026) have attendance and session-form records but no
// payment rows, so the Payments/Paid/Partial/Unpaid pages cannot show them.
//
// The script is idempotent: it compares each present student on every session
// against the existing payment rows (date formats normalised) and only appends
// the missing ones. Existing payment values are never changed.
//
// Run: node scripts/backfill-missing-payments.ts
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dbDir = path.join(ROOT, 'database');
const PORTAL_DIR = path.join(dbDir, 'teacher-portal');
const PAYMENTS_PATH = path.join(PORTAL_DIR, 'payments.json');
const ATTENDANCE_PATH = path.join(PORTAL_DIR, 'teachers-attendance.json');
const SESSION_FORM_PATH = path.join(PORTAL_DIR, 'session-form.json');
const STUDENTS_PATH = path.join(dbDir, 'students.json');
const SUBSCRIPTIONS_PATH = path.join(dbDir, 'subscription.json');

const readJson = (file: string, fallback: any[] = []) =>
  fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : fallback;

const MONTHS: { [key: string]: number } = {
  january: 0, jan: 0, janvier: 0,
  february: 1, feb: 1, fevrier: 1, février: 1,
  march: 2, mar: 2, mars: 2,
  april: 3, apr: 3, avril: 3,
  may: 4, mai: 4,
  june: 5, jun: 5, juin: 5,
  july: 6, jul: 6, juillet: 6,
  august: 7, aug: 7, aout: 7, août: 7,
  september: 8, sep: 8, septembre: 8,
  october: 9, oct: 9, octobre: 9,
  november: 10, nov: 10, novembre: 10,
  december: 11, dec: 11, decembre: 11, décembre: 11
};

function normaliseMonthName(value: string) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function parseDate(value: any): Date | null {
  if (!value) return null;
  if (value instanceof Date) return isNaN(value.getTime()) ? null : value;
  const text = String(value).trim();
  if (!text) return null;

  const iso = text.match(/^(\d{4})-(\d{1,2})-(\d{1,2})(?:[T\s](.*))?$/);
  if (iso) {
    const year = Number(iso[1]);
    const month = Number(iso[2]) - 1;
    const day = Number(iso[3]);
    if (iso[4]) {
      const withTime = new Date(text);
      return isNaN(withTime.getTime()) ? null : withTime;
    }
    const local = new Date(year, month, day);
    return isNaN(local.getTime()) ? null : local;
  }

  const dayMonthYear = text.match(/^(\d{1,2})[\s/.-]+([A-Za-zÀ-ÿ]+)[\s/.,-]+(\d{4})$/);
  if (dayMonthYear) {
    const month = MONTHS[normaliseMonthName(dayMonthYear[2])];
    if (month !== undefined) {
      const local = new Date(Number(dayMonthYear[3]), month, Number(dayMonthYear[1]));
      return isNaN(local.getTime()) ? null : local;
    }
  }

  const numeric = text.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/);
  if (numeric) {
    // Stored dates are day-first.
    const local = new Date(Number(numeric[3]), Number(numeric[2]) - 1, Number(numeric[1]));
    return isNaN(local.getTime()) ? null : local;
  }

  const fallback = new Date(text);
  return isNaN(fallback.getTime()) ? null : fallback;
}

function dateKey(value: any) {
  const parsed = parseDate(value);
  if (!parsed) return String(value || '').trim().toLowerCase();
  return `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, '0')}-${String(parsed.getDate()).padStart(2, '0')}`;
}

function normaliseName(value: any) {
  return String(value === undefined || value === null ? '' : value).trim().replace(/\s+/g, ' ').toLowerCase();
}

function sessionKey(session: any) {
  return [
    normaliseName(session.createdBy !== undefined ? session.createdBy : session.teacherName),
    dateKey(session.date),
    normaliseName(session.subject),
    normaliseName(session.classroom),
    String(session.timeWindow || '').trim()
  ].join('|');
}

function studentKey(session: any, student: any) {
  const id = student.studentId !== undefined && student.studentId !== null && student.studentId !== ''
    ? student.studentId
    : (student.id !== undefined && student.id !== null ? student.id : null);
  const who = id !== null && id !== undefined && String(id) !== ''
    ? `id:${String(id)}`
    : `name:${normaliseName(student.name !== undefined ? student.name : student.studentName)}`;
  return `${sessionKey(session)}::${who}`;
}

function toNumeric(value: any) {
  const n = Number(value);
  return !isNaN(n) && n > 0 ? n : 0;
}

function extractPrice(value: any) {
  if (typeof value === 'number' && !isNaN(value) && value > 0) return value;
  if (typeof value !== 'string') return 0;
  const direct = Number(value);
  if (!isNaN(direct) && direct > 0) return direct;
  const matches = value.replace(/,/g, '').match(/\d+(\.\d+)?/g);
  if (!matches || !matches.length) return 0;
  const last = Number(matches[matches.length - 1]);
  return !isNaN(last) && last > 0 ? last : 0;
}

function priceStatement(value: any) {
  if (typeof value !== 'string') return '';
  const text = value.trim();
  if (!text) return '';
  if (/^\d+(\.\d+)?$/.test(text)) return '';
  if (text.toLowerCase() === 'unlimited') return '';
  return text;
}

function findSubscription(subscriptions: any[], studentName: string, subject: string) {
  const name = normaliseName(studentName);
  const subjectName = normaliseName(subject);
  const matches = subscriptions.filter(sub => normaliseName(sub.studentFullName) === name);
  if (!matches.length) return null;
  if (subjectName) {
    const exact = matches.find(sub => normaliseName(sub.subject) === subjectName);
    if (exact) return exact;
  }
  const legacy = matches.find(sub => !normaliseName(sub.subject));
  if (legacy) return legacy;
  return matches.length === 1 ? matches[0] : null;
}

function generateId(existing: Set<string>) {
  let id = '';
  do {
    id = 'pay_' + crypto.randomBytes(5).toString('hex');
  } while (existing.has(id));
  existing.add(id);
  return id;
}

const payments = readJson(PAYMENTS_PATH);
const attendance = readJson(ATTENDANCE_PATH);
const sessionForms = readJson(SESSION_FORM_PATH);
const students = readJson(STUDENTS_PATH);
const subscriptions = readJson(SUBSCRIPTIONS_PATH);

const existingIds = new Set<string>(payments.map((p: any) => String(p.id)));
const existingRows = new Set(payments.map(p => studentKey(p, {
  studentId: p.studentId,
  name: p.studentName
})));

const studentById = new Map<string, any>();
const studentByName = new Map<string, any>();
students.forEach(stu => {
  if (!stu) return;
  if (stu.id !== undefined && stu.id !== null) studentById.set(String(stu.id), stu);
  const name = normaliseName(stu.studentName);
  if (name) studentByName.set(name, stu);
});

function findStudent(student: any) {
  if (student.studentId !== undefined && student.studentId !== null) {
    const byId = studentById.get(String(student.studentId));
    if (byId) return byId;
  }
  return studentByName.get(normaliseName(student.name)) || null;
}

const recovered: any[] = [];
const sources = [attendance, sessionForms];
const seen = new Set<string>();

for (const source of sources) {
  for (const session of source) {
    for (const student of (session.students || [])) {
      if (!student || student.absent) continue;
      const key = studentKey(session, student);
      if (existingRows.has(key) || seen.has(key)) continue;
      seen.add(key);

      const studentRecord = findStudent(student);
      const studentId = student.studentId !== undefined && student.studentId !== null && student.studentId !== ''
        ? student.studentId
        : (studentRecord ? studentRecord.id : null);
      const subscription = findSubscription(subscriptions, student.name, session.subject);
      const priceTag = subscription
        ? (extractPrice(subscription.priceTag) || extractPrice(subscription.amount))
        : toNumeric(student.priceTag);
      const amount = subscription
        ? (extractPrice(subscription.amount) || extractPrice(subscription.priceTag))
        : toNumeric(student.amount);
      const subscriptionStatement = subscription
        ? (priceStatement(subscription.priceTag) || priceStatement(subscription.amount))
        : '';

      let status = 'Unpaid';
      if (subscription) status = 'Paid';
      else if (priceTag > 0 && amount > 0 && amount >= priceTag) status = 'Paid';
      else if (amount > 0) status = 'Partial';

      const discount = student.discount !== undefined && student.discount !== ''
        ? student.discount
        : (studentRecord && studentRecord.discount !== undefined ? studentRecord.discount : '');

      const submittedAt = session.submittedAt && !isNaN(new Date(session.submittedAt).getTime())
        ? session.submittedAt
        : new Date(`${dateKey(session.date)}T12:00:00`).toISOString();

      recovered.push({
        id: generateId(existingIds),
        sessionId: session.id,
        studentId,
        studentName: student.name,
        phone: student.phone || (studentRecord ? studentRecord.phoneNumber : '') || '',
        hours: student.hours || 0,
        amount,
        discount,
        priceTag,
        method: 'Cash',
        date: session.date,
        submittedAt,
        status,
        note: student.note || `Session payment for ${session.date}`,
        subscriptionStatement,
        createdBy: session.teacherName || 'system',
        subject: session.subject,
        classroom: session.classroom,
        timeWindow: session.timeWindow,
        grade: session.grade,
        schoolName: session.schoolName
      });
    }
  }
}

if (!recovered.length) {
  console.log('No missing payment rows found — payments.json is already complete.');
  process.exit(0);
}

const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupPath = path.join(PORTAL_DIR, `payments.backup-${stamp}.json`);
fs.writeFileSync(backupPath, JSON.stringify(payments, null, 2), 'utf8');

const merged = payments.concat(recovered);
// Append in session order so the pages' newest-first sort still lines up.
merged.sort((a, b) => {
  const at = parseDate(a.submittedAt || a.date);
  const bt = parseDate(b.submittedAt || b.date);
  return (at ? at.getTime() : 0) - (bt ? bt.getTime() : 0);
});
fs.writeFileSync(PAYMENTS_PATH, JSON.stringify(merged, null, 2), 'utf8');

console.log(`Recovered ${recovered.length} missing payment row(s).`);
console.log(`payments.json: ${payments.length} -> ${merged.length}`);
console.log(`Backup saved to ${path.relative(process.cwd(), backupPath)}`);
