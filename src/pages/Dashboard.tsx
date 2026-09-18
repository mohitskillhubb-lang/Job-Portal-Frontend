import React, { useEffect, useState } from 'react';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { BottomNav } from '../components/layout/BottomNav';
import { JobCard } from '../components/jobs/JobCard';
import { 
  Sparkles, 
  Briefcase, 
  Bookmark, 
  Calendar, 
  ArrowRight, 
  CheckCircle2, 
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { storageService } from '../services/storageService';
import { profileService } from '../services/profileService';
import { JobMatch } from '../types/job';
import { Application } from '../types/application';

export const Dashboard: React.FC = () => {
  const profile = storageService.getStudentProfile();
  const [recommendations, setRecommendations] = useState<JobMatch[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [savedJobsCount, setSavedJobsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const profileCompletion = profile ? profileService.getProfileCompletion(profile) : 0;

  useEffect(() => {
    const loadData = async () => {
      try {
        if (profile) {
          const recs = await api.getRecommendations(profile);
          setRecommendations(recs.slice(0, 4));
        }
        setApplications(storageService.getApplications());
        setSavedJobsCount(storageService.getSavedJobs().length);
      } catch (error) {
        console.error('Failed to load dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const interviewsCount = applications.filter(a => a.status === 'INTERVIEW_SCHEDULED').length;
  const firstName = profile?.name ? profile.name.split(' ')[0] : 'Candidate';

  return (
    <div className="flex h-screen bg-[#F8F9FA] font-sans antialiased">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={profile || undefined} />
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8">
          <div className="max-w-6xl mx-auto space-y-6">

            {/* Profile Completion Incentive Banner (Gamification) */}
            {profileCompletion < 100 && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50/60 border border-blue-100 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-xs font-bold text-blue-950">
                      Unlock Higher-Accuracy Job Matches ({profileCompletion}% completed)
                    </h2>
                    <p className="text-xs text-blue-800/80 mt-0.5 leading-relaxed">
                      Completing your verified skills and education increases your match score with top engineering recruiters by 40%.
                    </p>
                  </div>
                </div>
                <Link
                  to="/profile?edit=true"
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shrink-0 flex items-center gap-1.5 transition-colors self-start sm:self-auto shadow-2xs"
                >
                  <span>Complete Profile</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}

            {/* Compact Professional KPI Metrics Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Metric 1: Recommended */}
              <Link 
                to="/recommended"
                className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all flex items-center gap-4 group"
              >
                <div className="w-14 h-14 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Sparkles className="w-7 h-7 stroke-[1.8]" />
                </div>
                <div className="min-w-0 text-left">
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider truncate mb-1">
                    Recommended Roles
                  </p>
                  <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-none">
                    {recommendations.length > 0 ? `${recommendations.length}+` : '0'}
                  </p>
                </div>
              </Link>

              {/* Metric 2: Applied */}
              <Link 
                to="/applied-jobs"
                className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all flex items-center gap-4 group"
              >
                <div className="w-14 h-14 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <Briefcase className="w-7 h-7 stroke-[1.8]" />
                </div>
                <div className="min-w-0 text-left">
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider truncate mb-1">
                    Applications Tracked
                  </p>
                  <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-none">
                    {applications.length}
                  </p>
                </div>
              </Link>

              {/* Metric 3: Saved */}
              <Link 
                to="/saved-jobs"
                className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-2xs hover:shadow-md hover:border-purple-300 transition-all flex items-center gap-4 group"
              >
                <div className="w-14 h-14 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <Bookmark className="w-7 h-7 stroke-[1.8]" />
                </div>
                <div className="min-w-0 text-left">
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider truncate mb-1">
                    Saved For Later
                  </p>
                  <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-none">
                    {savedJobsCount}
                  </p>
                </div>
              </Link>
            </div>



            {/* Main Content Discovery Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              {/* Left (65%): Top Recommended Jobs */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-section-heading">Recommended</h2>
                  <Link 
                    to="/recommended" 
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
                  >
                    <span>View all</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="bg-white h-36 rounded-xl border border-slate-200/80 p-5 skeleton-pulse"></div>
                    ))}
                  </div>
                ) : recommendations.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {recommendations.map(match => (
                      <JobCard key={match.job.id} jobMatch={match} studentId={profile?.id} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-xl border border-slate-200/90 p-8 text-center space-y-3 shadow-2xs">
                    <p className="text-xs text-slate-600">
                      No high-confidence matches found yet. Update your preferred roles or add more skills to activate the matcher.
                    </p>
                    <Link
                      to="/profile"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700"
                    >
                      Update Career Preferences
                    </Link>
                  </div>
                )}
              </div>

              {/* Right (35%): Application Activity Tracker */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-section-heading">Applications</h2>
                  <Link 
                    to="/applied-jobs" 
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
                  >
                    <span>Tracker</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3">
                  {applications.length > 0 ? (
                    <div className="divide-y divide-slate-100">
                      {applications.slice(0, 4).map(app => (
                        <Link 
                          key={app.id} 
                          to={`/applications/${app.id}`}
                          className="block py-2.5 first:pt-0 last:pb-0 hover:bg-slate-50/80 -mx-2 px-2 rounded-md transition-colors group"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-xs font-semibold text-slate-800 group-hover:text-blue-600 transition-colors truncate">
                              Application #{app.id.slice(-6)}
                            </span>
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100 shrink-0">
                              {app.status.replace(/_/g, ' ')}
                            </span>
                          </div>
                          <div className="flex items-center justify-between mt-1 text-[11px] text-slate-400">
                            <span>Updated {new Date(app.lastUpdated).toLocaleDateString()}</span>
                            <span className="text-blue-600 font-medium group-hover:underline">View →</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="py-6 text-center space-y-2">
                      <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <p className="text-xs text-slate-500">No active applications tracked yet.</p>
                      <Link 
                        to="/jobs" 
                        className="text-xs font-semibold text-blue-600 hover:underline block"
                      >
                        Explore roles & apply →
                      </Link>
                    </div>
                  )}
                </div>

                {/* Quick Career Target Card */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 text-xs space-y-2">
                  <p className="font-bold text-slate-900 uppercase tracking-wider text-[10px]">
                    Matching Parameters
                  </p>
                  <div className="space-y-1 text-slate-600 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Target Role:</span>
                      <span className="font-medium text-slate-800">{profile?.preferences?.preferredRoles?.[0] || 'Any'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Location:</span>
                      <span className="font-medium text-slate-800">{profile?.preferences?.preferredLocations?.[0] || 'Flexible'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Work Mode:</span>
                      <span className="font-medium text-slate-800">{profile?.preferences?.workMode || 'Hybrid'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>

      <BottomNav />
    </div>
  );
};
