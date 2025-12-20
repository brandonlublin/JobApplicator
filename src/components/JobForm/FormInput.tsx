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

const FormInput = ({
  label,
  type,
  name,
  value,
  onChange,
  placeholder,
  min,
  max,
}: FormInputProps) => {
  if (type === 'checkbox') {
    return (
      <div className={styles.checkboxWrapper}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            name={name}
            checked={Boolean(value)}
            onChange={onChange}
            className={styles.checkbox}
          />
          <span>{label}</span>
        </label>
      </div>
    );
  }

  return (
    <div className={styles.inputWrapper}>
      {label && <label htmlFor={name} className={styles.label}>{label}</label>}
      <input
        type={type}
        id={name}
        name={name}
        value={value as string | number}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        max={max}
        className={styles.input}
      />
    </div>
  );
};

export default FormInput;

