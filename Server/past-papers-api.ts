import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { readJson, writeJson } from './json-store';
import { dbDir } from './paths';
// Past Papers API — per-student past paper files, built the same way as the
// student materials API: an entry holds the student's info (auto-filled from
// the students database on the front end), the price / amount due / paid
// amounts and a list of uploaded paper files on disk.
// Files are stored under: database/past-papers/<entryId>/<file>

const papersFile = path.join(dbDir(), 'past-papers.json');
const uploadsRoot = path.join(dbDir(), 'past-papers');

// Money fields are stored as numbers, or null when left empty.
const MONEY_FIELDS = ['price', 'amountDue', 'paidAmount'];

function numOrNull(value) {
  if (value === undefined || value === null || String(value).trim() === '') return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

// --- File upload storage -------------------------------------------------
// Files land in uploadsRoot/<entryId>/<timestamp>-<sanitized name> so names
// never collide and always map to exactly one entry.
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
  // Get all past paper entries (oldest first)
  app.get('/api/past-papers', (req, res) => {
    try {
      const entries = readJson(papersFile, []);
      entries.sort((a, b) => a.id - b.id);
      res.json(entries);
    } catch (err) {
      res.status(500).json({ error: 'Failed to load past papers.' });
    }
  });

  // Create a new past paper entry
  app.post('/api/past-papers', (req, res) => {
    try {
      const entries = readJson(papersFile, []);
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
        emailAddress: req.body.emailAddress || '',
        curriculum: req.body.curriculum || '',
        gradeLevel: req.body.gradeLevel || '',
        price: numOrNull(req.body.price),
        amountDue: numOrNull(req.body.amountDue),
        paidAmount: numOrNull(req.body.paidAmount),
        files: []
      };
      // When undoing a delete, restore the entry at its original position
      // so it does not jump to the bottom of the list.
      const restoreIdx = Number(req.body._restoreIndex);
      if (Number.isInteger(restoreIdx) && restoreIdx >= 0 && restoreIdx < entries.length) {
        entries.splice(restoreIdx, 0, newEntry);
      } else {
        entries.push(newEntry);
      }
      writeJson(papersFile, entries);
      res.json(newEntry);
    } catch (err) {
      res.status(500).json({ error: 'Failed to add past paper.', details: err.message });
    }
  });

  // Get a single entry (used to snapshot before an edit/delete for undo)
  app.get('/api/past-papers/:id', (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const entries = readJson(papersFile, []);
      const entry = entries.find(e => e.id === id);
      if (!entry) return res.status(404).json({ error: 'Past paper not found.' });
      res.json(entry);
    } catch (err) {
      res.status(500).json({ error: 'Failed to load past paper.', details: err.message });
    }
  });

  // Update an entry (inline edit of the table cells)
  app.put('/api/past-papers/:id', (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const entries = readJson(papersFile, []);
      const idx = entries.findIndex(e => e.id === id);
      if (idx === -1) return res.status(404).json({ error: 'Past paper not found.' });
      const allowed = ['studentName', 'phoneNumber', 'emailAddress', 'curriculum', 'gradeLevel'];
      for (const key of allowed) {
        if (req.body[key] !== undefined) {
          entries[idx][key] = req.body[key];
        }
      }
      for (const key of MONEY_FIELDS) {
        if (req.body[key] !== undefined) {
          entries[idx][key] = numOrNull(req.body[key]);
        }
      }
      writeJson(papersFile, entries);
      res.json(entries[idx]);
    } catch (err) {
      res.status(500).json({ error: 'Failed to update past paper.', details: err.message });
    }
  });

  // Upload one or more past paper files to an entry (multipart field "files")
  app.post('/api/past-papers/:id/files', upload.array('files', 20), (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const entries = readJson(papersFile, []);
      const idx = entries.findIndex(e => e.id === id);
      if (idx === -1) return res.status(404).json({ error: 'Past paper not found.' });
      const files = req.files || [];
      if (files.length === 0) return res.status(400).json({ error: 'No files were uploaded.' });
      if (!Array.isArray(entries[idx].files)) entries[idx].files = [];
      files.forEach(f => {
        entries[idx].files.push({
          name: f.originalname,
          storedName: f.filename,
          size: f.size,
          addedAt: new Date().toISOString()
        });
      });
      writeJson(papersFile, entries);
      res.json(entries[idx]);
    } catch (err) {
      res.status(500).json({ error: 'Failed to upload past paper files.', details: err.message });
    }
  });

  // Download / open a single past paper file
  app.get('/api/past-papers/:id/files/:index/download', (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const index = parseInt(req.params.index);
      const entries = readJson(papersFile, []);
      const entry = entries.find(e => e.id === id);
      if (!entry) return res.status(404).json({ error: 'Past paper not found.' });
      const paper = (entry.files || [])[index];
      if (!paper) return res.status(404).json({ error: 'Past paper file not found.' });
      // storedName is server-generated (timestamp-name) — no path traversal
      const filePath = path.join(uploadsRoot, String(id), paper.storedName);
      if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File missing on disk.' });
      res.download(filePath, paper.name);
    } catch (err) {
      res.status(500).json({ error: 'Failed to download past paper file.', details: err.message });
    }
  });

  // Remove a single past paper file (by its index in the entry's list)
  app.delete('/api/past-papers/:id/files/:index', (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const index = parseInt(req.params.index);
      const entries = readJson(papersFile, []);
      const idx = entries.findIndex(e => e.id === id);
      if (idx === -1) return res.status(404).json({ error: 'Past paper not found.' });
      const files = entries[idx].files || [];
      if (index < 0 || index >= files.length) {
        return res.status(404).json({ error: 'Past paper file not found.' });
      }
      const [removed] = files.splice(index, 1);
      writeJson(papersFile, entries);
      // Best-effort disk cleanup — the record is already gone either way
      if (removed && removed.storedName) {
        const filePath = path.join(uploadsRoot, String(id), removed.storedName);
        fs.promises.unlink(filePath).catch(() => {});
      }
      res.json({ success: true, entry: entries[idx] });
    } catch (err) {
      res.status(500).json({ error: 'Failed to remove past paper file.', details: err.message });
    }
  });

  // Delete an entire entry (and its uploaded files on disk)
  app.delete('/api/past-papers/:id', (req, res) => {
    try {
      const id = parseInt(req.params.id);
      let entries = readJson(papersFile, []);
      const initialLength = entries.length;
      entries = entries.filter(e => e.id !== id);
      if (entries.length === initialLength) {
        return res.status(404).json({ error: 'Past paper not found.' });
      }
      writeJson(papersFile, entries);
      fs.promises.rm(path.join(uploadsRoot, String(id)), { recursive: true, force: true }).catch(() => {});
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete past paper.', details: err.message });
    }
  });
};
