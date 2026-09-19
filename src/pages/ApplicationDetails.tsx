import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { BottomNav } from '../components/layout/BottomNav';
import { ApplicationFollowUp } from '../components/applications/ApplicationFollowUp';
import { ApplicationTimeline } from '../components/applications/ApplicationTimeline';
import { ArrowLeft, Building2, Calendar, MapPin } from 'lucide-react';
import { api } from '../services/api';
import { storageService } from '../services/storageService';
import { Application } from '../types/application';
import { Job } from '../types/job';

export const ApplicationDetails: React.FC = () => {
  const { applicationId } = useParams();
  const profile = storageService.getStudentProfile();
  
  const [application, setApplication] = useState<Application | null>(null);
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!applicationId) return;
      try {
        const app = storageService.getApplicationById(applicationId);
        if (app) {
          setApplication(app);
          const fetchedJob = await api.getJobById(app.jobId);
          setJob(fetchedJob);
        }
      } catch (error) {
        console.error('Failed to load application details', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [applicationId]);

  const handleUpdate = (action: string, answer: string, details?: any) => {
    if (!application) return;

    const updatedApp = { ...application, status: action as any };
    
    if (details?.interviewDate) {
      updatedApp.interviewDate = details.interviewDate;
    }
    
    let notes = '';
    if (details?.interviewMode) notes += `Mode: ${details.interviewMode}\n`;
    if (details?.position) notes += `Position: ${details.position}\n`;
    if (details?.salary) notes += `Salary: ${details.salary}\n`;

    storageService.addApplicationEvent(application.id, {
      type: action,
      answer,
      date: new Date().toISOString(),
      notes: notes.trim() || undefined
    });

    storageService.updateApplication(updatedApp);
    setApplication(storageService.getApplicationById(application.id));
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-transparent font-sans antialiased">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header user={profile || undefined} />
          <div className="p-8 flex items-center justify-center flex-1">
            <div className="animate-spin w-8 h-8 border-3 border-slate-200 border-t-blue-600 rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!application || !job) {
    return (
      <div className="flex h-screen bg-transparent font-sans antialiased">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header user={profile || undefined} />
          <div className="p-12 text-center max-w-md mx-auto my-auto space-y-3">
            <h2 className="text-lg font-bold text-slate-900">Application not found</h2>
            <Link to="/applied-jobs" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold">
              Return to application tracker
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-transparent font-sans antialiased">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={profile || undefined} />
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8">
          <div className="max-w-5xl mx-auto space-y-6">
            <Link 
              to="/applied-jobs" 
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 font-semibold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to application tracker</span>
            </Link>

            {/* Application Overview Header */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-6 sm:p-7 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center shrink-0">
                    {job.companyLogo ? (
                      <img src={job.companyLogo} alt={job.company} className="w-full h-full object-contain p-1" />
                    ) : (
                      <Building2 className="w-6 h-6 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">{job.title}</h1>
                    <p className="text-xs font-semibold text-slate-600 mt-0.5">{job.company}</p>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-2">
                      <span className="flex items-center gap-1 text-slate-600">
                        <Calendar className="w-3.5 h-3.5" />
                        Applied {new Date(application.appliedDate).toLocaleDateString()}
                      </span>
                      <span>·</span>
                      <span>Source: {application.applicationSource}</span>
                    </div>
                  </div>
                </div>

                <div className="self-start sm:self-auto">
                  <span className="inline-block px-3 py-1 rounded-md text-xs font-bold border border-blue-200 bg-blue-50 text-blue-800">
                    {application.status.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>
            </div>

            {/* Timeline & Follow-up Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              <div className="lg:col-span-1">
                <ApplicationFollowUp application={application} onUpdate={handleUpdate} />
              </div>
              <div className="lg:col-span-2">
                <ApplicationTimeline events={application.events} />
              </div>
            </div>

          </div>
        </main>
      </div>

      <BottomNav />
    </div>
  );
};
