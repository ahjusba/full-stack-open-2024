import React, { useState, useEffect } from 'react';
import { NewEntry, HealthCheckRating } from '../types';

type Props = {
  postNewEntry: (entry: NewEntry) => void;
  entryType: string;
};

const NewEntryComp: React.FC<Props> = ({ postNewEntry, entryType }) => {

  const getInitialFormData = (entryType: string): NewEntry => {
    switch (entryType) {
      case "HealthCheck":
        return {
          description: '',
          date: '',
          specialist: '',
          diagnosisCodes: [],
          healthCheckRating: HealthCheckRating.Healthy,
          type: "HealthCheck",
        };
      case "Hospital":
        return {
          description: '',
          date: '',
          specialist: '',
          diagnosisCodes: [],
          discharge: { date: '', criteria: '' },
          type: "Hospital",
        };
      case "OccupationalHealthcare":
        return {
          description: '',
          date: '',
          specialist: '',
          diagnosisCodes: [],
          employerName: '',
          sickLeave: { startDate: '', endDate: '' },
          type: "OccupationalHealthcare",
        };
      default:
        throw new Error("Unsupported entry type");
    }
  };

  useEffect(() => {
    setFormData(getInitialFormData(entryType));
  }, [entryType]);

  const [formData, setFormData] = useState<NewEntry>(getInitialFormData(entryType));

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

    if (name.includes(".")) {
      const [parentKey, childKey] = name.split(".");

      setFormData(prev => {
        if (prev.type === "Hospital" && parentKey === "discharge") {
          return {
            ...prev,
            discharge: {
              ...prev.discharge,
              [childKey]: value,
            },
          };
        }

        if (prev.type === "OccupationalHealthcare" && parentKey === "sickLeave") {
          return {
            ...prev,
            sickLeave: {
              ...prev.sickLeave,
              [childKey]: value,
            },
          };
        }

        return prev; // fallback if no match
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }

    console.log(formData);
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
          <label>Diagnosis Codes (comma-separated):</label>
          <input
            name="diagnosisCodes"
            value={(formData.diagnosisCodes ?? []).join(",")}
            onChange={handleChange}
          />
        </div>

        {entryType === "HealthCheck" && (
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
        )}

        {entryType === "Hospital" && (
          <div>
            <label>Discharge Date:</label>
            <input name="discharge.date" type="date" onChange={handleChange} />
            <label>Discharge Criteria:</label>
            <input name="discharge.criteria" onChange={handleChange} />
          </div>
        )}

        {entryType === "OccupationalHealthcare" && (
          <div>
            <label>Employer Name:</label>
            <input name="employerName" onChange={handleChange} />
            <label>Sick Leave Start:</label>
            <input name="sickLeave.startDate" type="date" onChange={handleChange} />
            <label>Sick Leave End:</label>
            <input name="sickLeave.endDate" type="date" onChange={handleChange} />
          </div>
        )}

        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default NewEntryComp;