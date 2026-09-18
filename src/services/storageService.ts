import { Student } from '../types/student';
import { SavedJob, Application, ApplicationEvent } from '../types/application';
import { skillSanitizer } from '../utils/skillSanitizer';

const PROFILE_KEY = 'skillhubb_student_profile';
const SAVED_JOBS_KEY = 'skillhubb_saved_jobs';
const APPLICATIONS_KEY = 'skillhubb_applications';

export const storageService = {
  getStudentProfile: (): Student | null => {
    const data = localStorage.getItem(PROFILE_KEY);
    if (!data) return null;
    try {
      const parsed: Student = JSON.parse(data);
      if (parsed.skills) {
        parsed.skills = skillSanitizer.sanitizeSkills(parsed.skills);
      }
      return parsed;
    } catch {
      return null;
    }
  },

  setStudentProfile: (profile: Student): void => {
    if (profile.skills) {
      profile.skills = skillSanitizer.sanitizeSkills(profile.skills);
    }
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  },

  initializeDefaultStudent: (): Student => {
    const defaultStudent: Student = {
      id: 'student_123',
      name: 'Mohit Sharma',
      email: 'mohit.sharma@skillhubb.edu',
      phone: '+91 98765 43210',
      education: { degree: '', college: '', specialization: '', graduationYear: new Date().getFullYear() },
      skills: [],
      experience: [],
      projects: [],
      certifications: [],
      preferences: {
        preferredRoles: [],
        preferredLocations: [],
        jobType: 'Full-time',
        workMode: 'Hybrid',
        willingToRelocate: false
      },
      profileCompleted: false
    };
    storageService.setStudentProfile(defaultStudent);
    return defaultStudent;
  },

  getSavedJobs: (): SavedJob[] => {
    const data = localStorage.getItem(SAVED_JOBS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveJob: (jobId: string, studentId: string): void => {
    const savedJobs = storageService.getSavedJobs();
    if (!savedJobs.some(j => j.jobId === jobId)) {
      savedJobs.push({ id: `saved_${Date.now()}`, studentId, jobId, savedAt: new Date().toISOString() });
      localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(savedJobs));
    }
  },

  removeSavedJob: (jobId: string): void => {
    const savedJobs = storageService.getSavedJobs().filter(j => j.jobId !== jobId);
    localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(savedJobs));
  },

  isJobSaved: (jobId: string): boolean => {
    return storageService.getSavedJobs().some(j => j.jobId === jobId);
  },

  getApplications: (): Application[] => {
    const data = localStorage.getItem(APPLICATIONS_KEY);
    return data ? JSON.parse(data) : [];
  },

  getApplicationById: (id: string): Application | null => {
    const apps = storageService.getApplications();
    return apps.find(a => a.id === id) || null;
  },

  createApplication: (application: Omit<Application, 'id' | 'lastUpdated' | 'events'>): Application => {
    const applications = storageService.getApplications();
    const newApp: Application = {
      ...application,
      id: `app_${Date.now()}`,
      lastUpdated: new Date().toISOString(),
      events: [{
        id: `ev_${Date.now()}`,
        applicationId: `app_${Date.now()}`,
        type: application.status,
        answer: 'Initial application via ' + application.applicationSource,
        date: application.appliedDate
      }]
    };
    applications.push(newApp);
    localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(applications));
    return newApp;
  },

  updateApplication: (application: Application): void => {
    const applications = storageService.getApplications();
    const index = applications.findIndex(a => a.id === application.id);
    if (index !== -1) {
      application.lastUpdated = new Date().toISOString();
      applications[index] = application;
      localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(applications));
    }
  },

  addApplicationEvent: (applicationId: string, event: Omit<ApplicationEvent, 'id' | 'applicationId'>): void => {
    const app = storageService.getApplicationById(applicationId);
    if (app) {
      const newEvent: ApplicationEvent = {
        ...event,
        id: `ev_${Date.now()}`,
        applicationId
      };
      app.events.push(newEvent);
      storageService.updateApplication(app);
    }
  }
};
