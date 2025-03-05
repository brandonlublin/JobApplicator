import { useState } from 'react';
import { JobPosting, searchJobs } from '../api/jobs.api';

export const useJobSearch = () => {
  const [jobListings, setJobListings] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleSearch = async (query: string) => {
    setLoading(true);
    setError(null);
    console.log('this call', query);
    try {
      const response = await searchJobs(query);
      setJobListings(response.map(job => ({ ...job, applied: false })));
    } catch {
      setError('Error searching job listings');
    } finally {
      setLoading(false);
    }
  };

  return { jobListings, loading, error, handleSearch };
};
