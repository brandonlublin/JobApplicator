import { useState } from 'react';
import { Job } from '../../types';
import { apiClient } from '../../services/apiClient';
import FormInput from './FormInput';
import FormSelect from './FormSelect';
import styles from './JobForm.module.css';

interface JobFormProps {
  onSubmit: () => void;
  onClose: () => void;
}

const JobForm = ({ onSubmit, onClose }: JobFormProps) => {
  const [formData, setFormData] = useState<Partial<Job>>({
    job_title: '',
    employer_name: '',
    job_min_salary: 0,
    job_max_salary: 0,
    job_employment_type: '',
    is_referral: false,
    in_interview_loop: false,
    interview_stage: '',
    interest_level: 1,
    manually_added: true,
    job_location: '',
  });

  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newJob: Job = {
      ...formData,
      job_id: Date.now().toString(),
      manually_added: true,
    } as Job;

    try {
      await apiClient.applyForJob(newJob.job_id, newJob);
      onSubmit();
      setFormData({
        job_title: '',
        employer_name: '',
        job_min_salary: 0,
        job_max_salary: 0,
        job_employment_type: '',
        is_referral: false,
        in_interview_loop: false,
        interview_stage: '',
        interest_level: 1,
        manually_added: true,
        job_location: '',
      });
      setError(null);
      onClose();
    } catch {
      setError('Error adding job to applied jobs');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.inputGroup}>
        <FormInput
          type="text"
          name="job_title"
          placeholder="Job Title"
          value={formData.job_title || ''}
          onChange={handleChange}
        />
        <FormInput
          type="text"
          name="employer_name"
          placeholder="Employer Name"
          value={formData.employer_name || ''}
          onChange={handleChange}
        />
        <FormInput
          type="text"
          name="job_location"
          placeholder="Job Location"
          value={formData.job_location || ''}
          onChange={handleChange}
        />
        <FormInput
          type="number"
          name="job_min_salary"
          placeholder="Min Salary"
          value={formData.job_min_salary || 0}
          onChange={handleChange}
        />
        <FormInput
          type="number"
          name="job_max_salary"
          placeholder="Max Salary"
          value={formData.job_max_salary || 0}
          onChange={handleChange}
        />
      </div>

      <div className={styles.inputGroup}>
        <FormSelect
          name="job_employment_type"
          value={formData.job_employment_type || ''}
          options={['Full-Time', 'Part-Time', 'Contract']}
          onChange={handleChange}
        />
        <FormInput
          type="checkbox"
          name="is_referral"
          value={formData.is_referral || false}
          onChange={handleCheckboxChange}
          label="Referral"
        />
        <FormInput
          type="checkbox"
          name="in_interview_loop"
          value={formData.in_interview_loop || false}
          onChange={handleCheckboxChange}
          label="In Interview Loop"
        />
        {formData.in_interview_loop && (
          <FormInput
            type="text"
            name="interview_stage"
            placeholder="Interview Stage"
            value={formData.interview_stage || ''}
            onChange={handleChange}
          />
        )}
        <FormInput
          type="number"
          name="interest_level"
          min={1}
          max={10}
          value={formData.interest_level || 1}
          onChange={handleChange}
        />
      </div>

      <button type="submit" className={styles.button}>
        Add Job
      </button>
    </form>
  );
};

export default JobForm;

