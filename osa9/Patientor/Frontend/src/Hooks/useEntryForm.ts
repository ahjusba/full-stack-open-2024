import { useState, useEffect } from 'react';
import { NewEntry, HealthCheckRating } from '../types';
import { SelectChangeEvent } from '@mui/material';

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

const useEntryForm = (entryType: string, postNewEntry: (entry: NewEntry) => void) => {
  const [formData, setFormData] = useState<NewEntry>(getInitialFormData(entryType));
  const [diagnosisCodes, setCodes] = useState<string[]>([]);

  useEffect(() => {
    setFormData(getInitialFormData(entryType));
    setCodes([]);
  }, [entryType]);

  useEffect(() => {
    setFormData(prev => ({ ...prev, diagnosisCodes }));
  }, [diagnosisCodes]);

  const handleSelectChange = (event: SelectChangeEvent<typeof diagnosisCodes>) => {
    const { value } = event.target;
    setCodes(typeof value === 'string' ? value.split(',') : value);
  };


  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value: rawValue } = event.target;
    let value: string | string[] | HealthCheckRating = rawValue;

    if (name === "diagnosisCodes") {
      value = rawValue.split(',').map(code => code.trim());
    }

    if (name === "healthCheckRating") {
      value = Number(rawValue) as HealthCheckRating;
    }

    if (name.includes(".")) {
      const [parentKey, childKey] = name.split(".");

      setFormData(prev => {
        if (prev.type === "Hospital" && parentKey === "discharge") {
          const updated = {
            ...prev,
            discharge: {
              ...prev.discharge,
              [childKey]: value,
            },
          };
          return updated;
        }

        if (prev.type === "OccupationalHealthcare" && parentKey === "sickLeave") {
          const updated = {
            ...prev,
            sickLeave: {
              ...prev.sickLeave,
              [childKey]: value,
            },
          };
          return updated;
        }

        return prev; // fallback
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCodes([]);
    postNewEntry(formData);
  };

  return {
    formData,
    diagnosisCodes,
    handleChange,
    handleSelectChange,
    handleSubmit
  };
};

export default useEntryForm;
