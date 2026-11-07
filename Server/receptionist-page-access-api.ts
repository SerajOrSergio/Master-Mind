import fs from 'fs';
import path from 'path';
import express from 'express';
import { readJson, writeJson } from './json-store';
import { dbDir } from './paths';
// receptionist-page-access-api.js
const router = express.Router();

const pageAccessFile = path.join(dbDir(), 'receptionist-page-access.json');

// Helper to read page access config
function readPageAccess() {
  // Return default structure if file doesn't exist or is corrupt
  return readJson(pageAccessFile, { pages: [] });
}

// Helper to write page access config
function writePageAccess(config) {
  // Atomic write (creates parent dirs when missing)
  writeJson(pageAccessFile, config);
}

// GET all pages with their access status
router.get('/', (req, res) => {
  try {
    const config = readPageAccess();
    res.json(config);
  } catch (err) {
    console.error('Error reading page access config:', err);
    res.status(500).json({ error: 'Failed to load page access configuration' });
  }
});

// PUT update page access (enable/disable)
router.put('/', (req, res) => {
  try {
    const config = readPageAccess();
    const { pages } = req.body;
    
    if (!Array.isArray(pages)) {
      return res.status(400).json({ error: 'Invalid request: pages must be an array' });
    }
    
    // Update the configuration with the new page states
    config.pages = pages;
    writePageAccess(config);
    
    res.json({ success: true, pages: config.pages });
  } catch (err) {
    console.error('Error updating page access config:', err);
    res.status(500).json({ error: 'Failed to update page access configuration' });
  }
});

// PUT update single page access
router.put('/:pageId', (req, res) => {
  try {
    const config = readPageAccess();
    const pageId = req.params.pageId;
    const { enabled } = req.body;
    
    if (typeof enabled !== 'boolean') {
      return res.status(400).json({ error: 'Invalid request: enabled must be a boolean' });
    }
    
    const pageIndex = config.pages.findIndex(p => p.id === pageId);
    if (pageIndex === -1) {
      return res.status(404).json({ error: 'Page not found' });
    }
    
    config.pages[pageIndex].enabled = enabled;
    writePageAccess(config);
    
    res.json({ success: true, page: config.pages[pageIndex] });
  } catch (err) {
    console.error('Error updating page access:', err);
    res.status(500).json({ error: 'Failed to update page access' });
  }
});

export default router;
