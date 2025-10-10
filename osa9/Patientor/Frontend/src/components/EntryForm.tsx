import React, { useState } from 'react';
import { NewEntry, HealthCheckRating } from '../types';

type Props = {
  postNewEntry: (entry: NewEntry) => void;
};

const NewEntryComp: React.FC<Props> = ({ postNewEntry }: Props) => {
  const [formData, setFormData] = useState<NewEntry>({
    description: '',
    date: '',
    specialist: '',
    healthCheckRating: HealthCheckRating.CriticalRisk,
    diagnosisCodes: [],
    type: "HealthCheck",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'healthCheckRating' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    console.log("Submit: ", formData);
    e.preventDefault();
    postNewEntry(formData);
  };

  return (
    <div>
      <h2>New HealthCheck Entry</h2>
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
        <div>
          <label>HealthCheck Rating:</label>
          <input
            name="healthCheckRating"
            type="number"
            min="0"
            max="3"
            value={1}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Diagnosis Codes (comma-separated):</label>
          <input name="diagnosisCodes" value={formData.diagnosisCodes} onChange={handleChange} />
        </div>
        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default NewEntryComp;
