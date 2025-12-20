import { useEffect, useState } from 'react';
import { AppliedJob } from '../../types';
import { apiClient } from '../../services/apiClient';
import JobCard from '../JobCard/JobCard';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import styles from './MyJobs.module.css';

const MyJobs = () => {
  const [appliedJobs, setAppliedJobs] = useState<AppliedJob[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const jobs = await apiClient.getAppliedJobs();
        setAppliedJobs(jobs);
        setError(null);
      } catch {
        setError('Error fetching applied jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedJobs();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await apiClient.deleteAppliedJob(id);
      setAppliedJobs((prevJobs) => prevJobs.filter((job) => job._id !== id));
    } catch {
      setError('Error deleting job');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <ul className={styles.list}>
      {appliedJobs.length > 0 ? (
        appliedJobs.map((job) => {
          const uniqueKey = job._id || `${job.jobData?.job_id || 'no-id'}-${job.jobId || 'no-jobId'}`;
          const cardId = job.jobData?.job_id || job._id || uniqueKey;
          return (
            <li key={uniqueKey} className={styles.listItem}>
              <JobCard
                job={job.jobData}
                isPreviouslyAppliedJob={true}
                onButtonClick={() => handleDelete(job._id)}
                isExpanded={expandedCardId === cardId}
                onExpandToggle={() => setExpandedCardId(expandedCardId === cardId ? null : cardId)}
              />
            </li>
          );
        })
      ) : (
        <li className={styles.emptyState}>No applied jobs found.</li>
      )}
    </ul>
  );
};

export default MyJobs;

