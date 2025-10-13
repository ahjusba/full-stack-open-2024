import React from 'react';
import { OccupationalHealthcareEntry } from '../../types';

type Props = {
  formData: Omit<OccupationalHealthcareEntry, 'id'>;
  handleChange: React.ChangeEventHandler;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const OccupationalFields: React.FC<Props> = ({ formData, handleChange }) => (
  <div>
    <label>Employer Name:</label>
    <input name="employerName" onChange={handleChange} />
    <label>Sick Leave Start:</label>
    <input name="sickLeave.startDate" type="date" onChange={handleChange} />
    <label>Sick Leave End:</label>
    <input name="sickLeave.endDate" type="date" onChange={handleChange} />
  </div>
);

export default OccupationalFields;
