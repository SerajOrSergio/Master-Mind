/* ============================================================
   models.ts — typed data models shared across the whole app
   ------------------------------------------------------------
   These interfaces describe the JSON shape of every collection
   in /database, plus the API envelope helpers used by the
   client pages and the server endpoints. Keeping them here
   gives the whole TypeScript project real end-to-end typing
   (student, teacher, class, session, payment, subscription…)
   without changing any runtime behavior.
   ============================================================ */

// --- Core people ---
export interface Student {
  id: number;
  studentName: string;
  grade: string;
  status?: string;
  phone?: string;
  notes?: string;
  [key: string]: unknown;
}

export interface Teacher {
  id: number;
  teacherName: string;
  phone?: string;
  subject?: string | string[];
  grades?: string | string[];
  status?: string;
  [key: string]: unknown;
}

// --- Classes / sessions ---
export interface Classroom {
  id: number;
  className?: string;
  subject?: string;
  grade?: string;
  teacherId?: number;
  day?: string;
  time?: string;
  timeFrom?: string;
  timeTo?: string;
  [key: string]: unknown;
}

export interface SessionRecord {
  id: number;
  studentName?: string;
  teacherName?: string;
  className?: string;
  date?: string;
  topic?: string;
  attendance?: string;
  price?: number;
  [key: string]: unknown;
}

// --- Money ---
export interface Payment {
  id: number;
  studentName?: string;
  teacherName?: string;
  amount?: number;
  date?: string;
  type?: string;
  status?: string;
  [key: string]: unknown;
}

export interface PricingRule {
  subject?: string;
  grade?: string;
  price?: number;
  [key: string]: unknown;
}

export interface Subscription {
  id: number;
  studentName?: string;
  packageAmount?: number;
  type?: string;
  date?: string;
  [key: string]: unknown;
}

// --- Logs & settings ---
export interface AbsenceLog {
  id: number;
  name?: string;
  date?: string;
  reason?: string;
  status?: string;
  [key: string]: unknown;
}

export interface StudyClick {
  id: number;
  name?: string;
  location?: string;
  count?: number;
  subject?: string;
  topic?: string;
  [key: string]: unknown;
}

export interface TeacherAvailability {
  id: number;
  teacherName?: string;
  day?: string;
  from?: string;
  to?: string;
  status?: string;
  [key: string]: unknown;
}

export interface TopicEntry {
  topicName?: string;
  subject?: string;
  grade?: string;
  done?: number;
  total?: number;
  [key: string]: unknown;
}

export interface AppUser {
  username: string;
  role: 'admin' | 'receptionist' | 'teacher' | 'coordinator';
}

export type ApiResult<T> = { success: true; data: T } | { success: false; error: string };

// Helper: typed fetch wrapper used by page modules (browser context).
export async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) throw new Error(`${init?.method ?? 'GET'} ${url} failed: ${res.status}`);
  return (await res.json()) as T;
}
