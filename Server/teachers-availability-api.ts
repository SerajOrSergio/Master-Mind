import fs from 'fs';
import path from 'path';
import { readJson, writeJson } from './json-store';
import { dbDir } from './paths';
const availabilityFile = path.join(dbDir(), 'teachers-availability.json');

export default function (app) {
  // Get a single teacher availability by ID
  app.get('/api/teachers-availability/:id', (req, res) => {
    try {
      const id = parseInt(req.params.id);
      let availabilities = readJson(availabilityFile, []);
      const found = availabilities.find(a => a.id === id);
      if (!found) return res.status(404).json({ error: 'Availability not found.' });
      res.json(found);
    } catch (err) {
      res.status(500).json({ error: 'Failed to load teacher availability.', details: err.message });
    }
  });
  // Get all teacher availabilities
  app.get('/api/teachers-availability', (req, res) => {
    try {
      let availabilities = readJson(availabilityFile, []);
      availabilities.sort((a, b) => a.id - b.id);
      res.json(availabilities);
    } catch (err) {
      res.status(500).json({ error: 'Failed to load teacher availabilities.' });
    }
  });

  // Add a teacher availability
  app.post('/api/teachers-availability', (req, res) => {
    try {
      const entry = req.body;
      // Accept subject as array or string, always store as array
      if (!entry.teacherId || !entry.teacherName || !entry.subject || !entry.gradeFrom || !entry.gradeTo || !entry.weeklySchedule) {
        return res.status(400).json({ error: 'Missing required fields.' });
      }
      if (!('note' in entry)) entry.note = '';
      // Normalize subject to array
      if (typeof entry.subject === 'string') {
        entry.subject = [entry.subject];
      } else if (!Array.isArray(entry.subject)) {
        entry.subject = [];
      }
      let availabilities = readJson(availabilityFile, []);
      let nextId = 1;
      if (availabilities.length > 0) {
        nextId = Math.max(...availabilities.map(a => a.id)) + 1;
      }
      entry.id = nextId;
      availabilities.push(entry);
      writeJson(availabilityFile, availabilities);
      res.json(entry);
    } catch (err) {
      res.status(500).json({ error: 'Failed to add teacher availability.', details: err.message });
    }
  });

  // Update a teacher availability
  app.put('/api/teachers-availability/:id', (req, res) => {
    try {
      const id = parseInt(req.params.id);
      let availabilities = readJson(availabilityFile, []);
      const idx = availabilities.findIndex(a => a.id === id);
      if (idx === -1) return res.status(404).json({ error: 'Availability not found.' });
      // Normalize subject to array
      let update = req.body;
      if (typeof update.subject === 'string') {
        update.subject = [update.subject];
      } else if (!Array.isArray(update.subject)) {
        update.subject = [];
      }
      // Only allow update if weeklySchedule is present
      if (!update.weeklySchedule) {
        return res.status(400).json({ error: 'Missing weeklySchedule.' });
      }
      Object.assign(availabilities[idx], update);
      writeJson(availabilityFile, availabilities);
      res.json(availabilities[idx]);
    } catch (err) {
      res.status(500).json({ error: 'Failed to update teacher availability.', details: err.message });
    }
  });

  // Delete a teacher availability
  app.delete('/api/teachers-availability/:id', (req, res) => {
    try {
      const id = parseInt(req.params.id);
      let availabilities = readJson(availabilityFile, []);
      const initialLength = availabilities.length;
      availabilities = availabilities.filter(a => a.id !== id);
      if (availabilities.length === initialLength) {
        return res.status(404).json({ error: 'Availability not found.' });
      }
      writeJson(availabilityFile, availabilities);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete teacher availability.', details: err.message });
    }
  });
};
