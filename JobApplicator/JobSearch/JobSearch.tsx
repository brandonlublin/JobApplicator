import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { JobPosting, searchJobs } from '../api/jobs.api'; // Assuming this type is already defined
import styles from './jobsearch.module.css';

const JobSearch: React.FC = () => {
  const [jobListings, setJobListings] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('developer jobs in chicago');
  const [appliedJobs, setAppliedJobs] = useState<JobPosting[]>([]);

  useEffect(() => {
    const getJobPostings = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:3000/api/jobs');
        console.log('response', response);
        setJobListings(response.data);
      } catch (err) {

        setError('Error fetching job listings');
      } finally {
        setLoading(false);
      }
    };

    getJobPostings();
  }, []);

  const handleSearch = async () => {
    setLoading(true);

    try {
      const response = await searchJobs(searchQuery);
      setJobListings(response);
    } catch (err) {
      setError('Error searching job listings');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (job: JobPosting) => {
    try {
      await axios.post('http://localhost:3000/api/apply', {
        jobId: job._id,
        userId: 'user123',  // Assuming you track a user ID
      });
      setAppliedJobs((prevState) => [...prevState, job]);
    } catch (err) {
      setError('Error applying for job');
    }
  };

  const handleAddToAppliedJobs = (job: JobPosting) => {
    setAppliedJobs([...appliedJobs, job]);
  };

  return (
    <div className={styles.jobSearch}>
      <input
        type="text"
        className={styles.searchInput}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search for jobs"
      />
      <button className={styles.searchButton} onClick={handleSearch}>Search</button>

      {loading && <p className={styles.loading}>Loading...</p>}
      {error && <p className={styles.error}>{error}</p>}

      <ul className={styles.jobList}>
        {jobListings?.map((job, index) => (
          <li key={index} className={styles.jobListing}>
            <h3 className={styles.jobTitle}>{job.job_title}</h3>
            <p className={styles.jobDetails}>{job.company_name} - {job.location}</p>
            <a className={styles.jobLink} href={job.job_url} target="_blank" rel="noopener noreferrer">View Job</a>

            {/* Apply Button */}
            <button
              className={styles.applyButton}
              onClick={() => handleApply(job)}
            >
              Apply
            </button>
            {appliedJobs.some((appliedJob) => appliedJob.job_url === job.job_url) ? (
              <button
                className={styles.addToAppliedButton}
                onClick={() => handleAddToAppliedJobs(job)}
              >
                Added to Applied Jobs
              </button>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JobSearch;
