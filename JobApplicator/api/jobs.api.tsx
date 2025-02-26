import { AxiosResponse } from 'axios';

export interface JobPosting {
  job_title: string;
  company_name: string;
  location: string;
  job_url: string;
}

const API_URL = 'https://jsearch.p.rapidapi.com/search';

const RAPIDAPI_KEY = import.meta.env.VITE_RAPIDAPI_KEY;
if (!RAPIDAPI_KEY) {
  throw new Error('API key is missing from environment variables');
}

const HEADERS = {
  'x-rapidapi-key': RAPIDAPI_KEY,
  'x-rapidapi-host': 'jsearch.p.rapidapi.com',
};

export const fetchAllJobs = async (): Promise<JobPosting[]> => {
  try {
    const response: AxiosResponse = await fetch(`${API_URL}?query=developer%20jobs%20in%20chicago&page=1&num_pages=1&country=us&date_posted=all`, {
      method: 'GET',
      headers: HEADERS,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch job listings');
    }

    const data = await response.json();
    return data.jobs;
  } catch (error) {
    console.error('Error fetching job listings:', error);
    throw new Error('Failed to fetch job listings');
  }
};

export const searchJobs = async (query: string, page: number = 1, numPages: number = 1): Promise<JobPosting[]> => {
  try {
    const response: AxiosResponse = await fetch(`${API_URL}?query=${query}&page=${page}&num_pages=${numPages}&country=us&date_posted=all`, {
      method: 'GET',
      headers: HEADERS,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch job listings');
    }

    const data = await response.json();
    console.log('data', data);
    return data.data;
  } catch (error) {
    console.error('Error searching job listings:', error);
    throw new Error('Failed to fetch job listings');
  }
};
