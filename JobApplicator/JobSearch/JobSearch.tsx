import React, { useState, useEffect } from 'react';
import { JobPosting } from '../api/jobs.api';
import { searchJobs } from '../api/jobs.api';
import styles from './JobSearch.module.css';
import JobCard from '../JobCard/JobCard';
import SearchBar from '../SearchBar/SearchBar';
import FilterPills from '../FilterPills/FilterPills';
import Pagination from '../Pagination/Pagination';

const JobSearch: React.FC = () => {
  const [jobListings, setJobListings] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('Software Engineer roles near Seattle');
  const [activeFilters, setActiveFilters] = useState<{ [key: string]: boolean }>({
    hasSalary: false,
    job_is_remote: false,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasSearched, setHasSearched] = useState(false); // Ensure we don't show empty results before first search

  const toggleFilter = (filterId: string) => {
    setActiveFilters((prev) => ({ ...prev, [filterId]: !prev[filterId] }));
  };

  const JOBS_PER_PAGE = 10;

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setHasSearched(true);
    setCurrentPage(1);
  
    try {
      const { jobs, totalPages } = await searchJobs(searchQuery, 1, JOBS_PER_PAGE);
      setJobListings(jobs);
      setTotalPages(totalPages);
    } catch (err) {
      setError('Failed to fetch job listings');
    } finally {
      setLoading(false);
    }
  };
  
  const handlePageChange = async (page: number) => {
    setCurrentPage(page);
    setLoading(true);
    setError(null);
  
    try {
      const { jobs } = await searchJobs(searchQuery, page, JOBS_PER_PAGE);
      setJobListings(jobs);
    } catch (err) {
      setError('Failed to fetch job listings');
    } finally {
      setLoading(false);
    }
  };
  

  const filteredJobs = jobListings.filter((job) => {
    if (activeFilters.hasSalary && (!job.job_min_salary && !job.job_max_salary)) return false;
    if (activeFilters.job_is_remote && !job.job_is_remote) return false;
    return true;
  });

  return (
    <div className={styles.jobSearch}>
      <SearchBar query={searchQuery} setQuery={setSearchQuery} onSearch={handleSearch} />
      <FilterPills activeFilters={activeFilters} onToggle={toggleFilter} />
      {loading && <p className={styles.loading}>Loading...</p>}
      {error && <p className={styles.error}>{error}</p>}
      {hasSearched && jobListings.length === 0 && !loading && <p>No jobs found.</p>}
      {jobListings.length > 0 && (
        <>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          <ul className={styles.jobList}>
            {filteredJobs.map((job) => (
              <JobCard key={job.job_url} job={job} />
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default JobSearch;
