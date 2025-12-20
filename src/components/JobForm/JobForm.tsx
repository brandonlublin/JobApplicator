import { useState } from 'react';
import { Job } from '../../types';
import { apiClient } from '../../services/apiClient';
import FormInput from './FormInput';
import FormSelect from './FormSelect';
import styles from './JobForm.module.css';

interface JobFormProps {
  onSubmit: () => void;
  onClose: () => void;
}

const JobForm = ({ onSubmit, onClose }: JobFormProps) => {
  const [formData, setFormData] = useState<Partial<Job>>({
    job_title: '',
    employer_name: '',
    job_min_salary: 0,
    job_max_salary: 0,
    job_employment_type: '',
    is_referral: false,
    in_interview_loop: false,
    interview_stage: '',
    interest_level: 1,
    manually_added: true,
    job_location: '',
    job_url: '',
    employer_logo: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [isFetchingLogo, setIsFetchingLogo] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const extractDomain = (url: string): string | null => {
    try {
      const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
      return urlObj.hostname.replace('www.', '');
    } catch {
      return null;
    }
  };

  const getCompanyLogo = async (url: string): Promise<string | null> => {
    const domain = extractDomain(url);
    if (!domain) return null;

    // Use Google's favicon service (most reliable and doesn't require CORS)
    // This service fetches favicons from websites and serves them
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  };

  const handleUrlChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setFormData((prev) => ({ ...prev, job_url: url }));

    // Auto-fetch logo when URL is provided
    if (url && url.length > 10) {
      setIsFetchingLogo(true);
      try {
        const logo = await getCompanyLogo(url);
        if (logo) {
          setFormData((prev) => ({ ...prev, employer_logo: logo }));
        }
      } catch (err) {
        console.error('Error fetching logo:', err);
      } finally {
        setIsFetchingLogo(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newJob: Job = {
      ...formData,
      job_id: Date.now().toString(),
      manually_added: true,
    } as Job;

    try {
      await apiClient.applyForJob(newJob.job_id, newJob);
      onSubmit();
      setFormData({
        job_title: '',
        employer_name: '',
        job_min_salary: 0,
        job_max_salary: 0,
        job_employment_type: '',
        is_referral: false,
        in_interview_loop: false,
        interview_stage: '',
        interest_level: 1,
        manually_added: true,
        job_location: '',
        job_url: '',
        employer_logo: '',
      });
      setError(null);
      onClose();
    } catch {
      setError('Error adding job to applied jobs');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error && <p className={styles.error}>{error}</p>}
      
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Job Information</h3>
        <div className={styles.inputGroup}>
          <FormInput
            type="text"
            name="job_title"
            label="Job Title"
            placeholder="e.g. Senior Software Engineer"
            value={formData.job_title || ''}
            onChange={handleChange}
          />
          <FormInput
            type="text"
            name="employer_name"
            label="Company Name"
            placeholder="e.g. Acme Corp"
            value={formData.employer_name || ''}
            onChange={handleChange}
          />
          <FormInput
            type="text"
            name="job_location"
            label="Location"
            placeholder="e.g. Seattle, WA or Remote"
            value={formData.job_location || ''}
            onChange={handleChange}
          />
        </div>
        <div className={styles.inputGroup}>
          <div className={styles.urlInputWrapper}>
            <FormInput
              type="text"
              name="job_url"
              label="Job Posting URL"
              placeholder="https://company.com/jobs/12345"
              value={formData.job_url || ''}
              onChange={handleUrlChange}
            />
            {isFetchingLogo && (
              <span className={styles.fetchingLogo}>Fetching logo...</span>
            )}
            {formData.employer_logo && !isFetchingLogo && (
              <div className={styles.logoPreview}>
                <img src={formData.employer_logo} alt="Company logo" />
                <span>Logo found</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Compensation & Type</h3>
        <div className={styles.inputGroup}>
          <FormInput
            type="number"
            name="job_min_salary"
            label="Minimum Salary"
            placeholder="e.g. 120000"
            value={formData.job_min_salary || 0}
            onChange={handleChange}
          />
          <FormInput
            type="number"
            name="job_max_salary"
            label="Maximum Salary"
            placeholder="e.g. 180000"
            value={formData.job_max_salary || 0}
            onChange={handleChange}
          />
          <FormSelect
            name="job_employment_type"
            label="Employment Type"
            value={formData.job_employment_type || ''}
            options={['Full-Time', 'Part-Time', 'Contract']}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Application Status</h3>
        <div className={styles.checkboxGroup}>
          <FormInput
            type="checkbox"
            name="is_referral"
            value={formData.is_referral || false}
            onChange={handleCheckboxChange}
            label="Received via referral"
          />
          <FormInput
            type="checkbox"
            name="in_interview_loop"
            value={formData.in_interview_loop || false}
            onChange={handleCheckboxChange}
            label="Currently in interview process"
          />
        </div>
        {formData.in_interview_loop && (
          <div className={styles.inputGroup}>
            <FormInput
              type="text"
              name="interview_stage"
              label="Interview Stage"
              placeholder="e.g. Final Round, Technical Screen, etc."
              value={formData.interview_stage || ''}
              onChange={handleChange}
            />
          </div>
        )}
      </div>

      <div className={styles.section}>
        <FormInput
          type="number"
          name="interest_level"
          label="Interest Level (1-10)"
          min={1}
          max={10}
          value={formData.interest_level || 1}
          onChange={handleChange}
        />
      </div>

      <button type="submit" className={styles.button}>
        Add Job
      </button>
    </form>
  );
};

export default JobForm;

