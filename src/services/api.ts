import { Job, JobMatch } from '../types/job';
import { Student } from '../types/student';

const API_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:5000/api';

export const api = {
  getHealth: async () => {
    const response = await fetch(`${API_URL}/health`);
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  },

  getJobs: async (): Promise<Job[]> => {
    const response = await fetch(`${API_URL}/jobs`);
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  },

  searchJobs: async (query: string, location: string, start: number = 0): Promise<Job[]> => {
    const params = new URLSearchParams();
    if (query) params.append('keyword', query);
    if (location) params.append('location', location);
    if (start > 0) params.append('start', start.toString());
    
    const response = await fetch(`${API_URL}/jobs/search?${params.toString()}`);
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  },

  getJobById: async (id: string): Promise<Job> => {
    const response = await fetch(`${API_URL}/jobs/${id}`);
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  },

  getRecommendations: async (profile: Student): Promise<JobMatch[]> => {
    const response = await fetch(`${API_URL}/jobs/recommendations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profile),
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  },

  parseResume: async (file: File): Promise<Partial<Student>> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_URL}/resume/parse`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.error?.message || errorData.error || 'Failed to parse resume';
      throw new Error(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
    }
    return response.json();
  }
};
