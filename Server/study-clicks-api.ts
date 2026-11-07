import path from 'path';
import { readJson, writeJson } from './json-store';
import { dbDir } from './paths';
// Study Clicks API — students who got study clicks (record with their name,
// phone, grade and paid amount; the creation date is stored automatically).
const studyClicksFile = path.join(dbDir(), 'study-clicks.json');

export default function (app) {
  // Get all study clicks (oldest first)
  app.get('/api/study-clicks', (req, res) => {
    try {
      const clicks = readJson(studyClicksFile, []);
      clicks.sort((a, b) => a.id - b.id);
      res.json(clicks);
    } catch (err) {
      res.status(500).json({ error: 'Failed to load study clicks.' });
    }
  });

  // Create a new study click entry
  app.post('/api/study-clicks', (req, res) => {
    try {
      let clicks = readJson(studyClicksFile, []);
      // Generate new unique id (reuse a provided id when free, so undo can
      // restore a deleted entry with its original id)
      const maxId = clicks.length > 0 ? Math.max(...clicks.map(c => c.id)) : 0;
      let newId = maxId + 1;
      const requestedId = Number(req.body.id);
      if (Number.isInteger(requestedId) && requestedId > 0 && !clicks.some(c => c.id === requestedId)) {
        newId = requestedId;
      }
      const newEntry = {
        id: newId,
        studentName: req.body.studentName || '',
        phoneNumber: req.body.phoneNumber || '',
        emailAddress: req.body.emailAddress || '',
        gradeLevel: req.body.gradeLevel || '',
        paidAmount: req.body.paidAmount === undefined || req.body.paidAmount === '' ? null : Number(req.body.paidAmount),
        // Store the creation date automatically (keep an existing provided
        // dateCreated when restoring a deleted entry via undo)
        dateCreated: req.body.dateCreated || new Date().toISOString()
      };
      // When undoing a delete, restore the entry at its original position
      // so it does not jump to the bottom of the list.
      const restoreIdx = Number(req.body._restoreIndex);
      if (Number.isInteger(restoreIdx) && restoreIdx >= 0 && restoreIdx < clicks.length) {
        clicks.splice(restoreIdx, 0, newEntry);
      } else {
        clicks.push(newEntry);
      }
      writeJson(studyClicksFile, clicks);
      res.json(newEntry);
    } catch (err) {
      res.status(500).json({ error: 'Failed to add study click.', details: err.message });
    }
  });

  // Get a single entry (used to snapshot before an edit/delete for undo)
  app.get('/api/study-clicks/:id', (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const clicks = readJson(studyClicksFile, []);
      const entry = clicks.find(c => c.id === id);
      if (!entry) return res.status(404).json({ error: 'Study click not found.' });
      res.json(entry);
    } catch (err) {
      res.status(500).json({ error: 'Failed to load study click.', details: err.message });
    }
  });

  // Update an entry (inline edit)
  app.put('/api/study-clicks/:id', (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const clicks = readJson(studyClicksFile, []);
      const idx = clicks.findIndex(c => c.id === id);
      if (idx === -1) return res.status(404).json({ error: 'Study click not found.' });
      const allowed = ['studentName', 'phoneNumber', 'emailAddress', 'gradeLevel', 'paidAmount', 'dateCreated'];
      for (const key of allowed) {
        if (req.body[key] === undefined) continue;
        if (key === 'paidAmount' && (req.body[key] === null || req.body[key] === '')) {
          clicks[idx].paidAmount = null;
        } else {
          clicks[idx][key] = key === 'paidAmount' ? Number(req.body[key]) : req.body[key];
        }
      }
      // The creation date never changes on edit — it is fixed at creation.
      writeJson(studyClicksFile, clicks);
      res.json(clicks[idx]);
    } catch (err) {
      res.status(500).json({ error: 'Failed to update study click.', details: err.message });
    }
  });

  // Delete an entry
  app.delete('/api/study-clicks/:id', (req, res) => {
    try {
      const id = parseInt(req.params.id);
      let clicks = readJson(studyClicksFile, []);
      const initialLength = clicks.length;
      clicks = clicks.filter(c => c.id !== id);
      if (clicks.length === initialLength) {
        return res.status(404).json({ error: 'Study click not found.' });
      }
      writeJson(studyClicksFile, clicks);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete study click.', details: err.message });
    }
  });
};
