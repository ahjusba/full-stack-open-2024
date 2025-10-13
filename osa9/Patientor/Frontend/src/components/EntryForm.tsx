import React, { useState } from 'react';
import { NewEntry, HealthCheckRating } from '../types';

type Props = {
  postNewEntry: (entry: NewEntry) => void;
};

const NewEntryComp: React.FC<Props> = ({ postNewEntry }) => {
  const [formData, setFormData] = useState<NewEntry>({
    description: '',
    date: '',
    specialist: '',
    healthCheckRating: HealthCheckRating.Healthy,
    diagnosisCodes: [],
    type: "HealthCheck",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value: rawValue } = e.target;
    let value: string | string[] | HealthCheckRating = rawValue;

    if (name === "diagnosisCodes") {
      value = rawValue.split(",").map(code => code.trim());
    }

    if (name === "healthCheckRating") {
      value = Number(rawValue) as HealthCheckRating;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submit: ", formData);
    postNewEntry(formData);
  };

  return (
    <div>
      <h2>New HealthCheck Entry</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Description:</label>
          <input
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Date:</label>
          <input
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Specialist:</label>
          <input
            name="specialist"
            value={formData.specialist}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>HealthCheck Rating:</label>
          <select
            name="healthCheckRating"

            onChange={handleChange}
          >
            {Object.entries(HealthCheckRating)
              .filter(([_key, val]) => typeof val === "number")
              .map(([key, val]) => (
                <option key={val} value={val}>
                  {key}
                </option>
              ))}
          </select>
        </div>
        <div>
          <label>Diagnosis Codes (comma-separated):</label>
          <input
            name="diagnosisCodes"
            value={(formData.diagnosisCodes ?? []).join(",")}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default NewEntryComp;