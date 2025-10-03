import patients from '../../data/patients';
import { Patient, PublicPatient } from '../types';

const getPatients = (): Patient[] => {
  return patients;
};

const getPublicPatients = (): PublicPatient[] => {
  return patients.map(( { id, name, dateOfBirth, gender, occupation } ) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation
  }));
};

// const getNonSensitiveEntries = (): NonSensitiveDiaryEntry[] => {
//   return diaries.map(({ id, date, weather, visibility }) => ({
//     id,
//     date,
//     weather,
//     visibility,
//   }));
// };

// const addDiary = () => {
//   return null;
// };

export default {
  getPatients,
  getPublicPatients
};