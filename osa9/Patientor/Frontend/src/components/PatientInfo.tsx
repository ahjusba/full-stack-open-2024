import { useParams } from "react-router-dom";
import { Diagnosis, Entry, Patient } from "../types";
import patientService from "../services/patients";
import diagnosisService from "../services/diagnoses";
import { useEffect, useState } from "react";

const PatientInfo = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient>();

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

  return (
    <div>
      <h2>{patient.name}</h2>
      <p>{patient.occupation}</p>
      <p>{patient.gender}</p>
      <p>{patient.dateOfBirth}</p>
      <p>{patient.ssn}</p>
      <h3>ENTRIES:</h3>
      {patient.entries.map((entry, index) => (
        <EntryComp entry={entry} key={index} />
      ))}
    </div>
  );
};

const EntryComp = ({ entry }: { entry: Entry }) => {
  return(
    <div>
      <p>{entry.date} {entry.description}</p>
      <Diagnoses diagnosisCodes={entry.diagnosisCodes} />
    </div>
  );
};

const Diagnoses = ({ diagnosisCodes}: { diagnosisCodes: string[] | undefined }) => {

  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);

  useEffect(() => {
    const fetchDiagnoses = async () => {
      const diagnoses = await diagnosisService.getAll();
      setDiagnoses(diagnoses);
    };

    fetchDiagnoses();
  }, []);

  return(
    <ul>
      {diagnosisCodes?.map((diagnosisCode, index) => (        
        <li key={index}>
          <DiagnosisComp diagnosisCode={diagnosisCode} diagnoses={diagnoses} />
        </li>
      ))}
    </ul>
  );
};

const DiagnosisComp = ({diagnosisCode, diagnoses}: {diagnosisCode: string, diagnoses: Diagnosis[]}) => {
  const diagnosis = diagnoses.find(d => d.code === diagnosisCode);
  
  return (
    <p>{diagnosis?.code}: {diagnosis?.name}</p>
  );
};

export default PatientInfo;