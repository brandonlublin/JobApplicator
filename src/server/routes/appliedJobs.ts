import { Router, Request, Response } from 'express';
import { AppliedJobs } from '../../models/AppliedJobs';
import { checkDBConnection } from '../config/database';

const router = Router();

const handleDBError = (err: unknown, res: Response): void => {
  if (err instanceof Error && err.message.includes('buffering')) {
    res.status(503).json({ 
      error: 'Database connection timeout',
      message: 'MongoDB is not responding. Please ensure MongoDB is running.',
      details: 'To start MongoDB: brew services start mongodb-community (macOS)'
    });
  } else {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ 
      error: 'Something went wrong',
      message: errorMessage
    });
  }
};

router.post('/applied-jobs', async (req: Request, res: Response) => {
  const { jobId, jobData } = req.body;

  try {
    if (!checkDBConnection()) {
      return res.status(503).json({ 
        error: 'Database not connected',
        message: 'MongoDB is not running. Please start MongoDB to save jobs.',
        details: 'To start MongoDB: brew services start mongodb-community (macOS)'
      });
    }

    const existingJob = await AppliedJobs.findOne({ jobId });

    if (existingJob) {
      return res.status(400).json({ message: 'Job already applied for' });
    }

    const appliedJob = new AppliedJobs({ jobId, jobData });
    await appliedJob.save();
    res.status(201).json({ message: 'Job applied successfully' });
  } catch (err) {
    console.error('Error applying for job:', err);
    handleDBError(err, res);
  }
});

router.get('/applied-jobs', async (_req: Request, res: Response) => {
  try {
    if (!checkDBConnection()) {
      return res.status(503).json({ 
        error: 'Database not connected',
        message: 'MongoDB is not running. Please start MongoDB to use this feature.',
        details: 'To start MongoDB: brew services start mongodb-community (macOS) or mongod (Linux/Windows)'
      });
    }
    
    const appliedJobs = await AppliedJobs.find();
    res.json(appliedJobs);
  } catch (err) {
    console.error('Error fetching applied jobs:', err);
    handleDBError(err, res);
  }
});

router.delete('/applied-jobs/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    if (!checkDBConnection()) {
      return res.status(503).json({ 
        error: 'Database not connected',
        message: 'MongoDB is not running. Please start MongoDB to delete jobs.',
        details: 'To start MongoDB: brew services start mongodb-community (macOS)'
      });
    }

    const deletedJob = await AppliedJobs.findByIdAndDelete(id);

    if (!deletedJob) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json({ message: 'Job deleted successfully' });
  } catch (err) {
    console.error('Error deleting job:', err);
    handleDBError(err, res);
  }
});

export default router;



