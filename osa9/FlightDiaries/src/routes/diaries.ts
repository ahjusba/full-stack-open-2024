import express from 'express';
import diaryService from '../services/diaryService';
import { DiaryEntry } from '../types';
import { Response } from 'express';

const router = express.Router();

router.get('/', (_req, res: Response<DiaryEntry[]>) => {
  res.send(diaryService.getEntries());
});

router.get('/secret', (_req, res) => {
  console.log("Fetching...");
  res.json(diaryService.getNonSensitiveEntries());
});

router.post('/', (_req, res) => {
  res.send('Saving a diary!');
});

export default router;