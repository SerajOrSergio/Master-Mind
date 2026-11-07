import express from 'express';
import fs from 'fs';
import path from 'path';
import { readJson, writeJson } from './json-store';
import { dbDir } from './paths';

const router = express.Router();

const ABSENCE_LOGS_PATH = path.join(dbDir(), 'student-absence-logs.json');
const TEACHERS_PATH = path.join(dbDir(), 'teachers.json');

function normalizeName(name) {
  return String(name || '').trim().replace(/\s+/g, ' ').toLowerCase();
}

// PATCH: Update student info for all logs of a student
router.patch('/api/student-absence-logs/update-student', (req, res) => {
  const { studentName, phone, school, grade, classroom } = req.body;
  if (!studentName) return res.status(400).json({ error: 'studentName required' });
  const logs = readJson(ABSENCE_LOGS_PATH);
  let updated = 0;
  logs.forEach(log => {
    if (log.studentName === studentName) {
      if (phone !== undefined) log.phone = phone;
      if (school !== undefined) log.school = school;
      if (grade !== undefined) log.grade = grade;
      if (classroom !== undefined) log.classroom = classroom;
      updated++;
    }
  });
  writeJson(ABSENCE_LOGS_PATH, logs);
  res.json({ updated });
});

// GET: All absence logs
router.get('/api/student-absence-logs', (req, res) => {
  const allLogs = readJson(ABSENCE_LOGS_PATH);

  // Teacher portal scoped mode: only return logs for the logged-in teacher.
  if (String(req.query.mine) === '1') {
    const teacherId = req.query.teacherId || req.headers['x-teacher-id'];
    const teacherName = req.query.teacherName || req.headers['x-teacher-name'];
    const allowedNames = new Set();

    // Resolve the canonical teacher name from the teachers database when the
    // id is known, so filtering works even if the client name differs.
    if (teacherId) {
      const teacher = readJson(TEACHERS_PATH).find(t => String(t.id) === String(teacherId));
      if (teacher && teacher.firstName && teacher.lastName) {
        allowedNames.add(normalizeName(`${teacher.firstName} ${teacher.lastName}`));
      }
    }

    if (teacherName) {
      allowedNames.add(normalizeName(teacherName));
    }

    // No identity to filter by — never leak other teachers' logs.
    if (!allowedNames.size) {
      return res.json([]);
    }

    const mine = allLogs.filter(log => {
      const logTeacherName = normalizeName(log.teacher);
      return logTeacherName && allowedNames.has(logTeacherName);
    });

    return res.json(mine);
  }

  res.json(allLogs);
});

// POST: Add a new absence log (an existing id means "undo delete" — keep it
// and restore the log at its original position so it does not jump to the
// bottom of the list).
router.post('/api/student-absence-logs', (req, res) => {
  const logs = readJson(ABSENCE_LOGS_PATH);
  const newLog = { ...req.body };
  const restoreIdx = Number(newLog._restoreIndex);
  delete newLog._restoreIndex;
  if (newLog.id === undefined || newLog.id === null || newLog.id === '') {
    newLog.id = Date.now();
  }
  if (Number.isInteger(restoreIdx) && restoreIdx >= 0 && restoreIdx < logs.length) {
    logs.splice(restoreIdx, 0, newLog);
  } else {
    logs.push(newLog);
  }
  writeJson(ABSENCE_LOGS_PATH, logs);
  res.status(201).json(newLog);
});

// DELETE: Remove an absence log by id
router.delete('/api/student-absence-logs/:id', (req, res) => {
  let logs = readJson(ABSENCE_LOGS_PATH);
  const id = parseInt(req.params.id, 10);
  logs = logs.filter(log => log.id !== id);
  writeJson(ABSENCE_LOGS_PATH, logs);
  res.json({ success: true });
});

export default router;
