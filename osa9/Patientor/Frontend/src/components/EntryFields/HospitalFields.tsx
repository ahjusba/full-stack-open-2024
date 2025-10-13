import React from 'react';
import { HospitalEntry } from '../../types';

type Props = {
  formData: Omit<HospitalEntry, 'id'>;
  handleChange: React.ChangeEventHandler;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const HospitalFields: React.FC<Props> = ({ formData, handleChange }) => (
  <div>
    <label>Discharge Date:</label>
    <input name="discharge.date" type="date" onChange={handleChange} />
    <label>Discharge Criteria:</label>
    <input name="discharge.criteria" onChange={handleChange} />
  </div>
);

export default HospitalFields;
