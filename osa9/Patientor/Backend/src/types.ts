import { NewPatientSchema } from "./utils";
import z from 'zod';

export type Diagnosis = {
  code: string;
  name: string;
  latin?: string;
};

export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other"
};

export interface Entry {
  description: string,
}

export type Patient = {
  id: string,
  name: string,
  ssn: string,
  occupation: string,
  gender: Gender,
  dateOfBirth: string,
  entries: Entry[]
};

export type NewPatient = z.infer<typeof NewPatientSchema>;

export type PublicPatient = Omit<Patient, 'ssn' | 'entries' >;