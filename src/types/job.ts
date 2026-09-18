export type Job = {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  workplaceType: 'Remote' | 'Hybrid' | 'On-site';
  employmentType: 'Internship' | 'Full-time' | 'Part-time' | 'Contract';
  experienceLevel: 'Internship' | 'Entry Level' | 'Associate' | 'Mid-Senior' | 'Director' | 'Executive';
  salary?: string;
  description: string;
  responsibilities?: string;
  requirements?: string;
  skills: string[];
  jobUrl: string;
  postedDate: string;
};

export type JobMatch = {
  job: Job;
  matchScore: number;
  matchingSkills: string[];
  missingSkills: string[];
  reasons: string[];
};
