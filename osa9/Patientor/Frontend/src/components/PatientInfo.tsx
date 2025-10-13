import { useParams } from "react-router-dom";
import { Diagnosis, NewEntry, Entry, Patient, HospitalEntry, OccupationalHealthcareEntry, HealthCheckEntry } from "../types";
import patientService from "../services/patients";
import diagnosisService from "../services/diagnoses";
import React, { useEffect, useState } from "react";
import NewEntryComp from "./EntryForm";
import axios from "axios";

const PatientInfo = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient>();
  const [errorMessage, setError] = useState('');

  useEffect(() => {
    const fetchPatient = async () => {
      const fetchedPatient = await patientService.getId(id);
      setPatient(fetchedPatient);
    };
    fetchPatient();
  }, [id]);

  if (!patient) {
    return <p>Patient not found</p>;
  }

  const postNewEntry = (entry: NewEntry) => {
    const postEntryForPatient = async () => {
      try {
        const postedEntry = await patientService.createEntry(entry, patient.id);
        console.log("Posted entry: ", postedEntry);
        setPatient(prev => prev ? {
          ...prev,
          entries: [...prev.entries, postedEntry],
        } : prev);

      } catch (error: unknown) { //TODO: axios error handling in one location
        if (axios.isAxiosError(error)) {
          const responseData = error.response?.data;
          if (typeof responseData === "string") {
            setError(responseData);
          } else if (
            responseData &&
            typeof responseData === "object" &&
            Array.isArray(responseData.error)
          ) {
            const firstError = responseData.error[0];
            if (firstError?.message) {
              setError(firstError.message);
            } else {
              setError("Unknown structured error format");
            }
          } else {
            setError("Unrecognized axios error");
          }
        } else {
          setError("Unknown error");
        }
      }
    };

    postEntryForPatient();
  };

  return (
    <div>
      <h2>{patient.name}</h2>
      <p>{patient.occupation}</p>
      <p>{patient.gender}</p>
      <p>{patient.dateOfBirth}</p>
      <p>{patient.ssn}</p>

      {errorMessage && (
        <ErrorMessage message={errorMessage} setError={setError} />
      )}

      <NewEntryComp postNewEntry={postNewEntry} />
      <h3> ENTRIES:</h3>
      {
        patient.entries.map((entry, index) => (
          <div key={index} className="entry">
            <EntryType entry={entry} />
            <Diagnoses diagnosisCodes={entry?.diagnosisCodes} key={entry.id} />
          </div>
        ))
      }
    </div >
  );
};

const ErrorMessage = ({ message, setError }: { message: string, setError: (value: string) => void }) => {
  setTimeout(() => {
    setError('');
  }, 2000);
  return <h1 className="errorMessage">{message}</h1>;
};

const EntryType: React.FC<{ entry: Entry }> = ({ entry }) => {
  const assertNever = (value: never): never => {
    throw new Error(
      `Unhandled discriminated union member: ${JSON.stringify(value)}`
    );
  };

  switch (entry.type) {
    case "Hospital":
      return <HospitalEntryComp entry={entry} />;
    case "OccupationalHealthcare":
      return <OccupationalHealthEntryComp entry={entry} />;
    case "HealthCheck":
      return <HealthCheckEntryComp entry={entry} />;
    default:
      assertNever(entry);
  }
};

const BaseEntryComp = ({ entry }: { entry: Entry }) => {
  return (
    <div>
      <p>{entry.date}</p>
      <p>{entry.description}</p>
      <p>{entry.specialist}</p>
      <p>{entry.id}</p>
      <p>{entry.type}</p>
    </div>
  );
};

const HospitalEntryComp = ({ entry }: { entry: HospitalEntry }) => {
  return (
    <div>
      <BaseEntryComp entry={entry} />
      <p>{entry.discharge.criteria}</p>
      <p>{entry.discharge.date}</p>
    </div>
  );
};

const OccupationalHealthEntryComp = ({ entry }: { entry: OccupationalHealthcareEntry }) => {
  return (
    <div>
      <BaseEntryComp entry={entry} />
      <p>{entry.employerName}</p>
      <p>sick leave:</p>
      <p>{entry.sickLeave?.startDate}</p>
      <p>{entry.sickLeave?.endDate}</p>
    </div>
  );
};

const HealthCheckEntryComp = ({ entry }: { entry: HealthCheckEntry }) => {
  return (
    <div>
      <BaseEntryComp entry={entry} />
      <p>{entry.healthCheckRating}</p>
    </div>
  );
};

const Diagnoses = ({ diagnosisCodes }: { diagnosisCodes: string[] | undefined }) => {

  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);

  useEffect(() => {
    const fetchDiagnoses = async () => {
      const diagnoses = await diagnosisService.getAll();
      setDiagnoses(diagnoses);
    };

    fetchDiagnoses();
  }, []);

  return (
    <ul>
      {diagnosisCodes?.map((diagnosisCode, index) => (
        <li key={index}>
          <DiagnosisComp diagnosisCode={diagnosisCode} diagnoses={diagnoses} />
        </li>
      ))}
    </ul>
  );
};

const DiagnosisComp = ({ diagnosisCode, diagnoses }: { diagnosisCode: string, diagnoses: Diagnosis[] }) => {
  const diagnosis = diagnoses.find(d => d.code === diagnosisCode);

  return (
    <p>{diagnosis?.code}: {diagnosis?.name}</p>
  );
};

export default PatientInfo;