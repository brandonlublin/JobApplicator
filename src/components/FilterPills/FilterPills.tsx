import { useState, useEffect, useRef } from 'react';
import styles from './FilterPills.module.css';

const filters = [
  { id: 'hasSalary', label: 'Has Salary' },
  { id: 'job_is_remote', label: 'Remote' },
];

const experienceLevels = [
  { id: 'entry', label: 'Entry-level' },
  { id: 'mid', label: 'Mid-level' },
  { id: 'senior', label: 'Senior' },
  { id: 'staff', label: 'Staff' },
  { id: 'principal', label: 'Principal' },
];

const yearsOptions = [
  { value: '', label: 'Any' },
  { value: '0', label: '0+ years' },
  { value: '1', label: '1+ years' },
  { value: '2', label: '2+ years' },
  { value: '3', label: '3+ years' },
  { value: '5', label: '5+ years' },
  { value: '7', label: '7+ years' },
  { value: '10', label: '10+ years' },
];

interface FilterPillsProps {
  activeFilters: { [key: string]: boolean };
  onToggle: (filterId: string) => void;
  experienceLevels?: string[];
  onExperienceLevelToggle?: (level: string) => void;
  yearsOfExperience?: string;
  onYearsOfExperienceChange?: (years: string) => void;
}

const FilterPills = ({ 
  activeFilters, 
  onToggle,
  experienceLevels: activeLevels = [],
  onExperienceLevelToggle,
  yearsOfExperience = '',
  onYearsOfExperienceChange
}: FilterPillsProps) => {
  const [showLevelDropdown, setShowLevelDropdown] = useState(false);
  const [showYearsDropdown, setShowYearsDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const yearsDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowLevelDropdown(false);
      }
      if (yearsDropdownRef.current && !yearsDropdownRef.current.contains(event.target as Node)) {
        setShowYearsDropdown(false);
      }
    };

    if (showLevelDropdown || showYearsDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLevelDropdown, showYearsDropdown]);

  return (
    <div className={styles.filters}>
      {filters.map((filter) => (
        <button
          key={filter.id}
          className={`${styles.filterPill} ${activeFilters[filter.id] ? styles.active : ''}`}
          onClick={() => onToggle(filter.id)}
        >
          {filter.label}
        </button>
      ))}
      {onExperienceLevelToggle && (
        <div className={styles.levelFilterContainer} ref={dropdownRef}>
          <button
            className={`${styles.filterPill} ${styles.levelFilterButton} ${activeLevels.length > 0 ? styles.active : ''}`}
            onClick={() => setShowLevelDropdown(!showLevelDropdown)}
          >
            Experience Level {activeLevels.length > 0 && `(${activeLevels.length})`}
            <span className={styles.dropdownArrow}>{showLevelDropdown ? '▲' : '▼'}</span>
          </button>
          {showLevelDropdown && (
            <div className={styles.levelDropdown}>
              {experienceLevels.map((level) => (
                <label key={level.id} className={styles.levelOption}>
                  <input
                    type="checkbox"
                    checked={activeLevels.includes(level.id)}
                    onChange={() => onExperienceLevelToggle(level.id)}
                  />
                  <span>{level.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}
      {onYearsOfExperienceChange && (
        <div className={styles.levelFilterContainer} ref={yearsDropdownRef}>
          <button
            className={`${styles.filterPill} ${styles.levelFilterButton} ${yearsOfExperience ? styles.active : ''}`}
            onClick={() => setShowYearsDropdown(!showYearsDropdown)}
          >
            Years of Experience {yearsOfExperience && `(${yearsOptions.find(o => o.value === yearsOfExperience)?.label || yearsOfExperience})`}
            <span className={styles.dropdownArrow}>{showYearsDropdown ? '▲' : '▼'}</span>
          </button>
          {showYearsDropdown && (
            <div className={styles.levelDropdown}>
              {yearsOptions.map((option) => (
                <label key={option.value} className={styles.levelOption}>
                  <input
                    type="radio"
                    name="yearsOfExperience"
                    value={option.value}
                    checked={yearsOfExperience === option.value}
                    onChange={() => {
                      onYearsOfExperienceChange(option.value);
                      setShowYearsDropdown(false);
                    }}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterPills;

