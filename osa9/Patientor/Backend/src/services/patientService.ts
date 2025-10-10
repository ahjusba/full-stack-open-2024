import patients from '../../data/patients';
import { Entry, NewEntry, NewPatient, Patient, PublicPatient } from '../types';
import { v1 as uuid } from 'uuid';

const getPatients = (): Patient[] => {
  return patients;
};

const getPublicPatients = (): PublicPatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation
  }));
};

const addPatient = (patient: NewPatient): Patient => {
  const newPatient = {
    id: uuid(),
    entries: [], //TO DO
    ...patient
  };

  patients.push(newPatient);
  return newPatient;
};

const addEntry = (entry: NewEntry, patient: Patient): Entry => {
  console.log(`Adding entry ${entry.description} to patient ${patient.name}`);
  const newEntry: Entry = {
    ...entry,
    id: uuid(),
  };
  patient.entries.push(newEntry);
  return newEntry;
};

export default {
  getPatients,
  getPublicPatients,
  addPatient,
  addEntry
};