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
  <div className={styles.inputWrapper}>
    <label className={styles.label}>
      {label && type !== 'checkbox' && <span>{label}</span>}
      <input
        type={type}
        name={name}
        value={type === 'checkbox' ? undefined : (value as string | number)}
        checked={type === 'checkbox' ? Boolean(value) : undefined}
        onChange={onChange}
        placeholder={type !== 'checkbox' ? placeholder : undefined}
        min={min}
        max={max}
        className={type === 'checkbox' ? styles.checkbox : styles.input}
      />
      {label && type === 'checkbox' && <div>{label}</div>}
    </label>
  </div>
);

export default FormInput;
