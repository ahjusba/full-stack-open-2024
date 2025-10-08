import { useParams } from "react-router-dom";
import { Entry, Patient } from "../types";
import patientService from "../services/patients";
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
      <ul>
        {entry?.diagnosisCodes?.map((diagnose, index) => (
         <li key={index}>
          {diagnose}
         </li> 
        ))}
      </ul>
    </div>
  );
};

export default PatientInfo;