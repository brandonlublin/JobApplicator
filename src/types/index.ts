// Unified job types
export interface Job {
  job_id: string;
  job_title: string;
  employer_name: string;
  employer_logo?: string;
  employer_website?: string;
  job_publisher?: string;
  job_employment_type?: string;
  job_employment_types?: string[];
  job_apply_link?: string;
  job_apply_is_direct?: boolean;
  apply_options?: ApplyOption[];
  job_description?: string;
  job_is_remote?: boolean;
  job_posted_at?: string;
  job_posted_at_timestamp?: number;
  job_posted_at_datetime_utc?: string;
  job_location?: string;
  job_city?: string;
  job_state?: string;
  job_country?: string;
  job_latitude?: number;
  job_longitude?: number;
  job_benefits?: string[];
  job_google_link?: string;
  job_min_salary?: number;
  job_max_salary?: number;
  job_url?: string;
  job_highlights?: {
    Qualifications?: string[];
    Responsibilities?: string[];
    Benefits?: string[];
  };
  interest_level?: number;
  is_referral?: boolean;
  in_interview_loop?: boolean;
  interview_stage?: string;
  manually_added?: boolean;
  applied?: boolean;
  appliedVia?: string;
}

export interface ApplyOption {
  publisher: string;
  apply_link: string;
  is_direct: boolean;
}

export interface JobPosting extends Job {
  company_name?: string;
  location?: string;
}

export interface AppliedJob {
  _id: string;
  jobId: string;
  jobData: Job;
}

export interface SearchJobsResponse {
  jobs: Job[];
  totalPages: number;
}

