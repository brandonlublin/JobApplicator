import { Router, Request, Response } from 'express';
import fetch from 'node-fetch';

const router = Router();
const API_URL = 'https://jsearch.p.rapidapi.com/search';
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || process.env.VITE_API_KEY;

if (!RAPIDAPI_KEY) {
  console.error('API key is missing from environment variables');
  process.exit(1);
}

router.get('/jobs', async (req: Request, res: Response) => {
  const { query, page = 1 } = req.query;
  const pageNum = Number(page) || 1;
  const JOBS_PER_PAGE = 10;
  
  // NOTE: JSearch API returns all results regardless of pagination params
  // We manually paginate client-side by slicing the response array
  // This is a known limitation of the API - num_pages parameter doesn't work as expected

  try {
    const response = await fetch(
      `${API_URL}?query=${query}&page=1&num_pages=1&country=us&date_posted=all`,
      {
        method: 'GET',
        headers: {
          'x-rapidapi-key': RAPIDAPI_KEY as string,
          'x-rapidapi-host': 'jsearch.p.rapidapi.com',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch job listings');
    }

    const data = (await response.json()) as { 
      data: unknown[]; 
      total_pages?: number;
      total?: number;
    };
    
    const allJobs = Array.isArray(data.data) ? data.data : [];
    const totalJobs = data.total || allJobs.length;
    const totalPages = data.total_pages || Math.ceil(totalJobs / JOBS_PER_PAGE);
    
    const startIndex = (pageNum - 1) * JOBS_PER_PAGE;
    const endIndex = startIndex + JOBS_PER_PAGE;
    const paginatedJobs = allJobs.slice(startIndex, endIndex);
    
    res.json({ jobs: paginatedJobs, totalPages });
  } catch (error) {
    console.error('Error fetching job listings:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

export default router;

