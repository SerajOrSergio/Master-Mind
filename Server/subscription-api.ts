import express from 'express';
import fs from 'fs';
import path from 'path';
import { readJson, writeJson } from './json-store';
import { dbDir } from './paths';
import { syncPaymentsWithStudents } from './payments-sync';
const router = express.Router();

const subscriptionFile = path.join(dbDir(), 'subscription.json');

// Subjects are compared case-insensitively so "English" and "english" count
// as the same subject when updating one student's subject subscription.
function normalizeSubject(subject) {
  return String(subject || '').trim().toLowerCase();
}

// Get all subscriptions
router.get('/api/subscriptions', (req, res) => {
  try {
    let subscriptions = [];
    if (fs.existsSync(subscriptionFile)) {
      subscriptions = readJson(subscriptionFile, []);
    }
    res.json(subscriptions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load subscriptions.' });
  }
});

// Add or update a subscription.
//
// A student can have MULTIPLE subscriptions — one per subject — so a record is
// matched by id first, then by studentFullName + subject, and only falls back
// to matching by name alone when the record has no subject (legacy/one-off
// records created by the payments page).
router.post('/api/subscriptions', (req, res) => {
  try {
    const sub = req.body;
    let subscriptions = [];
    if (fs.existsSync(subscriptionFile)) {
      subscriptions = readJson(subscriptionFile, []);
    }
    // Snapshot so a manual Reset (usage going DOWN) can be detected below.
    const beforeList = JSON.parse(JSON.stringify(subscriptions));
    // Handle delete: prefer per-record deletion (by id, or by student+subject)
    // so deleting one subject subscription leaves the student's other subject
    // subscriptions untouched. A delete without subject (payments page) still
    // removes ALL matching studentFullName records.
    if (sub.delete && sub.studentFullName) {
      const hasId = sub.id !== undefined && sub.id !== null && sub.id !== '';
      const hasSubject = sub.subject !== undefined && sub.subject !== null && String(sub.subject).trim() !== '';
      subscriptions = subscriptions.filter(s => {
        if (hasId) return String(s.id) !== String(sub.id);
        if (hasSubject) return !(s.studentFullName === sub.studentFullName && normalizeSubject(s.subject) === normalizeSubject(sub.subject));
        return s.studentFullName !== sub.studentFullName;
      });
      writeJson(subscriptionFile, subscriptions);
      // A student who just lost their subscription can fall back out of Paid,
      // so re-derive the payment statuses before answering.
      syncPaymentsWithStudents();
      return res.json({ success: true, subscriptions });
    }
    // Normal add/update
    // Allow special 'Subscribed' case: if type or usage or priceTag is empty or 'unlimited', allow it
    if (!sub.studentFullName || !sub.issueDate) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }
    // If priceTag/type/usage are empty, set to 'unlimited' for special case
    if (!sub.priceTag) sub.priceTag = 'unlimited';
    if (!sub.type) sub.type = 'unlimited';
    if (!sub.usage) sub.usage = 'unlimited';
    if (sub.subject === undefined || sub.subject === null) sub.subject = '';
    // Support renaming a student: when the client edits the Student name cell
    // it sends the original name as originalStudentFullName so the existing
    // record is found and updated in place instead of creating a duplicate.
    const lookupName = sub.originalStudentFullName || sub.studentFullName;
    const cleanSub = { ...sub };
    delete cleanSub.originalStudentFullName;
    // Every record gets a unique id so per-row delete and undo work cleanly,
    // even for legacy records created before subjects were introduced.
    if (!cleanSub.id) {
      let nextId = Date.now();
      while (subscriptions.some(s => String(s.id) === String(nextId))) nextId++;
      cleanSub.id = nextId;
    }
    // When undoing a delete, restore each row at its original position so it
    // does not jump to the bottom of the list. Prefer matching by unique id so
    // multiple rows for the same student are re-inserted, not merged.
    const restoreIdx = Number(sub._restoreIndex);
    delete cleanSub._restoreIndex;
    const hasId = sub.id !== undefined && sub.id !== null && sub.id !== '';
    const idIdx = hasId ? subscriptions.findIndex(s => String(s.id) === String(sub.id)) : -1;
    // Match by student + subject (case-insensitive) so the same student can
    // hold separate subscriptions for Math, English, etc.
    let matchIdx = -1;
    if (idIdx === -1 && normalizeSubject(cleanSub.subject) !== '') {
      matchIdx = subscriptions.findIndex(s =>
        s.studentFullName === lookupName && normalizeSubject(s.subject) === normalizeSubject(cleanSub.subject)
      );
    }
    if (idIdx >= 0) {
      subscriptions[idIdx] = { ...subscriptions[idIdx], ...cleanSub };
    } else if (matchIdx >= 0) {
      subscriptions[matchIdx] = { ...subscriptions[matchIdx], ...cleanSub };
    } else if (Number.isInteger(restoreIdx) && restoreIdx >= 0 && restoreIdx < subscriptions.length) {
      subscriptions.splice(restoreIdx, 0, cleanSub);
    } else {
      const idx = subscriptions.findIndex(s =>
        s.studentFullName === lookupName && normalizeSubject(cleanSub.subject) === '' &&
        normalizeSubject(s.subject) === ''
      );
      if (idx >= 0) {
        subscriptions[idx] = { ...subscriptions[idx], ...cleanSub };
      } else {
        subscriptions.push(cleanSub);
      }
    }
    // A usage Reset must also clear this student's "already counted" marks.
    // The log stops the same session counting twice, so after a reset the
    // sessions that were counted before it could never count again and the
    // usage stayed stuck at 0. Only a DOWNWARD move (an explicit reset) clears
    // entries, so normal edits never double count.
    try {
      const usedOf = (usage) => {
        const used = parseFloat(String(usage == null ? '' : usage).split('/')[0]);
        return isNaN(used) ? 0 : used;
      };
      const resetNames = new Set();
      subscriptions.forEach(s => {
        const prev = beforeList.find(b => String(b.id) === String(s.id));
        if (prev && usedOf(s.usage) < usedOf(prev.usage)) {
          resetNames.add(String(s.studentFullName || '').trim().toLowerCase());
        }
      });
      const usageLogPath = path.join(dbDir(), 'subscription-usage-log.json');
      if (resetNames.size && fs.existsSync(usageLogPath)) {
        const log = readJson(usageLogPath, []);
        const kept = log.filter(key => {
          const keyName = String(key).split('__')[1] || '';
          return !resetNames.has(keyName.trim().toLowerCase());
        });
        if (kept.length !== log.length) writeJson(usageLogPath, kept);
      }
    } catch (resetErr) {
      console.error('[SUBSCRIPTIONS] Usage reset re-arm failed (subscription already saved):', resetErr);
    }
    writeJson(subscriptionFile, subscriptions);
    // Subscribed students count as Paid on the payment pages; re-derive now so
    // the Paid / Partial / Unpaid pages agree the moment the form is saved.
    syncPaymentsWithStudents();
    res.json({ success: true, subscriptions });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save subscription.' });
  }
});

export default router;
