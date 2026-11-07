import express from 'express';
import fs from 'fs';
import path from 'path';
import { readJson, writeJson } from './json-store';
import { dbDir } from './paths';
// classrooms-api.js
// API for managing classrooms and their colors

const router = express.Router();
// Safe JSON DB access: corrupt files self-heal, writes are atomic.

function getNextClassroomId(classrooms) {
  if (!Array.isArray(classrooms) || classrooms.length === 0) {
    return 1;
  }

  return Math.max(...classrooms.map(c => c.id)) + 1;
}

// PATCH reorder classrooms
router.patch('/api/classrooms/reorder', (req, res) => {
  const { order } = req.body;
  if (!Array.isArray(order)) {
    return res.status(400).json({ error: 'Missing or invalid order array' });
  }
  const settings = readSettings();
  const classrooms = settings.classrooms || [];

  // Map classrooms by id (normalized to string) so the string ids sent by the
  // client always match the numeric ids stored in the database.
  const idToClassroom = new Map(classrooms.map(c => [String(c.id), c]));

  // Build the reordered list from the order array, skipping duplicate ids and
  // unknown ids. Then append any classrooms that were not listed, so the total
  // number of classrooms can never grow and duplicates are healed.
  const seen = new Set();
  const newClassrooms = [];
  for (const id of order) {
    const key = String(id);
    if (seen.has(key)) continue;
    seen.add(key);
    const classroom = idToClassroom.get(key);
    if (classroom) newClassrooms.push(classroom);
  }
  for (const c of classrooms) {
    const key = String(c.id);
    if (!seen.has(key)) {
      seen.add(key);
      newClassrooms.push(c);
    }
  }

  settings.classrooms = newClassrooms;
  writeSettings(settings);
  syncClassroomDefinitions(settings.classrooms);
  res.json(settings.classrooms);
});

const SETTINGS_PATH = path.join(dbDir(), 'settings.json');

// Helper to read settings.json (self-healing + atomic-safe)
function readSettings() {
  return readJson(SETTINGS_PATH, { classrooms: [] });
}

// Helper to write settings.json (atomic)
function writeSettings(data) {
  writeJson(SETTINGS_PATH, data);
}

const CLASSES_PATH = path.join(dbDir(), 'classes.json');

// Read classes.json (class definitions + reservations).
function readClassesFile() {
  return readJson(CLASSES_PATH, []);
}

// Write classes.json.
function writeClassesFile(data) {
  writeJson(CLASSES_PATH, data);
}

// Keep database/classes.json in sync with the classroom definitions managed in
// Settings -> Manage Classrooms. The Classes page reads its classroom list from
// classes.json, so definitions are mirrored here (reservations are preserved).
function syncClassroomDefinitions(classrooms) {
  try {
    const current = readClassesFile();
    const reservations = (Array.isArray(current) ? current : []).filter(e => e && !e.classroom_name);
    writeClassesFile([...classrooms, ...reservations]);
  } catch (err) {
    console.error('Failed to sync classes.json:', err.message);
  }
}

// GET all classrooms
router.get('/api/classrooms', (req, res) => {
  const settings = readSettings();
  res.json(settings.classrooms || []);
});

// POST add a new classroom
router.post('/api/classrooms', (req, res) => {
  const { classroom_name, color } = req.body;
  if (!classroom_name || !color) {
    return res.status(400).json({ error: 'Missing classroom_name or color' });
  }
  const settings = readSettings();
  const newId = getNextClassroomId(settings.classrooms);
  const newClassroom = { id: newId, classroom_name, color };
  settings.classrooms = settings.classrooms || [];
  settings.classrooms.push(newClassroom);
  writeSettings(settings);
  syncClassroomDefinitions(settings.classrooms);
  res.json(newClassroom);
});

// PUT update a classroom
router.put('/api/classrooms/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { classroom_name, color } = req.body;
  const settings = readSettings();
  const idx = settings.classrooms.findIndex(c => c.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Classroom not found' });
  if (classroom_name) settings.classrooms[idx].classroom_name = classroom_name;
  if (color) settings.classrooms[idx].color = color;
  writeSettings(settings);
  syncClassroomDefinitions(settings.classrooms);
  res.json(settings.classrooms[idx]);
});

// DELETE a classroom
router.delete('/api/classrooms/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const settings = readSettings();
  const idx = settings.classrooms.findIndex(c => c.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Classroom not found' });
  const removed = settings.classrooms.splice(idx, 1);
  writeSettings(settings);
  syncClassroomDefinitions(settings.classrooms);
  res.json(removed[0]);
});

// GET dark mode setting
router.get('/api/settings/dark-mode', (req, res) => {
  const settings = readSettings();
  res.json({ darkMode: settings.darkMode || false });
});

// PUT update dark mode setting
router.put('/api/settings/dark-mode', (req, res) => {
  const { darkMode } = req.body;
  if (typeof darkMode !== 'boolean') {
    return res.status(400).json({ error: 'darkMode must be a boolean' });
  }
  const settings = readSettings();
  settings.darkMode = darkMode;
  writeSettings(settings);
  res.json({ darkMode: settings.darkMode });
});

export default router;