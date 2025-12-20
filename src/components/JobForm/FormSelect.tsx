import styles from './JobForm.module.css';

interface FormSelectProps {
  name: string;
  value: string;
  options: string[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const FormSelect = ({ name, value, options, onChange }: FormSelectProps) => (
  <div className={styles.selectWrapper}>
    <select name={name} value={value} onChange={onChange} className={styles.select}>
      <option value="">Select {name}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

export default FormSelect;

