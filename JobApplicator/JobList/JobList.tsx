import React from 'react';
import { Job } from '../types';
import styles from './JobList.module.css';

interface JobListProps {
  jobs: Job[];
  onDelete: (id: string) => void;
}

const JobList: React.FC<JobListProps> = ({ jobs, onDelete }) => {
  return (
    <ul className={styles.list}>
      {jobs.map(job => (
        <li key={job.id} className={styles.listItem}>
          <span>{job.company} - {job.roleType}</span>
          <button onClick={() => onDelete(job.id)} className={styles.deleteButton}>Delete</button>
        </li>
      ))}
    </ul>
  );
};

export default JobList;
