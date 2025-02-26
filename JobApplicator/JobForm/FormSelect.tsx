import React from 'react';
import styles from './JobForm.module.css';

interface FormSelectProps {
  name: string;
  value: string;
  options: string[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const FormSelect: React.FC<FormSelectProps> = ({ name, value, options, onChange }) => (
  <select name={name} value={value} onChange={onChange} className={styles.select}>
    <option value="">Select {name}</option>
    {options.map(option => (
      <option key={option} value={option}>{option}</option>
    ))}
  </select>
);

export default FormSelect;
