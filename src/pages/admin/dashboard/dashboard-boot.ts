// Admin dashboard live counts — replaces the previously inline <script> block
// in index.html. Compiled by tsc to dashboard-boot.js and loaded as a module.
//
// Every card is calculated from the same live JSON files the Payments pages
// use, so the numbers always agree with the rest of the site:
//   Total Students  — every record in students.json
//   Total Teachers  — every record in teachers.json
//   Revenue         — every amount actually collected in payments.json
//                     (Paid + Partial; Unpaid rows carry no collected amount)
//   Unpaid Students — unique students with a priced Unpaid row (new session
//                     rows without a price tag yet are not counted here)

interface PaymentRecord {
  id?: string | number;
  status?: string;
  priceTag?: string | number;
  amount?: string | number;
  studentId?: string | number;
  studentName?: string;
}

function setCount(id: string, value: string): void {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

async function fetchJson(url: string): Promise<unknown> {
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function amountOf(value: unknown): number {
  const n = Number(value);
  return isNaN(n) ? 0 : n;
}

function formatAmount(value: number): string {
  const rounded = Math.round(value * 100) / 100;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2);
}

function normalisedStatus(payment: PaymentRecord): string {
  return String(payment.status || '').trim().toLowerCase();
}

// One student can have many payment rows. Count them once by student id, and
// fall back to the normalised name when an older row has no id.
function studentIdentity(payment: PaymentRecord): string {
  if (payment.studentId !== undefined && payment.studentId !== null && String(payment.studentId) !== '') {
    return `id:${String(payment.studentId)}`;
  }
  const name = String(payment.studentName || '').trim().replace(/\s+/g, ' ').toLowerCase();
  if (name) return `name:${name}`;
  return `row:${String(payment.id || '')}`;
}

async function updateDashboardCounts(): Promise<void> {
  const [students, teachers, payments] = await Promise.all([
    fetchJson('/database/students.json'),
    fetchJson('/database/teachers.json'),
    fetchJson('/database/teacher-portal/payments.json')
  ]);

  setCount('students-count', (Array.isArray(students) ? students.length : null)?.toString() ?? '--');
  setCount('teachers-count', (Array.isArray(teachers) ? teachers.length : null)?.toString() ?? '--');

  if (!Array.isArray(payments)) {
    setCount('revenue-amount', '--');
    setCount('unpaid-students-count', '--');
    return;
  }

  let revenue = 0;
  const unpaidStudents = new Set<string>();

  for (const payment of payments as PaymentRecord[]) {
    // Money that has actually come in. Partial rows contribute their paid
    // amount too, so revenue is never short of the Payments ledger.
    revenue += amountOf(payment.amount);

    // Match the Unpaid page: only rows that already have a price tag (or some
    // money) are real unpaid students. Brand-new unpriced rows sit on the
    // Payments intake page and must not inflate this card.
    const status = normalisedStatus(payment);
    if (status === 'unpaid' || status === 'pending') {
      const priceTag = amountOf(payment.priceTag);
      const paid = amountOf(payment.amount);
      if (priceTag > 0 || paid > 0) unpaidStudents.add(studentIdentity(payment));
    }
  }

  setCount('revenue-amount', formatAmount(revenue));
  setCount('unpaid-students-count', String(unpaidStudents.size));
}

void updateDashboardCounts();

// A teacher/admin saving data in another tab should be reflected when they
// return to the dashboard without needing a hard refresh.
window.addEventListener('focus', () => { void updateDashboardCounts(); });
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) void updateDashboardCounts();
});
