import React, { useState } from 'react';
import { ArrowRight, Save } from 'lucide-react';
import { Student } from '../../types/student';
import { SkillInput } from './SkillInput';
import { ExperienceEditor } from './ExperienceEditor';
import { storageService } from '../../services/storageService';

interface ProfileReviewProps {
  parsedData: Partial<Student>;
  onComplete: () => void;
}

export const ProfileReview: React.FC<ProfileReviewProps> = ({ parsedData, onComplete }) => {
  // Merge parsed data with default student template
  const defaultStudent = storageService.initializeDefaultStudent();
  const [profile, setProfile] = useState<Student>({
    ...defaultStudent,
    ...parsedData,
    education: {
      ...defaultStudent.education,
      ...(parsedData.education || {})
    },
    skills: parsedData.skills || [],
    experience: parsedData.experience || [],
    projects: parsedData.projects || [],
    preferences: {
      ...defaultStudent.preferences,
      ...(parsedData.preferences || {})
    }
  });

  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    // Validation
    if (!profile.education.college) {
      setError('Please specify your College/University.');
      return;
    }
    if (!profile.preferences.preferredRoles || profile.preferences.preferredRoles.length === 0) {
      setError('Please add at least one Preferred Role.');
      return;
    }
    if (!profile.preferences.preferredLocations || profile.preferences.preferredLocations.length === 0) {
      setError('Please add at least one Preferred Location.');
      return;
    }

    for (const exp of profile.experience) {
      if (!exp.role) {
        setError('Please specify a role for all experiences.');
        return;
      }
      if (!exp.startDate) {
        setError(`Please specify a start date for your experience as ${exp.role}.`);
        return;
      }
    }

    setError(null);
    profile.profileCompleted = true;
    storageService.setStudentProfile(profile);
    onComplete();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-8 max-w-3xl mx-auto border border-gray-100">
      <div className="mb-8 border-b border-gray-100 pb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Your Profile</h2>
        <p className="text-gray-600">We've extracted this information from your resume. Please review and edit as needed.</p>
      </div>

      <div className="space-y-8">
        {/* Basic Info (Read Only) */}
        <section className="bg-skillhubb-50 p-6 rounded-xl border border-skillhubb-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="w-8 h-8 rounded-full bg-skillhubb-200 text-skillhubb-700 flex items-center justify-center mr-3 text-sm">✓</span>
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <div className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 font-medium">{profile.name}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 font-medium">{profile.email}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <div className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 font-medium">{profile.phone}</div>
            </div>
          </div>
          <p className="text-xs text-skillhubb-600 mt-3 flex items-center">This information is synced with your SkillHubb account.</p>
        </section>

        {/* Education Section */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="w-8 h-8 rounded-full bg-skillhubb-100 text-skillhubb-600 flex items-center justify-center mr-3 text-sm">1</span>
            Education
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Highest Degree</label>
              <input 
                type="text" 
                value={profile.education.degree || ''}
                onChange={e => setProfile({...profile, education: {...profile.education, degree: e.target.value}})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skillhubb-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">College/University</label>
              <input 
                type="text" 
                value={profile.education.college || ''}
                onChange={e => setProfile({...profile, education: {...profile.education, college: e.target.value}})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skillhubb-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Graduation Year</label>
              <input 
                type="number" 
                value={profile.education.graduationYear || ''}
                onChange={e => setProfile({...profile, education: {...profile.education, graduationYear: parseInt(e.target.value)}})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skillhubb-500 outline-none"
              />
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="w-8 h-8 rounded-full bg-skillhubb-100 text-skillhubb-600 flex items-center justify-center mr-3 text-sm">2</span>
            Skills
          </h3>
          <SkillInput 
            skills={profile.skills} 
            onChange={skills => setProfile({...profile, skills})} 
          />
        </section>

        {/* Experience Section */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="w-8 h-8 rounded-full bg-skillhubb-100 text-skillhubb-600 flex items-center justify-center mr-3 text-sm">3</span>
            Experience
          </h3>
          <ExperienceEditor 
            experience={profile.experience}
            onChange={experience => setProfile({...profile, experience})}
          />
        </section>

        {/* Preferences Section */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="w-8 h-8 rounded-full bg-skillhubb-100 text-skillhubb-600 flex items-center justify-center mr-3 text-sm">4</span>
            Job Preferences
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Roles (comma separated)</label>
              <input 
                type="text" 
                value={profile.preferences.preferredRoles.join(', ')}
                onChange={e => setProfile({
                  ...profile, 
                  preferences: {...profile.preferences, preferredRoles: e.target.value.split(',').map(s => s.trim()).filter(Boolean)}
                })}
                placeholder="e.g. Frontend Developer, React Developer"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skillhubb-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Locations (comma separated)</label>
              <input 
                type="text" 
                value={profile.preferences.preferredLocations.join(', ')}
                onChange={e => setProfile({
                  ...profile, 
                  preferences: {...profile.preferences, preferredLocations: e.target.value.split(',').map(s => s.trim()).filter(Boolean)}
                })}
                placeholder="e.g. Gurgaon, Bangalore, Remote"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skillhubb-500 outline-none"
              />
            </div>
          </div>
        </section>
      </div>

      <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col items-end">
        {error && <div className="text-red-500 text-sm font-medium mb-4">{error}</div>}
        <button 
          onClick={handleSave}
          className="bg-skillhubb-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-skillhubb-700 transition-colors flex items-center"
        >
          <Save className="w-5 h-5 mr-2" />
          Save & Continue
        </button>
      </div>
    </div>
  );
};
