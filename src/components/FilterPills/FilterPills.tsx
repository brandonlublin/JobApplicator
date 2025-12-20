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

interface FilterPillsProps {
  activeFilters: { [key: string]: boolean };
  onToggle: (filterId: string) => void;
  experienceLevels?: string[];
  onExperienceLevelToggle?: (level: string) => void;
}

const FilterPills = ({ 
  activeFilters, 
  onToggle,
  experienceLevels: activeLevels = [],
  onExperienceLevelToggle
}: FilterPillsProps) => {
  const [showLevelDropdown, setShowLevelDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowLevelDropdown(false);
      }
    };

    if (showLevelDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLevelDropdown]);

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
    </div>
  );
};

export default FilterPills;

