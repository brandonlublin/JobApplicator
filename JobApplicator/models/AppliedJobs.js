import mongoose from 'mongoose';

const appliedJobSchema = new mongoose.Schema({
  jobId: { type: String, required: true, unique: true },
  jobData: {
    job_id: { type: String },
    job_title: { type: String },
    employer_name: { type: String },
    employer_logo: { type: String },
    employer_website: { type: String },
    job_publisher: { type: String },
    job_employment_type: { type: String },
    job_employment_types: { type: [String] },
    job_apply_link: { type: String },
    job_apply_is_direct: { type: Boolean },
    apply_options: [
      {
        publisher: { type: String },
        apply_link: { type: String },
        is_direct: { type: Boolean },
      },
    ],
    job_description: { type: String },
    job_is_remote: { type: Boolean },
    job_posted_at: { type: String },
    job_posted_at_timestamp: { type: Number },
    job_posted_at_datetime_utc: { type: String },
    job_location: { type: String },
    job_city: { type: String },
    job_state: { type: String },
    job_country: { type: String },
    job_latitude: { type: Number },
    job_longitude: { type: Number },
    job_benefits: { type: [String] },
    job_google_link: { type: String },
    job_min_salary: { type: Number },
    job_max_salary: { type: Number },
    interest_level: { type: String },
    manually_added: { type: Boolean },
  }
});

export const AppliedJobs = mongoose.model('AppliedJobs', appliedJobSchema);