import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import { Job } from './models/Job.js';
import { AppliedJobs } from './models/AppliedJobs.js';

const app = express();

// Enable CORS for your frontend URL
app.use(cors({
  origin: 'http://localhost:5173',  // Allow your frontend to access the API
  methods: 'GET,POST',
  credentials: true,
}));

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/jobTracker', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error(err));

// Fetch all jobs
app.get('/api/jobs', async (req, res) => {
  console.log('Fetching jobs...');
  try {
    const jobs = await Job.find();
    console.log('Jobs fetched:', jobs);
    res.json(jobs);
  } catch (err) {
    console.error('Error fetching jobs:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Apply for a job and save it
app.post('/api/apply', async (req, res) => {
  const { jobId, userId } = req.body;

  try {
    const appliedJob = new AppliedJobs({
      jobId,
      userId,
      appliedAt: new Date(),
    });
    await appliedJob.save();
    res.status(200).send('Job applied successfully');
  } catch (err) {
    res.status(500).send('Error applying for job');
  }
});

// Start server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
