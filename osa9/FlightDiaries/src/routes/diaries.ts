import express from 'express';
import diaryService from '../services/diaryService';
import { DiaryEntry } from '../types';
import { Response } from 'express';
import { toNewDiaryEntry } from '../utils';
import z from 'zod';

const router = express.Router();

router.get('/', (_req, res: Response<DiaryEntry[]>) => {
  res.send(diaryService.getEntries());
});

router.get('/secret', (_req, res) => {
  console.log("Fetching...");
  res.json(diaryService.getNonSensitiveEntries());
});

router.get('/:id', (req, res) => {
  const diary = diaryService.findById(Number(req.params.id));

  if (diary) {
    res.send(diary);
  } else {
    res.sendStatus(404);
  }
});

router.post('/', (req, res) => {
  try {
    const newDiaryEntry = toNewDiaryEntry(req.body);
    const addedEntry = diaryService.addDiary(newDiaryEntry);
    res.json(addedEntry);
  } catch (error: unknown) {
    console.log("Something went wrong..");
    if (error instanceof z.ZodError) {
      res.status(400).send({ error: error.issues });
    } else {
      res.status(400).send({ error: 'unknown error' });
    }
  }
});

export default router;