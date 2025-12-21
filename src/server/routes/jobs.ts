import { Router, Request, Response } from 'express';
import fetch from 'node-fetch';

const router = Router();
const API_URL = 'https://jsearch.p.rapidapi.com/search';

const getApiKey = (): string => {
  const key = process.env.RAPIDAPI_KEY || process.env.VITE_API_KEY;
  
  if (!key) {
    throw new Error('RAPIDAPI_KEY environment variable is not set');
  }
  
  return key.trim();
};

const validatePageParams = (page: unknown): number => {
  const pageNum = Number(page);
  if (isNaN(pageNum) || pageNum < 1 || !Number.isInteger(pageNum)) {
    return 1;
  }
  return Math.min(pageNum, 100); // Cap at 100 pages
};

const sanitizeQuery = (query: unknown): string => {
  if (typeof query !== 'string' || !query.trim()) {
    return '';
  }
  // Remove potentially dangerous characters and limit length
  return query.trim().slice(0, 200);
};

router.get('/jobs', async (req: Request, res: Response) => {
  const { query, page } = req.query;
  const pageNum = validatePageParams(page);
  const JOBS_PER_PAGE = 10;
  const sanitizedQuery = sanitizeQuery(query);

  if (!sanitizedQuery) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    const apiKey = getApiKey();
    
    const apiUrl = `${API_URL}?query=${encodeURIComponent(sanitizedQuery)}&page=${pageNum}&num_pages=1&country=us&date_posted=all`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': 'jsearch.p.rapidapi.com',
      },
    });

    if (!response.ok) {
      const statusText = response.statusText || 'Unknown error';
      throw new Error(`API request failed: ${response.status} - ${statusText}`);
    }

    const data = (await response.json()) as { 
      data: unknown[]; 
      total_pages?: number;
      total?: number;
    };
    
    const jobs = Array.isArray(data.data) ? data.data : [];
    
    let totalPages = 1;
    
    if (data.total_pages && data.total_pages > 0) {
      totalPages = Math.min(data.total_pages, 100);
    } else if (data.total && data.total > 0) {
      totalPages = Math.min(Math.ceil(data.total / JOBS_PER_PAGE), 100);
    } else if (jobs.length === JOBS_PER_PAGE) {
      try {
        const nextPageNum = pageNum + 1;
        const testUrl = `${API_URL}?query=${encodeURIComponent(sanitizedQuery)}&page=${nextPageNum}&num_pages=1&country=us&date_posted=all`;
        const testResponse = await fetch(testUrl, {
          method: 'GET',
          headers: {
            'x-rapidapi-key': apiKey,
            'x-rapidapi-host': 'jsearch.p.rapidapi.com',
          },
        });
        if (testResponse.ok) {
          const testData = (await testResponse.json()) as { data: unknown[] };
          const testJobs = Array.isArray(testData.data) ? testData.data : [];
          if (testJobs.length > 0) {
            totalPages = Math.min(Math.max(pageNum + 1, 10), 100);
          } else {
            totalPages = pageNum;
          }
        } else {
          totalPages = pageNum;
        }
      } catch {
        totalPages = pageNum;
      }
    } else {
      totalPages = pageNum;
    }
    
    res.json({ jobs, totalPages });
  } catch (error) {
    if (error instanceof Error && error.message.includes('RAPIDAPI_KEY')) {
      res.status(500).json({ 
        error: 'API key configuration error',
        details: 'RAPIDAPI_KEY environment variable is not set'
      });
    } else {
      res.status(500).json({ 
        error: 'Failed to fetch job listings',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
});

export default router;

