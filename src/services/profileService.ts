import type { Student } from '../types/student';
import { storageService } from './storageService';

export const profileService = {
  // Get student profile
  getProfile: (): Student | null => {
    return storageService.getStudentProfile();
  },

  // Save student profile
  saveProfile: (profile: Student): void => {
    storageService.setStudentProfile(profile);
  },

  // Check if profile is completed
  isProfileCompleted: (): boolean => {
    const profile = storageService.getStudentProfile();
    return profile?.profileCompleted || false;
  },

  // Initialize new student profile (simulating login from SkillHubb)
  initializeStudent: (name: string, email: string, phone: string): Student => {
    const student: Student = {
      id: `student_${Date.now()}`,
      name,
      email,
      phone,
      education: {
        degree: '',
        college: '',
        specialization: '',
        graduationYear: new Date().getFullYear(),
      },
      skills: [],
      experience: [],
      projects: [],
      certifications: [],
      preferences: {
        preferredRoles: [],
        preferredLocations: [],
        jobType: 'Full-time',
        workMode: 'Hybrid',
        willingToRelocate: false,
      },
      profileCompleted: false,
    };

    storageService.setStudentProfile(student);
    return student;
  },

  // Update profile completion status
  markProfileCompleted: (): void => {
    const profile = storageService.getStudentProfile();
    if (profile) {
      profile.profileCompleted = true;
      storageService.setStudentProfile(profile);
    }
  },

  // Calculate profile completion percentage
  getProfileCompletion: (profile: Student): number => {
    let completed = 0;
    let total = 6;

    // Education
    if (profile.education.degree && profile.education.college) completed++;
    
    // Skills
    if (profile.skills.length > 0) completed++;
    
    // Experience (optional for freshers)
    if (profile.experience.length > 0) completed++;
    
    // Projects
    if (profile.projects.length > 0) completed++;
    
    // Preferences
    if (profile.preferences.preferredRoles.length > 0 && 
        profile.preferences.preferredLocations.length > 0) completed++;
    
    // Resume
    if (profile.resume) completed++;

    return Math.round((completed / total) * 100);
  },

  // Simulate resume parsing (mock implementation)
  parseResume: (file: File): Promise<Partial<Student>> => {
    return new Promise((resolve) => {
      // Simulate parsing delay
      setTimeout(() => {
        // Mock extracted data
        const mockData: Partial<Student> = {
          education: {
            degree: 'B.Tech',
            college: 'ABC University',
            specialization: 'Computer Science',
            graduationYear: 2026,
            cgpa: '8.5',
          },
          skills: [
            { name: 'React', level: 'Advanced' },
            { name: 'JavaScript', level: 'Advanced' },
            { name: 'TypeScript', level: 'Intermediate' },
            { name: 'HTML', level: 'Advanced' },
            { name: 'CSS', level: 'Advanced' },
            { name: 'Python', level: 'Intermediate' },
          ],
          experience: [],
          projects: [
            {
              name: 'E-commerce Website',
              description: 'Built a full-stack e-commerce platform with React and Node.js',
              technologies: ['React', 'Node.js', 'MongoDB', 'Express'],
            },
          ],
          certifications: [],
          preferences: {
            preferredRoles: ['Frontend Developer', 'Full Stack Developer'],
            preferredLocations: ['Gurgaon', 'Bangalore', 'Delhi'],
            jobType: 'Full-time',
            workMode: 'Hybrid',
            willingToRelocate: true,
          },
        };

        resolve(mockData);
      }, 1500);
    });
  },
};
