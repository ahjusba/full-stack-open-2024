import express from 'express';
import diaryService from '../services/diaryService';
import { DiaryEntry } from '../types';
import { Response } from 'express';

const router = express.Router();

router.get('/:id', (req, res) => {
  const diary = diaryService.findById(Number(req.params.id));

  if(diary) {
    res.send(diary);
  } else {
    res.sendStatus(404);
  }
});

router.get('/', (_req, res: Response<DiaryEntry[]>) => {
  res.send(diaryService.getEntries());
});

router.get('/secret', (_req, res) => {
  console.log("Fetching...");
  res.json(diaryService.getNonSensitiveEntries());
});

router.post('/', (req, res) => {
  /* eslint-disable @typescript-eslint/no-unsafe-assignment */
  const { date, weather, visibility, comment } = req.body;
  const addedEntry = diaryService.addDiary({
    date,
    weather,
    visibility,
    comment,
  });
  res.json(addedEntry);
});

export default router;