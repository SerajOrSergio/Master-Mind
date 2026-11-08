import fs from 'fs';
import path from 'path';
import { readJson, writeJson } from './json-store';
import { dbDir } from './paths';
import { syncPaymentsWithStudents } from './payments-sync';
const studentsFile = path.join(dbDir(), 'students.json');

export default function (app) {
  // --- Students API ---

  // Get all students
  app.get('/api/students', (req, res) => {
    try {
      let students = readJson(studentsFile, []);
      // Sort alphabetically by studentName (case-insensitive)
      students.sort((a, b) => (a.studentName || '').localeCompare(b.studentName || '', undefined, { sensitivity: 'base' }));
      res.json(students);
    } catch (err) {
      res.status(500).json({ error: 'Failed to load students.' });
    }
  });

  // Get a single student (used by the pages to snapshot a student before
  // deleting it, so the undo button can restore it)
  app.get('/api/students/:id', (req, res) => {
    try {
      const id = parseInt(req.params.id);
      let students = readJson(studentsFile, []);
      const student = students.find(s => s.id === id);
      if (!student) return res.status(404).json({ error: 'Student not found.' });
      res.json(student);
    } catch (err) {
      res.status(500).json({ error: 'Failed to load student.', details: err.message });
    }
  });

  // Add a new student
  app.post('/api/students', (req, res) => {
    try {
      console.log('POST /api/students called with body:', req.body);
      let students = readJson(studentsFile, []);
      const allowed = ['studentName', 'subjects', 'schoolName', 'curriculum', 'gradeLevel', 'notes', 'email', 'phoneNumber', 'parentName', 'parentPhone', 'discount'];
      // Generate new unique id (reuse a provided id when free, so undo can
      // restore a deleted student with its original id)
      let newId = students.length ? Math.max(...students.map(s => s.id)) + 1 : 1;
      const requestedId = Number(req.body.id);
      if (Number.isInteger(requestedId) && requestedId > 0 && !students.some(s => s.id === requestedId)) {
        newId = requestedId;
      }
      const newStudent: any = { id: newId };
      for (const key of allowed) {
        if (key === 'discount') {
          if (req.body.discount === null || req.body.discount === undefined || req.body.discount === '') {
            // Do not set discount field at all
          } else {
            newStudent.discount = Number(req.body.discount);
          }
        } else if (req.body[key] !== undefined) {
          newStudent[key] = req.body[key];
        }
      }
      if (!newStudent.studentName) {
        console.error('Student name is required.');
        return res.status(400).json({ error: 'Student name is required.' });
      }
      if (!Array.isArray(newStudent.subjects)) newStudent.subjects = [];
      students.push(newStudent);
      try {
        writeJson(studentsFile, students);
        console.log('Student added and written to file:', newStudent);
      } catch (fileErr) {
        console.error('Error writing to students.json:', fileErr);
        return res.status(500).json({ error: 'Failed to write to students.json', details: fileErr.message });
      }
      res.json(newStudent);
    } catch (err) {
      console.error('Error in POST /api/students:', err);
      res.status(500).json({ error: 'Failed to add student.', details: err.message });
    }
  });

  // Update a student (inline edit)
  app.put('/api/students/:id', (req, res) => {
    try {
      const id = parseInt(req.params.id);
      let students = readJson(studentsFile, []);
      const idx = students.findIndex(s => s.id === id);
      if (idx === -1) return res.status(404).json({ error: 'Student not found.' });
      const allowed = ['studentName', 'subjects', 'schoolName', 'curriculum', 'gradeLevel', 'notes', 'email', 'phoneNumber', 'parentName', 'parentPhone', 'discount'];
      for (const key of allowed) {
        if (key === 'discount') {
          // Remove if null, undefined, empty string, or not a valid number
          if (
            req.body.discount === null ||
            req.body.discount === undefined ||
            req.body.discount === '' ||
            isNaN(Number(req.body.discount))
          ) {
            delete students[idx].discount;
          } else {
            students[idx].discount = Number(req.body.discount);
          }
        } else if (req.body[key] !== undefined) {
          students[idx][key] = req.body[key];
        }
      }
      // Clean up: never allow discount as empty string in file
      if (students[idx].discount === '' || isNaN(Number(students[idx].discount))) {
        delete students[idx].discount;
      }
      writeJson(studentsFile, students);
      // A student edit must carry over to the payment rows that snapshot this
      // student (name, phone, discount, grade, school) so the Payments /
      // Partial / Unpaid / Paid pages show the new values on refresh.
      syncPaymentsWithStudents();
      res.json(students[idx]);
    } catch (err) {
      res.status(500).json({ error: 'Failed to update student.', details: err.message });
    }
  });

  // Delete a student
  app.delete('/api/students/:id', (req, res) => {
    try {
      const id = parseInt(req.params.id);
      let students = readJson(studentsFile, []);
      const initialLength = students.length;
      students = students.filter(s => s.id !== id);
      if (students.length === initialLength) {
        return res.status(404).json({ error: 'Student not found.' });
      }
      writeJson(studentsFile, students);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete student.', details: err.message });
    }
  });
};
