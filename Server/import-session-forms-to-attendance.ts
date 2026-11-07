import fs from 'fs';
import path from 'path';
import { dbDir } from './paths';
// Script to import all session forms into teachers-attendance.json

const sessionFormPath = path.join(dbDir(), 'teacher-portal/session-form.json');
const attendancePath = path.join(dbDir(), 'teacher-portal/teachers-attendance.json');

const sessionForms = fs.existsSync(sessionFormPath) ? JSON.parse(fs.readFileSync(sessionFormPath, 'utf8')) : [];
const attendance = fs.existsSync(attendancePath) ? JSON.parse(fs.readFileSync(attendancePath, 'utf8')) : [];

// Only add sessions that are not already in attendance (by id)
const attendanceIds = new Set(attendance.map(a => a.id));
let imported = 0;
for (const session of sessionForms) {
  if (!attendanceIds.has(session.id)) {
    attendance.push(session);
    imported++;
  }
}
fs.writeFileSync(attendancePath, JSON.stringify(attendance, null, 2));
console.log(`Imported ${imported} session(s) to teachers-attendance.json.`);
