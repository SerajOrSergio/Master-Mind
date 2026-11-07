import fs from 'fs';
import path from 'path';
import { dbDir } from './paths';
// database.js
// Centralized database connection and data loading for the project

const dbPath = dbDir();

function loadJSON(filename) {
  const filePath = path.join(dbPath, filename);
  if (!fs.existsSync(filePath)) return null;
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
}

export default {
  grades: loadJSON('grades.json'),
  // Add more datasets here as needed
};
