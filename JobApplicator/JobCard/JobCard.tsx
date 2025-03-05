import styles from './JobCard.module.css';
import React, { useState } from 'react';
import axios from 'axios';

const JobCard = ({ job, isPreviouslyAppliedJob = false, onButtonClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isApplied, setIsApplied] = useState(job.applied || false);

  const handleApply = async (e) => {
    e.stopPropagation();
    try {
      await axios.post('http://localhost:3000/api/applied-jobs', {
        jobId: job.job_id,
        jobData: job,
      });
      setIsApplied(true);
    } catch (err) {
      setError('Error applying for job');
    }
  };

  return (
    <div className={`${styles.jobCard} ${isExpanded ? styles.expanded : ''}`} onClick={() => setIsExpanded(!isExpanded)}>
      {job.employer_logo && (
        <img className={styles.logo} src={job.employer_logo} alt={`${job.employer_name} logo`} />
      )}
      <div className={styles.primaryDetails}>
        <div className={styles.jobTitle}>{job.job_title} at {job.employer_name}</div>
      </div>
      <p className={styles.location}>{job.job_location}</p>
      {job?.job_min_salary && job?.job_max_salary && <p className={styles.salary}>Salary Range: ${job?.job_min_salary} - ${job?.job_max_salary}</p>}
      {job?.manually_added && <div className={styles.manuallyAdded}>Manually Added</div>}
      {isPreviouslyAppliedJob ? (
        <button className={styles.deleteButton} onClick={onButtonClick}>Delete</button>
      ) : (
        <button className={styles.applyButton} onClick={handleApply} disabled={isApplied}>
          {isApplied ? 'Applied' : 'Apply'}
        </button>
      )}
      {isExpanded && (
        <>
          {job.employer_website && (
            <a className={styles.website} href={job.employer_website} target="_blank" rel="noopener noreferrer">
              Company Website
            </a>
          )}
          <p className={styles.employmentType}>Employment Type: {job.job_employment_type}</p>
          <p className={styles.publisher}>Published by: {job.job_publisher}</p>
          <p className={styles.description}>{job.job_description}</p>
          {job.apply_options && job.apply_options.length > 0 && (
            <div className={styles.applyContainer}>
              <h4>Apply Links:</h4>
              <ul className={styles.applyList}>
                {job.apply_options.map((option, index) => (
                  <li key={index} className={styles.applyItem}>
                    <a className={styles.applyLink} href={option.apply_link} target="_blank" rel="noopener noreferrer">
                      Apply via {option.publisher}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default JobCard;