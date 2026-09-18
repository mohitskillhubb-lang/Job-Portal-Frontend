import React, { useEffect, useState } from 'react';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { BottomNav } from '../components/layout/BottomNav';
import { JobCard } from '../components/jobs/JobCard';
import { Bookmark, Search, ArrowRight, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import { storageService } from '../services/storageService';
import { Job } from '../types/job';
import { Link } from 'react-router-dom';
import { jobMatcher } from '../utils/jobMatcher';

export const SavedJobs: React.FC = () => {
  const profile = storageService.getStudentProfile();
  const [savedJobsList, setSavedJobsList] = useState<Job[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'title'>('recent');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSavedJobs = async () => {
      try {
        const savedIds = storageService.getSavedJobs().map(s => s.jobId);
        const resolvedJobs = await Promise.all(
          savedIds.map(id => api.getJobById(id).catch(() => null))
        );
        setSavedJobsList(resolvedJobs.filter((job): job is Job => job !== null));
      } catch (error) {
        console.error('Failed to load saved jobs', error);
      } finally {
        setLoading(false);
      }
    };
    loadSavedJobs();
  }, []);

  const filteredJobs = savedJobsList
    .filter(j =>
      j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.company.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return 0; // Default recent order preserved
    });

  return (
    <div className="flex h-screen bg-[#F8F9FA] font-sans antialiased">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={profile || undefined} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8">
          <div className="max-w-6xl mx-auto space-y-6">

            {/* Controls Toolbar */}
            {savedJobsList.length > 0 && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-4 pb-2">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Filter saved roles..."
                      className="pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:ring-1 focus:ring-blue-500 outline-none w-44 sm:w-56"
                    />
                  </div>

                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value as any)}
                    className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 outline-none cursor-pointer"
                  >
                    <option value="recent">Recently saved</option>
                    <option value="title">Role Title (A–Z)</option>
                  </select>
                </div>
              </div>
            )}

            {/* Content List */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="bg-white h-32 rounded-xl border border-slate-200/80 p-5 skeleton-pulse"></div>
                ))}
              </div>
            ) : filteredJobs.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredJobs.map(job => {
                  const match = profile ? jobMatcher.calculateMatch(job, profile) : { job, matchScore: 0, matchingSkills: [], missingSkills: [], reasons: [] };
                  return (
                    <JobCard
                      key={job.id}
                      jobMatch={match}
                      studentId={profile?.id}
                      onSaveToggle={() => setSavedJobsList(prev => prev.filter(j => j.id !== job.id))}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white rounded-xl border border-slate-200/90 text-center shadow-2xs p-8">
                <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-4 shadow-inner">
                  <Bookmark className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No saved jobs yet</h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
                  Save roles that match your career interests to easily compare requirements and apply later.
                </p>
                <Link
                  to="/jobs"
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Browse Jobs
                </Link>
              </div>
            )}

          </div>
        </main>
      </div>

      <BottomNav />
    </div>
  );
};
