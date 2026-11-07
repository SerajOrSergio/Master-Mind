import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { readJson, writeJson } from './json-store';
import { dbDir } from './paths';
// Student Materials API — per-student class material files.
// An entry holds the student's info (auto-filled from the students database
// on the front end) plus a list of uploaded material files on disk.
// Files are stored under: database/student-materials/<entryId>/<file>

const materialsFile = path.join(dbDir(), 'student-materials.json');
const uploadsRoot = path.join(dbDir(), 'student-materials');

// --- File upload storage -------------------------------------------------
// Files land in uploadsRoot/<entryId>/<timestamp>-<sanitized name> so names
// never collide and always map to exactly one entry. The JSON record keeps
// both the friendly display name and this unique stored name.
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const entryDir = path.join(uploadsRoot, String(req.params.id));
    fs.mkdirSync(entryDir, { recursive: true });
    cb(null, entryDir);
  },
  filename: (req, file, cb) => {
    const clean = String(file.originalname || 'file').replace(/[\\/:*?"<>|]/g, '_');
    cb(null, `${Date.now()}-${clean}`);
  }
});
const upload = multer({ storage, limits: { files: 20, fileSize: 50 * 1024 * 1024 } });

export default function (app) {
  // Get all student material entries (oldest first)
  app.get('/api/student-materials', (req, res) => {
    try {
      const entries = readJson(materialsFile, []);
      entries.sort((a, b) => a.id - b.id);
      res.json(entries);
    } catch (err) {
      res.status(500).json({ error: 'Failed to load student materials.' });
    }
  });

  // Create a new student material entry
  app.post('/api/student-materials', (req, res) => {
    try {
      const entries = readJson(materialsFile, []);
      const maxId = entries.length > 0 ? Math.max(...entries.map(e => e.id)) : 0;
      let newId = maxId + 1;
      const requestedId = Number(req.body.id);
      // Reuse a provided free id so the undo button restores deleted entries
      // with their original id
      if (Number.isInteger(requestedId) && requestedId > 0 && !entries.some(e => e.id === requestedId)) {
        newId = requestedId;
      }
      const newEntry = {
        id: newId,
        studentId: req.body.studentId === undefined || req.body.studentId === '' ? null : Number(req.body.studentId),
        studentName: req.body.studentName || '',
        phoneNumber: req.body.phoneNumber || '',
        gradeLevel: req.body.gradeLevel || '',
        curriculum: req.body.curriculum || '',
        subjects: Array.isArray(req.body.subjects) ? req.body.subjects : [],
        materials: []
      };
      // When undoing a delete, restore the entry at its original position
      // so it does not jump to the bottom of the list.
      const restoreIdx = Number(req.body._restoreIndex);
      if (Number.isInteger(restoreIdx) && restoreIdx >= 0 && restoreIdx < entries.length) {
        entries.splice(restoreIdx, 0, newEntry);
      } else {
        entries.push(newEntry);
      }
      writeJson(materialsFile, entries);
      res.json(newEntry);
    } catch (err) {
      res.status(500).json({ error: 'Failed to add student material.', details: err.message });
    }
  });

  // Get a single entry (used to snapshot before an edit/delete for undo)
  app.get('/api/student-materials/:id', (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const entries = readJson(materialsFile, []);
      const entry = entries.find(e => e.id === id);
      if (!entry) return res.status(404).json({ error: 'Student material not found.' });
      res.json(entry);
    } catch (err) {
      res.status(500).json({ error: 'Failed to load student material.', details: err.message });
    }
  });

  // Update an entry (inline edit of the text fields)
  app.put('/api/student-materials/:id', (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const entries = readJson(materialsFile, []);
      const idx = entries.findIndex(e => e.id === id);
      if (idx === -1) return res.status(404).json({ error: 'Student material not found.' });
      const allowed = ['studentName', 'phoneNumber', 'gradeLevel', 'curriculum'];
      for (const key of allowed) {
        if (req.body[key] !== undefined) {
          entries[idx][key] = req.body[key];
        }
      }
      if (Object.prototype.hasOwnProperty.call(req.body, 'subjects')) {
        entries[idx].subjects = Array.isArray(req.body.subjects) ? req.body.subjects : [];
      }
      writeJson(materialsFile, entries);
      res.json(entries[idx]);
    } catch (err) {
      res.status(500).json({ error: 'Failed to update student material.', details: err.message });
    }
  });

  // Upload one or more material files to an entry (multipart field "files")
  app.post('/api/student-materials/:id/files', upload.array('files', 20), (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const entries = readJson(materialsFile, []);
      const idx = entries.findIndex(e => e.id === id);
      if (idx === -1) return res.status(404).json({ error: 'Student material not found.' });
      const files = req.files || [];
      if (files.length === 0) return res.status(400).json({ error: 'No files were uploaded.' });
      files.forEach(f => {
        entries[idx].materials.push({
          name: f.originalname,
          storedName: f.filename,
          size: f.size,
          addedAt: new Date().toISOString()
        });
      });
      writeJson(materialsFile, entries);
      res.json(entries[idx]);
    } catch (err) {
      res.status(500).json({ error: 'Failed to upload material files.', details: err.message });
    }
  });

  // Download / open a single material file
  app.get('/api/student-materials/:id/files/:index/download', (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const index = parseInt(req.params.index);
      const entries = readJson(materialsFile, []);
      const entry = entries.find(e => e.id === id);
      if (!entry) return res.status(404).json({ error: 'Student material not found.' });
      const material = (entry.materials || [])[index];
      if (!material) return res.status(404).json({ error: 'Material file not found.' });
      // storedName is server-generated (timestamp-s*) — no path traversal
      const filePath = path.join(uploadsRoot, String(id), material.storedName);
      if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File missing on disk.' });
      res.download(filePath, material.name);
    } catch (err) {
      res.status(500).json({ error: 'Failed to download material file.', details: err.message });
    }
  });

  // Remove a single material file (by its index in the entry's list)
  app.delete('/api/student-materials/:id/files/:index', (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const index = parseInt(req.params.index);
      const entries = readJson(materialsFile, []);
      const idx = entries.findIndex(e => e.id === id);
      if (idx === -1) return res.status(404).json({ error: 'Student material not found.' });
      const materials = entries[idx].materials || [];
      if (index < 0 || index >= materials.length) {
        return res.status(404).json({ error: 'Material file not found.' });
      }
      const [removed] = materials.splice(index, 1);
      writeJson(materialsFile, entries);
      // Best-effort disk cleanup — the record is already gone either way
      if (removed && removed.storedName) {
        const filePath = path.join(uploadsRoot, String(id), removed.storedName);
        fs.promises.unlink(filePath).catch(() => {});
      }
      res.json({ success: true, entry: entries[idx] });
    } catch (err) {
      res.status(500).json({ error: 'Failed to remove material file.', details: err.message });
    }
  });

  // Delete an entire entry (and its uploaded files on disk)
  app.delete('/api/student-materials/:id', (req, res) => {
    try {
      const id = parseInt(req.params.id);
      let entries = readJson(materialsFile, []);
      const initialLength = entries.length;
      entries = entries.filter(e => e.id !== id);
      if (entries.length === initialLength) {
        return res.status(404).json({ error: 'Student material not found.' });
      }
      writeJson(materialsFile, entries);
      // Best-effort disk cleanup of the whole entry folder
      fs.promises.rm(path.join(uploadsRoot, String(id)), { recursive: true, force: true }).catch(() => {});
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete student material.', details: err.message });
    }
  });
};
