import React from 'react';
import { HealthCheckEntry, NewEntry, HospitalEntry, OccupationalHealthcareEntry } from '../../types';
import DiagnosisCodeSelector from '../DiagnosisCodeSelector';
import HealthCheckFields from './HealthCheckFields';
import HospitalFields from './HospitalFields';
import OccupationalFields from './OccupationalFields';
import useEntryForm from '../../Hooks/useEntryForm';

type Props = {
  postNewEntry: (entry: NewEntry) => void;
  entryType: string;
};

const NewEntryComp: React.FC<Props> = ({ postNewEntry, entryType }) => {
  const {
    formData,
    diagnosisCodes,
    handleChange,
    handleSelectChange,
    handleSubmit
  } = useEntryForm(entryType, postNewEntry);

  return (
    <div>
      <h2>New {entryType} Entry</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Description:</label>
          <input name="description" value={formData.description} onChange={handleChange} />
        </div>
        <div>
          <label>Date:</label>
          <input name="date" type="date" value={formData.date} onChange={handleChange} />
        </div>
        <div>
          <label>Specialist:</label>
          <input name="specialist" value={formData.specialist} onChange={handleChange} />
        </div>

        <DiagnosisCodeSelector diagnosisCodes={diagnosisCodes} onChange={handleSelectChange} />

        {entryType === "HealthCheck" && <HealthCheckFields formData={formData as HealthCheckEntry} handleChange={handleChange} />}
        {entryType === "Hospital" && <HospitalFields formData={formData as HospitalEntry} handleChange={handleChange} />}
        {entryType === "OccupationalHealthcare" && <OccupationalFields formData={formData as OccupationalHealthcareEntry} handleChange={handleChange} />}

        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default NewEntryComp;
