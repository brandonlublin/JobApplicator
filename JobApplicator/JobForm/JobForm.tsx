import React, { useState } from 'react';
import { Job } from '../types';
import styles from './JobForm.module.css';
import FormInput from './FormInput';
import FormSelect from './FormSelect';

interface JobFormProps {
  onSubmit: (job: Job) => void;
}

const JobForm: React.FC<JobFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<Job>({
    id: '',
    company: '',
    payScale: '',
    roleType: '',
    isReferral: false,
    inInterviewLoop: false,
    interviewStage: '',
    interestLevel: 1,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.checked });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, id: Date.now().toString() });
    setFormData({ id: '', company: '', payScale: '', roleType: '', isReferral: false, inInterviewLoop: false, interviewStage: '', interestLevel: 1 });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <FormInput type="text" name="company" placeholder="Company" value={formData.company} onChange={handleChange} />
      <FormInput type="text" name="payScale" placeholder="Pay Scale" value={formData.payScale} onChange={handleChange} />
      <FormSelect name="roleType" value={formData.roleType} options={['Full-Time', 'Part-Time', 'Contract']} onChange={handleChange} />
      <FormInput type="checkbox" name="isReferral" value={formData.isReferral} onChange={handleCheckboxChange} label="Referral" />
      <FormInput type="checkbox" name="inInterviewLoop" value={formData.inInterviewLoop} onChange={handleCheckboxChange} label="In Interview Loop" />
      {formData.inInterviewLoop && <FormInput type="text" name="interviewStage" placeholder="Interview Stage" value={formData.interviewStage} onChange={handleChange} />}
      <FormInput type="number" name="interestLevel" min={1} max={10} value={formData.interestLevel} onChange={handleChange} />
      <button type="submit" className={styles.button}>Add Job</button>
    </form>
  );
};

export default JobForm;
