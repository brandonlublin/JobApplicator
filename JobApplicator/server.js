import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { AppliedJobs } from './models/AppliedJobs.js';

dotenv.config();

const app = express();
app.use(cors({ origin: 'http://localhost:5173', methods: 'GET,POST,DELETE', credentials: true }));
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/jobTracker', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error(err));

const API_URL = 'https://jsearch.p.rapidapi.com/search';
const RAPIDAPI_KEY = process.env.VITE_API_KEY;

if (!RAPIDAPI_KEY) {
  console.error('API key is missing from environment variables');
  process.exit(1);
}

app.get('/api/jobs', async (req, res) => {
  const { query, page = 1, numPages = 10 } = req.query;

  try {
    const response = await fetch(
      `${API_URL}?query=${query}&page=${page}&num_pages=${numPages}&country=us&date_posted=all`,
      {
        method: 'GET',
        headers: {
          'x-rapidapi-key': RAPIDAPI_KEY,
          'x-rapidapi-host': 'jsearch.p.rapidapi.com',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch job listings');
    }

    const data = await response.json();
    res.json({ jobs: data.data, totalPages: data.total_pages || 1 });
  } catch (error) {
    console.error('Error fetching job listings:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.post('/api/applied-jobs', async (req, res) => {
  const { jobId, jobData } = req.body;

  try {
    const existingJob = await AppliedJobs.findOne({ jobId });

    if (existingJob) {
      return res.status(400).json({ message: 'Job already applied for' });
    }

    const appliedJob = new AppliedJobs({ jobId, jobData });
    await appliedJob.save();
    res.status(201).json({ message: 'Job applied successfully' });
  } catch (err) {
    console.error('Error applying for job:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.get('/api/applied-jobs', async (req, res) => {
  try {
    const appliedJobs = await AppliedJobs.find();
    res.json(appliedJobs);
  } catch (err) {
    console.error('Error fetching applied jobs:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

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

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
