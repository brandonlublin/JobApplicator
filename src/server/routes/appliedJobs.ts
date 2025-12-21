import { Router, Request, Response } from 'express';
import { AppliedJobs } from '../../models/AppliedJobs';
import { checkDBConnection } from '../config/database';

const router = Router();

const handleDBError = (err: unknown, res: Response): void => {
  if (err instanceof Error && err.message.includes('buffering')) {
    res.status(503).json({ 
      error: 'Database connection timeout',
      message: 'MongoDB is not responding. Please ensure MongoDB is running.'
    });
  } else {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ 
      error: 'Internal server error',
      message: errorMessage
    });
  }
};

const validateJobId = (jobId: unknown): string | null => {
  if (typeof jobId !== 'string' || !jobId.trim()) {
    return null;
  }
  return jobId.trim();
};

const validateMongoId = (id: string): boolean => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

router.post('/applied-jobs', async (req: Request, res: Response) => {
  const { jobId, jobData } = req.body;

  const validJobId = validateJobId(jobId);
  if (!validJobId) {
    return res.status(400).json({ 
      error: 'Invalid request',
      message: 'jobId is required and must be a non-empty string'
    });
  }

  if (!jobData || typeof jobData !== 'object') {
    return res.status(400).json({ 
      error: 'Invalid request',
      message: 'jobData is required and must be an object'
    });
  }

  try {
    if (!checkDBConnection()) {
      return res.status(503).json({ 
        error: 'Database not connected',
        message: 'MongoDB is not running. Please start MongoDB to save jobs.'
      });
    }

    const existingJob = await AppliedJobs.findOne({ jobId: validJobId });

    if (existingJob) {
      return res.status(409).json({ 
        error: 'Duplicate entry',
        message: 'Job already applied for'
      });
    }

    const appliedJob = new AppliedJobs({ jobId: validJobId, jobData });
    await appliedJob.save();
    res.status(201).json({ message: 'Job applied successfully' });
  } catch (err) {
    handleDBError(err, res);
  }
});

router.get('/applied-jobs', async (_req: Request, res: Response) => {
  try {
    if (!checkDBConnection()) {
      return res.status(503).json({ 
        error: 'Database not connected',
        message: 'MongoDB is not running. Please start MongoDB to use this feature.'
      });
    }
    
    const appliedJobs = await AppliedJobs.find();
    res.json(appliedJobs);
  } catch (err) {
    handleDBError(err, res);
  }
});

router.delete('/applied-jobs/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || !validateMongoId(id)) {
    return res.status(400).json({ 
      error: 'Invalid request',
      message: 'Invalid job ID format'
    });
  }

  try {
    if (!checkDBConnection()) {
      return res.status(503).json({ 
        error: 'Database not connected',
        message: 'MongoDB is not running. Please start MongoDB to delete jobs.'
      });
    }

    const deletedJob = await AppliedJobs.findByIdAndDelete(id);

    if (!deletedJob) {
      return res.status(404).json({ 
        error: 'Not found',
        message: 'Job not found'
      });
    }

    res.json({ message: 'Job deleted successfully' });
  } catch (err) {
    handleDBError(err, res);
  }
});

export default router;




