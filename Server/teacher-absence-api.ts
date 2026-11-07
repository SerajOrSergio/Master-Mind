import express from 'express';
import fs from 'fs';
import path from 'path';
import { readJson, writeJson } from './json-store';
import { dbDir } from './paths';
// teacher-absence-api.js
// API for teacher absence logs
const router = express.Router();

const LOGS_PATH = path.join(dbDir(), 'teacher-absence-logs.json');

// Get all teacher absences
router.get('/', (req, res) => {
  // Self-healing read: missing or corrupt file returns [] (no 500, no crash)
  res.json(readJson(LOGS_PATH, []));
});

// Add or replace all teacher absences (bulk save)
router.post('/', (req, res) => {
  const logs = req.body;
  if (!Array.isArray(logs)) return res.status(400).json({ error: 'Invalid data' });
  try {
    writeJson(LOGS_PATH, logs);
    res.json({ success: true });
  } catch (err) {
    console.error('Failed to save logs:', err);
    res.status(500).json({ error: 'Failed to save logs' });
  }
});

// Add a single teacher absence (when undoing a delete, restore it at its
// original position; otherwise new absences go to the top).
router.post('/add', (req, res) => {
  const log = { ...req.body };
  const restoreIdx = Number(log._restoreIndex);
  delete log._restoreIndex;
  let logs = readJson(LOGS_PATH, []);
  if (Number.isInteger(restoreIdx) && restoreIdx >= 0 && restoreIdx < logs.length) {
    logs.splice(restoreIdx, 0, log);
  } else {
    logs.unshift(log);
  }
  try {
    writeJson(LOGS_PATH, logs);
    res.json({ success: true });
  } catch (err) {
    console.error('Failed to save log:', err);
    res.status(500).json({ error: 'Failed to save log' });
  }
});

// Delete a teacher absence log by id
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  let logs = readJson(LOGS_PATH, []);
  const initialLength = logs.length;
  logs = logs.filter(l => String(l.id) !== String(id));
  if (logs.length === initialLength) return res.status(404).json({ error: 'Log not found' });
  try {
    writeJson(LOGS_PATH, logs);
    res.json({ success: true });
  } catch (err) {
    console.error('Failed to delete log:', err);
    res.status(500).json({ error: 'Failed to delete log' });
  }
});

export default router;
