import fs from 'fs';
import path from 'path';
import { readJson, writeJson } from './json-store';
import { dbDir } from './paths';
import { syncPaymentsWithStudents } from './payments-sync';
const teachersFile = path.join(dbDir(), 'teachers.json');

export default function (app) {
  // Create a new teacher
  app.post('/api/teachers', (req, res) => {
    try {
      let teachers = readJson(teachersFile, []);
      // Generate new unique id (reuse a provided id when free, so undo can
      // restore a deleted teacher with its original id)
      const maxId = teachers.length > 0 ? Math.max(...teachers.map(t => t.id)) : 0;
      let newId = maxId + 1;
      const requestedId = Number(req.body.id);
      if (Number.isInteger(requestedId) && requestedId > 0 && !teachers.some(t => t.id === requestedId)) {
        newId = requestedId;
      }
      const newTeacher: any = {
        id: newId,
        firstName: req.body.firstName || '',
        lastName: req.body.lastName || '',
        phoneNumber: req.body.phoneNumber || '',
        email: req.body.email || '',
        salary: req.body.salary || '',
        notes: req.body.notes || '',
        subjects: Array.isArray(req.body.subjects) ? req.body.subjects : [],
        password: req.body.password || '12345',
      };
      if (req.body.cutRate !== undefined && req.body.cutRate !== "") {
        newTeacher.cutRate = req.body.cutRate;
      }
      // When undoing a delete, restore the teacher at its original position
      // so it does not jump to the bottom of the list.
      const restoreIdx = Number(req.body._restoreIndex);
      if (Number.isInteger(restoreIdx) && restoreIdx >= 0 && restoreIdx < teachers.length) {
        teachers.splice(restoreIdx, 0, newTeacher);
      } else {
        teachers.push(newTeacher);
      }
      writeJson(teachersFile, teachers);
      res.json(newTeacher);
    } catch (err) {
      res.status(500).json({ error: 'Failed to add teacher.', details: err.message });
    }
  });

  // --- Teachers API ---
  // Get all teachers

  // Get all teachers
  app.get('/api/teachers', (req, res) => {
    try {
      let teachers = readJson(teachersFile, []);
      teachers.sort((a, b) => a.id - b.id);
      res.json(teachers);
    } catch (err) {
      res.status(500).json({ error: 'Failed to load teachers.' });
    }
  });

  // Get a single teacher (used by the pages to snapshot a teacher before
  // deleting it, so the undo button can restore it)
  app.get('/api/teachers/:id', (req, res) => {
    try {
      const id = parseInt(req.params.id);
      let teachers = readJson(teachersFile, []);
      const teacher = teachers.find(t => t.id === id);
      if (!teacher) return res.status(404).json({ error: 'Teacher not found.' });
      res.json(teacher);
    } catch (err) {
      res.status(500).json({ error: 'Failed to load teacher.', details: err.message });
    }
  });

  // Update teacher password
  app.put('/api/teachers/:id/password', (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { password } = req.body;
      if (!password || typeof password !== 'string' || password.length < 3) {
        return res.status(400).json({ error: 'Invalid password.' });
      }
      let teachers = readJson(teachersFile, []);
      const idx = teachers.findIndex(t => t.id === id);
      if (idx === -1) return res.status(404).json({ error: 'Teacher not found.' });
      teachers[idx].password = password;
      writeJson(teachersFile, teachers);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to update password.', details: err.message });
    }
  });

  // Update a teacher (inline edit)
  app.put('/api/teachers/:id', (req, res) => {
    try {
      const id = parseInt(req.params.id);
      let teachers = readJson(teachersFile, []);
      const idx = teachers.findIndex(t => t.id === id);
      if (idx === -1) return res.status(404).json({ error: 'Teacher not found.' });
      const allowed = ['firstName', 'lastName', 'phoneNumber', 'email', 'salary', 'notes', 'subjects', 'cutRate'];
      for (const key of allowed) {
        if (req.body[key] !== undefined) {
          teachers[idx][key] = req.body[key];
        }
      }
      writeJson(teachersFile, teachers);
      // A changed cut rate must reach the payment rows that are displayed on
      // the Payments / Paid / Partial / Unpaid pages (CUT RATE column).
      syncPaymentsWithStudents();
      res.json(teachers[idx]);
    } catch (err) {
      res.status(500).json({ error: 'Failed to update teacher.', details: err.message });
    }
  });

  // Reset teacher password
  app.put('/api/teachers/:id/reset-password', (req, res) => {
    try {
      const id = parseInt(req.params.id);
      let teachers = readJson(teachersFile, []);
      const idx = teachers.findIndex(t => t.id === id);
      if (idx === -1) return res.status(404).json({ error: 'Teacher not found.' });
      teachers[idx].password = '12345';
      writeJson(teachersFile, teachers);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to reset password.', details: err.message });
    }
  });

  // Delete a teacher
  app.delete('/api/teachers/:id', (req, res) => {
    try {
      const id = parseInt(req.params.id);
      let teachers = readJson(teachersFile, []);
      const initialLength = teachers.length;
      teachers = teachers.filter(t => t.id !== id);
      if (teachers.length === initialLength) {
        return res.status(404).json({ error: 'Teacher not found.' });
      }
      writeJson(teachersFile, teachers);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete teacher.', details: err.message });
    }
  });
};
