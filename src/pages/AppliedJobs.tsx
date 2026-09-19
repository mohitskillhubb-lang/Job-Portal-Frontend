import React, { useEffect, useState } from 'react';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { BottomNav } from '../components/layout/BottomNav';
import { 
  Briefcase, 
  ArrowRight, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Building2,
  Filter
} from 'lucide-react';
import { storageService } from '../services/storageService';
import { Application, ApplicationStatus } from '../types/application';
import { Job } from '../types/job';
import { api } from '../services/api';
import { Link } from 'react-router-dom';
import { applicationFollowUp } from '../utils/applicationFollowUp';

interface AppWithJob extends Application {
  jobDetail?: Job;
  hasPendingAction: boolean;
}

export const AppliedJobs: React.FC = () => {
  const profile = storageService.getStudentProfile();
  const [applications, setApplications] = useState<AppWithJob[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadApplications = async () => {
      try {
        const apps = storageService.getApplications();
        const appsWithActions = apps.map(app => {
          const nextQ = applicationFollowUp.getNextQuestion(app);
          return {
            ...app,
            hasPendingAction: !!nextQ
          };
        });

        const allJobs = await api.getJobs();
        const fullApps = appsWithActions.map(app => ({
          ...app,
          jobDetail: allJobs.find(j => j.id === app.jobId)
        }));
        
        fullApps.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
        setApplications(fullApps);
      } catch (error) {
        console.error('Failed to load applications', error);
      } finally {
        setLoading(false);
      }
    };
    loadApplications();
  }, []);

  const getStatusBadge = (status: ApplicationStatus) => {
    let style = 'bg-blue-50 text-blue-700 border-blue-200';
    let label = status.replace(/_/g, ' ');

    if (status.includes('REJECTED') || status.includes('WITHDRAWN')) {
      style = 'bg-rose-50 text-rose-700 border-rose-200';
    } else if (status.includes('OFFER')) {
      style = 'bg-emerald-50 text-emerald-800 border-emerald-200 font-bold';
    } else if (status.includes('INTERVIEW')) {
      style = 'bg-purple-50 text-purple-700 border-purple-200 font-semibold';
    } else if (status.includes('ASSESSMENT')) {
      style = 'bg-amber-50 text-amber-800 border-amber-200';
    }

    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${style}`}>
        {label}
      </span>
    );
  };

  const filteredApps = statusFilter === 'ALL'
    ? applications
    : applications.filter(a => a.status.includes(statusFilter));

  return (
    <div className="flex h-screen bg-transparent font-sans antialiased">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={profile || undefined} />
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8">
          <div className="max-w-6xl mx-auto space-y-6">
            
            {/* Status Filter Tabs */}
            <div className="flex justify-end pb-2">
              {applications.length > 0 && (
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold overflow-x-auto">
                  {['ALL', 'APPLIED', 'INTERVIEW', 'OFFER', 'REJECTED'].map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setStatusFilter(filter)}
                      className={`px-3 py-1 rounded-md transition-colors whitespace-nowrap ${
                        statusFilter === filter
                          ? 'bg-white text-slate-900 shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {filter === 'ALL' ? 'All' : filter.charAt(0) + filter.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Applications Table / Tracker */}
            {loading ? (
              <div className="bg-white rounded-xl border border-slate-200/90 p-5 space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-14 rounded-lg bg-slate-100 skeleton-pulse"></div>
                ))}
              </div>
            ) : filteredApps.length > 0 ? (
              <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        <th className="py-3 px-4">Role & Company</th>
                        <th className="py-3 px-4">Applied Date</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Next Action</th>
                        <th className="py-3 px-4 text-right">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredApps.map(app => (
                        <tr 
                          key={app.id} 
                          className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                          onClick={() => window.location.href = `/applications/${app.id}`}
                        >
                          {/* Role & Company */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 font-bold text-slate-700 text-xs">
                                {app.jobDetail?.companyLogo ? (
                                  <img src={app.jobDetail.companyLogo} alt="" className="w-full h-full object-contain p-0.5 rounded-lg" />
                                ) : (
                                  <Building2 className="w-4 h-4 text-slate-400" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                                  {app.jobDetail?.title || 'Engineering Role'}
                                </p>
                                <p className="text-slate-500 text-[11px] truncate">
                                  {app.jobDetail?.company || 'Company'} · {app.jobDetail?.location || 'Remote'}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Applied Date */}
                          <td className="py-3.5 px-4 text-slate-600 font-medium">
                            {new Date(app.appliedDate).toLocaleDateString()}
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4">
                            {getStatusBadge(app.status)}
                          </td>

                          {/* Next Action */}
                          <td className="py-3.5 px-4">
                            {app.hasPendingAction ? (
                              <span className="inline-flex items-center gap-1.5 text-amber-700 font-semibold text-[11px]">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                                Update Required
                              </span>
                            ) : (
                              <span className="text-slate-400 text-[11px]">
                                In review
                              </span>
                            )}
                          </td>

                          {/* Action Link */}
                          <td className="py-3.5 px-4 text-right">
                            <Link 
                              to={`/applications/${app.id}`}
                              className="inline-flex items-center gap-1 text-blue-600 font-semibold hover:underline"
                              onClick={e => e.stopPropagation()}
                            >
                              <span>Track</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white rounded-xl border border-slate-200/90 text-center shadow-2xs p-8">
                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mb-4">
                  <Briefcase className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No applications yet</h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
                  When you apply for a job, you can track its status and schedule interviews here.
                </p>
                <Link
                  to="/jobs"
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Find Jobs to Apply
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
