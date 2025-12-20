import { useState } from 'react';
import { Job, ApplyOption } from '../../types';
import { apiClient } from '../../services/apiClient';
import ApplyDropdown from '../ApplyDropdown/ApplyDropdown';
import placeholderImage from '../../assets/placeholder-image.png';
import styles from './JobCard.module.css';

interface JobCardProps {
  job: Job;
  isPreviouslyAppliedJob?: boolean;
  onButtonClick?: () => void;
  isExpanded?: boolean;
  onExpandToggle?: () => void;
}

const JobCard = ({ 
  job, 
  isPreviouslyAppliedJob = false, 
  onButtonClick,
  isExpanded: controlledExpanded,
  onExpandToggle
}: JobCardProps) => {
  const [internalExpanded, setInternalExpanded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const isExpanded = controlledExpanded !== undefined ? controlledExpanded : internalExpanded;

  const handleApply = async (option: ApplyOption) => {
    try {
      await apiClient.applyForJob(job.job_id, { ...job, appliedVia: option.publisher });
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error applying for job';
      setError(errorMessage);
      throw err; // Re-throw so ApplyDropdown knows it failed
    }
  };

  const handleCardClick = () => {
    if (onExpandToggle) {
      onExpandToggle();
    } else {
      setInternalExpanded(!internalExpanded);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onButtonClick?.();
  };

  return (
    <div className={styles.jobCard} onClick={handleCardClick}>
      <div className={styles.logoApplyContainer}>
        <img
          className={styles.logo}
          src={job.employer_logo ?? placeholderImage}
          alt={`${job.employer_name} logo`}
        />
        {isPreviouslyAppliedJob ? (
          <button className={styles.deleteButton} onClick={handleDeleteClick}>
            Delete
          </button>
        ) : (
          <ApplyDropdown
            applyOptions={job.apply_options || []}
            handleApply={handleApply}
          />
        )}
      </div>
      <div className={styles.primaryDetails}>
        <div className={styles.jobTitle}>
          {job.job_title} at {job.employer_name}
        </div>
      </div>
      <p className={styles.location}>{job.job_location}</p>
      {job?.job_min_salary && job?.job_max_salary && (
        <p className={styles.salary}>
          Salary Range: ${job.job_min_salary} - ${job.job_max_salary}
        </p>
      )}
      {job?.manually_added && <div className={styles.manuallyAdded}>Manually Added</div>}
      {error && <p className={styles.error}>{error}</p>}

      {isExpanded && (
        <div className={styles.expandedContent}>
          {job?.job_url && (
            <a
              className={styles.website}
              href={job.job_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Job Posting
            </a>
          )}
          {job?.employer_website && !job?.job_url && (
            <a
              className={styles.website}
              href={job.employer_website}
              target="_blank"
              rel="noopener noreferrer"
            >
              Company Website
            </a>
          )}
          
          {job?.job_employment_type && (
            <div className={styles.detailsSection}>
              <strong>Employment Type:</strong> {job.job_employment_type}
            </div>
          )}
          
          {job?.appliedVia && (
            <div className={styles.detailsSection}>
              <strong>Applied Via:</strong> {job.appliedVia}
            </div>
          )}
          
          {job?.is_referral && (
            <div className={styles.detailsSection}>
              <strong>Referral:</strong> Yes
            </div>
          )}
          
          {job?.in_interview_loop && (
            <div className={styles.detailsSection}>
              <strong>Interview Status:</strong> In Process
              {job?.interview_stage && (
                <span> - {job.interview_stage}</span>
              )}
            </div>
          )}
          
          {job?.interest_level && (
            <div className={styles.detailsSection}>
              <strong>Interest Level:</strong> {job.interest_level}/10
            </div>
          )}
          
          {job?.job_publisher && (
            <div className={styles.detailsSection}>
              <strong>Published by:</strong> {job.job_publisher}
            </div>
          )}
          
          {job?.job_highlights?.Qualifications && (
            <div className={styles.detailsSection}>
              <h4>Job Qualifications:</h4>
              <ul>
                {job.job_highlights.Qualifications.map((qualification, index) => (
                  <li key={index}>{qualification}</li>
                ))}
              </ul>
            </div>
          )}
          {job?.job_highlights?.Responsibilities && (
            <div className={styles.detailsSection}>
              <h4>Job Responsibilities:</h4>
              <ul>
                {job.job_highlights.Responsibilities.map((responsibility, index) => (
                  <li key={index}>{responsibility}</li>
                ))}
              </ul>
            </div>
          )}
          {job?.job_highlights?.Benefits && (
            <div className={styles.detailsSection}>
              <h4>Job Benefits:</h4>
              <ul>
                {job.job_highlights.Benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default JobCard;

