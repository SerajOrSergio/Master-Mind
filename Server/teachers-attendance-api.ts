import fs from 'fs';
import path from 'path';
import express from 'express';
import { readJson, writeJson } from './json-store';
import { dbDir } from './paths';
// Teachers Attendance API
const router = express.Router();

const DATA_PATH = path.join(dbDir(), 'teacher-portal/teachers-attendance.json');
const TEACHERS_PATH = path.join(dbDir(), 'teachers.json');

// Helper to read data (self-healing: corrupt files quarantine + fallback)
function readData() {
  return readJson(DATA_PATH, []);
}

// Helper to write data (atomic: no half-written file on power loss)
function writeData(data) {
  writeJson(DATA_PATH, data);
}

function readTeachers() {
  return readJson(TEACHERS_PATH, []);
}

function normalizeName(name) {
  return String(name || '').trim().replace(/\s+/g, ' ').toLowerCase();
}

// Every handler wrapped so ANY unexpected error returns a 500 instead of
// crashing the whole server.
function safe(handler) {
  return (req, res, next) => {
    try {
      handler(req, res, next);
    } catch (err) {
      console.error('teachers-attendance-api error:', err);
      if (!res.headersSent) res.status(500).json({ error: 'Internal server error.' });
    }
  };
}

// API to add session form data to teachers attendance
router.post('/api/session-form-to-attendance', safe((req, res) => {
  const data = readData();
  const session = req.body;
  // Map session form data to attendance format
  const attendanceRecord = {
    id: session.id || `session_${Math.random().toString(36).slice(2, 10)}`,
    teacherName: session.teacherName,
    date: session.date,
    schoolName: session.schoolName,
    grade: session.grade,
    timeWindow: session.timeWindow,
    subject: session.subject,
    classroom: session.classroom,
    type: session.type,
    students: session.students || []
  };
  data.push(attendanceRecord);
  writeData(data);
  res.status(201).json(attendanceRecord);
}));

// GET all attendance records
router.get('/api/teachers-attendance', safe((req, res) => {
  const allRecords = readData();

  // Teacher portal scoped mode: only return logs for the authenticated teacher identity.
  if (String(req.query.mine) === '1') {
    const teacherId = req.query.teacherId || req.headers['x-teacher-id'];
    const teacherName = req.query.teacherName || req.headers['x-teacher-name'];
    const allowedNames = new Set();

    if (teacherId) {
      const teacher = readTeachers().find(t => String(t.id) === String(teacherId));
      if (teacher && teacher.firstName && teacher.lastName) {
        allowedNames.add(normalizeName(`${teacher.firstName} ${teacher.lastName}`));
      }
    }

    if (teacherName) {
      allowedNames.add(normalizeName(teacherName));
    }

    if (!allowedNames.size) {
      return res.json([]);
    }

    const mine = allRecords.filter(record => {
      const recordTeacherName = normalizeName(record.teacherName || record.createdBy);
      return recordTeacherName && allowedNames.has(recordTeacherName);
    });

    return res.json(mine);
  }

  res.json(allRecords);
}));

// POST new attendance record
router.post('/api/teachers-attendance', safe((req, res) => {
  const data = readData();
  const newRecord = { ...req.body };
  // When undoing a delete, restore the record at its original position so it
  // does not jump to the bottom of the list.
  const restoreIdx = Number(newRecord._restoreIndex);
  delete newRecord._restoreIndex;
  if (Number.isInteger(restoreIdx) && restoreIdx >= 0 && restoreIdx < data.length) {
    data.splice(restoreIdx, 0, newRecord);
  } else {
    data.push(newRecord);
  }
  writeData(data);
  res.status(201).json(newRecord);
}));

// DELETE attendance record by id
router.delete('/api/teachers-attendance/:id', safe((req, res) => {
  let data = readData();
  const { id } = req.params;
  const initialLength = data.length;
  data = data.filter(r => r.id !== id);
  if (data.length === initialLength) {
    return res.status(404).json({ error: 'Not found' });
  }
  writeData(data);
  res.json({ success: true });
}));

export default router;
