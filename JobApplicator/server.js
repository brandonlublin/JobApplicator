import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import { AppliedJobs } from './models/AppliedJobs.js';

const app = express();

// Enable CORS for your frontend
app.use(cors({ origin: 'http://localhost:5173', methods: 'GET,POST,DELETE', credentials: true }));

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/jobTracker', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error(err));

/**
 * ✅ 1. Apply for a job (Save to MongoDB)
 */
app.post('/api/applied-jobs', async (req, res) => {
  // const { job_title, employer_name, job_location, job_min_salary, job_max_salary, job_description } = req.body;
  const { jobId, jobData } = req.body;

  try { 
    const existingJob = await AppliedJobs.findOne({ jobId });
    
    if (existingJob) {
      return res.status(400).json({ message: 'Job already applied for' });
    }

    // Save job
    const appliedJob = new AppliedJobs({ jobId, jobData });
    await appliedJob.save();

    res.status(201).json({ message: 'Job applied successfully' });
  } catch (err) {
    console.error('Error applying for job:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

/**
 * ✅ 2. Fetch all applied jobs
 */
app.get('/api/applied-jobs', async (req, res) => {
  try {
    const appliedJobs = await AppliedJobs.find();
    res.json(appliedJobs);
  } catch (err) {
    console.error('Error fetching applied jobs:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

/**
 * ✅ 3. Manually add a job (Form Submission)
 */
app.post('/api/applied-jobs/manual', async (req, res) => {
  const { job_title, employer_name, job_location, job_min_salary, job_max_salary, job_description } = req.body;

  try {
    const manualJob = new AppliedJobs({ job_title, employer_name, job_location, job_min_salary, job_max_salary, job_description });
    await manualJob.save();
    res.status(201).json({ message: 'Manual job added successfully' });
  } catch (err) {
    console.error('Error adding manual job:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.delete('/api/applied-jobs/:id', async (req, res) => {
  const { id } = req.params;
  console.log('id', id);
  try {
    const deletedJob = await AppliedJobs.findByIdAndDelete(id);
    if (!deletedJob) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json({ message: 'Job deleted successfully' });
  } catch (err) {
    console.error('Error deleting job:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Start server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
