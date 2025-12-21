import { useState, useEffect, useRef } from 'react';
import { ApplyOption } from '../../types';
import styles from './ApplyDropdown.module.css';

interface ApplyDropdownProps {
  applyOptions: ApplyOption[];
  handleApply: (option: ApplyOption) => void;
}

const ApplyDropdown = ({ applyOptions, handleApply }: ApplyDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [appliedVia, setAppliedVia] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelection = async (e: React.MouseEvent, option: ApplyOption) => {
    e.stopPropagation();
    e.preventDefault();
    
    try {
      await handleApply(option);
      setAppliedVia(option.publisher);
      setIsOpen(false);
      
      if (option.apply_link) {
        window.open(option.apply_link, '_blank', 'noopener,noreferrer');
      }
    } catch {
      // Error is already handled by handleApply throwing
    }
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  if (!applyOptions || applyOptions.length === 0) {
    return (
      <div className={styles.container} ref={dropdownRef}>
        <button className={styles.dropdownButton} disabled>
          No Apply Options
        </button>
      </div>
    );
  }

  if (appliedVia) {
    return (
      <div className={styles.container} ref={dropdownRef}>
        <button className={styles.dropdownButton} disabled>
          Applied Via {appliedVia}
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container} ref={dropdownRef} onClick={(e) => e.stopPropagation()}>
      <button 
        className={styles.dropdownButton} 
        onClick={handleToggle}
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        Apply via...
        <span className={styles.arrow}>&#9662;</span>
      </button>
      {isOpen && (
        <ul className={styles.dropdownMenu} role="menu">
          {applyOptions.map((option, index) => (
            <li 
              key={`${option.publisher}-${index}`} 
              onClick={(e) => handleSelection(e, option)}
              role="menuitem"
            >
              {option.publisher}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ApplyDropdown;

