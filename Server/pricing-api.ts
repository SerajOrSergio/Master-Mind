import express from 'express';
import fs from 'fs';
import path from 'path';
import { readJson, writeJson } from './json-store';
import { dbDir } from './paths';
const router = express.Router();

const PRICING_PATH = path.join(dbDir(), 'pricing.json');

// Get pricing data
router.get('/', (req, res) => {
  // Self-healing read: a corrupt file is quarantined and [] returned instead
  // of an unhandled exception that would previously crash the request.
  res.json(readJson(PRICING_PATH, []));
});

// Update pricing data (replace whole file)
router.put('/', (req, res) => {
  const newData = req.body;
  if (!Array.isArray(newData)) {
    return res.status(400).json({ error: 'Invalid data: expected an array.' });
  }
  try {
    // Atomic write — no half-written file on a power cut or crash
    writeJson(PRICING_PATH, newData);
    res.json({ success: true });
  } catch (err) {
    console.error('Failed to save pricing data:', err);
    res.status(500).json({ error: 'Failed to save pricing data.' });
  }
});

export default router;
