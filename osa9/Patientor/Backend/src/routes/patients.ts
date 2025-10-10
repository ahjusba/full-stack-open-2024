import express, { NextFunction, Request, Response } from 'express';
import patientService from '../services/patientService';
import { NewPatientSchema, NewEntrySchema } from '../utils';
import { NewPatient, Patient, NewEntry, Entry } from '../types';
import z from 'zod';

const router = express.Router();

router.get('/', (_req, res) => {
  const patients = patientService.getPublicPatients();
  res.send(patients);
});

router.get('/:id', (req, res) => {
  const id = req.params.id;
  const patients = patientService.getPatients();
  const patient = patients.find(p => p.id === id);
  if (patient) {
    res.json(patient);
  } else {
    res.status(404).json({ message: 'Patient not found' });
  }
});

type Params = {
  id: string;
};

const newEntryParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const result = NewEntrySchema.safeParse(req.body);
    if (!result.success) {
      throw result.error;
    }
    req.body = result.data;
    next();
  } catch (error: unknown) {
    next(error);
  }
};

router.post('/:id/entries', newEntryParser, (req: Request<Params, unknown, NewEntry>, res: Response<Entry>) => {
  const id = req.params.id;
  const patients = patientService.getPatients();
  const patient = patients.find(p => p.id === id);
  if(!patient) return res.status(404);

  const addedEntry = patientService.addEntry(req.body, patient);
  return res.json(addedEntry);
});

const newPatientParses = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const result = NewPatientSchema.safeParse(req.body);
    if (!result.success) {
      throw result.error;
    }
    req.body = result.data;
    next();
  } catch (error: unknown) {
    next(error);
  }
};

const errorMiddleware = (error: unknown, _req: Request, res: Response, next: NextFunction) => {
  if (error instanceof z.ZodError) {
    res.status(400).send({ error: error.issues });
  } else {
    next(error);
  }
};

router.post('/', newPatientParses, (req: Request<unknown, unknown, NewPatient>, res: Response<Patient>) => {
  const addedPatient = patientService.addPatient(req.body);
  res.json(addedPatient);
});

router.use(errorMiddleware);

export default router;