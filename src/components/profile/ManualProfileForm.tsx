import React, { useState } from 'react';
import { Save, User, GraduationCap, Sparkles, Briefcase, Settings, AlertCircle, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Student } from '../../types/student';
import { SkillInput } from './SkillInput';
import { ExperienceEditor } from './ExperienceEditor';
import { ResumeUpload } from './ResumeUpload';
import { storageService } from '../../services/storageService';
import { skillSanitizer } from '../../utils/skillSanitizer';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';

export const ManualProfileForm: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Student>(() => {
    return storageService.getStudentProfile() || storageService.initializeDefaultStudent();
  });

  const [isFresher, setIsFresher] = useState(profile.experience?.length === 0);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasParsedResume, setHasParsedResume] = useState(false);

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  const handleResumeSuccess = (parsedData: Partial<Student>) => {
    setHasParsedResume(true);
    setProfile(prev => ({
      ...prev,
      ...parsedData,
      skills: skillSanitizer.sanitizeSkills(parsedData.skills || prev.skills),
      education: { ...prev.education, ...(parsedData.education || {}) },
      preferences: { ...prev.preferences, ...(parsedData.preferences || {}) }
    }));
  };

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!profile.name?.trim()) newErrors.name = 'Full name is required';
      if (!profile.email?.trim()) newErrors.email = 'Email address is required';
      else if (!/^\S+@\S+\.\S+$/.test(profile.email)) newErrors.email = 'Invalid email address';
      if (!profile.phone?.trim()) newErrors.phone = 'Phone number is required';
    }

    if (step === 2) {
      if (!profile.education.college?.trim()) {
        newErrors.college = 'College or University is required';
      }
      if (!isFresher) {
        profile.experience.forEach((exp, idx) => {
          if (!exp.role?.trim()) newErrors[`exp_${idx}_role`] = 'Role is required';
          if (!exp.startDate?.trim()) newErrors[`exp_${idx}_startDate`] = 'Start date is required';
        });
      }
    }

    if (step === 3) {
      if (!profile.preferences.preferredRoles || profile.preferences.preferredRoles.length === 0) {
        newErrors.preferredRoles = 'At least one preferred role is required';
      }
      if (!profile.preferences.preferredLocations || profile.preferences.preferredLocations.length === 0) {
        newErrors.preferredLocations = 'At least one preferred location is required';
      }
    }

    setErrors(newErrors);

    // Scroll to the first error
    if (Object.keys(newErrors).length > 0) {
      setTimeout(() => {
        const firstErrorEl = document.querySelector('.error-field');
        if (firstErrorEl) {
          firstErrorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      return false;
    }

    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo(0, 0);
  };

  const handleSave = () => {
    if (validateStep(3)) {
      const updatedProfile = {
        ...profile,
        skills: skillSanitizer.sanitizeSkills(profile.skills),
        profileCompleted: true
      };
      if (isFresher) {
        updatedProfile.experience = [];
      }
      storageService.setStudentProfile(updatedProfile);
      navigate('/dashboard');
    }
  };

  return (
    <div className="flex-1 flex flex-col w-full h-full bg-white">
      {/* Header & Progress */}
      <div className="sticky top-0 z-10 bg-white flex flex-col items-center">
        <div className="w-full max-w-3xl px-4 py-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Add Profile Details</h2>
          <div className="text-sm font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md">
            Step {currentStep}/{totalSteps}
          </div>
        </div>
        <div className="w-full h-0.5 bg-slate-100">
          <div
            className="h-full bg-blue-600 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 max-w-3xl mx-auto w-full">
        {/* STEP 1: Basic Info & Resume */}
        {currentStep === 1 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <section className="space-y-5">
              <ResumeUpload onSuccess={handleResumeSuccess} onCancel={() => { }} />

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Or fill details manually
                  </span>
                </div>
              </div>
            </section>

            <section className="space-y-5">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <User className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-bold text-slate-900">Contact Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-slate-700">Full Name <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    value={profile.name}
                    disabled
                    className="w-full px-4 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm font-medium text-slate-500 cursor-not-allowed outline-none"
                    placeholder="John Doe"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-slate-700">Email Address <span className="text-rose-500">*</span></label>
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full px-4 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm font-medium text-slate-500 cursor-not-allowed outline-none"
                    placeholder="john@example.com"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-slate-700">Phone Number <span className="text-rose-500">*</span></label>
                  <input
                    type="tel"
                    value={profile.phone}
                    disabled
                    className="w-full px-4 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm font-medium text-slate-500 cursor-not-allowed outline-none"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>
            </section>
          </div>
        )}

        {/* STEP 2: Education & Experience */}
        {currentStep === 2 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Education Section */}
            <section className="space-y-5">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <GraduationCap className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-bold text-slate-900">Education Background</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-slate-700">Highest Degree</label>
                  <select
                    value={profile.education.degree}
                    onChange={e => setProfile({ ...profile, education: { ...profile.education, degree: e.target.value } })}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all cursor-pointer"
                  >
                    <option value="">Select Degree</option>
                    <option value="B.Tech">B.Tech / B.E.</option>
                    <option value="M.Tech">M.Tech / M.E.</option>
                    <option value="BCA">BCA</option>
                    <option value="MCA">MCA</option>
                    <option value="B.Sc">B.Sc</option>
                    <option value="Bachelor">Bachelor Degree</option>
                    <option value="Master">Master Degree</option>
                  </select>
                </div>
                <div className={clsx("space-y-1.5", errors.college && "error-field")}>
                  <label className="block text-sm font-semibold text-slate-700">College / University <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    value={profile.education.college}
                    onChange={e => {
                      setProfile({ ...profile, education: { ...profile.education, college: e.target.value } });
                      clearError('college');
                    }}
                    className={clsx("w-full px-4 py-2 bg-slate-50 border rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 outline-none transition-all", errors.college ? "border-rose-300 focus:border-rose-500" : "border-slate-200 focus:border-blue-500")}
                    placeholder="e.g. ABC University"
                  />
                  {errors.college && <span className="text-xs text-rose-600 font-medium flex items-center gap-1 mt-1"><AlertCircle className="w-3 h-3" /> {errors.college}</span>}
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-slate-700">Specialization</label>
                  <input
                    type="text"
                    value={profile.education.specialization}
                    onChange={e => setProfile({ ...profile, education: { ...profile.education, specialization: e.target.value } })}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    placeholder="e.g. Computer Science & Engineering"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-slate-700">Graduation Year</label>
                  <input
                    type="number"
                    value={profile.education.graduationYear || ''}
                    onChange={e => setProfile({ ...profile, education: { ...profile.education, graduationYear: parseInt(e.target.value) || 2026 } })}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>
            </section>

            <hr className="border-slate-100" />

            {/* Experience Section */}
            <section className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-bold text-slate-900">Work Experience</h3>
                </div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={isFresher}
                    onChange={e => setIsFresher(e.target.checked)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded border-slate-300"
                  />
                  <span>I am a student / fresher (No experience)</span>
                </label>
              </div>

              {!isFresher && (
                <div className={clsx(Object.keys(errors).some(k => k.startsWith('exp_')) && "error-field")}>
                  <ExperienceEditor
                    experience={profile.experience || []}
                    onChange={experience => setProfile({ ...profile, experience })}
                    errors={errors}
                    clearError={clearError}
                  />
                </div>
              )}
            </section>
          </div>
        )}

        {/* STEP 3: Skills & Preferences */}
        {currentStep === 3 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Skills Section */}
            <section className="space-y-5">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-bold text-slate-900">Skills & Competencies</h3>
              </div>
              <SkillInput
                skills={profile.skills || []}
                onChange={skills => setProfile({ ...profile, skills })}
              />
            </section>

            <hr className="border-slate-100" />

            {/* Preferences Section */}
            <section className="space-y-5">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <Settings className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-bold text-slate-900">Job Preferences</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={clsx("space-y-1.5", errors.preferredRoles && "error-field")}>
                  <label className="block text-sm font-semibold text-slate-700">Preferred Roles (comma separated) <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    value={profile.preferences.preferredRoles.join(', ')}
                    onChange={e => {
                      setProfile({
                        ...profile,
                        preferences: {
                          ...profile.preferences,
                          preferredRoles: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                        }
                      });
                      clearError('preferredRoles');
                    }}
                    className={clsx("w-full px-4 py-2 bg-slate-50 border rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 outline-none transition-all", errors.preferredRoles ? "border-rose-300 focus:border-rose-500" : "border-slate-200 focus:border-blue-500")}
                    placeholder="e.g. Frontend Developer, React Engineer"
                  />
                  {errors.preferredRoles && <span className="text-xs text-rose-600 font-medium flex items-center gap-1 mt-1"><AlertCircle className="w-3 h-3" /> {errors.preferredRoles}</span>}
                </div>
                <div className={clsx("space-y-1.5", errors.preferredLocations && "error-field")}>
                  <label className="block text-sm font-semibold text-slate-700">Preferred Locations (comma separated) <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    value={profile.preferences.preferredLocations.join(', ')}
                    onChange={e => {
                      setProfile({
                        ...profile,
                        preferences: {
                          ...profile.preferences,
                          preferredLocations: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                        }
                      });
                      clearError('preferredLocations');
                    }}
                    className={clsx("w-full px-4 py-2 bg-slate-50 border rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 outline-none transition-all", errors.preferredLocations ? "border-rose-300 focus:border-rose-500" : "border-slate-200 focus:border-blue-500")}
                    placeholder="e.g. Gurgaon, Bangalore, Remote"
                  />
                  {errors.preferredLocations && <span className="text-xs text-rose-600 font-medium flex items-center gap-1 mt-1"><AlertCircle className="w-3 h-3" /> {errors.preferredLocations}</span>}
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-slate-700">Job Type</label>
                  <select
                    value={profile.preferences.jobType}
                    onChange={e => setProfile({
                      ...profile,
                      preferences: { ...profile.preferences, jobType: e.target.value as any }
                    })}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all cursor-pointer"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Internship">Internship</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-slate-700">Work Mode</label>
                  <select
                    value={profile.preferences.workMode}
                    onChange={e => setProfile({
                      ...profile,
                      preferences: { ...profile.preferences, workMode: e.target.value as any }
                    })}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all cursor-pointer"
                  >
                    <option value="Hybrid">Hybrid</option>
                    <option value="Remote">Remote</option>
                    <option value="On-site">On-site</option>
                  </select>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="sticky bottom-0 z-10 bg-white border-t border-slate-200 px-4 py-3 flex justify-center">
        <div className="w-full max-w-3xl flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              className="px-5 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>
          ) : (
            <div /> // Spacer
          )}

          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-bold flex items-center gap-2 transition-colors shadow-sm"
            >
              {currentStep === 1 ? (hasParsedResume ? 'Preview' : 'Add Manually') : 'Next Step'}
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold flex items-center gap-2 transition-colors shadow-sm"
            >
              <Save className="w-4 h-4" />
              Complete Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
