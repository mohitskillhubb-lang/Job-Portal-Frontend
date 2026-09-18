import { Job, JobMatch } from '../types/job';
import { Student } from '../types/student';

export const jobMatcher = {
  calculateMatch: (job: Job, student: Student): JobMatch => {
    let score = 0;
    const matchingSkills: string[] = [];
    const missingSkills: string[] = [];
    const reasons: string[] = [];

    // 1. Skills Match (45% weight)
    const studentSkills = (student.skills || []).map((s: any) => s.name.toLowerCase());
    let matchedSkillsCount = 0;
    
    if (job.skills && job.skills.length > 0) {
      job.skills.forEach(skill => {
        if (studentSkills.some(s => s.includes(skill.toLowerCase()) || skill.toLowerCase().includes(s))) {
          matchingSkills.push(skill);
          matchedSkillsCount++;
        } else {
          missingSkills.push(skill);
        }
      });
    }
    const skillMatchRatio = (job.skills && job.skills.length > 0) ? (matchedSkillsCount / job.skills.length) : 0;
    const skillScore = skillMatchRatio * 45;
    score += skillScore;
    
    if (matchedSkillsCount > 0) {
      reasons.push('✓ Strong skills match');
    }

    // 2. Role Match (30% weight)
    const preferredRoles = student.preferences?.preferredRoles?.map((r: any) => r.toLowerCase()) || [];
    let isRoleMatch = false;
    
    if (preferredRoles.length > 0) {
      isRoleMatch = preferredRoles.some((role: any) => 
        job.title.toLowerCase().includes(role) || role.includes(job.title.toLowerCase())
      );
      if (isRoleMatch) {
        score += 30;
        reasons.push('✓ Matches your preferred role');
      }
    } else {
      score += 15;
    }

    // Penalty for irrelevant jobs
    if (!isRoleMatch && skillMatchRatio === 0) {
      score = score * 0.2; // Severely penalize
    }

    // 3. Experience Match (15% weight)
    if (student.experience?.length === 0 && job.experienceLevel?.toLowerCase().includes('entry')) {
      score += 15;
      reasons.push('✓ Great for freshers');
    } else if ((student.experience?.length || 0) > 0 && !job.experienceLevel?.toLowerCase().includes('intern')) {
      score += 15;
    }

    // 4. Location & Work Mode Match (10% weight combined)
    const preferredLocs = student.preferences?.preferredLocations?.map((l: any) => l.toLowerCase()) || [];
    const isRemote = job.workplaceType?.toLowerCase() === 'remote';
    const hasLocMatch = isRemote || preferredLocs.some((loc: any) => job.location.toLowerCase().includes(loc));
    
    if (hasLocMatch || student.preferences?.willingToRelocate) {
      score += 5;
      if (isRemote) reasons.push('✓ Remote work available');
      else reasons.push('✓ Matches preferred location');
    }

    if ((student.preferences?.workMode as string) === 'Any' || 
        job.workplaceType?.toLowerCase().includes(student.preferences?.workMode?.toLowerCase() || '')) {
      score += 5;
    }

    // Floor the score
    score = Math.floor(score);

    return {
      job,
      matchScore: score,
      matchingSkills,
      missingSkills,
      reasons
    };
  },

  getRecommendedJobs: (jobs: Job[], student: Student): JobMatch[] => {
    const matches = jobs.map(job => jobMatcher.calculateMatch(job, student));
    
    // Sort by score descending and filter for score >= 40
    return matches
      .filter(match => match.matchScore >= 40)
      .sort((a, b) => b.matchScore - a.matchScore);
  }
};
