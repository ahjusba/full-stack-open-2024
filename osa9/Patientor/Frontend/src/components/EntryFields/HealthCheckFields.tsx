import React from 'react';
import { HealthCheckRating, HealthCheckEntry } from '../../types';

type Props = {
  formData: Omit<HealthCheckEntry, 'id'>;
  handleChange: React.ChangeEventHandler;
};

const HealthCheckFields: React.FC<Props> = ({ formData, handleChange }) => (
  <div>
    <label>HealthCheck Rating:</label>
    <select name="healthCheckRating" value={formData.healthCheckRating} onChange={handleChange}>
      {Object.entries(HealthCheckRating)
        .filter(([_key, val]) => typeof val === "number")
        .map(([key, val]) => (
          <option key={val} value={val}>{key}</option>
        ))}
    </select>
  </div>
);

export default HealthCheckFields;
