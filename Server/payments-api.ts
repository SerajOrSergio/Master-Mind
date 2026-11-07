import express from 'express';
import fs from 'fs';
import path from 'path';
import { readJson as readJsonSafe, writeJson as writeJsonSafe } from './json-store';
import { dbDir } from './paths';
const router = express.Router();

const PAYMENTS_PATH = path.join(dbDir(), 'teacher-portal/payments.json');

// PATCH: Sync all discounts and phone numbers in payments.json with students.json
router.post('/api/payments/sync-students', (req, res) => {
  const payments = readJson(PAYMENTS_PATH);
  const students = readJson(path.join(dbDir(), 'students.json'));
  let updated = 0;
  payments.forEach(p => {
    if (p.studentId) {
      const stu = students.find(s => s.id === p.studentId);
      if (stu) {
        // FORCE update from student record, no conditions
        p.discount = stu.discount;
        p.phone = stu.phoneNumber || '';
        updated++;
      }
    }
  });
  writeJson(PAYMENTS_PATH, payments);
  res.json({ success: true, updated });
});
function readJson(filePath) {
  // Self-healing: corrupt files are quarantined and [] is returned.
  return readJsonSafe(filePath, []);
}

// Helper to write JSON file
function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

// GET all payments, patching phone from students.json
router.get('/api/payments', (req, res) => {
  const payments = readJson(PAYMENTS_PATH);
  const students = readJson(path.join(dbDir(), 'students.json'));
  const patched = payments.map(p => {
    let discount = p.discount;
    if (p.studentId) {
      const stu = students.find(s => s.id === p.studentId);
      if (stu) {
        discount = (typeof stu.discount === 'number' || (typeof stu.discount === 'string' && stu.discount !== '')) ? stu.discount : p.discount;
      }
    }
    // Normalize: if discount is empty string, undefined, or null, set to null
    if (discount === '' || discount === undefined) discount = null;
    return {
      ...p,
      phone: (p.studentId && students.find(s => s.id === p.studentId)) ? students.find(s => s.id === p.studentId).phoneNumber || p.phone : p.phone,
      discount
    };
  });
  res.json(patched);
});

// GET a single payment by id
router.get('/api/payments/:id', (req, res) => {
  const payments = readJson(PAYMENTS_PATH);
  const students = readJson(path.join(dbDir(), 'students.json'));
  const payment = payments.find(p => String(p.id) === String(req.params.id));
  if (!payment) return res.status(404).json({ error: 'Payment not found' });
  let patched = payment;
  if (payment.studentId) {
    const stu = students.find(s => s.id === payment.studentId);
    if (stu) {
      patched = {
        ...payment,
        phone: stu.phoneNumber || payment.phone,
        discount: (typeof stu.discount === 'number' || (typeof stu.discount === 'string' && stu.discount !== '')) ? stu.discount : payment.discount
      };
    }
  }
  res.json(patched);
});

// PUT update a payment by id
router.put('/api/payments/:id', (req, res) => {
  const payments = readJson(PAYMENTS_PATH);
  const students = readJson(path.join(dbDir(), 'students.json'));
  const idx = payments.findIndex(p => String(p.id) === String(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Payment not found' });
  Object.keys(req.body).forEach(key => {
    if (key !== 'id') payments[idx][key] = req.body[key];
  });
  writeJson(PAYMENTS_PATH, payments);
  let patched = payments[idx];
  if (patched.studentId) {
    const stu = students.find(s => s.id === patched.studentId);
    if (stu) {
      patched = {
        ...patched,
        phone: stu.phoneNumber || patched.phone,
        discount: (typeof stu.discount === 'number' || (typeof stu.discount === 'string' && stu.discount !== '')) ? stu.discount : patched.discount
      };
    }
  }
  res.json(patched);
});

// POST create a new payment
router.post('/api/payments', (req, res) => {
  const payments = readJson(PAYMENTS_PATH);
  const students = readJson(path.join(dbDir(), 'students.json'));
  const newPayment = { ...req.body };
  // Always add submittedAt if not present
  if (!newPayment.submittedAt) {
    newPayment.submittedAt = new Date().toISOString();
  }
  // When undoing a delete, restore the payment at its original position so it
  // does not jump to the bottom of the list.
  const restoreIdx = Number(newPayment._restoreIndex);
  delete newPayment._restoreIndex;
  if (Number.isInteger(restoreIdx) && restoreIdx >= 0 && restoreIdx < payments.length) {
    payments.splice(restoreIdx, 0, newPayment);
  } else {
    payments.push(newPayment);
  }
  writeJson(PAYMENTS_PATH, payments);
  let patched = newPayment;
  if (newPayment.studentId) {
    const stu = students.find(s => s.id === newPayment.studentId);
    if (stu) {
      patched = {
        ...newPayment,
        phone: stu.phoneNumber || newPayment.phone,
        discount: (typeof stu.discount === 'number' || (typeof stu.discount === 'string' && stu.discount !== '')) ? stu.discount : newPayment.discount
      };
    }
  }
  res.json(patched);
// PATCH: Add submittedAt to all existing payments if missing
router.post('/api/payments/sync-submitted-at', (req, res) => {
  const payments = readJson(PAYMENTS_PATH);
  let updated = 0;
  payments.forEach(p => {
    if (!p.submittedAt) {
      // Use date field if available, add default time 12:00
      if (p.date) {
        p.submittedAt = p.date.length === 10 ? `${p.date}T12:00:00.000Z` : new Date().toISOString();
      } else {
        p.submittedAt = new Date().toISOString();
      }
      updated++;
    }
  });
  writeJson(PAYMENTS_PATH, payments);
  res.json({ success: true, updated });
});
});

// DELETE a payment by id
router.delete('/api/payments/:id', (req, res) => {
  let payments = readJson(PAYMENTS_PATH);
  const initialLength = payments.length;
  payments = payments.filter(p => String(p.id) !== String(req.params.id));
  if (payments.length === initialLength) return res.status(404).json({ error: 'Payment not found' });
  writeJson(PAYMENTS_PATH, payments);
  res.json({ success: true });
});

export default router;
