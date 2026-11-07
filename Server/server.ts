import express from 'express';
import https from 'https';
import zlib from 'zlib';
import { spawnSync } from 'child_process';
import pricingApi from './pricing-api';
import studentsApi from './students-api';
import teachersApi from './teachers-api';
import fs from 'fs';
import path from 'path';
import nodeDns from 'dns';
import multicastDns from 'multicast-dns';
import dns2 from 'dns2';
import { getLocalExternalIP, getLocalIPFor } from './lan-ip';
import studentAbsenceLogsApi from './student-absence-logs-api';
import studentMaterialsApi from './student-materials-api';
import teacherAbsenceApi from './teacher-absence-api';
import receptionistPageAccessApi from './receptionist-page-access-api';
import paymentsApi from './payments-api';
import sessionDraftApi from './session-draft-api';
import classroomsApi from './classrooms-api';
import teachersAvailabilityApi from './teachers-availability-api';
import sessionAttendanceApi from './session-attendance-api';
import subscriptionApi from './subscription-api';
import teachersAttendanceApi from './teachers-attendance-api';
import classesApi from './classes-api';
import topicsApi from './topics-api';
import studyClicksApi from './study-clicks-api';
import pastPapersApi from './past-papers-api';
import { syncPaymentsWithStudents } from './payments-sync';
import { dbDir } from './paths';
const app = express();

app.use(express.json()); // Parse JSON bodies for all routes (must be before any route definitions)

// ============================================================
// Response compression (gzip on our side, no extra dependency —
// this is what the `compression` package does, with Node zlib).
// HTML/CSS/JS/JSON shrink ~3-4x, so EVERY page load and API call
// over Wi-Fi / phone hotspot transfers far less data — the main
// cure for lag on mobile devices.
// ============================================================
const COMPRESSIBLE_TYPE = /(^text\/|^application\/(json|javascript|x-javascript|xml|manifest\+json)|^image\/svg\+xml)/;

app.use((req: any, res: any, next: () => void) => {
  const accept = String(req.headers['accept-encoding'] || '');
  if (req.method === 'HEAD' || !/\bgzip\b/i.test(accept) || res.getHeader('Content-Encoding')) {
    return next();
  }
  const chunks: Buffer[] = [];
  let passthrough = false;
  let decided = false;
  const realWrite = res.write.bind(res);
  const realEnd = res.end.bind(res);

  // Decide by content type once headers are actually set. Redirects
  // (empty bodies) and everything not text-based pass through.
  const decide = (): boolean => {
    if (decided) return !passthrough;
    decided = true;
    const code = res.statusCode || 200;
    const type = String(res.getHeader('Content-Type') || '');
    if (code >= 300 || res.headersSent || !COMPRESSIBLE_TYPE.test(type)) passthrough = true;
    return !passthrough;
  };

  res.write = function (chunk: any, a?: any, b?: any) {
    if (!decide()) return realWrite(chunk, a, b);
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk), (typeof a === 'string' && a ? a : undefined) as BufferEncoding | undefined));
    return true;
  };
  res.end = function (chunk?: any, a?: any, b?: any) {
    if (typeof chunk !== 'undefined' && chunk !== null && !(typeof chunk === 'function' && arguments.length === 1)) {
      if (!decide()) return realEnd(chunk, a, b);
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk), (typeof a === 'string' && a ? a : undefined) as BufferEncoding | undefined));
    } else if (!decide()) {
      return realEnd(chunk, a, b);
    }
    const body = Buffer.concat(chunks);
    if (body.length < 1024) {
      res.setHeader('Content-Length', String(body.length));
      return realEnd(body);
    }
    zlib.gzip(body, (err: Error | null, zipped: Buffer) => {
      if (err || !zipped || zipped.length >= body.length) {
        res.setHeader('Content-Length', String(body.length));
        return realEnd(body);
      }
      res.removeHeader('Content-Length');
      res.setHeader('Content-Encoding', 'gzip');
      res.setHeader('Vary', 'Accept-Encoding');
      res.setHeader('Content-Length', String(zipped.length));
      realEnd(zipped);
    });
  };
  next();
});

// ============================================================
// Cache headers — repeat navigation loads from the device cache
// with zero network wait. Vendor Bootstrap never changes → 1 week
// immutable. Images → 1 week. Compiled CSS/JS → 1 hour (fresh
// after a rebuild within the hour). HTML always revalidates by
// ETag (always current, still a tiny LAN round-trip).
// ============================================================
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  const p = req.path;
  if (/^\/+bootstrap-5\.0\.2\//.test(p) || /\.(png|jpe?g|webp|gif|svg|ico|woff2?|ttf|otf|eot)$/i.test(p)) {
    res.setHeader('Cache-Control', 'public, max-age=604800, immutable');
  } else if (/\.(css|js|mjs|map|html|json)$/i.test(p)) {
    // Revalidate on every load instead of caching blindly for an hour. With
    // the old "max-age=3600" a rebuild's new CSS/JS never reached the browser,
    // so a fixed page kept looking broken until the hour ran out. ETag still
    // makes the revalidation a cheap 304 on the LAN.
    res.setHeader('Cache-Control', 'no-cache');
  }
  next();
});

// --- Pricing API ---
app.use('/api/pricing', pricingApi);
// --- Students API ---
studentsApi(app);

// --- Study Clicks API ---
studyClicksApi(app);

// --- Past Papers API ---
pastPapersApi(app);

// --- Teachers API ---
teachersApi(app);

// LAN IP selection: ignores VPN adapters, understands phone-hotspot subnets
// (172.16-31.x) and picks the interface on the asking device's own subnet.
const { Packet } = dns2;
const DEFAULT_LOCAL_HOSTNAME = 'mastermind.ly';
const LOCAL_HOSTNAME = process.env.LOCAL_HOSTNAME || DEFAULT_LOCAL_HOSTNAME;
const MDNS_LOCAL_NAME = 'mastermind.local';
// mastermind.ly is the primary name; mastermind.local is kept only as a
// fallback alias for devices that auto-discover .local names via mDNS.
const MDNS_NAMES = [LOCAL_HOSTNAME, MDNS_LOCAL_NAME];
const mdns = multicastDns();
// Tracks which devices have already been logged by the mDNS responder, so
// each asking device prints exactly one line in the server log.
const mdnsQueriersSeen = new Set();

// --- Student Absence Logs API ---
app.use(studentAbsenceLogsApi);
// --- Teacher Absence Logs API ---
app.use('/api/teacher-absence-logs', teacherAbsenceApi);

// --- Receptionist Page Access API ---
app.use('/api/receptionist-page-access', receptionistPageAccessApi);

// --- Discounts API ---
const studentsFile = path.join(dbDir(), 'students.json');

const discountsFile = path.join(dbDir(), 'discounts.json');

// Get all discounts

// Debug log for all /api/discounts requests
app.use('/api/discounts', (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

app.get('/api/discounts', (req, res) => {
  try {
    let discounts = [];
    if (fs.existsSync(discountsFile)) {
      discounts = JSON.parse(fs.readFileSync(discountsFile, 'utf8'));
    }
    res.json(discounts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load discounts.' });
  }
});

// Add a single discount
app.post('/api/discounts', (req, res) => {
  try {
    console.log('POST /api/discounts body:', req.body);
    let discounts = [];
    if (fs.existsSync(discountsFile)) {
      discounts = JSON.parse(fs.readFileSync(discountsFile, 'utf8'));
    }
    // Load students for name lookup
    const studentsFile = path.join(dbDir(), 'students.json');
    let students = [];
    if (fs.existsSync(studentsFile)) {
      students = JSON.parse(fs.readFileSync(studentsFile, 'utf8'));
    }
    const { id, discount } = req.body;
    const studentId = Number(id);
    console.log('Looking for studentId:', studentId, 'in students:', students.map(s => s.id));
    if (!studentId || typeof discount !== 'number' || discount < 0 || discount > 100) {
      console.log('Validation failed:', { id, discount });
      return res.status(400).json({ error: 'Missing or invalid id or discount.' });
    }
    const student = students.find(s => s.id === studentId);
    if (!student) {
      console.log('Student not found for id:', studentId);
      return res.status(400).json({ error: 'Student not found.' });
    }
    // If already exists, update; else add new
    const idx = discounts.findIndex(d => d.id == studentId);
    if (idx >= 0) {
      discounts[idx].discount = discount;
      discounts[idx].name = student.studentName || student.name || '';
    } else {
      discounts.push({ id: studentId, name: student.studentName || student.name || '', discount });
    }
    // Ensure the database directory exists before writing
    const dbFolder = path.dirname(discountsFile);
    if (!fs.existsSync(dbFolder)) {
      fs.mkdirSync(dbFolder, { recursive: true });
    }
    fs.writeFileSync(discountsFile, JSON.stringify(discounts, null, 2));
    res.json({ success: true, discounts });
  } catch (err) {
    console.error('Error in POST /api/discounts:', err);
    res.status(500).json({ error: 'Failed to save discount.' });
  }
});

// Delete a discount by id
app.delete('/api/discounts/:id', (req, res) => {
  try {
    let discounts = [];
    if (fs.existsSync(discountsFile)) {
      discounts = JSON.parse(fs.readFileSync(discountsFile, 'utf8'));
    }
    const id = req.params.id;
    const idx = discounts.findIndex(d => d.id == id);
    if (idx === -1) return res.status(404).json({ error: 'Discount not found.' });
    discounts.splice(idx, 1);
    fs.writeFileSync(discountsFile, JSON.stringify(discounts, null, 2));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete discount.' });
  }
});

// Mount payments API (patches phone numbers live)
app.use(paymentsApi);

// Mount session draft API
app.use(sessionDraftApi);

// Mount student materials API (admin + receptionist pages)
studentMaterialsApi(app);

// Mount classrooms API
app.use(classroomsApi);

// --- Current Teacher API ---
// --- Receptionist Credentials API ---
const receptionistFile = path.join(dbDir(), 'site_access/receptionist.json');

// Get current receptionist credentials (first in array or object)
app.get('/api/receptionist', (req, res) => {
  try {
    if (!fs.existsSync(receptionistFile)) return res.status(404).json({ error: 'Not found' });
    let data = JSON.parse(fs.readFileSync(receptionistFile, 'utf8'));
    if (Array.isArray(data)) data = data[0];
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load receptionist credentials.' });
  }
});

// Update receptionist credentials (overwrite file with single object in array)
app.put('/api/receptionist', (req, res) => {
  try {
    const { id, username, password } = req.body;
    if (!id || !username || !password) {
      return res.status(400).json({ error: 'Missing fields.' });
    }
    const newData = [{ id, username, password, role: 'receptionist' }];
    fs.writeFileSync(receptionistFile, JSON.stringify(newData, null, 2));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update receptionist credentials.' });
  }
});

// --- Admin Credentials API ---
const adminFile = path.join(dbDir(), 'site_access/admin.json');

app.get('/api/admin', (req, res) => {
  try {
    let adminData;
    if (!fs.existsSync(adminFile)) {
      // Auto-create default admin if missing
      adminData = { id: 1, username: 'admin', password: 'admin', role: 'admin' };
      fs.writeFileSync(adminFile, JSON.stringify(adminData, null, 2));
    } else {
      adminData = JSON.parse(fs.readFileSync(adminFile, 'utf8'));
    }
    res.json({
      id: 1,
      username: adminData.username,
      role: 'admin'
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load admin credentials.' });
  }
});

// Update admin credentials (overwrite file with single object)
app.put('/api/admin', (req, res) => {
  try {
    const { id, username, password } = req.body;
    const normalizedUsername = typeof username === 'string' ? username.trim() : '';
    const normalizedPassword = typeof password === 'string' ? password.trim() : '';

    if (!id || !normalizedUsername) {
      return res.status(400).json({ error: 'Admin id and username are required.' });
    }

    const existingAdmin = fs.existsSync(adminFile)
      ? JSON.parse(fs.readFileSync(adminFile, 'utf8'))
      : { id: 1, username: '', password: '', role: 'admin' };

    // Allow 1-letter passwords
    const nextPassword = normalizedPassword !== '' ? normalizedPassword : existingAdmin.password;
    if (nextPassword === undefined) {
      return res.status(400).json({ error: 'Password is required.' });
    }

    const newData = {
      id: 1,
      username: normalizedUsername,
      password: nextPassword,
      role: 'admin'
    };

    fs.writeFileSync(adminFile, JSON.stringify(newData, null, 2));
    res.json({
      success: true,
      admin: {
        id: 1,
        username: newData.username,
        role: 'admin'
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update admin credentials.' });
  }
});
app.get('/api/current-teacher', (req, res) => {
  // Accept teacherId from query or header
  const teacherId = req.query.teacherId || req.headers['x-teacher-id'];
  if (!teacherId) return res.status(400).json({ error: 'Missing teacherId' });
  const teachers = JSON.parse(fs.readFileSync(path.join(dbDir(), 'teachers.json'), 'utf8'));
  const teacher = teachers.find(t => String(t.id) === String(teacherId));
  if (!teacher) return res.status(404).json({ error: 'Teacher not found' });
  res.json(teacher);
});

// Removed duplicate require statements

// --- Payments API ---
const paymentsFile = path.join(dbDir(), 'teacher-portal/payments.json');
// Delete a payment by ID
app.post('/api/delete-payment', (req, res) => {
  try {
    const { paymentId } = req.body;
    if (!paymentId) {
      return res.status(400).json({ error: 'Missing paymentId.' });
    }
    let payments = JSON.parse(fs.readFileSync(paymentsFile, 'utf8'));
    const initialLength = payments.length;
    payments = payments.filter(p => String(p.id) !== String(paymentId));
    if (payments.length === initialLength) {
      return res.status(404).json({ error: 'Payment not found.' });
    }
    fs.writeFileSync(paymentsFile, JSON.stringify(payments, null, 2));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete payment.', details: err.message });
  }
});

// Serve database folder as static files for session form
app.use('/database', express.static(dbDir()));

// On boot, bring every existing payment row up to date with the student
// record, so stale names/phones/discounts saved before this rule existed
// disappear on the next restart instead of needing a manual data fix.
syncPaymentsWithStudents();

// Serve teacher availability admin page and assets (new location)
app.get('/src/pages/admin/teachers-availability', (req, res) => {
  res.sendFile(path.join(__dirname, '../src/pages/admin/teachers-availability/index.html'));
});
app.use('/src/pages/admin/teachers-availability/teachers-availability.js', express.static(path.join(__dirname, '../src/pages/admin/teachers-availability/teachers-availability.js')));
app.use('/src/pages/admin/teachers-availability/teachers-availability.css', express.static(path.join(__dirname, '../src/pages/admin/teachers-availability/teachers-availability.css')));
// --- Students API ---

// --- Teachers Availability API ---
teachersAvailabilityApi(app);

// Get all students

// Add a student
app.post('/api/students', (req, res) => {
  try {
    const student = req.body;
    if (!student.studentName || typeof student.studentName !== 'string') {
      return res.status(400).json({ error: 'Invalid student name.' });
    }
    let students = JSON.parse(fs.readFileSync(studentsFile, 'utf8'));
    // Prevent duplicate: same name and phone number

    const duplicate = students.find(s =>
      s.studentName && s.phoneNumber &&
      s.studentName.trim().toLowerCase() === student.studentName.trim().toLowerCase() &&
      s.phoneNumber.trim() === student.phoneNumber.trim()
    );

    let nextId = 1;
    if (students.length > 0) {
      nextId = Math.max(...students.map(s => s.id)) + 1;
    }
    student.id = nextId;
    students.push(student);
    fs.writeFileSync(studentsFile, JSON.stringify(students, null, 2));
    res.json(student);
  } catch (err) {
    console.error('Failed to add student:', err);
    res.status(500).json({ error: 'Failed to add student.', details: err.message, stack: err.stack });
  }
});

// Update a student
app.put('/api/students/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    let students = JSON.parse(fs.readFileSync(studentsFile, 'utf8'));
    const idx = students.findIndex(s => s.id === id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Student not found.' });
    }
    // If subjects is present in the request, always set it (even if empty)
    if (Object.prototype.hasOwnProperty.call(req.body, 'subjects')) {
      students[idx].subjects = Array.isArray(req.body.subjects) ? req.body.subjects : [];
    }
    // Merge other fields
    Object.keys(req.body).forEach(key => {
      if (key !== 'subjects') students[idx][key] = req.body[key];
    });
    fs.writeFileSync(studentsFile, JSON.stringify(students, null, 2));
    res.json(students[idx]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update student.', details: err.message });
  }
});

// Delete a student
app.delete('/api/students/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    let students = JSON.parse(fs.readFileSync(studentsFile, 'utf8'));
    const initialLength = students.length;
    students = students.filter(s => s.id !== id);
    if (students.length === initialLength) {
      return res.status(404).json({ error: 'Student not found.' });
    }
    fs.writeFileSync(studentsFile, JSON.stringify(students, null, 2));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete student.' });
  }
});

// --- Session Attendance API ---
app.use('/api', sessionAttendanceApi);

// --- Subscription API ---
app.use(subscriptionApi);

// (The old explicit routes for the stale /src/pages/teacher/session/ folder
// were removed — that folder no longer exists; pages live in
// /src/pages/teacher/session-form and /src/pages/teacher/session-draft and the
// compiled output under dist/ is served by the root static handler.)

// Serve teacher sidebar assets
app.use('/src/components/teacher/sidebar/TeacherSidebar.html', express.static(path.join(__dirname, '../src/components/teacher/sidebar/TeacherSidebar.html')));
app.use('/src/components/teacher/sidebar/TeacherSidebar.css', express.static(path.join(__dirname, '../src/components/teacher/sidebar/TeacherSidebar.css')));

const PORT = process.env.PORT ? Number(process.env.PORT) : 80;

// Redirect old and incorrect teacher session form URLs to the correct one
app.get('/src/pages/teacher/session/SessionForm.html', (req, res) => {
  res.redirect('/src/pages/teacher/session-form/SessionForm.html');
});
app.get('/src/pages/teacher/index.html', (req, res) => {
  res.redirect('/src/pages/teacher/session-form/SessionForm.html');
});

const gradesFile = path.join(dbDir(), 'grades.json');

const subjectsFile = path.join(dbDir(), 'subjects.json');

// --- Subjects API --- 
// Get all subjects
app.get('/api/subjects', (req, res) => {
  try {
    let subjects = JSON.parse(fs.readFileSync(subjectsFile, 'utf8'));
    subjects.sort((a, b) => a.id - b.id);
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load subjects.' });
  }
});

// Redirect old teacher index.html URL to session form page
app.get('/src/pages/teacher/index.html', (req, res) => {
  res.redirect('/src/pages/teacher/session/SessionForm.html');
});

// Add a subject (a provided id means "undo delete" — the subject is inserted
// back in id order, then the whole list is renumbered 1..n so the table ids
// always stay clean and sequential from 1 to the bottom).
app.post('/api/subjects', (req, res) => {
  try {
    const { name, id } = req.body;
    if (!name || typeof name !== 'string') {
      console.error('Invalid subject name:', name);
      return res.status(400).json({ error: 'Invalid subject name.' });
    }
    let subjects = JSON.parse(fs.readFileSync(subjectsFile, 'utf8'));
    subjects.sort((a, b) => a.id - b.id);
    const requestedId = Number(id);
    const newSubject = { id: Number.isInteger(requestedId) && requestedId > 0 ? requestedId : (subjects.length ? Math.max(...subjects.map(s => s.id)) + 1 : 1), name };
    // Insert in id order when restoring, otherwise append
    const insertIdx = subjects.findIndex(s => s.id >= newSubject.id);
    if (insertIdx === -1) subjects.push(newSubject);
    else subjects.splice(insertIdx, 0, newSubject);
    // Keep ids sequential 1..n
    subjects.forEach((s, i) => { s.id = i + 1; });
    fs.writeFileSync(subjectsFile, JSON.stringify(subjects, null, 2));
    const stored = subjects.find(s => s.name === name && (insertIdx === -1 ? s.id === subjects.length : s.id === insertIdx + 1));
    console.log('Subject added:', stored);
    res.json(stored);
  } catch (err) {
    console.error('Failed to add subject:', err);
    res.status(500).json({ error: 'Failed to add subject.', details: err.message });
  }
});

// Update a subject
app.put('/api/subjects/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    let subjects = JSON.parse(fs.readFileSync(subjectsFile, 'utf8'));
    const idx = subjects.findIndex(s => s.id === id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Subject not found.' });
    }
    const { name } = req.body;
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ error: 'Invalid subject name.' });
    }
    subjects[idx].name = name;
    fs.writeFileSync(subjectsFile, JSON.stringify(subjects, null, 2));
    res.json(subjects[idx]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update subject.', details: err.message });
  }
});

// Delete a subject (then renumber 1..n so ids stay sequential)
app.delete('/api/subjects/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    let subjects = JSON.parse(fs.readFileSync(subjectsFile, 'utf8'));
    const initialLength = subjects.length;
    subjects = subjects.filter(s => s.id !== id);
    if (subjects.length === initialLength) {
      console.error('Subject not found for delete:', id);
      return res.status(404).json({ error: 'Subject not found.' });
    }
    subjects.forEach((s, i) => { s.id = i + 1; });
    fs.writeFileSync(subjectsFile, JSON.stringify(subjects, null, 2));
    console.log('Subject deleted:', id);
    res.json({ success: true });
  } catch (err) {
    console.error('Failed to delete subject:', err);
    res.status(500).json({ error: 'Failed to delete subject.', details: err.message });
  }
});

// --- Grades API ---
// Get all grades
app.get('/api/grades', (req, res) => {
  try {
    let grades = JSON.parse(fs.readFileSync(gradesFile, 'utf8'));
    // Always return grades sorted by id
    grades.sort((a, b) => a.id - b.id);
    res.json(grades);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load grades.' });
  }
});

// Add a grade (a provided id means "undo delete" — the grade is inserted back
// in id order, then the whole list is renumbered 1..n so the table ids always
// stay clean and sequential from 1 to the bottom).
app.post('/api/grades', (req, res) => {
  try {
    const { name, id } = req.body;
    if (!name || typeof name !== 'string') {
      console.error('Invalid grade name:', name);
      return res.status(400).json({ error: 'Invalid grade name.' });
    }
    let grades = JSON.parse(fs.readFileSync(gradesFile, 'utf8'));
    grades.sort((a, b) => a.id - b.id);
    const requestedId = Number(id);
    const newGrade = { id: Number.isInteger(requestedId) && requestedId > 0 ? requestedId : (grades.length ? Math.max(...grades.map(g => g.id)) + 1 : 1), name };
    // Insert in id order when restoring, otherwise append
    const insertIdx = grades.findIndex(g => g.id >= newGrade.id);
    if (insertIdx === -1) grades.push(newGrade);
    else grades.splice(insertIdx, 0, newGrade);
    // Keep ids sequential 1..n
    grades.forEach((g, i) => { g.id = i + 1; });
    fs.writeFileSync(gradesFile, JSON.stringify(grades, null, 2));
    const stored = grades.find(g => g.name === name && (insertIdx === -1 ? g.id === grades.length : g.id === insertIdx + 1));
    console.log('Grade added:', stored);
    res.json(stored);
  } catch (err) {
    console.error('Failed to add grade:', err);
    res.status(500).json({ error: 'Failed to add grade.', details: err.message });
  }
});

// Delete a grade (then renumber 1..n so ids stay sequential)
app.delete('/api/grades/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    let grades = JSON.parse(fs.readFileSync(gradesFile, 'utf8'));
    const initialLength = grades.length;
    grades = grades.filter(g => g.id !== id);
    if (grades.length === initialLength) {
      console.error('Grade not found for delete:', id);
      return res.status(404).json({ error: 'Grade not found.' });
    }
    grades.forEach((g, i) => { g.id = i + 1; });
    fs.writeFileSync(gradesFile, JSON.stringify(grades, null, 2));
    console.log('Grade deleted:', id);
    res.json({ success: true });
  } catch (err) {
    console.error('Failed to delete grade:', err);
    res.status(500).json({ error: 'Failed to delete grade.', details: err.message });
  }
});

// --- Teachers API ---
teachersApi(app);

// --- Teachers Attendance API ---
app.use(teachersAttendanceApi);

// --- Classes API ---
app.get('/api/classes', classesApi.getAllReservations);
app.post('/api/classes', classesApi.addReservation);

// --- Topics API ---
app.use('/api/topics', topicsApi);

// API endpoint for login authentication
app.use(express.json());
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const adminData = JSON.parse(fs.readFileSync(path.join(dbDir(), 'site_access/admin.json'), 'utf8'));
  const teacherPortalData = JSON.parse(fs.readFileSync(path.join(dbDir(), 'site_access/teacher.json'), 'utf8'));
  let receptionistData: any = [];
  try {
    receptionistData = JSON.parse(fs.readFileSync(path.join(dbDir(), 'site_access/receptionist.json'), 'utf8'));
  } catch (e) {}

  // --- Coordinator login ---
  let coordinatorData: any = [];
  try {
    coordinatorData = JSON.parse(fs.readFileSync(path.join(dbDir(), 'site_access/coordinator.json'), 'utf8'));
  } catch (e) {}
  let coordinatorUser = null;
  if (Array.isArray(coordinatorData)) {
    coordinatorUser = coordinatorData.find(c => c.username === username && c.password === password);
  } else if (coordinatorData && coordinatorData.username && coordinatorData.password) {
    if (coordinatorData.username === username && coordinatorData.password === password) {
      coordinatorUser = coordinatorData;
    }
  }
  if (coordinatorUser) {
    res.json({ success: true, role: 'coordinator', coordinatorId: coordinatorUser.id });
    return;
  }

  if (username === adminData.username && password === adminData.password) {
    res.json({ success: true, role: 'admin' });
    return;
  }
  // Check developer/portal teacher
  if (username === teacherPortalData.username && password === teacherPortalData.password) {
    res.json({ success: true, role: 'teacher', teacherId: teacherPortalData.id });
    return;
  }
  // Receptionist login (support array or object)
  let receptionistUser = null;
  if (Array.isArray(receptionistData)) {
    receptionistUser = receptionistData.find(r => r.username === username && r.password === password);
  } else if (receptionistData && receptionistData.username && receptionistData.password) {
    if (receptionistData.username === username && receptionistData.password === password) {
      receptionistUser = receptionistData;
    }
  }
  if (receptionistUser) {
    res.json({ success: true, role: 'receptionist', receptionistId: receptionistUser.id });
    return;
  }
  // Check admin-created teachers
  const teachersFile = path.join(dbDir(), 'teachers.json');
  let teachers = [];
  try {
    teachers = JSON.parse(fs.readFileSync(teachersFile, 'utf8'));
  } catch (e) {}
  const teacher = teachers.find(t => t.firstName === username && t.password === password);
  if (teacher) {
    if (teacher.password === '12345') {
      res.json({ success: true, role: 'teacher', forcePasswordChange: true, teacherId: teacher.id });
    } else {
      res.json({ success: true, role: 'teacher', teacherId: teacher.id });
    }
    return;
  }
  res.json({ success: false, message: 'Invalid credentials' });
});
// Simple Node.js server to serve static files (HTML, CSS, JS)
// Accessible via your local network (WiFi IPv4 address)

// --- PWA files live in /assist ---
// Redirect the old root URLs so previously-installed service workers and
// bookmarked pages keep resolving.
app.get('/sw.js', (req, res) => res.redirect('/assist/sw.js'));
app.get('/manifest.json', (req, res) => res.redirect('/assist/manifest.json'));
// A service worker can only expand its scope beyond its own folder when the
// server allows it — permit /assist/sw.js to control the entire site.
app.use('/assist/sw.js', (req, res, next) => {
  res.setHeader('Service-Worker-Allowed', '/');
  next();
});

// Serve static files from the root directory (adjust if needed)
app.use(express.static(path.join(__dirname, '../')));

// Serve all teacher pages and assets (HTML, CSS, JS) directly
app.use('/src/pages/teacher', express.static(path.join(__dirname, '../src/pages/teacher')));
// Serve teacher sidebar and related assets
app.use('/src/components/teacher/sidebar', express.static(path.join(__dirname, '../src/components/teacher/sidebar')));
// Serve login static assets from their folder
app.use('/login.css', express.static(path.join(__dirname, '../src/pages/login/login.css')));
app.use('/login.js', express.static(path.join(__dirname, '../src/pages/login/login.js')));

// Serve admin dashboard and classes at clean URLs
app.use('/src/components/admin/sidebar-menu/sidebar.css', express.static(path.join(__dirname, '../src/components/admin/sidebar-menu/sidebar.css')));
app.use('/src/components/admin/sidebar-menu/sidebar.html', express.static(path.join(__dirname, '../src/components/admin/sidebar-menu/sidebar.html')));
app.use('/bootstrap-5.0.2/dist/css/bootstrap.min.css', express.static(path.join(__dirname, '../bootstrap-5.0.2/dist/css/bootstrap.min.css')));
app.use('/bootstrap-5.0.2/dist/js/bootstrap.bundle.min.js', express.static(path.join(__dirname, '../bootstrap-5.0.2/dist/js/bootstrap.bundle.min.js')));
app.use('/bootstrap-5.0.2/site/static/docs/5.0/assets/brand/bootstrap-logo.svg', express.static(path.join(__dirname, '../bootstrap-5.0.2/site/static/docs/5.0/assets/brand/bootstrap-logo.svg')));

app.get('/src/pages/admin/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../src/pages/admin/dashboard/index.html'));
});
app.get('/src/pages/admin/classes', (req, res) => {
  res.sendFile(path.join(__dirname, '../src/pages/admin/classes/index.html'));
});

// Serve login page as the main landing page
// Serve login page at /login
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../src/pages/login/index.html'));
});

// Redirect root to /login
app.get('/', (req, res) => {
  res.redirect('/login');
});

function normalizeDnsName(name) {
  return String(name || '').toLowerCase().replace(/\.$/, '');
}

const NORMALIZED_DNS_NAMES = MDNS_NAMES.map(normalizeDnsName);

function startMdnsResponder() {
  mdns.on('query', (query, rinfo) => {
    query.questions.forEach(question => {
      const name = normalizeDnsName(question.name);
      if (NORMALIZED_DNS_NAMES.includes(name) && question.type === 'A') {
        // Answer with the IP on the SAME subnet as whoever asked — so a phone
        // on a hotspot (172.20.10.x) gets the hotspot IP, not a VPN 10.x one.
        const localIp = getLocalIPFor(rinfo && rinfo.address);
        if (localIp !== 'localhost') {
          const answers = [{
            name: question.name,
            type: 'A',
            ttl: 300,
            data: localIp
          }];
          // Reply UNICAST straight to the asking device as well as to the
          // multicast group. A direct unicast answer reaches the device even
          // when the router or a Wi-Fi extender drops/filters multicast (a
          // common cause of "mastermind.local works on the PC but not on
          // phones"). RFC 6762 allows direct unicast answers to mDNS queries.
          const querier = (rinfo && rinfo.address)
            ? { address: rinfo.address, port: rinfo.port || 5353 }
            : null;
          if (querier) mdns.respond({ answers }, querier);
          mdns.respond({ answers });
          // One short log line per asking device, so it is easy to verify from
          // a phone that its query arrived and got answered.
          if (mdnsQueriersSeen && !mdnsQueriersSeen.has(rinfo.address)) {
            mdnsQueriersSeen.add(rinfo.address);
            console.log(`mDNS: answered ${question.name} -> ${localIp} for ${rinfo.address}:${rinfo.port}`);
          }
        }
      }
    });
  });
}

// Upstream DNS servers the local responder forwards normal lookups to, so
// devices can point their DNS at this PC without losing internet access.
function getUpstreamDnsServers() {
    const pcIp = getLocalExternalIP();
    const candidates = [];
    try {
        candidates.push(...nodeDns.getServers());
    } catch (err) { /* no system DNS info available */ }
    candidates.push('8.8.8.8', '1.1.1.1');
    const unique = [];
    for (const raw of candidates) {
        const server = String(raw || '').trim();
        if (!server) continue;
        // Never forward back to this PC — that would create a resolution loop.
        if (server === pcIp || server === '127.0.0.1' || server === '::1' || server === 'localhost') continue;
        if (!unique.includes(server)) unique.push(server);
    }
    return unique.length ? unique : ['8.8.8.8', '1.1.1.1'];
}

function startDnsResponder() {
    const upstreamServers = getUpstreamDnsServers();
    const resolver = new dns2({ nameServers: upstreamServers, timeout: 3000, retries: 1 });
    // createServer (not createUDPServer) is the API that wires the object-form
    // handler; the UDP-only server ignores an options.handle property.
    const dnsServer = dns2.createServer({
        udp: { type: 'udp4' },
        handle: async (request: any, send: any, rinfo: any) => {
            try {
                const response = Packet.createResponseFromRequest(request) as any;
                const toForward = [];
                for (const question of request.questions || []) {
                    const name = normalizeDnsName(question.name);
                    const isLocal = NORMALIZED_DNS_NAMES.includes(name);
                    if (isLocal && question.type === Packet.TYPE.A) {
                        // mastermind.ly / mastermind.local -> the PC's LAN IPv4 on
                        // the requesting device's own subnet (handles hotspots + VPNs).
                        const localIp = getLocalIPFor(rinfo && rinfo.address);
                        if (localIp !== 'localhost') {
                            response.answers.push({
                                name: question.name,
                                type: Packet.TYPE.A,
                                class: Packet.CLASS.IN,
                                ttl: 300,
                                address: localIp
                            });
                        }
                    } else if (!isLocal) {
                        // Every other domain goes to the normal DNS servers.
                        toForward.push(question);
                    }
                    // A local name asked for a non-A record (e.g. AAAA) gets a
                    // plain "no data" answer — nothing to add, nothing to forward.
                }
                for (const question of toForward) {
                    const typeName = (Packet as any).TYPE_NAME[question.type];
                    if (!typeName) continue; // unknown record type — answer "no data"
                    const upstream = await resolver.resolve(question.name, typeName);
                    if (upstream) {
                        if (Array.isArray(upstream.answers)) response.answers.push(...upstream.answers);
                        if (upstream.header && upstream.header.rcode != null) {
                            response.header.rcode = upstream.header.rcode;
                        }
                    }
                }
                send(response);
            } catch (err) {
                try {
                    const response = Packet.createResponseFromRequest(request) as any;
                    response.header.rcode = (Packet as any).RCODE.SERVFAIL;
                    send(response);
                } catch (err2) { /* nothing else we can do */ }
            }
        }
    });

    dnsServer.on('listening', () => {
        console.log(`DNS responder listening on 0.0.0.0:53 for ${MDNS_NAMES.join(', ')}`);
        console.log(`  -> ${MDNS_NAMES.join(', ')} resolve to ${getLocalExternalIP()} (the PC's LAN IP)`);
        console.log(`  -> all other lookups forward to: ${upstreamServers.join(', ')}`);
    });
    dnsServer.on('error', err => {
        if ((err as any).code === 'EACCES' || (err as any).code === 'EPERM') {
            console.error('DNS responder error: cannot bind port 53 (needs administrator rights). Use start-server-admin.bat so devices can resolve mastermind.ly to this PC.');
        } else if ((err as any).code === 'EADDRINUSE') {
            console.error('DNS responder error: port 53 is already in use by another program.');
        } else {
            console.error('DNS responder error:', err.message);
        }
    });
    // createServer returns a socket that does not bind until listen() is
    // called — without this line the responder silently never starts.
    dnsServer.listen({ udp: { port: 53, address: '0.0.0.0' } }).catch(() => { /* the 'error' handler above reports it */ });
}
function onListening(port: number) {
  const ip = getLocalExternalIP();
  const portSuffix = port === 80 ? '' : `:${port}`;
  const localUrl = port === 80 ? `http://${LOCAL_HOSTNAME}/` : `http://${LOCAL_HOSTNAME}:${port}/`;
  const mdnsUrl = port === 80 ? `http://${MDNS_LOCAL_NAME}/` : `http://${MDNS_LOCAL_NAME}:${port}/`;

  console.log(`Server running at http://${ip}${portSuffix}/`);
  console.log(`Local private URL: ${localUrl}`);
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(ip)) {
    console.log('  Phone-hotspot network detected (172.16-31.x). If the site still will not load on');
    console.log('  the phone, allow Node.js through Windows Firewall on this network profile —');
    console.log('  hotspot connections are usually "Public", so allow both Private and Public.');
  }
  console.log('');
  console.log('iPhone home-screen icon that follows this PC to ANY Wi-Fi (add once):');
  console.log(`  1. In Safari, open ${mdnsUrl}`);
  console.log('  2. Tap Share -> Add to Home Screen.');
  console.log(`  The icon saves the NAME (mastermind.local), not the IPv4. Every time it opens, mDNS`);
  console.log(`  re-resolves that name to this PC's CURRENT IP, so it keeps working when this PC`);
  console.log(`  joins a different Wi-Fi — the icon never needs to be re-added per network.`);
  console.log(`  If an existing icon was added from an IPv4 link (http://${ip}...), delete it and`);
  console.log(`  re-add it once from the name above.`);
  console.log('');
  console.log('Why mastermind.local auto-works but mastermind.ly needs one setting:');
  console.log('  Every OS special-cases .local names for mDNS. .ly is a real internet TLD, so');
  console.log('  devices ask their DNS server (the router) for it instead — they never ask mDNS.');
  console.log('');
  console.log('The one-time fix so every device on the Wi-Fi uses mastermind.ly (like the IPv4 link):');
  console.log(`  1. Run start-server-admin.bat as Administrator so the DNS responder can use port 53.`);
  console.log(`  2. On your router, set its DNS server to this PC's LAN IP: ${ip}`);
  console.log('     (or on a phone: Wi-Fi settings -> DNS -> ' + ip + ' — no hosts file needed).');
  console.log('  3. Devices then resolve mastermind.ly to this PC automatically, and all other');
  console.log('     lookups are forwarded, so normal internet keeps working.');
  console.log(`  Note: that DNS setting stores THIS PC's current IP, so if the PC moves to a new`);
  console.log(`  Wi-Fi, update the router/phone DNS to the new IP shown above. The home-screen`);
  console.log(`  icon added from mastermind.local needs no such updates.`);
  console.log('');
  startMdnsResponder();
  startDnsResponder();
}

// ============================================================
// IPv4 startup with a port fallback.
// Port 80 needs administrator rights, and something else (IIS,
// another Node instance, a leftover process) may own it. Exiting
// there made the .bat watchdog restart in a loop with the site
// down, so try the next port instead and keep serving.
// ============================================================
const HTTP_PORTS = Array.from(new Set([PORT, 8080, 3000]));

function startHttpServer(index: number) {
  const port = HTTP_PORTS[index];
  const server = app.listen(port, '0.0.0.0', () => onListening(port));
  server.on('error', (err: any) => {
    const code = err && err.code;
    if ((code === 'EADDRINUSE' || code === 'EACCES') && index + 1 < HTTP_PORTS.length) {
      console.warn(`Port ${port} is unavailable (${code}) - trying port ${HTTP_PORTS[index + 1]} instead.`);
      startHttpServer(index + 1);
      return;
    }
    if (code === 'EADDRINUSE') {
      console.error(`Port ${port} is already in use. Stop the program using it, or set PORT to a free port.`);
    } else if (code === 'EACCES') {
      console.error(`Port ${port} needs administrator rights. Use start-server-admin.bat, or set PORT=8080.`);
    } else {
      console.error('Server error:', err);
    }
  });
}

startHttpServer(0);

// ============================================================
// HTTPS — powers the desktop "Install MasterMind" prompt.
// Browsers only offer to install a web app on a secure origin
// (https:// or http://localhost), so the same site is also served
// over HTTPS with a self-signed certificate. Open
// https://mastermind.local in Chrome/Edge, accept the certificate
// warning once per machine, and the Install popup appears.
// ============================================================
const CERT_KEY = path.join(__dirname, 'certs', 'mastermind-key.pem');
const CERT_FILE = path.join(__dirname, 'certs', 'mastermind-cert.pem');

function ensureCerts() {
  if (fs.existsSync(CERT_KEY) && fs.existsSync(CERT_FILE)) return;
  const certDir = path.dirname(CERT_KEY);
  if (!fs.existsSync(certDir)) fs.mkdirSync(certDir, { recursive: true });
  const ip = getLocalExternalIP();
  const san = ['DNS:mastermind.local', 'DNS:mastermind.ly', 'DNS:localhost', 'IP:127.0.0.1'];
  if (ip && ip !== 'localhost') san.push('IP:' + ip);
  const args = [
    'req', '-x509', '-newkey', 'rsa:2048',
    '-keyout', CERT_KEY, '-out', CERT_FILE,
    '-days', '3650', '-nodes',
    '-subj', '/CN=mastermind.local',
    '-addext', 'subjectAltName=' + san.join(',')
  ];
  try {
    spawnSync('openssl', args, { stdio: 'inherit' });
    console.log('Generated self-signed HTTPS certificate for ' + san.join(', '));
  } catch (err) {
    console.error('Could not generate the HTTPS certificate (is openssl installed?).');
    console.error('The desktop Install popup will be unavailable. Install openssl, or drop the');
    console.error('certificate files in manually at ' + CERT_KEY + ' and ' + CERT_FILE + '.');
  }
}

ensureCerts();

// ============================================================
// Hosts entry for this PC.
// Phones resolve mastermind.local through the mDNS/DNS responders,
// but Windows itself rarely resolves a .local name for its own
// browser, so http://mastermind.local could fail on the server PC.
// Two hosts lines fix that instantly and are idempotent.
// Writing the hosts file needs admin rights (start-server-admin.bat);
// without them this is skipped and the IPv4 link is still printed.
// ============================================================
const HOSTS_FILE = process.platform === 'win32'
  ? path.join(process.env.SystemRoot || 'C:\\Windows', 'System32', 'drivers', 'etc', 'hosts')
  : '/etc/hosts';

function ensureHostsEntries() {
  try {
    if (!fs.existsSync(HOSTS_FILE)) return;
    const lines = fs.readFileSync(HOSTS_FILE, 'utf8').split(/\r?\n/);
    const active = lines.filter(line => {
      const trimmed = line.trim();
      return trimmed && !trimmed.startsWith('#');
    });
    const missing = [MDNS_LOCAL_NAME, LOCAL_HOSTNAME].filter(name =>
      !active.some(line => line.toLowerCase().includes(name.toLowerCase()))
    );
    if (!missing.length) return;
    fs.appendFileSync(HOSTS_FILE, '\r\n' + missing.map(name => `127.0.0.1 ${name}`).join('\r\n') + '\r\n');
    console.log(`Added ${missing.join(', ')} -> 127.0.0.1 to the hosts file (resolves on this PC).`);
  } catch (err: any) {
    const code = err && err.code;
    if (code === 'EACCES' || code === 'EPERM') {
      console.log('Note: mastermind.local on THIS PC needs a hosts entry, which needs admin rights.');
      console.log('      Run start-server-admin.bat once for that, or just use the IPv4 link below.');
    }
  }
}

ensureHostsEntries();

const HTTPS_PORT = process.env.HTTPS_PORT ? Number(process.env.HTTPS_PORT) : 443;
if (fs.existsSync(CERT_KEY) && fs.existsSync(CERT_FILE)) {
  try {
    const httpsServer = https.createServer({
      key: fs.readFileSync(CERT_KEY),
      cert: fs.readFileSync(CERT_FILE)
    }, app);
    httpsServer.listen(HTTPS_PORT, '0.0.0.0', () => {
      console.log('HTTPS running on port ' + HTTPS_PORT + ' (desktop Install popup enabled)');
    });
    httpsServer.on('error', (err) => console.error('HTTPS server error:', err.message));
  } catch (err) {
    console.error('Failed to start the HTTPS server:', err.message);
  }
}
