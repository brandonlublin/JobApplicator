import React from 'react';
import styles from './JobForm.module.css';

interface FormInputProps {
  label?: string;
  type: 'text' | 'number' | 'checkbox';
  name: string;
  value: string | number | boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  min?: number;
  max?: number;
}

const FormInput: React.FC<FormInputProps> = ({ label, type, name, value, onChange, placeholder, min, max }) => (
  <label className={styles.label}>
    {label && <span>{label}</span>}
    <input type={type} name={name} value={value as string | number} onChange={onChange} placeholder={placeholder} min={min} max={max} className={styles.input} />
  </label>
);

export default FormInput;
