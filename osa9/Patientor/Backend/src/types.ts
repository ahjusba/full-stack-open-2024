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

export type Patient = {
  id: string,
  name: string,
  dateOfBirth: string,
  ssn: string,
  gender: Gender,
  occupation: string
};

export type NewPatient = z.infer<typeof NewPatientSchema>;

export type PublicPatient = Omit<Patient, 'ssn'>;