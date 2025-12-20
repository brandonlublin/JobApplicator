import styles from './JobForm.module.css';

interface FormSelectProps {
  name: string;
  label?: string;
  value: string;
  options: string[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const FormSelect = ({ name, label, value, options, onChange }: FormSelectProps) => (
  <div className={styles.selectWrapper}>
    {label && <label htmlFor={name} className={styles.label}>{label}</label>}
    <select id={name} name={name} value={value} onChange={onChange} className={styles.select}>
      <option value="">Select an option</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

export default FormSelect;

