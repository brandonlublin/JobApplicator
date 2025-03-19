import React from 'react';
import styles from './FilterPills.module.css';

const filters = [
  { id: 'hasSalary', label: 'Has Salary' },
  { id: 'job_is_remote', label: 'Remote' },
];

interface FilterPillsProps {
  activeFilters: { [key: string]: boolean };
  onToggle: (filterId: string) => void;
}

const FilterPills: React.FC<FilterPillsProps> = ({ activeFilters, onToggle }) => {
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
    </div>
  );
};

export default FilterPills;
