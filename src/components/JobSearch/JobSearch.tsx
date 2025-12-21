import { useState, useEffect, useMemo } from 'react';
import { Job } from '../../types';
import { apiClient } from '../../services/apiClient';
import { getJobLevel, extractYearsOfExperience, mergeJobsWithoutDuplicates, filterJobsByDate, sortJobsByDate } from '../../helpers/jobHelpers';
import JobCard from '../JobCard/JobCard';
import JobCardSkeleton from '../JobCardSkeleton/JobCardSkeleton';
import SearchBar from '../SearchBar/SearchBar';
import FilterPills from '../FilterPills/FilterPills';
import Pagination from '../Pagination/Pagination';
import styles from './JobSearch.module.css';

const JOBS_PER_PAGE = 10;
const MIN_JOBS_FOR_FILTERING = 50;
const MAX_JOB_AGE_DAYS = 90; // Filter out jobs older than 90 days

const JobSearch = () => {
  const [allFetchedJobs, setAllFetchedJobs] = useState<Job[]>([]); // Cache of all fetched jobs
  const [jobListings, setJobListings] = useState<Job[]>([]); // Current page jobs
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('Software Engineer roles near Seattle');
  const [activeFilters, setActiveFilters] = useState<{ [key: string]: boolean }>({
    hasSalary: false,
    job_is_remote: false,
  });
  const [experienceLevels, setExperienceLevels] = useState<string[]>([]);
  const [yearsOfExperience, setYearsOfExperience] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasSearched, setHasSearched] = useState(false);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  const toggleFilter = async (filterId: string) => {
    const newFilters = { ...activeFilters, [filterId]: !activeFilters[filterId] };
    setActiveFilters(newFilters);
    
    const isEnablingFilter = !activeFilters[filterId];
    const needsMoreJobs = allFetchedJobs.length < MIN_JOBS_FOR_FILTERING;
    
    if (isEnablingFilter && needsMoreJobs) {
      setLoading(true);
      try {
        const pagesToFetch = Math.min(5, Math.ceil(MIN_JOBS_FOR_FILTERING / JOBS_PER_PAGE));
        const fetchPromises = [];
        for (let i = 2; i <= pagesToFetch; i++) {
          fetchPromises.push(apiClient.searchJobs(searchQuery, i));
        }
        const results = await Promise.all(fetchPromises);
        
        const allNewJobs: Job[] = [];
        results.forEach(({ jobs }) => {
          allNewJobs.push(...jobs);
        });
        
        setAllFetchedJobs((prev) => mergeJobsWithoutDuplicates(prev, allNewJobs));
      } catch (err) {
        // Silently fail - user filters will still work with existing cached jobs
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleExperienceLevel = (level: string) => {
    setExperienceLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  };

  const handleSearch = async (query?: string) => {
    const searchTerm = query || searchQuery;
    setLoading(true);
    setError(null);
    setHasSearched(true);
    setCurrentPage(1);
    setAllFetchedJobs([]); // Clear cache on new search

    try {
      const { jobs, totalPages } = await apiClient.searchJobs(searchTerm, 1);
      setAllFetchedJobs(jobs); // Cache the results
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
    
    const hasActiveFilters = activeFilters.hasSalary || activeFilters.job_is_remote || 
                             experienceLevels.length > 0 || yearsOfExperience !== '';
    
    if (hasActiveFilters) {
      const jobsNeeded = page * JOBS_PER_PAGE * 2; // Fetch extra to account for filtering
      const pagesNeeded = Math.ceil(jobsNeeded / JOBS_PER_PAGE);
      const pagesFetched = Math.ceil(allFetchedJobs.length / JOBS_PER_PAGE);
      const needsMorePages = pagesFetched < pagesNeeded;
      
      if (needsMorePages) {
        setLoading(true);
        setError(null);
        
        try {
          const fetchPromises = [];
          for (let i = pagesFetched + 1; i <= Math.min(pagesNeeded, 10); i++) {
            fetchPromises.push(apiClient.searchJobs(searchQuery, i));
          }
          const results = await Promise.all(fetchPromises);
          
          const allNewJobs: Job[] = [];
          results.forEach(({ jobs }) => {
            allNewJobs.push(...jobs);
          });
          
          setAllFetchedJobs((prev) => mergeJobsWithoutDuplicates(prev, allNewJobs));
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to fetch job listings';
          setError(errorMessage);
        } finally {
          setLoading(false);
        }
      }
      return;
    }
    
    // No filters active - fetch the specific page from API
    setLoading(true);
    setError(null);

    try {
      const { jobs, totalPages } = await apiClient.searchJobs(searchQuery, page);
      setAllFetchedJobs((prev) => mergeJobsWithoutDuplicates(prev, jobs));
      setTotalPages((prev) => totalPages > prev ? totalPages : prev);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch job listings';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Filter all cached jobs by date first, then apply other filters, then sort by date
  const filteredJobs = useMemo(() => {
    // First, filter out old jobs (older than MAX_JOB_AGE_DAYS)
    const recentJobs = filterJobsByDate(allFetchedJobs, MAX_JOB_AGE_DAYS);
    
    // Then apply user filters
    const userFilteredJobs = recentJobs.filter((job) => {
      const hasSalaryFilter = activeFilters.hasSalary;
      const hasRemoteFilter = activeFilters.job_is_remote;
      const hasExperienceLevelFilter = experienceLevels.length > 0;
      const hasYearsFilter = yearsOfExperience !== '';
      
      if (hasSalaryFilter && !job.job_min_salary && !job.job_max_salary) return false;
      if (hasRemoteFilter && !job.job_is_remote) return false;
      
      if (hasExperienceLevelFilter) {
        const jobLevels = getJobLevel(job.job_title);
        const matches = experienceLevels.some((level) => jobLevels.includes(level));
        if (!matches) return false;
      }

      if (hasYearsFilter) {
        const filterYears = parseInt(yearsOfExperience);
        const foundYears = extractYearsOfExperience(job);
        
        if (foundYears.length > 0) {
          const minRequiredYears = Math.min(...foundYears);
          if (minRequiredYears > filterYears) return false;
        }
      }
      
      return true;
    });
    
    // Finally, sort by most recent first
    return sortJobsByDate(userFilteredJobs);
  }, [allFetchedJobs, activeFilters, experienceLevels, yearsOfExperience]);

  // Paginate filtered results
  const paginatedJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * JOBS_PER_PAGE;
    const endIndex = startIndex + JOBS_PER_PAGE;
    return filteredJobs.slice(startIndex, endIndex);
  }, [filteredJobs, currentPage]);

  const filteredTotalPages = Math.max(1, Math.ceil(filteredJobs.length / JOBS_PER_PAGE));

  // Update displayed jobs when filters or pagination change
  useEffect(() => {
    setJobListings(paginatedJobs);
  }, [paginatedJobs]);

  // Update total pages based on filters
  useEffect(() => {
    const hasActiveFilters = activeFilters.hasSalary || activeFilters.job_is_remote || 
                             experienceLevels.length > 0 || yearsOfExperience !== '';
    if (hasActiveFilters) {
      setTotalPages(filteredTotalPages);
    }
  }, [filteredTotalPages, activeFilters, experienceLevels, yearsOfExperience]);

  // Reset to page 1 when filters change and fetch more pages if needed
  useEffect(() => {
    const hasSearchedWithResults = hasSearched && allFetchedJobs.length > 0;
    if (!hasSearchedWithResults) return;
    
    setCurrentPage(1);
    
    const hasActiveFilters = activeFilters.hasSalary || activeFilters.job_is_remote || 
                             experienceLevels.length > 0 || yearsOfExperience !== '';
    const needsMoreJobs = allFetchedJobs.length < MIN_JOBS_FOR_FILTERING;
    
    if (hasActiveFilters && needsMoreJobs) {
      const fetchMorePages = async () => {
        setLoading(true);
        try {
          const pagesToFetch = Math.min(5, Math.ceil(MIN_JOBS_FOR_FILTERING / JOBS_PER_PAGE));
          const fetchPromises = [];
          for (let i = 2; i <= pagesToFetch; i++) {
            fetchPromises.push(apiClient.searchJobs(searchQuery, i));
          }
          const results = await Promise.all(fetchPromises);
          
          const allNewJobs: Job[] = [];
          results.forEach(({ jobs }) => {
            allNewJobs.push(...jobs);
          });
          
          setAllFetchedJobs((prev) => mergeJobsWithoutDuplicates(prev, allNewJobs));
        } catch (err) {
          // Silently fail - user filters will still work with existing cached jobs
        } finally {
          setLoading(false);
        }
      };
      
      fetchMorePages();
    }
  }, [activeFilters, experienceLevels, yearsOfExperience, hasSearched, allFetchedJobs.length, searchQuery]);

  // Extract conditionals for readability
  const showDefaultState = !hasSearched && !loading && !error;
  const showEmptyState = hasSearched && jobListings.length === 0 && !loading;
  const showResultsSection = hasSearched && (jobListings.length > 0 || loading || allFetchedJobs.length > 0);
  const showFiltersAndPagination = jobListings.length > 0 || allFetchedJobs.length > 0;
  const showPagination = !loading && jobListings.length > 0;
  const showJobList = !loading && jobListings.length > 0;

  return (
    <div className={styles.jobSearch}>
      <SearchBar query={searchQuery} setQuery={setSearchQuery} onSearch={handleSearch} />
      {error && <p className={styles.error}>{error}</p>}
      {showDefaultState && (
        <div className={styles.defaultState}>
          <div className={styles.defaultContent}>
            <h2 className={styles.defaultTitle}>Find Your Next Opportunity</h2>
            <p className={styles.defaultMessage}>
              Search for jobs by role, location, or company. Use filters to narrow down results by salary, remote work, and experience level.
            </p>
            <div className={styles.defaultFeatures}>
              <button 
                className={styles.feature}
                onClick={() => {
                  setSearchQuery('Software Engineer');
                  handleSearch('Software Engineer');
                }}
              >
                <span className={styles.featureIcon}>🔍</span>
                <div>
                  <h3>Software Engineer</h3>
                  <p>Search for software engineering roles</p>
                </div>
              </button>
              <button 
                className={styles.feature}
                onClick={() => {
                  setSearchQuery('Remote Software Engineer');
                  setActiveFilters(prev => ({ ...prev, job_is_remote: true }));
                  handleSearch('Remote Software Engineer');
                }}
              >
                <span className={styles.featureIcon}>🏠</span>
                <div>
                  <h3>Remote Jobs</h3>
                  <p>Find remote-friendly positions</p>
                </div>
              </button>
              <button 
                className={styles.feature}
                onClick={() => {
                  setSearchQuery('Software Engineer');
                  setActiveFilters(prev => ({ ...prev, hasSalary: true }));
                  handleSearch('Software Engineer');
                }}
              >
                <span className={styles.featureIcon}>💰</span>
                <div>
                  <h3>Jobs with Salary</h3>
                  <p>Find positions with salary information</p>
                </div>
              </button>
              <button 
                className={styles.feature}
                onClick={() => {
                  setSearchQuery('Senior Software Engineer');
                  handleSearch('Senior Software Engineer');
                }}
              >
                <span className={styles.featureIcon}>📊</span>
                <div>
                  <h3>Senior Roles</h3>
                  <p>Search for senior-level positions</p>
                </div>
              </button>
            </div>
            <button className={styles.searchButton} onClick={() => handleSearch()}>
              Start Searching
            </button>
          </div>
        </div>
      )}
      {showEmptyState && (
        <div className={styles.emptyState}>
          <p className={styles.emptyMessage}>No jobs found. Try adjusting your search or filters.</p>
        </div>
      )}
      {showResultsSection && (
        <>
          {showFiltersAndPagination && (
            <>
              <FilterPills 
                activeFilters={activeFilters} 
                onToggle={toggleFilter}
                experienceLevels={experienceLevels}
                onExperienceLevelToggle={toggleExperienceLevel}
                yearsOfExperience={yearsOfExperience}
                onYearsOfExperienceChange={setYearsOfExperience}
              />
              {showPagination && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
          {loading ? (
            <ul className={styles.jobList}>
              {Array.from({ length: 10 }).map((_, index) => (
                <JobCardSkeleton key={`skeleton-${index}`} />
              ))}
            </ul>
          ) : (
            showJobList && (
              <ul className={styles.jobList}>
                {jobListings.map((job, index) => {
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
                      showYearsOfExperience={yearsOfExperience !== ''}
                    />
                  );
                })}
              </ul>
            )
          )}
        </>
      )}
    </div>
  );
};

export default JobSearch;

