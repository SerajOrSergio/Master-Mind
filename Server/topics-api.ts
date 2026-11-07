import fs from 'fs';
import path from 'path';
import express from 'express';
import { readJson, writeJson } from './json-store';
import { dbDir } from './paths';

// topics-api.js
const router = express.Router();

// GET single topic by id
router.get('/:id', (req, res) => {
  const topics = readTopics();
  const topic = topics.find(t => t.id === parseInt(req.params.id));
  if (!topic) return res.status(404).json({ error: 'Topic not found' });
  res.json(topic);
});

const topicsFile = path.join(dbDir(), 'topics.json');

// Helper to read topics (self-healing)
function readTopics() {
  return readJson(topicsFile, []);
}

// Helper to write topics (atomic)
function writeTopics(topics) {
  writeJson(topicsFile, topics);
}

// GET all topics
router.get('/', (req, res) => {
  const topics = readTopics();
  res.json(topics);
});

// POST create topic
router.post('/', (req, res) => {
  const topics = readTopics();
  const newTopic = {
    id: topics.length ? topics[topics.length - 1].id + 1 : 1,
    teacher: req.body.teacher,
    student: req.body.student,
    subject: req.body.subject,
    chapter: req.body.chapter,
    notes: req.body.notes,
    date: req.body.date,
    time: req.body.time,
    status: req.body.status || 'Pending'
  };
  topics.push(newTopic);
  writeTopics(topics);
  res.status(201).json(newTopic);
});

// PUT update topic status or details
router.put('/:id', (req, res) => {
  const topics = readTopics();
  const idx = topics.findIndex(t => t.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Topic not found' });
  topics[idx] = { ...topics[idx], ...req.body };
  writeTopics(topics);
  res.json(topics[idx]);
});

// DELETE topic
router.delete('/:id', (req, res) => {
  let topics = readTopics();
  const idx = topics.findIndex(t => t.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Topic not found' });
  const deleted = topics.splice(idx, 1);
  writeTopics(topics);
  res.json(deleted[0]);
});

export default router;
