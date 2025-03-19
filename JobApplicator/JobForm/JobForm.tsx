import React, { useState } from 'react';
import { Job } from '../types';
import styles from './JobForm.module.css';
import FormInput from './FormInput';
import FormSelect from './FormSelect';
import axios from 'axios';

interface JobFormProps {
  onSubmit: (job: Job) => void;
}

const JobForm: React.FC<JobFormProps> = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState<Job>({
    job_id: '',
    job_title: '',
    employer_name: '',
    job_min_salary: 0,
    job_max_salary: 0,
    job_employment_type: '',
    is_referral: false,
    in_interview_loop: false,
    interview_stage: '',
    interest_level: 1,
    manually_added: false,
    job_location: '',
  });

  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.checked });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newJob = { ...formData, job_id: Date.now().toString() };

    try {
      await axios.post('http://localhost:3000/api/applied-jobs', {
        jobId: newJob.job_id,
        jobData: newJob,
      });
      onSubmit(newJob);
      setFormData({
        job_id: '',
        job_title: '',
        employer_name: '',
        job_min_salary: 0,
        job_max_salary: 0,
        job_employment_type: '',
        is_referral: false,
        in_interview_loop: false,
        interview_stage: '',
        interest_level: 1,
        manually_added: false,
        job_location: '',
      });
      onClose()
    } catch (err) {
      setError('Error adding job to applied jobs');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.inputGroup}>
        <FormInput type="text" name="job_title" placeholder="Job Title" value={formData.job_title} onChange={handleChange} />
        <FormInput type="text" name="employer_name" placeholder="Employer Name" value={formData.employer_name} onChange={handleChange} />
        <FormInput type="text" name="job_location" placeholder="Job Location" value={formData.job_location} onChange={handleChange} />
        <FormInput type="number" name="job_min_salary" placeholder="Min Salary" value={formData.job_min_salary} onChange={handleChange} />
        <FormInput type="number" name="job_max_salary" placeholder="Max Salary" value={formData.job_max_salary} onChange={handleChange} />
      </div>

      <div className={styles.inputGroup}>
        <FormSelect name="job_employment_type" value={formData.job_employment_type} options={['Full-Time', 'Part-Time', 'Contract']} onChange={handleChange} />
        <FormInput type="checkbox" name="is_referral" value={formData.is_referral} onChange={handleCheckboxChange} label="Referral" />
        <FormInput type="checkbox" name="in_interview_loop" value={formData.in_interview_loop} onChange={handleCheckboxChange} label="In Interview Loop" />
        {formData.in_interview_loop && <FormInput type="text" name="interview_stage" placeholder="Interview Stage" value={formData.interview_stage} onChange={handleChange} />}
        <FormInput type="number" name="interest_level" min={1} max={10} value={formData.interest_level} onChange={handleChange} />
      </div>

      <button type="submit" className={styles.button}>Add Job</button>
    </form>
  );
};

export default JobForm;
