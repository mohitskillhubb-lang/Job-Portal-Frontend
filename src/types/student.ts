export type Education = {
  degree: string;
  college: string;
  specialization: string;
  graduationYear: number;
  cgpa?: string;
  percentage?: string;
};

export type Skill = {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
};

export type Experience = {
  company: string;
  role: string;
  employmentType: string;
  startDate: string;
  endDate?: string;
  responsibilities: string;
};

export type Project = {
  name: string;
  description: string;
  technologies: string[];
  link?: string;
};

export type Certification = {
  name: string;
  issuingOrganization: string;
  url?: string;
};

export type JobPreferences = {
  preferredRoles: string[];
  preferredLocations: string[];
  jobType: 'Internship' | 'Full-time' | 'Part-time' | 'Contract';
  workMode: 'Remote' | 'Hybrid' | 'On-site';
  expectedSalary?: string;
  willingToRelocate: boolean;
};

export type Student = {
  id: string;
  name: string;
  email: string;
  phone: string;
  education: Education;
  skills: Skill[];
  experience: Experience[];
  projects: Project[];
  certifications: Certification[];
  preferences: JobPreferences;
  resume?: string;
  profileCompleted: boolean;
};
