import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { BottomNav } from '../components/layout/BottomNav';
import { 
  User, 
  Settings, 
  Edit3, 
  MapPin, 
  Mail, 
  Phone, 
  GraduationCap, 
  Briefcase, 
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Save,
  X,
  Plus
} from 'lucide-react';
import { storageService } from '../services/storageService';
import { profileService } from '../services/profileService';
import { SkillInput } from '../components/profile/SkillInput';
import { ExperienceEditor } from '../components/profile/ExperienceEditor';
import { skillSanitizer } from '../utils/skillSanitizer';

export const Profile: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [profile, setProfile] = useState(() => storageService.getStudentProfile());
  const [isEditing, setIsEditing] = useState(queryParams.get('edit') === 'true');
  const navigate = useNavigate();

  if (!profile) return null;

  const completion = profileService.getProfileCompletion(profile);
  const categorizedSkills = skillSanitizer.categorizeSkills(profile.skills || []);

  const handleSave = () => {
    const sanitizedProfile = {
      ...profile,
      skills: skillSanitizer.sanitizeSkills(profile.skills)
    };
    storageService.setStudentProfile(sanitizedProfile);
    setProfile(sanitizedProfile);
    setIsEditing(false);
  };

  const getMissingItems = () => {
    const missing: string[] = [];
    if (!profile.education.degree || !profile.education.college) missing.push('Education details');
    if ((profile.skills || []).length < 5) missing.push('Add at least 5 verified skills');
    if (!profile.preferences.preferredRoles?.length) missing.push('Target job roles');
    if (!profile.preferences.preferredLocations?.length) missing.push('Preferred job locations');
    if ((profile.experience || []).length === 0) missing.push('Work experience or internships');
    return missing;
  };

  const missingItems = getMissingItems();

  return (
    <div className="flex h-screen bg-transparent font-sans antialiased">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={profile} />
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8">
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Profile Header Card */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-blue-600 text-white font-bold text-2xl flex items-center justify-center shrink-0 shadow-2xs">
                    {profile.name.charAt(0)}
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                      {profile.name}
                    </h1>
                    <p className="text-xs font-semibold text-slate-500 mt-0.5">
                      {profile.preferences.preferredRoles?.[0] || 'Software Candidate'}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-2">
                      <span className="flex items-center gap-1 text-slate-600">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        {profile.email}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1 text-slate-600">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        {profile.phone}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1 text-slate-600">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {profile.preferences.preferredLocations?.[0] || 'India'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Edit Controls */}
                {!isEditing ? (
                  <button 
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-2xs self-start sm:self-auto"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{completion < 100 ? 'Complete Profile' : 'Edit Profile'}</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <button 
                      type="button"
                      onClick={() => {
                        setProfile(storageService.getStudentProfile());
                        setIsEditing(false);
                      }}
                      className="px-3 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button 
                      type="button"
                      onClick={handleSave}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 flex items-center gap-1.5 shadow-2xs"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Changes</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Profile Completeness Progress Card */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center">
                    <TrendingUp className="w-3.5 h-3.5" />
                  </div>
                  <h2 className="text-xs font-bold text-slate-900">
                    Profile Strength: <span className="text-blue-600">{completion}% complete</span>
                  </h2>
                </div>
                {completion === 100 ? (
                  <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> All requirements fulfilled!
                  </span>
                ) : (
                  <span className="text-xs text-slate-500">
                    Complete all sections to unlock highest match accuracy
                  </span>
                )}
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-600 h-full rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${completion}%` }}
                />
              </div>

              {/* Missing steps prompt */}
              {missingItems.length > 0 && (
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-slate-400 font-medium">To reach 100%:</span>
                  {missingItems.map((item, idx) => (
                    <span 
                      key={idx} 
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50/80 px-2 py-0.5 rounded border border-blue-100"
                    >
                      + {item}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Career Preferences */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Settings className="w-3.5 h-3.5 text-slate-400" />
                Career Preferences
              </h2>

              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Preferred Roles (comma separated)
                    </label>
                    <input 
                      type="text" 
                      value={profile.preferences.preferredRoles.join(', ')}
                      onChange={e => setProfile({
                        ...profile, 
                        preferences: {
                          ...profile.preferences, 
                          preferredRoles: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                        }
                      })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium focus:ring-1 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Preferred Locations (comma separated)
                    </label>
                    <input 
                      type="text" 
                      value={profile.preferences.preferredLocations.join(', ')}
                      onChange={e => setProfile({
                        ...profile, 
                        preferences: {
                          ...profile.preferences, 
                          preferredLocations: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                        }
                      })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium focus:ring-1 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Job Type</label>
                    <select 
                      value={profile.preferences.jobType}
                      onChange={e => setProfile({
                        ...profile, 
                        preferences: { ...profile.preferences, jobType: e.target.value as any }
                      })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium focus:ring-1 focus:ring-blue-500 outline-none bg-white cursor-pointer"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Internship">Internship</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Work Mode</label>
                    <select 
                      value={profile.preferences.workMode}
                      onChange={e => setProfile({
                        ...profile, 
                        preferences: { ...profile.preferences, workMode: e.target.value as any }
                      })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium focus:ring-1 focus:ring-blue-500 outline-none bg-white cursor-pointer"
                    >
                      <option value="Hybrid">Hybrid</option>
                      <option value="Remote">Remote</option>
                      <option value="On-site">On-site</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div className="p-3 bg-slate-50/70 rounded-lg border border-slate-100">
                    <span className="text-slate-400 block font-medium text-[11px]">Desired Role</span>
                    <span className="font-bold text-slate-800 mt-0.5 block truncate">
                      {profile.preferences.preferredRoles.join(', ') || 'Not specified'}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50/70 rounded-lg border border-slate-100">
                    <span className="text-slate-400 block font-medium text-[11px]">Preferred Location</span>
                    <span className="font-bold text-slate-800 mt-0.5 block truncate">
                      {profile.preferences.preferredLocations.join(', ') || 'Flexible'}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50/70 rounded-lg border border-slate-100">
                    <span className="text-slate-400 block font-medium text-[11px]">Job Type</span>
                    <span className="font-bold text-slate-800 mt-0.5 block">
                      {profile.preferences.jobType}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50/70 rounded-lg border border-slate-100">
                    <span className="text-slate-400 block font-medium text-[11px]">Work Model</span>
                    <span className="font-bold text-slate-800 mt-0.5 block">
                      {profile.preferences.workMode}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Skills: Categorized into Primary, Tools, Additional */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-2xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-slate-400" />
                  Verified Skills & Competencies
                </h2>
                <span className="text-xs text-slate-400">
                  Total: {skillSanitizer.sanitizeSkills(profile.skills || []).length}
                </span>
              </div>

              {isEditing ? (
                <SkillInput 
                  skills={profile.skills || []} 
                  onChange={skills => setProfile({ ...profile, skills })} 
                />
              ) : (
                <div className="space-y-4">
                  {/* Primary Skills */}
                  <div>
                    <h3 className="text-xs font-bold text-slate-700 mb-2">Primary Core Skills</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {categorizedSkills.primary.length > 0 ? (
                        categorizedSkills.primary.map(s => (
                          <span 
                            key={s.name} 
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold"
                          >
                            <span>{s.name}</span>
                            <span className="text-[10px] text-blue-500 font-normal border-l border-blue-200 pl-1 ml-0.5">
                              {s.level}
                            </span>
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400 italic">No primary skills listed.</span>
                      )}
                    </div>
                  </div>

                  {/* Tools & Frameworks */}
                  {categorizedSkills.tools.length > 0 && (
                    <div className="pt-3 border-t border-slate-100">
                      <h3 className="text-xs font-bold text-slate-700 mb-2">Tools & Frameworks</h3>
                      <div className="flex flex-wrap gap-1.5">
                        {categorizedSkills.tools.map(s => (
                          <span 
                            key={s.name} 
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-slate-800 text-xs font-medium"
                          >
                            <span>{s.name}</span>
                            <span className="text-[10px] text-slate-400 border-l border-slate-200 pl-1 ml-0.5">
                              {s.level}
                            </span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Additional Skills */}
                  {categorizedSkills.additional.length > 0 && (
                    <div className="pt-3 border-t border-slate-100">
                      <h3 className="text-xs font-bold text-slate-700 mb-2">Additional Skills</h3>
                      <div className="flex flex-wrap gap-1.5">
                        {categorizedSkills.additional.map(s => (
                          <span 
                            key={s.name} 
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium"
                          >
                            <span>{s.name}</span>
                            <span className="text-[10px] text-slate-400 border-l border-slate-200 pl-1 ml-0.5">
                              {s.level}
                            </span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Experience Section */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                Work Experience
              </h2>

              {isEditing ? (
                <ExperienceEditor 
                  experience={profile.experience || []} 
                  onChange={experience => setProfile({ ...profile, experience })} 
                />
              ) : (
                <div className="space-y-4">
                  {(profile.experience || []).length > 0 ? (
                    profile.experience.map((exp, idx) => (
                      <div key={idx} className="border-b border-slate-100 last:border-0 pb-4 last:pb-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-bold text-slate-900 text-xs sm:text-sm">{exp.role}</h3>
                            <p className="text-blue-600 font-semibold text-xs mt-0.5">{exp.company}</p>
                          </div>
                          <span className="text-[11px] text-slate-400 font-medium">
                            {exp.startDate} – {exp.endDate || 'Present'} · {exp.employmentType}
                          </span>
                        </div>
                        {exp.responsibilities && (
                          <p className="text-xs text-slate-600 mt-2 leading-relaxed whitespace-pre-wrap">
                            {exp.responsibilities}
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 italic">No professional experience recorded yet.</p>
                  )}
                </div>
              )}
            </div>

            {/* Education Section */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                Education Details
              </h2>

              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Degree</label>
                    <input 
                      type="text" 
                      value={profile.education.degree}
                      onChange={e => setProfile({
                        ...profile, 
                        education: { ...profile.education, degree: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium focus:ring-1 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">College / University</label>
                    <input 
                      type="text" 
                      value={profile.education.college}
                      onChange={e => setProfile({
                        ...profile, 
                        education: { ...profile.education, college: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium focus:ring-1 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-slate-50/70 rounded-lg border border-slate-100">
                    <span className="text-slate-400 block font-medium text-[11px]">Degree Program</span>
                    <span className="font-bold text-slate-800 mt-0.5 block">
                      {profile.education.degree || 'Not specified'}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50/70 rounded-lg border border-slate-100">
                    <span className="text-slate-400 block font-medium text-[11px]">Institution</span>
                    <span className="font-bold text-slate-800 mt-0.5 block">
                      {profile.education.college || 'Not specified'}
                    </span>
                  </div>
                </div>
              )}
            </div>

          </div>
        </main>
      </div>

      <BottomNav />
    </div>
  );
};
