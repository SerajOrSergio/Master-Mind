import express from 'express';
import fs from 'fs';
import path from 'path';
import { readJson, writeJson } from './json-store';
import { dbDir } from './paths';

const router = express.Router();

const sessionDraftFile = path.join(dbDir(), 'teacher-portal/session-draft.json');

// Get all drafts (admin/logged-out view)
router.get('/api/session-draft-all', (req, res) => {
  let drafts = [];
  try {
    drafts = readJson(sessionDraftFile, []);
  } catch (e) {}
  res.json(drafts);
});

// Save or update a draft for a teacher
router.post('/api/session-draft', (req, res) => {
  const { teacherId, draft } = req.body;
  // When undoing a delete, restore the draft at its original position so it
  // does not jump to the bottom of the list.
  const restoreIdx = Number(req.body._restoreIndex);
  console.log('[session-draft] POST /api/session-draft', { teacherId, draft });
  if (!teacherId || !draft) {
    console.log('[session-draft] Missing teacherId or draft');
    return res.status(400).json({ error: 'Missing teacherId or draft.' });
  }
  let drafts = [];
  try {
    drafts = readJson(sessionDraftFile, []);
  } catch (e) {
    console.log('[session-draft] Could not read file, initializing new drafts array.', e);
  }
  // Unique key: teacherId + date + subject + classroom + timeSlots
  const draftKey = (d) => `${d.teacherId}__${d.draft.date}__${d.draft.subject}__${d.draft.classroom}__${(d.draft.timeSlots||[]).join(',')}`;
  const newKey = `${teacherId}__${draft.date}__${draft.subject}__${draft.classroom}__${(draft.timeSlots||[]).join(',')}`;
  let found = false;
  drafts = drafts.map(existing => {
    if (draftKey(existing) === newKey) {
      found = true;
      // Merge all students and their data into the existing draft (no duplicates)
      const mergedDraft = JSON.parse(JSON.stringify(existing.draft));
      // Always treat draft.students as an array (could be one or more)
      const newStudents = Array.isArray(draft.students) ? draft.students : [draft.students];
      mergedDraft.students = Array.isArray(mergedDraft.students) ? mergedDraft.students : [];
      // Add/update student: if not present, add; if present, update their data only (no duplicate)
      newStudents.forEach(s => {
        if (!mergedDraft.students.includes(s)) {
          mergedDraft.students.push(s);
        }
        // Always update/merge the new student's data
        if (draft.hours && draft.hours[s] !== undefined) {
          mergedDraft.hours = mergedDraft.hours || {};
          mergedDraft.hours[s] = draft.hours[s];
        }
        if (draft.grades && draft.grades[s] !== undefined) {
          mergedDraft.grades = mergedDraft.grades || {};
          mergedDraft.grades[s] = draft.grades[s];
        }
        if (draft.participation && draft.participation[s] !== undefined) {
          mergedDraft.participation = mergedDraft.participation || {};
          mergedDraft.participation[s] = draft.participation[s];
        }
        if (draft.absentFlags && draft.absentFlags[s] !== undefined) {
          mergedDraft.absentFlags = mergedDraft.absentFlags || {};
          mergedDraft.absentFlags[s] = draft.absentFlags[s];
        }
        if (draft.draftFlags && draft.draftFlags[s] !== undefined) {
          mergedDraft.draftFlags = mergedDraft.draftFlags || {};
          mergedDraft.draftFlags[s] = draft.draftFlags[s];
        }
      });
      // Final deduplication: ensure students array and all data fields are unique and up-to-date
      mergedDraft.students = [...new Set(mergedDraft.students)];
      // Remove any accidental duplicate keys in data fields
      ['hours','grades','participation','absentFlags','draftFlags'].forEach(field => {
        if (mergedDraft[field]) {
          const unique = {};
          for (const k of Object.keys(mergedDraft[field])) {
            unique[k] = mergedDraft[field][k];
          }
          mergedDraft[field] = unique;
        }
      });
      // Optionally merge note if needed (not per-student in this model)
      mergedDraft.lastUpdate = draft.lastUpdate;
      return { teacherId, draft: mergedDraft };
    }
    return existing;
  });
  if (!found) {
    if (Number.isInteger(restoreIdx) && restoreIdx >= 0 && restoreIdx < drafts.length) {
      drafts.splice(restoreIdx, 0, { teacherId, draft });
    } else {
      drafts.push({ teacherId, draft });
    }
  }
  try {
    writeJson(sessionDraftFile, drafts);
    console.log('[session-draft] Draft written to file:', sessionDraftFile);
    console.log('[session-draft] Current working directory:', process.cwd());
    console.log('[session-draft] Absolute file exists:', fs.existsSync(sessionDraftFile));
  } catch (err) {
    console.error('[session-draft] Error writing draft file:', err);
    return res.status(500).json({ error: 'Failed to write draft file.' });
  }
  res.json({ success: true });
});

// Get all drafts for a teacher (as array)
router.get('/api/session-draft/:teacherId', (req, res) => {
  const teacherId = req.params.teacherId;
  let drafts = [];
  try {
    drafts = readJson(sessionDraftFile, []);
  } catch (e) {}
  const found = drafts.filter(d => String(d.teacherId) === String(teacherId));
  res.json(found);
});

// Delete a specific draft for a teacher by unique key
router.delete('/api/session-draft/:teacherId/:date/:subject/:classroom/:timeSlots', (req, res) => {
  const { teacherId, date, subject, classroom, timeSlots } = req.params;
  let drafts = [];
  try {
    drafts = readJson(sessionDraftFile, []);
  } catch (e) {}
  const keyToDelete = `${teacherId}__${date}__${subject}__${classroom}__${timeSlots}`;
  const draftKey = (d) => `${d.teacherId}__${d.draft.date}__${d.draft.subject}__${d.draft.classroom}__${(d.draft.timeSlots||[]).join(',')}`;
  const newDrafts = drafts.filter(d => draftKey(d) !== keyToDelete);
  writeJson(sessionDraftFile, newDrafts);
  res.json({ success: true });
});

export default router;
