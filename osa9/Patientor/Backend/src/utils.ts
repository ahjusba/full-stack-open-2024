import { Gender, NewPatient } from "./types";


const toNewPatient = (object: unknown): NewPatient => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect or missing data');
  }

  if ('name' in object && 'dateOfBirth' in object && 'ssn' in object && 'gender' in object && 'occupation' in object) {
    const newPatient: NewPatient = {
      "name": parseText(object.name),
      "dateOfBirth": parseDate(object.dateOfBirth),
      "ssn": parseText(object.ssn),
      "gender": parseGender(object.gender),
      "occupation": parseText(object.occupation)
    };

    return newPatient;
  }

  throw new Error('Incorrect data: some fields are missing.');
};

const parseGender = (gender: unknown): Gender => {
  if (!isString(gender) || !isGender(gender)) {
    throw new Error("Incorrect gender: " + gender);
  }

  return gender;
};

const parseDate = (date: unknown): string => {
  if (!isString(date) || !isDate(date)) {
    throw new Error("Incorrect date: " + date);
  }
  return date;
};

const parseText = (text: unknown): string => {
  if (!isString(text)) {
    throw new Error("Incorrect field: " + text);
  }
  return text;
};

const isGender = (gender: string): gender is Gender => {
  return Object.values(Gender).includes(gender as Gender);
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

export default toNewPatient;