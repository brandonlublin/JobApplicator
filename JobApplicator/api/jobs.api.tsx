import { AxiosResponse } from 'axios';

export interface JobPosting {
  job_title: string;
  company_name: string;
  location: string;
  job_url: string;
}

const API_URL = 'http://localhost:3000/api/jobs';

export const searchJobs = async (
  query: string,
  page: number = 1,
  numPages: number = 10
): Promise<{ jobs: JobPosting[]; totalPages: number }> => {
  try {
    const response = await fetch(`${API_URL}?query=${query}&page=${page}&numPages=${numPages}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch job listings');
    }

    return response.json();
  } catch (error) {
    console.error('Error searching job listings:', error);
    throw new Error('Failed to fetch job listings');
  }
};
