import fs from 'fs';
import path from 'path';
/* ============================================================
   json-store.js — safe JSON database helpers
   ------------------------------------------------------------
   Small Central-File DB pitfall: we store every collection as a
   JSON file that the server reads and rewrites LIVE. Two things
   can take the whole site down with raw fs calls:

     1. A corrupted file (a bad edit, an interrupted write, a
        power cut) made every JSON.parse throw, and every
        endpoint that touches that file kept erroring forever.
     2. fs.writeFileSync truncates and rewrites the file in
        place. If the process dies mid-write (power cut, crash)
        the file is left HALF-WRITTEN — i.e. corrupted — so the
        next boot has a broken database.

   readJson  → if the file is missing or unparseable, it is
               quarantined as <file>.corrupt-<timestamp> (never
               silently lost, so it can still be recovered) and
               `fallback` is returned instead of throwing.
   writeJson → writes to a temp file first, then renames it over
               the real file. A rename on the same volume replaces
               the whole file at once, so the real file is NEVER
               in a half-written state. If the rename is blocked
               (rare Windows file-lock) it falls back to a direct
               write so data is still saved.
   ============================================================ */

function readJson(file: string, fallback?: any) {
  try {
    if (!fs.existsSync(file)) return fallback;
    const data = fs.readFileSync(file, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    // Quarantine the unreadable file (with a timestamp so it is never
    // overwritten) and continue with the fallback instead of crashing.
    try {
      const stamp = new Date().toISOString().replace(/[:.]/g, '-');
      const quarantined = `${file}.corrupt-${stamp}`;
      fs.renameSync(file, quarantined);
      console.error(`[json-store] "${file}" was unreadable and has been quarantined as "${path.basename(quarantined)}" — returning fallback value.`);
    } catch (err2) {
      console.error(`[json-store] Could not read "${file}" (${err.message}); could not quarantine it either (${err2 ? err2.message : err2}). Returning fallback value.`);
    }
    return fallback;
  }
}

function writeJson(file, data) {
  const json = JSON.stringify(data, null, 2);
  const dir = path.dirname(file);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const tmp = `${file}.tmp-${process.pid}`;
  try {
    fs.writeFileSync(tmp, json, 'utf8');
    // Atomic replace: readers never see a half-written file.
    try {
      fs.renameSync(tmp, file);
    } catch (renameErr) {
      // Extremely rare on Windows (another process briefly locked the
      // destination). Fall back to an in-place write so data is kept.
      console.error(`[json-store] Atomic rename failed for "${file}" (${renameErr.message}); writing in place instead.`);
      fs.writeFileSync(file, json, 'utf8');
      try { fs.unlinkSync(tmp); } catch (err) { /* temp already gone */ }
    }
  } catch (err) {
    console.error(`[json-store] Could not save "${file}":`, err.message);
    throw err;
  }
}

export { readJson, writeJson };
