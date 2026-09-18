import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { BottomNav } from '../components/layout/BottomNav';
import { JobMatch } from '../components/jobs/JobMatch';
import { ApplyConfirmationModal } from '../components/applications/ApplyConfirmationModal';
import { 
  Building2, 
  MapPin, 
  Briefcase, 
  Clock, 
  Bookmark, 
  ArrowLeft, 
  ExternalLink,
  Laptop,
  Calendar,
  Share2,
  CheckCircle2
} from 'lucide-react';
import { api } from '../services/api';
import { storageService } from '../services/storageService';
import { Job, JobMatch as JobMatchType } from '../types/job';
import { jobMatcher } from '../utils/jobMatcher';

export const JobDetails: React.FC = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const profile = storageService.getStudentProfile();
  
  const [job, setJob] = useState<Job | null>(null);
  const [matchInfo, setMatchInfo] = useState<JobMatchType | null>(null);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  
  const isSaved = jobId ? storageService.isJobSaved(jobId) : false;

  useEffect(() => {
    const loadJob = async () => {
      if (!jobId) return;
      try {
        const fetchedJob = await api.getJobById(jobId);
        setJob(fetchedJob);
        
        if (profile) {
          // Calculate direct match
          const calculatedMatch = jobMatcher.calculateMatch(fetchedJob, profile);
          setMatchInfo(calculatedMatch);
        }
      } catch (error) {
        console.error('Failed to load job details', error);
      } finally {
        setLoading(false);
      }
    };
    loadJob();
  }, [jobId]);

  const handleSaveToggle = () => {
    if (!job || !profile) return;
    if (isSaved) {
      storageService.removeSavedJob(job.id);
    } else {
      storageService.saveJob(job.id, profile.id);
    }
    setJob({ ...job });
  };

  const handleApplyClick = () => {
    if (job) {
      window.open(job.jobUrl, '_blank', 'noopener,noreferrer');
      setTimeout(() => setShowApplyModal(true), 1200);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-[#F8F9FA] font-sans antialiased">
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

  if (!job) {
    return (
      <div className="flex h-screen bg-[#F8F9FA] font-sans antialiased">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header user={profile || undefined} />
          <div className="p-12 text-center max-w-md mx-auto my-auto space-y-3">
            <h2 className="text-lg font-bold text-slate-900">Job position not found</h2>
            <p className="text-xs text-slate-500">The listing you are looking for may have expired or been removed.</p>
            <Link to="/jobs" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold">
              Browse all jobs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F8F9FA] font-sans antialiased">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={profile || undefined} />
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Back Navigation Bar */}
            <div className="flex items-center justify-between text-xs">
              <button 
                type="button"
                onClick={() => navigate(-1)} 
                className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-900 font-semibold transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to results</span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900 font-medium transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copiedLink ? 'Link copied!' : 'Share role'}</span>
              </button>
            </div>

            {/* Document Header (Integrated, not box-in-a-box) */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-6 sm:p-7 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  {/* Company Logo */}
                  <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center shrink-0 overflow-hidden">
                    {job.companyLogo && !logoError ? (
                      <img 
                        src={job.companyLogo} 
                        alt={job.company} 
                        className="w-full h-full object-contain p-1"
                        onError={() => setLogoError(true)}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-700 font-bold text-lg">
                        {job.company ? job.company.charAt(0) : <Building2 className="w-6 h-6 text-slate-400" />}
                      </div>
                    )}
                  </div>

                  {/* Title & Organization */}
                  <div className="space-y-1">
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                      {job.title}
                    </h1>
                    <p className="text-sm font-semibold text-slate-600">
                      {job.company}
                    </p>
                    
                    {/* Metadata Line */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 pt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {job.location} ({job.workplaceType})
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                        {job.employmentType}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {job.experienceLevel}
                      </span>
                      {job.postedDate && (
                        <>
                          <span>·</span>
                          <span className="text-slate-400">
                            Posted {new Date(job.postedDate).toLocaleDateString()}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="flex items-center gap-2 pt-2 sm:pt-0 shrink-0">
                  <button 
                    type="button"
                    onClick={handleSaveToggle}
                    className={`px-3.5 py-2 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      isSaved 
                        ? 'bg-blue-50 border-blue-200 text-blue-700' 
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-blue-600' : ''}`} />
                    <span>{isSaved ? 'Saved' : 'Save'}</span>
                  </button>

                  <button 
                    type="button"
                    onClick={handleApplyClick}
                    className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <span>Apply now</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Structured Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start pb-24 lg:pb-0">
              {/* Left (65%): Role Details Document */}
              <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/90 p-6 sm:p-8 space-y-7 shadow-2xs">
                
                {/* Details Overview - very useful for mobile */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Location</p>
                    <p className="text-xs font-semibold text-slate-800">{job.location}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Work Model</p>
                    <p className="text-xs font-semibold text-slate-800">{job.workplaceType}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Job Type</p>
                    <p className="text-xs font-semibold text-slate-800">{job.employmentType}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Seniority</p>
                    <p className="text-xs font-semibold text-slate-800">{job.experienceLevel}</p>
                  </div>
                </div>

                {/* About Role */}
                <div>
                  <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    About the Role
                  </h2>
                  <div 
                    className="job-description-html text-slate-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: job.description }}
                  />
                </div>

                {/* Responsibilities */}
                {job.responsibilities && (
                  <div className="pt-6 border-t border-slate-100">
                    <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                      Key Responsibilities
                    </h2>
                    <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                      {job.responsibilities}
                    </div>
                  </div>
                )}

                {/* Requirements */}
                {job.requirements && (
                  <div className="pt-6 border-t border-slate-100">
                    <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                      Candidate Requirements
                    </h2>
                    <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                      {job.requirements}
                    </div>
                  </div>
                )}

                {/* Skills Section */}
                <div className="pt-6 border-t border-slate-100">
                  <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    Required & Recommended Skills
                  </h2>
                  <div className="flex flex-wrap gap-1.5">
                    {job.skills && job.skills.map((skill, index) => {
                      const isMatched = matchInfo?.matchingSkills?.includes(skill);
                      return (
                        <span 
                          key={index} 
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium border ${
                            isMatched
                              ? 'bg-blue-50 text-blue-800 border-blue-200 font-semibold'
                              : 'bg-slate-50 text-slate-700 border-slate-200'
                          }`}
                        >
                          {isMatched && <CheckCircle2 className="w-3 h-3 text-blue-600" />}
                          {skill}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right (35%): Match Analysis & Role Metadata Side Panel */}
              <div className="space-y-4">
                {matchInfo && <JobMatch match={matchInfo} />}

                {/* Role Summary Specs */}
                <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-3 text-xs">
                  <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2">
                    Role Summary
                  </h3>
                  <div className="space-y-2 text-slate-600">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Company:</span>
                      <span className="font-medium text-slate-800">{job.company}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Location:</span>
                      <span className="font-medium text-slate-800">{job.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Work Model:</span>
                      <span className="font-medium text-slate-800">{job.workplaceType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Job Type:</span>
                      <span className="font-medium text-slate-800">{job.employmentType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Seniority:</span>
                      <span className="font-medium text-slate-800">{job.experienceLevel}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={handleApplyClick}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                    >
                      <span>Apply on official portal</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>

      {showApplyModal && profile && (
        <ApplyConfirmationModal 
          job={job} 
          studentId={profile.id} 
          onClose={() => setShowApplyModal(false)}
          onConfirm={() => {
            setShowApplyModal(false);
            navigate('/applied-jobs');
          }}
        />
      )}

        {/* Sticky Mobile CTA */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 px-3 pt-6 pb-[calc(0.75rem+env(safe-area-inset-bottom))] bg-gradient-to-t from-white via-white/95 to-transparent z-40 flex items-center gap-2">
          <button
            type="button"
            onClick={handleSaveToggle}
            className={`p-2.5 rounded-xl border shrink-0 shadow-sm transition-colors bg-white ${
              isSaved 
                ? 'border-blue-200 text-blue-700' 
                : 'border-slate-200 text-slate-700'
            }`}
          >
            <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-blue-600' : ''}`} />
          </button>
          <button
            type="button"
            onClick={handleApplyClick}
            className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <span>Apply now</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>

      <BottomNav />
    </div>
  );
};
