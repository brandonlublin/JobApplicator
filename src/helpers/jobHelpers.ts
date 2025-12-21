import { Job } from '../types';

/**
 * Extracts experience level from job title
 * @param jobTitle - The job title to analyze
 * @returns Array of experience levels found in the title
 */
export const getJobLevel = (jobTitle: string): string[] => {
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

/**
 * Extracts years of experience requirement from job text
 * @param job - The job object containing title, description, and highlights
 * @returns Array of years found in the job text
 */
export const extractYearsOfExperience = (job: Job): number[] => {
  const jobText = `${job.job_title} ${job.job_description || ''} ${JSON.stringify(job.job_highlights || {})}`.toLowerCase();
  
  const yearsPatterns = [
    /(\d+)\+?\s*(?:years?|yrs?|yr)\s*(?:of\s*)?(?:experience|exp)/gi,
    /(?:minimum|min|at\s*least|required)\s*(\d+)\s*(?:years?|yrs?|yr)/gi,
    /(\d+)\s*(?:years?|yrs?|yr)\s*(?:of\s*)?(?:experience|exp)/gi,
  ];
  
  const foundYears: number[] = [];
  yearsPatterns.forEach(pattern => {
    const matches = jobText.matchAll(pattern);
    for (const match of matches) {
      const years = parseInt(match[1]);
      if (!isNaN(years)) {
        foundYears.push(years);
      }
    }
  });
  
  return foundYears;
};

/**
 * Merges new jobs into existing array, avoiding duplicates by job_id
 * @param existingJobs - Array of existing jobs
 * @param newJobs - Array of new jobs to merge
 * @returns Combined array without duplicates
 */
export const mergeJobsWithoutDuplicates = (existingJobs: Job[], newJobs: Job[]): Job[] => {
  const existingIds = new Set(existingJobs.map(j => j.job_id));
  const uniqueNewJobs = newJobs.filter(j => j.job_id && !existingIds.has(j.job_id));
  return [...existingJobs, ...uniqueNewJobs];
};

/**
 * Calculates days since job was posted
 * @param job - The job object containing date information
 * @returns Number of days since posted, or null if date is not available
 */
export const getDaysSincePosted = (job: Job): number | null => {
  let postedDate: Date | null = null;

  // Try different date fields in order of preference
  if (job.job_posted_at_timestamp) {
    postedDate = new Date(job.job_posted_at_timestamp * 1000);
  } else if (job.job_posted_at_datetime_utc) {
    postedDate = new Date(job.job_posted_at_datetime_utc);
  } else if (job.job_posted_at) {
    postedDate = new Date(job.job_posted_at);
  }

  if (!postedDate || isNaN(postedDate.getTime())) {
    return null;
  }

  const now = new Date();
  const diffTime = now.getTime() - postedDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
};

/**
 * Formats days since posted into a human-readable string
 * @param days - Number of days since posted
 * @returns Formatted string like "2 days ago", "1 week ago", etc.
 */
export const formatDaysSincePosted = (days: number): string => {
  if (days === 0) {
    return 'Posted today';
  }
  if (days === 1) {
    return '1 day ago';
  }
  if (days < 7) {
    return `${days} days ago`;
  }
  if (days < 14) {
    return '1 week ago';
  }
  if (days < 30) {
    const weeks = Math.floor(days / 7);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  }
  if (days < 365) {
    const months = Math.floor(days / 30);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  }
  const years = Math.floor(days / 365);
  return `${years} year${years > 1 ? 's' : ''} ago`;
};

/**
 * Sorts jobs by most recently posted first
 * @param jobs - Array of jobs to sort
 * @returns Sorted array with most recent jobs first
 */
export const sortJobsByDate = (jobs: Job[]): Job[] => {
  return [...jobs].sort((a, b) => {
    const daysA = getDaysSincePosted(a);
    const daysB = getDaysSincePosted(b);
    
    // Jobs without dates go to the end
    if (daysA === null && daysB === null) return 0;
    if (daysA === null) return 1;
    if (daysB === null) return -1;
    
    // Most recent first (lower days = more recent)
    return daysA - daysB;
  });
};

/**
 * Filters out jobs older than the specified number of days
 * @param jobs - Array of jobs to filter
 * @param maxDaysOld - Maximum age in days (default: 90 days)
 * @returns Filtered array excluding jobs older than maxDaysOld
 */
export const filterJobsByDate = (jobs: Job[], maxDaysOld: number = 90): Job[] => {
  return jobs.filter((job) => {
    const days = getDaysSincePosted(job);
    // Include jobs without date info (manually added, etc.)
    if (days === null) return true;
    return days <= maxDaysOld;
  });
};

