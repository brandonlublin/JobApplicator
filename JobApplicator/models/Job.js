import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  job_title: String,
  company_name: String,
  location: String,
  job_url: String,
});

export const Job = mongoose.model('Job', jobSchema);