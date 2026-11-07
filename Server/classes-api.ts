import fs from 'fs';
import path from 'path';
import { readJson, writeJson } from './json-store';
import { dbDir } from './paths';
// API for handling class reservations

const classesPath = path.join(dbDir(), 'classes.json');

function getClasses() {
  return readJson(classesPath, []);
}

function saveClasses(classes) {
  writeJson(classesPath, classes);
}

// GET all reservations
function getAllReservations(req, res) {
  res.json(getClasses());
}

// POST new reservation
function addReservation(req, res) {
  const classes = getClasses();
  const newReservation = req.body;
  classes.push(newReservation);
  saveClasses(classes);
  res.status(201).json(newReservation);
}

export default {
  getAllReservations,
  addReservation
};
