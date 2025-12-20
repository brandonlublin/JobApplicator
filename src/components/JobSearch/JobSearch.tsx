import { useState } from 'react';
import { Job } from '../../types';
import { apiClient } from '../../services/apiClient';
import JobCard from '../JobCard/JobCard';
import SearchBar from '../SearchBar/SearchBar';
import FilterPills from '../FilterPills/FilterPills';
import Pagination from '../Pagination/Pagination';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import styles from './JobSearch.module.css';

const JobSearch = () => {
  const [jobListings, setJobListings] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('Software Engineer roles near Seattle');
  const [activeFilters, setActiveFilters] = useState<{ [key: string]: boolean }>({
    hasSalary: false,
    job_is_remote: false,
  });
  const [experienceLevels, setExperienceLevels] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasSearched, setHasSearched] = useState(false);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  const toggleFilter = (filterId: string) => {
    setActiveFilters((prev) => ({ ...prev, [filterId]: !prev[filterId] }));
  };

  const toggleExperienceLevel = (level: string) => {
    setExperienceLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  };

  const getJobLevel = (jobTitle: string): string[] => {
    const title = jobTitle.toLowerCase();
    const levels: string[] = [];

    if (/\b(principal|architect|distinguished|fellow)\b/.test(title)) {
      levels.push('principal');
    }
    if (/\bstaff\b/.test(title)) {
      levels.push('staff');
    }
    if (/\b(senior|sr\.|sr\s)\b/.test(title)) {
      levels.push('senior');
    }
    if (/\b(mid|mid-level|ii|iii|2|3)\b/.test(title)) {
      levels.push('mid');
    }
    if (/\b(junior|entry|entry-level|associate|intern|internship|i\s|1\s)\b/.test(title)) {
      levels.push('entry');
    }

    if (levels.length === 0) {
      levels.push('mid');
    }

    return levels;
  };

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setHasSearched(true);
    setCurrentPage(1);

    try {
      const { jobs, totalPages } = await apiClient.searchJobs(searchQuery, 1);
      setJobListings(jobs);
      setTotalPages(totalPages);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch job listings';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = async (page: number) => {
    setCurrentPage(page);
    setLoading(true);
    setError(null);

    try {
      const { jobs, totalPages } = await apiClient.searchJobs(searchQuery, page);
      setJobListings(jobs);
      setTotalPages(totalPages);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch job listings';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobListings.filter((job) => {
    if (activeFilters.hasSalary && !job.job_min_salary && !job.job_max_salary) return false;
    if (activeFilters.job_is_remote && !job.job_is_remote) return false;
    
    if (experienceLevels.length > 0) {
      const jobLevels = getJobLevel(job.job_title);
      const matches = experienceLevels.some((level) => jobLevels.includes(level));
      if (!matches) return false;
    }
    
    return true;
  });

  return (
    <div className={styles.jobSearch}>
      <SearchBar query={searchQuery} setQuery={setSearchQuery} onSearch={handleSearch} />
      {loading && <LoadingSpinner />}
      {error && <p className={styles.error}>{error}</p>}
      {hasSearched && jobListings.length === 0 && !loading && <p>No jobs found.</p>}
      {jobListings.length > 0 && (
        <>
          <FilterPills 
            activeFilters={activeFilters} 
            onToggle={toggleFilter}
            experienceLevels={experienceLevels}
            onExperienceLevelToggle={toggleExperienceLevel}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
          <ul className={styles.jobList}>
            {filteredJobs.map((job, index) => {
              const uniqueKey = job.job_url 
                ? `${job.job_url}-${index}` 
                : `${job.job_id || 'no-id'}-${job.employer_name || 'no-employer'}-${job.job_title || 'no-title'}-${index}`;
              const cardId = job.job_id || uniqueKey;
              return (
                <JobCard
                  key={uniqueKey}
                  job={job}
                  isExpanded={expandedCardId === cardId}
                  onExpandToggle={() => setExpandedCardId(expandedCardId === cardId ? null : cardId)}
                />
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
};

export default JobSearch;

