import { useParams } from "react-router-dom";
import { Patient } from "../types";
import patientService from "../services/patients";
import { useEffect, useState } from "react";

const PatientInfo = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient>();

  useEffect(() => {
    const fetchPatient = async () => {
      const fetchedPatient = await patientService.getId(id);
      console.log("Fetched patient: ", fetchPatient);
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
    </div>
  );
};

export default PatientInfo;