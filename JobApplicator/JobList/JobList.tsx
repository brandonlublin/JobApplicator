import React, { useEffect, useState } from 'react';
import { Job } from '../types';
import axios from 'axios';
import styles from './JobList.module.css';
import { AppliedJobs } from '../models/AppliedJobs';
import JobCard from '../JobCard/JobCard';
interface JobListProps {
  onDelete: (id: string) => void;
}

const JobList: React.FC<JobListProps> = ({  }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/applied-jobs');
        console.log('response', response);
        setAppliedJobs(response.data);
      } catch (err) {
        setError('Error fetching applied jobs');
        console.error(err);
      }
    };

    fetchAppliedJobs();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3000/api/applied-jobs/${id}`);
      setAppliedJobs(prevJobs => prevJobs.filter(job => job._id !== id));
    } catch (err) {
      console.error('Error deleting job:', err);
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <ul className={styles.list}>
      {appliedJobs.length > 0 ? (
        appliedJobs.map(job => (
          console.log('job', job),
          <li key={job?.jobData?.job_id} className={styles.listItem}>
            <JobCard
              job={job.jobData}
              isPreviouslyAppliedJob={true}
              onButtonClick={() => handleDelete(job._id)}
            />
          </li>
        ))
      ) : (
        <li>No applied jobs found.</li>
      )}
    </ul>
  );
};

export default JobList;
