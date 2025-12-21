import axios, { AxiosInstance } from 'axios';
import { API_BASE_URL } from '../config/api';
import { Job, SearchJobsResponse, AppliedJob } from '../types';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async searchJobs(query: string, page: number = 1): Promise<SearchJobsResponse> {
    try {
      const response = await this.client.get<SearchJobsResponse>('/jobs', {
        params: { query, page },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
          throw new Error(
            'Unable to connect to server. Please make sure the server is running on port 3000.'
          );
        }
        if (error.response) {
          throw new Error(
            `Server error: ${error.response.status} - ${error.response.statusText}`
          );
        }
      }
      throw new Error('Failed to fetch job listings');
    }
  }

  // Applied jobs API
  async getAppliedJobs(): Promise<AppliedJob[]> {
    try {
      const response = await this.client.get<AppliedJob[]>('/applied-jobs');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const errorData = error.response.data;
          const errorMessage = (
            errorData && 
            typeof errorData === 'object' && 
            ('message' in errorData || 'error' in errorData)
          ) 
            ? (errorData.message || errorData.error || error.response.statusText)
            : error.response.statusText;
          
          if (error.response.status === 503) {
            throw new Error(
              'Database not connected. Please ensure MongoDB is running and the server is properly connected.'
            );
          }
          
          throw new Error(`Failed to fetch applied jobs: ${errorMessage}`);
        }
        if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
          throw new Error(
            'Unable to connect to server. Please make sure the server is running on port 3000.'
          );
        }
      }
      throw new Error('Failed to fetch applied jobs');
    }
  }

  async applyForJob(jobId: string, jobData: Job): Promise<void> {
    try {
      await this.client.post('/applied-jobs', {
        jobId,
        jobData,
      });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorData = error.response.data;
        const errorMessage = (
          errorData && 
          typeof errorData === 'object' && 
          ('message' in errorData || 'error' in errorData)
        )
          ? (errorData.message || errorData.error || 'Failed to apply for job')
          : 'Failed to apply for job';
        throw new Error(errorMessage);
      }
      throw new Error('Failed to apply for job');
    }
  }

  async deleteAppliedJob(id: string): Promise<void> {
    try {
      await this.client.delete(`/applied-jobs/${id}`);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorData = error.response.data;
        const errorMessage = (
          errorData && 
          typeof errorData === 'object' && 
          ('message' in errorData || 'error' in errorData)
        )
          ? (errorData.message || errorData.error || 'Failed to delete job')
          : 'Failed to delete job';
        throw new Error(errorMessage);
      }
      throw new Error('Failed to delete job');
    }
  }
}

export const apiClient = new ApiClient();

