import styles from './JobCard.module.css';
import React, { useState } from 'react';
import axios from 'axios';
import ApplyDropdown from '../ApplyDropdown/ApplyDropdown';
import placeholderImage from '../assets/placeholder-image.png';

const JobCard = ({ job, isPreviouslyAppliedJob = false, onButtonClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isApplied, setIsApplied] = useState(job.applied || false);

  const handleApply = async (option) => {
    try {
      await axios.post('http://localhost:3000/api/applied-jobs', {
        jobId: job.job_id,
        jobData: { ...job, appliedVia: option.publisher },
      });
      setIsApplied(true);
    } catch (err) {
      setError('Error applying for job');
    }
  };

  return (
    <div className={styles.jobCard} onClick={() => setIsExpanded(!isExpanded)}>
      <div className={styles.logoApplyContainer}>
        <img className={styles.logo} src={job.employer_logo ?? placeholderImage} alt={`${job.employer_name} logo`} />
        {isPreviouslyAppliedJob ? (
          <button className={styles.deleteButton} onClick={onButtonClick}>Delete</button>
        ) : (
          <ApplyDropdown 
            jobId={job.job_id} 
            applyOptions={job.apply_options} 
            handleApply={handleApply} 
          />
        )}
      </div>
      <div className={styles.primaryDetails}>
        <div className={styles.jobTitle}>{job.job_title} at {job.employer_name}</div>
      </div>
      <p className={styles.location}>{job.job_location}</p>
      {job?.job_min_salary && job?.job_max_salary && (
        <p className={styles.salary}>Salary Range: ${job?.job_min_salary} - ${job?.job_max_salary}</p>
      )}
      {job?.manually_added && <div className={styles.manuallyAdded}>Manually Added</div>}

      {isExpanded && (
        <div className={styles.expandedContent}>
          {job?.employer_website && (
            <a className={styles.website} href={job.employer_website} target="_blank" rel="noopener noreferrer">
              Company Website
            </a>
          )}
          <div className={styles.detailsSection}>
            <div>Employment Type: {job?.job_employment_type}</div>
          </div>
          <div className={styles.detailsSection}>
            <div>Published by: {job?.job_publisher}</div>
          </div>
          {job?.job_highlights?.Qualifications && (
            <div className={styles.detailsSection}>
              <h4>Job Qualifications:</h4>
              <ul>
                {job?.job_highlights?.Qualifications.map((qualification, index) => (
                  <li key={index}>{qualification}</li>
                ))}
              </ul>
            </div>
          )}
          {job?.job_highlights?.Responsibilities && (
            <div className={styles.detailsSection}>
              <h4>Job Responsibilities:</h4>
              <ul>
                {job?.job_highlights?.Responsibilities.map((responsibility, index) => (
                  <li key={index}>{responsibility}</li>
                ))}
              </ul>
            </div>
          )}
          {job?.job_highlights?.Benefits && (
            <div className={styles.detailsSection}>
              <h4>Job Benefits:</h4>
              <ul>
                {job?.job_highlights?.Benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </div>
          )}
          {/* {job.job_description && (
            <div className={styles.detailsSection}>
              <h4>Job Description</h4>
              <p>{job.job_description}</p>
            </div>
          )} */}
        </div>
      )}
    </div>
  );
};

export default JobCard;
