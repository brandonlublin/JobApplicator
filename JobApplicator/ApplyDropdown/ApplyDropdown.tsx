import React, { useState } from 'react';
import styles from './ApplyDropdown.module.css';

interface ApplyOption {
  publisher: string;
  apply_link: string;
  is_direct: boolean;
}

interface ApplyDropdownProps {
  jobId: string;
  applyOptions: ApplyOption[];
  handleApply: (option: ApplyOption) => void;
}

const ApplyDropdown: React.FC<ApplyDropdownProps> = ({ jobId, applyOptions, handleApply }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [appliedVia, setAppliedVia] = useState<string | null>(null);

  const handleSelection = (ev, option: ApplyOption) => {
    ev.stopPropagation();
    setAppliedVia(option.publisher);
    handleApply(option);
    window.open(option.apply_link, '_blank');
  };

  return (
    <div className={styles.container}>
      <button className={styles.dropdownButton} onClick={() => setIsOpen(!isOpen)}>
        {appliedVia ? `Applied Via ${appliedVia}` : 'Apply via...'}
        <span className={styles.arrow}>&#9662;</span>
      </button>
      {isOpen && (
        <ul className={styles.dropdownMenu}>
          {applyOptions.map((option, index) => (
            <li key={index} onClick={(ev) => handleSelection(ev, option)}>
              {option.publisher}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ApplyDropdown;
