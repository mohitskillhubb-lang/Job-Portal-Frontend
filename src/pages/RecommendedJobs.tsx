import React, { useEffect, useState } from 'react';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { BottomNav } from '../components/layout/BottomNav';
import { JobCard } from '../components/jobs/JobCard';
import { api } from '../services/api';
import { storageService } from '../services/storageService';
import { JobMatch } from '../types/job';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const RecommendedJobs: React.FC = () => {
  const profile = storageService.getStudentProfile();
  const [recommendations, setRecommendations] = useState<JobMatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (profile) {
          const recs = await api.getRecommendations(profile);
          setRecommendations(recs);
        }
      } catch (error) {
        console.error('Failed to load recommendations', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className="flex h-screen bg-[#F8F9FA] font-sans antialiased">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={profile || undefined} />
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8">
          <div className="max-w-6xl mx-auto space-y-6">

            {/* List */}
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
              <div className="bg-white rounded-xl border border-slate-200/90 p-12 text-center max-w-lg mx-auto my-12 shadow-2xs space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                  <Sparkles className="w-5 h-5 stroke-[1.8]" />
                </div>
                <h3 className="text-base font-bold text-slate-900">We're still learning your preferences</h3>
                <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                  Complete your profile and add verified skills to receive high-accuracy job recommendations from top employers.
                </p>
                <div className="pt-2">
                  <Link 
                    to="/profile" 
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-2xs"
                  >
                    <span>Complete profile & skills</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>

      <BottomNav />
    </div>
  );
};
